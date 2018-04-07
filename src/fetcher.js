const BILIBILI = 'bilibili'
const request = require('request');
var crypto = require("crypto");


let transToMD5 = function (data) {
    let newArray = data.map((item) => {
        return crypto.createHash("md5WithRSAEncryption").update(JSON.stringify(item)).digest("hex")
    })
    return newArray
}



module.exports = class Fetcher {
    constructor (dat) {
        let {url, data, type, time} = dat
        this.url = url // required
        this.data = data // required
        this.type = type || BILIBILI
        this.time = time || 500
        this.timer = null
        this._taskQueue = []
        this._oldMD5Array = []
    }
    work () {
        if (this.type === BILIBILI) {
            this._timer = setInterval (() => {
                this.biliFetcher().then((body) => {
                    let obj = JSON.parse(body)  
                    let data = obj.data.room
                    let newMD5Array = transToMD5(data)
                    if (this._oldMD5Array.length === 0) {
                        this._oldMD5Array.splice(0, this._oldMD5Array.length, ...newMD5Array)
                    } else {
                        for (let i = 0; i < this._oldMD5Array.length; i++) {
                            if (this._oldMD5Array[i] === newMD5Array[0]) {
                                let newData = data.splice(data.length - i, i)
                                this._taskQueue.push(...newData)
                                break
                            }
                        }
                        this._oldMD5Array.splice(0, this._oldMD5Array.length, ...newMD5Array)
                    }
                })
            }, this.time)
        } else if (this.type === 'TODO') {
            // TODO: 其他的一些Fetcher
        }
    }
    stop () {
        this._oldMD5Array.length = 0
        this._taskQueue.length = 0
        clearInterval(this._timer)
    }
    produce (plugin) {
        if (!this._taskQueue.length) {
            return
        }
        if (plugin.name === 'default') {
            let obj = this._taskQueue.splice(0, 1)[0]
            obj.pluginName = 'default'
            obj.command = obj.text
            return obj
        } else {
            let obj
            for (let i = 0; i < this._taskQueue.length; i++) {
                if (this._taskQueue[i].text.split(' ')[0] === plugin.name) {
                    obj = this._taskQueue.splice(i, 1)[0]
                    break
                }
            }
            if (obj) {
                obj.pluginName = obj.text.split(' ')[0]
                obj.command = obj.text.match(/^(\S+)\s(.*)/).slice(1)[1]
                return obj
            } else {
                return
            }
        }
    }
    biliFetcher () {
        return new Promise ((resolve, reject) => {
            request({
                url: this.url,
                method: "POST",
                form: this.data,
            }, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body)
                } else {
                    reject(error)
                }
            }); 
        })
    }
}

