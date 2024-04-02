import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";

const StarWrapper = (Component, idName) =>
  function HOC() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 1172);
      };
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={`${styles.padding} mx-auto relative z-0`}
      >
        {isMobile ? null : (
          <span className="hash-span" id={idName}>
            &nbsp;
          </span>
        )}
        <Component />
      </motion.section>
    );
  };

export default StarWrapper;
