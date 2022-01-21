import * as http from 'http'
import { createProxyServer } from 'http-proxy'
import * as readline from 'readline'

const arg = process.argv[2]
if (arg === undefined) {
  const rlInterface = readline.createInterface({ input: process.stdin, output: process.stdout })
  rlInterface.question(`Please enter the remote address "host:port"\n`, (arg) => {
    start(arg)
  })
} else {
  start(arg)
}

function start(arg: string) {
  const split = arg.split(':')
  const remoteHost = split[0]
  const remotePort = parseInt(split[1])

  const localPort = 8087
  const server = http.createServer()
  server.listen(localPort)

  console.log(`Opened proxy on localhost:${localPort} to ${remoteHost}:${remotePort}`)

  const proxy = createProxyServer({
    target: { host: remoteHost, port: remotePort },
  })

  server.on('request', function (request, response) {
    console.log(`client request ${request.url || ''}`)
    proxy.web(request, response)
  })

  server.on('upgrade', function (req, socket, head) {
    console.log(`client upgrading`)
    socket.on('close', () => console.log(`client lost`))
    proxy.ws(req, socket, head)
  })
}
