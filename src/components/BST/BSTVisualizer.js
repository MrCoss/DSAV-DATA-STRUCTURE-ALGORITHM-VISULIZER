import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranchPlus, Trash2, Search, XCircle, AlertTriangle } from 'lucide-react';

// Import shared components
import Controls from '../shared/Controls';
import ActionButton from '../shared/ActionButton';
import ValueInput from '../shared/ValueInput';
import Node from '../shared/Node';
import CodeInsightBox from '../shared/CodeInsightBox';
import SvgArrow from '../shared/SvgArrow';

// --- BST Node and Tree Classes ---
class TreeNode {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(value) {
        const newNode = new TreeNode(value);
        if (!this.root) {
            this.root = newNode;
            return this;
        }
        let current = this.root;
        while (true) {
            if (value === current.value) return undefined; // No duplicates
            if (value < current.value) {
                if (current.left === null) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (current.right === null) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }
    
    // Note: A full delete implementation is complex. This is a simplified placeholder.
    // For a production-ready visualizer, a more robust delete is needed.
    find(value) {
        if (!this.root) return false;
        let current = this.root;
        while(current) {
            if(value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            } else {
                return true;
            }
        }
        return false;
    }
}


const BSTVisualizer = () => {
    const [tree, setTree] = useState(() => {
        const bst = new BST();
        [50, 30, 70, 20, 40, 60, 80].forEach(v => bst.insert(v));
        return bst;
    });
    const [value, setValue] = useState('');
    const [highlightedValue, setHighlightedValue] = useState(null);
    const [error, setError] = useState('');

    // --- Code Insight Logic ---
    const getScript = (operation) => {
        const scripts = {
            insert: [
                'void insert(int value) {',
                '  // ... find correct position ...',
                '  if (value < current->value) {',
                '    current->left = newNode;',
                '  } else {',
                '    current->right = newNode;',
                '  }',
                '}',
            ],
            search: [
                'bool search(int value) {',
                '  // ... traverse tree ...',
                '  if (value < current->value) {',
                '    current = current->left;',
                '  } else if (value > current->value) {',
                '    current = current->right;',
                '  } else {',
                '    return true; // Found',
                '  }',
                '}',
            ],
        };
        return scripts[operation] || scripts.insert;
    };

    const initialInsight = {
        title: 'Binary Search Tree',
        script: getScript('insert'),
        points: [
            'A node-based binary tree with a special property.',
            'The value of a left child is always less than the parent\'s value.',
            'The value of a right child is always greater than the parent\'s value.',
            'Provides <strong>O(log n)</strong> time for search, insert, and delete on average.'
        ],
        complexity: {
            time: { 'Avg': 'O(log n)', 'Worst': 'O(n)' },
            space: 'O(n)'
        }
    };
    
    const [insight, setInsight] = useState(initialInsight);

    const flashError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    };

    const highlightAndReset = (val, duration = 1500) => {
        setHighlightedValue(val);
        setTimeout(() => setHighlightedValue(null), duration);
    };
    
    // --- Visualization Logic ---
    const nodesWithPositions = useMemo(() => {
        const positions = [];
        function traverse(node, depth, x, xOffset) {
            if (!node) return;
            positions.push({ ...node, depth, x, y: depth * 100 });
            if (node.left) traverse(node.left, depth + 1, x - xOffset, xOffset / 2);
            if (node.right) traverse(node.right, depth + 1, x + xOffset, xOffset / 2);
        }
        traverse(tree.root, 0, 0, 200);
        return positions;
    }, [tree]);

    // --- Operation Handlers ---
    const handleInsert = () => {
        setError('');
        const val = parseInt(value);
        if (isNaN(val)) {
            flashError("Please enter a valid number.");
            return;
        }
        if(tree.find(val)) {
            flashError(`Value ${val} already exists in the BST.`);
            highlightAndReset(val);
            return;
        }
        
        const newTree = new BST();
        // Rebuild the tree to keep it simple and immutable
        nodesWithPositions.forEach(n => newTree.insert(n.value));
        newTree.insert(val);
        
        setTree(newTree);
        highlightAndReset(val);
        setInsight({
            title: 'Insert', script: getScript('insert'), highlightedLines: [2, 5],
            points: [`Inserting value <strong>${val}</strong>.`, 'Traverse to find the correct leaf position.'],
            complexity: { time: { 'Avg': 'O(log n)', 'Worst': 'O(n)' }, space: 'O(1)' }
        });
        setValue('');
    };
    
    const handleSearch = () => {
        setError('');
        const val = parseInt(value);
        if (isNaN(val)) {
            flashError("Please enter a valid number.");
            return;
        }

        const found = tree.find(val);
        highlightAndReset(val);
        
        if (found) {
             setInsight({
                title: 'Search: Found', script: getScript('search'), highlightedLines: [7],
                points: [`Searching for <strong>${val}</strong>.`, `Value found in the tree.`],
                complexity: { time: { 'Avg': 'O(log n)', 'Worst': 'O(n)' }, space: 'O(1)' }
            });
        } else {
            flashError(`Value ${val} not found.`);
             setInsight({
                title: 'Search: Not Found', script: getScript('search'),
                points: [`Searching for <strong>${val}</strong>.`, `Value not found in the tree.`],
                complexity: { time: { 'Avg': 'O(log n)', 'Worst': 'O(n)' }, space: 'O(1)' }
            });
        }
        setValue('');
    };

    // Deletion is complex to visualize and implement correctly with animations.
    // A simplified clear is provided instead.
    const handleClear = () => {
        setTree(new BST());
        setInsight(initialInsight);
        setError('');
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
                <div className="bg-surface/60 p-4 rounded-xl min-h-[30rem] border border-secondary shadow-xl flex justify-center items-center overflow-auto">
                   <div className="relative" style={{height: (Math.max(...nodesWithPositions.map(n => n.depth)) + 1) * 100}}>
                        <svg className="absolute w-full h-full top-0 left-0 -z-10 pointer-events-none" style={{ transform: `translateX(50%)` }}>
                            <defs>
                                <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#e94560" />
                                    <stop offset="100%" stopColor="#53a9ff" />
                                </linearGradient>
                                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="url(#arrow-gradient)" />
                                </marker>
                            </defs>
                            <AnimatePresence>
                               {nodesWithPositions.map(node => {
                                   const parent = nodesWithPositions.find(p => p.left === node || p.right === node);
                                   if (!parent) return null;
                                   return <SvgArrow key={`arrow-${node.value}`} from={{x: parent.x, y: parent.y}} to={{x: node.x, y: node.y}} />
                               })}
                            </AnimatePresence>
                        </svg>
                        <AnimatePresence>
                            {nodesWithPositions.map(node => (
                                <motion.div
                                    key={node.value}
                                    className="absolute"
                                    style={{ top: node.y, left: `calc(50% + ${node.x}px)`, x: '-50%', y: '-50%' }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                >
                                    <Node isHighlighted={node.value === highlightedValue}>{node.value}</Node>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                   </div>
                </div>
                <Controls>
                    <ValueInput value={value} onChange={e => setValue(e.target.value)} placeholder="Value" type="number" />
                    <ActionButton onClick={handleInsert}><GitBranchPlus size={18} /> Insert</ActionButton>
                    <ActionButton onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"><Search size={18} /> Search</ActionButton>
                    <ActionButton onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"><XCircle size={18} /> Clear</ActionButton>
                </Controls>
            </div>
            <CodeInsightBox {...insight} key={insight.title + insight.points[0]} />
        </div>
    );
};

export default BSTVisualizer;
