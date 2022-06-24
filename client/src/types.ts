/**
 * Global type definitions
 * 
 * All type definitions that are used throughout the app should
 * be store here in the root src directory
 */

export type tWorkout = {
  id: string
  author: string
  date: string
  time: string
  workout_body: string
}

export type tRecord = {
  id: string
  author: string
  date: string
  type: string
  event: string
  score: string
}

export type tConditionalEntry = tWorkout | tRecord

export type tCombinedEntry = tWorkout & tRecord

export type recordListTypes = {
  strength: string[]
  endurance: string[]
  wod: string[]
}
