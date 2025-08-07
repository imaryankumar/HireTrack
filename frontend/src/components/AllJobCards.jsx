import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  CalendarDays,
  StickyNote,
  Bookmark,
  Pencil,
  Trash,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstence";
import { useEffect, useState } from "react";
import useJobStore from "../store/jobStore";
import usePostModal from "../store/usePostModal";

const AllJobCards = ({ item, index, isSaved = false, unSavedPost = false }) => {
  const [savedPostIds, setSavedPostIds] = useState([]);
  const isPostSaved = savedPostIds.includes(item._id);
  const [isLoading, setIsLoading] = useState(false);

  const { savedPostData, allJobData } = useJobStore();

  const statusColorMap = {
    applied: "text-blue-700",
    interviewing: "text-amber-700",
    offer: "text-emerald-700",
    rejected: "text-rose-700",
  };

  useEffect(() => {
    const fetchSavedPosts = async () => {
      const data = await savedPostData("/posts/saved");
      const ids = data?.savePosts?.map((post) => post._id) || [];
      setSavedPostIds(ids);
    };
    fetchSavedPosts();
  }, []);

  const onDownloadFileHandler = (downloadUrl) => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onPostSaveHandler = async (id) => {
    try {
      const { data } = await axiosInstance.post(`/posts/save/${id}`);
      if (data?.success) {
        toast.success(data?.message);
        const updated = await savedPostData("/posts/saved", true);
        const ids = updated?.savePosts?.map((post) => post._id) || [];
        setSavedPostIds(ids);
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

  const onPostDeleteHandler = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.delete(`/posts/${id}`);
      if (data?.success) {
        toast.success(data?.message);
        allJobData("/posts/all", true);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("something went wrong!!" || error.message, {
        id: "delete-error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      key={index}
      className="w-full bg-slate-100 border border-[#2B8AC2] shadow-sm rounded-xl p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 capitalize truncate max-w-[800px]">
          {item?.companyName}
        </h2>
        {isSaved && (
          <div className="flex items-center justify-center gap-4">
            <span
              title="Edit post"
              onClick={() =>
                usePostModal.getState().openPostModal("edit", item)
              }
              className="cursor-pointer"
            >
              <Pencil size={22} color="#2B8AC2" />
            </span>
            <span
              title="Save post"
              className="cursor-pointer"
              onClick={() => onPostSaveHandler(item._id)}
            >
              <Bookmark
                size={25}
                className={
                  isPostSaved ? "text-gray-700 fill-gray-700" : "text-gray-700"
                }
              />
            </span>
          </div>
        )}
        {unSavedPost && (
          <span
            onClick={() => usePostModal.getState().openPostModal("edit")}
            title="Edit post"
            className="cursor-pointer"
          >
            <Pencil size={22} color="#2B8AC2" />
          </span>
        )}
      </div>
      <div className="flex justify-between text-sm text-gray-700">
        <div className="space-y-1">
          <p className="flex items-center gap-2 truncate max-w-[200px]">
            <Briefcase size={16} className="text-gray-500" />
            {item?.position}
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays size={16} className="text-gray-500" />
            {new Date(item?.appliedDate).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2 truncate max-w-[120px]">
            <MapPin size={16} className="text-gray-500" />
            {item?.location}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p
            className={`flex items-center gap-2 justify-end ${
              statusColorMap[item?.status] || "text-gray-500"
            }`}
          >
            <Building2 size={16} />
            {item?.status}
          </p>

          <p className="flex items-center text-base gap-2 justify-end">
            <IndianRupee size={16} className="text-gray-500" />
            {item?.salaryRange}
          </p>
          {item?.resume?.url ? (
            <p
              className="flex items-center gap-2 justify-end cursor-pointer text-xs md:text-base hover:underline"
              onClick={() => onDownloadFileHandler(item?.resume?.url)}
            >
              <FileText size={16} className="text-gray-500" />
              {item?.resume?.url?.split("/").pop()}
            </p>
          ) : (
            <p className="flex items-center gap-2 justify-end cursor-pointer text-xs md:text-base">
              <StickyNote size={16} className="text-gray-500" />
              No resume uploaded
            </p>
          )}
        </div>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="text-sm text-gray-500 italic truncate max-w-[120px]">
          "{item?.notes}"
        </p>
        {isSaved && (
          <div className="relative group">
            <span className="cursor-pointer" title="delete">
              <Trash color="red" />
            </span>
            <div className="absolute top-full mt-2 right-0 hidden group-hover:flex flex-col bg-white p-2 rounded shadow border w-32 items-center">
              <p className="text-sm mb-2 text-gray-700 text-center">
                Are you sure Delete?
              </p>
              <button
                onClick={() => onPostDeleteHandler(item._id)}
                className="px-6 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 cursor-pointer"
              >
                {isLoading ? "Loading.." : "Yes"}
              </button>
            </div>
          </div>
        )}
        {unSavedPost && (
          <span
            onClick={() => onPostSaveHandler(item._id)}
            className="cursor-pointer"
            title="unsaved"
          >
            <Bookmark className="text-gray-700 fill-gray-700" />
          </span>
        )}
      </div>
    </div>
  );
};

export default AllJobCards;
