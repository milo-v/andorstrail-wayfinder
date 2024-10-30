import { writeFileSync } from "fs";
import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom'; // Assuming you need xmldom for parsing XML in Node.js
import { fileURLToPath } from 'url';
import pako from 'pako';
import { floodFill } from "./floodFill.js";
import '../types/types.js'

/** 
 * This script must be executed before building the web application.
 * Generate a world graph in json format.
 */

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * Iterate the world map starting from home to build world graph
 */
// async function worldMapGraphBuilder() {
//     /** @type {Graph} */
//     const graph = {}
//     const rootNode = "home";
//     const toProcessQueue = [rootNode]
//     while (toProcessQueue.length > 0) {
//         const currentMap = toProcessQueue.shift()
//         const connectedMaps = await getConnectedMaps(currentMap)
//         if (connectedMaps !== undefined) {
//             for (let map of connectedMaps) {
//                 if (!(currentMap in graph)) {
//                     graph[currentMap] = []
//                 }
//                 if (!(graph[currentMap].includes(map))) {
//                     graph[currentMap].push(map)
//                 }
//                 if (!(map in graph)) {
//                     toProcessQueue.push(map)
//                 }
//             }
//         }
//     }
//     const filePath = resolve(__dirname, '../..', 'public', 'graph.json');
//     writeFileSync(filePath, JSON.stringify(graph, null, 2));
// }

// /**
//  * @param {Node} map 
//  */
// async function getConnectedMaps(map) {
//     try {
//         const mapPath = resolve(__dirname, '../..', 'public', 'at-source', 'andors-trail', 'AndorsTrail', 'res', 'xml', `${map}.tmx`);
//         const text = await readFile(mapPath, 'utf8'); // Read the map file
//         const dom = new JSDOM(text, { contentType: "text/xml" })
//         const xmlDoc = dom.window.document
//         const objects = xmlDoc.getElementsByTagName('object');
//         const entrances = Array.from(objects).filter((element) => {
//             return element.getAttribute('type') === 'mapchange';
//         });
//         let connectedMaps = []
//         for (let entrance of entrances) {
//             const destination = entrance.querySelector('property[name="map"]')?.getAttribute('value')
//             connectedMaps.push(destination)
//         }
//         return connectedMaps
//     } catch (error) {
//         console.error(error)
//     }
// }

function worldMapGraphBuilder() {
    /** @type {import("../types/types.js").Graph}*/
    const graph = {}
    /** @type {import("../types/types.js").GraphNode} */
    const rootNode = {
        name: "home",
        originalMapName: "home"
    }

    floodFill(rootNode.walkableMatrix, 5, 9)
}

/** 
 * @param {import("../types/types.js").GraphNode} node
 * 
 * @returns {import("../types/types.js").TmxProperties}
 */
function extractTmxProperties(node) {
    const mapPath = resolve(__dirname, '../..', 'public', 'at-source', 'andors-trail', 'AndorsTrail', 'res', 'xml', `${node.originalMapName}.tmx`);
    const text = readFileSync(mapPath, 'utf8'); // Read the map file
    const dom = new JSDOM(text, { contentType: "text/xml" })
    const xmlDoc = dom.window.document
    const walkableLayerHash = xmlDoc.querySelector("layer[name='Walkable'] > data").innerHTML
    const width = xmlDoc.querySelector("layer[name='Walkable']").getAttribute("width")
    const height = xmlDoc.querySelector("layer[name='Walkable']").getAttribute("height")
    return arrayToMatrix(base64ToInt32Array(walkableLayerHash), width, height)
}

function base64ToInt32Array(base64String) {
    // Step 1: Decode the Base64 string into a Buffer
    const binaryData = Buffer.from(base64String, 'base64');

    // Step 2: Decompress the binary data using pako
    const decompressedData = pako.inflate(binaryData);

    // Step 3: Convert the decompressed Buffer to an array of Int32
    const int32Array = new Int32Array(decompressedData.buffer, decompressedData.byteOffset, decompressedData.length / Int32Array.BYTES_PER_ELEMENT);

    return Array.from(int32Array);
}

function arrayToMatrix(arr, width, height) {
    if (arr.length !== width * height) {
        throw new Error("Array size does not match specified dimensions");
    }

    const matrix = [];
    for (let i = 0; i < height; i++) {
        matrix.push(arr.slice(i * width, (i + 1) * width));
    }
    return matrix;
}

// console.log(base64ToInt32Array('eJzbKMbAsJFIDALEqqUnJhaQqgddLbo+bPL4zKememLjBQAAWzyj'))

// Call the function to execute
worldMapGraphBuilder();
