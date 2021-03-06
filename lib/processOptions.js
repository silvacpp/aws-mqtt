'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Not all MQTT options will work with AWS, here we handpick options that are safe to pass on to MQTT
exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var region = options.region,
      endpoint = options.endpoint,
      credentials = options.credentials,
      expires = options.expires,
      clockSkew = options.clockSkew,
      otherOptions = _objectWithoutProperties(options, ['region', 'endpoint', 'credentials', 'expires', 'clockSkew']);

  return {
    aws: {
      region: region,
      endpoint: endpoint,
      credentials: credentials,
      clockSkew: clockSkew,
      expires: expires || 60 // 60 sec default expiration
    },
    mqttOptions: _extends({}, otherOptions, {
      // defaults, in case the caller does not pass these values
      clientId: options.clientId || 'mqtt-client-' + Math.floor(Math.random() * 100000 + 1),
      connectTimeout: options.connectTimeout || 5 * 1000,
      reconnectPeriod: options.reconnectPeriod || 10 * 1000,
      clean: options.clean || true, // need to re-subscribe after offline/disconnect,
      // enforce these options
      protocolId: 'MQTT', // AWS IoT supports MQTT v3.1.1
      protocolVersion: 4 // AWS IoT supports MQTT v3.1.1
    })
  };
};