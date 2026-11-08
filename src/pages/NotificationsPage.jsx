import React from 'react'
import { Bell, CheckCheck, Clock } from 'lucide-react'

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: 'Application Deadline Approaching', message: 'Global Scholarship application deadline is coming up in 2 days.', time: '2 hours ago', read: false },
    { id: 2, title: 'New Opportunity Discovered', message: 'Code for Impact Hackathon was added to your curated feed.', time: '1 day ago', read: true },
  ])

  function markAllRead() {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-indigo-500" /> Notifications
          </h1>
          <p className="text-sm text-slate-400 mt-1">Stay updated on deadlines, status updates, and alerts.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
        >
          <CheckCheck className="w-4 h-4 text-indigo-400" /> Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm bg-slate-900 border border-slate-800 rounded-2xl">
            No notifications right now.
          </div>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`p-4 rounded-2xl border transition-all bg-slate-900 ${n.read ? 'border-slate-800 opacity-75' : 'border-indigo-500/40 shadow-lg shadow-indigo-500/5'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-sm">{n.title}</h3>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" /> {n.time}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}