import { getVideoDurationInSeconds } from 'get-video-duration';
import path from 'path';
import NodeCache from 'node-cache';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import {thumbnailsDir} from "../app";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

interface VideoInfo {
    filename: string;
    videoId: string;
    duration: number;
}

const videoInfoCache = new NodeCache();

export async function saveVideoInfo(file: Express.Multer.File): Promise<VideoInfo> {
    const filePath = path.join(__dirname, '../../uploads', file.filename);
    const duration = await getVideoDurationInSeconds(filePath);
    const videoId = file.filename.split(".")[0]
    const videoInfo: VideoInfo = {
        filename: file.filename,
        duration: Math.round(duration),
        videoId: videoId
    };

    await extractThumbnail(filePath, path.join(thumbnailsDir, `${file.filename.split('.')[0]}.jpg`));

    videoInfoCache.set(file.filename, videoInfo);

    return videoInfo;
}

export async function getVideoInfo(filename: string): Promise<VideoInfo> {
    const cachedInfo = videoInfoCache.get<VideoInfo>(filename);
    if (cachedInfo) {
        return cachedInfo;
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    const duration = await getVideoDurationInSeconds(filePath);
    const videoId = filename.split(".")[0]

    const videoInfo: VideoInfo = {
        filename,
        duration: Math.round(duration),
        videoId
    };

    videoInfoCache.set(filename, videoInfo);
    return videoInfo;
}

export async function extractThumbnail(videoPath: string, thumbnailPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .on('end', () => resolve())
            .on('error', reject)
            .screenshots({
                count: 1,
                timestamps: ['0'],
                folder: path.dirname(thumbnailPath),
                filename: path.basename(thumbnailPath)
            })
    });
}

//get thumbnail image

