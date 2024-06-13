import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';
import SendData from "../models/sendData"; // 需要先安装multer: npm install multer
import * as mime from 'mime-types';

export class Upload {
    multer: multer.Multer

    constructor() {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads/'); // 指定上传文件保存的目录
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                // 分离文件名和后缀
                const ext = path.extname(file.originalname);
                cb(null, uniqueSuffix + ext); // 生成新的文件名并保留原始后缀
            },
        });
        this.multer = multer({storage: storage});
    }


    uploads(req, res) {
        const send = new SendData();
        try {
            const uploadSingle = this.multer.single('file'); // 'file' 应与前端FormData中的key对应
            uploadSingle(req, res, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send('文件上传出错！');
                }
                // 文件上传成功，此处可以添加额外的逻辑，如保存文件信息到数据库等
                const filePath = req.file.path;
                res.send(send.getOkSendData({
                    path: filePath
                }, '文件上传成功!'))
            });
        } catch (error) {
            res.send(send.getNoSendData(error.message))
        }
    }

    async download(req, res) {
        const send = new SendData();
        try {
            const filename = req.query.filename;
            // 构建完整的文件路径
            const filePath = path.join(__dirname, '..', filename);
            // 使用fs.readFile异步读取文件
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    // 如果文件不存在或读取错误，返回404
                    if (err.code === 'ENOENT') {
                        return res.status(404).send('File Not Found');
                    }
                    // 其他错误
                    console.error(err);
                    return res.status(500).send('Internal Server Error');
                }
                // 获取文件的MIME类型
                const mimeType = mime.lookup(filePath);
                // 设置响应头，包括Content-Type
                res.setHeader('Content-Type', mimeType);
                // 将文件数据作为响应体发送
                res.send(data);
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('服务器错误！');
        }
    }
}

const upload: Upload = new Upload();

export function getUpload(): Upload {
    return upload
}