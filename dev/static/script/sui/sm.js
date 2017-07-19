/*!
 * =====================================================
 * SUI Mobile - http://m.sui.taobao.org/
 *
 * =====================================================
 */
;$.smVersion = "0.6.2";+function ($) {
    "use strict";

    //全局配置
    var defaults = {
        autoInit: false, //自动初始化页面
        showPageLoadingIndicator: true, //push.js加载页面的时候显示一个加载提示
        router: true, //默认使用router
        swipePanel: "left", //滑动打开侧栏
        swipePanelOnlyClose: true  //只允许滑动关闭，不允许滑动打开侧栏
    };

    $.smConfig = $.extend(defaults, $.config);

}(Zepto);

+ function($) {
    "use strict";

    //比较一个字符串版本号
    //a > b === 1
    //a = b === 0
    //a < b === -1
    $.compareVersion = function(a, b) {
        var as = a.split('.');
        var bs = b.split('.');
        if (a === b) return 0;

        for (var i = 0; i < as.length; i++) {
            var x = parseInt(as[i]);
            if (!bs[i]) return 1;
            var y = parseInt(bs[i]);
            if (x < y) return -1;
            if (x > y) return 1;
        }
        return -1;
    };

    $.getCurrentPage = function() {
        return $(".page-current")[0] || $(".page")[0] || document.body;
    };

}(Zepto);

/* global WebKitCSSMatrix:true */

(function($) {
    "use strict";
    ['width', 'height'].forEach(function(dimension) {
        var  Dimension = dimension.replace(/./, function(m) {
            return m[0].toUpperCase();
        });
        $.fn['outer' + Dimension] = function(margin) {
            var elem = this;
            if (elem) {
                var size = elem[dimension]();
                var sides = {
                    'width': ['left', 'right'],
                    'height': ['top', 'bottom']
                };
                sides[dimension].forEach(function(side) {
                    if (margin) size += parseInt(elem.css('margin-' + side), 10);
                });
                return size;
            } else {
                return null;
            }
        };
    });

    //support
    $.support = (function() {
        var support = {
            touch: !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch)
        };
        return support;
    })();

    $.touchEvents = {
        start: $.support.touch ? 'touchstart' : 'mousedown',
        move: $.support.touch ? 'touchmove' : 'mousemove',
        end: $.support.touch ? 'touchend' : 'mouseup'
    };

    $.getTranslate = function (el, axis) {
        var matrix, curTransform, curStyle, transformMatrix;

        // automatic axis detection
        if (typeof axis === 'undefined') {
            axis = 'x';
        }

        curStyle = window.getComputedStyle(el, null);
        if (window.WebKitCSSMatrix) {
            // Some old versions of Webkit choke when 'none' is passed; pass
            // empty string instead in this case
            transformMatrix = new WebKitCSSMatrix(curStyle.webkitTransform === 'none' ? '' : curStyle.webkitTransform);
        }
        else {
            transformMatrix = curStyle.MozTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
            matrix = transformMatrix.toString().split(',');
        }

        if (axis === 'x') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m41;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[12]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[4]);
        }
        if (axis === 'y') {
            //Latest Chrome and webkits Fix
            if (window.WebKitCSSMatrix)
                curTransform = transformMatrix.m42;
            //Crazy IE10 Matrix
            else if (matrix.length === 16)
                curTransform = parseFloat(matrix[13]);
            //Normal Browsers
            else
                curTransform = parseFloat(matrix[5]);
        }

        return curTransform || 0;
    };
    /* jshint ignore:start */
    $.requestAnimationFrame = function (callback) {
        if (requestAnimationFrame) return requestAnimationFrame(callback);
        else if (webkitRequestAnimationFrame) return webkitRequestAnimationFrame(callback);
        else if (mozRequestAnimationFrame) return mozRequestAnimationFrame(callback);
        else {
            return setTimeout(callback, 1000 / 60);
        }
    };
    $.cancelAnimationFrame = function (id) {
        if (cancelAnimationFrame) return cancelAnimationFrame(id);
        else if (webkitCancelAnimationFrame) return webkitCancelAnimationFrame(id);
        else if (mozCancelAnimationFrame) return mozCancelAnimationFrame(id);
        else {
            return clearTimeout(id);
        }
    };
    /* jshint ignore:end */

    $.fn.dataset = function() {
        var dataset = {},
            ds = this[0].dataset;
        for (var key in ds) { // jshint ignore:line
            var item = (dataset[key] = ds[key]);
            if (item === 'false') dataset[key] = false;
            else if (item === 'true') dataset[key] = true;
            else if (parseFloat(item) === item * 1) dataset[key] = item * 1;
        }
        // mixin dataset and __eleData
        return $.extend({}, dataset, this[0].__eleData);
    };
    $.fn.data = function(key, value) {
        var tmpData = $(this).dataset();
        if (!key) {
            return tmpData;
        }
        // value may be 0, false, null
        if (typeof value === 'undefined') {
            // Get value
            var dataVal = tmpData[key],
                __eD = this[0].__eleData;

            //if (dataVal !== undefined) {
            if (__eD && (key in __eD)) {
                return __eD[key];
            } else {
                return dataVal;
            }

        } else {
            // Set value,uniformly set in extra ```__eleData```
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                // delete multiple data in dataset
                if (key in tmpData) delete el.dataset[key];

                if (!el.__eleData) el.__eleData = {};
                el.__eleData[key] = value;
            }
            return this;
        }
    };
    function __dealCssEvent(eventNameArr, callback) {
        var events = eventNameArr,
            i, dom = this;// jshint ignore:line

        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
    }
    $.fn.animationEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitAnimationEnd', 'animationend'], callback);
        return this;
    };
    $.fn.transitionEnd = function(callback) {
        __dealCssEvent.call(this, ['webkitTransitionEnd', 'transitionend'], callback);
        return this;
    };
    $.fn.transition = function(duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MozTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    };
    $.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MozTransform = elStyle.transform = transform;
        }
        return this;
    };
    $.fn.prevAll = function (selector) {
        var prevEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.previousElementSibling) {
            var prev = el.previousElementSibling;
            if (selector) {
                if($(prev).is(selector)) prevEls.push(prev);
            }
            else prevEls.push(prev);
            el = prev;
        }
        return $(prevEls);
    };
    $.fn.nextAll = function (selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return $([]);
        while (el.nextElementSibling) {
            var next = el.nextElementSibling;
            if (selector) {
                if($(next).is(selector)) nextEls.push(next);
            }
            else nextEls.push(next);
            el = next;
        }
        return $(nextEls);
    };

    //重置zepto的show方法，防止有些人引用的版本中 show 方法操作 opacity 属性影响动画执行
    $.fn.show = function(){
        var elementDisplay = {};
        function defaultDisplay(nodeName) {
            var element, display;
            if (!elementDisplay[nodeName]) {
                element = document.createElement(nodeName);
                document.body.appendChild(element);
                display = getComputedStyle(element, '').getPropertyValue("display");
                element.parentNode.removeChild(element);
                display === "none" && (display = "block");
                elementDisplay[nodeName] = display;
            }
            return elementDisplay[nodeName];
        }

        return this.each(function(){
            this.style.display === "none" && (this.style.display = '');
            if (getComputedStyle(this, '').getPropertyValue("display") === "none");
            this.style.display = defaultDisplay(this.nodeName);
        });
    };
})(Zepto);

/*===========================
Device/OS Detection
===========================*/
;(function ($) {
    "use strict";
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    device.ios = device.android = device.iphone = device.ipad = device.androidChrome = false;

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
        device.android = true;
        device.androidChrome = ua.toLowerCase().indexOf('chrome') >= 0;
    }
    if (ipad || iphone || ipod) {
        device.os = 'ios';
        device.ios = true;
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
        device.iphone = true;
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
        device.ipad = true;
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
        device.iphone = true;
    }
    // iOS 8+ changed UA
    if (device.ios && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Webview
    device.webView = (iphone || ipad || ipod) && ua.match(/.*AppleWebKit(?!.*Safari)/i);

    // Minimal UI
    if (device.os && device.os === 'ios') {
        var osVersionArr = device.osVersion.split('.');
        device.minimalUi = !device.webView &&
            (ipod || iphone) &&
            (osVersionArr[0] * 1 === 7 ? osVersionArr[1] * 1 >= 1 : osVersionArr[0] * 1 > 7) &&
            $('meta[name="viewport"]').length > 0 && $('meta[name="viewport"]').attr('content').indexOf('minimal-ui') >= 0;
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && (windowWidth * windowHeight === screen.width * screen.height)) {
        device.statusBar = true;
    }
    else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os) {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }

    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    }
    else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    // keng..
    device.isWeixin = /MicroMessenger/i.test(ua);

    $.device = device;
})(Zepto);

