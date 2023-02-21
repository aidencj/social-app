import express from 'express';
import {platform} from '../app.js';

export const postRouter = express.Router();

postRouter.post("/api/post", async (req, res) => {
  const {author, title, context, emotion} = req.body;
  console.log(req.body);
  res.send(await platform.post(author, title, context, emotion));
})