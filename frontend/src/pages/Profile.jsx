import HomeLayout from "../Layouts/HomeLayout";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstence";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    status: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/user/profile");
        if (data.success) {
          setUserData(data.user);
          setFormData({
            username: data.user.username || "",
            email: data.user.email || "",
            role: data.user.role || "",
            status: data.user.status || "",
          });
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await axiosInstance.put(
        "/user/profile/update",
        formData
      );
      if (data.success) {
        toast.success("Profile updated ✅");
        setEditMode(false);
      }
    } catch (error) {
      toast.error("Update failed ❌");
    }
  };

  return (
    <HomeLayout>
      <div className="h-full flex items-center justify-center px-2 lg:px-4">
        <div className="bg-slate-100 shadow-xl rounded-2xl p-4 lg:p-8 w-full max-w-lg">
          <div className="text-center pb-6">
            <h2 className=" text-2xl lg:text-4xl font-semibold text-[#2476a8] ">
              My Profile
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                disabled={!editMode}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2] disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled={!editMode}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B8AC2] disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                disabled
                className="mt-1 w-full border px-3 py-2 rounded-md bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <input
                type="text"
                value={formData.status}
                disabled
                className="mt-1 w-full border px-3 py-2 rounded-md bg-gray-100"
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-[#2B8AC2] text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-md hover:bg-[#2476a8] cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        username: userData.username,
                        email: userData.email,
                        role: userData.role,
                        status: userData.status,
                      });
                    }}
                    className="border border-gray-300 text-gray-700 px-3 lg:px-4 py-1.5 lg:py-2 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-[#2B8AC2] text-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-md hover:bg-[#2476a8] cursor-pointer"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default Profile;
