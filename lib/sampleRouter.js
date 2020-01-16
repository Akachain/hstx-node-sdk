const express = require('express');
const HSTx = require('akc-hstx-sdk');

const invoke = require('../smartcontract/invoke');
const query = require('../smartcontract/query');

/**
 * A class to initialize router instance
 */
class Router {

  constructor() {
    this.router = express.Router();
    this.hstx = new HSTx(invoke, query);
    this._setRoutes()
  }

  /**
   * Check validation of secret key in header of request
   * @param {Request} req request from client
   * @param {Response} res request to client
   */
  _checkSecretKey(req, res) {
    if (req.headers['secretkey'] != CFG_SECRETKEY) {
      logger.error('Secretkey is invalid!')
      res.send({
        status: 500,
        message: 'Secretkey is invalid!'
      });
      return false
    }
    return true
  }

  /**
   * Set routes for API
   */
  async _setRoutes() {
    this.createAdmin()
    this.createProposal()
    this.createQuorum()
    this.createCommit()

    this.getAllAdmin()
    this.getAllProposal()
    this.getAllQuorum()
    this.getAllCommit()

    this.getAdminByID()
    this.getProposalByID()
    this.getQuorumByID()
    this.getCommitByID()
  }

  /**
   * Invoke to chaincode via functions of HSTx-SDK instance
   * @param {Request} req request from client
   * @param {Response} res response to client
   * @param {string} funcName name of HSTx's function
   * @param {function} hstxFunc HSTx's function used to invoke to chaincode
   */
  async _invoke(req, res, funcName, hstxFunc) {
    if (!this._checkSecretKey(req, res)) return

    logger.info(`==================== INVOKE ON CHAINCODE TO ${funcName.toUpperCase()} ==================`);
    try {
      // Invoke to chaincode by 'func'
      let payload = await hstxFunc

      // Response success to client
      res.send({
        status: 200,
        payload: payload
      });
    } catch (err) {
      logger.error(err)
      // Response error to client
      res.send({
        status: 500,
        message: 'Calling failed!',
        err: err.message
      });
    }
  }

  /**
   * Query to chaincode via functions of HSTx-SDK instance
   * @param {Request} req request from client
   * @param {Response} res response to client
   * @param {string} funcName name of HSTx's function
   * @param {function} hstxFunc HSTx's function used to query to chaincode
   */
  async _query(req, res, funcName, hstxFunc) {
    if (!this._checkSecretKey(req, res)) return

    logger.info(`==================== QUERY ON CHAINCODE TO ${funcName.toUpperCase()} ==================`);
    try {
      // Query to chaincode by 'hstxFunc'
      let result = await hstxFunc
      let obj = JSON.parse(result);

      // Response success to client
      res.send(obj);
    } catch (err) {
      logger.error(err)
      // Response error to client
      res.send({
        status: 500,
        message: 'Calling failed',
        err: err.message
      });
    }
  }

  /**
   * Set route /CreateAdmin
   */
  createAdmin() {
    this.router.post('/CreateAdmin', async (req, res) => {
      let AdminID = req.body.AdminID
      let Name = req.body.Name
      let signer = await new Signer("", true, `./src/data/${AdminID}/`)

      this._invoke(req, res, "Create Admin", this.hstx.createAdmin({
        adminID: AdminID,
        name: Name,
        publicKey: signer.publicKey
      }))
    });
  }

  /**
   * Set route /CreateProposal
   */
  createProposal() {
    this.router.post('/CreateProposal', async (req, res) => {
      this._invoke(req, res, "Create Proposal", this.hstx.createProposal(req.body.Data))
    });
  }

  /**
   * Set route /CreateQuorum
   */
  createQuorum() {
    this.router.post('/CreateQuorum', async (req, res) => {
      let Proposal = req.body.Proposal
      let AdminID = req.body.AdminID
      let ProposalID = req.body.ProposalID
      logger.info('Proposal: ' + Proposal)

      let signer = await new Signer(Proposal, false, `./src/data/${AdminID}/`)
      signer.sign()

      this._invoke(req, res, "Create Quorum", this.hstx.createQuorum({
        signature: signer.signature,
        adminID: AdminID,
        proposalID: ProposalID
      }))
    });
  }

  /**
   * Set route /CreateCommit
   */
  createCommit() {
    this.router.post('/CreateCommit', async (req, res) => {
      this._invoke(req, res, "Create Commit", this.hstx.createCommit(req.body.ProposalID))
    });
  }

  /**
   * Set route /GetAllAdmin
   */
  getAllAdmin() {
    this.router.get('/GetAllAdmin', async (req, res) => {
      this._query(req, res, "Get All Admin", this.hstx.getAllAdmin())
    });
  }

  /**
   * Set route /GetAllProposal
   */
  getAllProposal() {
    this.router.get('/GetAllProposal', async (req, res) => {
      this._query(req, res, "Get All Proposal", this.hstx.getAllProposal())
    });
  }

  /**
   * Set route /GetAllQuorum
   */
  getAllQuorum() {
    this.router.get('/GetAllQuorum', async (req, res) => {
      this._query(req, res, "Get All Quorum", this.hstx.getAllQuorum())
    });
  }

  /**
   * Set route /GetAllCommit
   */
  getAllCommit() {
    this.router.get('/GetAllCommit', async (req, res) => {
      this._query(req, res, "Get All Commit", this.hstx.getAllCommit())
    });
  }

  /**
   * Set route /GetAdminByID/:id
   */
  getAdminByID() {
    this.router.get('/GetAdminByID/:id', async (req, res) => {
      this._query(req, res, "Get Admin By ID", this.hstx.getAdminByID(req.params.id))
    });
  }

  /**
   * Set route /GetProposalByID/:id
   */
  getProposalByID() {
    this.router.get('/GetProposalByID/:id', async (req, res) => {
      this._query(req, res, "Get Proposal By ID", this.hstx.getProposalByID(req.params.id))
    });
  }

  /**
   * Set route /GetQuorumByID/:id
   */
  getQuorumByID() {
    this.router.get('/GetQuorumByID/:id', async (req, res) => {
      this._query(req, res, "Get Quorum By ID", this.hstx.getQuorumByID(req.params.id))
    });
  }

  /**
   * Set route /GetCommitByID/:id
   */
  getCommitByID() {
    this.router.get('/GetCommitByID/:id', async (req, res) => {
      this._query(req, res, "Get Commit By ID", this.hstx.getCommitByID(req.params.id))
    });
  }
}

module.exports = Router;