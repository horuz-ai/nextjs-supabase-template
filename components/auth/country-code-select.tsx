"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Country {
  code: string
  flag: string
  name: string
  dialCode: string
}

const countries: Country[] = [
  { code: "PR", flag: "🇵🇷", name: "Puerto Rico", dialCode: "+1" },
  { code: "US", flag: "🇺🇸", name: "United States", dialCode: "+1" },
]

interface CountryCodeSelectProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function CountryCodeSelect({ value, onChange, disabled }: CountryCodeSelectProps) {
  const selectedCountry = countries.find(c => c.code === value) || countries[0]

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className="w-[100px]">
        <SelectValue>
          <span className="flex items-center gap-2">
            <span>{selectedCountry.flag}</span>
            <span>{selectedCountry.dialCode}</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span>{country.dialCode}</span>
              <span className="text-muted-foreground text-sm">{country.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}