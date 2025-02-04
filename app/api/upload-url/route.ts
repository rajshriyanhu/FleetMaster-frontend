import { Storage } from "@google-cloud/storage";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const file = url.searchParams.get("file");

    if (!file) {
      return NextResponse.json({ error: "Missing 'file' parameter" }, { status: 400 });
    }

    const storage = new Storage({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      credentials: {
        client_email: process.env.NEXT_PUBLIC_GCS_CLIENT_EMAIL,
        private_key: process.env.NEXT_PUBLIC_GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Handle escaped newlines
      },
    });

    const bucket = storage.bucket(process.env.NEXT_PUBLIC_BUCKET_NAME!);
    const gcsFile = bucket.file(file);
    const options = {
      expires: Date.now() + 5 * 60 * 1000,
      fields: { "x-goog-meta-source": "nextjs-project" },
    };

    const [response] = await gcsFile.generateSignedPostPolicyV4(options);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }
}