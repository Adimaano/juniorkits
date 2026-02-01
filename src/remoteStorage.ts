import { collection, query, orderBy, onSnapshot, addDoc, setDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from './firebase'
import { Equipment, Job } from './types'

// Authentication related functions are exported from firebase.ts directly

export function listenInventory(onChange: (items: Equipment[]) => void) {
  const q = query(collection(db, 'inventory'), orderBy('shortName'))
  const unsub = onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Equipment[]
    onChange(items)
  })
  return unsub
}

export async function addInventory(item: Equipment) {
  if (!item.id) {
    await addDoc(collection(db, 'inventory'), item)
  } else {
    await setDoc(doc(db, 'inventory', item.id), item)
  }
}
export async function updateInventory(item: Equipment) {
  await updateDoc(doc(db, 'inventory', item.id), { ...item })
}
export async function deleteInventory(id: string) {
  await deleteDoc(doc(db, 'inventory', id))
}

export function listenJobs(onChange: (items: Job[]) => void) {
  const q = query(collection(db, 'jobs'), orderBy('date'))
  const unsub = onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Job[]
    onChange(items)
  })
  return unsub
}

export async function addJob(job: Job) {
  if (!job.id) {
    await addDoc(collection(db, 'jobs'), job)
  } else {
    await setDoc(doc(db, 'jobs', job.id), job)
  }
}
export async function updateJob(job: Job) {
  await updateDoc(doc(db, 'jobs', job.id), { ...job })
}
export async function deleteJob(id: string) {
  await deleteDoc(doc(db, 'jobs', id))
}
