import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';

const storage = new Storage({
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    credentials: {
      client_email: process.env.NEXT_PUBLIC_GCS_CLIENT_EMAIL,
      private_key: process.env.NEXT_PUBLIC_GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Handle escaped newlines
    },
  });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName } = body;

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'fileName is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log('ENV VARIABLES -------->',process.env.NEXT_PUBLIC_PROJECT_ID, process.env.NEXT_PUBLIC_GCS_CLIENT_EMAIL, process.env.NEXT_PUBLIC_GCS_PRIVATE_KEY?.replace(/\\n/g, "\n"))

    const options: GetSignedUrlConfig = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    };

    const [url] = await storage
      .bucket(process.env.NEXT_PUBLIC_BUCKET_NAME!)
      .file(fileName)
      .getSignedUrl(options)

      console.log(url)

    return new Response(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate signed URL' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}