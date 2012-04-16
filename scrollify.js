/*!
 * Scrollify - v1.0.0
 *
 * Author: Michael Pazienza
 * Copyright 2012 Mass Relevance
 *
 * Scrollify allows for a custom scrollbar to work along with mousewheel and touch events.
 * 
 * USE: you will need a mask, content container, and scrollbar with handle
 * 
 * <div class="mask">
 *   <div class="content"></div>
 *   <div class="scrollbar"><div class="handle">&nbsp;</div></div>
 * </div>
 * 
 * CSS: you can use this boilerplate as a starter
 * 
 * .mask {height:100%;position:relative;overflow:hidden;}
 * .content {position:absolute;}
 * .scrollbar {height:100%;width:1em;top:0;right:0;background:#ccc;position:absolute;z-index:2;}
 * .scrollbar .handle {width:1em;height:6em;top:0;left:0;background:#fff;border-radius:15px;position:absolute;cursor:pointer;z-index:3;}
 * 
 * Your will then initialize the Scrollify function on the mask element $('.mask').Scrollify();
 */

// requires: jQuery
(function ($, window) {
	$.fn.Scrollify = function (params) {
		var defaults = {
					touch_enable  : true,        // (boolean) Should scroll allow for touch
					wheel_enable  : true,        // (boolean) Should allow for a mousewheel
					bar_enable    : true,        // (boolean) Should show a scroll bar
					auto_generate : false,       // (boolean) Should the bar be auto generated
					class_bar     : 'scrollbar', // (string) Class used for the scroll bar
					class_handle  : 'handle',    // (string) Class used for the scroll handle
					class_content : 'content'
				},
				_win = $(window);

		params = $.extend(defaults, params);

		function getTouches(e) {
			if (e.originalEvent) {
				return e.originalEvent.changedTouches || e.originalEvent.touches;
			}
			return e.touches
		}

		return this.each(function () {
			var _obj     = $(this),
					_bar     = _obj.find('.' + params.class_bar),
					_hdl     = _bar.find('.' + params.class_handle),
					_cnt     = _obj.find('.' + params.class_content),
					_hstart  = 0,
					_tscroll = false,
					_tstart  = 0,
					_setup, _up, _down, _move, _wheel, _touchstart, _touchend, _touchmove, _kill;

			// Setup the content
			_setup = function () {
				// Generate Scrollbar
				_bar = $('<div>').addClass(params.class_bar);
				_hdl = $('<div>').addClass(params.class_handle).appendTo(_bar);

				// Make content wrapper
				_obj.wrapInner($('<div>').addClass(params.class_content));
				_cnt = _obj.find('.' + params.class_content);

				// Add Scrollbar
				_obj.append(_bar);
			};

			// Kill all events
			_kill = function (e) {
				e.preventDefault();
				e.stopPropagation();

				// Disable mouseup event
				_win.unbind('mouseup', _up);

				// Disable mousemove event
				_win.unbind('mousemove', _move);

				// Disable touch function
				_obj.unbind('touchend.touchScroll touchcancel.touchScroll', _touchend);

				// Disable touchmove function
				_obj.unbind('touchmove.touchScroll', _touchmove);

				// Verify that the scrollbar and handle exist if bar is enabled
				if (params.bar_enable) {
					_hdl.bind('mousedown', _down); // bind mousedown event to handle
				}

				// Activate touch events if enabled
				if (params.touch_enable) {
					_obj.bind('touchstart.touchScroll', _touchstart);
				}
			};

			// Mouse up event
			_up = function (e) {
				e.preventDefault();
				e.stopPropagation();

				// Disable mouseup event
				_win.unbind('mouseup', _up);

				// Disable mousemove event
				_win.unbind('mousemove', _move);

				// Bind mousedown event
				_hdl.bind('mousedown', _down);
			};

			// Mouse down event
			_down = function (e) {
				e.preventDefault();
				e.stopPropagation();

				_hstart = e.pageY - _hdl.offset().top;

				// Disable mousedown event
				_hdl.unbind('mousedown', _down);

				// Bind release function
				_win.bind('mouseup', _up);

				// Bind move function
				_win.bind('mousemove', _move);
			};

			// Mouse move event
			_move = function (e) {
				e.preventDefault();
				e.stopPropagation();

				var _max     = _bar.innerHeight() - _hdl.height(),
						_hoffset = e.pageY - _bar.offset().top - _hstart,
						_coffset;

				// Offset cannot be less than zero
				if (_hoffset < 0) {
					_hoffset = 0;

				// Offset cannot be greater than the available scrollbar height
				} else if (_hoffset > _max) {
					_hoffset = _max;
				}

				// Set the content offset
				_coffset = (_cnt.outerHeight() - _obj.innerHeight()) * (_hoffset/_max);

				// Move the handle
				_hdl.css('margin-top', _hoffset + 'px');
				
				if (_cnt.outerHeight() > _obj.innerHeight()) {
					// Move the content
					_cnt.css('margin-top', -(_coffset) + 'px');
				}
			};

			// Mouse wheel event
			_wheel = function (e) {
				e.preventDefault();
				e.stopPropagation();

				var _delta   = e.originalEvent.wheelDelta || -e.originalEvent.detail * 2,
						_max     = -Math.abs(_cnt.outerHeight() - _obj.innerHeight()),
						_coffset = _delta + parseInt(_cnt.css('margin-top'), 10),
						_hoffset;

				// Offset cannot be greater than zero
				if (_coffset < _max) {
					_coffset = _max;

				// Offset cannot be less than the available content height
				} else if (_coffset > 0) {
					_coffset = 0;
				}

				// Set the content offset
				_hoffset = (_bar.innerHeight() - _hdl.height()) * Math.abs(_coffset/_max);

				// Move the handle
				_hdl.css('margin-top', _hoffset + 'px');

				// Move the content
				_cnt.css('margin-top', _coffset + 'px');
			};

			// Touchstart event
			_touchstart = function (e) {
				e.preventDefault();
				e.stopPropagation();

				var touches = getTouches(e)[0];

				_tscroll = true;
				_tstart  = touches.pageY;

				// Disable touchstart event
				_obj.unbind('touchstart.touchScroll', _touchstart);

				// Bind release function
				_obj.bind('touchend.touchScroll touchcancel.touchScroll', _touchend);

				// Bind move function
				_obj.bind('touchmove.touchScroll', _touchmove);
			};

			// Touchend event
			_touchend = function (e) {
				e.preventDefault();
				e.stopPropagation();

				_tscroll = false;

				// Disable release function
				_obj.unbind('touchend.touchScroll touchcancel.touchScroll', _touchend);

				// Disable move function
				_obj.unbind('touchmove.touchScroll', _touchmove);

				// Bind touchstart event
				_obj.bind('touchstart.touchScroll', _touchstart);
			};

			// Touchmove event
			_touchmove = function (e) {
				e.preventDefault();
				e.stopPropagation();

				if (_tscroll) {
					var _delta   = (getTouches(e)[0].pageY - _tstart) * 0.8,
							_max     = -Math.abs(_cnt.outerHeight() - _obj.innerHeight()),
							_coffset = _delta + parseInt(_cnt.css('margin-top'), 10),
							_hoffset;

					// Offset cannot be greater than zero
					if (_coffset < _max) {
						_coffset = _max;

					// Offset cannot be less than the available content height
					} else if (_coffset > 0) {
						_coffset = 0;
					}

					// Set the content offset
					_hoffset = (_bar.innerHeight() - _hdl.height()) * Math.abs(_coffset/_max);

					// Move the handle
					_hdl.css('margin-top', _hoffset + 'px');

					// Move the content
					_cnt.css('margin-top', _coffset + 'px');
				}
			};

			// Verify that the scrollbar and handle exist if bar is enabled
			if (params.bar_enable) {

				// check if the scrollbar exists
				if (!_bar.length && !_hdl.length && params.auto_generate) {
					_setup();
				}

				_hdl.bind('mousedown', _down); // bind mousedown event to handle
			}

			// Activate mousewheel if enabled
			if (params.wheel_enable) {
				_obj.bind('mousewheel DOMMouseScroll', _wheel);
			}

			// Activate touch events if enabled
			if (params.touch_enable) {
				_obj.bind('touchstart.touchScroll', _touchstart);
			}

			_win.bind('mouseleave', _kill);
		});
	};
}(jQuery, window));