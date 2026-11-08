import React from 'react'
import { useData } from '../services/data'
import { Settings, User, Key, RefreshCcw, Trash2, Bell, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const { state, actions } = useData()
  const [name, setName] = React.useState(state.settings?.name || '')
  const [token, setToken] = React.useState(state.settings?.dribbbleToken || '')
  const [saved, setSaved] = React.useState(false)

  function handleSave(e) {
    e.preventDefault()
    actions.updateSettings({
      name: name,
      dribbbleToken: token
    })
    // Trigger a fresh sync with the new token if provided
    if (actions.fetchDribbbleShots) {
      actions.fetchDribbbleShots(token)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-indigo-500" /> Settings & Preferences
        </h1>
        <p className="text-sm text-slate-400 mt-1">Manage your account credentials, API tokens, and local data persistence.</p>
      </div>

      {saved && (
        <div className="bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Settings saved and Dribbble feed updated successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold border-b border-slate-800 pb-3 text-sm">
            <User className="w-4 h-4 text-indigo-400" /> User Profile
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Display Name</label>
            <input 
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* API Integration Settings */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-white font-semibold border-b border-slate-800 pb-3 text-sm">
            <Key className="w-4 h-4 text-indigo-400" /> API Integrations
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Dribbble Access Token</label>
            <p className="text-xs text-slate-500 mb-2">Used to sync your portfolio shots into the Discover feed. Falls back to curated mock inspiration if left empty.</p>
            <input 
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="brbl_..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold border-b border-slate-800 pb-3 text-sm">
          <RefreshCcw className="w-4 h-4 text-indigo-400" /> Data Management
        </div>
        <p className="text-xs text-slate-400">
          Your opportunities are safely stored in your browser's <code className="text-slate-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">localStorage</code>. You can reset to default sample data or wipe everything at any time.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <button 
            type="button"
            onClick={() => {
              if(confirm('Are you sure you want to reset to default sample opportunities?')) {
                actions.resetToSample()
                alert('Reset to sample data successfully!')
              }
            }}
            className="px-4 py-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5 text-indigo-400" /> Reset to Sample Data
          </button>
          <button 
            type="button"
            onClick={() => {
              if(confirm('WARNING: This will clear all opportunities and reset settings. Continue?')) {
                actions.clearAll()
                alert('All data cleared!')
              }
            }}
            className="px-4 py-2 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/50 text-rose-300 text-xs font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Clear All Data
          </button>
        </div>
      </div>
    </div>
  )
}