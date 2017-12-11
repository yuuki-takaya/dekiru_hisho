(function(win, doc) {

    "use strict";

    win.App = win.App || {};

})(this, document);

(function(win, doc, ns) {

    "use strict";

    function EventDispatcher() {
        this._events = {};
    }

    EventDispatcher.prototype.hasEventListener = function(eventName) {
        return !!this._events[eventName];
    };
   
    EventDispatcher.prototype.addEventListener = function(eventName, callback) {
        if (this.hasEventListener(eventName)) {
            var events = this._events[eventName],
                length = events.length,
                i = 0;

            for (; i < length; i++) {
                if (events[i] === callback) {
                    return;
                }
            }

            events.push(callback);
        } else {
            this._events[eventName] = [callback];
        }
    };

    EventDispatcher.prototype.removeEventListener = function(eventName, callback) {
        if (!this.hasEventListener(eventName)) {
            return;
        } else {
            var events = this._events[eventName],
                i = events.length,
                index;

            while (i--) {
                if (events[i] === callback) {
                    index = i;
                }
            }

            events.splice(index, 1);
        }
    };

    EventDispatcher.prototype.fireEvent = function(eventName, opt_this, opt_arg) {
        if (!this.hasEventListener(eventName)) {
            return;
        } else {
            var events     = this._events[eventName],
                copyEvents = _copyArray(events),
                arg        = _copyArray(arguments),
                length     = events.length,
                i = 0;

            // eventNameとopt_thisを削除
            arg.splice(0, 2);

            for (; i < length; i++) {
                copyEvents[i].apply(opt_this || this, arg);
            }
        }

        function _copyArray(array) {
            var newArray = [],
                i = 0;

            try {
                newArray = [].slice.call(array);
            } catch(e) {
                for (; i < array.length; i++) {
                    newArray.push(array[i]);
                }
            }

            return newArray;
        }
    };

    ns.EventDispatcher = EventDispatcher;

})(this, document, App);
(function(win, doc, $, ns) {

    "use strict";

    var instance, originalConstructor;

    function MassageList() {
        var that = this;

        _init();

        function _init() {
            ns.EventDispatcher.call(that);
        }

        this.him = [
            "hello world."
        ];
    }

    originalConstructor = MassageList.prototype.constructor;
    MassageList.prototype = new ns.EventDispatcher();
    MassageList.prototype.constructor = originalConstructor;
    originalConstructor = null;

    MassageList.getInstance = function() {
        if (!instance) {
            instance = new MassageList();
        }

        return instance;
    };

    ns.MassageList = MassageList;

})(this, document, $, App);
(function(win, doc, $, ns) {

    "use strict";

    var instance, originalConstructor;

    function MassageManager() {
        var massageList = ns.MassageList.getInstance();

        var that        = this,
            historyList = [],
            index = 0,
            LOOP_INDEX = 1;

        _init();

        function _init() {
            ns.EventDispatcher.call(that);
            receive();
        }

        function _handlePost(evt) {
            var interval = 500 + Math.random() * 1000 | 0;

            that.fireEvent("POST", evt, evt);

            if (evt.target === "mine") {
                setTimeout(function() {
                    receive();
                }, interval);
            }
        }

        function send(txt) {
            if (!txt) {
                return;
            }

            var msg = new ns.Massage(txt, true);

            msg.addEventListener("POST", _handlePost);
            historyList.push(msg);
        }

        function receive() {
            var msg = new ns.Massage(massageList.him[index], false);

            msg.addEventListener("POST", _handlePost);
            historyList.push(msg);

            if (!!massageList.him[index + 1]) {
                ++index;
            } else {
                index = massageList.him.length - LOOP_INDEX;
            }
        }

        this.send = send;
    }

    originalConstructor = MassageManager.prototype.constructor;
    MassageManager.prototype = new ns.EventDispatcher();
    MassageManager.prototype.constructor = originalConstructor;
    originalConstructor = null;

    MassageManager.getInstance = function() {
        if (!instance) {
            instance = new MassageManager();
        }

        return instance;
    };

    ns.MassageManager = MassageManager;

})(this, document, $, App);
(function(win, doc, $, ns) {

    "use strict";

    var $stage = $("#global-stage"),
        $inner = $stage.find("#global-stage-inner"),
        originalConstructor;

    function Massage(txt, isMine) {
        if (!txt) {
            return;
        }

        var that  = this,
            klass = isMine ? "invisble msg mine" : "invisble msg",
            $msg  = $('<div class="' + klass + '"><p class="txt">' + txt + '</p></div>');

        _init();

        function _init() {
            ns.EventDispatcher.call(that);

            $inner.append($msg);
            $stage.animate({scrollTop: $inner.height()}, 200);

            setTimeout(function() {
                $msg.removeClass("invisble");
                that.fireEvent("POST", that, that);
            }, 100);
        }

        that.txt    = txt;
        that.target = isMine ? "mine" : "him";
    }

    originalConstructor = Massage.prototype.constructor;
    Massage.prototype = new ns.EventDispatcher();
    Massage.prototype.constructor = originalConstructor;
    originalConstructor = null;

    ns.Massage = Massage;

})(this, document, $, App);
(function(win, doc, $, ns) {

    "use strict";

    var messageManager = ns.MassageManager.getInstance(),
        $form = $("#global-footer-form"),
        $txt  = $("#global-footer-form-txt");

    $form.on("submit", handleSubmit);

    function handleSubmit() {
        messageManager.send($txt.val(), true);

        $txt.val("");

        return false;
    }

})(this, document, $, App);
	$(function(){
	function ShowMassage(val)
	{
		$("#chat-content").append("<div>"+ val+"</div>");
		$("#global-footer-form-txt").val("");
		return false;
	}
	function HisyoSpeak()
	{

		$("#chat-content").append("<div>"+"秘書："+"</div>");
		$("#chat-content").append("<div>"+"わからない"+"</div>");
		
	}

	$('#global-footer-form-btn').click(function () {
	
	var text=$("#global-footer-form-txt").val();
	//alert(text);
	$("#chat-content").append("ユーザー:");
	ShowMassage(text);
	HisyoSpeak()
	//send(text);
	});
	return false;
});
