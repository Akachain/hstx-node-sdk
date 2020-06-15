'use strict'

const akcSDK = require('@akachain/akc-node-sdk');
const u2f = require('@akachain/u2f');

require("./enum")

// Declare common parameters
let _peerNames = '',
  _channelName = '',
  _chaincodeName = '',
  _orgName = '',
  _userName = '';

/**
 * To invoke and create data via chaincode (admin, proposal, quorum, commit)
 * @param {string} funcName function name on chaincode
 * @param {Array} args array of args pass into function on chaincode
 */
async function _createObject(funcName, args) {
  // logger.debug(args)
  return await akcSDK.invoke(_peerNames, _channelName, _chaincodeName, funcName, args, _orgName, _userName);
}

/**ß
 * To get query record from network via chaincode (admin, proposal, quorum, commit)
 * @param {string} funcName function name on chaincode
 * @param {Array} args array of args pass into function on chaincode
 */
async function _getObject(funcName, args) {
  // logger.debug(args)
  return await akcSDK.query(_peerNames, _channelName, _chaincodeName, funcName, args, _orgName, _userName);
}

/**
 * A class contains functions to create and query proposals that make high secure transaction
 * @param {String} peerNames 
 * @param {String} channelName 
 * @param {String} chaincodeName 
 * @param {String} orgName 
 * @param {String} userName 
 */
class HSTx {

  constructor(peerNames, channelName, chaincodeName, orgName, userName) {
    if (!peerNames || !channelName || !chaincodeName || !orgName || !userName) {
      throw new Error(`Argument functions 'peerNames, channelName, chaincodeName, orgName, userName' are required! \nGiven: ${peerNames} ${channelName} ${chaincodeName} ${orgName} ${userName}`)
    }
    _peerNames = peerNames;
    _channelName = channelName;
    _chaincodeName = chaincodeName;
    _orgName = orgName;
    _userName = userName;
  }

  /** SUPER ADMIN FUNCTIONS **************************************************/
  /**
   * To create a Super Admin who has permission to “Approve” HSTx
   * @param {String} superAdminName name of Super Admin
   * @param {String} registrationData data retrieved from U2F USB
   */
  async createSuperAdmin(superAdminName, registrationData) {

    // Parse registrationData.
    var buf = new Buffer(registrationData, 'base64');
    buf[0];
    buf = buf.slice(1);
    var publicKey = buf.slice(0, 65);
    buf = buf.slice(65);
    var keyHandleLen = buf[0];
    buf = buf.slice(1);
    var keyHandle = buf.slice(0, keyHandleLen);
    buf = buf.slice(keyHandleLen);
    var certLen = u2f.asnLen(buf);
    buf.slice(0, certLen);
    buf = buf.slice(certLen);
    var signLen = u2f.asnLen(buf);
    buf.slice(0, signLen);
    buf = buf.slice(signLen);
    if (buf.length !== 0)
      console.error("U2F Registration Warning: registrationData has extra bytes: " + buf.toString('hex'));

    // SEND
    let superAdmin = {
      SuperAdminID: u2f.toWebsafeBase64(keyHandle),
      Name: superAdminName,
      PublicKey: u2f.convertCertToPEM(publicKey)
    }

    let args = []
    args.push(JSON.stringify(superAdmin))
    logger.debug(args)

    return await _createObject(CREATE_SUPER_ADMIN, args)
  }

  /**
   * To update a SuperAdmin who has permission to “Approve” HSTx
   * @param {String} superAdminID 
   * @param {String} superAdminName 
   * @param {String} publicKey 
   * @param {String} status 
   */
  async updateSuperAdmin(superAdminID, superAdminName, publicKey, status) {
    let superAdmin = {
      SuperAdminID: superAdminID,
      Name: superAdminName,
      PublicKey: publicKey,
      Status: status
    }

    let args = []
    args.push(JSON.stringify(superAdmin))
    logger.debug(args)

    return await _createObject(UPDATE_SUPER_ADMIN, args)
  }

  /**
   * To get all Super Admin records
   */
  async getAllSuperAdmin() {
    return await _getObject(GET_ALL_SUPER_ADMIN, [])
  }

  /**
   * To get a Super Admin records by ID
   * @param {string} id ID of Admin
   */
  async getSuperAdminByID(id) {
    let args = [id]
    return await _getObject(GET_SUPER_ADMIN_BY_ID, args)
  }

  /** ADMIN FUNCTIONS ********************************************************/
  /**
   * To create a Admin who has permission to “Create” a Proposal
   * @param {String} adminName name of Admin
   */
  async createAdmin(adminName) {
    let admin = {
      Name: adminName
    }

    let args = []
    args.push(JSON.stringify(admin))
    logger.debug(args)
    return await _createObject(CREATE_ADMIN, args)
  }

  /**
   * 
   * @param {JSONObject} admin include {adminID, name, publickey}
   */

  /**
   * To update a Admin who has permission to “Create” Proposal
   * @param {String} adminID 
   * @param {String} name 
   * @param {String} status 
   */
  async updateAdmin(adminID, name, status) {
    let admin = {
      AdminID: adminID,
      Name: name,
      Status: status
    }

    let args = []
    args.push(JSON.stringify(admin))
    logger.debug(args)
    return await _createObject(UPDATE_ADMIN, args)
  }

  /**
   * To get all admin records
   */
  async getAllAdmin() {
    return await _getObject(GET_ALL_ADMIN, [])
  }

