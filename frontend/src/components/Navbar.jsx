import { assets } from "../assets/assets";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";

const Navbar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const onLogoutHandler = () => {
    logout(null, null);
    navigate("/login");
  };
  return (
    <div className="bg-white text-black h-16 lg:h-20 w-full shadow">
      <div className="w-full h-full flex items-center justify-between px-3 lg:px-6">
        <div className="overflow-auto z-10 w-32 lg:w-52">
          <img
            src={assets.logo_img}
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center justify-center gap-4 lg:gap-8">
          <Bell size={25} className="text-gray-600" />
          <button
            onClick={onLogoutHandler}
            className="bg-[#2B8AC2] py-1.5 lg:py-2 px-5 lg:px-6 text-sm lg:text-md rounded-lg text-white cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
