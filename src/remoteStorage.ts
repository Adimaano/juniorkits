import { collection, query, orderBy, onSnapshot, addDoc, setDoc, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { Equipment, Job } from './types'
import { loadInventory, loadJobs } from './storage'

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

export async function migrateLocalData(){
  // only migrate if remote collections are empty
  const invSnap = await getDocs(collection(db, 'inventory'))
  const jobsSnap = await getDocs(collection(db, 'jobs'))
  if (!invSnap.empty || !jobsSnap.empty) {
    throw new Error('Remote collections are not empty - aborting migration')
  }
  const localInv = loadInventory()
  const localJobs = loadJobs()
  for(const i of localInv) {
    const iCopy = { ...i }
    if (iCopy.id) await setDoc(doc(db,'inventory',iCopy.id), iCopy)
    else await addDoc(collection(db,'inventory'), iCopy)
  }
  for(const j of localJobs) {
    const jCopy = { ...j }
    if (jCopy.id) await setDoc(doc(db,'jobs',jCopy.id), jCopy)
    else await addDoc(collection(db,'jobs'), jCopy)
  }
}
