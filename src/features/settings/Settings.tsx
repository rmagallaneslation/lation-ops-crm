import { useState, useRef } from 'react'
import { RotateCcw, Download, Upload } from 'lucide-react'
import { TopBar } from '../../components/layout/TopBar'
import { Button } from '../../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card'
import { useStore } from '../../store/useStore'

export function Settings() {
  const resetToMockData = useStore((s) => s.resetToMockData)
  const exportData = useStore((s) => s.exportData)
  const importData = useStore((s) => s.importData)
  const fileRef = useRef<HTMLInputElement>(null)
  const [importMsg, setImportMsg] = useState('')

  function handleExport() {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lation-crm-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      importData(text)
      setImportMsg('Data imported successfully.')
      setTimeout(() => setImportMsg(''), 3000)
    }
    reader.readAsText(file)
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Settings" subtitle="App configuration and data management" />
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-2xl">
        <Card>
          <CardHeader><CardTitle>Data Management</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-800">Reset Demo Data</p>
                <p className="text-xs text-slate-500">Resets all data to the original mock dataset. This cannot be undone.</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (window.confirm('Reset all data to mock data? This will overwrite all changes.')) {
                    resetToMockData()
                  }
                }}
              >
                <RotateCcw className="h-4 w-4" /> Reset
              </Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-800">Export Data</p>
                <p className="text-xs text-slate-500">Download all CRM data as a JSON file.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export JSON
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-slate-800">Import Data</p>
                <p className="text-xs text-slate-500">Load data from a previously exported JSON file.</p>
              </div>
              <div className="flex items-center gap-2">
                {importMsg && <span className="text-xs text-emerald-600">{importMsg}</span>}
                <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-4 w-4" /> Import JSON
                </Button>
                <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>About</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <p><span className="font-medium">App:</span> Lation Ops CRM</p>
            <p><span className="font-medium">Version:</span> 1.0.0</p>
            <p><span className="font-medium">Team:</span> Roberto · Reynaldo · Santiago</p>
            <p><span className="font-medium">Storage:</span> localStorage (local-first)</p>
            <p className="text-xs text-slate-400 pt-2">This is an internal tool for Lation. No data is sent to external servers.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