;(function () {
    'use strict';

    /**
     * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
     *
     * @codingstandard ftlabs-jsv2
     * @copyright The Financial Times Limited [All Rights Reserved]
     * @license MIT License (see LICENSE.txt)
     */

    /*jslint browser:true, node:true, elision:true*/
    /*global Event, Node*/


    /**
     * Instantiate fast-clicking listeners on the specified layer.
     *
     * @constructor
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    function FastClick(layer, options) {
        var oldOnClick;

        options = options || {};

        /**
         * Whether a click is currently being tracked.
         *
         * @type boolean
         */
        this.trackingClick = false;


        /**
         * Timestamp for when click tracking started.
         *
         * @type number
         */
        this.trackingClickStart = 0;


        /**
         * The element being tracked for a click.
         *
         * @type EventTarget
         */
        this.targetElement = null;


        /**
         * X-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartX = 0;


        /**
         * Y-coordinate of touch start event.
         *
         * @type number
         */
        this.touchStartY = 0;


        /**
         * ID of the last touch, retrieved from Touch.identifier.
         *
         * @type number
         */
        this.lastTouchIdentifier = 0;


        /**
         * Touchmove boundary, beyond which a click will be cancelled.
         *
         * @type number
         */
        this.touchBoundary = options.touchBoundary || 10;


        /**
         * The FastClick layer.
         *
         * @type Element
         */
        this.layer = layer;

        /**
         * The minimum time between tap(touchstart and touchend) events
         *
         * @type number
         */
        this.tapDelay = options.tapDelay || 200;

        /**
         * The maximum time for a tap
         *
         * @type number
         */
        this.tapTimeout = options.tapTimeout || 700;

        if (FastClick.notNeeded(layer)) {
            return;
        }

        // Some old versions of Android don't have Function.prototype.bind
        function bind(method, context) {
            return function() { return method.apply(context, arguments); };
        }


        var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
        var context = this;
        for (var i = 0, l = methods.length; i < l; i++) {
            context[methods[i]] = bind(context[methods[i]], context);
        }

        // Set up event handlers as required
        if (deviceIsAndroid) {
            layer.addEventListener('mouseover', this.onMouse, true);
            layer.addEventListener('mousedown', this.onMouse, true);
            layer.addEventListener('mouseup', this.onMouse, true);
        }

        layer.addEventListener('click', this.onClick, true);
        layer.addEventListener('touchstart', this.onTouchStart, false);
        layer.addEventListener('touchmove', this.onTouchMove, false);
        layer.addEventListener('touchend', this.onTouchEnd, false);
        layer.addEventListener('touchcancel', this.onTouchCancel, false);

        // Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
        // which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
        // layer when they are cancelled.
        if (!Event.prototype.stopImmediatePropagation) {
            layer.removeEventListener = function(type, callback, capture) {
                var rmv = Node.prototype.removeEventListener;
                if (type === 'click') {
                    rmv.call(layer, type, callback.hijacked || callback, capture);
                } else {
                    rmv.call(layer, type, callback, capture);
                }
            };

            layer.addEventListener = function(type, callback, capture) {
                var adv = Node.prototype.addEventListener;
                if (type === 'click') {
                    adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
                        if (!event.propagationStopped) {
                            callback(event);
                        }
                    }), capture);
                } else {
                    adv.call(layer, type, callback, capture);
                }
            };
        }

        // If a handler is already declared in the element's onclick attribute, it will be fired before
        // FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
        // adding it as listener.
        if (typeof layer.onclick === 'function') {

            // Android browser on at least 3.2 requires a new reference to the function in layer.onclick
            // - the old one won't work if passed to addEventListener directly.
            oldOnClick = layer.onclick;
            layer.addEventListener('click', function(event) {
                oldOnClick(event);
            }, false);
            layer.onclick = null;
        }
    }

    /**
     * Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
     *
     * @type boolean
     */
    var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

    /**
     * Android requires exceptions.
     *
     * @type boolean
     */
    var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


    /**
     * iOS requires exceptions.
     *
     * @type boolean
     */
    var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


    /**
     * iOS 4 requires an exception for select elements.
     *
     * @type boolean
     */
    var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


    /**
     * iOS 6.0-7.* requires the target element to be manually derived
     *
     * @type boolean
     */
    var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

    /**
     * BlackBerry requires exceptions.
     *
     * @type boolean
     */
    var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

    /**
     * 判断是否组合型label
     * @type {Boolean}
     */
    var isCompositeLabel = false;

    /**
     * Determine whether a given element requires a native click.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element needs a native click
     */
    FastClick.prototype.needsClick = function(target) {

        // 修复bug: 如果父元素中有 label
        // 如果label上有needsclick这个类，则用原生的点击，否则，用模拟点击
        var parent = target;
        while(parent && (parent.tagName.toUpperCase() !== "BODY")) {
            if (parent.tagName.toUpperCase() === "LABEL") {
                isCompositeLabel = true;
                if ((/\bneedsclick\b/).test(parent.className)) return true;
            }
            parent = parent.parentNode;
        }

        switch (target.nodeName.toLowerCase()) {

            // Don't send a synthetic click to disabled inputs (issue #62)
            case 'button':
            case 'select':
            case 'textarea':
                if (target.disabled) {
                    return true;
                }

                break;
            case 'input':

                // File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
                if ((deviceIsIOS && target.type === 'file') || target.disabled) {
                    return true;
                }

                break;
            case 'label':
            case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
            case 'video':
                return true;
        }

        return (/\bneedsclick\b/).test(target.className);
    };


    /**
     * Determine whether a given element requires a call to focus to simulate click into element.
     *
     * @param {EventTarget|Element} target Target DOM element
     * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
     */
    FastClick.prototype.needsFocus = function(target) {
        switch (target.nodeName.toLowerCase()) {
            case 'textarea':
                return true;
            case 'select':
                return !deviceIsAndroid;
            case 'input':
                switch (target.type) {
                    case 'button':
                    case 'checkbox':
                    case 'file':
                    case 'image':
                    case 'radio':
                    case 'submit':
                        return false;
                }

                // No point in attempting to focus disabled inputs
                return !target.disabled && !target.readOnly;
            default:
                return (/\bneedsfocus\b/).test(target.className);
        }
    };


    /**
     * Send a click event to the specified element.
     *
     * @param {EventTarget|Element} targetElement
     * @param {Event} event
     */
    FastClick.prototype.sendClick = function(targetElement, event) {
        var clickEvent, touch;

        // On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
        if (document.activeElement && document.activeElement !== targetElement) {
            document.activeElement.blur();
        }

        touch = event.changedTouches[0];

        // Synthesise a click event, with an extra attribute so it can be tracked
        clickEvent = document.createEvent('MouseEvents');
        clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
        clickEvent.forwardedTouchEvent = true;
        targetElement.dispatchEvent(clickEvent);
    };

    FastClick.prototype.determineEventType = function(targetElement) {

        //Issue #159: Android Chrome Select Box does not open with a synthetic click event
        if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
            return 'mousedown';
        }

        return 'click';
    };


    /**
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.focus = function(targetElement) {
        var length;

        // Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
        var unsupportedType = ['date', 'time', 'month', 'number', 'email'];
        if (deviceIsIOS && targetElement.setSelectionRange && unsupportedType.indexOf(targetElement.type) === -1) {
            length = targetElement.value.length;
            targetElement.setSelectionRange(length, length);
        } else {
            targetElement.focus();
        }
    };


    /**
     * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
     *
     * @param {EventTarget|Element} targetElement
     */
    FastClick.prototype.updateScrollParent = function(targetElement) {
        var scrollParent, parentElement;

        scrollParent = targetElement.fastClickScrollParent;

        // Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
        // target element was moved to another parent.
        if (!scrollParent || !scrollParent.contains(targetElement)) {
            parentElement = targetElement;
            do {
                if (parentElement.scrollHeight > parentElement.offsetHeight) {
                    scrollParent = parentElement;
                    targetElement.fastClickScrollParent = parentElement;
                    break;
                }

                parentElement = parentElement.parentElement;
            } while (parentElement);
        }

        // Always update the scroll top tracker if possible.
        if (scrollParent) {
            scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
        }
    };


    /**
     * @param {EventTarget} targetElement
     * @returns {Element|EventTarget}
     */
    FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

        // On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
        if (eventTarget.nodeType === Node.TEXT_NODE) {
            return eventTarget.parentNode;
        }

        return eventTarget;
    };


    /**
     * On touch start, record the position and scroll offset.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchStart = function(event) {
        var targetElement, touch, selection;

        // Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
        if (event.targetTouches.length > 1) {
            return true;
        }

        targetElement = this.getTargetElementFromEventTarget(event.target);
        touch = event.targetTouches[0];

        if (deviceIsIOS) {

            // Only trusted events will deselect text on iOS (issue #49)
            selection = window.getSelection();
            if (selection.rangeCount && !selection.isCollapsed) {
                return true;
            }

            if (!deviceIsIOS4) {

                // Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
                // when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
                // with the same identifier as the touch event that previously triggered the click that triggered the alert.
                // Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
                // immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
                // Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
                // which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
                // random integers, it's safe to to continue if the identifier is 0 here.
                if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
                    event.preventDefault();
                    return false;
                }

                this.lastTouchIdentifier = touch.identifier;

                // If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
                // 1) the user does a fling scroll on the scrollable layer
                // 2) the user stops the fling scroll with another tap
                // then the event.target of the last 'touchend' event will be the element that was under the user's finger
                // when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
                // is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
                this.updateScrollParent(targetElement);
            }
        }

        this.trackingClick = true;
        this.trackingClickStart = event.timeStamp;
        this.targetElement = targetElement;

        this.touchStartX = touch.pageX;
        this.touchStartY = touch.pageY;

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            event.preventDefault();
        }

        return true;
    };


    /**
     * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.touchHasMoved = function(event) {
        var touch = event.changedTouches[0], boundary = this.touchBoundary;

        if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
            return true;
        }

        return false;
    };


    /**
     * Update the last position.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchMove = function(event) {
        if (!this.trackingClick) {
            return true;
        }

        // If the touch has moved, cancel the click tracking
        if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
            this.trackingClick = false;
            this.targetElement = null;
        }

        return true;
    };


    /**
     * Attempt to find the labelled control for the given label element.
     *
     * @param {EventTarget|HTMLLabelElement} labelElement
     * @returns {Element|null}
     */
    FastClick.prototype.findControl = function(labelElement) {

        // Fast path for newer browsers supporting the HTML5 control attribute
        if (labelElement.control !== undefined) {
            return labelElement.control;
        }

        // All browsers under test that support touch events also support the HTML5 htmlFor attribute
        if (labelElement.htmlFor) {
            return document.getElementById(labelElement.htmlFor);
        }

        // If no for attribute exists, attempt to retrieve the first labellable descendant element
        // the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
        return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
    };


    /**
     * On touch end, determine whether to send a click event at once.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onTouchEnd = function(event) {
        var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

        if (!this.trackingClick) {
            return true;
        }

        // Prevent phantom clicks on fast double-tap (issue #36)
        if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
            this.cancelNextClick = true;
            return true;
        }

        if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
            return true;
        }
        //修复安卓微信下，input type="date" 的bug，经测试date,time,month已没问题
        var unsupportedType = ['date', 'time', 'month'];
        if(unsupportedType.indexOf(event.target.type) !== -1){
            　　　　return false;
            　　}
        // Reset to prevent wrong click cancel on input (issue #156).
        this.cancelNextClick = false;

        this.lastClickTime = event.timeStamp;

        trackingClickStart = this.trackingClickStart;
        this.trackingClick = false;
        this.trackingClickStart = 0;

        // On some iOS devices, the targetElement supplied with the event is invalid if the layer
        // is performing a transition or scroll, and has to be re-detected manually. Note that
        // for this to function correctly, it must be called *after* the event target is checked!
        // See issue #57; also filed as rdar://13048589 .
        if (deviceIsIOSWithBadTarget) {
            touch = event.changedTouches[0];

            // In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
            targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
            targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
        }

        targetTagName = targetElement.tagName.toLowerCase();
        if (targetTagName === 'label') {
            forElement = this.findControl(targetElement);
            if (forElement) {
                this.focus(targetElement);
                if (deviceIsAndroid) {
                    return false;
                }

                targetElement = forElement;
            }
        } else if (this.needsFocus(targetElement)) {

            // Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
            // Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
            if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
                this.targetElement = null;
                return false;
            }

            this.focus(targetElement);
            this.sendClick(targetElement, event);

            // Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
            // Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
            if (!deviceIsIOS || targetTagName !== 'select') {
                this.targetElement = null;
                event.preventDefault();
            }

            return false;
        }

        if (deviceIsIOS && !deviceIsIOS4) {

            // Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
            // and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
            scrollParent = targetElement.fastClickScrollParent;
            if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
                return true;
            }
        }

        // Prevent the actual click from going though - unless the target node is marked as requiring
        // real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
        if (!this.needsClick(targetElement)) {
            event.preventDefault();
            this.sendClick(targetElement, event);
        }

        return false;
    };


    /**
     * On touch cancel, stop tracking the click.
     *
     * @returns {void}
     */
    FastClick.prototype.onTouchCancel = function() {
        this.trackingClick = false;
        this.targetElement = null;
    };


    /**
     * Determine mouse events which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onMouse = function(event) {

        // If a target element was never set (because a touch event was never fired) allow the event
        if (!this.targetElement) {
            return true;
        }

        if (event.forwardedTouchEvent) {
            return true;
        }

        // Programmatically generated events targeting a specific element should be permitted
        if (!event.cancelable) {
            return true;
        }

        // Derive and check the target element to see whether the mouse event needs to be permitted;
        // unless explicitly enabled, prevent non-touch click events from triggering actions,
        // to prevent ghost/doubleclicks.
        if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

            // Prevent any user-added listeners declared on FastClick element from being fired.
            if (event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            } else {

                // Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
                event.propagationStopped = true;
            }

            // Cancel the event
            event.stopPropagation();
            // 允许组合型label冒泡
            if (!isCompositeLabel) {
                event.preventDefault();
            }
            // 允许组合型label冒泡
            return false;
        }

        // If the mouse event is permitted, return true for the action to go through.
        return true;
    };


    /**
     * On actual clicks, determine whether this is a touch-generated click, a click action occurring
     * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
     * an actual click which should be permitted.
     *
     * @param {Event} event
     * @returns {boolean}
     */
    FastClick.prototype.onClick = function(event) {
        var permitted;

        // It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
        if (this.trackingClick) {
            this.targetElement = null;
            this.trackingClick = false;
            return true;
        }

        // Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
        if (event.target.type === 'submit' && event.detail === 0) {
            return true;
        }

        permitted = this.onMouse(event);

        // Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
        if (!permitted) {
            this.targetElement = null;
        }

        // If clicks are permitted, return true for the action to go through.
        return permitted;
    };


    /**
     * Remove all FastClick's event listeners.
     *
     * @returns {void}
     */
    FastClick.prototype.destroy = function() {
        var layer = this.layer;

        if (deviceIsAndroid) {
            layer.removeEventListener('mouseover', this.onMouse, true);
            layer.removeEventListener('mousedown', this.onMouse, true);
            layer.removeEventListener('mouseup', this.onMouse, true);
        }

        layer.removeEventListener('click', this.onClick, true);
        layer.removeEventListener('touchstart', this.onTouchStart, false);
        layer.removeEventListener('touchmove', this.onTouchMove, false);
        layer.removeEventListener('touchend', this.onTouchEnd, false);
        layer.removeEventListener('touchcancel', this.onTouchCancel, false);
    };


    /**
     * Check whether FastClick is needed.
     *
     * @param {Element} layer The layer to listen on
     */
    FastClick.notNeeded = function(layer) {
        var metaViewport;
        var chromeVersion;
        var blackberryVersion;
        var firefoxVersion;

        // Devices that don't support touch don't need FastClick
        if (typeof window.ontouchstart === 'undefined') {
            return true;
        }

        // Chrome version - zero for other browsers
        chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

        if (chromeVersion) {

            if (deviceIsAndroid) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // Chrome 32 and above with width=device-width or less don't need FastClick
                    if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }

                // Chrome desktop doesn't need FastClick (issue #15)
            } else {
                return true;
            }
        }

        if (deviceIsBlackBerry10) {
            blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

            // BlackBerry 10.3+ does not require Fastclick library.
            // https://github.com/ftlabs/fastclick/issues/251
            if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
                metaViewport = document.querySelector('meta[name=viewport]');

                if (metaViewport) {
                    // user-scalable=no eliminates click delay.
                    if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
                        return true;
                    }
                    // width=device-width (or less than device-width) eliminates click delay.
                    if (document.documentElement.scrollWidth <= window.outerWidth) {
                        return true;
                    }
                }
            }
        }

        // IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
        if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        // Firefox version - zero for other browsers
        firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

        if (firefoxVersion >= 27) {
            // Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

            metaViewport = document.querySelector('meta[name=viewport]');
            if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
                return true;
            }
        }

        // IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
        // http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
        if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
            return true;
        }

        return false;
    };


    /**
     * Factory method for creating a FastClick object
     *
     * @param {Element} layer The layer to listen on
     * @param {Object} [options={}] The options to override the defaults
     */
    FastClick.attach = function(layer, options) {
        return new FastClick(layer, options);
    };

    window.FastClick = FastClick;
}());

