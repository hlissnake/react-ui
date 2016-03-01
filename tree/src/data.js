var TreeData = [
	{
		content : 'JavaScript',
		id : 'aa',
		checkable : true,
		childrenNodes : [
			{
				content : 'HTML5',
				id : 'aaa',
				checkable : true
			}, {
				content : 'Librarys',
				id : 'aab',
				checkable : true,
				childrenNodes : [
					{
						content : 'React.js',
						id : 'aaba',
						checkable : true
					}, {
						content : 'AngularJS',
						id : 'aabb',
						checkable : true
					}, {
						content : 'Backbone.js',
						id : 'aabc',
						checkable : true
					}
				]
			}, {
				content : 'CSS3',
				id : 'aac',
				checkable : true
			}, {
				content : 'Canvas',
				id : 'aae',
				checkable : true
			}, {
				content : 'NPM',
				id : 'aaf',
				checkable : true
			}, {
				content : 'SASS',
				id : 'aag',
				checkable : true
			}
		]
	}, {
		content : 'Java',
		id : 'ab',
		checkable : true,
		childrenNodes : [
			{
				content : 'J2EE',
				id : 'aba',
				checkable : true
			}, {
				content : 'Struct',
				id : 'abb',
				checkable : true
			}, {
				content : 'Spring',
				id : 'abc',
				checkable : true
			}, {
				content : 'AOP',
				id : 'abd',
				checkable : true
			}, {
				content : 'JSP',
				id : 'abe',
				checkable : true
			}
		]
	}
]

module.exports = {
	load : function(callback){
		setTimeout(function(){
			callback(TreeData);
		}, 200)
	}
};