import { assets } from "../assets/assets";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const onLogoutHandler = () => {
    logout(null, null);
    navigate("/login");
  };
  return (
    <div className="bg-[#FEFAF0] text-black h-20 w-full shadow-sm">
      <div className="w-full h-full flex items-center justify-between px-6">
        <div className="overflow-auto z-10 w-52">
          <img
            src={assets.logo_img}
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>
        <button
          onClick={onLogoutHandler}
          className="bg-[#2B8AC2] py-2 px-6 rounded-lg text-white cursor-pointer"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
