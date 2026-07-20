"use client"

import { House, Vault, Anvil, NotebookText, CircleUser, UserRoundPen, UserRoundArrowLeftIcon, UserRoundXIcon } from "lucide-react";

import React, { useState, SetStateAction } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import ProfilePopup from "./ProfilePopup";

interface ProfilePopupProps {
    setIsPopupOpen: React.Dispatch<SetStateAction<boolean>>;
    logout: () => void;
}

function FooterBar() {
    const pathname = usePathname();
    
    const [isProfilePopupOpen, setIsProfilePopupOpen] = useState<boolean>(false);

    const isViewed = (path: string) => pathname == path ? "font-bold" : "";
    
    const path = (navigationPath: string) => `/private/${navigationPath}`;
    
    return(
        <>
            { isProfilePopupOpen &&
                <div className="fixed flex justify-center items-center w-full h-full z-40 bg-gray-500/30">
                    <ProfilePopup 
                        setIsPopupOpen={setIsProfilePopupOpen}
                    />
                </div>
            }

            <nav className="bg-[#C39F4A] border-t-2 border-white fixed bottom-0 flex justify-around items-center w-full z-20 md:hidden">
                <div className="mx-0.5 my-2">
                    <ul className="p-0.5 flex justify-center gap-x-5">
                        <Link 
                            href={path("home")} 
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1 ${isViewed(path("home"))}`}
                        >
                            <House  
                                aria-label="House Icon"
                                className="w-[23px] h-auto"
                            />
                            HOME
                        </Link>
                        <Link 
                            href={path("vault")} 
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1 ${isViewed(path("vault"))}`}
                        >
                            <Vault  
                                aria-label="Vault Icon"
                                className="w-[23px] h-auto"
                            />
                            VAULT
                        </Link>
                        <Link 
                            href={path("goals")} 
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1 ${isViewed(path("goals"))}`}
                        >
                            <Anvil  
                                aria-label="Goals Icon"
                                className="w-[23px] h-auto"
                            />
                            GOALS
                        </Link>
                        <Link 
                            href={path("ledger")} 
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1 ${isViewed(path("ledger"))}`}
                        >
                            <NotebookText  
                                aria-label="Ledger Icon"
                                className="w-[23px] h-auto"
                            />
                            LEDGER
                        </Link>
                        <div 
                            onClick={() => setIsProfilePopupOpen(true)}
                            className={`menu-item-mobile flex flex-col justify-center items-center gap-y-1 ${isViewed(path("profile"))}`}
                        >
                            <CircleUser  
                                aria-label="Profile Icon"
                                className="w-[23px] h-auto"
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