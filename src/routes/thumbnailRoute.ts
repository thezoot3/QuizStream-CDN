import express from 'express';
import path from "path";
import fs from 'fs';
import { thumbnailsDir } from "../app";

const router = express.Router();

router.get('/:videoId', async (req, res) => {
    const videoIdPrefix = req.params.videoId;
    const files = fs.readdirSync(thumbnailsDir);
    const matchedFile = files.find(file => file.startsWith(videoIdPrefix));

    if (!matchedFile) {
        return res.status(404).send('Thumbnail not found');
    }

    const fileDirectory = path.join(thumbnailsDir, matchedFile);
    try {
        res.sendFile(fileDirectory);
    } catch (e) {
        throw e;
    }
});

export default router;
