import axios from "axios";

const base = axios.create({
  baseURL: "http://localhost:8081/api/v1/images/upload",
});

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await base.post("", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url; // BE trả về secure_url
};
