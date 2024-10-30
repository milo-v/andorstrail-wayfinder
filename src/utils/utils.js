/**
 * Compares two 2D arrays of numbers for equality.
 * @param {number[][]} arr1 - The first 2D array.
 * @param {number[][]} arr2 - The second 2D array.
 * @returns {boolean} - True if arrays are equal, false otherwise.
 */
function compare2DArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i].length !== arr2[i].length) return false;

        for (let j = 0; j < arr1[i].length; j++) {
            if (arr1[i][j] !== arr2[i][j]) return false;
        }
    }

    return true;
}