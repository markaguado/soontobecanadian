/**
 * SSR-Safe Local Storage Utility for Next.js
 * All functions check for browser environment before accessing localStorage
 */

import type { UserData, Timeline } from './types'

const STORAGE_KEY = 'immigration_timeline_user'

/**
 * Check if we're in the browser (not SSR)
 */
const isBrowser = (): boolean => typeof window !== 'undefined'

/**
 * Get user data from localStorage
 */
export const getUserData = (): UserData | null => {
  if (!isBrowser()) return null

  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return null

    const parsed = JSON.parse(data)
    return {
      email: parsed.email || null,
      claimedTimelines: parsed.claimedTimelines || [],
      username: parsed.username || null
    }
  } catch (error) {
    console.error('Error reading localStorage:', error)
    return null
  }
}

/**
 * Save user data to localStorage
 */
export const saveUserData = (
  email: string,
  timelineId: number,
  username: string
): UserData | null => {
  if (!isBrowser()) return null

  try {
    const existing = getUserData() || { email: null, claimedTimelines: [], username: null }

    if (email) existing.email = email
    if (username) existing.username = username

    if (timelineId && !existing.claimedTimelines.includes(timelineId)) {
      existing.claimedTimelines.push(timelineId)
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    return existing
  } catch (error) {
    console.error('Error saving to localStorage:', error)
    return null
  }
}

/**
 * Check if user has claimed a specific timeline
 */
export const hasClaimedTimeline = (timelineId: number): boolean => {
  if (!isBrowser()) return false

  const userData = getUserData()
  if (!userData) return false
  return userData.claimedTimelines.includes(timelineId)
}

/**
 * Get user's email from localStorage
 */
export const getUserEmail = (): string | null => {
  if (!isBrowser()) return null

  const userData = getUserData()
  return userData ? userData.email : null
}

/**
 * Get user's claimed timeline IDs
 */
export const getClaimedTimelineIds = (): number[] => {
  if (!isBrowser()) return []

  const userData = getUserData()
  return userData ? userData.claimedTimelines : []
}

/**
 * Clear user data (logout)
 */
export const clearUserData = (): void => {
  if (!isBrowser()) return

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}

/**
 * Check if current user owns this timeline
 */
export const canEditTimeline = (timeline: Timeline): boolean => {
  if (!isBrowser()) return false

  const userData = getUserData()
  if (!userData || !userData.email) return false

  return timeline.email === userData.email ||
         userData.claimedTimelines.includes(timeline.id)
}

/**
 * Mark comments as viewed for a timeline
 */
export const markCommentsAsViewed = (timelineId: number): void => {
  if (!isBrowser()) return

  try {
    const key = `comments_last_viewed_${timelineId}`
    localStorage.setItem(key, new Date().toISOString())
  } catch (error) {
    console.error('Error marking comments as viewed:', error)
  }
}

/**
 * Get last viewed timestamp for timeline comments
 */
export const getLastViewedCommentsTime = (timelineId: number): Date | null => {
  if (!isBrowser()) return null

  try {
    const key = `comments_last_viewed_${timelineId}`
    const timestamp = localStorage.getItem(key)
    return timestamp ? new Date(timestamp) : null
  } catch (error) {
    console.error('Error getting last viewed time:', error)
    return null
  }
}
