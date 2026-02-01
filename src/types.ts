export type EquipmentStatus = 'NEW' | 'OLD' | 'DAMAGED' | 'UNAVAILABLE'

export interface Equipment {
  id: string
  shortName: string
  fullName?: string
  value?: number
  defects?: string[]
  howMany: number
  buyDate?: string
  notes?: string
  status: EquipmentStatus
}

export interface JobGearItem {
  equipmentId: string
  quantity: number
  packed?: boolean
}

export interface Job {
  id: string
  date: string // ISO date of the job (yyyy-mm-dd)
  title: string
  location?: string
  price?: number
  description?: string
  gear: JobGearItem[]
}
