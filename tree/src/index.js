var React = require('react');
var ReactDOM = require('react-dom');
var Immutable = require('immutable');
var Redux = require('redux');

var Tree = require('./ui/tree');
var TreeAction = require('./action');
var TreeReducer = require('./reducer');
var TreeData = require('./data');

var TreeStore = Redux.createStore(TreeReducer);

var App = React.createClass({

	getInitialState : function(){
		return {
			nodes : []
		}
	},

	filterKeyword : function(e){
		TreeStore.dispatch(TreeAction.search(e.target.value));
	},

	componentDidMount : function(){
		// TreeStore.subscribe(me._onChange);
	},

	componentWillUnmount : function(){
		// TreeStore.unsubscribe(this._onChange);
	},

	render : function(){
		return (
			<div>
				<div className="tree-search">
					<input type="text" placeholder="keyword" className="tree-keyword-search" onChange={this.filterKeyword}/>
					<span className="tree-search-mark"></span>
				</div>
			{
				this.props.nodes.map(function(node, i){
					return (
						<Tree node={Immutable.Map(node)} key={node.id}
							addNode={this._addNode}
							deleteNode={this._deleteNode} ></Tree>
					)
				}.bind(this))
			}
			</div>
		)
	},

	_onChange : function(){
		this.setState({
			nodes : TreeStore.getState()
		})
	},

	_addNode : function(content, id){
		TreeStore.dispatch(TreeAction.create(content, id));
	},

	_deleteNode : function(id){
		TreeStore.dispatch(TreeAction.delete(id))
	}
});

TreeStore.subscribe(render);

// Mocking for API request
TreeData.load(function(data){
	TreeStore.dispatch(TreeAction.load(data))
});

function render(){
	ReactDOM.render(
		<App nodes={TreeStore.getState()} />,
		document.getElementById('tree')
	);
}
