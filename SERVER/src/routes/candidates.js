/**
 * Candidates routes
 * Handles candidate profile management
 */

const express = require("express")
const { z } = require("zod")
const Candidate = require("../models/Candidate")
const { authMiddleware, optionalAuth } = require("../middlewares/authMiddleware")
const { logger } = require("../logger/logger")

const router = express.Router()

// Validation schemas
const candidateSchema = z.object({
  mobile: z.string().regex(/^\+91\d{10}$/, "Invalid mobile number format"),
  name: z.string().min(2).max(100),
  language: z.enum(["en", "hi", "mr"]).optional(),
  education: z.object({
    level: z.enum(["10th", "12th", "Diploma", "UG", "PG", "PhD"]),
    field: z.string().min(2).max(100),
    year: z
      .number()
      .int()
      .min(1990)
      .max(new Date().getFullYear() + 5),
    verified: z.boolean().optional(),
    institution: z.string().max(200).optional(),
    percentage: z.number().min(0).max(100).optional(),
  }),
  skills: z
    .array(
      z.object({
        name: z.string().min(1).max(50),
        canonical: z.string().min(1).max(50),
        confidence: z.number().min(0).max(1).optional(),
        source: z.enum(["user", "inferred", "verified"]).optional(),
      }),
    )
    .min(1),
  location: z.object({
    district: z.string().min(2).max(100),
    state: z.string().min(2).max(100),
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
    pincode: z.string().optional(),
  }),
  preferences: z
    .object({
      distancePref: z.enum(["local", "state", "any"]).optional(),
      workType: z.enum(["onsite", "remote", "either"]).optional(),
      minStipend: z.number().min(0).optional(),
      sectors: z.array(z.string()).optional(),
      startDate: z.string().datetime().optional(),
      duration: z
        .object({
          min: z.number().int().min(1).optional(),
          max: z.number().int().min(1).optional(),
        })
        .optional(),
    })
    .optional(),
})

/**
 * GET /api/candidates/:id
 * Get candidate profile by ID
 */
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params

    const candidate = await Candidate.findById(id)
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
        correlationId: req.correlationId,
      })
    }

    // Update last active timestamp
    await candidate.updateLastActive()

    res.json({
      success: true,
      data: candidate,
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("Get candidate error", error)
    res.status(500).json({
      success: false,
      message: "Failed to get candidate",
      correlationId: req.correlationId,
    })
  }
})

/**
 * POST /api/candidates
 * Create or update candidate profile
 */
