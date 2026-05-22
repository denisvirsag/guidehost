import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    + '-' + Math.random().toString(36).slice(2, 7)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Oggi'
  if (diffDays === 1) return 'Ieri'
  if (diffDays < 7) return `${diffDays} giorni fa`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} settimane fa`
  return formatDate(date)
}

export function getSectionIcon(type: string): string {
  const icons: Record<string, string> = {
    welcome: '👋',
    wifi: '📶',
    checkin: '🔑',
    rules: '📋',
    how_to: '⚙️',
    map: '📍',
    recommendations: '⭐',
    emergency: '🚨',
    faq: '❓',
    gallery: '🖼️',
    checkout_checklist: '✅',
    custom: '📝',
  }
  return icons[type] ?? '📄'
}

export function getSectionLabel(type: string): string {
  const labels: Record<string, string> = {
    welcome: 'Benvenuto',
    wifi: 'Wi-Fi',
    checkin: 'Check-in / Check-out',
    rules: 'Regole della casa',
    how_to: 'Come funziona...',
    map: 'Mappa e dintorni',
    recommendations: 'Consigli locali',
    emergency: 'Contatti di emergenza',
    faq: 'Domande frequenti',
    gallery: 'Galleria foto',
    checkout_checklist: 'Checklist partenza',
    custom: 'Sezione personalizzata',
  }
  return labels[type] ?? type
}
