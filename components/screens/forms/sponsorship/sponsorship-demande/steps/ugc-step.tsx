"use client"

import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import {
  IconPlus,
  IconX,
} from "@tabler/icons-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ugcContentOptions,
  REQUIRED_AMBASSADEURS,
  MAX_AMBASSADEURS,
  type SponsorshipDemande1Values,
} from "../lib/schema"

export function UgcStep() {
  const { control, watch } = useFormContext<SponsorshipDemande1Values>()
  const hasInfluencers = watch("hasInfluencers")
  const { fields: infFields, append: infAppend, remove: infRemove } = useFieldArray({ control, name: "influencers" })
  const { fields: ambFields, append: ambAppend } = useFieldArray({ control, name: "ambassadeurs" })

  return (
    <Card>
      <CardHeader>
        <CardTitle>UGC / Influenceurs</CardTitle>
        <CardDescription>Gérez les créateurs de contenu et influenceurs pour votre événement.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="hasInfluencers"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Avez-vous des créateurs UGC ou influenceurs ?
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

        {hasInfluencers === "yes" && (
          <FieldSet>
            <FieldLegend variant="label">Détails des créateurs UGC / influenceurs</FieldLegend>
            <FieldGroup className="gap-6">
              {infFields.map((field, index) => {
                return (
                  <Card key={field.id} className="relative">
                    <CardHeader className="flex flex-row items-center justify-between py-3">
                      <CardTitle className="text-sm">
                        Influenceur {index + 1}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => infRemove(index)}
                        aria-label={`Supprimer l'influenceur ${index + 1}`}
                      >
                        <IconX className="size-4" />
                      </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Controller
                        control={control}
                        name={`influencers.${index}.nom` as const}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={f.name}>Nom complet</FieldLabel>
                            <Input
                              {...f}
                              id={f.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="Nom et prénom"
                            />
                            {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                          </Field>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`influencers.${index}.nbAbonnes` as const}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={f.name}>Nombre d&apos;abonnés</FieldLabel>
                            <Input
                              {...f}
                              id={f.name}
                              type="number"
                              min={0}
                              aria-invalid={fieldState.invalid}
                              placeholder="Ex: 10000"
                              value={f.value as number}
                              onChange={(e) => f.onChange(e.target.valueAsNumber)}
                            />
                            {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                          </Field>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`influencers.${index}.instagram` as const}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={f.name}>Instagram</FieldLabel>
                            <Input
                              {...f}
                              id={f.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="https://instagram.com/..."
                            />
                            {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                          </Field>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`influencers.${index}.tiktok` as const}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={f.name}>TikTok</FieldLabel>
                            <Input
                              {...f}
                              id={f.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="https://tiktok.com/@..."
                            />
                            {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                          </Field>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`influencers.${index}.typeContenu` as const}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={f.name}>Type de contenu</FieldLabel>
                            <Input
                              {...f}
                              id={f.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="Ex: Tutoriel, humour, musique…"
                            />
                            {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                          </Field>
                        )}
                      />
                      <Controller
                        control={control}
                        name={`influencers.${index}.disponibleTournage` as const}
                        render={({ field: f, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <div className="flex items-start gap-3 pt-5">
                              <Checkbox
                                id={f.name}
                                checked={f.value}
                                onCheckedChange={(checked) => f.onChange(checked === true)}
                                aria-invalid={fieldState.invalid}
                              />
                              <Label htmlFor={f.name} className="font-normal leading-relaxed cursor-pointer">
                                Disponible pour tournage
                              </Label>
                            </div>
                            {fieldState.invalid && <FieldDescription>{fieldState.error?.message}</FieldDescription>}
                          </Field>
                        )}
                      />
                    </CardContent>
                  </Card>
                )
              })}
            </FieldGroup>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() =>
                infAppend({
                  nom: "",
                  instagram: "",
                  tiktok: "",
                  nbAbonnes: 0,
                  typeContenu: "",
                  disponibleTournage: false,
                })
              }
              className="self-start"
            >
              <IconPlus data-icon="inline-start" />
              Ajouter un influenceur
            </Button>
          </FieldSet>
        )}

        <FieldSet>
          <FieldLegend variant="label">Types de contenus UGC proposés</FieldLegend>
          <Controller
            control={control}
            name="ugcContentTypes"
            render={({ field, fieldState }) => {
              const selected = field.value ?? []
              const toggle = (id: string, checked: boolean) => {
                field.onChange(
                  checked ? [...selected, id] : selected.filter((v: string) => v !== id)
                )
              }
              return (
                <>
                  <FieldDescription>
                    Sélectionnez au moins un type de contenu.
                  </FieldDescription>
                  <ul
                    data-invalid={fieldState.invalid}
                    className="flex w-full flex-col divide-y rounded-md border data-[invalid=true]:border-destructive"
                  >
                    {ugcContentOptions.map((option) => (
                      <li
                        key={option.id}
                        className="flex items-center justify-between gap-2 px-5 py-3"
                      >
                        <Label htmlFor={option.id} className="min-w-0 flex-1 cursor-pointer">
                          <span className="flex min-w-0 items-center gap-2">
                            <span className="line-clamp-2">{option.label}</span>
                          </span>
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
                </>
              )
            }}
          />
        </FieldSet>

        <Controller
          control={control}
          name="confirmInfluencers"
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
                  Je confirme avoir des CRÉATEURS UGC / INFLUENCEURS
                </Label>
              </div>
              {fieldState.invalid && <FieldDescription className="text-destructive">{fieldState.error?.message}</FieldDescription>}
            </Field>
          )}
        />

        <FieldSet className="gap-4">
          <FieldLegend variant="label">Ambassadeurs</FieldLegend>
          <FieldDescription>
            Les {REQUIRED_AMBASSADEURS} premiers liens sont obligatoires. Vous pouvez en
            ajouter jusqu&apos;à {MAX_AMBASSADEURS}.
          </FieldDescription>
          <FieldGroup className="gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambFields.map((field, index) => {
                const required = index < REQUIRED_AMBASSADEURS
                return (
                  <Controller
                    key={field.id}
                    name={`ambassadeurs.${index}.url` as const}
                    control={control}
                    render={({ field: controllerField, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel
                          htmlFor={`ambassadeur-${index + 1}`}
                          className="sr-only"
                        >
                          Lien ambassadeur n°{index + 1}
                        </FieldLabel>
                        <Input
                          {...controllerField}
                          id={`ambassadeur-${index + 1}`}
                          type="url"
                          aria-invalid={fieldState.invalid}
                          placeholder={`Ambassadeur n°${index + 1}${required ? "" : " (optionnel)"
                          }`}
                        />
                        {fieldState.invalid && (
                          <FieldDescription>{fieldState.error?.message}</FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                )
              })}
            </div>
            {ambFields.length < MAX_AMBASSADEURS && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => ambAppend({ url: "" })}
                className="self-start"
              >
                Ajouter plus
              </Button>
            )}
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
