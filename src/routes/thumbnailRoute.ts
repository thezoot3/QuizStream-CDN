import express from 'express';
import path from "path";
import fs from 'fs';
import { thumbnailsDir } from "../app";
import { saveVideoInfo, extractThumbnail } from "../services/videoService";

const router = express.Router();

router.get('/:videoId', async (req, res) => {
    const videoIdPrefix = req.params.videoId;
    const files = fs.readdirSync(thumbnailsDir);
    const matchedFile = files.find(file => file.startsWith(videoIdPrefix));

    if (!matchedFile) {
        try {
            // 비디오 파일 찾기
            const uploadsDir = path.join(__dirname, '../../uploads');
            const videoFiles = fs.readdirSync(uploadsDir);
            const videoFile = videoFiles.find(file => file.startsWith(videoIdPrefix));

            if (!videoFile) {
                return res.status(404).send('Video not found');
            }

            // 썸네일 다시 생성
            const videoPath = path.join(uploadsDir, videoFile);
            const thumbnailPath = path.join(thumbnailsDir, `${videoIdPrefix}.jpg`);

            await extractThumbnail(videoPath, thumbnailPath);

            // 생성된 썸네일 전송
            res.sendFile(thumbnailPath);
        } catch (error) {
            console.error('Error regenerating thumbnail:', error);
            return res.status(500).send('Error generating thumbnail');
        }
    } else {
        const fileDirectory = path.join(thumbnailsDir, matchedFile);
        try {
            res.sendFile(fileDirectory);
        } catch (e) {
            console.error('Error sending thumbnail:', e);
            res.status(500).send('Error sending thumbnail');
        }
    }
});

export default router;
