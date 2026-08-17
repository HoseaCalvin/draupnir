import { CircleUser, UserRoundPen, UserRoundArrowLeftIcon, UserRoundXIcon } from "lucide-react";

import React, { SetStateAction } from "react";

import Link from "next/link";

import { X } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";

interface ProfilePopupProps {
    setIsPopupOpen: React.Dispatch<SetStateAction<boolean>>;
}

function ProfilePopup({ setIsPopupOpen }: ProfilePopupProps) {
    const { user, logout } = useAuth();

    return(
        <div className="bg-[#C39F4A] shadow-2xl relative rounded-xl px-4.5 py-5 w-full max-w-[250px] h-auto md:max-w-[400px] lg:border lg:border-white">
            <button
                type="button"
                onClick={() => setIsPopupOpen(false)}
                aria-label="Close"
                className="absolute top-1.5 right-2.5 text-2xl rounded-full cursor-pointer animate hover:bg-[#ab8844]"
            >
                <X
                    className="text-white h-7 w-7 p-1"
                />
            </button>
            <section className="space-y-1 my-3.5">
                <CircleUser  
                    aria-label="User Icon"
                    className="block mx-auto bg-[#C39F4A] text-white rounded-full w-[65px] h-auto"
                />
                <div>
                    <h4 className="font-semibold text-center text-white text-base md:text-lg">{user?.username}</h4>
                    <p className="text-center text-white text-xs md:text-base">{user?.email}</p>
                </div>
            </section>
            <section className="bg-[#B8954E] rounded-lg p-2.5">
                <div className="flex flex-col divide-y divide-white *:hover:bg-[#ab8844] *:px-3 *:py-2.5">
                    <Link
                        href={"/login"}
                        aria-label="Log Out"
                        onClick={logout}
                        className="flex gap-x-3 text-sm text-white font-bold animate lg:text-base"
                    >
                        <UserRoundArrowLeftIcon
                            aria-label="Log Out Icon"
                            className="w-[20px] h-auto"
                            strokeWidth={3}
                        />
                        Log Out
                    </Link>
                    <Link
                        href={"/private/profile/edit"}
                        onClick={() => setIsPopupOpen(false)}
                        aria-label="Edit Profile"
                        className="flex gap-x-3 text-white text-sm animate lg:text-base"
                    >
                        <UserRoundPen
                            aria-label="Edit Profile Icon"
                            className="w-[20px] h-auto"
                        />
                        Edit Profile
                    </Link>
                    <Link
                        href={"/private/profile/delete"}
                        onClick={() => setIsPopupOpen(false)}
                        aria-label="Delete Profile"
                        className="flex gap-x-3 text-white text-sm animate lg:text-base"
                    >
                        <UserRoundXIcon
                            aria-label="Delete Profile Icon"
                            className="w-[20px] h-auto"
                        />
                        Delete Profile
                    </Link>
                </div>
            </section>
        </div>
    )
}

export default ProfilePopup;