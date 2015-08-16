var Immutable = require('immutable');
var Tree = require('../tree');
var TreeAction = require('./actions/treeAction');
var TreeStore = require('./stores/treeStore');
var TreeData = require('./data');

var TreeRoot = React.createClass({displayName: "TreeRoot",

	getInitialState : function(){
		return {
			nodes : []
		}
	},

	filterKeyword : function(e){
		TreeAction.search(e.target.value);
	},

	componentDidMount : function(){
		var me = this;

		TreeStore.fetch(function(data){
			me.setState({
				nodes : data
			})
		})

		TreeStore.onChange(me._onChange);
	},

	componentWillUnmount : function(){
		TreeStore.offChange(this._onChange);
	},

	render : function(){
		return (
			React.createElement("div", null, 
				React.createElement("div", {className: "tree-search"}, 
					React.createElement("input", {type: "text", placeholder: "keyword", className: "tree-keyword-search", onChange: this.filterKeyword}), 
					React.createElement("span", {className: "tree-search-mark"})
				), 
			
				this.state.nodes.map(function(node, i){
					return (
						React.createElement(Tree, {node: Immutable.Map(node), key: node.id, 
							addNode: this._addNode, 
							deleteNode: this._deleteNode})
					)
				}.bind(this))
			
			)
		)
	},

	_onChange : function(){
		this.setState({
			nodes : TreeStore.get()
		})
	},

	_addNode : function(content, id){
		TreeAction.createNode(content, id);
	},

	_deleteNode : function(id){
		TreeAction.deleteNode(id)
	}
})

React.render(
	React.createElement(TreeRoot, {data: TreeData}),
	document.getElementById('tree')
);
