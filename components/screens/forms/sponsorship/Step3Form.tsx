"use client"

import { useState, useMemo, useCallback } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import formOptions from "@/data/form-options.json"
import { type ContentFiles, type Step5FormProps } from "@/types/sponsorship-form"
import { Typography } from "@/components/ui/typography"

export function Step3Form({ selectedContentTypes: initialTypes, files: initialFiles, onChange }: Step5FormProps) {
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(initialTypes || [])
  const [files, setFiles] = useState<ContentFiles>(initialFiles || {})

  const handleCheckboxChange = useCallback((typeId: string, checked: boolean) => {
    const newTypes = checked
      ? [...selectedContentTypes, typeId]
      : selectedContentTypes.filter((id) => id !== typeId)
    
    setSelectedContentTypes(newTypes)
    
    const newFiles = { ...files }
    if (!checked) {
      delete newFiles[typeId]
    }
    setFiles(newFiles)
    
    onChange?.({ selectedContentTypes: newTypes, files: newFiles })
  }, [selectedContentTypes, files, onChange])

  const handleFileChange = useCallback((typeId: string, fileOrFiles: File | File[] | null) => {
    const newFiles = { ...files, [typeId]: fileOrFiles }
    setFiles(newFiles)
    onChange?.({ selectedContentTypes, files: newFiles })
  }, [selectedContentTypes, files, onChange])

  const filePreviews = useMemo(() => {
    return formOptions.contentTypes.map((type) => {
      const file = files[type.id]
      if (!file) return null
      if (Array.isArray(file)) {
        return file.length > 0 ? file.map((f) => f.name).join(", ") : null
      }
      return file.name
    }).filter(Boolean)
  }, [files])

  const getAcceptedTypes = (typeId: string): string => {
    switch (typeId) {
      case "photos": return "image/*"
      case "video": return "video/*"
      case "affiche": return "image/*,.pdf"
      case "dossier": return ".pdf,.doc,.docx"
      default: return "*"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Types de contenus proposés</CardTitle>
        <CardDescription>
          Sélectionnez les types de contenus et téléversez les fichiers correspondants
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formOptions.contentTypes.map((type) => (
            <div key={type.id} className="flex items-center gap-2">
              <Checkbox
                id={type.id}
                checked={selectedContentTypes.includes(type.id)}
                onCheckedChange={(checked) => handleCheckboxChange(type.id, checked as boolean)}
              />
              <Label htmlFor={type.id}>{type.label}</Label>
            </div>
          ))}
        </div>

        {selectedContentTypes.length > 0 && (
          <div className="space-y-4">
            <Label>Fichiers à téléverser</Label>
            {formOptions.contentTypes.filter((type) => selectedContentTypes.includes(type.id)).map((type) => (
              <div key={type.id} className="space-y-2">
                <Label htmlFor={`file-${type.id}`}>{type.label}</Label>
                <Input
                  id={`file-${type.id}`}
                  type="file"
                  accept={getAcceptedTypes(type.id)}
                  multiple={type.id === "photos"}
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement
                    if (type.id === "photos") {
                      const filesArray = target.files ? Array.from(target.files) : null
                      handleFileChange(type.id, filesArray)
                    } else {
                      handleFileChange(type.id, target.files?.[0] || null)
                    }
                  }}
                />
              {files[type.id] && (
                <Typography variant="p" className="text-sm">
                  {Array.isArray(files[type.id])
                    ? `${(files[type.id] as File[]).length} fichier(s) sélectionné(s)`
                    : `Fichier sélectionné: ${(files[type.id] as File).name}`}
                </Typography>
              )}
              </div>
            ))}
          </div>
        )}

        {filePreviews.length > 0 && (
          <div className="space-y-2">
            <Label>Aperçu des fichiers</Label>
            <ul className="text-sm text-muted-foreground space-y-1">
              {filePreviews.map((preview, index) => (
                <li key={index}>{preview}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}