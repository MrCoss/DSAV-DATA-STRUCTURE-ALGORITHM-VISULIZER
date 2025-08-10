import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
    const loaderVariants = {
        animation: {
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            borderRadius: ["20%", "50%", "20%"],
            transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.5
            }
        }
    };

    return (
        <div className="flex justify-center items-center h-64">
            <motion.div
                style={{
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(45deg, #e94560, #53a9ff)',
                }}
                variants={loaderVariants}
                animate="animation"
            />
        </div>
    );
};

export default PageLoader;
