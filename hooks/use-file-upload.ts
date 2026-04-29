"use client"

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  type Ref,
} from "react"

export type FileMetadata = {
  name: string
  size: number
  type: string
  url: string
  id: string
}

export type FileWithPreview = {
  file: File | FileMetadata
  id: string
  preview?: string
}

export type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  initialFiles?: FileMetadata[]
  onFilesChange?: (files: FileWithPreview[]) => void
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void
  onError?: (errors: string[]) => void
}

export type FileUploadState = {
  files: FileWithPreview[]
  isDragging: boolean
  errors: string[]
}

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  clearErrors: () => void
  handleDragEnter: (e: DragEvent<HTMLElement>) => void
  handleDragLeave: (e: DragEvent<HTMLElement>) => void
  handleDragOver: (e: DragEvent<HTMLElement>) => void
  handleDrop: (e: DragEvent<HTMLElement>) => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  openFileDialog: () => void
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & { ref: Ref<HTMLInputElement> }
}

function isRevocableImage(entry: FileWithPreview): boolean {
  return Boolean(
    entry.preview &&
      entry.file instanceof File &&
      entry.file.type.startsWith("image/")
  )
}

function createPreview(file: File | FileMetadata): string | undefined {
  return file instanceof File ? URL.createObjectURL(file) : file.url
}

function generateId(file: File | FileMetadata): string {
  if (!(file instanceof File)) return file.id
  return `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function matchesAccept(file: File | FileMetadata, accept: string): boolean {
  if (accept === "*") return true
  const fileType = file.type || ""
  const extension = `.${file.name.split(".").pop()}`.toLowerCase()

  return accept.split(",").some((raw) => {
    const type = raw.trim()
    if (type.startsWith(".")) return extension === type.toLowerCase()
    if (type.endsWith("/*")) return fileType.startsWith(`${type.split("/")[0]}/`)
    return fileType === type
  })
}

function validate(
  file: File | FileMetadata,
  accept: string,
  maxSize: number
): string | null {
  if (file.size > maxSize) {
    return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
  }
  if (!matchesAccept(file, accept)) {
    return `File "${file.name}" is not an accepted file type.`
  }
  return null
}

export function useFileUpload(
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] {
  const {
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = Number.POSITIVE_INFINITY,
    accept = "*",
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
    onError,
  } = options

  const [state, setState] = useState<FileUploadState>(() => ({
    files: initialFiles.map((file) => ({
      file,
      id: file.id,
      preview: file.url,
    })),
    isDragging: false,
    errors: [],
  }))

  const inputRef = useRef<HTMLInputElement>(null)

  // Ref-backed latest state — avoids stale closures without putting
  // state.files in dependency arrays. Synced in an Effect so we never write
  // to a ref during render.
  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Stash external callbacks in a ref so returned actions stay referentially
  // stable even when consumers pass new callback identities.
  const callbacksRef = useRef({ onFilesChange, onFilesAdded, onError })
  useEffect(() => {
    callbacksRef.current = { onFilesChange, onFilesAdded, onError }
  })

  // Revoke all outstanding object URLs on unmount — external system, so
  // Effect is the right tool (react-useeffect: synchronizing with browser API).
  useEffect(() => {
    return () => {
      for (const entry of stateRef.current.files) {
        if (isRevocableImage(entry)) URL.revokeObjectURL(entry.preview!)
      }
    }
  }, [])

  const clearFiles = () => {
    const prev = stateRef.current.files
    for (const entry of prev) {
      if (isRevocableImage(entry)) URL.revokeObjectURL(entry.preview!)
    }
    if (inputRef.current) inputRef.current.value = ""
    setState((s) => ({ ...s, files: [], errors: [] }))
    callbacksRef.current.onFilesChange?.([])
  }

  const addFiles = (incoming: FileList | File[]) => {
    const newFiles = Array.from(incoming)
    if (newFiles.length === 0) return

    const current = stateRef.current
    let baseFiles = current.files

    // Single-file mode: drop the existing file (revoke its URL first).
    if (!multiple && baseFiles.length > 0) {
      for (const entry of baseFiles) {
        if (isRevocableImage(entry)) URL.revokeObjectURL(entry.preview!)
      }
      baseFiles = []
    }

    // Cap check — only applies in multiple mode.
    if (
      multiple &&
      maxFiles !== Number.POSITIVE_INFINITY &&
      baseFiles.length + newFiles.length > maxFiles
    ) {
      const errors = [`You can only upload a maximum of ${maxFiles} files.`]
      setState((s) => ({ ...s, errors }))
      callbacksRef.current.onError?.(errors)
      return
    }

    const errors: string[] = []
    const validFiles: FileWithPreview[] = []

    for (const file of newFiles) {
      if (multiple) {
        const isDuplicate = baseFiles.some(
          (e) => e.file.name === file.name && e.file.size === file.size
        )
        if (isDuplicate) continue
      }

      const error = validate(file, accept, maxSize)
      if (error) {
        errors.push(error)
        continue
      }

      validFiles.push({
        file,
        id: generateId(file),
        preview: createPreview(file),
      })
    }

    if (inputRef.current) inputRef.current.value = ""

    if (validFiles.length === 0) {
      if (errors.length > 0) {
        setState((s) => ({ ...s, errors }))
        callbacksRef.current.onError?.(errors)
      }
      return
    }

    const nextFiles = multiple ? [...baseFiles, ...validFiles] : validFiles
    setState((s) => ({ ...s, files: nextFiles, errors }))
    callbacksRef.current.onFilesAdded?.(validFiles)
    callbacksRef.current.onFilesChange?.(nextFiles)
    if (errors.length > 0) callbacksRef.current.onError?.(errors)
  }

  const removeFile = (id: string) => {
    const target = stateRef.current.files.find((f) => f.id === id)
    if (!target) return
    if (isRevocableImage(target)) URL.revokeObjectURL(target.preview!)

    const nextFiles = stateRef.current.files.filter((f) => f.id !== id)
    setState((s) => ({ ...s, files: nextFiles, errors: [] }))
    callbacksRef.current.onFilesChange?.(nextFiles)
  }

  const clearErrors = () => {
    setState((s) => (s.errors.length === 0 ? s : { ...s, errors: [] }))
  }

  const handleDragEnter = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((s) => (s.isDragging ? s : { ...s, isDragging: true }))
  }

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setState((s) => (s.isDragging ? { ...s, isDragging: false } : s))
  }

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setState((s) => (s.isDragging ? { ...s, isDragging: false } : s))

    if (inputRef.current?.disabled) return
    const dropped = e.dataTransfer.files
    if (!dropped || dropped.length === 0) return
    addFiles(multiple ? dropped : [dropped[0]])
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) addFiles(e.target.files)
  }

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  const getInputProps = (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
    ...props,
    type: "file" as const,
    onChange: handleFileChange,
    accept: props.accept ?? accept,
    multiple: props.multiple ?? multiple,
    ref: inputRef,
  })

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      clearErrors,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      handleFileChange,
      openFileDialog,
      getInputProps,
    },
  ]
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = Math.max(decimals, 0)
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`
}
