import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Search, XCircle, AlertTriangle, CornerDownLeft, CornerDownRight } from 'lucide-react';

// Import shared components
import Controls from '../shared/Controls';
import ActionButton from '../shared/ActionButton';
import ValueInput from '../shared/ValueInput';
import Node from '../shared/Node';
import CodeInsightBox from '../shared/CodeInsightBox';
import SvgArrow from '../shared/SvgArrow';

const LinkedListVisualizer = () => {
    const [nodes, setNodes] = useState([]);
    const [value, setValue] = useState('');
    const [highlightedNodeId, setHighlightedNodeId] = useState(null);
    const [error, setError] = useState('');

    const nodeRefs = useRef({});
    const [positions, setPositions] = useState({});
    const containerRef = useRef(null);

    // --- Code Insight Logic ---
    const getScript = (operation) => {
        const scripts = {
            insert: [
                'void insert(Node* prev_node, int new_data) {',
                '  Node* new_node = new Node();',
                '  new_node->data = new_data;',
                '  new_node->next = prev_node->next;',
                '  prev_node->next = new_node;',
                '}',
            ],
            delete: [
                'void deleteNode(Node** head_ref, int key) {',
                '  // ... find node to delete ...',
                '  // ... handle head case ...',
                '  prev->next = temp->next;',
                '  free(temp);',
                '}',
            ],
            search: [
                'bool search(Node* head, int x) {',
                '  Node* current = head;',
                '  while (current != NULL) {',
                '    if (current->data == x) return true;',
                '    current = current->next;',
                '  }',
                '  return false;',
                '}',
            ],
        };
        return scripts[operation] || scripts.insert;
    };

    const initialInsight = {
        title: 'Singly Linked List',
        script: getScript('insert'),
        highlightedLines: [],
        points: [
            'A collection of nodes where each node points to the next.',
            'Efficient insertions and deletions (<strong>O(1)</strong>) if the position is known.',
            'Access and search time are linear (<strong>O(n)</strong>) as it requires traversal.',
        ],
        complexity: {
            time: { 'Access/Search': 'O(n)', 'Insert/Delete': 'O(1)' },
            space: 'O(n)'
        }
    };

    const [insight, setInsight] = useState(initialInsight);

    const flashError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    };

    const highlightAndReset = (nodeId, duration = 1500) => {
        setHighlightedNodeId(nodeId);
        setTimeout(() => setHighlightedNodeId(null), duration);
    };

    // --- Positioning ---
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
        updatePositions();
    }, [nodes, updatePositions]);

    useEffect(() => {
        const observer = new ResizeObserver(updatePositions);
        const contRef = containerRef.current;
        if (contRef) observer.observe(contRef);
        return () => { if (contRef) observer.unobserve(contRef); };
    }, [updatePositions]);


    // --- Operation Handlers ---
    const createNode = (val) => ({ value: val, id: crypto.randomUUID() });

    const handleInsert = (position) => {
        setError('');
        const val = parseInt(value);
        if (isNaN(val)) {
            flashError("Please enter a valid number.");
            return;
        }
        if (nodes.some(n => n.value === val)) {
            flashError(`Value ${val} already exists in the list.`);
            return;
        }

        const newNode = createNode(val);
        let newNodes;
        if (position === 'head') {
            newNodes = [newNode, ...nodes];
        } else { // tail
            newNodes = [...nodes, newNode];
        }
        setNodes(newNodes);
        highlightAndReset(newNode.id);
        setInsight({
            title: `Insert ${position === 'head' ? 'Head' : 'Tail'}`, script: getScript('insert'), highlightedLines: [3, 4],
            points: [`Inserting value <strong>${val}</strong> at the ${position}.`, 'Update pointers to link the new node.'],
            complexity: { time: { 'Operation': 'O(1)' }, space: 'O(1)' }
        });
        setValue('');
    };

    const handleDelete = () => {
        setError('');
        const val = parseInt(value);
        if (isNaN(val)) {
            flashError("Please enter a valid number.");
            return;
        }

        const nodeToDelete = nodes.find(n => n.value === val);
        if (!nodeToDelete) {
            flashError(`Value ${val} not found in the list.`);
            return;
        }

        highlightAndReset(nodeToDelete.id);
        setInsight({
            title: 'Delete', script: getScript('delete'), highlightedLines: [3, 4],
            points: [`Deleting node with value <strong>${val}</strong>.`, 'Update pointers of the previous node.'],
            complexity: { time: { 'Worst Case': 'O(n)' }, space: 'O(1)' }
        });

        setTimeout(() => {
            setNodes(nodes.filter(n => n.id !== nodeToDelete.id));
        }, 500);
        setValue('');
    };

    const handleSearch = () => {
        setError('');
        const val = parseInt(value);
        if (isNaN(val)) {
            flashError("Please enter a valid number.");
            return;
        }

        const foundNode = nodes.find(n => n.value === val);
        if (foundNode) {
            highlightAndReset(foundNode.id);
            setInsight({
                title: 'Search: Found', script: getScript('search'), highlightedLines: [3],
                points: [`Searching for value <strong>${val}</strong>.`, `Found node with value <strong>${val}</strong>.`],
                complexity: { time: { 'Worst Case': 'O(n)' }, space: 'O(1)' }
            });
        } else {
            flashError(`Value ${val} not found in the list.`);
            setInsight({
                title: 'Search: Not Found', script: getScript('search'), highlightedLines: [6],
                points: [`Searching for value <strong>${val}</strong>.`, `Reached the end of the list, value not found.`],
                complexity: { time: { 'Worst Case': 'O(n)' }, space: 'O(1)' }
            });
        }
        setValue('');
    };

    const handleClear = () => {
        setError('');
        setNodes([]);
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
                <div ref={containerRef} className="bg-surface/60 p-4 rounded-xl min-h-[20rem] border border-secondary shadow-xl flex justify-center items-center">
                    <div className="flex flex-wrap justify-center items-center gap-8">
                        <AnimatePresence>
                            {nodes.map((node) => (
                                <motion.div
                                    key={node.id}
                                    ref={el => nodeRefs.current[node.id] = el}
                                    layout
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                >
                                    <Node isHighlighted={node.id === highlightedNodeId}>{node.value}</Node>
                                </motion.div>
                            ))}
                        </AnimatePresence>
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
                            {nodes.length > 1 && nodes.slice(0, -1).map((node, i) => {
                                const fromNode = node;
                                const toNode = nodes[i + 1];
                                const fromPos = positions[fromNode.id];
                                const toPos = positions[toNode.id];
                                if (fromPos && toPos) {
                                    return <SvgArrow key={`arrow-${fromNode.id}`} from={fromPos} to={toPos} />;
                                }
                                return null;
                            })}
                        </AnimatePresence>
                    </svg>
                </div>
                <Controls>
                    <ValueInput value={value} onChange={e => setValue(e.target.value)} placeholder="Value" type="number" />
                    <ActionButton onClick={() => handleInsert('head')}><CornerDownLeft size={18} /> Insert Head</ActionButton>
                    <ActionButton onClick={() => handleInsert('tail')}><CornerDownRight size={18} /> Insert Tail</ActionButton>
                    <ActionButton onClick={handleDelete} className="bg-red-600 hover:bg-red-700 focus:ring-red-500"><Trash2 size={18} /> Delete</ActionButton>
                    <ActionButton onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"><Search size={18} /> Search</ActionButton>
                    <ActionButton onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"><XCircle size={18} /> Clear</ActionButton>
                </Controls>
            </div>
            <CodeInsightBox {...insight} key={insight.title + insight.points[0]} />
        </div>
    );
};

export default LinkedListVisualizer;
