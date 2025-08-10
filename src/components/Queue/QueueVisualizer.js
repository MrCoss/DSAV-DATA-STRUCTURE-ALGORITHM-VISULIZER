import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Eye, XCircle, AlertTriangle } from 'lucide-react';

// Import shared components
import Controls from '../shared/Controls';
import ActionButton from '../shared/ActionButton';
import ValueInput from '../shared/ValueInput';
import CodeInsightBox from '../shared/CodeInsightBox';

const QueueVisualizer = () => {
    const [queue, setQueue] = useState([10, 25, 5]);
    const [value, setValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [error, setError] = useState('');

    // --- Code Insight Logic ---
    const getScript = (operation) => {
        const scripts = {
            enqueue: [
                'void enqueue(int value) {',
                '  // Add element to the rear',
                '  // ... implementation ...',
                '}',
            ],
            dequeue: [
                'int dequeue() {',
                '  // Remove element from the front',
                '  // ... implementation ...',
                '  return value;',
                '}',
            ],
            peek: [
                'int peek() {',
                '  // Return element from the front',
                '  // ... implementation ...',
                '  return front_value;',
                '}',
            ],
        };
        return scripts[operation] || scripts.enqueue;
    };

    const initialInsight = {
        title: 'Queue',
        script: getScript('enqueue'),
        highlightedLines: [],
        points: [
            'A FIFO (First-In, First-Out) data structure.',
            'Elements are added (<strong>enqueue</strong>) to the rear and removed (<strong>dequeue</strong>) from the front.',
            'Used in scheduling, print queues, and breadth-first search (BFS) algorithms.',
        ],
        complexity: {
            time: { 'Access/Search': 'O(n)', 'Enqueue/Dequeue': 'O(1)' },
            space: 'O(n)'
        }
    };

    const [insight, setInsight] = useState(initialInsight);

    const flashError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    };
    
    const highlightAndReset = (index, duration = 1500) => {
        setHighlightedIndex(index);
        setTimeout(() => setHighlightedIndex(null), duration);
    };

    // --- Operation Handlers ---
    const handleEnqueue = () => {
        setError('');
        const val = parseInt(value);
        if (isNaN(val)) {
            flashError("Please enter a valid number.");
            return;
        }
        
        const newQueue = [...queue, val];
        setQueue(newQueue);
        highlightAndReset(newQueue.length - 1);
        setInsight({
            title: 'Enqueue', script: getScript('enqueue'),
            points: [`Enqueuing value <strong>${val}</strong> to the rear of the queue.`],
            complexity: { time: { 'Operation': 'O(1)' }, space: 'O(1)' }
        });
        setValue('');
    };

    const handleDequeue = () => {
        setError('');
        if (queue.length === 0) {
            flashError("Queue is empty (underflow).");
            return;
        }
        
        highlightAndReset(0);
        setInsight({
            title: 'Dequeue', script: getScript('dequeue'),
            points: [`Dequeuing value <strong>${queue[0]}</strong> from the front of the queue.`],
            complexity: { time: { 'Operation': 'O(1)' }, space: 'O(1)' }
        });

        setTimeout(() => {
            setQueue(queue.slice(1));
        }, 500);
    };

    const handlePeek = () => {
        setError('');
        if (queue.length === 0) {
            flashError("Queue is empty.");
            return;
        }
        highlightAndReset(0);
        setInsight({
            title: 'Peek', script: getScript('peek'),
            points: [`Peeking at the front value: <strong>${queue[0]}</strong>.`],
            complexity: { time: { 'Operation': 'O(1)' }, space: 'O(1)' }
        });
    };

    const handleClear = () => {
        setError('');
        setQueue([]);
        setInsight(initialInsight);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div className="relative">
                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="absolute -top-14 left-1/2 -translate-x-1/2 w-full max-w-md bg-error text-white p-3 rounded-lg shadow-lg flex items-center gap-3"
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        >
                            <AlertTriangle />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="bg-surface/60 p-4 rounded-xl min-h-[20rem] border border-secondary shadow-xl flex justify-center items-center">
                    <div className="flex items-center gap-2">
                        {queue.length > 0 && <span className="text-primary font-bold">FRONT</span>}
                        <div className="flex items-center gap-2 p-4 bg-background/30 rounded-lg">
                            <AnimatePresence>
                                {queue.map((val, i) => (
                                    <motion.div
                                        key={i}
                                        layout
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5, x: -50, transition: { duration: 0.5 } }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    >
                                        <div
                                            className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${highlightedIndex === i ? 'bg-highlight text-background scale-110' : 'bg-secondary'}`}
                                        >
                                            {val}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                         {queue.length > 0 && <span className="text-highlight font-bold">REAR</span>}
                    </div>
                </div>
                <Controls>
                    <ValueInput value={value} onChange={e => setValue(e.target.value)} placeholder="Value" type="number" />
                    <ActionButton onClick={handleEnqueue}><ArrowRight size={18} /> Enqueue</ActionButton>
                    <ActionButton onClick={handleDequeue} className="bg-red-600 hover:bg-red-700 focus:ring-red-500"><ArrowLeft size={18} /> Dequeue</ActionButton>
                    <ActionButton onClick={handlePeek} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"><Eye size={18} /> Peek</ActionButton>
                    <ActionButton onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"><XCircle size={18} /> Clear</ActionButton>
                </Controls>
            </div>
            <CodeInsightBox {...insight} key={insight.title + insight.points[0]} />
        </div>
    );
};

export default QueueVisualizer;
