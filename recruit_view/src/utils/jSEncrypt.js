
// 使用JSEncrypt,加密
import {JSEncrypt} from "jsencrypt";
const encrypt = new JSEncrypt();
const publicKey =  `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGFRVSli5UWwXh0YbjlEQblPyjiP
X7wb2hjoY16xTGuFhLhd1QkdcchpD04l0g1wkBY+RQlAhxnSeZH3nBbJQT9K79wP
FZlgT3VjuQjep2WkcKHGn/y5cjdLo98oGGqUCik/SpR2VmMzCuRPDAV1RasVy6uy
qc4npvCTxbnl2HR3AgMBAAE=
-----END PUBLIC KEY-----`

// 返回一个对密码进行RSA-OAEP加密的函数
export function encryptJSEncrypt(password) {
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(password);;
}
