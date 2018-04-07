

// let socket = require('socket.io')
const path = require('path');
// const cp=require('child_process')
const serve = require('koa-static');
var fs = require("fs");
const Koa = require('koa');
const app = new Koa();
const main = serve(path.join(__dirname + '/static'));


let Fetcher = require('./fetcher')
let Manager = require('./manager')
let IPlugin = require('./plugin')

// let data = 


let fetcher = new Fetcher ({
    url: 'https://api.live.bilibili.com/ajax/msg',
    type: 'bilibili',
    data: {
        'roomid': 30034,
        'token': '',
        'csrf_token': '',
        'data_source_id': ''
    },
    time: 5000
})

let plugin1 = new IPlugin ('p1', function (fetcher) {
    fetcher.work() // 抓取器开始工作
    setInterval(() => { // 开始消费内容
        let result = fetcher.produce(this)
        if (typeof result === 'string') {
            console.log(result)
        } else {
            console.log(result.command)
        }
    }, 500)
})

Manager.regist(fetcher, plugin1)


app.listen(3000);