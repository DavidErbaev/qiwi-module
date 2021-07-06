"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var fetch = require("node-fetch");

var qs = require("query-string");

var _require = require("../error/APIError.js"),
    APIError = _require.APIError;

var API =
/*#__PURE__*/
function () {
  function API() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, API);

    this.token = params.token;
    this.requestOptions = {
      headers: {
        'Accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      },
      apiUrl: "https://edge.qiwi.com/"
    };
    this.recipients = {
      qiwi: 99,
      visa_rus: 1963,
      mastercard_rus: 21013,
      visa_sng: 1960,
      mastercard_sng: 21012,
      mir: 31652,
      tinkoff: 466,
      alfa: 464,
      promsvyaz: 821,
      russkiy_standard: 815
    };
  }

  _createClass(API, [{
    key: "getAccountInfo",
    value: function getAccountInfo() {
      return this.callMethod({
        method_patch: "GET",
        method: "person-profile/v1/profile/current"
      });
    }
    /**
     * 
     * @param {String} current 
     * @returns 
     */

  }, {
    key: "getBalance",
    value: function getBalance(current) {
      var response;
      return regeneratorRuntime.async(function getBalance$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (current) {
                _context.next = 2;
                break;
              }

              throw new APIError("You have not specified the currency in which you want to receive kzt/eur/rub/all.");

            case 2:
              if (!Number(current)) {
                _context.next = 4;
                break;
              }

              throw new APIError("Numbers cannot be used in choosing a currency.");

            case 4:
              _context.next = 6;
              return regeneratorRuntime.awrap(this.callMethod({
                method_patch: "GET",
                method: "funding-sources/v1/accounts/current"
              }));

            case 6:
              response = _context.sent;
              if (/(?:руб|рубли|рубль|rb|rub|rubles)/i.test(current)) response = response.accounts.find(function (x) {
                return x.alias == "qw_wallet_rub";
              });
              if (/(?:кз|казахстан|кзт|kz|kazhastan|kzt)/i.test(current)) response = response.accounts.find(function (x) {
                return x.alias == "qw_wallet_kzt";
              });
              if (/(?:евро|евр|ев|eur|euro|eu)/i.test(current)) response = response.accounts.find(function (x) {
                return x.alias == "qw_wallet_eur";
              });
              if (/(?:все валюты|все|всё|all|all current)/i.test(current)) response = response.accounts;
              return _context.abrupt("return", response);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
    /**
     * 
     * @param {Object} params
     * @returns
     */

  }, {
    key: "getOperationHistory",
    value: function getOperationHistory() {
      var params,
          account,
          request,
          _args2 = arguments;
      return regeneratorRuntime.async(function getOperationHistory$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              params = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};

              if (params.rows) {
                _context2.next = 3;
                break;
              }

              throw new APIError("You didn't specify the rows parameter.");

            case 3:
              if (Number(params.rows)) {
                _context2.next = 5;
                break;
              }

              throw new APIError("The rows parameter must not contain text.");

            case 5:
              if (!(params.rows < 1)) {
                _context2.next = 7;
                break;
              }

              throw new APIError("The rows parameter must not be lower than 1.");

            case 7:
              if (!(params.rows > 50)) {
                _context2.next = 9;
                break;
              }

              throw new APIError("The rows parameter must not be more than 50.");

            case 9:
              _context2.next = 11;
              return regeneratorRuntime.awrap(this.getAccountInfo());

            case 11:
              account = _context2.sent;
              request = {
                rows: params.rows,
                operation: params.operation,
                sources: params.sources,
                startDate: params.startDate,
                endDate: params.endDate,
                nextTxnDate: params.nextTxnDate,
                nextTxnId: params.nextTxnId
              };
              return _context2.abrupt("return", this.callMethod({
                method_patch: "GET",
                method: "payment-history/v2/persons/".concat(account.authInfo.personId, "/payments?").concat(qs.stringify(request))
              }));

            case 14:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "getOperationStats",
    value: function getOperationStats() {
      var params,
          account,
          request,
          _args3 = arguments;
      return regeneratorRuntime.async(function getOperationStats$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              params = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
              _context3.next = 3;
              return regeneratorRuntime.awrap(this.getAccountInfo());

            case 3:
              account = _context3.sent;
              request = {
                operation: params.operation,
                sources: params.sources,
                startDate: params.startDate,
                endDate: params.endDate
              };
              return _context3.abrupt("return", this.callMethod({
                method_patch: "GET",
                method: "payment-history/v2/persons/".concat(account.authInfo.personId, "/payments/total?").concat(qs.stringify(request))
              }));

            case 6:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "callMethod",
    value: function callMethod() {
      var params,
          response,
          _args4 = arguments;
      return regeneratorRuntime.async(function callMethod$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              params = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};
              _context4.next = 3;
              return regeneratorRuntime.awrap(fetch("".concat(this.requestOptions.apiUrl).concat(params.method), {
                method: params.method_patch,
                headers: this.requestOptions.headers
              }));

            case 3:
              response = _context4.sent;

              if (!(response.statusText == "Unauthorized")) {
                _context4.next = 6;
                break;
              }

              throw new APIError("You have specified an invalid QIWI API token.");

            case 6:
              _context4.next = 8;
              return regeneratorRuntime.awrap(response.json());

            case 8:
              this.response = _context4.sent;
              return _context4.abrupt("return", this.response);

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }]);

  return API;
}();

exports.API = API;