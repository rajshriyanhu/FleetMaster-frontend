import { v4 as uuidv4 } from 'uuid';

export function useFileUpload() {
  const uniqueId = uuidv4();  
  return async (filename: string, file: File) => {
      const result = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_PROD}/generate-upload-url?file_name=${filename}`);
      const { url, fields } = await result.json();
      const formData = new FormData();
      Object.entries({ ...fields, file }).forEach(([key, value]) => {
        formData.append(key, value as string | Blob);
      });
      const upload = await fetch(url, {
        method: "POST",
        body: formData,
      });
      return {
        ok: upload.ok,
        filename,
      }
    };
  }