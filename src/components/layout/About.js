import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Code } from 'lucide-react';

const About = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            className="max-w-4xl mx-auto text-center py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="text-5xl font-extrabold text-primary mb-6"
                variants={itemVariants}
            >
                About DSAV
            </motion.h1>
            <motion.p 
                className="text-lg text-gray-300 mb-8"
                variants={itemVariants}
            >
                The <strong>Data Structure and Algorithm Visualizer (DSAV)</strong> is an interactive educational tool designed to make complex computer science concepts easier to understand. By providing real-time animations of core operations, this project aims to bridge the gap between theoretical knowledge and practical application.
            </motion.p>
            <motion.div 
                className="bg-surface/60 p-8 rounded-xl border border-secondary shadow-xl"
                variants={itemVariants}
            >
                <h2 className="text-3xl font-bold text-highlight mb-4">The Creator</h2>
                <p className="text-gray-400 mb-6">
                    This project was built by <strong>Mr. Coss</strong>, a passionate developer dedicated to creating intuitive and useful tools for the programming community.
                </p>
                <div className="flex justify-center items-center gap-6">
                    <a href="https://github.com/MrCoss" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
                        <Github />
                        <span>GitHub</span>
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text hover:text-primary transition-colors">
                        <Linkedin />
                        <span>LinkedIn</span>
                    </a>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default About;
