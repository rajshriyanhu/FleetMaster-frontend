export function useFileUpload() {
  return async (filename: string, file: File) => {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL_PROD}/generate-upload-url?file_name=${filename}`
    );
    const { upload_url } = await result.json(); // Expecting a signed URL response

    // Upload the file using PUT request (as in the Python example)
    const upload = await fetch(upload_url, {
      method: "PUT",
      body: file, // Send raw file data
      headers: {
        "Content-Type": "application/octet-stream", // Match Python headers
      },
    });

    return {
      ok: upload.ok,
      filename,
    };
  };
}