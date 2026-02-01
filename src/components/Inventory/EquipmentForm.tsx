import React, { useState } from 'react'
import { Equipment } from '../../types'

export default function EquipmentForm({ initial, onSave, onCancel }:{ initial?:Equipment, onSave:(e:Equipment)=>Promise<void> | void, onCancel?:()=>void }){
  const [state, setState] = useState<Equipment>(initial || { id: '', shortName:'', fullName:'', value:0, defects:[], howMany:1, buyDate:'', notes:'', status:'NEW' })

  function submit(e?:React.FormEvent){
    e?.preventDefault()
    onSave(state)
  }

  return (
    <form onSubmit={submit}>
      <div className="h">{initial? 'Edit equipment' : 'Add equipment'}</div>
      <div className="form-row">
        <label className="label">Short name</label>
        <input className="input" value={state.shortName} onChange={e=>setState({...state, shortName:e.target.value})} />
      </div>
      <div className="form-row">
        <label className="label">Full name</label>
        <input className="input" value={state.fullName} onChange={e=>setState({...state, fullName:e.target.value})} />
      </div>
      <div className="form-row">
        <label className="label">Count</label>
        <input className="input" type="number" value={state.howMany} onChange={e=>setState({...state, howMany: Number(e.target.value)})} />
      </div>
      <div className="form-row">
        <label className="label">Status</label>
        <select className="input" value={state.status} onChange={e=>setState({...state, status: e.target.value as any})}>
          <option value="NEW">NEW</option>
          <option value="OLD">OLD</option>
          <option value="DAMAGED">DAMAGED</option>
          <option value="UNAVAILABLE">UNAVAILABLE</option>
        </select>
      </div>
      <div className="form-row">
        <label className="label">Notes</label>
        <textarea className="input" value={state.notes} onChange={e=>setState({...state, notes:e.target.value})} />
      </div>
      <div style={{display:'flex',gap:8}}>
        <button className="btn" type="button" onClick={onCancel}>Cancel</button>
        <button className="btn primary" type="submit">Save</button>
      </div>
    </form>
  )
}
