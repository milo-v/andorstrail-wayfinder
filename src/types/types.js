/**
 * @typedef {Object} GraphNode
 * @property {string} name
 * @property {string} originalMapName
 * @property {TmxProperties} tmxProperties
 */

/**
 * @typedef {Object} TmxProperties
 * @property {Pair<number, number>} floodFillSource
 * @property {number[][]} floodFilledWalkableMatrix
 * @property {Pair<number, number>[]} floodFilledEntrances
 */

/**
 * @typedef {Map<GraphNode, GraphNode[]>} Graph
 */

/**
 * @template T, U
 * @typedef {Object} Pair
 * @property {T} first
 * @property {U} second
 */

export {}