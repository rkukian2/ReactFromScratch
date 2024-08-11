//base class that you extend
class Component {
    // 1/2 public API
    constructor(props) {
        this.props = props;
        this._currentElement = null;
        this._pendingState = null;
        this._renderedComponent = null;
        this._renderedNode = null;

        assert(typeof this.render === 'function');
    }

    // 2/2 public API
    setState(partialState) {
        //simplified version
        //this is very batching starts to take place
        //React creates a queue of partial states and then calls setState
        this._pendingState = Object.assign(
            {},
            instance.state,
            partialState
        );
        Reconciler.performUpdateIfNecessary(this);
    }

    //helper for constructor to ensure we store the correct element
    _construct(element) {
        this._currentElement = element;
    }

    mountComponent() {
        //We call the render method to get our rendered element
        //Since React doesn't support Arrays or other types, we can safely assume we have an element 
        let renderedElement = this.render();

        //TODO: call componentWillMount

        //actually instantiate the rendered element
        let component = instantiateComponent(renderedElement);
        this._renderedComponent = component;

        //Generate markup for component & recurse
        //Since composite components instances don't have a DOM representation of their own
        //this markup will actually be the DOM nodes
        let renderedNode = Reconciler.mountComponent(component, node);
        return renderedNode;
    }

    recieiveComponent(nextElement) {
        this.updateComponent(nextElement)
    }

    updateComponent(nextElement) {
        let prevElement = this._currentElement;

        //When state updating nextElement will be the same as the previously rendered element
        //Otherwise, the update is the result of a parent re-rendering
        if (prevElement !== nextElement) {
            //TODO: call componentWillReceiveProps
        }

        //TODO: call shouldComponentUpdate and return if false

        //TODO: call componentWillUpdate

        //update instance data
        this._currentElement = nextElement;
        this.props = nextElement.props;
        if (this._pendingState) {
            this.state = this._pendingState
        }
        this._pendingState = null;
        
        //same as top-level update
        let prevRenderedElement = this._renderedComponent._currentElement;
        let nextRenderedElement = this.render();

        let shouldUpdate = shouldUpdateComponent(prevRenderedElement, nextRenderedElement);

        if (shouldUpdate) {
        Reconciler.receiveComponent(
            this._renderedComponent,
            nextRenderedElement
        );
        } else {
        Reconciler.unmountComponent(
            this._renderedComponent
        );
        let nextRenderedComponent = instantiateComponent(nextRenderedElement);
        let nextMarkup = Reconciler.mountComponent(nextRenderedComponent);
        DOM.replaceNode(
            this._renderedComponent._domNode,
            nextMarkup
        );
        this._renderedComponent = nextRenderedComponent;
        }
    }
}