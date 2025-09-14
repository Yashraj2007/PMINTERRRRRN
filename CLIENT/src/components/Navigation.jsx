import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Chip,
  Tooltip,
  Fade,
  Slide,
} from "@mui/material"
import { 
  Menu as MenuIcon, 
  Close as CloseIcon, 
  Translate,
  Home,
  Person,
  Recommend,
  AdminPanelSettings
} from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [language, setLanguage] = useState("EN")
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Enhanced color palette with CSS custom properties support
  const colors = {
    primary: 'var(--nav-primary, #1e3a5f)',
    primaryLight: 'var(--nav-primary-light, #2c5282)',
    secondary: 'var(--nav-secondary, #f6a821)',
    accent: 'var(--nav-accent, #3d5a80)',
    background: 'var(--nav-background, #f8fafc)',
    surface: 'var(--nav-surface, #ffffff)',
    text: 'var(--nav-text, #2d3748)',
    textSecondary: 'var(--nav-text-secondary, #718096)',
    gradient: {
      primary: 'var(--nav-gradient-primary, linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3d5a80 100%))',
      secondary: 'var(--nav-gradient-secondary, linear-gradient(45deg, #ffffff 30%, #f6a821 90%))'
    }
  }

  // Language toggle function with smooth state transition
  const toggleLanguage = () => {
    setLanguage(prev => {
      if (prev === "EN") return "HI"
      if (prev === "HI") return "MR"
      return "EN"
    })
  }

  // Enhanced content with icons
  const getContent = () => {
    const iconMap = {
      home: <Home sx={{ mr: 1, fontSize: '20px' }} />,
      profile: <Person sx={{ mr: 1, fontSize: '20px' }} />,
      recommendations: <Recommend sx={{ mr: 1, fontSize: '20px' }} />,
      admin: <AdminPanelSettings sx={{ mr: 1, fontSize: '20px' }} />
    }

    switch(language) {
      case "HI":
        return {
          title: "PMIS सिफारिश इंजन",
          menuItems: [
            { label: "होम", path: "/", icon: iconMap.home },
            { label: "प्रोफाइल", path: "/profile", icon: iconMap.profile },
            { label: "सिफारिशें", path: "/recommendations", icon: iconMap.recommendations },
            { label: "एडमिन", path: "/admin", icon: iconMap.admin },
          ]
        }
      case "MR":
        return {
          title: "PMIS शिफारस इंजिन",
          menuItems: [
            { label: "होम", path: "/", icon: iconMap.home },
            { label: "प्रोफाईल", path: "/profile", icon: iconMap.profile },
            { label: "शिफारसे", path: "/recommendations", icon: iconMap.recommendations },
            { label: "अॅडमिन", path: "/admin", icon: iconMap.admin },
          ]
        }
      default:
        return {
          title: "PMIS Recommendation Engine",
          menuItems: [
            { label: "Home", path: "/", icon: iconMap.home },
            { label: "Profile", path: "/profile", icon: iconMap.profile },
            { label: "Recommendations", path: "/recommendations", icon: iconMap.recommendations },
            { label: "Admin", path: "/admin", icon: iconMap.admin },
          ]
        }
    }
  }

  const content = getContent()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setMobileOpen(false)
  }

  // Enhanced drawer with better styling and high contrast support
  const drawer = (
    <Box 
      className="nav-drawer"
      sx={{ 
        width: 280, 
        height: '100%',
        background: `linear-gradient(135deg, ${colors.surface} 0%, #f1f5f9 100%)`,
        borderLeft: `3px solid ${colors.secondary}`,
      }}
    >
      {/* Drawer Header */}
      <Box 
        className="nav-drawer-header"
        sx={{
          p: 3,
          borderBottom: `1px solid ${colors.accent}20`,
          background: colors.gradient.primary,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Tooltip title={`Switch Language - Current: ${language}`}>
              <IconButton 
                onClick={toggleLanguage}
                className="nav-language-toggle-mobile"
                sx={{ 
                  bgcolor: colors.secondary,
                  color: 'white',
                  '&:hover': { 
                    bgcolor: colors.secondary,
                    transform: 'scale(1.1) rotate(360deg)',
                    boxShadow: '0 8px 25px rgba(246, 168, 33, 0.3)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: 40,
                  height: 40
                }}
              >
                <Translate fontSize="small" />
              </IconButton>
            </Tooltip>
            <Chip 
              label={language} 
              className="nav-language-chip-mobile"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.15)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                borderRadius: '12px',
                minWidth: '50px',
                backdropFilter: 'blur(10px)'
              }}
            />
          </Box>
          <IconButton 
            onClick={handleDrawerToggle}
            className="nav-close-button"
            sx={{
              color: 'white',
              '&:hover': { 
                bgcolor: 'rgba(255,255,255,0.1)',
                transform: 'rotate(90deg)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white', 
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          Navigation
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ p: 2 }}>
        <AnimatePresence>
          {content.menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                button
                onClick={() => handleNavigation(item.path)}
                className={`nav-menu-item ${location.pathname === item.path ? 'nav-menu-item-active' : ''}`}
                sx={{
                  mb: 1,
                  borderRadius: '12px',
                  bgcolor: location.pathname === item.path ? 
                    `${colors.secondary}15` : "transparent",
                  border: location.pathname === item.path ? 
                    `2px solid ${colors.secondary}` : '2px solid transparent',
                  "&:hover": { 
                    bgcolor: `${colors.primary}10`,
                    transform: 'translateX(8px)',
                    boxShadow: `0 4px 20px ${colors.primary}20`
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <Box display="flex" alignItems="center" width="100%">
                  <Box 
                    className="nav-menu-icon"
                    sx={{ 
                      color: location.pathname === item.path ? colors.secondary : colors.text 
                    }}
                  >
                    {item.icon}
                  </Box>
                  <ListItemText 
                    primary={item.label}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontWeight: location.pathname === item.path ? 600 : 500,
                        color: location.pathname === item.path ? colors.secondary : colors.text,
                        fontSize: '0.95rem'
                      }
                    }}
                  />
                </Box>
              </ListItem>
            </motion.div>
          ))}
        </AnimatePresence>
      </List>
    </Box>
  )

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        className="nav-appbar"
        sx={{
          background: colors.gradient.primary,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.secondary}30`,
          boxShadow: '0 8px 32px rgba(30, 58, 95, 0.15)',
        }}
      >
        <Toolbar sx={{ minHeight: '70px !important', px: { xs: 2, md: 4 } }}>
          <motion.div 
            initial={{ x: -30, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <Typography
              variant="h5"
              component="div"
              className="nav-title"
              sx={{ 
                cursor: "pointer",
                fontWeight: 700,
                background: colors.gradient.secondary,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease'
              }}
              onClick={() => navigate("/")}
            >
              {content.title}
            </Typography>
          </motion.div>

          <Box sx={{ flexGrow: 1 }} />

          {isMobile ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <IconButton 
                color="inherit" 
                aria-label="open drawer" 
                edge="start" 
                onClick={handleDrawerToggle}
                className="nav-mobile-menu-button"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 20px rgba(255,255,255,0.2)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  width: 48,
                  height: 48
                }}
              >
                <MenuIcon />
              </IconButton>
            </motion.div>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              {/* Desktop Menu Items */}
              <Box display="flex" gap={1}>
                {content.menuItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    whileHover={{ y: -2 }}
                  >
                    <Button
                      color="inherit"
                      onClick={() => handleNavigation(item.path)}
                      startIcon={item.icon}
                      className={`nav-desktop-button ${location.pathname === item.path ? 'nav-desktop-button-active' : ''}`}
                      sx={{
                        px: 2.5,
                        py: 1.2,
                        borderRadius: '12px',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        textTransform: 'none',
                        position: 'relative',
                        bgcolor: location.pathname === item.path ? 
                          'rgba(255,255,255,0.15)' : "transparent",
                        color: location.pathname === item.path ? colors.secondary : 'white',
                        "&:hover": { 
                          bgcolor: 'rgba(255,255,255,0.2)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(255,255,255,0.15)'
                        },
                        "&:after": {
                          content: '""',
                          position: 'absolute',
                          bottom: 0,
                          left: '50%',
                          width: location.pathname === item.path ? '80%' : '0%',
                          height: '3px',
                          bgcolor: colors.secondary,
                          transform: 'translateX(-50%)',
                          borderRadius: '2px',
                          transition: 'width 0.3s ease'
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      {item.label}
                    </Button>
                  </motion.div>
                ))}
              </Box>

              {/* Language Toggle - Desktop */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Box display="flex" alignItems="center" gap={1.5} ml={2}>
                  <Tooltip title={`Switch Language - Current: ${language}`} arrow>
                    <IconButton 
                      onClick={toggleLanguage}
                      className="nav-language-toggle-desktop"
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        backdropFilter: 'blur(10px)',
                        border: `2px solid ${colors.secondary}40`,
                        '&:hover': { 
                          bgcolor: colors.secondary,
                          transform: 'scale(1.1) rotate(360deg)',
                          boxShadow: '0 8px 25px rgba(246, 168, 33, 0.4)'
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        width: 48,
                        height: 48
                      }}
                    >
                      <Translate />
                    </IconButton>
                  </Tooltip>
                  <Chip 
                    label={language} 
                    variant="outlined"
                    size="medium"
                    className="nav-language-chip-desktop"
                    sx={{ 
                      color: 'white',
                      borderColor: colors.secondary,
                      bgcolor: 'rgba(246, 168, 33, 0.1)',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      minWidth: '55px',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        bgcolor: 'rgba(246, 168, 33, 0.2)',
                        transform: 'scale(1.05)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        SlideProps={{
          direction: "left"
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxShadow: '-10px 0 30px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(20px)',
          }
        }}
      >
        <Slide direction="left" in={mobileOpen} mountOnEnter unmountOnExit>
          {drawer}
        </Slide>
      </Drawer>

      {/* Enhanced CSS with High Contrast Support */}
      <style jsx global>{`
        /* CSS Custom Properties for Navigation Color System */
        :root {
          --nav-primary: #1e3a5f;
          --nav-primary-light: #2c5282;
          --nav-secondary: #f6a821;
          --nav-accent: #3d5a80;
          --nav-background: #f8fafc;
          --nav-surface: #ffffff;
          --nav-text: #2d3748;
          --nav-text-secondary: #718096;
          --nav-gradient-primary: linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #3d5a80 100%);
          --nav-gradient-secondary: linear-gradient(45deg, #ffffff 30%, #f6a821 90%);
        }

        /* High Contrast Overrides for Navigation */
        .high-contrast {
          --nav-primary: var(--background-paper) !important;
          --nav-primary-light: var(--background-paper) !important;
          --nav-secondary: var(--accent-color) !important;
          --nav-accent: var(--accent-color) !important;
          --nav-background: var(--background-default) !important;
          --nav-surface: var(--background-paper) !important;
          --nav-text: var(--text-primary) !important;
          --nav-text-secondary: var(--text-secondary) !important;
          --nav-gradient-primary: var(--background-paper) !important;
          --nav-gradient-secondary: var(--accent-color) !important;
        }

        /* AppBar High Contrast Styling */
        .high-contrast .nav-appbar {
          background: var(--background-paper) !important;
          border-bottom: 3px solid var(--accent-color) !important;
          box-shadow: 0 4px 20px var(--shadow-color) !important;
        }

        /* Navigation Title High Contrast */
        .high-contrast .nav-title {
          background: var(--accent-color) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
        }

        /* Desktop Menu Buttons High Contrast */
        .high-contrast .nav-desktop-button {
          color: var(--text-primary) !important;
          border: 2px solid transparent !important;
        }

        .high-contrast .nav-desktop-button:hover {
          background: rgba(255, 235, 59, 0.1) !important;
          border-color: var(--accent-color) !important;
          box-shadow: 0 4px 12px var(--shadow-color) !important;
        }

        .high-contrast .nav-desktop-button-active {
          background: rgba(255, 235, 59, 0.2) !important;
          color: var(--accent-color) !important;
          border: 2px solid var(--accent-color) !important;
        }

        .high-contrast .nav-desktop-button-active::after {
          background: var(--accent-color) !important;
        }

        /* Mobile Menu Button High Contrast */
        .high-contrast .nav-mobile-menu-button {
          background: rgba(255, 235, 59, 0.1) !important;
          color: var(--accent-color) !important;
          border: 2px solid var(--accent-color) !important;
        }

        .high-contrast .nav-mobile-menu-button:hover {
          background: rgba(255, 235, 59, 0.2) !important;
          transform: scale(1.1) !important;
          box-shadow: 0 4px 20px var(--shadow-color) !important;
        }

        /* Language Toggle High Contrast */
        .high-contrast .nav-language-toggle-desktop,
        .high-contrast .nav-language-toggle-mobile {
          background: var(--accent-color) !important;
          color: var(--background-default) !important;
          border: 2px solid var(--border-color) !important;
        }

        .high-contrast .nav-language-toggle-desktop:hover,
        .high-contrast .nav-language-toggle-mobile:hover {
          background: var(--accent-color) !important;
          transform: scale(1.1) rotate(360deg) !important;
          box-shadow: 0 8px 25px var(--shadow-color) !important;
        }

        /* Language Chips High Contrast */
        .high-contrast .nav-language-chip-desktop,
        .high-contrast .nav-language-chip-mobile {
          background: rgba(255, 235, 59, 0.1) !important;
          color: var(--accent-color) !important;
          border-color: var(--accent-color) !important;
        }

        /* Drawer High Contrast Styling */
        .high-contrast .nav-drawer {
          background: var(--background-paper) !important;
          border-left: 3px solid var(--accent-color) !important;
        }

        .high-contrast .nav-drawer-header {
          background: var(--background-paper) !important;
          border-bottom: 2px solid var(--accent-color) !important;
        }

        .high-contrast .nav-close-button {
          color: var(--accent-color) !important;
          border: 1px solid var(--accent-color) !important;
        }

        .high-contrast .nav-close-button:hover {
          background: rgba(255, 235, 59, 0.1) !important;
          transform: rotate(90deg) !important;
        }

        /* Menu Items High Contrast */
        .high-contrast .nav-menu-item {
          background: transparent !important;
          border: 2px solid transparent !important;
        }

        .high-contrast .nav-menu-item:hover {
          background: rgba(255, 235, 59, 0.1) !important;
          border-color: var(--accent-color) !important;
          box-shadow: 0 4px 12px var(--shadow-color) !important;
          transform: translateX(8px) !important;
        }

        .high-contrast .nav-menu-item-active {
          background: rgba(255, 235, 59, 0.2) !important;
          border: 2px solid var(--accent-color) !important;
        }

        .high-contrast .nav-menu-icon {
          color: var(--accent-color) !important;
        }

        .high-contrast .nav-menu-item .MuiListItemText-primary {
          color: var(--text-primary) !important;
        }

        .high-contrast .nav-menu-item-active .MuiListItemText-primary {
          color: var(--accent-color) !important;
        }

        /* Enhanced Focus Management */
        .high-contrast .nav-desktop-button:focus-visible,
        .high-contrast .nav-mobile-menu-button:focus-visible,
        .high-contrast .nav-language-toggle-desktop:focus-visible,
        .high-contrast .nav-language-toggle-mobile:focus-visible {
          outline: 4px solid var(--accent-color) !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 8px rgba(255, 235, 59, 0.4) !important;
        }

        /* Smooth Transitions */
        .nav-appbar,
        .nav-title,
        .nav-desktop-button,
        .nav-mobile-menu-button,
        .nav-language-toggle-desktop,
        .nav-language-toggle-mobile,
        .nav-language-chip-desktop,
        .nav-language-chip-mobile,
        .nav-drawer,
        .nav-drawer-header,
        .nav-close-button,
        .nav-menu-item,
        .nav-menu-icon {
          transition: all 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
        }

        /* Hover Effects Enhancement */
        .high-contrast .nav-desktop-button:hover,
        .high-contrast .nav-menu-item:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px var(--shadow-color) !important;
        }
      `}</style>
    </>
  )
}

export default Navigation
