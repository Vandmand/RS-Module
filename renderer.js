// ===========================================================
// = Renderer Module = Elias Kulmbak = v 0.2.2
// ===========================================================
/*
    This module collects all "renders" from p5.
    All p5 functions like fill(), stroke and other visual 
    only changes in scope of key
*/
'use strict';
class Renderer {
    constructor() {
        // The variable that actually holds the rendering:
        this.renderList = new Map();

        // Self explanitory
        this.defaultPriority = 0;

        //Custom error message
        this.Error = class RenderError extends Error {
            constructor(message) {
                super(message);
                this.name = "RenderError";
            }
        }

        // Debugging functions
        this.debug = {
            debugNamingNumber: 1,
            getName: () => {
                return 'debug' + this.debug.debugNamingNumber++;
            },
            createSimpleObject: (path = 'ROOT', x = width / 2, y = height / 2, s = height / 4) => {
                this.add(this.debug.getName(), () => { circle(x, y, s) });
            },
            createInteractable: (path = 'ROOT', s = height / 4) => {
                this.add(this.debug.getName(), () => { circle(mouseX, mouseY, s) });
            },
            getFunctions: (key, path) => {  
                let returnArray = [];
                this.get(key, path).functions.forEach(func => {
                    returnArray.push(func.toString());
                });
                return returnArray;
            }
        }
    }
    // ------------------------------------------------
    // Global methods : Should be called outside class
    // ------------------------------------------------

    // Clear entire node
    clear(path = 'ROOT') {
        this.valPath(path).clear();
    }

    // Returns the specefied key if such key exist. Else returns false
    get(key, path = 'ROOT') {

        path = this.valPath(path);

        return path.has(key) ? path.get(key) : undefined
    }

    // Add function(s) to renderKey
    // Param drawFuntion takes both array or function
    // If a non-existant key is supplied, creates key, then runs function
    add(key, drawFunction, path = 'ROOT') {
        const valPath = this.valPath(path)

        // Key exists?
        if (this.get(key, path)) {
            switch (drawFunction.constructor) {
                case Function:
                    valPath.get(key).data.push(drawFunction);
                    break;
                case Array:
                    drawFunction.forEach(func => {
                        this.add(key, func, path);
                    });
                    break;
                default:
                    throw new this.Error('Invalid datatype');
            }
        } else {
            this.createKey(key, path);
            this.add(key, drawFunction, path);
        }
    }
    // Create renderKey
    createKey(key, path = 'ROOT', priority = this.defaultPriority) {
        if (this.get(key, path)) {
            throw new this.Error('Key already exists');
        } else {
            this.insert(path, [key, { priority: priority, data: [] }])
        }
    }

    // Create new node in tree
    createNode(key, path = 'ROOT', priority = this.defaultPriority) {
        if (this.get(key, path)) {
            throw new this.Error('Key already exists');
        } else {
            this.insert(path, [key, { priority: priority, data: new Map() }])
        }
    }

    // Remove renderKey
    remove(key, path = 'ROOT') {
        path = this.valPath(path)

        if (path.get(key)) {
            path.delete(key);
        } else {
            throw new this.Error('Key does not exist');
        }
    }

    // Render all keys
    render(node = this.renderList) {
        node.forEach(renderGroup => {
            if (renderGroup.data.constructor == Array) {
                push();
                renderGroup.data.forEach(drawFunction => {
                    drawFunction();
                })
                pop();
            } else if (renderGroup.data.constructor == Map) {
                push();
                this.render(renderGroup.data)
                pop();
            }
        });
    }

    // -------------------------------------------------
    // Local Methods : should not be used outside class
    // -------------------------------------------------

    // Validate any input path
    valPath(path) {
        let returnPath;

        if (path.toUpperCase() == 'ROOT') {
            returnPath = this.renderList
        } else {
            let currNode = this.renderList

            const pathArr = path.split('.')
            pathArr.forEach(node => {   
                try {
                    currNode = currNode.get(node).data
                } catch (error) {
                    throw new this.Error('path does not exist: ' + error);
                }
            })
            if (currNode.constructor == Map) {
                returnPath = currNode;
            }
        }
        return returnPath;
    }

    // Insert data into node
    insert(path, data) {
        let validPath = this.valPath(path);
        const oldMap = [...validPath];
        const left = oldMap.filter(entry => { if (entry[1].priority <= data[1].priority) { return true } });
        const right = oldMap.filter(entry => { if (entry[1].priority > data[1].priority) { return true } });
        if (path.toUpperCase() == 'ROOT') {
            this.renderList = new Map(left.concat([data], right));
        } else {
            let currNode = this.renderList

            let nodeName;
            let nodePriority;

            const pathArr = path.split('.')
            for (let i = 0; i < pathArr.length; i++) {
                const node = pathArr[i];
                if(i == pathArr.length-1) {
                    nodeName = node;
                    nodePriority = currNode.get(node).priority;
                } else {
                    currNode = currNode.get(node).data
                }
            }
            currNode.delete(nodeName);
            currNode.set(nodeName, {priority: nodePriority, data: new Map(left.concat([data], right))});
        }
    }

    // Unused function previously using the quicksort algorithm
    sortKeys() {
        const unSorted = [...this.renderList];
        this.renderList = new Map(unSorted.sort((entry1, entry2) => {
            let entry1Value = entry1[1].priority;
            let entry2Value = entry2[1].priority;
            if (entry1Value > entry2Value) {
                return 1;
            } else {
                return -1;
            }
        }))
    }
}