import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Play, XCircle, AlertTriangle } from 'lucide-react';

// Import shared components
import Controls from '../shared/Controls';
import ActionButton from '../shared/ActionButton';
import CodeInsightBox from '../shared/CodeInsightBox';

const ARRAY_SIZE = 20;
const ANIMATION_SPEED_MS = 50;

const SortingVisualizer = () => {
    const [array, setArray] = useState([]);
    const [isSorting, setIsSorting] = useState(false);
    const [highlightedIndices, setHighlightedIndices] = useState([]);
    const [sortedIndices, setSortedIndices] = useState([]);
    const [error, setError] = useState('');

    const resetArray = () => {
        setIsSorting(false);
        setSortedIndices([]);
        setHighlightedIndices([]);
        const newArray = Array.from({ length: ARRAY_SIZE }, () => Math.floor(Math.random() * 100) + 5);
        setArray(newArray);
    };

    useEffect(() => {
        resetArray();
    }, []);

    // --- Code Insight Logic ---
    const getScript = (operation) => {
        const scripts = {
            bubbleSort: [
                'void bubbleSort(int arr[], int n) {',
                '  for (int i = 0; i < n - 1; i++) {',
                '    for (int j = 0; j < n - i - 1; j++) {',
                '      if (arr[j] > arr[j + 1]) {',
                '        swap(&arr[j], &arr[j + 1]);',
                '      }',
                '    }',
                '  }',
                '}',
            ],
            selectionSort: [
                'void selectionSort(int arr[], int n) {',
                '  for (int i = 0; i < n - 1; i++) {',
                '    int min_idx = i;',
                '    for (int j = i + 1; j < n; j++) {',
                '      if (arr[j] < arr[min_idx]) {',
                '        min_idx = j;',
                '      }',
                '    }',
                '    swap(&arr[min_idx], &arr[i]);',
                '  }',
                '}',
            ],
            insertionSort: [
                'void insertionSort(int arr[], int n) {',
                '  for (int i = 1; i < n; i++) {',
                '    int key = arr[i];',
                '    int j = i - 1;',
                '    while (j >= 0 && arr[j] > key) {',
                '      arr[j + 1] = arr[j];',
                '      j = j - 1;',
                '    }',
                '    arr[j + 1] = key;',
                '  }',
                '}',
            ],
            mergeSort: [
                'void mergeSort(int arr[], int l, int r) {',
                '  if (l < r) {',
                '    int m = l + (r - l) / 2;',
                '    mergeSort(arr, l, m);',
                '    mergeSort(arr, m + 1, r);',
                '    merge(arr, l, m, r);',
                '  }',
                '}',
            ]
        };
        return scripts[operation] || scripts.bubbleSort;
    };

    const initialInsight = {
        title: 'Sorting Algorithms',
        script: getScript('bubbleSort'),
        points: [
            'Algorithms to arrange elements in a certain order.',
            'Efficiency is measured by time and space complexity.',
            'Different algorithms are suitable for different scenarios.',
        ],
        complexity: {
            time: { 'Bubble Sort': 'O(n²)', 'Merge Sort': 'O(n log n)' },
            space: 'O(1) / O(n)'
        }
    };

    const [insight, setInsight] = useState(initialInsight);

    const animateSort = (animations) => {
        setIsSorting(true);
        animations.forEach(([val1, val2, type], i) => {
            setTimeout(() => {
                setHighlightedIndices([val1, val2]);
                if (type === 'swap') {
                    setArray(prev => {
                        const newArr = [...prev];
                        [newArr[val1], newArr[val2]] = [newArr[val2], newArr[val1]];
                        return newArr;
                    });
                } else if (type === 'overwrite') {
                    setArray(prev => {
                        const newArr = [...prev];
                        newArr[val1] = val2;
                        return newArr;
                    });
                } else if (type === 'sorted') {
                     setSortedIndices(prev => [...prev, val1]);
                }
                
                if (i === animations.length - 1) {
                    setIsSorting(false);
                    setHighlightedIndices([]);
                    // Mark all as sorted at the end
                    setSortedIndices(Array.from(Array(array.length).keys()));
                }
            }, i * ANIMATION_SPEED_MS);
        });
    };
    
    // --- Sorting Algorithms ---
    const bubbleSort = () => {
        setInsight({
            title: 'Bubble Sort', script: getScript('bubbleSort'),
            points: [
                'Compares adjacent elements and swaps them if they are in the wrong order.',
                'The pass through the array is repeated until the array is sorted.',
            ],
            complexity: { time: { 'Best': 'O(n)', 'Avg/Worst': 'O(n²)'}, space: 'O(1)' }
        });

        const animations = [];
        const arr = [...array];
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = 0; j < arr.length - i - 1; j++) {
                animations.push([j, j + 1, 'compare']);
                if (arr[j] > arr[j + 1]) {
                    animations.push([j, j + 1, 'swap']);
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
            animations.push([arr.length - 1 - i, null, 'sorted']);
        }
        animateSort(animations);
    };

    const selectionSort = () => {
        setInsight({
            title: 'Selection Sort', script: getScript('selectionSort'),
            points: [
                'Repeatedly finds the minimum element from the unsorted part.',
                'Puts the minimum element at the beginning of the unsorted part.',
            ],
            complexity: { time: { 'Best/Avg/Worst': 'O(n²)'}, space: 'O(1)' }
        });

        const animations = [];
        const arr = [...array];
        for (let i = 0; i < arr.length - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < arr.length; j++) {
                animations.push([minIdx, j, 'compare']);
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            animations.push([i, minIdx, 'swap']);
            [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            animations.push([i, null, 'sorted']);
        }
        animateSort(animations);
    };

    const insertionSort = () => {
        setInsight({
            title: 'Insertion Sort', script: getScript('insertionSort'),
            points: [
                'Builds the final sorted array one item at a time.',
                'It iterates through an input array and removes one element per iteration, finds the place the element belongs in the array, and then places it there.',
            ],
            complexity: { time: { 'Best': 'O(n)', 'Avg/Worst': 'O(n²)'}, space: 'O(1)' }
        });

        const animations = [];
        const arr = [...array];
        for (let i = 1; i < arr.length; i++) {
            let key = arr[i];
            let j = i - 1;
            animations.push([i, j, 'compare']);
            while (j >= 0 && arr[j] > key) {
                animations.push([j + 1, arr[j], 'overwrite']);
                arr[j + 1] = arr[j];
                j = j - 1;
                if (j >= 0) {
                   animations.push([i, j, 'compare']);
                }
            }
            animations.push([j + 1, key, 'overwrite']);
            arr[j + 1] = key;
        }
        for (let i = 0; i < arr.length; i++) {
            animations.push([i, null, 'sorted']);
        }
        animateSort(animations);
    };

    const mergeSort = () => {
        setInsight({
            title: 'Merge Sort', script: getScript('mergeSort'),
            points: [
                'A "divide and conquer" algorithm.',
                'Recursively divides the array into two halves, sorts them, and then merges them back together.',
            ],
            complexity: { time: { 'Best/Avg/Worst': 'O(n log n)'}, space: 'O(n)' }
        });

        const animations = [];
        const auxArray = [...array];
        mergeSortHelper(array, 0, array.length - 1, auxArray, animations);
        animateSort(animations);
    };
    
    const mergeSortHelper = (mainArray, startIdx, endIdx, auxiliaryArray, animations) => {
        if (startIdx === endIdx) return;
        const middleIdx = Math.floor((startIdx + endIdx) / 2);
        mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
        mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
        doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
    };

    const doMerge = (mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) => {
        let k = startIdx;
        let i = startIdx;
        let j = middleIdx + 1;
        while (i <= middleIdx && j <= endIdx) {
            animations.push([i, j, 'compare']);
            if (auxiliaryArray[i] <= auxiliaryArray[j]) {
                animations.push([k, auxiliaryArray[i], 'overwrite']);
                mainArray[k++] = auxiliaryArray[i++];
            } else {
                animations.push([k, auxiliaryArray[j], 'overwrite']);
                mainArray[k++] = auxiliaryArray[j++];
            }
        }
        while (i <= middleIdx) {
            animations.push([i, i, 'compare']);
            animations.push([k, auxiliaryArray[i], 'overwrite']);
            mainArray[k++] = auxiliaryArray[i++];
        }
        while (j <= endIdx) {
            animations.push([j, j, 'compare']);
            animations.push([k, auxiliaryArray[j], 'overwrite']);
            mainArray[k++] = auxiliaryArray[j++];
        }
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div className="relative">
                <div className="bg-surface/60 p-4 rounded-xl min-h-[20rem] border border-secondary shadow-xl flex justify-center items-end gap-1">
                    {array.map((value, idx) => {
                        const isHighlighted = highlightedIndices.includes(idx);
                        const isSorted = sortedIndices.includes(idx);
                        let bgColor = 'bg-secondary';
                        if (isHighlighted) bgColor = 'bg-primary';
                        if (isSorted) bgColor = 'bg-success';
                        
                        return (
                            <motion.div
                                key={idx}
                                layout
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className={`w-full rounded-t-md transition-colors duration-300 ${bgColor}`}
                                style={{ height: `${value * 3}px` }}
                            ></motion.div>
                        );
                    })}
                </div>
                <Controls>
                    <ActionButton onClick={resetArray} disabled={isSorting}><Shuffle size={18} /> New Array</ActionButton>
                    <ActionButton onClick={bubbleSort} disabled={isSorting} className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"><Play size={18} /> Bubble Sort</ActionButton>
                    <ActionButton onClick={selectionSort} disabled={isSorting} className="bg-green-600 hover:bg-green-700 focus:ring-green-500"><Play size={18} /> Selection Sort</ActionButton>
                    <ActionButton onClick={insertionSort} disabled={isSorting} className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"><Play size={18} /> Insertion Sort</ActionButton>
                    <ActionButton onClick={mergeSort} disabled={isSorting} className="bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"><Play size={18} /> Merge Sort</ActionButton>
                </Controls>
            </div>
            <CodeInsightBox {...insight} key={insight.title + insight.points[0]} />
        </div>
    );
};

export default SortingVisualizer;
