'use strict'

// Functions name
const CREATE_ADMIN = "CreateAdmin";
const CREATE_PROPOSAL = "CreateProposal";
const CREATE_QUORUM = "CreateQuorum";
const CREATE_COMMIT = "CreateCommit";

const GET_ALL_ADMIN = "GetAllAdmin"
const GET_ALL_PROPOSAL = "GetAllProposal"
const GET_ALL_QUORUM = "GetAllQuorum"
const GET_ALL_COMMIT = "GetAllCommit"

const GET_ADMIN_BY_ID = "GetAdminByID"
const GET_PROPOSAL_BY_ID = "GetProposalByID"
const GET_QUORUM_BY_ID = "GetQuorumByID"
const GET_COMMIT_BY_ID = "GetCommitByID"

/**
 * To invoke and create data via chaincode (admin, proposal, quorum, commit)
 * @param {HSTx} hstx this 
 * @param {string} funcName function name on chaincode
 * @param {Array} args array of args pass into function on chaincode
 */
async function _createObject(hstx, funcName, args) {
  return await hstx.invoke.invokeChaincode(funcName, args);
}

/**
 * To get query record from network via chaincode (admin, proposal, quorum, commit)
 * @param {HSTx} hstx this 
 * @param {string} funcName function name on chaincode
 * @param {Array} args array of args pass into function on chaincode
 */
async function _getObject(hstx, funcName, args) {
  return await hstx.query.queryChaincode(funcName, args);
}

/**
 * A class contains functions to create and query proposals that make high secure transaction
 * 
 * @param {Function} invokeFunc is a d-app function invoking to functions on chaincode
 * @param {Function} queryFunc is a d-app function querying to functions on chaincode
 */
class HSTx {

  constructor(invokeFunc, queryFunc) {
    if (!invokeFunc || !queryFunc) {
      throw new Error("Argument functions 'invoke, query' are required!")
    }
    this.invoke = invokeFunc;
    this.query = queryFunc;
  }

  /**
   * To create a Admin who has permission to “Approve” HSTx
   * @param {JSONObject} admin include {adminID, name, publickey}
   */
  async createAdmin(admin) {
    let args = [admin.adminID, admin.name, admin.publicKey]
    return await _createObject(this, CREATE_ADMIN, args)
  }

  /**
   * To create a Proposal
   * 
   * @param {any} proposal 
   */
  async createProposal(proposal) {
    let args = [proposal]
    return await _createObject(this, CREATE_PROPOSAL, args)
  }

  /**
   * To create a Quorum
   * @param {JSONObject} quorum include {signature, adminID, proposalID}
   */
  async createQuorum(quorum) {
    let args = [quorum.signature, quorum.adminID, quorum.proposalID]
    return await _createObject(this, CREATE_QUORUM, args)
  }

  /**
   * To commit a proposal
   * @param {string} proposalID 
   */
  async createCommit(proposalID) {
    let args = [proposalID]
    return await _createObject(this, CREATE_COMMIT, args)
  }

  /**
   * To get all admin records
   */
  async getAllAdmin() {
    return await _getObject(this, GET_ALL_ADMIN, [])
  }

  /**
   * To get all proposal records
   */
  async getAllProposal() {
    return await _getObject(this, GET_ALL_PROPOSAL, [])
  }

  /**
   * To get all quorum records
   */
  async getAllQuorum() {
    return await _getObject(this, GET_ALL_QUORUM, [])
  }

  /**
   * To get all commit records
   */
  async getAllCommit() {
    return await _getObject(this, GET_ALL_COMMIT, [])
  }

  /**
   * To get a admin records by ID
   * @param {string} id ID of Admin
   */
  async getAdminByID(id) {
    let args = [id]
    return await _getObject(this, GET_ADMIN_BY_ID, args)
  }

  /**
   * To get a proposal records by ID
   * @param {string} id ID of Proposal
   */
  async getProposalByID(id) {
    let args = [id]
    return await _getObject(this, GET_PROPOSAL_BY_ID, args)
  }

  /**
   * To get a quorum records by ID
   * @param {string} id ID of Quorum
   */
  async getQuorumByID(id) {
    let args = [id]
    return await _getObject(this, GET_QUORUM_BY_ID, args)
  }

  /**
   * To get a commit records by ID
   * @param {string} id ID of Commit
   */
  async getCommitByID(id) {
    let args = [id]
    return await _getObject(this, GET_COMMIT_BY_ID, args)
  }

}

/**
 * Module exports.
 */
module.exports = HSTx