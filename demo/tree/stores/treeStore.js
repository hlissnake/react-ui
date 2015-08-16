var Dispatcher = require('../dispatcher/treeDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var CHANGE_EVENT = 'change';
var FILTER_EVENT = 'search'

var MOCK_DATA = [
	{
		content : 'AA',
		id : 'aa',
		checkable : true,
		childrenNodes : [
			{
				content : 'AAA',
				id : 'aaa',
				checkable : true
			}, {
				content : 'AAB',
				id : 'aab',
				checkable : true,
				childrenNodes : [
					{
						content : 'AABA',
						id : 'aaba',
						checkable : true
					}, {
						content : 'AABB',
						id : 'aabb',
						checkable : true
					}
				]
			}, {
				content : 'AAC',
				id : 'aac',
				checkable : true
			}
		]
	}, {
		content : 'AB',
		id : 'ab',
		checkable : true,
		childrenNodes : [
			{
				content : 'ABA',
				id : 'aba',
				checkable : true
			}, {
				content : 'ABB',
				id : 'abb',
				checkable : true
			}, {
				content : 'ABC',
				id : 'abc',
				checkable : true
			}
		]
	}
];

/**
 * Binary tree Recurisve algorithm to find a node depend on a particular equality function
 * @param  {[type]}   nodes [description]
 * @param  {Function} fn    [description]
 * @return {[type]}         [description]
 */
function findNode(nodes, fn){
	for(var i = 0; i < nodes.length; i++) {
		var node = nodes[i];
		if(fn(node)) {
			return node;
		} else if(node.childrenNodes) {
			var childNode = findNode(node.childrenNodes, fn);
			if(childNode) {
				return childNode;
			}
		}
	}
}

/**
 * Recurisve algorithm to find the parent node according to a particular equality function
 * @param  {[type]}   parentNode [description]
 * @param  {Function} fn         [description]
 * @return {[type]}              [description]
 */
function findParent(parentNode, fn){
	if(parentNode.childrenNodes) {
		for(var i = 0; i < parentNode.childrenNodes.length; i++) {
			var node = parentNode.childrenNodes[i];
			if(fn(node)) {
				return parentNode;
			} else {
				var childNode = findParent(node, fn);
				if(childNode) {
					return childNode;
				}
			}
		}
	} else {
		return false
	}
}

/**
 * recursive all the nodes in a tree, particular for visibility
 * @param  {[type]}   nodes [description]
 * @param  {Function} fn    [description]
 * @return {[type]}         [description]
 */
function recursive(node, compareFn, resultFn){

    var childrenInvisible = true;
	var result = compareFn(node);

	if(node.childrenNodes) {
		for(var i = 0; i < node.childrenNodes.length; i++) {
			var n = node.childrenNodes[i];

			var childrenResult = recursive(n, compareFn, resultFn);
			if(childrenResult) {
				childrenInvisible = false;
			}
		}
	}
			
	return resultFn(node, result, childrenInvisible);
}

var TreeStore = assign({}, EventEmitter.prototype, {

	fetch : function(callback){
		setTimeout(function(){
			callback(MOCK_DATA);
		}, 300);
	},

	get : function(){
		return MOCK_DATA;
	},

	emitChange : function(){
		this.emit(CHANGE_EVENT);
	},

	onChange : function(callback){
		this.on(CHANGE_EVENT, callback)
	},

	offChange : function(callback){
		this.removeListener(CHANGE_EVENT, callback)
	},

	dispatcher : Dispatcher.register(function(payload){
		var action = payload.action;

		switch(action.type){

			case 'create':
				// alert('add : ' + action.content);
				var parentNode = findNode(MOCK_DATA, function(node){
					if(node.id === action.id) {
						return node;
					}
				});

				if(parentNode) {

					var newNode = {
						content : action.content,
						checkable : true
					};

					if(parentNode.childrenNodes) {
						newNode.id = parentNode.id + parentNode.childrenNodes.length;
						parentNode.childrenNodes.push(newNode);
					} else {
						newNode.id = parentNode.id + 0;
						parentNode.childrenNodes = [newNode];
					}
					TreeStore.emitChange();
				}
				break;

			case 'delete':
				// alert('delete : ' + action.id);
				var currentNode = findNode(MOCK_DATA, function(node){
					if(node.id === action.id) {
						return node;
					}
				});
				var parentNode = (function(){
					for(var i = 0; i < MOCK_DATA.length; i++) {
						var target = findParent(MOCK_DATA[i], function(node){
							if(node.id === action.id) {
								return true;
							}
						});
						if(target) {
							return target;
						}
					}
				})();

				if(currentNode && parentNode) {
					var index = parentNode.childrenNodes.indexOf(currentNode);
					parentNode.childrenNodes.splice(index, 1);
					TreeStore.emitChange();
				}
				break;

			case 'search':
				for(var i = 0; i < MOCK_DATA.length; i++) {

					recursive(MOCK_DATA[i], 
						function compare(node){
							node.invisible = false;
							if( node.content.indexOf(action.text) < 0 ) {
								return false;
							} else {
								return true;
							}
						}, 
						function result(node, result, childrenInvisible){
							if(result || !childrenInvisible) {
								return true;
							} else {
								node.invisible = true;
								return false;
							}
						});
				}
				TreeStore.emitChange();
				break;
		}

		return true;
	})

})

module.exports = TreeStore;
