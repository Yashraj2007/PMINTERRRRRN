/**
 * Recommendations routes
 * Handles internship recommendation requests
 */

const express = require("express")
const { z } = require("zod")
const Candidate = require("../models/Candidate")
const {
  getTopKRecommendations,
  getRecommendationsWithCache,
  getSimilarCandidates,
  analyzeRecommendationPerformance,
} = require("../services/recommendService")
const { optionalAuth, authMiddleware } = require("../middlewares/authMiddleware")
const { logger } = require("../logger/logger")

const router = express.Router()

// Validation schemas
const recommendationRequestSchema = z.object({
  candidateId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid candidate ID")
    .optional(),
  candidateProfile: z
    .object({
      mobile: z.string().optional(),
      name: z.string().optional(),
      education: z
        .object({
          level: z.string(),
          field: z.string(),
          year: z.number(),
        })
        .optional(),
      skills: z
        .array(
          z.object({
            name: z.string(),
            canonical: z.string(),
            confidence: z.number().optional(),
          }),
        )
        .optional(),
      location: z
        .object({
          district: z.string(),
          state: z.string(),
          lat: z.number(),
          lon: z.number(),
        })
        .optional(),
      preferences: z
        .object({
          distancePref: z.enum(["local", "state", "any"]).optional(),
          workType: z.enum(["onsite", "remote", "either"]).optional(),
          minStipend: z.number().optional(),
          sectors: z.array(z.string()).optional(),
        })
        .optional(),
    })
    .optional(),
  limit: z.number().int().min(1).max(20).optional(),
  forceRefresh: z.boolean().optional(),
})

/**
 * POST /api/recommendations
 * Get personalized internship recommendations
 */
router.post("/", optionalAuth, async (req, res) => {
  try {
    // Validate request body
    const validatedData = recommendationRequestSchema.parse(req.body)
    const { candidateId, candidateProfile, limit = 5, forceRefresh = false } = validatedData

    let candidate = null

    // Get candidate data
    if (candidateId) {
      candidate = await Candidate.findById(candidateId)
      if (!candidate) {
        return res.status(404).json({
          success: false,
          message: "Candidate not found",
          correlationId: req.correlationId,
        })
      }
    } else if (candidateProfile) {
      // Create temporary candidate object for recommendation
      candidate = {
        _id: "temp_" + Date.now(),
        ...candidateProfile,
        location: candidateProfile.location
          ? {
              type: "Point",
              coordinates: [candidateProfile.location.lon, candidateProfile.location.lat],
              district: candidateProfile.location.district,
              state: candidateProfile.location.state,
            }
          : null,
        skills: candidateProfile.skills || [],
        preferences: candidateProfile.preferences || {},
        education: candidateProfile.education || {},
        analytics: {},
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Either candidateId or candidateProfile is required",
        correlationId: req.correlationId,
      })
    }

    // Get recommendations
    let recommendations
    if (candidateId && !forceRefresh) {
      recommendations = await getRecommendationsWithCache(candidateId, limit, forceRefresh)
    } else {
      recommendations = await getTopKRecommendations(candidate, limit)
    }

    logger.info("Recommendations generated", {
      candidateId: candidate._id,
      recommendationCount: recommendations.length,
      topScore: recommendations[0]?.matchScore || 0,
    })

    res.json({
      success: true,
      data: recommendations,
      meta: {
        candidateId: candidate._id,
        generatedAt: new Date().toISOString(),
        algorithm: "rule_based_v1",
        count: recommendations.length,
      },
      correlationId: req.correlationId,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
        correlationId: req.correlationId,
      })
    }

    logger.error("Get recommendations error", error)
    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
      correlationId: req.correlationId,
    })
  }
})

/**
 * GET /api/recommendations/:candidateId
 * Get cached recommendations for a candidate
 */