/*======================================================
************   Modals   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
    "use strict";
    var _modalTemplateTempDiv = document.createElement('div');

    $.modalStack = [];

    $.modalStackClearQueue = function () {
        if ($.modalStack.length) {
            ($.modalStack.shift())();
        }
    };
    $.modal = function (params) {
        params = params || {};
        var modalHTML = '';
        var buttonsHTML = '';
        if (params.buttons && params.buttons.length > 0) {
            for (var i = 0; i < params.buttons.length; i++) {
                buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
            }
        }
        var extraClass = params.extraClass || '';
        var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
        var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
        var afterTextHTML = params.afterText ? params.afterText : '';
        var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
        var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
        modalHTML = '<div class="modal ' + extraClass + ' ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $(defaults.modalContainer).append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
            $(el).on('click', function (e) {
                if (params.buttons[index].close !== false) $.closeModal(modal);
                if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                if (params.onClick) params.onClick(modal, index);
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [ {text: defaults.modalButtonOk, bold: true, onClick: callbackOk} ]
        });
    };
    $.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            buttons: [
                {text: defaults.modalButtonCancel, onClick: callbackCancel},
                {text: defaults.modalButtonOk, bold: true, onClick: callbackOk}
            ]
        });
    };
    $.prompt = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                if (index === 0 && callbackCancel) callbackCancel($(modal).find('.modal-text-input').val());
                if (index === 1 && callbackOk) callbackOk($(modal).find('.modal-text-input').val());
            }
        });
    };
    $.modalLogin = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="text" name="modal-username" placeholder="' + defaults.modalUsernamePlaceholder + '" class="modal-text-input modal-text-input-double"><input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input modal-text-input-double">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(username, password);
                if (index === 1 && callbackOk) callbackOk(username, password);
            }
        });
    };
    $.modalPassword = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return $.modal({
            text: text || '',
            title: typeof title === 'undefined' ? defaults.modalTitle : title,
            afterText: '<input type="password" name="modal-password" placeholder="' + defaults.modalPasswordPlaceholder + '" class="modal-text-input">',
            buttons: [
                {
                    text: defaults.modalButtonCancel
                },
                {
                    text: defaults.modalButtonOk,
                    bold: true
                }
            ],
            onClick: function (modal, index) {
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(password);
                if (index === 1 && callbackOk) callbackOk(password);
            }
        });
    };
    $.showPreloader = function (title) {
        $.hidePreloader();
        $.showPreloader.preloaderModal = $.modal({
            title: title || defaults.modalPreloaderTitle,
            text: '<div class="preloader"></div>'
        });

        return $.showPreloader.preloaderModal;
    };
    $.hidePreloader = function () {
        $.showPreloader.preloaderModal && $.closeModal($.showPreloader.preloaderModal);
    };
    $.showIndicator = function () {
        if ($('.preloader-indicator-modal')[0]) return;
        $(defaults.modalContainer).append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
    };
    $.hideIndicator = function () {
        $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
    };
    // Action Sheet
    $.actions = function (params) {
        var modal, groupSelector, buttonSelector;
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        var buttonsHTML = '';
        for (var i = 0; i < params.length; i++) {
            for (var j = 0; j < params[i].length; j++) {
                if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                var button = params[i][j];
                var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                if (button.bold) buttonClass += ' actions-modal-button-bold';
                if (button.color) buttonClass += ' color-' + button.color;
                if (button.bg) buttonClass += ' bg-' + button.bg;
                if (button.disabled) buttonClass += ' disabled';
                buttonsHTML += '<span class="' + buttonClass + '">' + button.text + '</span>';
                if (j === params[i].length - 1) buttonsHTML += '</div>';
            }
        }
        modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
        _modalTemplateTempDiv.innerHTML = modalHTML;
        modal = $(_modalTemplateTempDiv).children();
        $(defaults.modalContainer).append(modal[0]);
        groupSelector = '.actions-modal-group';
        buttonSelector = '.actions-modal-button';

        var groups = modal.find(groupSelector);
        groups.each(function (index, el) {
            var groupIndex = index;
            $(el).children().each(function (index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
                var clickTarget;
                if ($(el).is(buttonSelector)) clickTarget = $(el);
                // if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

                if (clickTarget) {
                    clickTarget.on('click', function (e) {
                        if (buttonParams.close !== false) $.closeModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        $.openModal(modal);
        return modal[0];
    };
    $.popup = function (modal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $(defaults.modalContainer).append(modal);
            }
            else return false; //nothing found
        }
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        modal.find(".content").scroller("refresh");
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);

        return modal[0];
    };
    $.pickerModal = function (pickerModal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof pickerModal === 'string' && pickerModal.indexOf('<') >= 0) {
            pickerModal = $(pickerModal);
            if (pickerModal.length > 0) {
                if (removeOnClose) pickerModal.addClass('remove-on-close');
                // $(defaults.modalContainer).append(pickerModal[0]);
                // $('#picker-box').html(pickerModal[0]);
                $(roomPickerContainer).html(pickerModal[0]);
            }
            else return false; //nothing found
        }
        pickerModal = $(pickerModal);
        if (pickerModal.length === 0) return false;
        pickerModal.show();
        $.openModal(pickerModal);
        return pickerModal[0];
    };
    $.loginScreen = function (modal) {
        if (!modal) modal = '.login-screen';
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();
        if (modal.find('.' + defaults.viewClass).length > 0) {
            $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
        }
        $.openModal(modal);
        return modal[0];
    };
    //显示一个消息，会在2秒钟后自动消失
    $.toast = function(msg, duration, extraclass) {
        var $toast = $('<div class="modal toast ' + (extraclass || '') + '">' + msg + '</div>').appendTo(document.body);
        $.openModal($toast, function(){
            setTimeout(function() {
                $.closeModal($toast);
            }, duration || 2000);
        });
    };
    $.openModal = function (modal, cb) {
        modal = $(modal);
        var isModal = modal.hasClass('modal'),
            isNotToast = !modal.hasClass('toast');
        if ($('.modal.modal-in:not(.modal-out)').length && defaults.modalStack && isModal && isNotToast) {
            $.modalStack.push(function () {
                $.openModal(modal, cb);
            });
            return;
        }
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');
        var isToast = modal.hasClass('toast');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: - Math.round(modal.outerHeight() / 2) + 'px'
            });
        }
        if (isToast) {
            modal.css({
                marginLeft: - Math.round(modal.outerWidth() / 2 / 1.185) + 'px' //1.185 是初始化时候的放大效果
            });
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal && !isToast) {
            if ($('.modal-overlay').length === 0 && !isPopup) {
                $(defaults.modalContainer).append('<div class="modal-overlay"></div>');
            }
            if ($('.popup-overlay').length === 0 && isPopup) {
                $(defaults.modalContainer).append('<div class="popup-overlay"></div>');
            }
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).addClass('with-picker-modal');
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal && !isToast) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');
        });
        // excute callback
        if (typeof cb === 'function') {
          cb.call(this);
        }
        return true;
    };
    $.closeModal = function (modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('modal'),
            isPopup = modal.hasClass('popup'),
            isToast = modal.hasClass('toast'),
            isLoginScreen = modal.hasClass('login-screen'),
            isPickerModal = modal.hasClass('picker-modal'),
            removeOnClose = modal.hasClass('remove-on-close'),
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        if (isPopup){
            if (modal.length === $('.popup.modal-in').length) {
                overlay.removeClass('modal-overlay-visible');
            }
        }
        else if (!(isPickerModal || isToast)) {
            overlay.removeClass('modal-overlay-visible');
        }

        modal.trigger('close');

        // Picker modal body class
        if (isPickerModal) {
            $(defaults.modalContainer).removeClass('with-picker-modal');
            $(defaults.modalContainer).addClass('picker-modal-closing');
        }

        modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');
            else modal.trigger('opened');

            if (isPickerModal) {
                $(defaults.modalContainer).removeClass('picker-modal-closing');
            }
            if (isPopup || isLoginScreen || isPickerModal) {
                modal.removeClass('modal-out').hide();
                if (removeOnClose && modal.length > 0) {
                    modal.remove();
                }
            }
            else {
                modal.remove();
            }
        });
        if (isModal &&  defaults.modalStack ) {
            $.modalStackClearQueue();
        }

        return true;
    };
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);
        var url = clicked.attr('href');


        //Collect Clicked data- attributes
        var clickedData = clicked.dataset();

        // Popup
        var popup;
        if (clicked.hasClass('open-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup';
            $.popup(popup);
        }
        if (clicked.hasClass('close-popup')) {
            if (clickedData.popup) {
                popup = clickedData.popup;
            }
            else popup = '.popup.modal-in';
            $.closeModal(popup);
        }

        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
            if ($('.modal.modal-in').length > 0 && defaults.modalCloseByOutside)
                $.closeModal('.modal.modal-in');
            if ($('.actions-modal.modal-in').length > 0 && defaults.actionsCloseByOutside)
                $.closeModal('.actions-modal.modal-in');

        }
        if (clicked.hasClass('popup-overlay')) {
            if ($('.popup.modal-in').length > 0 && defaults.popupCloseByOutside)
                $.closeModal('.popup.modal-in');
        }




    }
    $(document).on('click', ' .modal-overlay, .popup-overlay, .close-popup, .open-popup, .close-picker', handleClicks);
    var defaults =  $.modal.prototype.defaults  = {
        modalStack: true,
        modalButtonOk: '确定',
        modalButtonCancel: '取消',
        modalPreloaderTitle: '加载中',
        modalContainer : document.body
    };
}(Zepto);


/*======================================================
************   Picker   ************
======================================================*/
/* jshint unused:false */
/* jshint multistr:true */
+ function($) {
    "use strict";
    var Picker = function (params) {
        var p = this;
        var defaults = {
            roomContainer: '#picker-box',
            updateValuesOnMomentum: false,
            updateValuesOnTouchmove: true,
            rotateEffect: false,
            momentumRatio: 7,
            freeMode: false,
            // Common settings
            scrollToInput: true,
            inputReadOnly: true,
            toolbar: true,
            toolbarCloseText: '确定',
            toolbarTemplate: '<header class="bar bar-nav">\
                <button class="button button-link pull-right close-picker">确定</button>\
                <h1 class="title">请选择</h1>\
                </header>',
        };
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.cols = [];
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;
        // p.inline = true;

        // 3D Transforms origin bug, only on safari
        var originBug = $.device.ios || (navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0) && !$.device.android;

        // Value
        p.setValue = function (arrValues, transition) {
            var valueIndex = 0;
            for (var i = 0; i < p.cols.length; i++) {
                if (p.cols[i] && !p.cols[i].divider) {
                    p.cols[i].setValue(arrValues[valueIndex], transition);
                    valueIndex++;
                }
            }
        };
        p.updateValue = function () {
            var newValue = [];
            var newDisplayValue = [];
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    newValue.push(p.cols[i].value);
                    newDisplayValue.push(p.cols[i].displayValue);
                }
            }
            if (newValue.indexOf(undefined) >= 0) {
                return;
            }
            p.value = newValue;
            p.displayValue = newDisplayValue;
            if (p.params.onChange) {
                p.params.onChange(p, p.value, p.displayValue);
            }
            if (p.input && p.input.length > 0) {
                $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initPickerCol = function (colElement, updateItems) {
            var colContainer = $(colElement);
            var colIndex = colContainer.index();
            var col = p.cols[colIndex];
            if (col.divider) return;
            col.container = colContainer;
            col.wrapper = col.container.find('.picker-items-col-wrapper');
            col.items = col.wrapper.find('.picker-item');

            var i, j;
            var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
            col.replaceValues = function (values, displayValues) {
                col.destroyEvents();
                col.values = values;
                col.displayValues = displayValues;
                var newItemsHTML = p.columnHTML(col, true);
                col.wrapper.html(newItemsHTML);
                col.items = col.wrapper.find('.picker-item');
                col.calcSize();
                col.setValue(col.values[0], 0, true);
                col.initEvents();
            };
            col.calcSize = function () {
                if (p.params.rotateEffect) {
                    col.container.removeClass('picker-items-col-absolute');
                    if (!col.width) col.container.css({width:''});
                }
                var colWidth, colHeight;
                colWidth = 0;
                colHeight = col.container[0].offsetHeight;
                wrapperHeight = col.wrapper[0].offsetHeight;
                itemHeight = col.items[0].offsetHeight;
                itemsHeight = itemHeight * col.items.length;
                minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
                maxTranslate = colHeight / 2 - itemHeight / 2;
                if (col.width) {
                    colWidth = col.width;
                    if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                    col.container.css({width: colWidth});
                }
                if (p.params.rotateEffect) {
                    if (!col.width) {
                        col.items.each(function () {
                            var item = $(this);
                            item.css({width:'auto'});
                            colWidth = Math.max(colWidth, item[0].offsetWidth);
                            item.css({width:''});
                        });
                        col.container.css({width: (colWidth + 2) + 'px'});
                    }
                    col.container.addClass('picker-items-col-absolute');
                }
            };
            col.calcSize();

            col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);


            var activeIndex = 0;
            var animationFrameId;

            // Set Value Function
            col.setValue = function (newValue, transition, valueCallbacks) {
                if (typeof transition === 'undefined') transition = '';
                var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
                if(typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                    return;
                }
                var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
                // Update wrapper
                col.wrapper.transition(transition);
                col.wrapper.transform('translate3d(0,' + (newTranslate) + 'px,0)');

                // Watch items
                if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex ) {
                    $.cancelAnimationFrame(animationFrameId);
                    col.wrapper.transitionEnd(function(){
                        $.cancelAnimationFrame(animationFrameId);
                    });
                    updateDuringScroll();
                }

                // Update items
                col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
            };

            col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
                if (typeof translate === 'undefined') {
                    translate = $.getTranslate(col.wrapper[0], 'y');
                }
                if(typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate)/itemHeight);
                if (activeIndex < 0) activeIndex = 0;
                if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
                var previousActiveIndex = col.activeIndex;
                col.activeIndex = activeIndex;
                /*
                   col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

                   col.items.transition(transition);
                   var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
                   var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
                   var nextItems = selectedItem.nextAll().addClass('picker-after-selected');
                   */
                //去掉 .picker-after-selected, .picker-before-selected 以提高性能
                col.wrapper.find('.picker-selected').removeClass('picker-selected');


                if (p.params.rotateEffect) {
                    col.items.transition(transition);
                }
                var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

                if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                    // Update values
                    col.value = selectedItem.attr('data-picker-value');
                    col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                    // On change callback
                    if (previousActiveIndex !== activeIndex) {
                        if (col.onChange) {
                            col.onChange(p, col.value, col.displayValue);
                        }
                        p.updateValue();
                    }
                }

                // Set 3D rotate effect
                if (!p.params.rotateEffect) {
                    return;
                }
                var percentage = (translate - (Math.floor((translate - maxTranslate)/itemHeight) * itemHeight + maxTranslate)) / itemHeight;

                col.items.each(function () {
                    var item = $(this);
                    var itemOffsetTop = item.index() * itemHeight;
                    var translateOffset = maxTranslate - translate;
                    var itemOffset = itemOffsetTop - translateOffset;
                    var percentage = itemOffset / itemHeight;

                    var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                    var angle = (-18*percentage);
                    if (angle > 180) angle = 180;
                    if (angle < -180) angle = -180;
                    // Far class
                    if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');
                    else item.removeClass('picker-item-far');
                    // Set transform
                    item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
                });
            };

            function updateDuringScroll() {
                animationFrameId = $.requestAnimationFrame(function () {
                    col.updateItems(undefined, undefined, 0);
                    updateDuringScroll();
                });
            }

            // Update items on init
            if (updateItems) col.updateItems(0, maxTranslate, 0);

            var allowItemClick = true;
            var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
            function handleTouchStart (e) {
                if (isMoved || isTouched) return;
                e.preventDefault();
                isTouched = true;
                touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = (new Date()).getTime();

                allowItemClick = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
            }
            function handleTouchMove (e) {
                if (!isTouched) return;
                e.preventDefault();
                allowItemClick = false;
                touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (!isMoved) {
                    // First move
                    $.cancelAnimationFrame(animationFrameId);
                    isMoved = true;
                    startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                    col.wrapper.transition(0);
                }
                e.preventDefault();

                var diff = touchCurrentY - touchStartY;
                currentTranslate = startTranslate + diff;
                returnTo = undefined;

                // Normalize translate
                if (currentTranslate < minTranslate) {
                    currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                    returnTo = 'min';
                }
                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                    returnTo = 'max';
                }
                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

                // Update items
                col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

                // Calc velocity
                velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
                velocityTime = (new Date()).getTime();
                prevTranslate = currentTranslate;
            }
            function handleTouchEnd (e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;
                col.wrapper.transition('');
                if (returnTo) {
                    if (returnTo === 'min') {
                        col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                    }
                    else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
                }
                touchEndTime = new Date().getTime();
                var velocity, newTranslate;
                if (touchEndTime - touchStartTime > 300) {
                    newTranslate = currentTranslate;
                }
                else {
                    velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                    newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
                }

                newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

                // Active Index
                var activeIndex = -Math.floor((newTranslate - maxTranslate)/itemHeight);

                // Normalize translate
                if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + (parseInt(newTranslate,10)) + 'px,0)');

                // Update items
                col.updateItems(activeIndex, newTranslate, '', true);

                // Watch items
                if (p.params.updateValuesOnMomentum) {
                    updateDuringScroll();
                    col.wrapper.transitionEnd(function(){
                        $.cancelAnimationFrame(animationFrameId);
                    });
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleClick(e) {
                if (!allowItemClick) return;
                $.cancelAnimationFrame(animationFrameId);
                /*jshint validthis:true */
                var value = $(this).attr('data-picker-value');
                col.setValue(value);
            }

            col.initEvents = function (detach) {
                var method = detach ? 'off' : 'on';
                col.container[method]($.touchEvents.start, handleTouchStart);
                col.container[method]($.touchEvents.move, handleTouchMove);
                col.container[method]($.touchEvents.end, handleTouchEnd);
                col.items[method]('click', handleClick);
            };
            col.destroyEvents = function () {
                col.initEvents(true);
            };

            col.container[0].f7DestroyPickerCol = function () {
                col.destroyEvents();
            };

            col.initEvents();

        };
        p.destroyPickerCol = function (colContainer) {
            colContainer = $(colContainer);
            if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
        };
        // Resize cols
        function resizeCols() {
            if (!p.opened) return;
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    p.cols[i].calcSize();
                    p.cols[i].setValue(p.cols[i].value, 0, false);
                }
            }
        }
        $(window).on('resize', resizeCols);

        // HTML Layout
        p.columnHTML = function (col, onlyItems) {
            var columnItemsHTML = '';
            var columnHTML = '';
            if (col.divider) {
                columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
            }
            else {
                for (var j = 0; j < col.values.length; j++) {
                    // columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
                    columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j].value + '">' + (col.displayValues ? col.displayValues[j] : col.values[j].text) + '</div>';
                }

                columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
            }
            return onlyItems ? columnItemsHTML : columnHTML;
        };
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;
            p.cols = [];
            var colsHTML = '';
            for (i = 0; i < p.params.cols.length; i++) {
                var col = p.params.cols[i];
                colsHTML += p.columnHTML(p.params.cols[i]);
                p.cols.push(col);
            }
            pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
            pickerHTML =
                '<div class="' + (pickerClass) + '">' +
                (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') +
                '<div class="picker-modal-inner picker-items">' +
                colsHTML +
                '<div class="picker-center-highlight"></div>' +
                '</div>' +
                '</div>';

            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            // 安卓微信webviewreadonly的input依然弹出软键盘问题修复
            if ($.device.isWeixin && $.device.android && p.params.inputReadOnly) {
                /*jshint validthis:true */
                this.focus();
                this.blur();
            }
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput) {
                var pageContent = p.input.parents('.content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;
                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({'padding-bottom': (newPaddingBottom) + 'px'});
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }
        function closeOnHTMLClick(e) {
            if (!p.opened) return;
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
            }
            else {
                if ($(e.target).parents('.picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
            }
        }

        if (!p.inline) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) p.input.parents('.content').css({'padding-bottom': ''});
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.container.find('.picker-items-col').each(function () {
                p.destroyPickerCol(this);
            });
        }

        p.opened = false;
        p.open = function () {
            if (!p.opened) {

                // Layout
                p.layout();

                // Append
                if (p.inline) {
                    // p.container = $(p.pickerHTML);
                    // p.container.addClass('picker-modal-inline');
                    // $(p.params.container).append(p.container);
                    // p.opened = true;
                }
                else {
                    window.roomPickerContainer = p.params.roomContainer;
                    p.container = $($.pickerModal(p.pickerHTML));
                    // $(p.container)
                    //     .one('opened', function() {
                    //         p.opened = true;
                    //     })
                    //     .on('close', function () {
                    //         onPickerClose();
                    //     });
                }

                // Store picker instance
                p.container[0].f7Picker = p;

                // Init Events
                p.container.find('.picker-items-col').each(function () {
                    var updateItems = true;
                    if ((!p.initialized && p.params.value) || (p.initialized && p.value)) updateItems = false;
                    p.initPickerCol(this, updateItems);
                });

                // Set value
                if (!p.initialized) {
                    if (p.params.value) {
                        p.setValue(p.params.value, 0);
                    }
                }
                else {
                    if (p.value) p.setValue(p.value, 0);
                }
            }

            // Set flag
            p.initialized = true;

            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function () {
            if (!p.opened || p.inline) return;
            $.closeModal(p.container);
            return;
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click', openOnInput);
            }
            $('html').off('click', closeOnHTMLClick);
            $(window).off('resize', resizeCols);
        };

        if (p.inline) {
            p.open();
        }

        return p;
    };

    $(document).on("click", ".close-picker", function() {
        var pickerToClose = $('.picker-modal.modal-in');
        $.closeModal(pickerToClose);
    });

    $.fn.picker = function(params) {
        var args = arguments;
        return this.each(function() {
            if(!this) return;
            var $this = $(this);

            var picker = $this.data("picker");
            if(!picker) {
                var p = $.extend({
                    input: this,
                    value: $this.val() ? $this.val().split(' ') : ''
                }, params);
                picker = new Picker(p);
                $this.data("picker", picker);
            }
            if(typeof params === typeof "a") {
                picker[params].apply(picker, Array.prototype.slice.call(args, 1));
            }
        });
    };
}(Zepto);


