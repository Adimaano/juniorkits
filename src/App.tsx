import React, { useEffect, useState } from 'react'
import { auth, onAuthStateChanged, signOut as fbSignOut } from './firebase'
import { listenInventory, listenJobs, addInventory, updateInventory, deleteInventory, addJob, updateJob, deleteJob } from './remoteStorage'
import Login from './components/Login'
import Header from './components/Header'
import Tabs from './components/Tabs'
import JobsCalendar from './components/Jobs/Calendar'
import Inventory from './components/Inventory/Inventory'
import { Equipment, Job } from './types'

export default function App() {
  const [isAuthed, setIsAuthed] = useState<boolean>(false)
  const [tab, setTab] = useState<'jobs'|'inventory'>('jobs')
  const [inventory, setInventory] = useState<Equipment[]>([])
  const [jobs, setJobs] = useState<Job[]>([])

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (user)=>{
      setIsAuthed(Boolean(user))
    })
    return unsub
  },[])

  useEffect(()=>{
    if (!isAuthed) return
    const unsubInv = listenInventory(setInventory)
    const unsubJobs = listenJobs(setJobs)
    return ()=>{ unsubInv(); unsubJobs() }
  },[isAuthed])

  async function handleLogout(){
    try{ await fbSignOut() }catch(e){ console.warn(e) }
  }

  if (!auth) return <Login onSuccess={()=>{}} />

  return (
    <div className="app">
      <Header onLogout={handleLogout} />
      <Tabs active={tab} onChange={setTab} />
      <div className="container">
        <div>
          {tab === 'jobs' ? (
            <JobsCalendar inventory={inventory} jobs={jobs} onAddJob={addJob} onUpdateJob={updateJob} onDeleteJob={deleteJob} />
          ) : (
            <div className="panel">
              <Inventory inventory={inventory} onSaveEquipment={async (e:Equipment)=>{ if (e.id) await updateInventory(e); else await addInventory(e) }} onDeleteEquipment={deleteInventory} />
            </div>
          )}
        </div>
        <div>
          <div className="panel">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div>
                <div className="title">Quick Inventory</div>
                <div className="small-muted">Snapshot & shortcuts</div>
              </div>
            </div>
            <div className="inv-list" style={{marginTop:8}}>
              {inventory.map(it => (
                <div key={it.id} className="inv-item">
                  <div className="meta">
                    <div style={{fontWeight:700}}>{it.shortName}</div>
                    <div className="small">{it.fullName}</div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <div className="badge">{it.howMany}</div>
                    <div className="small-muted">{it.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{height:18}} />
      <div style={{textAlign:'center',color:'var(--muted)'}}>© Studio Inventory — demo</div>
    </div>
  )
}
