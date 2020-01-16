# Akachain High Secure Transaction
NodeJS Software Development Kit

SDK for writing node.js decentralized applications to interact with Akachain High Secure Transaction

## Installation

Before installing, [download and install Node.js](https://nodejs.org/en/download/).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install akc-hstx-sdk --registry http://node.sdk.akachain.io:4873 --save
```

## Quick Start

The HSTx is convenient to use after importing and initializing.  
Using async/await functions to get response when calling HSTx's functions.

```js
// Import SDK
var HSTx = require('akc-hstx-sdk');

// Two d-app functions invoke and query to interact with Akachain chaincode.
var invoke = require('../smartcontract/invoke');
var query = require('../smartcontract/query');

// Initialize hstx with two required d-app functions: invoke and query
var hstx = new HSTx(invoke, query);

// Calling functions via hstx
async createProposal() {
  var proposal = { proposal: 'something' }
  var payload = await hstx.createProposal(proposal);
}
```
