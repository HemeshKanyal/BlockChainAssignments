const express = require('express');
const multer = require('multer');
const { create } = require('ipfs-http-client');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

const ipfs = create({ url: 'http://127.0.0.1:5001' });

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = fs.readFileSync(req.file.path);
    const result = await ipfs.add(file);
    res.send({
        message: "File uploaded to IPFS",
        cid: result.cid.toString()
    });
});
app.listen(3000, () => console.log("Server running on port 3000"));