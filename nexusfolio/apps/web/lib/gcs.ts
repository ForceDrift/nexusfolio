import { Storage } from '@google-cloud/storage';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'nexusfolio-videos';

export interface UploadResult {
  success: boolean;
  url?: string;
  fileName?: string;
  error?: string;
}

export async function uploadVideoToGCS(
  file: File,
  fileName: string,
  metadata?: Record<string, string>
): Promise<UploadResult> {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    
    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${fileName.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.${fileExtension}`;
    
    // Create file reference
    const fileUpload = bucket.file(uniqueFileName);
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload options
    const uploadOptions = {
      metadata: {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          ...metadata,
        },
      },
      resumable: false, // For smaller files, set to true for larger files
    };
    
    // Upload the file
    await fileUpload.save(buffer, uploadOptions);
    
    // Generate a signed URL that's valid for 7 days
    const [signedUrl] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return {
      success: true,
      url: signedUrl,
      fileName: uniqueFileName,
    };
  } catch (error) {
    console.error('Error uploading to GCS:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteVideoFromGCS(fileName: string): Promise<boolean> {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);
    
    await file.delete();
    return true;
  } catch (error) {
    console.error('Error deleting from GCS:', error);
    return false;
  }
}

export async function listVideos(prefix?: string): Promise<string[]> {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const [files] = await bucket.getFiles({ prefix });
    
    return files.map(file => file.name);
  } catch (error) {
    console.error('Error listing files from GCS:', error);
    return [];
  }
}