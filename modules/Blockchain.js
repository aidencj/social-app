import Web3 from 'web3';
import {readJSON} from './utility.js'

export class Blockchain {
  /**
   * This is an interface to connect js and blockchain
   * @param {object} CONFIG The CONFIG object.
   */
  constructor(CONFIG) {
    this.CONFIG = CONFIG;
    let web3 = new Web3(this.CONFIG.PROVIDER_URL);
    let abi_PostNFT = readJSON(this.CONFIG.ABI_PATH_PostNFT, 'utf8');
    let abi_UserInfo = readJSON(this.CONFIG.ABI_PATH_UserInfo, 'utf8');
    
    this.PostNFT = new web3.eth.Contract(abi_PostNFT, this.CONFIG.CONTRACT_ADDRESS_PostNFT);
    this.UserInfo = new web3.eth.Contract(abi_UserInfo, this.CONFIG.CONTRACT_ADDRESS_UserInfo);
  }

  /**
   * Leave a post by storing CID as tokenURI and make author own this NFT.
   * @param {string} author The address of the author.
   * @param {string} uri The CID of this post.
   */
  post(author, uri) {
    this.PostNFT.methods
    .post(author, uri)
    .send({from: this.CONFIG.ADDRESS, gas:this.CONFIG.GAS_LIMIT}, function(err, res) {
      if (err) {
        console.log(`An error occurred in post: ${err}`);
        return;
      }
    });
  }

  /**
   * Retreive the CID of the corresponding post.
   * @param {number} tokenID The tokenID of that post.
   * @returns {Promise<string>} CID
   */
  getPostURI(tokenID) {
    return new Promise((resolve, reject) => {
      this.PostNFT.methods
      .tokenURI(tokenID)
      .call(function(err, res) {
        if (err) {
          reject(`An error occurred in getPostURI: ${err}`);
          return;
        }
        resolve(res);
      })
    })
  }

  getTotalSupply() {
    return new Promise((resolve, reject) => {
      this.PostNFT.methods
      .getTotalSupply()
      .call(function(err, res) {
        if (err) {
          reject(`An error occurred in getTotalSupply: ${err}`);
          return;
        }
        resolve(res);
      })
    })
  }

  getOwnerOfPost(tokenID) {
    return new Promise((resolve, reject) => {
      this.PostNFT.methods
      .ownerOf(tokenID)
      .call(function(err, res) {
        if (err) {
          reject(`An error occurred in getOwnerOfPost: ${err}`);
          return;
        }
        resolve(res.toLowerCase());
      })
    })
  }

  getUserInfo(address) {
    return new Promise((resolve, reject) => {
      this.UserInfo.methods
      .getUserInfo(address)
      .call(function(err, res) {
        if (err) {
          reject(`An error occurred in getOwnerOfPost: ${err}`);
          return;
        }
        resolve(res);
      })
    })
  }
};