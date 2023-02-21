import express from 'express';
import {platform} from '../app.js';

export const postRouter = express.Router();

postRouter.post("/api/post", async (req, res) => {
  const {author, title, context, emotion} = req.body;
  console.log(req.body);
  res.send(await platform.post(author, title, context, emotion));
})

postRouter.post("/api/get-post", async (req, res) => {
  const {tokenID} = req.body;
  console.log(req.body);
  res.send(await platform.getPost(tokenID));
})

postRouter.get("/api/get-all-posts", async (req, res) => {
  res.send(await platform.getAllPost());
})