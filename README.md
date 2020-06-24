# Akachain High Secure Transaction
NodeJS Software Development Kit

SDK for writing node.js decentralized applications to interact with Akachain High Secure Transaction

## Installation

1. Before installing, [download and install Node.js](https://nodejs.org/en/download/).

2. Grant access permission for registry https://npm.pkg.github.com/

    Create file .npmrc
    ```js
    // Linux/MacOS command
    touch .npmrc
    ```
    Config registry to install akaChain SDK
    ```js
    // Linux/MacOS command
    echo "registry=https://npm.pkg.github.com/Akachain" >> .npmrc
    ```
    Get your personal access token on github:
    Access to [github](https://github.com), choose [settings](https://github.com/settings/profile) at right-top of page. Click on _Developer settings_, _Personal access tokens_ then generate your token. Copy it to replace your_token in the following command
    ```js
    // Linux/MacOS command
    echo "//npm.pkg.github.com/:_authToken=your_token" >> .npmrc
    ```

3. Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

    ```bash
    npm install @akachain/hstx-node-sdk
    ```

## Quick Start

The HSTx is convenient to use after importing and initializing.  
Using async/await functions to get response when calling HSTx's functions.

```js
// Import SDK
const HSTx = require('@akachain/hstx-node-sdk');

// Initialize hstx
var hstx = new HSTx();

// Example using SUPER ADMIN FUNCTIONS
let superAdminName = "Super Admin 1";
let registrationData = "BQSOfoKf_m5Xtq-7ci7ecBlgkVsqd_1eMWRMbibqLKvy6IVkq4XvSE4E603Ax31Yzqvmijv1zrtymGC137142GdDQKE3-Vu6KyvA__1qBtHMQ453D1fcwHeNZYG0jQgI7rXrUt7p-7n38qIxzfjptZyQOwVE0h1Fl6sib2OYknpj53QwggE0MIHboAMCAQICCnd4pWTIyIslRLQwCgYIKoZIzj0EAwIwFTETMBEGA1UEAxMKVTJGIElzc3VlcjAaFwswMDAxMDEwMDAwWhcLMDAwMTAxMDAwMFowFTETMBEGA1UEAxMKVTJGIERldmljZTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABI5vkvXlovobtYfUv2QGambtWJ62i3koZvB3iRHIkwQeb0fCWNnxIo0p-XqbEBkV7LMqy0y-plss896MGsQibXCjFzAVMBMGCysGAQQBguUcAgEBBAQDAgQwMAoGCCqGSM49BAMCA0gAMEUCIQDBo6aOLxanIUYnBX9iu3KMngPnobpi0EZSTkVtLC8_cwIgC1945RGqGBKfbyNtkhMifZK05n7fU-gW37Bdnci5D94wRAIgUYdDQLq2DAldyTI4UZVeTSJ5k9lPJ8802OcsWlBpdY8CIDGFY4Ux8i2tcFdQHeQsAWMn_X3pZrBigw6WqcfRg-ns";

hstx.createSuperAdmin(superAdminName, registrationData)
  .then(superAdminObject => console.log(superAdminObject))
```

```js
// Initialize hstx with the network connection
var peerNames = 'peeer1',
  channelName = 'mychannel',
  chaincodeName = 'sample_cc',
  orgName = 'Org1',
  userName = 'user1';
var hstx2 = HSTx.instantWithNetworkConnection(peerNames, channelName, chaincodeName, orgName, userName);

// Example using PROPOSAL FUNCTIONS
async function createProposal() {
  try {
    let message = "Message";
    let createdBy = "Admin1";

    let payload = await hstx2.createProposal(message, createdBy)

    if (payload.Result.Status == 200) {
      // Responding success to the caller
      console.log({
        status: 200,
        payload: payload
      });
    }
  } catch (err) {
    throw err
  }
}
createProposal()
```