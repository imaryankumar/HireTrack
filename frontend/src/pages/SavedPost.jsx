import { useEffect, useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import axiosInstance from "../utils/axiosInstence";
import toast from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import JobCardSkeleton from "../components/JobsCardSkelton";
import AllJobCards from "../components/AllJobCards";
import useJobStore from "../store/jobStore";
import usePostModal from "../store/usePostModal";

const SavedPost = () => {
  const { saveData, isLoading, savedPostData } = useJobStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (search.trim().length > 1) {
        savedPostData(`/posts/saved?search=${search}`);
      } else {
        savedPostData("/posts/saved");
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [search]);

  useEffect(() => {
    if (saveData && saveData.success === false) {
      toast.error("Post not found!!");
    }
  }, [saveData]);

  return (
    <HomeLayout>
      <div className="w-full relative h-full py-2">
        <div className="w-full flex lg:flex-row flex-col items-center justify-between gap-4 lg:gap-2">
          <h2 className="text-2xl">All Saved Applications</h2>
          <div className="w-full lg:w-auto flex items-center lg:flex-row flex-col justify-center gap-3 lg:gap-4">
            <button
              onClick={() => usePostModal.getState().openPostModal("create")}
              className="bg-[#2B8AC2] py-2 px-4 rounded-lg text-white cursor-pointer flex items-center gap-2 w-full lg:w-auto justify-center"
            >
              <Plus size={20} />
              Post a Job
            </button>
            <div className="border py-2 w-full lg:w-64 px-3 rounded-sm flex items-center justify-between">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="bg-transparent outline-none border-none w-full h-full pr-1"
              />
              <Search size={20} />
            </div>
          </div>
        </div>
        <div className="w-full relative flex flex-col items-start gap-3 overflow-auto h-[calc(100%-4rem)] pr-0 lg:pr-4 scrollbar mt-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))
          ) : saveData?.savePosts?.length > 0 ? (
            saveData?.savePosts?.map((item, index) => {
              return <AllJobCards item={item} key={index} unSavedPost={true} />;
            })
          ) : (
            <div className="w-full h-full text-center pt-20 text-xl">
              Oops! Looks like you don’t have any jobs yet
            </div>
          )}
        </div>
      </div>
    </HomeLayout>
  );
};

export default SavedPost;
