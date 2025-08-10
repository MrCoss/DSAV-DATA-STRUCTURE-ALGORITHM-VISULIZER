import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, LogOut, Eye, XCircle, AlertTriangle } from 'lucide-react';

// Import shared components
import Controls from '../shared/Controls';
import ActionButton from '../shared/ActionButton';
import ValueInput from '../shared/ValueInput';
import CodeInsightBox from '../shared/CodeInsightBox';

const StackVisualizer = () => {
    const [stack, setStack] = useState([10, 25, 5]);
    const [value, setValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [error, setError] = useState('');

    // --- Code Insight Logic ---
    const getScript = (operation) => {
        const scripts = {
            push: [
                'void push(int value) {',
                '  if (top >= MAX_SIZE - 1) {',
                '    // Handle stack overflow',
                '    return;',
                '  }',
                '  arr[++top] = value;',
                '}',
            ],
            pop: [
                'int pop() {',
                '  if (top < 0) {',
                '    // Handle stack underflow',
                '    return -1;',
                '  }',
                '  return arr[top--];',
                '}',
            ],
            peek: [
                'int peek() {',
                '  if (top < 0) {',
                '    // Handle stack underflow',
                '    return -1;',
                '  }',
                '  return arr[top];',
                '}',
            ],
        };
        return scripts[operation] || scripts.push;
    };

    const initialInsight = {
        title: 'Stack',
        script: getScript('push'),
        highlightedLines: [],
        points: [
            'A LIFO (Last-In, First-Out) data structure.',
            'Elements are added (<strong>push</strong>) and removed (<strong>pop</strong>) from the same end, called the "top".',
            'Commonly used for managing function calls, parsing expressions, and undo features.',
        ],
        complexity: {
            time: { 'Access/Search': 'O(n)', 'Push/Pop': 'O(1)' },
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
    const handlePush = () => {
        setError('');
        const val = parseInt(value);
        if (isNaN(val)) {
            flashError("Please enter a valid number.");
            return;
        }
        
        const newStack = [...stack, val];
        setStack(newStack);
        highlightAndReset(newStack.length - 1);
        setInsight({
            title: 'Push', script: getScript('push'), highlightedLines: [5],
            points: [`Pushing value <strong>${val}</strong> onto the stack.`],
            complexity: { time: { 'Operation': 'O(1)' }, space: 'O(1)' }
        });
        setValue('');
    };

    const handlePop = () => {
        setError('');
        if (stack.length === 0) {
            flashError("Stack is empty (underflow).");
            return;
        }
        
        highlightAndReset(stack.length - 1);
        setInsight({
            title: 'Pop', script: getScript('pop'), highlightedLines: [5],
            points: [`Popping value <strong>${stack[stack.length - 1]}</strong> from the stack.`],
            complexity: { time: { 'Operation': 'O(1)' }, space: 'O(1)' }
        });

        setTimeout(() => {
            setStack(stack.slice(0, -1));
        }, 500);
    };

    const handlePeek = () => {
        setError('');
        if (stack.length === 0) {
            flashError("Stack is empty.");
            return;
        }
        highlightAndReset(stack.length - 1);
        setInsight({
            title: 'Peek', script: getScript('peek'), highlightedLines: [5],
            points: [`Peeking at the top value: <strong>${stack[stack.length - 1]}</strong>.`],
            complexity: { time: { 'Operation': 'O(1)' }, space: 'O(1)' }
        });
    };

    const handleClear = () => {
        setError('');
        setStack([]);
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
                <div className="bg-surface/60 p-4 rounded-xl min-h-[30rem] border border-secondary shadow-xl flex justify-center items-end">
                    <div className="flex flex-col-reverse items-center gap-2">
                        <AnimatePresence>
                            {stack.map((val, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    initial={{ opacity: 0, y: -50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: 100, transition: { duration: 0.5 } }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                    className="flex items-center gap-4"
                                >
                                    <div
                                        className={`w-24 h-16 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${highlightedIndex === i ? 'bg-highlight text-background scale-110' : 'bg-secondary'}`}
                                    >
                                        {val}
                                    </div>
                                    {i === stack.length - 1 && <span className="text-primary font-bold">TOP</span>}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <Controls>
                    <ValueInput value={value} onChange={e => setValue(e.target.value)} placeholder="Value" type="number" />
                    <ActionButton onClick={handlePush}><LogIn size={18} /> Push</ActionButton>
                    <ActionButton onClick={handlePop} className="bg-red-600 hover:bg-red-700 focus:ring-red-500"><LogOut size={18} /> Pop</ActionButton>
                    <ActionButton onClick={handlePeek} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"><Eye size={18} /> Peek</ActionButton>
                    <ActionButton onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"><XCircle size={18} /> Clear</ActionButton>
                </Controls>
            </div>
            <CodeInsightBox {...insight} key={insight.title + insight.points[0]} />
        </div>
    );
};

export default StackVisualizer;
