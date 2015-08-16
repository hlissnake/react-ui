### React UI Components

##### SlideView

High Performance slideView component for mobile. using native dom animation instead of setting React state to avoid creating React Elements rapidly

````
<SlideView 
	currentIndex={ currentIndex } 
	offsetX={ slide distance } 
	maxLength={ slides max count } >

	{ children }

</SlideView> 
````

##### App


##### Tree

Tree Component for React, which is independent, checkable, selectable, deletable and can add new nodes.
Using Immutable.js to defined inner data for each single TreeNode.

Using Flux architecture to develop the demo. Tree View and search input will trigger the Action to dispatch a action request to Dispatcher. then the store will work to achieve the adding new node, delete a old one, and Searching the whole tree in a efficient way.

````
// JSX, please use immutable.js to define the data
<Tree node={Immutable.Map(node)} key={node.id}
	addNode={this._addNode}
	deleteNode={this._deleteNode} ></Tree>

// Actions comments
TreeAction.createNode
TreeAction.deleteNode
TreeAction.search
````


##### GridTable