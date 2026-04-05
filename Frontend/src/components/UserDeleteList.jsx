import React from "react";
import axios from "axios";
import UserList from "./UserList";
import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";

const UserDeleteList = () => {
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/remove-user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      SuccessToast("Xóa người dùng thành công.");
    } catch (error) {
      ErrorToast("Xóa người dùng thất bại. Vui lòng thử lại sau.");
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="p-4">
      <UserList onDelete={handleDelete} />
    </div>
  );
};

export default UserDeleteList;
