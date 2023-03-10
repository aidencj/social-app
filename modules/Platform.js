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
    this.userInfo = new Map();
    this.userInfoCid = new Map();
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
   * @param {Number} id The tokenID of that post
   * @returns An post object.
   */
  async getPost(id){
    let infoObject = await this.getUserInfo(this.posts[id].author);

    if(!('name' in infoObject))
      return {'context': this.posts[id]};
    
    return {
      'context': this.posts[id],
      'userInfo': infoObject
    };
  }

  async syncPosts() {
    let totalSupply = await this.blockchain.getTotalSupply();
    if(this.posts.lengh == totalSupply)
      return;
    
    for(let i = this.posts.length; i < totalSupply; i++){
      try {
        let postCid = await this.blockchain.getPostURI(i);
        let postObject = await this.ipfsClient.get(postCid, 'Post.json');
        postObject.author = postObject.author.toLowerCase();
        this.posts.push(postObject);
      }
      catch (err) {
        console.error(err);
      }
    }
  }

  async getAllPost() {
    await this.syncPosts();
    let ret = new Array();
    for(let i = 0; i < this.posts.length; i++){
      ret.push(await this.getPost(i));
    }
    return ret;
  }

  async getAllPostOwnedBy(owner) {
    await this.syncPosts();
    let ret = new Array();
    for(let i = 0; i < this.posts.length; i++){
      if(this.posts[i].author.toLowerCase() == owner.toLowerCase())
        ret.push(await this.getPost(i));
    }
    return ret;
  }

  async uploadUserInfo(userInfoObject) {
    let cid = await this.ipfsClient.uploadUserInfo(userInfoObject);
    return cid;
  }

  async getUserInfo(address) {
    if(this.userInfo.has(address))
      return this.userInfo.get(address);
    
    let cid = await this.blockchain.getUserInfo(address);
    let infoObject = (cid == "")? {}: await this.ipfsClient.get(cid, 'userInfo.json');

    this.userInfoCid.set(address, cid);
    this.userInfo.set(address, infoObject);
    return infoObject
  }

  async checkIfUserInfoShouldUpdate(address){
    let cid = await this.blockchain.getUserInfo(address);
    if(cid != "" && (!this.userInfoCid.has(address) || cid != this.userInfoCid.get(address))){
      let infoObject = await this.ipfsClient.get(cid, 'userInfo.json');
      this.userInfoCid.set(address, cid);
      this.userInfo.set(address, infoObject);
    }
  }
}