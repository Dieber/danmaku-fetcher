const request = require('request');
const { BiliFetcher } = require('./bili-fetcher/index.js')
const { QQBotFetcher } = require('./qqbot-fetcher/index.js')




class Fetcher {
    constructor (dat) {
        let {url, data, type, time} = dat
        this.url = url // required
        this.data = data // required
        this.type = type || 'bili'
        this.time = time || 500
        this.timer = null
        this._taskQueue = []
        this._oldMD5Array = []
    }
    static regist (fetcher) {
        Fetcher.list[fetcher._name] = fetcher
    }
    work () {
        this._timer = setInterval (() => {
            if (Fetcher.list[this.type]) {
                Fetcher.list[this.type].fetch(this.url, this.data, this._taskQueue, this._oldMD5Array).then(() => {
                })
            }
        }, this.time)
    }
    stop () {
        this._oldMD5Array.length = 0
        this._taskQueue.length = 0
        clearInterval(this._timer)
    }
    produce (plugin) {
        if (!this._taskQueue || !this._taskQueue.length) {
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
}
Fetcher.list = {}
Fetcher.regist(BiliFetcher)
Fetcher.regist(QQBotFetcher)
module.exports = Fetcher

