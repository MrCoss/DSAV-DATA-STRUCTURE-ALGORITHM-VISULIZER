import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

const CodeInsightBox = ({ title, script, highlightedLines = [], points = [], complexity = {} }) => {
    return (
        <motion.div 
            className="bg-surface p-6 rounded-xl border border-secondary shadow-2xl animate-fadeIn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-2xl font-bold text-primary mb-4">{title}</h3>
            
            {/* Code Snippet */}
            <div className="bg-background p-4 rounded-lg mb-6">
                <pre className="text-sm">
                    {script.map((line, index) => (
                        <motion.div
                            key={index}
                            className={`transition-all duration-300 p-1 rounded ${highlightedLines.includes(index) ? 'bg-primary/20 text-white' : 'text-gray-400'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <code>{line}</code>
                        </motion.div>
                    ))}
                </pre>
            </div>

            {/* Key Points */}
            <div className="mb-6">
                <h4 className="font-bold text-highlight mb-2">Key Points</h4>
                <ul className="space-y-2">
                    {points.map((point, index) => (
                        <motion.li 
                            key={index} 
                            className="flex items-start gap-2 text-text"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-1" />
                            <span dangerouslySetInnerHTML={{ __html: point }} />
                        </motion.li>
                    ))}
                </ul>
            </div>

            {/* Complexity Analysis */}
            <div>
                <h4 className="font-bold text-highlight mb-3">Complexity</h4>
                <div className="flex flex-col sm:flex-row gap-4">
                    {complexity.time && (
                        <div className="flex-1 bg-background/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2"><Clock size={16} /> Time Complexity</h5>
                            <div className="flex justify-around text-center text-xs">
                                {Object.entries(complexity.time).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="font-bold text-primary">{value}</div>
                                        <div className="text-gray-400">{key}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {complexity.space && (
                        <div className="flex-1 bg-background/50 p-3 rounded-lg">
                            <h5 className="font-semibold text-sm mb-2 flex items-center gap-2"><Clock size={16} /> Space Complexity</h5>
                            <div className="text-center text-xs">
                                <div className="font-bold text-primary">{complexity.space}</div>
                                <div className="text-gray-400">Overall</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CodeInsightBox;
