import { Web3Storage, getFilesFromPath } from 'web3.storage';
import { readFileSync, writeFileSync, unlink } from 'fs';
import https from 'https';

export class IpfsClient {
    constructor(WEB3_STORAGE_TOKEN) {
        this.client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });
    }

    /**
     * Uploads files to web3.storage
     * @param {string} path The path to the file.
     * @return {Promise<CIDString>} Returns the corresponding Content Identifier (CID).
     */
    async put(path) {
        let file = await getFilesFromPath(path)
        let cid = await this.client.put(file)
        return cid;
    }

    /**
     * Fetch the post object by its CID.
     * @param {CIDString} cid The Content Identifier (CID) of the post.
     * @return {object} Returns the post object,
     * which contains {"author", "title", "context", "emotion"}
     */
    async get(cid) {
        // let res = await this.client.get(cid); // Web3Response
        // let files = await res.files(); // Web3File[]
        // let rawData = await files[0].text();
        let rawData = '';
        console.log(`CID: ${cid}`);
        https.get(`https://${cid}.ipfs.w3s.link/Post.json`, (resp) => {

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                rawData += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                console.log(rawData);
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
        return JSON.parse(rawData);
    }

    /**
     * Upload a post to web3.storage
     * @param {string} postData The JSON string of the post.
     * @return {Promise<CIDString>} Returns the corresponding Content Identifier (CID).
     */
    async post(postData){
        let filename = `Post.json`;
        writeFileSync(filename, postData);
        let cid = await this.put(filename);
        unlink(filename, (err) => {
            if (err) throw err;
        });
        return cid;
    }
}
