import React, { useState } from "react";
import axios from "axios";
function UploadPhoto() {
  const [addedphotos, setaddedphotos] = useState([]);
  console.log(addedphotos);

  function uploadImages(e) {
    e.preventDefault();
    // console.log(e); // Can be uncommented for debugging

    const files = e.target.files;
    console.log(files);

    if (!files.length) return;

    console.log({ files });
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    axios
      .post("/api/auth/upload-photos", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const { data: filename } = res;
        console.log(res);
        console.log({ data });
        setaddedphotos((prev) => {
          return [...prev, ...filename]; // Ensure filename is an array if multiple files are uploaded
        });
      })
      .catch((err) => {
        console.error("Error uploading files:", err);
        alert("Failed to upload files. Please try again.");
      });
  }
  return (
    <div>
      {" "}
      <div className="mt-2 gap-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
        {addedphotos.length > 0 &&
          addedphotos.map((link, index) => (
            // console.log(link)

            <div className="flex ">
              {" "}
              <img
                key={index}
                src={`http://localhost:5000${link}`}
                alt=""
                className="w-full rounded-2xl"
              />
            </div>
          ))}
        <label className=" flex justify-center items-center gap-2 border bg-transparent rounded-2xl p-4 mb-2 cursor-pointer">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadImages}
          />
          Upload
        </label>
      </div>
    </div>
  );
}

export default UploadPhoto;
