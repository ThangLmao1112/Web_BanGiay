import React from "react";

const Inbox = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold mb-6">Hộp thư</h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-gray-700">Bạn chưa có thông báo mới.</p>
      </div>
    </div>
  );
};

export default Inbox;
