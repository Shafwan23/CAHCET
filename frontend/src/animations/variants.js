export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (custom = 0) => ({
    opacity: 1,
    transition: { delay: custom, duration: 0.6, ease: "easeOut" }
  })
};

export const slideUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (custom = 0) => ({
    y: 0,
    opacity: 1,
    transition: { delay: custom, duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  })
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: (custom = 0) => ({
    scale: 1,
    opacity: 1,
    transition: { delay: custom, duration: 0.5, ease: "easeOut" }
  })
};

export const hoverLift = {
  whileHover: { y: -10, transition: { duration: 0.3 } }
};

export const navbarVariants = {
  hidden: { y: -100 },
  visible: { y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
};
