import os
import glob
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import boto3
from botocore.config import Config

SOURCE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "images")
BUCKET_NAME = "myhome-houses-r2"
ENDPOINT_URL = "https://5e276b42664b54929d077e3edd6335d4.r2.cloudflarestorage.com"
ACCESS_KEY = "c9b90a1ca4daa52169d4c8411f5ad68c"
SECRET_KEY = "63559ed8b6c45deca38e44bc00914df6ccaa628ac7f695c5643207f3612b5965"


def get_s3_client():
    return boto3.client(
        "s3",
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        config=Config(
            signature_version="s3v4",
            max_pool_connections=50,
            retries={"max_attempts": 5, "mode": "adaptive"}
        ),
        region_name="auto"
    )


def main():
    s3 = get_s3_client()

    png_files = sorted(glob.glob(os.path.join(SOURCE_DIR, "*.png")))
    total = len(png_files)
    print(f"Found {total} PNG files in {SOURCE_DIR}")
    if total == 0:
        print("No files to upload!")
        return

    print("Checking existing R2 objects under cars/ to skip duplicates...")
    existing = set()
    paginator = s3.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET_NAME, Prefix="cars/"):
        for obj in page.get("Contents", []):
            existing.add(obj["Key"])
    print(f"Existing objects in R2 (cars/): {len(existing)}")

    tasks = []
    for f in png_files:
        base = os.path.basename(f)
        num_str = os.path.splitext(base)[0]
        if not num_str.isdigit():
            continue
        padded = num_str.zfill(5)

        key_png = f"cars/{padded}.png"
        if key_png not in existing:
            tasks.append((f, key_png, "image/png"))

        key_webp = f"cars/{padded}.webp"
        if key_webp not in existing:
            tasks.append((f, key_webp, "image/png"))

    print(f"Total upload tasks queued: {len(tasks)}")
    if not tasks:
        print("All 1,001 car images are already uploaded and up to date!")
        return

    success_count = 0
    fail_count = 0
    start_time = time.time()

    def upload_one(task):
        file_path, key, content_type = task
        client = get_s3_client()
        try:
            client.upload_file(
                file_path,
                BUCKET_NAME,
                key,
                ExtraArgs={
                    "ContentType": content_type,
                    "CacheControl": "public, max-age=31536000, immutable"
                }
            )
            return True, key, None
        except Exception as e:
            return False, key, str(e)

    with ThreadPoolExecutor(max_workers=20) as executor:
        futures = {executor.submit(upload_one, t): t for t in tasks}
        for future in as_completed(futures):
            ok, key, err = future.result()
            if ok:
                success_count += 1
                if success_count % 200 == 0 or success_count == len(tasks):
                    elapsed = time.time() - start_time
                    speed = success_count / elapsed if elapsed > 0 else 0
                    print(f"Progress: {success_count}/{len(tasks)} uploaded ({speed:.1f} files/sec)...")
            else:
                fail_count += 1
                print(f"Failed to upload {key}: {err}")

    elapsed = time.time() - start_time
    print(f"\nUpload Completed in {elapsed:.1f} seconds!")
    print(f"Success: {success_count}, Failed: {fail_count}")


if __name__ == "__main__":
    main()
