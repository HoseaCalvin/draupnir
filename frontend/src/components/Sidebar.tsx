"use client"

import House from "@/assets/navbar/house.svg";
import Vault from "@/assets/navbar/vault.svg";
import Anvil from "@/assets/navbar/anvil.svg";
import Ledger from "@/assets/navbar/ledger.svg";
import Arrow from "@/assets/navbar/arrow.svg";
import Logout from "@/assets/navbar/logout.svg";
import EditProfile from "@/assets/navbar/edit-profile.svg";
import DeleteProfile from "@/assets/navbar/delete-profile.svg";
import ProfilePicture from "@/assets/navbar/viking-face.svg";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    
    const isViewed = (path: string) => pathname == path ? "shadow-[1px_1px_20px_#FFCF5D]" : "";
    
    const path = (navigationPath: string) => `/private/${navigationPath}`;

    return(
        <>
            <nav className="bg-[#C39F4A] fixed top-0 left-[-1000px] right-0 flex flex-col justify-between p-2 w-[15rem] lg:w-[18rem] h-screen md:left-0">
                <div className="mb-5 flex justify-center items-center">
                    <Image 
                        src="/draupnir-with-text-logo.png" 
                        alt="Draupnir Logo" 
                        width={120} 
                        height={120} 
                        className="items-center"
                    />
                </div>
                <div className="mx-0.5 my-10 justify-center items-center h-full">
                    <ul className="p-2.5 my-5">
                        <Link 
                            href={path("home")} 
                            className={`menu-item flex justify-between inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("home"))}`}
                        >
                            <Image 
                                src={House} 
                                alt="House" 
                                width={23} 
                                height={23}
                            />
                            HOME
                        </Link>
                        <Link 
                            href={path("vault")} 
                            className={`menu-item flex justify-between inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("vault"))}`}
                        >
                            <Image 
                                src={Vault} 
                                alt="Vault" 
                                width={23} 
                                height={23}
                            />
                            VAULT
                        </Link>
                        <Link 
                            href={path("goals")} 
                            className={`menu-item flex justify-between inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("goals"))}`}
                        >
                            <Image 
                                src={Anvil} 
                                alt="Anvil" 
                                width={23} 
                                height={23}
                            />
                            GOALS
                        </Link>
                        <Link 
                            href={path("ledger")} 
                            className={`menu-item flex justify-between inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("ledger"))}`}
                        >
                            <Image 
                                src={Ledger} 
                                alt="Ledger" 
                                width={23} 
                                height={23}
                            />
                            LEDGER
                        </Link>
                    </ul>
                </div>
                <Link 
                    href={path("profile")}
                    className={`flex items-center justify-center mx-3.5 p-2 rounded-xl mb-3 ease-in-out duration-300 hover:shadow-[1px_1px_20px_#FFCF5D] ${isViewed(path("profile"))} lg:gap-x-1 `}
                >
                    <div className="flex justify-between gap-x-2.5 lg:gap-x-3.5">
                        <Image
                            src={ProfilePicture}
                            alt="Viking Face"
                            className="border border-white rounded-full p-2"
                            width={55}
                            height={55}
                        />
                        <h2 className={`text-xl text-white text-center font-bold my-3 px-1 truncate`}>{user?.username}</h2>
                    </div>
                </Link>
            </nav>
        </>
    )
}

export default Sidebar;