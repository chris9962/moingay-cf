"use client";
export default function RichTextEditor({ value, onChange }: any) {
  return (
    <textarea
      className="w-full h-full border-2 border-gray-300 rounded-md p-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
