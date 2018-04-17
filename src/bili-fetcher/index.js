

const request = require('request');

let Utils = require('../lib/utils')



class BiliFetcher {
    static pushQueue (body, _taskQueue, _oldMD5Array) { // 
        let obj = JSON.parse(body)
        let data = obj.data.room
        let newMD5Array = Utils.transToMD5(data)
        if (_oldMD5Array.length === 0) {
            _oldMD5Array.splice(0, _oldMD5Array.length, ...newMD5Array)
        } else {
            for (let i = 0; i < _oldMD5Array.length; i++) {
                if (_oldMD5Array[i] === newMD5Array[0]) {
                    let newData = data.splice(data.length - i, i)
                    _taskQueue.push(...newData)
                    break
                }
            }
            _oldMD5Array.splice(0, _oldMD5Array.length, ...newMD5Array)
        }
    }
    static fetch (url, data, _taskQueue, _oldMD5Array) {
        return new Promise ((resolve, reject) => {
            request({
                url,
                method: "POST",
                form: data,
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    this.pushQueue(body, _taskQueue, _oldMD5Array)
                    resolve()
                } else {
                    reject(error)
                }
            }); 
        })
    }
}

BiliFetcher._name = 'bili'

module.exports = {
    BiliFetcher
}
