import React, { useMemo, useState } from 'react'
import Modal from '../ui/Modal'
import { Job, Equipment } from '../../types'
import { v4 as uuid } from 'uuid'

export default function JobModal({ job:initial, onClose, onSave, onDelete, inventory, jobs }:{ job:Job, onClose:()=>void, onSave:(j:Job)=>Promise<void> | void, onDelete:(id:string)=>Promise<void> | void, inventory:Equipment[], jobs:Job[] }){
  const [job, setJob] = useState<Job>(initial)

  // compute availability: for a given equipment, how many are reserved on this date (excluding current job)
  function reservedCount(equipmentId:string){
    return jobs.filter(j=>j.date===job.date && j.id!==job.id).reduce((sum, j)=>{
      const item = j.gear.find(g=>g.equipmentId===equipmentId)
      return sum + (item?item.quantity:0)
    },0)
  }

  function availableFor(equipmentId:string){
    const it = inventory.find(i=>i.id===equipmentId)
    if (!it) return 0
    return Math.max(0, it.howMany - reservedCount(equipmentId))
  }

  function addGear(equipmentId:string){
    const existing = job.gear.find(g=>g.equipmentId===equipmentId)
    if (existing) {
      setJob({...job, gear: job.gear.map(g => g.equipmentId===equipmentId ? {...g, quantity: g.quantity + 1} : g)})
    } else {
      setJob({...job, gear: [...job.gear, { equipmentId, quantity: 1, packed: false } ]})
    }
  }

  function setQuantity(equipmentId:string, q:number){
    setJob({...job, gear: job.gear.map(g => g.equipmentId===equipmentId ? {...g, quantity: Math.max(1,q)} : g)})
  }

  function togglePacked(equipmentId:string){
    setJob({...job, gear: job.gear.map(g => g.equipmentId===equipmentId ? {...g, packed: !g.packed} : g)})
  }

  function removeGear(equipmentId:string){
    setJob({...job, gear: job.gear.filter(g=>g.equipmentId!==equipmentId)})
  }

  function save(){
    onSave(job)
  }

  function del(){
    if (confirm('Delete this job?')) onDelete(job.id)
  }

  const inventoryOptions = inventory.filter(i=>!job.gear.some(g=>g.equipmentId===i.id))

  return (
    <Modal onClose={onClose}>
      <div>
        <div className="h">Edit Job — {job.date}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 160px',gap:12}}>
          <div>
            <div className="form-row">
              <label className="label">Title</label>
              <input className="input" value={job.title} onChange={e=>setJob({...job,title:e.target.value})} />
            </div>
            <div className="form-row">
              <label className="label">Location</label>
              <input className="input" value={job.location} onChange={e=>setJob({...job,location:e.target.value})} />
            </div>
            <div className="form-row">
              <label className="label">Price</label>
              <input className="input" value={job.price||0} type="number" onChange={e=>setJob({...job, price: Number(e.target.value)})} />
            </div>
            <div className="form-row">
              <label className="label">Description</label>
              <textarea className="input" value={job.description} onChange={e=>setJob({...job,description:e.target.value})} />
            </div>
          </div>
          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div className="small-muted">Gear / Packing checklist</div>
              <div className="small-muted">Reserved: {job.gear.reduce((s, g)=>s+g.quantity, 0)}</div>
            </div>
            <div style={{marginTop:8,display:'grid',gap:8}}>
              {job.gear.map(g => {
                const it = inventory.find(i=>i.id===g.equipmentId)
                const avail = availableFor(g.equipmentId) + g.quantity // current job's items count as available to itself
                return (
                  <div key={g.equipmentId} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:8}}>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <div style={{fontWeight:700}}>{it?.shortName || 'Unknown'}</div>
                      <div className="small">{it?.fullName}</div>
                      <div className="small-muted">Available: {avail} / Needed: {g.quantity}</div>
                    </div>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <input type="number" className="input" style={{width:80}} value={g.quantity} onChange={e=>setQuantity(g.equipmentId, Number(e.target.value))} />
                      <button className={`btn ${g.packed? '' : ''}`} onClick={()=>togglePacked(g.equipmentId)}>{g.packed? 'Packed' : 'Mark Packed'}</button>
                      <button className="btn" onClick={()=>removeGear(g.equipmentId)}>Remove</button>
                    </div>
                  </div>
                )
              })}

              <div style={{display:'flex',gap:8,alignItems:'center',marginTop:6}}>
                <select className="input" id="sel-add-gear" style={{flex:1}}>
                  <option value="">Add from inventory...</option>
                  {inventoryOptions.map(i=> <option key={i.id} value={i.id}>{i.shortName} • {i.howMany} available</option>)}
                </select>
                <button className="btn" onClick={()=>{
                  const el = document.getElementById('sel-add-gear') as HTMLSelectElement | null
                  if (!el) return
                  const val = el.value
                  if (!val) return
                  addGear(val)
                  el.selectedIndex = 0
                }}>Add</button>
              </div>

            </div>
          </div>
        </div>

        <div className="footer">
          <div>
            <button className="btn" onClick={del} style={{background:'transparent',color:'#ff8b8b'}}>Delete</button>
          </div>
          <div>
            <button className="btn" onClick={onClose}>Close</button>
            <button className="btn primary" onClick={save} style={{marginLeft:8}}>Save</button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
