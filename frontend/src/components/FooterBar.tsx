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

function FooterBar() {
    const pathname = usePathname();
    
    const isViewed = (path: string) => pathname == path ? "font-bold" : "";
    
    const path = (navigationPath: string) => `/private/${navigationPath}`;
    
    return(
        <>
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
                        <Link 
                            href={path("profile")}
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1.5 ${isViewed(path("profile"))}`}
                        >
                            <Image 
                                src={Profile} 
                                alt="House" 
                                width={23} 
                                height={23}
                            />
                            PROFILE
                        </Link>
                    </ul>
                </div>            
            </nav>
        </>
    )
}

export default FooterBar;