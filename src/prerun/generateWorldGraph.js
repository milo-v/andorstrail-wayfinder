/**
 * @typedef {Object} WalkableParsedMap
 * @property {string} name
 * @property {string[]} entrances
 * 
 * @typedef {string} Node
 * 
 * @typedef {Record<Node, Node[]>} Graph
 * 
 * This script must be executed before building the web application.
 * Generate a world graph in json format.
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from 'path';
import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom'; // Assuming you need xmldom for parsing XML in Node.js
import { fileURLToPath } from 'url';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * Iterate the world map starting from home to build world graph
 */
async function worldMapGraphBuilder() {
    /** @type {Graph} */
    const graph = {}
    const rootNode = "home";
    const toProcessQueue = [rootNode]
    while (toProcessQueue.length > 0) {
        const currentMap = toProcessQueue.shift()
        const connectedMaps = await getConnectedMaps(currentMap)
        if (connectedMaps !== undefined) {
            for (let map of connectedMaps) {
                if (!(currentMap in graph)) {
                    graph[currentMap] = []
                }
                if (!(graph[currentMap].includes(map))) {
                    graph[currentMap].push(map)
                }
                if (!(map in graph)) {
                    toProcessQueue.push(map)
                }
            }
        }
    }
    const filePath = resolve(__dirname, '../..', 'public', 'graph.json');
    writeFileSync(filePath, JSON.stringify(graph, null, 2));
}

/**
 * @param {Node} map 
 */
async function getConnectedMaps(map) {
    try {
        const mapPath = resolve(__dirname, '../..', 'public', 'at-source', 'andors-trail', 'AndorsTrail', 'res', 'xml', `${map}.tmx`);
        const text = await readFile(mapPath, 'utf8'); // Read the map file
        const dom = new JSDOM(text, { contentType: "text/xml" })
        const xmlDoc = dom.window.document
        const objects = xmlDoc.getElementsByTagName('object');
        const entrances = Array.from(objects).filter((element) => {
            return element.getAttribute('type') === 'mapchange';
        });
        let connectedMaps = []
        for (let entrance of entrances) {
            const destination = entrance.querySelector('property[name="map"]')?.getAttribute('value')
            connectedMaps.push(destination)
        }
        return connectedMaps
    } catch (error) {
        console.error(error)
    }
}

// Call the function to execute
worldMapGraphBuilder();
