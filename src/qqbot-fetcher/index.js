let fs = require('fs')

const myPythonPath = 'C:/Users/a4511/.qqbot-tmp/plugins/taskqueue.txt'
// TODO Fetch需要对比oldmd5

class QQBotFetcher {
    static fetch (url, data, _taskQueue, _oldMD5Array) {
      return new Promise ((resolve, reject) => {

        fs.open(myPythonPath, 'r+', function(err, fd) {
          if (err) {
            reject()
          } else {
            fs.readFile(fd, 'utf-8', function (err, data) {
              if (err) {
                reject()
              } else { // 读取成功
                let arr = data.split('\n')
                let objectArr = arr.map((element) => {
                  let obj = {}
                  obj.text = element
                  return obj
                })
                _taskQueue.push(...objectArr)
                fs.writeFile(myPythonPath, '', function (err) {
                  if (err) {
                    reject()
                  } else {
                    fs.close(fd, () => {
                      resolve()
                    }) 
                  }
                })
              }
            })
          }
        })
      })
    }
}

QQBotFetcher._name = 'qqbot'

module.exports = {
  QQBotFetcher
}


