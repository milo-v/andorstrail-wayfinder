import './App.css';
// import GraphDisplay from './components/GraphDisplay.jsx';
import React, { useState, useEffect } from 'react';
import { findShortestPath } from './scripts/bfs.js';

function App() {
  const [graph, setGraph] = useState({});
  const [startNode, setStartNode] = useState('');
  const [endNode, setEndNode] = useState('');
  const [result, setResult] = useState('');

  // Load graph from JSON file
  useEffect(() => {
    const loadGraph = async () => {
      const response = await fetch('/graph.json');
      const data = await response.json();
      setGraph(data);
    };

    loadGraph();
  }, []);

  const handleFindPath = () => {
    const path = findShortestPath(graph, startNode, endNode);
    setResult(path);
  };

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
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            End Node:
            <input
              type="text"
              value={endNode}
              onChange={(e) => setEndNode(e.target.value)}
            />
          </label>
        </div>
        <button onClick={handleFindPath}>Find Shortest Path</button>
        <h2>Result: {result}</h2>
      </div>
    </div>
  );
}

export default App;
