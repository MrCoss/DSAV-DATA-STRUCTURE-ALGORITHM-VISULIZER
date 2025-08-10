import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageLoader from './components/layout/PageLoader';
import Landing from './components/layout/landing';

// Lazy load all visualizer components for better initial load performance
const ArrayVisualizer = lazy(() => import('./components/Array/ArrayVisualizer'));
const StackVisualizer = lazy(() => import('./components/Stack/StackVisualizer'));
const QueueVisualizer = lazy(() => import('./components/Queue/QueueVisualizer'));
const LinkedListVisualizer = lazy(() => import('./components/LinkedList/LinkedListVisualizer'));
const BSTVisualizer = lazy(() => import('./components/BST/BSTVisualizer'));
const GraphVisualizer = lazy(() => import('./components/Graph/GraphVisualizer'));
const HashTableVisualizer = lazy(() => import('./components/HashTable/HashTableVisualizer'));
const SortingVisualizer = lazy(() => import('./components/Sorting/SortingVisualizer'));

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-secondary">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/array" element={<ArrayVisualizer />} />
              <Route path="/stack" element={<StackVisualizer />} />
              <Route path="/queue" element={<QueueVisualizer />} />
              <Route path="/linked-list" element={<LinkedListVisualizer />} />
              <Route path="/bst" element={<BSTVisualizer />} />
              <Route path="/graph" element={<GraphVisualizer />} />
              <Route path="/sorting" element={<SortingVisualizer />} />
              <Route path="/hash-table" element={<HashTableVisualizer />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
