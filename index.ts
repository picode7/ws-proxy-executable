import * as http from 'http'
import { createProxyServer } from 'http-proxy'
import * as rl from 'readline'

let host = ''
let port = 0

const arg = process.argv[2]

if (arg === undefined) {
  const rlInterface = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  rlInterface.question(`Please enter the remote address "host:port"\n`, (arg) => {
    start(arg)
  })
} else {
  start(arg)
}

function start(arg: string) {
  const split = arg.split(':')
  host = split[0]
  port = parseInt(split[1])

  const localPort = 8087
  const s = http.createServer()
  s.listen(localPort)

  console.log(`Opened proxy on localhost:${localPort} to ${host}:${port}`)

  const proxy = createProxyServer({
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
