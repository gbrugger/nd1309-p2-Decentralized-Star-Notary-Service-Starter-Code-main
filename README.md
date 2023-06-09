# ND1309 C2 Ethereum Smart Contracts, Tokens and Dapps - Project Starter

### Required Specs

1. Your ERC-721 Token Name

`Star High Token`

2. Your ERC-721 Token Symbol

`SHT`

3. Version of the Truffle and OpenZeppelin used

```bash
Truffle v5.9.2 (core: 5.9.2)
OpenZeppelin 2.5.1
```

4. Your Token Address on the ~~Rinkeby~~ **Sepolia** Network

[https://sepolia.etherscan.io/address/0x4af5c6f5b08b6936a029407f4eadd9119c3df769](https://sepolia.etherscan.io/address/0x4af5c6f5b08b6936a029407f4eadd9119c3df769)

**Example Star Created:**

https://sepolia.etherscan.io/tx/0x782cf125437dda9ebe0e7a9dbae8eb90bf97429d0fc4e24d77f648e2698ecec9

**Other:**

```bash
Ganache v7.8.0
Solidity - 0.5.16 (solc-js)
Node v14.21.3
Web3.js v1.10.0
```

## Original Instructions

**PROJECT: Decentralized Star Notary Service Project** - For this project, you will create a DApp by adding functionality with your smart contract and deploy it on the public testnet.

### ToDo

This Starter Code has already implemented the functionalities you implemented in the StarNotary (Version 2) exercise, and have comments in all the files you need to implement your tasks.

### Dependencies

For this project, you will need to have:

1. **Node and NPM** installed - NPM is distributed with [Node.js](https://www.npmjs.com/get-npm)

```bash
# Check Node version
node -v
# Check NPM version
npm -v
```

2. **Truffle v5.X.X** - A development framework for Ethereum.

```bash
# Unsinstall any previous version
npm uninstall -g truffle
# Install
npm install -g truffle
# Specify a particular version
npm install -g truffle@5.0.2
# Verify the version
truffle version
```

2. **Metamask: 5.3.1** - If you need to update Metamask just delete your Metamask extension and install it again.

3. [Ganache](https://www.trufflesuite.com/ganache) - Make sure that your Ganache and Truffle configuration file have the same port.

4. **Other mandatory packages**:

```bash
cd app
# install packages
npm install --save  openzeppelin-solidity@2.3
npm install --save  truffle-hdwallet-provider@1.0.17
npm install webpack-dev-server -g
npm install web3
```

### Run the application

1. Clean the frontend

```bash
cd app
# Remove the node_modules
# remove packages
rm -rf node_modules
# clean cache
npm cache clean
rm package-lock.json
# initialize npm (you can accept defaults)
npm init
# install all modules listed as dependencies in package.json
npm install
```

2. Start Truffle by running

```bash
# For starting the development console
truffle develop
# truffle console

# For compiling the contract, inside the development console, run:
compile

# For migrating the contract to the locally running Ethereum network, inside the development console
migrate --reset

# For running unit tests the contract, inside the development console, run:
test
```

3. Frontend - Once you are ready to start your frontend, run the following from the app folder:

```bash
cd app
npm run dev
```

---

### Important

When you will add a new Rinkeyby Test Network in your Metamask client, you will have to provide:

| Network Name      | New RPC URL              | Chain ID |
| ----------------- | ------------------------ | -------- |
| Private Network 1 | `http://127.0.0.1:9545/` | 1337     |

The chain ID above can be fetched by:

```bash
cd app
node index.js
```

## Troubleshoot

#### Error 1

```
'webpack-dev-server' is not recognized as an internal or external command
```

**Solution:**

- Delete the node_modules folder, the one within the /app folder
- Execute `npm install` command from the /app folder

After a long install, everything will work just fine!

#### Error 2

```
ParserError: Source file requires different compiler version.
Error: Truffle is currently using solc 0.5.16, but one or more of your contracts specify "pragma solidity >=0.X.X <0.X.X".
```

**Solution:** In such a case, ensure the following in `truffle-config.js`:

```js
// Configure your compilers
compilers: {
  solc: {
    version: "0.5.16", // <- Use this
    // docker: true,
    // ...
```
