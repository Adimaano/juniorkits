import React from 'react'

export default function Modal({ children, onClose }:{ children:React.ReactNode, onClose?:()=>void }){
  return (
    <div className="modal-backdrop" onClick={(e)=>{ if (e.target === e.currentTarget) onClose && onClose() }}>
      <div className="modal">{children}</div>
    </div>
  )
}