+ function(window) {

    "use strict";

    var rAF = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    /*var cRAF = window.cancelRequestAnimationFrame ||
        window.webkitCancelRequestAnimationFrame ||
        window.mozCancelRequestAnimationFrame ||
        window.oCancelRequestAnimationFrame ||
        window.msCancelRequestAnimationFrame;*/

    var utils = (function() {
        var me = {};

        var _elementStyle = document.createElement('div').style;
        var _vendor = (function() {
            var vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'],
                transform,
                i = 0,
                l = vendors.length;

            for (; i < l; i++) {
                transform = vendors[i] + 'ransform';
                if (transform in _elementStyle) return vendors[i].substr(0, vendors[i].length - 1);
            }

            return false;
        })();

        function _prefixStyle(style) {
            if (_vendor === false) return false;
            if (_vendor === '') return style;
            return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
        }

        me.getTime = Date.now || function getTime() {
            return new Date().getTime();
        };

        me.extend = function(target, obj) {
            for (var i in obj) {  // jshint ignore:line
                    target[i] = obj[i]; 
            }
        };

        me.addEvent = function(el, type, fn, capture) {
            el.addEventListener(type, fn, !!capture);
        };

        me.removeEvent = function(el, type, fn, capture) {
            el.removeEventListener(type, fn, !!capture);
        };

        me.prefixPointerEvent = function(pointerEvent) {
            return window.MSPointerEvent ?
                'MSPointer' + pointerEvent.charAt(9).toUpperCase() + pointerEvent.substr(10) :
                pointerEvent;
        };

        me.momentum = function(current, start, time, lowerMargin, wrapperSize, deceleration, self) {
            var distance = current - start,
                speed = Math.abs(distance) / time,
                destination,
                duration;

            // var absDistance = Math.abs(distance);
            speed = speed / 2; //slowdown
            speed = speed > 1.5 ? 1.5 : speed; //set max speed to 1
            deceleration = deceleration === undefined ? 0.0006 : deceleration;

            destination = current + (speed * speed) / (2 * deceleration) * (distance < 0 ? -1 : 1);
            duration = speed / deceleration;

            if (destination < lowerMargin) {
                destination = wrapperSize ? lowerMargin - (wrapperSize / 2.5 * (speed / 8)) : lowerMargin;
                distance = Math.abs(destination - current);
                duration = distance / speed;
            } else if (destination > 0) {
                destination = wrapperSize ? wrapperSize / 2.5 * (speed / 8) : 0;
                distance = Math.abs(current) + destination;
                duration = distance / speed;
            }

            //simple trigger, every 50ms
            var t = +new Date();
            var l = t;

            function eventTrigger() {
                if (+new Date() - l > 50) {
                    self._execEvent('scroll');
                    l = +new Date();
                }
                if (+new Date() - t < duration) {
                    rAF(eventTrigger);
                }
            }
            rAF(eventTrigger);

            return {
                destination: Math.round(destination),
                duration: duration
            };
        };

        var _transform = _prefixStyle('transform');

        me.extend(me, {
            hasTransform: _transform !== false,
            hasPerspective: _prefixStyle('perspective') in _elementStyle,
            hasTouch: 'ontouchstart' in window,
            hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed
            hasTransition: _prefixStyle('transition') in _elementStyle
        });

        // This should find all Android browsers lower than build 535.19 (both stock browser and webview)
        me.isBadAndroid = /Android /.test(window.navigator.appVersion) && !(/Chrome\/\d/.test(window.navigator.appVersion)) && false; //this will cause many android device scroll flash; so set it to false!

        me.extend(me.style = {}, {
            transform: _transform,
            transitionTimingFunction: _prefixStyle('transitionTimingFunction'),
            transitionDuration: _prefixStyle('transitionDuration'),
            transitionDelay: _prefixStyle('transitionDelay'),
            transformOrigin: _prefixStyle('transformOrigin')
        });

        me.hasClass = function(e, c) {
            var re = new RegExp('(^|\\s)' + c + '(\\s|$)');
            return re.test(e.className);
        };

        me.addClass = function(e, c) {
            if (me.hasClass(e, c)) {
                return;
            }

            var newclass = e.className.split(' ');
            newclass.push(c);
            e.className = newclass.join(' ');
        };

        me.removeClass = function(e, c) {
            if (!me.hasClass(e, c)) {
                return;
            }

            var re = new RegExp('(^|\\s)' + c + '(\\s|$)', 'g');
            e.className = e.className.replace(re, ' ');
        };

        me.offset = function(el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            // jshint -W084
            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }
            // jshint +W084

            return {
                left: left,
                top: top
            };
        };

        me.preventDefaultException = function(el, exceptions) {
            for (var i in exceptions) {
                if (exceptions[i].test(el[i])) {
                    return true;
                }
            }

            return false;
        };

        me.extend(me.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,

            mousedown: 2,
            mousemove: 2,
            mouseup: 2,

            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,

            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        });

        me.extend(me.ease = {}, {
            quadratic: {
                style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fn: function(k) {
                    return k * (2 - k);
                }
            },
            circular: {
                style: 'cubic-bezier(0.1, 0.57, 0.1, 1)', // Not properly 'circular' but this looks better, it should be (0.075, 0.82, 0.165, 1)
                fn: function(k) {
                    return Math.sqrt(1 - (--k * k));
                }
            },
            back: {
                style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fn: function(k) {
                    var b = 4;
                    return (k = k - 1) * k * ((b + 1) * k + b) + 1;
                }
            },
            bounce: {
                style: '',
                fn: function(k) {
                    if ((k /= 1) < (1 / 2.75)) {
                        return 7.5625 * k * k;
                    } else if (k < (2 / 2.75)) {
                        return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
                    } else if (k < (2.5 / 2.75)) {
                        return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
                    } else {
                        return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
                    }
                }
            },
            elastic: {
                style: '',
                fn: function(k) {
                    var f = 0.22,
                        e = 0.4;

                    if (k === 0) {
                        return 0;
                    }
                    if (k === 1) {
                        return 1;
                    }

                    return (e * Math.pow(2, -10 * k) * Math.sin((k - f / 4) * (2 * Math.PI) / f) + 1);
                }
            }
        });

        me.tap = function(e, eventName) {
            var ev = document.createEvent('Event');
            ev.initEvent(eventName, true, true);
            ev.pageX = e.pageX;
            ev.pageY = e.pageY;
            e.target.dispatchEvent(ev);
        };

        me.click = function(e) {
            var target = e.target,
                ev;

            if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                ev = document.createEvent('MouseEvents');
                ev.initMouseEvent('click', true, true, e.view, 1,
                    target.screenX, target.screenY, target.clientX, target.clientY,
                    e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                    0, null);

                ev._constructed = true;
                target.dispatchEvent(ev);
            }
        };

        return me;
    })();

    function IScroll(el, options) {
        this.wrapper = typeof el === 'string' ? document.querySelector(el) : el;
        this.scroller = $(this.wrapper).find('.content-inner')[0]; // jshint ignore:line


        this.scrollerStyle = this.scroller&&this.scroller.style; // cache style for better performance

        this.options = {

            resizeScrollbars: true,

            mouseWheelSpeed: 20,

            snapThreshold: 0.334,

            // INSERT POINT: OPTIONS 

            startX: 0,
            startY: 0,
            scrollY: true,
            directionLockThreshold: 5,
            momentum: true,

            bounce: true,
            bounceTime: 600,
            bounceEasing: '',

            preventDefault: true,
            preventDefaultException: {
                tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
            },

            HWCompositing: true,
            useTransition: true,
            useTransform: true,

            //other options
            eventPassthrough: undefined, //if you  want to use native scroll, you can set to: true or horizontal
        };

        for (var i in options) {
                this.options[i] = options[i];
        }

        // Normalize options
        this.translateZ = this.options.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';

        this.options.useTransition = utils.hasTransition && this.options.useTransition;
        this.options.useTransform = utils.hasTransform && this.options.useTransform;

        this.options.eventPassthrough = this.options.eventPassthrough === true ? 'vertical' : this.options.eventPassthrough;
        this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;

        // If you want eventPassthrough I have to lock one of the axes
        this.options.scrollY = this.options.eventPassthrough === 'vertical' ? false : this.options.scrollY;
        this.options.scrollX = this.options.eventPassthrough === 'horizontal' ? false : this.options.scrollX;

        // With eventPassthrough we also need lockDirection mechanism
        this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
        this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;

        this.options.bounceEasing = typeof this.options.bounceEasing === 'string' ? utils.ease[this.options.bounceEasing] || utils.ease.circular : this.options.bounceEasing;

        this.options.resizePolling = this.options.resizePolling === undefined ? 60 : this.options.resizePolling;

        if (this.options.tap === true) {
            this.options.tap = 'tap';
        }

        if (this.options.shrinkScrollbars === 'scale') {
            this.options.useTransition = false;
        }

        this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;

        if (this.options.probeType === 3) {
            this.options.useTransition = false;
        }

        // INSERT POINT: NORMALIZATION

        // Some defaults    
        this.x = 0;
        this.y = 0;
        this.directionX = 0;
        this.directionY = 0;
        this._events = {};

        // INSERT POINT: DEFAULTS

        this._init();
        this.refresh();

        this.scrollTo(this.options.startX, this.options.startY);
        this.enable();
    }

    IScroll.prototype = {
        version: '5.1.3',

        _init: function() {
            this._initEvents();

            if (this.options.scrollbars || this.options.indicators) {
                this._initIndicators();
            }

            if (this.options.mouseWheel) {
                this._initWheel();
            }

            if (this.options.snap) {
                this._initSnap();
            }

            if (this.options.keyBindings) {
                this._initKeys();
            }

            // INSERT POINT: _init

        },

        destroy: function() {
            this._initEvents(true);

            this._execEvent('destroy');
        },

        _transitionEnd: function(e) {
            if (e.target !== this.scroller || !this.isInTransition) {
                return;
            }

            this._transitionTime();
            if (!this.resetPosition(this.options.bounceTime)) {
                this.isInTransition = false;
                this._execEvent('scrollEnd');
            }
        },

        _start: function(e) {
            // React to left mouse button only
            if (utils.eventType[e.type] !== 1) {
                if (e.button !== 0) {
                    return;
                }
            }

            if (!this.enabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
                return;
            }

            if (this.options.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,
                pos;

            this.initiated = utils.eventType[e.type];
            this.moved = false;
            this.distX = 0;
            this.distY = 0;
            this.directionX = 0;
            this.directionY = 0;
            this.directionLocked = 0;

            this._transitionTime();

            this.startTime = utils.getTime();

            if (this.options.useTransition && this.isInTransition) {
                this.isInTransition = false;
                pos = this.getComputedPosition();
                this._translate(Math.round(pos.x), Math.round(pos.y));
                this._execEvent('scrollEnd');
            } else if (!this.options.useTransition && this.isAnimating) {
                this.isAnimating = false;
                this._execEvent('scrollEnd');
            }

            this.startX = this.x;
            this.startY = this.y;
            this.absStartX = this.x;
            this.absStartY = this.y;
            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this._execEvent('beforeScrollStart');
        },

        _move: function(e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            if (this.options.preventDefault) { // increases performance on Android? TODO: check!
                e.preventDefault();
            }

            var point = e.touches ? e.touches[0] : e,
                deltaX = point.pageX - this.pointX,
                deltaY = point.pageY - this.pointY,
                timestamp = utils.getTime(),
                newX, newY,
                absDistX, absDistY;

            this.pointX = point.pageX;
            this.pointY = point.pageY;

            this.distX += deltaX;
            this.distY += deltaY;
            absDistX = Math.abs(this.distX);
            absDistY = Math.abs(this.distY);

            // We need to move at least 10 pixels for the scrolling to initiate
            if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
                return;
            }

            // If you are scrolling in one direction lock the other
            if (!this.directionLocked && !this.options.freeScroll) {
                if (absDistX > absDistY + this.options.directionLockThreshold) {
                    this.directionLocked = 'h'; // lock horizontally
                } else if (absDistY >= absDistX + this.options.directionLockThreshold) {
                    this.directionLocked = 'v'; // lock vertically
                } else {
                    this.directionLocked = 'n'; // no lock
                }
            }

            if (this.directionLocked === 'h') {
                if (this.options.eventPassthrough === 'vertical') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough === 'horizontal') {
                    this.initiated = false;
                    return;
                }

                deltaY = 0;
            } else if (this.directionLocked === 'v') {
                if (this.options.eventPassthrough === 'horizontal') {
                    e.preventDefault();
                } else if (this.options.eventPassthrough === 'vertical') {
                    this.initiated = false;
                    return;
                }

                deltaX = 0;
            }

            deltaX = this.hasHorizontalScroll ? deltaX : 0;
            deltaY = this.hasVerticalScroll ? deltaY : 0;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < this.maxScrollX) {
                newX = this.options.bounce ? this.x + deltaX / 3 : newX > 0 ? 0 : this.maxScrollX;
            }
            if (newY > 0 || newY < this.maxScrollY) {
                newY = this.options.bounce ? this.y + deltaY / 3 : newY > 0 ? 0 : this.maxScrollY;
            }

            this.directionX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            this.directionY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (!this.moved) {
                this._execEvent('scrollStart');
            }

            this.moved = true;

            this._translate(newX, newY);

            /* REPLACE START: _move */
            if (timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.startX = this.x;
                this.startY = this.y;

                if (this.options.probeType === 1) {
                    this._execEvent('scroll');
                }
            }

            if (this.options.probeType > 1) {
                this._execEvent('scroll');
            }
            /* REPLACE END: _move */

        },

        _end: function(e) {
            if (!this.enabled || utils.eventType[e.type] !== this.initiated) {
                return;
            }

            if (this.options.preventDefault && !utils.preventDefaultException(e.target, this.options.preventDefaultException)) {
                e.preventDefault();
            }

            var /*point = e.changedTouches ? e.changedTouches[0] : e,*/
                momentumX,
                momentumY,
                duration = utils.getTime() - this.startTime,
                newX = Math.round(this.x),
                newY = Math.round(this.y),
                distanceX = Math.abs(newX - this.startX),
                distanceY = Math.abs(newY - this.startY),
                time = 0,
                easing = '';

            this.isInTransition = 0;
            this.initiated = 0;
            this.endTime = utils.getTime();

            // reset if we are outside of the boundaries
            if (this.resetPosition(this.options.bounceTime)) {
                return;
            }

            this.scrollTo(newX, newY); // ensures that the last position is rounded

            // we scrolled less than 10 pixels
            if (!this.moved) {
                if (this.options.tap) {
                    utils.tap(e, this.options.tap);
                }

                if (this.options.click) {
                    utils.click(e);
                }

                this._execEvent('scrollCancel');
                return;
            }

            if (this._events.flick && duration < 200 && distanceX < 100 && distanceY < 100) {
                this._execEvent('flick');
                return;
            }

            // start momentum animation if needed
            if (this.options.momentum && duration < 300) {
                momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration, this) : {
                    destination: newX,
                    duration: 0
                };
                momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration, this) : {
                    destination: newY,
                    duration: 0
                };
                newX = momentumX.destination;
                newY = momentumY.destination;
                time = Math.max(momentumX.duration, momentumY.duration);
                this.isInTransition = 1;
            }


            if (this.options.snap) {
                var snap = this._nearestSnap(newX, newY);
                this.currentPage = snap;
                time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(newX - snap.x), 1000),
                        Math.min(Math.abs(newY - snap.y), 1000)
                    ), 300);
                newX = snap.x;
                newY = snap.y;

                this.directionX = 0;
                this.directionY = 0;
                easing = this.options.bounceEasing;
            }

            // INSERT POINT: _end

            if (newX !== this.x || newY !== this.y) {
                // change easing function when scroller goes out of the boundaries
                if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
                    easing = utils.ease.quadratic;
                }

                this.scrollTo(newX, newY, time, easing);
                return;
            }

            this._execEvent('scrollEnd');
        },

        _resize: function() {
            var that = this;

            clearTimeout(this.resizeTimeout);

            this.resizeTimeout = setTimeout(function() {
                that.refresh();
            }, this.options.resizePolling);
        },

        resetPosition: function(time) {
            var x = this.x,
                y = this.y;

            time = time || 0;

            if (!this.hasHorizontalScroll || this.x > 0) {
                x = 0;
            } else if (this.x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (!this.hasVerticalScroll || this.y > 0) {
                y = 0;
            } else if (this.y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            if (x === this.x && y === this.y) {
                return false;
            }

            if (this.options.ptr && this.y > 44 && this.startY * -1 < $(window).height() && !this.ptrLock) {// jshint ignore:line
                // not trigger ptr when user want to scroll to top
                y = this.options.ptrOffset || 44;
                this._execEvent('ptr');
                // 防止返回的过程中再次触发了 ptr ，导致被定位到 44px（因为可能done事件触发很快，在返回到44px以前就触发done
                this.ptrLock = true;
                var self = this;
                setTimeout(function() {
                    self.ptrLock = false;
                }, 500);
            }

            this.scrollTo(x, y, time, this.options.bounceEasing);

            return true;
        },

        disable: function() {
            this.enabled = false;
        },

        enable: function() {
            this.enabled = true;
        },

        refresh: function() {
            // var rf = this.wrapper.offsetHeight; // Force reflow

            this.wrapperWidth = this.wrapper.clientWidth;
            this.wrapperHeight = this.wrapper.clientHeight;

            /* REPLACE START: refresh */

            this.scrollerWidth = this.scroller.offsetWidth;
            this.scrollerHeight = this.scroller.offsetHeight;

            this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
            this.maxScrollY = this.wrapperHeight - this.scrollerHeight;

            /* REPLACE END: refresh */

            this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0;
            this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0;

            if (!this.hasHorizontalScroll) {
                this.maxScrollX = 0;
                this.scrollerWidth = this.wrapperWidth;
            }

            if (!this.hasVerticalScroll) {
                this.maxScrollY = 0;
                this.scrollerHeight = this.wrapperHeight;
            }

            this.endTime = 0;
            this.directionX = 0;
            this.directionY = 0;

            this.wrapperOffset = utils.offset(this.wrapper);

            this._execEvent('refresh');

            this.resetPosition();

            // INSERT POINT: _refresh

        },

        on: function(type, fn) {
            if (!this._events[type]) {
                this._events[type] = [];
            }

            this._events[type].push(fn);
        },

        off: function(type, fn) {
            if (!this._events[type]) {
                return;
            }

            var index = this._events[type].indexOf(fn);

            if (index > -1) {
                this._events[type].splice(index, 1);
            }
        },

        _execEvent: function(type) {
            if (!this._events[type]) {
                return;
            }

            var i = 0,
                l = this._events[type].length;

            if (!l) {
                return;
            }

            for (; i < l; i++) {
                this._events[type][i].apply(this, [].slice.call(arguments, 1));
            }
        },

        scrollBy: function(x, y, time, easing) {
            x = this.x + x;
            y = this.y + y;
            time = time || 0;

            this.scrollTo(x, y, time, easing);
        },

        scrollTo: function(x, y, time, easing) {
            easing = easing || utils.ease.circular;

            this.isInTransition = this.options.useTransition && time > 0;

            if (!time || (this.options.useTransition && easing.style)) {
                this._transitionTimingFunction(easing.style);
                this._transitionTime(time);
                this._translate(x, y);
            } else {
                this._animate(x, y, time, easing.fn);
            }
        },

        scrollToElement: function(el, time, offsetX, offsetY, easing) {
            el = el.nodeType ? el : this.scroller.querySelector(el);

            if (!el) {
                return;
            }

            var pos = utils.offset(el);

            pos.left -= this.wrapperOffset.left;
            pos.top -= this.wrapperOffset.top;

            // if offsetX/Y are true we center the element to the screen
            if (offsetX === true) {
                offsetX = Math.round(el.offsetWidth / 2 - this.wrapper.offsetWidth / 2);
            }
            if (offsetY === true) {
                offsetY = Math.round(el.offsetHeight / 2 - this.wrapper.offsetHeight / 2);
            }

            pos.left -= offsetX || 0;
            pos.top -= offsetY || 0;

            pos.left = pos.left > 0 ? 0 : pos.left < this.maxScrollX ? this.maxScrollX : pos.left;
            pos.top = pos.top > 0 ? 0 : pos.top < this.maxScrollY ? this.maxScrollY : pos.top;

            time = time === undefined || time === null || time === 'auto' ? Math.max(Math.abs(this.x - pos.left), Math.abs(this.y - pos.top)) : time;

            this.scrollTo(pos.left, pos.top, time, easing);
        },

        _transitionTime: function(time) {
            time = time || 0;

            this.scrollerStyle[utils.style.transitionDuration] = time + 'ms';

            if (!time && utils.isBadAndroid) {
                this.scrollerStyle[utils.style.transitionDuration] = '0.001s';
            }


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTime(time);
                }
            }


            // INSERT POINT: _transitionTime

        },

        _transitionTimingFunction: function(easing) {
            this.scrollerStyle[utils.style.transitionTimingFunction] = easing;


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].transitionTimingFunction(easing);
                }
            }


            // INSERT POINT: _transitionTimingFunction

        },

        _translate: function(x, y) {
            if (this.options.useTransform) {

                /* REPLACE START: _translate */

                this.scrollerStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.translateZ;

                /* REPLACE END: _translate */

            } else {
                x = Math.round(x);
                y = Math.round(y);
                this.scrollerStyle.left = x + 'px';
                this.scrollerStyle.top = y + 'px';
            }

            this.x = x;
            this.y = y;


            if (this.indicators) {
                for (var i = this.indicators.length; i--;) {
                    this.indicators[i].updatePosition();
                }
            }


            // INSERT POINT: _translate

        },

        _initEvents: function(remove) {
            var eventType = remove ? utils.removeEvent : utils.addEvent,
                target = this.options.bindToWrapper ? this.wrapper : window;

            eventType(window, 'orientationchange', this);
            eventType(window, 'resize', this);

            if (this.options.click) {
                eventType(this.wrapper, 'click', this, true);
            }

            if (!this.options.disableMouse) {
                eventType(this.wrapper, 'mousedown', this);
                eventType(target, 'mousemove', this);
                eventType(target, 'mousecancel', this);
                eventType(target, 'mouseup', this);
            }

            if (utils.hasPointer && !this.options.disablePointer) {
                eventType(this.wrapper, utils.prefixPointerEvent('pointerdown'), this);
                eventType(target, utils.prefixPointerEvent('pointermove'), this);
                eventType(target, utils.prefixPointerEvent('pointercancel'), this);
                eventType(target, utils.prefixPointerEvent('pointerup'), this);
            }

            if (utils.hasTouch && !this.options.disableTouch) {
                eventType(this.wrapper, 'touchstart', this);
                eventType(target, 'touchmove', this);
                eventType(target, 'touchcancel', this);
                eventType(target, 'touchend', this);
            }

            eventType(this.scroller, 'transitionend', this);
            eventType(this.scroller, 'webkitTransitionEnd', this);
            eventType(this.scroller, 'oTransitionEnd', this);
            eventType(this.scroller, 'MSTransitionEnd', this);
        },

        getComputedPosition: function() {
            var matrix = window.getComputedStyle(this.scroller, null),
                x, y;

            if (this.options.useTransform) {
                matrix = matrix[utils.style.transform].split(')')[0].split(', ');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +matrix.left.replace(/[^-\d.]/g, '');
                y = +matrix.top.replace(/[^-\d.]/g, '');
            }

            return {
                x: x,
                y: y
            };
        },

        _initIndicators: function() {
            var interactive = this.options.interactiveScrollbars,
                customStyle = typeof this.options.scrollbars !== 'string',
                indicators = [],
                indicator;

            var that = this;

            this.indicators = [];

            if (this.options.scrollbars) {
                // Vertical scrollbar
                if (this.options.scrollY) {
                    indicator = {
                        el: createDefaultScrollbar('v', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenX: false
                    };

                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator);
                }

                // Horizontal scrollbar
                if (this.options.scrollX) {
                    indicator = {
                        el: createDefaultScrollbar('h', interactive, this.options.scrollbars),
                        interactive: interactive,
                        defaultScrollbars: true,
                        customStyle: customStyle,
                        resize: this.options.resizeScrollbars,
                        shrink: this.options.shrinkScrollbars,
                        fade: this.options.fadeScrollbars,
                        listenY: false
                    };

                    this.wrapper.appendChild(indicator.el);
                    indicators.push(indicator);
                }
            }

            if (this.options.indicators) {
                // TODO: check concat compatibility
                indicators = indicators.concat(this.options.indicators);
            }

            for (var i = indicators.length; i--;) {
                this.indicators.push(new Indicator(this, indicators[i]));
            }

            // TODO: check if we can use array.map (wide compatibility and performance issues)
            function _indicatorsMap(fn) {
                for (var i = that.indicators.length; i--;) {
                    fn.call(that.indicators[i]);
                }
            }

            if (this.options.fadeScrollbars) {
                this.on('scrollEnd', function() {
                    _indicatorsMap(function() {
                        this.fade();
                    });
                });

                this.on('scrollCancel', function() {
                    _indicatorsMap(function() {
                        this.fade();
                    });
                });

                this.on('scrollStart', function() {
                    _indicatorsMap(function() {
                        this.fade(1);
                    });
                });

                this.on('beforeScrollStart', function() {
                    _indicatorsMap(function() {
                        this.fade(1, true);
                    });
                });
            }


            this.on('refresh', function() {
                _indicatorsMap(function() {
                    this.refresh();
                });
            });

            this.on('destroy', function() {
                _indicatorsMap(function() {
                    this.destroy();
                });

                delete this.indicators;
            });
        },

        _initWheel: function() {
            utils.addEvent(this.wrapper, 'wheel', this);
            utils.addEvent(this.wrapper, 'mousewheel', this);
            utils.addEvent(this.wrapper, 'DOMMouseScroll', this);

            this.on('destroy', function() {
                utils.removeEvent(this.wrapper, 'wheel', this);
                utils.removeEvent(this.wrapper, 'mousewheel', this);
                utils.removeEvent(this.wrapper, 'DOMMouseScroll', this);
            });
        },

        _wheel: function(e) {
            if (!this.enabled) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();

            var wheelDeltaX, wheelDeltaY,
                newX, newY,
                that = this;

            if (this.wheelTimeout === undefined) {
                that._execEvent('scrollStart');
            }

            // Execute the scrollEnd event after 400ms the wheel stopped scrolling
            clearTimeout(this.wheelTimeout);
            this.wheelTimeout = setTimeout(function() {
                that._execEvent('scrollEnd');
                that.wheelTimeout = undefined;
            }, 400);

            if ('deltaX' in e) {
                if (e.deltaMode === 1) {
                    wheelDeltaX = -e.deltaX * this.options.mouseWheelSpeed;
                    wheelDeltaY = -e.deltaY * this.options.mouseWheelSpeed;
                } else {
                    wheelDeltaX = -e.deltaX;
                    wheelDeltaY = -e.deltaY;
                }
            } else if ('wheelDeltaX' in e) {
                wheelDeltaX = e.wheelDeltaX / 120 * this.options.mouseWheelSpeed;
                wheelDeltaY = e.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
            } else if ('wheelDelta' in e) {
                wheelDeltaX = wheelDeltaY = e.wheelDelta / 120 * this.options.mouseWheelSpeed;
            } else if ('detail' in e) {
                wheelDeltaX = wheelDeltaY = -e.detail / 3 * this.options.mouseWheelSpeed;
            } else {
                return;
            }

            wheelDeltaX *= this.options.invertWheelDirection;
            wheelDeltaY *= this.options.invertWheelDirection;

            if (!this.hasVerticalScroll) {
                wheelDeltaX = wheelDeltaY;
                wheelDeltaY = 0;
            }

            if (this.options.snap) {
                newX = this.currentPage.pageX;
                newY = this.currentPage.pageY;

                if (wheelDeltaX > 0) {
                    newX--;
                } else if (wheelDeltaX < 0) {
                    newX++;
                }

                if (wheelDeltaY > 0) {
                    newY--;
                } else if (wheelDeltaY < 0) {
                    newY++;
                }

                this.goToPage(newX, newY);

                return;
            }

            newX = this.x + Math.round(this.hasHorizontalScroll ? wheelDeltaX : 0);
            newY = this.y + Math.round(this.hasVerticalScroll ? wheelDeltaY : 0);

            if (newX > 0) {
                newX = 0;
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
            }

            if (newY > 0) {
                newY = 0;
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
            }

            this.scrollTo(newX, newY, 0);

            this._execEvent('scroll');

            // INSERT POINT: _wheel
        },

        _initSnap: function() {
            this.currentPage = {};

            if (typeof this.options.snap === 'string') {
                this.options.snap = this.scroller.querySelectorAll(this.options.snap);
            }

            this.on('refresh', function() {
                var i = 0,
                    l,
                    m = 0,
                    n,
                    cx, cy,
                    x = 0,
                    y,
                    stepX = this.options.snapStepX || this.wrapperWidth,
                    stepY = this.options.snapStepY || this.wrapperHeight,
                    el;

                this.pages = [];

                if (!this.wrapperWidth || !this.wrapperHeight || !this.scrollerWidth || !this.scrollerHeight) {
                    return;
                }

                if (this.options.snap === true) {
                    cx = Math.round(stepX / 2);
                    cy = Math.round(stepY / 2);

                    while (x > -this.scrollerWidth) {
                        this.pages[i] = [];
                        l = 0;
                        y = 0;

                        while (y > -this.scrollerHeight) {
                            this.pages[i][l] = {
                                x: Math.max(x, this.maxScrollX),
                                y: Math.max(y, this.maxScrollY),
                                width: stepX,
                                height: stepY,
                                cx: x - cx,
                                cy: y - cy
                            };

                            y -= stepY;
                            l++;
                        }

                        x -= stepX;
                        i++;
                    }
                } else {
                    el = this.options.snap;
                    l = el.length;
                    n = -1;

                    for (; i < l; i++) {
                        if (i === 0 || el[i].offsetLeft <= el[i - 1].offsetLeft) {
                            m = 0;
                            n++;
                        }

                        if (!this.pages[m]) {
                            this.pages[m] = [];
                        }

                        x = Math.max(-el[i].offsetLeft, this.maxScrollX);
                        y = Math.max(-el[i].offsetTop, this.maxScrollY);
                        cx = x - Math.round(el[i].offsetWidth / 2);
                        cy = y - Math.round(el[i].offsetHeight / 2);

                        this.pages[m][n] = {
                            x: x,
                            y: y,
                            width: el[i].offsetWidth,
                            height: el[i].offsetHeight,
                            cx: cx,
                            cy: cy
                        };

                        if (x > this.maxScrollX) {
                            m++;
                        }
                    }
                }

                this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);

                // Update snap threshold if needed
                if (this.options.snapThreshold % 1 === 0) {
                    this.snapThresholdX = this.options.snapThreshold;
                    this.snapThresholdY = this.options.snapThreshold;
                } else {
                    this.snapThresholdX = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold);
                    this.snapThresholdY = Math.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold);
                }
            });

            this.on('flick', function() {
                var time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(this.x - this.startX), 1000),
                        Math.min(Math.abs(this.y - this.startY), 1000)
                    ), 300);

                this.goToPage(
                    this.currentPage.pageX + this.directionX,
                    this.currentPage.pageY + this.directionY,
                    time
                );
            });
        },

        _nearestSnap: function(x, y) {
            if (!this.pages.length) {
                return {
                    x: 0,
                    y: 0,
                    pageX: 0,
                    pageY: 0
                };
            }

            var i = 0,
                l = this.pages.length,
                m = 0;

            // Check if we exceeded the snap threshold
            if (Math.abs(x - this.absStartX) < this.snapThresholdX &&
                Math.abs(y - this.absStartY) < this.snapThresholdY) {
                return this.currentPage;
            }

            if (x > 0) {
                x = 0;
            } else if (x < this.maxScrollX) {
                x = this.maxScrollX;
            }

            if (y > 0) {
                y = 0;
            } else if (y < this.maxScrollY) {
                y = this.maxScrollY;
            }

            for (; i < l; i++) {
                if (x >= this.pages[i][0].cx) {
                    x = this.pages[i][0].x;
                    break;
                }
            }

            l = this.pages[i].length;

            for (; m < l; m++) {
                if (y >= this.pages[0][m].cy) {
                    y = this.pages[0][m].y;
                    break;
                }
            }

            if (i === this.currentPage.pageX) {
                i += this.directionX;

                if (i < 0) {
                    i = 0;
                } else if (i >= this.pages.length) {
                    i = this.pages.length - 1;
                }

                x = this.pages[i][0].x;
            }

            if (m === this.currentPage.pageY) {
                m += this.directionY;

                if (m < 0) {
                    m = 0;
                } else if (m >= this.pages[0].length) {
                    m = this.pages[0].length - 1;
                }

                y = this.pages[0][m].y;
            }

            return {
                x: x,
                y: y,
                pageX: i,
                pageY: m
            };
        },

        goToPage: function(x, y, time, easing) {
            easing = easing || this.options.bounceEasing;

            if (x >= this.pages.length) {
                x = this.pages.length - 1;
            } else if (x < 0) {
                x = 0;
            }

            if (y >= this.pages[x].length) {
                y = this.pages[x].length - 1;
            } else if (y < 0) {
                y = 0;
            }

            var posX = this.pages[x][y].x,
                posY = this.pages[x][y].y;

            time = time === undefined ? this.options.snapSpeed || Math.max(
                Math.max(
                    Math.min(Math.abs(posX - this.x), 1000),
                    Math.min(Math.abs(posY - this.y), 1000)
                ), 300) : time;

            this.currentPage = {
                x: posX,
                y: posY,
                pageX: x,
                pageY: y
            };

            this.scrollTo(posX, posY, time, easing);
        },

        next: function(time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;

            x++;

            if (x >= this.pages.length && this.hasVerticalScroll) {
                x = 0;
                y++;
            }

            this.goToPage(x, y, time, easing);
        },

        prev: function(time, easing) {
            var x = this.currentPage.pageX,
                y = this.currentPage.pageY;

            x--;

            if (x < 0 && this.hasVerticalScroll) {
                x = 0;
                y--;
            }

            this.goToPage(x, y, time, easing);
        },

        _initKeys: function() {
            // default key bindings
            var keys = {
                pageUp: 33,
                pageDown: 34,
                end: 35,
                home: 36,
                left: 37,
                up: 38,
                right: 39,
                down: 40
            };
            var i;

            // if you give me characters I give you keycode
            if (typeof this.options.keyBindings === 'object') {
                for (i in this.options.keyBindings) {
                    if (typeof this.options.keyBindings[i] === 'string') {
                        this.options.keyBindings[i] = this.options.keyBindings[i].toUpperCase().charCodeAt(0);
                    }
                }
            } else {
                this.options.keyBindings = {};
            }

            for (i in keys) { // jshint ignore:line
                    this.options.keyBindings[i] = this.options.keyBindings[i] || keys[i];
            }

            utils.addEvent(window, 'keydown', this);

            this.on('destroy', function() {
                utils.removeEvent(window, 'keydown', this);
            });
        },

        _key: function(e) {
            if (!this.enabled) {
                return;
            }

            var snap = this.options.snap, // we are using this alot, better to cache it
                newX = snap ? this.currentPage.pageX : this.x,
                newY = snap ? this.currentPage.pageY : this.y,
                now = utils.getTime(),
                prevTime = this.keyTime || 0,
                acceleration = 0.250,
                pos;

            if (this.options.useTransition && this.isInTransition) {
                pos = this.getComputedPosition();

                this._translate(Math.round(pos.x), Math.round(pos.y));
                this.isInTransition = false;
            }

            this.keyAcceleration = now - prevTime < 200 ? Math.min(this.keyAcceleration + acceleration, 50) : 0;

            switch (e.keyCode) {
                case this.options.keyBindings.pageUp:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX += snap ? 1 : this.wrapperWidth;
                    } else {
                        newY += snap ? 1 : this.wrapperHeight;
                    }
                    break;
                case this.options.keyBindings.pageDown:
                    if (this.hasHorizontalScroll && !this.hasVerticalScroll) {
                        newX -= snap ? 1 : this.wrapperWidth;
                    } else {
                        newY -= snap ? 1 : this.wrapperHeight;
                    }
                    break;
                case this.options.keyBindings.end:
                    newX = snap ? this.pages.length - 1 : this.maxScrollX;
                    newY = snap ? this.pages[0].length - 1 : this.maxScrollY;
                    break;
                case this.options.keyBindings.home:
                    newX = 0;
                    newY = 0;
                    break;
                case this.options.keyBindings.left:
                    newX += snap ? -1 : 5 + this.keyAcceleration >> 0; // jshint ignore:line
                    break;
                case this.options.keyBindings.up:
                    newY += snap ? 1 : 5 + this.keyAcceleration >> 0; // jshint ignore:line
                    break;
                case this.options.keyBindings.right:
                    newX -= snap ? -1 : 5 + this.keyAcceleration >> 0; // jshint ignore:line
                    break;
                case this.options.keyBindings.down:
                    newY -= snap ? 1 : 5 + this.keyAcceleration >> 0; // jshint ignore:line
                    break;
                default:
                    return;
            }

            if (snap) {
                this.goToPage(newX, newY);
                return;
            }

            if (newX > 0) {
                newX = 0;
                this.keyAcceleration = 0;
            } else if (newX < this.maxScrollX) {
                newX = this.maxScrollX;
                this.keyAcceleration = 0;
            }

            if (newY > 0) {
                newY = 0;
                this.keyAcceleration = 0;
            } else if (newY < this.maxScrollY) {
                newY = this.maxScrollY;
                this.keyAcceleration = 0;
            }

            this.scrollTo(newX, newY, 0);

            this.keyTime = now;
        },

        _animate: function(destX, destY, duration, easingFn) {
            var that = this,
                startX = this.x,
                startY = this.y,
                startTime = utils.getTime(),
                destTime = startTime + duration;

            function step() {
                var now = utils.getTime(),
                    newX, newY,
                    easing;

                if (now >= destTime) {
                    that.isAnimating = false;
                    that._translate(destX, destY);

                    if (!that.resetPosition(that.options.bounceTime)) {
                        that._execEvent('scrollEnd');
                    }

                    return;
                }

                now = (now - startTime) / duration;
                easing = easingFn(now);
                newX = (destX - startX) * easing + startX;
                newY = (destY - startY) * easing + startY;
                that._translate(newX, newY);

                if (that.isAnimating) {
                    rAF(step);
                }

                if (that.options.probeType === 3) {
                    that._execEvent('scroll');
                }
            }

            this.isAnimating = true;
            step();
        },

        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
                case 'orientationchange':
                case 'resize':
                    this._resize();
                    break;
                case 'transitionend':
                case 'webkitTransitionEnd':
                case 'oTransitionEnd':
                case 'MSTransitionEnd':
                    this._transitionEnd(e);
                    break;
                case 'wheel':
                case 'DOMMouseScroll':
                case 'mousewheel':
                    this._wheel(e);
                    break;
                case 'keydown':
                    this._key(e);
                    break;
                case 'click':
                    if (!e._constructed) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    break;
            }
        }
    };

    function createDefaultScrollbar(direction, interactive, type) {
        var scrollbar = document.createElement('div'),
            indicator = document.createElement('div');

        if (type === true) {
            scrollbar.style.cssText = 'position:absolute;z-index:9999';
            indicator.style.cssText = '-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px';
        }

        indicator.className = 'iScrollIndicator';

        if (direction === 'h') {
            if (type === true) {
                scrollbar.style.cssText += ';height:5px;left:2px;right:2px;bottom:0';
                indicator.style.height = '100%';
            }
            scrollbar.className = 'iScrollHorizontalScrollbar';
        } else {
            if (type === true) {
                scrollbar.style.cssText += ';width:5px;bottom:2px;top:2px;right:1px';
                indicator.style.width = '100%';
            }
            scrollbar.className = 'iScrollVerticalScrollbar';
        }

        scrollbar.style.cssText += ';overflow:hidden';

        if (!interactive) {
            scrollbar.style.pointerEvents = 'none';
        }

        scrollbar.appendChild(indicator);

        return scrollbar;
    }

    function Indicator(scroller, options) {
        this.wrapper = typeof options.el === 'string' ? document.querySelector(options.el) : options.el;
        this.wrapperStyle = this.wrapper.style;
        this.indicator = this.wrapper.children[0];
        this.indicatorStyle = this.indicator.style;
        this.scroller = scroller;

        this.options = {
            listenX: true,
            listenY: true,
            interactive: false,
            resize: true,
            defaultScrollbars: false,
            shrink: false,
            fade: false,
            speedRatioX: 0,
            speedRatioY: 0
        };

        for (var i in options) { // jshint ignore:line
                this.options[i] = options[i];

        }

        this.sizeRatioX = 1;
        this.sizeRatioY = 1;
        this.maxPosX = 0;
        this.maxPosY = 0;

        if (this.options.interactive) {
            if (!this.options.disableTouch) {
                utils.addEvent(this.indicator, 'touchstart', this);
                utils.addEvent(window, 'touchend', this);
            }
            if (!this.options.disablePointer) {
                utils.addEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.addEvent(window, utils.prefixPointerEvent('pointerup'), this);
            }
            if (!this.options.disableMouse) {
                utils.addEvent(this.indicator, 'mousedown', this);
                utils.addEvent(window, 'mouseup', this);
            }
        }

        if (this.options.fade) {
            this.wrapperStyle[utils.style.transform] = this.scroller.translateZ;
            this.wrapperStyle[utils.style.transitionDuration] = utils.isBadAndroid ? '0.001s' : '0ms';
            this.wrapperStyle.opacity = '0';
        }
    }

    Indicator.prototype = {
        handleEvent: function(e) {
            switch (e.type) {
                case 'touchstart':
                case 'pointerdown':
                case 'MSPointerDown':
                case 'mousedown':
                    this._start(e);
                    break;
                case 'touchmove':
                case 'pointermove':
                case 'MSPointerMove':
                case 'mousemove':
                    this._move(e);
                    break;
                case 'touchend':
                case 'pointerup':
                case 'MSPointerUp':
                case 'mouseup':
                case 'touchcancel':
                case 'pointercancel':
                case 'MSPointerCancel':
                case 'mousecancel':
                    this._end(e);
                    break;
            }
        },

        destroy: function() {
            if (this.options.interactive) {
                utils.removeEvent(this.indicator, 'touchstart', this);
                utils.removeEvent(this.indicator, utils.prefixPointerEvent('pointerdown'), this);
                utils.removeEvent(this.indicator, 'mousedown', this);

                utils.removeEvent(window, 'touchmove', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
                utils.removeEvent(window, 'mousemove', this);

                utils.removeEvent(window, 'touchend', this);
                utils.removeEvent(window, utils.prefixPointerEvent('pointerup'), this);
                utils.removeEvent(window, 'mouseup', this);
            }

            if (this.options.defaultScrollbars) {
                this.wrapper.parentNode.removeChild(this.wrapper);
            }
        },

        _start: function(e) {
            var point = e.touches ? e.touches[0] : e;

            e.preventDefault();
            e.stopPropagation();

            this.transitionTime();

            this.initiated = true;
            this.moved = false;
            this.lastPointX = point.pageX;
            this.lastPointY = point.pageY;

            this.startTime = utils.getTime();

            if (!this.options.disableTouch) {
                utils.addEvent(window, 'touchmove', this);
            }
            if (!this.options.disablePointer) {
                utils.addEvent(window, utils.prefixPointerEvent('pointermove'), this);
            }
            if (!this.options.disableMouse) {
                utils.addEvent(window, 'mousemove', this);
            }

            this.scroller._execEvent('beforeScrollStart');
        },

        _move: function(e) {
            var point = e.touches ? e.touches[0] : e,
                deltaX, deltaY,
                newX, newY,
                timestamp = utils.getTime();

            if (!this.moved) {
                this.scroller._execEvent('scrollStart');
            }

            this.moved = true;

            deltaX = point.pageX - this.lastPointX;
            this.lastPointX = point.pageX;

            deltaY = point.pageY - this.lastPointY;
            this.lastPointY = point.pageY;

            newX = this.x + deltaX;
            newY = this.y + deltaY;

            this._pos(newX, newY);


            if (this.scroller.options.probeType === 1 && timestamp - this.startTime > 300) {
                this.startTime = timestamp;
                this.scroller._execEvent('scroll');
            } else if (this.scroller.options.probeType > 1) {
                this.scroller._execEvent('scroll');
            }


            // INSERT POINT: indicator._move

            e.preventDefault();
            e.stopPropagation();
        },

        _end: function(e) {
            if (!this.initiated) {
                return;
            }

            this.initiated = false;

            e.preventDefault();
            e.stopPropagation();

            utils.removeEvent(window, 'touchmove', this);
            utils.removeEvent(window, utils.prefixPointerEvent('pointermove'), this);
            utils.removeEvent(window, 'mousemove', this);

            if (this.scroller.options.snap) {
                var snap = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);

                var time = this.options.snapSpeed || Math.max(
                    Math.max(
                        Math.min(Math.abs(this.scroller.x - snap.x), 1000),
                        Math.min(Math.abs(this.scroller.y - snap.y), 1000)
                    ), 300);

                if (this.scroller.x !== snap.x || this.scroller.y !== snap.y) {
                    this.scroller.directionX = 0;
                    this.scroller.directionY = 0;
                    this.scroller.currentPage = snap;
                    this.scroller.scrollTo(snap.x, snap.y, time, this.scroller.options.bounceEasing);
                }
            }

            if (this.moved) {
                this.scroller._execEvent('scrollEnd');
            }
        },

        transitionTime: function(time) {
            time = time || 0;
            this.indicatorStyle[utils.style.transitionDuration] = time + 'ms';

            if (!time && utils.isBadAndroid) {
                this.indicatorStyle[utils.style.transitionDuration] = '0.001s';
            }
        },

        transitionTimingFunction: function(easing) {
            this.indicatorStyle[utils.style.transitionTimingFunction] = easing;
        },

        refresh: function() {
            this.transitionTime();

            if (this.options.listenX && !this.options.listenY) {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll ? 'block' : 'none';
            } else if (this.options.listenY && !this.options.listenX) {
                this.indicatorStyle.display = this.scroller.hasVerticalScroll ? 'block' : 'none';
            } else {
                this.indicatorStyle.display = this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? 'block' : 'none';
            }

            if (this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll) {
                utils.addClass(this.wrapper, 'iScrollBothScrollbars');
                utils.removeClass(this.wrapper, 'iScrollLoneScrollbar');

                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '8px';
                    } else {
                        this.wrapper.style.bottom = '8px';
                    }
                }
            } else {
                utils.removeClass(this.wrapper, 'iScrollBothScrollbars');
                utils.addClass(this.wrapper, 'iScrollLoneScrollbar');

                if (this.options.defaultScrollbars && this.options.customStyle) {
                    if (this.options.listenX) {
                        this.wrapper.style.right = '2px';
                    } else {
                        this.wrapper.style.bottom = '2px';
                    }
                }
            }

            // var r = this.wrapper.offsetHeight; // force refresh

            if (this.options.listenX) {
                this.wrapperWidth = this.wrapper.clientWidth;
                if (this.options.resize) {
                    this.indicatorWidth = Math.max(Math.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth || 1)), 8);
                    this.indicatorStyle.width = this.indicatorWidth + 'px';
                } else {
                    this.indicatorWidth = this.indicator.clientWidth;
                }

                this.maxPosX = this.wrapperWidth - this.indicatorWidth;

                if (this.options.shrink === 'clip') {
                    this.minBoundaryX = -this.indicatorWidth + 8;
                    this.maxBoundaryX = this.wrapperWidth - 8;
                } else {
                    this.minBoundaryX = 0;
                    this.maxBoundaryX = this.maxPosX;
                }

                this.sizeRatioX = this.options.speedRatioX || (this.scroller.maxScrollX && (this.maxPosX / this.scroller.maxScrollX));
            }

            if (this.options.listenY) {
                this.wrapperHeight = this.wrapper.clientHeight;
                if (this.options.resize) {
                    this.indicatorHeight = Math.max(Math.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8);
                    this.indicatorStyle.height = this.indicatorHeight + 'px';
                } else {
                    this.indicatorHeight = this.indicator.clientHeight;
                }

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;

                if (this.options.shrink === 'clip') {
                    this.minBoundaryY = -this.indicatorHeight + 8;
                    this.maxBoundaryY = this.wrapperHeight - 8;
                } else {
                    this.minBoundaryY = 0;
                    this.maxBoundaryY = this.maxPosY;
                }

                this.maxPosY = this.wrapperHeight - this.indicatorHeight;
                this.sizeRatioY = this.options.speedRatioY || (this.scroller.maxScrollY && (this.maxPosY / this.scroller.maxScrollY));
            }

            this.updatePosition();
        },

        updatePosition: function() {
            var x = this.options.listenX && Math.round(this.sizeRatioX * this.scroller.x) || 0,
                y = this.options.listenY && Math.round(this.sizeRatioY * this.scroller.y) || 0;

            if (!this.options.ignoreBoundaries) {
                if (x < this.minBoundaryX) {
                    if (this.options.shrink === 'scale') {
                        this.width = Math.max(this.indicatorWidth + x, 8);
                        this.indicatorStyle.width = this.width + 'px';
                    }
                    x = this.minBoundaryX;
                } else if (x > this.maxBoundaryX) {
                    if (this.options.shrink === 'scale') {
                        this.width = Math.max(this.indicatorWidth - (x - this.maxPosX), 8);
                        this.indicatorStyle.width = this.width + 'px';
                        x = this.maxPosX + this.indicatorWidth - this.width;
                    } else {
                        x = this.maxBoundaryX;
                    }
                } else if (this.options.shrink === 'scale' && this.width !== this.indicatorWidth) {
                    this.width = this.indicatorWidth;
                    this.indicatorStyle.width = this.width + 'px';
                }

                if (y < this.minBoundaryY) {
                    if (this.options.shrink === 'scale') {
                        this.height = Math.max(this.indicatorHeight + y * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                    }
                    y = this.minBoundaryY;
                } else if (y > this.maxBoundaryY) {
                    if (this.options.shrink === 'scale') {
                        this.height = Math.max(this.indicatorHeight - (y - this.maxPosY) * 3, 8);
                        this.indicatorStyle.height = this.height + 'px';
                        y = this.maxPosY + this.indicatorHeight - this.height;
                    } else {
                        y = this.maxBoundaryY;
                    }
                } else if (this.options.shrink === 'scale' && this.height !== this.indicatorHeight) {
                    this.height = this.indicatorHeight;
                    this.indicatorStyle.height = this.height + 'px';
                }
            }

            this.x = x;
            this.y = y;

            if (this.scroller.options.useTransform) {
                this.indicatorStyle[utils.style.transform] = 'translate(' + x + 'px,' + y + 'px)' + this.scroller.translateZ;
            } else {
                this.indicatorStyle.left = x + 'px';
                this.indicatorStyle.top = y + 'px';
            }
        },

        _pos: function(x, y) {
            if (x < 0) {
                x = 0;
            } else if (x > this.maxPosX) {
                x = this.maxPosX;
            }

            if (y < 0) {
                y = 0;
            } else if (y > this.maxPosY) {
                y = this.maxPosY;
            }

            x = this.options.listenX ? Math.round(x / this.sizeRatioX) : this.scroller.x;
            y = this.options.listenY ? Math.round(y / this.sizeRatioY) : this.scroller.y;

            this.scroller.scrollTo(x, y);
        },

        fade: function(val, hold) {
            if (hold && !this.visible) {
                return;
            }

            clearTimeout(this.fadeTimeout);
            this.fadeTimeout = null;

            var time = val ? 250 : 500,
                delay = val ? 0 : 300;

            val = val ? '1' : '0';

            this.wrapperStyle[utils.style.transitionDuration] = time + 'ms';

            this.fadeTimeout = setTimeout((function(val) {
                this.wrapperStyle.opacity = val;
                this.visible = +val;
            }).bind(this, val), delay);
        }
    };

    IScroll.utils = utils;

    window.IScroll = IScroll;
}(window);

