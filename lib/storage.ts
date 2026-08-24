import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AWS_REGION, LOCAL_DEV, S3_BUCKET } from "@/lib/config.ts";
import { getCdnBucket } from "@/lib/storage-local.ts";

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client === null) {
    s3Client = new S3Client({ region: AWS_REGION });
  }
  return s3Client;
}

/**
 * Uploads a file's bytes to storage under `key`, going through the Worker
 * (forms post the file to us directly, no client-side JS to talk to S3/R2
 * itself). In local dev there's no real S3/R2 endpoint, so this writes to
 * Miniflare's local R2 emulation instead (see `lib/storage-local.ts`),
 * matching the bucket `routes/media/[...key].ts` serves from.
 */
export async function uploadObject(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<void> {
  if (LOCAL_DEV) {
    const bucket = await getCdnBucket();
    await bucket.put(key, body);
    return;
  }

  try {
    await getS3Client().send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        Tagging: "OriginalPhoto=True",
      }),
    );
  } catch (error) {
    throw new Error(`Failed to upload object: ${error}`);
  }
}