  /**
   * To get a admin records by ID
   * @param {string} id ID of Admin
   */
  async getAdminByID(id) {
    let args = [id]
    return await _getObject(GET_ADMIN_BY_ID, args)
  }

  /** PROPOSAL FUNCTIONS *****************************************************/
  /**
   * To create a Proposal
   * @param {String} message message to sign
   * @param {String} createdBy proposal creater
   */
  async createProposal(message, createdBy) {
    let proposal = {
      Message: message,
      CreatedBy: createdBy,
      CreatedAt: new Date(),
      UpdatedAt: new Date()
    }

    let args = []
    args.push(JSON.stringify(proposal))
    logger.debug(args)
    return await _createObject(CREATE_PROPOSAL, args)
  }

  /**
   * To update a Proposal who has permission to “Approve” HSTx
   * @param {String} proposalID proposal ID
   * @param {String} message message to sign
   * @param {String} createdBy proposal creater
   * @param {String} status proposal status: pending, approved, committed
   */
  async updateProposal(proposalID, message, createdBy, status) {
    let proposal = {
      ProposalID: proposalID,
      Message: message,
      CreatedBy: createdBy,
      Status: status,
      UpdatedAt: new Date()
    }

    let args = []
    args.push(JSON.stringify(proposal))
    logger.debug(args)
    return await _createObject(UPDATE_PROPOSAL, args)
  }

  /**
   * To commit a Proposal who has permission to “Approve” HSTx
   * @param {String} proposalID 
   */
  async commitProposal(proposalID) {
    let proposal = {
      ProposalID: proposalID,
      UpdatedAt: new Date()
    }

    let args = []
    args.push(JSON.stringify(proposal))
    logger.debug(args)
    return await _createObject(COMMIT_PROPOSAL, args)
  }

  /**
   * To get all proposal records
   */
  async getAllProposal() {
    return await _getObject(GET_ALL_PROPOSAL, [])
  }

  /**
   * To get a proposal records by ID
   * @param {string} id ID of Proposal
   */
  async getProposalByID(id) {
    let args = [id]
    return await _getObject(GET_PROPOSAL_BY_ID, args)
  }

  /**
   * To get a proposal records by ID
   * @param {string} id ID of Super Admin
   */
  async getPendingProposalBySuperAdminID(id) {
    let args = [id]
    return await _getObject(GET_PENDING_PROPOSAL_BY_SUPER_ADMIN_ID, args)
  }

  /** APPROVAL FUNCTIONS *******************************************************/
  /**
   * To create a Approval
   * @param {String} proposalID propsal ID
   * @param {String} challenge to identify a approval request
   * @param {String} keyHandle to identify USB and owner
   * @param {String} clientData contain signature and others metadata to verify signature
   * @param {String} signatureData signature
   * @param {String} appId domain of website where the approval singed
   * @param {String} status status of approval
   */
  async createApproval(proposalID, challenge, keyHandle, clientData, signatureData, appId, status) {
    clientData = new Buffer(clientData, 'base64');
    // Parse signatureData
    var buf = new Buffer(signatureData, 'base64');
    var userPresenceFlag = buf.slice(0, 1);
    buf = buf.slice(1);
    var counter = buf.slice(0, 4);
    buf = buf.slice(4);
    var signLen = u2f.asnLen(buf);
    var signature = buf.slice(0, signLen);
    buf = buf.slice(signLen);
    if (buf.length !== 0)
      console.error("U2F Authentication Warning: signatureData has extra bytes: " + buf.toString('hex'));

    var appIdHash = u2f.hash(appId);
    var clientDataHash = u2f.hash(clientData);

    var signatureBase = Buffer.concat([appIdHash, userPresenceFlag, counter, clientDataHash]);

    // SEND
    let approval = {
      ProposalID: proposalID,
      ApproverID: keyHandle,
      Challenge: challenge,
      Signature: signature.toString('base64'),
      Message: signatureBase.toString('base64'),
      Status: status,
      CreatedAt: new Date()
    }
    let args = []
    args.push(JSON.stringify(approval))
    logger.debug(args)

    return await _createObject(CREATE_APPROVAL, args)
  }

   /**
    * To update a Approval who has permission to “Approve” HSTx
    * @param {String} approvalID approval ID to update
    * @param {String} proposalID propsal ID
    * @param {String} approverID approver ID
    * @param {String} challenge to identify a approval request
    * @param {String} signature signature content
    * @param {String} message message to sign
    */
  async updateApproval(approvalID, proposalID, approverID, challenge, signature, message) {
    let approval = {
      ApprovalID: approvalID,
      ProposalID: proposalID,
      ApproverID: approverID,
      Challenge: challenge,
      Signature: signature,
      Message: message,
      CreatedAt: new Date()
    }

    let args = []
    args.push(JSON.stringify(approval))
    logger.debug(args)

    return await _createObject(UPDATE_APPROVAL, args)
  }

  /**
   * To get all approval records
   */
  async getAllApproval() {
    return await _getObject(GET_ALL_APPROVAL, [])
  }

  /**
   * To get a approval records by ID
   * @param {string} id ID of Approval
   */
  async getApprovalByID(id) {
    let args = [id]
    return await _getObject(GET_APPROVAL_BY_ID, args)
  }
}

/**
 * Module exports.
 */
module.exports = HSTx