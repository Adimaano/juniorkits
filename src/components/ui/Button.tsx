import React from 'react'

export default function Button({children, onClick, kind}:{children:React.ReactNode,onClick?:()=>void,kind?:'primary'|'default'}){
  return (
    <button className={`btn ${kind==='primary'?'primary':''}`} onClick={onClick}>{children}</button>
  )
}
