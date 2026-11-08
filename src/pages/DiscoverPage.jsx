import React from 'react'
import { useData } from '../services/data'
import { Compass, Bookmark, ExternalLink, RefreshCw } from 'lucide-react'

export default function DiscoverPage() {
  const { state, actions } = useData()
  const [query, setQuery] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const opportunities = state.opportunities || []
  const discoverList = opportunities.filter(o => o.source === 'discover' || !o.source || o.source === 'preset')

  const filtered = discoverList.filter(o => 
    o.title.toLowerCase().includes(query.toLowerCase()) || 
    (o.organisation && o.organisation.toLowerCase().includes(query.toLowerCase()))
  )

  async function handleRefresh() {
    if (actions.fetchDribbbleShots) {
      setLoading(true)
      await actions.fetchDribbbleShots()
      setLoading(false)
    }
  }

  function handleSave(op) {
    actions.addOpportunity({
      ...op,
      source: 'saved',
      status: 'Saved',
      id: undefined
    })
    alert(`Saved "${op.title}" to your opportunities!`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Sync Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-indigo-500" /> Discover Opportunities
          </h1>
          <p className="text-sm text-slate-400 mt-1">Explore curated hackathons, internships, fellowships, and Dribbble design inspirations.</p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center gap-2 shadow-sm self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-400 ${loading ? 'animate-spin' : ''}`} /> 
          {loading ? 'Syncing Dribbble...' : 'Refresh Dribbble Feed'}
        </button>
      </div>

      {/* Search Input */}
      <div className="flex gap-3">
        <input 
          placeholder="Search discover list..." 
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 w-full max-w-md focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 text-sm bg-slate-900 border border-slate-800 rounded-2xl">
            No discoverable opportunities match your search. Make sure your Dribbble access token is configured in your settings or `.env` file!
          </div>
        ) : (
          filtered.map(o => (
            <div key={o.id || o.title} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all">
              {/* Dribbble Shot Image Preview */}
              {o.imageUrl && (
                <div className="h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                  <img src={o.imageUrl} alt={o.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-semibold text-white text-base">{o.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{o.organisation} {o.category ? `• ${o.category}` : ''}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 shrink-0">
                      {o.type || 'Online'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-3 line-clamp-3">{o.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                  {o.link ? (
                    <a href={o.link} target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                      View Shot <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <span />}
                  <button 
                    onClick={() => handleSave(o)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}