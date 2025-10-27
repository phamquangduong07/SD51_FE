// src/utils/cloudinary.js
import axios from "axios";

const CLOUD_NAME = "drtrpwvpc";
const UPLOAD_PRESET = "fsneakers_unsigned"; // 👈 đúng tên preset bạn tạo

export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("ml_default", UPLOAD_PRESET);

  const res = await axios.post(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  console.log("✅ Cloudinary response:", res.data);
  return res.data.secure_url;
};
