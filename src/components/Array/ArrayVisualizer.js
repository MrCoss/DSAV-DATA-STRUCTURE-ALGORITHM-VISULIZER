import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, XCircle, Shuffle, AlertTriangle } from 'lucide-react';

// Import shared components
import Controls from '../shared/Controls';
import ActionButton from '../shared/ActionButton';
import ValueInput from '../shared/ValueInput';
import CodeInsightBox from '../shared/CodeInsightBox';

const MAX_ARRAY_SIZE = 12;

const ArrayVisualizer = () => {
    const [array, setArray] = useState([10, 25, 5, 42, 18]);
    const [value, setValue] = useState('');
    const [index, setIndex] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [error, setError] = useState('');

    // --- Code Insight Logic ---
    const getScript = (operation) => {
        const scripts = {
            insert: [
                'void insert(int index, int value) {',
                '  // Shift elements to the right',
                '  for (int i = size; i > index; i--) {',
                '    arr[i] = arr[i - 1];',
                '  }',
                '  arr[index] = value;',
                '  size++;',
                '}',
            ],
            delete: [
                'void delete(int index) {',
                '  // Shift elements to the left',
                '  for (int i = index; i < size - 1; i++) {',
                '    arr[i] = arr[i + 1];',
                '  }',
                '  size--;',
                '}',
            ],
            search: [
                'int search(int value) {',
                '  for (int i = 0; i < size; i++) {',
                '    if (arr[i] == value) {',
                '      return i; // Found',
                '    }',
                '  }',
                '  return -1; // Not found',
                '}',
            ],
        };
        return scripts[operation] || scripts.insert;
    };

    const initialInsight = {
        title: 'Array (Vector)',
        script: getScript('insert'),
        highlightedLines: [],
        points: [
            'A contiguous block of memory holding elements of the same type.',
            'Provides <strong>O(1)</strong> access time with an index.',
            'Insertion and deletion can be slow (<strong>O(n)</strong>) as elements may need shifting.',
        ],
        complexity: {
            time: { 'Access': 'O(1)', 'Search/Insert/Delete': 'O(n)' },
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
    const handleInsert = () => {
        setError('');
        const val = parseInt(value);
        const idx = parseInt(index);

        if (isNaN(val) || isNaN(idx)) {
            flashError("Value and Index must be valid numbers.");
            return;
        }
        if (idx < 0 || idx > array.length) {
            flashError(`Index must be between 0 and ${array.length}.`);
            return;
        }
        if (array.length >= MAX_ARRAY_SIZE) {
            flashError(`Array is full. Max size is ${MAX_ARRAY_SIZE}.`);
            return;
        }

        const newArray = [...array.slice(0, idx), val, ...array.slice(idx)];
        setArray(newArray);
        highlightAndReset(idx);
        setInsight({
            title: 'Insert', script: getScript('insert'), highlightedLines: [1, 5],
            points: [`Inserting value <strong>${val}</strong> at index <strong>${idx}</strong>.`, 'Elements from index ' + idx + ' are shifted right.'],
            complexity: { time: { 'Worst Case': 'O(n)' }, space: 'O(1)' }
        });
        setValue('');
        setIndex('');
    };

    const handleDelete = () => {
        setError('');
        const idx = parseInt(index);
        if (isNaN(idx)) {
            flashError("Index must be a valid number.");
            return;
        }
        if (idx < 0 || idx >= array.length) {
            flashError(`Index must be between 0 and ${array.length - 1}.`);
            return;
        }

        highlightAndReset(idx);
        setTimeout(() => {
            const newArray = [...array.slice(0, idx), ...array.slice(idx + 1)];
            setArray(newArray);
        }, 500);
        setInsight({
            title: 'Delete', script: getScript('delete'), highlightedLines: [1, 3],
            points: [`Deleting element at index <strong>${idx}</strong>.`, 'Elements from index ' + (idx + 1) + ' are shifted left.'],
            complexity: { time: { 'Worst Case': 'O(n)' }, space: 'O(1)' }
        });
        setIndex('');
    };

    const handleSearch = () => {
        setError('');
        const val = parseInt(value);
        if (isNaN(val)) {
            flashError("Value must be a valid number.");
            return;
        }

        const foundIndex = array.indexOf(val);
        highlightAndReset(foundIndex);

        if (foundIndex !== -1) {
            setInsight({
                title: 'Search: Found', script: getScript('search'), highlightedLines: [1, 2, 3],
                points: [`Searching for value <strong>${val}</strong>.`, `Found at index <strong>${foundIndex}</strong>.`],
                complexity: { time: { 'Worst Case': 'O(n)' }, space: 'O(1)' }
            });
        } else {
            flashError(`Value ${val} not found in the array.`);
            setInsight({
                title: 'Search: Not Found', script: getScript('search'), highlightedLines: [1, 6],
                points: [`Searching for value <strong>${val}</strong>.`, `Value not found after iterating through the array.`],
                complexity: { time: { 'Worst Case': 'O(n)' }, space: 'O(1)' }
            });
        }
        setValue('');
    };

    const handleRandomize = () => {
        setError('');
        const size = Math.floor(Math.random() * (MAX_ARRAY_SIZE - 4)) + 5;
        const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100));
        setArray(newArray);
        setInsight(initialInsight);
    };

    const handleClear = () => {
        setError('');
        setArray([]);
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
                    <div className="flex flex-wrap justify-center items-end gap-2">
                        <AnimatePresence>
                            {array.map((val, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="flex flex-col items-center"
                                >
                                    <div
                                        className={`w-16 h-16 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${highlightedIndex === i ? 'bg-highlight text-background scale-110' : 'bg-secondary'}`}
                                    >
                                        {val}
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1">[{i}]</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
                <Controls>
                    <ValueInput value={value} onChange={e => setValue(e.target.value)} placeholder="Value" type="number" />
                    <ValueInput value={index} onChange={e => setIndex(e.target.value)} placeholder="Index" type="number" />
                    <ActionButton onClick={handleInsert}><Plus size={18} /> Insert</ActionButton>
                    <ActionButton onClick={handleDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-500"><Trash2 size={18} /> Delete</ActionButton>
                    <ActionButton onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"><Search size={18} /> Search</ActionButton>
                    <ActionButton onClick={handleRandomize} className="bg-green-600 hover:bg-green-700 focus:ring-green-500"><Shuffle size={18} /> Random</ActionButton>
                    <ActionButton onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"><XCircle size={18} /> Clear</ActionButton>
                </Controls>
            </div>
            <CodeInsightBox {...insight} key={insight.title + insight.points[0]} />
        </div>
    );
};

export default ArrayVisualizer;
