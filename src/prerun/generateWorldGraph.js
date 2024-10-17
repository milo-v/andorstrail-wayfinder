import { writeFileSync } from "fs";
import { resolve, dirname } from 'path';
import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom'; // Assuming you need xmldom for parsing XML in Node.js
import { fileURLToPath } from 'url';

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// async function worldMapGraphBuilder() {
//     /* first get home map, it's where the journey begins */
//     const homeMapPath = resolve(__dirname, '../..', 'public', 'at-source', 'andors-trail', 'AndorsTrail', 'res', 'xml', 'home.tmx');
//     const text = await readFile(homeMapPath, 'utf8'); // Read the home map file
//     const dom = new JSDOM(text, { contentType: "text/xml" })
//     const xmlDoc = dom.window.document
//     const nodeXmlElement = xmlDoc.querySelector('object[type="mapchange"]');
//     const root = {
//         name: 'home|' + nodeXmlElement?.querySelector('property[name="map"]')?.getAttribute('value'),
//         xmlElement: nodeXmlElement,
//         parentMap: 'home'
//     };

//     const toProcessQueue = [root];
//     /* start building the graph */
//     let graph = {};
//     console.log('\n')
//     while (toProcessQueue.length > 0) {
//         const currentNode = toProcessQueue.shift();
//         process.stdout.write(`\r${toProcessQueue.length} - ${currentNode.name}`);
//         const nextMap = currentNode?.xmlElement.querySelector('property[name="map"]')?.getAttribute('value');
//         const nextMapNodes = await fetchNodesInMap(nextMap);
//         if (nextMapNodes !== undefined) {
//             for (let node of nextMapNodes) {
//                 putAdjacent(graph, currentNode, node);
//                 if (!(node.name in graph)) {
//                     toProcessQueue.push(node);
//                 }
//             }
//         }
//     }

//     const filePath = resolve(__dirname, '../..', 'public', 'graph.json');
//     writeFileSync(filePath, JSON.stringify(graph, null, 2));

//     return graph;
// }

// async function fetchNodesInMap(map) {
//     try {
//         const mapPath = resolve(__dirname, '../..', 'public', 'at-source', 'andors-trail', 'AndorsTrail', 'res', 'xml', `${map}.tmx`);
//         const text = await readFile(mapPath, 'utf8'); // Read the map file
//         const dom = new JSDOM(text, { contentType: "text/xml" })
//         const xmlDoc = dom.window.document
//         const objects = xmlDoc.getElementsByTagName('object');
//         const entrances = Array.from(objects).filter((element) => {
//             return element.getAttribute('type') === 'mapchange';
//         });
//         let lstNodes = [];
//         for (let entrance of entrances) {
//             lstNodes.push({
//                 name: map + '|' + entrance.querySelector('property[name="map"]')?.getAttribute('value'),
//                 xmlElement: entrance,
//                 parentMap: map
//             });
//         }
//         return lstNodes;
//     } catch (error) {
//         console.error(error)
//         console.log('\n')
//     }
// }
/**
 * @typedef {Object<string, Array<string>>} Graph
 */

/**
 * @typedef {string} Node
 */

/**
 * Iterate the world map starting from home to build world graph
 */
async function worldMapGraphBuilder() {
    /** @type {Graph} */
    const graph = {}
    const rootNode = "home";
    const toProcessQueue = [rootNode]
    console.log('\n')
    while (toProcessQueue.length > 0) {
        const currentMap = toProcessQueue.shift()
        process.stdout.write(`\r${toProcessQueue.length} - ${currentMap}`);
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
        console.log('\n')
    }
}

// Call the function to execute
worldMapGraphBuilder();
