(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["common/vendor"],{

/***/ 1:
/*!************************************************************!*\
  !*** ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.createApp = createApp;exports.createComponent = createComponent;exports.createPage = createPage;exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance");}function _iterableToArrayLimit(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance");}function _iterableToArray(iter) {if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;}}

var _toString = Object.prototype.toString;
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isFn(fn) {
  return typeof fn === 'function';
}

function isStr(str) {
  return typeof str === 'string';
}

function isPlainObject(obj) {
  return _toString.call(obj) === '[object Object]';
}

function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}

function noop() {}

/**
                    * Create a cached version of a pure function.
                    */
function cached(fn) {
  var cache = Object.create(null);
  return function cachedFn(str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

/**
   * Camelize a hyphen-delimited string.
   */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) {return c ? c.toUpperCase() : '';});
});

var HOOKS = [
'invoke',
'success',
'fail',
'complete',
'returnValue'];


var globalInterceptors = {};
var scopedInterceptors = {};

function mergeHook(parentVal, childVal) {
  var res = childVal ?
  parentVal ?
  parentVal.concat(childVal) :
  Array.isArray(childVal) ?
  childVal : [childVal] :
  parentVal;
  return res ?
  dedupeHooks(res) :
  res;
}

function dedupeHooks(hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res;
}

function removeHook(hooks, hook) {
  var index = hooks.indexOf(hook);
  if (index !== -1) {
    hooks.splice(index, 1);
  }
}

function mergeInterceptorHook(interceptor, option) {
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      interceptor[hook] = mergeHook(interceptor[hook], option[hook]);
    }
  });
}

function removeInterceptorHook(interceptor, option) {
  if (!interceptor || !option) {
    return;
  }
  Object.keys(option).forEach(function (hook) {
    if (HOOKS.indexOf(hook) !== -1 && isFn(option[hook])) {
      removeHook(interceptor[hook], option[hook]);
    }
  });
}

function addInterceptor(method, option) {
  if (typeof method === 'string' && isPlainObject(option)) {
    mergeInterceptorHook(scopedInterceptors[method] || (scopedInterceptors[method] = {}), option);
  } else if (isPlainObject(method)) {
    mergeInterceptorHook(globalInterceptors, method);
  }
}

function removeInterceptor(method, option) {
  if (typeof method === 'string') {
    if (isPlainObject(option)) {
      removeInterceptorHook(scopedInterceptors[method], option);
    } else {
      delete scopedInterceptors[method];
    }
  } else if (isPlainObject(method)) {
    removeInterceptorHook(globalInterceptors, method);
  }
}

function wrapperHook(hook) {
  return function (data) {
    return hook(data) || data;
  };
}

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

function queue(hooks, data) {
  var promise = false;
  for (var i = 0; i < hooks.length; i++) {
    var hook = hooks[i];
    if (promise) {
      promise = Promise.then(wrapperHook(hook));
    } else {
      var res = hook(data);
      if (isPromise(res)) {
        promise = Promise.resolve(res);
      }
      if (res === false) {
        return {
          then: function then() {} };

      }
    }
  }
  return promise || {
    then: function then(callback) {
      return callback(data);
    } };

}

function wrapperOptions(interceptor) {var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  ['success', 'fail', 'complete'].forEach(function (name) {
    if (Array.isArray(interceptor[name])) {
      var oldCallback = options[name];
      options[name] = function callbackInterceptor(res) {
        queue(interceptor[name], res).then(function (res) {
          /* eslint-disable no-mixed-operators */
          return isFn(oldCallback) && oldCallback(res) || res;
        });
      };
    }
  });
  return options;
}

function wrapperReturnValue(method, returnValue) {
  var returnValueHooks = [];
  if (Array.isArray(globalInterceptors.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(globalInterceptors.returnValue));
  }
  var interceptor = scopedInterceptors[method];
  if (interceptor && Array.isArray(interceptor.returnValue)) {
    returnValueHooks.push.apply(returnValueHooks, _toConsumableArray(interceptor.returnValue));
  }
  returnValueHooks.forEach(function (hook) {
    returnValue = hook(returnValue) || returnValue;
  });
  return returnValue;
}

function getApiInterceptorHooks(method) {
  var interceptor = Object.create(null);
  Object.keys(globalInterceptors).forEach(function (hook) {
    if (hook !== 'returnValue') {
      interceptor[hook] = globalInterceptors[hook].slice();
    }
  });
  var scopedInterceptor = scopedInterceptors[method];
  if (scopedInterceptor) {
    Object.keys(scopedInterceptor).forEach(function (hook) {
      if (hook !== 'returnValue') {
        interceptor[hook] = (interceptor[hook] || []).concat(scopedInterceptor[hook]);
      }
    });
  }
  return interceptor;
}

function invokeApi(method, api, options) {for (var _len = arguments.length, params = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {params[_key - 3] = arguments[_key];}
  var interceptor = getApiInterceptorHooks(method);
  if (interceptor && Object.keys(interceptor).length) {
    if (Array.isArray(interceptor.invoke)) {
      var res = queue(interceptor.invoke, options);
      return res.then(function (options) {
        return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
      });
    } else {
      return api.apply(void 0, [wrapperOptions(interceptor, options)].concat(params));
    }
  }
  return api.apply(void 0, [options].concat(params));
}

var promiseInterceptor = {
  returnValue: function returnValue(res) {
    if (!isPromise(res)) {
      return res;
    }
    return res.then(function (res) {
      return res[1];
    }).catch(function (res) {
      return res[0];
    });
  } };


var SYNC_API_RE =
/^\$|restoreGlobal|getCurrentSubNVue|getMenuButtonBoundingClientRect|^report|interceptors|Interceptor$|getSubNVueById|requireNativePlugin|upx2px|hideKeyboard|canIUse|^create|Sync$|Manager$|base64ToArrayBuffer|arrayBufferToBase64/;

var CONTEXT_API_RE = /^create|Manager$/;

var CALLBACK_API_RE = /^on/;

function isContextApi(name) {
  return CONTEXT_API_RE.test(name);
}
function isSyncApi(name) {
  return SYNC_API_RE.test(name);
}

function isCallbackApi(name) {
  return CALLBACK_API_RE.test(name) && name !== 'onPush';
}

function handlePromise(promise) {
  return promise.then(function (data) {
    return [null, data];
  }).
  catch(function (err) {return [err];});
}

function shouldPromise(name) {
  if (
  isContextApi(name) ||
  isSyncApi(name) ||
  isCallbackApi(name))
  {
    return false;
  }
  return true;
}

function promisify(name, api) {
  if (!shouldPromise(name)) {
    return api;
  }
  return function promiseApi() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {params[_key2 - 1] = arguments[_key2];}
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return wrapperReturnValue(name, invokeApi.apply(void 0, [name, api, options].concat(params)));
    }
    return wrapperReturnValue(name, handlePromise(new Promise(function (resolve, reject) {
      invokeApi.apply(void 0, [name, api, Object.assign({}, options, {
        success: resolve,
        fail: reject })].concat(
      params));
      /* eslint-disable no-extend-native */
      if (!Promise.prototype.finally) {
        Promise.prototype.finally = function (callback) {
          var promise = this.constructor;
          return this.then(
          function (value) {return promise.resolve(callback()).then(function () {return value;});},
          function (reason) {return promise.resolve(callback()).then(function () {
              throw reason;
            });});

        };
      }
    })));
  };
}

var EPS = 1e-4;
var BASE_DEVICE_WIDTH = 750;
var isIOS = false;
var deviceWidth = 0;
var deviceDPR = 0;

function checkDeviceWidth() {var _wx$getSystemInfoSync =




  wx.getSystemInfoSync(),platform = _wx$getSystemInfoSync.platform,pixelRatio = _wx$getSystemInfoSync.pixelRatio,windowWidth = _wx$getSystemInfoSync.windowWidth; // uni=>wx runtime 编译目标是 uni 对象，内部不允许直接使用 uni

  deviceWidth = windowWidth;
  deviceDPR = pixelRatio;
  isIOS = platform === 'ios';
}

function upx2px(number, newDeviceWidth) {
  if (deviceWidth === 0) {
    checkDeviceWidth();
  }

  number = Number(number);
  if (number === 0) {
    return 0;
  }
  var result = number / BASE_DEVICE_WIDTH * (newDeviceWidth || deviceWidth);
  if (result < 0) {
    result = -result;
  }
  result = Math.floor(result + EPS);
  if (result === 0) {
    if (deviceDPR === 1 || !isIOS) {
      return 1;
    } else {
      return 0.5;
    }
  }
  return number < 0 ? -result : result;
}

var interceptors = {
  promiseInterceptor: promiseInterceptor };




var baseApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  upx2px: upx2px,
  interceptors: interceptors,
  addInterceptor: addInterceptor,
  removeInterceptor: removeInterceptor });


var previewImage = {
  args: function args(fromArgs) {
    var currentIndex = parseInt(fromArgs.current);
    if (isNaN(currentIndex)) {
      return;
    }
    var urls = fromArgs.urls;
    if (!Array.isArray(urls)) {
      return;
    }
    var len = urls.length;
    if (!len) {
      return;
    }
    if (currentIndex < 0) {
      currentIndex = 0;
    } else if (currentIndex >= len) {
      currentIndex = len - 1;
    }
    if (currentIndex > 0) {
      fromArgs.current = urls[currentIndex];
      fromArgs.urls = urls.filter(
      function (item, index) {return index < currentIndex ? item !== urls[currentIndex] : true;});

    } else {
      fromArgs.current = urls[0];
    }
    return {
      indicator: false,
      loop: false };

  } };


function addSafeAreaInsets(result) {
  if (result.safeArea) {
    var safeArea = result.safeArea;
    result.safeAreaInsets = {
      top: safeArea.top,
      left: safeArea.left,
      right: result.windowWidth - safeArea.right,
      bottom: result.windowHeight - safeArea.bottom };

  }
}
var protocols = {
  previewImage: previewImage,
  getSystemInfo: {
    returnValue: addSafeAreaInsets },

  getSystemInfoSync: {
    returnValue: addSafeAreaInsets } };


var todos = [
'vibrate'];

var canIUses = [];

var CALLBACKS = ['success', 'fail', 'cancel', 'complete'];

function processCallback(methodName, method, returnValue) {
  return function (res) {
    return method(processReturnValue(methodName, res, returnValue));
  };
}

function processArgs(methodName, fromArgs) {var argsOption = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};var returnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};var keepFromArgs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
  if (isPlainObject(fromArgs)) {// 一般 api 的参数解析
    var toArgs = keepFromArgs === true ? fromArgs : {}; // returnValue 为 false 时，说明是格式化返回值，直接在返回值对象上修改赋值
    if (isFn(argsOption)) {
      argsOption = argsOption(fromArgs, toArgs) || {};
    }
    for (var key in fromArgs) {
      if (hasOwn(argsOption, key)) {
        var keyOption = argsOption[key];
        if (isFn(keyOption)) {
          keyOption = keyOption(fromArgs[key], fromArgs, toArgs);
        }
        if (!keyOption) {// 不支持的参数
          console.warn("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F ".concat(methodName, "\u6682\u4E0D\u652F\u6301").concat(key));
        } else if (isStr(keyOption)) {// 重写参数 key
          toArgs[keyOption] = fromArgs[key];
        } else if (isPlainObject(keyOption)) {// {name:newName,value:value}可重新指定参数 key:value
          toArgs[keyOption.name ? keyOption.name : key] = keyOption.value;
        }
      } else if (CALLBACKS.indexOf(key) !== -1) {
        toArgs[key] = processCallback(methodName, fromArgs[key], returnValue);
      } else {
        if (!keepFromArgs) {
          toArgs[key] = fromArgs[key];
        }
      }
    }
    return toArgs;
  } else if (isFn(fromArgs)) {
    fromArgs = processCallback(methodName, fromArgs, returnValue);
  }
  return fromArgs;
}

function processReturnValue(methodName, res, returnValue) {var keepReturnValue = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (isFn(protocols.returnValue)) {// 处理通用 returnValue
    res = protocols.returnValue(methodName, res);
  }
  return processArgs(methodName, res, returnValue, {}, keepReturnValue);
}

function wrapper(methodName, method) {
  if (hasOwn(protocols, methodName)) {
    var protocol = protocols[methodName];
    if (!protocol) {// 暂不支持的 api
      return function () {
        console.error("\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F \u6682\u4E0D\u652F\u6301".concat(methodName));
      };
    }
    return function (arg1, arg2) {// 目前 api 最多两个参数
      var options = protocol;
      if (isFn(protocol)) {
        options = protocol(arg1);
      }

      arg1 = processArgs(methodName, arg1, options.args, options.returnValue);

      var args = [arg1];
      if (typeof arg2 !== 'undefined') {
        args.push(arg2);
      }
      var returnValue = wx[options.name || methodName].apply(wx, args);
      if (isSyncApi(methodName)) {// 同步 api
        return processReturnValue(methodName, returnValue, options.returnValue, isContextApi(methodName));
      }
      return returnValue;
    };
  }
  return method;
}

var todoApis = Object.create(null);

var TODOS = [
'onTabBarMidButtonTap',
'subscribePush',
'unsubscribePush',
'onPush',
'offPush',
'share'];


function createTodoApi(name) {
  return function todoApi(_ref)


  {var fail = _ref.fail,complete = _ref.complete;
    var res = {
      errMsg: "".concat(name, ":fail:\u6682\u4E0D\u652F\u6301 ").concat(name, " \u65B9\u6CD5") };

    isFn(fail) && fail(res);
    isFn(complete) && complete(res);
  };
}

TODOS.forEach(function (name) {
  todoApis[name] = createTodoApi(name);
});

var providers = {
  oauth: ['weixin'],
  share: ['weixin'],
  payment: ['wxpay'],
  push: ['weixin'] };


function getProvider(_ref2)




{var service = _ref2.service,success = _ref2.success,fail = _ref2.fail,complete = _ref2.complete;
  var res = false;
  if (providers[service]) {
    res = {
      errMsg: 'getProvider:ok',
      service: service,
      provider: providers[service] };

    isFn(success) && success(res);
  } else {
    res = {
      errMsg: 'getProvider:fail:服务[' + service + ']不存在' };

    isFn(fail) && fail(res);
  }
  isFn(complete) && complete(res);
}

var extraApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  getProvider: getProvider });


var getEmitter = function () {
  if (typeof getUniEmitter === 'function') {
    /* eslint-disable no-undef */
    return getUniEmitter;
  }
  var Emitter;
  return function getUniEmitter() {
    if (!Emitter) {
      Emitter = new _vue.default();
    }
    return Emitter;
  };
}();

function apply(ctx, method, args) {
  return ctx[method].apply(ctx, args);
}

function $on() {
  return apply(getEmitter(), '$on', Array.prototype.slice.call(arguments));
}
function $off() {
  return apply(getEmitter(), '$off', Array.prototype.slice.call(arguments));
}
function $once() {
  return apply(getEmitter(), '$once', Array.prototype.slice.call(arguments));
}
function $emit() {
  return apply(getEmitter(), '$emit', Array.prototype.slice.call(arguments));
}

var eventApi = /*#__PURE__*/Object.freeze({
  __proto__: null,
  $on: $on,
  $off: $off,
  $once: $once,
  $emit: $emit });




var api = /*#__PURE__*/Object.freeze({
  __proto__: null });


var MPPage = Page;
var MPComponent = Component;

var customizeRE = /:/g;

var customize = cached(function (str) {
  return camelize(str.replace(customizeRE, '-'));
});

function initTriggerEvent(mpInstance) {
  {
    if (!wx.canIUse('nextTick')) {
      return;
    }
  }
  var oldTriggerEvent = mpInstance.triggerEvent;
  mpInstance.triggerEvent = function (event) {for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {args[_key3 - 1] = arguments[_key3];}
    return oldTriggerEvent.apply(mpInstance, [customize(event)].concat(args));
  };
}

function initHook(name, options) {
  var oldHook = options[name];
  if (!oldHook) {
    options[name] = function () {
      initTriggerEvent(this);
    };
  } else {
    options[name] = function () {
      initTriggerEvent(this);for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {args[_key4] = arguments[_key4];}
      return oldHook.apply(this, args);
    };
  }
}

Page = function Page() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('onLoad', options);
  return MPPage(options);
};

Component = function Component() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  initHook('created', options);
  return MPComponent(options);
};

var PAGE_EVENT_HOOKS = [
'onPullDownRefresh',
'onReachBottom',
'onShareAppMessage',
'onPageScroll',
'onResize',
'onTabItemTap'];


function initMocks(vm, mocks) {
  var mpInstance = vm.$mp[vm.mpType];
  mocks.forEach(function (mock) {
    if (hasOwn(mpInstance, mock)) {
      vm[mock] = mpInstance[mock];
    }
  });
}

function hasHook(hook, vueOptions) {
  if (!vueOptions) {
    return true;
  }

  if (_vue.default.options && Array.isArray(_vue.default.options[hook])) {
    return true;
  }

  vueOptions = vueOptions.default || vueOptions;

  if (isFn(vueOptions)) {
    if (isFn(vueOptions.extendOptions[hook])) {
      return true;
    }
    if (vueOptions.super &&
    vueOptions.super.options &&
    Array.isArray(vueOptions.super.options[hook])) {
      return true;
    }
    return false;
  }

  if (isFn(vueOptions[hook])) {
    return true;
  }
  var mixins = vueOptions.mixins;
  if (Array.isArray(mixins)) {
    return !!mixins.find(function (mixin) {return hasHook(hook, mixin);});
  }
}

function initHooks(mpOptions, hooks, vueOptions) {
  hooks.forEach(function (hook) {
    if (hasHook(hook, vueOptions)) {
      mpOptions[hook] = function (args) {
        return this.$vm && this.$vm.__call_hook(hook, args);
      };
    }
  });
}

function initVueComponent(Vue, vueOptions) {
  vueOptions = vueOptions.default || vueOptions;
  var VueComponent;
  if (isFn(vueOptions)) {
    VueComponent = vueOptions;
    vueOptions = VueComponent.extendOptions;
  } else {
    VueComponent = Vue.extend(vueOptions);
  }
  return [VueComponent, vueOptions];
}

function initSlots(vm, vueSlots) {
  if (Array.isArray(vueSlots) && vueSlots.length) {
    var $slots = Object.create(null);
    vueSlots.forEach(function (slotName) {
      $slots[slotName] = true;
    });
    vm.$scopedSlots = vm.$slots = $slots;
  }
}

function initVueIds(vueIds, mpInstance) {
  vueIds = (vueIds || '').split(',');
  var len = vueIds.length;

  if (len === 1) {
    mpInstance._$vueId = vueIds[0];
  } else if (len === 2) {
    mpInstance._$vueId = vueIds[0];
    mpInstance._$vuePid = vueIds[1];
  }
}

function initData(vueOptions, context) {
  var data = vueOptions.data || {};
  var methods = vueOptions.methods || {};

  if (typeof data === 'function') {
    try {
      data = data.call(context); // 支持 Vue.prototype 上挂的数据
    } catch (e) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.warn('根据 Vue 的 data 函数初始化小程序 data 失败，请尽量确保 data 函数中不访问 vm 对象，否则可能影响首次数据渲染速度。', data);
      }
    }
  } else {
    try {
      // 对 data 格式化
      data = JSON.parse(JSON.stringify(data));
    } catch (e) {}
  }

  if (!isPlainObject(data)) {
    data = {};
  }

  Object.keys(methods).forEach(function (methodName) {
    if (context.__lifecycle_hooks__.indexOf(methodName) === -1 && !hasOwn(data, methodName)) {
      data[methodName] = methods[methodName];
    }
  });

  return data;
}

var PROP_TYPES = [String, Number, Boolean, Object, Array, null];

function createObserver(name) {
  return function observer(newVal, oldVal) {
    if (this.$vm) {
      this.$vm[name] = newVal; // 为了触发其他非 render watcher
    }
  };
}

function initBehaviors(vueOptions, initBehavior) {
  var vueBehaviors = vueOptions['behaviors'];
  var vueExtends = vueOptions['extends'];
  var vueMixins = vueOptions['mixins'];

  var vueProps = vueOptions['props'];

  if (!vueProps) {
    vueOptions['props'] = vueProps = [];
  }

  var behaviors = [];
  if (Array.isArray(vueBehaviors)) {
    vueBehaviors.forEach(function (behavior) {
      behaviors.push(behavior.replace('uni://', "wx".concat("://")));
      if (behavior === 'uni://form-field') {
        if (Array.isArray(vueProps)) {
          vueProps.push('name');
          vueProps.push('value');
        } else {
          vueProps['name'] = {
            type: String,
            default: '' };

          vueProps['value'] = {
            type: [String, Number, Boolean, Array, Object, Date],
            default: '' };

        }
      }
    });
  }
  if (isPlainObject(vueExtends) && vueExtends.props) {
    behaviors.push(
    initBehavior({
      properties: initProperties(vueExtends.props, true) }));


  }
  if (Array.isArray(vueMixins)) {
    vueMixins.forEach(function (vueMixin) {
      if (isPlainObject(vueMixin) && vueMixin.props) {
        behaviors.push(
        initBehavior({
          properties: initProperties(vueMixin.props, true) }));


      }
    });
  }
  return behaviors;
}

function parsePropType(key, type, defaultValue, file) {
  // [String]=>String
  if (Array.isArray(type) && type.length === 1) {
    return type[0];
  }
  return type;
}

function initProperties(props) {var isBehavior = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;var file = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var properties = {};
  if (!isBehavior) {
    properties.vueId = {
      type: String,
      value: '' };

    properties.vueSlots = { // 小程序不能直接定义 $slots 的 props，所以通过 vueSlots 转换到 $slots
      type: null,
      value: [],
      observer: function observer(newVal, oldVal) {
        var $slots = Object.create(null);
        newVal.forEach(function (slotName) {
          $slots[slotName] = true;
        });
        this.setData({
          $slots: $slots });

      } };

  }
  if (Array.isArray(props)) {// ['title']
    props.forEach(function (key) {
      properties[key] = {
        type: null,
        observer: createObserver(key) };

    });
  } else if (isPlainObject(props)) {// {title:{type:String,default:''},content:String}
    Object.keys(props).forEach(function (key) {
      var opts = props[key];
      if (isPlainObject(opts)) {// title:{type:String,default:''}
        var value = opts['default'];
        if (isFn(value)) {
          value = value();
        }

        opts.type = parsePropType(key, opts.type);

        properties[key] = {
          type: PROP_TYPES.indexOf(opts.type) !== -1 ? opts.type : null,
          value: value,
          observer: createObserver(key) };

      } else {// content:String
        var type = parsePropType(key, opts);
        properties[key] = {
          type: PROP_TYPES.indexOf(type) !== -1 ? type : null,
          observer: createObserver(key) };

      }
    });
  }
  return properties;
}

function wrapper$1(event) {
  // TODO 又得兼容 mpvue 的 mp 对象
  try {
    event.mp = JSON.parse(JSON.stringify(event));
  } catch (e) {}

  event.stopPropagation = noop;
  event.preventDefault = noop;

  event.target = event.target || {};

  if (!hasOwn(event, 'detail')) {
    event.detail = {};
  }

  if (isPlainObject(event.detail)) {
    event.target = Object.assign({}, event.target, event.detail);
  }

  return event;
}

function getExtraValue(vm, dataPathsArray) {
  var context = vm;
  dataPathsArray.forEach(function (dataPathArray) {
    var dataPath = dataPathArray[0];
    var value = dataPathArray[2];
    if (dataPath || typeof value !== 'undefined') {// ['','',index,'disable']
      var propPath = dataPathArray[1];
      var valuePath = dataPathArray[3];

      var vFor = dataPath ? vm.__get_value(dataPath, context) : context;

      if (Number.isInteger(vFor)) {
        context = value;
      } else if (!propPath) {
        context = vFor[value];
      } else {
        if (Array.isArray(vFor)) {
          context = vFor.find(function (vForItem) {
            return vm.__get_value(propPath, vForItem) === value;
          });
        } else if (isPlainObject(vFor)) {
          context = Object.keys(vFor).find(function (vForKey) {
            return vm.__get_value(propPath, vFor[vForKey]) === value;
          });
        } else {
          console.error('v-for 暂不支持循环数据：', vFor);
        }
      }

      if (valuePath) {
        context = vm.__get_value(valuePath, context);
      }
    }
  });
  return context;
}

function processEventExtra(vm, extra, event) {
  var extraObj = {};

  if (Array.isArray(extra) && extra.length) {
    /**
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *[
                                              *    ['data.items', 'data.id', item.data.id],
                                              *    ['metas', 'id', meta.id]
                                              *],
                                              *'test'
                                              */
    extra.forEach(function (dataPath, index) {
      if (typeof dataPath === 'string') {
        if (!dataPath) {// model,prop.sync
          extraObj['$' + index] = vm;
        } else {
          if (dataPath === '$event') {// $event
            extraObj['$' + index] = event;
          } else if (dataPath.indexOf('$event.') === 0) {// $event.target.value
            extraObj['$' + index] = vm.__get_value(dataPath.replace('$event.', ''), event);
          } else {
            extraObj['$' + index] = vm.__get_value(dataPath);
          }
        }
      } else {
        extraObj['$' + index] = getExtraValue(vm, dataPath);
      }
    });
  }

  return extraObj;
}

function getObjByArray(arr) {
  var obj = {};
  for (var i = 1; i < arr.length; i++) {
    var element = arr[i];
    obj[element[0]] = element[1];
  }
  return obj;
}

function processEventArgs(vm, event) {var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];var extra = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];var isCustom = arguments.length > 4 ? arguments[4] : undefined;var methodName = arguments.length > 5 ? arguments[5] : undefined;
  var isCustomMPEvent = false; // wxcomponent 组件，传递原始 event 对象
  if (isCustom) {// 自定义事件
    isCustomMPEvent = event.currentTarget &&
    event.currentTarget.dataset &&
    event.currentTarget.dataset.comType === 'wx';
    if (!args.length) {// 无参数，直接传入 event 或 detail 数组
      if (isCustomMPEvent) {
        return [event];
      }
      return event.detail.__args__ || event.detail;
    }
  }

  var extraObj = processEventExtra(vm, extra, event);

  var ret = [];
  args.forEach(function (arg) {
    if (arg === '$event') {
      if (methodName === '__set_model' && !isCustom) {// input v-model value
        ret.push(event.target.value);
      } else {
        if (isCustom && !isCustomMPEvent) {
          ret.push(event.detail.__args__[0]);
        } else {// wxcomponent 组件或内置组件
          ret.push(event);
        }
      }
    } else {
      if (Array.isArray(arg) && arg[0] === 'o') {
        ret.push(getObjByArray(arg));
      } else if (typeof arg === 'string' && hasOwn(extraObj, arg)) {
        ret.push(extraObj[arg]);
      } else {
        ret.push(arg);
      }
    }
  });

  return ret;
}

var ONCE = '~';
var CUSTOM = '^';

function isMatchEventType(eventType, optType) {
  return eventType === optType ||

  optType === 'regionchange' && (

  eventType === 'begin' ||
  eventType === 'end');


}

function handleEvent(event) {var _this = this;
  event = wrapper$1(event);

  // [['tap',[['handle',[1,2,a]],['handle1',[1,2,a]]]]]
  var dataset = (event.currentTarget || event.target).dataset;
  if (!dataset) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }
  var eventOpts = dataset.eventOpts || dataset['event-opts']; // 支付宝 web-view 组件 dataset 非驼峰
  if (!eventOpts) {
    return console.warn("\u4E8B\u4EF6\u4FE1\u606F\u4E0D\u5B58\u5728");
  }

  // [['handle',[1,2,a]],['handle1',[1,2,a]]]
  var eventType = event.type;

  var ret = [];

  eventOpts.forEach(function (eventOpt) {
    var type = eventOpt[0];
    var eventsArray = eventOpt[1];

    var isCustom = type.charAt(0) === CUSTOM;
    type = isCustom ? type.slice(1) : type;
    var isOnce = type.charAt(0) === ONCE;
    type = isOnce ? type.slice(1) : type;

    if (eventsArray && isMatchEventType(eventType, type)) {
      eventsArray.forEach(function (eventArray) {
        var methodName = eventArray[0];
        if (methodName) {
          var handlerCtx = _this.$vm;
          if (
          handlerCtx.$options.generic &&
          handlerCtx.$parent &&
          handlerCtx.$parent.$parent)
          {// mp-weixin,mp-toutiao 抽象节点模拟 scoped slots
            handlerCtx = handlerCtx.$parent.$parent;
          }
          if (methodName === '$emit') {
            handlerCtx.$emit.apply(handlerCtx,
            processEventArgs(
            _this.$vm,
            event,
            eventArray[1],
            eventArray[2],
            isCustom,
            methodName));

            return;
          }
          var handler = handlerCtx[methodName];
          if (!isFn(handler)) {
            throw new Error(" _vm.".concat(methodName, " is not a function"));
          }
          if (isOnce) {
            if (handler.once) {
              return;
            }
            handler.once = true;
          }
          ret.push(handler.apply(handlerCtx, processEventArgs(
          _this.$vm,
          event,
          eventArray[1],
          eventArray[2],
          isCustom,
          methodName)));

        }
      });
    }
  });

  if (
  eventType === 'input' &&
  ret.length === 1 &&
  typeof ret[0] !== 'undefined')
  {
    return ret[0];
  }
}

var hooks = [
'onShow',
'onHide',
'onError',
'onPageNotFound'];


function parseBaseApp(vm, _ref3)


{var mocks = _ref3.mocks,initRefs = _ref3.initRefs;
  if (vm.$options.store) {
    _vue.default.prototype.$store = vm.$options.store;
  }

  _vue.default.prototype.mpHost = "mp-weixin";

  _vue.default.mixin({
    beforeCreate: function beforeCreate() {
      if (!this.$options.mpType) {
        return;
      }

      this.mpType = this.$options.mpType;

      this.$mp = _defineProperty({
        data: {} },
      this.mpType, this.$options.mpInstance);


      this.$scope = this.$options.mpInstance;

      delete this.$options.mpType;
      delete this.$options.mpInstance;

      if (this.mpType !== 'app') {
        initRefs(this);
        initMocks(this, mocks);
      }
    } });


  var appOptions = {
    onLaunch: function onLaunch(args) {
      if (this.$vm) {// 已经初始化过了，主要是为了百度，百度 onShow 在 onLaunch 之前
        return;
      }
      {
        if (!wx.canIUse('nextTick')) {// 事实 上2.2.3 即可，简单使用 2.3.0 的 nextTick 判断
          console.error('当前微信基础库版本过低，请将 微信开发者工具-详情-项目设置-调试基础库版本 更换为`2.3.0`以上');
        }
      }

      this.$vm = vm;

      this.$vm.$mp = {
        app: this };


      this.$vm.$scope = this;
      // vm 上也挂载 globalData
      this.$vm.globalData = this.globalData;

      this.$vm._isMounted = true;
      this.$vm.__call_hook('mounted', args);

      this.$vm.__call_hook('onLaunch', args);
    } };


  // 兼容旧版本 globalData
  appOptions.globalData = vm.$options.globalData || {};
  // 将 methods 中的方法挂在 getApp() 中
  var methods = vm.$options.methods;
  if (methods) {
    Object.keys(methods).forEach(function (name) {
      appOptions[name] = methods[name];
    });
  }

  initHooks(appOptions, hooks);

  return appOptions;
}

var mocks = ['__route__', '__wxExparserNodeId__', '__wxWebviewId__'];

function findVmByVueId(vm, vuePid) {
  var $children = vm.$children;
  // 优先查找直属(反向查找:https://github.com/dcloudio/uni-app/issues/1200)
  for (var i = $children.length - 1; i >= 0; i--) {
    var childVm = $children[i];
    if (childVm.$scope._$vueId === vuePid) {
      return childVm;
    }
  }
  // 反向递归查找
  var parentVm;
  for (var _i = $children.length - 1; _i >= 0; _i--) {
    parentVm = findVmByVueId($children[_i], vuePid);
    if (parentVm) {
      return parentVm;
    }
  }
}

function initBehavior(options) {
  return Behavior(options);
}

function isPage() {
  return !!this.route;
}

function initRelation(detail) {
  this.triggerEvent('__l', detail);
}

function initRefs(vm) {
  var mpInstance = vm.$scope;
  Object.defineProperty(vm, '$refs', {
    get: function get() {
      var $refs = {};
      var components = mpInstance.selectAllComponents('.vue-ref');
      components.forEach(function (component) {
        var ref = component.dataset.ref;
        $refs[ref] = component.$vm || component;
      });
      var forComponents = mpInstance.selectAllComponents('.vue-ref-in-for');
      forComponents.forEach(function (component) {
        var ref = component.dataset.ref;
        if (!$refs[ref]) {
          $refs[ref] = [];
        }
        $refs[ref].push(component.$vm || component);
      });
      return $refs;
    } });

}

function handleLink(event) {var _ref4 =



  event.detail || event.value,vuePid = _ref4.vuePid,vueOptions = _ref4.vueOptions; // detail 是微信,value 是百度(dipatch)

  var parentVm;

  if (vuePid) {
    parentVm = findVmByVueId(this.$vm, vuePid);
  }

  if (!parentVm) {
    parentVm = this.$vm;
  }

  vueOptions.parent = parentVm;
}

function parseApp(vm) {
  return parseBaseApp(vm, {
    mocks: mocks,
    initRefs: initRefs });

}

function createApp(vm) {
  App(parseApp(vm));
  return vm;
}

function parseBaseComponent(vueComponentOptions)


{var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},isPage = _ref5.isPage,initRelation = _ref5.initRelation;var _initVueComponent =
  initVueComponent(_vue.default, vueComponentOptions),_initVueComponent2 = _slicedToArray(_initVueComponent, 2),VueComponent = _initVueComponent2[0],vueOptions = _initVueComponent2[1];

  var options = {
    multipleSlots: true,
    addGlobalClass: true };


  {
    // 微信 multipleSlots 部分情况有 bug，导致内容顺序错乱 如 u-list，提供覆盖选项
    if (vueOptions['mp-weixin'] && vueOptions['mp-weixin']['options']) {
      Object.assign(options, vueOptions['mp-weixin']['options']);
    }
  }

  var componentOptions = {
    options: options,
    data: initData(vueOptions, _vue.default.prototype),
    behaviors: initBehaviors(vueOptions, initBehavior),
    properties: initProperties(vueOptions.props, false, vueOptions.__file),
    lifetimes: {
      attached: function attached() {
        var properties = this.properties;

        var options = {
          mpType: isPage.call(this) ? 'page' : 'component',
          mpInstance: this,
          propsData: properties };


        initVueIds(properties.vueId, this);

        // 处理父子关系
        initRelation.call(this, {
          vuePid: this._$vuePid,
          vueOptions: options });


        // 初始化 vue 实例
        this.$vm = new VueComponent(options);

        // 处理$slots,$scopedSlots（暂不支持动态变化$slots）
        initSlots(this.$vm, properties.vueSlots);

        // 触发首次 setData
        this.$vm.$mount();
      },
      ready: function ready() {
        // 当组件 props 默认值为 true，初始化时传入 false 会导致 created,ready 触发, 但 attached 不触发
        // https://developers.weixin.qq.com/community/develop/doc/00066ae2844cc0f8eb883e2a557800
        if (this.$vm) {
          this.$vm._isMounted = true;
          this.$vm.__call_hook('mounted');
          this.$vm.__call_hook('onReady');
        }
      },
      detached: function detached() {
        this.$vm && this.$vm.$destroy();
      } },

    pageLifetimes: {
      show: function show(args) {
        this.$vm && this.$vm.__call_hook('onPageShow', args);
      },
      hide: function hide() {
        this.$vm && this.$vm.__call_hook('onPageHide');
      },
      resize: function resize(size) {
        this.$vm && this.$vm.__call_hook('onPageResize', size);
      } },

    methods: {
      __l: handleLink,
      __e: handleEvent } };



  if (Array.isArray(vueOptions.wxsCallMethods)) {
    vueOptions.wxsCallMethods.forEach(function (callMethod) {
      componentOptions.methods[callMethod] = function (args) {
        return this.$vm[callMethod](args);
      };
    });
  }

  if (isPage) {
    return componentOptions;
  }
  return [componentOptions, VueComponent];
}

function parseComponent(vueComponentOptions) {
  return parseBaseComponent(vueComponentOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

var hooks$1 = [
'onShow',
'onHide',
'onUnload'];


hooks$1.push.apply(hooks$1, PAGE_EVENT_HOOKS);

function parseBasePage(vuePageOptions, _ref6)


{var isPage = _ref6.isPage,initRelation = _ref6.initRelation;
  var pageOptions = parseComponent(vuePageOptions);

  initHooks(pageOptions.methods, hooks$1, vuePageOptions);

  pageOptions.methods.onLoad = function (args) {
    this.$vm.$mp.query = args; // 兼容 mpvue
    this.$vm.__call_hook('onLoad', args);
  };

  return pageOptions;
}

function parsePage(vuePageOptions) {
  return parseBasePage(vuePageOptions, {
    isPage: isPage,
    initRelation: initRelation });

}

function createPage(vuePageOptions) {
  {
    return Component(parsePage(vuePageOptions));
  }
}

function createComponent(vueOptions) {
  {
    return Component(parseComponent(vueOptions));
  }
}

todos.forEach(function (todoApi) {
  protocols[todoApi] = false;
});

canIUses.forEach(function (canIUseApi) {
  var apiName = protocols[canIUseApi] && protocols[canIUseApi].name ? protocols[canIUseApi].name :
  canIUseApi;
  if (!wx.canIUse(apiName)) {
    protocols[canIUseApi] = false;
  }
});

var uni = {};

if (typeof Proxy !== 'undefined' && "mp-weixin" !== 'app-plus') {
  uni = new Proxy({}, {
    get: function get(target, name) {
      if (target[name]) {
        return target[name];
      }
      if (baseApi[name]) {
        return baseApi[name];
      }
      if (api[name]) {
        return promisify(name, api[name]);
      }
      {
        if (extraApi[name]) {
          return promisify(name, extraApi[name]);
        }
        if (todoApis[name]) {
          return promisify(name, todoApis[name]);
        }
      }
      if (eventApi[name]) {
        return eventApi[name];
      }
      if (!hasOwn(wx, name) && !hasOwn(protocols, name)) {
        return;
      }
      return promisify(name, wrapper(name, wx[name]));
    },
    set: function set(target, name, value) {
      target[name] = value;
      return true;
    } });

} else {
  Object.keys(baseApi).forEach(function (name) {
    uni[name] = baseApi[name];
  });

  {
    Object.keys(todoApis).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
    Object.keys(extraApi).forEach(function (name) {
      uni[name] = promisify(name, todoApis[name]);
    });
  }

  Object.keys(eventApi).forEach(function (name) {
    uni[name] = eventApi[name];
  });

  Object.keys(api).forEach(function (name) {
    uni[name] = promisify(name, api[name]);
  });

  Object.keys(wx).forEach(function (name) {
    if (hasOwn(wx, name) || hasOwn(protocols, name)) {
      uni[name] = promisify(name, wrapper(name, wx[name]));
    }
  });
}

wx.createApp = createApp;
wx.createPage = createPage;
wx.createComponent = createComponent;

var uni$1 = uni;var _default =

uni$1;exports.default = _default;

/***/ }),

/***/ 10:
/*!********************************************!*\
  !*** ./node_modules/vuex/dist/vuex.esm.js ***!
  \********************************************/
/*! exports provided: Store, install, mapState, mapMutations, mapGetters, mapActions, createNamespacedHelpers, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.0.1
 * (c) 2017 Evan You
 * @license MIT
 */
var applyMixin = function (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
};

var devtoolHook =
  typeof window !== 'undefined' &&
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */
/**
 * Deep copy the given object considering circular structure.
 * This function caches all nested objects and its copies.
 * If it detects circular structure, use cached copy to avoid infinite loop.
 *
 * @param {*} obj
 * @param {Array<Object>} cache
 * @return {*}
 */


/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  this._children = Object.create(null);
  this._rawModule = rawModule;
  var rawState = rawModule.state;
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors$1 = { namespaced: { configurable: true } };

prototypeAccessors$1.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors$1 );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (true) {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (true) {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (true) {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (true) {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "Store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  var state = options.state; if ( state === void 0 ) state = {};
  if (typeof state === 'function') {
    state = state() || {};
  }

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  if (Vue.config.devtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors = { state: { configurable: true } };

prototypeAccessors.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors.state.set = function (v) {
  if (true) {
    assert(false, "Use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
     true &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (true) {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  this._actionSubscribers.forEach(function (sub) { return sub(action, this$1.state); });

  return entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload)
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  return genericSubscribe(fn, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (true) {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (true) {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    computed[key] = function () { return fn(store); };
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if ( true && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (true) {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (true) {
      assert(store._committing, "Do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (true) {
    assert(typeof type === 'string', ("Expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (true) {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if ( true && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if ( true && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.0.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};


/* harmony default export */ __webpack_exports__["default"] = (index_esm);


/***/ }),

/***/ 155:
/*!********************************************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/common/datas/cateNavDatas.json ***!
  \********************************************************************************************/
/*! exports provided: categoryL1List, default */
/***/ (function(module) {

module.exports = {"categoryL1List":[{"showIndex":0,"type":0,"categoryType":0,"superCategoryId":0,"name":"推荐专区","id":11,"subCateList":[]},{"showIndex":0,"type":0,"categoryType":0,"superCategoryId":0,"name":"宅家防护","id":12,"subCateList":[]},{"showIndex":0,"type":0,"categoryType":0,"superCategoryId":0,"name":"爆品专区","id":13,"subCateList":[]},{"showIndex":15,"wapBannerUrl":"","bannerUrl":"https://yanxuan.nosdn.127.net/dec6ff5ae8bae410809598950ba1f5b4.jpg","type":1,"frontName":"","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"新品专区","id":109217021,"subCateList":[{"showIndex":18,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/b23608821bfc854805df49363e38b301.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/b23608821bfc854805df49363e38b301.png","type":3,"frontName":"居家生活新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"居家生活新品","id":109241000,"subCateList":[]},{"showIndex":17,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/a803f572289dc4ada7ad8ff817422fdc.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/a803f572289dc4ada7ad8ff817422fdc.png","type":3,"frontName":"服饰鞋包新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"服饰鞋包新品","id":109241001,"subCateList":[]},{"showIndex":16,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/cc66ac0e306d77a241f6fd9ac34b2a00.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/cc66ac0e306d77a241f6fd9ac34b2a00.png","type":3,"frontName":"美食酒水新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"美食酒水新品","id":109241002,"subCateList":[]},{"showIndex":15,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/aea14016264a2ccd83a6295bf93fb714.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/aea14016264a2ccd83a6295bf93fb714.png","type":3,"frontName":"个护清洁新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"个护清洁新品","id":109241003,"subCateList":[]},{"showIndex":14,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/10dd076c96e0248ae1b54d4b277439cf.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/10dd076c96e0248ae1b54d4b277439cf.png","type":3,"frontName":"运动旅行新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"运动旅行新品","id":109241004,"subCateList":[]},{"showIndex":13,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/1fb768e549be93be3da68930bc7c7f4b.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/1fb768e549be93be3da68930bc7c7f4b.png","type":3,"frontName":"母婴亲子新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"母婴亲子新品","id":109241005,"subCateList":[]},{"showIndex":12,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/dc413d2d5e81dc11997b8a0ca0abab2f.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/dc413d2d5e81dc11997b8a0ca0abab2f.png","type":3,"frontName":"数码家电新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"数码家电新品","id":109241006,"subCateList":[]},{"showIndex":11,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/7b29bba18a0cbf5de8cbb76607b13077.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/7b29bba18a0cbf5de8cbb76607b13077.png","type":3,"frontName":"全球特色新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"全球特色新品","id":109241007,"subCateList":[]}]},{"showIndex":1,"level":"L1","wapBannerUrl":"https://yanxuan.nosdn.127.net/e8bf0cf08cf7eda21606ab191762e35c.png","bannerUrl":"https://yanxuan.nosdn.127.net/761877bc4e2cf50d7c424a8a7e6378bf.jpg","frontDesc":"回家，放松身心","type":0,"frontName":"","categoryType":0,"imgUrl":"","superCategoryId":0,"name":"居家生活","iconUrl":"https://yanxuan.nosdn.127.net/a45c2c262a476fea0b9fc684fed91ef5.png","id":1005000,"subCateList":[]},{"showIndex":2,"level":"L1","wapBannerUrl":"https://yanxuan.nosdn.127.net/e9fe3cabed74c62c447396c8a4a8db0b.png","bannerUrl":"https://yanxuan.nosdn.127.net/2d7c7841acae25d7bd66d95d22cb20f9.png","frontDesc":"贴身的，要亲肤","type":0,"frontName":"","categoryType":0,"imgUrl":"","superCategoryId":0,"name":"服饰鞋包","iconUrl":"https://yanxuan.nosdn.127.net/9f64e690b593694a25cb0be4807d4de5.png","id":1010000,"subCateList":[]},{"showIndex":3,"level":"L1","wapBannerUrl":"https://yanxuan.nosdn.127.net/fb670ff3511182833e5b035275e4ac09.png","bannerUrl":"https://yanxuan.nosdn.127.net/e71c18948044771a7ebd4c9cc551ce8a.png","frontDesc":"好吃，高颜值美食","type":0,"frontName":"","categoryType":0,"imgUrl":"","superCategoryId":0,"name":"美食酒水","iconUrl":"https://yanxuan.nosdn.127.net/c9280327a3fd2374c000f6bf52dff6eb.png","id":1005002,"subCateList":[]},{"showIndex":4,"level":"L1","wapBannerUrl":"https://yanxuan.nosdn.127.net/284e588ee387f8491afd93d3cec77901.png","bannerUrl":"https://yanxuan.nosdn.127.net/73e8dfdda753de91e028da67a0963c1a.png","frontDesc":"亲肤之物，严选天然","type":0,"frontName":"","categoryType":0,"imgUrl":"","superCategoryId":0,"name":"个护清洁","iconUrl":"https://yanxuan.nosdn.127.net/a6dcd39065e12767ec099cf37b65f000.png","id":1013001,"subCateList":[]},{"showIndex":5,"level":"L1","wapBannerUrl":"https://yanxuan.nosdn.127.net/f946bc18da43e2f1f5417aec2060e492.png","bannerUrl":"https://yanxuan.nosdn.127.net/e65d94b55a1c785cedeb398f62115922.png","frontDesc":"爱，从心开始","type":0,"frontName":"","categoryType":0,"imgUrl":"","superCategoryId":0,"name":"母婴亲子","iconUrl":"https://yanxuan.nosdn.127.net/0a427bfa1804cdf3fb5249b4c31e6319.png","id":1011000,"subCateList":[]},{"showIndex":6,"level":"L1","wapBannerUrl":"https://yanxuan.nosdn.127.net/740f6ec44f396001a19ce3bb34b06d8e.png","bannerUrl":"https://yanxuan.nosdn.127.net/20a3cc5d6c582f65119503b93b005976.png","frontDesc":"走出去，自然的恩赐","type":0,"frontName":"","categoryType":0,"imgUrl":"","superCategoryId":0,"name":"运动旅行","iconUrl":"https://yanxuan.nosdn.127.net/d1bb0452344b61f78da41dcb74c57d28.png","id":109243029,"subCateList":[]},{"showIndex":7,"level":"L1","wapBannerUrl":"https://yanxuan.nosdn.127.net/4ac8bfac92724054a3ab2aafe5676832.jpg","bannerUrl":"https://yanxuan.nosdn.127.net/fcd5a4b7f9dc02673945513aecc3d14a.jpg","frontDesc":"智能电器，点亮生活。","type":0,"frontName":"","categoryType":0,"imgUrl":"","superCategoryId":0,"name":"数码家电","iconUrl":"https://yanxuan.nosdn.127.net/4a54379128e65792fd836ee461e2ce27.png","id":1043000,"subCateList":[]},{"showIndex":9,"level":"L1","wapBannerUrl":"https://yanxuan.nosdn.127.net/1706e24a5e605870ba3b37ff5f49aa18.png","bannerUrl":"https://yanxuan.nosdn.127.net/54e55e9d8a74c2cef5d624f99860ccdb.png","frontDesc":"爱好，点缀生活","type":0,"frontName":"","categoryType":0,"imgUrl":"","superCategoryId":0,"name":"全球特色","iconUrl":"https://yanxuan.nosdn.127.net/7093cfecb9dde1dd3eaf459623df4071.png","id":1019000,"subCateList":[]}]};

/***/ }),

/***/ 156:
/*!*****************************************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/common/datas/cateLists.json ***!
  \*****************************************************************************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, default */
/***/ (function(module) {

module.exports = [{"categoryList":[{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/c117ea2f1c4d978eb1f310d6d9ec3226.png","bannerUrl":"https://yanxuan.nosdn.127.net/c117ea2f1c4d978eb1f310d6d9ec3226.png","type":0,"frontName":"自家员工眼里，什么值得买","categoryType":0,"superCategoryId":11,"extra":{"materialContentFrom":1,"materialName":"推荐专区-员工精选好货","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":1,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629129","taskId":"54645701"},"name":"精选好物15元起","id":9999954645701,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/cda4a56526a230055bea8221a6b7ab11.png","bannerUrl":"https://yanxuan.nosdn.127.net/cda4a56526a230055bea8221a6b7ab11.png","type":0,"frontName":"这些商品都是999+的好评","categoryType":0,"superCategoryId":11,"extra":{"materialContentFrom":1,"materialName":"推荐专区-999 好评","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":2,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629151","taskId":"54645702"},"name":"999+好评","id":9999954645702,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/71a5f1a0299e278f8193c193d8b7d1e4.png","bannerUrl":"https://yanxuan.nosdn.127.net/71a5f1a0299e278f8193c193d8b7d1e4.png","type":0,"frontName":"网易严选明星商品，百万用户的共同选择","categoryType":0,"superCategoryId":11,"extra":{"materialContentFrom":1,"materialName":"推荐专区-明星商品","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":3,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54630361","taskId":"54645703"},"name":"明星商品低至69元","id":9999954645703,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/da5ac697d47e43bd6ad9ce8b1e5e0060.png","bannerUrl":"https://yanxuan.nosdn.127.net/da5ac697d47e43bd6ad9ce8b1e5e0060.png","type":0,"frontName":"必买爆品新鲜补单","categoryType":0,"superCategoryId":11,"extra":{"materialContentFrom":1,"materialName":"推荐专区-断货补单榜","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":4,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54631826","taskId":"54645704"},"name":"断货补单王39元起","id":9999954645704,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/25daae363ef6662629d06e70846b983f.png","bannerUrl":"https://yanxuan.nosdn.127.net/25daae363ef6662629d06e70846b983f.png","type":0,"frontName":"9.9、19.9、49.9、99.9好物推荐","categoryType":0,"superCategoryId":11,"extra":{"materialContentFrom":1,"materialName":"推荐专区-9.9元超值好物","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":5,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629133","taskId":"54645705"},"name":"9.9元超值好物","id":9999954645705,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/a449c1305adff30ce82922f2e3546cf2.png","bannerUrl":"https://yanxuan.nosdn.127.net/a449c1305adff30ce82922f2e3546cf2.png","type":0,"frontName":"不出门也能拥有好心情","categoryType":0,"superCategoryId":11,"extra":{"materialContentFrom":1,"materialName":"宅家囤美食","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":6,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54639399","taskId":"54647387"},"name":"宅家囤美食","id":9999954647387,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/1aa18004d8b43e7bc55d54dd03ee5f29.png","bannerUrl":"https://yanxuan.nosdn.127.net/1aa18004d8b43e7bc55d54dd03ee5f29.png","type":0,"frontName":"寒潮来袭，保暖好物推荐","categoryType":0,"superCategoryId":11,"extra":{"materialContentFrom":1,"materialName":"推荐专区-降温必备好物","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":7,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54635008","taskId":"54645707"},"name":"降温降价39元起","id":9999954645707,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/0cb19987ddd873c693272c60352ba6a7.png","bannerUrl":"https://yanxuan.nosdn.127.net/0cb19987ddd873c693272c60352ba6a7.png","type":0,"frontName":"这些生活小确幸，50元就可以抱回家","categoryType":0,"superCategoryId":11,"extra":{"materialContentFrom":1,"materialName":"推荐专区-50元幸福好物","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":8,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629136","taskId":"54645708"},"name":"50元幸福好物","id":9999954645708,"subCateList":[]}],"name":"","id":11,"imgUrl":"https://yanxuan.nosdn.127.net/868844d3288f130c1aa808312dbbd1d8.png?quality=75&type=webp&imageView&thumbnail=0x196"},{"categoryList":[{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/c4bf35c93af25b7c9c8c89ad1b1d19b6.png","bannerUrl":"https://yanxuan.nosdn.127.net/c4bf35c93af25b7c9c8c89ad1b1d19b6.png","type":0,"frontName":"","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"杀菌消毒","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":1,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54639494","taskId":"54646514"},"name":"杀菌消毒","id":9999954646514,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/f8e1511c63bdcd3d08f8aac47a6f5ad2.png","bannerUrl":"https://yanxuan.nosdn.127.net/f8e1511c63bdcd3d08f8aac47a6f5ad2.png","type":0,"frontName":"","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"提高免疫","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":2,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54639507","taskId":"54646539"},"name":"提高免疫","id":9999954646539,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/c2998cee2f7c5f8eab2f4a546f10e14c.png","bannerUrl":"https://yanxuan.nosdn.127.net/c2998cee2f7c5f8eab2f4a546f10e14c.png","type":0,"frontName":"快速进入工作状态，宅家也能高效办公","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"推荐专区-宅家办公","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":3,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54635011","taskId":"54646540"},"name":"远程办公","id":9999954646540,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/d65e9c8ed4c93cc4a9144b3fc80ff553.png","bannerUrl":"https://yanxuan.nosdn.127.net/d65e9c8ed4c93cc4a9144b3fc80ff553.png","type":0,"frontName":"","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"室内运动好物","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":4,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629150","taskId":"54646541"},"name":"室内运动","id":9999954646541,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/8b20393c8220b369e59ffe0e45f9696e.png","bannerUrl":"https://yanxuan.nosdn.127.net/8b20393c8220b369e59ffe0e45f9696e.png","type":0,"frontName":"","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"秋冬好物-日用换新","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":5,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54631793","taskId":"54646518"},"name":"日用换新","id":9999954646518,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/b90129aae85c64794d1a68d2177af50f.png","bannerUrl":"https://yanxuan.nosdn.127.net/b90129aae85c64794d1a68d2177af50f.png","type":0,"frontName":"","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"生鲜果蔬","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":6,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54639495","taskId":"54646520"},"name":"生鲜果蔬","id":9999954646520,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/160274883e15e024802d25832f0e7ed1.png","bannerUrl":"https://yanxuan.nosdn.127.net/160274883e15e024802d25832f0e7ed1.png","type":0,"frontName":"","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"秋冬好物-干季护肤","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":7,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54631799","taskId":"54646522"},"name":"干季护肤","id":9999954646522,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/b049ba42c4a7413eef72f3be8b6f85da.png","bannerUrl":"https://yanxuan.nosdn.127.net/b049ba42c4a7413eef72f3be8b6f85da.png","type":0,"frontName":"","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"暖冬好物-解馋必备小食","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":8,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54632697","taskId":"54646521"},"name":"解馋小食","id":9999954646521,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/04516a37a1f2aaaf6b388bbeaa4ec02a.png","bannerUrl":"https://yanxuan.nosdn.127.net/04516a37a1f2aaaf6b388bbeaa4ec02a.png","type":0,"frontName":"","categoryType":0,"superCategoryId":12,"extra":{"materialContentFrom":1,"materialName":"秋冬好物-秋日养生","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":9,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54631798","taskId":"54646523"},"name":"宅家养生","id":9999954646523,"subCateList":[]}],"name":"","id":12,"imgUrl":"https://yanxuan.nosdn.127.net/37d7317bfb19641d744c6a45fb5d350a.jpg?quality=75&type=webp&imageView&thumbnail=0x196"},{"categoryList":[{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/4a7eaff4e3cb3b7e90a7e88ffc897f04.png","bannerUrl":"https://yanxuan.nosdn.127.net/4a7eaff4e3cb3b7e90a7e88ffc897f04.png","type":0,"frontName":"居家生活爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-居家生活","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":1,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629163","taskId":"54644374"},"name":"居家生活","id":9999954644374,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/5aa5f7d5f2d137c1bf635eba8477aca1.png","bannerUrl":"https://yanxuan.nosdn.127.net/5aa5f7d5f2d137c1bf635eba8477aca1.png","type":0,"frontName":"服饰鞋包爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-服饰鞋包","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":2,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629166","taskId":"54644375"},"name":"服饰鞋包","id":9999954644375,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/31e4234a9c64af28f5cee04b1425d758.png","bannerUrl":"https://yanxuan.nosdn.127.net/31e4234a9c64af28f5cee04b1425d758.png","type":0,"frontName":"美食酒水爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-美食酒水","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":3,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629167","taskId":"54644376"},"name":"美食酒水","id":9999954644376,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/31361f7e78182fe2a38c10148012a601.png","bannerUrl":"https://yanxuan.nosdn.127.net/31361f7e78182fe2a38c10148012a601.png","type":0,"frontName":"个护清洁爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-个护清洁","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":4,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54629168","taskId":"54644377"},"name":"个护清洁","id":9999954644377,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/5cbd1ced1c0c8148251601e68685bcd4.png","bannerUrl":"https://yanxuan.nosdn.127.net/5cbd1ced1c0c8148251601e68685bcd4.png","type":0,"frontName":"运动旅行爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-运动旅行","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":5,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54630536","taskId":"54644378"},"name":"运动旅行","id":9999954644378,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/6a9ee4e42c8675717a2aae6ebf7dcff5.png","bannerUrl":"https://yanxuan.nosdn.127.net/6a9ee4e42c8675717a2aae6ebf7dcff5.png","type":0,"frontName":"母婴亲子爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-母婴亲子","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":6,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54630538","taskId":"54644379"},"name":"母婴亲子","id":9999954644379,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/dce70bfc0cc50d65def7deb2b4d4a27e.png","bannerUrl":"https://yanxuan.nosdn.127.net/dce70bfc0cc50d65def7deb2b4d4a27e.png","type":0,"frontName":"数码家电爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-数码家电","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":7,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54630539","taskId":"54644380"},"name":"数码家电","id":9999954644380,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/d5690ebca5f6305b5ed5ee5a3ec7cd5d.png","bannerUrl":"https://yanxuan.nosdn.127.net/d5690ebca5f6305b5ed5ee5a3ec7cd5d.png","type":0,"frontName":"海外精选爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-海外精选","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":8,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54630540","taskId":"54644381"},"name":"海外精选","id":9999954644381,"subCateList":[]},{"showIndex":0,"wapBannerUrl":"https://yanxuan.nosdn.127.net/331332104225a04d91c1672224a9ab23.png","bannerUrl":"https://yanxuan.nosdn.127.net/331332104225a04d91c1672224a9ab23.png","type":0,"frontName":"周边特色爆品推荐","categoryType":0,"superCategoryId":13,"extra":{"materialContentFrom":1,"materialName":"爆品专区-周边特色","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":9,"materialType":"自定义二级分类","crmUserGroupId":"0","materialId":"54630541","taskId":"54644382"},"name":"周边特色","id":9999954644382,"subCateList":[]}],"name":"","id":13,"imgUrl":"https://yanxuan.nosdn.127.net/edc311882c97da117f860264548212e1.png?quality=75&type=webp&imageView&thumbnail=0x196"},{"categoryList":[{"showIndex":18,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/96330c8ddf2d128e950dca368b0ba0b0.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/96330c8ddf2d128e950dca368b0ba0b0.png","type":3,"frontName":"居家生活新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"居家生活新品","id":109241000,"subCateList":[]},{"showIndex":17,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/661e7ddc1918d291ea941a1ffc1b497a.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/661e7ddc1918d291ea941a1ffc1b497a.png","type":3,"frontName":"服饰鞋包新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"服饰鞋包新品","id":109241001,"subCateList":[]},{"showIndex":16,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/cc66ac0e306d77a241f6fd9ac34b2a00.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/cc66ac0e306d77a241f6fd9ac34b2a00.png","type":3,"frontName":"美食酒水新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"美食酒水新品","id":109241002,"subCateList":[]},{"showIndex":15,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/aea14016264a2ccd83a6295bf93fb714.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/aea14016264a2ccd83a6295bf93fb714.png","type":3,"frontName":"个护清洁新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"个护清洁新品","id":109241003,"subCateList":[]},{"showIndex":14,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/10dd076c96e0248ae1b54d4b277439cf.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/10dd076c96e0248ae1b54d4b277439cf.png","type":3,"frontName":"运动旅行新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"运动旅行新品","id":109241004,"subCateList":[]},{"showIndex":13,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/1fb768e549be93be3da68930bc7c7f4b.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/1fb768e549be93be3da68930bc7c7f4b.png","type":3,"frontName":"母婴亲子新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"母婴亲子新品","id":109241005,"subCateList":[]},{"showIndex":12,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/dc413d2d5e81dc11997b8a0ca0abab2f.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/dc413d2d5e81dc11997b8a0ca0abab2f.png","type":3,"frontName":"数码家电新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"数码家电新品","id":109241006,"subCateList":[]},{"showIndex":11,"wapBannerUrl":"https://yanxuan-item.nosdn.127.net/7b29bba18a0cbf5de8cbb76607b13077.png","bannerUrl":"https://yanxuan-item.nosdn.127.net/7b29bba18a0cbf5de8cbb76607b13077.png","type":3,"frontName":"全球特色新品推荐","categoryType":0,"wapExpandPicTargetUrl":"","superCategoryId":0,"name":"全球特色新品","id":109241007,"subCateList":[]}],"id":109217021,"imgUrl":"http://yanxuan.nosdn.127.net/dec6ff5ae8bae410809598950ba1f5b4.jpg?quality=75&type=webp&imageView&thumbnail=0x196"},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/e078499f093213840f0f5c94bc938f01.jpg?quality=75&type=webp&imageView&thumbnail=0x196","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"居家生活","id":1005000,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1d89de114797fb9237314920695c564d.png","name":"秋冬好物","id":109243003,"frontDesc":"温暖秋冬","type":0,"subCateList":[],"frontName":"秋冬好物"},{"categoryType":0,"showIndex":2,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0fe3073506c10f604c4ed7e0ba65d1f4.png","name":"主题床品","id":109243004,"frontDesc":"设计点亮，品质当道","type":0,"subCateList":[],"frontName":"设计点亮，品质当道"},{"categoryType":0,"showIndex":3,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/02d3e51b8db87c331dc73bef9e217133.png","name":"北欧原木","id":109252033,"frontDesc":"经典北欧风，打造原木家","type":0,"subCateList":[],"frontName":"经典北欧风，打造原木家"},{"categoryType":0,"showIndex":4,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan-item.nosdn.127.net/4ccd6ee87a83918474e7e962b06d96fd.png","name":"餐厨爆款清单","id":109261015,"frontDesc":"烹饪享乐趣","type":0,"subCateList":[],"frontName":"烹饪享乐趣"},{"categoryType":0,"showIndex":6,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ed6400e5be573e1524cdef0b5c9e462d.png","bannerUrl":"","name":"床品件套","id":1008009,"frontDesc":"甄选品质，睡眠美学","type":0,"subCateList":[],"frontName":"甄选品质，睡眠美学"},{"categoryType":0,"showIndex":7,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/96d109867f08a14af62d2390b7787439.png","name":"被枕盖毯","id":109260008,"frontDesc":"陷进柔软，多样选择","type":0,"subCateList":[],"frontName":"陷进柔软，多样选择"},{"categoryType":0,"showIndex":8,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b91e14afc5a138df8dbc3236146d24e6.png","bannerUrl":"","name":"床垫床褥","id":1008008,"frontDesc":"安心托护，美梦时刻","type":0,"subCateList":[],"frontName":"安心托护，美梦时刻"},{"categoryType":0,"showIndex":9,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ef4a874893fb5e76504fb044c2f7cd49.png","name":"抱枕靠垫","id":109260009,"frontDesc":"装点美家，生活美学","type":0,"subCateList":[],"frontName":"装点美家，生活美学"},{"showIndex":10,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0e5da66d87fc9db4279322d59f9b3d5b.png","bannerUrl":"","frontDesc":"装点家的格调","type":0,"frontName":"装点家的格调","categoryType":0,"superCategoryId":1005000,"name":"家饰","iconUrl":"","id":1011004,"subCateList":[]},{"categoryType":0,"showIndex":11,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d8f74a5d23c731084779b095e80fb3e3.png","bannerUrl":"","name":"居家布艺","id":1008002,"frontDesc":"趣意点缀，家中有格","type":0,"subCateList":[],"frontName":"趣意点缀，家中有格"},{"categoryType":0,"showIndex":12,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/aeecf63c24567c5a7a51b747a7dcf10a.png","name":"客餐厅家具","id":109243006,"frontDesc":"舒适经典，幸福宅家","type":0,"subCateList":[],"frontName":"舒适经典，幸福宅家"},{"categoryType":0,"showIndex":13,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/29a60124243be40301a571e09f8c935c.png","name":"卧室家具","id":109243007,"frontDesc":"天然选材，安心酣睡","type":0,"subCateList":[],"frontName":"天然选材，安心酣睡"},{"categoryType":0,"showIndex":14,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c35578aa38ec1c9e55aa74d9e77287a9.png","name":"办公书房家具","id":109243008,"frontDesc":"人体工学设计，健康办公","type":0,"subCateList":[],"frontName":"人体工学设计，健康办公"},{"categoryType":0,"showIndex":15,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/becde30fadf4ec335cd7ad8078798acf.png","name":"小件家具","id":109243009,"frontDesc":"实用至上，讲究质感","type":0,"subCateList":[],"frontName":"实用至上，讲究质感"},{"categoryType":0,"showIndex":16,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9bc4cae742e2b2709974ad074f897493.png","bannerUrl":"","name":"灯具","id":1008016,"frontDesc":"一盏灯，温暖一个家","type":0,"subCateList":[],"frontName":"一盏灯，温暖一个家"},{"categoryType":0,"showIndex":17,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f2e3e9df2cdb7e790e68356ac763cd58.png","name":"地毯窗帘","id":109261054,"frontDesc":"优质装点，柔软家居","type":0,"subCateList":[],"frontName":"优质装点，柔软家居"},{"categoryType":0,"showIndex":18,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ccf0ff26ca7bf8bbbc8683a740e28ae9.png","bannerUrl":"","name":"收纳","id":1008017,"frontDesc":"收纳神器大集结","type":0,"subCateList":[],"frontName":"收纳神器大集结"},{"categoryType":0,"showIndex":20,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/36d167a99e28b00dd08aa5e45fd33946.png","name":"晾晒除味","id":1092010,"frontDesc":"居家晾晒必备好物","type":0,"subCateList":[],"frontName":"居家晾晒必备好物"},{"categoryType":0,"showIndex":21,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f6eaa94e8920dd4290b9da7c545c8841.png","bannerUrl":"","name":"毛巾浴巾","id":1008001,"frontDesc":"亲肤柔棉，安心品质","type":0,"subCateList":[],"frontName":"亲肤柔棉，安心品质"},{"categoryType":0,"showIndex":22,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3e0c0c0f1d842ae66f4fbfd50a571ac1.png","name":"居家拖鞋","id":109243010,"frontDesc":"慵懒休闲时光，轻松惬意生活","type":0,"subCateList":[],"frontName":"慵懒休闲时光，轻松惬意生活"},{"categoryType":0,"showIndex":23,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3e60f0abe39d4cce0237edffad25c459.png","name":"家庭医疗","id":1092011,"frontDesc":"专业家庭医用好物","type":0,"subCateList":[],"frontName":"专业家庭医用好物"},{"categoryType":0,"showIndex":24,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/17cc6774b480037536a0f360bf207676.png","bannerUrl":"","name":"锅具","id":1005007,"frontDesc":"一口好锅，料理生活一日三餐","type":0,"subCateList":[],"frontName":"一口好锅，炖煮生活一日三餐"},{"categoryType":0,"showIndex":25,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1055eb85d2c5431c8f6623aed74bbbde.png","bannerUrl":"","name":"餐厨配件","id":1008012,"frontDesc":"下厨省力好帮手","type":0,"subCateList":[],"frontName":"下厨省力好帮手"},{"categoryType":0,"showIndex":26,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f17d41a51a2bb3a1b73f927959cd9ae2.png","bannerUrl":"","name":"刀剪砧板","id":1013005,"frontDesc":"传统工艺 源自中国刀城","type":0,"subCateList":[],"frontName":"传统工艺 源自中国刀城"},{"categoryType":0,"showIndex":27,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/338c77be5f292272e43869bcc52c8229.png","bannerUrl":"","name":"餐具","id":1005008,"frontDesc":"皇家道尔顿、日本KEYUCA制造商出品","type":0,"subCateList":[],"frontName":"餐桌上的舞蹈"},{"categoryType":0,"showIndex":28,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b24d4e3c402ecb4a95d7d6e8d77a93ba.png","bannerUrl":"","name":"水具杯壶","id":1007000,"frontDesc":"精工生产制作，匠人手艺","type":0,"subCateList":[],"frontName":"精工生产制作，匠人手艺"},{"categoryType":0,"showIndex":29,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6395f0efc4c720dbc1bee012af23e56e.png","bannerUrl":"","name":"茶咖酒具","id":1005009,"frontDesc":"严选精巧器具，轻松冲调","type":0,"subCateList":[],"frontName":"严选精巧器具，轻松冲调"},{"categoryType":0,"showIndex":30,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7d3612daccae482c1c9631992d4ffa44.png","name":"数码办公","id":109249013,"frontDesc":"职场数码办公用品","type":0,"subCateList":[],"frontName":"职场数码办公用品"},{"categoryType":0,"showIndex":31,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/41b1aa9754ea3d7cd29b2c753bdf3dd1.png","name":"办公家具","id":109248001,"frontDesc":"为健康办公生活加油","type":0,"subCateList":[],"frontName":"为健康办公生活加油"},{"categoryType":0,"showIndex":32,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2963d464664ffc426ed8dffd2f44ba16.png","name":"靠枕坐垫","id":109248002,"frontDesc":"让工位比被窝更舒适","type":0,"subCateList":[],"frontName":"让工位比被窝更舒适"},{"categoryType":0,"showIndex":33,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8bceb409edbc6415c91095a82d4d3edf.png","name":"宠物食品","id":1017000,"frontDesc":"用心选料，让爱宠健康成长","type":0,"subCateList":[],"frontName":"用心选料，让爱宠健康成长"},{"categoryType":0,"showIndex":34,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0dc939d1cb0e437b56e392fbf859f768.png","name":"宠物用品","id":109248004,"frontDesc":"贴心设计，照顾爱宠舒适生活","type":0,"subCateList":[],"frontName":"贴心设计，照顾爱宠舒适生活"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/9fafb4adb40303dc2914c3aa04da03df.jpg?quality=75&type=webp&imageView&thumbnail=0x196","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"服饰鞋包","id":1010000,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e279c3e247614d47404d9d5d88b397c9.png","name":"热销爆款","id":109257004,"frontDesc":"人气好物放心购","type":0,"subCateList":[],"frontName":"人气好物放心购"},{"categoryType":0,"showIndex":2,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d0a099cb4bfdb9afccf9470719b3611c.png","name":"好物上新","id":109243011,"frontDesc":"新品好物 一手掌握","type":0,"subCateList":[],"frontName":"新品好物 一手掌握"},{"categoryType":0,"showIndex":3,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1fc7bbf077f022659cb4eff564d382fa.png","name":"夏季新品","id":109243013,"frontDesc":"夏季热力爆品 抢先预览","type":0,"subCateList":[],"frontName":"夏季热力爆品 抢先预览"},{"categoryType":0,"showIndex":4,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/fa89d78c2c70477987ec09c56661dc31.png","name":"居家囤货","id":109243014,"frontDesc":"慵懒居家 一秒提升幸福感","type":0,"subCateList":[],"frontName":"慵懒居家 一秒提升幸福感"},{"categoryType":0,"showIndex":5,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f2ab8dca74661d5b7d36f80b14e50a5a.png","name":"抄底特惠","id":109259014,"frontDesc":"抄底特惠 低至5折","type":0,"subCateList":[],"frontName":"抄底特惠"},{"categoryType":0,"showIndex":6,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/10b0537e284e4eb89a9461e583d017db.png","name":"男式衬衫","id":1093008,"frontDesc":"经典百搭 精致设计","type":0,"subCateList":[],"frontName":"经典百搭 精致设计"},{"categoryType":0,"showIndex":7,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2c5a1f681831987ff3d4fb8e63f6d0d6.jpg","name":"男式针织衫/卫衣","id":109214004,"frontDesc":"简约调性 儒雅休闲自如切换","type":0,"subCateList":[],"frontName":"简约调性 儒雅休闲自如切换"},{"categoryType":0,"showIndex":8,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/35b564c2867fc5faed9403cec440bafe.png","name":"男式外套","id":1093012,"frontDesc":"自在潇洒穿着感","type":0,"subCateList":[],"frontName":"自在潇洒穿着感"},{"categoryType":0,"showIndex":9,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/690dee73a00b6922664f727b40a58a3b.png","name":"男式牛仔","id":1068003,"frontDesc":"颠覆牛仔认知 革新你的穿着体验","type":0,"subCateList":[],"frontName":"颠覆牛仔认知 革新你的穿着体验"},{"categoryType":0,"showIndex":10,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/270011056e5216e03d2d054683c2b337.png","name":"女式内衣","id":109272000,"frontDesc":"柔软呵护","type":0,"subCateList":[],"frontName":"柔软呵护"},{"categoryType":0,"showIndex":11,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/aba02a880a47a4a62cd85842ea6eadce.jpg","name":"男式裤装","id":1093009,"frontDesc":"高质感面料 休闲商务两适宜","type":0,"subCateList":[],"frontName":"高质感面料 休闲商务两适宜"},{"categoryType":0,"showIndex":12,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f917b00b07445c46a1df90ccaff2a8de.png","name":"男式T恤/POLO","id":109214000,"frontDesc":"内搭T恤 贴身自在","type":0,"subCateList":[],"frontName":"内搭T恤 贴身自在"},{"categoryType":0,"showIndex":13,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a729319b8b4d127b09402f65c96d421f.jpg","name":"女式针织衫/卫衣","id":109214003,"frontDesc":"体验温柔的质感","type":0,"subCateList":[],"frontName":"体验温柔的质感"},{"categoryType":0,"showIndex":14,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7a6f1ba8da59a454e7c4a2b7b61ff26a.jpg","name":"女式衬衫","id":109214001,"frontDesc":"职场精致LOOK","type":0,"subCateList":[],"frontName":"职场精致LOOK"},{"categoryType":0,"showIndex":15,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3084ec837a9f38b053b81061cfcdae78.png","name":"女式外套","id":1093010,"frontDesc":"选对风格 只做自己","type":0,"subCateList":[],"frontName":"选对风格 只做自己"},{"categoryType":0,"showIndex":16,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/55ddb8143c911ee1881a6205572c718e.png","name":"女式裤装","id":1093007,"frontDesc":"轻松舒适 送给双腿的温柔力量","type":0,"subCateList":[],"frontName":"轻松舒适 送给双腿的温柔力量"},{"categoryType":0,"showIndex":17,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2f4686765e77abf8213f2b0e127045be.png","name":"女式牛仔","id":109214002,"frontDesc":"基础裤型的舒适之选","type":0,"subCateList":[],"frontName":"基础裤型的舒适之选"},{"categoryType":0,"showIndex":18,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/77ade36fe051e9800409dbfd3f7fa644.jpg","name":"女式T恤/POLO","id":1093006,"frontDesc":"精选材质 穿出质感","type":0,"subCateList":[],"frontName":"精选材质 穿出质感"},{"categoryType":0,"showIndex":19,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2b65c76b9aec77fe724b23199c79e718.png","name":"女式裙装","id":1037007,"frontDesc":"量身裁体的优雅","type":0,"subCateList":[],"frontName":"量身裁体的优雅"},{"categoryType":0,"showIndex":20,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e7fee5bb435eb5d5f094eb9f65df6c86.jpg","name":"男式家居服","id":1093004,"frontDesc":"舒适源自高品质","type":0,"subCateList":[],"frontName":"舒适源自高品质"},{"categoryType":0,"showIndex":21,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/603d7a8d9e2449aaec58ca191d0bea61.jpg","name":"女式家居服","id":1093005,"frontDesc":"享受宅家时光","type":0,"subCateList":[],"frontName":"享受宅家时光"},{"categoryType":0,"showIndex":22,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8207750f810aea25e43c423e6de7f943.png","bannerUrl":"","name":"男式内裤","id":1010002,"frontDesc":"透气舒爽 自由空间","type":0,"subCateList":[],"frontName":"透气舒爽 自由空间"},{"categoryType":0,"showIndex":23,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b330070087bb87cb7586bd4097aa5a65.png","bannerUrl":"","name":"女式内裤","id":1013006,"frontDesc":"温和安全 亲密呵护","type":0,"subCateList":[],"frontName":"温和安全 亲密呵护"},{"categoryType":0,"showIndex":24,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/59122ca632ba972f02d8621458da74c4.png","name":"女式文胸/套装","id":1093011,"frontDesc":"贴身关怀 少束缚","type":0,"subCateList":[],"frontName":"贴身关怀 少束缚"},{"categoryType":0,"showIndex":25,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/df3c77be2e897ad51fb5cfd2040b7b55.png","name":"男式内衣","id":1093013,"frontDesc":"绅士的第二肌肤","type":0,"subCateList":[],"frontName":"绅士的第二肌肤"},{"categoryType":0,"showIndex":26,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f850599cb9c99a523b0a88160da80eca.png","bannerUrl":"","name":"男袜","id":1008004,"frontDesc":"始于足下的品质生活","type":0,"subCateList":[],"frontName":"始于足下的品质生活"},{"categoryType":0,"showIndex":27,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e888bde27a75c01f67b20c8b3eb3cee3.png","name":"丝袜","id":1034000,"frontDesc":"犹如你腿部的第二层肌肤","type":0,"subCateList":[],"frontName":"犹如你腿部的第二层肌肤"},{"categoryType":0,"showIndex":28,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/27ba0c6e4898bffd723ea4272e6380db.png","bannerUrl":"","name":"女袜/连裤袜","id":109273001,"frontDesc":"始于足下的品质生活","type":0,"subCateList":[],"frontName":"始于足下的品质生活"},{"categoryType":0,"showIndex":29,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/5452d909f0caddc1b9a8311968e78a17.png","bannerUrl":"","name":"男鞋","id":1008003,"frontDesc":"匠心打造 轻潮舒适","type":0,"subCateList":[],"frontName":"匠心打造 轻潮舒适"},{"categoryType":0,"showIndex":30,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1a51bbdd24badf39d66b884ea71e665c.png","bannerUrl":"","name":"女鞋","id":1013000,"frontDesc":"优雅 如此舒适","type":0,"subCateList":[],"frontName":"优雅 如此舒适"},{"categoryType":0,"showIndex":31,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2885bf2a48a744cbf6c1aa4a9d0f907b.png","bannerUrl":"","name":"拖鞋","id":1008010,"frontDesc":"慵懒休闲时光 轻松惬意生活","type":0,"subCateList":[],"frontName":"慵懒休闲时光 轻松惬意生活"},{"showIndex":32,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/eedd6de98be2da9e63608b994035bf14.png","bannerUrl":"","frontDesc":"呵护双脚 驱散行走的压力","type":0,"frontName":"呵护双脚 驱散行走的压力","categoryType":0,"superCategoryId":1010000,"name":"鞋配","iconUrl":"","id":1044000,"subCateList":[]},{"categoryType":0,"showIndex":33,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dbc1125c627b106de9b3d078b97292fb.png","name":"女士包袋","id":1056002,"frontDesc":"包里装着你的整个世界","type":0,"subCateList":[],"frontName":"包里装着你的整个世界"},{"categoryType":0,"showIndex":34,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e8b034f63aac15198f971503a6370947.png","name":"男士包袋","id":1056001,"frontDesc":"懂你的责任也更懂你","type":0,"subCateList":[],"frontName":"懂你的责任也更懂你"},{"categoryType":0,"showIndex":35,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a94a5d317d289f01a93ee093c3975121.png","name":"钱包及小皮件","id":1056003,"frontDesc":"握在手中的精致","type":0,"subCateList":[],"frontName":"握在手中的精致"},{"categoryType":0,"showIndex":36,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/638f6de1cfa9defef5468a952f4efcad.png","name":"行李箱","id":1037000,"frontDesc":"带着梦想即刻出发","type":0,"subCateList":[],"frontName":"带着梦想即刻出发"},{"showIndex":37,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/210c5f72a701ec888efa0c1d885d1de1.png","bannerUrl":"","frontDesc":"璀璨闪耀 品质甄选","type":0,"frontName":"璀璨闪耀 品质甄选","categoryType":0,"superCategoryId":1010000,"name":"奢华珠宝","iconUrl":"","id":1020008,"subCateList":[]},{"categoryType":0,"showIndex":38,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1eb26c281fa9b7b9e386cfd5ce1d67a7.png","name":"时尚饰品","id":109253000,"frontDesc":"精致灵动的小确幸","type":0,"subCateList":[],"frontName":"精致灵动的小确幸"},{"categoryType":0,"showIndex":39,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a83b12528629ec1f6d08e6344739fce7.png","bannerUrl":"","name":"围巾手套","id":1008007,"frontDesc":"冬日出街必备","type":0,"subCateList":[],"frontName":"冬日出街必备"},{"categoryType":0,"showIndex":40,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1d653f706fb834937a3d1c29e5725618.png","name":"眼镜墨镜","id":1036001,"frontDesc":"你和潮流之间就差一个我","type":0,"subCateList":[],"frontName":"你和潮流之间就差一个我"},{"categoryType":0,"showIndex":41,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/52d449042bc437f6179935624f0c1056.png","bannerUrl":"","name":"腰带腕表","id":1010004,"frontDesc":"匠心雕琢细节 细节彰显品位","type":0,"subCateList":[],"frontName":"匠心雕琢细节 细节彰显品位"},{"categoryType":0,"showIndex":42,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dbee5f088438f7a1538454372788845d.png","name":"帽子发饰","id":109253001,"frontDesc":"时髦 从“头”开始","type":0,"subCateList":[],"frontName":"时髦 从“头”开始"},{"categoryType":0,"showIndex":43,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/01f06c74b0591a8da403199cf27dd875.png","name":"Yessing上装","id":109202000,"frontDesc":"运动生活两相宜","type":0,"subCateList":[],"frontName":"运动生活两相宜"},{"categoryType":0,"showIndex":44,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6a68adf468654a26d916fcaf5a4ab5bd.png","name":"Yessing下装","id":109214006,"frontDesc":"时尚下装 元气满满","type":0,"subCateList":[],"frontName":"时尚下装 元气满满"},{"categoryType":0,"showIndex":45,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9fe3213589cf74af2ec8ec3ce5322ada.png","name":"女式上装","id":109255016,"frontDesc":"一步获取元气女神","type":0,"subCateList":[],"frontName":"一步获取元气女神"},{"categoryType":0,"showIndex":46,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d0c83b8c8429de534a5945e2a6135a8a.png","name":"男式上装","id":109255014,"frontDesc":"运动休闲型男魅力","type":0,"subCateList":[],"frontName":"运动休闲型男魅力"},{"categoryType":0,"showIndex":47,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/353876f9db324dc0976ccef7bc834451.png","name":"女式下装","id":109255017,"frontDesc":"好穿易搭轻松减龄","type":0,"subCateList":[],"frontName":"好穿易搭轻松减龄"},{"categoryType":0,"showIndex":48,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/25a81eb6ab646d8a294f3a51d7dc231f.png","name":"男式下装","id":109255015,"frontDesc":"时尚生活有型有款","type":0,"subCateList":[],"frontName":"时尚生活有型有款"},{"categoryType":0,"showIndex":49,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8ebf546b13d24f2dc3c08521b592313f.png","name":"免烫系列","id":109263000,"frontDesc":"舒适免烫 时刻平整","type":0,"subCateList":[],"frontName":"舒适免烫 时刻平整"},{"categoryType":0,"showIndex":50,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a9db6faaa689c4dfcc37ef80d0552b1a.png","name":"棉麻系列","id":109263002,"frontDesc":"透气棉麻 清楚不羁","type":0,"subCateList":[],"frontName":"透气棉麻 清楚不羁"},{"categoryType":0,"showIndex":51,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cc358f426cbe81d9e806c6b7c2fb64aa.png","name":"真丝系列","id":109263003,"frontDesc":"生活质感更考究","type":0,"subCateList":[],"frontName":"生活质感更考究"},{"categoryType":0,"showIndex":52,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/674af56699e3ccf525f4d65b7bab5446.png","name":"莫代尔系列","id":109263004,"frontDesc":"舒适不同凡响","type":0,"subCateList":[],"frontName":"舒适不同凡响"},{"categoryType":0,"showIndex":53,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9f7531cbaa489ec85a91a3a7dae92e21.png","name":"几何森林","id":109263005,"frontDesc":"绮梦穿梭 视觉世界","type":0,"subCateList":[],"frontName":"绮梦穿梭 视觉世界"},{"categoryType":0,"showIndex":54,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f08b4c04de93a6896f4e02df44ab457b.png","name":"海洋环保","id":109269000,"frontDesc":"海洋垃圾再生面料 时尚又环保","type":0,"subCateList":[],"frontName":"海洋环保"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/a657e5214585b1825b7970c4b956e3c2.jpg?quality=75&type=webp&imageView&thumbnail=0x196","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"美食酒水","id":1005002,"type":0,"subCateList":[{"showIndex":1,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/85bf41ca68dc4fe79892344af5887e56.png","bannerUrl":"","frontDesc":"春节宅家囤美食，放假期间正常发货","type":0,"frontName":"春节宅家囤美食，放假期间正常发货","categoryType":0,"superCategoryId":1005002,"name":"宅家囤美食","iconUrl":"","id":109271000,"subCateList":[]},{"categoryType":0,"showIndex":2,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/eefce6cae6d9f89b309612f70a80c3e0.png","name":"居家保健","id":109273000,"frontDesc":"宅家吃好物，强身养生抵抗力棒","type":0,"subCateList":[],"frontName":"宅家吃好物，强身养生抵抗力棒"},{"categoryType":0,"showIndex":3,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6282955a3db5db7c0ee06e9d560c165f.png","name":"上新美味","id":109253007,"frontDesc":"为你寻遍世间美味，让你品尝第一口好物","type":0,"subCateList":[],"frontName":"为你寻遍世间美味，让你品尝第一口好物"},{"categoryType":0,"showIndex":4,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/59fa0a9ddd1264dbc6f4cb8979357007.png","name":"大家都在买","id":109253008,"frontDesc":"网友购物车里的美食的TOP榜","type":0,"subCateList":[],"frontName":"网友购物车里的美食的TOP榜"},{"categoryType":0,"showIndex":5,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2e753a8f0977fd09a74ccea4f0c6192c.png","bannerUrl":"","name":"饼干糕点","id":1008015,"frontDesc":"无人工添加香精、防腐剂","type":0,"subCateList":[],"frontName":"四季糕点，用心烘焙"},{"categoryType":0,"showIndex":6,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6941ede8541ceeb432e8da16e200152b.png","bannerUrl":"","name":"小食糖巧","id":1005011,"frontDesc":"原香鲜材，以小食之味，带来味蕾惊喜","type":0,"subCateList":[],"frontName":"原香鲜材，以小食之味，带来味蕾惊喜"},{"categoryType":0,"showIndex":7,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/18dc905db6c49fbf55b2709078875cdb.png","name":"肉类零食","id":1035003,"frontDesc":"真嗜肉者，都爱这一味，或麻辣鲜香、或五味俱全，都是佳肴美馔真滋味","type":0,"subCateList":[],"frontName":"真嗜肉者，都爱这一味，佳肴美馔真滋味"},{"categoryType":0,"showIndex":8,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/46b5256193d052612ecb9fb22d7f4b88.png","bannerUrl":"","name":"坚果炒货","id":1005010,"frontDesc":"精选原产地，美味加营养","type":0,"subCateList":[],"frontName":"精选原产地，美味加营养"},{"showIndex":9,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dfc7d79ca21ee0f55428c8be218da5d3.png","bannerUrl":"","frontDesc":"品尝与收获到的是自然的味道","type":0,"frontName":"品尝与收获到的是自然的味道","categoryType":0,"superCategoryId":1005002,"name":"蜜饯果干","iconUrl":"","id":1027001,"subCateList":[]},{"categoryType":0,"showIndex":10,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8d4523c21259f514d378ad7431cd4a75.png","bannerUrl":"","name":"冲调饮品","id":1005013,"frontDesc":"以用料天然之美，尽享闲雅之意","type":0,"subCateList":[],"frontName":"以用料天然之美，尽享闲雅之意"},{"categoryType":0,"showIndex":11,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/edb41097ac4cc34ffd08d02f125c98e8.jpg","name":"传统茗茶","id":1027000,"frontDesc":"一品茶香，品茗即是观心，饮茶涤净尘虑","type":0,"subCateList":[],"frontName":"一品茶香，品茗即是观心，饮茶涤净尘虑"},{"showIndex":12,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/01a25fc0ec89278943d488eba3b959e1.jpg","bannerUrl":"","frontDesc":"人生圆满，不过赠好友一盒茶礼，品味畅谈","type":0,"frontName":"人生圆满，不过赠好友一盒茶礼，品味畅谈","categoryType":0,"superCategoryId":1005002,"name":"茗茶礼盒","iconUrl":"","id":109260000,"subCateList":[]},{"categoryType":0,"showIndex":13,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/bd65e6d2bd8985e55d38c06f173a6fb5.jpg","name":"茶包花茶","id":109206006,"frontDesc":"办公室必备茶包花茶","type":0,"subCateList":[],"frontName":"办公室必备茶包花茶"},{"categoryType":0,"showIndex":14,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0a66214a911887c854cb75e4112c07ed.png","name":"滋补食材","id":1054001,"frontDesc":"营养滋补，只为健康","type":0,"subCateList":[],"frontName":"营养滋补，只为健康"},{"categoryType":0,"showIndex":15,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/65fa4fbdbff206271c27179844e9297a.png","name":"保健品","id":109206016,"frontDesc":"保健佳品","type":0,"subCateList":[],"frontName":"保健佳品"},{"categoryType":0,"showIndex":16,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/25428a7b8047d4e35ab58367bf44d030.png","name":"乳品饮料","id":109206008,"frontDesc":"四季饮料，欢乐共享","type":0,"subCateList":[],"frontName":"四季饮料，欢乐共享"},{"categoryType":0,"showIndex":17,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e2ec593d7d5feae8a2f227892d08b081.png","name":"酒类","id":1053001,"frontDesc":"美酒佳酿，用心典藏","type":0,"subCateList":[],"frontName":"美酒佳酿，用心典藏"},{"categoryType":0,"showIndex":18,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e486923c1ffa14ad47672c6d495be8ed.png","name":"名酒馆","id":109264007,"frontDesc":"寻遍全球，甄选世界好酒","type":0,"subCateList":[],"frontName":"名酒馆"},{"categoryType":0,"showIndex":19,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7ecc7eab5519a1bf49fd2b6f4ad433ec.png","name":"米面粮油","id":109206007,"frontDesc":"米面粮油，家庭必备","type":0,"subCateList":[],"frontName":"米面粮油，家庭必备"},{"categoryType":0,"showIndex":20,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7154cb8de296a6d6acb16022d2725189.png","name":"方便食品","id":109201001,"frontDesc":"健康方便食品","type":0,"subCateList":[],"frontName":"健康方便食品"},{"categoryType":0,"showIndex":21,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4daf3eb8c49f473596bb15a71edc510f.png","bannerUrl":"","name":"南北干货","id":1005012,"frontDesc":"天时地利人和，寻找这个时节这个地点的味道","type":0,"subCateList":[],"frontName":"天时地利人和，寻找这个时节这个地点的味道"},{"categoryType":0,"showIndex":22,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/339889b1f38aba8b4a63c472e782d1ee.png","name":"调味酱菜","id":1036003,"frontDesc":"烹饪必备，美食调味","type":0,"subCateList":[],"frontName":"烹饪必备，美食调味"},{"categoryType":0,"showIndex":23,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e370d525c0bc5c35173fd72f2b598403.jpg","name":"水果蔬菜","id":109264008,"frontDesc":"应季果蔬，应有尽有","type":0,"subCateList":[],"frontName":"水果蔬菜"},{"categoryType":0,"showIndex":24,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d3e0c79acff00d7b481e003816d5c105.png","name":"肉蛋海鲜","id":109206009,"frontDesc":"新鲜肉质，新鲜体验","type":0,"subCateList":[],"frontName":"肉蛋海鲜"},{"categoryType":0,"showIndex":25,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/075e800278eea9266f2d839f4c6cb5a2.png","name":"冷冻冷藏","id":109264009,"frontDesc":"冷冻美食，冷藏好味道","type":0,"subCateList":[],"frontName":"冷冻冷藏"},{"showIndex":26,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0a35aef69fd20761d113f4dc54f4ef2c.png","bannerUrl":"","frontDesc":"安全配送，新鲜直达","type":0,"frontName":"安全配送，新鲜直达","categoryType":0,"superCategoryId":1005002,"name":"网易黑猪","iconUrl":"","id":1008014,"subCateList":[]},{"categoryType":0,"showIndex":27,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ed9fda295d73fa8bbd0b9ea428329c1b.png","name":"全球美食","id":109206010,"frontDesc":"全球制造，环球美食","type":0,"subCateList":[],"frontName":"全球制造，环球美食"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/0cf6e47037b7cc7688ec9845b543525f.jpg?quality=75&type=webp&imageView&thumbnail=0x196","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"个护清洁","id":1013001,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0af70c043ee2418c63eb74135084b215.png","name":"爆款榜单","id":109256007,"frontDesc":"精选口碑尖货","type":0,"subCateList":[],"frontName":"精选口碑尖货"},{"categoryType":0,"showIndex":2,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ad777c7b8e1e53040bfe7e46a93f5950.png","name":"面部护理","id":1020001,"frontDesc":"温和无刺激的呵护","type":0,"subCateList":[],"frontName":"温和无刺激的呵护"},{"categoryType":0,"showIndex":3,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ffce24773c1b680572353d1d864da1e7.jpg","name":"新品尝鲜","id":109256008,"frontDesc":"新品速递，等你来试","type":0,"subCateList":[],"frontName":"新品速递，等你来试"},{"categoryType":0,"showIndex":4,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/52bca59c658299046c4df435c3abee1c.png","name":"基础护肤","id":109256010,"frontDesc":"高效补水，深层修护","type":0,"subCateList":[],"frontName":"高效补水，深层修护"},{"categoryType":0,"showIndex":5,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e3211f79704b02298656ec8c99b6a70d.png","name":"卸妆洁面","id":109256009,"frontDesc":"温和配方，养卸一体","type":0,"subCateList":[],"frontName":"温和配方，养卸一体"},{"categoryType":0,"showIndex":6,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/52068e062728c10f4d4da30fed9d3280.png","name":"护肤工具","id":109256011,"frontDesc":"智能美颜，匠心工艺","type":0,"subCateList":[],"frontName":"智能美颜，匠心工艺"},{"categoryType":0,"showIndex":7,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1ac9a9eee6be87a02faaea2e3abfec25.png","bannerUrl":"","name":"洗发护发","id":1013003,"frontDesc":"护发超有效小秘诀","type":0,"subCateList":[],"frontName":"呵护秀发，柔顺不同发质"},{"categoryType":0,"showIndex":8,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cf842f27c11f1587ca55d20035c1caba.png","name":"身体护理","id":1037002,"frontDesc":"呵护肌肤，天然温和","type":0,"subCateList":[],"frontName":"呵护肌肤，天然温和"},{"categoryType":0,"showIndex":9,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cef1d1b9f26a01037d705443e585d313.png","name":"口腔护理","id":1037003,"frontDesc":"健康口腔，品质生活","type":0,"subCateList":[],"frontName":"健康口腔，品质生活"},{"categoryType":0,"showIndex":10,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/13d7d7e9fa5f59227f8d5c4be153a957.png","name":"女性护理","id":109208003,"frontDesc":"品质之选，温柔呵护","type":0,"subCateList":[],"frontName":"品质之选，温柔呵护"},{"categoryType":0,"showIndex":11,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/5f91b77da79bb06f72973ecbb63c6a64.png","bannerUrl":"","name":"彩妆修容","id":1013002,"frontDesc":"为你的面容添色","type":0,"subCateList":[],"frontName":"为你的面容添色"},{"categoryType":0,"showIndex":12,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/fd2d0e6a87331d18ec67e77cd0f09c5b.png","name":"美妆工具","id":109243017,"frontDesc":"选对工具，精致妆容","type":0,"subCateList":[],"frontName":"选对工具，精致妆容"},{"categoryType":0,"showIndex":13,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e4c674c49a1a7da65fda7d50e2a32328.png","bannerUrl":"","name":"香水香氛","id":1013004,"frontDesc":"提炼纯净，清雅不腻","type":0,"subCateList":[],"frontName":"提炼纯净，清雅不腻"},{"categoryType":0,"showIndex":14,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/31856d567e5c2de30f2d06c03994148c.png","name":"个护电器","id":109248003,"frontDesc":"科技护理，创享精致生活","type":0,"subCateList":[],"frontName":"科技护理，创享精致生活"},{"categoryType":0,"showIndex":15,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8efe5dc20ae937faa0f8918678728f3d.png","name":"口腔护理电器","id":109254053,"frontDesc":"专业高效护理口腔","type":0,"subCateList":[],"frontName":"专业高效护理口腔"},{"categoryType":0,"showIndex":16,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/be5d2abe1db1b8efe84bb48250d2899c.png","name":"面部护理电器","id":109254054,"frontDesc":"让你变美的仪器们","type":0,"subCateList":[],"frontName":"让你变美的仪器们"},{"categoryType":0,"showIndex":17,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/539ea18e491d8e0c98152eed1d300f54.png","name":"头发护理电器","id":109254055,"frontDesc":"头发亮泽光彩，随心造型","type":0,"subCateList":[],"frontName":"头发亮泽光彩，随心造型"},{"categoryType":0,"showIndex":18,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/fb99d01e5fc25568f97b6cf93012b1d2.png","name":"身体护理电器","id":109254056,"frontDesc":"爱护身体，方寸间蕴出肌肤之美","type":0,"subCateList":[],"frontName":"爱护身体，方寸间蕴出肌肤之美"},{"categoryType":0,"showIndex":19,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/921337182aa5a4540ab0632c1fb6ad89.png","name":"纸品湿巾","id":1037001,"frontDesc":"和风设计，温和清洁","type":0,"subCateList":[],"frontName":"和风设计，温和清洁"},{"categoryType":0,"showIndex":20,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/869ab6b70b45716c9ffd35ed55669855.png","name":"纸品","id":109256012,"frontDesc":"和风设计，原生木浆","type":0,"subCateList":[],"frontName":"和风设计，原生木浆"},{"categoryType":0,"showIndex":21,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1275d57ba465ea26488f3be701295099.png","name":"湿巾","id":109256013,"frontDesc":"温和致净，亲密呵护","type":0,"subCateList":[],"frontName":"温和致净，亲密呵护"},{"categoryType":0,"showIndex":22,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e40f60a3fe682b3317f3672e374dca0b.png","name":"衣物护理","id":109243015,"frontDesc":"洁净衣物，守护全家","type":0,"subCateList":[],"frontName":"洁净衣物，守护全家"},{"categoryType":0,"showIndex":23,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/54f2e4f7a9cb17b61804d4d9a8982889.png","bannerUrl":"","name":"家庭清洁","id":1009000,"frontDesc":"天然材料，温和去除污垢","type":0,"subCateList":[],"frontName":"洁净才能带来清爽心情"},{"categoryType":0,"showIndex":24,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/45d436cc3d818ee3686b9ceb2a6a71e0.png","name":"餐厨清洁","id":109243016,"frontDesc":"高效清洁，省时省心","type":0,"subCateList":[],"frontName":"高效清洁，省时省心"},{"categoryType":0,"showIndex":25,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/44114978a0117bac622cdc3ffdc7b638.png","name":"毛巾浴巾","id":109261055,"frontDesc":"亲肤柔棉，安心品质","type":0,"subCateList":[],"frontName":"亲肤柔棉，安心品质"},{"categoryType":0,"showIndex":26,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/76d4335b8a97c7e2635f66e1b71e4ee1.png","name":"浴室用品","id":1020002,"frontDesc":"环保材料，耐用不发霉","type":0,"subCateList":[],"frontName":"小工具成就美好浴室"},{"categoryType":0,"showIndex":27,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c96383b484c677dacd0c696040a769b4.png","name":"避孕套","id":109255010,"frontDesc":"给爱爱一层安全感","type":0,"subCateList":[],"frontName":"给爱爱一层安全感"},{"categoryType":0,"showIndex":28,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8ea84f70b41e0441b8df48bd2f88b26e.png","name":"女用情趣","id":109255011,"frontDesc":"解锁身体的快乐秘密","type":0,"subCateList":[],"frontName":"解锁身体的快乐秘密"},{"categoryType":0,"showIndex":29,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/5f2f9f911ff905040f6d5c747a5c9bf5.png","name":"男用情趣","id":109255012,"frontDesc":"男儿硬器，尽兴释放自己","type":0,"subCateList":[],"frontName":"男儿硬器，尽兴释放自己"},{"categoryType":0,"showIndex":30,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/72e99034707dc6ffa890b3e82113c8e6.png","name":"润滑液","id":109255013,"frontDesc":"让亲密接触更湿滑畅意","type":0,"subCateList":[],"frontName":"让亲密接触更湿滑畅意"},{"categoryType":0,"showIndex":31,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1adf88cfc906928959e5741e9455790f.png","name":"计生情趣","id":1037004,"frontDesc":"解锁身体里的快乐秘密","type":0,"subCateList":[],"frontName":"解锁身体里的快乐秘密"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/3dbb62e200611707a0f818833b823d9a.jpg?quality=75&type=webp&imageView&thumbnail=0x196","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"母婴亲子","id":1011000,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/97f65393f6a4a7b3d91cbe0cd19c617d.png","name":"防疫榜单","id":109259002,"frontDesc":"清洁洗护 科学防疫","type":0,"subCateList":[],"frontName":"清洁洗护 科学防疫"},{"categoryType":0,"showIndex":2,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ad29850918fab29003201e7778bf84ea.png","name":"宅家好物","id":109255006,"frontDesc":"文具玩具 成长好礼","type":0,"subCateList":[],"frontName":"文具玩具 成长好礼"},{"categoryType":0,"showIndex":3,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9dacf066ccf643c91b64cf93dfb9dfb5.png","name":"初春换新","id":1037005,"frontDesc":"服配居家 等你来挑","type":0,"subCateList":[],"frontName":"服配居家 等你来挑"},{"categoryType":0,"showIndex":4,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e16890ca1f2e296261025a896d5c16e0.png","name":"尾货秒杀","id":1034001,"frontDesc":"限量抢购 抄底折扣","type":0,"subCateList":[],"frontName":"限量抢购 抄底折扣"},{"categoryType":0,"showIndex":5,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4da3ff593625177ec09a23228b338290.png","name":"秋日出游","id":109255007,"frontDesc":"秋高气爽 放心出行","type":0,"subCateList":[],"frontName":"秋高气爽 放心出行"},{"categoryType":0,"showIndex":6,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/5be2729ef9a10df2e201b3084b551ae8.png","name":"五折封顶","id":109255008,"frontDesc":"夏日抄底特惠专区","type":0,"subCateList":[],"frontName":"夏日抄底特惠专区"},{"categoryType":0,"showIndex":7,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f3d5a10fbd65c58e0bb54d6e569597f2.png","name":"新手妈妈指南","id":109255009,"frontDesc":"新妈妈装备 一站购全","type":0,"subCateList":[],"frontName":"新妈妈装备 一站购全"},{"categoryType":0,"showIndex":8,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0e94a5a01e13752b6c5d75e13e3b1283.png","name":"卫衣/毛衫","id":1091003,"frontDesc":"舒适穿搭 精彩童年","type":0,"subCateList":[],"frontName":"舒适穿搭 精彩童年"},{"categoryType":0,"showIndex":9,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/24244fafbbde8f6e6215647a03ebbc7c.png","name":"T恤/polo/衬衫","id":1020003,"frontDesc":"必备上衣 百搭精选","type":0,"subCateList":[],"frontName":"必备上衣 百搭精选"},{"categoryType":0,"showIndex":10,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/60a70b35a24ad07449c763a6f2d16434.png","name":"外套/套装","id":109243018,"frontDesc":"甄选衣橱 陪伴左右","type":0,"subCateList":[],"frontName":"甄选衣橱 陪伴左右"},{"categoryType":0,"showIndex":11,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8ae80697a24aefe4069f1066ebe142fc.png","name":"裤子/裙装","id":109243019,"frontDesc":"实用下装 方便活动","type":0,"subCateList":[],"frontName":"实用下装 方便活动"},{"categoryType":0,"showIndex":12,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cfbe20d66ea16903d786d5a19976d5d0.png","name":"裙装","id":109243020,"frontDesc":"气质裙装 优雅大方","type":0,"subCateList":[],"frontName":"气质裙装 优雅大方"},{"categoryType":0,"showIndex":13,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6df0eecd6458ca390b1cfefeb910f33b.png","name":"连体衣/礼盒","id":109243021,"frontDesc":"A类无荧光 给宝宝更好的","type":0,"subCateList":[],"frontName":"A类无荧光 给宝宝更好的"},{"categoryType":0,"showIndex":14,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/772eb195bae088cb2c3bef9987ae75b9.png","name":"内衣/配搭","id":1089001,"frontDesc":"孩子衣橱里的配搭好物","type":0,"subCateList":[],"frontName":"孩子衣橱里的配搭好物"},{"categoryType":0,"showIndex":15,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/514726ef6c2ec1d0bd377a903666e9da.png","name":"儿童鞋","id":1037006,"frontDesc":"活力鞋品 孩子必备","type":0,"subCateList":[],"frontName":"活力鞋品 孩子必备"},{"categoryType":0,"showIndex":16,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cee62d001b384e8f16ba290d37c04e10.png","name":"学步鞋","id":109243022,"frontDesc":"宝宝学步 专业科学","type":0,"subCateList":[],"frontName":"宝宝学步 专业科学"},{"categoryType":0,"showIndex":17,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a1a521de2a5708b3c3f4a93471346f58.png","name":"尿裤纸品","id":109255004,"frontDesc":"呵护宝宝的每寸肌肤","type":0,"subCateList":[],"frontName":"呵护宝宝的每寸肌肤"},{"categoryType":0,"showIndex":18,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b0ae93ae9133420fb688c193462eeabc.png","name":"洗护","id":1020004,"frontDesc":"天然专业 呵护宝宝肌","type":0,"subCateList":[],"frontName":"天然专业 呵护宝宝肌"},{"categoryType":0,"showIndex":19,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/eb8c8e70f88d8cb4866a811a34badb51.png","name":"喂养","id":1020007,"frontDesc":"宝宝吃得香 妈妈才放心","type":0,"subCateList":[],"frontName":"宝宝吃得香 妈妈才放心"},{"categoryType":0,"showIndex":20,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4843c411dec12e6873dc8d6ff0b4b3b1.png","name":"儿童家具收纳","id":109206012,"frontDesc":"有你才有家 成长快乐窝","type":0,"subCateList":[],"frontName":"有你才有家 成长快乐窝"},{"categoryType":0,"showIndex":21,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cea5a4dcff63ff83c1f34ca576ccb8d9.png","name":"婴童被枕芯类","id":1020005,"frontDesc":"甄选贴肤材质 宝宝舒眠甜梦","type":0,"subCateList":[],"frontName":"甄选贴肤材质 宝宝舒眠甜梦"},{"categoryType":0,"showIndex":22,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c230d5a5edf629bd921ee37dabb5cb03.png","name":"婴童床品套件","id":109245001,"frontDesc":"甄选天然面料 亲肤透气","type":0,"subCateList":[],"frontName":"甄选天然面料 亲肤透气"},{"categoryType":0,"showIndex":23,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/126545cd9cd34dc4e63b815e83ec4a06.png","name":"抱被睡袋","id":109245002,"frontDesc":"贴心设计 好眠助成长","type":0,"subCateList":[],"frontName":"贴心设计 好眠助成长"},{"categoryType":0,"showIndex":24,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9556bfa01dde5eb46cf56a0bbc3c6461.png","name":"推车/安全座椅","id":109243027,"frontDesc":"安全严苛标准 溜娃神器","type":0,"subCateList":[],"frontName":"安全严苛标准 溜娃神器"},{"categoryType":0,"showIndex":25,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/064b9f83a29735b3c6517f6c6be35d47.png","name":"童包/雨具","id":109206013,"frontDesc":"出行必备包包雨具","type":0,"subCateList":[],"frontName":"出行必备包包雨具"},{"categoryType":0,"showIndex":26,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e5ae3db7c2819731768ac50b2ff04d64.png","name":"玩具","id":1020006,"frontDesc":"益智趣味 在玩乐中学习","type":0,"subCateList":[],"frontName":"益智趣味 在玩乐中学习"},{"categoryType":0,"showIndex":27,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/76a23e423710c88ac1070aed906580b2.png","name":"文具","id":1089000,"frontDesc":"本册纸笔 翻译利器","type":0,"subCateList":[],"frontName":"本册纸笔 翻译利器"},{"categoryType":0,"showIndex":28,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/628b0985bf900d543c3aad06d1f40c46.png","name":"图书","id":109243023,"frontDesc":"开拓视野 亲子共读","type":0,"subCateList":[],"frontName":"开拓视野 亲子共读"},{"showIndex":29,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2d96684c2b2dc89df9a001235abd0a6d.png","bannerUrl":"","frontDesc":"妈咪贴身衣物 承诺无荧光剂","type":0,"frontName":"妈咪贴身衣物 承诺无荧光剂","categoryType":0,"superCategoryId":1011000,"name":"孕妈服饰","iconUrl":"","id":1011001,"subCateList":[]},{"categoryType":0,"showIndex":30,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8ab1afb09ce988aef93263280e2c2097.png","name":"妈咪用品","id":109206015,"frontDesc":"新手妈妈 必备用品","type":0,"subCateList":[],"frontName":"新手妈妈 必备用品"},{"categoryType":0,"showIndex":31,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9b7bb9df09836b1cb7e46f9fefb1b2c0.png","name":"孕妈装","id":109206014,"frontDesc":"时尚大方 安全无荧光剂","type":0,"subCateList":[],"frontName":"时尚大方 安全无荧光剂"},{"categoryType":0,"showIndex":32,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b51b268801f04b6f9210967a0136e0bb.png","name":"安全座椅","id":109243026,"frontDesc":"比安全更周全 专业安全","type":0,"subCateList":[],"frontName":"比安全更周全 专业安全"},{"categoryType":0,"showIndex":33,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7a347426bb41f4e5221001855dcbc65c.png","name":"毛巾口水巾","id":109206011,"frontDesc":"婴童高标准毛巾","type":0,"subCateList":[],"frontName":"婴童高标准毛巾"},{"categoryType":0,"showIndex":34,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c6557651e50d82d7d9f8184f8a0e955b.png","name":"儿童雨具/泳具","id":109255005,"frontDesc":"趣味玩水 放肆一夏","type":0,"subCateList":[],"frontName":"趣味玩水 放肆一夏"},{"categoryType":0,"showIndex":35,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1f93797e2f77cb0e0ac3c153183d2697.png","name":"防走丢包","id":109243024,"frontDesc":"防护牵引 安全出行","type":0,"subCateList":[],"frontName":"防护牵引 安全出行"},{"categoryType":0,"showIndex":36,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/34f22f5e50082da73d91e07794a9afea.png","name":"其它箱包","id":109243025,"frontDesc":"休闲实用 出游必备","type":0,"subCateList":[],"frontName":"休闲实用 出游必备"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/7325584e6fcaf7a6af0fa469b605ac0e.jpg?quality=75&type=webp&imageView&thumbnail=0x196","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"运动旅行","id":109243029,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ba81ce10c1e0fab23d010736d65ba0a7.jpg","name":"Yessing","id":109256006,"frontDesc":"穿出你的个性态度","type":0,"subCateList":[],"frontName":"穿出你的个性态度"},{"categoryType":0,"showIndex":1,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/87e3129e372b7ebf73767f10be8a15a2.png","name":"男式运动","id":1020010,"frontDesc":"细节讲究 合身剪裁不束缚","type":0,"subCateList":[],"frontName":"细节讲究 合身剪裁不束缚"},{"categoryType":0,"showIndex":3,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/18d5a7a3ed8b3731d4e37394a37a6dd3.png","name":"健身系列","id":109254039,"frontDesc":"静体静心 养生健体","type":0,"subCateList":[],"frontName":"静体静心 养生健体"},{"categoryType":0,"showIndex":4,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2e8953d954d410a2ae2c9321651b85f1.png","name":"出行好物","id":109254040,"frontDesc":"出行好物 贴心相伴","type":0,"subCateList":[],"frontName":"出行好物 贴心相伴"},{"categoryType":0,"showIndex":5,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c2871979efcc7ed2d40bc569c7fe70a2.png","name":"男式运动外套/卫衣","id":109254042,"frontDesc":"运动工作自由切换","type":0,"subCateList":[],"frontName":"运动工作自由切换"},{"categoryType":0,"showIndex":6,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/23cbe4d7d1e3e23d4cc097a67f57b6f9.png","name":"男式运动裤装","id":109254043,"frontDesc":"运动中 让双腿更自如","type":0,"subCateList":[],"frontName":"运动中 让双腿更自如"},{"categoryType":0,"showIndex":7,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/26f8b210ff0dba32cee3e2f374c47e9b.png","name":"男式户外服装","id":109254044,"frontDesc":"防风防水 户外防晒","type":0,"subCateList":[],"frontName":"防风防水 户外防晒"},{"categoryType":0,"showIndex":8,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0ccd33322fda8fc8ad7ccc61b1207afa.png","name":"男式运动T恤","id":109254041,"frontDesc":"经典款式 运动通勤皆可","type":0,"subCateList":[],"frontName":"经典款式 运动通勤皆可"},{"categoryType":0,"showIndex":11,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dae55f67c05dd3a544c68aaf91e2d2bd.png","name":"女式运动外套/卫衣","id":109254047,"frontDesc":"运动工作自由切换","type":0,"subCateList":[],"frontName":"运动工作自由切换"},{"categoryType":0,"showIndex":12,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3715a4db6b8449843105cd819c1b4fb3.png","name":"女式运动裤装","id":109254048,"frontDesc":"运动中 让双腿更自如","type":0,"subCateList":[],"frontName":"运动中 让双腿更自如"},{"categoryType":0,"showIndex":13,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a49e9afcf7d91826cbaa86c04c94e94d.png","name":"女式户外服装","id":109254049,"frontDesc":"防风防水 户外防晒","type":0,"subCateList":[],"frontName":"防风防水 户外防晒"},{"categoryType":0,"showIndex":14,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/639008fcca7a3a4ecc9ce5cf9e28506e.png","name":"女式运动T恤","id":109254045,"frontDesc":"经典款式 运动通勤皆可","type":0,"subCateList":[],"frontName":"经典款式 运动通勤皆可"},{"categoryType":0,"showIndex":14,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/20c2a3b3b7b1795954c58d8088e6d05e.png","name":"女式运动","id":1035002,"frontDesc":"高质感面料","type":0,"subCateList":[],"frontName":"高质感面料"},{"categoryType":0,"showIndex":15,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f2ccaf4abc6ecf8dca27b50602a61f6a.png","name":"女式运动内衣/泳装","id":109254046,"frontDesc":"运动承托 保护胸部","type":0,"subCateList":[],"frontName":"运动承托 保护胸部"},{"categoryType":0,"showIndex":15,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a1a82637fc8e1ab9eafdd7ae3eec4d4f.png","name":"男式运动下装","id":1015001,"frontDesc":"立体裁剪，专为国人打造","type":0,"subCateList":[],"frontName":"自在而潇洒的穿着感"},{"categoryType":0,"showIndex":16,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4088b6af21f8174909d62084848ef198.png","name":"女式运动下装","id":109214005,"frontDesc":"女士修身运动","type":0,"subCateList":[],"frontName":"女士修身运动"},{"categoryType":0,"showIndex":17,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4415c184ae39afbd59b5e34eed42ed4f.png","name":"男式户外","id":1078000,"frontDesc":"专业休闲运动风","type":0,"subCateList":[],"frontName":"运动休闲多场景任意切换"},{"categoryType":0,"showIndex":18,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9f820db8517536cd0fe2632955198722.png","bannerUrl":"","name":"女式户外","id":1010001,"frontDesc":"户外运动休闲运动","type":0,"subCateList":[],"frontName":"户外运动休闲运动"},{"categoryType":0,"showIndex":19,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/bc18133d4c92124c95c801f5c2582cd2.png","name":"男式运动鞋","id":109249011,"frontDesc":"热血潮流 畅快奔跑","type":0,"subCateList":[],"frontName":"热血潮流 畅快奔跑"},{"categoryType":0,"showIndex":20,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e2bf3f81c3d0916d2f7a14b6d44dcd56.png","name":"女式运动鞋","id":109249012,"frontDesc":"青春运动 轻便舒适","type":0,"subCateList":[],"frontName":"青春运动 轻便舒适"},{"categoryType":0,"showIndex":21,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/63e23cd56352d2cb3c835560e643bf9a.png","name":"旅行用品","id":1020000,"frontDesc":"便携设计 轻便旅途","type":0,"subCateList":[],"frontName":"出行小物 贴心相伴"},{"categoryType":0,"showIndex":22,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3c37a0b380fdcca237d64552db99cce0.png","name":"行李箱","id":109243030,"frontDesc":"带着梦想即刻出发","type":0,"subCateList":[],"frontName":"带着梦想即刻出发"},{"categoryType":0,"showIndex":23,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cc5ff5a9d325a70b0693795644803d5d.png","name":"颈枕眼罩","id":109261036,"frontDesc":"多功能使用 舒适旅途","type":0,"subCateList":[],"frontName":"多功能使用 舒适旅途"},{"categoryType":0,"showIndex":24,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a97b4100cf9e753d1c51d8f38bdc3a38.png","name":"雨具","id":109261037,"frontDesc":"晴雨两用 随身出行","type":0,"subCateList":[],"frontName":"晴雨两用 随身出行"},{"categoryType":0,"showIndex":25,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b5950f5984ede4241d12ca14620c321a.png","name":"旅行收纳","id":109254051,"frontDesc":"整理你的旅行箱","type":0,"subCateList":[],"frontName":"整理你的旅行箱"},{"categoryType":0,"showIndex":26,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/01ceeee87efb0f66ee19d5b4a2c156e4.png","name":"出行用品","id":109254050,"frontDesc":"让旅途更轻松","type":0,"subCateList":[],"frontName":"让旅途更轻松"},{"categoryType":0,"showIndex":27,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c5550b962058846f3e7e45b137d1ca5f.png","name":"露营野餐","id":109243031,"frontDesc":"趣味露营 享受户外","type":0,"subCateList":[],"frontName":"趣味露营 享受户外"},{"categoryType":0,"showIndex":28,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f821a3c1d8894e89a72d396a19890810.png","name":"徒步登山","id":109261038,"frontDesc":"户外行走 探索无限","type":0,"subCateList":[],"frontName":"户外行走 探索无限"},{"categoryType":0,"showIndex":29,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b91545cb45289cc89e0bcc1a006621b9.png","name":"健身器械","id":109254052,"frontDesc":"打造自己的健身房","type":0,"subCateList":[],"frontName":"打造自己的健身房"},{"categoryType":0,"showIndex":30,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/84464237e022135f1e5e5e1c1c4f9f84.png","name":"按摩护具","id":109243033,"frontDesc":"运动防护 无惧伤害","type":0,"subCateList":[],"frontName":"运动防护 无惧伤害"},{"categoryType":0,"showIndex":31,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0ffac069b042edf1bf24090face6a4bb.png","name":"瑜伽美体","id":109261040,"frontDesc":"静体静心 养生健体","type":0,"subCateList":[],"frontName":"静体静心 养生健体"},{"categoryType":0,"showIndex":32,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2c2f4c3457c2c3c94567cd97157f43c2.png","name":"运动配件","id":109243032,"frontDesc":"运动伴侣 助力训练","type":0,"subCateList":[],"frontName":"运动伴侣 助力训练"},{"categoryType":0,"showIndex":32,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f2bec10d8188a4980f0d5bab26ffa201.png","name":"游泳装备","id":109261041,"frontDesc":"自由泳者","type":0,"subCateList":[],"frontName":"自由泳者"},{"categoryType":0,"showIndex":32,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/12aef6f81b524bd1e9d5aa051266ca65.png","name":"球类运动","id":109261042,"frontDesc":"运动随心","type":0,"subCateList":[],"frontName":"运动随心"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/6ea5a277746a4e9849040bf2c619d6e9.jpg?quality=75&type=webp&imageView&thumbnail=0x196","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"数码家电","id":1043000,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/00bc575e28c69cd85e59ec39adcb5de6.png","name":"当季热销","id":109255020,"frontDesc":"消毒抑菌/除湿烘干/清洁除螨","type":0,"subCateList":[],"frontName":"消毒抑菌/除湿烘干/清洁除螨"},{"categoryType":0,"showIndex":2,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d2ac4fa7cf365849707e378f15e7d6e3.png","name":"新品首发","id":109255021,"frontDesc":"率先掌握上新资讯","type":0,"subCateList":[],"frontName":"率先掌握上新资讯"},{"categoryType":0,"showIndex":3,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1ca73b12b6338a54421add710d406364.png","name":"甄选爆款","id":109255019,"frontDesc":"严选用户高好评爆款","type":0,"subCateList":[],"frontName":"严选用户高好评爆款"},{"categoryType":0,"showIndex":4,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/61d16210f6dfff72668ff425b79c7190.png","name":"身体护理","id":109249010,"frontDesc":"爱护身体，方寸间蕴出肌肤之美","type":0,"subCateList":[],"frontName":"爱护身体，方寸间蕴出肌肤之美"},{"categoryType":0,"showIndex":5,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e6c44e8dd451090b324fe127e3e8616d.png","name":"口腔护理","id":109249005,"frontDesc":"清新口气，健康牙齿","type":0,"subCateList":[],"frontName":"清新口气，健康牙齿"},{"categoryType":0,"showIndex":6,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2de6707340d511031a3fcb3d98ae770d.png","name":"面部护理","id":109249006,"frontDesc":"美容护肤，让你闪耀脱颖而出","type":0,"subCateList":[],"frontName":"美容护肤，让你闪耀脱颖而出"},{"categoryType":0,"showIndex":7,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/117270efbbb5f5520dbc609dda5d5b44.png","name":"头发护理","id":109249007,"frontDesc":"头发亮泽光彩，随心造型","type":0,"subCateList":[],"frontName":"头发亮泽光彩，随心造型"},{"categoryType":0,"showIndex":8,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8bdd8292aae3861f52b5739174764d99.png","name":"两季电器","id":109249000,"frontDesc":"冬天温暖舒适，夏天清凉舒爽","type":0,"subCateList":[],"frontName":"冬天温暖舒适，夏天清凉舒爽"},{"categoryType":0,"showIndex":9,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c650bffea04dd2749d04d9f63edae464.png","name":"清洁电器","id":109249002,"frontDesc":"清洁好助手，每天都像住新家","type":0,"subCateList":[],"frontName":"清洁好助手，每天都像住新家"},{"categoryType":0,"showIndex":10,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b0e72093d1d047bbd0de7b3160b1506c.png","name":"衣物护理","id":109249001,"frontDesc":"焕然一新，陶醉在衣物的平顺里","type":0,"subCateList":[],"frontName":"焕然一新，陶醉在衣物的平顺里"},{"categoryType":0,"showIndex":11,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0427066bea93d5639f1ba79672ab846b.png","name":"空气调节","id":109249003,"frontDesc":"除湿/加湿/净化，空气焕然一新","type":0,"subCateList":[],"frontName":"除湿/加湿/净化，空气焕然一新"},{"categoryType":0,"showIndex":12,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/591fe5284130069a3e408517443a78dd.png","name":"厨房电器","id":1023000,"frontDesc":"囿于厨房与爱，准备丰富大餐","type":0,"subCateList":[],"frontName":"囿于厨房与爱，准备丰富大餐"},{"categoryType":0,"showIndex":13,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0a563ba0f5e2c9e75031f5f160aee9ae.png","name":"按摩器","id":109249009,"frontDesc":"你的专属按摩大师","type":0,"subCateList":[],"frontName":"你的专属按摩大师"},{"categoryType":0,"showIndex":14,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e05ec7535fb083138a4afb683c63b45b.png","name":"按摩椅","id":109249004,"frontDesc":"仿真人手按摩，享受全方位放松","type":0,"subCateList":[],"frontName":"仿真人手按摩，享受全方位放松"},{"categoryType":0,"showIndex":15,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/32481c037b206627d500daf078087ad7.png","name":"智能家居","id":109249008,"frontDesc":"智能升级家居，提升生活幸福感","type":0,"subCateList":[],"frontName":"智能升级家居，提升生活幸福感"},{"categoryType":0,"showIndex":16,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/590c1c397c52cee5cc0d13c5ccd3dc34.png","name":"智能出行","id":109255018,"frontDesc":"出行黑科技，陪你探索有趣的世界","type":0,"subCateList":[],"frontName":"出行黑科技，陪你探索有趣的世界"},{"categoryType":0,"showIndex":17,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/47e953a95e4378907b131205ce3cbc45.png","name":"3C数码","id":1022000,"frontDesc":"专为职场精英和学生设计","type":0,"subCateList":[],"frontName":"专为职场精英和学生设计"},{"categoryType":0,"showIndex":18,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/620d2c977da93f5130eb5aed639850a0.png","name":"手机配件","id":109243035,"frontDesc":"高颜值配件，武装随身装备","type":0,"subCateList":[],"frontName":"高颜值配件，武装随身装备"},{"categoryType":0,"showIndex":19,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/09c8b36ba252b486eec081479606baa7.png","name":"车载用品","id":109243036,"frontDesc":"车载神器陪你跨过山和大海","type":0,"subCateList":[],"frontName":"车载神器陪你跨过山和大海"},{"showIndex":20,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9d635abb986bd40f217dba2ac67df7f2.png","bannerUrl":"https://yanxuan.nosdn.127.net/ea626506991f03f638dc32b72212e8a3.png","frontDesc":"找回书写的力量","type":0,"frontName":"找回书写的力量","categoryType":0,"superCategoryId":1043000,"name":"办公文具","iconUrl":"https://yanxuan.nosdn.127.net/8ccf1a360077d2a8e37d33cd6427801c.png","id":109243046,"subCateList":[]},{"showIndex":21,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a2170cc17ed18303f4f18949fea341b9.png","bannerUrl":"","frontDesc":"视听盛宴","type":0,"frontName":"视听盛宴","categoryType":0,"superCategoryId":1043000,"name":"影音娱乐","iconUrl":"","id":1008006,"subCateList":[]},{"categoryType":0,"showIndex":22,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/77847b8066205331eb22c9c363e3740e.png","bannerUrl":"","name":"乐器","id":1028001,"frontDesc":"造乐，开启一段别具一格的音乐历程","type":0,"subCateList":[],"frontName":"造乐，开启一段别具一格的音乐历程"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/a29e68a6f85dc934412b478edc907ee8.jpg?quality=75&type=webp&imageView&thumbnail=0x196","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"全球特色","id":1019000,"type":0,"subCateList":[{"showIndex":1,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/70ae2b665302d78224b2e209d32f6454.jpg","bannerUrl":"https://yanxuan.nosdn.127.net/3437871ce35a1bb291d461f15a7e2beb.jpg","frontDesc":"健康身体 全球守护","type":0,"frontName":"健康身体 全球守护","categoryType":0,"superCategoryId":1019000,"name":"全球防护","iconUrl":"https://yanxuan.nosdn.127.net/85f8d354cf9c41cf1855685ae2cb9a22.jpg","id":109268001,"subCateList":[]},{"categoryType":0,"showIndex":2,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9b809562dfee86bab55e49638fc0bd92.png","name":"当季星品","id":109254027,"frontDesc":"秋冬暖心 全球好物","type":0,"subCateList":[],"frontName":"秋冬暖心 全球好物"},{"categoryType":0,"showIndex":3,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d49727b5068e5d07ef12121131ba57f1.png","name":"好评推荐","id":109245000,"frontDesc":"口碑爆款 无限回购","type":0,"subCateList":[],"frontName":"口碑爆款 无限回购"},{"categoryType":0,"showIndex":4,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e98025a8dc0578fce04a78f19b29b5f7.png","name":"礼品点卡","id":1025000,"frontDesc":"严选礼品卡/话费充值/游戏点卡","type":0,"subCateList":[],"frontName":"严选礼品卡/话费充值/游戏点卡"},{"showIndex":5,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3294b591e402e50a859499bf343190cc.png","bannerUrl":"https://yanxuan.nosdn.127.net/e25f623df42af8929ffbc6a8abd2134c.png","frontDesc":"地方特色，匠心独运","type":0,"frontName":"地方特色，匠心独运","categoryType":0,"superCategoryId":1019000,"name":"特色手工艺","iconUrl":"https://yanxuan.nosdn.127.net/c06bf9ac1b93ddaa98091661993b72a9.png","id":109270000,"subCateList":[]},{"categoryType":0,"showIndex":6,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ef0e7cea476170bf5ea27e5fbfaaf063.png","name":"床品家纺","id":109256014,"frontDesc":"产地原料 家居推荐","type":0,"subCateList":[],"frontName":"产地原料 家居推荐"},{"categoryType":0,"showIndex":7,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/efc1a0fa662f5e199c578d24b8b39281.png","name":"餐厨用品","id":109256015,"frontDesc":"匠心名品 艺术烹饪","type":0,"subCateList":[],"frontName":"匠心名品 艺术烹饪"},{"categoryType":0,"showIndex":8,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6cc34e3f44e2da140a2aca023d2dc61b.png","name":"日用百货","id":109256016,"frontDesc":"品质生活 悦享升级","type":0,"subCateList":[],"frontName":"品质生活 悦享升级"},{"categoryType":0,"showIndex":9,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a131ac5e43cba3d03481221d9e258531.png","name":"美妆个护","id":109256017,"frontDesc":"口碑精选 焕醒美肌","type":0,"subCateList":[],"frontName":"口碑精选 焕醒美肌"},{"categoryType":0,"showIndex":10,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/492c8129ea3933ba389b8cc5a2be78b9.png","name":"口腔护理","id":109256018,"frontDesc":"健康口腔 璀璨笑容","type":0,"subCateList":[],"frontName":"健康口腔 璀璨笑容"},{"categoryType":0,"showIndex":11,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/079e00fe5f2100c8e2e80d8f28677656.png","name":"家清卫浴","id":109256019,"frontDesc":"专业高效清洁","type":0,"subCateList":[],"frontName":"专业高效清洁"},{"categoryType":0,"showIndex":12,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4a00b88682ab9646c1a598914dfb6800.png","name":"休闲美食","id":109256021,"frontDesc":"足不出户 食遍全球","type":0,"subCateList":[],"frontName":"足不出户 食遍全球"},{"categoryType":0,"showIndex":13,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3f482ed16162d2e14090802ca3aa8997.png","name":"营养保健","id":109256020,"frontDesc":"营养健康 保健佳品","type":0,"subCateList":[],"frontName":"营养健康 保健佳品"},{"categoryType":0,"showIndex":14,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/46d8b6bda0dfd1bb0a6d8ea15b5e51fc.png","name":"高级珠宝","id":109256022,"frontDesc":"璀璨闪耀 品质甄选","type":0,"subCateList":[],"frontName":"璀璨闪耀 品质甄选"},{"categoryType":0,"showIndex":15,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1e24297816459c8a3b2d2fb568180695.png","name":"时尚配搭","id":109256023,"frontDesc":"潮流设计 彰显品味","type":0,"subCateList":[],"frontName":"潮流设计 彰显品味"},{"categoryType":0,"showIndex":16,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c39ff69de9baf07222994196d007c335.png","name":"日韩馆","id":1065001,"frontDesc":"日韩制造生活好物","type":0,"subCateList":[],"frontName":"日韩制造生活好物"},{"categoryType":0,"showIndex":17,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/abc716169323f1b7ec9b11f243a1c742.png","name":"东南亚馆","id":1065005,"frontDesc":"东南亚特色好物","type":0,"subCateList":[],"frontName":"东南亚特色好物"},{"categoryType":0,"showIndex":18,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b8e0d041ccff6967364311588f3ef2e1.png","name":"欧美馆","id":1065004,"frontDesc":"欧美制造好物","type":0,"subCateList":[],"frontName":"欧美制造好物"},{"categoryType":0,"showIndex":19,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/06ce9b7401d93bca1869d68adb6e7a61.png","name":"澳新馆","id":1065002,"frontDesc":"澳大利亚、新西兰制造天然好物","type":0,"subCateList":[],"frontName":"澳大利亚、新西兰制造天然好物"},{"showIndex":20,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/750465c2faa5391c217601550563babc.png","bannerUrl":"https://yanxuan.nosdn.127.net/b79c71f0a896c8b650e95500644ef1e9.png","frontDesc":"8地特色，助力扶贫","type":0,"frontName":"8地特色，助力扶贫","categoryType":0,"superCategoryId":1019000,"name":"乡间好物","iconUrl":"https://yanxuan.nosdn.127.net/6f1d81d5cb39310cab92ef97891460e0.png","id":109270001,"subCateList":[]},{"categoryType":0,"showIndex":21,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/11f3825726d6ba6cf683ab529a351902.png","name":"春风馆","id":1065007,"frontDesc":"网易原创情趣品牌，专为亚洲年轻人设计","type":0,"subCateList":[],"frontName":"网易原创情趣品牌，专为亚洲年轻人设计"},{"categoryType":0,"showIndex":22,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3835a4198a9955b6047a44998b92dc6c.png","name":"味央馆","id":1065008,"frontDesc":"网易味央精品黑猪肉","type":0,"subCateList":[],"frontName":"网易味央精品黑猪肉"},{"categoryType":0,"showIndex":23,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0fc461daa1fe3a479a2d745141ebe45b.png","name":"Yessing馆","id":109202001,"frontDesc":"Yessing品牌馆，衣生元气","type":0,"subCateList":[],"frontName":"Yessing品牌馆，衣生元气"},{"categoryType":0,"showIndex":24,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0203a26ab1b38a3a0841eb97d93fa4b5.png","name":"国风馆","id":1038001,"frontDesc":"发现东方美学","type":0,"subCateList":[],"frontName":"发现东方美学"},{"categoryType":0,"showIndex":25,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/915a6f1e93a0f422021325c48863b331.png","name":"东方草木馆","id":1047000,"frontDesc":"大师甄选天下好茶","type":0,"subCateList":[],"frontName":"大师甄选天下好茶"},{"categoryType":0,"showIndex":26,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ef13f4b0eb17ed2c5da7fe816900f7ec.png","name":"礼盒","id":109243037,"frontDesc":"馈赠佳品","type":0,"subCateList":[],"frontName":"馈赠佳品"},{"categoryType":0,"showIndex":27,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/75d351532c2e5cf03cc1c6b37caa6216.png","name":"话费点卡","id":1050000,"frontDesc":"给信仰充值","type":0,"subCateList":[],"frontName":"给信仰充值"},{"categoryType":0,"showIndex":28,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9e8462ef0d9d8a132fe9d5429c0706a7.png","name":"黑胶/CD","id":109257024,"frontDesc":"乐享人生","type":0,"subCateList":[],"frontName":"乐享人生"},{"categoryType":0,"showIndex":29,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/26ee378c85e9bfc7f8c31dffac0117d2.png","name":"童书/育儿","id":109244000,"frontDesc":"为孩子严选好书","type":0,"subCateList":[],"frontName":"为孩子严选好书"},{"categoryType":0,"showIndex":30,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d11985fe7852e9fe4fcfc281e2ee9e96.png","name":"文学/小说","id":109244001,"frontDesc":"君子不器","type":0,"subCateList":[],"frontName":"君子不器"},{"categoryType":0,"showIndex":31,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/40b88a59cc3d9769f054e2ce8f381e14.png","name":"生活/娱乐","id":109251000,"frontDesc":"把日子过成诗","type":0,"subCateList":[],"frontName":"把日子过成诗"},{"categoryType":0,"showIndex":32,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/30c9826ef1eb4a088270dcc59b2960b0.png","name":"人文/社科","id":109248000,"frontDesc":"遇见思想的火花","type":0,"subCateList":[],"frontName":"遇见思想的火花"},{"categoryType":0,"showIndex":33,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4ec4e12201baabc563a4a39ee856147b.png","name":"技能/成长","id":109252000,"frontDesc":"日益精进","type":0,"subCateList":[],"frontName":"日益精进"},{"categoryType":0,"showIndex":34,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/97ee8a9031cf562a746958347cc90787.png","name":"云音乐周边","id":1065009,"frontDesc":"网易云音乐周边发售","type":0,"subCateList":[],"frontName":"网易云音乐周边发售"},{"categoryType":0,"showIndex":35,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e70587ace9f936e45198514ff8074e8d.png","name":"暴雪周边","id":1066000,"frontDesc":"暴雪周边商品发售","type":0,"subCateList":[],"frontName":"暴雪周边商品发售"},{"categoryType":0,"showIndex":36,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/98f700a137c2f8e63e5e8b8261e2030e.png","name":"我的世界","id":1041001,"frontDesc":"我的世界游戏周边","type":0,"subCateList":[],"frontName":"我的世界游戏周边"},{"categoryType":0,"showIndex":37,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b011aba7843fe35523cd084f02de4d2f.png","name":"梦幻西游","id":1033000,"frontDesc":"梦幻西游精品周边","type":0,"subCateList":[],"frontName":"梦幻西游精品周边"},{"categoryType":0,"showIndex":38,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4615c4af82fb22d5e31cb41249982ea8.png","name":"大话西游","id":1036004,"frontDesc":"大话西游正版周边","type":0,"subCateList":[],"frontName":"大话西游正版周边"},{"categoryType":0,"showIndex":39,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/64196ac59c60923bb4023c8881376ef2.png","name":"阴阳师","id":1039000,"frontDesc":"快到寮里来","type":0,"subCateList":[],"frontName":"欧气，快到寮里来"},{"categoryType":0,"showIndex":40,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dc5ea3f67a9312a19d685d85aae68474.png","name":"游戏印象","id":1018000,"frontDesc":"网易多款经典游戏周边","type":0,"subCateList":[],"frontName":"网易多款经典游戏周边"},{"categoryType":0,"showIndex":41,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a09ba4fc348225a055a7a3c82e05e49b.png","name":"文创周边","id":1032001,"frontDesc":"大英博物馆等文创周边","type":0,"subCateList":[],"frontName":"大英博物馆等文创周边"},{"categoryType":0,"showIndex":42,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b47bd562bedb8631c27e639da1e92b43.png","name":"影视周边","id":1069000,"frontDesc":"漫威、DC等影视周边","type":0,"subCateList":[],"frontName":"漫威、DC等影视周边"},{"categoryType":0,"showIndex":43,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1785d77ba60a7b7f4d7641c702c3cf5f.png","name":"动漫电玩","id":1069001,"frontDesc":"初音、任天堂等动漫游戏周边","type":0,"subCateList":[],"frontName":"初音、任天堂等动漫游戏周边"},{"categoryType":0,"showIndex":44,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ca7287d399e71f7e10a722fcfcb725b6.png","name":"严选推荐馆","id":1065010,"frontDesc":"严选推荐精品好物","type":0,"subCateList":[],"frontName":"严选推荐精品好物"},{"categoryType":0,"showIndex":45,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e074795f61a83292d0f20eb7d124e2ac.png","bannerUrl":"","name":"文具","id":1012003,"frontDesc":"极简设计，环保材质","type":0,"subCateList":[],"frontName":"找回书写的力量"},{"categoryType":0,"showIndex":46,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a15c33fdefe11388b6f4ed5280919fdd.png","bannerUrl":"","name":"运动户外","id":1008005,"frontDesc":"踏青出游，便携不误好心情","type":0,"subCateList":[],"frontName":"MUJI、Nike等制造商出品"},{"categoryType":0,"showIndex":47,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a1e185658914642b71a7d51170108195.png","name":"韩国馆","id":1065003,"frontDesc":"韩国制造精巧好物","type":0,"subCateList":[],"frontName":"韩国制造精巧好物"}]}];

/***/ }),

/***/ 16:
/*!**********************************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/vue-loader/lib/runtime/componentNormalizer.js ***!
  \**********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
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
  shadowMode, /* vue-cli only */
  components, // fixed by xxxxxx auto components
  renderjs // fixed by xxxxxx renderjs
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // fixed by xxxxxx auto components
  if (components) {
    options.components = Object.assign(components, options.components || {})
  }
  // fixed by xxxxxx renderjs
  if (renderjs) {
    (renderjs.beforeCreate || (renderjs.beforeCreate = [])).unshift(function() {
      this[renderjs.__module] = this
    });
    (options.mixins || (options.mixins = [])).push(renderjs)
  }

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


/***/ }),

/***/ 17:
/*!*********************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/Json.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0; /* 用户 */
var userInfo = {
  status: 1,
  data: {
    id: 1,
    mobile: 18888888888,
    nickname: 'Leo yo',
    portrait: 'http://img.61ef.cn/news/201409/28/2014092805595807.jpg' },

  msg: '提示'

  /* 首页轮播图 */ };
var carouselList = [{
  src: "/static/temp/banner3.jpg",
  background: "rgb(203, 87, 60)" },

{
  src: "/static/temp/banner2.jpg",
  background: "rgb(205, 215, 218)" },

{
  src: "/static/temp/banner4.jpg",
  background: "rgb(183, 73, 69)" }];


/* 商品列表 */
var goodsList = [{
  image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg",
  image2: "http://pic.rmb.bdstatic.com/819a044daa66718c2c40a48c1ba971e6.jpeg",
  image3: "http://img001.hc360.cn/y5/M00/1B/45/wKhQUVYFE0uEZ7zVAAAAAMj3H1w418.jpg",
  title: "古黛妃 短袖t恤女夏装2019新款韩版宽松",
  price: 179,
  sales: 61 },

{
  image: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4031878334,2682695508&fm=11&gp=0.jpg",
  image2: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1554013048&di=a3dc9fd1406dd7bad7fbb97b5489ec04&imgtype=jpg&er=1&src=http%3A%2F%2Fimg009.hc360.cn%2Fhb%2FnKo44ac2656F831c684507E3Da0E3a26841.jpg",
  image3: "http://img.zcool.cn/community/017a4e58b4eab6a801219c77084373.jpg",
  title: "潘歌针织连衣裙",
  price: 78,
  sales: 16 },

{
  image: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg",
  image2: "http://m.360buyimg.com/n12/jfs/t247/42/1078640382/162559/3628a0b/53f5ad09N0dd79894.jpg%21q70.jpg",
  image3: "http://ikids.61kids.com.cn/upload/2018-12-29/1546070626796114.jpg",
  title: "巧谷2019春夏季新品新款女装",
  price: 108.8,
  sales: 5 },
{
  image: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=756705744,3505936868&fm=11&gp=0.jpg",
  image2: "http://images.jaadee.com/images/201702/goods_img/30150_d85aed83521.jpg",
  image3: "http://img13.360buyimg.com/popWaterMark/jfs/t865/120/206320620/138889/dcc94caa/550acedcN613e2a9d.jpg",
  title: "私萱连衣裙",
  price: 265,
  sales: 88 },
{
  image: "https://img13.360buyimg.com/n8/jfs/t1/30343/20/1029/481370/5c449438Ecb46a15b/2b2adccb6dc742fd.jpg",
  image2: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553418265666&di=d4a7f7eb0ae3c859edeb921641ee1c3a&imgtype=0&src=http%3A%2F%2Fimg003.hc360.cn%2Fy3%2FM02%2FF8%2F9F%2FwKhQh1TuSkGELIlQAAAAAPuLl4M987.jpg",
  image3: "http://img.ef43.com.cn/product/2016/8/05100204b0c.jpg",
  title: "娇诗茹 ulzzang原宿风学生潮韩版春夏短",
  price: 422,
  sales: 137 },
{
  image: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg",
  image2: "http://image5.suning.cn/uimg/b2c/newcatentries/0070158827-000000000622091973_2_800x800.jpg",
  image3: "http://img.61ef.cn/news/201903/20/2019032009251784.jpg",
  title: "古黛妃 短袖t恤女夏装2019新款韩版宽松",
  price: 179,
  sales: 95 }];



/* 购物车 */
var cartList = [{
  id: 1,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553005139&di=3368549edf9eee769a9bcb3fbbed2504&imgtype=jpg&er=1&src=http%3A%2F%2Fimg002.hc360.cn%2Fy3%2FM01%2F5F%2FDB%2FwKhQh1T7iceEGRdWAAAAADQvqk8733.jpg',
  attr_val: '春装款 L',
  stock: 15,
  title: 'OVBE 长袖风衣',
  price: 278.00,
  number: 1 },

{
  id: 3,
  image: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2319343996,1107396922&fm=26&gp=0.jpg',
  attr_val: '激光导航 扫拖一体',
  stock: 3,
  title: '科沃斯 Ecovacs 扫地机器人',
  price: 1348.00,
  number: 5 },

{
  id: 4,
  image: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2668268226,1765897385&fm=26&gp=0.jpg',
  attr_val: 'XL',
  stock: 55,
  title: '朵绒菲小西装',
  price: 175.88,
  number: 1 },

{
  id: 5,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552410549432&di=06dd3758053fb6d6362516f30a42d055&imgtype=0&src=http%3A%2F%2Fimgcache.mysodao.com%2Fimg3%2FM0A%2F67%2F42%2FCgAPD1vNSsHNm-TnAAEy61txQb4543_400x400x2.JPG',
  attr_val: '520 #粉红色',
  stock: 15,
  title: '迪奥（Dior）烈艳唇膏',
  price: 1089.00,
  number: 1 },

{
  id: 6,
  image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1031875829,2994442603&fm=26&gp=0.jpg',
  attr_val: '樱花味润手霜 30ml',
  stock: 15,
  title: "欧舒丹（L'OCCITANE）乳木果",
  price: 128,
  number: 1 },

{
  id: 7,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553007107&di=390915aa8a022cf0b03c03340881b0e7&imgtype=jpg&er=1&src=http%3A%2F%2Fimg13.360buyimg.com%2Fn0%2Fjfs%2Ft646%2F285%2F736444951%2F480473%2Faa701c97%2F548176feN10c9ed7b.jpg',
  attr_val: '特级 12个',
  stock: 7,
  title: '新疆阿克苏苹果 特级',
  price: 58.8,
  number: 10 },

{
  id: 8,
  image: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2319343996,1107396922&fm=26&gp=0.jpg',
  attr_val: '激光导航 扫拖一体',
  stock: 15,
  title: '科沃斯 Ecovacs 扫地机器人',
  price: 1348.00,
  number: 1 },

{
  id: 9,
  image: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2668268226,1765897385&fm=26&gp=0.jpg',
  attr_val: 'XL',
  stock: 55,
  title: '朵绒菲小西装',
  price: 175.88,
  number: 1 },

{
  id: 10,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552410549432&di=06dd3758053fb6d6362516f30a42d055&imgtype=0&src=http%3A%2F%2Fimgcache.mysodao.com%2Fimg3%2FM0A%2F67%2F42%2FCgAPD1vNSsHNm-TnAAEy61txQb4543_400x400x2.JPG',
  attr_val: '520 #粉红色',
  stock: 15,
  title: '迪奥（Dior）烈艳唇膏',
  price: 1089.00,
  number: 1 },

{
  id: 11,
  image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1031875829,2994442603&fm=26&gp=0.jpg',
  attr_val: '樱花味润手霜 30ml',
  stock: 15,
  title: "欧舒丹（L'OCCITANE）乳木果",
  price: 128,
  number: 1 },

{
  id: 12,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553007107&di=390915aa8a022cf0b03c03340881b0e7&imgtype=jpg&er=1&src=http%3A%2F%2Fimg13.360buyimg.com%2Fn0%2Fjfs%2Ft646%2F285%2F736444951%2F480473%2Faa701c97%2F548176feN10c9ed7b.jpg',
  attr_val: '特级 12个',
  stock: 7,
  title: '新疆阿克苏苹果 特级',
  price: 58.8,
  number: 10 },

{
  id: 13,
  image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552405266625&di=a703f2b2cdb0fe7f3f05f62dd91307ab&imgtype=0&src=http%3A%2F%2Fwww.78.cn%2Fzixun%2Fnews%2Fupload%2F20190214%2F1550114706486250.jpg',
  attr_val: '春装款/m',
  stock: 15,
  title: '女装2019春秋新款',
  price: 420.00,
  number: 1 }];


//详情展示页面
var detailData = {
  title: '纯种金毛幼犬活体有血统证书',
  title2: '拆家小能手 你值得拥有',
  favorite: true,
  imgList: [{
    src: 'http://img0.imgtn.bdimg.com/it/u=2396068252,4277062836&fm=26&gp=0.jpg' },

  {
    src: 'http://img.pconline.com.cn/images/upload/upc/tx/itbbs/1309/06/c4/25310541_1378426131583.jpg' },

  {
    src: 'http://img.pconline.com.cn/images/upload/upc/tx/photoblog/1610/26/c4/28926240_1477451226577_mthumb.jpg' },

  {
    src: 'http://picture.ik123.com/uploads/allimg/190219/12-1Z219105139.jpg' }],


  episodeList: [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],

  guessList: [{
    src: 'http://img.52z.com/upload/news/image/20180530/20180530081619_31029.jpg',
    title: '猫眼指甲油',
    title2: '独树一帜的免照灯猫眼指甲' },

  {
    src: 'http://m.china-7.net/uploads/14778449362891.jpg',
    title: '创意屋',
    title2: '创意屋形上下双层高低床' },

  {
    src: 'http://www.k73.com/up/allimg/130415/22-130415093527.jpg',
    title: 'MissCandy 指甲油',
    title2: '十分适合喜欢素净的妹纸，尽显淡雅的气质' },

  {
    src: 'http://img0.imgtn.bdimg.com/it/u=2108933440,2194129200&fm=214&gp=0.jpg	',
    title: 'RMK 2017星空海蓝唇釉',
    title2: '唇釉质地，上唇后很滋润。少女也会心动的蓝色，透明液体形状。' }],


  evaList: [{
    src: 'http://gss0.baidu.com/-fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/77c6a7efce1b9d1663174705fbdeb48f8d546486.jpg',
    nickname: 'Ranth Allngal',
    time: '09-20 12:54',
    zan: '54',
    content: '评论不要太苛刻，不管什么产品都会有瑕疵，客服也说了可以退货并且商家承担运费，我觉得至少态度就可以给五星。' },

  {
    src: 'http://img0.imgtn.bdimg.com/it/u=2396068252,4277062836&fm=26&gp=0.jpg',
    nickname: 'Ranth Allngal',
    time: '09-20 12:54',
    zan: '54',
    content: '楼上说的好有道理。' }] };



var shareList = [{
  type: 1,
  icon: '/static/temp/share_wechat.png',
  text: '微信好友' },

{
  type: 2,
  icon: '/static/temp/share_moment.png',
  text: '朋友圈' },

{
  type: 3,
  icon: '/static/temp/share_qq.png',
  text: 'QQ好友' },

{
  type: 4,
  icon: '/static/temp/share_qqzone.png',
  text: 'QQ空间' }];


var lazyLoadList = [{
  src: 'http://img0.imgtn.bdimg.com/it/u=2396068252,4277062836&fm=26&gp=0.jpg' },

{
  src: 'http://img.pconline.com.cn/images/upload/upc/tx/itbbs/1309/06/c4/25310541_1378426131583.jpg' },

{
  src: 'http://img.pconline.com.cn/images/upload/upc/tx/photoblog/1610/26/c4/28926240_1477451226577_mthumb.jpg' },

{
  src: 'http://picture.ik123.com/uploads/allimg/190219/12-1Z219105139.jpg' },

{
  src: 'http://img5.imgtn.bdimg.com/it/u=2904900134,438461613&fm=26&gp=0.jpg' },

{
  src: 'http://img1.imgtn.bdimg.com/it/u=1690475408,2565370337&fm=26&gp=0.jpg' },

{
  src: 'http://img.99114.com/group1/M00/7F/99/wKgGS1kVrPGAe5LmAAU2KrJmb3Q923_600_600.jpg' },

{
  src: 'http://img4.imgtn.bdimg.com/it/u=261047209,372231813&fm=26&gp=0.jpg' },

{
  src: 'http://i2.17173cdn.com/i7mz64/YWxqaGBf/tu17173com/20150107/eMyVMObjlbcvDEv.jpg' },

{
  src: 'http://img008.hc360.cn/m4/M02/E7/87/wKhQ6FSrfU6EfUoyAAAAAITAfyc280.jpg' },

{
  src: 'http://pic1.win4000.com/wallpaper/d/5991569950166.jpg' },

{
  src: 'http://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/6f061d950a7b0208f9fe945e60d9f2d3572cc85e.jpg' },

{
  src: 'http://pic41.nipic.com/20140429/18169759_125841756000_2.jpg' },

{
  src: 'http://www.k73.com/up/allimg/130415/22-130415093527.jpg' },

{
  src: 'http://img.52z.com/upload/news/image/20180530/20180530081619_31029.jpg' },

{
  src: 'http://b-ssl.duitang.com/uploads/item/201410/02/20141002111638_tXAzU.jpeg' },

{
  src: 'http://img2.ph.126.net/C4JW6f57QWSB21-8jh2UGQ==/1762596304262286698.jpg' },

{
  src: 'http://att.bbs.duowan.com/forum/201405/17/190257nzcvkkdg6w2e8226.jpg' },

{
  src: 'http://attach.bbs.miui.com/forum/201504/10/223644v3intigyvva0vgym.jpg' },

{
  src: 'http://pic1.win4000.com/mobile/3/57888a298d61d.jpg' }];



var orderList = [{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553187020783&di=bac9dd78b36fd984502d404d231011c0&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201609%2F26%2F20160926173213_s5adi.jpeg' },

  {
    image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4031878334,2682695508&fm=11&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4031878334,2682695508&fm=11&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4031878334,2682695508&fm=11&gp=0.jpg' },

  {
    image: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1620020012,789258862&fm=26&gp=0.jpg' }] },



{
  time: '2019-04-06 11:37',
  state: 9,
  goodsList: [{
    title: '古黛妃 短袖t恤女 春夏装2019新款韩版宽松',
    price: 179.5,
    image: 'https://img13.360buyimg.com/n8/jfs/t1/30343/20/1029/481370/5c449438Ecb46a15b/2b2adccb6dc742fd.jpg',
    number: 1,
    attr: '珊瑚粉 M' }] },


{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    image: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i2/2120460599/O1CN01LBPS4C1GINkwsOTXS_!!2120460599.jpg_430x430q90.jpg' },

  {
    image: 'https://img.alicdn.com/imgextra/i2/1069876356/TB2ocTQG4WYBuNjy1zkXXXGGpXa_!!1069876356.jpg_430x430q90.jpg' },

  {
    image: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i4/2120460599/O1CN01YsmgwZ1GINkv38rkn_!!2120460599.jpg_430x430q90.jpg' }] },



{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    title: '回力女鞋高帮帆布鞋女学生韩版鞋子女2019潮鞋女鞋新款春季板鞋女',
    price: 69,
    image: 'https://img.alicdn.com/imgextra/i3/2128794607/TB2gzzoc41YBuNjy1zcXXbNcXXa_!!2128794607.jpg_430x430q90.jpg',
    number: 1,
    attr: '白色-高帮 39' }] },


{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    image: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i4/3358098495/O1CN01dhYyid2Ccl5MWLDok_!!3358098495.jpg_430x430q90.jpg' },

  {
    image: 'https://img.alicdn.com/imgextra/https://img.alicdn.com/imgextra/i3/3358098495/O1CN01AWsnFA2Ccl5OzvqsL_!!3358098495.jpg_430x430q90.jpg' }] },



{
  time: '2019-04-06 11:37',
  state: 1,
  goodsList: [{
    image: 'https://img.alicdn.com/imgextra/i4/3470687433/O1CN0124mMQOSERr18L1h_!!3470687433.jpg_430x430q90.jpg' },

  {
    image: 'https://img.alicdn.com/imgextra/i3/2888462616/O1CN01ERra5J1VCAbZaKI5n_!!0-item_pic.jpg_430x430q90.jpg' },

  {
    image: 'https://gd3.alicdn.com/imgextra/i3/819381730/O1CN01YV4mXj1OeNhQIhQlh_!!819381730.jpg_400x400.jpg' }] }];





var cateList = [{
  id: 1,
  name: '手机数码' },

{
  id: 2,
  name: '礼品鲜花' },

{
  id: 3,
  name: '男装女装' },

{
  id: 4,
  name: '母婴用品' },

{
  id: 5,
  pid: 1,
  name: '手机通讯' },

{
  id: 6,
  pid: 1,
  name: '运营商' },

{
  id: 8,
  pid: 5,
  name: '全面屏手机',
  picture: '/static/temp/cate2.jpg' },

{
  id: 9,
  pid: 5,
  name: '游戏手机',
  picture: '/static/temp/cate3.jpg' },

{
  id: 10,
  pid: 5,
  name: '老人机',
  picture: '/static/temp/cate1.jpg' },

{
  id: 11,
  pid: 5,
  name: '拍照手机',
  picture: '/static/temp/cate4.jpg' },

{
  id: 12,
  pid: 5,
  name: '女性手机',
  picture: '/static/temp/cate5.jpg' },

{
  id: 14,
  pid: 6,
  name: '合约机',
  picture: '/static/temp/cate1.jpg' },

{
  id: 15,
  pid: 6,
  name: '选好卡',
  picture: '/static/temp/cate4.jpg' },

{
  id: 16,
  pid: 6,
  name: '办套餐',
  picture: '/static/temp/cate5.jpg' },

{
  id: 17,
  pid: 2,
  name: '礼品' },

{
  id: 18,
  pid: 2,
  name: '鲜花' },

{
  id: 19,
  pid: 17,
  name: '公益摆件',
  picture: '/static/temp/cate7.jpg' },

{
  id: 20,
  pid: 17,
  name: '创意礼品',
  picture: '/static/temp/cate8.jpg' },

{
  id: 21,
  pid: 18,
  name: '鲜花',
  picture: '/static/temp/cate9.jpg' },

{
  id: 22,
  pid: 18,
  name: '每周一花',
  picture: '/static/temp/cate10.jpg' },

{
  id: 23,
  pid: 18,
  name: '卡通花束',
  picture: '/static/temp/cate11.jpg' },

{
  id: 24,
  pid: 18,
  name: '永生花',
  picture: '/static/temp/cate12.jpg' },

{
  id: 25,
  pid: 3,
  name: '男装' },

{
  id: 26,
  pid: 3,
  name: '女装' },

{
  id: 27,
  pid: 25,
  name: '男士T恤',
  picture: '/static/temp/cate13.jpg' },

{
  id: 28,
  pid: 25,
  name: '男士外套',
  picture: '/static/temp/cate14.jpg' },

{
  id: 29,
  pid: 26,
  name: '裙装',
  picture: '/static/temp/cate15.jpg' },

{
  id: 30,
  pid: 26,
  name: 'T恤',
  picture: '/static/temp/cate16.jpg' },

{
  id: 31,
  pid: 26,
  name: '上装',
  picture: '/static/temp/cate15.jpg' },

{
  id: 32,
  pid: 26,
  name: '下装',
  picture: '/static/temp/cate16.jpg' },

{
  id: 33,
  pid: 4,
  name: '奶粉' },

{
  id: 34,
  pid: 4,
  name: '营养辅食' },

{
  id: 35,
  pid: 4,
  name: '童装' },

{
  id: 39,
  pid: 4,
  name: '喂养用品' },

{
  id: 36,
  pid: 33,
  name: '有机奶粉',
  picture: '/static/temp/cate17.jpg' },

{
  id: 37,
  pid: 34,
  name: '果泥/果汁',
  picture: '/static/temp/cate18.jpg' },

{
  id: 39,
  pid: 34,
  name: '面条/粥',
  picture: '/static/temp/cate20.jpg' },

{
  id: 42,
  pid: 35,
  name: '婴童衣橱',
  picture: '/static/temp/cate19.jpg' },

{
  id: 43,
  pid: 39,
  name: '吸奶器',
  picture: '/static/temp/cate21.jpg' },

{
  id: 44,
  pid: 39,
  name: '儿童餐具',
  picture: '/static/temp/cate22.jpg' },

{
  id: 45,
  pid: 39,
  name: '牙胶安抚',
  picture: '/static/temp/cate23.jpg' },

{
  id: 46,
  pid: 39,
  name: '围兜',
  picture: '/static/temp/cate24.jpg' }];var _default =



{
  carouselList: carouselList,
  cartList: cartList,
  detailData: detailData,
  lazyLoadList: lazyLoadList,
  userInfo: userInfo,
  shareList: shareList,
  goodsList: goodsList,
  orderList: orderList,
  cateList: cateList };exports.default = _default;

/***/ }),

/***/ 2:
/*!******************************************************************************************!*\
  !*** ./node_modules/@dcloudio/vue-cli-plugin-uni/packages/mp-vue/dist/mp.runtime.esm.js ***!
  \******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * Vue.js v2.6.11
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + (unicodeRegExp.source) + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (true) {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    {
      if(vm.$scope && vm.$scope.is){
        return vm.$scope.is
      }
    }
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  // fixed by xxxxxx (nvue vuex)
  /* eslint-disable no-undef */
  if(typeof SharedObject !== 'undefined'){
    this.id = SharedObject.uid++;
  } else {
    this.id = uid++;
  }
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.SharedObject.target) {
    Dep.SharedObject.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if ( true && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
// fixed by xxxxxx (nvue shared vuex)
/* eslint-disable no-undef */
Dep.SharedObject = typeof SharedObject !== 'undefined' ? SharedObject : {};
Dep.SharedObject.target = null;
Dep.SharedObject.targetStack = [];

function pushTarget (target) {
  Dep.SharedObject.targetStack.push(target);
  Dep.SharedObject.target = target;
}

function popTarget () {
  Dep.SharedObject.targetStack.pop();
  Dep.SharedObject.target = Dep.SharedObject.targetStack[Dep.SharedObject.targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      {// fixed by xxxxxx 微信小程序使用 plugins 之后，数组方法被直接挂载到了数组对象上，需要执行 copyAugment 逻辑
        if(value.push !== value.__proto__.push){
          copyAugment(value, arrayMethods, arrayKeys);
        } else {
          protoAugment(value, arrayMethods);
        }
      }
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.SharedObject.target) { // fixed by xxxxxx
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ( true && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if ( true &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
     true && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (true) {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
       true && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
     true && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (true) {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && "development" !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + (unicodeRegExp.source) + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (true) {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (true) {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (true) {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if ( true && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    true
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if ( true && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res) && !res._handled) {
      res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
      // issue #9511
      // avoid catch triggering multiple times when nested calls
      res._handled = true;
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (true) {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Technically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (true) {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals. ' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (true) {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
       true && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

/*  */

// fixed by xxxxxx (mp properties)
function extractPropertiesFromVNodeData(data, Ctor, res, context) {
  var propOptions = Ctor.options.mpOptions && Ctor.options.mpOptions.properties;
  if (isUndef(propOptions)) {
    return res
  }
  var externalClasses = Ctor.options.mpOptions.externalClasses || [];
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      var result = checkProp(res, props, key, altKey, true) ||
          checkProp(res, attrs, key, altKey, false);
      // externalClass
      if (
        result &&
        res[key] &&
        externalClasses.indexOf(altKey) !== -1 &&
        context[camelize(res[key])]
      ) {
        // 赋值 externalClass 真正的值(模板里 externalClass 的值可能是字符串)
        res[key] = context[camelize(res[key])];
      }
    }
  }
  return res
}

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag,
  context// fixed by xxxxxx
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    // fixed by xxxxxx
    return extractPropertiesFromVNodeData(data, Ctor, {}, context)
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (true) {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  // fixed by xxxxxx
  return extractPropertiesFromVNodeData(data, Ctor, res, context)
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (true) {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {}
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (true) {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      // fixed by xxxxxx 临时 hack 掉 uni-app 中的异步 name slot page
      if(child.asyncMeta && child.asyncMeta.data && child.asyncMeta.data.slot === 'page'){
        (slots['page'] || (slots['page'] = [])).push(child);
      }else{
        (slots.default || (slots.default = [])).push(child);
      }
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var hasNormalSlots = Object.keys(normalSlots).length > 0;
  var isStable = slots ? !!slots.$stable : !hasNormalSlots;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    !hasNormalSlots &&
    !prevSlots.$hasNormal
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  def(res, '$hasNormal', hasNormalSlots);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && (
      res.length === 0 ||
      (res.length === 1 && res[0].isComment) // #9658
    ) ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i, i, i); // fixed by xxxxxx
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i, i, i); // fixed by xxxxxx
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length, i++, i)); // fixed by xxxxxx
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i, i); // fixed by xxxxxx
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if ( true && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    // fixed by xxxxxx app-plus scopedSlot
    nodes = scopedSlotFn(props, this, props._i) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
       true && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        var hyphenatedKey = hyphenate(key);
        if (!(camelizedKey in hash) && !(hyphenatedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
       true && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if ( true && key !== '' && key !== null) {
      // null is a special value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (true) {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      callHook(componentInstance, 'onServiceCreated');
      callHook(componentInstance, 'onServiceAttached');
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (true) {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag, context); // fixed by xxxxxx

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
     true && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if ( true &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      if ( true && isDef(data) && isDef(data.nativeOn)) {
        warn(
          ("The .native modifier for v-on is only valid on components but it was used on <" + tag + ">."),
          context
        );
      }
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (true) {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {}
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack because all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if ( true && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if ( true && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  var owner = currentRenderingInstance;
  if (owner && isDef(factory.owners) && factory.owners.indexOf(owner) === -1) {
    // already pending
    factory.owners.push(owner);
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (owner && !isDef(factory.owners)) {
    var owners = factory.owners = [owner];
    var sync = true;
    var timerLoading = null;
    var timerTimeout = null

    ;(owner).$on('hook:destroyed', function () { return remove(owners, owner); });

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
        if (timerLoading !== null) {
          clearTimeout(timerLoading);
          timerLoading = null;
        }
        if (timerTimeout !== null) {
          clearTimeout(timerTimeout);
          timerTimeout = null;
        }
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
       true && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            timerLoading = setTimeout(function () {
              timerLoading = null;
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          timerTimeout = setTimeout(function () {
            timerTimeout = null;
            if (isUndef(factory.resolved)) {
              reject(
                 true
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : undefined
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (true) {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (true) {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }
  
  // fixed by xxxxxx update properties(mp runtime)
  vm._$updateProperties && vm._$updateProperties(vm);
  
  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (true) {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (true) {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
// All IE versions use low-res event timestamps, and have problematic clock
// implementations (#9632)
if (inBrowser && !isIE) {
  var performance = window.performance;
  if (
    performance &&
    typeof performance.now === 'function' &&
    getNow() > document.createEvent('Event').timeStamp
  ) {
    // if the event timestamp, although evaluated AFTER the Date.now(), is
    // smaller than it, it means the event is using a hi-res timestamp,
    // and we need to use the hi-res version for event listener timestamps as
    // well.
    getNow = function () { return performance.now(); };
  }
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if ( true && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if ( true && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression =  true
    ? expOrFn.toString()
    : undefined;
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
       true && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (true) {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          {
            if(vm.mpHost === 'mp-baidu'){//百度 observer 在 setData callback 之后触发，直接忽略该 warn
                return
            }
            //fixed by xxxxxx __next_tick_pending,uni://form-field 时不告警
            if(
                key === 'value' && 
                Array.isArray(vm.$options.behaviors) &&
                vm.$options.behaviors.indexOf('uni://form-field') !== -1
              ){
              return
            }
            if(vm._getFormData){
              return
            }
            var $parent = vm.$parent;
            while($parent){
              if($parent.__next_tick_pending){
                return  
              }
              $parent = $parent.$parent;
            }
          }
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {}
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
     true && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (true) {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
       true && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if ( true && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (true) {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if ( true &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.SharedObject.target) {// fixed by xxxxxx
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (true) {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (true) {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (true) {
      initProxy(vm);
    } else {}
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    vm.mpHost !== 'mp-toutiao' && initInjections(vm); // resolve injections before data/props  
    initState(vm);
    vm.mpHost !== 'mp-toutiao' && initProvide(vm); // resolve provide after data/props
    vm.mpHost !== 'mp-toutiao' && callHook(vm, 'created');      

    /* istanbul ignore if */
    if ( true && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if ( true &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if ( true && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if ( true && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (true) {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.11';

/**
 * https://raw.githubusercontent.com/Tencent/westore/master/packages/westore/utils/diff.js
 */
var ARRAYTYPE = '[object Array]';
var OBJECTTYPE = '[object Object]';
// const FUNCTIONTYPE = '[object Function]'

function diff(current, pre) {
    var result = {};
    syncKeys(current, pre);
    _diff(current, pre, '', result);
    return result
}

function syncKeys(current, pre) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE && rootPreType == OBJECTTYPE) {
        if(Object.keys(current).length >= Object.keys(pre).length){
            for (var key in pre) {
                var currentValue = current[key];
                if (currentValue === undefined) {
                    current[key] = null;
                } else {
                    syncKeys(currentValue, pre[key]);
                }
            }
        }
    } else if (rootCurrentType == ARRAYTYPE && rootPreType == ARRAYTYPE) {
        if (current.length >= pre.length) {
            pre.forEach(function (item, index) {
                syncKeys(current[index], item);
            });
        }
    }
}

function _diff(current, pre, path, result) {
    if (current === pre) { return }
    var rootCurrentType = type(current);
    var rootPreType = type(pre);
    if (rootCurrentType == OBJECTTYPE) {
        if (rootPreType != OBJECTTYPE || Object.keys(current).length < Object.keys(pre).length) {
            setResult(result, path, current);
        } else {
            var loop = function ( key ) {
                var currentValue = current[key];
                var preValue = pre[key];
                var currentType = type(currentValue);
                var preType = type(preValue);
                if (currentType != ARRAYTYPE && currentType != OBJECTTYPE) {
                    if (currentValue != pre[key]) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    }
                } else if (currentType == ARRAYTYPE) {
                    if (preType != ARRAYTYPE) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        if (currentValue.length < preValue.length) {
                            setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                        } else {
                            currentValue.forEach(function (item, index) {
                                _diff(item, preValue[index], (path == '' ? '' : path + ".") + key + '[' + index + ']', result);
                            });
                        }
                    }
                } else if (currentType == OBJECTTYPE) {
                    if (preType != OBJECTTYPE || Object.keys(currentValue).length < Object.keys(preValue).length) {
                        setResult(result, (path == '' ? '' : path + ".") + key, currentValue);
                    } else {
                        for (var subKey in currentValue) {
                            _diff(currentValue[subKey], preValue[subKey], (path == '' ? '' : path + ".") + key + '.' + subKey, result);
                        }
                    }
                }
            };

            for (var key in current) loop( key );
        }
    } else if (rootCurrentType == ARRAYTYPE) {
        if (rootPreType != ARRAYTYPE) {
            setResult(result, path, current);
        } else {
            if (current.length < pre.length) {
                setResult(result, path, current);
            } else {
                current.forEach(function (item, index) {
                    _diff(item, pre[index], path + '[' + index + ']', result);
                });
            }
        }
    } else {
        setResult(result, path, current);
    }
}

function setResult(result, k, v) {
    // if (type(v) != FUNCTIONTYPE) {
        result[k] = v;
    // }
}

function type(obj) {
    return Object.prototype.toString.call(obj)
}

/*  */

function flushCallbacks$1(vm) {
    if (vm.__next_tick_callbacks && vm.__next_tick_callbacks.length) {
        if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:flushCallbacks[' + vm.__next_tick_callbacks.length + ']');
        }
        var copies = vm.__next_tick_callbacks.slice(0);
        vm.__next_tick_callbacks.length = 0;
        for (var i = 0; i < copies.length; i++) {
            copies[i]();
        }
    }
}

function hasRenderWatcher(vm) {
    return queue.find(function (watcher) { return vm._watcher === watcher; })
}

function nextTick$1(vm, cb) {
    //1.nextTick 之前 已 setData 且 setData 还未回调完成
    //2.nextTick 之前存在 render watcher
    if (!vm.__next_tick_pending && !hasRenderWatcher(vm)) {
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + vm._uid +
                ']:nextVueTick');
        }
        return nextTick(cb, vm)
    }else{
        if(Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG){
            var mpInstance$1 = vm.$scope;
            console.log('[' + (+new Date) + '][' + (mpInstance$1.is || mpInstance$1.route) + '][' + vm._uid +
                ']:nextMPTick');
        }
    }
    var _resolve;
    if (!vm.__next_tick_callbacks) {
        vm.__next_tick_callbacks = [];
    }
    vm.__next_tick_callbacks.push(function () {
        if (cb) {
            try {
                cb.call(vm);
            } catch (e) {
                handleError(e, vm, 'nextTick');
            }
        } else if (_resolve) {
            _resolve(vm);
        }
    });
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
        return new Promise(function (resolve) {
            _resolve = resolve;
        })
    }
}

/*  */

function cloneWithData(vm) {
  // 确保当前 vm 所有数据被同步
  var ret = Object.create(null);
  var dataKeys = [].concat(
    Object.keys(vm._data || {}),
    Object.keys(vm._computedWatchers || {}));

  dataKeys.reduce(function(ret, key) {
    ret[key] = vm[key];
    return ret
  }, ret);
  //TODO 需要把无用数据处理掉，比如 list=>l0 则 list 需要移除，否则多传输一份数据
  Object.assign(ret, vm.$mp.data || {});
  if (
    Array.isArray(vm.$options.behaviors) &&
    vm.$options.behaviors.indexOf('uni://form-field') !== -1
  ) { //form-field
    ret['name'] = vm.name;
    ret['value'] = vm.value;
  }

  return JSON.parse(JSON.stringify(ret))
}

var patch = function(oldVnode, vnode) {
  var this$1 = this;

  if (vnode === null) { //destroy
    return
  }
  if (this.mpType === 'page' || this.mpType === 'component') {
    var mpInstance = this.$scope;
    var data = Object.create(null);
    try {
      data = cloneWithData(this);
    } catch (err) {
      console.error(err);
    }
    data.__webviewId__ = mpInstance.data.__webviewId__;
    var mpData = Object.create(null);
    Object.keys(data).forEach(function (key) { //仅同步 data 中有的数据
      mpData[key] = mpInstance.data[key];
    });
    var diffData = diff(data, mpData);
    if (Object.keys(diffData).length) {
      if (Object({"VUE_APP_PLATFORM":"mp-weixin","NODE_ENV":"development","BASE_URL":"/"}).VUE_APP_DEBUG) {
        console.log('[' + (+new Date) + '][' + (mpInstance.is || mpInstance.route) + '][' + this._uid +
          ']差量更新',
          JSON.stringify(diffData));
      }
      this.__next_tick_pending = true;
      mpInstance.setData(diffData, function () {
        this$1.__next_tick_pending = false;
        flushCallbacks$1(this$1);
      });
    } else {
      flushCallbacks$1(this);
    }
  }
};

/*  */

function createEmptyRender() {

}

function mountComponent$1(
  vm,
  el,
  hydrating
) {
  if (!vm.mpType) {//main.js 中的 new Vue
    return vm
  }
  if (vm.mpType === 'app') {
    vm.$options.render = createEmptyRender;
  }
  if (!vm.$options.render) {
    vm.$options.render = createEmptyRender;
    if (true) {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  
  vm.mpHost !== 'mp-toutiao' && callHook(vm, 'beforeMount');

  var updateComponent = function () {
    vm._update(vm._render(), hydrating);
  };

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before() {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;
  return vm
}

/*  */

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/*  */

var MP_METHODS = ['createSelectorQuery', 'createIntersectionObserver', 'selectAllComponents', 'selectComponent'];

function getTarget(obj, path) {
  var parts = path.split('.');
  var key = parts[0];
  if (key.indexOf('__$n') === 0) { //number index
    key = parseInt(key.replace('__$n', ''));
  }
  if (parts.length === 1) {
    return obj[key]
  }
  return getTarget(obj[key], parts.slice(1).join('.'))
}

function internalMixin(Vue) {

  Vue.config.errorHandler = function(err) {
    /* eslint-disable no-undef */
    var app = getApp();
    if (app && app.onError) {
      app.onError(err);
    } else {
      console.error(err);
    }
  };

  var oldEmit = Vue.prototype.$emit;

  Vue.prototype.$emit = function(event) {
    if (this.$scope && event) {
      this.$scope['triggerEvent'](event, {
        __args__: toArray(arguments, 1)
      });
    }
    return oldEmit.apply(this, arguments)
  };

  Vue.prototype.$nextTick = function(fn) {
    return nextTick$1(this, fn)
  };

  MP_METHODS.forEach(function (method) {
    Vue.prototype[method] = function(args) {
      if (this.$scope && this.$scope[method]) {
        return this.$scope[method](args)
      }
      // mp-alipay
      if (typeof my === 'undefined') {
        return
      }
      if (method === 'createSelectorQuery') {
        /* eslint-disable no-undef */
        return my.createSelectorQuery(args)
      } else if (method === 'createIntersectionObserver') {
        /* eslint-disable no-undef */
        return my.createIntersectionObserver(args)
      }
      // TODO mp-alipay 暂不支持 selectAllComponents,selectComponent
    };
  });

  Vue.prototype.__init_provide = initProvide;

  Vue.prototype.__init_injections = initInjections;

  Vue.prototype.__call_hook = function(hook, args) {
    var vm = this;
    // #7573 disable dep collection when invoking lifecycle hooks
    pushTarget();
    var handlers = vm.$options[hook];
    var info = hook + " hook";
    var ret;
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        ret = invokeWithErrorHandling(handlers[i], vm, args ? [args] : null, vm, info);
      }
    }
    if (vm._hasHookEvent) {
      vm.$emit('hook:' + hook, args);
    }
    popTarget();
    return ret
  };

  Vue.prototype.__set_model = function(target, key, value, modifiers) {
    if (Array.isArray(modifiers)) {
      if (modifiers.indexOf('trim') !== -1) {
        value = value.trim();
      }
      if (modifiers.indexOf('number') !== -1) {
        value = this._n(value);
      }
    }
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__set_sync = function(target, key, value) {
    if (!target) {
      target = this;
    }
    target[key] = value;
  };

  Vue.prototype.__get_orig = function(item) {
    if (isPlainObject(item)) {
      return item['$orig'] || item
    }
    return item
  };

  Vue.prototype.__get_value = function(dataPath, target) {
    return getTarget(target || this, dataPath)
  };


  Vue.prototype.__get_class = function(dynamicClass, staticClass) {
    return renderClass(staticClass, dynamicClass)
  };

  Vue.prototype.__get_style = function(dynamicStyle, staticStyle) {
    if (!dynamicStyle && !staticStyle) {
      return ''
    }
    var dynamicStyleObj = normalizeStyleBinding(dynamicStyle);
    var styleObj = staticStyle ? extend(staticStyle, dynamicStyleObj) : dynamicStyleObj;
    return Object.keys(styleObj).map(function (name) { return ((hyphenate(name)) + ":" + (styleObj[name])); }).join(';')
  };

  Vue.prototype.__map = function(val, iteratee) {
    //TODO 暂不考虑 string,number
    var ret, i, l, keys, key;
    if (Array.isArray(val)) {
      ret = new Array(val.length);
      for (i = 0, l = val.length; i < l; i++) {
        ret[i] = iteratee(val[i], i);
      }
      return ret
    } else if (isObject(val)) {
      keys = Object.keys(val);
      ret = Object.create(null);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[key] = iteratee(val[key], key, i);
      }
      return ret
    }
    return []
  };

}

/*  */

var LIFECYCLE_HOOKS$1 = [
    //App
    'onLaunch',
    'onShow',
    'onHide',
    'onUniNViewMessage',
    'onError',
    //Page
    'onLoad',
    // 'onShow',
    'onReady',
    // 'onHide',
    'onUnload',
    'onPullDownRefresh',
    'onReachBottom',
    'onTabItemTap',
    'onShareAppMessage',
    'onResize',
    'onPageScroll',
    'onNavigationBarButtonTap',
    'onBackPress',
    'onNavigationBarSearchInputChanged',
    'onNavigationBarSearchInputConfirmed',
    'onNavigationBarSearchInputClicked',
    //Component
    // 'onReady', // 兼容旧版本，应该移除该事件
    'onPageShow',
    'onPageHide',
    'onPageResize'
];
function lifecycleMixin$1(Vue) {

    //fixed vue-class-component
    var oldExtend = Vue.extend;
    Vue.extend = function(extendOptions) {
        extendOptions = extendOptions || {};

        var methods = extendOptions.methods;
        if (methods) {
            Object.keys(methods).forEach(function (methodName) {
                if (LIFECYCLE_HOOKS$1.indexOf(methodName)!==-1) {
                    extendOptions[methodName] = methods[methodName];
                    delete methods[methodName];
                }
            });
        }

        return oldExtend.call(this, extendOptions)
    };

    var strategies = Vue.config.optionMergeStrategies;
    var mergeHook = strategies.created;
    LIFECYCLE_HOOKS$1.forEach(function (hook) {
        strategies[hook] = mergeHook;
    });

    Vue.prototype.__lifecycle_hooks__ = LIFECYCLE_HOOKS$1;
}

/*  */

// install platform patch function
Vue.prototype.__patch__ = patch;

// public mount method
Vue.prototype.$mount = function(
    el ,
    hydrating 
) {
    return mountComponent$1(this, el, hydrating)
};

lifecycleMixin$1(Vue);
internalMixin(Vue);

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../../../webpack/buildin/global.js */ 3)))

/***/ }),

/***/ 24:
/*!***********************************************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/common/datas/indexCateModule.json ***!
  \***********************************************************************************************/
/*! exports provided: 0, 1, 2, 3, 4, 5, 6, 7, default */
/***/ (function(module) {

module.exports = [{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/c6a5af1034122a96a38fafd4b1ef2e7d.jpg?type=webp&imageView&quality=75&thumbnail=750x0","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"居家生活","id":1005000,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1d89de114797fb9237314920695c564d.png","name":"秋冬好物","id":109243003,"frontDesc":"温暖秋冬","type":0,"subCateList":[],"frontName":"秋冬好物"},{"categoryType":0,"showIndex":2,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0fe3073506c10f604c4ed7e0ba65d1f4.png","name":"主题床品","id":109243004,"frontDesc":"设计点亮，品质当道","type":0,"subCateList":[],"frontName":"设计点亮，品质当道"},{"categoryType":0,"showIndex":3,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/02d3e51b8db87c331dc73bef9e217133.png","name":"北欧原木","id":109252033,"frontDesc":"经典北欧风，打造原木家","type":0,"subCateList":[],"frontName":"经典北欧风，打造原木家"},{"categoryType":0,"showIndex":4,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan-item.nosdn.127.net/4ccd6ee87a83918474e7e962b06d96fd.png","name":"餐厨爆款清单","id":109261015,"frontDesc":"烹饪享乐趣","type":0,"subCateList":[],"frontName":"烹饪享乐趣"},{"categoryType":0,"showIndex":6,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ed6400e5be573e1524cdef0b5c9e462d.png","bannerUrl":"","name":"床品件套","id":1008009,"frontDesc":"甄选品质，睡眠美学","type":0,"subCateList":[],"frontName":"甄选品质，睡眠美学"},{"categoryType":0,"showIndex":7,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/96d109867f08a14af62d2390b7787439.png","name":"被枕盖毯","id":109260008,"frontDesc":"陷进柔软，多样选择","type":0,"subCateList":[],"frontName":"陷进柔软，多样选择"},{"categoryType":0,"showIndex":8,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b91e14afc5a138df8dbc3236146d24e6.png","bannerUrl":"","name":"床垫床褥","id":1008008,"frontDesc":"安心托护，美梦时刻","type":0,"subCateList":[],"frontName":"安心托护，美梦时刻"},{"categoryType":0,"showIndex":9,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ef4a874893fb5e76504fb044c2f7cd49.png","name":"抱枕靠垫","id":109260009,"frontDesc":"装点美家，生活美学","type":0,"subCateList":[],"frontName":"装点美家，生活美学"},{"showIndex":10,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0e5da66d87fc9db4279322d59f9b3d5b.png","bannerUrl":"","frontDesc":"装点家的格调","type":0,"frontName":"装点家的格调","categoryType":0,"superCategoryId":1005000,"name":"家饰","iconUrl":"","id":1011004,"subCateList":[]},{"categoryType":0,"showIndex":11,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d8f74a5d23c731084779b095e80fb3e3.png","bannerUrl":"","name":"居家布艺","id":1008002,"frontDesc":"趣意点缀，家中有格","type":0,"subCateList":[],"frontName":"趣意点缀，家中有格"},{"categoryType":0,"showIndex":12,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/aeecf63c24567c5a7a51b747a7dcf10a.png","name":"客餐厅家具","id":109243006,"frontDesc":"舒适经典，幸福宅家","type":0,"subCateList":[],"frontName":"舒适经典，幸福宅家"},{"categoryType":0,"showIndex":13,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/29a60124243be40301a571e09f8c935c.png","name":"卧室家具","id":109243007,"frontDesc":"天然选材，安心酣睡","type":0,"subCateList":[],"frontName":"天然选材，安心酣睡"},{"categoryType":0,"showIndex":14,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c35578aa38ec1c9e55aa74d9e77287a9.png","name":"办公书房家具","id":109243008,"frontDesc":"人体工学设计，健康办公","type":0,"subCateList":[],"frontName":"人体工学设计，健康办公"},{"categoryType":0,"showIndex":15,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/becde30fadf4ec335cd7ad8078798acf.png","name":"小件家具","id":109243009,"frontDesc":"实用至上，讲究质感","type":0,"subCateList":[],"frontName":"实用至上，讲究质感"},{"categoryType":0,"showIndex":16,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9bc4cae742e2b2709974ad074f897493.png","bannerUrl":"","name":"灯具","id":1008016,"frontDesc":"一盏灯，温暖一个家","type":0,"subCateList":[],"frontName":"一盏灯，温暖一个家"},{"categoryType":0,"showIndex":17,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f2e3e9df2cdb7e790e68356ac763cd58.png","name":"地毯窗帘","id":109261054,"frontDesc":"优质装点，柔软家居","type":0,"subCateList":[],"frontName":"优质装点，柔软家居"},{"categoryType":0,"showIndex":18,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ccf0ff26ca7bf8bbbc8683a740e28ae9.png","bannerUrl":"","name":"收纳","id":1008017,"frontDesc":"收纳神器大集结","type":0,"subCateList":[],"frontName":"收纳神器大集结"},{"categoryType":0,"showIndex":20,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/36d167a99e28b00dd08aa5e45fd33946.png","name":"晾晒除味","id":1092010,"frontDesc":"居家晾晒必备好物","type":0,"subCateList":[],"frontName":"居家晾晒必备好物"},{"categoryType":0,"showIndex":21,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f6eaa94e8920dd4290b9da7c545c8841.png","bannerUrl":"","name":"毛巾浴巾","id":1008001,"frontDesc":"亲肤柔棉，安心品质","type":0,"subCateList":[],"frontName":"亲肤柔棉，安心品质"},{"categoryType":0,"showIndex":22,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3e0c0c0f1d842ae66f4fbfd50a571ac1.png","name":"居家拖鞋","id":109243010,"frontDesc":"慵懒休闲时光，轻松惬意生活","type":0,"subCateList":[],"frontName":"慵懒休闲时光，轻松惬意生活"},{"categoryType":0,"showIndex":23,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3e60f0abe39d4cce0237edffad25c459.png","name":"家庭医疗","id":1092011,"frontDesc":"专业家庭医用好物","type":0,"subCateList":[],"frontName":"专业家庭医用好物"},{"categoryType":0,"showIndex":24,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/17cc6774b480037536a0f360bf207676.png","bannerUrl":"","name":"锅具","id":1005007,"frontDesc":"一口好锅，料理生活一日三餐","type":0,"subCateList":[],"frontName":"一口好锅，炖煮生活一日三餐"},{"categoryType":0,"showIndex":25,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1055eb85d2c5431c8f6623aed74bbbde.png","bannerUrl":"","name":"餐厨配件","id":1008012,"frontDesc":"下厨省力好帮手","type":0,"subCateList":[],"frontName":"下厨省力好帮手"},{"categoryType":0,"showIndex":26,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f17d41a51a2bb3a1b73f927959cd9ae2.png","bannerUrl":"","name":"刀剪砧板","id":1013005,"frontDesc":"传统工艺 源自中国刀城","type":0,"subCateList":[],"frontName":"传统工艺 源自中国刀城"},{"categoryType":0,"showIndex":27,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/338c77be5f292272e43869bcc52c8229.png","bannerUrl":"","name":"餐具","id":1005008,"frontDesc":"皇家道尔顿、日本KEYUCA制造商出品","type":0,"subCateList":[],"frontName":"餐桌上的舞蹈"},{"categoryType":0,"showIndex":28,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b24d4e3c402ecb4a95d7d6e8d77a93ba.png","bannerUrl":"","name":"水具杯壶","id":1007000,"frontDesc":"精工生产制作，匠人手艺","type":0,"subCateList":[],"frontName":"精工生产制作，匠人手艺"},{"categoryType":0,"showIndex":29,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6395f0efc4c720dbc1bee012af23e56e.png","bannerUrl":"","name":"茶咖酒具","id":1005009,"frontDesc":"严选精巧器具，轻松冲调","type":0,"subCateList":[],"frontName":"严选精巧器具，轻松冲调"},{"categoryType":0,"showIndex":30,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7d3612daccae482c1c9631992d4ffa44.png","name":"数码办公","id":109249013,"frontDesc":"职场数码办公用品","type":0,"subCateList":[],"frontName":"职场数码办公用品"},{"categoryType":0,"showIndex":31,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/41b1aa9754ea3d7cd29b2c753bdf3dd1.png","name":"办公家具","id":109248001,"frontDesc":"为健康办公生活加油","type":0,"subCateList":[],"frontName":"为健康办公生活加油"},{"categoryType":0,"showIndex":32,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2963d464664ffc426ed8dffd2f44ba16.png","name":"靠枕坐垫","id":109248002,"frontDesc":"让工位比被窝更舒适","type":0,"subCateList":[],"frontName":"让工位比被窝更舒适"},{"categoryType":0,"showIndex":33,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8bceb409edbc6415c91095a82d4d3edf.png","name":"宠物食品","id":1017000,"frontDesc":"用心选料，让爱宠健康成长","type":0,"subCateList":[],"frontName":"用心选料，让爱宠健康成长"},{"categoryType":0,"showIndex":34,"superCategoryId":1005000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0dc939d1cb0e437b56e392fbf859f768.png","name":"宠物用品","id":109248004,"frontDesc":"贴心设计，照顾爱宠舒适生活","type":0,"subCateList":[],"frontName":"贴心设计，照顾爱宠舒适生活"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/f247ad2cb1d02624e72248c91af4a4b2.jpg?type=webp&imageView&quality=75&thumbnail=750x0","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"服饰鞋包","id":1010000,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e279c3e247614d47404d9d5d88b397c9.png","name":"热销爆款","id":109257004,"frontDesc":"人气好物放心购","type":0,"subCateList":[],"frontName":"人气好物放心购"},{"categoryType":0,"showIndex":2,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d0a099cb4bfdb9afccf9470719b3611c.png","name":"好物上新","id":109243011,"frontDesc":"新品好物 一手掌握","type":0,"subCateList":[],"frontName":"新品好物 一手掌握"},{"categoryType":0,"showIndex":3,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1fc7bbf077f022659cb4eff564d382fa.png","name":"夏季新品","id":109243013,"frontDesc":"夏季热力爆品 抢先预览","type":0,"subCateList":[],"frontName":"夏季热力爆品 抢先预览"},{"categoryType":0,"showIndex":4,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/fa89d78c2c70477987ec09c56661dc31.png","name":"居家囤货","id":109243014,"frontDesc":"慵懒居家 一秒提升幸福感","type":0,"subCateList":[],"frontName":"慵懒居家 一秒提升幸福感"},{"categoryType":0,"showIndex":5,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f2ab8dca74661d5b7d36f80b14e50a5a.png","name":"抄底特惠","id":109259014,"frontDesc":"抄底特惠 低至5折","type":0,"subCateList":[],"frontName":"抄底特惠"},{"categoryType":0,"showIndex":6,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/10b0537e284e4eb89a9461e583d017db.png","name":"男式衬衫","id":1093008,"frontDesc":"经典百搭 精致设计","type":0,"subCateList":[],"frontName":"经典百搭 精致设计"},{"categoryType":0,"showIndex":7,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2c5a1f681831987ff3d4fb8e63f6d0d6.jpg","name":"男式针织衫/卫衣","id":109214004,"frontDesc":"简约调性 儒雅休闲自如切换","type":0,"subCateList":[],"frontName":"简约调性 儒雅休闲自如切换"},{"categoryType":0,"showIndex":8,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/35b564c2867fc5faed9403cec440bafe.png","name":"男式外套","id":1093012,"frontDesc":"自在潇洒穿着感","type":0,"subCateList":[],"frontName":"自在潇洒穿着感"},{"categoryType":0,"showIndex":9,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/690dee73a00b6922664f727b40a58a3b.png","name":"男式牛仔","id":1068003,"frontDesc":"颠覆牛仔认知 革新你的穿着体验","type":0,"subCateList":[],"frontName":"颠覆牛仔认知 革新你的穿着体验"},{"categoryType":0,"showIndex":10,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/270011056e5216e03d2d054683c2b337.png","name":"女式内衣","id":109272000,"frontDesc":"柔软呵护","type":0,"subCateList":[],"frontName":"柔软呵护"},{"categoryType":0,"showIndex":11,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/aba02a880a47a4a62cd85842ea6eadce.jpg","name":"男式裤装","id":1093009,"frontDesc":"高质感面料 休闲商务两适宜","type":0,"subCateList":[],"frontName":"高质感面料 休闲商务两适宜"},{"categoryType":0,"showIndex":12,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f917b00b07445c46a1df90ccaff2a8de.png","name":"男式T恤/POLO","id":109214000,"frontDesc":"内搭T恤 贴身自在","type":0,"subCateList":[],"frontName":"内搭T恤 贴身自在"},{"categoryType":0,"showIndex":13,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a729319b8b4d127b09402f65c96d421f.jpg","name":"女式针织衫/卫衣","id":109214003,"frontDesc":"体验温柔的质感","type":0,"subCateList":[],"frontName":"体验温柔的质感"},{"categoryType":0,"showIndex":14,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7a6f1ba8da59a454e7c4a2b7b61ff26a.jpg","name":"女式衬衫","id":109214001,"frontDesc":"职场精致LOOK","type":0,"subCateList":[],"frontName":"职场精致LOOK"},{"categoryType":0,"showIndex":15,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3084ec837a9f38b053b81061cfcdae78.png","name":"女式外套","id":1093010,"frontDesc":"选对风格 只做自己","type":0,"subCateList":[],"frontName":"选对风格 只做自己"},{"categoryType":0,"showIndex":16,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/55ddb8143c911ee1881a6205572c718e.png","name":"女式裤装","id":1093007,"frontDesc":"轻松舒适 送给双腿的温柔力量","type":0,"subCateList":[],"frontName":"轻松舒适 送给双腿的温柔力量"},{"categoryType":0,"showIndex":17,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2f4686765e77abf8213f2b0e127045be.png","name":"女式牛仔","id":109214002,"frontDesc":"基础裤型的舒适之选","type":0,"subCateList":[],"frontName":"基础裤型的舒适之选"},{"categoryType":0,"showIndex":18,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/77ade36fe051e9800409dbfd3f7fa644.jpg","name":"女式T恤/POLO","id":1093006,"frontDesc":"精选材质 穿出质感","type":0,"subCateList":[],"frontName":"精选材质 穿出质感"},{"categoryType":0,"showIndex":19,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2b65c76b9aec77fe724b23199c79e718.png","name":"女式裙装","id":1037007,"frontDesc":"量身裁体的优雅","type":0,"subCateList":[],"frontName":"量身裁体的优雅"},{"categoryType":0,"showIndex":20,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e7fee5bb435eb5d5f094eb9f65df6c86.jpg","name":"男式家居服","id":1093004,"frontDesc":"舒适源自高品质","type":0,"subCateList":[],"frontName":"舒适源自高品质"},{"categoryType":0,"showIndex":21,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/603d7a8d9e2449aaec58ca191d0bea61.jpg","name":"女式家居服","id":1093005,"frontDesc":"享受宅家时光","type":0,"subCateList":[],"frontName":"享受宅家时光"},{"categoryType":0,"showIndex":22,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8207750f810aea25e43c423e6de7f943.png","bannerUrl":"","name":"男式内裤","id":1010002,"frontDesc":"透气舒爽 自由空间","type":0,"subCateList":[],"frontName":"透气舒爽 自由空间"},{"categoryType":0,"showIndex":23,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b330070087bb87cb7586bd4097aa5a65.png","bannerUrl":"","name":"女式内裤","id":1013006,"frontDesc":"温和安全 亲密呵护","type":0,"subCateList":[],"frontName":"温和安全 亲密呵护"},{"categoryType":0,"showIndex":24,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/59122ca632ba972f02d8621458da74c4.png","name":"女式文胸/套装","id":1093011,"frontDesc":"贴身关怀 少束缚","type":0,"subCateList":[],"frontName":"贴身关怀 少束缚"},{"categoryType":0,"showIndex":25,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/df3c77be2e897ad51fb5cfd2040b7b55.png","name":"男式内衣","id":1093013,"frontDesc":"绅士的第二肌肤","type":0,"subCateList":[],"frontName":"绅士的第二肌肤"},{"categoryType":0,"showIndex":26,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f850599cb9c99a523b0a88160da80eca.png","bannerUrl":"","name":"男袜","id":1008004,"frontDesc":"始于足下的品质生活","type":0,"subCateList":[],"frontName":"始于足下的品质生活"},{"categoryType":0,"showIndex":27,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e888bde27a75c01f67b20c8b3eb3cee3.png","name":"丝袜","id":1034000,"frontDesc":"犹如你腿部的第二层肌肤","type":0,"subCateList":[],"frontName":"犹如你腿部的第二层肌肤"},{"categoryType":0,"showIndex":28,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/27ba0c6e4898bffd723ea4272e6380db.png","bannerUrl":"","name":"女袜/连裤袜","id":109273001,"frontDesc":"始于足下的品质生活","type":0,"subCateList":[],"frontName":"始于足下的品质生活"},{"categoryType":0,"showIndex":29,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/5452d909f0caddc1b9a8311968e78a17.png","bannerUrl":"","name":"男鞋","id":1008003,"frontDesc":"匠心打造 轻潮舒适","type":0,"subCateList":[],"frontName":"匠心打造 轻潮舒适"},{"categoryType":0,"showIndex":30,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1a51bbdd24badf39d66b884ea71e665c.png","bannerUrl":"","name":"女鞋","id":1013000,"frontDesc":"优雅 如此舒适","type":0,"subCateList":[],"frontName":"优雅 如此舒适"},{"categoryType":0,"showIndex":31,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2885bf2a48a744cbf6c1aa4a9d0f907b.png","bannerUrl":"","name":"拖鞋","id":1008010,"frontDesc":"慵懒休闲时光 轻松惬意生活","type":0,"subCateList":[],"frontName":"慵懒休闲时光 轻松惬意生活"},{"showIndex":32,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/eedd6de98be2da9e63608b994035bf14.png","bannerUrl":"","frontDesc":"呵护双脚 驱散行走的压力","type":0,"frontName":"呵护双脚 驱散行走的压力","categoryType":0,"superCategoryId":1010000,"name":"鞋配","iconUrl":"","id":1044000,"subCateList":[]},{"categoryType":0,"showIndex":33,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dbc1125c627b106de9b3d078b97292fb.png","name":"女士包袋","id":1056002,"frontDesc":"包里装着你的整个世界","type":0,"subCateList":[],"frontName":"包里装着你的整个世界"},{"categoryType":0,"showIndex":34,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e8b034f63aac15198f971503a6370947.png","name":"男士包袋","id":1056001,"frontDesc":"懂你的责任也更懂你","type":0,"subCateList":[],"frontName":"懂你的责任也更懂你"},{"categoryType":0,"showIndex":35,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a94a5d317d289f01a93ee093c3975121.png","name":"钱包及小皮件","id":1056003,"frontDesc":"握在手中的精致","type":0,"subCateList":[],"frontName":"握在手中的精致"},{"categoryType":0,"showIndex":36,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/638f6de1cfa9defef5468a952f4efcad.png","name":"行李箱","id":1037000,"frontDesc":"带着梦想即刻出发","type":0,"subCateList":[],"frontName":"带着梦想即刻出发"},{"showIndex":37,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/210c5f72a701ec888efa0c1d885d1de1.png","bannerUrl":"","frontDesc":"璀璨闪耀 品质甄选","type":0,"frontName":"璀璨闪耀 品质甄选","categoryType":0,"superCategoryId":1010000,"name":"奢华珠宝","iconUrl":"","id":1020008,"subCateList":[]},{"categoryType":0,"showIndex":38,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1eb26c281fa9b7b9e386cfd5ce1d67a7.png","name":"时尚饰品","id":109253000,"frontDesc":"精致灵动的小确幸","type":0,"subCateList":[],"frontName":"精致灵动的小确幸"},{"categoryType":0,"showIndex":39,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a83b12528629ec1f6d08e6344739fce7.png","bannerUrl":"","name":"围巾手套","id":1008007,"frontDesc":"冬日出街必备","type":0,"subCateList":[],"frontName":"冬日出街必备"},{"categoryType":0,"showIndex":40,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1d653f706fb834937a3d1c29e5725618.png","name":"眼镜墨镜","id":1036001,"frontDesc":"你和潮流之间就差一个我","type":0,"subCateList":[],"frontName":"你和潮流之间就差一个我"},{"categoryType":0,"showIndex":41,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/52d449042bc437f6179935624f0c1056.png","bannerUrl":"","name":"腰带腕表","id":1010004,"frontDesc":"匠心雕琢细节 细节彰显品位","type":0,"subCateList":[],"frontName":"匠心雕琢细节 细节彰显品位"},{"categoryType":0,"showIndex":42,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dbee5f088438f7a1538454372788845d.png","name":"帽子发饰","id":109253001,"frontDesc":"时髦 从“头”开始","type":0,"subCateList":[],"frontName":"时髦 从“头”开始"},{"categoryType":0,"showIndex":43,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/01f06c74b0591a8da403199cf27dd875.png","name":"Yessing上装","id":109202000,"frontDesc":"运动生活两相宜","type":0,"subCateList":[],"frontName":"运动生活两相宜"},{"categoryType":0,"showIndex":44,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6a68adf468654a26d916fcaf5a4ab5bd.png","name":"Yessing下装","id":109214006,"frontDesc":"时尚下装 元气满满","type":0,"subCateList":[],"frontName":"时尚下装 元气满满"},{"categoryType":0,"showIndex":45,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9fe3213589cf74af2ec8ec3ce5322ada.png","name":"女式上装","id":109255016,"frontDesc":"一步获取元气女神","type":0,"subCateList":[],"frontName":"一步获取元气女神"},{"categoryType":0,"showIndex":46,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d0c83b8c8429de534a5945e2a6135a8a.png","name":"男式上装","id":109255014,"frontDesc":"运动休闲型男魅力","type":0,"subCateList":[],"frontName":"运动休闲型男魅力"},{"categoryType":0,"showIndex":47,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/353876f9db324dc0976ccef7bc834451.png","name":"女式下装","id":109255017,"frontDesc":"好穿易搭轻松减龄","type":0,"subCateList":[],"frontName":"好穿易搭轻松减龄"},{"categoryType":0,"showIndex":48,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/25a81eb6ab646d8a294f3a51d7dc231f.png","name":"男式下装","id":109255015,"frontDesc":"时尚生活有型有款","type":0,"subCateList":[],"frontName":"时尚生活有型有款"},{"categoryType":0,"showIndex":49,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8ebf546b13d24f2dc3c08521b592313f.png","name":"免烫系列","id":109263000,"frontDesc":"舒适免烫 时刻平整","type":0,"subCateList":[],"frontName":"舒适免烫 时刻平整"},{"categoryType":0,"showIndex":50,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a9db6faaa689c4dfcc37ef80d0552b1a.png","name":"棉麻系列","id":109263002,"frontDesc":"透气棉麻 清楚不羁","type":0,"subCateList":[],"frontName":"透气棉麻 清楚不羁"},{"categoryType":0,"showIndex":51,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cc358f426cbe81d9e806c6b7c2fb64aa.png","name":"真丝系列","id":109263003,"frontDesc":"生活质感更考究","type":0,"subCateList":[],"frontName":"生活质感更考究"},{"categoryType":0,"showIndex":52,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/674af56699e3ccf525f4d65b7bab5446.png","name":"莫代尔系列","id":109263004,"frontDesc":"舒适不同凡响","type":0,"subCateList":[],"frontName":"舒适不同凡响"},{"categoryType":0,"showIndex":53,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9f7531cbaa489ec85a91a3a7dae92e21.png","name":"几何森林","id":109263005,"frontDesc":"绮梦穿梭 视觉世界","type":0,"subCateList":[],"frontName":"绮梦穿梭 视觉世界"},{"categoryType":0,"showIndex":54,"superCategoryId":1010000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f08b4c04de93a6896f4e02df44ab457b.png","name":"海洋环保","id":109269000,"frontDesc":"海洋垃圾再生面料 时尚又环保","type":0,"subCateList":[],"frontName":"海洋环保"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/b2595d342733647008a941ad3ba9914d.jpg?type=webp&imageView&quality=75&thumbnail=750x0","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"美食酒水","id":1005002,"type":0,"subCateList":[{"showIndex":1,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/85bf41ca68dc4fe79892344af5887e56.png","bannerUrl":"","frontDesc":"春节宅家囤美食，放假期间正常发货","type":0,"frontName":"春节宅家囤美食，放假期间正常发货","categoryType":0,"superCategoryId":1005002,"name":"宅家囤美食","iconUrl":"","id":109271000,"subCateList":[]},{"categoryType":0,"showIndex":2,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/eefce6cae6d9f89b309612f70a80c3e0.png","name":"居家保健","id":109273000,"frontDesc":"宅家吃好物，强身养生抵抗力棒","type":0,"subCateList":[],"frontName":"宅家吃好物，强身养生抵抗力棒"},{"categoryType":0,"showIndex":3,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6282955a3db5db7c0ee06e9d560c165f.png","name":"上新美味","id":109253007,"frontDesc":"为你寻遍世间美味，让你品尝第一口好物","type":0,"subCateList":[],"frontName":"为你寻遍世间美味，让你品尝第一口好物"},{"categoryType":0,"showIndex":4,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/59fa0a9ddd1264dbc6f4cb8979357007.png","name":"大家都在买","id":109253008,"frontDesc":"网友购物车里的美食的TOP榜","type":0,"subCateList":[],"frontName":"网友购物车里的美食的TOP榜"},{"categoryType":0,"showIndex":5,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2e753a8f0977fd09a74ccea4f0c6192c.png","bannerUrl":"","name":"饼干糕点","id":1008015,"frontDesc":"无人工添加香精、防腐剂","type":0,"subCateList":[],"frontName":"四季糕点，用心烘焙"},{"categoryType":0,"showIndex":6,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6941ede8541ceeb432e8da16e200152b.png","bannerUrl":"","name":"小食糖巧","id":1005011,"frontDesc":"原香鲜材，以小食之味，带来味蕾惊喜","type":0,"subCateList":[],"frontName":"原香鲜材，以小食之味，带来味蕾惊喜"},{"categoryType":0,"showIndex":7,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/18dc905db6c49fbf55b2709078875cdb.png","name":"肉类零食","id":1035003,"frontDesc":"真嗜肉者，都爱这一味，或麻辣鲜香、或五味俱全，都是佳肴美馔真滋味","type":0,"subCateList":[],"frontName":"真嗜肉者，都爱这一味，佳肴美馔真滋味"},{"categoryType":0,"showIndex":8,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/46b5256193d052612ecb9fb22d7f4b88.png","bannerUrl":"","name":"坚果炒货","id":1005010,"frontDesc":"精选原产地，美味加营养","type":0,"subCateList":[],"frontName":"精选原产地，美味加营养"},{"showIndex":9,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dfc7d79ca21ee0f55428c8be218da5d3.png","bannerUrl":"","frontDesc":"品尝与收获到的是自然的味道","type":0,"frontName":"品尝与收获到的是自然的味道","categoryType":0,"superCategoryId":1005002,"name":"蜜饯果干","iconUrl":"","id":1027001,"subCateList":[]},{"categoryType":0,"showIndex":10,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8d4523c21259f514d378ad7431cd4a75.png","bannerUrl":"","name":"冲调饮品","id":1005013,"frontDesc":"以用料天然之美，尽享闲雅之意","type":0,"subCateList":[],"frontName":"以用料天然之美，尽享闲雅之意"},{"categoryType":0,"showIndex":11,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/edb41097ac4cc34ffd08d02f125c98e8.jpg","name":"传统茗茶","id":1027000,"frontDesc":"一品茶香，品茗即是观心，饮茶涤净尘虑","type":0,"subCateList":[],"frontName":"一品茶香，品茗即是观心，饮茶涤净尘虑"},{"showIndex":12,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/01a25fc0ec89278943d488eba3b959e1.jpg","bannerUrl":"","frontDesc":"人生圆满，不过赠好友一盒茶礼，品味畅谈","type":0,"frontName":"人生圆满，不过赠好友一盒茶礼，品味畅谈","categoryType":0,"superCategoryId":1005002,"name":"茗茶礼盒","iconUrl":"","id":109260000,"subCateList":[]},{"categoryType":0,"showIndex":13,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/bd65e6d2bd8985e55d38c06f173a6fb5.jpg","name":"茶包花茶","id":109206006,"frontDesc":"办公室必备茶包花茶","type":0,"subCateList":[],"frontName":"办公室必备茶包花茶"},{"categoryType":0,"showIndex":14,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0a66214a911887c854cb75e4112c07ed.png","name":"滋补食材","id":1054001,"frontDesc":"营养滋补，只为健康","type":0,"subCateList":[],"frontName":"营养滋补，只为健康"},{"categoryType":0,"showIndex":15,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/65fa4fbdbff206271c27179844e9297a.png","name":"保健品","id":109206016,"frontDesc":"保健佳品","type":0,"subCateList":[],"frontName":"保健佳品"},{"categoryType":0,"showIndex":16,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/25428a7b8047d4e35ab58367bf44d030.png","name":"乳品饮料","id":109206008,"frontDesc":"四季饮料，欢乐共享","type":0,"subCateList":[],"frontName":"四季饮料，欢乐共享"},{"categoryType":0,"showIndex":17,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e2ec593d7d5feae8a2f227892d08b081.png","name":"酒类","id":1053001,"frontDesc":"美酒佳酿，用心典藏","type":0,"subCateList":[],"frontName":"美酒佳酿，用心典藏"},{"categoryType":0,"showIndex":18,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e486923c1ffa14ad47672c6d495be8ed.png","name":"名酒馆","id":109264007,"frontDesc":"寻遍全球，甄选世界好酒","type":0,"subCateList":[],"frontName":"名酒馆"},{"categoryType":0,"showIndex":19,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7ecc7eab5519a1bf49fd2b6f4ad433ec.png","name":"米面粮油","id":109206007,"frontDesc":"米面粮油，家庭必备","type":0,"subCateList":[],"frontName":"米面粮油，家庭必备"},{"categoryType":0,"showIndex":20,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7154cb8de296a6d6acb16022d2725189.png","name":"方便食品","id":109201001,"frontDesc":"健康方便食品","type":0,"subCateList":[],"frontName":"健康方便食品"},{"categoryType":0,"showIndex":21,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4daf3eb8c49f473596bb15a71edc510f.png","bannerUrl":"","name":"南北干货","id":1005012,"frontDesc":"天时地利人和，寻找这个时节这个地点的味道","type":0,"subCateList":[],"frontName":"天时地利人和，寻找这个时节这个地点的味道"},{"categoryType":0,"showIndex":22,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/339889b1f38aba8b4a63c472e782d1ee.png","name":"调味酱菜","id":1036003,"frontDesc":"烹饪必备，美食调味","type":0,"subCateList":[],"frontName":"烹饪必备，美食调味"},{"categoryType":0,"showIndex":23,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e370d525c0bc5c35173fd72f2b598403.jpg","name":"水果蔬菜","id":109264008,"frontDesc":"应季果蔬，应有尽有","type":0,"subCateList":[],"frontName":"水果蔬菜"},{"categoryType":0,"showIndex":24,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d3e0c79acff00d7b481e003816d5c105.png","name":"肉蛋海鲜","id":109206009,"frontDesc":"新鲜肉质，新鲜体验","type":0,"subCateList":[],"frontName":"肉蛋海鲜"},{"categoryType":0,"showIndex":25,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/075e800278eea9266f2d839f4c6cb5a2.png","name":"冷冻冷藏","id":109264009,"frontDesc":"冷冻美食，冷藏好味道","type":0,"subCateList":[],"frontName":"冷冻冷藏"},{"showIndex":26,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0a35aef69fd20761d113f4dc54f4ef2c.png","bannerUrl":"","frontDesc":"安全配送，新鲜直达","type":0,"frontName":"安全配送，新鲜直达","categoryType":0,"superCategoryId":1005002,"name":"网易黑猪","iconUrl":"","id":1008014,"subCateList":[]},{"categoryType":0,"showIndex":27,"superCategoryId":1005002,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ed9fda295d73fa8bbd0b9ea428329c1b.png","name":"全球美食","id":109206010,"frontDesc":"全球制造，环球美食","type":0,"subCateList":[],"frontName":"全球制造，环球美食"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/6b1ebd19470cea9a7b8e81a52485f414.jpg?type=webp&imageView&quality=75&thumbnail=750x0","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"个护清洁","id":1013001,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0af70c043ee2418c63eb74135084b215.png","name":"爆款榜单","id":109256007,"frontDesc":"精选口碑尖货","type":0,"subCateList":[],"frontName":"精选口碑尖货"},{"categoryType":0,"showIndex":2,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ad777c7b8e1e53040bfe7e46a93f5950.png","name":"面部护理","id":1020001,"frontDesc":"温和无刺激的呵护","type":0,"subCateList":[],"frontName":"温和无刺激的呵护"},{"categoryType":0,"showIndex":3,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ffce24773c1b680572353d1d864da1e7.jpg","name":"新品尝鲜","id":109256008,"frontDesc":"新品速递，等你来试","type":0,"subCateList":[],"frontName":"新品速递，等你来试"},{"categoryType":0,"showIndex":4,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/52bca59c658299046c4df435c3abee1c.png","name":"基础护肤","id":109256010,"frontDesc":"高效补水，深层修护","type":0,"subCateList":[],"frontName":"高效补水，深层修护"},{"categoryType":0,"showIndex":5,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e3211f79704b02298656ec8c99b6a70d.png","name":"卸妆洁面","id":109256009,"frontDesc":"温和配方，养卸一体","type":0,"subCateList":[],"frontName":"温和配方，养卸一体"},{"categoryType":0,"showIndex":6,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/52068e062728c10f4d4da30fed9d3280.png","name":"护肤工具","id":109256011,"frontDesc":"智能美颜，匠心工艺","type":0,"subCateList":[],"frontName":"智能美颜，匠心工艺"},{"categoryType":0,"showIndex":7,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1ac9a9eee6be87a02faaea2e3abfec25.png","bannerUrl":"","name":"洗发护发","id":1013003,"frontDesc":"护发超有效小秘诀","type":0,"subCateList":[],"frontName":"呵护秀发，柔顺不同发质"},{"categoryType":0,"showIndex":8,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cf842f27c11f1587ca55d20035c1caba.png","name":"身体护理","id":1037002,"frontDesc":"呵护肌肤，天然温和","type":0,"subCateList":[],"frontName":"呵护肌肤，天然温和"},{"categoryType":0,"showIndex":9,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cef1d1b9f26a01037d705443e585d313.png","name":"口腔护理","id":1037003,"frontDesc":"健康口腔，品质生活","type":0,"subCateList":[],"frontName":"健康口腔，品质生活"},{"categoryType":0,"showIndex":10,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/13d7d7e9fa5f59227f8d5c4be153a957.png","name":"女性护理","id":109208003,"frontDesc":"品质之选，温柔呵护","type":0,"subCateList":[],"frontName":"品质之选，温柔呵护"},{"categoryType":0,"showIndex":11,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/5f91b77da79bb06f72973ecbb63c6a64.png","bannerUrl":"","name":"彩妆修容","id":1013002,"frontDesc":"为你的面容添色","type":0,"subCateList":[],"frontName":"为你的面容添色"},{"categoryType":0,"showIndex":12,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/fd2d0e6a87331d18ec67e77cd0f09c5b.png","name":"美妆工具","id":109243017,"frontDesc":"选对工具，精致妆容","type":0,"subCateList":[],"frontName":"选对工具，精致妆容"},{"categoryType":0,"showIndex":13,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e4c674c49a1a7da65fda7d50e2a32328.png","bannerUrl":"","name":"香水香氛","id":1013004,"frontDesc":"提炼纯净，清雅不腻","type":0,"subCateList":[],"frontName":"提炼纯净，清雅不腻"},{"categoryType":0,"showIndex":14,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/31856d567e5c2de30f2d06c03994148c.png","name":"个护电器","id":109248003,"frontDesc":"科技护理，创享精致生活","type":0,"subCateList":[],"frontName":"科技护理，创享精致生活"},{"categoryType":0,"showIndex":15,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8efe5dc20ae937faa0f8918678728f3d.png","name":"口腔护理电器","id":109254053,"frontDesc":"专业高效护理口腔","type":0,"subCateList":[],"frontName":"专业高效护理口腔"},{"categoryType":0,"showIndex":16,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/be5d2abe1db1b8efe84bb48250d2899c.png","name":"面部护理电器","id":109254054,"frontDesc":"让你变美的仪器们","type":0,"subCateList":[],"frontName":"让你变美的仪器们"},{"categoryType":0,"showIndex":17,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/539ea18e491d8e0c98152eed1d300f54.png","name":"头发护理电器","id":109254055,"frontDesc":"头发亮泽光彩，随心造型","type":0,"subCateList":[],"frontName":"头发亮泽光彩，随心造型"},{"categoryType":0,"showIndex":18,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/fb99d01e5fc25568f97b6cf93012b1d2.png","name":"身体护理电器","id":109254056,"frontDesc":"爱护身体，方寸间蕴出肌肤之美","type":0,"subCateList":[],"frontName":"爱护身体，方寸间蕴出肌肤之美"},{"categoryType":0,"showIndex":19,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/921337182aa5a4540ab0632c1fb6ad89.png","name":"纸品湿巾","id":1037001,"frontDesc":"和风设计，温和清洁","type":0,"subCateList":[],"frontName":"和风设计，温和清洁"},{"categoryType":0,"showIndex":20,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/869ab6b70b45716c9ffd35ed55669855.png","name":"纸品","id":109256012,"frontDesc":"和风设计，原生木浆","type":0,"subCateList":[],"frontName":"和风设计，原生木浆"},{"categoryType":0,"showIndex":21,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1275d57ba465ea26488f3be701295099.png","name":"湿巾","id":109256013,"frontDesc":"温和致净，亲密呵护","type":0,"subCateList":[],"frontName":"温和致净，亲密呵护"},{"categoryType":0,"showIndex":22,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e40f60a3fe682b3317f3672e374dca0b.png","name":"衣物护理","id":109243015,"frontDesc":"洁净衣物，守护全家","type":0,"subCateList":[],"frontName":"洁净衣物，守护全家"},{"categoryType":0,"showIndex":23,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/54f2e4f7a9cb17b61804d4d9a8982889.png","bannerUrl":"","name":"家庭清洁","id":1009000,"frontDesc":"天然材料，温和去除污垢","type":0,"subCateList":[],"frontName":"洁净才能带来清爽心情"},{"categoryType":0,"showIndex":24,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/45d436cc3d818ee3686b9ceb2a6a71e0.png","name":"餐厨清洁","id":109243016,"frontDesc":"高效清洁，省时省心","type":0,"subCateList":[],"frontName":"高效清洁，省时省心"},{"categoryType":0,"showIndex":25,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/44114978a0117bac622cdc3ffdc7b638.png","name":"毛巾浴巾","id":109261055,"frontDesc":"亲肤柔棉，安心品质","type":0,"subCateList":[],"frontName":"亲肤柔棉，安心品质"},{"categoryType":0,"showIndex":26,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/76d4335b8a97c7e2635f66e1b71e4ee1.png","name":"浴室用品","id":1020002,"frontDesc":"环保材料，耐用不发霉","type":0,"subCateList":[],"frontName":"小工具成就美好浴室"},{"categoryType":0,"showIndex":27,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c96383b484c677dacd0c696040a769b4.png","name":"避孕套","id":109255010,"frontDesc":"给爱爱一层安全感","type":0,"subCateList":[],"frontName":"给爱爱一层安全感"},{"categoryType":0,"showIndex":28,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8ea84f70b41e0441b8df48bd2f88b26e.png","name":"女用情趣","id":109255011,"frontDesc":"解锁身体的快乐秘密","type":0,"subCateList":[],"frontName":"解锁身体的快乐秘密"},{"categoryType":0,"showIndex":29,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/5f2f9f911ff905040f6d5c747a5c9bf5.png","name":"男用情趣","id":109255012,"frontDesc":"男儿硬器，尽兴释放自己","type":0,"subCateList":[],"frontName":"男儿硬器，尽兴释放自己"},{"categoryType":0,"showIndex":30,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/72e99034707dc6ffa890b3e82113c8e6.png","name":"润滑液","id":109255013,"frontDesc":"让亲密接触更湿滑畅意","type":0,"subCateList":[],"frontName":"让亲密接触更湿滑畅意"},{"categoryType":0,"showIndex":31,"superCategoryId":1013001,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1adf88cfc906928959e5741e9455790f.png","name":"计生情趣","id":1037004,"frontDesc":"解锁身体里的快乐秘密","type":0,"subCateList":[],"frontName":"解锁身体里的快乐秘密"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/9794fdd00c6ac9054a13dc7d8b110d1e.jpg?type=webp&imageView&quality=75&thumbnail=750x0","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"母婴亲子","id":1011000,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/97f65393f6a4a7b3d91cbe0cd19c617d.png","name":"防疫榜单","id":109259002,"frontDesc":"清洁洗护 科学防疫","type":0,"subCateList":[],"frontName":"清洁洗护 科学防疫"},{"categoryType":0,"showIndex":2,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ad29850918fab29003201e7778bf84ea.png","name":"宅家好物","id":109255006,"frontDesc":"文具玩具 成长好礼","type":0,"subCateList":[],"frontName":"文具玩具 成长好礼"},{"categoryType":0,"showIndex":3,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9dacf066ccf643c91b64cf93dfb9dfb5.png","name":"初春换新","id":1037005,"frontDesc":"服配居家 等你来挑","type":0,"subCateList":[],"frontName":"服配居家 等你来挑"},{"categoryType":0,"showIndex":4,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e16890ca1f2e296261025a896d5c16e0.png","name":"尾货秒杀","id":1034001,"frontDesc":"限量抢购 抄底折扣","type":0,"subCateList":[],"frontName":"限量抢购 抄底折扣"},{"categoryType":0,"showIndex":5,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4da3ff593625177ec09a23228b338290.png","name":"秋日出游","id":109255007,"frontDesc":"秋高气爽 放心出行","type":0,"subCateList":[],"frontName":"秋高气爽 放心出行"},{"categoryType":0,"showIndex":6,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/5be2729ef9a10df2e201b3084b551ae8.png","name":"五折封顶","id":109255008,"frontDesc":"夏日抄底特惠专区","type":0,"subCateList":[],"frontName":"夏日抄底特惠专区"},{"categoryType":0,"showIndex":7,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f3d5a10fbd65c58e0bb54d6e569597f2.png","name":"新手妈妈指南","id":109255009,"frontDesc":"新妈妈装备 一站购全","type":0,"subCateList":[],"frontName":"新妈妈装备 一站购全"},{"categoryType":0,"showIndex":8,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0e94a5a01e13752b6c5d75e13e3b1283.png","name":"卫衣/毛衫","id":1091003,"frontDesc":"舒适穿搭 精彩童年","type":0,"subCateList":[],"frontName":"舒适穿搭 精彩童年"},{"categoryType":0,"showIndex":9,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/24244fafbbde8f6e6215647a03ebbc7c.png","name":"T恤/polo/衬衫","id":1020003,"frontDesc":"必备上衣 百搭精选","type":0,"subCateList":[],"frontName":"必备上衣 百搭精选"},{"categoryType":0,"showIndex":10,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/60a70b35a24ad07449c763a6f2d16434.png","name":"外套/套装","id":109243018,"frontDesc":"甄选衣橱 陪伴左右","type":0,"subCateList":[],"frontName":"甄选衣橱 陪伴左右"},{"categoryType":0,"showIndex":11,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8ae80697a24aefe4069f1066ebe142fc.png","name":"裤子/裙装","id":109243019,"frontDesc":"实用下装 方便活动","type":0,"subCateList":[],"frontName":"实用下装 方便活动"},{"categoryType":0,"showIndex":12,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cfbe20d66ea16903d786d5a19976d5d0.png","name":"裙装","id":109243020,"frontDesc":"气质裙装 优雅大方","type":0,"subCateList":[],"frontName":"气质裙装 优雅大方"},{"categoryType":0,"showIndex":13,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6df0eecd6458ca390b1cfefeb910f33b.png","name":"连体衣/礼盒","id":109243021,"frontDesc":"A类无荧光 给宝宝更好的","type":0,"subCateList":[],"frontName":"A类无荧光 给宝宝更好的"},{"categoryType":0,"showIndex":14,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/772eb195bae088cb2c3bef9987ae75b9.png","name":"内衣/配搭","id":1089001,"frontDesc":"孩子衣橱里的配搭好物","type":0,"subCateList":[],"frontName":"孩子衣橱里的配搭好物"},{"categoryType":0,"showIndex":15,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/514726ef6c2ec1d0bd377a903666e9da.png","name":"儿童鞋","id":1037006,"frontDesc":"活力鞋品 孩子必备","type":0,"subCateList":[],"frontName":"活力鞋品 孩子必备"},{"categoryType":0,"showIndex":16,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cee62d001b384e8f16ba290d37c04e10.png","name":"学步鞋","id":109243022,"frontDesc":"宝宝学步 专业科学","type":0,"subCateList":[],"frontName":"宝宝学步 专业科学"},{"categoryType":0,"showIndex":17,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a1a521de2a5708b3c3f4a93471346f58.png","name":"尿裤纸品","id":109255004,"frontDesc":"呵护宝宝的每寸肌肤","type":0,"subCateList":[],"frontName":"呵护宝宝的每寸肌肤"},{"categoryType":0,"showIndex":18,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b0ae93ae9133420fb688c193462eeabc.png","name":"洗护","id":1020004,"frontDesc":"天然专业 呵护宝宝肌","type":0,"subCateList":[],"frontName":"天然专业 呵护宝宝肌"},{"categoryType":0,"showIndex":19,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/eb8c8e70f88d8cb4866a811a34badb51.png","name":"喂养","id":1020007,"frontDesc":"宝宝吃得香 妈妈才放心","type":0,"subCateList":[],"frontName":"宝宝吃得香 妈妈才放心"},{"categoryType":0,"showIndex":20,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4843c411dec12e6873dc8d6ff0b4b3b1.png","name":"儿童家具收纳","id":109206012,"frontDesc":"有你才有家 成长快乐窝","type":0,"subCateList":[],"frontName":"有你才有家 成长快乐窝"},{"categoryType":0,"showIndex":21,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cea5a4dcff63ff83c1f34ca576ccb8d9.png","name":"婴童被枕芯类","id":1020005,"frontDesc":"甄选贴肤材质 宝宝舒眠甜梦","type":0,"subCateList":[],"frontName":"甄选贴肤材质 宝宝舒眠甜梦"},{"categoryType":0,"showIndex":22,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c230d5a5edf629bd921ee37dabb5cb03.png","name":"婴童床品套件","id":109245001,"frontDesc":"甄选天然面料 亲肤透气","type":0,"subCateList":[],"frontName":"甄选天然面料 亲肤透气"},{"categoryType":0,"showIndex":23,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/126545cd9cd34dc4e63b815e83ec4a06.png","name":"抱被睡袋","id":109245002,"frontDesc":"贴心设计 好眠助成长","type":0,"subCateList":[],"frontName":"贴心设计 好眠助成长"},{"categoryType":0,"showIndex":24,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9556bfa01dde5eb46cf56a0bbc3c6461.png","name":"推车/安全座椅","id":109243027,"frontDesc":"安全严苛标准 溜娃神器","type":0,"subCateList":[],"frontName":"安全严苛标准 溜娃神器"},{"categoryType":0,"showIndex":25,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/064b9f83a29735b3c6517f6c6be35d47.png","name":"童包/雨具","id":109206013,"frontDesc":"出行必备包包雨具","type":0,"subCateList":[],"frontName":"出行必备包包雨具"},{"categoryType":0,"showIndex":26,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e5ae3db7c2819731768ac50b2ff04d64.png","name":"玩具","id":1020006,"frontDesc":"益智趣味 在玩乐中学习","type":0,"subCateList":[],"frontName":"益智趣味 在玩乐中学习"},{"categoryType":0,"showIndex":27,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/76a23e423710c88ac1070aed906580b2.png","name":"文具","id":1089000,"frontDesc":"本册纸笔 翻译利器","type":0,"subCateList":[],"frontName":"本册纸笔 翻译利器"},{"categoryType":0,"showIndex":28,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/628b0985bf900d543c3aad06d1f40c46.png","name":"图书","id":109243023,"frontDesc":"开拓视野 亲子共读","type":0,"subCateList":[],"frontName":"开拓视野 亲子共读"},{"showIndex":29,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2d96684c2b2dc89df9a001235abd0a6d.png","bannerUrl":"","frontDesc":"妈咪贴身衣物 承诺无荧光剂","type":0,"frontName":"妈咪贴身衣物 承诺无荧光剂","categoryType":0,"superCategoryId":1011000,"name":"孕妈服饰","iconUrl":"","id":1011001,"subCateList":[]},{"categoryType":0,"showIndex":30,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8ab1afb09ce988aef93263280e2c2097.png","name":"妈咪用品","id":109206015,"frontDesc":"新手妈妈 必备用品","type":0,"subCateList":[],"frontName":"新手妈妈 必备用品"},{"categoryType":0,"showIndex":31,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9b7bb9df09836b1cb7e46f9fefb1b2c0.png","name":"孕妈装","id":109206014,"frontDesc":"时尚大方 安全无荧光剂","type":0,"subCateList":[],"frontName":"时尚大方 安全无荧光剂"},{"categoryType":0,"showIndex":32,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b51b268801f04b6f9210967a0136e0bb.png","name":"安全座椅","id":109243026,"frontDesc":"比安全更周全 专业安全","type":0,"subCateList":[],"frontName":"比安全更周全 专业安全"},{"categoryType":0,"showIndex":33,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/7a347426bb41f4e5221001855dcbc65c.png","name":"毛巾口水巾","id":109206011,"frontDesc":"婴童高标准毛巾","type":0,"subCateList":[],"frontName":"婴童高标准毛巾"},{"categoryType":0,"showIndex":34,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c6557651e50d82d7d9f8184f8a0e955b.png","name":"儿童雨具/泳具","id":109255005,"frontDesc":"趣味玩水 放肆一夏","type":0,"subCateList":[],"frontName":"趣味玩水 放肆一夏"},{"categoryType":0,"showIndex":35,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1f93797e2f77cb0e0ac3c153183d2697.png","name":"防走丢包","id":109243024,"frontDesc":"防护牵引 安全出行","type":0,"subCateList":[],"frontName":"防护牵引 安全出行"},{"categoryType":0,"showIndex":36,"superCategoryId":1011000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/34f22f5e50082da73d91e07794a9afea.png","name":"其它箱包","id":109243025,"frontDesc":"休闲实用 出游必备","type":0,"subCateList":[],"frontName":"休闲实用 出游必备"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/36929e72018bce053af17a80a262c4bb.jpg?type=webp&imageView&quality=75&thumbnail=750x0","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"运动旅行","id":109243029,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ba81ce10c1e0fab23d010736d65ba0a7.jpg","name":"Yessing","id":109256006,"frontDesc":"穿出你的个性态度","type":0,"subCateList":[],"frontName":"穿出你的个性态度"},{"categoryType":0,"showIndex":1,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/87e3129e372b7ebf73767f10be8a15a2.png","name":"男式运动","id":1020010,"frontDesc":"细节讲究 合身剪裁不束缚","type":0,"subCateList":[],"frontName":"细节讲究 合身剪裁不束缚"},{"categoryType":0,"showIndex":3,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/18d5a7a3ed8b3731d4e37394a37a6dd3.png","name":"健身系列","id":109254039,"frontDesc":"静体静心 养生健体","type":0,"subCateList":[],"frontName":"静体静心 养生健体"},{"categoryType":0,"showIndex":4,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2e8953d954d410a2ae2c9321651b85f1.png","name":"出行好物","id":109254040,"frontDesc":"出行好物 贴心相伴","type":0,"subCateList":[],"frontName":"出行好物 贴心相伴"},{"categoryType":0,"showIndex":5,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c2871979efcc7ed2d40bc569c7fe70a2.png","name":"男式运动外套/卫衣","id":109254042,"frontDesc":"运动工作自由切换","type":0,"subCateList":[],"frontName":"运动工作自由切换"},{"categoryType":0,"showIndex":6,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/23cbe4d7d1e3e23d4cc097a67f57b6f9.png","name":"男式运动裤装","id":109254043,"frontDesc":"运动中 让双腿更自如","type":0,"subCateList":[],"frontName":"运动中 让双腿更自如"},{"categoryType":0,"showIndex":7,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/26f8b210ff0dba32cee3e2f374c47e9b.png","name":"男式户外服装","id":109254044,"frontDesc":"防风防水 户外防晒","type":0,"subCateList":[],"frontName":"防风防水 户外防晒"},{"categoryType":0,"showIndex":8,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0ccd33322fda8fc8ad7ccc61b1207afa.png","name":"男式运动T恤","id":109254041,"frontDesc":"经典款式 运动通勤皆可","type":0,"subCateList":[],"frontName":"经典款式 运动通勤皆可"},{"categoryType":0,"showIndex":11,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dae55f67c05dd3a544c68aaf91e2d2bd.png","name":"女式运动外套/卫衣","id":109254047,"frontDesc":"运动工作自由切换","type":0,"subCateList":[],"frontName":"运动工作自由切换"},{"categoryType":0,"showIndex":12,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3715a4db6b8449843105cd819c1b4fb3.png","name":"女式运动裤装","id":109254048,"frontDesc":"运动中 让双腿更自如","type":0,"subCateList":[],"frontName":"运动中 让双腿更自如"},{"categoryType":0,"showIndex":13,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a49e9afcf7d91826cbaa86c04c94e94d.png","name":"女式户外服装","id":109254049,"frontDesc":"防风防水 户外防晒","type":0,"subCateList":[],"frontName":"防风防水 户外防晒"},{"categoryType":0,"showIndex":14,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/639008fcca7a3a4ecc9ce5cf9e28506e.png","name":"女式运动T恤","id":109254045,"frontDesc":"经典款式 运动通勤皆可","type":0,"subCateList":[],"frontName":"经典款式 运动通勤皆可"},{"categoryType":0,"showIndex":14,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/20c2a3b3b7b1795954c58d8088e6d05e.png","name":"女式运动","id":1035002,"frontDesc":"高质感面料","type":0,"subCateList":[],"frontName":"高质感面料"},{"categoryType":0,"showIndex":15,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f2ccaf4abc6ecf8dca27b50602a61f6a.png","name":"女式运动内衣/泳装","id":109254046,"frontDesc":"运动承托 保护胸部","type":0,"subCateList":[],"frontName":"运动承托 保护胸部"},{"categoryType":0,"showIndex":15,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a1a82637fc8e1ab9eafdd7ae3eec4d4f.png","name":"男式运动下装","id":1015001,"frontDesc":"立体裁剪，专为国人打造","type":0,"subCateList":[],"frontName":"自在而潇洒的穿着感"},{"categoryType":0,"showIndex":16,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4088b6af21f8174909d62084848ef198.png","name":"女式运动下装","id":109214005,"frontDesc":"女士修身运动","type":0,"subCateList":[],"frontName":"女士修身运动"},{"categoryType":0,"showIndex":17,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4415c184ae39afbd59b5e34eed42ed4f.png","name":"男式户外","id":1078000,"frontDesc":"专业休闲运动风","type":0,"subCateList":[],"frontName":"运动休闲多场景任意切换"},{"categoryType":0,"showIndex":18,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9f820db8517536cd0fe2632955198722.png","bannerUrl":"","name":"女式户外","id":1010001,"frontDesc":"户外运动休闲运动","type":0,"subCateList":[],"frontName":"户外运动休闲运动"},{"categoryType":0,"showIndex":19,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/bc18133d4c92124c95c801f5c2582cd2.png","name":"男式运动鞋","id":109249011,"frontDesc":"热血潮流 畅快奔跑","type":0,"subCateList":[],"frontName":"热血潮流 畅快奔跑"},{"categoryType":0,"showIndex":20,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e2bf3f81c3d0916d2f7a14b6d44dcd56.png","name":"女式运动鞋","id":109249012,"frontDesc":"青春运动 轻便舒适","type":0,"subCateList":[],"frontName":"青春运动 轻便舒适"},{"categoryType":0,"showIndex":21,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/63e23cd56352d2cb3c835560e643bf9a.png","name":"旅行用品","id":1020000,"frontDesc":"便携设计 轻便旅途","type":0,"subCateList":[],"frontName":"出行小物 贴心相伴"},{"categoryType":0,"showIndex":22,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3c37a0b380fdcca237d64552db99cce0.png","name":"行李箱","id":109243030,"frontDesc":"带着梦想即刻出发","type":0,"subCateList":[],"frontName":"带着梦想即刻出发"},{"categoryType":0,"showIndex":23,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/cc5ff5a9d325a70b0693795644803d5d.png","name":"颈枕眼罩","id":109261036,"frontDesc":"多功能使用 舒适旅途","type":0,"subCateList":[],"frontName":"多功能使用 舒适旅途"},{"categoryType":0,"showIndex":24,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a97b4100cf9e753d1c51d8f38bdc3a38.png","name":"雨具","id":109261037,"frontDesc":"晴雨两用 随身出行","type":0,"subCateList":[],"frontName":"晴雨两用 随身出行"},{"categoryType":0,"showIndex":25,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b5950f5984ede4241d12ca14620c321a.png","name":"旅行收纳","id":109254051,"frontDesc":"整理你的旅行箱","type":0,"subCateList":[],"frontName":"整理你的旅行箱"},{"categoryType":0,"showIndex":26,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/01ceeee87efb0f66ee19d5b4a2c156e4.png","name":"出行用品","id":109254050,"frontDesc":"让旅途更轻松","type":0,"subCateList":[],"frontName":"让旅途更轻松"},{"categoryType":0,"showIndex":27,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c5550b962058846f3e7e45b137d1ca5f.png","name":"露营野餐","id":109243031,"frontDesc":"趣味露营 享受户外","type":0,"subCateList":[],"frontName":"趣味露营 享受户外"},{"categoryType":0,"showIndex":28,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f821a3c1d8894e89a72d396a19890810.png","name":"徒步登山","id":109261038,"frontDesc":"户外行走 探索无限","type":0,"subCateList":[],"frontName":"户外行走 探索无限"},{"categoryType":0,"showIndex":29,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b91545cb45289cc89e0bcc1a006621b9.png","name":"健身器械","id":109254052,"frontDesc":"打造自己的健身房","type":0,"subCateList":[],"frontName":"打造自己的健身房"},{"categoryType":0,"showIndex":30,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/84464237e022135f1e5e5e1c1c4f9f84.png","name":"按摩护具","id":109243033,"frontDesc":"运动防护 无惧伤害","type":0,"subCateList":[],"frontName":"运动防护 无惧伤害"},{"categoryType":0,"showIndex":31,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0ffac069b042edf1bf24090face6a4bb.png","name":"瑜伽美体","id":109261040,"frontDesc":"静体静心 养生健体","type":0,"subCateList":[],"frontName":"静体静心 养生健体"},{"categoryType":0,"showIndex":32,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2c2f4c3457c2c3c94567cd97157f43c2.png","name":"运动配件","id":109243032,"frontDesc":"运动伴侣 助力训练","type":0,"subCateList":[],"frontName":"运动伴侣 助力训练"},{"categoryType":0,"showIndex":32,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/f2bec10d8188a4980f0d5bab26ffa201.png","name":"游泳装备","id":109261041,"frontDesc":"自由泳者","type":0,"subCateList":[],"frontName":"自由泳者"},{"categoryType":0,"showIndex":32,"superCategoryId":109243029,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/12aef6f81b524bd1e9d5aa051266ca65.png","name":"球类运动","id":109261042,"frontDesc":"运动随心","type":0,"subCateList":[],"frontName":"运动随心"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/3d4fbbc11172e79e3842671c447daea9.jpg?type=webp&imageView&quality=75&thumbnail=750x0","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"数码家电","id":1043000,"type":0,"subCateList":[{"categoryType":0,"showIndex":1,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/00bc575e28c69cd85e59ec39adcb5de6.png","name":"当季热销","id":109255020,"frontDesc":"消毒抑菌/除湿烘干/清洁除螨","type":0,"subCateList":[],"frontName":"消毒抑菌/除湿烘干/清洁除螨"},{"categoryType":0,"showIndex":2,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d2ac4fa7cf365849707e378f15e7d6e3.png","name":"新品首发","id":109255021,"frontDesc":"率先掌握上新资讯","type":0,"subCateList":[],"frontName":"率先掌握上新资讯"},{"categoryType":0,"showIndex":3,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1ca73b12b6338a54421add710d406364.png","name":"甄选爆款","id":109255019,"frontDesc":"严选用户高好评爆款","type":0,"subCateList":[],"frontName":"严选用户高好评爆款"},{"categoryType":0,"showIndex":4,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/61d16210f6dfff72668ff425b79c7190.png","name":"身体护理","id":109249010,"frontDesc":"爱护身体，方寸间蕴出肌肤之美","type":0,"subCateList":[],"frontName":"爱护身体，方寸间蕴出肌肤之美"},{"categoryType":0,"showIndex":5,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e6c44e8dd451090b324fe127e3e8616d.png","name":"口腔护理","id":109249005,"frontDesc":"清新口气，健康牙齿","type":0,"subCateList":[],"frontName":"清新口气，健康牙齿"},{"categoryType":0,"showIndex":6,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/2de6707340d511031a3fcb3d98ae770d.png","name":"面部护理","id":109249006,"frontDesc":"美容护肤，让你闪耀脱颖而出","type":0,"subCateList":[],"frontName":"美容护肤，让你闪耀脱颖而出"},{"categoryType":0,"showIndex":7,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/117270efbbb5f5520dbc609dda5d5b44.png","name":"头发护理","id":109249007,"frontDesc":"头发亮泽光彩，随心造型","type":0,"subCateList":[],"frontName":"头发亮泽光彩，随心造型"},{"categoryType":0,"showIndex":8,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/8bdd8292aae3861f52b5739174764d99.png","name":"两季电器","id":109249000,"frontDesc":"冬天温暖舒适，夏天清凉舒爽","type":0,"subCateList":[],"frontName":"冬天温暖舒适，夏天清凉舒爽"},{"categoryType":0,"showIndex":9,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c650bffea04dd2749d04d9f63edae464.png","name":"清洁电器","id":109249002,"frontDesc":"清洁好助手，每天都像住新家","type":0,"subCateList":[],"frontName":"清洁好助手，每天都像住新家"},{"categoryType":0,"showIndex":10,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b0e72093d1d047bbd0de7b3160b1506c.png","name":"衣物护理","id":109249001,"frontDesc":"焕然一新，陶醉在衣物的平顺里","type":0,"subCateList":[],"frontName":"焕然一新，陶醉在衣物的平顺里"},{"categoryType":0,"showIndex":11,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0427066bea93d5639f1ba79672ab846b.png","name":"空气调节","id":109249003,"frontDesc":"除湿/加湿/净化，空气焕然一新","type":0,"subCateList":[],"frontName":"除湿/加湿/净化，空气焕然一新"},{"categoryType":0,"showIndex":12,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/591fe5284130069a3e408517443a78dd.png","name":"厨房电器","id":1023000,"frontDesc":"囿于厨房与爱，准备丰富大餐","type":0,"subCateList":[],"frontName":"囿于厨房与爱，准备丰富大餐"},{"categoryType":0,"showIndex":13,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0a563ba0f5e2c9e75031f5f160aee9ae.png","name":"按摩器","id":109249009,"frontDesc":"你的专属按摩大师","type":0,"subCateList":[],"frontName":"你的专属按摩大师"},{"categoryType":0,"showIndex":14,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e05ec7535fb083138a4afb683c63b45b.png","name":"按摩椅","id":109249004,"frontDesc":"仿真人手按摩，享受全方位放松","type":0,"subCateList":[],"frontName":"仿真人手按摩，享受全方位放松"},{"categoryType":0,"showIndex":15,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/32481c037b206627d500daf078087ad7.png","name":"智能家居","id":109249008,"frontDesc":"智能升级家居，提升生活幸福感","type":0,"subCateList":[],"frontName":"智能升级家居，提升生活幸福感"},{"categoryType":0,"showIndex":16,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/590c1c397c52cee5cc0d13c5ccd3dc34.png","name":"智能出行","id":109255018,"frontDesc":"出行黑科技，陪你探索有趣的世界","type":0,"subCateList":[],"frontName":"出行黑科技，陪你探索有趣的世界"},{"categoryType":0,"showIndex":17,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/47e953a95e4378907b131205ce3cbc45.png","name":"3C数码","id":1022000,"frontDesc":"专为职场精英和学生设计","type":0,"subCateList":[],"frontName":"专为职场精英和学生设计"},{"categoryType":0,"showIndex":18,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/620d2c977da93f5130eb5aed639850a0.png","name":"手机配件","id":109243035,"frontDesc":"高颜值配件，武装随身装备","type":0,"subCateList":[],"frontName":"高颜值配件，武装随身装备"},{"categoryType":0,"showIndex":19,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/09c8b36ba252b486eec081479606baa7.png","name":"车载用品","id":109243036,"frontDesc":"车载神器陪你跨过山和大海","type":0,"subCateList":[],"frontName":"车载神器陪你跨过山和大海"},{"showIndex":20,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9d635abb986bd40f217dba2ac67df7f2.png","bannerUrl":"https://yanxuan.nosdn.127.net/ea626506991f03f638dc32b72212e8a3.png","frontDesc":"找回书写的力量","type":0,"frontName":"找回书写的力量","categoryType":0,"superCategoryId":1043000,"name":"办公文具","iconUrl":"https://yanxuan.nosdn.127.net/8ccf1a360077d2a8e37d33cd6427801c.png","id":109243046,"subCateList":[]},{"showIndex":21,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a2170cc17ed18303f4f18949fea341b9.png","bannerUrl":"","frontDesc":"视听盛宴","type":0,"frontName":"视听盛宴","categoryType":0,"superCategoryId":1043000,"name":"影音娱乐","iconUrl":"","id":1008006,"subCateList":[]},{"categoryType":0,"showIndex":22,"superCategoryId":1043000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/77847b8066205331eb22c9c363e3740e.png","bannerUrl":"","name":"乐器","id":1028001,"frontDesc":"造乐，开启一段别具一格的音乐历程","type":0,"subCateList":[],"frontName":"造乐，开启一段别具一格的音乐历程"}]},{"categoryType":0,"imgUrl":"https://yanxuan.nosdn.127.net/fbdf6fb0eedb27d0adc33c5bc105b5f5.jpg?type=webp&imageView&quality=75&thumbnail=750x0","showIndex":0,"superCategoryId":0,"bannerUrl":"","name":"全球特色","id":1019000,"type":0,"subCateList":[{"showIndex":1,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/70ae2b665302d78224b2e209d32f6454.jpg","bannerUrl":"https://yanxuan.nosdn.127.net/3437871ce35a1bb291d461f15a7e2beb.jpg","frontDesc":"健康身体 全球守护","type":0,"frontName":"健康身体 全球守护","categoryType":0,"superCategoryId":1019000,"name":"全球防护","iconUrl":"https://yanxuan.nosdn.127.net/85f8d354cf9c41cf1855685ae2cb9a22.jpg","id":109268001,"subCateList":[]},{"categoryType":0,"showIndex":2,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9b809562dfee86bab55e49638fc0bd92.png","name":"当季星品","id":109254027,"frontDesc":"秋冬暖心 全球好物","type":0,"subCateList":[],"frontName":"秋冬暖心 全球好物"},{"categoryType":0,"showIndex":3,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d49727b5068e5d07ef12121131ba57f1.png","name":"好评推荐","id":109245000,"frontDesc":"口碑爆款 无限回购","type":0,"subCateList":[],"frontName":"口碑爆款 无限回购"},{"categoryType":0,"showIndex":4,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e98025a8dc0578fce04a78f19b29b5f7.png","name":"礼品点卡","id":1025000,"frontDesc":"严选礼品卡/话费充值/游戏点卡","type":0,"subCateList":[],"frontName":"严选礼品卡/话费充值/游戏点卡"},{"showIndex":5,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3294b591e402e50a859499bf343190cc.png","bannerUrl":"https://yanxuan.nosdn.127.net/e25f623df42af8929ffbc6a8abd2134c.png","frontDesc":"地方特色，匠心独运","type":0,"frontName":"地方特色，匠心独运","categoryType":0,"superCategoryId":1019000,"name":"特色手工艺","iconUrl":"https://yanxuan.nosdn.127.net/c06bf9ac1b93ddaa98091661993b72a9.png","id":109270000,"subCateList":[]},{"categoryType":0,"showIndex":6,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ef0e7cea476170bf5ea27e5fbfaaf063.png","name":"床品家纺","id":109256014,"frontDesc":"产地原料 家居推荐","type":0,"subCateList":[],"frontName":"产地原料 家居推荐"},{"categoryType":0,"showIndex":7,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/efc1a0fa662f5e199c578d24b8b39281.png","name":"餐厨用品","id":109256015,"frontDesc":"匠心名品 艺术烹饪","type":0,"subCateList":[],"frontName":"匠心名品 艺术烹饪"},{"categoryType":0,"showIndex":8,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/6cc34e3f44e2da140a2aca023d2dc61b.png","name":"日用百货","id":109256016,"frontDesc":"品质生活 悦享升级","type":0,"subCateList":[],"frontName":"品质生活 悦享升级"},{"categoryType":0,"showIndex":9,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a131ac5e43cba3d03481221d9e258531.png","name":"美妆个护","id":109256017,"frontDesc":"口碑精选 焕醒美肌","type":0,"subCateList":[],"frontName":"口碑精选 焕醒美肌"},{"categoryType":0,"showIndex":10,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/492c8129ea3933ba389b8cc5a2be78b9.png","name":"口腔护理","id":109256018,"frontDesc":"健康口腔 璀璨笑容","type":0,"subCateList":[],"frontName":"健康口腔 璀璨笑容"},{"categoryType":0,"showIndex":11,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/079e00fe5f2100c8e2e80d8f28677656.png","name":"家清卫浴","id":109256019,"frontDesc":"专业高效清洁","type":0,"subCateList":[],"frontName":"专业高效清洁"},{"categoryType":0,"showIndex":12,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4a00b88682ab9646c1a598914dfb6800.png","name":"休闲美食","id":109256021,"frontDesc":"足不出户 食遍全球","type":0,"subCateList":[],"frontName":"足不出户 食遍全球"},{"categoryType":0,"showIndex":13,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3f482ed16162d2e14090802ca3aa8997.png","name":"营养保健","id":109256020,"frontDesc":"营养健康 保健佳品","type":0,"subCateList":[],"frontName":"营养健康 保健佳品"},{"categoryType":0,"showIndex":14,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/46d8b6bda0dfd1bb0a6d8ea15b5e51fc.png","name":"高级珠宝","id":109256022,"frontDesc":"璀璨闪耀 品质甄选","type":0,"subCateList":[],"frontName":"璀璨闪耀 品质甄选"},{"categoryType":0,"showIndex":15,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1e24297816459c8a3b2d2fb568180695.png","name":"时尚配搭","id":109256023,"frontDesc":"潮流设计 彰显品味","type":0,"subCateList":[],"frontName":"潮流设计 彰显品味"},{"categoryType":0,"showIndex":16,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/c39ff69de9baf07222994196d007c335.png","name":"日韩馆","id":1065001,"frontDesc":"日韩制造生活好物","type":0,"subCateList":[],"frontName":"日韩制造生活好物"},{"categoryType":0,"showIndex":17,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/abc716169323f1b7ec9b11f243a1c742.png","name":"东南亚馆","id":1065005,"frontDesc":"东南亚特色好物","type":0,"subCateList":[],"frontName":"东南亚特色好物"},{"categoryType":0,"showIndex":18,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b8e0d041ccff6967364311588f3ef2e1.png","name":"欧美馆","id":1065004,"frontDesc":"欧美制造好物","type":0,"subCateList":[],"frontName":"欧美制造好物"},{"categoryType":0,"showIndex":19,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/06ce9b7401d93bca1869d68adb6e7a61.png","name":"澳新馆","id":1065002,"frontDesc":"澳大利亚、新西兰制造天然好物","type":0,"subCateList":[],"frontName":"澳大利亚、新西兰制造天然好物"},{"showIndex":20,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/750465c2faa5391c217601550563babc.png","bannerUrl":"https://yanxuan.nosdn.127.net/b79c71f0a896c8b650e95500644ef1e9.png","frontDesc":"8地特色，助力扶贫","type":0,"frontName":"8地特色，助力扶贫","categoryType":0,"superCategoryId":1019000,"name":"乡间好物","iconUrl":"https://yanxuan.nosdn.127.net/6f1d81d5cb39310cab92ef97891460e0.png","id":109270001,"subCateList":[]},{"categoryType":0,"showIndex":21,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/11f3825726d6ba6cf683ab529a351902.png","name":"春风馆","id":1065007,"frontDesc":"网易原创情趣品牌，专为亚洲年轻人设计","type":0,"subCateList":[],"frontName":"网易原创情趣品牌，专为亚洲年轻人设计"},{"categoryType":0,"showIndex":22,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/3835a4198a9955b6047a44998b92dc6c.png","name":"味央馆","id":1065008,"frontDesc":"网易味央精品黑猪肉","type":0,"subCateList":[],"frontName":"网易味央精品黑猪肉"},{"categoryType":0,"showIndex":23,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0fc461daa1fe3a479a2d745141ebe45b.png","name":"Yessing馆","id":109202001,"frontDesc":"Yessing品牌馆，衣生元气","type":0,"subCateList":[],"frontName":"Yessing品牌馆，衣生元气"},{"categoryType":0,"showIndex":24,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/0203a26ab1b38a3a0841eb97d93fa4b5.png","name":"国风馆","id":1038001,"frontDesc":"发现东方美学","type":0,"subCateList":[],"frontName":"发现东方美学"},{"categoryType":0,"showIndex":25,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/915a6f1e93a0f422021325c48863b331.png","name":"东方草木馆","id":1047000,"frontDesc":"大师甄选天下好茶","type":0,"subCateList":[],"frontName":"大师甄选天下好茶"},{"categoryType":0,"showIndex":26,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ef13f4b0eb17ed2c5da7fe816900f7ec.png","name":"礼盒","id":109243037,"frontDesc":"馈赠佳品","type":0,"subCateList":[],"frontName":"馈赠佳品"},{"categoryType":0,"showIndex":27,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/75d351532c2e5cf03cc1c6b37caa6216.png","name":"话费点卡","id":1050000,"frontDesc":"给信仰充值","type":0,"subCateList":[],"frontName":"给信仰充值"},{"categoryType":0,"showIndex":28,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/9e8462ef0d9d8a132fe9d5429c0706a7.png","name":"黑胶/CD","id":109257024,"frontDesc":"乐享人生","type":0,"subCateList":[],"frontName":"乐享人生"},{"categoryType":0,"showIndex":29,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/26ee378c85e9bfc7f8c31dffac0117d2.png","name":"童书/育儿","id":109244000,"frontDesc":"为孩子严选好书","type":0,"subCateList":[],"frontName":"为孩子严选好书"},{"categoryType":0,"showIndex":30,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/d11985fe7852e9fe4fcfc281e2ee9e96.png","name":"文学/小说","id":109244001,"frontDesc":"君子不器","type":0,"subCateList":[],"frontName":"君子不器"},{"categoryType":0,"showIndex":31,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/40b88a59cc3d9769f054e2ce8f381e14.png","name":"生活/娱乐","id":109251000,"frontDesc":"把日子过成诗","type":0,"subCateList":[],"frontName":"把日子过成诗"},{"categoryType":0,"showIndex":32,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/30c9826ef1eb4a088270dcc59b2960b0.png","name":"人文/社科","id":109248000,"frontDesc":"遇见思想的火花","type":0,"subCateList":[],"frontName":"遇见思想的火花"},{"categoryType":0,"showIndex":33,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4ec4e12201baabc563a4a39ee856147b.png","name":"技能/成长","id":109252000,"frontDesc":"日益精进","type":0,"subCateList":[],"frontName":"日益精进"},{"categoryType":0,"showIndex":34,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/97ee8a9031cf562a746958347cc90787.png","name":"云音乐周边","id":1065009,"frontDesc":"网易云音乐周边发售","type":0,"subCateList":[],"frontName":"网易云音乐周边发售"},{"categoryType":0,"showIndex":35,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e70587ace9f936e45198514ff8074e8d.png","name":"暴雪周边","id":1066000,"frontDesc":"暴雪周边商品发售","type":0,"subCateList":[],"frontName":"暴雪周边商品发售"},{"categoryType":0,"showIndex":36,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/98f700a137c2f8e63e5e8b8261e2030e.png","name":"我的世界","id":1041001,"frontDesc":"我的世界游戏周边","type":0,"subCateList":[],"frontName":"我的世界游戏周边"},{"categoryType":0,"showIndex":37,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b011aba7843fe35523cd084f02de4d2f.png","name":"梦幻西游","id":1033000,"frontDesc":"梦幻西游精品周边","type":0,"subCateList":[],"frontName":"梦幻西游精品周边"},{"categoryType":0,"showIndex":38,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/4615c4af82fb22d5e31cb41249982ea8.png","name":"大话西游","id":1036004,"frontDesc":"大话西游正版周边","type":0,"subCateList":[],"frontName":"大话西游正版周边"},{"categoryType":0,"showIndex":39,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/64196ac59c60923bb4023c8881376ef2.png","name":"阴阳师","id":1039000,"frontDesc":"快到寮里来","type":0,"subCateList":[],"frontName":"欧气，快到寮里来"},{"categoryType":0,"showIndex":40,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/dc5ea3f67a9312a19d685d85aae68474.png","name":"游戏印象","id":1018000,"frontDesc":"网易多款经典游戏周边","type":0,"subCateList":[],"frontName":"网易多款经典游戏周边"},{"categoryType":0,"showIndex":41,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a09ba4fc348225a055a7a3c82e05e49b.png","name":"文创周边","id":1032001,"frontDesc":"大英博物馆等文创周边","type":0,"subCateList":[],"frontName":"大英博物馆等文创周边"},{"categoryType":0,"showIndex":42,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/b47bd562bedb8631c27e639da1e92b43.png","name":"影视周边","id":1069000,"frontDesc":"漫威、DC等影视周边","type":0,"subCateList":[],"frontName":"漫威、DC等影视周边"},{"categoryType":0,"showIndex":43,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/1785d77ba60a7b7f4d7641c702c3cf5f.png","name":"动漫电玩","id":1069001,"frontDesc":"初音、任天堂等动漫游戏周边","type":0,"subCateList":[],"frontName":"初音、任天堂等动漫游戏周边"},{"categoryType":0,"showIndex":44,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/ca7287d399e71f7e10a722fcfcb725b6.png","name":"严选推荐馆","id":1065010,"frontDesc":"严选推荐精品好物","type":0,"subCateList":[],"frontName":"严选推荐精品好物"},{"categoryType":0,"showIndex":45,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/e074795f61a83292d0f20eb7d124e2ac.png","bannerUrl":"","name":"文具","id":1012003,"frontDesc":"极简设计，环保材质","type":0,"subCateList":[],"frontName":"找回书写的力量"},{"categoryType":0,"showIndex":46,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a15c33fdefe11388b6f4ed5280919fdd.png","bannerUrl":"","name":"运动户外","id":1008005,"frontDesc":"踏青出游，便携不误好心情","type":0,"subCateList":[],"frontName":"MUJI、Nike等制造商出品"},{"categoryType":0,"showIndex":47,"superCategoryId":1019000,"level":"L2","wapBannerUrl":"https://yanxuan.nosdn.127.net/a1e185658914642b71a7d51170108195.png","name":"韩国馆","id":1065003,"frontDesc":"韩国制造精巧好物","type":0,"subCateList":[],"frontName":"韩国制造精巧好物"}]}];

/***/ }),

/***/ 25:
/*!*************************************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/common/datas/index.json ***!
  \*************************************************************************************/
/*! exports provided: tagList, bigPromotionModule, policyDescList, popularItemList, categoryHotSellModule, newItemList, freshmanFlag, flashSaleModule, focusList, sceneLightShoppingGuideModule, kingKongModule, indexActivityModule, default */
/***/ (function(module) {

module.exports = {"tagList":[{"floorPrice":39.9,"picUrl":"https://yanxuan.nosdn.127.net/133cf0d8a4e10ac8532cad89db0dd794.png","newOnShelf":false,"webIndexVerticalPicUrl":"https://yanxuan.nosdn.127.net/133cf0d8a4e10ac8532cad89db0dd794.png","extra":{"materialContentFrom":1,"materialName":"MUJI制造商","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":4,"materialType":"制造商id","crmUserGroupId":"0","materialId":"45272774","taskId":"54643334"},"simpleDesc":"严选精选了MUJI制造商和生产原料，\n用几乎零利润的价格，剔除品牌溢价，\n让用户享受原品牌的品质生活。","name":"MUJI制造商","appListPicUrl":"https://yanxuan.nosdn.127.net/3743ffe302c32e167fd65179ac109710.jpg","id":1001000},{"floorPrice":9.9,"picUrl":"https://yanxuan.nosdn.127.net/74e2ea8f81004d0a60f90fc8e4649058.png","newOnShelf":true,"webIndexVerticalPicUrl":"https://yanxuan.nosdn.127.net/74e2ea8f81004d0a60f90fc8e4649058.png","simpleDesc":"严选海外团队，寻访日韩欧美等十几个国家，\n从打样到成型，把关数十道工序，\n只为给您带来海外直供的超值好物。","name":"海外制造商","appListPicUrl":"https://yanxuan.nosdn.127.net/f474cbb97dc23e3a6af6255bc3baa7fc.jpg","id":1080000},{"floorPrice":29.9,"picUrl":"https://yanxuan.nosdn.127.net/c097be14110f769d58245cdad73e15c3.png","newOnShelf":false,"webIndexVerticalPicUrl":"https://yanxuan.nosdn.127.net/c097be14110f769d58245cdad73e15c3.png","simpleDesc":"严选寻访Calvin Klein品牌的制造商，\n深入世界领带第一生产地，设计与品质并重，\n致力于给消费者带来优质典雅的服饰用品。","name":"CK制造商","appListPicUrl":"https://yanxuan.nosdn.127.net/61f5523c9988ae6720da4c3c81a37386.jpg","id":1026000},{"floorPrice":169,"picUrl":"https://yanxuan.nosdn.127.net/66a23d776f41cba70d00803a5231124b.png","newOnShelf":false,"webIndexVerticalPicUrl":"https://yanxuan.nosdn.127.net/66a23d776f41cba70d00803a5231124b.png","simpleDesc":"严选为制作品质与颜值兼具的箱包，\n选定新秀丽、CK、Ricardo等品牌合作的制造商，\n拥有国内先进流水线20余条，实力保障品质。","name":"新秀丽制造商","appListPicUrl":"https://yanxuan.nosdn.127.net/42f994296d3393bcb4d54b7db13db5eb.png","id":1001037}],"bigPromotionModule":{"backgroundUrl":"","floorList":[{"layout":2,"cells":[{"subTitleColor":"","schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html","title":"","picUrl":"https://yanxuan.nosdn.127.net/5db28c137605ea7576c986e9c285e1c6.png","itemCnt":20,"itemFrom":1,"subTitle":"","titleColor":"","showPrice":true,"extra":{"resource":{"materialContentFrom":1,"materialName":"抗击疫情 舒适宅家","rcmdSort":false,"taskType":1,"itemFrom":2,"resourcesId":1,"materialType":"首页大促模块","schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html","crmUserGroupId":"0","materialId":"54640074","taskId":"54647396"},"abtest_dis":"0_0","modelType":1},"popupUrl":"","leftTime":0,"itemList":[{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/e272316176963bd54052126a7657bbb9.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=RXAYHzE1soqc&_iid=3538009","primarySkuPreSellPrice":0,"counterPrice":59,"id":3538009,"retailPrice":53},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/d57f7ed82ebb2b55bbd66e52b5996577.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=PH3zdX6FBYxM&_iid=1019000","primarySkuPreSellPrice":0,"counterPrice":99.9,"id":1019000,"retailPrice":99.9},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/38253e4bc864ded67fe49a34fcbf70b0.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=WPsstBil0Zdx&_iid=1327000","primarySkuPreSellPrice":0,"counterPrice":119,"id":1327000,"retailPrice":119},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/faaac4a8e885f65949e2752b7b4b286f.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=wBea8N7d8yen&_iid=1675063","primarySkuPreSellPrice":0,"counterPrice":29.9,"id":1675063,"retailPrice":29.9},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/b8d8fad9d32d9709be5bbeff5d0724a1.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=LKIiZJU4IE&_iid=1296000","primarySkuPreSellPrice":0,"counterPrice":9,"id":1296000,"retailPrice":9},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/ee68e4fe05aa55837e3d55e8b9ae85d6.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=fe9XWgSrqx0K&_iid=1586039","primarySkuPreSellPrice":0,"counterPrice":669,"id":1586039,"retailPrice":459},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/d361f2992d6c688b7480ef2397ecf3fe.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=1Opw4q8GTWKd&_iid=1486021","primarySkuPreSellPrice":0,"counterPrice":59,"id":1486021,"retailPrice":59},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/58b7b4a5277dddbfd9b99b07f38b6c20.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=BWut4BmB2xHp&_iid=1114010","primarySkuPreSellPrice":0,"counterPrice":19.9,"id":1114010,"retailPrice":19.9},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/ae8c3cda95b2a807d0b8518f7145eda4.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=yjnNkJCXQKWy&_iid=3815073","primarySkuPreSellPrice":0,"counterPrice":49,"id":3815073,"retailPrice":49},{"primarySkuPreSellStatus":0,"picUrl":"https://yanxuan-item.nosdn.127.net/0b43bd83a86fd132f39e7d76829ed78f.png","pieceUnitDesc":"件","pieceNum":0,"colorNum":0,"schemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html?_hid=gc0DysDFRU1T&_iid=3811049","primarySkuPreSellPrice":0,"counterPrice":19,"id":3811049,"retailPrice":19}],"id":"rb10rnjzwE30"}],"columnNum":1,"floorType":0,"style":1,"taskId":54647396,"height":360},{"layout":1,"cells":[{"subTitleColor":"","schemeUrl":"https://act.you.163.com/pub/L62FoIBG4A.html","title":"","picUrl":"https://yanxuan.nosdn.127.net/be539f8235a88cd06a43227aeaf4df02.gif","itemCnt":0,"itemFrom":1,"subTitle":"","titleColor":"","showPrice":false,"extra":{"resource":{"materialContentFrom":1,"materialName":"网易严选防疫物资预约","rcmdSort":false,"taskType":1,"itemFrom":1,"resourcesId":2,"materialType":"首页大促模块","schemeUrl":"https://act.you.163.com/pub/L62FoIBG4A.html","crmUserGroupId":"0","materialId":"54640116","taskId":"54647404"},"modelType":1},"popupUrl":"","leftTime":0,"itemList":[],"id":"L62FoIBG4A"}],"columnNum":1,"floorType":0,"style":4,"taskId":54647404,"height":240},{"layout":1,"cells":[{"subTitleColor":"","schemeUrl":"https://act.you.163.com/act/pub/HW3LkZ184cR5.html","title":"","picUrl":"https://yanxuan.nosdn.127.net/28244c6ae7ef78424ea5317a0d72dd6a.png","itemCnt":0,"itemFrom":1,"subTitle":"","titleColor":"","showPrice":false,"extra":{"resource":{"materialContentFrom":1,"materialName":"抗击疫情 吃喝到家 强健抵抗力","rcmdSort":true,"taskType":1,"itemFrom":1,"resourcesId":3,"materialType":"首页大促模块","schemeUrl":"https://act.you.163.com/act/pub/HW3LkZ184cR5.html","crmUserGroupId":"0","materialId":"54640104","taskId":"54647361"},"modelType":1},"popupUrl":"","leftTime":0,"itemList":[],"id":"HW3LkZ184cR5"},{"subTitleColor":"","schemeUrl":"https://you.163.com/topic/v1/pub/p2tDbYocHKd2.html","title":"","picUrl":"https://yanxuan.nosdn.127.net/15b56691109bba3adf6156fd44f14073.png","itemCnt":0,"itemFrom":1,"subTitle":"","titleColor":"","showPrice":false,"extra":{"resource":{"materialContentFrom":1,"materialName":"科学防护 用心生活","rcmdSort":true,"taskType":1,"itemFrom":1,"resourcesId":3,"materialType":"首页大促模块","schemeUrl":"https://you.163.com/topic/v1/pub/p2tDbYocHKd2.html","crmUserGroupId":"0","materialId":"54640104","taskId":"54647361"},"modelType":1},"popupUrl":"","leftTime":0,"itemList":[],"id":"p2tDbYocHKd2"}],"columnNum":2,"floorType":0,"style":1,"taskId":54647361,"height":279},{"layout":1,"cells":[{"subTitleColor":"","schemeUrl":"https://act.you.163.com/act/pub/KR5ebCKbCQtR.html","title":"","picUrl":"https://yanxuan.nosdn.127.net/83b35324b02e31aa202a12971fa7f8c3.png","itemCnt":0,"itemFrom":1,"subTitle":"","titleColor":"","showPrice":false,"extra":{"resource":{"materialContentFrom":1,"materialName":"宅家玩乐 消灭无聊","rcmdSort":true,"taskType":1,"itemFrom":1,"resourcesId":3,"materialType":"首页大促模块","schemeUrl":"https://act.you.163.com/act/pub/KR5ebCKbCQtR.html","crmUserGroupId":"0","materialId":"54640104","taskId":"54647361"},"modelType":1},"popupUrl":"","leftTime":0,"itemList":[],"id":"KR5ebCKbCQtR"},{"subTitleColor":"","schemeUrl":"https://you.163.com/topic/v1/pub/NOvLN2wFt7PX.html","title":"","picUrl":"https://yanxuan.nosdn.127.net/2c98b2002572ec4cd0824bc810d7d31f.png","itemCnt":0,"itemFrom":1,"subTitle":"","titleColor":"","showPrice":false,"extra":{"resource":{"materialContentFrom":1,"materialName":"抗击疫情 新品快报","rcmdSort":true,"taskType":1,"itemFrom":1,"resourcesId":3,"materialType":"首页大促模块","schemeUrl":"https://you.163.com/topic/v1/pub/NOvLN2wFt7PX.html","crmUserGroupId":"0","materialId":"54640104","taskId":"54647361"},"modelType":1},"popupUrl":"","leftTime":0,"itemList":[],"id":"NOvLN2wFt7PX"}],"columnNum":2,"floorType":0,"style":1,"taskId":54647361,"height":279}],"backgroundColor":"1674e3"},"policyDescList":[{"icon":"https://yanxuan.nosdn.127.net/a03dd909803b9ac032eba58b7253a2f6.png","schemeUrl":"","desc":"网易自营品牌"},{"icon":"https://yanxuan.nosdn.127.net/2d0402ffcd52b3ec3b07422681c42a89.png","schemeUrl":"","desc":"30天无忧退货"},{"icon":"https://yanxuan.nosdn.127.net/eb61ee48e8942dbd1784c9ee75ebe955.png","schemeUrl":"","desc":"48小时快速退款"}],"popularItemList":[],"categoryHotSellModule":{"titleTargetUrl":"","categoryList":[{"categorys":[{"picUrl":"https://yanxuan-item.nosdn.127.net/5ad3990d8d1ca731b56ee11d151facfd.png","itemPicBeanList":[{"itemId":3986451,"picUrl":"https://yanxuan-item.nosdn.127.net/5ad3990d8d1ca731b56ee11d151facfd.png"},{"itemId":3986451,"picUrl":"https://yanxuan-item.nosdn.127.net/5ad3990d8d1ca731b56ee11d151facfd.png"},{"itemId":3986451,"picUrl":"https://yanxuan-item.nosdn.127.net/5ad3990d8d1ca731b56ee11d151facfd.png"},{"itemId":3477011,"picUrl":"https://yanxuan-item.nosdn.127.net/3bd7a2e27f9ced5f72d9ce4c069c7326.png"},{"itemId":3477011,"picUrl":"https://yanxuan-item.nosdn.127.net/3bd7a2e27f9ced5f72d9ce4c069c7326.png"},{"itemId":1318002,"picUrl":"https://yanxuan-item.nosdn.127.net/644a27b8e168b8fe8e43ccaad934b24e.png"},{"itemId":3986451,"picUrl":"https://yanxuan-item.nosdn.127.net/5ad3990d8d1ca731b56ee11d151facfd.png"},{"itemId":3446012,"picUrl":"https://yanxuan-item.nosdn.127.net/d7393e6b604cd89022361c65b1b03183.png"},{"itemId":3446012,"picUrl":"https://yanxuan-item.nosdn.127.net/d7393e6b604cd89022361c65b1b03183.png"},{"itemId":3446012,"picUrl":"https://yanxuan-item.nosdn.127.net/d7393e6b604cd89022361c65b1b03183.png"},{"itemId":3446012,"picUrl":"https://yanxuan-item.nosdn.127.net/d7393e6b604cd89022361c65b1b03183.png"},{"itemId":1625008,"picUrl":"https://yanxuan-item.nosdn.127.net/c89c4c86c6cb31805bd537d8c772a231.png"},{"itemId":1625008,"picUrl":"https://yanxuan-item.nosdn.127.net/c89c4c86c6cb31805bd537d8c772a231.png"},{"itemId":1604016,"picUrl":"https://yanxuan-item.nosdn.127.net/74662d24f6d217b520178c5a6d031457.png"},{"itemId":1604016,"picUrl":"https://yanxuan-item.nosdn.127.net/74662d24f6d217b520178c5a6d031457.png"},{"itemId":1545016,"picUrl":"https://yanxuan-item.nosdn.127.net/6cdb3da46a4b95b36dea89d6d47d3bd9.png"},{"itemId":1545016,"picUrl":"https://yanxuan-item.nosdn.127.net/6cdb3da46a4b95b36dea89d6d47d3bd9.png"},{"itemId":1398016,"picUrl":"https://yanxuan-item.nosdn.127.net/9d581d4ec02cf86ff2a05cf81868f159.png"},{"itemId":1398016,"picUrl":"https://yanxuan-item.nosdn.127.net/9d581d4ec02cf86ff2a05cf81868f159.png"},{"itemId":1674003,"picUrl":"https://yanxuan-item.nosdn.127.net/e30375922143f7fad7465fb56bc5acd6.png"},{"itemId":1674003,"picUrl":"https://yanxuan-item.nosdn.127.net/e30375922143f7fad7465fb56bc5acd6.png"},{"itemId":1674003,"picUrl":"https://yanxuan-item.nosdn.127.net/e30375922143f7fad7465fb56bc5acd6.png"},{"itemId":3988892,"picUrl":"https://yanxuan-item.nosdn.127.net/d691b12d383ea93c2108a383e2b1d3cc.png"},{"itemId":1134066,"picUrl":"https://yanxuan-item.nosdn.127.net/1b8e4a484e128c28a050cd2bc0c64396.png"},{"itemId":1134066,"picUrl":"https://yanxuan-item.nosdn.127.net/1b8e4a484e128c28a050cd2bc0c64396.png"},{"itemId":1572030,"picUrl":"https://yanxuan-item.nosdn.127.net/a4c5c5c63d8e3595f15a95819b2cf758.png"},{"itemId":1572030,"picUrl":"https://yanxuan-item.nosdn.127.net/a4c5c5c63d8e3595f15a95819b2cf758.png"},{"itemId":1535011,"picUrl":"https://yanxuan-item.nosdn.127.net/e37656ecad9a2494f456e222fe7800a2.png"},{"itemId":1535011,"picUrl":"https://yanxuan-item.nosdn.127.net/e37656ecad9a2494f456e222fe7800a2.png"},{"itemId":3815073,"picUrl":"https://yanxuan-item.nosdn.127.net/ae8c3cda95b2a807d0b8518f7145eda4.png"},{"itemId":3815073,"picUrl":"https://yanxuan-item.nosdn.127.net/ae8c3cda95b2a807d0b8518f7145eda4.png"}],"categoryName":"热销榜","targetUrl":"https://m.you.163.com/item/saleRank","showPicUrl":"https://yanxuan-item.nosdn.127.net/5ad3990d8d1ca731b56ee11d151facfd.png","extra":{"operationResource":{"categoryName":"热销榜","itemIdList":["3986451","3986451","3986451","3477011","3477011","1318002","3986451","3446012","3446012","3446012","3446012","1625008","1625008","1604016","1604016","1545016","1545016","1398016","1398016","1674003","1674003","1674003","3988892","1134066","1134066","1572030","1572030","1535011","1535011","3815073","3815073"],"categoryId":"0"},"modelType":5}},{"picUrl":"https://yanxuan-item.nosdn.127.net/167a29187b6f8963c45da5a5eda02598.png","itemPicBeanList":[{"itemId":3988757,"picUrl":"https://yanxuan-item.nosdn.127.net/2057746c0f31ce6faf10ae5a1257a2ba.png"},{"itemId":3481285,"picUrl":"https://yanxuan-item.nosdn.127.net/167a29187b6f8963c45da5a5eda02598.png"},{"itemId":3986076,"picUrl":"https://yanxuan-item.nosdn.127.net/d1132e557a1c2f94673dde8e6c18e4a2.png"},{"itemId":1548001,"picUrl":"https://yanxuan-item.nosdn.127.net/bb9025c24057dfb89403055ac5b9f85c.png"},{"itemId":3987496,"picUrl":"https://yanxuan-item.nosdn.127.net/3e901ce30de874724aefaed030a2436a.png"},{"itemId":3986478,"picUrl":"https://yanxuan-item.nosdn.127.net/eb841bdf69fb606edb8426e9ec659d9f.png"},{"itemId":3987072,"picUrl":"https://yanxuan-item.nosdn.127.net/7436d376016c68bc7b0b20fd26ecddca.png"},{"itemId":3986078,"picUrl":"https://yanxuan-item.nosdn.127.net/1c46042c0d5621efe2f603b173d86cfd.png"},{"itemId":3889009,"picUrl":"https://yanxuan-item.nosdn.127.net/13ec8a8a5f53ce6ae749f7a4ecbea303.png"},{"itemId":3986610,"picUrl":"https://yanxuan-item.nosdn.127.net/db7da2d6bffbc494d4294a4c7f340803.png"},{"itemId":3835007,"picUrl":"https://yanxuan-item.nosdn.127.net/eea064c1198b70f1b80b86c4fc579141.png"},{"itemId":3987561,"picUrl":"https://yanxuan-item.nosdn.127.net/3aeaeca579722ec4bb3f20e9165e2843.png"},{"itemId":3440087,"picUrl":"https://yanxuan-item.nosdn.127.net/41f9f2b2fdf811df27a2b2a115151264.png"},{"itemId":3814061,"picUrl":"https://yanxuan-item.nosdn.127.net/bd1402ac25aaa08776e3333aa89a76e2.png"},{"itemId":3986593,"picUrl":"https://yanxuan-item.nosdn.127.net/1a958527eed0524c9967832bba80266c.png"},{"itemId":3829004,"picUrl":"https://yanxuan-item.nosdn.127.net/f0fb8d25330a9287c4ceed84d1054f1b.png"},{"itemId":3440174,"picUrl":"https://yanxuan-item.nosdn.127.net/ef76f6daebdc9144e16805a256733204.png"},{"itemId":3841017,"picUrl":"https://yanxuan-item.nosdn.127.net/0eaa052d6e85e569a22c84b8ceabf53c.png"},{"itemId":3842002,"picUrl":"https://yanxuan-item.nosdn.127.net/ed97bc1603a6cee30ec37be1f18de066.png"},{"itemId":3887003,"picUrl":"https://yanxuan-item.nosdn.127.net/1a57efba2c5a84b9c1863f1568f5aa3b.png"},{"itemId":3837000,"picUrl":"https://yanxuan-item.nosdn.127.net/93626f99e2ada07262dc927d825f6bf4.png"},{"itemId":3986873,"picUrl":"https://yanxuan-item.nosdn.127.net/c8f29bf1b565722b3e41f1b78a737a78.png"},{"itemId":3452065,"picUrl":"https://yanxuan-item.nosdn.127.net/50b8f1872bbecfebdad2e685cb2bbf9b.png"},{"itemId":3879027,"picUrl":"https://yanxuan-item.nosdn.127.net/23092082bbd97d6254d0771f2108ec6b.png"},{"itemId":3826045,"picUrl":"https://yanxuan-item.nosdn.127.net/e41b15e64ce3aaf2c98bc772ddac0717.png"},{"itemId":3876015,"picUrl":"https://yanxuan-item.nosdn.127.net/169dc00563839b9608ff7adad30554a6.png"},{"itemId":1649004,"picUrl":"https://yanxuan-item.nosdn.127.net/8224171cf2701207ed8f2c2f2b36aa90.png"},{"itemId":3509074,"picUrl":"https://yanxuan-item.nosdn.127.net/1adac0418956931d445e1f6e8dba08f1.png"},{"itemId":1666047,"picUrl":"https://yanxuan-item.nosdn.127.net/cd25ed880fd5b55dd19444a1cc2e0549.png"},{"itemId":1296000,"picUrl":"https://yanxuan-item.nosdn.127.net/b8d8fad9d32d9709be5bbeff5d0724a1.png"},{"itemId":1636013,"picUrl":"https://yanxuan-item.nosdn.127.net/7f76d9225c0fe72da5e4d9f0fc7e2792.png"}],"categoryName":"好评榜","targetUrl":"https://m.you.163.com/item/praiseRank","showPicUrl":"https://yanxuan-item.nosdn.127.net/167a29187b6f8963c45da5a5eda02598.png","extra":{"operationResource":{"categoryName":"好评榜","itemIdList":["3988757","3481285","3986076","1548001","3987496","3986478","3987072","3986078","3889009","3986610","3835007","3987561","3440087","3814061","3986593","3829004","3440174","3841017","3842002","3887003","3837000","3986873","3452065","3879027","3826045","3876015","1649004","3509074","1666047","1296000","1636013"],"categoryId":"0"},"modelType":5}}]},{"categorys":[{"picUrl":"https://yanxuan-item.nosdn.127.net/3bd7a2e27f9ced5f72d9ce4c069c7326.png","itemPicBeanList":[{"itemId":3477011,"picUrl":"https://yanxuan-item.nosdn.127.net/3bd7a2e27f9ced5f72d9ce4c069c7326.png"},{"itemId":1398016,"picUrl":"https://yanxuan-item.nosdn.127.net/9d581d4ec02cf86ff2a05cf81868f159.png"},{"itemId":1572030,"picUrl":"https://yanxuan-item.nosdn.127.net/a4c5c5c63d8e3595f15a95819b2cf758.png"},{"itemId":1535011,"picUrl":"https://yanxuan-item.nosdn.127.net/e37656ecad9a2494f456e222fe7800a2.png"},{"itemId":3815073,"picUrl":"https://yanxuan-item.nosdn.127.net/ae8c3cda95b2a807d0b8518f7145eda4.png"},{"itemId":1535010,"picUrl":"https://yanxuan-item.nosdn.127.net/59eb7e52ab114c894a8179bc2991122b.png"},{"itemId":1667011,"picUrl":"https://yanxuan-item.nosdn.127.net/f4cccc00bf214181daa940a415e7006f.png"},{"itemId":3536062,"picUrl":"https://yanxuan-item.nosdn.127.net/df1cd9bde3b5e7f5839ee1a7445d07e0.png"},{"itemId":3988289,"picUrl":"https://yanxuan-item.nosdn.127.net/0fd9f9e40f287ecfe3b54aaafda914f6.png"},{"itemId":1546002,"picUrl":"https://yanxuan-item.nosdn.127.net/61593601cd7a375c4932f3e9bee3974a.png"},{"itemId":3431002,"picUrl":"https://yanxuan-item.nosdn.127.net/cfba711ea8e5709e7eded536e07c2353.png"},{"itemId":1667007,"picUrl":"https://yanxuan-item.nosdn.127.net/5800035cda4787b4bf8d8da8c151bdc2.png"},{"itemId":3829051,"picUrl":"https://yanxuan-item.nosdn.127.net/858cc027d5dae682799a633cd331a29a.png"},{"itemId":1468002,"picUrl":"https://yanxuan-item.nosdn.127.net/bd2842f9eda908dae2d71f980eeb282e.png"},{"itemId":3827015,"picUrl":"https://yanxuan-item.nosdn.127.net/3d97f83a2dad069a504bb4ae0296f9ca.png"},{"itemId":3988762,"picUrl":"https://yanxuan-item.nosdn.127.net/f346d2ec9b751e79e36461fa497f0802.png"},{"itemId":3411026,"picUrl":"https://yanxuan-item.nosdn.127.net/69b84734318007147dfed06136a452a2.png"},{"itemId":1685016,"picUrl":"https://yanxuan-item.nosdn.127.net/48f3d7c6c7f345c5cbe9142082cf22da.png"},{"itemId":1146006,"picUrl":"https://yanxuan-item.nosdn.127.net/6763c33e5242040e7e678630b4e6eba5.png"},{"itemId":3987262,"picUrl":"https://yanxuan-item.nosdn.127.net/4b7e018166760dca3c4db0197603201d.png"},{"itemId":1146007,"picUrl":"https://yanxuan-item.nosdn.127.net/0188adf6cdc4c1159fe647fa5092cb0f.png"},{"itemId":3464032,"picUrl":"https://yanxuan-item.nosdn.127.net/1dc64c483ca555e291b2efda6d187c7f.png"},{"itemId":3408026,"picUrl":"https://yanxuan-item.nosdn.127.net/10d1e7f4306328d551724235120a9e3f.png"},{"itemId":1097000,"picUrl":"https://yanxuan-item.nosdn.127.net/6e05a3a46a46a34e7fa5b86c122a0787.png"},{"itemId":1321000,"picUrl":"https://yanxuan-item.nosdn.127.net/39e5df244905c79abf947fb4a534699d.png"},{"itemId":3807037,"picUrl":"https://yanxuan-item.nosdn.127.net/dfaf80d547d4c4f76aa13c492a9f3b7e.png"},{"itemId":1417023,"picUrl":"https://yanxuan-item.nosdn.127.net/6f8849cd376ea181f977f0ae40f309eb.png"},{"itemId":3478058,"picUrl":"https://yanxuan-item.nosdn.127.net/e03b4bda61111be8002a3954b668152b.png"}],"categoryName":"美食酒水榜","targetUrl":"https://m.you.163.com/item/saleRank?categoryId=1005002","showPicUrl":"https://yanxuan-item.nosdn.127.net/3bd7a2e27f9ced5f72d9ce4c069c7326.png","extra":{"operationResource":{"categoryName":"美食酒水","itemIdList":["3477011","1398016","1572030","1535011","3815073","1535010","1667011","3536062","3988289","1546002","3431002","1667007","3829051","1468002","3827015","3988762","3411026","1685016","1146006","3987262","1146007","3464032","3408026","1097000","1321000","3807037","1417023","3478058"],"categoryId":"1005002"},"modelType":5}},{"picUrl":"https://yanxuan-item.nosdn.127.net/644a27b8e168b8fe8e43ccaad934b24e.png","itemPicBeanList":[{"itemId":1318002,"picUrl":"https://yanxuan-item.nosdn.127.net/644a27b8e168b8fe8e43ccaad934b24e.png"},{"itemId":1625008,"picUrl":"https://yanxuan-item.nosdn.127.net/c89c4c86c6cb31805bd537d8c772a231.png"},{"itemId":1545016,"picUrl":"https://yanxuan-item.nosdn.127.net/6cdb3da46a4b95b36dea89d6d47d3bd9.png"},{"itemId":1674003,"picUrl":"https://yanxuan-item.nosdn.127.net/e30375922143f7fad7465fb56bc5acd6.png"},{"itemId":1116033,"picUrl":"https://yanxuan-item.nosdn.127.net/91a264d84fed57f97c48dc107370e941.png"},{"itemId":3829116,"picUrl":"https://yanxuan-item.nosdn.127.net/4fc7ea43e829af4ed31e09673f68db89.png"},{"itemId":1110003,"picUrl":"https://yanxuan-item.nosdn.127.net/9a33f08a3b0f5c06fdf4c586d51b2f7c.png"},{"itemId":1418015,"picUrl":"https://yanxuan-item.nosdn.127.net/98b31f57668b2b5b4f3adba5c3d96723.png"},{"itemId":3408074,"picUrl":"https://yanxuan-item.nosdn.127.net/609452a430143ec9e691abddb067ec67.png"},{"itemId":1435024,"picUrl":"https://yanxuan-item.nosdn.127.net/0bd018282b7ba6db74b21f8c0daed220.png"},{"itemId":1624016,"picUrl":"https://yanxuan-item.nosdn.127.net/eed2ed6e83189517ba35f3781271f773.png"},{"itemId":3413004,"picUrl":"https://yanxuan-item.nosdn.127.net/30fe9253a061b5c4c7c389b7caf24a67.png"},{"itemId":1602000,"picUrl":"https://yanxuan-item.nosdn.127.net/05b82f4f46da9dc58dc873b365598292.png"},{"itemId":1045004,"picUrl":"https://yanxuan-item.nosdn.127.net/a2585d4686f7cba87f3f12a7e6d45b50.png"},{"itemId":1108008,"picUrl":"https://yanxuan-item.nosdn.127.net/0fecbab07b9a3522015958ba8f31e27a.png"},{"itemId":3828015,"picUrl":"https://yanxuan-item.nosdn.127.net/ab098b429e5a1f9715d938cd7d54f26a.png"},{"itemId":3439006,"picUrl":"https://yanxuan-item.nosdn.127.net/073f16bf0c7ad8634c3abb7636e063c2.png"},{"itemId":3986654,"picUrl":"https://yanxuan-item.nosdn.127.net/197283c8f697f9063674779345ccbabe.png"},{"itemId":3407081,"picUrl":"https://yanxuan-item.nosdn.127.net/75085afc77fc5bc5e74a35e6838b1846.png"},{"itemId":1666005,"picUrl":"https://yanxuan-item.nosdn.127.net/32609b32caf1c24b5f8b8262fd9c21dc.png"},{"itemId":3425016,"picUrl":"https://yanxuan-item.nosdn.127.net/e20c17ba8be5eaa596303bc47ebefc32.png"},{"itemId":1088001,"picUrl":"https://yanxuan-item.nosdn.127.net/24493db956be11a09de5e71d389010c7.png"},{"itemId":3823052,"picUrl":"https://yanxuan-item.nosdn.127.net/280cfa5d1739fe7f079933ea133e9841.png"},{"itemId":1149000,"picUrl":"https://yanxuan-item.nosdn.127.net/16b4d581afc5a9cd36e8adc8ed6ceb4f.png"},{"itemId":1435025,"picUrl":"https://yanxuan-item.nosdn.127.net/a7f4693aa7f7c1683340c6cd64286529.png"},{"itemId":1630007,"picUrl":"https://yanxuan-item.nosdn.127.net/86989f8cb0ece3d5ebf903b988abae79.png"},{"itemId":1619034,"picUrl":"https://yanxuan-item.nosdn.127.net/fcac9df3f0cc28e91b3daaf703a3ab7c.png"},{"itemId":3440021,"picUrl":"https://yanxuan-item.nosdn.127.net/12bd7528fc75e16b775fa2cb1024f80a.jpg"}],"categoryName":"居家生活榜","targetUrl":"https://m.you.163.com/item/saleRank?categoryId=1005000","showPicUrl":"https://yanxuan-item.nosdn.127.net/644a27b8e168b8fe8e43ccaad934b24e.png","extra":{"operationResource":{"categoryName":"居家生活","itemIdList":["1318002","1625008","1545016","1674003","1116033","3829116","1110003","1418015","3408074","1435024","1624016","3413004","1602000","1045004","1108008","3828015","3439006","3986654","3407081","1666005","3425016","1088001","3823052","1149000","1435025","1630007","1619034","3440021"],"categoryId":"1005000"},"modelType":5}},{"picUrl":"https://yanxuan-item.nosdn.127.net/7806718d4928df310d5c64300183664d.png","itemPicBeanList":[{"itemId":3986451,"picUrl":"https://yanxuan-item.nosdn.127.net/5ad3990d8d1ca731b56ee11d151facfd.png"},{"itemId":1652019,"picUrl":"https://yanxuan-item.nosdn.127.net/7806718d4928df310d5c64300183664d.png"},{"itemId":1113001,"picUrl":"https://yanxuan-item.nosdn.127.net/431a09a43914483f4d70aeda8ecb8a59.png"},{"itemId":3829116,"picUrl":"https://yanxuan-item.nosdn.127.net/4fc7ea43e829af4ed31e09673f68db89.png"},{"itemId":3826011,"picUrl":"https://yanxuan-item.nosdn.127.net/901be61b95ed8dfc89947125cbdc603b.png"},{"itemId":1333015,"picUrl":"https://yanxuan-item.nosdn.127.net/24dd7f6f16154871f09e86766cc92a94.png"},{"itemId":1077003,"picUrl":"https://yanxuan-item.nosdn.127.net/a10ed5c19533c9e1e2abf1d8cb843c24.png"},{"itemId":3402020,"picUrl":"https://yanxuan-item.nosdn.127.net/2c0147161faaa160cf10b6770f1e290d.png"},{"itemId":1418015,"picUrl":"https://yanxuan-item.nosdn.127.net/98b31f57668b2b5b4f3adba5c3d96723.png"},{"itemId":3434003,"picUrl":"https://yanxuan-item.nosdn.127.net/fd9ab8ca4a9e89cb71d24ef2c27783c0.png"},{"itemId":1501008,"picUrl":"https://yanxuan-item.nosdn.127.net/fbae3a43b448d2e6e6671936ba665b99.png"},{"itemId":1657008,"picUrl":"https://yanxuan-item.nosdn.127.net/107dae4c67a6247355771369b8182725.png"},{"itemId":1683007,"picUrl":"https://yanxuan-item.nosdn.127.net/1f93923086cbb7d63be958c920289f05.png"},{"itemId":1127007,"picUrl":"https://yanxuan-item.nosdn.127.net/ecef155d279e1a485b4f31f87daa3698.png"},{"itemId":1540017,"picUrl":"https://yanxuan-item.nosdn.127.net/7137bfc9887a2baf0c9188f7a62c5e6e.png"},{"itemId":3416001,"picUrl":"https://yanxuan-item.nosdn.127.net/899d91ae4b28e9bb42d617aa6691276d.png"},{"itemId":1154003,"picUrl":"https://yanxuan-item.nosdn.127.net/7a0e064c1fd99b5eb16608bca9b7aa0d.png"},{"itemId":3408014,"picUrl":"https://yanxuan-item.nosdn.127.net/0434f5cb29b2c6c6ade2f1c0487ae97c.png"},{"itemId":3988757,"picUrl":"https://yanxuan-item.nosdn.127.net/2057746c0f31ce6faf10ae5a1257a2ba.png"},{"itemId":3406010,"picUrl":"https://yanxuan-item.nosdn.127.net/85b1bd60c128affe100068ed20037787.png"},{"itemId":1085007,"picUrl":"https://yanxuan-item.nosdn.127.net/05eed5e90b2d6002600dddd4dd66260d.png"},{"itemId":3407065,"picUrl":"https://yanxuan-item.nosdn.127.net/8710b394afc12ff039fac08dfb9333bb.png"},{"itemId":3444027,"picUrl":"https://yanxuan-item.nosdn.127.net/846dacb553fd65090b6fc9c3eef06cdf.png"},{"itemId":3850013,"picUrl":"https://yanxuan-item.nosdn.127.net/cff84f8844c856004e8de2595b76f570.png"},{"itemId":1637002,"picUrl":"https://yanxuan-item.nosdn.127.net/f5b1cba9a449797089d43cfe6939933d.png"},{"itemId":3506034,"picUrl":"https://yanxuan-item.nosdn.127.net/71e2c597d7c02912c9fe635cdc2a9c0d.png"},{"itemId":3835007,"picUrl":"https://yanxuan-item.nosdn.127.net/eea064c1198b70f1b80b86c4fc579141.png"},{"itemId":3987388,"picUrl":"https://yanxuan-item.nosdn.127.net/c97ed9ccfdf8441a8a6f54727ea149b8.png"},{"itemId":3527154,"picUrl":"https://yanxuan-item.nosdn.127.net/02dd07dbee4575a71afa30fd680a6ec7.png"},{"itemId":1389000,"picUrl":"https://yanxuan-item.nosdn.127.net/64c3915f7edb71c10dbfbd18441f271c.png"}],"categoryName":"个护清洁榜","targetUrl":"https://m.you.163.com/item/saleRank?categoryId=1013001","showPicUrl":"https://yanxuan-item.nosdn.127.net/7806718d4928df310d5c64300183664d.png","extra":{"operationResource":{"categoryName":"个护清洁","itemIdList":["3986451","1652019","1113001","3829116","3826011","1333015","1077003","3402020","1418015","3434003","1501008","1657008","1683007","1127007","1540017","3416001","1154003","3408014","3988757","3406010","1085007","3407065","3444027","3850013","1637002","3506034","3835007","3987388","3527154","1389000"],"categoryId":"1013001"},"modelType":5}},{"picUrl":"https://yanxuan-item.nosdn.127.net/d7393e6b604cd89022361c65b1b03183.png","itemPicBeanList":[{"itemId":3446012,"picUrl":"https://yanxuan-item.nosdn.127.net/d7393e6b604cd89022361c65b1b03183.png"},{"itemId":1545016,"picUrl":"https://yanxuan-item.nosdn.127.net/6cdb3da46a4b95b36dea89d6d47d3bd9.png"},{"itemId":3988892,"picUrl":"https://yanxuan-item.nosdn.127.net/d691b12d383ea93c2108a383e2b1d3cc.png"},{"itemId":3413006,"picUrl":"https://yanxuan-item.nosdn.127.net/cf6cbe1d80601f109a85fd48cbe27478.png"},{"itemId":1632002,"picUrl":"https://yanxuan-item.nosdn.127.net/6035c5adac64b2c2913e81661a2ea0f9.png"},{"itemId":1624001,"picUrl":"https://yanxuan-item.nosdn.127.net/51348ec7731f5ed5c4bb9e0bed88717c.png"},{"itemId":3987138,"picUrl":"https://yanxuan-item.nosdn.127.net/d85a7584368da59994f84651affc4dab.png"},{"itemId":3827023,"picUrl":"https://yanxuan-item.nosdn.127.net/a517938254c7d2f480827debf355127a.png"},{"itemId":1624016,"picUrl":"https://yanxuan-item.nosdn.127.net/eed2ed6e83189517ba35f3781271f773.png"},{"itemId":1127007,"picUrl":"https://yanxuan-item.nosdn.127.net/ecef155d279e1a485b4f31f87daa3698.png"},{"itemId":1154003,"picUrl":"https://yanxuan-item.nosdn.127.net/7a0e064c1fd99b5eb16608bca9b7aa0d.png"},{"itemId":3408014,"picUrl":"https://yanxuan-item.nosdn.127.net/0434f5cb29b2c6c6ade2f1c0487ae97c.png"},{"itemId":3827027,"picUrl":"https://yanxuan-item.nosdn.127.net/6628f73e4ff16ae5fdb12f5be75c5557.png"},{"itemId":1327018,"picUrl":"https://yanxuan-item.nosdn.127.net/e9730c230d3df388ce6c32e037642c2d.png"},{"itemId":1401002,"picUrl":"https://yanxuan-item.nosdn.127.net/ca3c524b92922b9b03fdd7dc965c9401.png"},{"itemId":1685001,"picUrl":"https://yanxuan-item.nosdn.127.net/c7feab536c0d0fa95ed12d987e9bd667.png"},{"itemId":1401006,"picUrl":"https://yanxuan-item.nosdn.127.net/5e702b909a7d0cf391bfa8d3fce03c92.png"},{"itemId":3407065,"picUrl":"https://yanxuan-item.nosdn.127.net/8710b394afc12ff039fac08dfb9333bb.png"},{"itemId":1637002,"picUrl":"https://yanxuan-item.nosdn.127.net/f5b1cba9a449797089d43cfe6939933d.png"},{"itemId":1663026,"picUrl":"https://yanxuan-item.nosdn.127.net/db3837ad978e07ab908fbd3814eb1104.png"},{"itemId":3534014,"picUrl":"https://yanxuan-item.nosdn.127.net/75ce66f46c287cc512749f9e8328f0b3.png"},{"itemId":3835007,"picUrl":"https://yanxuan-item.nosdn.127.net/eea064c1198b70f1b80b86c4fc579141.png"},{"itemId":3527154,"picUrl":"https://yanxuan-item.nosdn.127.net/02dd07dbee4575a71afa30fd680a6ec7.png"},{"itemId":1505029,"picUrl":"https://yanxuan-item.nosdn.127.net/ea9af61f4504871f72c4b9ef38ca4799.png"},{"itemId":3986478,"picUrl":"https://yanxuan-item.nosdn.127.net/eb841bdf69fb606edb8426e9ec659d9f.png"},{"itemId":3986451,"picUrl":"https://yanxuan-item.nosdn.127.net/5ad3990d8d1ca731b56ee11d151facfd.png"},{"itemId":3839008,"picUrl":"https://yanxuan-item.nosdn.127.net/ea324a88d74978c5a11fe99ece5734ae.png"},{"itemId":3986456,"picUrl":"https://yanxuan-item.nosdn.127.net/dd2e334e302eaaa35eb1e32962fa2270.png"},{"itemId":1497001,"picUrl":"https://yanxuan-item.nosdn.127.net/7c850ef50fc408c4eab4d7abdb920da3.png"}],"categoryName":"数码家电榜","targetUrl":"https://m.you.163.com/item/saleRank?categoryId=1043000","showPicUrl":"https://yanxuan-item.nosdn.127.net/d7393e6b604cd89022361c65b1b03183.png","extra":{"operationResource":{"categoryName":"数码家电","itemIdList":["3446012","1545016","3988892","3413006","1632002","1624001","3987138","3827023","1624016","1127007","1154003","3408014","3827027","1327018","1401002","1685001","1401006","3407065","1637002","1663026","3534014","3835007","3527154","1505029","3986478","3986451","3839008","3986456","1497001"],"categoryId":"1043000"},"modelType":5}},{"picUrl":"https://yanxuan-item.nosdn.127.net/073f16bf0c7ad8634c3abb7636e063c2.png","itemPicBeanList":[{"itemId":3439006,"picUrl":"https://yanxuan-item.nosdn.127.net/073f16bf0c7ad8634c3abb7636e063c2.png"},{"itemId":1165077,"picUrl":"https://yanxuan-item.nosdn.127.net/e3601637765b05a45663e8769f543c2a.png"},{"itemId":1619034,"picUrl":"https://yanxuan-item.nosdn.127.net/fcac9df3f0cc28e91b3daaf703a3ab7c.png"},{"itemId":3815050,"picUrl":"https://yanxuan-item.nosdn.127.net/9c77ddefae8fa0f16d8a43bf0aa1513d.png"},{"itemId":1021020,"picUrl":"https://yanxuan-item.nosdn.127.net/445689c4faa55f8186c500e68bff73d6.png"},{"itemId":3544005,"picUrl":"https://yanxuan-item.nosdn.127.net/451ebe1c8725d9490ca7e2aa27b05a0f.png"},{"itemId":1092026,"picUrl":"https://yanxuan-item.nosdn.127.net/58fdbceab428754d9b8e8b3019d84c4e.png"},{"itemId":1579024,"picUrl":"https://yanxuan-item.nosdn.127.net/fc6cc915cd1908496330bc6565e02a95.png"},{"itemId":3807047,"picUrl":"https://yanxuan-item.nosdn.127.net/d2dd346577e3e12bd2be6f2876bfd0a5.png"},{"itemId":3988685,"picUrl":"https://yanxuan-item.nosdn.127.net/d2a6ef279ffdde2da008b5e0ecc077da.png"},{"itemId":3989003,"picUrl":"https://yanxuan-item.nosdn.127.net/d4464eb557bfc669e723b6446c75425a.png"},{"itemId":3438018,"picUrl":"https://yanxuan-item.nosdn.127.net/864633a00a776555b1c53abd50df0a40.png"},{"itemId":3987228,"picUrl":"https://yanxuan-item.nosdn.127.net/d0a9acac56c9a656d133be31082442ff.png"},{"itemId":3844004,"picUrl":"https://yanxuan-item.nosdn.127.net/5f3c4891e0f21c9e8148b9c1125a0c33.png"},{"itemId":3829003,"picUrl":"https://yanxuan-item.nosdn.127.net/a8eea196aa7c107b2814cfa2976caec6.png"},{"itemId":1114010,"picUrl":"https://yanxuan-item.nosdn.127.net/58b7b4a5277dddbfd9b99b07f38b6c20.png"},{"itemId":3827062,"picUrl":"https://yanxuan-item.nosdn.127.net/e628bb179d408c27d6a001c01ba507da.png"},{"itemId":3803003,"picUrl":"https://yanxuan-item.nosdn.127.net/dd17a2568c133b642930acbfe6923d32.png"},{"itemId":3804052,"picUrl":"https://yanxuan-item.nosdn.127.net/e49e636cb6049b12822bee7e96c0adad.png"},{"itemId":1638000,"picUrl":"https://yanxuan-item.nosdn.127.net/671b2fc5d8a5fd7c8ed3527482a50507.png"},{"itemId":3827036,"picUrl":"https://yanxuan-item.nosdn.127.net/755bdc78a25c9e0e8a4652de863af649.png"},{"itemId":1306027,"picUrl":"https://yanxuan-item.nosdn.127.net/271eb0b3d94e80579afdeb614cc240ad.png"},{"itemId":3879023,"picUrl":"https://yanxuan-item.nosdn.127.net/5e051676b8a7a8006fadee20186d07be.png"},{"itemId":1056000,"picUrl":"https://yanxuan-item.nosdn.127.net/7be46223373b04fc2f42e0bd2add4d61.png"},{"itemId":1164006,"picUrl":"https://yanxuan-item.nosdn.127.net/e9de2a3b586c3cbed7fd621d7810d2f4.png"},{"itemId":1647014,"picUrl":"https://yanxuan-item.nosdn.127.net/68659daa403d8ec16bc898b744448936.png"},{"itemId":1269023,"picUrl":"https://yanxuan-item.nosdn.127.net/3a33addfccd4a624a9d86b04c0717ef9.png"},{"itemId":1165015,"picUrl":"https://yanxuan-item.nosdn.127.net/17c3596d257753108d1d471b8ea4d385.png"},{"itemId":3430055,"picUrl":"https://yanxuan-item.nosdn.127.net/e7c9f9a6dd880e47ba8287d1ba89b61d.png"},{"itemId":3826032,"picUrl":"https://yanxuan-item.nosdn.127.net/762201923f701baa5325df5762684e50.png"}],"categoryName":"服饰鞋包榜","targetUrl":"https://m.you.163.com/item/saleRank?categoryId=1010000","showPicUrl":"https://yanxuan-item.nosdn.127.net/073f16bf0c7ad8634c3abb7636e063c2.png","extra":{"operationResource":{"categoryName":"服饰鞋包","itemIdList":["3439006","1165077","1619034","3815050","1021020","3544005","1092026","1579024","3807047","3988685","3989003","3438018","3987228","3844004","3829003","1114010","3827062","3803003","3804052","1638000","3827036","1306027","3879023","1056000","1164006","1647014","1269023","1165015","3430055","3826032"],"categoryId":"1010000"},"modelType":5}},{"picUrl":"https://yanxuan-item.nosdn.127.net/4b72ba8cdcf9eccd3ed1e6be35b09ab8.png","itemPicBeanList":[{"itemId":1076017,"picUrl":"https://yanxuan-item.nosdn.127.net/4b72ba8cdcf9eccd3ed1e6be35b09ab8.png"},{"itemId":3446012,"picUrl":"https://yanxuan-item.nosdn.127.net/d7393e6b604cd89022361c65b1b03183.png"},{"itemId":1674003,"picUrl":"https://yanxuan-item.nosdn.127.net/e30375922143f7fad7465fb56bc5acd6.png"},{"itemId":1546002,"picUrl":"https://yanxuan-item.nosdn.127.net/61593601cd7a375c4932f3e9bee3974a.png"},{"itemId":3431002,"picUrl":"https://yanxuan-item.nosdn.127.net/cfba711ea8e5709e7eded536e07c2353.png"},{"itemId":1076018,"picUrl":"https://yanxuan-item.nosdn.127.net/82de8fdea1c8bba21b26099612ff5605.png"},{"itemId":1683007,"picUrl":"https://yanxuan-item.nosdn.127.net/1f93923086cbb7d63be958c920289f05.png"},{"itemId":1685016,"picUrl":"https://yanxuan-item.nosdn.127.net/48f3d7c6c7f345c5cbe9142082cf22da.png"},{"itemId":1602000,"picUrl":"https://yanxuan-item.nosdn.127.net/05b82f4f46da9dc58dc873b365598292.png"},{"itemId":1076015,"picUrl":"https://yanxuan-item.nosdn.127.net/e1d87f845a5773665bd7042d28cbf11a.png"},{"itemId":3464032,"picUrl":"https://yanxuan-item.nosdn.127.net/1dc64c483ca555e291b2efda6d187c7f.png"},{"itemId":3807037,"picUrl":"https://yanxuan-item.nosdn.127.net/dfaf80d547d4c4f76aa13c492a9f3b7e.png"},{"itemId":1076016,"picUrl":"https://yanxuan-item.nosdn.127.net/a31d7ecdec0f914e1c375fac666c1183.png"},{"itemId":3806051,"picUrl":"https://yanxuan-item.nosdn.127.net/13610915f5e3cdcc1bff067a1e967cb4.png"},{"itemId":3827027,"picUrl":"https://yanxuan-item.nosdn.127.net/6628f73e4ff16ae5fdb12f5be75c5557.png"},{"itemId":1666005,"picUrl":"https://yanxuan-item.nosdn.127.net/32609b32caf1c24b5f8b8262fd9c21dc.png"},{"itemId":1354000,"picUrl":"https://yanxuan-item.nosdn.127.net/d3fa5c27c960809f119e42dab99fed4d.png"},{"itemId":1149000,"picUrl":"https://yanxuan-item.nosdn.127.net/16b4d581afc5a9cd36e8adc8ed6ceb4f.png"},{"itemId":3444027,"picUrl":"https://yanxuan-item.nosdn.127.net/846dacb553fd65090b6fc9c3eef06cdf.png"},{"itemId":3850013,"picUrl":"https://yanxuan-item.nosdn.127.net/cff84f8844c856004e8de2595b76f570.png"},{"itemId":1637002,"picUrl":"https://yanxuan-item.nosdn.127.net/f5b1cba9a449797089d43cfe6939933d.png"},{"itemId":3528024,"picUrl":"https://yanxuan-item.nosdn.127.net/afa5ffed53da00d519fdb1bc765cdf38.png"},{"itemId":3534014,"picUrl":"https://yanxuan-item.nosdn.127.net/75ce66f46c287cc512749f9e8328f0b3.png"},{"itemId":3987388,"picUrl":"https://yanxuan-item.nosdn.127.net/c97ed9ccfdf8441a8a6f54727ea149b8.png"},{"itemId":1389000,"picUrl":"https://yanxuan-item.nosdn.127.net/64c3915f7edb71c10dbfbd18441f271c.png"},{"itemId":1023014,"picUrl":"https://yanxuan-item.nosdn.127.net/056e0e74a683d7e0011bd583d0084b7c.png"},{"itemId":3986195,"picUrl":"https://yanxuan-item.nosdn.127.net/ff51113995d5c8e1a78fb4a93b0765ec.png"},{"itemId":3986552,"picUrl":"https://yanxuan-item.nosdn.127.net/364bb4175dd73987f11dc1a701e28a2f.png"},{"itemId":1494003,"picUrl":"https://yanxuan-item.nosdn.127.net/0ac21674d619c4558d99c0f380fd5b71.png"},{"itemId":3398008,"picUrl":"https://yanxuan-item.nosdn.127.net/dfc5f3de3aeaf0b4616c644b23df35a8.png"}],"categoryName":"全球特色榜","targetUrl":"https://m.you.163.com/item/saleRank?categoryId=1019000","showPicUrl":"https://yanxuan-item.nosdn.127.net/4b72ba8cdcf9eccd3ed1e6be35b09ab8.png","extra":{"operationResource":{"categoryName":"全球特色","itemIdList":["1076017","3446012","1674003","1546002","3431002","1076018","1683007","1685016","1602000","1076015","3464032","3807037","1076016","3806051","3827027","1666005","1354000","1149000","3444027","3850013","1637002","3528024","3534014","3987388","1389000","1023014","3986195","3986552","1494003","3398008"],"categoryId":"1019000"},"modelType":5}},{"picUrl":"https://yanxuan-item.nosdn.127.net/74662d24f6d217b520178c5a6d031457.png","itemPicBeanList":[{"itemId":1604016,"picUrl":"https://yanxuan-item.nosdn.127.net/74662d24f6d217b520178c5a6d031457.png"},{"itemId":1134066,"picUrl":"https://yanxuan-item.nosdn.127.net/1b8e4a484e128c28a050cd2bc0c64396.png"},{"itemId":1606002,"picUrl":"https://yanxuan-item.nosdn.127.net/f444ac11115a8249a92dc95dccad6e07.png"},{"itemId":1572013,"picUrl":"https://yanxuan-item.nosdn.127.net/7e4db021bc68c9af8eddecdb1aa96c36.png"},{"itemId":1116034,"picUrl":"https://yanxuan-item.nosdn.127.net/cfd2ab8d2ea2188ff422c5c91c1d920c.png"},{"itemId":1552005,"picUrl":"https://yanxuan-item.nosdn.127.net/00382181864967c1125b75bd5289c8d3.png"},{"itemId":3986078,"picUrl":"https://yanxuan-item.nosdn.127.net/1c46042c0d5621efe2f603b173d86cfd.png"},{"itemId":3986728,"picUrl":"https://yanxuan-item.nosdn.127.net/17967f3d15414239a5c3c33a7892f301.png"},{"itemId":1145038,"picUrl":"https://yanxuan-item.nosdn.127.net/80c440036a9c27cac336a7e50be53484.png"},{"itemId":1506021,"picUrl":"https://yanxuan-item.nosdn.127.net/98f00e8b15f30c11e3e64f1da7fba591.png"},{"itemId":1295000,"picUrl":"https://yanxuan-item.nosdn.127.net/4467776eb370a1d46e0dac48a6ae9893.png"},{"itemId":3986076,"picUrl":"https://yanxuan-item.nosdn.127.net/d1132e557a1c2f94673dde8e6c18e4a2.png"},{"itemId":1621036,"picUrl":"https://yanxuan-item.nosdn.127.net/d77d0a70cfa7efdf313b3a03dbfb699b.png"},{"itemId":1542005,"picUrl":"https://yanxuan-item.nosdn.127.net/d044967f76d92def0fb74ce862c10e73.png"},{"itemId":1519013,"picUrl":"https://yanxuan-item.nosdn.127.net/a7282c351cd083c116449a7eec8e7ee0.png"},{"itemId":1572014,"picUrl":"https://yanxuan-item.nosdn.127.net/209d87bdf39b3854b6baaaf70ee58067.png"},{"itemId":3440174,"picUrl":"https://yanxuan-item.nosdn.127.net/ef76f6daebdc9144e16805a256733204.png"},{"itemId":1686131,"picUrl":"https://yanxuan-item.nosdn.127.net/4b051d129f25cbb48989b7c50f5b8f2c.png"},{"itemId":3465086,"picUrl":"https://yanxuan-item.nosdn.127.net/eee600116ae63125c7039ae22363efdc.png"},{"itemId":1683030,"picUrl":"https://yanxuan-item.nosdn.127.net/24999493f12f64dfa49d32c2a980dc35.png"},{"itemId":1687102,"picUrl":"https://yanxuan-item.nosdn.127.net/f694a24583a2f174ac5ec8f8e92d4c26.png"},{"itemId":3444037,"picUrl":"https://yanxuan-item.nosdn.127.net/b7479401c6bcf1e793efff5a771d9e27.png"},{"itemId":3407077,"picUrl":"https://yanxuan-item.nosdn.127.net/30a1c84b7810a5765974e577e2554930.png"},{"itemId":1087003,"picUrl":"https://yanxuan-item.nosdn.127.net/e1ae521258e83b2e1f0654725a6e0613.png"},{"itemId":3518001,"picUrl":"https://yanxuan-item.nosdn.127.net/31e5fe96e442201b115ff56cd2780465.png"},{"itemId":1561001,"picUrl":"https://yanxuan-item.nosdn.127.net/0064e22029d052276c2f8e49b1f3973d.png"},{"itemId":3465083,"picUrl":"https://yanxuan-item.nosdn.127.net/a43c2c9578659e7f8a36018a070ae0dc.jpg"},{"itemId":3551096,"picUrl":"https://yanxuan-item.nosdn.127.net/48e950097b26963768f1406b594cf19c.png"},{"itemId":3844033,"picUrl":"https://yanxuan-item.nosdn.127.net/3ddebc9df09f6b10b9b301d1edf2c303.png"},{"itemId":1296000,"picUrl":"https://yanxuan-item.nosdn.127.net/b8d8fad9d32d9709be5bbeff5d0724a1.png"}],"categoryName":"母婴亲子榜","targetUrl":"https://m.you.163.com/item/saleRank?categoryId=1011000","showPicUrl":"https://yanxuan-item.nosdn.127.net/74662d24f6d217b520178c5a6d031457.png","extra":{"operationResource":{"categoryName":"母婴亲子","itemIdList":["1604016","1134066","1606002","1572013","1116034","1552005","3986078","3986728","1145038","1506021","1295000","3986076","1621036","1542005","1519013","1572014","3440174","1686131","3465086","1683030","1687102","3444037","3407077","1087003","3518001","1561001","3465083","3551096","3844033","1296000"],"categoryId":"1011000"},"modelType":5}},{"picUrl":"https://yanxuan-item.nosdn.127.net/a9d6de39ab17ab82d5424205dafc4136.png","itemPicBeanList":[{"itemId":1690003,"picUrl":"https://yanxuan-item.nosdn.127.net/a9d6de39ab17ab82d5424205dafc4136.png"},{"itemId":3988074,"picUrl":"https://yanxuan-item.nosdn.127.net/605284004e9bc314b081bea86e22faab.jpg"},{"itemId":3988462,"picUrl":"https://yanxuan-item.nosdn.127.net/797a29814fea9f623efb204d96fd3e3e.png"},{"itemId":3548011,"picUrl":"https://yanxuan-item.nosdn.127.net/3a4f384b28c9d98f5e78080cfb4180dd.png"},{"itemId":3498011,"picUrl":"https://yanxuan-item.nosdn.127.net/84334e0d0a33897bb8f5fee654fa0cee.jpg"},{"itemId":3815050,"picUrl":"https://yanxuan-item.nosdn.127.net/9c77ddefae8fa0f16d8a43bf0aa1513d.png"},{"itemId":1092026,"picUrl":"https://yanxuan-item.nosdn.127.net/58fdbceab428754d9b8e8b3019d84c4e.png"},{"itemId":3986845,"picUrl":"https://yanxuan-item.nosdn.127.net/df6809f00fcf5c333dc73828180b68fb.png"},{"itemId":3814094,"picUrl":"https://yanxuan-item.nosdn.127.net/6fd807743e8e25472aca8b6b0b8f3039.png"},{"itemId":1667018,"picUrl":"https://yanxuan-item.nosdn.127.net/b47e916d628ff9a755ba4cbaa61047c4.png"},{"itemId":3406006,"picUrl":"https://yanxuan-item.nosdn.127.net/9e5ae955b287d65e2a7ba5b868b81f2b.png"},{"itemId":1459005,"picUrl":"https://yanxuan-item.nosdn.127.net/c442593e0cf25a42d37941554b587418.png"},{"itemId":1621018,"picUrl":"https://yanxuan-item.nosdn.127.net/b051b5aa933cde8d952905becd2046d8.png"},{"itemId":1306027,"picUrl":"https://yanxuan-item.nosdn.127.net/271eb0b3d94e80579afdeb614cc240ad.png"},{"itemId":3507202,"picUrl":"https://yanxuan-item.nosdn.127.net/3246fe9bab23cb76c64dde0d15bba98f.png"},{"itemId":1245014,"picUrl":"https://yanxuan-item.nosdn.127.net/068b1375219cec84915cebcb8488f693.png"},{"itemId":3490048,"picUrl":"https://yanxuan-item.nosdn.127.net/9bd9a7f5e71a42fc38b54163aab1ecb8.png"},{"itemId":1281002,"picUrl":"https://yanxuan-item.nosdn.127.net/2da94f0a57bd6e9b5270bd2246564dde.png"},{"itemId":1436030,"picUrl":"https://yanxuan-item.nosdn.127.net/ebc0e2183705ee6f8aa572ecf6ad87a1.png"},{"itemId":1306026,"picUrl":"https://yanxuan-item.nosdn.127.net/63967eb40b0af505f1fd066442952bab.png"},{"itemId":1114011,"picUrl":"https://yanxuan-item.nosdn.127.net/0fe562392cd8af853a565fb5c302fe3f.png"},{"itemId":1092025,"picUrl":"https://yanxuan-item.nosdn.127.net/07fbaf7a9dd2c7fdf751eacb0248197c.png"},{"itemId":3843007,"picUrl":"https://yanxuan-item.nosdn.127.net/6025face64c792f05772c398e63b0cc8.png"},{"itemId":1156006,"picUrl":"https://yanxuan-item.nosdn.127.net/61b90e0df4c551cb05f7c601646bf2f7.png"},{"itemId":3810003,"picUrl":"https://yanxuan-item.nosdn.127.net/6c7f73dbf8ae911fefaeef6ecea8a054.jpg"},{"itemId":1446001,"picUrl":"https://yanxuan-item.nosdn.127.net/7a151bad1d4dde3015d5471c4fd6e172.png"},{"itemId":1555000,"picUrl":"https://yanxuan-item.nosdn.127.net/57103d892fa09deae9ef9e56c301f14a.png"},{"itemId":1085019,"picUrl":"https://yanxuan-item.nosdn.127.net/c27abf14fa51f922122d9c81d7e68bd8.png"},{"itemId":1023001,"picUrl":"https://yanxuan-item.nosdn.127.net/f313e44efaff1acfe83745f1a3da40ec.png"}],"categoryName":"运动旅行榜","targetUrl":"https://m.you.163.com/item/saleRank?categoryId=109243029","showPicUrl":"https://yanxuan-item.nosdn.127.net/a9d6de39ab17ab82d5424205dafc4136.png","extra":{"operationResource":{"categoryName":"运动旅行","itemIdList":["1690003","3988074","3988462","3548011","3498011","3815050","1092026","3986845","3814094","1667018","3406006","1459005","1621018","1306027","3507202","1245014","3490048","1281002","1436030","1306026","1114011","1092025","3843007","1156006","3810003","1446001","1555000","1085019","1023001"],"categoryId":"109243029"},"modelType":5}}]}],"title":"类目热销榜"},"newItemList":[{"goodCmtCount":0,"couponConflict":true,"scenePicUrl":"https://yanxuan-item.nosdn.127.net/00672a49574126cce712b9f5d5354391.jpg","listPicUrl":"https://yanxuan-item.nosdn.127.net/cc66ac0e306d77a241f6fd9ac34b2a00.png","tagId":0,"simpleDesc":"轻松手剥，多汁化渣","primarySkuPreSellPrice":0,"limitedFlag":204,"newItemFlag":true,"showPicUrl":"https://yanxuan-item.nosdn.127.net/0fd9f9e40f287ecfe3b54aaafda914f6.png","itemTagList":[{"itemId":3988289,"tagId":0,"freshmanExclusive":false,"name":"新品","subType":0,"forbidJump":false,"type":1},{"itemId":3988289,"tagId":128129559,"freshmanExclusive":false,"name":"特价","subType":204,"forbidJump":false,"type":2}],"primarySkuPreSellStatus":0,"pieceNum":0,"extra":{"resource":{"materialType":"商品id","materialId":"54639954","itemId":"3988289","materialContentFrom":1,"materialName":"赏味正当时，春见耙耙柑 5斤","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":1,"itemIdList":["3988289"],"crmUserGroupId":"0","taskId":"54646758"},"modelType":1},"id":3988289,"sellVolume":678,"isCouponConflict":true,"colorNum":0,"primaryPicUrl":"https://yanxuan-item.nosdn.127.net/0fd9f9e40f287ecfe3b54aaafda914f6.png","displaySkuId":300197090,"pieceUnitDesc":"件","resourcesId":0,"discountFlag":false,"name":"赏味正当时，春见耙耙柑 5斤","productPlace":"","counterPrice":69,"couponPrice":0,"cutFlag":false,"retailPrice":59,"primary":true,"status":2},{"goodCmtCount":0,"couponConflict":true,"scenePicUrl":"https://yanxuan-item.nosdn.127.net/ed57e215a3a926fbc8577b58fd6463d0.jpg","listPicUrl":"https://yanxuan-item.nosdn.127.net/e83757662dab293c7af8da0e599a5eb4.png","tagId":0,"simpleDesc":"高达30%的免疫球蛋白","primarySkuPreSellPrice":0,"limitedFlag":204,"newItemFlag":true,"showPicUrl":"https://yanxuan-item.nosdn.127.net/f346d2ec9b751e79e36461fa497f0802.png","itemTagList":[{"itemId":3988762,"tagId":0,"freshmanExclusive":false,"name":"新品","subType":0,"forbidJump":false,"type":1},{"itemId":3988762,"tagId":128129529,"freshmanExclusive":false,"name":"特价","subType":204,"forbidJump":false,"type":2}],"primarySkuPreSellStatus":0,"pieceNum":0,"extra":{"resource":{"materialType":"商品id","materialId":"54639819","itemId":"3988762","materialContentFrom":1,"materialName":"富含免疫球蛋白，纯牛初乳粉 1克*30袋*2罐","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":2,"itemIdList":["3988762"],"crmUserGroupId":"0","taskId":"54646759"},"modelType":1},"id":3988762,"sellVolume":510,"isCouponConflict":true,"colorNum":0,"primaryPicUrl":"https://yanxuan-item.nosdn.127.net/f346d2ec9b751e79e36461fa497f0802.png","displaySkuId":300198968,"pieceUnitDesc":"件","resourcesId":0,"discountFlag":false,"name":"富含免疫球蛋白，纯牛初乳粉 1克*30袋*2罐","productPlace":"","counterPrice":399,"couponPrice":0,"cutFlag":false,"retailPrice":298,"primary":true,"status":2},{"goodCmtCount":0,"couponConflict":true,"scenePicUrl":"https://yanxuan-item.nosdn.127.net/38a509d18e8c388173f560ceb51e00a6.jpg","listPicUrl":"https://yanxuan-item.nosdn.127.net/ebfdce31ffb1a2c1d297ba4cbc47c99d.png","tagId":0,"simpleDesc":"采用紫外灯深层照射水雾，确保水雾纯净清新","primarySkuPreSellPrice":0,"limitedFlag":0,"newItemFlag":true,"showPicUrl":"https://yanxuan-item.nosdn.127.net/b924f1025d1aa8bc437b97e23201f81a.jpg","itemTagList":[{"itemId":3988903,"tagId":0,"freshmanExclusive":false,"name":"新品","subType":0,"forbidJump":false,"type":1}],"primarySkuPreSellStatus":0,"pieceNum":0,"extra":{"resource":{"materialType":"商品id","materialId":"54639955","itemId":"3988903","materialContentFrom":1,"materialName":"【UV紫外线杀菌】水质净化加湿器 5L大容量","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":3,"itemIdList":["3988903"],"crmUserGroupId":"0","taskId":"54646760"},"modelType":1},"id":3988903,"sellVolume":598,"isCouponConflict":true,"colorNum":0,"primaryPicUrl":"https://yanxuan-item.nosdn.127.net/b924f1025d1aa8bc437b97e23201f81a.jpg","displaySkuId":300200082,"pieceUnitDesc":"件","resourcesId":0,"discountFlag":false,"name":"【UV紫外线杀菌】水质净化加湿器 5L大容量","productPlace":"","couponPrice":0,"cutFlag":false,"retailPrice":139,"primary":true,"status":2},{"goodCmtCount":0,"couponConflict":true,"scenePicUrl":"https://yanxuan-item.nosdn.127.net/22e3d3086c99647e7abb9acf7ec49d88.jpg","listPicUrl":"https://yanxuan-item.nosdn.127.net/0841f96ee9a6f05bceb358b15cb8da25.png","tagId":0,"simpleDesc":"三重玻尿酸深层补水 长效锁水 肌肤水润透白","primarySkuPreSellPrice":0,"limitedFlag":0,"newItemFlag":false,"showPicUrl":"https://yanxuan-item.nosdn.127.net/c97ed9ccfdf8441a8a6f54727ea149b8.png","itemTagList":[{"itemId":3987388,"tagId":0,"freshmanExclusive":false,"name":"满88顺丰包邮","subType":0,"forbidJump":false,"type":0}],"primarySkuPreSellStatus":0,"pieceNum":0,"extra":{"resource":{"materialType":"商品id","materialId":"54639456","itemId":"3987388","materialContentFrom":1,"materialName":"敷出水润仙女肌 西班牙玻尿酸深层补水面膜","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":4,"itemIdList":["3987388"],"crmUserGroupId":"0","taskId":"54646761"},"modelType":1},"id":3987388,"sellVolume":236,"isCouponConflict":true,"colorNum":0,"primaryPicUrl":"https://yanxuan-item.nosdn.127.net/c97ed9ccfdf8441a8a6f54727ea149b8.png","displaySkuId":300192878,"pieceUnitDesc":"件","resourcesId":0,"discountFlag":false,"name":"敷出水润仙女肌 西班牙玻尿酸深层补水面膜","productPlace":"","couponPrice":0,"cutFlag":false,"retailPrice":159,"primary":true,"status":2},{"goodCmtCount":0,"couponConflict":true,"scenePicUrl":"https://yanxuan-item.nosdn.127.net/7e47621006f247f02601bf96e407c96c.png","listPicUrl":"https://yanxuan-item.nosdn.127.net/dc413d2d5e81dc11997b8a0ca0abab2f.png","tagId":0,"simpleDesc":"99.99%高效环保杀菌，每天都用新牙刷！","primarySkuPreSellPrice":0,"limitedFlag":0,"newItemFlag":true,"showPicUrl":"https://yanxuan-item.nosdn.127.net/d691b12d383ea93c2108a383e2b1d3cc.png","itemTagList":[{"itemId":3988892,"tagId":0,"freshmanExclusive":false,"name":"新品","subType":0,"forbidJump":false,"type":1}],"primarySkuPreSellStatus":0,"pieceNum":0,"extra":{"resource":{"materialType":"商品id","materialId":"54640059","itemId":"3988892","materialContentFrom":1,"materialName":"不要把病菌刷到嘴里，紫外线牙刷消毒收纳架","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":6,"itemIdList":["3988892"],"crmUserGroupId":"0","taskId":"54646763"},"modelType":1},"id":3988892,"sellVolume":687,"isCouponConflict":true,"colorNum":0,"primaryPicUrl":"https://yanxuan-item.nosdn.127.net/d691b12d383ea93c2108a383e2b1d3cc.png","displaySkuId":300199920,"pieceUnitDesc":"件","resourcesId":0,"discountFlag":false,"name":"不要把病菌刷到嘴里，紫外线牙刷消毒收纳架","productPlace":"","couponPrice":0,"cutFlag":false,"retailPrice":298,"primary":true,"status":2},{"goodCmtCount":0,"couponConflict":true,"scenePicUrl":"https://yanxuan-item.nosdn.127.net/d421db66d7dd061ededcc2bc430780e4.jpg","listPicUrl":"https://yanxuan-item.nosdn.127.net/5b8a31f4fa0045defafbd54c60f7346c.png","tagId":0,"simpleDesc":"泰国进口，绵密香醇","primarySkuPreSellPrice":0,"limitedFlag":204,"newItemFlag":false,"showPicUrl":"https://yanxuan-item.nosdn.127.net/190ef99484d669354838b4f37e0dd336.png","itemTagList":[{"itemId":3986150,"tagId":128129527,"freshmanExclusive":false,"name":"特价","subType":204,"forbidJump":false,"type":2}],"primarySkuPreSellStatus":0,"pieceNum":0,"extra":{"resource":{"materialType":"商品id","materialId":"54639236","itemId":"3986150","materialContentFrom":1,"materialName":"冰封住的绵密香甜，泰国金枕榴莲冻肉 300克","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":7,"itemIdList":["3986150"],"crmUserGroupId":"0","taskId":"54646764"},"modelType":1},"id":3986150,"sellVolume":7901,"isCouponConflict":true,"colorNum":0,"primaryPicUrl":"https://yanxuan-item.nosdn.127.net/5b8a31f4fa0045defafbd54c60f7346c.png","displaySkuId":300185954,"pieceUnitDesc":"件","resourcesId":0,"discountFlag":false,"name":"冰封住的绵密香甜，泰国金枕榴莲冻肉 300克","productPlace":"泰国","counterPrice":68,"couponPrice":0,"cutFlag":false,"retailPrice":63,"primary":true,"status":2}],"freshmanFlag":true,"flashSaleModule":{"activityPrice":199,"primaryPicUrl":"https://yanxuan-item.nosdn.127.net/a5486fc786b49e02cb3fc65686ba89f6.png","nextStartTime":1581904800000,"itemList":[{"itemId":1625008,"picUrl":"https://yanxuan-item.nosdn.127.net/a5486fc786b49e02cb3fc65686ba89f6.png","activityPrice":199,"originPrice":259,"showPicUrl":"https://yanxuan-item.nosdn.127.net/c89c4c86c6cb31805bd537d8c772a231.png"},{"itemId":3529053,"picUrl":"https://yanxuan-item.nosdn.127.net/7d147d6c9f1707f0e0f9b3d825d69775.png","activityPrice":599,"originPrice":799,"showPicUrl":"https://yanxuan-item.nosdn.127.net/bc869ed5218e472655526a89224a6517.png"},{"itemId":1116033,"picUrl":"https://yanxuan-item.nosdn.127.net/d96e57a0fad3675e2f88890e64b8cbd9.png","activityPrice":1189,"originPrice":1399,"showPicUrl":"https://yanxuan-item.nosdn.127.net/91a264d84fed57f97c48dc107370e941.png"},{"itemId":1009013,"picUrl":"https://yanxuan-item.nosdn.127.net/3bbb65a733f290ca6adf5e7772dd761d.png","activityPrice":79,"originPrice":99,"showPicUrl":"https://yanxuan-item.nosdn.127.net/3b7a448ea9a148b76e399b699d78f6c5.png"},{"itemId":3416001,"picUrl":"https://yanxuan-item.nosdn.127.net/9df8cd5635ef6cbe7bbaa008de70caf5.png","activityPrice":55.9,"originPrice":69,"showPicUrl":"https://yanxuan-item.nosdn.127.net/899d91ae4b28e9bb42d617aa6691276d.png"},{"itemId":1683007,"picUrl":"https://yanxuan-item.nosdn.127.net/6b642811e46781dea284df964dd0a68b.png","activityPrice":239,"originPrice":299,"showPicUrl":"https://yanxuan-item.nosdn.127.net/1f93923086cbb7d63be958c920289f05.png"}],"remainTime":1178252,"showFlash":true,"flashSaleScreenId":115102115},"focusList":[{"picUrl":"https://yanxuan.nosdn.127.net/a18ab9d5f61b74b67732a928e8a5ad0f.jpg","expireTime":0,"extra":{"materialContentFrom":1,"materialName":"防疫活动-主会场v2-2.4-2.24","rcmdSort":false,"taskType":1,"itemFrom":0,"resourcesId":1,"materialType":"广告banner","crmUserGroupId":"0","materialId":"54639872","taskId":"54647271"},"name":"防疫活动-主会场v2-2.4-2.24","onlineTime":0,"id":54639872,"originSchemeUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html","targetUrl":"https://act.you.163.com/act/pub/rb10rnjzwE30.html"},{"picUrl":"https://yanxuan.nosdn.127.net/b61633b348f010c7284837c1d7fc9cdd.jpg","expireTime":0,"extra":{"materialContentFrom":1,"materialName":"（智能合图）食品-24节气春季活动-2.17-2.22","rcmdSort":false,"taskType":1,"itemFrom":0,"resourcesId":2,"materialType":"广告banner","crmUserGroupId":"0","materialId":"54640120","taskId":"54647349"},"name":"（智能合图）食品-24节气春季活动-2.17-2.22","onlineTime":0,"id":54640120,"originSchemeUrl":"https://act.you.163.com/act/pub/aBDdgGR7skrV.html","targetUrl":"https://act.you.163.com/act/pub/aBDdgGR7skrV.html"},{"picUrl":"https://yanxuan.nosdn.127.net/fb5a9555c539bca5af2a4721923365a4.jpg","expireTime":0,"extra":{"materialContentFrom":1,"materialName":"食品-吃喝到家 强健抵抗力-2.11-2.24","rcmdSort":false,"taskType":1,"itemFrom":0,"resourcesId":3,"materialType":"广告banner","crmUserGroupId":"0","materialId":"54639858","taskId":"54647354"},"name":"食品-吃喝到家 强健抵抗力-2.11-2.24","onlineTime":0,"id":54639858,"originSchemeUrl":"https://act.you.163.com/act/pub/HW3LkZ184cR5.html","targetUrl":"https://act.you.163.com/act/pub/HW3LkZ184cR5.html"},{"picUrl":"https://yanxuan.nosdn.127.net/6b1ebd19470cea9a7b8e81a52485f414.jpg","expireTime":0,"extra":{"materialContentFrom":1,"materialName":"防疫活动-春运榜单-2.5-长期","rcmdSort":false,"taskType":1,"itemFrom":0,"resourcesId":4,"materialType":"广告banner","crmUserGroupId":"0","materialId":"54639594","taskId":"54647422"},"name":"防疫活动-春运榜单-2.5-长期","onlineTime":0,"id":54639594,"originSchemeUrl":"https://m.you.163.com/topic/v1/pub/ythX1hoqoUBs.html","targetUrl":"https://m.you.163.com/topic/v1/pub/ythX1hoqoUBs.html"},{"picUrl":"https://yanxuan.nosdn.127.net/b87939fc55cf938f3a32c2eadb14afc9.jpg","expireTime":0,"extra":{"materialContentFrom":1,"materialName":"防疫活动-居家v2-2.4-2.24","rcmdSort":false,"taskType":1,"itemFrom":0,"resourcesId":5,"materialType":"广告banner","crmUserGroupId":"0","materialId":"54639567","taskId":"54647274"},"name":"防疫活动-居家v2-2.4-2.24","onlineTime":0,"id":54639567,"originSchemeUrl":"https://act.you.163.com/act/pub/tKsjjWIXOli3.html","targetUrl":"https://act.you.163.com/act/pub/tKsjjWIXOli3.html"},{"picUrl":"https://yanxuan.nosdn.127.net/8c5af34810092b0cfe59d1020b28bcfe.jpg","expireTime":0,"extra":{"materialContentFrom":1,"materialName":"专题-防疫活动-高效清洁剂系列-2.6-长期","rcmdSort":false,"taskType":1,"itemFrom":0,"resourcesId":6,"materialType":"广告banner","crmUserGroupId":"0","materialId":"54639639","taskId":"54647275"},"name":"专题-防疫活动-高效清洁剂系列-2.6-长期","onlineTime":0,"id":54639639,"originSchemeUrl":"https://m.you.163.com/featuredSeries/detail?id=1000071","targetUrl":"https://m.you.163.com/featuredSeries/detail?id=1000071"},{"picUrl":"https://yanxuan.nosdn.127.net/810f6d9c5a04bb6eadbe20259784c16f.jpg","expireTime":0,"extra":{"materialContentFrom":1,"materialName":"专题-养生茶选购指南-2.14-2.29","rcmdSort":false,"taskType":1,"itemFrom":0,"resourcesId":7,"materialType":"广告banner","crmUserGroupId":"0","materialId":"54640089","taskId":"54647276"},"name":"专题-养生茶选购指南-2.14-2.29","onlineTime":0,"id":54640089,"originSchemeUrl":"https://act.you.163.com/act/pub/0ld8l37apcST.html","targetUrl":"https://act.you.163.com/act/pub/0ld8l37apcST.html"},{"picUrl":"https://yanxuan.nosdn.127.net/1d7c3ba8e117391e9377c2d0f4780e5b.jpg","expireTime":0,"extra":{"materialContentFrom":1,"materialName":"一个人住的好生活-长期","rcmdSort":false,"taskType":1,"itemFrom":0,"resourcesId":8,"materialType":"广告banner","crmUserGroupId":"0","materialId":"54639753","taskId":"54647350"},"name":"一个人住的好生活-长期","onlineTime":0,"id":54639753,"originSchemeUrl":"https://m.you.163.com/topic/v1/pub/OZIAh5mKTwac.html","targetUrl":"https://m.you.163.com/topic/v1/pub/OZIAh5mKTwac.html"}],"sceneLightShoppingGuideModule":[{"styleItem":{"backgroundUrl":"https://yanxuan.nosdn.127.net/b143c18172b5433310ff1f2adf281792.png","descColor":"7f7f7f","itemFrom":3,"picUrlList":["https://yanxuan-item.nosdn.127.net/5e818e36e0cfd0bb474c57f27e76b46d.png","https://yanxuan-item.nosdn.127.net/445689c4faa55f8186c500e68bff73d6.png"],"titleColor":"333333","extra":{"materialContentFrom":1,"materialName":"专题 断货补单王-new","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":1,"materialType":"场景轻导购","crmUserGroupId":"0","materialId":"46963134","taskId":"54644161"},"itemPicBeanList":[{"itemId":1006014,"picUrl":"https://yanxuan-item.nosdn.127.net/b097972db0ed9d5b47fbed0e2dbd1d99.png"},{"itemId":1009024,"picUrl":"https://yanxuan-item.nosdn.127.net/5e818e36e0cfd0bb474c57f27e76b46d.png"},{"itemId":1021020,"picUrl":"https://yanxuan-item.nosdn.127.net/445689c4faa55f8186c500e68bff73d6.png"},{"itemId":1023003,"picUrl":"https://yanxuan-item.nosdn.127.net/38d4d231bfa58be9998fd2feba15e908.png"},{"itemId":1085019,"picUrl":"https://yanxuan-item.nosdn.127.net/c27abf14fa51f922122d9c81d7e68bd8.png"},{"itemId":1108008,"picUrl":"https://yanxuan-item.nosdn.127.net/0fecbab07b9a3522015958ba8f31e27a.png"},{"itemId":1109013,"picUrl":"https://yanxuan-item.nosdn.127.net/3b7bbecb7acfe2e56a515ccebc060e77.png"},{"itemId":1109034,"picUrl":"https://yanxuan-item.nosdn.127.net/ccf82ca5058794d1fc27a8db204dec17.png"},{"itemId":1110003,"picUrl":"https://yanxuan-item.nosdn.127.net/9a33f08a3b0f5c06fdf4c586d51b2f7c.png"},{"itemId":1115009,"picUrl":"https://yanxuan-item.nosdn.127.net/6df81c2f8582dbc597acadf8f1089a6a.png"},{"itemId":1115059,"picUrl":"https://yanxuan-item.nosdn.127.net/cb80f9a76a8b4fbbedde4379ecad4b1e.png"},{"itemId":1116033,"picUrl":"https://yanxuan-item.nosdn.127.net/91a264d84fed57f97c48dc107370e941.png"},{"itemId":1127003,"picUrl":"https://yanxuan-item.nosdn.127.net/84454f5de65796c78a5ef9f3d6b7d843.png"},{"itemId":1127007,"picUrl":"https://yanxuan-item.nosdn.127.net/ecef155d279e1a485b4f31f87daa3698.png"},{"itemId":1130056,"picUrl":"https://yanxuan-item.nosdn.127.net/89d86a4e463115e366daf841b9bcff46.png"},{"itemId":1135047,"picUrl":"https://yanxuan-item.nosdn.127.net/eddaeb4852b8a4732102eab839641c95.png"},{"itemId":1145021,"picUrl":"https://yanxuan-item.nosdn.127.net/9929e5ba245313a3db4a80ea7504f61d.png"},{"itemId":1149000,"picUrl":"https://yanxuan-item.nosdn.127.net/16b4d581afc5a9cd36e8adc8ed6ceb4f.png"},{"itemId":1154003,"picUrl":"https://yanxuan-item.nosdn.127.net/7a0e064c1fd99b5eb16608bca9b7aa0d.png"},{"itemId":1193014,"picUrl":"https://yanxuan-item.nosdn.127.net/bf56acb6a6fa46a44f17c25e70645501.png"},{"itemId":1197009,"picUrl":"https://yanxuan-item.nosdn.127.net/451ee6d21410297df3b2ed923f45d07d.png"},{"itemId":1221001,"picUrl":"https://yanxuan-item.nosdn.127.net/8f4265e206020ecfbbe34c2a2d230fb2.png"},{"itemId":1292003,"picUrl":"https://yanxuan-item.nosdn.127.net/1d85a516aadbeb11978f325f205820b9.png"},{"itemId":1298009,"picUrl":"https://yanxuan-item.nosdn.127.net/024f82132c69893cef7f6db17d7ca8f1.png"},{"itemId":1305017,"picUrl":"https://yanxuan-item.nosdn.127.net/659500940eba07cf9b9940e996d4bc66.png"},{"itemId":1306026,"picUrl":"https://yanxuan-item.nosdn.127.net/63967eb40b0af505f1fd066442952bab.png"},{"itemId":1306027,"picUrl":"https://yanxuan-item.nosdn.127.net/271eb0b3d94e80579afdeb614cc240ad.png"},{"itemId":1318002,"picUrl":"https://yanxuan-item.nosdn.127.net/644a27b8e168b8fe8e43ccaad934b24e.png"},{"itemId":1365002,"picUrl":"https://yanxuan-item.nosdn.127.net/50d83c848125577c2bcc1f60c16280ac.png"},{"itemId":1369013,"picUrl":"https://yanxuan-item.nosdn.127.net/91210d925dd625e0c2a81e54890bf345.png"},{"itemId":1389000,"picUrl":"https://yanxuan-item.nosdn.127.net/64c3915f7edb71c10dbfbd18441f271c.png"},{"itemId":1398016,"picUrl":"https://yanxuan-item.nosdn.127.net/9d581d4ec02cf86ff2a05cf81868f159.png"},{"itemId":1401006,"picUrl":"https://yanxuan-item.nosdn.127.net/5e702b909a7d0cf391bfa8d3fce03c92.png"},{"itemId":1417023,"picUrl":"https://yanxuan-item.nosdn.127.net/6f8849cd376ea181f977f0ae40f309eb.png"},{"itemId":1429006,"picUrl":"https://yanxuan-item.nosdn.127.net/88632d540cae0e1c05f0134d3c76905d.png"},{"itemId":1435022,"picUrl":"https://yanxuan-item.nosdn.127.net/7b5815dba28684d89601e0643e2a1b56.png"},{"itemId":1450007,"picUrl":"https://yanxuan-item.nosdn.127.net/dcabfb063d4d0f84688a49941d5deb11.png"},{"itemId":1458000,"picUrl":"https://yanxuan-item.nosdn.127.net/e290e08fca0e9d2cf9605272a2b07aa6.png"},{"itemId":1460022,"picUrl":"https://yanxuan-item.nosdn.127.net/26ff24df419c0b051c4e46574403c7ad.png"},{"itemId":1462040,"picUrl":"https://yanxuan-item.nosdn.127.net/e4c7e5a4ccb531e0ad6b066df0429813.png"},{"itemId":1468014,"picUrl":"https://yanxuan-item.nosdn.127.net/8ff83d4079c2dbf64db5ef984fbbaa2b.png"},{"itemId":1476005,"picUrl":"https://yanxuan-item.nosdn.127.net/c10eb9001206096698f2451f3c383c7b.png"},{"itemId":1487026,"picUrl":"https://yanxuan-item.nosdn.127.net/2b43ce0ad0b9e95b264b023cb60a4353.png"},{"itemId":1497001,"picUrl":"https://yanxuan-item.nosdn.127.net/7c850ef50fc408c4eab4d7abdb920da3.png"},{"itemId":1498025,"picUrl":"https://yanxuan-item.nosdn.127.net/23e2ba8b86ecdc9a46ec9df99d00e86d.png"},{"itemId":1505027,"picUrl":"https://yanxuan-item.nosdn.127.net/17aeee124855d7e7eb24b19579e230e5.png"},{"itemId":1505029,"picUrl":"https://yanxuan-item.nosdn.127.net/ea9af61f4504871f72c4b9ef38ca4799.png"},{"itemId":1506045,"picUrl":"https://yanxuan-item.nosdn.127.net/1e18863d306689a49ca0370a269ba0db.png"},{"itemId":1512034,"picUrl":"https://yanxuan-item.nosdn.127.net/4501a4154cf56c90d555701b5b435947.png"},{"itemId":1516008,"picUrl":"https://yanxuan-item.nosdn.127.net/6b172c71a23491d31db63b97a39f1f53.png"},{"itemId":1535010,"picUrl":"https://yanxuan-item.nosdn.127.net/59eb7e52ab114c894a8179bc2991122b.png"},{"itemId":1535011,"picUrl":"https://yanxuan-item.nosdn.127.net/e37656ecad9a2494f456e222fe7800a2.png"},{"itemId":1545016,"picUrl":"https://yanxuan-item.nosdn.127.net/6cdb3da46a4b95b36dea89d6d47d3bd9.png"},{"itemId":1553041,"picUrl":"https://yanxuan-item.nosdn.127.net/11d98dbe3f5b1099b479dfb8dacdf89d.png"},{"itemId":1572026,"picUrl":"https://yanxuan-item.nosdn.127.net/83f18fba460c27b4785cc65f19385a34.png"},{"itemId":1589012,"picUrl":"https://yanxuan-item.nosdn.127.net/08ba712ea8e3074922c9046601218fc3.png"},{"itemId":1601000,"picUrl":"https://yanxuan-item.nosdn.127.net/7bb60cd94cb436726b8db296fda698fc.png"},{"itemId":1604016,"picUrl":"https://yanxuan-item.nosdn.127.net/74662d24f6d217b520178c5a6d031457.png"},{"itemId":1606002,"picUrl":"https://yanxuan-item.nosdn.127.net/f444ac11115a8249a92dc95dccad6e07.png"},{"itemId":1620018,"picUrl":"https://yanxuan-item.nosdn.127.net/00bd304b98650d5fe73b68635771ea4d.png"},{"itemId":1621018,"picUrl":"https://yanxuan-item.nosdn.127.net/b051b5aa933cde8d952905becd2046d8.png"},{"itemId":1621025,"picUrl":"https://yanxuan-item.nosdn.127.net/b74d5c3b31398f145b30bf761d72affc.png"},{"itemId":1622005,"picUrl":"https://yanxuan-item.nosdn.127.net/cc9556998b8b3047bc18ba8f23c86ed3.png"},{"itemId":1623004,"picUrl":"https://yanxuan-item.nosdn.127.net/47a68d94263be9494482d55caed9bed8.png"},{"itemId":1624001,"picUrl":"https://yanxuan-item.nosdn.127.net/51348ec7731f5ed5c4bb9e0bed88717c.png"},{"itemId":1625008,"picUrl":"https://yanxuan-item.nosdn.127.net/c89c4c86c6cb31805bd537d8c772a231.png"},{"itemId":1629001,"picUrl":"https://yanxuan-item.nosdn.127.net/f95b39abadbcb55953abd2cff2e0c001.png"},{"itemId":1630007,"picUrl":"https://yanxuan-item.nosdn.127.net/86989f8cb0ece3d5ebf903b988abae79.png"},{"itemId":1636017,"picUrl":"https://yanxuan-item.nosdn.127.net/4d0c383d52e675f7c5d9aad6b8799699.png"},{"itemId":1669011,"picUrl":"https://yanxuan-item.nosdn.127.net/b70e5e1786a175c574514c293bd88971.png"},{"itemId":1672038,"picUrl":"https://yanxuan-item.nosdn.127.net/79fb28d0a101f704d2fa3665273dbc1a.png"},{"itemId":1674003,"picUrl":"https://yanxuan-item.nosdn.127.net/e30375922143f7fad7465fb56bc5acd6.png"},{"itemId":1686032,"picUrl":"https://yanxuan-item.nosdn.127.net/52c5108883fa57ca1707d22c7ed41aa7.png"},{"itemId":1690003,"picUrl":"https://yanxuan-item.nosdn.127.net/a9d6de39ab17ab82d5424205dafc4136.png"},{"itemId":3381014,"picUrl":"https://yanxuan-item.nosdn.127.net/ed85b7028d4620bdcd46db6405b445b4.png"},{"itemId":3398008,"picUrl":"https://yanxuan-item.nosdn.127.net/dfc5f3de3aeaf0b4616c644b23df35a8.png"},{"itemId":3407065,"picUrl":"https://yanxuan-item.nosdn.127.net/8710b394afc12ff039fac08dfb9333bb.png"},{"itemId":3408014,"picUrl":"https://yanxuan-item.nosdn.127.net/0434f5cb29b2c6c6ade2f1c0487ae97c.png"},{"itemId":3413004,"picUrl":"https://yanxuan-item.nosdn.127.net/30fe9253a061b5c4c7c389b7caf24a67.png"},{"itemId":3440070,"picUrl":"https://yanxuan-item.nosdn.127.net/2445e4d9070508d170ade17135e6cacc.png"},{"itemId":3447007,"picUrl":"https://yanxuan-item.nosdn.127.net/b74cd5601ba0e3b205e694943e978c5f.png"},{"itemId":3455001,"picUrl":"https://yanxuan-item.nosdn.127.net/d82be6b363e282825bf858696ce40ee3.png"},{"itemId":3478023,"picUrl":"https://yanxuan-item.nosdn.127.net/08f6e74986069813ab7dab4c2491cf96.png"},{"itemId":3526027,"picUrl":"https://yanxuan-item.nosdn.127.net/b9cda216c597fd2297432a893d3da371.png"},{"itemId":3534014,"picUrl":"https://yanxuan-item.nosdn.127.net/75ce66f46c287cc512749f9e8328f0b3.png"},{"itemId":3802025,"picUrl":"https://yanxuan-item.nosdn.127.net/f961b628a67e5a95150b962a48963b6d.png"}],"originSchemeUrl":"https://m.you.163.com/cms-op/wap/17.html","title":"断货补单王","targetUrl":"https://m.you.163.com/cms-op/wap/17.html","desc":"紧急补仓疯抢中"}},{"styleItem":{"backgroundUrl":"https://yanxuan.nosdn.127.net/f874dbb9da6101748d015d972a44d78e.png","descColor":"7f7f7f","itemFrom":3,"picUrlList":["https://yanxuan-item.nosdn.127.net/1eecf74b769af3ed4c7817aeb5d6bb2b.png","https://yanxuan-item.nosdn.127.net/be4d030d4b4a8a4bf096714ec5b2a4aa.png"],"titleColor":"333333","extra":{"materialContentFrom":1,"materialName":"专题 回购榜new-文案","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"","resourcesId":2,"materialType":"场景轻导购","crmUserGroupId":"0","materialId":"46564203","taskId":"54644162"},"itemPicBeanList":[{"itemId":1006058,"picUrl":"https://yanxuan-item.nosdn.127.net/1eecf74b769af3ed4c7817aeb5d6bb2b.png"},{"itemId":1021020,"picUrl":"https://yanxuan-item.nosdn.127.net/445689c4faa55f8186c500e68bff73d6.png"},{"itemId":1023000,"picUrl":"https://yanxuan-item.nosdn.127.net/be4d030d4b4a8a4bf096714ec5b2a4aa.png"},{"itemId":1023014,"picUrl":"https://yanxuan-item.nosdn.127.net/056e0e74a683d7e0011bd583d0084b7c.png"},{"itemId":1031002,"picUrl":"https://yanxuan-item.nosdn.127.net/42cb1e188fac9347eabdb8cfc8c27f74.png"},{"itemId":1046005,"picUrl":"https://yanxuan-item.nosdn.127.net/8a8eeefd81555eec03a673abbc24615a.png"},{"itemId":1055027,"picUrl":"https://yanxuan-item.nosdn.127.net/6db2949655ada5b2148f5f667e10172d.png"},{"itemId":1056000,"picUrl":"https://yanxuan-item.nosdn.127.net/7be46223373b04fc2f42e0bd2add4d61.png"},{"itemId":1056006,"picUrl":"https://yanxuan-item.nosdn.127.net/f608f7868d43c5ac67fc03189b07c589.png"},{"itemId":1056013,"picUrl":"https://yanxuan-item.nosdn.127.net/4f10a45de3d6818dbd75e9bfb119cac1.png"},{"itemId":1057033,"picUrl":"https://yanxuan-item.nosdn.127.net/2a6c649e26ddd566b3ea8c38cab20155.png"},{"itemId":1060007,"picUrl":"https://yanxuan-item.nosdn.127.net/79ffc02578c43ae1dc10782b9a98c225.png"},{"itemId":1062033,"picUrl":"https://yanxuan-item.nosdn.127.net/569ab2c87df93c56de39b8c890463242.png"},{"itemId":1076004,"picUrl":"https://yanxuan-item.nosdn.127.net/39e2e51fabe9256a3bba0fab776d5e33.png"},{"itemId":1077003,"picUrl":"https://yanxuan-item.nosdn.127.net/a10ed5c19533c9e1e2abf1d8cb843c24.png"},{"itemId":1085007,"picUrl":"https://yanxuan-item.nosdn.127.net/05eed5e90b2d6002600dddd4dd66260d.png"},{"itemId":1092026,"picUrl":"https://yanxuan-item.nosdn.127.net/58fdbceab428754d9b8e8b3019d84c4e.png"},{"itemId":1097000,"picUrl":"https://yanxuan-item.nosdn.127.net/6e05a3a46a46a34e7fa5b86c122a0787.png"},{"itemId":1108028,"picUrl":"https://yanxuan-item.nosdn.127.net/38779b7e649b2e02f2a689bff17cbc42.png"},{"itemId":1109013,"picUrl":"https://yanxuan-item.nosdn.127.net/3b7bbecb7acfe2e56a515ccebc060e77.png"},{"itemId":1113001,"picUrl":"https://yanxuan-item.nosdn.127.net/431a09a43914483f4d70aeda8ecb8a59.png"},{"itemId":1114010,"picUrl":"https://yanxuan-item.nosdn.127.net/58b7b4a5277dddbfd9b99b07f38b6c20.png"},{"itemId":1115009,"picUrl":"https://yanxuan-item.nosdn.127.net/6df81c2f8582dbc597acadf8f1089a6a.png"},{"itemId":1116034,"picUrl":"https://yanxuan-item.nosdn.127.net/cfd2ab8d2ea2188ff422c5c91c1d920c.png"},{"itemId":1124015,"picUrl":"https://yanxuan-item.nosdn.127.net/3f9a412e160d7e864442ce28f42d7e08.png"},{"itemId":1127007,"picUrl":"https://yanxuan-item.nosdn.127.net/ecef155d279e1a485b4f31f87daa3698.png"},{"itemId":1129016,"picUrl":"https://yanxuan-item.nosdn.127.net/3f06df1af8138410617e9b9aa05c3330.png"},{"itemId":1134051,"picUrl":"https://yanxuan-item.nosdn.127.net/0c807260926eb396d65e8d697d923bbf.png"},{"itemId":1134066,"picUrl":"https://yanxuan-item.nosdn.127.net/1b8e4a484e128c28a050cd2bc0c64396.png"},{"itemId":1135047,"picUrl":"https://yanxuan-item.nosdn.127.net/eddaeb4852b8a4732102eab839641c95.png"},{"itemId":1137006,"picUrl":"https://yanxuan-item.nosdn.127.net/af7fe534423a1d316e49bf84986a01c2.png"},{"itemId":1142056,"picUrl":"https://yanxuan-item.nosdn.127.net/af034280b9feb9795d01052496eef8d7.png"},{"itemId":1146006,"picUrl":"https://yanxuan-item.nosdn.127.net/6763c33e5242040e7e678630b4e6eba5.png"},{"itemId":1146007,"picUrl":"https://yanxuan-item.nosdn.127.net/0188adf6cdc4c1159fe647fa5092cb0f.png"},{"itemId":1149005,"picUrl":"https://yanxuan-item.nosdn.127.net/8427b14107deadbc140e95367ae38d5e.png"},{"itemId":1156005,"picUrl":"https://yanxuan-item.nosdn.127.net/d3fa30a9d0152e3223ce8a945e5a20d7.png"},{"itemId":1156119,"picUrl":"https://yanxuan-item.nosdn.127.net/600a367b9e1ea02cbbdddbc528610155.png"},{"itemId":1164006,"picUrl":"https://yanxuan-item.nosdn.127.net/e9de2a3b586c3cbed7fd621d7810d2f4.png"},{"itemId":1165015,"picUrl":"https://yanxuan-item.nosdn.127.net/17c3596d257753108d1d471b8ea4d385.png"},{"itemId":1165060,"picUrl":"https://yanxuan-item.nosdn.127.net/1d4c2ef77a2bb131239904b450d13972.png"},{"itemId":1189010,"picUrl":"https://yanxuan-item.nosdn.127.net/327fcfaa9ad513279fba3ac896ea4336.png"},{"itemId":1197009,"picUrl":"https://yanxuan-item.nosdn.127.net/451ee6d21410297df3b2ed923f45d07d.png"},{"itemId":1199020,"picUrl":"https://yanxuan-item.nosdn.127.net/e40487bb477b7392456f8f876d51ba58.png"},{"itemId":1199024,"picUrl":"https://yanxuan-item.nosdn.127.net/f6020d78fddf899a2622e4f4502ae967.png"},{"itemId":1225000,"picUrl":"https://yanxuan-item.nosdn.127.net/a730a83e9599459d80096a0dec8c500e.png"},{"itemId":1242000,"picUrl":"https://yanxuan-item.nosdn.127.net/c118cd431a41c3942bd34f9aa4ca80cc.png"},{"itemId":1253002,"picUrl":"https://yanxuan-item.nosdn.127.net/b49de3cf17c7dc92746f994b2296fd05.png"},{"itemId":1292003,"picUrl":"https://yanxuan-item.nosdn.127.net/1d85a516aadbeb11978f325f205820b9.png"},{"itemId":1306019,"picUrl":"https://yanxuan-item.nosdn.127.net/74eb39b9cd945dd0a336a3ce0f196fbc.png"},{"itemId":1314016,"picUrl":"https://yanxuan-item.nosdn.127.net/c73e4aa55503b7900209aa454be55dbf.png"},{"itemId":1318002,"picUrl":"https://yanxuan-item.nosdn.127.net/644a27b8e168b8fe8e43ccaad934b24e.png"},{"itemId":1321000,"picUrl":"https://yanxuan-item.nosdn.127.net/39e5df244905c79abf947fb4a534699d.png"},{"itemId":1323007,"picUrl":"https://yanxuan-item.nosdn.127.net/588d3261656320815632763a70925527.png"},{"itemId":1325028,"picUrl":"https://yanxuan-item.nosdn.127.net/e7f4dec7ff46ee289621e24cc78bc8df.png"},{"itemId":1356013,"picUrl":"https://yanxuan-item.nosdn.127.net/a57c294dbf1ef6c476703ae5a57b6b4b.png"},{"itemId":1358009,"picUrl":"https://yanxuan-item.nosdn.127.net/e5dac755e5d501f67e992d88fa401ce8.png"},{"itemId":1369012,"picUrl":"https://yanxuan-item.nosdn.127.net/516f9a53f493673fa6da347cd2bf93a7.png"},{"itemId":1391001,"picUrl":"https://yanxuan-item.nosdn.127.net/08ed8b0e068a3ff2a0aae8c427db1858.png"},{"itemId":1397006,"picUrl":"https://yanxuan-item.nosdn.127.net/65da8671e33bf88c98c2acdd694b156d.png"},{"itemId":1398011,"picUrl":"https://yanxuan-item.nosdn.127.net/84455b9ed53b6f29d3463d05fa6bf907.png"},{"itemId":1398015,"picUrl":"https://yanxuan-item.nosdn.127.net/1985e340c80c8b8b92555368faadbd89.png"},{"itemId":1435022,"picUrl":"https://yanxuan-item.nosdn.127.net/7b5815dba28684d89601e0643e2a1b56.png"},{"itemId":1469019,"picUrl":"https://yanxuan-item.nosdn.127.net/0040559ca37f3a088d2edd247d71f721.png"},{"itemId":1490004,"picUrl":"https://yanxuan-item.nosdn.127.net/664f2823ff24deab4ddbac4257e74c50.png"},{"itemId":1503004,"picUrl":"https://yanxuan-item.nosdn.127.net/c449cda7439ae40e1c0e16f2a701619a.png"},{"itemId":1506021,"picUrl":"https://yanxuan-item.nosdn.127.net/98f00e8b15f30c11e3e64f1da7fba591.png"},{"itemId":1506032,"picUrl":"https://yanxuan-item.nosdn.127.net/4808526f99e3e912a645dd2e4c5a20d0.png"},{"itemId":1512027,"picUrl":"https://yanxuan-item.nosdn.127.net/d3f4d9b6df8ea22c43f637469363abcf.png"},{"itemId":1513025,"picUrl":"https://yanxuan-item.nosdn.127.net/6fc85a398808d3247d1ffcb4810298bb.png"},{"itemId":1513031,"picUrl":"https://yanxuan-item.nosdn.127.net/9b3447a8a2716c284859a72b9b03b53d.png"},{"itemId":1527004,"picUrl":"https://yanxuan-item.nosdn.127.net/ded687f676cc7a8a858cc00bc8c5119a.png"},{"itemId":1552007,"picUrl":"https://yanxuan-item.nosdn.127.net/36f83fc61bab85ae138638f479f42fa3.png"},{"itemId":1561001,"picUrl":"https://yanxuan-item.nosdn.127.net/0064e22029d052276c2f8e49b1f3973d.png"},{"itemId":1564054,"picUrl":"https://yanxuan-item.nosdn.127.net/951f0223f005fb0d5d85cffba86622d6.png"},{"itemId":1572013,"picUrl":"https://yanxuan-item.nosdn.127.net/7e4db021bc68c9af8eddecdb1aa96c36.png"},{"itemId":1605001,"picUrl":"https://yanxuan-item.nosdn.127.net/b89e1647728d4ad29180ce52a6ebbedb.png"},{"itemId":1624017,"picUrl":"https://yanxuan-item.nosdn.127.net/b6dd9b0d4c403d38c208019f207a69e3.png"},{"itemId":1656012,"picUrl":"https://yanxuan-item.nosdn.127.net/f08f80a81ecef8418b2434f083c7129d.png"},{"itemId":1666060,"picUrl":"https://yanxuan-item.nosdn.127.net/355e0781cabbdfa084bf947aabceacf0.png"},{"itemId":1672002,"picUrl":"https://yanxuan-item.nosdn.127.net/59e8fa6fa2ffec391fae8d99e9c9aeee.png"},{"itemId":1673009,"picUrl":"https://yanxuan-item.nosdn.127.net/6b396a24be431d003b00316495b98a52.png"},{"itemId":3394032,"picUrl":"https://yanxuan-item.nosdn.127.net/951ecc96ffd33ddd680257c48d64a484.png"},{"itemId":3395000,"picUrl":"https://yanxuan-item.nosdn.127.net/3680159bab0ac5fc0c404640a6593b93.png"},{"itemId":3402020,"picUrl":"https://yanxuan-item.nosdn.127.net/2c0147161faaa160cf10b6770f1e290d.png"},{"itemId":3408049,"picUrl":"https://yanxuan-item.nosdn.127.net/03faa79c841e439c9aeb645977f4f8f7.png"},{"itemId":3408050,"picUrl":"https://yanxuan-item.nosdn.127.net/5a0d395159cf7f51d48c45599b96df3f.png"},{"itemId":3432036,"picUrl":"https://yanxuan-item.nosdn.127.net/4a89b652c30fbfc6b40adfe08d996aa3.png"},{"itemId":3447007,"picUrl":"https://yanxuan-item.nosdn.127.net/b74cd5601ba0e3b205e694943e978c5f.png"},{"itemId":3455001,"picUrl":"https://yanxuan-item.nosdn.127.net/d82be6b363e282825bf858696ce40ee3.png"},{"itemId":3469054,"picUrl":"https://yanxuan-item.nosdn.127.net/591ce4c819434a8c4365d06b5ca6e75e.png"},{"itemId":3481270,"picUrl":"https://yanxuan-item.nosdn.127.net/00e55362f57545ed4efdb32d83fe389f.png"}],"originSchemeUrl":"https://m.you.163.com/topic/v1/pub/GpCIMFZBO2.html","title":"无限回购榜单","targetUrl":"https://m.you.163.com/topic/v1/pub/GpCIMFZBO2.html","desc":"买了又买的超值好物"}},{"styleItem":{"backgroundUrl":"https://yanxuan.nosdn.127.net/e9cf9142f68e0fd944b07940ce9d8ec7.png","descColor":"7f7f7f","itemFrom":3,"picUrlList":["https://yanxuan-item.nosdn.127.net/3321ee2d70b1e062422b40e4cb2cc74b.png","https://yanxuan-item.nosdn.127.net/b2065eab67acc5923a8ec71167a35f6a.png"],"titleColor":"333333","extra":{"materialContentFrom":1,"materialName":"必买好物-2月篇","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":3,"materialType":"场景轻导购","crmUserGroupId":"0","materialId":"54639337","taskId":"54646221"},"itemPicBeanList":[{"itemId":1009024,"picUrl":"https://yanxuan-item.nosdn.127.net/5e818e36e0cfd0bb474c57f27e76b46d.png"},{"itemId":1027017,"picUrl":"https://yanxuan-item.nosdn.127.net/3321ee2d70b1e062422b40e4cb2cc74b.png"},{"itemId":1037001,"picUrl":"https://yanxuan-item.nosdn.127.net/b2065eab67acc5923a8ec71167a35f6a.png"},{"itemId":1075011,"picUrl":"https://yanxuan-item.nosdn.127.net/c2e290dda5250cb83de7bfce5dfb1b32.png"},{"itemId":1097000,"picUrl":"https://yanxuan-item.nosdn.127.net/6e05a3a46a46a34e7fa5b86c122a0787.png"},{"itemId":1109013,"picUrl":"https://yanxuan-item.nosdn.127.net/3b7bbecb7acfe2e56a515ccebc060e77.png"},{"itemId":1116033,"picUrl":"https://yanxuan-item.nosdn.127.net/91a264d84fed57f97c48dc107370e941.png"},{"itemId":1129016,"picUrl":"https://yanxuan-item.nosdn.127.net/3f06df1af8138410617e9b9aa05c3330.png"},{"itemId":1164007,"picUrl":"https://yanxuan-item.nosdn.127.net/7d4bacc5e3f4ed6c302db032cd953204.png"},{"itemId":1173006,"picUrl":"https://yanxuan-item.nosdn.127.net/ea8f5714ef50441d01930f4638eb98e1.png"},{"itemId":1197009,"picUrl":"https://yanxuan-item.nosdn.127.net/451ee6d21410297df3b2ed923f45d07d.png"},{"itemId":1241013,"picUrl":"https://yanxuan-item.nosdn.127.net/ff3cfd89ce1664eb70701f4f273ee562.png"},{"itemId":1245014,"picUrl":"https://yanxuan-item.nosdn.127.net/068b1375219cec84915cebcb8488f693.png"},{"itemId":1275000,"picUrl":"https://yanxuan-item.nosdn.127.net/c6c31c7160d2e6f7e367b74b23fd5c64.png"},{"itemId":1283015,"picUrl":"https://yanxuan-item.nosdn.127.net/467d1114d8bfb3208eda60c47619838a.png"},{"itemId":1325030,"picUrl":"https://yanxuan-item.nosdn.127.net/7f77125f98386cfd48938a5f43b30af0.png"},{"itemId":1382009,"picUrl":"https://yanxuan-item.nosdn.127.net/2f8347e13a8d7174704b87a8a05918d3.png"},{"itemId":1397017,"picUrl":"https://yanxuan-item.nosdn.127.net/de1812569b00c3cd600589b160893db4.png"},{"itemId":1419007,"picUrl":"https://yanxuan-item.nosdn.127.net/ee6eb8203527dbe5a749b9f5f3c6fe27.png"},{"itemId":1435010,"picUrl":"https://yanxuan-item.nosdn.127.net/3a1e52236c16b06d2c433e1ab82cc788.png"},{"itemId":1435017,"picUrl":"https://yanxuan-item.nosdn.127.net/bc0df62fde0d585cb6d001299152328c.png"},{"itemId":1447057,"picUrl":"https://yanxuan-item.nosdn.127.net/09fefff18127bd81742707a4adb56968.png"},{"itemId":1475015,"picUrl":"https://yanxuan-item.nosdn.127.net/793d9e467b2f64348722151a362d4673.png"},{"itemId":1487008,"picUrl":"https://yanxuan-item.nosdn.127.net/57820c78a765022243576b344927fdbb.png"},{"itemId":1487013,"picUrl":"https://yanxuan-item.nosdn.127.net/0542500ca5edef888ad0d0461392853b.png"},{"itemId":1494003,"picUrl":"https://yanxuan-item.nosdn.127.net/0ac21674d619c4558d99c0f380fd5b71.png"},{"itemId":1498025,"picUrl":"https://yanxuan-item.nosdn.127.net/23e2ba8b86ecdc9a46ec9df99d00e86d.png"},{"itemId":1501008,"picUrl":"https://yanxuan-item.nosdn.127.net/fbae3a43b448d2e6e6671936ba665b99.png"},{"itemId":1506015,"picUrl":"https://yanxuan-item.nosdn.127.net/d372755e9371b65f8638a372cac0d177.png"},{"itemId":1512033,"picUrl":"https://yanxuan-item.nosdn.127.net/1dcae085a33838163c69ced60e48a9e8.png"},{"itemId":1516008,"picUrl":"https://yanxuan-item.nosdn.127.net/6b172c71a23491d31db63b97a39f1f53.png"},{"itemId":1549000,"picUrl":"https://yanxuan-item.nosdn.127.net/abe76ae78cdd8ac1a1a82878a03d1deb.png"},{"itemId":1555000,"picUrl":"https://yanxuan-item.nosdn.127.net/57103d892fa09deae9ef9e56c301f14a.png"},{"itemId":1574001,"picUrl":"https://yanxuan-item.nosdn.127.net/ca28789b69f41959f8a7aaf341e42bde.png"},{"itemId":1604004,"picUrl":"https://yanxuan-item.nosdn.127.net/8bbed559f8d497919b929404b8c55110.png"},{"itemId":1625008,"picUrl":"https://yanxuan-item.nosdn.127.net/c89c4c86c6cb31805bd537d8c772a231.png"},{"itemId":1635010,"picUrl":"https://yanxuan-item.nosdn.127.net/c417a2c9ea84671a959d886ad482629d.png"},{"itemId":1635019,"picUrl":"https://yanxuan-item.nosdn.127.net/28dd5050489b6c926ab5e3aee6f9b915.png"},{"itemId":1637002,"picUrl":"https://yanxuan-item.nosdn.127.net/f5b1cba9a449797089d43cfe6939933d.png"},{"itemId":1652009,"picUrl":"https://yanxuan-item.nosdn.127.net/df3b083f7c42a6453fec121db61d0297.png"},{"itemId":1657020,"picUrl":"https://yanxuan-item.nosdn.127.net/bf92d8a1eb0e55d41fd29a71dea1e56e.png"},{"itemId":1657028,"picUrl":"https://yanxuan-item.nosdn.127.net/b92c06b09b0446c8635e8d4db6c502d8.png"},{"itemId":1658025,"picUrl":"https://yanxuan-item.nosdn.127.net/3efe2debeec4d9013ff56e5d69e934e3.png"},{"itemId":1663002,"picUrl":"https://yanxuan-item.nosdn.127.net/b050aa1beaad0960bc0b579848dcc4a9.png"},{"itemId":1675046,"picUrl":"https://yanxuan-item.nosdn.127.net/7835dc10763c48ad53a9830b196de01e.png"},{"itemId":1677004,"picUrl":"https://yanxuan-item.nosdn.127.net/6dace61cf151dae53bf5079297ee38bb.png"},{"itemId":1683016,"picUrl":"https://yanxuan-item.nosdn.127.net/81b2b58106f17dfeee60aba8aabd8a85.png"},{"itemId":1690003,"picUrl":"https://yanxuan-item.nosdn.127.net/a9d6de39ab17ab82d5424205dafc4136.png"},{"itemId":3383008,"picUrl":"https://yanxuan-item.nosdn.127.net/eb5aaec3178da93222aeca4b7fcaf757.png"},{"itemId":3397008,"picUrl":"https://yanxuan-item.nosdn.127.net/892430d8b919681ba3e715a670105bc5.png"},{"itemId":3408015,"picUrl":"https://yanxuan-item.nosdn.127.net/f5c935419855b5b5c8ee021cf2197313.png"},{"itemId":3412043,"picUrl":"https://yanxuan-item.nosdn.127.net/a840c425859a599c0a439067b6ad3ec7.png"},{"itemId":3412045,"picUrl":"https://yanxuan-item.nosdn.127.net/dfcb8036f2cbd7b94f9a6119ddfadb51.png"},{"itemId":3416001,"picUrl":"https://yanxuan-item.nosdn.127.net/899d91ae4b28e9bb42d617aa6691276d.png"},{"itemId":3425014,"picUrl":"https://yanxuan-item.nosdn.127.net/ebf4447ec2851db4cc5617d792658a63.png"},{"itemId":3427014,"picUrl":"https://yanxuan-item.nosdn.127.net/cc234b2950c0bfa28b10daa6fd09f3ac.png"},{"itemId":3438006,"picUrl":"https://yanxuan-item.nosdn.127.net/78a1f661665eb3e9257a947d4cd8ac83.png"},{"itemId":3440224,"picUrl":"https://yanxuan-item.nosdn.127.net/863cd7ac1ebb25ea95f6b716123d5e8b.png"},{"itemId":3464069,"picUrl":"https://yanxuan-item.nosdn.127.net/d129e72169eee8b6c47e30504cd34442.png"},{"itemId":3465028,"picUrl":"https://yanxuan-item.nosdn.127.net/77c3456827d3aaec3cea785680831bb8.png"},{"itemId":3465073,"picUrl":"https://yanxuan-item.nosdn.127.net/5328548b08399e3347cc1d9679d9943f.png"},{"itemId":3469061,"picUrl":"https://yanxuan-item.nosdn.127.net/d5c982eae5e21fbd2397df9b17408c76.png"},{"itemId":3481037,"picUrl":"https://yanxuan-item.nosdn.127.net/e952473fbb0d3a27b20185e68dc6bdf5.png"},{"itemId":3481038,"picUrl":"https://yanxuan-item.nosdn.127.net/1df97688e72a2368aa46a3642939bc1e.png"},{"itemId":3482078,"picUrl":"https://yanxuan-item.nosdn.127.net/3ba85e0b142d0c14332670ed246ec04a.png"},{"itemId":3491114,"picUrl":"https://yanxuan-item.nosdn.127.net/3eca7b34cd80ce4128c98233e3809ece.png"},{"itemId":3498011,"picUrl":"https://yanxuan-item.nosdn.127.net/84334e0d0a33897bb8f5fee654fa0cee.jpg"},{"itemId":3499009,"picUrl":"https://yanxuan-item.nosdn.127.net/58290418f47df80146a7a462ab231b07.png"},{"itemId":3506034,"picUrl":"https://yanxuan-item.nosdn.127.net/71e2c597d7c02912c9fe635cdc2a9c0d.png"},{"itemId":3507203,"picUrl":"https://yanxuan-item.nosdn.127.net/60ebd2ecc9a4fca5b746e6753631e9d5.png"},{"itemId":3507205,"picUrl":"https://yanxuan-item.nosdn.127.net/f3f18a4fe9e7905cd7c9ff28e42ff0c2.png"},{"itemId":3510086,"picUrl":"https://yanxuan-item.nosdn.127.net/e3a108207eb1c518d84b5f24ff6627a3.png"},{"itemId":3510125,"picUrl":"https://yanxuan-item.nosdn.127.net/cf7e3528a9aef4dbcb0796c357699994.png"},{"itemId":3522076,"picUrl":"https://yanxuan-item.nosdn.127.net/a7082a3e10618bff612181bf8d204282.png"},{"itemId":3527154,"picUrl":"https://yanxuan-item.nosdn.127.net/02dd07dbee4575a71afa30fd680a6ec7.png"},{"itemId":3532013,"picUrl":"https://yanxuan-item.nosdn.127.net/e3ae33519b9b62248619ec270934a05c.png"},{"itemId":3550216,"picUrl":"https://yanxuan-item.nosdn.127.net/192a35ff83f0575f797765f5395bf03b.png"},{"itemId":3550317,"picUrl":"https://yanxuan-item.nosdn.127.net/598e04918a3e617e59d58ecab8b60e91.png"},{"itemId":3550346,"picUrl":"https://yanxuan-item.nosdn.127.net/56b9ab8ed17e90bd436a48f874bc4f4b.png"},{"itemId":3553004,"picUrl":"https://yanxuan-item.nosdn.127.net/5d89a6f902e09a90d75db57c39c1b817.png"},{"itemId":3804035,"picUrl":"https://yanxuan-item.nosdn.127.net/28099c9166d4987f3fb595509f6a8897.png"},{"itemId":3804060,"picUrl":"https://yanxuan-item.nosdn.127.net/ab9070b9b1a8b126838fd9b5fe0b6958.png"},{"itemId":3811005,"picUrl":"https://yanxuan-item.nosdn.127.net/580a4e84e1bc630f101a3ee01b71d8c2.png"},{"itemId":3811006,"picUrl":"https://yanxuan-item.nosdn.127.net/10a65a661aeb27006186f57ace454da4.png"},{"itemId":3814094,"picUrl":"https://yanxuan-item.nosdn.127.net/6fd807743e8e25472aca8b6b0b8f3039.png"},{"itemId":3815023,"picUrl":"https://yanxuan-item.nosdn.127.net/1cfcd48aeff9c9789f3eb39a6e3ae773.png"},{"itemId":3817012,"picUrl":"https://yanxuan-item.nosdn.127.net/3f3e946c23aaddf5b9e2c259af03571a.png"},{"itemId":3823002,"picUrl":"https://yanxuan-item.nosdn.127.net/910eba5eb892cb555e1d21d6a5a00c5b.png"},{"itemId":3823005,"picUrl":"https://yanxuan-item.nosdn.127.net/be3010770b6075951c7d7253a3e75b69.png"},{"itemId":3826011,"picUrl":"https://yanxuan-item.nosdn.127.net/901be61b95ed8dfc89947125cbdc603b.png"},{"itemId":3828011,"picUrl":"https://yanxuan-item.nosdn.127.net/aabbab9a31151e49c199937a3d0a0cbd.png"},{"itemId":3829113,"picUrl":"https://yanxuan-item.nosdn.127.net/0056e02c30468162c011487b1236272f.png"},{"itemId":3830010,"picUrl":"https://yanxuan-item.nosdn.127.net/aeccb8ca393435861d87e3978c158e02.png"},{"itemId":3835007,"picUrl":"https://yanxuan-item.nosdn.127.net/eea064c1198b70f1b80b86c4fc579141.png"},{"itemId":3837006,"picUrl":"https://yanxuan-item.nosdn.127.net/f66c8252524832d211e9a9c1caa5f86c.png"},{"itemId":3838014,"picUrl":"https://yanxuan-item.nosdn.127.net/d6a3ff3894437578b137ccbd6be32132.png"},{"itemId":3841036,"picUrl":"https://yanxuan-item.nosdn.127.net/588cbd22ee48928b914acbb0ba91cede.png"},{"itemId":3844039,"picUrl":"https://yanxuan-item.nosdn.127.net/acd948c07ab0ed93e5e53bb3edd55731.png"},{"itemId":3853004,"picUrl":"https://yanxuan-item.nosdn.127.net/3e24ed5f8b9d2f0599367df67a40a5f2.png"},{"itemId":3854022,"picUrl":"https://yanxuan-item.nosdn.127.net/061f5b8a5a0c03d1165deed64ca2db19.png"},{"itemId":3855009,"picUrl":"https://yanxuan-item.nosdn.127.net/0558cf6c29e030f072210755f1ad7db7.png"},{"itemId":3865005,"picUrl":"https://yanxuan-item.nosdn.127.net/074874864fcfe6b25e280ac2c45fe51e.png"},{"itemId":3876017,"picUrl":"https://yanxuan-item.nosdn.127.net/70a1f0ca1a4486284c98f3da2c7d1e36.png"},{"itemId":3876019,"picUrl":"https://yanxuan-item.nosdn.127.net/ddc1a90a6224cca5ba67c568ca8fdb49.png"},{"itemId":3876026,"picUrl":"https://yanxuan-item.nosdn.127.net/fccad0de2abbc2cea599df022ce78fa7.png"},{"itemId":3883028,"picUrl":"https://yanxuan-item.nosdn.127.net/93fcef7402e40ec6d763068ac4180b99.png"},{"itemId":3884006,"picUrl":"https://yanxuan-item.nosdn.127.net/1e1887a1524e74e41a5b3d06befa33bb.png"},{"itemId":3986043,"picUrl":"https://yanxuan-item.nosdn.127.net/ae01357ec23e170d0d0988192c964225.png"},{"itemId":3986044,"picUrl":"https://yanxuan-item.nosdn.127.net/7047b2fb3a7e6e61d3d7e050e534516e.png"},{"itemId":3986130,"picUrl":"https://yanxuan-item.nosdn.127.net/3cebf5b10d11683e59f39056582f3822.png"},{"itemId":3986569,"picUrl":"https://yanxuan-item.nosdn.127.net/a44f4c7eface3314c6e901f478474d55.png"},{"itemId":3986591,"picUrl":"https://yanxuan-item.nosdn.127.net/800ac1231416df2d77cf5da015f67473.png"},{"itemId":3986612,"picUrl":"https://yanxuan-item.nosdn.127.net/06a2aabda57f8233b872dc3aba21c783.png"},{"itemId":3986727,"picUrl":"https://yanxuan-item.nosdn.127.net/866b7cd99ac4c5c555819c5de38ed8f0.png"},{"itemId":3987388,"picUrl":"https://yanxuan-item.nosdn.127.net/c97ed9ccfdf8441a8a6f54727ea149b8.png"},{"itemId":3987554,"picUrl":"https://yanxuan-item.nosdn.127.net/c64630a92d1cb74bf24c443ae1a2acd6.png"},{"itemId":3987797,"picUrl":"https://yanxuan-item.nosdn.127.net/fb569ac82cff11d5aac9cddd163b50d5.png"}],"originSchemeUrl":"http://you.163.com/topic/v1/pub/DAZ7vL3eAdT8.html","title":"应季尖货","targetUrl":"http://you.163.com/topic/v1/pub/DAZ7vL3eAdT8.html","desc":"2月拔草清单"}},{"styleItem":{"backgroundUrl":"https://yanxuan.nosdn.127.net/42396d871da5f7636c29e5dfb33105ed.png","descColor":"7f7f7f","itemFrom":2,"picUrlList":["https://yanxuan-item.nosdn.127.net/24dd7f6f16154871f09e86766cc92a94.png","https://yanxuan-item.nosdn.127.net/3ddebc9df09f6b10b9b301d1edf2c303.png"],"titleColor":"333333","extra":{"materialContentFrom":1,"materialName":"员工精选-2.17","rcmdSort":false,"taskType":1,"itemFrom":0,"crmUserGroupName":"无分组","resourcesId":4,"materialType":"场景轻导购","crmUserGroupId":"0","materialId":"54639986","taskId":"54647179"},"itemPicBeanList":[{"itemId":1333015,"picUrl":"https://yanxuan-item.nosdn.127.net/24dd7f6f16154871f09e86766cc92a94.png"},{"itemId":3844033,"picUrl":"https://yanxuan-item.nosdn.127.net/3ddebc9df09f6b10b9b301d1edf2c303.png"}],"originSchemeUrl":"https://m.you.163.com/topic/v1/pub/MZee3MWrbs.html","title":"网易员工精选","targetUrl":"https://m.you.163.com/topic/v1/pub/MZee3MWrbs.html","desc":"停课不停学 词典笔直降70 "}}],"kingKongModule":{"norColor":"ff000000","selectedColor":"ffffffff","background":"https://yanxuan.nosdn.127.net/fe0bd37a552434cc0d27c1889ff3e1fe.png","kingKongList":[{"schemeUrl":"https://m.you.163.com/item/newItem","picUrl":"https://yanxuan.nosdn.127.net/c6fd8835a6400b7da7a016ad85506b69.png","text":"新品首发","textColor":"333333"},{"schemeUrl":"https://m.you.163.com/item/list?categoryId=1005000&style=pd","picUrl":"https://yanxuan.nosdn.127.net/fede8b110c502ec5799702d5ec824792.png","text":"居家生活","textColor":"333333"},{"schemeUrl":"https://m.you.163.com/item/list?categoryId=1010000&style=pd","picUrl":"https://yanxuan.nosdn.127.net/896a3beac514ae8f40aafe028e5fec56.png","text":"服饰鞋包","textColor":"333333"},{"schemeUrl":"https://m.you.163.com/item/list?categoryId=1005002&style=pd","picUrl":"https://yanxuan.nosdn.127.net/37520d1204a0c55474021b43dac2a69e.png","text":"美食酒水","textColor":"333333"},{"schemeUrl":"https://m.you.163.com/item/list?categoryId=1013001&style=pd","picUrl":"https://yanxuan.nosdn.127.net/6c3bd9d885c818b1f73e497335a68b47.png","text":"个护清洁","textColor":"333333"},{"schemeUrl":"https://m.you.163.com/item/list?categoryId=1011000&style=pd","picUrl":"https://yanxuan.nosdn.127.net/559d2a240ec20b096590a902217009ff.png","text":"母婴亲子","textColor":"333333"},{"schemeUrl":"https://m.you.163.com/item/list?categoryId=109243029&style=pd","picUrl":"https://yanxuan.nosdn.127.net/5c088559ebcc3f0ffcda663f04dfbeb2.png","text":"运动旅行","textColor":"333333"},{"schemeUrl":"https://m.you.163.com/item/list?categoryId=1043000&style=pd","picUrl":"https://yanxuan.nosdn.127.net/fbca8e1f2948f0c09fc7672c2c125384.png","text":"数码家电","textColor":"333333"},{"schemeUrl":"https://m.you.163.com/item/list?categoryId=1019000&style=pd","picUrl":"https://yanxuan.nosdn.127.net/f7281169d4e82d5d8d52aa1fec83fe01.png","text":"全球特色","textColor":"333333"},{"schemeUrl":"https://act.you.163.com/act/pub/OuB7EL0tpQ3Z.html","picUrl":"https://yanxuan.nosdn.127.net/12e8efd15b9b210ab156a7ee9b340548.gif","text":"好货抄底","textColor":"333333"}]},"indexActivityModule":[{"backgroundUrl":"","picUrl":"https://yanxuan-item.nosdn.127.net/f961b628a67e5a95150b962a48963b6d.png","activityPrice":"¥69","subTitle":"今日特价","originPrice":"¥99","tag":"","title":"福利社","targetUrl":"https://m.you.163.com/saleCenter/index","showPicUrl":"https://yanxuan-item.nosdn.127.net/f961b628a67e5a95150b962a48963b6d.png"},{"tag":"1元起包邮","subTitle":"","title":"新人拼团","targetUrl":"https://m.you.163.com/pin/item/list"}]};

/***/ }),

/***/ 3:
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ 34:
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ 35);


/***/ }),

/***/ 35:
/*!************************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime-module.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() {
  return this || (typeof self === "object" && self);
})() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = __webpack_require__(/*! ./runtime */ 36);

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}


/***/ }),

/***/ 36:
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() {
    return this || (typeof self === "object" && self);
  })() || Function("return this")()
);


/***/ }),

/***/ 4:
/*!************************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/pages.json ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),

/***/ 5:
/*!*******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/dist/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {var _package = __webpack_require__(/*! ../package.json */ 6);function _possibleConstructorReturn(self, call) {if (call && (typeof call === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}

var STAT_VERSION = _package.version;
var STAT_URL = 'https://tongji.dcloud.io/uni/stat';
var STAT_H5_URL = 'https://tongji.dcloud.io/uni/stat.gif';
var PAGE_PVER_TIME = 1800;
var APP_PVER_TIME = 300;
var OPERATING_TIME = 10;

var UUID_KEY = '__DC_STAT_UUID';
var UUID_VALUE = '__DC_UUID_VALUE';

function getUuid() {
  var uuid = '';
  if (getPlatformName() === 'n') {
    try {
      uuid = plus.runtime.getDCloudId();
    } catch (e) {
      uuid = '';
    }
    return uuid;
  }

  try {
    uuid = uni.getStorageSync(UUID_KEY);
  } catch (e) {
    uuid = UUID_VALUE;
  }

  if (!uuid) {
    uuid = Date.now() + '' + Math.floor(Math.random() * 1e7);
    try {
      uni.setStorageSync(UUID_KEY, uuid);
    } catch (e) {
      uni.setStorageSync(UUID_KEY, UUID_VALUE);
    }
  }
  return uuid;
}

var getSgin = function getSgin(statData) {
  var arr = Object.keys(statData);
  var sortArr = arr.sort();
  var sgin = {};
  var sginStr = '';
  for (var i in sortArr) {
    sgin[sortArr[i]] = statData[sortArr[i]];
    sginStr += sortArr[i] + '=' + statData[sortArr[i]] + '&';
  }
  // const options = sginStr.substr(0, sginStr.length - 1)
  // sginStr = sginStr.substr(0, sginStr.length - 1) + '&key=' + STAT_KEY;
  // const si = crypto.createHash('md5').update(sginStr).digest('hex');
  return {
    sign: '',
    options: sginStr.substr(0, sginStr.length - 1) };

};

var getSplicing = function getSplicing(data) {
  var str = '';
  for (var i in data) {
    str += i + '=' + data[i] + '&';
  }
  return str.substr(0, str.length - 1);
};

var getTime = function getTime() {
  return parseInt(new Date().getTime() / 1000);
};

var getPlatformName = function getPlatformName() {
  var platformList = {
    'app-plus': 'n',
    'h5': 'h5',
    'mp-weixin': 'wx',
    'mp-alipay': 'ali',
    'mp-baidu': 'bd',
    'mp-toutiao': 'tt',
    'mp-qq': 'qq' };

  return platformList["mp-weixin"];
};

var getPackName = function getPackName() {
  var packName = '';
  if (getPlatformName() === 'wx' || getPlatformName() === 'qq') {
    // 兼容微信小程序低版本基础库
    if (uni.canIUse('getAccountInfoSync')) {
      packName = uni.getAccountInfoSync().miniProgram.appId || '';
    }
  }
  return packName;
};

var getVersion = function getVersion() {
  return getPlatformName() === 'n' ? plus.runtime.version : '';
};

var getChannel = function getChannel() {
  var platformName = getPlatformName();
  var channel = '';
  if (platformName === 'n') {
    channel = plus.runtime.channel;
  }
  return channel;
};

var getScene = function getScene(options) {
  var platformName = getPlatformName();
  var scene = '';
  if (options) {
    return options;
  }
  if (platformName === 'wx') {
    scene = uni.getLaunchOptionsSync().scene;
  }
  return scene;
};
var First__Visit__Time__KEY = 'First__Visit__Time';
var Last__Visit__Time__KEY = 'Last__Visit__Time';

var getFirstVisitTime = function getFirstVisitTime() {
  var timeStorge = uni.getStorageSync(First__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = getTime();
    uni.setStorageSync(First__Visit__Time__KEY, time);
    uni.removeStorageSync(Last__Visit__Time__KEY);
  }
  return time;
};

var getLastVisitTime = function getLastVisitTime() {
  var timeStorge = uni.getStorageSync(Last__Visit__Time__KEY);
  var time = 0;
  if (timeStorge) {
    time = timeStorge;
  } else {
    time = '';
  }
  uni.setStorageSync(Last__Visit__Time__KEY, getTime());
  return time;
};


var PAGE_RESIDENCE_TIME = '__page__residence__time';
var First_Page_residence_time = 0;
var Last_Page_residence_time = 0;


var setPageResidenceTime = function setPageResidenceTime() {
  First_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    uni.setStorageSync(PAGE_RESIDENCE_TIME, getTime());
  }
  return First_Page_residence_time;
};

var getPageResidenceTime = function getPageResidenceTime() {
  Last_Page_residence_time = getTime();
  if (getPlatformName() === 'n') {
    First_Page_residence_time = uni.getStorageSync(PAGE_RESIDENCE_TIME);
  }
  return Last_Page_residence_time - First_Page_residence_time;
};
var TOTAL__VISIT__COUNT = 'Total__Visit__Count';
var getTotalVisitCount = function getTotalVisitCount() {
  var timeStorge = uni.getStorageSync(TOTAL__VISIT__COUNT);
  var count = 1;
  if (timeStorge) {
    count = timeStorge;
    count++;
  }
  uni.setStorageSync(TOTAL__VISIT__COUNT, count);
  return count;
};

var GetEncodeURIComponentOptions = function GetEncodeURIComponentOptions(statData) {
  var data = {};
  for (var prop in statData) {
    data[prop] = encodeURIComponent(statData[prop]);
  }
  return data;
};

var Set__First__Time = 0;
var Set__Last__Time = 0;

var getFirstTime = function getFirstTime() {
  var time = new Date().getTime();
  Set__First__Time = time;
  Set__Last__Time = 0;
  return time;
};


var getLastTime = function getLastTime() {
  var time = new Date().getTime();
  Set__Last__Time = time;
  return time;
};


var getResidenceTime = function getResidenceTime(type) {
  var residenceTime = 0;
  if (Set__First__Time !== 0) {
    residenceTime = Set__Last__Time - Set__First__Time;
  }

  residenceTime = parseInt(residenceTime / 1000);
  residenceTime = residenceTime < 1 ? 1 : residenceTime;
  if (type === 'app') {
    var overtime = residenceTime > APP_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: overtime };

  }
  if (type === 'page') {
    var _overtime = residenceTime > PAGE_PVER_TIME ? true : false;
    return {
      residenceTime: residenceTime,
      overtime: _overtime };

  }

  return {
    residenceTime: residenceTime };


};

var getRoute = function getRoute() {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;

  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is;
  } else {
    return _self.$scope && _self.$scope.route || _self.$mp && _self.$mp.page.route;
  }
};

var getPageRoute = function getPageRoute(self) {
  var pages = getCurrentPages();
  var page = pages[pages.length - 1];
  var _self = page.$vm;
  var query = self._query;
  var str = query && JSON.stringify(query) !== '{}' ? '?' + JSON.stringify(query) : '';
  // clear
  self._query = '';
  if (getPlatformName() === 'bd') {
    return _self.$mp && _self.$mp.page.is + str;
  } else {
    return _self.$scope && _self.$scope.route + str || _self.$mp && _self.$mp.page.route + str;
  }
};

var getPageTypes = function getPageTypes(self) {
  if (self.mpType === 'page' || self.$mp && self.$mp.mpType === 'page' || self.$options.mpType === 'page') {
    return true;
  }
  return false;
};

var calibration = function calibration(eventName, options) {
  //  login 、 share 、pay_success 、pay_fail 、register 、title
  if (!eventName) {
    console.error("uni.report \u7F3A\u5C11 [eventName] \u53C2\u6570");
    return true;
  }
  if (typeof eventName !== 'string') {
    console.error("uni.report [eventName] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u7C7B\u578B");
    return true;
  }
  if (eventName.length > 255) {
    console.error("uni.report [eventName] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (typeof options !== 'string' && typeof options !== 'object') {
    console.error("uni.report [options] \u53C2\u6570\u7C7B\u578B\u9519\u8BEF,\u53EA\u80FD\u4E3A String \u6216 Object \u7C7B\u578B");
    return true;
  }

  if (typeof options === 'string' && options.length > 255) {
    console.error("uni.report [options] \u53C2\u6570\u957F\u5EA6\u4E0D\u80FD\u5927\u4E8E 255");
    return true;
  }

  if (eventName === 'title' && typeof options !== 'string') {
    console.error('uni.report [eventName] 参数为 title 时，[options] 参数只能为 String 类型');
    return true;
  }
};

var PagesJson = __webpack_require__(/*! uni-pages?{"type":"style"} */ 7).default;
var statConfig = __webpack_require__(/*! uni-stat-config */ 8).default || __webpack_require__(/*! uni-stat-config */ 8);

var resultOptions = uni.getSystemInfoSync();var

Util = /*#__PURE__*/function () {
  function Util() {_classCallCheck(this, Util);
    this.self = '';
    this._retry = 0;
    this._platform = '';
    this._query = {};
    this._navigationBarTitle = {
      config: '',
      page: '',
      report: '',
      lt: '' };

    this._operatingTime = 0;
    this._reportingRequestData = {
      '1': [],
      '11': [] };

    this.__prevent_triggering = false;

    this.__licationHide = false;
    this.__licationShow = false;
    this._lastPageRoute = '';
    this.statData = {
      uuid: getUuid(),
      ut: getPlatformName(),
      mpn: getPackName(),
      ak: statConfig.appid,
      usv: STAT_VERSION,
      v: getVersion(),
      ch: getChannel(),
      cn: '',
      pn: '',
      ct: '',
      t: getTime(),
      tt: '',
      p: resultOptions.platform === 'android' ? 'a' : 'i',
      brand: resultOptions.brand || '',
      md: resultOptions.model,
      sv: resultOptions.system.replace(/(Android|iOS)\s/, ''),
      mpsdk: resultOptions.SDKVersion || '',
      mpv: resultOptions.version || '',
      lang: resultOptions.language,
      pr: resultOptions.pixelRatio,
      ww: resultOptions.windowWidth,
      wh: resultOptions.windowHeight,
      sw: resultOptions.screenWidth,
      sh: resultOptions.screenHeight };


  }_createClass(Util, [{ key: "_applicationShow", value: function _applicationShow()

    {
      if (this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('app');
        if (time.overtime) {
          var options = {
            path: this._lastPageRoute,
            scene: this.statData.sc };

          this._sendReportRequest(options);
        }
        this.__licationHide = false;
      }
    } }, { key: "_applicationHide", value: function _applicationHide(

    self, type) {

      this.__licationHide = true;
      getLastTime();
      var time = getResidenceTime();
      getFirstTime();
      var route = getPageRoute(this);
      this._sendHideRequest({
        urlref: route,
        urlref_ts: time.residenceTime },
      type);
    } }, { key: "_pageShow", value: function _pageShow()

    {
      var route = getPageRoute(this);
      var routepath = getRoute();
      this._navigationBarTitle.config = PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].titleNView &&
      PagesJson.pages[routepath].titleNView.titleText ||
      PagesJson &&
      PagesJson.pages[routepath] &&
      PagesJson.pages[routepath].navigationBarTitleText || '';

      if (this.__licationShow) {
        getFirstTime();
        this.__licationShow = false;
        // console.log('这是 onLauch 之后执行的第一次 pageShow ，为下次记录时间做准备');
        this._lastPageRoute = route;
        return;
      }

      getLastTime();
      this._lastPageRoute = route;
      var time = getResidenceTime('page');
      if (time.overtime) {
        var options = {
          path: this._lastPageRoute,
          scene: this.statData.sc };

        this._sendReportRequest(options);
      }
      getFirstTime();
    } }, { key: "_pageHide", value: function _pageHide()

    {
      if (!this.__licationHide) {
        getLastTime();
        var time = getResidenceTime('page');
        this._sendPageRequest({
          url: this._lastPageRoute,
          urlref: this._lastPageRoute,
          urlref_ts: time.residenceTime });

        this._navigationBarTitle = {
          config: '',
          page: '',
          report: '',
          lt: '' };

        return;
      }
    } }, { key: "_login", value: function _login()

    {
      this._sendEventRequest({
        key: 'login' },
      0);
    } }, { key: "_share", value: function _share()

    {
      this._sendEventRequest({
        key: 'share' },
      0);
    } }, { key: "_payment", value: function _payment(
    key) {
      this._sendEventRequest({
        key: key },
      0);
    } }, { key: "_sendReportRequest", value: function _sendReportRequest(
    options) {

      this._navigationBarTitle.lt = '1';
      var query = options.query && JSON.stringify(options.query) !== '{}' ? '?' + JSON.stringify(options.query) : '';
      this.statData.lt = '1';
      this.statData.url = options.path + query || '';
      this.statData.t = getTime();
      this.statData.sc = getScene(options.scene);
      this.statData.fvts = getFirstVisitTime();
      this.statData.lvts = getLastVisitTime();
      this.statData.tvc = getTotalVisitCount();
      if (getPlatformName() === 'n') {
        this.getProperty();
      } else {
        this.getNetworkInfo();
      }
    } }, { key: "_sendPageRequest", value: function _sendPageRequest(

    opt) {var

      url =


      opt.url,urlref = opt.urlref,urlref_ts = opt.urlref_ts;
      this._navigationBarTitle.lt = '11';
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '11',
        ut: this.statData.ut,
        url: url,
        tt: this.statData.tt,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "_sendHideRequest", value: function _sendHideRequest(

    opt, type) {var

      urlref =

      opt.urlref,urlref_ts = opt.urlref_ts;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '3',
        ut: this.statData.ut,
        urlref: urlref,
        urlref_ts: urlref_ts,
        ch: this.statData.ch,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options, type);
    } }, { key: "_sendEventRequest", value: function _sendEventRequest()



    {var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},_ref$key = _ref.key,key = _ref$key === void 0 ? '' : _ref$key,_ref$value = _ref.value,value = _ref$value === void 0 ? "" : _ref$value;
      var route = this._lastPageRoute;
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '21',
        ut: this.statData.ut,
        url: route,
        ch: this.statData.ch,
        e_n: key,
        e_v: typeof value === 'object' ? JSON.stringify(value) : value.toString(),
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }, { key: "getNetworkInfo", value: function getNetworkInfo()

    {var _this = this;
      uni.getNetworkType({
        success: function success(result) {
          _this.statData.net = result.networkType;
          _this.getLocation();
        } });

    } }, { key: "getProperty", value: function getProperty()

    {var _this2 = this;
      plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {
        _this2.statData.v = wgtinfo.version || '';
        _this2.getNetworkInfo();
      });
    } }, { key: "getLocation", value: function getLocation()

    {var _this3 = this;
      if (statConfig.getLocation) {
        uni.getLocation({
          type: 'wgs84',
          geocode: true,
          success: function success(result) {
            if (result.address) {
              _this3.statData.cn = result.address.country;
              _this3.statData.pn = result.address.province;
              _this3.statData.ct = result.address.city;
            }

            _this3.statData.lat = result.latitude;
            _this3.statData.lng = result.longitude;
            _this3.request(_this3.statData);
          } });

      } else {
        this.statData.lat = 0;
        this.statData.lng = 0;
        this.request(this.statData);
      }
    } }, { key: "request", value: function request(

    data, type) {var _this4 = this;
      var time = getTime();
      var title = this._navigationBarTitle;
      data.ttn = title.page;
      data.ttpj = title.config;
      data.ttc = title.report;

      var requestData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        requestData = uni.getStorageSync('__UNI__STAT__DATA') || {};
      }
      if (!requestData[data.lt]) {
        requestData[data.lt] = [];
      }
      requestData[data.lt].push(data);

      if (getPlatformName() === 'n') {
        uni.setStorageSync('__UNI__STAT__DATA', requestData);
      }
      if (getPageResidenceTime() < OPERATING_TIME && !type) {
        return;
      }
      var uniStatData = this._reportingRequestData;
      if (getPlatformName() === 'n') {
        uniStatData = uni.getStorageSync('__UNI__STAT__DATA');
      }
      // 时间超过，重新获取时间戳
      setPageResidenceTime();
      var firstArr = [];
      var contentArr = [];
      var lastArr = [];var _loop = function _loop(

      i) {
        var rd = uniStatData[i];
        rd.forEach(function (elm) {
          var newData = getSplicing(elm);
          if (i === 0) {
            firstArr.push(newData);
          } else if (i === 3) {
            lastArr.push(newData);
          } else {
            contentArr.push(newData);
          }
        });};for (var i in uniStatData) {_loop(i);
      }

      firstArr.push.apply(firstArr, contentArr.concat(lastArr));
      var optionsData = {
        usv: STAT_VERSION, //统计 SDK 版本号
        t: time, //发送请求时的时间戮
        requests: JSON.stringify(firstArr) };


      this._reportingRequestData = {};
      if (getPlatformName() === 'n') {
        uni.removeStorageSync('__UNI__STAT__DATA');
      }

      if (data.ut === 'h5') {
        this.imageRequest(optionsData);
        return;
      }

      if (getPlatformName() === 'n' && this.statData.p === 'a') {
        setTimeout(function () {
          _this4._sendRequest(optionsData);
        }, 200);
        return;
      }
      this._sendRequest(optionsData);
    } }, { key: "_sendRequest", value: function _sendRequest(
    optionsData) {var _this5 = this;
      uni.request({
        url: STAT_URL,
        method: 'POST',
        // header: {
        //   'content-type': 'application/json' // 默认值
        // },
        data: optionsData,
        success: function success() {
          // if (process.env.NODE_ENV === 'development') {
          //   console.log('stat request success');
          // }
        },
        fail: function fail(e) {
          if (++_this5._retry < 3) {
            setTimeout(function () {
              _this5._sendRequest(optionsData);
            }, 1000);
          }
        } });

    }
    /**
       * h5 请求
       */ }, { key: "imageRequest", value: function imageRequest(
    data) {
      var image = new Image();
      var options = getSgin(GetEncodeURIComponentOptions(data)).options;
      image.src = STAT_H5_URL + '?' + options;
    } }, { key: "sendEvent", value: function sendEvent(

    key, value) {
      // 校验 type 参数
      if (calibration(key, value)) return;

      if (key === 'title') {
        this._navigationBarTitle.report = value;
        return;
      }
      this._sendEventRequest({
        key: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value },
      1);
    } }]);return Util;}();var



Stat = /*#__PURE__*/function (_Util) {_inherits(Stat, _Util);_createClass(Stat, null, [{ key: "getInstance", value: function getInstance()
    {
      if (!this.instance) {
        this.instance = new Stat();
      }
      return this.instance;
    } }]);
  function Stat() {var _this6;_classCallCheck(this, Stat);
    _this6 = _possibleConstructorReturn(this, _getPrototypeOf(Stat).call(this));
    _this6.instance = null;
    // 注册拦截器
    if (typeof uni.addInterceptor === 'function' && "development" !== 'development') {
      _this6.addInterceptorInit();
      _this6.interceptLogin();
      _this6.interceptShare(true);
      _this6.interceptRequestPayment();
    }return _this6;
  }_createClass(Stat, [{ key: "addInterceptorInit", value: function addInterceptorInit()

    {
      var self = this;
      uni.addInterceptor('setNavigationBarTitle', {
        invoke: function invoke(args) {
          self._navigationBarTitle.page = args.title;
        } });

    } }, { key: "interceptLogin", value: function interceptLogin()

    {
      var self = this;
      uni.addInterceptor('login', {
        complete: function complete() {
          self._login();
        } });

    } }, { key: "interceptShare", value: function interceptShare(

    type) {
      var self = this;
      if (!type) {
        self._share();
        return;
      }
      uni.addInterceptor('share', {
        success: function success() {
          self._share();
        },
        fail: function fail() {
          self._share();
        } });

    } }, { key: "interceptRequestPayment", value: function interceptRequestPayment()

    {
      var self = this;
      uni.addInterceptor('requestPayment', {
        success: function success() {
          self._payment('pay_success');
        },
        fail: function fail() {
          self._payment('pay_fail');
        } });

    } }, { key: "report", value: function report(

    options, self) {
      this.self = self;
      // if (process.env.NODE_ENV === 'development') {
      //   console.log('report init');
      // }
      setPageResidenceTime();
      this.__licationShow = true;
      this._sendReportRequest(options, true);
    } }, { key: "load", value: function load(

    options, self) {
      if (!self.$scope && !self.$mp) {
        var page = getCurrentPages();
        self.$scope = page[page.length - 1];
      }
      this.self = self;
      this._query = options;
    } }, { key: "show", value: function show(

    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageShow(self);
      } else {
        this._applicationShow(self);
      }
    } }, { key: "ready", value: function ready(

    self) {
      // this.self = self;
      // if (getPageTypes(self)) {
      //   this._pageShow(self);
      // }
    } }, { key: "hide", value: function hide(
    self) {
      this.self = self;
      if (getPageTypes(self)) {
        this._pageHide(self);
      } else {
        this._applicationHide(self, true);
      }
    } }, { key: "error", value: function error(
    em) {
      if (this._platform === 'devtools') {
        if (true) {
          console.info('当前运行环境为开发者工具，不上报数据。');
        }
        // return;
      }
      var emVal = '';
      if (!em.message) {
        emVal = JSON.stringify(em);
      } else {
        emVal = em.stack;
      }
      var options = {
        ak: this.statData.ak,
        uuid: this.statData.uuid,
        lt: '31',
        ut: this.statData.ut,
        ch: this.statData.ch,
        mpsdk: this.statData.mpsdk,
        mpv: this.statData.mpv,
        v: this.statData.v,
        em: emVal,
        usv: this.statData.usv,
        t: getTime(),
        p: this.statData.p };

      this.request(options);
    } }]);return Stat;}(Util);


var stat = Stat.getInstance();
var isHide = false;
var lifecycle = {
  onLaunch: function onLaunch(options) {
    stat.report(options, this);
  },
  onReady: function onReady() {
    stat.ready(this);
  },
  onLoad: function onLoad(options) {
    stat.load(options, this);
    // 重写分享，获取分享上报事件
    if (this.$scope && this.$scope.onShareAppMessage) {
      var oldShareAppMessage = this.$scope.onShareAppMessage;
      this.$scope.onShareAppMessage = function (options) {
        stat.interceptShare(false);
        return oldShareAppMessage.call(this, options);
      };
    }
  },
  onShow: function onShow() {
    isHide = false;
    stat.show(this);
  },
  onHide: function onHide() {
    isHide = true;
    stat.hide(this);
  },
  onUnload: function onUnload() {
    if (isHide) {
      isHide = false;
      return;
    }
    stat.hide(this);
  },
  onError: function onError(e) {
    stat.error(e);
  } };


function main() {
  if (true) {
    uni.report = function (type, options) {};
  } else { var Vue; }
}

main();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ }),

/***/ 6:
/*!******************************************************!*\
  !*** ./node_modules/@dcloudio/uni-stat/package.json ***!
  \******************************************************/
/*! exports provided: _from, _id, _inBundle, _integrity, _location, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _spec, _where, author, bugs, bundleDependencies, deprecated, description, devDependencies, files, gitHead, homepage, license, main, name, repository, scripts, version, default */
/***/ (function(module) {

module.exports = {"_from":"@dcloudio/uni-stat@alpha","_id":"@dcloudio/uni-stat@2.0.0-alpha-25720200116005","_inBundle":false,"_integrity":"sha512-RZFw3WAaS/CZTzzv9JPaWvmoNitojD/06vPdHSzlqZi8GbuE222lFuyochEjrGkG8rPPrWHAnwfoPBuQVtkfdg==","_location":"/@dcloudio/uni-stat","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@dcloudio/uni-stat@alpha","name":"@dcloudio/uni-stat","escapedName":"@dcloudio%2funi-stat","scope":"@dcloudio","rawSpec":"alpha","saveSpec":null,"fetchSpec":"alpha"},"_requiredBy":["#USER","/","/@dcloudio/vue-cli-plugin-uni"],"_resolved":"https://registry.npmjs.org/@dcloudio/uni-stat/-/uni-stat-2.0.0-alpha-25720200116005.tgz","_shasum":"08bb17aba91c84a981f33d74153aa3dd07b578ad","_spec":"@dcloudio/uni-stat@alpha","_where":"/Users/guoshengqiang/Documents/dcloud-plugins/alpha/uniapp-cli","author":"","bugs":{"url":"https://github.com/dcloudio/uni-app/issues"},"bundleDependencies":false,"deprecated":false,"description":"","devDependencies":{"@babel/core":"^7.5.5","@babel/preset-env":"^7.5.5","eslint":"^6.1.0","rollup":"^1.19.3","rollup-plugin-babel":"^4.3.3","rollup-plugin-clear":"^2.0.7","rollup-plugin-commonjs":"^10.0.2","rollup-plugin-copy":"^3.1.0","rollup-plugin-eslint":"^7.0.0","rollup-plugin-json":"^4.0.0","rollup-plugin-node-resolve":"^5.2.0","rollup-plugin-replace":"^2.2.0","rollup-plugin-uglify":"^6.0.2"},"files":["dist","package.json","LICENSE"],"gitHead":"a129bde60de35f7ef497f43d5a45b4556231995c","homepage":"https://github.com/dcloudio/uni-app#readme","license":"Apache-2.0","main":"dist/index.js","name":"@dcloudio/uni-stat","repository":{"type":"git","url":"git+https://github.com/dcloudio/uni-app.git","directory":"packages/uni-stat"},"scripts":{"build":"NODE_ENV=production rollup -c rollup.config.js","dev":"NODE_ENV=development rollup -w -c rollup.config.js"},"version":"2.0.0-alpha-25720200116005"};

/***/ }),

/***/ 7:
/*!*****************************************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/pages.json?{"type":"style"} ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "pages": { "pages/index/index": { "navigationBarTitleText": "网易严选" }, "pages/product/product": { "navigationBarTitleText": "详情展示" }, "pages/set/set": { "navigationBarTitleText": "设置" }, "pages/userinfo/userinfo": { "navigationBarTitleText": "修改资料" }, "pages/cart/cart": { "navigationBarTitleText": "购物车" }, "pages/public/login": { "navigationBarTitleText": "", "navigationStyle": "custom" }, "pages/user/user": { "navigationBarTitleText": "我的", "navigationStyle": "custom" }, "pages/detail/detail": { "navigationBarTitleText": "" }, "pages/order/order": { "navigationBarTitleText": "我的订单" }, "pages/money/money": {}, "pages/order/createOrder": { "navigationBarTitleText": "创建订单" }, "pages/address/address": { "navigationBarTitleText": "收货地址" }, "pages/address/addressManage": { "navigationBarTitleText": "" }, "pages/money/pay": { "navigationBarTitleText": "支付" }, "pages/money/paySuccess": { "navigationBarTitleText": "支付成功" }, "pages/notice/notice": { "navigationBarTitleText": "通知" }, "pages/category/category": { "navigationBarTitleText": "分类" }, "pages/product/list": { "enablePullDownRefresh": true, "navigationBarTitleText": "商品列表" }, "pages/buy/buy": { "navigationBarTitleText": "值得买" } }, "globalStyle": { "navigationBarTextStyle": "black", "navigationBarTitleText": "网易严选", "navigationBarBackgroundColor": "#55aa7f", "backgroundColor": "#f8f8f8" } };exports.default = _default;

/***/ }),

/***/ 8:
/*!****************************************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/pages.json?{"type":"stat"} ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = { "appid": "" };exports.default = _default;

/***/ }),

/***/ 9:
/*!****************************************************************************!*\
  !*** C:/Users/Apple/Desktop/study/13-网易严选/project_app_wyyx/store/index.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(uni) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _vue = _interopRequireDefault(__webpack_require__(/*! vue */ 2));
var _vuex = _interopRequireDefault(__webpack_require__(/*! vuex */ 10));function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

_vue.default.use(_vuex.default);

var store = new _vuex.default.Store({
  state: {
    hasLogin: false,
    userInfo: {} },

  mutations: {
    login: function login(state, provider) {

      state.hasLogin = true;
      state.userInfo = provider;
      uni.setStorage({ //缓存用户登陆状态
        key: 'userInfo',
        data: provider });

      console.log(state.userInfo);
    },
    logout: function logout(state) {
      state.hasLogin = false;
      state.userInfo = {};
      uni.removeStorage({
        key: 'userInfo' });

    } },

  actions: {} });var _default =




store;exports.default = _default;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@dcloudio/uni-mp-weixin/dist/index.js */ 1)["default"]))

/***/ })

}]);
//# sourceMappingURL=../../.sourcemap/mp-weixin/common/vendor.js.map