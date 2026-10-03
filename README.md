# File Metadata Microservice

A microservice that accepts a file upload and returns the file's metadata — name, MIME
type, size in bytes, and an MD5 checksum.

Built for the freeCodeCamp project *File Metadata Microservice*.

## Setup

```bash
npm install
npm start
```

The server listens on port `3000` (override with `PORT=xxxx npm start`). Open
<http://localhost:3000> to use the upload form.

## API

### `POST /api/fileanalyse`

Send the file as multipart form data. The field must be named `upfile` — the bundled
form uses that name.

```bash
curl -F "upfile=@./sample.png" localhost:3000/api/fileanalyse
```

```json
{
  "name": "sample.png",
  "type": "image/png",
  "size": 20480,
  "md5": "9b79a2dd75c2b64481659bdcde010e38"
}
```

A request with no file returns `400` with `{ "error": "No file uploaded" }`.

## Implementation

`multer` handles the multipart parsing with `memoryStorage()`, so the file is held in
`req.file.buffer` and nothing is written to disk. That buffer is what `crypto` hashes to
produce `md5`.

`size` comes from `req.file.size` and `type` from `req.file.mimetype` — both reported by
multer from the part's own `Content-Type` header, so the client controls what is echoed
back.

Uploads are capped at 25 MB by the multer `limits` option; anything larger or malformed
is turned into a `400` by the error handler at the bottom of `index.js`.

## Frontend

`views/index.html` is the boilerplate form: a file input named `upfile` posting to
`/api/fileanalyse`. `public/script.js` intercepts the submit and renders the returned
metadata into the `#output` heading; without JavaScript the form still works and simply
shows the raw JSON response.

## Notes

- MD5 is included because the reference app displays it. It is not a security control —
  use SHA-256 if you need integrity checking.
- Files are never persisted, so there is no upload directory to secure or clean up.