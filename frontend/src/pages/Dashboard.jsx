import { useEffect } from "react";
import JobCard from "../components/JobCard";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstence";
import { useState } from "react";
import JobCardSkeleton from "../components/JobsCardSkelton";
import AllJobCards from "../components/AllJobCards";
import {
  FilePlus,
  Mic,
  BadgeCheck,
  XCircle,
  Search,
  Filter,
} from "lucide-react";

const Dashboard = () => {
  const [jobLists, setJobLists] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState("applied");

  const getJobApplicationData = async () => {
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.get(`/posts/all/?status=${listId}`);
      if (data?.success) {
        setJobLists(data?.allPosts);
      } else {
        toast.error("Joblists not found!!");
      }
    } catch (error) {
      console.error(error.message);
      toast.error("soemthing went wrong!!" || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getJobApplicationData();
  }, [listId]);

  const JobsCards = [
    {
      id: 1,
      icon: <FilePlus />,
      count: jobLists?.jobsLength?.appliedCount || 0,
      label: "applied",
      bgColor: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      icon: <Mic />,
      count: jobLists?.jobsLength?.interviewCount || 0,
      label: "interviewing",
      bgColor: "bg-yellow-100 text-yellow-600",
    },
    {
      id: 3,
      icon: <BadgeCheck />,
      count: jobLists?.jobsLength?.offerCount || 0,
      label: "offer",
      bgColor: "bg-green-100 text-green-600",
    },
    {
      id: 4,
      icon: <XCircle />,
      count: jobLists?.jobsLength?.rejectCount || 0,
      label: "rejected",
      bgColor: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="w-full h-full relative">
      <div className="w-full h-auto gap-4 relative flex items-center justify-between py-2">
        {JobsCards?.map((item, index) => {
          return (
            <JobCard
              data={item}
              key={index}
              listId={listId}
              setListId={setListId}
            />
          );
        })}
      </div>
      <div className="w-full py-4">
        <div className="flex items-center justify-between">
          <h1 className="capitalize text-3xl">{listId} Jobs</h1>
          <div className="flex items-center justify-center gap-4">
            <div className="relative group inline-block">
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-slate-100 rounded-md hover:bg-slate-200  cursor-pointer">
                <Filter size={18} />
                <span className="hidden sm:inline">Filter</span>
              </button>
              <div className="absolute z-10 mt-2 w-40 bg-white border rounded-md shadow-md opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all origin-top-left p-2 space-y-1">
                {JobsCards?.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setListId(item.label)}
                    className="flex items-center w-full gap-2 px-3 py-1.5 text-sm text-left rounded hover:bg-gray-100 cursor-pointer"
                  >
                    <span className="capitalize">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="border py-2 w-64 px-3 rounded-sm flex items-center justify-between">
              <input
                placeholder="Search..."
                className="bg-transparent outline-none border-none w-full h-full pr-1"
              />
              <Search size={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full relative flex flex-col items-start gap-3 overflow-auto h-[calc(100%-15rem)] pr-4 scrollbar">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <JobCardSkeleton key={index} />
          ))
        ) : jobLists?.getAllPosts?.length > 0 ? (
          jobLists?.getAllPosts?.map((item, index) => {
            return <AllJobCards item={item} key={index} />;
          })
        ) : (
          <div className="w-full h-full text-center pt-20 text-xl">
            Oops! Looks like you don’t have any jobs yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
