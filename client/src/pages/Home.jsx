import Content from "../components/Content";
import SideBar from "../components/SideBar";

const Home = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:min-h-screen">
      <SideBar />
      <Content />
    </div>
  );
};

export default Home;
