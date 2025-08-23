import { supabase } from './supabase'

export const saveReview = async (reviewData) => {
  try {
    const { data, error } = await supabase
      .from('pr_reviews')
      .insert([
        {
          pr_id: reviewData.prId,
          pr_title: reviewData.prTitle,
          pr_url: reviewData.prUrl,
          review_content: reviewData.reviewContent,
          user_email: reviewData.userEmail,
          created_at: new Date().toISOString()
        }
      ])
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error saving review:', error)
    return { success: false, error: error.message }
  }
}

export const getUserReviews = async (userEmail) => {
  try {
    const { data, error } = await supabase
      .from('pr_reviews')
      .select('*')
      .eq('user_email', userEmail)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return { success: false, error: error.message }
  }
}

export const deleteReview = async (reviewId) => {
  try {
    const { error } = await supabase
      .from('pr_reviews')
      .delete()
      .eq('id', reviewId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting review:', error)
    return { success: false, error: error.message }
  }
}

export const getReviewByPrId = async (prId, userEmail) => {
  try {
    const { data, error } = await supabase
      .from('pr_reviews')
      .select('*')
      .eq('pr_id', prId.toString())
      .eq('user_email', userEmail)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is "not found"
    return { success: true, data: data || null }
  } catch (error) {
    console.error('Error fetching review by PR ID:', error)
    return { success: false, error: error.message }
  }
}