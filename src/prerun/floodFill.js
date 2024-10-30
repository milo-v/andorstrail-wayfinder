export function floodFill(matrix, startX, startY) {
    // Check if the starting point is a 0, if not, exit
    if (matrix[startX][startY] !== 0) return;

    // Define 8 possible directions (up, down, left, right, and diagonals)
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],  // up, down, left, right
        [-1, -1], [-1, 1], [1, -1], [1, 1] // diagonals
    ];

    // Recursive DFS function to perform flood-fill
    function dfs(x, y) {
        // Check boundary conditions and if the cell is already visited or not a 0
        if (x < 0 || y < 0 || x >= matrix.length || y >= matrix[0].length || matrix[x][y] !== 0) {
            return;
        }

        // Change the cell to 2
        matrix[x][y] = 2;

        // Recursively apply flood-fill in all 8 directions
        for (const [dx, dy] of directions) {
            dfs(x + dx, y + dy);
        }
    }

    // Start flood-fill from the initial coordinate
    dfs(startX, startY);
}