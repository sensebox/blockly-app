'use strict';

const http = require('http')
const fs = require('fs')

const port = process.argv[2] || 4444
const logfile = process.argv[3] || '/tmp/logs.json'

const resHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
  'Content-Type': 'text/plain',
}

const handleLog = (req, res) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk.toString()
  })

  req.on('end', () => {
    try {
      const msg = JSON.parse(body)
      msg.useragent = req.headers['user-agent']
      fileStream.write(JSON.stringify(msg))
      fileStream.write('\n')

      res.writeHead(200, 'ok', resHeaders)
      res.end('ok')
    } catch (err) {
      console.error(err)
      res.writeHead(400)
      res.end('invalid payload')
    }
  });
}

const requestHandler = (req, res) => {
  console.log(req.method, req.url)
  switch(req.method) {
    case 'OPTIONS':
      res.writeHead(200, 'ok', resHeaders)
      return res.end('ok')
    case 'POST':
      if (req.url === '/log') return handleLog(req, res)
    default:
      res.writeHead(404)
      return res.end('not found')
  }
}

const fileStream = fs.createWriteStream(logfile, 'utf-8')
const server = http.createServer(requestHandler)

server.listen(port, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('listening on', port)
  console.log('writing to', logfile)
})
