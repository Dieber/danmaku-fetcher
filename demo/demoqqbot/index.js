
let {Fetcher, Manager, IPlugin} = require('../../index.js')


let fetcher = new Fetcher ({
    type: 'qqbot',
    time: 5000
})

let plugin1 = new IPlugin ('ms', function (fetcher) {
    fetcher.work() // 抓取器开始工作
    setInterval(() => { // 开始消费内容
        let result = fetcher.produce(this)
        if (result) {
            console.log('哈哈' + result.text) 
        }
    }, 500)
})


Manager.regist(fetcher, plugin1)


