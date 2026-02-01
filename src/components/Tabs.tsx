import React from 'react'

export default function Tabs({ active, onChange }:{ active:'jobs'|'inventory', onChange:(t:'jobs'|'inventory')=>void }){
  return (
    <div className="tabs" style={{marginBottom:20}}>
      <div className={`tab ${active==='jobs'?'active':''}`} onClick={()=>onChange('jobs')}>Jobs</div>
      <div className={`tab ${active==='inventory'?'active':''}`} onClick={()=>onChange('inventory')}>Inventory</div>
      <div style={{marginLeft:'auto',alignSelf:'center'}} className="small-muted">Logged in</div>
    </div>
  )
}
