'use strict';

var React = require('react');
var Agreement = React.createClass({
	displayName: 'Agreement',


	getInitialState: function getInitialState() {
		return {
			agreed: true
		};
	},

	trigger: function trigger() {
		this.props.onAgreed(!this.state.agreed);
		this.setState({
			agreed: !this.state.agreed
		});
	},

	render: function render() {
		var checked = this.state.agreed ? 'checked' : '';
		return React.createElement(
			'div',
			{ className: 'agreement', onClick: this.trigger },
			React.createElement(
				'div',
				{ className: "checkbox " + checked, ref: 'agree', target: 'start_button' },
				React.createElement('i', null)
			),
			React.createElement(
				'lable',
				null,
				'I have already read '
			),
			React.createElement(
				'a',
				{ id: 'rule' },
				'rules'
			)
		);
	}
});

var Car = React.createClass({
	displayName: 'Car',


	componentDidMount: function componentDidMount() {
		this.agreed = true;
	},

	clickHandler: function clickHandler() {
		if (this.agreed) {
			this.props.clickStart();
		}
	},

	onAgreed: function onAgreed(checked) {
		this.agreed = checked;
	},

	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		return this.props.canPlay !== nextProps.canPlay || this.props.over !== nextProps.over;
	},

	render: function render() {

		var footer = [];
		if (this.props.canPlay) {
			footer.push(React.createElement('div', { className: 'button permitted', key: this.props.name,
				onClick: this.clickHandler }));
			footer.push(React.createElement(Agreement, { key: this.props.name + 'agreement', onAgreed: this.onAgreed }));
		} else {
			footer.push(React.createElement('div', { className: "button close " + (this.props.over ? 'over' : ''), key: this.props.name }));
		}

		return React.createElement(
			'div',
			{ className: 'card' },
			React.createElement(
				'div',
				{ className: 'car' },
				React.createElement('img', { src: this.props.img }),
				React.createElement(
					'div',
					{ className: 'car-name' },
					this.props.name
				)
			),
			React.createElement(
				'div',
				{ className: 'card-footer' },
				footer
			)
		);
	}
});

module.exports = Car;