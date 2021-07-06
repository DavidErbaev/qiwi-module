const fetch = require("node-fetch");
const qs = require("query-string");
const { APIError } = require("../error/APIError.js");

class API {
    constructor(params = {}) {
        this.token = params.token;
        this.requestOptions = {
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            },
            apiUrl: "https://edge.qiwi.com/"
        }
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
        }
    }

    getAccountInfo() {
        return this.callMethod({
            method_patch: "GET",
            method: "person-profile/v1/profile/current"
        })
    }
    /**
     * 
     * @param {String} current 
     * @returns 
     */
    async getBalance(current) {
        if (!current) throw new APIError("You have not specified the currency in which you want to receive kzt/eur/rub/all.")
        if (Number(current)) throw new APIError("Numbers cannot be used in choosing a currency.")
        let response = await this.callMethod({ method_patch: "GET", method: "funding-sources/v1/accounts/current" })

        if (/(?:руб|рубли|рубль|rb|rub|rubles)/i.test(current)) response = response.accounts.find(x => x.alias == "qw_wallet_rub")
        if (/(?:кз|казахстан|кзт|kz|kazhastan|kzt)/i.test(current)) response = response.accounts.find(x => x.alias == "qw_wallet_kzt")
        if (/(?:евро|евр|ев|eur|euro|eu)/i.test(current)) response = response.accounts.find(x => x.alias == "qw_wallet_eur")
        if (/(?:все валюты|все|всё|all|all current)/i.test(current)) response = response.accounts

        return response;
    }
    /**
     * 
     * @param {Object} params
     * @returns
     */
    async getOperationHistory(params = {}) {
        if (!params.rows) throw new APIError("You didn't specify the rows parameter.");
        if (!Number(params.rows)) throw new APIError("The rows parameter must not contain text.");
        if (params.rows < 1) throw new APIError("The rows parameter must not be lower than 1.");
        if (params.rows > 50) throw new APIError("The rows parameter must not be more than 50.")

        let account = await this.getAccountInfo();
        let request = {
            rows: params.rows,
            operation: params.operation,
            sources: params.sources,
            startDate: params.startDate,
            endDate: params.endDate,
            nextTxnDate: params.nextTxnDate,
            nextTxnId: params.nextTxnId
        }

        return this.callMethod({
            method_patch: "GET",
            method: `payment-history/v2/persons/${account.authInfo.personId}/payments?${qs.stringify(request)}`
        })
    }

    async getOperationStats(params = {}) {
        let account = await this.getAccountInfo();
        let request = {
            operation: params.operation,
            sources: params.sources,
            startDate: params.startDate,
            endDate: params.endDate
        }

        return this.callMethod({
            method_patch: "GET",
            method: `payment-history/v2/persons/${account.authInfo.personId}/payments/total?${qs.stringify(request)}`
        })
    }

    async callMethod(params = {}) {
        let response;

        response = await fetch(`${this.requestOptions.apiUrl}${params.method}`, {
            method: params.method_patch,
            headers: this.requestOptions.headers
        })
        if (response.statusText == "Unauthorized") throw new APIError("You have specified an invalid QIWI API token.")

        this.response = await response.json()

        return this.response;
    }
}

exports.API = API