import { supabase } from './supabase'
import { getUserEmail } from './localStorage'

/**
 * Check if current user is an admin
 */
export const isAdmin = async (): Promise<boolean> => {
  try {
    const email = getUserEmail()
    if (!email) {
      return false
    }

    // Call the public function
    const { data, error } = await supabase
      .rpc('is_admin_user', { user_email: email })

    if (error) {
      console.error('Admin check error:', error)
      return false
    }

    return data === true
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Soft delete a timeline (admin only)
 */
export const softDeleteTimeline = async (timelineId: number): Promise<boolean> => {
  try {
    const adminEmail = getUserEmail()
    if (!adminEmail) {
      throw new Error('Admin email not found in localStorage')
    }

    // Call the stored procedure
    const { data, error } = await supabase.rpc('soft_delete_timeline', {
      timeline_id: timelineId,
      admin_email: adminEmail
    })

    if (error) throw error

    console.log('Timeline soft deleted:', timelineId)
    return true
  } catch (error) {
    console.error('Error soft deleting timeline:', error)
    throw error
  }
}

/**
 * Restore a deleted timeline (admin only)
 */
export const restoreTimeline = async (timelineId: number): Promise<boolean> => {
  try {
    const adminEmail = getUserEmail()
    if (!adminEmail) {
      throw new Error('Admin email not found in localStorage')
    }

    // Call the stored procedure
    const { data, error } = await supabase.rpc('restore_timeline', {
      timeline_id: timelineId,
      admin_email: adminEmail
    })

    if (error) throw error

    console.log('Timeline restored:', timelineId)
    return true
  } catch (error) {
    console.error('Error restoring timeline:', error)
    throw error
  }
}

/**
 * Permanently delete a timeline (admin only - use with extreme caution)
 */
export const permanentlyDeleteTimeline = async (timelineId: number): Promise<boolean> => {
  try {
    const adminEmail = getUserEmail()
    if (!adminEmail) {
      throw new Error('Not authorized - no email in localStorage')
    }

    // Verify admin status first
    const isAdminUser = await isAdmin()
    if (!isAdminUser) {
      throw new Error('Unauthorized: Admin access required')
    }

    // WARNING: This permanently deletes the record
    const { error } = await supabase
      .from('timelines')
      .delete()
      .eq('id', timelineId)

    if (error) throw error

    console.log('Timeline permanently deleted:', timelineId)
    return true
  } catch (error) {
    console.error('Permanent delete failed:', error)
    throw error
  }
}
