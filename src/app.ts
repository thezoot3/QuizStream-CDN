import express from 'express';
import path from 'path';
import fs from 'fs';
import uploadRoute from './routes/uploadRoute';
import serveRoute from './routes/serveRoute';
import videoInfoRoute from './routes/videoInfoRoute';
import cors from 'cors'
import thumbnailRoute from "./routes/thumbnailRoute";

const app = express();
const port = process.env.PORT || 3200;

app.use(cors())

// Ensure cache and uploads directories exist
export const cacheDir = path.join(__dirname, '../cache');
export const uploadsDir = path.join(__dirname, '../uploads');
export const thumbnailsDir = path.join(__dirname, '../thumbnail');

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir);
}

app.use('/cdn/upload', uploadRoute);
app.use('/cdn/videos', serveRoute);
app.use('/cdn/video-info', videoInfoRoute);
app.use('/cdn/thumbnail', thumbnailRoute)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
