import React, { useState } from 'react'
import { Equipment, Job } from '../../types'
import Modal from '../ui/Modal'
import EquipmentForm from './EquipmentForm'
import { v4 as uuid } from 'uuid'

export default function Inventory({ inventory, onSaveEquipment, onDeleteEquipment }:{ inventory:Equipment[], onSaveEquipment:(e:Equipment)=>Promise<void>, onDeleteEquipment:(id:string)=>Promise<void> }){
  const [editing, setEditing] = useState<Equipment | null>(null)
  const [creating, setCreating] = useState(false)

  async function save(e:Equipment){
    try{
      await onSaveEquipment(e)
      setEditing(null)
      setCreating(false)
    }catch(err){ console.error(err); alert('Failed to save equipment') }
  }

  async function del(id:string){
    if (!confirm('Delete equipment? This will remove it from inventory and from any jobs.')) return
    try{
      await onDeleteEquipment(id)
    }catch(err){ console.error(err); alert('Failed to delete') }
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div>
          <div className="title">Inventory</div>
          <div className="small-muted">Add, edit and track gear</div>
        </div>
        <div>
          <button className="btn primary" onClick={()=>setCreating(true)}>Add gear</button>
        </div>
      </div>

      <div className="inv-list">
        {inventory.map(i => (
          <div key={i.id} className="inv-item">
            <div style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{width:48,height:48,borderRadius:8,background:'linear-gradient(135deg,var(--accent),var(--accent-2))',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{i.shortName.slice(0,2).toUpperCase()}</div>
              <div>
                <div style={{fontWeight:700}}>{i.shortName}</div>
                <div className="small">{i.fullName}</div>
                <div className="small-muted">{i.defects?.length? i.defects.join(', '): 'No defects'}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div className="badge">{i.howMany}</div>
              <div className="small-muted">{i.status}</div>
              <button className="btn" onClick={()=>setEditing(i)}>Edit</button>
              <button className="btn" onClick={()=>del(i.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {creating && (
        <Modal onClose={()=>setCreating(false)}>
          <EquipmentForm onSave={save} onCancel={()=>setCreating(false)} />
        </Modal>
      )}

      {editing && (
        <Modal onClose={()=>setEditing(null)}>
          <EquipmentForm onSave={save} onCancel={()=>setEditing(null)} initial={editing} />
        </Modal>
      )}
    </div>
  )
}
