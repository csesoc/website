import React from "react"

// issue with framer motion, reverting back to old es5 import style
// https://stackoverflow.com/questions/69933933/next-js-syntaxerror-when-using-framer-motion
const { motion } = require("framer-motion");

type Props = {
  children?: any
}

export const Spin = ({children}: Props) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1 }}
  >
    {children}
  </motion.div>
)

export const FadeIn = ({children}: Props) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
)


export const SlideInFromLeft = ({children}: Props) => (
  <motion.div
    initial={{ opacity: 0, x: -200 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 2, type: "spring", stiffness: 100}}
  >
    {children}
  </motion.div>
)

export const SlideInFromRight = ({children}: Props) => (
  <motion.div
    initial={{ opacity: 0, x: 200 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 2, type: "spring", stiffness: 100}}
  >
    {children}
  </motion.div>
)

export const SectionFadeInFromLeft = ({children}: Props) => (
  <motion.div
    initial={{ opacity: 0, x: "-100%" }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    // animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 2, type: "spring", stiffness: 100}}
  >
    {children}
  </motion.div>
)

export const SectionFadeInFromRight = ({children}: Props) => (
  <motion.div
    initial={{ opacity: 0, x: "100%" }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    // animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 2, type: "spring", stiffness: 100}}
  >
    {children}
  </motion.div>
)

// https://codesandbox.io/s/framer-motion-split-text-o1r7d?from-embed=&file=/src/index.js:628-923
export const TypewriterAnimation = ({ children }: Props) => {
  const words = children.split('')

  const params = {
    initial : { y: '100%' },
    animate : "visible",
    variants : {
      visible: (i:any) => ({
        y: 0,
        transition: {
          delay: i * 0.08
        }
      })
    },
  }

  return words.map((word:any, i:any) => {
    return (
      <div
        key={children + i}
        style={{ display: 'inline-block', overflow: 'hidden', height:"auto" }}
      >
        <motion.div
          {...params}
          style={{ display: 'inline-block', willChange: 'transform' }}
          custom={i}
        >
          {word + (word == ' ' ? '\u00A0' : '')}
        </motion.div>
      </div>
    )
  })
}
