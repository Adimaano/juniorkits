import React from 'react'

import { migrateLocalData } from '../remoteStorage'

export default function Header({ onLogout }:{ onLogout: ()=>void }){
  async function migrate(){
    if (!confirm('Migrate local demo data into Firestore? This will abort if remote collections are not empty.')) return
    try{
      await migrateLocalData()
      alert('Migration complete')
    }catch(err:any){ console.error(err); alert('Migration failed: '+(err.message||err)) }
  }

  return (
    <div className="header">
      <div className="brand">
        <div className="logo">SI</div>
        <div>
          <div className="title">Studio Inventory</div>
          <div className="subtitle">Manage gear, jobs & packing</div>
        </div>
      </div>
      <div className="controls">
        <button className="btn" onClick={migrate}>Migrate</button>
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}
