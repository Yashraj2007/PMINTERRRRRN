/**
 * Authentication middleware
 * Supports both Clerk JWT tokens and development mode
 */

const jwt = require("jsonwebtoken")
const config = require("../config")
const { logger } = require("../logger/logger")

/**
 * Verify JWT token (Clerk or custom)
 */
const verifyToken = (token) => {
  try {
    // If Clerk public key is available, use it
    if (config.CLERK_JWT_PUBLIC_KEY) {
      return jwt.verify(token, config.CLERK_JWT_PUBLIC_KEY, { algorithms: ["RS256"] })
    }

    // Fallback to custom JWT secret
    return jwt.verify(token, config.jwt.secret)
  } catch (error) {
    throw new Error("Invalid token")
  }
}

/**
 * Authentication middleware
 */
const authMiddleware = (options = {}) => {
  const { required = true, roles = [] } = options

  return async (req, res, next) => {
    try {
      let user = null

      // Development mode: check for dev header
      if (config.isDevelopment && req.headers["x-dev-user"]) {
        try {
          user = JSON.parse(req.headers["x-dev-user"])
          logger.debug("Using dev user", { userId: user.id })
        } catch (error) {
          logger.warn("Invalid dev user header", { header: req.headers["x-dev-user"] })
        }
      }

      // Production mode: check for JWT token
      if (!user) {
        const authHeader = req.headers.authorization
        if (authHeader && authHeader.startsWith("Bearer ")) {
          const token = authHeader.substring(7)
          const decoded = verifyToken(token)

          user = {
            id: decoded.sub || decoded.userId || decoded.id,
            email: decoded.email,
            mobile: decoded.mobile || decoded.phone_number,
            name: decoded.name || decoded.full_name,
            role: decoded.role || "user",
            clerkId: decoded.sub,
          }
        }
      }

      // Check if authentication is required
      if (required && !user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
          correlationId: req.correlationId,
        })
      }

      // Check role permissions
      if (user && roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions",
          correlationId: req.correlationId,
        })
      }

      // Attach user to request
      req.user = user
      next()
    } catch (error) {
      logger.error("Authentication error", error)

      if (required) {
        return res.status(401).json({
          success: false,
          message: "Invalid authentication",
          correlationId: req.correlationId,
        })
      }

      next()
    }
  }
}

/**
 * Admin authentication middleware
 */
const adminAuth = authMiddleware({ required: true, roles: ["admin"] })

/**
 * Optional authentication middleware
 */
const optionalAuth = authMiddleware({ required: false })

module.exports = {
  authMiddleware,
  adminAuth,
  optionalAuth,
  verifyToken,
}
