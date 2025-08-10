import React from 'react';
import { motion } from 'framer-motion';

const ComplexityLineChart = ({ highlighted = [] }) => {
    const width = 300;
    const height = 150;
    const padding = 20;

    const complexities = {
        'O(1)': {
            path: `M ${padding},${height - padding - 5} H ${width - padding}`,
            color: '#3ddc97', // success green
            label: 'O(1)',
        },
        'O(log n)': {
            path: `M ${padding},${height - padding} Q ${width / 2},${height - padding * 2.5} ${width - padding},${height - padding * 3}`,
            color: '#53a9ff', // highlight blue
            label: 'O(log n)',
        },
        'O(n)': {
            path: `M ${padding},${height - padding} L ${width - padding},${padding}`,
            color: '#e94560', // primary pink
            label: 'O(n)',
        },
        'O(n log n)': {
             path: `M ${padding},${height - padding} Q ${width / 2},${height - padding * 1.5} ${width - padding},${padding * 0.5}`,
             color: '#f97316', // orange
             label: 'O(n log n)',
        },
        'O(n^2)': {
            path: `M ${padding},${height - padding} Q ${width - padding * 2},${height - padding} ${width - padding},${padding * 0.2}`,
            color: '#ef4444', // red
            label: 'O(n²)',
        }
    };

    return (
        <div className="mt-4">
             <h4 className="font-bold text-highlight mb-2">Complexity Growth</h4>
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-background/50 rounded-lg">
                {/* Axes */}
                <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#6b7280" strokeWidth="1" />
                <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#6b7280" strokeWidth="1" />
                <text x={width / 2} y={height - 5} textAnchor="middle" fill="#9ca3af" fontSize="8">Input Size (n)</text>
                <text x={padding - 5} y={height / 2} transform={`rotate(-90, ${padding - 5}, ${height/2})`} textAnchor="middle" fill="#9ca3af" fontSize="8">Operations</text>

                {/* Complexity Lines */}
                {Object.entries(complexities).map(([key, { path, color }]) => {
                    const isHighlighted = highlighted.includes(key);
                    return (
                        <g key={key}>
                            <motion.path
                                d={path}
                                fill="none"
                                stroke={color}
                                strokeWidth={isHighlighted ? 3 : 1.5}
                                strokeOpacity={isHighlighted ? 1 : 0.4}
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: 'easeInOut' }}
                            />
                            {isHighlighted && (
                               <text x={width - padding - 5} y={path.endsWith('H 280') ? 125 : (path.endsWith('L 280,20') ? 20 : (path.endsWith('3') ? 40 : 10))} textAnchor="end" fill={color} fontSize="10" className="font-bold">{key}</text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default ComplexityLineChart;
