import React from 'react'

export default function Header({ onLogout }:{ onLogout: ()=>void }){
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
        <button className="btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}
