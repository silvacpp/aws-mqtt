'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signUrl = exports.signedUrl = undefined;

var _awsSignatureV = require('aws-signature-v4');

var _awsSignatureV2 = _interopRequireDefault(_awsSignatureV);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var signedUrl = exports.signedUrl = function signedUrl(_ref) {
  var credentials = _ref.credentials,
      endpoint = _ref.endpoint,
      region = _ref.region,
      _ref$clockSkew = _ref.clockSkew,
      clockSkew = _ref$clockSkew === undefined ? 0 : _ref$clockSkew,
      expires = _ref.expires;

  var timestamp = Date.now() + clockSkew;
  var payload = _crypto2.default.createHash('sha256').update('', 'utf8').digest('hex');
  return _awsSignatureV2.default.createPresignedURL('GET', endpoint, '/mqtt', 'iotdevicegateway', payload, {
    key: credentials.accessKeyId,
    secret: credentials.secretAccessKey,
    sessionToken: credentials.sessionToken,
    protocol: 'wss',
    region: region,
    timestamp: timestamp,
    expires: expires
  });
};

var hasProtocol = function hasProtocol(endpoint) {
  return new RegExp("^wss?://").test(endpoint);
};

// This method is used when you don't pass in credentials
var unsignedUrl = function unsignedUrl(endpoint) {
  var url = '' + endpoint;
  return hasProtocol(url) ? url : 'wss://' + url;
};

// aws parameter has shape { credentials, endpoint, region, expires }
var signUrl = exports.signUrl = function signUrl(aws, callback) {
  // Need to refresh AWS credentials, which expire after initial creation.
  // For example CognitoIdentity credentials expire after an hour
  if (aws.credentials) {
    aws.credentials.get(function (err) {
      if (err) return callback(err);
      // console.log('Credentials', aws.credentials)
      callback(null, signedUrl(aws));
    });
  } else {
    callback(null, unsignedUrl(aws.endpoint));
  }
};