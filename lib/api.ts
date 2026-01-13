import { supabase } from './supabase'
import type { Timeline, Comment } from './types'

/**
 * Fetch all timelines from the database
 */
export const getTimelines = async (): Promise<Timeline[]> => {
  try {
    const { data, error } = await supabase
      .from('timelines')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching timelines:', error)
    throw error
  }
}

/**
 * Fetch a single timeline by ID
 */
export const getTimeline = async (id: number): Promise<Timeline> => {
  try {
    const { data, error } = await supabase
      .from('timelines')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching timeline:', error)
    throw error
  }
}

/**
 * Claim a timeline with email (no verification needed)
 */
export const claimTimeline = async (
  id: number,
  email: string
): Promise<{ message: string; timelineId: number; username: string }> => {
  try {
    // Get the username for this timeline
    const { data: timeline, error: timelineError } = await supabase
      .from('timelines')
      .select('username, email')
      .eq('id', id)
      .single()

    if (timelineError) throw timelineError
    if (!timeline) throw new Error('Timeline not found')

    // If this timeline already has an email
    if (timeline.email) {
      throw new Error('This timeline has already been claimed')
    }

    // Check if this email is already associated with a different username
    const { data: existing, error: checkError } = await supabase
      .from('timelines')
      .select('id, username, email')
      .eq('email', email)
      .not('email', 'is', null)

    if (checkError) throw checkError

    if (existing && existing.length > 0) {
      const differentUsername = existing.find(t => t.username !== timeline.username)
      if (differentUsername) {
        throw new Error('This email is already in use by another timeline.')
      }
    }

    // Claim the timeline immediately
    const { error: updateError } = await supabase
      .from('timelines')
      .update({
        email,
        email_verified: true,
        verification_token: null,
        verification_token_expires: null
      })
      .eq('id', id)

    if (updateError) throw updateError

    return {
      message: `✅ Timeline claimed successfully for ${timeline.username}!`,
      timelineId: id,
      username: timeline.username
    }
  } catch (error) {
    console.error('Error claiming timeline:', error)
    throw error
  }
}

/**
 * Format date string to YYYY-MM-DD
 */
export const formatDate = (dateStr?: string | null): string => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return '-'
  return date.toISOString().split('T')[0]
}

/**
 * Calculate days between two dates
 */
export const calculateDays = (startDate?: string | null, endDate?: string | null): string => {
  if (!startDate || !endDate) return '-'
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '-'
  const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  return days >= 0 ? `${days}d` : '-'
}

/**
 * Fetch all comments for a timeline (threaded)
 */
export const getTimelineComments = async (timelineId: number): Promise<Comment[]> => {
  try {
    const { data, error } = await supabase
      .from('timeline_comments')
      .select('*')
      .eq('timeline_id', timelineId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })

    if (error) throw error
    if (!data) return []

    // Thread comments client-side
    const topLevel = data.filter(c => !c.parent_comment_id)
    const replies = data.filter(c => c.parent_comment_id)

    topLevel.forEach(comment => {
      comment.replies = replies.filter(r => r.parent_comment_id === comment.id)
    })

    return topLevel as Comment[]
  } catch (error) {
    console.error('Error fetching timeline comments:', error)
    throw error
  }
}

/**
 * Post a new comment on a timeline
 */
export const postComment = async (
  timelineId: number,
  email: string,
  commentText: string,
  parentCommentId: number | null = null
): Promise<Comment> => {
  try {
    // Validate inputs
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required')
    }
    if (!commentText || commentText.trim().length === 0) {
      throw new Error('Comment cannot be empty')
    }
    if (commentText.length > 2000) {
      throw new Error('Comment must be less than 2000 characters')
    }

    // Check if this email owns ANY timeline
    const { data: userTimeline } = await supabase
      .from('timelines')
      .select('username, email')
      .eq('email', email)
      .eq('email_verified', true)
      .maybeSingle()

    const commenterUsername = userTimeline?.username || email.split('@')[0]

    // Check if they're the owner of THIS specific timeline
    const { data: thisTimeline } = await supabase
      .from('timelines')
      .select('email')
      .eq('id', timelineId)
      .single()

    const isTimelineOwner = thisTimeline && thisTimeline.email === email

    // Insert comment
    const { data, error } = await supabase
      .from('timeline_comments')
      .insert({
        timeline_id: timelineId,
        commenter_email: email,
        commenter_username: commenterUsername,
        comment_text: commentText.trim(),
        parent_comment_id: parentCommentId,
        is_timeline_owner: isTimelineOwner
      })
      .select()
      .single()

    if (error) throw error

    return data as Comment
  } catch (error) {
    console.error('Error posting comment:', error)
    throw error
  }
}

/**
 * Format timestamp as relative time
 */
export const formatRelativeTime = (dateStr?: string | null): string => {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`
  return `${Math.floor(seconds / 31536000)} years ago`
}

/**
 * Get all comments made by a specific user
 */
export const getUserComments = async (email: string): Promise<Comment[]> => {
  try {
    const { data: comments, error } = await supabase
      .from('timeline_comments')
      .select(`
        *,
        timelines!timeline_comments_timeline_id_fkey (*)
      `)
      .eq('commenter_email', email)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })

    if (error) throw error
    if (!comments) return []

    // For each comment, get replies
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const { data: replies, error: repliesError } = await supabase
          .from('timeline_comments')
          .select('id, created_at, commenter_username')
          .eq('parent_comment_id', comment.id)
          .eq('is_deleted', false)

        if (repliesError) throw repliesError

        return {
          ...comment,
          timeline: comment.timelines,
          reply_count: replies?.length || 0,
          replies: replies || []
        } as Comment
      })
    )

    return commentsWithReplies
  } catch (error) {
    console.error('Error fetching user comments:', error)
    throw error
  }
}

/**
 * Update timeline data
 */
export const updateTimeline = async (
  id: number,
  email: string,
  updates: Partial<Timeline>
): Promise<{ message: string }> => {
  try {
    // Verify ownership
    const { data: timeline, error: fetchError } = await supabase
      .from('timelines')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) throw fetchError

    if (!timeline.email_verified || timeline.email !== email) {
      throw new Error('Not authorized to edit this timeline')
    }

    // Update timeline
    const { error: updateError } = await supabase
      .from('timelines')
      .update({
        ...updates,
        last_updated_by_user: new Date().toISOString()
      })
      .eq('id', id)

    if (updateError) throw updateError

    return { message: '✅ Timeline updated successfully' }
  } catch (error) {
    console.error('Error updating timeline:', error)
    throw error
  }
}

/**
 * Create a new timeline
 */
export const createTimeline = async (
  timelineData: Partial<Timeline>
): Promise<{ timeline: Timeline; message: string }> => {
  try {
    const { data, error } = await supabase
      .from('timelines')
      .insert({
        ...timelineData,
        email_verified: true,
        data_source: 'user_submission',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return {
      timeline: data as Timeline,
      message: '✅ Timeline created successfully!'
    }
  } catch (error) {
    console.error('Error creating timeline:', error)
    throw error
  }
}
