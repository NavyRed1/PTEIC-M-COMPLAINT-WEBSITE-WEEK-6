import { Search } from 'lucide-react'

interface Props {
  value: string
  onChange: (v: string) => void
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ethereal-400"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title, description, or location..."
        className="input-field pl-10"
        aria-label="Search reports"
      />
    </div>
  )
}
