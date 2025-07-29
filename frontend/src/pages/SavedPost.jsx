import { useEffect, useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import axiosInstance from "../utils/axiosInstence";
import toast from "react-hot-toast";
import { Plus, Search } from "lucide-react";
import JobCardSkeleton from "../components/JobsCardSkelton";
import AllJobCards from "../components/AllJobCards";

const SavedPost = () => {
  const [allSavedPost, setAllSavedPost] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const getSavedPosts = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get("/posts/saved");
      if (data.success) {
        setAllSavedPost(data?.allposts);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error("something went wrong !!" || error?.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getSavedPosts();
  }, []);
  return (
    <HomeLayout>
      <div className="w-full relative h-full py-2">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl">All Saved Applications</h2>
          <div className="flex items-center justify-center gap-4">
            <button className="bg-[#2B8AC2] py-2 px-4 rounded-lg text-white cursor-pointer flex items-center gap-2">
              <Plus size={20} />
              Post a Job
            </button>
            <div className="border py-2 w-64 px-3 rounded-sm flex items-center justify-between">
              <input
                placeholder="Search..."
                className="bg-transparent outline-none border-none w-full h-full pr-1"
              />
              <Search size={20} />
            </div>
          </div>
        </div>
        <div className="w-full relative flex flex-col items-start gap-3 overflow-auto h-[calc(100%-4rem)] pr-4 scrollbar mt-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))
          ) : allSavedPost?.savePosts?.length > 0 ? (
            allSavedPost?.savePosts?.map((item, index) => {
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
