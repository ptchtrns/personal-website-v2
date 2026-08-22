import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_REGION, LOCAL_DEV, S3_BUCKET } from "@/lib/config.ts";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client === null) {
    s3Client = new S3Client({ region: AWS_REGION });
  }
  return s3Client;
}

/**
 * Generates a presigned PUT URL for uploading an object to S3.
 *
 * In local dev there's no real S3/R2 endpoint to presign against, so this
 * returns a same-origin URL backed by Miniflare's local R2 emulation
 * instead (see `lib/storage-local.ts` and `routes/api/local-upload/`). The
 * client-side upload code stays identical either way — it just PUTs to
 * whatever URL it's given.
 *
 * @param key The S3 object key (path within the bucket).
 * @param expiresIn URL expiry time in seconds.
 * @throws If URL generation fails.
 */
export async function generatePresignedPutUrl(
  key: string,
  expiresIn = 60,
): Promise<string> {
  if (LOCAL_DEV) {
    return `/api/local-upload/${key}`;
  }

  try {
    return await getSignedUrl(
      getS3Client(),
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Tagging: "OriginalPhoto=True",
      }),
      { expiresIn },
    );
  } catch (error) {
    throw new Error(`Failed to generate presigned URL: ${error}`);
  }
}
