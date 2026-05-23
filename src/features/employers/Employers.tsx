import { useState } from 'react'
import { Plus, Search, Globe, Phone, Mail, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { Dialog } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { EmptyState } from '../../components/shared/EmptyState'
import { useLationStore } from '../../store/useLationStore'
import type { Employer, EmployerStatus, EmployerType } from '../../types/lation'

const STATUS_COLORS: Record<EmployerStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  prospect: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  inactive: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
}

type Form = Omit<Employer, 'id' | 'created_at' | 'updated_at'>

const empty = (): Form => ({
  company_name: '', industry: '', country: '', email: '',
  phone: '', website: '', contact_name: '', contact_email: '',
  contact_phone: '', employer_type: 'hiring_company', status: 'active',
})

export function Employers() {
  const { t } = useTranslation()
  const employers = useLationStore((s) => s.employers)
  const positions = useLationStore((s) => s.positions)
  const addEmployer = useLationStore((s) => s.addEmployer)
  const updateEmployer = useLationStore((s) => s.updateEmployer)
  const deleteEmployer = useLationStore((s) => s.deleteEmployer)

  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterEmployerType, setFilterEmployerType] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Employer | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Employer | null>(null)
  const [form, setForm] = useState<Form>(empty())

  const countries = [...new Set(employers.map((e) => e.country).filter(Boolean))].sort()

  const filtered = employers.filter((e) => {
    const q = search.toLowerCase()
    return (e.company_name.toLowerCase().includes(q) ||
      e.industry.toLowerCase().includes(q) ||
      e.contact_name.toLowerCase().includes(q)) &&
      (!filterStatus || e.status === filterStatus) &&
      (!filterEmployerType || e.employer_type === filterEmployerType) &&
      (!filterCountry || e.country === filterCountry)
  })

  function openAdd() { setEditing(null); setForm(empty()); setOpen(true) }
  function openEdit(e: Employer) { setEditing(e); setForm({ ...e }); setOpen(true) }
  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm((f) => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.company_name.trim()) return
    if (editing) { updateEmployer(editing.id, form); toast.success('Empresa actualizada') }
    else { addEmployer(form); toast.success('Empresa agregada') }
    setOpen(false)
  }

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title={t('employers.title')}
        subtitle={t(filtered.length === 1 ? 'employers.count' : 'employers.count_plural', { count: filtered.length })}
        action={
          <Button size="sm" onClick={openAdd}>
            <Plus className="h-4 w-4" /> {t('employers.add')}
          </Button>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-5 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder={t('employers.search_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={filterEmployerType} onChange={(e) => setFilterEmployerType(e.target.value)} className="w-44">
            <option value="">{t('common.all_types')}</option>
            <option value="hiring_company">{t('employers.hiring_company')}</option>
            <option value="talent_source">{t('employers.talent_source')}</option>
            <option value="both">{t('employers.both')}</option>
          </Select>
          <Select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="w-40">
            <option value="">{t('common.all_countries')}</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-40">
            <option value="">{t('common.all_statuses')}</option>
            <option value="active">{t('status.active')}</option>
            <option value="prospect">{t('status.prospect')}</option>
            <option value="inactive">{t('status.inactive')}</option>
          </Select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title={t('employers.no_employers')} action={{ label: t('employers.add'), onClick: openAdd }} />
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-700 dark:bg-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                  {[t('common.company'), t('common.type'), t('employers.country'), t('common.contact'), t('common.open_positions'), t('common.status'), ''].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map((e) => {
                  const openPos = positions.filter((p) => p.employer_id === e.id && p.status === 'open').length
                  return (
                    <tr key={e.id} className="hover:bg-slate-50 cursor-pointer dark:hover:bg-slate-700/50 transition-colors" onClick={() => openEdit(e)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-white">
                            {e.company_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{e.company_name}</p>
                            {e.website && (
                              <a href={e.website} target="_blank" rel="noopener noreferrer"
                                onClick={(ev) => ev.stopPropagation()}
                                className="flex items-center gap-1 text-xs text-blue-500 hover:underline">
                                <Globe className="h-3 w-3" /> {t('common.website')}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300 capitalize">{t(`employers.${e.employer_type}`)}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{e.country}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{e.contact_name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {e.contact_email && (
                            <a href={`mailto:${e.contact_email}`} onClick={(ev) => ev.stopPropagation()}
                              className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition-colors">
                              <Mail className="h-3 w-3" />
                            </a>
                          )}
                          {e.contact_phone && (
                            <a href={`tel:${e.contact_phone}`} onClick={(ev) => ev.stopPropagation()}
                              className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition-colors">
                              <Phone className="h-3 w-3" />
                            </a>
                          )}
                          <span className="text-xs text-slate-400">{e.contact_email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${openPos > 0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
                          {openPos}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[e.status]}`}>
                          {t(`status.${e.status}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3" onClick={(ev) => ev.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/employers/${e.id}`)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-orange-600 transition-colors"
                          title={t('employers.view_employer', 'View employer')}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? t('employers.edit') : t('employers.add')} className="max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-1">
            <Label>{t('employers.company_name')} *</Label>
            <Input value={form.company_name} onChange={(e) => set('company_name', e.target.value)} placeholder="Accenture" />
          </div>
          <div className="space-y-1">
            <Label>{t('employers.industry')}</Label>
            <Input value={form.industry} onChange={(e) => set('industry', e.target.value)} placeholder="Fintech, Consulting…" />
          </div>
          <div className="space-y-1">
            <Label>{t('employers.country')}</Label>
            <Input value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="USA, Mexico…" />
          </div>
          <div className="space-y-1">
            <Label>{t('employers.email')}</Label>
            <Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>{t('employers.phone')}</Label>
            <Input value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="col-span-2 space-y-1">
            <Label>{t('employers.website')}</Label>
            <Input type="url" value={form.website ?? ''} onChange={(e) => set('website', e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-1">
            <Label>{t('employers.contact_name')}</Label>
            <Input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>{t('employers.contact_email')}</Label>
            <Input type="email" value={form.contact_email} onChange={(e) => set('contact_email', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>{t('employers.contact_phone')}</Label>
            <Input value={form.contact_phone ?? ''} onChange={(e) => set('contact_phone', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>{t('employers.employer_type')}</Label>
            <Select value={form.employer_type} onChange={(e) => set('employer_type', e.target.value as EmployerType)}>
              <option value="hiring_company">{t('employers.hiring_company')}</option>
              <option value="talent_source">{t('employers.talent_source')}</option>
              <option value="both">{t('employers.both')}</option>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>{t('common.status')}</Label>
            <Select value={form.status} onChange={(e) => set('status', e.target.value as EmployerStatus)}>
              <option value="active">{t('status.active')}</option>
              <option value="prospect">{t('status.prospect')}</option>
              <option value="inactive">{t('status.inactive')}</option>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          {editing && (
            <Button variant="danger" size="sm" onClick={() => { setOpen(false); setConfirmDelete(editing) }}>{t('common.delete')}</Button>
          )}
          <div className="ml-auto flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>{t('common.cancel')}</Button>
            <Button size="sm" onClick={handleSave}>{t('common.save')}</Button>
          </div>
        </div>
      </Dialog>

      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title={t('employers.delete_employer')}>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t('employers.delete_confirm', { name: confirmDelete?.company_name ?? '' })} {t('common.cannot_be_undone')}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" size="sm" onClick={() => { deleteEmployer(confirmDelete!.id); setConfirmDelete(null) }}>{t('common.yes_delete')}</Button>
        </div>
      </Dialog>
    </div>
  )
}
