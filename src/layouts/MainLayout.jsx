import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Compass, Layers, Bell, Settings, Briefcase } from 'lucide-react'

export default function MainLayout() {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'My Opportunities', path: '/my', icon: Layers },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Solid Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight">Opportunity Tracker</h1>
              <p className="text-xs text-slate-400">Track & secure pathways</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'}
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Footer User Profile Section */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold flex items-center justify-center text-sm">
              SK
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-semibold text-white truncate">Student</div>
              <div className="text-xs text-slate-500 truncate">CSE</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between md:hidden">
          <div className="font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-500" /> Tracker
          </div>
        </header>
        <div className="p-6 lg:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
