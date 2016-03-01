
var TreeAction = {

	create: function (node_content, id) {
		return {
			type: 'create',
			content: node_content,
			id: id
		};
	},

	delete: function (id) {
		return {
			type: 'delete',
			id: id
		};
	},

	search: function (text) {
		return {
			type: 'search',
			text: text
		};
	},

	load: function (data) {
		return {
			type: 'load',
			data
		};
	}
};

module.exports = TreeAction;