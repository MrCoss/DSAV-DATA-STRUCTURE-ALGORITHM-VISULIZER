import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link, XCircle, AlertTriangle, GitFork } from 'lucide-react';

// Import shared components
import Controls from '../shared/Controls';
import ActionButton from '../shared/ActionButton';
import ValueInput from '../shared/ValueInput';
import CodeInsightBox from '../shared/CodeInsightBox';
import GraphDisplay from './GraphDisplay';

const GraphVisualizer = () => {
    const [graph, setGraph] = useState({
        nodes: [{ id: 'A' }, { id: 'B' }, { id: 'C' }, { id: 'D' }],
        edges: [{ source: 'A', target: 'B' }, { source: 'A', target: 'C' }, { source: 'B', target: 'D' }],
    });
    const [nodeId, setNodeId] = useState('');
    const [edgeSource, setEdgeSource] = useState('');
    const [edgeTarget, setEdgeTarget] = useState('');
    const [startNode, setStartNode] = useState('A');
    const [highlightedNode, setHighlightedNode] = useState(null);
    const [highlightedEdge, setHighlightedEdge] = useState(null);
    const [error, setError] = useState('');

    // --- Code Insight Logic ---
    const getScript = (operation) => {
        const scripts = {
            bfs: [
                'void BFS(int startNode) {',
                '  queue.push(startNode);',
                '  visited[startNode] = true;',
                '  while (!queue.empty()) {',
                '    // ... process node ...',
                '    // ... add neighbors to queue ...',
                '  }',
                '}',
            ],
            dfs: [
                'void DFS(int node) {',
                '  visited[node] = true;',
                '  // ... process node ...',
                '  for (int neighbor : adj[node]) {',
                '    if (!visited[neighbor]) {',
                '      DFS(neighbor);',
                '    }',
                '  }',
                '}',
            ],
        };
        return scripts[operation] || scripts.bfs;
    };

    const initialInsight = {
        title: 'Graph',
        script: getScript('bfs'),
        points: [
            'A collection of nodes (or vertices) and edges that connect them.',
            'Can be directed or undirected, weighted or unweighted.',
            'Used to model networks, social connections, and maps.',
            'Common traversal algorithms are <strong>BFS</strong> and <strong>DFS</strong>.'
        ],
        complexity: {
            time: { 'Add Vertex': 'O(1)', 'Add Edge': 'O(1)', 'BFS/DFS': 'O(V+E)' },
            space: 'O(V+E)'
        }
    };

    const [insight, setInsight] = useState(initialInsight);

    const flashError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 3000);
    };

    const highlightNode = (id, duration) => {
        setHighlightedNode(id);
        setTimeout(() => setHighlightedNode(null), duration);
    };
    
    const highlightEdge = (source, target, duration) => {
        setHighlightedEdge({ source, target });
        setTimeout(() => setHighlightedEdge(null), duration);
    };

    // --- Operation Handlers ---
    const handleAddNode = () => {
        setError('');
        if (!nodeId) {
            flashError("Node ID cannot be empty.");
            return;
        }
        if (graph.nodes.find(n => n.id === nodeId)) {
            flashError(`Node "${nodeId}" already exists.`);
            return;
        }
        setGraph(g => ({ ...g, nodes: [...g.nodes, { id: nodeId }] }));
        setNodeId('');
    };

    const handleAddEdge = () => {
        setError('');
        if (!edgeSource || !edgeTarget) {
            flashError("Source and Target IDs are required.");
            return;
        }
        if (!graph.nodes.find(n => n.id === edgeSource) || !graph.nodes.find(n => n.id === edgeTarget)) {
            flashError("Both source and target nodes must exist.");
            return;
        }
        if (graph.edges.find(e => e.source === edgeSource && e.target === edgeTarget)) {
            flashError("Edge already exists.");
            return;
        }
        setGraph(g => ({ ...g, edges: [...g.edges, { source: edgeSource, target: edgeTarget }] }));
        setEdgeSource('');
        setEdgeTarget('');
    };
    
    const runTraversal = (algo) => {
        setError('');
        if (!graph.nodes.find(n => n.id === startNode)) {
            flashError(`Start node "${startNode}" does not exist.`);
            return;
        }
        
        setInsight({
            title: algo.toUpperCase(),
            script: getScript(algo.toLowerCase()),
            points: [`Running ${algo.toUpperCase()} from node <strong>${startNode}</strong>.`],
            complexity: { time: { 'Traversal': 'O(V+E)' }, space: 'O(V)' }
        });

        const visited = new Set();
        const traversalOrder = [];
        const queue = algo === 'BFS' ? [startNode] : [];
        const stack = algo === 'DFS' ? [startNode] : [];

        const process = () => {
            if (algo === 'BFS' && queue.length === 0) return;
            if (algo === 'DFS' && stack.length === 0) return;

            const currentId = algo === 'BFS' ? queue.shift() : stack.pop();

            if (visited.has(currentId)) {
                process();
                return;
            }

            visited.add(currentId);
            traversalOrder.push(currentId);
            highlightNode(currentId, 500 * (traversalOrder.length + 1));
            
            const neighbors = graph.edges
                .filter(e => e.source === currentId)
                .map(e => e.target);
            
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    if (algo === 'BFS') queue.push(neighbor);
                    if (algo === 'DFS') stack.push(neighbor);
                }
            }
            setTimeout(process, 500);
        };
        process();
    };


    const handleClear = () => {
        setGraph({ nodes: [], edges: [] });
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
                <div className="bg-surface/60 p-4 rounded-xl min-h-[30rem] h-[30rem] border border-secondary shadow-xl">
                   <GraphDisplay graph={graph} highlightedNode={highlightedNode} highlightedEdge={highlightedEdge} />
                </div>
                <Controls>
                    <ValueInput value={nodeId} onChange={e => setNodeId(e.target.value.toUpperCase())} placeholder="Node ID" />
                    <ActionButton onClick={handleAddNode}><Share2 size={18} /> Add Node</ActionButton>
                </Controls>
                 <Controls>
                    <ValueInput value={edgeSource} onChange={e => setEdgeSource(e.target.value.toUpperCase())} placeholder="Source" />
                    <ValueInput value={edgeTarget} onChange={e => setEdgeTarget(e.target.value.toUpperCase())} placeholder="Target" />
                    <ActionButton onClick={handleAddEdge}><Link size={18} /> Add Edge</ActionButton>
                </Controls>
                 <Controls>
                    <ValueInput value={startNode} onChange={e => setStartNode(e.target.value.toUpperCase())} placeholder="Start Node" />
                    <ActionButton onClick={() => runTraversal('BFS')} className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"><GitFork size={18} /> BFS</ActionButton>
                    <ActionButton onClick={() => runTraversal('DFS')} className="bg-green-600 hover:bg-green-700 focus:ring-green-500"><GitFork size={18} /> DFS</ActionButton>
                    <ActionButton onClick={handleClear} className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"><XCircle size={18} /> Clear</ActionButton>
                </Controls>
            </div>
            <CodeInsightBox {...insight} key={insight.title + insight.points[0]} />
        </div>
    );
};

export default GraphVisualizer;
