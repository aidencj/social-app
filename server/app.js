import {Platform} from './modules/Platform.js';
import {printPostInfo, readJSON} from './modules/utility.js'
import express from 'express';
import {postRouter} from './routes/post.js'

const CONFIG = readJSON('./config.json');
export const platform = new Platform(CONFIG);

const PORT = CONFIG.PORT;
const app = express();

app.use(express.json());
app.use(postRouter);

// platform.post("0x5B8f30596468CA451587Ae77449cea5e2Cf8c8c5", "The first article", "Hi, everyone!", "Exciting");
// let postObject = await platform.getPost(0);
// printPostInfo(postObject);

app.listen(PORT, "127.0.0.1", () => {
  console.log(`connected at PORT: ${PORT}`);
})

app.get("/hello-world", (req, res) => {
  res.send("Hi!");
})