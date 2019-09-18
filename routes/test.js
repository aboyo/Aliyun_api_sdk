var express = require('express');
var router = express.Router();

const sign = require('../aliLib/sign');
const accessKeyId = require('../aliConfig/accessConfig')
const request = require('request');

// test Ali->MediaList api
router.get('/', function (req, res, next) {

    getMediaList((result) => {
        res.json(result);
    })

});

function getMediaList(cb) {

    let apiVersion = "2014-06-18";
    let paramsObject = sign.generateQueryKV({
        "Action": "ListMedia",
    }, apiVersion, accessKeyId.id, accessKeyId.regionId);

    /* 產生signature */
    paramsObject.Signature = encodeURIComponent(sign.generateSignature(paramsObject, accessKeyId.secret + '&'));
    /* 拼接請求Address */
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

module.exports = router;