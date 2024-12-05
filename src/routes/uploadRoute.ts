import express from 'express';
import multer from 'multer';
import path from 'path';
import { saveVideoInfo } from '../services/videoService';
import fs from "fs";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log(`Starting upload of file: ${file.originalname}`);
        req.body.uploadStartTime = Date.now();
        cb(null, true);
    }
});

router.post('/', upload.single('video'), async (req, res) => {
    if (!req.file) {
        console.log('No file uploaded');
        return res.status(400).send('No file uploaded.');
    }

    const uploadEndTime = Date.now();
    const uploadDuration = (uploadEndTime - req.body.uploadStartTime) / 1000; // 초 단위로 변환

    // 파일 크기 확인
    const stats = fs.statSync(req.file.path);
    const fileSizeInBytes = stats.size;
    const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

    console.log(`File uploaded successfully: ${req.file.originalname}`);
    console.log(`File size: ${fileSizeInMegabytes.toFixed(2)} MB`);
    console.log(`Upload duration: ${uploadDuration.toFixed(2)} seconds`);

    try {
        const videoInfo = await saveVideoInfo(req.file);
        res.json({
            ...videoInfo,
            fileSize: `${fileSizeInMegabytes.toFixed(2)} MB`,
            uploadDuration: `${uploadDuration.toFixed(2)} seconds`
        });
    } catch (error) {
        console.error('Error processing video:', error);
        res.status(500).send('Error processing video.');
    }
});



export default router;
