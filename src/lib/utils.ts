import { format, isThisWeek, isPast } from 'date-fns'

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d · h:mm a')
}

export function formatTime(dateStr: string): string {
  return format(new Date(dateStr), 'h:mm a')
}

export function isInterviewThisWeek(dateStr: string): boolean {
  return isThisWeek(new Date(dateStr), { weekStartsOn: 1 })
}

export function isInPast(dateStr: string): boolean {
  return isPast(new Date(dateStr))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}
