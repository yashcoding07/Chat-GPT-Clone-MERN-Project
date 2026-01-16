import MainWindow from "../components/MainWindow";
import SideBar from "../components/SideBar";

const Home = () => {
  return (
    <div className="h-screen w-full bg-gray-900 text-white flex">
      <SideBar />
      <MainWindow />
    </div>
  )
};

export default Home