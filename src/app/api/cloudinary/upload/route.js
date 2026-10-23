import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

// Admin only — enforced by middleware (/api/cloudinary is not in the public allow-list).

const MAX_BYTES = 10 * 1024 * 1024;
const FOLDER_PATTERN = /^portfolio(\/[a-z0-9_-]+)*$/;

// Identify the image by its leading bytes, not the filename or the browser-supplied MIME type.
function isImage(buffer) {
  const ascii = (start, end) => buffer.subarray(start, end).toString('latin1');
  if (buffer.length < 12) return false;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true; // JPEG
  if (ascii(0, 8) === '\x89PNG\r\n\x1a\n') return true; // PNG
  if (ascii(0, 6) === 'GIF87a' || ascii(0, 6) === 'GIF89a') return true; // GIF
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return true; // WebP
  if (ascii(4, 8) === 'ftyp' && ['avif', 'avis'].includes(ascii(8, 12))) return true; // AVIF
  return false;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'portfolio';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, error: 'Images must be smaller than 10 MB.' }, { status: 400 });
    }
    if (typeof folder !== 'string' || !FOLDER_PATTERN.test(folder)) {
      return NextResponse.json({ success: false, error: 'Invalid upload folder.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (!isImage(buffer)) {
      return NextResponse.json(
        { success: false, error: 'Please upload a JPEG, PNG, GIF, WebP or AVIF image.' },
        { status: 400 }
      );
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' }, // Max dimensions
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
