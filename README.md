# aliyun_api_sdk

1. `/aliyun_api_sdk/aliConfig/` 中填入Aliyun access key id, secret, regionid.
2. `$ npm start`後於瀏覽器網址輸入:`127.0.0.1:3000/test`

### Call API example
```javascript
const sign = require('../aliLib/sign');
const accessKeyId = require('../aliConfig/accessConfig')
const request = require('request');

function getMediaList(cb) {

    let apiVersion = "2014-06-18";
    let paramsObject = sign.generateQueryKV({
        // 要求參數
        "Action": "ListMedia",
    }, apiVersion, accessKeyId.id, accessKeyId.regionId);

    /* 產生signature */
    paramsObject.Signature = encodeURIComponent(sign.generateSignature(paramsObject, accessKeyId.secret + '&'));
    /* 拼接請求網址 */
    let query = [];
    for (var key in paramsObject) {
        query.push(key + '=' + paramsObject[key]);
    }

    /* 發出請求 */
    request('https://mts.cn-zhangjiakou.aliyuncs.com/?' + query.join('&'), function (err, response, body) {
        // console.log(body);
        cb(body);
    });
}
```
