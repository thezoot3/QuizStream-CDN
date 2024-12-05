import { getVideoDurationInSeconds } from 'get-video-duration';
import path from 'path';

interface VideoInfo {
    filename: string;
    duration: number;
}

const videoInfoCache = new Map<string, VideoInfo>();

export async function saveVideoInfo(file: Express.Multer.File): Promise<VideoInfo> {
    const filePath = path.join(__dirname, '../../uploads', file.filename);
    const duration = await getVideoDurationInSeconds(filePath);

    const videoInfo: VideoInfo = {
        filename: file.filename,
        duration: Math.round(duration)
    };

    videoInfoCache.set(file.filename, videoInfo);
    return videoInfo;
}

export async function getVideoInfo(filename: string): Promise<VideoInfo> {
    const cachedInfo = videoInfoCache.get(filename);
    if (cachedInfo) {
        return cachedInfo;
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    const duration = await getVideoDurationInSeconds(filePath);

    const videoInfo: VideoInfo = {
        filename,
        duration: Math.round(duration)
    };

    videoInfoCache.set(filename, videoInfo);
    return videoInfo;
}
