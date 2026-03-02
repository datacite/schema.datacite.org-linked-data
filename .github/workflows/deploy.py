import boto3
import botocore.exceptions
import mimetypes
import os

from pathlib import Path


# Exclude other directories since we are checking out the whole repository. This approach is used instead of selecting all .jsonld files, as it allows
# for the current README.md and future-proofs for any other additional files (e.g. human-readable HTML representations).
EXCLUDED_TOP_LEVEL_DIRS = {
    ".github",  # Workflows folder
    ".git",  # Git metadata etc
    ".venv",  # Python Virtualenv from local development
    ".idea",  # PyCharm project files
}

# Define the top-level directory in the bucket
PREFIX = Path("linked-data")

# Ensure that JSON-LD is present in the mimetypes mapping
mimetypes.add_type("application/ld+json", ".jsonld")


def upload_files_to_s3(root_path: Path, bucket: str, s3_client) -> int:
    """
    Upload all files from the given root to the given S3 bucket.

    Args:
        root_path: The root of the to upload files from.
        bucket: The S3 bucket to upload files to.
        s3_client: The Boto3 S3 client to use for the upload.

    Returns:
        int: The number of files that were successfully uploaded.
    """
    uploaded_count = 0

    # Crawl the given path
    for path in root_path.rglob("*"):
        # Skip directory entries
        if path.is_dir():
            continue

        # Skip any files inside excluded directories
        relative_path = path.relative_to(root_path)
        parts = relative_path.parts
        if not parts or parts[0] in EXCLUDED_TOP_LEVEL_DIRS:
            continue

        # Get the mimetype of the file
        extra_args = {}
        content_type, _ = mimetypes.guess_type(str(path))
        if content_type:
            extra_args["ContentType"] = content_type

        # Set the path within the bucket
        key = PREFIX.joinpath(relative_path)
        # Upload the file
        try:
            s3_client.upload_file(
                    Filename=path,
                    Bucket=bucket,
                    Key=str(key),
                    ExtraArgs=extra_args
            )

            print(f"Uploaded {key}")
            uploaded_count += 1
        except s3_client.exceptions.NoSuchBucket:
            print(f"ERROR: Bucket {bucket} does not exist")
        except s3_client.exceptions.NoSuchKey:
            print(f"ERROR: Key {key} does not exist")
        except s3_client.exceptions.AccessDenied:
            print(f"ERROR: Access Denied to {key}")
        except s3_client.exceptions.ClientError as error:
            print(f"ERROR: Client Error whilst uploading {key}: {error}")

        # For .jsonld files, add the "shadow object" to allow extensionless access
        if path.suffix.lower() == ".jsonld":
            # Construct the bucket path by stripping the extension
            shadow_key = PREFIX.joinpath(relative_path).with_suffix('')
            # Construct the redirect address. For objects in the same S3 bucket, it is the target key prefixed with a /
            redirect_target = f"/{key}"
            # Create the S3 object directly with a blank body
            try:
                s3_client.put_object(
                    Bucket=bucket,
                    Key=str(shadow_key),
                    Body=b"",
                    WebsiteRedirectLocation=redirect_target,
                )
                print(f"Created shadow object at {shadow_key} pointing to {key}")
            except s3_client.exceptions.NoSuchBucket:
                print(f"ERROR: Bucket {bucket} does not exist")
            except s3_client.exceptions.NoSuchKey:
                print(f"ERROR: Key {shadow_key} does not exist")
            except s3_client.exceptions.AccessDenied:
                print(f"ERROR: Access Denied to {shadow_key}")
            except s3_client.exceptions.ClientError as error:
                print(f"ERROR: Client error whilst creating shadow object {shadow_key}: {error}")

    return uploaded_count


def main() -> None:
    """
    Main entry point for the script.
    Gets AWS details from environment variables, sets up the S3 client and uploads the Schema files
    If the required environment variables are missing, the script will exit(1) to cause GitHub workflow to report failure.

    :raises botocore.exceptions.BotoCoreError: If there is an error with the BotoCore library
    """
    # Get AWS details from environment
    bucket = os.getenv("SCHEMA_BUCKET")
    region = os.getenv("AWS_REGION", default="eu-west-1")
    aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
    aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")

    # Get the root of the checked out repository, two directories above the script
    root_path = Path(__file__).resolve().parents[2]

    # Early abort if required variables absent
    if not all([bucket, region, aws_access_key_id, aws_secret_access_key]):
        print("ERROR: Required environment variables missing!")
        # Quit with non-zero exit code to make GitHub workflow fail
        exit(1)

    # Instantiate the S3 client
    try:
        s3_client = boto3.client(
            "s3",
            region_name=region,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )
    except botocore.exceptions.BotoCoreError as error:
        print(f"ERROR: BotoCore Error: {error}")
        # Quit with non-zero exit code to make GitHub workflow fail
        exit(1)

    uploaded = upload_files_to_s3(root_path=root_path, bucket=bucket, s3_client=s3_client)
    print(f"Uploaded {uploaded} files to s3://{bucket}")


if __name__ == "__main__":
    main()
