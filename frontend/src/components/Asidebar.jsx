import { NavLink } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
const Asidebar = () => {
  const userDetails =
    typeof window !== undefined
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  return (
    <div className="w-64 h-full absolute lg:relative bg-[#2B8AC2] text-white text-lg capitalize flex flex-col justify-between py-12 lg:py-16 z-50">
      <span className="absolute top-3 -right-2 block lg:hidden bg-black/90 text-white cursor-pointer rounded-full">
        <ChevronLeft size={20} />
      </span>
      <div className="flex flex-col gap-2 lg:gap-4 items-start justify-center">
        <NavLink
          to="/"
          className="hover:bg-white hover:text-black text-white w-full px-6 py-2 lg:py-3"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/all-jobs"
          className="hover:bg-white hover:text-black text-white w-full px-6 py-2 lg:py-3"
        >
          All Jobs
        </NavLink>
        {/* <NavLink
          to="/applications"
          className="hover:bg-white hover:text-black text-white w-full px-6 py-3"
        >
          My Applications
        </NavLink> */}
        <NavLink
          to="/saved-posts"
          className="hover:bg-white hover:text-black text-white w-full px-6 py-2 lg:py-3"
        >
          Saved Posts
        </NavLink>
        <NavLink
          to="/job-tracker"
          className="hover:bg-white hover:text-black text-white w-full px-6 py-2 lg:py-3"
        >
          Job Tracker
        </NavLink>
        <NavLink
          to="/profile"
          className="hover:bg-white hover:text-black text-white w-full px-6 py-2 lg:py-3"
        >
          Profile
        </NavLink>
      </div>
      <div className="py-4 px-4 bg-white text-black border-r-4 border-l-4 border-[#2B8AC2] flex items-center justify-start gap-3 text-sm lg:text-base">
        <span className="w-12 h-12 rounded-full flex items-center justify-center uppercase bg-[#2B8AC2] text-white">
          {userDetails?.username?.slice(0, 2) || "He"}
        </span>
        <div className="flex flex-col items-start justify-center">
          <span className="capitalize">
            {userDetails?.username || "Hello123"}
          </span>
          <span className=" lowercase">
            {userDetails?.email || "hello@gmail.com"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Asidebar;
