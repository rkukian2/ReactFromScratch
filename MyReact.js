function createElement(type, config, children) {
    //make a copy of config and assign it to props
    //In React, we move some special props off of this object (keys, refs)
     let props = Object.assign({}, config);
    
     //one of the first optimization React starts to make
     //Build props.children. We are making it as an array if we have more than one
     let childCount = arguments.length - 2;
     if (childCount == 1) {
        props.children = children;
     } else if (childCount > 1) {
        props.children = [].slice.call(arguments, 2);
     }

     return {
        type,
        props
    };
}

//DOM Renderer
//Bookkeeping, store some data and ensure that no roots conflict
const ROOT_KEY = 'myReactId';
const instancesByRootId = {};
let rootId = 1;

function isRoot(node) {
    return node.dataset[ROOT_KEY];
}

function render(element, node) {
    assert(Element.isValidElement(element));
    //check if we've already rendered into this node
    //if so, this is an update, otherwise it is an initial render
    //determining if we are using an already rendered instance or creating a new one and mounting it
    if (isRoot(node)) {
        update(element, node);
    } else {
        mount(element, node);
    }
}

//Initial render
function mount(element, node) {
    //Create the internal instance
    //abstracts away the different component types
    let component = instantiateComponent(element);

    //store for later updates & unmounting
    instanceByRootId[rootId] = component;

    //Mounting creates DOM nodes
    //this is where React determines if we are re-mounting server-rendered content
    //will be extremely recursive
    let renderedNode = Reconciler.mountComponent(component, node);

    //Do some DOM operations, marking this node as a root, and inserting new DOM as a child
    node.dataset[ROOT_KEY] = rootId;
    DOM.empty(node);
    DOM.appendChild(node, renderedNode);
    rootId++;
}


function update(element, node) {
    //find the internal instance and update it
    let id = node.dataset[ROOT_KEY];
    let instance = instancesByRootId[id];

    let prevElem = instance._currentElement;
    if (shouldUpdateComponent(prevElem, element)) {
        //send the new element to the instance if it can be an update
        //dependent on the shouldUpdate function
        Reconciler.receiveComponent(
            instance,
            element
        );
    } else {
        //if we aren't allowed to update we are going to unmount current element and mount the new one
        unmountComponentAtNode(node);
        mount(element, node);
    }
    //this is basically happening at every step of the tree
}

//first shortcut
function shouldUpdateComponent(prevElement, nextElement) {
    //determines if we're going to end up reusing an internal instance or not
    //one of the big shortcuts React does
    //stops us from instantiating and comparing full trees
    //instead we immediately throw away a subtree when updating from one element type to another
    //for example, when going from a div to a span, there is a good chance all... 
    //the children are going to be updated or changed, so we can stop and just throw that subtree away
    return prevElement.type == nextElement.type;
}
