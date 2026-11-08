import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../services/data'
import { 
  Briefcase, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Compass, 
  ArrowRight, 
  Calendar,
  Sparkles,
  Layers
} from 'lucide-react'

export default function DashboardPage() {
  const { state } = useData()
  const navigate = useNavigate()

  const opportunities = state.opportunities || []
  const savedCount = opportunities.filter(o => o.status === 'Saved' || o.source === 'saved').length
  const inProgressCount = opportunities.filter(o => ['In Progress', 'Registered', 'Submitted', 'Shortlisted'].includes(o.status)).length
  const completedCount = opportunities.filter(o => ['Selected', 'Completed'].includes(o.status)).length
  const totalCount = opportunities.length

  const needsUpdate = opportunities.filter(o => o.status === 'Saved' || !o.status).slice(0, 3)
  
  const upcoming = [...opportunities]
    .filter(o => o.applicationDeadline || o.registrationDeadline)
    .sort((a, b) => new Date(a.applicationDeadline || a.registrationDeadline) - new Date(b.applicationDeadline || b.registrationDeadline))
    .slice(0, 4)

  const recentlyAdded = [...opportunities].slice(-3).reverse()

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="rounded-3xl bg-slate-900 p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Welcome back, Smrithi
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Opportunity Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Track your career pipeline, monitor upcoming deadlines, and discover new pathways all in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/discover')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition-all flex items-center gap-2 shadow-sm"
          >
            <Compass className="w-4 h-4 text-indigo-400" /> Discover
          </button>
          <button 
            onClick={() => navigate('/my')}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 active:scale-95"
          >
            <Layers className="w-4 h-4" /> My Pipeline
          </button>
        </div>
      </div>

      {/* Metrics Stat Cards with Solid Colors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Card */}
        <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute right-4 top-4 p-2.5 rounded-xl bg-indigo-950 text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-900">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Opportunities</div>
          <div className="text-3xl font-extrabold text-white mt-2">{totalCount}</div>
          <div className="text-xs text-slate-500 mt-1">Active in your workspace</div>
        </div>

        {/* Saved Card */}
        <div className="bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute right-4 top-4 p-2.5 rounded-xl bg-sky-950 text-sky-400 group-hover:scale-110 transition-transform border border-sky-900">
            <Bookmark className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Saved</div>
          <div className="text-3xl font-extrabold text-white mt-2">{savedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Ready for review</div>
        </div>

        {/* In Progress Card */}
        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute right-4 top-4 p-2.5 rounded-xl bg-amber-950 text-amber-400 group-hover:scale-110 transition-transform border border-amber-900">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">In Progress</div>
          <div className="text-3xl font-extrabold text-white mt-2">{inProgressCount}</div>
          <div className="text-xs text-slate-500 mt-1">Applications underway</div>
        </div>

        {/* Completed Card */}
        <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 shadow-xl transition-all relative overflow-hidden group">
          <div className="absolute right-4 top-4 p-2.5 rounded-xl bg-emerald-950 text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-900">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed / Selected</div>
          <div className="text-3xl font-extrabold text-white mt-2">{completedCount}</div>
          <div className="text-xs text-slate-500 mt-1">Successful outcomes</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Deadlines & Recent */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Deadlines */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-900">
                  <Calendar className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-white">Upcoming Deadlines</h2>
              </div>
              <button 
                onClick={() => navigate('/my')} 
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">No upcoming deadlines scheduled.</div>
              ) : (
                upcoming.map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.organisation || 'Independent'} • {item.category || 'General'}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-950 text-rose-300 border border-rose-900">
                      {item.applicationDeadline || item.registrationDeadline || 'Soon'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recently Added */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-900">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-white">Recently Added</h2>
              </div>
            </div>

            <div className="space-y-3">
              {recentlyAdded.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">No opportunities added yet.</div>
              ) : (
                recentlyAdded.map(item => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="font-semibold text-slate-200 text-sm">{item.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.organisation} {item.category ? `• ${item.category}` : ''}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {item.status || 'Saved'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Status Alerts & Quick Add */}
        <div className="space-y-6">
          
          {/* Needs Status Update */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-900">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-white">Needs Status Update</h2>
            </div>

            <div className="space-y-3">
              {needsUpdate.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-sm">All statuses are up to date!</div>
              ) : (
                needsUpdate.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="font-medium text-slate-200 text-sm truncate">{item.title}</div>
                    <div className="text-xs text-slate-500 mt-1">Status: {item.status || 'Saved'}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Add Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-semibold text-white mb-1">Quick Add Opportunity</h3>
            <p className="text-xs text-slate-400 mb-4">Got a new hackathon, internship, or scholarship in mind? Add it instantly to your tracker.</p>
            <button 
              onClick={() => navigate('/my')}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Opportunity
            </button>
          </div>

        </div>

      </div>
    </div>
  )
}