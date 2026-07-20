"use client"

import { House, Vault, Anvil, NotebookText, CircleUser } from "lucide-react";

import Logout from "@/assets/navbar/logout.svg";
import EditProfile from "@/assets/navbar/edit-profile.svg";
import DeleteProfile from "@/assets/navbar/delete-profile.svg";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";
import ProfilePopup from "./ProfilePopup";

function Sidebar() {
    const { user } = useAuth();
    const pathname = usePathname();

    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState<boolean>(false);
    
    const isViewed = (path: string) => pathname == path ? "shadow-[1px_1px_20px_#FFCF5D]" : "";
    
    const path = (navigationPath: string) => `/private/${navigationPath}`;

    return(
        <>
            { isProfilePopupOpen &&
                <div className="fixed -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-[300px] md:bottom-[-30px] md:left-[170px]">
                    <ProfilePopup
                        setIsPopupOpen={setIsProfilePopupOpen}
                    />
                </div>
            }

            <nav className="bg-[#C39F4A] fixed hidden flex-col justify-between w-[17rem] h-screen md:flex md:left-0">
                <div className="mb-5 flex justify-center items-center">
                    <Image 
                        src="/draupnir-with-text-logo.png" 
                        alt="Draupnir Logo" 
                        width={130} 
                        height={130} 
                        className="items-center p-1.5"
                    />
                </div>
                <div className="mx-0.5 my-10 justify-center items-center h-full">
                    <ul className="p-2.5 my-5">
                        <Link 
                            href={path("home")} 
                            className={`menu-item flex justify-between mx-2 inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("home"))}`}
                        >
                            <House  
                                aria-label="House Icon"
                                className="w-[23px] h-auto"
                            />
                            HOME
                        </Link>
                        <Link 
                            href={path("vault")} 
                            className={`menu-item flex justify-between mx-2 inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("vault"))}`}
                        >
                            <Vault  
                                aria-label="Vault Icon"
                                className="w-[23px] h-auto"
                            />
                            VAULT
                        </Link>
                        <Link 
                            href={path("goals")} 
                            className={`menu-item flex justify-between mx-2 inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("goals"))}`}
                        >
                            <Anvil  
                                aria-label="Goals Icon"
                                className="w-[23px] h-auto"
                            />
                            GOALS
                        </Link>
                        <Link 
                            href={path("ledger")} 
                            className={`menu-item flex justify-between mx-2 inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("ledger"))}`}
                        >
                            <NotebookText  
                                aria-label="Ledger Icon"
                                className="w-[23px] h-auto"
                            />
                            LEDGER
                        </Link>
                    </ul>
                </div>
                <hr className="text-white"/>
                <div 
                    onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                    className={`flex items-center justify-center pt-4 pb-3 ease-in-out duration-300 cursor-pointer ${isProfilePopupOpen ? 'bg-[#b38f3d]' : ''} ${isViewed(path("profile"))} lg:gap-x-1 `}
                >
                    <div className="flex justify-between gap-x-2.5 lg:gap-x-3.5">
                        <CircleUser  
                            aria-label="Profile Icon"
                            className="text-white w-[50px] h-auto"
                        />
                        <h2 className={`text-xl text-white text-center font-bold my-3 px-1 truncate`}>{user?.username}</h2>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Sidebar;