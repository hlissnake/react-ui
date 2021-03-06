'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var MaxDistance = 100,
	
    RAF = window.requestAnimationFrame || 
          window.webkitRequestAnimationFrame || 
          window.MozRequestAnimationFrame || 
          function(callback){
            setTimeout(callback);
          };

var SlideView = React.createClass({

	componentDidMount : function(){
		// Get current dom reference
	    this.domStyle = ReactDOM.findDOMNode(this).style;
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
	shouldComponentUpdate : function(){
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
			<div className={this.props.className || 'slider' } style={{
					position : 'absolute',
					top : '0px',
					left : '0px',
					width: '100%',
					height: '100%',
					WebkitTransform: this.props.transform,
					WebkitTransition: this.props.transition, // note the capital 'W' here
  					msTransition: this.props.transtion
				}}
				 onTouchStart={this.onDragStart}
				 onTouchMove={this.onDrag}
				 onTouchEnd={this.onDragEnd} >

				{
					this.props.children.map(function(item, i){
						return (
							<SlideItem transform={'translateX(' + i * offsetX + 'px)'} key={i}>

								{ item }
								
							</SlideItem>
						)
					})
				}

			</div>
		)
	}

});
					
// Slide Item object, to wrap the children elements inside Slider
var SlideItem = React.createClass({
	render : function(){
		return (
			<div className="slider-item" style={{
					position : 'absolute',
					top : '0px',
					left : '0px',
					width: '100%',
					height: '100%',
					transform: this.props.transform,
					WebkitTransform: this.props.transform
				}}>
				{this.props.children}
			</div>
		)
	}
});

module.exports = SlideView;