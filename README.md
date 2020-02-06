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
    Access to [gibhub](https://github.com), choose [settings](https://github.com/settings/profile) at right-top of page. Click on _Developer settings_, _Personal access tokens_ then generate your token. Copy it to replace your_token in the following command
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

// Initialize hstx with the network endpoints
var hstx = new HSTx(peerNames, channelName, chaincodeName, orgName, userName);

/**
 * Invoke to chaincode via functions of HSTx-SDK instance
 * @param {Request} req request from client
 * @param {Response} res response to client
 * @param {string} funcName name of HSTx's function
 * @param {function} hstxFunc HSTx's function used to invoke to chaincode
 */
async _invoke(req, res, funcName, hstxFunc, args) {
  try {
    // Invoke to chaincode by 'func'
    let payload = await hstxFunc(args)

    // Response success to client
    res.send({
      status: 200,
      payload: payload
    });
  } catch (err) {
    // Response error to client
    res.send({
      status: 500,
      message: 'Calling failed!',
      err: err.message
    });
  }
}

/** PROPOSAL FUNCTIONS **************************************************/
/**
 * Set route /CreateProposal
 */
createProposal() {
  router.post('/CreateProposal', async (req, res) => {
    let proposal = {
      Message: req.body.Message,
      CreatedBy: req.body.CreatedBy,
      CreatedAt: new Date(),
      UpdatedAt: new Date()
    }
    let args = []
    args.push(JSON.stringify(proposal))
    logger.debug(args)
    logger.debug(proposal)

    _invoke(req, res, "CreateProposal", hstx.createProposal, args)
  });
}
```
