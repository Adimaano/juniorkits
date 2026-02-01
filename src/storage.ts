import { Equipment, Job } from './types'
import { v4 as uuid } from 'uuid'

const INVENTORY_KEY = 'studio:inventory'
const JOBS_KEY = 'studio:jobs'
const AUTH_KEY = 'studio:auth'

export function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === '1'
}
export function setAuthenticated(v: boolean) {
  localStorage.setItem(AUTH_KEY, v ? '1' : '0')
}

export function loadInventory(): Equipment[] {
  const raw = localStorage.getItem(INVENTORY_KEY)
  if (!raw) {
    const seed: Equipment[] = [
      {
        id: uuid(),
        shortName: 'A7 III',
        fullName: 'Sony a7 III Body (ILCE-7M3)',
        value: 2000,
        defects: [],
        howMany: 2,
        buyDate: '2019-04-12',
        notes: 'Workhorse camera for run-and-gun shoots.',
        status: 'OLD',
      },
      {
        id: uuid(),
        shortName: '85/1.8',
        fullName: 'Sigma 85mm f/1.8 Contemporary',
        value: 700,
        defects: [],
        howMany: 1,
        buyDate: '2021-06-01',
        notes: 'Portrait favorite.',
        status: 'NEW',
      },
      {
        id: uuid(),
        shortName: 'XLR Mic',
        fullName: 'Sennheiser MKH416 Replica',
        value: 900,
        defects: ['rubber grip torn'],
        howMany: 1,
        buyDate: '2018-09-11',
        notes: 'Boom mic for interviews',
        status: 'DAMAGED',
      },
    ]
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(seed))
    return seed
  }
  try {
    return JSON.parse(raw) as Equipment[]
  } catch (e) {
    return []
  }
}

export function saveInventory(items: Equipment[]) {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items))
}

export function loadJobs(): Job[] {
  const raw = localStorage.getItem(JOBS_KEY)
  if (!raw) {
    const today = new Date()
    const iso = today.toISOString().slice(0, 10)
    const seed: Job[] = [
      {
        id: uuid(),
        date: iso,
        title: 'Product shoot - Client: Lumen',
        location: 'Studio A',
        price: 1200,
        description: 'Small product shoot, require cameras, 85mm, mic',
        gear: [],
      },
    ]
    localStorage.setItem(JOBS_KEY, JSON.stringify(seed))
    return seed
  }
  try {
    return JSON.parse(raw) as Job[]
  } catch (e) {
    return []
  }
}

export function saveJobs(items: Job[]) {
  localStorage.setItem(JOBS_KEY, JSON.stringify(items))
}

export function clearAll() {
  localStorage.removeItem(INVENTORY_KEY)
  localStorage.removeItem(JOBS_KEY)
  localStorage.removeItem(AUTH_KEY)
}
