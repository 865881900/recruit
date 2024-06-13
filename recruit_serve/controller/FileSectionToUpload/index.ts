
export class FileSectionToUpload {


    unload(req, res) {
        console.log(req.file);
        res.json({result: 'success', data: req.body});
    }
}