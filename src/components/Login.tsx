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

  const [testResult, setTestResult] = useState<string | null>(null)

  async function testApiKey(){
    setTestResult('Testing...')
    const key = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined
    if (!key) return setTestResult('No API key set (import.meta.env.VITE_FIREBASE_API_KEY is empty)')
    try{
      const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({})
      })
      const json = await res.json()
      if (!res.ok) {
        setTestResult('Failed: '+(json?.error?.message || JSON.stringify(json)))
      } else {
        setTestResult('Success: API key valid. (Anonymous sign-up works)')
      }
    }catch(err:any){
      setTestResult('Error: '+(err.message || String(err)))
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

        {import.meta.env.MODE === 'development' && (
          <div style={{marginTop:12,padding:10,borderRadius:8,background:'rgba(255,255,255,0.01)'}}>
            <div className="small-muted">Debug — Firebase config</div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
              <div className="small">apiKey set: {Boolean(import.meta.env.VITE_FIREBASE_API_KEY) ? 'yes' : 'no'}</div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={testApiKey}>Test API key</button>
              </div>
            </div>
            {testResult && <div style={{marginTop:8}} className="small">{testResult}</div>}
          </div>
        )}

        <div style={{marginTop:12}} className="small-muted">Tip: this demo uses a local (client-side) passcode: <strong>joopie</strong></div>
      </div>
    </div>
  )
}
