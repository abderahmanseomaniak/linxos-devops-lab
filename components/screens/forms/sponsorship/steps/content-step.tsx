"use client"

import type { ComponentType, SVGProps } from "react"
import { Controller, useFormContext } from "react-hook-form"
import {
  IconFileDescription,
  IconPhoto,
  IconPhotoFilled,
  IconVideo,
} from "@tabler/icons-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import formOptions from "@/data/form-options.json"
import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload"
import { type SponsorshipFormValues } from "@/components/screens/forms/sponsorship/lib/schema"
import { type ContentTypeOption } from "@/types/sponsorship-form"

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>

const CONTENT_TYPE_ICONS: Record<string, IconComponent> = {
  affiche: IconPhoto,
  dossier: IconFileDescription,
  photos: IconPhotoFilled,
  video: IconVideo,
}

const contentTypes = formOptions.contentTypes as ContentTypeOption[]

export function ContentStep() {
  const { control, setValue } = useFormContext<SponsorshipFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Types de contenus proposés</CardTitle>
        <CardDescription>
          Sélectionnez les types de contenus et téléversez les fichiers correspondants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          name="selectedContentTypes"
          control={control}
          render={({ field, fieldState }) => {
            const selected = field.value ?? []
            const toggle = (typeId: string, checked: boolean) => {
              const next = checked
                ? [...selected, typeId]
                : selected.filter((id) => id !== typeId)
              field.onChange(next)
              if (!checked) {
                setValue(`files.${typeId}`, null, { shouldDirty: true })
              }
            }

            return (
              <FieldSet>
                <FieldLegend variant="label">Types de contenus</FieldLegend>
                <FieldDescription>
                  Sélectionnez au moins un type de contenu.
                </FieldDescription>

                <ul
                  data-invalid={fieldState.invalid}
                  className="flex w-full flex-col divide-y rounded-md border data-[invalid=true]:border-destructive"
                >
                  {contentTypes.map((type) => {
                    const Icon = CONTENT_TYPE_ICONS[type.id]
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
                          name={field.name}
                          checked={selected.includes(type.id)}
                          onCheckedChange={(v) => toggle(type.id, v === true)}
                          aria-invalid={fieldState.invalid}
                          className="mt-0.5 border-primary border-dashed cursor-pointer"
                        />
                      </li>
                    )
                  })}
                </ul>

                {fieldState.invalid && (
                  <FieldDescription className="text-destructive">
                    {fieldState.error?.message}
                  </FieldDescription>
                )}

                {selected.length > 0 && (
                  <FieldSet className="gap-4 pt-4">
                    <FieldLegend variant="label">Fichiers à téléverser</FieldLegend>
                    <FieldGroup className="gap-4">
                      {contentTypes
                        .filter((type) => selected.includes(type.id))
                        .map((type) => (
                          <FileSlot key={type.id} type={type} />
                        ))}
                    </FieldGroup>
                  </FieldSet>
                )}
              </FieldSet>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

function FileSlot({ type }: { type: ContentTypeOption }) {
  const { control } = useFormContext<SponsorshipFormValues>()
  return (
    <Controller
      control={control}
      name={`files.${type.id}` as const}
      render={({ field, fieldState }) => (
        <FileUploadField
          type={type}
          onChange={field.onChange}
          invalid={fieldState.invalid}
          error={fieldState.error?.message}
        />
      )}
    />
  )
}

type FileUploadFieldProps = {
  type: ContentTypeOption
  onChange: (value: File | File[] | null) => void
  invalid: boolean
  error?: string
}

function FileUploadField({ type, onChange, invalid, error }: FileUploadFieldProps) {
  const Icon = CONTENT_TYPE_ICONS[type.id]

  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: type.accept,
    multiple: type.multiple,
    onFilesChange: (next) => {
      const realFiles = next
        .map((f) => f.file)
        .filter((f): f is File => f instanceof File)
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

          {hasFiles ? (
            <ul className="flex flex-col gap-2">
              {files.map((entry) => (
                <li
                  key={entry.id}
                  className="inline-flex items-center gap-2"
                >
                  <PreviewTile entry={entry} icon={Icon} />
                  <Typography
                    variant="small"
                    className="min-w-0 flex-1 truncate text-xs"
                  >
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
          ) : (
            <Typography variant="small" className="text-muted-foreground">
              Aucun fichier
            </Typography>
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

          {hasFiles ? (
            <div className="inline-flex gap-2 text-xs">
              <Typography
                variant="small"
                aria-live="polite"
                className="truncate"
              >
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
          ) : (
            <Typography variant="small" className="text-muted-foreground">
              Aucun fichier
            </Typography>
          )}
        </div>
      )}

      {invalid && error && <FieldDescription>{error}</FieldDescription>}
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.preview}
          alt=""
          className="size-full object-cover"
        />
      ) : (
        Icon && <Icon className="size-4 opacity-60" />
      )}
    </div>
  )
}
