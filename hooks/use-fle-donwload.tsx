export const downloadFile = async (filename: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL_PROD}/generate-download-url?file_name=${filename}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch the signed URL');
      }
      const { download_url } = await response.json();

      console.log(response, download_url)
      if (typeof window !== 'undefined') {
        window.open(download_url, '_blank');
      }
    } catch (error) {
      console.log('Error downloading file:', error);
    }
  }