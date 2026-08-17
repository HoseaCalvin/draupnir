"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { toast } from "react-toastify";

import { api } from "@/lib/api";

function ResetPassword() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.patch(`/api/auth/reset`, {
                email: email,
                password: password
            });

            if(response.status === 201) {
                setEmail('');
                setPassword('');
                toast.success("Password reset successful! Please login with your new password!");
            }
        } catch (error) {
            console.error("Error in resetting password!", error);
            toast.error("There was an error while resetting your password. Try again!");
        }
    };

    return(
        <main className="bg-white md:bg-[#FFFDF0]">
            <div className="flex flex-col justify-center items-center px-4 h-[100vh]">
                <form onSubmit={handleSubmit} className="w-full max-w-md h-fit py-8 md:bg-white md:shadow-lg md:rounded-2xl">
                    <div className="flex justify-center p-4">
                        <div>
                            <Image 
                                src="/draupnir-with-text-logo.png" 
                                alt="Draupnir" 
                                className="w-[5.5rem] h-auto xl:w-[7rem]"
                                width={100}
                                height={100}
                            />
                            <p className="text-center font-extrabold text-xs md:text-sm">Reset Password</p>                     
                        </div>
                    </div>
                    <div className="mx-6 mt-2.5 mb-3.5 space-y-2 md:mx-12">
                        <div className="relative">
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="relative rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] border-gray-600 md:h-[50px] lg:p-3" required/>
                            <label className="absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white p-1 md:p-1.5">Email</label>                        
                        </div>
                        <div className="relative">
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="relative rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] border-gray-600 md:h-[50px] lg:p-3" required/>
                            <label className="absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white p-1 md:p-1.5">New Password</label>                        
                        </div>
                    </div>
                    <div className="flex flex-col justify-center w-full xl:mt-10">
                        <button type="submit" className="cursor-pointer bg-[#C39F4A] hover:bg-[#9c854e] mx-auto w-[60%] p-2 text-white text-base font-bold rounded-lg ease-in-out duration-500 lg:my-2.5 lg:text-lg">
                            Reset Password
                        </button>
                        <Link 
                            href='/login' 
                            className="mt-2 text-center text-xs text-gray-500 hover:text-gray-950 ease-in duration-300 lg:text-sm"
                        >
                            Already have an account? Click to login!
                        </Link>     
                    </div>                    
                </form>
            </div>
        </main>
    )
}

export default ResetPassword;