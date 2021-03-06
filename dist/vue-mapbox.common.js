module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "1991":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var invoke = __webpack_require__("31f4");
var html = __webpack_require__("fab2");
var cel = __webpack_require__("230e");
var global = __webpack_require__("7726");
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__("2d95")(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};


/***/ }),

/***/ "1fa8":
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__("cb7c");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "214f":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var fails = __webpack_require__("79e5");
var defined = __webpack_require__("be13");
var wks = __webpack_require__("2b4c");

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);
  var fns = exec(defined, SYMBOL, ''[KEY]);
  var strfn = fns[0];
  var rxfn = fns[1];
  if (fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  })) {
    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "23c6":
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__("2d95");
var TAG = __webpack_require__("2b4c")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "27ee":
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__("23c6");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var Iterators = __webpack_require__("84f2");
module.exports = __webpack_require__("8378").getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "28a5":
/***/ (function(module, exports, __webpack_require__) {

// @@split logic
__webpack_require__("214f")('split', 2, function (defined, SPLIT, $split) {
  'use strict';
  var isRegExp = __webpack_require__("aae3");
  var _split = $split;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX = 'lastIndex';
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    var NPCG = /()??/.exec('')[1] === undefined; // nonparticipating capturing group
    // based on es5-shim implementation, need to rework it
    $split = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return _split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? 4294967295 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var separator2, match, lastIndex, lastLength, i;
      // Doesn't need flags gy, but they don't hurt
      if (!NPCG) separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
      while (match = separatorCopy.exec(string)) {
        // `separatorCopy.lastIndex` is not reliable cross-browser
        lastIndex = match.index + match[0][LENGTH];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          // Fix browsers whose `exec` methods don't consistently return `undefined` for NPCG
          // eslint-disable-next-line no-loop-func
          if (!NPCG && match[LENGTH] > 1) match[0].replace(separator2, function () {
            for (i = 1; i < arguments[LENGTH] - 2; i++) if (arguments[i] === undefined) match[i] = undefined;
          });
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    $split = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : _split.call(this, separator, limit);
    };
  }
  // 21.1.3.17 String.prototype.split(separator, limit)
  return [function split(separator, limit) {
    var O = defined(this);
    var fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined ? fn.call(separator, O, limit) : $split.call(String(O), separator, limit);
  }, $split];
});


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "2fdb":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// 21.1.3.7 String.prototype.includes(searchString, position = 0)

var $export = __webpack_require__("5ca1");
var context = __webpack_require__("d2c8");
var INCLUDES = 'includes';

$export($export.P + $export.F * __webpack_require__("5147")(INCLUDES), 'String', {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "31f4":
/***/ (function(module, exports) {

// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "33a4":
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__("84f2");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "456d":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__("4bf8");
var $keys = __webpack_require__("0d58");

__webpack_require__("5eda")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4a59":
/***/ (function(module, exports, __webpack_require__) {

var ctx = __webpack_require__("9b43");
var call = __webpack_require__("1fa8");
var isArrayIter = __webpack_require__("33a4");
var anObject = __webpack_require__("cb7c");
var toLength = __webpack_require__("9def");
var getIterFn = __webpack_require__("27ee");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "504c":
/***/ (function(module, exports, __webpack_require__) {

var getKeys = __webpack_require__("0d58");
var toIObject = __webpack_require__("6821");
var isEnum = __webpack_require__("52a7").f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};


/***/ }),

/***/ "5147":
/***/ (function(module, exports, __webpack_require__) {

var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};


/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "551c":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var global = __webpack_require__("7726");
var ctx = __webpack_require__("9b43");
var classof = __webpack_require__("23c6");
var $export = __webpack_require__("5ca1");
var isObject = __webpack_require__("d3f4");
var aFunction = __webpack_require__("d8e8");
var anInstance = __webpack_require__("f605");
var forOf = __webpack_require__("4a59");
var speciesConstructor = __webpack_require__("ebd6");
var task = __webpack_require__("1991").set;
var microtask = __webpack_require__("8079")();
var newPromiseCapabilityModule = __webpack_require__("a5b8");
var perform = __webpack_require__("9c80");
var userAgent = __webpack_require__("a25f");
var promiseResolve = __webpack_require__("bcaa");
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[__webpack_require__("2b4c")('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = __webpack_require__("dcbc")($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__("7f20")($Promise, PROMISE);
__webpack_require__("7a56")(PROMISE);
Wrapper = __webpack_require__("8378")[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__("5cc5")(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5cc5":
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__("2b4c")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "5eda":
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__("5ca1");
var core = __webpack_require__("8378");
var fails = __webpack_require__("79e5");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6762":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// https://github.com/tc39/Array.prototype.includes
var $export = __webpack_require__("5ca1");
var $includes = __webpack_require__("c366")(true);

$export($export.P, 'Array', {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

__webpack_require__("9c6c")('includes');


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7a56":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var dP = __webpack_require__("86cc");
var DESCRIPTORS = __webpack_require__("9e1e");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "7f84":
/***/ (function(module, exports, __webpack_require__) {

(function(e,n){ true?module.exports=n():undefined})(window,function(){return function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"===typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){e.exports=t(1)},function(e,n,t){"use strict";t.r(n);var o=[{name:"moveend",check:function(e,n){return n.center&&e.isMoving()}},{name:"zoomend",check:function(e,n){return void 0!==n.zoom&&null!==n.zoom&&e.isZooming()}},{name:"rotateend",check:function(e,n){return void 0!==n.bearing&&null!==n.bearing&&e.isRotating()}},{name:"pitchend",check:function(e,n){return void 0!==n.pitch&&null!==n.bearing&&e.isMoving()}}],r=function(e){return{center:e.getCenter(),zoom:e.getZoom(),bearing:e.getBearing(),pitch:e.getPitch()}},i={events:o,getter:r},u={events:[{name:"moveend",check:function(e){return e.isMoving()}}],getter:function(e){return{center:e.getCenter()}}},c={events:[{name:"zoomend",check:function(e){return e.isZooming()}}],getter:function(e){return{zoom:e.getZoom()}}},f={events:[{name:"rotateend",check:function(e){return e.isRotating()}}],getter:function(e){return{bearing:e.getBearing()}}},a={setCenter:u,panBy:u,panTo:u,setZoom:c,zoomTo:c,zoomIn:c,zoomOut:c,setBearing:f,rotateTo:f,resetNorth:f,snapToNorth:f,setPitch:{events:[{name:"pitchend",check:function(e){return!0}}],getter:function(e){return{pitch:e.getPitch()}}},fitBounds:{events:[{name:"zoomend",check:function(e){return e.isZooming()}},{name:"moveend",check:function(e){return e.isMoving()}},{name:"rotateend",check:function(e){return e.isRotating()}}],getter:function(e){return{zoom:e.getZoom(),bearing:e.getBearing(),pitch:e.getPitch(),center:e.getCenter()}}},fitScreenCoordinates:{events:[{name:"zoomend",check:function(e,n){return e.isZooming()}},{name:"moveend",check:function(e,n){return e.isMoving()}},{name:"rotateend",check:function(e,n){return n.bearing&&e.isRotating()}}],getter:function(e){return{zoom:e.getZoom(),center:e.getCenter(),bearing:e.getBearing(),pitch:e.getPitch()}}},jumpTo:i,easeTo:i,flyTo:i};function l(e){return l="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},l(e)}function m(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{},o=Object.keys(t);"function"===typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(t).filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.forEach(function(n){g(e,n,t[n])})}return e}function g(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e){return"".concat(e,"-").concat((""+Math.random()).split(".")[1])}function d(e,n,t,o){var r=function r(i){i.type===n&&i.eventId===t&&(e.off(n,r),o(i))};return r}function p(e,n){var t=e[n],o=t.length;return function(){for(var r=[],i={eventId:s(n)},u=a[n].events.map(function(n,t){return{event:n,func:new Promise(function(o,u){r[t]={event:n,func:d(e,n.name,i.eventId,o)},e.on(n.name,r[t].func)})}}),c=[],f=0;f<o;f++)f===o-1?c.push(m({},i,(f<0||arguments.length<=f?void 0:arguments[f])||{})):c.push((f<0||arguments.length<=f?void 0:arguments[f])||null);var g=[],p=(arguments.length<=0?void 0:arguments[0])||{};try{t.apply(e,c),"fitBounds"===n&&(p={}),"fitScreenCoordinates"===n&&(p={bearing:null},p.bearing=null,"number"===typeof(arguments.length<=2?void 0:arguments[2])&&(p.bearing=arguments.length<=2?void 0:arguments[2]),(arguments.length<=3?void 0:arguments[3])&&"object"===l(arguments.length<=3?void 0:arguments[3])&&(p=m({},p,arguments.length<=3?void 0:arguments[3]))),g=u.map(function(n){var t=n.event,o=n.func;return t.check(e,p)?o:(e.off(t.name,o),Promise.resolve())})}catch(v){throw r.forEach(function(n){var t=n.event,o=n.func;e.off(t.name,o)}),v}return Promise.all(g).then(function(){return a[n].getter(e)})}}var v=p,h=function(e){var n=Object.keys(a),t={};return n.forEach(function(o){-1!==n.indexOf(o)&&(t[o]=v(e,o))}),t};function b(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null;return n?v(e,n):h(e)}t.d(n,"default",function(){return b})}])["default"]});

/***/ }),

/***/ "8079":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var macrotask = __webpack_require__("1991").set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = __webpack_require__("2d95")(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "8615":
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__("5ca1");
var $values = __webpack_require__("504c")(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9c80":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "a25f":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';


/***/ }),

/***/ "a481":
/***/ (function(module, exports, __webpack_require__) {

// @@replace logic
__webpack_require__("214f")('replace', 2, function (defined, REPLACE, $replace) {
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return [function replace(searchValue, replaceValue) {
    'use strict';
    var O = defined(this);
    var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  }, $replace];
});


/***/ }),

/***/ "a5b8":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 25.4.1.5 NewPromiseCapability(C)
var aFunction = __webpack_require__("d8e8");

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "aae3":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__("d3f4");
var cof = __webpack_require__("2d95");
var MATCH = __webpack_require__("2b4c")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "bcaa":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var isObject = __webpack_require__("d3f4");
var newPromiseCapability = __webpack_require__("a5b8");

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d2c8":
/***/ (function(module, exports, __webpack_require__) {

// helper for String#{startsWith, endsWith, includes}
var isRegExp = __webpack_require__("aae3");
var defined = __webpack_require__("be13");

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "dcbc":
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__("2aba");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "ebd6":
/***/ (function(module, exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__("cb7c");
var aFunction = __webpack_require__("d8e8");
var SPECIES = __webpack_require__("2b4c")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "f605":
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.object.values.js
var es7_object_values = __webpack_require__("8615");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.iterator.js
var es6_array_iterator = __webpack_require__("cadf");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.keys.js
var es6_object_keys = __webpack_require__("456d");

// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"cffca526-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/map/GlMap.vue?vue&type=template&id=ba717e40&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"mgl-map-wrapper"},[_vm._m(0),_vm._t("default")],2)}
var staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"container",attrs:{"id":_vm.container}})}]


// CONCATENATED MODULE: ./src/components/map/GlMap.vue?vue&type=template&id=ba717e40&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.array.includes.js
var es7_array_includes = __webpack_require__("6762");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.string.includes.js
var es6_string_includes = __webpack_require__("2fdb");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread.js

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.promise.js
var es6_promise = __webpack_require__("551c");

// CONCATENATED MODULE: ./src/lib/withEvents.js

/* harmony default export */ var withEvents = ({
  methods: {
    /**
     * Emit Vue event with additionsl data
     *
     * @param {string} name EventName
     * @param {Object} [data={}] Additional data
     */
    $_emitEvent: function $_emitEvent(name) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.$emit(name, _objectSpread({
        map: this.map,
        component: this
      }, data));
    },

    /**
     * Emit Vue event with Mapbox event as additional data
     *
     * @param {Object} event
     */
    $_emitMapEvent: function $_emitMapEvent(event) {
      this.$_emitEvent(event.type, {
        mapboxEvent: event
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/map/events.js
/* eslint-disable key-spacing */
/* harmony default export */ var events = ({
  resize: {
    name: 'resize'
  },
  webglcontextlost: {
    name: 'webglcontextlost'
  },
  webglcontextrestored: {
    name: 'webglcontextrestored'
  },
  remove: {
    name: 'remove'
  },
  movestart: {
    name: 'movestart'
  },
  load: {
    name: 'load'
  },
  contextmenu: {
    name: 'contextmenu'
  },
  dblclick: {
    name: 'dblclick'
  },
  click: {
    name: 'click'
  },
  touchcancel: {
    name: 'touchcancel'
  },
  touchmove: {
    name: 'touchmove'
  },
  touchend: {
    name: 'touchend'
  },
  touchstart: {
    name: 'touchstart'
  },
  dataloading: {
    name: 'dataloading'
  },
  mousemove: {
    name: 'mousemove'
  },
  mouseup: {
    name: 'mouseup'
  },
  mousedown: {
    name: 'mousedown'
  },
  sourcedataloading: {
    name: 'sourcedataloading'
  },
  error: {
    name: 'error'
  },
  data: {
    name: 'data'
  },
  styledata: {
    name: 'styledata'
  },
  sourcedata: {
    name: 'sourcedata'
  },
  mouseout: {
    name: 'mouseout'
  },
  styledataloading: {
    name: 'styledataloading'
  },
  moveend: {
    name: 'moveend'
  },
  move: {
    name: 'move'
  },
  render: {
    name: 'render'
  },
  zoom: {
    name: 'zoom'
  },
  zoomstart: {
    name: 'zoomstart'
  },
  zoomend: {
    name: 'zoomend'
  },
  boxzoomstart: {
    name: 'boxzoomstart'
  },
  boxzoomcancel: {
    name: 'boxzoomcancel'
  },
  boxzoomend: {
    name: 'boxzoomend'
  },
  rotate: {
    name: 'rotate'
  },
  rotatestart: {
    name: 'rotatestart'
  },
  rotateend: {
    name: 'rotateend'
  },
  dragend: {
    name: 'dragend'
  },
  drag: {
    name: 'drag'
  },
  dragstart: {
    name: 'dragstart'
  },
  pitch: {
    name: 'pitch'
  }
});
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.split.js
var es6_regexp_split = __webpack_require__("28a5");

// CONCATENATED MODULE: ./src/components/map/options.js


/* harmony default export */ var options = ({
  container: {
    type: [String, HTMLElement],
    default: function _default() {
      return "map-".concat(('' + Math.random()).split('.')[1]);
    }
  },
  accessToken: {
    type: String,
    default: undefined
  },
  minZoom: {
    type: Number,
    default: 0
  },
  maxZoom: {
    type: Number,
    default: 22
  },
  mapStyle: {
    type: [String, Object],
    required: true
  },
  hash: {
    type: Boolean,
    default: false
  },
  interactive: {
    type: Boolean,
    default: true
  },
  bearingSnap: {
    type: Number,
    default: 7
  },
  // classes: {
  //   type: Array,
  //   default() {
  //     return []
  //   }
  // },
  attributionControl: {
    type: Boolean,
    default: true
  },
  logoPosition: {
    // TODO: Add validator
    type: String,
    default: 'bottom-left'
  },
  failIfMajorPerformanceCaveat: {
    type: Boolean,
    default: false
  },
  preserveDrawingBuffer: {
    type: Boolean,
    default: false
  },
  refreshExpiredTiles: {
    type: Boolean,
    default: true
  },
  maxBounds: {
    type: Array,
    default: function _default() {
      return undefined;
    }
  },
  scrollZoom: {
    type: [Boolean, Object],
    default: function _default() {
      return true;
    }
  },
  boxZoom: {
    type: Boolean,
    default: true
  },
  crossSourceCollisions: {
    type: Boolean,
    default: true
  },
  dragRotate: {
    type: Boolean,
    default: true
  },
  dragPan: {
    type: Boolean,
    default: true
  },
  keyboard: {
    type: Boolean,
    default: true
  },
  doubleClickZoom: {
    type: Boolean,
    default: true
  },
  touchZoomRotate: {
    type: [Boolean, Object],
    default: function _default() {
      return true;
    }
  },
  trackResize: {
    type: Boolean,
    default: true
  },
  center: {
    type: [Object, Array],
    default: undefined
  },
  zoom: {
    type: Number,
    default: 0
  },
  bearing: {
    type: Number,
    default: 0
  },
  pitch: {
    type: Number,
    default: 0
  },
  renderWorldCopies: {
    type: Boolean,
    default: true
  },
  RTLTextPluginUrl: {
    type: String,
    default: undefined
  },
  light: {
    type: Object
  },
  tileBoundaries: {
    type: Boolean,
    default: false
  },
  collisionBoxes: {
    type: Boolean,
    default: false
  },
  repaint: {
    type: Boolean,
    default: false
  },
  transformRequest: {
    type: Function,
    default: null
  }
});
// EXTERNAL MODULE: ./node_modules/core-js/modules/es7.object.entries.js
var es7_object_entries = __webpack_require__("ffc1");

// CONCATENATED MODULE: ./src/components/map/withWatchers.js



var watchers = {
  maxBounds: function maxBounds(val) {
    this.map.setMaxBounds(val);
  },
  minZoom: function minZoom(val) {
    this.map.setMinZoom(val);
  },
  maxZoom: function maxZoom(val) {
    this.map.setMaxZoom(val);
  },
  mapStyle: function mapStyle(val) {
    this.map.setStyle(val);
  },
  collisionBoxes: function collisionBoxes(val) {
    this.map.showCollisionBoxes = val;
  },
  tileBoundaries: function tileBoundaries(val) {
    this.map.showTileBoundaries = val;
  },
  repaint: function repaint(val) {
    this.map.repaint = val;
  },
  zoom: function zoom(next, prev) {
    this.map.setZoom(next);
  },
  center: function center(val) {
    this.map.setCenter(val);
  },
  bearing: function bearing(val) {
    this.map.setBearing(val);
  },
  pitch: function pitch(val) {
    this.map.setPitch(val);
  },
  light: function light(val) {
    this.map.setLigh(val);
  }
};

function watcher(prop, callback, next, prev) {
  var _this = this;

  if (this.initial) return;

  if (this.$listeners["update:".concat(prop)]) {
    if (this.propsIsUpdating[prop]) {
      this._watcher.active = false;
      this.$nextTick(function () {
        _this._watcher.active = true;
      });
    } else {
      this._watcher.active = true;
      callback(next, prev);
    }

    this.propsIsUpdating[prop] = false;
  } else {
    callback(next, prev);
  }
}

function makeWatchers() {
  var wrappers = {};
  Object.entries(watchers).forEach(function (prop) {
    wrappers[prop[0]] = function (next, prev) {
      return watcher.call(this, prop[0], prop[1].bind(this), next, prev);
    };
  });
  return wrappers;
}

/* harmony default export */ var withWatchers = ({
  watch: makeWatchers()
});
// EXTERNAL MODULE: ./node_modules/map-promisified/dist/mapPromisify.js
var mapPromisify = __webpack_require__("7f84");
var mapPromisify_default = /*#__PURE__*/__webpack_require__.n(mapPromisify);

// CONCATENATED MODULE: ./src/components/map/methods/private/index.js

/* harmony default export */ var methods_private = ({
  created: function created() {
    this.$_mapAsyncActions = null;
  },
  methods: {
    $_registerAsyncActions: function $_registerAsyncActions(map) {
      this.$_mapAsyncActions = mapPromisify_default()(map);
    }
  }
});
// CONCATENATED MODULE: ./src/components/map/methods/public/image.js
/* harmony default export */ var public_image = ({
  methods: {
    addImage: function addImage(name, image, options) {
      return this.map.addImage(name, image, options);
    },
    hasImage: function hasImage(id) {
      return this.map.hasImage(id);
    },
    removeImage: function removeImage(name) {
      return this.map.removeImage(name);
    },
    loadImage: function loadImage(url, callback) {
      return this.map.loadImage(url, callback);
    }
  }
});
// CONCATENATED MODULE: ./src/components/map/methods/public/feature.js
/* harmony default export */ var feature = ({
  methods: {
    queryRenderedFeatures: function queryRenderedFeatures(geometry, parameters) {
      return this.map.queryRenderedFeatures(geometry, parameters);
    },
    getFeatureState: function getFeatureState(feature) {
      return this.map.getFeatureState(feature);
    },
    setFeatureState: function setFeatureState(feature, state) {
      return this.map.setFeatureState(feature, state);
    },
    querySourceFeatures: function querySourceFeatures(sourceId, parameters) {
      return this.map.querySourceFeatures(sourceId, parameters);
    }
  }
});
// CONCATENATED MODULE: ./src/components/map/methods/public/project.js
/* harmony default export */ var project = ({
  methods: {
    project: function project(mapCoordinates) {
      return this.map.project(mapCoordinates);
    },
    unproject: function unproject(containerCoordinates) {
      return this.map.unproject(containerCoordinates);
    }
  }
});
// CONCATENATED MODULE: ./src/components/map/methods/public/camera.js

var methods = ['setCenter', 'fitBounds', 'easeTo', 'flyTo', 'jumpTo', 'panBy', 'panTo', 'setPitch', 'setBearing', 'rotateTo', 'resetNorth', 'snapToNorth', 'zoomTo', 'zoomIn', 'zoomOut', 'setZoom', 'fitScreenCoordinates'];

function makeMethods() {
  var actions = {};
  methods.forEach(function (name) {
    actions[name] = function () {
      if (this.$_mapAsyncActions) {
        var _this$$_mapAsyncActio;

        return (_this$$_mapAsyncActio = this.$_mapAsyncActions)[name].apply(_this$$_mapAsyncActio, arguments);
      }
    };
  });
  return actions;
}

/* harmony default export */ var camera = ({
  methods: _objectSpread({}, makeMethods(), {
    cameraForBounds: function cameraForBounds() {
      if (this.map) {
        var _this$map;

        return (_this$map = this.map).cameraForBounds.apply(_this$map, arguments);
      }
    }
  })
});
// CONCATENATED MODULE: ./src/components/map/methods/public/stop.js




/* harmony default export */ var stop = ({
  methods: {
    stop: function stop() {
      var _this = this;

      this.map.stop();
      var updatedProps = {
        pitch: this.map.getPitch(),
        zoom: this.map.getZoom(),
        bearing: this.map.getBearing(),
        center: this.map.getCenter()
      };
      Object.entries(updatedProps).forEach(function (prop) {
        _this.$_updateSyncedPropsFabric(prop[0], prop[1])();
      });
      return Promise.resolve(updatedProps);
    }
  }
});
// CONCATENATED MODULE: ./src/components/map/methods/public/index.js





/* harmony default export */ var methods_public = ({
  mixins: [public_image, feature, project, camera, stop],
  methods: {
    supported: function supported() {
      var perfomanceCheck = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return this.map.supported({
        failIfMajorPerformanceCaveat: perfomanceCheck
      });
    },
    resize: function resize() {
      this.map.resize();
    }
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/map/GlMap.vue?vue&type=script&lang=js&







//
//
//
//
//
//
//






/* harmony default export */ var GlMapvue_type_script_lang_js_ = ({
  name: 'GlMap',
  mixins: [withWatchers, methods_private, methods_public, withEvents],
  props: options,
  data: function data() {
    return {
      initial: true,
      baseMap: true,
      mapLoaded: false
    };
  },
  computed: {
    loaded: function loaded() {
      return this.map ? this.map.loaded() : false;
    },
    version: function version() {
      return this.map ? this.map.version : null;
    },
    bounds: function bounds() {
      return this.map ? this.map.getBounds() : null;
    },
    isStyleLoaded: function isStyleLoaded() {
      return this.map ? this.map.isStyleLoaded() : false;
    },
    areTilesLoaded: function areTilesLoaded() {
      return this.map ? this.map.areTilesLoaded() : false;
    },
    isMoving: function isMoving() {
      return this.map ? this.map.isMoving() : false;
    },
    canvas: function canvas() {
      return this.map ? this.map.getCanvas() : null;
    },
    canvasContainer: function canvasContainer() {
      return this.map ? this.map.getCanvasContainer() : null;
    },
    images: function images() {
      return this.map ? this.map.listImages() : null;
    }
  },
  created: function created() {
    this.map = null;
    this.propsIsUpdating = {};
  },
  mounted: function mounted() {
    var _this = this;

    this.$_loadMap().then(function (map) {
      _this.map = map;

      if (_this.RTLTextPluginUrl !== undefined) {
        map.setRTLTextPlugin(_this.RTLTextPluginUrl, _this.$_RTLTextPluginError);
      }

      var eventNames = Object.keys(events);

      _this.$_bindMapEvents(eventNames);

      _this.$_registerAsyncActions(map); // this.$_bindSelfEvents(eventNames, this.map, null, event => {
      //   return { type: event.type } // TODO: Add info about current event
      // })


      _this.$_bindPropsUpdateEvents();

      _this.initial = false;
      _this.mapLoaded = true;

      _this.$emit('load', {
        map: map,
        component: _this
      });
    });
  },
  beforeDestroy: function beforeDestroy() {
    if (this.map) this.map.remove();
  },
  methods: {
    $_updateSyncedPropsFabric: function $_updateSyncedPropsFabric(prop, data) {
      var _this2 = this;

      return function (event) {
        _this2.propsIsUpdating[prop] = true;
        var info = typeof data === 'function' ? data() : data;
        return _this2.$emit("update:".concat(prop), info);
      };
    },
    $_bindPropsUpdateEvents: function $_bindPropsUpdateEvents() {
      var _this3 = this;

      var syncedProps = [{
        event: 'moveend',
        prop: 'center',
        getter: this.map.getCenter.bind(this.map)
      }, {
        event: 'zoomend',
        prop: 'zoom',
        getter: this.map.getZoom.bind(this.map)
      }, {
        event: 'rotate',
        prop: 'bearing',
        getter: this.map.getBearing.bind(this.map)
      }, {
        event: 'pitch',
        prop: 'pitch',
        getter: this.map.getPitch.bind(this.map)
      }];
      syncedProps.forEach(function (_ref) {
        var event = _ref.event,
            prop = _ref.prop,
            getter = _ref.getter;

        if (_this3.$listeners["update:".concat(prop)]) {
          _this3.map.on(event, _this3.$_updateSyncedPropsFabric(prop, getter));
        }
      });
    },
    $_loadMap: function $_loadMap() {
      var _this4 = this;

      return new Promise(function (resolve) {
        if (_this4.accessToken) _this4.mapbox.accessToken = _this4.accessToken;
        var map = new _this4.mapbox.Map(_objectSpread({}, _this4._props, {
          container: _this4.$refs.container,
          style: _this4.mapStyle
        }));
        map.on('load', function () {
          return resolve(map);
        });
      });
    },
    $_RTLTextPluginError: function $_RTLTextPluginError(error) {
      this.$emit('rtl-plugin-error', {
        map: this.map,
        error: error
      });
    },
    $_bindMapEvents: function $_bindMapEvents(events) {
      var _this5 = this;

      Object.keys(this.$listeners).forEach(function (eventName) {
        if (events.includes(eventName)) {
          _this5.map.on(eventName, _this5.$_emitMapEvent);
        }
      });
    },
    $_unbindEvents: function $_unbindEvents(events) {
      var _this6 = this;

      events.forEach(function (eventName) {
        _this6.map.off(eventName, _this6.$_emitMapEvent);
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/map/GlMap.vue?vue&type=script&lang=js&
 /* harmony default export */ var map_GlMapvue_type_script_lang_js_ = (GlMapvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/map/GlMap.vue





/* normalize component */

var component = normalizeComponent(
  map_GlMapvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

component.options.__file = "GlMap.vue"
/* harmony default export */ var GlMap = (component.exports);
// CONCATENATED MODULE: ./src/lib/withRegistration.js
// @ts-check
function walkParents(component) {
  if (component.baseMap) {
    return component;
  } else {
    if (component.$parent !== undefined) {
      walkParents(component.$parent);
    }
  }
}

/* harmony default export */ var withRegistration = ({
  created: function created() {
    this.map = null;
  },
  mounted: function mounted() {
    this.$_checkMapTree(); // We wait for "load" event from map component to ensure mapbox is loaded and map created
  },
  methods: {
    $_findBaseMap: function $_findBaseMap() {
      var baseMapComponent = walkParents(this.$parent);

      if (baseMapComponent === undefined) {
        throw new Error('Component must have root map');
      }

      return baseMapComponent;
    },
    $_checkMapTree: function $_checkMapTree() {
      var mapComponent = this.$_findBaseMap();

      if (mapComponent) {
        if (mapComponent.mapLoaded) {
          this.$_deferredMount({
            component: mapComponent,
            map: mapComponent.map
          });
        } else {
          mapComponent.$on('load', this.$_deferredMount);
        }
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/UI/controls/controlMixin.js


/* harmony default export */ var controlMixin = ({
  mixins: [withRegistration, withEvents],
  beforeDestroy: function beforeDestroy() {
    if (this.map !== undefined) {
      this.map.removeControl(this.control);
    }
  },
  render: function render(h) {}
});
// CONCATENATED MODULE: ./src/components/UI/controls/NavigationControl.js

/* harmony default export */ var NavigationControl = ({
  name: 'NavigationControl',
  mixins: [controlMixin],
  props: {
    position: {
      type: String,
      default: 'top-right' // TODO: add validator

    }
  },
  data: function data() {
    return {
      control: undefined
    };
  },
  created: function created() {
    this.control = new this.mapbox.NavigationControl();
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      this.map = payload.map;
      this.map.addControl(this.control, this.position);
      this.$_emitEvent('added', {
        control: this.control
      });
      payload.component.$off('load', this.$_deferredMount);
    }
  }
});
// CONCATENATED MODULE: ./src/components/UI/withSelfEvents.js





/* harmony default export */ var withSelfEvents = ({
  methods: {
    /** Bind events for markers and popups.
       * MapboxGL JS emits this events on popup or marker object,
       * so we treat them as 'self' events of theese objects
    */
    $_bindSelfEvents: function $_bindSelfEvents(events, emitter) {
      var _this = this;

      // console.log(Object.keys(this.$listeners), events)
      Object.keys(this.$listeners).forEach(function (eventName) {
        if (events.includes(eventName)) {
          emitter.on(eventName, _this.$_emitSelfEvent);
        }
      });
    },
    $_unbindSelfEvents: function $_unbindSelfEvents(events, emitter) {
      var _this2 = this;

      if (events.length === 0) return;
      events.forEach(function (eventName) {
        emitter.off(eventName, _this2.$_emitSelfEvent);
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/UI/controls/GeolocateControl.js






var geolocationEvents = {
  trackuserlocationstart: 'trackuserlocationstart',
  trackuserlocationend: 'trackuserlocationend',
  geolocate: 'geolocate',
  error: 'error'
};
/* harmony default export */ var GeolocateControl = ({
  name: 'GeolocateControl',
  mixins: [withEvents, withSelfEvents, controlMixin],
  props: {
    position: {
      type: String,
      default: 'top-right'
    },
    positionOptions: {
      type: Object,
      default: function _default() {
        return {
          enableHighAccuracy: false,
          timeout: 6000
        };
      }
    },
    trackUserLocation: {
      type: Boolean,
      default: false
    },
    showUserLocation: {
      type: Boolean,
      default: true
    },
    fitBoundsOptions: {
      type: Object,
      default: function _default() {
        return {
          maxZoom: 15
        };
      }
    }
  },
  data: function data() {
    return {
      control: undefined
    };
  },
  created: function created() {
    this.control = new this.mapbox.GeolocateControl(this._props);
    this.$_bindSelfEvents(Object.keys(geolocationEvents), this.control);
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      this.map = payload.map;
      this.map.addControl(this.control, this.position);
      this.$_emitEvent('added', {
        control: this.control
      });
      payload.component.$off('load', this.$_deferredMount);
    },
    $_emitSelfEvent: function $_emitSelfEvent(event) {
      if (event.type === 'error') {
        this.$_emitEvent('geolocate-error', {
          mapboxEvent: event
        });
      }

      if (event.type === 'geolocate') {
        this.$_emitEvent('geolocate', {
          mapboxEvent: event
        });
      }
    },
    trigger: function trigger() {
      if (this.control) {
        return this.control.trigger();
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/UI/controls/FullscreenControl.js

/* harmony default export */ var FullscreenControl = ({
  name: 'FullscreenControl',
  mixins: [controlMixin],
  props: {
    position: {
      type: String,
      default: 'top-right'
    }
  },
  data: function data() {
    return {
      control: undefined
    };
  },
  created: function created() {
    this.control = new this.mapbox.FullscreenControl();
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      this.map = payload.map;
      this.map.addControl(this.control, this.position);
      this.$_emitEvent('added', {
        control: this.control
      });
      payload.component.$off('load', this.$_deferredMount);
    }
  }
});
// CONCATENATED MODULE: ./src/components/UI/controls/AttributionControl.js

/* harmony default export */ var AttributionControl = ({
  name: 'AttributionControl',
  mixins: [controlMixin],
  props: {
    compact: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      control: undefined
    };
  },
  created: function created() {
    this.control = new this.mapbox.AttributionControl({
      compact: this.compact
    });
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      this.map = payload.map;
      this.map.addControl(this.control);
      this.$_emitEvent('added', {
        control: this.control
      });
      payload.component.$off('load', this.$_deferredMount);
    }
  }
});
// CONCATENATED MODULE: ./src/components/UI/controls/ScaleControl.js




/* harmony default export */ var ScaleControl = ({
  name: 'ScaleControl',
  mixins: [controlMixin],
  props: {
    maxWidth: {
      type: Number,
      default: 150
    },
    unit: {
      type: String,
      default: 'metric',
      validator: function validator(value) {
        return ['imperial', 'metric', 'nautical'].includes(value);
      }
    }
  },
  data: function data() {
    return {
      control: undefined
    };
  },
  watch: {
    unit: function unit(next, prev) {
      if (this.control && next !== prev) {
        this.control.setUnit(next);
      }
    }
  },
  created: function created() {
    this.control = new this.mapbox.ScaleControl(this._props);
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      this.map = payload.map;

      try {
        this.map.addControl(this.control);
      } catch (err) {
        console.log(err);
      }

      this.$_emitEvent('added', {
        control: this.control
      });
      payload.component.$off('load', this.$_deferredMount);
    }
  }
});
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"cffca526-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/Marker.vue?vue&type=template&id=49e178ed&
var Markervue_type_template_id_49e178ed_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"display":"none"}},[_vm._t("marker"),_vm._t("default")],2)}
var Markervue_type_template_id_49e178ed_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/UI/Marker.vue?vue&type=template&id=49e178ed&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/Marker.vue?vue&type=script&lang=js&




//
//
//
//
//
//
//
//
//



var markerEvents = {
  drag: 'drag',
  dragstart: 'dragstart',
  dragend: 'dragend'
};
/* harmony default export */ var Markervue_type_script_lang_js_ = ({
  name: 'MapMarker',
  mixins: [withRegistration, withEvents, withSelfEvents],
  props: {
    // mapbox marker options
    offset: {
      type: [Object, Array],
      default: function _default() {
        return [0, 0];
      }
    },
    coordinates: {
      type: Array,
      required: true
    },
    color: {
      type: String
    },
    anchor: {
      type: String,
      default: 'center'
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      initial: true,
      marker: undefined
    };
  },
  watch: {
    coordinates: function coordinates(lngLat) {
      if (this.initial) return;
      this.marker.setLngLat(lngLat);
    },
    draggable: function draggable(next, prev) {
      if (this.initial) return;
      this.marker.setDraggable(next);
    }
  },
  mounted: function mounted() {
    this.$_checkMapTree();
  },
  beforeDestroy: function beforeDestroy() {
    if (this.map !== undefined && this.marker !== undefined) {
      this.marker.remove();
    }
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      var _this = this;

      if (!this.marker) {
        var markerOptions = _objectSpread({}, this._props);

        if (this.$slots.marker) {
          markerOptions.element = this.$slots.marker[0].elm;
        }

        this.marker = new this.mapbox.Marker(markerOptions);
      }

      this.map = payload.map;
      this.$_addMarker();
      console.log('LISTENERS: ', this.$listeners);

      if (this.$listeners['update:coordinates']) {
        this.marker.on('dragend', function (event) {
          var newCoordinates;

          if (_this.coordinates instanceof Array) {
            newCoordinates = [event.target._lngLat.lng, event.target._lngLat.lat];
          } else {
            newCoordinates = event.target._lngLat;
          }

          _this.$emit('update:coordinates', newCoordinates);
        });
      }

      var eventNames = Object.keys(markerEvents);
      this.$_bindSelfEvents(eventNames, this.marker);
      this.initial = false;
      payload.component.$off('load', this.$_deferredMount);
    },
    $_addMarker: function $_addMarker() {
      this.marker.setLngLat(this.coordinates).addTo(this.map);
      this.$_emitEvent('added', {
        marker: this.marker
      });
    },
    $_emitSelfEvent: function $_emitSelfEvent(event) {
      this.$_emitEvent(event.type, {
        mapboxEvent: event,
        marker: this.marker
      });
    },
    remove: function remove() {
      this.marker.remove();
      this.$_emitEvent('removed', {
        marker: this.marker
      });
    },
    togglePopup: function togglePopup() {
      return this.marker.togglePopup();
    }
  }
});
// CONCATENATED MODULE: ./src/components/UI/Marker.vue?vue&type=script&lang=js&
 /* harmony default export */ var UI_Markervue_type_script_lang_js_ = (Markervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/UI/Marker.vue





/* normalize component */

var Marker_component = normalizeComponent(
  UI_Markervue_type_script_lang_js_,
  Markervue_type_template_id_49e178ed_render,
  Markervue_type_template_id_49e178ed_staticRenderFns,
  false,
  null,
  null,
  null
  
)

Marker_component.options.__file = "Marker.vue"
/* harmony default export */ var Marker = (Marker_component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"cffca526-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/Popup.vue?vue&type=template&id=27c9447b&
var Popupvue_type_template_id_27c9447b_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticStyle:{"display":"none"}},[_vm._t("default")],2)}
var Popupvue_type_template_id_27c9447b_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/UI/Popup.vue?vue&type=template&id=27c9447b&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/UI/Popup.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//



/**
 * Popup component.
 * @see See [Mapbox Gl JS Popup](https://www.mapbox.com/mapbox-gl-js/api/#popup)
 */

/* harmony default export */ var Popupvue_type_script_lang_js_ = ({
  name: 'Popup',
  mixins: [withRegistration, withEvents, withSelfEvents],
  props: {
    /**
     * If `true`, a close button will appear in the top right corner of the popup.
     * Mapbox GL popup option.
     */
    closeButton: {
      type: Boolean,
      default: true
    },

    /**
     * Mapbox GL popup option.
     * If `true`, the popup will closed when the map is clicked. .
     */
    closeOnClick: {
      type: Boolean,
      default: true
    },

    /**
     * Mapbox GL popup option.
     * A string indicating the popup's location relative to the coordinate set.
     * If unset the anchor will be dynamically set to ensure the popup falls within the map container with a preference for 'bottom' .
     *  'top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
     */
    anchor: {
      validator: function validator(value) {
        var allowedValues = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        return typeof value === 'string' && allowedValues.indexOf(value) !== -1 || value === undefined;
      },
      default: undefined
    },

    /**
     * Mapbox GL popup option.
     * A pixel offset applied to the popup's location
     * a single number specifying a distance from the popup's location
     * a PointLike specifying a constant offset
     * an object of Points specifing an offset for each anchor position Negative offsets indicate left and up.
     */
    offset: {
      type: [Number, Object, Array],
      default: function _default() {
        return [0, 0];
      }
    },
    coordinates: {
      type: Array
    },

    /**
     * Component option.
     * If `true`, popup treats data in deafult slot as plain text
     */
    onlyText: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      initial: true,
      popup: undefined
    };
  },
  computed: {
    /**
     * true if popup is open
     * @returns {*}
     */
    isOpen: function isOpen() {
      if (this.popup !== undefined) {
        return this.popup.isOpen();
      }

      return false;
    }
  },
  mounted: function mounted() {
    this.$_checkMapTree();
  },
  beforeDestroy: function beforeDestroy() {
    if (this.map) {
      this.popup.remove();
      this.$_emitEvent('removed');
    }
  },
  watch: {
    coordinates: function coordinates(lngLat) {
      if (this.initial) return;
      this.popup.setLngLat(lngLat);
    }
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      this.map = payload.map;
      this.$_addPopup();
      this.initial = false;
      payload.component.$off('load', this.$_deferredMount);
    },
    $_addPopup: function $_addPopup() {
      var _this = this;

      this.popup = new this.mapbox.Popup(_objectSpread({}, this._props));
      if (this.coordinates !== undefined) this.popup.setLngLat(this.coordinates);

      if (this.$slots.default !== undefined) {
        if (this.onlyText) {
          if (this.$slots.default[0].elm.nodeType === 3) {
            var tmpEl = document.createElement('span');
            tmpEl.appendChild(this.$slots.default[0].elm);
            this.popup.setText(tmpEl.innerText);
          } else {
            this.popup.setText(this.$slots.default[0].elm.innerText);
          }
        } else {
          this.popup.setDOMContent(this.$slots.default[0].elm);
        }
      }

      this.popup.addTo(this.map);
      this.$_emitEvent('added', {
        popup: this.popup
      });
      this.popup.on('close', this.$_onClose);
      this.popup.on('open', this.$_onOpen);

      if (this.$parent.marker !== undefined) {
        this.$parent.marker.setPopup(this.popup);
      } else {
        this.$parent.$once('added', function (_ref) {
          var marker = _ref.marker;
          marker.setPopup(_this.popup);
        });
      }
    },
    $_onClose: function $_onClose() {
      /**
       * Popup close event
       * @event close
       * @type {object}
       */
      this.$_emitEvent('close', {
        popup: this.popup
      });
    },
    $_onOpen: function $_onOpen() {
      /**
       * Popup close event
       * @event open
       * @type {object}
       */
      this.$_emitEvent('open', {
        popup: this.popup
      });
    },
    remove: function remove() {
      this.popup.remove();
      this.$_emitEvent('remove', {
        popup: this.popup
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/UI/Popup.vue?vue&type=script&lang=js&
 /* harmony default export */ var UI_Popupvue_type_script_lang_js_ = (Popupvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/components/UI/Popup.vue





/* normalize component */

var Popup_component = normalizeComponent(
  UI_Popupvue_type_script_lang_js_,
  Popupvue_type_template_id_27c9447b_render,
  Popupvue_type_template_id_27c9447b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

Popup_component.options.__file = "Popup.vue"
/* harmony default export */ var Popup = (Popup_component.exports);
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.regexp.replace.js
var es6_regexp_replace = __webpack_require__("a481");

// CONCATENATED MODULE: ./src/lib/layerEvents.js
/* harmony default export */ var layerEvents = (['mousedown', 'mouseup', 'click', 'dblclick', 'mousemove', 'mouseenter', 'mouseleave', 'mouseover', 'mouseout', 'contextmenu', 'touchstart', 'touchend', 'touchcancel']);
// CONCATENATED MODULE: ./src/components/layer/layerMixin.js









var mapboxSourceProps = {
  sourceId: {
    type: String,
    required: true
  }
};
var mapboxLayerStyleProps = {
  layerId: {
    type: String,
    required: true
  },
  metadata: Object,
  refLayer: String,
  'source-layer': String,
  minZoom: Number,
  maxZoom: Number,
  paint: Object,
  layout: Object,
  before: Object
};
var componentProps = {
  clearSource: {
    type: Boolean,
    default: true
  },
  // hidden: {
  //   type: Boolean,
  //   default: false
  // },
  replaceSource: {
    type: Boolean,
    default: false
  },
  replace: {
    type: Boolean,
    default: false
  },
  listenUserEvents: {
    type: Boolean,
    default: false
  }
};
/* harmony default export */ var layerMixin = ({
  mixins: [withRegistration, withEvents],
  props: _objectSpread({}, mapboxSourceProps, mapboxLayerStyleProps, componentProps),
  data: function data() {
    return {
      initial: true
    };
  },
  computed: {
    sourceLoaded: function sourceLoaded() {
      return this.map ? this.map.isSourceLoaded(this.sourceId) : false;
    },
    mapLayer: function mapLayer() {
      return this.map ? this.map.getLayer(this.layerId) : null;
    },
    mapSource: function mapSource() {
      return this.map ? this.map.getSource(this.sourceId) : null;
    }
  },
  watch: {
    minzoom: function minzoom(val) {
      if (this.initial) return;
      this.map.setLayerZoomRange(this.layerId, val, this.maxzoom);
    },
    maxzoom: function maxzoom(val) {
      if (this.initial) return;
      this.map.setLayerZoomRange(this.layerId, this.minzoom, val);
    },
    paint: function paint(properties) {
      if (this.initial) return;

      var _arr = Object.keys(this.paint);

      for (var _i = 0; _i < _arr.length; _i++) {
        var prop = _arr[_i];

        if (this.paint[prop] !== properties[prop]) {
          this.map.setPaintProperty(this.layerId, prop, properties[prop]);
          this.paint[prop] = properties[prop];
        }
      }
    },
    layout: function layout(properties) {
      if (this.initial) return;

      var _arr2 = Object.keys(this.layout);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var prop = _arr2[_i2];

        if (this.layout[prop] !== properties[prop]) {
          this.map.setLayoutProperty(this.layerId, prop, properties[prop]);
          this.layout[prop] = properties[prop];
        }
      }
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.map) {
      try {
        this.map.removeLayer(this.layerId);
      } catch (err) {
        this.$_emitEvent('layer-does-not-exist', {
          layerId: this.sourceId,
          error: err
        });
      }

      if (this.clearSource) {
        try {
          this.map.removeSource(this.sourceId);
        } catch (err) {
          this.$_emitEvent('source-does-not-exist', {
            sourceId: this.sourceId,
            error: err
          });
        }
      }
    }
  },
  methods: {
    $_bindLayerEvents: function $_bindLayerEvents(events) {
      var _this = this;

      Object.keys(this.$listeners).forEach(function (eventName) {
        if (events.includes(eventName)) {
          _this.map.on(eventName, _this.layerId, _this.$_emitMapEvent);
        }
      });
    },
    $_unbindEvents: function $_unbindEvents(events) {
      var _this2 = this;

      events.forEach(function (eventName) {
        _this2.map.off(eventName, _this2.layerId, _this2.$_emitMapEvent);
      });
    },
    $_watchSourceLoading: function $_watchSourceLoading(data) {
      if (data.dataType === 'source' && data.sourceId === this.sourceId) {
        this.$_emitEvent('layer-source-loading', {
          sourceId: this.sourceId
        });
        this.map.off('dataloading', this.$_watchSourceLoading);
      }
    },
    move: function move(beforeId) {
      this.map.moveLayer(this.layerId, beforeId);
      this.$_emitEvent('layer-moved', {
        layerId: this.layerId,
        beforeId: beforeId
      });
    },
    remove: function remove() {
      this.map.removeLayer(this.layerId);
      this.$_emitEvent('layer-removed', {
        layerId: this.layerId
      });
    }
  },
  render: function render(h) {}
});
// CONCATENATED MODULE: ./src/components/layer/GeojsonLayer.js



/* harmony default export */ var GeojsonLayer = ({
  name: 'GeojsonLayer',
  mixins: [layerMixin],
  props: {
    source: {
      type: [Object, String]
    },
    type: {
      validator: function validator(value) {
        var allowedValues = ['fill', 'line', 'symbol', 'circle', 'fill-extrusion', 'raster', 'background'];
        return typeof value === 'string' && allowedValues.indexOf(value) !== -1 || value === undefined;
      },
      default: 'fill'
    },
    filter: {
      type: Array,
      default: undefined
    },
    cluster: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    source: function source(data) {
      if (this.initial) return;
      this.mapSource.setData(data);
    },
    filter: function filter(_filter) {
      if (this.initial) return;
      this.map.setFilter(this.layerId, _filter);
    }
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      this.map = payload.map;
      this.map.on('dataloading', this.$_watchSourceLoading);

      if (this.source) {
        try {
          this.map.addSource(this.sourceId, {
            type: 'geojson',
            data: this.source,
            cluster: this.cluster
          });
        } catch (err) {
          if (this.replaceSource) {
            this.map.removeSource(this.sourceId);
            this.map.addSource(this.sourceId, {
              type: 'geojson',
              data: this.source,
              cluster: this.cluster
            });
          } else {
            this.$_emitEvent('layer-source-error', {
              sourceId: this.sourceId,
              error: err
            });
          }
        }
      }

      this.$_addLayer(); // if (this.listenUserEvents) {

      this.$_bindLayerEvents(layerEvents); // }

      this.map.off('dataloading', this.$_watchSourceLoading);
      this.initial = false;
      payload.component.$off('load', this.$_deferredMount);
    },
    $_addLayer: function $_addLayer() {
      var existed = this.map.getLayer(this.layerId);

      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent('layer-exists', {
            layerId: this.layerId
          });
          return existed;
        }
      }

      var layer = {
        id: this.layerId,
        source: this.sourceId
      };

      if (this.refLayer) {
        layer.ref = this.refLayer;
      } else {
        layer.type = this.type ? this.type : 'fill';
        layer.source = this.sourceId;

        if (this['source-layer']) {
          layer['source-layer'] = this['source-layer'];
        }

        if (this.minzoom) layer.minzoom = this.minzoom;
        if (this.maxzoom) layer.maxzoom = this.maxzoom;

        if (this.layout) {
          layer.layout = this.layout;
        }

        if (this.filter) layer.filter = this.filter;
      }

      layer.paint = this.paint ? this.paint : {
        'fill-color': "rgba(".concat(12 * (this.layerId.length * 3), ",153,80,0.55)")
      };
      layer.metadata = this.metadata;
      this.map.addLayer(layer, this.before);
      this.$_emitEvent('added', {
        layerId: this.layerId
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/layer/ImageLayer.js



/* harmony default export */ var ImageLayer = ({
  name: 'ImageLayer',
  mixins: [layerMixin],
  props: {
    coordinates: {
      type: Array,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  watch: {
    coordinates: function coordinates(val) {
      if (this.initial) return;
      this.mapSource.setCoordinates(val);
    },
    url: function url(val) {
      if (this.initial) return;
      this.mapSource.updateImage({
        url: val,
        coordinates: this.coordinates
      });
    }
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      var source = {
        type: 'image',
        url: this.url,
        coordinates: this.coordinates
      };
      this.map = payload.map;
      this.map.on('dataloading', this.$_watchSourceLoading);

      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        } else {
          this.$_emitEvent('layer-source-error', {
            sourceId: this.sourceId,
            error: err
          });
        }
      }

      this.$_addLayer();

      if (this.listenUserEvents) {
        this.$_bindLayerEvents(layerEvents);
      }

      this.initial = false;
      payload.component.$off('load', this.$_deferredMount);
    },
    $_addLayer: function $_addLayer() {
      var existed = this.map.getLayer(this.layerId);

      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent('layer-exists', {
            layerId: this.layerId
          });
          return existed;
        }
      }

      var layer = {
        id: this.layerId,
        source: this.sourceId,
        type: 'raster'
      };

      if (this.refLayer) {
        layer.ref = this.refLayer;
      } else {
        if (this['source-layer']) {
          layer['source-layer'] = this['source-layer'];
        }

        if (this.minzoom) layer.minzoom = this.minzoom;
        if (this.maxzoom) layer.maxzoom = this.maxzoom;

        if (this.layout) {
          layer.layout = this.layout;
        }

        if (this.filter) layer.filter = this.filter;
      }

      layer.paint = this.paint ? this.paint : {
        'raster-opacity': 1
      };
      layer.metadata = this.metadata;
      this.map.addLayer(layer, this.before);
      this.$_emitEvent('added', {
        layerId: this.layerId
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/layer/CanvasLayer.js




/* harmony default export */ var CanvasLayer = ({
  name: 'CanvasLayer',
  mixins: [layerMixin],
  props: {
    coordinates: {
      type: Array,
      required: true
    },
    animate: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  computed: {
    canvas: function canvas() {
      return this.mapSource ? this.mapSource.getCanvas() : null;
    }
  },
  watch: {
    minzoom: function minzoom(val) {
      if (this.initial) return;
      this.map.setLayerZoomRange(this.layerId, val, this.maxzoom);
    },
    maxzoom: function maxzoom(val) {
      if (this.initial) return;
      this.map.setLayerZoomRange(this.layerId, this.minzoom, val);
    },
    coordinates: function coordinates(val) {
      if (this.initial) return;
      this.mapSource.setCoordinates(val);
    }
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      var canvasElement = document.createElement('canvas');
      canvasElement.id = this.sourceId;
      canvasElement.width = this.width;
      canvasElement.height = this.height;
      var source = {
        type: 'canvas',
        coordinates: this.coordinates,
        animate: this.animate,
        canvas: canvasElement
      };
      this.map = payload.map;
      this.map.on('dataloading', this.$_watchSourceLoading);

      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        } else {
          this.$_emitEvent('layer-source-error', {
            sourceId: this.sourceId,
            error: err
          });
        }
      }

      this.$_addLayer();

      if (this.listenUserEvents) {
        this.$_bindLayerEvents(layerEvents);
      }

      payload.component.$off('load', this.$_deferredMount);
      this.initial = false;
    },
    $_addLayer: function $_addLayer() {
      var existed = this.map.getLayer(this.layerId);

      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent('layer-exists', {
            layerId: this.layerId
          });
          return existed;
        }
      }

      var layer = {
        id: this.layerId,
        source: this.sourceId,
        type: 'raster'
      };

      if (this.refLayer) {
        layer.ref = this.refLayer;
      } else {
        if (this['source-layer']) {
          layer['source-layer'] = this['source-layer'];
        }

        if (this.minzoom) layer.minzoom = this.minzoom;
        if (this.maxzoom) layer.maxzoom = this.maxzoom;
      }

      layer.paint = this.paint ? this.paint : {
        'raster-opacity': 0.85
      };
      layer.metadata = this.metadata;
      this.map.addLayer(layer, this.before);
      this.$_emitEvent('added', {
        layerId: this.layerId,
        canvas: this.canvas
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/layer/VideoLayer.js



/* harmony default export */ var VideoLayer = ({
  name: 'VideoLayer',
  mixins: [layerMixin],
  props: {
    coordinates: {
      type: Array,
      required: true
    },
    urls: {
      type: Array,
      required: true
    }
  },
  data: function data() {
    return {
      source: undefined
    };
  },
  computed: {
    video: function video() {
      return this.map.getSource(this.sourceId).getVideo();
    }
  },
  watch: {
    coordinates: function coordinates(val) {
      if (this.initial) return;
      this.mapSource.setCoordinates(val);
    }
  },
  methods: {
    _deferredMount: function _deferredMount(payload) {
      var source = {
        type: 'video',
        urls: this.urls,
        coordinates: this.coordinates
      };
      this.map = payload.map;
      this.map.on('dataloading', this.$_watchSourceLoading);

      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        } else {
          this.$_emitEvent('layer-source-error', {
            sourceId: this.sourceId,
            error: err
          });
        }
      }

      this.$_addLayer();

      if (this.listenUserEvents) {
        this.$_bindLayerEvents(layerEvents);
      }

      this.initial = false;
      payload.component.$off('load', this.$_deferredMount);
    },
    $_addLayer: function $_addLayer() {
      var existed = this.map.getLayer(this.layerId);

      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent('layer-exists', {
            layerId: this.layerId
          });
          return existed;
        }
      }

      var layer = {
        id: this.layerId,
        source: this.sourceId,
        type: 'background'
      };

      if (this.refLayer) {
        layer.ref = this.refLayer;
      } else {
        if (this['source-layer']) {
          layer['source-layer'] = this['source-layer'];
        }

        if (this.minzoom) layer.minzoom = this.minzoom;
        if (this.maxzoom) layer.maxzoom = this.maxzoom; // if (this.layout) {
        //   layer.layout = this.layout;
        // }
        // if (this.filter) layer.filter = this.filter
      } // layer.paint = this.paint ? this.paint : { 'raster-opacity': 0.85 };


      layer.metadata = this.metadata;
      this.map.addLayer(layer, this.before);
      this.$_emitEvent('added', {
        layerId: this.layerId
      });
    }
  }
});
// CONCATENATED MODULE: ./src/components/layer/VectorLayer.js




/* harmony default export */ var VectorLayer = ({
  name: 'VectorLayer',
  mixins: [layerMixin],
  props: {
    url: {
      type: String,
      default: undefined
    },
    tiles: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    tilesMinZoom: {
      type: Number,
      default: undefined
    },
    tilesMaxZoom: {
      type: Number,
      default: undefined
    },
    filter: {
      type: Array,
      default: undefined
    }
  },
  watch: {
    filter: function filter(_filter) {
      if (this.initial) return;
      this.map.setFilter(this.layerId, _filter);
    }
  },
  methods: {
    $_deferredMount: function $_deferredMount(payload) {
      if (payload.mapId !== this.mapId) return;
      this.map = payload.map;
      var source = {
        type: 'vector',
        tilesMinZoom: this.tilesMinZoom,
        tilesMaxZoom: this.tilesMaxZoom,
        url: this.url,
        tiles: this.tiles
      };
      this.map.on('dataloading', this.$_watchSourceLoading);

      try {
        this.map.addSource(this.sourceId, source);
      } catch (err) {
        if (this.replaceSource) {
          this.map.removeSource(this.sourceId);
          this.map.addSource(this.sourceId, source);
        } else {
          this.$_emitEvent('layer-source-error', {
            sourceId: this.sourceId,
            error: err
          });
        }
      }

      this._addLayer();

      if (this.listenUserEvents) {
        this.$_bindLayerEvents(layerEvents);
      }

      this.map.off('dataloading', this.$_watchSourceLoading);
      this.initial = false;
      payload.mapComponent.$on('load', this.$_deferredMount);
    },
    _addLayer: function _addLayer() {
      var existed = this.map.getLayer(this.layerId);

      if (existed) {
        if (this.replace) {
          this.map.removeLayer(this.layerId);
        } else {
          this.$_emitEvent('layer-exists', {
            layerId: this.layerId
          });
          return existed;
        }
      }

      var layer = {
        id: this.layerId,
        source: this.sourceId
      };

      if (this.refLayer) {
        layer.ref = this.refLayer;
      } else {
        layer.type = this.type ? this.type : 'fill';
        layer.source = this.sourceId;
        layer['source-layer'] = this['source-layer'];
        if (this.minzoom) layer.minzoom = this.minzoom;
        if (this.maxzoom) layer.maxzoom = this.maxzoom;

        if (this.layout) {
          layer.layout = this.layout;
        }

        if (this.filter) layer.filter = this.filter;
      }

      layer.paint = this.paint ? this.paint : {
        'fill-color': "rgba(".concat(12 * (this.layerId.length * 3), ",153,80,0.55)")
      };
      layer.metadata = this.metadata;
      this.map.addLayer(layer, this.before);
      this.$_emitEvent('added', {
        layerId: this.layerId
      });
    }
  }
});
// CONCATENATED MODULE: ./src/main.js



















var mglRegistrationMixin = withRegistration;
var mglControlMixin = controlMixin;
var MglMap = GlMap;
var MglNavigationControl = NavigationControl;
var MglGeolocateControl = GeolocateControl;
var MglFullscreenControl = FullscreenControl;
var MglAttributionControl = AttributionControl;
var MglScaleControl = ScaleControl;
var MglGeojsonLayer = GeojsonLayer;
var MglImageLayer = ImageLayer;
var MglCanvasLayer = CanvasLayer;
var MglVideoLayer = VideoLayer;
var MglVectorLayer = VectorLayer;
var MglMarker = Marker;
var MglPopup = Popup;
var main_plugin = {
  /**
   *  Create Vue-mapbox plugin for Vue
   *
   * @param {Object} Vue
   * @param {Object} options: mapboxgl: MapboxGl JS instances
   * @returns
   */
  install: function install(Vue) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var _data = {
      mapbox: options.mapboxgl
    };

    if (options.plugins && options.plugins.length) {
      options.plugins.forEach(function (plugin) {
        var key = Object.keys(plugin)[0];
        var value = Object.values(plugin)[0];
        _data[key] = value;
      });
    }

    Vue.mixin({
      data: function data() {
        return _data;
      }
    });
  }
};
/* harmony default export */ var main = (main_plugin);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js
/* concated harmony reexport mglRegistrationMixin */__webpack_require__.d(__webpack_exports__, "mglRegistrationMixin", function() { return mglRegistrationMixin; });
/* concated harmony reexport mglControlMixin */__webpack_require__.d(__webpack_exports__, "mglControlMixin", function() { return mglControlMixin; });
/* concated harmony reexport MglMap */__webpack_require__.d(__webpack_exports__, "MglMap", function() { return MglMap; });
/* concated harmony reexport MglNavigationControl */__webpack_require__.d(__webpack_exports__, "MglNavigationControl", function() { return MglNavigationControl; });
/* concated harmony reexport MglGeolocateControl */__webpack_require__.d(__webpack_exports__, "MglGeolocateControl", function() { return MglGeolocateControl; });
/* concated harmony reexport MglFullscreenControl */__webpack_require__.d(__webpack_exports__, "MglFullscreenControl", function() { return MglFullscreenControl; });
/* concated harmony reexport MglAttributionControl */__webpack_require__.d(__webpack_exports__, "MglAttributionControl", function() { return MglAttributionControl; });
/* concated harmony reexport MglScaleControl */__webpack_require__.d(__webpack_exports__, "MglScaleControl", function() { return MglScaleControl; });
/* concated harmony reexport MglGeojsonLayer */__webpack_require__.d(__webpack_exports__, "MglGeojsonLayer", function() { return MglGeojsonLayer; });
/* concated harmony reexport MglImageLayer */__webpack_require__.d(__webpack_exports__, "MglImageLayer", function() { return MglImageLayer; });
/* concated harmony reexport MglCanvasLayer */__webpack_require__.d(__webpack_exports__, "MglCanvasLayer", function() { return MglCanvasLayer; });
/* concated harmony reexport MglVideoLayer */__webpack_require__.d(__webpack_exports__, "MglVideoLayer", function() { return MglVideoLayer; });
/* concated harmony reexport MglVectorLayer */__webpack_require__.d(__webpack_exports__, "MglVectorLayer", function() { return MglVectorLayer; });
/* concated harmony reexport MglMarker */__webpack_require__.d(__webpack_exports__, "MglMarker", function() { return MglMarker; });
/* concated harmony reexport MglPopup */__webpack_require__.d(__webpack_exports__, "MglPopup", function() { return MglPopup; });
/* concated harmony reexport plugin */__webpack_require__.d(__webpack_exports__, "plugin", function() { return main_plugin; });


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (main);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),

/***/ "ffc1":
/***/ (function(module, exports, __webpack_require__) {

// https://github.com/tc39/proposal-object-values-entries
var $export = __webpack_require__("5ca1");
var $entries = __webpack_require__("504c")(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});


/***/ })

/******/ });