router.post("/", optionalAuth, async (req, res) => {
  try {
    // Validate request body
    const validatedData = candidateSchema.parse(req.body)

    // Check if candidate already exists
    const existingCandidate = await Candidate.findByMobile(validatedData.mobile)

    if (existingCandidate) {
      // Update existing candidate
      Object.assign(existingCandidate, {
        ...validatedData,
        location: {
          type: "Point",
          coordinates: [validatedData.location.lon, validatedData.location.lat],
          district: validatedData.location.district,
          state: validatedData.location.state,
          pincode: validatedData.location.pincode,
        },
        updatedAt: new Date(),
      })

      await existingCandidate.save()

      logger.info("Candidate profile updated", {
        candidateId: existingCandidate._id,
        mobile: existingCandidate.maskedMobile,
      })

      return res.json({
        success: true,
        data: {
          candidateId: existingCandidate._id,
          isNew: false,
          candidate: existingCandidate,
        },
        correlationId: req.correlationId,
      })
    }

    // Create new candidate
    const newCandidate = new Candidate({
      ...validatedData,
      location: {
        type: "Point",
        coordinates: [validatedData.location.lon, validatedData.location.lat],
        district: validatedData.location.district,
        state: validatedData.location.state,
        pincode: validatedData.location.pincode,
      },
      clerkId: req.user?.clerkId,
      metadata: {
        ...validatedData.metadata,
        source: "web",
        lastActive: new Date(),
      },
    })

    await newCandidate.save()

    logger.info("New candidate created", {
      candidateId: newCandidate._id,
      mobile: newCandidate.maskedMobile,
    })

    res.status(201).json({
      success: true,
      data: {
        candidateId: newCandidate._id,
        isNew: true,
        candidate: newCandidate,
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

    logger.error("Create candidate error", error)
    res.status(500).json({
      success: false,
      message: "Failed to create candidate",
      correlationId: req.correlationId,
    })
  }
})

/**
 * PUT /api/candidates/:id
 * Update candidate profile
 */
router.put("/:id", authMiddleware({ required: true }), async (req, res) => {
  try {
    const { id } = req.params

    // Validate request body (partial update)
    const updateSchema = candidateSchema.partial()
    const validatedData = updateSchema.parse(req.body)

    const candidate = await Candidate.findById(id)
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
        correlationId: req.correlationId,
      })
    }

    // Update candidate data
    Object.assign(candidate, {
      ...validatedData,
      ...(validatedData.location && {
        location: {
          type: "Point",
          coordinates: [validatedData.location.lon, validatedData.location.lat],
          district: validatedData.location.district,
          state: validatedData.location.state,
          pincode: validatedData.location.pincode,
        },
      }),
      updatedAt: new Date(),
    })

    await candidate.save()

    logger.info("Candidate updated", {
      candidateId: candidate._id,
      mobile: candidate.maskedMobile,
    })

    res.json({
      success: true,
      data: candidate,
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

    logger.error("Update candidate error", error)
    res.status(500).json({
      success: false,
      message: "Failed to update candidate",
      correlationId: req.correlationId,
    })
  }
})

/**
 * GET /api/candidates
 * List candidates with filtering and pagination
 */
router.get("/", authMiddleware({ required: true, roles: ["admin"] }), async (req, res) => {
  try {
    const { page = 1, limit = 20, district, state, educationLevel, status = "active", skills, search } = req.query

    // Build query
    const query = {}
    if (district) query["location.district"] = district
    if (state) query["location.state"] = state
    if (educationLevel) query["education.level"] = educationLevel
    if (status) query.status = status
    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim().toLowerCase())
      query["skills.canonical"] = { $in: skillsArray }
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { "education.field": { $regex: search, $options: "i" } },
      ]
    }

    // Execute query with pagination
    const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const candidates = await Candidate.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number.parseInt(limit))

    const total = await Candidate.countDocuments(query)

    res.json({
      success: true,
      data: {
        candidates,
        pagination: {
          page: Number.parseInt(page),
          limit: Number.parseInt(limit),
          total,
          pages: Math.ceil(total / Number.parseInt(limit)),
        },
      },
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("List candidates error", error)
    res.status(500).json({
      success: false,
      message: "Failed to list candidates",
      correlationId: req.correlationId,
    })
  }
})

/**
 * GET /api/candidates/mobile/:mobile
 * Find candidate by mobile number
 */
router.get("/mobile/:mobile", optionalAuth, async (req, res) => {
  try {
    const { mobile } = req.params

    // Validate mobile format
    if (!/^\+91\d{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number format",
        correlationId: req.correlationId,
      })
    }

    const candidate = await Candidate.findByMobile(mobile)
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
        correlationId: req.correlationId,
      })
    }

    res.json({
      success: true,
      data: candidate,
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("Find candidate by mobile error", error)
    res.status(500).json({
      success: false,
      message: "Failed to find candidate",
      correlationId: req.correlationId,
    })
  }
})

/**
 * POST /api/candidates/:id/skills
 * Add skill to candidate
 */
router.post("/:id/skills", authMiddleware({ required: true }), async (req, res) => {
  try {
    const { id } = req.params
    const { name, canonical, confidence = 1 } = req.body

    if (!name || !canonical) {
      return res.status(400).json({
        success: false,
        message: "Skill name and canonical name are required",
        correlationId: req.correlationId,
      })
    }

    const candidate = await Candidate.findById(id)
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
        correlationId: req.correlationId,
      })
    }

    await candidate.addSkill(name, canonical, confidence)

    res.json({
      success: true,
      data: candidate,
      correlationId: req.correlationId,
    })
  } catch (error) {
    logger.error("Add skill error", error)
    res.status(500).json({
      success: false,
      message: "Failed to add skill",
      correlationId: req.correlationId,
    })
  }
})

module.exports = router
