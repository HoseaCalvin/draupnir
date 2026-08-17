"use client"

import { useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useAuth } from "../../providers/AuthProvider";

import { toast } from 'react-toastify';

function Login() {
    const { login } = useAuth();

    const router = useRouter();

    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const res = await login(username, password);

            if(res) {
                toast.success("Login Successful!");
                router.push("/private/home");
            } else {
                setError(true);
            }
        } catch (err: any) {
            console.error("Error logging in!", err);
            toast.error("Error: " + err.response?.data?.message);
        } finally {
            setError(false);
            setIsSubmitting(false);
        }
    };

    return (
        <main className="bg-white md:bg-[#FFFDF0]">
            <div className="flex flex-col justify-center items-center px-5 h-[100vh]">
                <form onSubmit={handleSubmit} className="w-full max-w-md h-fit py-8 md:bg-white md:shadow-lg md:rounded-2xl">
                    <div className="flex justify-center">
                        <div>
                            <Image 
                                src="/draupnir-with-text-logo.png" 
                                alt="Draupnir" 
                                className="w-[5.5rem] h-auto xl:w-[7rem]"
                                width={100}
                                height={100}
                            />
                            <p className="text-center font-extrabold text-xs md:text-sm">Login</p>                     
                        </div>
                    </div>
                    <div className="mx-6 mt-5 mb-3.5 space-y-2 md:mx-12">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                className={`rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] ${error ? 'border-red-500' : 'border-gray-600'} md:h-[50px] lg:p-3`} 
                                required
                            />
                            <label className={`absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white ${error ? 'text-red-500' : 'text-gray-600'} p-1 md:p-1.5`}>Username</label>
                        </div>
                        <div className="relative">
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                className={`relative rounded-sm w-full h-[40px] px-2 my-2 border-[1.5px] ${error ? 'border-red-500' : 'border-gray-600'} md:h-[50px] lg:p-3`} 
                                required
                            />
                            <label className={`absolute top-[-5px] left-[10px] font-bold text-xs text-center bg-white ${error ? 'text-red-500' : 'text-gray-600'} p-1 md:p-1.5`}>Password</label>                        
                        </div>
                        <div className="mt-2">
                            { error && <p className='text-red-500 font-semibold text-xs text-center'>{error}</p> }
                        </div>
                    </div>
                    <div className="flex flex-col justify-center w-full mt-8 gap-y-3 xl:mt-12">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="main-button mx-auto w-[80%] p-2 text-sm animate md:text-base md:w-[60%] lg:text-lg"
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </button>
                        <Link 
                            href='/register' 
                            className="secondary-button text-center mx-auto w-[80%] p-2 text-sm animate md:text-base md:w-[60%] lg:text-lg"
                        >
                            Sign Up
                        </Link>
                        <div className="flex flex-col">
                            <Link 
                                href='/reset' 
                                className="text-center underline underline-offset-1 text-xs text-gray-500 hover:text-gray-950 ease-in duration-300 lg:text-sm"
                            >
                                Reset password
                            </Link> 
                        </div>
                    </div>                    
                </form>
            </div>
        </main>
    )
}

export default Login;