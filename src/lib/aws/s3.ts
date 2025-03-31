import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./config";

export async function generateUploadUrl(
  fileType: string,
  classId: string,
  fileName: string
): Promise<{ uploadUrl: string; fileUrl: string }> {
  try {
    const fileExtension = fileType?.split("/")[1] || "bin"; // Fallback to 'bin' if fileType is missing
    const fileKey = `${classId}/${fileName}-${Date.now()}.${fileExtension}`;
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
      ContentType: fileType,
      ACL: "public-read"
    });

    // ✅ Generate a presigned upload URL
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // ✅ Ensure URL encoding for the file path
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${encodeURIComponent(fileKey)}`;

    console.log("✅ Upload URL:", uploadUrl);
    console.log("📂 Expected File URL:", fileUrl);

    return { uploadUrl, fileUrl };
  } catch (error) {
    console.error("Error generating upload URL:", error);
    throw new Error("Failed to generate upload URL");
  }
}