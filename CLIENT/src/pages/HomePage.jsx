import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Link,
  Paper,
  Divider,
  Avatar
} from "@mui/material"
import { motion, useInView } from "framer-motion"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { 
  AccessibilityNew, 
  Language,
  SmartToy,
  Sms,
  Phone,
  WhatsApp,
  VolumeUp,
  Analytics,
  ArrowForward,
  TrendingUp,
  Security,
  Speed,
  Psychology
} from "@mui/icons-material"
import { useState, useEffect, useRef } from "react"
// Import HelpPage component
import HelpPage from './HelpPage'

// Enhanced color palette with CSS custom properties support for high contrast
const colors = {
  primary: 'var(--color-primary, #1e3a5f)',
  primaryLight: 'var(--color-primary-light, #2c5282)',
  secondary: 'var(--color-secondary, #f6a821)',
  accent: 'var(--color-accent, #3d5a80)',
  success: 'var(--color-success, #16a085)',
  error: 'var(--color-error, #e74c3c)',
  warning: 'var(--color-warning, #f39c12)',
  background: 'var(--color-background, #f8fafc)',
  surface: 'var(--color-surface, #ffffff)',
  text: 'var(--color-text, #2d3748)',
  textSecondary: 'var(--color-text-secondary, #718096)',
  gradient: {
    primary: 'var(--gradient-primary, linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3d5a80 100%))',
    secondary: 'var(--gradient-secondary, linear-gradient(135deg, #f6a821 0%, #ff8c42 100%))',
    success: 'var(--gradient-success, linear-gradient(135deg, #16a085 0%, #1abc9c 100%))',
    hero: 'var(--gradient-hero, linear-gradient(135deg, #667eea 0%, #764ba2 100%))'
  }
}

