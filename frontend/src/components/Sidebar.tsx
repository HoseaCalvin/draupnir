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
import { usePathname } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

function Sidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState<boolean>(false);
    
    const isViewed = (path: string) => pathname == path ? "shadow-[1px_1px_20px_#FFCF5D]" : "";
    
    const path = (navigationPath: string) => `/private/${navigationPath}`;

    return(
        <>
            { isProfilePopupOpen &&
                <div className="fixed -translate-x-1/2 -translate-y-1/2 z-40 w-fit border border-[#9F7D38] bg-[#C39F4A] shadow-xl rounded-lg px-2.5 py-2 md:bottom-[30px] md:left-[140px]">
                    <div className="flex flex-col w-full mr-6">
                        <Link
                            onClick={logout}
                            href={"/login"}
                            className="flex items-center hover:bg-[#b38f3d] text-white text-xs cursor-pointer font-semibold w-full gap-x-2 py-1 px-1 md:text-sm lg:text-base lg:rounded-lg lg:py-2 lg:px-2"
                        >
                            <Image
                                src={Logout}
                                alt="Log Out"
                                className="h-auto md:w-[25px]"
                                width={20}
                                height={20}
                            />
                            Log Out
                        </Link>
                        <Link
                            href={"/private/profile/edit"}
                            className=" flex items-center hover:bg-[#b38f3d] text-white text-xs cursor-pointer font-semibold w-full gap-x-2 py-1 px-1 md:text-sm lg:text-base lg:rounded-lg lg:py-2 lg:px-2"
                            aria-disabled
                        >
                            <Image
                                src={EditProfile}
                                alt="Edit Profile"
                                className="h-auto md:w-[25px]"
                                width={20}
                                height={20}
                            />
                            Edit Profile
                        </Link>
                        <Link
                            href={"/private/profile/delete"}
                            className="flex items-center hover:bg-[#b38f3d] text-white text-xs cursor-pointer font-semibold w-full gap-x-2 py-1 px-1 md:text-sm lg:text-base lg:rounded-lg lg:py-2 lg:px-2"
                        >
                            <Image
                                src={DeleteProfile}
                                alt="Delete Profile"
                                className="h-auto md:w-[25px]"
                                width={20}
                                height={20}
                            />
                            Delete Profile
                        </Link>
                    </div>
                </div>
            }

            <nav className="bg-[#C39F4A] fixed top-0 left-[-1000px] right-0 flex flex-col justify-between w-[17rem] h-screen md:left-0">
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
                            className={`menu-item flex justify-between mx-2 inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("vault"))}`}
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
                            className={`menu-item flex justify-between mx-2 inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("goals"))}`}
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
                            className={`menu-item flex justify-between mx-2 inset-shadow-[1px_1px_3px_rgba(0,0,0,0.25)] ${isViewed(path("ledger"))}`}
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
                <hr className="text-white"/>
                <div 
                    onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                    className={`flex items-center justify-center pt-4 pb-3 ease-in-out duration-300 cursor-pointer ${isProfilePopupOpen ? 'bg-[#b38f3d]' : ''} ${isViewed(path("profile"))} lg:gap-x-1 `}
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
                </div>
            </nav>
        </>
    )
}

function ProfilePopup() {

}

export default Sidebar;