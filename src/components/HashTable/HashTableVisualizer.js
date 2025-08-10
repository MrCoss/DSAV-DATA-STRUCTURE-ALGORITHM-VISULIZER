import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, XCircle, AlertTriangle } from 'lucide-react';

// Import shared components
import Controls from '../shared/Controls';
import ActionButton from '../shared/ActionButton';
import ValueInput from '../shared/ValueInput';
import Node from '../shared/Node';
import CodeInsightBox from '../shared/CodeInsightBox';
import SvgArrow from '../shared/SvgArrow';

const TABLE_SIZE = 7;

const HashTableVisualizer = () => {
    const [table, setTable] = useState(Array(TABLE_SIZE).fill(null));
    const [keyValue, setKeyValue] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [highlightedNodeId, setHighlightedNodeId] = useState(null);
    const [error, setError] = useState('');
    
    const nodeRefs = useRef({});
    const [positions, setPositions] = useState({});
    const containerRef = useRef(null);

    // Simple hash function
    const hash = (key) => {
        if (typeof key !== 'number') return 0;
        return key % TABLE_SIZE;
    };

    // --- Code Insight Logic ---
    const getScript = (operation) => {
        const scripts = {
            insert: [
                'void insert(int key, int value) {',
                '  int index = hash(key);',
                '  // Handle collision by chaining',
                '  // (e.g., add to linked list at table[index])',
                '  table[index].push_back({key, value});',
                '}',
            ],
            search: [
                'int search(int key) {',
                '  int index = hash(key);',
                '  // Search the list at table[index]',
                '  for (auto& pair : table[index]) {',
                '    if (pair.key == key) return pair.value;',
                '  }',
                '  return -1; // Not found',
                '}',
            ],
            delete: [
                'void remove(int key) {',
                '  int index = hash(key);',
                '  // Find the element in the chain',
                '  // and remove it from the list',
                '  // ... (implementation for removal)',
                '}',
            ]
        };
        return scripts[operation] || scripts.insert;
    };

    const initialInsight = {
        title: 'Hash Table (Separate Chaining)',
        script: getScript('insert'),
        highlightedLines: [],
        points: [
            'Maps keys to values for <strong>O(1)</strong> average time complexity.',
            'A <strong>hash function</strong> computes an index from the key.',
            'Collisions (multiple keys mapping to the same index) are handled with <strong>chaining</strong> (using linked lists).',
        ],
        complexity: {
            time: { 'Average': 'O(1)', 'Worst': 'O(n)' },
            space: 'O(n)'
        }
    };
    
    const [insight, setInsight] = useState(initialInsight);
    
    const clearError = () => setError('');

    // --- Animation & Positioning ---
    const updatePositions = useCallback(() => {
        const newPositions = {};
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            Object.entries(nodeRefs.current).forEach(([id, el]) => {
                if (el) {
                    const rect = el.getBoundingClientRect();
                    newPositions[id] = {
                        x: rect.left - containerRect.left + rect.width / 2,
                        y: rect.top - containerRect.top + rect.height / 2,
                    };
                }
            });
            setPositions(newPositions);
        }
    }, []);

    useEffect(() => {
        const observer = new ResizeObserver(updatePositions);
        const contRef = containerRef.current;
        if (contRef) observer.observe(contRef);
        updatePositions();
        return () => { if (contRef) observer.unobserve(contRef); };
    }, [table, updatePositions]);

    const highlightAndReset = (index, nodeId = null, duration = 1500) => {
        setHighlightedIndex(index);
        setHighlightedNodeId(nodeId);
        setTimeout(() => {
            setHighlightedIndex(null);
            setHighlightedNodeId(null);
        }, duration);
    };
    
    const flashError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    }

    // --- Operation Handlers ---
    const handleInsert = () => {
        clearError();
        const key = parseInt(keyValue);
        if (isNaN(key)) {
            flashError("Please enter a valid number for the key.");
            return;
        }

        const index = hash(key);
        
        // Check for duplicates
        if (table[index] && table[index].some(node => node.key === key)) {
            flashError(`Key ${key} already exists in the table.`);
            highlightAndReset(index, table[index].find(node => node.key === key).id);
            return;
        }

        const newNode = { key, id: crypto.randomUUID() };
        
        highlightAndReset(index, newNode.id);

        const newTable = [...table];
        if (!newTable[index]) {
            newTable[index] = [];
        }
        newTable[index].push(newNode);
        setTable(newTable);

        setInsight({
            title: 'Insert', script: getScript('insert'), highlightedLines: [1, 4],
            points: [`Hashed key <strong>${key}</strong> to index <strong>${index}</strong>.`, 'Appended the new element to the chain.'],
            complexity: { time: { 'Average': 'O(1)', 'Worst': 'O(n)' }, space: 'O(1)' }
        });
        setKeyValue('');
    };

    const handleSearch = () => {
        clearError();
        const key = parseInt(keyValue);
        if (isNaN(key)) {
            flashError("Please enter a valid number for the key.");
            return;
        }

        const index = hash(key);
        const chain = table[index] || [];
        const foundNode = chain.find(node => node.key === key);
        
        if (foundNode) {
            highlightAndReset(index, foundNode.id);
            setInsight({
                title: 'Search: Found', script: getScript('search'), highlightedLines: [1, 3, 4],
                points: [`Hashed key <strong>${key}</strong> to index <strong>${index}</strong>.`, `Found key <strong>${key}</strong> in the chain.`],
                complexity: { time: { 'Average': 'O(1)', 'Worst': 'O(n)' }, space: 'O(1)' }
            });
        } else {
            highlightAndReset(index);
            flashError(`Key ${key} not found.`);
             setInsight({
                title: 'Search: Not Found', script: getScript('search'), highlightedLines: [1, 6],
                points: [`Hashed key <strong>${key}</strong> to index <strong>${index}</strong>.`, `Key <strong>${key}</strong> was not found in the chain.`],
                complexity: { time: { 'Average': 'O(1)', 'Worst': 'O(n)' }, space: 'O(1)' }
            });
        }
        setKeyValue('');
    };

    const handleDelete = () => {
        clearError();
        const key = parseInt(keyValue);
        if (isNaN(key)) {
            flashError("Please enter a valid number for the key.");
            return;
        }

        const index = hash(key);
        const chain = table[index] || [];
        const nodeToDelete = chain.find(node => node.key === key);

        if (nodeToDelete) {
            setHighlightedNodeId(nodeToDelete.id);
            setInsight({
                title: 'Delete', script: getScript('delete'), highlightedLines: [1, 2, 4],
                points: [`Hashed key <strong>${key}</strong> to index <strong>${index}</strong>.`, `Preparing to remove key <strong>${key}</strong>.`],
                complexity: { time: { 'Average': 'O(1)', 'Worst': 'O(n)' }, space: 'O(1)' }
            });
            
            setTimeout(() => {
                const newTable = [...table];
                newTable[index] = newTable[index].filter(node => node.id !== nodeToDelete.id);
                if (newTable[index].length === 0) {
                    newTable[index] = null;
                }
                setTable(newTable);
                setHighlightedNodeId(null);
            }, 1000);
        } else {
            highlightAndReset(index);
            flashError(`Key ${key} not found for deletion.`);
        }
        setKeyValue('');
    };

    const handleClear = () => {
        clearError();
        setTable(Array(TABLE_SIZE).fill(null));
        setInsight(initialInsight);
        setKeyValue('');
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
                <div ref={containerRef} className="relative bg-surface/60 p-4 rounded-xl min-h-[40rem] border border-secondary shadow-xl">
                    <div className="flex flex-col gap-4">
                        {table.map((chain, index) => (
                            <div key={index} className="flex items-center gap-4 min-h-[4rem]">
                                <motion.div 
                                    className={`w-16 h-16 flex-shrink-0 flex items-center justify-center rounded-lg text-lg font-bold transition-all duration-300 ${highlightedIndex === index ? 'bg-highlight text-background scale-110' : 'bg-secondary'}`}
                                >
                                    [{index}]
                                </motion.div>
                                <div className="flex items-center gap-8 flex-wrap">
                                    <AnimatePresence>
                                        {chain && chain.map(node => (
                                            <motion.div
                                                key={node.id}
                                                ref={el => nodeRefs.current[node.id] = el}
                                                layout
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5, transition: {duration: 0.5} }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                            >
                                                <Node isHighlighted={node.id === highlightedNodeId}>{node.key}</Node>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>
                    <svg className="absolute w-full h-full top-0 left-0 -z-10 pointer-events-none">
                        <defs>
                            <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#e94560" />
                                <stop offset="100%" stopColor="#53a9ff" />
                            </linearGradient>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="url(#arrow-gradient)" />
                            </marker>
                        </defs>
                        <AnimatePresence>
                            {table.map(chain => {
                                if (!chain || chain.length < 2) return null;
                                return chain.slice(0, -1).map((node, i) => {
                                    const fromNode = node;
                                    const toNode = chain[i + 1];
                                    const fromPos = positions[fromNode.id];
                                    const toPos = positions[toNode.id];
                                    if (fromPos && toPos) {
                                        return <SvgArrow key={`arrow-${fromNode.id}`} from={fromPos} to={toPos} />;
                                    }
                                    return null;
                                });
                            })}
                        </AnimatePresence>
                    </svg>
                </div>
                <Controls>
                    <ValueInput value={keyValue} onChange={e => setKeyValue(e.target.value)} placeholder="Key (e.g. 12)" type="number" />
                    <ActionButton onClick={handleInsert}><Plus size={18} /> Insert</ActionButton>
                    <ActionButton onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"><Search size={18} /> Search</ActionButton>
                    <ActionButton onClick={handleDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-500"><Trash2 size={18} /> Delete</ActionButton>
                    <ActionButton onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"><XCircle size={18} /> Clear</ActionButton>
                </Controls>
            </div>
            <CodeInsightBox {...insight} key={insight.title + insight.points[0]} />
        </div>
    );
};

export default HashTableVisualizer;
