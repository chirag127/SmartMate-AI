/**
 * Simple authentication middleware
 * In a production app, this would be more robust with JWT or other auth methods
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const auth = (req, res, next) => {
  // For now, we'll just check for a userId in the query or body
  // In a real app, this would validate a token or session
  const userId = req.query.userId || req.body.userId;
  
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  
  // Attach userId to request object for use in controllers
  req.userId = userId;
  
  next();
};

module.exports = auth;
