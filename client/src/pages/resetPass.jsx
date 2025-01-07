import react, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
    const {backendUrl} = useContext(AppContext);
    axios.defaults.withCredentials = true;

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEmailSent, setIsEmailSent] = useState("");
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

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

    const onSubmitEmail = async(e) => {
        e.preventDefault();
        try {
            const {data} = await axios.post(backendUrl+'/api/auth/get-reset-otp', {email});
            data.success ? toast.success(data.message) : toast.error(data.message);
            data.success && setIsEmailSent(true);
        } catch(err) {
            toast.error(err.message);
        }
    }

    const onSubmitOtp = async(e) => {
        e.preventDefault();
        const otpArr = inputrefs.current.map(e => e.value);
        setOtp(otpArr.join(""));
        setIsOtpSubmitted(true);
    }

    const onSubmitNewPassword = async(e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(backendUrl+"/api/auth/reset-password", {email, otp, newPassword});

            data.success ? toast.success(data.message) : toast.error(data.message);

            data.success && navigate('/login');
        } catch(err) {
            toast.error(err.message);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[url('/bg_img.png')]  bg-cover bg-center">
            <img onClick={()=>navigate('/')} src={assets.logo} alt="" className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"/>

        {!isEmailSent && 

            <form onSubmit={onSubmitEmail} className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg w-96 text-sm">
            <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
            <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.mail_icon} alt="" className="w-3 h-3"/>
                <input type="email" placeholder="Email id" className="bg-transparent outline-none text-white" value={email} onChange={e => setEmail(e.target.value)} required/>
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-[#D55209] to-[#B03C02] text-white rounded-full mt-3">Submit</button>
            </form> }

            {!isOtpSubmitted && isEmailSent &&
            <form onSubmit={onSubmitOtp} className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password OTP</h1>
                <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email.</p>
                <div className="flex justify-between mb-8" onPaste={handlePaste}>
                    {Array(6).fill(0).map((_,index) => (
                        <input type="text" maxLength='1' key={index} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md" ref={e=>inputrefs.current[index] = e} onInput={e => handleInput(e, index)}
                        onKeyDown={e => handleKeyDown(e, index)}/>
                    ))}
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-[#D55209] to-[#B03C02] text-white rounded-full">Verify Account</button>
            </form> }


            {isOtpSubmitted && isEmailSent &&
            <form onSubmit={onSubmitNewPassword} className="bg-[#1A1A1A] p-8 rounded-lg shadow-lg w-96 text-sm">
            <h1 className="text-white text-2xl font-semibold text-center mb-4">New Password</h1>
            <p className="text-center mb-6 text-indigo-300">Enter your new password below</p>
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                <img src={assets.lock_icon} alt="" className="w-3 h-3"/>
                <input type="password" placeholder="Enter password" className="bg-transparent outline-none text-white" value={newPassword} onChange={e => setNewPassword(e.target.value)} required/>
            </div>
            <button className="w-full py-2.5 bg-gradient-to-r from-[#D55209] to-[#B03C02] text-white rounded-full mt-3">Submit</button>
            </form> }
        </div>
    )
}

export default ResetPassword;