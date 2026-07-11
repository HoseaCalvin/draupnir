"use client"

import House from "@/assets/navbar/house.svg";
import Vault from "@/assets/navbar/vault.svg";
import Anvil from "@/assets/navbar/anvil.svg";
import Ledger from "@/assets/navbar/ledger.svg";
import Profile from "@/assets/navbar/viking-face.svg";
import Arrow from "@/assets/navbar/arrow.svg";
import Logout from "@/assets/navbar/logout.svg";
import EditProfile from "@/assets/navbar/edit-profile.svg";
import DeleteProfile from "@/assets/navbar/delete-profile.svg";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

function FooterBar() {
    const { logout } = useAuth();
    const pathname = usePathname();
    
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState<boolean>(false);

    const isViewed = (path: string) => pathname == path ? "font-bold" : "";
    
    const path = (navigationPath: string) => `/private/${navigationPath}`;
    
    return(
        <>
            { isProfilePopupOpen &&
                <div className="fixed -translate-x-1/2 -translate-y-1/2 z-40 w-fit border border-[#9F7D38] bg-[#C39F4A] shadow-xl rounded-lg px-2.5 py-2 lg:bottom-[5%] lg:left-[10%]">
                    <div className="flex flex-col w-full mr-6">
                        <Link
                            onClick={logout}
                            href={"/login"}
                            className="flex items-center hover:bg-[#b38f3d] text-white text-xs cursor-pointer font-semibold w-full gap-x-2 md:text-sm lg:text-base lg:rounded-lg lg:py-2 lg:px-2"
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
                            className=" flex items-center hover:bg-[#b38f3d] text-white text-xs cursor-pointer font-semibold w-full gap-x-2 md:text-sm lg:text-base lg:rounded-lg lg:py-2 lg:px-2"
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
                            className="flex items-center hover:bg-[#b38f3d] text-white text-xs font-semibold w-full gap-x-2 md:text-sm lg:text-base lg:rounded-lg lg:py-2 lg:px-2"
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

            <nav className="bg-[#C39F4A] border-t-2 border-white fixed bottom-0 flex justify-around items-center w-full z-20 md:hidden">
                <div className="mx-0.5 my-2">
                    <ul className="p-0.5 flex justify-center gap-x-5">
                        <Link 
                            href={path("home")} 
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1 ${isViewed(path("home"))}`}
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
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1 ${isViewed(path("vault"))}`}
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
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1 ${isViewed(path("goals"))}`}
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
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1.5 ${isViewed(path("ledger"))}`}
                        >
                            <Image 
                                src={Ledger} 
                                alt="House" 
                                width={23} 
                                height={23}
                            />
                            LEDGER
                        </Link>
                        <div 
                            onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1.5 ${isViewed(path("profile"))}`}
                        >
                            <Image 
                                src={Profile} 
                                alt="House" 
                                width={23} 
                                height={23}
                            />
                            PROFILE
                        </div>
                    </ul>
                </div>            
            </nav>
        </>
    )
}

export default FooterBar;