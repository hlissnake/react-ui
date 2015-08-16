(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var App = __webpack_require__(2);
	var Page = __webpack_require__(3);
	var IO = __webpack_require__(6);

	var Data = [
		{
			"img" : "http://gtms02.alicdn.com/tps/i2/TB1dMAjIXXXXXXJXVXXvR3q4VXX-650-480.png",
			"name" : "Honda"
		},
		{
			"img" : "http://gtms04.alicdn.com/tps/i4/TB1wcUsIXXXXXXXXFXXvR3q4VXX-650-480.png",
			"name" : "Sonata L"
		},
		{
			"img" : "http://gtms04.alicdn.com/tps/i4/TB1Hi7AHVXXXXatXFXXKEuMTVXX-520-384.png",
			"name" : "Toyota"
		}
	];

	function enterGame(callback){
		updateCards(callback);
		// IO({
		// 	url : 'c',
		// 	complete : function(res){
		// 		if(res.code == Can_Start_States_MAP["SUCCESS"]) {
		// 			// Game Start
		// 			alert('play game');
		// 		}
		// 	}
		// });
	}

	function updateCards(callback){
		IO({
			url : 'c',
			complete : function(res){
				callback(res);
			}
		});
	}

	IO({
		url : 'c',
		complete : function(res){

			var currentTime = new Date(res.data.serverTime * 1),
				currentIndex = 1,//currentTime.getDate() - 22,
				canPlay = false;

			// React.addons.Perf.start();

			React.render(

				React.createElement(App, {offset:  document.body.getBoundingClientRect().height}, 
					React.createElement(Page, {enterGame: enterGame, 
						  current: currentIndex, 
						  data: Data, 
						  code: res.code}), 

					React.createElement("div", {style: {color : 'red'}}, " Rank list ")
				),

				document.getElementById('app')
			);
		}
	});


/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	React.initializeTouchEvents(true);

	var iOS = window.navigator.userAgent.indexOf('iPhone') >= 0;

	var MaxDistance = 100,
	    MaxScale = 0.5,
		
	    RAF = window.requestAnimationFrame || 
	          window.webkitRequestAnimationFrame || 
	          window.MozRequestAnimationFrame || 
	          function(callback){
	            setTimeout(callback);
	          };

	/**
	 * [getInitialState description]
	 * @param  {[type]} ){		return           {			translate :                                     this.props.translate		};	} [description]
	 * @param  {[type]} componentDidMount     :              function(){		this.direction          [description]
	 * @param  {[type]} shouldComponentUpdate :              function(){		this.domStyle.transform [description]
	 * @return {[type]}                       [description]
	 */
	var AppView = React.createClass({displayName: "AppView",

		componentWillMount : function(){
			this.direction = this.props.direction || 'Y';
			if(this.props.translate == 0) {
				this.status = 'current';
			} else if(this.props.translate < 0) {
				this.status = 'prev';
			} else if(this.props.translate > 0) {
				this.status = 'next';
			}
		},

		/**
		 * [componentDidMount description]
		 * @return {[type]} [description]
		 */
		componentDidMount : function(){
		    this.domStyle = React.findDOMNode(this).style;
			this.domStyle.transform = this._getPosition();
		},

		/**
		 * This method will not be called for the initial render
		 * @return {[boolean]} [prevent ReactElement to rerender]
		 */
		shouldComponentUpdate : function(){
			this.domStyle.transform = this._getPosition();
			return false;
		},

		_bindTransitionEnd : function(callback){
			var isTransitionEnd = false,
				dom = React.findDOMNode(this);

			function transitionEndCallback() {
				callback();
				isTransitionEnd = true;
				dom.removeEventListener('webkitTransitionEnd', arguments.callee);
			}
			dom.addEventListener('webkitTransitionEnd', transitionEndCallback);

			setTimeout(function(){
		        if (isTransitionEnd) return;
		        isTransitionEnd = null;
		        transitionEndCallback();
		    }, 300 + 30);

		},

		/**
		 * [_getPosition description]
		 * @return {[type]} [description]
		 */
		_getPosition : function(distance){
			var scale = 1,
				translate = distance,
				transform = [],
				offset = this.props.offset;

			if(distance > 0) {
				if(this.status == 'prev') {
					scale = MaxScale + (1 - MaxScale) * Math.abs(distance + offset) / offset;
					// translate = distance - height;
				} else if(this.status == 'current') {
					scale = 1;
					// translate = distance;
				}
			} else {
				if(this.status == 'next') {
					scale = 1;
					// translate = height + distance;
				} else if(this.status == 'current') {
			    	scale = 1 - (1 - MaxScale) * Math.abs(distance) / offset;
					// translate = distance;
				}
			}
				
			transform = ["translate", this.direction, "(", translate, "px) translateZ(0px) scale(", scale, ")"];

			// if( this.status == 'next' ||
			//    (this.status == 'current' & distance > 0) ) {

			// 	transform = ["translate", this.direction, "(", (height + distance), "px) translateZ(0px)"];

			// } else {
			// 	var translate = 0, scale = 1;

			// 	if(this.status == 'current') {
			// 		translate = distance;
			// 	} else if(this.status == 'prev') {
			// 		translate = distance - height;
			// 	}

			// 	if( distance > 0 ) {
			// 	    scale = MaxScale + (1 - MaxScale) * Math.abs(distance) / height
			// 	} else if( distance < 0 ) {
			// 	    scale = 1 - (1 - MaxScale) * Math.abs(distance) / height
			// 	}

			// 	transform = ["translate", this.direction, "(", translate, "px) translateZ(0px) scale(", scale, ")"];
			// }

			return transform.join('');
		}, 

		start : function(startDistance){
			this.startDistance = startDistance;
		    this.domStyle.webkitTransition = '';
		},

		move : function(dragDistance){
			this.domStyle.webkitTransform = this._getPosition(dragDistance);
		},

		restore : function(){
		    this.domStyle.webkitTransition = 'all 300ms ease';
			this.domStyle.webkitTransform = this._getPosition(this.startDistance);
		},

		forward : function(offset){
		    this.domStyle.webkitTransition = 'all 300ms ease';
		    this._bindTransitionEnd(function(){
		    	if(this.status == 'current'){
					this.status = 'prev';
				} else if(this.status == 'next') {
					this.status = 'next';
				}
				// this.props.initial();
		    });

			if(this.status == 'current'){
				this.domStyle.webkitTransform = this._getPosition(-offset);
			} else if(this.status == 'next') {
				this.domStyle.webkitTransform = this._getPosition(0);
			} else if(this.status == 'prev') {
				return false;
			}
		},

		back : function(offset){
		    this.domStyle.webkitTransition = 'all 300ms ease';
		    this._bindTransitionEnd(function(){

				// this.props.dispatch();
		    });

			if(this.status == 'current'){
				this.domStyle.webkitTransform = this._getPosition(offset);
			} else if(this.status == 'prev') {
				this.domStyle.webkitTransform = this._getPosition(0);
			} else {
				return false;
			}
		},

		render : function(){
			var transform = this._getPosition(this.props.translate);
			return (
				React.createElement("div", {className: "app-view", 
					 style: {
						position : 'absolute',
						top : '0px',
						left : '0px',
						width: '100%',
						height: '100%',
						WebkitTransform: transform
					 }}, 

		        	React.createElement("div", {class: "app-view-content"}, 
						this.props.children
					)

				)
			)
		}
	});


	/**
	 * [componentDidMount description]
	 * @param  {[type]} ){	                                                             this.domStyle [description]
	 * @param  {[type]} onDragStart :             function(e){		if (this.props.stopped) return;                           var touch [description]
	 * @return {[type]}             [description]
	 */
	var App = React.createClass({displayName: "App",

		componentWillMount : function(){
	   		this.OverThreshold = false;
	   		this.currentIndex = this.props.currentIndex || 0;
	   		this.offset = this.offset;
		},

		componentDidMount : function(){

		    this.domStyle = React.findDOMNode(this).style;

			// this.domStyle.transform = 'translateX(-' + this.props.offset * this.props.currentIndex + 'px) translateZ(0)';
			this.domStyle.transition = 'transform 300ms ease';

			this.initialCardStack();

		},

		initialCardStack : function(){
			var length = this.props.children.length;

			if( this.currentIndex <= 0 ) {
				this.prev = null;
			} else {
				this.prev = this.refs['app-view-' + (this.currentIndex - 1)];
			}

			this.current = this.refs['app-view-' + this.currentIndex];

			if( this.currentIndex >= length -1 ) {
				this.next = null;
			} else {
				this.next = this.refs['app-view-' + (this.currentIndex + 1)];
			}
		},

		onDragStart : function(e){

			if (this.props.stopped) return;

	        var touch = e.touches.length ? e.touches[0] : e.changedTouches[0];
			this.startY = touch.pageY;
	        this.prevPoint = {
	            x: touch.pageX,
	            y: touch.pageY
	        };
	        var startDistance = this.props.offset;

		    this.prev && this.prev.start(-startDistance);
		    this.current.start(0);
		    this.next && this.next.start(startDistance);

		},

		onDrag : function(e){

			var touch = e.touches.length ? e.touches[0] : e.changedTouches[0],
				offsetX = touch.pageX - this.prevPoint.x,
				offsetY = touch.pageY - this.prevPoint.y;
	    	// if(Math.abs(offsetX) > Math.abs(offsetY)) {
	    	// 	e.stopPropagation();
	    	// } else {
	    	// 	return;
	    	// }
	        e.preventDefault();

			this.prevPoint = {
			    x: touch.pageX,
			    y: touch.pageY
			};

		    var moveDistance = Math.floor(touch.pageY - this.startY),
		     	dragDistance;

		    if (moveDistance < 0 && this.currentIndex == this.props.maxLength - 1) {
		    	// e.stopPropagation();
		        return;
		    } else if (moveDistance > 0 && this.currentIndex == 0) {
		    	// e.stopPropagation();
		        return;
		    }

		    dragDistance = moveDistance;

		    this.prev && this.prev.move(dragDistance - this.props.offset);
		    this.current.move(dragDistance);
		    this.next && this.next.move(dragDistance + this.props.offset);

		    if (Math.abs(moveDistance) >= MaxDistance) {
		        if (this.OverThreshold == false) {
		            this.OverThreshold = true;
		            this.dragDistance = moveDistance;
		        }
		    } else {
		        this.OverThreshold = false;
		    }
		},

		onDragEnd : function(){

			if (this.props.stopped) return false;

			var me = this,
				offset = this.props.offset;

		    // this.domStyle.webkitTransition = 'all 300ms ease';

	        if (this.OverThreshold) {
	            this.OverThreshold = false;
	            if (this.dragDistance > 0) {
	                
				    this.prev && this.prev.back(offset);
				    this.current.back(offset);
				    this.next && this.next.back(offset);

	            } else if (this.dragDistance < 0) {
	                
				    this.prev && this.prev.forward(offset);
				    this.current.forward(offset);
				    this.next && this.next.forward(offset);
				    // this.next();
	            }

	        } else {
			    this.prev && this.prev.restore();
			    this.current.restore();
			    this.next && this.next.restore();
	        }
		},

		render : function(){

			var currentIndex = this.currentIndex,
				offset = this.props.offset;

			return (
				React.createElement("div", {className:  (this.props.className || 'app') + (iOS ? ' ios' : ''), 
					 onTouchStart: this.onDragStart, 
					 onTouchMove: this.onDrag, 
					 onTouchEnd: this.onDragEnd}, 

					 
						this.props.children.map(function(item, i){

							var translate = 0;

							if (i < currentIndex) {
								translate = -offset;
							} else if ( i > currentIndex) {
								translate = offset;
							} else {
								translate = 0;
							}

							return (
								React.createElement(AppView, {offset: offset, translate:  translate, ref: 'app-view-' + i, key: i}, 
									item
								)
							)
						})
					

				)
			)
		}

	});

	module.exports = App;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var SlideView = __webpack_require__(4);
	var Car = __webpack_require__(5);

	var Can_Start_States_MAP = {
		'SUCCESS':	'0',//	正常情况	能
		'PLAY_AFTER_PROMOTION':	'S002',//	已经晋级了，再玩	能
		'PLAY_AFTER_WIN':	'S003',//	已经赢过决赛	能
		'NOT_LOGIN':	'-407',//	未登录	不能
		'POINT_NOT_ENOUGH':	'E001',//	积分不足	不能
		'ALIPAY_VERIFIED_FAILED':	'E003',//	支付宝实名认证失败	不能
		'PHONE_VERIFIED_FAILED':	'E016',//	淘宝账号未绑定手机号	不能
		'ROUND_NOT_FOUND':	'E007',//	轮次获取失败	不能
		'SYSTEM_ERROR':	'E009',//	系统异常	不能
		'FINAL_RACE_RIGHT_FAILED':	'E013',//	没有决赛资格	不能
		'PRE_GAME_NOT_START':	'E101',//	00:00-10:00	不能
		'FINAL_GAME_NOT_START':	'E102',//	22:00-22:30	不能
		'TODAY_GAME_CLOSE':	'E103',//	22:50-24:00	不能
		'ROUND_LAST_MINUTE':	'E104',//	本轮最后一分钟不能开始游戏	不能
	}

	var Page = React.createClass({displayName: "Page",

		getInitialState : function(){
			this._analysisData(this.props.data, this.props.code);
			return {
				data : this.props.data
			};
		},

		_analysisData : function(Data, code){
			var canPlay = false,
				currentIndex = this.props.current;

			if( code == Can_Start_States_MAP['PRE_GAME_NOT_START'] ||
				code == Can_Start_States_MAP['TODAY_GAME_CLOSE'] ) {
				canPlay = false;
			} else if ( code == Can_Start_States_MAP['FINAL_GAME_NOT_START'] ) {
				canPlay = false;
			} else {
				canPlay = true;
			}

			for( var i = 0, len = Data.length ; i < len ; i++ ) {
				Data[i].over = false;
				if( i == currentIndex ) {
					Data[i].canPlay = canPlay;
					if(code == Can_Start_States_MAP['TODAY_GAME_CLOSE']) {
						Data[i].over = true;
					}
				} else if( i > currentIndex ) {
					Data[i].over = false;
					Data[i].canPlay = false;
				} else {
					Data[i].over = true;
					Data[i].canPlay = false;
				}
			}
		},

		clickStart : function(){
			var me = this;
			me.props.enterGame(function(res){
				me._analysisData(me.props.data, res.code);
				me.setState({
					data : me.props.data
				});

				// React.addons.Perf.printExclusive();
			});
		},
		
		render : function(){
			return (
				React.createElement("div", {id: "slider"}, 
					React.createElement(SlideView, {
						currentIndex:  this.props.current, 
						offsetX:  320, 
						maxLength:  this.state.data.length}, 

						
							this.state.data.map(function(d){
								return (
									React.createElement(Car, {clickStart: this.clickStart, 
									  img: d.img, name: d.name, canPlay: d.canPlay, over: d.over, 
									  key: d.name})
								);
							}, this)
						

					)
				)
			)
		}

	});

	module.exports = Page;

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	// initialize touch events in mobile
	React.initializeTouchEvents(true);

	var MaxDistance = 100,
		
	    RAF = window.requestAnimationFrame || 
	          window.webkitRequestAnimationFrame || 
	          window.MozRequestAnimationFrame || 
	          function(callback){
	            setTimeout(callback);
	          };

	// Slide Item object, to wrap the children elements inside Slider
	var SlideItem = React.createClass({displayName: "SlideItem",
		render : function(){
			return (
				React.createElement("div", {className: "slider-item", style: {
						position : 'absolute',
						top : '0px',
						left : '0px',
						width: '100%',
						height: '100%',
						transform: this.props.transform,
						WebkitTransform: this.props.transform
					}}, 
					this.props.children
				)
			)
		}
	});

	var SlideView = React.createClass({displayName: "SlideView",

		componentDidMount : function(){
			// Get current dom reference
		    this.domStyle = React.findDOMNode(this).style;
	   		this.OverThreshold = false;
	   		this.currentIndex = this.props.currentIndex;

	   		// initialize the slider position
			this.domStyle.transform = 'translateX(-' + this.props.offsetX * this.props.currentIndex + 'px) translateZ(0)';
			this.domStyle.transition = 'transform 300ms ease';
		},

		/**
		 * avoid to rerender the component
		 * @return {[type]} [description]
		 */
		shouldCOmponentUpdate : function(){
			return false;
		},

		/**
		 * switch to the next item
		 * @return {Function} [description]
		 */
	    next : function(){
	        this.currentIndex += 1;
	        this.props.onnext && this.props.onnext();
	    },

		/**
		 * switch to the previous item
		 * @return {Function} [description]
		 */
	    prev : function(){
	        this.currentIndex -= 1;
	        this.props.onprev && this.props.onprev();
	    },

	    /**
	     * touch start event handler, set the slider into current initial status
	     * @param  {[type]} e [description]
	     * @return {[type]}   [description]
	     */
		onDragStart : function(e){
			if (this.props.stopped) return;

	        var touch = e.touches.length ? e.touches[0] : e.changedTouches[0];
			this.startX = touch.pageX;
	        this.prevPoint = {
	            x: touch.pageX,
	            y: touch.pageY
	        };
	        this.startDistance = -this.currentIndex * this.props.offsetX;
	        this.domStyle.webkitTransition = '';
	        this.domStyle.webkitTransform = 'translateX(-' + Math.abs(this.startDistance) + 'px) translateZ(0)';
		},

		/**
		 * touch move event handler, move the slider
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		onDrag : function(e){
			var touch = e.touches.length ? e.touches[0] : e.changedTouches[0],
				offsetX = touch.pageX - this.prevPoint.x,
				offsetY = touch.pageY - this.prevPoint.y;

	    	if(Math.abs(offsetX) > Math.abs(offsetY)) {
	    		e.stopPropagation();
	    	} else {
	    		return;
	    	}
	        e.preventDefault();

			this.prevPoint = {
			    x: touch.pageX,
			    y: touch.pageY
			};

		    var moveDistance = Math.floor(touch.pageX - this.startX),
		     	dragDistance;

		    if (moveDistance < 0 && this.currentIndex == this.props.maxLength - 1) {
		    	e.stopPropagation();
		        return;
		    } else if (moveDistance > 0 && this.currentIndex == 0) {
		    	e.stopPropagation();
		        return;
		    }

		    dragDistance = this.startDistance + moveDistance;
		    // if some operation occurs rapidly, it is not recommend to trigger state change, which may lead to performance problems
		    // so I get the native browser dom element instead of changing React component states to rerender the transform
		    this.domStyle.webkitTransform = 'translateX(' + dragDistance + 'px) translateZ(0)';

		    if (Math.abs(moveDistance) >= MaxDistance) {
		        if (this.OverThreshold == false) {
		            this.OverThreshold = true;
		            this.dragDistance = moveDistance;
		        }
		    } else {
		        this.OverThreshold = false;
		    }
		},

		/**
		 * touch end event handler, execute next or prev transition animation
		 * @return {[type]} [description]
		 */
		onDragEnd : function(){
			if (this.props.stopped) return false;

			var me = this;

		    this.domStyle.webkitTransition = 'all 300ms ease';

	        if (this.OverThreshold) {
	            this.OverThreshold = false;
	            if (this.dragDistance > 0) {
	                this.prev();
	            } else if (this.dragDistance < 0) {
	                this.next();
	            }

		        RAF(function(){
			        // me.setState({
			        // 	transform : 'translateX(-' + me.props.offsetX * me.currentIndex + 'px) translateZ(0)'
			        // });
			        me.domStyle.webkitTransform = 'translateX(-' + me.props.offsetX * me.currentIndex + 'px) translateZ(0)';
		        })
	        } else {
		        RAF(function(){
			        me.domStyle.webkitTransform = 'translateX(-' + Math.abs(me.startDistance) + 'px) translateZ(0)';
		        })
	        }
		},

		/**
		 * render
		 * @return {[type]} [description]
		 */
		render : function(){
			var offsetX = this.props.offsetX;

			return (
				React.createElement("div", {className: this.props.className || 'slider', style: {
						position : 'absolute',
						top : '0px',
						left : '0px',
						width: '100%',
						height: '100%',
						WebkitTransform: this.props.transform,
						WebkitTransition: this.props.transition, // note the capital 'W' here
	  					msTransition: this.props.transtion
					}, 
					 onTouchStart: this.onDragStart, 
					 onTouchMove: this.onDrag, 
					 onTouchEnd: this.onDragEnd}, 

					
						this.props.children.map(function(item, i){
							return (
								React.createElement(SlideItem, {transform: 'translateX(' + i * offsetX + 'px)', key: i}, 

									 item 
									
								)
							)
						})
					

				)
			)
		}

	});

	module.exports = SlideView;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	var Agreement = React.createClass({displayName: "Agreement",

		getInitialState : function(){
			return {
				agreed : true
			}
		},

		trigger : function(){
			this.props.onAgreed(!this.state.agreed);
			this.setState({
				agreed : !this.state.agreed
			});
		},

		render : function(){
			var checked = this.state.agreed ? 'checked' : '';
			return (
	        	React.createElement("div", {className: "agreement", onClick: this.trigger}, 
	        		React.createElement("div", {className: "checkbox " + checked, ref: "agree", target: "start_button"}, 
	        			React.createElement("i", null)
		        	), 
		        	React.createElement("lable", null, "I have already read "), React.createElement("a", {id: "rule"}, "rules")
		        )
			)
		}
	});

	var Car = React.createClass({displayName: "Car",

		componentDidMount : function(){
			this.agreed = true;
		},

		clickHandler : function(){
			if(this.agreed) {
				this.props.clickStart();
			}
		},

		onAgreed : function(checked){
			this.agreed = checked;
		},

		shouldComponentUpdate : function(nextProps, nextState){
			return this.props.canPlay !== nextProps.canPlay ||
				   this.props.over !== nextProps.over;
		},

		render : function() {

			var footer = [];
			if(this.props.canPlay) {
				footer.push(
					React.createElement("div", {className: "button permitted", key: this.props.name, 
						 onClick: this.clickHandler}
					)
				);
				footer.push(
					React.createElement(Agreement, {key: this.props.name + 'agreement', onAgreed: this.onAgreed})
				);
			} else {
				footer.push(React.createElement("div", {className: "button close " + (this.props.over ? 'over' : ''), key: this.props.name}))
			}

			return (
				React.createElement("div", {className: "card"}, 
			        React.createElement("div", {className: "car"}, 
			            React.createElement("img", {src: this.props.img}), 
			            React.createElement("div", {className: "car-name"}, this.props.name)
			        ), 
			        React.createElement("div", {className: "card-footer"}, 
			        	footer
			        )
			    )
			)
		}
	});

	module.exports = Car;

/***/ },
/* 6 */
/***/ function(module, exports) {

	
	var data_switch = true;

	function mock(cfg){
	    if(cfg.url == 'r') {
	        var rank_data = {
			    "succ": true,
			    "data": {"rankChart":{"rankList":[{"firstNick":"d**a","firstGameTime":1295.0,"roundId":"20150611-1","roundNum":1,"roundBegin":1433988000000,"roundEnd":1433995200000,"roundState":"over","isFinal":false},{"firstNick":"t**3","firstGameTime":1390.0,"roundId":"20150611-2","roundNum":2,"roundBegin":1433995200000,"roundEnd":1434002400000,"roundState":"over","isFinal":false},{"firstNick":"a**7","firstGameTime":1991.0,"roundId":"20150611-3","roundNum":3,"roundBegin":1434002400000,"roundEnd":1434009600000,"roundState":"over","isFinal":false},{"firstNick":"l**3","firstGameTime":1306.0,"roundId":"20150611-4","roundNum":4,"roundBegin":1434009600000,"roundEnd":1434016800000,"roundState":"over","isFinal":false},{"firstNick":"w**6","firstGameTime":1465.0,"roundId":"20150611-5","roundNum":5,"roundBegin":1434016800000,"roundEnd":1434024000000,"roundState":"over","isFinal":false},{"firstNick":"h**5","firstGameTime":1997.0,"roundId":"20150611-6","roundNum":6,"roundBegin":1434024000000,"roundEnd":1434031200000,"roundState":"over","isFinal":false},{"roundId":"20150611-7","roundNum":7,"roundBegin":1434033000000,"roundEnd":1434034200000,"roundState":"not_begin","isFinal":true}]},"playerStatistic":{"isPromotioned":false,"roundStatisticMap":{}},"rankStatus":"NO_BAR","timeStatus":"GAME_REST","remainingTime":10000}
			};
	        cfg.complete(rank_data)
	    } else {
			var can_data = {
				"succ" : "true",
				"code" : data_switch ? "0" : "E101",
				"msg" : "play after promotion.",
				"data" : {
					"serverTime" : +new Date,
					"nick" : "jottest01"
				}
			};
			data_switch = !data_switch;
	    	cfg.complete(can_data);
	    }
	    return false;
	}

	module.exports = function(cfg){
		// if(window.location.search.indexOf('mock') >= 0) {
			mock(cfg);return false;
		// }
		// if(S.UA.mobile) {
		// 	cfg.url = 'mtop.tmw.car.' + cfg.url;
		// } else {
		// 	cfg.url = '//latour.taobao.com/racegame/' + cfg.url + '.do';
		// }

		// Utils.request(cfg);
	}

/***/ }
/******/ ])
});
;