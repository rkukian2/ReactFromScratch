function mountComponent(component) {
    //This will generate the DOM node that will go into the DOM
    //we defer to component instance since it will contain renderer specific implementation
    //This allows the reconciler to be reused across DOM & Native
    let markup = component.mountComponent();
    return markup;
}

//shortcut
function receiveComponent(component, element) {
    //don't do anything if the next element is the smae as the current one
    //unlikely in normal JSX usage
    let prevElement = component._currentElement;
    if (prevElement == element) {
        return;
    }
    //defer to the instance
    component.receiveComponent(element);
}

function unmountComponent(component) {
    component.unmountComponent();
}

function performUpdateIfNecessary(component) {
    component.performUpdateIfNecessary();
}