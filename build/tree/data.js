module.exports = [
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