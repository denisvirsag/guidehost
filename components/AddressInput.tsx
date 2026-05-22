'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2, X, Locate } from 'lucide-react'


// Helper to format Nominatim response into a clean address like "Via Roma 42, Milano"
const formatCleanAddress = (data: any, typedInput?: string): string => {
  if (!data || !data.address) return data?.display_name || ''
  
  const addr = data.address
  
  // Extract street/road
  const street = addr.road || addr.pedestrian || addr.highway || addr.path || addr.square || addr.suburb || ''
  
  // Extract house number
  let houseNumber = addr.house_number || addr.building || ''
  
  // If house number is empty, try to extract it from the display_name
  if (!houseNumber && data.display_name) {
    const parts = data.display_name.split(',').map((p: string) => p.trim())
    // Search the first 3 parts for something that looks like a house number (e.g. "42", "42a", "42/A", "12A")
    const houseNumberRegex = /^\d+[a-zA-Z]?(\/\w+)?$/
    for (let i = 0; i < Math.min(parts.length, 3); i++) {
      if (houseNumberRegex.test(parts[i])) {
        houseNumber = parts[i]
        break
      }
    }
  }

  // If house number is still empty, and typedInput is provided, try to extract it from typedInput
  if (!houseNumber && typedInput && street) {
    const escapedStreet = street.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    const regex = new RegExp(escapedStreet, 'i')
    const match = typedInput.match(regex)
    
    if (match && match.index !== undefined) {
      const afterStreet = typedInput.substring(match.index + match[0].length)
      const houseNumRegex = /^\s*,?\s*(\d+(?:\s*[a-zA-Z])?(?:\/\w+)?)/
      const numMatch = afterStreet.match(houseNumRegex)
      if (numMatch) {
        houseNumber = numMatch[1].trim()
      }
    }
  }
  
  // Extract city/town/village
  const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || ''
  
  if (street && city) {
    return `${street}${houseNumber ? ' ' + houseNumber : ''}, ${city}`
  }
  
  // Fallback to display_name but cleaned up
  if (data.display_name) {
    const parts = data.display_name.split(',').map((p: string) => p.trim())
    // Filter out postcodes, country and province info if redundant
    const cleanParts = parts.filter((part: string) => {
      const isPostcode = /^\d{5}$/.test(part)
      const isCountry = part.toLowerCase() === 'italia'
      return !isPostcode && !isCountry
    })
    
    if (cleanParts.length > 0) {
      return cleanParts.slice(0, 3).join(', ')
    }
    return data.display_name
  }
  
  return ''
}

interface AddressInputProps {
  defaultValue?: string
  onChange?: (value: string) => void
  name?: string
  id?: string
  placeholder?: string
  required?: boolean
}

interface Suggestion {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address?: any
}

export default function AddressInput({
  defaultValue = '',
  onChange,
  name = 'address',
  id = 'address',
  placeholder = 'es. Via Roma 42, Milano',
  required = false,
}: AddressInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Sync state if default value changes
  useEffect(() => {
    setInputValue(defaultValue)
  }, [defaultValue])

  // Handle clicking outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      // Nominatim OpenStreetMap API (free and requires no API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5&addressdetails=1&accept-language=it`,
        {
          headers: {
            'User-Agent': 'GuideHost-Airbnb-Guide-App',
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
        setIsOpen(true)
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setError(null)
    if (onChange) {
      onChange(value)
    }

    // Debounce API requests
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (value.trim().length >= 3) {
      setIsLoading(true)
      debounceTimerRef.current = setTimeout(() => {
        fetchSuggestions(value)
      }, 400)
    } else {
      setSuggestions([])
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    const selectedAddress = formatCleanAddress(suggestion, inputValue)
    setInputValue(selectedAddress)
    setError(null)
    setIsOpen(false)
    setSuggestions([])
    if (onChange) {
      onChange(selectedAddress)
    }
  }

  const handleClear = () => {
    setInputValue('')
    setError(null)
    setIsOpen(false)
    setSuggestions([])
    if (onChange) {
      onChange('')
    }
  }

  const handleGetLocation = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setError('La geolocalizzazione non è supportata dal tuo browser.')
      return
    }

    setIsLocating(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=it`,
            {
              headers: {
                'User-Agent': 'GuideHost-Airbnb-Guide-App',
              },
            }
          )
          if (response.ok) {
            const data = await response.json()
            const formattedAddress = formatCleanAddress(data)
            if (formattedAddress) {
              setInputValue(formattedAddress)
              setError(null)
              if (onChange) {
                onChange(formattedAddress)
              }
            } else {
              setError('Impossibile trovare un indirizzo per la tua posizione.')
            }
          } else {
            setError('Errore durante il rilevamento dell\'indirizzo.')
          }
        } catch (err) {
          console.error('Error reverse geocoding:', err)
          setError('Errore di rete durante il rilevamento dell\'indirizzo.')
        } finally {
          setIsLocating(false)
        }
      },
      (err) => {
        console.error('Geolocation error:', err)
        let message = 'Impossibile accedere alla tua posizione.'
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Accesso alla posizione negato dal browser.'
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          message = 'Informazioni sulla posizione non disponibili.'
        } else if (err.code === err.TIMEOUT) {
          message = 'Tempo scaduto nel rilevare la posizione.'
        }
        setError(message)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }


  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={id}
          name={name}
          type="text"
          className="input"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          style={{ paddingRight: '4.5rem' }}
        />
        
        <div style={{ position: 'absolute', right: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem', zIndex: 10 }}>
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
          ) : isLocating ? (
            <Loader2 size={16} className="animate-spin" style={{ color: 'var(--brand)' }} />
          ) : (
            <>
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Cancella"
                  aria-label="Cancella indirizzo"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.125rem',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-input)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <X size={14} />
                </button>
              )}
              
              <button
                type="button"
                onClick={handleGetLocation}
                title="Rileva posizione attuale"
                aria-label="Usa posizione attuale"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.125rem',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--brand-light)'
                  e.currentTarget.style.color = 'var(--brand)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                <Locate size={15} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Geolocation Error Message */}
      {error && (
        <div className="field-error" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.375rem' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 1000,
            maxHeight: '220px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                handleSelectSuggestion(item)
              }}
              onClick={(e) => {
                e.preventDefault()
                handleSelectSuggestion(item)
              }}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.625rem 0.875rem',
                background: 'none',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.625rem',
                color: 'var(--text-primary)',
                fontSize: '0.8125rem',
                lineHeight: '1.4',
                transition: 'background 0.1s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-input)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <MapPin
                size={14}
                style={{ color: 'var(--brand)', marginTop: '0.125rem', flexShrink: 0 }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {formatCleanAddress(item, inputValue)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
