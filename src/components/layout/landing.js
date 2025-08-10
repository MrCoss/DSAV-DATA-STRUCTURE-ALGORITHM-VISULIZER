import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, GitBranch, Share2, Rows, Columns, Milestone, GitFork, BarChartHorizontal } from 'lucide-react';

// A simple substitute for Layers icon if not available
const Layers = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);

const dsItems = [
    { name: 'Array', path: '/array', icon: <Rows />, description: 'Contiguous memory with O(1) access.' },
    { name: 'Stack', path: '/stack', icon: <Layers />, description: 'LIFO structure for simple data management.' },
    { name: 'Queue', path: '/queue', icon: <Columns />, description: 'FIFO structure for ordered processing.' },
    { name: 'Linked List', path: '/linked-list', icon: <Milestone />, description: 'Nodes linked by pointers, allowing O(1) insertion.' },
    { name: 'Binary Search Tree', path: '/bst', icon: <GitBranch />, description: 'Hierarchical structure for O(log n) searching.' },
    { name: 'Graph', path: '/graph', icon: <GitFork />, description: 'Nodes and edges modeling complex networks.' },
    { name: 'Sorting', path: '/sorting', icon: <BarChartHorizontal />, description: 'Visualizing algorithms for ordering elements.' },
    { name: 'Hash Table', path: '/hash-table', icon: <Share2 />, description: 'Key-value pairs with O(1) average lookup.' },
];

const Landing = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <motion.div 
            className="text-center py-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="text-5xl md:text-6xl font-extrabold text-white mb-4"
                variants={itemVariants}
            >
                Welcome to the <span className="text-primary">DSA Visualizer</span>
            </motion.h1>
            <motion.p 
                className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
                variants={itemVariants}
            >
                An interactive platform to see data structures and algorithms in action. Choose a structure below to get started and explore its properties.
            </motion.p>
            
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
                variants={containerVariants}
            >
                {dsItems.map((item) => (
                    <motion.div key={item.name} variants={itemVariants}>
                        <Link to={item.path}>
                            <motion.div 
                                className="bg-surface/80 p-6 rounded-xl border border-secondary h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
                            >
                                <div className="text-primary mb-4">{React.cloneElement(item.icon, { size: 40, strokeWidth: 1.5 })}</div>
                                <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                                <p className="text-gray-400 mb-4">{item.description}</p>
                                <div className="flex items-center text-highlight font-semibold">
                                    <span>Visualize</span>
                                    <ArrowRight size={18} className="ml-1" />
                                </div>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
};


export default Landing;