/* ===============================================================================
************   scroller   ************
=============================================================================== */
+ function($) {
    "use strict";
    //重置zepto自带的滚动条
    var _zeptoMethodCache = {
        "scrollTop": $.fn.scrollTop,
        "scrollLeft": $.fn.scrollLeft
    };
    //重置scrollLeft和scrollRight
    (function() {
        $.extend($.fn, {
            scrollTop: function(top, dur) {
                if (!this.length) return;
                var scroller = this.data('scroller');
                if (scroller && scroller.scroller) { //js滚动
                    return scroller.scrollTop(top, dur);
                } else {
                    return _zeptoMethodCache.scrollTop.apply(this, arguments);
                }
            }
        });
        $.extend($.fn, {
            scrollLeft: function(left, dur) {
                if (!this.length) return;
                var scroller = this.data('scroller');
                if (scroller && scroller.scroller) { //js滚动
                    return scroller.scrollLeft(left, dur);
                } else {
                    return _zeptoMethodCache.scrollLeft.apply(this, arguments);
                }
            }
        });
    })();



    //自定义的滚动条
    var Scroller = function(pageContent, _options) {
        var $pageContent = this.$pageContent = $(pageContent);

        this.options = $.extend({}, this._defaults, _options);

        var type = this.options.type;
        //auto的type,系统版本的小于4.4.0的安卓设备和系统版本小于6.0.0的ios设备，启用js版的iscoll
        var useJSScroller = (type === 'js') || (type === 'auto' && ($.device.android && $.compareVersion('4.4.0', $.device.osVersion) > -1) || (type === 'auto' && ($.device.ios && $.compareVersion('6.0.0', $.device.osVersion) > -1)));

        if (useJSScroller) {

            var $pageContentInner = $pageContent.find('.content-inner');
            //如果滚动内容没有被包裹，自动添加wrap
            if (!$pageContentInner[0]) {
                // $pageContent.html('<div class="content-inner">' + $pageContent.html() + '</div>');
                var children = $pageContent.children();
                if (children.length < 1) {
                    $pageContent.children().wrapAll('<div class="content-inner"></div>');
                } else {
                    $pageContent.html('<div class="content-inner">' + $pageContent.html() + '</div>');
                }
            }

            if ($pageContent.hasClass('pull-to-refresh-content')) {
                //因为iscroll 当页面高度不足 100% 时无法滑动，所以无法触发下拉动作，这里改动一下高度
                //区分是否有.bar容器，如有，则content的top:0，无则content的top:-2.2rem,这里取2.2rem的最大值，近60
                var minHeight = $(window).height() + ($pageContent.prev().hasClass(".bar") ? 1 : 61);
                $pageContent.find('.content-inner').css('min-height', minHeight + 'px');
            }

            var ptr = $(pageContent).hasClass('pull-to-refresh-content');
            //js滚动模式，用transform移动内容区位置，会导致fixed失效，表现类似absolute。因此禁用transform模式
            var useTransform = $pageContent.find('.fixed-tab').length === 0;
            var options = {
                probeType: 1,
                mouseWheel: true,
                //解决安卓js模式下，刷新滚动条后绑定的事件不响应，对chrome内核浏览器设置click:true
                click: $.device.androidChrome,
                useTransform: useTransform,
                //js模式下允许滚动条横向滚动，但是需要注意，滚动容易宽度必须大于屏幕宽度滚动才生效
                scrollX: true
            };
            if (ptr) {
                options.ptr = true;
                options.ptrOffset = 44;
            }
            //如果用js滚动条，用transform计算内容区位置，position：fixed将实效。若有.fixed-tab，强制使用native滚动条；备选方案，略粗暴
            // if($(pageContent).find('.fixed-tab').length>0){
            //     $pageContent.addClass('native-scroll');
            //     return;
            // }
            this.scroller = new IScroll(pageContent, options); // jshint ignore:line
            //和native滚动统一起来
            this._bindEventToDomWhenJs();
            $.initPullToRefresh = $._pullToRefreshJSScroll.initPullToRefresh;
            $.pullToRefreshDone = $._pullToRefreshJSScroll.pullToRefreshDone;
            $.pullToRefreshTrigger = $._pullToRefreshJSScroll.pullToRefreshTrigger;
            $.destroyToRefresh = $._pullToRefreshJSScroll.destroyToRefresh;
            $pageContent.addClass('javascript-scroll');
            if (!useTransform) {
                $pageContent.find('.content-inner').css({
                    width: '100%',
                    position: 'absolute'
                });
            }

            //如果页面本身已经进行了原生滚动，那么把这个滚动换成JS的滚动
            var nativeScrollTop = this.$pageContent[0].scrollTop;
            if(nativeScrollTop) {
                this.$pageContent[0].scrollTop = 0;
                this.scrollTop(nativeScrollTop);
            }
        } else {
            $pageContent.addClass('native-scroll');
        }
    };
    Scroller.prototype = {
        _defaults: {
            type: 'native',
        },
        _bindEventToDomWhenJs: function() {
            //"scrollStart", //the scroll started.
            //"scroll", //the content is scrolling. Available only in scroll-probe.js edition. See onScroll event.
            //"scrollEnd", //content stopped scrolling.
            if (this.scroller) {
                var self = this;
                this.scroller.on('scrollStart', function() {
                    self.$pageContent.trigger('scrollstart');
                });
                this.scroller.on('scroll', function() {
                    self.$pageContent.trigger('scroll');
                });
                this.scroller.on('scrollEnd', function() {
                    self.$pageContent.trigger('scrollend');
                });
            } else {
                //TODO: 实现native的scrollStart和scrollEnd
            }
        },
        scrollTop: function(top, dur) {
            if (this.scroller) {
                if (top !== undefined) {
                    this.scroller.scrollTo(0, -1 * top, dur);
                } else {
                    return this.scroller.getComputedPosition().y * -1;
                }
            } else {
                return this.$pageContent.scrollTop(top, dur);
            }
            return this;
        },
        scrollLeft: function(left, dur) {
            if (this.scroller) {
                if (left !== undefined) {
                    this.scroller.scrollTo(-1 * left, 0);
                } else {
                    return this.scroller.getComputedPosition().x * -1;
                }
            } else {
                return this.$pageContent.scrollTop(left, dur);
            }
            return this;
        },
        on: function(event, callback) {
            if (this.scroller) {
                this.scroller.on(event, function() {
                    callback.call(this.wrapper);
                });
            } else {
                this.$pageContent.on(event, callback);
            }
            return this;
        },
        off: function(event, callback) {
            if (this.scroller) {
                this.scroller.off(event, callback);
            } else {
                this.$pageContent.off(event, callback);
            }
            return this;
        },
        refresh: function() {
            if (this.scroller) this.scroller.refresh();
            return this;
        },
        scrollHeight: function() {
            if (this.scroller) {
                return this.scroller.scrollerHeight;
            } else {
                return this.$pageContent[0].scrollHeight;
            }
        }

    };

    //Scroller PLUGIN DEFINITION
    // =======================

    function Plugin(option) {
        var args = Array.apply(null, arguments);
        args.shift();
        var internal_return;

        this.each(function() {

            var $this = $(this);

            var options = $.extend({}, $this.dataset(), typeof option === 'object' && option);

            var data = $this.data('scroller');
            //如果 scroller 没有被初始化，对scroller 进行初始化r
            if (!data) {
                //获取data-api的
                $this.data('scroller', (data = new Scroller(this, options)));

            }
            if (typeof option === 'string' && typeof data[option] === 'function') {
                internal_return = data[option].apply(data, args);
                if (internal_return !== undefined)
            return false;
            }

        });

        if (internal_return !== undefined)
            return internal_return;
        else
            return this;

    }

    var old = $.fn.scroller;

    $.fn.scroller = Plugin;
    $.fn.scroller.Constructor = Scroller;


    // Scroll NO CONFLICT
    // =================

    $.fn.scroller.noConflict = function() {
        $.fn.scroller = old;
        return this;
    };
    //添加data-api
    $(function() {
        $('[data-toggle="scroller"]').scroller();
    });

    //统一的接口,带有 .javascript-scroll 的content 进行刷新
    $.refreshScroller = function(content) {
        if (content) {
            $(content).scroller('refresh');
        } else {
            $('.javascript-scroll').each(function() {
                $(this).scroller('refresh');
            });
        }

    };
    //全局初始化方法，会对页面上的 [data-toggle="scroller"]，.content. 进行滚动条初始化
    $.initScroller = function(option) {
        this.options = $.extend({}, typeof option === 'object' && option);
        $('[data-toggle="scroller"],.content').scroller(option);
    };
    //获取scroller对象
    $.getScroller = function(content) {
        //以前默认只能有一个无限滚动，因此infinitescroll都是加在content上，现在允许里面有多个，因此要判断父元素是否有content
        content = content.hasClass('content') ? content : content.parents('.content');
        if (content) {
            return $(content).data('scroller');
        } else {
            return $('.content.javascript-scroll').data('scroller');
        }
    };
    //检测滚动类型,
    //‘js’: javascript 滚动条
    //‘native’: 原生滚动条
    $.detectScrollerType = function(content) {
        if (content) {
            if ($(content).data('scroller') && $(content).data('scroller').scroller) {
                return 'js';
            } else {
                return 'native';
            }
        }
    };

}(Zepto);


