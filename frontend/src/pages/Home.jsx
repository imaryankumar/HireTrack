import HomeLayout from "../Layouts/HomeLayout";
import Dashboard from "./Dashboard";

const Home = () => {
  return (
    <div className="w-full h-screen relative">
      <HomeLayout>
        <Dashboard />
      </HomeLayout>
    </div>
  );
};

export default Home;
