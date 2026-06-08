"use client"

import { useState } from "react"
import type { ComponentType, SVGProps } from "react"
import Image from "next/image"
import { Controller, useFormContext } from "react-hook-form"
import {
  IconFileDescription,
  IconPhoto,
  IconStack2,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { Typography } from "@/components/ui/typography"
import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload"
import { logistiqueOptions, type SponsorshipDemande1Values } from "../lib/schema"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const PIECE_ICONS: Record<string, IconComponent> = {
  afficheEvenement: IconPhoto,
  dossierSponsoring: IconFileDescription,
  photosPrecedentes: IconStack2,
}

const PIECE_TYPES = [
  { id: "afficheEvenement", label: "Affiche ou visuel de l'événement", accept: "image/*,.pdf", multiple: false },
  { id: "dossierSponsoring", label: "Dossier de sponsoring", accept: ".pdf,.doc,.docx", multiple: false },
  { id: "photosPrecedentes", label: "Photos / vidéos d'éditions précédentes", accept: "image/*,video/*", multiple: true },
] as const

function FileUploadField({
  type,
  onChange,
  invalid,
  error,
}: {
  type: (typeof PIECE_TYPES)[number]
  onChange: (v: File | File[] | null) => void
  invalid: boolean
  error?: string
}) {
  const Icon = PIECE_ICONS[type.id]
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: type.accept,
    multiple: type.multiple,
    onFilesChange: (next) => {
      const realFiles = next.flatMap((f) => (f.file instanceof File ? [f.file] : []))
      if (type.multiple) {
        onChange(realFiles.length > 0 ? realFiles : null)
      } else {
        onChange(realFiles[0] ?? null)
      }
    },
  })

  const hasFiles = files.length > 0

  return (
    <Field data-invalid={invalid}>
      <FieldLabel htmlFor={`file-${type.id}`}>{type.label}</FieldLabel>

      {type.multiple ? (
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2">
            {!hasFiles && <PreviewTile entry={undefined} icon={Icon} />}
            <div className="relative inline-block self-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openFileDialog}
                aria-haspopup="dialog"
              >
                {hasFiles ? "Ajouter des fichiers" : "Téléverser des fichiers"}
              </Button>
              <input
                {...getInputProps({ id: `file-${type.id}` })}
                className="sr-only"
                aria-label={`Téléverser ${type.label}`}
                tabIndex={-1}
              />
            </div>
          </div>

          {hasFiles && (
            <ul className="flex flex-col gap-2">
              {files.map((entry) => (
                <li key={entry.id} className="inline-flex items-center gap-2">
                  <PreviewTile entry={entry} icon={Icon} />
                  <Typography variant="small" className="min-w-0 flex-1 truncate text-xs">
                    {entry.file.name}
                  </Typography>
                  <button
                    type="button"
                    onClick={() => removeFile(entry.id)}
                    className="cursor-pointer text-xs font-medium text-destructive hover:underline"
                    aria-label={`Retirer ${entry.file.name}`}
                  >
                    Retirer
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2">
            <PreviewTile entry={files[0]} icon={Icon} />
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
                {...getInputProps({ id: `file-${type.id}` })}
                className="sr-only"
                aria-label={`Téléverser ${type.label}`}
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
      )}

      {invalid && !!error && <FieldDescription>{error}</FieldDescription>}
    </Field>
  )
}

function PreviewTile({
  entry,
  icon: Icon,
}: {
  entry: FileWithPreview | undefined
  icon?: IconComponent
}) {
  const isImage =
    entry?.preview &&
    entry.file instanceof File &&
    entry.file.type.startsWith("image/")

  return (
    <div
      className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-input bg-muted/30"
      aria-hidden="true"
    >
      {isImage ? (
        <Image
          src={entry!.preview!}
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 36px"
          className="object-cover"
        />
      ) : (
        Icon && <Icon className="size-4 opacity-60" />
      )}
    </div>
  )
}

export function LogistiqueFichiersStep() {
  const { control, setValue } = useFormContext<SponsorshipDemande1Values>()
  const [selectedPieces, setSelectedPieces] = useState<string[]>([])

  const togglePiece = (id: string, checked: boolean) => {
    setSelectedPieces(checked ? [...selectedPieces, id] : selectedPieces.filter((v) => v !== id))
    if (!checked) {
      setValue(id as keyof SponsorshipDemande1Values, null, { shouldDirty: true })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logistique, autorisations & pièces jointes</CardTitle>
        <CardDescription>Précisez les moyens logistiques, autorisations et déposez vos documents.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="logistiqueOptions"
          render={({ field, fieldState }) => {
            const selected = field.value ?? []
            const toggle = (id: string, checked: boolean) => {
              field.onChange(
                checked ? [...selected, id] : selected.filter((v: string) => v !== id)
              )
            }
            return (
              <FieldSet>
                <FieldLegend variant="label">Logistique & autorisations</FieldLegend>
                <FieldDescription>
                  Quelles sont les ressources logistiques que vous pouvez mettre à disposition ?
                </FieldDescription>
                <ul
                  data-invalid={fieldState.invalid}
                  className="flex w-full flex-col divide-y rounded-md border data-[invalid=true]:border-destructive"
                >
                  {logistiqueOptions.map((option) => (
                    <li
                      key={option.id}
                      className="flex items-center justify-between gap-2 px-5 py-3"
                    >
                      <Label htmlFor={option.id} className="min-w-0 flex-1 cursor-pointer">
                        <span className="line-clamp-2">{option.label}</span>
                      </Label>
                      <Checkbox
                        id={option.id}
                        name={field.name}
                        checked={selected.includes(option.id)}
                        onCheckedChange={(checked) => toggle(option.id, checked === true)}
                        aria-invalid={fieldState.invalid}
                        className="mt-0.5 border-primary border-dashed cursor-pointer"
                      />
                    </li>
                  ))}
                </ul>
                {fieldState.invalid && (
                  <FieldDescription className="text-destructive">
                    {fieldState.error?.message}
                  </FieldDescription>
                )}
              </FieldSet>
            )
          }}
        />

        <FieldSet>
          <FieldLegend variant="label">Droit à l&apos;image</FieldLegend>
          <Controller
            control={control}
            name="imageConsent"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id={field.name}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                    aria-invalid={fieldState.invalid}
                    className="mt-1"
                  />
                  <Label htmlFor={field.name} className="font-normal leading-relaxed cursor-pointer">
                    J&apos;autorise Linx Energy Maroc et ses partenaires à capter et diffuser mon image,
                    ma voix et mes contenus UGC sur leurs canaux (Instagram, TikTok, YouTube, etc.)
                    sans contrepartie financière.
                  </Label>
                </div>
                {fieldState.invalid && <FieldDescription className="text-destructive">{fieldState.error?.message}</FieldDescription>}
              </Field>
            )}
          />
        </FieldSet>

        <FieldSet>
          <FieldLegend variant="label">Pièces jointes</FieldLegend>
          <FieldDescription>
            Sélectionnez les types de documents et téléversez les fichiers correspondants.
          </FieldDescription>

          <ul className="flex w-full flex-col divide-y rounded-md border">
            {PIECE_TYPES.map((type) => {
              const Icon = PIECE_ICONS[type.id]
              return (
                <li
                  key={type.id}
                  className="flex items-center justify-between gap-2 px-5 py-3"
                >
                  <Label htmlFor={type.id} className="min-w-0 flex-1 cursor-pointer">
                    <span className="flex min-w-0 items-center gap-2">
                      {Icon && <Icon className="size-4 shrink-0" aria-hidden="true" />}
                      <span className="line-clamp-2">{type.label}</span>
                    </span>
                  </Label>
                  <Checkbox
                    id={type.id}
                    checked={selectedPieces.includes(type.id)}
                    onCheckedChange={(checked) => togglePiece(type.id, checked === true)}
                    className="mt-0.5 border-primary border-dashed cursor-pointer"
                  />
                </li>
              )
            })}
          </ul>

          {selectedPieces.length > 0 && (
            <FieldSet className="gap-4 pt-4">
              <FieldLegend variant="label">Fichiers à téléverser</FieldLegend>
              <FieldGroup className="gap-4">
                {PIECE_TYPES
                  .filter((type) => selectedPieces.includes(type.id))
                  .map((type) => (
                    <Controller
                      key={type.id}
                      control={control}
                      name={type.id as keyof SponsorshipDemande1Values}
                      render={({ field, fieldState }) => (
                        <FileUploadField
                          type={type}
                          onChange={field.onChange}
                          invalid={fieldState.invalid}
                          error={fieldState.error?.message}
                        />
                      )}
                    />
                  ))}
              </FieldGroup>
            </FieldSet>
          )}
        </FieldSet>
      </CardContent>
    </Card>
  )
}
