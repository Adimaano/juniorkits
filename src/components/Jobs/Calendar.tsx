import React, { useMemo, useState } from 'react'
import { Job, Equipment } from '../../types'
import { addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns'
import JobModal from './JobModal'
import { v4 as uuid } from 'uuid'

export default function JobsCalendar({ inventory, jobs, onAddJob, onUpdateJob, onDeleteJob }:{ inventory:Equipment[], jobs:Job[], onAddJob:(j:Job)=>Promise<void>, onUpdateJob:(j:Job)=>Promise<void>, onDeleteJob:(id:string)=>Promise<void> }){
  const [cursor, setCursor] = useState(new Date())
  const [openJob, setOpenJob] = useState<Job | null>(null)

  const monthStart = startOfMonth(cursor)
  const days = eachDayOfInterval({ start: monthStart, end: endOfMonth(cursor) })

  const eventsByDay = useMemo(()=>{
    const map: Record<string, Job[]> = {}
    for(const j of jobs){
      (map[j.date] ||= []).push(j)
    }
    return map
  },[jobs])

  function openNew(day:Date){
    const iso = day.toISOString().slice(0,10)
    const newJob: Job = { id: uuid(), date: iso, title: 'New Job', location:'', price:0, description:'', gear:[] }
    setOpenJob(newJob)
  }

  async function save(job:Job){
    try{
      const exists = jobs.find(p=>p.id===job.id)
      if (exists) await onUpdateJob(job)
      else await onAddJob(job)
      setOpenJob(null)
    }catch(err){ console.error(err); alert('Failed to save job') }
  }
  async function remove(jobId:string){
    try{
      await onDeleteJob(jobId)
      setOpenJob(null)
    }catch(err){ console.error(err); alert('Failed to delete job') }
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div>
          <div className="title">Jobs</div>
          <div className="small-muted">Monthly calendar — click a day to add job</div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={()=>setCursor(d=>subMonths(d,1))}>Prev</button>
          <div style={{padding:'8px 12px',borderRadius:8,background:'rgba(255,255,255,0.02)'}}>{format(monthStart,'MMMM yyyy')}</div>
          <button className="btn" onClick={()=>setCursor(d=>addMonths(d,1))}>Next</button>
        </div>
      </div>

      <div className="panel">
        <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:6,marginBottom:8}}>
          <div className="small-muted">Sun</div><div className="small-muted">Mon</div><div className="small-muted">Tue</div><div className="small-muted">Wed</div><div className="small-muted">Thu</div><div className="small-muted">Fri</div><div className="small-muted">Sat</div>
        </div>
        <div className="calendar-grid">
          {days.map(d => {
            const iso = d.toISOString().slice(0,10)
            const evs = eventsByDay[iso] || []
            return (
              <div key={iso} className="day">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div className="date">{format(d,'d')}</div>
                  <div style={{display:'flex',gap:6}}>
                    <button className="btn" style={{padding:'4px 8px',fontSize:12}} onClick={()=>openNew(d)}>Add</button>
                  </div>
                </div>
                <div style={{marginTop:8}}>
                  {evs.map(ev => (
                    <div key={ev.id} className={`event-pill ${ev.gear.some(g=>g.quantity>1)?'warn':''}`} onClick={()=>setOpenJob(ev)}>
                      {ev.title} — {ev.location || '—'}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {openJob && (
        <JobModal job={openJob} onClose={()=>setOpenJob(null)} onSave={save} onDelete={remove} inventory={inventory} jobs={jobs} />
      )}
    </div>
  )
}
