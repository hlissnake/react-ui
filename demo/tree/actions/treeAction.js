var Dispatcher = require('../dispatcher/treeDispatcher');

var TreeAction = {

	createNode : function(node_content, id){
		Dispatcher.dispatch({
	      	source: 'VIEW_ACTION',
			action: {
				type : 'create',
				content : node_content,
				id : id
			}
	    });
	},

	deleteNode : function(id){
		Dispatcher.dispatch({
	    	source: 'VIEW_ACTION',
	    	action: {
		    	type : 'delete',
		    	id : id
	    	}
	    });
	},

	search : function(text){
		Dispatcher.dispatch({
	    	source: 'VIEW_ACTION',
	    	action: {
		    	type : 'search',
		    	text : text
	    	}
	    });
	}
}

module.exports = TreeAction;
