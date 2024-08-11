//base class that you extend
class Component {
    // 1/2 public API
    constructor(props) {
        this.props = props;
        this._currentElement = null;
        this._pendingState = null;
        this._renderedComponent = null;
        this._renderedNode = null;

        //assert(typeof this.render === 'function');
        if (typeof this.render !== 'function') {
            throw new Error('Subclasses must implement render method also');
        }

        //ensure props are object
        if (typeof this.props !== 'object') {
            throw new TypeError('Props should be object');
        }

        this.componentWillMount();
    }
    //add lifecycle methods to allow devs to interact with a component in specific points in its lifecycle
    componentWillMount() {
        //Lifecycle method: Called before the component is mounted
        //last chance to modify component's state before rendering
    }

    componentDidMount() {
        //Lifecycle method: Called after the component is mounted
        //used to update component state
    }

    componentWillReceiveProps(nextProps) {
        //Lifecycle method: Called when the component is about to receive new props
    }

    shouldComponentUpdate(nextProps, nextState) {
        //Lifecycle method: Called before rendering when new props or state are received
        //Override this method to return false if you don't want the component to update
        return true;
    }

    componentWillUpdate(nextProps, nextState) {
        //Lifecycle method: Called before rendering when new props or state are received
        //similar to componentWillMount but runs before every re-render not just the initial one
    }

    componentDidUpdate(prevProps, prevState) {
        //Lifecycle method: Called after the component has updated
        //ideal for tasks that depend on the component's DOM being updated
    }

    componentWillUnmount() {
        //Lifecycle method: Called just before the component is unmounted and destroyed
        //used for cleanup
    }


    // 2/2 public API
    setState(partialState) {
        if (typeof partialState !== 'object' && typeof partialState !== 'function') {
            throw new TypeError('setState expects object or function.');
        }
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
        if (!element) {
            throw new Error('Need element to construct');
        }
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
        try {
            this.updateComponent(nextElement);
        } catch (error) {
            console.error('Error during receiving component:', error);
            throw error;
        }
    }

    updateComponent(nextElement) {
        if (!nextElement) {
            throw new Error('updateComponent requires nextElement.');
        }
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