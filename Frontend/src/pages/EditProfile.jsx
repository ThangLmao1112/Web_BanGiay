import React, { useState } from "react";
import { Button, Input } from "@material-tailwind/react";

const EditProfile = () => {
  const [name, setName] = useState(localStorage.getItem("userName") || "");

  const handleSave = () => {
    localStorage.setItem("userName", name.trim() || "Người dùng");
    window.dispatchEvent(new Event("profile-updated"));
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Chỉnh sửa hồ sơ</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <Input
          label="Tên hiển thị"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button className="bg-gray-800" onClick={handleSave}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
