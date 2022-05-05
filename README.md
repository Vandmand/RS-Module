# Render Sort Module
---
## Introduction:
---
The "Rendering List Module" (also referred to as RS-Module or RSM) is a sorting list system, that brings much needed features to the p5.js engine. The RSM brings:

* Dynamically push p5 functions to draw
* Dynamically change draw order of objects
* Group draw functions to treat as one

### Example:
```js 
let rd;

function setup() {

  // Canvas
  createCanvas(windowWidth, windowHeight);

  // Modules with p5
  rd = new Renderer();
  misc(); 
}

function draw() {
  rd.render();
}

function misc() {
  // Add to the root folder, under the key 'background'
  rd.add('background', () => background(220));

  // Create a node (folder) in root under the key 'foo'
  rd.createNode('foo', 'root')

  // Add a circles in the foo node
  rd.add('fooCircle', () => {circle(100,100,100)}, 'foo')
  rd.add('fooCircle2', () => {circle(120,120,100)}, 'foo')

  // Change priority so 'fooCircle' is drawn on top
  rd.get('fooCircle').priority = 2
}
```
## How to use:
---
To import the RS-Sort module, the first three things are needed. First things first, it's most important that you have a copy of the file. Secondly, you need to reference this file in your HTML code:

```html
<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sketch</title>
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="libraries/p5.min.js"></script>
    <script src="libraries/p5.sound.min.js"></script>
    <script src="...whereeverYouStoredThisFile.../renderer.js"></script>
  </head>
  <body>
    <script src="main.js"></script>
  </body>
</html>
```

Lastly, to use it you need to create a reference object in your JS code:

```js
let rd;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rd = new Renderer();

  // All the other code...
}

function draw() {
  rd.render()
  
  // If you have other code...
}
// More code...
```

Now to add any function in your code you use the add function:

```js
// Syntax: rd.add(key, function, ?path = ROOT)
rd.add('key', () => yourFunctionHere(), 'path')
```

And if you don't want it any more, you can remove that key again:

```js
// Syntax: rd.remove(key, ?path = ROOT)
rd.remove('key', 'path')
```

If you want to create a node use this function:

```js
  // Syntax: rd.createNode(key,?path = ROOT, ?priority = .defaultPriority)
  rd.createNode('key', 'path', 1)
```
## Documentation
---
### Values
#### Object.defaultPriority:
This defines the default priority of the RS-Module, when no priority is defined.

```js
Object.defaultPriority = 3
```

#### Node.priority:
This defines the priority of any node in the tree. To change a nodes' priority, use the [[#get]] method.

```js
Object.get('testKey', 'ROOT').priority = 3
```

### Methods
#### Object.clear()
This method clears entire nodes' leafs.
*Syntax:* `Object.clear(?path: string)`

#### Object.get()
This method returns a leaf or node
*Syntax*: `Object.get(key: string, ?path: string)`

#### Object.createKey()
This method creates a key to store all the functions used by the [[#add]] method. 
*Syntax:* `Object.createKey(key: string, ?path: string, ?priority: number)`

#### Object.createNode()
Create a node in the tree.
*Syntax:* `Object.createNode(key: string, ?path: string, ?priority: number)`

#### Object.add()
This method will add any function to a key.
*Syntax*: `Object.add(key: string, drawFunction: function, ?path: string, ?priority: number)`

The add function will add a function to the renderer. This function executes in the [[#render]] method. An acceptable function looks like: `() => {your code here}`

Example:
```js
.add('testKey', () => {circle(10,10,10)}, 'ROOT', 2)
```

If the key passed does not already exist, a new key will be created with the default priority using the [[#createKey]] method

#### Object.remove()
This method removes a node or leaf
*Syntax:* `Object.remove(key: string, ?path: string)`

#### Object.render()
This method is what executes the rendering,
The render method has no parameters but has to be called every frame.

```js
function draw() {
  Object.render()
}
```

*Syntax:* `Object.render()`

### Debug Methods
#### Object.debug.getName();
This method returns a name to use for naming a key. This method just returns `debug + i++` so that every other key will have a new name.

*Syntax:* `Object.debug.getName()`

#### Object.debug.createSimpleObject()
Creates a circle in the renderer.

*Syntax:* `Object.debug.createSimpleObject(?path, ?x, ?y, ?s )`

#### Object.debug.createInteractable()
Creates a circle that follows the mouse

*Syntax:* `Object.debug.createInteractable(?path, ?s)`




