import axios from "axios";

const BASE_URL = import.meta.env.VITE_FILE_UPLOAD_URL;
const imagebaseurl = 'https://doctor.phed.com.ng';
/**
 * Upload file and return absolute path + web URL
 */
export async function uploadFile({
  file,
  uploadedBy,
  appId = "57d3cab9-013c-4bfe-5c36-08ddaf854fd3",
}: {
  file: File;
  uploadedBy: string;
  appId?: string;
}): Promise<{
  filePath: string;
  fileUrl: string;
}> {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("appId", appId);
  formData.append("uploadedBy", uploadedBy);
  formData.append("file", file);

const res = await axios.post(
  `${BASE_URL}Uploadedfiles/CreateFile?appId=${appId}&uploadedBy=${uploadedBy}`,
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
   // validateStatus: (status) => status >= 200 && status < 300,
  }
);
console.log("File upload response:", res);
// SUCCESS = HTTP 200
if (res.data?.filePath == null && res.data?.fileName == null) {
  throw new Error(res.data?.message || "File upload failed");
}

const mediaUrl = `${imagebaseurl}${res.data.filePath}`;
  return {
    filePath: res.data.filePath, // absolute path
    fileUrl: mediaUrl, // web-accessible URL
  };
}
