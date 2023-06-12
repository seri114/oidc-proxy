
const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs');

const options = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem'),
};
 
const hostname = 'localhost'
const port = 443

const app = next({ dev: false, hostname: 'localhost', port })
const handle = app.getRequestHandler()
 
app.prepare().then(() => {
  createServer(options, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl); 
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on https://${hostname}`)
    })
})