/**
 * @typedef {Object} State
 * @property {Number} id
 * @property {String} url
 * @property {String} pageId
 */

/**
 * @typedef {Object} UrlObject 字符串 url 转为的对象
 * @property {String} base url 的基本路径
 * @property {String} full url 的完整绝对路径
 * @property {String} origin 转换前的 url
 * @property {String} fragment url 的 fragment
 */

/**
 * @typedef {Object} DocumentCache
 * @property {*|HTMLElement} $doc 看做是 $(document)
 * @property {*|HTMLElement} $content $doc 里的 routerConfig.innerViewClass 元素
 */

/*======================================================
************   Modals   ************
======================================================*/
/*jshint unused: false*/
+function ($) {
  "use strict";
  $.lastPosition =function(options) {
    if ( !sessionStorage) {
        return;
    }
    // 需要记忆模块的className
    var needMemoryClass = options.needMemoryClass || [];

    $(window).off('beforePageSwitch').on('beforePageSwitch', function(event,id,arg) {
      updateMemory(id,arg);
    });
    $(window).off('pageAnimationStart').on('pageAnimationStart', function(event,id,arg) {
      getMemory(id,arg);
    });
    //让后退页面回到之前的高度
    function getMemory(id,arg){
      needMemoryClass.forEach(function(item, index) {
          if ($(item).length === 0) {
              return;
          }
          var positionName = id ;
          // 遍历对应节点设置存储的高度
          var memoryHeight = sessionStorage.getItem(positionName);
          arg.find(item).scrollTop(parseInt(memoryHeight));

      });
    }
    //记住即将离开的页面的高度
    function updateMemory(id,arg) {
        var positionName = id ;
        // 存储需要记忆模块的高度
        needMemoryClass.forEach(function(item, index) {
            if ($(item).length === 0) {
                return;
            }
            sessionStorage.setItem(
                positionName,
                arg.find(item).scrollTop()
            );

        });
    }
  };
}(Zepto);

