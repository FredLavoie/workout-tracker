/**
 * Global type definitions
 * 
 * All type definitions that are used throughout the app should
 * be store here in the root src directory
 */

// used in CalendarGrid
export type workoutType = {
  id: number
  author: string
  date: string
  time: string
  workout_body: string
}

export type recordType = {
  id: number
  author: string
  date: string
  type: string
  event: string
  score: string
}

export type recordListTypes = {
  strength: string[]
  endurance: string[]
  wod: string[]
}
