const { API } = require("./methods/qiwi.js")
const { APIError } = require("./error/APIError.js");

class Qiwi {
    constructor(params = {}) {
        if (!params.token) throw new APIError("You did not specify the token parameter.")
        this.api = new API({ ...params })
    }
}

exports.Qiwi = Qiwi;