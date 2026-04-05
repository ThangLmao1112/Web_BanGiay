import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Button, Input, Option, Select } from "@material-tailwind/react";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    phone: "",
    role: "",
    createdAt: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  const headers = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
    }),
    [token]
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("Bạn cần đăng nhập để xem hồ sơ.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("/api/users/me", { headers });
        const data = response?.data?.data || {};

        setProfile({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          gender: data.gender || "",
          phone: data.contact?.phone || "",
          role: data.role || "user",
          createdAt: data.createdAt || "",
        });
      } catch (err) {
        setError(err?.response?.data?.message || "Không thể tải hồ sơ.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [headers, token]);

  const handleProfileSave = async () => {
    setError("");
    setSuccess("");
    setSavingProfile(true);

    try {
      const payload = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        gender: profile.gender,
        phone: profile.phone,
      };

      const response = await axios.patch("/api/users/me", payload, { headers });
      const updated = response?.data?.data || {};

      setProfile((prev) => ({
        ...prev,
        firstName: updated.firstName || prev.firstName,
        lastName: updated.lastName || prev.lastName,
        gender: updated.gender || prev.gender,
        phone: updated.contact?.phone || prev.phone,
      }));

      localStorage.setItem("userName", updated.firstName || profile.firstName);
      window.dispatchEvent(new Event("profile-updated"));
      setSuccess("Cập nhật hồ sơ thành công.");
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể cập nhật hồ sơ.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async () => {
    setError("");
    setSuccess("");

    if (
      !passwordForm.oldPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setError("Vui lòng nhập đầy đủ thông tin đổi mật khẩu.");
      return;
    }

    setSavingPassword(true);
    try {
      await axios.post("/api/users/me/change-password", passwordForm, {
        headers,
      });

      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setSuccess("Đổi mật khẩu thành công. Vui lòng đăng nhập lại nếu cần.");
    } catch (err) {
      setError(err?.response?.data?.message || "Không thể đổi mật khẩu.");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-gray-600">Đang tải hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Tài khoản của tôi</h1>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Thông tin cơ bản</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Họ"
            value={profile.firstName}
            onChange={(e) => setProfile((prev) => ({ ...prev, firstName: e.target.value }))}
          />
          <Input
            label="Tên"
            value={profile.lastName}
            onChange={(e) => setProfile((prev) => ({ ...prev, lastName: e.target.value }))}
          />
          <Input label="Email" value={profile.email} disabled />
          <Input
            label="Số điện thoại"
            value={profile.phone}
            onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
          />
          <Select
            label="Giới tính"
            value={profile.gender}
            onChange={(value) => setProfile((prev) => ({ ...prev, gender: value || "" }))}
          >
            <Option value="Male">Nam</Option>
            <Option value="Female">Nữ</Option>
            <Option value="Other">Khác</Option>
          </Select>
          <Input
            label="Vai trò"
            value={profile.role === "admin" ? "Quản trị viên" : "Người dùng"}
            disabled
          />
        </div>

        <p className="text-xs text-gray-500">
          Ngày tạo tài khoản: {profile.createdAt ? new Date(profile.createdAt).toLocaleString("vi-VN") : "-"}
        </p>

        <Button className="bg-gray-800" onClick={handleProfileSave} disabled={savingProfile}>
          {savingProfile ? "Đang lưu..." : "Lưu thông tin"}
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Mật khẩu hiện tại"
            type="password"
            value={passwordForm.oldPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, oldPassword: e.target.value }))
            }
          />
          <div></div>
          <Input
            label="Mật khẩu mới"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
            }
          />
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
          />
        </div>
        <Button className="bg-gray-900" onClick={handlePasswordChange} disabled={savingPassword}>
          {savingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
