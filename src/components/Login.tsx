import React, { useState } from 'react'

import { signInAnonymous } from '../firebase'

export default function Login({ onSuccess }:{ onSuccess: ()=>void }){
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')

  async function submit(e?:React.FormEvent){
    e?.preventDefault()
    if (code.trim() !== 'joopie') return setErr('Incorrect passcode')
    try {
      await signInAnonymous()
      onSuccess()
    } catch (e:any) {
      console.error('auth error', e)
      setErr('Failed to sign in (check firebase config)')
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{width:420,background:'linear-gradient(180deg,#071018,#07111a)',padding:22,borderRadius:12}}>
        <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:6}}>
          <div className="logo">SI</div>
          <div>
            <div className="title">Studio Inventory</div>
            <div className="subtitle">Sign in with your secret passcode to continue</div>
          </div>
        </div>
        <form onSubmit={submit} style={{marginTop:16}}>
          <div className="form-row">
            <label className="label">Passcode</label>
            <input value={code} onChange={e=>{ setCode(e.target.value); setErr('') }} className="input" placeholder="Enter passcode" />
          </div>
          {err && <div style={{color:'#ff8b8b',marginBottom:8}}>{err}</div>}
          <div style={{display:'flex',gap:8}}>
            <button type="submit" className="btn primary">Unlock</button>
            <button type="button" className="btn" onClick={()=>{setCode('');setErr('')}}>Clear</button>
          </div>
        </form>
        <div style={{marginTop:12}} className="small-muted">Tip: this demo uses a local (client-side) passcode: <strong>joopie</strong></div>
      </div>
    </div>
  )
}
