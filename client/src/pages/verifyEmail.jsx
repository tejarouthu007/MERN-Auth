import react, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const {backendUrl, isLoggedIn, userData, getUserData} = useContext(AppContext);
    const inputrefs = react.useRef([]);

    const handleInput = (e, idx) => {
        if(e.target.value.length>0 && idx<inputrefs.current.length-1) {
            inputrefs.current[idx+1].focus();
        }
    }
    
    const handleKeyDown = (e,idx) => {
        if(e.key==='Backspace' && e.target.value === "" && idx>0) {
            inputrefs.current[idx-1].focus();
        }
    }
    
    const handlePaste = (e)=> {
        const paste = e.clipboardData.getData('text');
        const pasteArr = paste.split('');
        pasteArr.forEach((num, idx)=>{
            if(inputrefs.current[idx]) {
                inputrefs.current[idx].value = num;
                inputrefs.current[idx].focus();
            }
        })
    }

    const onSubmitHandler = async(e) => {
        try {

            e.preventDefault();
            const otpArr = inputrefs.current.map(e=>e.value);
            const otp = otpArr.join('');
            const {data} = await axios.post(backendUrl+"/api/auth/verify-account", {otp});

            if(data.success) {
                toast.success(data.message);
                getUserData();
                navigate('/');
            }
            else {
                toast.error(data.message);
            }
        }
        catch(err) {
            toast.error(err.message);
        }
    }

    useEffect(()=>{
        isLoggedIn && userData && userData.isVerified && navigate('/');
    },[isLoggedIn,userData]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('/bg_img.png')]  bg-cover bg-center">
            <img onClick={()=>navigate('/')} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"/>

            <form onSubmit={onSubmitHandler} className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">Verification OTP</h1>
                <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email.</p>
                <div className="flex justify-between mb-8" onPaste={handlePaste}>
                    {Array(6).fill(0).map((_,index) => (
                        <input type="text" maxLength='1' key={index} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md" ref={e=>inputrefs.current[index] = e} onInput={e => handleInput(e, index)}
                        onKeyDown={e => handleKeyDown(e, index)}/>
                    ))}
                </div>

                <button className="w-full py-3 bg-gradient-to-r from-[#D55209] to-[#B03C02] text-white rounded-full">Verify Account</button>
            </form>
        </div>
    )
}

export default VerifyEmail;