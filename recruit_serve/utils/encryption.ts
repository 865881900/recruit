import {privateDecrypt, constants, createHash} from 'crypto';


// 用来加生成秘钥和解密
export class Encryption {
    private static privateKey: string = `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgGFRVSli5UWwXh0YbjlEQblPyjiPX7wb2hjoY16xTGuFhLhd1Qkd
cchpD04l0g1wkBY+RQlAhxnSeZH3nBbJQT9K79wPFZlgT3VjuQjep2WkcKHGn/y5
cjdLo98oGGqUCik/SpR2VmMzCuRPDAV1RasVy6uyqc4npvCTxbnl2HR3AgMBAAEC
gYAXzOhjAsjHzmZ1/y+V2depFpaCVq43NyiTxuHmmr3x3emjnW8ol4boWKlhl2ZT
2x+iEQCZTqq76fnJdSE7gWTvZJCpLCX39B2HOuO1O1jtX0DO0T9+NAsDrfndiJol
ACJfe51lFu0n0aDMNwdmQ+N73Rp9JwJcHaMZJzeBJaB0QQJBAKC3xFjpcybIVbDb
ALsNDT1kKgloYyu+HnWaWZblcySObTb3Lg4t36QOgq44YD2Sw9jh6+KUZkHwr/Un
PfQLbskCQQCbA0sQloWDOyvUrl6H79D06NlT1CJ5LQqzcvHyL78dE9vA0iSYziHU
OxcSzzdntv7+tljdcaykHH4rvNNC+ik/AkBr84NbBVNnVWDZbgDLozSla8Ygk5Ep
LIZhD8/lXzE7+L67EMRKmd2B4I0+YHekZBRQdU9v3aXh3L0TucwPRC6hAkAF29kB
dn7zV9AvSKvf/WtrZkWYioMHC3HFGIoWekGB6tc6cXbao6fZqqYTmutgKyV2IRQ4
wmwhA8atBoUBmgznAkBIJZ2M3RLEafz6/IMuGR9O+W6zv6mmghyCfba5kSg0hqMW
njloV0KdWVtjSEWnsZNrXQQzvbKbaGRbUQx5+URm
-----END RSA PRIVATE KEY-----`

    // crypto 解密
    decryptByCrypto(encryptedData: string): string {
        // 将Base64格式的加密数据转换为Buffer
        const _encryptedData = Buffer.from(encryptedData, 'base64');

        const decryptedData = privateDecrypt(
            {
                key: Encryption.privateKey,
                padding: constants.RSA_PKCS1_PADDING, // 指定填充方式
            },
            _encryptedData
        );

        return decryptedData.toString();
    }

    // hash加密密码
    hashPassword(password: string): string {
        const hash = createHash('sha256');
        hash.update(password);
        return hash.digest('hex');
    }

}

const encryption = new Encryption();

export function getEncryption(): Encryption {
    return encryption
}