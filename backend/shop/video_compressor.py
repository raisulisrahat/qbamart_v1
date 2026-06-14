import os
import subprocess
import logging

logger = logging.getLogger(__name__)

def compress_video_file(file_path, max_size_mb=10):
    """
    Compresses a video file on disk in-place using imageio-ffmpeg if the size exceeds max_size_mb.
    Returns True if successfully compressed, False otherwise.
    """
    if not os.path.exists(file_path):
        logger.warning(f"Video compression skipped: file not found at {file_path}")
        return False
        
    try:
        size_bytes = os.path.getsize(file_path)
        size_mb = size_bytes / (1024 * 1024)
        
        if size_mb <= max_size_mb:
            logger.info(f"Video size {size_mb:.2f} MB is under the threshold of {max_size_mb} MB. Skipping compression.")
            return False
            
        logger.info(f"Compressing video file: {file_path} ({size_mb:.2f} MB)")
        
        # Import imageio-ffmpeg and get binary path
        try:
            import imageio_ffmpeg
            ffmpeg_bin = imageio_ffmpeg.get_ffmpeg_exe()
        except Exception as e:
            logger.error(f"Failed to load imageio-ffmpeg: {e}. Video compression skipped.")
            return False
            
        dir_name = os.path.dirname(file_path)
        base_name = os.path.basename(file_path)
        name, ext = os.path.splitext(base_name)
        temp_out = os.path.join(dir_name, f"temp_compress_{name}.mp4")
        
        # FFmpeg command for robust web-optimized video compression:
        # -y: overwrite output
        # -crf 28: good quality vs compression ratio
        # -preset medium: balanced encoding speed
        # -movflags +faststart: relocate moov atom to start of file (for fast web streaming)
        # -vf scale='min(1280,iw)':-2: scale width to max 1280, preserve aspect ratio, keep divisible by 2
        cmd = [
            ffmpeg_bin,
            '-y',
            '-i', file_path,
            '-vcodec', 'libx264',
            '-crf', '28',
            '-preset', 'medium',
            '-acodec', 'aac',
            '-ab', '128k',
            '-movflags', '+faststart',
            '-vf', "scale='min(1280,iw)':-2",
            temp_out
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        
        if os.path.exists(temp_out) and os.path.getsize(temp_out) > 0:
            new_size_bytes = os.path.getsize(temp_out)
            new_size_mb = new_size_bytes / (1024 * 1024)
            logger.info(f"Video compressed from {size_mb:.2f} MB to {new_size_mb:.2f} MB (saved {size_mb - new_size_mb:.2f} MB)")
            
            # Replace original file with compressed one
            os.replace(temp_out, file_path)
            return True
        else:
            logger.error("Compressed video output file is empty or not created.")
            if os.path.exists(temp_out):
                os.remove(temp_out)
            return False
            
    except subprocess.CalledProcessError as e:
        logger.error(f"FFmpeg compression failed with code {e.returncode}. Stderr: {e.stderr}")
        if 'temp_out' in locals() and os.path.exists(temp_out):
            os.remove(temp_out)
        return False
    except Exception as e:
        logger.error(f"Error during video compression: {e}")
        if 'temp_out' in locals() and os.path.exists(temp_out):
            os.remove(temp_out)
        return False
