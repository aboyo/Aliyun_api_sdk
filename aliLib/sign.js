"use strict";

const uuid = require('uuid');
const crypto = require('crypto');


exports.generateQueryKV = function(options, apiVersion, accessId, regionId) {
    /* 加入公共參數 */
    options["Version"] = apiVersion;
    options["AccessKeyId"] = accessId;
    options["RegionId"] = regionId;
    options["Format"] = 'json';
    options["SignatureMethod"] = 'HMAC-SHA1';
    options["Timestamp"] = new Date().toISOString();
    options["SignatureVersion"] = '1.0';
    options["SignatureNonce"] = uuid.v1();
    
    return options;
}

/* 產生簽名 */
exports.generateSignature = function(params, salt) {
    let hmac = crypto.createHmac('sha1', new Buffer.from(salt).toString('ascii'));
    hmac.update(encodeQueryKV());
    let digest = hmac.digest('base64');
    return digest;

    /* 編碼params的k-v */
    function encodeQueryKV() {
        let encodedQueryKVArray = [];

        /* 參數排序後進行編碼 */
        let keys = Object.keys(params).sort().forEach(function(item) {
            encodedQueryKVArray.push(xEncode(item) + '=' + xEncode(params[item]));
        });

        /* 用於簽名的字串 */
        return 'GET&%2F&' + xEncode(encodedQueryKVArray.join('&'));
    }

    /* 產生符合API編碼要求的字串 */
    function xEncode(data) {
        return encodeURIComponent(data)
                .replace('(', '%28')
                .replace(')', '%29')
                .replace("'", '%27')
                .replace("!", "%21")
                .replace("*", "%2A");
    };
}