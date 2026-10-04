const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const utils = require('./modules/utils.js');
const messages = require('./lang/en/en.json');

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // Part B: getDate
    if (pathname.includes('getDate')) {
        const name = parsedUrl.query.name || '';
        const message = messages.greeting.replace('%1', name) + ' ' + utils.getDate();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<p style="color: blue;">${message}</p>`);
        return;
    }

    // Part C.1: writeFile
    if (pathname.includes('writeFile')) {
        const text = parsedUrl.query.text || '';
        const filePath = path.join(__dirname, 'file.txt');
        fs.appendFile(filePath, text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end('<p>500 Internal Server Error</p>');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<p>Appended: ${text}</p>`);
        });
        return;
    }

    // Part C.2: readFile
    if (pathname.includes('readFile')) {
        const filename = pathname.split('/readFile/')[1] || '';
        const filePath = path.join(__dirname, filename);
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<p>404 File Not Found: ${filename}</p>`);
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<pre>${data}</pre>`);
        });
        return;
    }

    // 404 for any other path
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<p>404 Not Found</p>');
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
