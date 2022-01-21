const http = require('http')
const httpProxy = require('http-proxy')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})

let host = ''
let port = 0

const arg = process.argv[2]

if (arg === undefined) {
  readline.question(`Please enter the address (host:port)\n`, (arg) => {
    start(arg)
  })
} else {
  start(arg)
}

function start(arg) {
  const split = arg.split(':')
  host = split[0]
  port = parseInt(split[1])

  const localPort = 8087
  const s = http.createServer()
  s.listen(localPort)

  console.log(`Opened proxy on localhost:${localPort} to ${host}:${port}`)

  const proxy = new httpProxy.createProxyServer({
    target: {
      host,
      port,
      protocol: 'ws',
    },
  })

  s.on('request', function (request, response) {
    proxy.web(request, response)
  })

  s.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head)
  })
}
