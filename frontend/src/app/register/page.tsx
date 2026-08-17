"use client"

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { api } from "@/lib/api";

import DatePicker from "react-datepicker";
import { toast } from "react-toastify";

import "react-datepicker/dist/react-datepicker.css";

function Register() {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>(''); 
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const isUsernameError = error && username.length <= 0;
    const isEmailError = error && email.length <= 0;
    const isPasswordError = error && password.length <= 0;
    
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!username || !email || !password) {
            setError(true);
            return;
        }

        try {
            const register = await api.post(`/api/users/register`, { 
                username, email, password
            }, {
                withCredentials: false 
            });

            if(register.status === 201) {
                toast.success("Create account successful! Please login with the credentials!");
            }

            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error) {
            toast.error("Error in creating your account. Please try again!");
            console.error("Error in creating your account!", error);
        } finally {
            setError(false);
        }
    }
    
    return(
        <main className="bg-white h-[100vh] md:bg-[#FFFDF0]">
            <div className="flex flex-col justify-center items-center px-4 h-[100vh]">
                <form onSubmit={handleRegister} className="w-full max-w-md h-fit py-8 md:bg-white md:shadow-lg md:rounded-2xl">
                    <div className="flex justify-center">
                        <div>
                            <Image 
                                src="/draupnir-with-text-logo.png" 
                                alt="Draupnir" 
                                className="w-[5.5rem] h-auto xl:w-[6rem]"
                                width={100}
                                height={100}
                            />                        
                            <p className="text-center font-extrabold text-xs md:text-sm">Register</p>
                        </div>
                    </div>
                    <div className="mx-6 mt-2.5 mb-4 space-y-0.5 md:mx-12">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className={`rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] ${isUsernameError ? 'border-red-500' : 'border-gray-600'} lg:h-[45px] lg:p-2`}
                            />
                            <label className={`absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white ${isUsernameError ? 'text-red-500' : 'text-gray-600'} p-1.5`}>Username</label>
                            { isUsernameError && <p className="text-red-500 text-xs font-semibold mb-3">Username must not be empty!</p> }
                        </div>
                        <div className="relative">
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className={`rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] ${isEmailError ? 'border-red-500' : 'border-gray-600'} lg:h-[45px] lg:p-2`} 
                            />
                            <label className={`absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white ${isEmailError ? 'text-red-500' : 'text-gray-600'} p-1.5`}>Email</label>
                            { isEmailError && <p className="text-red-500 text-xs font-semibold mb-3">Email must not be empty!</p>}                        
                        </div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className={`rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] ${isPasswordError ? 'border-red-500' : 'border-gray-600'} md:h-[45px] lg:p-2`} 
                            />
                            <label className={`absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white ${isPasswordError ? 'text-red-500' : 'text-gray-600'} p-1.5`}>Password</label>                        
                            { isPasswordError && <p className="text-red-500 text-xs font-semibold mb-3">Password must not be empty!</p>}                                                                  
                        </div>
                    </div>
                    <div className="flex flex-col justify-center w-full xl:mt-12">
                        <button type="submit" className="cursor-pointer bg-[#C39F4A] hover:bg-[#9c854e] mx-auto w-[60%] p-2 text-white text-base font-bold rounded-lg ease-in-out duration-500 xl:text-lg">
                            Register
                        </button>
                        <Link 
                            href='/login' 
                            className="mt-2 text-center text-xs underline underline-offset-1 text-gray-500 hover:text-gray-950 ease-in duration-300 xl:text-sm"
                        >
                            Back to login
                        </Link>                
                    </div>
                </form>
            </div>
        </main>
    )
}

export default Register;