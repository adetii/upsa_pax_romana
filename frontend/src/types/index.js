// Data models aligned with backend Laravel models

/**
 * Category model
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} status - 'active' | 'inactive'
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Position model
 * @typedef {Object} Position
 * @property {number} id
 * @property {number} category_id
 * @property {string} name
 * @property {string} description
 * @property {number} display_order
 * @property {string} status - 'active' | 'inactive'
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Category} category - Relationship
 * @property {Candidate[]} candidates - Relationship
 */

/**
 * Candidate model
 * @typedef {Object} Candidate
 * @property {number} id
 * @property {number} position_id
 * @property {string} name
 * @property {string} photo_url
 * @property {string} bio
 * @property {string} status - 'active' | 'inactive'
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Position} position - Relationship
 * @property {Vote[]} votes - Relationship
 */

/**
 * Vote model
 * @typedef {Object} Vote
 * @property {number} id
 * @property {number} candidate_id
 * @property {number} position_id
 * @property {string} payment_reference
 * @property {number} vote_count
 * @property {number} amount
 * @property {string|null} voter_phone
 * @property {string|null} voter_email
 * @property {string} payment_status - 'pending' | 'success' | 'failed'
 * @property {string|null} voted_at
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Candidate} candidate - Relationship
 * @property {Position} position - Relationship
 * @property {Payment} payment - Relationship
 */

/**
 * Payment model
 * @typedef {Object} Payment
 * @property {number} id
 * @property {string} reference
 * @property {number} amount
 * @property {string} status - 'pending' | 'success' | 'failed'
 * @property {string} email
 * @property {string|null} phone
 * @property {Object} metadata
 * @property {Object} paystack_response
 * @property {string} created_at
 * @property {string} updated_at
 * @property {Vote} vote - Relationship
 */

/**
 * User model (Admin)
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} role - 'admin' | 'super_admin'
 * @property {string|null} email_verified_at
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * Setting model
 * @typedef {Object} Setting
 * @property {number} id
 * @property {string} key
 * @property {string} value
 * @property {string|null} description
 * @property {string} created_at
 * @property {string} updated_at
 */

// API Response types

/**
 * Vote initialization response
 * @typedef {Object} VoteInitResponse
 * @property {string} authorization_url
 * @property {string} reference
 */

/**
 * Vote verification response
 * @typedef {Object} VoteVerifyResponse
 * @property {string} reference
 * @property {number} amount
 * @property {number} vote_count
 * @property {string} candidate_name
 * @property {string} position_name
 * @property {string} status
 * @property {string} message
 */

/**
 * Public results response item
 * @typedef {Object} PublicResultItem
 * @property {string} category
 * @property {string} position
 * @property {string} candidate
 * @property {number} total_votes
 */

/**
 * Admin dashboard stats
 * @typedef {Object} DashboardStats
 * @property {number} total_votes
 * @property {number} total_revenue
 * @property {number} total_candidates
 * @property {number} total_positions
 */

/**
 * Admin dashboard response
 * @typedef {Object} AdminDashboardResponse
 * @property {DashboardStats} cards
 * @property {Object[]} recent_transactions
 * @property {Object[]} recent_votes
 */

/**
 * Form data types
 */

/**
 * Vote form data
 * @typedef {Object} VoteFormData
 * @property {number} candidate_id
 * @property {number} position_id
 * @property {number} vote_count
 * @property {number} amount
 * @property {string} email
 * @property {string|null} phone
 */

/**
 * Candidate form data
 * @typedef {Object} CandidateFormData
 * @property {string} name
 * @property {string} bio
 * @property {number} position_id
 * @property {string} photo_url
 */

/**
 * Position form data
 * @typedef {Object} PositionFormData
 * @property {string} name
 * @property {string} description
 * @property {number} category_id
 * @property {number} display_order
 */

/**
 * User form data
 * @typedef {Object} UserFormData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} role
 */

export {
  // Export types for JSDoc usage
}