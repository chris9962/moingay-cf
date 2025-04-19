"use client"

import { useEffect, useRef } from "react"

interface CKEditorProps {
  value: string
  onChange: (data: string) => void
  placeholder?: string
}

export default function CKEditor({ value, onChange, placeholder }: CKEditorProps) {
  const editorRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let CKEditor5: any

    const loadEditor = async () => {
      try {
        // Dynamically import CKEditor - import the default export
        const ClassicEditor = await import("@ckeditor/ckeditor5-build-classic").then((module) => module.default)

        if (!containerRef.current) return
        if (!ClassicEditor) {
          console.error("CKEditor could not be loaded")
          return
        }

        // Initialize the editor
        const editor = await ClassicEditor.create(containerRef.current, {
          placeholder: placeholder || "Type your content here...",
          toolbar: ["heading", "|", "bold", "italic", "link", "bulletedList", "numberedList", "|", "undo", "redo"],
          initialData: value,
        })

        // Store the editor instance
        editorRef.current = editor

        // Set up the event listener
        editor.model.document.on("change:data", () => {
          const data = editor.getData()
          onChange(data)
        })
      } catch (error) {
        console.error("Error initializing CKEditor:", error)
      }
    }

    loadEditor()

    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current
          .destroy()
          .then(() => {
            editorRef.current = null
          })
          .catch((error: any) => {
            console.error("Error destroying CKEditor instance:", error)
          })
      }
    }
  }, [value, onChange, placeholder])

  return <div ref={containerRef} className="min-h-[200px] border border-gray-300 rounded-md" />
}
