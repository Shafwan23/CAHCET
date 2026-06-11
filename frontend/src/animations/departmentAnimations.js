export const departmentAnimations = {
  // Cinematic Dashboard Page Transition
  cinematicPageTransition: {
    initial: { opacity: 0, scale: 0.98, filter: 'blur(10px)', y: 20 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)', 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      filter: 'blur(10px)', 
      y: -20,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } 
    }
  },

  // Stagger children for lists/grids (GPU Optimized)
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  },

  // Generic fade up for individual items
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  },

  // Accordion / Expanding Card
  accordionContent: {
    open: { 
      opacity: 1, 
      height: "auto",
      marginTop: "1rem",
      transition: { duration: 0.4, ease: "circOut" }
    },
    collapsed: { 
      opacity: 0, 
      height: 0,
      marginTop: 0,
      transition: { duration: 0.3, ease: "circIn" }
    }
  },

  // Modal backdrop and content
  modalBackdrop: {
    hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
    visible: { opacity: 1, backdropFilter: 'blur(12px)', transition: { duration: 0.4 } }
  },
  modalContent: {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
  },

  // Sidebar link active indicator
  activeIndicator: {
    layoutId: "sidebarActiveIndicator",
    initial: false,
    transition: { type: "spring", stiffness: 400, damping: 30 }
  }
};
