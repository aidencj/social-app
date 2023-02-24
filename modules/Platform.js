import {IpfsClient} from './IpfsClient.js';
import {Blockchain} from './Blockchain.js';

export class Platform{
  /**
   * The social platform object.
   */
  constructor(CONFIG) {
    this.CONFIG = CONFIG;
    this.blockchain = new Blockchain(this.CONFIG);
    this.ipfsClient = new IpfsClient(this.CONFIG.WEB3_STORAGE_TOKEN);
  }

  /**
   * Upload the post to IPFS and store the CID to NFT Contract.
   * @param {String} author The address of the author.
   * @param {String} title The title of the post.
   * @param {String} context The context of the post.
   * @param {String} emotion The emotion of the post.
   */
  async post(author, title, context, emotion) {
    let cid = await this.ipfsClient.post(author, title, context, emotion);
    // this.blockchain.post(author, cid);
    return cid;
  }

  /**
   * Get the post object by its tokenID.
   * @param {Number} tokenID The tokenID of that post
   * @returns An post object.
   */
  async getPost(tokenID) {
    let cid = await this.blockchain.getPostURI(tokenID);
    return await this.ipfsClient.get(cid);
  }

  async getAllPost() {
    let totalSupply = await this.blockchain.getTotalSupply();
    let allPosts = new Array();
    console.log(`totalSupply: ${totalSupply}`);
    for(let i = 0; i < totalSupply; i++) {
      try {
        allPosts.push(await this.getPost(i));
      }
      catch (err) {
        console.error(err);
      }
    }
    return allPosts;
  }

  async getAllPostOwnedBy(owner) {
    let totalSupply = await this.blockchain.getTotalSupply();
    let ret = new Array();

    for(let i = 0; i < totalSupply; i++) {
      try {
        if(await this.blockchain.getOwnerOfPost(i) == owner)
          allPosts.push(await this.getPost(i));
      }
      catch (err) {
        console.error(err);
      }
    }
    return allPosts;
  }
}