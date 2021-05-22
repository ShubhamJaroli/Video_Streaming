const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res) => {
    res.status(200).send("Welcome User");
});

app.get('/video',(req,res) => {
    res.sendFile(__dirname+'/video/cj.mp4')
});

app.get('/video/streaming',(req,res) => {
    try {
        const {range="audio/mp4"} = req.headers;
        console.log(range,"range");
        const videoPath = __dirname+'/video/uri.mp4';
        const videoSize = fs.statSync(videoPath).size;
        console.log(videoSize,"videoSize")
        const chunk_size = 10 ** 6;
        console.log(chunk_size,'chunk_size')
        const start = Number(range.replace(/\D/g,""));
        //console.log(start,"Start")
        const end = Math.min(start + chunk_size,videoSize - 1);
        //console.log(end,"end")
        const contentLength = end - start + 1;
        //console.log(contentLength,"contentLength")
        const headers = {
            "Content-Range":`bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges":"bytes",
            "Content-Length": contentLength,
            "Content-Type":"video/mp4"
        };
        //console.log(headers,"headers")
        res.writeHead(206,headers);
        const videoStream = fs.createReadStream(videoPath, {start, end});
        videoStream.pipe(res);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})
app.post('/*',(req,res) => {
    res.status(400).send('Not POST '+ req.url );
});

app.get('/*',(req,res) => {
    res.status(400).send('Not GET '+ req.url );
});

app.listen(3000,() => {
    console.log('Server start at 3000');
});