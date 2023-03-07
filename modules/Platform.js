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
    this.posts = new Array();
  }

  /**
   * Upload the post to IPFS and store the CID to NFT Contract.
   * @param {object} postObject The JSON object of the post.
   */
  async post(postObject) {
    let cid = await this.ipfsClient.post(postObject);
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

  async syncPosts() {
    let totalSupply = await this.blockchain.getTotalSupply();
    if(this.posts.lengh == totalSupply)
      return;
    
    for(let i = this.posts.length; i < totalSupply; i++){
      try {
        this.posts.push(await this.getPost(i));
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  async getAllPost() {
    // let totalSupply = await this.blockchain.getTotalSupply();
    // let allPosts = new Array();
    // console.log(`totalSupply: ${totalSupply}`);
    // for(let i = 0; i < totalSupply; i++) {
    //   try {
    //     allPosts.push(await this.getPost(i));
    //   }
    //   catch (err) {
    //     console.error(err);
    //   }
    // }
    await this.syncPosts();
    return this.posts;
  }

  async getAllPostOwnedBy(owner) {
    // let totalSupply = await this.blockchain.getTotalSupply();
    // let allPosts = new Array();

    // for(let i = 0; i < totalSupply; i++) {
    //   try {
    //     let postOwner = await this.blockchain.getOwnerOfPost(i);
    //     if(postOwner.toLowerCase() == owner.toLowerCase())
    //       allPosts.push(await this.getPost(i));
    //   }
    //   catch (err) {
    //     console.error(err);
    //   }
    // }
    await this.syncPosts();
    let ret = new Array();
    for(let i = 0; i < this.posts.length; i++){
      if(this.posts[i].author.toLowerCase() == owner.toLowerCase())
        ret.push(this.posts[i]);
    }
    return ret;
  }

  async uploadUserInfo(userInfoObject) {
    let cid = await this.ipfsClient.uploadUserInfo(userInfoObject);
    return cid;
  }
}