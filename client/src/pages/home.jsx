import react from "react";
import Navbar from "../components/NavBar";
import Header from "../components/Header";
const Home = () => {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-[url('/bg_img.png')]  bg-cover bg-center">
            {/* Dark overlay */}
            {/* <div className="absolute inset-0 bg-black/50"></div> */}
    
           
            <Navbar />
            <Header />
            
        </div>
    );
    
}

export default Home;