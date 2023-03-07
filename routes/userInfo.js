import express from 'express';
import {platform} from '../app.js';
import fs from 'fs';
export const userInfoRouter = express.Router();

userInfoRouter.post("/api/setUserInfo", async (req, res) => {
  console.log(req.body);
  let image = Buffer.from(req.body.image, 'base64');
  fs.writeFileSync(req.body.filename, image, 'utf8');
  let imageCid = platform.ipfsClient.put(req.body.filename);
  let userInfoObject = {
      'name': req.body.name,
      'location': req.body.location,
      'filename': req.body.filename,
      'imageCid': imageCid
  };
  let cid = await platform.ipfsClient.uploadUserInfo(userInfoObject);
  res.send(cid);
  console.log(`Put ${req.body.name}'s info to IPFS.`);
  console.log(`CID: ${cid}`);
})