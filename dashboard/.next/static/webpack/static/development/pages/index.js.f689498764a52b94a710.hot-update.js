webpackHotUpdate("static/development/pages/index.js",{

/***/ "./components/map-view/index.js":
/*!**************************************!*\
  !*** ./components/map-view/index.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return MapView; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "./node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var pigeon_maps__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! pigeon-maps */ "./node_modules/pigeon-maps/lib/react/index.js");
/* harmony import */ var pigeon_maps__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(pigeon_maps__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var pigeon_overlay__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pigeon-overlay */ "./node_modules/pigeon-overlay/lib/react/index.js");
/* harmony import */ var pigeon_overlay__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pigeon_overlay__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _map_view_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./map-view.module.scss */ "./components/map-view/map-view.module.scss");
/* harmony import */ var _map_view_module_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_map_view_module_scss__WEBPACK_IMPORTED_MODULE_3__);
var _jsxFileName = "/Users/santhos/Desktop/cp/cp18-backend/dashboard/components/map-view/index.js";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }






var MapView =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MapView, _React$Component);

  function MapView() {
    _classCallCheck(this, MapView);

    return _possibleConstructorReturn(this, _getPrototypeOf(MapView).apply(this, arguments));
  }

  _createClass(MapView, [{
    key: "render",
    value: function render() {
      return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
        className: _map_view_module_scss__WEBPACK_IMPORTED_MODULE_3___default.a.mapView,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10
        },
        __self: this
      }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(pigeon_maps__WEBPACK_IMPORTED_MODULE_1___default.a, {
        center: [52.5126276, 13.3218814],
        zoom: 15,
        width: 1000,
        height: 800,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 11
        },
        __self: this
      }));
    }
  }]);

  return MapView;
}(react__WEBPACK_IMPORTED_MODULE_0___default.a.Component);



/***/ }),

/***/ "./node_modules/pigeon-overlay/lib/react/index.js":
/*!********************************************************!*\
  !*** ./node_modules/pigeon-overlay/lib/react/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }return target;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _infact = __webpack_require__(/*! ./infact */ "./node_modules/pigeon-overlay/lib/react/infact.js");

var _propTypes = __webpack_require__(/*! prop-types */ "./node_modules/prop-types/index.js");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Overlay = function (_Component) {
  _inherits(Overlay, _Component);

  function Overlay() {
    _classCallCheck(this, Overlay);

    return _possibleConstructorReturn(this, (Overlay.__proto__ || Object.getPrototypeOf(Overlay)).apply(this, arguments));
  }

  _createClass(Overlay, [{
    key: 'render',

    // render

    value: function () {
      var _props = this.props,
          left = _props.left,
          top = _props.top,
          className = _props.className,
          _props$style = _props.style,
          style = _props$style === undefined ? {} : _props$style;

      return _infact.React.createElement('div', { style: _extends({ position: 'absolute', transform: 'translate(' + left + 'px, ' + top + 'px)' }, style), className: className || '' }, this.props.children);
    }
  }]);

  return Overlay;
}(_infact.Component);

Overlay.propTypes = {
  // input
  anchor: _propTypes2.default.array.isRequired,
  offset: _propTypes2.default.array,

  // passed to div
  className: _propTypes2.default.string,

  // pigeon variables
  left: _propTypes2.default.number,
  top: _propTypes2.default.number,

  // pigeon functions
  latLngToPixel: _propTypes2.default.func,
  pixelToLatLng: _propTypes2.default.func };
exports.default = Overlay;

/***/ }),

/***/ "./node_modules/pigeon-overlay/lib/react/infact.js":
/*!*********************************************************!*\
  !*** ./node_modules/pigeon-overlay/lib/react/infact.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// // infact = inferno + react

exports.React = __webpack_require__(/*! react */ "./node_modules/react/index.js");
exports.ReactDOM = __webpack_require__(/*! react-dom */ "./node_modules/react-dom/index.js");
exports.Component = exports.React.Component;

/***/ })

})
//# sourceMappingURL=index.js.f689498764a52b94a710.hot-update.js.map