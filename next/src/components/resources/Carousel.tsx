import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "popmotion";
import images from "./image-data";
import { device } from "../../styles/device";

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    };
  }
};

const Example = () => {
  const [page, setPage] = useState(0);
  const imageIndex = wrap(0, images.length, page);

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((page) => page + 1);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <AnimatePresence initial={false} custom={1}>
        <motion.img
          key={page}
          src={images[imageIndex].url}
          custom={1}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          onClick={() => {
            window.open(images[imageIndex].link, '_blank');
          }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          style={{ width: "25%", position: "absolute", cursor: "pointer" }}
        />
      </AnimatePresence>
    </>
  );
};

export default Example;