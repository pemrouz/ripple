"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

module.exports = createRipple;

var _utils = require("./utils");

var is = _utils.is;
var chain = _utils.chain;
var def = _utils.def;
var log = _utils.log;
var noop = _utils.noop;
var client = _utils.client;
var use = _utils.use;
var sio = _utils.sio;
var attr = _utils.attr;

var _sync = require("./sync");

var auth = _sync.auth;
var append = _sync.append;
var serve = _sync.serve;

var register = _interopRequire(require("./register"));

var version = _interopRequire(require("./version"));

var cache = _interopRequire(require("./cache"));

var draw = _interopRequire(require("./draw"));

var rhumb = _interopRequire(require("rhumb"));

var sync = _interopRequire(_sync);

var db = _interopRequire(require("./db"));

function createRipple(server) {
  var app = arguments[1] === undefined ? { use: noop } : arguments[1];
  var opts = arguments[2] === undefined ? { client: true } : arguments[2];

  log("creating");

  var resources = {},
      socket = sio(server),
      routes = rhumb.create();[["versions", []], ["length", 0], ["time", 0]].map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var key = _ref2[0];
    var val = _ref2[1];
    return def(resources, key, val, true);
  });

  ripple._resources = function () {
    return resources;
  };
  ripple._socket = function () {
    return socket;
  };
  ripple._routes = function () {
    return routes;
  };
  ripple._register = register(ripple);
  ripple.resource = chain(ripple._register, ripple);
  ripple.cache = cache(ripple);
  ripple.db = db(ripple);
  ripple.draw = draw(ripple);
  ripple.version = version(ripple);
  ripple.use = use(ripple);
  ripple.emit = !client && sync(ripple).emit;

  setTimeout(ripple.cache.load, 0);

  client ? socket.on("response", ripple._register) : (socket.on("connection", sync(ripple).connected), app.use("/ripple.js", serve.client), app.use("/immutable.min.js", serve.immutable), opts.client && app.use(append), opts.session && socket.use(auth(opts.session)));

  return ripple;

  function ripple() {
    return ripple._register.apply(this, arguments);
  }
}

if (client) {
  var expose = attr(document.currentScript, "utils");
  is.str(expose) && utils.apply(undefined, _toConsumableArray(expose.split(" ").filter(Boolean)));
  client && (window.ripple = createRipple());
}