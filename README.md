# ReactFromScratch

This project is helping understand the internal details of the React Framework

*Notes from* - [Paul O Shannessy - Building React From Scratch
](https://www.youtube.com/watch?v=_MAD4Oly9yg)

**Terminology:**
*Component Classes* - what we define in our React components

*Component Instances* - Everytime React news up one of these classes it creates an instance. Should not be done by yourself, REACT does it for you.

*Element* - what we create in our render function. Do not have any instance information. Are very lightweight, usually just a type field and a props field.

*Mount* - refers to initial creation

**APIs**

*Top Level API*
MyReact.createELement - same as React.createElement
MyReact.Component - base class
MyReact.render

*Component Class API*
constructor()
render()
setState()
this.props
this.state

*Base Class API*
mountChildren()
updateChildren()
unmountChildren()

**Internal Component Lifecycle**

Constructor - Instantiates component

mountComponent - Next thing that happens. Generates DOM nodes and returns those

receiveComponent - receive updates and partial updates from renders that happen above

updateComponent - mostly internal API

unmountComponent - release memory