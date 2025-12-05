"use client"

import * as React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface DateSelectProps {
  value?: string // YYYY-MM-DD format
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function DateSelect({ value, onChange, disabled, className }: DateSelectProps) {
  const [day, setDay] = React.useState<string>("")
  const [month, setMonth] = React.useState<string>("")
  const [year, setYear] = React.useState<string>("")

  // Parse initial value
  React.useEffect(() => {
    if (value && value.trim() !== "") {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        setDay(date.getDate().toString().padStart(2, "0"))
        setMonth((date.getMonth() + 1).toString().padStart(2, "0"))
        setYear(date.getFullYear().toString())
      } else {
        setDay("")
        setMonth("")
        setYear("")
      }
    } else {
      setDay("")
      setMonth("")
      setYear("")
    }
  }, [value])

  // Generate options
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, "0"))
  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())

  const handleDayChange = (newDay: string) => {
    setDay(newDay)
    if (newDay && month && year) {
      const dateStr = `${year}-${month}-${newDay}`
      onChange(dateStr)
    } else if (!newDay) {
      onChange("")
    }
  }

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth)
    if (day && newMonth && year) {
      const dateStr = `${year}-${newMonth}-${day}`
      onChange(dateStr)
    } else if (!newMonth) {
      onChange("")
    }
  }

  const handleYearChange = (newYear: string) => {
    setYear(newYear)
    if (day && month && newYear) {
      const dateStr = `${newYear}-${month}-${day}`
      onChange(dateStr)
    } else if (!newYear) {
      onChange("")
    }
  }

  return (
    <div className={cn("grid grid-cols-3 gap-2", className)}>
      <Select value={day} onValueChange={handleDayChange} disabled={disabled}>
        <SelectTrigger className="h-10 bg-background/50 text-sm">
          <SelectValue placeholder="Dia" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={month} onValueChange={handleMonthChange} disabled={disabled}>
        <SelectTrigger className="h-10 bg-background/50 text-sm">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={handleYearChange} disabled={disabled}>
        <SelectTrigger className="h-10 bg-background/50 text-sm">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

