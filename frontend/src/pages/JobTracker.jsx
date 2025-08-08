import { Search } from "lucide-react";
import HomeLayout from "../Layouts/HomeLayout";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import JobCardSkeleton from "../components/JobsCardSkelton";
import AllJobCards from "../components/AllJobCards";
import useJobStore from "../store/jobStore";

const JobTracker = () => {
  const [search, setSearch] = useState("");
  const { data, isLoading, allJobData } = useJobStore();

  useEffect(() => {
    allJobData("/posts/all");
  }, []);

  useEffect(() => {
    if (data && data.success === false) {
      toast.error("Post not found!!");
    }
  }, [data]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim()) {
        allJobData(`/posts/all?search=${search}`);
      } else {
        allJobData("/posts/all");
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  return (
    <HomeLayout>
      <div className="w-full relative h-full py-2">
        <div className="w-full flex lg:flex-row flex-col items-center justify-between gap-4 lg:gap-2">
          <h2 className="text-2xl">Job Track Applications</h2>
          <div className="w-full lg:w-auto flex items-center lg:flex-row flex-col justify-center gap-3 lg:gap-4">
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
        <div className="w-full relative flex flex-col items-start gap-3 overflow-auto h-full lg:h-[calc(100%-4rem)] pr-0 lg:pr-4 scrollbar mt-10 lg:mt-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))
          ) : data?.getAllPosts?.length > 0 ? (
            data?.getAllPosts?.map((item, index) => {
              return <AllJobCards item={item} key={index} isTrack={true} />;
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

export default JobTracker;
