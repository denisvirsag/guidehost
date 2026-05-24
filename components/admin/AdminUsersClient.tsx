'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Mail,
  Calendar,
  Filter,
  UserCheck,
  UserX,
  Crown,
  Sparkles,
  ArrowUpDown,
  Clock,
  Users,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdminUser } from '@/app/actions/admin'

interface AdminUsersClientProps {
  initialUsers: AdminUser[]
}

type SortField = 'name' | 'email' | 'createdAt' | 'lastSignInAt'
type SortOrder = 'asc' | 'desc'

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro' | 'business'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'unconfirmed'>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Calculate statistics
  const totalCount = users.length
  const activeSubscribersCount = users.filter((u) => u.plan.toLowerCase() === 'pro' || u.plan.toLowerCase() === 'business').length
  const confirmedCount = users.filter((u) => u.confirmed).length

  // Helper to format date without hydration mismatch
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    if (!isMounted) return dateStr.substring(0, 10) // Fallback during hydration
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (e) {
      return dateStr.substring(0, 10)
    }
  }

  // Helper to format date with time
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-'
    if (!isMounted) return dateStr.substring(0, 16).replace('T', ' ')
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString('it-IT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (e) {
      return dateStr.substring(0, 16).replace('T', ' ')
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesPlan =
        planFilter === 'all' || user.plan.toLowerCase() === planFilter

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'confirmed' && user.confirmed) ||
        (statusFilter === 'unconfirmed' && !user.confirmed)

      return matchesSearch && matchesPlan && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortField === 'email') {
        comparison = (a.email || '').localeCompare(b.email || '')
      } else if (sortField === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortField === 'lastSignInAt') {
        const timeA = a.lastSignInAt ? new Date(a.lastSignInAt).getTime() : 0
        const timeB = b.lastSignInAt ? new Date(b.lastSignInAt).getTime() : 0
        comparison = timeA - timeB
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  // Colors for Avatars
  const avatarColors = [
    'bg-emerald-100 text-emerald-700',
    'bg-blue-100 text-blue-700',
    'bg-orange-100 text-orange-700',
    'bg-purple-100 text-purple-700',
    'bg-indigo-100 text-indigo-700',
    'bg-rose-100 text-rose-700',
  ]

  const getUserAvatarColor = (userId: string) => {
    let sum = 0
    for (let i = 0; i < userId.length; i++) {
      sum += userId.charCodeAt(i)
    }
    return avatarColors[sum % avatarColors.length]
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestione Utenti
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Visualizza, ordina e filtra tutti gli utenti registrati nella piattaforma.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500">Utenti Registrati</span>
            <p className="text-3xl font-black text-slate-900">{totalCount}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        {/* Premium Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500">Utenti Abbonati (Pro/Biz)</span>
            <p className="text-3xl font-black text-slate-950 flex items-center gap-1.5">
              {activeSubscribersCount}
              {activeSubscribersCount > 0 && (
                <span className="text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-0.5 animate-pulse">
                  <Crown size={10} className="fill-amber-400" />
                  Active
                </span>
              )}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Sparkles size={22} />
          </div>
        </div>

        {/* Verified Accounts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm font-semibold text-slate-500">Account Verificati</span>
            <p className="text-3xl font-black text-slate-900">
              {confirmedCount} <span className="text-sm font-normal text-slate-400">/ {totalCount}</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <UserCheck size={22} />
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cerca per nome o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400 bg-slate-50/50"
          />
        </div>

        {/* Dropdowns Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Plan Filter */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 w-full md:w-auto">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value as any)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-700 w-full md:w-auto cursor-pointer"
            >
              <option value="all">Tutti i piani</option>
              <option value="free">Free</option>
              <option value="pro">Pro</option>
              <option value="business">Business</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50/50 w-full md:w-auto">
            <UserCheck size={14} className="text-slate-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent text-xs font-semibold focus:outline-none text-slate-700 w-full md:w-auto cursor-pointer"
            >
              <option value="all">Tutti gli stati</option>
              <option value="confirmed">Email confermata</option>
              <option value="unconfirmed">Email non confermata</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-400 font-semibold select-none">
                <th 
                  onClick={() => handleSort('name')} 
                  className="p-4 font-semibold cursor-pointer hover:bg-slate-100/50 hover:text-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Nome
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('email')} 
                  className="p-4 font-semibold cursor-pointer hover:bg-slate-100/50 hover:text-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Email
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="p-4 font-semibold">Stato Piano</th>
                <th 
                  onClick={() => handleSort('createdAt')} 
                  className="p-4 font-semibold cursor-pointer hover:bg-slate-100/50 hover:text-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Registrato Il
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('lastSignInAt')} 
                  className="p-4 font-semibold cursor-pointer hover:bg-slate-100/50 hover:text-slate-600 transition-colors"
                >
                  <div className="flex items-center gap-1">
                    Ultimo Accesso
                    <ArrowUpDown size={12} className="text-slate-400" />
                  </div>
                </th>
                <th className="p-4 font-semibold text-center">Verificato</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 transition-colors group">
                    {/* Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0", getUserAvatarColor(user.id))}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{user.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span>{user.email || '-'}</span>
                      </div>
                    </td>

                    {/* Plan Badge */}
                    <td className="p-4">
                      {user.plan.toLowerCase() === 'business' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-amber-50 border-amber-100 text-amber-700">
                          <Crown size={11} className="fill-amber-100 text-amber-500" />
                          Business
                        </span>
                      ) : user.plan.toLowerCase() === 'pro' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-indigo-50 border-indigo-100 text-indigo-700">
                          <Sparkles size={11} className="text-indigo-500" />
                          Pro
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-slate-50 border-slate-200 text-slate-500">
                          Free
                        </span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </td>

                    {/* Last Sign In */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock size={13} className="text-slate-400 shrink-0" />
                        <span>{formatDateTime(user.lastSignInAt)}</span>
                      </div>
                    </td>

                    {/* Email Confirmed Status */}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        {user.confirmed ? (
                          <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500" title="Email confermata">
                            <CheckCircle2 size={13} />
                          </div>
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500" title="Email non confermata">
                            <XCircle size={13} />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-medium">
                    Nessun utente corrisponde ai filtri impostati.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
