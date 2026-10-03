var express = require('express');
var cors = require('cors');
var multer = require('multer');
var crypto = require('crypto');
require('dotenv').config()

var app = express();

var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), function (req, res) {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
    md5: crypto.createHash('md5').update(req.file.buffer).digest('hex'),
  });
});

// multer rejects oversized or malformed uploads with an error
app.use(function (err, req, res, next) {
  res.status(400).json({ error: err.message });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});