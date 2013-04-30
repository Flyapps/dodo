var $hxClasses = $hxClasses || {},$estr = function() { return js.Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function inherit() {}; inherit.prototype = from; var proto = new inherit();
	for (var name in fields) proto[name] = fields[name];
	return proto;
}
var EReg = $hxClasses["EReg"] = function(r,opt) {
	opt = opt.split("u").join("");
	this.r = new RegExp(r,opt);
};
EReg.__name__ = ["EReg"];
EReg.prototype = {
	customReplace: function(s,f) {
		var buf = new StringBuf();
		while(true) {
			if(!this.match(s)) break;
			buf.b += Std.string(this.matchedLeft());
			buf.b += Std.string(f(this));
			s = this.matchedRight();
		}
		buf.b += Std.string(s);
		return buf.b;
	}
	,replace: function(s,by) {
		return s.replace(this.r,by);
	}
	,split: function(s) {
		var d = "#__delim__#";
		return s.replace(this.r,d).split(d);
	}
	,matchedPos: function() {
		if(this.r.m == null) throw "No string matched";
		return { pos : this.r.m.index, len : this.r.m[0].length};
	}
	,matchedRight: function() {
		if(this.r.m == null) throw "No string matched";
		var sz = this.r.m.index + this.r.m[0].length;
		return this.r.s.substr(sz,this.r.s.length - sz);
	}
	,matchedLeft: function() {
		if(this.r.m == null) throw "No string matched";
		return this.r.s.substr(0,this.r.m.index);
	}
	,matched: function(n) {
		return this.r.m != null && n >= 0 && n < this.r.m.length?this.r.m[n]:(function($this) {
			var $r;
			throw "EReg::matched";
			return $r;
		}(this));
	}
	,match: function(s) {
		if(this.r.global) this.r.lastIndex = 0;
		this.r.m = this.r.exec(s);
		this.r.s = s;
		return this.r.m != null;
	}
	,r: null
	,__class__: EReg
}
var HxOverrides = $hxClasses["HxOverrides"] = function() { }
HxOverrides.__name__ = ["HxOverrides"];
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10?"0" + m:"" + m) + "-" + (d < 10?"0" + d:"" + d) + " " + (h < 10?"0" + h:"" + h) + ":" + (mi < 10?"0" + mi:"" + mi) + ":" + (s < 10?"0" + s:"" + s);
}
HxOverrides.strDate = function(s) {
	switch(s.length) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d.setTime(0);
		d.setUTCHours(k[0]);
		d.setUTCMinutes(k[1]);
		d.setUTCSeconds(k[2]);
		return d;
	case 10:
		var k = s.split("-");
		return new Date(k[0],k[1] - 1,k[2],0,0,0);
	case 19:
		var k = s.split(" ");
		var y = k[0].split("-");
		var t = k[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw "Invalid date format : " + s;
	}
}
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) return undefined;
	return x;
}
HxOverrides.substr = function(s,pos,len) {
	if(pos != null && pos != 0 && len != null && len < 0) return "";
	if(len == null) len = s.length;
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) pos = 0;
	} else if(len < 0) len = s.length + len - pos;
	return s.substr(pos,len);
}
HxOverrides.remove = function(a,obj) {
	var i = 0;
	var l = a.length;
	while(i < l) {
		if(a[i] == obj) {
			a.splice(i,1);
			return true;
		}
		i++;
	}
	return false;
}
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
}
var IntIter = $hxClasses["IntIter"] = function(min,max) {
	this.min = min;
	this.max = max;
};
IntIter.__name__ = ["IntIter"];
IntIter.prototype = {
	next: function() {
		return this.min++;
	}
	,hasNext: function() {
		return this.min < this.max;
	}
	,max: null
	,min: null
	,__class__: IntIter
}
var List = $hxClasses["List"] = function() {
	this.length = 0;
};
List.__name__ = ["List"];
List.prototype = {
	map: function(f) {
		var b = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			b.add(f(v));
		}
		return b;
	}
	,filter: function(f) {
		var l2 = new List();
		var l = this.h;
		while(l != null) {
			var v = l[0];
			l = l[1];
			if(f(v)) l2.add(v);
		}
		return l2;
	}
	,join: function(sep) {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		while(l != null) {
			if(first) first = false; else s.b += Std.string(sep);
			s.b += Std.string(l[0]);
			l = l[1];
		}
		return s.b;
	}
	,toString: function() {
		var s = new StringBuf();
		var first = true;
		var l = this.h;
		s.b += Std.string("{");
		while(l != null) {
			if(first) first = false; else s.b += Std.string(", ");
			s.b += Std.string(Std.string(l[0]));
			l = l[1];
		}
		s.b += Std.string("}");
		return s.b;
	}
	,iterator: function() {
		return { h : this.h, hasNext : function() {
			return this.h != null;
		}, next : function() {
			if(this.h == null) return null;
			var x = this.h[0];
			this.h = this.h[1];
			return x;
		}};
	}
	,remove: function(v) {
		var prev = null;
		var l = this.h;
		while(l != null) {
			if(l[0] == v) {
				if(prev == null) this.h = l[1]; else prev[1] = l[1];
				if(this.q == l) this.q = prev;
				this.length--;
				return true;
			}
			prev = l;
			l = l[1];
		}
		return false;
	}
	,clear: function() {
		this.h = null;
		this.q = null;
		this.length = 0;
	}
	,isEmpty: function() {
		return this.h == null;
	}
	,pop: function() {
		if(this.h == null) return null;
		var x = this.h[0];
		this.h = this.h[1];
		if(this.h == null) this.q = null;
		this.length--;
		return x;
	}
	,last: function() {
		return this.q == null?null:this.q[0];
	}
	,first: function() {
		return this.h == null?null:this.h[0];
	}
	,push: function(item) {
		var x = [item,this.h];
		this.h = x;
		if(this.q == null) this.q = x;
		this.length++;
	}
	,add: function(item) {
		var x = [item];
		if(this.h == null) this.h = x; else this.q[1] = x;
		this.q = x;
		this.length++;
	}
	,length: null
	,q: null
	,h: null
	,__class__: List
}
var Reflect = $hxClasses["Reflect"] = function() { }
Reflect.__name__ = ["Reflect"];
Reflect.hasField = function(o,field) {
	return Object.prototype.hasOwnProperty.call(o,field);
}
Reflect.field = function(o,field) {
	var v = null;
	try {
		v = o[field];
	} catch( e ) {
	}
	return v;
}
Reflect.setField = function(o,field,value) {
	o[field] = value;
}
Reflect.getProperty = function(o,field) {
	var tmp;
	return o == null?null:o.__properties__ && (tmp = o.__properties__["get_" + field])?o[tmp]():o[field];
}
Reflect.setProperty = function(o,field,value) {
	var tmp;
	if(o.__properties__ && (tmp = o.__properties__["set_" + field])) o[tmp](value); else o[field] = value;
}
Reflect.callMethod = function(o,func,args) {
	return func.apply(o,args);
}
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(hasOwnProperty.call(o,f)) a.push(f);
		}
	}
	return a;
}
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
}
Reflect.compare = function(a,b) {
	return a == b?0:a > b?1:-1;
}
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
}
Reflect.isObject = function(v) {
	if(v == null) return false;
	var t = typeof(v);
	return t == "string" || t == "object" && !v.__enum__ || t == "function" && (v.__name__ || v.__ename__);
}
Reflect.deleteField = function(o,f) {
	if(!Reflect.hasField(o,f)) return false;
	delete(o[f]);
	return true;
}
Reflect.copy = function(o) {
	var o2 = { };
	var _g = 0, _g1 = Reflect.fields(o);
	while(_g < _g1.length) {
		var f = _g1[_g];
		++_g;
		o2[f] = Reflect.field(o,f);
	}
	return o2;
}
Reflect.makeVarArgs = function(f) {
	return function() {
		var a = Array.prototype.slice.call(arguments);
		return f(a);
	};
}
var Std = $hxClasses["Std"] = function() { }
Std.__name__ = ["Std"];
Std["is"] = function(v,t) {
	return js.Boot.__instanceof(v,t);
}
Std.string = function(s) {
	return js.Boot.__string_rec(s,"");
}
Std["int"] = function(x) {
	return x | 0;
}
Std.parseInt = function(x) {
	var v = parseInt(x,10);
	if(v == 0 && (HxOverrides.cca(x,1) == 120 || HxOverrides.cca(x,1) == 88)) v = parseInt(x);
	if(isNaN(v)) return null;
	return v;
}
Std.parseFloat = function(x) {
	return parseFloat(x);
}
Std.random = function(x) {
	return Math.floor(Math.random() * x);
}
var StringBuf = $hxClasses["StringBuf"] = function() {
	this.b = "";
};
StringBuf.__name__ = ["StringBuf"];
StringBuf.prototype = {
	toString: function() {
		return this.b;
	}
	,addSub: function(s,pos,len) {
		this.b += HxOverrides.substr(s,pos,len);
	}
	,addChar: function(c) {
		this.b += String.fromCharCode(c);
	}
	,add: function(x) {
		this.b += Std.string(x);
	}
	,b: null
	,__class__: StringBuf
}
var StringTools = $hxClasses["StringTools"] = function() { }
StringTools.__name__ = ["StringTools"];
StringTools.urlEncode = function(s) {
	return encodeURIComponent(s);
}
StringTools.urlDecode = function(s) {
	return decodeURIComponent(s.split("+").join(" "));
}
StringTools.htmlEscape = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
StringTools.htmlUnescape = function(s) {
	return s.split("&gt;").join(">").split("&lt;").join("<").split("&amp;").join("&");
}
StringTools.startsWith = function(s,start) {
	return s.length >= start.length && HxOverrides.substr(s,0,start.length) == start;
}
StringTools.endsWith = function(s,end) {
	var elen = end.length;
	var slen = s.length;
	return slen >= elen && HxOverrides.substr(s,slen - elen,elen) == end;
}
StringTools.isSpace = function(s,pos) {
	var c = HxOverrides.cca(s,pos);
	return c >= 9 && c <= 13 || c == 32;
}
StringTools.ltrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,r)) r++;
	if(r > 0) return HxOverrides.substr(s,r,l - r); else return s;
}
StringTools.rtrim = function(s) {
	var l = s.length;
	var r = 0;
	while(r < l && StringTools.isSpace(s,l - r - 1)) r++;
	if(r > 0) return HxOverrides.substr(s,0,l - r); else return s;
}
StringTools.trim = function(s) {
	return StringTools.ltrim(StringTools.rtrim(s));
}
StringTools.rpad = function(s,c,l) {
	var sl = s.length;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		s += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		s += c;
		sl += cl;
	}
	return s;
}
StringTools.lpad = function(s,c,l) {
	var ns = "";
	var sl = s.length;
	if(sl >= l) return s;
	var cl = c.length;
	while(sl < l) if(l - sl < cl) {
		ns += HxOverrides.substr(c,0,l - sl);
		sl = l;
	} else {
		ns += c;
		sl += cl;
	}
	return ns + s;
}
StringTools.replace = function(s,sub,by) {
	return s.split(sub).join(by);
}
StringTools.hex = function(n,digits) {
	var s = "";
	var hexChars = "0123456789ABCDEF";
	do {
		s = hexChars.charAt(n & 15) + s;
		n >>>= 4;
	} while(n > 0);
	if(digits != null) while(s.length < digits) s = "0" + s;
	return s;
}
StringTools.fastCodeAt = function(s,index) {
	return s.charCodeAt(index);
}
StringTools.isEOF = function(c) {
	return c != c;
}
var ValueType = $hxClasses["ValueType"] = { __ename__ : ["ValueType"], __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] }
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; }
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = $hxClasses["Type"] = function() { }
Type.__name__ = ["Type"];
Type.getClass = function(o) {
	if(o == null) return null;
	return o.__class__;
}
Type.getEnum = function(o) {
	if(o == null) return null;
	return o.__enum__;
}
Type.getSuperClass = function(c) {
	return c.__super__;
}
Type.getClassName = function(c) {
	var a = c.__name__;
	return a.join(".");
}
Type.getEnumName = function(e) {
	var a = e.__ename__;
	return a.join(".");
}
Type.resolveClass = function(name) {
	var cl = $hxClasses[name];
	if(cl == null || !cl.__name__) return null;
	return cl;
}
Type.resolveEnum = function(name) {
	var e = $hxClasses[name];
	if(e == null || !e.__ename__) return null;
	return e;
}
Type.createInstance = function(cl,args) {
	switch(args.length) {
	case 0:
		return new cl();
	case 1:
		return new cl(args[0]);
	case 2:
		return new cl(args[0],args[1]);
	case 3:
		return new cl(args[0],args[1],args[2]);
	case 4:
		return new cl(args[0],args[1],args[2],args[3]);
	case 5:
		return new cl(args[0],args[1],args[2],args[3],args[4]);
	case 6:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5]);
	case 7:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6]);
	case 8:
		return new cl(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
	default:
		throw "Too many arguments";
	}
	return null;
}
Type.createEmptyInstance = function(cl) {
	function empty() {}; empty.prototype = cl.prototype;
	return new empty();
}
Type.createEnum = function(e,constr,params) {
	var f = Reflect.field(e,constr);
	if(f == null) throw "No such constructor " + constr;
	if(Reflect.isFunction(f)) {
		if(params == null) throw "Constructor " + constr + " need parameters";
		return f.apply(e,params);
	}
	if(params != null && params.length != 0) throw "Constructor " + constr + " does not need parameters";
	return f;
}
Type.createEnumIndex = function(e,index,params) {
	var c = e.__constructs__[index];
	if(c == null) throw index + " is not a valid enum constructor index";
	return Type.createEnum(e,c,params);
}
Type.getInstanceFields = function(c) {
	var a = [];
	for(var i in c.prototype) a.push(i);
	HxOverrides.remove(a,"__class__");
	HxOverrides.remove(a,"__properties__");
	return a;
}
Type.getClassFields = function(c) {
	var a = Reflect.fields(c);
	HxOverrides.remove(a,"__name__");
	HxOverrides.remove(a,"__interfaces__");
	HxOverrides.remove(a,"__properties__");
	HxOverrides.remove(a,"__super__");
	HxOverrides.remove(a,"prototype");
	return a;
}
Type.getEnumConstructs = function(e) {
	var a = e.__constructs__;
	return a.slice();
}
Type["typeof"] = function(v) {
	switch(typeof(v)) {
	case "boolean":
		return ValueType.TBool;
	case "string":
		return ValueType.TClass(String);
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) return ValueType.TInt;
		return ValueType.TFloat;
	case "object":
		if(v == null) return ValueType.TNull;
		var e = v.__enum__;
		if(e != null) return ValueType.TEnum(e);
		var c = v.__class__;
		if(c != null) return ValueType.TClass(c);
		return ValueType.TObject;
	case "function":
		if(v.__name__ || v.__ename__) return ValueType.TObject;
		return ValueType.TFunction;
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
}
Type.enumEq = function(a,b) {
	if(a == b) return true;
	try {
		if(a[0] != b[0]) return false;
		var _g1 = 2, _g = a.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(!Type.enumEq(a[i],b[i])) return false;
		}
		var e = a.__enum__;
		if(e != b.__enum__ || e == null) return false;
	} catch( e ) {
		return false;
	}
	return true;
}
Type.enumConstructor = function(e) {
	return e[0];
}
Type.enumParameters = function(e) {
	return e.slice(2);
}
Type.enumIndex = function(e) {
	return e[1];
}
Type.allEnums = function(e) {
	var all = [];
	var cst = e.__constructs__;
	var _g = 0;
	while(_g < cst.length) {
		var c = cst[_g];
		++_g;
		var v = Reflect.field(e,c);
		if(!Reflect.isFunction(v)) all.push(v);
	}
	return all;
}
var co = co || {}
if(!co.doubleduck) co.doubleduck = {}
co.doubleduck.BaseAssets = $hxClasses["co.doubleduck.BaseAssets"] = function() {
};
co.doubleduck.BaseAssets.__name__ = ["co","doubleduck","BaseAssets"];
co.doubleduck.BaseAssets.loader = function() {
	if(co.doubleduck.BaseAssets._loader == null) {
		co.doubleduck.BaseAssets._loader = new createjs.LoadQueue(true);
		co.doubleduck.BaseAssets._loader.installPlugin(createjs.LoadQueue.SOUND);
		co.doubleduck.BaseAssets._loader.onFileLoad = co.doubleduck.BaseAssets.handleFileLoaded;
		co.doubleduck.BaseAssets._loader.onError = co.doubleduck.BaseAssets.handleLoadError;
		co.doubleduck.BaseAssets._loader.setMaxConnections(10);
	}
	return co.doubleduck.BaseAssets._loader;
}
co.doubleduck.BaseAssets.loadAndCall = function(uri,callbackFunc) {
	co.doubleduck.BaseAssets.loader().loadFile(uri);
	co.doubleduck.BaseAssets._loadCallbacks[uri] = callbackFunc;
}
co.doubleduck.BaseAssets.finishLoading = function(manifest,sounds) {
	if(co.doubleduck.SoundManager.available) {
		var _g1 = 0, _g = sounds.length;
		while(_g1 < _g) {
			var currSound = _g1++;
			manifest.push(sounds[currSound] + co.doubleduck.SoundManager.EXTENSION);
			co.doubleduck.SoundManager.initSound(sounds[currSound]);
		}
	}
	if(co.doubleduck.BaseAssets._useLocalStorage) co.doubleduck.BaseAssets.loadFromLocalStorage(manifest);
	if(manifest.length == 0) {
		if(co.doubleduck.BaseAssets.onLoadAll != null) co.doubleduck.BaseAssets.onLoadAll();
	}
	co.doubleduck.BaseAssets.loader().onProgress = co.doubleduck.BaseAssets.handleProgress;
	co.doubleduck.BaseAssets.loader().onFileLoad = co.doubleduck.BaseAssets.manifestFileLoad;
	co.doubleduck.BaseAssets.loader().loadManifest(manifest);
	co.doubleduck.BaseAssets.loader().load();
}
co.doubleduck.BaseAssets.loadAll = function(manifest,sounds) {
	manifest[manifest.length] = "images/duckling/orientation_error_port.png";
	manifest[manifest.length] = "images/duckling/orientation_error_land.png";
	manifest[manifest.length] = "images/duckling/page_marker.png";
}
co.doubleduck.BaseAssets.audioLoaded = function(event) {
	co.doubleduck.BaseAssets._cacheData[event.item.src] = event;
}
co.doubleduck.BaseAssets.manifestFileLoad = function(event) {
	if(co.doubleduck.BaseAssets._useLocalStorage && event != null) {
		var utils = new ddjsutils();
		try {
			var fileName = event.item.src;
			if(HxOverrides.substr(fileName,fileName.length - 3,null) == "jpg") return;
			co.doubleduck.BasePersistence.setValue(event.item.src,utils.getBase64Image(event.result));
		} catch( err ) {
		}
	}
}
co.doubleduck.BaseAssets.loadFromLocalStorage = function(manifest) {
	var entriesToRemove = new Array();
	var _g1 = 0, _g = manifest.length;
	while(_g1 < _g) {
		var i = _g1++;
		var entry = manifest[i];
		var value = co.doubleduck.BasePersistence.getValue(entry);
		if(value != null) {
			var bmp = new createjs.Bitmap("data:image/png;base64," + value);
			co.doubleduck.BaseAssets._cacheData[entry] = bmp.image;
			entriesToRemove.push(manifest[i]);
		}
	}
	var _g1 = 0, _g = entriesToRemove.length;
	while(_g1 < _g) {
		var j = _g1++;
		HxOverrides.remove(manifest,entriesToRemove[j]);
	}
}
co.doubleduck.BaseAssets.handleProgress = function(event) {
	co.doubleduck.BaseAssets.loaded = event.loaded;
	if(event.loaded == event.total) {
		co.doubleduck.BaseAssets.loader().onProgress = null;
		co.doubleduck.BaseAssets.onLoadAll();
	}
}
co.doubleduck.BaseAssets.handleLoadError = function(event) {
}
co.doubleduck.BaseAssets.handleFileLoaded = function(event) {
	if(event != null) {
		co.doubleduck.BaseAssets._cacheData[event.item.src] = event.result;
		var callbackFunc = Reflect.field(co.doubleduck.BaseAssets._loadCallbacks,event.item.src);
		if(callbackFunc != null) callbackFunc();
	}
}
co.doubleduck.BaseAssets.getAsset = function(uri) {
	var cache = Reflect.field(co.doubleduck.BaseAssets._cacheData,uri);
	if(cache == null) {
		if(co.doubleduck.BaseAssets.loader().getResult(uri) != null) {
			cache = co.doubleduck.BaseAssets.loader().getResult(uri);
			co.doubleduck.BaseAssets._cacheData[uri] = cache;
		}
	}
	return cache;
}
co.doubleduck.BaseAssets.getRawImage = function(uri) {
	var cache = co.doubleduck.BaseAssets.getAsset(uri);
	if(cache == null) {
		var bmp = new createjs.Bitmap(uri);
		co.doubleduck.BaseAssets._cacheData[uri] = bmp.image;
		cache = bmp.image;
		null;
	}
	return cache;
}
co.doubleduck.BaseAssets.getImage = function(uri,mouseEnabled) {
	if(mouseEnabled == null) mouseEnabled = false;
	var result = new createjs.Bitmap(co.doubleduck.BaseAssets.getRawImage(uri));
	result.mouseEnabled = mouseEnabled;
	return result;
}
co.doubleduck.BaseAssets.prototype = {
	__class__: co.doubleduck.BaseAssets
}
co.doubleduck.Assets = $hxClasses["co.doubleduck.Assets"] = function() {
	co.doubleduck.BaseAssets.call(this);
};
co.doubleduck.Assets.__name__ = ["co","doubleduck","Assets"];
co.doubleduck.Assets.loadAll = function() {
	var manifest = new Array();
	var sounds = new Array();
	sounds.push("sound/button_click");
	sounds.push("sound/buy_item");
	sounds.push("sound/coin_pickup");
	sounds.push("sound/crash");
	sounds.push("sound/enemy_bird_sound");
	sounds.push("sound/fuel");
	sounds.push("sound/health_pickup");
	sounds.push("sound/jet");
	sounds.push("sound/jewel_pickup");
	sounds.push("sound/menu_music");
	sounds.push("sound/poof");
	sounds.push("sound/session_end");
	co.doubleduck.BaseAssets.loadAll(manifest,sounds);
	manifest.push("images/splash/dodo_splash.png");
	manifest.push("images/splash/leaf1.png");
	manifest.push("images/splash/leaf2.png");
	manifest.push("images/splash/leaf3.png");
	manifest.push("images/splash/leaf4.png");
	manifest.push("images/splash/tap2play.png");
	manifest.push("images/splash/logo/flying.png");
	manifest.push("images/splash/logo/1.png");
	manifest.push("images/splash/logo/2.png");
	manifest.push("images/splash/logo/3.png");
	manifest.push("images/splash/logo/4.png");
	manifest.push("images/general/logo.png");
	manifest.push("images/menu/btn_audio.png");
	manifest.push("images/menu/btn_help.png");
	manifest.push("images/menu/btn_play.png");
	manifest.push("images/menu/btn_shop.png");
	manifest.push("images/menu/collected.png");
	manifest.push("images/menu/help.png");
	manifest.push("images/menu/new_best.png");
	manifest.push("images/menu/trophy.png");
	manifest.push("images/menu/best.png");
	manifest.push("images/general/btn_back.png");
	manifest.push("images/menu/postcards/1.png");
	manifest.push("images/menu/postcards/2.png");
	manifest.push("images/menu/postcards/3.png");
	var _g = 0;
	while(_g < 10) {
		var i = _g++;
		manifest.push("images/general/font_small/" + i + ".png");
		manifest.push("images/general/font_big/" + i + ".png");
	}
	manifest.push("images/general/font_small/comma.png");
	manifest.push("images/general/font_small/dollar.png");
	manifest.push("images/general/font_small/m.png");
	manifest.push("images/general/font_big/comma.png");
	manifest.push("images/general/font_big/dollar.png");
	manifest.push("images/general/font_big/m.png");
	manifest.push("images/shop/btn_buy.png");
	manifest.push("images/shop/btn_buy_off.png");
	manifest.push("images/shop/locked.png");
	manifest.push("images/shop/owned.png");
	manifest.push("images/shop/shop_box.png");
	manifest.push("images/shop/box_highlight.png");
	manifest.push("images/shop/total_coins.png");
	var _g = 1;
	while(_g < 10) {
		var i = _g++;
		manifest.push("images/shop/shop_goods/" + i + ".png");
		manifest.push("images/shop/shop_text/" + i + ".png");
	}
	manifest.push("images/session/sky.png");
	manifest.push("images/session/bgs/bg1a.png");
	manifest.push("images/session/bgs/bg1b.png");
	manifest.push("images/session/bgs/bg1c.png");
	manifest.push("images/session/bgs/bg1to2.png");
	manifest.push("images/session/bgs/bg2a.png");
	manifest.push("images/session/bgs/bg2b.png");
	manifest.push("images/session/bgs/bg2c.png");
	manifest.push("images/session/bgs/bg2to3.png");
	manifest.push("images/session/bgs/bg3a.png");
	manifest.push("images/session/bgs/bg3b.png");
	manifest.push("images/session/bgs/bg3c.png");
	manifest.push("images/session/dodo_tree.png");
	manifest.push("images/session/start_boom.png");
	manifest.push("images/session/dodo.png");
	manifest.push("images/session/dodo_hit.png");
	manifest.push("images/session/end_boom.png");
	manifest.push("images/session/alert_toucan.png");
	manifest.push("images/session/toucan.png");
	manifest.push("images/session/pickup_coin.png");
	manifest.push("images/session/pickup_fuel.png");
	manifest.push("images/session/pickup_jewel.png");
	manifest.push("images/session/pickup_life.png");
	manifest.push("images/session/hud/alert_fuel.png");
	manifest.push("images/session/hud/btn_pause.png");
	manifest.push("images/session/hud/fuelbar_empty.png");
	manifest.push("images/session/hud/fuelbar_fill.png");
	manifest.push("images/session/hud/life.png");
	manifest.push("images/session/best.png");
	var obstacles = co.doubleduck.DataLoader.getAllObstacles();
	var _g1 = 0, _g = obstacles.length;
	while(_g1 < _g) {
		var i = _g1++;
		manifest.push("images/session/obstacles/" + obstacles[i].name + ".png");
	}
	manifest.push("images/session/pause/btn_quit.png");
	manifest.push("images/session/pause/btn_resume.png");
	manifest.push("images/session/pause/btn_retry.png");
	manifest.push("images/session/pause/paused.png");
	co.doubleduck.BaseAssets.finishLoading(manifest,sounds);
}
co.doubleduck.Assets.__super__ = co.doubleduck.BaseAssets;
co.doubleduck.Assets.prototype = $extend(co.doubleduck.BaseAssets.prototype,{
	__class__: co.doubleduck.Assets
});
co.doubleduck.BaseGame = $hxClasses["co.doubleduck.BaseGame"] = function(stage) {
	this._waitingToStart = false;
	this._orientError = null;
	this._prevWinSize = new createjs.Rectangle(0,0,1,1);
	if(this._wantLandscape) {
		co.doubleduck.BaseGame.MAX_HEIGHT = 427;
		co.doubleduck.BaseGame.MAX_WIDTH = 915;
	} else {
		co.doubleduck.BaseGame.MAX_HEIGHT = 760;
		co.doubleduck.BaseGame.MAX_WIDTH = 427;
	}
	if(co.doubleduck.BaseGame.DEBUG) co.doubleduck.BasePersistence.clearAll();
	var isGS3Stock = /Android 4.0.4/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && /GT-I9300/.test(navigator.userAgent);
	isGS3Stock = isGS3Stock && !/Chrome/.test(navigator.userAgent);
	if(isGS3Stock) {
		window.location.href="../bin/error.html";
		return;
	}
	co.doubleduck.Persistence.initGameData();
	co.doubleduck.BaseGame._stage = stage;
	co.doubleduck.BaseGame._stage.onTick = $bind(this,this.handleStageTick);
	co.doubleduck.BaseGame._viewport = new createjs.Rectangle(0,0,1,1);
	co.doubleduck.BaseGame.hammer = new Hammer(js.Lib.document.getElementById("stageCanvas"));
	viewporter.preventPageScroll = true;
	viewporter.change($bind(this,this.handleViewportChanged));
	if(viewporter.ACTIVE) {
		viewporter.preventPageScroll = true;
		viewporter.change($bind(this,this.handleViewportChanged));
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._wantLandscape) co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_LAND_URI,$bind(this,this.waitForOrientation)); else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.ORIENT_PORT_URI,$bind(this,this.waitForOrientation));
		} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
	} else co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
};
co.doubleduck.BaseGame.__name__ = ["co","doubleduck","BaseGame"];
co.doubleduck.BaseGame._stage = null;
co.doubleduck.BaseGame.MAX_HEIGHT = null;
co.doubleduck.BaseGame.MAX_WIDTH = null;
co.doubleduck.BaseGame.hammer = null;
co.doubleduck.BaseGame.getViewport = function() {
	return co.doubleduck.BaseGame._viewport;
}
co.doubleduck.BaseGame.getScale = function() {
	return co.doubleduck.BaseGame._scale;
}
co.doubleduck.BaseGame.getStage = function() {
	return co.doubleduck.BaseGame._stage;
}
co.doubleduck.BaseGame.prototype = {
	setScale: function() {
		var fixedVal = co.doubleduck.BaseGame._viewport.width;
		var varVal = co.doubleduck.BaseGame._viewport.height;
		var idealFixed = co.doubleduck.BaseGame.MAX_WIDTH;
		var idealVar = co.doubleduck.BaseGame.MAX_HEIGHT;
		if(this._wantLandscape) {
			fixedVal = co.doubleduck.BaseGame._viewport.height;
			varVal = co.doubleduck.BaseGame._viewport.width;
			idealFixed = co.doubleduck.BaseGame.MAX_HEIGHT;
			idealVar = co.doubleduck.BaseGame.MAX_WIDTH;
		}
		var regScale = varVal / idealVar;
		if(fixedVal >= varVal) co.doubleduck.BaseGame._scale = regScale; else if(idealFixed * regScale < fixedVal) co.doubleduck.BaseGame._scale = fixedVal / idealFixed; else co.doubleduck.BaseGame._scale = regScale;
	}
	,handleViewportChanged: function() {
		if(this._wantLandscape != viewporter.isLandscape()) {
			if(this._orientError == null) {
				var err = co.doubleduck.BaseGame.ORIENT_PORT_URI;
				if(this._wantLandscape) err = co.doubleduck.BaseGame.ORIENT_LAND_URI;
				this._orientError = co.doubleduck.BaseAssets.getImage(err);
				this._orientError.regX = this._orientError.image.width / 2;
				this._orientError.regY = this._orientError.image.height / 2;
				this._orientError.x = co.doubleduck.BaseGame._viewport.height / 2;
				this._orientError.y = co.doubleduck.BaseGame._viewport.width / 2;
				co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
				co.doubleduck.BaseGame._stage.update();
			}
		} else if(this._orientError != null) {
			co.doubleduck.BaseGame._stage.removeChild(this._orientError);
			this._orientError = null;
			if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
			if(this._waitingToStart) {
				this._waitingToStart = false;
				co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOGO_URI,$bind(this,this.loadBarFill));
			}
		}
	}
	,focused: function() {
		co.doubleduck.SoundManager.unmute();
	}
	,blured: function(e) {
		co.doubleduck.SoundManager.mute();
	}
	,handleResize: function(e) {
		var isFirefox = /Firefox/.test(navigator.userAgent);
		var isAndroid = /Android/.test(navigator.userAgent);
		var screenW = js.Lib.window.innerWidth;
		var screenH = js.Lib.window.innerHeight;
		co.doubleduck.BaseGame._stage.canvas.width = screenW;
		co.doubleduck.BaseGame._stage.canvas.height = screenH;
		var shouldResize = this._wantLandscape == viewporter.isLandscape() || !viewporter.ACTIVE;
		if(shouldResize) {
			if(isFirefox) {
				screenH = Math.floor(co.doubleduck.Main.getFFHeight());
				var ffEstimate = Math.ceil((js.Lib.window.screen.height - 110) * (screenW / js.Lib.window.screen.width));
				if(!isAndroid) ffEstimate = Math.ceil((js.Lib.window.screen.height - 30) * (screenW / js.Lib.window.screen.width));
				if(ffEstimate < screenH) screenH = Math.floor(ffEstimate);
			}
			var wrongSize = screenH < screenW;
			if(this._wantLandscape) wrongSize = screenH > screenW;
			if(!viewporter.ACTIVE || !wrongSize) {
				co.doubleduck.BaseGame._viewport.width = screenW;
				co.doubleduck.BaseGame._viewport.height = screenH;
				this.setScale();
			}
			if(this._orientError != null && isFirefox) this.handleViewportChanged();
		} else if(isFirefox) this.handleViewportChanged();
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame._stage.update();
	}
	,handleBackToMenu: function() {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,handleRestart: function(properties) {
		this._session.destroy();
		co.doubleduck.BaseGame._stage.removeChild(this._session);
		this._session = null;
		this.startSession(properties);
	}
	,handleSessionEnd: function() {
	}
	,handlePlayClick: function(properties) {
		co.doubleduck.BaseGame._stage.removeChild(this._menu);
		this.startSession(properties);
		this._menu.destroy();
		this._menu = null;
	}
	,startSession: function(properties) {
		this._session = new co.doubleduck.Session(properties);
		this._session.onBackToMenu = $bind(this,this.handleBackToMenu);
		this._session.onRestart = $bind(this,this.handleRestart);
		this._session.onSessionEnd = $bind(this,this.handleSessionEnd);
		co.doubleduck.BaseGame._stage.addChild(this._session);
	}
	,showMenu: function() {
		this._menu = new co.doubleduck.Menu();
		co.doubleduck.BaseGame._stage.addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,alphaFade: function(fadeElement) {
		if(fadeElement != null && js.Boot.__instanceof(fadeElement,createjs.Bitmap)) this._fadedText = fadeElement; else if(this._fadedText == null) return;
		if(this._fadedText.alpha == 0) createjs.Tween.get(this._fadedText).to({ alpha : 1},750).call($bind(this,this.alphaFade)); else if(this._fadedText.alpha == 1) createjs.Tween.get(this._fadedText).to({ alpha : 0},1500).call($bind(this,this.alphaFade));
	}
	,showGameSplash: function() {
	}
	,splashEnded: function() {
		js.Lib.document.body.bgColor = "#000000";
		co.doubleduck.BaseGame._stage.removeChild(this._splash);
		this._splash = null;
		js.Lib.window.onresize = $bind(this,this.handleResize);
		this.handleResize(null);
		this.showGameSplash();
	}
	,handleDoneLoading: function() {
		createjs.Tween.get(this._splash).wait(200).to({ alpha : 0},800).call($bind(this,this.splashEnded));
		co.doubleduck.BaseGame._stage.removeChild(this._loadingBar);
		co.doubleduck.BaseGame._stage.removeChild(this._loadingStroke);
	}
	,updateLoading: function() {
		if(co.doubleduck.BaseAssets.loaded != 1) {
			this._loadingBar.visible = true;
			var percent = co.doubleduck.BaseAssets.loaded;
			var barMask = new createjs.Shape();
			barMask.graphics.beginFill("#00000000");
			barMask.graphics.drawRect(this._loadingBar.x - this._loadingBar.image.width / 2,this._loadingBar.y,this._loadingBar.image.width * percent | 0,this._loadingBar.image.height);
			barMask.graphics.endFill();
			this._loadingBar.mask = barMask;
			co.doubleduck.Utils.waitAndCall(this,10,$bind(this,this.updateLoading));
		}
	}
	,exitFocus: function() {
		var hidden = document.mozHidden;
		if(hidden) co.doubleduck.SoundManager.mute(false); else if(!co.doubleduck.SoundManager.getPersistedMute()) co.doubleduck.SoundManager.unmute(false);
	}
	,showSplash: function() {
		if(viewporter.ACTIVE) js.Lib.document.body.bgColor = "#00A99D"; else js.Lib.document.body.bgColor = "#D94D00";
		this._splash = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOGO_URI);
		this._splash.regX = this._splash.image.width / 2;
		this._splash.x = js.Lib.window.innerWidth / 2;
		if(this._wantLandscape) this._splash.y = 20; else this._splash.y = 90;
		co.doubleduck.BaseGame._stage.addChild(this._splash);
		this._loadingStroke = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_STROKE_URI);
		this._loadingStroke.regX = this._loadingStroke.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingStroke,0);
		this._loadingBar = co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.LOAD_FILL_URI);
		this._loadingBar.regX = this._loadingBar.image.width / 2;
		co.doubleduck.BaseGame._stage.addChildAt(this._loadingBar,1);
		this._loadingBar.x = js.Lib.window.innerWidth / 2;
		this._loadingBar.y = this._splash.y + 192;
		this._loadingStroke.x = this._loadingBar.x;
		this._loadingStroke.y = this._loadingBar.y;
		this._loadingBar.visible = false;
		this.updateLoading();
		co.doubleduck.BaseGame._stage.canvas.width = js.Lib.window.innerWidth;
		co.doubleduck.BaseGame._stage.canvas.height = js.Lib.window.innerHeight;
		co.doubleduck.BaseAssets.onLoadAll = $bind(this,this.handleDoneLoading);
		co.doubleduck.Assets.loadAll();
		document.addEventListener('mozvisibilitychange', this.exitFocus);
	}
	,waitForOrientation: function() {
		this._waitingToStart = true;
		if(this._orientError == null) {
			this._orientError = this.getErrorImage();
			this._orientError.regX = this._orientError.image.width / 2;
			this._orientError.regY = this._orientError.image.height / 2;
			this._orientError.x = js.Lib.window.innerWidth / 2;
			this._orientError.y = js.Lib.window.innerHeight / 2;
			co.doubleduck.BaseGame._stage.addChildAt(this._orientError,co.doubleduck.BaseGame._stage.getNumChildren());
		}
	}
	,getErrorImage: function() {
		if(this._wantLandscape) return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_LAND_URI); else return co.doubleduck.BaseAssets.getImage(co.doubleduck.BaseGame.ORIENT_PORT_URI);
	}
	,loadBarStroke: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_STROKE_URI,$bind(this,this.showSplash));
	}
	,loadBarFill: function() {
		co.doubleduck.BaseAssets.loadAndCall(co.doubleduck.BaseGame.LOAD_FILL_URI,$bind(this,this.loadBarStroke));
	}
	,handleStageTick: function() {
		if(js.Lib.window.innerWidth != this._prevWinSize.width || js.Lib.window.innerHeight != this._prevWinSize.height) {
			this._prevWinSize.width = js.Lib.window.innerWidth;
			this._prevWinSize.height = js.Lib.window.innerHeight;
			this.handleResize(null);
		}
	}
	,_prevWinSize: null
	,_fadedText: null
	,_loadingStroke: null
	,_loadingBar: null
	,_waitingToStart: null
	,_orientError: null
	,_wantLandscape: null
	,_session: null
	,_menu: null
	,_splash: null
	,__class__: co.doubleduck.BaseGame
}
co.doubleduck.BaseMenu = $hxClasses["co.doubleduck.BaseMenu"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseMenu.__name__ = ["co","doubleduck","BaseMenu"];
co.doubleduck.BaseMenu.__super__ = createjs.Container;
co.doubleduck.BaseMenu.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		this.onPlayClick = null;
	}
	,onPlayClick: null
	,__class__: co.doubleduck.BaseMenu
});
co.doubleduck.BasePersistence = $hxClasses["co.doubleduck.BasePersistence"] = function() { }
co.doubleduck.BasePersistence.__name__ = ["co","doubleduck","BasePersistence"];
co.doubleduck.BasePersistence.localStorageSupported = function() {
	var result = null;
	try {
		localStorage.setItem("test","test");
		localStorage.removeItem("test");
		result = true;
	} catch( e ) {
		result = false;
	}
	return result;
}
co.doubleduck.BasePersistence.getValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return "0";
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.clearAll = function() {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage.clear();
}
co.doubleduck.BasePersistence.initVar = function(initedVar,defaultVal) {
	if(defaultVal == null) defaultVal = "0";
	var value = co.doubleduck.BasePersistence.getValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.getDynamicValue = function(key) {
	if(!co.doubleduck.BasePersistence.available) return { };
	var val = localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key];
	return val;
}
co.doubleduck.BasePersistence.setDynamicValue = function(key,value) {
	if(!co.doubleduck.BasePersistence.available) return;
	localStorage[co.doubleduck.BasePersistence.GAME_PREFIX + key] = value;
}
co.doubleduck.BasePersistence.initDynamicVar = function(initedVar,defaultVal) {
	var value = co.doubleduck.BasePersistence.getDynamicValue(initedVar);
	if(value == null) try {
		co.doubleduck.BasePersistence.setDynamicValue(initedVar,defaultVal);
	} catch( e ) {
		co.doubleduck.BasePersistence.available = false;
	}
}
co.doubleduck.BasePersistence.printAll = function() {
	var ls = localStorage;
	var localStorageLength = ls.length;
	var _g = 0;
	while(_g < localStorageLength) {
		var entry = _g++;
		null;
	}
}
co.doubleduck.BaseSession = $hxClasses["co.doubleduck.BaseSession"] = function() {
	createjs.Container.call(this);
};
co.doubleduck.BaseSession.__name__ = ["co","doubleduck","BaseSession"];
co.doubleduck.BaseSession.__super__ = createjs.Container;
co.doubleduck.BaseSession.prototype = $extend(createjs.Container.prototype,{
	destroy: function() {
		createjs.Ticker.removeListener(this);
		this.onRestart = null;
		this.onBackToMenu = null;
		this.onSessionEnd = null;
		this.onNextLevel = null;
	}
	,sessionEnded: function() {
		if(this.onSessionEnd != null) {
			createjs.Ticker.setPaused(false);
			this.onSessionEnd();
		}
	}
	,handleReplayClick: function(properties) {
		if(this.onRestart != null) {
			createjs.Ticker.setPaused(false);
			this.onRestart(properties);
		}
	}
	,handleMenuClick: function() {
		if(this.onBackToMenu != null) {
			createjs.Ticker.setPaused(false);
			this.onBackToMenu();
		}
	}
	,_replayBtn: null
	,_menuBtn: null
	,onNextLevel: null
	,onBackToMenu: null
	,onSessionEnd: null
	,onRestart: null
	,__class__: co.doubleduck.BaseSession
});
co.doubleduck.LabeledContainer = $hxClasses["co.doubleduck.LabeledContainer"] = function(bmp) {
	createjs.Container.call(this);
	this._bitmap = bmp;
	if(this._bitmap != null) {
		if(js.Boot.__instanceof(this._bitmap,createjs.Bitmap)) {
			this._bmp = this._bitmap;
			this.image = this._bmp.image;
		} else if(js.Boot.__instanceof(this._bitmap,createjs.BitmapAnimation)) {
			this.anim = this._bitmap;
			this.image = { width : this.anim.spriteSheet._frameWidth, height : this.anim.spriteSheet._frameHeight};
		}
	}
};
co.doubleduck.LabeledContainer.__name__ = ["co","doubleduck","LabeledContainer"];
co.doubleduck.LabeledContainer.__super__ = createjs.Container;
co.doubleduck.LabeledContainer.prototype = $extend(createjs.Container.prototype,{
	getLabel: function() {
		return this._label;
	}
	,addBitmap: function() {
		this.addChild(this._bitmap);
	}
	,addCenteredBitmap: function() {
		this._bitmap.regX = this.image.width / 2;
		this._bitmap.regY = this.image.height / 2;
		this._bitmap.x = this.image.width / 2;
		this._bitmap.y = this.image.height / 2;
		this.addChild(this._bitmap);
	}
	,addBitmapLabel: function(label,fontType,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(fontType == null) fontType = "";
		if(this._bitmapText != null) this.removeChild(this._bitmapText);
		var fontHelper = new co.doubleduck.FontHelper(fontType);
		this._bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding,centered);
		if(this.image != null) {
			this._bitmapText.x = this.image.width / 2;
			this._bitmapText.y = this.image.height / 2;
		}
		this._label = label;
		this.addChild(this._bitmapText);
	}
	,scaleBitmapFont: function(scale) {
		this._bitmapText.scaleX = this._bitmapText.scaleY = scale;
	}
	,shiftLabel: function(shiftX,shiftY) {
		this._bitmapText.x *= shiftX;
		this._bitmapText.y *= shiftY;
	}
	,setBitmapLabelY: function(ly) {
		this._bitmapText.y = ly;
	}
	,setBitmapLabelX: function(lx) {
		this._bitmapText.x = lx;
	}
	,getBitmapLabelWidth: function() {
		var maxWidth = 0;
		var _g1 = 0, _g = this._bitmapText.getNumChildren();
		while(_g1 < _g) {
			var digit = _g1++;
			var currentDigit = js.Boot.__cast(this._bitmapText.getChildAt(digit) , createjs.Bitmap);
			var endsAt = currentDigit.x + currentDigit.image.width;
			if(endsAt > maxWidth) maxWidth = endsAt;
		}
		return maxWidth;
	}
	,setLabelY: function(ly) {
		this._text.y = ly;
	}
	,setLabelX: function(lx) {
		this._text.x = lx;
	}
	,addLabel: function(label,color) {
		if(color == null) color = "#000000";
		if(this._text != null) this.removeChild(this._text);
		this._label = label;
		this._text = new createjs.Text(label,"bold 22px Arial",color);
		this._text.regY = this._text.getMeasuredHeight() / 2;
		this._text.textAlign = "center";
		if(this._bitmap != null) {
			this._text.x = this._bitmap.x;
			this._text.y = this._bitmap.y;
		}
		this.addChild(this._text);
	}
	,changeText: function(txt) {
	}
	,_bitmapText: null
	,_text: null
	,_bmp: null
	,_bitmap: null
	,_label: null
	,anim: null
	,image: null
	,__class__: co.doubleduck.LabeledContainer
});
co.doubleduck.Button = $hxClasses["co.doubleduck.Button"] = function(bmp,pauseAffected,clickType,clickSound) {
	if(clickType == null) clickType = 2;
	if(pauseAffected == null) pauseAffected = true;
	this._lastClickTime = 0;
	co.doubleduck.LabeledContainer.call(this,bmp);
	if(clickSound == null && co.doubleduck.Button._defaultSound != null) this._clickSound = co.doubleduck.Button._defaultSound; else this._clickSound = clickSound;
	this._bitmap.mouseEnabled = true;
	this._clickType = clickType;
	this._pauseAffected = pauseAffected;
	if(clickType == co.doubleduck.Button.CLICK_TYPE_TOGGLE) {
		var initObject = { };
		var size = this.image.width / 2;
		initObject.images = [this.image];
		initObject.frames = { width : size, height : this.image.height, regX : size / 2, regY : this.image.height / 2};
		this._states = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
		this._states.gotoAndStop(0);
		this.onClick = $bind(this,this.handleToggle);
		this.addChild(this._states);
	} else this.addCenteredBitmap();
	this.onPress = $bind(this,this.handlePress);
};
co.doubleduck.Button.__name__ = ["co","doubleduck","Button"];
co.doubleduck.Button.setDefaultSound = function(sound) {
	co.doubleduck.Button._defaultSound = sound;
}
co.doubleduck.Button.__super__ = co.doubleduck.LabeledContainer;
co.doubleduck.Button.prototype = $extend(co.doubleduck.LabeledContainer.prototype,{
	handleEndPressTint: function() {
		co.doubleduck.Utils.tintBitmap(this._bmp,1,1,1,1);
		if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
	}
	,setToggle: function(flag) {
		if(flag) this._states.gotoAndStop(0); else this._states.gotoAndStop(1);
	}
	,handleToggle: function(e) {
		if(this.onToggle == null) return;
		if(this._lastClickPos == null) this._lastClickPos = new createjs.Point(0,0);
		if((this._lastClickPos.x < e.stageX + 1 || this._lastClickPos.x > e.stageX + 1) && (this._lastClickPos.y < e.stageY + 1 || this._lastClickPos.y > e.stageY + 1)) {
			var now = createjs.Ticker.getTime(true);
			if(now < this._lastClickTime + 500) return;
		}
		this._lastClickPos.x = e.stageX;
		this._lastClickPos.y = e.stageY;
		this._lastClickTime = createjs.Ticker.getTime(true);
		this._states.gotoAndStop(1 - this._states.currentFrame);
		this.onToggle();
	}
	,handlePress: function(event) {
		if(createjs.Ticker.getPaused() && this._pauseAffected) return;
		if(this._clickType == co.doubleduck.Button.CLICK_TYPE_HOLD) {
			if(this.onHoldStart != null) {
				this.onHoldStart();
				event.onMouseUp = this.onHoldFinish;
			}
		}
		if(this.onClick != null) {
			if(this._clickSound != null) co.doubleduck.SoundManager.playEffect(this._clickSound);
			switch(this._clickType) {
			case co.doubleduck.Button.CLICK_TYPE_TINT:
				if(this._bmp != null) {
					co.doubleduck.Utils.tintBitmap(this._bmp,0.55,0.55,0.55,1);
					var tween = createjs.Tween.get(this._bmp);
					tween.ignoreGlobalPause = true;
					tween.wait(200).call($bind(this,this.handleEndPressTint));
					if(createjs.Ticker.getPaused()) co.doubleduck.BaseGame.getStage().update();
				}
				break;
			case co.doubleduck.Button.CLICK_TYPE_JUICY:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.25;
				this._bitmap.scaleY = startScaleY * 0.75;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},500,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_SCALE:
				this._juiceTween = createjs.Tween.get(this._bitmap);
				this._juiceTween.ignoreGlobalPause = true;
				var startScaleX = this._bitmap.scaleX;
				var startScaleY = this._bitmap.scaleY;
				this._bitmap.scaleX = startScaleX * 1.18;
				this._bitmap.scaleY = startScaleY * 1.18;
				this._juiceTween.to({ scaleX : startScaleX, scaleY : startScaleY},200,createjs.Ease.elasticOut);
				break;
			case co.doubleduck.Button.CLICK_TYPE_TOGGLE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_NONE:
				break;
			case co.doubleduck.Button.CLICK_TYPE_HOLD:
				throw "Use onHoldStart with CLICK_TYPE_HOLD, not onClick";
				break;
			}
		}
	}
	,setNoSound: function() {
		this._clickSound = null;
	}
	,_lastClickPos: null
	,_lastClickTime: null
	,_clickSound: null
	,_juiceTween: null
	,_clickType: null
	,_pauseAffected: null
	,_states: null
	,onHoldFinish: null
	,onHoldStart: null
	,onToggle: null
	,__class__: co.doubleduck.Button
});
co.doubleduck.Collectable = $hxClasses["co.doubleduck.Collectable"] = function(type) {
	this._isCollected = false;
	this._type = type;
	var uri = "images/session/pickup_" + type[0].toLowerCase() + ".png";
	var img = co.doubleduck.BaseAssets.getRawImage(uri);
	createjs.Bitmap.call(this,img);
	this._hitbox = new createjs.Rectangle(0,0,img.width * co.doubleduck.BaseGame.getScale(),img.height * co.doubleduck.BaseGame.getScale());
};
co.doubleduck.Collectable.__name__ = ["co","doubleduck","Collectable"];
co.doubleduck.Collectable.onGetFuel = null;
co.doubleduck.Collectable.onGetCoins = null;
co.doubleduck.Collectable.onGetLife = null;
co.doubleduck.Collectable.__super__ = createjs.Bitmap;
co.doubleduck.Collectable.prototype = $extend(createjs.Bitmap.prototype,{
	getType: function() {
		return this._type;
	}
	,collect: function() {
		if(this._isCollected) return;
		this._isCollected = true;
		switch( (this._type)[1] ) {
		case 0:
			if(co.doubleduck.Collectable.onGetFuel != null) {
				co.doubleduck.SoundManager.playEffect("sound/fuel");
				co.doubleduck.Collectable.onGetFuel(this);
			}
			break;
		case 1:
			if(co.doubleduck.Collectable.onGetCoins != null) {
				co.doubleduck.SoundManager.playEffect("sound/coin_pickup");
				co.doubleduck.Collectable.onGetCoins(this,1);
			}
			break;
		case 2:
			if(co.doubleduck.Collectable.onGetCoins != null) {
				co.doubleduck.SoundManager.playEffect("sound/jewel_pickup");
				co.doubleduck.Collectable.onGetCoins(this,10);
			}
			break;
		case 3:
			if(co.doubleduck.Collectable.onGetLife != null) {
				co.doubleduck.SoundManager.playEffect("sound/health_pickup");
				co.doubleduck.Collectable.onGetLife(this);
			}
			break;
		default:
		}
	}
	,getBoundingRect: function() {
		var result = this._hitbox.clone();
		result.x += this.x;
		result.y += this.y;
		return result;
	}
	,_isCollected: null
	,_hitbox: null
	,_type: null
	,__class__: co.doubleduck.Collectable
});
co.doubleduck.CollectableType = $hxClasses["co.doubleduck.CollectableType"] = { __ename__ : ["co","doubleduck","CollectableType"], __constructs__ : ["FUEL","COIN","JEWEL","LIFE"] }
co.doubleduck.CollectableType.FUEL = ["FUEL",0];
co.doubleduck.CollectableType.FUEL.toString = $estr;
co.doubleduck.CollectableType.FUEL.__enum__ = co.doubleduck.CollectableType;
co.doubleduck.CollectableType.COIN = ["COIN",1];
co.doubleduck.CollectableType.COIN.toString = $estr;
co.doubleduck.CollectableType.COIN.__enum__ = co.doubleduck.CollectableType;
co.doubleduck.CollectableType.JEWEL = ["JEWEL",2];
co.doubleduck.CollectableType.JEWEL.toString = $estr;
co.doubleduck.CollectableType.JEWEL.__enum__ = co.doubleduck.CollectableType;
co.doubleduck.CollectableType.LIFE = ["LIFE",3];
co.doubleduck.CollectableType.LIFE.toString = $estr;
co.doubleduck.CollectableType.LIFE.__enum__ = co.doubleduck.CollectableType;
co.doubleduck.DataLoader = $hxClasses["co.doubleduck.DataLoader"] = function() { }
co.doubleduck.DataLoader.__name__ = ["co","doubleduck","DataLoader"];
co.doubleduck.DataLoader._gameplayData = null;
co.doubleduck.DataLoader.getAllObstacles = function() {
	return co.doubleduck.DataLoader.getGameplayData().obstacles;
}
co.doubleduck.DataLoader.getObstacleById = function(id) {
	var allObst = co.doubleduck.DataLoader.getAllObstacles();
	var _g1 = 0, _g = allObst.length;
	while(_g1 < _g) {
		var currObstIndex = _g1++;
		var obstacle = allObst[currObstIndex];
		if((obstacle.id | 0) == id) return obstacle;
	}
	return null;
}
co.doubleduck.DataLoader.getObstacleIdsByArea = function(area) {
	var areas = co.doubleduck.DataLoader.getGameplayData().obstacleAreas;
	var _g1 = 0, _g = areas.length;
	while(_g1 < _g) {
		var currAreaIndex = _g1++;
		var currArea = areas[currAreaIndex];
		if(currArea.area == area[0].toLowerCase()) return currArea.ids;
	}
	return null;
}
co.doubleduck.DataLoader.getShopItems = function() {
	return co.doubleduck.DataLoader.getGameplayData().shopItems;
}
co.doubleduck.DataLoader.getGameplayData = function() {
	if(co.doubleduck.DataLoader._gameplayData == null) {
		co.doubleduck.DataLoader._gameplayData = new GameplayDB();
		co.doubleduck.DataLoader._gameplayData = co.doubleduck.DataLoader._gameplayData.getGameplayData();
	}
	return co.doubleduck.DataLoader._gameplayData;
}
co.doubleduck.Dodo = $hxClasses["co.doubleduck.Dodo"] = function() {
	this._hasExploded = false;
	this._isJetOn = false;
	this._isGravityOn = false;
	createjs.Container.call(this);
	this._isDead = false;
	this._dodoData = co.doubleduck.Persistence.getDodoData();
	co.doubleduck.Dodo.JET_NAMES = Type.getEnumConstructs(co.doubleduck.JetType);
	this._jetType = Type.createEnumIndex(co.doubleduck.JetType,this._dodoData.jetLevel | 0);
	this.x = co.doubleduck.BaseGame.getViewport().width - 550 * co.doubleduck.BaseGame.getScale();
	if(this.x <= 10) this.x = 23 * co.doubleduck.BaseGame.getScale();
	this.scaleX = this.scaleY = co.doubleduck.BaseGame.getScale();
	var bmp = co.doubleduck.BaseAssets.getImage("images/session/dodo.png");
	var initObject = { };
	initObject.images = [bmp.image];
	initObject.frames = { width : 95, height : 100, regX : 47.5, regY : 35};
	initObject.animations = { };
	var _g1 = 0, _g = co.doubleduck.Dodo.JET_NAMES.length;
	while(_g1 < _g) {
		var i = _g1++;
		var jetI = 5 * i;
		initObject.animations[co.doubleduck.Dodo.JET_NAMES[i] + "_dead"] = { frames : [jetI], frequency : 1};
		initObject.animations[co.doubleduck.Dodo.JET_NAMES[i] + "_off"] = { frames : [jetI + 1,jetI + 2], frequency : 2};
		initObject.animations[co.doubleduck.Dodo.JET_NAMES[i] + "_on"] = { frames : [jetI + 3,jetI + 4], frequency : 2};
	}
	this._dodoBody = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
	this.addChild(this._dodoBody);
	var img = co.doubleduck.BaseAssets.getRawImage("images/session/end_boom.png");
	initObject = { };
	initObject.images = [img];
	initObject.frames = { width : img.width / 6, height : img.height, regX : img.width / 12, regY : img.height / 2};
	initObject.animations = { };
	initObject.animations.explode = { frames : [0,1,2,3,4,5], frequency : 3, next : null};
	this._deathExplosion = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
	this._deathExplosion.y -= 20;
	this._deathExplosion.visible = false;
	this.addChild(this._deathExplosion);
	img = co.doubleduck.BaseAssets.getRawImage("images/session/dodo_hit.png");
	initObject = { };
	initObject.images = [img];
	initObject.frames = { width : img.width / 5, height : img.height, regX : img.width / 10, regY : img.height / 2};
	initObject.animations = { };
	initObject.animations.hit_anim = { frames : [0,1,2,3,4], frequency : 2, next : null};
	this._hitAnim = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
	this.addChild(this._hitAnim);
	co.doubleduck.Dodo.DODO_PADDING = 40 * co.doubleduck.BaseGame.getScale();
	this._playerSpeed = 0;
	this.onTick = $bind(this,this.handleTick);
	this._hitbox = new createjs.Rectangle(co.doubleduck.Dodo.HITBOX_X_OFFSET,co.doubleduck.Dodo.HITBOX_Y_OFFSET,co.doubleduck.Dodo.HITBOX_WIDTH,co.doubleduck.Dodo.HITBOX_HEIGHT);
	this._collectbox = new createjs.Rectangle(co.doubleduck.Dodo.HITBOX_X_OFFSET - 30,co.doubleduck.Dodo.HITBOX_Y_OFFSET,co.doubleduck.Dodo.HITBOX_WIDTH + 30,co.doubleduck.Dodo.HITBOX_HEIGHT);
	this._lastCollisionTime = 0;
};
co.doubleduck.Dodo.__name__ = ["co","doubleduck","Dodo"];
co.doubleduck.Dodo.JET_NAMES = null;
co.doubleduck.Dodo.__super__ = createjs.Container;
co.doubleduck.Dodo.prototype = $extend(createjs.Container.prototype,{
	handleExploionEnd: function() {
		this._deathExplosion.onAnimationEnd = null;
		this._deathExplosion.stop();
		this._deathExplosion.visible = false;
		co.doubleduck.SoundManager.playEffect("sound/session_end");
	}
	,handleTick: function(elapsd) {
		if(!this._isDead) {
			if(this._isJetOn) {
				if(this._dodoBody.currentAnimation != this._jetType[0] + "_on") this._dodoBody.gotoAndPlay(this._jetType[0] + "_on");
				if(this._thrustTimer != null) this._playerSpeed += co.doubleduck.Dodo.JET_THRUST * (elapsd / 20); else this._playerSpeed += co.doubleduck.Dodo.JET_POWER * (elapsd / 20);
			} else if(this._dodoBody.currentAnimation != this._jetType[0] + "_off") this._dodoBody.gotoAndPlay(this._jetType[0] + "_off");
		}
		if(this._isGravityOn) this._playerSpeed += co.doubleduck.Dodo.GRAVITY * (elapsd / 20);
		if(this._playerSpeed > co.doubleduck.Dodo.MAX_SPEED) this._playerSpeed = co.doubleduck.Dodo.MAX_SPEED; else if(this._playerSpeed < -co.doubleduck.Dodo.MAX_SPEED) this._playerSpeed = -co.doubleduck.Dodo.MAX_SPEED;
		this.y += this._playerSpeed * (elapsd / 20) * co.doubleduck.BaseGame.getScale();
		if(this.y < co.doubleduck.Dodo.DODO_PADDING) {
			this.y = co.doubleduck.Dodo.DODO_PADDING;
			if(this._playerSpeed < 0 && !this._isJetOn) this._playerSpeed = this._playerSpeed * -0.1; else this._playerSpeed = 0;
		} else if(this.y > co.doubleduck.BaseGame.getViewport().height - co.doubleduck.Dodo.DODO_PADDING) {
			this.y = co.doubleduck.BaseGame.getViewport().height - co.doubleduck.Dodo.DODO_PADDING;
			if(this._isDead && !this._hasExploded) {
				this._hasExploded = true;
				createjs.Tween.removeTweens(this);
				this._dodoBody.visible = false;
				this._deathExplosion.visible = true;
				this._deathExplosion.onAnimationEnd = $bind(this,this.handleExploionEnd);
				this._deathExplosion.gotoAndPlay("explode");
				co.doubleduck.SoundManager.playEffect("sound/poof");
			} else this._playerSpeed = 0;
		}
	}
	,endThrust: function() {
		if(this._thrustTimer != null) {
			this._thrustTimer.pause();
			this._thrustTimer = null;
		}
	}
	,handleHitAnimEnd: function() {
		this._hitAnim.onAnimationEnd = null;
		createjs.Tween.removeTweens(this._hitAnim);
		this._hitAnim.stop();
		this._hitAnim.visible = false;
	}
	,hitAnimate: function(withDodoFade) {
		co.doubleduck.SoundManager.playEffect("sound/crash");
		if(withDodoFade) {
			createjs.Tween.removeTweens(this._dodoBody);
			var tween = createjs.Tween.get(this._dodoBody);
			var delta = co.doubleduck.Dodo.HIT_COLLISION_COOLDOWN / 6;
			var _g = 0;
			while(_g < 3) {
				var i = _g++;
				tween = tween.to({ alpha : 0.25},delta).to({ alpha : 1},delta);
			}
		}
		this._hitAnim.visible = true;
		this._hitAnim.x = 0;
		createjs.Tween.get(this._hitAnim).to({ x : -80},300);
		this._hitAnim.gotoAndPlay("hit_anim");
		this._hitAnim.onAnimationEnd = $bind(this,this.handleHitAnimEnd);
	}
	,hasExploded: function() {
		return this._hasExploded;
	}
	,isCollidable: function() {
		var now = createjs.Ticker.getTime(true);
		return now >= this._lastCollisionTime + co.doubleduck.Dodo.HIT_COLLISION_COOLDOWN;
	}
	,takeHit: function() {
		if(!this.isCollidable()) return;
		this._lastCollisionTime = createjs.Ticker.getTime(true);
		this.hitAnimate(true);
	}
	,die: function(explode) {
		if(explode == null) explode = false;
		if(this._isDead) return;
		this._isDead = true;
		if(explode) this.hitAnimate(false);
		this._dodoBody.gotoAndStop(this._jetType[0] + "_dead");
	}
	,getBoundingRect: function(isCollect) {
		if(isCollect == null) isCollect = false;
		var result;
		if(isCollect) result = this._collectbox.clone(); else result = this._hitbox.clone();
		result.x *= co.doubleduck.BaseGame.getScale();
		result.y *= co.doubleduck.BaseGame.getScale();
		result.width *= co.doubleduck.BaseGame.getScale();
		result.height *= co.doubleduck.BaseGame.getScale();
		result.x += this.x;
		result.y += this.y;
		return result;
	}
	,addHitboxDebug: function() {
		var rect = new createjs.Shape();
		rect.graphics.beginFill("#FF0000");
		rect.graphics.drawRect(this._hitbox.x,this._hitbox.y,this._hitbox.width,this._hitbox.height);
		rect.graphics.endFill();
		rect.alpha = 0.3;
		this.addChild(rect);
	}
	,applyGravity: function() {
		this._isGravityOn = true;
	}
	,toggleJetpack: function(isOn) {
		if(this._isDead) return;
		if(this._isJetOn != isOn) {
			this._isJetOn = isOn;
			if(this._isJetOn) {
				this._thrustTimer = new createjs.Tween();
				this._thrustTimer.wait(co.doubleduck.Dodo.THRUST_DURATION).call($bind(this,this.endThrust));
				this._jetSound = co.doubleduck.SoundManager.playEffect("sound/jet");
				if(this._playerSpeed > 0) this._playerSpeed *= 0.75;
			} else {
				if(this._jetSound != null) {
					this._jetSound.stop();
					this._jetSound = null;
				}
				if(this._thrustTimer != null) {
					this._thrustTimer.pause();
					this._thrustTimer = null;
				}
			}
		}
	}
	,_jetSound: null
	,_hasExploded: null
	,_isDead: null
	,_lastCollisionTime: null
	,_collectbox: null
	,_hitbox: null
	,_jetType: null
	,_thrustTimer: null
	,_playerSpeed: null
	,_dodoData: null
	,_isJetOn: null
	,_isGravityOn: null
	,_deathExplosion: null
	,_hitAnim: null
	,_dodoBody: null
	,__class__: co.doubleduck.Dodo
});
co.doubleduck.JetType = $hxClasses["co.doubleduck.JetType"] = { __ename__ : ["co","doubleduck","JetType"], __constructs__ : ["INITIAL","SMALL","LARGE","ROCKET"] }
co.doubleduck.JetType.INITIAL = ["INITIAL",0];
co.doubleduck.JetType.INITIAL.toString = $estr;
co.doubleduck.JetType.INITIAL.__enum__ = co.doubleduck.JetType;
co.doubleduck.JetType.SMALL = ["SMALL",1];
co.doubleduck.JetType.SMALL.toString = $estr;
co.doubleduck.JetType.SMALL.__enum__ = co.doubleduck.JetType;
co.doubleduck.JetType.LARGE = ["LARGE",2];
co.doubleduck.JetType.LARGE.toString = $estr;
co.doubleduck.JetType.LARGE.__enum__ = co.doubleduck.JetType;
co.doubleduck.JetType.ROCKET = ["ROCKET",3];
co.doubleduck.JetType.ROCKET.toString = $estr;
co.doubleduck.JetType.ROCKET.__enum__ = co.doubleduck.JetType;
co.doubleduck.FontHelper = $hxClasses["co.doubleduck.FontHelper"] = function(type) {
	this._fontType = type;
};
co.doubleduck.FontHelper.__name__ = ["co","doubleduck","FontHelper"];
co.doubleduck.FontHelper.prototype = {
	getNumber: function(num,scale,forceContainer,dims,padding,centered) {
		if(centered == null) centered = true;
		if(padding == null) padding = 0;
		if(forceContainer == null) forceContainer = false;
		if(scale == null) scale = 1;
		if(num >= 0 && num < 10) {
			var result = new createjs.Container();
			var bmp = this.getDigit(num);
			bmp.scaleX = bmp.scaleY = scale;
			result.addChild(bmp);
			if(centered) {
				result.regX = bmp.image.width / 2;
				result.regY = bmp.image.height / 2;
			}
			if(forceContainer) {
				if(dims != null) {
					dims.width = bmp.image.width;
					dims.height = bmp.image.height;
				}
				return result;
			} else return bmp;
		} else {
			var result = new createjs.Container();
			var numString = "" + num;
			var digits = new Array();
			var totalWidth = 0;
			digits[digits.length] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,0,1)));
			digits[0].scaleX = digits[0].scaleY = scale;
			result.addChild(digits[0]);
			totalWidth += digits[0].image.width * scale;
			if(numString.length == 4 || numString.length == 7) {
				this._lastComma = this.getComma();
				this._lastComma.scaleX = this._lastComma.scaleY = scale;
				this._lastComma.x = digits[0].x + digits[0].image.width + padding;
				result.addChild(this._lastComma);
				totalWidth += this._lastComma.image.width * scale;
			}
			var _g1 = 1, _g = numString.length;
			while(_g1 < _g) {
				var i = _g1++;
				var index = digits.length;
				digits[index] = this.getDigit(Std.parseInt(HxOverrides.substr(numString,i,1)));
				if(numString.length - i == 3 || numString.length - i == 6) digits[index].x = this._lastComma.x + this._lastComma.image.width + padding; else digits[index].x = digits[index - 1].x + digits[index - 1].image.width + padding;
				digits[index].scaleX = digits[index].scaleY = scale;
				result.addChild(digits[index]);
				totalWidth += digits[index].image.width * scale + padding;
				if(numString.length - i == 4 || numString.length - i == 7) {
					this._lastComma = this.getComma();
					this._lastComma.scaleX = this._lastComma.scaleY = scale;
					this._lastComma.x = digits[index].x + digits[index].image.width + padding;
					result.addChild(this._lastComma);
					totalWidth += this._lastComma.image.width * scale + padding;
				}
			}
			if(centered) {
				result.regX = totalWidth / 2;
				result.regY = digits[0].image.height / 2;
			}
			if(dims != null) {
				dims.width = totalWidth;
				dims.height = digits[0].image.height;
			}
			return result;
		}
	}
	,getDigit: function(digit) {
		var digit1 = co.doubleduck.BaseAssets.getImage(this._fontType + digit + ".png");
		return digit1;
	}
	,getComma: function() {
		return co.doubleduck.BaseAssets.getImage(this._fontType + "comma.png");
	}
	,_fontType: null
	,_lastComma: null
	,__class__: co.doubleduck.FontHelper
}
co.doubleduck.Game = $hxClasses["co.doubleduck.Game"] = function(stage) {
	this._wantLandscape = true;
	co.doubleduck.BaseGame.call(this,stage);
	co.doubleduck.Button.setDefaultSound("sound/button_click");
};
co.doubleduck.Game.__name__ = ["co","doubleduck","Game"];
co.doubleduck.Game.__super__ = co.doubleduck.BaseGame;
co.doubleduck.Game.prototype = $extend(co.doubleduck.BaseGame.prototype,{
	handleBackToMenu: function() {
		this._session.destroy();
		co.doubleduck.BaseGame.getStage().removeChild(this._session);
		var properties = null;
		if(this._session.isSessionEnded()) {
			properties = { };
			properties.distance = this._session.getDistance();
			properties.coins = this._session.getCoins();
			properties.postcard = this._session.getTypeForPostcard()[1];
		}
		this._session = null;
		this._menu = new co.doubleduck.Menu(properties);
		co.doubleduck.BaseGame.getStage().addChildAt(this._menu,0);
		this._menu.onPlayClick = $bind(this,this.handlePlayClick);
	}
	,handleRemoveSplash: function() {
		co.doubleduck.BaseGame._stage.removeChild(this._splashScreen);
		this._splashScreen = null;
	}
	,handleAddMenu: function() {
		this.showMenu();
	}
	,showGameSplash: function() {
		this._splashScreen = new co.doubleduck.Splash();
		this._splashScreen.onAddMenu = $bind(this,this.handleAddMenu);
		this._splashScreen.onRemoveSplash = $bind(this,this.handleRemoveSplash);
		co.doubleduck.BaseGame._stage.addChild(this._splashScreen);
	}
	,_splashScreen: null
	,__class__: co.doubleduck.Game
});
co.doubleduck.Help = $hxClasses["co.doubleduck.Help"] = function() {
	createjs.Container.call(this);
	this._containBox = new createjs.Container();
	this._containBox.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._containBox.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._containBox);
	this._backBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/general/btn_back.png"));
	this._backBtn.scaleX = this._backBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._backBtn.onClick = $bind(this,this.handleBackToMain);
	this._containBox.addChild(this._backBtn);
	this._helpImage = co.doubleduck.BaseAssets.getImage("images/menu/help.png");
	this._helpImage.scaleX = this._helpImage.scaleY = co.doubleduck.BaseGame.getScale();
	this._helpImage.x = co.doubleduck.BaseGame.getScale() * 50;
	this._helpImage.y = this._backBtn.y + (this._backBtn.image.height + 35) * co.doubleduck.BaseGame.getScale();
	this._containBox.addChild(this._helpImage);
	this._containBox.regX = this._helpImage.x + this._helpImage.image.width * 0.5 * co.doubleduck.BaseGame.getScale();
	this._containBox.regY = this._helpImage.y + this._helpImage.image.height * 0.5 * co.doubleduck.BaseGame.getScale();
};
co.doubleduck.Help.__name__ = ["co","doubleduck","Help"];
co.doubleduck.Help.__super__ = createjs.Container;
co.doubleduck.Help.prototype = $extend(createjs.Container.prototype,{
	handleBackToMain: function() {
		this.onBackToMain();
	}
	,_helpImage: null
	,_backBtn: null
	,_containBox: null
	,onBackToMain: null
	,__class__: co.doubleduck.Help
});
co.doubleduck.Hud = $hxClasses["co.doubleduck.Hud"] = function() {
	this._passedBest = false;
	this._isPaused = false;
	this._lastDist = -1;
	this._lastMoney = -1;
	createjs.Container.call(this);
	var hudPad = 10 * co.doubleduck.BaseGame.getScale();
	if(co.doubleduck.Hud._smallFont == null) co.doubleduck.Hud._smallFont = new co.doubleduck.FontHelper("images/general/font_small/");
	if(co.doubleduck.Hud._bigFont == null) co.doubleduck.Hud._bigFont = new co.doubleduck.FontHelper("images/general/font_big/");
	this.alpha = 0;
	if(co.doubleduck.Hud._lifeSheet == null) {
		var img = co.doubleduck.BaseAssets.getRawImage("images/session/hud/life.png");
		var initObject = { };
		initObject.images = [img];
		initObject.frames = { width : img.width / 2, height : img.height, regX : 0, regY : 0};
		initObject.animations = { };
		initObject.animations.on = { frames : 0};
		initObject.animations.off = { frames : 1};
		co.doubleduck.Hud._lifeSheet = new createjs.SpriteSheet(initObject);
	}
	this._initialLife = co.doubleduck.Persistence.getDodoData().lifeLevel;
	this._pauseBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/hud/btn_pause.png"));
	this._pauseBtn.scaleX = this._pauseBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._pauseBtn.x = hudPad;
	this._pauseBtn.y = hudPad;
	this._pauseBtn.onClick = $bind(this,this.handlePauseClick);
	this.addChild(this._pauseBtn);
	if(co.doubleduck.Persistence.getBestScore() > 0) {
		this._bestLabel = co.doubleduck.BaseAssets.getImage("images/session/best.png");
		this._bestLabel.scaleX = this._bestLabel.scaleY = co.doubleduck.BaseGame.getScale();
		this._bestLabel.x = hudPad;
		this._bestLabel.y = this._pauseBtn.y + this._pauseBtn.image.height * co.doubleduck.BaseGame.getScale() + hudPad / 2;
		this.addChild(this._bestLabel);
		this._bestValue = co.doubleduck.Hud._smallFont.getNumber(co.doubleduck.Persistence.getBestScore(),1,true,null,-6);
		this._bestValue.regX = this._bestValue.regY = 0;
		this._bestValue.scaleX = this._bestValue.scaleY = co.doubleduck.BaseGame.getScale();
		this._bestValue.x = this._bestLabel.x + (this._bestLabel.image.width + 4) * co.doubleduck.BaseGame.getScale();
		this._bestValue.y = this._bestLabel.y;
		this.addChild(this._bestValue);
	} else this._passedBest = true;
	this.setMoney(0);
	this.setDistance(0);
	var midPartBox = new createjs.Container();
	var midPartWidth = 0;
	this._lives = new Array();
	var _g1 = 0, _g = this._initialLife;
	while(_g1 < _g) {
		var i = _g1++;
		this._lives.push(new createjs.BitmapAnimation(co.doubleduck.Hud._lifeSheet));
		this._lives[i].gotoAndStop("on");
		this._lives[i].scaleX = this._lives[i].scaleY = co.doubleduck.BaseGame.getScale();
		this._lives[i].x = midPartWidth;
		this._lives[i].y = hudPad;
		midPartBox.addChild(this._lives[i]);
		midPartWidth += (co.doubleduck.Hud._lifeSheet._frameWidth + 1) * co.doubleduck.BaseGame.getScale();
	}
	if(this._initialLife == 0) {
		this._lives.push(new createjs.BitmapAnimation(co.doubleduck.Hud._lifeSheet));
		this._lives[0].gotoAndStop("on");
		this._lives[0].scaleX = this._lives[0].scaleY = co.doubleduck.BaseGame.getScale();
		this._lives[0].x = midPartWidth;
		this._lives[0].y = hudPad;
		this._lives[0].visible = false;
		midPartBox.addChild(this._lives[0]);
		midPartWidth += (co.doubleduck.Hud._lifeSheet._frameWidth + 1) * co.doubleduck.BaseGame.getScale();
	}
	midPartWidth += hudPad;
	this._fuelBar = co.doubleduck.BaseAssets.getImage("images/session/hud/fuelbar_empty.png");
	this._fuelBar.scaleX = this._fuelBar.scaleY = co.doubleduck.BaseGame.getScale();
	this._fuelBar.x = midPartWidth;
	this._fuelBar.y = hudPad;
	midPartWidth += this._fuelBar.image.width * co.doubleduck.BaseGame.getScale();
	midPartBox.addChild(this._fuelBar);
	this._fuelFill = co.doubleduck.BaseAssets.getImage("images/session/hud/fuelbar_fill.png");
	this._fuelFill.scaleX = this._fuelFill.scaleY = co.doubleduck.BaseGame.getScale();
	this._fuelFill.x = this._fuelBar.x + (this._fuelBar.image.width - this._fuelFill.image.width) * co.doubleduck.BaseGame.getScale();
	this._fuelFill.y = hudPad;
	midPartBox.addChild(this._fuelFill);
	this._fuelMask = new createjs.Shape();
	this._fuelMask.graphics.beginFill("#000000");
	this._fuelMask.graphics.drawRect(0,0,this._fuelFill.image.width * co.doubleduck.BaseGame.getScale(),this._fuelFill.image.height * co.doubleduck.BaseGame.getScale());
	this._fuelMask.graphics.endFill();
	this._fuelMask.x = this._fuelFill.x;
	this._fuelMask.y = this._fuelFill.y;
	this._fuelFill.mask = this._fuelMask;
	this._fuelEmpty = co.doubleduck.Utils.getCenteredImage("images/session/hud/alert_fuel.png",true);
	this._fuelEmpty.x = this._fuelFill.x + this._fuelFill.image.width * 0.5 * co.doubleduck.BaseGame.getScale();
	this._fuelEmpty.y = this._fuelFill.y + this._fuelFill.image.height * 0.5 * co.doubleduck.BaseGame.getScale();
	this._fuelEmpty.alpha = 0;
	midPartBox.addChild(this._fuelEmpty);
	midPartBox.x = co.doubleduck.BaseGame.getViewport().width / 2;
	midPartBox.regX = midPartWidth / 2;
	this.addChild(midPartBox);
	this._pauseScreen = new createjs.Container();
	this._pauseScreen.visible = false;
	this.addChild(this._pauseScreen);
	this._pauseOverlay = new createjs.Shape();
	this._pauseOverlay.graphics.beginFill("#000000");
	this._pauseOverlay.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	this._pauseOverlay.graphics.endFill();
	this._pauseOverlay.alpha = 0.6;
	this._pauseScreen.addChild(this._pauseOverlay);
	this._pauseTitle = co.doubleduck.Utils.getCenteredImage("images/session/pause/paused.png",true);
	this._pauseTitle.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._pauseTitle.y = co.doubleduck.BaseGame.getViewport().height * 0.3;
	this._pauseScreen.addChild(this._pauseTitle);
	this._backToMenuBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/pause/btn_quit.png"));
	this._backToMenuBtn.scaleX = this._backToMenuBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._backToMenuBtn.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._backToMenuBtn.y = co.doubleduck.BaseGame.getViewport().height * 0.5;
	this._pauseScreen.addChild(this._backToMenuBtn);
	this._retryBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/pause/btn_retry.png"));
	this._retryBtn.scaleX = this._retryBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._retryBtn.y = this._backToMenuBtn.y;
	this._pauseScreen.addChild(this._retryBtn);
	this._resumeBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/session/pause/btn_resume.png"));
	this._resumeBtn.scaleX = this._resumeBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._resumeBtn.y = this._backToMenuBtn.y;
	this._pauseScreen.addChild(this._resumeBtn);
	var totalW = (this._backToMenuBtn.image.width + 10 + this._retryBtn.image.width + 10 + this._resumeBtn.image.width) * co.doubleduck.BaseGame.getScale();
	this._backToMenuBtn.x -= totalW / 2;
	this._retryBtn.x = this._backToMenuBtn.x + (this._backToMenuBtn.image.width + 10) * co.doubleduck.BaseGame.getScale();
	this._resumeBtn.x = this._retryBtn.x + (this._retryBtn.image.width + 10) * co.doubleduck.BaseGame.getScale();
	createjs.Tween.get(this).to({ alpha : 1},400);
};
co.doubleduck.Hud.__name__ = ["co","doubleduck","Hud"];
co.doubleduck.Hud._smallFont = null;
co.doubleduck.Hud._bigFont = null;
co.doubleduck.Hud._lifeSheet = null;
co.doubleduck.Hud.__super__ = createjs.Container;
co.doubleduck.Hud.prototype = $extend(createjs.Container.prototype,{
	handleRetryClick: function() {
		this._retryBtn = null;
		if(this.onRetry != null) {
			createjs.Ticker.setPaused(false);
			this.onRetry();
		}
	}
	,handleBackToMenuClick: function() {
		this._backToMenuBtn = null;
		if(this.onBackToMenu != null) {
			createjs.Ticker.setPaused(false);
			this.onBackToMenu();
		}
	}
	,handleResumeClick: function() {
		this._isPaused = false;
		this._pauseBtn.onClick = $bind(this,this.handlePauseClick);
		this._pauseBtn.visible = true;
		this._resumeBtn.onClick = null;
		this._retryBtn.onClick = null;
		this._backToMenuBtn.onClick = null;
		this._pauseScreen.visible = false;
		createjs.Ticker.setPaused(false);
	}
	,handlePauseClick: function() {
		this._isPaused = true;
		this._pauseBtn.onClick = null;
		this._pauseBtn.visible = false;
		this._resumeBtn.onClick = $bind(this,this.handleResumeClick);
		this._retryBtn.onClick = $bind(this,this.handleRetryClick);
		this._backToMenuBtn.onClick = $bind(this,this.handleBackToMenuClick);
		this._pauseScreen.visible = true;
		createjs.Tween.get(this).wait(30).call(createjs.Ticker.setPaused,[true]);
	}
	,alertFade: function() {
		if(this._fuelEmpty == null) return;
		if(this._fuelEmpty.alpha == 0) createjs.Tween.get(this._fuelEmpty).to({ alpha : 1},200).call($bind(this,this.alertFade)); else createjs.Tween.get(this._fuelEmpty).to({ alpha : 0},800).call($bind(this,this.alertFade));
	}
	,setMoney: function(amount) {
		if(amount == this._lastMoney) return;
		this._lastMoney = amount;
		if(this._coin == null) {
			this._coin = co.doubleduck.BaseAssets.getImage("images/general/font_big/dollar.png");
			this._coin.scaleX = this._coin.scaleY = co.doubleduck.BaseGame.getScale();
			this._coin.regX = this._coin.image.width;
			this._coin.regY = this._coin.image.height / 2;
			if(this.getChildIndex(this._pauseScreen) != -1) this.addChildAt(this._coin,this.getChildIndex(this._pauseScreen)); else this.addChild(this._coin);
		}
		if(this._moneyText != null) {
			this.removeChild(this._moneyText);
			this._moneyText = null;
		}
		var dims = new createjs.Rectangle(0,0,0,0);
		this._moneyText = co.doubleduck.Hud._bigFont.getNumber(amount,1,true,dims,-4);
		this._moneyText.scaleX = this._moneyText.scaleY = co.doubleduck.BaseGame.getScale();
		this._moneyText.regY = 0;
		this._moneyText.regX = dims.width;
		this._moneyText.x = co.doubleduck.BaseGame.getViewport().width - 10 * co.doubleduck.BaseGame.getScale();
		this._moneyText.y = 10 * co.doubleduck.BaseGame.getScale();
		if(this.getChildIndex(this._pauseScreen) != -1) this.addChildAt(this._moneyText,this.getChildIndex(this._pauseScreen)); else this.addChild(this._moneyText);
		this._coin.x = this._moneyText.x - dims.width * co.doubleduck.BaseGame.getScale();
		this._coin.y = this._moneyText.y + dims.height * 0.5 * co.doubleduck.BaseGame.getScale();
	}
	,setFuel: function(percent) {
		if(this._fuelMask.scaleX > co.doubleduck.Hud.FUEL_ALERT_THRESH && percent <= co.doubleduck.Hud.FUEL_ALERT_THRESH) {
			createjs.Tween.removeTweens(this._fuelEmpty);
			this.alertFade();
		} else if(this._fuelMask.scaleX <= co.doubleduck.Hud.FUEL_ALERT_THRESH && percent > co.doubleduck.Hud.FUEL_ALERT_THRESH) {
			createjs.Tween.removeTweens(this._fuelEmpty);
			createjs.Tween.get(this._fuelEmpty).to({ alpha : 0},100);
		}
		this._fuelMask.scaleX = percent;
	}
	,setLife: function(available) {
		if(this._initialLife == 0) {
			if(available == 1) this._lives[0].visible = true; else if(available == 0) this._lives[0].visible = false;
		} else if(available <= this._initialLife) {
			var _g1 = 0, _g = this._initialLife;
			while(_g1 < _g) {
				var i = _g1++;
				this._lives[i].gotoAndStop("off");
			}
			var _g = 0;
			while(_g < available) {
				var i = _g++;
				this._lives[i].gotoAndStop("on");
			}
		}
	}
	,setDistance: function(dist) {
		if(dist == this._lastDist) return;
		this._lastDist = dist;
		var best = co.doubleduck.Persistence.getBestScore();
		if(!this._passedBest && dist > best) {
			this._passedBest = true;
			var notice = co.doubleduck.BaseAssets.getImage("images/menu/new_best.png");
			notice.scaleX = notice.scaleY = co.doubleduck.BaseGame.getScale();
			notice.x = 10 * co.doubleduck.BaseGame.getScale();
			notice.y = this._bestLabel.y + (this._bestLabel.image.height + 5) * co.doubleduck.BaseGame.getScale();
			notice.alpha = 0;
			this.addChild(notice);
			createjs.Tween.get(notice).to({ alpha : 1},400).wait(1200).to({ x : -notice.image.width * co.doubleduck.BaseGame.getScale(), alpha : 0},700,createjs.Ease.sineIn).call($bind(this,this.removeChild),[notice]);
		}
		if(this._mLetter == null) {
			this._mLetter = co.doubleduck.BaseAssets.getImage("images/general/font_big/m.png");
			this._mLetter.scaleX = this._mLetter.scaleY = co.doubleduck.BaseGame.getScale();
			this._mLetter.regY = this._mLetter.image.height / 2;
			if(this.getChildIndex(this._pauseScreen) != -1) this.addChildAt(this._mLetter,this.getChildIndex(this._pauseScreen)); else this.addChild(this._mLetter);
		}
		if(this._distText != null) {
			this.removeChild(this._distText);
			this._distText = null;
		}
		var dims = new createjs.Rectangle(0,0,0,0);
		this._distText = co.doubleduck.Hud._bigFont.getNumber(dist,1,true,dims,-2);
		this._distText.scaleX = this._distText.scaleY = co.doubleduck.BaseGame.getScale();
		this._distText.regY = 0;
		this._distText.regX = 0;
		this._distText.x = this._pauseBtn.x + (this._pauseBtn.image.width + 5) * co.doubleduck.BaseGame.getScale();
		this._distText.y = 10 * co.doubleduck.BaseGame.getScale();
		if(this.getChildIndex(this._pauseScreen) != -1) this.addChildAt(this._distText,this.getChildIndex(this._pauseScreen)); else this.addChild(this._distText);
		this._mLetter.x = this._distText.x + dims.width * co.doubleduck.BaseGame.getScale();
		this._mLetter.y = this._distText.y + dims.height * 0.5 * co.doubleduck.BaseGame.getScale();
	}
	,_passedBest: null
	,_isPaused: null
	,_fuelMask: null
	,_initialLife: null
	,_lastDist: null
	,_lastMoney: null
	,_retryBtn: null
	,_backToMenuBtn: null
	,_resumeBtn: null
	,_pauseTitle: null
	,_pauseOverlay: null
	,_pauseScreen: null
	,_lives: null
	,_fuelEmpty: null
	,_fuelFill: null
	,_fuelBar: null
	,_distText: null
	,_bestMLetter: null
	,_bestValue: null
	,_bestLabel: null
	,_mLetter: null
	,_moneyText: null
	,_coin: null
	,_pauseBtn: null
	,onRetry: null
	,onBackToMenu: null
	,__class__: co.doubleduck.Hud
});
co.doubleduck.Main = $hxClasses["co.doubleduck.Main"] = function() { }
co.doubleduck.Main.__name__ = ["co","doubleduck","Main"];
co.doubleduck.Main._stage = null;
co.doubleduck.Main._game = null;
co.doubleduck.Main._ffHeight = null;
co.doubleduck.Main.main = function() {
	co.doubleduck.Main.testFFHeight();
	createjs.Ticker.useRAF = true;
	createjs.Ticker.setFPS(60);
	co.doubleduck.Main._stage = new createjs.Stage(js.Lib.document.getElementById("stageCanvas"));
	co.doubleduck.Main._game = new co.doubleduck.Game(co.doubleduck.Main._stage);
	createjs.Ticker.addListener(co.doubleduck.Main._stage);
	createjs.Touch.enable(co.doubleduck.Main._stage,true,false);
}
co.doubleduck.Main.testFFHeight = function() {
	var isAplicable = /Firefox/.test(navigator.userAgent);
	if(isAplicable && viewporter.ACTIVE) co.doubleduck.Main._ffHeight = js.Lib.window.innerHeight;
}
co.doubleduck.Main.getFFHeight = function() {
	return co.doubleduck.Main._ffHeight;
}
co.doubleduck.Menu = $hxClasses["co.doubleduck.Menu"] = function(properties) {
	co.doubleduck.BaseMenu.call(this);
	if(co.doubleduck.Menu._fontSmall == null) co.doubleduck.Menu._fontSmall = new co.doubleduck.FontHelper("images/general/font_small/");
	if(co.doubleduck.Menu._fontBig == null) co.doubleduck.Menu._fontBig = new co.doubleduck.FontHelper("images/general/font_big/");
	this._sky = co.doubleduck.Utils.getCenteredImage("images/session/sky.png",true);
	this._sky.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._sky.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._sky);
	this._back = co.doubleduck.Utils.getCenteredImage("images/session/bgs/bg1a.png",true);
	this._back.regX = 0;
	this._back.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._back);
	this._overlay = new createjs.Shape();
	this._overlay.graphics.beginFill("#000000");
	this._overlay.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	this._overlay.graphics.endFill();
	this._overlay.alpha = 0.85;
	this.addChild(this._overlay);
	this._menuTop = new createjs.Container();
	this.addChild(this._menuTop);
	if(properties == null) {
		this._logo = co.doubleduck.Utils.getCenteredImage("images/general/logo.png",true);
		this._logo.regY = 0;
		this._logo.x = co.doubleduck.BaseGame.getViewport().width * 0.5;
		this._logo.y = co.doubleduck.BaseGame.getViewport().height * 0.15;
		this._menuTop.addChild(this._logo);
	} else {
		this._menuTop.alpha = 0;
		co.doubleduck.Persistence.setMoneyCount(co.doubleduck.Persistence.getMoneyCount() + properties.coins);
		this._postcard = co.doubleduck.Utils.getCenteredImage("images/menu/postcards/" + Std.string(properties.postcard + 1) + ".png",true);
		this._postcard.x = co.doubleduck.BaseGame.getViewport().width * 0.5;
		this._postcard.x -= co.doubleduck.BaseGame.getScale() * 100;
		this._postcard.x -= 20 * co.doubleduck.BaseGame.getScale();
		this._postcard.y = co.doubleduck.BaseGame.getViewport().height * 0.38;
		this._postcard.y -= 50 * co.doubleduck.BaseGame.getScale();
		this._postcard.rotation = -14;
		this._postcard.alpha = 0;
		this._menuTop.addChild(this._postcard);
		createjs.Tween.get(this._postcard).wait(350).to({ x : this._postcard.x + 20 * co.doubleduck.BaseGame.getScale(), y : this._postcard.y + 50 * co.doubleduck.BaseGame.getScale(), rotation : this._postcard.rotation + 10, alpha : 1},1000,createjs.Ease.circOut);
		var pane = new createjs.Container();
		pane.scaleX = pane.scaleY = co.doubleduck.BaseGame.getScale();
		pane.x = co.doubleduck.BaseGame.getViewport().width / 2;
		pane.x += co.doubleduck.BaseGame.getScale() * 150;
		pane.y = this._postcard.y - this._postcard.image.height * 0.1 * co.doubleduck.BaseGame.getScale();
		this._menuTop.addChild(pane);
		var totalW;
		var dims = new createjs.Rectangle(0,0,0,0);
		this._result = co.doubleduck.Menu._fontBig.getNumber(properties.distance,1,true,dims,-2);
		this._result.regX = 0;
		this._resultM = co.doubleduck.Utils.getCenteredImage("images/general/font_big/m.png",false);
		this._resultM.regX = 0;
		totalW = dims.width + this._resultM.image.width;
		this._result.x = -(totalW / 2);
		this._resultM.x = this._result.x + dims.width;
		pane.addChild(this._result);
		pane.addChild(this._resultM);
		this._collected = co.doubleduck.Utils.getCenteredImage("images/menu/collected.png",false);
		this._collected.y = dims.height;
		this._collected.regX = 0;
		this._collectAmount = co.doubleduck.Menu._fontSmall.getNumber(properties.coins,1,true,dims,-4);
		this._collectAmount.regX = 0;
		this._collectAmount.y = this._collected.y;
		this._collectCoin = co.doubleduck.Utils.getCenteredImage("images/general/font_small/dollar.png",false);
		this._collectCoin.regX = 0;
		this._collectCoin.y = this._collected.y;
		totalW = this._collected.image.width + 5 + this._collectCoin.image.width + dims.width;
		this._collected.x = -(totalW / 2);
		this._collected.y -= 2;
		this._collectCoin.x = this._collected.x + this._collected.image.width + 5;
		this._collectAmount.x = this._collectCoin.x + this._collectCoin.image.width - 3;
		pane.addChild(this._collected);
		pane.addChild(this._collectAmount);
		pane.addChild(this._collectCoin);
		var best = co.doubleduck.Persistence.getBestScore();
		this._bestLabel = co.doubleduck.Utils.getCenteredImage("images/menu/best.png",false);
		this._bestLabel.y = 120;
		this._bestLabel.regX = 0;
		this._bestScore = co.doubleduck.Menu._fontSmall.getNumber(best,1,true,dims,-6);
		this._bestScore.regX = 0;
		this._bestScore.y = this._bestLabel.y;
		this._bestM = co.doubleduck.Utils.getCenteredImage("images/general/font_small/m.png",false);
		this._bestM.regX = 0;
		this._bestM.y = this._bestLabel.y;
		totalW = this._bestLabel.image.width - 4 + dims.width + this._bestM.image.width - 9;
		this._bestLabel.x = -(totalW / 2);
		this._bestLabel.y -= 2;
		this._bestScore.x = this._bestLabel.x + this._bestLabel.image.width - 4;
		this._bestM.x = this._bestScore.x + dims.width - 5;
		pane.addChild(this._bestLabel);
		pane.addChild(this._bestScore);
		pane.addChild(this._bestM);
	}
	this._buttonsLayer = new createjs.Container();
	this._buttonsLayer.scaleX = this._buttonsLayer.scaleY = co.doubleduck.BaseGame.getScale();
	this._buttonsWidth = 0;
	this._playBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_play.png"));
	this._playBtn.regX = this._playBtn.image.width;
	this._playBtn.regY = this._playBtn.image.height;
	this._playBtn.onClick = $bind(this,this.handlePlayClick);
	this._buttonsLayer.addChild(this._playBtn);
	this._buttonsWidth += this._playBtn.image.width;
	this._shopBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_shop.png"));
	this._shopBtn.regX = this._shopBtn.image.width;
	this._shopBtn.regY = this._shopBtn.image.height;
	this._buttonsWidth += co.doubleduck.Menu.BUTTON_PADDING;
	this._shopBtn.x = -this._buttonsWidth;
	this._shopBtn.onClick = $bind(this,this.openShopMenu);
	this._buttonsLayer.addChild(this._shopBtn);
	this._buttonsWidth += this._shopBtn.image.width;
	this.updateMoneyCount();
	this._helpBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_help.png"));
	this._helpBtn.regX = this._helpBtn.image.width;
	this._helpBtn.regY = this._helpBtn.image.height;
	this._buttonsWidth += co.doubleduck.Menu.BUTTON_PADDING;
	this._helpBtn.x = -this._buttonsWidth;
	this._helpBtn.onClick = $bind(this,this.openHelpMenu);
	this._buttonsLayer.addChild(this._helpBtn);
	this._buttonsWidth += this._helpBtn.image.width;
	if(co.doubleduck.SoundManager.available) {
		this._muteBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/menu/btn_audio.png"),null,co.doubleduck.Button.CLICK_TYPE_TOGGLE);
		this._muteBtn.regX = this._muteBtn.image.width / 4;
		this._muteBtn.regY = this._muteBtn.image.height / 2;
		this._buttonsWidth += co.doubleduck.Menu.BUTTON_PADDING;
		this._muteBtn.x = -this._buttonsWidth;
		this._muteBtn.setToggle(!co.doubleduck.SoundManager.isMuted());
		this._muteBtn.onToggle = $bind(this,this.handleMuteToggle);
		this._buttonsLayer.addChild(this._muteBtn);
		this._buttonsWidth += this._muteBtn.image.width / 2;
	}
	this._buttonsLayer.regX = -this._buttonsWidth / 2;
	this._buttonsLayer.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._buttonsLayer.y = co.doubleduck.BaseGame.getViewport().height * 0.89;
	this._buttonsLayer.alpha = 0;
	this.addChild(this._buttonsLayer);
	createjs.Tween.get(this._buttonsLayer).wait(300).to({ alpha : 1},300);
	if(this._menuTop.alpha == 0) createjs.Tween.get(this._menuTop).to({ alpha : 1},300).wait(400).call($bind(this,this.testForNewBest),[properties.distance]);
	this._menuMusic = co.doubleduck.SoundManager.playMusic("sound/menu_music");
};
co.doubleduck.Menu.__name__ = ["co","doubleduck","Menu"];
co.doubleduck.Menu._fontSmall = null;
co.doubleduck.Menu._fontBig = null;
co.doubleduck.Menu.__super__ = co.doubleduck.BaseMenu;
co.doubleduck.Menu.prototype = $extend(co.doubleduck.BaseMenu.prototype,{
	moveScreen: function(items,isRight) {
		var delta = co.doubleduck.BaseGame.getViewport().width;
		if(isRight) delta *= -1;
		var _g1 = 0, _g = items.length;
		while(_g1 < _g) {
			var i = _g1++;
			createjs.Tween.get(items[i]).to({ x : items[i].x + delta},600,createjs.Ease.sineInOut);
		}
	}
	,switchToSession: function() {
		if(this.onPlayClick != null) this.onPlayClick();
	}
	,handlePlayClick: function() {
		if(this._menuMusic != null) this._menuMusic.stop();
		createjs.Tween.removeTweens(this._menuTop);
		createjs.Tween.get(this._menuTop).to({ alpha : 0},300);
		createjs.Tween.removeTweens(this._buttonsLayer);
		createjs.Tween.get(this._buttonsLayer).to({ alpha : 0},300);
		if(this._helpUI != null) {
			createjs.Tween.removeTweens(this._helpUI);
			createjs.Tween.get(this._helpUI).to({ alpha : 0},300);
		}
		if(this._shopUI != null) {
			createjs.Tween.removeTweens(this._shopUI);
			createjs.Tween.get(this._shopUI).to({ alpha : 0},300);
		}
		createjs.Tween.get(this._overlay).wait(100).to({ alpha : 0},300).call($bind(this,this.switchToSession));
	}
	,handleMuteToggle: function() {
		co.doubleduck.SoundManager.toggleMute();
	}
	,handleBackFromHelp: function() {
		this._helpBtn.onClick = $bind(this,this.openHelpMenu);
		this.moveScreen([this._menuTop,this._buttonsLayer,this._helpUI],false);
		createjs.Tween.get(this._playBtn).wait(20).to({ x : this._playBtn.x - co.doubleduck.BaseGame.getViewport().width / co.doubleduck.BaseGame.getScale()},580,createjs.Ease.sineInOut);
	}
	,openHelpMenu: function() {
		this._helpBtn.onClick = null;
		if(this._helpUI == null) {
			this._helpUI = new co.doubleduck.Help();
			this._helpUI.x = co.doubleduck.BaseGame.getViewport().width;
			this._helpUI.onBackToMain = $bind(this,this.handleBackFromHelp);
			this.addChild(this._helpUI);
		}
		this.moveScreen([this._menuTop,this._buttonsLayer,this._helpUI],true);
		createjs.Tween.get(this._playBtn).wait(20).to({ x : this._playBtn.x + co.doubleduck.BaseGame.getViewport().width / co.doubleduck.BaseGame.getScale()},580,createjs.Ease.sineInOut);
	}
	,handleBackFromShop: function() {
		this._shopBtn.onClick = $bind(this,this.openShopMenu);
		this.updateMoneyCount();
		this.moveScreen([this._menuTop,this._buttonsLayer,this._shopUI],false);
	}
	,openShopMenu: function() {
		this._shopBtn.onClick = null;
		if(this._shopUI == null) {
			this._shopUI = new co.doubleduck.Shop();
			this._shopUI.x = co.doubleduck.BaseGame.getViewport().width;
			this._shopUI.onBackToMain = $bind(this,this.handleBackFromShop);
			this.addChild(this._shopUI);
		}
		this.moveScreen([this._menuTop,this._buttonsLayer,this._shopUI],true);
	}
	,updateMoneyCount: function() {
		if(this._coin == null) {
			this._coin = co.doubleduck.BaseAssets.getImage("images/general/font_small/dollar.png");
			this._coin.regY = this._coin.image.height / 2;
			this._coin.y = this._shopBtn.y - this._shopBtn.image.height * 0.3;
			this._buttonsLayer.addChild(this._coin);
		}
		if(this._moneyCount != null) {
			this._buttonsLayer.removeChild(this._moneyCount);
			this._moneyCount = null;
		}
		var dims = new createjs.Rectangle(0,0,0,0);
		this._moneyCount = co.doubleduck.Menu._fontSmall.getNumber(co.doubleduck.Persistence.getMoneyCount(),1,true,dims,-4);
		this._moneyCount.x = this._coin.x;
		this._moneyCount.y = this._coin.y;
		this._moneyCount.regX = 0;
		this._buttonsLayer.addChild(this._moneyCount);
		var totalW = dims.width + this._coin.image.width;
		this._coin.x = this._shopBtn.x - this._shopBtn.image.width / 2;
		this._coin.x -= totalW / 2;
		this._moneyCount.x = this._coin.x + this._coin.image.width;
	}
	,replaceBest: function(newBest) {
		var pane = this._bestScore.parent;
		pane.addChild(newBest);
		createjs.Tween.get(this._bestScore).to({ alpha : 0},100).call($bind(pane,pane.removeChild),[this._bestScore]);
		createjs.Tween.get(newBest).to({ alpha : 1},100).to({ scaleX : 1, scaleY : 1},200,createjs.Ease.sineInOut);
		this._bestScore = newBest;
	}
	,testForNewBest: function(score) {
		if(score > co.doubleduck.Persistence.getBestScore()) {
			co.doubleduck.Persistence.setBestScore(score);
			var zoom = 1.3;
			var dims = new createjs.Rectangle(0,0,0,0);
			var newBest = co.doubleduck.Menu._fontSmall.getNumber(score,1,true,dims,-6);
			newBest.regX = 0;
			newBest.y = this._bestScore.y;
			newBest.x = this._bestScore.x;
			newBest.scaleX = newBest.scaleY = zoom;
			newBest.alpha = 0;
			createjs.Tween.get(this._bestM).to({ x : newBest.x + dims.width * zoom - 4},300,createjs.Ease.sineInOut).to({ x : newBest.x + dims.width - 4},300,createjs.Ease.sineInOut);
			createjs.Tween.get(this._bestScore).to({ scaleX : zoom, scaleY : zoom},300,createjs.Ease.sineInOut).call($bind(this,this.replaceBest),[newBest]);
		}
	}
	,_menuMusic: null
	,_buttonsWidth: null
	,_button: null
	,_muteBtn: null
	,_helpBtn: null
	,_shopBtn: null
	,_playBtn: null
	,_bestM: null
	,_bestScore: null
	,_bestLabel: null
	,_collectCoin: null
	,_collectAmount: null
	,_collected: null
	,_resultM: null
	,_result: null
	,_postcard: null
	,_helpUI: null
	,_shopUI: null
	,_coin: null
	,_moneyCount: null
	,_buttonsLayer: null
	,_logo: null
	,_menuTop: null
	,_overlay: null
	,_back: null
	,_sky: null
	,__class__: co.doubleduck.Menu
});
co.doubleduck.Obstacle = $hxClasses["co.doubleduck.Obstacle"] = function(id,type,bitmapUrl,hitboxWidth,hitboxHeight,xOffset,yOffset) {
	this._hitbox = new createjs.Rectangle(xOffset * co.doubleduck.BaseGame.getScale(),yOffset * co.doubleduck.BaseGame.getScale(),hitboxWidth * co.doubleduck.BaseGame.getScale(),hitboxHeight * co.doubleduck.BaseGame.getScale());
	this._id = id;
	this._type = Type.createEnum(co.doubleduck.ObstacleType,type.toUpperCase());
	createjs.Bitmap.call(this,co.doubleduck.BaseAssets.getRawImage(bitmapUrl));
};
co.doubleduck.Obstacle.__name__ = ["co","doubleduck","Obstacle"];
co.doubleduck.Obstacle.create = function(id) {
	var obsData = co.doubleduck.DataLoader.getObstacleById(id);
	return new co.doubleduck.Obstacle(id,obsData.type,"images/session/obstacles/" + Std.string(obsData.name) + ".png",obsData.width | 0,obsData.height | 0,obsData.xOffset | 0,obsData.yOffset | 0);
}
co.doubleduck.Obstacle.__super__ = createjs.Bitmap;
co.doubleduck.Obstacle.prototype = $extend(createjs.Bitmap.prototype,{
	getType: function() {
		return this._type;
	}
	,getBoundingRect: function() {
		var result = this._hitbox.clone();
		result.x += this.x;
		result.y += this.y;
		return result;
	}
	,_type: null
	,_id: null
	,_hitbox: null
	,__class__: co.doubleduck.Obstacle
});
co.doubleduck.ObstacleType = $hxClasses["co.doubleduck.ObstacleType"] = { __ename__ : ["co","doubleduck","ObstacleType"], __constructs__ : ["LOW","HIGH"] }
co.doubleduck.ObstacleType.LOW = ["LOW",0];
co.doubleduck.ObstacleType.LOW.toString = $estr;
co.doubleduck.ObstacleType.LOW.__enum__ = co.doubleduck.ObstacleType;
co.doubleduck.ObstacleType.HIGH = ["HIGH",1];
co.doubleduck.ObstacleType.HIGH.toString = $estr;
co.doubleduck.ObstacleType.HIGH.__enum__ = co.doubleduck.ObstacleType;
co.doubleduck.Persistence = $hxClasses["co.doubleduck.Persistence"] = function() { }
co.doubleduck.Persistence.__name__ = ["co","doubleduck","Persistence"];
co.doubleduck.Persistence.initGameData = function() {
	co.doubleduck.BasePersistence.GAME_PREFIX = "DODO_";
	if(!co.doubleduck.BasePersistence.available) return;
	co.doubleduck.BasePersistence.initVar(co.doubleduck.Persistence.JET_LEVEL,"0");
	co.doubleduck.BasePersistence.initVar(co.doubleduck.Persistence.LIFE_LEVEL,"0");
	co.doubleduck.BasePersistence.initVar(co.doubleduck.Persistence.CHARM_JEWEL,"false");
	co.doubleduck.BasePersistence.initVar(co.doubleduck.Persistence.CHARM_FUEL,"false");
	co.doubleduck.BasePersistence.initVar(co.doubleduck.Persistence.CHARM_LIFE,"false");
	co.doubleduck.BasePersistence.initVar(co.doubleduck.Persistence.MONEY_COUNT,"0");
	co.doubleduck.BasePersistence.initVar(co.doubleduck.Persistence.BEST_SCORE,"0");
}
co.doubleduck.Persistence.getDodoData = function() {
	var data = { };
	data.jetLevel = Std.parseInt(co.doubleduck.BasePersistence.getValue(co.doubleduck.Persistence.JET_LEVEL));
	data.lifeLevel = Std.parseInt(co.doubleduck.BasePersistence.getValue(co.doubleduck.Persistence.LIFE_LEVEL));
	data.charmJewel = co.doubleduck.BasePersistence.getValue(co.doubleduck.Persistence.CHARM_JEWEL) == "true";
	data.charmFuel = co.doubleduck.BasePersistence.getValue(co.doubleduck.Persistence.CHARM_FUEL) == "true";
	data.charmLife = co.doubleduck.BasePersistence.getValue(co.doubleduck.Persistence.CHARM_LIFE) == "true";
	return data;
}
co.doubleduck.Persistence.setJetLevel = function(level) {
	co.doubleduck.BasePersistence.setValue(co.doubleduck.Persistence.JET_LEVEL,level + "");
}
co.doubleduck.Persistence.setLifeLevel = function(level) {
	co.doubleduck.BasePersistence.setValue(co.doubleduck.Persistence.LIFE_LEVEL,level + "");
}
co.doubleduck.Persistence.setCharmJewel = function(flag) {
	co.doubleduck.BasePersistence.setValue(co.doubleduck.Persistence.CHARM_JEWEL,Std.string(flag) + "");
}
co.doubleduck.Persistence.setCharmFuel = function(flag) {
	co.doubleduck.BasePersistence.setValue(co.doubleduck.Persistence.CHARM_FUEL,Std.string(flag) + "");
}
co.doubleduck.Persistence.setCharmLife = function(flag) {
	co.doubleduck.BasePersistence.setValue(co.doubleduck.Persistence.CHARM_LIFE,Std.string(flag) + "");
}
co.doubleduck.Persistence.getBestScore = function() {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue(co.doubleduck.Persistence.BEST_SCORE));
}
co.doubleduck.Persistence.setBestScore = function(score) {
	co.doubleduck.BasePersistence.setValue(co.doubleduck.Persistence.BEST_SCORE,score + "");
}
co.doubleduck.Persistence.getMoneyCount = function() {
	return Std.parseInt(co.doubleduck.BasePersistence.getValue(co.doubleduck.Persistence.MONEY_COUNT));
}
co.doubleduck.Persistence.setMoneyCount = function(count) {
	co.doubleduck.BasePersistence.setValue(co.doubleduck.Persistence.MONEY_COUNT,count + "");
}
co.doubleduck.Persistence.__super__ = co.doubleduck.BasePersistence;
co.doubleduck.Persistence.prototype = $extend(co.doubleduck.BasePersistence.prototype,{
	__class__: co.doubleduck.Persistence
});
co.doubleduck.ScrollingBG = $hxClasses["co.doubleduck.ScrollingBG"] = function(scrollSpeed,accelRate,maxSpeed) {
	createjs.Container.call(this);
	this._bgType = co.doubleduck.BGType.FOREST;
	this._bgParts = new Array();
	this._scrollSpeed = scrollSpeed;
	this._accelRate = accelRate;
	this._maxSpeed = maxSpeed;
	this._isScrolling = false;
	this._isSlowing = false;
	this.addPart(this.getRandomPart(this._bgType,true));
	var part = this.getRandomPart(this._bgType);
	part.regX = part.image.width;
	part.regY = part.image.height / 2;
	part.x = this._bgParts[0].x + 2 * co.doubleduck.BaseGame.getScale();
	part.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(part);
	this._bgParts.unshift(part);
};
co.doubleduck.ScrollingBG.__name__ = ["co","doubleduck","ScrollingBG"];
co.doubleduck.ScrollingBG.__super__ = createjs.Container;
co.doubleduck.ScrollingBG.prototype = $extend(createjs.Container.prototype,{
	addPart: function(part) {
		var xPos = 0;
		if(this._bgParts.length > 0) {
			var last = this._bgParts[this._bgParts.length - 1];
			xPos = last.x + last.image.width * co.doubleduck.BaseGame.getScale();
		}
		part.regY = part.image.height / 2;
		part.x = xPos - 2 * co.doubleduck.BaseGame.getScale();
		part.y = co.doubleduck.BaseGame.getViewport().height / 2;
		this.addChild(part);
		this._bgParts.push(part);
	}
	,getMidPart: function(fromType,toType) {
		var from = fromType[1] + 1;
		var to = toType[1] + 1;
		var part = null;
		if(from < to) {
			part = co.doubleduck.BaseAssets.getImage(co.doubleduck.ScrollingBG.PARTS_URI + from + "to" + to + ".png");
			part.scaleX = part.scaleY = co.doubleduck.BaseGame.getScale();
		} else {
			part = co.doubleduck.BaseAssets.getImage(co.doubleduck.ScrollingBG.PARTS_URI + to + "to" + from + ".png");
			part.scaleX = part.scaleY = co.doubleduck.BaseGame.getScale();
			part.scaleX *= -1;
			part.regX = part.image.width;
		}
		part.name = "-1";
		return part;
	}
	,getRandomPart: function(type,isFirstPart) {
		if(isFirstPart == null) isFirstPart = false;
		var name = "";
		name += co.doubleduck.ScrollingBG.PARTS_URI;
		name += type[1] + 1;
		if(isFirstPart) name += "a"; else name += co.doubleduck.Utils.getRandomElement(["a","b","c"]);
		name += ".png";
		var part = co.doubleduck.BaseAssets.getImage(name);
		part.name = "" + type[1];
		part.scaleX = part.scaleY = co.doubleduck.BaseGame.getScale();
		return part;
	}
	,handleTick: function(elapsed) {
		if(this._isScrolling) {
			if(this._isSlowing) {
				this._scrollSpeed *= co.doubleduck.ScrollingBG.SLOWDOWN_RATE;
				if(this._scrollSpeed <= 0.01) {
					this.stopScroll(true);
					return;
				}
			} else {
				this._scrollSpeed += this._accelRate * (elapsed / 1000);
				if(this._scrollSpeed > this._maxSpeed) this._scrollSpeed = this._maxSpeed;
			}
			var delta = this._scrollSpeed * (elapsed / 1000);
			var _g1 = 0, _g = this._bgParts.length;
			while(_g1 < _g) {
				var i = _g1++;
				this._bgParts[i].x -= delta * co.doubleduck.BaseGame.getScale();
			}
			if(this._bgParts.length > 0) {
				if(this._bgParts[0].x < -((this._bgParts[0].image.width + 10) * co.doubleduck.BaseGame.getScale())) {
					this.removeChild(this._bgParts[0]);
					this._bgParts.shift();
				}
			}
			if(this._bgParts.length == 0 || this._bgParts[this._bgParts.length - 1].x <= 0) this.addPart(this.getRandomPart(this._bgType));
		}
	}
	,getLeftmostArea: function() {
		var index = Std.parseInt(this._bgParts[0].name);
		if(index == -1) return this._bgType;
		return Type.createEnumIndex(co.doubleduck.BGType,index);
	}
	,getCurrentArea: function() {
		var index = Std.parseInt(this._bgParts[this._bgParts.length - 1].name);
		if(index == -1) return null;
		return Type.createEnumIndex(co.doubleduck.BGType,index);
	}
	,stopScroll: function(force) {
		if(force == null) force = false;
		if(this._isScrolling) {
			if(force) {
				this._isScrolling = false;
				this.onTick = null;
			} else this._isSlowing = true;
		}
	}
	,nextType: function(isBack) {
		if(isBack == null) isBack = false;
		var curr = this._bgType[1];
		var currType;
		if(isBack) currType = Type.createEnumIndex(co.doubleduck.BGType,curr - 1); else currType = Type.createEnumIndex(co.doubleduck.BGType,curr + 1);
		this.addPart(this.getMidPart(this._bgType,currType));
		this._bgType = currType;
	}
	,isAtLast: function() {
		return this._bgType[1] == Type.getEnumConstructs(co.doubleduck.BGType).length - 1;
	}
	,isAtFirst: function() {
		return this._bgType[1] == 0;
	}
	,startScroll: function() {
		if(!this._isScrolling) {
			this._isScrolling = true;
			this.onTick = $bind(this,this.handleTick);
		}
	}
	,_isSlowing: null
	,_isScrolling: null
	,_accelRate: null
	,_maxSpeed: null
	,_scrollSpeed: null
	,_bgParts: null
	,_bgType: null
	,__class__: co.doubleduck.ScrollingBG
});
co.doubleduck.BGType = $hxClasses["co.doubleduck.BGType"] = { __ename__ : ["co","doubleduck","BGType"], __constructs__ : ["FOREST","SHORE","SEA"] }
co.doubleduck.BGType.FOREST = ["FOREST",0];
co.doubleduck.BGType.FOREST.toString = $estr;
co.doubleduck.BGType.FOREST.__enum__ = co.doubleduck.BGType;
co.doubleduck.BGType.SHORE = ["SHORE",1];
co.doubleduck.BGType.SHORE.toString = $estr;
co.doubleduck.BGType.SHORE.__enum__ = co.doubleduck.BGType;
co.doubleduck.BGType.SEA = ["SEA",2];
co.doubleduck.BGType.SEA.toString = $estr;
co.doubleduck.BGType.SEA.__enum__ = co.doubleduck.BGType;
co.doubleduck.Session = $hxClasses["co.doubleduck.Session"] = function(properties) {
	this._hitboxDebug = false;
	this._nextLifeSpawnTime = -1;
	this._nextJewelSpawnTime = -1;
	this._nextCoinSpawnTime = -1;
	this._nextFuelSpawnTime = -1;
	co.doubleduck.BaseSession.call(this);
	this._sessionEnded = false;
	this._sky = co.doubleduck.Utils.getCenteredImage("images/session/sky.png",true);
	this._sky.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._sky.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._sky);
	var currJetNum = co.doubleduck.Persistence.getDodoData().jetLevel | 0;
	this._elementSpeed = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().jet_initial_speeds[currJetNum] , Float);
	this._elementMaxSpeed = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().jet_max_speeds[currJetNum] , Float);
	this._elementAccel = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().jet_accel_rate[currJetNum] , Float);
	this._collectRates = { };
	this._collectRates.fuel = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().collectableTimes.fuelTimes[currJetNum] , Float);
	this._collectRates.coin = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().collectableTimes.coinTimes[currJetNum] , Float);
	this._collectRates.jewel = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().collectableTimes.jewelTimes[currJetNum] , Float);
	this._collectRates.life = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().collectableTimes.lifeTimes[currJetNum] , Float);
	this._toucanTimes = { };
	this._toucanTimes.waitFromStart = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().toucanTimes.waitFromStart[currJetNum] , Float);
	this._toucanTimes.spawnInterval = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().toucanTimes.spawnInterval[currJetNum] , Float);
	if(this._toucanTimes.waitFromStart == -1) this._toucanTimes = null; else this._nextToucanSpawnTime = createjs.Ticker.getTime(true) + this._toucanTimes.waitFromStart * 1000;
	this._obstacles = new Array();
	this._toucans = new Array();
	this._collectables = new Array();
	this._obstacleRates = co.doubleduck.DataLoader.getGameplayData().obstacleTimes;
	this._currElementSpawnInterval = js.Boot.__cast(this._obstacleRates.start_interval , Float);
	this._lastObstacleSpawnTime = createjs.Ticker.getTime(true);
	this._lastCollisionTestTime = 0;
	this._back = new co.doubleduck.ScrollingBG(this._elementSpeed * co.doubleduck.Session.BG_PARALLAX,this._elementAccel * co.doubleduck.Session.BG_PARALLAX,this._elementMaxSpeed * co.doubleduck.Session.BG_PARALLAX);
	this.addChild(this._back);
	this._elementsLayer = new createjs.Container();
	this.addChild(this._elementsLayer);
	this._toucanLayer = new createjs.Container();
	this.addChild(this._toucanLayer);
	this._tree = co.doubleduck.BaseAssets.getImage("images/session/dodo_tree.png");
	this._tree.scaleX = this._tree.scaleY = co.doubleduck.BaseGame.getScale();
	this._tree.regX = this._tree.image.width;
	this.addChild(this._tree);
	this._dodo = new co.doubleduck.Dodo();
	this._dodo.visible = false;
	this._dodoShade = new createjs.Shape();
	this._dodoShade.visible = false;
	this._dodoShade.graphics.beginFill("#000000");
	this._dodoShade.graphics.drawEllipse(-25,-10,60,20);
	this._dodoShade.graphics.endFill();
	this._dodoShade.x = this._dodo.x;
	this._dodoShade.y = co.doubleduck.BaseGame.getViewport().height - 9 * co.doubleduck.BaseGame.getScale();
	this.addChild(this._dodoShade);
	this.addChild(this._dodo);
	this._overlay = new createjs.Shape();
	this._overlay.graphics.beginFill("#dddddd");
	this._overlay.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
	this._overlay.graphics.endFill();
	this._overlay.alpha = 0.01;
	this._overlay.mouseEnabled = true;
	this._overlay.onPress = $bind(this,this.handleMouseD);
	this._overlay.onClick = $bind(this,this.handleMouseU);
	this.addChild(this._overlay);
	var initObject;
	var img = co.doubleduck.BaseAssets.getRawImage("images/session/start_boom.png");
	initObject = { };
	initObject.images = [img];
	initObject.frames = { width : img.width, height : img.height / 5, regX : 0, regY : img.height / 10};
	initObject.animations = { };
	initObject.animations.burst = { frames : [0,1,2,3,4], frequency : 5};
	this._treeBurst = new createjs.BitmapAnimation(new createjs.SpriteSheet(initObject));
	this._treeBurst.scaleX = this._treeBurst.scaleY = co.doubleduck.BaseGame.getScale();
	this.addChild(this._treeBurst);
	this._hud = new co.doubleduck.Hud();
	this._hud.onBackToMenu = $bind(this,this.handleBackToMenu);
	this._hud.onRetry = $bind(this,this.handleRetry);
	this.addChild(this._hud);
	var delta = this._tree.image.width * 0.75 * co.doubleduck.BaseGame.getScale();
	createjs.Tween.get(this._back).to({ x : delta * co.doubleduck.Session.BG_PARALLAX},700,createjs.Ease.sineInOut);
	createjs.Tween.get(this._tree).to({ x : delta},700,createjs.Ease.sineInOut).wait(300).call($bind(this,this.launchDodo),[delta]);
	if(this._hitboxDebug) this.debugObjects();
	this._distanceTraveled = 0;
	this._coinsCollected = 0;
	this._remainingLives = co.doubleduck.Persistence.getDodoData().lifeLevel;
	this._fuelStatus = 1;
	this._fuelDrainRate = co.doubleduck.DataLoader.getGameplayData().jet_fuel_drain_rate[currJetNum];
	this._fuelGain = co.doubleduck.DataLoader.getGameplayData().jet_fuel_collect_gain[currJetNum];
	co.doubleduck.Collectable.onGetFuel = $bind(this,this.handleGotFuel);
	co.doubleduck.Collectable.onGetCoins = $bind(this,this.handleGotCoins);
	co.doubleduck.Collectable.onGetLife = $bind(this,this.handleGotLife);
};
co.doubleduck.Session.__name__ = ["co","doubleduck","Session"];
co.doubleduck.Session.__super__ = co.doubleduck.BaseSession;
co.doubleduck.Session.prototype = $extend(co.doubleduck.BaseSession.prototype,{
	destroy: function() {
		co.doubleduck.BaseSession.prototype.destroy.call(this);
		this._back.onTick = null;
		this.onTick = null;
	}
	,handleRetry: function() {
		if(this.onRestart != null) this.onRestart();
	}
	,handleBackToMenu: function() {
		if(this.onBackToMenu != null) this.onBackToMenu();
	}
	,bgRamdomizer: function() {
		var goBack = Std.random(2) == 0;
		if(goBack && this._back.isAtFirst()) goBack = false; else if(!goBack && this._back.isAtLast()) goBack = true;
		this._back.nextType(goBack);
		var delay = 12000 + Std.random(8000);
		co.doubleduck.Utils.waitAndCall(this,delay,$bind(this,this.bgRamdomizer));
	}
	,updateDodoShade: function() {
		this._dodoShade.x = this._dodo.x;
		var dodoHeight = (co.doubleduck.BaseGame.getViewport().height - this._dodo.y) / co.doubleduck.BaseGame.getViewport().height;
		this._dodoShade.scaleX = this._dodoShade.scaleY = co.doubleduck.BaseGame.getScale() * co.doubleduck.Utils.map(dodoHeight,0,1,1,0.3);
		this._dodoShade.alpha = co.doubleduck.Utils.map(dodoHeight,0,1,0.28,0.02);
	}
	,handleSessionEnded: function() {
		if(this.onBackToMenu != null) this.onBackToMenu();
	}
	,handleGotLife: function(item) {
		HxOverrides.remove(this._collectables,item);
		this._elementsLayer.removeChild(item);
		var maxLife = co.doubleduck.Persistence.getDodoData().lifeLevel;
		if(maxLife == 0 && this._remainingLives == 0) this._remainingLives = 1; else if(maxLife > this._remainingLives) this._remainingLives++;
	}
	,handleGotCoins: function(item,amount) {
		HxOverrides.remove(this._collectables,item);
		this._elementsLayer.removeChild(item);
		this._coinsCollected += amount;
	}
	,handleGotFuel: function(item) {
		HxOverrides.remove(this._collectables,item);
		this._elementsLayer.removeChild(item);
		this._fuelStatus += this._fuelGain;
		this._fuelStatus = Math.min(this._fuelGain,1);
	}
	,dodoDeath: function(explosion) {
		this._dodo.die(explosion);
		var duration = co.doubleduck.Utils.map(this._dodo.y,0,co.doubleduck.BaseGame.getViewport().height,3000,1500);
		var pos = co.doubleduck.Utils.map(this._dodo.y,0,co.doubleduck.BaseGame.getViewport().height,0.7,0);
		createjs.Tween.get(this._dodo).to({ x : this._dodo.x + (co.doubleduck.BaseGame.getViewport().width - this._dodo.x) * pos},duration,createjs.Ease.sineInOut);
		this._sessionEnded = true;
		this._back.stopScroll();
		co.doubleduck.Utils.waitAndCall(this,4000,$bind(this,this.handleSessionEnded));
	}
	,handleDodoCollision: function() {
		if(this._remainingLives > 0) this._dodo.takeHit(); else this.dodoDeath(true);
		this._remainingLives -= 1;
		this._hud.setLife(this._remainingLives);
	}
	,checkCollision: function() {
		var now = createjs.Ticker.getTime(true);
		if(now < this._lastCollisionTestTime + 50) return;
		if(!this._sessionEnded) {
			var _g = 0, _g1 = this._collectables;
			while(_g < _g1.length) {
				var currItem = _g1[_g];
				++_g;
				if(co.doubleduck.Utils.rectOverlap(currItem.getBoundingRect(),this._dodo.getBoundingRect(true))) currItem.collect();
			}
		}
		if(!this._dodo.isCollidable()) return;
		this._lastCollisionTestTime = now;
		var _g = 0, _g1 = this._obstacles;
		while(_g < _g1.length) {
			var currObs = _g1[_g];
			++_g;
			if(co.doubleduck.Utils.rectOverlap(currObs.getBoundingRect(),this._dodo.getBoundingRect())) {
				this.handleDodoCollision();
				return;
			}
		}
		var _g = 0, _g1 = this._toucans;
		while(_g < _g1.length) {
			var toucan = _g1[_g];
			++_g;
			if(co.doubleduck.Utils.rectOverlap(toucan.getBoundingRect(),this._dodo.getBoundingRect())) {
				this.handleDodoCollision();
				return;
			}
		}
	}
	,handleTick: function(elapsed) {
		this.updateDodoShade();
		this.elementsTimer(elapsed);
		if(!this._sessionEnded) {
			this.checkCollision();
			this._fuelStatus -= this._fuelDrainRate * elapsed / 10000;
			this._hud.setFuel(this._fuelStatus);
			if(this._fuelStatus <= 0) this.dodoDeath(false);
			this._hud.setMoney(this._coinsCollected);
			this._hud.setLife(this._remainingLives);
		}
	}
	,handleMouseU: function() {
		this._dodo.toggleJetpack(false);
	}
	,handleMouseD: function() {
		this._dodo.toggleJetpack(true);
	}
	,handleBurstDone: function() {
		this._treeBurst.onAnimationEnd = null;
		this._treeBurst.stop();
		this._treeBurst.visible = false;
		this.removeChild(this._treeBurst);
		this._treeBurst = null;
	}
	,launchDodo: function(delta) {
		if(this._hitboxDebug) this._dodo.addHitboxDebug();
		var dodoPosX = this._dodo.x;
		this._dodo.x = this._tree.x - this._tree.image.width * 0.35 * co.doubleduck.BaseGame.getScale();
		this._dodo.y = co.doubleduck.BaseGame.getViewport().height * 0.4;
		this._dodo.visible = true;
		this._dodoShade.visible = true;
		this._treeBurst.x = this._dodo.x - 20 * co.doubleduck.BaseGame.getScale();
		this._treeBurst.y = this._dodo.y;
		this._treeBurst.gotoAndPlay("burst");
		this._treeBurst.onAnimationEnd = $bind(this,this.handleBurstDone);
		if(this._dodo.x > dodoPosX) createjs.Tween.get(this._dodo).to({ x : dodoPosX},1000,createjs.Ease.sineInOut); else createjs.Tween.get(this._dodo).to({ x : dodoPosX},500,createjs.Ease.circOut);
		createjs.Tween.get(this._back).to({ x : 0},700,createjs.Ease.sineIn).call(($_=this._back,$bind($_,$_.startScroll)));
		createjs.Tween.get(this._tree).to({ x : 0},700,createjs.Ease.sineIn);
		createjs.Tween.get(this._treeBurst).to({ x : 0},700,createjs.Ease.sineIn);
		this.onTick = $bind(this,this.handleTick);
		co.doubleduck.Utils.waitAndCall(this._dodo,50,($_=this._dodo,$bind($_,$_.applyGravity)));
		co.doubleduck.Utils.waitAndCall(this,5000,$bind(this,this.bgRamdomizer));
	}
	,spawnCollectable: function(type) {
		var item = new co.doubleduck.Collectable(type);
		item.scaleX = item.scaleY = co.doubleduck.BaseGame.getScale();
		item.x = co.doubleduck.BaseGame.getViewport().width;
		var replace = 3;
		while(replace > 0) {
			item.y = co.doubleduck.BaseGame.getViewport().height * 0.1 + co.doubleduck.BaseGame.getViewport().height * 0.8 * Math.random();
			var overlap = false;
			var _g = 0, _g1 = this._obstacles;
			while(_g < _g1.length) {
				var obs = _g1[_g];
				++_g;
				if(co.doubleduck.Utils.rectOverlap(obs.getBoundingRect(),item.getBoundingRect())) overlap = true;
			}
			var _g = 0, _g1 = this._collectables;
			while(_g < _g1.length) {
				var currItem = _g1[_g];
				++_g;
				if(co.doubleduck.Utils.rectOverlap(currItem.getBoundingRect(),item.getBoundingRect())) overlap = true;
			}
			if(overlap) {
				replace--;
				if(replace == 0) return;
			} else replace = 0;
		}
		this._elementsLayer.addChild(item);
		this._collectables.push(item);
		if(this._hitboxDebug) {
			var obsRect = item.getBoundingRect();
			var rect = new createjs.Shape();
			rect.graphics.beginFill("#0000FF");
			rect.graphics.drawRect(obsRect.x,obsRect.y,obsRect.width,obsRect.height);
			rect.graphics.endFill();
			rect.alpha = 0.3;
			this._elementsLayer.addChild(rect);
		}
	}
	,spawnCollectablesByChance: function(elapsed) {
		var factor;
		var now = createjs.Ticker.getTime(true);
		if(now >= this._nextFuelSpawnTime) {
			if(this._nextFuelSpawnTime != -1) this.spawnCollectable(co.doubleduck.CollectableType.FUEL);
			factor = 1;
			if(co.doubleduck.Persistence.getDodoData().charmFuel) factor = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().charmFactors.fuelCharm , Float);
			this._nextFuelSpawnTime = now + (this._collectRates.fuel * 0.5 + this._collectRates.fuel * Math.random() * 0.5) * 1000 / factor;
		}
		if(now >= this._nextCoinSpawnTime) {
			if(this._nextCoinSpawnTime != -1) this.spawnCollectable(co.doubleduck.CollectableType.COIN);
			this._nextCoinSpawnTime = now + (this._collectRates.coin * 0.5 + this._collectRates.coin * Math.random() * 0.5) * 1000;
		}
		if(now >= this._nextJewelSpawnTime) {
			if(this._nextJewelSpawnTime != -1) this.spawnCollectable(co.doubleduck.CollectableType.JEWEL);
			factor = 1;
			if(co.doubleduck.Persistence.getDodoData().charmJewel) factor = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().charmFactors.jewelCharm , Float);
			this._nextJewelSpawnTime = now + (this._collectRates.jewel * 0.5 + this._collectRates.jewel * Math.random() * 0.5) * 1000 / factor;
		}
		var livesOnScreen = 0;
		var _g = 0, _g1 = this._collectables;
		while(_g < _g1.length) {
			var item = _g1[_g];
			++_g;
			if(item.getType() == co.doubleduck.CollectableType.LIFE) livesOnScreen++;
		}
		var maxLife = co.doubleduck.Persistence.getDodoData().lifeLevel;
		if(maxLife == 0) maxLife = 1;
		if(maxLife > this._remainingLives + livesOnScreen) {
			if(this._nextLifeSpawnTime == -2) {
				factor = 1;
				if(co.doubleduck.Persistence.getDodoData().charmLife) factor = js.Boot.__cast(co.doubleduck.DataLoader.getGameplayData().charmFactors.lifeCharm , Float);
				this._nextLifeSpawnTime = now + (this._collectRates.life * 0.5 + this._collectRates.life * Math.random() * 0.5) * 1000 / factor;
			}
			if(now >= this._nextLifeSpawnTime) {
				if(this._nextLifeSpawnTime != -1) {
					this.spawnCollectable(co.doubleduck.CollectableType.LIFE);
					this._nextLifeSpawnTime = -2;
				}
			}
		} else this._nextLifeSpawnTime = -2;
	}
	,spawnToucan: function() {
		var vpHeight = co.doubleduck.BaseGame.getViewport().height;
		var toucan = new co.doubleduck.Toucan(vpHeight * 0.8 * Math.random() + vpHeight * 0.1,2500);
		this._toucanLayer.addChild(toucan);
		this._toucans.push(toucan);
		if(this._hitboxDebug) {
			var obsRect = toucan.getBoundingRect();
			var rect = new createjs.Shape();
			rect.graphics.beginFill("#FF0000");
			rect.graphics.drawRect(obsRect.x,obsRect.y,obsRect.width,obsRect.height);
			rect.graphics.endFill();
			rect.alpha = 0.3;
			this._elementsLayer.addChild(rect);
		}
	}
	,spawnObstacle: function(id) {
		if(id == null) id = -1;
		if(this._back.getCurrentArea() == null) return false;
		var obsticleIds = co.doubleduck.DataLoader.getObstacleIdsByArea(this._back.getCurrentArea());
		var randId = obsticleIds[Std.random(obsticleIds.length)];
		if(id != -1) randId = id;
		var obstacle = co.doubleduck.Obstacle.create(randId);
		obstacle.scaleX = obstacle.scaleY = co.doubleduck.BaseGame.getScale();
		this._elementsLayer.addChild(obstacle);
		this._obstacles.push(obstacle);
		obstacle.x = co.doubleduck.BaseGame.getViewport().width;
		switch( (obstacle.getType())[1] ) {
		case 1:
			break;
		case 0:
			obstacle.y = co.doubleduck.BaseGame.getViewport().height - obstacle.image.height * co.doubleduck.BaseGame.getScale();
			break;
		default:
		}
		if(this._hitboxDebug) {
			var obsRect = obstacle.getBoundingRect();
			var rect = new createjs.Shape();
			rect.graphics.beginFill("#FF0000");
			rect.graphics.drawRect(obsRect.x,obsRect.y,obsRect.width,obsRect.height);
			rect.graphics.endFill();
			rect.alpha = 0.3;
			this._elementsLayer.addChild(rect);
		}
		return true;
	}
	,elementsTimer: function(elapsed) {
		if(this._sessionEnded && this._elementSpeed <= 0.01) return;
		if(!this._sessionEnded) {
			var now = createjs.Ticker.getTime(true);
			if(now > this._lastObstacleSpawnTime + this._currElementSpawnInterval * 1000) {
				if(this.spawnObstacle()) this._lastObstacleSpawnTime = now; else this._lastObstacleSpawnTime += 1000;
			}
			if(this._currElementSpawnInterval > js.Boot.__cast(this._obstacleRates.end_interval , Float)) this._currElementSpawnInterval -= js.Boot.__cast(this._obstacleRates.decrease_rate , Float) * (elapsed / 1000);
			if(this._toucanTimes != null && now > this._nextToucanSpawnTime) {
				this.spawnToucan();
				this._nextToucanSpawnTime = now;
				this._nextToucanSpawnTime += this._toucanTimes.spawnInterval * 1000 * 0.2;
				this._nextToucanSpawnTime += Math.random() * 0.8 * this._toucanTimes.spawnInterval * 1000;
			}
			if(this._currElementSpawnInterval > js.Boot.__cast(this._obstacleRates.end_interval , Float)) this._currElementSpawnInterval -= js.Boot.__cast(this._obstacleRates.decrease_rate , Float) * (elapsed / 1000);
			this.spawnCollectablesByChance(elapsed);
		}
		var obstaclesToRemove = new Array();
		var toucansToRemove = new Array();
		var collectablesToRemove = new Array();
		if(this._sessionEnded) this._elementSpeed *= co.doubleduck.ScrollingBG.SLOWDOWN_RATE; else {
			this._elementSpeed += this._elementAccel * (elapsed / 1000);
			if(this._elementSpeed > this._elementMaxSpeed) this._elementSpeed = this._elementMaxSpeed;
		}
		var delta = this._elementSpeed * (elapsed / 1000) * co.doubleduck.BaseGame.getScale();
		this._distanceTraveled += delta / 30;
		this._hud.setDistance(this._distanceTraveled | 0);
		if(this._dodo.hasExploded()) {
			this._dodo.x -= delta * co.doubleduck.Session.BG_PARALLAX;
			this._dodoShade.visible = false;
		}
		var _g1 = 0, _g = this._obstacles.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._obstacles[i].x -= delta;
			if(this._obstacles[i].x + this._obstacles[i].image.width * co.doubleduck.BaseGame.getScale() < 0) obstaclesToRemove.push(this._obstacles[i]);
		}
		var _g1 = 0, _g = this._toucans.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this._toucans[i].hasLaunched()) {
				this._toucans[i].x -= delta;
				if(this._toucans[i].x + this._toucans[i].getWidth() * co.doubleduck.BaseGame.getScale() < 0) toucansToRemove.push(this._toucans[i]);
			}
		}
		var _g1 = 0, _g = this._collectables.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._collectables[i].x -= delta;
			if(this._collectables[i].x + this._collectables[i].image.width * co.doubleduck.BaseGame.getScale() < 0) collectablesToRemove.push(this._collectables[i]);
		}
		if(this._hitboxDebug) {
			var _g = 0, _g1 = this._elementsLayer.children;
			while(_g < _g1.length) {
				var element = _g1[_g];
				++_g;
				if(js.Boot.__instanceof(element,createjs.Shape)) element.x -= delta;
			}
		}
		var _g = 0;
		while(_g < obstaclesToRemove.length) {
			var obsToRemove = obstaclesToRemove[_g];
			++_g;
			HxOverrides.remove(this._obstacles,obsToRemove);
			this._elementsLayer.removeChild(obsToRemove);
		}
		var _g = 0;
		while(_g < toucansToRemove.length) {
			var toucan = toucansToRemove[_g];
			++_g;
			toucan.onTick = null;
			HxOverrides.remove(this._toucans,toucan);
			this._toucanLayer.removeChild(toucan);
		}
		var _g = 0;
		while(_g < collectablesToRemove.length) {
			var itemToRemove = collectablesToRemove[_g];
			++_g;
			HxOverrides.remove(this._collectables,itemToRemove);
			this._elementsLayer.removeChild(itemToRemove);
		}
	}
	,debugObjects: function() {
		this.spawnObstacle(9);
	}
	,isSessionEnded: function() {
		return this._sessionEnded;
	}
	,getTypeForPostcard: function() {
		return this._back.getLeftmostArea();
	}
	,getCoins: function() {
		return this._coinsCollected;
	}
	,getDistance: function() {
		return this._distanceTraveled | 0;
	}
	,_hitboxDebug: null
	,_remainingLives: null
	,_coinsCollected: null
	,_distanceTraveled: null
	,_dodoLife: null
	,_sessionEnded: null
	,_level: null
	,_fuelGain: null
	,_fuelDrainRate: null
	,_fuelStatus: null
	,_toucans: null
	,_collectRates: null
	,_collectables: null
	,_toucanTimes: null
	,_obstacleRates: null
	,_obstacles: null
	,_elementMaxSpeed: null
	,_elementAccel: null
	,_elementSpeed: null
	,_nextLifeSpawnTime: null
	,_nextJewelSpawnTime: null
	,_nextCoinSpawnTime: null
	,_nextFuelSpawnTime: null
	,_lastCollisionTestTime: null
	,_nextToucanSpawnTime: null
	,_lastObstacleSpawnTime: null
	,_currElementSpawnInterval: null
	,_hud: null
	,_overlay: null
	,_treeBurst: null
	,_tree: null
	,_dodoShade: null
	,_dodo: null
	,_toucanLayer: null
	,_elementsLayer: null
	,_back: null
	,_sky: null
	,__class__: co.doubleduck.Session
});
co.doubleduck.Shop = $hxClasses["co.doubleduck.Shop"] = function() {
	this._currSelected = -1;
	createjs.Container.call(this);
	if(co.doubleduck.Shop._font == null) co.doubleduck.Shop._font = new co.doubleduck.FontHelper("images/general/font_small/");
	this._containBox = new createjs.Container();
	this._containBox.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._containBox.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._containBox);
	this._backBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/general/btn_back.png"));
	this._backBtn.scaleX = this._backBtn.scaleY = co.doubleduck.BaseGame.getScale();
	this._backBtn.onClick = $bind(this,this.handleBackToMain);
	this._containBox.addChild(this._backBtn);
	this._shopItems = new Array();
	var _g = 0;
	while(_g < 9) {
		var i = _g++;
		var item = new co.doubleduck.ShopItem(i);
		item.scaleX = item.scaleY = co.doubleduck.BaseGame.getScale();
		item.onSelected = $bind(this,this.handleItemSelected);
		item.x = i % 3 * (item.getWidth() + co.doubleduck.Shop.PADDING) * co.doubleduck.BaseGame.getScale();
		item.y = this._backBtn.image.height * co.doubleduck.BaseGame.getScale() + co.doubleduck.Shop.PADDING;
		item.y += (i / 3 | 0) * item.getHeight() * co.doubleduck.BaseGame.getScale();
		this._containBox.addChild(item);
		this._shopItems.push(item);
	}
	this._shopItems[0].highlight();
	this.handleItemSelected(this._shopItems[0]);
	this._containBox.regX = (this._shopItems[0].getWidth() * 3 + this._itemDetails.image.width + co.doubleduck.Shop.PADDING * 3) * 0.5 * co.doubleduck.BaseGame.getScale();
	this._containBox.regY = (this._shopItems[0].getHeight() * 3 + this._backBtn.image.height + co.doubleduck.Shop.PADDING * 3) * 0.5 * co.doubleduck.BaseGame.getScale();
};
co.doubleduck.Shop.__name__ = ["co","doubleduck","Shop"];
co.doubleduck.Shop._font = null;
co.doubleduck.Shop.__super__ = createjs.Container;
co.doubleduck.Shop.prototype = $extend(createjs.Container.prototype,{
	handleBackToMain: function() {
		this.onBackToMain();
	}
	,handleBuyClicked: function() {
		co.doubleduck.SoundManager.playEffect("sound/buy_item");
		if(this._currSelected >= 0 && this._currSelected <= 2) co.doubleduck.Persistence.setJetLevel(this._currSelected + 1); else if(this._currSelected >= 3 && this._currSelected <= 5) co.doubleduck.Persistence.setLifeLevel(this._currSelected - 3 + 1); else if(this._currSelected == 6) co.doubleduck.Persistence.setCharmJewel(true); else if(this._currSelected == 7) co.doubleduck.Persistence.setCharmLife(true); else if(this._currSelected == 8) co.doubleduck.Persistence.setCharmFuel(true);
		co.doubleduck.Persistence.setMoneyCount(co.doubleduck.Persistence.getMoneyCount() - this._shopItems[this._currSelected].getPrice());
		var _g1 = 0, _g = this._shopItems.length;
		while(_g1 < _g) {
			var i = _g1++;
			this._shopItems[i].reload();
		}
		this._shopItems[this._currSelected].highlight();
		this.updateDetails();
		this.updateMoneyCount();
	}
	,updateMoneyCount: function() {
		if(this._coinsText != null) {
			this._containBox.removeChild(this._coinsText);
			this._coinsText = null;
		}
		var dims = new createjs.Rectangle(0,0,0,0);
		this._coinsText = co.doubleduck.Shop._font.getNumber(co.doubleduck.Persistence.getMoneyCount(),1,true,dims,-4);
		this._coinsText.scaleX = this._coinsText.scaleY = co.doubleduck.BaseGame.getScale();
		this._coinsText.regX = dims.width;
		this._coinsText.regY = dims.height / 2;
		this._coinsText.x = this._itemDetails.x + this._itemDetails.image.width * co.doubleduck.BaseGame.getScale();
		this._coinsText.y = this._itemDetails.y - dims.height * 0.5 - co.doubleduck.BaseGame.getScale() * 4;
		this._containBox.addChild(this._coinsText);
		if(this._coin == null) {
			this._coin = co.doubleduck.BaseAssets.getImage("images/general/font_small/dollar.png");
			this._coin.scaleX = this._coin.scaleY = co.doubleduck.BaseGame.getScale();
			this._coin.regY = this._coin.image.height / 2;
			this._coin.y = this._coinsText.y;
			this._containBox.addChild(this._coin);
		}
		if(this._coinsLabel == null) {
			this._coinsLabel = co.doubleduck.BaseAssets.getImage("images/shop/total_coins.png");
			this._coinsLabel.scaleX = this._coinsLabel.scaleY = co.doubleduck.BaseGame.getScale();
			this._coinsLabel.regX = this._coinsLabel.image.width;
			this._coinsLabel.regY = this._coinsLabel.image.height / 2;
			this._coinsLabel.y = this._coinsText.y - co.doubleduck.BaseGame.getScale();
			this._containBox.addChild(this._coinsLabel);
		}
		this._coin.x = this._coinsText.x - (this._coin.image.width - 4 + dims.width) * co.doubleduck.BaseGame.getScale();
		this._coinsLabel.x = this._coin.x;
	}
	,updateDetails: function() {
		if(this._itemDetails != null) {
			this._containBox.removeChild(this._itemDetails);
			this._itemDetails = null;
		}
		this._itemDetails = co.doubleduck.BaseAssets.getImage("images/shop/shop_text/" + (this._currSelected + 1) + ".png");
		this._itemDetails.scaleX = this._itemDetails.scaleY = co.doubleduck.BaseGame.getScale();
		this._itemDetails.x = this._shopItems[2].x + (this._shopItems[2].getWidth() + co.doubleduck.Shop.PADDING) * co.doubleduck.BaseGame.getScale();
		this._itemDetails.y = this._shopItems[2].y;
		this._containBox.addChild(this._itemDetails);
		if(this._buyBtn != null) {
			this._buyBtn.onClick = null;
			this._containBox.removeChild(this._buyBtn);
			this._buyBtn = null;
		}
		if(this._shopItems[this._currSelected].isLocked() || this._shopItems[this._currSelected].isPurchased() || this._shopItems[this._currSelected].getPrice() > co.doubleduck.Persistence.getMoneyCount()) {
			this._buyBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/shop/btn_buy_off.png"));
			this._buyBtn.alpha = 0.6;
		} else {
			this._buyBtn = new co.doubleduck.Button(co.doubleduck.BaseAssets.getImage("images/shop/btn_buy.png"));
			this._buyBtn.onClick = $bind(this,this.handleBuyClicked);
		}
		this._buyBtn.scaleX = this._buyBtn.scaleY = co.doubleduck.BaseGame.getScale();
		this._buyBtn.regY = this._buyBtn.image.height;
		this._buyBtn.x = this._itemDetails.x;
		this._buyBtn.y = this._shopItems[8].y + this._shopItems[8].getHeight() * co.doubleduck.BaseGame.getScale();
		this._containBox.addChild(this._buyBtn);
		this.updateMoneyCount();
	}
	,handleItemSelected: function(item) {
		if(this._currSelected != -1) {
			this._shopItems[this._currSelected].unhighlight();
			co.doubleduck.SoundManager.playEffect("sound/button_click");
		}
		this._currSelected = item.getId();
		this.updateDetails();
	}
	,_currSelected: null
	,_coinsText: null
	,_coin: null
	,_coinsLabel: null
	,_buyBtn: null
	,_itemDetails: null
	,_shopItems: null
	,_backBtn: null
	,_containBox: null
	,onBackToMain: null
	,__class__: co.doubleduck.Shop
});
co.doubleduck.ShopItem = $hxClasses["co.doubleduck.ShopItem"] = function(id) {
	createjs.Container.call(this);
	if(co.doubleduck.ShopItem._font == null) co.doubleduck.ShopItem._font = new co.doubleduck.FontHelper("images/general/font_small/");
	this._id = id;
	this._itemData = co.doubleduck.DataLoader.getShopItems()[this._id];
	this.loadItem();
};
co.doubleduck.ShopItem.__name__ = ["co","doubleduck","ShopItem"];
co.doubleduck.ShopItem._font = null;
co.doubleduck.ShopItem._backSheet = null;
co.doubleduck.ShopItem.__super__ = createjs.Container;
co.doubleduck.ShopItem.prototype = $extend(createjs.Container.prototype,{
	unloadItem: function() {
		this._back.onClick = null;
		this.removeChild(this._back);
		this._back = null;
		this._highlight.visible = false;
		this.removeChild(this._highlight);
		this._highlight = null;
		this.removeChild(this._icon);
		this._icon = null;
		this._bottomText.removeAllChildren();
		this.removeChild(this._bottomText);
		this._bottomText = null;
	}
	,handleClick: function() {
		this.onSelected(this);
		this.highlight();
	}
	,isPurchased: function() {
		var data = co.doubleduck.Persistence.getDodoData();
		if(this._id >= 0 && this._id <= 2) return data.jetLevel >= this._id + 1; else if(this._id >= 3 && this._id <= 5) return data.lifeLevel >= this._id - 3 + 1; else if(this._id == 6) return data.charmJewel; else if(this._id == 7) return data.charmLife; else if(this._id == 8) return data.charmFuel;
		return false;
	}
	,isLocked: function() {
		var data = co.doubleduck.Persistence.getDodoData();
		if(this._id >= 0 && this._id <= 2) return data.jetLevel + 1 < this._id + 1; else if(this._id >= 3 && this._id <= 5) return data.lifeLevel + 1 < this._id - 3 + 1; else if(this._id >= 6 && this._id <= 8) return false;
		return true;
	}
	,reload: function() {
		this.unloadItem();
		this.loadItem();
	}
	,getPrice: function() {
		return this._itemData.price;
	}
	,getId: function() {
		return this._id;
	}
	,getHeight: function() {
		return 95;
	}
	,getWidth: function() {
		return 115;
	}
	,unhighlight: function() {
		this._highlight.visible = false;
	}
	,highlight: function() {
		this._highlight.visible = true;
	}
	,loadItem: function() {
		if(co.doubleduck.ShopItem._backSheet == null) {
			var initObject;
			var img = co.doubleduck.BaseAssets.getRawImage("images/shop/shop_box.png");
			initObject = { };
			initObject.images = [img];
			initObject.frames = { width : this.getWidth(), height : this.getHeight(), regX : 0, regY : 0};
			initObject.animations = { };
			initObject.animations.normal = { frames : 0, frequency : 1};
			initObject.animations.owned = { frames : 1, frequency : 1};
			initObject.animations.locked = { frames : 2, frequency : 1};
			co.doubleduck.ShopItem._backSheet = new createjs.SpriteSheet(initObject);
		}
		this._back = new createjs.BitmapAnimation(co.doubleduck.ShopItem._backSheet);
		this._back.onClick = $bind(this,this.handleClick);
		this.addChild(this._back);
		this._highlight = co.doubleduck.BaseAssets.getImage("images/shop/box_highlight.png");
		this._highlight.visible = false;
		this.addChild(this._highlight);
		this._icon = co.doubleduck.BaseAssets.getImage("images/shop/shop_goods/" + (this._id + 1) + ".png");
		this._icon.regX = this._icon.image.width / 2;
		this._icon.regY = this._icon.image.height / 2;
		this._icon.x = this.getWidth() / 2;
		this._icon.y = this.getHeight() * 0.32;
		this.addChild(this._icon);
		this._bottomText = new createjs.Container();
		this._bottomText.x = this.getWidth() * 0.5;
		this._bottomText.y = this.getHeight() * 0.73;
		this.addChild(this._bottomText);
		if(this.isPurchased()) {
			this._back.gotoAndStop("owned");
			this._icon.alpha = 0.5;
			var ownedText = co.doubleduck.BaseAssets.getImage("images/shop/owned.png");
			ownedText.regX = ownedText.image.width / 2;
			ownedText.regY = ownedText.image.height / 2;
			this._bottomText.addChild(ownedText);
		} else if(this.isLocked()) {
			this._back.gotoAndStop("locked");
			this._icon.alpha = 0.5;
			var lockText = co.doubleduck.BaseAssets.getImage("images/shop/locked.png");
			lockText.regX = lockText.image.width / 2;
			lockText.regY = lockText.image.height / 2;
			this._bottomText.addChild(lockText);
		} else {
			this._back.gotoAndStop("normal");
			var coin = co.doubleduck.BaseAssets.getImage("images/general/font_small/dollar.png");
			coin.regY = coin.image.height / 2;
			this._bottomText.addChild(coin);
			var dims = new createjs.Rectangle(0,0,0,0);
			var price = co.doubleduck.ShopItem._font.getNumber(this._itemData.price,1,false,dims,-4);
			price.x = coin.x;
			price.y = coin.y;
			price.regX = 0;
			this._bottomText.addChild(price);
			var totalW = dims.width + coin.image.width - 2;
			coin.x -= totalW / 2;
			price.x = coin.x + coin.image.width - 2;
		}
	}
	,_itemData: null
	,_id: null
	,_bottomText: null
	,_icon: null
	,_highlight: null
	,_back: null
	,onSelected: null
	,__class__: co.doubleduck.ShopItem
});
co.doubleduck.SoundType = $hxClasses["co.doubleduck.SoundType"] = { __ename__ : ["co","doubleduck","SoundType"], __constructs__ : ["WEB_AUDIO","AUDIO_FX","AUDIO_NO_OVERLAP","HOWLER","NONE"] }
co.doubleduck.SoundType.WEB_AUDIO = ["WEB_AUDIO",0];
co.doubleduck.SoundType.WEB_AUDIO.toString = $estr;
co.doubleduck.SoundType.WEB_AUDIO.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_FX = ["AUDIO_FX",1];
co.doubleduck.SoundType.AUDIO_FX.toString = $estr;
co.doubleduck.SoundType.AUDIO_FX.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP = ["AUDIO_NO_OVERLAP",2];
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.toString = $estr;
co.doubleduck.SoundType.AUDIO_NO_OVERLAP.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.HOWLER = ["HOWLER",3];
co.doubleduck.SoundType.HOWLER.toString = $estr;
co.doubleduck.SoundType.HOWLER.__enum__ = co.doubleduck.SoundType;
co.doubleduck.SoundType.NONE = ["NONE",4];
co.doubleduck.SoundType.NONE.toString = $estr;
co.doubleduck.SoundType.NONE.__enum__ = co.doubleduck.SoundType;
if(!co.doubleduck.audio) co.doubleduck.audio = {}
co.doubleduck.audio.AudioAPI = $hxClasses["co.doubleduck.audio.AudioAPI"] = function() { }
co.doubleduck.audio.AudioAPI.__name__ = ["co","doubleduck","audio","AudioAPI"];
co.doubleduck.audio.AudioAPI.prototype = {
	setVolume: null
	,pause: null
	,stop: null
	,playMusic: null
	,playEffect: null
	,init: null
	,__class__: co.doubleduck.audio.AudioAPI
}
co.doubleduck.audio.WebAudioAPI = $hxClasses["co.doubleduck.audio.WebAudioAPI"] = function(src) {
	this._src = src;
	this.loadAudioFile(this._src);
};
co.doubleduck.audio.WebAudioAPI.__name__ = ["co","doubleduck","audio","WebAudioAPI"];
co.doubleduck.audio.WebAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.WebAudioAPI.context = null;
co.doubleduck.audio.WebAudioAPI.webAudioInit = function() {
	co.doubleduck.audio.WebAudioAPI.context = new webkitAudioContext();
}
co.doubleduck.audio.WebAudioAPI.saveBuffer = function(buffer,name) {
	co.doubleduck.audio.WebAudioAPI._buffers[name] = buffer;
}
co.doubleduck.audio.WebAudioAPI.decodeError = function() {
	null;
}
co.doubleduck.audio.WebAudioAPI.prototype = {
	setVolume: function(volume) {
		if(this._gainNode != null) this._gainNode.gain.value = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._source != null) this._source.noteOff(0);
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		this.playBuffer(this._src,loop);
		this.setVolume(volume);
	}
	,playBuffer: function(name,loop) {
		if(loop == null) loop = false;
		if(this._gainNode == null) {
			this._gainNode = co.doubleduck.audio.WebAudioAPI.context.createGainNode();
			this._gainNode.connect(co.doubleduck.audio.WebAudioAPI.context.destination);
		}
		this._buffer = Reflect.getProperty(co.doubleduck.audio.WebAudioAPI._buffers,this._src);
		if(this._buffer == null) return;
		this._source = co.doubleduck.audio.WebAudioAPI.context.createBufferSource();
		this._source.buffer = this._buffer;
		this._source.loop = loop;
		this._source.connect(this._gainNode);
		this._source.noteOn(0);
	}
	,loadAudioFile: function(src) {
		var request = new XMLHttpRequest();
		request.open("get",src,true);
		request.responseType = "arraybuffer";
		request.onload = function() { co.doubleduck.audio.WebAudioAPI.context.decodeAudioData(request.response, function(decodedBuffer) { buffer = decodedBuffer; co.doubleduck.audio.WebAudioAPI.saveBuffer(buffer,src); }, co.doubleduck.audio.WebAudioAPI.decodeError) }
		request.send();
	}
	,init: function() {
	}
	,_source: null
	,_gainNode: null
	,_buffer: null
	,_src: null
	,__class__: co.doubleduck.audio.WebAudioAPI
}
co.doubleduck.SoundManager = $hxClasses["co.doubleduck.SoundManager"] = function() {
};
co.doubleduck.SoundManager.__name__ = ["co","doubleduck","SoundManager"];
co.doubleduck.SoundManager.engineType = null;
co.doubleduck.SoundManager.EXTENSION = null;
co.doubleduck.SoundManager.getPersistedMute = function() {
	var mute = co.doubleduck.BasePersistence.getValue("mute");
	if(mute == "0") {
		mute = "false";
		co.doubleduck.SoundManager.setPersistedMute(false);
	}
	return mute == "true";
}
co.doubleduck.SoundManager.setPersistedMute = function(mute) {
	var val = "true";
	if(!mute) val = "false";
	co.doubleduck.BasePersistence.setValue("mute",val);
}
co.doubleduck.SoundManager.isSoundAvailable = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	var isChrome = /Chrome/.test(navigator.userAgent);
	var isMobile = /Mobile/.test(navigator.userAgent);
	var isAndroid = /Android/.test(navigator.userAgent);
	var isAndroid4 = /Android 4/.test(navigator.userAgent);
	var isSafari = /Safari/.test(navigator.userAgent);
	var agent = navigator.userAgent;
	var reg = new EReg("iPhone OS 6","");
	var isIOS6 = reg.match(agent) && isSafari && isMobile;
	var isIpad = /iPad/.test(navigator.userAgent);
	isIpad = isIpad && /OS 6/.test(navigator.userAgent);
	isIOS6 = isIOS6 || isIpad;
	if(isFirefox) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_FX;
		co.doubleduck.SoundManager.EXTENSION = ".ogg";
		return true;
	}
	if(isChrome && (!isAndroid && !isMobile)) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	if(isIOS6) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.WEB_AUDIO;
		co.doubleduck.audio.WebAudioAPI.webAudioInit();
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	} else if(isAndroid4 && !isChrome) {
		co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.AUDIO_NO_OVERLAP;
		co.doubleduck.SoundManager.EXTENSION = ".mp3";
		return true;
	}
	co.doubleduck.SoundManager.engineType = co.doubleduck.SoundType.NONE;
	co.doubleduck.BasePersistence.initVar("mute");
	return false;
}
co.doubleduck.SoundManager.mute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = true;
	var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
	while(_g1 < _g) {
		var currSound = _g1++;
		var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
		if(mySound != null) mySound.setVolume(0);
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.unmute = function(persisted) {
	if(persisted == null) persisted = true;
	if(!co.doubleduck.SoundManager.available) return;
	co.doubleduck.SoundManager._muted = false;
	try {
		var _g1 = 0, _g = Reflect.fields(co.doubleduck.SoundManager._cache).length;
		while(_g1 < _g) {
			var currSound = _g1++;
			var mySound = Reflect.getProperty(co.doubleduck.SoundManager._cache,Reflect.fields(co.doubleduck.SoundManager._cache)[currSound]);
			if(mySound != null) mySound.setVolume(1);
		}
	} catch( e ) {
		null;
	}
	if(persisted) co.doubleduck.SoundManager.setPersistedMute(co.doubleduck.SoundManager._muted);
}
co.doubleduck.SoundManager.toggleMute = function() {
	if(co.doubleduck.SoundManager._muted) co.doubleduck.SoundManager.unmute(); else co.doubleduck.SoundManager.mute();
}
co.doubleduck.SoundManager.isMuted = function() {
	co.doubleduck.SoundManager._muted = co.doubleduck.SoundManager.getPersistedMute();
	return co.doubleduck.SoundManager._muted;
}
co.doubleduck.SoundManager.getAudioInstance = function(src) {
	if(!co.doubleduck.SoundManager.available) return new co.doubleduck.audio.DummyAudioAPI();
	src += co.doubleduck.SoundManager.EXTENSION;
	var audio = Reflect.getProperty(co.doubleduck.SoundManager._cache,src);
	if(audio == null) {
		switch( (co.doubleduck.SoundManager.engineType)[1] ) {
		case 1:
			audio = new co.doubleduck.audio.AudioFX(src);
			break;
		case 0:
			audio = new co.doubleduck.audio.WebAudioAPI(src);
			break;
		case 2:
			audio = new co.doubleduck.audio.NonOverlappingAudio(src);
			break;
		case 3:
			audio = new co.doubleduck.audio.HowlerAudio(src);
			break;
		case 4:
			return new co.doubleduck.audio.DummyAudioAPI();
		}
		Reflect.setProperty(co.doubleduck.SoundManager._cache,src,audio);
	}
	return audio;
}
co.doubleduck.SoundManager.playEffect = function(src,volume,optional) {
	if(optional == null) optional = false;
	if(volume == null) volume = 1;
	if(optional && co.doubleduck.SoundManager.engineType == co.doubleduck.SoundType.AUDIO_NO_OVERLAP) return new co.doubleduck.audio.DummyAudioAPI();
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playEffect(playVolume);
	return audio;
}
co.doubleduck.SoundManager.playMusic = function(src,volume,loop) {
	if(loop == null) loop = true;
	if(volume == null) volume = 1;
	var audio = co.doubleduck.SoundManager.getAudioInstance(src);
	var playVolume = volume;
	if(co.doubleduck.SoundManager._muted) playVolume = 0;
	audio.playMusic(playVolume,loop);
	return audio;
}
co.doubleduck.SoundManager.initSound = function(src) {
	co.doubleduck.SoundManager.getAudioInstance(src);
}
co.doubleduck.SoundManager.prototype = {
	__class__: co.doubleduck.SoundManager
}
co.doubleduck.Splash = $hxClasses["co.doubleduck.Splash"] = function() {
	createjs.Container.call(this);
	var scale = co.doubleduck.BaseGame.getScale();
	this._sky = co.doubleduck.Utils.getCenteredImage("images/session/sky.png",true);
	this._sky.x = co.doubleduck.BaseGame.getViewport().width / 2;
	this._sky.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._sky);
	this._back = co.doubleduck.Utils.getCenteredImage("images/session/bgs/bg1a.png",true);
	this._back.regX = 0;
	this._back.y = co.doubleduck.BaseGame.getViewport().height / 2;
	this.addChild(this._back);
	this._dodo = co.doubleduck.BaseAssets.getImage("images/splash/dodo_splash.png");
	this._dodo.scaleX = this._dodo.scaleY = co.doubleduck.BaseGame.getScale();
	this._dodo.x = scale * -180;
	this._dodo.y = scale * 800;
	this._dodoLayer = new createjs.Container();
	this._dodoLayer.addChild(this._dodo);
	this.addChild(this._dodoLayer);
	createjs.Tween.get(this._dodo).to({ x : scale * -10, y : scale * 112},1900,createjs.Ease.quintOut);
	createjs.Tween.get(this._dodoLayer).to({ x : scale * 10, y : scale * -100},3000,createjs.Ease.quintOut);
	this.addLeaves();
	this.showLogo();
};
co.doubleduck.Splash.__name__ = ["co","doubleduck","Splash"];
co.doubleduck.Splash.__super__ = createjs.Container;
co.doubleduck.Splash.prototype = $extend(createjs.Container.prototype,{
	fadeToMenu: function() {
		var overlay = new createjs.Shape();
		overlay.graphics.beginFill("#000000");
		overlay.graphics.drawRect(0,0,co.doubleduck.BaseGame.getViewport().width,co.doubleduck.BaseGame.getViewport().height);
		overlay.graphics.endFill();
		overlay.alpha = 0;
		this.addChildAt(overlay,this.getChildIndex(this._logo));
		this.onAddMenu();
		this.onAddMenu = null;
		createjs.Tween.get(overlay).to({ alpha : 0.85},400).call(this.onRemoveSplash);
	}
	,dodoFlyOut: function() {
		createjs.Tween.get(this._dodo).to({ x : co.doubleduck.BaseGame.getViewport().height * 0.6, y : -co.doubleduck.BaseGame.getViewport().height * 2},1100,createjs.Ease.quintIn);
		createjs.Tween.get(this._dodoLayer).to({ x : 10, y : -100},1100,createjs.Ease.quintIn);
		var pos = new Array();
		var angles = new Array();
		var scale = co.doubleduck.BaseGame.getScale();
		pos.push(new createjs.Point(-140,1310));
		angles.push(-400);
		pos.push(new createjs.Point(70,1370));
		angles.push(-250);
		pos.push(new createjs.Point(260,1260));
		angles.push(400);
		pos.push(new createjs.Point(390,1430));
		angles.push(300);
		pos.push(new createjs.Point(550,1370));
		angles.push(400);
		var _g1 = 0, _g = this._leaves.length;
		while(_g1 < _g) {
			var i = _g1++;
			createjs.Tween.get(this._leaves[i]).to({ y : this._leaves[i].y - 20 * scale},400,createjs.Ease.sineInOut).to({ y : pos[i].y * scale},2300,createjs.Ease.circInOut);
			createjs.Tween.get(this._leaves[i]).to({ x : pos[i].x * scale},1600,createjs.Ease.circIn);
			createjs.Tween.get(this._leaves[i]).to({ rotation : angles[i]},1600,createjs.Ease.quintIn);
		}
		createjs.Tween.get(this._logo).wait(1000).to({ x : co.doubleduck.BaseGame.getViewport().width / 2},800,createjs.Ease.sineInOut).call($bind(this,this.fadeToMenu));
	}
	,handleTap2Play: function() {
		this._back.onClick = null;
		this._back.mouseEnabled = false;
		if(this._tapToPlay == null) {
			var elements = [this._dodo,this._dodoLayer,this._logoFlying.mask];
			var _g1 = 0, _g = elements.length;
			while(_g1 < _g) {
				var i = _g1++;
				if(elements[i] != null) createjs.Tween.removeTweens(elements[i]);
			}
			if(this._leaves != null) {
				var _g1 = 0, _g = this._leaves.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(this._leaves[i] != null) createjs.Tween.removeTweens(this._leaves[i]);
				}
			}
			if(this._logoLetters != null) {
				var _g1 = 0, _g = this._logoLetters.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(this._logoLetters[i] != null) createjs.Tween.removeTweens(this._logoLetters[i]);
				}
			}
			this.onAddMenu();
			this.onAddMenu = null;
			createjs.Tween.get(this).to({ alpha : 0},300).call(this.onRemoveSplash);
		} else {
			createjs.Tween.removeTweens(this._tapToPlay);
			this._logo.removeChild(this._tapToPlay);
			this._tapToPlay = null;
			this.dodoFlyOut();
		}
	}
	,alphaFade: function() {
		if(this._tapToPlay == null) return;
		if(this._tapToPlay.alpha == 0) createjs.Tween.get(this._tapToPlay).to({ alpha : 1},750).call($bind(this,this.alphaFade)); else if(this._tapToPlay.alpha == 1) createjs.Tween.get(this._tapToPlay).to({ alpha : 0},1500).call($bind(this,this.alphaFade));
	}
	,showTap2Play: function() {
		this._tapToPlay = co.doubleduck.Utils.getCenteredImage("images/splash/tap2play.png",true);
		this._tapToPlay.x = this._logoFlying.image.width * co.doubleduck.BaseGame.getScale() * 0.5;
		this._tapToPlay.y = this._logoFlying.image.height * co.doubleduck.BaseGame.getScale() * 1.2;
		this._tapToPlay.alpha = 0;
		this._logo.addChild(this._tapToPlay);
		this.alphaFade();
	}
	,showLetters: function() {
		var letterIds = [2,4,1,3];
		this._logoLetters = new Array();
		var lastTween = null;
		var timeDelay = 10;
		var scale = co.doubleduck.BaseGame.getScale();
		var _g = 0;
		while(_g < 4) {
			var i = _g++;
			var letter = co.doubleduck.BaseAssets.getImage("images/splash/logo/" + letterIds[i] + ".png");
			letter.regX = letter.image.width / 2;
			letter.regY = letter.image.height * 0.8;
			letter.x = letter.image.width * scale * 0.5;
			letter.y = letter.image.height * scale * 0.8;
			letter.scaleX = letter.scaleY = scale * 0.1;
			letter.alpha = 0;
			this._logo.addChild(letter);
			this._logoLetters.push(letter);
			lastTween = createjs.Tween.get(letter).wait(timeDelay).to({ scaleX : scale, scaleY : scale, alpha : 1},300,createjs.Ease.circOut);
			timeDelay += 110 + i * 10;
		}
		lastTween.call($bind(this,this.showTap2Play));
	}
	,showLogo: function() {
		this._logo = new createjs.Container();
		this.addChild(this._logo);
		this._logoFlying = co.doubleduck.BaseAssets.getImage("images/splash/logo/flying.png");
		this._logoFlying.scaleX = this._logoFlying.scaleY = co.doubleduck.BaseGame.getScale();
		this._logo.regX = this._logoFlying.image.width * co.doubleduck.BaseGame.getScale() * 0.5;
		this._logo.x = co.doubleduck.BaseGame.getViewport().width - co.doubleduck.BaseGame.getScale() * (this._logoFlying.image.width * 0.5 + 30);
		this._logo.y = co.doubleduck.BaseGame.getViewport().height * 0.15;
		var mask = new createjs.Shape();
		mask.graphics.beginFill("#000000");
		mask.graphics.drawRect(0,0,this._logoFlying.image.width * co.doubleduck.BaseGame.getScale(),this._logoFlying.image.height * co.doubleduck.BaseGame.getScale());
		mask.graphics.endFill();
		mask.x = this._logoFlying.x - this._logoFlying.image.width * co.doubleduck.BaseGame.getScale();
		mask.y = this._logoFlying.y;
		this._logoFlying.mask = mask;
		this._logo.addChild(this._logoFlying);
		createjs.Tween.get(mask).wait(1400).to({ x : this._logoFlying.x},350,createjs.Ease.sineIn).call($bind(this,this.showLetters));
		this._back.mouseEnabled = true;
		this._back.onClick = $bind(this,this.handleTap2Play);
	}
	,addLeaves: function() {
		this._leaves = new Array();
		var pos = new Array();
		var angles = new Array();
		var scale = co.doubleduck.BaseGame.getScale();
		pos.push(new createjs.Point(40,370));
		angles.push(70);
		pos.push(new createjs.Point(130,450));
		angles.push(-70);
		pos.push(new createjs.Point(210,360));
		angles.push(70);
		pos.push(new createjs.Point(260,490));
		angles.push(70);
		pos.push(new createjs.Point(340,430));
		angles.push(-70);
		var _g = 0;
		while(_g < 5) {
			var i = _g++;
			var leaf = co.doubleduck.Utils.getCenteredImage("images/splash/leaf" + (Std.random(4) + 1) + ".png",true);
			leaf.scaleX = leaf.scaleY = co.doubleduck.BaseGame.getScale();
			leaf.x = this._dodo.image.width * co.doubleduck.BaseGame.getScale() * 0.5;
			leaf.y = this._dodo.y;
			this._leaves.push(leaf);
			this._dodoLayer.addChild(leaf);
			createjs.Tween.get(leaf).wait(100).to({ x : pos[i].x * scale, y : pos[i].y * scale},1300,createjs.Ease.quintOut);
			createjs.Tween.get(leaf).to({ rotation : angles[i] * scale},1000,createjs.Ease.quadOut);
		}
	}
	,_tapToPlay: null
	,_logoLetters: null
	,_logoFlying: null
	,_logo: null
	,_leaves: null
	,_dodo: null
	,_dodoLayer: null
	,_back: null
	,_sky: null
	,onRemoveSplash: null
	,onAddMenu: null
	,__class__: co.doubleduck.Splash
});
co.doubleduck.Toucan = $hxClasses["co.doubleduck.Toucan"] = function(yPos,timeToLaunch) {
	this._launched = false;
	createjs.Container.call(this);
	this.scaleX = this.scaleY = co.doubleduck.BaseGame.getScale();
	this.x = co.doubleduck.BaseGame.getViewport().width;
	this.y = yPos;
	this._body = co.doubleduck.BaseAssets.getImage("images/session/toucan.png");
	this._body.regY = this._body.image.height / 2;
	this._body.visible = false;
	this.addChild(this._body);
	var bodyW = this._body.image.width * co.doubleduck.BaseGame.getScale();
	var bodyH = this._body.image.height * co.doubleduck.BaseGame.getScale();
	this._hitbox = new createjs.Rectangle(0,-bodyH * 0.4,bodyW * 0.5,bodyH * 0.8);
	if(timeToLaunch > 0) {
		this._alert = co.doubleduck.BaseAssets.getImage("images/session/alert_toucan.png");
		this._alert.regX = this._alert.image.width;
		this._alert.regY = this._alert.image.height / 2;
		this._alert.alpha = 0;
		this.addChild(this._alert);
		var tween = createjs.Tween.get(this._alert).to({ alpha : 1, scaleX : 1.4, scaleY : 1.2},250,createjs.Ease.sineOut).to({ scaleX : 1, scaleY : 1},100,createjs.Ease.sineInOut);
		if(timeToLaunch > 700) tween.wait(timeToLaunch - 650).to({ scaleX : 1.2, scaleY : 1.2},50).to({ scaleX : 1, scaleY : 1},100).to({ scaleX : 1.2, scaleY : 1.2},50).to({ scaleX : 1, scaleY : 1},100);
		createjs.Tween.get(this).wait(timeToLaunch).call($bind(this,this.launch));
	} else this.launch();
};
co.doubleduck.Toucan.__name__ = ["co","doubleduck","Toucan"];
co.doubleduck.Toucan.__super__ = createjs.Container;
co.doubleduck.Toucan.prototype = $extend(createjs.Container.prototype,{
	handleTick: function(elapsed) {
		this.x -= this._speed * co.doubleduck.BaseGame.getScale() * (elapsed / 16);
	}
	,launch: function() {
		if(this._launched) return;
		this._launched = true;
		co.doubleduck.SoundManager.playEffect("sound/enemy_bird_sound");
		if(this._alert != null) {
			createjs.Tween.removeTweens(this._alert);
			this._alert.visible = false;
			this._alert = null;
		}
		this._body.visible = true;
		this._speed = 10;
		this.onTick = $bind(this,this.handleTick);
	}
	,hasLaunched: function() {
		return this._launched;
	}
	,getWidth: function() {
		return this._body.image.width;
	}
	,getBoundingRect: function() {
		var result = this._hitbox.clone();
		result.x += this.x;
		result.y += this.y;
		return result;
	}
	,_speed: null
	,_hitbox: null
	,_launched: null
	,_alert: null
	,_body: null
	,__class__: co.doubleduck.Toucan
});
co.doubleduck.Utils = $hxClasses["co.doubleduck.Utils"] = function() { }
co.doubleduck.Utils.__name__ = ["co","doubleduck","Utils"];
co.doubleduck.Utils.dateDeltaInDays = function(day1,day2) {
	var delta = Math.abs(day2.getTime() - day1.getTime());
	return delta / 86400000;
}
co.doubleduck.Utils.getTodayDate = function() {
	var newDate = new Date();
	return HxOverrides.dateStr(newDate);
}
co.doubleduck.Utils.getHour = function() {
	var newDate = new Date();
	return newDate.getHours();
}
co.doubleduck.Utils.rectOverlap = function(r1,r2) {
	var r1TopLeft = new createjs.Point(r1.x,r1.y);
	var r1BottomRight = new createjs.Point(r1.x + r1.width,r1.y + r1.height);
	var r1TopRight = new createjs.Point(r1.x + r1.width,r1.y);
	var r1BottomLeft = new createjs.Point(r1.x,r1.y + r1.height);
	var r2TopLeft = new createjs.Point(r2.x,r2.y);
	var r2BottomRight = new createjs.Point(r2.x + r2.width,r2.y + r2.height);
	var r2TopRight = new createjs.Point(r2.x + r2.width,r2.y);
	var r2BottomLeft = new createjs.Point(r2.x,r2.y + r2.height);
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r2TopLeft,r2BottomRight,r1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(r1TopLeft,r1BottomRight,r2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.overlap = function(obj1,obj1Width,obj1Height,obj2,obj2Width,obj2Height) {
	var o1TopLeft = new createjs.Point(obj1.x - obj1.regX * co.doubleduck.BaseGame.getScale(),obj1.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomRight = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale() + obj1Width * co.doubleduck.BaseGame.getScale(),o1TopLeft.y + obj1Height * co.doubleduck.BaseGame.getScale() - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1TopRight = new createjs.Point(o1BottomRight.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1TopLeft.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o1BottomLeft = new createjs.Point(o1TopLeft.x - obj1.regX * co.doubleduck.BaseGame.getScale(),o1BottomRight.y - obj1.regY * co.doubleduck.BaseGame.getScale());
	var o2TopLeft = new createjs.Point(obj2.x - obj2.regX * co.doubleduck.BaseGame.getScale(),obj2.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomRight = new createjs.Point(o2TopLeft.x + obj2Width * co.doubleduck.BaseGame.getScale() - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y + obj2Height * co.doubleduck.BaseGame.getScale() - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2TopRight = new createjs.Point(o2BottomRight.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2TopLeft.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	var o2BottomLeft = new createjs.Point(o2TopLeft.x - obj2.regX * co.doubleduck.BaseGame.getScale(),o2BottomRight.y - obj2.regY * co.doubleduck.BaseGame.getScale());
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o2TopLeft,o2BottomRight,o1BottomLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopLeft)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2TopRight)) return true;
	if(co.doubleduck.Utils.rectContainPoint(o1TopLeft,o1BottomRight,o2BottomLeft)) return true;
	return false;
}
co.doubleduck.Utils.rectContainPoint = function(rectTopLeft,rectBottomRight,point) {
	return point.x >= rectTopLeft.x && point.x <= rectBottomRight.x && point.y >= rectTopLeft.y && point.y <= rectBottomRight.y;
}
co.doubleduck.Utils.objectContains = function(dyn,memberName) {
	return Reflect.hasField(dyn,memberName);
}
co.doubleduck.Utils.contains = function(arr,obj) {
	var _g = 0;
	while(_g < arr.length) {
		var element = arr[_g];
		++_g;
		if(element == obj) return true;
	}
	return false;
}
co.doubleduck.Utils.isMobileFirefox = function() {
	var isFirefox = /Firefox/.test(navigator.userAgent);
	return isFirefox && viewporter.ACTIVE;
}
co.doubleduck.Utils.get = function(x,y,tiles,columns) {
	return tiles[columns * y + x];
}
co.doubleduck.Utils.getBitmapLabel = function(label,fontType,padding) {
	if(padding == null) padding = 0;
	if(fontType == null) fontType = "";
	var fontHelper = new co.doubleduck.FontHelper(fontType);
	var bitmapText = fontHelper.getNumber(Std.parseInt(label),1,true,null,padding);
	return bitmapText;
}
co.doubleduck.Utils.concatWithoutDuplicates = function(array,otherArray) {
	var _g = 0;
	while(_g < otherArray.length) {
		var element = otherArray[_g];
		++_g;
		co.doubleduck.Utils.addToArrayWithoutDuplicates(array,element);
	}
	return array;
}
co.doubleduck.Utils.addToArrayWithoutDuplicates = function(array,element) {
	var _g = 0;
	while(_g < array.length) {
		var currElement = array[_g];
		++_g;
		if(currElement == element) return array;
	}
	array.push(element);
	return array;
}
co.doubleduck.Utils.getImageData = function(image) {
	var ctx = co.doubleduck.Utils.getCanvasContext();
	var img = co.doubleduck.BaseAssets.getImage(image);
	ctx.drawImage(img.image,0,0);
	return ctx.getImageData(0,0,img.image.width,img.image.height);
}
co.doubleduck.Utils.getCanvasContext = function() {
	var dom = js.Lib.document.createElement("Canvas");
	var canvas = dom;
	return canvas.getContext("2d");
}
co.doubleduck.Utils.joinArrays = function(a1,a2) {
	var arr = a1.slice();
	var _g = 0;
	while(_g < a2.length) {
		var el = a2[_g];
		++_g;
		arr.push(el);
	}
	return arr;
}
co.doubleduck.Utils.getRandomElement = function(arr) {
	return arr[Std.random(arr.length)];
}
co.doubleduck.Utils.splitArray = function(arr,parts) {
	var arrs = new Array();
	var _g = 0;
	while(_g < parts) {
		var p = _g++;
		arrs.push(new Array());
	}
	var currArr = 0;
	while(arr.length > 0) {
		arrs[currArr].push(arr.pop());
		currArr++;
		currArr %= parts;
	}
	return arrs;
}
co.doubleduck.Utils.map = function(value,aMin,aMax,bMin,bMax) {
	if(bMax == null) bMax = 1;
	if(bMin == null) bMin = 0;
	if(value <= aMin) return bMin;
	if(value >= aMax) return bMax;
	return (value - aMin) * (bMax - bMin) / (aMax - aMin) + bMin;
}
co.doubleduck.Utils.waitAndCall = function(parent,delay,func,args) {
	createjs.Tween.get(parent).wait(delay).call(func,args);
}
co.doubleduck.Utils.tintBitmap = function(src,redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier) {
	var colorFilter = new createjs.ColorFilter(redMultiplier,greenMultiplier,blueMultiplier,alphaMultiplier);
	src.cache(src.x,src.y,src.image.width,src.image.height);
	src.filters = [colorFilter];
	src.updateCache();
}
co.doubleduck.Utils.containBitmaps = function(bitmapList,spacing,isRow,dims) {
	if(isRow == null) isRow = true;
	if(spacing == null) spacing = 0;
	var totalWidth = 0;
	var totalHeight = 0;
	var result = new createjs.Container();
	var _g1 = 0, _g = bitmapList.length;
	while(_g1 < _g) {
		var currBitmap = _g1++;
		var bmp = bitmapList[currBitmap];
		bmp.regY = bmp.image.height / 2;
		if(currBitmap != 0) {
			if(isRow) {
				bmp.x = bitmapList[currBitmap - 1].x + bitmapList[currBitmap - 1].image.width + spacing;
				if(bmp.image.height > totalHeight) totalHeight = bmp.image.height;
				totalWidth += bmp.image.width + spacing;
			} else {
				bmp.y = bitmapList[currBitmap - 1].y + bitmapList[currBitmap - 1].image.height + spacing;
				if(bmp.image.width > totalWidth) totalWidth = bmp.image.width;
				totalHeight += bmp.image.height + spacing;
			}
		} else {
			totalWidth = bmp.image.width;
			totalHeight = bmp.image.height;
		}
		result.addChild(bmp);
	}
	result.regX = totalWidth / 2;
	result.regY = totalHeight / 2;
	if(dims != null) {
		dims.width = totalWidth;
		dims.height = totalHeight;
	}
	return result;
}
co.doubleduck.Utils.getCenteredImage = function(name,scaleToGame) {
	if(scaleToGame == null) scaleToGame = false;
	var img = co.doubleduck.BaseAssets.getImage(name);
	img.regX = img.image.width / 2;
	img.regY = img.image.height / 2;
	if(scaleToGame) img.scaleX = img.scaleY = co.doubleduck.BaseGame.getScale();
	return img;
}
co.doubleduck.Utils.setCenterReg = function(bmp) {
	bmp.regX = bmp.image.width / 2;
	bmp.regY = bmp.image.height / 2;
}
co.doubleduck.Utils.shuffleArray = function(arr) {
	var tmp, j, i = arr.length;
	while(i > 0) {
		j = Math.random() * i | 0;
		tmp = arr[--i];
		arr[i] = arr[j];
		arr[j] = tmp;
	}
}
co.doubleduck.audio.AudioFX = $hxClasses["co.doubleduck.audio.AudioFX"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.AudioFX.__name__ = ["co","doubleduck","audio","AudioFX"];
co.doubleduck.audio.AudioFX.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.AudioFX._currentlyPlaying = null;
co.doubleduck.audio.AudioFX.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.setVolume(volume);
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,2);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		this._jsAudio = AudioFX(pathNoExtension, { loop: isLoop, pool: pool });
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.AudioFX
}
co.doubleduck.audio.DummyAudioAPI = $hxClasses["co.doubleduck.audio.DummyAudioAPI"] = function() {
};
co.doubleduck.audio.DummyAudioAPI.__name__ = ["co","doubleduck","audio","DummyAudioAPI"];
co.doubleduck.audio.DummyAudioAPI.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.DummyAudioAPI.prototype = {
	setVolume: function(volume) {
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
	}
	,init: function() {
	}
	,__class__: co.doubleduck.audio.DummyAudioAPI
}
co.doubleduck.audio.HowlerAudio = $hxClasses["co.doubleduck.audio.HowlerAudio"] = function(src) {
	this._jsAudio = null;
	this._src = src;
	this._loop = false;
	this._volume = 1;
};
co.doubleduck.audio.HowlerAudio.__name__ = ["co","doubleduck","audio","HowlerAudio"];
co.doubleduck.audio.HowlerAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.HowlerAudio._currentlyPlaying = null;
co.doubleduck.audio.HowlerAudio.prototype = {
	setVolume: function(volume) {
		this._volume = volume;
		if(this._jsAudio != null) this._jsAudio.volume = volume;
	}
	,pause: function() {
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		this._jsAudio.stop();
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(this._jsAudio == null) this.load(loop,1);
		this._jsAudio.play();
		this.setVolume(volume);
	}
	,load: function(isLoop,pool) {
		if(pool == null) pool = 1;
		var pathNoExtension = this._src;
		var myUrls = new Array();
		myUrls.push(this._src + ".mp3");
		myUrls.push(this._src + ".ogg");
		this._jsAudio = new Howl({urls: myUrls, loop: false});
	}
	,init: function() {
	}
	,_volume: null
	,_loop: null
	,_jsAudio: null
	,_src: null
	,__class__: co.doubleduck.audio.HowlerAudio
}
co.doubleduck.audio.NonOverlappingAudio = $hxClasses["co.doubleduck.audio.NonOverlappingAudio"] = function(src) {
	this._src = src;
	this.load();
	this._isMusic = false;
};
co.doubleduck.audio.NonOverlappingAudio.__name__ = ["co","doubleduck","audio","NonOverlappingAudio"];
co.doubleduck.audio.NonOverlappingAudio.__interfaces__ = [co.doubleduck.audio.AudioAPI];
co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = null;
co.doubleduck.audio.NonOverlappingAudio.prototype = {
	getSrc: function() {
		return this._src;
	}
	,audio: function() {
		return this._audio;
	}
	,setVolume: function(volume) {
		if(this._audio != null) this._audio.volume = volume;
	}
	,pause: function() {
		if(this._audio != null) this._audio.pause();
	}
	,stop: function(fadeOut) {
		if(fadeOut == null) fadeOut = 0;
		if(this._isMusic) co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
		if(this._audio != null) {
			this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
			this._audio.currentTime = 0;
			this._audio.pause();
		}
	}
	,playMusic: function(volume,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._isMusic = true;
		co.doubleduck.audio.NonOverlappingAudio._musicPlaying = true;
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
	}
	,handleEnded: function() {
		this._audio.removeEventListener("ended",$bind(this,this.handleEnded));
		this._audio.currentTime = 0;
	}
	,handleTimeUpdate: function() {
		if(this._audio.currentTime >= this._audio.duration - 0.3) this.stop();
	}
	,playEffect: function(volume,overrideOtherEffects,loop,fadeIn) {
		if(fadeIn == null) fadeIn = 0;
		if(loop == null) loop = false;
		if(overrideOtherEffects == null) overrideOtherEffects = true;
		if(volume == null) volume = 1;
		if(co.doubleduck.audio.NonOverlappingAudio._musicPlaying) return;
		if(overrideOtherEffects && co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying != null) co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying.stop();
		this._audio.play();
		this._audio.volume = volume;
		this._audio.loop = loop;
		if(!loop) this._audio.addEventListener("ended",$bind(this,this.stop));
		co.doubleduck.audio.NonOverlappingAudio._currentlyPlaying = this;
	}
	,handleError: function() {
	}
	,handleCanPlay: function() {
	}
	,load: function() {
		this._audio = new Audio();
		this._audio.src = this._src;
		this._audio.initialTime = 0;
		this._audio.addEventListener("canplaythrough",$bind(this,this.handleCanPlay));
		this._audio.addEventListener("onerror",$bind(this,this.handleError));
	}
	,init: function() {
	}
	,_isMusic: null
	,_audio: null
	,_src: null
	,__class__: co.doubleduck.audio.NonOverlappingAudio
}
var haxe = haxe || {}
haxe.Log = $hxClasses["haxe.Log"] = function() { }
haxe.Log.__name__ = ["haxe","Log"];
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
}
haxe.Log.clear = function() {
	js.Boot.__clear_trace();
}
haxe.Public = $hxClasses["haxe.Public"] = function() { }
haxe.Public.__name__ = ["haxe","Public"];
haxe.StackItem = $hxClasses["haxe.StackItem"] = { __ename__ : ["haxe","StackItem"], __constructs__ : ["CFunction","Module","FilePos","Method","Lambda"] }
haxe.StackItem.CFunction = ["CFunction",0];
haxe.StackItem.CFunction.toString = $estr;
haxe.StackItem.CFunction.__enum__ = haxe.StackItem;
haxe.StackItem.Module = function(m) { var $x = ["Module",1,m]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.FilePos = function(s,file,line) { var $x = ["FilePos",2,s,file,line]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Method = function(classname,method) { var $x = ["Method",3,classname,method]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.StackItem.Lambda = function(v) { var $x = ["Lambda",4,v]; $x.__enum__ = haxe.StackItem; $x.toString = $estr; return $x; }
haxe.Stack = $hxClasses["haxe.Stack"] = function() { }
haxe.Stack.__name__ = ["haxe","Stack"];
haxe.Stack.callStack = function() {
	var oldValue = Error.prepareStackTrace;
	Error.prepareStackTrace = function(error,callsites) {
		var stack = [];
		var _g = 0;
		while(_g < callsites.length) {
			var site = callsites[_g];
			++_g;
			var method = null;
			var fullName = site.getFunctionName();
			if(fullName != null) {
				var idx = fullName.lastIndexOf(".");
				if(idx >= 0) {
					var className = HxOverrides.substr(fullName,0,idx);
					var methodName = HxOverrides.substr(fullName,idx + 1,null);
					method = haxe.StackItem.Method(className,methodName);
				}
			}
			stack.push(haxe.StackItem.FilePos(method,site.getFileName(),site.getLineNumber()));
		}
		return stack;
	};
	var a = haxe.Stack.makeStack(new Error().stack);
	a.shift();
	Error.prepareStackTrace = oldValue;
	return a;
}
haxe.Stack.exceptionStack = function() {
	return [];
}
haxe.Stack.toString = function(stack) {
	var b = new StringBuf();
	var _g = 0;
	while(_g < stack.length) {
		var s = stack[_g];
		++_g;
		b.b += Std.string("\nCalled from ");
		haxe.Stack.itemToString(b,s);
	}
	return b.b;
}
haxe.Stack.itemToString = function(b,s) {
	var $e = (s);
	switch( $e[1] ) {
	case 0:
		b.b += Std.string("a C function");
		break;
	case 1:
		var m = $e[2];
		b.b += Std.string("module ");
		b.b += Std.string(m);
		break;
	case 2:
		var line = $e[4], file = $e[3], s1 = $e[2];
		if(s1 != null) {
			haxe.Stack.itemToString(b,s1);
			b.b += Std.string(" (");
		}
		b.b += Std.string(file);
		b.b += Std.string(" line ");
		b.b += Std.string(line);
		if(s1 != null) b.b += Std.string(")");
		break;
	case 3:
		var meth = $e[3], cname = $e[2];
		b.b += Std.string(cname);
		b.b += Std.string(".");
		b.b += Std.string(meth);
		break;
	case 4:
		var n = $e[2];
		b.b += Std.string("local function #");
		b.b += Std.string(n);
		break;
	}
}
haxe.Stack.makeStack = function(s) {
	if(typeof(s) == "string") {
		var stack = s.split("\n");
		var m = [];
		var _g = 0;
		while(_g < stack.length) {
			var line = stack[_g];
			++_g;
			m.push(haxe.StackItem.Module(line));
		}
		return m;
	} else return s;
}
if(!haxe.remoting) haxe.remoting = {}
haxe.remoting.AsyncConnection = $hxClasses["haxe.remoting.AsyncConnection"] = function() { }
haxe.remoting.AsyncConnection.__name__ = ["haxe","remoting","AsyncConnection"];
haxe.remoting.AsyncConnection.prototype = {
	setErrorHandler: null
	,call: null
	,resolve: null
	,__class__: haxe.remoting.AsyncConnection
}
haxe.remoting.AsyncDebugConnection = $hxClasses["haxe.remoting.AsyncDebugConnection"] = function(path,cnx,data) {
	this.__path = path;
	this.__cnx = cnx;
	this.__data = data;
};
haxe.remoting.AsyncDebugConnection.__name__ = ["haxe","remoting","AsyncDebugConnection"];
haxe.remoting.AsyncDebugConnection.__interfaces__ = [haxe.remoting.AsyncConnection];
haxe.remoting.AsyncDebugConnection.create = function(cnx) {
	var cnx1 = new haxe.remoting.AsyncDebugConnection([],cnx,{ error : function(e) {
		throw e;
	}, oncall : function(path,params) {
	}, onerror : null, onresult : null});
	cnx1.setErrorDebug(function(path,params,e) {
		null;
	});
	cnx1.setResultDebug(function(path,params,e) {
		null;
	});
	return cnx1;
}
haxe.remoting.AsyncDebugConnection.prototype = {
	call: function(params,onResult) {
		var me = this;
		this.__data.oncall(this.__path,params);
		this.__cnx.setErrorHandler(function(e) {
			me.__data.onerror(me.__path,params,e);
			me.__data.error(e);
		});
		this.__cnx.call(params,function(r) {
			me.__data.onresult(me.__path,params,r);
			if(onResult != null) onResult(r);
		});
	}
	,setCallDebug: function(h) {
		this.__data.oncall = h;
	}
	,setResultDebug: function(h) {
		this.__data.onresult = h;
	}
	,setErrorDebug: function(h) {
		this.__data.onerror = h;
	}
	,setErrorHandler: function(h) {
		this.__data.error = h;
	}
	,resolve: function(name) {
		var cnx = new haxe.remoting.AsyncDebugConnection(this.__path.slice(),this.__cnx.resolve(name),this.__data);
		cnx.__path.push(name);
		return cnx;
	}
	,__data: null
	,__cnx: null
	,__path: null
	,__class__: haxe.remoting.AsyncDebugConnection
}
if(!haxe.unit) haxe.unit = {}
haxe.unit.TestCase = $hxClasses["haxe.unit.TestCase"] = function() {
};
haxe.unit.TestCase.__name__ = ["haxe","unit","TestCase"];
haxe.unit.TestCase.__interfaces__ = [haxe.Public];
haxe.unit.TestCase.prototype = {
	assertEquals: function(expected,actual,c) {
		this.currentTest.done = true;
		if(actual != expected) {
			this.currentTest.success = false;
			this.currentTest.error = "expected '" + Std.string(expected) + "' but was '" + Std.string(actual) + "'";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertFalse: function(b,c) {
		this.currentTest.done = true;
		if(b == true) {
			this.currentTest.success = false;
			this.currentTest.error = "expected false but was true";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,assertTrue: function(b,c) {
		this.currentTest.done = true;
		if(b == false) {
			this.currentTest.success = false;
			this.currentTest.error = "expected true but was false";
			this.currentTest.posInfos = c;
			throw this.currentTest;
		}
	}
	,print: function(v) {
		haxe.unit.TestRunner.print(v);
	}
	,tearDown: function() {
	}
	,setup: function() {
	}
	,currentTest: null
	,__class__: haxe.unit.TestCase
}
haxe.unit.TestResult = $hxClasses["haxe.unit.TestResult"] = function() {
	this.m_tests = new List();
	this.success = true;
};
haxe.unit.TestResult.__name__ = ["haxe","unit","TestResult"];
haxe.unit.TestResult.prototype = {
	toString: function() {
		var buf = new StringBuf();
		var failures = 0;
		var $it0 = this.m_tests.iterator();
		while( $it0.hasNext() ) {
			var test = $it0.next();
			if(test.success == false) {
				buf.b += Std.string("* ");
				buf.b += Std.string(test.classname);
				buf.b += Std.string("::");
				buf.b += Std.string(test.method);
				buf.b += Std.string("()");
				buf.b += Std.string("\n");
				buf.b += Std.string("ERR: ");
				if(test.posInfos != null) {
					buf.b += Std.string(test.posInfos.fileName);
					buf.b += Std.string(":");
					buf.b += Std.string(test.posInfos.lineNumber);
					buf.b += Std.string("(");
					buf.b += Std.string(test.posInfos.className);
					buf.b += Std.string(".");
					buf.b += Std.string(test.posInfos.methodName);
					buf.b += Std.string(") - ");
				}
				buf.b += Std.string(test.error);
				buf.b += Std.string("\n");
				if(test.backtrace != null) {
					buf.b += Std.string(test.backtrace);
					buf.b += Std.string("\n");
				}
				buf.b += Std.string("\n");
				failures++;
			}
		}
		buf.b += Std.string("\n");
		if(failures == 0) buf.b += Std.string("OK "); else buf.b += Std.string("FAILED ");
		buf.b += Std.string(this.m_tests.length);
		buf.b += Std.string(" tests, ");
		buf.b += Std.string(failures);
		buf.b += Std.string(" failed, ");
		buf.b += Std.string(this.m_tests.length - failures);
		buf.b += Std.string(" success");
		buf.b += Std.string("\n");
		return buf.b;
	}
	,add: function(t) {
		this.m_tests.add(t);
		if(!t.success) this.success = false;
	}
	,success: null
	,m_tests: null
	,__class__: haxe.unit.TestResult
}
haxe.unit.TestRunner = $hxClasses["haxe.unit.TestRunner"] = function() {
	this.result = new haxe.unit.TestResult();
	this.cases = new List();
};
haxe.unit.TestRunner.__name__ = ["haxe","unit","TestRunner"];
haxe.unit.TestRunner.print = function(v) {
	var msg = StringTools.htmlEscape(js.Boot.__string_rec(v,"")).split("\n").join("<br/>");
	var d = document.getElementById("haxe:trace");
	if(d == null) alert("haxe:trace element not found"); else d.innerHTML += msg;
}
haxe.unit.TestRunner.customTrace = function(v,p) {
	haxe.unit.TestRunner.print(p.fileName + ":" + p.lineNumber + ": " + Std.string(v) + "\n");
}
haxe.unit.TestRunner.prototype = {
	runCase: function(t) {
		var old = haxe.Log.trace;
		haxe.Log.trace = haxe.unit.TestRunner.customTrace;
		var cl = Type.getClass(t);
		var fields = Type.getInstanceFields(cl);
		haxe.unit.TestRunner.print("Class: " + Type.getClassName(cl) + " ");
		var _g = 0;
		while(_g < fields.length) {
			var f = fields[_g];
			++_g;
			var fname = f;
			var field = Reflect.field(t,f);
			if(StringTools.startsWith(fname,"test") && Reflect.isFunction(field)) {
				t.currentTest = new haxe.unit.TestStatus();
				t.currentTest.classname = Type.getClassName(cl);
				t.currentTest.method = fname;
				t.setup();
				try {
					field.apply(t,new Array());
					if(t.currentTest.done) {
						t.currentTest.success = true;
						haxe.unit.TestRunner.print(".");
					} else {
						t.currentTest.success = false;
						t.currentTest.error = "(warning) no assert";
						haxe.unit.TestRunner.print("W");
					}
				} catch( $e0 ) {
					if( js.Boot.__instanceof($e0,haxe.unit.TestStatus) ) {
						var e = $e0;
						haxe.unit.TestRunner.print("F");
						t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					} else {
					var e = $e0;
					haxe.unit.TestRunner.print("E");
					if(e.message != null) t.currentTest.error = "exception thrown : " + Std.string(e) + " [" + Std.string(e.message) + "]"; else t.currentTest.error = "exception thrown : " + Std.string(e);
					t.currentTest.backtrace = haxe.Stack.toString(haxe.Stack.exceptionStack());
					}
				}
				this.result.add(t.currentTest);
				t.tearDown();
			}
		}
		haxe.unit.TestRunner.print("\n");
		haxe.Log.trace = old;
	}
	,run: function() {
		this.result = new haxe.unit.TestResult();
		var $it0 = this.cases.iterator();
		while( $it0.hasNext() ) {
			var c = $it0.next();
			this.runCase(c);
		}
		haxe.unit.TestRunner.print(this.result.toString());
		return this.result.success;
	}
	,add: function(c) {
		this.cases.add(c);
	}
	,cases: null
	,result: null
	,__class__: haxe.unit.TestRunner
}
haxe.unit.TestStatus = $hxClasses["haxe.unit.TestStatus"] = function() {
	this.done = false;
	this.success = false;
};
haxe.unit.TestStatus.__name__ = ["haxe","unit","TestStatus"];
haxe.unit.TestStatus.prototype = {
	backtrace: null
	,posInfos: null
	,classname: null
	,method: null
	,error: null
	,success: null
	,done: null
	,__class__: haxe.unit.TestStatus
}
var js = js || {}
js.Boot = $hxClasses["js.Boot"] = function() { }
js.Boot.__name__ = ["js","Boot"];
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
}
js.Boot.__trace = function(v,i) {
	var msg = i != null?i.fileName + ":" + i.lineNumber + ": ":"";
	msg += js.Boot.__string_rec(v,"");
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof(console) != "undefined" && console.log != null) console.log(msg);
}
js.Boot.__clear_trace = function() {
	var d = document.getElementById("haxe:trace");
	if(d != null) d.innerHTML = "";
}
js.Boot.isClass = function(o) {
	return o.__name__;
}
js.Boot.isEnum = function(e) {
	return e.__ename__;
}
js.Boot.getClass = function(o) {
	return o.__class__;
}
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2, _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i;
			var str = "[";
			s += "\t";
			var _g = 0;
			while(_g < l) {
				var i1 = _g++;
				str += (i1 > 0?",":"") + js.Boot.__string_rec(o[i1],s);
			}
			str += "]";
			return str;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) { ;
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
}
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0, _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
}
js.Boot.__instanceof = function(o,cl) {
	try {
		if(o instanceof cl) {
			if(cl == Array) return o.__enum__ == null;
			return true;
		}
		if(js.Boot.__interfLoop(o.__class__,cl)) return true;
	} catch( e ) {
		if(cl == null) return false;
	}
	switch(cl) {
	case Int:
		return Math.ceil(o%2147483648.0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return o === true || o === false;
	case String:
		return typeof(o) == "string";
	case Dynamic:
		return true;
	default:
		if(o == null) return false;
		if(cl == Class && o.__name__ != null) return true; else null;
		if(cl == Enum && o.__ename__ != null) return true; else null;
		return o.__enum__ == cl;
	}
}
js.Boot.__cast = function(o,t) {
	if(js.Boot.__instanceof(o,t)) return o; else throw "Cannot cast " + Std.string(o) + " to " + Std.string(t);
}
js.Lib = $hxClasses["js.Lib"] = function() { }
js.Lib.__name__ = ["js","Lib"];
js.Lib.document = null;
js.Lib.window = null;
js.Lib.debug = function() {
	debugger;
}
js.Lib.alert = function(v) {
	alert(js.Boot.__string_rec(v,""));
}
js.Lib.eval = function(code) {
	return eval(code);
}
js.Lib.setErrorHandler = function(f) {
	js.Lib.onerror = f;
}
var $_;
function $bind(o,m) { var f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; return f; };
if(Array.prototype.indexOf) HxOverrides.remove = function(a,o) {
	var i = a.indexOf(o);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
}; else null;
Math.__name__ = ["Math"];
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
$hxClasses.Math = Math;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i) {
	return isNaN(i);
};
String.prototype.__class__ = $hxClasses.String = String;
String.__name__ = ["String"];
Array.prototype.__class__ = $hxClasses.Array = Array;
Array.__name__ = ["Array"];
Date.prototype.__class__ = $hxClasses.Date = Date;
Date.__name__ = ["Date"];
var Int = $hxClasses.Int = { __name__ : ["Int"]};
var Dynamic = $hxClasses.Dynamic = { __name__ : ["Dynamic"]};
var Float = $hxClasses.Float = Number;
Float.__name__ = ["Float"];
var Bool = $hxClasses.Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = $hxClasses.Class = { __name__ : ["Class"]};
var Enum = { };
var Void = $hxClasses.Void = { __ename__ : ["Void"]};
if(typeof document != "undefined") js.Lib.document = document;
if(typeof window != "undefined") {
	js.Lib.window = window;
	js.Lib.window.onerror = function(msg,url,line) {
		var f = js.Lib.onerror;
		if(f == null) return false;
		return f(msg,[url + ":" + line]);
	};
}
co.doubleduck.BaseAssets.onLoadAll = null;
co.doubleduck.BaseAssets._loader = null;
co.doubleduck.BaseAssets._cacheData = { };
co.doubleduck.BaseAssets._loadCallbacks = { };
co.doubleduck.BaseAssets.loaded = 0;
co.doubleduck.BaseAssets._useLocalStorage = false;
co.doubleduck.BaseGame._viewport = null;
co.doubleduck.BaseGame._scale = 1;
co.doubleduck.BaseGame.DEBUG = false;
co.doubleduck.BaseGame.LOGO_URI = "images/duckling/splash_logo.png";
co.doubleduck.BaseGame.LOAD_STROKE_URI = "images/duckling/loading_stroke.png";
co.doubleduck.BaseGame.LOAD_FILL_URI = "images/duckling/loading_fill.png";
co.doubleduck.BaseGame.ORIENT_PORT_URI = "images/duckling/orientation_error_port.png";
co.doubleduck.BaseGame.ORIENT_LAND_URI = "images/duckling/orientation_error_land.png";
co.doubleduck.BasePersistence.GAME_PREFIX = "DUCK";
co.doubleduck.BasePersistence.available = co.doubleduck.BasePersistence.localStorageSupported();
co.doubleduck.Button.CLICK_TYPE_NONE = 0;
co.doubleduck.Button.CLICK_TYPE_TINT = 1;
co.doubleduck.Button.CLICK_TYPE_JUICY = 2;
co.doubleduck.Button.CLICK_TYPE_SCALE = 3;
co.doubleduck.Button.CLICK_TYPE_TOGGLE = 4;
co.doubleduck.Button.CLICK_TYPE_HOLD = 5;
co.doubleduck.Button._defaultSound = null;
co.doubleduck.Dodo.GRAVITY = 0.26;
co.doubleduck.Dodo.JET_THRUST = -0.85;
co.doubleduck.Dodo.JET_POWER = -0.75;
co.doubleduck.Dodo.THRUST_DURATION = 120;
co.doubleduck.Dodo.MAX_SPEED = 10;
co.doubleduck.Dodo.DODO_PADDING = 40;
co.doubleduck.Dodo.HIT_COLLISION_COOLDOWN = 1400;
co.doubleduck.Dodo.HITBOX_WIDTH = 30;
co.doubleduck.Dodo.HITBOX_HEIGHT = 50;
co.doubleduck.Dodo.HITBOX_X_OFFSET = 0;
co.doubleduck.Dodo.HITBOX_Y_OFFSET = -30;
co.doubleduck.Hud.FUEL_ALERT_THRESH = 0.1;
co.doubleduck.Menu.BUTTON_PADDING = 8;
co.doubleduck.Persistence.JET_LEVEL = "jetLevel";
co.doubleduck.Persistence.LIFE_LEVEL = "hpLevel";
co.doubleduck.Persistence.CHARM_JEWEL = "charmJewel";
co.doubleduck.Persistence.CHARM_FUEL = "charmFuel";
co.doubleduck.Persistence.CHARM_LIFE = "charmLife";
co.doubleduck.Persistence.MONEY_COUNT = "moneyCount";
co.doubleduck.Persistence.BEST_SCORE = "bestScore";
co.doubleduck.ScrollingBG.SLOWDOWN_RATE = 0.97;
co.doubleduck.ScrollingBG.PARTS_URI = "images/session/bgs/bg";
co.doubleduck.Session.BG_PARALLAX = 0.95;
co.doubleduck.Shop.PADDING = 4;
co.doubleduck.audio.WebAudioAPI._buffers = { };
co.doubleduck.SoundManager._muted = false;
co.doubleduck.SoundManager._cache = { };
co.doubleduck.SoundManager.available = co.doubleduck.SoundManager.isSoundAvailable();
co.doubleduck.audio.AudioFX._muted = false;
co.doubleduck.audio.HowlerAudio._muted = false;
co.doubleduck.audio.NonOverlappingAudio._musicPlaying = false;
js.Lib.onerror = null;
co.doubleduck.Main.main();
