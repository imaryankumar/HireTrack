import Asidebar from "../components/Asidebar";
import Navbar from "../components/Navbar";
const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Asidebar className="w-64 bg-gray-100 border-r border-gray-300" />
        <main className="flex-1 overflow-auto overflow-x-hidden p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