router.get("/:candidateId", optionalAuth, async (req, res) => {
  try {
    const { candidateId } = req.params
    const { limit = 5, refresh = false } = req.query

    // Validate candidate ID format
    if (!/^[0-9a-fA-F]{24}$/.test(candidateId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid candidate ID format",
        correlationId: req.correlationId,
      })
    }

    const recommendations = await getRecommendationsWithCache(candidateId, Number.parseInt(limit), refresh === "true")

    res.json({
      success: true,
      data: recommendations,
      meta: {
        candidateId,
        cached: refresh !== "true",
        generatedAt: new Date().toISOString(),
        count: recommendations.length,
      },
      correlationId: req.correlationId,
    })
  } catch (error) {
    if (error.message === "Candidate not found") {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
        correlationId: req.correlationId,
      })
    }

    logger.error("Get cached recommendations error", error)
    res.status(500).json({
      success: false,
      message: "Failed to get recommendations",
      correlationId: req.correlationId,
    })
  }
})

/**
 * GET /api/recommendations/internship/:internshipId/candidates
 * Get similar candidates for an internship (admin only)
 */
router.get(
  "/internship/:internshipId/candidates",
  authMiddleware({ required: true, roles: ["admin"] }),
  async (req, res) => {
    try {
      const { internshipId } = req.params
      const { limit = 10 } = req.query

      // Validate internship ID format
      if (!/^[0-9a-fA-F]{24}$/.test(internshipId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid internship ID format",
          correlationId: req.correlationId,
        })
      }

      const candidates = await getSimilarCandidates(internshipId, Number.parseInt(limit))

      res.json({
        success: true,
        data: candidates,
        meta: {
          internshipId,
          generatedAt: new Date().toISOString(),
          count: candidates.length,
        },
        correlationId: req.correlationId,
      })
    } catch (error) {
      if (error.message === "Internship not found") {
        return res.status(404).json({
          success: false,
          message: "Internship not found",
          correlationId: req.correlationId,
        })
      }

      logger.error("Get similar candidates error", error)
      res.status(500).json({
        success: false,
        message: "Failed to get similar candidates",
        correlationId: req.correlationId,
      })
    }
  },
)

/**
 * GET /api/recommendations/performance
 * Get recommendation performance analytics (admin only)
 */
router.get("/performance", authMiddleware({ required: true, roles: ["admin"] }), async (req, res) => {
  try {
    const { from, to } = req.query

    const dateRange = {}
    if (from) dateRange.from = from
    if (to) dateRange.to = to

    const performance = await analyzeRecommendationPerformance(dateRange)

    res.json({
      success: true,
      data: performance,
      meta: {
        dateRange,
        generatedAt: new Date().toISOString(),
      },
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("Get recommendation performance error", error)
    res.status(500).json({
      success: false,
      message: "Failed to get recommendation performance",
      correlationId: req.correlationId,
    })
  }
})

/**
 * POST /api/recommendations/batch
 * Get recommendations for multiple candidates (admin only)
 */
router.post("/batch", authMiddleware({ required: true, roles: ["admin"] }), async (req, res) => {
  try {
    const { candidateIds, limit = 5 } = req.body

    if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "candidateIds array is required",
        correlationId: req.correlationId,
      })
    }

    if (candidateIds.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Maximum 50 candidates allowed per batch",
        correlationId: req.correlationId,
      })
    }

    const results = []
    const errors = []

    // Process candidates in parallel (with concurrency limit)
    const concurrency = 5
    for (let i = 0; i < candidateIds.length; i += concurrency) {
      const batch = candidateIds.slice(i, i + concurrency)

      const batchPromises = batch.map(async (candidateId) => {
        try {
          const recommendations = await getRecommendationsWithCache(candidateId, limit)
          return {
            candidateId,
            recommendations,
            success: true,
          }
        } catch (error) {
          return {
            candidateId,
            error: error.message,
            success: false,
          }
        }
      })

      const batchResults = await Promise.all(batchPromises)

      for (const result of batchResults) {
        if (result.success) {
          results.push(result)
        } else {
          errors.push(result)
        }
      }
    }

    logger.info("Batch recommendations generated", {
      totalRequested: candidateIds.length,
      successful: results.length,
      failed: errors.length,
    })

    res.json({
      success: true,
      data: {
        results,
        errors,
        summary: {
          totalRequested: candidateIds.length,
          successful: results.length,
          failed: errors.length,
        },
      },
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("Batch recommendations error", error)
    res.status(500).json({
      success: false,
      message: "Failed to process batch recommendations",
      correlationId: req.correlationId,
    })
  }
})

module.exports = router
