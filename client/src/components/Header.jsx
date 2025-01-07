import react from "react";
import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const {userData} = useContext(AppContext);
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center mt-20 px-4 text-center text-[#E6E6E6]" style = {{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5), -2px -2px 5px rgba(0, 0, 0, 0.5), 2px -2px 5px rgba(0, 0, 0, 0.5), -2px 2px 5px rgba(0, 0, 0, 0.5)' }}>
        <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2"
            style={{
                
            }}>
            Hello {userData ? userData.name : "Developer"}!
        </h1>

        <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
            Welcome to our app
        </h2>

        <p className="mb-8 max-w-md">We're excited to have you here! Start exploring now.</p>

        <button className="border border-[#CCCCCC] rounded-full px-8 py-2.5 hover:bg-[#CCCCCC] hover:text-black text-[#CCCCCC] transition-all">
            Get Started
        </button>
        </div>

    )
}

export default Header;