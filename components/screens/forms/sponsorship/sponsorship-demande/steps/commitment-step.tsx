"use client"

import { Controller, useFormContext } from "react-hook-form"
import { IconStack2 } from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { useFileUpload } from "@/hooks/use-file-upload"
import type { SponsorshipDemande1Values } from "../lib/schema"

function CachetUpload({
  value,
  onChange,
}: {
  value: File | null | undefined
  onChange: (v: File | null) => void
}) {
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: "image/*,.pdf",
    multiple: false,
    onFilesChange: (next) => {
      const realFiles = next.flatMap((f) => (f.file instanceof File ? [f.file] : []))
      onChange(realFiles[0] ?? null)
    },
  })

  const hasFiles = files.length > 0

  return (
    <div className="flex flex-col gap-2">
      <div className="inline-flex items-center gap-2">
        <div
          className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-muted/30"
          aria-hidden="true"
        >
          <IconStack2 className="size-4 opacity-60" />
        </div>
        <div className="relative inline-block">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            aria-haspopup="dialog"
          >
            {hasFiles ? "Changer" : "Téléverser"}
          </Button>
          <input
            {...getInputProps({ id: "file-cachet" })}
            className="sr-only"
            aria-label="Téléverser le cachet"
            tabIndex={-1}
          />
        </div>
      </div>
      {hasFiles && (
        <div className="inline-flex gap-2 text-xs">
          <Typography variant="small" aria-live="polite" className="truncate">
            {files[0].file.name}
          </Typography>
          <button
            type="button"
            onClick={() => removeFile(files[0].id)}
            className="cursor-pointer font-medium text-destructive hover:underline"
            aria-label={`Retirer ${files[0].file.name}`}
          >
            Retirer
          </button>
        </div>
      )}
    </div>
  )
}

export function CommitmentStep() {
  const { control } = useFormContext<SponsorshipDemande1Values>()

  const today = new Date().toISOString().slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signature et engagement</CardTitle>
        <CardDescription>Finalisez votre demande en confirmant les informations et en signant.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldSet>
          <Controller
            control={control}
            name="premiereCollaboration"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Est-ce votre première collaboration avec LinxOS ?
                </FieldLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger id={field.name} aria-invalid={fieldState.invalid}>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Oui</SelectItem>
                    <SelectItem value="no">Non</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="commentaire"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Commentaire</FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Ajoutez un commentaire si nécessaire…"
                />
                {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
              </Field>
            )}
          />
        </FieldSet>

        <Typography>
          En signant ce formulaire, vous vous engagez à respecter les conditions de
          collaboration définies avec LinxOS.
        </Typography>

        <FieldSet>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              control={control}
              name="signataireNom"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nom et signature</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Nom complet du signataire"
                  />
                  {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />
            <Controller
              control={control}
              name="signatureDate"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="date"
                    max={today}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                </Field>
              )}
            />
          </div>

          <Controller
            control={control}
            name="cachet"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="file-cachet">
                  Cachet de l&apos;établissement (si applicable)
                </FieldLabel>
                <CachetUpload value={field.value} onChange={field.onChange} />
                {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
              </Field>
            )}
          />
        </FieldSet>
      </CardContent>
    </Card>
  )
}
