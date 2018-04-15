
var crypto = require("crypto");


class Utils {
    static transToMD5 (data) {
        let newArray = data.map((item) => {
            return crypto.createHash("md5WithRSAEncryption").update(JSON.stringify(item)).digest("hex")
        })
        return newArray
    }
}

module.exports = Utils