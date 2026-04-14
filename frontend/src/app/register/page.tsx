"use client"

import { useState } from "react";
import Link from "next/link";

import { api } from "@/lib/api";

import { toast } from "react-toastify";

function Register() {
    const [username, setUsername] = useState<string>('');
    const [dob, setDob] = useState<string>('');
    const [gender, setGender] = useState<string>('Prefer not to say');    
    const [password, setPassword] = useState<string>('');

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const register = await api.post(`/api/users/register`, { 
                username, dob, gender, password
            }, {
                withCredentials: false 
            });

            if(register.status === 201 || register.status === 200) {
                toast.success("Create account successful! Please login with the credentials!");
            } else {
                toast.error("Create account failed. Please try again!");
            }

            setUsername('');
            setDob('');
            setGender('Prefer not to say');
            setPassword('');
        } catch (error) {
            toast.error("Error in creating your account. Please try again!")
        }
    }
    
    return(
        <div className="bg-[#FFFDF0]">
            <div className="flex justify-center items-center px-4 h-[100vh]">
                <form onSubmit={handleRegister} className="bg-white w-md h-[83vh] shadow-lg rounded-2xl">
                    <div className="flex justify-center p-2">
                        <div>
                            <img src="/draupnir-with-text-logo.png" alt="Draupnir" className="w-[5.5rem] h-auto xl:w-[6rem]"/>                        
                            <p className="text-center font-extrabold text-xs md:text-sm">Register</p>
                        </div>
                    </div>
                    <div className="mx-6 mt-2.5 mb-4 space-y-0.5 lg:mx-12">
                        <div className="relative">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] border-gray-600 md:h-[45px] lg:p-2" required/>
                            <label className="absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white p-1.5">Username</label>
                        </div>
                        <div className="relative">
                            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] border-gray-600 md:h-[45px] lg:p-2" required/>
                            <label className="absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white p-1.5">Date of Birth</label>                        
                        </div>
                        <div className="relative">
                            <select onChange={(e) => setGender(e.target.value)} className="rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] border-gray-600 md:h-[45px] lg:p-2" required>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                            {/* <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} className="rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] border-gray-600 md:h-[45px] lg:p-2" required/> */}
                            <label className="absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white p-1.5">Gender</label>                        
                        </div>
                        <div className="relative">
                            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] border-gray-600 md:h-[45px] lg:p-2" required/>
                            <label className="absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white p-1.5">Password</label>                        
                        </div>
                    </div>
                    <div className="flex flex-col justify-center w-full xl:mt-16">
                        <button type="submit" className="cursor-pointer bg-[#C39F4A] hover:bg-[#9c854e] mx-auto w-[60%] p-2 text-white text-base font-bold rounded-lg ease-in-out duration-500 lg:text-lg">
                            Register
                        </button>
                        <Link 
                            href='/login' 
                            className="mt-1 text-center text-xs text-gray-500 hover:text-gray-950 ease-in duration-300 lg:text-sm"
                        >
                            Already have an account? Click to login!
                        </Link>                
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;