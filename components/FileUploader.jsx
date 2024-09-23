"use client";
import { useState, useRef } from "react";

export default function FileUploader() {
  const [imageURL, setImageURL] = useState(null);
  const [removeBg, setRemoveBg] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle image selection and display a preview
  const handleImageChange = () => {
    const fileInput = fileInputRef.current;
    const image = fileInput.files[0];

    if (image) {
      const previewUrl = URL.createObjectURL(image); // Create a preview URL for the selected image
      setImageURL(previewUrl);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const fileInput = fileInputRef.current;
    const image = fileInput.files[0];
    setLoading(true);

    if (!image) {
      alert("Please select an image first!");
      return;
    }

    const formData = new FormData();
    formData.append("image_file", image);

    // Send the file to the Next.js API route
    const response = await fetch("/api/remove-bg", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setRemoveBg(imageUrl);
      setImageURL(imageUrl);
      setLoading(false);
    } else {
      alert("Error removing background");
      setLoading(false);
    }
  };

  const downloadFile = () => {
    const anchorElement = document.createElement("a");
    anchorElement.href = imageURL;
    anchorElement.download = "processed-image.png";
    document.body.appendChild(anchorElement);
    anchorElement.click();
    document.body.removeChild(anchorElement);
  };

  return (
    <div className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4  p-5 w-full md:w-[80%] xl:w-2/4 ">
      <div>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-[55%]">
            <video className="w-[80%]" autoPlay muted playsInline>
              <source src="assets/emilia_compressed.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <h1 className="font-bold text-3xl text-black font-sans">
              Instantly Remove Backgrounds from Your Images! ✨
            </h1>
          </div>
          <div className="bg-white shadow-xl py-10 px-5 rounded-lg w-full md:w-[40%] flex items-center justify-center">
            <form className="text-center">
              <div className="form-group">
                <input
                  ref={fileInputRef}
                  id="fileInput"
                  className="form-control"
                  type="file"
                  onChange={handleImageChange}
                  hidden
                />
                {!imageURL && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      fileInputRef.current.click();
                    }}
                    className="bg-blue-500 text-white px-5 py-3 rounded-full outline-none"
                  >
                    Select Image
                  </button>
                )}
              </div>
              {imageURL && (
                <>
                  <div className="w-full h-[500px] overflow-hidden rounded-lg">
                    <img
                      src={imageURL}
                      alt="Selected Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {!removeBg && (
                    <button
                      className="bg-blue-500 text-white px-8 py-3 rounded-full outline-none mt-5"
                      type="button"
                      onClick={submitHandler}
                      disabled={loading}
                    >
                      {loading ? "Removing..." : "Let's Remove Background"}
                    </button>
                  )}
                  {removeBg && (
                    <button
                      className="bg-blue-500 text-white px-8 py-3 rounded-full outline-none mt-5"
                      onClick={downloadFile}
                    >
                      Download
                    </button>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
