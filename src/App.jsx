import './App.css';
// import GraphDisplay from './components/GraphDisplay.jsx';
import React, { useState, useEffect } from 'react';
import { findShortestPath } from './scripts/bfs.js';

function App() {
  const [graph, setGraph] = useState({});
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [result, setResult] = useState('');
  const [nodeFilter, setNodeFilter] = useState('');

  // Load graph from JSON file
  useEffect(() => {
    const loadGraph = async () => {
      const response = await fetch('graph.json');
      const data = await response.json();
      setGraph(data);
    };

    loadGraph();
  }, []);

  const handleFindPath = () => {
    const path = findShortestPath(graph, startNode, endNode);
    setResult(path);
  };

  // Get all nodes from the graph
  const allNodes = Object.keys(graph);

  // Filter nodes based on the current input
  const filteredNodes = allNodes.filter(node =>
    node.toLowerCase().includes(nodeFilter.toLowerCase())
  );

  return (
    <div className="App">
      {/* <GraphDisplay /> */}
      <div>
        <h1>Shortest Path Finder</h1>
        <div>
          <label>
            Start Node:
            <input
              type="text"
              value={nodeFilter}
              onChange={(e) => setNodeFilter(e.target.value)}
              placeholder="Type to filter nodes"
            />
          </label>
          <select value={startNode} onChange={(e) => setStartNode(e.target.value)}>
            <option value="">Select Start Node</option>
            {filteredNodes.map((node) => (
              <option key={node} value={node}>
                {node}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>
            End Node:
            <input
              type="text"
              value={nodeFilter}
              onChange={(e) => setNodeFilter(e.target.value)}
              placeholder="Type to filter nodes"
            />
          </label>
          <select value={endNode} onChange={(e) => setEndNode(e.target.value)}>
            <option value="">Select End Node</option>
            {filteredNodes.map((node) => (
              <option key={node} value={node}>
                {node}
              </option>
            ))}
          </select>
        </div>
        <button onClick={handleFindPath}>Find Shortest Path</button>
        <h2>Result: {result}</h2>
      </div>
    </div>
  );
}

export default App;