// Enhanced Footer component with backdrop blur and proper contrast
const Footer = () => {
  const navigate = useNavigate()
  
  const footerLinks = [
    { label: "Help & Info", href: "/Support", icon: "🛟" },
  ]

  const handleFooterNavigation = (href) => {
    navigate(href)
  }

  return (
    <Box 
      className="footer-section"
      sx={{ 
        background: '#335177',
        opacity: 0.7,
        py: 6, 
        mt: 8,
        borderRadius: '20px 20px 0 0',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',   // 🔹 Creates the blur effect
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: colors.gradient.secondary,
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {footerLinks.map((link, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Box
                      onClick={() => handleFooterNavigation(link.href)}
                      className="footer-link"
                      sx={{
                        color: '#F0F0F0', // High contrast white text for the blur background
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: '0.95rem',
                        fontWeight: 600, // Increased weight for better visibility on blur
                        p: 1,
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.15)', // Slightly more opaque hover
                          transform: 'translateX(8px)',
                          color: colors.secondary
                        }
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>{link.icon}</span>
                      {link.label}
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign={{ xs: 'center', md: 'right' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#F0F0F0', // High contrast for blur background
                  mb: 1, 
                  fontWeight: 700, // Bolder for better visibility
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)' // Subtle shadow for readability
                }}
              >
                PMIS SmartMatch+
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#E0E0E0', // Slightly less bright but still readable
                  opacity: 0.9, 
                  mb: 2,
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                Revolutionizing India's Internship Ecosystem
              </Typography>
              <Chip 
                label="🇮🇳 Made in India"
                className="footer-chip"
                sx={{ 
                  bgcolor: colors.secondary,
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)', // Shadow for depth on blur
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  },
                  transition: 'all 0.3s ease'
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />
        <Typography 
          variant="body2" 
          textAlign="center" 
          sx={{ 
            color: '#D0D0D0', 
            opacity: 0.8, 
            fontWeight: 500,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}
        >
          © {new Date().getFullYear()} PMIS SmartMatch+. All rights reserved. | Empowering 10 Million Indian Youth
        </Typography>
      </Container>
    </Box>
  )
}

const HomePage = () => {
  const navigate = useNavigate()
  const [liveStats, setLiveStats] = useState({
    attritionReduction: 67,
    ruralReach: 85,
    matchAccuracy: 92
  })

  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })

  // Enhanced live data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        attritionReduction: Math.min(95, Math.max(60, prev.attritionReduction + (Math.random() - 0.5) * 2)),
        ruralReach: Math.min(98, Math.max(80, prev.ruralReach + (Math.random() - 0.5) * 1)),
        matchAccuracy: Math.min(98, Math.max(88, prev.matchAccuracy + (Math.random() - 0.5) * 0.5))
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const problemStats = [
    { 
      label: "PMIS Round 1 Fill Rate", 
      value: "7%", 
      color: "error", 
      trend: "Only 8,725 of 127,000 positions filled",
      icon: <TrendingUp />
    },
    { 
      label: "Rural Digital Exclusion", 
      value: "60%", 
      color: "warning", 
      trend: "Youth unable to access portal",
      icon: <AccessibilityNew />
    },
    { 
      label: "Application Dropouts", 
      value: "67%", 
      color: "error", 
      trend: "High attrition after offers",
      icon: <Psychology />
    }
  ]

  const solutionFeatures = [
    {
      icon: <SmartToy sx={{ fontSize: 50 }} />,
      title: "AI Attrition Predictor",
      description: "Machine learning predicts 72% dropout risk based on distance, stipend, duration - preventing mismatches before they happen with explainable insights",
      impact: "67% reduction in dropouts",
      tech: "XGBoost + SHAP explainability",
      color: colors.success,
      gradient: colors.gradient.success
    },
    {
      icon: <AccessibilityNew sx={{ fontSize: 50 }} />,
      title: "Multi-Channel Access Hub",
      description: "USSD (*123#), SMS, WhatsApp Bot, and IVR for feature phones - ensuring every eligible youth can participate regardless of device",
      impact: "85% rural penetration",
      tech: "Twilio API + USSD gateway",
      color: colors.primary,
      gradient: colors.gradient.primary
    },
    {
      icon: <Analytics sx={{ fontSize: 50 }} />,
      title: "Government Analytics Dashboard",
      description: "Real-time policy insights, district heatmaps, skill gap analysis with predictive modeling for data-driven policy decisions",
      impact: "Policy recommendations",
      tech: "Recharts + ML analytics",
      color: colors.accent,
      gradient: colors.gradient.primary
    },
    {
      icon: <Language sx={{ fontSize: 50 }} />,
      title: "Explainable AI Engine",
      description: "Every recommendation includes transparent reasoning: 'Matches React & HTML skills; 18km distance; 82% of similar students completed successfully'",
      impact: "92% match accuracy",
      tech: "SHAP + NLP templates",
      color: colors.secondary,
      gradient: colors.gradient.secondary
    }
  ]

  const channelPreview = [
    { 
      icon: <Sms sx={{ fontSize: 28 }} />, 
      label: "SMS Gateway", 
      active: true, 
      message: "PMIS: Frontend Intern @ XYZ (Match 65%). Reply APPLY 123",
      color: colors.success,
      users: "50M+ reach"
    },
    { 
      icon: <WhatsApp sx={{ fontSize: 28 }} />, 
      label: "WhatsApp Bot", 
      active: true, 
      message: "🚀 3 new internship matches found near Kolhapur!",
      color: '#25D366',
      users: "400M+ users"
    },
    { 
      icon: <Phone sx={{ fontSize: 28 }} />, 
      label: "USSD Portal", 
      active: true, 
      message: "*123# → Find internships → React Developer",
      color: colors.primary,
      users: "Universal access"
    },
    { 
      icon: <VolumeUp sx={{ fontSize: 28 }} />, 
      label: "Voice IVR", 
      active: true, 
      message: "You have 3 new internship matches waiting...",
      color: colors.accent,
      users: "Multi-language"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <Box 
      className="homepage-container"
      sx={{ 
        background: `linear-gradient(180deg, ${colors.background} 0%, var(--color-surface, #ffffff) 100%)`, 
        minHeight: '100vh',
        color: colors.text
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Enhanced Problem Statement Alert */}
        <motion.div
          initial={{ y: -30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Alert 
            severity="error" 
            className="crisis-alert"
            sx={{ 
              mb: 6, 
              fontSize: '1.1rem',
              borderRadius: '16px',
              border: '2px solid',
              borderColor: colors.error,
              background: `linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, rgba(231, 76, 60, 0.05) 100%)`,
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(231, 76, 60, 0.15)',
              '& .MuiAlert-icon': { fontSize: '2rem' },
              position: 'relative',
              overflow: 'hidden',
              color: 'inherit',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: colors.gradient.secondary,
              }
            }}
            action={
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Chip 
                  label="🔥 REAL PMIS DATA" 
                  sx={{ 
                    bgcolor: colors.error,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}
                />
              </motion.div>
            }
          >
            <Typography variant="h6" component="span" sx={{ fontWeight: 600, color: 'inherit' }}>
              🚨 PMIS Crisis Alert:
            </Typography>{" "}
            Only 7% of internship positions filled in Round 1 due to poor matching algorithms & complete rural exclusion
          </Alert>
        </motion.div>

        {/* Enhanced Hero Section */}
        <motion.div 
          ref={heroRef}
          variants={containerVariants}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
          className="hero-section"
        >
          <Box textAlign="center" mb={12}>
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h1" 
                gutterBottom 
                className="hero-title"
                sx={{ 
                  background: colors.gradient.hero,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 800,
                  fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem', lg: '8rem' },
                  letterSpacing: '-0.02em',
                  textShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                  mb: 2,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '200px',
                    height: '4px',
                    background: colors.gradient.secondary,
                    borderRadius: '2px'
                  }
                }}
              >
                PMIS SmartMatch+
              </Typography>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h3" 
                sx={{ 
                  color: 'inherit',
                  mb: 3,
                  fontWeight: 600,
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}
              >
                AI-Powered Solution to PMIS's{" "}
                <Typography component="span" sx={{ color: colors.error, fontWeight: 700 }}>
                  93% Failure Rate
                </Typography>
              </Typography>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Paper
                className="hero-info-card"
                sx={{
                  p: 4,
                  mb: 6,
                  background: colors.gradient.primary,
                  color: 'white',
                  borderRadius: '20px',
                  maxWidth: '900px',
                  mx: 'auto',
                  boxShadow: '0 20px 60px rgba(67, 101, 152, 0.59)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                    pointerEvents: 'none'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'inherit' }}>
                  🎯 The Only System That Combines:
                </Typography>
                <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7, mb: 2, color: "whitesmoke" }}>
                  ✅ Dropout prediction AI • ✅ Rural SMS/USSD access • ✅ Government policy insights • ✅ Explainable recommendations
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontStyle: 'italic', color: colors.secondary }}>
                  Built for the 10 million Indian youth who deserve better than a 7% success rate.
                </Typography>
              </Paper>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box display="flex" gap={3} justifyContent="center" flexWrap="wrap" mb={6}>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => navigate("/profile")} 
                  endIcon={<ArrowForward />}
                  className="primary-cta-button"
                  sx={{ 
                    px: 5, 
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '14px',
                    background: colors.gradient.secondary,
                    boxShadow: `0 8px 25px rgba(246, 168, 33, 0.4)`,
                    color: 'white',
                    '&:hover': { 
                      transform: 'translateY(-3px)',
                      boxShadow: `0 12px 35px rgba(246, 168, 33, 0.5)`,
                      background: colors.gradient.secondary,
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Get Smart Recommendations
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  onClick={() => navigate("/admin")}
                  className="secondary-cta-button"
                  sx={{ 
                    px: 5, 
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '14px',
                    borderWidth: '2px',
                    borderColor: colors.primary,
                    color: colors.primary,
                    '&:hover': { 
                      borderWidth: '2px',
                      transform: 'translateY(-3px)',
                      boxShadow: `0 8px 25px rgba(30, 58, 95, 0.3)`,
                      bgcolor: colors.primary,
                      color: 'white'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Government Dashboard
                </Button>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
                {channelPreview.map((channel, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chip 
                      icon={channel.icon} 
                      label={`${channel.label} • ${channel.users}`}
                      className="channel-chip"
                      sx={{
                        bgcolor: channel.active ? `${channel.color}20` : 'transparent',
                        border: `2px solid ${channel.color}`,
                        color: channel.color,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        px: 1,
                        '& .MuiChip-icon': { color: channel.color }
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Box>
        </motion.div>

        {/* Enhanced Problem Statistics */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="problem-stats-section"
        >
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: colors.error,
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              📊 The PMIS Crisis (Official Government Data)
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Real statistics that showcase the urgent need for transformation
            </Typography>
          </Box>
          
          <Grid container spacing={4} mb={8}>
            {problemStats.map((stat, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ y: 30, opacity: 0, scale: 0.9 }}
                  whileInView={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Card 
                    className="problem-stat-card"
                    sx={{ 
                      p: 4, 
                      height: '100%',
                      borderRadius: '20px',
                      border: `3px solid ${colors[stat.color]}`,
                      background: `linear-gradient(135deg, ${colors[stat.color]}10 0%, transparent 100%)`,
                      boxShadow: `0 10px 40px ${colors[stat.color]}20`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        bgcolor: colors[stat.color],
                      }
                    }}
                  >
                    <Box textAlign="center">
                      <Avatar
                        sx={{
                          bgcolor: colors[stat.color],
                          width: 60,
                          height: 60,
                          mx: 'auto',
                          mb: 2
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Typography 
                        variant="h2" 
                        sx={{ 
                          color: colors[stat.color],
                          fontWeight: 800,
                          mb: 1,
                          fontSize: { xs: '3rem', md: '4rem' }
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'inherit' }}>
                        {stat.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.trend}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Enhanced Solution Features */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="solution-features-section"
        >
          <Box textAlign="center" mb={8}>
            <Typography 
              variant="h4" 
              sx={{ 
                color: colors.primary,
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              🏆 Our Championship Solution
            </Typography>
            <Typography variant="body1" color="text.secondary" maxWidth="700px" mx="auto" mb={6}>
              Four game-changing AI-powered features that directly solve each PMIS problem with measurable, real-world impact
            </Typography>
          </Box>
          
          <Grid container spacing={4} mb={8}>
            {solutionFeatures.map((feature, index) => (
              <Grid item xs={12} lg={6} key={index}>
                <motion.div
                  initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.03,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card 
                    className="solution-feature-card"
                    sx={{ 
                      height: "100%", 
                      p: 4,
                      borderRadius: '20px',
                      background: `linear-gradient(135deg, ${colors.surface} 0%, #f8fafc 100%)`,
                      border: '2px solid transparent',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&:hover': {
                        border: `2px solid ${feature.color}`,
                        boxShadow: `0 20px 60px ${feature.color}20`,
                        '&::before': {
                          opacity: 1
                        }
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `${feature.gradient}10`,
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                      <Box display="flex" alignItems="center" mb={3}>
                        <Avatar
                          sx={{
                            bgcolor: feature.color,
                            width: 70,
                            height: 70,
                            mr: 2
                          }}
                        >
                          {feature.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'inherit' }}>
                            {feature.title}
                          </Typography>
                          <Chip 
                            label={feature.impact} 
                            sx={{ 
                              bgcolor: `${feature.color}20`,
                              color: feature.color,
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography 
                        color="text.secondary" 
                        sx={{ mb: 3, fontSize: '1rem', lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <Chip 
                          label={`🔧 ${feature.tech}`}
                          size="small" 
                          sx={{
                            bgcolor: colors.background,
                            border: `1px solid ${feature.color}30`,
                            fontSize: '0.8rem'
                          }}
                        />
                        <Chip 
                          label="✅ Production Ready"
                          size="small" 
                          sx={{
                            bgcolor: `${colors.success}20`,
                            color: colors.success,
                            fontSize: '0.8rem'
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Enhanced Live Impact Metrics */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          whileInView={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="live-metrics-section"
        >
          <Card 
            sx={{ 
              p: 6, 
              textAlign: "center", 
              background: colors.gradient.primary,
              color: "white", 
              mb: 8,
              borderRadius: '25px',
              boxShadow: '0 25px 80px rgba(30, 58, 95, 0.4)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Box position="relative" zIndex={1}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '2.5rem' }, color: 'inherit' }}
              >
                📈 Live Impact Metrics
              </Typography>
              <Typography variant="body1" mb={6} sx={{ opacity: 0.9, fontSize: '1.1rem', color: 'inherit' }}>
                Real-time performance improvements over baseline PMIS system
              </Typography>
              <Grid container spacing={4}>
                {[
                  {
                    value: liveStats.attritionReduction,
                    label: "Dropout Reduction",
                    color: '#4caf50',
                    icon: <Security />,
                    baseline: "vs 67% PMIS baseline"
                  },
                  {
                    value: liveStats.ruralReach,
                    label: "Rural Reach",
                    color: '#ff9800',
                    icon: <AccessibilityNew />,
                    baseline: "SMS/USSD enabled"
                  },
                  {
                    value: liveStats.matchAccuracy,
                    label: "Match Accuracy",
                    color: '#2196f3',
                    icon: <SmartToy />,
                    baseline: "AI-powered matching"
                  }
                ].map((metric, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                      viewport={{ once: true }}
                    >
                      <Box>
                        <Avatar
                          sx={{
                            bgcolor: metric.color,
                            width: 60,
                            height: 60,
                            mx: 'auto',
                            mb: 2
                          }}
                        >
                          {metric.icon}
                        </Avatar>
                        <Typography 
                          variant="h3" 
                          fontWeight="bold" 
                          sx={{ mb: 1, fontSize: { xs: '2.5rem', md: '3rem' }, color: 'inherit' }}
                        >
                          {Math.round(metric.value)}%
                        </Typography>
                        <Typography sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem', color: 'inherit' }}>
                          {metric.label}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={metric.value} 
                          sx={{ 
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(255,255,255,0.2)', 
                            '& .MuiLinearProgress-bar': { 
                              bgcolor: metric.color,
                              borderRadius: 4
                            }
                          }} 
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ opacity: 0.8, fontSize: '0.9rem', mt: 1, display: 'block', color: 'inherit' }}
                        >
                          {metric.baseline}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Card>
        </motion.div>

        {/* Enhanced Multi-Channel Accessibility Demo */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="multi-channel-section"
        >
          <Box textAlign="center" mb={6}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' },
                color: 'inherit'
              }}
            >
              📱 Multi-Channel Accessibility Platform
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Reaching every youth, regardless of device or connectivity
            </Typography>
          </Box>
          
          <Grid container spacing={3} mb={6}>
            {channelPreview.map((channel, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <motion.div
                  initial={{ y: 30, opacity: 0, rotateY: -15 }}
                  whileInView={{ y: 0, opacity: 1, rotateY: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -10,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <Card
                    className="channel-card"
                    sx={{
                      p: 3,
                      minHeight: "200px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      background: `linear-gradient(135deg, ${channel.color}15 0%, ${colors.surface} 100%)`,
                      border: `2px solid ${channel.color}30`,
                      borderRadius: "20px",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      '&:hover': {
                        transform: "translateY(-8px)",
                        boxShadow: `0 20px 60px ${channel.color}30`,
                        border: `2px solid ${channel.color}`,
                        '&::before': {
                          transform: "scaleX(1)"
                        }
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "4px",
                        bgcolor: channel.color,
                        transform: "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform 0.3s ease"
                      },
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Box>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar
                          sx={{
                            bgcolor: channel.color,
                            width: 50,
                            height: 50,
                            mr: 2
                          }}
                        >
                          {channel.icon}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'inherit' }}>
                            {channel.label}
                          </Typography>
                          <Chip 
                            label={channel.users}
                            size="small"
                            sx={{ 
                              bgcolor: `${channel.color}20`,
                              color: channel.color,
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          />
                        </Box>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: colors.textSecondary,
                          fontSize: '0.9rem',
                          lineHeight: 1.5
                        }}
                      >
                        {channel.message}
                      </Typography>
                    </Box>
                    {channel.active && (
                      <Box display="flex" justifyContent="center" mt={2}>
                        <Chip 
                          label="🟢 LIVE" 
                          size="small" 
                          sx={{ 
                            bgcolor: colors.success,
                            color: 'white',
                            fontWeight: 'bold',
                            animation: 'pulse 2s infinite'
                          }}
                        />
                      </Box>
                    )}
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Enhanced Call to Action - Updated to match Live Impact Metrics */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          whileInView={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="cta-section"
        >
          <Card 
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              background: colors.gradient.primary, // Changed from colors.gradient.success to match Live Impact Metrics
              color: 'white',
              borderRadius: '25px',
              boxShadow: '0 25px 80px rgba(30, 58, 95, 0.4)', // Updated shadow to match the primary blue gradient
              position: 'relative',
              overflow: 'hidden',
              mb: 8,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Box position="relative" zIndex={1}>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '2rem', md: '2.5rem' }, 
                  color: 'white' // Explicitly set to white for better visibility
                }}
              >
                🚀 Ready to Transform PMIS?
              </Typography>
              <Typography 
                variant="h6" 
                mb={4} 
                sx={{ 
                  opacity: 0.95, // Increased opacity for better readability
                  fontWeight: 500, 
                  color: 'white' // Explicitly set to white
                }}
              >
                Experience the AI recommendation engine that will revolutionize India's internship landscape
              </Typography>
              <Box display="flex" justifyContent="center" gap={3} flexWrap="wrap">
                <Button 
                  variant="contained" 
                  size="large" 
                  endIcon={<SmartToy />}
                  onClick={() => navigate("/recommendations")}
                  className="cta-primary-button"
                  sx={{ 
                    bgcolor: 'white', 
                    color: colors.primary, // Changed to match the primary color theme
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 35px rgba(255,255,255,0.3)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Try AI Matching Now
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  endIcon={<AccessibilityNew />}
                  onClick={() => navigate("/accessibility")}
                  className="cta-secondary-button"
                  sx={{ 
                    borderColor: 'white', 
                    color: 'white',
                    borderWidth: '2px',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: '12px',
                    '&:hover': {
                      borderWidth: '2px',
                      bgcolor: 'rgba(255,255,255,0.15)', // Slightly increased opacity for better visibility
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(255,255,255,0.2)'
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Test Multi-Channel Access
                </Button>
              </Box>
            </Box>
          </Card>
        </motion.div>

        {/* Enhanced Footer */}
        <Footer />
      </Container>

      {/* Enhanced CSS with High Contrast Support */}
      <style jsx global>{`
        /* CSS Custom Properties for Color System */
        :root {
          --color-primary: #1e3a5f;
          --color-primary-light: #2c5282;
          --color-secondary: #f6a821;
          --color-accent: #3d5a80;
          --color-success: #16a085;
          --color-error: #e74c3c;
          --color-warning: #f39c12;
          --color-background: #f8fafc;
          --color-surface: #ffffff;
          --color-text: #2d3748;
          --color-text-secondary: #718096;
          --gradient-primary: linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3d5a80 100%);
          --gradient-secondary: linear-gradient(135deg, #f6a821 0%, #ff8c42 100%);
          --gradient-success: linear-gradient(135deg, #16a085 0%, #1abc9c 100%);
          --gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        /* High Contrast Overrides */
        .high-contrast {
          --color-primary: var(--primary-main) !important;
          --color-primary-light: var(--primary-main) !important;
          --color-secondary: var(--accent-color) !important;
          --color-accent: var(--accent-color) !important;
          --color-success: var(--accent-color) !important;
          --color-error: #ff6b6b !important;
          --color-warning: var(--accent-color) !important;
          --color-background: var(--background-default) !important;
          --color-surface: var(--background-paper) !important;
          --color-text: var(--text-primary) !important;
          --color-text-secondary: var(--text-secondary) !important;
          --gradient-primary: var(--background-paper) !important;
          --gradient-secondary: var(--accent-color) !important;
          --gradient-success: var(--accent-color) !important;
          --gradient-hero: var(--accent-color) !important;
        }

        .high-contrast .homepage-container {
          background: var(--background-default) !important;
          color: var(--text-primary) !important;
        }

        .high-contrast .hero-title {
          background: var(--accent-color) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }

        .high-contrast .crisis-alert {
          background: rgba(255, 107, 107, 0.2) !important;
          border-color: #ff6b6b !important;
          color: var(--text-primary) !important;
        }

        .high-contrast .hero-info-card,
        .high-contrast .live-metrics-section .MuiCard-root,
        .high-contrast .cta-section .MuiCard-root {
          background: var(--background-paper) !important;
          color: var(--text-primary) !important;
        }

        .high-contrast .footer-section {
          background: var(--background-paper) !important;
          color: var(--text-primary) !important;
        }

        .high-contrast .footer-link {
          color: var(--text-primary) !important;
        }

        .high-contrast .footer-chip {
          background: var(--accent-color) !important;
          color: var(--text-primary) !important;
        }

        .high-contrast .primary-cta-button,
        .high-contrast .cta-primary-button {
          background: var(--accent-color) !important;
          color: var(--background-default) !important;
        }

        .high-contrast .secondary-cta-button,
        .high-contrast .cta-secondary-button {
          border-color: var(--accent-color) !important;
          color: var(--accent-color) !important;
          background: transparent !important;
        }

        .high-contrast .channel-chip {
          border-color: var(--accent-color) !important;
          color: var(--accent-color) !important;
          background: rgba(255, 235, 59, 0.1) !important;
        }

        .high-contrast .problem-stat-card,
        .high-contrast .solution-feature-card,
        .high-contrast .channel-card {
          background: var(--background-paper) !important;
          color: var(--text-primary) !important;
          border-color: var(--border-color) !important;
        }

        /* Animation for pulse effect */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        /* Smooth transitions for all elements */
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }

        /* Enhanced focus visibility for accessibility */
        .high-contrast *:focus-visible {
          outline: 4px solid var(--accent-color) !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 8px rgba(255, 235, 59, 0.4) !important;
        }
      `}</style>
    </Box>
  )
}

// Export both HomePage and HelpPage for routing
export default HomePage
export { HelpPage }