/*jshint unused: false*/
+function($) {
    'use strict';

    var getPage = function() {
        var $page = $(".page-current");
        if (!$page[0]) $page = $(".page").addClass('page-current');
        return $page;
    };

    //初始化页面中的JS组件
    $.initPage = function(page) {
        var $page = getPage();
        if (!$page[0]) $page = $(document.body);
        var $content = $page.hasClass('content') ?
                       $page :
                       $page.find('.content');
        $content.scroller();  //注意滚动条一定要最先初始化

        // $.initPullToRefresh($content);
        // $.initInfiniteScroll($content);
        // $.initCalendar($content);

        //extend
        if ($.initSwiper) $.initSwiper($content);
    };

    if ($.smConfig.showPageLoadingIndicator) {
        //这里的 以 push 开头的是私有事件，不要用
        $(window).on('pageLoadStart', function() {
            $.showIndicator();

        });
        $(window).on('pageAnimationStart', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadCancel', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadComplete', function() {
            $.hideIndicator();
        });
        $(window).on('pageLoadError', function() {
            $.hideIndicator();
            $.toast('加载失败');
        });
    }

    $(window).on('pageAnimationStart', function(event,id,page) {
        // 在路由切换页面动画开始前,为了把位于 .page 之外的 popup 等隐藏,此处做些处理
        $.closeModal();
        $.closePanel();
        // 如果 panel 的 effect 是 reveal 时,似乎是 page 的动画或别的样式原因导致了 transitionEnd 时间不会触发
        // 这里暂且处理一下
        $('body').removeClass('panel-closing');
        $.allowPanelOpen = true;  
    });
   
    $(window).on('pageInit', function() {
        $.hideIndicator();
        $.lastPosition({
            needMemoryClass: [
                '.content'
            ]
        });
    });
    // safari 在后退的时候会使用缓存技术，但实现上似乎存在些问题，
    // 导致路由中绑定的点击事件不会正常如期的运行（log 和 debugger 都没法调试），
    // 从而后续的跳转等完全乱了套。
    // 所以，这里检测到是 safari 的 cache 的情况下，做一次 reload
    // 测试路径(后缀 D 表示是 document，E 表示 external，不使用路由跳转）：
    // 1. aD -> bDE
    // 2. back
    // 3. aD -> bD
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            location.reload();
        }
    });

    $.init = function() {
        var $page = getPage();
        var id = $page[0].id;
        $.initPage();
        $page.trigger('pageInit', [id, $page]);
    };

    //DOM READY
    $(function() {
        //直接绑定
        FastClick.attach(document.body);

        if ($.smConfig.autoInit) {
            $.init();
        }

        $(document).on('pageInitInternal', function(e, id, page) {
            $.init();
        });
    });

}(Zepto);

