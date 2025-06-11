"use client"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex gap-2 items-center">
      <div
        className="w-10 h-10 rounded-md border cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => {
          const input = document.createElement("input")
          input.type = "color"
          input.value = color
          input.addEventListener("input", (e) => {
            onChange((e.target as HTMLInputElement).value)
          })
          input.click()
        }}
      />
      <Input type="text" value={color} onChange={(e) => onChange(e.target.value)} className="font-mono" />
    </div>
  )
}
