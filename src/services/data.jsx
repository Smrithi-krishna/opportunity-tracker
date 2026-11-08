import React from 'react'
import sampleData from '../data/sample'

const STORAGE_KEY = 'opportunity_tracker_v1'

function safeParse(str){
  try{
    return JSON.parse(str)
  }catch(e){
    return null
  }
}

function initialState(){
  const raw = localStorage.getItem(STORAGE_KEY)
  const parsed = safeParse(raw)
  if(!parsed || !parsed.opportunities) return { opportunities: sampleData, settings: defaultSettings() }
  return parsed
}

function defaultSettings(){
  return {
    name: 'Smrithi Krishna',
    preferredCategories: [],
    reminders: { upcomingDays: 7 },
    dribbbleToken: 'brbl_6cb44497a1bf8ddae34362287cc2b6e7a2ad32175e4b66bd47bf107d838c8a8a'
  }
}

const DataContext = React.createContext(null)

export function DataProvider({children}){
  const [state, setState] = React.useState(()=> initialState())

  React.useEffect(()=>{
    try{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }catch(e){
      console.error('Failed to save to localStorage', e)
    }
  }, [state])

  // Auto-fetch Dribbble shots on mount
  React.useEffect(() => {
    fetchDribbbleShots()
  }, [])

  async function fetchDribbbleShots(tokenOverride){
    try{
      const token = tokenOverride || state.settings?.dribbbleToken || 'brbl_6cb44497a1bf8ddae34362287cc2b6e7a2ad32175e4b66bd47bf107d838c8a8a'
      
      let dribbbleOpportunities = []

      if(token && token.startsWith('brbl_')) {
        try {
          const response = await fetch(`https://api.dribbble.com/v2/user/shots?access_token=${token.trim()}`)
          if(response.ok) {
            const data = await response.json()
            dribbbleOpportunities = data.map(shot => ({
              id: `dribbble_${shot.id}`,
              title: shot.title,
              organisation: shot.user?.name || 'Dribbble Creator',
              category: 'Design & UI',
              type: 'Online',
              description: shot.description ? shot.description.replace(/<[^>]*>?/gm, '') : 'UI design inspiration and project concept.',
              link: shot.html_url,
              imageUrl: shot.images?.normal || shot.images?.hidpi || shot.images?.teaser || '',
              source: 'discover',
              createdAt: new Date().toISOString()
            }))
          }
        } catch (apiErr) {
          console.warn('Dribbble live fetch bypassed, using curated collection.')
        }
      }

      // Curated professional design shots fallback
      if(dribbbleOpportunities.length === 0) {
        dribbbleOpportunities = [
          {
            id: 'dribbble_mock_1',
            title: 'Fintech Mobile App Dashboard',
            organisation: 'Design Studio',
            category: 'Design & UI',
            type: 'Online',
            description: 'Dark mode financial analytics dashboard featuring fluid data curves, custom wallet cards, and micro-interactions.',
            link: 'https://dribbble.com',
            imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
            source: 'discover',
            createdAt: new Date().toISOString()
          },
          {
            id: 'dribbble_mock_2',
            title: 'SaaS Analytics & Workspace UI',
            organisation: 'UI Labs',
            category: 'Design & UI',
            type: 'Online',
            description: 'High-contrast solid opaque component system built for engineering workflow monitoring and real-time team metrics.',
            link: 'https://dribbble.com',
            imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
            source: 'discover',
            createdAt: new Date().toISOString()
          },
          {
            id: 'dribbble_mock_3',
            title: 'Cryptocurrency Exchange Mobile View',
            organisation: 'CryptoCraft',
            category: 'Design & UI',
            type: 'Online',
            description: 'Minimalist dark crypto portfolio tracker with neon accent gradients and modular asset cards.',
            link: 'https://dribbble.com',
            imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=800&auto=format&fit=crop',
            source: 'discover',
            createdAt: new Date().toISOString()
          }
        ]
      }

      setState(s => {
        const preserved = s.opportunities.filter(o => o.source !== 'discover' || !o.id?.startsWith('dribbble_'))
        return {
          ...s,
          opportunities: [...dribbbleOpportunities, ...preserved]
        }
      })
    }catch(err){
      console.error('Error fetching Dribbble shots:', err.message)
    }
  }

  function resetToSample(){
    setState({ opportunities: sampleData, settings: defaultSettings() })
  }

  function clearAll(){
    setState({ opportunities: [], settings: defaultSettings() })
  }

  function addOpportunity(op){
    setState(s=> ({...s, opportunities: [{...op, id: id(), createdAt: new Date().toISOString()}, ...s.opportunities]}))
  }

  function updateOpportunity(idValue, updates){
    setState(s=> ({...s, opportunities: s.opportunities.map(o=> o.id===idValue ? {...o, ...updates} : o)}))
  }

  function deleteOpportunity(idValue){
    setState(s=> ({...s, opportunities: s.opportunities.filter(o=> o.id!==idValue)}))
  }

  function updateSettings(updates){
    setState(s=> ({...s, settings: {...s.settings, ...updates}}))
  }

  function toggleNotificationRead(notificationId){
    setState(s=>{
      const reads = s.settings?.notificationsRead || []
      const exists = reads.includes(notificationId)
      const next = exists ? reads.filter(r=> r!==notificationId) : [...reads, notificationId]
      return {...s, settings: {...s.settings, notificationsRead: next}}
    })
  }

  function clearNotificationReads(){
    setState(s=> ({...s, settings: {...s.settings, notificationsRead: []}}))
  }

  function id(){
    return 'opp_' + Math.random().toString(36).slice(2,9)
  }

  return (
    <DataContext.Provider value={{
      state, 
      actions:{
        resetToSample, 
        clearAll, 
        addOpportunity, 
        updateOpportunity, 
        deleteOpportunity, 
        updateSettings, 
        toggleNotificationRead, 
        clearNotificationReads,
        fetchDribbbleShots
      }
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData(){
  const ctx = React.useContext(DataContext)
  if(!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}