/**
 * ScrollFix v0.1
 * http://www.joelambert.co.uk
 *
 * Copyright 2011, Joe Lambert.
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */
/* ===============================================================================
************   ScrollFix   ************
=============================================================================== */

+ function($) {
    "use strict";
    //安卓微信中使用scrollfix会有问题，因此只在ios中使用，安卓机器按照原来的逻辑

    if($.device.ios){
        var ScrollFix = function(elem) {

            // Variables to track inputs
            var startY;
            var startTopScroll;

            elem = elem || document.querySelector(elem);

            // If there is no element, then do nothing
            if(!elem)
                return;

            // Handle the start of interactions
            elem.addEventListener('touchstart', function(event){
                startY = event.touches[0].pageY;
                startTopScroll = elem.scrollTop;

                if(startTopScroll <= 0)
                elem.scrollTop = 1;

            if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
                elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
            }, false);
        };

        var initScrollFix = function(){
            var prefix = $('.page-current').length > 0 ? '.page-current ' : '';
            var scrollable = $(prefix + ".content");
            new ScrollFix(scrollable[0]);
        };

        $(document).on($.touchEvents.move, ".page-current .bar",function(){
            event.preventDefault();
        });
        //监听ajax页面跳转
        $(document).on("pageLoadComplete", function(){
             initScrollFix();
        });
        //监听内联页面跳转
        $(document).on("pageAnimationEnd", function(){
             initScrollFix();
        });
        initScrollFix();
    }

}(Zepto);