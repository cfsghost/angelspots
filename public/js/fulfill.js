!function(a){a.EventEmitter={_JQInit:function(){this._JQ=a(this)},emit:function(a){!this._JQ&&this._JQInit();var b=Array.prototype.slice.call(arguments);b.splice(0,1),this._JQ.trigger(a,b)},once:function(a,b){!this._JQ&&this._JQInit(),this._JQ.one(a,function(){var a=Array.prototype.slice.call(arguments);return a.splice(0,1),b.apply(this,a),!1})},on:function(a,b){!this._JQ&&this._JQInit(),this._JQ.bind(a,function(){var a=Array.prototype.slice.call(arguments);return a.splice(0,1),b.apply(this,a),!1})},off:function(a,b){!this._JQ&&this._JQInit(),this._JQ.unbind(a,b)}}}(jQuery);