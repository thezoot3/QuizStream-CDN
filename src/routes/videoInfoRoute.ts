import express from 'express';
import { getVideoInfo } from '../services/videoService';
import fs from "fs";
import {thumbnailsDir, uploadsDir} from "../app";

const router = express.Router();

router.get('/:videoId', async (req, res) => {
    const videoIdPrefix = req.params.videoId;
    const files = fs.readdirSync(uploadsDir);
    const matchedFile = files.find(file => file.startsWith(videoIdPrefix));

    if (!matchedFile) {
        return res.status(404).send('Thumbnail not found');
    }

    try {
        const videoInfo = await getVideoInfo(matchedFile);
        res.json(videoInfo);
    } catch (error) {
        res.status(404).send('Video not found');
    }
});

//get all video info
router.get('/', async (req, res) => {
    const videoFiles = fs.readdirSync(uploadsDir);
    const videoInfoPromises = videoFiles.map(async (filename) => {
        return getVideoInfo(filename);
    });
    return res.json(await Promise.all(videoInfoPromises));
})

export default router;
