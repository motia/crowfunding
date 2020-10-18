# Development

- Start the Truffle project
```bash
cd ./truffle && yarn compile
truffle develop --log
yarn dev
```
- Start the D-App
```bash
cd ./app && yarn start
```
- (Optional) Develop and debug on Remix at [http://localhost:7777]()
```bash
cd ./scripts && bash remix.sh
```
- (Optional) Configure Ipfs url using `app/.env`
```bash
REACT_APP_IPFS_HOST=localhost,
REACT_APP_IPFS_PORT=5001,
REACT_APP_IPFS_SCHEME=http
```

# Deployment

> The D-App will be deployed to `surge.sh` and the smart contract to `ropsten` using infura  

1. Create a new project on [Infura](http://infura.io/) project

2. Fill your project secrets inside `./truffle/secrets.json`. Use `./truffle/secrets.example.json` for reference.

3. Add a CNAME file to the root of the app project (`./app/CNAME.json`)

4. From CLI, run:
```bash
cd ./scripts && bash deploy.sh
```
