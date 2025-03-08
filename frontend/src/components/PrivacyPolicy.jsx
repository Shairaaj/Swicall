// PrivacyPolicy.jsx
import React, { useEffect, useState } from "react";

const PrivacyPolicy = () => {
  const [content, setContent] = useState("Loading...");

  useEffect(() => {
    fetch("https://swicall.onrender.com/privacy")
      .then((response) => response.text())
      .then((data) => setContent(data))
      .catch((error) => setContent("Failed to load privacy policy."));
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default PrivacyPolicy;
