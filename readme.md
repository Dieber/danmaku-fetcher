# Dammaku-fetcher

一款基于Node.js的可扩展的弹幕获取器

现暂时仅支持biilibili



## 使用方式



### 0: 安装

npm install danmaku-fetcher --save-dev

### 1: 使用

首先先将插件中的构造函数引入

```javascript

```



设置获取器



```javascript
let fetcher = new Fetcher ({
    url: 'https://api.live.bilibili.com/ajax/msg', // b站弹幕获取接口
    type: 'bilibili', // 获取类型为b站
    data: {
        'roomid': 30034, // 房间号
        'token': '', //其他不需要的留空
        'csrf_token': '',
        'data_source_id': ''
    },
    time: 5000 // 调用接口的间隔时间
})
```



设置自定义的插件



```javascript
let plugin1 = new IPlugin ('p1', function (fetcher) { // arg1: 指令前缀, arg2: 插件回调
    fetcher.work() // 抓取器开始工作
    setInterval(() => { // 开始消费内容,500毫秒轮询一次
        let result = fetcher.produce(this) // 取得一条队列中的弹幕
        if (result) { // 如果能取到
            console.log(result.command) // 获取命令
        }
    }, 500)
})
```

通过管理器将获取器和插件进行注册

```javascript
Manager.regist(fetcher, plugin1)
```



### API接口

#### Fetcher

##### 构造函数:

let fetcher = new Fetcher(data) data 参数:

| 名称 | 描述             | 类型   |
| ---- | ---------------- | ------ |
| type | 设置弹幕获取类型 | string |
| url  | 设置弹幕接口     | string |
| data | 设置接口数据     | object |
| time | 设置轮询时间     | number |

##### 功能方法

```
fetcher.work()
```

获取器开始工作

```javascript
fetcher.stop()
```

获取器停止工作

```
let result = fetcher.produce(this)
```

返回在队列中一条弹幕信息,需将插件本身当作参数传入(即this)

若result为undefined,则可能由于无人发送新弹幕或无人发送符合前缀规则的弹幕

#### IPlugin

构造函数:

```javascript
let plugin1 = new IPlugin (name, callback)
```



| 名称     | 描述                                          | 类型     |
| -------- | --------------------------------------------- | -------- |
| name     | 设置插件名称(即指令前缀), 传入default为无前缀 | string   |
| callback | 设置插件主运行函数                            | function |

#### Manager

功能方法:

Manager.regist(fetcher, plugin)

将获取器和Plugin绑定



## B站效果

若添加有带前缀的插件

用户就可以通过 \[插件名\]\[空格\][指令]的方式进行控制

例如:

addmusic 论理空军

若添加无前缀的插件

用户无论发送何种弹幕都会被获取到并添加进队列中

