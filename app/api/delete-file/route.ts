import { Storage } from '@google-cloud/storage';

const storage = new Storage();

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { fileName } = body;

    console.log(fileName);

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'fileName is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await storage
      .bucket(process.env.NEXT_PUBLIC_BUCKET_NAME!)
      .file(fileName)
      .delete();

    return new Response(JSON.stringify({ message: 'File deleted successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete the file' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}