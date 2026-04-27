const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { create } = require('ipfs-http-client');
const fs = require('fs');

const app = express();
app.use(cors());

const upload = multer({ dest: 'uploads/' });
const ipfs = create({ url: 'http://127.0.0.1:5001' });

/* =========================
   📤 UPLOAD ROUTE
   (Receives already encrypted bytes)
========================= */
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = fs.readFileSync(req.file.path);
        
        // Add to IPFS as-is (it's already encrypted by the frontend)
        const result = await ipfs.add(file);

        // Cleanup local file
        fs.unlinkSync(req.file.path);

        res.json({
            message: "File uploaded to IPFS",
            cid: result.cid.toString()
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Upload error");
    }
});

/* =========================
   📥 RETRIEVE ROUTE
   (Sends encrypted bytes back to frontend)
========================= */
app.get('/file/:cid', async (req, res) => {
    try {
        const chunks = [];
        for await (const chunk of ipfs.cat(req.params.cid)) {
            chunks.push(chunk);
        }
        const fileData = Buffer.concat(chunks);
        
        // Send raw bytes (frontend will decrypt)
        res.send(fileData);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error retrieving file");
    }
});

/* =========================
   🚀 START SERVER
========================= */
app.listen(3001, () => {
    console.log("Backend running on port 3001");
});