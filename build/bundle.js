/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@yomguithereal/helpers/extend.js":
/*!*******************************************************!*\
  !*** ./node_modules/@yomguithereal/helpers/extend.js ***!
  \*******************************************************/
/***/ ((module) => {

/**
 * Extend function
 * ================
 *
 * Function used to push a bunch of values into an array at once.
 *
 * Its strategy is to mutate target array's length then setting the new indices
 * to be the values to add.
 *
 * A benchmark proved that it is faster than the following strategies:
 *   1) `array.push.apply(array, values)`.
 *   2) A loop of pushes.
 *   3) `array = array.concat(values)`, obviously.
 *
 * Intuitively, this is correct because when adding a lot of elements, the
 * chosen strategies does not need to handle the `arguments` object to
 * execute #.apply's variadicity and because the array know its final length
 * at the beginning, avoiding potential multiple reallocations of the underlying
 * contiguous array. Some engines may be able to optimize the loop of push
 * operations but empirically they don't seem to do so.
 */

/**
 * Extends the target array with the given values.
 *
 * @param  {array} array  - Target array.
 * @param  {array} values - Values to add.
 */
module.exports = function extend(array, values) {
  var l2 = values.length;

  if (l2 === 0)
    return;

  var l1 = array.length;

  array.length += l2;

  for (var i = 0; i < l2; i++)
    array[l1 + i] = values[i];
};


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/graphology-layout-forceatlas2/defaults.js":
/*!****************************************************************!*\
  !*** ./node_modules/graphology-layout-forceatlas2/defaults.js ***!
  \****************************************************************/
/***/ ((module) => {

/**
 * Graphology ForceAtlas2 Layout Default Settings
 * ===============================================
 */
module.exports = {
  linLogMode: false,
  outboundAttractionDistribution: false,
  adjustSizes: false,
  edgeWeightInfluence: 1,
  scalingRatio: 1,
  strongGravityMode: false,
  gravity: 1,
  slowDown: 1,
  barnesHutOptimize: false,
  barnesHutTheta: 0.5
};


/***/ }),

/***/ "./node_modules/graphology-layout-forceatlas2/helpers.js":
/*!***************************************************************!*\
  !*** ./node_modules/graphology-layout-forceatlas2/helpers.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * Graphology ForceAtlas2 Helpers
 * ===============================
 *
 * Miscellaneous helper functions.
 */

/**
 * Constants.
 */
var PPN = 10;
var PPE = 3;

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
exports.assign = function (target) {
  target = target || {};

  var objects = Array.prototype.slice.call(arguments).slice(1),
    i,
    k,
    l;

  for (i = 0, l = objects.length; i < l; i++) {
    if (!objects[i]) continue;

    for (k in objects[i]) target[k] = objects[i][k];
  }

  return target;
};

/**
 * Function used to validate the given settings.
 *
 * @param  {object}      settings - Settings to validate.
 * @return {object|null}
 */
exports.validateSettings = function (settings) {
  if ('linLogMode' in settings && typeof settings.linLogMode !== 'boolean')
    return {message: 'the `linLogMode` setting should be a boolean.'};

  if (
    'outboundAttractionDistribution' in settings &&
    typeof settings.outboundAttractionDistribution !== 'boolean'
  )
    return {
      message:
        'the `outboundAttractionDistribution` setting should be a boolean.'
    };

  if ('adjustSizes' in settings && typeof settings.adjustSizes !== 'boolean')
    return {message: 'the `adjustSizes` setting should be a boolean.'};

  if (
    'edgeWeightInfluence' in settings &&
    typeof settings.edgeWeightInfluence !== 'number'
  )
    return {
      message: 'the `edgeWeightInfluence` setting should be a number.'
    };

  if (
    'scalingRatio' in settings &&
    !(typeof settings.scalingRatio === 'number' && settings.scalingRatio >= 0)
  )
    return {message: 'the `scalingRatio` setting should be a number >= 0.'};

  if (
    'strongGravityMode' in settings &&
    typeof settings.strongGravityMode !== 'boolean'
  )
    return {message: 'the `strongGravityMode` setting should be a boolean.'};

  if (
    'gravity' in settings &&
    !(typeof settings.gravity === 'number' && settings.gravity >= 0)
  )
    return {message: 'the `gravity` setting should be a number >= 0.'};

  if (
    'slowDown' in settings &&
    !(typeof settings.slowDown === 'number' || settings.slowDown >= 0)
  )
    return {message: 'the `slowDown` setting should be a number >= 0.'};

  if (
    'barnesHutOptimize' in settings &&
    typeof settings.barnesHutOptimize !== 'boolean'
  )
    return {message: 'the `barnesHutOptimize` setting should be a boolean.'};

  if (
    'barnesHutTheta' in settings &&
    !(
      typeof settings.barnesHutTheta === 'number' &&
      settings.barnesHutTheta >= 0
    )
  )
    return {message: 'the `barnesHutTheta` setting should be a number >= 0.'};

  return null;
};

/**
 * Function generating a flat matrix for both nodes & edges of the given graph.
 *
 * @param  {Graph}    graph         - Target graph.
 * @param  {function} getEdgeWeight - Edge weight getter function.
 * @return {object}                 - Both matrices.
 */
exports.graphToByteArrays = function (graph, getEdgeWeight) {
  var order = graph.order;
  var size = graph.size;
  var index = {};
  var j;

  // NOTE: float32 could lead to issues if edge array needs to index large
  // number of nodes.
  var NodeMatrix = new Float32Array(order * PPN);
  var EdgeMatrix = new Float32Array(size * PPE);

  // Iterate through nodes
  j = 0;
  graph.forEachNode(function (node, attr) {
    // Node index
    index[node] = j;

    // Populating byte array
    NodeMatrix[j] = attr.x;
    NodeMatrix[j + 1] = attr.y;
    NodeMatrix[j + 2] = 0; // dx
    NodeMatrix[j + 3] = 0; // dy
    NodeMatrix[j + 4] = 0; // old_dx
    NodeMatrix[j + 5] = 0; // old_dy
    NodeMatrix[j + 6] = 1; // mass
    NodeMatrix[j + 7] = 1; // convergence
    NodeMatrix[j + 8] = attr.size || 1;
    NodeMatrix[j + 9] = attr.fixed ? 1 : 0;
    j += PPN;
  });

  // Iterate through edges
  j = 0;
  graph.forEachEdge(function (edge, attr, source, target, sa, ta, u) {
    var sj = index[source];
    var tj = index[target];

    // Handling node mass through degree
    NodeMatrix[sj + 6] += 1;
    NodeMatrix[tj + 6] += 1;

    // Populating byte array
    EdgeMatrix[j] = sj;
    EdgeMatrix[j + 1] = tj;
    EdgeMatrix[j + 2] = getEdgeWeight(edge, attr, source, target, sa, ta, u);
    j += PPE;
  });

  return {
    nodes: NodeMatrix,
    edges: EdgeMatrix
  };
};

/**
 * Function applying the layout back to the graph.
 *
 * @param {Graph}         graph         - Target graph.
 * @param {Float32Array}  NodeMatrix    - Node matrix.
 * @param {function|null} outputReducer - A node reducer.
 */
exports.assignLayoutChanges = function (graph, NodeMatrix, outputReducer) {
  var i = 0;

  graph.updateEachNodeAttributes(function (node, attr) {
    attr.x = NodeMatrix[i];
    attr.y = NodeMatrix[i + 1];

    i += PPN;

    return outputReducer ? outputReducer(node, attr) : attr;
  });
};

/**
 * Function reading the positions (only) from the graph, to write them in the matrix.
 *
 * @param {Graph}        graph      - Target graph.
 * @param {Float32Array} NodeMatrix - Node matrix.
 */
exports.readGraphPositions = function (graph, NodeMatrix) {
  var i = 0;

  graph.forEachNode(function (node, attr) {
    NodeMatrix[i] = attr.x;
    NodeMatrix[i + 1] = attr.y;

    i += PPN;
  });
};

/**
 * Function collecting the layout positions.
 *
 * @param  {Graph}         graph         - Target graph.
 * @param  {Float32Array}  NodeMatrix    - Node matrix.
 * @param  {function|null} outputReducer - A nodes reducer.
 * @return {object}                      - Map to node positions.
 */
exports.collectLayoutChanges = function (graph, NodeMatrix, outputReducer) {
  var nodes = graph.nodes(),
    positions = {};

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    if (outputReducer) {
      var newAttr = Object.assign({}, graph.getNodeAttributes(nodes[j]));
      newAttr.x = NodeMatrix[i];
      newAttr.y = NodeMatrix[i + 1];
      newAttr = outputReducer(nodes[j], newAttr);
      positions[nodes[j]] = {
        x: newAttr.x,
        y: newAttr.y
      };
    } else {
      positions[nodes[j]] = {
        x: NodeMatrix[i],
        y: NodeMatrix[i + 1]
      };
    }

    j++;
  }

  return positions;
};

/**
 * Function returning a web worker from the given function.
 *
 * @param  {function}  fn - Function for the worker.
 * @return {DOMString}
 */
exports.createWorker = function createWorker(fn) {
  var xURL = window.URL || window.webkitURL;
  var code = fn.toString();
  var objectUrl = xURL.createObjectURL(
    new Blob(['(' + code + ').call(this);'], {type: 'text/javascript'})
  );
  var worker = new Worker(objectUrl);
  xURL.revokeObjectURL(objectUrl);

  return worker;
};


/***/ }),

/***/ "./node_modules/graphology-layout-forceatlas2/index.js":
/*!*************************************************************!*\
  !*** ./node_modules/graphology-layout-forceatlas2/index.js ***!
  \*************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Graphology ForceAtlas2 Layout
 * ==============================
 *
 * Library endpoint.
 */
var isGraph = __webpack_require__(/*! graphology-utils/is-graph */ "./node_modules/graphology-utils/is-graph.js");
var createEdgeWeightGetter =
  (__webpack_require__(/*! graphology-utils/getters */ "./node_modules/graphology-utils/getters.js").createEdgeWeightGetter);
var iterate = __webpack_require__(/*! ./iterate.js */ "./node_modules/graphology-layout-forceatlas2/iterate.js");
var helpers = __webpack_require__(/*! ./helpers.js */ "./node_modules/graphology-layout-forceatlas2/helpers.js");

var DEFAULT_SETTINGS = __webpack_require__(/*! ./defaults.js */ "./node_modules/graphology-layout-forceatlas2/defaults.js");

/**
 * Asbtract function used to run a certain number of iterations.
 *
 * @param  {boolean}       assign          - Whether to assign positions.
 * @param  {Graph}         graph           - Target graph.
 * @param  {object|number} params          - If number, params.iterations, else:
 * @param  {function}        getWeight     - Edge weight getter function.
 * @param  {number}          iterations    - Number of iterations.
 * @param  {function|null}   outputReducer - A node reducer
 * @param  {object}          [settings]    - Settings.
 * @return {object|undefined}
 */
function abstractSynchronousLayout(assign, graph, params) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout-forceatlas2: the given graph is not a valid graphology instance.'
    );

  if (typeof params === 'number') params = {iterations: params};

  var iterations = params.iterations;

  if (typeof iterations !== 'number')
    throw new Error(
      'graphology-layout-forceatlas2: invalid number of iterations.'
    );

  if (iterations <= 0)
    throw new Error(
      'graphology-layout-forceatlas2: you should provide a positive number of iterations.'
    );

  var getEdgeWeight = createEdgeWeightGetter(params.getEdgeWeight).fromEntry;

  var outputReducer =
    typeof params.outputReducer === 'function' ? params.outputReducer : null;

  // Validating settings
  var settings = helpers.assign({}, DEFAULT_SETTINGS, params.settings);
  var validationError = helpers.validateSettings(settings);

  if (validationError)
    throw new Error(
      'graphology-layout-forceatlas2: ' + validationError.message
    );

  // Building matrices
  var matrices = helpers.graphToByteArrays(graph, getEdgeWeight);

  var i;

  // Iterating
  for (i = 0; i < iterations; i++)
    iterate(settings, matrices.nodes, matrices.edges);

  // Applying
  if (assign) {
    helpers.assignLayoutChanges(graph, matrices.nodes, outputReducer);
    return;
  }

  return helpers.collectLayoutChanges(graph, matrices.nodes);
}

/**
 * Function returning sane layout settings for the given graph.
 *
 * @param  {Graph|number} graph - Target graph or graph order.
 * @return {object}
 */
function inferSettings(graph) {
  var order = typeof graph === 'number' ? graph : graph.order;

  return {
    barnesHutOptimize: order > 2000,
    strongGravityMode: true,
    gravity: 0.05,
    scalingRatio: 10,
    slowDown: 1 + Math.log(order)
  };
}

/**
 * Exporting.
 */
var synchronousLayout = abstractSynchronousLayout.bind(null, false);
synchronousLayout.assign = abstractSynchronousLayout.bind(null, true);
synchronousLayout.inferSettings = inferSettings;

module.exports = synchronousLayout;


/***/ }),

/***/ "./node_modules/graphology-layout-forceatlas2/iterate.js":
/*!***************************************************************!*\
  !*** ./node_modules/graphology-layout-forceatlas2/iterate.js ***!
  \***************************************************************/
/***/ ((module) => {

/* eslint no-constant-condition: 0 */
/**
 * Graphology ForceAtlas2 Iteration
 * =================================
 *
 * Function used to perform a single iteration of the algorithm.
 */

/**
 * Matrices properties accessors.
 */
var NODE_X = 0;
var NODE_Y = 1;
var NODE_DX = 2;
var NODE_DY = 3;
var NODE_OLD_DX = 4;
var NODE_OLD_DY = 5;
var NODE_MASS = 6;
var NODE_CONVERGENCE = 7;
var NODE_SIZE = 8;
var NODE_FIXED = 9;

var EDGE_SOURCE = 0;
var EDGE_TARGET = 1;
var EDGE_WEIGHT = 2;

var REGION_NODE = 0;
var REGION_CENTER_X = 1;
var REGION_CENTER_Y = 2;
var REGION_SIZE = 3;
var REGION_NEXT_SIBLING = 4;
var REGION_FIRST_CHILD = 5;
var REGION_MASS = 6;
var REGION_MASS_CENTER_X = 7;
var REGION_MASS_CENTER_Y = 8;

var SUBDIVISION_ATTEMPTS = 3;

/**
 * Constants.
 */
var PPN = 10;
var PPE = 3;
var PPR = 9;

var MAX_FORCE = 10;

/**
 * Function used to perform a single interation of the algorithm.
 *
 * @param  {object}       options    - Layout options.
 * @param  {Float32Array} NodeMatrix - Node data.
 * @param  {Float32Array} EdgeMatrix - Edge data.
 * @return {object}                  - Some metadata.
 */
module.exports = function iterate(options, NodeMatrix, EdgeMatrix) {
  // Initializing variables
  var l, r, n, n1, n2, rn, e, w, g, s;

  var order = NodeMatrix.length,
    size = EdgeMatrix.length;

  var adjustSizes = options.adjustSizes;

  var thetaSquared = options.barnesHutTheta * options.barnesHutTheta;

  var outboundAttCompensation, coefficient, xDist, yDist, ewc, distance, factor;

  var RegionMatrix = [];

  // 1) Initializing layout data
  //-----------------------------

  // Resetting positions & computing max values
  for (n = 0; n < order; n += PPN) {
    NodeMatrix[n + NODE_OLD_DX] = NodeMatrix[n + NODE_DX];
    NodeMatrix[n + NODE_OLD_DY] = NodeMatrix[n + NODE_DY];
    NodeMatrix[n + NODE_DX] = 0;
    NodeMatrix[n + NODE_DY] = 0;
  }

  // If outbound attraction distribution, compensate
  if (options.outboundAttractionDistribution) {
    outboundAttCompensation = 0;
    for (n = 0; n < order; n += PPN) {
      outboundAttCompensation += NodeMatrix[n + NODE_MASS];
    }

    outboundAttCompensation /= order / PPN;
  }

  // 1.bis) Barnes-Hut computation
  //------------------------------

  if (options.barnesHutOptimize) {
    // Setting up
    var minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity,
      q,
      q2,
      subdivisionAttempts;

    // Computing min and max values
    for (n = 0; n < order; n += PPN) {
      minX = Math.min(minX, NodeMatrix[n + NODE_X]);
      maxX = Math.max(maxX, NodeMatrix[n + NODE_X]);
      minY = Math.min(minY, NodeMatrix[n + NODE_Y]);
      maxY = Math.max(maxY, NodeMatrix[n + NODE_Y]);
    }

    // squarify bounds, it's a quadtree
    var dx = maxX - minX,
      dy = maxY - minY;
    if (dx > dy) {
      minY -= (dx - dy) / 2;
      maxY = minY + dx;
    } else {
      minX -= (dy - dx) / 2;
      maxX = minX + dy;
    }

    // Build the Barnes Hut root region
    RegionMatrix[0 + REGION_NODE] = -1;
    RegionMatrix[0 + REGION_CENTER_X] = (minX + maxX) / 2;
    RegionMatrix[0 + REGION_CENTER_Y] = (minY + maxY) / 2;
    RegionMatrix[0 + REGION_SIZE] = Math.max(maxX - minX, maxY - minY);
    RegionMatrix[0 + REGION_NEXT_SIBLING] = -1;
    RegionMatrix[0 + REGION_FIRST_CHILD] = -1;
    RegionMatrix[0 + REGION_MASS] = 0;
    RegionMatrix[0 + REGION_MASS_CENTER_X] = 0;
    RegionMatrix[0 + REGION_MASS_CENTER_Y] = 0;

    // Add each node in the tree
    l = 1;
    for (n = 0; n < order; n += PPN) {
      // Current region, starting with root
      r = 0;
      subdivisionAttempts = SUBDIVISION_ATTEMPTS;

      while (true) {
        // Are there sub-regions?

        // We look at first child index
        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {
          // There are sub-regions

          // We just iterate to find a "leaf" of the tree
          // that is an empty region or a region with a single node
          // (see next case)

          // Find the quadrant of n
          if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
              // Top Left quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD];
            } else {
              // Bottom Left quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
            }
          } else {
            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
              // Top Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
            } else {
              // Bottom Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
            }
          }

          // Update center of mass and mass (we only do it for non-leave regions)
          RegionMatrix[r + REGION_MASS_CENTER_X] =
            (RegionMatrix[r + REGION_MASS_CENTER_X] *
              RegionMatrix[r + REGION_MASS] +
              NodeMatrix[n + NODE_X] * NodeMatrix[n + NODE_MASS]) /
            (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);

          RegionMatrix[r + REGION_MASS_CENTER_Y] =
            (RegionMatrix[r + REGION_MASS_CENTER_Y] *
              RegionMatrix[r + REGION_MASS] +
              NodeMatrix[n + NODE_Y] * NodeMatrix[n + NODE_MASS]) /
            (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);

          RegionMatrix[r + REGION_MASS] += NodeMatrix[n + NODE_MASS];

          // Iterate on the right quadrant
          r = q;
          continue;
        } else {
          // There are no sub-regions: we are in a "leaf"

          // Is there a node in this leave?
          if (RegionMatrix[r + REGION_NODE] < 0) {
            // There is no node in region:
            // we record node n and go on
            RegionMatrix[r + REGION_NODE] = n;
            break;
          } else {
            // There is a node in this region

            // We will need to create sub-regions, stick the two
            // nodes (the old one r[0] and the new one n) in two
            // subregions. If they fall in the same quadrant,
            // we will iterate.

            // Create sub-regions
            RegionMatrix[r + REGION_FIRST_CHILD] = l * PPR;
            w = RegionMatrix[r + REGION_SIZE] / 2; // new size (half)

            // NOTE: we use screen coordinates
            // from Top Left to Bottom Right

            // Top Left sub-region
            g = RegionMatrix[r + REGION_FIRST_CHILD];

            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] =
              RegionMatrix[r + REGION_CENTER_X] - w;
            RegionMatrix[g + REGION_CENTER_Y] =
              RegionMatrix[r + REGION_CENTER_Y] - w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Bottom Left sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] =
              RegionMatrix[r + REGION_CENTER_X] - w;
            RegionMatrix[g + REGION_CENTER_Y] =
              RegionMatrix[r + REGION_CENTER_Y] + w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Top Right sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] =
              RegionMatrix[r + REGION_CENTER_X] + w;
            RegionMatrix[g + REGION_CENTER_Y] =
              RegionMatrix[r + REGION_CENTER_Y] - w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Bottom Right sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] =
              RegionMatrix[r + REGION_CENTER_X] + w;
            RegionMatrix[g + REGION_CENTER_Y] =
              RegionMatrix[r + REGION_CENTER_Y] + w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] =
              RegionMatrix[r + REGION_NEXT_SIBLING];
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            l += 4;

            // Now the goal is to find two different sub-regions
            // for the two nodes: the one previously recorded (r[0])
            // and the one we want to add (n)

            // Find the quadrant of the old node
            if (
              NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X] <
              RegionMatrix[r + REGION_CENTER_X]
            ) {
              if (
                NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] <
                RegionMatrix[r + REGION_CENTER_Y]
              ) {
                // Top Left quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD];
              } else {
                // Bottom Left quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
              }
            } else {
              if (
                NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] <
                RegionMatrix[r + REGION_CENTER_Y]
              ) {
                // Top Right quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
              } else {
                // Bottom Right quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
              }
            }

            // We remove r[0] from the region r, add its mass to r and record it in q
            RegionMatrix[r + REGION_MASS] =
              NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS];
            RegionMatrix[r + REGION_MASS_CENTER_X] =
              NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X];
            RegionMatrix[r + REGION_MASS_CENTER_Y] =
              NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y];

            RegionMatrix[q + REGION_NODE] = RegionMatrix[r + REGION_NODE];
            RegionMatrix[r + REGION_NODE] = -1;

            // Find the quadrant of n
            if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
                // Top Left quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD];
              } else {
                // Bottom Left quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
              }
            } else {
              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
                // Top Right quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
              } else {
                // Bottom Right quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
              }
            }

            if (q === q2) {
              // If both nodes are in the same quadrant,
              // we have to try it again on this quadrant
              if (subdivisionAttempts--) {
                r = q;
                continue; // while
              } else {
                // we are out of precision here, and we cannot subdivide anymore
                // but we have to break the loop anyway
                subdivisionAttempts = SUBDIVISION_ATTEMPTS;
                break; // while
              }
            }

            // If both quadrants are different, we record n
            // in its quadrant
            RegionMatrix[q2 + REGION_NODE] = n;
            break;
          }
        }
      }
    }
  }

  // 2) Repulsion
  //--------------
  // NOTES: adjustSizes = antiCollision & scalingRatio = coefficient

  if (options.barnesHutOptimize) {
    coefficient = options.scalingRatio;

    // Applying repulsion through regions
    for (n = 0; n < order; n += PPN) {
      // Computing leaf quad nodes iteration

      r = 0; // Starting with root region
      while (true) {
        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {
          // The region has sub-regions

          // We run the Barnes Hut test to see if we are at the right distance
          distance =
            Math.pow(
              NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X],
              2
            ) +
            Math.pow(
              NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y],
              2
            );

          s = RegionMatrix[r + REGION_SIZE];

          if ((4 * s * s) / distance < thetaSquared) {
            // We treat the region as a single body, and we repulse

            xDist =
              NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X];
            yDist =
              NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y];

            if (adjustSizes === true) {
              //-- Linear Anti-collision Repulsion
              if (distance > 0) {
                factor =
                  (coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    RegionMatrix[r + REGION_MASS]) /
                  distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              } else if (distance < 0) {
                factor =
                  (-coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    RegionMatrix[r + REGION_MASS]) /
                  Math.sqrt(distance);

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            } else {
              //-- Linear Repulsion
              if (distance > 0) {
                factor =
                  (coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    RegionMatrix[r + REGION_MASS]) /
                  distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }

            // When this is done, we iterate. We have to look at the next sibling.
            r = RegionMatrix[r + REGION_NEXT_SIBLING];
            if (r < 0) break; // No next sibling: we have finished the tree

            continue;
          } else {
            // The region is too close and we have to look at sub-regions
            r = RegionMatrix[r + REGION_FIRST_CHILD];
            continue;
          }
        } else {
          // The region has no sub-region
          // If there is a node r[0] and it is not n, then repulse
          rn = RegionMatrix[r + REGION_NODE];

          if (rn >= 0 && rn !== n) {
            xDist = NodeMatrix[n + NODE_X] - NodeMatrix[rn + NODE_X];
            yDist = NodeMatrix[n + NODE_Y] - NodeMatrix[rn + NODE_Y];

            distance = xDist * xDist + yDist * yDist;

            if (adjustSizes === true) {
              //-- Linear Anti-collision Repulsion
              if (distance > 0) {
                factor =
                  (coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    NodeMatrix[rn + NODE_MASS]) /
                  distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              } else if (distance < 0) {
                factor =
                  (-coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    NodeMatrix[rn + NODE_MASS]) /
                  Math.sqrt(distance);

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            } else {
              //-- Linear Repulsion
              if (distance > 0) {
                factor =
                  (coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    NodeMatrix[rn + NODE_MASS]) /
                  distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }
          }

          // When this is done, we iterate. We have to look at the next sibling.
          r = RegionMatrix[r + REGION_NEXT_SIBLING];

          if (r < 0) break; // No next sibling: we have finished the tree

          continue;
        }
      }
    }
  } else {
    coefficient = options.scalingRatio;

    // Square iteration
    for (n1 = 0; n1 < order; n1 += PPN) {
      for (n2 = 0; n2 < n1; n2 += PPN) {
        // Common to both methods
        xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
        yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];

        if (adjustSizes === true) {
          //-- Anticollision Linear Repulsion
          distance =
            Math.sqrt(xDist * xDist + yDist * yDist) -
            NodeMatrix[n1 + NODE_SIZE] -
            NodeMatrix[n2 + NODE_SIZE];

          if (distance > 0) {
            factor =
              (coefficient *
                NodeMatrix[n1 + NODE_MASS] *
                NodeMatrix[n2 + NODE_MASS]) /
              distance /
              distance;

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] += xDist * factor;
            NodeMatrix[n2 + NODE_DY] += yDist * factor;
          } else if (distance < 0) {
            factor =
              100 *
              coefficient *
              NodeMatrix[n1 + NODE_MASS] *
              NodeMatrix[n2 + NODE_MASS];

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] -= xDist * factor;
            NodeMatrix[n2 + NODE_DY] -= yDist * factor;
          }
        } else {
          //-- Linear Repulsion
          distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            factor =
              (coefficient *
                NodeMatrix[n1 + NODE_MASS] *
                NodeMatrix[n2 + NODE_MASS]) /
              distance /
              distance;

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] -= xDist * factor;
            NodeMatrix[n2 + NODE_DY] -= yDist * factor;
          }
        }
      }
    }
  }

  // 3) Gravity
  //------------
  g = options.gravity / options.scalingRatio;
  coefficient = options.scalingRatio;
  for (n = 0; n < order; n += PPN) {
    factor = 0;

    // Common to both methods
    xDist = NodeMatrix[n + NODE_X];
    yDist = NodeMatrix[n + NODE_Y];
    distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

    if (options.strongGravityMode) {
      //-- Strong gravity
      if (distance > 0) factor = coefficient * NodeMatrix[n + NODE_MASS] * g;
    } else {
      //-- Linear Anti-collision Repulsion n
      if (distance > 0)
        factor = (coefficient * NodeMatrix[n + NODE_MASS] * g) / distance;
    }

    // Updating node's dx and dy
    NodeMatrix[n + NODE_DX] -= xDist * factor;
    NodeMatrix[n + NODE_DY] -= yDist * factor;
  }

  // 4) Attraction
  //---------------
  coefficient =
    1 * (options.outboundAttractionDistribution ? outboundAttCompensation : 1);

  // TODO: simplify distance
  // TODO: coefficient is always used as -c --> optimize?
  for (e = 0; e < size; e += PPE) {
    n1 = EdgeMatrix[e + EDGE_SOURCE];
    n2 = EdgeMatrix[e + EDGE_TARGET];
    w = EdgeMatrix[e + EDGE_WEIGHT];

    // Edge weight influence
    ewc = Math.pow(w, options.edgeWeightInfluence);

    // Common measures
    xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
    yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];

    // Applying attraction to nodes
    if (adjustSizes === true) {
      distance =
        Math.sqrt(xDist * xDist + yDist * yDist) -
        NodeMatrix[n1 + NODE_SIZE] -
        NodeMatrix[n2 + NODE_SIZE];

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {
          //-- LinLog Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor =
              (-coefficient * ewc * Math.log(1 + distance)) /
              distance /
              NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- LinLog Anti-collision Attraction
          if (distance > 0) {
            factor = (-coefficient * ewc * Math.log(1 + distance)) / distance;
          }
        }
      } else {
        if (options.outboundAttractionDistribution) {
          //-- Linear Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor = (-coefficient * ewc) / NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- Linear Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc;
          }
        }
      }
    } else {
      distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {
          //-- LinLog Degree Distributed Attraction
          if (distance > 0) {
            factor =
              (-coefficient * ewc * Math.log(1 + distance)) /
              distance /
              NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- LinLog Attraction
          if (distance > 0)
            factor = (-coefficient * ewc * Math.log(1 + distance)) / distance;
        }
      } else {
        if (options.outboundAttractionDistribution) {
          //-- Linear Attraction Mass Distributed
          // NOTE: Distance is set to 1 to override next condition
          distance = 1;
          factor = (-coefficient * ewc) / NodeMatrix[n1 + NODE_MASS];
        } else {
          //-- Linear Attraction
          // NOTE: Distance is set to 1 to override next condition
          distance = 1;
          factor = -coefficient * ewc;
        }
      }
    }

    // Updating nodes' dx and dy
    // TODO: if condition or factor = 1?
    if (distance > 0) {
      // Updating nodes' dx and dy
      NodeMatrix[n1 + NODE_DX] += xDist * factor;
      NodeMatrix[n1 + NODE_DY] += yDist * factor;

      NodeMatrix[n2 + NODE_DX] -= xDist * factor;
      NodeMatrix[n2 + NODE_DY] -= yDist * factor;
    }
  }

  // 5) Apply Forces
  //-----------------
  var force, swinging, traction, nodespeed, newX, newY;

  // MATH: sqrt and square distances
  if (adjustSizes === true) {
    for (n = 0; n < order; n += PPN) {
      if (NodeMatrix[n + NODE_FIXED] !== 1) {
        force = Math.sqrt(
          Math.pow(NodeMatrix[n + NODE_DX], 2) +
            Math.pow(NodeMatrix[n + NODE_DY], 2)
        );

        if (force > MAX_FORCE) {
          NodeMatrix[n + NODE_DX] =
            (NodeMatrix[n + NODE_DX] * MAX_FORCE) / force;
          NodeMatrix[n + NODE_DY] =
            (NodeMatrix[n + NODE_DY] * MAX_FORCE) / force;
        }

        swinging =
          NodeMatrix[n + NODE_MASS] *
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) *
              (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) +
              (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) *
                (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY])
          );

        traction =
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) *
              (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) +
              (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) *
                (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])
          ) / 2;

        nodespeed = (0.1 * Math.log(1 + traction)) / (1 + Math.sqrt(swinging));

        // Updating node's positon
        newX =
          NodeMatrix[n + NODE_X] +
          NodeMatrix[n + NODE_DX] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_X] = newX;

        newY =
          NodeMatrix[n + NODE_Y] +
          NodeMatrix[n + NODE_DY] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_Y] = newY;
      }
    }
  } else {
    for (n = 0; n < order; n += PPN) {
      if (NodeMatrix[n + NODE_FIXED] !== 1) {
        swinging =
          NodeMatrix[n + NODE_MASS] *
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) *
              (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) +
              (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) *
                (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY])
          );

        traction =
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) *
              (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) +
              (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) *
                (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])
          ) / 2;

        nodespeed =
          (NodeMatrix[n + NODE_CONVERGENCE] * Math.log(1 + traction)) /
          (1 + Math.sqrt(swinging));

        // Updating node convergence
        NodeMatrix[n + NODE_CONVERGENCE] = Math.min(
          1,
          Math.sqrt(
            (nodespeed *
              (Math.pow(NodeMatrix[n + NODE_DX], 2) +
                Math.pow(NodeMatrix[n + NODE_DY], 2))) /
              (1 + Math.sqrt(swinging))
          )
        );

        // Updating node's positon
        newX =
          NodeMatrix[n + NODE_X] +
          NodeMatrix[n + NODE_DX] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_X] = newX;

        newY =
          NodeMatrix[n + NODE_Y] +
          NodeMatrix[n + NODE_DY] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_Y] = newY;
      }
    }
  }

  // We return the information about the layout (no need to return the matrices)
  return {};
};


/***/ }),

/***/ "./node_modules/graphology-layout/circlepack.js":
/*!******************************************************!*\
  !*** ./node_modules/graphology-layout/circlepack.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Graphology CirclePack Layout
 * =============================
 *
 * Circlepack layout from d3-hierarchy/gephi.
 */
var resolveDefaults = __webpack_require__(/*! graphology-utils/defaults */ "./node_modules/graphology-utils/defaults.js");
var isGraph = __webpack_require__(/*! graphology-utils/is-graph */ "./node_modules/graphology-utils/is-graph.js");
var shuffle = __webpack_require__(/*! pandemonium/shuffle-in-place */ "./node_modules/pandemonium/shuffle-in-place.js");

/**
 * Default options.
 */
var DEFAULTS = {
  attributes: {
    x: 'x',
    y: 'y'
  },
  center: 0,
  hierarchyAttributes: [],
  rng: Math.random,
  scale: 1
};

/**
 * Helpers.
 */
function CircleWrap(id, x, y, r, circleWrap) {
  this.wrappedCircle = circleWrap || null; //hacky d3 reference thing

  this.children = {};
  this.countChildren = 0;
  this.id = id || null;
  this.next = null;
  this.previous = null;

  this.x = x || null;
  this.y = y || null;
  if (circleWrap) this.r = 1010101;
  // for debugging purposes - should not be used in this case
  else this.r = r || 999;
}

CircleWrap.prototype.hasChildren = function () {
  return this.countChildren > 0;
};

CircleWrap.prototype.addChild = function (id, child) {
  this.children[id] = child;
  ++this.countChildren;
};

CircleWrap.prototype.getChild = function (id) {
  if (!this.children.hasOwnProperty(id)) {
    var circleWrap = new CircleWrap();
    this.children[id] = circleWrap;
    ++this.countChildren;
  }
  return this.children[id];
};

CircleWrap.prototype.applyPositionToChildren = function () {
  if (this.hasChildren()) {
    var root = this; // using 'this' in Object.keys.forEach seems a bad idea
    for (var key in root.children) {
      var child = root.children[key];
      child.x += root.x;
      child.y += root.y;
      child.applyPositionToChildren();
    }
  }
};

function setNode(/*Graph*/ graph, /*CircleWrap*/ parentCircle, /*Map*/ posMap) {
  for (var key in parentCircle.children) {
    var circle = parentCircle.children[key];
    if (circle.hasChildren()) {
      setNode(graph, circle, posMap);
    } else {
      posMap[circle.id] = {x: circle.x, y: circle.y};
    }
  }
}

function enclosesNot(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r - b.r;
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return dr < 0 || dr * dr < dx * dx + dy * dy;
}

function enclosesWeak(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r - b.r + 1e-6;
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function enclosesWeakAll(/*CircleWrap*/ a, /*Array<CircleWrap>*/ B) {
  for (var i = 0; i < B.length; ++i) {
    if (!enclosesWeak(a, B[i])) {
      return false;
    }
  }
  return true;
}

function encloseBasis1(/*CircleWrap*/ a) {
  return new CircleWrap(null, a.x, a.y, a.r);
}

function encloseBasis2(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var x1 = a.x,
    y1 = a.y,
    r1 = a.r,
    x2 = b.x,
    y2 = b.y,
    r2 = b.r,
    x21 = x2 - x1,
    y21 = y2 - y1,
    r21 = r2 - r1,
    l = Math.sqrt(x21 * x21 + y21 * y21);
  return new CircleWrap(
    null,
    (x1 + x2 + (x21 / l) * r21) / 2,
    (y1 + y2 + (y21 / l) * r21) / 2,
    (l + r1 + r2) / 2
  );
}

function encloseBasis3(/*CircleWrap*/ a, /*CircleWrap*/ b, /*CircleWrap*/ c) {
  var x1 = a.x,
    y1 = a.y,
    r1 = a.r,
    x2 = b.x,
    y2 = b.y,
    r2 = b.r,
    x3 = c.x,
    y3 = c.y,
    r3 = c.r,
    a2 = x1 - x2,
    a3 = x1 - x3,
    b2 = y1 - y2,
    b3 = y1 - y3,
    c2 = r2 - r1,
    c3 = r3 - r1,
    d1 = x1 * x1 + y1 * y1 - r1 * r1,
    d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
    d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
    ab = a3 * b2 - a2 * b3,
    xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
    xb = (b3 * c2 - b2 * c3) / ab,
    ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
    yb = (a2 * c3 - a3 * c2) / ab,
    A = xb * xb + yb * yb - 1,
    B = 2 * (r1 + xa * xb + ya * yb),
    C = xa * xa + ya * ya - r1 * r1,
    r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
  return new CircleWrap(null, x1 + xa + xb * r, y1 + ya + yb * r, r);
}

function encloseBasis(/*Array<CircleWrap>*/ B) {
  switch (B.length) {
    case 1:
      return encloseBasis1(B[0]);
    case 2:
      return encloseBasis2(B[0], B[1]);
    case 3:
      return encloseBasis3(B[0], B[1], B[2]);
    default:
      throw new Error(
        'graphology-layout/circlepack: Invalid basis length ' + B.length
      );
  }
}

function extendBasis(/*Array<CircleWrap>*/ B, /*CircleWrap*/ p) {
  var i, j;

  if (enclosesWeakAll(p, B)) return [p];

  // If we get here then B must have at least one element.
  for (i = 0; i < B.length; ++i) {
    if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
      return [B[i], p];
    }
  }

  // If we get here then B must have at least two elements.
  for (i = 0; i < B.length - 1; ++i) {
    for (j = i + 1; j < B.length; ++j) {
      if (
        enclosesNot(encloseBasis2(B[i], B[j]), p) &&
        enclosesNot(encloseBasis2(B[i], p), B[j]) &&
        enclosesNot(encloseBasis2(B[j], p), B[i]) &&
        enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)
      ) {
        return [B[i], B[j], p];
      }
    }
  }

  // If we get here then something is very wrong.
  throw new Error('graphology-layout/circlepack: extendBasis failure !');
}

function score(/*CircleWrap*/ node) {
  var a = node.wrappedCircle;
  var b = node.next.wrappedCircle;
  var ab = a.r + b.r;
  var dx = (a.x * b.r + b.x * a.r) / ab;
  var dy = (a.y * b.r + b.y * a.r) / ab;
  return dx * dx + dy * dy;
}

function enclose(circles, shuffleFunc) {
  var i = 0;
  var circlesLoc = circles.slice();

  var n = circles.length;
  var B = [];
  var p;
  var e;
  shuffleFunc(circlesLoc);
  while (i < n) {
    p = circlesLoc[i];
    if (e && enclosesWeak(e, p)) {
      ++i;
    } else {
      B = extendBasis(B, p);
      e = encloseBasis(B);
      i = 0;
    }
  }
  return e;
}

function place(/*CircleWrap*/ b, /*CircleWrap*/ a, /*CircleWrap*/ c) {
  var dx = b.x - a.x,
    x,
    a2,
    dy = b.y - a.y,
    y,
    b2,
    d2 = dx * dx + dy * dy;
  if (d2) {
    a2 = a.r + c.r;
    a2 *= a2;
    b2 = b.r + c.r;
    b2 *= b2;
    if (a2 > b2) {
      x = (d2 + b2 - a2) / (2 * d2);
      y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
      c.x = b.x - x * dx - y * dy;
      c.y = b.y - x * dy + y * dx;
    } else {
      x = (d2 + a2 - b2) / (2 * d2);
      y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
      c.x = a.x + x * dx - y * dy;
      c.y = a.y + x * dy + y * dx;
    }
  } else {
    c.x = a.x + c.r;
    c.y = a.y;
  }
}

function intersects(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r + b.r - 1e-6,
    dx = b.x - a.x,
    dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function packEnclose(/*Array<CircleWrap>*/ circles, shuffleFunc) {
  var n = circles.length;
  if (n === 0) return 0;

  var a, b, c, aa, ca, i, j, k, sj, sk;

  // Place the first circle.
  a = circles[0];
  a.x = 0;
  a.y = 0;
  if (n <= 1) return a.r;

  // Place the second circle.
  b = circles[1];
  a.x = -b.r;
  b.x = a.r;
  b.y = 0;
  if (n <= 2) return a.r + b.r;

  // Place the third circle.
  c = circles[2];
  place(b, a, c);

  // Initialize the front-chain using the first three circles a, b and c.
  a = new CircleWrap(null, null, null, null, a);
  b = new CircleWrap(null, null, null, null, b);
  c = new CircleWrap(null, null, null, null, c);
  a.next = c.previous = b;
  b.next = a.previous = c;
  c.next = b.previous = a;

  // Attempt to place each remaining circle…
  pack: for (i = 3; i < n; ++i) {
    c = circles[i];
    place(a.wrappedCircle, b.wrappedCircle, c);
    c = new CircleWrap(null, null, null, null, c);

    // Find the closest intersecting circle on the front-chain, if any.
    // “Closeness” is determined by linear distance along the front-chain.
    // “Ahead” or “behind” is likewise determined by linear distance.
    j = b.next;
    k = a.previous;
    sj = b.wrappedCircle.r;
    sk = a.wrappedCircle.r;
    do {
      if (sj <= sk) {
        if (intersects(j.wrappedCircle, c.wrappedCircle)) {
          b = j;
          a.next = b;
          b.previous = a;
          --i;
          continue pack;
        }
        sj += j.wrappedCircle.r;
        j = j.next;
      } else {
        if (intersects(k.wrappedCircle, c.wrappedCircle)) {
          a = k;
          a.next = b;
          b.previous = a;
          --i;
          continue pack;
        }
        sk += k.wrappedCircle.r;
        k = k.previous;
      }
    } while (j !== k.next);

    // Success! Insert the new circle c between a and b.
    c.previous = a;
    c.next = b;
    a.next = b.previous = b = c;

    // Compute the new closest circle pair to the centroid.
    aa = score(a);
    while ((c = c.next) !== b) {
      if ((ca = score(c)) < aa) {
        a = c;
        aa = ca;
      }
    }
    b = a.next;
  }

  // Compute the enclosing circle of the front chain.
  a = [b.wrappedCircle];
  c = b;
  var safety = 10000;
  while ((c = c.next) !== b) {
    if (--safety === 0) {
      break;
    }
    a.push(c.wrappedCircle);
  }
  c = enclose(a, shuffleFunc);

  // Translate the circles to put the enclosing circle around the origin.
  for (i = 0; i < n; ++i) {
    a = circles[i];
    a.x -= c.x;
    a.y -= c.y;
  }
  return c.r;
}

function packHierarchy(/*CircleWrap*/ parentCircle, shuffleFunc) {
  var r = 0;
  if (parentCircle.hasChildren()) {
    //pack the children first because the radius is determined by how the children get packed (recursive)
    for (var key in parentCircle.children) {
      var circle = parentCircle.children[key];
      if (circle.hasChildren()) {
        circle.r = packHierarchy(circle, shuffleFunc);
      }
    }
    //now that each circle has a radius set by its children, pack the circles at this level
    r = packEnclose(Object.values(parentCircle.children), shuffleFunc);
  }
  return r;
}

function packHierarchyAndShift(/*CircleWrap*/ parentCircle, shuffleFunc) {
  packHierarchy(parentCircle, shuffleFunc);
  for (var key in parentCircle.children) {
    var circle = parentCircle.children[key];
    circle.applyPositionToChildren();
  }
}

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph                   - Target  graph.
 * @param  {object}   [options]               - Options:
 * @param  {object}     [attributes]          - Attributes names to map.
 * @param  {number}     [center]              - Center of the layout.
 * @param  {string[]}   [hierarchyAttributes] - List of attributes used for the layout in decreasing order.
 * @param  {function}   [rng]                 - Custom RNG function to be used.
 * @param  {number}     [scale]               - Scale of the layout.
 * @return {object}                           - The positions by node.
 */
function genericCirclePackLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/circlepack: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var posMap = {},
    positions = {},
    nodes = graph.nodes(),
    center = options.center,
    hierarchyAttributes = options.hierarchyAttributes,
    shuffleFunc = shuffle.createShuffleInPlace(options.rng),
    scale = options.scale;

  var container = new CircleWrap();

  graph.forEachNode(function (key, attributes) {
    var r = attributes.size ? attributes.size : 1;
    var newCircleWrap = new CircleWrap(key, null, null, r);
    var parentContainer = container;

    hierarchyAttributes.forEach(function (v) {
      var attr = attributes[v];
      parentContainer = parentContainer.getChild(attr);
    });

    parentContainer.addChild(key, newCircleWrap);
  });
  packHierarchyAndShift(container, shuffleFunc);
  setNode(graph, container, posMap);
  var l = nodes.length,
    x,
    y,
    i;
  for (i = 0; i < l; i++) {
    var node = nodes[i];

    x = center + scale * posMap[node].x;
    y = center + scale * posMap[node].y;

    positions[node] = {
      x: x,
      y: y
    };

    if (assign) {
      graph.setNodeAttribute(node, options.attributes.x, x);
      graph.setNodeAttribute(node, options.attributes.y, y);
    }
  }
  return positions;
}

var circlePackLayout = genericCirclePackLayout.bind(null, false);
circlePackLayout.assign = genericCirclePackLayout.bind(null, true);

module.exports = circlePackLayout;


/***/ }),

/***/ "./node_modules/graphology-layout/circular.js":
/*!****************************************************!*\
  !*** ./node_modules/graphology-layout/circular.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Graphology Circular Layout
 * ===========================
 *
 * Layout arranging the nodes in a circle.
 */
var resolveDefaults = __webpack_require__(/*! graphology-utils/defaults */ "./node_modules/graphology-utils/defaults.js");
var isGraph = __webpack_require__(/*! graphology-utils/is-graph */ "./node_modules/graphology-utils/is-graph.js");

/**
 * Default options.
 */
var DEFAULTS = {
  dimensions: ['x', 'y'],
  center: 0.5,
  scale: 1
};

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {object}   [options]      - Options:
 * @param  {object}     [attributes] - Attributes names to map.
 * @param  {number}     [center]     - Center of the layout.
 * @param  {number}     [scale]      - Scale of the layout.
 * @return {object}                  - The positions by node.
 */
function genericCircularLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/random: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var dimensions = options.dimensions;

  if (!Array.isArray(dimensions) || dimensions.length !== 2)
    throw new Error('graphology-layout/random: given dimensions are invalid.');

  var center = options.center;
  var scale = options.scale;
  var tau = Math.PI * 2;

  var offset = (center - 0.5) * scale;
  var l = graph.order;

  var x = dimensions[0];
  var y = dimensions[1];

  function assignPosition(i, target) {
    target[x] = scale * Math.cos((i * tau) / l) + offset;
    target[y] = scale * Math.sin((i * tau) / l) + offset;

    return target;
  }

  var i = 0;

  if (!assign) {
    var positions = {};

    graph.forEachNode(function (node) {
      positions[node] = assignPosition(i++, {});
    });

    return positions;
  }

  graph.updateEachNodeAttributes(
    function (_, attr) {
      assignPosition(i++, attr);
      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

var circularLayout = genericCircularLayout.bind(null, false);
circularLayout.assign = genericCircularLayout.bind(null, true);

module.exports = circularLayout;


/***/ }),

/***/ "./node_modules/graphology-layout/index.js":
/*!*************************************************!*\
  !*** ./node_modules/graphology-layout/index.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

/**
 * Graphology Layout
 * ==================
 *
 * Library endpoint.
 */
exports.circlepack = __webpack_require__(/*! ./circlepack.js */ "./node_modules/graphology-layout/circlepack.js");
exports.circular = __webpack_require__(/*! ./circular.js */ "./node_modules/graphology-layout/circular.js");
exports.random = __webpack_require__(/*! ./random.js */ "./node_modules/graphology-layout/random.js");
exports.rotation = __webpack_require__(/*! ./rotation.js */ "./node_modules/graphology-layout/rotation.js");


/***/ }),

/***/ "./node_modules/graphology-layout/random.js":
/*!**************************************************!*\
  !*** ./node_modules/graphology-layout/random.js ***!
  \**************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Graphology Random Layout
 * =========================
 *
 * Simple layout giving uniform random positions to the nodes.
 */
var resolveDefaults = __webpack_require__(/*! graphology-utils/defaults */ "./node_modules/graphology-utils/defaults.js");
var isGraph = __webpack_require__(/*! graphology-utils/is-graph */ "./node_modules/graphology-utils/is-graph.js");

/**
 * Default options.
 */
var DEFAULTS = {
  dimensions: ['x', 'y'],
  center: 0.5,
  rng: Math.random,
  scale: 1
};

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {object}   [options]      - Options:
 * @param  {array}      [dimensions] - List of dimensions of the layout.
 * @param  {number}     [center]     - Center of the layout.
 * @param  {function}   [rng]        - Custom RNG function to be used.
 * @param  {number}     [scale]      - Scale of the layout.
 * @return {object}                  - The positions by node.
 */
function genericRandomLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/random: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var dimensions = options.dimensions;

  if (!Array.isArray(dimensions) || dimensions.length < 1)
    throw new Error('graphology-layout/random: given dimensions are invalid.');

  var d = dimensions.length;
  var center = options.center;
  var rng = options.rng;
  var scale = options.scale;

  var offset = (center - 0.5) * scale;

  function assignPosition(target) {
    for (var i = 0; i < d; i++) {
      target[dimensions[i]] = rng() * scale + offset;
    }

    return target;
  }

  if (!assign) {
    var positions = {};

    graph.forEachNode(function (node) {
      positions[node] = assignPosition({});
    });

    return positions;
  }

  graph.updateEachNodeAttributes(
    function (_, attr) {
      assignPosition(attr);
      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

var randomLayout = genericRandomLayout.bind(null, false);
randomLayout.assign = genericRandomLayout.bind(null, true);

module.exports = randomLayout;


/***/ }),

/***/ "./node_modules/graphology-layout/rotation.js":
/*!****************************************************!*\
  !*** ./node_modules/graphology-layout/rotation.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Graphology Rotation Layout Helper
 * ==================================
 *
 * Function rotating the coordinates of the graph.
 */
var resolveDefaults = __webpack_require__(/*! graphology-utils/defaults */ "./node_modules/graphology-utils/defaults.js");
var isGraph = __webpack_require__(/*! graphology-utils/is-graph */ "./node_modules/graphology-utils/is-graph.js");

/**
 * Constants.
 */
var RAD_CONVERSION = Math.PI / 180;

/**
 * Default options.
 */
var DEFAULTS = {
  dimensions: ['x', 'y'],
  centeredOnZero: false,
  degrees: false
};

/**
 * Abstract function for rotating a graph's coordinates.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {number}   angle          - Rotation angle.
 * @param  {object}   [options]      - Options.
 * @return {object}                  - The positions by node.
 */
function genericRotation(assign, graph, angle, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/rotation: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  if (options.degrees) angle *= RAD_CONVERSION;

  var dimensions = options.dimensions;

  if (!Array.isArray(dimensions) || dimensions.length !== 2)
    throw new Error('graphology-layout/random: given dimensions are invalid.');

  // Handling null graph
  if (graph.order === 0) {
    if (assign) return;

    return {};
  }

  var xd = dimensions[0];
  var yd = dimensions[1];

  var xCenter = 0;
  var yCenter = 0;

  if (!options.centeredOnZero) {
    // Finding bounds of the graph
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMin = Infinity;
    var yMax = -Infinity;

    graph.forEachNode(function (node, attr) {
      var x = attr[xd];
      var y = attr[yd];

      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    });

    xCenter = (xMin + xMax) / 2;
    yCenter = (yMin + yMax) / 2;
  }

  var cos = Math.cos(angle);
  var sin = Math.sin(angle);

  function assignPosition(target) {
    var x = target[xd];
    var y = target[yd];

    target[xd] = xCenter + (x - xCenter) * cos - (y - yCenter) * sin;
    target[yd] = yCenter + (x - xCenter) * sin + (y - yCenter) * cos;

    return target;
  }

  if (!assign) {
    var positions = {};

    graph.forEachNode(function (node, attr) {
      var o = {};
      o[xd] = attr[xd];
      o[yd] = attr[yd];
      positions[node] = assignPosition(o);
    });

    return positions;
  }

  graph.updateEachNodeAttributes(
    function (_, attr) {
      assignPosition(attr);
      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

var rotation = genericRotation.bind(null, false);
rotation.assign = genericRotation.bind(null, true);

module.exports = rotation;


/***/ }),

/***/ "./node_modules/graphology-utils/defaults.js":
/*!***************************************************!*\
  !*** ./node_modules/graphology-utils/defaults.js ***!
  \***************************************************/
/***/ ((module) => {

/**
 * Graphology Defaults
 * ====================
 *
 * Helper function used throughout the standard lib to resolve defaults.
 */
function isLeaf(o) {
  return (
    !o ||
    typeof o !== 'object' ||
    typeof o === 'function' ||
    Array.isArray(o) ||
    o instanceof Set ||
    o instanceof Map ||
    o instanceof RegExp ||
    o instanceof Date
  );
}

function resolveDefaults(target, defaults) {
  target = target || {};

  var output = {};

  for (var k in defaults) {
    var existing = target[k];
    var def = defaults[k];

    // Recursion
    if (!isLeaf(def)) {
      output[k] = resolveDefaults(existing, def);

      continue;
    }

    // Leaf
    if (existing === undefined) {
      output[k] = def;
    } else {
      output[k] = existing;
    }
  }

  return output;
}

module.exports = resolveDefaults;


/***/ }),

/***/ "./node_modules/graphology-utils/getters.js":
/*!**************************************************!*\
  !*** ./node_modules/graphology-utils/getters.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

/**
 * Graphology Weight Getter
 * =========================
 *
 * Function creating weight getters.
 */
function coerceWeight(value) {
  // Ensuring target value is a correct number
  if (typeof value !== 'number' || isNaN(value)) return 1;

  return value;
}

function createNodeValueGetter(nameOrFunction, defaultValue) {
  var getter = {};

  var coerceToDefault = function (v) {
    if (typeof v === 'undefined') return defaultValue;

    return v;
  };

  if (typeof defaultValue === 'function') coerceToDefault = defaultValue;

  var get = function (attributes) {
    return coerceToDefault(attributes[nameOrFunction]);
  };

  var returnDefault = function () {
    return coerceToDefault(undefined);
  };

  if (typeof nameOrFunction === 'string') {
    getter.fromAttributes = get;
    getter.fromGraph = function (graph, node) {
      return get(graph.getNodeAttributes(node));
    };
    getter.fromEntry = function (node, attributes) {
      return get(attributes);
    };
  } else if (typeof nameOrFunction === 'function') {
    getter.fromAttributes = function () {
      throw new Error(
        'graphology-utils/getters/createNodeValueGetter: irrelevant usage.'
      );
    };
    getter.fromGraph = function (graph, node) {
      return coerceToDefault(
        nameOrFunction(node, graph.getNodeAttributes(node))
      );
    };
    getter.fromEntry = function (node, attributes) {
      return coerceToDefault(nameOrFunction(node, attributes));
    };
  } else {
    getter.fromAttributes = returnDefault;
    getter.fromGraph = returnDefault;
    getter.fromEntry = returnDefault;
  }

  return getter;
}

function createEdgeValueGetter(nameOrFunction, defaultValue) {
  var getter = {};

  var coerceToDefault = function (v) {
    if (typeof v === 'undefined') return defaultValue;

    return v;
  };

  if (typeof defaultValue === 'function') coerceToDefault = defaultValue;

  var get = function (attributes) {
    return coerceToDefault(attributes[nameOrFunction]);
  };

  var returnDefault = function () {
    return coerceToDefault(undefined);
  };

  if (typeof nameOrFunction === 'string') {
    getter.fromAttributes = get;
    getter.fromGraph = function (graph, edge) {
      return get(graph.getEdgeAttributes(edge));
    };
    getter.fromEntry = function (edge, attributes) {
      return get(attributes);
    };
    getter.fromPartialEntry = getter.fromEntry;
    getter.fromMinimalEntry = getter.fromEntry;
  } else if (typeof nameOrFunction === 'function') {
    getter.fromAttributes = function () {
      throw new Error(
        'graphology-utils/getters/createEdgeValueGetter: irrelevant usage.'
      );
    };
    getter.fromGraph = function (graph, edge) {
      // TODO: we can do better, check #310
      var extremities = graph.extremities(edge);
      return coerceToDefault(
        nameOrFunction(
          edge,
          graph.getEdgeAttributes(edge),
          extremities[0],
          extremities[1],
          graph.getNodeAttributes(extremities[0]),
          graph.getNodeAttributes(extremities[1]),
          graph.isUndirected(edge)
        )
      );
    };
    getter.fromEntry = function (e, a, s, t, sa, ta, u) {
      return coerceToDefault(nameOrFunction(e, a, s, t, sa, ta, u));
    };
    getter.fromPartialEntry = function (e, a, s, t) {
      return coerceToDefault(nameOrFunction(e, a, s, t));
    };
    getter.fromMinimalEntry = function (e, a) {
      return coerceToDefault(nameOrFunction(e, a));
    };
  } else {
    getter.fromAttributes = returnDefault;
    getter.fromGraph = returnDefault;
    getter.fromEntry = returnDefault;
    getter.fromMinimalEntry = returnDefault;
  }

  return getter;
}

exports.createNodeValueGetter = createNodeValueGetter;
exports.createEdgeValueGetter = createEdgeValueGetter;
exports.createEdgeWeightGetter = function (name) {
  return createEdgeValueGetter(name, coerceWeight);
};


/***/ }),

/***/ "./node_modules/graphology-utils/is-graph.js":
/*!***************************************************!*\
  !*** ./node_modules/graphology-utils/is-graph.js ***!
  \***************************************************/
/***/ ((module) => {

/**
 * Graphology isGraph
 * ===================
 *
 * Very simple function aiming at ensuring the given variable is a
 * graphology instance.
 */

/**
 * Checking the value is a graphology instance.
 *
 * @param  {any}     value - Target value.
 * @return {boolean}
 */
module.exports = function isGraph(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNode === 'function' &&
    typeof value.multi === 'boolean'
  );
};


/***/ }),

/***/ "./node_modules/graphology/dist/graphology.umd.min.js":
/*!************************************************************!*\
  !*** ./node_modules/graphology/dist/graphology.umd.min.js ***!
  \************************************************************/
/***/ (function(module) {

!function(t,e){ true?module.exports=e():0}(this,(function(){"use strict";function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,r(t,e)}function n(t){return n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},n(t)}function r(t,e){return r=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},r(t,e)}function i(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function o(t,e,n){return o=i()?Reflect.construct:function(t,e,n){var i=[null];i.push.apply(i,e);var o=new(Function.bind.apply(t,i));return n&&r(o,n.prototype),o},o.apply(null,arguments)}function a(t){var e="function"==typeof Map?new Map:void 0;return a=function(t){if(null===t||(i=t,-1===Function.toString.call(i).indexOf("[native code]")))return t;var i;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,a)}function a(){return o(t,arguments,n(this).constructor)}return a.prototype=Object.create(t.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),r(a,t)},a(t)}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var c=function(){for(var t=arguments[0],e=1,n=arguments.length;e<n;e++)if(arguments[e])for(var r in arguments[e])t[r]=arguments[e][r];return t};function s(t,e,n,r){var i=t._nodes.get(e),o=null;return i?o="mixed"===r?i.out&&i.out[n]||i.undirected&&i.undirected[n]:"directed"===r?i.out&&i.out[n]:i.undirected&&i.undirected[n]:o}function d(e){return null!==e&&"object"===t(e)&&"function"==typeof e.addUndirectedEdgeWithKey&&"function"==typeof e.dropNode}function h(e){return"object"===t(e)&&null!==e&&e.constructor===Object}function p(t){var e;for(e in t)return!1;return!0}function f(t,e,n){Object.defineProperty(t,e,{enumerable:!1,configurable:!1,writable:!0,value:n})}function l(t,e,n){var r={enumerable:!0,configurable:!0};"function"==typeof n?r.get=n:(r.value=n,r.writable=!1),Object.defineProperty(t,e,r)}function g(t){return!!h(t)&&!(t.attributes&&!Array.isArray(t.attributes))}"function"==typeof Object.assign&&(c=Object.assign);var y,w={exports:{}},v="object"==typeof Reflect?Reflect:null,b=v&&"function"==typeof v.apply?v.apply:function(t,e,n){return Function.prototype.apply.call(t,e,n)};y=v&&"function"==typeof v.ownKeys?v.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var m=Number.isNaN||function(t){return t!=t};function k(){k.init.call(this)}w.exports=k,w.exports.once=function(t,e){return new Promise((function(n,r){function i(n){t.removeListener(e,o),r(n)}function o(){"function"==typeof t.removeListener&&t.removeListener("error",i),n([].slice.call(arguments))}N(t,e,o,{once:!0}),"error"!==e&&function(t,e,n){"function"==typeof t.on&&N(t,"error",e,n)}(t,i,{once:!0})}))},k.EventEmitter=k,k.prototype._events=void 0,k.prototype._eventsCount=0,k.prototype._maxListeners=void 0;var _=10;function G(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function x(t){return void 0===t._maxListeners?k.defaultMaxListeners:t._maxListeners}function E(t,e,n,r){var i,o,a,u;if(G(n),void 0===(o=t._events)?(o=t._events=Object.create(null),t._eventsCount=0):(void 0!==o.newListener&&(t.emit("newListener",e,n.listener?n.listener:n),o=t._events),a=o[e]),void 0===a)a=o[e]=n,++t._eventsCount;else if("function"==typeof a?a=o[e]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),(i=x(t))>0&&a.length>i&&!a.warned){a.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=t,c.type=e,c.count=a.length,u=c,console&&console.warn&&console.warn(u)}return t}function A(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function S(t,e,n){var r={fired:!1,wrapFn:void 0,target:t,type:e,listener:n},i=A.bind(r);return i.listener=n,r.wrapFn=i,i}function D(t,e,n){var r=t._events;if(void 0===r)return[];var i=r[e];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?function(t){for(var e=new Array(t.length),n=0;n<e.length;++n)e[n]=t[n].listener||t[n];return e}(i):U(i,i.length)}function L(t){var e=this._events;if(void 0!==e){var n=e[t];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function U(t,e){for(var n=new Array(e),r=0;r<e;++r)n[r]=t[r];return n}function N(t,e,n,r){if("function"==typeof t.on)r.once?t.once(e,n):t.on(e,n);else{if("function"!=typeof t.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof t);t.addEventListener(e,(function i(o){r.once&&t.removeEventListener(e,i),n(o)}))}}function j(t){if("function"!=typeof t)throw new Error("obliterator/iterator: expecting a function!");this.next=t}Object.defineProperty(k,"defaultMaxListeners",{enumerable:!0,get:function(){return _},set:function(t){if("number"!=typeof t||t<0||m(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");_=t}}),k.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},k.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||m(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},k.prototype.getMaxListeners=function(){return x(this)},k.prototype.emit=function(t){for(var e=[],n=1;n<arguments.length;n++)e.push(arguments[n]);var r="error"===t,i=this._events;if(void 0!==i)r=r&&void 0===i.error;else if(!r)return!1;if(r){var o;if(e.length>0&&(o=e[0]),o instanceof Error)throw o;var a=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw a.context=o,a}var u=i[t];if(void 0===u)return!1;if("function"==typeof u)b(u,this,e);else{var c=u.length,s=U(u,c);for(n=0;n<c;++n)b(s[n],this,e)}return!0},k.prototype.addListener=function(t,e){return E(this,t,e,!1)},k.prototype.on=k.prototype.addListener,k.prototype.prependListener=function(t,e){return E(this,t,e,!0)},k.prototype.once=function(t,e){return G(e),this.on(t,S(this,t,e)),this},k.prototype.prependOnceListener=function(t,e){return G(e),this.prependListener(t,S(this,t,e)),this},k.prototype.removeListener=function(t,e){var n,r,i,o,a;if(G(e),void 0===(r=this._events))return this;if(void 0===(n=r[t]))return this;if(n===e||n.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,n.listener||e));else if("function"!=typeof n){for(i=-1,o=n.length-1;o>=0;o--)if(n[o]===e||n[o].listener===e){a=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(n,i),1===n.length&&(r[t]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",t,a||e)}return this},k.prototype.off=k.prototype.removeListener,k.prototype.removeAllListeners=function(t){var e,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[t]),this;if(0===arguments.length){var i,o=Object.keys(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=n[t]))this.removeListener(t,e);else if(void 0!==e)for(r=e.length-1;r>=0;r--)this.removeListener(t,e[r]);return this},k.prototype.listeners=function(t){return D(this,t,!0)},k.prototype.rawListeners=function(t){return D(this,t,!1)},k.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):L.call(t,e)},k.prototype.listenerCount=L,k.prototype.eventNames=function(){return this._eventsCount>0?y(this._events):[]},"undefined"!=typeof Symbol&&(j.prototype[Symbol.iterator]=function(){return this}),j.of=function(){var t=arguments,e=t.length,n=0;return new j((function(){return n>=e?{done:!0}:{done:!1,value:t[n++]}}))},j.empty=function(){return new j((function(){return{done:!0}}))},j.fromSequence=function(t){var e=0,n=t.length;return new j((function(){return e>=n?{done:!0}:{done:!1,value:t[e++]}}))},j.is=function(t){return t instanceof j||"object"==typeof t&&null!==t&&"function"==typeof t.next};var O=j,C={};C.ARRAY_BUFFER_SUPPORT="undefined"!=typeof ArrayBuffer,C.SYMBOL_SUPPORT="undefined"!=typeof Symbol;var z=O,M=C,W=M.ARRAY_BUFFER_SUPPORT,P=M.SYMBOL_SUPPORT;var R=function(t){var e=function(t){return"string"==typeof t||Array.isArray(t)||W&&ArrayBuffer.isView(t)?z.fromSequence(t):"object"!=typeof t||null===t?null:P&&"function"==typeof t[Symbol.iterator]?t[Symbol.iterator]():"function"==typeof t.next?t:null}(t);if(!e)throw new Error("obliterator: target is not iterable nor a valid iterator.");return e},K=R,T=function(t,e){for(var n,r=arguments.length>1?e:1/0,i=r!==1/0?new Array(r):[],o=0,a=K(t);;){if(o===r)return i;if((n=a.next()).done)return o!==e&&(i.length=o),i;i[o++]=n.value}},B=function(t){function n(e){var n;return(n=t.call(this)||this).name="GraphError",n.message=e,n}return e(n,t),n}(a(Error)),F=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="InvalidArgumentsGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(r),n.prototype.constructor),r}return e(n,t),n}(B),I=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="NotFoundGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(r),n.prototype.constructor),r}return e(n,t),n}(B),Y=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="UsageGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(r),n.prototype.constructor),r}return e(n,t),n}(B);function q(t,e){this.key=t,this.attributes=e,this.clear()}function J(t,e){this.key=t,this.attributes=e,this.clear()}function V(t,e){this.key=t,this.attributes=e,this.clear()}function H(t,e,n,r,i){this.key=e,this.attributes=i,this.undirected=t,this.source=n,this.target=r}q.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.in={},this.out={},this.undirected={}},J.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.in={},this.out={}},V.prototype.clear=function(){this.undirectedDegree=0,this.undirected={}},H.prototype.attach=function(){var t="out",e="in";this.undirected&&(t=e="undirected");var n=this.source.key,r=this.target.key;this.source[t][r]=this,this.undirected&&n===r||(this.target[e][n]=this)},H.prototype.attachMulti=function(){var t="out",e="in",n=this.source.key,r=this.target.key;this.undirected&&(t=e="undirected");var i=this.source[t],o=i[r];if(void 0===o)return i[r]=this,void(this.undirected&&n===r||(this.target[e][n]=this));o.previous=this,this.next=o,i[r]=this,this.target[e][n]=this},H.prototype.detach=function(){var t=this.source.key,e=this.target.key,n="out",r="in";this.undirected&&(n=r="undirected"),delete this.source[n][e],delete this.target[r][t]},H.prototype.detachMulti=function(){var t=this.source.key,e=this.target.key,n="out",r="in";this.undirected&&(n=r="undirected"),void 0===this.previous?void 0===this.next?(delete this.source[n][e],delete this.target[r][t]):(this.next.previous=void 0,this.source[n][e]=this.next,this.target[r][t]=this.next):(this.previous.next=this.next,void 0!==this.next&&(this.next.previous=this.previous))};function Q(t,e,n,r,i,o,a){var u,c,s,d;if(r=""+r,0===n){if(!(u=t._nodes.get(r)))throw new I("Graph.".concat(e,': could not find the "').concat(r,'" node in the graph.'));s=i,d=o}else if(3===n){if(i=""+i,!(c=t._edges.get(i)))throw new I("Graph.".concat(e,': could not find the "').concat(i,'" edge in the graph.'));var h=c.source.key,p=c.target.key;if(r===h)u=c.target;else{if(r!==p)throw new I("Graph.".concat(e,': the "').concat(r,'" node is not attached to the "').concat(i,'" edge (').concat(h,", ").concat(p,")."));u=c.source}s=o,d=a}else{if(!(c=t._edges.get(r)))throw new I("Graph.".concat(e,': could not find the "').concat(r,'" edge in the graph.'));u=1===n?c.source:c.target,s=i,d=o}return[u,s,d]}var X=[{name:function(t){return"get".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];return a.attributes[u]}}},{name:function(t){return"get".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){return Q(this,e,n,t,r)[0].attributes}}},{name:function(t){return"has".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];return a.attributes.hasOwnProperty(u)}}},{name:function(t){return"set".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i,o){var a=Q(this,e,n,t,r,i,o),u=a[0],c=a[1],s=a[2];return u.attributes[c]=s,this.emit("nodeAttributesUpdated",{key:u.key,type:"set",attributes:u.attributes,name:c}),this}}},{name:function(t){return"update".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i,o){var a=Q(this,e,n,t,r,i,o),u=a[0],c=a[1],s=a[2];if("function"!=typeof s)throw new F("Graph.".concat(e,": updater should be a function."));var d=u.attributes,h=s(d[c]);return d[c]=h,this.emit("nodeAttributesUpdated",{key:u.key,type:"set",attributes:u.attributes,name:c}),this}}},{name:function(t){return"remove".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];return delete a.attributes[u],this.emit("nodeAttributesUpdated",{key:a.key,type:"remove",attributes:a.attributes,name:u}),this}}},{name:function(t){return"replace".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];if(!h(u))throw new F("Graph.".concat(e,": provided attributes are not a plain object."));return a.attributes=u,this.emit("nodeAttributesUpdated",{key:a.key,type:"replace",attributes:a.attributes}),this}}},{name:function(t){return"merge".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];if(!h(u))throw new F("Graph.".concat(e,": provided attributes are not a plain object."));return c(a.attributes,u),this.emit("nodeAttributesUpdated",{key:a.key,type:"merge",attributes:a.attributes,data:u}),this}}},{name:function(t){return"update".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];if("function"!=typeof u)throw new F("Graph.".concat(e,": provided updater is not a function."));return a.attributes=u(a.attributes),this.emit("nodeAttributesUpdated",{key:a.key,type:"update",attributes:a.attributes}),this}}}];var Z=[{name:function(t){return"get".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return i.attributes[r]}}},{name:function(t){return"get".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t){var r;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>1){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var i=""+t,o=""+arguments[1];if(!(r=s(this,i,o,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(i,'" - "').concat(o,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(r=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return r.attributes}}},{name:function(t){return"has".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return i.attributes.hasOwnProperty(r)}}},{name:function(t){return"set".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+t,u=""+r;if(r=arguments[2],i=arguments[3],!(o=s(this,a,u,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(a,'" - "').concat(u,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(o=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return o.attributes[r]=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}},{name:function(t){return"update".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+t,u=""+r;if(r=arguments[2],i=arguments[3],!(o=s(this,a,u,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(a,'" - "').concat(u,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(o=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if("function"!=typeof i)throw new F("Graph.".concat(e,": updater should be a function."));return o.attributes[r]=i(o.attributes[r]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}},{name:function(t){return"remove".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return delete i.attributes[r],this.emit("edgeAttributesUpdated",{key:i.key,type:"remove",attributes:i.attributes,name:r}),this}}},{name:function(t){return"replace".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if(!h(r))throw new F("Graph.".concat(e,": provided attributes are not a plain object."));return i.attributes=r,this.emit("edgeAttributesUpdated",{key:i.key,type:"replace",attributes:i.attributes}),this}}},{name:function(t){return"merge".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if(!h(r))throw new F("Graph.".concat(e,": provided attributes are not a plain object."));return c(i.attributes,r),this.emit("edgeAttributesUpdated",{key:i.key,type:"merge",attributes:i.attributes,data:r}),this}}},{name:function(t){return"update".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if("function"!=typeof r)throw new F("Graph.".concat(e,": provided updater is not a function."));return i.attributes=r(i.attributes),this.emit("edgeAttributesUpdated",{key:i.key,type:"update",attributes:i.attributes}),this}}}];var $=O,tt=R,et=function(){var t=arguments,e=null,n=-1;return new $((function(){for(var r=null;;){if(null===e){if(++n>=t.length)return{done:!0};e=tt(t[n])}if(!0!==(r=e.next()).done)break;e=null}return r}))},nt=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function rt(t,e,n,r){var i=!1;for(var o in e)if(o!==r){var a=e[o];if(i=n(a.key,a.attributes,a.source.key,a.target.key,a.source.attributes,a.target.attributes,a.undirected),t&&i)return a.key}}function it(t,e,n,r){var i,o,a,u=!1;for(var c in e)if(c!==r){i=e[c];do{if(o=i.source,a=i.target,u=n(i.key,i.attributes,o.key,a.key,o.attributes,a.attributes,i.undirected),t&&u)return i.key;i=i.next}while(void 0!==i)}}function ot(t,e){var n,r=Object.keys(t),i=r.length,o=0;return new O((function(){do{if(n)n=n.next;else{if(o>=i)return{done:!0};var a=r[o++];if(a===e){n=void 0;continue}n=t[a]}}while(!n);return{done:!1,value:{edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected}}}))}function at(t,e,n,r){var i=e[n];if(i){var o=i.source,a=i.target;return r(i.key,i.attributes,o.key,a.key,o.attributes,a.attributes,i.undirected)&&t?i.key:void 0}}function ut(t,e,n,r){var i=e[n];if(i){var o=!1;do{if(o=r(i.key,i.attributes,i.source.key,i.target.key,i.source.attributes,i.target.attributes,i.undirected),t&&o)return i.key;i=i.next}while(void 0!==i)}}function ct(t,e){var n=t[e];return void 0!==n.next?new O((function(){if(!n)return{done:!0};var t={edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected};return n=n.next,{done:!1,value:t}})):O.of({edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected})}function st(t,e){if(0===t.size)return[];if("mixed"===e||e===t.type)return"function"==typeof Array.from?Array.from(t._edges.keys()):T(t._edges.keys(),t._edges.size);for(var n,r,i="undirected"===e?t.undirectedSize:t.directedSize,o=new Array(i),a="undirected"===e,u=t._edges.values(),c=0;!0!==(n=u.next()).done;)(r=n.value).undirected===a&&(o[c++]=r.key);return o}function dt(t,e,n,r){if(0!==e.size)for(var i,o,a="mixed"!==n&&n!==e.type,u="undirected"===n,c=!1,s=e._edges.values();!0!==(i=s.next()).done;)if(o=i.value,!a||o.undirected===u){var d=o,h=d.key,p=d.attributes,f=d.source,l=d.target;if(c=r(h,p,f.key,l.key,f.attributes,l.attributes,o.undirected),t&&c)return h}}function ht(t,e){if(0===t.size)return O.empty();var n="mixed"!==e&&e!==t.type,r="undirected"===e,i=t._edges.values();return new O((function(){for(var t,e;;){if((t=i.next()).done)return t;if(e=t.value,!n||e.undirected===r)break}return{value:{edge:e.key,attributes:e.attributes,source:e.source.key,target:e.target.key,sourceAttributes:e.source.attributes,targetAttributes:e.target.attributes,undirected:e.undirected},done:!1}}))}function pt(t,e,n,r,i,o){var a,u=e?it:rt;if("undirected"!==n){if("out"!==r&&(a=u(t,i.in,o),t&&a))return a;if("in"!==r&&(a=u(t,i.out,o,r?void 0:i.key),t&&a))return a}if("directed"!==n&&(a=u(t,i.undirected,o),t&&a))return a}function ft(t,e,n,r){var i=[];return pt(!1,t,e,n,r,(function(t){i.push(t)})),i}function lt(t,e,n){var r=O.empty();return"undirected"!==t&&("out"!==e&&void 0!==n.in&&(r=et(r,ot(n.in))),"in"!==e&&void 0!==n.out&&(r=et(r,ot(n.out,e?void 0:n.key)))),"directed"!==t&&void 0!==n.undirected&&(r=et(r,ot(n.undirected))),r}function gt(t,e,n,r,i,o,a){var u,c=n?ut:at;if("undirected"!==e){if(void 0!==i.in&&"out"!==r&&(u=c(t,i.in,o,a),t&&u))return u;if(void 0!==i.out&&"in"!==r&&(r||i.key!==o)&&(u=c(t,i.out,o,a),t&&u))return u}if("directed"!==e&&void 0!==i.undirected&&(u=c(t,i.undirected,o,a),t&&u))return u}function yt(t,e,n,r,i){var o=[];return gt(!1,t,e,n,r,i,(function(t){o.push(t)})),o}function wt(t,e,n,r){var i=O.empty();return"undirected"!==t&&(void 0!==n.in&&"out"!==e&&r in n.in&&(i=et(i,ct(n.in,r))),void 0!==n.out&&"in"!==e&&r in n.out&&(e||n.key!==r)&&(i=et(i,ct(n.out,r)))),"directed"!==t&&void 0!==n.undirected&&r in n.undirected&&(i=et(i,ct(n.undirected,r))),i}var vt=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function bt(){this.A=null,this.B=null}function mt(t,e,n,r,i){for(var o in r){var a=r[o],u=a.source,c=a.target,s=u===n?c:u;if(!e||!e.has(s.key)){var d=i(s.key,s.attributes);if(t&&d)return s.key}}}function kt(t,e,n,r,i){if("mixed"!==e){if("undirected"===e)return mt(t,null,r,r.undirected,i);if("string"==typeof n)return mt(t,null,r,r[n],i)}var o,a=new bt;if("undirected"!==e){if("out"!==n){if(o=mt(t,null,r,r.in,i),t&&o)return o;a.wrap(r.in)}if("in"!==n){if(o=mt(t,a,r,r.out,i),t&&o)return o;a.wrap(r.out)}}if("directed"!==e&&(o=mt(t,a,r,r.undirected,i),t&&o))return o}function _t(t,e,n){var r=Object.keys(n),i=r.length,o=0;return new O((function(){var a=null;do{if(o>=i)return t&&t.wrap(n),{done:!0};var u=n[r[o++]],c=u.source,s=u.target;a=c===e?s:c,t&&t.has(a.key)&&(a=null)}while(null===a);return{done:!1,value:{neighbor:a.key,attributes:a.attributes}}}))}function Gt(t,e){var n=e.name,r=e.type,i=e.direction;t.prototype[n]=function(t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];t=""+t;var e=this._nodes.get(t);if(void 0===e)throw new I("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));return function(t,e,n){if("mixed"!==t){if("undirected"===t)return Object.keys(n.undirected);if("string"==typeof e)return Object.keys(n[e])}var r=[];return kt(!1,t,e,n,(function(t){r.push(t)})),r}("mixed"===r?this.type:r,i,e)}}function xt(t,e){var n=e.name,r=e.type,i=e.direction,o=n.slice(0,-1)+"Entries";t.prototype[o]=function(t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();t=""+t;var e=this._nodes.get(t);if(void 0===e)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return function(t,e,n){if("mixed"!==t){if("undirected"===t)return _t(null,n,n.undirected);if("string"==typeof e)return _t(null,n,n[e])}var r=O.empty(),i=new bt;return"undirected"!==t&&("out"!==e&&(r=et(r,_t(i,n,n.in))),"in"!==e&&(r=et(r,_t(i,n,n.out)))),"directed"!==t&&(r=et(r,_t(i,n,n.undirected))),r}("mixed"===r?this.type:r,i,e)}}function Et(t,e,n,r,i){for(var o,a,u,c,s,d,h,p=r._nodes.values(),f=r.type;!0!==(o=p.next()).done;){var l=!1;if(a=o.value,"undirected"!==f)for(u in c=a.out){s=c[u];do{if(d=s.target,l=!0,h=i(a.key,d.key,a.attributes,d.attributes,s.key,s.attributes,s.undirected),t&&h)return s;s=s.next}while(s)}if("directed"!==f)for(u in c=a.undirected)if(!(e&&a.key>u)){s=c[u];do{if((d=s.target).key!==u&&(d=s.source),l=!0,h=i(a.key,d.key,a.attributes,d.attributes,s.key,s.attributes,s.undirected),t&&h)return s;s=s.next}while(s)}if(n&&!l&&(h=i(a.key,null,a.attributes,null,null,null,null),t&&h))return null}}function At(t){if(!h(t))throw new F('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if(!("key"in t))throw new F("Graph.import: serialized node is missing its key.");if("attributes"in t&&(!h(t.attributes)||null===t.attributes))throw new F("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.")}function St(t){if(!h(t))throw new F('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if(!("source"in t))throw new F("Graph.import: serialized edge is missing its source.");if(!("target"in t))throw new F("Graph.import: serialized edge is missing its target.");if("attributes"in t&&(!h(t.attributes)||null===t.attributes))throw new F("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");if("undirected"in t&&"boolean"!=typeof t.undirected)throw new F("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.")}bt.prototype.wrap=function(t){null===this.A?this.A=t:null===this.B&&(this.B=t)},bt.prototype.has=function(t){return null!==this.A&&t in this.A||null!==this.B&&t in this.B};var Dt,Lt=(Dt=255&Math.floor(256*Math.random()),function(){return Dt++}),Ut=new Set(["directed","undirected","mixed"]),Nt=new Set(["domain","_events","_eventsCount","_maxListeners"]),jt={allowSelfLoops:!0,multi:!1,type:"mixed"};function Ot(t,e,n){var r=new t.NodeDataClass(e,n);return t._nodes.set(e,r),t.emit("nodeAdded",{key:e,attributes:n}),r}function Ct(t,e,n,r,i,o,a,u){if(!r&&"undirected"===t.type)throw new Y("Graph.".concat(e,": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));if(r&&"directed"===t.type)throw new Y("Graph.".concat(e,": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));if(u&&!h(u))throw new F("Graph.".concat(e,': invalid attributes. Expecting an object but got "').concat(u,'"'));if(o=""+o,a=""+a,u=u||{},!t.allowSelfLoops&&o===a)throw new Y("Graph.".concat(e,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var c=t._nodes.get(o),s=t._nodes.get(a);if(!c)throw new I("Graph.".concat(e,': source node "').concat(o,'" not found.'));if(!s)throw new I("Graph.".concat(e,': target node "').concat(a,'" not found.'));var d={key:null,undirected:r,source:o,target:a,attributes:u};if(n)i=t._edgeKeyGenerator();else if(i=""+i,t._edges.has(i))throw new Y("Graph.".concat(e,': the "').concat(i,'" edge already exists in the graph.'));if(!t.multi&&(r?void 0!==c.undirected[a]:void 0!==c.out[a]))throw new Y("Graph.".concat(e,': an edge linking "').concat(o,'" to "').concat(a,"\" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option."));var p=new H(r,i,c,s,u);t._edges.set(i,p);var f=o===a;return r?(c.undirectedDegree++,s.undirectedDegree++,f&&t._undirectedSelfLoopCount++):(c.outDegree++,s.inDegree++,f&&t._directedSelfLoopCount++),t.multi?p.attachMulti():p.attach(),r?t._undirectedSize++:t._directedSize++,d.key=i,t.emit("edgeAdded",d),i}function zt(t,e,n,r,i,o,a,u,s){if(!r&&"undirected"===t.type)throw new Y("Graph.".concat(e,": you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead."));if(r&&"directed"===t.type)throw new Y("Graph.".concat(e,": you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead."));if(u)if(s){if("function"!=typeof u)throw new F("Graph.".concat(e,': invalid updater function. Expecting a function but got "').concat(u,'"'))}else if(!h(u))throw new F("Graph.".concat(e,': invalid attributes. Expecting an object but got "').concat(u,'"'));var d;if(o=""+o,a=""+a,s&&(d=u,u=void 0),!t.allowSelfLoops&&o===a)throw new Y("Graph.".concat(e,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var p,f,l=t._nodes.get(o),g=t._nodes.get(a);if(!n&&(p=t._edges.get(i))){if(!(p.source.key===o&&p.target.key===a||r&&p.source.key===a&&p.target.key===o))throw new Y("Graph.".concat(e,': inconsistency detected when attempting to merge the "').concat(i,'" edge with "').concat(o,'" source & "').concat(a,'" target vs. ("').concat(p.source.key,'", "').concat(p.target.key,'").'));f=p}if(f||t.multi||!l||(f=r?l.undirected[a]:l.out[a]),f){var y=[f.key,!1,!1,!1];if(s?!d:!u)return y;if(s){var w=f.attributes;f.attributes=d(w),t.emit("edgeAttributesUpdated",{type:"replace",key:f.key,attributes:f.attributes})}else c(f.attributes,u),t.emit("edgeAttributesUpdated",{type:"merge",key:f.key,attributes:f.attributes,data:u});return y}u=u||{},s&&d&&(u=d(u));var v={key:null,undirected:r,source:o,target:a,attributes:u};if(n)i=t._edgeKeyGenerator();else if(i=""+i,t._edges.has(i))throw new Y("Graph.".concat(e,': the "').concat(i,'" edge already exists in the graph.'));var b=!1,m=!1;l||(l=Ot(t,o,{}),b=!0,o===a&&(g=l,m=!0)),g||(g=Ot(t,a,{}),m=!0),p=new H(r,i,l,g,u),t._edges.set(i,p);var k=o===a;return r?(l.undirectedDegree++,g.undirectedDegree++,k&&t._undirectedSelfLoopCount++):(l.outDegree++,g.inDegree++,k&&t._directedSelfLoopCount++),t.multi?p.attachMulti():p.attach(),r?t._undirectedSize++:t._directedSize++,v.key=i,t.emit("edgeAdded",v),[i,!0,b,m]}function Mt(t,e){t._edges.delete(e.key);var n=e.source,r=e.target,i=e.attributes,o=e.undirected,a=n===r;o?(n.undirectedDegree--,r.undirectedDegree--,a&&t._undirectedSelfLoopCount--):(n.outDegree--,r.inDegree--,a&&t._directedSelfLoopCount--),t.multi?e.detachMulti():e.detach(),o?t._undirectedSize--:t._directedSize--,t.emit("edgeDropped",{key:e.key,attributes:i,source:n.key,target:r.key,undirected:o})}var Wt=function(n){function r(t){var e;if(e=n.call(this)||this,"boolean"!=typeof(t=c({},jt,t)).multi)throw new F("Graph.constructor: invalid 'multi' option. Expecting a boolean but got \"".concat(t.multi,'".'));if(!Ut.has(t.type))throw new F('Graph.constructor: invalid \'type\' option. Should be one of "mixed", "directed" or "undirected" but got "'.concat(t.type,'".'));if("boolean"!=typeof t.allowSelfLoops)throw new F("Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got \"".concat(t.allowSelfLoops,'".'));var r="mixed"===t.type?q:"directed"===t.type?J:V;f(u(e),"NodeDataClass",r);var i="geid_"+Lt()+"_",o=0;return f(u(e),"_attributes",{}),f(u(e),"_nodes",new Map),f(u(e),"_edges",new Map),f(u(e),"_directedSize",0),f(u(e),"_undirectedSize",0),f(u(e),"_directedSelfLoopCount",0),f(u(e),"_undirectedSelfLoopCount",0),f(u(e),"_edgeKeyGenerator",(function(){var t;do{t=i+o++}while(e._edges.has(t));return t})),f(u(e),"_options",t),Nt.forEach((function(t){return f(u(e),t,e[t])})),l(u(e),"order",(function(){return e._nodes.size})),l(u(e),"size",(function(){return e._edges.size})),l(u(e),"directedSize",(function(){return e._directedSize})),l(u(e),"undirectedSize",(function(){return e._undirectedSize})),l(u(e),"selfLoopCount",(function(){return e._directedSelfLoopCount+e._undirectedSelfLoopCount})),l(u(e),"directedSelfLoopCount",(function(){return e._directedSelfLoopCount})),l(u(e),"undirectedSelfLoopCount",(function(){return e._undirectedSelfLoopCount})),l(u(e),"multi",e._options.multi),l(u(e),"type",e._options.type),l(u(e),"allowSelfLoops",e._options.allowSelfLoops),l(u(e),"implementation",(function(){return"graphology"})),e}e(r,n);var i=r.prototype;return i._resetInstanceCounters=function(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0},i.hasNode=function(t){return this._nodes.has(""+t)},i.hasDirectedEdge=function(t,e){if("undirected"===this.type)return!1;if(1===arguments.length){var n=""+t,r=this._edges.get(n);return!!r&&!r.undirected}if(2===arguments.length){t=""+t,e=""+e;var i=this._nodes.get(t);if(!i)return!1;var o=i.out[e];return!!o&&(!this.multi||!!o.size)}throw new F("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.hasUndirectedEdge=function(t,e){if("directed"===this.type)return!1;if(1===arguments.length){var n=""+t,r=this._edges.get(n);return!!r&&r.undirected}if(2===arguments.length){t=""+t,e=""+e;var i=this._nodes.get(t);if(!i)return!1;var o=i.undirected[e];return!!o&&(!this.multi||!!o.size)}throw new F("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.hasEdge=function(t,e){if(1===arguments.length){var n=""+t;return this._edges.has(n)}if(2===arguments.length){t=""+t,e=""+e;var r=this._nodes.get(t);if(!r)return!1;var i=void 0!==r.out&&r.out[e];return i||(i=void 0!==r.undirected&&r.undirected[e]),!!i&&(!this.multi||!!i.size)}throw new F("Graph.hasEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.directedEdge=function(t,e){if("undirected"!==this.type){if(t=""+t,e=""+e,this.multi)throw new Y("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");var n=this._nodes.get(t);if(!n)throw new I('Graph.directedEdge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I('Graph.directedEdge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.out&&n.out[e]||void 0;return r?r.key:void 0}},i.undirectedEdge=function(t,e){if("directed"!==this.type){if(t=""+t,e=""+e,this.multi)throw new Y("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");var n=this._nodes.get(t);if(!n)throw new I('Graph.undirectedEdge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I('Graph.undirectedEdge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.undirected&&n.undirected[e]||void 0;return r?r.key:void 0}},i.edge=function(t,e){if(this.multi)throw new Y("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.edge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I('Graph.edge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.out&&n.out[e]||n.undirected&&n.undirected[e]||void 0;if(r)return r.key},i.areDirectedNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areDirectedNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&(e in n.in||e in n.out)},i.areOutNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areOutNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.out},i.areInNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areInNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.in},i.areUndirectedNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areUndirectedNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"directed"!==this.type&&e in n.undirected},i.areNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&(e in n.in||e in n.out)||"directed"!==this.type&&e in n.undirected},i.areInboundNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areInboundNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.in||"directed"!==this.type&&e in n.undirected},i.areOutboundNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areOutboundNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.out||"directed"!==this.type&&e in n.undirected},i.inDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.inDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.inDegree},i.outDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.outDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.outDegree},i.directedDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.directedDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.inDegree+e.outDegree},i.undirectedDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.undirectedDegree: could not find the "'.concat(t,'" node in the graph.'));return"directed"===this.type?0:e.undirectedDegree},i.inboundDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.inboundDegree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.inDegree),n},i.outboundDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.outboundDegree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.outDegree),n},i.degree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.degree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.inDegree+e.outDegree),n},i.inDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.inDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));if("undirected"===this.type)return 0;var n=e.in[t],r=n?this.multi?n.size:1:0;return e.inDegree-r},i.outDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.outDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));if("undirected"===this.type)return 0;var n=e.out[t],r=n?this.multi?n.size:1:0;return e.outDegree-r},i.directedDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.directedDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));if("undirected"===this.type)return 0;var n=e.out[t],r=n?this.multi?n.size:1:0;return e.inDegree+e.outDegree-2*r},i.undirectedDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.undirectedDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));if("directed"===this.type)return 0;var n=e.undirected[t],r=n?this.multi?n.size:1:0;return e.undirectedDegree-2*r},i.inboundDegreeWithoutSelfLoops=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new I('Graph.inboundDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var r=0,i=0;return"directed"!==this.type&&(r+=n.undirectedDegree,i+=2*((e=n.undirected[t])?this.multi?e.size:1:0)),"undirected"!==this.type&&(r+=n.inDegree,i+=(e=n.out[t])?this.multi?e.size:1:0),r-i},i.outboundDegreeWithoutSelfLoops=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new I('Graph.outboundDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var r=0,i=0;return"directed"!==this.type&&(r+=n.undirectedDegree,i+=2*((e=n.undirected[t])?this.multi?e.size:1:0)),"undirected"!==this.type&&(r+=n.outDegree,i+=(e=n.in[t])?this.multi?e.size:1:0),r-i},i.degreeWithoutSelfLoops=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new I('Graph.degreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var r=0,i=0;return"directed"!==this.type&&(r+=n.undirectedDegree,i+=2*((e=n.undirected[t])?this.multi?e.size:1:0)),"undirected"!==this.type&&(r+=n.inDegree+n.outDegree,i+=2*((e=n.out[t])?this.multi?e.size:1:0)),r-i},i.source=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.source: could not find the "'.concat(t,'" edge in the graph.'));return e.source.key},i.target=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.target: could not find the "'.concat(t,'" edge in the graph.'));return e.target.key},i.extremities=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.extremities: could not find the "'.concat(t,'" edge in the graph.'));return[e.source.key,e.target.key]},i.opposite=function(t,e){t=""+t,e=""+e;var n=this._edges.get(e);if(!n)throw new I('Graph.opposite: could not find the "'.concat(e,'" edge in the graph.'));var r=n.source.key,i=n.target.key;if(t===r)return i;if(t===i)return r;throw new I('Graph.opposite: the "'.concat(t,'" node is not attached to the "').concat(e,'" edge (').concat(r,", ").concat(i,")."))},i.hasExtremity=function(t,e){t=""+t,e=""+e;var n=this._edges.get(t);if(!n)throw new I('Graph.hasExtremity: could not find the "'.concat(t,'" edge in the graph.'));return n.source.key===e||n.target.key===e},i.isUndirected=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.isUndirected: could not find the "'.concat(t,'" edge in the graph.'));return e.undirected},i.isDirected=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.isDirected: could not find the "'.concat(t,'" edge in the graph.'));return!e.undirected},i.isSelfLoop=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.isSelfLoop: could not find the "'.concat(t,'" edge in the graph.'));return e.source===e.target},i.addNode=function(t,e){var n=function(t,e,n){if(n&&!h(n))throw new F('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(n,'"'));if(e=""+e,n=n||{},t._nodes.has(e))throw new Y('Graph.addNode: the "'.concat(e,'" node already exist in the graph.'));var r=new t.NodeDataClass(e,n);return t._nodes.set(e,r),t.emit("nodeAdded",{key:e,attributes:n}),r}(this,t,e);return n.key},i.mergeNode=function(t,e){if(e&&!h(e))throw new F('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(e,'"'));t=""+t,e=e||{};var n=this._nodes.get(t);return n?(e&&(c(n.attributes,e),this.emit("nodeAttributesUpdated",{type:"merge",key:t,attributes:n.attributes,data:e})),[t,!1]):(n=new this.NodeDataClass(t,e),this._nodes.set(t,n),this.emit("nodeAdded",{key:t,attributes:e}),[t,!0])},i.updateNode=function(t,e){if(e&&"function"!=typeof e)throw new F('Graph.updateNode: invalid updater function. Expecting a function but got "'.concat(e,'"'));t=""+t;var n=this._nodes.get(t);if(n){if(e){var r=n.attributes;n.attributes=e(r),this.emit("nodeAttributesUpdated",{type:"replace",key:t,attributes:n.attributes})}return[t,!1]}var i=e?e({}):{};return n=new this.NodeDataClass(t,i),this._nodes.set(t,n),this.emit("nodeAdded",{key:t,attributes:i}),[t,!0]},i.dropNode=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new I('Graph.dropNode: could not find the "'.concat(t,'" node in the graph.'));if("undirected"!==this.type){for(var r in n.out){e=n.out[r];do{Mt(this,e),e=e.next}while(e)}for(var i in n.in){e=n.in[i];do{Mt(this,e),e=e.next}while(e)}}if("directed"!==this.type)for(var o in n.undirected){e=n.undirected[o];do{Mt(this,e),e=e.next}while(e)}this._nodes.delete(t),this.emit("nodeDropped",{key:t,attributes:n.attributes})},i.dropEdge=function(t){var e;if(arguments.length>1){var n=""+arguments[0],r=""+arguments[1];if(!(e=s(this,n,r,this.type)))throw new I('Graph.dropEdge: could not find the "'.concat(n,'" -> "').concat(r,'" edge in the graph.'))}else if(t=""+t,!(e=this._edges.get(t)))throw new I('Graph.dropEdge: could not find the "'.concat(t,'" edge in the graph.'));return Mt(this,e),this},i.dropDirectedEdge=function(t,e){if(arguments.length<2)throw new Y("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new Y("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");var n=s(this,t=""+t,e=""+e,"directed");if(!n)throw new I('Graph.dropDirectedEdge: could not find a "'.concat(t,'" -> "').concat(e,'" edge in the graph.'));return Mt(this,n),this},i.dropUndirectedEdge=function(t,e){if(arguments.length<2)throw new Y("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new Y("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");var n=s(this,t,e,"undirected");if(!n)throw new I('Graph.dropUndirectedEdge: could not find a "'.concat(t,'" -> "').concat(e,'" edge in the graph.'));return Mt(this,n),this},i.clear=function(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit("cleared")},i.clearEdges=function(){for(var t,e=this._nodes.values();!0!==(t=e.next()).done;)t.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit("edgesCleared")},i.getAttribute=function(t){return this._attributes[t]},i.getAttributes=function(){return this._attributes},i.hasAttribute=function(t){return this._attributes.hasOwnProperty(t)},i.setAttribute=function(t,e){return this._attributes[t]=e,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:t}),this},i.updateAttribute=function(t,e){if("function"!=typeof e)throw new F("Graph.updateAttribute: updater should be a function.");var n=this._attributes[t];return this._attributes[t]=e(n),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:t}),this},i.removeAttribute=function(t){return delete this._attributes[t],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:t}),this},i.replaceAttributes=function(t){if(!h(t))throw new F("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=t,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this},i.mergeAttributes=function(t){if(!h(t))throw new F("Graph.mergeAttributes: provided attributes are not a plain object.");return c(this._attributes,t),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:t}),this},i.updateAttributes=function(t){if("function"!=typeof t)throw new F("Graph.updateAttributes: provided updater is not a function.");return this._attributes=t(this._attributes),this.emit("attributesUpdated",{type:"update",attributes:this._attributes}),this},i.updateEachNodeAttributes=function(t,e){if("function"!=typeof t)throw new F("Graph.updateEachNodeAttributes: expecting an updater function.");if(e&&!g(e))throw new F("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i=this._nodes.values();!0!==(n=i.next()).done;)(r=n.value).attributes=t(r.key,r.attributes);this.emit("eachNodeAttributesUpdated",{hints:e||null})},i.updateEachEdgeAttributes=function(t,e){if("function"!=typeof t)throw new F("Graph.updateEachEdgeAttributes: expecting an updater function.");if(e&&!g(e))throw new F("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i,o,a=this._edges.values();!0!==(n=a.next()).done;)i=(r=n.value).source,o=r.target,r.attributes=t(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected);this.emit("eachEdgeAttributesUpdated",{hints:e||null})},i.forEachAdjacencyEntry=function(t){if("function"!=typeof t)throw new F("Graph.forEachAdjacencyEntry: expecting a callback.");Et(!1,!1,!1,this,t)},i.forEachAdjacencyEntryWithOrphans=function(t){if("function"!=typeof t)throw new F("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");Et(!1,!1,!0,this,t)},i.forEachAssymetricAdjacencyEntry=function(t){if("function"!=typeof t)throw new F("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");Et(!1,!0,!1,this,t)},i.forEachAssymetricAdjacencyEntryWithOrphans=function(t){if("function"!=typeof t)throw new F("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");Et(!1,!0,!0,this,t)},i.nodes=function(){return"function"==typeof Array.from?Array.from(this._nodes.keys()):T(this._nodes.keys(),this._nodes.size)},i.forEachNode=function(t){if("function"!=typeof t)throw new F("Graph.forEachNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)t((n=e.value).key,n.attributes)},i.findNode=function(t){if("function"!=typeof t)throw new F("Graph.findNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(t((n=e.value).key,n.attributes))return n.key},i.mapNodes=function(t){if("function"!=typeof t)throw new F("Graph.mapNode: expecting a callback.");for(var e,n,r=this._nodes.values(),i=new Array(this.order),o=0;!0!==(e=r.next()).done;)n=e.value,i[o++]=t(n.key,n.attributes);return i},i.someNode=function(t){if("function"!=typeof t)throw new F("Graph.someNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(t((n=e.value).key,n.attributes))return!0;return!1},i.everyNode=function(t){if("function"!=typeof t)throw new F("Graph.everyNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(!t((n=e.value).key,n.attributes))return!1;return!0},i.filterNodes=function(t){if("function"!=typeof t)throw new F("Graph.filterNodes: expecting a callback.");for(var e,n,r=this._nodes.values(),i=[];!0!==(e=r.next()).done;)t((n=e.value).key,n.attributes)&&i.push(n.key);return i},i.reduceNodes=function(t,e){if("function"!=typeof t)throw new F("Graph.reduceNodes: expecting a callback.");if(arguments.length<2)throw new F("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");for(var n,r,i=e,o=this._nodes.values();!0!==(n=o.next()).done;)i=t(i,(r=n.value).key,r.attributes);return i},i.nodeEntries=function(){var t=this._nodes.values();return new O((function(){var e=t.next();if(e.done)return e;var n=e.value;return{value:{node:n.key,attributes:n.attributes},done:!1}}))},i.export=function(){var t=new Array(this._nodes.size),e=0;this._nodes.forEach((function(n,r){t[e++]=function(t,e){var n={key:t};return p(e.attributes)||(n.attributes=c({},e.attributes)),n}(r,n)}));var n=new Array(this._edges.size);return e=0,this._edges.forEach((function(t,r){n[e++]=function(t,e){var n={key:t,source:e.source.key,target:e.target.key};return p(e.attributes)||(n.attributes=c({},e.attributes)),e.undirected&&(n.undirected=!0),n}(r,t)})),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:t,edges:n}},i.import=function(t){var e,n,r,i,o,a=this,u=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(d(t))return t.forEachNode((function(t,e){u?a.mergeNode(t,e):a.addNode(t,e)})),t.forEachEdge((function(t,e,n,r,i,o,c){u?c?a.mergeUndirectedEdgeWithKey(t,n,r,e):a.mergeDirectedEdgeWithKey(t,n,r,e):c?a.addUndirectedEdgeWithKey(t,n,r,e):a.addDirectedEdgeWithKey(t,n,r,e)})),this;if(!h(t))throw new F("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(t.attributes){if(!h(t.attributes))throw new F("Graph.import: invalid attributes. Expecting a plain object.");u?this.mergeAttributes(t.attributes):this.replaceAttributes(t.attributes)}if(t.nodes){if(r=t.nodes,!Array.isArray(r))throw new F("Graph.import: invalid nodes. Expecting an array.");for(e=0,n=r.length;e<n;e++){At(i=r[e]);var c=i,s=c.key,p=c.attributes;u?this.mergeNode(s,p):this.addNode(s,p)}}if(t.edges){if(r=t.edges,!Array.isArray(r))throw new F("Graph.import: invalid edges. Expecting an array.");for(e=0,n=r.length;e<n;e++){St(o=r[e]);var f=o,l=f.source,g=f.target,y=f.attributes,w=f.undirected,v=void 0!==w&&w;"key"in o?(u?v?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:v?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey).call(this,o.key,l,g,y):(u?v?this.mergeUndirectedEdge:this.mergeDirectedEdge:v?this.addUndirectedEdge:this.addDirectedEdge).call(this,l,g,y)}}return this},i.nullCopy=function(t){var e=new r(c({},this._options,t));return e.replaceAttributes(c({},this.getAttributes())),e},i.emptyCopy=function(t){var e=this.nullCopy(t);return this._nodes.forEach((function(t,n){var r=c({},t.attributes);t=new e.NodeDataClass(n,r),e._nodes.set(n,t)})),e},i.copy=function(t){if("string"==typeof(t=t||{}).type&&t.type!==this.type&&"mixed"!==t.type)throw new Y('Graph.copy: cannot create an incompatible copy from "'.concat(this.type,'" type to "').concat(t.type,'" because this would mean losing information about the current graph.'));if("boolean"==typeof t.multi&&t.multi!==this.multi&&!0!==t.multi)throw new Y("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");if("boolean"==typeof t.allowSelfLoops&&t.allowSelfLoops!==this.allowSelfLoops&&!0!==t.allowSelfLoops)throw new Y("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");for(var e,n,r=this.emptyCopy(t),i=this._edges.values();!0!==(e=i.next()).done;)Ct(r,"copy",!1,(n=e.value).undirected,n.key,n.source.key,n.target.key,c({},n.attributes));return r},i.toJSON=function(){return this.export()},i.toString=function(){return"[object Graph]"},i.inspect=function(){var e=this,n={};this._nodes.forEach((function(t,e){n[e]=t.attributes}));var r={},i={};this._edges.forEach((function(t,n){var o,a=t.undirected?"--":"->",u="",c=t.source.key,s=t.target.key;t.undirected&&c>s&&(o=c,c=s,s=o);var d="(".concat(c,")").concat(a,"(").concat(s,")");n.startsWith("geid_")?e.multi&&(void 0===i[d]?i[d]=0:i[d]++,u+="".concat(i[d],". ")):u+="[".concat(n,"]: "),r[u+=d]=t.attributes}));var o={};for(var a in this)this.hasOwnProperty(a)&&!Nt.has(a)&&"function"!=typeof this[a]&&"symbol"!==t(a)&&(o[a]=this[a]);return o.attributes=this._attributes,o.nodes=n,o.edges=r,f(o,"constructor",this.constructor),o},r}(w.exports.EventEmitter);"undefined"!=typeof Symbol&&(Wt.prototype[Symbol.for("nodejs.util.inspect.custom")]=Wt.prototype.inspect),[{name:function(t){return"".concat(t,"Edge")},generateKey:!0},{name:function(t){return"".concat(t,"DirectedEdge")},generateKey:!0,type:"directed"},{name:function(t){return"".concat(t,"UndirectedEdge")},generateKey:!0,type:"undirected"},{name:function(t){return"".concat(t,"EdgeWithKey")}},{name:function(t){return"".concat(t,"DirectedEdgeWithKey")},type:"directed"},{name:function(t){return"".concat(t,"UndirectedEdgeWithKey")},type:"undirected"}].forEach((function(t){["add","merge","update"].forEach((function(e){var n=t.name(e),r="add"===e?Ct:zt;t.generateKey?Wt.prototype[n]=function(i,o,a){return r(this,n,!0,"undirected"===(t.type||this.type),null,i,o,a,"update"===e)}:Wt.prototype[n]=function(i,o,a,u){return r(this,n,!1,"undirected"===(t.type||this.type),i,o,a,u,"update"===e)}}))})),function(t){X.forEach((function(e){var n=e.name,r=e.attacher;r(t,n("Node"),0),r(t,n("Source"),1),r(t,n("Target"),2),r(t,n("Opposite"),3)}))}(Wt),function(t){Z.forEach((function(e){var n=e.name,r=e.attacher;r(t,n("Edge"),"mixed"),r(t,n("DirectedEdge"),"directed"),r(t,n("UndirectedEdge"),"undirected")}))}(Wt),function(t){nt.forEach((function(e){!function(t,e){var n=e.name,r=e.type,i=e.direction;t.prototype[n]=function(t,e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];if(!arguments.length)return st(this,r);if(1===arguments.length){t=""+t;var o=this._nodes.get(t);if(void 0===o)throw new I("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));return ft(this.multi,"mixed"===r?this.type:r,i,o)}if(2===arguments.length){t=""+t,e=""+e;var a=this._nodes.get(t);if(!a)throw new I("Graph.".concat(n,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I("Graph.".concat(n,':  could not find the "').concat(e,'" target node in the graph.'));return yt(r,this.multi,i,a,e)}throw new F("Graph.".concat(n,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e,n){if("mixed"===r||"mixed"===this.type||r===this.type){if(1===arguments.length)return dt(!1,this,r,n=t);if(2===arguments.length){t=""+t,n=e;var a=this._nodes.get(t);if(void 0===a)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return pt(!1,this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){t=""+t,e=""+e;var u=this._nodes.get(t);if(!u)throw new I("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return gt(!1,r,this.multi,i,u,e,n)}throw new F("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))}};var a="map"+n[0].toUpperCase()+n.slice(1);t.prototype[a]=function(){var t,e=Array.prototype.slice.call(arguments),n=e.pop();if(0===e.length){var i=0;"directed"!==r&&(i+=this.undirectedSize),"undirected"!==r&&(i+=this.directedSize),t=new Array(i);var a=0;e.push((function(e,r,i,o,u,c,s){t[a++]=n(e,r,i,o,u,c,s)}))}else t=[],e.push((function(e,r,i,o,a,u,c){t.push(n(e,r,i,o,a,u,c))}));return this[o].apply(this,e),t};var u="filter"+n[0].toUpperCase()+n.slice(1);t.prototype[u]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop(),n=[];return t.push((function(t,r,i,o,a,u,c){e(t,r,i,o,a,u,c)&&n.push(t)})),this[o].apply(this,t),n};var c="reduce"+n[0].toUpperCase()+n.slice(1);t.prototype[c]=function(){var t,e,n=Array.prototype.slice.call(arguments);if(n.length<2||n.length>4)throw new F("Graph.".concat(c,": invalid number of arguments (expecting 2, 3 or 4 and got ").concat(n.length,")."));if("function"==typeof n[n.length-1]&&"function"!=typeof n[n.length-2])throw new F("Graph.".concat(c,": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));2===n.length?(t=n[0],e=n[1],n=[]):3===n.length?(t=n[1],e=n[2],n=[n[0]]):4===n.length&&(t=n[2],e=n[3],n=[n[0],n[1]]);var r=e;return n.push((function(e,n,i,o,a,u,c){r=t(r,e,n,i,o,a,u,c)})),this[o].apply(this,n),r}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="find"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e,n){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return!1;if(1===arguments.length)return dt(!0,this,r,n=t);if(2===arguments.length){t=""+t,n=e;var a=this._nodes.get(t);if(void 0===a)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return pt(!0,this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){t=""+t,e=""+e;var u=this._nodes.get(t);if(!u)throw new I("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return gt(!0,r,this.multi,i,u,e,n)}throw new F("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))};var a="some"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[a]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop();return t.push((function(t,n,r,i,o,a,u){return e(t,n,r,i,o,a,u)})),!!this[o].apply(this,t)};var u="every"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[u]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop();return t.push((function(t,n,r,i,o,a,u){return!e(t,n,r,i,o,a,u)})),!this[o].apply(this,t)}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o=n.slice(0,-1)+"Entries";t.prototype[o]=function(t,e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();if(!arguments.length)return ht(this,r);if(1===arguments.length){t=""+t;var n=this._nodes.get(t);if(!n)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return lt(r,i,n)}if(2===arguments.length){t=""+t,e=""+e;var a=this._nodes.get(t);if(!a)throw new I("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return wt(r,i,a,e)}throw new F("Graph.".concat(o,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(t,e)}))}(Wt),function(t){vt.forEach((function(e){Gt(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e){if("mixed"===r||"mixed"===this.type||r===this.type){t=""+t;var n=this._nodes.get(t);if(void 0===n)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));kt(!1,"mixed"===r?this.type:r,i,n,e)}};var a="map"+n[0].toUpperCase()+n.slice(1);t.prototype[a]=function(t,e){var n=[];return this[o](t,(function(t,r){n.push(e(t,r))})),n};var u="filter"+n[0].toUpperCase()+n.slice(1);t.prototype[u]=function(t,e){var n=[];return this[o](t,(function(t,r){e(t,r)&&n.push(t)})),n};var c="reduce"+n[0].toUpperCase()+n.slice(1);t.prototype[c]=function(t,e,n){if(arguments.length<3)throw new F("Graph.".concat(c,": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));var r=n;return this[o](t,(function(t,n){r=e(r,t,n)})),r}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o=n[0].toUpperCase()+n.slice(1,-1),a="find"+o;t.prototype[a]=function(t,e){if("mixed"===r||"mixed"===this.type||r===this.type){t=""+t;var n=this._nodes.get(t);if(void 0===n)throw new I("Graph.".concat(a,': could not find the "').concat(t,'" node in the graph.'));return kt(!0,"mixed"===r?this.type:r,i,n,e)}};var u="some"+o;t.prototype[u]=function(t,e){return!!this[a](t,e)};var c="every"+o;t.prototype[c]=function(t,e){return!this[a](t,(function(t,n){return!e(t,n)}))}}(t,e),xt(t,e)}))}(Wt);var Pt=function(t){function n(e){var n=c({type:"directed"},e);if("multi"in n&&!1!==n.multi)throw new F("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("directed"!==n.type)throw new F('DirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(Wt),Rt=function(t){function n(e){var n=c({type:"undirected"},e);if("multi"in n&&!1!==n.multi)throw new F("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("undirected"!==n.type)throw new F('UndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(Wt),Kt=function(t){function n(e){var n=c({multi:!0},e);if("multi"in n&&!0!==n.multi)throw new F("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");return t.call(this,n)||this}return e(n,t),n}(Wt),Tt=function(t){function n(e){var n=c({type:"directed",multi:!0},e);if("multi"in n&&!0!==n.multi)throw new F("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("directed"!==n.type)throw new F('MultiDirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(Wt),Bt=function(t){function n(e){var n=c({type:"undirected",multi:!0},e);if("multi"in n&&!0!==n.multi)throw new F("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("undirected"!==n.type)throw new F('MultiUndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(Wt);function Ft(t){t.from=function(e,n){var r=c({},e.options,n),i=new t(r);return i.import(e),i}}return Ft(Wt),Ft(Pt),Ft(Rt),Ft(Kt),Ft(Tt),Ft(Bt),Wt.Graph=Wt,Wt.DirectedGraph=Pt,Wt.UndirectedGraph=Rt,Wt.MultiGraph=Kt,Wt.MultiDirectedGraph=Tt,Wt.MultiUndirectedGraph=Bt,Wt.InvalidArgumentsGraphError=F,Wt.NotFoundGraphError=I,Wt.UsageGraphError=Y,Wt}));
//# sourceMappingURL=graphology.umd.min.js.map


/***/ }),

/***/ "./node_modules/pandemonium/random.js":
/*!********************************************!*\
  !*** ./node_modules/pandemonium/random.js ***!
  \********************************************/
/***/ ((module) => {

/**
 * Pandemonium Random
 * ===================
 *
 * Random function.
 */

/**
 * Creating a function returning a random integer such as a <= N <= b.
 *
 * @param  {function} rng - RNG function returning uniform random.
 * @return {function}     - The created function.
 */
function createRandom(rng) {

  /**
   * Random function.
   *
   * @param  {number} a - From.
   * @param  {number} b - To.
   * @return {number}
   */
  return function(a, b) {
    return a + Math.floor(rng() * (b - a + 1));
  };
}

/**
 * Default random using `Math.random`.
 */
var random = createRandom(Math.random);

/**
 * Exporting.
 */
random.createRandom = createRandom;
module.exports = random;


/***/ }),

/***/ "./node_modules/pandemonium/shuffle-in-place.js":
/*!******************************************************!*\
  !*** ./node_modules/pandemonium/shuffle-in-place.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Pandemonium Shuffle In Place
 * =============================
 *
 * Shuffle function applying the Fisher-Yates algorithm to the provided array.
 */
var createRandom = (__webpack_require__(/*! ./random.js */ "./node_modules/pandemonium/random.js").createRandom);

/**
 * Creating a function returning the given array shuffled.
 *
 * @param  {function} rng - The RNG to use.
 * @return {function}     - The created function.
 */
function createShuffleInPlace(rng) {
  var customRandom = createRandom(rng);

  /**
   * Function returning the shuffled array.
   *
   * @param  {array}  sequence - Target sequence.
   * @return {array}           - The shuffled sequence.
   */
  return function(sequence) {
    var length = sequence.length,
        lastIndex = length - 1;

    var index = -1;

    while (++index < length) {
      var r = customRandom(index, lastIndex),
          value = sequence[r];

      sequence[r] = sequence[index];
      sequence[index] = value;
    }
  };
}

/**
 * Default shuffle in place using `Math.random`.
 */
var shuffleInPlace = createShuffleInPlace(Math.random);

/**
 * Exporting.
 */
shuffleInPlace.createShuffleInPlace = createShuffleInPlace;
module.exports = shuffleInPlace;


/***/ }),

/***/ "./node_modules/sigma/core/camera.js":
/*!*******************************************!*\
  !*** ./node_modules/sigma/core/camera.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 * @module
 */
var animate_1 = __webpack_require__(/*! ../utils/animate */ "./node_modules/sigma/utils/animate.js");
var easings_1 = __importDefault(__webpack_require__(/*! ../utils/easings */ "./node_modules/sigma/utils/easings.js"));
var utils_1 = __webpack_require__(/*! ../utils */ "./node_modules/sigma/utils/index.js");
var types_1 = __webpack_require__(/*! ../types */ "./node_modules/sigma/types.js");
/**
 * Defaults.
 */
var DEFAULT_ZOOMING_RATIO = 1.5;
/**
 * Camera class
 *
 * @constructor
 */
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this) || this;
        _this.x = 0.5;
        _this.y = 0.5;
        _this.angle = 0;
        _this.ratio = 1;
        _this.minRatio = null;
        _this.maxRatio = null;
        _this.nextFrame = null;
        _this.previousState = null;
        _this.enabled = true;
        // State
        _this.previousState = _this.getState();
        return _this;
    }
    /**
     * Static method used to create a Camera object with a given state.
     *
     * @param state
     * @return {Camera}
     */
    Camera.from = function (state) {
        var camera = new Camera();
        return camera.setState(state);
    };
    /**
     * Method used to enable the camera.
     *
     * @return {Camera}
     */
    Camera.prototype.enable = function () {
        this.enabled = true;
        return this;
    };
    /**
     * Method used to disable the camera.
     *
     * @return {Camera}
     */
    Camera.prototype.disable = function () {
        this.enabled = false;
        return this;
    };
    /**
     * Method used to retrieve the camera's current state.
     *
     * @return {object}
     */
    Camera.prototype.getState = function () {
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            ratio: this.ratio,
        };
    };
    /**
     * Method used to check whether the camera has the given state.
     *
     * @return {object}
     */
    Camera.prototype.hasState = function (state) {
        return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
    };
    /**
     * Method used to retrieve the camera's previous state.
     *
     * @return {object}
     */
    Camera.prototype.getPreviousState = function () {
        var state = this.previousState;
        if (!state)
            return null;
        return {
            x: state.x,
            y: state.y,
            angle: state.angle,
            ratio: state.ratio,
        };
    };
    /**
     * Method used to check minRatio and maxRatio values.
     *
     * @param ratio
     * @return {number}
     */
    Camera.prototype.getBoundedRatio = function (ratio) {
        var r = ratio;
        if (typeof this.minRatio === "number")
            r = Math.max(r, this.minRatio);
        if (typeof this.maxRatio === "number")
            r = Math.min(r, this.maxRatio);
        return r;
    };
    /**
     * Method used to check various things to return a legit state candidate.
     *
     * @param state
     * @return {object}
     */
    Camera.prototype.validateState = function (state) {
        var validatedState = {};
        if (typeof state.x === "number")
            validatedState.x = state.x;
        if (typeof state.y === "number")
            validatedState.y = state.y;
        if (typeof state.angle === "number")
            validatedState.angle = state.angle;
        if (typeof state.ratio === "number")
            validatedState.ratio = this.getBoundedRatio(state.ratio);
        return validatedState;
    };
    /**
     * Method used to check whether the camera is currently being animated.
     *
     * @return {boolean}
     */
    Camera.prototype.isAnimated = function () {
        return !!this.nextFrame;
    };
    /**
     * Method used to set the camera's state.
     *
     * @param  {object} state - New state.
     * @return {Camera}
     */
    Camera.prototype.setState = function (state) {
        if (!this.enabled)
            return this;
        // TODO: update by function
        // Keeping track of last state
        this.previousState = this.getState();
        var validState = this.validateState(state);
        if (typeof validState.x === "number")
            this.x = validState.x;
        if (typeof validState.y === "number")
            this.y = validState.y;
        if (typeof validState.angle === "number")
            this.angle = validState.angle;
        if (typeof validState.ratio === "number")
            this.ratio = validState.ratio;
        // Emitting
        if (!this.hasState(this.previousState))
            this.emit("updated", this.getState());
        return this;
    };
    /**
     * Method used to animate the camera.
     *
     * @param  {object}                    state      - State to reach eventually.
     * @param  {object}                    opts       - Options:
     * @param  {number}                      duration - Duration of the animation.
     * @param  {string | number => number}   easing   - Easing function or name of an existing one
     * @param  {function}                  callback   - Callback
     */
    Camera.prototype.animate = function (state, opts, callback) {
        var _this = this;
        if (!this.enabled)
            return;
        var options = Object.assign({}, animate_1.ANIMATE_DEFAULTS, opts);
        var validState = this.validateState(state);
        var easing = typeof options.easing === "function" ? options.easing : easings_1.default[options.easing];
        // State
        var start = Date.now(), initialState = this.getState();
        // Function performing the animation
        var fn = function () {
            var t = (Date.now() - start) / options.duration;
            // The animation is over:
            if (t >= 1) {
                _this.nextFrame = null;
                _this.setState(validState);
                if (_this.animationCallback) {
                    _this.animationCallback.call(null);
                    _this.animationCallback = undefined;
                }
                return;
            }
            var coefficient = easing(t);
            var newState = {};
            if (typeof validState.x === "number")
                newState.x = initialState.x + (validState.x - initialState.x) * coefficient;
            if (typeof validState.y === "number")
                newState.y = initialState.y + (validState.y - initialState.y) * coefficient;
            if (typeof validState.angle === "number")
                newState.angle = initialState.angle + (validState.angle - initialState.angle) * coefficient;
            if (typeof validState.ratio === "number")
                newState.ratio = initialState.ratio + (validState.ratio - initialState.ratio) * coefficient;
            _this.setState(newState);
            _this.nextFrame = (0, utils_1.requestFrame)(fn);
        };
        if (this.nextFrame) {
            (0, utils_1.cancelFrame)(this.nextFrame);
            if (this.animationCallback)
                this.animationCallback.call(null);
            this.nextFrame = (0, utils_1.requestFrame)(fn);
        }
        else {
            fn();
        }
        this.animationCallback = callback;
    };
    /**
     * Method used to zoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     * @return {function}
     */
    Camera.prototype.animatedZoom = function (factorOrOptions) {
        if (!factorOrOptions) {
            this.animate({ ratio: this.ratio / DEFAULT_ZOOMING_RATIO });
        }
        else {
            if (typeof factorOrOptions === "number")
                return this.animate({ ratio: this.ratio / factorOrOptions });
            else
                this.animate({
                    ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
                }, factorOrOptions);
        }
    };
    /**
     * Method used to unzoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     */
    Camera.prototype.animatedUnzoom = function (factorOrOptions) {
        if (!factorOrOptions) {
            this.animate({ ratio: this.ratio * DEFAULT_ZOOMING_RATIO });
        }
        else {
            if (typeof factorOrOptions === "number")
                return this.animate({ ratio: this.ratio * factorOrOptions });
            else
                this.animate({
                    ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
                }, factorOrOptions);
        }
    };
    /**
     * Method used to reset the camera.
     *
     * @param  {object} options - Options.
     */
    Camera.prototype.animatedReset = function (options) {
        this.animate({
            x: 0.5,
            y: 0.5,
            ratio: 1,
            angle: 0,
        }, options);
    };
    /**
     * Returns a new Camera instance, with the same state as the current camera.
     *
     * @return {Camera}
     */
    Camera.prototype.copy = function () {
        return Camera.from(this.getState());
    };
    return Camera;
}(types_1.TypedEventEmitter));
exports["default"] = Camera;


/***/ }),

/***/ "./node_modules/sigma/core/captors/captor.js":
/*!***************************************************!*\
  !*** ./node_modules/sigma/core/captors/captor.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWheelDelta = exports.getTouchCoords = exports.getTouchesArray = exports.getWheelCoords = exports.getMouseCoords = exports.getPosition = void 0;
/**
 * Sigma.js Captor Class
 * ======================
 * @module
 */
var types_1 = __webpack_require__(/*! ../../types */ "./node_modules/sigma/types.js");
/**
 * Captor utils functions
 * ======================
 */
/**
 * Extract the local X and Y coordinates from a mouse event or touch object. If
 * a DOM element is given, it uses this element's offset to compute the position
 * (this allows using events that are not bound to the container itself and
 * still have a proper position).
 *
 * @param  {event}       e - A mouse event or touch object.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {number}      The local Y value of the mouse.
 */
function getPosition(e, dom) {
    var bbox = dom.getBoundingClientRect();
    return {
        x: e.clientX - bbox.left,
        y: e.clientY - bbox.top,
    };
}
exports.getPosition = getPosition;
/**
 * Convert mouse coords to sigma coords.
 *
 * @param  {event}       e   - A mouse event or touch object.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getMouseCoords(e, dom) {
    var res = __assign(__assign({}, getPosition(e, dom)), { sigmaDefaultPrevented: false, preventSigmaDefault: function () {
            res.sigmaDefaultPrevented = true;
        }, original: e });
    return res;
}
exports.getMouseCoords = getMouseCoords;
/**
 * Convert mouse wheel event coords to sigma coords.
 *
 * @param  {event}       e   - A wheel mouse event.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getWheelCoords(e, dom) {
    return __assign(__assign({}, getMouseCoords(e, dom)), { delta: getWheelDelta(e) });
}
exports.getWheelCoords = getWheelCoords;
var MAX_TOUCHES = 2;
function getTouchesArray(touches) {
    var arr = [];
    for (var i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++)
        arr.push(touches[i]);
    return arr;
}
exports.getTouchesArray = getTouchesArray;
/**
 * Convert touch coords to sigma coords.
 *
 * @param  {event}       e   - A touch event.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getTouchCoords(e, dom) {
    return {
        touches: getTouchesArray(e.touches).map(function (touch) { return getPosition(touch, dom); }),
        original: e,
    };
}
exports.getTouchCoords = getTouchCoords;
/**
 * Extract the wheel delta from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The wheel delta of the mouse.
 */
function getWheelDelta(e) {
    // TODO: check those ratios again to ensure a clean Chrome/Firefox compat
    if (typeof e.deltaY !== "undefined")
        return (e.deltaY * -3) / 360;
    if (typeof e.detail !== "undefined")
        return e.detail / -9;
    throw new Error("Captor: could not extract delta from event.");
}
exports.getWheelDelta = getWheelDelta;
/**
 * Abstract class representing a captor like the user's mouse or touch controls.
 */
var Captor = /** @class */ (function (_super) {
    __extends(Captor, _super);
    function Captor(container, renderer) {
        var _this = _super.call(this) || this;
        // Properties
        _this.container = container;
        _this.renderer = renderer;
        return _this;
    }
    return Captor;
}(types_1.TypedEventEmitter));
exports["default"] = Captor;


/***/ }),

/***/ "./node_modules/sigma/core/captors/mouse.js":
/*!**************************************************!*\
  !*** ./node_modules/sigma/core/captors/mouse.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var captor_1 = __importStar(__webpack_require__(/*! ./captor */ "./node_modules/sigma/core/captors/captor.js"));
/**
 * Constants.
 */
var DRAG_TIMEOUT = 100;
var DRAGGED_EVENTS_TOLERANCE = 3;
var MOUSE_INERTIA_DURATION = 200;
var MOUSE_INERTIA_RATIO = 3;
var MOUSE_ZOOM_DURATION = 250;
var ZOOMING_RATIO = 1.7;
var DOUBLE_CLICK_TIMEOUT = 300;
var DOUBLE_CLICK_ZOOMING_RATIO = 2.2;
var DOUBLE_CLICK_ZOOMING_DURATION = 200;
/**
 * Mouse captor class.
 *
 * @constructor
 */
var MouseCaptor = /** @class */ (function (_super) {
    __extends(MouseCaptor, _super);
    function MouseCaptor(container, renderer) {
        var _this = _super.call(this, container, renderer) || this;
        // State
        _this.enabled = true;
        _this.draggedEvents = 0;
        _this.downStartTime = null;
        _this.lastMouseX = null;
        _this.lastMouseY = null;
        _this.isMouseDown = false;
        _this.isMoving = false;
        _this.movingTimeout = null;
        _this.startCameraState = null;
        _this.clicks = 0;
        _this.doubleClickTimeout = null;
        _this.currentWheelDirection = 0;
        // Binding methods
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleRightClick = _this.handleRightClick.bind(_this);
        _this.handleDown = _this.handleDown.bind(_this);
        _this.handleUp = _this.handleUp.bind(_this);
        _this.handleMove = _this.handleMove.bind(_this);
        _this.handleWheel = _this.handleWheel.bind(_this);
        _this.handleOut = _this.handleOut.bind(_this);
        // Binding events
        container.addEventListener("click", _this.handleClick, false);
        container.addEventListener("contextmenu", _this.handleRightClick, false);
        container.addEventListener("mousedown", _this.handleDown, false);
        container.addEventListener("wheel", _this.handleWheel, false);
        container.addEventListener("mouseout", _this.handleOut, false);
        document.addEventListener("mousemove", _this.handleMove, false);
        document.addEventListener("mouseup", _this.handleUp, false);
        return _this;
    }
    MouseCaptor.prototype.kill = function () {
        var container = this.container;
        container.removeEventListener("click", this.handleClick);
        container.removeEventListener("contextmenu", this.handleRightClick);
        container.removeEventListener("mousedown", this.handleDown);
        container.removeEventListener("wheel", this.handleWheel);
        container.removeEventListener("mouseout", this.handleOut);
        document.removeEventListener("mousemove", this.handleMove);
        document.removeEventListener("mouseup", this.handleUp);
    };
    MouseCaptor.prototype.handleClick = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        this.clicks++;
        if (this.clicks === 2) {
            this.clicks = 0;
            if (typeof this.doubleClickTimeout === "number") {
                clearTimeout(this.doubleClickTimeout);
                this.doubleClickTimeout = null;
            }
            return this.handleDoubleClick(e);
        }
        setTimeout(function () {
            _this.clicks = 0;
            _this.doubleClickTimeout = null;
        }, DOUBLE_CLICK_TIMEOUT);
        // NOTE: this is here to prevent click events on drag
        if (this.draggedEvents < DRAGGED_EVENTS_TOLERANCE)
            this.emit("click", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleRightClick = function (e) {
        if (!this.enabled)
            return;
        this.emit("rightClick", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleDoubleClick = function (e) {
        if (!this.enabled)
            return;
        e.preventDefault();
        e.stopPropagation();
        var mouseCoords = (0, captor_1.getMouseCoords)(e, this.container);
        this.emit("doubleClick", mouseCoords);
        if (mouseCoords.sigmaDefaultPrevented)
            return;
        // default behavior
        var camera = this.renderer.getCamera();
        var newRatio = camera.getBoundedRatio(camera.getState().ratio / DOUBLE_CLICK_ZOOMING_RATIO);
        camera.animate(this.renderer.getViewportZoomedState((0, captor_1.getPosition)(e, this.container), newRatio), {
            easing: "quadraticInOut",
            duration: DOUBLE_CLICK_ZOOMING_DURATION,
        });
    };
    MouseCaptor.prototype.handleDown = function (e) {
        if (!this.enabled)
            return;
        this.startCameraState = this.renderer.getCamera().getState();
        var _a = (0, captor_1.getPosition)(e, this.container), x = _a.x, y = _a.y;
        this.lastMouseX = x;
        this.lastMouseY = y;
        this.draggedEvents = 0;
        this.downStartTime = Date.now();
        // TODO: dispatch events
        // Left button pressed
        this.isMouseDown = true;
        this.emit("mousedown", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleUp = function (e) {
        var _this = this;
        if (!this.enabled || !this.isMouseDown)
            return;
        var camera = this.renderer.getCamera();
        this.isMouseDown = false;
        if (typeof this.movingTimeout === "number") {
            clearTimeout(this.movingTimeout);
            this.movingTimeout = null;
        }
        var _a = (0, captor_1.getPosition)(e, this.container), x = _a.x, y = _a.y;
        var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };
        if (this.isMoving) {
            camera.animate({
                x: cameraState.x + MOUSE_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
                y: cameraState.y + MOUSE_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
            }, {
                duration: MOUSE_INERTIA_DURATION,
                easing: "quadraticOut",
            });
        }
        else if (this.lastMouseX !== x || this.lastMouseY !== y) {
            camera.setState({
                x: cameraState.x,
                y: cameraState.y,
            });
        }
        this.isMoving = false;
        setTimeout(function () {
            _this.draggedEvents = 0;
            _this.renderer.refresh();
        }, 0);
        this.emit("mouseup", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleMove = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        var mouseCoords = (0, captor_1.getMouseCoords)(e, this.container);
        // Always trigger a "mousemovebody" event, so that it is possible to develop
        // a drag-and-drop effect that works even when the mouse is out of the
        // container:
        this.emit("mousemovebody", mouseCoords);
        // Only trigger the "mousemove" event when the mouse is actually hovering
        // the container, to avoid weirdly hovering nodes and/or edges when the
        // mouse is not hover the container:
        if (e.target === this.container) {
            this.emit("mousemove", mouseCoords);
        }
        if (mouseCoords.sigmaDefaultPrevented)
            return;
        // Handle the case when "isMouseDown" all the time, to allow dragging the
        // stage while the mouse is not hover the container:
        if (this.isMouseDown) {
            this.isMoving = true;
            this.draggedEvents++;
            if (typeof this.movingTimeout === "number") {
                clearTimeout(this.movingTimeout);
            }
            this.movingTimeout = window.setTimeout(function () {
                _this.movingTimeout = null;
                _this.isMoving = false;
            }, DRAG_TIMEOUT);
            var camera = this.renderer.getCamera();
            var _a = (0, captor_1.getPosition)(e, this.container), eX = _a.x, eY = _a.y;
            var lastMouse = this.renderer.viewportToFramedGraph({
                x: this.lastMouseX,
                y: this.lastMouseY,
            });
            var mouse = this.renderer.viewportToFramedGraph({ x: eX, y: eY });
            var offsetX = lastMouse.x - mouse.x, offsetY = lastMouse.y - mouse.y;
            var cameraState = camera.getState();
            var x = cameraState.x + offsetX, y = cameraState.y + offsetY;
            camera.setState({ x: x, y: y });
            this.lastMouseX = eX;
            this.lastMouseY = eY;
            e.preventDefault();
            e.stopPropagation();
        }
    };
    MouseCaptor.prototype.handleWheel = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        e.preventDefault();
        e.stopPropagation();
        var delta = (0, captor_1.getWheelDelta)(e);
        if (!delta)
            return;
        var wheelCoords = (0, captor_1.getWheelCoords)(e, this.container);
        this.emit("wheel", wheelCoords);
        if (wheelCoords.sigmaDefaultPrevented)
            return;
        // Default behavior
        var ratioDiff = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;
        var camera = this.renderer.getCamera();
        var newRatio = camera.getBoundedRatio(camera.getState().ratio * ratioDiff);
        var wheelDirection = delta > 0 ? 1 : -1;
        var now = Date.now();
        // Cancel events that are too close too each other and in the same direction:
        if (this.currentWheelDirection === wheelDirection &&
            this.lastWheelTriggerTime &&
            now - this.lastWheelTriggerTime < MOUSE_ZOOM_DURATION / 5) {
            return;
        }
        camera.animate(this.renderer.getViewportZoomedState((0, captor_1.getPosition)(e, this.container), newRatio), {
            easing: "quadraticOut",
            duration: MOUSE_ZOOM_DURATION,
        }, function () {
            _this.currentWheelDirection = 0;
        });
        this.currentWheelDirection = wheelDirection;
        this.lastWheelTriggerTime = now;
    };
    MouseCaptor.prototype.handleOut = function () {
        // TODO: dispatch event
    };
    return MouseCaptor;
}(captor_1.default));
exports["default"] = MouseCaptor;


/***/ }),

/***/ "./node_modules/sigma/core/captors/touch.js":
/*!**************************************************!*\
  !*** ./node_modules/sigma/core/captors/touch.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var captor_1 = __importStar(__webpack_require__(/*! ./captor */ "./node_modules/sigma/core/captors/captor.js"));
var DRAG_TIMEOUT = 200;
var TOUCH_INERTIA_RATIO = 3;
var TOUCH_INERTIA_DURATION = 200;
/**
 * Touch captor class.
 *
 * @constructor
 */
var TouchCaptor = /** @class */ (function (_super) {
    __extends(TouchCaptor, _super);
    function TouchCaptor(container, renderer) {
        var _this = _super.call(this, container, renderer) || this;
        _this.enabled = true;
        _this.isMoving = false;
        _this.touchMode = 0; // number of touches down
        // Binding methods:
        _this.handleStart = _this.handleStart.bind(_this);
        _this.handleLeave = _this.handleLeave.bind(_this);
        _this.handleMove = _this.handleMove.bind(_this);
        // Binding events
        container.addEventListener("touchstart", _this.handleStart, false);
        container.addEventListener("touchend", _this.handleLeave, false);
        container.addEventListener("touchcancel", _this.handleLeave, false);
        container.addEventListener("touchmove", _this.handleMove, false);
        return _this;
    }
    TouchCaptor.prototype.kill = function () {
        var container = this.container;
        container.removeEventListener("touchstart", this.handleStart);
        container.removeEventListener("touchend", this.handleLeave);
        container.removeEventListener("touchcancel", this.handleLeave);
        container.removeEventListener("touchmove", this.handleMove);
    };
    TouchCaptor.prototype.getDimensions = function () {
        return {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
        };
    };
    TouchCaptor.prototype.dispatchRelatedMouseEvent = function (type, e, position, emitter) {
        var mousePosition = position || (0, captor_1.getPosition)(e.touches[0], this.container);
        var mouseEvent = new MouseEvent(type, {
            clientX: mousePosition.x,
            clientY: mousePosition.y,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
        });
        mouseEvent.isFakeSigmaMouseEvent = true;
        (emitter || this.container).dispatchEvent(mouseEvent);
    };
    TouchCaptor.prototype.handleStart = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 1)
            this.dispatchRelatedMouseEvent("mousedown", e);
        var touches = (0, captor_1.getTouchesArray)(e.touches);
        this.isMoving = true;
        this.touchMode = touches.length;
        this.startCameraState = this.renderer.getCamera().getState();
        this.startTouchesPositions = touches.map(function (touch) { return (0, captor_1.getPosition)(touch, _this.container); });
        this.lastTouchesPositions = this.startTouchesPositions;
        // When there are two touches down, let's record distance and angle as well:
        if (this.touchMode === 2) {
            var _a = __read(this.startTouchesPositions, 2), _b = _a[0], x0 = _b.x, y0 = _b.y, _c = _a[1], x1 = _c.x, y1 = _c.y;
            this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
            this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        }
        this.emit("touchdown", (0, captor_1.getTouchCoords)(e, this.container));
    };
    TouchCaptor.prototype.handleLeave = function (e) {
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 0 && this.lastTouchesPositions && this.lastTouchesPositions.length) {
            this.dispatchRelatedMouseEvent("mouseup", e, this.lastTouchesPositions[0], document);
            this.dispatchRelatedMouseEvent("click", e, this.lastTouchesPositions[0]);
        }
        if (this.movingTimeout) {
            this.isMoving = false;
            clearTimeout(this.movingTimeout);
        }
        switch (this.touchMode) {
            case 2:
                if (e.touches.length === 1) {
                    this.handleStart(e);
                    e.preventDefault();
                    break;
                }
            /* falls through */
            case 1:
                // TODO
                // Dispatch event
                if (this.isMoving) {
                    var camera = this.renderer.getCamera();
                    var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };
                    camera.animate({
                        x: cameraState.x + TOUCH_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
                        y: cameraState.y + TOUCH_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
                    }, {
                        duration: TOUCH_INERTIA_DURATION,
                        easing: "quadraticOut",
                    });
                }
                this.isMoving = false;
                this.touchMode = 0;
                break;
        }
        this.emit("touchup", (0, captor_1.getTouchCoords)(e, this.container));
    };
    TouchCaptor.prototype.handleMove = function (e) {
        var _a;
        var _this = this;
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 1)
            this.dispatchRelatedMouseEvent("mousemove", e);
        var camera = this.renderer.getCamera();
        var startCameraState = this.startCameraState;
        var touches = (0, captor_1.getTouchesArray)(e.touches);
        var touchesPositions = touches.map(function (touch) { return (0, captor_1.getPosition)(touch, _this.container); });
        this.lastTouchesPositions = touchesPositions;
        this.isMoving = true;
        if (this.movingTimeout)
            clearTimeout(this.movingTimeout);
        this.movingTimeout = window.setTimeout(function () {
            _this.isMoving = false;
        }, DRAG_TIMEOUT);
        switch (this.touchMode) {
            case 1: {
                var _b = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0]), xStart = _b.x, yStart = _b.y;
                var _c = this.renderer.viewportToFramedGraph(touchesPositions[0]), x = _c.x, y = _c.y;
                camera.setState({
                    x: startCameraState.x + xStart - x,
                    y: startCameraState.y + yStart - y,
                });
                break;
            }
            case 2: {
                /**
                 * Here is the thinking here:
                 *
                 * 1. We can find the new angle and ratio, by comparing the vector from "touch one" to "touch two" at the start
                 *    of the d'n'd and now
                 *
                 * 2. We can use `Camera#viewportToGraph` inside formula to retrieve the new camera position, using the graph
                 *    position of a touch at the beginning of the d'n'd (using `startCamera.viewportToGraph`) and the viewport
                 *    position of this same touch now
                 */
                var newCameraState = {};
                var _d = touchesPositions[0], x0 = _d.x, y0 = _d.y;
                var _e = touchesPositions[1], x1 = _e.x, y1 = _e.y;
                var angleDiff = Math.atan2(y1 - y0, x1 - x0) - this.startTouchesAngle;
                var ratioDiff = Math.hypot(y1 - y0, x1 - x0) / this.startTouchesDistance;
                // 1.
                var newRatio = camera.getBoundedRatio(startCameraState.ratio / ratioDiff);
                newCameraState.ratio = newRatio;
                newCameraState.angle = startCameraState.angle + angleDiff;
                // 2.
                var dimensions = this.getDimensions();
                var touchGraphPosition = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0], { cameraState: startCameraState });
                var smallestDimension = Math.min(dimensions.width, dimensions.height);
                var dx = smallestDimension / dimensions.width;
                var dy = smallestDimension / dimensions.height;
                var ratio = newRatio / smallestDimension;
                // Align with center of the graph:
                var x = x0 - smallestDimension / 2 / dx;
                var y = y0 - smallestDimension / 2 / dy;
                // Rotate:
                _a = __read([
                    x * Math.cos(-newCameraState.angle) - y * Math.sin(-newCameraState.angle),
                    y * Math.cos(-newCameraState.angle) + x * Math.sin(-newCameraState.angle),
                ], 2), x = _a[0], y = _a[1];
                newCameraState.x = touchGraphPosition.x - x * ratio;
                newCameraState.y = touchGraphPosition.y + y * ratio;
                camera.setState(newCameraState);
                break;
            }
        }
        this.emit("touchmove", (0, captor_1.getTouchCoords)(e, this.container));
    };
    return TouchCaptor;
}(captor_1.default));
exports["default"] = TouchCaptor;


/***/ }),

/***/ "./node_modules/sigma/core/labels.js":
/*!*******************************************!*\
  !*** ./node_modules/sigma/core/labels.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.edgeLabelsToDisplayFromNodes = exports.LabelGrid = void 0;
/**
 * Class representing a single candidate for the label grid selection.
 *
 * It also describes a deterministic way to compare two candidates to assess
 * which one is better.
 */
var LabelCandidate = /** @class */ (function () {
    function LabelCandidate(key, size) {
        this.key = key;
        this.size = size;
    }
    LabelCandidate.compare = function (first, second) {
        // First we compare by size
        if (first.size > second.size)
            return -1;
        if (first.size < second.size)
            return 1;
        // Then since no two nodes can have the same key, we use it to
        // deterministically tie-break by key
        if (first.key > second.key)
            return 1;
        // NOTE: this comparator cannot return 0
        return -1;
    };
    return LabelCandidate;
}());
/**
 * Class representing a 2D spatial grid divided into constant-size cells.
 */
var LabelGrid = /** @class */ (function () {
    function LabelGrid() {
        this.width = 0;
        this.height = 0;
        this.cellSize = 0;
        this.columns = 0;
        this.rows = 0;
        this.cells = {};
    }
    LabelGrid.prototype.resizeAndClear = function (dimensions, cellSize) {
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.cellSize = cellSize;
        this.columns = Math.ceil(dimensions.width / cellSize);
        this.rows = Math.ceil(dimensions.height / cellSize);
        this.cells = {};
    };
    LabelGrid.prototype.getIndex = function (pos) {
        var xIndex = Math.floor(pos.x / this.cellSize);
        var yIndex = Math.floor(pos.y / this.cellSize);
        return yIndex * this.columns + xIndex;
    };
    LabelGrid.prototype.add = function (key, size, pos) {
        var candidate = new LabelCandidate(key, size);
        var index = this.getIndex(pos);
        var cell = this.cells[index];
        if (!cell) {
            cell = [];
            this.cells[index] = cell;
        }
        cell.push(candidate);
    };
    LabelGrid.prototype.organize = function () {
        for (var k in this.cells) {
            var cell = this.cells[k];
            cell.sort(LabelCandidate.compare);
        }
    };
    LabelGrid.prototype.getLabelsToDisplay = function (ratio, density) {
        // TODO: work on visible nodes to optimize? ^ -> threshold outside so that memoization works?
        // TODO: adjust threshold lower, but increase cells a bit?
        // TODO: hunt for geom issue in disguise
        // TODO: memoize while ratio does not move. method to force recompute
        var cellArea = this.cellSize * this.cellSize;
        var scaledCellArea = cellArea / ratio / ratio;
        var scaledDensity = (scaledCellArea * density) / cellArea;
        var labelsToDisplayPerCell = Math.ceil(scaledDensity);
        var labels = [];
        for (var k in this.cells) {
            var cell = this.cells[k];
            for (var i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) {
                labels.push(cell[i].key);
            }
        }
        return labels;
    };
    return LabelGrid;
}());
exports.LabelGrid = LabelGrid;
/**
 * Label heuristic selecting edge labels to display, based on displayed node
 * labels
 *
 * @param  {object} params                 - Parameters:
 * @param  {Set}      displayedNodeLabels  - Currently displayed node labels.
 * @param  {Set}      highlightedNodes     - Highlighted nodes.
 * @param  {Graph}    graph                - The rendered graph.
 * @param  {string}   hoveredNode          - Hovered node (optional)
 * @return {Array}                         - The selected labels.
 */
function edgeLabelsToDisplayFromNodes(params) {
    var graph = params.graph, hoveredNode = params.hoveredNode, highlightedNodes = params.highlightedNodes, displayedNodeLabels = params.displayedNodeLabels;
    var worthyEdges = [];
    // TODO: the code below can be optimized using #.forEach and batching the code per adj
    // We should display an edge's label if:
    //   - Any of its extremities is highlighted or hovered
    //   - Both of its extremities has its label shown
    graph.forEachEdge(function (edge, _, source, target) {
        if (source === hoveredNode ||
            target === hoveredNode ||
            highlightedNodes.has(source) ||
            highlightedNodes.has(target) ||
            (displayedNodeLabels.has(source) && displayedNodeLabels.has(target))) {
            worthyEdges.push(edge);
        }
    });
    return worthyEdges;
}
exports.edgeLabelsToDisplayFromNodes = edgeLabelsToDisplayFromNodes;


/***/ }),

/***/ "./node_modules/sigma/core/quadtree.js":
/*!*********************************************!*\
  !*** ./node_modules/sigma/core/quadtree.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.rectangleCollidesWithQuad = exports.squareCollidesWithQuad = exports.getCircumscribedAlignedRectangle = exports.isRectangleAligned = void 0;
/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 * @module
 */
/* eslint no-nested-ternary: 0 */
/* eslint no-constant-condition: 0 */
var extend_1 = __importDefault(__webpack_require__(/*! @yomguithereal/helpers/extend */ "./node_modules/@yomguithereal/helpers/extend.js"));
// TODO: should not ask the quadtree when the camera has the whole graph in
// sight.
// TODO: a square can be represented as topleft + width, saying for the quad blocks (reduce mem)
// TODO: jsdoc
// TODO: be sure we can handle cases overcoming boundaries (because of size) or use a maxed size
// TODO: filtering unwanted labels beforehand through the filter function
// NOTE: this is basically a MX-CIF Quadtree at this point
// NOTE: need to explore R-Trees for edges
// NOTE: need to explore 2d segment tree for edges
// NOTE: probably can do faster using spatial hashing
/**
 * Constants.
 *
 * Note that since we are representing a static 4-ary tree, the indices of the
 * quadrants are the following:
 *   - TOP_LEFT:     4i + b
 *   - TOP_RIGHT:    4i + 2b
 *   - BOTTOM_LEFT:  4i + 3b
 *   - BOTTOM_RIGHT: 4i + 4b
 */
var BLOCKS = 4, MAX_LEVEL = 5;
var OUTSIDE_BLOCK = "outside";
var X_OFFSET = 0, Y_OFFSET = 1, WIDTH_OFFSET = 2, HEIGHT_OFFSET = 3;
var TOP_LEFT = 1, TOP_RIGHT = 2, BOTTOM_LEFT = 3, BOTTOM_RIGHT = 4;
var hasWarnedTooMuchOutside = false;
/**
 * Geometry helpers.
 */
/**
 * Function returning whether the given rectangle is axis-aligned.
 *
 * @param  {Rectangle} rect
 * @return {boolean}
 */
function isRectangleAligned(rect) {
    return rect.x1 === rect.x2 || rect.y1 === rect.y2;
}
exports.isRectangleAligned = isRectangleAligned;
/**
 * Function returning the smallest rectangle that contains the given rectangle, and that is aligned with the axis.
 *
 * @param {Rectangle} rect
 * @return {Rectangle}
 */
function getCircumscribedAlignedRectangle(rect) {
    var width = Math.sqrt(Math.pow(rect.x2 - rect.x1, 2) + Math.pow(rect.y2 - rect.y1, 2));
    var heightVector = {
        x: ((rect.y1 - rect.y2) * rect.height) / width,
        y: ((rect.x2 - rect.x1) * rect.height) / width,
    };
    // Compute all corners:
    var tl = { x: rect.x1, y: rect.y1 };
    var tr = { x: rect.x2, y: rect.y2 };
    var bl = {
        x: rect.x1 + heightVector.x,
        y: rect.y1 + heightVector.y,
    };
    var br = {
        x: rect.x2 + heightVector.x,
        y: rect.y2 + heightVector.y,
    };
    var xL = Math.min(tl.x, tr.x, bl.x, br.x);
    var xR = Math.max(tl.x, tr.x, bl.x, br.x);
    var yT = Math.min(tl.y, tr.y, bl.y, br.y);
    var yB = Math.max(tl.y, tr.y, bl.y, br.y);
    return {
        x1: xL,
        y1: yT,
        x2: xR,
        y2: yT,
        height: yB - yT,
    };
}
exports.getCircumscribedAlignedRectangle = getCircumscribedAlignedRectangle;
/**
 *
 * @param x1
 * @param y1
 * @param w
 * @param qx
 * @param qy
 * @param qw
 * @param qh
 */
function squareCollidesWithQuad(x1, y1, w, qx, qy, qw, qh) {
    return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + w > qy;
}
exports.squareCollidesWithQuad = squareCollidesWithQuad;
function rectangleCollidesWithQuad(x1, y1, w, h, qx, qy, qw, qh) {
    return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + h > qy;
}
exports.rectangleCollidesWithQuad = rectangleCollidesWithQuad;
function pointIsInQuad(x, y, qx, qy, qw, qh) {
    var xmp = qx + qw / 2, ymp = qy + qh / 2, top = y < ymp, left = x < xmp;
    return top ? (left ? TOP_LEFT : TOP_RIGHT) : left ? BOTTOM_LEFT : BOTTOM_RIGHT;
}
/**
 * Helper functions that are not bound to the class so an external user
 * cannot mess with them.
 */
function buildQuadrants(maxLevel, data) {
    // [block, level]
    var stack = [0, 0];
    while (stack.length) {
        var level = stack.pop(), block = stack.pop();
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var x = data[block + X_OFFSET], y = data[block + Y_OFFSET], width = data[block + WIDTH_OFFSET], height = data[block + HEIGHT_OFFSET], hw = width / 2, hh = height / 2;
        data[topLeftBlock + X_OFFSET] = x;
        data[topLeftBlock + Y_OFFSET] = y;
        data[topLeftBlock + WIDTH_OFFSET] = hw;
        data[topLeftBlock + HEIGHT_OFFSET] = hh;
        data[topRightBlock + X_OFFSET] = x + hw;
        data[topRightBlock + Y_OFFSET] = y;
        data[topRightBlock + WIDTH_OFFSET] = hw;
        data[topRightBlock + HEIGHT_OFFSET] = hh;
        data[bottomLeftBlock + X_OFFSET] = x;
        data[bottomLeftBlock + Y_OFFSET] = y + hh;
        data[bottomLeftBlock + WIDTH_OFFSET] = hw;
        data[bottomLeftBlock + HEIGHT_OFFSET] = hh;
        data[bottomRightBlock + X_OFFSET] = x + hw;
        data[bottomRightBlock + Y_OFFSET] = y + hh;
        data[bottomRightBlock + WIDTH_OFFSET] = hw;
        data[bottomRightBlock + HEIGHT_OFFSET] = hh;
        if (level < maxLevel - 1) {
            stack.push(bottomRightBlock, level + 1);
            stack.push(bottomLeftBlock, level + 1);
            stack.push(topRightBlock, level + 1);
            stack.push(topLeftBlock, level + 1);
        }
    }
}
function insertNode(maxLevel, data, containers, key, x, y, size) {
    var x1 = x - size, y1 = y - size, w = size * 2;
    var level = 0, block = 0;
    while (true) {
        // If we reached max level
        if (level >= maxLevel) {
            containers[block] = containers[block] || [];
            containers[block].push(key);
            return;
        }
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var collidingWithTopLeft = squareCollidesWithQuad(x1, y1, w, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);
        var collidingWithTopRight = squareCollidesWithQuad(x1, y1, w, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);
        var collidingWithBottomLeft = squareCollidesWithQuad(x1, y1, w, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);
        var collidingWithBottomRight = squareCollidesWithQuad(x1, y1, w, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);
        var collisions = [
            collidingWithTopLeft,
            collidingWithTopRight,
            collidingWithBottomLeft,
            collidingWithBottomRight,
        ].reduce(function (acc, current) {
            if (current)
                return acc + 1;
            else
                return acc;
        }, 0);
        // If we have no collision at root level, inject node in the outside block
        if (collisions === 0 && level === 0) {
            containers[OUTSIDE_BLOCK].push(key);
            if (!hasWarnedTooMuchOutside && containers[OUTSIDE_BLOCK].length >= 5) {
                hasWarnedTooMuchOutside = true;
                console.warn("sigma/quadtree.insertNode: At least 5 nodes are outside the global quadtree zone. " +
                    "You might have a problem with the normalization function or the custom bounding box.");
            }
            return;
        }
        // If we don't have at least a collision but deeper, there is an issue
        if (collisions === 0)
            throw new Error("sigma/quadtree.insertNode: no collision (level: ".concat(level, ", key: ").concat(key, ", x: ").concat(x, ", y: ").concat(y, ", size: ").concat(size, ")."));
        // If we have 3 collisions, we have a geometry problem obviously
        if (collisions === 3)
            throw new Error("sigma/quadtree.insertNode: 3 impossible collisions (level: ".concat(level, ", key: ").concat(key, ", x: ").concat(x, ", y: ").concat(y, ", size: ").concat(size, ")."));
        // If we have more that one collision, we stop here and store the node
        // in the relevant containers
        if (collisions > 1) {
            containers[block] = containers[block] || [];
            containers[block].push(key);
            return;
        }
        else {
            level++;
        }
        // Else we recurse into the correct quads
        if (collidingWithTopLeft)
            block = topLeftBlock;
        if (collidingWithTopRight)
            block = topRightBlock;
        if (collidingWithBottomLeft)
            block = bottomLeftBlock;
        if (collidingWithBottomRight)
            block = bottomRightBlock;
    }
}
function getNodesInAxisAlignedRectangleArea(maxLevel, data, containers, x1, y1, w, h) {
    // [block, level]
    var stack = [0, 0];
    var collectedNodes = [];
    var container;
    while (stack.length) {
        var level = stack.pop(), block = stack.pop();
        // Collecting nodes
        container = containers[block];
        if (container)
            (0, extend_1.default)(collectedNodes, container);
        // If we reached max level
        if (level >= maxLevel)
            continue;
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var collidingWithTopLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);
        var collidingWithTopRight = rectangleCollidesWithQuad(x1, y1, w, h, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);
        var collidingWithBottomLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);
        var collidingWithBottomRight = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);
        if (collidingWithTopLeft)
            stack.push(topLeftBlock, level + 1);
        if (collidingWithTopRight)
            stack.push(topRightBlock, level + 1);
        if (collidingWithBottomLeft)
            stack.push(bottomLeftBlock, level + 1);
        if (collidingWithBottomRight)
            stack.push(bottomRightBlock, level + 1);
    }
    return collectedNodes;
}
/**
 * QuadTree class.
 *
 * @constructor
 * @param {object} boundaries - The graph boundaries.
 */
var QuadTree = /** @class */ (function () {
    function QuadTree(params) {
        var _a;
        if (params === void 0) { params = {}; }
        this.containers = (_a = {}, _a[OUTSIDE_BLOCK] = [], _a);
        this.cache = null;
        this.lastRectangle = null;
        // Allocating the underlying byte array
        var L = Math.pow(4, MAX_LEVEL);
        this.data = new Float32Array(BLOCKS * ((4 * L - 1) / 3));
        if (params.boundaries)
            this.resize(params.boundaries);
        else
            this.resize({
                x: 0,
                y: 0,
                width: 1,
                height: 1,
            });
    }
    QuadTree.prototype.add = function (key, x, y, size) {
        insertNode(MAX_LEVEL, this.data, this.containers, key, x, y, size);
        return this;
    };
    QuadTree.prototype.resize = function (boundaries) {
        this.clear();
        // Building the quadrants
        this.data[X_OFFSET] = boundaries.x;
        this.data[Y_OFFSET] = boundaries.y;
        this.data[WIDTH_OFFSET] = boundaries.width;
        this.data[HEIGHT_OFFSET] = boundaries.height;
        buildQuadrants(MAX_LEVEL, this.data);
    };
    QuadTree.prototype.clear = function () {
        var _a;
        this.containers = (_a = {}, _a[OUTSIDE_BLOCK] = [], _a);
        return this;
    };
    QuadTree.prototype.point = function (x, y) {
        var nodes = this.containers[OUTSIDE_BLOCK];
        var block = 0, level = 0;
        do {
            if (this.containers[block])
                nodes.push.apply(nodes, __spreadArray([], __read(this.containers[block]), false));
            var quad = pointIsInQuad(x, y, this.data[block + X_OFFSET], this.data[block + Y_OFFSET], this.data[block + WIDTH_OFFSET], this.data[block + HEIGHT_OFFSET]);
            block = 4 * block + quad * BLOCKS;
            level++;
        } while (level <= MAX_LEVEL);
        return nodes;
    };
    QuadTree.prototype.rectangle = function (x1, y1, x2, y2, height) {
        var _a;
        var lr = this.lastRectangle;
        if (lr && x1 === lr.x1 && x2 === lr.x2 && y1 === lr.y1 && y2 === lr.y2 && height === lr.height) {
            return this.cache;
        }
        this.lastRectangle = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            height: height,
        };
        // If the rectangle is shifted, we use the smallest aligned rectangle that contains the shifted one:
        if (!isRectangleAligned(this.lastRectangle))
            this.lastRectangle = getCircumscribedAlignedRectangle(this.lastRectangle);
        this.cache = getNodesInAxisAlignedRectangleArea(MAX_LEVEL, this.data, this.containers, x1, y1, Math.abs(x1 - x2) || Math.abs(y1 - y2), height);
        // Add all the nodes in the outside block, since they might be relevant, and since they should be very few:
        (_a = this.cache).push.apply(_a, __spreadArray([], __read(this.containers[OUTSIDE_BLOCK]), false));
        return this.cache;
    };
    return QuadTree;
}());
exports["default"] = QuadTree;


/***/ }),

/***/ "./node_modules/sigma/index.js":
/*!*************************************!*\
  !*** ./node_modules/sigma/index.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Sigma = exports.MouseCaptor = exports.QuadTree = exports.Camera = void 0;
/**
 * Sigma.js Library Endpoint
 * =========================
 *
 * The library endpoint.
 * @module
 */
var sigma_1 = __importDefault(__webpack_require__(/*! ./sigma */ "./node_modules/sigma/sigma.js"));
exports.Sigma = sigma_1.default;
var camera_1 = __importDefault(__webpack_require__(/*! ./core/camera */ "./node_modules/sigma/core/camera.js"));
exports.Camera = camera_1.default;
var quadtree_1 = __importDefault(__webpack_require__(/*! ./core/quadtree */ "./node_modules/sigma/core/quadtree.js"));
exports.QuadTree = quadtree_1.default;
var mouse_1 = __importDefault(__webpack_require__(/*! ./core/captors/mouse */ "./node_modules/sigma/core/captors/mouse.js"));
exports.MouseCaptor = mouse_1.default;
exports["default"] = sigma_1.default;


/***/ }),

/***/ "./node_modules/sigma/rendering/canvas/edge-label.js":
/*!***********************************************************!*\
  !*** ./node_modules/sigma/rendering/canvas/edge-label.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function drawEdgeLabel(context, edgeData, sourceData, targetData, settings) {
    var size = settings.edgeLabelSize, font = settings.edgeLabelFont, weight = settings.edgeLabelWeight, color = settings.edgeLabelColor.attribute
        ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000"
        : settings.edgeLabelColor.color;
    var label = edgeData.label;
    if (!label)
        return;
    context.fillStyle = color;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    // Computing positions without considering nodes sizes:
    var sSize = sourceData.size;
    var tSize = targetData.size;
    var sx = sourceData.x;
    var sy = sourceData.y;
    var tx = targetData.x;
    var ty = targetData.y;
    var cx = (sx + tx) / 2;
    var cy = (sy + ty) / 2;
    var dx = tx - sx;
    var dy = ty - sy;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < sSize + tSize)
        return;
    // Adding nodes sizes:
    sx += (dx * sSize) / d;
    sy += (dy * sSize) / d;
    tx -= (dx * tSize) / d;
    ty -= (dy * tSize) / d;
    cx = (sx + tx) / 2;
    cy = (sy + ty) / 2;
    dx = tx - sx;
    dy = ty - sy;
    d = Math.sqrt(dx * dx + dy * dy);
    // Handling ellipsis
    var textLength = context.measureText(label).width;
    if (textLength > d) {
        var ellipsis = "…";
        label = label + ellipsis;
        textLength = context.measureText(label).width;
        while (textLength > d && label.length > 1) {
            label = label.slice(0, -2) + ellipsis;
            textLength = context.measureText(label).width;
        }
        if (label.length < 4)
            return;
    }
    var angle;
    if (dx > 0) {
        if (dy > 0)
            angle = Math.acos(dx / d);
        else
            angle = Math.asin(dy / d);
    }
    else {
        if (dy > 0)
            angle = Math.acos(dx / d) + Math.PI;
        else
            angle = Math.asin(dx / d) + Math.PI / 2;
    }
    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.fillText(label, -textLength / 2, edgeData.size / 2 + size);
    context.restore();
}
exports["default"] = drawEdgeLabel;


/***/ }),

/***/ "./node_modules/sigma/rendering/canvas/hover.js":
/*!******************************************************!*\
  !*** ./node_modules/sigma/rendering/canvas/hover.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var label_1 = __importDefault(__webpack_require__(/*! ./label */ "./node_modules/sigma/rendering/canvas/label.js"));
/**
 * Draw an hovered node.
 * - if there is no label => display a shadow on the node
 * - if the label box is bigger than node size => display a label box that contains the node with a shadow
 * - else node with shadow and the label box
 */
function drawHover(context, data, settings) {
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    // Then we draw the label background
    context.fillStyle = "#FFF";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 8;
    context.shadowColor = "#000";
    var PADDING = 2;
    if (typeof data.label === "string") {
        var textWidth = context.measureText(data.label).width, boxWidth = Math.round(textWidth + 5), boxHeight = Math.round(size + 2 * PADDING), radius = Math.max(data.size, size / 2) + PADDING;
        var angleRadian = Math.asin(boxHeight / 2 / radius);
        var xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)));
        context.beginPath();
        context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
        context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
        context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
        context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
        context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
        context.closePath();
        context.fill();
    }
    else {
        context.beginPath();
        context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    // And finally we draw the label
    (0, label_1.default)(context, data, settings);
}
exports["default"] = drawHover;


/***/ }),

/***/ "./node_modules/sigma/rendering/canvas/label.js":
/*!******************************************************!*\
  !*** ./node_modules/sigma/rendering/canvas/label.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function drawLabel(context, data, settings) {
    if (!data.label)
        return;
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight, color = settings.labelColor.attribute
        ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000"
        : settings.labelColor.color;
    context.fillStyle = color;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
exports["default"] = drawLabel;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/common/edge.js":
/*!********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/common/edge.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createEdgeCompoundProgram = exports.AbstractEdgeProgram = void 0;
/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
var program_1 = __webpack_require__(/*! ./program */ "./node_modules/sigma/rendering/webgl/programs/common/program.js");
/**
 * Edge Program class.
 *
 * @constructor
 */
var AbstractEdgeProgram = /** @class */ (function (_super) {
    __extends(AbstractEdgeProgram, _super);
    function AbstractEdgeProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        return _super.call(this, gl, vertexShaderSource, fragmentShaderSource, points, attributes) || this;
    }
    return AbstractEdgeProgram;
}(program_1.AbstractProgram));
exports.AbstractEdgeProgram = AbstractEdgeProgram;
function createEdgeCompoundProgram(programClasses) {
    return /** @class */ (function () {
        function EdgeCompoundProgram(gl, renderer) {
            this.programs = programClasses.map(function (ProgramClass) { return new ProgramClass(gl, renderer); });
        }
        EdgeCompoundProgram.prototype.bufferData = function () {
            this.programs.forEach(function (program) { return program.bufferData(); });
        };
        EdgeCompoundProgram.prototype.allocate = function (capacity) {
            this.programs.forEach(function (program) { return program.allocate(capacity); });
        };
        EdgeCompoundProgram.prototype.bind = function () {
            // nothing todo, it's already done in each program constructor
        };
        EdgeCompoundProgram.prototype.computeIndices = function () {
            this.programs.forEach(function (program) { return program.computeIndices(); });
        };
        EdgeCompoundProgram.prototype.render = function (params) {
            this.programs.forEach(function (program) {
                program.bind();
                program.bufferData();
                program.render(params);
            });
        };
        EdgeCompoundProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
            this.programs.forEach(function (program) { return program.process(sourceData, targetData, data, hidden, offset); });
        };
        return EdgeCompoundProgram;
    }());
}
exports.createEdgeCompoundProgram = createEdgeCompoundProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/common/node.js":
/*!********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/common/node.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createNodeCompoundProgram = exports.AbstractNodeProgram = void 0;
/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
var program_1 = __webpack_require__(/*! ./program */ "./node_modules/sigma/rendering/webgl/programs/common/program.js");
/**
 * Node Program class.
 *
 * @constructor
 */
var AbstractNodeProgram = /** @class */ (function (_super) {
    __extends(AbstractNodeProgram, _super);
    function AbstractNodeProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        var _this = _super.call(this, gl, vertexShaderSource, fragmentShaderSource, points, attributes) || this;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.sizeLocation = gl.getAttribLocation(_this.program, "a_size");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        // Uniform Location
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("AbstractNodeProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var ratioLocation = gl.getUniformLocation(_this.program, "u_ratio");
        if (ratioLocation === null)
            throw new Error("AbstractNodeProgram: error while getting ratioLocation");
        _this.ratioLocation = ratioLocation;
        var scaleLocation = gl.getUniformLocation(_this.program, "u_scale");
        if (scaleLocation === null)
            throw new Error("AbstractNodeProgram: error while getting scaleLocation");
        _this.scaleLocation = scaleLocation;
        return _this;
    }
    AbstractNodeProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.sizeLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.sizeLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, this.attributes * Float32Array.BYTES_PER_ELEMENT, 12);
    };
    return AbstractNodeProgram;
}(program_1.AbstractProgram));
exports.AbstractNodeProgram = AbstractNodeProgram;
/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @return {function}
 */
function createNodeCompoundProgram(programClasses) {
    return /** @class */ (function () {
        function NodeCompoundProgram(gl, renderer) {
            this.programs = programClasses.map(function (ProgramClass) { return new ProgramClass(gl, renderer); });
        }
        NodeCompoundProgram.prototype.bufferData = function () {
            this.programs.forEach(function (program) { return program.bufferData(); });
        };
        NodeCompoundProgram.prototype.allocate = function (capacity) {
            this.programs.forEach(function (program) { return program.allocate(capacity); });
        };
        NodeCompoundProgram.prototype.bind = function () {
            // nothing todo, it's already done in each program constructor
        };
        NodeCompoundProgram.prototype.render = function (params) {
            this.programs.forEach(function (program) {
                program.bind();
                program.bufferData();
                program.render(params);
            });
        };
        NodeCompoundProgram.prototype.process = function (data, hidden, offset) {
            this.programs.forEach(function (program) { return program.process(data, hidden, offset); });
        };
        return NodeCompoundProgram;
    }());
}
exports.createNodeCompoundProgram = createNodeCompoundProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/common/program.js":
/*!***********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/common/program.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractProgram = void 0;
/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 * @module
 */
var utils_1 = __webpack_require__(/*! ../../shaders/utils */ "./node_modules/sigma/rendering/webgl/shaders/utils.js");
/**
 * Abstract Program class.
 *
 * @constructor
 */
var AbstractProgram = /** @class */ (function () {
    function AbstractProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        this.array = new Float32Array();
        this.points = points;
        this.attributes = attributes;
        this.gl = gl;
        this.vertexShaderSource = vertexShaderSource;
        this.fragmentShaderSource = fragmentShaderSource;
        var buffer = gl.createBuffer();
        if (buffer === null)
            throw new Error("AbstractProgram: error while creating the buffer");
        this.buffer = buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.vertexShader = (0, utils_1.loadVertexShader)(gl, this.vertexShaderSource);
        this.fragmentShader = (0, utils_1.loadFragmentShader)(gl, this.fragmentShaderSource);
        this.program = (0, utils_1.loadProgram)(gl, [this.vertexShader, this.fragmentShader]);
    }
    AbstractProgram.prototype.bufferData = function () {
        var gl = this.gl;
        gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    };
    AbstractProgram.prototype.allocate = function (capacity) {
        this.array = new Float32Array(this.points * this.attributes * capacity);
    };
    AbstractProgram.prototype.hasNothingToRender = function () {
        return this.array.length === 0;
    };
    return AbstractProgram;
}());
exports.AbstractProgram = AbstractProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/edge.arrow.js":
/*!*******************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/edge.arrow.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 * @module
 */
var edge_1 = __webpack_require__(/*! ./common/edge */ "./node_modules/sigma/rendering/webgl/programs/common/edge.js");
var edge_arrowHead_1 = __importDefault(__webpack_require__(/*! ./edge.arrowHead */ "./node_modules/sigma/rendering/webgl/programs/edge.arrowHead.js"));
var edge_clamped_1 = __importDefault(__webpack_require__(/*! ./edge.clamped */ "./node_modules/sigma/rendering/webgl/programs/edge.clamped.js"));
var EdgeArrowProgram = (0, edge_1.createEdgeCompoundProgram)([edge_clamped_1.default, edge_arrowHead_1.default]);
exports["default"] = EdgeArrowProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/edge.arrowHead.js":
/*!***********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/edge.arrowHead.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./node_modules/sigma/utils/index.js");
var edge_arrowHead_vert_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.arrowHead.vert.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.vert.glsl.js"));
var edge_arrowHead_frag_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.arrowHead.frag.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.frag.glsl.js"));
var edge_1 = __webpack_require__(/*! ./common/edge */ "./node_modules/sigma/rendering/webgl/programs/common/edge.js");
var POINTS = 3, ATTRIBUTES = 9, STRIDE = POINTS * ATTRIBUTES;
var EdgeArrowHeadProgram = /** @class */ (function (_super) {
    __extends(EdgeArrowHeadProgram, _super);
    function EdgeArrowHeadProgram(gl) {
        var _this = _super.call(this, gl, edge_arrowHead_vert_glsl_1.default, edge_arrowHead_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        _this.radiusLocation = gl.getAttribLocation(_this.program, "a_radius");
        _this.barycentricLocation = gl.getAttribLocation(_this.program, "a_barycentric");
        // Uniform locations
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting sqrtZoomRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting correctionRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        _this.bind();
        return _this;
    }
    EdgeArrowHeadProgram.prototype.bind = function () {
        var gl = this.gl;
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.radiusLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.enableVertexAttribArray(this.barycentricLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
        // TODO: maybe we can optimize here by packing this in a bit mask
        gl.vertexAttribPointer(this.barycentricLocation, 3, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 24);
    };
    EdgeArrowHeadProgram.prototype.computeIndices = function () {
        // nothing to do
    };
    EdgeArrowHeadProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, radius = targetData.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 1;
        array[i++] = 0;
        array[i++] = 0;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 0;
        array[i++] = 1;
        array[i++] = 0;
        // Third point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 0;
        array[i++] = 0;
        array[i] = 1;
    };
    EdgeArrowHeadProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        // Binding uniforms
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawArrays(gl.TRIANGLES, 0, this.array.length / ATTRIBUTES);
    };
    return EdgeArrowHeadProgram;
}(edge_1.AbstractEdgeProgram));
exports["default"] = EdgeArrowHeadProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/edge.clamped.js":
/*!*********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/edge.clamped.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var edge_1 = __webpack_require__(/*! ./common/edge */ "./node_modules/sigma/rendering/webgl/programs/common/edge.js");
var utils_1 = __webpack_require__(/*! ../../../utils */ "./node_modules/sigma/utils/index.js");
var edge_clamped_vert_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.clamped.vert.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.clamped.vert.glsl.js"));
var edge_frag_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.frag.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.frag.glsl.js"));
var POINTS = 4, ATTRIBUTES = 6, STRIDE = POINTS * ATTRIBUTES;
var EdgeClampedProgram = /** @class */ (function (_super) {
    __extends(EdgeClampedProgram, _super);
    function EdgeClampedProgram(gl) {
        var _this = _super.call(this, gl, edge_clamped_vert_glsl_1.default, edge_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Initializing indices buffer
        var indicesBuffer = gl.createBuffer();
        if (indicesBuffer === null)
            throw new Error("EdgeClampedProgram: error while getting resolutionLocation");
        _this.indicesBuffer = indicesBuffer;
        // Locations:
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        _this.radiusLocation = gl.getAttribLocation(_this.program, "a_radius");
        // Uniform locations
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeClampedProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeClampedProgram: error while getting cameraRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeClampedProgram: error while getting viewportRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        // Enabling the OES_element_index_uint extension
        // NOTE: on older GPUs, this means that really large graphs won't
        // have all their edges rendered. But it seems that the
        // `OES_element_index_uint` is quite everywhere so we'll handle
        // the potential issue if it really arises.
        // NOTE: when using webgl2, the extension is enabled by default
        _this.canUse32BitsIndices = (0, utils_1.canUse32BitsIndices)(gl);
        _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
        _this.indicesArray = new _this.IndicesArray();
        _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        _this.bind();
        return _this;
    }
    EdgeClampedProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.enableVertexAttribArray(this.radiusLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        gl.vertexAttribPointer(this.radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
    };
    EdgeClampedProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, radius = targetData.size || 1, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        array[i++] = 0;
        // First point flipped
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        array[i++] = 0;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        array[i++] = radius;
        // Second point flipped
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        array[i] = -radius;
    };
    EdgeClampedProgram.prototype.computeIndices = function () {
        var l = this.array.length / ATTRIBUTES;
        var size = l + l / 2;
        var indices = new this.IndicesArray(size);
        for (var i = 0, c = 0; i < l; i += 4) {
            indices[c++] = i;
            indices[c++] = i + 1;
            indices[c++] = i + 2;
            indices[c++] = i + 2;
            indices[c++] = i + 1;
            indices[c++] = i + 3;
        }
        this.indicesArray = indices;
    };
    EdgeClampedProgram.prototype.bufferData = function () {
        _super.prototype.bufferData.call(this);
        // Indices data
        var gl = this.gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    };
    EdgeClampedProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        // Binding uniforms
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
    };
    return EdgeClampedProgram;
}(edge_1.AbstractEdgeProgram));
exports["default"] = EdgeClampedProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/edge.js":
/*!*************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/edge.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sigma.js WebGL Renderer Edge Program
 * =====================================
 *
 * Program rendering edges as thick lines using four points translated
 * orthogonally from the source & target's centers by half thickness.
 *
 * Rendering two triangles by using only four points is made possible through
 * the use of indices.
 *
 * This method should be faster than the 6 points / 2 triangles approach and
 * should handle thickness better than with gl.LINES.
 *
 * This version of the shader balances geometry computation evenly between
 * the CPU & GPU (normals are computed on the CPU side).
 * @module
 */
var utils_1 = __webpack_require__(/*! ../../../utils */ "./node_modules/sigma/utils/index.js");
var edge_vert_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.vert.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.vert.glsl.js"));
var edge_frag_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/edge.frag.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/edge.frag.glsl.js"));
var edge_1 = __webpack_require__(/*! ./common/edge */ "./node_modules/sigma/rendering/webgl/programs/common/edge.js");
var POINTS = 4, ATTRIBUTES = 5, STRIDE = POINTS * ATTRIBUTES;
var EdgeProgram = /** @class */ (function (_super) {
    __extends(EdgeProgram, _super);
    function EdgeProgram(gl) {
        var _this = _super.call(this, gl, edge_vert_glsl_1.default, edge_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Initializing indices buffer
        var indicesBuffer = gl.createBuffer();
        if (indicesBuffer === null)
            throw new Error("EdgeProgram: error while creating indicesBuffer");
        _this.indicesBuffer = indicesBuffer;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeProgram: error while getting correctionRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeProgram: error while getting sqrtZoomRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        // Enabling the OES_element_index_uint extension
        // NOTE: on older GPUs, this means that really large graphs won't
        // have all their edges rendered. But it seems that the
        // `OES_element_index_uint` is quite everywhere so we'll handle
        // the potential issue if it really arises.
        // NOTE: when using webgl2, the extension is enabled by default
        _this.canUse32BitsIndices = (0, utils_1.canUse32BitsIndices)(gl);
        _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
        _this.indicesArray = new _this.IndicesArray();
        _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        _this.bind();
        return _this;
    }
    EdgeProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
    };
    EdgeProgram.prototype.computeIndices = function () {
        var l = this.array.length / ATTRIBUTES;
        var size = l + l / 2;
        var indices = new this.IndicesArray(size);
        for (var i = 0, c = 0; i < l; i += 4) {
            indices[c++] = i;
            indices[c++] = i + 1;
            indices[c++] = i + 2;
            indices[c++] = i + 2;
            indices[c++] = i + 1;
            indices[c++] = i + 3;
        }
        this.indicesArray = indices;
    };
    EdgeProgram.prototype.bufferData = function () {
        _super.prototype.bufferData.call(this);
        // Indices data
        var gl = this.gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    };
    EdgeProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        // First point flipped
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        // Second point flipped
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i] = color;
    };
    EdgeProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
    };
    return EdgeProgram;
}(edge_1.AbstractEdgeProgram));
exports["default"] = EdgeProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/programs/node.fast.js":
/*!******************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/programs/node.fast.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./node_modules/sigma/utils/index.js");
var node_fast_vert_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/node.fast.vert.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/node.fast.vert.glsl.js"));
var node_fast_frag_glsl_1 = __importDefault(__webpack_require__(/*! ../shaders/node.fast.frag.glsl.js */ "./node_modules/sigma/rendering/webgl/shaders/node.fast.frag.glsl.js"));
var node_1 = __webpack_require__(/*! ./common/node */ "./node_modules/sigma/rendering/webgl/programs/common/node.js");
var POINTS = 1, ATTRIBUTES = 4;
var NodeFastProgram = /** @class */ (function (_super) {
    __extends(NodeFastProgram, _super);
    function NodeFastProgram(gl) {
        var _this = _super.call(this, gl, node_fast_vert_glsl_1.default, node_fast_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        _this.bind();
        return _this;
    }
    NodeFastProgram.prototype.process = function (data, hidden, offset) {
        var array = this.array;
        var i = offset * POINTS * ATTRIBUTES;
        if (hidden) {
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            return;
        }
        var color = (0, utils_1.floatColor)(data.color);
        array[i++] = data.x;
        array[i++] = data.y;
        array[i++] = data.size;
        array[i] = color;
    };
    NodeFastProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        gl.uniform1f(this.ratioLocation, 1 / Math.sqrt(params.ratio));
        gl.uniform1f(this.scaleLocation, params.scalingRatio);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
    };
    return NodeFastProgram;
}(node_1.AbstractNodeProgram));
exports["default"] = NodeFastProgram;


/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.frag.glsl.js":
/*!********************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.frag.glsl.js ***!
  \********************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(o,r)=>{for(var t in r)e.o(r,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:r[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},o={};e.r(o),e.d(o,{default:()=>r});const r="precision mediump float;\n\nvarying vec4 v_color;\n\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n";module.exports=o})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.vert.glsl.js":
/*!********************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.arrowHead.vert.glsl.js ***!
  \********************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var a={d:(e,t)=>{for(var o in t)a.o(t,o)&&!a.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},o:(a,e)=>Object.prototype.hasOwnProperty.call(a,e),r:a=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(a,"__esModule",{value:!0})}},e={};a.r(e),a.d(e,{default:()=>t});const t="attribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_radius;\nattribute vec4 a_color;\nattribute vec3 a_barycentric;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\nconst float arrowHeadWidthLengthRatio = 0.66;\nconst float arrowHeadLengthThicknessRatio = 2.5;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl and\n  // edge.clamped.vert.glsl. Please read it to get better comments on what's\n  // happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n  float adaptedWebGLNodeRadius = a_radius * 2.0 * u_correctionRatio * u_sqrtZoomRatio;\n  float adaptedWebGLArrowHeadLength = adaptedWebGLThickness * 2.0 * arrowHeadLengthThicknessRatio;\n  float adaptedWebGLArrowHeadHalfWidth = adaptedWebGLArrowHeadLength * arrowHeadWidthLengthRatio / 2.0;\n\n  float da = a_barycentric.x;\n  float db = a_barycentric.y;\n  float dc = a_barycentric.z;\n\n  vec2 delta = vec2(\n      da * (adaptedWebGLNodeRadius * unitNormal.y)\n    + db * ((adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.y + adaptedWebGLArrowHeadHalfWidth * unitNormal.x)\n    + dc * ((adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.y - adaptedWebGLArrowHeadHalfWidth * unitNormal.x),\n\n      da * (-adaptedWebGLNodeRadius * unitNormal.x)\n    + db * (-(adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.x + adaptedWebGLArrowHeadHalfWidth * unitNormal.y)\n    + dc * (-(adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.x - adaptedWebGLArrowHeadHalfWidth * unitNormal.y)\n  );\n\n  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;\n\n  gl_Position = vec4(position, 0, 1);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=e})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.clamped.vert.glsl.js":
/*!******************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.clamped.vert.glsl.js ***!
  \******************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(o,n)=>{for(var t in n)e.o(n,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:n[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},o={};e.r(o),e.d(o,{default:()=>n});const n="attribute vec4 a_color;\nattribute vec2 a_normal;\nattribute vec2 a_position;\nattribute float a_radius;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\nconst float arrowHeadLengthThicknessRatio = 2.5;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl. Please read it to\n  // get better comments on what's happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n\n  // Here, we move the point to leave space for the arrow head:\n  float direction = sign(a_radius);\n  float adaptedWebGLNodeRadius = direction * a_radius * 2.0 * u_correctionRatio * u_sqrtZoomRatio;\n  float adaptedWebGLArrowHeadLength = adaptedWebGLThickness * 2.0 * arrowHeadLengthThicknessRatio;\n\n  vec2 compensationVector = vec2(-direction * unitNormal.y, direction * unitNormal.x) * (adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength);\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(a_position + unitNormal * adaptedWebGLThickness + compensationVector, 1)).xy, 0, 1);\n\n  v_thickness = webGLThickness / u_sqrtZoomRatio;\n\n  v_normal = unitNormal;\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=o})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.frag.glsl.js":
/*!**********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.frag.glsl.js ***!
  \**********************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(n,t)=>{for(var o in t)e.o(t,o)&&!e.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:t[o]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>t});const t="precision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float feather = 0.001;\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, transparent, t);\n}\n";module.exports=n})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/edge.vert.glsl.js":
/*!**********************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/edge.vert.glsl.js ***!
  \**********************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(n,o)=>{for(var t in o)e.o(o,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:o[t]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>o});const o='attribute vec4 a_color;\nattribute vec2 a_normal;\nattribute vec2 a_position;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // We require edges to be at least `minThickness` pixels thick *on screen*\n  // (so we need to compensate the SQRT zoom ratio):\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n\n  // Then, we need to retrieve the normalized thickness of the edge in the WebGL\n  // referential (in a ([0, 1], [0, 1]) space), using our "magic" correction\n  // ratio:\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n\n  // Finally, we adapt the edge thickness to the "SQRT rule" in sigma (so that\n  // items are not too big when zoomed in, and not too small when zoomed out).\n  // The exact computation should be `adapted = value * zoom / sqrt(zoom)`, but\n  // it\'s simpler like this:\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(a_position + unitNormal * adaptedWebGLThickness, 1)).xy, 0, 1);\n\n  // For the fragment shader though, we need a thickness that takes the "magic"\n  // correction ratio into account (as in webGLThickness), but so that the\n  // antialiasint effect does not depend on the zoom level. So here\'s yet\n  // another thickness version:\n  v_thickness = webGLThickness / u_sqrtZoomRatio;\n\n  v_normal = unitNormal;\n  v_color = a_color;\n  v_color.a *= bias;\n}\n';module.exports=n})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/node.fast.frag.glsl.js":
/*!***************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/node.fast.frag.glsl.js ***!
  \***************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var e={d:(n,o)=>{for(var t in o)e.o(o,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:o[t]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>o});const o="precision mediump float;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float radius = 0.5;\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  vec2 m = gl_PointCoord - vec2(0.5, 0.5);\n  float dist = radius - length(m);\n\n  float t = 0.0;\n  if (dist > v_border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / v_border;\n\n  gl_FragColor = mix(transparent, v_color, t);\n}\n";module.exports=n})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/node.fast.vert.glsl.js":
/*!***************************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/node.fast.vert.glsl.js ***!
  \***************************************************************************/
/***/ ((module) => {

(()=>{"use strict";var o={d:(t,e)=>{for(var n in e)o.o(e,n)&&!o.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},o:(o,t)=>Object.prototype.hasOwnProperty.call(o,t),r:o=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})}},t={};o.r(t),o.d(t,{default:()=>e});const e="attribute vec2 a_position;\nattribute float a_size;\nattribute vec4 a_color;\n\nuniform float u_ratio;\nuniform float u_scale;\nuniform mat3 u_matrix;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  gl_Position = vec4(\n    (u_matrix * vec3(a_position, 1)).xy,\n    0,\n    1\n  );\n\n  // Multiply the point size twice:\n  //  - x SCALING_RATIO to correct the canvas scaling\n  //  - x 2 to correct the formulae\n  gl_PointSize = a_size * u_ratio * u_scale * 2.0;\n\n  v_border = (1.0 / u_ratio) * (0.5 / a_size);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=t})();

/***/ }),

/***/ "./node_modules/sigma/rendering/webgl/shaders/utils.js":
/*!*************************************************************!*\
  !*** ./node_modules/sigma/rendering/webgl/shaders/utils.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Sigma.js Shader Utils
 * ======================
 *
 * Code used to load sigma's shaders.
 * @module
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.loadProgram = exports.loadFragmentShader = exports.loadVertexShader = void 0;
/**
 * Function used to load a shader.
 */
function loadShader(type, gl, source) {
    var glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    // Creating the shader
    var shader = gl.createShader(glType);
    if (shader === null) {
        throw new Error("loadShader: error while creating the shader");
    }
    // Loading source
    gl.shaderSource(shader, source);
    // Compiling the shader
    gl.compileShader(shader);
    // Retrieving compilation status
    var successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    // Throwing if something went awry
    if (!successfullyCompiled) {
        var infoLog = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("loadShader: error while compiling the shader:\n".concat(infoLog, "\n").concat(source));
    }
    return shader;
}
function loadVertexShader(gl, source) {
    return loadShader("VERTEX", gl, source);
}
exports.loadVertexShader = loadVertexShader;
function loadFragmentShader(gl, source) {
    return loadShader("FRAGMENT", gl, source);
}
exports.loadFragmentShader = loadFragmentShader;
/**
 * Function used to load a program.
 */
function loadProgram(gl, shaders) {
    var program = gl.createProgram();
    if (program === null) {
        throw new Error("loadProgram: error while creating the program.");
    }
    var i, l;
    // Attaching the shaders
    for (i = 0, l = shaders.length; i < l; i++)
        gl.attachShader(program, shaders[i]);
    gl.linkProgram(program);
    // Checking status
    var successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!successfullyLinked) {
        gl.deleteProgram(program);
        throw new Error("loadProgram: error while linking the program.");
    }
    return program;
}
exports.loadProgram = loadProgram;


/***/ }),

/***/ "./node_modules/sigma/settings.js":
/*!****************************************!*\
  !*** ./node_modules/sigma/settings.js ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

/**
 * Sigma.js Settings
 * =================================
 *
 * The list of settings and some handy functions.
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DEFAULT_SETTINGS = exports.validateSettings = void 0;
var label_1 = __importDefault(__webpack_require__(/*! ./rendering/canvas/label */ "./node_modules/sigma/rendering/canvas/label.js"));
var hover_1 = __importDefault(__webpack_require__(/*! ./rendering/canvas/hover */ "./node_modules/sigma/rendering/canvas/hover.js"));
var edge_label_1 = __importDefault(__webpack_require__(/*! ./rendering/canvas/edge-label */ "./node_modules/sigma/rendering/canvas/edge-label.js"));
var node_fast_1 = __importDefault(__webpack_require__(/*! ./rendering/webgl/programs/node.fast */ "./node_modules/sigma/rendering/webgl/programs/node.fast.js"));
var edge_1 = __importDefault(__webpack_require__(/*! ./rendering/webgl/programs/edge */ "./node_modules/sigma/rendering/webgl/programs/edge.js"));
var edge_arrow_1 = __importDefault(__webpack_require__(/*! ./rendering/webgl/programs/edge.arrow */ "./node_modules/sigma/rendering/webgl/programs/edge.arrow.js"));
function validateSettings(settings) {
    if (typeof settings.labelDensity !== "number" || settings.labelDensity < 0) {
        throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");
    }
    var minCameraRatio = settings.minCameraRatio, maxCameraRatio = settings.maxCameraRatio;
    if (typeof minCameraRatio === "number" && typeof maxCameraRatio === "number" && maxCameraRatio < minCameraRatio) {
        throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.");
    }
}
exports.validateSettings = validateSettings;
exports.DEFAULT_SETTINGS = {
    // Performance
    hideEdgesOnMove: false,
    hideLabelsOnMove: false,
    renderLabels: true,
    renderEdgeLabels: false,
    enableEdgeClickEvents: false,
    enableEdgeWheelEvents: false,
    enableEdgeHoverEvents: false,
    // Component rendering
    defaultNodeColor: "#999",
    defaultNodeType: "circle",
    defaultEdgeColor: "#ccc",
    defaultEdgeType: "line",
    labelFont: "Arial",
    labelSize: 14,
    labelWeight: "normal",
    labelColor: { color: "#000" },
    edgeLabelFont: "Arial",
    edgeLabelSize: 14,
    edgeLabelWeight: "normal",
    edgeLabelColor: { attribute: "color" },
    stagePadding: 30,
    // Labels
    labelDensity: 1,
    labelGridCellSize: 100,
    labelRenderedSizeThreshold: 6,
    // Reducers
    nodeReducer: null,
    edgeReducer: null,
    // Features
    zIndex: false,
    minCameraRatio: null,
    maxCameraRatio: null,
    // Renderers
    labelRenderer: label_1.default,
    hoverRenderer: hover_1.default,
    edgeLabelRenderer: edge_label_1.default,
    // Lifecycle
    allowInvalidContainer: false,
    // Program classes
    nodeProgramClasses: {
        circle: node_fast_1.default,
    },
    edgeProgramClasses: {
        arrow: edge_arrow_1.default,
        line: edge_1.default,
    },
};


/***/ }),

/***/ "./node_modules/sigma/sigma.js":
/*!*************************************!*\
  !*** ./node_modules/sigma/sigma.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var camera_1 = __importDefault(__webpack_require__(/*! ./core/camera */ "./node_modules/sigma/core/camera.js"));
var mouse_1 = __importDefault(__webpack_require__(/*! ./core/captors/mouse */ "./node_modules/sigma/core/captors/mouse.js"));
var quadtree_1 = __importDefault(__webpack_require__(/*! ./core/quadtree */ "./node_modules/sigma/core/quadtree.js"));
var types_1 = __webpack_require__(/*! ./types */ "./node_modules/sigma/types.js");
var utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/sigma/utils/index.js");
var labels_1 = __webpack_require__(/*! ./core/labels */ "./node_modules/sigma/core/labels.js");
var settings_1 = __webpack_require__(/*! ./settings */ "./node_modules/sigma/settings.js");
var touch_1 = __importDefault(__webpack_require__(/*! ./core/captors/touch */ "./node_modules/sigma/core/captors/touch.js"));
var matrices_1 = __webpack_require__(/*! ./utils/matrices */ "./node_modules/sigma/utils/matrices.js");
var edge_collisions_1 = __webpack_require__(/*! ./utils/edge-collisions */ "./node_modules/sigma/utils/edge-collisions.js");
/**
 * Important functions.
 */
function applyNodeDefaults(settings, key, data) {
    if (!data.hasOwnProperty("x") || !data.hasOwnProperty("y"))
        throw new Error("Sigma: could not find a valid position (x, y) for node \"".concat(key, "\". All your nodes must have a number \"x\" and \"y\". Maybe your forgot to apply a layout or your \"nodeReducer\" is not returning the correct data?"));
    if (!data.color)
        data.color = settings.defaultNodeColor;
    if (!data.label && data.label !== "")
        data.label = null;
    if (data.label !== undefined && data.label !== null)
        data.label = "" + data.label;
    else
        data.label = null;
    if (!data.size)
        data.size = 2;
    if (!data.hasOwnProperty("hidden"))
        data.hidden = false;
    if (!data.hasOwnProperty("highlighted"))
        data.highlighted = false;
    if (!data.hasOwnProperty("forceLabel"))
        data.forceLabel = false;
    if (!data.type || data.type === "")
        data.type = settings.defaultNodeType;
    if (!data.zIndex)
        data.zIndex = 0;
    return data;
}
function applyEdgeDefaults(settings, key, data) {
    if (!data.color)
        data.color = settings.defaultEdgeColor;
    if (!data.label)
        data.label = "";
    if (!data.size)
        data.size = 0.5;
    if (!data.hasOwnProperty("hidden"))
        data.hidden = false;
    if (!data.hasOwnProperty("forceLabel"))
        data.forceLabel = false;
    if (!data.type || data.type === "")
        data.type = settings.defaultEdgeType;
    if (!data.zIndex)
        data.zIndex = 0;
    return data;
}
/**
 * Main class.
 *
 * @constructor
 * @param {Graph}       graph     - Graph to render.
 * @param {HTMLElement} container - DOM container in which to render.
 * @param {object}      settings  - Optional settings.
 */
var Sigma = /** @class */ (function (_super) {
    __extends(Sigma, _super);
    function Sigma(graph, container, settings) {
        if (settings === void 0) { settings = {}; }
        var _this = _super.call(this) || this;
        _this.elements = {};
        _this.canvasContexts = {};
        _this.webGLContexts = {};
        _this.activeListeners = {};
        _this.quadtree = new quadtree_1.default();
        _this.labelGrid = new labels_1.LabelGrid();
        _this.nodeDataCache = {};
        _this.edgeDataCache = {};
        _this.nodesWithForcedLabels = [];
        _this.edgesWithForcedLabels = [];
        _this.nodeExtent = { x: [0, 1], y: [0, 1] };
        _this.matrix = (0, matrices_1.identity)();
        _this.invMatrix = (0, matrices_1.identity)();
        _this.correctionRatio = 1;
        _this.customBBox = null;
        _this.normalizationFunction = (0, utils_1.createNormalizationFunction)({
            x: [0, 1],
            y: [0, 1],
        });
        // Cache:
        _this.cameraSizeRatio = 1;
        // Starting dimensions and pixel ratio
        _this.width = 0;
        _this.height = 0;
        _this.pixelRatio = (0, utils_1.getPixelRatio)();
        // State
        _this.displayedLabels = new Set();
        _this.highlightedNodes = new Set();
        _this.hoveredNode = null;
        _this.hoveredEdge = null;
        _this.renderFrame = null;
        _this.renderHighlightedNodesFrame = null;
        _this.needToProcess = false;
        _this.needToSoftProcess = false;
        _this.checkEdgesEventsFrame = null;
        // Programs
        _this.nodePrograms = {};
        _this.hoverNodePrograms = {};
        _this.edgePrograms = {};
        _this.settings = (0, utils_1.assign)({}, settings_1.DEFAULT_SETTINGS, settings);
        // Validating
        (0, settings_1.validateSettings)(_this.settings);
        (0, utils_1.validateGraph)(graph);
        if (!(container instanceof HTMLElement))
            throw new Error("Sigma: container should be an html element.");
        // Properties
        _this.graph = graph;
        _this.container = container;
        // Initializing contexts
        _this.createWebGLContext("edges", { preserveDrawingBuffer: true });
        _this.createCanvasContext("edgeLabels");
        _this.createWebGLContext("nodes");
        _this.createCanvasContext("labels");
        _this.createCanvasContext("hovers");
        _this.createWebGLContext("hoverNodes");
        _this.createCanvasContext("mouse");
        // Blending
        for (var key in _this.webGLContexts) {
            var gl = _this.webGLContexts[key];
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
        }
        // Loading programs
        for (var type in _this.settings.nodeProgramClasses) {
            var NodeProgramClass = _this.settings.nodeProgramClasses[type];
            _this.nodePrograms[type] = new NodeProgramClass(_this.webGLContexts.nodes, _this);
            _this.hoverNodePrograms[type] = new NodeProgramClass(_this.webGLContexts.hoverNodes, _this);
        }
        for (var type in _this.settings.edgeProgramClasses) {
            var EdgeProgramClass = _this.settings.edgeProgramClasses[type];
            _this.edgePrograms[type] = new EdgeProgramClass(_this.webGLContexts.edges, _this);
        }
        // Initial resize
        _this.resize();
        // Initializing the camera
        _this.camera = new camera_1.default();
        // Binding camera events
        _this.bindCameraHandlers();
        // Initializing captors
        _this.mouseCaptor = new mouse_1.default(_this.elements.mouse, _this);
        _this.touchCaptor = new touch_1.default(_this.elements.mouse, _this);
        // Binding event handlers
        _this.bindEventHandlers();
        // Binding graph handlers
        _this.bindGraphHandlers();
        // Trigger eventual settings-related things
        _this.handleSettingsUpdate();
        // Processing data for the first time & render
        _this.process();
        _this.render();
        return _this;
    }
    /**---------------------------------------------------------------------------
     * Internal methods.
     **---------------------------------------------------------------------------
     */
    /**
     * Internal function used to create a canvas element.
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createCanvas = function (id) {
        var canvas = (0, utils_1.createElement)("canvas", {
            position: "absolute",
        }, {
            class: "sigma-".concat(id),
        });
        this.elements[id] = canvas;
        this.container.appendChild(canvas);
        return canvas;
    };
    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createCanvasContext = function (id) {
        var canvas = this.createCanvas(id);
        var contextOptions = {
            preserveDrawingBuffer: false,
            antialias: false,
        };
        this.canvasContexts[id] = canvas.getContext("2d", contextOptions);
        return this;
    };
    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string}  id      - Context's id.
     * @param  {object?} options - #getContext params to override (optional)
     * @return {Sigma}
     */
    Sigma.prototype.createWebGLContext = function (id, options) {
        var canvas = this.createCanvas(id);
        var contextOptions = __assign({ preserveDrawingBuffer: false, antialias: false }, (options || {}));
        var context;
        // First we try webgl2 for an easy performance boost
        context = canvas.getContext("webgl2", contextOptions);
        // Else we fall back to webgl
        if (!context)
            context = canvas.getContext("webgl", contextOptions);
        // Edge, I am looking right at you...
        if (!context)
            context = canvas.getContext("experimental-webgl", contextOptions);
        this.webGLContexts[id] = context;
        return this;
    };
    /**
     * Method binding camera handlers.
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindCameraHandlers = function () {
        var _this = this;
        this.activeListeners.camera = function () {
            _this._scheduleRefresh();
        };
        this.camera.on("updated", this.activeListeners.camera);
        return this;
    };
    /**
     * Method that checks whether or not a node collides with a given position.
     */
    Sigma.prototype.mouseIsOnNode = function (_a, _b, size) {
        var x = _a.x, y = _a.y;
        var nodeX = _b.x, nodeY = _b.y;
        return (x > nodeX - size &&
            x < nodeX + size &&
            y > nodeY - size &&
            y < nodeY + size &&
            Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)) < size);
    };
    /**
     * Method that returns all nodes in quad at a given position.
     */
    Sigma.prototype.getQuadNodes = function (position) {
        var mouseGraphPosition = this.viewportToFramedGraph(position);
        return this.quadtree.point(mouseGraphPosition.x, 1 - mouseGraphPosition.y);
    };
    /**
     * Method that returns the closest node to a given position.
     */
    Sigma.prototype.getNodeAtPosition = function (position) {
        var x = position.x, y = position.y;
        var quadNodes = this.getQuadNodes(position);
        // We will hover the node whose center is closest to mouse
        var minDistance = Infinity, nodeAtPosition = null;
        for (var i = 0, l = quadNodes.length; i < l; i++) {
            var node = quadNodes[i];
            var data = this.nodeDataCache[node];
            var nodePosition = this.framedGraphToViewport(data);
            var size = this.scaleSize(data.size);
            if (!data.hidden && this.mouseIsOnNode(position, nodePosition, size)) {
                var distance = Math.sqrt(Math.pow(x - nodePosition.x, 2) + Math.pow(y - nodePosition.y, 2));
                // TODO: sort by min size also for cases where center is the same
                if (distance < minDistance) {
                    minDistance = distance;
                    nodeAtPosition = node;
                }
            }
        }
        return nodeAtPosition;
    };
    /**
     * Method binding event handlers.
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindEventHandlers = function () {
        var _this = this;
        // Handling window resize
        this.activeListeners.handleResize = function () {
            _this.needToSoftProcess = true;
            _this._scheduleRefresh();
        };
        window.addEventListener("resize", this.activeListeners.handleResize);
        // Handling mouse move
        this.activeListeners.handleMove = function (e) {
            var baseEvent = {
                event: e,
                preventSigmaDefault: function () {
                    e.preventSigmaDefault();
                },
            };
            var nodeToHover = _this.getNodeAtPosition(e);
            if (nodeToHover && _this.hoveredNode !== nodeToHover && !_this.nodeDataCache[nodeToHover].hidden) {
                // Handling passing from one node to the other directly
                if (_this.hoveredNode)
                    _this.emit("leaveNode", __assign(__assign({}, baseEvent), { node: _this.hoveredNode }));
                _this.hoveredNode = nodeToHover;
                _this.emit("enterNode", __assign(__assign({}, baseEvent), { node: nodeToHover }));
                _this.scheduleHighlightedNodesRender();
                return;
            }
            // Checking if the hovered node is still hovered
            if (_this.hoveredNode) {
                var data = _this.nodeDataCache[_this.hoveredNode];
                var pos = _this.framedGraphToViewport(data);
                var size = _this.scaleSize(data.size);
                if (!_this.mouseIsOnNode(e, pos, size)) {
                    var node = _this.hoveredNode;
                    _this.hoveredNode = null;
                    _this.emit("leaveNode", __assign(__assign({}, baseEvent), { node: node }));
                    _this.scheduleHighlightedNodesRender();
                    return;
                }
            }
            if (_this.settings.enableEdgeHoverEvents === true) {
                _this.checkEdgeHoverEvents(baseEvent);
            }
            else if (_this.settings.enableEdgeHoverEvents === "debounce") {
                if (!_this.checkEdgesEventsFrame)
                    _this.checkEdgesEventsFrame = (0, utils_1.requestFrame)(function () {
                        _this.checkEdgeHoverEvents(baseEvent);
                        _this.checkEdgesEventsFrame = null;
                    });
            }
        };
        // Handling click
        var createMouseListener = function (eventType) {
            return function (e) {
                var baseEvent = {
                    event: e,
                    preventSigmaDefault: function () {
                        e.preventSigmaDefault();
                    },
                };
                var isFakeSigmaMouseEvent = e.original.isFakeSigmaMouseEvent;
                var nodeAtPosition = isFakeSigmaMouseEvent ? _this.getNodeAtPosition(e) : _this.hoveredNode;
                if (nodeAtPosition)
                    return _this.emit("".concat(eventType, "Node"), __assign(__assign({}, baseEvent), { node: nodeAtPosition }));
                if (eventType === "wheel" ? _this.settings.enableEdgeWheelEvents : _this.settings.enableEdgeClickEvents) {
                    var edge = _this.getEdgeAtPoint(e.x, e.y);
                    if (edge)
                        return _this.emit("".concat(eventType, "Edge"), __assign(__assign({}, baseEvent), { edge: edge }));
                }
                return _this.emit("".concat(eventType, "Stage"), baseEvent);
            };
        };
        this.activeListeners.handleClick = createMouseListener("click");
        this.activeListeners.handleRightClick = createMouseListener("rightClick");
        this.activeListeners.handleDoubleClick = createMouseListener("doubleClick");
        this.activeListeners.handleWheel = createMouseListener("wheel");
        this.activeListeners.handleDown = createMouseListener("down");
        this.mouseCaptor.on("mousemove", this.activeListeners.handleMove);
        this.mouseCaptor.on("click", this.activeListeners.handleClick);
        this.mouseCaptor.on("rightClick", this.activeListeners.handleRightClick);
        this.mouseCaptor.on("doubleClick", this.activeListeners.handleDoubleClick);
        this.mouseCaptor.on("wheel", this.activeListeners.handleWheel);
        this.mouseCaptor.on("mousedown", this.activeListeners.handleDown);
        // TODO
        // Deal with Touch captor events
        return this;
    };
    /**
     * Method binding graph handlers
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindGraphHandlers = function () {
        var _this = this;
        var graph = this.graph;
        this.activeListeners.graphUpdate = function () {
            _this.needToProcess = true;
            _this._scheduleRefresh();
        };
        this.activeListeners.softGraphUpdate = function () {
            _this.needToSoftProcess = true;
            _this._scheduleRefresh();
        };
        this.activeListeners.dropNodeGraphUpdate = function (e) {
            delete _this.nodeDataCache[e.key];
            if (_this.hoveredNode === e.key)
                _this.hoveredNode = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.dropEdgeGraphUpdate = function (e) {
            delete _this.edgeDataCache[e.key];
            if (_this.hoveredEdge === e.key)
                _this.hoveredEdge = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.clearEdgesGraphUpdate = function () {
            _this.edgeDataCache = {};
            _this.hoveredEdge = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.clearGraphUpdate = function () {
            _this.nodeDataCache = {};
            _this.hoveredNode = null;
            _this.activeListeners.clearEdgesGraphUpdate();
        };
        graph.on("nodeAdded", this.activeListeners.graphUpdate);
        graph.on("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
        graph.on("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.on("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.on("edgeAdded", this.activeListeners.graphUpdate);
        graph.on("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
        graph.on("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.on("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.on("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
        graph.on("cleared", this.activeListeners.clearGraphUpdate);
        return this;
    };
    /**
     * Method dealing with "leaveEdge" and "enterEdge" events.
     *
     * @return {Sigma}
     */
    Sigma.prototype.checkEdgeHoverEvents = function (payload) {
        var edgeToHover = this.hoveredNode ? null : this.getEdgeAtPoint(payload.event.x, payload.event.y);
        if (edgeToHover !== this.hoveredEdge) {
            if (this.hoveredEdge)
                this.emit("leaveEdge", __assign(__assign({}, payload), { edge: this.hoveredEdge }));
            if (edgeToHover)
                this.emit("enterEdge", __assign(__assign({}, payload), { edge: edgeToHover }));
            this.hoveredEdge = edgeToHover;
        }
        return this;
    };
    /**
     * Method looking for an edge colliding with a given point at (x, y). Returns
     * the key of the edge if any, or null else.
     */
    Sigma.prototype.getEdgeAtPoint = function (x, y) {
        var e_1, _a;
        var _this = this;
        var _b = this, edgeDataCache = _b.edgeDataCache, nodeDataCache = _b.nodeDataCache;
        // Check first that pixel is colored:
        // Note that mouse positions must be corrected by pixel ratio to correctly
        // index the drawing buffer.
        if (!(0, edge_collisions_1.isPixelColored)(this.webGLContexts.edges, x * this.pixelRatio, y * this.pixelRatio))
            return null;
        // Check for each edge if it collides with the point:
        var _c = this.viewportToGraph({ x: x, y: y }), graphX = _c.x, graphY = _c.y;
        // To translate edge thicknesses to the graph system, we observe by how much
        // the length of a non-null edge is transformed to between the graph system
        // and the viewport system:
        var transformationRatio = 0;
        this.graph.someEdge(function (key, _, sourceId, targetId, _a, _b) {
            var xs = _a.x, ys = _a.y;
            var xt = _b.x, yt = _b.y;
            if (edgeDataCache[key].hidden || nodeDataCache[sourceId].hidden || nodeDataCache[targetId].hidden)
                return false;
            if (xs !== xt || ys !== yt) {
                var graphLength = Math.sqrt(Math.pow(xt - xs, 2) + Math.pow(yt - ys, 2));
                var _c = _this.graphToViewport({ x: xs, y: ys }), vp_xs = _c.x, vp_ys = _c.y;
                var _d = _this.graphToViewport({ x: xt, y: yt }), vp_xt = _d.x, vp_yt = _d.y;
                var viewportLength = Math.sqrt(Math.pow(vp_xt - vp_xs, 2) + Math.pow(vp_yt - vp_ys, 2));
                transformationRatio = graphLength / viewportLength;
                return true;
            }
        });
        // If no non-null edge has been found, return null:
        if (!transformationRatio)
            return null;
        // Now we can look for matching edges:
        var edges = this.graph.filterEdges(function (key, edgeAttributes, sourceId, targetId, sourcePosition, targetPosition) {
            if (edgeDataCache[key].hidden || nodeDataCache[sourceId].hidden || nodeDataCache[targetId].hidden)
                return false;
            if ((0, edge_collisions_1.doEdgeCollideWithPoint)(graphX, graphY, sourcePosition.x, sourcePosition.y, targetPosition.x, targetPosition.y, 
            // Adapt the edge size to the zoom ratio:
            (edgeDataCache[key].size * transformationRatio) / _this.cameraSizeRatio)) {
                return true;
            }
        });
        if (edges.length === 0)
            return null; // no edges found
        // if none of the edges have a zIndex, selected the most recently created one to match the rendering order
        var selectedEdge = edges[edges.length - 1];
        // otherwise select edge with highest zIndex
        var highestZIndex = -Infinity;
        try {
            for (var edges_1 = __values(edges), edges_1_1 = edges_1.next(); !edges_1_1.done; edges_1_1 = edges_1.next()) {
                var edge = edges_1_1.value;
                var zIndex = this.graph.getEdgeAttribute(edge, "zIndex");
                if (zIndex >= highestZIndex) {
                    selectedEdge = edge;
                    highestZIndex = zIndex;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (edges_1_1 && !edges_1_1.done && (_a = edges_1.return)) _a.call(edges_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return selectedEdge;
    };
    /**
     * Method used to process the whole graph's data.
     *
     * @return {Sigma}
     */
    Sigma.prototype.process = function (keepArrays) {
        var _this = this;
        if (keepArrays === void 0) { keepArrays = false; }
        var graph = this.graph;
        var settings = this.settings;
        var dimensions = this.getDimensions();
        var nodeZExtent = [Infinity, -Infinity];
        var edgeZExtent = [Infinity, -Infinity];
        // Clearing the quad
        this.quadtree.clear();
        // Resetting the label grid
        // TODO: it's probably better to do this explicitly or on resizes for layout and anims
        this.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);
        // Clear the highlightedNodes
        this.highlightedNodes = new Set();
        // Computing extents
        this.nodeExtent = (0, utils_1.graphExtent)(graph);
        // Resetting `forceLabel` indices
        this.nodesWithForcedLabels = [];
        this.edgesWithForcedLabels = [];
        // NOTE: it is important to compute this matrix after computing the node's extent
        // because #.getGraphDimensions relies on it
        var nullCamera = new camera_1.default();
        var nullCameraMatrix = (0, utils_1.matrixFromCamera)(nullCamera.getState(), this.getDimensions(), this.getGraphDimensions(), this.getSetting("stagePadding") || 0);
        // Rescaling function
        this.normalizationFunction = (0, utils_1.createNormalizationFunction)(this.customBBox || this.nodeExtent);
        var nodesPerPrograms = {};
        var nodes = graph.nodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            // Node display data resolution:
            //   1. First we get the node's attributes
            //   2. We optionally reduce them using the function provided by the user
            //      Note that this function must return a total object and won't be merged
            //   3. We apply our defaults, while running some vital checks
            //   4. We apply the normalization function
            // We shallow copy node data to avoid dangerous behaviors from reducers
            var attr = Object.assign({}, graph.getNodeAttributes(node));
            if (settings.nodeReducer)
                attr = settings.nodeReducer(node, attr);
            var data = applyNodeDefaults(this.settings, node, attr);
            nodesPerPrograms[data.type] = (nodesPerPrograms[data.type] || 0) + 1;
            this.nodeDataCache[node] = data;
            this.normalizationFunction.applyTo(data);
            if (data.forceLabel)
                this.nodesWithForcedLabels.push(node);
            if (this.settings.zIndex) {
                if (data.zIndex < nodeZExtent[0])
                    nodeZExtent[0] = data.zIndex;
                if (data.zIndex > nodeZExtent[1])
                    nodeZExtent[1] = data.zIndex;
            }
        }
        for (var type in this.nodePrograms) {
            if (!this.nodePrograms.hasOwnProperty(type)) {
                throw new Error("Sigma: could not find a suitable program for node type \"".concat(type, "\"!"));
            }
            if (!keepArrays)
                this.nodePrograms[type].allocate(nodesPerPrograms[type] || 0);
            // We reset that count here, so that we can reuse it while calling the Program#process methods:
            nodesPerPrograms[type] = 0;
        }
        // Handling node z-index
        // TODO: z-index needs us to compute display data before hand
        if (this.settings.zIndex && nodeZExtent[0] !== nodeZExtent[1])
            nodes = (0, utils_1.zIndexOrdering)(nodeZExtent, function (node) { return _this.nodeDataCache[node].zIndex; }, nodes);
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            var data = this.nodeDataCache[node];
            this.quadtree.add(node, data.x, 1 - data.y, data.size / this.width);
            if (typeof data.label === "string" && !data.hidden)
                this.labelGrid.add(node, data.size, this.framedGraphToViewport(data, { matrix: nullCameraMatrix }));
            var nodeProgram = this.nodePrograms[data.type];
            if (!nodeProgram)
                throw new Error("Sigma: could not find a suitable program for node type \"".concat(data.type, "\"!"));
            nodeProgram.process(data, data.hidden, nodesPerPrograms[data.type]++);
            // Save the node in the highlighted set if needed
            if (data.highlighted && !data.hidden)
                this.highlightedNodes.add(node);
        }
        this.labelGrid.organize();
        var edgesPerPrograms = {};
        var edges = graph.edges();
        for (var i = 0, l = edges.length; i < l; i++) {
            var edge = edges[i];
            // Edge display data resolution:
            //   1. First we get the edge's attributes
            //   2. We optionally reduce them using the function provided by the user
            //      Note that this function must return a total object and won't be merged
            //   3. We apply our defaults, while running some vital checks
            // We shallow copy edge data to avoid dangerous behaviors from reducers
            var attr = Object.assign({}, graph.getEdgeAttributes(edge));
            if (settings.edgeReducer)
                attr = settings.edgeReducer(edge, attr);
            var data = applyEdgeDefaults(this.settings, edge, attr);
            edgesPerPrograms[data.type] = (edgesPerPrograms[data.type] || 0) + 1;
            this.edgeDataCache[edge] = data;
            if (data.forceLabel && !data.hidden)
                this.edgesWithForcedLabels.push(edge);
            if (this.settings.zIndex) {
                if (data.zIndex < edgeZExtent[0])
                    edgeZExtent[0] = data.zIndex;
                if (data.zIndex > edgeZExtent[1])
                    edgeZExtent[1] = data.zIndex;
            }
        }
        for (var type in this.edgePrograms) {
            if (!this.edgePrograms.hasOwnProperty(type)) {
                throw new Error("Sigma: could not find a suitable program for edge type \"".concat(type, "\"!"));
            }
            if (!keepArrays)
                this.edgePrograms[type].allocate(edgesPerPrograms[type] || 0);
            // We reset that count here, so that we can reuse it while calling the Program#process methods:
            edgesPerPrograms[type] = 0;
        }
        // Handling edge z-index
        if (this.settings.zIndex && edgeZExtent[0] !== edgeZExtent[1])
            edges = (0, utils_1.zIndexOrdering)(edgeZExtent, function (edge) { return _this.edgeDataCache[edge].zIndex; }, edges);
        for (var i = 0, l = edges.length; i < l; i++) {
            var edge = edges[i];
            var data = this.edgeDataCache[edge];
            var extremities = graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]];
            var hidden = data.hidden || sourceData.hidden || targetData.hidden;
            this.edgePrograms[data.type].process(sourceData, targetData, data, hidden, edgesPerPrograms[data.type]++);
        }
        for (var type in this.edgePrograms) {
            var program = this.edgePrograms[type];
            if (!keepArrays && typeof program.computeIndices === "function")
                program.computeIndices();
        }
        return this;
    };
    /**
     * Method that backports potential settings updates where it's needed.
     * @private
     */
    Sigma.prototype.handleSettingsUpdate = function () {
        this.camera.minRatio = this.settings.minCameraRatio;
        this.camera.maxRatio = this.settings.maxCameraRatio;
        this.camera.setState(this.camera.validateState(this.camera.getState()));
        return this;
    };
    /**
     * Method that decides whether to reprocess graph or not, and then render the
     * graph.
     *
     * @return {Sigma}
     */
    Sigma.prototype._refresh = function () {
        // Do we need to process data?
        if (this.needToProcess) {
            this.process();
        }
        else if (this.needToSoftProcess) {
            this.process(true);
        }
        // Resetting state
        this.needToProcess = false;
        this.needToSoftProcess = false;
        // Rendering
        this.render();
        return this;
    };
    /**
     * Method that schedules a `_refresh` call if none has been scheduled yet. It
     * will then be processed next available frame.
     *
     * @return {Sigma}
     */
    Sigma.prototype._scheduleRefresh = function () {
        var _this = this;
        if (!this.renderFrame) {
            this.renderFrame = (0, utils_1.requestFrame)(function () {
                _this._refresh();
                _this.renderFrame = null;
            });
        }
        return this;
    };
    /**
     * Method used to render labels.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderLabels = function () {
        if (!this.settings.renderLabels)
            return this;
        var cameraState = this.camera.getState();
        // Finding visible nodes to display their labels
        var visibleNodes;
        if (cameraState.ratio >= 1) {
            // Camera is unzoomed so no need to ask the quadtree for visible nodes
            visibleNodes = new Set(this.graph.nodes());
        }
        else {
            // Let's ask the quadtree
            var viewRectangle = this.viewRectangle();
            visibleNodes = new Set(this.quadtree.rectangle(viewRectangle.x1, 1 - viewRectangle.y1, viewRectangle.x2, 1 - viewRectangle.y2, viewRectangle.height));
        }
        // Selecting labels to draw
        // TODO: drop gridsettings likewise
        // TODO: optimize through visible nodes
        var labelsToDisplay = this.labelGrid
            .getLabelsToDisplay(cameraState.ratio, this.settings.labelDensity)
            .concat(this.nodesWithForcedLabels);
        this.displayedLabels = new Set();
        // Drawing labels
        var context = this.canvasContexts.labels;
        for (var i = 0, l = labelsToDisplay.length; i < l; i++) {
            var node = labelsToDisplay[i];
            var data = this.nodeDataCache[node];
            // If the node was already drawn (like if it is eligible AND has
            // `forceLabel`), we don't want to draw it again
            if (this.displayedLabels.has(node))
                continue;
            // If the node is hidden, we don't need to display its label obviously
            if (data.hidden)
                continue;
            var _a = this.framedGraphToViewport(data), x = _a.x, y = _a.y;
            // TODO: we can cache the labels we need to render until the camera's ratio changes
            // TODO: this should be computed in the canvas components?
            var size = this.scaleSize(data.size);
            if (!data.forceLabel && size < this.settings.labelRenderedSizeThreshold)
                continue;
            if (!visibleNodes.has(node))
                continue;
            // TODO:
            // Because displayed edge labels depend directly on actually rendered node
            // labels, we need to only add to this.displayedLabels nodes whose label
            // is rendered.
            // This makes this.displayedLabels depend on viewport, which might become
            // an issue once we start memoizing getLabelsToDisplay.
            this.displayedLabels.add(node);
            this.settings.labelRenderer(context, __assign(__assign({ key: node }, data), { size: size, x: x, y: y }), this.settings);
        }
        return this;
    };
    /**
     * Method used to render edge labels, based on which node labels were
     * rendered.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderEdgeLabels = function () {
        if (!this.settings.renderEdgeLabels)
            return this;
        var context = this.canvasContexts.edgeLabels;
        // Clearing
        context.clearRect(0, 0, this.width, this.height);
        var edgeLabelsToDisplay = (0, labels_1.edgeLabelsToDisplayFromNodes)({
            graph: this.graph,
            hoveredNode: this.hoveredNode,
            displayedNodeLabels: this.displayedLabels,
            highlightedNodes: this.highlightedNodes,
        }).concat(this.edgesWithForcedLabels);
        var displayedLabels = new Set();
        for (var i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
            var edge = edgeLabelsToDisplay[i], extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]], edgeData = this.edgeDataCache[edge];
            // If the edge was already drawn (like if it is eligible AND has
            // `forceLabel`), we don't want to draw it again
            if (displayedLabels.has(edge))
                continue;
            // If the edge is hidden we don't need to display its label
            // NOTE: the test on sourceData & targetData is probably paranoid at this point?
            if (edgeData.hidden || sourceData.hidden || targetData.hidden) {
                continue;
            }
            this.settings.edgeLabelRenderer(context, __assign(__assign({ key: edge }, edgeData), { size: this.scaleSize(edgeData.size) }), __assign(__assign(__assign({ key: extremities[0] }, sourceData), this.framedGraphToViewport(sourceData)), { size: this.scaleSize(sourceData.size) }), __assign(__assign(__assign({ key: extremities[1] }, targetData), this.framedGraphToViewport(targetData)), { size: this.scaleSize(targetData.size) }), this.settings);
            displayedLabels.add(edge);
        }
        return this;
    };
    /**
     * Method used to render the highlighted nodes.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderHighlightedNodes = function () {
        var _this = this;
        var context = this.canvasContexts.hovers;
        // Clearing
        context.clearRect(0, 0, this.width, this.height);
        // Rendering
        var render = function (node) {
            var data = _this.nodeDataCache[node];
            var _a = _this.framedGraphToViewport(data), x = _a.x, y = _a.y;
            var size = _this.scaleSize(data.size);
            _this.settings.hoverRenderer(context, __assign(__assign({ key: node }, data), { size: size, x: x, y: y }), _this.settings);
        };
        var nodesToRender = [];
        if (this.hoveredNode && !this.nodeDataCache[this.hoveredNode].hidden) {
            nodesToRender.push(this.hoveredNode);
        }
        this.highlightedNodes.forEach(function (node) {
            // The hovered node has already been highlighted
            if (node !== _this.hoveredNode)
                nodesToRender.push(node);
        });
        // Draw labels:
        nodesToRender.forEach(function (node) { return render(node); });
        // Draw WebGL nodes on top of the labels:
        var nodesPerPrograms = {};
        // 1. Count nodes per type:
        nodesToRender.forEach(function (node) {
            var type = _this.nodeDataCache[node].type;
            nodesPerPrograms[type] = (nodesPerPrograms[type] || 0) + 1;
        });
        // 2. Allocate for each type for the proper number of nodes
        for (var type in this.hoverNodePrograms) {
            this.hoverNodePrograms[type].allocate(nodesPerPrograms[type] || 0);
            // Also reset count, to use when rendering:
            nodesPerPrograms[type] = 0;
        }
        // 3. Process all nodes to render:
        nodesToRender.forEach(function (node) {
            var data = _this.nodeDataCache[node];
            _this.hoverNodePrograms[data.type].process(data, data.hidden, nodesPerPrograms[data.type]++);
        });
        // 4. Clear hovered nodes layer:
        this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
        // 5. Render:
        for (var type in this.hoverNodePrograms) {
            var program = this.hoverNodePrograms[type];
            program.bind();
            program.bufferData();
            program.render({
                matrix: this.matrix,
                width: this.width,
                height: this.height,
                ratio: this.camera.ratio,
                correctionRatio: this.correctionRatio / this.camera.ratio,
                scalingRatio: this.pixelRatio,
            });
        }
    };
    /**
     * Method used to schedule a hover render.
     *
     */
    Sigma.prototype.scheduleHighlightedNodesRender = function () {
        var _this = this;
        if (this.renderHighlightedNodesFrame || this.renderFrame)
            return;
        this.renderHighlightedNodesFrame = (0, utils_1.requestFrame)(function () {
            // Resetting state
            _this.renderHighlightedNodesFrame = null;
            // Rendering
            _this.renderHighlightedNodes();
            _this.renderEdgeLabels();
        });
    };
    /**
     * Method used to render.
     *
     * @return {Sigma}
     */
    Sigma.prototype.render = function () {
        var _this = this;
        this.emit("beforeRender");
        var handleEscape = function () {
            _this.emit("afterRender");
            return _this;
        };
        // If a render was scheduled, we cancel it
        if (this.renderFrame) {
            (0, utils_1.cancelFrame)(this.renderFrame);
            this.renderFrame = null;
            this.needToProcess = false;
            this.needToSoftProcess = false;
        }
        // First we need to resize
        this.resize();
        // Clearing the canvases
        this.clear();
        // Recomputing useful camera-related values:
        this.updateCachedValues();
        // If we have no nodes we can stop right there
        if (!this.graph.order)
            return handleEscape();
        // TODO: improve this heuristic or move to the captor itself?
        // TODO: deal with the touch captor here as well
        var mouseCaptor = this.mouseCaptor;
        var moving = this.camera.isAnimated() ||
            mouseCaptor.isMoving ||
            mouseCaptor.draggedEvents ||
            mouseCaptor.currentWheelDirection;
        // Then we need to extract a matrix from the camera
        var cameraState = this.camera.getState();
        var viewportDimensions = this.getDimensions();
        var graphDimensions = this.getGraphDimensions();
        var padding = this.getSetting("stagePadding") || 0;
        this.matrix = (0, utils_1.matrixFromCamera)(cameraState, viewportDimensions, graphDimensions, padding);
        this.invMatrix = (0, utils_1.matrixFromCamera)(cameraState, viewportDimensions, graphDimensions, padding, true);
        this.correctionRatio = (0, utils_1.getMatrixImpact)(this.matrix, cameraState, viewportDimensions);
        // Drawing nodes
        for (var type in this.nodePrograms) {
            var program = this.nodePrograms[type];
            program.bind();
            program.bufferData();
            program.render({
                matrix: this.matrix,
                width: this.width,
                height: this.height,
                ratio: cameraState.ratio,
                correctionRatio: this.correctionRatio / cameraState.ratio,
                scalingRatio: this.pixelRatio,
            });
        }
        // Drawing edges
        if (!this.settings.hideEdgesOnMove || !moving) {
            for (var type in this.edgePrograms) {
                var program = this.edgePrograms[type];
                program.bind();
                program.bufferData();
                program.render({
                    matrix: this.matrix,
                    width: this.width,
                    height: this.height,
                    ratio: cameraState.ratio,
                    correctionRatio: this.correctionRatio / cameraState.ratio,
                    scalingRatio: this.pixelRatio,
                });
            }
        }
        // Do not display labels on move per setting
        if (this.settings.hideLabelsOnMove && moving)
            return handleEscape();
        this.renderLabels();
        this.renderEdgeLabels();
        this.renderHighlightedNodes();
        return handleEscape();
    };
    /**
     * Internal method used to update expensive and therefore cached values
     * each time the camera state is updated.
     */
    Sigma.prototype.updateCachedValues = function () {
        var ratio = this.camera.getState().ratio;
        this.cameraSizeRatio = Math.sqrt(ratio);
    };
    /**---------------------------------------------------------------------------
     * Public API.
     **---------------------------------------------------------------------------
     */
    /**
     * Method returning the renderer's camera.
     *
     * @return {Camera}
     */
    Sigma.prototype.getCamera = function () {
        return this.camera;
    };
    /**
     * Method returning the container DOM element.
     *
     * @return {HTMLElement}
     */
    Sigma.prototype.getContainer = function () {
        return this.container;
    };
    /**
     * Method returning the renderer's graph.
     *
     * @return {Graph}
     */
    Sigma.prototype.getGraph = function () {
        return this.graph;
    };
    /**
     * Method returning the mouse captor.
     *
     * @return {MouseCaptor}
     */
    Sigma.prototype.getMouseCaptor = function () {
        return this.mouseCaptor;
    };
    /**
     * Method returning the touch captor.
     *
     * @return {TouchCaptor}
     */
    Sigma.prototype.getTouchCaptor = function () {
        return this.touchCaptor;
    };
    /**
     * Method returning the current renderer's dimensions.
     *
     * @return {Dimensions}
     */
    Sigma.prototype.getDimensions = function () {
        return { width: this.width, height: this.height };
    };
    /**
     * Method returning the current graph's dimensions.
     *
     * @return {Dimensions}
     */
    Sigma.prototype.getGraphDimensions = function () {
        var extent = this.customBBox || this.nodeExtent;
        return {
            width: extent.x[1] - extent.x[0] || 1,
            height: extent.y[1] - extent.y[0] || 1,
        };
    };
    /**
     * Method used to get all the sigma node attributes.
     * It's usefull for example to get the position of a node
     * and to get values that are set by the nodeReducer
     *
     * @param  {string} key - The node's key.
     * @return {NodeDisplayData | undefined} A copy of the desired node's attribute or undefined if not found
     */
    Sigma.prototype.getNodeDisplayData = function (key) {
        var node = this.nodeDataCache[key];
        return node ? Object.assign({}, node) : undefined;
    };
    /**
     * Method used to get all the sigma edge attributes.
     * It's usefull for example to get values that are set by the edgeReducer.
     *
     * @param  {string} key - The edge's key.
     * @return {EdgeDisplayData | undefined} A copy of the desired edge's attribute or undefined if not found
     */
    Sigma.prototype.getEdgeDisplayData = function (key) {
        var edge = this.edgeDataCache[key];
        return edge ? Object.assign({}, edge) : undefined;
    };
    /**
     * Method returning a copy of the settings collection.
     *
     * @return {Settings} A copy of the settings collection.
     */
    Sigma.prototype.getSettings = function () {
        return __assign({}, this.settings);
    };
    /**
     * Method returning the current value for a given setting key.
     *
     * @param  {string} key - The setting key to get.
     * @return {any} The value attached to this setting key or undefined if not found
     */
    Sigma.prototype.getSetting = function (key) {
        return this.settings[key];
    };
    /**
     * Method setting the value of a given setting key. Note that this will schedule
     * a new render next frame.
     *
     * @param  {string} key - The setting key to set.
     * @param  {any}    value - The value to set.
     * @return {Sigma}
     */
    Sigma.prototype.setSetting = function (key, value) {
        this.settings[key] = value;
        (0, settings_1.validateSettings)(this.settings);
        this.handleSettingsUpdate();
        this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method updating the value of a given setting key using the provided function.
     * Note that this will schedule a new render next frame.
     *
     * @param  {string}   key     - The setting key to set.
     * @param  {function} updater - The update function.
     * @return {Sigma}
     */
    Sigma.prototype.updateSetting = function (key, updater) {
        this.settings[key] = updater(this.settings[key]);
        (0, settings_1.validateSettings)(this.settings);
        this.handleSettingsUpdate();
        this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to resize the renderer.
     *
     * @return {Sigma}
     */
    Sigma.prototype.resize = function () {
        var previousWidth = this.width, previousHeight = this.height;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.pixelRatio = (0, utils_1.getPixelRatio)();
        if (this.width === 0) {
            if (this.settings.allowInvalidContainer)
                this.width = 1;
            else
                throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seeing this error.");
        }
        if (this.height === 0) {
            if (this.settings.allowInvalidContainer)
                this.height = 1;
            else
                throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seeing this error.");
        }
        // If nothing has changed, we can stop right here
        if (previousWidth === this.width && previousHeight === this.height)
            return this;
        this.emit("resize");
        // Sizing dom elements
        for (var id in this.elements) {
            var element = this.elements[id];
            element.style.width = this.width + "px";
            element.style.height = this.height + "px";
        }
        // Sizing canvas contexts
        for (var id in this.canvasContexts) {
            this.elements[id].setAttribute("width", this.width * this.pixelRatio + "px");
            this.elements[id].setAttribute("height", this.height * this.pixelRatio + "px");
            if (this.pixelRatio !== 1)
                this.canvasContexts[id].scale(this.pixelRatio, this.pixelRatio);
        }
        // Sizing WebGL contexts
        for (var id in this.webGLContexts) {
            this.elements[id].setAttribute("width", this.width * this.pixelRatio + "px");
            this.elements[id].setAttribute("height", this.height * this.pixelRatio + "px");
            this.webGLContexts[id].viewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
        }
        return this;
    };
    /**
     * Method used to clear all the canvases.
     *
     * @return {Sigma}
     */
    Sigma.prototype.clear = function () {
        this.webGLContexts.nodes.clear(this.webGLContexts.nodes.COLOR_BUFFER_BIT);
        this.webGLContexts.edges.clear(this.webGLContexts.edges.COLOR_BUFFER_BIT);
        this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
        this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);
        return this;
    };
    /**
     * Method used to refresh all computed data.
     *
     * @return {Sigma}
     */
    Sigma.prototype.refresh = function () {
        this.needToProcess = true;
        this._refresh();
        return this;
    };
    /**
     * Method used to refresh all computed data, at the next available frame.
     * If this method has already been called this frame, then it will only render once at the next available frame.
     *
     * @return {Sigma}
     */
    Sigma.prototype.scheduleRefresh = function () {
        this.needToProcess = true;
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to (un)zoom, while preserving the position of a viewport point.
     * Used for instance to zoom "on the mouse cursor".
     *
     * @param viewportTarget
     * @param newRatio
     * @return {CameraState}
     */
    Sigma.prototype.getViewportZoomedState = function (viewportTarget, newRatio) {
        var _a = this.camera.getState(), ratio = _a.ratio, angle = _a.angle, x = _a.x, y = _a.y;
        // TODO: handle max zoom
        var ratioDiff = newRatio / ratio;
        var center = {
            x: this.width / 2,
            y: this.height / 2,
        };
        var graphMousePosition = this.viewportToFramedGraph(viewportTarget);
        var graphCenterPosition = this.viewportToFramedGraph(center);
        return {
            angle: angle,
            x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + x,
            y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + y,
            ratio: newRatio,
        };
    };
    /**
     * Method returning the abstract rectangle containing the graph according
     * to the camera's state.
     *
     * @return {object} - The view's rectangle.
     */
    Sigma.prototype.viewRectangle = function () {
        // TODO: reduce relative margin?
        var marginX = (0 * this.width) / 8, marginY = (0 * this.height) / 8;
        var p1 = this.viewportToFramedGraph({ x: 0 - marginX, y: 0 - marginY }), p2 = this.viewportToFramedGraph({ x: this.width + marginX, y: 0 - marginY }), h = this.viewportToFramedGraph({ x: 0, y: this.height + marginY });
        return {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            height: p2.y - h.y,
        };
    };
    /**
     * Method returning the coordinates of a point from the framed graph system to the viewport system. It allows
     * overriding anything that is used to get the translation matrix, or even the matrix itself.
     *
     * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
     * of computations.
     */
    Sigma.prototype.framedGraphToViewport = function (coordinates, override) {
        if (override === void 0) { override = {}; }
        var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions;
        var matrix = override.matrix
            ? override.matrix
            : recomputeMatrix
                ? (0, utils_1.matrixFromCamera)(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getSetting("stagePadding") || 0)
                : this.matrix;
        var viewportPos = (0, matrices_1.multiplyVec2)(matrix, coordinates);
        return {
            x: ((1 + viewportPos.x) * this.width) / 2,
            y: ((1 - viewportPos.y) * this.height) / 2,
        };
    };
    /**
     * Method returning the coordinates of a point from the viewport system to the framed graph system. It allows
     * overriding anything that is used to get the translation matrix, or even the matrix itself.
     *
     * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
     * of computations.
     */
    Sigma.prototype.viewportToFramedGraph = function (coordinates, override) {
        if (override === void 0) { override = {}; }
        var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !override.graphDimensions;
        var invMatrix = override.matrix
            ? override.matrix
            : recomputeMatrix
                ? (0, utils_1.matrixFromCamera)(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getSetting("stagePadding") || 0, true)
                : this.invMatrix;
        var res = (0, matrices_1.multiplyVec2)(invMatrix, {
            x: (coordinates.x / this.width) * 2 - 1,
            y: 1 - (coordinates.y / this.height) * 2,
        });
        if (isNaN(res.x))
            res.x = 0;
        if (isNaN(res.y))
            res.y = 0;
        return res;
    };
    /**
     * Method used to translate a point's coordinates from the viewport system (pixel distance from the top-left of the
     * stage) to the graph system (the reference system of data as they are in the given graph instance).
     *
     * This method accepts an optional camera which can be useful if you need to translate coordinates
     * based on a different view than the one being currently being displayed on screen.
     *
     * @param {Coordinates}                  viewportPoint
     * @param {CoordinateConversionOverride} override
     */
    Sigma.prototype.viewportToGraph = function (viewportPoint, override) {
        if (override === void 0) { override = {}; }
        return this.normalizationFunction.inverse(this.viewportToFramedGraph(viewportPoint, override));
    };
    /**
     * Method used to translate a point's coordinates from the graph system (the reference system of data as they are in
     * the given graph instance) to the viewport system (pixel distance from the top-left of the stage).
     *
     * This method accepts an optional camera which can be useful if you need to translate coordinates
     * based on a different view than the one being currently being displayed on screen.
     *
     * @param {Coordinates}                  graphPoint
     * @param {CoordinateConversionOverride} override
     */
    Sigma.prototype.graphToViewport = function (graphPoint, override) {
        if (override === void 0) { override = {}; }
        return this.framedGraphToViewport(this.normalizationFunction(graphPoint), override);
    };
    /**
     * Method returning the graph's bounding box.
     *
     * @return {{ x: Extent, y: Extent }}
     */
    Sigma.prototype.getBBox = function () {
        return (0, utils_1.graphExtent)(this.graph);
    };
    /**
     * Method returning the graph's custom bounding box, if any.
     *
     * @return {{ x: Extent, y: Extent } | null}
     */
    Sigma.prototype.getCustomBBox = function () {
        return this.customBBox;
    };
    /**
     * Method used to override the graph's bounding box with a custom one. Give `null` as the argument to stop overriding.
     *
     * @return {Sigma}
     */
    Sigma.prototype.setCustomBBox = function (customBBox) {
        this.customBBox = customBBox;
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to shut the container & release event listeners.
     *
     * @return {undefined}
     */
    Sigma.prototype.kill = function () {
        var graph = this.graph;
        // Emitting "kill" events so that plugins and such can cleanup
        this.emit("kill");
        // Releasing events
        this.removeAllListeners();
        // Releasing camera handlers
        this.camera.removeListener("updated", this.activeListeners.camera);
        // Releasing DOM events & captors
        window.removeEventListener("resize", this.activeListeners.handleResize);
        this.mouseCaptor.kill();
        this.touchCaptor.kill();
        // Releasing graph handlers
        graph.removeListener("nodeAdded", this.activeListeners.dropNodeGraphUpdate);
        graph.removeListener("nodeDropped", this.activeListeners.graphUpdate);
        graph.removeListener("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.removeListener("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.removeListener("edgeAdded", this.activeListeners.graphUpdate);
        graph.removeListener("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
        graph.removeListener("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.removeListener("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.removeListener("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
        graph.removeListener("cleared", this.activeListeners.clearGraphUpdate);
        // Releasing cache & state
        this.quadtree = new quadtree_1.default();
        this.nodeDataCache = {};
        this.edgeDataCache = {};
        this.nodesWithForcedLabels = [];
        this.edgesWithForcedLabels = [];
        this.highlightedNodes.clear();
        // Clearing frames
        if (this.renderFrame) {
            (0, utils_1.cancelFrame)(this.renderFrame);
            this.renderFrame = null;
        }
        if (this.renderHighlightedNodesFrame) {
            (0, utils_1.cancelFrame)(this.renderHighlightedNodesFrame);
            this.renderHighlightedNodesFrame = null;
        }
        // Destroying canvases
        var container = this.container;
        while (container.firstChild)
            container.removeChild(container.firstChild);
    };
    /**
     * Method used to scale the given size according to the camera's ratio, i.e.
     * zooming state.
     *
     * @param  {number} size - The size to scale (node size, edge thickness etc.).
     * @return {number}      - The scaled size.
     */
    Sigma.prototype.scaleSize = function (size) {
        return size / this.cameraSizeRatio;
    };
    /**
     * Method that returns the collection of all used canvases.
     * At the moment, the instantiated canvases are the following, and in the
     * following order in the DOM:
     * - `edges`
     * - `nodes`
     * - `edgeLabels`
     * - `labels`
     * - `hovers`
     * - `hoverNodes`
     * - `mouse`
     *
     * @return {PlainObject<HTMLCanvasElement>} - The collection of canvases.
     */
    Sigma.prototype.getCanvases = function () {
        return __assign({}, this.elements);
    };
    return Sigma;
}(types_1.TypedEventEmitter));
exports["default"] = Sigma;


/***/ }),

/***/ "./node_modules/sigma/types.js":
/*!*************************************!*\
  !*** ./node_modules/sigma/types.js ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypedEventEmitter = void 0;
/**
 * Sigma.js Types
 * ===============
 *
 * Various type declarations used throughout the library.
 * @module
 */
var events_1 = __webpack_require__(/*! events */ "./node_modules/events/events.js");
var TypedEventEmitter = /** @class */ (function (_super) {
    __extends(TypedEventEmitter, _super);
    function TypedEventEmitter() {
        var _this = _super.call(this) || this;
        _this.rawEmitter = _this;
        return _this;
    }
    return TypedEventEmitter;
}(events_1.EventEmitter));
exports.TypedEventEmitter = TypedEventEmitter;


/***/ }),

/***/ "./node_modules/sigma/utils/animate.js":
/*!*********************************************!*\
  !*** ./node_modules/sigma/utils/animate.js ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.animateNodes = exports.ANIMATE_DEFAULTS = void 0;
var index_1 = __webpack_require__(/*! ./index */ "./node_modules/sigma/utils/index.js");
var easings_1 = __importDefault(__webpack_require__(/*! ./easings */ "./node_modules/sigma/utils/easings.js"));
exports.ANIMATE_DEFAULTS = {
    easing: "quadraticInOut",
    duration: 150,
};
/**
 * Function used to animate the nodes.
 */
function animateNodes(graph, targets, opts, callback) {
    var options = Object.assign({}, exports.ANIMATE_DEFAULTS, opts);
    var easing = typeof options.easing === "function" ? options.easing : easings_1.default[options.easing];
    var start = Date.now();
    var startPositions = {};
    for (var node in targets) {
        var attrs = targets[node];
        startPositions[node] = {};
        for (var k in attrs)
            startPositions[node][k] = graph.getNodeAttribute(node, k);
    }
    var frame = null;
    var step = function () {
        frame = null;
        var p = (Date.now() - start) / options.duration;
        if (p >= 1) {
            // Animation is done
            for (var node in targets) {
                var attrs = targets[node];
                // We use given values to avoid precision issues and for convenience
                for (var k in attrs)
                    graph.setNodeAttribute(node, k, attrs[k]);
            }
            if (typeof callback === "function")
                callback();
            return;
        }
        p = easing(p);
        for (var node in targets) {
            var attrs = targets[node];
            var s = startPositions[node];
            for (var k in attrs)
                graph.setNodeAttribute(node, k, attrs[k] * p + s[k] * (1 - p));
        }
        frame = (0, index_1.requestFrame)(step);
    };
    step();
    return function () {
        if (frame)
            (0, index_1.cancelFrame)(frame);
    };
}
exports.animateNodes = animateNodes;


/***/ }),

/***/ "./node_modules/sigma/utils/data.js":
/*!******************************************!*\
  !*** ./node_modules/sigma/utils/data.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HTML_COLORS = void 0;
exports.HTML_COLORS = {
    black: "#000000",
    silver: "#C0C0C0",
    gray: "#808080",
    grey: "#808080",
    white: "#FFFFFF",
    maroon: "#800000",
    red: "#FF0000",
    purple: "#800080",
    fuchsia: "#FF00FF",
    green: "#008000",
    lime: "#00FF00",
    olive: "#808000",
    yellow: "#FFFF00",
    navy: "#000080",
    blue: "#0000FF",
    teal: "#008080",
    aqua: "#00FFFF",
    darkblue: "#00008B",
    mediumblue: "#0000CD",
    darkgreen: "#006400",
    darkcyan: "#008B8B",
    deepskyblue: "#00BFFF",
    darkturquoise: "#00CED1",
    mediumspringgreen: "#00FA9A",
    springgreen: "#00FF7F",
    cyan: "#00FFFF",
    midnightblue: "#191970",
    dodgerblue: "#1E90FF",
    lightseagreen: "#20B2AA",
    forestgreen: "#228B22",
    seagreen: "#2E8B57",
    darkslategray: "#2F4F4F",
    darkslategrey: "#2F4F4F",
    limegreen: "#32CD32",
    mediumseagreen: "#3CB371",
    turquoise: "#40E0D0",
    royalblue: "#4169E1",
    steelblue: "#4682B4",
    darkslateblue: "#483D8B",
    mediumturquoise: "#48D1CC",
    indigo: "#4B0082",
    darkolivegreen: "#556B2F",
    cadetblue: "#5F9EA0",
    cornflowerblue: "#6495ED",
    rebeccapurple: "#663399",
    mediumaquamarine: "#66CDAA",
    dimgray: "#696969",
    dimgrey: "#696969",
    slateblue: "#6A5ACD",
    olivedrab: "#6B8E23",
    slategray: "#708090",
    slategrey: "#708090",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    mediumslateblue: "#7B68EE",
    lawngreen: "#7CFC00",
    chartreuse: "#7FFF00",
    aquamarine: "#7FFFD4",
    skyblue: "#87CEEB",
    lightskyblue: "#87CEFA",
    blueviolet: "#8A2BE2",
    darkred: "#8B0000",
    darkmagenta: "#8B008B",
    saddlebrown: "#8B4513",
    darkseagreen: "#8FBC8F",
    lightgreen: "#90EE90",
    mediumpurple: "#9370DB",
    darkviolet: "#9400D3",
    palegreen: "#98FB98",
    darkorchid: "#9932CC",
    yellowgreen: "#9ACD32",
    sienna: "#A0522D",
    brown: "#A52A2A",
    darkgray: "#A9A9A9",
    darkgrey: "#A9A9A9",
    lightblue: "#ADD8E6",
    greenyellow: "#ADFF2F",
    paleturquoise: "#AFEEEE",
    lightsteelblue: "#B0C4DE",
    powderblue: "#B0E0E6",
    firebrick: "#B22222",
    darkgoldenrod: "#B8860B",
    mediumorchid: "#BA55D3",
    rosybrown: "#BC8F8F",
    darkkhaki: "#BDB76B",
    mediumvioletred: "#C71585",
    indianred: "#CD5C5C",
    peru: "#CD853F",
    chocolate: "#D2691E",
    tan: "#D2B48C",
    lightgray: "#D3D3D3",
    lightgrey: "#D3D3D3",
    thistle: "#D8BFD8",
    orchid: "#DA70D6",
    goldenrod: "#DAA520",
    palevioletred: "#DB7093",
    crimson: "#DC143C",
    gainsboro: "#DCDCDC",
    plum: "#DDA0DD",
    burlywood: "#DEB887",
    lightcyan: "#E0FFFF",
    lavender: "#E6E6FA",
    darksalmon: "#E9967A",
    violet: "#EE82EE",
    palegoldenrod: "#EEE8AA",
    lightcoral: "#F08080",
    khaki: "#F0E68C",
    aliceblue: "#F0F8FF",
    honeydew: "#F0FFF0",
    azure: "#F0FFFF",
    sandybrown: "#F4A460",
    wheat: "#F5DEB3",
    beige: "#F5F5DC",
    whitesmoke: "#F5F5F5",
    mintcream: "#F5FFFA",
    ghostwhite: "#F8F8FF",
    salmon: "#FA8072",
    antiquewhite: "#FAEBD7",
    linen: "#FAF0E6",
    lightgoldenrodyellow: "#FAFAD2",
    oldlace: "#FDF5E6",
    magenta: "#FF00FF",
    deeppink: "#FF1493",
    orangered: "#FF4500",
    tomato: "#FF6347",
    hotpink: "#FF69B4",
    coral: "#FF7F50",
    darkorange: "#FF8C00",
    lightsalmon: "#FFA07A",
    orange: "#FFA500",
    lightpink: "#FFB6C1",
    pink: "#FFC0CB",
    gold: "#FFD700",
    peachpuff: "#FFDAB9",
    navajowhite: "#FFDEAD",
    moccasin: "#FFE4B5",
    bisque: "#FFE4C4",
    mistyrose: "#FFE4E1",
    blanchedalmond: "#FFEBCD",
    papayawhip: "#FFEFD5",
    lavenderblush: "#FFF0F5",
    seashell: "#FFF5EE",
    cornsilk: "#FFF8DC",
    lemonchiffon: "#FFFACD",
    floralwhite: "#FFFAF0",
    snow: "#FFFAFA",
    lightyellow: "#FFFFE0",
    ivory: "#FFFFF0",
};


/***/ }),

/***/ "./node_modules/sigma/utils/easings.js":
/*!*********************************************!*\
  !*** ./node_modules/sigma/utils/easings.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cubicInOut = exports.cubicOut = exports.cubicIn = exports.quadraticInOut = exports.quadraticOut = exports.quadraticIn = exports.linear = void 0;
/**
 * Sigma.js Easings
 * =================
 *
 * Handy collection of easing functions.
 * @module
 */
var linear = function (k) { return k; };
exports.linear = linear;
var quadraticIn = function (k) { return k * k; };
exports.quadraticIn = quadraticIn;
var quadraticOut = function (k) { return k * (2 - k); };
exports.quadraticOut = quadraticOut;
var quadraticInOut = function (k) {
    if ((k *= 2) < 1)
        return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
};
exports.quadraticInOut = quadraticInOut;
var cubicIn = function (k) { return k * k * k; };
exports.cubicIn = cubicIn;
var cubicOut = function (k) { return --k * k * k + 1; };
exports.cubicOut = cubicOut;
var cubicInOut = function (k) {
    if ((k *= 2) < 1)
        return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
};
exports.cubicInOut = cubicInOut;
var easings = {
    linear: exports.linear,
    quadraticIn: exports.quadraticIn,
    quadraticOut: exports.quadraticOut,
    quadraticInOut: exports.quadraticInOut,
    cubicIn: exports.cubicIn,
    cubicOut: exports.cubicOut,
    cubicInOut: exports.cubicInOut,
};
exports["default"] = easings;


/***/ }),

/***/ "./node_modules/sigma/utils/edge-collisions.js":
/*!*****************************************************!*\
  !*** ./node_modules/sigma/utils/edge-collisions.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.doEdgeCollideWithPoint = exports.isPixelColored = void 0;
/**
 * This helper returns true is the pixel at (x,y) in the given WebGL context is
 * colored, and false else.
 */
function isPixelColored(gl, x, y) {
    var pixels = new Uint8Array(4);
    gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels[3] > 0;
}
exports.isPixelColored = isPixelColored;
/**
 * This helper checks whether or not a point (x, y) collides with an
 * edge, connecting a source (xS, yS) to a target (xT, yT) with a thickness in
 * pixels.
 */
function doEdgeCollideWithPoint(x, y, xS, yS, xT, yT, thickness) {
    // Check first if point is out of the rectangle which opposite corners are the
    // source and the target, rectangle we expand by `thickness` in every
    // directions:
    if (x < xS - thickness && x < xT - thickness)
        return false;
    if (y < yS - thickness && y < yT - thickness)
        return false;
    if (x > xS + thickness && x > xT + thickness)
        return false;
    if (y > yS + thickness && y > yT + thickness)
        return false;
    // Check actual collision now: Since we now the point is in this big rectangle
    // we "just" need to check that the distance between the point and the line
    // connecting the source and the target is less than `thickness`:
    // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    var distance = Math.abs((xT - xS) * (yS - y) - (xS - x) * (yT - yS)) / Math.sqrt(Math.pow(xT - xS, 2) + Math.pow(yT - yS, 2));
    return distance < thickness / 2;
}
exports.doEdgeCollideWithPoint = doEdgeCollideWithPoint;


/***/ }),

/***/ "./node_modules/sigma/utils/index.js":
/*!*******************************************!*\
  !*** ./node_modules/sigma/utils/index.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.validateGraph = exports.canUse32BitsIndices = exports.extractPixel = exports.getMatrixImpact = exports.matrixFromCamera = exports.getCorrectionRatio = exports.floatColor = exports.floatArrayColor = exports.parseColor = exports.zIndexOrdering = exports.createNormalizationFunction = exports.graphExtent = exports.getPixelRatio = exports.createElement = exports.cancelFrame = exports.requestFrame = exports.assignDeep = exports.assign = exports.isPlainObject = void 0;
var is_graph_1 = __importDefault(__webpack_require__(/*! graphology-utils/is-graph */ "./node_modules/graphology-utils/is-graph.js"));
var matrices_1 = __webpack_require__(/*! ./matrices */ "./node_modules/sigma/utils/matrices.js");
var data_1 = __webpack_require__(/*! ./data */ "./node_modules/sigma/utils/data.js");
/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function isPlainObject(value) {
    return typeof value === "object" && value !== null && value.constructor === Object;
}
exports.isPlainObject = isPlainObject;
/**
 * Helper to use Object.assign with more than two objects.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assign(target) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    target = target || {};
    for (var i = 0, l = objects.length; i < l; i++) {
        var o = objects[i];
        if (!o)
            continue;
        Object.assign(target, o);
    }
    return target;
}
exports.assign = assign;
/**
 * Very simple recursive Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assignDeep(target) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    target = target || {};
    for (var i = 0, l = objects.length; i < l; i++) {
        var o = objects[i];
        if (!o)
            continue;
        for (var k in o) {
            if (isPlainObject(o[k])) {
                target[k] = assignDeep(target[k], o[k]);
            }
            else {
                target[k] = o[k];
            }
        }
    }
    return target;
}
exports.assignDeep = assignDeep;
/**
 * Just some dirty trick to make requestAnimationFrame and cancelAnimationFrame "work" in Node.js, for unit tests:
 */
exports.requestFrame = typeof requestAnimationFrame !== "undefined"
    ? function (callback) { return requestAnimationFrame(callback); }
    : function (callback) { return setTimeout(callback, 0); };
exports.cancelFrame = typeof cancelAnimationFrame !== "undefined"
    ? function (requestID) { return cancelAnimationFrame(requestID); }
    : function (requestID) { return clearTimeout(requestID); };
/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} style      - Styles map.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
function createElement(tag, style, attributes) {
    var element = document.createElement(tag);
    if (style) {
        for (var k in style) {
            element.style[k] = style[k];
        }
    }
    if (attributes) {
        for (var k in attributes) {
            element.setAttribute(k, attributes[k]);
        }
    }
    return element;
}
exports.createElement = createElement;
/**
 * Function returning the browser's pixel ratio.
 *
 * @return {number}
 */
function getPixelRatio() {
    if (typeof window.devicePixelRatio !== "undefined")
        return window.devicePixelRatio;
    return 1;
}
exports.getPixelRatio = getPixelRatio;
/**
 * Function returning the graph's node extent in x & y.
 *
 * @param  {Graph}
 * @return {object}
 */
function graphExtent(graph) {
    if (!graph.order)
        return { x: [0, 1], y: [0, 1] };
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMin = Infinity;
    var yMax = -Infinity;
    graph.forEachNode(function (_, attr) {
        var x = attr.x, y = attr.y;
        if (x < xMin)
            xMin = x;
        if (x > xMax)
            xMax = x;
        if (y < yMin)
            yMin = y;
        if (y > yMax)
            yMax = y;
    });
    return { x: [xMin, xMax], y: [yMin, yMax] };
}
exports.graphExtent = graphExtent;
function createNormalizationFunction(extent) {
    var _a = __read(extent.x, 2), minX = _a[0], maxX = _a[1], _b = __read(extent.y, 2), minY = _b[0], maxY = _b[1];
    var ratio = Math.max(maxX - minX, maxY - minY), dX = (maxX + minX) / 2, dY = (maxY + minY) / 2;
    if (ratio === 0 || Math.abs(ratio) === Infinity || isNaN(ratio))
        ratio = 1;
    if (isNaN(dX))
        dX = 0;
    if (isNaN(dY))
        dY = 0;
    var fn = function (data) {
        return {
            x: 0.5 + (data.x - dX) / ratio,
            y: 0.5 + (data.y - dY) / ratio,
        };
    };
    // TODO: possibility to apply this in batch over array of indices
    fn.applyTo = function (data) {
        data.x = 0.5 + (data.x - dX) / ratio;
        data.y = 0.5 + (data.y - dY) / ratio;
    };
    fn.inverse = function (data) {
        return {
            x: dX + ratio * (data.x - 0.5),
            y: dY + ratio * (data.y - 0.5),
        };
    };
    fn.ratio = ratio;
    return fn;
}
exports.createNormalizationFunction = createNormalizationFunction;
/**
 * Function ordering the given elements in reverse z-order so they drawn
 * the correct way.
 *
 * @param  {number}   extent   - [min, max] z values.
 * @param  {function} getter   - Z attribute getter function.
 * @param  {array}    elements - The array to sort.
 * @return {array} - The sorted array.
 */
function zIndexOrdering(extent, getter, elements) {
    // If k is > n, we'll use a standard sort
    return elements.sort(function (a, b) {
        var zA = getter(a) || 0, zB = getter(b) || 0;
        if (zA < zB)
            return -1;
        if (zA > zB)
            return 1;
        return 0;
    });
    // TODO: counting sort optimization
}
exports.zIndexOrdering = zIndexOrdering;
/**
 * WebGL utils
 * ===========
 */
/**
 * Memoized function returning a float-encoded color from various string
 * formats describing colors.
 */
var INT8 = new Int8Array(4);
var INT32 = new Int32Array(INT8.buffer, 0, 1);
var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);
var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;
function parseColor(val) {
    var r = 0; // byte
    var g = 0; // byte
    var b = 0; // byte
    var a = 1; // float
    // Handling hexadecimal notation
    if (val[0] === "#") {
        if (val.length === 4) {
            r = parseInt(val.charAt(1) + val.charAt(1), 16);
            g = parseInt(val.charAt(2) + val.charAt(2), 16);
            b = parseInt(val.charAt(3) + val.charAt(3), 16);
        }
        else {
            r = parseInt(val.charAt(1) + val.charAt(2), 16);
            g = parseInt(val.charAt(3) + val.charAt(4), 16);
            b = parseInt(val.charAt(5) + val.charAt(6), 16);
        }
        if (val.length === 9) {
            a = parseInt(val.charAt(7) + val.charAt(8), 16) / 255;
        }
    }
    // Handling rgb notation
    else if (RGBA_TEST_REGEX.test(val)) {
        var match = val.match(RGBA_EXTRACT_REGEX);
        if (match) {
            r = +match[1];
            g = +match[2];
            b = +match[3];
            if (match[4])
                a = +match[4];
        }
    }
    return { r: r, g: g, b: b, a: a };
}
exports.parseColor = parseColor;
var FLOAT_COLOR_CACHE = {};
for (var htmlColor in data_1.HTML_COLORS) {
    FLOAT_COLOR_CACHE[htmlColor] = floatColor(data_1.HTML_COLORS[htmlColor]);
    // Replicating cache for hex values for free
    FLOAT_COLOR_CACHE[data_1.HTML_COLORS[htmlColor]] = FLOAT_COLOR_CACHE[htmlColor];
}
function floatArrayColor(val) {
    val = data_1.HTML_COLORS[val] || val;
    // NOTE: this variant is not cached because it is mostly used for uniforms
    var _a = parseColor(val), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    return new Float32Array([r / 255, g / 255, b / 255, a]);
}
exports.floatArrayColor = floatArrayColor;
function floatColor(val) {
    // If the color is already computed, we yield it
    if (typeof FLOAT_COLOR_CACHE[val] !== "undefined")
        return FLOAT_COLOR_CACHE[val];
    var parsed = parseColor(val);
    var r = parsed.r, g = parsed.g, b = parsed.b;
    var a = parsed.a;
    a = (a * 255) | 0;
    INT32[0] = ((a << 24) | (b << 16) | (g << 8) | r) & 0xfeffffff;
    var color = FLOAT32[0];
    FLOAT_COLOR_CACHE[val] = color;
    return color;
}
exports.floatColor = floatColor;
/**
 * In sigma, the graph is normalized into a [0, 1], [0, 1] square, before being given to the various renderers. This
 * helps dealing with quadtree in particular.
 * But at some point, we need to rescale it so that it takes the best place in the screen, ie. we always want to see two
 * nodes "touching" opposite sides of the graph, with the camera being at its default state.
 *
 * This function determines this ratio.
 */
function getCorrectionRatio(viewportDimensions, graphDimensions) {
    var viewportRatio = viewportDimensions.height / viewportDimensions.width;
    var graphRatio = graphDimensions.height / graphDimensions.width;
    // If the stage and the graphs are in different directions (such as the graph being wider that tall while the stage
    // is taller than wide), we can stop here to have indeed nodes touching opposite sides:
    if ((viewportRatio < 1 && graphRatio > 1) || (viewportRatio > 1 && graphRatio < 1)) {
        return 1;
    }
    // Else, we need to fit the graph inside the stage:
    // 1. If the graph is "squarer" (ie. with a ratio closer to 1), we need to make the largest sides touch;
    // 2. If the stage is "squarer", we need to make the smallest sides touch.
    return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
}
exports.getCorrectionRatio = getCorrectionRatio;
/**
 * Function returning a matrix from the current state of the camera.
 */
// TODO: it's possible to optimize this drastically!
function matrixFromCamera(state, viewportDimensions, graphDimensions, padding, inverse) {
    var angle = state.angle, ratio = state.ratio, x = state.x, y = state.y;
    var width = viewportDimensions.width, height = viewportDimensions.height;
    var matrix = (0, matrices_1.identity)();
    var smallestDimension = Math.min(width, height) - 2 * padding;
    var correctionRatio = getCorrectionRatio(viewportDimensions, graphDimensions);
    if (!inverse) {
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), 2 * (smallestDimension / width) * correctionRatio, 2 * (smallestDimension / height) * correctionRatio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.rotate)((0, matrices_1.identity)(), -angle));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), 1 / ratio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.translate)((0, matrices_1.identity)(), -x, -y));
    }
    else {
        (0, matrices_1.multiply)(matrix, (0, matrices_1.translate)((0, matrices_1.identity)(), x, y));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), ratio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.rotate)((0, matrices_1.identity)(), angle));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), width / smallestDimension / 2 / correctionRatio, height / smallestDimension / 2 / correctionRatio));
    }
    return matrix;
}
exports.matrixFromCamera = matrixFromCamera;
/**
 * All these transformations we apply on the matrix to get it rescale the graph
 * as we want make it very hard to get pixel-perfect distances in WebGL. This
 * function returns a factor that properly cancels the matrix effect on lengths.
 *
 * [jacomyal]
 * To be fully honest, I can't really explain happens here... I notice that the
 * following ratio works (ie. it correctly compensates the matrix impact on all
 * camera states I could try):
 * > `R = size(V) / size(M * V) / W`
 * as long as `M * V` is in the direction of W (ie. parallel to (Ox)). It works
 * as well with H and a vector that transforms into something parallel to (Oy).
 *
 * Also, note that we use `angle` and not `-angle` (that would seem logical,
 * since we want to anticipate the rotation), because of the fact that in WebGL,
 * the image is vertically swapped.
 */
function getMatrixImpact(matrix, cameraState, viewportDimensions) {
    var _a = (0, matrices_1.multiplyVec2)(matrix, { x: Math.cos(cameraState.angle), y: Math.sin(cameraState.angle) }, 0), x = _a.x, y = _a.y;
    return 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / viewportDimensions.width;
}
exports.getMatrixImpact = getMatrixImpact;
/**
 * Function extracting the color at the given pixel.
 */
function extractPixel(gl, x, y, array) {
    var data = array || new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return data;
}
exports.extractPixel = extractPixel;
/**
 * Function used to know whether given webgl context can use 32 bits indices.
 */
function canUse32BitsIndices(gl) {
    var webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
    return webgl2 || !!gl.getExtension("OES_element_index_uint");
}
exports.canUse32BitsIndices = canUse32BitsIndices;
/**
 * Check if the graph variable is a valid graph, and if sigma can render it.
 */
function validateGraph(graph) {
    // check if it's a valid graphology instance
    if (!(0, is_graph_1.default)(graph))
        throw new Error("Sigma: invalid graph instance.");
    // check if nodes have x/y attributes
    graph.forEachNode(function (key, attributes) {
        if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) {
            throw new Error("Sigma: Coordinates of node ".concat(key, " are invalid. A node must have a numeric 'x' and 'y' attribute."));
        }
    });
}
exports.validateGraph = validateGraph;


/***/ }),

/***/ "./node_modules/sigma/utils/matrices.js":
/*!**********************************************!*\
  !*** ./node_modules/sigma/utils/matrices.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.multiplyVec2 = exports.multiply = exports.translate = exports.rotate = exports.scale = exports.identity = void 0;
function identity() {
    return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}
exports.identity = identity;
// TODO: optimize
function scale(m, x, y) {
    m[0] = x;
    m[4] = typeof y === "number" ? y : x;
    return m;
}
exports.scale = scale;
function rotate(m, r) {
    var s = Math.sin(r), c = Math.cos(r);
    m[0] = c;
    m[1] = s;
    m[3] = -s;
    m[4] = c;
    return m;
}
exports.rotate = rotate;
function translate(m, x, y) {
    m[6] = x;
    m[7] = y;
    return m;
}
exports.translate = translate;
function multiply(a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2];
    var a10 = a[3], a11 = a[4], a12 = a[5];
    var a20 = a[6], a21 = a[7], a22 = a[8];
    var b00 = b[0], b01 = b[1], b02 = b[2];
    var b10 = b[3], b11 = b[4], b12 = b[5];
    var b20 = b[6], b21 = b[7], b22 = b[8];
    a[0] = b00 * a00 + b01 * a10 + b02 * a20;
    a[1] = b00 * a01 + b01 * a11 + b02 * a21;
    a[2] = b00 * a02 + b01 * a12 + b02 * a22;
    a[3] = b10 * a00 + b11 * a10 + b12 * a20;
    a[4] = b10 * a01 + b11 * a11 + b12 * a21;
    a[5] = b10 * a02 + b11 * a12 + b12 * a22;
    a[6] = b20 * a00 + b21 * a10 + b22 * a20;
    a[7] = b20 * a01 + b21 * a11 + b22 * a21;
    a[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return a;
}
exports.multiply = multiply;
function multiplyVec2(a, b, z) {
    if (z === void 0) { z = 1; }
    var a00 = a[0];
    var a01 = a[1];
    var a10 = a[3];
    var a11 = a[4];
    var a20 = a[6];
    var a21 = a[7];
    var b0 = b.x;
    var b1 = b.y;
    return { x: b0 * a00 + b1 * a10 + a20 * z, y: b0 * a01 + b1 * a11 + a21 * z };
}
exports.multiplyVec2 = multiplyVec2;


/***/ }),

/***/ "./src/ingest.ts":
/*!***********************!*\
  !*** ./src/ingest.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.buildGraph = exports.jsonTextToGraphDef = void 0;
const graphology_1 = __webpack_require__(/*! graphology */ "./node_modules/graphology/dist/graphology.umd.min.js");
const graphology_layout_1 = __webpack_require__(/*! graphology-layout */ "./node_modules/graphology-layout/index.js");
const graphology_layout_forceatlas2_1 = __importDefault(__webpack_require__(/*! graphology-layout-forceatlas2 */ "./node_modules/graphology-layout-forceatlas2/index.js"));
function jsonTextToGraphDef(text) {
    const parsed = JSON.parse(text);
    const checkField = (obj, fieldName, check, required = true) => {
        if (obj[fieldName] == null) {
            if (required)
                throw `required property "${fieldName}" is missing, have ${JSON.stringify(obj)}`;
            else
                return;
        }
        const checkResult = check(obj[fieldName]);
        if (checkResult === false) {
            throw `field ${fieldName} fails type check`;
        }
    };
    const isString = (v) => typeof v === "string";
    const isNumber = (v) => typeof v === "number";
    const isObject = (v) => typeof v === "object";
    checkField(parsed, "title", isString, false);
    checkField(parsed, "nodes", (v) => isObject(v) &&
        Object.entries(v).every(([k, v]) => {
            if (!isString(k)) {
                return false;
            }
            checkField(v, "props", isObject, false);
            checkField(v, "color", isString, false);
            checkField(v, "label", isString, false);
            checkField(v, "weight", isNumber, false);
            return true;
        }));
    checkField(parsed, "edges", (edges) => Array.isArray(edges) &&
        edges.forEach((edge) => {
            checkField(edge, "to", isString);
            checkField(edge, "from", isString);
        }));
    return parsed;
}
exports.jsonTextToGraphDef = jsonTextToGraphDef;
function buildGraph(def) {
    const graph = new graphology_1.DirectedGraph();
    Object.entries(def.nodes).forEach(([id, node]) => graph.addNode(id, {
        nodeDef: node,
        color: node.color,
        label: node.label || id,
    }));
    const createNodeIfNotExists = (name) => {
        if (!graph.hasNode(name)) {
            graph.addNode(name, { label: name, nodeDef: {} });
        }
    };
    def.edges.forEach((edge) => {
        let amountNum = parseFloat(edge.amount || "1");
        if (isNaN(amountNum)) {
            console.warn(`amount on edge ${edge.from} -> ${edge.to} "${edge.amount}" is unparseable`);
            amountNum = 1;
        }
        createNodeIfNotExists(edge.from);
        createNodeIfNotExists(edge.to);
        graph.addEdge(edge.from, edge.to, {
            label: edge.label || edge.amount,
            weight: amountNum,
            type: "arrow",
            size: 3,
        });
    });
    const minSize = 5, maxSize = 25;
    const sizes = graph
        .mapNodes((node) => graph.getNodeAttribute(node, "nodeDef").weight)
        .filter((n) => n != null);
    const minExplicitNodeSize = Math.min(...sizes);
    const maxExplicitNodeSize = Math.max(...sizes);
    console.log(minExplicitNodeSize, maxExplicitNodeSize);
    // Use total edge weights for node size
    const totalTransfersByNode = graph
        .nodes()
        .map((node) => graph.reduceEdges(node, (acc, _edge, edgeAttrs) => acc + edgeAttrs.weight, 0));
    const minXfers = Math.min(...totalTransfersByNode);
    const maxXfers = Math.max(...totalTransfersByNode);
    const scaledSizeFor = (transferAmount) => minSize +
        ((transferAmount - minXfers) / (maxXfers - minXfers)) *
            (maxSize - minSize);
    const scaledExplicitSizeFor = (size) => minSize +
        ((size - minExplicitNodeSize) /
            (maxExplicitNodeSize - minExplicitNodeSize)) *
            (maxSize - minSize);
    graph.forEachNode((node) => {
        const totalTransfers = graph.reduceEdges(node, (acc, _edge, edgeAttrs) => acc + edgeAttrs.weight, 0);
        const nodeAttrs = graph.getNodeAttributes(node);
        const explicitSize = nodeAttrs.nodeDef.weight != null
            ? scaledExplicitSizeFor(nodeAttrs.nodeDef.weight)
            : null;
        graph.setNodeAttribute(node, "size", explicitSize ?? scaledSizeFor(totalTransfers));
    });
    // Position nodes on a circle, then run Force Atlas 2 for a while to get
    // proper graph layout:
    graphology_layout_1.circular.assign(graph);
    const settings = graphology_layout_forceatlas2_1.default.inferSettings(graph);
    graphology_layout_forceatlas2_1.default.assign(graph, { settings, iterations: 600 });
    // for debugging
    globalThis.graph = graph;
    return graph;
}
exports.buildGraph = buildGraph;


/***/ }),

/***/ "./src/renderer.ts":
/*!*************************!*\
  !*** ./src/renderer.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.View = exports.SigmaGraphView = exports.TableNodeDataView = void 0;
const sigma_1 = __importDefault(__webpack_require__(/*! sigma */ "./node_modules/sigma/index.js"));
// FIXME: this might be good to replace with react and TSX. the stock DOM
// stuff sucks
class TableNodeDataView {
    constructor(elem) {
        this.table = elem.querySelector("[data-node-table]");
        this.nameElem = elem.querySelector("[data-node-name]");
    }
    renderProperty(intoEl, id, value) {
        const SPECIALS = {
            googleSearch: () => {
                const anchor = document.createElement("a");
                anchor.href = `https://google.com/search?q=${encodeURIComponent(value)}`;
                anchor.textContent = value;
                intoEl.appendChild(anchor);
            },
        };
        const defaultRender = () => {
            intoEl.textContent = value;
        };
        // XXX: type crimes?
        const renderFunc = SPECIALS[id] || defaultRender;
        renderFunc();
    }
    onNodeSelected(nodeId, node) {
        if (this.table.tBodies[0])
            this.table.tBodies[0].remove();
        this.nameElem.textContent = node.label || nodeId;
        const tbody = this.table.createTBody();
        for (const [prop, val] of Object.entries(node.props || {})) {
            const row = document.createElement("tr");
            const nameEl = document.createElement("td");
            const valueEl = document.createElement("td");
            nameEl.textContent = prop;
            this.renderProperty(valueEl, prop, val);
            row.appendChild(nameEl);
            row.appendChild(valueEl);
            tbody.appendChild(row);
        }
    }
}
exports.TableNodeDataView = TableNodeDataView;
class SigmaGraphView {
    constructor(sigma) {
        this.onNodeSelected = () => undefined;
        this.sigma = sigma;
        sigma.addListener("clickNode", (payload) => {
            const graph = sigma.getGraph();
            const nodeDef = graph.getNodeAttribute(payload.node, "nodeDef");
            this.onNodeSelected(payload.node, nodeDef);
        });
    }
    kill() {
        this.sigma.kill();
    }
}
exports.SigmaGraphView = SigmaGraphView;
class View {
    constructor(graph, graphContainer, propsContainer) {
        this.nodeDataView = new TableNodeDataView(propsContainer);
        this.sigmaGraphView = new SigmaGraphView(new sigma_1.default(graph, graphContainer, {
            renderEdgeLabels: true,
        }));
        this.sigmaGraphView.onNodeSelected = (nodeId, node) => this.nodeDataView.onNodeSelected(nodeId, node);
    }
    kill() {
        this.sigmaGraphView.kill();
    }
}
exports.View = View;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const ingest_1 = __webpack_require__(/*! ./ingest */ "./src/ingest.ts");
const renderer_1 = __webpack_require__(/*! ./renderer */ "./src/renderer.ts");
function startup() {
    const textControl = document.getElementById("paste-json");
    let myView;
    const graphContainer = document.getElementById("sigma-container");
    const loading = document.getElementById("loading-indication");
    const failures = document.getElementById("failures");
    const nodeDataView = document.getElementById("properties-table");
    async function onAcceptText(text) {
        loading.style.display = "block";
        setTimeout(() => onLoad(text), 0);
    }
    async function onLoad(content, title) {
        if (myView) {
            console.log("kill");
            myView.kill();
            myView = undefined;
            console.log("done");
        }
        let graphDef;
        let graph;
        try {
            graphDef = (0, ingest_1.jsonTextToGraphDef)(content);
            graph = (0, ingest_1.buildGraph)(graphDef);
        }
        catch (e) {
            failures.textContent = `Failed to parse JSON, try copying it again: ${e.toString()}`;
            console.error(e);
            loading.style.display = "none";
            return;
        }
        loading.style.display = "none";
        failures.textContent = "";
        document.title = `${graphDef.title || title || "untitled"} - Looking Glass 🔎`;
        myView = new renderer_1.View(graph, graphContainer, nodeDataView);
    }
    textControl.addEventListener("paste", (ev) => {
        ev.preventDefault();
        const data = ev.clipboardData?.getData("text/plain");
        if (!data) {
            throw "Clipboard data is null?";
        }
        onAcceptText(data);
    });
}
startup();

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLE9BQU87QUFDbkIsWUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLGtCQUFrQixRQUFRO0FBQzFCO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7QUFFbkI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLG9CQUFvQixTQUFTO0FBQzdCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUEsa0NBQWtDLFFBQVE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtB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Q0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLFdBQVc7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixnQkFBZ0IsV0FBVztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQ3h4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLG1CQUFPLENBQUMsOEVBQTJCO0FBQ3pELGNBQWMsbUJBQU8sQ0FBQyw4RUFBMkI7QUFDakQsY0FBYyxtQkFBTyxDQUFDLG9GQUE4Qjs7QUFFcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQzs7QUFFM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0Esa0JBQWtCLGNBQWM7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLGNBQWMsY0FBYztBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGNBQWMsa0JBQWtCO0FBQ2hDLG9CQUFvQixjQUFjO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQkFBb0IsT0FBTztBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0dBQWtHO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsUUFBUTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjs7Ozs7Ozs7Ozs7O0FDekRQO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG1CQUFtQjtBQUNuQixtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBLFlBQVk7Ozs7Ozs7VUMzRVo7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7Ozs7QUN0QmE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsaUJBQWlCLG1CQUFPLENBQUMsaUNBQVU7QUFDbkMsbUJBQW1CLG1CQUFPLENBQUMscUNBQVk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRkFBa0YsYUFBYTtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsdUNBQXVDO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9AeW9tZ3VpdGhlcmVhbC9oZWxwZXJzL2V4dGVuZC5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9ncmFwaG9sb2d5LWxheW91dC1mb3JjZWF0bGFzMi9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL2dyYXBob2xvZ3ktbGF5b3V0LWZvcmNlYXRsYXMyL2hlbHBlcnMuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9ncmFwaG9sb2d5LWxheW91dC1mb3JjZWF0bGFzMi9pbmRleC5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL2dyYXBob2xvZ3ktbGF5b3V0LWZvcmNlYXRsYXMyL2l0ZXJhdGUuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9ncmFwaG9sb2d5LWxheW91dC9jaXJjbGVwYWNrLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvZ3JhcGhvbG9neS1sYXlvdXQvY2lyY3VsYXIuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9ncmFwaG9sb2d5LWxheW91dC9pbmRleC5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL2dyYXBob2xvZ3ktbGF5b3V0L3JhbmRvbS5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL2dyYXBob2xvZ3ktbGF5b3V0L3JvdGF0aW9uLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvZ3JhcGhvbG9neS11dGlscy9kZWZhdWx0cy5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL2dyYXBob2xvZ3ktdXRpbHMvZ2V0dGVycy5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL2dyYXBob2xvZ3ktdXRpbHMvaXMtZ3JhcGguanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9ncmFwaG9sb2d5L2Rpc3QvZ3JhcGhvbG9neS51bWQubWluLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvcGFuZGVtb25pdW0vcmFuZG9tLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvcGFuZGVtb25pdW0vc2h1ZmZsZS1pbi1wbGFjZS5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL2NvcmUvY2FtZXJhLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvc2lnbWEvY29yZS9jYXB0b3JzL2NhcHRvci5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL2NvcmUvY2FwdG9ycy9tb3VzZS5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL2NvcmUvY2FwdG9ycy90b3VjaC5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL2NvcmUvbGFiZWxzLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvc2lnbWEvY29yZS9xdWFkdHJlZS5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL2luZGV4LmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvc2lnbWEvcmVuZGVyaW5nL2NhbnZhcy9lZGdlLWxhYmVsLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvc2lnbWEvcmVuZGVyaW5nL2NhbnZhcy9ob3Zlci5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL3JlbmRlcmluZy9jYW52YXMvbGFiZWwuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvcHJvZ3JhbXMvY29tbW9uL2VkZ2UuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvcHJvZ3JhbXMvY29tbW9uL25vZGUuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvcHJvZ3JhbXMvY29tbW9uL3Byb2dyYW0uanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvcHJvZ3JhbXMvZWRnZS5hcnJvdy5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL3JlbmRlcmluZy93ZWJnbC9wcm9ncmFtcy9lZGdlLmFycm93SGVhZC5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL3JlbmRlcmluZy93ZWJnbC9wcm9ncmFtcy9lZGdlLmNsYW1wZWQuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvcHJvZ3JhbXMvZWRnZS5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL3JlbmRlcmluZy93ZWJnbC9wcm9ncmFtcy9ub2RlLmZhc3QuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvc2hhZGVycy9lZGdlLmFycm93SGVhZC5mcmFnLmdsc2wuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvc2hhZGVycy9lZGdlLmFycm93SGVhZC52ZXJ0Lmdsc2wuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvc2hhZGVycy9lZGdlLmNsYW1wZWQudmVydC5nbHNsLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvc2lnbWEvcmVuZGVyaW5nL3dlYmdsL3NoYWRlcnMvZWRnZS5mcmFnLmdsc2wuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvc2hhZGVycy9lZGdlLnZlcnQuZ2xzbC5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL3JlbmRlcmluZy93ZWJnbC9zaGFkZXJzL25vZGUuZmFzdC5mcmFnLmdsc2wuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9yZW5kZXJpbmcvd2ViZ2wvc2hhZGVycy9ub2RlLmZhc3QudmVydC5nbHNsLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvc2lnbWEvcmVuZGVyaW5nL3dlYmdsL3NoYWRlcnMvdXRpbHMuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS9zZXR0aW5ncy5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL3NpZ21hLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvc2lnbWEvdHlwZXMuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS91dGlscy9hbmltYXRlLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9ub2RlX21vZHVsZXMvc2lnbWEvdXRpbHMvZGF0YS5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL3V0aWxzL2Vhc2luZ3MuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS91dGlscy9lZGdlLWNvbGxpc2lvbnMuanMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy8uL25vZGVfbW9kdWxlcy9zaWdtYS91dGlscy9pbmRleC5qcyIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vbm9kZV9tb2R1bGVzL3NpZ21hL3V0aWxzL21hdHJpY2VzLmpzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9zcmMvaW5nZXN0LnRzIiwid2VicGFjazovL2xvb2tpbmctZ2xhc3MvLi9zcmMvcmVuZGVyZXIudHMiLCJ3ZWJwYWNrOi8vbG9va2luZy1nbGFzcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9sb29raW5nLWdsYXNzLy4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXh0ZW5kIGZ1bmN0aW9uXG4gKiA9PT09PT09PT09PT09PT09XG4gKlxuICogRnVuY3Rpb24gdXNlZCB0byBwdXNoIGEgYnVuY2ggb2YgdmFsdWVzIGludG8gYW4gYXJyYXkgYXQgb25jZS5cbiAqXG4gKiBJdHMgc3RyYXRlZ3kgaXMgdG8gbXV0YXRlIHRhcmdldCBhcnJheSdzIGxlbmd0aCB0aGVuIHNldHRpbmcgdGhlIG5ldyBpbmRpY2VzXG4gKiB0byBiZSB0aGUgdmFsdWVzIHRvIGFkZC5cbiAqXG4gKiBBIGJlbmNobWFyayBwcm92ZWQgdGhhdCBpdCBpcyBmYXN0ZXIgdGhhbiB0aGUgZm9sbG93aW5nIHN0cmF0ZWdpZXM6XG4gKiAgIDEpIGBhcnJheS5wdXNoLmFwcGx5KGFycmF5LCB2YWx1ZXMpYC5cbiAqICAgMikgQSBsb29wIG9mIHB1c2hlcy5cbiAqICAgMykgYGFycmF5ID0gYXJyYXkuY29uY2F0KHZhbHVlcylgLCBvYnZpb3VzbHkuXG4gKlxuICogSW50dWl0aXZlbHksIHRoaXMgaXMgY29ycmVjdCBiZWNhdXNlIHdoZW4gYWRkaW5nIGEgbG90IG9mIGVsZW1lbnRzLCB0aGVcbiAqIGNob3NlbiBzdHJhdGVnaWVzIGRvZXMgbm90IG5lZWQgdG8gaGFuZGxlIHRoZSBgYXJndW1lbnRzYCBvYmplY3QgdG9cbiAqIGV4ZWN1dGUgIy5hcHBseSdzIHZhcmlhZGljaXR5IGFuZCBiZWNhdXNlIHRoZSBhcnJheSBrbm93IGl0cyBmaW5hbCBsZW5ndGhcbiAqIGF0IHRoZSBiZWdpbm5pbmcsIGF2b2lkaW5nIHBvdGVudGlhbCBtdWx0aXBsZSByZWFsbG9jYXRpb25zIG9mIHRoZSB1bmRlcmx5aW5nXG4gKiBjb250aWd1b3VzIGFycmF5LiBTb21lIGVuZ2luZXMgbWF5IGJlIGFibGUgdG8gb3B0aW1pemUgdGhlIGxvb3Agb2YgcHVzaFxuICogb3BlcmF0aW9ucyBidXQgZW1waXJpY2FsbHkgdGhleSBkb24ndCBzZWVtIHRvIGRvIHNvLlxuICovXG5cbi8qKlxuICogRXh0ZW5kcyB0aGUgdGFyZ2V0IGFycmF5IHdpdGggdGhlIGdpdmVuIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0gIHthcnJheX0gYXJyYXkgIC0gVGFyZ2V0IGFycmF5LlxuICogQHBhcmFtICB7YXJyYXl9IHZhbHVlcyAtIFZhbHVlcyB0byBhZGQuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXh0ZW5kKGFycmF5LCB2YWx1ZXMpIHtcbiAgdmFyIGwyID0gdmFsdWVzLmxlbmd0aDtcblxuICBpZiAobDIgPT09IDApXG4gICAgcmV0dXJuO1xuXG4gIHZhciBsMSA9IGFycmF5Lmxlbmd0aDtcblxuICBhcnJheS5sZW5ndGggKz0gbDI7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsMjsgaSsrKVxuICAgIGFycmF5W2wxICsgaV0gPSB2YWx1ZXNbaV07XG59O1xuIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbFxudmFyIFJlZmxlY3RBcHBseSA9IFIgJiYgdHlwZW9mIFIuYXBwbHkgPT09ICdmdW5jdGlvbidcbiAgPyBSLmFwcGx5XG4gIDogZnVuY3Rpb24gUmVmbGVjdEFwcGx5KHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodGFyZ2V0LCByZWNlaXZlciwgYXJncyk7XG4gIH1cblxudmFyIFJlZmxlY3RPd25LZXlzXG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzXG59IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xuICB9O1xufSBlbHNlIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG5cbnZhciBOdW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBOdW1iZXJJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbm1vZHVsZS5leHBvcnRzLm9uY2UgPSBvbmNlO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50c0NvdW50ID0gMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInIHx8IGFyZyA8IDAgfHwgTnVtYmVySXNOYU4oYXJnKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcImRlZmF1bHRNYXhMaXN0ZW5lcnNcIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgYXJnICsgJy4nKTtcbiAgICB9XG4gICAgZGVmYXVsdE1heExpc3RlbmVycyA9IGFyZztcbiAgfVxufSk7XG5cbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYgKHRoaXMuX2V2ZW50cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLl9ldmVudHMgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5fZXZlbnRzKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufTtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pIHtcbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuIDwgMCB8fCBOdW1iZXJJc05hTihuKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJuXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIG4gKyAnLicpO1xuICB9XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gX2dldE1heExpc3RlbmVycyh0aGF0KSB7XG4gIGlmICh0aGF0Ll9tYXhMaXN0ZW5lcnMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIHJldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnM7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZ2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gX2dldE1heExpc3RlbmVycyh0aGlzKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZClcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09PSB1bmRlZmluZWQpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIHZhciBlcjtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKVxuICAgICAgZXIgPSBhcmdzWzBdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tbWVudHMgb24gdGhlIGB0aHJvd2AgbGluZXMgYXJlIGludGVudGlvbmFsLCB0aGV5IHNob3dcbiAgICAgIC8vIHVwIGluIE5vZGUncyBvdXRwdXQgaWYgdGhpcyByZXN1bHRzIGluIGFuIHVuaGFuZGxlZCBleGNlcHRpb24uXG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9XG4gICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuaGFuZGxlZCBlcnJvci4nICsgKGVyID8gJyAoJyArIGVyLm1lc3NhZ2UgKyAnKScgOiAnJykpO1xuICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgdGhyb3cgZXJyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG5cbiAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUmVmbGVjdEFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBSZWZsZWN0QXBwbHkobGlzdGVuZXJzW2ldLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICArK3RhcmdldC5fZXZlbnRzQ291bnQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9XG4gICAgICAgIHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIH0gZWxzZSBpZiAocHJlcGVuZCkge1xuICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgbSA9IF9nZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtcbiAgICBpZiAobSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSAmJiAhZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgLy8gTm8gZXJyb3IgY29kZSBmb3IgdGhpcyBzaW5jZSBpdCBpcyBhIFdhcm5pbmdcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgdmFyIHcgPSBuZXcgRXJyb3IoJ1Bvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIFN0cmluZyh0eXBlKSArICcgbGlzdGVuZXJzICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnaW5jcmVhc2UgbGltaXQnKTtcbiAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgdy5lbWl0dGVyID0gdGFyZ2V0O1xuICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICBQcm9jZXNzRW1pdFdhcm5pbmcodyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9O1xuXG5mdW5jdGlvbiBvbmNlV3JhcHBlcigpIHtcbiAgaWYgKCF0aGlzLmZpcmVkKSB7XG4gICAgdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLndyYXBGbik7XG4gICAgdGhpcy5maXJlZCA9IHRydWU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5jYWxsKHRoaXMudGFyZ2V0KTtcbiAgICByZXR1cm4gdGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCwgYXJndW1lbnRzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBvbmNlV3JhcHBlci5iaW5kKHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICAgICAgdGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4vLyBFbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWYgYW5kIG9ubHkgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0LCBldmVudHMsIHBvc2l0aW9uLCBpLCBvcmlnaW5hbExpc3RlbmVyO1xuXG4gICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgbGlzdCA9IGV2ZW50c1t0eXBlXTtcbiAgICAgIGlmIChsaXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3QubGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgb3JpZ2luYWxMaXN0ZW5lciA9IGxpc3RbaV0ubGlzdGVuZXI7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gMClcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpXG4gICAgICAgICAgZXZlbnRzW3R5cGVdID0gbGlzdFswXTtcblxuICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIG9yaWdpbmFsTGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycywgZXZlbnRzLCBpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZXZlbnRzKTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBMSUZPIG9yZGVyXG4gICAgICAgIGZvciAoaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5mdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCwgdHlwZSwgdW53cmFwKSB7XG4gIHZhciBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuICBpZiAoZXZsaXN0ZW5lciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHVud3JhcCA/IFtldmxpc3RlbmVyLmxpc3RlbmVyIHx8IGV2bGlzdGVuZXJdIDogW2V2bGlzdGVuZXJdO1xuXG4gIHJldHVybiB1bndyYXAgP1xuICAgIHVud3JhcExpc3RlbmVycyhldmxpc3RlbmVyKSA6IGFycmF5Q2xvbmUoZXZsaXN0ZW5lciwgZXZsaXN0ZW5lci5sZW5ndGgpO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIHRydWUpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnMgPSBmdW5jdGlvbiByYXdMaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLmxpc3RlbmVyQ291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5lckNvdW50LmNhbGwoZW1pdHRlciwgdHlwZSk7XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGxpc3RlbmVyQ291bnQ7XG5mdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChldmxpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3RPd25LZXlzKHRoaXMuX2V2ZW50cykgOiBbXTtcbn07XG5cbmZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLCBuKSB7XG4gIHZhciBjb3B5ID0gbmV3IEFycmF5KG4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSlcbiAgICBjb3B5W2ldID0gYXJyW2ldO1xuICByZXR1cm4gY29weTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAoOyBpbmRleCArIDEgPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKylcbiAgICBsaXN0W2luZGV4XSA9IGxpc3RbaW5kZXggKyAxXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycikge1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJldC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGFycltpXS5saXN0ZW5lciB8fCBhcnJbaV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gb25jZShlbWl0dGVyLCBuYW1lKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lcihlcnIpIHtcbiAgICAgIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIobmFtZSwgcmVzb2x2ZXIpO1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZXIoKSB7XG4gICAgICBpZiAodHlwZW9mIGVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBlcnJvckxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoW10uc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICB9O1xuXG4gICAgZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIHJlc29sdmVyLCB7IG9uY2U6IHRydWUgfSk7XG4gICAgaWYgKG5hbWUgIT09ICdlcnJvcicpIHtcbiAgICAgIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGVycm9yTGlzdGVuZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhZGRFcnJvckhhbmRsZXJJZkV2ZW50RW1pdHRlcihlbWl0dGVyLCBoYW5kbGVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgJ2Vycm9yJywgaGFuZGxlciwgZmxhZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCBuYW1lLCBsaXN0ZW5lciwgZmxhZ3MpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLm9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgIGVtaXR0ZXIub25jZShuYW1lLCBsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVtaXR0ZXIub24obmFtZSwgbGlzdGVuZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gRXZlbnRUYXJnZXQgZG9lcyBub3QgaGF2ZSBgZXJyb3JgIGV2ZW50IHNlbWFudGljcyBsaWtlIE5vZGVcbiAgICAvLyBFdmVudEVtaXR0ZXJzLCB3ZSBkbyBub3QgbGlzdGVuIGZvciBgZXJyb3JgIGV2ZW50cyBoZXJlLlxuICAgIGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcihuYW1lLCBmdW5jdGlvbiB3cmFwTGlzdGVuZXIoYXJnKSB7XG4gICAgICAvLyBJRSBkb2VzIG5vdCBoYXZlIGJ1aWx0aW4gYHsgb25jZTogdHJ1ZSB9YCBzdXBwb3J0IHNvIHdlXG4gICAgICAvLyBoYXZlIHRvIGRvIGl0IG1hbnVhbGx5LlxuICAgICAgaWYgKGZsYWdzLm9uY2UpIHtcbiAgICAgICAgZW1pdHRlci5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIHdyYXBMaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICBsaXN0ZW5lcihhcmcpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImVtaXR0ZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRXZlbnRFbWl0dGVyLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgZW1pdHRlcik7XG4gIH1cbn1cbiIsIi8qKlxuICogR3JhcGhvbG9neSBGb3JjZUF0bGFzMiBMYXlvdXQgRGVmYXVsdCBTZXR0aW5nc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGxpbkxvZ01vZGU6IGZhbHNlLFxuICBvdXRib3VuZEF0dHJhY3Rpb25EaXN0cmlidXRpb246IGZhbHNlLFxuICBhZGp1c3RTaXplczogZmFsc2UsXG4gIGVkZ2VXZWlnaHRJbmZsdWVuY2U6IDEsXG4gIHNjYWxpbmdSYXRpbzogMSxcbiAgc3Ryb25nR3Jhdml0eU1vZGU6IGZhbHNlLFxuICBncmF2aXR5OiAxLFxuICBzbG93RG93bjogMSxcbiAgYmFybmVzSHV0T3B0aW1pemU6IGZhbHNlLFxuICBiYXJuZXNIdXRUaGV0YTogMC41XG59O1xuIiwiLyoqXG4gKiBHcmFwaG9sb2d5IEZvcmNlQXRsYXMyIEhlbHBlcnNcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBNaXNjZWxsYW5lb3VzIGhlbHBlciBmdW5jdGlvbnMuXG4gKi9cblxuLyoqXG4gKiBDb25zdGFudHMuXG4gKi9cbnZhciBQUE4gPSAxMDtcbnZhciBQUEUgPSAzO1xuXG4vKipcbiAqIFZlcnkgc2ltcGxlIE9iamVjdC5hc3NpZ24tbGlrZSBmdW5jdGlvbi5cbiAqXG4gKiBAcGFyYW0gIHtvYmplY3R9IHRhcmdldCAgICAgICAtIEZpcnN0IG9iamVjdC5cbiAqIEBwYXJhbSAge29iamVjdH0gWy4uLm9iamVjdHNdIC0gT2JqZWN0cyB0byBtZXJnZS5cbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuZXhwb3J0cy5hc3NpZ24gPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIHRhcmdldCA9IHRhcmdldCB8fCB7fTtcblxuICB2YXIgb2JqZWN0cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykuc2xpY2UoMSksXG4gICAgaSxcbiAgICBrLFxuICAgIGw7XG5cbiAgZm9yIChpID0gMCwgbCA9IG9iamVjdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYgKCFvYmplY3RzW2ldKSBjb250aW51ZTtcblxuICAgIGZvciAoayBpbiBvYmplY3RzW2ldKSB0YXJnZXRba10gPSBvYmplY3RzW2ldW2tdO1xuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdXNlZCB0byB2YWxpZGF0ZSB0aGUgZ2l2ZW4gc2V0dGluZ3MuXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgIHNldHRpbmdzIC0gU2V0dGluZ3MgdG8gdmFsaWRhdGUuXG4gKiBAcmV0dXJuIHtvYmplY3R8bnVsbH1cbiAqL1xuZXhwb3J0cy52YWxpZGF0ZVNldHRpbmdzID0gZnVuY3Rpb24gKHNldHRpbmdzKSB7XG4gIGlmICgnbGluTG9nTW9kZScgaW4gc2V0dGluZ3MgJiYgdHlwZW9mIHNldHRpbmdzLmxpbkxvZ01vZGUgIT09ICdib29sZWFuJylcbiAgICByZXR1cm4ge21lc3NhZ2U6ICd0aGUgYGxpbkxvZ01vZGVgIHNldHRpbmcgc2hvdWxkIGJlIGEgYm9vbGVhbi4nfTtcblxuICBpZiAoXG4gICAgJ291dGJvdW5kQXR0cmFjdGlvbkRpc3RyaWJ1dGlvbicgaW4gc2V0dGluZ3MgJiZcbiAgICB0eXBlb2Ygc2V0dGluZ3Mub3V0Ym91bmRBdHRyYWN0aW9uRGlzdHJpYnV0aW9uICE9PSAnYm9vbGVhbidcbiAgKVxuICAgIHJldHVybiB7XG4gICAgICBtZXNzYWdlOlxuICAgICAgICAndGhlIGBvdXRib3VuZEF0dHJhY3Rpb25EaXN0cmlidXRpb25gIHNldHRpbmcgc2hvdWxkIGJlIGEgYm9vbGVhbi4nXG4gICAgfTtcblxuICBpZiAoJ2FkanVzdFNpemVzJyBpbiBzZXR0aW5ncyAmJiB0eXBlb2Ygc2V0dGluZ3MuYWRqdXN0U2l6ZXMgIT09ICdib29sZWFuJylcbiAgICByZXR1cm4ge21lc3NhZ2U6ICd0aGUgYGFkanVzdFNpemVzYCBzZXR0aW5nIHNob3VsZCBiZSBhIGJvb2xlYW4uJ307XG5cbiAgaWYgKFxuICAgICdlZGdlV2VpZ2h0SW5mbHVlbmNlJyBpbiBzZXR0aW5ncyAmJlxuICAgIHR5cGVvZiBzZXR0aW5ncy5lZGdlV2VpZ2h0SW5mbHVlbmNlICE9PSAnbnVtYmVyJ1xuICApXG4gICAgcmV0dXJuIHtcbiAgICAgIG1lc3NhZ2U6ICd0aGUgYGVkZ2VXZWlnaHRJbmZsdWVuY2VgIHNldHRpbmcgc2hvdWxkIGJlIGEgbnVtYmVyLidcbiAgICB9O1xuXG4gIGlmIChcbiAgICAnc2NhbGluZ1JhdGlvJyBpbiBzZXR0aW5ncyAmJlxuICAgICEodHlwZW9mIHNldHRpbmdzLnNjYWxpbmdSYXRpbyA9PT0gJ251bWJlcicgJiYgc2V0dGluZ3Muc2NhbGluZ1JhdGlvID49IDApXG4gIClcbiAgICByZXR1cm4ge21lc3NhZ2U6ICd0aGUgYHNjYWxpbmdSYXRpb2Agc2V0dGluZyBzaG91bGQgYmUgYSBudW1iZXIgPj0gMC4nfTtcblxuICBpZiAoXG4gICAgJ3N0cm9uZ0dyYXZpdHlNb2RlJyBpbiBzZXR0aW5ncyAmJlxuICAgIHR5cGVvZiBzZXR0aW5ncy5zdHJvbmdHcmF2aXR5TW9kZSAhPT0gJ2Jvb2xlYW4nXG4gIClcbiAgICByZXR1cm4ge21lc3NhZ2U6ICd0aGUgYHN0cm9uZ0dyYXZpdHlNb2RlYCBzZXR0aW5nIHNob3VsZCBiZSBhIGJvb2xlYW4uJ307XG5cbiAgaWYgKFxuICAgICdncmF2aXR5JyBpbiBzZXR0aW5ncyAmJlxuICAgICEodHlwZW9mIHNldHRpbmdzLmdyYXZpdHkgPT09ICdudW1iZXInICYmIHNldHRpbmdzLmdyYXZpdHkgPj0gMClcbiAgKVxuICAgIHJldHVybiB7bWVzc2FnZTogJ3RoZSBgZ3Jhdml0eWAgc2V0dGluZyBzaG91bGQgYmUgYSBudW1iZXIgPj0gMC4nfTtcblxuICBpZiAoXG4gICAgJ3Nsb3dEb3duJyBpbiBzZXR0aW5ncyAmJlxuICAgICEodHlwZW9mIHNldHRpbmdzLnNsb3dEb3duID09PSAnbnVtYmVyJyB8fCBzZXR0aW5ncy5zbG93RG93biA+PSAwKVxuICApXG4gICAgcmV0dXJuIHttZXNzYWdlOiAndGhlIGBzbG93RG93bmAgc2V0dGluZyBzaG91bGQgYmUgYSBudW1iZXIgPj0gMC4nfTtcblxuICBpZiAoXG4gICAgJ2Jhcm5lc0h1dE9wdGltaXplJyBpbiBzZXR0aW5ncyAmJlxuICAgIHR5cGVvZiBzZXR0aW5ncy5iYXJuZXNIdXRPcHRpbWl6ZSAhPT0gJ2Jvb2xlYW4nXG4gIClcbiAgICByZXR1cm4ge21lc3NhZ2U6ICd0aGUgYGJhcm5lc0h1dE9wdGltaXplYCBzZXR0aW5nIHNob3VsZCBiZSBhIGJvb2xlYW4uJ307XG5cbiAgaWYgKFxuICAgICdiYXJuZXNIdXRUaGV0YScgaW4gc2V0dGluZ3MgJiZcbiAgICAhKFxuICAgICAgdHlwZW9mIHNldHRpbmdzLmJhcm5lc0h1dFRoZXRhID09PSAnbnVtYmVyJyAmJlxuICAgICAgc2V0dGluZ3MuYmFybmVzSHV0VGhldGEgPj0gMFxuICAgIClcbiAgKVxuICAgIHJldHVybiB7bWVzc2FnZTogJ3RoZSBgYmFybmVzSHV0VGhldGFgIHNldHRpbmcgc2hvdWxkIGJlIGEgbnVtYmVyID49IDAuJ307XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIGdlbmVyYXRpbmcgYSBmbGF0IG1hdHJpeCBmb3IgYm90aCBub2RlcyAmIGVkZ2VzIG9mIHRoZSBnaXZlbiBncmFwaC5cbiAqXG4gKiBAcGFyYW0gIHtHcmFwaH0gICAgZ3JhcGggICAgICAgICAtIFRhcmdldCBncmFwaC5cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBnZXRFZGdlV2VpZ2h0IC0gRWRnZSB3ZWlnaHQgZ2V0dGVyIGZ1bmN0aW9uLlxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICAgICAgLSBCb3RoIG1hdHJpY2VzLlxuICovXG5leHBvcnRzLmdyYXBoVG9CeXRlQXJyYXlzID0gZnVuY3Rpb24gKGdyYXBoLCBnZXRFZGdlV2VpZ2h0KSB7XG4gIHZhciBvcmRlciA9IGdyYXBoLm9yZGVyO1xuICB2YXIgc2l6ZSA9IGdyYXBoLnNpemU7XG4gIHZhciBpbmRleCA9IHt9O1xuICB2YXIgajtcblxuICAvLyBOT1RFOiBmbG9hdDMyIGNvdWxkIGxlYWQgdG8gaXNzdWVzIGlmIGVkZ2UgYXJyYXkgbmVlZHMgdG8gaW5kZXggbGFyZ2VcbiAgLy8gbnVtYmVyIG9mIG5vZGVzLlxuICB2YXIgTm9kZU1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkob3JkZXIgKiBQUE4pO1xuICB2YXIgRWRnZU1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoc2l6ZSAqIFBQRSk7XG5cbiAgLy8gSXRlcmF0ZSB0aHJvdWdoIG5vZGVzXG4gIGogPSAwO1xuICBncmFwaC5mb3JFYWNoTm9kZShmdW5jdGlvbiAobm9kZSwgYXR0cikge1xuICAgIC8vIE5vZGUgaW5kZXhcbiAgICBpbmRleFtub2RlXSA9IGo7XG5cbiAgICAvLyBQb3B1bGF0aW5nIGJ5dGUgYXJyYXlcbiAgICBOb2RlTWF0cml4W2pdID0gYXR0ci54O1xuICAgIE5vZGVNYXRyaXhbaiArIDFdID0gYXR0ci55O1xuICAgIE5vZGVNYXRyaXhbaiArIDJdID0gMDsgLy8gZHhcbiAgICBOb2RlTWF0cml4W2ogKyAzXSA9IDA7IC8vIGR5XG4gICAgTm9kZU1hdHJpeFtqICsgNF0gPSAwOyAvLyBvbGRfZHhcbiAgICBOb2RlTWF0cml4W2ogKyA1XSA9IDA7IC8vIG9sZF9keVxuICAgIE5vZGVNYXRyaXhbaiArIDZdID0gMTsgLy8gbWFzc1xuICAgIE5vZGVNYXRyaXhbaiArIDddID0gMTsgLy8gY29udmVyZ2VuY2VcbiAgICBOb2RlTWF0cml4W2ogKyA4XSA9IGF0dHIuc2l6ZSB8fCAxO1xuICAgIE5vZGVNYXRyaXhbaiArIDldID0gYXR0ci5maXhlZCA/IDEgOiAwO1xuICAgIGogKz0gUFBOO1xuICB9KTtcblxuICAvLyBJdGVyYXRlIHRocm91Z2ggZWRnZXNcbiAgaiA9IDA7XG4gIGdyYXBoLmZvckVhY2hFZGdlKGZ1bmN0aW9uIChlZGdlLCBhdHRyLCBzb3VyY2UsIHRhcmdldCwgc2EsIHRhLCB1KSB7XG4gICAgdmFyIHNqID0gaW5kZXhbc291cmNlXTtcbiAgICB2YXIgdGogPSBpbmRleFt0YXJnZXRdO1xuXG4gICAgLy8gSGFuZGxpbmcgbm9kZSBtYXNzIHRocm91Z2ggZGVncmVlXG4gICAgTm9kZU1hdHJpeFtzaiArIDZdICs9IDE7XG4gICAgTm9kZU1hdHJpeFt0aiArIDZdICs9IDE7XG5cbiAgICAvLyBQb3B1bGF0aW5nIGJ5dGUgYXJyYXlcbiAgICBFZGdlTWF0cml4W2pdID0gc2o7XG4gICAgRWRnZU1hdHJpeFtqICsgMV0gPSB0ajtcbiAgICBFZGdlTWF0cml4W2ogKyAyXSA9IGdldEVkZ2VXZWlnaHQoZWRnZSwgYXR0ciwgc291cmNlLCB0YXJnZXQsIHNhLCB0YSwgdSk7XG4gICAgaiArPSBQUEU7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgbm9kZXM6IE5vZGVNYXRyaXgsXG4gICAgZWRnZXM6IEVkZ2VNYXRyaXhcbiAgfTtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gYXBwbHlpbmcgdGhlIGxheW91dCBiYWNrIHRvIHRoZSBncmFwaC5cbiAqXG4gKiBAcGFyYW0ge0dyYXBofSAgICAgICAgIGdyYXBoICAgICAgICAgLSBUYXJnZXQgZ3JhcGguXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gIE5vZGVNYXRyaXggICAgLSBOb2RlIG1hdHJpeC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb258bnVsbH0gb3V0cHV0UmVkdWNlciAtIEEgbm9kZSByZWR1Y2VyLlxuICovXG5leHBvcnRzLmFzc2lnbkxheW91dENoYW5nZXMgPSBmdW5jdGlvbiAoZ3JhcGgsIE5vZGVNYXRyaXgsIG91dHB1dFJlZHVjZXIpIHtcbiAgdmFyIGkgPSAwO1xuXG4gIGdyYXBoLnVwZGF0ZUVhY2hOb2RlQXR0cmlidXRlcyhmdW5jdGlvbiAobm9kZSwgYXR0cikge1xuICAgIGF0dHIueCA9IE5vZGVNYXRyaXhbaV07XG4gICAgYXR0ci55ID0gTm9kZU1hdHJpeFtpICsgMV07XG5cbiAgICBpICs9IFBQTjtcblxuICAgIHJldHVybiBvdXRwdXRSZWR1Y2VyID8gb3V0cHV0UmVkdWNlcihub2RlLCBhdHRyKSA6IGF0dHI7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiByZWFkaW5nIHRoZSBwb3NpdGlvbnMgKG9ubHkpIGZyb20gdGhlIGdyYXBoLCB0byB3cml0ZSB0aGVtIGluIHRoZSBtYXRyaXguXG4gKlxuICogQHBhcmFtIHtHcmFwaH0gICAgICAgIGdyYXBoICAgICAgLSBUYXJnZXQgZ3JhcGguXG4gKiBAcGFyYW0ge0Zsb2F0MzJBcnJheX0gTm9kZU1hdHJpeCAtIE5vZGUgbWF0cml4LlxuICovXG5leHBvcnRzLnJlYWRHcmFwaFBvc2l0aW9ucyA9IGZ1bmN0aW9uIChncmFwaCwgTm9kZU1hdHJpeCkge1xuICB2YXIgaSA9IDA7XG5cbiAgZ3JhcGguZm9yRWFjaE5vZGUoZnVuY3Rpb24gKG5vZGUsIGF0dHIpIHtcbiAgICBOb2RlTWF0cml4W2ldID0gYXR0ci54O1xuICAgIE5vZGVNYXRyaXhbaSArIDFdID0gYXR0ci55O1xuXG4gICAgaSArPSBQUE47XG4gIH0pO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiBjb2xsZWN0aW5nIHRoZSBsYXlvdXQgcG9zaXRpb25zLlxuICpcbiAqIEBwYXJhbSAge0dyYXBofSAgICAgICAgIGdyYXBoICAgICAgICAgLSBUYXJnZXQgZ3JhcGguXG4gKiBAcGFyYW0gIHtGbG9hdDMyQXJyYXl9ICBOb2RlTWF0cml4ICAgIC0gTm9kZSBtYXRyaXguXG4gKiBAcGFyYW0gIHtmdW5jdGlvbnxudWxsfSBvdXRwdXRSZWR1Y2VyIC0gQSBub2RlcyByZWR1Y2VyLlxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAtIE1hcCB0byBub2RlIHBvc2l0aW9ucy5cbiAqL1xuZXhwb3J0cy5jb2xsZWN0TGF5b3V0Q2hhbmdlcyA9IGZ1bmN0aW9uIChncmFwaCwgTm9kZU1hdHJpeCwgb3V0cHV0UmVkdWNlcikge1xuICB2YXIgbm9kZXMgPSBncmFwaC5ub2RlcygpLFxuICAgIHBvc2l0aW9ucyA9IHt9O1xuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gMCwgbCA9IE5vZGVNYXRyaXgubGVuZ3RoOyBpIDwgbDsgaSArPSBQUE4pIHtcbiAgICBpZiAob3V0cHV0UmVkdWNlcikge1xuICAgICAgdmFyIG5ld0F0dHIgPSBPYmplY3QuYXNzaWduKHt9LCBncmFwaC5nZXROb2RlQXR0cmlidXRlcyhub2Rlc1tqXSkpO1xuICAgICAgbmV3QXR0ci54ID0gTm9kZU1hdHJpeFtpXTtcbiAgICAgIG5ld0F0dHIueSA9IE5vZGVNYXRyaXhbaSArIDFdO1xuICAgICAgbmV3QXR0ciA9IG91dHB1dFJlZHVjZXIobm9kZXNbal0sIG5ld0F0dHIpO1xuICAgICAgcG9zaXRpb25zW25vZGVzW2pdXSA9IHtcbiAgICAgICAgeDogbmV3QXR0ci54LFxuICAgICAgICB5OiBuZXdBdHRyLnlcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHBvc2l0aW9uc1tub2Rlc1tqXV0gPSB7XG4gICAgICAgIHg6IE5vZGVNYXRyaXhbaV0sXG4gICAgICAgIHk6IE5vZGVNYXRyaXhbaSArIDFdXG4gICAgICB9O1xuICAgIH1cblxuICAgIGorKztcbiAgfVxuXG4gIHJldHVybiBwb3NpdGlvbnM7XG59O1xuXG4vKipcbiAqIEZ1bmN0aW9uIHJldHVybmluZyBhIHdlYiB3b3JrZXIgZnJvbSB0aGUgZ2l2ZW4gZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtICB7ZnVuY3Rpb259ICBmbiAtIEZ1bmN0aW9uIGZvciB0aGUgd29ya2VyLlxuICogQHJldHVybiB7RE9NU3RyaW5nfVxuICovXG5leHBvcnRzLmNyZWF0ZVdvcmtlciA9IGZ1bmN0aW9uIGNyZWF0ZVdvcmtlcihmbikge1xuICB2YXIgeFVSTCA9IHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTDtcbiAgdmFyIGNvZGUgPSBmbi50b1N0cmluZygpO1xuICB2YXIgb2JqZWN0VXJsID0geFVSTC5jcmVhdGVPYmplY3RVUkwoXG4gICAgbmV3IEJsb2IoWycoJyArIGNvZGUgKyAnKS5jYWxsKHRoaXMpOyddLCB7dHlwZTogJ3RleHQvamF2YXNjcmlwdCd9KVxuICApO1xuICB2YXIgd29ya2VyID0gbmV3IFdvcmtlcihvYmplY3RVcmwpO1xuICB4VVJMLnJldm9rZU9iamVjdFVSTChvYmplY3RVcmwpO1xuXG4gIHJldHVybiB3b3JrZXI7XG59O1xuIiwiLyoqXG4gKiBHcmFwaG9sb2d5IEZvcmNlQXRsYXMyIExheW91dFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogTGlicmFyeSBlbmRwb2ludC5cbiAqL1xudmFyIGlzR3JhcGggPSByZXF1aXJlKCdncmFwaG9sb2d5LXV0aWxzL2lzLWdyYXBoJyk7XG52YXIgY3JlYXRlRWRnZVdlaWdodEdldHRlciA9XG4gIHJlcXVpcmUoJ2dyYXBob2xvZ3ktdXRpbHMvZ2V0dGVycycpLmNyZWF0ZUVkZ2VXZWlnaHRHZXR0ZXI7XG52YXIgaXRlcmF0ZSA9IHJlcXVpcmUoJy4vaXRlcmF0ZS5qcycpO1xudmFyIGhlbHBlcnMgPSByZXF1aXJlKCcuL2hlbHBlcnMuanMnKTtcblxudmFyIERFRkFVTFRfU0VUVElOR1MgPSByZXF1aXJlKCcuL2RlZmF1bHRzLmpzJyk7XG5cbi8qKlxuICogQXNidHJhY3QgZnVuY3Rpb24gdXNlZCB0byBydW4gYSBjZXJ0YWluIG51bWJlciBvZiBpdGVyYXRpb25zLlxuICpcbiAqIEBwYXJhbSAge2Jvb2xlYW59ICAgICAgIGFzc2lnbiAgICAgICAgICAtIFdoZXRoZXIgdG8gYXNzaWduIHBvc2l0aW9ucy5cbiAqIEBwYXJhbSAge0dyYXBofSAgICAgICAgIGdyYXBoICAgICAgICAgICAtIFRhcmdldCBncmFwaC5cbiAqIEBwYXJhbSAge29iamVjdHxudW1iZXJ9IHBhcmFtcyAgICAgICAgICAtIElmIG51bWJlciwgcGFyYW1zLml0ZXJhdGlvbnMsIGVsc2U6XG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgIGdldFdlaWdodCAgICAgLSBFZGdlIHdlaWdodCBnZXR0ZXIgZnVuY3Rpb24uXG4gKiBAcGFyYW0gIHtudW1iZXJ9ICAgICAgICAgIGl0ZXJhdGlvbnMgICAgLSBOdW1iZXIgb2YgaXRlcmF0aW9ucy5cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufG51bGx9ICAgb3V0cHV0UmVkdWNlciAtIEEgbm9kZSByZWR1Y2VyXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgICAgICAgIFtzZXR0aW5nc10gICAgLSBTZXR0aW5ncy5cbiAqIEByZXR1cm4ge29iamVjdHx1bmRlZmluZWR9XG4gKi9cbmZ1bmN0aW9uIGFic3RyYWN0U3luY2hyb25vdXNMYXlvdXQoYXNzaWduLCBncmFwaCwgcGFyYW1zKSB7XG4gIGlmICghaXNHcmFwaChncmFwaCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2dyYXBob2xvZ3ktbGF5b3V0LWZvcmNlYXRsYXMyOiB0aGUgZ2l2ZW4gZ3JhcGggaXMgbm90IGEgdmFsaWQgZ3JhcGhvbG9neSBpbnN0YW5jZS4nXG4gICAgKTtcblxuICBpZiAodHlwZW9mIHBhcmFtcyA9PT0gJ251bWJlcicpIHBhcmFtcyA9IHtpdGVyYXRpb25zOiBwYXJhbXN9O1xuXG4gIHZhciBpdGVyYXRpb25zID0gcGFyYW1zLml0ZXJhdGlvbnM7XG5cbiAgaWYgKHR5cGVvZiBpdGVyYXRpb25zICE9PSAnbnVtYmVyJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnZ3JhcGhvbG9neS1sYXlvdXQtZm9yY2VhdGxhczI6IGludmFsaWQgbnVtYmVyIG9mIGl0ZXJhdGlvbnMuJ1xuICAgICk7XG5cbiAgaWYgKGl0ZXJhdGlvbnMgPD0gMClcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnZ3JhcGhvbG9neS1sYXlvdXQtZm9yY2VhdGxhczI6IHlvdSBzaG91bGQgcHJvdmlkZSBhIHBvc2l0aXZlIG51bWJlciBvZiBpdGVyYXRpb25zLidcbiAgICApO1xuXG4gIHZhciBnZXRFZGdlV2VpZ2h0ID0gY3JlYXRlRWRnZVdlaWdodEdldHRlcihwYXJhbXMuZ2V0RWRnZVdlaWdodCkuZnJvbUVudHJ5O1xuXG4gIHZhciBvdXRwdXRSZWR1Y2VyID1cbiAgICB0eXBlb2YgcGFyYW1zLm91dHB1dFJlZHVjZXIgPT09ICdmdW5jdGlvbicgPyBwYXJhbXMub3V0cHV0UmVkdWNlciA6IG51bGw7XG5cbiAgLy8gVmFsaWRhdGluZyBzZXR0aW5nc1xuICB2YXIgc2V0dGluZ3MgPSBoZWxwZXJzLmFzc2lnbih7fSwgREVGQVVMVF9TRVRUSU5HUywgcGFyYW1zLnNldHRpbmdzKTtcbiAgdmFyIHZhbGlkYXRpb25FcnJvciA9IGhlbHBlcnMudmFsaWRhdGVTZXR0aW5ncyhzZXR0aW5ncyk7XG5cbiAgaWYgKHZhbGlkYXRpb25FcnJvcilcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnZ3JhcGhvbG9neS1sYXlvdXQtZm9yY2VhdGxhczI6ICcgKyB2YWxpZGF0aW9uRXJyb3IubWVzc2FnZVxuICAgICk7XG5cbiAgLy8gQnVpbGRpbmcgbWF0cmljZXNcbiAgdmFyIG1hdHJpY2VzID0gaGVscGVycy5ncmFwaFRvQnl0ZUFycmF5cyhncmFwaCwgZ2V0RWRnZVdlaWdodCk7XG5cbiAgdmFyIGk7XG5cbiAgLy8gSXRlcmF0aW5nXG4gIGZvciAoaSA9IDA7IGkgPCBpdGVyYXRpb25zOyBpKyspXG4gICAgaXRlcmF0ZShzZXR0aW5ncywgbWF0cmljZXMubm9kZXMsIG1hdHJpY2VzLmVkZ2VzKTtcblxuICAvLyBBcHBseWluZ1xuICBpZiAoYXNzaWduKSB7XG4gICAgaGVscGVycy5hc3NpZ25MYXlvdXRDaGFuZ2VzKGdyYXBoLCBtYXRyaWNlcy5ub2Rlcywgb3V0cHV0UmVkdWNlcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIGhlbHBlcnMuY29sbGVjdExheW91dENoYW5nZXMoZ3JhcGgsIG1hdHJpY2VzLm5vZGVzKTtcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiByZXR1cm5pbmcgc2FuZSBsYXlvdXQgc2V0dGluZ3MgZm9yIHRoZSBnaXZlbiBncmFwaC5cbiAqXG4gKiBAcGFyYW0gIHtHcmFwaHxudW1iZXJ9IGdyYXBoIC0gVGFyZ2V0IGdyYXBoIG9yIGdyYXBoIG9yZGVyLlxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5mdW5jdGlvbiBpbmZlclNldHRpbmdzKGdyYXBoKSB7XG4gIHZhciBvcmRlciA9IHR5cGVvZiBncmFwaCA9PT0gJ251bWJlcicgPyBncmFwaCA6IGdyYXBoLm9yZGVyO1xuXG4gIHJldHVybiB7XG4gICAgYmFybmVzSHV0T3B0aW1pemU6IG9yZGVyID4gMjAwMCxcbiAgICBzdHJvbmdHcmF2aXR5TW9kZTogdHJ1ZSxcbiAgICBncmF2aXR5OiAwLjA1LFxuICAgIHNjYWxpbmdSYXRpbzogMTAsXG4gICAgc2xvd0Rvd246IDEgKyBNYXRoLmxvZyhvcmRlcilcbiAgfTtcbn1cblxuLyoqXG4gKiBFeHBvcnRpbmcuXG4gKi9cbnZhciBzeW5jaHJvbm91c0xheW91dCA9IGFic3RyYWN0U3luY2hyb25vdXNMYXlvdXQuYmluZChudWxsLCBmYWxzZSk7XG5zeW5jaHJvbm91c0xheW91dC5hc3NpZ24gPSBhYnN0cmFjdFN5bmNocm9ub3VzTGF5b3V0LmJpbmQobnVsbCwgdHJ1ZSk7XG5zeW5jaHJvbm91c0xheW91dC5pbmZlclNldHRpbmdzID0gaW5mZXJTZXR0aW5ncztcblxubW9kdWxlLmV4cG9ydHMgPSBzeW5jaHJvbm91c0xheW91dDtcbiIsIi8qIGVzbGludCBuby1jb25zdGFudC1jb25kaXRpb246IDAgKi9cbi8qKlxuICogR3JhcGhvbG9neSBGb3JjZUF0bGFzMiBJdGVyYXRpb25cbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIEZ1bmN0aW9uIHVzZWQgdG8gcGVyZm9ybSBhIHNpbmdsZSBpdGVyYXRpb24gb2YgdGhlIGFsZ29yaXRobS5cbiAqL1xuXG4vKipcbiAqIE1hdHJpY2VzIHByb3BlcnRpZXMgYWNjZXNzb3JzLlxuICovXG52YXIgTk9ERV9YID0gMDtcbnZhciBOT0RFX1kgPSAxO1xudmFyIE5PREVfRFggPSAyO1xudmFyIE5PREVfRFkgPSAzO1xudmFyIE5PREVfT0xEX0RYID0gNDtcbnZhciBOT0RFX09MRF9EWSA9IDU7XG52YXIgTk9ERV9NQVNTID0gNjtcbnZhciBOT0RFX0NPTlZFUkdFTkNFID0gNztcbnZhciBOT0RFX1NJWkUgPSA4O1xudmFyIE5PREVfRklYRUQgPSA5O1xuXG52YXIgRURHRV9TT1VSQ0UgPSAwO1xudmFyIEVER0VfVEFSR0VUID0gMTtcbnZhciBFREdFX1dFSUdIVCA9IDI7XG5cbnZhciBSRUdJT05fTk9ERSA9IDA7XG52YXIgUkVHSU9OX0NFTlRFUl9YID0gMTtcbnZhciBSRUdJT05fQ0VOVEVSX1kgPSAyO1xudmFyIFJFR0lPTl9TSVpFID0gMztcbnZhciBSRUdJT05fTkVYVF9TSUJMSU5HID0gNDtcbnZhciBSRUdJT05fRklSU1RfQ0hJTEQgPSA1O1xudmFyIFJFR0lPTl9NQVNTID0gNjtcbnZhciBSRUdJT05fTUFTU19DRU5URVJfWCA9IDc7XG52YXIgUkVHSU9OX01BU1NfQ0VOVEVSX1kgPSA4O1xuXG52YXIgU1VCRElWSVNJT05fQVRURU1QVFMgPSAzO1xuXG4vKipcbiAqIENvbnN0YW50cy5cbiAqL1xudmFyIFBQTiA9IDEwO1xudmFyIFBQRSA9IDM7XG52YXIgUFBSID0gOTtcblxudmFyIE1BWF9GT1JDRSA9IDEwO1xuXG4vKipcbiAqIEZ1bmN0aW9uIHVzZWQgdG8gcGVyZm9ybSBhIHNpbmdsZSBpbnRlcmF0aW9uIG9mIHRoZSBhbGdvcml0aG0uXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgICBvcHRpb25zICAgIC0gTGF5b3V0IG9wdGlvbnMuXG4gKiBAcGFyYW0gIHtGbG9hdDMyQXJyYXl9IE5vZGVNYXRyaXggLSBOb2RlIGRhdGEuXG4gKiBAcGFyYW0gIHtGbG9hdDMyQXJyYXl9IEVkZ2VNYXRyaXggLSBFZGdlIGRhdGEuXG4gKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgLSBTb21lIG1ldGFkYXRhLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGl0ZXJhdGUob3B0aW9ucywgTm9kZU1hdHJpeCwgRWRnZU1hdHJpeCkge1xuICAvLyBJbml0aWFsaXppbmcgdmFyaWFibGVzXG4gIHZhciBsLCByLCBuLCBuMSwgbjIsIHJuLCBlLCB3LCBnLCBzO1xuXG4gIHZhciBvcmRlciA9IE5vZGVNYXRyaXgubGVuZ3RoLFxuICAgIHNpemUgPSBFZGdlTWF0cml4Lmxlbmd0aDtcblxuICB2YXIgYWRqdXN0U2l6ZXMgPSBvcHRpb25zLmFkanVzdFNpemVzO1xuXG4gIHZhciB0aGV0YVNxdWFyZWQgPSBvcHRpb25zLmJhcm5lc0h1dFRoZXRhICogb3B0aW9ucy5iYXJuZXNIdXRUaGV0YTtcblxuICB2YXIgb3V0Ym91bmRBdHRDb21wZW5zYXRpb24sIGNvZWZmaWNpZW50LCB4RGlzdCwgeURpc3QsIGV3YywgZGlzdGFuY2UsIGZhY3RvcjtcblxuICB2YXIgUmVnaW9uTWF0cml4ID0gW107XG5cbiAgLy8gMSkgSW5pdGlhbGl6aW5nIGxheW91dCBkYXRhXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBSZXNldHRpbmcgcG9zaXRpb25zICYgY29tcHV0aW5nIG1heCB2YWx1ZXNcbiAgZm9yIChuID0gMDsgbiA8IG9yZGVyOyBuICs9IFBQTikge1xuICAgIE5vZGVNYXRyaXhbbiArIE5PREVfT0xEX0RYXSA9IE5vZGVNYXRyaXhbbiArIE5PREVfRFhdO1xuICAgIE5vZGVNYXRyaXhbbiArIE5PREVfT0xEX0RZXSA9IE5vZGVNYXRyaXhbbiArIE5PREVfRFldO1xuICAgIE5vZGVNYXRyaXhbbiArIE5PREVfRFhdID0gMDtcbiAgICBOb2RlTWF0cml4W24gKyBOT0RFX0RZXSA9IDA7XG4gIH1cblxuICAvLyBJZiBvdXRib3VuZCBhdHRyYWN0aW9uIGRpc3RyaWJ1dGlvbiwgY29tcGVuc2F0ZVxuICBpZiAob3B0aW9ucy5vdXRib3VuZEF0dHJhY3Rpb25EaXN0cmlidXRpb24pIHtcbiAgICBvdXRib3VuZEF0dENvbXBlbnNhdGlvbiA9IDA7XG4gICAgZm9yIChuID0gMDsgbiA8IG9yZGVyOyBuICs9IFBQTikge1xuICAgICAgb3V0Ym91bmRBdHRDb21wZW5zYXRpb24gKz0gTm9kZU1hdHJpeFtuICsgTk9ERV9NQVNTXTtcbiAgICB9XG5cbiAgICBvdXRib3VuZEF0dENvbXBlbnNhdGlvbiAvPSBvcmRlciAvIFBQTjtcbiAgfVxuXG4gIC8vIDEuYmlzKSBCYXJuZXMtSHV0IGNvbXB1dGF0aW9uXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgaWYgKG9wdGlvbnMuYmFybmVzSHV0T3B0aW1pemUpIHtcbiAgICAvLyBTZXR0aW5nIHVwXG4gICAgdmFyIG1pblggPSBJbmZpbml0eSxcbiAgICAgIG1heFggPSAtSW5maW5pdHksXG4gICAgICBtaW5ZID0gSW5maW5pdHksXG4gICAgICBtYXhZID0gLUluZmluaXR5LFxuICAgICAgcSxcbiAgICAgIHEyLFxuICAgICAgc3ViZGl2aXNpb25BdHRlbXB0cztcblxuICAgIC8vIENvbXB1dGluZyBtaW4gYW5kIG1heCB2YWx1ZXNcbiAgICBmb3IgKG4gPSAwOyBuIDwgb3JkZXI7IG4gKz0gUFBOKSB7XG4gICAgICBtaW5YID0gTWF0aC5taW4obWluWCwgTm9kZU1hdHJpeFtuICsgTk9ERV9YXSk7XG4gICAgICBtYXhYID0gTWF0aC5tYXgobWF4WCwgTm9kZU1hdHJpeFtuICsgTk9ERV9YXSk7XG4gICAgICBtaW5ZID0gTWF0aC5taW4obWluWSwgTm9kZU1hdHJpeFtuICsgTk9ERV9ZXSk7XG4gICAgICBtYXhZID0gTWF0aC5tYXgobWF4WSwgTm9kZU1hdHJpeFtuICsgTk9ERV9ZXSk7XG4gICAgfVxuXG4gICAgLy8gc3F1YXJpZnkgYm91bmRzLCBpdCdzIGEgcXVhZHRyZWVcbiAgICB2YXIgZHggPSBtYXhYIC0gbWluWCxcbiAgICAgIGR5ID0gbWF4WSAtIG1pblk7XG4gICAgaWYgKGR4ID4gZHkpIHtcbiAgICAgIG1pblkgLT0gKGR4IC0gZHkpIC8gMjtcbiAgICAgIG1heFkgPSBtaW5ZICsgZHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pblggLT0gKGR5IC0gZHgpIC8gMjtcbiAgICAgIG1heFggPSBtaW5YICsgZHk7XG4gICAgfVxuXG4gICAgLy8gQnVpbGQgdGhlIEJhcm5lcyBIdXQgcm9vdCByZWdpb25cbiAgICBSZWdpb25NYXRyaXhbMCArIFJFR0lPTl9OT0RFXSA9IC0xO1xuICAgIFJlZ2lvbk1hdHJpeFswICsgUkVHSU9OX0NFTlRFUl9YXSA9IChtaW5YICsgbWF4WCkgLyAyO1xuICAgIFJlZ2lvbk1hdHJpeFswICsgUkVHSU9OX0NFTlRFUl9ZXSA9IChtaW5ZICsgbWF4WSkgLyAyO1xuICAgIFJlZ2lvbk1hdHJpeFswICsgUkVHSU9OX1NJWkVdID0gTWF0aC5tYXgobWF4WCAtIG1pblgsIG1heFkgLSBtaW5ZKTtcbiAgICBSZWdpb25NYXRyaXhbMCArIFJFR0lPTl9ORVhUX1NJQkxJTkddID0gLTE7XG4gICAgUmVnaW9uTWF0cml4WzAgKyBSRUdJT05fRklSU1RfQ0hJTERdID0gLTE7XG4gICAgUmVnaW9uTWF0cml4WzAgKyBSRUdJT05fTUFTU10gPSAwO1xuICAgIFJlZ2lvbk1hdHJpeFswICsgUkVHSU9OX01BU1NfQ0VOVEVSX1hdID0gMDtcbiAgICBSZWdpb25NYXRyaXhbMCArIFJFR0lPTl9NQVNTX0NFTlRFUl9ZXSA9IDA7XG5cbiAgICAvLyBBZGQgZWFjaCBub2RlIGluIHRoZSB0cmVlXG4gICAgbCA9IDE7XG4gICAgZm9yIChuID0gMDsgbiA8IG9yZGVyOyBuICs9IFBQTikge1xuICAgICAgLy8gQ3VycmVudCByZWdpb24sIHN0YXJ0aW5nIHdpdGggcm9vdFxuICAgICAgciA9IDA7XG4gICAgICBzdWJkaXZpc2lvbkF0dGVtcHRzID0gU1VCRElWSVNJT05fQVRURU1QVFM7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIC8vIEFyZSB0aGVyZSBzdWItcmVnaW9ucz9cblxuICAgICAgICAvLyBXZSBsb29rIGF0IGZpcnN0IGNoaWxkIGluZGV4XG4gICAgICAgIGlmIChSZWdpb25NYXRyaXhbciArIFJFR0lPTl9GSVJTVF9DSElMRF0gPj0gMCkge1xuICAgICAgICAgIC8vIFRoZXJlIGFyZSBzdWItcmVnaW9uc1xuXG4gICAgICAgICAgLy8gV2UganVzdCBpdGVyYXRlIHRvIGZpbmQgYSBcImxlYWZcIiBvZiB0aGUgdHJlZVxuICAgICAgICAgIC8vIHRoYXQgaXMgYW4gZW1wdHkgcmVnaW9uIG9yIGEgcmVnaW9uIHdpdGggYSBzaW5nbGUgbm9kZVxuICAgICAgICAgIC8vIChzZWUgbmV4dCBjYXNlKVxuXG4gICAgICAgICAgLy8gRmluZCB0aGUgcXVhZHJhbnQgb2YgblxuICAgICAgICAgIGlmIChOb2RlTWF0cml4W24gKyBOT0RFX1hdIDwgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fQ0VOVEVSX1hdKSB7XG4gICAgICAgICAgICBpZiAoTm9kZU1hdHJpeFtuICsgTk9ERV9ZXSA8IFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX0NFTlRFUl9ZXSkge1xuICAgICAgICAgICAgICAvLyBUb3AgTGVmdCBxdWFydGVyXG4gICAgICAgICAgICAgIHEgPSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9GSVJTVF9DSElMRF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBCb3R0b20gTGVmdCBxdWFydGVyXG4gICAgICAgICAgICAgIHEgPSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9GSVJTVF9DSElMRF0gKyBQUFI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChOb2RlTWF0cml4W24gKyBOT0RFX1ldIDwgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fQ0VOVEVSX1ldKSB7XG4gICAgICAgICAgICAgIC8vIFRvcCBSaWdodCBxdWFydGVyXG4gICAgICAgICAgICAgIHEgPSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9GSVJTVF9DSElMRF0gKyBQUFIgKiAyO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gQm90dG9tIFJpZ2h0IHF1YXJ0ZXJcbiAgICAgICAgICAgICAgcSA9IFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX0ZJUlNUX0NISUxEXSArIFBQUiAqIDM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVXBkYXRlIGNlbnRlciBvZiBtYXNzIGFuZCBtYXNzICh3ZSBvbmx5IGRvIGl0IGZvciBub24tbGVhdmUgcmVnaW9ucylcbiAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTX0NFTlRFUl9YXSA9XG4gICAgICAgICAgICAoUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTUFTU19DRU5URVJfWF0gKlxuICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTXSArXG4gICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfWF0gKiBOb2RlTWF0cml4W24gKyBOT0RFX01BU1NdKSAvXG4gICAgICAgICAgICAoUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTUFTU10gKyBOb2RlTWF0cml4W24gKyBOT0RFX01BU1NdKTtcblxuICAgICAgICAgIFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX01BU1NfQ0VOVEVSX1ldID1cbiAgICAgICAgICAgIChSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTX0NFTlRFUl9ZXSAqXG4gICAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX01BU1NdICtcbiAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9ZXSAqIE5vZGVNYXRyaXhbbiArIE5PREVfTUFTU10pIC9cbiAgICAgICAgICAgIChSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTXSArIE5vZGVNYXRyaXhbbiArIE5PREVfTUFTU10pO1xuXG4gICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTUFTU10gKz0gTm9kZU1hdHJpeFtuICsgTk9ERV9NQVNTXTtcblxuICAgICAgICAgIC8vIEl0ZXJhdGUgb24gdGhlIHJpZ2h0IHF1YWRyYW50XG4gICAgICAgICAgciA9IHE7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlcmUgYXJlIG5vIHN1Yi1yZWdpb25zOiB3ZSBhcmUgaW4gYSBcImxlYWZcIlxuXG4gICAgICAgICAgLy8gSXMgdGhlcmUgYSBub2RlIGluIHRoaXMgbGVhdmU/XG4gICAgICAgICAgaWYgKFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX05PREVdIDwgMCkge1xuICAgICAgICAgICAgLy8gVGhlcmUgaXMgbm8gbm9kZSBpbiByZWdpb246XG4gICAgICAgICAgICAvLyB3ZSByZWNvcmQgbm9kZSBuIGFuZCBnbyBvblxuICAgICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTk9ERV0gPSBuO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoZXJlIGlzIGEgbm9kZSBpbiB0aGlzIHJlZ2lvblxuXG4gICAgICAgICAgICAvLyBXZSB3aWxsIG5lZWQgdG8gY3JlYXRlIHN1Yi1yZWdpb25zLCBzdGljayB0aGUgdHdvXG4gICAgICAgICAgICAvLyBub2RlcyAodGhlIG9sZCBvbmUgclswXSBhbmQgdGhlIG5ldyBvbmUgbikgaW4gdHdvXG4gICAgICAgICAgICAvLyBzdWJyZWdpb25zLiBJZiB0aGV5IGZhbGwgaW4gdGhlIHNhbWUgcXVhZHJhbnQsXG4gICAgICAgICAgICAvLyB3ZSB3aWxsIGl0ZXJhdGUuXG5cbiAgICAgICAgICAgIC8vIENyZWF0ZSBzdWItcmVnaW9uc1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fRklSU1RfQ0hJTERdID0gbCAqIFBQUjtcbiAgICAgICAgICAgIHcgPSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9TSVpFXSAvIDI7IC8vIG5ldyBzaXplIChoYWxmKVxuXG4gICAgICAgICAgICAvLyBOT1RFOiB3ZSB1c2Ugc2NyZWVuIGNvb3JkaW5hdGVzXG4gICAgICAgICAgICAvLyBmcm9tIFRvcCBMZWZ0IHRvIEJvdHRvbSBSaWdodFxuXG4gICAgICAgICAgICAvLyBUb3AgTGVmdCBzdWItcmVnaW9uXG4gICAgICAgICAgICBnID0gUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fRklSU1RfQ0hJTERdO1xuXG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9OT0RFXSA9IC0xO1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fQ0VOVEVSX1hdID1cbiAgICAgICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fQ0VOVEVSX1hdIC0gdztcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX0NFTlRFUl9ZXSA9XG4gICAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX0NFTlRFUl9ZXSAtIHc7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9TSVpFXSA9IHc7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9ORVhUX1NJQkxJTkddID0gZyArIFBQUjtcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX0ZJUlNUX0NISUxEXSA9IC0xO1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fTUFTU10gPSAwO1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fTUFTU19DRU5URVJfWF0gPSAwO1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fTUFTU19DRU5URVJfWV0gPSAwO1xuXG4gICAgICAgICAgICAvLyBCb3R0b20gTGVmdCBzdWItcmVnaW9uXG4gICAgICAgICAgICBnICs9IFBQUjtcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX05PREVdID0gLTE7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9DRU5URVJfWF0gPVxuICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9DRU5URVJfWF0gLSB3O1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fQ0VOVEVSX1ldID1cbiAgICAgICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fQ0VOVEVSX1ldICsgdztcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX1NJWkVdID0gdztcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX05FWFRfU0lCTElOR10gPSBnICsgUFBSO1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fRklSU1RfQ0hJTERdID0gLTE7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTXSA9IDA7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTX0NFTlRFUl9YXSA9IDA7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTX0NFTlRFUl9ZXSA9IDA7XG5cbiAgICAgICAgICAgIC8vIFRvcCBSaWdodCBzdWItcmVnaW9uXG4gICAgICAgICAgICBnICs9IFBQUjtcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX05PREVdID0gLTE7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9DRU5URVJfWF0gPVxuICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9DRU5URVJfWF0gKyB3O1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fQ0VOVEVSX1ldID1cbiAgICAgICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fQ0VOVEVSX1ldIC0gdztcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX1NJWkVdID0gdztcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX05FWFRfU0lCTElOR10gPSBnICsgUFBSO1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fRklSU1RfQ0hJTERdID0gLTE7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTXSA9IDA7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTX0NFTlRFUl9YXSA9IDA7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTX0NFTlRFUl9ZXSA9IDA7XG5cbiAgICAgICAgICAgIC8vIEJvdHRvbSBSaWdodCBzdWItcmVnaW9uXG4gICAgICAgICAgICBnICs9IFBQUjtcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX05PREVdID0gLTE7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9DRU5URVJfWF0gPVxuICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9DRU5URVJfWF0gKyB3O1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fQ0VOVEVSX1ldID1cbiAgICAgICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fQ0VOVEVSX1ldICsgdztcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX1NJWkVdID0gdztcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtnICsgUkVHSU9OX05FWFRfU0lCTElOR10gPVxuICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9ORVhUX1NJQkxJTkddO1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W2cgKyBSRUdJT05fRklSU1RfQ0hJTERdID0gLTE7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTXSA9IDA7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTX0NFTlRFUl9YXSA9IDA7XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbZyArIFJFR0lPTl9NQVNTX0NFTlRFUl9ZXSA9IDA7XG5cbiAgICAgICAgICAgIGwgKz0gNDtcblxuICAgICAgICAgICAgLy8gTm93IHRoZSBnb2FsIGlzIHRvIGZpbmQgdHdvIGRpZmZlcmVudCBzdWItcmVnaW9uc1xuICAgICAgICAgICAgLy8gZm9yIHRoZSB0d28gbm9kZXM6IHRoZSBvbmUgcHJldmlvdXNseSByZWNvcmRlZCAoclswXSlcbiAgICAgICAgICAgIC8vIGFuZCB0aGUgb25lIHdlIHdhbnQgdG8gYWRkIChuKVxuXG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBxdWFkcmFudCBvZiB0aGUgb2xkIG5vZGVcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgTm9kZU1hdHJpeFtSZWdpb25NYXRyaXhbciArIFJFR0lPTl9OT0RFXSArIE5PREVfWF0gPFxuICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9DRU5URVJfWF1cbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtSZWdpb25NYXRyaXhbciArIFJFR0lPTl9OT0RFXSArIE5PREVfWV0gPFxuICAgICAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX0NFTlRFUl9ZXVxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAvLyBUb3AgTGVmdCBxdWFydGVyXG4gICAgICAgICAgICAgICAgcSA9IFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX0ZJUlNUX0NISUxEXTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBCb3R0b20gTGVmdCBxdWFydGVyXG4gICAgICAgICAgICAgICAgcSA9IFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX0ZJUlNUX0NISUxEXSArIFBQUjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTk9ERV0gKyBOT0RFX1ldIDxcbiAgICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9DRU5URVJfWV1cbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgLy8gVG9wIFJpZ2h0IHF1YXJ0ZXJcbiAgICAgICAgICAgICAgICBxID0gUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fRklSU1RfQ0hJTERdICsgUFBSICogMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBCb3R0b20gUmlnaHQgcXVhcnRlclxuICAgICAgICAgICAgICAgIHEgPSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9GSVJTVF9DSElMRF0gKyBQUFIgKiAzO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFdlIHJlbW92ZSByWzBdIGZyb20gdGhlIHJlZ2lvbiByLCBhZGQgaXRzIG1hc3MgdG8gciBhbmQgcmVjb3JkIGl0IGluIHFcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX01BU1NdID1cbiAgICAgICAgICAgICAgTm9kZU1hdHJpeFtSZWdpb25NYXRyaXhbciArIFJFR0lPTl9OT0RFXSArIE5PREVfTUFTU107XG4gICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTX0NFTlRFUl9YXSA9XG4gICAgICAgICAgICAgIE5vZGVNYXRyaXhbUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTk9ERV0gKyBOT0RFX1hdO1xuICAgICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTUFTU19DRU5URVJfWV0gPVxuICAgICAgICAgICAgICBOb2RlTWF0cml4W1JlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX05PREVdICsgTk9ERV9ZXTtcblxuICAgICAgICAgICAgUmVnaW9uTWF0cml4W3EgKyBSRUdJT05fTk9ERV0gPSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9OT0RFXTtcbiAgICAgICAgICAgIFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX05PREVdID0gLTE7XG5cbiAgICAgICAgICAgIC8vIEZpbmQgdGhlIHF1YWRyYW50IG9mIG5cbiAgICAgICAgICAgIGlmIChOb2RlTWF0cml4W24gKyBOT0RFX1hdIDwgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fQ0VOVEVSX1hdKSB7XG4gICAgICAgICAgICAgIGlmIChOb2RlTWF0cml4W24gKyBOT0RFX1ldIDwgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fQ0VOVEVSX1ldKSB7XG4gICAgICAgICAgICAgICAgLy8gVG9wIExlZnQgcXVhcnRlclxuICAgICAgICAgICAgICAgIHEyID0gUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fRklSU1RfQ0hJTERdO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEJvdHRvbSBMZWZ0IHF1YXJ0ZXJcbiAgICAgICAgICAgICAgICBxMiA9IFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX0ZJUlNUX0NISUxEXSArIFBQUjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgaWYgKE5vZGVNYXRyaXhbbiArIE5PREVfWV0gPCBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9DRU5URVJfWV0pIHtcbiAgICAgICAgICAgICAgICAvLyBUb3AgUmlnaHQgcXVhcnRlclxuICAgICAgICAgICAgICAgIHEyID0gUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fRklSU1RfQ0hJTERdICsgUFBSICogMjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBCb3R0b20gUmlnaHQgcXVhcnRlclxuICAgICAgICAgICAgICAgIHEyID0gUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fRklSU1RfQ0hJTERdICsgUFBSICogMztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocSA9PT0gcTIpIHtcbiAgICAgICAgICAgICAgLy8gSWYgYm90aCBub2RlcyBhcmUgaW4gdGhlIHNhbWUgcXVhZHJhbnQsXG4gICAgICAgICAgICAgIC8vIHdlIGhhdmUgdG8gdHJ5IGl0IGFnYWluIG9uIHRoaXMgcXVhZHJhbnRcbiAgICAgICAgICAgICAgaWYgKHN1YmRpdmlzaW9uQXR0ZW1wdHMtLSkge1xuICAgICAgICAgICAgICAgIHIgPSBxO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyB3aGlsZVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHdlIGFyZSBvdXQgb2YgcHJlY2lzaW9uIGhlcmUsIGFuZCB3ZSBjYW5ub3Qgc3ViZGl2aWRlIGFueW1vcmVcbiAgICAgICAgICAgICAgICAvLyBidXQgd2UgaGF2ZSB0byBicmVhayB0aGUgbG9vcCBhbnl3YXlcbiAgICAgICAgICAgICAgICBzdWJkaXZpc2lvbkF0dGVtcHRzID0gU1VCRElWSVNJT05fQVRURU1QVFM7XG4gICAgICAgICAgICAgICAgYnJlYWs7IC8vIHdoaWxlXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgYm90aCBxdWFkcmFudHMgYXJlIGRpZmZlcmVudCwgd2UgcmVjb3JkIG5cbiAgICAgICAgICAgIC8vIGluIGl0cyBxdWFkcmFudFxuICAgICAgICAgICAgUmVnaW9uTWF0cml4W3EyICsgUkVHSU9OX05PREVdID0gbjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIDIpIFJlcHVsc2lvblxuICAvLy0tLS0tLS0tLS0tLS0tXG4gIC8vIE5PVEVTOiBhZGp1c3RTaXplcyA9IGFudGlDb2xsaXNpb24gJiBzY2FsaW5nUmF0aW8gPSBjb2VmZmljaWVudFxuXG4gIGlmIChvcHRpb25zLmJhcm5lc0h1dE9wdGltaXplKSB7XG4gICAgY29lZmZpY2llbnQgPSBvcHRpb25zLnNjYWxpbmdSYXRpbztcblxuICAgIC8vIEFwcGx5aW5nIHJlcHVsc2lvbiB0aHJvdWdoIHJlZ2lvbnNcbiAgICBmb3IgKG4gPSAwOyBuIDwgb3JkZXI7IG4gKz0gUFBOKSB7XG4gICAgICAvLyBDb21wdXRpbmcgbGVhZiBxdWFkIG5vZGVzIGl0ZXJhdGlvblxuXG4gICAgICByID0gMDsgLy8gU3RhcnRpbmcgd2l0aCByb290IHJlZ2lvblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaWYgKFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX0ZJUlNUX0NISUxEXSA+PSAwKSB7XG4gICAgICAgICAgLy8gVGhlIHJlZ2lvbiBoYXMgc3ViLXJlZ2lvbnNcblxuICAgICAgICAgIC8vIFdlIHJ1biB0aGUgQmFybmVzIEh1dCB0ZXN0IHRvIHNlZSBpZiB3ZSBhcmUgYXQgdGhlIHJpZ2h0IGRpc3RhbmNlXG4gICAgICAgICAgZGlzdGFuY2UgPVxuICAgICAgICAgICAgTWF0aC5wb3coXG4gICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfWF0gLSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTX0NFTlRFUl9YXSxcbiAgICAgICAgICAgICAgMlxuICAgICAgICAgICAgKSArXG4gICAgICAgICAgICBNYXRoLnBvdyhcbiAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9ZXSAtIFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX01BU1NfQ0VOVEVSX1ldLFxuICAgICAgICAgICAgICAyXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgcyA9IFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX1NJWkVdO1xuXG4gICAgICAgICAgaWYgKCg0ICogcyAqIHMpIC8gZGlzdGFuY2UgPCB0aGV0YVNxdWFyZWQpIHtcbiAgICAgICAgICAgIC8vIFdlIHRyZWF0IHRoZSByZWdpb24gYXMgYSBzaW5nbGUgYm9keSwgYW5kIHdlIHJlcHVsc2VcblxuICAgICAgICAgICAgeERpc3QgPVxuICAgICAgICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX1hdIC0gUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTUFTU19DRU5URVJfWF07XG4gICAgICAgICAgICB5RGlzdCA9XG4gICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfWV0gLSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTX0NFTlRFUl9ZXTtcblxuICAgICAgICAgICAgaWYgKGFkanVzdFNpemVzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgIC8vLS0gTGluZWFyIEFudGktY29sbGlzaW9uIFJlcHVsc2lvblxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgZmFjdG9yID1cbiAgICAgICAgICAgICAgICAgIChjb2VmZmljaWVudCAqXG4gICAgICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfTUFTU10gKlxuICAgICAgICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTXSkgL1xuICAgICAgICAgICAgICAgICAgZGlzdGFuY2U7XG5cbiAgICAgICAgICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX0RYXSArPSB4RGlzdCAqIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX0RZXSArPSB5RGlzdCAqIGZhY3RvcjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXN0YW5jZSA8IDApIHtcbiAgICAgICAgICAgICAgICBmYWN0b3IgPVxuICAgICAgICAgICAgICAgICAgKC1jb2VmZmljaWVudCAqXG4gICAgICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfTUFTU10gKlxuICAgICAgICAgICAgICAgICAgICBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9NQVNTXSkgL1xuICAgICAgICAgICAgICAgICAgTWF0aC5zcXJ0KGRpc3RhbmNlKTtcblxuICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfRFhdICs9IHhEaXN0ICogZmFjdG9yO1xuICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfRFldICs9IHlEaXN0ICogZmFjdG9yO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLy0tIExpbmVhciBSZXB1bHNpb25cbiAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlID4gMCkge1xuICAgICAgICAgICAgICAgIGZhY3RvciA9XG4gICAgICAgICAgICAgICAgICAoY29lZmZpY2llbnQgKlxuICAgICAgICAgICAgICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX01BU1NdICpcbiAgICAgICAgICAgICAgICAgICAgUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTUFTU10pIC9cbiAgICAgICAgICAgICAgICAgIGRpc3RhbmNlO1xuXG4gICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0gKz0geERpc3QgKiBmYWN0b3I7XG4gICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9EWV0gKz0geURpc3QgKiBmYWN0b3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gV2hlbiB0aGlzIGlzIGRvbmUsIHdlIGl0ZXJhdGUuIFdlIGhhdmUgdG8gbG9vayBhdCB0aGUgbmV4dCBzaWJsaW5nLlxuICAgICAgICAgICAgciA9IFJlZ2lvbk1hdHJpeFtyICsgUkVHSU9OX05FWFRfU0lCTElOR107XG4gICAgICAgICAgICBpZiAociA8IDApIGJyZWFrOyAvLyBObyBuZXh0IHNpYmxpbmc6IHdlIGhhdmUgZmluaXNoZWQgdGhlIHRyZWVcblxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIFRoZSByZWdpb24gaXMgdG9vIGNsb3NlIGFuZCB3ZSBoYXZlIHRvIGxvb2sgYXQgc3ViLXJlZ2lvbnNcbiAgICAgICAgICAgIHIgPSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9GSVJTVF9DSElMRF07XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVGhlIHJlZ2lvbiBoYXMgbm8gc3ViLXJlZ2lvblxuICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgbm9kZSByWzBdIGFuZCBpdCBpcyBub3QgbiwgdGhlbiByZXB1bHNlXG4gICAgICAgICAgcm4gPSBSZWdpb25NYXRyaXhbciArIFJFR0lPTl9OT0RFXTtcblxuICAgICAgICAgIGlmIChybiA+PSAwICYmIHJuICE9PSBuKSB7XG4gICAgICAgICAgICB4RGlzdCA9IE5vZGVNYXRyaXhbbiArIE5PREVfWF0gLSBOb2RlTWF0cml4W3JuICsgTk9ERV9YXTtcbiAgICAgICAgICAgIHlEaXN0ID0gTm9kZU1hdHJpeFtuICsgTk9ERV9ZXSAtIE5vZGVNYXRyaXhbcm4gKyBOT0RFX1ldO1xuXG4gICAgICAgICAgICBkaXN0YW5jZSA9IHhEaXN0ICogeERpc3QgKyB5RGlzdCAqIHlEaXN0O1xuXG4gICAgICAgICAgICBpZiAoYWRqdXN0U2l6ZXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgLy8tLSBMaW5lYXIgQW50aS1jb2xsaXNpb24gUmVwdWxzaW9uXG4gICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgICAgICAgICBmYWN0b3IgPVxuICAgICAgICAgICAgICAgICAgKGNvZWZmaWNpZW50ICpcbiAgICAgICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9NQVNTXSAqXG4gICAgICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbcm4gKyBOT0RFX01BU1NdKSAvXG4gICAgICAgICAgICAgICAgICBkaXN0YW5jZTtcblxuICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfRFhdICs9IHhEaXN0ICogZmFjdG9yO1xuICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfRFldICs9IHlEaXN0ICogZmFjdG9yO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpc3RhbmNlIDwgMCkge1xuICAgICAgICAgICAgICAgIGZhY3RvciA9XG4gICAgICAgICAgICAgICAgICAoLWNvZWZmaWNpZW50ICpcbiAgICAgICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9NQVNTXSAqXG4gICAgICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbcm4gKyBOT0RFX01BU1NdKSAvXG4gICAgICAgICAgICAgICAgICBNYXRoLnNxcnQoZGlzdGFuY2UpO1xuXG4gICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0gKz0geERpc3QgKiBmYWN0b3I7XG4gICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9EWV0gKz0geURpc3QgKiBmYWN0b3I7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vLS0gTGluZWFyIFJlcHVsc2lvblxuICAgICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgICAgICAgZmFjdG9yID1cbiAgICAgICAgICAgICAgICAgIChjb2VmZmljaWVudCAqXG4gICAgICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfTUFTU10gKlxuICAgICAgICAgICAgICAgICAgICBOb2RlTWF0cml4W3JuICsgTk9ERV9NQVNTXSkgL1xuICAgICAgICAgICAgICAgICAgZGlzdGFuY2U7XG5cbiAgICAgICAgICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX0RYXSArPSB4RGlzdCAqIGZhY3RvcjtcbiAgICAgICAgICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX0RZXSArPSB5RGlzdCAqIGZhY3RvcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIFdoZW4gdGhpcyBpcyBkb25lLCB3ZSBpdGVyYXRlLiBXZSBoYXZlIHRvIGxvb2sgYXQgdGhlIG5leHQgc2libGluZy5cbiAgICAgICAgICByID0gUmVnaW9uTWF0cml4W3IgKyBSRUdJT05fTkVYVF9TSUJMSU5HXTtcblxuICAgICAgICAgIGlmIChyIDwgMCkgYnJlYWs7IC8vIE5vIG5leHQgc2libGluZzogd2UgaGF2ZSBmaW5pc2hlZCB0aGUgdHJlZVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29lZmZpY2llbnQgPSBvcHRpb25zLnNjYWxpbmdSYXRpbztcblxuICAgIC8vIFNxdWFyZSBpdGVyYXRpb25cbiAgICBmb3IgKG4xID0gMDsgbjEgPCBvcmRlcjsgbjEgKz0gUFBOKSB7XG4gICAgICBmb3IgKG4yID0gMDsgbjIgPCBuMTsgbjIgKz0gUFBOKSB7XG4gICAgICAgIC8vIENvbW1vbiB0byBib3RoIG1ldGhvZHNcbiAgICAgICAgeERpc3QgPSBOb2RlTWF0cml4W24xICsgTk9ERV9YXSAtIE5vZGVNYXRyaXhbbjIgKyBOT0RFX1hdO1xuICAgICAgICB5RGlzdCA9IE5vZGVNYXRyaXhbbjEgKyBOT0RFX1ldIC0gTm9kZU1hdHJpeFtuMiArIE5PREVfWV07XG5cbiAgICAgICAgaWYgKGFkanVzdFNpemVzID09PSB0cnVlKSB7XG4gICAgICAgICAgLy8tLSBBbnRpY29sbGlzaW9uIExpbmVhciBSZXB1bHNpb25cbiAgICAgICAgICBkaXN0YW5jZSA9XG4gICAgICAgICAgICBNYXRoLnNxcnQoeERpc3QgKiB4RGlzdCArIHlEaXN0ICogeURpc3QpIC1cbiAgICAgICAgICAgIE5vZGVNYXRyaXhbbjEgKyBOT0RFX1NJWkVdIC1cbiAgICAgICAgICAgIE5vZGVNYXRyaXhbbjIgKyBOT0RFX1NJWkVdO1xuXG4gICAgICAgICAgaWYgKGRpc3RhbmNlID4gMCkge1xuICAgICAgICAgICAgZmFjdG9yID1cbiAgICAgICAgICAgICAgKGNvZWZmaWNpZW50ICpcbiAgICAgICAgICAgICAgICBOb2RlTWF0cml4W24xICsgTk9ERV9NQVNTXSAqXG4gICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuMiArIE5PREVfTUFTU10pIC9cbiAgICAgICAgICAgICAgZGlzdGFuY2UgL1xuICAgICAgICAgICAgICBkaXN0YW5jZTtcblxuICAgICAgICAgICAgLy8gVXBkYXRpbmcgbm9kZXMnIGR4IGFuZCBkeVxuICAgICAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfRFhdICs9IHhEaXN0ICogZmFjdG9yO1xuICAgICAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfRFldICs9IHlEaXN0ICogZmFjdG9yO1xuXG4gICAgICAgICAgICBOb2RlTWF0cml4W24yICsgTk9ERV9EWF0gKz0geERpc3QgKiBmYWN0b3I7XG4gICAgICAgICAgICBOb2RlTWF0cml4W24yICsgTk9ERV9EWV0gKz0geURpc3QgKiBmYWN0b3I7XG4gICAgICAgICAgfSBlbHNlIGlmIChkaXN0YW5jZSA8IDApIHtcbiAgICAgICAgICAgIGZhY3RvciA9XG4gICAgICAgICAgICAgIDEwMCAqXG4gICAgICAgICAgICAgIGNvZWZmaWNpZW50ICpcbiAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfTUFTU10gKlxuICAgICAgICAgICAgICBOb2RlTWF0cml4W24yICsgTk9ERV9NQVNTXTtcblxuICAgICAgICAgICAgLy8gVXBkYXRpbmcgbm9kZXMnIGR4IGFuZCBkeVxuICAgICAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfRFhdICs9IHhEaXN0ICogZmFjdG9yO1xuICAgICAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfRFldICs9IHlEaXN0ICogZmFjdG9yO1xuXG4gICAgICAgICAgICBOb2RlTWF0cml4W24yICsgTk9ERV9EWF0gLT0geERpc3QgKiBmYWN0b3I7XG4gICAgICAgICAgICBOb2RlTWF0cml4W24yICsgTk9ERV9EWV0gLT0geURpc3QgKiBmYWN0b3I7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vLS0gTGluZWFyIFJlcHVsc2lvblxuICAgICAgICAgIGRpc3RhbmNlID0gTWF0aC5zcXJ0KHhEaXN0ICogeERpc3QgKyB5RGlzdCAqIHlEaXN0KTtcblxuICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgICAgIGZhY3RvciA9XG4gICAgICAgICAgICAgIChjb2VmZmljaWVudCAqXG4gICAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfTUFTU10gKlxuICAgICAgICAgICAgICAgIE5vZGVNYXRyaXhbbjIgKyBOT0RFX01BU1NdKSAvXG4gICAgICAgICAgICAgIGRpc3RhbmNlIC9cbiAgICAgICAgICAgICAgZGlzdGFuY2U7XG5cbiAgICAgICAgICAgIC8vIFVwZGF0aW5nIG5vZGVzJyBkeCBhbmQgZHlcbiAgICAgICAgICAgIE5vZGVNYXRyaXhbbjEgKyBOT0RFX0RYXSArPSB4RGlzdCAqIGZhY3RvcjtcbiAgICAgICAgICAgIE5vZGVNYXRyaXhbbjEgKyBOT0RFX0RZXSArPSB5RGlzdCAqIGZhY3RvcjtcblxuICAgICAgICAgICAgTm9kZU1hdHJpeFtuMiArIE5PREVfRFhdIC09IHhEaXN0ICogZmFjdG9yO1xuICAgICAgICAgICAgTm9kZU1hdHJpeFtuMiArIE5PREVfRFldIC09IHlEaXN0ICogZmFjdG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIDMpIEdyYXZpdHlcbiAgLy8tLS0tLS0tLS0tLS1cbiAgZyA9IG9wdGlvbnMuZ3Jhdml0eSAvIG9wdGlvbnMuc2NhbGluZ1JhdGlvO1xuICBjb2VmZmljaWVudCA9IG9wdGlvbnMuc2NhbGluZ1JhdGlvO1xuICBmb3IgKG4gPSAwOyBuIDwgb3JkZXI7IG4gKz0gUFBOKSB7XG4gICAgZmFjdG9yID0gMDtcblxuICAgIC8vIENvbW1vbiB0byBib3RoIG1ldGhvZHNcbiAgICB4RGlzdCA9IE5vZGVNYXRyaXhbbiArIE5PREVfWF07XG4gICAgeURpc3QgPSBOb2RlTWF0cml4W24gKyBOT0RFX1ldO1xuICAgIGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHhEaXN0LCAyKSArIE1hdGgucG93KHlEaXN0LCAyKSk7XG5cbiAgICBpZiAob3B0aW9ucy5zdHJvbmdHcmF2aXR5TW9kZSkge1xuICAgICAgLy8tLSBTdHJvbmcgZ3Jhdml0eVxuICAgICAgaWYgKGRpc3RhbmNlID4gMCkgZmFjdG9yID0gY29lZmZpY2llbnQgKiBOb2RlTWF0cml4W24gKyBOT0RFX01BU1NdICogZztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8tLSBMaW5lYXIgQW50aS1jb2xsaXNpb24gUmVwdWxzaW9uIG5cbiAgICAgIGlmIChkaXN0YW5jZSA+IDApXG4gICAgICAgIGZhY3RvciA9IChjb2VmZmljaWVudCAqIE5vZGVNYXRyaXhbbiArIE5PREVfTUFTU10gKiBnKSAvIGRpc3RhbmNlO1xuICAgIH1cblxuICAgIC8vIFVwZGF0aW5nIG5vZGUncyBkeCBhbmQgZHlcbiAgICBOb2RlTWF0cml4W24gKyBOT0RFX0RYXSAtPSB4RGlzdCAqIGZhY3RvcjtcbiAgICBOb2RlTWF0cml4W24gKyBOT0RFX0RZXSAtPSB5RGlzdCAqIGZhY3RvcjtcbiAgfVxuXG4gIC8vIDQpIEF0dHJhY3Rpb25cbiAgLy8tLS0tLS0tLS0tLS0tLS1cbiAgY29lZmZpY2llbnQgPVxuICAgIDEgKiAob3B0aW9ucy5vdXRib3VuZEF0dHJhY3Rpb25EaXN0cmlidXRpb24gPyBvdXRib3VuZEF0dENvbXBlbnNhdGlvbiA6IDEpO1xuXG4gIC8vIFRPRE86IHNpbXBsaWZ5IGRpc3RhbmNlXG4gIC8vIFRPRE86IGNvZWZmaWNpZW50IGlzIGFsd2F5cyB1c2VkIGFzIC1jIC0tPiBvcHRpbWl6ZT9cbiAgZm9yIChlID0gMDsgZSA8IHNpemU7IGUgKz0gUFBFKSB7XG4gICAgbjEgPSBFZGdlTWF0cml4W2UgKyBFREdFX1NPVVJDRV07XG4gICAgbjIgPSBFZGdlTWF0cml4W2UgKyBFREdFX1RBUkdFVF07XG4gICAgdyA9IEVkZ2VNYXRyaXhbZSArIEVER0VfV0VJR0hUXTtcblxuICAgIC8vIEVkZ2Ugd2VpZ2h0IGluZmx1ZW5jZVxuICAgIGV3YyA9IE1hdGgucG93KHcsIG9wdGlvbnMuZWRnZVdlaWdodEluZmx1ZW5jZSk7XG5cbiAgICAvLyBDb21tb24gbWVhc3VyZXNcbiAgICB4RGlzdCA9IE5vZGVNYXRyaXhbbjEgKyBOT0RFX1hdIC0gTm9kZU1hdHJpeFtuMiArIE5PREVfWF07XG4gICAgeURpc3QgPSBOb2RlTWF0cml4W24xICsgTk9ERV9ZXSAtIE5vZGVNYXRyaXhbbjIgKyBOT0RFX1ldO1xuXG4gICAgLy8gQXBwbHlpbmcgYXR0cmFjdGlvbiB0byBub2Rlc1xuICAgIGlmIChhZGp1c3RTaXplcyA9PT0gdHJ1ZSkge1xuICAgICAgZGlzdGFuY2UgPVxuICAgICAgICBNYXRoLnNxcnQoeERpc3QgKiB4RGlzdCArIHlEaXN0ICogeURpc3QpIC1cbiAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfU0laRV0gLVxuICAgICAgICBOb2RlTWF0cml4W24yICsgTk9ERV9TSVpFXTtcblxuICAgICAgaWYgKG9wdGlvbnMubGluTG9nTW9kZSkge1xuICAgICAgICBpZiAob3B0aW9ucy5vdXRib3VuZEF0dHJhY3Rpb25EaXN0cmlidXRpb24pIHtcbiAgICAgICAgICAvLy0tIExpbkxvZyBEZWdyZWUgRGlzdHJpYnV0ZWQgQW50aS1jb2xsaXNpb24gQXR0cmFjdGlvblxuICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgICAgIGZhY3RvciA9XG4gICAgICAgICAgICAgICgtY29lZmZpY2llbnQgKiBld2MgKiBNYXRoLmxvZygxICsgZGlzdGFuY2UpKSAvXG4gICAgICAgICAgICAgIGRpc3RhbmNlIC9cbiAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfTUFTU107XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vLS0gTGluTG9nIEFudGktY29sbGlzaW9uIEF0dHJhY3Rpb25cbiAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAgICAgICBmYWN0b3IgPSAoLWNvZWZmaWNpZW50ICogZXdjICogTWF0aC5sb2coMSArIGRpc3RhbmNlKSkgLyBkaXN0YW5jZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcHRpb25zLm91dGJvdW5kQXR0cmFjdGlvbkRpc3RyaWJ1dGlvbikge1xuICAgICAgICAgIC8vLS0gTGluZWFyIERlZ3JlZSBEaXN0cmlidXRlZCBBbnRpLWNvbGxpc2lvbiBBdHRyYWN0aW9uXG4gICAgICAgICAgaWYgKGRpc3RhbmNlID4gMCkge1xuICAgICAgICAgICAgZmFjdG9yID0gKC1jb2VmZmljaWVudCAqIGV3YykgLyBOb2RlTWF0cml4W24xICsgTk9ERV9NQVNTXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8tLSBMaW5lYXIgQW50aS1jb2xsaXNpb24gQXR0cmFjdGlvblxuICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgICAgIGZhY3RvciA9IC1jb2VmZmljaWVudCAqIGV3YztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coeERpc3QsIDIpICsgTWF0aC5wb3coeURpc3QsIDIpKTtcblxuICAgICAgaWYgKG9wdGlvbnMubGluTG9nTW9kZSkge1xuICAgICAgICBpZiAob3B0aW9ucy5vdXRib3VuZEF0dHJhY3Rpb25EaXN0cmlidXRpb24pIHtcbiAgICAgICAgICAvLy0tIExpbkxvZyBEZWdyZWUgRGlzdHJpYnV0ZWQgQXR0cmFjdGlvblxuICAgICAgICAgIGlmIChkaXN0YW5jZSA+IDApIHtcbiAgICAgICAgICAgIGZhY3RvciA9XG4gICAgICAgICAgICAgICgtY29lZmZpY2llbnQgKiBld2MgKiBNYXRoLmxvZygxICsgZGlzdGFuY2UpKSAvXG4gICAgICAgICAgICAgIGRpc3RhbmNlIC9cbiAgICAgICAgICAgICAgTm9kZU1hdHJpeFtuMSArIE5PREVfTUFTU107XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vLS0gTGluTG9nIEF0dHJhY3Rpb25cbiAgICAgICAgICBpZiAoZGlzdGFuY2UgPiAwKVxuICAgICAgICAgICAgZmFjdG9yID0gKC1jb2VmZmljaWVudCAqIGV3YyAqIE1hdGgubG9nKDEgKyBkaXN0YW5jZSkpIC8gZGlzdGFuY2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChvcHRpb25zLm91dGJvdW5kQXR0cmFjdGlvbkRpc3RyaWJ1dGlvbikge1xuICAgICAgICAgIC8vLS0gTGluZWFyIEF0dHJhY3Rpb24gTWFzcyBEaXN0cmlidXRlZFxuICAgICAgICAgIC8vIE5PVEU6IERpc3RhbmNlIGlzIHNldCB0byAxIHRvIG92ZXJyaWRlIG5leHQgY29uZGl0aW9uXG4gICAgICAgICAgZGlzdGFuY2UgPSAxO1xuICAgICAgICAgIGZhY3RvciA9ICgtY29lZmZpY2llbnQgKiBld2MpIC8gTm9kZU1hdHJpeFtuMSArIE5PREVfTUFTU107XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8tLSBMaW5lYXIgQXR0cmFjdGlvblxuICAgICAgICAgIC8vIE5PVEU6IERpc3RhbmNlIGlzIHNldCB0byAxIHRvIG92ZXJyaWRlIG5leHQgY29uZGl0aW9uXG4gICAgICAgICAgZGlzdGFuY2UgPSAxO1xuICAgICAgICAgIGZhY3RvciA9IC1jb2VmZmljaWVudCAqIGV3YztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFVwZGF0aW5nIG5vZGVzJyBkeCBhbmQgZHlcbiAgICAvLyBUT0RPOiBpZiBjb25kaXRpb24gb3IgZmFjdG9yID0gMT9cbiAgICBpZiAoZGlzdGFuY2UgPiAwKSB7XG4gICAgICAvLyBVcGRhdGluZyBub2RlcycgZHggYW5kIGR5XG4gICAgICBOb2RlTWF0cml4W24xICsgTk9ERV9EWF0gKz0geERpc3QgKiBmYWN0b3I7XG4gICAgICBOb2RlTWF0cml4W24xICsgTk9ERV9EWV0gKz0geURpc3QgKiBmYWN0b3I7XG5cbiAgICAgIE5vZGVNYXRyaXhbbjIgKyBOT0RFX0RYXSAtPSB4RGlzdCAqIGZhY3RvcjtcbiAgICAgIE5vZGVNYXRyaXhbbjIgKyBOT0RFX0RZXSAtPSB5RGlzdCAqIGZhY3RvcjtcbiAgICB9XG4gIH1cblxuICAvLyA1KSBBcHBseSBGb3JjZXNcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLVxuICB2YXIgZm9yY2UsIHN3aW5naW5nLCB0cmFjdGlvbiwgbm9kZXNwZWVkLCBuZXdYLCBuZXdZO1xuXG4gIC8vIE1BVEg6IHNxcnQgYW5kIHNxdWFyZSBkaXN0YW5jZXNcbiAgaWYgKGFkanVzdFNpemVzID09PSB0cnVlKSB7XG4gICAgZm9yIChuID0gMDsgbiA8IG9yZGVyOyBuICs9IFBQTikge1xuICAgICAgaWYgKE5vZGVNYXRyaXhbbiArIE5PREVfRklYRURdICE9PSAxKSB7XG4gICAgICAgIGZvcmNlID0gTWF0aC5zcXJ0KFxuICAgICAgICAgIE1hdGgucG93KE5vZGVNYXRyaXhbbiArIE5PREVfRFhdLCAyKSArXG4gICAgICAgICAgICBNYXRoLnBvdyhOb2RlTWF0cml4W24gKyBOT0RFX0RZXSwgMilcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoZm9yY2UgPiBNQVhfRk9SQ0UpIHtcbiAgICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX0RYXSA9XG4gICAgICAgICAgICAoTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0gKiBNQVhfRk9SQ0UpIC8gZm9yY2U7XG4gICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9EWV0gPVxuICAgICAgICAgICAgKE5vZGVNYXRyaXhbbiArIE5PREVfRFldICogTUFYX0ZPUkNFKSAvIGZvcmNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpbmdpbmcgPVxuICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfTUFTU10gKlxuICAgICAgICAgIE1hdGguc3FydChcbiAgICAgICAgICAgIChOb2RlTWF0cml4W24gKyBOT0RFX09MRF9EWF0gLSBOb2RlTWF0cml4W24gKyBOT0RFX0RYXSkgKlxuICAgICAgICAgICAgICAoTm9kZU1hdHJpeFtuICsgTk9ERV9PTERfRFhdIC0gTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0pICtcbiAgICAgICAgICAgICAgKE5vZGVNYXRyaXhbbiArIE5PREVfT0xEX0RZXSAtIE5vZGVNYXRyaXhbbiArIE5PREVfRFldKSAqXG4gICAgICAgICAgICAgICAgKE5vZGVNYXRyaXhbbiArIE5PREVfT0xEX0RZXSAtIE5vZGVNYXRyaXhbbiArIE5PREVfRFldKVxuICAgICAgICAgICk7XG5cbiAgICAgICAgdHJhY3Rpb24gPVxuICAgICAgICAgIE1hdGguc3FydChcbiAgICAgICAgICAgIChOb2RlTWF0cml4W24gKyBOT0RFX09MRF9EWF0gKyBOb2RlTWF0cml4W24gKyBOT0RFX0RYXSkgKlxuICAgICAgICAgICAgICAoTm9kZU1hdHJpeFtuICsgTk9ERV9PTERfRFhdICsgTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0pICtcbiAgICAgICAgICAgICAgKE5vZGVNYXRyaXhbbiArIE5PREVfT0xEX0RZXSArIE5vZGVNYXRyaXhbbiArIE5PREVfRFldKSAqXG4gICAgICAgICAgICAgICAgKE5vZGVNYXRyaXhbbiArIE5PREVfT0xEX0RZXSArIE5vZGVNYXRyaXhbbiArIE5PREVfRFldKVxuICAgICAgICAgICkgLyAyO1xuXG4gICAgICAgIG5vZGVzcGVlZCA9ICgwLjEgKiBNYXRoLmxvZygxICsgdHJhY3Rpb24pKSAvICgxICsgTWF0aC5zcXJ0KHN3aW5naW5nKSk7XG5cbiAgICAgICAgLy8gVXBkYXRpbmcgbm9kZSdzIHBvc2l0b25cbiAgICAgICAgbmV3WCA9XG4gICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9YXSArXG4gICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0gKiAobm9kZXNwZWVkIC8gb3B0aW9ucy5zbG93RG93bik7XG4gICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfWF0gPSBuZXdYO1xuXG4gICAgICAgIG5ld1kgPVxuICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfWV0gK1xuICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfRFldICogKG5vZGVzcGVlZCAvIG9wdGlvbnMuc2xvd0Rvd24pO1xuICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX1ldID0gbmV3WTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChuID0gMDsgbiA8IG9yZGVyOyBuICs9IFBQTikge1xuICAgICAgaWYgKE5vZGVNYXRyaXhbbiArIE5PREVfRklYRURdICE9PSAxKSB7XG4gICAgICAgIHN3aW5naW5nID1cbiAgICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX01BU1NdICpcbiAgICAgICAgICBNYXRoLnNxcnQoXG4gICAgICAgICAgICAoTm9kZU1hdHJpeFtuICsgTk9ERV9PTERfRFhdIC0gTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0pICpcbiAgICAgICAgICAgICAgKE5vZGVNYXRyaXhbbiArIE5PREVfT0xEX0RYXSAtIE5vZGVNYXRyaXhbbiArIE5PREVfRFhdKSArXG4gICAgICAgICAgICAgIChOb2RlTWF0cml4W24gKyBOT0RFX09MRF9EWV0gLSBOb2RlTWF0cml4W24gKyBOT0RFX0RZXSkgKlxuICAgICAgICAgICAgICAgIChOb2RlTWF0cml4W24gKyBOT0RFX09MRF9EWV0gLSBOb2RlTWF0cml4W24gKyBOT0RFX0RZXSlcbiAgICAgICAgICApO1xuXG4gICAgICAgIHRyYWN0aW9uID1cbiAgICAgICAgICBNYXRoLnNxcnQoXG4gICAgICAgICAgICAoTm9kZU1hdHJpeFtuICsgTk9ERV9PTERfRFhdICsgTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0pICpcbiAgICAgICAgICAgICAgKE5vZGVNYXRyaXhbbiArIE5PREVfT0xEX0RYXSArIE5vZGVNYXRyaXhbbiArIE5PREVfRFhdKSArXG4gICAgICAgICAgICAgIChOb2RlTWF0cml4W24gKyBOT0RFX09MRF9EWV0gKyBOb2RlTWF0cml4W24gKyBOT0RFX0RZXSkgKlxuICAgICAgICAgICAgICAgIChOb2RlTWF0cml4W24gKyBOT0RFX09MRF9EWV0gKyBOb2RlTWF0cml4W24gKyBOT0RFX0RZXSlcbiAgICAgICAgICApIC8gMjtcblxuICAgICAgICBub2Rlc3BlZWQgPVxuICAgICAgICAgIChOb2RlTWF0cml4W24gKyBOT0RFX0NPTlZFUkdFTkNFXSAqIE1hdGgubG9nKDEgKyB0cmFjdGlvbikpIC9cbiAgICAgICAgICAoMSArIE1hdGguc3FydChzd2luZ2luZykpO1xuXG4gICAgICAgIC8vIFVwZGF0aW5nIG5vZGUgY29udmVyZ2VuY2VcbiAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9DT05WRVJHRU5DRV0gPSBNYXRoLm1pbihcbiAgICAgICAgICAxLFxuICAgICAgICAgIE1hdGguc3FydChcbiAgICAgICAgICAgIChub2Rlc3BlZWQgKlxuICAgICAgICAgICAgICAoTWF0aC5wb3coTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0sIDIpICtcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhOb2RlTWF0cml4W24gKyBOT0RFX0RZXSwgMikpKSAvXG4gICAgICAgICAgICAgICgxICsgTWF0aC5zcXJ0KHN3aW5naW5nKSlcbiAgICAgICAgICApXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gVXBkYXRpbmcgbm9kZSdzIHBvc2l0b25cbiAgICAgICAgbmV3WCA9XG4gICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9YXSArXG4gICAgICAgICAgTm9kZU1hdHJpeFtuICsgTk9ERV9EWF0gKiAobm9kZXNwZWVkIC8gb3B0aW9ucy5zbG93RG93bik7XG4gICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfWF0gPSBuZXdYO1xuXG4gICAgICAgIG5ld1kgPVxuICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfWV0gK1xuICAgICAgICAgIE5vZGVNYXRyaXhbbiArIE5PREVfRFldICogKG5vZGVzcGVlZCAvIG9wdGlvbnMuc2xvd0Rvd24pO1xuICAgICAgICBOb2RlTWF0cml4W24gKyBOT0RFX1ldID0gbmV3WTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBXZSByZXR1cm4gdGhlIGluZm9ybWF0aW9uIGFib3V0IHRoZSBsYXlvdXQgKG5vIG5lZWQgdG8gcmV0dXJuIHRoZSBtYXRyaWNlcylcbiAgcmV0dXJuIHt9O1xufTtcbiIsIi8qKlxuICogR3JhcGhvbG9neSBDaXJjbGVQYWNrIExheW91dFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBDaXJjbGVwYWNrIGxheW91dCBmcm9tIGQzLWhpZXJhcmNoeS9nZXBoaS5cbiAqL1xudmFyIHJlc29sdmVEZWZhdWx0cyA9IHJlcXVpcmUoJ2dyYXBob2xvZ3ktdXRpbHMvZGVmYXVsdHMnKTtcbnZhciBpc0dyYXBoID0gcmVxdWlyZSgnZ3JhcGhvbG9neS11dGlscy9pcy1ncmFwaCcpO1xudmFyIHNodWZmbGUgPSByZXF1aXJlKCdwYW5kZW1vbml1bS9zaHVmZmxlLWluLXBsYWNlJyk7XG5cbi8qKlxuICogRGVmYXVsdCBvcHRpb25zLlxuICovXG52YXIgREVGQVVMVFMgPSB7XG4gIGF0dHJpYnV0ZXM6IHtcbiAgICB4OiAneCcsXG4gICAgeTogJ3knXG4gIH0sXG4gIGNlbnRlcjogMCxcbiAgaGllcmFyY2h5QXR0cmlidXRlczogW10sXG4gIHJuZzogTWF0aC5yYW5kb20sXG4gIHNjYWxlOiAxXG59O1xuXG4vKipcbiAqIEhlbHBlcnMuXG4gKi9cbmZ1bmN0aW9uIENpcmNsZVdyYXAoaWQsIHgsIHksIHIsIGNpcmNsZVdyYXApIHtcbiAgdGhpcy53cmFwcGVkQ2lyY2xlID0gY2lyY2xlV3JhcCB8fCBudWxsOyAvL2hhY2t5IGQzIHJlZmVyZW5jZSB0aGluZ1xuXG4gIHRoaXMuY2hpbGRyZW4gPSB7fTtcbiAgdGhpcy5jb3VudENoaWxkcmVuID0gMDtcbiAgdGhpcy5pZCA9IGlkIHx8IG51bGw7XG4gIHRoaXMubmV4dCA9IG51bGw7XG4gIHRoaXMucHJldmlvdXMgPSBudWxsO1xuXG4gIHRoaXMueCA9IHggfHwgbnVsbDtcbiAgdGhpcy55ID0geSB8fCBudWxsO1xuICBpZiAoY2lyY2xlV3JhcCkgdGhpcy5yID0gMTAxMDEwMTtcbiAgLy8gZm9yIGRlYnVnZ2luZyBwdXJwb3NlcyAtIHNob3VsZCBub3QgYmUgdXNlZCBpbiB0aGlzIGNhc2VcbiAgZWxzZSB0aGlzLnIgPSByIHx8IDk5OTtcbn1cblxuQ2lyY2xlV3JhcC5wcm90b3R5cGUuaGFzQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmNvdW50Q2hpbGRyZW4gPiAwO1xufTtcblxuQ2lyY2xlV3JhcC5wcm90b3R5cGUuYWRkQ2hpbGQgPSBmdW5jdGlvbiAoaWQsIGNoaWxkKSB7XG4gIHRoaXMuY2hpbGRyZW5baWRdID0gY2hpbGQ7XG4gICsrdGhpcy5jb3VudENoaWxkcmVuO1xufTtcblxuQ2lyY2xlV3JhcC5wcm90b3R5cGUuZ2V0Q2hpbGQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgaWYgKCF0aGlzLmNoaWxkcmVuLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgIHZhciBjaXJjbGVXcmFwID0gbmV3IENpcmNsZVdyYXAoKTtcbiAgICB0aGlzLmNoaWxkcmVuW2lkXSA9IGNpcmNsZVdyYXA7XG4gICAgKyt0aGlzLmNvdW50Q2hpbGRyZW47XG4gIH1cbiAgcmV0dXJuIHRoaXMuY2hpbGRyZW5baWRdO1xufTtcblxuQ2lyY2xlV3JhcC5wcm90b3R5cGUuYXBwbHlQb3NpdGlvblRvQ2hpbGRyZW4gPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmhhc0NoaWxkcmVuKCkpIHtcbiAgICB2YXIgcm9vdCA9IHRoaXM7IC8vIHVzaW5nICd0aGlzJyBpbiBPYmplY3Qua2V5cy5mb3JFYWNoIHNlZW1zIGEgYmFkIGlkZWFcbiAgICBmb3IgKHZhciBrZXkgaW4gcm9vdC5jaGlsZHJlbikge1xuICAgICAgdmFyIGNoaWxkID0gcm9vdC5jaGlsZHJlbltrZXldO1xuICAgICAgY2hpbGQueCArPSByb290Lng7XG4gICAgICBjaGlsZC55ICs9IHJvb3QueTtcbiAgICAgIGNoaWxkLmFwcGx5UG9zaXRpb25Ub0NoaWxkcmVuKCk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBzZXROb2RlKC8qR3JhcGgqLyBncmFwaCwgLypDaXJjbGVXcmFwKi8gcGFyZW50Q2lyY2xlLCAvKk1hcCovIHBvc01hcCkge1xuICBmb3IgKHZhciBrZXkgaW4gcGFyZW50Q2lyY2xlLmNoaWxkcmVuKSB7XG4gICAgdmFyIGNpcmNsZSA9IHBhcmVudENpcmNsZS5jaGlsZHJlbltrZXldO1xuICAgIGlmIChjaXJjbGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgc2V0Tm9kZShncmFwaCwgY2lyY2xlLCBwb3NNYXApO1xuICAgIH0gZWxzZSB7XG4gICAgICBwb3NNYXBbY2lyY2xlLmlkXSA9IHt4OiBjaXJjbGUueCwgeTogY2lyY2xlLnl9O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBlbmNsb3Nlc05vdCgvKkNpcmNsZVdyYXAqLyBhLCAvKkNpcmNsZVdyYXAqLyBiKSB7XG4gIHZhciBkciA9IGEuciAtIGIucjtcbiAgdmFyIGR4ID0gYi54IC0gYS54O1xuICB2YXIgZHkgPSBiLnkgLSBhLnk7XG4gIHJldHVybiBkciA8IDAgfHwgZHIgKiBkciA8IGR4ICogZHggKyBkeSAqIGR5O1xufVxuXG5mdW5jdGlvbiBlbmNsb3Nlc1dlYWsoLypDaXJjbGVXcmFwKi8gYSwgLypDaXJjbGVXcmFwKi8gYikge1xuICB2YXIgZHIgPSBhLnIgLSBiLnIgKyAxZS02O1xuICB2YXIgZHggPSBiLnggLSBhLng7XG4gIHZhciBkeSA9IGIueSAtIGEueTtcbiAgcmV0dXJuIGRyID4gMCAmJiBkciAqIGRyID4gZHggKiBkeCArIGR5ICogZHk7XG59XG5cbmZ1bmN0aW9uIGVuY2xvc2VzV2Vha0FsbCgvKkNpcmNsZVdyYXAqLyBhLCAvKkFycmF5PENpcmNsZVdyYXA+Ki8gQikge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IEIubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoIWVuY2xvc2VzV2VhayhhLCBCW2ldKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gZW5jbG9zZUJhc2lzMSgvKkNpcmNsZVdyYXAqLyBhKSB7XG4gIHJldHVybiBuZXcgQ2lyY2xlV3JhcChudWxsLCBhLngsIGEueSwgYS5yKTtcbn1cblxuZnVuY3Rpb24gZW5jbG9zZUJhc2lzMigvKkNpcmNsZVdyYXAqLyBhLCAvKkNpcmNsZVdyYXAqLyBiKSB7XG4gIHZhciB4MSA9IGEueCxcbiAgICB5MSA9IGEueSxcbiAgICByMSA9IGEucixcbiAgICB4MiA9IGIueCxcbiAgICB5MiA9IGIueSxcbiAgICByMiA9IGIucixcbiAgICB4MjEgPSB4MiAtIHgxLFxuICAgIHkyMSA9IHkyIC0geTEsXG4gICAgcjIxID0gcjIgLSByMSxcbiAgICBsID0gTWF0aC5zcXJ0KHgyMSAqIHgyMSArIHkyMSAqIHkyMSk7XG4gIHJldHVybiBuZXcgQ2lyY2xlV3JhcChcbiAgICBudWxsLFxuICAgICh4MSArIHgyICsgKHgyMSAvIGwpICogcjIxKSAvIDIsXG4gICAgKHkxICsgeTIgKyAoeTIxIC8gbCkgKiByMjEpIC8gMixcbiAgICAobCArIHIxICsgcjIpIC8gMlxuICApO1xufVxuXG5mdW5jdGlvbiBlbmNsb3NlQmFzaXMzKC8qQ2lyY2xlV3JhcCovIGEsIC8qQ2lyY2xlV3JhcCovIGIsIC8qQ2lyY2xlV3JhcCovIGMpIHtcbiAgdmFyIHgxID0gYS54LFxuICAgIHkxID0gYS55LFxuICAgIHIxID0gYS5yLFxuICAgIHgyID0gYi54LFxuICAgIHkyID0gYi55LFxuICAgIHIyID0gYi5yLFxuICAgIHgzID0gYy54LFxuICAgIHkzID0gYy55LFxuICAgIHIzID0gYy5yLFxuICAgIGEyID0geDEgLSB4MixcbiAgICBhMyA9IHgxIC0geDMsXG4gICAgYjIgPSB5MSAtIHkyLFxuICAgIGIzID0geTEgLSB5MyxcbiAgICBjMiA9IHIyIC0gcjEsXG4gICAgYzMgPSByMyAtIHIxLFxuICAgIGQxID0geDEgKiB4MSArIHkxICogeTEgLSByMSAqIHIxLFxuICAgIGQyID0gZDEgLSB4MiAqIHgyIC0geTIgKiB5MiArIHIyICogcjIsXG4gICAgZDMgPSBkMSAtIHgzICogeDMgLSB5MyAqIHkzICsgcjMgKiByMyxcbiAgICBhYiA9IGEzICogYjIgLSBhMiAqIGIzLFxuICAgIHhhID0gKGIyICogZDMgLSBiMyAqIGQyKSAvIChhYiAqIDIpIC0geDEsXG4gICAgeGIgPSAoYjMgKiBjMiAtIGIyICogYzMpIC8gYWIsXG4gICAgeWEgPSAoYTMgKiBkMiAtIGEyICogZDMpIC8gKGFiICogMikgLSB5MSxcbiAgICB5YiA9IChhMiAqIGMzIC0gYTMgKiBjMikgLyBhYixcbiAgICBBID0geGIgKiB4YiArIHliICogeWIgLSAxLFxuICAgIEIgPSAyICogKHIxICsgeGEgKiB4YiArIHlhICogeWIpLFxuICAgIEMgPSB4YSAqIHhhICsgeWEgKiB5YSAtIHIxICogcjEsXG4gICAgciA9IC0oQSA/IChCICsgTWF0aC5zcXJ0KEIgKiBCIC0gNCAqIEEgKiBDKSkgLyAoMiAqIEEpIDogQyAvIEIpO1xuICByZXR1cm4gbmV3IENpcmNsZVdyYXAobnVsbCwgeDEgKyB4YSArIHhiICogciwgeTEgKyB5YSArIHliICogciwgcik7XG59XG5cbmZ1bmN0aW9uIGVuY2xvc2VCYXNpcygvKkFycmF5PENpcmNsZVdyYXA+Ki8gQikge1xuICBzd2l0Y2ggKEIubGVuZ3RoKSB7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIGVuY2xvc2VCYXNpczEoQlswXSk7XG4gICAgY2FzZSAyOlxuICAgICAgcmV0dXJuIGVuY2xvc2VCYXNpczIoQlswXSwgQlsxXSk7XG4gICAgY2FzZSAzOlxuICAgICAgcmV0dXJuIGVuY2xvc2VCYXNpczMoQlswXSwgQlsxXSwgQlsyXSk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgJ2dyYXBob2xvZ3ktbGF5b3V0L2NpcmNsZXBhY2s6IEludmFsaWQgYmFzaXMgbGVuZ3RoICcgKyBCLmxlbmd0aFxuICAgICAgKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBleHRlbmRCYXNpcygvKkFycmF5PENpcmNsZVdyYXA+Ki8gQiwgLypDaXJjbGVXcmFwKi8gcCkge1xuICB2YXIgaSwgajtcblxuICBpZiAoZW5jbG9zZXNXZWFrQWxsKHAsIEIpKSByZXR1cm4gW3BdO1xuXG4gIC8vIElmIHdlIGdldCBoZXJlIHRoZW4gQiBtdXN0IGhhdmUgYXQgbGVhc3Qgb25lIGVsZW1lbnQuXG4gIGZvciAoaSA9IDA7IGkgPCBCLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGVuY2xvc2VzTm90KHAsIEJbaV0pICYmIGVuY2xvc2VzV2Vha0FsbChlbmNsb3NlQmFzaXMyKEJbaV0sIHApLCBCKSkge1xuICAgICAgcmV0dXJuIFtCW2ldLCBwXTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiB3ZSBnZXQgaGVyZSB0aGVuIEIgbXVzdCBoYXZlIGF0IGxlYXN0IHR3byBlbGVtZW50cy5cbiAgZm9yIChpID0gMDsgaSA8IEIubGVuZ3RoIC0gMTsgKytpKSB7XG4gICAgZm9yIChqID0gaSArIDE7IGogPCBCLmxlbmd0aDsgKytqKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGVuY2xvc2VzTm90KGVuY2xvc2VCYXNpczIoQltpXSwgQltqXSksIHApICYmXG4gICAgICAgIGVuY2xvc2VzTm90KGVuY2xvc2VCYXNpczIoQltpXSwgcCksIEJbal0pICYmXG4gICAgICAgIGVuY2xvc2VzTm90KGVuY2xvc2VCYXNpczIoQltqXSwgcCksIEJbaV0pICYmXG4gICAgICAgIGVuY2xvc2VzV2Vha0FsbChlbmNsb3NlQmFzaXMzKEJbaV0sIEJbal0sIHApLCBCKVxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBbQltpXSwgQltqXSwgcF07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgd2UgZ2V0IGhlcmUgdGhlbiBzb21ldGhpbmcgaXMgdmVyeSB3cm9uZy5cbiAgdGhyb3cgbmV3IEVycm9yKCdncmFwaG9sb2d5LWxheW91dC9jaXJjbGVwYWNrOiBleHRlbmRCYXNpcyBmYWlsdXJlICEnKTtcbn1cblxuZnVuY3Rpb24gc2NvcmUoLypDaXJjbGVXcmFwKi8gbm9kZSkge1xuICB2YXIgYSA9IG5vZGUud3JhcHBlZENpcmNsZTtcbiAgdmFyIGIgPSBub2RlLm5leHQud3JhcHBlZENpcmNsZTtcbiAgdmFyIGFiID0gYS5yICsgYi5yO1xuICB2YXIgZHggPSAoYS54ICogYi5yICsgYi54ICogYS5yKSAvIGFiO1xuICB2YXIgZHkgPSAoYS55ICogYi5yICsgYi55ICogYS5yKSAvIGFiO1xuICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XG59XG5cbmZ1bmN0aW9uIGVuY2xvc2UoY2lyY2xlcywgc2h1ZmZsZUZ1bmMpIHtcbiAgdmFyIGkgPSAwO1xuICB2YXIgY2lyY2xlc0xvYyA9IGNpcmNsZXMuc2xpY2UoKTtcblxuICB2YXIgbiA9IGNpcmNsZXMubGVuZ3RoO1xuICB2YXIgQiA9IFtdO1xuICB2YXIgcDtcbiAgdmFyIGU7XG4gIHNodWZmbGVGdW5jKGNpcmNsZXNMb2MpO1xuICB3aGlsZSAoaSA8IG4pIHtcbiAgICBwID0gY2lyY2xlc0xvY1tpXTtcbiAgICBpZiAoZSAmJiBlbmNsb3Nlc1dlYWsoZSwgcCkpIHtcbiAgICAgICsraTtcbiAgICB9IGVsc2Uge1xuICAgICAgQiA9IGV4dGVuZEJhc2lzKEIsIHApO1xuICAgICAgZSA9IGVuY2xvc2VCYXNpcyhCKTtcbiAgICAgIGkgPSAwO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZTtcbn1cblxuZnVuY3Rpb24gcGxhY2UoLypDaXJjbGVXcmFwKi8gYiwgLypDaXJjbGVXcmFwKi8gYSwgLypDaXJjbGVXcmFwKi8gYykge1xuICB2YXIgZHggPSBiLnggLSBhLngsXG4gICAgeCxcbiAgICBhMixcbiAgICBkeSA9IGIueSAtIGEueSxcbiAgICB5LFxuICAgIGIyLFxuICAgIGQyID0gZHggKiBkeCArIGR5ICogZHk7XG4gIGlmIChkMikge1xuICAgIGEyID0gYS5yICsgYy5yO1xuICAgIGEyICo9IGEyO1xuICAgIGIyID0gYi5yICsgYy5yO1xuICAgIGIyICo9IGIyO1xuICAgIGlmIChhMiA+IGIyKSB7XG4gICAgICB4ID0gKGQyICsgYjIgLSBhMikgLyAoMiAqIGQyKTtcbiAgICAgIHkgPSBNYXRoLnNxcnQoTWF0aC5tYXgoMCwgYjIgLyBkMiAtIHggKiB4KSk7XG4gICAgICBjLnggPSBiLnggLSB4ICogZHggLSB5ICogZHk7XG4gICAgICBjLnkgPSBiLnkgLSB4ICogZHkgKyB5ICogZHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSAoZDIgKyBhMiAtIGIyKSAvICgyICogZDIpO1xuICAgICAgeSA9IE1hdGguc3FydChNYXRoLm1heCgwLCBhMiAvIGQyIC0geCAqIHgpKTtcbiAgICAgIGMueCA9IGEueCArIHggKiBkeCAtIHkgKiBkeTtcbiAgICAgIGMueSA9IGEueSArIHggKiBkeSArIHkgKiBkeDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYy54ID0gYS54ICsgYy5yO1xuICAgIGMueSA9IGEueTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpbnRlcnNlY3RzKC8qQ2lyY2xlV3JhcCovIGEsIC8qQ2lyY2xlV3JhcCovIGIpIHtcbiAgdmFyIGRyID0gYS5yICsgYi5yIC0gMWUtNixcbiAgICBkeCA9IGIueCAtIGEueCxcbiAgICBkeSA9IGIueSAtIGEueTtcbiAgcmV0dXJuIGRyID4gMCAmJiBkciAqIGRyID4gZHggKiBkeCArIGR5ICogZHk7XG59XG5cbmZ1bmN0aW9uIHBhY2tFbmNsb3NlKC8qQXJyYXk8Q2lyY2xlV3JhcD4qLyBjaXJjbGVzLCBzaHVmZmxlRnVuYykge1xuICB2YXIgbiA9IGNpcmNsZXMubGVuZ3RoO1xuICBpZiAobiA9PT0gMCkgcmV0dXJuIDA7XG5cbiAgdmFyIGEsIGIsIGMsIGFhLCBjYSwgaSwgaiwgaywgc2osIHNrO1xuXG4gIC8vIFBsYWNlIHRoZSBmaXJzdCBjaXJjbGUuXG4gIGEgPSBjaXJjbGVzWzBdO1xuICBhLnggPSAwO1xuICBhLnkgPSAwO1xuICBpZiAobiA8PSAxKSByZXR1cm4gYS5yO1xuXG4gIC8vIFBsYWNlIHRoZSBzZWNvbmQgY2lyY2xlLlxuICBiID0gY2lyY2xlc1sxXTtcbiAgYS54ID0gLWIucjtcbiAgYi54ID0gYS5yO1xuICBiLnkgPSAwO1xuICBpZiAobiA8PSAyKSByZXR1cm4gYS5yICsgYi5yO1xuXG4gIC8vIFBsYWNlIHRoZSB0aGlyZCBjaXJjbGUuXG4gIGMgPSBjaXJjbGVzWzJdO1xuICBwbGFjZShiLCBhLCBjKTtcblxuICAvLyBJbml0aWFsaXplIHRoZSBmcm9udC1jaGFpbiB1c2luZyB0aGUgZmlyc3QgdGhyZWUgY2lyY2xlcyBhLCBiIGFuZCBjLlxuICBhID0gbmV3IENpcmNsZVdyYXAobnVsbCwgbnVsbCwgbnVsbCwgbnVsbCwgYSk7XG4gIGIgPSBuZXcgQ2lyY2xlV3JhcChudWxsLCBudWxsLCBudWxsLCBudWxsLCBiKTtcbiAgYyA9IG5ldyBDaXJjbGVXcmFwKG51bGwsIG51bGwsIG51bGwsIG51bGwsIGMpO1xuICBhLm5leHQgPSBjLnByZXZpb3VzID0gYjtcbiAgYi5uZXh0ID0gYS5wcmV2aW91cyA9IGM7XG4gIGMubmV4dCA9IGIucHJldmlvdXMgPSBhO1xuXG4gIC8vIEF0dGVtcHQgdG8gcGxhY2UgZWFjaCByZW1haW5pbmcgY2lyY2xl4oCmXG4gIHBhY2s6IGZvciAoaSA9IDM7IGkgPCBuOyArK2kpIHtcbiAgICBjID0gY2lyY2xlc1tpXTtcbiAgICBwbGFjZShhLndyYXBwZWRDaXJjbGUsIGIud3JhcHBlZENpcmNsZSwgYyk7XG4gICAgYyA9IG5ldyBDaXJjbGVXcmFwKG51bGwsIG51bGwsIG51bGwsIG51bGwsIGMpO1xuXG4gICAgLy8gRmluZCB0aGUgY2xvc2VzdCBpbnRlcnNlY3RpbmcgY2lyY2xlIG9uIHRoZSBmcm9udC1jaGFpbiwgaWYgYW55LlxuICAgIC8vIOKAnENsb3NlbmVzc+KAnSBpcyBkZXRlcm1pbmVkIGJ5IGxpbmVhciBkaXN0YW5jZSBhbG9uZyB0aGUgZnJvbnQtY2hhaW4uXG4gICAgLy8g4oCcQWhlYWTigJ0gb3Ig4oCcYmVoaW5k4oCdIGlzIGxpa2V3aXNlIGRldGVybWluZWQgYnkgbGluZWFyIGRpc3RhbmNlLlxuICAgIGogPSBiLm5leHQ7XG4gICAgayA9IGEucHJldmlvdXM7XG4gICAgc2ogPSBiLndyYXBwZWRDaXJjbGUucjtcbiAgICBzayA9IGEud3JhcHBlZENpcmNsZS5yO1xuICAgIGRvIHtcbiAgICAgIGlmIChzaiA8PSBzaykge1xuICAgICAgICBpZiAoaW50ZXJzZWN0cyhqLndyYXBwZWRDaXJjbGUsIGMud3JhcHBlZENpcmNsZSkpIHtcbiAgICAgICAgICBiID0gajtcbiAgICAgICAgICBhLm5leHQgPSBiO1xuICAgICAgICAgIGIucHJldmlvdXMgPSBhO1xuICAgICAgICAgIC0taTtcbiAgICAgICAgICBjb250aW51ZSBwYWNrO1xuICAgICAgICB9XG4gICAgICAgIHNqICs9IGoud3JhcHBlZENpcmNsZS5yO1xuICAgICAgICBqID0gai5uZXh0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGludGVyc2VjdHMoay53cmFwcGVkQ2lyY2xlLCBjLndyYXBwZWRDaXJjbGUpKSB7XG4gICAgICAgICAgYSA9IGs7XG4gICAgICAgICAgYS5uZXh0ID0gYjtcbiAgICAgICAgICBiLnByZXZpb3VzID0gYTtcbiAgICAgICAgICAtLWk7XG4gICAgICAgICAgY29udGludWUgcGFjaztcbiAgICAgICAgfVxuICAgICAgICBzayArPSBrLndyYXBwZWRDaXJjbGUucjtcbiAgICAgICAgayA9IGsucHJldmlvdXM7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoaiAhPT0gay5uZXh0KTtcblxuICAgIC8vIFN1Y2Nlc3MhIEluc2VydCB0aGUgbmV3IGNpcmNsZSBjIGJldHdlZW4gYSBhbmQgYi5cbiAgICBjLnByZXZpb3VzID0gYTtcbiAgICBjLm5leHQgPSBiO1xuICAgIGEubmV4dCA9IGIucHJldmlvdXMgPSBiID0gYztcblxuICAgIC8vIENvbXB1dGUgdGhlIG5ldyBjbG9zZXN0IGNpcmNsZSBwYWlyIHRvIHRoZSBjZW50cm9pZC5cbiAgICBhYSA9IHNjb3JlKGEpO1xuICAgIHdoaWxlICgoYyA9IGMubmV4dCkgIT09IGIpIHtcbiAgICAgIGlmICgoY2EgPSBzY29yZShjKSkgPCBhYSkge1xuICAgICAgICBhID0gYztcbiAgICAgICAgYWEgPSBjYTtcbiAgICAgIH1cbiAgICB9XG4gICAgYiA9IGEubmV4dDtcbiAgfVxuXG4gIC8vIENvbXB1dGUgdGhlIGVuY2xvc2luZyBjaXJjbGUgb2YgdGhlIGZyb250IGNoYWluLlxuICBhID0gW2Iud3JhcHBlZENpcmNsZV07XG4gIGMgPSBiO1xuICB2YXIgc2FmZXR5ID0gMTAwMDA7XG4gIHdoaWxlICgoYyA9IGMubmV4dCkgIT09IGIpIHtcbiAgICBpZiAoLS1zYWZldHkgPT09IDApIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBhLnB1c2goYy53cmFwcGVkQ2lyY2xlKTtcbiAgfVxuICBjID0gZW5jbG9zZShhLCBzaHVmZmxlRnVuYyk7XG5cbiAgLy8gVHJhbnNsYXRlIHRoZSBjaXJjbGVzIHRvIHB1dCB0aGUgZW5jbG9zaW5nIGNpcmNsZSBhcm91bmQgdGhlIG9yaWdpbi5cbiAgZm9yIChpID0gMDsgaSA8IG47ICsraSkge1xuICAgIGEgPSBjaXJjbGVzW2ldO1xuICAgIGEueCAtPSBjLng7XG4gICAgYS55IC09IGMueTtcbiAgfVxuICByZXR1cm4gYy5yO1xufVxuXG5mdW5jdGlvbiBwYWNrSGllcmFyY2h5KC8qQ2lyY2xlV3JhcCovIHBhcmVudENpcmNsZSwgc2h1ZmZsZUZ1bmMpIHtcbiAgdmFyIHIgPSAwO1xuICBpZiAocGFyZW50Q2lyY2xlLmhhc0NoaWxkcmVuKCkpIHtcbiAgICAvL3BhY2sgdGhlIGNoaWxkcmVuIGZpcnN0IGJlY2F1c2UgdGhlIHJhZGl1cyBpcyBkZXRlcm1pbmVkIGJ5IGhvdyB0aGUgY2hpbGRyZW4gZ2V0IHBhY2tlZCAocmVjdXJzaXZlKVxuICAgIGZvciAodmFyIGtleSBpbiBwYXJlbnRDaXJjbGUuY2hpbGRyZW4pIHtcbiAgICAgIHZhciBjaXJjbGUgPSBwYXJlbnRDaXJjbGUuY2hpbGRyZW5ba2V5XTtcbiAgICAgIGlmIChjaXJjbGUuaGFzQ2hpbGRyZW4oKSkge1xuICAgICAgICBjaXJjbGUuciA9IHBhY2tIaWVyYXJjaHkoY2lyY2xlLCBzaHVmZmxlRnVuYyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vbm93IHRoYXQgZWFjaCBjaXJjbGUgaGFzIGEgcmFkaXVzIHNldCBieSBpdHMgY2hpbGRyZW4sIHBhY2sgdGhlIGNpcmNsZXMgYXQgdGhpcyBsZXZlbFxuICAgIHIgPSBwYWNrRW5jbG9zZShPYmplY3QudmFsdWVzKHBhcmVudENpcmNsZS5jaGlsZHJlbiksIHNodWZmbGVGdW5jKTtcbiAgfVxuICByZXR1cm4gcjtcbn1cblxuZnVuY3Rpb24gcGFja0hpZXJhcmNoeUFuZFNoaWZ0KC8qQ2lyY2xlV3JhcCovIHBhcmVudENpcmNsZSwgc2h1ZmZsZUZ1bmMpIHtcbiAgcGFja0hpZXJhcmNoeShwYXJlbnRDaXJjbGUsIHNodWZmbGVGdW5jKTtcbiAgZm9yICh2YXIga2V5IGluIHBhcmVudENpcmNsZS5jaGlsZHJlbikge1xuICAgIHZhciBjaXJjbGUgPSBwYXJlbnRDaXJjbGUuY2hpbGRyZW5ba2V5XTtcbiAgICBjaXJjbGUuYXBwbHlQb3NpdGlvblRvQ2hpbGRyZW4oKTtcbiAgfVxufVxuXG4vKipcbiAqIEFic3RyYWN0IGZ1bmN0aW9uIHJ1bm5pbmcgdGhlIGxheW91dC5cbiAqXG4gKiBAcGFyYW0gIHtHcmFwaH0gICAgZ3JhcGggICAgICAgICAgICAgICAgICAgLSBUYXJnZXQgIGdyYXBoLlxuICogQHBhcmFtICB7b2JqZWN0fSAgIFtvcHRpb25zXSAgICAgICAgICAgICAgIC0gT3B0aW9uczpcbiAqIEBwYXJhbSAge29iamVjdH0gICAgIFthdHRyaWJ1dGVzXSAgICAgICAgICAtIEF0dHJpYnV0ZXMgbmFtZXMgdG8gbWFwLlxuICogQHBhcmFtICB7bnVtYmVyfSAgICAgW2NlbnRlcl0gICAgICAgICAgICAgIC0gQ2VudGVyIG9mIHRoZSBsYXlvdXQuXG4gKiBAcGFyYW0gIHtzdHJpbmdbXX0gICBbaGllcmFyY2h5QXR0cmlidXRlc10gLSBMaXN0IG9mIGF0dHJpYnV0ZXMgdXNlZCBmb3IgdGhlIGxheW91dCBpbiBkZWNyZWFzaW5nIG9yZGVyLlxuICogQHBhcmFtICB7ZnVuY3Rpb259ICAgW3JuZ10gICAgICAgICAgICAgICAgIC0gQ3VzdG9tIFJORyBmdW5jdGlvbiB0byBiZSB1c2VkLlxuICogQHBhcmFtICB7bnVtYmVyfSAgICAgW3NjYWxlXSAgICAgICAgICAgICAgIC0gU2NhbGUgb2YgdGhlIGxheW91dC5cbiAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICAgICAtIFRoZSBwb3NpdGlvbnMgYnkgbm9kZS5cbiAqL1xuZnVuY3Rpb24gZ2VuZXJpY0NpcmNsZVBhY2tMYXlvdXQoYXNzaWduLCBncmFwaCwgb3B0aW9ucykge1xuICBpZiAoIWlzR3JhcGgoZ3JhcGgpKVxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdncmFwaG9sb2d5LWxheW91dC9jaXJjbGVwYWNrOiB0aGUgZ2l2ZW4gZ3JhcGggaXMgbm90IGEgdmFsaWQgZ3JhcGhvbG9neSBpbnN0YW5jZS4nXG4gICAgKTtcblxuICBvcHRpb25zID0gcmVzb2x2ZURlZmF1bHRzKG9wdGlvbnMsIERFRkFVTFRTKTtcblxuICB2YXIgcG9zTWFwID0ge30sXG4gICAgcG9zaXRpb25zID0ge30sXG4gICAgbm9kZXMgPSBncmFwaC5ub2RlcygpLFxuICAgIGNlbnRlciA9IG9wdGlvbnMuY2VudGVyLFxuICAgIGhpZXJhcmNoeUF0dHJpYnV0ZXMgPSBvcHRpb25zLmhpZXJhcmNoeUF0dHJpYnV0ZXMsXG4gICAgc2h1ZmZsZUZ1bmMgPSBzaHVmZmxlLmNyZWF0ZVNodWZmbGVJblBsYWNlKG9wdGlvbnMucm5nKSxcbiAgICBzY2FsZSA9IG9wdGlvbnMuc2NhbGU7XG5cbiAgdmFyIGNvbnRhaW5lciA9IG5ldyBDaXJjbGVXcmFwKCk7XG5cbiAgZ3JhcGguZm9yRWFjaE5vZGUoZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuICAgIHZhciByID0gYXR0cmlidXRlcy5zaXplID8gYXR0cmlidXRlcy5zaXplIDogMTtcbiAgICB2YXIgbmV3Q2lyY2xlV3JhcCA9IG5ldyBDaXJjbGVXcmFwKGtleSwgbnVsbCwgbnVsbCwgcik7XG4gICAgdmFyIHBhcmVudENvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAgIGhpZXJhcmNoeUF0dHJpYnV0ZXMuZm9yRWFjaChmdW5jdGlvbiAodikge1xuICAgICAgdmFyIGF0dHIgPSBhdHRyaWJ1dGVzW3ZdO1xuICAgICAgcGFyZW50Q29udGFpbmVyID0gcGFyZW50Q29udGFpbmVyLmdldENoaWxkKGF0dHIpO1xuICAgIH0pO1xuXG4gICAgcGFyZW50Q29udGFpbmVyLmFkZENoaWxkKGtleSwgbmV3Q2lyY2xlV3JhcCk7XG4gIH0pO1xuICBwYWNrSGllcmFyY2h5QW5kU2hpZnQoY29udGFpbmVyLCBzaHVmZmxlRnVuYyk7XG4gIHNldE5vZGUoZ3JhcGgsIGNvbnRhaW5lciwgcG9zTWFwKTtcbiAgdmFyIGwgPSBub2Rlcy5sZW5ndGgsXG4gICAgeCxcbiAgICB5LFxuICAgIGk7XG4gIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuXG4gICAgeCA9IGNlbnRlciArIHNjYWxlICogcG9zTWFwW25vZGVdLng7XG4gICAgeSA9IGNlbnRlciArIHNjYWxlICogcG9zTWFwW25vZGVdLnk7XG5cbiAgICBwb3NpdGlvbnNbbm9kZV0gPSB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH07XG5cbiAgICBpZiAoYXNzaWduKSB7XG4gICAgICBncmFwaC5zZXROb2RlQXR0cmlidXRlKG5vZGUsIG9wdGlvbnMuYXR0cmlidXRlcy54LCB4KTtcbiAgICAgIGdyYXBoLnNldE5vZGVBdHRyaWJ1dGUobm9kZSwgb3B0aW9ucy5hdHRyaWJ1dGVzLnksIHkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcG9zaXRpb25zO1xufVxuXG52YXIgY2lyY2xlUGFja0xheW91dCA9IGdlbmVyaWNDaXJjbGVQYWNrTGF5b3V0LmJpbmQobnVsbCwgZmFsc2UpO1xuY2lyY2xlUGFja0xheW91dC5hc3NpZ24gPSBnZW5lcmljQ2lyY2xlUGFja0xheW91dC5iaW5kKG51bGwsIHRydWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNpcmNsZVBhY2tMYXlvdXQ7XG4iLCIvKipcbiAqIEdyYXBob2xvZ3kgQ2lyY3VsYXIgTGF5b3V0XG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBMYXlvdXQgYXJyYW5naW5nIHRoZSBub2RlcyBpbiBhIGNpcmNsZS5cbiAqL1xudmFyIHJlc29sdmVEZWZhdWx0cyA9IHJlcXVpcmUoJ2dyYXBob2xvZ3ktdXRpbHMvZGVmYXVsdHMnKTtcbnZhciBpc0dyYXBoID0gcmVxdWlyZSgnZ3JhcGhvbG9neS11dGlscy9pcy1ncmFwaCcpO1xuXG4vKipcbiAqIERlZmF1bHQgb3B0aW9ucy5cbiAqL1xudmFyIERFRkFVTFRTID0ge1xuICBkaW1lbnNpb25zOiBbJ3gnLCAneSddLFxuICBjZW50ZXI6IDAuNSxcbiAgc2NhbGU6IDFcbn07XG5cbi8qKlxuICogQWJzdHJhY3QgZnVuY3Rpb24gcnVubmluZyB0aGUgbGF5b3V0LlxuICpcbiAqIEBwYXJhbSAge0dyYXBofSAgICBncmFwaCAgICAgICAgICAtIFRhcmdldCAgZ3JhcGguXG4gKiBAcGFyYW0gIHtvYmplY3R9ICAgW29wdGlvbnNdICAgICAgLSBPcHRpb25zOlxuICogQHBhcmFtICB7b2JqZWN0fSAgICAgW2F0dHJpYnV0ZXNdIC0gQXR0cmlidXRlcyBuYW1lcyB0byBtYXAuXG4gKiBAcGFyYW0gIHtudW1iZXJ9ICAgICBbY2VudGVyXSAgICAgLSBDZW50ZXIgb2YgdGhlIGxheW91dC5cbiAqIEBwYXJhbSAge251bWJlcn0gICAgIFtzY2FsZV0gICAgICAtIFNjYWxlIG9mIHRoZSBsYXlvdXQuXG4gKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgLSBUaGUgcG9zaXRpb25zIGJ5IG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGdlbmVyaWNDaXJjdWxhckxheW91dChhc3NpZ24sIGdyYXBoLCBvcHRpb25zKSB7XG4gIGlmICghaXNHcmFwaChncmFwaCkpXG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ2dyYXBob2xvZ3ktbGF5b3V0L3JhbmRvbTogdGhlIGdpdmVuIGdyYXBoIGlzIG5vdCBhIHZhbGlkIGdyYXBob2xvZ3kgaW5zdGFuY2UuJ1xuICAgICk7XG5cbiAgb3B0aW9ucyA9IHJlc29sdmVEZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUyk7XG5cbiAgdmFyIGRpbWVuc2lvbnMgPSBvcHRpb25zLmRpbWVuc2lvbnM7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGRpbWVuc2lvbnMpIHx8IGRpbWVuc2lvbnMubGVuZ3RoICE9PSAyKVxuICAgIHRocm93IG5ldyBFcnJvcignZ3JhcGhvbG9neS1sYXlvdXQvcmFuZG9tOiBnaXZlbiBkaW1lbnNpb25zIGFyZSBpbnZhbGlkLicpO1xuXG4gIHZhciBjZW50ZXIgPSBvcHRpb25zLmNlbnRlcjtcbiAgdmFyIHNjYWxlID0gb3B0aW9ucy5zY2FsZTtcbiAgdmFyIHRhdSA9IE1hdGguUEkgKiAyO1xuXG4gIHZhciBvZmZzZXQgPSAoY2VudGVyIC0gMC41KSAqIHNjYWxlO1xuICB2YXIgbCA9IGdyYXBoLm9yZGVyO1xuXG4gIHZhciB4ID0gZGltZW5zaW9uc1swXTtcbiAgdmFyIHkgPSBkaW1lbnNpb25zWzFdO1xuXG4gIGZ1bmN0aW9uIGFzc2lnblBvc2l0aW9uKGksIHRhcmdldCkge1xuICAgIHRhcmdldFt4XSA9IHNjYWxlICogTWF0aC5jb3MoKGkgKiB0YXUpIC8gbCkgKyBvZmZzZXQ7XG4gICAgdGFyZ2V0W3ldID0gc2NhbGUgKiBNYXRoLnNpbigoaSAqIHRhdSkgLyBsKSArIG9mZnNldDtcblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICB2YXIgaSA9IDA7XG5cbiAgaWYgKCFhc3NpZ24pIHtcbiAgICB2YXIgcG9zaXRpb25zID0ge307XG5cbiAgICBncmFwaC5mb3JFYWNoTm9kZShmdW5jdGlvbiAobm9kZSkge1xuICAgICAgcG9zaXRpb25zW25vZGVdID0gYXNzaWduUG9zaXRpb24oaSsrLCB7fSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcG9zaXRpb25zO1xuICB9XG5cbiAgZ3JhcGgudXBkYXRlRWFjaE5vZGVBdHRyaWJ1dGVzKFxuICAgIGZ1bmN0aW9uIChfLCBhdHRyKSB7XG4gICAgICBhc3NpZ25Qb3NpdGlvbihpKyssIGF0dHIpO1xuICAgICAgcmV0dXJuIGF0dHI7XG4gICAgfSxcbiAgICB7XG4gICAgICBhdHRyaWJ1dGVzOiBkaW1lbnNpb25zXG4gICAgfVxuICApO1xufVxuXG52YXIgY2lyY3VsYXJMYXlvdXQgPSBnZW5lcmljQ2lyY3VsYXJMYXlvdXQuYmluZChudWxsLCBmYWxzZSk7XG5jaXJjdWxhckxheW91dC5hc3NpZ24gPSBnZW5lcmljQ2lyY3VsYXJMYXlvdXQuYmluZChudWxsLCB0cnVlKTtcblxubW9kdWxlLmV4cG9ydHMgPSBjaXJjdWxhckxheW91dDtcbiIsIi8qKlxuICogR3JhcGhvbG9neSBMYXlvdXRcbiAqID09PT09PT09PT09PT09PT09PVxuICpcbiAqIExpYnJhcnkgZW5kcG9pbnQuXG4gKi9cbmV4cG9ydHMuY2lyY2xlcGFjayA9IHJlcXVpcmUoJy4vY2lyY2xlcGFjay5qcycpO1xuZXhwb3J0cy5jaXJjdWxhciA9IHJlcXVpcmUoJy4vY2lyY3VsYXIuanMnKTtcbmV4cG9ydHMucmFuZG9tID0gcmVxdWlyZSgnLi9yYW5kb20uanMnKTtcbmV4cG9ydHMucm90YXRpb24gPSByZXF1aXJlKCcuL3JvdGF0aW9uLmpzJyk7XG4iLCIvKipcbiAqIEdyYXBob2xvZ3kgUmFuZG9tIExheW91dFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIFNpbXBsZSBsYXlvdXQgZ2l2aW5nIHVuaWZvcm0gcmFuZG9tIHBvc2l0aW9ucyB0byB0aGUgbm9kZXMuXG4gKi9cbnZhciByZXNvbHZlRGVmYXVsdHMgPSByZXF1aXJlKCdncmFwaG9sb2d5LXV0aWxzL2RlZmF1bHRzJyk7XG52YXIgaXNHcmFwaCA9IHJlcXVpcmUoJ2dyYXBob2xvZ3ktdXRpbHMvaXMtZ3JhcGgnKTtcblxuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnMuXG4gKi9cbnZhciBERUZBVUxUUyA9IHtcbiAgZGltZW5zaW9uczogWyd4JywgJ3knXSxcbiAgY2VudGVyOiAwLjUsXG4gIHJuZzogTWF0aC5yYW5kb20sXG4gIHNjYWxlOiAxXG59O1xuXG4vKipcbiAqIEFic3RyYWN0IGZ1bmN0aW9uIHJ1bm5pbmcgdGhlIGxheW91dC5cbiAqXG4gKiBAcGFyYW0gIHtHcmFwaH0gICAgZ3JhcGggICAgICAgICAgLSBUYXJnZXQgIGdyYXBoLlxuICogQHBhcmFtICB7b2JqZWN0fSAgIFtvcHRpb25zXSAgICAgIC0gT3B0aW9uczpcbiAqIEBwYXJhbSAge2FycmF5fSAgICAgIFtkaW1lbnNpb25zXSAtIExpc3Qgb2YgZGltZW5zaW9ucyBvZiB0aGUgbGF5b3V0LlxuICogQHBhcmFtICB7bnVtYmVyfSAgICAgW2NlbnRlcl0gICAgIC0gQ2VudGVyIG9mIHRoZSBsYXlvdXQuXG4gKiBAcGFyYW0gIHtmdW5jdGlvbn0gICBbcm5nXSAgICAgICAgLSBDdXN0b20gUk5HIGZ1bmN0aW9uIHRvIGJlIHVzZWQuXG4gKiBAcGFyYW0gIHtudW1iZXJ9ICAgICBbc2NhbGVdICAgICAgLSBTY2FsZSBvZiB0aGUgbGF5b3V0LlxuICogQHJldHVybiB7b2JqZWN0fSAgICAgICAgICAgICAgICAgIC0gVGhlIHBvc2l0aW9ucyBieSBub2RlLlxuICovXG5mdW5jdGlvbiBnZW5lcmljUmFuZG9tTGF5b3V0KGFzc2lnbiwgZ3JhcGgsIG9wdGlvbnMpIHtcbiAgaWYgKCFpc0dyYXBoKGdyYXBoKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnZ3JhcGhvbG9neS1sYXlvdXQvcmFuZG9tOiB0aGUgZ2l2ZW4gZ3JhcGggaXMgbm90IGEgdmFsaWQgZ3JhcGhvbG9neSBpbnN0YW5jZS4nXG4gICAgKTtcblxuICBvcHRpb25zID0gcmVzb2x2ZURlZmF1bHRzKG9wdGlvbnMsIERFRkFVTFRTKTtcblxuICB2YXIgZGltZW5zaW9ucyA9IG9wdGlvbnMuZGltZW5zaW9ucztcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoZGltZW5zaW9ucykgfHwgZGltZW5zaW9ucy5sZW5ndGggPCAxKVxuICAgIHRocm93IG5ldyBFcnJvcignZ3JhcGhvbG9neS1sYXlvdXQvcmFuZG9tOiBnaXZlbiBkaW1lbnNpb25zIGFyZSBpbnZhbGlkLicpO1xuXG4gIHZhciBkID0gZGltZW5zaW9ucy5sZW5ndGg7XG4gIHZhciBjZW50ZXIgPSBvcHRpb25zLmNlbnRlcjtcbiAgdmFyIHJuZyA9IG9wdGlvbnMucm5nO1xuICB2YXIgc2NhbGUgPSBvcHRpb25zLnNjYWxlO1xuXG4gIHZhciBvZmZzZXQgPSAoY2VudGVyIC0gMC41KSAqIHNjYWxlO1xuXG4gIGZ1bmN0aW9uIGFzc2lnblBvc2l0aW9uKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZDsgaSsrKSB7XG4gICAgICB0YXJnZXRbZGltZW5zaW9uc1tpXV0gPSBybmcoKSAqIHNjYWxlICsgb2Zmc2V0O1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICBpZiAoIWFzc2lnbikge1xuICAgIHZhciBwb3NpdGlvbnMgPSB7fTtcblxuICAgIGdyYXBoLmZvckVhY2hOb2RlKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICBwb3NpdGlvbnNbbm9kZV0gPSBhc3NpZ25Qb3NpdGlvbih7fSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcG9zaXRpb25zO1xuICB9XG5cbiAgZ3JhcGgudXBkYXRlRWFjaE5vZGVBdHRyaWJ1dGVzKFxuICAgIGZ1bmN0aW9uIChfLCBhdHRyKSB7XG4gICAgICBhc3NpZ25Qb3NpdGlvbihhdHRyKTtcbiAgICAgIHJldHVybiBhdHRyO1xuICAgIH0sXG4gICAge1xuICAgICAgYXR0cmlidXRlczogZGltZW5zaW9uc1xuICAgIH1cbiAgKTtcbn1cblxudmFyIHJhbmRvbUxheW91dCA9IGdlbmVyaWNSYW5kb21MYXlvdXQuYmluZChudWxsLCBmYWxzZSk7XG5yYW5kb21MYXlvdXQuYXNzaWduID0gZ2VuZXJpY1JhbmRvbUxheW91dC5iaW5kKG51bGwsIHRydWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmRvbUxheW91dDtcbiIsIi8qKlxuICogR3JhcGhvbG9neSBSb3RhdGlvbiBMYXlvdXQgSGVscGVyXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogRnVuY3Rpb24gcm90YXRpbmcgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBncmFwaC5cbiAqL1xudmFyIHJlc29sdmVEZWZhdWx0cyA9IHJlcXVpcmUoJ2dyYXBob2xvZ3ktdXRpbHMvZGVmYXVsdHMnKTtcbnZhciBpc0dyYXBoID0gcmVxdWlyZSgnZ3JhcGhvbG9neS11dGlscy9pcy1ncmFwaCcpO1xuXG4vKipcbiAqIENvbnN0YW50cy5cbiAqL1xudmFyIFJBRF9DT05WRVJTSU9OID0gTWF0aC5QSSAvIDE4MDtcblxuLyoqXG4gKiBEZWZhdWx0IG9wdGlvbnMuXG4gKi9cbnZhciBERUZBVUxUUyA9IHtcbiAgZGltZW5zaW9uczogWyd4JywgJ3knXSxcbiAgY2VudGVyZWRPblplcm86IGZhbHNlLFxuICBkZWdyZWVzOiBmYWxzZVxufTtcblxuLyoqXG4gKiBBYnN0cmFjdCBmdW5jdGlvbiBmb3Igcm90YXRpbmcgYSBncmFwaCdzIGNvb3JkaW5hdGVzLlxuICpcbiAqIEBwYXJhbSAge0dyYXBofSAgICBncmFwaCAgICAgICAgICAtIFRhcmdldCAgZ3JhcGguXG4gKiBAcGFyYW0gIHtudW1iZXJ9ICAgYW5nbGUgICAgICAgICAgLSBSb3RhdGlvbiBhbmdsZS5cbiAqIEBwYXJhbSAge29iamVjdH0gICBbb3B0aW9uc10gICAgICAtIE9wdGlvbnMuXG4gKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgICAgICAgLSBUaGUgcG9zaXRpb25zIGJ5IG5vZGUuXG4gKi9cbmZ1bmN0aW9uIGdlbmVyaWNSb3RhdGlvbihhc3NpZ24sIGdyYXBoLCBhbmdsZSwgb3B0aW9ucykge1xuICBpZiAoIWlzR3JhcGgoZ3JhcGgpKVxuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdncmFwaG9sb2d5LWxheW91dC9yb3RhdGlvbjogdGhlIGdpdmVuIGdyYXBoIGlzIG5vdCBhIHZhbGlkIGdyYXBob2xvZ3kgaW5zdGFuY2UuJ1xuICAgICk7XG5cbiAgb3B0aW9ucyA9IHJlc29sdmVEZWZhdWx0cyhvcHRpb25zLCBERUZBVUxUUyk7XG5cbiAgaWYgKG9wdGlvbnMuZGVncmVlcykgYW5nbGUgKj0gUkFEX0NPTlZFUlNJT047XG5cbiAgdmFyIGRpbWVuc2lvbnMgPSBvcHRpb25zLmRpbWVuc2lvbnM7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGRpbWVuc2lvbnMpIHx8IGRpbWVuc2lvbnMubGVuZ3RoICE9PSAyKVxuICAgIHRocm93IG5ldyBFcnJvcignZ3JhcGhvbG9neS1sYXlvdXQvcmFuZG9tOiBnaXZlbiBkaW1lbnNpb25zIGFyZSBpbnZhbGlkLicpO1xuXG4gIC8vIEhhbmRsaW5nIG51bGwgZ3JhcGhcbiAgaWYgKGdyYXBoLm9yZGVyID09PSAwKSB7XG4gICAgaWYgKGFzc2lnbikgcmV0dXJuO1xuXG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgdmFyIHhkID0gZGltZW5zaW9uc1swXTtcbiAgdmFyIHlkID0gZGltZW5zaW9uc1sxXTtcblxuICB2YXIgeENlbnRlciA9IDA7XG4gIHZhciB5Q2VudGVyID0gMDtcblxuICBpZiAoIW9wdGlvbnMuY2VudGVyZWRPblplcm8pIHtcbiAgICAvLyBGaW5kaW5nIGJvdW5kcyBvZiB0aGUgZ3JhcGhcbiAgICB2YXIgeE1pbiA9IEluZmluaXR5O1xuICAgIHZhciB4TWF4ID0gLUluZmluaXR5O1xuICAgIHZhciB5TWluID0gSW5maW5pdHk7XG4gICAgdmFyIHlNYXggPSAtSW5maW5pdHk7XG5cbiAgICBncmFwaC5mb3JFYWNoTm9kZShmdW5jdGlvbiAobm9kZSwgYXR0cikge1xuICAgICAgdmFyIHggPSBhdHRyW3hkXTtcbiAgICAgIHZhciB5ID0gYXR0clt5ZF07XG5cbiAgICAgIGlmICh4IDwgeE1pbikgeE1pbiA9IHg7XG4gICAgICBpZiAoeCA+IHhNYXgpIHhNYXggPSB4O1xuICAgICAgaWYgKHkgPCB5TWluKSB5TWluID0geTtcbiAgICAgIGlmICh5ID4geU1heCkgeU1heCA9IHk7XG4gICAgfSk7XG5cbiAgICB4Q2VudGVyID0gKHhNaW4gKyB4TWF4KSAvIDI7XG4gICAgeUNlbnRlciA9ICh5TWluICsgeU1heCkgLyAyO1xuICB9XG5cbiAgdmFyIGNvcyA9IE1hdGguY29zKGFuZ2xlKTtcbiAgdmFyIHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcblxuICBmdW5jdGlvbiBhc3NpZ25Qb3NpdGlvbih0YXJnZXQpIHtcbiAgICB2YXIgeCA9IHRhcmdldFt4ZF07XG4gICAgdmFyIHkgPSB0YXJnZXRbeWRdO1xuXG4gICAgdGFyZ2V0W3hkXSA9IHhDZW50ZXIgKyAoeCAtIHhDZW50ZXIpICogY29zIC0gKHkgLSB5Q2VudGVyKSAqIHNpbjtcbiAgICB0YXJnZXRbeWRdID0geUNlbnRlciArICh4IC0geENlbnRlcikgKiBzaW4gKyAoeSAtIHlDZW50ZXIpICogY29zO1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIGlmICghYXNzaWduKSB7XG4gICAgdmFyIHBvc2l0aW9ucyA9IHt9O1xuXG4gICAgZ3JhcGguZm9yRWFjaE5vZGUoZnVuY3Rpb24gKG5vZGUsIGF0dHIpIHtcbiAgICAgIHZhciBvID0ge307XG4gICAgICBvW3hkXSA9IGF0dHJbeGRdO1xuICAgICAgb1t5ZF0gPSBhdHRyW3lkXTtcbiAgICAgIHBvc2l0aW9uc1tub2RlXSA9IGFzc2lnblBvc2l0aW9uKG8pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBvc2l0aW9ucztcbiAgfVxuXG4gIGdyYXBoLnVwZGF0ZUVhY2hOb2RlQXR0cmlidXRlcyhcbiAgICBmdW5jdGlvbiAoXywgYXR0cikge1xuICAgICAgYXNzaWduUG9zaXRpb24oYXR0cik7XG4gICAgICByZXR1cm4gYXR0cjtcbiAgICB9LFxuICAgIHtcbiAgICAgIGF0dHJpYnV0ZXM6IGRpbWVuc2lvbnNcbiAgICB9XG4gICk7XG59XG5cbnZhciByb3RhdGlvbiA9IGdlbmVyaWNSb3RhdGlvbi5iaW5kKG51bGwsIGZhbHNlKTtcbnJvdGF0aW9uLmFzc2lnbiA9IGdlbmVyaWNSb3RhdGlvbi5iaW5kKG51bGwsIHRydWUpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvdGF0aW9uO1xuIiwiLyoqXG4gKiBHcmFwaG9sb2d5IERlZmF1bHRzXG4gKiA9PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIEhlbHBlciBmdW5jdGlvbiB1c2VkIHRocm91Z2hvdXQgdGhlIHN0YW5kYXJkIGxpYiB0byByZXNvbHZlIGRlZmF1bHRzLlxuICovXG5mdW5jdGlvbiBpc0xlYWYobykge1xuICByZXR1cm4gKFxuICAgICFvIHx8XG4gICAgdHlwZW9mIG8gIT09ICdvYmplY3QnIHx8XG4gICAgdHlwZW9mIG8gPT09ICdmdW5jdGlvbicgfHxcbiAgICBBcnJheS5pc0FycmF5KG8pIHx8XG4gICAgbyBpbnN0YW5jZW9mIFNldCB8fFxuICAgIG8gaW5zdGFuY2VvZiBNYXAgfHxcbiAgICBvIGluc3RhbmNlb2YgUmVnRXhwIHx8XG4gICAgbyBpbnN0YW5jZW9mIERhdGVcbiAgKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZURlZmF1bHRzKHRhcmdldCwgZGVmYXVsdHMpIHtcbiAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9O1xuXG4gIHZhciBvdXRwdXQgPSB7fTtcblxuICBmb3IgKHZhciBrIGluIGRlZmF1bHRzKSB7XG4gICAgdmFyIGV4aXN0aW5nID0gdGFyZ2V0W2tdO1xuICAgIHZhciBkZWYgPSBkZWZhdWx0c1trXTtcblxuICAgIC8vIFJlY3Vyc2lvblxuICAgIGlmICghaXNMZWFmKGRlZikpIHtcbiAgICAgIG91dHB1dFtrXSA9IHJlc29sdmVEZWZhdWx0cyhleGlzdGluZywgZGVmKTtcblxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgLy8gTGVhZlxuICAgIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvdXRwdXRba10gPSBkZWY7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dFtrXSA9IGV4aXN0aW5nO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmVzb2x2ZURlZmF1bHRzO1xuIiwiLyoqXG4gKiBHcmFwaG9sb2d5IFdlaWdodCBHZXR0ZXJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBGdW5jdGlvbiBjcmVhdGluZyB3ZWlnaHQgZ2V0dGVycy5cbiAqL1xuZnVuY3Rpb24gY29lcmNlV2VpZ2h0KHZhbHVlKSB7XG4gIC8vIEVuc3VyaW5nIHRhcmdldCB2YWx1ZSBpcyBhIGNvcnJlY3QgbnVtYmVyXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8IGlzTmFOKHZhbHVlKSkgcmV0dXJuIDE7XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb2RlVmFsdWVHZXR0ZXIobmFtZU9yRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgZ2V0dGVyID0ge307XG5cbiAgdmFyIGNvZXJjZVRvRGVmYXVsdCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKHR5cGVvZiB2ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIHJldHVybiB2O1xuICB9O1xuXG4gIGlmICh0eXBlb2YgZGVmYXVsdFZhbHVlID09PSAnZnVuY3Rpb24nKSBjb2VyY2VUb0RlZmF1bHQgPSBkZWZhdWx0VmFsdWU7XG5cbiAgdmFyIGdldCA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIGNvZXJjZVRvRGVmYXVsdChhdHRyaWJ1dGVzW25hbWVPckZ1bmN0aW9uXSk7XG4gIH07XG5cbiAgdmFyIHJldHVybkRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvZXJjZVRvRGVmYXVsdCh1bmRlZmluZWQpO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgbmFtZU9yRnVuY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgZ2V0dGVyLmZyb21BdHRyaWJ1dGVzID0gZ2V0O1xuICAgIGdldHRlci5mcm9tR3JhcGggPSBmdW5jdGlvbiAoZ3JhcGgsIG5vZGUpIHtcbiAgICAgIHJldHVybiBnZXQoZ3JhcGguZ2V0Tm9kZUF0dHJpYnV0ZXMobm9kZSkpO1xuICAgIH07XG4gICAgZ2V0dGVyLmZyb21FbnRyeSA9IGZ1bmN0aW9uIChub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICByZXR1cm4gZ2V0KGF0dHJpYnV0ZXMpO1xuICAgIH07XG4gIH0gZWxzZSBpZiAodHlwZW9mIG5hbWVPckZ1bmN0aW9uID09PSAnZnVuY3Rpb24nKSB7XG4gICAgZ2V0dGVyLmZyb21BdHRyaWJ1dGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnZ3JhcGhvbG9neS11dGlscy9nZXR0ZXJzL2NyZWF0ZU5vZGVWYWx1ZUdldHRlcjogaXJyZWxldmFudCB1c2FnZS4nXG4gICAgICApO1xuICAgIH07XG4gICAgZ2V0dGVyLmZyb21HcmFwaCA9IGZ1bmN0aW9uIChncmFwaCwgbm9kZSkge1xuICAgICAgcmV0dXJuIGNvZXJjZVRvRGVmYXVsdChcbiAgICAgICAgbmFtZU9yRnVuY3Rpb24obm9kZSwgZ3JhcGguZ2V0Tm9kZUF0dHJpYnV0ZXMobm9kZSkpXG4gICAgICApO1xuICAgIH07XG4gICAgZ2V0dGVyLmZyb21FbnRyeSA9IGZ1bmN0aW9uIChub2RlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICByZXR1cm4gY29lcmNlVG9EZWZhdWx0KG5hbWVPckZ1bmN0aW9uKG5vZGUsIGF0dHJpYnV0ZXMpKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGdldHRlci5mcm9tQXR0cmlidXRlcyA9IHJldHVybkRlZmF1bHQ7XG4gICAgZ2V0dGVyLmZyb21HcmFwaCA9IHJldHVybkRlZmF1bHQ7XG4gICAgZ2V0dGVyLmZyb21FbnRyeSA9IHJldHVybkRlZmF1bHQ7XG4gIH1cblxuICByZXR1cm4gZ2V0dGVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFZGdlVmFsdWVHZXR0ZXIobmFtZU9yRnVuY3Rpb24sIGRlZmF1bHRWYWx1ZSkge1xuICB2YXIgZ2V0dGVyID0ge307XG5cbiAgdmFyIGNvZXJjZVRvRGVmYXVsdCA9IGZ1bmN0aW9uICh2KSB7XG4gICAgaWYgKHR5cGVvZiB2ID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcblxuICAgIHJldHVybiB2O1xuICB9O1xuXG4gIGlmICh0eXBlb2YgZGVmYXVsdFZhbHVlID09PSAnZnVuY3Rpb24nKSBjb2VyY2VUb0RlZmF1bHQgPSBkZWZhdWx0VmFsdWU7XG5cbiAgdmFyIGdldCA9IGZ1bmN0aW9uIChhdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuIGNvZXJjZVRvRGVmYXVsdChhdHRyaWJ1dGVzW25hbWVPckZ1bmN0aW9uXSk7XG4gIH07XG5cbiAgdmFyIHJldHVybkRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGNvZXJjZVRvRGVmYXVsdCh1bmRlZmluZWQpO1xuICB9O1xuXG4gIGlmICh0eXBlb2YgbmFtZU9yRnVuY3Rpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgZ2V0dGVyLmZyb21BdHRyaWJ1dGVzID0gZ2V0O1xuICAgIGdldHRlci5mcm9tR3JhcGggPSBmdW5jdGlvbiAoZ3JhcGgsIGVkZ2UpIHtcbiAgICAgIHJldHVybiBnZXQoZ3JhcGguZ2V0RWRnZUF0dHJpYnV0ZXMoZWRnZSkpO1xuICAgIH07XG4gICAgZ2V0dGVyLmZyb21FbnRyeSA9IGZ1bmN0aW9uIChlZGdlLCBhdHRyaWJ1dGVzKSB7XG4gICAgICByZXR1cm4gZ2V0KGF0dHJpYnV0ZXMpO1xuICAgIH07XG4gICAgZ2V0dGVyLmZyb21QYXJ0aWFsRW50cnkgPSBnZXR0ZXIuZnJvbUVudHJ5O1xuICAgIGdldHRlci5mcm9tTWluaW1hbEVudHJ5ID0gZ2V0dGVyLmZyb21FbnRyeTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbmFtZU9yRnVuY3Rpb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBnZXR0ZXIuZnJvbUF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdncmFwaG9sb2d5LXV0aWxzL2dldHRlcnMvY3JlYXRlRWRnZVZhbHVlR2V0dGVyOiBpcnJlbGV2YW50IHVzYWdlLidcbiAgICAgICk7XG4gICAgfTtcbiAgICBnZXR0ZXIuZnJvbUdyYXBoID0gZnVuY3Rpb24gKGdyYXBoLCBlZGdlKSB7XG4gICAgICAvLyBUT0RPOiB3ZSBjYW4gZG8gYmV0dGVyLCBjaGVjayAjMzEwXG4gICAgICB2YXIgZXh0cmVtaXRpZXMgPSBncmFwaC5leHRyZW1pdGllcyhlZGdlKTtcbiAgICAgIHJldHVybiBjb2VyY2VUb0RlZmF1bHQoXG4gICAgICAgIG5hbWVPckZ1bmN0aW9uKFxuICAgICAgICAgIGVkZ2UsXG4gICAgICAgICAgZ3JhcGguZ2V0RWRnZUF0dHJpYnV0ZXMoZWRnZSksXG4gICAgICAgICAgZXh0cmVtaXRpZXNbMF0sXG4gICAgICAgICAgZXh0cmVtaXRpZXNbMV0sXG4gICAgICAgICAgZ3JhcGguZ2V0Tm9kZUF0dHJpYnV0ZXMoZXh0cmVtaXRpZXNbMF0pLFxuICAgICAgICAgIGdyYXBoLmdldE5vZGVBdHRyaWJ1dGVzKGV4dHJlbWl0aWVzWzFdKSxcbiAgICAgICAgICBncmFwaC5pc1VuZGlyZWN0ZWQoZWRnZSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9O1xuICAgIGdldHRlci5mcm9tRW50cnkgPSBmdW5jdGlvbiAoZSwgYSwgcywgdCwgc2EsIHRhLCB1KSB7XG4gICAgICByZXR1cm4gY29lcmNlVG9EZWZhdWx0KG5hbWVPckZ1bmN0aW9uKGUsIGEsIHMsIHQsIHNhLCB0YSwgdSkpO1xuICAgIH07XG4gICAgZ2V0dGVyLmZyb21QYXJ0aWFsRW50cnkgPSBmdW5jdGlvbiAoZSwgYSwgcywgdCkge1xuICAgICAgcmV0dXJuIGNvZXJjZVRvRGVmYXVsdChuYW1lT3JGdW5jdGlvbihlLCBhLCBzLCB0KSk7XG4gICAgfTtcbiAgICBnZXR0ZXIuZnJvbU1pbmltYWxFbnRyeSA9IGZ1bmN0aW9uIChlLCBhKSB7XG4gICAgICByZXR1cm4gY29lcmNlVG9EZWZhdWx0KG5hbWVPckZ1bmN0aW9uKGUsIGEpKTtcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIGdldHRlci5mcm9tQXR0cmlidXRlcyA9IHJldHVybkRlZmF1bHQ7XG4gICAgZ2V0dGVyLmZyb21HcmFwaCA9IHJldHVybkRlZmF1bHQ7XG4gICAgZ2V0dGVyLmZyb21FbnRyeSA9IHJldHVybkRlZmF1bHQ7XG4gICAgZ2V0dGVyLmZyb21NaW5pbWFsRW50cnkgPSByZXR1cm5EZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIGdldHRlcjtcbn1cblxuZXhwb3J0cy5jcmVhdGVOb2RlVmFsdWVHZXR0ZXIgPSBjcmVhdGVOb2RlVmFsdWVHZXR0ZXI7XG5leHBvcnRzLmNyZWF0ZUVkZ2VWYWx1ZUdldHRlciA9IGNyZWF0ZUVkZ2VWYWx1ZUdldHRlcjtcbmV4cG9ydHMuY3JlYXRlRWRnZVdlaWdodEdldHRlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBjcmVhdGVFZGdlVmFsdWVHZXR0ZXIobmFtZSwgY29lcmNlV2VpZ2h0KTtcbn07XG4iLCIvKipcbiAqIEdyYXBob2xvZ3kgaXNHcmFwaFxuICogPT09PT09PT09PT09PT09PT09PVxuICpcbiAqIFZlcnkgc2ltcGxlIGZ1bmN0aW9uIGFpbWluZyBhdCBlbnN1cmluZyB0aGUgZ2l2ZW4gdmFyaWFibGUgaXMgYVxuICogZ3JhcGhvbG9neSBpbnN0YW5jZS5cbiAqL1xuXG4vKipcbiAqIENoZWNraW5nIHRoZSB2YWx1ZSBpcyBhIGdyYXBob2xvZ3kgaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtICB7YW55fSAgICAgdmFsdWUgLSBUYXJnZXQgdmFsdWUuXG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzR3JhcGgodmFsdWUpIHtcbiAgcmV0dXJuIChcbiAgICB2YWx1ZSAhPT0gbnVsbCAmJlxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICB0eXBlb2YgdmFsdWUuYWRkVW5kaXJlY3RlZEVkZ2VXaXRoS2V5ID09PSAnZnVuY3Rpb24nICYmXG4gICAgdHlwZW9mIHZhbHVlLmRyb3BOb2RlID09PSAnZnVuY3Rpb24nICYmXG4gICAgdHlwZW9mIHZhbHVlLm11bHRpID09PSAnYm9vbGVhbidcbiAgKTtcbn07XG4iLCIhZnVuY3Rpb24odCxlKXtcIm9iamVjdFwiPT10eXBlb2YgZXhwb3J0cyYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIG1vZHVsZT9tb2R1bGUuZXhwb3J0cz1lKCk6XCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kP2RlZmluZShlKToodD1cInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsVGhpcz9nbG9iYWxUaGlzOnR8fHNlbGYpLmdyYXBob2xvZ3k9ZSgpfSh0aGlzLChmdW5jdGlvbigpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHQoZSl7cmV0dXJuIHQ9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0sdChlKX1mdW5jdGlvbiBlKHQsZSl7dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlLnByb3RvdHlwZSksdC5wcm90b3R5cGUuY29uc3RydWN0b3I9dCxyKHQsZSl9ZnVuY3Rpb24gbih0KXtyZXR1cm4gbj1PYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LmdldFByb3RvdHlwZU9mOmZ1bmN0aW9uKHQpe3JldHVybiB0Ll9fcHJvdG9fX3x8T2JqZWN0LmdldFByb3RvdHlwZU9mKHQpfSxuKHQpfWZ1bmN0aW9uIHIodCxlKXtyZXR1cm4gcj1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuX19wcm90b19fPWUsdH0scih0LGUpfWZ1bmN0aW9uIGkoKXtpZihcInVuZGVmaW5lZFwiPT10eXBlb2YgUmVmbGVjdHx8IVJlZmxlY3QuY29uc3RydWN0KXJldHVybiExO2lmKFJlZmxlY3QuY29uc3RydWN0LnNoYW0pcmV0dXJuITE7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgUHJveHkpcmV0dXJuITA7dHJ5e3JldHVybiBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mLmNhbGwoUmVmbGVjdC5jb25zdHJ1Y3QoQm9vbGVhbixbXSwoZnVuY3Rpb24oKXt9KSkpLCEwfWNhdGNoKHQpe3JldHVybiExfX1mdW5jdGlvbiBvKHQsZSxuKXtyZXR1cm4gbz1pKCk/UmVmbGVjdC5jb25zdHJ1Y3Q6ZnVuY3Rpb24odCxlLG4pe3ZhciBpPVtudWxsXTtpLnB1c2guYXBwbHkoaSxlKTt2YXIgbz1uZXcoRnVuY3Rpb24uYmluZC5hcHBseSh0LGkpKTtyZXR1cm4gbiYmcihvLG4ucHJvdG90eXBlKSxvfSxvLmFwcGx5KG51bGwsYXJndW1lbnRzKX1mdW5jdGlvbiBhKHQpe3ZhciBlPVwiZnVuY3Rpb25cIj09dHlwZW9mIE1hcD9uZXcgTWFwOnZvaWQgMDtyZXR1cm4gYT1mdW5jdGlvbih0KXtpZihudWxsPT09dHx8KGk9dCwtMT09PUZ1bmN0aW9uLnRvU3RyaW5nLmNhbGwoaSkuaW5kZXhPZihcIltuYXRpdmUgY29kZV1cIikpKXJldHVybiB0O3ZhciBpO2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO2lmKHZvaWQgMCE9PWUpe2lmKGUuaGFzKHQpKXJldHVybiBlLmdldCh0KTtlLnNldCh0LGEpfWZ1bmN0aW9uIGEoKXtyZXR1cm4gbyh0LGFyZ3VtZW50cyxuKHRoaXMpLmNvbnN0cnVjdG9yKX1yZXR1cm4gYS5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZSh0LnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOmEsZW51bWVyYWJsZTohMSx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSkscihhLHQpfSxhKHQpfWZ1bmN0aW9uIHUodCl7aWYodm9pZCAwPT09dCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIHR9dmFyIGM9ZnVuY3Rpb24oKXtmb3IodmFyIHQ9YXJndW1lbnRzWzBdLGU9MSxuPWFyZ3VtZW50cy5sZW5ndGg7ZTxuO2UrKylpZihhcmd1bWVudHNbZV0pZm9yKHZhciByIGluIGFyZ3VtZW50c1tlXSl0W3JdPWFyZ3VtZW50c1tlXVtyXTtyZXR1cm4gdH07ZnVuY3Rpb24gcyh0LGUsbixyKXt2YXIgaT10Ll9ub2Rlcy5nZXQoZSksbz1udWxsO3JldHVybiBpP289XCJtaXhlZFwiPT09cj9pLm91dCYmaS5vdXRbbl18fGkudW5kaXJlY3RlZCYmaS51bmRpcmVjdGVkW25dOlwiZGlyZWN0ZWRcIj09PXI/aS5vdXQmJmkub3V0W25dOmkudW5kaXJlY3RlZCYmaS51bmRpcmVjdGVkW25dOm99ZnVuY3Rpb24gZChlKXtyZXR1cm4gbnVsbCE9PWUmJlwib2JqZWN0XCI9PT10KGUpJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLmFkZFVuZGlyZWN0ZWRFZGdlV2l0aEtleSYmXCJmdW5jdGlvblwiPT10eXBlb2YgZS5kcm9wTm9kZX1mdW5jdGlvbiBoKGUpe3JldHVyblwib2JqZWN0XCI9PT10KGUpJiZudWxsIT09ZSYmZS5jb25zdHJ1Y3Rvcj09PU9iamVjdH1mdW5jdGlvbiBwKHQpe3ZhciBlO2ZvcihlIGluIHQpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24gZih0LGUsbil7T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7ZW51bWVyYWJsZTohMSxjb25maWd1cmFibGU6ITEsd3JpdGFibGU6ITAsdmFsdWU6bn0pfWZ1bmN0aW9uIGwodCxlLG4pe3ZhciByPXtlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH07XCJmdW5jdGlvblwiPT10eXBlb2Ygbj9yLmdldD1uOihyLnZhbHVlPW4sci53cml0YWJsZT0hMSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSxyKX1mdW5jdGlvbiBnKHQpe3JldHVybiEhaCh0KSYmISh0LmF0dHJpYnV0ZXMmJiFBcnJheS5pc0FycmF5KHQuYXR0cmlidXRlcykpfVwiZnVuY3Rpb25cIj09dHlwZW9mIE9iamVjdC5hc3NpZ24mJihjPU9iamVjdC5hc3NpZ24pO3ZhciB5LHc9e2V4cG9ydHM6e319LHY9XCJvYmplY3RcIj09dHlwZW9mIFJlZmxlY3Q/UmVmbGVjdDpudWxsLGI9diYmXCJmdW5jdGlvblwiPT10eXBlb2Ygdi5hcHBseT92LmFwcGx5OmZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodCxlLG4pfTt5PXYmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHYub3duS2V5cz92Lm93bktleXM6T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scz9mdW5jdGlvbih0KXtyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModCkuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModCkpfTpmdW5jdGlvbih0KXtyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModCl9O3ZhciBtPU51bWJlci5pc05hTnx8ZnVuY3Rpb24odCl7cmV0dXJuIHQhPXR9O2Z1bmN0aW9uIGsoKXtrLmluaXQuY2FsbCh0aGlzKX13LmV4cG9ydHM9ayx3LmV4cG9ydHMub25jZT1mdW5jdGlvbih0LGUpe3JldHVybiBuZXcgUHJvbWlzZSgoZnVuY3Rpb24obixyKXtmdW5jdGlvbiBpKG4pe3QucmVtb3ZlTGlzdGVuZXIoZSxvKSxyKG4pfWZ1bmN0aW9uIG8oKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LnJlbW92ZUxpc3RlbmVyJiZ0LnJlbW92ZUxpc3RlbmVyKFwiZXJyb3JcIixpKSxuKFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKSl9Tih0LGUsbyx7b25jZTohMH0pLFwiZXJyb3JcIiE9PWUmJmZ1bmN0aW9uKHQsZSxuKXtcImZ1bmN0aW9uXCI9PXR5cGVvZiB0Lm9uJiZOKHQsXCJlcnJvclwiLGUsbil9KHQsaSx7b25jZTohMH0pfSkpfSxrLkV2ZW50RW1pdHRlcj1rLGsucHJvdG90eXBlLl9ldmVudHM9dm9pZCAwLGsucHJvdG90eXBlLl9ldmVudHNDb3VudD0wLGsucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnM9dm9pZCAwO3ZhciBfPTEwO2Z1bmN0aW9uIEcodCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdCl0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnK3R5cGVvZiB0KX1mdW5jdGlvbiB4KHQpe3JldHVybiB2b2lkIDA9PT10Ll9tYXhMaXN0ZW5lcnM/ay5kZWZhdWx0TWF4TGlzdGVuZXJzOnQuX21heExpc3RlbmVyc31mdW5jdGlvbiBFKHQsZSxuLHIpe3ZhciBpLG8sYSx1O2lmKEcobiksdm9pZCAwPT09KG89dC5fZXZlbnRzKT8obz10Ll9ldmVudHM9T2JqZWN0LmNyZWF0ZShudWxsKSx0Ll9ldmVudHNDb3VudD0wKToodm9pZCAwIT09by5uZXdMaXN0ZW5lciYmKHQuZW1pdChcIm5ld0xpc3RlbmVyXCIsZSxuLmxpc3RlbmVyP24ubGlzdGVuZXI6biksbz10Ll9ldmVudHMpLGE9b1tlXSksdm9pZCAwPT09YSlhPW9bZV09biwrK3QuX2V2ZW50c0NvdW50O2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgYT9hPW9bZV09cj9bbixhXTpbYSxuXTpyP2EudW5zaGlmdChuKTphLnB1c2gobiksKGk9eCh0KSk+MCYmYS5sZW5ndGg+aSYmIWEud2FybmVkKXthLndhcm5lZD0hMDt2YXIgYz1uZXcgRXJyb3IoXCJQb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5IGxlYWsgZGV0ZWN0ZWQuIFwiK2EubGVuZ3RoK1wiIFwiK1N0cmluZyhlKStcIiBsaXN0ZW5lcnMgYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0XCIpO2MubmFtZT1cIk1heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZ1wiLGMuZW1pdHRlcj10LGMudHlwZT1lLGMuY291bnQ9YS5sZW5ndGgsdT1jLGNvbnNvbGUmJmNvbnNvbGUud2FybiYmY29uc29sZS53YXJuKHUpfXJldHVybiB0fWZ1bmN0aW9uIEEoKXtpZighdGhpcy5maXJlZClyZXR1cm4gdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLHRoaXMud3JhcEZuKSx0aGlzLmZpcmVkPSEwLDA9PT1hcmd1bWVudHMubGVuZ3RoP3RoaXMubGlzdGVuZXIuY2FsbCh0aGlzLnRhcmdldCk6dGhpcy5saXN0ZW5lci5hcHBseSh0aGlzLnRhcmdldCxhcmd1bWVudHMpfWZ1bmN0aW9uIFModCxlLG4pe3ZhciByPXtmaXJlZDohMSx3cmFwRm46dm9pZCAwLHRhcmdldDp0LHR5cGU6ZSxsaXN0ZW5lcjpufSxpPUEuYmluZChyKTtyZXR1cm4gaS5saXN0ZW5lcj1uLHIud3JhcEZuPWksaX1mdW5jdGlvbiBEKHQsZSxuKXt2YXIgcj10Ll9ldmVudHM7aWYodm9pZCAwPT09cilyZXR1cm5bXTt2YXIgaT1yW2VdO3JldHVybiB2b2lkIDA9PT1pP1tdOlwiZnVuY3Rpb25cIj09dHlwZW9mIGk/bj9baS5saXN0ZW5lcnx8aV06W2ldOm4/ZnVuY3Rpb24odCl7Zm9yKHZhciBlPW5ldyBBcnJheSh0Lmxlbmd0aCksbj0wO248ZS5sZW5ndGg7KytuKWVbbl09dFtuXS5saXN0ZW5lcnx8dFtuXTtyZXR1cm4gZX0oaSk6VShpLGkubGVuZ3RoKX1mdW5jdGlvbiBMKHQpe3ZhciBlPXRoaXMuX2V2ZW50cztpZih2b2lkIDAhPT1lKXt2YXIgbj1lW3RdO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG4pcmV0dXJuIDE7aWYodm9pZCAwIT09bilyZXR1cm4gbi5sZW5ndGh9cmV0dXJuIDB9ZnVuY3Rpb24gVSh0LGUpe2Zvcih2YXIgbj1uZXcgQXJyYXkoZSkscj0wO3I8ZTsrK3IpbltyXT10W3JdO3JldHVybiBufWZ1bmN0aW9uIE4odCxlLG4scil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdC5vbilyLm9uY2U/dC5vbmNlKGUsbik6dC5vbihlLG4pO2Vsc2V7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdC5hZGRFdmVudExpc3RlbmVyKXRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImVtaXR0ZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRXZlbnRFbWl0dGVyLiBSZWNlaXZlZCB0eXBlICcrdHlwZW9mIHQpO3QuYWRkRXZlbnRMaXN0ZW5lcihlLChmdW5jdGlvbiBpKG8pe3Iub25jZSYmdC5yZW1vdmVFdmVudExpc3RlbmVyKGUsaSksbihvKX0pKX19ZnVuY3Rpb24gaih0KXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXRocm93IG5ldyBFcnJvcihcIm9ibGl0ZXJhdG9yL2l0ZXJhdG9yOiBleHBlY3RpbmcgYSBmdW5jdGlvbiFcIik7dGhpcy5uZXh0PXR9T2JqZWN0LmRlZmluZVByb3BlcnR5KGssXCJkZWZhdWx0TWF4TGlzdGVuZXJzXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIF99LHNldDpmdW5jdGlvbih0KXtpZihcIm51bWJlclwiIT10eXBlb2YgdHx8dDwwfHxtKHQpKXRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJkZWZhdWx0TWF4TGlzdGVuZXJzXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyt0K1wiLlwiKTtfPXR9fSksay5pbml0PWZ1bmN0aW9uKCl7dm9pZCAwIT09dGhpcy5fZXZlbnRzJiZ0aGlzLl9ldmVudHMhPT1PYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykuX2V2ZW50c3x8KHRoaXMuX2V2ZW50cz1PYmplY3QuY3JlYXRlKG51bGwpLHRoaXMuX2V2ZW50c0NvdW50PTApLHRoaXMuX21heExpc3RlbmVycz10aGlzLl9tYXhMaXN0ZW5lcnN8fHZvaWQgMH0say5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzPWZ1bmN0aW9uKHQpe2lmKFwibnVtYmVyXCIhPXR5cGVvZiB0fHx0PDB8fG0odCkpdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcIm5cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnK3QrXCIuXCIpO3JldHVybiB0aGlzLl9tYXhMaXN0ZW5lcnM9dCx0aGlzfSxrLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnM9ZnVuY3Rpb24oKXtyZXR1cm4geCh0aGlzKX0say5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbih0KXtmb3IodmFyIGU9W10sbj0xO248YXJndW1lbnRzLmxlbmd0aDtuKyspZS5wdXNoKGFyZ3VtZW50c1tuXSk7dmFyIHI9XCJlcnJvclwiPT09dCxpPXRoaXMuX2V2ZW50cztpZih2b2lkIDAhPT1pKXI9ciYmdm9pZCAwPT09aS5lcnJvcjtlbHNlIGlmKCFyKXJldHVybiExO2lmKHIpe3ZhciBvO2lmKGUubGVuZ3RoPjAmJihvPWVbMF0pLG8gaW5zdGFuY2VvZiBFcnJvcil0aHJvdyBvO3ZhciBhPW5ldyBFcnJvcihcIlVuaGFuZGxlZCBlcnJvci5cIisobz9cIiAoXCIrby5tZXNzYWdlK1wiKVwiOlwiXCIpKTt0aHJvdyBhLmNvbnRleHQ9byxhfXZhciB1PWlbdF07aWYodm9pZCAwPT09dSlyZXR1cm4hMTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiB1KWIodSx0aGlzLGUpO2Vsc2V7dmFyIGM9dS5sZW5ndGgscz1VKHUsYyk7Zm9yKG49MDtuPGM7KytuKWIoc1tuXSx0aGlzLGUpfXJldHVybiEwfSxrLnByb3RvdHlwZS5hZGRMaXN0ZW5lcj1mdW5jdGlvbih0LGUpe3JldHVybiBFKHRoaXMsdCxlLCExKX0say5wcm90b3R5cGUub249ay5wcm90b3R5cGUuYWRkTGlzdGVuZXIsay5wcm90b3R5cGUucHJlcGVuZExpc3RlbmVyPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIEUodGhpcyx0LGUsITApfSxrLnByb3RvdHlwZS5vbmNlPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIEcoZSksdGhpcy5vbih0LFModGhpcyx0LGUpKSx0aGlzfSxrLnByb3RvdHlwZS5wcmVwZW5kT25jZUxpc3RlbmVyPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIEcoZSksdGhpcy5wcmVwZW5kTGlzdGVuZXIodCxTKHRoaXMsdCxlKSksdGhpc30say5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI9ZnVuY3Rpb24odCxlKXt2YXIgbixyLGksbyxhO2lmKEcoZSksdm9pZCAwPT09KHI9dGhpcy5fZXZlbnRzKSlyZXR1cm4gdGhpcztpZih2b2lkIDA9PT0obj1yW3RdKSlyZXR1cm4gdGhpcztpZihuPT09ZXx8bi5saXN0ZW5lcj09PWUpMD09LS10aGlzLl9ldmVudHNDb3VudD90aGlzLl9ldmVudHM9T2JqZWN0LmNyZWF0ZShudWxsKTooZGVsZXRlIHJbdF0sci5yZW1vdmVMaXN0ZW5lciYmdGhpcy5lbWl0KFwicmVtb3ZlTGlzdGVuZXJcIix0LG4ubGlzdGVuZXJ8fGUpKTtlbHNlIGlmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIG4pe2ZvcihpPS0xLG89bi5sZW5ndGgtMTtvPj0wO28tLSlpZihuW29dPT09ZXx8bltvXS5saXN0ZW5lcj09PWUpe2E9bltvXS5saXN0ZW5lcixpPW87YnJlYWt9aWYoaTwwKXJldHVybiB0aGlzOzA9PT1pP24uc2hpZnQoKTpmdW5jdGlvbih0LGUpe2Zvcig7ZSsxPHQubGVuZ3RoO2UrKyl0W2VdPXRbZSsxXTt0LnBvcCgpfShuLGkpLDE9PT1uLmxlbmd0aCYmKHJbdF09blswXSksdm9pZCAwIT09ci5yZW1vdmVMaXN0ZW5lciYmdGhpcy5lbWl0KFwicmVtb3ZlTGlzdGVuZXJcIix0LGF8fGUpfXJldHVybiB0aGlzfSxrLnByb3RvdHlwZS5vZmY9ay5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIsay5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzPWZ1bmN0aW9uKHQpe3ZhciBlLG4scjtpZih2b2lkIDA9PT0obj10aGlzLl9ldmVudHMpKXJldHVybiB0aGlzO2lmKHZvaWQgMD09PW4ucmVtb3ZlTGlzdGVuZXIpcmV0dXJuIDA9PT1hcmd1bWVudHMubGVuZ3RoPyh0aGlzLl9ldmVudHM9T2JqZWN0LmNyZWF0ZShudWxsKSx0aGlzLl9ldmVudHNDb3VudD0wKTp2b2lkIDAhPT1uW3RdJiYoMD09LS10aGlzLl9ldmVudHNDb3VudD90aGlzLl9ldmVudHM9T2JqZWN0LmNyZWF0ZShudWxsKTpkZWxldGUgblt0XSksdGhpcztpZigwPT09YXJndW1lbnRzLmxlbmd0aCl7dmFyIGksbz1PYmplY3Qua2V5cyhuKTtmb3Iocj0wO3I8by5sZW5ndGg7KytyKVwicmVtb3ZlTGlzdGVuZXJcIiE9PShpPW9bcl0pJiZ0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhpKTtyZXR1cm4gdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoXCJyZW1vdmVMaXN0ZW5lclwiKSx0aGlzLl9ldmVudHM9T2JqZWN0LmNyZWF0ZShudWxsKSx0aGlzLl9ldmVudHNDb3VudD0wLHRoaXN9aWYoXCJmdW5jdGlvblwiPT10eXBlb2YoZT1uW3RdKSl0aGlzLnJlbW92ZUxpc3RlbmVyKHQsZSk7ZWxzZSBpZih2b2lkIDAhPT1lKWZvcihyPWUubGVuZ3RoLTE7cj49MDtyLS0pdGhpcy5yZW1vdmVMaXN0ZW5lcih0LGVbcl0pO3JldHVybiB0aGlzfSxrLnByb3RvdHlwZS5saXN0ZW5lcnM9ZnVuY3Rpb24odCl7cmV0dXJuIEQodGhpcyx0LCEwKX0say5wcm90b3R5cGUucmF3TGlzdGVuZXJzPWZ1bmN0aW9uKHQpe3JldHVybiBEKHRoaXMsdCwhMSl9LGsubGlzdGVuZXJDb3VudD1mdW5jdGlvbih0LGUpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHQubGlzdGVuZXJDb3VudD90Lmxpc3RlbmVyQ291bnQoZSk6TC5jYWxsKHQsZSl9LGsucHJvdG90eXBlLmxpc3RlbmVyQ291bnQ9TCxrLnByb3RvdHlwZS5ldmVudE5hbWVzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50PjA/eSh0aGlzLl9ldmVudHMpOltdfSxcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiYoai5wcm90b3R5cGVbU3ltYm9sLml0ZXJhdG9yXT1mdW5jdGlvbigpe3JldHVybiB0aGlzfSksai5vZj1mdW5jdGlvbigpe3ZhciB0PWFyZ3VtZW50cyxlPXQubGVuZ3RoLG49MDtyZXR1cm4gbmV3IGooKGZ1bmN0aW9uKCl7cmV0dXJuIG4+PWU/e2RvbmU6ITB9Ontkb25lOiExLHZhbHVlOnRbbisrXX19KSl9LGouZW1wdHk9ZnVuY3Rpb24oKXtyZXR1cm4gbmV3IGooKGZ1bmN0aW9uKCl7cmV0dXJue2RvbmU6ITB9fSkpfSxqLmZyb21TZXF1ZW5jZT1mdW5jdGlvbih0KXt2YXIgZT0wLG49dC5sZW5ndGg7cmV0dXJuIG5ldyBqKChmdW5jdGlvbigpe3JldHVybiBlPj1uP3tkb25lOiEwfTp7ZG9uZTohMSx2YWx1ZTp0W2UrK119fSkpfSxqLmlzPWZ1bmN0aW9uKHQpe3JldHVybiB0IGluc3RhbmNlb2Yganx8XCJvYmplY3RcIj09dHlwZW9mIHQmJm51bGwhPT10JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0Lm5leHR9O3ZhciBPPWosQz17fTtDLkFSUkFZX0JVRkZFUl9TVVBQT1JUPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBBcnJheUJ1ZmZlcixDLlNZTUJPTF9TVVBQT1JUPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2w7dmFyIHo9TyxNPUMsVz1NLkFSUkFZX0JVRkZFUl9TVVBQT1JULFA9TS5TWU1CT0xfU1VQUE9SVDt2YXIgUj1mdW5jdGlvbih0KXt2YXIgZT1mdW5jdGlvbih0KXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdHx8QXJyYXkuaXNBcnJheSh0KXx8VyYmQXJyYXlCdWZmZXIuaXNWaWV3KHQpP3ouZnJvbVNlcXVlbmNlKHQpOlwib2JqZWN0XCIhPXR5cGVvZiB0fHxudWxsPT09dD9udWxsOlAmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHRbU3ltYm9sLml0ZXJhdG9yXT90W1N5bWJvbC5pdGVyYXRvcl0oKTpcImZ1bmN0aW9uXCI9PXR5cGVvZiB0Lm5leHQ/dDpudWxsfSh0KTtpZighZSl0aHJvdyBuZXcgRXJyb3IoXCJvYmxpdGVyYXRvcjogdGFyZ2V0IGlzIG5vdCBpdGVyYWJsZSBub3IgYSB2YWxpZCBpdGVyYXRvci5cIik7cmV0dXJuIGV9LEs9UixUPWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBuLHI9YXJndW1lbnRzLmxlbmd0aD4xP2U6MS8wLGk9ciE9PTEvMD9uZXcgQXJyYXkocik6W10sbz0wLGE9Syh0KTs7KXtpZihvPT09cilyZXR1cm4gaTtpZigobj1hLm5leHQoKSkuZG9uZSlyZXR1cm4gbyE9PWUmJihpLmxlbmd0aD1vKSxpO2lbbysrXT1uLnZhbHVlfX0sQj1mdW5jdGlvbih0KXtmdW5jdGlvbiBuKGUpe3ZhciBuO3JldHVybihuPXQuY2FsbCh0aGlzKXx8dGhpcykubmFtZT1cIkdyYXBoRXJyb3JcIixuLm1lc3NhZ2U9ZSxufXJldHVybiBlKG4sdCksbn0oYShFcnJvcikpLEY9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gbihlKXt2YXIgcjtyZXR1cm4ocj10LmNhbGwodGhpcyxlKXx8dGhpcykubmFtZT1cIkludmFsaWRBcmd1bWVudHNHcmFwaEVycm9yXCIsXCJmdW5jdGlvblwiPT10eXBlb2YgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UmJkVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHUociksbi5wcm90b3R5cGUuY29uc3RydWN0b3IpLHJ9cmV0dXJuIGUobix0KSxufShCKSxJPWZ1bmN0aW9uKHQpe2Z1bmN0aW9uIG4oZSl7dmFyIHI7cmV0dXJuKHI9dC5jYWxsKHRoaXMsZSl8fHRoaXMpLm5hbWU9XCJOb3RGb3VuZEdyYXBoRXJyb3JcIixcImZ1bmN0aW9uXCI9PXR5cGVvZiBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSYmRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodShyKSxuLnByb3RvdHlwZS5jb25zdHJ1Y3Rvcikscn1yZXR1cm4gZShuLHQpLG59KEIpLFk9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gbihlKXt2YXIgcjtyZXR1cm4ocj10LmNhbGwodGhpcyxlKXx8dGhpcykubmFtZT1cIlVzYWdlR3JhcGhFcnJvclwiLFwiZnVuY3Rpb25cIj09dHlwZW9mIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlJiZFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh1KHIpLG4ucHJvdG90eXBlLmNvbnN0cnVjdG9yKSxyfXJldHVybiBlKG4sdCksbn0oQik7ZnVuY3Rpb24gcSh0LGUpe3RoaXMua2V5PXQsdGhpcy5hdHRyaWJ1dGVzPWUsdGhpcy5jbGVhcigpfWZ1bmN0aW9uIEoodCxlKXt0aGlzLmtleT10LHRoaXMuYXR0cmlidXRlcz1lLHRoaXMuY2xlYXIoKX1mdW5jdGlvbiBWKHQsZSl7dGhpcy5rZXk9dCx0aGlzLmF0dHJpYnV0ZXM9ZSx0aGlzLmNsZWFyKCl9ZnVuY3Rpb24gSCh0LGUsbixyLGkpe3RoaXMua2V5PWUsdGhpcy5hdHRyaWJ1dGVzPWksdGhpcy51bmRpcmVjdGVkPXQsdGhpcy5zb3VyY2U9bix0aGlzLnRhcmdldD1yfXEucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5pbkRlZ3JlZT0wLHRoaXMub3V0RGVncmVlPTAsdGhpcy51bmRpcmVjdGVkRGVncmVlPTAsdGhpcy5pbj17fSx0aGlzLm91dD17fSx0aGlzLnVuZGlyZWN0ZWQ9e319LEoucHJvdG90eXBlLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5pbkRlZ3JlZT0wLHRoaXMub3V0RGVncmVlPTAsdGhpcy5pbj17fSx0aGlzLm91dD17fX0sVi5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt0aGlzLnVuZGlyZWN0ZWREZWdyZWU9MCx0aGlzLnVuZGlyZWN0ZWQ9e319LEgucHJvdG90eXBlLmF0dGFjaD1mdW5jdGlvbigpe3ZhciB0PVwib3V0XCIsZT1cImluXCI7dGhpcy51bmRpcmVjdGVkJiYodD1lPVwidW5kaXJlY3RlZFwiKTt2YXIgbj10aGlzLnNvdXJjZS5rZXkscj10aGlzLnRhcmdldC5rZXk7dGhpcy5zb3VyY2VbdF1bcl09dGhpcyx0aGlzLnVuZGlyZWN0ZWQmJm49PT1yfHwodGhpcy50YXJnZXRbZV1bbl09dGhpcyl9LEgucHJvdG90eXBlLmF0dGFjaE11bHRpPWZ1bmN0aW9uKCl7dmFyIHQ9XCJvdXRcIixlPVwiaW5cIixuPXRoaXMuc291cmNlLmtleSxyPXRoaXMudGFyZ2V0LmtleTt0aGlzLnVuZGlyZWN0ZWQmJih0PWU9XCJ1bmRpcmVjdGVkXCIpO3ZhciBpPXRoaXMuc291cmNlW3RdLG89aVtyXTtpZih2b2lkIDA9PT1vKXJldHVybiBpW3JdPXRoaXMsdm9pZCh0aGlzLnVuZGlyZWN0ZWQmJm49PT1yfHwodGhpcy50YXJnZXRbZV1bbl09dGhpcykpO28ucHJldmlvdXM9dGhpcyx0aGlzLm5leHQ9byxpW3JdPXRoaXMsdGhpcy50YXJnZXRbZV1bbl09dGhpc30sSC5wcm90b3R5cGUuZGV0YWNoPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5zb3VyY2Uua2V5LGU9dGhpcy50YXJnZXQua2V5LG49XCJvdXRcIixyPVwiaW5cIjt0aGlzLnVuZGlyZWN0ZWQmJihuPXI9XCJ1bmRpcmVjdGVkXCIpLGRlbGV0ZSB0aGlzLnNvdXJjZVtuXVtlXSxkZWxldGUgdGhpcy50YXJnZXRbcl1bdF19LEgucHJvdG90eXBlLmRldGFjaE11bHRpPWZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5zb3VyY2Uua2V5LGU9dGhpcy50YXJnZXQua2V5LG49XCJvdXRcIixyPVwiaW5cIjt0aGlzLnVuZGlyZWN0ZWQmJihuPXI9XCJ1bmRpcmVjdGVkXCIpLHZvaWQgMD09PXRoaXMucHJldmlvdXM/dm9pZCAwPT09dGhpcy5uZXh0PyhkZWxldGUgdGhpcy5zb3VyY2Vbbl1bZV0sZGVsZXRlIHRoaXMudGFyZ2V0W3JdW3RdKToodGhpcy5uZXh0LnByZXZpb3VzPXZvaWQgMCx0aGlzLnNvdXJjZVtuXVtlXT10aGlzLm5leHQsdGhpcy50YXJnZXRbcl1bdF09dGhpcy5uZXh0KToodGhpcy5wcmV2aW91cy5uZXh0PXRoaXMubmV4dCx2b2lkIDAhPT10aGlzLm5leHQmJih0aGlzLm5leHQucHJldmlvdXM9dGhpcy5wcmV2aW91cykpfTtmdW5jdGlvbiBRKHQsZSxuLHIsaSxvLGEpe3ZhciB1LGMscyxkO2lmKHI9XCJcIityLDA9PT1uKXtpZighKHU9dC5fbm9kZXMuZ2V0KHIpKSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdChyLCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7cz1pLGQ9b31lbHNlIGlmKDM9PT1uKXtpZihpPVwiXCIraSwhKGM9dC5fZWRnZXMuZ2V0KGkpKSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdChpLCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSk7dmFyIGg9Yy5zb3VyY2Uua2V5LHA9Yy50YXJnZXQua2V5O2lmKHI9PT1oKXU9Yy50YXJnZXQ7ZWxzZXtpZihyIT09cCl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IHRoZSBcIicpLmNvbmNhdChyLCdcIiBub2RlIGlzIG5vdCBhdHRhY2hlZCB0byB0aGUgXCInKS5jb25jYXQoaSwnXCIgZWRnZSAoJykuY29uY2F0KGgsXCIsIFwiKS5jb25jYXQocCxcIikuXCIpKTt1PWMuc291cmNlfXM9byxkPWF9ZWxzZXtpZighKGM9dC5fZWRnZXMuZ2V0KHIpKSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdChyLCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSk7dT0xPT09bj9jLnNvdXJjZTpjLnRhcmdldCxzPWksZD1vfXJldHVyblt1LHMsZF19dmFyIFg9W3tuYW1lOmZ1bmN0aW9uKHQpe3JldHVyblwiZ2V0XCIuY29uY2F0KHQsXCJBdHRyaWJ1dGVcIil9LGF0dGFjaGVyOmZ1bmN0aW9uKHQsZSxuKXt0LnByb3RvdHlwZVtlXT1mdW5jdGlvbih0LHIsaSl7dmFyIG89USh0aGlzLGUsbix0LHIsaSksYT1vWzBdLHU9b1sxXTtyZXR1cm4gYS5hdHRyaWJ1dGVzW3VdfX19LHtuYW1lOmZ1bmN0aW9uKHQpe3JldHVyblwiZ2V0XCIuY29uY2F0KHQsXCJBdHRyaWJ1dGVzXCIpfSxhdHRhY2hlcjpmdW5jdGlvbih0LGUsbil7dC5wcm90b3R5cGVbZV09ZnVuY3Rpb24odCxyKXtyZXR1cm4gUSh0aGlzLGUsbix0LHIpWzBdLmF0dHJpYnV0ZXN9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJoYXNcIi5jb25jYXQodCxcIkF0dHJpYnV0ZVwiKX0sYXR0YWNoZXI6ZnVuY3Rpb24odCxlLG4pe3QucHJvdG90eXBlW2VdPWZ1bmN0aW9uKHQscixpKXt2YXIgbz1RKHRoaXMsZSxuLHQscixpKSxhPW9bMF0sdT1vWzFdO3JldHVybiBhLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkodSl9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJzZXRcIi5jb25jYXQodCxcIkF0dHJpYnV0ZVwiKX0sYXR0YWNoZXI6ZnVuY3Rpb24odCxlLG4pe3QucHJvdG90eXBlW2VdPWZ1bmN0aW9uKHQscixpLG8pe3ZhciBhPVEodGhpcyxlLG4sdCxyLGksbyksdT1hWzBdLGM9YVsxXSxzPWFbMl07cmV0dXJuIHUuYXR0cmlidXRlc1tjXT1zLHRoaXMuZW1pdChcIm5vZGVBdHRyaWJ1dGVzVXBkYXRlZFwiLHtrZXk6dS5rZXksdHlwZTpcInNldFwiLGF0dHJpYnV0ZXM6dS5hdHRyaWJ1dGVzLG5hbWU6Y30pLHRoaXN9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJ1cGRhdGVcIi5jb25jYXQodCxcIkF0dHJpYnV0ZVwiKX0sYXR0YWNoZXI6ZnVuY3Rpb24odCxlLG4pe3QucHJvdG90eXBlW2VdPWZ1bmN0aW9uKHQscixpLG8pe3ZhciBhPVEodGhpcyxlLG4sdCxyLGksbyksdT1hWzBdLGM9YVsxXSxzPWFbMl07aWYoXCJmdW5jdGlvblwiIT10eXBlb2Ygcyl0aHJvdyBuZXcgRihcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiB1cGRhdGVyIHNob3VsZCBiZSBhIGZ1bmN0aW9uLlwiKSk7dmFyIGQ9dS5hdHRyaWJ1dGVzLGg9cyhkW2NdKTtyZXR1cm4gZFtjXT1oLHRoaXMuZW1pdChcIm5vZGVBdHRyaWJ1dGVzVXBkYXRlZFwiLHtrZXk6dS5rZXksdHlwZTpcInNldFwiLGF0dHJpYnV0ZXM6dS5hdHRyaWJ1dGVzLG5hbWU6Y30pLHRoaXN9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJyZW1vdmVcIi5jb25jYXQodCxcIkF0dHJpYnV0ZVwiKX0sYXR0YWNoZXI6ZnVuY3Rpb24odCxlLG4pe3QucHJvdG90eXBlW2VdPWZ1bmN0aW9uKHQscixpKXt2YXIgbz1RKHRoaXMsZSxuLHQscixpKSxhPW9bMF0sdT1vWzFdO3JldHVybiBkZWxldGUgYS5hdHRyaWJ1dGVzW3VdLHRoaXMuZW1pdChcIm5vZGVBdHRyaWJ1dGVzVXBkYXRlZFwiLHtrZXk6YS5rZXksdHlwZTpcInJlbW92ZVwiLGF0dHJpYnV0ZXM6YS5hdHRyaWJ1dGVzLG5hbWU6dX0pLHRoaXN9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJyZXBsYWNlXCIuY29uY2F0KHQsXCJBdHRyaWJ1dGVzXCIpfSxhdHRhY2hlcjpmdW5jdGlvbih0LGUsbil7dC5wcm90b3R5cGVbZV09ZnVuY3Rpb24odCxyLGkpe3ZhciBvPVEodGhpcyxlLG4sdCxyLGkpLGE9b1swXSx1PW9bMV07aWYoIWgodSkpdGhyb3cgbmV3IEYoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogcHJvdmlkZWQgYXR0cmlidXRlcyBhcmUgbm90IGEgcGxhaW4gb2JqZWN0LlwiKSk7cmV0dXJuIGEuYXR0cmlidXRlcz11LHRoaXMuZW1pdChcIm5vZGVBdHRyaWJ1dGVzVXBkYXRlZFwiLHtrZXk6YS5rZXksdHlwZTpcInJlcGxhY2VcIixhdHRyaWJ1dGVzOmEuYXR0cmlidXRlc30pLHRoaXN9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJtZXJnZVwiLmNvbmNhdCh0LFwiQXR0cmlidXRlc1wiKX0sYXR0YWNoZXI6ZnVuY3Rpb24odCxlLG4pe3QucHJvdG90eXBlW2VdPWZ1bmN0aW9uKHQscixpKXt2YXIgbz1RKHRoaXMsZSxuLHQscixpKSxhPW9bMF0sdT1vWzFdO2lmKCFoKHUpKXRocm93IG5ldyBGKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IHByb3ZpZGVkIGF0dHJpYnV0ZXMgYXJlIG5vdCBhIHBsYWluIG9iamVjdC5cIikpO3JldHVybiBjKGEuYXR0cmlidXRlcyx1KSx0aGlzLmVtaXQoXCJub2RlQXR0cmlidXRlc1VwZGF0ZWRcIix7a2V5OmEua2V5LHR5cGU6XCJtZXJnZVwiLGF0dHJpYnV0ZXM6YS5hdHRyaWJ1dGVzLGRhdGE6dX0pLHRoaXN9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJ1cGRhdGVcIi5jb25jYXQodCxcIkF0dHJpYnV0ZXNcIil9LGF0dGFjaGVyOmZ1bmN0aW9uKHQsZSxuKXt0LnByb3RvdHlwZVtlXT1mdW5jdGlvbih0LHIsaSl7dmFyIG89USh0aGlzLGUsbix0LHIsaSksYT1vWzBdLHU9b1sxXTtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB1KXRocm93IG5ldyBGKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IHByb3ZpZGVkIHVwZGF0ZXIgaXMgbm90IGEgZnVuY3Rpb24uXCIpKTtyZXR1cm4gYS5hdHRyaWJ1dGVzPXUoYS5hdHRyaWJ1dGVzKSx0aGlzLmVtaXQoXCJub2RlQXR0cmlidXRlc1VwZGF0ZWRcIix7a2V5OmEua2V5LHR5cGU6XCJ1cGRhdGVcIixhdHRyaWJ1dGVzOmEuYXR0cmlidXRlc30pLHRoaXN9fX1dO3ZhciBaPVt7bmFtZTpmdW5jdGlvbih0KXtyZXR1cm5cImdldFwiLmNvbmNhdCh0LFwiQXR0cmlidXRlXCIpfSxhdHRhY2hlcjpmdW5jdGlvbih0LGUsbil7dC5wcm90b3R5cGVbZV09ZnVuY3Rpb24odCxyKXt2YXIgaTtpZihcIm1peGVkXCIhPT10aGlzLnR5cGUmJlwibWl4ZWRcIiE9PW4mJm4hPT10aGlzLnR5cGUpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IGZpbmQgdGhpcyB0eXBlIG9mIGVkZ2VzIGluIHlvdXIgXCIpLmNvbmNhdCh0aGlzLnR5cGUsXCIgZ3JhcGguXCIpKTtpZihhcmd1bWVudHMubGVuZ3RoPjIpe2lmKHRoaXMubXVsdGkpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IHVzZSBhIHtzb3VyY2UsdGFyZ2V0fSBjb21ibyB3aGVuIGFza2luZyBhYm91dCBhbiBlZGdlJ3MgYXR0cmlidXRlcyBpbiBhIE11bHRpR3JhcGggc2luY2Ugd2UgY2Fubm90IGluZmVyIHRoZSBvbmUgeW91IHdhbnQgaW5mb3JtYXRpb24gYWJvdXQuXCIpKTt2YXIgbz1cIlwiK3QsYT1cIlwiK3I7aWYocj1hcmd1bWVudHNbMl0sIShpPXModGhpcyxvLGEsbikpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KGUsJzogY291bGQgbm90IGZpbmQgYW4gZWRnZSBmb3IgdGhlIGdpdmVuIHBhdGggKFwiJykuY29uY2F0KG8sJ1wiIC0gXCInKS5jb25jYXQoYSwnXCIpLicpKX1lbHNle2lmKFwibWl4ZWRcIiE9PW4pdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2FsbGluZyB0aGlzIG1ldGhvZCB3aXRoIG9ubHkgYSBrZXkgKHZzLiBhIHNvdXJjZSBhbmQgdGFyZ2V0KSBkb2VzIG5vdCBtYWtlIHNlbnNlIHNpbmNlIGFuIGVkZ2Ugd2l0aCB0aGlzIGtleSBjb3VsZCBoYXZlIHRoZSBvdGhlciB0eXBlLlwiKSk7aWYodD1cIlwiK3QsIShpPXRoaXMuX2VkZ2VzLmdldCh0KSkpdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBjb3VsZCBub3QgZmluZCB0aGUgXCInKS5jb25jYXQodCwnXCIgZWRnZSBpbiB0aGUgZ3JhcGguJykpfXJldHVybiBpLmF0dHJpYnV0ZXNbcl19fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJnZXRcIi5jb25jYXQodCxcIkF0dHJpYnV0ZXNcIil9LGF0dGFjaGVyOmZ1bmN0aW9uKHQsZSxuKXt0LnByb3RvdHlwZVtlXT1mdW5jdGlvbih0KXt2YXIgcjtpZihcIm1peGVkXCIhPT10aGlzLnR5cGUmJlwibWl4ZWRcIiE9PW4mJm4hPT10aGlzLnR5cGUpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IGZpbmQgdGhpcyB0eXBlIG9mIGVkZ2VzIGluIHlvdXIgXCIpLmNvbmNhdCh0aGlzLnR5cGUsXCIgZ3JhcGguXCIpKTtpZihhcmd1bWVudHMubGVuZ3RoPjEpe2lmKHRoaXMubXVsdGkpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IHVzZSBhIHtzb3VyY2UsdGFyZ2V0fSBjb21ibyB3aGVuIGFza2luZyBhYm91dCBhbiBlZGdlJ3MgYXR0cmlidXRlcyBpbiBhIE11bHRpR3JhcGggc2luY2Ugd2UgY2Fubm90IGluZmVyIHRoZSBvbmUgeW91IHdhbnQgaW5mb3JtYXRpb24gYWJvdXQuXCIpKTt2YXIgaT1cIlwiK3Qsbz1cIlwiK2FyZ3VtZW50c1sxXTtpZighKHI9cyh0aGlzLGksbyxuKSkpdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBjb3VsZCBub3QgZmluZCBhbiBlZGdlIGZvciB0aGUgZ2l2ZW4gcGF0aCAoXCInKS5jb25jYXQoaSwnXCIgLSBcIicpLmNvbmNhdChvLCdcIikuJykpfWVsc2V7aWYoXCJtaXhlZFwiIT09bil0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiBjYWxsaW5nIHRoaXMgbWV0aG9kIHdpdGggb25seSBhIGtleSAodnMuIGEgc291cmNlIGFuZCB0YXJnZXQpIGRvZXMgbm90IG1ha2Ugc2Vuc2Ugc2luY2UgYW4gZWRnZSB3aXRoIHRoaXMga2V5IGNvdWxkIGhhdmUgdGhlIG90aGVyIHR5cGUuXCIpKTtpZih0PVwiXCIrdCwhKHI9dGhpcy5fZWRnZXMuZ2V0KHQpKSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdCh0LCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSl9cmV0dXJuIHIuYXR0cmlidXRlc319fSx7bmFtZTpmdW5jdGlvbih0KXtyZXR1cm5cImhhc1wiLmNvbmNhdCh0LFwiQXR0cmlidXRlXCIpfSxhdHRhY2hlcjpmdW5jdGlvbih0LGUsbil7dC5wcm90b3R5cGVbZV09ZnVuY3Rpb24odCxyKXt2YXIgaTtpZihcIm1peGVkXCIhPT10aGlzLnR5cGUmJlwibWl4ZWRcIiE9PW4mJm4hPT10aGlzLnR5cGUpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IGZpbmQgdGhpcyB0eXBlIG9mIGVkZ2VzIGluIHlvdXIgXCIpLmNvbmNhdCh0aGlzLnR5cGUsXCIgZ3JhcGguXCIpKTtpZihhcmd1bWVudHMubGVuZ3RoPjIpe2lmKHRoaXMubXVsdGkpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IHVzZSBhIHtzb3VyY2UsdGFyZ2V0fSBjb21ibyB3aGVuIGFza2luZyBhYm91dCBhbiBlZGdlJ3MgYXR0cmlidXRlcyBpbiBhIE11bHRpR3JhcGggc2luY2Ugd2UgY2Fubm90IGluZmVyIHRoZSBvbmUgeW91IHdhbnQgaW5mb3JtYXRpb24gYWJvdXQuXCIpKTt2YXIgbz1cIlwiK3QsYT1cIlwiK3I7aWYocj1hcmd1bWVudHNbMl0sIShpPXModGhpcyxvLGEsbikpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KGUsJzogY291bGQgbm90IGZpbmQgYW4gZWRnZSBmb3IgdGhlIGdpdmVuIHBhdGggKFwiJykuY29uY2F0KG8sJ1wiIC0gXCInKS5jb25jYXQoYSwnXCIpLicpKX1lbHNle2lmKFwibWl4ZWRcIiE9PW4pdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2FsbGluZyB0aGlzIG1ldGhvZCB3aXRoIG9ubHkgYSBrZXkgKHZzLiBhIHNvdXJjZSBhbmQgdGFyZ2V0KSBkb2VzIG5vdCBtYWtlIHNlbnNlIHNpbmNlIGFuIGVkZ2Ugd2l0aCB0aGlzIGtleSBjb3VsZCBoYXZlIHRoZSBvdGhlciB0eXBlLlwiKSk7aWYodD1cIlwiK3QsIShpPXRoaXMuX2VkZ2VzLmdldCh0KSkpdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBjb3VsZCBub3QgZmluZCB0aGUgXCInKS5jb25jYXQodCwnXCIgZWRnZSBpbiB0aGUgZ3JhcGguJykpfXJldHVybiBpLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkocil9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJzZXRcIi5jb25jYXQodCxcIkF0dHJpYnV0ZVwiKX0sYXR0YWNoZXI6ZnVuY3Rpb24odCxlLG4pe3QucHJvdG90eXBlW2VdPWZ1bmN0aW9uKHQscixpKXt2YXIgbztpZihcIm1peGVkXCIhPT10aGlzLnR5cGUmJlwibWl4ZWRcIiE9PW4mJm4hPT10aGlzLnR5cGUpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IGZpbmQgdGhpcyB0eXBlIG9mIGVkZ2VzIGluIHlvdXIgXCIpLmNvbmNhdCh0aGlzLnR5cGUsXCIgZ3JhcGguXCIpKTtpZihhcmd1bWVudHMubGVuZ3RoPjMpe2lmKHRoaXMubXVsdGkpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IHVzZSBhIHtzb3VyY2UsdGFyZ2V0fSBjb21ibyB3aGVuIGFza2luZyBhYm91dCBhbiBlZGdlJ3MgYXR0cmlidXRlcyBpbiBhIE11bHRpR3JhcGggc2luY2Ugd2UgY2Fubm90IGluZmVyIHRoZSBvbmUgeW91IHdhbnQgaW5mb3JtYXRpb24gYWJvdXQuXCIpKTt2YXIgYT1cIlwiK3QsdT1cIlwiK3I7aWYocj1hcmd1bWVudHNbMl0saT1hcmd1bWVudHNbM10sIShvPXModGhpcyxhLHUsbikpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KGUsJzogY291bGQgbm90IGZpbmQgYW4gZWRnZSBmb3IgdGhlIGdpdmVuIHBhdGggKFwiJykuY29uY2F0KGEsJ1wiIC0gXCInKS5jb25jYXQodSwnXCIpLicpKX1lbHNle2lmKFwibWl4ZWRcIiE9PW4pdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2FsbGluZyB0aGlzIG1ldGhvZCB3aXRoIG9ubHkgYSBrZXkgKHZzLiBhIHNvdXJjZSBhbmQgdGFyZ2V0KSBkb2VzIG5vdCBtYWtlIHNlbnNlIHNpbmNlIGFuIGVkZ2Ugd2l0aCB0aGlzIGtleSBjb3VsZCBoYXZlIHRoZSBvdGhlciB0eXBlLlwiKSk7aWYodD1cIlwiK3QsIShvPXRoaXMuX2VkZ2VzLmdldCh0KSkpdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBjb3VsZCBub3QgZmluZCB0aGUgXCInKS5jb25jYXQodCwnXCIgZWRnZSBpbiB0aGUgZ3JhcGguJykpfXJldHVybiBvLmF0dHJpYnV0ZXNbcl09aSx0aGlzLmVtaXQoXCJlZGdlQXR0cmlidXRlc1VwZGF0ZWRcIix7a2V5Om8ua2V5LHR5cGU6XCJzZXRcIixhdHRyaWJ1dGVzOm8uYXR0cmlidXRlcyxuYW1lOnJ9KSx0aGlzfX19LHtuYW1lOmZ1bmN0aW9uKHQpe3JldHVyblwidXBkYXRlXCIuY29uY2F0KHQsXCJBdHRyaWJ1dGVcIil9LGF0dGFjaGVyOmZ1bmN0aW9uKHQsZSxuKXt0LnByb3RvdHlwZVtlXT1mdW5jdGlvbih0LHIsaSl7dmFyIG87aWYoXCJtaXhlZFwiIT09dGhpcy50eXBlJiZcIm1peGVkXCIhPT1uJiZuIT09dGhpcy50eXBlKXRocm93IG5ldyBZKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IGNhbm5vdCBmaW5kIHRoaXMgdHlwZSBvZiBlZGdlcyBpbiB5b3VyIFwiKS5jb25jYXQodGhpcy50eXBlLFwiIGdyYXBoLlwiKSk7aWYoYXJndW1lbnRzLmxlbmd0aD4zKXtpZih0aGlzLm11bHRpKXRocm93IG5ldyBZKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IGNhbm5vdCB1c2UgYSB7c291cmNlLHRhcmdldH0gY29tYm8gd2hlbiBhc2tpbmcgYWJvdXQgYW4gZWRnZSdzIGF0dHJpYnV0ZXMgaW4gYSBNdWx0aUdyYXBoIHNpbmNlIHdlIGNhbm5vdCBpbmZlciB0aGUgb25lIHlvdSB3YW50IGluZm9ybWF0aW9uIGFib3V0LlwiKSk7dmFyIGE9XCJcIit0LHU9XCJcIityO2lmKHI9YXJndW1lbnRzWzJdLGk9YXJndW1lbnRzWzNdLCEobz1zKHRoaXMsYSx1LG4pKSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGNvdWxkIG5vdCBmaW5kIGFuIGVkZ2UgZm9yIHRoZSBnaXZlbiBwYXRoIChcIicpLmNvbmNhdChhLCdcIiAtIFwiJykuY29uY2F0KHUsJ1wiKS4nKSl9ZWxzZXtpZihcIm1peGVkXCIhPT1uKXRocm93IG5ldyBZKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IGNhbGxpbmcgdGhpcyBtZXRob2Qgd2l0aCBvbmx5IGEga2V5ICh2cy4gYSBzb3VyY2UgYW5kIHRhcmdldCkgZG9lcyBub3QgbWFrZSBzZW5zZSBzaW5jZSBhbiBlZGdlIHdpdGggdGhpcyBrZXkgY291bGQgaGF2ZSB0aGUgb3RoZXIgdHlwZS5cIikpO2lmKHQ9XCJcIit0LCEobz10aGlzLl9lZGdlcy5nZXQodCkpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KGUsJzogY291bGQgbm90IGZpbmQgdGhlIFwiJykuY29uY2F0KHQsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKX1pZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBpKXRocm93IG5ldyBGKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IHVwZGF0ZXIgc2hvdWxkIGJlIGEgZnVuY3Rpb24uXCIpKTtyZXR1cm4gby5hdHRyaWJ1dGVzW3JdPWkoby5hdHRyaWJ1dGVzW3JdKSx0aGlzLmVtaXQoXCJlZGdlQXR0cmlidXRlc1VwZGF0ZWRcIix7a2V5Om8ua2V5LHR5cGU6XCJzZXRcIixhdHRyaWJ1dGVzOm8uYXR0cmlidXRlcyxuYW1lOnJ9KSx0aGlzfX19LHtuYW1lOmZ1bmN0aW9uKHQpe3JldHVyblwicmVtb3ZlXCIuY29uY2F0KHQsXCJBdHRyaWJ1dGVcIil9LGF0dGFjaGVyOmZ1bmN0aW9uKHQsZSxuKXt0LnByb3RvdHlwZVtlXT1mdW5jdGlvbih0LHIpe3ZhciBpO2lmKFwibWl4ZWRcIiE9PXRoaXMudHlwZSYmXCJtaXhlZFwiIT09biYmbiE9PXRoaXMudHlwZSl0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiBjYW5ub3QgZmluZCB0aGlzIHR5cGUgb2YgZWRnZXMgaW4geW91ciBcIikuY29uY2F0KHRoaXMudHlwZSxcIiBncmFwaC5cIikpO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mil7aWYodGhpcy5tdWx0aSl0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiBjYW5ub3QgdXNlIGEge3NvdXJjZSx0YXJnZXR9IGNvbWJvIHdoZW4gYXNraW5nIGFib3V0IGFuIGVkZ2UncyBhdHRyaWJ1dGVzIGluIGEgTXVsdGlHcmFwaCBzaW5jZSB3ZSBjYW5ub3QgaW5mZXIgdGhlIG9uZSB5b3Ugd2FudCBpbmZvcm1hdGlvbiBhYm91dC5cIikpO3ZhciBvPVwiXCIrdCxhPVwiXCIrcjtpZihyPWFyZ3VtZW50c1syXSwhKGk9cyh0aGlzLG8sYSxuKSkpdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBjb3VsZCBub3QgZmluZCBhbiBlZGdlIGZvciB0aGUgZ2l2ZW4gcGF0aCAoXCInKS5jb25jYXQobywnXCIgLSBcIicpLmNvbmNhdChhLCdcIikuJykpfWVsc2V7aWYoXCJtaXhlZFwiIT09bil0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiBjYWxsaW5nIHRoaXMgbWV0aG9kIHdpdGggb25seSBhIGtleSAodnMuIGEgc291cmNlIGFuZCB0YXJnZXQpIGRvZXMgbm90IG1ha2Ugc2Vuc2Ugc2luY2UgYW4gZWRnZSB3aXRoIHRoaXMga2V5IGNvdWxkIGhhdmUgdGhlIG90aGVyIHR5cGUuXCIpKTtpZih0PVwiXCIrdCwhKGk9dGhpcy5fZWRnZXMuZ2V0KHQpKSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdCh0LCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSl9cmV0dXJuIGRlbGV0ZSBpLmF0dHJpYnV0ZXNbcl0sdGhpcy5lbWl0KFwiZWRnZUF0dHJpYnV0ZXNVcGRhdGVkXCIse2tleTppLmtleSx0eXBlOlwicmVtb3ZlXCIsYXR0cmlidXRlczppLmF0dHJpYnV0ZXMsbmFtZTpyfSksdGhpc319fSx7bmFtZTpmdW5jdGlvbih0KXtyZXR1cm5cInJlcGxhY2VcIi5jb25jYXQodCxcIkF0dHJpYnV0ZXNcIil9LGF0dGFjaGVyOmZ1bmN0aW9uKHQsZSxuKXt0LnByb3RvdHlwZVtlXT1mdW5jdGlvbih0LHIpe3ZhciBpO2lmKFwibWl4ZWRcIiE9PXRoaXMudHlwZSYmXCJtaXhlZFwiIT09biYmbiE9PXRoaXMudHlwZSl0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiBjYW5ub3QgZmluZCB0aGlzIHR5cGUgb2YgZWRnZXMgaW4geW91ciBcIikuY29uY2F0KHRoaXMudHlwZSxcIiBncmFwaC5cIikpO2lmKGFyZ3VtZW50cy5sZW5ndGg+Mil7aWYodGhpcy5tdWx0aSl0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiBjYW5ub3QgdXNlIGEge3NvdXJjZSx0YXJnZXR9IGNvbWJvIHdoZW4gYXNraW5nIGFib3V0IGFuIGVkZ2UncyBhdHRyaWJ1dGVzIGluIGEgTXVsdGlHcmFwaCBzaW5jZSB3ZSBjYW5ub3QgaW5mZXIgdGhlIG9uZSB5b3Ugd2FudCBpbmZvcm1hdGlvbiBhYm91dC5cIikpO3ZhciBvPVwiXCIrdCxhPVwiXCIrcjtpZihyPWFyZ3VtZW50c1syXSwhKGk9cyh0aGlzLG8sYSxuKSkpdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBjb3VsZCBub3QgZmluZCBhbiBlZGdlIGZvciB0aGUgZ2l2ZW4gcGF0aCAoXCInKS5jb25jYXQobywnXCIgLSBcIicpLmNvbmNhdChhLCdcIikuJykpfWVsc2V7aWYoXCJtaXhlZFwiIT09bil0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiBjYWxsaW5nIHRoaXMgbWV0aG9kIHdpdGggb25seSBhIGtleSAodnMuIGEgc291cmNlIGFuZCB0YXJnZXQpIGRvZXMgbm90IG1ha2Ugc2Vuc2Ugc2luY2UgYW4gZWRnZSB3aXRoIHRoaXMga2V5IGNvdWxkIGhhdmUgdGhlIG90aGVyIHR5cGUuXCIpKTtpZih0PVwiXCIrdCwhKGk9dGhpcy5fZWRnZXMuZ2V0KHQpKSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdCh0LCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSl9aWYoIWgocikpdGhyb3cgbmV3IEYoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogcHJvdmlkZWQgYXR0cmlidXRlcyBhcmUgbm90IGEgcGxhaW4gb2JqZWN0LlwiKSk7cmV0dXJuIGkuYXR0cmlidXRlcz1yLHRoaXMuZW1pdChcImVkZ2VBdHRyaWJ1dGVzVXBkYXRlZFwiLHtrZXk6aS5rZXksdHlwZTpcInJlcGxhY2VcIixhdHRyaWJ1dGVzOmkuYXR0cmlidXRlc30pLHRoaXN9fX0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJtZXJnZVwiLmNvbmNhdCh0LFwiQXR0cmlidXRlc1wiKX0sYXR0YWNoZXI6ZnVuY3Rpb24odCxlLG4pe3QucHJvdG90eXBlW2VdPWZ1bmN0aW9uKHQscil7dmFyIGk7aWYoXCJtaXhlZFwiIT09dGhpcy50eXBlJiZcIm1peGVkXCIhPT1uJiZuIT09dGhpcy50eXBlKXRocm93IG5ldyBZKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IGNhbm5vdCBmaW5kIHRoaXMgdHlwZSBvZiBlZGdlcyBpbiB5b3VyIFwiKS5jb25jYXQodGhpcy50eXBlLFwiIGdyYXBoLlwiKSk7aWYoYXJndW1lbnRzLmxlbmd0aD4yKXtpZih0aGlzLm11bHRpKXRocm93IG5ldyBZKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IGNhbm5vdCB1c2UgYSB7c291cmNlLHRhcmdldH0gY29tYm8gd2hlbiBhc2tpbmcgYWJvdXQgYW4gZWRnZSdzIGF0dHJpYnV0ZXMgaW4gYSBNdWx0aUdyYXBoIHNpbmNlIHdlIGNhbm5vdCBpbmZlciB0aGUgb25lIHlvdSB3YW50IGluZm9ybWF0aW9uIGFib3V0LlwiKSk7dmFyIG89XCJcIit0LGE9XCJcIityO2lmKHI9YXJndW1lbnRzWzJdLCEoaT1zKHRoaXMsbyxhLG4pKSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGNvdWxkIG5vdCBmaW5kIGFuIGVkZ2UgZm9yIHRoZSBnaXZlbiBwYXRoIChcIicpLmNvbmNhdChvLCdcIiAtIFwiJykuY29uY2F0KGEsJ1wiKS4nKSl9ZWxzZXtpZihcIm1peGVkXCIhPT1uKXRocm93IG5ldyBZKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IGNhbGxpbmcgdGhpcyBtZXRob2Qgd2l0aCBvbmx5IGEga2V5ICh2cy4gYSBzb3VyY2UgYW5kIHRhcmdldCkgZG9lcyBub3QgbWFrZSBzZW5zZSBzaW5jZSBhbiBlZGdlIHdpdGggdGhpcyBrZXkgY291bGQgaGF2ZSB0aGUgb3RoZXIgdHlwZS5cIikpO2lmKHQ9XCJcIit0LCEoaT10aGlzLl9lZGdlcy5nZXQodCkpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KGUsJzogY291bGQgbm90IGZpbmQgdGhlIFwiJykuY29uY2F0KHQsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKX1pZighaChyKSl0aHJvdyBuZXcgRihcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiBwcm92aWRlZCBhdHRyaWJ1dGVzIGFyZSBub3QgYSBwbGFpbiBvYmplY3QuXCIpKTtyZXR1cm4gYyhpLmF0dHJpYnV0ZXMsciksdGhpcy5lbWl0KFwiZWRnZUF0dHJpYnV0ZXNVcGRhdGVkXCIse2tleTppLmtleSx0eXBlOlwibWVyZ2VcIixhdHRyaWJ1dGVzOmkuYXR0cmlidXRlcyxkYXRhOnJ9KSx0aGlzfX19LHtuYW1lOmZ1bmN0aW9uKHQpe3JldHVyblwidXBkYXRlXCIuY29uY2F0KHQsXCJBdHRyaWJ1dGVzXCIpfSxhdHRhY2hlcjpmdW5jdGlvbih0LGUsbil7dC5wcm90b3R5cGVbZV09ZnVuY3Rpb24odCxyKXt2YXIgaTtpZihcIm1peGVkXCIhPT10aGlzLnR5cGUmJlwibWl4ZWRcIiE9PW4mJm4hPT10aGlzLnR5cGUpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IGZpbmQgdGhpcyB0eXBlIG9mIGVkZ2VzIGluIHlvdXIgXCIpLmNvbmNhdCh0aGlzLnR5cGUsXCIgZ3JhcGguXCIpKTtpZihhcmd1bWVudHMubGVuZ3RoPjIpe2lmKHRoaXMubXVsdGkpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2Fubm90IHVzZSBhIHtzb3VyY2UsdGFyZ2V0fSBjb21ibyB3aGVuIGFza2luZyBhYm91dCBhbiBlZGdlJ3MgYXR0cmlidXRlcyBpbiBhIE11bHRpR3JhcGggc2luY2Ugd2UgY2Fubm90IGluZmVyIHRoZSBvbmUgeW91IHdhbnQgaW5mb3JtYXRpb24gYWJvdXQuXCIpKTt2YXIgbz1cIlwiK3QsYT1cIlwiK3I7aWYocj1hcmd1bWVudHNbMl0sIShpPXModGhpcyxvLGEsbikpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KGUsJzogY291bGQgbm90IGZpbmQgYW4gZWRnZSBmb3IgdGhlIGdpdmVuIHBhdGggKFwiJykuY29uY2F0KG8sJ1wiIC0gXCInKS5jb25jYXQoYSwnXCIpLicpKX1lbHNle2lmKFwibWl4ZWRcIiE9PW4pdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogY2FsbGluZyB0aGlzIG1ldGhvZCB3aXRoIG9ubHkgYSBrZXkgKHZzLiBhIHNvdXJjZSBhbmQgdGFyZ2V0KSBkb2VzIG5vdCBtYWtlIHNlbnNlIHNpbmNlIGFuIGVkZ2Ugd2l0aCB0aGlzIGtleSBjb3VsZCBoYXZlIHRoZSBvdGhlciB0eXBlLlwiKSk7aWYodD1cIlwiK3QsIShpPXRoaXMuX2VkZ2VzLmdldCh0KSkpdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBjb3VsZCBub3QgZmluZCB0aGUgXCInKS5jb25jYXQodCwnXCIgZWRnZSBpbiB0aGUgZ3JhcGguJykpfWlmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHIpdGhyb3cgbmV3IEYoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogcHJvdmlkZWQgdXBkYXRlciBpcyBub3QgYSBmdW5jdGlvbi5cIikpO3JldHVybiBpLmF0dHJpYnV0ZXM9cihpLmF0dHJpYnV0ZXMpLHRoaXMuZW1pdChcImVkZ2VBdHRyaWJ1dGVzVXBkYXRlZFwiLHtrZXk6aS5rZXksdHlwZTpcInVwZGF0ZVwiLGF0dHJpYnV0ZXM6aS5hdHRyaWJ1dGVzfSksdGhpc319fV07dmFyICQ9Tyx0dD1SLGV0PWZ1bmN0aW9uKCl7dmFyIHQ9YXJndW1lbnRzLGU9bnVsbCxuPS0xO3JldHVybiBuZXcgJCgoZnVuY3Rpb24oKXtmb3IodmFyIHI9bnVsbDs7KXtpZihudWxsPT09ZSl7aWYoKytuPj10Lmxlbmd0aClyZXR1cm57ZG9uZTohMH07ZT10dCh0W25dKX1pZighMCE9PShyPWUubmV4dCgpKS5kb25lKWJyZWFrO2U9bnVsbH1yZXR1cm4gcn0pKX0sbnQ9W3tuYW1lOlwiZWRnZXNcIix0eXBlOlwibWl4ZWRcIn0se25hbWU6XCJpbkVkZ2VzXCIsdHlwZTpcImRpcmVjdGVkXCIsZGlyZWN0aW9uOlwiaW5cIn0se25hbWU6XCJvdXRFZGdlc1wiLHR5cGU6XCJkaXJlY3RlZFwiLGRpcmVjdGlvbjpcIm91dFwifSx7bmFtZTpcImluYm91bmRFZGdlc1wiLHR5cGU6XCJtaXhlZFwiLGRpcmVjdGlvbjpcImluXCJ9LHtuYW1lOlwib3V0Ym91bmRFZGdlc1wiLHR5cGU6XCJtaXhlZFwiLGRpcmVjdGlvbjpcIm91dFwifSx7bmFtZTpcImRpcmVjdGVkRWRnZXNcIix0eXBlOlwiZGlyZWN0ZWRcIn0se25hbWU6XCJ1bmRpcmVjdGVkRWRnZXNcIix0eXBlOlwidW5kaXJlY3RlZFwifV07ZnVuY3Rpb24gcnQodCxlLG4scil7dmFyIGk9ITE7Zm9yKHZhciBvIGluIGUpaWYobyE9PXIpe3ZhciBhPWVbb107aWYoaT1uKGEua2V5LGEuYXR0cmlidXRlcyxhLnNvdXJjZS5rZXksYS50YXJnZXQua2V5LGEuc291cmNlLmF0dHJpYnV0ZXMsYS50YXJnZXQuYXR0cmlidXRlcyxhLnVuZGlyZWN0ZWQpLHQmJmkpcmV0dXJuIGEua2V5fX1mdW5jdGlvbiBpdCh0LGUsbixyKXt2YXIgaSxvLGEsdT0hMTtmb3IodmFyIGMgaW4gZSlpZihjIT09cil7aT1lW2NdO2Rve2lmKG89aS5zb3VyY2UsYT1pLnRhcmdldCx1PW4oaS5rZXksaS5hdHRyaWJ1dGVzLG8ua2V5LGEua2V5LG8uYXR0cmlidXRlcyxhLmF0dHJpYnV0ZXMsaS51bmRpcmVjdGVkKSx0JiZ1KXJldHVybiBpLmtleTtpPWkubmV4dH13aGlsZSh2b2lkIDAhPT1pKX19ZnVuY3Rpb24gb3QodCxlKXt2YXIgbixyPU9iamVjdC5rZXlzKHQpLGk9ci5sZW5ndGgsbz0wO3JldHVybiBuZXcgTygoZnVuY3Rpb24oKXtkb3tpZihuKW49bi5uZXh0O2Vsc2V7aWYobz49aSlyZXR1cm57ZG9uZTohMH07dmFyIGE9cltvKytdO2lmKGE9PT1lKXtuPXZvaWQgMDtjb250aW51ZX1uPXRbYV19fXdoaWxlKCFuKTtyZXR1cm57ZG9uZTohMSx2YWx1ZTp7ZWRnZTpuLmtleSxhdHRyaWJ1dGVzOm4uYXR0cmlidXRlcyxzb3VyY2U6bi5zb3VyY2Uua2V5LHRhcmdldDpuLnRhcmdldC5rZXksc291cmNlQXR0cmlidXRlczpuLnNvdXJjZS5hdHRyaWJ1dGVzLHRhcmdldEF0dHJpYnV0ZXM6bi50YXJnZXQuYXR0cmlidXRlcyx1bmRpcmVjdGVkOm4udW5kaXJlY3RlZH19fSkpfWZ1bmN0aW9uIGF0KHQsZSxuLHIpe3ZhciBpPWVbbl07aWYoaSl7dmFyIG89aS5zb3VyY2UsYT1pLnRhcmdldDtyZXR1cm4gcihpLmtleSxpLmF0dHJpYnV0ZXMsby5rZXksYS5rZXksby5hdHRyaWJ1dGVzLGEuYXR0cmlidXRlcyxpLnVuZGlyZWN0ZWQpJiZ0P2kua2V5OnZvaWQgMH19ZnVuY3Rpb24gdXQodCxlLG4scil7dmFyIGk9ZVtuXTtpZihpKXt2YXIgbz0hMTtkb3tpZihvPXIoaS5rZXksaS5hdHRyaWJ1dGVzLGkuc291cmNlLmtleSxpLnRhcmdldC5rZXksaS5zb3VyY2UuYXR0cmlidXRlcyxpLnRhcmdldC5hdHRyaWJ1dGVzLGkudW5kaXJlY3RlZCksdCYmbylyZXR1cm4gaS5rZXk7aT1pLm5leHR9d2hpbGUodm9pZCAwIT09aSl9fWZ1bmN0aW9uIGN0KHQsZSl7dmFyIG49dFtlXTtyZXR1cm4gdm9pZCAwIT09bi5uZXh0P25ldyBPKChmdW5jdGlvbigpe2lmKCFuKXJldHVybntkb25lOiEwfTt2YXIgdD17ZWRnZTpuLmtleSxhdHRyaWJ1dGVzOm4uYXR0cmlidXRlcyxzb3VyY2U6bi5zb3VyY2Uua2V5LHRhcmdldDpuLnRhcmdldC5rZXksc291cmNlQXR0cmlidXRlczpuLnNvdXJjZS5hdHRyaWJ1dGVzLHRhcmdldEF0dHJpYnV0ZXM6bi50YXJnZXQuYXR0cmlidXRlcyx1bmRpcmVjdGVkOm4udW5kaXJlY3RlZH07cmV0dXJuIG49bi5uZXh0LHtkb25lOiExLHZhbHVlOnR9fSkpOk8ub2Yoe2VkZ2U6bi5rZXksYXR0cmlidXRlczpuLmF0dHJpYnV0ZXMsc291cmNlOm4uc291cmNlLmtleSx0YXJnZXQ6bi50YXJnZXQua2V5LHNvdXJjZUF0dHJpYnV0ZXM6bi5zb3VyY2UuYXR0cmlidXRlcyx0YXJnZXRBdHRyaWJ1dGVzOm4udGFyZ2V0LmF0dHJpYnV0ZXMsdW5kaXJlY3RlZDpuLnVuZGlyZWN0ZWR9KX1mdW5jdGlvbiBzdCh0LGUpe2lmKDA9PT10LnNpemUpcmV0dXJuW107aWYoXCJtaXhlZFwiPT09ZXx8ZT09PXQudHlwZSlyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBBcnJheS5mcm9tP0FycmF5LmZyb20odC5fZWRnZXMua2V5cygpKTpUKHQuX2VkZ2VzLmtleXMoKSx0Ll9lZGdlcy5zaXplKTtmb3IodmFyIG4scixpPVwidW5kaXJlY3RlZFwiPT09ZT90LnVuZGlyZWN0ZWRTaXplOnQuZGlyZWN0ZWRTaXplLG89bmV3IEFycmF5KGkpLGE9XCJ1bmRpcmVjdGVkXCI9PT1lLHU9dC5fZWRnZXMudmFsdWVzKCksYz0wOyEwIT09KG49dS5uZXh0KCkpLmRvbmU7KShyPW4udmFsdWUpLnVuZGlyZWN0ZWQ9PT1hJiYob1tjKytdPXIua2V5KTtyZXR1cm4gb31mdW5jdGlvbiBkdCh0LGUsbixyKXtpZigwIT09ZS5zaXplKWZvcih2YXIgaSxvLGE9XCJtaXhlZFwiIT09biYmbiE9PWUudHlwZSx1PVwidW5kaXJlY3RlZFwiPT09bixjPSExLHM9ZS5fZWRnZXMudmFsdWVzKCk7ITAhPT0oaT1zLm5leHQoKSkuZG9uZTspaWYobz1pLnZhbHVlLCFhfHxvLnVuZGlyZWN0ZWQ9PT11KXt2YXIgZD1vLGg9ZC5rZXkscD1kLmF0dHJpYnV0ZXMsZj1kLnNvdXJjZSxsPWQudGFyZ2V0O2lmKGM9cihoLHAsZi5rZXksbC5rZXksZi5hdHRyaWJ1dGVzLGwuYXR0cmlidXRlcyxvLnVuZGlyZWN0ZWQpLHQmJmMpcmV0dXJuIGh9fWZ1bmN0aW9uIGh0KHQsZSl7aWYoMD09PXQuc2l6ZSlyZXR1cm4gTy5lbXB0eSgpO3ZhciBuPVwibWl4ZWRcIiE9PWUmJmUhPT10LnR5cGUscj1cInVuZGlyZWN0ZWRcIj09PWUsaT10Ll9lZGdlcy52YWx1ZXMoKTtyZXR1cm4gbmV3IE8oKGZ1bmN0aW9uKCl7Zm9yKHZhciB0LGU7Oyl7aWYoKHQ9aS5uZXh0KCkpLmRvbmUpcmV0dXJuIHQ7aWYoZT10LnZhbHVlLCFufHxlLnVuZGlyZWN0ZWQ9PT1yKWJyZWFrfXJldHVybnt2YWx1ZTp7ZWRnZTplLmtleSxhdHRyaWJ1dGVzOmUuYXR0cmlidXRlcyxzb3VyY2U6ZS5zb3VyY2Uua2V5LHRhcmdldDplLnRhcmdldC5rZXksc291cmNlQXR0cmlidXRlczplLnNvdXJjZS5hdHRyaWJ1dGVzLHRhcmdldEF0dHJpYnV0ZXM6ZS50YXJnZXQuYXR0cmlidXRlcyx1bmRpcmVjdGVkOmUudW5kaXJlY3RlZH0sZG9uZTohMX19KSl9ZnVuY3Rpb24gcHQodCxlLG4scixpLG8pe3ZhciBhLHU9ZT9pdDpydDtpZihcInVuZGlyZWN0ZWRcIiE9PW4pe2lmKFwib3V0XCIhPT1yJiYoYT11KHQsaS5pbixvKSx0JiZhKSlyZXR1cm4gYTtpZihcImluXCIhPT1yJiYoYT11KHQsaS5vdXQsbyxyP3ZvaWQgMDppLmtleSksdCYmYSkpcmV0dXJuIGF9aWYoXCJkaXJlY3RlZFwiIT09biYmKGE9dSh0LGkudW5kaXJlY3RlZCxvKSx0JiZhKSlyZXR1cm4gYX1mdW5jdGlvbiBmdCh0LGUsbixyKXt2YXIgaT1bXTtyZXR1cm4gcHQoITEsdCxlLG4sciwoZnVuY3Rpb24odCl7aS5wdXNoKHQpfSkpLGl9ZnVuY3Rpb24gbHQodCxlLG4pe3ZhciByPU8uZW1wdHkoKTtyZXR1cm5cInVuZGlyZWN0ZWRcIiE9PXQmJihcIm91dFwiIT09ZSYmdm9pZCAwIT09bi5pbiYmKHI9ZXQocixvdChuLmluKSkpLFwiaW5cIiE9PWUmJnZvaWQgMCE9PW4ub3V0JiYocj1ldChyLG90KG4ub3V0LGU/dm9pZCAwOm4ua2V5KSkpKSxcImRpcmVjdGVkXCIhPT10JiZ2b2lkIDAhPT1uLnVuZGlyZWN0ZWQmJihyPWV0KHIsb3Qobi51bmRpcmVjdGVkKSkpLHJ9ZnVuY3Rpb24gZ3QodCxlLG4scixpLG8sYSl7dmFyIHUsYz1uP3V0OmF0O2lmKFwidW5kaXJlY3RlZFwiIT09ZSl7aWYodm9pZCAwIT09aS5pbiYmXCJvdXRcIiE9PXImJih1PWModCxpLmluLG8sYSksdCYmdSkpcmV0dXJuIHU7aWYodm9pZCAwIT09aS5vdXQmJlwiaW5cIiE9PXImJihyfHxpLmtleSE9PW8pJiYodT1jKHQsaS5vdXQsbyxhKSx0JiZ1KSlyZXR1cm4gdX1pZihcImRpcmVjdGVkXCIhPT1lJiZ2b2lkIDAhPT1pLnVuZGlyZWN0ZWQmJih1PWModCxpLnVuZGlyZWN0ZWQsbyxhKSx0JiZ1KSlyZXR1cm4gdX1mdW5jdGlvbiB5dCh0LGUsbixyLGkpe3ZhciBvPVtdO3JldHVybiBndCghMSx0LGUsbixyLGksKGZ1bmN0aW9uKHQpe28ucHVzaCh0KX0pKSxvfWZ1bmN0aW9uIHd0KHQsZSxuLHIpe3ZhciBpPU8uZW1wdHkoKTtyZXR1cm5cInVuZGlyZWN0ZWRcIiE9PXQmJih2b2lkIDAhPT1uLmluJiZcIm91dFwiIT09ZSYmciBpbiBuLmluJiYoaT1ldChpLGN0KG4uaW4scikpKSx2b2lkIDAhPT1uLm91dCYmXCJpblwiIT09ZSYmciBpbiBuLm91dCYmKGV8fG4ua2V5IT09cikmJihpPWV0KGksY3Qobi5vdXQscikpKSksXCJkaXJlY3RlZFwiIT09dCYmdm9pZCAwIT09bi51bmRpcmVjdGVkJiZyIGluIG4udW5kaXJlY3RlZCYmKGk9ZXQoaSxjdChuLnVuZGlyZWN0ZWQscikpKSxpfXZhciB2dD1be25hbWU6XCJuZWlnaGJvcnNcIix0eXBlOlwibWl4ZWRcIn0se25hbWU6XCJpbk5laWdoYm9yc1wiLHR5cGU6XCJkaXJlY3RlZFwiLGRpcmVjdGlvbjpcImluXCJ9LHtuYW1lOlwib3V0TmVpZ2hib3JzXCIsdHlwZTpcImRpcmVjdGVkXCIsZGlyZWN0aW9uOlwib3V0XCJ9LHtuYW1lOlwiaW5ib3VuZE5laWdoYm9yc1wiLHR5cGU6XCJtaXhlZFwiLGRpcmVjdGlvbjpcImluXCJ9LHtuYW1lOlwib3V0Ym91bmROZWlnaGJvcnNcIix0eXBlOlwibWl4ZWRcIixkaXJlY3Rpb246XCJvdXRcIn0se25hbWU6XCJkaXJlY3RlZE5laWdoYm9yc1wiLHR5cGU6XCJkaXJlY3RlZFwifSx7bmFtZTpcInVuZGlyZWN0ZWROZWlnaGJvcnNcIix0eXBlOlwidW5kaXJlY3RlZFwifV07ZnVuY3Rpb24gYnQoKXt0aGlzLkE9bnVsbCx0aGlzLkI9bnVsbH1mdW5jdGlvbiBtdCh0LGUsbixyLGkpe2Zvcih2YXIgbyBpbiByKXt2YXIgYT1yW29dLHU9YS5zb3VyY2UsYz1hLnRhcmdldCxzPXU9PT1uP2M6dTtpZighZXx8IWUuaGFzKHMua2V5KSl7dmFyIGQ9aShzLmtleSxzLmF0dHJpYnV0ZXMpO2lmKHQmJmQpcmV0dXJuIHMua2V5fX19ZnVuY3Rpb24ga3QodCxlLG4scixpKXtpZihcIm1peGVkXCIhPT1lKXtpZihcInVuZGlyZWN0ZWRcIj09PWUpcmV0dXJuIG10KHQsbnVsbCxyLHIudW5kaXJlY3RlZCxpKTtpZihcInN0cmluZ1wiPT10eXBlb2YgbilyZXR1cm4gbXQodCxudWxsLHIscltuXSxpKX12YXIgbyxhPW5ldyBidDtpZihcInVuZGlyZWN0ZWRcIiE9PWUpe2lmKFwib3V0XCIhPT1uKXtpZihvPW10KHQsbnVsbCxyLHIuaW4saSksdCYmbylyZXR1cm4gbzthLndyYXAoci5pbil9aWYoXCJpblwiIT09bil7aWYobz1tdCh0LGEscixyLm91dCxpKSx0JiZvKXJldHVybiBvO2Eud3JhcChyLm91dCl9fWlmKFwiZGlyZWN0ZWRcIiE9PWUmJihvPW10KHQsYSxyLHIudW5kaXJlY3RlZCxpKSx0JiZvKSlyZXR1cm4gb31mdW5jdGlvbiBfdCh0LGUsbil7dmFyIHI9T2JqZWN0LmtleXMobiksaT1yLmxlbmd0aCxvPTA7cmV0dXJuIG5ldyBPKChmdW5jdGlvbigpe3ZhciBhPW51bGw7ZG97aWYobz49aSlyZXR1cm4gdCYmdC53cmFwKG4pLHtkb25lOiEwfTt2YXIgdT1uW3JbbysrXV0sYz11LnNvdXJjZSxzPXUudGFyZ2V0O2E9Yz09PWU/czpjLHQmJnQuaGFzKGEua2V5KSYmKGE9bnVsbCl9d2hpbGUobnVsbD09PWEpO3JldHVybntkb25lOiExLHZhbHVlOntuZWlnaGJvcjphLmtleSxhdHRyaWJ1dGVzOmEuYXR0cmlidXRlc319fSkpfWZ1bmN0aW9uIEd0KHQsZSl7dmFyIG49ZS5uYW1lLHI9ZS50eXBlLGk9ZS5kaXJlY3Rpb247dC5wcm90b3R5cGVbbl09ZnVuY3Rpb24odCl7aWYoXCJtaXhlZFwiIT09ciYmXCJtaXhlZFwiIT09dGhpcy50eXBlJiZyIT09dGhpcy50eXBlKXJldHVybltdO3Q9XCJcIit0O3ZhciBlPXRoaXMuX25vZGVzLmdldCh0KTtpZih2b2lkIDA9PT1lKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KG4sJzogY291bGQgbm90IGZpbmQgdGhlIFwiJykuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gZnVuY3Rpb24odCxlLG4pe2lmKFwibWl4ZWRcIiE9PXQpe2lmKFwidW5kaXJlY3RlZFwiPT09dClyZXR1cm4gT2JqZWN0LmtleXMobi51bmRpcmVjdGVkKTtpZihcInN0cmluZ1wiPT10eXBlb2YgZSlyZXR1cm4gT2JqZWN0LmtleXMobltlXSl9dmFyIHI9W107cmV0dXJuIGt0KCExLHQsZSxuLChmdW5jdGlvbih0KXtyLnB1c2godCl9KSkscn0oXCJtaXhlZFwiPT09cj90aGlzLnR5cGU6cixpLGUpfX1mdW5jdGlvbiB4dCh0LGUpe3ZhciBuPWUubmFtZSxyPWUudHlwZSxpPWUuZGlyZWN0aW9uLG89bi5zbGljZSgwLC0xKStcIkVudHJpZXNcIjt0LnByb3RvdHlwZVtvXT1mdW5jdGlvbih0KXtpZihcIm1peGVkXCIhPT1yJiZcIm1peGVkXCIhPT10aGlzLnR5cGUmJnIhPT10aGlzLnR5cGUpcmV0dXJuIE8uZW1wdHkoKTt0PVwiXCIrdDt2YXIgZT10aGlzLl9ub2Rlcy5nZXQodCk7aWYodm9pZCAwPT09ZSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChvLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuIGZ1bmN0aW9uKHQsZSxuKXtpZihcIm1peGVkXCIhPT10KXtpZihcInVuZGlyZWN0ZWRcIj09PXQpcmV0dXJuIF90KG51bGwsbixuLnVuZGlyZWN0ZWQpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlKXJldHVybiBfdChudWxsLG4sbltlXSl9dmFyIHI9Ty5lbXB0eSgpLGk9bmV3IGJ0O3JldHVyblwidW5kaXJlY3RlZFwiIT09dCYmKFwib3V0XCIhPT1lJiYocj1ldChyLF90KGksbixuLmluKSkpLFwiaW5cIiE9PWUmJihyPWV0KHIsX3QoaSxuLG4ub3V0KSkpKSxcImRpcmVjdGVkXCIhPT10JiYocj1ldChyLF90KGksbixuLnVuZGlyZWN0ZWQpKSkscn0oXCJtaXhlZFwiPT09cj90aGlzLnR5cGU6cixpLGUpfX1mdW5jdGlvbiBFdCh0LGUsbixyLGkpe2Zvcih2YXIgbyxhLHUsYyxzLGQsaCxwPXIuX25vZGVzLnZhbHVlcygpLGY9ci50eXBlOyEwIT09KG89cC5uZXh0KCkpLmRvbmU7KXt2YXIgbD0hMTtpZihhPW8udmFsdWUsXCJ1bmRpcmVjdGVkXCIhPT1mKWZvcih1IGluIGM9YS5vdXQpe3M9Y1t1XTtkb3tpZihkPXMudGFyZ2V0LGw9ITAsaD1pKGEua2V5LGQua2V5LGEuYXR0cmlidXRlcyxkLmF0dHJpYnV0ZXMscy5rZXkscy5hdHRyaWJ1dGVzLHMudW5kaXJlY3RlZCksdCYmaClyZXR1cm4gcztzPXMubmV4dH13aGlsZShzKX1pZihcImRpcmVjdGVkXCIhPT1mKWZvcih1IGluIGM9YS51bmRpcmVjdGVkKWlmKCEoZSYmYS5rZXk+dSkpe3M9Y1t1XTtkb3tpZigoZD1zLnRhcmdldCkua2V5IT09dSYmKGQ9cy5zb3VyY2UpLGw9ITAsaD1pKGEua2V5LGQua2V5LGEuYXR0cmlidXRlcyxkLmF0dHJpYnV0ZXMscy5rZXkscy5hdHRyaWJ1dGVzLHMudW5kaXJlY3RlZCksdCYmaClyZXR1cm4gcztzPXMubmV4dH13aGlsZShzKX1pZihuJiYhbCYmKGg9aShhLmtleSxudWxsLGEuYXR0cmlidXRlcyxudWxsLG51bGwsbnVsbCxudWxsKSx0JiZoKSlyZXR1cm4gbnVsbH19ZnVuY3Rpb24gQXQodCl7aWYoIWgodCkpdGhyb3cgbmV3IEYoJ0dyYXBoLmltcG9ydDogaW52YWxpZCBzZXJpYWxpemVkIG5vZGUuIEEgc2VyaWFsaXplZCBub2RlIHNob3VsZCBiZSBhIHBsYWluIG9iamVjdCB3aXRoIGF0IGxlYXN0IGEgXCJrZXlcIiBwcm9wZXJ0eS4nKTtpZighKFwia2V5XCJpbiB0KSl0aHJvdyBuZXcgRihcIkdyYXBoLmltcG9ydDogc2VyaWFsaXplZCBub2RlIGlzIG1pc3NpbmcgaXRzIGtleS5cIik7aWYoXCJhdHRyaWJ1dGVzXCJpbiB0JiYoIWgodC5hdHRyaWJ1dGVzKXx8bnVsbD09PXQuYXR0cmlidXRlcykpdGhyb3cgbmV3IEYoXCJHcmFwaC5pbXBvcnQ6IGludmFsaWQgYXR0cmlidXRlcy4gQXR0cmlidXRlcyBzaG91bGQgYmUgYSBwbGFpbiBvYmplY3QsIG51bGwgb3Igb21pdHRlZC5cIil9ZnVuY3Rpb24gU3QodCl7aWYoIWgodCkpdGhyb3cgbmV3IEYoJ0dyYXBoLmltcG9ydDogaW52YWxpZCBzZXJpYWxpemVkIGVkZ2UuIEEgc2VyaWFsaXplZCBlZGdlIHNob3VsZCBiZSBhIHBsYWluIG9iamVjdCB3aXRoIGF0IGxlYXN0IGEgXCJzb3VyY2VcIiAmIFwidGFyZ2V0XCIgcHJvcGVydHkuJyk7aWYoIShcInNvdXJjZVwiaW4gdCkpdGhyb3cgbmV3IEYoXCJHcmFwaC5pbXBvcnQ6IHNlcmlhbGl6ZWQgZWRnZSBpcyBtaXNzaW5nIGl0cyBzb3VyY2UuXCIpO2lmKCEoXCJ0YXJnZXRcImluIHQpKXRocm93IG5ldyBGKFwiR3JhcGguaW1wb3J0OiBzZXJpYWxpemVkIGVkZ2UgaXMgbWlzc2luZyBpdHMgdGFyZ2V0LlwiKTtpZihcImF0dHJpYnV0ZXNcImluIHQmJighaCh0LmF0dHJpYnV0ZXMpfHxudWxsPT09dC5hdHRyaWJ1dGVzKSl0aHJvdyBuZXcgRihcIkdyYXBoLmltcG9ydDogaW52YWxpZCBhdHRyaWJ1dGVzLiBBdHRyaWJ1dGVzIHNob3VsZCBiZSBhIHBsYWluIG9iamVjdCwgbnVsbCBvciBvbWl0dGVkLlwiKTtpZihcInVuZGlyZWN0ZWRcImluIHQmJlwiYm9vbGVhblwiIT10eXBlb2YgdC51bmRpcmVjdGVkKXRocm93IG5ldyBGKFwiR3JhcGguaW1wb3J0OiBpbnZhbGlkIHVuZGlyZWN0ZWRuZXNzIGluZm9ybWF0aW9uLiBVbmRpcmVjdGVkIHNob3VsZCBiZSBib29sZWFuIG9yIG9taXR0ZWQuXCIpfWJ0LnByb3RvdHlwZS53cmFwPWZ1bmN0aW9uKHQpe251bGw9PT10aGlzLkE/dGhpcy5BPXQ6bnVsbD09PXRoaXMuQiYmKHRoaXMuQj10KX0sYnQucHJvdG90eXBlLmhhcz1mdW5jdGlvbih0KXtyZXR1cm4gbnVsbCE9PXRoaXMuQSYmdCBpbiB0aGlzLkF8fG51bGwhPT10aGlzLkImJnQgaW4gdGhpcy5CfTt2YXIgRHQsTHQ9KER0PTI1NSZNYXRoLmZsb29yKDI1NipNYXRoLnJhbmRvbSgpKSxmdW5jdGlvbigpe3JldHVybiBEdCsrfSksVXQ9bmV3IFNldChbXCJkaXJlY3RlZFwiLFwidW5kaXJlY3RlZFwiLFwibWl4ZWRcIl0pLE50PW5ldyBTZXQoW1wiZG9tYWluXCIsXCJfZXZlbnRzXCIsXCJfZXZlbnRzQ291bnRcIixcIl9tYXhMaXN0ZW5lcnNcIl0pLGp0PXthbGxvd1NlbGZMb29wczohMCxtdWx0aTohMSx0eXBlOlwibWl4ZWRcIn07ZnVuY3Rpb24gT3QodCxlLG4pe3ZhciByPW5ldyB0Lk5vZGVEYXRhQ2xhc3MoZSxuKTtyZXR1cm4gdC5fbm9kZXMuc2V0KGUsciksdC5lbWl0KFwibm9kZUFkZGVkXCIse2tleTplLGF0dHJpYnV0ZXM6bn0pLHJ9ZnVuY3Rpb24gQ3QodCxlLG4scixpLG8sYSx1KXtpZighciYmXCJ1bmRpcmVjdGVkXCI9PT10LnR5cGUpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSxcIjogeW91IGNhbm5vdCBhZGQgYSBkaXJlY3RlZCBlZGdlIHRvIGFuIHVuZGlyZWN0ZWQgZ3JhcGguIFVzZSB0aGUgIy5hZGRFZGdlIG9yICMuYWRkVW5kaXJlY3RlZEVkZ2UgaW5zdGVhZC5cIikpO2lmKHImJlwiZGlyZWN0ZWRcIj09PXQudHlwZSl0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiB5b3UgY2Fubm90IGFkZCBhbiB1bmRpcmVjdGVkIGVkZ2UgdG8gYSBkaXJlY3RlZCBncmFwaC4gVXNlIHRoZSAjLmFkZEVkZ2Ugb3IgIy5hZGREaXJlY3RlZEVkZ2UgaW5zdGVhZC5cIikpO2lmKHUmJiFoKHUpKXRocm93IG5ldyBGKFwiR3JhcGguXCIuY29uY2F0KGUsJzogaW52YWxpZCBhdHRyaWJ1dGVzLiBFeHBlY3RpbmcgYW4gb2JqZWN0IGJ1dCBnb3QgXCInKS5jb25jYXQodSwnXCInKSk7aWYobz1cIlwiK28sYT1cIlwiK2EsdT11fHx7fSwhdC5hbGxvd1NlbGZMb29wcyYmbz09PWEpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBzb3VyY2UgJiB0YXJnZXQgYXJlIHRoZSBzYW1lIChcIicpLmNvbmNhdChvLFwiXFxcIiksIHRodXMgY3JlYXRpbmcgYSBsb29wIGV4cGxpY2l0bHkgZm9yYmlkZGVuIGJ5IHRoaXMgZ3JhcGggJ2FsbG93U2VsZkxvb3BzJyBvcHRpb24gc2V0IHRvIGZhbHNlLlwiKSk7dmFyIGM9dC5fbm9kZXMuZ2V0KG8pLHM9dC5fbm9kZXMuZ2V0KGEpO2lmKCFjKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KGUsJzogc291cmNlIG5vZGUgXCInKS5jb25jYXQobywnXCIgbm90IGZvdW5kLicpKTtpZighcyl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IHRhcmdldCBub2RlIFwiJykuY29uY2F0KGEsJ1wiIG5vdCBmb3VuZC4nKSk7dmFyIGQ9e2tleTpudWxsLHVuZGlyZWN0ZWQ6cixzb3VyY2U6byx0YXJnZXQ6YSxhdHRyaWJ1dGVzOnV9O2lmKG4paT10Ll9lZGdlS2V5R2VuZXJhdG9yKCk7ZWxzZSBpZihpPVwiXCIraSx0Ll9lZGdlcy5oYXMoaSkpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiB0aGUgXCInKS5jb25jYXQoaSwnXCIgZWRnZSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgZ3JhcGguJykpO2lmKCF0Lm11bHRpJiYocj92b2lkIDAhPT1jLnVuZGlyZWN0ZWRbYV06dm9pZCAwIT09Yy5vdXRbYV0pKXRocm93IG5ldyBZKFwiR3JhcGguXCIuY29uY2F0KGUsJzogYW4gZWRnZSBsaW5raW5nIFwiJykuY29uY2F0KG8sJ1wiIHRvIFwiJykuY29uY2F0KGEsXCJcXFwiIGFscmVhZHkgZXhpc3RzLiBJZiB5b3UgcmVhbGx5IHdhbnQgdG8gYWRkIG11bHRpcGxlIGVkZ2VzIGxpbmtpbmcgdGhvc2Ugbm9kZXMsIHlvdSBzaG91bGQgY3JlYXRlIGEgbXVsdGkgZ3JhcGggYnkgdXNpbmcgdGhlICdtdWx0aScgb3B0aW9uLlwiKSk7dmFyIHA9bmV3IEgocixpLGMscyx1KTt0Ll9lZGdlcy5zZXQoaSxwKTt2YXIgZj1vPT09YTtyZXR1cm4gcj8oYy51bmRpcmVjdGVkRGVncmVlKysscy51bmRpcmVjdGVkRGVncmVlKyssZiYmdC5fdW5kaXJlY3RlZFNlbGZMb29wQ291bnQrKyk6KGMub3V0RGVncmVlKysscy5pbkRlZ3JlZSsrLGYmJnQuX2RpcmVjdGVkU2VsZkxvb3BDb3VudCsrKSx0Lm11bHRpP3AuYXR0YWNoTXVsdGkoKTpwLmF0dGFjaCgpLHI/dC5fdW5kaXJlY3RlZFNpemUrKzp0Ll9kaXJlY3RlZFNpemUrKyxkLmtleT1pLHQuZW1pdChcImVkZ2VBZGRlZFwiLGQpLGl9ZnVuY3Rpb24genQodCxlLG4scixpLG8sYSx1LHMpe2lmKCFyJiZcInVuZGlyZWN0ZWRcIj09PXQudHlwZSl0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLFwiOiB5b3UgY2Fubm90IG1lcmdlL3VwZGF0ZSBhIGRpcmVjdGVkIGVkZ2UgdG8gYW4gdW5kaXJlY3RlZCBncmFwaC4gVXNlIHRoZSAjLm1lcmdlRWRnZS8jLnVwZGF0ZUVkZ2Ugb3IgIy5hZGRVbmRpcmVjdGVkRWRnZSBpbnN0ZWFkLlwiKSk7aWYociYmXCJkaXJlY3RlZFwiPT09dC50eXBlKXRocm93IG5ldyBZKFwiR3JhcGguXCIuY29uY2F0KGUsXCI6IHlvdSBjYW5ub3QgbWVyZ2UvdXBkYXRlIGFuIHVuZGlyZWN0ZWQgZWRnZSB0byBhIGRpcmVjdGVkIGdyYXBoLiBVc2UgdGhlICMubWVyZ2VFZGdlLyMudXBkYXRlRWRnZSBvciAjLmFkZERpcmVjdGVkRWRnZSBpbnN0ZWFkLlwiKSk7aWYodSlpZihzKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB1KXRocm93IG5ldyBGKFwiR3JhcGguXCIuY29uY2F0KGUsJzogaW52YWxpZCB1cGRhdGVyIGZ1bmN0aW9uLiBFeHBlY3RpbmcgYSBmdW5jdGlvbiBidXQgZ290IFwiJykuY29uY2F0KHUsJ1wiJykpfWVsc2UgaWYoIWgodSkpdGhyb3cgbmV3IEYoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBpbnZhbGlkIGF0dHJpYnV0ZXMuIEV4cGVjdGluZyBhbiBvYmplY3QgYnV0IGdvdCBcIicpLmNvbmNhdCh1LCdcIicpKTt2YXIgZDtpZihvPVwiXCIrbyxhPVwiXCIrYSxzJiYoZD11LHU9dm9pZCAwKSwhdC5hbGxvd1NlbGZMb29wcyYmbz09PWEpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiBzb3VyY2UgJiB0YXJnZXQgYXJlIHRoZSBzYW1lIChcIicpLmNvbmNhdChvLFwiXFxcIiksIHRodXMgY3JlYXRpbmcgYSBsb29wIGV4cGxpY2l0bHkgZm9yYmlkZGVuIGJ5IHRoaXMgZ3JhcGggJ2FsbG93U2VsZkxvb3BzJyBvcHRpb24gc2V0IHRvIGZhbHNlLlwiKSk7dmFyIHAsZixsPXQuX25vZGVzLmdldChvKSxnPXQuX25vZGVzLmdldChhKTtpZighbiYmKHA9dC5fZWRnZXMuZ2V0KGkpKSl7aWYoIShwLnNvdXJjZS5rZXk9PT1vJiZwLnRhcmdldC5rZXk9PT1hfHxyJiZwLnNvdXJjZS5rZXk9PT1hJiZwLnRhcmdldC5rZXk9PT1vKSl0aHJvdyBuZXcgWShcIkdyYXBoLlwiLmNvbmNhdChlLCc6IGluY29uc2lzdGVuY3kgZGV0ZWN0ZWQgd2hlbiBhdHRlbXB0aW5nIHRvIG1lcmdlIHRoZSBcIicpLmNvbmNhdChpLCdcIiBlZGdlIHdpdGggXCInKS5jb25jYXQobywnXCIgc291cmNlICYgXCInKS5jb25jYXQoYSwnXCIgdGFyZ2V0IHZzLiAoXCInKS5jb25jYXQocC5zb3VyY2Uua2V5LCdcIiwgXCInKS5jb25jYXQocC50YXJnZXQua2V5LCdcIikuJykpO2Y9cH1pZihmfHx0Lm11bHRpfHwhbHx8KGY9cj9sLnVuZGlyZWN0ZWRbYV06bC5vdXRbYV0pLGYpe3ZhciB5PVtmLmtleSwhMSwhMSwhMV07aWYocz8hZDohdSlyZXR1cm4geTtpZihzKXt2YXIgdz1mLmF0dHJpYnV0ZXM7Zi5hdHRyaWJ1dGVzPWQodyksdC5lbWl0KFwiZWRnZUF0dHJpYnV0ZXNVcGRhdGVkXCIse3R5cGU6XCJyZXBsYWNlXCIsa2V5OmYua2V5LGF0dHJpYnV0ZXM6Zi5hdHRyaWJ1dGVzfSl9ZWxzZSBjKGYuYXR0cmlidXRlcyx1KSx0LmVtaXQoXCJlZGdlQXR0cmlidXRlc1VwZGF0ZWRcIix7dHlwZTpcIm1lcmdlXCIsa2V5OmYua2V5LGF0dHJpYnV0ZXM6Zi5hdHRyaWJ1dGVzLGRhdGE6dX0pO3JldHVybiB5fXU9dXx8e30scyYmZCYmKHU9ZCh1KSk7dmFyIHY9e2tleTpudWxsLHVuZGlyZWN0ZWQ6cixzb3VyY2U6byx0YXJnZXQ6YSxhdHRyaWJ1dGVzOnV9O2lmKG4paT10Ll9lZGdlS2V5R2VuZXJhdG9yKCk7ZWxzZSBpZihpPVwiXCIraSx0Ll9lZGdlcy5oYXMoaSkpdGhyb3cgbmV3IFkoXCJHcmFwaC5cIi5jb25jYXQoZSwnOiB0aGUgXCInKS5jb25jYXQoaSwnXCIgZWRnZSBhbHJlYWR5IGV4aXN0cyBpbiB0aGUgZ3JhcGguJykpO3ZhciBiPSExLG09ITE7bHx8KGw9T3QodCxvLHt9KSxiPSEwLG89PT1hJiYoZz1sLG09ITApKSxnfHwoZz1PdCh0LGEse30pLG09ITApLHA9bmV3IEgocixpLGwsZyx1KSx0Ll9lZGdlcy5zZXQoaSxwKTt2YXIgaz1vPT09YTtyZXR1cm4gcj8obC51bmRpcmVjdGVkRGVncmVlKyssZy51bmRpcmVjdGVkRGVncmVlKyssayYmdC5fdW5kaXJlY3RlZFNlbGZMb29wQ291bnQrKyk6KGwub3V0RGVncmVlKyssZy5pbkRlZ3JlZSsrLGsmJnQuX2RpcmVjdGVkU2VsZkxvb3BDb3VudCsrKSx0Lm11bHRpP3AuYXR0YWNoTXVsdGkoKTpwLmF0dGFjaCgpLHI/dC5fdW5kaXJlY3RlZFNpemUrKzp0Ll9kaXJlY3RlZFNpemUrKyx2LmtleT1pLHQuZW1pdChcImVkZ2VBZGRlZFwiLHYpLFtpLCEwLGIsbV19ZnVuY3Rpb24gTXQodCxlKXt0Ll9lZGdlcy5kZWxldGUoZS5rZXkpO3ZhciBuPWUuc291cmNlLHI9ZS50YXJnZXQsaT1lLmF0dHJpYnV0ZXMsbz1lLnVuZGlyZWN0ZWQsYT1uPT09cjtvPyhuLnVuZGlyZWN0ZWREZWdyZWUtLSxyLnVuZGlyZWN0ZWREZWdyZWUtLSxhJiZ0Ll91bmRpcmVjdGVkU2VsZkxvb3BDb3VudC0tKToobi5vdXREZWdyZWUtLSxyLmluRGVncmVlLS0sYSYmdC5fZGlyZWN0ZWRTZWxmTG9vcENvdW50LS0pLHQubXVsdGk/ZS5kZXRhY2hNdWx0aSgpOmUuZGV0YWNoKCksbz90Ll91bmRpcmVjdGVkU2l6ZS0tOnQuX2RpcmVjdGVkU2l6ZS0tLHQuZW1pdChcImVkZ2VEcm9wcGVkXCIse2tleTplLmtleSxhdHRyaWJ1dGVzOmksc291cmNlOm4ua2V5LHRhcmdldDpyLmtleSx1bmRpcmVjdGVkOm99KX12YXIgV3Q9ZnVuY3Rpb24obil7ZnVuY3Rpb24gcih0KXt2YXIgZTtpZihlPW4uY2FsbCh0aGlzKXx8dGhpcyxcImJvb2xlYW5cIiE9dHlwZW9mKHQ9Yyh7fSxqdCx0KSkubXVsdGkpdGhyb3cgbmV3IEYoXCJHcmFwaC5jb25zdHJ1Y3RvcjogaW52YWxpZCAnbXVsdGknIG9wdGlvbi4gRXhwZWN0aW5nIGEgYm9vbGVhbiBidXQgZ290IFxcXCJcIi5jb25jYXQodC5tdWx0aSwnXCIuJykpO2lmKCFVdC5oYXModC50eXBlKSl0aHJvdyBuZXcgRignR3JhcGguY29uc3RydWN0b3I6IGludmFsaWQgXFwndHlwZVxcJyBvcHRpb24uIFNob3VsZCBiZSBvbmUgb2YgXCJtaXhlZFwiLCBcImRpcmVjdGVkXCIgb3IgXCJ1bmRpcmVjdGVkXCIgYnV0IGdvdCBcIicuY29uY2F0KHQudHlwZSwnXCIuJykpO2lmKFwiYm9vbGVhblwiIT10eXBlb2YgdC5hbGxvd1NlbGZMb29wcyl0aHJvdyBuZXcgRihcIkdyYXBoLmNvbnN0cnVjdG9yOiBpbnZhbGlkICdhbGxvd1NlbGZMb29wcycgb3B0aW9uLiBFeHBlY3RpbmcgYSBib29sZWFuIGJ1dCBnb3QgXFxcIlwiLmNvbmNhdCh0LmFsbG93U2VsZkxvb3BzLCdcIi4nKSk7dmFyIHI9XCJtaXhlZFwiPT09dC50eXBlP3E6XCJkaXJlY3RlZFwiPT09dC50eXBlP0o6VjtmKHUoZSksXCJOb2RlRGF0YUNsYXNzXCIscik7dmFyIGk9XCJnZWlkX1wiK0x0KCkrXCJfXCIsbz0wO3JldHVybiBmKHUoZSksXCJfYXR0cmlidXRlc1wiLHt9KSxmKHUoZSksXCJfbm9kZXNcIixuZXcgTWFwKSxmKHUoZSksXCJfZWRnZXNcIixuZXcgTWFwKSxmKHUoZSksXCJfZGlyZWN0ZWRTaXplXCIsMCksZih1KGUpLFwiX3VuZGlyZWN0ZWRTaXplXCIsMCksZih1KGUpLFwiX2RpcmVjdGVkU2VsZkxvb3BDb3VudFwiLDApLGYodShlKSxcIl91bmRpcmVjdGVkU2VsZkxvb3BDb3VudFwiLDApLGYodShlKSxcIl9lZGdlS2V5R2VuZXJhdG9yXCIsKGZ1bmN0aW9uKCl7dmFyIHQ7ZG97dD1pK28rK313aGlsZShlLl9lZGdlcy5oYXModCkpO3JldHVybiB0fSkpLGYodShlKSxcIl9vcHRpb25zXCIsdCksTnQuZm9yRWFjaCgoZnVuY3Rpb24odCl7cmV0dXJuIGYodShlKSx0LGVbdF0pfSkpLGwodShlKSxcIm9yZGVyXCIsKGZ1bmN0aW9uKCl7cmV0dXJuIGUuX25vZGVzLnNpemV9KSksbCh1KGUpLFwic2l6ZVwiLChmdW5jdGlvbigpe3JldHVybiBlLl9lZGdlcy5zaXplfSkpLGwodShlKSxcImRpcmVjdGVkU2l6ZVwiLChmdW5jdGlvbigpe3JldHVybiBlLl9kaXJlY3RlZFNpemV9KSksbCh1KGUpLFwidW5kaXJlY3RlZFNpemVcIiwoZnVuY3Rpb24oKXtyZXR1cm4gZS5fdW5kaXJlY3RlZFNpemV9KSksbCh1KGUpLFwic2VsZkxvb3BDb3VudFwiLChmdW5jdGlvbigpe3JldHVybiBlLl9kaXJlY3RlZFNlbGZMb29wQ291bnQrZS5fdW5kaXJlY3RlZFNlbGZMb29wQ291bnR9KSksbCh1KGUpLFwiZGlyZWN0ZWRTZWxmTG9vcENvdW50XCIsKGZ1bmN0aW9uKCl7cmV0dXJuIGUuX2RpcmVjdGVkU2VsZkxvb3BDb3VudH0pKSxsKHUoZSksXCJ1bmRpcmVjdGVkU2VsZkxvb3BDb3VudFwiLChmdW5jdGlvbigpe3JldHVybiBlLl91bmRpcmVjdGVkU2VsZkxvb3BDb3VudH0pKSxsKHUoZSksXCJtdWx0aVwiLGUuX29wdGlvbnMubXVsdGkpLGwodShlKSxcInR5cGVcIixlLl9vcHRpb25zLnR5cGUpLGwodShlKSxcImFsbG93U2VsZkxvb3BzXCIsZS5fb3B0aW9ucy5hbGxvd1NlbGZMb29wcyksbCh1KGUpLFwiaW1wbGVtZW50YXRpb25cIiwoZnVuY3Rpb24oKXtyZXR1cm5cImdyYXBob2xvZ3lcIn0pKSxlfWUocixuKTt2YXIgaT1yLnByb3RvdHlwZTtyZXR1cm4gaS5fcmVzZXRJbnN0YW5jZUNvdW50ZXJzPWZ1bmN0aW9uKCl7dGhpcy5fZGlyZWN0ZWRTaXplPTAsdGhpcy5fdW5kaXJlY3RlZFNpemU9MCx0aGlzLl9kaXJlY3RlZFNlbGZMb29wQ291bnQ9MCx0aGlzLl91bmRpcmVjdGVkU2VsZkxvb3BDb3VudD0wfSxpLmhhc05vZGU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX25vZGVzLmhhcyhcIlwiK3QpfSxpLmhhc0RpcmVjdGVkRWRnZT1mdW5jdGlvbih0LGUpe2lmKFwidW5kaXJlY3RlZFwiPT09dGhpcy50eXBlKXJldHVybiExO2lmKDE9PT1hcmd1bWVudHMubGVuZ3RoKXt2YXIgbj1cIlwiK3Qscj10aGlzLl9lZGdlcy5nZXQobik7cmV0dXJuISFyJiYhci51bmRpcmVjdGVkfWlmKDI9PT1hcmd1bWVudHMubGVuZ3RoKXt0PVwiXCIrdCxlPVwiXCIrZTt2YXIgaT10aGlzLl9ub2Rlcy5nZXQodCk7aWYoIWkpcmV0dXJuITE7dmFyIG89aS5vdXRbZV07cmV0dXJuISFvJiYoIXRoaXMubXVsdGl8fCEhby5zaXplKX10aHJvdyBuZXcgRihcIkdyYXBoLmhhc0RpcmVjdGVkRWRnZTogaW52YWxpZCBhcml0eSAoXCIuY29uY2F0KGFyZ3VtZW50cy5sZW5ndGgsXCIsIGluc3RlYWQgb2YgMSBvciAyKS4gWW91IGNhbiBlaXRoZXIgYXNrIGZvciBhbiBlZGdlIGlkIG9yIGZvciB0aGUgZXhpc3RlbmNlIG9mIGFuIGVkZ2UgYmV0d2VlbiBhIHNvdXJjZSAmIGEgdGFyZ2V0LlwiKSl9LGkuaGFzVW5kaXJlY3RlZEVkZ2U9ZnVuY3Rpb24odCxlKXtpZihcImRpcmVjdGVkXCI9PT10aGlzLnR5cGUpcmV0dXJuITE7aWYoMT09PWFyZ3VtZW50cy5sZW5ndGgpe3ZhciBuPVwiXCIrdCxyPXRoaXMuX2VkZ2VzLmdldChuKTtyZXR1cm4hIXImJnIudW5kaXJlY3RlZH1pZigyPT09YXJndW1lbnRzLmxlbmd0aCl7dD1cIlwiK3QsZT1cIlwiK2U7dmFyIGk9dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFpKXJldHVybiExO3ZhciBvPWkudW5kaXJlY3RlZFtlXTtyZXR1cm4hIW8mJighdGhpcy5tdWx0aXx8ISFvLnNpemUpfXRocm93IG5ldyBGKFwiR3JhcGguaGFzRGlyZWN0ZWRFZGdlOiBpbnZhbGlkIGFyaXR5IChcIi5jb25jYXQoYXJndW1lbnRzLmxlbmd0aCxcIiwgaW5zdGVhZCBvZiAxIG9yIDIpLiBZb3UgY2FuIGVpdGhlciBhc2sgZm9yIGFuIGVkZ2UgaWQgb3IgZm9yIHRoZSBleGlzdGVuY2Ugb2YgYW4gZWRnZSBiZXR3ZWVuIGEgc291cmNlICYgYSB0YXJnZXQuXCIpKX0saS5oYXNFZGdlPWZ1bmN0aW9uKHQsZSl7aWYoMT09PWFyZ3VtZW50cy5sZW5ndGgpe3ZhciBuPVwiXCIrdDtyZXR1cm4gdGhpcy5fZWRnZXMuaGFzKG4pfWlmKDI9PT1hcmd1bWVudHMubGVuZ3RoKXt0PVwiXCIrdCxlPVwiXCIrZTt2YXIgcj10aGlzLl9ub2Rlcy5nZXQodCk7aWYoIXIpcmV0dXJuITE7dmFyIGk9dm9pZCAwIT09ci5vdXQmJnIub3V0W2VdO3JldHVybiBpfHwoaT12b2lkIDAhPT1yLnVuZGlyZWN0ZWQmJnIudW5kaXJlY3RlZFtlXSksISFpJiYoIXRoaXMubXVsdGl8fCEhaS5zaXplKX10aHJvdyBuZXcgRihcIkdyYXBoLmhhc0VkZ2U6IGludmFsaWQgYXJpdHkgKFwiLmNvbmNhdChhcmd1bWVudHMubGVuZ3RoLFwiLCBpbnN0ZWFkIG9mIDEgb3IgMikuIFlvdSBjYW4gZWl0aGVyIGFzayBmb3IgYW4gZWRnZSBpZCBvciBmb3IgdGhlIGV4aXN0ZW5jZSBvZiBhbiBlZGdlIGJldHdlZW4gYSBzb3VyY2UgJiBhIHRhcmdldC5cIikpfSxpLmRpcmVjdGVkRWRnZT1mdW5jdGlvbih0LGUpe2lmKFwidW5kaXJlY3RlZFwiIT09dGhpcy50eXBlKXtpZih0PVwiXCIrdCxlPVwiXCIrZSx0aGlzLm11bHRpKXRocm93IG5ldyBZKFwiR3JhcGguZGlyZWN0ZWRFZGdlOiB0aGlzIG1ldGhvZCBpcyBpcnJlbGV2YW50IHdpdGggbXVsdGlncmFwaHMgc2luY2UgdGhlcmUgbWlnaHQgYmUgbXVsdGlwbGUgZWRnZXMgYmV0d2VlbiBzb3VyY2UgJiB0YXJnZXQuIFNlZSAjLmRpcmVjdGVkRWRnZXMgaW5zdGVhZC5cIik7dmFyIG49dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFuKXRocm93IG5ldyBJKCdHcmFwaC5kaXJlY3RlZEVkZ2U6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIHNvdXJjZSBub2RlIGluIHRoZSBncmFwaC4nKSk7aWYoIXRoaXMuX25vZGVzLmhhcyhlKSl0aHJvdyBuZXcgSSgnR3JhcGguZGlyZWN0ZWRFZGdlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdChlLCdcIiB0YXJnZXQgbm9kZSBpbiB0aGUgZ3JhcGguJykpO3ZhciByPW4ub3V0JiZuLm91dFtlXXx8dm9pZCAwO3JldHVybiByP3Iua2V5OnZvaWQgMH19LGkudW5kaXJlY3RlZEVkZ2U9ZnVuY3Rpb24odCxlKXtpZihcImRpcmVjdGVkXCIhPT10aGlzLnR5cGUpe2lmKHQ9XCJcIit0LGU9XCJcIitlLHRoaXMubXVsdGkpdGhyb3cgbmV3IFkoXCJHcmFwaC51bmRpcmVjdGVkRWRnZTogdGhpcyBtZXRob2QgaXMgaXJyZWxldmFudCB3aXRoIG11bHRpZ3JhcGhzIHNpbmNlIHRoZXJlIG1pZ2h0IGJlIG11bHRpcGxlIGVkZ2VzIGJldHdlZW4gc291cmNlICYgdGFyZ2V0LiBTZWUgIy51bmRpcmVjdGVkRWRnZXMgaW5zdGVhZC5cIik7dmFyIG49dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFuKXRocm93IG5ldyBJKCdHcmFwaC51bmRpcmVjdGVkRWRnZTogY291bGQgbm90IGZpbmQgdGhlIFwiJy5jb25jYXQodCwnXCIgc291cmNlIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtpZighdGhpcy5fbm9kZXMuaGFzKGUpKXRocm93IG5ldyBJKCdHcmFwaC51bmRpcmVjdGVkRWRnZTogY291bGQgbm90IGZpbmQgdGhlIFwiJy5jb25jYXQoZSwnXCIgdGFyZ2V0IG5vZGUgaW4gdGhlIGdyYXBoLicpKTt2YXIgcj1uLnVuZGlyZWN0ZWQmJm4udW5kaXJlY3RlZFtlXXx8dm9pZCAwO3JldHVybiByP3Iua2V5OnZvaWQgMH19LGkuZWRnZT1mdW5jdGlvbih0LGUpe2lmKHRoaXMubXVsdGkpdGhyb3cgbmV3IFkoXCJHcmFwaC5lZGdlOiB0aGlzIG1ldGhvZCBpcyBpcnJlbGV2YW50IHdpdGggbXVsdGlncmFwaHMgc2luY2UgdGhlcmUgbWlnaHQgYmUgbXVsdGlwbGUgZWRnZXMgYmV0d2VlbiBzb3VyY2UgJiB0YXJnZXQuIFNlZSAjLmVkZ2VzIGluc3RlYWQuXCIpO3Q9XCJcIit0LGU9XCJcIitlO3ZhciBuPXRoaXMuX25vZGVzLmdldCh0KTtpZighbil0aHJvdyBuZXcgSSgnR3JhcGguZWRnZTogY291bGQgbm90IGZpbmQgdGhlIFwiJy5jb25jYXQodCwnXCIgc291cmNlIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtpZighdGhpcy5fbm9kZXMuaGFzKGUpKXRocm93IG5ldyBJKCdHcmFwaC5lZGdlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdChlLCdcIiB0YXJnZXQgbm9kZSBpbiB0aGUgZ3JhcGguJykpO3ZhciByPW4ub3V0JiZuLm91dFtlXXx8bi51bmRpcmVjdGVkJiZuLnVuZGlyZWN0ZWRbZV18fHZvaWQgMDtpZihyKXJldHVybiByLmtleX0saS5hcmVEaXJlY3RlZE5laWdoYm9ycz1mdW5jdGlvbih0LGUpe3Q9XCJcIit0LGU9XCJcIitlO3ZhciBuPXRoaXMuX25vZGVzLmdldCh0KTtpZighbil0aHJvdyBuZXcgSSgnR3JhcGguYXJlRGlyZWN0ZWROZWlnaGJvcnM6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm5cInVuZGlyZWN0ZWRcIiE9PXRoaXMudHlwZSYmKGUgaW4gbi5pbnx8ZSBpbiBuLm91dCl9LGkuYXJlT3V0TmVpZ2hib3JzPWZ1bmN0aW9uKHQsZSl7dD1cIlwiK3QsZT1cIlwiK2U7dmFyIG49dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFuKXRocm93IG5ldyBJKCdHcmFwaC5hcmVPdXROZWlnaGJvcnM6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm5cInVuZGlyZWN0ZWRcIiE9PXRoaXMudHlwZSYmZSBpbiBuLm91dH0saS5hcmVJbk5laWdoYm9ycz1mdW5jdGlvbih0LGUpe3Q9XCJcIit0LGU9XCJcIitlO3ZhciBuPXRoaXMuX25vZGVzLmdldCh0KTtpZighbil0aHJvdyBuZXcgSSgnR3JhcGguYXJlSW5OZWlnaGJvcnM6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm5cInVuZGlyZWN0ZWRcIiE9PXRoaXMudHlwZSYmZSBpbiBuLmlufSxpLmFyZVVuZGlyZWN0ZWROZWlnaGJvcnM9ZnVuY3Rpb24odCxlKXt0PVwiXCIrdCxlPVwiXCIrZTt2YXIgbj10aGlzLl9ub2Rlcy5nZXQodCk7aWYoIW4pdGhyb3cgbmV3IEkoJ0dyYXBoLmFyZVVuZGlyZWN0ZWROZWlnaGJvcnM6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm5cImRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJmUgaW4gbi51bmRpcmVjdGVkfSxpLmFyZU5laWdoYm9ycz1mdW5jdGlvbih0LGUpe3Q9XCJcIit0LGU9XCJcIitlO3ZhciBuPXRoaXMuX25vZGVzLmdldCh0KTtpZighbil0aHJvdyBuZXcgSSgnR3JhcGguYXJlTmVpZ2hib3JzOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuXCJ1bmRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJihlIGluIG4uaW58fGUgaW4gbi5vdXQpfHxcImRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJmUgaW4gbi51bmRpcmVjdGVkfSxpLmFyZUluYm91bmROZWlnaGJvcnM9ZnVuY3Rpb24odCxlKXt0PVwiXCIrdCxlPVwiXCIrZTt2YXIgbj10aGlzLl9ub2Rlcy5nZXQodCk7aWYoIW4pdGhyb3cgbmV3IEkoJ0dyYXBoLmFyZUluYm91bmROZWlnaGJvcnM6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm5cInVuZGlyZWN0ZWRcIiE9PXRoaXMudHlwZSYmZSBpbiBuLmlufHxcImRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJmUgaW4gbi51bmRpcmVjdGVkfSxpLmFyZU91dGJvdW5kTmVpZ2hib3JzPWZ1bmN0aW9uKHQsZSl7dD1cIlwiK3QsZT1cIlwiK2U7dmFyIG49dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFuKXRocm93IG5ldyBJKCdHcmFwaC5hcmVPdXRib3VuZE5laWdoYm9yczogY291bGQgbm90IGZpbmQgdGhlIFwiJy5jb25jYXQodCwnXCIgbm9kZSBpbiB0aGUgZ3JhcGguJykpO3JldHVyblwidW5kaXJlY3RlZFwiIT09dGhpcy50eXBlJiZlIGluIG4ub3V0fHxcImRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJmUgaW4gbi51bmRpcmVjdGVkfSxpLmluRGVncmVlPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlPXRoaXMuX25vZGVzLmdldCh0KTtpZighZSl0aHJvdyBuZXcgSSgnR3JhcGguaW5EZWdyZWU6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm5cInVuZGlyZWN0ZWRcIj09PXRoaXMudHlwZT8wOmUuaW5EZWdyZWV9LGkub3V0RGVncmVlPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlPXRoaXMuX25vZGVzLmdldCh0KTtpZighZSl0aHJvdyBuZXcgSSgnR3JhcGgub3V0RGVncmVlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuXCJ1bmRpcmVjdGVkXCI9PT10aGlzLnR5cGU/MDplLm91dERlZ3JlZX0saS5kaXJlY3RlZERlZ3JlZT1mdW5jdGlvbih0KXt0PVwiXCIrdDt2YXIgZT10aGlzLl9ub2Rlcy5nZXQodCk7aWYoIWUpdGhyb3cgbmV3IEkoJ0dyYXBoLmRpcmVjdGVkRGVncmVlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuXCJ1bmRpcmVjdGVkXCI9PT10aGlzLnR5cGU/MDplLmluRGVncmVlK2Uub3V0RGVncmVlfSxpLnVuZGlyZWN0ZWREZWdyZWU9ZnVuY3Rpb24odCl7dD1cIlwiK3Q7dmFyIGU9dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFlKXRocm93IG5ldyBJKCdHcmFwaC51bmRpcmVjdGVkRGVncmVlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuXCJkaXJlY3RlZFwiPT09dGhpcy50eXBlPzA6ZS51bmRpcmVjdGVkRGVncmVlfSxpLmluYm91bmREZWdyZWU9ZnVuY3Rpb24odCl7dD1cIlwiK3Q7dmFyIGU9dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFlKXRocm93IG5ldyBJKCdHcmFwaC5pbmJvdW5kRGVncmVlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7dmFyIG49MDtyZXR1cm5cImRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJihuKz1lLnVuZGlyZWN0ZWREZWdyZWUpLFwidW5kaXJlY3RlZFwiIT09dGhpcy50eXBlJiYobis9ZS5pbkRlZ3JlZSksbn0saS5vdXRib3VuZERlZ3JlZT1mdW5jdGlvbih0KXt0PVwiXCIrdDt2YXIgZT10aGlzLl9ub2Rlcy5nZXQodCk7aWYoIWUpdGhyb3cgbmV3IEkoJ0dyYXBoLm91dGJvdW5kRGVncmVlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7dmFyIG49MDtyZXR1cm5cImRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJihuKz1lLnVuZGlyZWN0ZWREZWdyZWUpLFwidW5kaXJlY3RlZFwiIT09dGhpcy50eXBlJiYobis9ZS5vdXREZWdyZWUpLG59LGkuZGVncmVlPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlPXRoaXMuX25vZGVzLmdldCh0KTtpZighZSl0aHJvdyBuZXcgSSgnR3JhcGguZGVncmVlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7dmFyIG49MDtyZXR1cm5cImRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJihuKz1lLnVuZGlyZWN0ZWREZWdyZWUpLFwidW5kaXJlY3RlZFwiIT09dGhpcy50eXBlJiYobis9ZS5pbkRlZ3JlZStlLm91dERlZ3JlZSksbn0saS5pbkRlZ3JlZVdpdGhvdXRTZWxmTG9vcHM9ZnVuY3Rpb24odCl7dD1cIlwiK3Q7dmFyIGU9dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFlKXRocm93IG5ldyBJKCdHcmFwaC5pbkRlZ3JlZVdpdGhvdXRTZWxmTG9vcHM6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtpZihcInVuZGlyZWN0ZWRcIj09PXRoaXMudHlwZSlyZXR1cm4gMDt2YXIgbj1lLmluW3RdLHI9bj90aGlzLm11bHRpP24uc2l6ZToxOjA7cmV0dXJuIGUuaW5EZWdyZWUtcn0saS5vdXREZWdyZWVXaXRob3V0U2VsZkxvb3BzPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlPXRoaXMuX25vZGVzLmdldCh0KTtpZighZSl0aHJvdyBuZXcgSSgnR3JhcGgub3V0RGVncmVlV2l0aG91dFNlbGZMb29wczogY291bGQgbm90IGZpbmQgdGhlIFwiJy5jb25jYXQodCwnXCIgbm9kZSBpbiB0aGUgZ3JhcGguJykpO2lmKFwidW5kaXJlY3RlZFwiPT09dGhpcy50eXBlKXJldHVybiAwO3ZhciBuPWUub3V0W3RdLHI9bj90aGlzLm11bHRpP24uc2l6ZToxOjA7cmV0dXJuIGUub3V0RGVncmVlLXJ9LGkuZGlyZWN0ZWREZWdyZWVXaXRob3V0U2VsZkxvb3BzPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlPXRoaXMuX25vZGVzLmdldCh0KTtpZighZSl0aHJvdyBuZXcgSSgnR3JhcGguZGlyZWN0ZWREZWdyZWVXaXRob3V0U2VsZkxvb3BzOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7aWYoXCJ1bmRpcmVjdGVkXCI9PT10aGlzLnR5cGUpcmV0dXJuIDA7dmFyIG49ZS5vdXRbdF0scj1uP3RoaXMubXVsdGk/bi5zaXplOjE6MDtyZXR1cm4gZS5pbkRlZ3JlZStlLm91dERlZ3JlZS0yKnJ9LGkudW5kaXJlY3RlZERlZ3JlZVdpdGhvdXRTZWxmTG9vcHM9ZnVuY3Rpb24odCl7dD1cIlwiK3Q7dmFyIGU9dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFlKXRocm93IG5ldyBJKCdHcmFwaC51bmRpcmVjdGVkRGVncmVlV2l0aG91dFNlbGZMb29wczogY291bGQgbm90IGZpbmQgdGhlIFwiJy5jb25jYXQodCwnXCIgbm9kZSBpbiB0aGUgZ3JhcGguJykpO2lmKFwiZGlyZWN0ZWRcIj09PXRoaXMudHlwZSlyZXR1cm4gMDt2YXIgbj1lLnVuZGlyZWN0ZWRbdF0scj1uP3RoaXMubXVsdGk/bi5zaXplOjE6MDtyZXR1cm4gZS51bmRpcmVjdGVkRGVncmVlLTIqcn0saS5pbmJvdW5kRGVncmVlV2l0aG91dFNlbGZMb29wcz1mdW5jdGlvbih0KXt0PVwiXCIrdDt2YXIgZSxuPXRoaXMuX25vZGVzLmdldCh0KTtpZighbil0aHJvdyBuZXcgSSgnR3JhcGguaW5ib3VuZERlZ3JlZVdpdGhvdXRTZWxmTG9vcHM6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTt2YXIgcj0wLGk9MDtyZXR1cm5cImRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJihyKz1uLnVuZGlyZWN0ZWREZWdyZWUsaSs9MiooKGU9bi51bmRpcmVjdGVkW3RdKT90aGlzLm11bHRpP2Uuc2l6ZToxOjApKSxcInVuZGlyZWN0ZWRcIiE9PXRoaXMudHlwZSYmKHIrPW4uaW5EZWdyZWUsaSs9KGU9bi5vdXRbdF0pP3RoaXMubXVsdGk/ZS5zaXplOjE6MCksci1pfSxpLm91dGJvdW5kRGVncmVlV2l0aG91dFNlbGZMb29wcz1mdW5jdGlvbih0KXt0PVwiXCIrdDt2YXIgZSxuPXRoaXMuX25vZGVzLmdldCh0KTtpZighbil0aHJvdyBuZXcgSSgnR3JhcGgub3V0Ym91bmREZWdyZWVXaXRob3V0U2VsZkxvb3BzOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7dmFyIHI9MCxpPTA7cmV0dXJuXCJkaXJlY3RlZFwiIT09dGhpcy50eXBlJiYocis9bi51bmRpcmVjdGVkRGVncmVlLGkrPTIqKChlPW4udW5kaXJlY3RlZFt0XSk/dGhpcy5tdWx0aT9lLnNpemU6MTowKSksXCJ1bmRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJihyKz1uLm91dERlZ3JlZSxpKz0oZT1uLmluW3RdKT90aGlzLm11bHRpP2Uuc2l6ZToxOjApLHItaX0saS5kZWdyZWVXaXRob3V0U2VsZkxvb3BzPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlLG49dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCFuKXRocm93IG5ldyBJKCdHcmFwaC5kZWdyZWVXaXRob3V0U2VsZkxvb3BzOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7dmFyIHI9MCxpPTA7cmV0dXJuXCJkaXJlY3RlZFwiIT09dGhpcy50eXBlJiYocis9bi51bmRpcmVjdGVkRGVncmVlLGkrPTIqKChlPW4udW5kaXJlY3RlZFt0XSk/dGhpcy5tdWx0aT9lLnNpemU6MTowKSksXCJ1bmRpcmVjdGVkXCIhPT10aGlzLnR5cGUmJihyKz1uLmluRGVncmVlK24ub3V0RGVncmVlLGkrPTIqKChlPW4ub3V0W3RdKT90aGlzLm11bHRpP2Uuc2l6ZToxOjApKSxyLWl9LGkuc291cmNlPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlPXRoaXMuX2VkZ2VzLmdldCh0KTtpZighZSl0aHJvdyBuZXcgSSgnR3JhcGguc291cmNlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuIGUuc291cmNlLmtleX0saS50YXJnZXQ9ZnVuY3Rpb24odCl7dD1cIlwiK3Q7dmFyIGU9dGhpcy5fZWRnZXMuZ2V0KHQpO2lmKCFlKXRocm93IG5ldyBJKCdHcmFwaC50YXJnZXQ6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gZS50YXJnZXQua2V5fSxpLmV4dHJlbWl0aWVzPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlPXRoaXMuX2VkZ2VzLmdldCh0KTtpZighZSl0aHJvdyBuZXcgSSgnR3JhcGguZXh0cmVtaXRpZXM6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm5bZS5zb3VyY2Uua2V5LGUudGFyZ2V0LmtleV19LGkub3Bwb3NpdGU9ZnVuY3Rpb24odCxlKXt0PVwiXCIrdCxlPVwiXCIrZTt2YXIgbj10aGlzLl9lZGdlcy5nZXQoZSk7aWYoIW4pdGhyb3cgbmV3IEkoJ0dyYXBoLm9wcG9zaXRlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdChlLCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSk7dmFyIHI9bi5zb3VyY2Uua2V5LGk9bi50YXJnZXQua2V5O2lmKHQ9PT1yKXJldHVybiBpO2lmKHQ9PT1pKXJldHVybiByO3Rocm93IG5ldyBJKCdHcmFwaC5vcHBvc2l0ZTogdGhlIFwiJy5jb25jYXQodCwnXCIgbm9kZSBpcyBub3QgYXR0YWNoZWQgdG8gdGhlIFwiJykuY29uY2F0KGUsJ1wiIGVkZ2UgKCcpLmNvbmNhdChyLFwiLCBcIikuY29uY2F0KGksXCIpLlwiKSl9LGkuaGFzRXh0cmVtaXR5PWZ1bmN0aW9uKHQsZSl7dD1cIlwiK3QsZT1cIlwiK2U7dmFyIG49dGhpcy5fZWRnZXMuZ2V0KHQpO2lmKCFuKXRocm93IG5ldyBJKCdHcmFwaC5oYXNFeHRyZW1pdHk6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gbi5zb3VyY2Uua2V5PT09ZXx8bi50YXJnZXQua2V5PT09ZX0saS5pc1VuZGlyZWN0ZWQ9ZnVuY3Rpb24odCl7dD1cIlwiK3Q7dmFyIGU9dGhpcy5fZWRnZXMuZ2V0KHQpO2lmKCFlKXRocm93IG5ldyBJKCdHcmFwaC5pc1VuZGlyZWN0ZWQ6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gZS51bmRpcmVjdGVkfSxpLmlzRGlyZWN0ZWQ9ZnVuY3Rpb24odCl7dD1cIlwiK3Q7dmFyIGU9dGhpcy5fZWRnZXMuZ2V0KHQpO2lmKCFlKXRocm93IG5ldyBJKCdHcmFwaC5pc0RpcmVjdGVkOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdCh0LCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuIWUudW5kaXJlY3RlZH0saS5pc1NlbGZMb29wPWZ1bmN0aW9uKHQpe3Q9XCJcIit0O3ZhciBlPXRoaXMuX2VkZ2VzLmdldCh0KTtpZighZSl0aHJvdyBuZXcgSSgnR3JhcGguaXNTZWxmTG9vcDogY291bGQgbm90IGZpbmQgdGhlIFwiJy5jb25jYXQodCwnXCIgZWRnZSBpbiB0aGUgZ3JhcGguJykpO3JldHVybiBlLnNvdXJjZT09PWUudGFyZ2V0fSxpLmFkZE5vZGU9ZnVuY3Rpb24odCxlKXt2YXIgbj1mdW5jdGlvbih0LGUsbil7aWYobiYmIWgobikpdGhyb3cgbmV3IEYoJ0dyYXBoLmFkZE5vZGU6IGludmFsaWQgYXR0cmlidXRlcy4gRXhwZWN0aW5nIGFuIG9iamVjdCBidXQgZ290IFwiJy5jb25jYXQobiwnXCInKSk7aWYoZT1cIlwiK2Usbj1ufHx7fSx0Ll9ub2Rlcy5oYXMoZSkpdGhyb3cgbmV3IFkoJ0dyYXBoLmFkZE5vZGU6IHRoZSBcIicuY29uY2F0KGUsJ1wiIG5vZGUgYWxyZWFkeSBleGlzdCBpbiB0aGUgZ3JhcGguJykpO3ZhciByPW5ldyB0Lk5vZGVEYXRhQ2xhc3MoZSxuKTtyZXR1cm4gdC5fbm9kZXMuc2V0KGUsciksdC5lbWl0KFwibm9kZUFkZGVkXCIse2tleTplLGF0dHJpYnV0ZXM6bn0pLHJ9KHRoaXMsdCxlKTtyZXR1cm4gbi5rZXl9LGkubWVyZ2VOb2RlPWZ1bmN0aW9uKHQsZSl7aWYoZSYmIWgoZSkpdGhyb3cgbmV3IEYoJ0dyYXBoLm1lcmdlTm9kZTogaW52YWxpZCBhdHRyaWJ1dGVzLiBFeHBlY3RpbmcgYW4gb2JqZWN0IGJ1dCBnb3QgXCInLmNvbmNhdChlLCdcIicpKTt0PVwiXCIrdCxlPWV8fHt9O3ZhciBuPXRoaXMuX25vZGVzLmdldCh0KTtyZXR1cm4gbj8oZSYmKGMobi5hdHRyaWJ1dGVzLGUpLHRoaXMuZW1pdChcIm5vZGVBdHRyaWJ1dGVzVXBkYXRlZFwiLHt0eXBlOlwibWVyZ2VcIixrZXk6dCxhdHRyaWJ1dGVzOm4uYXR0cmlidXRlcyxkYXRhOmV9KSksW3QsITFdKToobj1uZXcgdGhpcy5Ob2RlRGF0YUNsYXNzKHQsZSksdGhpcy5fbm9kZXMuc2V0KHQsbiksdGhpcy5lbWl0KFwibm9kZUFkZGVkXCIse2tleTp0LGF0dHJpYnV0ZXM6ZX0pLFt0LCEwXSl9LGkudXBkYXRlTm9kZT1mdW5jdGlvbih0LGUpe2lmKGUmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGUpdGhyb3cgbmV3IEYoJ0dyYXBoLnVwZGF0ZU5vZGU6IGludmFsaWQgdXBkYXRlciBmdW5jdGlvbi4gRXhwZWN0aW5nIGEgZnVuY3Rpb24gYnV0IGdvdCBcIicuY29uY2F0KGUsJ1wiJykpO3Q9XCJcIit0O3ZhciBuPXRoaXMuX25vZGVzLmdldCh0KTtpZihuKXtpZihlKXt2YXIgcj1uLmF0dHJpYnV0ZXM7bi5hdHRyaWJ1dGVzPWUociksdGhpcy5lbWl0KFwibm9kZUF0dHJpYnV0ZXNVcGRhdGVkXCIse3R5cGU6XCJyZXBsYWNlXCIsa2V5OnQsYXR0cmlidXRlczpuLmF0dHJpYnV0ZXN9KX1yZXR1cm5bdCwhMV19dmFyIGk9ZT9lKHt9KTp7fTtyZXR1cm4gbj1uZXcgdGhpcy5Ob2RlRGF0YUNsYXNzKHQsaSksdGhpcy5fbm9kZXMuc2V0KHQsbiksdGhpcy5lbWl0KFwibm9kZUFkZGVkXCIse2tleTp0LGF0dHJpYnV0ZXM6aX0pLFt0LCEwXX0saS5kcm9wTm9kZT1mdW5jdGlvbih0KXt0PVwiXCIrdDt2YXIgZSxuPXRoaXMuX25vZGVzLmdldCh0KTtpZighbil0aHJvdyBuZXcgSSgnR3JhcGguZHJvcE5vZGU6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtpZihcInVuZGlyZWN0ZWRcIiE9PXRoaXMudHlwZSl7Zm9yKHZhciByIGluIG4ub3V0KXtlPW4ub3V0W3JdO2Rve010KHRoaXMsZSksZT1lLm5leHR9d2hpbGUoZSl9Zm9yKHZhciBpIGluIG4uaW4pe2U9bi5pbltpXTtkb3tNdCh0aGlzLGUpLGU9ZS5uZXh0fXdoaWxlKGUpfX1pZihcImRpcmVjdGVkXCIhPT10aGlzLnR5cGUpZm9yKHZhciBvIGluIG4udW5kaXJlY3RlZCl7ZT1uLnVuZGlyZWN0ZWRbb107ZG97TXQodGhpcyxlKSxlPWUubmV4dH13aGlsZShlKX10aGlzLl9ub2Rlcy5kZWxldGUodCksdGhpcy5lbWl0KFwibm9kZURyb3BwZWRcIix7a2V5OnQsYXR0cmlidXRlczpuLmF0dHJpYnV0ZXN9KX0saS5kcm9wRWRnZT1mdW5jdGlvbih0KXt2YXIgZTtpZihhcmd1bWVudHMubGVuZ3RoPjEpe3ZhciBuPVwiXCIrYXJndW1lbnRzWzBdLHI9XCJcIithcmd1bWVudHNbMV07aWYoIShlPXModGhpcyxuLHIsdGhpcy50eXBlKSkpdGhyb3cgbmV3IEkoJ0dyYXBoLmRyb3BFZGdlOiBjb3VsZCBub3QgZmluZCB0aGUgXCInLmNvbmNhdChuLCdcIiAtPiBcIicpLmNvbmNhdChyLCdcIiBlZGdlIGluIHRoZSBncmFwaC4nKSl9ZWxzZSBpZih0PVwiXCIrdCwhKGU9dGhpcy5fZWRnZXMuZ2V0KHQpKSl0aHJvdyBuZXcgSSgnR3JhcGguZHJvcEVkZ2U6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicuY29uY2F0KHQsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gTXQodGhpcyxlKSx0aGlzfSxpLmRyb3BEaXJlY3RlZEVkZ2U9ZnVuY3Rpb24odCxlKXtpZihhcmd1bWVudHMubGVuZ3RoPDIpdGhyb3cgbmV3IFkoXCJHcmFwaC5kcm9wRGlyZWN0ZWRFZGdlOiBpdCBkb2VzIG5vdCBtYWtlIHNlbnNlIHRvIHRyeSBhbmQgZHJvcCBhIGRpcmVjdGVkIGVkZ2UgYnkga2V5LiBXaGF0IGlmIHRoZSBlZGdlIHdpdGggdGhpcyBrZXkgaXMgdW5kaXJlY3RlZD8gVXNlICMuZHJvcEVkZ2UgZm9yIHRoaXMgcHVycG9zZSBpbnN0ZWFkLlwiKTtpZih0aGlzLm11bHRpKXRocm93IG5ldyBZKFwiR3JhcGguZHJvcERpcmVjdGVkRWRnZTogY2Fubm90IHVzZSBhIHtzb3VyY2UsdGFyZ2V0fSBjb21ibyB3aGVuIGRyb3BwaW5nIGFuIGVkZ2UgaW4gYSBNdWx0aUdyYXBoIHNpbmNlIHdlIGNhbm5vdCBpbmZlciB0aGUgb25lIHlvdSB3YW50IHRvIGRlbGV0ZSBhcyB0aGVyZSBjb3VsZCBiZSBtdWx0aXBsZSBvbmVzLlwiKTt2YXIgbj1zKHRoaXMsdD1cIlwiK3QsZT1cIlwiK2UsXCJkaXJlY3RlZFwiKTtpZighbil0aHJvdyBuZXcgSSgnR3JhcGguZHJvcERpcmVjdGVkRWRnZTogY291bGQgbm90IGZpbmQgYSBcIicuY29uY2F0KHQsJ1wiIC0+IFwiJykuY29uY2F0KGUsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gTXQodGhpcyxuKSx0aGlzfSxpLmRyb3BVbmRpcmVjdGVkRWRnZT1mdW5jdGlvbih0LGUpe2lmKGFyZ3VtZW50cy5sZW5ndGg8Mil0aHJvdyBuZXcgWShcIkdyYXBoLmRyb3BVbmRpcmVjdGVkRWRnZTogaXQgZG9lcyBub3QgbWFrZSBzZW5zZSB0byBkcm9wIGEgZGlyZWN0ZWQgZWRnZSBieSBrZXkuIFdoYXQgaWYgdGhlIGVkZ2Ugd2l0aCB0aGlzIGtleSBpcyB1bmRpcmVjdGVkPyBVc2UgIy5kcm9wRWRnZSBmb3IgdGhpcyBwdXJwb3NlIGluc3RlYWQuXCIpO2lmKHRoaXMubXVsdGkpdGhyb3cgbmV3IFkoXCJHcmFwaC5kcm9wVW5kaXJlY3RlZEVkZ2U6IGNhbm5vdCB1c2UgYSB7c291cmNlLHRhcmdldH0gY29tYm8gd2hlbiBkcm9wcGluZyBhbiBlZGdlIGluIGEgTXVsdGlHcmFwaCBzaW5jZSB3ZSBjYW5ub3QgaW5mZXIgdGhlIG9uZSB5b3Ugd2FudCB0byBkZWxldGUgYXMgdGhlcmUgY291bGQgYmUgbXVsdGlwbGUgb25lcy5cIik7dmFyIG49cyh0aGlzLHQsZSxcInVuZGlyZWN0ZWRcIik7aWYoIW4pdGhyb3cgbmV3IEkoJ0dyYXBoLmRyb3BVbmRpcmVjdGVkRWRnZTogY291bGQgbm90IGZpbmQgYSBcIicuY29uY2F0KHQsJ1wiIC0+IFwiJykuY29uY2F0KGUsJ1wiIGVkZ2UgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gTXQodGhpcyxuKSx0aGlzfSxpLmNsZWFyPWZ1bmN0aW9uKCl7dGhpcy5fZWRnZXMuY2xlYXIoKSx0aGlzLl9ub2Rlcy5jbGVhcigpLHRoaXMuX3Jlc2V0SW5zdGFuY2VDb3VudGVycygpLHRoaXMuZW1pdChcImNsZWFyZWRcIil9LGkuY2xlYXJFZGdlcz1mdW5jdGlvbigpe2Zvcih2YXIgdCxlPXRoaXMuX25vZGVzLnZhbHVlcygpOyEwIT09KHQ9ZS5uZXh0KCkpLmRvbmU7KXQudmFsdWUuY2xlYXIoKTt0aGlzLl9lZGdlcy5jbGVhcigpLHRoaXMuX3Jlc2V0SW5zdGFuY2VDb3VudGVycygpLHRoaXMuZW1pdChcImVkZ2VzQ2xlYXJlZFwiKX0saS5nZXRBdHRyaWJ1dGU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXNbdF19LGkuZ2V0QXR0cmlidXRlcz1mdW5jdGlvbigpe3JldHVybiB0aGlzLl9hdHRyaWJ1dGVzfSxpLmhhc0F0dHJpYnV0ZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eSh0KX0saS5zZXRBdHRyaWJ1dGU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5fYXR0cmlidXRlc1t0XT1lLHRoaXMuZW1pdChcImF0dHJpYnV0ZXNVcGRhdGVkXCIse3R5cGU6XCJzZXRcIixhdHRyaWJ1dGVzOnRoaXMuX2F0dHJpYnV0ZXMsbmFtZTp0fSksdGhpc30saS51cGRhdGVBdHRyaWJ1dGU9ZnVuY3Rpb24odCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlKXRocm93IG5ldyBGKFwiR3JhcGgudXBkYXRlQXR0cmlidXRlOiB1cGRhdGVyIHNob3VsZCBiZSBhIGZ1bmN0aW9uLlwiKTt2YXIgbj10aGlzLl9hdHRyaWJ1dGVzW3RdO3JldHVybiB0aGlzLl9hdHRyaWJ1dGVzW3RdPWUobiksdGhpcy5lbWl0KFwiYXR0cmlidXRlc1VwZGF0ZWRcIix7dHlwZTpcInNldFwiLGF0dHJpYnV0ZXM6dGhpcy5fYXR0cmlidXRlcyxuYW1lOnR9KSx0aGlzfSxpLnJlbW92ZUF0dHJpYnV0ZT1mdW5jdGlvbih0KXtyZXR1cm4gZGVsZXRlIHRoaXMuX2F0dHJpYnV0ZXNbdF0sdGhpcy5lbWl0KFwiYXR0cmlidXRlc1VwZGF0ZWRcIix7dHlwZTpcInJlbW92ZVwiLGF0dHJpYnV0ZXM6dGhpcy5fYXR0cmlidXRlcyxuYW1lOnR9KSx0aGlzfSxpLnJlcGxhY2VBdHRyaWJ1dGVzPWZ1bmN0aW9uKHQpe2lmKCFoKHQpKXRocm93IG5ldyBGKFwiR3JhcGgucmVwbGFjZUF0dHJpYnV0ZXM6IHByb3ZpZGVkIGF0dHJpYnV0ZXMgYXJlIG5vdCBhIHBsYWluIG9iamVjdC5cIik7cmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM9dCx0aGlzLmVtaXQoXCJhdHRyaWJ1dGVzVXBkYXRlZFwiLHt0eXBlOlwicmVwbGFjZVwiLGF0dHJpYnV0ZXM6dGhpcy5fYXR0cmlidXRlc30pLHRoaXN9LGkubWVyZ2VBdHRyaWJ1dGVzPWZ1bmN0aW9uKHQpe2lmKCFoKHQpKXRocm93IG5ldyBGKFwiR3JhcGgubWVyZ2VBdHRyaWJ1dGVzOiBwcm92aWRlZCBhdHRyaWJ1dGVzIGFyZSBub3QgYSBwbGFpbiBvYmplY3QuXCIpO3JldHVybiBjKHRoaXMuX2F0dHJpYnV0ZXMsdCksdGhpcy5lbWl0KFwiYXR0cmlidXRlc1VwZGF0ZWRcIix7dHlwZTpcIm1lcmdlXCIsYXR0cmlidXRlczp0aGlzLl9hdHRyaWJ1dGVzLGRhdGE6dH0pLHRoaXN9LGkudXBkYXRlQXR0cmlidXRlcz1mdW5jdGlvbih0KXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXRocm93IG5ldyBGKFwiR3JhcGgudXBkYXRlQXR0cmlidXRlczogcHJvdmlkZWQgdXBkYXRlciBpcyBub3QgYSBmdW5jdGlvbi5cIik7cmV0dXJuIHRoaXMuX2F0dHJpYnV0ZXM9dCh0aGlzLl9hdHRyaWJ1dGVzKSx0aGlzLmVtaXQoXCJhdHRyaWJ1dGVzVXBkYXRlZFwiLHt0eXBlOlwidXBkYXRlXCIsYXR0cmlidXRlczp0aGlzLl9hdHRyaWJ1dGVzfSksdGhpc30saS51cGRhdGVFYWNoTm9kZUF0dHJpYnV0ZXM9ZnVuY3Rpb24odCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXRocm93IG5ldyBGKFwiR3JhcGgudXBkYXRlRWFjaE5vZGVBdHRyaWJ1dGVzOiBleHBlY3RpbmcgYW4gdXBkYXRlciBmdW5jdGlvbi5cIik7aWYoZSYmIWcoZSkpdGhyb3cgbmV3IEYoXCJHcmFwaC51cGRhdGVFYWNoTm9kZUF0dHJpYnV0ZXM6IGludmFsaWQgaGludHMuIEV4cGVjdGluZyBhbiBvYmplY3QgaGF2aW5nIHRoZSBmb2xsb3dpbmcgc2hhcGU6IHthdHRyaWJ1dGVzPzogW3N0cmluZ119XCIpO2Zvcih2YXIgbixyLGk9dGhpcy5fbm9kZXMudmFsdWVzKCk7ITAhPT0obj1pLm5leHQoKSkuZG9uZTspKHI9bi52YWx1ZSkuYXR0cmlidXRlcz10KHIua2V5LHIuYXR0cmlidXRlcyk7dGhpcy5lbWl0KFwiZWFjaE5vZGVBdHRyaWJ1dGVzVXBkYXRlZFwiLHtoaW50czplfHxudWxsfSl9LGkudXBkYXRlRWFjaEVkZ2VBdHRyaWJ1dGVzPWZ1bmN0aW9uKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdCl0aHJvdyBuZXcgRihcIkdyYXBoLnVwZGF0ZUVhY2hFZGdlQXR0cmlidXRlczogZXhwZWN0aW5nIGFuIHVwZGF0ZXIgZnVuY3Rpb24uXCIpO2lmKGUmJiFnKGUpKXRocm93IG5ldyBGKFwiR3JhcGgudXBkYXRlRWFjaEVkZ2VBdHRyaWJ1dGVzOiBpbnZhbGlkIGhpbnRzLiBFeHBlY3RpbmcgYW4gb2JqZWN0IGhhdmluZyB0aGUgZm9sbG93aW5nIHNoYXBlOiB7YXR0cmlidXRlcz86IFtzdHJpbmddfVwiKTtmb3IodmFyIG4scixpLG8sYT10aGlzLl9lZGdlcy52YWx1ZXMoKTshMCE9PShuPWEubmV4dCgpKS5kb25lOylpPShyPW4udmFsdWUpLnNvdXJjZSxvPXIudGFyZ2V0LHIuYXR0cmlidXRlcz10KHIua2V5LHIuYXR0cmlidXRlcyxpLmtleSxvLmtleSxpLmF0dHJpYnV0ZXMsby5hdHRyaWJ1dGVzLHIudW5kaXJlY3RlZCk7dGhpcy5lbWl0KFwiZWFjaEVkZ2VBdHRyaWJ1dGVzVXBkYXRlZFwiLHtoaW50czplfHxudWxsfSl9LGkuZm9yRWFjaEFkamFjZW5jeUVudHJ5PWZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgbmV3IEYoXCJHcmFwaC5mb3JFYWNoQWRqYWNlbmN5RW50cnk6IGV4cGVjdGluZyBhIGNhbGxiYWNrLlwiKTtFdCghMSwhMSwhMSx0aGlzLHQpfSxpLmZvckVhY2hBZGphY2VuY3lFbnRyeVdpdGhPcnBoYW5zPWZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgbmV3IEYoXCJHcmFwaC5mb3JFYWNoQWRqYWNlbmN5RW50cnlXaXRoT3JwaGFuczogZXhwZWN0aW5nIGEgY2FsbGJhY2suXCIpO0V0KCExLCExLCEwLHRoaXMsdCl9LGkuZm9yRWFjaEFzc3ltZXRyaWNBZGphY2VuY3lFbnRyeT1mdW5jdGlvbih0KXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXRocm93IG5ldyBGKFwiR3JhcGguZm9yRWFjaEFzc3ltZXRyaWNBZGphY2VuY3lFbnRyeTogZXhwZWN0aW5nIGEgY2FsbGJhY2suXCIpO0V0KCExLCEwLCExLHRoaXMsdCl9LGkuZm9yRWFjaEFzc3ltZXRyaWNBZGphY2VuY3lFbnRyeVdpdGhPcnBoYW5zPWZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgbmV3IEYoXCJHcmFwaC5mb3JFYWNoQXNzeW1ldHJpY0FkamFjZW5jeUVudHJ5V2l0aE9ycGhhbnM6IGV4cGVjdGluZyBhIGNhbGxiYWNrLlwiKTtFdCghMSwhMCwhMCx0aGlzLHQpfSxpLm5vZGVzPWZ1bmN0aW9uKCl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgQXJyYXkuZnJvbT9BcnJheS5mcm9tKHRoaXMuX25vZGVzLmtleXMoKSk6VCh0aGlzLl9ub2Rlcy5rZXlzKCksdGhpcy5fbm9kZXMuc2l6ZSl9LGkuZm9yRWFjaE5vZGU9ZnVuY3Rpb24odCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdCl0aHJvdyBuZXcgRihcIkdyYXBoLmZvckVhY2hOb2RlOiBleHBlY3RpbmcgYSBjYWxsYmFjay5cIik7Zm9yKHZhciBlLG4scj10aGlzLl9ub2Rlcy52YWx1ZXMoKTshMCE9PShlPXIubmV4dCgpKS5kb25lOyl0KChuPWUudmFsdWUpLmtleSxuLmF0dHJpYnV0ZXMpfSxpLmZpbmROb2RlPWZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgbmV3IEYoXCJHcmFwaC5maW5kTm9kZTogZXhwZWN0aW5nIGEgY2FsbGJhY2suXCIpO2Zvcih2YXIgZSxuLHI9dGhpcy5fbm9kZXMudmFsdWVzKCk7ITAhPT0oZT1yLm5leHQoKSkuZG9uZTspaWYodCgobj1lLnZhbHVlKS5rZXksbi5hdHRyaWJ1dGVzKSlyZXR1cm4gbi5rZXl9LGkubWFwTm9kZXM9ZnVuY3Rpb24odCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdCl0aHJvdyBuZXcgRihcIkdyYXBoLm1hcE5vZGU6IGV4cGVjdGluZyBhIGNhbGxiYWNrLlwiKTtmb3IodmFyIGUsbixyPXRoaXMuX25vZGVzLnZhbHVlcygpLGk9bmV3IEFycmF5KHRoaXMub3JkZXIpLG89MDshMCE9PShlPXIubmV4dCgpKS5kb25lOyluPWUudmFsdWUsaVtvKytdPXQobi5rZXksbi5hdHRyaWJ1dGVzKTtyZXR1cm4gaX0saS5zb21lTm9kZT1mdW5jdGlvbih0KXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXRocm93IG5ldyBGKFwiR3JhcGguc29tZU5vZGU6IGV4cGVjdGluZyBhIGNhbGxiYWNrLlwiKTtmb3IodmFyIGUsbixyPXRoaXMuX25vZGVzLnZhbHVlcygpOyEwIT09KGU9ci5uZXh0KCkpLmRvbmU7KWlmKHQoKG49ZS52YWx1ZSkua2V5LG4uYXR0cmlidXRlcykpcmV0dXJuITA7cmV0dXJuITF9LGkuZXZlcnlOb2RlPWZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgbmV3IEYoXCJHcmFwaC5ldmVyeU5vZGU6IGV4cGVjdGluZyBhIGNhbGxiYWNrLlwiKTtmb3IodmFyIGUsbixyPXRoaXMuX25vZGVzLnZhbHVlcygpOyEwIT09KGU9ci5uZXh0KCkpLmRvbmU7KWlmKCF0KChuPWUudmFsdWUpLmtleSxuLmF0dHJpYnV0ZXMpKXJldHVybiExO3JldHVybiEwfSxpLmZpbHRlck5vZGVzPWZ1bmN0aW9uKHQpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgbmV3IEYoXCJHcmFwaC5maWx0ZXJOb2RlczogZXhwZWN0aW5nIGEgY2FsbGJhY2suXCIpO2Zvcih2YXIgZSxuLHI9dGhpcy5fbm9kZXMudmFsdWVzKCksaT1bXTshMCE9PShlPXIubmV4dCgpKS5kb25lOyl0KChuPWUudmFsdWUpLmtleSxuLmF0dHJpYnV0ZXMpJiZpLnB1c2gobi5rZXkpO3JldHVybiBpfSxpLnJlZHVjZU5vZGVzPWZ1bmN0aW9uKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgdCl0aHJvdyBuZXcgRihcIkdyYXBoLnJlZHVjZU5vZGVzOiBleHBlY3RpbmcgYSBjYWxsYmFjay5cIik7aWYoYXJndW1lbnRzLmxlbmd0aDwyKXRocm93IG5ldyBGKFwiR3JhcGgucmVkdWNlTm9kZXM6IG1pc3NpbmcgaW5pdGlhbCB2YWx1ZS4gWW91IG11c3QgcHJvdmlkZSBpdCBiZWNhdXNlIHRoZSBjYWxsYmFjayB0YWtlcyBtb3JlIHRoYW4gb25lIGFyZ3VtZW50IGFuZCB3ZSBjYW5ub3QgaW5mZXIgdGhlIGluaXRpYWwgdmFsdWUgZnJvbSB0aGUgZmlyc3QgaXRlcmF0aW9uLCBhcyB5b3UgY291bGQgd2l0aCBhIHNpbXBsZSBhcnJheS5cIik7Zm9yKHZhciBuLHIsaT1lLG89dGhpcy5fbm9kZXMudmFsdWVzKCk7ITAhPT0obj1vLm5leHQoKSkuZG9uZTspaT10KGksKHI9bi52YWx1ZSkua2V5LHIuYXR0cmlidXRlcyk7cmV0dXJuIGl9LGkubm9kZUVudHJpZXM9ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9ub2Rlcy52YWx1ZXMoKTtyZXR1cm4gbmV3IE8oKGZ1bmN0aW9uKCl7dmFyIGU9dC5uZXh0KCk7aWYoZS5kb25lKXJldHVybiBlO3ZhciBuPWUudmFsdWU7cmV0dXJue3ZhbHVlOntub2RlOm4ua2V5LGF0dHJpYnV0ZXM6bi5hdHRyaWJ1dGVzfSxkb25lOiExfX0pKX0saS5leHBvcnQ9ZnVuY3Rpb24oKXt2YXIgdD1uZXcgQXJyYXkodGhpcy5fbm9kZXMuc2l6ZSksZT0wO3RoaXMuX25vZGVzLmZvckVhY2goKGZ1bmN0aW9uKG4scil7dFtlKytdPWZ1bmN0aW9uKHQsZSl7dmFyIG49e2tleTp0fTtyZXR1cm4gcChlLmF0dHJpYnV0ZXMpfHwobi5hdHRyaWJ1dGVzPWMoe30sZS5hdHRyaWJ1dGVzKSksbn0ocixuKX0pKTt2YXIgbj1uZXcgQXJyYXkodGhpcy5fZWRnZXMuc2l6ZSk7cmV0dXJuIGU9MCx0aGlzLl9lZGdlcy5mb3JFYWNoKChmdW5jdGlvbih0LHIpe25bZSsrXT1mdW5jdGlvbih0LGUpe3ZhciBuPXtrZXk6dCxzb3VyY2U6ZS5zb3VyY2Uua2V5LHRhcmdldDplLnRhcmdldC5rZXl9O3JldHVybiBwKGUuYXR0cmlidXRlcyl8fChuLmF0dHJpYnV0ZXM9Yyh7fSxlLmF0dHJpYnV0ZXMpKSxlLnVuZGlyZWN0ZWQmJihuLnVuZGlyZWN0ZWQ9ITApLG59KHIsdCl9KSkse29wdGlvbnM6e3R5cGU6dGhpcy50eXBlLG11bHRpOnRoaXMubXVsdGksYWxsb3dTZWxmTG9vcHM6dGhpcy5hbGxvd1NlbGZMb29wc30sYXR0cmlidXRlczp0aGlzLmdldEF0dHJpYnV0ZXMoKSxub2Rlczp0LGVkZ2VzOm59fSxpLmltcG9ydD1mdW5jdGlvbih0KXt2YXIgZSxuLHIsaSxvLGE9dGhpcyx1PWFyZ3VtZW50cy5sZW5ndGg+MSYmdm9pZCAwIT09YXJndW1lbnRzWzFdJiZhcmd1bWVudHNbMV07aWYoZCh0KSlyZXR1cm4gdC5mb3JFYWNoTm9kZSgoZnVuY3Rpb24odCxlKXt1P2EubWVyZ2VOb2RlKHQsZSk6YS5hZGROb2RlKHQsZSl9KSksdC5mb3JFYWNoRWRnZSgoZnVuY3Rpb24odCxlLG4scixpLG8sYyl7dT9jP2EubWVyZ2VVbmRpcmVjdGVkRWRnZVdpdGhLZXkodCxuLHIsZSk6YS5tZXJnZURpcmVjdGVkRWRnZVdpdGhLZXkodCxuLHIsZSk6Yz9hLmFkZFVuZGlyZWN0ZWRFZGdlV2l0aEtleSh0LG4scixlKTphLmFkZERpcmVjdGVkRWRnZVdpdGhLZXkodCxuLHIsZSl9KSksdGhpcztpZighaCh0KSl0aHJvdyBuZXcgRihcIkdyYXBoLmltcG9ydDogaW52YWxpZCBhcmd1bWVudC4gRXhwZWN0aW5nIGEgc2VyaWFsaXplZCBncmFwaCBvciwgYWx0ZXJuYXRpdmVseSwgYSBHcmFwaCBpbnN0YW5jZS5cIik7aWYodC5hdHRyaWJ1dGVzKXtpZighaCh0LmF0dHJpYnV0ZXMpKXRocm93IG5ldyBGKFwiR3JhcGguaW1wb3J0OiBpbnZhbGlkIGF0dHJpYnV0ZXMuIEV4cGVjdGluZyBhIHBsYWluIG9iamVjdC5cIik7dT90aGlzLm1lcmdlQXR0cmlidXRlcyh0LmF0dHJpYnV0ZXMpOnRoaXMucmVwbGFjZUF0dHJpYnV0ZXModC5hdHRyaWJ1dGVzKX1pZih0Lm5vZGVzKXtpZihyPXQubm9kZXMsIUFycmF5LmlzQXJyYXkocikpdGhyb3cgbmV3IEYoXCJHcmFwaC5pbXBvcnQ6IGludmFsaWQgbm9kZXMuIEV4cGVjdGluZyBhbiBhcnJheS5cIik7Zm9yKGU9MCxuPXIubGVuZ3RoO2U8bjtlKyspe0F0KGk9cltlXSk7dmFyIGM9aSxzPWMua2V5LHA9Yy5hdHRyaWJ1dGVzO3U/dGhpcy5tZXJnZU5vZGUocyxwKTp0aGlzLmFkZE5vZGUocyxwKX19aWYodC5lZGdlcyl7aWYocj10LmVkZ2VzLCFBcnJheS5pc0FycmF5KHIpKXRocm93IG5ldyBGKFwiR3JhcGguaW1wb3J0OiBpbnZhbGlkIGVkZ2VzLiBFeHBlY3RpbmcgYW4gYXJyYXkuXCIpO2ZvcihlPTAsbj1yLmxlbmd0aDtlPG47ZSsrKXtTdChvPXJbZV0pO3ZhciBmPW8sbD1mLnNvdXJjZSxnPWYudGFyZ2V0LHk9Zi5hdHRyaWJ1dGVzLHc9Zi51bmRpcmVjdGVkLHY9dm9pZCAwIT09dyYmdztcImtleVwiaW4gbz8odT92P3RoaXMubWVyZ2VVbmRpcmVjdGVkRWRnZVdpdGhLZXk6dGhpcy5tZXJnZURpcmVjdGVkRWRnZVdpdGhLZXk6dj90aGlzLmFkZFVuZGlyZWN0ZWRFZGdlV2l0aEtleTp0aGlzLmFkZERpcmVjdGVkRWRnZVdpdGhLZXkpLmNhbGwodGhpcyxvLmtleSxsLGcseSk6KHU/dj90aGlzLm1lcmdlVW5kaXJlY3RlZEVkZ2U6dGhpcy5tZXJnZURpcmVjdGVkRWRnZTp2P3RoaXMuYWRkVW5kaXJlY3RlZEVkZ2U6dGhpcy5hZGREaXJlY3RlZEVkZ2UpLmNhbGwodGhpcyxsLGcseSl9fXJldHVybiB0aGlzfSxpLm51bGxDb3B5PWZ1bmN0aW9uKHQpe3ZhciBlPW5ldyByKGMoe30sdGhpcy5fb3B0aW9ucyx0KSk7cmV0dXJuIGUucmVwbGFjZUF0dHJpYnV0ZXMoYyh7fSx0aGlzLmdldEF0dHJpYnV0ZXMoKSkpLGV9LGkuZW1wdHlDb3B5PWZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMubnVsbENvcHkodCk7cmV0dXJuIHRoaXMuX25vZGVzLmZvckVhY2goKGZ1bmN0aW9uKHQsbil7dmFyIHI9Yyh7fSx0LmF0dHJpYnV0ZXMpO3Q9bmV3IGUuTm9kZURhdGFDbGFzcyhuLHIpLGUuX25vZGVzLnNldChuLHQpfSkpLGV9LGkuY29weT1mdW5jdGlvbih0KXtpZihcInN0cmluZ1wiPT10eXBlb2YodD10fHx7fSkudHlwZSYmdC50eXBlIT09dGhpcy50eXBlJiZcIm1peGVkXCIhPT10LnR5cGUpdGhyb3cgbmV3IFkoJ0dyYXBoLmNvcHk6IGNhbm5vdCBjcmVhdGUgYW4gaW5jb21wYXRpYmxlIGNvcHkgZnJvbSBcIicuY29uY2F0KHRoaXMudHlwZSwnXCIgdHlwZSB0byBcIicpLmNvbmNhdCh0LnR5cGUsJ1wiIGJlY2F1c2UgdGhpcyB3b3VsZCBtZWFuIGxvc2luZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudCBncmFwaC4nKSk7aWYoXCJib29sZWFuXCI9PXR5cGVvZiB0Lm11bHRpJiZ0Lm11bHRpIT09dGhpcy5tdWx0aSYmITAhPT10Lm11bHRpKXRocm93IG5ldyBZKFwiR3JhcGguY29weTogY2Fubm90IGNyZWF0ZSBhbiBpbmNvbXBhdGlibGUgY29weSBieSBkb3duZ3JhZGluZyBhIG11bHRpIGdyYXBoIHRvIGEgc2ltcGxlIG9uZSBiZWNhdXNlIHRoaXMgd291bGQgbWVhbiBsb3NpbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIGN1cnJlbnQgZ3JhcGguXCIpO2lmKFwiYm9vbGVhblwiPT10eXBlb2YgdC5hbGxvd1NlbGZMb29wcyYmdC5hbGxvd1NlbGZMb29wcyE9PXRoaXMuYWxsb3dTZWxmTG9vcHMmJiEwIT09dC5hbGxvd1NlbGZMb29wcyl0aHJvdyBuZXcgWShcIkdyYXBoLmNvcHk6IGNhbm5vdCBjcmVhdGUgYW4gaW5jb21wYXRpYmxlIGNvcHkgZnJvbSBhIGdyYXBoIGFsbG93aW5nIHNlbGYgbG9vcHMgdG8gb25lIHRoYXQgZG9lcyBub3QgYmVjYXVzZSB0aGlzIHdvdWxkIG1lYW4gbG9zaW5nIGluZm9ybWF0aW9uIGFib3V0IHRoZSBjdXJyZW50IGdyYXBoLlwiKTtmb3IodmFyIGUsbixyPXRoaXMuZW1wdHlDb3B5KHQpLGk9dGhpcy5fZWRnZXMudmFsdWVzKCk7ITAhPT0oZT1pLm5leHQoKSkuZG9uZTspQ3QocixcImNvcHlcIiwhMSwobj1lLnZhbHVlKS51bmRpcmVjdGVkLG4ua2V5LG4uc291cmNlLmtleSxuLnRhcmdldC5rZXksYyh7fSxuLmF0dHJpYnV0ZXMpKTtyZXR1cm4gcn0saS50b0pTT049ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5leHBvcnQoKX0saS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVyblwiW29iamVjdCBHcmFwaF1cIn0saS5pbnNwZWN0PWZ1bmN0aW9uKCl7dmFyIGU9dGhpcyxuPXt9O3RoaXMuX25vZGVzLmZvckVhY2goKGZ1bmN0aW9uKHQsZSl7bltlXT10LmF0dHJpYnV0ZXN9KSk7dmFyIHI9e30saT17fTt0aGlzLl9lZGdlcy5mb3JFYWNoKChmdW5jdGlvbih0LG4pe3ZhciBvLGE9dC51bmRpcmVjdGVkP1wiLS1cIjpcIi0+XCIsdT1cIlwiLGM9dC5zb3VyY2Uua2V5LHM9dC50YXJnZXQua2V5O3QudW5kaXJlY3RlZCYmYz5zJiYobz1jLGM9cyxzPW8pO3ZhciBkPVwiKFwiLmNvbmNhdChjLFwiKVwiKS5jb25jYXQoYSxcIihcIikuY29uY2F0KHMsXCIpXCIpO24uc3RhcnRzV2l0aChcImdlaWRfXCIpP2UubXVsdGkmJih2b2lkIDA9PT1pW2RdP2lbZF09MDppW2RdKyssdSs9XCJcIi5jb25jYXQoaVtkXSxcIi4gXCIpKTp1Kz1cIltcIi5jb25jYXQobixcIl06IFwiKSxyW3UrPWRdPXQuYXR0cmlidXRlc30pKTt2YXIgbz17fTtmb3IodmFyIGEgaW4gdGhpcyl0aGlzLmhhc093blByb3BlcnR5KGEpJiYhTnQuaGFzKGEpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0aGlzW2FdJiZcInN5bWJvbFwiIT09dChhKSYmKG9bYV09dGhpc1thXSk7cmV0dXJuIG8uYXR0cmlidXRlcz10aGlzLl9hdHRyaWJ1dGVzLG8ubm9kZXM9bixvLmVkZ2VzPXIsZihvLFwiY29uc3RydWN0b3JcIix0aGlzLmNvbnN0cnVjdG9yKSxvfSxyfSh3LmV4cG9ydHMuRXZlbnRFbWl0dGVyKTtcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiYoV3QucHJvdG90eXBlW1N5bWJvbC5mb3IoXCJub2RlanMudXRpbC5pbnNwZWN0LmN1c3RvbVwiKV09V3QucHJvdG90eXBlLmluc3BlY3QpLFt7bmFtZTpmdW5jdGlvbih0KXtyZXR1cm5cIlwiLmNvbmNhdCh0LFwiRWRnZVwiKX0sZ2VuZXJhdGVLZXk6ITB9LHtuYW1lOmZ1bmN0aW9uKHQpe3JldHVyblwiXCIuY29uY2F0KHQsXCJEaXJlY3RlZEVkZ2VcIil9LGdlbmVyYXRlS2V5OiEwLHR5cGU6XCJkaXJlY3RlZFwifSx7bmFtZTpmdW5jdGlvbih0KXtyZXR1cm5cIlwiLmNvbmNhdCh0LFwiVW5kaXJlY3RlZEVkZ2VcIil9LGdlbmVyYXRlS2V5OiEwLHR5cGU6XCJ1bmRpcmVjdGVkXCJ9LHtuYW1lOmZ1bmN0aW9uKHQpe3JldHVyblwiXCIuY29uY2F0KHQsXCJFZGdlV2l0aEtleVwiKX19LHtuYW1lOmZ1bmN0aW9uKHQpe3JldHVyblwiXCIuY29uY2F0KHQsXCJEaXJlY3RlZEVkZ2VXaXRoS2V5XCIpfSx0eXBlOlwiZGlyZWN0ZWRcIn0se25hbWU6ZnVuY3Rpb24odCl7cmV0dXJuXCJcIi5jb25jYXQodCxcIlVuZGlyZWN0ZWRFZGdlV2l0aEtleVwiKX0sdHlwZTpcInVuZGlyZWN0ZWRcIn1dLmZvckVhY2goKGZ1bmN0aW9uKHQpe1tcImFkZFwiLFwibWVyZ2VcIixcInVwZGF0ZVwiXS5mb3JFYWNoKChmdW5jdGlvbihlKXt2YXIgbj10Lm5hbWUoZSkscj1cImFkZFwiPT09ZT9DdDp6dDt0LmdlbmVyYXRlS2V5P1d0LnByb3RvdHlwZVtuXT1mdW5jdGlvbihpLG8sYSl7cmV0dXJuIHIodGhpcyxuLCEwLFwidW5kaXJlY3RlZFwiPT09KHQudHlwZXx8dGhpcy50eXBlKSxudWxsLGksbyxhLFwidXBkYXRlXCI9PT1lKX06V3QucHJvdG90eXBlW25dPWZ1bmN0aW9uKGksbyxhLHUpe3JldHVybiByKHRoaXMsbiwhMSxcInVuZGlyZWN0ZWRcIj09PSh0LnR5cGV8fHRoaXMudHlwZSksaSxvLGEsdSxcInVwZGF0ZVwiPT09ZSl9fSkpfSkpLGZ1bmN0aW9uKHQpe1guZm9yRWFjaCgoZnVuY3Rpb24oZSl7dmFyIG49ZS5uYW1lLHI9ZS5hdHRhY2hlcjtyKHQsbihcIk5vZGVcIiksMCkscih0LG4oXCJTb3VyY2VcIiksMSkscih0LG4oXCJUYXJnZXRcIiksMikscih0LG4oXCJPcHBvc2l0ZVwiKSwzKX0pKX0oV3QpLGZ1bmN0aW9uKHQpe1ouZm9yRWFjaCgoZnVuY3Rpb24oZSl7dmFyIG49ZS5uYW1lLHI9ZS5hdHRhY2hlcjtyKHQsbihcIkVkZ2VcIiksXCJtaXhlZFwiKSxyKHQsbihcIkRpcmVjdGVkRWRnZVwiKSxcImRpcmVjdGVkXCIpLHIodCxuKFwiVW5kaXJlY3RlZEVkZ2VcIiksXCJ1bmRpcmVjdGVkXCIpfSkpfShXdCksZnVuY3Rpb24odCl7bnQuZm9yRWFjaCgoZnVuY3Rpb24oZSl7IWZ1bmN0aW9uKHQsZSl7dmFyIG49ZS5uYW1lLHI9ZS50eXBlLGk9ZS5kaXJlY3Rpb247dC5wcm90b3R5cGVbbl09ZnVuY3Rpb24odCxlKXtpZihcIm1peGVkXCIhPT1yJiZcIm1peGVkXCIhPT10aGlzLnR5cGUmJnIhPT10aGlzLnR5cGUpcmV0dXJuW107aWYoIWFyZ3VtZW50cy5sZW5ndGgpcmV0dXJuIHN0KHRoaXMscik7aWYoMT09PWFyZ3VtZW50cy5sZW5ndGgpe3Q9XCJcIit0O3ZhciBvPXRoaXMuX25vZGVzLmdldCh0KTtpZih2b2lkIDA9PT1vKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KG4sJzogY291bGQgbm90IGZpbmQgdGhlIFwiJykuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gZnQodGhpcy5tdWx0aSxcIm1peGVkXCI9PT1yP3RoaXMudHlwZTpyLGksbyl9aWYoMj09PWFyZ3VtZW50cy5sZW5ndGgpe3Q9XCJcIit0LGU9XCJcIitlO3ZhciBhPXRoaXMuX25vZGVzLmdldCh0KTtpZighYSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChuLCc6ICBjb3VsZCBub3QgZmluZCB0aGUgXCInKS5jb25jYXQodCwnXCIgc291cmNlIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtpZighdGhpcy5fbm9kZXMuaGFzKGUpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KG4sJzogIGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdChlLCdcIiB0YXJnZXQgbm9kZSBpbiB0aGUgZ3JhcGguJykpO3JldHVybiB5dChyLHRoaXMubXVsdGksaSxhLGUpfXRocm93IG5ldyBGKFwiR3JhcGguXCIuY29uY2F0KG4sXCI6IHRvbyBtYW55IGFyZ3VtZW50cyAoZXhwZWN0aW5nIDAsIDEgb3IgMiBhbmQgZ290IFwiKS5jb25jYXQoYXJndW1lbnRzLmxlbmd0aCxcIikuXCIpKX19KHQsZSksZnVuY3Rpb24odCxlKXt2YXIgbj1lLm5hbWUscj1lLnR5cGUsaT1lLmRpcmVjdGlvbixvPVwiZm9yRWFjaFwiK25bMF0udG9VcHBlckNhc2UoKStuLnNsaWNlKDEsLTEpO3QucHJvdG90eXBlW29dPWZ1bmN0aW9uKHQsZSxuKXtpZihcIm1peGVkXCI9PT1yfHxcIm1peGVkXCI9PT10aGlzLnR5cGV8fHI9PT10aGlzLnR5cGUpe2lmKDE9PT1hcmd1bWVudHMubGVuZ3RoKXJldHVybiBkdCghMSx0aGlzLHIsbj10KTtpZigyPT09YXJndW1lbnRzLmxlbmd0aCl7dD1cIlwiK3Qsbj1lO3ZhciBhPXRoaXMuX25vZGVzLmdldCh0KTtpZih2b2lkIDA9PT1hKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KG8sJzogY291bGQgbm90IGZpbmQgdGhlIFwiJykuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtyZXR1cm4gcHQoITEsdGhpcy5tdWx0aSxcIm1peGVkXCI9PT1yP3RoaXMudHlwZTpyLGksYSxuKX1pZigzPT09YXJndW1lbnRzLmxlbmd0aCl7dD1cIlwiK3QsZT1cIlwiK2U7dmFyIHU9dGhpcy5fbm9kZXMuZ2V0KHQpO2lmKCF1KXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KG8sJzogIGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdCh0LCdcIiBzb3VyY2Ugbm9kZSBpbiB0aGUgZ3JhcGguJykpO2lmKCF0aGlzLl9ub2Rlcy5oYXMoZSkpdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQobywnOiAgY291bGQgbm90IGZpbmQgdGhlIFwiJykuY29uY2F0KGUsJ1wiIHRhcmdldCBub2RlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuIGd0KCExLHIsdGhpcy5tdWx0aSxpLHUsZSxuKX10aHJvdyBuZXcgRihcIkdyYXBoLlwiLmNvbmNhdChvLFwiOiB0b28gbWFueSBhcmd1bWVudHMgKGV4cGVjdGluZyAxLCAyIG9yIDMgYW5kIGdvdCBcIikuY29uY2F0KGFyZ3VtZW50cy5sZW5ndGgsXCIpLlwiKSl9fTt2YXIgYT1cIm1hcFwiK25bMF0udG9VcHBlckNhc2UoKStuLnNsaWNlKDEpO3QucHJvdG90eXBlW2FdPWZ1bmN0aW9uKCl7dmFyIHQsZT1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLG49ZS5wb3AoKTtpZigwPT09ZS5sZW5ndGgpe3ZhciBpPTA7XCJkaXJlY3RlZFwiIT09ciYmKGkrPXRoaXMudW5kaXJlY3RlZFNpemUpLFwidW5kaXJlY3RlZFwiIT09ciYmKGkrPXRoaXMuZGlyZWN0ZWRTaXplKSx0PW5ldyBBcnJheShpKTt2YXIgYT0wO2UucHVzaCgoZnVuY3Rpb24oZSxyLGksbyx1LGMscyl7dFthKytdPW4oZSxyLGksbyx1LGMscyl9KSl9ZWxzZSB0PVtdLGUucHVzaCgoZnVuY3Rpb24oZSxyLGksbyxhLHUsYyl7dC5wdXNoKG4oZSxyLGksbyxhLHUsYykpfSkpO3JldHVybiB0aGlzW29dLmFwcGx5KHRoaXMsZSksdH07dmFyIHU9XCJmaWx0ZXJcIituWzBdLnRvVXBwZXJDYXNlKCkrbi5zbGljZSgxKTt0LnByb3RvdHlwZVt1XT1mdW5jdGlvbigpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksZT10LnBvcCgpLG49W107cmV0dXJuIHQucHVzaCgoZnVuY3Rpb24odCxyLGksbyxhLHUsYyl7ZSh0LHIsaSxvLGEsdSxjKSYmbi5wdXNoKHQpfSkpLHRoaXNbb10uYXBwbHkodGhpcyx0KSxufTt2YXIgYz1cInJlZHVjZVwiK25bMF0udG9VcHBlckNhc2UoKStuLnNsaWNlKDEpO3QucHJvdG90eXBlW2NdPWZ1bmN0aW9uKCl7dmFyIHQsZSxuPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7aWYobi5sZW5ndGg8Mnx8bi5sZW5ndGg+NCl0aHJvdyBuZXcgRihcIkdyYXBoLlwiLmNvbmNhdChjLFwiOiBpbnZhbGlkIG51bWJlciBvZiBhcmd1bWVudHMgKGV4cGVjdGluZyAyLCAzIG9yIDQgYW5kIGdvdCBcIikuY29uY2F0KG4ubGVuZ3RoLFwiKS5cIikpO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIG5bbi5sZW5ndGgtMV0mJlwiZnVuY3Rpb25cIiE9dHlwZW9mIG5bbi5sZW5ndGgtMl0pdGhyb3cgbmV3IEYoXCJHcmFwaC5cIi5jb25jYXQoYyxcIjogbWlzc2luZyBpbml0aWFsIHZhbHVlLiBZb3UgbXVzdCBwcm92aWRlIGl0IGJlY2F1c2UgdGhlIGNhbGxiYWNrIHRha2VzIG1vcmUgdGhhbiBvbmUgYXJndW1lbnQgYW5kIHdlIGNhbm5vdCBpbmZlciB0aGUgaW5pdGlhbCB2YWx1ZSBmcm9tIHRoZSBmaXJzdCBpdGVyYXRpb24sIGFzIHlvdSBjb3VsZCB3aXRoIGEgc2ltcGxlIGFycmF5LlwiKSk7Mj09PW4ubGVuZ3RoPyh0PW5bMF0sZT1uWzFdLG49W10pOjM9PT1uLmxlbmd0aD8odD1uWzFdLGU9blsyXSxuPVtuWzBdXSk6ND09PW4ubGVuZ3RoJiYodD1uWzJdLGU9blszXSxuPVtuWzBdLG5bMV1dKTt2YXIgcj1lO3JldHVybiBuLnB1c2goKGZ1bmN0aW9uKGUsbixpLG8sYSx1LGMpe3I9dChyLGUsbixpLG8sYSx1LGMpfSkpLHRoaXNbb10uYXBwbHkodGhpcyxuKSxyfX0odCxlKSxmdW5jdGlvbih0LGUpe3ZhciBuPWUubmFtZSxyPWUudHlwZSxpPWUuZGlyZWN0aW9uLG89XCJmaW5kXCIrblswXS50b1VwcGVyQ2FzZSgpK24uc2xpY2UoMSwtMSk7dC5wcm90b3R5cGVbb109ZnVuY3Rpb24odCxlLG4pe2lmKFwibWl4ZWRcIiE9PXImJlwibWl4ZWRcIiE9PXRoaXMudHlwZSYmciE9PXRoaXMudHlwZSlyZXR1cm4hMTtpZigxPT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gZHQoITAsdGhpcyxyLG49dCk7aWYoMj09PWFyZ3VtZW50cy5sZW5ndGgpe3Q9XCJcIit0LG49ZTt2YXIgYT10aGlzLl9ub2Rlcy5nZXQodCk7aWYodm9pZCAwPT09YSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChvLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuIHB0KCEwLHRoaXMubXVsdGksXCJtaXhlZFwiPT09cj90aGlzLnR5cGU6cixpLGEsbil9aWYoMz09PWFyZ3VtZW50cy5sZW5ndGgpe3Q9XCJcIit0LGU9XCJcIitlO3ZhciB1PXRoaXMuX25vZGVzLmdldCh0KTtpZighdSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChvLCc6ICBjb3VsZCBub3QgZmluZCB0aGUgXCInKS5jb25jYXQodCwnXCIgc291cmNlIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtpZighdGhpcy5fbm9kZXMuaGFzKGUpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KG8sJzogIGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdChlLCdcIiB0YXJnZXQgbm9kZSBpbiB0aGUgZ3JhcGguJykpO3JldHVybiBndCghMCxyLHRoaXMubXVsdGksaSx1LGUsbil9dGhyb3cgbmV3IEYoXCJHcmFwaC5cIi5jb25jYXQobyxcIjogdG9vIG1hbnkgYXJndW1lbnRzIChleHBlY3RpbmcgMSwgMiBvciAzIGFuZCBnb3QgXCIpLmNvbmNhdChhcmd1bWVudHMubGVuZ3RoLFwiKS5cIikpfTt2YXIgYT1cInNvbWVcIituWzBdLnRvVXBwZXJDYXNlKCkrbi5zbGljZSgxLC0xKTt0LnByb3RvdHlwZVthXT1mdW5jdGlvbigpe3ZhciB0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksZT10LnBvcCgpO3JldHVybiB0LnB1c2goKGZ1bmN0aW9uKHQsbixyLGksbyxhLHUpe3JldHVybiBlKHQsbixyLGksbyxhLHUpfSkpLCEhdGhpc1tvXS5hcHBseSh0aGlzLHQpfTt2YXIgdT1cImV2ZXJ5XCIrblswXS50b1VwcGVyQ2FzZSgpK24uc2xpY2UoMSwtMSk7dC5wcm90b3R5cGVbdV09ZnVuY3Rpb24oKXt2YXIgdD1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLGU9dC5wb3AoKTtyZXR1cm4gdC5wdXNoKChmdW5jdGlvbih0LG4scixpLG8sYSx1KXtyZXR1cm4hZSh0LG4scixpLG8sYSx1KX0pKSwhdGhpc1tvXS5hcHBseSh0aGlzLHQpfX0odCxlKSxmdW5jdGlvbih0LGUpe3ZhciBuPWUubmFtZSxyPWUudHlwZSxpPWUuZGlyZWN0aW9uLG89bi5zbGljZSgwLC0xKStcIkVudHJpZXNcIjt0LnByb3RvdHlwZVtvXT1mdW5jdGlvbih0LGUpe2lmKFwibWl4ZWRcIiE9PXImJlwibWl4ZWRcIiE9PXRoaXMudHlwZSYmciE9PXRoaXMudHlwZSlyZXR1cm4gTy5lbXB0eSgpO2lmKCFhcmd1bWVudHMubGVuZ3RoKXJldHVybiBodCh0aGlzLHIpO2lmKDE9PT1hcmd1bWVudHMubGVuZ3RoKXt0PVwiXCIrdDt2YXIgbj10aGlzLl9ub2Rlcy5nZXQodCk7aWYoIW4pdGhyb3cgbmV3IEkoXCJHcmFwaC5cIi5jb25jYXQobywnOiBjb3VsZCBub3QgZmluZCB0aGUgXCInKS5jb25jYXQodCwnXCIgbm9kZSBpbiB0aGUgZ3JhcGguJykpO3JldHVybiBsdChyLGksbil9aWYoMj09PWFyZ3VtZW50cy5sZW5ndGgpe3Q9XCJcIit0LGU9XCJcIitlO3ZhciBhPXRoaXMuX25vZGVzLmdldCh0KTtpZighYSl0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChvLCc6ICBjb3VsZCBub3QgZmluZCB0aGUgXCInKS5jb25jYXQodCwnXCIgc291cmNlIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtpZighdGhpcy5fbm9kZXMuaGFzKGUpKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KG8sJzogIGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdChlLCdcIiB0YXJnZXQgbm9kZSBpbiB0aGUgZ3JhcGguJykpO3JldHVybiB3dChyLGksYSxlKX10aHJvdyBuZXcgRihcIkdyYXBoLlwiLmNvbmNhdChvLFwiOiB0b28gbWFueSBhcmd1bWVudHMgKGV4cGVjdGluZyAwLCAxIG9yIDIgYW5kIGdvdCBcIikuY29uY2F0KGFyZ3VtZW50cy5sZW5ndGgsXCIpLlwiKSl9fSh0LGUpfSkpfShXdCksZnVuY3Rpb24odCl7dnQuZm9yRWFjaCgoZnVuY3Rpb24oZSl7R3QodCxlKSxmdW5jdGlvbih0LGUpe3ZhciBuPWUubmFtZSxyPWUudHlwZSxpPWUuZGlyZWN0aW9uLG89XCJmb3JFYWNoXCIrblswXS50b1VwcGVyQ2FzZSgpK24uc2xpY2UoMSwtMSk7dC5wcm90b3R5cGVbb109ZnVuY3Rpb24odCxlKXtpZihcIm1peGVkXCI9PT1yfHxcIm1peGVkXCI9PT10aGlzLnR5cGV8fHI9PT10aGlzLnR5cGUpe3Q9XCJcIit0O3ZhciBuPXRoaXMuX25vZGVzLmdldCh0KTtpZih2b2lkIDA9PT1uKXRocm93IG5ldyBJKFwiR3JhcGguXCIuY29uY2F0KG8sJzogY291bGQgbm90IGZpbmQgdGhlIFwiJykuY29uY2F0KHQsJ1wiIG5vZGUgaW4gdGhlIGdyYXBoLicpKTtrdCghMSxcIm1peGVkXCI9PT1yP3RoaXMudHlwZTpyLGksbixlKX19O3ZhciBhPVwibWFwXCIrblswXS50b1VwcGVyQ2FzZSgpK24uc2xpY2UoMSk7dC5wcm90b3R5cGVbYV09ZnVuY3Rpb24odCxlKXt2YXIgbj1bXTtyZXR1cm4gdGhpc1tvXSh0LChmdW5jdGlvbih0LHIpe24ucHVzaChlKHQscikpfSkpLG59O3ZhciB1PVwiZmlsdGVyXCIrblswXS50b1VwcGVyQ2FzZSgpK24uc2xpY2UoMSk7dC5wcm90b3R5cGVbdV09ZnVuY3Rpb24odCxlKXt2YXIgbj1bXTtyZXR1cm4gdGhpc1tvXSh0LChmdW5jdGlvbih0LHIpe2UodCxyKSYmbi5wdXNoKHQpfSkpLG59O3ZhciBjPVwicmVkdWNlXCIrblswXS50b1VwcGVyQ2FzZSgpK24uc2xpY2UoMSk7dC5wcm90b3R5cGVbY109ZnVuY3Rpb24odCxlLG4pe2lmKGFyZ3VtZW50cy5sZW5ndGg8Myl0aHJvdyBuZXcgRihcIkdyYXBoLlwiLmNvbmNhdChjLFwiOiBtaXNzaW5nIGluaXRpYWwgdmFsdWUuIFlvdSBtdXN0IHByb3ZpZGUgaXQgYmVjYXVzZSB0aGUgY2FsbGJhY2sgdGFrZXMgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCBhbmQgd2UgY2Fubm90IGluZmVyIHRoZSBpbml0aWFsIHZhbHVlIGZyb20gdGhlIGZpcnN0IGl0ZXJhdGlvbiwgYXMgeW91IGNvdWxkIHdpdGggYSBzaW1wbGUgYXJyYXkuXCIpKTt2YXIgcj1uO3JldHVybiB0aGlzW29dKHQsKGZ1bmN0aW9uKHQsbil7cj1lKHIsdCxuKX0pKSxyfX0odCxlKSxmdW5jdGlvbih0LGUpe3ZhciBuPWUubmFtZSxyPWUudHlwZSxpPWUuZGlyZWN0aW9uLG89blswXS50b1VwcGVyQ2FzZSgpK24uc2xpY2UoMSwtMSksYT1cImZpbmRcIitvO3QucHJvdG90eXBlW2FdPWZ1bmN0aW9uKHQsZSl7aWYoXCJtaXhlZFwiPT09cnx8XCJtaXhlZFwiPT09dGhpcy50eXBlfHxyPT09dGhpcy50eXBlKXt0PVwiXCIrdDt2YXIgbj10aGlzLl9ub2Rlcy5nZXQodCk7aWYodm9pZCAwPT09bil0aHJvdyBuZXcgSShcIkdyYXBoLlwiLmNvbmNhdChhLCc6IGNvdWxkIG5vdCBmaW5kIHRoZSBcIicpLmNvbmNhdCh0LCdcIiBub2RlIGluIHRoZSBncmFwaC4nKSk7cmV0dXJuIGt0KCEwLFwibWl4ZWRcIj09PXI/dGhpcy50eXBlOnIsaSxuLGUpfX07dmFyIHU9XCJzb21lXCIrbzt0LnByb3RvdHlwZVt1XT1mdW5jdGlvbih0LGUpe3JldHVybiEhdGhpc1thXSh0LGUpfTt2YXIgYz1cImV2ZXJ5XCIrbzt0LnByb3RvdHlwZVtjXT1mdW5jdGlvbih0LGUpe3JldHVybiF0aGlzW2FdKHQsKGZ1bmN0aW9uKHQsbil7cmV0dXJuIWUodCxuKX0pKX19KHQsZSkseHQodCxlKX0pKX0oV3QpO3ZhciBQdD1mdW5jdGlvbih0KXtmdW5jdGlvbiBuKGUpe3ZhciBuPWMoe3R5cGU6XCJkaXJlY3RlZFwifSxlKTtpZihcIm11bHRpXCJpbiBuJiYhMSE9PW4ubXVsdGkpdGhyb3cgbmV3IEYoXCJEaXJlY3RlZEdyYXBoLmZyb206IGluY29uc2lzdGVudCBpbmRpY2F0aW9uIHRoYXQgdGhlIGdyYXBoIHNob3VsZCBiZSBtdWx0aSBpbiBnaXZlbiBvcHRpb25zIVwiKTtpZihcImRpcmVjdGVkXCIhPT1uLnR5cGUpdGhyb3cgbmV3IEYoJ0RpcmVjdGVkR3JhcGguZnJvbTogaW5jb25zaXN0ZW50IFwiJytuLnR5cGUrJ1wiIHR5cGUgaW4gZ2l2ZW4gb3B0aW9ucyEnKTtyZXR1cm4gdC5jYWxsKHRoaXMsbil8fHRoaXN9cmV0dXJuIGUobix0KSxufShXdCksUnQ9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gbihlKXt2YXIgbj1jKHt0eXBlOlwidW5kaXJlY3RlZFwifSxlKTtpZihcIm11bHRpXCJpbiBuJiYhMSE9PW4ubXVsdGkpdGhyb3cgbmV3IEYoXCJVbmRpcmVjdGVkR3JhcGguZnJvbTogaW5jb25zaXN0ZW50IGluZGljYXRpb24gdGhhdCB0aGUgZ3JhcGggc2hvdWxkIGJlIG11bHRpIGluIGdpdmVuIG9wdGlvbnMhXCIpO2lmKFwidW5kaXJlY3RlZFwiIT09bi50eXBlKXRocm93IG5ldyBGKCdVbmRpcmVjdGVkR3JhcGguZnJvbTogaW5jb25zaXN0ZW50IFwiJytuLnR5cGUrJ1wiIHR5cGUgaW4gZ2l2ZW4gb3B0aW9ucyEnKTtyZXR1cm4gdC5jYWxsKHRoaXMsbil8fHRoaXN9cmV0dXJuIGUobix0KSxufShXdCksS3Q9ZnVuY3Rpb24odCl7ZnVuY3Rpb24gbihlKXt2YXIgbj1jKHttdWx0aTohMH0sZSk7aWYoXCJtdWx0aVwiaW4gbiYmITAhPT1uLm11bHRpKXRocm93IG5ldyBGKFwiTXVsdGlHcmFwaC5mcm9tOiBpbmNvbnNpc3RlbnQgaW5kaWNhdGlvbiB0aGF0IHRoZSBncmFwaCBzaG91bGQgYmUgc2ltcGxlIGluIGdpdmVuIG9wdGlvbnMhXCIpO3JldHVybiB0LmNhbGwodGhpcyxuKXx8dGhpc31yZXR1cm4gZShuLHQpLG59KFd0KSxUdD1mdW5jdGlvbih0KXtmdW5jdGlvbiBuKGUpe3ZhciBuPWMoe3R5cGU6XCJkaXJlY3RlZFwiLG11bHRpOiEwfSxlKTtpZihcIm11bHRpXCJpbiBuJiYhMCE9PW4ubXVsdGkpdGhyb3cgbmV3IEYoXCJNdWx0aURpcmVjdGVkR3JhcGguZnJvbTogaW5jb25zaXN0ZW50IGluZGljYXRpb24gdGhhdCB0aGUgZ3JhcGggc2hvdWxkIGJlIHNpbXBsZSBpbiBnaXZlbiBvcHRpb25zIVwiKTtpZihcImRpcmVjdGVkXCIhPT1uLnR5cGUpdGhyb3cgbmV3IEYoJ011bHRpRGlyZWN0ZWRHcmFwaC5mcm9tOiBpbmNvbnNpc3RlbnQgXCInK24udHlwZSsnXCIgdHlwZSBpbiBnaXZlbiBvcHRpb25zIScpO3JldHVybiB0LmNhbGwodGhpcyxuKXx8dGhpc31yZXR1cm4gZShuLHQpLG59KFd0KSxCdD1mdW5jdGlvbih0KXtmdW5jdGlvbiBuKGUpe3ZhciBuPWMoe3R5cGU6XCJ1bmRpcmVjdGVkXCIsbXVsdGk6ITB9LGUpO2lmKFwibXVsdGlcImluIG4mJiEwIT09bi5tdWx0aSl0aHJvdyBuZXcgRihcIk11bHRpVW5kaXJlY3RlZEdyYXBoLmZyb206IGluY29uc2lzdGVudCBpbmRpY2F0aW9uIHRoYXQgdGhlIGdyYXBoIHNob3VsZCBiZSBzaW1wbGUgaW4gZ2l2ZW4gb3B0aW9ucyFcIik7aWYoXCJ1bmRpcmVjdGVkXCIhPT1uLnR5cGUpdGhyb3cgbmV3IEYoJ011bHRpVW5kaXJlY3RlZEdyYXBoLmZyb206IGluY29uc2lzdGVudCBcIicrbi50eXBlKydcIiB0eXBlIGluIGdpdmVuIG9wdGlvbnMhJyk7cmV0dXJuIHQuY2FsbCh0aGlzLG4pfHx0aGlzfXJldHVybiBlKG4sdCksbn0oV3QpO2Z1bmN0aW9uIEZ0KHQpe3QuZnJvbT1mdW5jdGlvbihlLG4pe3ZhciByPWMoe30sZS5vcHRpb25zLG4pLGk9bmV3IHQocik7cmV0dXJuIGkuaW1wb3J0KGUpLGl9fXJldHVybiBGdChXdCksRnQoUHQpLEZ0KFJ0KSxGdChLdCksRnQoVHQpLEZ0KEJ0KSxXdC5HcmFwaD1XdCxXdC5EaXJlY3RlZEdyYXBoPVB0LFd0LlVuZGlyZWN0ZWRHcmFwaD1SdCxXdC5NdWx0aUdyYXBoPUt0LFd0Lk11bHRpRGlyZWN0ZWRHcmFwaD1UdCxXdC5NdWx0aVVuZGlyZWN0ZWRHcmFwaD1CdCxXdC5JbnZhbGlkQXJndW1lbnRzR3JhcGhFcnJvcj1GLFd0Lk5vdEZvdW5kR3JhcGhFcnJvcj1JLFd0LlVzYWdlR3JhcGhFcnJvcj1ZLFd0fSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z3JhcGhvbG9neS51bWQubWluLmpzLm1hcFxuIiwiLyoqXG4gKiBQYW5kZW1vbml1bSBSYW5kb21cbiAqID09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBSYW5kb20gZnVuY3Rpb24uXG4gKi9cblxuLyoqXG4gKiBDcmVhdGluZyBhIGZ1bmN0aW9uIHJldHVybmluZyBhIHJhbmRvbSBpbnRlZ2VyIHN1Y2ggYXMgYSA8PSBOIDw9IGIuXG4gKlxuICogQHBhcmFtICB7ZnVuY3Rpb259IHJuZyAtIFJORyBmdW5jdGlvbiByZXR1cm5pbmcgdW5pZm9ybSByYW5kb20uXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gICAgIC0gVGhlIGNyZWF0ZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZVJhbmRvbShybmcpIHtcblxuICAvKipcbiAgICogUmFuZG9tIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGEgLSBGcm9tLlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IGIgLSBUby5cbiAgICogQHJldHVybiB7bnVtYmVyfVxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYSArIE1hdGguZmxvb3Iocm5nKCkgKiAoYiAtIGEgKyAxKSk7XG4gIH07XG59XG5cbi8qKlxuICogRGVmYXVsdCByYW5kb20gdXNpbmcgYE1hdGgucmFuZG9tYC5cbiAqL1xudmFyIHJhbmRvbSA9IGNyZWF0ZVJhbmRvbShNYXRoLnJhbmRvbSk7XG5cbi8qKlxuICogRXhwb3J0aW5nLlxuICovXG5yYW5kb20uY3JlYXRlUmFuZG9tID0gY3JlYXRlUmFuZG9tO1xubW9kdWxlLmV4cG9ydHMgPSByYW5kb207XG4iLCIvKipcbiAqIFBhbmRlbW9uaXVtIFNodWZmbGUgSW4gUGxhY2VcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogU2h1ZmZsZSBmdW5jdGlvbiBhcHBseWluZyB0aGUgRmlzaGVyLVlhdGVzIGFsZ29yaXRobSB0byB0aGUgcHJvdmlkZWQgYXJyYXkuXG4gKi9cbnZhciBjcmVhdGVSYW5kb20gPSByZXF1aXJlKCcuL3JhbmRvbS5qcycpLmNyZWF0ZVJhbmRvbTtcblxuLyoqXG4gKiBDcmVhdGluZyBhIGZ1bmN0aW9uIHJldHVybmluZyB0aGUgZ2l2ZW4gYXJyYXkgc2h1ZmZsZWQuXG4gKlxuICogQHBhcmFtICB7ZnVuY3Rpb259IHJuZyAtIFRoZSBSTkcgdG8gdXNlLlxuICogQHJldHVybiB7ZnVuY3Rpb259ICAgICAtIFRoZSBjcmVhdGVkIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBjcmVhdGVTaHVmZmxlSW5QbGFjZShybmcpIHtcbiAgdmFyIGN1c3RvbVJhbmRvbSA9IGNyZWF0ZVJhbmRvbShybmcpO1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiByZXR1cm5pbmcgdGhlIHNodWZmbGVkIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0gIHthcnJheX0gIHNlcXVlbmNlIC0gVGFyZ2V0IHNlcXVlbmNlLlxuICAgKiBAcmV0dXJuIHthcnJheX0gICAgICAgICAgIC0gVGhlIHNodWZmbGVkIHNlcXVlbmNlLlxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uKHNlcXVlbmNlKSB7XG4gICAgdmFyIGxlbmd0aCA9IHNlcXVlbmNlLmxlbmd0aCxcbiAgICAgICAgbGFzdEluZGV4ID0gbGVuZ3RoIC0gMTtcblxuICAgIHZhciBpbmRleCA9IC0xO1xuXG4gICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICAgIHZhciByID0gY3VzdG9tUmFuZG9tKGluZGV4LCBsYXN0SW5kZXgpLFxuICAgICAgICAgIHZhbHVlID0gc2VxdWVuY2Vbcl07XG5cbiAgICAgIHNlcXVlbmNlW3JdID0gc2VxdWVuY2VbaW5kZXhdO1xuICAgICAgc2VxdWVuY2VbaW5kZXhdID0gdmFsdWU7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIERlZmF1bHQgc2h1ZmZsZSBpbiBwbGFjZSB1c2luZyBgTWF0aC5yYW5kb21gLlxuICovXG52YXIgc2h1ZmZsZUluUGxhY2UgPSBjcmVhdGVTaHVmZmxlSW5QbGFjZShNYXRoLnJhbmRvbSk7XG5cbi8qKlxuICogRXhwb3J0aW5nLlxuICovXG5zaHVmZmxlSW5QbGFjZS5jcmVhdGVTaHVmZmxlSW5QbGFjZSA9IGNyZWF0ZVNodWZmbGVJblBsYWNlO1xubW9kdWxlLmV4cG9ydHMgPSBzaHVmZmxlSW5QbGFjZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogU2lnbWEuanMgQ2FtZXJhIENsYXNzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogQ2xhc3MgZGVzaWduZWQgdG8gc3RvcmUgY2FtZXJhIGluZm9ybWF0aW9uICYgdXNlZCB0byB1cGRhdGUgaXQuXG4gKiBAbW9kdWxlXG4gKi9cbnZhciBhbmltYXRlXzEgPSByZXF1aXJlKFwiLi4vdXRpbHMvYW5pbWF0ZVwiKTtcbnZhciBlYXNpbmdzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3V0aWxzL2Vhc2luZ3NcIikpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vdXRpbHNcIik7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuLi90eXBlc1wiKTtcbi8qKlxuICogRGVmYXVsdHMuXG4gKi9cbnZhciBERUZBVUxUX1pPT01JTkdfUkFUSU8gPSAxLjU7XG4vKipcbiAqIENhbWVyYSBjbGFzc1xuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgQ2FtZXJhID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDYW1lcmEsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2FtZXJhKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy54ID0gMC41O1xuICAgICAgICBfdGhpcy55ID0gMC41O1xuICAgICAgICBfdGhpcy5hbmdsZSA9IDA7XG4gICAgICAgIF90aGlzLnJhdGlvID0gMTtcbiAgICAgICAgX3RoaXMubWluUmF0aW8gPSBudWxsO1xuICAgICAgICBfdGhpcy5tYXhSYXRpbyA9IG51bGw7XG4gICAgICAgIF90aGlzLm5leHRGcmFtZSA9IG51bGw7XG4gICAgICAgIF90aGlzLnByZXZpb3VzU3RhdGUgPSBudWxsO1xuICAgICAgICBfdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgLy8gU3RhdGVcbiAgICAgICAgX3RoaXMucHJldmlvdXNTdGF0ZSA9IF90aGlzLmdldFN0YXRlKCk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhdGljIG1ldGhvZCB1c2VkIHRvIGNyZWF0ZSBhIENhbWVyYSBvYmplY3Qgd2l0aCBhIGdpdmVuIHN0YXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YXRlXG4gICAgICogQHJldHVybiB7Q2FtZXJhfVxuICAgICAqL1xuICAgIENhbWVyYS5mcm9tID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHZhciBjYW1lcmEgPSBuZXcgQ2FtZXJhKCk7XG4gICAgICAgIHJldHVybiBjYW1lcmEuc2V0U3RhdGUoc3RhdGUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gZW5hYmxlIHRoZSBjYW1lcmEuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtDYW1lcmF9XG4gICAgICovXG4gICAgQ2FtZXJhLnByb3RvdHlwZS5lbmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gZGlzYWJsZSB0aGUgY2FtZXJhLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Q2FtZXJhfVxuICAgICAqL1xuICAgIENhbWVyYS5wcm90b3R5cGUuZGlzYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmV0cmlldmUgdGhlIGNhbWVyYSdzIGN1cnJlbnQgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgQ2FtZXJhLnByb3RvdHlwZS5nZXRTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHRoaXMueCxcbiAgICAgICAgICAgIHk6IHRoaXMueSxcbiAgICAgICAgICAgIGFuZ2xlOiB0aGlzLmFuZ2xlLFxuICAgICAgICAgICAgcmF0aW86IHRoaXMucmF0aW8sXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byBjaGVjayB3aGV0aGVyIHRoZSBjYW1lcmEgaGFzIHRoZSBnaXZlbiBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge29iamVjdH1cbiAgICAgKi9cbiAgICBDYW1lcmEucHJvdG90eXBlLmhhc1N0YXRlID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggPT09IHN0YXRlLnggJiYgdGhpcy55ID09PSBzdGF0ZS55ICYmIHRoaXMucmF0aW8gPT09IHN0YXRlLnJhdGlvICYmIHRoaXMuYW5nbGUgPT09IHN0YXRlLmFuZ2xlO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmV0cmlldmUgdGhlIGNhbWVyYSdzIHByZXZpb3VzIHN0YXRlLlxuICAgICAqXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuICAgIENhbWVyYS5wcm90b3R5cGUuZ2V0UHJldmlvdXNTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5wcmV2aW91c1N0YXRlO1xuICAgICAgICBpZiAoIXN0YXRlKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiBzdGF0ZS54LFxuICAgICAgICAgICAgeTogc3RhdGUueSxcbiAgICAgICAgICAgIGFuZ2xlOiBzdGF0ZS5hbmdsZSxcbiAgICAgICAgICAgIHJhdGlvOiBzdGF0ZS5yYXRpbyxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIGNoZWNrIG1pblJhdGlvIGFuZCBtYXhSYXRpbyB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmF0aW9cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XG4gICAgICovXG4gICAgQ2FtZXJhLnByb3RvdHlwZS5nZXRCb3VuZGVkUmF0aW8gPSBmdW5jdGlvbiAocmF0aW8pIHtcbiAgICAgICAgdmFyIHIgPSByYXRpbztcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm1pblJhdGlvID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgciA9IE1hdGgubWF4KHIsIHRoaXMubWluUmF0aW8pO1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMubWF4UmF0aW8gPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICByID0gTWF0aC5taW4ociwgdGhpcy5tYXhSYXRpbyk7XG4gICAgICAgIHJldHVybiByO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gY2hlY2sgdmFyaW91cyB0aGluZ3MgdG8gcmV0dXJuIGEgbGVnaXQgc3RhdGUgY2FuZGlkYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHN0YXRlXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxuICAgICAqL1xuICAgIENhbWVyYS5wcm90b3R5cGUudmFsaWRhdGVTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICAgICAgICB2YXIgdmFsaWRhdGVkU3RhdGUgPSB7fTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdGF0ZS54ID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgdmFsaWRhdGVkU3RhdGUueCA9IHN0YXRlLng7XG4gICAgICAgIGlmICh0eXBlb2Ygc3RhdGUueSA9PT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgIHZhbGlkYXRlZFN0YXRlLnkgPSBzdGF0ZS55O1xuICAgICAgICBpZiAodHlwZW9mIHN0YXRlLmFuZ2xlID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgdmFsaWRhdGVkU3RhdGUuYW5nbGUgPSBzdGF0ZS5hbmdsZTtcbiAgICAgICAgaWYgKHR5cGVvZiBzdGF0ZS5yYXRpbyA9PT0gXCJudW1iZXJcIilcbiAgICAgICAgICAgIHZhbGlkYXRlZFN0YXRlLnJhdGlvID0gdGhpcy5nZXRCb3VuZGVkUmF0aW8oc3RhdGUucmF0aW8pO1xuICAgICAgICByZXR1cm4gdmFsaWRhdGVkU3RhdGU7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byBjaGVjayB3aGV0aGVyIHRoZSBjYW1lcmEgaXMgY3VycmVudGx5IGJlaW5nIGFuaW1hdGVkLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBDYW1lcmEucHJvdG90eXBlLmlzQW5pbWF0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhIXRoaXMubmV4dEZyYW1lO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gc2V0IHRoZSBjYW1lcmEncyBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge29iamVjdH0gc3RhdGUgLSBOZXcgc3RhdGUuXG4gICAgICogQHJldHVybiB7Q2FtZXJhfVxuICAgICAqL1xuICAgIENhbWVyYS5wcm90b3R5cGUuc2V0U3RhdGUgPSBmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgLy8gVE9ETzogdXBkYXRlIGJ5IGZ1bmN0aW9uXG4gICAgICAgIC8vIEtlZXBpbmcgdHJhY2sgb2YgbGFzdCBzdGF0ZVxuICAgICAgICB0aGlzLnByZXZpb3VzU3RhdGUgPSB0aGlzLmdldFN0YXRlKCk7XG4gICAgICAgIHZhciB2YWxpZFN0YXRlID0gdGhpcy52YWxpZGF0ZVN0YXRlKHN0YXRlKTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZFN0YXRlLnggPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICB0aGlzLnggPSB2YWxpZFN0YXRlLng7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsaWRTdGF0ZS55ID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgdGhpcy55ID0gdmFsaWRTdGF0ZS55O1xuICAgICAgICBpZiAodHlwZW9mIHZhbGlkU3RhdGUuYW5nbGUgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICB0aGlzLmFuZ2xlID0gdmFsaWRTdGF0ZS5hbmdsZTtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWxpZFN0YXRlLnJhdGlvID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgdGhpcy5yYXRpbyA9IHZhbGlkU3RhdGUucmF0aW87XG4gICAgICAgIC8vIEVtaXR0aW5nXG4gICAgICAgIGlmICghdGhpcy5oYXNTdGF0ZSh0aGlzLnByZXZpb3VzU3RhdGUpKVxuICAgICAgICAgICAgdGhpcy5lbWl0KFwidXBkYXRlZFwiLCB0aGlzLmdldFN0YXRlKCkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIGFuaW1hdGUgdGhlIGNhbWVyYS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge29iamVjdH0gICAgICAgICAgICAgICAgICAgIHN0YXRlICAgICAgLSBTdGF0ZSB0byByZWFjaCBldmVudHVhbGx5LlxuICAgICAqIEBwYXJhbSAge29iamVjdH0gICAgICAgICAgICAgICAgICAgIG9wdHMgICAgICAgLSBPcHRpb25zOlxuICAgICAqIEBwYXJhbSAge251bWJlcn0gICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb24gLSBEdXJhdGlvbiBvZiB0aGUgYW5pbWF0aW9uLlxuICAgICAqIEBwYXJhbSAge3N0cmluZyB8IG51bWJlciA9PiBudW1iZXJ9ICAgZWFzaW5nICAgLSBFYXNpbmcgZnVuY3Rpb24gb3IgbmFtZSBvZiBhbiBleGlzdGluZyBvbmVcbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0gICAgICAgICAgICAgICAgICBjYWxsYmFjayAgIC0gQ2FsbGJhY2tcbiAgICAgKi9cbiAgICBDYW1lcmEucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbiAoc3RhdGUsIG9wdHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGFuaW1hdGVfMS5BTklNQVRFX0RFRkFVTFRTLCBvcHRzKTtcbiAgICAgICAgdmFyIHZhbGlkU3RhdGUgPSB0aGlzLnZhbGlkYXRlU3RhdGUoc3RhdGUpO1xuICAgICAgICB2YXIgZWFzaW5nID0gdHlwZW9mIG9wdGlvbnMuZWFzaW5nID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLmVhc2luZyA6IGVhc2luZ3NfMS5kZWZhdWx0W29wdGlvbnMuZWFzaW5nXTtcbiAgICAgICAgLy8gU3RhdGVcbiAgICAgICAgdmFyIHN0YXJ0ID0gRGF0ZS5ub3coKSwgaW5pdGlhbFN0YXRlID0gdGhpcy5nZXRTdGF0ZSgpO1xuICAgICAgICAvLyBGdW5jdGlvbiBwZXJmb3JtaW5nIHRoZSBhbmltYXRpb25cbiAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHQgPSAoRGF0ZS5ub3coKSAtIHN0YXJ0KSAvIG9wdGlvbnMuZHVyYXRpb247XG4gICAgICAgICAgICAvLyBUaGUgYW5pbWF0aW9uIGlzIG92ZXI6XG4gICAgICAgICAgICBpZiAodCA+PSAxKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMubmV4dEZyYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRTdGF0ZSh2YWxpZFN0YXRlKTtcbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuYW5pbWF0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYW5pbWF0aW9uQ2FsbGJhY2suY2FsbChudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuYW5pbWF0aW9uQ2FsbGJhY2sgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjb2VmZmljaWVudCA9IGVhc2luZyh0KTtcbiAgICAgICAgICAgIHZhciBuZXdTdGF0ZSA9IHt9O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZFN0YXRlLnggPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgbmV3U3RhdGUueCA9IGluaXRpYWxTdGF0ZS54ICsgKHZhbGlkU3RhdGUueCAtIGluaXRpYWxTdGF0ZS54KSAqIGNvZWZmaWNpZW50O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZFN0YXRlLnkgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgbmV3U3RhdGUueSA9IGluaXRpYWxTdGF0ZS55ICsgKHZhbGlkU3RhdGUueSAtIGluaXRpYWxTdGF0ZS55KSAqIGNvZWZmaWNpZW50O1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxpZFN0YXRlLmFuZ2xlID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIG5ld1N0YXRlLmFuZ2xlID0gaW5pdGlhbFN0YXRlLmFuZ2xlICsgKHZhbGlkU3RhdGUuYW5nbGUgLSBpbml0aWFsU3RhdGUuYW5nbGUpICogY29lZmZpY2llbnQ7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbGlkU3RhdGUucmF0aW8gPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgbmV3U3RhdGUucmF0aW8gPSBpbml0aWFsU3RhdGUucmF0aW8gKyAodmFsaWRTdGF0ZS5yYXRpbyAtIGluaXRpYWxTdGF0ZS5yYXRpbykgKiBjb2VmZmljaWVudDtcbiAgICAgICAgICAgIF90aGlzLnNldFN0YXRlKG5ld1N0YXRlKTtcbiAgICAgICAgICAgIF90aGlzLm5leHRGcmFtZSA9ICgwLCB1dGlsc18xLnJlcXVlc3RGcmFtZSkoZm4pO1xuICAgICAgICB9O1xuICAgICAgICBpZiAodGhpcy5uZXh0RnJhbWUpIHtcbiAgICAgICAgICAgICgwLCB1dGlsc18xLmNhbmNlbEZyYW1lKSh0aGlzLm5leHRGcmFtZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5hbmltYXRpb25DYWxsYmFjaylcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkNhbGxiYWNrLmNhbGwobnVsbCk7XG4gICAgICAgICAgICB0aGlzLm5leHRGcmFtZSA9ICgwLCB1dGlsc18xLnJlcXVlc3RGcmFtZSkoZm4pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFuaW1hdGlvbkNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byB6b29tIHRoZSBjYW1lcmEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ8b2JqZWN0fSBmYWN0b3JPck9wdGlvbnMgLSBGYWN0b3Igb3Igb3B0aW9ucy5cbiAgICAgKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAgICAgKi9cbiAgICBDYW1lcmEucHJvdG90eXBlLmFuaW1hdGVkWm9vbSA9IGZ1bmN0aW9uIChmYWN0b3JPck9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFmYWN0b3JPck9wdGlvbnMpIHtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSh7IHJhdGlvOiB0aGlzLnJhdGlvIC8gREVGQVVMVF9aT09NSU5HX1JBVElPIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmYWN0b3JPck9wdGlvbnMgPT09IFwibnVtYmVyXCIpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYW5pbWF0ZSh7IHJhdGlvOiB0aGlzLnJhdGlvIC8gZmFjdG9yT3JPcHRpb25zIH0pO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRoaXMuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHJhdGlvOiB0aGlzLnJhdGlvIC8gKGZhY3Rvck9yT3B0aW9ucy5mYWN0b3IgfHwgREVGQVVMVF9aT09NSU5HX1JBVElPKSxcbiAgICAgICAgICAgICAgICB9LCBmYWN0b3JPck9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byB1bnpvb20gdGhlIGNhbWVyYS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge251bWJlcnxvYmplY3R9IGZhY3Rvck9yT3B0aW9ucyAtIEZhY3RvciBvciBvcHRpb25zLlxuICAgICAqL1xuICAgIENhbWVyYS5wcm90b3R5cGUuYW5pbWF0ZWRVbnpvb20gPSBmdW5jdGlvbiAoZmFjdG9yT3JPcHRpb25zKSB7XG4gICAgICAgIGlmICghZmFjdG9yT3JPcHRpb25zKSB7XG4gICAgICAgICAgICB0aGlzLmFuaW1hdGUoeyByYXRpbzogdGhpcy5yYXRpbyAqIERFRkFVTFRfWk9PTUlOR19SQVRJTyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmFjdG9yT3JPcHRpb25zID09PSBcIm51bWJlclwiKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFuaW1hdGUoeyByYXRpbzogdGhpcy5yYXRpbyAqIGZhY3Rvck9yT3B0aW9ucyB9KTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGUoe1xuICAgICAgICAgICAgICAgICAgICByYXRpbzogdGhpcy5yYXRpbyAqIChmYWN0b3JPck9wdGlvbnMuZmFjdG9yIHx8IERFRkFVTFRfWk9PTUlOR19SQVRJTyksXG4gICAgICAgICAgICAgICAgfSwgZmFjdG9yT3JPcHRpb25zKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmVzZXQgdGhlIGNhbWVyYS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge29iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMuXG4gICAgICovXG4gICAgQ2FtZXJhLnByb3RvdHlwZS5hbmltYXRlZFJlc2V0ID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5hbmltYXRlKHtcbiAgICAgICAgICAgIHg6IDAuNSxcbiAgICAgICAgICAgIHk6IDAuNSxcbiAgICAgICAgICAgIHJhdGlvOiAxLFxuICAgICAgICAgICAgYW5nbGU6IDAsXG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhIG5ldyBDYW1lcmEgaW5zdGFuY2UsIHdpdGggdGhlIHNhbWUgc3RhdGUgYXMgdGhlIGN1cnJlbnQgY2FtZXJhLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Q2FtZXJhfVxuICAgICAqL1xuICAgIENhbWVyYS5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIENhbWVyYS5mcm9tKHRoaXMuZ2V0U3RhdGUoKSk7XG4gICAgfTtcbiAgICByZXR1cm4gQ2FtZXJhO1xufSh0eXBlc18xLlR5cGVkRXZlbnRFbWl0dGVyKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDYW1lcmE7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRXaGVlbERlbHRhID0gZXhwb3J0cy5nZXRUb3VjaENvb3JkcyA9IGV4cG9ydHMuZ2V0VG91Y2hlc0FycmF5ID0gZXhwb3J0cy5nZXRXaGVlbENvb3JkcyA9IGV4cG9ydHMuZ2V0TW91c2VDb29yZHMgPSBleHBvcnRzLmdldFBvc2l0aW9uID0gdm9pZCAwO1xuLyoqXG4gKiBTaWdtYS5qcyBDYXB0b3IgQ2xhc3NcbiAqID09PT09PT09PT09PT09PT09PT09PT1cbiAqIEBtb2R1bGVcbiAqL1xudmFyIHR5cGVzXzEgPSByZXF1aXJlKFwiLi4vLi4vdHlwZXNcIik7XG4vKipcbiAqIENhcHRvciB1dGlscyBmdW5jdGlvbnNcbiAqID09PT09PT09PT09PT09PT09PT09PT1cbiAqL1xuLyoqXG4gKiBFeHRyYWN0IHRoZSBsb2NhbCBYIGFuZCBZIGNvb3JkaW5hdGVzIGZyb20gYSBtb3VzZSBldmVudCBvciB0b3VjaCBvYmplY3QuIElmXG4gKiBhIERPTSBlbGVtZW50IGlzIGdpdmVuLCBpdCB1c2VzIHRoaXMgZWxlbWVudCdzIG9mZnNldCB0byBjb21wdXRlIHRoZSBwb3NpdGlvblxuICogKHRoaXMgYWxsb3dzIHVzaW5nIGV2ZW50cyB0aGF0IGFyZSBub3QgYm91bmQgdG8gdGhlIGNvbnRhaW5lciBpdHNlbGYgYW5kXG4gKiBzdGlsbCBoYXZlIGEgcHJvcGVyIHBvc2l0aW9uKS5cbiAqXG4gKiBAcGFyYW0gIHtldmVudH0gICAgICAgZSAtIEEgbW91c2UgZXZlbnQgb3IgdG91Y2ggb2JqZWN0LlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGRvbSAtIEEgRE9NIGVsZW1lbnQgdG8gY29tcHV0ZSBvZmZzZXQgcmVsYXRpdmVseSB0by5cbiAqIEByZXR1cm4ge251bWJlcn0gICAgICBUaGUgbG9jYWwgWSB2YWx1ZSBvZiB0aGUgbW91c2UuXG4gKi9cbmZ1bmN0aW9uIGdldFBvc2l0aW9uKGUsIGRvbSkge1xuICAgIHZhciBiYm94ID0gZG9tLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHg6IGUuY2xpZW50WCAtIGJib3gubGVmdCxcbiAgICAgICAgeTogZS5jbGllbnRZIC0gYmJveC50b3AsXG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0UG9zaXRpb24gPSBnZXRQb3NpdGlvbjtcbi8qKlxuICogQ29udmVydCBtb3VzZSBjb29yZHMgdG8gc2lnbWEgY29vcmRzLlxuICpcbiAqIEBwYXJhbSAge2V2ZW50fSAgICAgICBlICAgLSBBIG1vdXNlIGV2ZW50IG9yIHRvdWNoIG9iamVjdC5cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBkb20gLSBBIERPTSBlbGVtZW50IHRvIGNvbXB1dGUgb2Zmc2V0IHJlbGF0aXZlbHkgdG8uXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGdldE1vdXNlQ29vcmRzKGUsIGRvbSkge1xuICAgIHZhciByZXMgPSBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZ2V0UG9zaXRpb24oZSwgZG9tKSksIHsgc2lnbWFEZWZhdWx0UHJldmVudGVkOiBmYWxzZSwgcHJldmVudFNpZ21hRGVmYXVsdDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmVzLnNpZ21hRGVmYXVsdFByZXZlbnRlZCA9IHRydWU7XG4gICAgICAgIH0sIG9yaWdpbmFsOiBlIH0pO1xuICAgIHJldHVybiByZXM7XG59XG5leHBvcnRzLmdldE1vdXNlQ29vcmRzID0gZ2V0TW91c2VDb29yZHM7XG4vKipcbiAqIENvbnZlcnQgbW91c2Ugd2hlZWwgZXZlbnQgY29vcmRzIHRvIHNpZ21hIGNvb3Jkcy5cbiAqXG4gKiBAcGFyYW0gIHtldmVudH0gICAgICAgZSAgIC0gQSB3aGVlbCBtb3VzZSBldmVudC5cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBkb20gLSBBIERPTSBlbGVtZW50IHRvIGNvbXB1dGUgb2Zmc2V0IHJlbGF0aXZlbHkgdG8uXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGdldFdoZWVsQ29vcmRzKGUsIGRvbSkge1xuICAgIHJldHVybiBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgZ2V0TW91c2VDb29yZHMoZSwgZG9tKSksIHsgZGVsdGE6IGdldFdoZWVsRGVsdGEoZSkgfSk7XG59XG5leHBvcnRzLmdldFdoZWVsQ29vcmRzID0gZ2V0V2hlZWxDb29yZHM7XG52YXIgTUFYX1RPVUNIRVMgPSAyO1xuZnVuY3Rpb24gZ2V0VG91Y2hlc0FycmF5KHRvdWNoZXMpIHtcbiAgICB2YXIgYXJyID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBNYXRoLm1pbih0b3VjaGVzLmxlbmd0aCwgTUFYX1RPVUNIRVMpOyBpIDwgbDsgaSsrKVxuICAgICAgICBhcnIucHVzaCh0b3VjaGVzW2ldKTtcbiAgICByZXR1cm4gYXJyO1xufVxuZXhwb3J0cy5nZXRUb3VjaGVzQXJyYXkgPSBnZXRUb3VjaGVzQXJyYXk7XG4vKipcbiAqIENvbnZlcnQgdG91Y2ggY29vcmRzIHRvIHNpZ21hIGNvb3Jkcy5cbiAqXG4gKiBAcGFyYW0gIHtldmVudH0gICAgICAgZSAgIC0gQSB0b3VjaCBldmVudC5cbiAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSBkb20gLSBBIERPTSBlbGVtZW50IHRvIGNvbXB1dGUgb2Zmc2V0IHJlbGF0aXZlbHkgdG8uXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGdldFRvdWNoQ29vcmRzKGUsIGRvbSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHRvdWNoZXM6IGdldFRvdWNoZXNBcnJheShlLnRvdWNoZXMpLm1hcChmdW5jdGlvbiAodG91Y2gpIHsgcmV0dXJuIGdldFBvc2l0aW9uKHRvdWNoLCBkb20pOyB9KSxcbiAgICAgICAgb3JpZ2luYWw6IGUsXG4gICAgfTtcbn1cbmV4cG9ydHMuZ2V0VG91Y2hDb29yZHMgPSBnZXRUb3VjaENvb3Jkcztcbi8qKlxuICogRXh0cmFjdCB0aGUgd2hlZWwgZGVsdGEgZnJvbSBhIG1vdXNlIGV2ZW50IG9yIHRvdWNoIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gIHtldmVudH0gIGUgLSBBIG1vdXNlIGV2ZW50IG9yIHRvdWNoIG9iamVjdC5cbiAqIEByZXR1cm4ge251bWJlcn0gICAgIFRoZSB3aGVlbCBkZWx0YSBvZiB0aGUgbW91c2UuXG4gKi9cbmZ1bmN0aW9uIGdldFdoZWVsRGVsdGEoZSkge1xuICAgIC8vIFRPRE86IGNoZWNrIHRob3NlIHJhdGlvcyBhZ2FpbiB0byBlbnN1cmUgYSBjbGVhbiBDaHJvbWUvRmlyZWZveCBjb21wYXRcbiAgICBpZiAodHlwZW9mIGUuZGVsdGFZICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICByZXR1cm4gKGUuZGVsdGFZICogLTMpIC8gMzYwO1xuICAgIGlmICh0eXBlb2YgZS5kZXRhaWwgIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHJldHVybiBlLmRldGFpbCAvIC05O1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNhcHRvcjogY291bGQgbm90IGV4dHJhY3QgZGVsdGEgZnJvbSBldmVudC5cIik7XG59XG5leHBvcnRzLmdldFdoZWVsRGVsdGEgPSBnZXRXaGVlbERlbHRhO1xuLyoqXG4gKiBBYnN0cmFjdCBjbGFzcyByZXByZXNlbnRpbmcgYSBjYXB0b3IgbGlrZSB0aGUgdXNlcidzIG1vdXNlIG9yIHRvdWNoIGNvbnRyb2xzLlxuICovXG52YXIgQ2FwdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhDYXB0b3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gQ2FwdG9yKGNvbnRhaW5lciwgcmVuZGVyZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgLy8gUHJvcGVydGllc1xuICAgICAgICBfdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgICAgIF90aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIENhcHRvcjtcbn0odHlwZXNfMS5UeXBlZEV2ZW50RW1pdHRlcikpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQ2FwdG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgY2FwdG9yXzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vY2FwdG9yXCIpKTtcbi8qKlxuICogQ29uc3RhbnRzLlxuICovXG52YXIgRFJBR19USU1FT1VUID0gMTAwO1xudmFyIERSQUdHRURfRVZFTlRTX1RPTEVSQU5DRSA9IDM7XG52YXIgTU9VU0VfSU5FUlRJQV9EVVJBVElPTiA9IDIwMDtcbnZhciBNT1VTRV9JTkVSVElBX1JBVElPID0gMztcbnZhciBNT1VTRV9aT09NX0RVUkFUSU9OID0gMjUwO1xudmFyIFpPT01JTkdfUkFUSU8gPSAxLjc7XG52YXIgRE9VQkxFX0NMSUNLX1RJTUVPVVQgPSAzMDA7XG52YXIgRE9VQkxFX0NMSUNLX1pPT01JTkdfUkFUSU8gPSAyLjI7XG52YXIgRE9VQkxFX0NMSUNLX1pPT01JTkdfRFVSQVRJT04gPSAyMDA7XG4vKipcbiAqIE1vdXNlIGNhcHRvciBjbGFzcy5cbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIE1vdXNlQ2FwdG9yID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNb3VzZUNhcHRvciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNb3VzZUNhcHRvcihjb250YWluZXIsIHJlbmRlcmVyKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGNvbnRhaW5lciwgcmVuZGVyZXIpIHx8IHRoaXM7XG4gICAgICAgIC8vIFN0YXRlXG4gICAgICAgIF90aGlzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBfdGhpcy5kcmFnZ2VkRXZlbnRzID0gMDtcbiAgICAgICAgX3RoaXMuZG93blN0YXJ0VGltZSA9IG51bGw7XG4gICAgICAgIF90aGlzLmxhc3RNb3VzZVggPSBudWxsO1xuICAgICAgICBfdGhpcy5sYXN0TW91c2VZID0gbnVsbDtcbiAgICAgICAgX3RoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuaXNNb3ZpbmcgPSBmYWxzZTtcbiAgICAgICAgX3RoaXMubW92aW5nVGltZW91dCA9IG51bGw7XG4gICAgICAgIF90aGlzLnN0YXJ0Q2FtZXJhU3RhdGUgPSBudWxsO1xuICAgICAgICBfdGhpcy5jbGlja3MgPSAwO1xuICAgICAgICBfdGhpcy5kb3VibGVDbGlja1RpbWVvdXQgPSBudWxsO1xuICAgICAgICBfdGhpcy5jdXJyZW50V2hlZWxEaXJlY3Rpb24gPSAwO1xuICAgICAgICAvLyBCaW5kaW5nIG1ldGhvZHNcbiAgICAgICAgX3RoaXMuaGFuZGxlQ2xpY2sgPSBfdGhpcy5oYW5kbGVDbGljay5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuaGFuZGxlUmlnaHRDbGljayA9IF90aGlzLmhhbmRsZVJpZ2h0Q2xpY2suYmluZChfdGhpcyk7XG4gICAgICAgIF90aGlzLmhhbmRsZURvd24gPSBfdGhpcy5oYW5kbGVEb3duLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kbGVVcCA9IF90aGlzLmhhbmRsZVVwLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kbGVNb3ZlID0gX3RoaXMuaGFuZGxlTW92ZS5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuaGFuZGxlV2hlZWwgPSBfdGhpcy5oYW5kbGVXaGVlbC5iaW5kKF90aGlzKTtcbiAgICAgICAgX3RoaXMuaGFuZGxlT3V0ID0gX3RoaXMuaGFuZGxlT3V0LmJpbmQoX3RoaXMpO1xuICAgICAgICAvLyBCaW5kaW5nIGV2ZW50c1xuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIF90aGlzLmhhbmRsZUNsaWNrLCBmYWxzZSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwiY29udGV4dG1lbnVcIiwgX3RoaXMuaGFuZGxlUmlnaHRDbGljaywgZmFsc2UpO1xuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBfdGhpcy5oYW5kbGVEb3duLCBmYWxzZSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgX3RoaXMuaGFuZGxlV2hlZWwsIGZhbHNlKTtcbiAgICAgICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW91dFwiLCBfdGhpcy5oYW5kbGVPdXQsIGZhbHNlKTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBfdGhpcy5oYW5kbGVNb3ZlLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIF90aGlzLmhhbmRsZVVwLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgTW91c2VDYXB0b3IucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcjtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLmhhbmRsZUNsaWNrKTtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCB0aGlzLmhhbmRsZVJpZ2h0Q2xpY2spO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCB0aGlzLmhhbmRsZURvd24pO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIHRoaXMuaGFuZGxlV2hlZWwpO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlb3V0XCIsIHRoaXMuaGFuZGxlT3V0KTtcbiAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLmhhbmRsZU1vdmUpO1xuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLmhhbmRsZVVwKTtcbiAgICB9O1xuICAgIE1vdXNlQ2FwdG9yLnByb3RvdHlwZS5oYW5kbGVDbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB0aGlzLmNsaWNrcysrO1xuICAgICAgICBpZiAodGhpcy5jbGlja3MgPT09IDIpIHtcbiAgICAgICAgICAgIHRoaXMuY2xpY2tzID0gMDtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5kb3VibGVDbGlja1RpbWVvdXQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5kb3VibGVDbGlja1RpbWVvdXQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZG91YmxlQ2xpY2tUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhhbmRsZURvdWJsZUNsaWNrKGUpO1xuICAgICAgICB9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuY2xpY2tzID0gMDtcbiAgICAgICAgICAgIF90aGlzLmRvdWJsZUNsaWNrVGltZW91dCA9IG51bGw7XG4gICAgICAgIH0sIERPVUJMRV9DTElDS19USU1FT1VUKTtcbiAgICAgICAgLy8gTk9URTogdGhpcyBpcyBoZXJlIHRvIHByZXZlbnQgY2xpY2sgZXZlbnRzIG9uIGRyYWdcbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dlZEV2ZW50cyA8IERSQUdHRURfRVZFTlRTX1RPTEVSQU5DRSlcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImNsaWNrXCIsICgwLCBjYXB0b3JfMS5nZXRNb3VzZUNvb3JkcykoZSwgdGhpcy5jb250YWluZXIpKTtcbiAgICB9O1xuICAgIE1vdXNlQ2FwdG9yLnByb3RvdHlwZS5oYW5kbGVSaWdodENsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuZW1pdChcInJpZ2h0Q2xpY2tcIiwgKDAsIGNhcHRvcl8xLmdldE1vdXNlQ29vcmRzKShlLCB0aGlzLmNvbnRhaW5lcikpO1xuICAgIH07XG4gICAgTW91c2VDYXB0b3IucHJvdG90eXBlLmhhbmRsZURvdWJsZUNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdmFyIG1vdXNlQ29vcmRzID0gKDAsIGNhcHRvcl8xLmdldE1vdXNlQ29vcmRzKShlLCB0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuZW1pdChcImRvdWJsZUNsaWNrXCIsIG1vdXNlQ29vcmRzKTtcbiAgICAgICAgaWYgKG1vdXNlQ29vcmRzLnNpZ21hRGVmYXVsdFByZXZlbnRlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gZGVmYXVsdCBiZWhhdmlvclxuICAgICAgICB2YXIgY2FtZXJhID0gdGhpcy5yZW5kZXJlci5nZXRDYW1lcmEoKTtcbiAgICAgICAgdmFyIG5ld1JhdGlvID0gY2FtZXJhLmdldEJvdW5kZWRSYXRpbyhjYW1lcmEuZ2V0U3RhdGUoKS5yYXRpbyAvIERPVUJMRV9DTElDS19aT09NSU5HX1JBVElPKTtcbiAgICAgICAgY2FtZXJhLmFuaW1hdGUodGhpcy5yZW5kZXJlci5nZXRWaWV3cG9ydFpvb21lZFN0YXRlKCgwLCBjYXB0b3JfMS5nZXRQb3NpdGlvbikoZSwgdGhpcy5jb250YWluZXIpLCBuZXdSYXRpbyksIHtcbiAgICAgICAgICAgIGVhc2luZzogXCJxdWFkcmF0aWNJbk91dFwiLFxuICAgICAgICAgICAgZHVyYXRpb246IERPVUJMRV9DTElDS19aT09NSU5HX0RVUkFUSU9OLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIE1vdXNlQ2FwdG9yLnByb3RvdHlwZS5oYW5kbGVEb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMuc3RhcnRDYW1lcmFTdGF0ZSA9IHRoaXMucmVuZGVyZXIuZ2V0Q2FtZXJhKCkuZ2V0U3RhdGUoKTtcbiAgICAgICAgdmFyIF9hID0gKDAsIGNhcHRvcl8xLmdldFBvc2l0aW9uKShlLCB0aGlzLmNvbnRhaW5lciksIHggPSBfYS54LCB5ID0gX2EueTtcbiAgICAgICAgdGhpcy5sYXN0TW91c2VYID0geDtcbiAgICAgICAgdGhpcy5sYXN0TW91c2VZID0geTtcbiAgICAgICAgdGhpcy5kcmFnZ2VkRXZlbnRzID0gMDtcbiAgICAgICAgdGhpcy5kb3duU3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICAgICAgLy8gVE9ETzogZGlzcGF0Y2ggZXZlbnRzXG4gICAgICAgIC8vIExlZnQgYnV0dG9uIHByZXNzZWRcbiAgICAgICAgdGhpcy5pc01vdXNlRG93biA9IHRydWU7XG4gICAgICAgIHRoaXMuZW1pdChcIm1vdXNlZG93blwiLCAoMCwgY2FwdG9yXzEuZ2V0TW91c2VDb29yZHMpKGUsIHRoaXMuY29udGFpbmVyKSk7XG4gICAgfTtcbiAgICBNb3VzZUNhcHRvci5wcm90b3R5cGUuaGFuZGxlVXAgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZCB8fCAhdGhpcy5pc01vdXNlRG93bilcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgdmFyIGNhbWVyYSA9IHRoaXMucmVuZGVyZXIuZ2V0Q2FtZXJhKCk7XG4gICAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLm1vdmluZ1RpbWVvdXQgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLm1vdmluZ1RpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5tb3ZpbmdUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX2EgPSAoMCwgY2FwdG9yXzEuZ2V0UG9zaXRpb24pKGUsIHRoaXMuY29udGFpbmVyKSwgeCA9IF9hLngsIHkgPSBfYS55O1xuICAgICAgICB2YXIgY2FtZXJhU3RhdGUgPSBjYW1lcmEuZ2V0U3RhdGUoKSwgcHJldmlvdXNDYW1lcmFTdGF0ZSA9IGNhbWVyYS5nZXRQcmV2aW91c1N0YXRlKCkgfHwgeyB4OiAwLCB5OiAwIH07XG4gICAgICAgIGlmICh0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICBjYW1lcmEuYW5pbWF0ZSh7XG4gICAgICAgICAgICAgICAgeDogY2FtZXJhU3RhdGUueCArIE1PVVNFX0lORVJUSUFfUkFUSU8gKiAoY2FtZXJhU3RhdGUueCAtIHByZXZpb3VzQ2FtZXJhU3RhdGUueCksXG4gICAgICAgICAgICAgICAgeTogY2FtZXJhU3RhdGUueSArIE1PVVNFX0lORVJUSUFfUkFUSU8gKiAoY2FtZXJhU3RhdGUueSAtIHByZXZpb3VzQ2FtZXJhU3RhdGUueSksXG4gICAgICAgICAgICB9LCB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IE1PVVNFX0lORVJUSUFfRFVSQVRJT04sXG4gICAgICAgICAgICAgICAgZWFzaW5nOiBcInF1YWRyYXRpY091dFwiLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5sYXN0TW91c2VYICE9PSB4IHx8IHRoaXMubGFzdE1vdXNlWSAhPT0geSkge1xuICAgICAgICAgICAgY2FtZXJhLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICB4OiBjYW1lcmFTdGF0ZS54LFxuICAgICAgICAgICAgICAgIHk6IGNhbWVyYVN0YXRlLnksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuZHJhZ2dlZEV2ZW50cyA9IDA7XG4gICAgICAgICAgICBfdGhpcy5yZW5kZXJlci5yZWZyZXNoKCk7XG4gICAgICAgIH0sIDApO1xuICAgICAgICB0aGlzLmVtaXQoXCJtb3VzZXVwXCIsICgwLCBjYXB0b3JfMS5nZXRNb3VzZUNvb3JkcykoZSwgdGhpcy5jb250YWluZXIpKTtcbiAgICB9O1xuICAgIE1vdXNlQ2FwdG9yLnByb3RvdHlwZS5oYW5kbGVNb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHZhciBtb3VzZUNvb3JkcyA9ICgwLCBjYXB0b3JfMS5nZXRNb3VzZUNvb3JkcykoZSwgdGhpcy5jb250YWluZXIpO1xuICAgICAgICAvLyBBbHdheXMgdHJpZ2dlciBhIFwibW91c2Vtb3ZlYm9keVwiIGV2ZW50LCBzbyB0aGF0IGl0IGlzIHBvc3NpYmxlIHRvIGRldmVsb3BcbiAgICAgICAgLy8gYSBkcmFnLWFuZC1kcm9wIGVmZmVjdCB0aGF0IHdvcmtzIGV2ZW4gd2hlbiB0aGUgbW91c2UgaXMgb3V0IG9mIHRoZVxuICAgICAgICAvLyBjb250YWluZXI6XG4gICAgICAgIHRoaXMuZW1pdChcIm1vdXNlbW92ZWJvZHlcIiwgbW91c2VDb29yZHMpO1xuICAgICAgICAvLyBPbmx5IHRyaWdnZXIgdGhlIFwibW91c2Vtb3ZlXCIgZXZlbnQgd2hlbiB0aGUgbW91c2UgaXMgYWN0dWFsbHkgaG92ZXJpbmdcbiAgICAgICAgLy8gdGhlIGNvbnRhaW5lciwgdG8gYXZvaWQgd2VpcmRseSBob3ZlcmluZyBub2RlcyBhbmQvb3IgZWRnZXMgd2hlbiB0aGVcbiAgICAgICAgLy8gbW91c2UgaXMgbm90IGhvdmVyIHRoZSBjb250YWluZXI6XG4gICAgICAgIGlmIChlLnRhcmdldCA9PT0gdGhpcy5jb250YWluZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcIm1vdXNlbW92ZVwiLCBtb3VzZUNvb3Jkcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG1vdXNlQ29vcmRzLnNpZ21hRGVmYXVsdFByZXZlbnRlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZW4gXCJpc01vdXNlRG93blwiIGFsbCB0aGUgdGltZSwgdG8gYWxsb3cgZHJhZ2dpbmcgdGhlXG4gICAgICAgIC8vIHN0YWdlIHdoaWxlIHRoZSBtb3VzZSBpcyBub3QgaG92ZXIgdGhlIGNvbnRhaW5lcjpcbiAgICAgICAgaWYgKHRoaXMuaXNNb3VzZURvd24pIHtcbiAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5kcmFnZ2VkRXZlbnRzKys7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMubW92aW5nVGltZW91dCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLm1vdmluZ1RpbWVvdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5tb3ZpbmdUaW1lb3V0ID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLm1vdmluZ1RpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIF90aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBEUkFHX1RJTUVPVVQpO1xuICAgICAgICAgICAgdmFyIGNhbWVyYSA9IHRoaXMucmVuZGVyZXIuZ2V0Q2FtZXJhKCk7XG4gICAgICAgICAgICB2YXIgX2EgPSAoMCwgY2FwdG9yXzEuZ2V0UG9zaXRpb24pKGUsIHRoaXMuY29udGFpbmVyKSwgZVggPSBfYS54LCBlWSA9IF9hLnk7XG4gICAgICAgICAgICB2YXIgbGFzdE1vdXNlID0gdGhpcy5yZW5kZXJlci52aWV3cG9ydFRvRnJhbWVkR3JhcGgoe1xuICAgICAgICAgICAgICAgIHg6IHRoaXMubGFzdE1vdXNlWCxcbiAgICAgICAgICAgICAgICB5OiB0aGlzLmxhc3RNb3VzZVksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBtb3VzZSA9IHRoaXMucmVuZGVyZXIudmlld3BvcnRUb0ZyYW1lZEdyYXBoKHsgeDogZVgsIHk6IGVZIH0pO1xuICAgICAgICAgICAgdmFyIG9mZnNldFggPSBsYXN0TW91c2UueCAtIG1vdXNlLngsIG9mZnNldFkgPSBsYXN0TW91c2UueSAtIG1vdXNlLnk7XG4gICAgICAgICAgICB2YXIgY2FtZXJhU3RhdGUgPSBjYW1lcmEuZ2V0U3RhdGUoKTtcbiAgICAgICAgICAgIHZhciB4ID0gY2FtZXJhU3RhdGUueCArIG9mZnNldFgsIHkgPSBjYW1lcmFTdGF0ZS55ICsgb2Zmc2V0WTtcbiAgICAgICAgICAgIGNhbWVyYS5zZXRTdGF0ZSh7IHg6IHgsIHk6IHkgfSk7XG4gICAgICAgICAgICB0aGlzLmxhc3RNb3VzZVggPSBlWDtcbiAgICAgICAgICAgIHRoaXMubGFzdE1vdXNlWSA9IGVZO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTW91c2VDYXB0b3IucHJvdG90eXBlLmhhbmRsZVdoZWVsID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgdmFyIGRlbHRhID0gKDAsIGNhcHRvcl8xLmdldFdoZWVsRGVsdGEpKGUpO1xuICAgICAgICBpZiAoIWRlbHRhKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgd2hlZWxDb29yZHMgPSAoMCwgY2FwdG9yXzEuZ2V0V2hlZWxDb29yZHMpKGUsIHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgdGhpcy5lbWl0KFwid2hlZWxcIiwgd2hlZWxDb29yZHMpO1xuICAgICAgICBpZiAod2hlZWxDb29yZHMuc2lnbWFEZWZhdWx0UHJldmVudGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyBEZWZhdWx0IGJlaGF2aW9yXG4gICAgICAgIHZhciByYXRpb0RpZmYgPSBkZWx0YSA+IDAgPyAxIC8gWk9PTUlOR19SQVRJTyA6IFpPT01JTkdfUkFUSU87XG4gICAgICAgIHZhciBjYW1lcmEgPSB0aGlzLnJlbmRlcmVyLmdldENhbWVyYSgpO1xuICAgICAgICB2YXIgbmV3UmF0aW8gPSBjYW1lcmEuZ2V0Qm91bmRlZFJhdGlvKGNhbWVyYS5nZXRTdGF0ZSgpLnJhdGlvICogcmF0aW9EaWZmKTtcbiAgICAgICAgdmFyIHdoZWVsRGlyZWN0aW9uID0gZGVsdGEgPiAwID8gMSA6IC0xO1xuICAgICAgICB2YXIgbm93ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgLy8gQ2FuY2VsIGV2ZW50cyB0aGF0IGFyZSB0b28gY2xvc2UgdG9vIGVhY2ggb3RoZXIgYW5kIGluIHRoZSBzYW1lIGRpcmVjdGlvbjpcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFdoZWVsRGlyZWN0aW9uID09PSB3aGVlbERpcmVjdGlvbiAmJlxuICAgICAgICAgICAgdGhpcy5sYXN0V2hlZWxUcmlnZ2VyVGltZSAmJlxuICAgICAgICAgICAgbm93IC0gdGhpcy5sYXN0V2hlZWxUcmlnZ2VyVGltZSA8IE1PVVNFX1pPT01fRFVSQVRJT04gLyA1KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY2FtZXJhLmFuaW1hdGUodGhpcy5yZW5kZXJlci5nZXRWaWV3cG9ydFpvb21lZFN0YXRlKCgwLCBjYXB0b3JfMS5nZXRQb3NpdGlvbikoZSwgdGhpcy5jb250YWluZXIpLCBuZXdSYXRpbyksIHtcbiAgICAgICAgICAgIGVhc2luZzogXCJxdWFkcmF0aWNPdXRcIixcbiAgICAgICAgICAgIGR1cmF0aW9uOiBNT1VTRV9aT09NX0RVUkFUSU9OLFxuICAgICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5jdXJyZW50V2hlZWxEaXJlY3Rpb24gPSAwO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdXJyZW50V2hlZWxEaXJlY3Rpb24gPSB3aGVlbERpcmVjdGlvbjtcbiAgICAgICAgdGhpcy5sYXN0V2hlZWxUcmlnZ2VyVGltZSA9IG5vdztcbiAgICB9O1xuICAgIE1vdXNlQ2FwdG9yLnByb3RvdHlwZS5oYW5kbGVPdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFRPRE86IGRpc3BhdGNoIGV2ZW50XG4gICAgfTtcbiAgICByZXR1cm4gTW91c2VDYXB0b3I7XG59KGNhcHRvcl8xLmRlZmF1bHQpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IE1vdXNlQ2FwdG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIF9fY3JlYXRlQmluZGluZyA9ICh0aGlzICYmIHRoaXMuX19jcmVhdGVCaW5kaW5nKSB8fCAoT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG0sIGspO1xuICAgIGlmICghZGVzYyB8fCAoXCJnZXRcIiBpbiBkZXNjID8gIW0uX19lc01vZHVsZSA6IGRlc2Mud3JpdGFibGUgfHwgZGVzYy5jb25maWd1cmFibGUpKSB7XG4gICAgICBkZXNjID0geyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIGRlc2MpO1xufSkgOiAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIG9bazJdID0gbVtrXTtcbn0pKTtcbnZhciBfX3NldE1vZHVsZURlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9fc2V0TW9kdWxlRGVmYXVsdCkgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgdikge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBcImRlZmF1bHRcIiwgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdiB9KTtcbn0pIDogZnVuY3Rpb24obywgdikge1xuICAgIG9bXCJkZWZhdWx0XCJdID0gdjtcbn0pO1xudmFyIF9faW1wb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnRTdGFyKSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgaWYgKG1vZCAhPSBudWxsKSBmb3IgKHZhciBrIGluIG1vZCkgaWYgKGsgIT09IFwiZGVmYXVsdFwiICYmIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSBfX2NyZWF0ZUJpbmRpbmcocmVzdWx0LCBtb2QsIGspO1xuICAgIF9fc2V0TW9kdWxlRGVmYXVsdChyZXN1bHQsIG1vZCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgX19yZWFkID0gKHRoaXMgJiYgdGhpcy5fX3JlYWQpIHx8IGZ1bmN0aW9uIChvLCBuKSB7XG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICAgIGlmICghbSkgcmV0dXJuIG87XG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgY2FwdG9yXzEgPSBfX2ltcG9ydFN0YXIocmVxdWlyZShcIi4vY2FwdG9yXCIpKTtcbnZhciBEUkFHX1RJTUVPVVQgPSAyMDA7XG52YXIgVE9VQ0hfSU5FUlRJQV9SQVRJTyA9IDM7XG52YXIgVE9VQ0hfSU5FUlRJQV9EVVJBVElPTiA9IDIwMDtcbi8qKlxuICogVG91Y2ggY2FwdG9yIGNsYXNzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgVG91Y2hDYXB0b3IgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFRvdWNoQ2FwdG9yLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFRvdWNoQ2FwdG9yKGNvbnRhaW5lciwgcmVuZGVyZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgY29udGFpbmVyLCByZW5kZXJlcikgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIF90aGlzLmlzTW92aW5nID0gZmFsc2U7XG4gICAgICAgIF90aGlzLnRvdWNoTW9kZSA9IDA7IC8vIG51bWJlciBvZiB0b3VjaGVzIGRvd25cbiAgICAgICAgLy8gQmluZGluZyBtZXRob2RzOlxuICAgICAgICBfdGhpcy5oYW5kbGVTdGFydCA9IF90aGlzLmhhbmRsZVN0YXJ0LmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kbGVMZWF2ZSA9IF90aGlzLmhhbmRsZUxlYXZlLmJpbmQoX3RoaXMpO1xuICAgICAgICBfdGhpcy5oYW5kbGVNb3ZlID0gX3RoaXMuaGFuZGxlTW92ZS5iaW5kKF90aGlzKTtcbiAgICAgICAgLy8gQmluZGluZyBldmVudHNcbiAgICAgICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIF90aGlzLmhhbmRsZVN0YXJ0LCBmYWxzZSk7XG4gICAgICAgIGNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgX3RoaXMuaGFuZGxlTGVhdmUsIGZhbHNlKTtcbiAgICAgICAgY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBfdGhpcy5oYW5kbGVMZWF2ZSwgZmFsc2UpO1xuICAgICAgICBjb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBfdGhpcy5oYW5kbGVNb3ZlLCBmYWxzZSk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgVG91Y2hDYXB0b3IucHJvdG90eXBlLmtpbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBjb250YWluZXIgPSB0aGlzLmNvbnRhaW5lcjtcbiAgICAgICAgY29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHRoaXMuaGFuZGxlU3RhcnQpO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMuaGFuZGxlTGVhdmUpO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoY2FuY2VsXCIsIHRoaXMuaGFuZGxlTGVhdmUpO1xuICAgICAgICBjb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzLmhhbmRsZU1vdmUpO1xuICAgIH07XG4gICAgVG91Y2hDYXB0b3IucHJvdG90eXBlLmdldERpbWVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5jb250YWluZXIub2Zmc2V0V2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY29udGFpbmVyLm9mZnNldEhlaWdodCxcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFRvdWNoQ2FwdG9yLnByb3RvdHlwZS5kaXNwYXRjaFJlbGF0ZWRNb3VzZUV2ZW50ID0gZnVuY3Rpb24gKHR5cGUsIGUsIHBvc2l0aW9uLCBlbWl0dGVyKSB7XG4gICAgICAgIHZhciBtb3VzZVBvc2l0aW9uID0gcG9zaXRpb24gfHwgKDAsIGNhcHRvcl8xLmdldFBvc2l0aW9uKShlLnRvdWNoZXNbMF0sIHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgdmFyIG1vdXNlRXZlbnQgPSBuZXcgTW91c2VFdmVudCh0eXBlLCB7XG4gICAgICAgICAgICBjbGllbnRYOiBtb3VzZVBvc2l0aW9uLngsXG4gICAgICAgICAgICBjbGllbnRZOiBtb3VzZVBvc2l0aW9uLnksXG4gICAgICAgICAgICBhbHRLZXk6IGUuYWx0S2V5LFxuICAgICAgICAgICAgY3RybEtleTogZS5jdHJsS2V5LFxuICAgICAgICB9KTtcbiAgICAgICAgbW91c2VFdmVudC5pc0Zha2VTaWdtYU1vdXNlRXZlbnQgPSB0cnVlO1xuICAgICAgICAoZW1pdHRlciB8fCB0aGlzLmNvbnRhaW5lcikuZGlzcGF0Y2hFdmVudChtb3VzZUV2ZW50KTtcbiAgICB9O1xuICAgIFRvdWNoQ2FwdG9yLnByb3RvdHlwZS5oYW5kbGVTdGFydCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAvLyBQcmV2ZW50IGRlZmF1bHQgdG8gYXZvaWQgZGVmYXVsdCBicm93c2VyIGJlaGF2aW9ycy4uLlxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIC8vIC4uLmJ1dCBzaW11bGF0ZSBtb3VzZSBiZWhhdmlvciBhbnl3YXksIHRvIGdldCB0aGUgTW91c2VDYXB0b3Igd29ya2luZyBhcyB3ZWxsOlxuICAgICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSZWxhdGVkTW91c2VFdmVudChcIm1vdXNlZG93blwiLCBlKTtcbiAgICAgICAgdmFyIHRvdWNoZXMgPSAoMCwgY2FwdG9yXzEuZ2V0VG91Y2hlc0FycmF5KShlLnRvdWNoZXMpO1xuICAgICAgICB0aGlzLmlzTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy50b3VjaE1vZGUgPSB0b3VjaGVzLmxlbmd0aDtcbiAgICAgICAgdGhpcy5zdGFydENhbWVyYVN0YXRlID0gdGhpcy5yZW5kZXJlci5nZXRDYW1lcmEoKS5nZXRTdGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXJ0VG91Y2hlc1Bvc2l0aW9ucyA9IHRvdWNoZXMubWFwKGZ1bmN0aW9uICh0b3VjaCkgeyByZXR1cm4gKDAsIGNhcHRvcl8xLmdldFBvc2l0aW9uKSh0b3VjaCwgX3RoaXMuY29udGFpbmVyKTsgfSk7XG4gICAgICAgIHRoaXMubGFzdFRvdWNoZXNQb3NpdGlvbnMgPSB0aGlzLnN0YXJ0VG91Y2hlc1Bvc2l0aW9ucztcbiAgICAgICAgLy8gV2hlbiB0aGVyZSBhcmUgdHdvIHRvdWNoZXMgZG93biwgbGV0J3MgcmVjb3JkIGRpc3RhbmNlIGFuZCBhbmdsZSBhcyB3ZWxsOlxuICAgICAgICBpZiAodGhpcy50b3VjaE1vZGUgPT09IDIpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IF9fcmVhZCh0aGlzLnN0YXJ0VG91Y2hlc1Bvc2l0aW9ucywgMiksIF9iID0gX2FbMF0sIHgwID0gX2IueCwgeTAgPSBfYi55LCBfYyA9IF9hWzFdLCB4MSA9IF9jLngsIHkxID0gX2MueTtcbiAgICAgICAgICAgIHRoaXMuc3RhcnRUb3VjaGVzQW5nbGUgPSBNYXRoLmF0YW4yKHkxIC0geTAsIHgxIC0geDApO1xuICAgICAgICAgICAgdGhpcy5zdGFydFRvdWNoZXNEaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyh4MSAtIHgwLCAyKSArIE1hdGgucG93KHkxIC0geTAsIDIpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoXCJ0b3VjaGRvd25cIiwgKDAsIGNhcHRvcl8xLmdldFRvdWNoQ29vcmRzKShlLCB0aGlzLmNvbnRhaW5lcikpO1xuICAgIH07XG4gICAgVG91Y2hDYXB0b3IucHJvdG90eXBlLmhhbmRsZUxlYXZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIC8vIFByZXZlbnQgZGVmYXVsdCB0byBhdm9pZCBkZWZhdWx0IGJyb3dzZXIgYmVoYXZpb3JzLi4uXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgLy8gLi4uYnV0IHNpbXVsYXRlIG1vdXNlIGJlaGF2aW9yIGFueXdheSwgdG8gZ2V0IHRoZSBNb3VzZUNhcHRvciB3b3JraW5nIGFzIHdlbGw6XG4gICAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID09PSAwICYmIHRoaXMubGFzdFRvdWNoZXNQb3NpdGlvbnMgJiYgdGhpcy5sYXN0VG91Y2hlc1Bvc2l0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSZWxhdGVkTW91c2VFdmVudChcIm1vdXNldXBcIiwgZSwgdGhpcy5sYXN0VG91Y2hlc1Bvc2l0aW9uc1swXSwgZG9jdW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJlbGF0ZWRNb3VzZUV2ZW50KFwiY2xpY2tcIiwgZSwgdGhpcy5sYXN0VG91Y2hlc1Bvc2l0aW9uc1swXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubW92aW5nVGltZW91dCkge1xuICAgICAgICAgICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMubW92aW5nVGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh0aGlzLnRvdWNoTW9kZSkge1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU3RhcnQoZSk7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogZmFsbHMgdGhyb3VnaCAqL1xuICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgIC8vIFRPRE9cbiAgICAgICAgICAgICAgICAvLyBEaXNwYXRjaCBldmVudFxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzTW92aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjYW1lcmEgPSB0aGlzLnJlbmRlcmVyLmdldENhbWVyYSgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2FtZXJhU3RhdGUgPSBjYW1lcmEuZ2V0U3RhdGUoKSwgcHJldmlvdXNDYW1lcmFTdGF0ZSA9IGNhbWVyYS5nZXRQcmV2aW91c1N0YXRlKCkgfHwgeyB4OiAwLCB5OiAwIH07XG4gICAgICAgICAgICAgICAgICAgIGNhbWVyYS5hbmltYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHg6IGNhbWVyYVN0YXRlLnggKyBUT1VDSF9JTkVSVElBX1JBVElPICogKGNhbWVyYVN0YXRlLnggLSBwcmV2aW91c0NhbWVyYVN0YXRlLngpLFxuICAgICAgICAgICAgICAgICAgICAgICAgeTogY2FtZXJhU3RhdGUueSArIFRPVUNIX0lORVJUSUFfUkFUSU8gKiAoY2FtZXJhU3RhdGUueSAtIHByZXZpb3VzQ2FtZXJhU3RhdGUueSksXG4gICAgICAgICAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBUT1VDSF9JTkVSVElBX0RVUkFUSU9OLFxuICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiBcInF1YWRyYXRpY091dFwiLFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMudG91Y2hNb2RlID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoXCJ0b3VjaHVwXCIsICgwLCBjYXB0b3JfMS5nZXRUb3VjaENvb3JkcykoZSwgdGhpcy5jb250YWluZXIpKTtcbiAgICB9O1xuICAgIFRvdWNoQ2FwdG9yLnByb3RvdHlwZS5oYW5kbGVNb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgLy8gUHJldmVudCBkZWZhdWx0IHRvIGF2b2lkIGRlZmF1bHQgYnJvd3NlciBiZWhhdmlvcnMuLi5cbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAvLyAuLi5idXQgc2ltdWxhdGUgbW91c2UgYmVoYXZpb3IgYW55d2F5LCB0byBnZXQgdGhlIE1vdXNlQ2FwdG9yIHdvcmtpbmcgYXMgd2VsbDpcbiAgICAgICAgaWYgKGUudG91Y2hlcy5sZW5ndGggPT09IDEpXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUmVsYXRlZE1vdXNlRXZlbnQoXCJtb3VzZW1vdmVcIiwgZSk7XG4gICAgICAgIHZhciBjYW1lcmEgPSB0aGlzLnJlbmRlcmVyLmdldENhbWVyYSgpO1xuICAgICAgICB2YXIgc3RhcnRDYW1lcmFTdGF0ZSA9IHRoaXMuc3RhcnRDYW1lcmFTdGF0ZTtcbiAgICAgICAgdmFyIHRvdWNoZXMgPSAoMCwgY2FwdG9yXzEuZ2V0VG91Y2hlc0FycmF5KShlLnRvdWNoZXMpO1xuICAgICAgICB2YXIgdG91Y2hlc1Bvc2l0aW9ucyA9IHRvdWNoZXMubWFwKGZ1bmN0aW9uICh0b3VjaCkgeyByZXR1cm4gKDAsIGNhcHRvcl8xLmdldFBvc2l0aW9uKSh0b3VjaCwgX3RoaXMuY29udGFpbmVyKTsgfSk7XG4gICAgICAgIHRoaXMubGFzdFRvdWNoZXNQb3NpdGlvbnMgPSB0b3VjaGVzUG9zaXRpb25zO1xuICAgICAgICB0aGlzLmlzTW92aW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMubW92aW5nVGltZW91dClcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLm1vdmluZ1RpbWVvdXQpO1xuICAgICAgICB0aGlzLm1vdmluZ1RpbWVvdXQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5pc01vdmluZyA9IGZhbHNlO1xuICAgICAgICB9LCBEUkFHX1RJTUVPVVQpO1xuICAgICAgICBzd2l0Y2ggKHRoaXMudG91Y2hNb2RlKSB7XG4gICAgICAgICAgICBjYXNlIDE6IHtcbiAgICAgICAgICAgICAgICB2YXIgX2IgPSB0aGlzLnJlbmRlcmVyLnZpZXdwb3J0VG9GcmFtZWRHcmFwaCgodGhpcy5zdGFydFRvdWNoZXNQb3NpdGlvbnMgfHwgW10pWzBdKSwgeFN0YXJ0ID0gX2IueCwgeVN0YXJ0ID0gX2IueTtcbiAgICAgICAgICAgICAgICB2YXIgX2MgPSB0aGlzLnJlbmRlcmVyLnZpZXdwb3J0VG9GcmFtZWRHcmFwaCh0b3VjaGVzUG9zaXRpb25zWzBdKSwgeCA9IF9jLngsIHkgPSBfYy55O1xuICAgICAgICAgICAgICAgIGNhbWVyYS5zZXRTdGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIHg6IHN0YXJ0Q2FtZXJhU3RhdGUueCArIHhTdGFydCAtIHgsXG4gICAgICAgICAgICAgICAgICAgIHk6IHN0YXJ0Q2FtZXJhU3RhdGUueSArIHlTdGFydCAtIHksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIDI6IHtcbiAgICAgICAgICAgICAgICAvKipcbiAgICAgICAgICAgICAgICAgKiBIZXJlIGlzIHRoZSB0aGlua2luZyBoZXJlOlxuICAgICAgICAgICAgICAgICAqXG4gICAgICAgICAgICAgICAgICogMS4gV2UgY2FuIGZpbmQgdGhlIG5ldyBhbmdsZSBhbmQgcmF0aW8sIGJ5IGNvbXBhcmluZyB0aGUgdmVjdG9yIGZyb20gXCJ0b3VjaCBvbmVcIiB0byBcInRvdWNoIHR3b1wiIGF0IHRoZSBzdGFydFxuICAgICAgICAgICAgICAgICAqICAgIG9mIHRoZSBkJ24nZCBhbmQgbm93XG4gICAgICAgICAgICAgICAgICpcbiAgICAgICAgICAgICAgICAgKiAyLiBXZSBjYW4gdXNlIGBDYW1lcmEjdmlld3BvcnRUb0dyYXBoYCBpbnNpZGUgZm9ybXVsYSB0byByZXRyaWV2ZSB0aGUgbmV3IGNhbWVyYSBwb3NpdGlvbiwgdXNpbmcgdGhlIGdyYXBoXG4gICAgICAgICAgICAgICAgICogICAgcG9zaXRpb24gb2YgYSB0b3VjaCBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBkJ24nZCAodXNpbmcgYHN0YXJ0Q2FtZXJhLnZpZXdwb3J0VG9HcmFwaGApIGFuZCB0aGUgdmlld3BvcnRcbiAgICAgICAgICAgICAgICAgKiAgICBwb3NpdGlvbiBvZiB0aGlzIHNhbWUgdG91Y2ggbm93XG4gICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgdmFyIG5ld0NhbWVyYVN0YXRlID0ge307XG4gICAgICAgICAgICAgICAgdmFyIF9kID0gdG91Y2hlc1Bvc2l0aW9uc1swXSwgeDAgPSBfZC54LCB5MCA9IF9kLnk7XG4gICAgICAgICAgICAgICAgdmFyIF9lID0gdG91Y2hlc1Bvc2l0aW9uc1sxXSwgeDEgPSBfZS54LCB5MSA9IF9lLnk7XG4gICAgICAgICAgICAgICAgdmFyIGFuZ2xlRGlmZiA9IE1hdGguYXRhbjIoeTEgLSB5MCwgeDEgLSB4MCkgLSB0aGlzLnN0YXJ0VG91Y2hlc0FuZ2xlO1xuICAgICAgICAgICAgICAgIHZhciByYXRpb0RpZmYgPSBNYXRoLmh5cG90KHkxIC0geTAsIHgxIC0geDApIC8gdGhpcy5zdGFydFRvdWNoZXNEaXN0YW5jZTtcbiAgICAgICAgICAgICAgICAvLyAxLlxuICAgICAgICAgICAgICAgIHZhciBuZXdSYXRpbyA9IGNhbWVyYS5nZXRCb3VuZGVkUmF0aW8oc3RhcnRDYW1lcmFTdGF0ZS5yYXRpbyAvIHJhdGlvRGlmZik7XG4gICAgICAgICAgICAgICAgbmV3Q2FtZXJhU3RhdGUucmF0aW8gPSBuZXdSYXRpbztcbiAgICAgICAgICAgICAgICBuZXdDYW1lcmFTdGF0ZS5hbmdsZSA9IHN0YXJ0Q2FtZXJhU3RhdGUuYW5nbGUgKyBhbmdsZURpZmY7XG4gICAgICAgICAgICAgICAgLy8gMi5cbiAgICAgICAgICAgICAgICB2YXIgZGltZW5zaW9ucyA9IHRoaXMuZ2V0RGltZW5zaW9ucygpO1xuICAgICAgICAgICAgICAgIHZhciB0b3VjaEdyYXBoUG9zaXRpb24gPSB0aGlzLnJlbmRlcmVyLnZpZXdwb3J0VG9GcmFtZWRHcmFwaCgodGhpcy5zdGFydFRvdWNoZXNQb3NpdGlvbnMgfHwgW10pWzBdLCB7IGNhbWVyYVN0YXRlOiBzdGFydENhbWVyYVN0YXRlIH0pO1xuICAgICAgICAgICAgICAgIHZhciBzbWFsbGVzdERpbWVuc2lvbiA9IE1hdGgubWluKGRpbWVuc2lvbnMud2lkdGgsIGRpbWVuc2lvbnMuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB2YXIgZHggPSBzbWFsbGVzdERpbWVuc2lvbiAvIGRpbWVuc2lvbnMud2lkdGg7XG4gICAgICAgICAgICAgICAgdmFyIGR5ID0gc21hbGxlc3REaW1lbnNpb24gLyBkaW1lbnNpb25zLmhlaWdodDtcbiAgICAgICAgICAgICAgICB2YXIgcmF0aW8gPSBuZXdSYXRpbyAvIHNtYWxsZXN0RGltZW5zaW9uO1xuICAgICAgICAgICAgICAgIC8vIEFsaWduIHdpdGggY2VudGVyIG9mIHRoZSBncmFwaDpcbiAgICAgICAgICAgICAgICB2YXIgeCA9IHgwIC0gc21hbGxlc3REaW1lbnNpb24gLyAyIC8gZHg7XG4gICAgICAgICAgICAgICAgdmFyIHkgPSB5MCAtIHNtYWxsZXN0RGltZW5zaW9uIC8gMiAvIGR5O1xuICAgICAgICAgICAgICAgIC8vIFJvdGF0ZTpcbiAgICAgICAgICAgICAgICBfYSA9IF9fcmVhZChbXG4gICAgICAgICAgICAgICAgICAgIHggKiBNYXRoLmNvcygtbmV3Q2FtZXJhU3RhdGUuYW5nbGUpIC0geSAqIE1hdGguc2luKC1uZXdDYW1lcmFTdGF0ZS5hbmdsZSksXG4gICAgICAgICAgICAgICAgICAgIHkgKiBNYXRoLmNvcygtbmV3Q2FtZXJhU3RhdGUuYW5nbGUpICsgeCAqIE1hdGguc2luKC1uZXdDYW1lcmFTdGF0ZS5hbmdsZSksXG4gICAgICAgICAgICAgICAgXSwgMiksIHggPSBfYVswXSwgeSA9IF9hWzFdO1xuICAgICAgICAgICAgICAgIG5ld0NhbWVyYVN0YXRlLnggPSB0b3VjaEdyYXBoUG9zaXRpb24ueCAtIHggKiByYXRpbztcbiAgICAgICAgICAgICAgICBuZXdDYW1lcmFTdGF0ZS55ID0gdG91Y2hHcmFwaFBvc2l0aW9uLnkgKyB5ICogcmF0aW87XG4gICAgICAgICAgICAgICAgY2FtZXJhLnNldFN0YXRlKG5ld0NhbWVyYVN0YXRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVtaXQoXCJ0b3VjaG1vdmVcIiwgKDAsIGNhcHRvcl8xLmdldFRvdWNoQ29vcmRzKShlLCB0aGlzLmNvbnRhaW5lcikpO1xuICAgIH07XG4gICAgcmV0dXJuIFRvdWNoQ2FwdG9yO1xufShjYXB0b3JfMS5kZWZhdWx0KSk7XG5leHBvcnRzLmRlZmF1bHQgPSBUb3VjaENhcHRvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5lZGdlTGFiZWxzVG9EaXNwbGF5RnJvbU5vZGVzID0gZXhwb3J0cy5MYWJlbEdyaWQgPSB2b2lkIDA7XG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNpbmdsZSBjYW5kaWRhdGUgZm9yIHRoZSBsYWJlbCBncmlkIHNlbGVjdGlvbi5cbiAqXG4gKiBJdCBhbHNvIGRlc2NyaWJlcyBhIGRldGVybWluaXN0aWMgd2F5IHRvIGNvbXBhcmUgdHdvIGNhbmRpZGF0ZXMgdG8gYXNzZXNzXG4gKiB3aGljaCBvbmUgaXMgYmV0dGVyLlxuICovXG52YXIgTGFiZWxDYW5kaWRhdGUgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTGFiZWxDYW5kaWRhdGUoa2V5LCBzaXplKSB7XG4gICAgICAgIHRoaXMua2V5ID0ga2V5O1xuICAgICAgICB0aGlzLnNpemUgPSBzaXplO1xuICAgIH1cbiAgICBMYWJlbENhbmRpZGF0ZS5jb21wYXJlID0gZnVuY3Rpb24gKGZpcnN0LCBzZWNvbmQpIHtcbiAgICAgICAgLy8gRmlyc3Qgd2UgY29tcGFyZSBieSBzaXplXG4gICAgICAgIGlmIChmaXJzdC5zaXplID4gc2Vjb25kLnNpemUpXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIGlmIChmaXJzdC5zaXplIDwgc2Vjb25kLnNpemUpXG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgLy8gVGhlbiBzaW5jZSBubyB0d28gbm9kZXMgY2FuIGhhdmUgdGhlIHNhbWUga2V5LCB3ZSB1c2UgaXQgdG9cbiAgICAgICAgLy8gZGV0ZXJtaW5pc3RpY2FsbHkgdGllLWJyZWFrIGJ5IGtleVxuICAgICAgICBpZiAoZmlyc3Qua2V5ID4gc2Vjb25kLmtleSlcbiAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAvLyBOT1RFOiB0aGlzIGNvbXBhcmF0b3IgY2Fubm90IHJldHVybiAwXG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9O1xuICAgIHJldHVybiBMYWJlbENhbmRpZGF0ZTtcbn0oKSk7XG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIDJEIHNwYXRpYWwgZ3JpZCBkaXZpZGVkIGludG8gY29uc3RhbnQtc2l6ZSBjZWxscy5cbiAqL1xudmFyIExhYmVsR3JpZCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBMYWJlbEdyaWQoKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSAwO1xuICAgICAgICB0aGlzLmhlaWdodCA9IDA7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSAwO1xuICAgICAgICB0aGlzLmNvbHVtbnMgPSAwO1xuICAgICAgICB0aGlzLnJvd3MgPSAwO1xuICAgICAgICB0aGlzLmNlbGxzID0ge307XG4gICAgfVxuICAgIExhYmVsR3JpZC5wcm90b3R5cGUucmVzaXplQW5kQ2xlYXIgPSBmdW5jdGlvbiAoZGltZW5zaW9ucywgY2VsbFNpemUpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IGRpbWVuc2lvbnMud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBjZWxsU2l6ZTtcbiAgICAgICAgdGhpcy5jb2x1bW5zID0gTWF0aC5jZWlsKGRpbWVuc2lvbnMud2lkdGggLyBjZWxsU2l6ZSk7XG4gICAgICAgIHRoaXMucm93cyA9IE1hdGguY2VpbChkaW1lbnNpb25zLmhlaWdodCAvIGNlbGxTaXplKTtcbiAgICAgICAgdGhpcy5jZWxscyA9IHt9O1xuICAgIH07XG4gICAgTGFiZWxHcmlkLnByb3RvdHlwZS5nZXRJbmRleCA9IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgdmFyIHhJbmRleCA9IE1hdGguZmxvb3IocG9zLnggLyB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgdmFyIHlJbmRleCA9IE1hdGguZmxvb3IocG9zLnkgLyB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgcmV0dXJuIHlJbmRleCAqIHRoaXMuY29sdW1ucyArIHhJbmRleDtcbiAgICB9O1xuICAgIExhYmVsR3JpZC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKGtleSwgc2l6ZSwgcG9zKSB7XG4gICAgICAgIHZhciBjYW5kaWRhdGUgPSBuZXcgTGFiZWxDYW5kaWRhdGUoa2V5LCBzaXplKTtcbiAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleChwb3MpO1xuICAgICAgICB2YXIgY2VsbCA9IHRoaXMuY2VsbHNbaW5kZXhdO1xuICAgICAgICBpZiAoIWNlbGwpIHtcbiAgICAgICAgICAgIGNlbGwgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY2VsbHNbaW5kZXhdID0gY2VsbDtcbiAgICAgICAgfVxuICAgICAgICBjZWxsLnB1c2goY2FuZGlkYXRlKTtcbiAgICB9O1xuICAgIExhYmVsR3JpZC5wcm90b3R5cGUub3JnYW5pemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gdGhpcy5jZWxscykge1xuICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLmNlbGxzW2tdO1xuICAgICAgICAgICAgY2VsbC5zb3J0KExhYmVsQ2FuZGlkYXRlLmNvbXBhcmUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBMYWJlbEdyaWQucHJvdG90eXBlLmdldExhYmVsc1RvRGlzcGxheSA9IGZ1bmN0aW9uIChyYXRpbywgZGVuc2l0eSkge1xuICAgICAgICAvLyBUT0RPOiB3b3JrIG9uIHZpc2libGUgbm9kZXMgdG8gb3B0aW1pemU/IF4gLT4gdGhyZXNob2xkIG91dHNpZGUgc28gdGhhdCBtZW1vaXphdGlvbiB3b3Jrcz9cbiAgICAgICAgLy8gVE9ETzogYWRqdXN0IHRocmVzaG9sZCBsb3dlciwgYnV0IGluY3JlYXNlIGNlbGxzIGEgYml0P1xuICAgICAgICAvLyBUT0RPOiBodW50IGZvciBnZW9tIGlzc3VlIGluIGRpc2d1aXNlXG4gICAgICAgIC8vIFRPRE86IG1lbW9pemUgd2hpbGUgcmF0aW8gZG9lcyBub3QgbW92ZS4gbWV0aG9kIHRvIGZvcmNlIHJlY29tcHV0ZVxuICAgICAgICB2YXIgY2VsbEFyZWEgPSB0aGlzLmNlbGxTaXplICogdGhpcy5jZWxsU2l6ZTtcbiAgICAgICAgdmFyIHNjYWxlZENlbGxBcmVhID0gY2VsbEFyZWEgLyByYXRpbyAvIHJhdGlvO1xuICAgICAgICB2YXIgc2NhbGVkRGVuc2l0eSA9IChzY2FsZWRDZWxsQXJlYSAqIGRlbnNpdHkpIC8gY2VsbEFyZWE7XG4gICAgICAgIHZhciBsYWJlbHNUb0Rpc3BsYXlQZXJDZWxsID0gTWF0aC5jZWlsKHNjYWxlZERlbnNpdHkpO1xuICAgICAgICB2YXIgbGFiZWxzID0gW107XG4gICAgICAgIGZvciAodmFyIGsgaW4gdGhpcy5jZWxscykge1xuICAgICAgICAgICAgdmFyIGNlbGwgPSB0aGlzLmNlbGxzW2tdO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBNYXRoLm1pbihsYWJlbHNUb0Rpc3BsYXlQZXJDZWxsLCBjZWxsLmxlbmd0aCk7IGkrKykge1xuICAgICAgICAgICAgICAgIGxhYmVscy5wdXNoKGNlbGxbaV0ua2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbGFiZWxzO1xuICAgIH07XG4gICAgcmV0dXJuIExhYmVsR3JpZDtcbn0oKSk7XG5leHBvcnRzLkxhYmVsR3JpZCA9IExhYmVsR3JpZDtcbi8qKlxuICogTGFiZWwgaGV1cmlzdGljIHNlbGVjdGluZyBlZGdlIGxhYmVscyB0byBkaXNwbGF5LCBiYXNlZCBvbiBkaXNwbGF5ZWQgbm9kZVxuICogbGFiZWxzXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSBwYXJhbXMgICAgICAgICAgICAgICAgIC0gUGFyYW1ldGVyczpcbiAqIEBwYXJhbSAge1NldH0gICAgICBkaXNwbGF5ZWROb2RlTGFiZWxzICAtIEN1cnJlbnRseSBkaXNwbGF5ZWQgbm9kZSBsYWJlbHMuXG4gKiBAcGFyYW0gIHtTZXR9ICAgICAgaGlnaGxpZ2h0ZWROb2RlcyAgICAgLSBIaWdobGlnaHRlZCBub2Rlcy5cbiAqIEBwYXJhbSAge0dyYXBofSAgICBncmFwaCAgICAgICAgICAgICAgICAtIFRoZSByZW5kZXJlZCBncmFwaC5cbiAqIEBwYXJhbSAge3N0cmluZ30gICBob3ZlcmVkTm9kZSAgICAgICAgICAtIEhvdmVyZWQgbm9kZSAob3B0aW9uYWwpXG4gKiBAcmV0dXJuIHtBcnJheX0gICAgICAgICAgICAgICAgICAgICAgICAgLSBUaGUgc2VsZWN0ZWQgbGFiZWxzLlxuICovXG5mdW5jdGlvbiBlZGdlTGFiZWxzVG9EaXNwbGF5RnJvbU5vZGVzKHBhcmFtcykge1xuICAgIHZhciBncmFwaCA9IHBhcmFtcy5ncmFwaCwgaG92ZXJlZE5vZGUgPSBwYXJhbXMuaG92ZXJlZE5vZGUsIGhpZ2hsaWdodGVkTm9kZXMgPSBwYXJhbXMuaGlnaGxpZ2h0ZWROb2RlcywgZGlzcGxheWVkTm9kZUxhYmVscyA9IHBhcmFtcy5kaXNwbGF5ZWROb2RlTGFiZWxzO1xuICAgIHZhciB3b3J0aHlFZGdlcyA9IFtdO1xuICAgIC8vIFRPRE86IHRoZSBjb2RlIGJlbG93IGNhbiBiZSBvcHRpbWl6ZWQgdXNpbmcgIy5mb3JFYWNoIGFuZCBiYXRjaGluZyB0aGUgY29kZSBwZXIgYWRqXG4gICAgLy8gV2Ugc2hvdWxkIGRpc3BsYXkgYW4gZWRnZSdzIGxhYmVsIGlmOlxuICAgIC8vICAgLSBBbnkgb2YgaXRzIGV4dHJlbWl0aWVzIGlzIGhpZ2hsaWdodGVkIG9yIGhvdmVyZWRcbiAgICAvLyAgIC0gQm90aCBvZiBpdHMgZXh0cmVtaXRpZXMgaGFzIGl0cyBsYWJlbCBzaG93blxuICAgIGdyYXBoLmZvckVhY2hFZGdlKGZ1bmN0aW9uIChlZGdlLCBfLCBzb3VyY2UsIHRhcmdldCkge1xuICAgICAgICBpZiAoc291cmNlID09PSBob3ZlcmVkTm9kZSB8fFxuICAgICAgICAgICAgdGFyZ2V0ID09PSBob3ZlcmVkTm9kZSB8fFxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWROb2Rlcy5oYXMoc291cmNlKSB8fFxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWROb2Rlcy5oYXModGFyZ2V0KSB8fFxuICAgICAgICAgICAgKGRpc3BsYXllZE5vZGVMYWJlbHMuaGFzKHNvdXJjZSkgJiYgZGlzcGxheWVkTm9kZUxhYmVscy5oYXModGFyZ2V0KSkpIHtcbiAgICAgICAgICAgIHdvcnRoeUVkZ2VzLnB1c2goZWRnZSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gd29ydGh5RWRnZXM7XG59XG5leHBvcnRzLmVkZ2VMYWJlbHNUb0Rpc3BsYXlGcm9tTm9kZXMgPSBlZGdlTGFiZWxzVG9EaXNwbGF5RnJvbU5vZGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19yZWFkID0gKHRoaXMgJiYgdGhpcy5fX3JlYWQpIHx8IGZ1bmN0aW9uIChvLCBuKSB7XG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICAgIGlmICghbSkgcmV0dXJuIG87XG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbn07XG52YXIgX19zcHJlYWRBcnJheSA9ICh0aGlzICYmIHRoaXMuX19zcHJlYWRBcnJheSkgfHwgZnVuY3Rpb24gKHRvLCBmcm9tLCBwYWNrKSB7XG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFyIHx8ICEoaSBpbiBmcm9tKSkge1xuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGZyb20pKTtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnJlY3RhbmdsZUNvbGxpZGVzV2l0aFF1YWQgPSBleHBvcnRzLnNxdWFyZUNvbGxpZGVzV2l0aFF1YWQgPSBleHBvcnRzLmdldENpcmN1bXNjcmliZWRBbGlnbmVkUmVjdGFuZ2xlID0gZXhwb3J0cy5pc1JlY3RhbmdsZUFsaWduZWQgPSB2b2lkIDA7XG4vKipcbiAqIFNpZ21hLmpzIFF1YWQgVHJlZSBDbGFzc1xuICogPT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIENsYXNzIGltcGxlbWVudGluZyB0aGUgcXVhZCB0cmVlIGRhdGEgc3RydWN0dXJlIHVzZWQgdG8gc29sdmUgaG92ZXJzIGFuZFxuICogZGV0ZXJtaW5lIHdoaWNoIGVsZW1lbnRzIGFyZSBjdXJyZW50bHkgaW4gdGhlIHNjb3BlIG9mIHRoZSBjYW1lcmEgc28gdGhhdFxuICogd2UgZG9uJ3Qgd2FzdGUgdGltZSByZW5kZXJpbmcgdGhpbmdzIHRoZSB1c2VyIGNhbm5vdCBzZWUgYW55d2F5LlxuICogQG1vZHVsZVxuICovXG4vKiBlc2xpbnQgbm8tbmVzdGVkLXRlcm5hcnk6IDAgKi9cbi8qIGVzbGludCBuby1jb25zdGFudC1jb25kaXRpb246IDAgKi9cbnZhciBleHRlbmRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiQHlvbWd1aXRoZXJlYWwvaGVscGVycy9leHRlbmRcIikpO1xuLy8gVE9ETzogc2hvdWxkIG5vdCBhc2sgdGhlIHF1YWR0cmVlIHdoZW4gdGhlIGNhbWVyYSBoYXMgdGhlIHdob2xlIGdyYXBoIGluXG4vLyBzaWdodC5cbi8vIFRPRE86IGEgc3F1YXJlIGNhbiBiZSByZXByZXNlbnRlZCBhcyB0b3BsZWZ0ICsgd2lkdGgsIHNheWluZyBmb3IgdGhlIHF1YWQgYmxvY2tzIChyZWR1Y2UgbWVtKVxuLy8gVE9ETzoganNkb2Ncbi8vIFRPRE86IGJlIHN1cmUgd2UgY2FuIGhhbmRsZSBjYXNlcyBvdmVyY29taW5nIGJvdW5kYXJpZXMgKGJlY2F1c2Ugb2Ygc2l6ZSkgb3IgdXNlIGEgbWF4ZWQgc2l6ZVxuLy8gVE9ETzogZmlsdGVyaW5nIHVud2FudGVkIGxhYmVscyBiZWZvcmVoYW5kIHRocm91Z2ggdGhlIGZpbHRlciBmdW5jdGlvblxuLy8gTk9URTogdGhpcyBpcyBiYXNpY2FsbHkgYSBNWC1DSUYgUXVhZHRyZWUgYXQgdGhpcyBwb2ludFxuLy8gTk9URTogbmVlZCB0byBleHBsb3JlIFItVHJlZXMgZm9yIGVkZ2VzXG4vLyBOT1RFOiBuZWVkIHRvIGV4cGxvcmUgMmQgc2VnbWVudCB0cmVlIGZvciBlZGdlc1xuLy8gTk9URTogcHJvYmFibHkgY2FuIGRvIGZhc3RlciB1c2luZyBzcGF0aWFsIGhhc2hpbmdcbi8qKlxuICogQ29uc3RhbnRzLlxuICpcbiAqIE5vdGUgdGhhdCBzaW5jZSB3ZSBhcmUgcmVwcmVzZW50aW5nIGEgc3RhdGljIDQtYXJ5IHRyZWUsIHRoZSBpbmRpY2VzIG9mIHRoZVxuICogcXVhZHJhbnRzIGFyZSB0aGUgZm9sbG93aW5nOlxuICogICAtIFRPUF9MRUZUOiAgICAgNGkgKyBiXG4gKiAgIC0gVE9QX1JJR0hUOiAgICA0aSArIDJiXG4gKiAgIC0gQk9UVE9NX0xFRlQ6ICA0aSArIDNiXG4gKiAgIC0gQk9UVE9NX1JJR0hUOiA0aSArIDRiXG4gKi9cbnZhciBCTE9DS1MgPSA0LCBNQVhfTEVWRUwgPSA1O1xudmFyIE9VVFNJREVfQkxPQ0sgPSBcIm91dHNpZGVcIjtcbnZhciBYX09GRlNFVCA9IDAsIFlfT0ZGU0VUID0gMSwgV0lEVEhfT0ZGU0VUID0gMiwgSEVJR0hUX09GRlNFVCA9IDM7XG52YXIgVE9QX0xFRlQgPSAxLCBUT1BfUklHSFQgPSAyLCBCT1RUT01fTEVGVCA9IDMsIEJPVFRPTV9SSUdIVCA9IDQ7XG52YXIgaGFzV2FybmVkVG9vTXVjaE91dHNpZGUgPSBmYWxzZTtcbi8qKlxuICogR2VvbWV0cnkgaGVscGVycy5cbiAqL1xuLyoqXG4gKiBGdW5jdGlvbiByZXR1cm5pbmcgd2hldGhlciB0aGUgZ2l2ZW4gcmVjdGFuZ2xlIGlzIGF4aXMtYWxpZ25lZC5cbiAqXG4gKiBAcGFyYW0gIHtSZWN0YW5nbGV9IHJlY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzUmVjdGFuZ2xlQWxpZ25lZChyZWN0KSB7XG4gICAgcmV0dXJuIHJlY3QueDEgPT09IHJlY3QueDIgfHwgcmVjdC55MSA9PT0gcmVjdC55Mjtcbn1cbmV4cG9ydHMuaXNSZWN0YW5nbGVBbGlnbmVkID0gaXNSZWN0YW5nbGVBbGlnbmVkO1xuLyoqXG4gKiBGdW5jdGlvbiByZXR1cm5pbmcgdGhlIHNtYWxsZXN0IHJlY3RhbmdsZSB0aGF0IGNvbnRhaW5zIHRoZSBnaXZlbiByZWN0YW5nbGUsIGFuZCB0aGF0IGlzIGFsaWduZWQgd2l0aCB0aGUgYXhpcy5cbiAqXG4gKiBAcGFyYW0ge1JlY3RhbmdsZX0gcmVjdFxuICogQHJldHVybiB7UmVjdGFuZ2xlfVxuICovXG5mdW5jdGlvbiBnZXRDaXJjdW1zY3JpYmVkQWxpZ25lZFJlY3RhbmdsZShyZWN0KSB7XG4gICAgdmFyIHdpZHRoID0gTWF0aC5zcXJ0KE1hdGgucG93KHJlY3QueDIgLSByZWN0LngxLCAyKSArIE1hdGgucG93KHJlY3QueTIgLSByZWN0LnkxLCAyKSk7XG4gICAgdmFyIGhlaWdodFZlY3RvciA9IHtcbiAgICAgICAgeDogKChyZWN0LnkxIC0gcmVjdC55MikgKiByZWN0LmhlaWdodCkgLyB3aWR0aCxcbiAgICAgICAgeTogKChyZWN0LngyIC0gcmVjdC54MSkgKiByZWN0LmhlaWdodCkgLyB3aWR0aCxcbiAgICB9O1xuICAgIC8vIENvbXB1dGUgYWxsIGNvcm5lcnM6XG4gICAgdmFyIHRsID0geyB4OiByZWN0LngxLCB5OiByZWN0LnkxIH07XG4gICAgdmFyIHRyID0geyB4OiByZWN0LngyLCB5OiByZWN0LnkyIH07XG4gICAgdmFyIGJsID0ge1xuICAgICAgICB4OiByZWN0LngxICsgaGVpZ2h0VmVjdG9yLngsXG4gICAgICAgIHk6IHJlY3QueTEgKyBoZWlnaHRWZWN0b3IueSxcbiAgICB9O1xuICAgIHZhciBiciA9IHtcbiAgICAgICAgeDogcmVjdC54MiArIGhlaWdodFZlY3Rvci54LFxuICAgICAgICB5OiByZWN0LnkyICsgaGVpZ2h0VmVjdG9yLnksXG4gICAgfTtcbiAgICB2YXIgeEwgPSBNYXRoLm1pbih0bC54LCB0ci54LCBibC54LCBici54KTtcbiAgICB2YXIgeFIgPSBNYXRoLm1heCh0bC54LCB0ci54LCBibC54LCBici54KTtcbiAgICB2YXIgeVQgPSBNYXRoLm1pbih0bC55LCB0ci55LCBibC55LCBici55KTtcbiAgICB2YXIgeUIgPSBNYXRoLm1heCh0bC55LCB0ci55LCBibC55LCBici55KTtcbiAgICByZXR1cm4ge1xuICAgICAgICB4MTogeEwsXG4gICAgICAgIHkxOiB5VCxcbiAgICAgICAgeDI6IHhSLFxuICAgICAgICB5MjogeVQsXG4gICAgICAgIGhlaWdodDogeUIgLSB5VCxcbiAgICB9O1xufVxuZXhwb3J0cy5nZXRDaXJjdW1zY3JpYmVkQWxpZ25lZFJlY3RhbmdsZSA9IGdldENpcmN1bXNjcmliZWRBbGlnbmVkUmVjdGFuZ2xlO1xuLyoqXG4gKlxuICogQHBhcmFtIHgxXG4gKiBAcGFyYW0geTFcbiAqIEBwYXJhbSB3XG4gKiBAcGFyYW0gcXhcbiAqIEBwYXJhbSBxeVxuICogQHBhcmFtIHF3XG4gKiBAcGFyYW0gcWhcbiAqL1xuZnVuY3Rpb24gc3F1YXJlQ29sbGlkZXNXaXRoUXVhZCh4MSwgeTEsIHcsIHF4LCBxeSwgcXcsIHFoKSB7XG4gICAgcmV0dXJuIHgxIDwgcXggKyBxdyAmJiB4MSArIHcgPiBxeCAmJiB5MSA8IHF5ICsgcWggJiYgeTEgKyB3ID4gcXk7XG59XG5leHBvcnRzLnNxdWFyZUNvbGxpZGVzV2l0aFF1YWQgPSBzcXVhcmVDb2xsaWRlc1dpdGhRdWFkO1xuZnVuY3Rpb24gcmVjdGFuZ2xlQ29sbGlkZXNXaXRoUXVhZCh4MSwgeTEsIHcsIGgsIHF4LCBxeSwgcXcsIHFoKSB7XG4gICAgcmV0dXJuIHgxIDwgcXggKyBxdyAmJiB4MSArIHcgPiBxeCAmJiB5MSA8IHF5ICsgcWggJiYgeTEgKyBoID4gcXk7XG59XG5leHBvcnRzLnJlY3RhbmdsZUNvbGxpZGVzV2l0aFF1YWQgPSByZWN0YW5nbGVDb2xsaWRlc1dpdGhRdWFkO1xuZnVuY3Rpb24gcG9pbnRJc0luUXVhZCh4LCB5LCBxeCwgcXksIHF3LCBxaCkge1xuICAgIHZhciB4bXAgPSBxeCArIHF3IC8gMiwgeW1wID0gcXkgKyBxaCAvIDIsIHRvcCA9IHkgPCB5bXAsIGxlZnQgPSB4IDwgeG1wO1xuICAgIHJldHVybiB0b3AgPyAobGVmdCA/IFRPUF9MRUZUIDogVE9QX1JJR0hUKSA6IGxlZnQgPyBCT1RUT01fTEVGVCA6IEJPVFRPTV9SSUdIVDtcbn1cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9ucyB0aGF0IGFyZSBub3QgYm91bmQgdG8gdGhlIGNsYXNzIHNvIGFuIGV4dGVybmFsIHVzZXJcbiAqIGNhbm5vdCBtZXNzIHdpdGggdGhlbS5cbiAqL1xuZnVuY3Rpb24gYnVpbGRRdWFkcmFudHMobWF4TGV2ZWwsIGRhdGEpIHtcbiAgICAvLyBbYmxvY2ssIGxldmVsXVxuICAgIHZhciBzdGFjayA9IFswLCAwXTtcbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICAgIHZhciBsZXZlbCA9IHN0YWNrLnBvcCgpLCBibG9jayA9IHN0YWNrLnBvcCgpO1xuICAgICAgICB2YXIgdG9wTGVmdEJsb2NrID0gNCAqIGJsb2NrICsgQkxPQ0tTLCB0b3BSaWdodEJsb2NrID0gNCAqIGJsb2NrICsgMiAqIEJMT0NLUywgYm90dG9tTGVmdEJsb2NrID0gNCAqIGJsb2NrICsgMyAqIEJMT0NLUywgYm90dG9tUmlnaHRCbG9jayA9IDQgKiBibG9jayArIDQgKiBCTE9DS1M7XG4gICAgICAgIHZhciB4ID0gZGF0YVtibG9jayArIFhfT0ZGU0VUXSwgeSA9IGRhdGFbYmxvY2sgKyBZX09GRlNFVF0sIHdpZHRoID0gZGF0YVtibG9jayArIFdJRFRIX09GRlNFVF0sIGhlaWdodCA9IGRhdGFbYmxvY2sgKyBIRUlHSFRfT0ZGU0VUXSwgaHcgPSB3aWR0aCAvIDIsIGhoID0gaGVpZ2h0IC8gMjtcbiAgICAgICAgZGF0YVt0b3BMZWZ0QmxvY2sgKyBYX09GRlNFVF0gPSB4O1xuICAgICAgICBkYXRhW3RvcExlZnRCbG9jayArIFlfT0ZGU0VUXSA9IHk7XG4gICAgICAgIGRhdGFbdG9wTGVmdEJsb2NrICsgV0lEVEhfT0ZGU0VUXSA9IGh3O1xuICAgICAgICBkYXRhW3RvcExlZnRCbG9jayArIEhFSUdIVF9PRkZTRVRdID0gaGg7XG4gICAgICAgIGRhdGFbdG9wUmlnaHRCbG9jayArIFhfT0ZGU0VUXSA9IHggKyBodztcbiAgICAgICAgZGF0YVt0b3BSaWdodEJsb2NrICsgWV9PRkZTRVRdID0geTtcbiAgICAgICAgZGF0YVt0b3BSaWdodEJsb2NrICsgV0lEVEhfT0ZGU0VUXSA9IGh3O1xuICAgICAgICBkYXRhW3RvcFJpZ2h0QmxvY2sgKyBIRUlHSFRfT0ZGU0VUXSA9IGhoO1xuICAgICAgICBkYXRhW2JvdHRvbUxlZnRCbG9jayArIFhfT0ZGU0VUXSA9IHg7XG4gICAgICAgIGRhdGFbYm90dG9tTGVmdEJsb2NrICsgWV9PRkZTRVRdID0geSArIGhoO1xuICAgICAgICBkYXRhW2JvdHRvbUxlZnRCbG9jayArIFdJRFRIX09GRlNFVF0gPSBodztcbiAgICAgICAgZGF0YVtib3R0b21MZWZ0QmxvY2sgKyBIRUlHSFRfT0ZGU0VUXSA9IGhoO1xuICAgICAgICBkYXRhW2JvdHRvbVJpZ2h0QmxvY2sgKyBYX09GRlNFVF0gPSB4ICsgaHc7XG4gICAgICAgIGRhdGFbYm90dG9tUmlnaHRCbG9jayArIFlfT0ZGU0VUXSA9IHkgKyBoaDtcbiAgICAgICAgZGF0YVtib3R0b21SaWdodEJsb2NrICsgV0lEVEhfT0ZGU0VUXSA9IGh3O1xuICAgICAgICBkYXRhW2JvdHRvbVJpZ2h0QmxvY2sgKyBIRUlHSFRfT0ZGU0VUXSA9IGhoO1xuICAgICAgICBpZiAobGV2ZWwgPCBtYXhMZXZlbCAtIDEpIHtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goYm90dG9tUmlnaHRCbG9jaywgbGV2ZWwgKyAxKTtcbiAgICAgICAgICAgIHN0YWNrLnB1c2goYm90dG9tTGVmdEJsb2NrLCBsZXZlbCArIDEpO1xuICAgICAgICAgICAgc3RhY2sucHVzaCh0b3BSaWdodEJsb2NrLCBsZXZlbCArIDEpO1xuICAgICAgICAgICAgc3RhY2sucHVzaCh0b3BMZWZ0QmxvY2ssIGxldmVsICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBpbnNlcnROb2RlKG1heExldmVsLCBkYXRhLCBjb250YWluZXJzLCBrZXksIHgsIHksIHNpemUpIHtcbiAgICB2YXIgeDEgPSB4IC0gc2l6ZSwgeTEgPSB5IC0gc2l6ZSwgdyA9IHNpemUgKiAyO1xuICAgIHZhciBsZXZlbCA9IDAsIGJsb2NrID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIG1heCBsZXZlbFxuICAgICAgICBpZiAobGV2ZWwgPj0gbWF4TGV2ZWwpIHtcbiAgICAgICAgICAgIGNvbnRhaW5lcnNbYmxvY2tdID0gY29udGFpbmVyc1tibG9ja10gfHwgW107XG4gICAgICAgICAgICBjb250YWluZXJzW2Jsb2NrXS5wdXNoKGtleSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHRvcExlZnRCbG9jayA9IDQgKiBibG9jayArIEJMT0NLUywgdG9wUmlnaHRCbG9jayA9IDQgKiBibG9jayArIDIgKiBCTE9DS1MsIGJvdHRvbUxlZnRCbG9jayA9IDQgKiBibG9jayArIDMgKiBCTE9DS1MsIGJvdHRvbVJpZ2h0QmxvY2sgPSA0ICogYmxvY2sgKyA0ICogQkxPQ0tTO1xuICAgICAgICB2YXIgY29sbGlkaW5nV2l0aFRvcExlZnQgPSBzcXVhcmVDb2xsaWRlc1dpdGhRdWFkKHgxLCB5MSwgdywgZGF0YVt0b3BMZWZ0QmxvY2sgKyBYX09GRlNFVF0sIGRhdGFbdG9wTGVmdEJsb2NrICsgWV9PRkZTRVRdLCBkYXRhW3RvcExlZnRCbG9jayArIFdJRFRIX09GRlNFVF0sIGRhdGFbdG9wTGVmdEJsb2NrICsgSEVJR0hUX09GRlNFVF0pO1xuICAgICAgICB2YXIgY29sbGlkaW5nV2l0aFRvcFJpZ2h0ID0gc3F1YXJlQ29sbGlkZXNXaXRoUXVhZCh4MSwgeTEsIHcsIGRhdGFbdG9wUmlnaHRCbG9jayArIFhfT0ZGU0VUXSwgZGF0YVt0b3BSaWdodEJsb2NrICsgWV9PRkZTRVRdLCBkYXRhW3RvcFJpZ2h0QmxvY2sgKyBXSURUSF9PRkZTRVRdLCBkYXRhW3RvcFJpZ2h0QmxvY2sgKyBIRUlHSFRfT0ZGU0VUXSk7XG4gICAgICAgIHZhciBjb2xsaWRpbmdXaXRoQm90dG9tTGVmdCA9IHNxdWFyZUNvbGxpZGVzV2l0aFF1YWQoeDEsIHkxLCB3LCBkYXRhW2JvdHRvbUxlZnRCbG9jayArIFhfT0ZGU0VUXSwgZGF0YVtib3R0b21MZWZ0QmxvY2sgKyBZX09GRlNFVF0sIGRhdGFbYm90dG9tTGVmdEJsb2NrICsgV0lEVEhfT0ZGU0VUXSwgZGF0YVtib3R0b21MZWZ0QmxvY2sgKyBIRUlHSFRfT0ZGU0VUXSk7XG4gICAgICAgIHZhciBjb2xsaWRpbmdXaXRoQm90dG9tUmlnaHQgPSBzcXVhcmVDb2xsaWRlc1dpdGhRdWFkKHgxLCB5MSwgdywgZGF0YVtib3R0b21SaWdodEJsb2NrICsgWF9PRkZTRVRdLCBkYXRhW2JvdHRvbVJpZ2h0QmxvY2sgKyBZX09GRlNFVF0sIGRhdGFbYm90dG9tUmlnaHRCbG9jayArIFdJRFRIX09GRlNFVF0sIGRhdGFbYm90dG9tUmlnaHRCbG9jayArIEhFSUdIVF9PRkZTRVRdKTtcbiAgICAgICAgdmFyIGNvbGxpc2lvbnMgPSBbXG4gICAgICAgICAgICBjb2xsaWRpbmdXaXRoVG9wTGVmdCxcbiAgICAgICAgICAgIGNvbGxpZGluZ1dpdGhUb3BSaWdodCxcbiAgICAgICAgICAgIGNvbGxpZGluZ1dpdGhCb3R0b21MZWZ0LFxuICAgICAgICAgICAgY29sbGlkaW5nV2l0aEJvdHRvbVJpZ2h0LFxuICAgICAgICBdLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBjdXJyZW50KSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudClcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjICsgMTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9LCAwKTtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBubyBjb2xsaXNpb24gYXQgcm9vdCBsZXZlbCwgaW5qZWN0IG5vZGUgaW4gdGhlIG91dHNpZGUgYmxvY2tcbiAgICAgICAgaWYgKGNvbGxpc2lvbnMgPT09IDAgJiYgbGV2ZWwgPT09IDApIHtcbiAgICAgICAgICAgIGNvbnRhaW5lcnNbT1VUU0lERV9CTE9DS10ucHVzaChrZXkpO1xuICAgICAgICAgICAgaWYgKCFoYXNXYXJuZWRUb29NdWNoT3V0c2lkZSAmJiBjb250YWluZXJzW09VVFNJREVfQkxPQ0tdLmxlbmd0aCA+PSA1KSB7XG4gICAgICAgICAgICAgICAgaGFzV2FybmVkVG9vTXVjaE91dHNpZGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInNpZ21hL3F1YWR0cmVlLmluc2VydE5vZGU6IEF0IGxlYXN0IDUgbm9kZXMgYXJlIG91dHNpZGUgdGhlIGdsb2JhbCBxdWFkdHJlZSB6b25lLiBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwiWW91IG1pZ2h0IGhhdmUgYSBwcm9ibGVtIHdpdGggdGhlIG5vcm1hbGl6YXRpb24gZnVuY3Rpb24gb3IgdGhlIGN1c3RvbSBib3VuZGluZyBib3guXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYXQgbGVhc3QgYSBjb2xsaXNpb24gYnV0IGRlZXBlciwgdGhlcmUgaXMgYW4gaXNzdWVcbiAgICAgICAgaWYgKGNvbGxpc2lvbnMgPT09IDApXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaWdtYS9xdWFkdHJlZS5pbnNlcnROb2RlOiBubyBjb2xsaXNpb24gKGxldmVsOiBcIi5jb25jYXQobGV2ZWwsIFwiLCBrZXk6IFwiKS5jb25jYXQoa2V5LCBcIiwgeDogXCIpLmNvbmNhdCh4LCBcIiwgeTogXCIpLmNvbmNhdCh5LCBcIiwgc2l6ZTogXCIpLmNvbmNhdChzaXplLCBcIikuXCIpKTtcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSAzIGNvbGxpc2lvbnMsIHdlIGhhdmUgYSBnZW9tZXRyeSBwcm9ibGVtIG9idmlvdXNseVxuICAgICAgICBpZiAoY29sbGlzaW9ucyA9PT0gMylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInNpZ21hL3F1YWR0cmVlLmluc2VydE5vZGU6IDMgaW1wb3NzaWJsZSBjb2xsaXNpb25zIChsZXZlbDogXCIuY29uY2F0KGxldmVsLCBcIiwga2V5OiBcIikuY29uY2F0KGtleSwgXCIsIHg6IFwiKS5jb25jYXQoeCwgXCIsIHk6IFwiKS5jb25jYXQoeSwgXCIsIHNpemU6IFwiKS5jb25jYXQoc2l6ZSwgXCIpLlwiKSk7XG4gICAgICAgIC8vIElmIHdlIGhhdmUgbW9yZSB0aGF0IG9uZSBjb2xsaXNpb24sIHdlIHN0b3AgaGVyZSBhbmQgc3RvcmUgdGhlIG5vZGVcbiAgICAgICAgLy8gaW4gdGhlIHJlbGV2YW50IGNvbnRhaW5lcnNcbiAgICAgICAgaWYgKGNvbGxpc2lvbnMgPiAxKSB7XG4gICAgICAgICAgICBjb250YWluZXJzW2Jsb2NrXSA9IGNvbnRhaW5lcnNbYmxvY2tdIHx8IFtdO1xuICAgICAgICAgICAgY29udGFpbmVyc1tibG9ja10ucHVzaChrZXkpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV2ZWwrKztcbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlIHdlIHJlY3Vyc2UgaW50byB0aGUgY29ycmVjdCBxdWFkc1xuICAgICAgICBpZiAoY29sbGlkaW5nV2l0aFRvcExlZnQpXG4gICAgICAgICAgICBibG9jayA9IHRvcExlZnRCbG9jaztcbiAgICAgICAgaWYgKGNvbGxpZGluZ1dpdGhUb3BSaWdodClcbiAgICAgICAgICAgIGJsb2NrID0gdG9wUmlnaHRCbG9jaztcbiAgICAgICAgaWYgKGNvbGxpZGluZ1dpdGhCb3R0b21MZWZ0KVxuICAgICAgICAgICAgYmxvY2sgPSBib3R0b21MZWZ0QmxvY2s7XG4gICAgICAgIGlmIChjb2xsaWRpbmdXaXRoQm90dG9tUmlnaHQpXG4gICAgICAgICAgICBibG9jayA9IGJvdHRvbVJpZ2h0QmxvY2s7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2V0Tm9kZXNJbkF4aXNBbGlnbmVkUmVjdGFuZ2xlQXJlYShtYXhMZXZlbCwgZGF0YSwgY29udGFpbmVycywgeDEsIHkxLCB3LCBoKSB7XG4gICAgLy8gW2Jsb2NrLCBsZXZlbF1cbiAgICB2YXIgc3RhY2sgPSBbMCwgMF07XG4gICAgdmFyIGNvbGxlY3RlZE5vZGVzID0gW107XG4gICAgdmFyIGNvbnRhaW5lcjtcbiAgICB3aGlsZSAoc3RhY2subGVuZ3RoKSB7XG4gICAgICAgIHZhciBsZXZlbCA9IHN0YWNrLnBvcCgpLCBibG9jayA9IHN0YWNrLnBvcCgpO1xuICAgICAgICAvLyBDb2xsZWN0aW5nIG5vZGVzXG4gICAgICAgIGNvbnRhaW5lciA9IGNvbnRhaW5lcnNbYmxvY2tdO1xuICAgICAgICBpZiAoY29udGFpbmVyKVxuICAgICAgICAgICAgKDAsIGV4dGVuZF8xLmRlZmF1bHQpKGNvbGxlY3RlZE5vZGVzLCBjb250YWluZXIpO1xuICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIG1heCBsZXZlbFxuICAgICAgICBpZiAobGV2ZWwgPj0gbWF4TGV2ZWwpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgdmFyIHRvcExlZnRCbG9jayA9IDQgKiBibG9jayArIEJMT0NLUywgdG9wUmlnaHRCbG9jayA9IDQgKiBibG9jayArIDIgKiBCTE9DS1MsIGJvdHRvbUxlZnRCbG9jayA9IDQgKiBibG9jayArIDMgKiBCTE9DS1MsIGJvdHRvbVJpZ2h0QmxvY2sgPSA0ICogYmxvY2sgKyA0ICogQkxPQ0tTO1xuICAgICAgICB2YXIgY29sbGlkaW5nV2l0aFRvcExlZnQgPSByZWN0YW5nbGVDb2xsaWRlc1dpdGhRdWFkKHgxLCB5MSwgdywgaCwgZGF0YVt0b3BMZWZ0QmxvY2sgKyBYX09GRlNFVF0sIGRhdGFbdG9wTGVmdEJsb2NrICsgWV9PRkZTRVRdLCBkYXRhW3RvcExlZnRCbG9jayArIFdJRFRIX09GRlNFVF0sIGRhdGFbdG9wTGVmdEJsb2NrICsgSEVJR0hUX09GRlNFVF0pO1xuICAgICAgICB2YXIgY29sbGlkaW5nV2l0aFRvcFJpZ2h0ID0gcmVjdGFuZ2xlQ29sbGlkZXNXaXRoUXVhZCh4MSwgeTEsIHcsIGgsIGRhdGFbdG9wUmlnaHRCbG9jayArIFhfT0ZGU0VUXSwgZGF0YVt0b3BSaWdodEJsb2NrICsgWV9PRkZTRVRdLCBkYXRhW3RvcFJpZ2h0QmxvY2sgKyBXSURUSF9PRkZTRVRdLCBkYXRhW3RvcFJpZ2h0QmxvY2sgKyBIRUlHSFRfT0ZGU0VUXSk7XG4gICAgICAgIHZhciBjb2xsaWRpbmdXaXRoQm90dG9tTGVmdCA9IHJlY3RhbmdsZUNvbGxpZGVzV2l0aFF1YWQoeDEsIHkxLCB3LCBoLCBkYXRhW2JvdHRvbUxlZnRCbG9jayArIFhfT0ZGU0VUXSwgZGF0YVtib3R0b21MZWZ0QmxvY2sgKyBZX09GRlNFVF0sIGRhdGFbYm90dG9tTGVmdEJsb2NrICsgV0lEVEhfT0ZGU0VUXSwgZGF0YVtib3R0b21MZWZ0QmxvY2sgKyBIRUlHSFRfT0ZGU0VUXSk7XG4gICAgICAgIHZhciBjb2xsaWRpbmdXaXRoQm90dG9tUmlnaHQgPSByZWN0YW5nbGVDb2xsaWRlc1dpdGhRdWFkKHgxLCB5MSwgdywgaCwgZGF0YVtib3R0b21SaWdodEJsb2NrICsgWF9PRkZTRVRdLCBkYXRhW2JvdHRvbVJpZ2h0QmxvY2sgKyBZX09GRlNFVF0sIGRhdGFbYm90dG9tUmlnaHRCbG9jayArIFdJRFRIX09GRlNFVF0sIGRhdGFbYm90dG9tUmlnaHRCbG9jayArIEhFSUdIVF9PRkZTRVRdKTtcbiAgICAgICAgaWYgKGNvbGxpZGluZ1dpdGhUb3BMZWZ0KVxuICAgICAgICAgICAgc3RhY2sucHVzaCh0b3BMZWZ0QmxvY2ssIGxldmVsICsgMSk7XG4gICAgICAgIGlmIChjb2xsaWRpbmdXaXRoVG9wUmlnaHQpXG4gICAgICAgICAgICBzdGFjay5wdXNoKHRvcFJpZ2h0QmxvY2ssIGxldmVsICsgMSk7XG4gICAgICAgIGlmIChjb2xsaWRpbmdXaXRoQm90dG9tTGVmdClcbiAgICAgICAgICAgIHN0YWNrLnB1c2goYm90dG9tTGVmdEJsb2NrLCBsZXZlbCArIDEpO1xuICAgICAgICBpZiAoY29sbGlkaW5nV2l0aEJvdHRvbVJpZ2h0KVxuICAgICAgICAgICAgc3RhY2sucHVzaChib3R0b21SaWdodEJsb2NrLCBsZXZlbCArIDEpO1xuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGVkTm9kZXM7XG59XG4vKipcbiAqIFF1YWRUcmVlIGNsYXNzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtvYmplY3R9IGJvdW5kYXJpZXMgLSBUaGUgZ3JhcGggYm91bmRhcmllcy5cbiAqL1xudmFyIFF1YWRUcmVlID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFF1YWRUcmVlKHBhcmFtcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIGlmIChwYXJhbXMgPT09IHZvaWQgMCkgeyBwYXJhbXMgPSB7fTsgfVxuICAgICAgICB0aGlzLmNvbnRhaW5lcnMgPSAoX2EgPSB7fSwgX2FbT1VUU0lERV9CTE9DS10gPSBbXSwgX2EpO1xuICAgICAgICB0aGlzLmNhY2hlID0gbnVsbDtcbiAgICAgICAgdGhpcy5sYXN0UmVjdGFuZ2xlID0gbnVsbDtcbiAgICAgICAgLy8gQWxsb2NhdGluZyB0aGUgdW5kZXJseWluZyBieXRlIGFycmF5XG4gICAgICAgIHZhciBMID0gTWF0aC5wb3coNCwgTUFYX0xFVkVMKTtcbiAgICAgICAgdGhpcy5kYXRhID0gbmV3IEZsb2F0MzJBcnJheShCTE9DS1MgKiAoKDQgKiBMIC0gMSkgLyAzKSk7XG4gICAgICAgIGlmIChwYXJhbXMuYm91bmRhcmllcylcbiAgICAgICAgICAgIHRoaXMucmVzaXplKHBhcmFtcy5ib3VuZGFyaWVzKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5yZXNpemUoe1xuICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgeTogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogMSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEsXG4gICAgICAgICAgICB9KTtcbiAgICB9XG4gICAgUXVhZFRyZWUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIChrZXksIHgsIHksIHNpemUpIHtcbiAgICAgICAgaW5zZXJ0Tm9kZShNQVhfTEVWRUwsIHRoaXMuZGF0YSwgdGhpcy5jb250YWluZXJzLCBrZXksIHgsIHksIHNpemUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFF1YWRUcmVlLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoYm91bmRhcmllcykge1xuICAgICAgICB0aGlzLmNsZWFyKCk7XG4gICAgICAgIC8vIEJ1aWxkaW5nIHRoZSBxdWFkcmFudHNcbiAgICAgICAgdGhpcy5kYXRhW1hfT0ZGU0VUXSA9IGJvdW5kYXJpZXMueDtcbiAgICAgICAgdGhpcy5kYXRhW1lfT0ZGU0VUXSA9IGJvdW5kYXJpZXMueTtcbiAgICAgICAgdGhpcy5kYXRhW1dJRFRIX09GRlNFVF0gPSBib3VuZGFyaWVzLndpZHRoO1xuICAgICAgICB0aGlzLmRhdGFbSEVJR0hUX09GRlNFVF0gPSBib3VuZGFyaWVzLmhlaWdodDtcbiAgICAgICAgYnVpbGRRdWFkcmFudHMoTUFYX0xFVkVMLCB0aGlzLmRhdGEpO1xuICAgIH07XG4gICAgUXVhZFRyZWUucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHRoaXMuY29udGFpbmVycyA9IChfYSA9IHt9LCBfYVtPVVRTSURFX0JMT0NLXSA9IFtdLCBfYSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgUXVhZFRyZWUucHJvdG90eXBlLnBvaW50ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIG5vZGVzID0gdGhpcy5jb250YWluZXJzW09VVFNJREVfQkxPQ0tdO1xuICAgICAgICB2YXIgYmxvY2sgPSAwLCBsZXZlbCA9IDA7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lcnNbYmxvY2tdKVxuICAgICAgICAgICAgICAgIG5vZGVzLnB1c2guYXBwbHkobm9kZXMsIF9fc3ByZWFkQXJyYXkoW10sIF9fcmVhZCh0aGlzLmNvbnRhaW5lcnNbYmxvY2tdKSwgZmFsc2UpKTtcbiAgICAgICAgICAgIHZhciBxdWFkID0gcG9pbnRJc0luUXVhZCh4LCB5LCB0aGlzLmRhdGFbYmxvY2sgKyBYX09GRlNFVF0sIHRoaXMuZGF0YVtibG9jayArIFlfT0ZGU0VUXSwgdGhpcy5kYXRhW2Jsb2NrICsgV0lEVEhfT0ZGU0VUXSwgdGhpcy5kYXRhW2Jsb2NrICsgSEVJR0hUX09GRlNFVF0pO1xuICAgICAgICAgICAgYmxvY2sgPSA0ICogYmxvY2sgKyBxdWFkICogQkxPQ0tTO1xuICAgICAgICAgICAgbGV2ZWwrKztcbiAgICAgICAgfSB3aGlsZSAobGV2ZWwgPD0gTUFYX0xFVkVMKTtcbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH07XG4gICAgUXVhZFRyZWUucHJvdG90eXBlLnJlY3RhbmdsZSA9IGZ1bmN0aW9uICh4MSwgeTEsIHgyLCB5MiwgaGVpZ2h0KSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgdmFyIGxyID0gdGhpcy5sYXN0UmVjdGFuZ2xlO1xuICAgICAgICBpZiAobHIgJiYgeDEgPT09IGxyLngxICYmIHgyID09PSBsci54MiAmJiB5MSA9PT0gbHIueTEgJiYgeTIgPT09IGxyLnkyICYmIGhlaWdodCA9PT0gbHIuaGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jYWNoZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3RSZWN0YW5nbGUgPSB7XG4gICAgICAgICAgICB4MTogeDEsXG4gICAgICAgICAgICB5MTogeTEsXG4gICAgICAgICAgICB4MjogeDIsXG4gICAgICAgICAgICB5MjogeTIsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gSWYgdGhlIHJlY3RhbmdsZSBpcyBzaGlmdGVkLCB3ZSB1c2UgdGhlIHNtYWxsZXN0IGFsaWduZWQgcmVjdGFuZ2xlIHRoYXQgY29udGFpbnMgdGhlIHNoaWZ0ZWQgb25lOlxuICAgICAgICBpZiAoIWlzUmVjdGFuZ2xlQWxpZ25lZCh0aGlzLmxhc3RSZWN0YW5nbGUpKVxuICAgICAgICAgICAgdGhpcy5sYXN0UmVjdGFuZ2xlID0gZ2V0Q2lyY3Vtc2NyaWJlZEFsaWduZWRSZWN0YW5nbGUodGhpcy5sYXN0UmVjdGFuZ2xlKTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IGdldE5vZGVzSW5BeGlzQWxpZ25lZFJlY3RhbmdsZUFyZWEoTUFYX0xFVkVMLCB0aGlzLmRhdGEsIHRoaXMuY29udGFpbmVycywgeDEsIHkxLCBNYXRoLmFicyh4MSAtIHgyKSB8fCBNYXRoLmFicyh5MSAtIHkyKSwgaGVpZ2h0KTtcbiAgICAgICAgLy8gQWRkIGFsbCB0aGUgbm9kZXMgaW4gdGhlIG91dHNpZGUgYmxvY2ssIHNpbmNlIHRoZXkgbWlnaHQgYmUgcmVsZXZhbnQsIGFuZCBzaW5jZSB0aGV5IHNob3VsZCBiZSB2ZXJ5IGZldzpcbiAgICAgICAgKF9hID0gdGhpcy5jYWNoZSkucHVzaC5hcHBseShfYSwgX19zcHJlYWRBcnJheShbXSwgX19yZWFkKHRoaXMuY29udGFpbmVyc1tPVVRTSURFX0JMT0NLXSksIGZhbHNlKSk7XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlO1xuICAgIH07XG4gICAgcmV0dXJuIFF1YWRUcmVlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFF1YWRUcmVlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNpZ21hID0gZXhwb3J0cy5Nb3VzZUNhcHRvciA9IGV4cG9ydHMuUXVhZFRyZWUgPSBleHBvcnRzLkNhbWVyYSA9IHZvaWQgMDtcbi8qKlxuICogU2lnbWEuanMgTGlicmFyeSBFbmRwb2ludFxuICogPT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIFRoZSBsaWJyYXJ5IGVuZHBvaW50LlxuICogQG1vZHVsZVxuICovXG52YXIgc2lnbWFfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9zaWdtYVwiKSk7XG5leHBvcnRzLlNpZ21hID0gc2lnbWFfMS5kZWZhdWx0O1xudmFyIGNhbWVyYV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvcmUvY2FtZXJhXCIpKTtcbmV4cG9ydHMuQ2FtZXJhID0gY2FtZXJhXzEuZGVmYXVsdDtcbnZhciBxdWFkdHJlZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvcmUvcXVhZHRyZWVcIikpO1xuZXhwb3J0cy5RdWFkVHJlZSA9IHF1YWR0cmVlXzEuZGVmYXVsdDtcbnZhciBtb3VzZV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvcmUvY2FwdG9ycy9tb3VzZVwiKSk7XG5leHBvcnRzLk1vdXNlQ2FwdG9yID0gbW91c2VfMS5kZWZhdWx0O1xuZXhwb3J0cy5kZWZhdWx0ID0gc2lnbWFfMS5kZWZhdWx0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5mdW5jdGlvbiBkcmF3RWRnZUxhYmVsKGNvbnRleHQsIGVkZ2VEYXRhLCBzb3VyY2VEYXRhLCB0YXJnZXREYXRhLCBzZXR0aW5ncykge1xuICAgIHZhciBzaXplID0gc2V0dGluZ3MuZWRnZUxhYmVsU2l6ZSwgZm9udCA9IHNldHRpbmdzLmVkZ2VMYWJlbEZvbnQsIHdlaWdodCA9IHNldHRpbmdzLmVkZ2VMYWJlbFdlaWdodCwgY29sb3IgPSBzZXR0aW5ncy5lZGdlTGFiZWxDb2xvci5hdHRyaWJ1dGVcbiAgICAgICAgPyBlZGdlRGF0YVtzZXR0aW5ncy5lZGdlTGFiZWxDb2xvci5hdHRyaWJ1dGVdIHx8IHNldHRpbmdzLmVkZ2VMYWJlbENvbG9yLmNvbG9yIHx8IFwiIzAwMFwiXG4gICAgICAgIDogc2V0dGluZ3MuZWRnZUxhYmVsQ29sb3IuY29sb3I7XG4gICAgdmFyIGxhYmVsID0gZWRnZURhdGEubGFiZWw7XG4gICAgaWYgKCFsYWJlbClcbiAgICAgICAgcmV0dXJuO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgY29udGV4dC5mb250ID0gXCJcIi5jb25jYXQod2VpZ2h0LCBcIiBcIikuY29uY2F0KHNpemUsIFwicHggXCIpLmNvbmNhdChmb250KTtcbiAgICAvLyBDb21wdXRpbmcgcG9zaXRpb25zIHdpdGhvdXQgY29uc2lkZXJpbmcgbm9kZXMgc2l6ZXM6XG4gICAgdmFyIHNTaXplID0gc291cmNlRGF0YS5zaXplO1xuICAgIHZhciB0U2l6ZSA9IHRhcmdldERhdGEuc2l6ZTtcbiAgICB2YXIgc3ggPSBzb3VyY2VEYXRhLng7XG4gICAgdmFyIHN5ID0gc291cmNlRGF0YS55O1xuICAgIHZhciB0eCA9IHRhcmdldERhdGEueDtcbiAgICB2YXIgdHkgPSB0YXJnZXREYXRhLnk7XG4gICAgdmFyIGN4ID0gKHN4ICsgdHgpIC8gMjtcbiAgICB2YXIgY3kgPSAoc3kgKyB0eSkgLyAyO1xuICAgIHZhciBkeCA9IHR4IC0gc3g7XG4gICAgdmFyIGR5ID0gdHkgLSBzeTtcbiAgICB2YXIgZCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG4gICAgaWYgKGQgPCBzU2l6ZSArIHRTaXplKVxuICAgICAgICByZXR1cm47XG4gICAgLy8gQWRkaW5nIG5vZGVzIHNpemVzOlxuICAgIHN4ICs9IChkeCAqIHNTaXplKSAvIGQ7XG4gICAgc3kgKz0gKGR5ICogc1NpemUpIC8gZDtcbiAgICB0eCAtPSAoZHggKiB0U2l6ZSkgLyBkO1xuICAgIHR5IC09IChkeSAqIHRTaXplKSAvIGQ7XG4gICAgY3ggPSAoc3ggKyB0eCkgLyAyO1xuICAgIGN5ID0gKHN5ICsgdHkpIC8gMjtcbiAgICBkeCA9IHR4IC0gc3g7XG4gICAgZHkgPSB0eSAtIHN5O1xuICAgIGQgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIC8vIEhhbmRsaW5nIGVsbGlwc2lzXG4gICAgdmFyIHRleHRMZW5ndGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KGxhYmVsKS53aWR0aDtcbiAgICBpZiAodGV4dExlbmd0aCA+IGQpIHtcbiAgICAgICAgdmFyIGVsbGlwc2lzID0gXCLigKZcIjtcbiAgICAgICAgbGFiZWwgPSBsYWJlbCArIGVsbGlwc2lzO1xuICAgICAgICB0ZXh0TGVuZ3RoID0gY29udGV4dC5tZWFzdXJlVGV4dChsYWJlbCkud2lkdGg7XG4gICAgICAgIHdoaWxlICh0ZXh0TGVuZ3RoID4gZCAmJiBsYWJlbC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICBsYWJlbCA9IGxhYmVsLnNsaWNlKDAsIC0yKSArIGVsbGlwc2lzO1xuICAgICAgICAgICAgdGV4dExlbmd0aCA9IGNvbnRleHQubWVhc3VyZVRleHQobGFiZWwpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIGlmIChsYWJlbC5sZW5ndGggPCA0KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgYW5nbGU7XG4gICAgaWYgKGR4ID4gMCkge1xuICAgICAgICBpZiAoZHkgPiAwKVxuICAgICAgICAgICAgYW5nbGUgPSBNYXRoLmFjb3MoZHggLyBkKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYW5nbGUgPSBNYXRoLmFzaW4oZHkgLyBkKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChkeSA+IDApXG4gICAgICAgICAgICBhbmdsZSA9IE1hdGguYWNvcyhkeCAvIGQpICsgTWF0aC5QSTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgYW5nbGUgPSBNYXRoLmFzaW4oZHggLyBkKSArIE1hdGguUEkgLyAyO1xuICAgIH1cbiAgICBjb250ZXh0LnNhdmUoKTtcbiAgICBjb250ZXh0LnRyYW5zbGF0ZShjeCwgY3kpO1xuICAgIGNvbnRleHQucm90YXRlKGFuZ2xlKTtcbiAgICBjb250ZXh0LmZpbGxUZXh0KGxhYmVsLCAtdGV4dExlbmd0aCAvIDIsIGVkZ2VEYXRhLnNpemUgLyAyICsgc2l6ZSk7XG4gICAgY29udGV4dC5yZXN0b3JlKCk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkcmF3RWRnZUxhYmVsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbGFiZWxfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9sYWJlbFwiKSk7XG4vKipcbiAqIERyYXcgYW4gaG92ZXJlZCBub2RlLlxuICogLSBpZiB0aGVyZSBpcyBubyBsYWJlbCA9PiBkaXNwbGF5IGEgc2hhZG93IG9uIHRoZSBub2RlXG4gKiAtIGlmIHRoZSBsYWJlbCBib3ggaXMgYmlnZ2VyIHRoYW4gbm9kZSBzaXplID0+IGRpc3BsYXkgYSBsYWJlbCBib3ggdGhhdCBjb250YWlucyB0aGUgbm9kZSB3aXRoIGEgc2hhZG93XG4gKiAtIGVsc2Ugbm9kZSB3aXRoIHNoYWRvdyBhbmQgdGhlIGxhYmVsIGJveFxuICovXG5mdW5jdGlvbiBkcmF3SG92ZXIoY29udGV4dCwgZGF0YSwgc2V0dGluZ3MpIHtcbiAgICB2YXIgc2l6ZSA9IHNldHRpbmdzLmxhYmVsU2l6ZSwgZm9udCA9IHNldHRpbmdzLmxhYmVsRm9udCwgd2VpZ2h0ID0gc2V0dGluZ3MubGFiZWxXZWlnaHQ7XG4gICAgY29udGV4dC5mb250ID0gXCJcIi5jb25jYXQod2VpZ2h0LCBcIiBcIikuY29uY2F0KHNpemUsIFwicHggXCIpLmNvbmNhdChmb250KTtcbiAgICAvLyBUaGVuIHdlIGRyYXcgdGhlIGxhYmVsIGJhY2tncm91bmRcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IFwiI0ZGRlwiO1xuICAgIGNvbnRleHQuc2hhZG93T2Zmc2V0WCA9IDA7XG4gICAgY29udGV4dC5zaGFkb3dPZmZzZXRZID0gMDtcbiAgICBjb250ZXh0LnNoYWRvd0JsdXIgPSA4O1xuICAgIGNvbnRleHQuc2hhZG93Q29sb3IgPSBcIiMwMDBcIjtcbiAgICB2YXIgUEFERElORyA9IDI7XG4gICAgaWYgKHR5cGVvZiBkYXRhLmxhYmVsID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHZhciB0ZXh0V2lkdGggPSBjb250ZXh0Lm1lYXN1cmVUZXh0KGRhdGEubGFiZWwpLndpZHRoLCBib3hXaWR0aCA9IE1hdGgucm91bmQodGV4dFdpZHRoICsgNSksIGJveEhlaWdodCA9IE1hdGgucm91bmQoc2l6ZSArIDIgKiBQQURESU5HKSwgcmFkaXVzID0gTWF0aC5tYXgoZGF0YS5zaXplLCBzaXplIC8gMikgKyBQQURESU5HO1xuICAgICAgICB2YXIgYW5nbGVSYWRpYW4gPSBNYXRoLmFzaW4oYm94SGVpZ2h0IC8gMiAvIHJhZGl1cyk7XG4gICAgICAgIHZhciB4RGVsdGFDb29yZCA9IE1hdGguc3FydChNYXRoLmFicyhNYXRoLnBvdyhyYWRpdXMsIDIpIC0gTWF0aC5wb3coYm94SGVpZ2h0IC8gMiwgMikpKTtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oZGF0YS54ICsgeERlbHRhQ29vcmQsIGRhdGEueSArIGJveEhlaWdodCAvIDIpO1xuICAgICAgICBjb250ZXh0LmxpbmVUbyhkYXRhLnggKyByYWRpdXMgKyBib3hXaWR0aCwgZGF0YS55ICsgYm94SGVpZ2h0IC8gMik7XG4gICAgICAgIGNvbnRleHQubGluZVRvKGRhdGEueCArIHJhZGl1cyArIGJveFdpZHRoLCBkYXRhLnkgLSBib3hIZWlnaHQgLyAyKTtcbiAgICAgICAgY29udGV4dC5saW5lVG8oZGF0YS54ICsgeERlbHRhQ29vcmQsIGRhdGEueSAtIGJveEhlaWdodCAvIDIpO1xuICAgICAgICBjb250ZXh0LmFyYyhkYXRhLngsIGRhdGEueSwgcmFkaXVzLCBhbmdsZVJhZGlhbiwgLWFuZ2xlUmFkaWFuKTtcbiAgICAgICAgY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmFyYyhkYXRhLngsIGRhdGEueSwgZGF0YS5zaXplICsgUEFERElORywgMCwgTWF0aC5QSSAqIDIpO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICB9XG4gICAgY29udGV4dC5zaGFkb3dPZmZzZXRYID0gMDtcbiAgICBjb250ZXh0LnNoYWRvd09mZnNldFkgPSAwO1xuICAgIGNvbnRleHQuc2hhZG93Qmx1ciA9IDA7XG4gICAgLy8gQW5kIGZpbmFsbHkgd2UgZHJhdyB0aGUgbGFiZWxcbiAgICAoMCwgbGFiZWxfMS5kZWZhdWx0KShjb250ZXh0LCBkYXRhLCBzZXR0aW5ncyk7XG59XG5leHBvcnRzLmRlZmF1bHQgPSBkcmF3SG92ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmZ1bmN0aW9uIGRyYXdMYWJlbChjb250ZXh0LCBkYXRhLCBzZXR0aW5ncykge1xuICAgIGlmICghZGF0YS5sYWJlbClcbiAgICAgICAgcmV0dXJuO1xuICAgIHZhciBzaXplID0gc2V0dGluZ3MubGFiZWxTaXplLCBmb250ID0gc2V0dGluZ3MubGFiZWxGb250LCB3ZWlnaHQgPSBzZXR0aW5ncy5sYWJlbFdlaWdodCwgY29sb3IgPSBzZXR0aW5ncy5sYWJlbENvbG9yLmF0dHJpYnV0ZVxuICAgICAgICA/IGRhdGFbc2V0dGluZ3MubGFiZWxDb2xvci5hdHRyaWJ1dGVdIHx8IHNldHRpbmdzLmxhYmVsQ29sb3IuY29sb3IgfHwgXCIjMDAwXCJcbiAgICAgICAgOiBzZXR0aW5ncy5sYWJlbENvbG9yLmNvbG9yO1xuICAgIGNvbnRleHQuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgY29udGV4dC5mb250ID0gXCJcIi5jb25jYXQod2VpZ2h0LCBcIiBcIikuY29uY2F0KHNpemUsIFwicHggXCIpLmNvbmNhdChmb250KTtcbiAgICBjb250ZXh0LmZpbGxUZXh0KGRhdGEubGFiZWwsIGRhdGEueCArIGRhdGEuc2l6ZSArIDMsIGRhdGEueSArIHNpemUgLyAzKTtcbn1cbmV4cG9ydHMuZGVmYXVsdCA9IGRyYXdMYWJlbDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlRWRnZUNvbXBvdW5kUHJvZ3JhbSA9IGV4cG9ydHMuQWJzdHJhY3RFZGdlUHJvZ3JhbSA9IHZvaWQgMDtcbi8qKlxuICogU2lnbWEuanMgV2ViR0wgQWJzdHJhY3QgRWRnZSBQcm9ncmFtXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogQG1vZHVsZVxuICovXG52YXIgcHJvZ3JhbV8xID0gcmVxdWlyZShcIi4vcHJvZ3JhbVwiKTtcbi8qKlxuICogRWRnZSBQcm9ncmFtIGNsYXNzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgQWJzdHJhY3RFZGdlUHJvZ3JhbSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQWJzdHJhY3RFZGdlUHJvZ3JhbSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBYnN0cmFjdEVkZ2VQcm9ncmFtKGdsLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGZyYWdtZW50U2hhZGVyU291cmNlLCBwb2ludHMsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIGdsLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGZyYWdtZW50U2hhZGVyU291cmNlLCBwb2ludHMsIGF0dHJpYnV0ZXMpIHx8IHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBBYnN0cmFjdEVkZ2VQcm9ncmFtO1xufShwcm9ncmFtXzEuQWJzdHJhY3RQcm9ncmFtKSk7XG5leHBvcnRzLkFic3RyYWN0RWRnZVByb2dyYW0gPSBBYnN0cmFjdEVkZ2VQcm9ncmFtO1xuZnVuY3Rpb24gY3JlYXRlRWRnZUNvbXBvdW5kUHJvZ3JhbShwcm9ncmFtQ2xhc3Nlcykge1xuICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEVkZ2VDb21wb3VuZFByb2dyYW0oZ2wsIHJlbmRlcmVyKSB7XG4gICAgICAgICAgICB0aGlzLnByb2dyYW1zID0gcHJvZ3JhbUNsYXNzZXMubWFwKGZ1bmN0aW9uIChQcm9ncmFtQ2xhc3MpIHsgcmV0dXJuIG5ldyBQcm9ncmFtQ2xhc3MoZ2wsIHJlbmRlcmVyKTsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgRWRnZUNvbXBvdW5kUHJvZ3JhbS5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucHJvZ3JhbXMuZm9yRWFjaChmdW5jdGlvbiAocHJvZ3JhbSkgeyByZXR1cm4gcHJvZ3JhbS5idWZmZXJEYXRhKCk7IH0pO1xuICAgICAgICB9O1xuICAgICAgICBFZGdlQ29tcG91bmRQcm9ncmFtLnByb3RvdHlwZS5hbGxvY2F0ZSA9IGZ1bmN0aW9uIChjYXBhY2l0eSkge1xuICAgICAgICAgICAgdGhpcy5wcm9ncmFtcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9ncmFtKSB7IHJldHVybiBwcm9ncmFtLmFsbG9jYXRlKGNhcGFjaXR5KTsgfSk7XG4gICAgICAgIH07XG4gICAgICAgIEVkZ2VDb21wb3VuZFByb2dyYW0ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBub3RoaW5nIHRvZG8sIGl0J3MgYWxyZWFkeSBkb25lIGluIGVhY2ggcHJvZ3JhbSBjb25zdHJ1Y3RvclxuICAgICAgICB9O1xuICAgICAgICBFZGdlQ29tcG91bmRQcm9ncmFtLnByb3RvdHlwZS5jb21wdXRlSW5kaWNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucHJvZ3JhbXMuZm9yRWFjaChmdW5jdGlvbiAocHJvZ3JhbSkgeyByZXR1cm4gcHJvZ3JhbS5jb21wdXRlSW5kaWNlcygpOyB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgRWRnZUNvbXBvdW5kUHJvZ3JhbS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKHBhcmFtcykge1xuICAgICAgICAgICAgdGhpcy5wcm9ncmFtcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9ncmFtKSB7XG4gICAgICAgICAgICAgICAgcHJvZ3JhbS5iaW5kKCk7XG4gICAgICAgICAgICAgICAgcHJvZ3JhbS5idWZmZXJEYXRhKCk7XG4gICAgICAgICAgICAgICAgcHJvZ3JhbS5yZW5kZXIocGFyYW1zKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBFZGdlQ29tcG91bmRQcm9ncmFtLnByb3RvdHlwZS5wcm9jZXNzID0gZnVuY3Rpb24gKHNvdXJjZURhdGEsIHRhcmdldERhdGEsIGRhdGEsIGhpZGRlbiwgb2Zmc2V0KSB7XG4gICAgICAgICAgICB0aGlzLnByb2dyYW1zLmZvckVhY2goZnVuY3Rpb24gKHByb2dyYW0pIHsgcmV0dXJuIHByb2dyYW0ucHJvY2Vzcyhzb3VyY2VEYXRhLCB0YXJnZXREYXRhLCBkYXRhLCBoaWRkZW4sIG9mZnNldCk7IH0pO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gRWRnZUNvbXBvdW5kUHJvZ3JhbTtcbiAgICB9KCkpO1xufVxuZXhwb3J0cy5jcmVhdGVFZGdlQ29tcG91bmRQcm9ncmFtID0gY3JlYXRlRWRnZUNvbXBvdW5kUHJvZ3JhbTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuY3JlYXRlTm9kZUNvbXBvdW5kUHJvZ3JhbSA9IGV4cG9ydHMuQWJzdHJhY3ROb2RlUHJvZ3JhbSA9IHZvaWQgMDtcbi8qKlxuICogU2lnbWEuanMgV2ViR0wgQWJzdHJhY3QgTm9kZSBQcm9ncmFtXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogQG1vZHVsZVxuICovXG52YXIgcHJvZ3JhbV8xID0gcmVxdWlyZShcIi4vcHJvZ3JhbVwiKTtcbi8qKlxuICogTm9kZSBQcm9ncmFtIGNsYXNzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgQWJzdHJhY3ROb2RlUHJvZ3JhbSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoQWJzdHJhY3ROb2RlUHJvZ3JhbSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBBYnN0cmFjdE5vZGVQcm9ncmFtKGdsLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGZyYWdtZW50U2hhZGVyU291cmNlLCBwb2ludHMsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZ2wsIHZlcnRleFNoYWRlclNvdXJjZSwgZnJhZ21lbnRTaGFkZXJTb3VyY2UsIHBvaW50cywgYXR0cmlidXRlcykgfHwgdGhpcztcbiAgICAgICAgLy8gTG9jYXRpb25zXG4gICAgICAgIF90aGlzLnBvc2l0aW9uTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihfdGhpcy5wcm9ncmFtLCBcImFfcG9zaXRpb25cIik7XG4gICAgICAgIF90aGlzLnNpemVMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwiYV9zaXplXCIpO1xuICAgICAgICBfdGhpcy5jb2xvckxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJhX2NvbG9yXCIpO1xuICAgICAgICAvLyBVbmlmb3JtIExvY2F0aW9uXG4gICAgICAgIHZhciBtYXRyaXhMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihfdGhpcy5wcm9ncmFtLCBcInVfbWF0cml4XCIpO1xuICAgICAgICBpZiAobWF0cml4TG9jYXRpb24gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBYnN0cmFjdE5vZGVQcm9ncmFtOiBlcnJvciB3aGlsZSBnZXR0aW5nIG1hdHJpeExvY2F0aW9uXCIpO1xuICAgICAgICBfdGhpcy5tYXRyaXhMb2NhdGlvbiA9IG1hdHJpeExvY2F0aW9uO1xuICAgICAgICB2YXIgcmF0aW9Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihfdGhpcy5wcm9ncmFtLCBcInVfcmF0aW9cIik7XG4gICAgICAgIGlmIChyYXRpb0xvY2F0aW9uID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWJzdHJhY3ROb2RlUHJvZ3JhbTogZXJyb3Igd2hpbGUgZ2V0dGluZyByYXRpb0xvY2F0aW9uXCIpO1xuICAgICAgICBfdGhpcy5yYXRpb0xvY2F0aW9uID0gcmF0aW9Mb2NhdGlvbjtcbiAgICAgICAgdmFyIHNjYWxlTG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJ1X3NjYWxlXCIpO1xuICAgICAgICBpZiAoc2NhbGVMb2NhdGlvbiA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkFic3RyYWN0Tm9kZVByb2dyYW06IGVycm9yIHdoaWxlIGdldHRpbmcgc2NhbGVMb2NhdGlvblwiKTtcbiAgICAgICAgX3RoaXMuc2NhbGVMb2NhdGlvbiA9IHNjYWxlTG9jYXRpb247XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQWJzdHJhY3ROb2RlUHJvZ3JhbS5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5wb3NpdGlvbkxvY2F0aW9uKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5zaXplTG9jYXRpb24pO1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLmNvbG9yTG9jYXRpb24pO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMucG9zaXRpb25Mb2NhdGlvbiwgMiwgZ2wuRkxPQVQsIGZhbHNlLCB0aGlzLmF0dHJpYnV0ZXMgKiBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQsIDApO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMuc2l6ZUxvY2F0aW9uLCAxLCBnbC5GTE9BVCwgZmFsc2UsIHRoaXMuYXR0cmlidXRlcyAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCwgOCk7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5jb2xvckxvY2F0aW9uLCA0LCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCB0aGlzLmF0dHJpYnV0ZXMgKiBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQsIDEyKTtcbiAgICB9O1xuICAgIHJldHVybiBBYnN0cmFjdE5vZGVQcm9ncmFtO1xufShwcm9ncmFtXzEuQWJzdHJhY3RQcm9ncmFtKSk7XG5leHBvcnRzLkFic3RyYWN0Tm9kZVByb2dyYW0gPSBBYnN0cmFjdE5vZGVQcm9ncmFtO1xuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb24gY29tYmluaW5nIHR3byBvciBtb3JlIHByb2dyYW1zIGludG8gYSBzaW5nbGUgY29tcG91bmQgb25lLlxuICogTm90ZSB0aGF0IHRoaXMgaXMgbW9yZSBhIHF1aWNrICYgZWFzeSB3YXkgdG8gY29tYmluZSBwcm9ncmFtIHRoYW4gYSByZWFsbHlcbiAqIHBlcmZvcm1hbnQgb3B0aW9uLiBNb3JlIHBlcmZvcm1hbnQgcHJvZ3JhbXMgY2FuIGJlIHdyaXR0ZW4gZW50aXJlbHkuXG4gKlxuICogQHBhcmFtICB7YXJyYXl9ICAgIHByb2dyYW1DbGFzc2VzIC0gUHJvZ3JhbSBjbGFzc2VzIHRvIGNvbWJpbmUuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlTm9kZUNvbXBvdW5kUHJvZ3JhbShwcm9ncmFtQ2xhc3Nlcykge1xuICAgIHJldHVybiAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIE5vZGVDb21wb3VuZFByb2dyYW0oZ2wsIHJlbmRlcmVyKSB7XG4gICAgICAgICAgICB0aGlzLnByb2dyYW1zID0gcHJvZ3JhbUNsYXNzZXMubWFwKGZ1bmN0aW9uIChQcm9ncmFtQ2xhc3MpIHsgcmV0dXJuIG5ldyBQcm9ncmFtQ2xhc3MoZ2wsIHJlbmRlcmVyKTsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgTm9kZUNvbXBvdW5kUHJvZ3JhbS5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHRoaXMucHJvZ3JhbXMuZm9yRWFjaChmdW5jdGlvbiAocHJvZ3JhbSkgeyByZXR1cm4gcHJvZ3JhbS5idWZmZXJEYXRhKCk7IH0pO1xuICAgICAgICB9O1xuICAgICAgICBOb2RlQ29tcG91bmRQcm9ncmFtLnByb3RvdHlwZS5hbGxvY2F0ZSA9IGZ1bmN0aW9uIChjYXBhY2l0eSkge1xuICAgICAgICAgICAgdGhpcy5wcm9ncmFtcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9ncmFtKSB7IHJldHVybiBwcm9ncmFtLmFsbG9jYXRlKGNhcGFjaXR5KTsgfSk7XG4gICAgICAgIH07XG4gICAgICAgIE5vZGVDb21wb3VuZFByb2dyYW0ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBub3RoaW5nIHRvZG8sIGl0J3MgYWxyZWFkeSBkb25lIGluIGVhY2ggcHJvZ3JhbSBjb25zdHJ1Y3RvclxuICAgICAgICB9O1xuICAgICAgICBOb2RlQ29tcG91bmRQcm9ncmFtLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgICAgICB0aGlzLnByb2dyYW1zLmZvckVhY2goZnVuY3Rpb24gKHByb2dyYW0pIHtcbiAgICAgICAgICAgICAgICBwcm9ncmFtLmJpbmQoKTtcbiAgICAgICAgICAgICAgICBwcm9ncmFtLmJ1ZmZlckRhdGEoKTtcbiAgICAgICAgICAgICAgICBwcm9ncmFtLnJlbmRlcihwYXJhbXMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIE5vZGVDb21wb3VuZFByb2dyYW0ucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoZGF0YSwgaGlkZGVuLCBvZmZzZXQpIHtcbiAgICAgICAgICAgIHRoaXMucHJvZ3JhbXMuZm9yRWFjaChmdW5jdGlvbiAocHJvZ3JhbSkgeyByZXR1cm4gcHJvZ3JhbS5wcm9jZXNzKGRhdGEsIGhpZGRlbiwgb2Zmc2V0KTsgfSk7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBOb2RlQ29tcG91bmRQcm9ncmFtO1xuICAgIH0oKSk7XG59XG5leHBvcnRzLmNyZWF0ZU5vZGVDb21wb3VuZFByb2dyYW0gPSBjcmVhdGVOb2RlQ29tcG91bmRQcm9ncmFtO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFic3RyYWN0UHJvZ3JhbSA9IHZvaWQgMDtcbi8qKlxuICogU2lnbWEuanMgV2ViR0wgUmVuZGVyZXIgUHJvZ3JhbVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYSBzaW5nbGUgV2ViR0wgcHJvZ3JhbSB1c2VkIGJ5IHNpZ21hJ3MgV2ViR0wgcmVuZGVyZXIuXG4gKiBAbW9kdWxlXG4gKi9cbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uL3NoYWRlcnMvdXRpbHNcIik7XG4vKipcbiAqIEFic3RyYWN0IFByb2dyYW0gY2xhc3MuXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBBYnN0cmFjdFByb2dyYW0gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQWJzdHJhY3RQcm9ncmFtKGdsLCB2ZXJ0ZXhTaGFkZXJTb3VyY2UsIGZyYWdtZW50U2hhZGVyU291cmNlLCBwb2ludHMsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdGhpcy5hcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoKTtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBwb2ludHM7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMuZ2wgPSBnbDtcbiAgICAgICAgdGhpcy52ZXJ0ZXhTaGFkZXJTb3VyY2UgPSB2ZXJ0ZXhTaGFkZXJTb3VyY2U7XG4gICAgICAgIHRoaXMuZnJhZ21lbnRTaGFkZXJTb3VyY2UgPSBmcmFnbWVudFNoYWRlclNvdXJjZTtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgICAgICBpZiAoYnVmZmVyID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQWJzdHJhY3RQcm9ncmFtOiBlcnJvciB3aGlsZSBjcmVhdGluZyB0aGUgYnVmZmVyXCIpO1xuICAgICAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYnVmZmVyKTtcbiAgICAgICAgdGhpcy52ZXJ0ZXhTaGFkZXIgPSAoMCwgdXRpbHNfMS5sb2FkVmVydGV4U2hhZGVyKShnbCwgdGhpcy52ZXJ0ZXhTaGFkZXJTb3VyY2UpO1xuICAgICAgICB0aGlzLmZyYWdtZW50U2hhZGVyID0gKDAsIHV0aWxzXzEubG9hZEZyYWdtZW50U2hhZGVyKShnbCwgdGhpcy5mcmFnbWVudFNoYWRlclNvdXJjZSk7XG4gICAgICAgIHRoaXMucHJvZ3JhbSA9ICgwLCB1dGlsc18xLmxvYWRQcm9ncmFtKShnbCwgW3RoaXMudmVydGV4U2hhZGVyLCB0aGlzLmZyYWdtZW50U2hhZGVyXSk7XG4gICAgfVxuICAgIEFic3RyYWN0UHJvZ3JhbS5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGdsID0gdGhpcy5nbDtcbiAgICAgICAgZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIHRoaXMuYXJyYXksIGdsLkRZTkFNSUNfRFJBVyk7XG4gICAgfTtcbiAgICBBYnN0cmFjdFByb2dyYW0ucHJvdG90eXBlLmFsbG9jYXRlID0gZnVuY3Rpb24gKGNhcGFjaXR5KSB7XG4gICAgICAgIHRoaXMuYXJyYXkgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMucG9pbnRzICogdGhpcy5hdHRyaWJ1dGVzICogY2FwYWNpdHkpO1xuICAgIH07XG4gICAgQWJzdHJhY3RQcm9ncmFtLnByb3RvdHlwZS5oYXNOb3RoaW5nVG9SZW5kZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gMDtcbiAgICB9O1xuICAgIHJldHVybiBBYnN0cmFjdFByb2dyYW07XG59KCkpO1xuZXhwb3J0cy5BYnN0cmFjdFByb2dyYW0gPSBBYnN0cmFjdFByb2dyYW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8qKlxuICogU2lnbWEuanMgV2ViR0wgUmVuZGVyZXIgRWRnZSBBcnJvdyBQcm9ncmFtXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogQ29tcG91bmQgcHJvZ3JhbSByZW5kZXJpbmcgZWRnZXMgYXMgYW4gYXJyb3cgZnJvbSB0aGUgc291cmNlIHRvIHRoZSB0YXJnZXQuXG4gKiBAbW9kdWxlXG4gKi9cbnZhciBlZGdlXzEgPSByZXF1aXJlKFwiLi9jb21tb24vZWRnZVwiKTtcbnZhciBlZGdlX2Fycm93SGVhZF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2VkZ2UuYXJyb3dIZWFkXCIpKTtcbnZhciBlZGdlX2NsYW1wZWRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9lZGdlLmNsYW1wZWRcIikpO1xudmFyIEVkZ2VBcnJvd1Byb2dyYW0gPSAoMCwgZWRnZV8xLmNyZWF0ZUVkZ2VDb21wb3VuZFByb2dyYW0pKFtlZGdlX2NsYW1wZWRfMS5kZWZhdWx0LCBlZGdlX2Fycm93SGVhZF8xLmRlZmF1bHRdKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEVkZ2VBcnJvd1Byb2dyYW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi91dGlsc1wiKTtcbnZhciBlZGdlX2Fycm93SGVhZF92ZXJ0X2dsc2xfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vc2hhZGVycy9lZGdlLmFycm93SGVhZC52ZXJ0Lmdsc2wuanNcIikpO1xudmFyIGVkZ2VfYXJyb3dIZWFkX2ZyYWdfZ2xzbF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9zaGFkZXJzL2VkZ2UuYXJyb3dIZWFkLmZyYWcuZ2xzbC5qc1wiKSk7XG52YXIgZWRnZV8xID0gcmVxdWlyZShcIi4vY29tbW9uL2VkZ2VcIik7XG52YXIgUE9JTlRTID0gMywgQVRUUklCVVRFUyA9IDksIFNUUklERSA9IFBPSU5UUyAqIEFUVFJJQlVURVM7XG52YXIgRWRnZUFycm93SGVhZFByb2dyYW0gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEVkZ2VBcnJvd0hlYWRQcm9ncmFtLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEVkZ2VBcnJvd0hlYWRQcm9ncmFtKGdsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGdsLCBlZGdlX2Fycm93SGVhZF92ZXJ0X2dsc2xfMS5kZWZhdWx0LCBlZGdlX2Fycm93SGVhZF9mcmFnX2dsc2xfMS5kZWZhdWx0LCBQT0lOVFMsIEFUVFJJQlVURVMpIHx8IHRoaXM7XG4gICAgICAgIC8vIExvY2F0aW9uc1xuICAgICAgICBfdGhpcy5wb3NpdGlvbkxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJhX3Bvc2l0aW9uXCIpO1xuICAgICAgICBfdGhpcy5jb2xvckxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJhX2NvbG9yXCIpO1xuICAgICAgICBfdGhpcy5ub3JtYWxMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwiYV9ub3JtYWxcIik7XG4gICAgICAgIF90aGlzLnJhZGl1c0xvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJhX3JhZGl1c1wiKTtcbiAgICAgICAgX3RoaXMuYmFyeWNlbnRyaWNMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwiYV9iYXJ5Y2VudHJpY1wiKTtcbiAgICAgICAgLy8gVW5pZm9ybSBsb2NhdGlvbnNcbiAgICAgICAgdmFyIG1hdHJpeExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwidV9tYXRyaXhcIik7XG4gICAgICAgIGlmIChtYXRyaXhMb2NhdGlvbiA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVkZ2VBcnJvd0hlYWRQcm9ncmFtOiBlcnJvciB3aGlsZSBnZXR0aW5nIG1hdHJpeExvY2F0aW9uXCIpO1xuICAgICAgICBfdGhpcy5tYXRyaXhMb2NhdGlvbiA9IG1hdHJpeExvY2F0aW9uO1xuICAgICAgICB2YXIgc3FydFpvb21SYXRpb0xvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwidV9zcXJ0Wm9vbVJhdGlvXCIpO1xuICAgICAgICBpZiAoc3FydFpvb21SYXRpb0xvY2F0aW9uID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWRnZUFycm93SGVhZFByb2dyYW06IGVycm9yIHdoaWxlIGdldHRpbmcgc3FydFpvb21SYXRpb0xvY2F0aW9uXCIpO1xuICAgICAgICBfdGhpcy5zcXJ0Wm9vbVJhdGlvTG9jYXRpb24gPSBzcXJ0Wm9vbVJhdGlvTG9jYXRpb247XG4gICAgICAgIHZhciBjb3JyZWN0aW9uUmF0aW9Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihfdGhpcy5wcm9ncmFtLCBcInVfY29ycmVjdGlvblJhdGlvXCIpO1xuICAgICAgICBpZiAoY29ycmVjdGlvblJhdGlvTG9jYXRpb24gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFZGdlQXJyb3dIZWFkUHJvZ3JhbTogZXJyb3Igd2hpbGUgZ2V0dGluZyBjb3JyZWN0aW9uUmF0aW9Mb2NhdGlvblwiKTtcbiAgICAgICAgX3RoaXMuY29ycmVjdGlvblJhdGlvTG9jYXRpb24gPSBjb3JyZWN0aW9uUmF0aW9Mb2NhdGlvbjtcbiAgICAgICAgX3RoaXMuYmluZCgpO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEVkZ2VBcnJvd0hlYWRQcm9ncmFtLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICAvLyBCaW5kaW5nc1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnBvc2l0aW9uTG9jYXRpb24pO1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLm5vcm1hbExvY2F0aW9uKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5yYWRpdXNMb2NhdGlvbik7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuY29sb3JMb2NhdGlvbik7XG4gICAgICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuYmFyeWNlbnRyaWNMb2NhdGlvbik7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5wb3NpdGlvbkxvY2F0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIEFUVFJJQlVURVMgKiBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQsIDApO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMubm9ybWFsTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgQVRUUklCVVRFUyAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCwgOCk7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5yYWRpdXNMb2NhdGlvbiwgMSwgZ2wuRkxPQVQsIGZhbHNlLCBBVFRSSUJVVEVTICogRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCAxNik7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5jb2xvckxvY2F0aW9uLCA0LCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCBBVFRSSUJVVEVTICogRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCAyMCk7XG4gICAgICAgIC8vIFRPRE86IG1heWJlIHdlIGNhbiBvcHRpbWl6ZSBoZXJlIGJ5IHBhY2tpbmcgdGhpcyBpbiBhIGJpdCBtYXNrXG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5iYXJ5Y2VudHJpY0xvY2F0aW9uLCAzLCBnbC5GTE9BVCwgZmFsc2UsIEFUVFJJQlVURVMgKiBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQsIDI0KTtcbiAgICB9O1xuICAgIEVkZ2VBcnJvd0hlYWRQcm9ncmFtLnByb3RvdHlwZS5jb21wdXRlSW5kaWNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gbm90aGluZyB0byBkb1xuICAgIH07XG4gICAgRWRnZUFycm93SGVhZFByb2dyYW0ucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoc291cmNlRGF0YSwgdGFyZ2V0RGF0YSwgZGF0YSwgaGlkZGVuLCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKGhpZGRlbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaV8xID0gb2Zmc2V0ICogU1RSSURFLCBsID0gaV8xICsgU1RSSURFOyBpXzEgPCBsOyBpXzErKylcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2lfMV0gPSAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0aGlja25lc3MgPSBkYXRhLnNpemUgfHwgMSwgcmFkaXVzID0gdGFyZ2V0RGF0YS5zaXplIHx8IDEsIHgxID0gc291cmNlRGF0YS54LCB5MSA9IHNvdXJjZURhdGEueSwgeDIgPSB0YXJnZXREYXRhLngsIHkyID0gdGFyZ2V0RGF0YS55LCBjb2xvciA9ICgwLCB1dGlsc18xLmZsb2F0Q29sb3IpKGRhdGEuY29sb3IpO1xuICAgICAgICAvLyBDb21wdXRpbmcgbm9ybWFsc1xuICAgICAgICB2YXIgZHggPSB4MiAtIHgxLCBkeSA9IHkyIC0geTE7XG4gICAgICAgIHZhciBsZW4gPSBkeCAqIGR4ICsgZHkgKiBkeSwgbjEgPSAwLCBuMiA9IDA7XG4gICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgICAgIG4xID0gLWR5ICogbGVuICogdGhpY2tuZXNzO1xuICAgICAgICAgICAgbjIgPSBkeCAqIGxlbiAqIHRoaWNrbmVzcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSA9IFBPSU5UUyAqIEFUVFJJQlVURVMgKiBvZmZzZXQ7XG4gICAgICAgIHZhciBhcnJheSA9IHRoaXMuYXJyYXk7XG4gICAgICAgIC8vIEZpcnN0IHBvaW50XG4gICAgICAgIGFycmF5W2krK10gPSB4MjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IHkyO1xuICAgICAgICBhcnJheVtpKytdID0gLW4xO1xuICAgICAgICBhcnJheVtpKytdID0gLW4yO1xuICAgICAgICBhcnJheVtpKytdID0gcmFkaXVzO1xuICAgICAgICBhcnJheVtpKytdID0gY29sb3I7XG4gICAgICAgIGFycmF5W2krK10gPSAxO1xuICAgICAgICBhcnJheVtpKytdID0gMDtcbiAgICAgICAgYXJyYXlbaSsrXSA9IDA7XG4gICAgICAgIC8vIFNlY29uZCBwb2ludFxuICAgICAgICBhcnJheVtpKytdID0geDI7XG4gICAgICAgIGFycmF5W2krK10gPSB5MjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IHJhZGl1cztcbiAgICAgICAgYXJyYXlbaSsrXSA9IGNvbG9yO1xuICAgICAgICBhcnJheVtpKytdID0gMDtcbiAgICAgICAgYXJyYXlbaSsrXSA9IDE7XG4gICAgICAgIGFycmF5W2krK10gPSAwO1xuICAgICAgICAvLyBUaGlyZCBwb2ludFxuICAgICAgICBhcnJheVtpKytdID0geDI7XG4gICAgICAgIGFycmF5W2krK10gPSB5MjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IHJhZGl1cztcbiAgICAgICAgYXJyYXlbaSsrXSA9IGNvbG9yO1xuICAgICAgICBhcnJheVtpKytdID0gMDtcbiAgICAgICAgYXJyYXlbaSsrXSA9IDA7XG4gICAgICAgIGFycmF5W2ldID0gMTtcbiAgICB9O1xuICAgIEVkZ2VBcnJvd0hlYWRQcm9ncmFtLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc05vdGhpbmdUb1JlbmRlcigpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICB2YXIgcHJvZ3JhbSA9IHRoaXMucHJvZ3JhbTtcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgLy8gQmluZGluZyB1bmlmb3Jtc1xuICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMubWF0cml4TG9jYXRpb24sIGZhbHNlLCBwYXJhbXMubWF0cml4KTtcbiAgICAgICAgZ2wudW5pZm9ybTFmKHRoaXMuc3FydFpvb21SYXRpb0xvY2F0aW9uLCBNYXRoLnNxcnQocGFyYW1zLnJhdGlvKSk7XG4gICAgICAgIGdsLnVuaWZvcm0xZih0aGlzLmNvcnJlY3Rpb25SYXRpb0xvY2F0aW9uLCBwYXJhbXMuY29ycmVjdGlvblJhdGlvKTtcbiAgICAgICAgLy8gRHJhd2luZzpcbiAgICAgICAgZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsIDAsIHRoaXMuYXJyYXkubGVuZ3RoIC8gQVRUUklCVVRFUyk7XG4gICAgfTtcbiAgICByZXR1cm4gRWRnZUFycm93SGVhZFByb2dyYW07XG59KGVkZ2VfMS5BYnN0cmFjdEVkZ2VQcm9ncmFtKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBFZGdlQXJyb3dIZWFkUHJvZ3JhbTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBlZGdlXzEgPSByZXF1aXJlKFwiLi9jb21tb24vZWRnZVwiKTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzXCIpO1xudmFyIGVkZ2VfY2xhbXBlZF92ZXJ0X2dsc2xfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vc2hhZGVycy9lZGdlLmNsYW1wZWQudmVydC5nbHNsLmpzXCIpKTtcbnZhciBlZGdlX2ZyYWdfZ2xzbF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuLi9zaGFkZXJzL2VkZ2UuZnJhZy5nbHNsLmpzXCIpKTtcbnZhciBQT0lOVFMgPSA0LCBBVFRSSUJVVEVTID0gNiwgU1RSSURFID0gUE9JTlRTICogQVRUUklCVVRFUztcbnZhciBFZGdlQ2xhbXBlZFByb2dyYW0gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEVkZ2VDbGFtcGVkUHJvZ3JhbSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFZGdlQ2xhbXBlZFByb2dyYW0oZ2wpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZ2wsIGVkZ2VfY2xhbXBlZF92ZXJ0X2dsc2xfMS5kZWZhdWx0LCBlZGdlX2ZyYWdfZ2xzbF8xLmRlZmF1bHQsIFBPSU5UUywgQVRUUklCVVRFUykgfHwgdGhpcztcbiAgICAgICAgLy8gSW5pdGlhbGl6aW5nIGluZGljZXMgYnVmZmVyXG4gICAgICAgIHZhciBpbmRpY2VzQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgICAgIGlmIChpbmRpY2VzQnVmZmVyID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWRnZUNsYW1wZWRQcm9ncmFtOiBlcnJvciB3aGlsZSBnZXR0aW5nIHJlc29sdXRpb25Mb2NhdGlvblwiKTtcbiAgICAgICAgX3RoaXMuaW5kaWNlc0J1ZmZlciA9IGluZGljZXNCdWZmZXI7XG4gICAgICAgIC8vIExvY2F0aW9uczpcbiAgICAgICAgX3RoaXMucG9zaXRpb25Mb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwiYV9wb3NpdGlvblwiKTtcbiAgICAgICAgX3RoaXMuY29sb3JMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwiYV9jb2xvclwiKTtcbiAgICAgICAgX3RoaXMubm9ybWFsTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihfdGhpcy5wcm9ncmFtLCBcImFfbm9ybWFsXCIpO1xuICAgICAgICBfdGhpcy5yYWRpdXNMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwiYV9yYWRpdXNcIik7XG4gICAgICAgIC8vIFVuaWZvcm0gbG9jYXRpb25zXG4gICAgICAgIHZhciBtYXRyaXhMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihfdGhpcy5wcm9ncmFtLCBcInVfbWF0cml4XCIpO1xuICAgICAgICBpZiAobWF0cml4TG9jYXRpb24gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFZGdlQ2xhbXBlZFByb2dyYW06IGVycm9yIHdoaWxlIGdldHRpbmcgbWF0cml4TG9jYXRpb25cIik7XG4gICAgICAgIF90aGlzLm1hdHJpeExvY2F0aW9uID0gbWF0cml4TG9jYXRpb247XG4gICAgICAgIHZhciBzcXJ0Wm9vbVJhdGlvTG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJ1X3NxcnRab29tUmF0aW9cIik7XG4gICAgICAgIGlmIChzcXJ0Wm9vbVJhdGlvTG9jYXRpb24gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFZGdlQ2xhbXBlZFByb2dyYW06IGVycm9yIHdoaWxlIGdldHRpbmcgY2FtZXJhUmF0aW9Mb2NhdGlvblwiKTtcbiAgICAgICAgX3RoaXMuc3FydFpvb21SYXRpb0xvY2F0aW9uID0gc3FydFpvb21SYXRpb0xvY2F0aW9uO1xuICAgICAgICB2YXIgY29ycmVjdGlvblJhdGlvTG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJ1X2NvcnJlY3Rpb25SYXRpb1wiKTtcbiAgICAgICAgaWYgKGNvcnJlY3Rpb25SYXRpb0xvY2F0aW9uID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWRnZUNsYW1wZWRQcm9ncmFtOiBlcnJvciB3aGlsZSBnZXR0aW5nIHZpZXdwb3J0UmF0aW9Mb2NhdGlvblwiKTtcbiAgICAgICAgX3RoaXMuY29ycmVjdGlvblJhdGlvTG9jYXRpb24gPSBjb3JyZWN0aW9uUmF0aW9Mb2NhdGlvbjtcbiAgICAgICAgLy8gRW5hYmxpbmcgdGhlIE9FU19lbGVtZW50X2luZGV4X3VpbnQgZXh0ZW5zaW9uXG4gICAgICAgIC8vIE5PVEU6IG9uIG9sZGVyIEdQVXMsIHRoaXMgbWVhbnMgdGhhdCByZWFsbHkgbGFyZ2UgZ3JhcGhzIHdvbid0XG4gICAgICAgIC8vIGhhdmUgYWxsIHRoZWlyIGVkZ2VzIHJlbmRlcmVkLiBCdXQgaXQgc2VlbXMgdGhhdCB0aGVcbiAgICAgICAgLy8gYE9FU19lbGVtZW50X2luZGV4X3VpbnRgIGlzIHF1aXRlIGV2ZXJ5d2hlcmUgc28gd2UnbGwgaGFuZGxlXG4gICAgICAgIC8vIHRoZSBwb3RlbnRpYWwgaXNzdWUgaWYgaXQgcmVhbGx5IGFyaXNlcy5cbiAgICAgICAgLy8gTk9URTogd2hlbiB1c2luZyB3ZWJnbDIsIHRoZSBleHRlbnNpb24gaXMgZW5hYmxlZCBieSBkZWZhdWx0XG4gICAgICAgIF90aGlzLmNhblVzZTMyQml0c0luZGljZXMgPSAoMCwgdXRpbHNfMS5jYW5Vc2UzMkJpdHNJbmRpY2VzKShnbCk7XG4gICAgICAgIF90aGlzLkluZGljZXNBcnJheSA9IF90aGlzLmNhblVzZTMyQml0c0luZGljZXMgPyBVaW50MzJBcnJheSA6IFVpbnQxNkFycmF5O1xuICAgICAgICBfdGhpcy5pbmRpY2VzQXJyYXkgPSBuZXcgX3RoaXMuSW5kaWNlc0FycmF5KCk7XG4gICAgICAgIF90aGlzLmluZGljZXNUeXBlID0gX3RoaXMuY2FuVXNlMzJCaXRzSW5kaWNlcyA/IGdsLlVOU0lHTkVEX0lOVCA6IGdsLlVOU0lHTkVEX1NIT1JUO1xuICAgICAgICBfdGhpcy5iaW5kKCk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgRWRnZUNsYW1wZWRQcm9ncmFtLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmluZGljZXNCdWZmZXIpO1xuICAgICAgICAvLyBCaW5kaW5nc1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnBvc2l0aW9uTG9jYXRpb24pO1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLm5vcm1hbExvY2F0aW9uKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5jb2xvckxvY2F0aW9uKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5yYWRpdXNMb2NhdGlvbik7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5wb3NpdGlvbkxvY2F0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIEFUVFJJQlVURVMgKiBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQsIDApO1xuICAgICAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHRoaXMubm9ybWFsTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgQVRUUklCVVRFUyAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCwgOCk7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5jb2xvckxvY2F0aW9uLCA0LCBnbC5VTlNJR05FRF9CWVRFLCB0cnVlLCBBVFRSSUJVVEVTICogRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCAxNik7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5yYWRpdXNMb2NhdGlvbiwgMSwgZ2wuRkxPQVQsIGZhbHNlLCBBVFRSSUJVVEVTICogRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCAyMCk7XG4gICAgfTtcbiAgICBFZGdlQ2xhbXBlZFByb2dyYW0ucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoc291cmNlRGF0YSwgdGFyZ2V0RGF0YSwgZGF0YSwgaGlkZGVuLCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKGhpZGRlbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaV8xID0gb2Zmc2V0ICogU1RSSURFLCBsID0gaV8xICsgU1RSSURFOyBpXzEgPCBsOyBpXzErKylcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2lfMV0gPSAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0aGlja25lc3MgPSBkYXRhLnNpemUgfHwgMSwgeDEgPSBzb3VyY2VEYXRhLngsIHkxID0gc291cmNlRGF0YS55LCB4MiA9IHRhcmdldERhdGEueCwgeTIgPSB0YXJnZXREYXRhLnksIHJhZGl1cyA9IHRhcmdldERhdGEuc2l6ZSB8fCAxLCBjb2xvciA9ICgwLCB1dGlsc18xLmZsb2F0Q29sb3IpKGRhdGEuY29sb3IpO1xuICAgICAgICAvLyBDb21wdXRpbmcgbm9ybWFsc1xuICAgICAgICB2YXIgZHggPSB4MiAtIHgxLCBkeSA9IHkyIC0geTE7XG4gICAgICAgIHZhciBsZW4gPSBkeCAqIGR4ICsgZHkgKiBkeSwgbjEgPSAwLCBuMiA9IDA7XG4gICAgICAgIGlmIChsZW4pIHtcbiAgICAgICAgICAgIGxlbiA9IDEgLyBNYXRoLnNxcnQobGVuKTtcbiAgICAgICAgICAgIG4xID0gLWR5ICogbGVuICogdGhpY2tuZXNzO1xuICAgICAgICAgICAgbjIgPSBkeCAqIGxlbiAqIHRoaWNrbmVzcztcbiAgICAgICAgfVxuICAgICAgICB2YXIgaSA9IFBPSU5UUyAqIEFUVFJJQlVURVMgKiBvZmZzZXQ7XG4gICAgICAgIHZhciBhcnJheSA9IHRoaXMuYXJyYXk7XG4gICAgICAgIC8vIEZpcnN0IHBvaW50XG4gICAgICAgIGFycmF5W2krK10gPSB4MTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IHkxO1xuICAgICAgICBhcnJheVtpKytdID0gbjE7XG4gICAgICAgIGFycmF5W2krK10gPSBuMjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IGNvbG9yO1xuICAgICAgICBhcnJheVtpKytdID0gMDtcbiAgICAgICAgLy8gRmlyc3QgcG9pbnQgZmxpcHBlZFxuICAgICAgICBhcnJheVtpKytdID0geDE7XG4gICAgICAgIGFycmF5W2krK10gPSB5MTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IGNvbG9yO1xuICAgICAgICBhcnJheVtpKytdID0gMDtcbiAgICAgICAgLy8gU2Vjb25kIHBvaW50XG4gICAgICAgIGFycmF5W2krK10gPSB4MjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IHkyO1xuICAgICAgICBhcnJheVtpKytdID0gbjE7XG4gICAgICAgIGFycmF5W2krK10gPSBuMjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IGNvbG9yO1xuICAgICAgICBhcnJheVtpKytdID0gcmFkaXVzO1xuICAgICAgICAvLyBTZWNvbmQgcG9pbnQgZmxpcHBlZFxuICAgICAgICBhcnJheVtpKytdID0geDI7XG4gICAgICAgIGFycmF5W2krK10gPSB5MjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IGNvbG9yO1xuICAgICAgICBhcnJheVtpXSA9IC1yYWRpdXM7XG4gICAgfTtcbiAgICBFZGdlQ2xhbXBlZFByb2dyYW0ucHJvdG90eXBlLmNvbXB1dGVJbmRpY2VzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbCA9IHRoaXMuYXJyYXkubGVuZ3RoIC8gQVRUUklCVVRFUztcbiAgICAgICAgdmFyIHNpemUgPSBsICsgbCAvIDI7XG4gICAgICAgIHZhciBpbmRpY2VzID0gbmV3IHRoaXMuSW5kaWNlc0FycmF5KHNpemUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgYyA9IDA7IGkgPCBsOyBpICs9IDQpIHtcbiAgICAgICAgICAgIGluZGljZXNbYysrXSA9IGk7XG4gICAgICAgICAgICBpbmRpY2VzW2MrK10gPSBpICsgMTtcbiAgICAgICAgICAgIGluZGljZXNbYysrXSA9IGkgKyAyO1xuICAgICAgICAgICAgaW5kaWNlc1tjKytdID0gaSArIDI7XG4gICAgICAgICAgICBpbmRpY2VzW2MrK10gPSBpICsgMTtcbiAgICAgICAgICAgIGluZGljZXNbYysrXSA9IGkgKyAzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaW5kaWNlc0FycmF5ID0gaW5kaWNlcztcbiAgICB9O1xuICAgIEVkZ2VDbGFtcGVkUHJvZ3JhbS5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5idWZmZXJEYXRhLmNhbGwodGhpcyk7XG4gICAgICAgIC8vIEluZGljZXMgZGF0YVxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmluZGljZXNBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1xuICAgIH07XG4gICAgRWRnZUNsYW1wZWRQcm9ncmFtLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc05vdGhpbmdUb1JlbmRlcigpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICB2YXIgcHJvZ3JhbSA9IHRoaXMucHJvZ3JhbTtcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgLy8gQmluZGluZyB1bmlmb3Jtc1xuICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KHRoaXMubWF0cml4TG9jYXRpb24sIGZhbHNlLCBwYXJhbXMubWF0cml4KTtcbiAgICAgICAgZ2wudW5pZm9ybTFmKHRoaXMuc3FydFpvb21SYXRpb0xvY2F0aW9uLCBNYXRoLnNxcnQocGFyYW1zLnJhdGlvKSk7XG4gICAgICAgIGdsLnVuaWZvcm0xZih0aGlzLmNvcnJlY3Rpb25SYXRpb0xvY2F0aW9uLCBwYXJhbXMuY29ycmVjdGlvblJhdGlvKTtcbiAgICAgICAgLy8gRHJhd2luZzpcbiAgICAgICAgZ2wuZHJhd0VsZW1lbnRzKGdsLlRSSUFOR0xFUywgdGhpcy5pbmRpY2VzQXJyYXkubGVuZ3RoLCB0aGlzLmluZGljZXNUeXBlLCAwKTtcbiAgICB9O1xuICAgIHJldHVybiBFZGdlQ2xhbXBlZFByb2dyYW07XG59KGVkZ2VfMS5BYnN0cmFjdEVkZ2VQcm9ncmFtKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBFZGdlQ2xhbXBlZFByb2dyYW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIFNpZ21hLmpzIFdlYkdMIFJlbmRlcmVyIEVkZ2UgUHJvZ3JhbVxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIFByb2dyYW0gcmVuZGVyaW5nIGVkZ2VzIGFzIHRoaWNrIGxpbmVzIHVzaW5nIGZvdXIgcG9pbnRzIHRyYW5zbGF0ZWRcbiAqIG9ydGhvZ29uYWxseSBmcm9tIHRoZSBzb3VyY2UgJiB0YXJnZXQncyBjZW50ZXJzIGJ5IGhhbGYgdGhpY2tuZXNzLlxuICpcbiAqIFJlbmRlcmluZyB0d28gdHJpYW5nbGVzIGJ5IHVzaW5nIG9ubHkgZm91ciBwb2ludHMgaXMgbWFkZSBwb3NzaWJsZSB0aHJvdWdoXG4gKiB0aGUgdXNlIG9mIGluZGljZXMuXG4gKlxuICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGZhc3RlciB0aGFuIHRoZSA2IHBvaW50cyAvIDIgdHJpYW5nbGVzIGFwcHJvYWNoIGFuZFxuICogc2hvdWxkIGhhbmRsZSB0aGlja25lc3MgYmV0dGVyIHRoYW4gd2l0aCBnbC5MSU5FUy5cbiAqXG4gKiBUaGlzIHZlcnNpb24gb2YgdGhlIHNoYWRlciBiYWxhbmNlcyBnZW9tZXRyeSBjb21wdXRhdGlvbiBldmVubHkgYmV0d2VlblxuICogdGhlIENQVSAmIEdQVSAobm9ybWFscyBhcmUgY29tcHV0ZWQgb24gdGhlIENQVSBzaWRlKS5cbiAqIEBtb2R1bGVcbiAqL1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vdXRpbHNcIik7XG52YXIgZWRnZV92ZXJ0X2dsc2xfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vc2hhZGVycy9lZGdlLnZlcnQuZ2xzbC5qc1wiKSk7XG52YXIgZWRnZV9mcmFnX2dsc2xfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vc2hhZGVycy9lZGdlLmZyYWcuZ2xzbC5qc1wiKSk7XG52YXIgZWRnZV8xID0gcmVxdWlyZShcIi4vY29tbW9uL2VkZ2VcIik7XG52YXIgUE9JTlRTID0gNCwgQVRUUklCVVRFUyA9IDUsIFNUUklERSA9IFBPSU5UUyAqIEFUVFJJQlVURVM7XG52YXIgRWRnZVByb2dyYW0gPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEVkZ2VQcm9ncmFtLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEVkZ2VQcm9ncmFtKGdsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGdsLCBlZGdlX3ZlcnRfZ2xzbF8xLmRlZmF1bHQsIGVkZ2VfZnJhZ19nbHNsXzEuZGVmYXVsdCwgUE9JTlRTLCBBVFRSSUJVVEVTKSB8fCB0aGlzO1xuICAgICAgICAvLyBJbml0aWFsaXppbmcgaW5kaWNlcyBidWZmZXJcbiAgICAgICAgdmFyIGluZGljZXNCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICAgICAgaWYgKGluZGljZXNCdWZmZXIgPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFZGdlUHJvZ3JhbTogZXJyb3Igd2hpbGUgY3JlYXRpbmcgaW5kaWNlc0J1ZmZlclwiKTtcbiAgICAgICAgX3RoaXMuaW5kaWNlc0J1ZmZlciA9IGluZGljZXNCdWZmZXI7XG4gICAgICAgIC8vIExvY2F0aW9uc1xuICAgICAgICBfdGhpcy5wb3NpdGlvbkxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJhX3Bvc2l0aW9uXCIpO1xuICAgICAgICBfdGhpcy5jb2xvckxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oX3RoaXMucHJvZ3JhbSwgXCJhX2NvbG9yXCIpO1xuICAgICAgICBfdGhpcy5ub3JtYWxMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwiYV9ub3JtYWxcIik7XG4gICAgICAgIHZhciBtYXRyaXhMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihfdGhpcy5wcm9ncmFtLCBcInVfbWF0cml4XCIpO1xuICAgICAgICBpZiAobWF0cml4TG9jYXRpb24gPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFZGdlUHJvZ3JhbTogZXJyb3Igd2hpbGUgZ2V0dGluZyBtYXRyaXhMb2NhdGlvblwiKTtcbiAgICAgICAgX3RoaXMubWF0cml4TG9jYXRpb24gPSBtYXRyaXhMb2NhdGlvbjtcbiAgICAgICAgdmFyIGNvcnJlY3Rpb25SYXRpb0xvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwidV9jb3JyZWN0aW9uUmF0aW9cIik7XG4gICAgICAgIGlmIChjb3JyZWN0aW9uUmF0aW9Mb2NhdGlvbiA9PT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkVkZ2VQcm9ncmFtOiBlcnJvciB3aGlsZSBnZXR0aW5nIGNvcnJlY3Rpb25SYXRpb0xvY2F0aW9uXCIpO1xuICAgICAgICBfdGhpcy5jb3JyZWN0aW9uUmF0aW9Mb2NhdGlvbiA9IGNvcnJlY3Rpb25SYXRpb0xvY2F0aW9uO1xuICAgICAgICB2YXIgc3FydFpvb21SYXRpb0xvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKF90aGlzLnByb2dyYW0sIFwidV9zcXJ0Wm9vbVJhdGlvXCIpO1xuICAgICAgICBpZiAoc3FydFpvb21SYXRpb0xvY2F0aW9uID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRWRnZVByb2dyYW06IGVycm9yIHdoaWxlIGdldHRpbmcgc3FydFpvb21SYXRpb0xvY2F0aW9uXCIpO1xuICAgICAgICBfdGhpcy5zcXJ0Wm9vbVJhdGlvTG9jYXRpb24gPSBzcXJ0Wm9vbVJhdGlvTG9jYXRpb247XG4gICAgICAgIC8vIEVuYWJsaW5nIHRoZSBPRVNfZWxlbWVudF9pbmRleF91aW50IGV4dGVuc2lvblxuICAgICAgICAvLyBOT1RFOiBvbiBvbGRlciBHUFVzLCB0aGlzIG1lYW5zIHRoYXQgcmVhbGx5IGxhcmdlIGdyYXBocyB3b24ndFxuICAgICAgICAvLyBoYXZlIGFsbCB0aGVpciBlZGdlcyByZW5kZXJlZC4gQnV0IGl0IHNlZW1zIHRoYXQgdGhlXG4gICAgICAgIC8vIGBPRVNfZWxlbWVudF9pbmRleF91aW50YCBpcyBxdWl0ZSBldmVyeXdoZXJlIHNvIHdlJ2xsIGhhbmRsZVxuICAgICAgICAvLyB0aGUgcG90ZW50aWFsIGlzc3VlIGlmIGl0IHJlYWxseSBhcmlzZXMuXG4gICAgICAgIC8vIE5PVEU6IHdoZW4gdXNpbmcgd2ViZ2wyLCB0aGUgZXh0ZW5zaW9uIGlzIGVuYWJsZWQgYnkgZGVmYXVsdFxuICAgICAgICBfdGhpcy5jYW5Vc2UzMkJpdHNJbmRpY2VzID0gKDAsIHV0aWxzXzEuY2FuVXNlMzJCaXRzSW5kaWNlcykoZ2wpO1xuICAgICAgICBfdGhpcy5JbmRpY2VzQXJyYXkgPSBfdGhpcy5jYW5Vc2UzMkJpdHNJbmRpY2VzID8gVWludDMyQXJyYXkgOiBVaW50MTZBcnJheTtcbiAgICAgICAgX3RoaXMuaW5kaWNlc0FycmF5ID0gbmV3IF90aGlzLkluZGljZXNBcnJheSgpO1xuICAgICAgICBfdGhpcy5pbmRpY2VzVHlwZSA9IF90aGlzLmNhblVzZTMyQml0c0luZGljZXMgPyBnbC5VTlNJR05FRF9JTlQgOiBnbC5VTlNJR05FRF9TSE9SVDtcbiAgICAgICAgX3RoaXMuYmluZCgpO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIEVkZ2VQcm9ncmFtLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmluZGljZXNCdWZmZXIpO1xuICAgICAgICAvLyBCaW5kaW5nc1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnBvc2l0aW9uTG9jYXRpb24pO1xuICAgICAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLm5vcm1hbExvY2F0aW9uKTtcbiAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5jb2xvckxvY2F0aW9uKTtcbiAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnBvc2l0aW9uTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgQVRUUklCVVRFUyAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCwgMCk7XG4gICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5ub3JtYWxMb2NhdGlvbiwgMiwgZ2wuRkxPQVQsIGZhbHNlLCBBVFRSSUJVVEVTICogRmxvYXQzMkFycmF5LkJZVEVTX1BFUl9FTEVNRU5ULCA4KTtcbiAgICAgICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLmNvbG9yTG9jYXRpb24sIDQsIGdsLlVOU0lHTkVEX0JZVEUsIHRydWUsIEFUVFJJQlVURVMgKiBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQsIDE2KTtcbiAgICB9O1xuICAgIEVkZ2VQcm9ncmFtLnByb3RvdHlwZS5jb21wdXRlSW5kaWNlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwgPSB0aGlzLmFycmF5Lmxlbmd0aCAvIEFUVFJJQlVURVM7XG4gICAgICAgIHZhciBzaXplID0gbCArIGwgLyAyO1xuICAgICAgICB2YXIgaW5kaWNlcyA9IG5ldyB0aGlzLkluZGljZXNBcnJheShzaXplKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGMgPSAwOyBpIDwgbDsgaSArPSA0KSB7XG4gICAgICAgICAgICBpbmRpY2VzW2MrK10gPSBpO1xuICAgICAgICAgICAgaW5kaWNlc1tjKytdID0gaSArIDE7XG4gICAgICAgICAgICBpbmRpY2VzW2MrK10gPSBpICsgMjtcbiAgICAgICAgICAgIGluZGljZXNbYysrXSA9IGkgKyAyO1xuICAgICAgICAgICAgaW5kaWNlc1tjKytdID0gaSArIDE7XG4gICAgICAgICAgICBpbmRpY2VzW2MrK10gPSBpICsgMztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmluZGljZXNBcnJheSA9IGluZGljZXM7XG4gICAgfTtcbiAgICBFZGdlUHJvZ3JhbS5wcm90b3R5cGUuYnVmZmVyRGF0YSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5idWZmZXJEYXRhLmNhbGwodGhpcyk7XG4gICAgICAgIC8vIEluZGljZXMgZGF0YVxuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICBnbC5idWZmZXJEYXRhKGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCB0aGlzLmluZGljZXNBcnJheSwgZ2wuU1RBVElDX0RSQVcpO1xuICAgIH07XG4gICAgRWRnZVByb2dyYW0ucHJvdG90eXBlLnByb2Nlc3MgPSBmdW5jdGlvbiAoc291cmNlRGF0YSwgdGFyZ2V0RGF0YSwgZGF0YSwgaGlkZGVuLCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKGhpZGRlbikge1xuICAgICAgICAgICAgZm9yICh2YXIgaV8xID0gb2Zmc2V0ICogU1RSSURFLCBsID0gaV8xICsgU1RSSURFOyBpXzEgPCBsOyBpXzErKylcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2lfMV0gPSAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0aGlja25lc3MgPSBkYXRhLnNpemUgfHwgMSwgeDEgPSBzb3VyY2VEYXRhLngsIHkxID0gc291cmNlRGF0YS55LCB4MiA9IHRhcmdldERhdGEueCwgeTIgPSB0YXJnZXREYXRhLnksIGNvbG9yID0gKDAsIHV0aWxzXzEuZmxvYXRDb2xvcikoZGF0YS5jb2xvcik7XG4gICAgICAgIC8vIENvbXB1dGluZyBub3JtYWxzXG4gICAgICAgIHZhciBkeCA9IHgyIC0geDEsIGR5ID0geTIgLSB5MTtcbiAgICAgICAgdmFyIGxlbiA9IGR4ICogZHggKyBkeSAqIGR5LCBuMSA9IDAsIG4yID0gMDtcbiAgICAgICAgaWYgKGxlbikge1xuICAgICAgICAgICAgbGVuID0gMSAvIE1hdGguc3FydChsZW4pO1xuICAgICAgICAgICAgbjEgPSAtZHkgKiBsZW4gKiB0aGlja25lc3M7XG4gICAgICAgICAgICBuMiA9IGR4ICogbGVuICogdGhpY2tuZXNzO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpID0gUE9JTlRTICogQVRUUklCVVRFUyAqIG9mZnNldDtcbiAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5hcnJheTtcbiAgICAgICAgLy8gRmlyc3QgcG9pbnRcbiAgICAgICAgYXJyYXlbaSsrXSA9IHgxO1xuICAgICAgICBhcnJheVtpKytdID0geTE7XG4gICAgICAgIGFycmF5W2krK10gPSBuMTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IG4yO1xuICAgICAgICBhcnJheVtpKytdID0gY29sb3I7XG4gICAgICAgIC8vIEZpcnN0IHBvaW50IGZsaXBwZWRcbiAgICAgICAgYXJyYXlbaSsrXSA9IHgxO1xuICAgICAgICBhcnJheVtpKytdID0geTE7XG4gICAgICAgIGFycmF5W2krK10gPSAtbjE7XG4gICAgICAgIGFycmF5W2krK10gPSAtbjI7XG4gICAgICAgIGFycmF5W2krK10gPSBjb2xvcjtcbiAgICAgICAgLy8gU2Vjb25kIHBvaW50XG4gICAgICAgIGFycmF5W2krK10gPSB4MjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IHkyO1xuICAgICAgICBhcnJheVtpKytdID0gbjE7XG4gICAgICAgIGFycmF5W2krK10gPSBuMjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IGNvbG9yO1xuICAgICAgICAvLyBTZWNvbmQgcG9pbnQgZmxpcHBlZFxuICAgICAgICBhcnJheVtpKytdID0geDI7XG4gICAgICAgIGFycmF5W2krK10gPSB5MjtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMTtcbiAgICAgICAgYXJyYXlbaSsrXSA9IC1uMjtcbiAgICAgICAgYXJyYXlbaV0gPSBjb2xvcjtcbiAgICB9O1xuICAgIEVkZ2VQcm9ncmFtLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc05vdGhpbmdUb1JlbmRlcigpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICB2YXIgcHJvZ3JhbSA9IHRoaXMucHJvZ3JhbTtcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdih0aGlzLm1hdHJpeExvY2F0aW9uLCBmYWxzZSwgcGFyYW1zLm1hdHJpeCk7XG4gICAgICAgIGdsLnVuaWZvcm0xZih0aGlzLnNxcnRab29tUmF0aW9Mb2NhdGlvbiwgTWF0aC5zcXJ0KHBhcmFtcy5yYXRpbykpO1xuICAgICAgICBnbC51bmlmb3JtMWYodGhpcy5jb3JyZWN0aW9uUmF0aW9Mb2NhdGlvbiwgcGFyYW1zLmNvcnJlY3Rpb25SYXRpbyk7XG4gICAgICAgIC8vIERyYXdpbmc6XG4gICAgICAgIGdsLmRyYXdFbGVtZW50cyhnbC5UUklBTkdMRVMsIHRoaXMuaW5kaWNlc0FycmF5Lmxlbmd0aCwgdGhpcy5pbmRpY2VzVHlwZSwgMCk7XG4gICAgfTtcbiAgICByZXR1cm4gRWRnZVByb2dyYW07XG59KGVkZ2VfMS5BYnN0cmFjdEVkZ2VQcm9ncmFtKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBFZGdlUHJvZ3JhbTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB1dGlsc18xID0gcmVxdWlyZShcIi4uLy4uLy4uL3V0aWxzXCIpO1xudmFyIG5vZGVfZmFzdF92ZXJ0X2dsc2xfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi4vc2hhZGVycy9ub2RlLmZhc3QudmVydC5nbHNsLmpzXCIpKTtcbnZhciBub2RlX2Zhc3RfZnJhZ19nbHNsXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4uL3NoYWRlcnMvbm9kZS5mYXN0LmZyYWcuZ2xzbC5qc1wiKSk7XG52YXIgbm9kZV8xID0gcmVxdWlyZShcIi4vY29tbW9uL25vZGVcIik7XG52YXIgUE9JTlRTID0gMSwgQVRUUklCVVRFUyA9IDQ7XG52YXIgTm9kZUZhc3RQcm9ncmFtID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhOb2RlRmFzdFByb2dyYW0sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTm9kZUZhc3RQcm9ncmFtKGdsKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIGdsLCBub2RlX2Zhc3RfdmVydF9nbHNsXzEuZGVmYXVsdCwgbm9kZV9mYXN0X2ZyYWdfZ2xzbF8xLmRlZmF1bHQsIFBPSU5UUywgQVRUUklCVVRFUykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuYmluZCgpO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE5vZGVGYXN0UHJvZ3JhbS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChkYXRhLCBoaWRkZW4sIG9mZnNldCkge1xuICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmFycmF5O1xuICAgICAgICB2YXIgaSA9IG9mZnNldCAqIFBPSU5UUyAqIEFUVFJJQlVURVM7XG4gICAgICAgIGlmIChoaWRkZW4pIHtcbiAgICAgICAgICAgIGFycmF5W2krK10gPSAwO1xuICAgICAgICAgICAgYXJyYXlbaSsrXSA9IDA7XG4gICAgICAgICAgICBhcnJheVtpKytdID0gMDtcbiAgICAgICAgICAgIGFycmF5W2krK10gPSAwO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBjb2xvciA9ICgwLCB1dGlsc18xLmZsb2F0Q29sb3IpKGRhdGEuY29sb3IpO1xuICAgICAgICBhcnJheVtpKytdID0gZGF0YS54O1xuICAgICAgICBhcnJheVtpKytdID0gZGF0YS55O1xuICAgICAgICBhcnJheVtpKytdID0gZGF0YS5zaXplO1xuICAgICAgICBhcnJheVtpXSA9IGNvbG9yO1xuICAgIH07XG4gICAgTm9kZUZhc3RQcm9ncmFtLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiAocGFyYW1zKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc05vdGhpbmdUb1JlbmRlcigpKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB2YXIgZ2wgPSB0aGlzLmdsO1xuICAgICAgICB2YXIgcHJvZ3JhbSA9IHRoaXMucHJvZ3JhbTtcbiAgICAgICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgZ2wudW5pZm9ybTFmKHRoaXMucmF0aW9Mb2NhdGlvbiwgMSAvIE1hdGguc3FydChwYXJhbXMucmF0aW8pKTtcbiAgICAgICAgZ2wudW5pZm9ybTFmKHRoaXMuc2NhbGVMb2NhdGlvbiwgcGFyYW1zLnNjYWxpbmdSYXRpbyk7XG4gICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYodGhpcy5tYXRyaXhMb2NhdGlvbiwgZmFsc2UsIHBhcmFtcy5tYXRyaXgpO1xuICAgICAgICBnbC5kcmF3QXJyYXlzKGdsLlBPSU5UUywgMCwgdGhpcy5hcnJheS5sZW5ndGggLyBBVFRSSUJVVEVTKTtcbiAgICB9O1xuICAgIHJldHVybiBOb2RlRmFzdFByb2dyYW07XG59KG5vZGVfMS5BYnN0cmFjdE5vZGVQcm9ncmFtKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBOb2RlRmFzdFByb2dyYW07XG4iLCIoKCk9PntcInVzZSBzdHJpY3RcIjt2YXIgZT17ZDoobyxyKT0+e2Zvcih2YXIgdCBpbiByKWUubyhyLHQpJiYhZS5vKG8sdCkmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLHQse2VudW1lcmFibGU6ITAsZ2V0OnJbdF19KX0sbzooZSxvKT0+T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGUsbykscjplPT57XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLnRvU3RyaW5nVGFnJiZPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOlwiTW9kdWxlXCJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX19LG89e307ZS5yKG8pLGUuZChvLHtkZWZhdWx0OigpPT5yfSk7Y29uc3Qgcj1cInByZWNpc2lvbiBtZWRpdW1wIGZsb2F0O1xcblxcbnZhcnlpbmcgdmVjNCB2X2NvbG9yO1xcblxcbnZvaWQgbWFpbih2b2lkKSB7XFxuICBnbF9GcmFnQ29sb3IgPSB2X2NvbG9yO1xcbn1cXG5cIjttb2R1bGUuZXhwb3J0cz1vfSkoKTsiLCIoKCk9PntcInVzZSBzdHJpY3RcIjt2YXIgYT17ZDooZSx0KT0+e2Zvcih2YXIgbyBpbiB0KWEubyh0LG8pJiYhYS5vKGUsbykmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLG8se2VudW1lcmFibGU6ITAsZ2V0OnRbb119KX0sbzooYSxlKT0+T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGEsZSkscjphPT57XCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmU3ltYm9sLnRvU3RyaW5nVGFnJiZPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxTeW1ib2wudG9TdHJpbmdUYWcse3ZhbHVlOlwiTW9kdWxlXCJ9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoYSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KX19LGU9e307YS5yKGUpLGEuZChlLHtkZWZhdWx0OigpPT50fSk7Y29uc3QgdD1cImF0dHJpYnV0ZSB2ZWMyIGFfcG9zaXRpb247XFxuYXR0cmlidXRlIHZlYzIgYV9ub3JtYWw7XFxuYXR0cmlidXRlIGZsb2F0IGFfcmFkaXVzO1xcbmF0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuYXR0cmlidXRlIHZlYzMgYV9iYXJ5Y2VudHJpYztcXG5cXG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XFxudW5pZm9ybSBmbG9hdCB1X3NxcnRab29tUmF0aW87XFxudW5pZm9ybSBmbG9hdCB1X2NvcnJlY3Rpb25SYXRpbztcXG5cXG52YXJ5aW5nIHZlYzQgdl9jb2xvcjtcXG5cXG5jb25zdCBmbG9hdCBtaW5UaGlja25lc3MgPSAxLjc7XFxuY29uc3QgZmxvYXQgYmlhcyA9IDI1NS4wIC8gMjU0LjA7XFxuY29uc3QgZmxvYXQgYXJyb3dIZWFkV2lkdGhMZW5ndGhSYXRpbyA9IDAuNjY7XFxuY29uc3QgZmxvYXQgYXJyb3dIZWFkTGVuZ3RoVGhpY2tuZXNzUmF0aW8gPSAyLjU7XFxuXFxudm9pZCBtYWluKCkge1xcbiAgZmxvYXQgbm9ybWFsTGVuZ3RoID0gbGVuZ3RoKGFfbm9ybWFsKTtcXG4gIHZlYzIgdW5pdE5vcm1hbCA9IGFfbm9ybWFsIC8gbm9ybWFsTGVuZ3RoO1xcblxcbiAgLy8gVGhlc2UgZmlyc3QgY29tcHV0YXRpb25zIGFyZSB0YWtlbiBmcm9tIGVkZ2UudmVydC5nbHNsIGFuZFxcbiAgLy8gZWRnZS5jbGFtcGVkLnZlcnQuZ2xzbC4gUGxlYXNlIHJlYWQgaXQgdG8gZ2V0IGJldHRlciBjb21tZW50cyBvbiB3aGF0J3NcXG4gIC8vIGhhcHBlbmluZzpcXG4gIGZsb2F0IHBpeGVsc1RoaWNrbmVzcyA9IG1heChub3JtYWxMZW5ndGgsIG1pblRoaWNrbmVzcyAqIHVfc3FydFpvb21SYXRpbyk7XFxuICBmbG9hdCB3ZWJHTFRoaWNrbmVzcyA9IHBpeGVsc1RoaWNrbmVzcyAqIHVfY29ycmVjdGlvblJhdGlvO1xcbiAgZmxvYXQgYWRhcHRlZFdlYkdMVGhpY2tuZXNzID0gd2ViR0xUaGlja25lc3MgKiB1X3NxcnRab29tUmF0aW87XFxuICBmbG9hdCBhZGFwdGVkV2ViR0xOb2RlUmFkaXVzID0gYV9yYWRpdXMgKiAyLjAgKiB1X2NvcnJlY3Rpb25SYXRpbyAqIHVfc3FydFpvb21SYXRpbztcXG4gIGZsb2F0IGFkYXB0ZWRXZWJHTEFycm93SGVhZExlbmd0aCA9IGFkYXB0ZWRXZWJHTFRoaWNrbmVzcyAqIDIuMCAqIGFycm93SGVhZExlbmd0aFRoaWNrbmVzc1JhdGlvO1xcbiAgZmxvYXQgYWRhcHRlZFdlYkdMQXJyb3dIZWFkSGFsZldpZHRoID0gYWRhcHRlZFdlYkdMQXJyb3dIZWFkTGVuZ3RoICogYXJyb3dIZWFkV2lkdGhMZW5ndGhSYXRpbyAvIDIuMDtcXG5cXG4gIGZsb2F0IGRhID0gYV9iYXJ5Y2VudHJpYy54O1xcbiAgZmxvYXQgZGIgPSBhX2JhcnljZW50cmljLnk7XFxuICBmbG9hdCBkYyA9IGFfYmFyeWNlbnRyaWMuejtcXG5cXG4gIHZlYzIgZGVsdGEgPSB2ZWMyKFxcbiAgICAgIGRhICogKGFkYXB0ZWRXZWJHTE5vZGVSYWRpdXMgKiB1bml0Tm9ybWFsLnkpXFxuICAgICsgZGIgKiAoKGFkYXB0ZWRXZWJHTE5vZGVSYWRpdXMgKyBhZGFwdGVkV2ViR0xBcnJvd0hlYWRMZW5ndGgpICogdW5pdE5vcm1hbC55ICsgYWRhcHRlZFdlYkdMQXJyb3dIZWFkSGFsZldpZHRoICogdW5pdE5vcm1hbC54KVxcbiAgICArIGRjICogKChhZGFwdGVkV2ViR0xOb2RlUmFkaXVzICsgYWRhcHRlZFdlYkdMQXJyb3dIZWFkTGVuZ3RoKSAqIHVuaXROb3JtYWwueSAtIGFkYXB0ZWRXZWJHTEFycm93SGVhZEhhbGZXaWR0aCAqIHVuaXROb3JtYWwueCksXFxuXFxuICAgICAgZGEgKiAoLWFkYXB0ZWRXZWJHTE5vZGVSYWRpdXMgKiB1bml0Tm9ybWFsLngpXFxuICAgICsgZGIgKiAoLShhZGFwdGVkV2ViR0xOb2RlUmFkaXVzICsgYWRhcHRlZFdlYkdMQXJyb3dIZWFkTGVuZ3RoKSAqIHVuaXROb3JtYWwueCArIGFkYXB0ZWRXZWJHTEFycm93SGVhZEhhbGZXaWR0aCAqIHVuaXROb3JtYWwueSlcXG4gICAgKyBkYyAqICgtKGFkYXB0ZWRXZWJHTE5vZGVSYWRpdXMgKyBhZGFwdGVkV2ViR0xBcnJvd0hlYWRMZW5ndGgpICogdW5pdE5vcm1hbC54IC0gYWRhcHRlZFdlYkdMQXJyb3dIZWFkSGFsZldpZHRoICogdW5pdE5vcm1hbC55KVxcbiAgKTtcXG5cXG4gIHZlYzIgcG9zaXRpb24gPSAodV9tYXRyaXggKiB2ZWMzKGFfcG9zaXRpb24gKyBkZWx0YSwgMSkpLnh5O1xcblxcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KHBvc2l0aW9uLCAwLCAxKTtcXG5cXG4gIC8vIEV4dHJhY3QgdGhlIGNvbG9yOlxcbiAgdl9jb2xvciA9IGFfY29sb3I7XFxuICB2X2NvbG9yLmEgKj0gYmlhcztcXG59XFxuXCI7bW9kdWxlLmV4cG9ydHM9ZX0pKCk7IiwiKCgpPT57XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9e2Q6KG8sbik9Pntmb3IodmFyIHQgaW4gbillLm8obix0KSYmIWUubyhvLHQpJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobyx0LHtlbnVtZXJhYmxlOiEwLGdldDpuW3RdfSl9LG86KGUsbyk9Pk9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLG8pLHI6ZT0+e1widW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC50b1N0cmluZ1RhZyYmT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsU3ltYm9sLnRvU3RyaW5nVGFnLHt2YWx1ZTpcIk1vZHVsZVwifSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9fSxvPXt9O2UucihvKSxlLmQobyx7ZGVmYXVsdDooKT0+bn0pO2NvbnN0IG49XCJhdHRyaWJ1dGUgdmVjNCBhX2NvbG9yO1xcbmF0dHJpYnV0ZSB2ZWMyIGFfbm9ybWFsO1xcbmF0dHJpYnV0ZSB2ZWMyIGFfcG9zaXRpb247XFxuYXR0cmlidXRlIGZsb2F0IGFfcmFkaXVzO1xcblxcbnVuaWZvcm0gbWF0MyB1X21hdHJpeDtcXG51bmlmb3JtIGZsb2F0IHVfc3FydFpvb21SYXRpbztcXG51bmlmb3JtIGZsb2F0IHVfY29ycmVjdGlvblJhdGlvO1xcblxcbnZhcnlpbmcgdmVjNCB2X2NvbG9yO1xcbnZhcnlpbmcgdmVjMiB2X25vcm1hbDtcXG52YXJ5aW5nIGZsb2F0IHZfdGhpY2tuZXNzO1xcblxcbmNvbnN0IGZsb2F0IG1pblRoaWNrbmVzcyA9IDEuNztcXG5jb25zdCBmbG9hdCBiaWFzID0gMjU1LjAgLyAyNTQuMDtcXG5jb25zdCBmbG9hdCBhcnJvd0hlYWRMZW5ndGhUaGlja25lc3NSYXRpbyA9IDIuNTtcXG5cXG52b2lkIG1haW4oKSB7XFxuICBmbG9hdCBub3JtYWxMZW5ndGggPSBsZW5ndGgoYV9ub3JtYWwpO1xcbiAgdmVjMiB1bml0Tm9ybWFsID0gYV9ub3JtYWwgLyBub3JtYWxMZW5ndGg7XFxuXFxuICAvLyBUaGVzZSBmaXJzdCBjb21wdXRhdGlvbnMgYXJlIHRha2VuIGZyb20gZWRnZS52ZXJ0Lmdsc2wuIFBsZWFzZSByZWFkIGl0IHRvXFxuICAvLyBnZXQgYmV0dGVyIGNvbW1lbnRzIG9uIHdoYXQncyBoYXBwZW5pbmc6XFxuICBmbG9hdCBwaXhlbHNUaGlja25lc3MgPSBtYXgobm9ybWFsTGVuZ3RoLCBtaW5UaGlja25lc3MgKiB1X3NxcnRab29tUmF0aW8pO1xcbiAgZmxvYXQgd2ViR0xUaGlja25lc3MgPSBwaXhlbHNUaGlja25lc3MgKiB1X2NvcnJlY3Rpb25SYXRpbztcXG4gIGZsb2F0IGFkYXB0ZWRXZWJHTFRoaWNrbmVzcyA9IHdlYkdMVGhpY2tuZXNzICogdV9zcXJ0Wm9vbVJhdGlvO1xcblxcbiAgLy8gSGVyZSwgd2UgbW92ZSB0aGUgcG9pbnQgdG8gbGVhdmUgc3BhY2UgZm9yIHRoZSBhcnJvdyBoZWFkOlxcbiAgZmxvYXQgZGlyZWN0aW9uID0gc2lnbihhX3JhZGl1cyk7XFxuICBmbG9hdCBhZGFwdGVkV2ViR0xOb2RlUmFkaXVzID0gZGlyZWN0aW9uICogYV9yYWRpdXMgKiAyLjAgKiB1X2NvcnJlY3Rpb25SYXRpbyAqIHVfc3FydFpvb21SYXRpbztcXG4gIGZsb2F0IGFkYXB0ZWRXZWJHTEFycm93SGVhZExlbmd0aCA9IGFkYXB0ZWRXZWJHTFRoaWNrbmVzcyAqIDIuMCAqIGFycm93SGVhZExlbmd0aFRoaWNrbmVzc1JhdGlvO1xcblxcbiAgdmVjMiBjb21wZW5zYXRpb25WZWN0b3IgPSB2ZWMyKC1kaXJlY3Rpb24gKiB1bml0Tm9ybWFsLnksIGRpcmVjdGlvbiAqIHVuaXROb3JtYWwueCkgKiAoYWRhcHRlZFdlYkdMTm9kZVJhZGl1cyArIGFkYXB0ZWRXZWJHTEFycm93SGVhZExlbmd0aCk7XFxuXFxuICAvLyBIZXJlIGlzIHRoZSBwcm9wZXIgcG9zaXRpb24gb2YgdGhlIHZlcnRleFxcbiAgZ2xfUG9zaXRpb24gPSB2ZWM0KCh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiArIHVuaXROb3JtYWwgKiBhZGFwdGVkV2ViR0xUaGlja25lc3MgKyBjb21wZW5zYXRpb25WZWN0b3IsIDEpKS54eSwgMCwgMSk7XFxuXFxuICB2X3RoaWNrbmVzcyA9IHdlYkdMVGhpY2tuZXNzIC8gdV9zcXJ0Wm9vbVJhdGlvO1xcblxcbiAgdl9ub3JtYWwgPSB1bml0Tm9ybWFsO1xcbiAgdl9jb2xvciA9IGFfY29sb3I7XFxuICB2X2NvbG9yLmEgKj0gYmlhcztcXG59XFxuXCI7bW9kdWxlLmV4cG9ydHM9b30pKCk7IiwiKCgpPT57XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9e2Q6KG4sdCk9Pntmb3IodmFyIG8gaW4gdCllLm8odCxvKSYmIWUubyhuLG8pJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobixvLHtlbnVtZXJhYmxlOiEwLGdldDp0W29dfSl9LG86KGUsbik9Pk9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLG4pLHI6ZT0+e1widW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC50b1N0cmluZ1RhZyYmT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsU3ltYm9sLnRvU3RyaW5nVGFnLHt2YWx1ZTpcIk1vZHVsZVwifSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9fSxuPXt9O2UucihuKSxlLmQobix7ZGVmYXVsdDooKT0+dH0pO2NvbnN0IHQ9XCJwcmVjaXNpb24gbWVkaXVtcCBmbG9hdDtcXG5cXG52YXJ5aW5nIHZlYzQgdl9jb2xvcjtcXG52YXJ5aW5nIHZlYzIgdl9ub3JtYWw7XFxudmFyeWluZyBmbG9hdCB2X3RoaWNrbmVzcztcXG5cXG5jb25zdCBmbG9hdCBmZWF0aGVyID0gMC4wMDE7XFxuY29uc3QgdmVjNCB0cmFuc3BhcmVudCA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMC4wKTtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgZmxvYXQgZGlzdCA9IGxlbmd0aCh2X25vcm1hbCkgKiB2X3RoaWNrbmVzcztcXG5cXG4gIGZsb2F0IHQgPSBzbW9vdGhzdGVwKFxcbiAgICB2X3RoaWNrbmVzcyAtIGZlYXRoZXIsXFxuICAgIHZfdGhpY2tuZXNzLFxcbiAgICBkaXN0XFxuICApO1xcblxcbiAgZ2xfRnJhZ0NvbG9yID0gbWl4KHZfY29sb3IsIHRyYW5zcGFyZW50LCB0KTtcXG59XFxuXCI7bW9kdWxlLmV4cG9ydHM9bn0pKCk7IiwiKCgpPT57XCJ1c2Ugc3RyaWN0XCI7dmFyIGU9e2Q6KG4sbyk9Pntmb3IodmFyIHQgaW4gbyllLm8obyx0KSYmIWUubyhuLHQpJiZPYmplY3QuZGVmaW5lUHJvcGVydHkobix0LHtlbnVtZXJhYmxlOiEwLGdldDpvW3RdfSl9LG86KGUsbik9Pk9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChlLG4pLHI6ZT0+e1widW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC50b1N0cmluZ1RhZyYmT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsU3ltYm9sLnRvU3RyaW5nVGFnLHt2YWx1ZTpcIk1vZHVsZVwifSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSl9fSxuPXt9O2UucihuKSxlLmQobix7ZGVmYXVsdDooKT0+b30pO2NvbnN0IG89J2F0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuYXR0cmlidXRlIHZlYzIgYV9ub3JtYWw7XFxuYXR0cmlidXRlIHZlYzIgYV9wb3NpdGlvbjtcXG5cXG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XFxudW5pZm9ybSBmbG9hdCB1X3NxcnRab29tUmF0aW87XFxudW5pZm9ybSBmbG9hdCB1X2NvcnJlY3Rpb25SYXRpbztcXG5cXG52YXJ5aW5nIHZlYzQgdl9jb2xvcjtcXG52YXJ5aW5nIHZlYzIgdl9ub3JtYWw7XFxudmFyeWluZyBmbG9hdCB2X3RoaWNrbmVzcztcXG5cXG5jb25zdCBmbG9hdCBtaW5UaGlja25lc3MgPSAxLjc7XFxuY29uc3QgZmxvYXQgYmlhcyA9IDI1NS4wIC8gMjU0LjA7XFxuXFxudm9pZCBtYWluKCkge1xcbiAgZmxvYXQgbm9ybWFsTGVuZ3RoID0gbGVuZ3RoKGFfbm9ybWFsKTtcXG4gIHZlYzIgdW5pdE5vcm1hbCA9IGFfbm9ybWFsIC8gbm9ybWFsTGVuZ3RoO1xcblxcbiAgLy8gV2UgcmVxdWlyZSBlZGdlcyB0byBiZSBhdCBsZWFzdCBgbWluVGhpY2tuZXNzYCBwaXhlbHMgdGhpY2sgKm9uIHNjcmVlbipcXG4gIC8vIChzbyB3ZSBuZWVkIHRvIGNvbXBlbnNhdGUgdGhlIFNRUlQgem9vbSByYXRpbyk6XFxuICBmbG9hdCBwaXhlbHNUaGlja25lc3MgPSBtYXgobm9ybWFsTGVuZ3RoLCBtaW5UaGlja25lc3MgKiB1X3NxcnRab29tUmF0aW8pO1xcblxcbiAgLy8gVGhlbiwgd2UgbmVlZCB0byByZXRyaWV2ZSB0aGUgbm9ybWFsaXplZCB0aGlja25lc3Mgb2YgdGhlIGVkZ2UgaW4gdGhlIFdlYkdMXFxuICAvLyByZWZlcmVudGlhbCAoaW4gYSAoWzAsIDFdLCBbMCwgMV0pIHNwYWNlKSwgdXNpbmcgb3VyIFwibWFnaWNcIiBjb3JyZWN0aW9uXFxuICAvLyByYXRpbzpcXG4gIGZsb2F0IHdlYkdMVGhpY2tuZXNzID0gcGl4ZWxzVGhpY2tuZXNzICogdV9jb3JyZWN0aW9uUmF0aW87XFxuXFxuICAvLyBGaW5hbGx5LCB3ZSBhZGFwdCB0aGUgZWRnZSB0aGlja25lc3MgdG8gdGhlIFwiU1FSVCBydWxlXCIgaW4gc2lnbWEgKHNvIHRoYXRcXG4gIC8vIGl0ZW1zIGFyZSBub3QgdG9vIGJpZyB3aGVuIHpvb21lZCBpbiwgYW5kIG5vdCB0b28gc21hbGwgd2hlbiB6b29tZWQgb3V0KS5cXG4gIC8vIFRoZSBleGFjdCBjb21wdXRhdGlvbiBzaG91bGQgYmUgYGFkYXB0ZWQgPSB2YWx1ZSAqIHpvb20gLyBzcXJ0KHpvb20pYCwgYnV0XFxuICAvLyBpdFxcJ3Mgc2ltcGxlciBsaWtlIHRoaXM6XFxuICBmbG9hdCBhZGFwdGVkV2ViR0xUaGlja25lc3MgPSB3ZWJHTFRoaWNrbmVzcyAqIHVfc3FydFpvb21SYXRpbztcXG5cXG4gIC8vIEhlcmUgaXMgdGhlIHByb3BlciBwb3NpdGlvbiBvZiB0aGUgdmVydGV4XFxuICBnbF9Qb3NpdGlvbiA9IHZlYzQoKHVfbWF0cml4ICogdmVjMyhhX3Bvc2l0aW9uICsgdW5pdE5vcm1hbCAqIGFkYXB0ZWRXZWJHTFRoaWNrbmVzcywgMSkpLnh5LCAwLCAxKTtcXG5cXG4gIC8vIEZvciB0aGUgZnJhZ21lbnQgc2hhZGVyIHRob3VnaCwgd2UgbmVlZCBhIHRoaWNrbmVzcyB0aGF0IHRha2VzIHRoZSBcIm1hZ2ljXCJcXG4gIC8vIGNvcnJlY3Rpb24gcmF0aW8gaW50byBhY2NvdW50IChhcyBpbiB3ZWJHTFRoaWNrbmVzcyksIGJ1dCBzbyB0aGF0IHRoZVxcbiAgLy8gYW50aWFsaWFzaW50IGVmZmVjdCBkb2VzIG5vdCBkZXBlbmQgb24gdGhlIHpvb20gbGV2ZWwuIFNvIGhlcmVcXCdzIHlldFxcbiAgLy8gYW5vdGhlciB0aGlja25lc3MgdmVyc2lvbjpcXG4gIHZfdGhpY2tuZXNzID0gd2ViR0xUaGlja25lc3MgLyB1X3NxcnRab29tUmF0aW87XFxuXFxuICB2X25vcm1hbCA9IHVuaXROb3JtYWw7XFxuICB2X2NvbG9yID0gYV9jb2xvcjtcXG4gIHZfY29sb3IuYSAqPSBiaWFzO1xcbn1cXG4nO21vZHVsZS5leHBvcnRzPW59KSgpOyIsIigoKT0+e1widXNlIHN0cmljdFwiO3ZhciBlPXtkOihuLG8pPT57Zm9yKHZhciB0IGluIG8pZS5vKG8sdCkmJiFlLm8obix0KSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KG4sdCx7ZW51bWVyYWJsZTohMCxnZXQ6b1t0XX0pfSxvOihlLG4pPT5PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSxuKSxyOmU9PntcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6XCJNb2R1bGVcIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfX0sbj17fTtlLnIobiksZS5kKG4se2RlZmF1bHQ6KCk9Pm99KTtjb25zdCBvPVwicHJlY2lzaW9uIG1lZGl1bXAgZmxvYXQ7XFxuXFxudmFyeWluZyB2ZWM0IHZfY29sb3I7XFxudmFyeWluZyBmbG9hdCB2X2JvcmRlcjtcXG5cXG5jb25zdCBmbG9hdCByYWRpdXMgPSAwLjU7XFxuY29uc3QgdmVjNCB0cmFuc3BhcmVudCA9IHZlYzQoMC4wLCAwLjAsIDAuMCwgMC4wKTtcXG5cXG52b2lkIG1haW4odm9pZCkge1xcbiAgdmVjMiBtID0gZ2xfUG9pbnRDb29yZCAtIHZlYzIoMC41LCAwLjUpO1xcbiAgZmxvYXQgZGlzdCA9IHJhZGl1cyAtIGxlbmd0aChtKTtcXG5cXG4gIGZsb2F0IHQgPSAwLjA7XFxuICBpZiAoZGlzdCA+IHZfYm9yZGVyKVxcbiAgICB0ID0gMS4wO1xcbiAgZWxzZSBpZiAoZGlzdCA+IDAuMClcXG4gICAgdCA9IGRpc3QgLyB2X2JvcmRlcjtcXG5cXG4gIGdsX0ZyYWdDb2xvciA9IG1peCh0cmFuc3BhcmVudCwgdl9jb2xvciwgdCk7XFxufVxcblwiO21vZHVsZS5leHBvcnRzPW59KSgpOyIsIigoKT0+e1widXNlIHN0cmljdFwiO3ZhciBvPXtkOih0LGUpPT57Zm9yKHZhciBuIGluIGUpby5vKGUsbikmJiFvLm8odCxuKSYmT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsbix7ZW51bWVyYWJsZTohMCxnZXQ6ZVtuXX0pfSxvOihvLHQpPT5PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobyx0KSxyOm89PntcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiZTeW1ib2wudG9TdHJpbmdUYWcmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFN5bWJvbC50b1N0cmluZ1RhZyx7dmFsdWU6XCJNb2R1bGVcIn0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pfX0sdD17fTtvLnIodCksby5kKHQse2RlZmF1bHQ6KCk9PmV9KTtjb25zdCBlPVwiYXR0cmlidXRlIHZlYzIgYV9wb3NpdGlvbjtcXG5hdHRyaWJ1dGUgZmxvYXQgYV9zaXplO1xcbmF0dHJpYnV0ZSB2ZWM0IGFfY29sb3I7XFxuXFxudW5pZm9ybSBmbG9hdCB1X3JhdGlvO1xcbnVuaWZvcm0gZmxvYXQgdV9zY2FsZTtcXG51bmlmb3JtIG1hdDMgdV9tYXRyaXg7XFxuXFxudmFyeWluZyB2ZWM0IHZfY29sb3I7XFxudmFyeWluZyBmbG9hdCB2X2JvcmRlcjtcXG5cXG5jb25zdCBmbG9hdCBiaWFzID0gMjU1LjAgLyAyNTQuMDtcXG5cXG52b2lkIG1haW4oKSB7XFxuICBnbF9Qb3NpdGlvbiA9IHZlYzQoXFxuICAgICh1X21hdHJpeCAqIHZlYzMoYV9wb3NpdGlvbiwgMSkpLnh5LFxcbiAgICAwLFxcbiAgICAxXFxuICApO1xcblxcbiAgLy8gTXVsdGlwbHkgdGhlIHBvaW50IHNpemUgdHdpY2U6XFxuICAvLyAgLSB4IFNDQUxJTkdfUkFUSU8gdG8gY29ycmVjdCB0aGUgY2FudmFzIHNjYWxpbmdcXG4gIC8vICAtIHggMiB0byBjb3JyZWN0IHRoZSBmb3JtdWxhZVxcbiAgZ2xfUG9pbnRTaXplID0gYV9zaXplICogdV9yYXRpbyAqIHVfc2NhbGUgKiAyLjA7XFxuXFxuICB2X2JvcmRlciA9ICgxLjAgLyB1X3JhdGlvKSAqICgwLjUgLyBhX3NpemUpO1xcblxcbiAgLy8gRXh0cmFjdCB0aGUgY29sb3I6XFxuICB2X2NvbG9yID0gYV9jb2xvcjtcXG4gIHZfY29sb3IuYSAqPSBiaWFzO1xcbn1cXG5cIjttb2R1bGUuZXhwb3J0cz10fSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogU2lnbWEuanMgU2hhZGVyIFV0aWxzXG4gKiA9PT09PT09PT09PT09PT09PT09PT09XG4gKlxuICogQ29kZSB1c2VkIHRvIGxvYWQgc2lnbWEncyBzaGFkZXJzLlxuICogQG1vZHVsZVxuICovXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmxvYWRQcm9ncmFtID0gZXhwb3J0cy5sb2FkRnJhZ21lbnRTaGFkZXIgPSBleHBvcnRzLmxvYWRWZXJ0ZXhTaGFkZXIgPSB2b2lkIDA7XG4vKipcbiAqIEZ1bmN0aW9uIHVzZWQgdG8gbG9hZCBhIHNoYWRlci5cbiAqL1xuZnVuY3Rpb24gbG9hZFNoYWRlcih0eXBlLCBnbCwgc291cmNlKSB7XG4gICAgdmFyIGdsVHlwZSA9IHR5cGUgPT09IFwiVkVSVEVYXCIgPyBnbC5WRVJURVhfU0hBREVSIDogZ2wuRlJBR01FTlRfU0hBREVSO1xuICAgIC8vIENyZWF0aW5nIHRoZSBzaGFkZXJcbiAgICB2YXIgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsVHlwZSk7XG4gICAgaWYgKHNoYWRlciA9PT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJsb2FkU2hhZGVyOiBlcnJvciB3aGlsZSBjcmVhdGluZyB0aGUgc2hhZGVyXCIpO1xuICAgIH1cbiAgICAvLyBMb2FkaW5nIHNvdXJjZVxuICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG4gICAgLy8gQ29tcGlsaW5nIHRoZSBzaGFkZXJcbiAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG4gICAgLy8gUmV0cmlldmluZyBjb21waWxhdGlvbiBzdGF0dXNcbiAgICB2YXIgc3VjY2Vzc2Z1bGx5Q29tcGlsZWQgPSBnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyk7XG4gICAgLy8gVGhyb3dpbmcgaWYgc29tZXRoaW5nIHdlbnQgYXdyeVxuICAgIGlmICghc3VjY2Vzc2Z1bGx5Q29tcGlsZWQpIHtcbiAgICAgICAgdmFyIGluZm9Mb2cgPSBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcik7XG4gICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJsb2FkU2hhZGVyOiBlcnJvciB3aGlsZSBjb21waWxpbmcgdGhlIHNoYWRlcjpcXG5cIi5jb25jYXQoaW5mb0xvZywgXCJcXG5cIikuY29uY2F0KHNvdXJjZSkpO1xuICAgIH1cbiAgICByZXR1cm4gc2hhZGVyO1xufVxuZnVuY3Rpb24gbG9hZFZlcnRleFNoYWRlcihnbCwgc291cmNlKSB7XG4gICAgcmV0dXJuIGxvYWRTaGFkZXIoXCJWRVJURVhcIiwgZ2wsIHNvdXJjZSk7XG59XG5leHBvcnRzLmxvYWRWZXJ0ZXhTaGFkZXIgPSBsb2FkVmVydGV4U2hhZGVyO1xuZnVuY3Rpb24gbG9hZEZyYWdtZW50U2hhZGVyKGdsLCBzb3VyY2UpIHtcbiAgICByZXR1cm4gbG9hZFNoYWRlcihcIkZSQUdNRU5UXCIsIGdsLCBzb3VyY2UpO1xufVxuZXhwb3J0cy5sb2FkRnJhZ21lbnRTaGFkZXIgPSBsb2FkRnJhZ21lbnRTaGFkZXI7XG4vKipcbiAqIEZ1bmN0aW9uIHVzZWQgdG8gbG9hZCBhIHByb2dyYW0uXG4gKi9cbmZ1bmN0aW9uIGxvYWRQcm9ncmFtKGdsLCBzaGFkZXJzKSB7XG4gICAgdmFyIHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgaWYgKHByb2dyYW0gPT09IG51bGwpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibG9hZFByb2dyYW06IGVycm9yIHdoaWxlIGNyZWF0aW5nIHRoZSBwcm9ncmFtLlwiKTtcbiAgICB9XG4gICAgdmFyIGksIGw7XG4gICAgLy8gQXR0YWNoaW5nIHRoZSBzaGFkZXJzXG4gICAgZm9yIChpID0gMCwgbCA9IHNoYWRlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgc2hhZGVyc1tpXSk7XG4gICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG4gICAgLy8gQ2hlY2tpbmcgc3RhdHVzXG4gICAgdmFyIHN1Y2Nlc3NmdWxseUxpbmtlZCA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuICAgIGlmICghc3VjY2Vzc2Z1bGx5TGlua2VkKSB7XG4gICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImxvYWRQcm9ncmFtOiBlcnJvciB3aGlsZSBsaW5raW5nIHRoZSBwcm9ncmFtLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHByb2dyYW07XG59XG5leHBvcnRzLmxvYWRQcm9ncmFtID0gbG9hZFByb2dyYW07XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8qKlxuICogU2lnbWEuanMgU2V0dGluZ3NcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICpcbiAqIFRoZSBsaXN0IG9mIHNldHRpbmdzIGFuZCBzb21lIGhhbmR5IGZ1bmN0aW9ucy5cbiAqIEBtb2R1bGVcbiAqL1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5ERUZBVUxUX1NFVFRJTkdTID0gZXhwb3J0cy52YWxpZGF0ZVNldHRpbmdzID0gdm9pZCAwO1xudmFyIGxhYmVsXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVuZGVyaW5nL2NhbnZhcy9sYWJlbFwiKSk7XG52YXIgaG92ZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZW5kZXJpbmcvY2FudmFzL2hvdmVyXCIpKTtcbnZhciBlZGdlX2xhYmVsXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVuZGVyaW5nL2NhbnZhcy9lZGdlLWxhYmVsXCIpKTtcbnZhciBub2RlX2Zhc3RfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZW5kZXJpbmcvd2ViZ2wvcHJvZ3JhbXMvbm9kZS5mYXN0XCIpKTtcbnZhciBlZGdlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcmVuZGVyaW5nL3dlYmdsL3Byb2dyYW1zL2VkZ2VcIikpO1xudmFyIGVkZ2VfYXJyb3dfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9yZW5kZXJpbmcvd2ViZ2wvcHJvZ3JhbXMvZWRnZS5hcnJvd1wiKSk7XG5mdW5jdGlvbiB2YWxpZGF0ZVNldHRpbmdzKHNldHRpbmdzKSB7XG4gICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5sYWJlbERlbnNpdHkgIT09IFwibnVtYmVyXCIgfHwgc2V0dGluZ3MubGFiZWxEZW5zaXR5IDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXR0aW5nczogaW52YWxpZCBgbGFiZWxEZW5zaXR5YC4gRXhwZWN0aW5nIGEgcG9zaXRpdmUgbnVtYmVyLlwiKTtcbiAgICB9XG4gICAgdmFyIG1pbkNhbWVyYVJhdGlvID0gc2V0dGluZ3MubWluQ2FtZXJhUmF0aW8sIG1heENhbWVyYVJhdGlvID0gc2V0dGluZ3MubWF4Q2FtZXJhUmF0aW87XG4gICAgaWYgKHR5cGVvZiBtaW5DYW1lcmFSYXRpbyA9PT0gXCJudW1iZXJcIiAmJiB0eXBlb2YgbWF4Q2FtZXJhUmF0aW8gPT09IFwibnVtYmVyXCIgJiYgbWF4Q2FtZXJhUmF0aW8gPCBtaW5DYW1lcmFSYXRpbykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTZXR0aW5nczogaW52YWxpZCBjYW1lcmEgcmF0aW8gYm91bmRhcmllcy4gRXhwZWN0aW5nIGBtYXhDYW1lcmFSYXRpb2AgdG8gYmUgZ3JlYXRlciB0aGFuIGBtaW5DYW1lcmFSYXRpb2AuXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMudmFsaWRhdGVTZXR0aW5ncyA9IHZhbGlkYXRlU2V0dGluZ3M7XG5leHBvcnRzLkRFRkFVTFRfU0VUVElOR1MgPSB7XG4gICAgLy8gUGVyZm9ybWFuY2VcbiAgICBoaWRlRWRnZXNPbk1vdmU6IGZhbHNlLFxuICAgIGhpZGVMYWJlbHNPbk1vdmU6IGZhbHNlLFxuICAgIHJlbmRlckxhYmVsczogdHJ1ZSxcbiAgICByZW5kZXJFZGdlTGFiZWxzOiBmYWxzZSxcbiAgICBlbmFibGVFZGdlQ2xpY2tFdmVudHM6IGZhbHNlLFxuICAgIGVuYWJsZUVkZ2VXaGVlbEV2ZW50czogZmFsc2UsXG4gICAgZW5hYmxlRWRnZUhvdmVyRXZlbnRzOiBmYWxzZSxcbiAgICAvLyBDb21wb25lbnQgcmVuZGVyaW5nXG4gICAgZGVmYXVsdE5vZGVDb2xvcjogXCIjOTk5XCIsXG4gICAgZGVmYXVsdE5vZGVUeXBlOiBcImNpcmNsZVwiLFxuICAgIGRlZmF1bHRFZGdlQ29sb3I6IFwiI2NjY1wiLFxuICAgIGRlZmF1bHRFZGdlVHlwZTogXCJsaW5lXCIsXG4gICAgbGFiZWxGb250OiBcIkFyaWFsXCIsXG4gICAgbGFiZWxTaXplOiAxNCxcbiAgICBsYWJlbFdlaWdodDogXCJub3JtYWxcIixcbiAgICBsYWJlbENvbG9yOiB7IGNvbG9yOiBcIiMwMDBcIiB9LFxuICAgIGVkZ2VMYWJlbEZvbnQ6IFwiQXJpYWxcIixcbiAgICBlZGdlTGFiZWxTaXplOiAxNCxcbiAgICBlZGdlTGFiZWxXZWlnaHQ6IFwibm9ybWFsXCIsXG4gICAgZWRnZUxhYmVsQ29sb3I6IHsgYXR0cmlidXRlOiBcImNvbG9yXCIgfSxcbiAgICBzdGFnZVBhZGRpbmc6IDMwLFxuICAgIC8vIExhYmVsc1xuICAgIGxhYmVsRGVuc2l0eTogMSxcbiAgICBsYWJlbEdyaWRDZWxsU2l6ZTogMTAwLFxuICAgIGxhYmVsUmVuZGVyZWRTaXplVGhyZXNob2xkOiA2LFxuICAgIC8vIFJlZHVjZXJzXG4gICAgbm9kZVJlZHVjZXI6IG51bGwsXG4gICAgZWRnZVJlZHVjZXI6IG51bGwsXG4gICAgLy8gRmVhdHVyZXNcbiAgICB6SW5kZXg6IGZhbHNlLFxuICAgIG1pbkNhbWVyYVJhdGlvOiBudWxsLFxuICAgIG1heENhbWVyYVJhdGlvOiBudWxsLFxuICAgIC8vIFJlbmRlcmVyc1xuICAgIGxhYmVsUmVuZGVyZXI6IGxhYmVsXzEuZGVmYXVsdCxcbiAgICBob3ZlclJlbmRlcmVyOiBob3Zlcl8xLmRlZmF1bHQsXG4gICAgZWRnZUxhYmVsUmVuZGVyZXI6IGVkZ2VfbGFiZWxfMS5kZWZhdWx0LFxuICAgIC8vIExpZmVjeWNsZVxuICAgIGFsbG93SW52YWxpZENvbnRhaW5lcjogZmFsc2UsXG4gICAgLy8gUHJvZ3JhbSBjbGFzc2VzXG4gICAgbm9kZVByb2dyYW1DbGFzc2VzOiB7XG4gICAgICAgIGNpcmNsZTogbm9kZV9mYXN0XzEuZGVmYXVsdCxcbiAgICB9LFxuICAgIGVkZ2VQcm9ncmFtQ2xhc3Nlczoge1xuICAgICAgICBhcnJvdzogZWRnZV9hcnJvd18xLmRlZmF1bHQsXG4gICAgICAgIGxpbmU6IGVkZ2VfMS5kZWZhdWx0LFxuICAgIH0sXG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX3ZhbHVlcyA9ICh0aGlzICYmIHRoaXMuX192YWx1ZXMpIHx8IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBTeW1ib2wuaXRlcmF0b3IsIG0gPSBzICYmIG9bc10sIGkgPSAwO1xuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xufTtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjYW1lcmFfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb3JlL2NhbWVyYVwiKSk7XG52YXIgbW91c2VfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9jb3JlL2NhcHRvcnMvbW91c2VcIikpO1xudmFyIHF1YWR0cmVlXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vY29yZS9xdWFkdHJlZVwiKSk7XG52YXIgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xudmFyIHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbnZhciBsYWJlbHNfMSA9IHJlcXVpcmUoXCIuL2NvcmUvbGFiZWxzXCIpO1xudmFyIHNldHRpbmdzXzEgPSByZXF1aXJlKFwiLi9zZXR0aW5nc1wiKTtcbnZhciB0b3VjaF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2NvcmUvY2FwdG9ycy90b3VjaFwiKSk7XG52YXIgbWF0cmljZXNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzL21hdHJpY2VzXCIpO1xudmFyIGVkZ2VfY29sbGlzaW9uc18xID0gcmVxdWlyZShcIi4vdXRpbHMvZWRnZS1jb2xsaXNpb25zXCIpO1xuLyoqXG4gKiBJbXBvcnRhbnQgZnVuY3Rpb25zLlxuICovXG5mdW5jdGlvbiBhcHBseU5vZGVEZWZhdWx0cyhzZXR0aW5ncywga2V5LCBkYXRhKSB7XG4gICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KFwieFwiKSB8fCAhZGF0YS5oYXNPd25Qcm9wZXJ0eShcInlcIikpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNpZ21hOiBjb3VsZCBub3QgZmluZCBhIHZhbGlkIHBvc2l0aW9uICh4LCB5KSBmb3Igbm9kZSBcXFwiXCIuY29uY2F0KGtleSwgXCJcXFwiLiBBbGwgeW91ciBub2RlcyBtdXN0IGhhdmUgYSBudW1iZXIgXFxcInhcXFwiIGFuZCBcXFwieVxcXCIuIE1heWJlIHlvdXIgZm9yZ290IHRvIGFwcGx5IGEgbGF5b3V0IG9yIHlvdXIgXFxcIm5vZGVSZWR1Y2VyXFxcIiBpcyBub3QgcmV0dXJuaW5nIHRoZSBjb3JyZWN0IGRhdGE/XCIpKTtcbiAgICBpZiAoIWRhdGEuY29sb3IpXG4gICAgICAgIGRhdGEuY29sb3IgPSBzZXR0aW5ncy5kZWZhdWx0Tm9kZUNvbG9yO1xuICAgIGlmICghZGF0YS5sYWJlbCAmJiBkYXRhLmxhYmVsICE9PSBcIlwiKVxuICAgICAgICBkYXRhLmxhYmVsID0gbnVsbDtcbiAgICBpZiAoZGF0YS5sYWJlbCAhPT0gdW5kZWZpbmVkICYmIGRhdGEubGFiZWwgIT09IG51bGwpXG4gICAgICAgIGRhdGEubGFiZWwgPSBcIlwiICsgZGF0YS5sYWJlbDtcbiAgICBlbHNlXG4gICAgICAgIGRhdGEubGFiZWwgPSBudWxsO1xuICAgIGlmICghZGF0YS5zaXplKVxuICAgICAgICBkYXRhLnNpemUgPSAyO1xuICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShcImhpZGRlblwiKSlcbiAgICAgICAgZGF0YS5oaWRkZW4gPSBmYWxzZTtcbiAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoXCJoaWdobGlnaHRlZFwiKSlcbiAgICAgICAgZGF0YS5oaWdobGlnaHRlZCA9IGZhbHNlO1xuICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShcImZvcmNlTGFiZWxcIikpXG4gICAgICAgIGRhdGEuZm9yY2VMYWJlbCA9IGZhbHNlO1xuICAgIGlmICghZGF0YS50eXBlIHx8IGRhdGEudHlwZSA9PT0gXCJcIilcbiAgICAgICAgZGF0YS50eXBlID0gc2V0dGluZ3MuZGVmYXVsdE5vZGVUeXBlO1xuICAgIGlmICghZGF0YS56SW5kZXgpXG4gICAgICAgIGRhdGEuekluZGV4ID0gMDtcbiAgICByZXR1cm4gZGF0YTtcbn1cbmZ1bmN0aW9uIGFwcGx5RWRnZURlZmF1bHRzKHNldHRpbmdzLCBrZXksIGRhdGEpIHtcbiAgICBpZiAoIWRhdGEuY29sb3IpXG4gICAgICAgIGRhdGEuY29sb3IgPSBzZXR0aW5ncy5kZWZhdWx0RWRnZUNvbG9yO1xuICAgIGlmICghZGF0YS5sYWJlbClcbiAgICAgICAgZGF0YS5sYWJlbCA9IFwiXCI7XG4gICAgaWYgKCFkYXRhLnNpemUpXG4gICAgICAgIGRhdGEuc2l6ZSA9IDAuNTtcbiAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoXCJoaWRkZW5cIikpXG4gICAgICAgIGRhdGEuaGlkZGVuID0gZmFsc2U7XG4gICAgaWYgKCFkYXRhLmhhc093blByb3BlcnR5KFwiZm9yY2VMYWJlbFwiKSlcbiAgICAgICAgZGF0YS5mb3JjZUxhYmVsID0gZmFsc2U7XG4gICAgaWYgKCFkYXRhLnR5cGUgfHwgZGF0YS50eXBlID09PSBcIlwiKVxuICAgICAgICBkYXRhLnR5cGUgPSBzZXR0aW5ncy5kZWZhdWx0RWRnZVR5cGU7XG4gICAgaWYgKCFkYXRhLnpJbmRleClcbiAgICAgICAgZGF0YS56SW5kZXggPSAwO1xuICAgIHJldHVybiBkYXRhO1xufVxuLyoqXG4gKiBNYWluIGNsYXNzLlxuICpcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtHcmFwaH0gICAgICAgZ3JhcGggICAgIC0gR3JhcGggdG8gcmVuZGVyLlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIC0gRE9NIGNvbnRhaW5lciBpbiB3aGljaCB0byByZW5kZXIuXG4gKiBAcGFyYW0ge29iamVjdH0gICAgICBzZXR0aW5ncyAgLSBPcHRpb25hbCBzZXR0aW5ncy5cbiAqL1xudmFyIFNpZ21hID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTaWdtYSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTaWdtYShncmFwaCwgY29udGFpbmVyLCBzZXR0aW5ncykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgPT09IHZvaWQgMCkgeyBzZXR0aW5ncyA9IHt9OyB9XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmVsZW1lbnRzID0ge307XG4gICAgICAgIF90aGlzLmNhbnZhc0NvbnRleHRzID0ge307XG4gICAgICAgIF90aGlzLndlYkdMQ29udGV4dHMgPSB7fTtcbiAgICAgICAgX3RoaXMuYWN0aXZlTGlzdGVuZXJzID0ge307XG4gICAgICAgIF90aGlzLnF1YWR0cmVlID0gbmV3IHF1YWR0cmVlXzEuZGVmYXVsdCgpO1xuICAgICAgICBfdGhpcy5sYWJlbEdyaWQgPSBuZXcgbGFiZWxzXzEuTGFiZWxHcmlkKCk7XG4gICAgICAgIF90aGlzLm5vZGVEYXRhQ2FjaGUgPSB7fTtcbiAgICAgICAgX3RoaXMuZWRnZURhdGFDYWNoZSA9IHt9O1xuICAgICAgICBfdGhpcy5ub2Rlc1dpdGhGb3JjZWRMYWJlbHMgPSBbXTtcbiAgICAgICAgX3RoaXMuZWRnZXNXaXRoRm9yY2VkTGFiZWxzID0gW107XG4gICAgICAgIF90aGlzLm5vZGVFeHRlbnQgPSB7IHg6IFswLCAxXSwgeTogWzAsIDFdIH07XG4gICAgICAgIF90aGlzLm1hdHJpeCA9ICgwLCBtYXRyaWNlc18xLmlkZW50aXR5KSgpO1xuICAgICAgICBfdGhpcy5pbnZNYXRyaXggPSAoMCwgbWF0cmljZXNfMS5pZGVudGl0eSkoKTtcbiAgICAgICAgX3RoaXMuY29ycmVjdGlvblJhdGlvID0gMTtcbiAgICAgICAgX3RoaXMuY3VzdG9tQkJveCA9IG51bGw7XG4gICAgICAgIF90aGlzLm5vcm1hbGl6YXRpb25GdW5jdGlvbiA9ICgwLCB1dGlsc18xLmNyZWF0ZU5vcm1hbGl6YXRpb25GdW5jdGlvbikoe1xuICAgICAgICAgICAgeDogWzAsIDFdLFxuICAgICAgICAgICAgeTogWzAsIDFdLFxuICAgICAgICB9KTtcbiAgICAgICAgLy8gQ2FjaGU6XG4gICAgICAgIF90aGlzLmNhbWVyYVNpemVSYXRpbyA9IDE7XG4gICAgICAgIC8vIFN0YXJ0aW5nIGRpbWVuc2lvbnMgYW5kIHBpeGVsIHJhdGlvXG4gICAgICAgIF90aGlzLndpZHRoID0gMDtcbiAgICAgICAgX3RoaXMuaGVpZ2h0ID0gMDtcbiAgICAgICAgX3RoaXMucGl4ZWxSYXRpbyA9ICgwLCB1dGlsc18xLmdldFBpeGVsUmF0aW8pKCk7XG4gICAgICAgIC8vIFN0YXRlXG4gICAgICAgIF90aGlzLmRpc3BsYXllZExhYmVscyA9IG5ldyBTZXQoKTtcbiAgICAgICAgX3RoaXMuaGlnaGxpZ2h0ZWROb2RlcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgX3RoaXMuaG92ZXJlZE5vZGUgPSBudWxsO1xuICAgICAgICBfdGhpcy5ob3ZlcmVkRWRnZSA9IG51bGw7XG4gICAgICAgIF90aGlzLnJlbmRlckZyYW1lID0gbnVsbDtcbiAgICAgICAgX3RoaXMucmVuZGVySGlnaGxpZ2h0ZWROb2Rlc0ZyYW1lID0gbnVsbDtcbiAgICAgICAgX3RoaXMubmVlZFRvUHJvY2VzcyA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5uZWVkVG9Tb2Z0UHJvY2VzcyA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5jaGVja0VkZ2VzRXZlbnRzRnJhbWUgPSBudWxsO1xuICAgICAgICAvLyBQcm9ncmFtc1xuICAgICAgICBfdGhpcy5ub2RlUHJvZ3JhbXMgPSB7fTtcbiAgICAgICAgX3RoaXMuaG92ZXJOb2RlUHJvZ3JhbXMgPSB7fTtcbiAgICAgICAgX3RoaXMuZWRnZVByb2dyYW1zID0ge307XG4gICAgICAgIF90aGlzLnNldHRpbmdzID0gKDAsIHV0aWxzXzEuYXNzaWduKSh7fSwgc2V0dGluZ3NfMS5ERUZBVUxUX1NFVFRJTkdTLCBzZXR0aW5ncyk7XG4gICAgICAgIC8vIFZhbGlkYXRpbmdcbiAgICAgICAgKDAsIHNldHRpbmdzXzEudmFsaWRhdGVTZXR0aW5ncykoX3RoaXMuc2V0dGluZ3MpO1xuICAgICAgICAoMCwgdXRpbHNfMS52YWxpZGF0ZUdyYXBoKShncmFwaCk7XG4gICAgICAgIGlmICghKGNvbnRhaW5lciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNpZ21hOiBjb250YWluZXIgc2hvdWxkIGJlIGFuIGh0bWwgZWxlbWVudC5cIik7XG4gICAgICAgIC8vIFByb3BlcnRpZXNcbiAgICAgICAgX3RoaXMuZ3JhcGggPSBncmFwaDtcbiAgICAgICAgX3RoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgICAgICAvLyBJbml0aWFsaXppbmcgY29udGV4dHNcbiAgICAgICAgX3RoaXMuY3JlYXRlV2ViR0xDb250ZXh0KFwiZWRnZXNcIiwgeyBwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWUgfSk7XG4gICAgICAgIF90aGlzLmNyZWF0ZUNhbnZhc0NvbnRleHQoXCJlZGdlTGFiZWxzXCIpO1xuICAgICAgICBfdGhpcy5jcmVhdGVXZWJHTENvbnRleHQoXCJub2Rlc1wiKTtcbiAgICAgICAgX3RoaXMuY3JlYXRlQ2FudmFzQ29udGV4dChcImxhYmVsc1wiKTtcbiAgICAgICAgX3RoaXMuY3JlYXRlQ2FudmFzQ29udGV4dChcImhvdmVyc1wiKTtcbiAgICAgICAgX3RoaXMuY3JlYXRlV2ViR0xDb250ZXh0KFwiaG92ZXJOb2Rlc1wiKTtcbiAgICAgICAgX3RoaXMuY3JlYXRlQ2FudmFzQ29udGV4dChcIm1vdXNlXCIpO1xuICAgICAgICAvLyBCbGVuZGluZ1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gX3RoaXMud2ViR0xDb250ZXh0cykge1xuICAgICAgICAgICAgdmFyIGdsID0gX3RoaXMud2ViR0xDb250ZXh0c1trZXldO1xuICAgICAgICAgICAgZ2wuYmxlbmRGdW5jKGdsLk9ORSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSk7XG4gICAgICAgICAgICBnbC5lbmFibGUoZ2wuQkxFTkQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIExvYWRpbmcgcHJvZ3JhbXNcbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiBfdGhpcy5zZXR0aW5ncy5ub2RlUHJvZ3JhbUNsYXNzZXMpIHtcbiAgICAgICAgICAgIHZhciBOb2RlUHJvZ3JhbUNsYXNzID0gX3RoaXMuc2V0dGluZ3Mubm9kZVByb2dyYW1DbGFzc2VzW3R5cGVdO1xuICAgICAgICAgICAgX3RoaXMubm9kZVByb2dyYW1zW3R5cGVdID0gbmV3IE5vZGVQcm9ncmFtQ2xhc3MoX3RoaXMud2ViR0xDb250ZXh0cy5ub2RlcywgX3RoaXMpO1xuICAgICAgICAgICAgX3RoaXMuaG92ZXJOb2RlUHJvZ3JhbXNbdHlwZV0gPSBuZXcgTm9kZVByb2dyYW1DbGFzcyhfdGhpcy53ZWJHTENvbnRleHRzLmhvdmVyTm9kZXMsIF90aGlzKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB0eXBlIGluIF90aGlzLnNldHRpbmdzLmVkZ2VQcm9ncmFtQ2xhc3Nlcykge1xuICAgICAgICAgICAgdmFyIEVkZ2VQcm9ncmFtQ2xhc3MgPSBfdGhpcy5zZXR0aW5ncy5lZGdlUHJvZ3JhbUNsYXNzZXNbdHlwZV07XG4gICAgICAgICAgICBfdGhpcy5lZGdlUHJvZ3JhbXNbdHlwZV0gPSBuZXcgRWRnZVByb2dyYW1DbGFzcyhfdGhpcy53ZWJHTENvbnRleHRzLmVkZ2VzLCBfdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSW5pdGlhbCByZXNpemVcbiAgICAgICAgX3RoaXMucmVzaXplKCk7XG4gICAgICAgIC8vIEluaXRpYWxpemluZyB0aGUgY2FtZXJhXG4gICAgICAgIF90aGlzLmNhbWVyYSA9IG5ldyBjYW1lcmFfMS5kZWZhdWx0KCk7XG4gICAgICAgIC8vIEJpbmRpbmcgY2FtZXJhIGV2ZW50c1xuICAgICAgICBfdGhpcy5iaW5kQ2FtZXJhSGFuZGxlcnMoKTtcbiAgICAgICAgLy8gSW5pdGlhbGl6aW5nIGNhcHRvcnNcbiAgICAgICAgX3RoaXMubW91c2VDYXB0b3IgPSBuZXcgbW91c2VfMS5kZWZhdWx0KF90aGlzLmVsZW1lbnRzLm1vdXNlLCBfdGhpcyk7XG4gICAgICAgIF90aGlzLnRvdWNoQ2FwdG9yID0gbmV3IHRvdWNoXzEuZGVmYXVsdChfdGhpcy5lbGVtZW50cy5tb3VzZSwgX3RoaXMpO1xuICAgICAgICAvLyBCaW5kaW5nIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgIF90aGlzLmJpbmRFdmVudEhhbmRsZXJzKCk7XG4gICAgICAgIC8vIEJpbmRpbmcgZ3JhcGggaGFuZGxlcnNcbiAgICAgICAgX3RoaXMuYmluZEdyYXBoSGFuZGxlcnMoKTtcbiAgICAgICAgLy8gVHJpZ2dlciBldmVudHVhbCBzZXR0aW5ncy1yZWxhdGVkIHRoaW5nc1xuICAgICAgICBfdGhpcy5oYW5kbGVTZXR0aW5nc1VwZGF0ZSgpO1xuICAgICAgICAvLyBQcm9jZXNzaW5nIGRhdGEgZm9yIHRoZSBmaXJzdCB0aW1lICYgcmVuZGVyXG4gICAgICAgIF90aGlzLnByb2Nlc3MoKTtcbiAgICAgICAgX3RoaXMucmVuZGVyKCk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgLyoqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogSW50ZXJuYWwgbWV0aG9kcy5cbiAgICAgKiotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBmdW5jdGlvbiB1c2VkIHRvIGNyZWF0ZSBhIGNhbnZhcyBlbGVtZW50LlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gaWQgLSBDb250ZXh0J3MgaWQuXG4gICAgICogQHJldHVybiB7U2lnbWF9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICB2YXIgY2FudmFzID0gKDAsIHV0aWxzXzEuY3JlYXRlRWxlbWVudCkoXCJjYW52YXNcIiwge1xuICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcbiAgICAgICAgfSwge1xuICAgICAgICAgICAgY2xhc3M6IFwic2lnbWEtXCIuY29uY2F0KGlkKSxcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZWxlbWVudHNbaWRdID0gY2FudmFzO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgICAgICByZXR1cm4gY2FudmFzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgZnVuY3Rpb24gdXNlZCB0byBjcmVhdGUgYSBjYW52YXMgY29udGV4dCBhbmQgYWRkIHRoZSByZWxldmFudFxuICAgICAqIERPTSBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gaWQgLSBDb250ZXh0J3MgaWQuXG4gICAgICogQHJldHVybiB7U2lnbWF9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmNyZWF0ZUNhbnZhc0NvbnRleHQgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgICAgdmFyIGNhbnZhcyA9IHRoaXMuY3JlYXRlQ2FudmFzKGlkKTtcbiAgICAgICAgdmFyIGNvbnRleHRPcHRpb25zID0ge1xuICAgICAgICAgICAgcHJlc2VydmVEcmF3aW5nQnVmZmVyOiBmYWxzZSxcbiAgICAgICAgICAgIGFudGlhbGlhczogZmFsc2UsXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuY2FudmFzQ29udGV4dHNbaWRdID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiLCBjb250ZXh0T3B0aW9ucyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgZnVuY3Rpb24gdXNlZCB0byBjcmVhdGUgYSBjYW52YXMgY29udGV4dCBhbmQgYWRkIHRoZSByZWxldmFudFxuICAgICAqIERPTSBlbGVtZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gIGlkICAgICAgLSBDb250ZXh0J3MgaWQuXG4gICAgICogQHBhcmFtICB7b2JqZWN0P30gb3B0aW9ucyAtICNnZXRDb250ZXh0IHBhcmFtcyB0byBvdmVycmlkZSAob3B0aW9uYWwpXG4gICAgICogQHJldHVybiB7U2lnbWF9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmNyZWF0ZVdlYkdMQ29udGV4dCA9IGZ1bmN0aW9uIChpZCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgY2FudmFzID0gdGhpcy5jcmVhdGVDYW52YXMoaWQpO1xuICAgICAgICB2YXIgY29udGV4dE9wdGlvbnMgPSBfX2Fzc2lnbih7IHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsIGFudGlhbGlhczogZmFsc2UgfSwgKG9wdGlvbnMgfHwge30pKTtcbiAgICAgICAgdmFyIGNvbnRleHQ7XG4gICAgICAgIC8vIEZpcnN0IHdlIHRyeSB3ZWJnbDIgZm9yIGFuIGVhc3kgcGVyZm9ybWFuY2UgYm9vc3RcbiAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2wyXCIsIGNvbnRleHRPcHRpb25zKTtcbiAgICAgICAgLy8gRWxzZSB3ZSBmYWxsIGJhY2sgdG8gd2ViZ2xcbiAgICAgICAgaWYgKCFjb250ZXh0KVxuICAgICAgICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwid2ViZ2xcIiwgY29udGV4dE9wdGlvbnMpO1xuICAgICAgICAvLyBFZGdlLCBJIGFtIGxvb2tpbmcgcmlnaHQgYXQgeW91Li4uXG4gICAgICAgIGlmICghY29udGV4dClcbiAgICAgICAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcImV4cGVyaW1lbnRhbC13ZWJnbFwiLCBjb250ZXh0T3B0aW9ucyk7XG4gICAgICAgIHRoaXMud2ViR0xDb250ZXh0c1tpZF0gPSBjb250ZXh0O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCBiaW5kaW5nIGNhbWVyYSBoYW5kbGVycy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NpZ21hfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5iaW5kQ2FtZXJhSGFuZGxlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmNhbWVyYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLl9zY2hlZHVsZVJlZnJlc2goKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jYW1lcmEub24oXCJ1cGRhdGVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmNhbWVyYSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHRoYXQgY2hlY2tzIHdoZXRoZXIgb3Igbm90IGEgbm9kZSBjb2xsaWRlcyB3aXRoIGEgZ2l2ZW4gcG9zaXRpb24uXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLm1vdXNlSXNPbk5vZGUgPSBmdW5jdGlvbiAoX2EsIF9iLCBzaXplKSB7XG4gICAgICAgIHZhciB4ID0gX2EueCwgeSA9IF9hLnk7XG4gICAgICAgIHZhciBub2RlWCA9IF9iLngsIG5vZGVZID0gX2IueTtcbiAgICAgICAgcmV0dXJuICh4ID4gbm9kZVggLSBzaXplICYmXG4gICAgICAgICAgICB4IDwgbm9kZVggKyBzaXplICYmXG4gICAgICAgICAgICB5ID4gbm9kZVkgLSBzaXplICYmXG4gICAgICAgICAgICB5IDwgbm9kZVkgKyBzaXplICYmXG4gICAgICAgICAgICBNYXRoLnNxcnQoTWF0aC5wb3coeCAtIG5vZGVYLCAyKSArIE1hdGgucG93KHkgLSBub2RlWSwgMikpIDwgc2l6ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdGhhdCByZXR1cm5zIGFsbCBub2RlcyBpbiBxdWFkIGF0IGEgZ2l2ZW4gcG9zaXRpb24uXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmdldFF1YWROb2RlcyA9IGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICB2YXIgbW91c2VHcmFwaFBvc2l0aW9uID0gdGhpcy52aWV3cG9ydFRvRnJhbWVkR3JhcGgocG9zaXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcy5xdWFkdHJlZS5wb2ludChtb3VzZUdyYXBoUG9zaXRpb24ueCwgMSAtIG1vdXNlR3JhcGhQb3NpdGlvbi55KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB0aGF0IHJldHVybnMgdGhlIGNsb3Nlc3Qgbm9kZSB0byBhIGdpdmVuIHBvc2l0aW9uLlxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5nZXROb2RlQXRQb3NpdGlvbiA9IGZ1bmN0aW9uIChwb3NpdGlvbikge1xuICAgICAgICB2YXIgeCA9IHBvc2l0aW9uLngsIHkgPSBwb3NpdGlvbi55O1xuICAgICAgICB2YXIgcXVhZE5vZGVzID0gdGhpcy5nZXRRdWFkTm9kZXMocG9zaXRpb24pO1xuICAgICAgICAvLyBXZSB3aWxsIGhvdmVyIHRoZSBub2RlIHdob3NlIGNlbnRlciBpcyBjbG9zZXN0IHRvIG1vdXNlXG4gICAgICAgIHZhciBtaW5EaXN0YW5jZSA9IEluZmluaXR5LCBub2RlQXRQb3NpdGlvbiA9IG51bGw7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gcXVhZE5vZGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBxdWFkTm9kZXNbaV07XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMubm9kZURhdGFDYWNoZVtub2RlXTtcbiAgICAgICAgICAgIHZhciBub2RlUG9zaXRpb24gPSB0aGlzLmZyYW1lZEdyYXBoVG9WaWV3cG9ydChkYXRhKTtcbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5zY2FsZVNpemUoZGF0YS5zaXplKTtcbiAgICAgICAgICAgIGlmICghZGF0YS5oaWRkZW4gJiYgdGhpcy5tb3VzZUlzT25Ob2RlKHBvc2l0aW9uLCBub2RlUG9zaXRpb24sIHNpemUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KHggLSBub2RlUG9zaXRpb24ueCwgMikgKyBNYXRoLnBvdyh5IC0gbm9kZVBvc2l0aW9uLnksIDIpKTtcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBzb3J0IGJ5IG1pbiBzaXplIGFsc28gZm9yIGNhc2VzIHdoZXJlIGNlbnRlciBpcyB0aGUgc2FtZVxuICAgICAgICAgICAgICAgIGlmIChkaXN0YW5jZSA8IG1pbkRpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIG1pbkRpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgICAgIG5vZGVBdFBvc2l0aW9uID0gbm9kZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVBdFBvc2l0aW9uO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIGJpbmRpbmcgZXZlbnQgaGFuZGxlcnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuYmluZEV2ZW50SGFuZGxlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIC8vIEhhbmRsaW5nIHdpbmRvdyByZXNpemVcbiAgICAgICAgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMubmVlZFRvU29mdFByb2Nlc3MgPSB0cnVlO1xuICAgICAgICAgICAgX3RoaXMuX3NjaGVkdWxlUmVmcmVzaCgpO1xuICAgICAgICB9O1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLmFjdGl2ZUxpc3RlbmVycy5oYW5kbGVSZXNpemUpO1xuICAgICAgICAvLyBIYW5kbGluZyBtb3VzZSBtb3ZlXG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmhhbmRsZU1vdmUgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgdmFyIGJhc2VFdmVudCA9IHtcbiAgICAgICAgICAgICAgICBldmVudDogZSxcbiAgICAgICAgICAgICAgICBwcmV2ZW50U2lnbWFEZWZhdWx0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudFNpZ21hRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIG5vZGVUb0hvdmVyID0gX3RoaXMuZ2V0Tm9kZUF0UG9zaXRpb24oZSk7XG4gICAgICAgICAgICBpZiAobm9kZVRvSG92ZXIgJiYgX3RoaXMuaG92ZXJlZE5vZGUgIT09IG5vZGVUb0hvdmVyICYmICFfdGhpcy5ub2RlRGF0YUNhY2hlW25vZGVUb0hvdmVyXS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICAvLyBIYW5kbGluZyBwYXNzaW5nIGZyb20gb25lIG5vZGUgdG8gdGhlIG90aGVyIGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmhvdmVyZWROb2RlKVxuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbWl0KFwibGVhdmVOb2RlXCIsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBiYXNlRXZlbnQpLCB7IG5vZGU6IF90aGlzLmhvdmVyZWROb2RlIH0pKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5ob3ZlcmVkTm9kZSA9IG5vZGVUb0hvdmVyO1xuICAgICAgICAgICAgICAgIF90aGlzLmVtaXQoXCJlbnRlck5vZGVcIiwgX19hc3NpZ24oX19hc3NpZ24oe30sIGJhc2VFdmVudCksIHsgbm9kZTogbm9kZVRvSG92ZXIgfSkpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNjaGVkdWxlSGlnaGxpZ2h0ZWROb2Rlc1JlbmRlcigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIENoZWNraW5nIGlmIHRoZSBob3ZlcmVkIG5vZGUgaXMgc3RpbGwgaG92ZXJlZFxuICAgICAgICAgICAgaWYgKF90aGlzLmhvdmVyZWROb2RlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBfdGhpcy5ub2RlRGF0YUNhY2hlW190aGlzLmhvdmVyZWROb2RlXTtcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gX3RoaXMuZnJhbWVkR3JhcGhUb1ZpZXdwb3J0KGRhdGEpO1xuICAgICAgICAgICAgICAgIHZhciBzaXplID0gX3RoaXMuc2NhbGVTaXplKGRhdGEuc2l6ZSk7XG4gICAgICAgICAgICAgICAgaWYgKCFfdGhpcy5tb3VzZUlzT25Ob2RlKGUsIHBvcywgc2l6ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5vZGUgPSBfdGhpcy5ob3ZlcmVkTm9kZTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaG92ZXJlZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5lbWl0KFwibGVhdmVOb2RlXCIsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBiYXNlRXZlbnQpLCB7IG5vZGU6IG5vZGUgfSkpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zY2hlZHVsZUhpZ2hsaWdodGVkTm9kZXNSZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChfdGhpcy5zZXR0aW5ncy5lbmFibGVFZGdlSG92ZXJFdmVudHMgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGVja0VkZ2VIb3ZlckV2ZW50cyhiYXNlRXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoX3RoaXMuc2V0dGluZ3MuZW5hYmxlRWRnZUhvdmVyRXZlbnRzID09PSBcImRlYm91bmNlXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLmNoZWNrRWRnZXNFdmVudHNGcmFtZSlcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2hlY2tFZGdlc0V2ZW50c0ZyYW1lID0gKDAsIHV0aWxzXzEucmVxdWVzdEZyYW1lKShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5jaGVja0VkZ2VIb3ZlckV2ZW50cyhiYXNlRXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2hlY2tFZGdlc0V2ZW50c0ZyYW1lID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIC8vIEhhbmRsaW5nIGNsaWNrXG4gICAgICAgIHZhciBjcmVhdGVNb3VzZUxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50VHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgdmFyIGJhc2VFdmVudCA9IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IGUsXG4gICAgICAgICAgICAgICAgICAgIHByZXZlbnRTaWdtYURlZmF1bHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudFNpZ21hRGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgdmFyIGlzRmFrZVNpZ21hTW91c2VFdmVudCA9IGUub3JpZ2luYWwuaXNGYWtlU2lnbWFNb3VzZUV2ZW50O1xuICAgICAgICAgICAgICAgIHZhciBub2RlQXRQb3NpdGlvbiA9IGlzRmFrZVNpZ21hTW91c2VFdmVudCA/IF90aGlzLmdldE5vZGVBdFBvc2l0aW9uKGUpIDogX3RoaXMuaG92ZXJlZE5vZGU7XG4gICAgICAgICAgICAgICAgaWYgKG5vZGVBdFBvc2l0aW9uKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZW1pdChcIlwiLmNvbmNhdChldmVudFR5cGUsIFwiTm9kZVwiKSwgX19hc3NpZ24oX19hc3NpZ24oe30sIGJhc2VFdmVudCksIHsgbm9kZTogbm9kZUF0UG9zaXRpb24gfSkpO1xuICAgICAgICAgICAgICAgIGlmIChldmVudFR5cGUgPT09IFwid2hlZWxcIiA/IF90aGlzLnNldHRpbmdzLmVuYWJsZUVkZ2VXaGVlbEV2ZW50cyA6IF90aGlzLnNldHRpbmdzLmVuYWJsZUVkZ2VDbGlja0V2ZW50cykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZWRnZSA9IF90aGlzLmdldEVkZ2VBdFBvaW50KGUueCwgZS55KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gX3RoaXMuZW1pdChcIlwiLmNvbmNhdChldmVudFR5cGUsIFwiRWRnZVwiKSwgX19hc3NpZ24oX19hc3NpZ24oe30sIGJhc2VFdmVudCksIHsgZWRnZTogZWRnZSB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBfdGhpcy5lbWl0KFwiXCIuY29uY2F0KGV2ZW50VHlwZSwgXCJTdGFnZVwiKSwgYmFzZUV2ZW50KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmhhbmRsZUNsaWNrID0gY3JlYXRlTW91c2VMaXN0ZW5lcihcImNsaWNrXCIpO1xuICAgICAgICB0aGlzLmFjdGl2ZUxpc3RlbmVycy5oYW5kbGVSaWdodENsaWNrID0gY3JlYXRlTW91c2VMaXN0ZW5lcihcInJpZ2h0Q2xpY2tcIik7XG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmhhbmRsZURvdWJsZUNsaWNrID0gY3JlYXRlTW91c2VMaXN0ZW5lcihcImRvdWJsZUNsaWNrXCIpO1xuICAgICAgICB0aGlzLmFjdGl2ZUxpc3RlbmVycy5oYW5kbGVXaGVlbCA9IGNyZWF0ZU1vdXNlTGlzdGVuZXIoXCJ3aGVlbFwiKTtcbiAgICAgICAgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuaGFuZGxlRG93biA9IGNyZWF0ZU1vdXNlTGlzdGVuZXIoXCJkb3duXCIpO1xuICAgICAgICB0aGlzLm1vdXNlQ2FwdG9yLm9uKFwibW91c2Vtb3ZlXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmhhbmRsZU1vdmUpO1xuICAgICAgICB0aGlzLm1vdXNlQ2FwdG9yLm9uKFwiY2xpY2tcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuaGFuZGxlQ2xpY2spO1xuICAgICAgICB0aGlzLm1vdXNlQ2FwdG9yLm9uKFwicmlnaHRDbGlja1wiLCB0aGlzLmFjdGl2ZUxpc3RlbmVycy5oYW5kbGVSaWdodENsaWNrKTtcbiAgICAgICAgdGhpcy5tb3VzZUNhcHRvci5vbihcImRvdWJsZUNsaWNrXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmhhbmRsZURvdWJsZUNsaWNrKTtcbiAgICAgICAgdGhpcy5tb3VzZUNhcHRvci5vbihcIndoZWVsXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmhhbmRsZVdoZWVsKTtcbiAgICAgICAgdGhpcy5tb3VzZUNhcHRvci5vbihcIm1vdXNlZG93blwiLCB0aGlzLmFjdGl2ZUxpc3RlbmVycy5oYW5kbGVEb3duKTtcbiAgICAgICAgLy8gVE9ET1xuICAgICAgICAvLyBEZWFsIHdpdGggVG91Y2ggY2FwdG9yIGV2ZW50c1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCBiaW5kaW5nIGdyYXBoIGhhbmRsZXJzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuYmluZEdyYXBoSGFuZGxlcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBncmFwaCA9IHRoaXMuZ3JhcGg7XG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmdyYXBoVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMubmVlZFRvUHJvY2VzcyA9IHRydWU7XG4gICAgICAgICAgICBfdGhpcy5fc2NoZWR1bGVSZWZyZXNoKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdGVuZXJzLnNvZnRHcmFwaFVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLm5lZWRUb1NvZnRQcm9jZXNzID0gdHJ1ZTtcbiAgICAgICAgICAgIF90aGlzLl9zY2hlZHVsZVJlZnJlc2goKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuZHJvcE5vZGVHcmFwaFVwZGF0ZSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICBkZWxldGUgX3RoaXMubm9kZURhdGFDYWNoZVtlLmtleV07XG4gICAgICAgICAgICBpZiAoX3RoaXMuaG92ZXJlZE5vZGUgPT09IGUua2V5KVxuICAgICAgICAgICAgICAgIF90aGlzLmhvdmVyZWROb2RlID0gbnVsbDtcbiAgICAgICAgICAgIF90aGlzLmFjdGl2ZUxpc3RlbmVycy5ncmFwaFVwZGF0ZSgpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFjdGl2ZUxpc3RlbmVycy5kcm9wRWRnZUdyYXBoVXBkYXRlID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBfdGhpcy5lZGdlRGF0YUNhY2hlW2Uua2V5XTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5ob3ZlcmVkRWRnZSA9PT0gZS5rZXkpXG4gICAgICAgICAgICAgICAgX3RoaXMuaG92ZXJlZEVkZ2UgPSBudWxsO1xuICAgICAgICAgICAgX3RoaXMuYWN0aXZlTGlzdGVuZXJzLmdyYXBoVXBkYXRlKCk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmNsZWFyRWRnZXNHcmFwaFVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLmVkZ2VEYXRhQ2FjaGUgPSB7fTtcbiAgICAgICAgICAgIF90aGlzLmhvdmVyZWRFZGdlID0gbnVsbDtcbiAgICAgICAgICAgIF90aGlzLmFjdGl2ZUxpc3RlbmVycy5ncmFwaFVwZGF0ZSgpO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLmFjdGl2ZUxpc3RlbmVycy5jbGVhckdyYXBoVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMubm9kZURhdGFDYWNoZSA9IHt9O1xuICAgICAgICAgICAgX3RoaXMuaG92ZXJlZE5vZGUgPSBudWxsO1xuICAgICAgICAgICAgX3RoaXMuYWN0aXZlTGlzdGVuZXJzLmNsZWFyRWRnZXNHcmFwaFVwZGF0ZSgpO1xuICAgICAgICB9O1xuICAgICAgICBncmFwaC5vbihcIm5vZGVBZGRlZFwiLCB0aGlzLmFjdGl2ZUxpc3RlbmVycy5ncmFwaFVwZGF0ZSk7XG4gICAgICAgIGdyYXBoLm9uKFwibm9kZURyb3BwZWRcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuZHJvcE5vZGVHcmFwaFVwZGF0ZSk7XG4gICAgICAgIGdyYXBoLm9uKFwibm9kZUF0dHJpYnV0ZXNVcGRhdGVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLnNvZnRHcmFwaFVwZGF0ZSk7XG4gICAgICAgIGdyYXBoLm9uKFwiZWFjaE5vZGVBdHRyaWJ1dGVzVXBkYXRlZFwiLCB0aGlzLmFjdGl2ZUxpc3RlbmVycy5ncmFwaFVwZGF0ZSk7XG4gICAgICAgIGdyYXBoLm9uKFwiZWRnZUFkZGVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmdyYXBoVXBkYXRlKTtcbiAgICAgICAgZ3JhcGgub24oXCJlZGdlRHJvcHBlZFwiLCB0aGlzLmFjdGl2ZUxpc3RlbmVycy5kcm9wRWRnZUdyYXBoVXBkYXRlKTtcbiAgICAgICAgZ3JhcGgub24oXCJlZGdlQXR0cmlidXRlc1VwZGF0ZWRcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuc29mdEdyYXBoVXBkYXRlKTtcbiAgICAgICAgZ3JhcGgub24oXCJlYWNoRWRnZUF0dHJpYnV0ZXNVcGRhdGVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmdyYXBoVXBkYXRlKTtcbiAgICAgICAgZ3JhcGgub24oXCJlZGdlc0NsZWFyZWRcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuY2xlYXJFZGdlc0dyYXBoVXBkYXRlKTtcbiAgICAgICAgZ3JhcGgub24oXCJjbGVhcmVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmNsZWFyR3JhcGhVcGRhdGUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCBkZWFsaW5nIHdpdGggXCJsZWF2ZUVkZ2VcIiBhbmQgXCJlbnRlckVkZ2VcIiBldmVudHMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuY2hlY2tFZGdlSG92ZXJFdmVudHMgPSBmdW5jdGlvbiAocGF5bG9hZCkge1xuICAgICAgICB2YXIgZWRnZVRvSG92ZXIgPSB0aGlzLmhvdmVyZWROb2RlID8gbnVsbCA6IHRoaXMuZ2V0RWRnZUF0UG9pbnQocGF5bG9hZC5ldmVudC54LCBwYXlsb2FkLmV2ZW50LnkpO1xuICAgICAgICBpZiAoZWRnZVRvSG92ZXIgIT09IHRoaXMuaG92ZXJlZEVkZ2UpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmhvdmVyZWRFZGdlKVxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChcImxlYXZlRWRnZVwiLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgcGF5bG9hZCksIHsgZWRnZTogdGhpcy5ob3ZlcmVkRWRnZSB9KSk7XG4gICAgICAgICAgICBpZiAoZWRnZVRvSG92ZXIpXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFwiZW50ZXJFZGdlXCIsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBwYXlsb2FkKSwgeyBlZGdlOiBlZGdlVG9Ib3ZlciB9KSk7XG4gICAgICAgICAgICB0aGlzLmhvdmVyZWRFZGdlID0gZWRnZVRvSG92ZXI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgbG9va2luZyBmb3IgYW4gZWRnZSBjb2xsaWRpbmcgd2l0aCBhIGdpdmVuIHBvaW50IGF0ICh4LCB5KS4gUmV0dXJuc1xuICAgICAqIHRoZSBrZXkgb2YgdGhlIGVkZ2UgaWYgYW55LCBvciBudWxsIGVsc2UuXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmdldEVkZ2VBdFBvaW50ID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgdmFyIGVfMSwgX2E7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBfYiA9IHRoaXMsIGVkZ2VEYXRhQ2FjaGUgPSBfYi5lZGdlRGF0YUNhY2hlLCBub2RlRGF0YUNhY2hlID0gX2Iubm9kZURhdGFDYWNoZTtcbiAgICAgICAgLy8gQ2hlY2sgZmlyc3QgdGhhdCBwaXhlbCBpcyBjb2xvcmVkOlxuICAgICAgICAvLyBOb3RlIHRoYXQgbW91c2UgcG9zaXRpb25zIG11c3QgYmUgY29ycmVjdGVkIGJ5IHBpeGVsIHJhdGlvIHRvIGNvcnJlY3RseVxuICAgICAgICAvLyBpbmRleCB0aGUgZHJhd2luZyBidWZmZXIuXG4gICAgICAgIGlmICghKDAsIGVkZ2VfY29sbGlzaW9uc18xLmlzUGl4ZWxDb2xvcmVkKSh0aGlzLndlYkdMQ29udGV4dHMuZWRnZXMsIHggKiB0aGlzLnBpeGVsUmF0aW8sIHkgKiB0aGlzLnBpeGVsUmF0aW8pKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIC8vIENoZWNrIGZvciBlYWNoIGVkZ2UgaWYgaXQgY29sbGlkZXMgd2l0aCB0aGUgcG9pbnQ6XG4gICAgICAgIHZhciBfYyA9IHRoaXMudmlld3BvcnRUb0dyYXBoKHsgeDogeCwgeTogeSB9KSwgZ3JhcGhYID0gX2MueCwgZ3JhcGhZID0gX2MueTtcbiAgICAgICAgLy8gVG8gdHJhbnNsYXRlIGVkZ2UgdGhpY2tuZXNzZXMgdG8gdGhlIGdyYXBoIHN5c3RlbSwgd2Ugb2JzZXJ2ZSBieSBob3cgbXVjaFxuICAgICAgICAvLyB0aGUgbGVuZ3RoIG9mIGEgbm9uLW51bGwgZWRnZSBpcyB0cmFuc2Zvcm1lZCB0byBiZXR3ZWVuIHRoZSBncmFwaCBzeXN0ZW1cbiAgICAgICAgLy8gYW5kIHRoZSB2aWV3cG9ydCBzeXN0ZW06XG4gICAgICAgIHZhciB0cmFuc2Zvcm1hdGlvblJhdGlvID0gMDtcbiAgICAgICAgdGhpcy5ncmFwaC5zb21lRWRnZShmdW5jdGlvbiAoa2V5LCBfLCBzb3VyY2VJZCwgdGFyZ2V0SWQsIF9hLCBfYikge1xuICAgICAgICAgICAgdmFyIHhzID0gX2EueCwgeXMgPSBfYS55O1xuICAgICAgICAgICAgdmFyIHh0ID0gX2IueCwgeXQgPSBfYi55O1xuICAgICAgICAgICAgaWYgKGVkZ2VEYXRhQ2FjaGVba2V5XS5oaWRkZW4gfHwgbm9kZURhdGFDYWNoZVtzb3VyY2VJZF0uaGlkZGVuIHx8IG5vZGVEYXRhQ2FjaGVbdGFyZ2V0SWRdLmhpZGRlbilcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoeHMgIT09IHh0IHx8IHlzICE9PSB5dCkge1xuICAgICAgICAgICAgICAgIHZhciBncmFwaExlbmd0aCA9IE1hdGguc3FydChNYXRoLnBvdyh4dCAtIHhzLCAyKSArIE1hdGgucG93KHl0IC0geXMsIDIpKTtcbiAgICAgICAgICAgICAgICB2YXIgX2MgPSBfdGhpcy5ncmFwaFRvVmlld3BvcnQoeyB4OiB4cywgeTogeXMgfSksIHZwX3hzID0gX2MueCwgdnBfeXMgPSBfYy55O1xuICAgICAgICAgICAgICAgIHZhciBfZCA9IF90aGlzLmdyYXBoVG9WaWV3cG9ydCh7IHg6IHh0LCB5OiB5dCB9KSwgdnBfeHQgPSBfZC54LCB2cF95dCA9IF9kLnk7XG4gICAgICAgICAgICAgICAgdmFyIHZpZXdwb3J0TGVuZ3RoID0gTWF0aC5zcXJ0KE1hdGgucG93KHZwX3h0IC0gdnBfeHMsIDIpICsgTWF0aC5wb3codnBfeXQgLSB2cF95cywgMikpO1xuICAgICAgICAgICAgICAgIHRyYW5zZm9ybWF0aW9uUmF0aW8gPSBncmFwaExlbmd0aCAvIHZpZXdwb3J0TGVuZ3RoO1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy8gSWYgbm8gbm9uLW51bGwgZWRnZSBoYXMgYmVlbiBmb3VuZCwgcmV0dXJuIG51bGw6XG4gICAgICAgIGlmICghdHJhbnNmb3JtYXRpb25SYXRpbylcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAvLyBOb3cgd2UgY2FuIGxvb2sgZm9yIG1hdGNoaW5nIGVkZ2VzOlxuICAgICAgICB2YXIgZWRnZXMgPSB0aGlzLmdyYXBoLmZpbHRlckVkZ2VzKGZ1bmN0aW9uIChrZXksIGVkZ2VBdHRyaWJ1dGVzLCBzb3VyY2VJZCwgdGFyZ2V0SWQsIHNvdXJjZVBvc2l0aW9uLCB0YXJnZXRQb3NpdGlvbikge1xuICAgICAgICAgICAgaWYgKGVkZ2VEYXRhQ2FjaGVba2V5XS5oaWRkZW4gfHwgbm9kZURhdGFDYWNoZVtzb3VyY2VJZF0uaGlkZGVuIHx8IG5vZGVEYXRhQ2FjaGVbdGFyZ2V0SWRdLmhpZGRlbilcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoKDAsIGVkZ2VfY29sbGlzaW9uc18xLmRvRWRnZUNvbGxpZGVXaXRoUG9pbnQpKGdyYXBoWCwgZ3JhcGhZLCBzb3VyY2VQb3NpdGlvbi54LCBzb3VyY2VQb3NpdGlvbi55LCB0YXJnZXRQb3NpdGlvbi54LCB0YXJnZXRQb3NpdGlvbi55LCBcbiAgICAgICAgICAgIC8vIEFkYXB0IHRoZSBlZGdlIHNpemUgdG8gdGhlIHpvb20gcmF0aW86XG4gICAgICAgICAgICAoZWRnZURhdGFDYWNoZVtrZXldLnNpemUgKiB0cmFuc2Zvcm1hdGlvblJhdGlvKSAvIF90aGlzLmNhbWVyYVNpemVSYXRpbykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChlZGdlcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gbnVsbDsgLy8gbm8gZWRnZXMgZm91bmRcbiAgICAgICAgLy8gaWYgbm9uZSBvZiB0aGUgZWRnZXMgaGF2ZSBhIHpJbmRleCwgc2VsZWN0ZWQgdGhlIG1vc3QgcmVjZW50bHkgY3JlYXRlZCBvbmUgdG8gbWF0Y2ggdGhlIHJlbmRlcmluZyBvcmRlclxuICAgICAgICB2YXIgc2VsZWN0ZWRFZGdlID0gZWRnZXNbZWRnZXMubGVuZ3RoIC0gMV07XG4gICAgICAgIC8vIG90aGVyd2lzZSBzZWxlY3QgZWRnZSB3aXRoIGhpZ2hlc3QgekluZGV4XG4gICAgICAgIHZhciBoaWdoZXN0WkluZGV4ID0gLUluZmluaXR5O1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZm9yICh2YXIgZWRnZXNfMSA9IF9fdmFsdWVzKGVkZ2VzKSwgZWRnZXNfMV8xID0gZWRnZXNfMS5uZXh0KCk7ICFlZGdlc18xXzEuZG9uZTsgZWRnZXNfMV8xID0gZWRnZXNfMS5uZXh0KCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZWRnZSA9IGVkZ2VzXzFfMS52YWx1ZTtcbiAgICAgICAgICAgICAgICB2YXIgekluZGV4ID0gdGhpcy5ncmFwaC5nZXRFZGdlQXR0cmlidXRlKGVkZ2UsIFwiekluZGV4XCIpO1xuICAgICAgICAgICAgICAgIGlmICh6SW5kZXggPj0gaGlnaGVzdFpJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEVkZ2UgPSBlZGdlO1xuICAgICAgICAgICAgICAgICAgICBoaWdoZXN0WkluZGV4ID0gekluZGV4O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZV8xXzEpIHsgZV8xID0geyBlcnJvcjogZV8xXzEgfTsgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKGVkZ2VzXzFfMSAmJiAhZWRnZXNfMV8xLmRvbmUgJiYgKF9hID0gZWRnZXNfMS5yZXR1cm4pKSBfYS5jYWxsKGVkZ2VzXzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmluYWxseSB7IGlmIChlXzEpIHRocm93IGVfMS5lcnJvcjsgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzZWxlY3RlZEVkZ2U7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byBwcm9jZXNzIHRoZSB3aG9sZSBncmFwaCdzIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUucHJvY2VzcyA9IGZ1bmN0aW9uIChrZWVwQXJyYXlzKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChrZWVwQXJyYXlzID09PSB2b2lkIDApIHsga2VlcEFycmF5cyA9IGZhbHNlOyB9XG4gICAgICAgIHZhciBncmFwaCA9IHRoaXMuZ3JhcGg7XG4gICAgICAgIHZhciBzZXR0aW5ncyA9IHRoaXMuc2V0dGluZ3M7XG4gICAgICAgIHZhciBkaW1lbnNpb25zID0gdGhpcy5nZXREaW1lbnNpb25zKCk7XG4gICAgICAgIHZhciBub2RlWkV4dGVudCA9IFtJbmZpbml0eSwgLUluZmluaXR5XTtcbiAgICAgICAgdmFyIGVkZ2VaRXh0ZW50ID0gW0luZmluaXR5LCAtSW5maW5pdHldO1xuICAgICAgICAvLyBDbGVhcmluZyB0aGUgcXVhZFxuICAgICAgICB0aGlzLnF1YWR0cmVlLmNsZWFyKCk7XG4gICAgICAgIC8vIFJlc2V0dGluZyB0aGUgbGFiZWwgZ3JpZFxuICAgICAgICAvLyBUT0RPOiBpdCdzIHByb2JhYmx5IGJldHRlciB0byBkbyB0aGlzIGV4cGxpY2l0bHkgb3Igb24gcmVzaXplcyBmb3IgbGF5b3V0IGFuZCBhbmltc1xuICAgICAgICB0aGlzLmxhYmVsR3JpZC5yZXNpemVBbmRDbGVhcihkaW1lbnNpb25zLCBzZXR0aW5ncy5sYWJlbEdyaWRDZWxsU2l6ZSk7XG4gICAgICAgIC8vIENsZWFyIHRoZSBoaWdobGlnaHRlZE5vZGVzXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWROb2RlcyA9IG5ldyBTZXQoKTtcbiAgICAgICAgLy8gQ29tcHV0aW5nIGV4dGVudHNcbiAgICAgICAgdGhpcy5ub2RlRXh0ZW50ID0gKDAsIHV0aWxzXzEuZ3JhcGhFeHRlbnQpKGdyYXBoKTtcbiAgICAgICAgLy8gUmVzZXR0aW5nIGBmb3JjZUxhYmVsYCBpbmRpY2VzXG4gICAgICAgIHRoaXMubm9kZXNXaXRoRm9yY2VkTGFiZWxzID0gW107XG4gICAgICAgIHRoaXMuZWRnZXNXaXRoRm9yY2VkTGFiZWxzID0gW107XG4gICAgICAgIC8vIE5PVEU6IGl0IGlzIGltcG9ydGFudCB0byBjb21wdXRlIHRoaXMgbWF0cml4IGFmdGVyIGNvbXB1dGluZyB0aGUgbm9kZSdzIGV4dGVudFxuICAgICAgICAvLyBiZWNhdXNlICMuZ2V0R3JhcGhEaW1lbnNpb25zIHJlbGllcyBvbiBpdFxuICAgICAgICB2YXIgbnVsbENhbWVyYSA9IG5ldyBjYW1lcmFfMS5kZWZhdWx0KCk7XG4gICAgICAgIHZhciBudWxsQ2FtZXJhTWF0cml4ID0gKDAsIHV0aWxzXzEubWF0cml4RnJvbUNhbWVyYSkobnVsbENhbWVyYS5nZXRTdGF0ZSgpLCB0aGlzLmdldERpbWVuc2lvbnMoKSwgdGhpcy5nZXRHcmFwaERpbWVuc2lvbnMoKSwgdGhpcy5nZXRTZXR0aW5nKFwic3RhZ2VQYWRkaW5nXCIpIHx8IDApO1xuICAgICAgICAvLyBSZXNjYWxpbmcgZnVuY3Rpb25cbiAgICAgICAgdGhpcy5ub3JtYWxpemF0aW9uRnVuY3Rpb24gPSAoMCwgdXRpbHNfMS5jcmVhdGVOb3JtYWxpemF0aW9uRnVuY3Rpb24pKHRoaXMuY3VzdG9tQkJveCB8fCB0aGlzLm5vZGVFeHRlbnQpO1xuICAgICAgICB2YXIgbm9kZXNQZXJQcm9ncmFtcyA9IHt9O1xuICAgICAgICB2YXIgbm9kZXMgPSBncmFwaC5ub2RlcygpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IG5vZGVzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgdmFyIG5vZGUgPSBub2Rlc1tpXTtcbiAgICAgICAgICAgIC8vIE5vZGUgZGlzcGxheSBkYXRhIHJlc29sdXRpb246XG4gICAgICAgICAgICAvLyAgIDEuIEZpcnN0IHdlIGdldCB0aGUgbm9kZSdzIGF0dHJpYnV0ZXNcbiAgICAgICAgICAgIC8vICAgMi4gV2Ugb3B0aW9uYWxseSByZWR1Y2UgdGhlbSB1c2luZyB0aGUgZnVuY3Rpb24gcHJvdmlkZWQgYnkgdGhlIHVzZXJcbiAgICAgICAgICAgIC8vICAgICAgTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gbXVzdCByZXR1cm4gYSB0b3RhbCBvYmplY3QgYW5kIHdvbid0IGJlIG1lcmdlZFxuICAgICAgICAgICAgLy8gICAzLiBXZSBhcHBseSBvdXIgZGVmYXVsdHMsIHdoaWxlIHJ1bm5pbmcgc29tZSB2aXRhbCBjaGVja3NcbiAgICAgICAgICAgIC8vICAgNC4gV2UgYXBwbHkgdGhlIG5vcm1hbGl6YXRpb24gZnVuY3Rpb25cbiAgICAgICAgICAgIC8vIFdlIHNoYWxsb3cgY29weSBub2RlIGRhdGEgdG8gYXZvaWQgZGFuZ2Vyb3VzIGJlaGF2aW9ycyBmcm9tIHJlZHVjZXJzXG4gICAgICAgICAgICB2YXIgYXR0ciA9IE9iamVjdC5hc3NpZ24oe30sIGdyYXBoLmdldE5vZGVBdHRyaWJ1dGVzKG5vZGUpKTtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5ub2RlUmVkdWNlcilcbiAgICAgICAgICAgICAgICBhdHRyID0gc2V0dGluZ3Mubm9kZVJlZHVjZXIobm9kZSwgYXR0cik7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IGFwcGx5Tm9kZURlZmF1bHRzKHRoaXMuc2V0dGluZ3MsIG5vZGUsIGF0dHIpO1xuICAgICAgICAgICAgbm9kZXNQZXJQcm9ncmFtc1tkYXRhLnR5cGVdID0gKG5vZGVzUGVyUHJvZ3JhbXNbZGF0YS50eXBlXSB8fCAwKSArIDE7XG4gICAgICAgICAgICB0aGlzLm5vZGVEYXRhQ2FjaGVbbm9kZV0gPSBkYXRhO1xuICAgICAgICAgICAgdGhpcy5ub3JtYWxpemF0aW9uRnVuY3Rpb24uYXBwbHlUbyhkYXRhKTtcbiAgICAgICAgICAgIGlmIChkYXRhLmZvcmNlTGFiZWwpXG4gICAgICAgICAgICAgICAgdGhpcy5ub2Rlc1dpdGhGb3JjZWRMYWJlbHMucHVzaChub2RlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnpJbmRleCkge1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnpJbmRleCA8IG5vZGVaRXh0ZW50WzBdKVxuICAgICAgICAgICAgICAgICAgICBub2RlWkV4dGVudFswXSA9IGRhdGEuekluZGV4O1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLnpJbmRleCA+IG5vZGVaRXh0ZW50WzFdKVxuICAgICAgICAgICAgICAgICAgICBub2RlWkV4dGVudFsxXSA9IGRhdGEuekluZGV4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5ub2RlUHJvZ3JhbXMpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5ub2RlUHJvZ3JhbXMuaGFzT3duUHJvcGVydHkodHlwZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaWdtYTogY291bGQgbm90IGZpbmQgYSBzdWl0YWJsZSBwcm9ncmFtIGZvciBub2RlIHR5cGUgXFxcIlwiLmNvbmNhdCh0eXBlLCBcIlxcXCIhXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgha2VlcEFycmF5cylcbiAgICAgICAgICAgICAgICB0aGlzLm5vZGVQcm9ncmFtc1t0eXBlXS5hbGxvY2F0ZShub2Rlc1BlclByb2dyYW1zW3R5cGVdIHx8IDApO1xuICAgICAgICAgICAgLy8gV2UgcmVzZXQgdGhhdCBjb3VudCBoZXJlLCBzbyB0aGF0IHdlIGNhbiByZXVzZSBpdCB3aGlsZSBjYWxsaW5nIHRoZSBQcm9ncmFtI3Byb2Nlc3MgbWV0aG9kczpcbiAgICAgICAgICAgIG5vZGVzUGVyUHJvZ3JhbXNbdHlwZV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIEhhbmRsaW5nIG5vZGUgei1pbmRleFxuICAgICAgICAvLyBUT0RPOiB6LWluZGV4IG5lZWRzIHVzIHRvIGNvbXB1dGUgZGlzcGxheSBkYXRhIGJlZm9yZSBoYW5kXG4gICAgICAgIGlmICh0aGlzLnNldHRpbmdzLnpJbmRleCAmJiBub2RlWkV4dGVudFswXSAhPT0gbm9kZVpFeHRlbnRbMV0pXG4gICAgICAgICAgICBub2RlcyA9ICgwLCB1dGlsc18xLnpJbmRleE9yZGVyaW5nKShub2RlWkV4dGVudCwgZnVuY3Rpb24gKG5vZGUpIHsgcmV0dXJuIF90aGlzLm5vZGVEYXRhQ2FjaGVbbm9kZV0uekluZGV4OyB9LCBub2Rlcyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbm9kZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9IG5vZGVzW2ldO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLm5vZGVEYXRhQ2FjaGVbbm9kZV07XG4gICAgICAgICAgICB0aGlzLnF1YWR0cmVlLmFkZChub2RlLCBkYXRhLngsIDEgLSBkYXRhLnksIGRhdGEuc2l6ZSAvIHRoaXMud2lkdGgpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmxhYmVsID09PSBcInN0cmluZ1wiICYmICFkYXRhLmhpZGRlbilcbiAgICAgICAgICAgICAgICB0aGlzLmxhYmVsR3JpZC5hZGQobm9kZSwgZGF0YS5zaXplLCB0aGlzLmZyYW1lZEdyYXBoVG9WaWV3cG9ydChkYXRhLCB7IG1hdHJpeDogbnVsbENhbWVyYU1hdHJpeCB9KSk7XG4gICAgICAgICAgICB2YXIgbm9kZVByb2dyYW0gPSB0aGlzLm5vZGVQcm9ncmFtc1tkYXRhLnR5cGVdO1xuICAgICAgICAgICAgaWYgKCFub2RlUHJvZ3JhbSlcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaWdtYTogY291bGQgbm90IGZpbmQgYSBzdWl0YWJsZSBwcm9ncmFtIGZvciBub2RlIHR5cGUgXFxcIlwiLmNvbmNhdChkYXRhLnR5cGUsIFwiXFxcIiFcIikpO1xuICAgICAgICAgICAgbm9kZVByb2dyYW0ucHJvY2VzcyhkYXRhLCBkYXRhLmhpZGRlbiwgbm9kZXNQZXJQcm9ncmFtc1tkYXRhLnR5cGVdKyspO1xuICAgICAgICAgICAgLy8gU2F2ZSB0aGUgbm9kZSBpbiB0aGUgaGlnaGxpZ2h0ZWQgc2V0IGlmIG5lZWRlZFxuICAgICAgICAgICAgaWYgKGRhdGEuaGlnaGxpZ2h0ZWQgJiYgIWRhdGEuaGlkZGVuKVxuICAgICAgICAgICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWROb2Rlcy5hZGQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sYWJlbEdyaWQub3JnYW5pemUoKTtcbiAgICAgICAgdmFyIGVkZ2VzUGVyUHJvZ3JhbXMgPSB7fTtcbiAgICAgICAgdmFyIGVkZ2VzID0gZ3JhcGguZWRnZXMoKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBlZGdlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgICAgICAgICAvLyBFZGdlIGRpc3BsYXkgZGF0YSByZXNvbHV0aW9uOlxuICAgICAgICAgICAgLy8gICAxLiBGaXJzdCB3ZSBnZXQgdGhlIGVkZ2UncyBhdHRyaWJ1dGVzXG4gICAgICAgICAgICAvLyAgIDIuIFdlIG9wdGlvbmFsbHkgcmVkdWNlIHRoZW0gdXNpbmcgdGhlIGZ1bmN0aW9uIHByb3ZpZGVkIGJ5IHRoZSB1c2VyXG4gICAgICAgICAgICAvLyAgICAgIE5vdGUgdGhhdCB0aGlzIGZ1bmN0aW9uIG11c3QgcmV0dXJuIGEgdG90YWwgb2JqZWN0IGFuZCB3b24ndCBiZSBtZXJnZWRcbiAgICAgICAgICAgIC8vICAgMy4gV2UgYXBwbHkgb3VyIGRlZmF1bHRzLCB3aGlsZSBydW5uaW5nIHNvbWUgdml0YWwgY2hlY2tzXG4gICAgICAgICAgICAvLyBXZSBzaGFsbG93IGNvcHkgZWRnZSBkYXRhIHRvIGF2b2lkIGRhbmdlcm91cyBiZWhhdmlvcnMgZnJvbSByZWR1Y2Vyc1xuICAgICAgICAgICAgdmFyIGF0dHIgPSBPYmplY3QuYXNzaWduKHt9LCBncmFwaC5nZXRFZGdlQXR0cmlidXRlcyhlZGdlKSk7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuZWRnZVJlZHVjZXIpXG4gICAgICAgICAgICAgICAgYXR0ciA9IHNldHRpbmdzLmVkZ2VSZWR1Y2VyKGVkZ2UsIGF0dHIpO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBhcHBseUVkZ2VEZWZhdWx0cyh0aGlzLnNldHRpbmdzLCBlZGdlLCBhdHRyKTtcbiAgICAgICAgICAgIGVkZ2VzUGVyUHJvZ3JhbXNbZGF0YS50eXBlXSA9IChlZGdlc1BlclByb2dyYW1zW2RhdGEudHlwZV0gfHwgMCkgKyAxO1xuICAgICAgICAgICAgdGhpcy5lZGdlRGF0YUNhY2hlW2VkZ2VdID0gZGF0YTtcbiAgICAgICAgICAgIGlmIChkYXRhLmZvcmNlTGFiZWwgJiYgIWRhdGEuaGlkZGVuKVxuICAgICAgICAgICAgICAgIHRoaXMuZWRnZXNXaXRoRm9yY2VkTGFiZWxzLnB1c2goZWRnZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy56SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS56SW5kZXggPCBlZGdlWkV4dGVudFswXSlcbiAgICAgICAgICAgICAgICAgICAgZWRnZVpFeHRlbnRbMF0gPSBkYXRhLnpJbmRleDtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS56SW5kZXggPiBlZGdlWkV4dGVudFsxXSlcbiAgICAgICAgICAgICAgICAgICAgZWRnZVpFeHRlbnRbMV0gPSBkYXRhLnpJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciB0eXBlIGluIHRoaXMuZWRnZVByb2dyYW1zKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZWRnZVByb2dyYW1zLmhhc093blByb3BlcnR5KHR5cGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2lnbWE6IGNvdWxkIG5vdCBmaW5kIGEgc3VpdGFibGUgcHJvZ3JhbSBmb3IgZWRnZSB0eXBlIFxcXCJcIi5jb25jYXQodHlwZSwgXCJcXFwiIVwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWtlZXBBcnJheXMpXG4gICAgICAgICAgICAgICAgdGhpcy5lZGdlUHJvZ3JhbXNbdHlwZV0uYWxsb2NhdGUoZWRnZXNQZXJQcm9ncmFtc1t0eXBlXSB8fCAwKTtcbiAgICAgICAgICAgIC8vIFdlIHJlc2V0IHRoYXQgY291bnQgaGVyZSwgc28gdGhhdCB3ZSBjYW4gcmV1c2UgaXQgd2hpbGUgY2FsbGluZyB0aGUgUHJvZ3JhbSNwcm9jZXNzIG1ldGhvZHM6XG4gICAgICAgICAgICBlZGdlc1BlclByb2dyYW1zW3R5cGVdID0gMDtcbiAgICAgICAgfVxuICAgICAgICAvLyBIYW5kbGluZyBlZGdlIHotaW5kZXhcbiAgICAgICAgaWYgKHRoaXMuc2V0dGluZ3MuekluZGV4ICYmIGVkZ2VaRXh0ZW50WzBdICE9PSBlZGdlWkV4dGVudFsxXSlcbiAgICAgICAgICAgIGVkZ2VzID0gKDAsIHV0aWxzXzEuekluZGV4T3JkZXJpbmcpKGVkZ2VaRXh0ZW50LCBmdW5jdGlvbiAoZWRnZSkgeyByZXR1cm4gX3RoaXMuZWRnZURhdGFDYWNoZVtlZGdlXS56SW5kZXg7IH0sIGVkZ2VzKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBlZGdlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZWRnZURhdGFDYWNoZVtlZGdlXTtcbiAgICAgICAgICAgIHZhciBleHRyZW1pdGllcyA9IGdyYXBoLmV4dHJlbWl0aWVzKGVkZ2UpLCBzb3VyY2VEYXRhID0gdGhpcy5ub2RlRGF0YUNhY2hlW2V4dHJlbWl0aWVzWzBdXSwgdGFyZ2V0RGF0YSA9IHRoaXMubm9kZURhdGFDYWNoZVtleHRyZW1pdGllc1sxXV07XG4gICAgICAgICAgICB2YXIgaGlkZGVuID0gZGF0YS5oaWRkZW4gfHwgc291cmNlRGF0YS5oaWRkZW4gfHwgdGFyZ2V0RGF0YS5oaWRkZW47XG4gICAgICAgICAgICB0aGlzLmVkZ2VQcm9ncmFtc1tkYXRhLnR5cGVdLnByb2Nlc3Moc291cmNlRGF0YSwgdGFyZ2V0RGF0YSwgZGF0YSwgaGlkZGVuLCBlZGdlc1BlclByb2dyYW1zW2RhdGEudHlwZV0rKyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLmVkZ2VQcm9ncmFtcykge1xuICAgICAgICAgICAgdmFyIHByb2dyYW0gPSB0aGlzLmVkZ2VQcm9ncmFtc1t0eXBlXTtcbiAgICAgICAgICAgIGlmICgha2VlcEFycmF5cyAmJiB0eXBlb2YgcHJvZ3JhbS5jb21wdXRlSW5kaWNlcyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICAgICAgICAgIHByb2dyYW0uY29tcHV0ZUluZGljZXMoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB0aGF0IGJhY2twb3J0cyBwb3RlbnRpYWwgc2V0dGluZ3MgdXBkYXRlcyB3aGVyZSBpdCdzIG5lZWRlZC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5oYW5kbGVTZXR0aW5nc1VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jYW1lcmEubWluUmF0aW8gPSB0aGlzLnNldHRpbmdzLm1pbkNhbWVyYVJhdGlvO1xuICAgICAgICB0aGlzLmNhbWVyYS5tYXhSYXRpbyA9IHRoaXMuc2V0dGluZ3MubWF4Q2FtZXJhUmF0aW87XG4gICAgICAgIHRoaXMuY2FtZXJhLnNldFN0YXRlKHRoaXMuY2FtZXJhLnZhbGlkYXRlU3RhdGUodGhpcy5jYW1lcmEuZ2V0U3RhdGUoKSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB0aGF0IGRlY2lkZXMgd2hldGhlciB0byByZXByb2Nlc3MgZ3JhcGggb3Igbm90LCBhbmQgdGhlbiByZW5kZXIgdGhlXG4gICAgICogZ3JhcGguXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuX3JlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIERvIHdlIG5lZWQgdG8gcHJvY2VzcyBkYXRhP1xuICAgICAgICBpZiAodGhpcy5uZWVkVG9Qcm9jZXNzKSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3MoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0aGlzLm5lZWRUb1NvZnRQcm9jZXNzKSB7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3ModHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVzZXR0aW5nIHN0YXRlXG4gICAgICAgIHRoaXMubmVlZFRvUHJvY2VzcyA9IGZhbHNlO1xuICAgICAgICB0aGlzLm5lZWRUb1NvZnRQcm9jZXNzID0gZmFsc2U7XG4gICAgICAgIC8vIFJlbmRlcmluZ1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB0aGF0IHNjaGVkdWxlcyBhIGBfcmVmcmVzaGAgY2FsbCBpZiBub25lIGhhcyBiZWVuIHNjaGVkdWxlZCB5ZXQuIEl0XG4gICAgICogd2lsbCB0aGVuIGJlIHByb2Nlc3NlZCBuZXh0IGF2YWlsYWJsZSBmcmFtZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NpZ21hfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5fc2NoZWR1bGVSZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoIXRoaXMucmVuZGVyRnJhbWUpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyRnJhbWUgPSAoMCwgdXRpbHNfMS5yZXF1ZXN0RnJhbWUpKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5fcmVmcmVzaCgpO1xuICAgICAgICAgICAgICAgIF90aGlzLnJlbmRlckZyYW1lID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmVuZGVyIGxhYmVscy5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NpZ21hfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5yZW5kZXJMYWJlbHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5yZW5kZXJMYWJlbHMpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgdmFyIGNhbWVyYVN0YXRlID0gdGhpcy5jYW1lcmEuZ2V0U3RhdGUoKTtcbiAgICAgICAgLy8gRmluZGluZyB2aXNpYmxlIG5vZGVzIHRvIGRpc3BsYXkgdGhlaXIgbGFiZWxzXG4gICAgICAgIHZhciB2aXNpYmxlTm9kZXM7XG4gICAgICAgIGlmIChjYW1lcmFTdGF0ZS5yYXRpbyA+PSAxKSB7XG4gICAgICAgICAgICAvLyBDYW1lcmEgaXMgdW56b29tZWQgc28gbm8gbmVlZCB0byBhc2sgdGhlIHF1YWR0cmVlIGZvciB2aXNpYmxlIG5vZGVzXG4gICAgICAgICAgICB2aXNpYmxlTm9kZXMgPSBuZXcgU2V0KHRoaXMuZ3JhcGgubm9kZXMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBMZXQncyBhc2sgdGhlIHF1YWR0cmVlXG4gICAgICAgICAgICB2YXIgdmlld1JlY3RhbmdsZSA9IHRoaXMudmlld1JlY3RhbmdsZSgpO1xuICAgICAgICAgICAgdmlzaWJsZU5vZGVzID0gbmV3IFNldCh0aGlzLnF1YWR0cmVlLnJlY3RhbmdsZSh2aWV3UmVjdGFuZ2xlLngxLCAxIC0gdmlld1JlY3RhbmdsZS55MSwgdmlld1JlY3RhbmdsZS54MiwgMSAtIHZpZXdSZWN0YW5nbGUueTIsIHZpZXdSZWN0YW5nbGUuaGVpZ2h0KSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2VsZWN0aW5nIGxhYmVscyB0byBkcmF3XG4gICAgICAgIC8vIFRPRE86IGRyb3AgZ3JpZHNldHRpbmdzIGxpa2V3aXNlXG4gICAgICAgIC8vIFRPRE86IG9wdGltaXplIHRocm91Z2ggdmlzaWJsZSBub2Rlc1xuICAgICAgICB2YXIgbGFiZWxzVG9EaXNwbGF5ID0gdGhpcy5sYWJlbEdyaWRcbiAgICAgICAgICAgIC5nZXRMYWJlbHNUb0Rpc3BsYXkoY2FtZXJhU3RhdGUucmF0aW8sIHRoaXMuc2V0dGluZ3MubGFiZWxEZW5zaXR5KVxuICAgICAgICAgICAgLmNvbmNhdCh0aGlzLm5vZGVzV2l0aEZvcmNlZExhYmVscyk7XG4gICAgICAgIHRoaXMuZGlzcGxheWVkTGFiZWxzID0gbmV3IFNldCgpO1xuICAgICAgICAvLyBEcmF3aW5nIGxhYmVsc1xuICAgICAgICB2YXIgY29udGV4dCA9IHRoaXMuY2FudmFzQ29udGV4dHMubGFiZWxzO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxhYmVsc1RvRGlzcGxheS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBub2RlID0gbGFiZWxzVG9EaXNwbGF5W2ldO1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLm5vZGVEYXRhQ2FjaGVbbm9kZV07XG4gICAgICAgICAgICAvLyBJZiB0aGUgbm9kZSB3YXMgYWxyZWFkeSBkcmF3biAobGlrZSBpZiBpdCBpcyBlbGlnaWJsZSBBTkQgaGFzXG4gICAgICAgICAgICAvLyBgZm9yY2VMYWJlbGApLCB3ZSBkb24ndCB3YW50IHRvIGRyYXcgaXQgYWdhaW5cbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BsYXllZExhYmVscy5oYXMobm9kZSkpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAvLyBJZiB0aGUgbm9kZSBpcyBoaWRkZW4sIHdlIGRvbid0IG5lZWQgdG8gZGlzcGxheSBpdHMgbGFiZWwgb2J2aW91c2x5XG4gICAgICAgICAgICBpZiAoZGF0YS5oaWRkZW4pXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB2YXIgX2EgPSB0aGlzLmZyYW1lZEdyYXBoVG9WaWV3cG9ydChkYXRhKSwgeCA9IF9hLngsIHkgPSBfYS55O1xuICAgICAgICAgICAgLy8gVE9ETzogd2UgY2FuIGNhY2hlIHRoZSBsYWJlbHMgd2UgbmVlZCB0byByZW5kZXIgdW50aWwgdGhlIGNhbWVyYSdzIHJhdGlvIGNoYW5nZXNcbiAgICAgICAgICAgIC8vIFRPRE86IHRoaXMgc2hvdWxkIGJlIGNvbXB1dGVkIGluIHRoZSBjYW52YXMgY29tcG9uZW50cz9cbiAgICAgICAgICAgIHZhciBzaXplID0gdGhpcy5zY2FsZVNpemUoZGF0YS5zaXplKTtcbiAgICAgICAgICAgIGlmICghZGF0YS5mb3JjZUxhYmVsICYmIHNpemUgPCB0aGlzLnNldHRpbmdzLmxhYmVsUmVuZGVyZWRTaXplVGhyZXNob2xkKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKCF2aXNpYmxlTm9kZXMuaGFzKG5vZGUpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgLy8gVE9ETzpcbiAgICAgICAgICAgIC8vIEJlY2F1c2UgZGlzcGxheWVkIGVkZ2UgbGFiZWxzIGRlcGVuZCBkaXJlY3RseSBvbiBhY3R1YWxseSByZW5kZXJlZCBub2RlXG4gICAgICAgICAgICAvLyBsYWJlbHMsIHdlIG5lZWQgdG8gb25seSBhZGQgdG8gdGhpcy5kaXNwbGF5ZWRMYWJlbHMgbm9kZXMgd2hvc2UgbGFiZWxcbiAgICAgICAgICAgIC8vIGlzIHJlbmRlcmVkLlxuICAgICAgICAgICAgLy8gVGhpcyBtYWtlcyB0aGlzLmRpc3BsYXllZExhYmVscyBkZXBlbmQgb24gdmlld3BvcnQsIHdoaWNoIG1pZ2h0IGJlY29tZVxuICAgICAgICAgICAgLy8gYW4gaXNzdWUgb25jZSB3ZSBzdGFydCBtZW1vaXppbmcgZ2V0TGFiZWxzVG9EaXNwbGF5LlxuICAgICAgICAgICAgdGhpcy5kaXNwbGF5ZWRMYWJlbHMuYWRkKG5vZGUpO1xuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5sYWJlbFJlbmRlcmVyKGNvbnRleHQsIF9fYXNzaWduKF9fYXNzaWduKHsga2V5OiBub2RlIH0sIGRhdGEpLCB7IHNpemU6IHNpemUsIHg6IHgsIHk6IHkgfSksIHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmVuZGVyIGVkZ2UgbGFiZWxzLCBiYXNlZCBvbiB3aGljaCBub2RlIGxhYmVscyB3ZXJlXG4gICAgICogcmVuZGVyZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUucmVuZGVyRWRnZUxhYmVscyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNldHRpbmdzLnJlbmRlckVkZ2VMYWJlbHMpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgdmFyIGNvbnRleHQgPSB0aGlzLmNhbnZhc0NvbnRleHRzLmVkZ2VMYWJlbHM7XG4gICAgICAgIC8vIENsZWFyaW5nXG4gICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgdmFyIGVkZ2VMYWJlbHNUb0Rpc3BsYXkgPSAoMCwgbGFiZWxzXzEuZWRnZUxhYmVsc1RvRGlzcGxheUZyb21Ob2Rlcykoe1xuICAgICAgICAgICAgZ3JhcGg6IHRoaXMuZ3JhcGgsXG4gICAgICAgICAgICBob3ZlcmVkTm9kZTogdGhpcy5ob3ZlcmVkTm9kZSxcbiAgICAgICAgICAgIGRpc3BsYXllZE5vZGVMYWJlbHM6IHRoaXMuZGlzcGxheWVkTGFiZWxzLFxuICAgICAgICAgICAgaGlnaGxpZ2h0ZWROb2RlczogdGhpcy5oaWdobGlnaHRlZE5vZGVzLFxuICAgICAgICB9KS5jb25jYXQodGhpcy5lZGdlc1dpdGhGb3JjZWRMYWJlbHMpO1xuICAgICAgICB2YXIgZGlzcGxheWVkTGFiZWxzID0gbmV3IFNldCgpO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGVkZ2VMYWJlbHNUb0Rpc3BsYXkubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZWRnZSA9IGVkZ2VMYWJlbHNUb0Rpc3BsYXlbaV0sIGV4dHJlbWl0aWVzID0gdGhpcy5ncmFwaC5leHRyZW1pdGllcyhlZGdlKSwgc291cmNlRGF0YSA9IHRoaXMubm9kZURhdGFDYWNoZVtleHRyZW1pdGllc1swXV0sIHRhcmdldERhdGEgPSB0aGlzLm5vZGVEYXRhQ2FjaGVbZXh0cmVtaXRpZXNbMV1dLCBlZGdlRGF0YSA9IHRoaXMuZWRnZURhdGFDYWNoZVtlZGdlXTtcbiAgICAgICAgICAgIC8vIElmIHRoZSBlZGdlIHdhcyBhbHJlYWR5IGRyYXduIChsaWtlIGlmIGl0IGlzIGVsaWdpYmxlIEFORCBoYXNcbiAgICAgICAgICAgIC8vIGBmb3JjZUxhYmVsYCksIHdlIGRvbid0IHdhbnQgdG8gZHJhdyBpdCBhZ2FpblxuICAgICAgICAgICAgaWYgKGRpc3BsYXllZExhYmVscy5oYXMoZWRnZSkpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAvLyBJZiB0aGUgZWRnZSBpcyBoaWRkZW4gd2UgZG9uJ3QgbmVlZCB0byBkaXNwbGF5IGl0cyBsYWJlbFxuICAgICAgICAgICAgLy8gTk9URTogdGhlIHRlc3Qgb24gc291cmNlRGF0YSAmIHRhcmdldERhdGEgaXMgcHJvYmFibHkgcGFyYW5vaWQgYXQgdGhpcyBwb2ludD9cbiAgICAgICAgICAgIGlmIChlZGdlRGF0YS5oaWRkZW4gfHwgc291cmNlRGF0YS5oaWRkZW4gfHwgdGFyZ2V0RGF0YS5oaWRkZW4pIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0dGluZ3MuZWRnZUxhYmVsUmVuZGVyZXIoY29udGV4dCwgX19hc3NpZ24oX19hc3NpZ24oeyBrZXk6IGVkZ2UgfSwgZWRnZURhdGEpLCB7IHNpemU6IHRoaXMuc2NhbGVTaXplKGVkZ2VEYXRhLnNpemUpIH0pLCBfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7IGtleTogZXh0cmVtaXRpZXNbMF0gfSwgc291cmNlRGF0YSksIHRoaXMuZnJhbWVkR3JhcGhUb1ZpZXdwb3J0KHNvdXJjZURhdGEpKSwgeyBzaXplOiB0aGlzLnNjYWxlU2l6ZShzb3VyY2VEYXRhLnNpemUpIH0pLCBfX2Fzc2lnbihfX2Fzc2lnbihfX2Fzc2lnbih7IGtleTogZXh0cmVtaXRpZXNbMV0gfSwgdGFyZ2V0RGF0YSksIHRoaXMuZnJhbWVkR3JhcGhUb1ZpZXdwb3J0KHRhcmdldERhdGEpKSwgeyBzaXplOiB0aGlzLnNjYWxlU2l6ZSh0YXJnZXREYXRhLnNpemUpIH0pLCB0aGlzLnNldHRpbmdzKTtcbiAgICAgICAgICAgIGRpc3BsYXllZExhYmVscy5hZGQoZWRnZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byByZW5kZXIgdGhlIGhpZ2hsaWdodGVkIG5vZGVzLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U2lnbWF9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLnJlbmRlckhpZ2hsaWdodGVkTm9kZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHZhciBjb250ZXh0ID0gdGhpcy5jYW52YXNDb250ZXh0cy5ob3ZlcnM7XG4gICAgICAgIC8vIENsZWFyaW5nXG4gICAgICAgIGNvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgLy8gUmVuZGVyaW5nXG4gICAgICAgIHZhciByZW5kZXIgPSBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSBfdGhpcy5ub2RlRGF0YUNhY2hlW25vZGVdO1xuICAgICAgICAgICAgdmFyIF9hID0gX3RoaXMuZnJhbWVkR3JhcGhUb1ZpZXdwb3J0KGRhdGEpLCB4ID0gX2EueCwgeSA9IF9hLnk7XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IF90aGlzLnNjYWxlU2l6ZShkYXRhLnNpemUpO1xuICAgICAgICAgICAgX3RoaXMuc2V0dGluZ3MuaG92ZXJSZW5kZXJlcihjb250ZXh0LCBfX2Fzc2lnbihfX2Fzc2lnbih7IGtleTogbm9kZSB9LCBkYXRhKSwgeyBzaXplOiBzaXplLCB4OiB4LCB5OiB5IH0pLCBfdGhpcy5zZXR0aW5ncyk7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBub2Rlc1RvUmVuZGVyID0gW107XG4gICAgICAgIGlmICh0aGlzLmhvdmVyZWROb2RlICYmICF0aGlzLm5vZGVEYXRhQ2FjaGVbdGhpcy5ob3ZlcmVkTm9kZV0uaGlkZGVuKSB7XG4gICAgICAgICAgICBub2Rlc1RvUmVuZGVyLnB1c2godGhpcy5ob3ZlcmVkTm9kZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5oaWdobGlnaHRlZE5vZGVzLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBob3ZlcmVkIG5vZGUgaGFzIGFscmVhZHkgYmVlbiBoaWdobGlnaHRlZFxuICAgICAgICAgICAgaWYgKG5vZGUgIT09IF90aGlzLmhvdmVyZWROb2RlKVxuICAgICAgICAgICAgICAgIG5vZGVzVG9SZW5kZXIucHVzaChub2RlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIERyYXcgbGFiZWxzOlxuICAgICAgICBub2Rlc1RvUmVuZGVyLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHsgcmV0dXJuIHJlbmRlcihub2RlKTsgfSk7XG4gICAgICAgIC8vIERyYXcgV2ViR0wgbm9kZXMgb24gdG9wIG9mIHRoZSBsYWJlbHM6XG4gICAgICAgIHZhciBub2Rlc1BlclByb2dyYW1zID0ge307XG4gICAgICAgIC8vIDEuIENvdW50IG5vZGVzIHBlciB0eXBlOlxuICAgICAgICBub2Rlc1RvUmVuZGVyLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gX3RoaXMubm9kZURhdGFDYWNoZVtub2RlXS50eXBlO1xuICAgICAgICAgICAgbm9kZXNQZXJQcm9ncmFtc1t0eXBlXSA9IChub2Rlc1BlclByb2dyYW1zW3R5cGVdIHx8IDApICsgMTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIDIuIEFsbG9jYXRlIGZvciBlYWNoIHR5cGUgZm9yIHRoZSBwcm9wZXIgbnVtYmVyIG9mIG5vZGVzXG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5ob3Zlck5vZGVQcm9ncmFtcykge1xuICAgICAgICAgICAgdGhpcy5ob3Zlck5vZGVQcm9ncmFtc1t0eXBlXS5hbGxvY2F0ZShub2Rlc1BlclByb2dyYW1zW3R5cGVdIHx8IDApO1xuICAgICAgICAgICAgLy8gQWxzbyByZXNldCBjb3VudCwgdG8gdXNlIHdoZW4gcmVuZGVyaW5nOlxuICAgICAgICAgICAgbm9kZXNQZXJQcm9ncmFtc1t0eXBlXSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgLy8gMy4gUHJvY2VzcyBhbGwgbm9kZXMgdG8gcmVuZGVyOlxuICAgICAgICBub2Rlc1RvUmVuZGVyLmZvckVhY2goZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0gX3RoaXMubm9kZURhdGFDYWNoZVtub2RlXTtcbiAgICAgICAgICAgIF90aGlzLmhvdmVyTm9kZVByb2dyYW1zW2RhdGEudHlwZV0ucHJvY2VzcyhkYXRhLCBkYXRhLmhpZGRlbiwgbm9kZXNQZXJQcm9ncmFtc1tkYXRhLnR5cGVdKyspO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gNC4gQ2xlYXIgaG92ZXJlZCBub2RlcyBsYXllcjpcbiAgICAgICAgdGhpcy53ZWJHTENvbnRleHRzLmhvdmVyTm9kZXMuY2xlYXIodGhpcy53ZWJHTENvbnRleHRzLmhvdmVyTm9kZXMuQ09MT1JfQlVGRkVSX0JJVCk7XG4gICAgICAgIC8vIDUuIFJlbmRlcjpcbiAgICAgICAgZm9yICh2YXIgdHlwZSBpbiB0aGlzLmhvdmVyTm9kZVByb2dyYW1zKSB7XG4gICAgICAgICAgICB2YXIgcHJvZ3JhbSA9IHRoaXMuaG92ZXJOb2RlUHJvZ3JhbXNbdHlwZV07XG4gICAgICAgICAgICBwcm9ncmFtLmJpbmQoKTtcbiAgICAgICAgICAgIHByb2dyYW0uYnVmZmVyRGF0YSgpO1xuICAgICAgICAgICAgcHJvZ3JhbS5yZW5kZXIoe1xuICAgICAgICAgICAgICAgIG1hdHJpeDogdGhpcy5tYXRyaXgsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgICAgICByYXRpbzogdGhpcy5jYW1lcmEucmF0aW8sXG4gICAgICAgICAgICAgICAgY29ycmVjdGlvblJhdGlvOiB0aGlzLmNvcnJlY3Rpb25SYXRpbyAvIHRoaXMuY2FtZXJhLnJhdGlvLFxuICAgICAgICAgICAgICAgIHNjYWxpbmdSYXRpbzogdGhpcy5waXhlbFJhdGlvLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIHNjaGVkdWxlIGEgaG92ZXIgcmVuZGVyLlxuICAgICAqXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLnNjaGVkdWxlSGlnaGxpZ2h0ZWROb2Rlc1JlbmRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMucmVuZGVySGlnaGxpZ2h0ZWROb2Rlc0ZyYW1lIHx8IHRoaXMucmVuZGVyRnJhbWUpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIHRoaXMucmVuZGVySGlnaGxpZ2h0ZWROb2Rlc0ZyYW1lID0gKDAsIHV0aWxzXzEucmVxdWVzdEZyYW1lKShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBSZXNldHRpbmcgc3RhdGVcbiAgICAgICAgICAgIF90aGlzLnJlbmRlckhpZ2hsaWdodGVkTm9kZXNGcmFtZSA9IG51bGw7XG4gICAgICAgICAgICAvLyBSZW5kZXJpbmdcbiAgICAgICAgICAgIF90aGlzLnJlbmRlckhpZ2hsaWdodGVkTm9kZXMoKTtcbiAgICAgICAgICAgIF90aGlzLnJlbmRlckVkZ2VMYWJlbHMoKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byByZW5kZXIuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmVtaXQoXCJiZWZvcmVSZW5kZXJcIik7XG4gICAgICAgIHZhciBoYW5kbGVFc2NhcGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5lbWl0KFwiYWZ0ZXJSZW5kZXJcIik7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgICAgIH07XG4gICAgICAgIC8vIElmIGEgcmVuZGVyIHdhcyBzY2hlZHVsZWQsIHdlIGNhbmNlbCBpdFxuICAgICAgICBpZiAodGhpcy5yZW5kZXJGcmFtZSkge1xuICAgICAgICAgICAgKDAsIHV0aWxzXzEuY2FuY2VsRnJhbWUpKHRoaXMucmVuZGVyRnJhbWUpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGcmFtZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLm5lZWRUb1Byb2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMubmVlZFRvU29mdFByb2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGaXJzdCB3ZSBuZWVkIHRvIHJlc2l6ZVxuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuICAgICAgICAvLyBDbGVhcmluZyB0aGUgY2FudmFzZXNcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICAvLyBSZWNvbXB1dGluZyB1c2VmdWwgY2FtZXJhLXJlbGF0ZWQgdmFsdWVzOlxuICAgICAgICB0aGlzLnVwZGF0ZUNhY2hlZFZhbHVlcygpO1xuICAgICAgICAvLyBJZiB3ZSBoYXZlIG5vIG5vZGVzIHdlIGNhbiBzdG9wIHJpZ2h0IHRoZXJlXG4gICAgICAgIGlmICghdGhpcy5ncmFwaC5vcmRlcilcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVFc2NhcGUoKTtcbiAgICAgICAgLy8gVE9ETzogaW1wcm92ZSB0aGlzIGhldXJpc3RpYyBvciBtb3ZlIHRvIHRoZSBjYXB0b3IgaXRzZWxmP1xuICAgICAgICAvLyBUT0RPOiBkZWFsIHdpdGggdGhlIHRvdWNoIGNhcHRvciBoZXJlIGFzIHdlbGxcbiAgICAgICAgdmFyIG1vdXNlQ2FwdG9yID0gdGhpcy5tb3VzZUNhcHRvcjtcbiAgICAgICAgdmFyIG1vdmluZyA9IHRoaXMuY2FtZXJhLmlzQW5pbWF0ZWQoKSB8fFxuICAgICAgICAgICAgbW91c2VDYXB0b3IuaXNNb3ZpbmcgfHxcbiAgICAgICAgICAgIG1vdXNlQ2FwdG9yLmRyYWdnZWRFdmVudHMgfHxcbiAgICAgICAgICAgIG1vdXNlQ2FwdG9yLmN1cnJlbnRXaGVlbERpcmVjdGlvbjtcbiAgICAgICAgLy8gVGhlbiB3ZSBuZWVkIHRvIGV4dHJhY3QgYSBtYXRyaXggZnJvbSB0aGUgY2FtZXJhXG4gICAgICAgIHZhciBjYW1lcmFTdGF0ZSA9IHRoaXMuY2FtZXJhLmdldFN0YXRlKCk7XG4gICAgICAgIHZhciB2aWV3cG9ydERpbWVuc2lvbnMgPSB0aGlzLmdldERpbWVuc2lvbnMoKTtcbiAgICAgICAgdmFyIGdyYXBoRGltZW5zaW9ucyA9IHRoaXMuZ2V0R3JhcGhEaW1lbnNpb25zKCk7XG4gICAgICAgIHZhciBwYWRkaW5nID0gdGhpcy5nZXRTZXR0aW5nKFwic3RhZ2VQYWRkaW5nXCIpIHx8IDA7XG4gICAgICAgIHRoaXMubWF0cml4ID0gKDAsIHV0aWxzXzEubWF0cml4RnJvbUNhbWVyYSkoY2FtZXJhU3RhdGUsIHZpZXdwb3J0RGltZW5zaW9ucywgZ3JhcGhEaW1lbnNpb25zLCBwYWRkaW5nKTtcbiAgICAgICAgdGhpcy5pbnZNYXRyaXggPSAoMCwgdXRpbHNfMS5tYXRyaXhGcm9tQ2FtZXJhKShjYW1lcmFTdGF0ZSwgdmlld3BvcnREaW1lbnNpb25zLCBncmFwaERpbWVuc2lvbnMsIHBhZGRpbmcsIHRydWUpO1xuICAgICAgICB0aGlzLmNvcnJlY3Rpb25SYXRpbyA9ICgwLCB1dGlsc18xLmdldE1hdHJpeEltcGFjdCkodGhpcy5tYXRyaXgsIGNhbWVyYVN0YXRlLCB2aWV3cG9ydERpbWVuc2lvbnMpO1xuICAgICAgICAvLyBEcmF3aW5nIG5vZGVzXG4gICAgICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5ub2RlUHJvZ3JhbXMpIHtcbiAgICAgICAgICAgIHZhciBwcm9ncmFtID0gdGhpcy5ub2RlUHJvZ3JhbXNbdHlwZV07XG4gICAgICAgICAgICBwcm9ncmFtLmJpbmQoKTtcbiAgICAgICAgICAgIHByb2dyYW0uYnVmZmVyRGF0YSgpO1xuICAgICAgICAgICAgcHJvZ3JhbS5yZW5kZXIoe1xuICAgICAgICAgICAgICAgIG1hdHJpeDogdGhpcy5tYXRyaXgsXG4gICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcbiAgICAgICAgICAgICAgICByYXRpbzogY2FtZXJhU3RhdGUucmF0aW8sXG4gICAgICAgICAgICAgICAgY29ycmVjdGlvblJhdGlvOiB0aGlzLmNvcnJlY3Rpb25SYXRpbyAvIGNhbWVyYVN0YXRlLnJhdGlvLFxuICAgICAgICAgICAgICAgIHNjYWxpbmdSYXRpbzogdGhpcy5waXhlbFJhdGlvLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRHJhd2luZyBlZGdlc1xuICAgICAgICBpZiAoIXRoaXMuc2V0dGluZ3MuaGlkZUVkZ2VzT25Nb3ZlIHx8ICFtb3ZpbmcpIHtcbiAgICAgICAgICAgIGZvciAodmFyIHR5cGUgaW4gdGhpcy5lZGdlUHJvZ3JhbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvZ3JhbSA9IHRoaXMuZWRnZVByb2dyYW1zW3R5cGVdO1xuICAgICAgICAgICAgICAgIHByb2dyYW0uYmluZCgpO1xuICAgICAgICAgICAgICAgIHByb2dyYW0uYnVmZmVyRGF0YSgpO1xuICAgICAgICAgICAgICAgIHByb2dyYW0ucmVuZGVyKHtcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4OiB0aGlzLm1hdHJpeCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogdGhpcy5oZWlnaHQsXG4gICAgICAgICAgICAgICAgICAgIHJhdGlvOiBjYW1lcmFTdGF0ZS5yYXRpbyxcbiAgICAgICAgICAgICAgICAgICAgY29ycmVjdGlvblJhdGlvOiB0aGlzLmNvcnJlY3Rpb25SYXRpbyAvIGNhbWVyYVN0YXRlLnJhdGlvLFxuICAgICAgICAgICAgICAgICAgICBzY2FsaW5nUmF0aW86IHRoaXMucGl4ZWxSYXRpbyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBEbyBub3QgZGlzcGxheSBsYWJlbHMgb24gbW92ZSBwZXIgc2V0dGluZ1xuICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5oaWRlTGFiZWxzT25Nb3ZlICYmIG1vdmluZylcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVFc2NhcGUoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJMYWJlbHMoKTtcbiAgICAgICAgdGhpcy5yZW5kZXJFZGdlTGFiZWxzKCk7XG4gICAgICAgIHRoaXMucmVuZGVySGlnaGxpZ2h0ZWROb2RlcygpO1xuICAgICAgICByZXR1cm4gaGFuZGxlRXNjYXBlKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBtZXRob2QgdXNlZCB0byB1cGRhdGUgZXhwZW5zaXZlIGFuZCB0aGVyZWZvcmUgY2FjaGVkIHZhbHVlc1xuICAgICAqIGVhY2ggdGltZSB0aGUgY2FtZXJhIHN0YXRlIGlzIHVwZGF0ZWQuXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLnVwZGF0ZUNhY2hlZFZhbHVlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHJhdGlvID0gdGhpcy5jYW1lcmEuZ2V0U3RhdGUoKS5yYXRpbztcbiAgICAgICAgdGhpcy5jYW1lcmFTaXplUmF0aW8gPSBNYXRoLnNxcnQocmF0aW8pO1xuICAgIH07XG4gICAgLyoqLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogUHVibGljIEFQSS5cbiAgICAgKiotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICAvKipcbiAgICAgKiBNZXRob2QgcmV0dXJuaW5nIHRoZSByZW5kZXJlcidzIGNhbWVyYS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0NhbWVyYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuZ2V0Q2FtZXJhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW1lcmE7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgcmV0dXJuaW5nIHRoZSBjb250YWluZXIgRE9NIGVsZW1lbnQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuZ2V0Q29udGFpbmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXI7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgcmV0dXJuaW5nIHRoZSByZW5kZXJlcidzIGdyYXBoLlxuICAgICAqXG4gICAgICogQHJldHVybiB7R3JhcGh9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmdldEdyYXBoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCByZXR1cm5pbmcgdGhlIG1vdXNlIGNhcHRvci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge01vdXNlQ2FwdG9yfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5nZXRNb3VzZUNhcHRvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW91c2VDYXB0b3I7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgcmV0dXJuaW5nIHRoZSB0b3VjaCBjYXB0b3IuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtUb3VjaENhcHRvcn1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuZ2V0VG91Y2hDYXB0b3IgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRvdWNoQ2FwdG9yO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHJldHVybmluZyB0aGUgY3VycmVudCByZW5kZXJlcidzIGRpbWVuc2lvbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtEaW1lbnNpb25zfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5nZXREaW1lbnNpb25zID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4geyB3aWR0aDogdGhpcy53aWR0aCwgaGVpZ2h0OiB0aGlzLmhlaWdodCB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHJldHVybmluZyB0aGUgY3VycmVudCBncmFwaCdzIGRpbWVuc2lvbnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtEaW1lbnNpb25zfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5nZXRHcmFwaERpbWVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBleHRlbnQgPSB0aGlzLmN1c3RvbUJCb3ggfHwgdGhpcy5ub2RlRXh0ZW50O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgd2lkdGg6IGV4dGVudC54WzFdIC0gZXh0ZW50LnhbMF0gfHwgMSxcbiAgICAgICAgICAgIGhlaWdodDogZXh0ZW50LnlbMV0gLSBleHRlbnQueVswXSB8fCAxLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gZ2V0IGFsbCB0aGUgc2lnbWEgbm9kZSBhdHRyaWJ1dGVzLlxuICAgICAqIEl0J3MgdXNlZnVsbCBmb3IgZXhhbXBsZSB0byBnZXQgdGhlIHBvc2l0aW9uIG9mIGEgbm9kZVxuICAgICAqIGFuZCB0byBnZXQgdmFsdWVzIHRoYXQgYXJlIHNldCBieSB0aGUgbm9kZVJlZHVjZXJcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30ga2V5IC0gVGhlIG5vZGUncyBrZXkuXG4gICAgICogQHJldHVybiB7Tm9kZURpc3BsYXlEYXRhIHwgdW5kZWZpbmVkfSBBIGNvcHkgb2YgdGhlIGRlc2lyZWQgbm9kZSdzIGF0dHJpYnV0ZSBvciB1bmRlZmluZWQgaWYgbm90IGZvdW5kXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmdldE5vZGVEaXNwbGF5RGF0YSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLm5vZGVEYXRhQ2FjaGVba2V5XTtcbiAgICAgICAgcmV0dXJuIG5vZGUgPyBPYmplY3QuYXNzaWduKHt9LCBub2RlKSA6IHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIGdldCBhbGwgdGhlIHNpZ21hIGVkZ2UgYXR0cmlidXRlcy5cbiAgICAgKiBJdCdzIHVzZWZ1bGwgZm9yIGV4YW1wbGUgdG8gZ2V0IHZhbHVlcyB0aGF0IGFyZSBzZXQgYnkgdGhlIGVkZ2VSZWR1Y2VyLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgLSBUaGUgZWRnZSdzIGtleS5cbiAgICAgKiBAcmV0dXJuIHtFZGdlRGlzcGxheURhdGEgfCB1bmRlZmluZWR9IEEgY29weSBvZiB0aGUgZGVzaXJlZCBlZGdlJ3MgYXR0cmlidXRlIG9yIHVuZGVmaW5lZCBpZiBub3QgZm91bmRcbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuZ2V0RWRnZURpc3BsYXlEYXRhID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgZWRnZSA9IHRoaXMuZWRnZURhdGFDYWNoZVtrZXldO1xuICAgICAgICByZXR1cm4gZWRnZSA/IE9iamVjdC5hc3NpZ24oe30sIGVkZ2UpIDogdW5kZWZpbmVkO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHJldHVybmluZyBhIGNvcHkgb2YgdGhlIHNldHRpbmdzIGNvbGxlY3Rpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTZXR0aW5nc30gQSBjb3B5IG9mIHRoZSBzZXR0aW5ncyBjb2xsZWN0aW9uLlxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5nZXRTZXR0aW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXNzaWduKHt9LCB0aGlzLnNldHRpbmdzKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCByZXR1cm5pbmcgdGhlIGN1cnJlbnQgdmFsdWUgZm9yIGEgZ2l2ZW4gc2V0dGluZyBrZXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleSAtIFRoZSBzZXR0aW5nIGtleSB0byBnZXQuXG4gICAgICogQHJldHVybiB7YW55fSBUaGUgdmFsdWUgYXR0YWNoZWQgdG8gdGhpcyBzZXR0aW5nIGtleSBvciB1bmRlZmluZWQgaWYgbm90IGZvdW5kXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmdldFNldHRpbmcgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnNldHRpbmdzW2tleV07XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2Qgc2V0dGluZyB0aGUgdmFsdWUgb2YgYSBnaXZlbiBzZXR0aW5nIGtleS4gTm90ZSB0aGF0IHRoaXMgd2lsbCBzY2hlZHVsZVxuICAgICAqIGEgbmV3IHJlbmRlciBuZXh0IGZyYW1lLlxuICAgICAqXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBrZXkgLSBUaGUgc2V0dGluZyBrZXkgdG8gc2V0LlxuICAgICAqIEBwYXJhbSAge2FueX0gICAgdmFsdWUgLSBUaGUgdmFsdWUgdG8gc2V0LlxuICAgICAqIEByZXR1cm4ge1NpZ21hfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5zZXRTZXR0aW5nID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5zZXR0aW5nc1trZXldID0gdmFsdWU7XG4gICAgICAgICgwLCBzZXR0aW5nc18xLnZhbGlkYXRlU2V0dGluZ3MpKHRoaXMuc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLmhhbmRsZVNldHRpbmdzVXBkYXRlKCk7XG4gICAgICAgIHRoaXMubmVlZFRvUHJvY2VzcyA9IHRydWU7IC8vIFRPRE86IHNvbWUga2V5cyBtYXkgd29yayB3aXRoIG9ubHkgbmVlZFRvU29mdFByb2Nlc3Mgb3IgZXZlbiBub3RoaW5nXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlUmVmcmVzaCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1cGRhdGluZyB0aGUgdmFsdWUgb2YgYSBnaXZlbiBzZXR0aW5nIGtleSB1c2luZyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24uXG4gICAgICogTm90ZSB0aGF0IHRoaXMgd2lsbCBzY2hlZHVsZSBhIG5ldyByZW5kZXIgbmV4dCBmcmFtZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gICBrZXkgICAgIC0gVGhlIHNldHRpbmcga2V5IHRvIHNldC5cbiAgICAgKiBAcGFyYW0gIHtmdW5jdGlvbn0gdXBkYXRlciAtIFRoZSB1cGRhdGUgZnVuY3Rpb24uXG4gICAgICogQHJldHVybiB7U2lnbWF9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLnVwZGF0ZVNldHRpbmcgPSBmdW5jdGlvbiAoa2V5LCB1cGRhdGVyKSB7XG4gICAgICAgIHRoaXMuc2V0dGluZ3Nba2V5XSA9IHVwZGF0ZXIodGhpcy5zZXR0aW5nc1trZXldKTtcbiAgICAgICAgKDAsIHNldHRpbmdzXzEudmFsaWRhdGVTZXR0aW5ncykodGhpcy5zZXR0aW5ncyk7XG4gICAgICAgIHRoaXMuaGFuZGxlU2V0dGluZ3NVcGRhdGUoKTtcbiAgICAgICAgdGhpcy5uZWVkVG9Qcm9jZXNzID0gdHJ1ZTsgLy8gVE9ETzogc29tZSBrZXlzIG1heSB3b3JrIHdpdGggb25seSBuZWVkVG9Tb2Z0UHJvY2VzcyBvciBldmVuIG5vdGhpbmdcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVSZWZyZXNoKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gcmVzaXplIHRoZSByZW5kZXJlci5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1NpZ21hfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5yZXNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwcmV2aW91c1dpZHRoID0gdGhpcy53aWR0aCwgcHJldmlvdXNIZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY29udGFpbmVyLm9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IHRoaXMuY29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvID0gKDAsIHV0aWxzXzEuZ2V0UGl4ZWxSYXRpbykoKTtcbiAgICAgICAgaWYgKHRoaXMud2lkdGggPT09IDApIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNldHRpbmdzLmFsbG93SW52YWxpZENvbnRhaW5lcilcbiAgICAgICAgICAgICAgICB0aGlzLndpZHRoID0gMTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaWdtYTogQ29udGFpbmVyIGhhcyBubyB3aWR0aC4gWW91IGNhbiBzZXQgdGhlIGFsbG93SW52YWxpZENvbnRhaW5lciBzZXR0aW5nIHRvIHRydWUgdG8gc3RvcCBzZWVpbmcgdGhpcyBlcnJvci5cIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaGVpZ2h0ID09PSAwKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hbGxvd0ludmFsaWRDb250YWluZXIpXG4gICAgICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSAxO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNpZ21hOiBDb250YWluZXIgaGFzIG5vIGhlaWdodC4gWW91IGNhbiBzZXQgdGhlIGFsbG93SW52YWxpZENvbnRhaW5lciBzZXR0aW5nIHRvIHRydWUgdG8gc3RvcCBzZWVpbmcgdGhpcyBlcnJvci5cIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgbm90aGluZyBoYXMgY2hhbmdlZCwgd2UgY2FuIHN0b3AgcmlnaHQgaGVyZVxuICAgICAgICBpZiAocHJldmlvdXNXaWR0aCA9PT0gdGhpcy53aWR0aCAmJiBwcmV2aW91c0hlaWdodCA9PT0gdGhpcy5oZWlnaHQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgdGhpcy5lbWl0KFwicmVzaXplXCIpO1xuICAgICAgICAvLyBTaXppbmcgZG9tIGVsZW1lbnRzXG4gICAgICAgIGZvciAodmFyIGlkIGluIHRoaXMuZWxlbWVudHMpIHtcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5lbGVtZW50c1tpZF07XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArIFwicHhcIjtcbiAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU2l6aW5nIGNhbnZhcyBjb250ZXh0c1xuICAgICAgICBmb3IgKHZhciBpZCBpbiB0aGlzLmNhbnZhc0NvbnRleHRzKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzW2lkXS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB0aGlzLndpZHRoICogdGhpcy5waXhlbFJhdGlvICsgXCJweFwiKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbaWRdLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCB0aGlzLmhlaWdodCAqIHRoaXMucGl4ZWxSYXRpbyArIFwicHhcIik7XG4gICAgICAgICAgICBpZiAodGhpcy5waXhlbFJhdGlvICE9PSAxKVxuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzQ29udGV4dHNbaWRdLnNjYWxlKHRoaXMucGl4ZWxSYXRpbywgdGhpcy5waXhlbFJhdGlvKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTaXppbmcgV2ViR0wgY29udGV4dHNcbiAgICAgICAgZm9yICh2YXIgaWQgaW4gdGhpcy53ZWJHTENvbnRleHRzKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnRzW2lkXS5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCB0aGlzLndpZHRoICogdGhpcy5waXhlbFJhdGlvICsgXCJweFwiKTtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudHNbaWRdLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCB0aGlzLmhlaWdodCAqIHRoaXMucGl4ZWxSYXRpbyArIFwicHhcIik7XG4gICAgICAgICAgICB0aGlzLndlYkdMQ29udGV4dHNbaWRdLnZpZXdwb3J0KDAsIDAsIHRoaXMud2lkdGggKiB0aGlzLnBpeGVsUmF0aW8sIHRoaXMuaGVpZ2h0ICogdGhpcy5waXhlbFJhdGlvKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIGNsZWFyIGFsbCB0aGUgY2FudmFzZXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMud2ViR0xDb250ZXh0cy5ub2Rlcy5jbGVhcih0aGlzLndlYkdMQ29udGV4dHMubm9kZXMuQ09MT1JfQlVGRkVSX0JJVCk7XG4gICAgICAgIHRoaXMud2ViR0xDb250ZXh0cy5lZGdlcy5jbGVhcih0aGlzLndlYkdMQ29udGV4dHMuZWRnZXMuQ09MT1JfQlVGRkVSX0JJVCk7XG4gICAgICAgIHRoaXMud2ViR0xDb250ZXh0cy5ob3Zlck5vZGVzLmNsZWFyKHRoaXMud2ViR0xDb250ZXh0cy5ob3Zlck5vZGVzLkNPTE9SX0JVRkZFUl9CSVQpO1xuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHRzLmxhYmVscy5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHRzLmhvdmVycy5jbGVhclJlY3QoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuICAgICAgICB0aGlzLmNhbnZhc0NvbnRleHRzLmVkZ2VMYWJlbHMuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byByZWZyZXNoIGFsbCBjb21wdXRlZCBkYXRhLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U2lnbWF9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLnJlZnJlc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMubmVlZFRvUHJvY2VzcyA9IHRydWU7XG4gICAgICAgIHRoaXMuX3JlZnJlc2goKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byByZWZyZXNoIGFsbCBjb21wdXRlZCBkYXRhLCBhdCB0aGUgbmV4dCBhdmFpbGFibGUgZnJhbWUuXG4gICAgICogSWYgdGhpcyBtZXRob2QgaGFzIGFscmVhZHkgYmVlbiBjYWxsZWQgdGhpcyBmcmFtZSwgdGhlbiBpdCB3aWxsIG9ubHkgcmVuZGVyIG9uY2UgYXQgdGhlIG5leHQgYXZhaWxhYmxlIGZyYW1lLlxuICAgICAqXG4gICAgICogQHJldHVybiB7U2lnbWF9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLnNjaGVkdWxlUmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5uZWVkVG9Qcm9jZXNzID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVSZWZyZXNoKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gKHVuKXpvb20sIHdoaWxlIHByZXNlcnZpbmcgdGhlIHBvc2l0aW9uIG9mIGEgdmlld3BvcnQgcG9pbnQuXG4gICAgICogVXNlZCBmb3IgaW5zdGFuY2UgdG8gem9vbSBcIm9uIHRoZSBtb3VzZSBjdXJzb3JcIi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB2aWV3cG9ydFRhcmdldFxuICAgICAqIEBwYXJhbSBuZXdSYXRpb1xuICAgICAqIEByZXR1cm4ge0NhbWVyYVN0YXRlfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5nZXRWaWV3cG9ydFpvb21lZFN0YXRlID0gZnVuY3Rpb24gKHZpZXdwb3J0VGFyZ2V0LCBuZXdSYXRpbykge1xuICAgICAgICB2YXIgX2EgPSB0aGlzLmNhbWVyYS5nZXRTdGF0ZSgpLCByYXRpbyA9IF9hLnJhdGlvLCBhbmdsZSA9IF9hLmFuZ2xlLCB4ID0gX2EueCwgeSA9IF9hLnk7XG4gICAgICAgIC8vIFRPRE86IGhhbmRsZSBtYXggem9vbVxuICAgICAgICB2YXIgcmF0aW9EaWZmID0gbmV3UmF0aW8gLyByYXRpbztcbiAgICAgICAgdmFyIGNlbnRlciA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMud2lkdGggLyAyLFxuICAgICAgICAgICAgeTogdGhpcy5oZWlnaHQgLyAyLFxuICAgICAgICB9O1xuICAgICAgICB2YXIgZ3JhcGhNb3VzZVBvc2l0aW9uID0gdGhpcy52aWV3cG9ydFRvRnJhbWVkR3JhcGgodmlld3BvcnRUYXJnZXQpO1xuICAgICAgICB2YXIgZ3JhcGhDZW50ZXJQb3NpdGlvbiA9IHRoaXMudmlld3BvcnRUb0ZyYW1lZEdyYXBoKGNlbnRlcik7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhbmdsZTogYW5nbGUsXG4gICAgICAgICAgICB4OiAoZ3JhcGhNb3VzZVBvc2l0aW9uLnggLSBncmFwaENlbnRlclBvc2l0aW9uLngpICogKDEgLSByYXRpb0RpZmYpICsgeCxcbiAgICAgICAgICAgIHk6IChncmFwaE1vdXNlUG9zaXRpb24ueSAtIGdyYXBoQ2VudGVyUG9zaXRpb24ueSkgKiAoMSAtIHJhdGlvRGlmZikgKyB5LFxuICAgICAgICAgICAgcmF0aW86IG5ld1JhdGlvLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHJldHVybmluZyB0aGUgYWJzdHJhY3QgcmVjdGFuZ2xlIGNvbnRhaW5pbmcgdGhlIGdyYXBoIGFjY29yZGluZ1xuICAgICAqIHRvIHRoZSBjYW1lcmEncyBzdGF0ZS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge29iamVjdH0gLSBUaGUgdmlldydzIHJlY3RhbmdsZS5cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUudmlld1JlY3RhbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gVE9ETzogcmVkdWNlIHJlbGF0aXZlIG1hcmdpbj9cbiAgICAgICAgdmFyIG1hcmdpblggPSAoMCAqIHRoaXMud2lkdGgpIC8gOCwgbWFyZ2luWSA9ICgwICogdGhpcy5oZWlnaHQpIC8gODtcbiAgICAgICAgdmFyIHAxID0gdGhpcy52aWV3cG9ydFRvRnJhbWVkR3JhcGgoeyB4OiAwIC0gbWFyZ2luWCwgeTogMCAtIG1hcmdpblkgfSksIHAyID0gdGhpcy52aWV3cG9ydFRvRnJhbWVkR3JhcGgoeyB4OiB0aGlzLndpZHRoICsgbWFyZ2luWCwgeTogMCAtIG1hcmdpblkgfSksIGggPSB0aGlzLnZpZXdwb3J0VG9GcmFtZWRHcmFwaCh7IHg6IDAsIHk6IHRoaXMuaGVpZ2h0ICsgbWFyZ2luWSB9KTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHgxOiBwMS54LFxuICAgICAgICAgICAgeTE6IHAxLnksXG4gICAgICAgICAgICB4MjogcDIueCxcbiAgICAgICAgICAgIHkyOiBwMi55LFxuICAgICAgICAgICAgaGVpZ2h0OiBwMi55IC0gaC55LFxuICAgICAgICB9O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHJldHVybmluZyB0aGUgY29vcmRpbmF0ZXMgb2YgYSBwb2ludCBmcm9tIHRoZSBmcmFtZWQgZ3JhcGggc3lzdGVtIHRvIHRoZSB2aWV3cG9ydCBzeXN0ZW0uIEl0IGFsbG93c1xuICAgICAqIG92ZXJyaWRpbmcgYW55dGhpbmcgdGhhdCBpcyB1c2VkIHRvIGdldCB0aGUgdHJhbnNsYXRpb24gbWF0cml4LCBvciBldmVuIHRoZSBtYXRyaXggaXRzZWxmLlxuICAgICAqXG4gICAgICogQmUgY2FyZWZ1bCBpZiBvdmVycmlkaW5nIGRpbWVuc2lvbnMsIHBhZGRpbmcgb3IgY2FtZXJhU3RhdGUsIGFzIHRoZSBjb21wdXRhdGlvbiBvZiB0aGUgbWF0cml4IGlzIG5vdCB0aGUgbGlnaHRlc3RcbiAgICAgKiBvZiBjb21wdXRhdGlvbnMuXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmZyYW1lZEdyYXBoVG9WaWV3cG9ydCA9IGZ1bmN0aW9uIChjb29yZGluYXRlcywgb3ZlcnJpZGUpIHtcbiAgICAgICAgaWYgKG92ZXJyaWRlID09PSB2b2lkIDApIHsgb3ZlcnJpZGUgPSB7fTsgfVxuICAgICAgICB2YXIgcmVjb21wdXRlTWF0cml4ID0gISFvdmVycmlkZS5jYW1lcmFTdGF0ZSB8fCAhIW92ZXJyaWRlLnZpZXdwb3J0RGltZW5zaW9ucyB8fCAhIW92ZXJyaWRlLmdyYXBoRGltZW5zaW9ucztcbiAgICAgICAgdmFyIG1hdHJpeCA9IG92ZXJyaWRlLm1hdHJpeFxuICAgICAgICAgICAgPyBvdmVycmlkZS5tYXRyaXhcbiAgICAgICAgICAgIDogcmVjb21wdXRlTWF0cml4XG4gICAgICAgICAgICAgICAgPyAoMCwgdXRpbHNfMS5tYXRyaXhGcm9tQ2FtZXJhKShvdmVycmlkZS5jYW1lcmFTdGF0ZSB8fCB0aGlzLmNhbWVyYS5nZXRTdGF0ZSgpLCBvdmVycmlkZS52aWV3cG9ydERpbWVuc2lvbnMgfHwgdGhpcy5nZXREaW1lbnNpb25zKCksIG92ZXJyaWRlLmdyYXBoRGltZW5zaW9ucyB8fCB0aGlzLmdldEdyYXBoRGltZW5zaW9ucygpLCBvdmVycmlkZS5wYWRkaW5nIHx8IHRoaXMuZ2V0U2V0dGluZyhcInN0YWdlUGFkZGluZ1wiKSB8fCAwKVxuICAgICAgICAgICAgICAgIDogdGhpcy5tYXRyaXg7XG4gICAgICAgIHZhciB2aWV3cG9ydFBvcyA9ICgwLCBtYXRyaWNlc18xLm11bHRpcGx5VmVjMikobWF0cml4LCBjb29yZGluYXRlcyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiAoKDEgKyB2aWV3cG9ydFBvcy54KSAqIHRoaXMud2lkdGgpIC8gMixcbiAgICAgICAgICAgIHk6ICgoMSAtIHZpZXdwb3J0UG9zLnkpICogdGhpcy5oZWlnaHQpIC8gMixcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCByZXR1cm5pbmcgdGhlIGNvb3JkaW5hdGVzIG9mIGEgcG9pbnQgZnJvbSB0aGUgdmlld3BvcnQgc3lzdGVtIHRvIHRoZSBmcmFtZWQgZ3JhcGggc3lzdGVtLiBJdCBhbGxvd3NcbiAgICAgKiBvdmVycmlkaW5nIGFueXRoaW5nIHRoYXQgaXMgdXNlZCB0byBnZXQgdGhlIHRyYW5zbGF0aW9uIG1hdHJpeCwgb3IgZXZlbiB0aGUgbWF0cml4IGl0c2VsZi5cbiAgICAgKlxuICAgICAqIEJlIGNhcmVmdWwgaWYgb3ZlcnJpZGluZyBkaW1lbnNpb25zLCBwYWRkaW5nIG9yIGNhbWVyYVN0YXRlLCBhcyB0aGUgY29tcHV0YXRpb24gb2YgdGhlIG1hdHJpeCBpcyBub3QgdGhlIGxpZ2h0ZXN0XG4gICAgICogb2YgY29tcHV0YXRpb25zLlxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS52aWV3cG9ydFRvRnJhbWVkR3JhcGggPSBmdW5jdGlvbiAoY29vcmRpbmF0ZXMsIG92ZXJyaWRlKSB7XG4gICAgICAgIGlmIChvdmVycmlkZSA9PT0gdm9pZCAwKSB7IG92ZXJyaWRlID0ge307IH1cbiAgICAgICAgdmFyIHJlY29tcHV0ZU1hdHJpeCA9ICEhb3ZlcnJpZGUuY2FtZXJhU3RhdGUgfHwgISFvdmVycmlkZS52aWV3cG9ydERpbWVuc2lvbnMgfHwgIW92ZXJyaWRlLmdyYXBoRGltZW5zaW9ucztcbiAgICAgICAgdmFyIGludk1hdHJpeCA9IG92ZXJyaWRlLm1hdHJpeFxuICAgICAgICAgICAgPyBvdmVycmlkZS5tYXRyaXhcbiAgICAgICAgICAgIDogcmVjb21wdXRlTWF0cml4XG4gICAgICAgICAgICAgICAgPyAoMCwgdXRpbHNfMS5tYXRyaXhGcm9tQ2FtZXJhKShvdmVycmlkZS5jYW1lcmFTdGF0ZSB8fCB0aGlzLmNhbWVyYS5nZXRTdGF0ZSgpLCBvdmVycmlkZS52aWV3cG9ydERpbWVuc2lvbnMgfHwgdGhpcy5nZXREaW1lbnNpb25zKCksIG92ZXJyaWRlLmdyYXBoRGltZW5zaW9ucyB8fCB0aGlzLmdldEdyYXBoRGltZW5zaW9ucygpLCBvdmVycmlkZS5wYWRkaW5nIHx8IHRoaXMuZ2V0U2V0dGluZyhcInN0YWdlUGFkZGluZ1wiKSB8fCAwLCB0cnVlKVxuICAgICAgICAgICAgICAgIDogdGhpcy5pbnZNYXRyaXg7XG4gICAgICAgIHZhciByZXMgPSAoMCwgbWF0cmljZXNfMS5tdWx0aXBseVZlYzIpKGludk1hdHJpeCwge1xuICAgICAgICAgICAgeDogKGNvb3JkaW5hdGVzLnggLyB0aGlzLndpZHRoKSAqIDIgLSAxLFxuICAgICAgICAgICAgeTogMSAtIChjb29yZGluYXRlcy55IC8gdGhpcy5oZWlnaHQpICogMixcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChpc05hTihyZXMueCkpXG4gICAgICAgICAgICByZXMueCA9IDA7XG4gICAgICAgIGlmIChpc05hTihyZXMueSkpXG4gICAgICAgICAgICByZXMueSA9IDA7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byB0cmFuc2xhdGUgYSBwb2ludCdzIGNvb3JkaW5hdGVzIGZyb20gdGhlIHZpZXdwb3J0IHN5c3RlbSAocGl4ZWwgZGlzdGFuY2UgZnJvbSB0aGUgdG9wLWxlZnQgb2YgdGhlXG4gICAgICogc3RhZ2UpIHRvIHRoZSBncmFwaCBzeXN0ZW0gKHRoZSByZWZlcmVuY2Ugc3lzdGVtIG9mIGRhdGEgYXMgdGhleSBhcmUgaW4gdGhlIGdpdmVuIGdyYXBoIGluc3RhbmNlKS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGFjY2VwdHMgYW4gb3B0aW9uYWwgY2FtZXJhIHdoaWNoIGNhbiBiZSB1c2VmdWwgaWYgeW91IG5lZWQgdG8gdHJhbnNsYXRlIGNvb3JkaW5hdGVzXG4gICAgICogYmFzZWQgb24gYSBkaWZmZXJlbnQgdmlldyB0aGFuIHRoZSBvbmUgYmVpbmcgY3VycmVudGx5IGJlaW5nIGRpc3BsYXllZCBvbiBzY3JlZW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Nvb3JkaW5hdGVzfSAgICAgICAgICAgICAgICAgIHZpZXdwb3J0UG9pbnRcbiAgICAgKiBAcGFyYW0ge0Nvb3JkaW5hdGVDb252ZXJzaW9uT3ZlcnJpZGV9IG92ZXJyaWRlXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLnZpZXdwb3J0VG9HcmFwaCA9IGZ1bmN0aW9uICh2aWV3cG9ydFBvaW50LCBvdmVycmlkZSkge1xuICAgICAgICBpZiAob3ZlcnJpZGUgPT09IHZvaWQgMCkgeyBvdmVycmlkZSA9IHt9OyB9XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6YXRpb25GdW5jdGlvbi5pbnZlcnNlKHRoaXMudmlld3BvcnRUb0ZyYW1lZEdyYXBoKHZpZXdwb3J0UG9pbnQsIG92ZXJyaWRlKSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byB0cmFuc2xhdGUgYSBwb2ludCdzIGNvb3JkaW5hdGVzIGZyb20gdGhlIGdyYXBoIHN5c3RlbSAodGhlIHJlZmVyZW5jZSBzeXN0ZW0gb2YgZGF0YSBhcyB0aGV5IGFyZSBpblxuICAgICAqIHRoZSBnaXZlbiBncmFwaCBpbnN0YW5jZSkgdG8gdGhlIHZpZXdwb3J0IHN5c3RlbSAocGl4ZWwgZGlzdGFuY2UgZnJvbSB0aGUgdG9wLWxlZnQgb2YgdGhlIHN0YWdlKS5cbiAgICAgKlxuICAgICAqIFRoaXMgbWV0aG9kIGFjY2VwdHMgYW4gb3B0aW9uYWwgY2FtZXJhIHdoaWNoIGNhbiBiZSB1c2VmdWwgaWYgeW91IG5lZWQgdG8gdHJhbnNsYXRlIGNvb3JkaW5hdGVzXG4gICAgICogYmFzZWQgb24gYSBkaWZmZXJlbnQgdmlldyB0aGFuIHRoZSBvbmUgYmVpbmcgY3VycmVudGx5IGJlaW5nIGRpc3BsYXllZCBvbiBzY3JlZW4uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Nvb3JkaW5hdGVzfSAgICAgICAgICAgICAgICAgIGdyYXBoUG9pbnRcbiAgICAgKiBAcGFyYW0ge0Nvb3JkaW5hdGVDb252ZXJzaW9uT3ZlcnJpZGV9IG92ZXJyaWRlXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmdyYXBoVG9WaWV3cG9ydCA9IGZ1bmN0aW9uIChncmFwaFBvaW50LCBvdmVycmlkZSkge1xuICAgICAgICBpZiAob3ZlcnJpZGUgPT09IHZvaWQgMCkgeyBvdmVycmlkZSA9IHt9OyB9XG4gICAgICAgIHJldHVybiB0aGlzLmZyYW1lZEdyYXBoVG9WaWV3cG9ydCh0aGlzLm5vcm1hbGl6YXRpb25GdW5jdGlvbihncmFwaFBvaW50KSwgb3ZlcnJpZGUpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHJldHVybmluZyB0aGUgZ3JhcGgncyBib3VuZGluZyBib3guXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHt7IHg6IEV4dGVudCwgeTogRXh0ZW50IH19XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmdldEJCb3ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoMCwgdXRpbHNfMS5ncmFwaEV4dGVudCkodGhpcy5ncmFwaCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgcmV0dXJuaW5nIHRoZSBncmFwaCdzIGN1c3RvbSBib3VuZGluZyBib3gsIGlmIGFueS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge3sgeDogRXh0ZW50LCB5OiBFeHRlbnQgfSB8IG51bGx9XG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLmdldEN1c3RvbUJCb3ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1c3RvbUJCb3g7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdXNlZCB0byBvdmVycmlkZSB0aGUgZ3JhcGgncyBib3VuZGluZyBib3ggd2l0aCBhIGN1c3RvbSBvbmUuIEdpdmUgYG51bGxgIGFzIHRoZSBhcmd1bWVudCB0byBzdG9wIG92ZXJyaWRpbmcuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTaWdtYX1cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuc2V0Q3VzdG9tQkJveCA9IGZ1bmN0aW9uIChjdXN0b21CQm94KSB7XG4gICAgICAgIHRoaXMuY3VzdG9tQkJveCA9IGN1c3RvbUJCb3g7XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlUmVmcmVzaCgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIE1ldGhvZCB1c2VkIHRvIHNodXQgdGhlIGNvbnRhaW5lciAmIHJlbGVhc2UgZXZlbnQgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHJldHVybiB7dW5kZWZpbmVkfVxuICAgICAqL1xuICAgIFNpZ21hLnByb3RvdHlwZS5raWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ3JhcGggPSB0aGlzLmdyYXBoO1xuICAgICAgICAvLyBFbWl0dGluZyBcImtpbGxcIiBldmVudHMgc28gdGhhdCBwbHVnaW5zIGFuZCBzdWNoIGNhbiBjbGVhbnVwXG4gICAgICAgIHRoaXMuZW1pdChcImtpbGxcIik7XG4gICAgICAgIC8vIFJlbGVhc2luZyBldmVudHNcbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoKTtcbiAgICAgICAgLy8gUmVsZWFzaW5nIGNhbWVyYSBoYW5kbGVyc1xuICAgICAgICB0aGlzLmNhbWVyYS5yZW1vdmVMaXN0ZW5lcihcInVwZGF0ZWRcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuY2FtZXJhKTtcbiAgICAgICAgLy8gUmVsZWFzaW5nIERPTSBldmVudHMgJiBjYXB0b3JzXG4gICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgIHRoaXMubW91c2VDYXB0b3Iua2lsbCgpO1xuICAgICAgICB0aGlzLnRvdWNoQ2FwdG9yLmtpbGwoKTtcbiAgICAgICAgLy8gUmVsZWFzaW5nIGdyYXBoIGhhbmRsZXJzXG4gICAgICAgIGdyYXBoLnJlbW92ZUxpc3RlbmVyKFwibm9kZUFkZGVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmRyb3BOb2RlR3JhcGhVcGRhdGUpO1xuICAgICAgICBncmFwaC5yZW1vdmVMaXN0ZW5lcihcIm5vZGVEcm9wcGVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmdyYXBoVXBkYXRlKTtcbiAgICAgICAgZ3JhcGgucmVtb3ZlTGlzdGVuZXIoXCJub2RlQXR0cmlidXRlc1VwZGF0ZWRcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuc29mdEdyYXBoVXBkYXRlKTtcbiAgICAgICAgZ3JhcGgucmVtb3ZlTGlzdGVuZXIoXCJlYWNoTm9kZUF0dHJpYnV0ZXNVcGRhdGVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmdyYXBoVXBkYXRlKTtcbiAgICAgICAgZ3JhcGgucmVtb3ZlTGlzdGVuZXIoXCJlZGdlQWRkZWRcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuZ3JhcGhVcGRhdGUpO1xuICAgICAgICBncmFwaC5yZW1vdmVMaXN0ZW5lcihcImVkZ2VEcm9wcGVkXCIsIHRoaXMuYWN0aXZlTGlzdGVuZXJzLmRyb3BFZGdlR3JhcGhVcGRhdGUpO1xuICAgICAgICBncmFwaC5yZW1vdmVMaXN0ZW5lcihcImVkZ2VBdHRyaWJ1dGVzVXBkYXRlZFwiLCB0aGlzLmFjdGl2ZUxpc3RlbmVycy5zb2Z0R3JhcGhVcGRhdGUpO1xuICAgICAgICBncmFwaC5yZW1vdmVMaXN0ZW5lcihcImVhY2hFZGdlQXR0cmlidXRlc1VwZGF0ZWRcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuZ3JhcGhVcGRhdGUpO1xuICAgICAgICBncmFwaC5yZW1vdmVMaXN0ZW5lcihcImVkZ2VzQ2xlYXJlZFwiLCB0aGlzLmFjdGl2ZUxpc3RlbmVycy5jbGVhckVkZ2VzR3JhcGhVcGRhdGUpO1xuICAgICAgICBncmFwaC5yZW1vdmVMaXN0ZW5lcihcImNsZWFyZWRcIiwgdGhpcy5hY3RpdmVMaXN0ZW5lcnMuY2xlYXJHcmFwaFVwZGF0ZSk7XG4gICAgICAgIC8vIFJlbGVhc2luZyBjYWNoZSAmIHN0YXRlXG4gICAgICAgIHRoaXMucXVhZHRyZWUgPSBuZXcgcXVhZHRyZWVfMS5kZWZhdWx0KCk7XG4gICAgICAgIHRoaXMubm9kZURhdGFDYWNoZSA9IHt9O1xuICAgICAgICB0aGlzLmVkZ2VEYXRhQ2FjaGUgPSB7fTtcbiAgICAgICAgdGhpcy5ub2Rlc1dpdGhGb3JjZWRMYWJlbHMgPSBbXTtcbiAgICAgICAgdGhpcy5lZGdlc1dpdGhGb3JjZWRMYWJlbHMgPSBbXTtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRlZE5vZGVzLmNsZWFyKCk7XG4gICAgICAgIC8vIENsZWFyaW5nIGZyYW1lc1xuICAgICAgICBpZiAodGhpcy5yZW5kZXJGcmFtZSkge1xuICAgICAgICAgICAgKDAsIHV0aWxzXzEuY2FuY2VsRnJhbWUpKHRoaXMucmVuZGVyRnJhbWUpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJGcmFtZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVuZGVySGlnaGxpZ2h0ZWROb2Rlc0ZyYW1lKSB7XG4gICAgICAgICAgICAoMCwgdXRpbHNfMS5jYW5jZWxGcmFtZSkodGhpcy5yZW5kZXJIaWdobGlnaHRlZE5vZGVzRnJhbWUpO1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJIaWdobGlnaHRlZE5vZGVzRnJhbWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIC8vIERlc3Ryb3lpbmcgY2FudmFzZXNcbiAgICAgICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyO1xuICAgICAgICB3aGlsZSAoY29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICBjb250YWluZXIucmVtb3ZlQ2hpbGQoY29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogTWV0aG9kIHVzZWQgdG8gc2NhbGUgdGhlIGdpdmVuIHNpemUgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEncyByYXRpbywgaS5lLlxuICAgICAqIHpvb21pbmcgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IHNpemUgLSBUaGUgc2l6ZSB0byBzY2FsZSAobm9kZSBzaXplLCBlZGdlIHRoaWNrbmVzcyBldGMuKS5cbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9ICAgICAgLSBUaGUgc2NhbGVkIHNpemUuXG4gICAgICovXG4gICAgU2lnbWEucHJvdG90eXBlLnNjYWxlU2l6ZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gICAgICAgIHJldHVybiBzaXplIC8gdGhpcy5jYW1lcmFTaXplUmF0aW87XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBNZXRob2QgdGhhdCByZXR1cm5zIHRoZSBjb2xsZWN0aW9uIG9mIGFsbCB1c2VkIGNhbnZhc2VzLlxuICAgICAqIEF0IHRoZSBtb21lbnQsIHRoZSBpbnN0YW50aWF0ZWQgY2FudmFzZXMgYXJlIHRoZSBmb2xsb3dpbmcsIGFuZCBpbiB0aGVcbiAgICAgKiBmb2xsb3dpbmcgb3JkZXIgaW4gdGhlIERPTTpcbiAgICAgKiAtIGBlZGdlc2BcbiAgICAgKiAtIGBub2Rlc2BcbiAgICAgKiAtIGBlZGdlTGFiZWxzYFxuICAgICAqIC0gYGxhYmVsc2BcbiAgICAgKiAtIGBob3ZlcnNgXG4gICAgICogLSBgaG92ZXJOb2Rlc2BcbiAgICAgKiAtIGBtb3VzZWBcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1BsYWluT2JqZWN0PEhUTUxDYW52YXNFbGVtZW50Pn0gLSBUaGUgY29sbGVjdGlvbiBvZiBjYW52YXNlcy5cbiAgICAgKi9cbiAgICBTaWdtYS5wcm90b3R5cGUuZ2V0Q2FudmFzZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfX2Fzc2lnbih7fSwgdGhpcy5lbGVtZW50cyk7XG4gICAgfTtcbiAgICByZXR1cm4gU2lnbWE7XG59KHR5cGVzXzEuVHlwZWRFdmVudEVtaXR0ZXIpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNpZ21hO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5UeXBlZEV2ZW50RW1pdHRlciA9IHZvaWQgMDtcbi8qKlxuICogU2lnbWEuanMgVHlwZXNcbiAqID09PT09PT09PT09PT09PVxuICpcbiAqIFZhcmlvdXMgdHlwZSBkZWNsYXJhdGlvbnMgdXNlZCB0aHJvdWdob3V0IHRoZSBsaWJyYXJ5LlxuICogQG1vZHVsZVxuICovXG52YXIgZXZlbnRzXzEgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xudmFyIFR5cGVkRXZlbnRFbWl0dGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhUeXBlZEV2ZW50RW1pdHRlciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBUeXBlZEV2ZW50RW1pdHRlcigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMucmF3RW1pdHRlciA9IF90aGlzO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIHJldHVybiBUeXBlZEV2ZW50RW1pdHRlcjtcbn0oZXZlbnRzXzEuRXZlbnRFbWl0dGVyKSk7XG5leHBvcnRzLlR5cGVkRXZlbnRFbWl0dGVyID0gVHlwZWRFdmVudEVtaXR0ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYW5pbWF0ZU5vZGVzID0gZXhwb3J0cy5BTklNQVRFX0RFRkFVTFRTID0gdm9pZCAwO1xudmFyIGluZGV4XzEgPSByZXF1aXJlKFwiLi9pbmRleFwiKTtcbnZhciBlYXNpbmdzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZWFzaW5nc1wiKSk7XG5leHBvcnRzLkFOSU1BVEVfREVGQVVMVFMgPSB7XG4gICAgZWFzaW5nOiBcInF1YWRyYXRpY0luT3V0XCIsXG4gICAgZHVyYXRpb246IDE1MCxcbn07XG4vKipcbiAqIEZ1bmN0aW9uIHVzZWQgdG8gYW5pbWF0ZSB0aGUgbm9kZXMuXG4gKi9cbmZ1bmN0aW9uIGFuaW1hdGVOb2RlcyhncmFwaCwgdGFyZ2V0cywgb3B0cywgY2FsbGJhY2spIHtcbiAgICB2YXIgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIGV4cG9ydHMuQU5JTUFURV9ERUZBVUxUUywgb3B0cyk7XG4gICAgdmFyIGVhc2luZyA9IHR5cGVvZiBvcHRpb25zLmVhc2luZyA9PT0gXCJmdW5jdGlvblwiID8gb3B0aW9ucy5lYXNpbmcgOiBlYXNpbmdzXzEuZGVmYXVsdFtvcHRpb25zLmVhc2luZ107XG4gICAgdmFyIHN0YXJ0ID0gRGF0ZS5ub3coKTtcbiAgICB2YXIgc3RhcnRQb3NpdGlvbnMgPSB7fTtcbiAgICBmb3IgKHZhciBub2RlIGluIHRhcmdldHMpIHtcbiAgICAgICAgdmFyIGF0dHJzID0gdGFyZ2V0c1tub2RlXTtcbiAgICAgICAgc3RhcnRQb3NpdGlvbnNbbm9kZV0gPSB7fTtcbiAgICAgICAgZm9yICh2YXIgayBpbiBhdHRycylcbiAgICAgICAgICAgIHN0YXJ0UG9zaXRpb25zW25vZGVdW2tdID0gZ3JhcGguZ2V0Tm9kZUF0dHJpYnV0ZShub2RlLCBrKTtcbiAgICB9XG4gICAgdmFyIGZyYW1lID0gbnVsbDtcbiAgICB2YXIgc3RlcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnJhbWUgPSBudWxsO1xuICAgICAgICB2YXIgcCA9IChEYXRlLm5vdygpIC0gc3RhcnQpIC8gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgaWYgKHAgPj0gMSkge1xuICAgICAgICAgICAgLy8gQW5pbWF0aW9uIGlzIGRvbmVcbiAgICAgICAgICAgIGZvciAodmFyIG5vZGUgaW4gdGFyZ2V0cykge1xuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHRhcmdldHNbbm9kZV07XG4gICAgICAgICAgICAgICAgLy8gV2UgdXNlIGdpdmVuIHZhbHVlcyB0byBhdm9pZCBwcmVjaXNpb24gaXNzdWVzIGFuZCBmb3IgY29udmVuaWVuY2VcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrIGluIGF0dHJzKVxuICAgICAgICAgICAgICAgICAgICBncmFwaC5zZXROb2RlQXR0cmlidXRlKG5vZGUsIGssIGF0dHJzW2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHAgPSBlYXNpbmcocCk7XG4gICAgICAgIGZvciAodmFyIG5vZGUgaW4gdGFyZ2V0cykge1xuICAgICAgICAgICAgdmFyIGF0dHJzID0gdGFyZ2V0c1tub2RlXTtcbiAgICAgICAgICAgIHZhciBzID0gc3RhcnRQb3NpdGlvbnNbbm9kZV07XG4gICAgICAgICAgICBmb3IgKHZhciBrIGluIGF0dHJzKVxuICAgICAgICAgICAgICAgIGdyYXBoLnNldE5vZGVBdHRyaWJ1dGUobm9kZSwgaywgYXR0cnNba10gKiBwICsgc1trXSAqICgxIC0gcCkpO1xuICAgICAgICB9XG4gICAgICAgIGZyYW1lID0gKDAsIGluZGV4XzEucmVxdWVzdEZyYW1lKShzdGVwKTtcbiAgICB9O1xuICAgIHN0ZXAoKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoZnJhbWUpXG4gICAgICAgICAgICAoMCwgaW5kZXhfMS5jYW5jZWxGcmFtZSkoZnJhbWUpO1xuICAgIH07XG59XG5leHBvcnRzLmFuaW1hdGVOb2RlcyA9IGFuaW1hdGVOb2RlcztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5IVE1MX0NPTE9SUyA9IHZvaWQgMDtcbmV4cG9ydHMuSFRNTF9DT0xPUlMgPSB7XG4gICAgYmxhY2s6IFwiIzAwMDAwMFwiLFxuICAgIHNpbHZlcjogXCIjQzBDMEMwXCIsXG4gICAgZ3JheTogXCIjODA4MDgwXCIsXG4gICAgZ3JleTogXCIjODA4MDgwXCIsXG4gICAgd2hpdGU6IFwiI0ZGRkZGRlwiLFxuICAgIG1hcm9vbjogXCIjODAwMDAwXCIsXG4gICAgcmVkOiBcIiNGRjAwMDBcIixcbiAgICBwdXJwbGU6IFwiIzgwMDA4MFwiLFxuICAgIGZ1Y2hzaWE6IFwiI0ZGMDBGRlwiLFxuICAgIGdyZWVuOiBcIiMwMDgwMDBcIixcbiAgICBsaW1lOiBcIiMwMEZGMDBcIixcbiAgICBvbGl2ZTogXCIjODA4MDAwXCIsXG4gICAgeWVsbG93OiBcIiNGRkZGMDBcIixcbiAgICBuYXZ5OiBcIiMwMDAwODBcIixcbiAgICBibHVlOiBcIiMwMDAwRkZcIixcbiAgICB0ZWFsOiBcIiMwMDgwODBcIixcbiAgICBhcXVhOiBcIiMwMEZGRkZcIixcbiAgICBkYXJrYmx1ZTogXCIjMDAwMDhCXCIsXG4gICAgbWVkaXVtYmx1ZTogXCIjMDAwMENEXCIsXG4gICAgZGFya2dyZWVuOiBcIiMwMDY0MDBcIixcbiAgICBkYXJrY3lhbjogXCIjMDA4QjhCXCIsXG4gICAgZGVlcHNreWJsdWU6IFwiIzAwQkZGRlwiLFxuICAgIGRhcmt0dXJxdW9pc2U6IFwiIzAwQ0VEMVwiLFxuICAgIG1lZGl1bXNwcmluZ2dyZWVuOiBcIiMwMEZBOUFcIixcbiAgICBzcHJpbmdncmVlbjogXCIjMDBGRjdGXCIsXG4gICAgY3lhbjogXCIjMDBGRkZGXCIsXG4gICAgbWlkbmlnaHRibHVlOiBcIiMxOTE5NzBcIixcbiAgICBkb2RnZXJibHVlOiBcIiMxRTkwRkZcIixcbiAgICBsaWdodHNlYWdyZWVuOiBcIiMyMEIyQUFcIixcbiAgICBmb3Jlc3RncmVlbjogXCIjMjI4QjIyXCIsXG4gICAgc2VhZ3JlZW46IFwiIzJFOEI1N1wiLFxuICAgIGRhcmtzbGF0ZWdyYXk6IFwiIzJGNEY0RlwiLFxuICAgIGRhcmtzbGF0ZWdyZXk6IFwiIzJGNEY0RlwiLFxuICAgIGxpbWVncmVlbjogXCIjMzJDRDMyXCIsXG4gICAgbWVkaXVtc2VhZ3JlZW46IFwiIzNDQjM3MVwiLFxuICAgIHR1cnF1b2lzZTogXCIjNDBFMEQwXCIsXG4gICAgcm95YWxibHVlOiBcIiM0MTY5RTFcIixcbiAgICBzdGVlbGJsdWU6IFwiIzQ2ODJCNFwiLFxuICAgIGRhcmtzbGF0ZWJsdWU6IFwiIzQ4M0Q4QlwiLFxuICAgIG1lZGl1bXR1cnF1b2lzZTogXCIjNDhEMUNDXCIsXG4gICAgaW5kaWdvOiBcIiM0QjAwODJcIixcbiAgICBkYXJrb2xpdmVncmVlbjogXCIjNTU2QjJGXCIsXG4gICAgY2FkZXRibHVlOiBcIiM1RjlFQTBcIixcbiAgICBjb3JuZmxvd2VyYmx1ZTogXCIjNjQ5NUVEXCIsXG4gICAgcmViZWNjYXB1cnBsZTogXCIjNjYzMzk5XCIsXG4gICAgbWVkaXVtYXF1YW1hcmluZTogXCIjNjZDREFBXCIsXG4gICAgZGltZ3JheTogXCIjNjk2OTY5XCIsXG4gICAgZGltZ3JleTogXCIjNjk2OTY5XCIsXG4gICAgc2xhdGVibHVlOiBcIiM2QTVBQ0RcIixcbiAgICBvbGl2ZWRyYWI6IFwiIzZCOEUyM1wiLFxuICAgIHNsYXRlZ3JheTogXCIjNzA4MDkwXCIsXG4gICAgc2xhdGVncmV5OiBcIiM3MDgwOTBcIixcbiAgICBsaWdodHNsYXRlZ3JheTogXCIjNzc4ODk5XCIsXG4gICAgbGlnaHRzbGF0ZWdyZXk6IFwiIzc3ODg5OVwiLFxuICAgIG1lZGl1bXNsYXRlYmx1ZTogXCIjN0I2OEVFXCIsXG4gICAgbGF3bmdyZWVuOiBcIiM3Q0ZDMDBcIixcbiAgICBjaGFydHJldXNlOiBcIiM3RkZGMDBcIixcbiAgICBhcXVhbWFyaW5lOiBcIiM3RkZGRDRcIixcbiAgICBza3libHVlOiBcIiM4N0NFRUJcIixcbiAgICBsaWdodHNreWJsdWU6IFwiIzg3Q0VGQVwiLFxuICAgIGJsdWV2aW9sZXQ6IFwiIzhBMkJFMlwiLFxuICAgIGRhcmtyZWQ6IFwiIzhCMDAwMFwiLFxuICAgIGRhcmttYWdlbnRhOiBcIiM4QjAwOEJcIixcbiAgICBzYWRkbGVicm93bjogXCIjOEI0NTEzXCIsXG4gICAgZGFya3NlYWdyZWVuOiBcIiM4RkJDOEZcIixcbiAgICBsaWdodGdyZWVuOiBcIiM5MEVFOTBcIixcbiAgICBtZWRpdW1wdXJwbGU6IFwiIzkzNzBEQlwiLFxuICAgIGRhcmt2aW9sZXQ6IFwiIzk0MDBEM1wiLFxuICAgIHBhbGVncmVlbjogXCIjOThGQjk4XCIsXG4gICAgZGFya29yY2hpZDogXCIjOTkzMkNDXCIsXG4gICAgeWVsbG93Z3JlZW46IFwiIzlBQ0QzMlwiLFxuICAgIHNpZW5uYTogXCIjQTA1MjJEXCIsXG4gICAgYnJvd246IFwiI0E1MkEyQVwiLFxuICAgIGRhcmtncmF5OiBcIiNBOUE5QTlcIixcbiAgICBkYXJrZ3JleTogXCIjQTlBOUE5XCIsXG4gICAgbGlnaHRibHVlOiBcIiNBREQ4RTZcIixcbiAgICBncmVlbnllbGxvdzogXCIjQURGRjJGXCIsXG4gICAgcGFsZXR1cnF1b2lzZTogXCIjQUZFRUVFXCIsXG4gICAgbGlnaHRzdGVlbGJsdWU6IFwiI0IwQzRERVwiLFxuICAgIHBvd2RlcmJsdWU6IFwiI0IwRTBFNlwiLFxuICAgIGZpcmVicmljazogXCIjQjIyMjIyXCIsXG4gICAgZGFya2dvbGRlbnJvZDogXCIjQjg4NjBCXCIsXG4gICAgbWVkaXVtb3JjaGlkOiBcIiNCQTU1RDNcIixcbiAgICByb3N5YnJvd246IFwiI0JDOEY4RlwiLFxuICAgIGRhcmtraGFraTogXCIjQkRCNzZCXCIsXG4gICAgbWVkaXVtdmlvbGV0cmVkOiBcIiNDNzE1ODVcIixcbiAgICBpbmRpYW5yZWQ6IFwiI0NENUM1Q1wiLFxuICAgIHBlcnU6IFwiI0NEODUzRlwiLFxuICAgIGNob2NvbGF0ZTogXCIjRDI2OTFFXCIsXG4gICAgdGFuOiBcIiNEMkI0OENcIixcbiAgICBsaWdodGdyYXk6IFwiI0QzRDNEM1wiLFxuICAgIGxpZ2h0Z3JleTogXCIjRDNEM0QzXCIsXG4gICAgdGhpc3RsZTogXCIjRDhCRkQ4XCIsXG4gICAgb3JjaGlkOiBcIiNEQTcwRDZcIixcbiAgICBnb2xkZW5yb2Q6IFwiI0RBQTUyMFwiLFxuICAgIHBhbGV2aW9sZXRyZWQ6IFwiI0RCNzA5M1wiLFxuICAgIGNyaW1zb246IFwiI0RDMTQzQ1wiLFxuICAgIGdhaW5zYm9ybzogXCIjRENEQ0RDXCIsXG4gICAgcGx1bTogXCIjRERBMEREXCIsXG4gICAgYnVybHl3b29kOiBcIiNERUI4ODdcIixcbiAgICBsaWdodGN5YW46IFwiI0UwRkZGRlwiLFxuICAgIGxhdmVuZGVyOiBcIiNFNkU2RkFcIixcbiAgICBkYXJrc2FsbW9uOiBcIiNFOTk2N0FcIixcbiAgICB2aW9sZXQ6IFwiI0VFODJFRVwiLFxuICAgIHBhbGVnb2xkZW5yb2Q6IFwiI0VFRThBQVwiLFxuICAgIGxpZ2h0Y29yYWw6IFwiI0YwODA4MFwiLFxuICAgIGtoYWtpOiBcIiNGMEU2OENcIixcbiAgICBhbGljZWJsdWU6IFwiI0YwRjhGRlwiLFxuICAgIGhvbmV5ZGV3OiBcIiNGMEZGRjBcIixcbiAgICBhenVyZTogXCIjRjBGRkZGXCIsXG4gICAgc2FuZHlicm93bjogXCIjRjRBNDYwXCIsXG4gICAgd2hlYXQ6IFwiI0Y1REVCM1wiLFxuICAgIGJlaWdlOiBcIiNGNUY1RENcIixcbiAgICB3aGl0ZXNtb2tlOiBcIiNGNUY1RjVcIixcbiAgICBtaW50Y3JlYW06IFwiI0Y1RkZGQVwiLFxuICAgIGdob3N0d2hpdGU6IFwiI0Y4RjhGRlwiLFxuICAgIHNhbG1vbjogXCIjRkE4MDcyXCIsXG4gICAgYW50aXF1ZXdoaXRlOiBcIiNGQUVCRDdcIixcbiAgICBsaW5lbjogXCIjRkFGMEU2XCIsXG4gICAgbGlnaHRnb2xkZW5yb2R5ZWxsb3c6IFwiI0ZBRkFEMlwiLFxuICAgIG9sZGxhY2U6IFwiI0ZERjVFNlwiLFxuICAgIG1hZ2VudGE6IFwiI0ZGMDBGRlwiLFxuICAgIGRlZXBwaW5rOiBcIiNGRjE0OTNcIixcbiAgICBvcmFuZ2VyZWQ6IFwiI0ZGNDUwMFwiLFxuICAgIHRvbWF0bzogXCIjRkY2MzQ3XCIsXG4gICAgaG90cGluazogXCIjRkY2OUI0XCIsXG4gICAgY29yYWw6IFwiI0ZGN0Y1MFwiLFxuICAgIGRhcmtvcmFuZ2U6IFwiI0ZGOEMwMFwiLFxuICAgIGxpZ2h0c2FsbW9uOiBcIiNGRkEwN0FcIixcbiAgICBvcmFuZ2U6IFwiI0ZGQTUwMFwiLFxuICAgIGxpZ2h0cGluazogXCIjRkZCNkMxXCIsXG4gICAgcGluazogXCIjRkZDMENCXCIsXG4gICAgZ29sZDogXCIjRkZENzAwXCIsXG4gICAgcGVhY2hwdWZmOiBcIiNGRkRBQjlcIixcbiAgICBuYXZham93aGl0ZTogXCIjRkZERUFEXCIsXG4gICAgbW9jY2FzaW46IFwiI0ZGRTRCNVwiLFxuICAgIGJpc3F1ZTogXCIjRkZFNEM0XCIsXG4gICAgbWlzdHlyb3NlOiBcIiNGRkU0RTFcIixcbiAgICBibGFuY2hlZGFsbW9uZDogXCIjRkZFQkNEXCIsXG4gICAgcGFwYXlhd2hpcDogXCIjRkZFRkQ1XCIsXG4gICAgbGF2ZW5kZXJibHVzaDogXCIjRkZGMEY1XCIsXG4gICAgc2Vhc2hlbGw6IFwiI0ZGRjVFRVwiLFxuICAgIGNvcm5zaWxrOiBcIiNGRkY4RENcIixcbiAgICBsZW1vbmNoaWZmb246IFwiI0ZGRkFDRFwiLFxuICAgIGZsb3JhbHdoaXRlOiBcIiNGRkZBRjBcIixcbiAgICBzbm93OiBcIiNGRkZBRkFcIixcbiAgICBsaWdodHllbGxvdzogXCIjRkZGRkUwXCIsXG4gICAgaXZvcnk6IFwiI0ZGRkZGMFwiLFxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jdWJpY0luT3V0ID0gZXhwb3J0cy5jdWJpY091dCA9IGV4cG9ydHMuY3ViaWNJbiA9IGV4cG9ydHMucXVhZHJhdGljSW5PdXQgPSBleHBvcnRzLnF1YWRyYXRpY091dCA9IGV4cG9ydHMucXVhZHJhdGljSW4gPSBleHBvcnRzLmxpbmVhciA9IHZvaWQgMDtcbi8qKlxuICogU2lnbWEuanMgRWFzaW5nc1xuICogPT09PT09PT09PT09PT09PT1cbiAqXG4gKiBIYW5keSBjb2xsZWN0aW9uIG9mIGVhc2luZyBmdW5jdGlvbnMuXG4gKiBAbW9kdWxlXG4gKi9cbnZhciBsaW5lYXIgPSBmdW5jdGlvbiAoaykgeyByZXR1cm4gazsgfTtcbmV4cG9ydHMubGluZWFyID0gbGluZWFyO1xudmFyIHF1YWRyYXRpY0luID0gZnVuY3Rpb24gKGspIHsgcmV0dXJuIGsgKiBrOyB9O1xuZXhwb3J0cy5xdWFkcmF0aWNJbiA9IHF1YWRyYXRpY0luO1xudmFyIHF1YWRyYXRpY091dCA9IGZ1bmN0aW9uIChrKSB7IHJldHVybiBrICogKDIgLSBrKTsgfTtcbmV4cG9ydHMucXVhZHJhdGljT3V0ID0gcXVhZHJhdGljT3V0O1xudmFyIHF1YWRyYXRpY0luT3V0ID0gZnVuY3Rpb24gKGspIHtcbiAgICBpZiAoKGsgKj0gMikgPCAxKVxuICAgICAgICByZXR1cm4gMC41ICogayAqIGs7XG4gICAgcmV0dXJuIC0wLjUgKiAoLS1rICogKGsgLSAyKSAtIDEpO1xufTtcbmV4cG9ydHMucXVhZHJhdGljSW5PdXQgPSBxdWFkcmF0aWNJbk91dDtcbnZhciBjdWJpY0luID0gZnVuY3Rpb24gKGspIHsgcmV0dXJuIGsgKiBrICogazsgfTtcbmV4cG9ydHMuY3ViaWNJbiA9IGN1YmljSW47XG52YXIgY3ViaWNPdXQgPSBmdW5jdGlvbiAoaykgeyByZXR1cm4gLS1rICogayAqIGsgKyAxOyB9O1xuZXhwb3J0cy5jdWJpY091dCA9IGN1YmljT3V0O1xudmFyIGN1YmljSW5PdXQgPSBmdW5jdGlvbiAoaykge1xuICAgIGlmICgoayAqPSAyKSA8IDEpXG4gICAgICAgIHJldHVybiAwLjUgKiBrICogayAqIGs7XG4gICAgcmV0dXJuIDAuNSAqICgoayAtPSAyKSAqIGsgKiBrICsgMik7XG59O1xuZXhwb3J0cy5jdWJpY0luT3V0ID0gY3ViaWNJbk91dDtcbnZhciBlYXNpbmdzID0ge1xuICAgIGxpbmVhcjogZXhwb3J0cy5saW5lYXIsXG4gICAgcXVhZHJhdGljSW46IGV4cG9ydHMucXVhZHJhdGljSW4sXG4gICAgcXVhZHJhdGljT3V0OiBleHBvcnRzLnF1YWRyYXRpY091dCxcbiAgICBxdWFkcmF0aWNJbk91dDogZXhwb3J0cy5xdWFkcmF0aWNJbk91dCxcbiAgICBjdWJpY0luOiBleHBvcnRzLmN1YmljSW4sXG4gICAgY3ViaWNPdXQ6IGV4cG9ydHMuY3ViaWNPdXQsXG4gICAgY3ViaWNJbk91dDogZXhwb3J0cy5jdWJpY0luT3V0LFxufTtcbmV4cG9ydHMuZGVmYXVsdCA9IGVhc2luZ3M7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZG9FZGdlQ29sbGlkZVdpdGhQb2ludCA9IGV4cG9ydHMuaXNQaXhlbENvbG9yZWQgPSB2b2lkIDA7XG4vKipcbiAqIFRoaXMgaGVscGVyIHJldHVybnMgdHJ1ZSBpcyB0aGUgcGl4ZWwgYXQgKHgseSkgaW4gdGhlIGdpdmVuIFdlYkdMIGNvbnRleHQgaXNcbiAqIGNvbG9yZWQsIGFuZCBmYWxzZSBlbHNlLlxuICovXG5mdW5jdGlvbiBpc1BpeGVsQ29sb3JlZChnbCwgeCwgeSkge1xuICAgIHZhciBwaXhlbHMgPSBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbC5yZWFkUGl4ZWxzKHgsIGdsLmRyYXdpbmdCdWZmZXJIZWlnaHQgLSB5LCAxLCAxLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBwaXhlbHMpO1xuICAgIHJldHVybiBwaXhlbHNbM10gPiAwO1xufVxuZXhwb3J0cy5pc1BpeGVsQ29sb3JlZCA9IGlzUGl4ZWxDb2xvcmVkO1xuLyoqXG4gKiBUaGlzIGhlbHBlciBjaGVja3Mgd2hldGhlciBvciBub3QgYSBwb2ludCAoeCwgeSkgY29sbGlkZXMgd2l0aCBhblxuICogZWRnZSwgY29ubmVjdGluZyBhIHNvdXJjZSAoeFMsIHlTKSB0byBhIHRhcmdldCAoeFQsIHlUKSB3aXRoIGEgdGhpY2tuZXNzIGluXG4gKiBwaXhlbHMuXG4gKi9cbmZ1bmN0aW9uIGRvRWRnZUNvbGxpZGVXaXRoUG9pbnQoeCwgeSwgeFMsIHlTLCB4VCwgeVQsIHRoaWNrbmVzcykge1xuICAgIC8vIENoZWNrIGZpcnN0IGlmIHBvaW50IGlzIG91dCBvZiB0aGUgcmVjdGFuZ2xlIHdoaWNoIG9wcG9zaXRlIGNvcm5lcnMgYXJlIHRoZVxuICAgIC8vIHNvdXJjZSBhbmQgdGhlIHRhcmdldCwgcmVjdGFuZ2xlIHdlIGV4cGFuZCBieSBgdGhpY2tuZXNzYCBpbiBldmVyeVxuICAgIC8vIGRpcmVjdGlvbnM6XG4gICAgaWYgKHggPCB4UyAtIHRoaWNrbmVzcyAmJiB4IDwgeFQgLSB0aGlja25lc3MpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICBpZiAoeSA8IHlTIC0gdGhpY2tuZXNzICYmIHkgPCB5VCAtIHRoaWNrbmVzcylcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh4ID4geFMgKyB0aGlja25lc3MgJiYgeCA+IHhUICsgdGhpY2tuZXNzKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHkgPiB5UyArIHRoaWNrbmVzcyAmJiB5ID4geVQgKyB0aGlja25lc3MpXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyBDaGVjayBhY3R1YWwgY29sbGlzaW9uIG5vdzogU2luY2Ugd2Ugbm93IHRoZSBwb2ludCBpcyBpbiB0aGlzIGJpZyByZWN0YW5nbGVcbiAgICAvLyB3ZSBcImp1c3RcIiBuZWVkIHRvIGNoZWNrIHRoYXQgdGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHBvaW50IGFuZCB0aGUgbGluZVxuICAgIC8vIGNvbm5lY3RpbmcgdGhlIHNvdXJjZSBhbmQgdGhlIHRhcmdldCBpcyBsZXNzIHRoYW4gYHRoaWNrbmVzc2A6XG4gICAgLy8gaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvRGlzdGFuY2VfZnJvbV9hX3BvaW50X3RvX2FfbGluZVxuICAgIHZhciBkaXN0YW5jZSA9IE1hdGguYWJzKCh4VCAtIHhTKSAqICh5UyAtIHkpIC0gKHhTIC0geCkgKiAoeVQgLSB5UykpIC8gTWF0aC5zcXJ0KE1hdGgucG93KHhUIC0geFMsIDIpICsgTWF0aC5wb3coeVQgLSB5UywgMikpO1xuICAgIHJldHVybiBkaXN0YW5jZSA8IHRoaWNrbmVzcyAvIDI7XG59XG5leHBvcnRzLmRvRWRnZUNvbGxpZGVXaXRoUG9pbnQgPSBkb0VkZ2VDb2xsaWRlV2l0aFBvaW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19yZWFkID0gKHRoaXMgJiYgdGhpcy5fX3JlYWQpIHx8IGZ1bmN0aW9uIChvLCBuKSB7XG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xuICAgIGlmICghbSkgcmV0dXJuIG87XG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XG4gICAgdHJ5IHtcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxuICAgIGZpbmFsbHkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XG4gICAgfVxuICAgIHJldHVybiBhcjtcbn07XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnZhbGlkYXRlR3JhcGggPSBleHBvcnRzLmNhblVzZTMyQml0c0luZGljZXMgPSBleHBvcnRzLmV4dHJhY3RQaXhlbCA9IGV4cG9ydHMuZ2V0TWF0cml4SW1wYWN0ID0gZXhwb3J0cy5tYXRyaXhGcm9tQ2FtZXJhID0gZXhwb3J0cy5nZXRDb3JyZWN0aW9uUmF0aW8gPSBleHBvcnRzLmZsb2F0Q29sb3IgPSBleHBvcnRzLmZsb2F0QXJyYXlDb2xvciA9IGV4cG9ydHMucGFyc2VDb2xvciA9IGV4cG9ydHMuekluZGV4T3JkZXJpbmcgPSBleHBvcnRzLmNyZWF0ZU5vcm1hbGl6YXRpb25GdW5jdGlvbiA9IGV4cG9ydHMuZ3JhcGhFeHRlbnQgPSBleHBvcnRzLmdldFBpeGVsUmF0aW8gPSBleHBvcnRzLmNyZWF0ZUVsZW1lbnQgPSBleHBvcnRzLmNhbmNlbEZyYW1lID0gZXhwb3J0cy5yZXF1ZXN0RnJhbWUgPSBleHBvcnRzLmFzc2lnbkRlZXAgPSBleHBvcnRzLmFzc2lnbiA9IGV4cG9ydHMuaXNQbGFpbk9iamVjdCA9IHZvaWQgMDtcbnZhciBpc19ncmFwaF8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCJncmFwaG9sb2d5LXV0aWxzL2lzLWdyYXBoXCIpKTtcbnZhciBtYXRyaWNlc18xID0gcmVxdWlyZShcIi4vbWF0cmljZXNcIik7XG52YXIgZGF0YV8xID0gcmVxdWlyZShcIi4vZGF0YVwiKTtcbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIHZhbHVlIGlzIGEgcGxhaW4gb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAge21peGVkfSAgIHZhbHVlIC0gVGFyZ2V0IHZhbHVlLlxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnksIEB0eXBlc2NyaXB0LWVzbGludC9leHBsaWNpdC1tb2R1bGUtYm91bmRhcnktdHlwZXNcbmZ1bmN0aW9uIGlzUGxhaW5PYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmIHZhbHVlICE9PSBudWxsICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3Q7XG59XG5leHBvcnRzLmlzUGxhaW5PYmplY3QgPSBpc1BsYWluT2JqZWN0O1xuLyoqXG4gKiBIZWxwZXIgdG8gdXNlIE9iamVjdC5hc3NpZ24gd2l0aCBtb3JlIHRoYW4gdHdvIG9iamVjdHMuXG4gKlxuICogQHBhcmFtICB7b2JqZWN0fSB0YXJnZXQgICAgICAgLSBGaXJzdCBvYmplY3QuXG4gKiBAcGFyYW0gIHtvYmplY3R9IFsuLi5vYmplY3RzXSAtIE9iamVjdHMgdG8gbWVyZ2UuXG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGFzc2lnbih0YXJnZXQpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIG9iamVjdHNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIHRhcmdldCA9IHRhcmdldCB8fCB7fTtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IG9iamVjdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHZhciBvID0gb2JqZWN0c1tpXTtcbiAgICAgICAgaWYgKCFvKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBvKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmV4cG9ydHMuYXNzaWduID0gYXNzaWduO1xuLyoqXG4gKiBWZXJ5IHNpbXBsZSByZWN1cnNpdmUgT2JqZWN0LmFzc2lnbi1saWtlIGZ1bmN0aW9uLlxuICpcbiAqIEBwYXJhbSAge29iamVjdH0gdGFyZ2V0ICAgICAgIC0gRmlyc3Qgb2JqZWN0LlxuICogQHBhcmFtICB7b2JqZWN0fSBbLi4ub2JqZWN0c10gLSBPYmplY3RzIHRvIG1lcmdlLlxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5mdW5jdGlvbiBhc3NpZ25EZWVwKHRhcmdldCkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgb2JqZWN0c1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgdGFyZ2V0ID0gdGFyZ2V0IHx8IHt9O1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gb2JqZWN0cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIG8gPSBvYmplY3RzW2ldO1xuICAgICAgICBpZiAoIW8pXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChvW2tdKSkge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrXSA9IGFzc2lnbkRlZXAodGFyZ2V0W2tdLCBvW2tdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRhcmdldFtrXSA9IG9ba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldDtcbn1cbmV4cG9ydHMuYXNzaWduRGVlcCA9IGFzc2lnbkRlZXA7XG4vKipcbiAqIEp1c3Qgc29tZSBkaXJ0eSB0cmljayB0byBtYWtlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBhbmQgY2FuY2VsQW5pbWF0aW9uRnJhbWUgXCJ3b3JrXCIgaW4gTm9kZS5qcywgZm9yIHVuaXQgdGVzdHM6XG4gKi9cbmV4cG9ydHMucmVxdWVzdEZyYW1lID0gdHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgID8gZnVuY3Rpb24gKGNhbGxiYWNrKSB7IHJldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spOyB9XG4gICAgOiBmdW5jdGlvbiAoY2FsbGJhY2spIHsgcmV0dXJuIHNldFRpbWVvdXQoY2FsbGJhY2ssIDApOyB9O1xuZXhwb3J0cy5jYW5jZWxGcmFtZSA9IHR5cGVvZiBjYW5jZWxBbmltYXRpb25GcmFtZSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgID8gZnVuY3Rpb24gKHJlcXVlc3RJRCkgeyByZXR1cm4gY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVxdWVzdElEKTsgfVxuICAgIDogZnVuY3Rpb24gKHJlcXVlc3RJRCkgeyByZXR1cm4gY2xlYXJUaW1lb3V0KHJlcXVlc3RJRCk7IH07XG4vKipcbiAqIEZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIERPTSBlbGVtZW50cyBlYXNpbHkuXG4gKlxuICogQHBhcmFtICB7c3RyaW5nfSB0YWcgICAgICAgIC0gVGFnIG5hbWUgb2YgdGhlIGVsZW1lbnQgdG8gY3JlYXRlLlxuICogQHBhcmFtICB7b2JqZWN0fSBzdHlsZSAgICAgIC0gU3R5bGVzIG1hcC5cbiAqIEBwYXJhbSAge29iamVjdH0gYXR0cmlidXRlcyAtIEF0dHJpYnV0ZXMgbWFwLlxuICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodGFnLCBzdHlsZSwgYXR0cmlidXRlcykge1xuICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICAgIGlmIChzdHlsZSkge1xuICAgICAgICBmb3IgKHZhciBrIGluIHN0eWxlKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlW2tdID0gc3R5bGVba107XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgZm9yICh2YXIgayBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrLCBhdHRyaWJ1dGVzW2tdKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZWxlbWVudDtcbn1cbmV4cG9ydHMuY3JlYXRlRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQ7XG4vKipcbiAqIEZ1bmN0aW9uIHJldHVybmluZyB0aGUgYnJvd3NlcidzIHBpeGVsIHJhdGlvLlxuICpcbiAqIEByZXR1cm4ge251bWJlcn1cbiAqL1xuZnVuY3Rpb24gZ2V0UGl4ZWxSYXRpbygpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICE9PSBcInVuZGVmaW5lZFwiKVxuICAgICAgICByZXR1cm4gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgcmV0dXJuIDE7XG59XG5leHBvcnRzLmdldFBpeGVsUmF0aW8gPSBnZXRQaXhlbFJhdGlvO1xuLyoqXG4gKiBGdW5jdGlvbiByZXR1cm5pbmcgdGhlIGdyYXBoJ3Mgbm9kZSBleHRlbnQgaW4geCAmIHkuXG4gKlxuICogQHBhcmFtICB7R3JhcGh9XG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGdyYXBoRXh0ZW50KGdyYXBoKSB7XG4gICAgaWYgKCFncmFwaC5vcmRlcilcbiAgICAgICAgcmV0dXJuIHsgeDogWzAsIDFdLCB5OiBbMCwgMV0gfTtcbiAgICB2YXIgeE1pbiA9IEluZmluaXR5O1xuICAgIHZhciB4TWF4ID0gLUluZmluaXR5O1xuICAgIHZhciB5TWluID0gSW5maW5pdHk7XG4gICAgdmFyIHlNYXggPSAtSW5maW5pdHk7XG4gICAgZ3JhcGguZm9yRWFjaE5vZGUoZnVuY3Rpb24gKF8sIGF0dHIpIHtcbiAgICAgICAgdmFyIHggPSBhdHRyLngsIHkgPSBhdHRyLnk7XG4gICAgICAgIGlmICh4IDwgeE1pbilcbiAgICAgICAgICAgIHhNaW4gPSB4O1xuICAgICAgICBpZiAoeCA+IHhNYXgpXG4gICAgICAgICAgICB4TWF4ID0geDtcbiAgICAgICAgaWYgKHkgPCB5TWluKVxuICAgICAgICAgICAgeU1pbiA9IHk7XG4gICAgICAgIGlmICh5ID4geU1heClcbiAgICAgICAgICAgIHlNYXggPSB5O1xuICAgIH0pO1xuICAgIHJldHVybiB7IHg6IFt4TWluLCB4TWF4XSwgeTogW3lNaW4sIHlNYXhdIH07XG59XG5leHBvcnRzLmdyYXBoRXh0ZW50ID0gZ3JhcGhFeHRlbnQ7XG5mdW5jdGlvbiBjcmVhdGVOb3JtYWxpemF0aW9uRnVuY3Rpb24oZXh0ZW50KSB7XG4gICAgdmFyIF9hID0gX19yZWFkKGV4dGVudC54LCAyKSwgbWluWCA9IF9hWzBdLCBtYXhYID0gX2FbMV0sIF9iID0gX19yZWFkKGV4dGVudC55LCAyKSwgbWluWSA9IF9iWzBdLCBtYXhZID0gX2JbMV07XG4gICAgdmFyIHJhdGlvID0gTWF0aC5tYXgobWF4WCAtIG1pblgsIG1heFkgLSBtaW5ZKSwgZFggPSAobWF4WCArIG1pblgpIC8gMiwgZFkgPSAobWF4WSArIG1pblkpIC8gMjtcbiAgICBpZiAocmF0aW8gPT09IDAgfHwgTWF0aC5hYnMocmF0aW8pID09PSBJbmZpbml0eSB8fCBpc05hTihyYXRpbykpXG4gICAgICAgIHJhdGlvID0gMTtcbiAgICBpZiAoaXNOYU4oZFgpKVxuICAgICAgICBkWCA9IDA7XG4gICAgaWYgKGlzTmFOKGRZKSlcbiAgICAgICAgZFkgPSAwO1xuICAgIHZhciBmbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB4OiAwLjUgKyAoZGF0YS54IC0gZFgpIC8gcmF0aW8sXG4gICAgICAgICAgICB5OiAwLjUgKyAoZGF0YS55IC0gZFkpIC8gcmF0aW8sXG4gICAgICAgIH07XG4gICAgfTtcbiAgICAvLyBUT0RPOiBwb3NzaWJpbGl0eSB0byBhcHBseSB0aGlzIGluIGJhdGNoIG92ZXIgYXJyYXkgb2YgaW5kaWNlc1xuICAgIGZuLmFwcGx5VG8gPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBkYXRhLnggPSAwLjUgKyAoZGF0YS54IC0gZFgpIC8gcmF0aW87XG4gICAgICAgIGRhdGEueSA9IDAuNSArIChkYXRhLnkgLSBkWSkgLyByYXRpbztcbiAgICB9O1xuICAgIGZuLmludmVyc2UgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgeDogZFggKyByYXRpbyAqIChkYXRhLnggLSAwLjUpLFxuICAgICAgICAgICAgeTogZFkgKyByYXRpbyAqIChkYXRhLnkgLSAwLjUpLFxuICAgICAgICB9O1xuICAgIH07XG4gICAgZm4ucmF0aW8gPSByYXRpbztcbiAgICByZXR1cm4gZm47XG59XG5leHBvcnRzLmNyZWF0ZU5vcm1hbGl6YXRpb25GdW5jdGlvbiA9IGNyZWF0ZU5vcm1hbGl6YXRpb25GdW5jdGlvbjtcbi8qKlxuICogRnVuY3Rpb24gb3JkZXJpbmcgdGhlIGdpdmVuIGVsZW1lbnRzIGluIHJldmVyc2Ugei1vcmRlciBzbyB0aGV5IGRyYXduXG4gKiB0aGUgY29ycmVjdCB3YXkuXG4gKlxuICogQHBhcmFtICB7bnVtYmVyfSAgIGV4dGVudCAgIC0gW21pbiwgbWF4XSB6IHZhbHVlcy5cbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBnZXR0ZXIgICAtIFogYXR0cmlidXRlIGdldHRlciBmdW5jdGlvbi5cbiAqIEBwYXJhbSAge2FycmF5fSAgICBlbGVtZW50cyAtIFRoZSBhcnJheSB0byBzb3J0LlxuICogQHJldHVybiB7YXJyYXl9IC0gVGhlIHNvcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gekluZGV4T3JkZXJpbmcoZXh0ZW50LCBnZXR0ZXIsIGVsZW1lbnRzKSB7XG4gICAgLy8gSWYgayBpcyA+IG4sIHdlJ2xsIHVzZSBhIHN0YW5kYXJkIHNvcnRcbiAgICByZXR1cm4gZWxlbWVudHMuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICB2YXIgekEgPSBnZXR0ZXIoYSkgfHwgMCwgekIgPSBnZXR0ZXIoYikgfHwgMDtcbiAgICAgICAgaWYgKHpBIDwgekIpXG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIGlmICh6QSA+IHpCKVxuICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgIHJldHVybiAwO1xuICAgIH0pO1xuICAgIC8vIFRPRE86IGNvdW50aW5nIHNvcnQgb3B0aW1pemF0aW9uXG59XG5leHBvcnRzLnpJbmRleE9yZGVyaW5nID0gekluZGV4T3JkZXJpbmc7XG4vKipcbiAqIFdlYkdMIHV0aWxzXG4gKiA9PT09PT09PT09PVxuICovXG4vKipcbiAqIE1lbW9pemVkIGZ1bmN0aW9uIHJldHVybmluZyBhIGZsb2F0LWVuY29kZWQgY29sb3IgZnJvbSB2YXJpb3VzIHN0cmluZ1xuICogZm9ybWF0cyBkZXNjcmliaW5nIGNvbG9ycy5cbiAqL1xudmFyIElOVDggPSBuZXcgSW50OEFycmF5KDQpO1xudmFyIElOVDMyID0gbmV3IEludDMyQXJyYXkoSU5UOC5idWZmZXIsIDAsIDEpO1xudmFyIEZMT0FUMzIgPSBuZXcgRmxvYXQzMkFycmF5KElOVDguYnVmZmVyLCAwLCAxKTtcbnZhciBSR0JBX1RFU1RfUkVHRVggPSAvXlxccypyZ2JhP1xccypcXCgvO1xudmFyIFJHQkFfRVhUUkFDVF9SRUdFWCA9IC9eXFxzKnJnYmE/XFxzKlxcKFxccyooWzAtOV0qKVxccyosXFxzKihbMC05XSopXFxzKixcXHMqKFswLTldKikoPzpcXHMqLFxccyooLiopPyk/XFwpXFxzKiQvO1xuZnVuY3Rpb24gcGFyc2VDb2xvcih2YWwpIHtcbiAgICB2YXIgciA9IDA7IC8vIGJ5dGVcbiAgICB2YXIgZyA9IDA7IC8vIGJ5dGVcbiAgICB2YXIgYiA9IDA7IC8vIGJ5dGVcbiAgICB2YXIgYSA9IDE7IC8vIGZsb2F0XG4gICAgLy8gSGFuZGxpbmcgaGV4YWRlY2ltYWwgbm90YXRpb25cbiAgICBpZiAodmFsWzBdID09PSBcIiNcIikge1xuICAgICAgICBpZiAodmFsLmxlbmd0aCA9PT0gNCkge1xuICAgICAgICAgICAgciA9IHBhcnNlSW50KHZhbC5jaGFyQXQoMSkgKyB2YWwuY2hhckF0KDEpLCAxNik7XG4gICAgICAgICAgICBnID0gcGFyc2VJbnQodmFsLmNoYXJBdCgyKSArIHZhbC5jaGFyQXQoMiksIDE2KTtcbiAgICAgICAgICAgIGIgPSBwYXJzZUludCh2YWwuY2hhckF0KDMpICsgdmFsLmNoYXJBdCgzKSwgMTYpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgciA9IHBhcnNlSW50KHZhbC5jaGFyQXQoMSkgKyB2YWwuY2hhckF0KDIpLCAxNik7XG4gICAgICAgICAgICBnID0gcGFyc2VJbnQodmFsLmNoYXJBdCgzKSArIHZhbC5jaGFyQXQoNCksIDE2KTtcbiAgICAgICAgICAgIGIgPSBwYXJzZUludCh2YWwuY2hhckF0KDUpICsgdmFsLmNoYXJBdCg2KSwgMTYpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWwubGVuZ3RoID09PSA5KSB7XG4gICAgICAgICAgICBhID0gcGFyc2VJbnQodmFsLmNoYXJBdCg3KSArIHZhbC5jaGFyQXQoOCksIDE2KSAvIDI1NTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBIYW5kbGluZyByZ2Igbm90YXRpb25cbiAgICBlbHNlIGlmIChSR0JBX1RFU1RfUkVHRVgudGVzdCh2YWwpKSB7XG4gICAgICAgIHZhciBtYXRjaCA9IHZhbC5tYXRjaChSR0JBX0VYVFJBQ1RfUkVHRVgpO1xuICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgIHIgPSArbWF0Y2hbMV07XG4gICAgICAgICAgICBnID0gK21hdGNoWzJdO1xuICAgICAgICAgICAgYiA9ICttYXRjaFszXTtcbiAgICAgICAgICAgIGlmIChtYXRjaFs0XSlcbiAgICAgICAgICAgICAgICBhID0gK21hdGNoWzRdO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IHI6IHIsIGc6IGcsIGI6IGIsIGE6IGEgfTtcbn1cbmV4cG9ydHMucGFyc2VDb2xvciA9IHBhcnNlQ29sb3I7XG52YXIgRkxPQVRfQ09MT1JfQ0FDSEUgPSB7fTtcbmZvciAodmFyIGh0bWxDb2xvciBpbiBkYXRhXzEuSFRNTF9DT0xPUlMpIHtcbiAgICBGTE9BVF9DT0xPUl9DQUNIRVtodG1sQ29sb3JdID0gZmxvYXRDb2xvcihkYXRhXzEuSFRNTF9DT0xPUlNbaHRtbENvbG9yXSk7XG4gICAgLy8gUmVwbGljYXRpbmcgY2FjaGUgZm9yIGhleCB2YWx1ZXMgZm9yIGZyZWVcbiAgICBGTE9BVF9DT0xPUl9DQUNIRVtkYXRhXzEuSFRNTF9DT0xPUlNbaHRtbENvbG9yXV0gPSBGTE9BVF9DT0xPUl9DQUNIRVtodG1sQ29sb3JdO1xufVxuZnVuY3Rpb24gZmxvYXRBcnJheUNvbG9yKHZhbCkge1xuICAgIHZhbCA9IGRhdGFfMS5IVE1MX0NPTE9SU1t2YWxdIHx8IHZhbDtcbiAgICAvLyBOT1RFOiB0aGlzIHZhcmlhbnQgaXMgbm90IGNhY2hlZCBiZWNhdXNlIGl0IGlzIG1vc3RseSB1c2VkIGZvciB1bmlmb3Jtc1xuICAgIHZhciBfYSA9IHBhcnNlQ29sb3IodmFsKSwgciA9IF9hLnIsIGcgPSBfYS5nLCBiID0gX2EuYiwgYSA9IF9hLmE7XG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3IgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUsIGFdKTtcbn1cbmV4cG9ydHMuZmxvYXRBcnJheUNvbG9yID0gZmxvYXRBcnJheUNvbG9yO1xuZnVuY3Rpb24gZmxvYXRDb2xvcih2YWwpIHtcbiAgICAvLyBJZiB0aGUgY29sb3IgaXMgYWxyZWFkeSBjb21wdXRlZCwgd2UgeWllbGQgaXRcbiAgICBpZiAodHlwZW9mIEZMT0FUX0NPTE9SX0NBQ0hFW3ZhbF0gIT09IFwidW5kZWZpbmVkXCIpXG4gICAgICAgIHJldHVybiBGTE9BVF9DT0xPUl9DQUNIRVt2YWxdO1xuICAgIHZhciBwYXJzZWQgPSBwYXJzZUNvbG9yKHZhbCk7XG4gICAgdmFyIHIgPSBwYXJzZWQuciwgZyA9IHBhcnNlZC5nLCBiID0gcGFyc2VkLmI7XG4gICAgdmFyIGEgPSBwYXJzZWQuYTtcbiAgICBhID0gKGEgKiAyNTUpIHwgMDtcbiAgICBJTlQzMlswXSA9ICgoYSA8PCAyNCkgfCAoYiA8PCAxNikgfCAoZyA8PCA4KSB8IHIpICYgMHhmZWZmZmZmZjtcbiAgICB2YXIgY29sb3IgPSBGTE9BVDMyWzBdO1xuICAgIEZMT0FUX0NPTE9SX0NBQ0hFW3ZhbF0gPSBjb2xvcjtcbiAgICByZXR1cm4gY29sb3I7XG59XG5leHBvcnRzLmZsb2F0Q29sb3IgPSBmbG9hdENvbG9yO1xuLyoqXG4gKiBJbiBzaWdtYSwgdGhlIGdyYXBoIGlzIG5vcm1hbGl6ZWQgaW50byBhIFswLCAxXSwgWzAsIDFdIHNxdWFyZSwgYmVmb3JlIGJlaW5nIGdpdmVuIHRvIHRoZSB2YXJpb3VzIHJlbmRlcmVycy4gVGhpc1xuICogaGVscHMgZGVhbGluZyB3aXRoIHF1YWR0cmVlIGluIHBhcnRpY3VsYXIuXG4gKiBCdXQgYXQgc29tZSBwb2ludCwgd2UgbmVlZCB0byByZXNjYWxlIGl0IHNvIHRoYXQgaXQgdGFrZXMgdGhlIGJlc3QgcGxhY2UgaW4gdGhlIHNjcmVlbiwgaWUuIHdlIGFsd2F5cyB3YW50IHRvIHNlZSB0d29cbiAqIG5vZGVzIFwidG91Y2hpbmdcIiBvcHBvc2l0ZSBzaWRlcyBvZiB0aGUgZ3JhcGgsIHdpdGggdGhlIGNhbWVyYSBiZWluZyBhdCBpdHMgZGVmYXVsdCBzdGF0ZS5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIGRldGVybWluZXMgdGhpcyByYXRpby5cbiAqL1xuZnVuY3Rpb24gZ2V0Q29ycmVjdGlvblJhdGlvKHZpZXdwb3J0RGltZW5zaW9ucywgZ3JhcGhEaW1lbnNpb25zKSB7XG4gICAgdmFyIHZpZXdwb3J0UmF0aW8gPSB2aWV3cG9ydERpbWVuc2lvbnMuaGVpZ2h0IC8gdmlld3BvcnREaW1lbnNpb25zLndpZHRoO1xuICAgIHZhciBncmFwaFJhdGlvID0gZ3JhcGhEaW1lbnNpb25zLmhlaWdodCAvIGdyYXBoRGltZW5zaW9ucy53aWR0aDtcbiAgICAvLyBJZiB0aGUgc3RhZ2UgYW5kIHRoZSBncmFwaHMgYXJlIGluIGRpZmZlcmVudCBkaXJlY3Rpb25zIChzdWNoIGFzIHRoZSBncmFwaCBiZWluZyB3aWRlciB0aGF0IHRhbGwgd2hpbGUgdGhlIHN0YWdlXG4gICAgLy8gaXMgdGFsbGVyIHRoYW4gd2lkZSksIHdlIGNhbiBzdG9wIGhlcmUgdG8gaGF2ZSBpbmRlZWQgbm9kZXMgdG91Y2hpbmcgb3Bwb3NpdGUgc2lkZXM6XG4gICAgaWYgKCh2aWV3cG9ydFJhdGlvIDwgMSAmJiBncmFwaFJhdGlvID4gMSkgfHwgKHZpZXdwb3J0UmF0aW8gPiAxICYmIGdyYXBoUmF0aW8gPCAxKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICB9XG4gICAgLy8gRWxzZSwgd2UgbmVlZCB0byBmaXQgdGhlIGdyYXBoIGluc2lkZSB0aGUgc3RhZ2U6XG4gICAgLy8gMS4gSWYgdGhlIGdyYXBoIGlzIFwic3F1YXJlclwiIChpZS4gd2l0aCBhIHJhdGlvIGNsb3NlciB0byAxKSwgd2UgbmVlZCB0byBtYWtlIHRoZSBsYXJnZXN0IHNpZGVzIHRvdWNoO1xuICAgIC8vIDIuIElmIHRoZSBzdGFnZSBpcyBcInNxdWFyZXJcIiwgd2UgbmVlZCB0byBtYWtlIHRoZSBzbWFsbGVzdCBzaWRlcyB0b3VjaC5cbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgoZ3JhcGhSYXRpbywgMSAvIGdyYXBoUmF0aW8pLCBNYXRoLm1heCgxIC8gdmlld3BvcnRSYXRpbywgdmlld3BvcnRSYXRpbykpO1xufVxuZXhwb3J0cy5nZXRDb3JyZWN0aW9uUmF0aW8gPSBnZXRDb3JyZWN0aW9uUmF0aW87XG4vKipcbiAqIEZ1bmN0aW9uIHJldHVybmluZyBhIG1hdHJpeCBmcm9tIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBjYW1lcmEuXG4gKi9cbi8vIFRPRE86IGl0J3MgcG9zc2libGUgdG8gb3B0aW1pemUgdGhpcyBkcmFzdGljYWxseSFcbmZ1bmN0aW9uIG1hdHJpeEZyb21DYW1lcmEoc3RhdGUsIHZpZXdwb3J0RGltZW5zaW9ucywgZ3JhcGhEaW1lbnNpb25zLCBwYWRkaW5nLCBpbnZlcnNlKSB7XG4gICAgdmFyIGFuZ2xlID0gc3RhdGUuYW5nbGUsIHJhdGlvID0gc3RhdGUucmF0aW8sIHggPSBzdGF0ZS54LCB5ID0gc3RhdGUueTtcbiAgICB2YXIgd2lkdGggPSB2aWV3cG9ydERpbWVuc2lvbnMud2lkdGgsIGhlaWdodCA9IHZpZXdwb3J0RGltZW5zaW9ucy5oZWlnaHQ7XG4gICAgdmFyIG1hdHJpeCA9ICgwLCBtYXRyaWNlc18xLmlkZW50aXR5KSgpO1xuICAgIHZhciBzbWFsbGVzdERpbWVuc2lvbiA9IE1hdGgubWluKHdpZHRoLCBoZWlnaHQpIC0gMiAqIHBhZGRpbmc7XG4gICAgdmFyIGNvcnJlY3Rpb25SYXRpbyA9IGdldENvcnJlY3Rpb25SYXRpbyh2aWV3cG9ydERpbWVuc2lvbnMsIGdyYXBoRGltZW5zaW9ucyk7XG4gICAgaWYgKCFpbnZlcnNlKSB7XG4gICAgICAgICgwLCBtYXRyaWNlc18xLm11bHRpcGx5KShtYXRyaXgsICgwLCBtYXRyaWNlc18xLnNjYWxlKSgoMCwgbWF0cmljZXNfMS5pZGVudGl0eSkoKSwgMiAqIChzbWFsbGVzdERpbWVuc2lvbiAvIHdpZHRoKSAqIGNvcnJlY3Rpb25SYXRpbywgMiAqIChzbWFsbGVzdERpbWVuc2lvbiAvIGhlaWdodCkgKiBjb3JyZWN0aW9uUmF0aW8pKTtcbiAgICAgICAgKDAsIG1hdHJpY2VzXzEubXVsdGlwbHkpKG1hdHJpeCwgKDAsIG1hdHJpY2VzXzEucm90YXRlKSgoMCwgbWF0cmljZXNfMS5pZGVudGl0eSkoKSwgLWFuZ2xlKSk7XG4gICAgICAgICgwLCBtYXRyaWNlc18xLm11bHRpcGx5KShtYXRyaXgsICgwLCBtYXRyaWNlc18xLnNjYWxlKSgoMCwgbWF0cmljZXNfMS5pZGVudGl0eSkoKSwgMSAvIHJhdGlvKSk7XG4gICAgICAgICgwLCBtYXRyaWNlc18xLm11bHRpcGx5KShtYXRyaXgsICgwLCBtYXRyaWNlc18xLnRyYW5zbGF0ZSkoKDAsIG1hdHJpY2VzXzEuaWRlbnRpdHkpKCksIC14LCAteSkpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgKDAsIG1hdHJpY2VzXzEubXVsdGlwbHkpKG1hdHJpeCwgKDAsIG1hdHJpY2VzXzEudHJhbnNsYXRlKSgoMCwgbWF0cmljZXNfMS5pZGVudGl0eSkoKSwgeCwgeSkpO1xuICAgICAgICAoMCwgbWF0cmljZXNfMS5tdWx0aXBseSkobWF0cml4LCAoMCwgbWF0cmljZXNfMS5zY2FsZSkoKDAsIG1hdHJpY2VzXzEuaWRlbnRpdHkpKCksIHJhdGlvKSk7XG4gICAgICAgICgwLCBtYXRyaWNlc18xLm11bHRpcGx5KShtYXRyaXgsICgwLCBtYXRyaWNlc18xLnJvdGF0ZSkoKDAsIG1hdHJpY2VzXzEuaWRlbnRpdHkpKCksIGFuZ2xlKSk7XG4gICAgICAgICgwLCBtYXRyaWNlc18xLm11bHRpcGx5KShtYXRyaXgsICgwLCBtYXRyaWNlc18xLnNjYWxlKSgoMCwgbWF0cmljZXNfMS5pZGVudGl0eSkoKSwgd2lkdGggLyBzbWFsbGVzdERpbWVuc2lvbiAvIDIgLyBjb3JyZWN0aW9uUmF0aW8sIGhlaWdodCAvIHNtYWxsZXN0RGltZW5zaW9uIC8gMiAvIGNvcnJlY3Rpb25SYXRpbykpO1xuICAgIH1cbiAgICByZXR1cm4gbWF0cml4O1xufVxuZXhwb3J0cy5tYXRyaXhGcm9tQ2FtZXJhID0gbWF0cml4RnJvbUNhbWVyYTtcbi8qKlxuICogQWxsIHRoZXNlIHRyYW5zZm9ybWF0aW9ucyB3ZSBhcHBseSBvbiB0aGUgbWF0cml4IHRvIGdldCBpdCByZXNjYWxlIHRoZSBncmFwaFxuICogYXMgd2Ugd2FudCBtYWtlIGl0IHZlcnkgaGFyZCB0byBnZXQgcGl4ZWwtcGVyZmVjdCBkaXN0YW5jZXMgaW4gV2ViR0wuIFRoaXNcbiAqIGZ1bmN0aW9uIHJldHVybnMgYSBmYWN0b3IgdGhhdCBwcm9wZXJseSBjYW5jZWxzIHRoZSBtYXRyaXggZWZmZWN0IG9uIGxlbmd0aHMuXG4gKlxuICogW2phY29teWFsXVxuICogVG8gYmUgZnVsbHkgaG9uZXN0LCBJIGNhbid0IHJlYWxseSBleHBsYWluIGhhcHBlbnMgaGVyZS4uLiBJIG5vdGljZSB0aGF0IHRoZVxuICogZm9sbG93aW5nIHJhdGlvIHdvcmtzIChpZS4gaXQgY29ycmVjdGx5IGNvbXBlbnNhdGVzIHRoZSBtYXRyaXggaW1wYWN0IG9uIGFsbFxuICogY2FtZXJhIHN0YXRlcyBJIGNvdWxkIHRyeSk6XG4gKiA+IGBSID0gc2l6ZShWKSAvIHNpemUoTSAqIFYpIC8gV2BcbiAqIGFzIGxvbmcgYXMgYE0gKiBWYCBpcyBpbiB0aGUgZGlyZWN0aW9uIG9mIFcgKGllLiBwYXJhbGxlbCB0byAoT3gpKS4gSXQgd29ya3NcbiAqIGFzIHdlbGwgd2l0aCBIIGFuZCBhIHZlY3RvciB0aGF0IHRyYW5zZm9ybXMgaW50byBzb21ldGhpbmcgcGFyYWxsZWwgdG8gKE95KS5cbiAqXG4gKiBBbHNvLCBub3RlIHRoYXQgd2UgdXNlIGBhbmdsZWAgYW5kIG5vdCBgLWFuZ2xlYCAodGhhdCB3b3VsZCBzZWVtIGxvZ2ljYWwsXG4gKiBzaW5jZSB3ZSB3YW50IHRvIGFudGljaXBhdGUgdGhlIHJvdGF0aW9uKSwgYmVjYXVzZSBvZiB0aGUgZmFjdCB0aGF0IGluIFdlYkdMLFxuICogdGhlIGltYWdlIGlzIHZlcnRpY2FsbHkgc3dhcHBlZC5cbiAqL1xuZnVuY3Rpb24gZ2V0TWF0cml4SW1wYWN0KG1hdHJpeCwgY2FtZXJhU3RhdGUsIHZpZXdwb3J0RGltZW5zaW9ucykge1xuICAgIHZhciBfYSA9ICgwLCBtYXRyaWNlc18xLm11bHRpcGx5VmVjMikobWF0cml4LCB7IHg6IE1hdGguY29zKGNhbWVyYVN0YXRlLmFuZ2xlKSwgeTogTWF0aC5zaW4oY2FtZXJhU3RhdGUuYW5nbGUpIH0sIDApLCB4ID0gX2EueCwgeSA9IF9hLnk7XG4gICAgcmV0dXJuIDEgLyBNYXRoLnNxcnQoTWF0aC5wb3coeCwgMikgKyBNYXRoLnBvdyh5LCAyKSkgLyB2aWV3cG9ydERpbWVuc2lvbnMud2lkdGg7XG59XG5leHBvcnRzLmdldE1hdHJpeEltcGFjdCA9IGdldE1hdHJpeEltcGFjdDtcbi8qKlxuICogRnVuY3Rpb24gZXh0cmFjdGluZyB0aGUgY29sb3IgYXQgdGhlIGdpdmVuIHBpeGVsLlxuICovXG5mdW5jdGlvbiBleHRyYWN0UGl4ZWwoZ2wsIHgsIHksIGFycmF5KSB7XG4gICAgdmFyIGRhdGEgPSBhcnJheSB8fCBuZXcgVWludDhBcnJheSg0KTtcbiAgICBnbC5yZWFkUGl4ZWxzKHgsIHksIDEsIDEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGRhdGEpO1xuICAgIHJldHVybiBkYXRhO1xufVxuZXhwb3J0cy5leHRyYWN0UGl4ZWwgPSBleHRyYWN0UGl4ZWw7XG4vKipcbiAqIEZ1bmN0aW9uIHVzZWQgdG8ga25vdyB3aGV0aGVyIGdpdmVuIHdlYmdsIGNvbnRleHQgY2FuIHVzZSAzMiBiaXRzIGluZGljZXMuXG4gKi9cbmZ1bmN0aW9uIGNhblVzZTMyQml0c0luZGljZXMoZ2wpIHtcbiAgICB2YXIgd2ViZ2wyID0gdHlwZW9mIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQgIT09IFwidW5kZWZpbmVkXCIgJiYgZ2wgaW5zdGFuY2VvZiBXZWJHTDJSZW5kZXJpbmdDb250ZXh0O1xuICAgIHJldHVybiB3ZWJnbDIgfHwgISFnbC5nZXRFeHRlbnNpb24oXCJPRVNfZWxlbWVudF9pbmRleF91aW50XCIpO1xufVxuZXhwb3J0cy5jYW5Vc2UzMkJpdHNJbmRpY2VzID0gY2FuVXNlMzJCaXRzSW5kaWNlcztcbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdyYXBoIHZhcmlhYmxlIGlzIGEgdmFsaWQgZ3JhcGgsIGFuZCBpZiBzaWdtYSBjYW4gcmVuZGVyIGl0LlxuICovXG5mdW5jdGlvbiB2YWxpZGF0ZUdyYXBoKGdyYXBoKSB7XG4gICAgLy8gY2hlY2sgaWYgaXQncyBhIHZhbGlkIGdyYXBob2xvZ3kgaW5zdGFuY2VcbiAgICBpZiAoISgwLCBpc19ncmFwaF8xLmRlZmF1bHQpKGdyYXBoKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU2lnbWE6IGludmFsaWQgZ3JhcGggaW5zdGFuY2UuXCIpO1xuICAgIC8vIGNoZWNrIGlmIG5vZGVzIGhhdmUgeC95IGF0dHJpYnV0ZXNcbiAgICBncmFwaC5mb3JFYWNoTm9kZShmdW5jdGlvbiAoa2V5LCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIGlmICghTnVtYmVyLmlzRmluaXRlKGF0dHJpYnV0ZXMueCkgfHwgIU51bWJlci5pc0Zpbml0ZShhdHRyaWJ1dGVzLnkpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTaWdtYTogQ29vcmRpbmF0ZXMgb2Ygbm9kZSBcIi5jb25jYXQoa2V5LCBcIiBhcmUgaW52YWxpZC4gQSBub2RlIG11c3QgaGF2ZSBhIG51bWVyaWMgJ3gnIGFuZCAneScgYXR0cmlidXRlLlwiKSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmV4cG9ydHMudmFsaWRhdGVHcmFwaCA9IHZhbGlkYXRlR3JhcGg7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubXVsdGlwbHlWZWMyID0gZXhwb3J0cy5tdWx0aXBseSA9IGV4cG9ydHMudHJhbnNsYXRlID0gZXhwb3J0cy5yb3RhdGUgPSBleHBvcnRzLnNjYWxlID0gZXhwb3J0cy5pZGVudGl0eSA9IHZvaWQgMDtcbmZ1bmN0aW9uIGlkZW50aXR5KCkge1xuICAgIHJldHVybiBGbG9hdDMyQXJyYXkub2YoMSwgMCwgMCwgMCwgMSwgMCwgMCwgMCwgMSk7XG59XG5leHBvcnRzLmlkZW50aXR5ID0gaWRlbnRpdHk7XG4vLyBUT0RPOiBvcHRpbWl6ZVxuZnVuY3Rpb24gc2NhbGUobSwgeCwgeSkge1xuICAgIG1bMF0gPSB4O1xuICAgIG1bNF0gPSB0eXBlb2YgeSA9PT0gXCJudW1iZXJcIiA/IHkgOiB4O1xuICAgIHJldHVybiBtO1xufVxuZXhwb3J0cy5zY2FsZSA9IHNjYWxlO1xuZnVuY3Rpb24gcm90YXRlKG0sIHIpIHtcbiAgICB2YXIgcyA9IE1hdGguc2luKHIpLCBjID0gTWF0aC5jb3Mocik7XG4gICAgbVswXSA9IGM7XG4gICAgbVsxXSA9IHM7XG4gICAgbVszXSA9IC1zO1xuICAgIG1bNF0gPSBjO1xuICAgIHJldHVybiBtO1xufVxuZXhwb3J0cy5yb3RhdGUgPSByb3RhdGU7XG5mdW5jdGlvbiB0cmFuc2xhdGUobSwgeCwgeSkge1xuICAgIG1bNl0gPSB4O1xuICAgIG1bN10gPSB5O1xuICAgIHJldHVybiBtO1xufVxuZXhwb3J0cy50cmFuc2xhdGUgPSB0cmFuc2xhdGU7XG5mdW5jdGlvbiBtdWx0aXBseShhLCBiKSB7XG4gICAgdmFyIGEwMCA9IGFbMF0sIGEwMSA9IGFbMV0sIGEwMiA9IGFbMl07XG4gICAgdmFyIGExMCA9IGFbM10sIGExMSA9IGFbNF0sIGExMiA9IGFbNV07XG4gICAgdmFyIGEyMCA9IGFbNl0sIGEyMSA9IGFbN10sIGEyMiA9IGFbOF07XG4gICAgdmFyIGIwMCA9IGJbMF0sIGIwMSA9IGJbMV0sIGIwMiA9IGJbMl07XG4gICAgdmFyIGIxMCA9IGJbM10sIGIxMSA9IGJbNF0sIGIxMiA9IGJbNV07XG4gICAgdmFyIGIyMCA9IGJbNl0sIGIyMSA9IGJbN10sIGIyMiA9IGJbOF07XG4gICAgYVswXSA9IGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMDtcbiAgICBhWzFdID0gYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxO1xuICAgIGFbMl0gPSBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjI7XG4gICAgYVszXSA9IGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMDtcbiAgICBhWzRdID0gYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxO1xuICAgIGFbNV0gPSBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjI7XG4gICAgYVs2XSA9IGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMDtcbiAgICBhWzddID0gYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxO1xuICAgIGFbOF0gPSBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjI7XG4gICAgcmV0dXJuIGE7XG59XG5leHBvcnRzLm11bHRpcGx5ID0gbXVsdGlwbHk7XG5mdW5jdGlvbiBtdWx0aXBseVZlYzIoYSwgYiwgeikge1xuICAgIGlmICh6ID09PSB2b2lkIDApIHsgeiA9IDE7IH1cbiAgICB2YXIgYTAwID0gYVswXTtcbiAgICB2YXIgYTAxID0gYVsxXTtcbiAgICB2YXIgYTEwID0gYVszXTtcbiAgICB2YXIgYTExID0gYVs0XTtcbiAgICB2YXIgYTIwID0gYVs2XTtcbiAgICB2YXIgYTIxID0gYVs3XTtcbiAgICB2YXIgYjAgPSBiLng7XG4gICAgdmFyIGIxID0gYi55O1xuICAgIHJldHVybiB7IHg6IGIwICogYTAwICsgYjEgKiBhMTAgKyBhMjAgKiB6LCB5OiBiMCAqIGEwMSArIGIxICogYTExICsgYTIxICogeiB9O1xufVxuZXhwb3J0cy5tdWx0aXBseVZlYzIgPSBtdWx0aXBseVZlYzI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnVpbGRHcmFwaCA9IGV4cG9ydHMuanNvblRleHRUb0dyYXBoRGVmID0gdm9pZCAwO1xuY29uc3QgZ3JhcGhvbG9neV8xID0gcmVxdWlyZShcImdyYXBob2xvZ3lcIik7XG5jb25zdCBncmFwaG9sb2d5X2xheW91dF8xID0gcmVxdWlyZShcImdyYXBob2xvZ3ktbGF5b3V0XCIpO1xuY29uc3QgZ3JhcGhvbG9neV9sYXlvdXRfZm9yY2VhdGxhczJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiZ3JhcGhvbG9neS1sYXlvdXQtZm9yY2VhdGxhczJcIikpO1xuZnVuY3Rpb24ganNvblRleHRUb0dyYXBoRGVmKHRleHQpIHtcbiAgICBjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKHRleHQpO1xuICAgIGNvbnN0IGNoZWNrRmllbGQgPSAob2JqLCBmaWVsZE5hbWUsIGNoZWNrLCByZXF1aXJlZCA9IHRydWUpID0+IHtcbiAgICAgICAgaWYgKG9ialtmaWVsZE5hbWVdID09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChyZXF1aXJlZClcbiAgICAgICAgICAgICAgICB0aHJvdyBgcmVxdWlyZWQgcHJvcGVydHkgXCIke2ZpZWxkTmFtZX1cIiBpcyBtaXNzaW5nLCBoYXZlICR7SlNPTi5zdHJpbmdpZnkob2JqKX1gO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjaGVja1Jlc3VsdCA9IGNoZWNrKG9ialtmaWVsZE5hbWVdKTtcbiAgICAgICAgaWYgKGNoZWNrUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgdGhyb3cgYGZpZWxkICR7ZmllbGROYW1lfSBmYWlscyB0eXBlIGNoZWNrYDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgaXNTdHJpbmcgPSAodikgPT4gdHlwZW9mIHYgPT09IFwic3RyaW5nXCI7XG4gICAgY29uc3QgaXNOdW1iZXIgPSAodikgPT4gdHlwZW9mIHYgPT09IFwibnVtYmVyXCI7XG4gICAgY29uc3QgaXNPYmplY3QgPSAodikgPT4gdHlwZW9mIHYgPT09IFwib2JqZWN0XCI7XG4gICAgY2hlY2tGaWVsZChwYXJzZWQsIFwidGl0bGVcIiwgaXNTdHJpbmcsIGZhbHNlKTtcbiAgICBjaGVja0ZpZWxkKHBhcnNlZCwgXCJub2Rlc1wiLCAodikgPT4gaXNPYmplY3QodikgJiZcbiAgICAgICAgT2JqZWN0LmVudHJpZXModikuZXZlcnkoKFtrLCB2XSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFpc1N0cmluZyhrKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNoZWNrRmllbGQodiwgXCJwcm9wc1wiLCBpc09iamVjdCwgZmFsc2UpO1xuICAgICAgICAgICAgY2hlY2tGaWVsZCh2LCBcImNvbG9yXCIsIGlzU3RyaW5nLCBmYWxzZSk7XG4gICAgICAgICAgICBjaGVja0ZpZWxkKHYsIFwibGFiZWxcIiwgaXNTdHJpbmcsIGZhbHNlKTtcbiAgICAgICAgICAgIGNoZWNrRmllbGQodiwgXCJ3ZWlnaHRcIiwgaXNOdW1iZXIsIGZhbHNlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KSk7XG4gICAgY2hlY2tGaWVsZChwYXJzZWQsIFwiZWRnZXNcIiwgKGVkZ2VzKSA9PiBBcnJheS5pc0FycmF5KGVkZ2VzKSAmJlxuICAgICAgICBlZGdlcy5mb3JFYWNoKChlZGdlKSA9PiB7XG4gICAgICAgICAgICBjaGVja0ZpZWxkKGVkZ2UsIFwidG9cIiwgaXNTdHJpbmcpO1xuICAgICAgICAgICAgY2hlY2tGaWVsZChlZGdlLCBcImZyb21cIiwgaXNTdHJpbmcpO1xuICAgICAgICB9KSk7XG4gICAgcmV0dXJuIHBhcnNlZDtcbn1cbmV4cG9ydHMuanNvblRleHRUb0dyYXBoRGVmID0ganNvblRleHRUb0dyYXBoRGVmO1xuZnVuY3Rpb24gYnVpbGRHcmFwaChkZWYpIHtcbiAgICBjb25zdCBncmFwaCA9IG5ldyBncmFwaG9sb2d5XzEuRGlyZWN0ZWRHcmFwaCgpO1xuICAgIE9iamVjdC5lbnRyaWVzKGRlZi5ub2RlcykuZm9yRWFjaCgoW2lkLCBub2RlXSkgPT4gZ3JhcGguYWRkTm9kZShpZCwge1xuICAgICAgICBub2RlRGVmOiBub2RlLFxuICAgICAgICBjb2xvcjogbm9kZS5jb2xvcixcbiAgICAgICAgbGFiZWw6IG5vZGUubGFiZWwgfHwgaWQsXG4gICAgfSkpO1xuICAgIGNvbnN0IGNyZWF0ZU5vZGVJZk5vdEV4aXN0cyA9IChuYW1lKSA9PiB7XG4gICAgICAgIGlmICghZ3JhcGguaGFzTm9kZShuYW1lKSkge1xuICAgICAgICAgICAgZ3JhcGguYWRkTm9kZShuYW1lLCB7IGxhYmVsOiBuYW1lLCBub2RlRGVmOiB7fSB9KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgZGVmLmVkZ2VzLmZvckVhY2goKGVkZ2UpID0+IHtcbiAgICAgICAgbGV0IGFtb3VudE51bSA9IHBhcnNlRmxvYXQoZWRnZS5hbW91bnQgfHwgXCIxXCIpO1xuICAgICAgICBpZiAoaXNOYU4oYW1vdW50TnVtKSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKGBhbW91bnQgb24gZWRnZSAke2VkZ2UuZnJvbX0gLT4gJHtlZGdlLnRvfSBcIiR7ZWRnZS5hbW91bnR9XCIgaXMgdW5wYXJzZWFibGVgKTtcbiAgICAgICAgICAgIGFtb3VudE51bSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgY3JlYXRlTm9kZUlmTm90RXhpc3RzKGVkZ2UuZnJvbSk7XG4gICAgICAgIGNyZWF0ZU5vZGVJZk5vdEV4aXN0cyhlZGdlLnRvKTtcbiAgICAgICAgZ3JhcGguYWRkRWRnZShlZGdlLmZyb20sIGVkZ2UudG8sIHtcbiAgICAgICAgICAgIGxhYmVsOiBlZGdlLmxhYmVsIHx8IGVkZ2UuYW1vdW50LFxuICAgICAgICAgICAgd2VpZ2h0OiBhbW91bnROdW0sXG4gICAgICAgICAgICB0eXBlOiBcImFycm93XCIsXG4gICAgICAgICAgICBzaXplOiAzLFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBjb25zdCBtaW5TaXplID0gNSwgbWF4U2l6ZSA9IDI1O1xuICAgIGNvbnN0IHNpemVzID0gZ3JhcGhcbiAgICAgICAgLm1hcE5vZGVzKChub2RlKSA9PiBncmFwaC5nZXROb2RlQXR0cmlidXRlKG5vZGUsIFwibm9kZURlZlwiKS53ZWlnaHQpXG4gICAgICAgIC5maWx0ZXIoKG4pID0+IG4gIT0gbnVsbCk7XG4gICAgY29uc3QgbWluRXhwbGljaXROb2RlU2l6ZSA9IE1hdGgubWluKC4uLnNpemVzKTtcbiAgICBjb25zdCBtYXhFeHBsaWNpdE5vZGVTaXplID0gTWF0aC5tYXgoLi4uc2l6ZXMpO1xuICAgIGNvbnNvbGUubG9nKG1pbkV4cGxpY2l0Tm9kZVNpemUsIG1heEV4cGxpY2l0Tm9kZVNpemUpO1xuICAgIC8vIFVzZSB0b3RhbCBlZGdlIHdlaWdodHMgZm9yIG5vZGUgc2l6ZVxuICAgIGNvbnN0IHRvdGFsVHJhbnNmZXJzQnlOb2RlID0gZ3JhcGhcbiAgICAgICAgLm5vZGVzKClcbiAgICAgICAgLm1hcCgobm9kZSkgPT4gZ3JhcGgucmVkdWNlRWRnZXMobm9kZSwgKGFjYywgX2VkZ2UsIGVkZ2VBdHRycykgPT4gYWNjICsgZWRnZUF0dHJzLndlaWdodCwgMCkpO1xuICAgIGNvbnN0IG1pblhmZXJzID0gTWF0aC5taW4oLi4udG90YWxUcmFuc2ZlcnNCeU5vZGUpO1xuICAgIGNvbnN0IG1heFhmZXJzID0gTWF0aC5tYXgoLi4udG90YWxUcmFuc2ZlcnNCeU5vZGUpO1xuICAgIGNvbnN0IHNjYWxlZFNpemVGb3IgPSAodHJhbnNmZXJBbW91bnQpID0+IG1pblNpemUgK1xuICAgICAgICAoKHRyYW5zZmVyQW1vdW50IC0gbWluWGZlcnMpIC8gKG1heFhmZXJzIC0gbWluWGZlcnMpKSAqXG4gICAgICAgICAgICAobWF4U2l6ZSAtIG1pblNpemUpO1xuICAgIGNvbnN0IHNjYWxlZEV4cGxpY2l0U2l6ZUZvciA9IChzaXplKSA9PiBtaW5TaXplICtcbiAgICAgICAgKChzaXplIC0gbWluRXhwbGljaXROb2RlU2l6ZSkgL1xuICAgICAgICAgICAgKG1heEV4cGxpY2l0Tm9kZVNpemUgLSBtaW5FeHBsaWNpdE5vZGVTaXplKSkgKlxuICAgICAgICAgICAgKG1heFNpemUgLSBtaW5TaXplKTtcbiAgICBncmFwaC5mb3JFYWNoTm9kZSgobm9kZSkgPT4ge1xuICAgICAgICBjb25zdCB0b3RhbFRyYW5zZmVycyA9IGdyYXBoLnJlZHVjZUVkZ2VzKG5vZGUsIChhY2MsIF9lZGdlLCBlZGdlQXR0cnMpID0+IGFjYyArIGVkZ2VBdHRycy53ZWlnaHQsIDApO1xuICAgICAgICBjb25zdCBub2RlQXR0cnMgPSBncmFwaC5nZXROb2RlQXR0cmlidXRlcyhub2RlKTtcbiAgICAgICAgY29uc3QgZXhwbGljaXRTaXplID0gbm9kZUF0dHJzLm5vZGVEZWYud2VpZ2h0ICE9IG51bGxcbiAgICAgICAgICAgID8gc2NhbGVkRXhwbGljaXRTaXplRm9yKG5vZGVBdHRycy5ub2RlRGVmLndlaWdodClcbiAgICAgICAgICAgIDogbnVsbDtcbiAgICAgICAgZ3JhcGguc2V0Tm9kZUF0dHJpYnV0ZShub2RlLCBcInNpemVcIiwgZXhwbGljaXRTaXplID8/IHNjYWxlZFNpemVGb3IodG90YWxUcmFuc2ZlcnMpKTtcbiAgICB9KTtcbiAgICAvLyBQb3NpdGlvbiBub2RlcyBvbiBhIGNpcmNsZSwgdGhlbiBydW4gRm9yY2UgQXRsYXMgMiBmb3IgYSB3aGlsZSB0byBnZXRcbiAgICAvLyBwcm9wZXIgZ3JhcGggbGF5b3V0OlxuICAgIGdyYXBob2xvZ3lfbGF5b3V0XzEuY2lyY3VsYXIuYXNzaWduKGdyYXBoKTtcbiAgICBjb25zdCBzZXR0aW5ncyA9IGdyYXBob2xvZ3lfbGF5b3V0X2ZvcmNlYXRsYXMyXzEuZGVmYXVsdC5pbmZlclNldHRpbmdzKGdyYXBoKTtcbiAgICBncmFwaG9sb2d5X2xheW91dF9mb3JjZWF0bGFzMl8xLmRlZmF1bHQuYXNzaWduKGdyYXBoLCB7IHNldHRpbmdzLCBpdGVyYXRpb25zOiA2MDAgfSk7XG4gICAgLy8gZm9yIGRlYnVnZ2luZ1xuICAgIGdsb2JhbFRoaXMuZ3JhcGggPSBncmFwaDtcbiAgICByZXR1cm4gZ3JhcGg7XG59XG5leHBvcnRzLmJ1aWxkR3JhcGggPSBidWlsZEdyYXBoO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlZpZXcgPSBleHBvcnRzLlNpZ21hR3JhcGhWaWV3ID0gZXhwb3J0cy5UYWJsZU5vZGVEYXRhVmlldyA9IHZvaWQgMDtcbmNvbnN0IHNpZ21hXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcInNpZ21hXCIpKTtcbi8vIEZJWE1FOiB0aGlzIG1pZ2h0IGJlIGdvb2QgdG8gcmVwbGFjZSB3aXRoIHJlYWN0IGFuZCBUU1guIHRoZSBzdG9jayBET01cbi8vIHN0dWZmIHN1Y2tzXG5jbGFzcyBUYWJsZU5vZGVEYXRhVmlldyB7XG4gICAgY29uc3RydWN0b3IoZWxlbSkge1xuICAgICAgICB0aGlzLnRhYmxlID0gZWxlbS5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtbm9kZS10YWJsZV1cIik7XG4gICAgICAgIHRoaXMubmFtZUVsZW0gPSBlbGVtLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1ub2RlLW5hbWVdXCIpO1xuICAgIH1cbiAgICByZW5kZXJQcm9wZXJ0eShpbnRvRWwsIGlkLCB2YWx1ZSkge1xuICAgICAgICBjb25zdCBTUEVDSUFMUyA9IHtcbiAgICAgICAgICAgIGdvb2dsZVNlYXJjaDogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFuY2hvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgICAgICAgIGFuY2hvci5ocmVmID0gYGh0dHBzOi8vZ29vZ2xlLmNvbS9zZWFyY2g/cT0ke2VuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSl9YDtcbiAgICAgICAgICAgICAgICBhbmNob3IudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBpbnRvRWwuYXBwZW5kQ2hpbGQoYW5jaG9yKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGRlZmF1bHRSZW5kZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpbnRvRWwudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgLy8gWFhYOiB0eXBlIGNyaW1lcz9cbiAgICAgICAgY29uc3QgcmVuZGVyRnVuYyA9IFNQRUNJQUxTW2lkXSB8fCBkZWZhdWx0UmVuZGVyO1xuICAgICAgICByZW5kZXJGdW5jKCk7XG4gICAgfVxuICAgIG9uTm9kZVNlbGVjdGVkKG5vZGVJZCwgbm9kZSkge1xuICAgICAgICBpZiAodGhpcy50YWJsZS50Qm9kaWVzWzBdKVxuICAgICAgICAgICAgdGhpcy50YWJsZS50Qm9kaWVzWzBdLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLm5hbWVFbGVtLnRleHRDb250ZW50ID0gbm9kZS5sYWJlbCB8fCBub2RlSWQ7XG4gICAgICAgIGNvbnN0IHRib2R5ID0gdGhpcy50YWJsZS5jcmVhdGVUQm9keSgpO1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wLCB2YWxdIG9mIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMgfHwge30pKSB7XG4gICAgICAgICAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidHJcIik7XG4gICAgICAgICAgICBjb25zdCBuYW1lRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGRcIik7XG4gICAgICAgICAgICBjb25zdCB2YWx1ZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRkXCIpO1xuICAgICAgICAgICAgbmFtZUVsLnRleHRDb250ZW50ID0gcHJvcDtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUHJvcGVydHkodmFsdWVFbCwgcHJvcCwgdmFsKTtcbiAgICAgICAgICAgIHJvdy5hcHBlbmRDaGlsZChuYW1lRWwpO1xuICAgICAgICAgICAgcm93LmFwcGVuZENoaWxkKHZhbHVlRWwpO1xuICAgICAgICAgICAgdGJvZHkuYXBwZW5kQ2hpbGQocm93KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuVGFibGVOb2RlRGF0YVZpZXcgPSBUYWJsZU5vZGVEYXRhVmlldztcbmNsYXNzIFNpZ21hR3JhcGhWaWV3IHtcbiAgICBjb25zdHJ1Y3RvcihzaWdtYSkge1xuICAgICAgICB0aGlzLm9uTm9kZVNlbGVjdGVkID0gKCkgPT4gdW5kZWZpbmVkO1xuICAgICAgICB0aGlzLnNpZ21hID0gc2lnbWE7XG4gICAgICAgIHNpZ21hLmFkZExpc3RlbmVyKFwiY2xpY2tOb2RlXCIsIChwYXlsb2FkKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBncmFwaCA9IHNpZ21hLmdldEdyYXBoKCk7XG4gICAgICAgICAgICBjb25zdCBub2RlRGVmID0gZ3JhcGguZ2V0Tm9kZUF0dHJpYnV0ZShwYXlsb2FkLm5vZGUsIFwibm9kZURlZlwiKTtcbiAgICAgICAgICAgIHRoaXMub25Ob2RlU2VsZWN0ZWQocGF5bG9hZC5ub2RlLCBub2RlRGVmKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGtpbGwoKSB7XG4gICAgICAgIHRoaXMuc2lnbWEua2lsbCgpO1xuICAgIH1cbn1cbmV4cG9ydHMuU2lnbWFHcmFwaFZpZXcgPSBTaWdtYUdyYXBoVmlldztcbmNsYXNzIFZpZXcge1xuICAgIGNvbnN0cnVjdG9yKGdyYXBoLCBncmFwaENvbnRhaW5lciwgcHJvcHNDb250YWluZXIpIHtcbiAgICAgICAgdGhpcy5ub2RlRGF0YVZpZXcgPSBuZXcgVGFibGVOb2RlRGF0YVZpZXcocHJvcHNDb250YWluZXIpO1xuICAgICAgICB0aGlzLnNpZ21hR3JhcGhWaWV3ID0gbmV3IFNpZ21hR3JhcGhWaWV3KG5ldyBzaWdtYV8xLmRlZmF1bHQoZ3JhcGgsIGdyYXBoQ29udGFpbmVyLCB7XG4gICAgICAgICAgICByZW5kZXJFZGdlTGFiZWxzOiB0cnVlLFxuICAgICAgICB9KSk7XG4gICAgICAgIHRoaXMuc2lnbWFHcmFwaFZpZXcub25Ob2RlU2VsZWN0ZWQgPSAobm9kZUlkLCBub2RlKSA9PiB0aGlzLm5vZGVEYXRhVmlldy5vbk5vZGVTZWxlY3RlZChub2RlSWQsIG5vZGUpO1xuICAgIH1cbiAgICBraWxsKCkge1xuICAgICAgICB0aGlzLnNpZ21hR3JhcGhWaWV3LmtpbGwoKTtcbiAgICB9XG59XG5leHBvcnRzLlZpZXcgPSBWaWV3O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgaW5nZXN0XzEgPSByZXF1aXJlKFwiLi9pbmdlc3RcIik7XG5jb25zdCByZW5kZXJlcl8xID0gcmVxdWlyZShcIi4vcmVuZGVyZXJcIik7XG5mdW5jdGlvbiBzdGFydHVwKCkge1xuICAgIGNvbnN0IHRleHRDb250cm9sID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXN0ZS1qc29uXCIpO1xuICAgIGxldCBteVZpZXc7XG4gICAgY29uc3QgZ3JhcGhDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNpZ21hLWNvbnRhaW5lclwiKTtcbiAgICBjb25zdCBsb2FkaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2FkaW5nLWluZGljYXRpb25cIik7XG4gICAgY29uc3QgZmFpbHVyZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZhaWx1cmVzXCIpO1xuICAgIGNvbnN0IG5vZGVEYXRhVmlldyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvcGVydGllcy10YWJsZVwiKTtcbiAgICBhc3luYyBmdW5jdGlvbiBvbkFjY2VwdFRleHQodGV4dCkge1xuICAgICAgICBsb2FkaW5nLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gb25Mb2FkKHRleHQpLCAwKTtcbiAgICB9XG4gICAgYXN5bmMgZnVuY3Rpb24gb25Mb2FkKGNvbnRlbnQsIHRpdGxlKSB7XG4gICAgICAgIGlmIChteVZpZXcpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwia2lsbFwiKTtcbiAgICAgICAgICAgIG15Vmlldy5raWxsKCk7XG4gICAgICAgICAgICBteVZpZXcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImRvbmVcIik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGdyYXBoRGVmO1xuICAgICAgICBsZXQgZ3JhcGg7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBncmFwaERlZiA9ICgwLCBpbmdlc3RfMS5qc29uVGV4dFRvR3JhcGhEZWYpKGNvbnRlbnQpO1xuICAgICAgICAgICAgZ3JhcGggPSAoMCwgaW5nZXN0XzEuYnVpbGRHcmFwaCkoZ3JhcGhEZWYpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBmYWlsdXJlcy50ZXh0Q29udGVudCA9IGBGYWlsZWQgdG8gcGFyc2UgSlNPTiwgdHJ5IGNvcHlpbmcgaXQgYWdhaW46ICR7ZS50b1N0cmluZygpfWA7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgbG9hZGluZy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbG9hZGluZy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIGZhaWx1cmVzLnRleHRDb250ZW50ID0gXCJcIjtcbiAgICAgICAgZG9jdW1lbnQudGl0bGUgPSBgJHtncmFwaERlZi50aXRsZSB8fCB0aXRsZSB8fCBcInVudGl0bGVkXCJ9IC0gTG9va2luZyBHbGFzcyDwn5SOYDtcbiAgICAgICAgbXlWaWV3ID0gbmV3IHJlbmRlcmVyXzEuVmlldyhncmFwaCwgZ3JhcGhDb250YWluZXIsIG5vZGVEYXRhVmlldyk7XG4gICAgfVxuICAgIHRleHRDb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXN0ZVwiLCAoZXYpID0+IHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IGV2LmNsaXBib2FyZERhdGE/LmdldERhdGEoXCJ0ZXh0L3BsYWluXCIpO1xuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2xpcGJvYXJkIGRhdGEgaXMgbnVsbD9cIjtcbiAgICAgICAgfVxuICAgICAgICBvbkFjY2VwdFRleHQoZGF0YSk7XG4gICAgfSk7XG59XG5zdGFydHVwKCk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=