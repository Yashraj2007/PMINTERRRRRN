/**
 * Authentication routes
 * Handles user authentication and authorization
 */

const express = require("express")
const jwt = require("jsonwebtoken")
const config = require("../config")
const { authMiddleware, optionalAuth } = require("../middlewares/authMiddleware")
const { logger } = require("../logger/logger")

const router = express.Router()

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get("/me", authMiddleware({ required: true }), async (req, res) => {
  try {
    const user = req.user

    res.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        mobile: user.mobile,
        name: user.name,
        role: user.role || "user",
        clerkId: user.clerkId,
      },
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("Get user info error", error)
    res.status(500).json({
      success: false,
      message: "Failed to get user information",
      correlationId: req.correlationId,
    })
  }
})

/**
 * POST /api/auth/token
 * Generate JWT token for development/testing
 */
router.post("/token", async (req, res) => {
  try {
    const { userId, email, mobile, name, role = "user" } = req.body

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        message: "userId and email are required",
        correlationId: req.correlationId,
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        sub: userId,
        userId,
        email,
        mobile,
        name,
        role,
        iat: Math.floor(Date.now() / 1000),
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn },
    )

    logger.info("JWT token generated", { userId, email, role })

    res.json({
      success: true,
      data: {
        token,
        user: {
          userId,
          email,
          mobile,
          name,
          role,
        },
        expiresIn: config.jwt.expiresIn,
      },
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("Token generation error", error)
    res.status(500).json({
      success: false,
      message: "Failed to generate token",
      correlationId: req.correlationId,
    })
  }
})

/**
 * POST /api/auth/verify
 * Verify JWT token
 */
router.post("/verify", async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token is required",
        correlationId: req.correlationId,
      })
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret)

      res.json({
        success: true,
        data: {
          valid: true,
          user: {
            userId: decoded.sub || decoded.userId,
            email: decoded.email,
            mobile: decoded.mobile,
            name: decoded.name,
            role: decoded.role,
          },
          expiresAt: new Date(decoded.exp * 1000),
        },
        correlationId: req.correlationId,
      })
    } catch (jwtError) {
      res.json({
        success: true,
        data: {
          valid: false,
          error: jwtError.message,
        },
        correlationId: req.correlationId,
      })
    }
  } catch (error) {
    logger.error("Token verification error", error)
    res.status(500).json({
      success: false,
      message: "Failed to verify token",
      correlationId: req.correlationId,
    })
  }
})

/**
 * GET /api/auth/status
 * Check authentication status
 */
router.get("/status", optionalAuth, async (req, res) => {
  try {
    const isAuthenticated = !!req.user

    res.json({
      success: true,
      data: {
        authenticated: isAuthenticated,
        user: isAuthenticated
          ? {
              userId: req.user.id,
              email: req.user.email,
              name: req.user.name,
              role: req.user.role,
            }
          : null,
      },
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("Auth status check error", error)
    res.status(500).json({
      success: false,
      message: "Failed to check authentication status",
      correlationId: req.correlationId,
    })
  }
})

module.exports = router
