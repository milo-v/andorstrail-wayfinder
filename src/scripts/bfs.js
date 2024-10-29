// BFS algorithm to find the shortest path
export const findShortestPath = (graph, start, end) => {
    if (!graph[start] || !graph[end]) return 'Invalid nodes';

    const queue = [[start]];
    const visited = new Set();

    while (queue.length > 0) {
        const path = queue.shift();
        const node = path[path.length - 1];

        if (node === end) {
            return path.join(' -> ');
        }

        if (!visited.has(node)) {
            visited.add(node);
            const neighbors = graph[node] || [];

            for (const neighbor of neighbors) {
                queue.push([...path, neighbor]);
            }
        }
    }

    return 'No path found';
};