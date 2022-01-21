# WS Proxy Executable

## Usage

- run the executable from command line with remote address as first argument `host:port` or input it when prompted when running the executable

## Develop

- `npm i`
- `npm run build`

## Developer: Global usage of PKG

- `npm i -g pkg`
- add to `package.json`: `"bin": "index.js",`
- `pkg .` builds executables for Linux, Max, Windows
