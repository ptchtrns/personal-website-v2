import boto3
from botocore.exceptions import BotoCoreError, ClientError
from app.config import S3_BUCKET

_s3_client = None


def get_s3_client():
    global _s3_client
    if _s3_client is None:
        _s3_client = boto3.client("s3")
    return _s3_client


def generate_presigned_put_url(s3_key: str, expires_in: int = 60) -> str:
    """
    Generate a presigned PUT URL for uploading an object to S3.

    Args:
        s3_key: The S3 object key (path within the bucket).
        expires_in: URL expiry time in seconds (default: 60).

    Returns:
        The presigned URL string.

    Raises:
        RuntimeError: If URL generation fails.
    """
    try:
        url = get_s3_client().generate_presigned_url(
            "put_object",
            Params={
                "Bucket": S3_BUCKET,
                "Key": s3_key,
                "Tagging": "OriginalPhoto=True",
            },
            ExpiresIn=expires_in,
            HttpMethod="PUT",
        )
        return url
    except (BotoCoreError, ClientError) as e:
        raise RuntimeError(f"Failed to generate presigned URL: {e}") from e