//创建签名函数sign.js

var CryptoJS = require('./cryptojs/cryptojs.js');

// 密钥 16 位
var key = 'luzhikeji0000003';
// 初始向量 initial vector 16 位
var iv = 'xiaoluzhushou123';
// key 和 iv 可以一致
key = CryptoJS.enc.Utf8.parse(key);
iv = CryptoJS.enc.Utf8.parse(iv);
//加密
function encrypted(param) {
  var encrypted = CryptoJS.AES.encrypt(param, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  encrypted = encrypted.toString();
  return encrypted;
}
//解密
function decrypted(param) {
  var decrypted = CryptoJS.AES.decrypt(param, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
  return decrypted;
}

export const GetSign = function () {
  var pswd = "LZPhoto"; //可替换成AppID ,带入进行加密
  var timestamp = Date.parse(new Date());
  var mi = encrypted(pswd + "_" + timestamp);
  return encodeURIComponent(mi);
}
