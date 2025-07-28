import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  CalendarDays,
  StickyNote,
  Bookmark,
  Pencil,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstence";
import { useState } from "react";

const AllJobCards = ({ item, index, isSaved = false }) => {
  const [savedPostIds, setSavedPostIds] = useState([]);
  const isPostSaved = savedPostIds.includes(item._id);
  const onPostSaveHandler = async (id) => {
    try {
      const { data } = await axiosInstance.post(`/posts/save/${id}`);
      if (data?.success) {
        toast.success(data?.message);
        setSavedPostIds(data?.savedPosts);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("something went wrong!!" || error.message, {
        id: "post-error",
      });
    }
  };

  return (
    <div
      key={index}
      className="w-full bg-slate-100 border border-[#2B8AC2] shadow-sm rounded-xl p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          {item?.companyName}
        </h2>
        {isSaved && (
          <div className="flex items-center justify-center gap-4">
            <span title="Edit profile" className="cursor-pointer">
              <Pencil size={22} color="red" />
            </span>
            <span
              title="Save post"
              className="cursor-pointer"
              onClick={() => onPostSaveHandler(item._id)}
            >
              <Bookmark
                size={25}
                className={
                  isPostSaved ? "text-gray-700" : "text-gray-700 fill-gray-700"
                }
              />
            </span>
          </div>
        )}
      </div>
      <div className="flex justify-between text-sm text-gray-700">
        <div className="space-y-1">
          <p className="flex items-center gap-2">
            <Briefcase size={16} className="text-gray-500" />
            {item?.position}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="text-gray-500" />
            {new Date(item?.appliedDate).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            {item?.location}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="flex items-center gap-2 justify-end">
            <Building2 size={16} className="text-gray-500" />
            {item?.status}
          </p>
          <p className="flex items-center gap-2 justify-end">
            <IndianRupee size={16} className="text-gray-500" />
            {item?.salaryRange}
          </p>
          <p className="flex items-center gap-2 justify-end">
            <StickyNote size={16} className="text-gray-500" />
            Note added
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-500 italic">"{item?.notes}"</p>
    </div>
  );
};

export default AllJobCards;
