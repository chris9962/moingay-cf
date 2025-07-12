"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const SUGGEST_NOTES = ["Đá chung", "Đá riêng", "Nguyên vị", "Giảm ngọt"];

export default function NoteInput({
  value,
  onChange,
  placeholder = "Ghi chú đặc biệt (nếu có)",
  label = "Ghi chú cho quán",
}: NoteInputProps) {
  const addSuggestNote = (note: string) => {
    const newNote = value ? `${value}, ${note}` : note;
    onChange(newNote);
  };

  return (
    <div>
      <Label htmlFor="note">{label}</Label>
      <Textarea
        id="note"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1"
        rows={3}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {SUGGEST_NOTES.map((note) => (
          <button
            key={note}
            onClick={() => addSuggestNote(note)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            {note}
          </button>
        ))}
      </div>
    </div>
  );
}
