import React from 'react'
import { useData } from '../services/data'

const statuses = ['Saved','Planning to Apply','Registered','In Progress','Submitted','Shortlisted','Selected','Rejected','Completed','Open']
const categories = ['All','Hackathon','Internship','Scholarship','Coding Competition','Workshop','Fellowship','Apprenticeship','Entry-level Job']

function Badge({children}){
  return <span className="px-2 py-1 text-xs bg-slate-100 text-slate-700 rounded font-medium">{children}</span>
}

export default function MyOpportunitiesPage(){
  const {state, actions} = useData()
  const [filter, setFilter] = React.useState({status:'All', category:'All', query:''})
  const [editing, setEditing] = React.useState(null)

  const all = state.opportunities || []
  const mine = all.filter(o => o.source === 'saved' || o.source === 'custom')

  const filtered = mine.filter(o => {
    if(filter.status !== 'All' && o.status !== filter.status) return false
    if(filter.category !== 'All' && o.category !== filter.category) return false
    if(filter.query && !o.title.toLowerCase().includes(filter.query.toLowerCase())) return false
    return true
  })

  function onDelete(id){
    if(!confirm('Delete this opportunity? This cannot be undone.')) return
    actions.deleteOpportunity(id)
  }

  function onEdit(op){
    setEditing(op)
  }

  function onUpdateStatus(id, status){
    actions.updateOpportunity(id, {status})
  }

  function onSaveForm(data){
    if(data.id){
      actions.updateOpportunity(data.id, data)
    }else{
      actions.addOpportunity({...data, source:'custom', createdAt: new Date().toISOString()})
    }
    setEditing(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">My Opportunities</h1>
          <p className="text-sm text-slate-400">Track and manage your saved and custom opportunities.</p>
        </div>
        <div>
          <button 
            onClick={() => setEditing({})} 
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-lg transition-colors"
          >
            Add Opportunity
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <input 
          placeholder="Search my opportunities..." 
          className="px-3 py-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" 
          value={filter.query} 
          onChange={e => setFilter(f => ({...f, query: e.target.value}))} 
        />
        <select 
          value={filter.status} 
          onChange={e => setFilter(f => ({...f, status: e.target.value}))} 
          className="px-3 py-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
        >
          <option value="All">All Statuses</option>
          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select 
          value={filter.category} 
          onChange={e => setFilter(f => ({...f, category: e.target.value}))} 
          className="px-3 py-2 bg-slate-900 border border-slate-700 text-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500"
        >
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-slate-500 bg-slate-900/50 border border-slate-800 rounded-xl">
            No opportunities found. Add or save opportunities to get started.
          </div>
        )}
        {filtered.map(o => (
          <div key={o.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start gap-2">
                <div>
                  <div className="font-semibold text-slate-100">{o.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {o.organisation} {o.organisation && o.category ? '• ' : ''}{o.category}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge>{o.status || 'Saved'}</Badge>
                  <div className="text-xs text-slate-500">{o.online ? 'Online' : o.location}</div>
                </div>
              </div>
              <div className="mt-3 text-sm text-slate-300 line-clamp-3">{o.description}</div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {o.link && (
                  <a className="text-xs text-primary-400 hover:underline font-medium" href={o.link} target="_blank" rel="noreferrer">Open</a>
                )}
                <button onClick={() => onEdit(o)} className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700">Edit</button>
                <button onClick={() => onDelete(o.id)} className="text-xs px-2.5 py-1 bg-red-950/40 hover:bg-red-900/40 text-red-400 rounded border border-red-900/50">Delete</button>
              </div>
              <div>
                <select 
                  value={o.status || 'Saved'} 
                  onChange={e => onUpdateStatus(o.id, e.target.value)} 
                  className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded text-xs focus:outline-none"
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && <OpportunityForm initial={editing} onCancel={() => setEditing(null)} onSave={onSaveForm} />}
    </div>
  )
}

function OpportunityForm({initial, onCancel, onSave}){
  const [form, setForm] = React.useState(() => initial || {})

  function change(e){
    const {name, value, type, checked} = e.target
    setForm(f => ({...f, [name]: type === 'checkbox' ? checked : value}))
  }

  function submit(e){
    e.preventDefault()
    if(!form.title) return alert('Title is required')
    onSave(form)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form onSubmit={submit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl w-full max-w-2xl text-slate-100">
        <h3 className="text-lg font-semibold mb-4">{form.id ? 'Edit Opportunity' : 'Add Opportunity'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input name="title" value={form.title || ''} onChange={change} placeholder="Opportunity name*" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
          <input name="organisation" value={form.organisation || ''} onChange={change} placeholder="Organisation" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
          <select name="category" value={form.category || ''} onChange={change} className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500">
            <option value="">Select category</option>
            {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select name="type" value={form.type || ''} onChange={change} className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500">
            <option value="">Type</option>
            <option>Online</option>
            <option>Remote</option>
            <option>In-person</option>
          </select>
          <input name="location" value={form.location || ''} onChange={change} placeholder="Location" className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
          <select name="status" value={form.status || 'Saved'} onChange={change} className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500">
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Registration Deadline</label>
            <input name="registrationDeadline" type="date" value={form.registrationDeadline ? form.registrationDeadline.split('T')[0] : ''} onChange={change} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Application Deadline</label>
            <input name="applicationDeadline" type="date" value={form.applicationDeadline ? form.applicationDeadline.split('T')[0] : ''} onChange={change} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
          </div>
        </div>
        <div className="mt-4">
          <textarea name="description" value={form.description || ''} onChange={change} placeholder="Description" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-primary-500" rows={4} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors">Save</button>
        </div>
      </form>
    </div>
  )
}