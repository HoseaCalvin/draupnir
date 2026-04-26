"use client"

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/AuthProvider";

import { toast } from "react-toastify";

import { api } from "@/lib/api";

function DeleteProfile() {
    const { user } = useAuth();
    const router = useRouter();

    const [verifyEmail, setVerifyEmail] = useState<string>('');
    const [verifyPassword, setVerifyPassword] = useState<string>('');
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const validatePassword = async (verifyPassword: string) => {
        if(!user) {
            return;
        }

        try {
            const response = await api.post(`/api/users/verify`, {
                user_id: user?.id,
                password: verifyPassword
            });

            return response.status === 201;
        } catch (error) {
            console.error("Error in validating your password!", error);            
            return false;
        }        
    }

    const handleDeleteProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!verifyPassword || verifyPassword.trim().length <= 0) {
            toast.error("Password must not be empty!");
            return;
        }

        if (!verifyEmail || verifyEmail.trim().length <= 0) {
            toast.error("Email must not be empty!");
            return;
        }

        if(verifyEmail.trim() !== user?.email) {
            toast.error("Email does not match!");
            return;
        }

        if(!await validatePassword(verifyPassword)) {
            toast.error("Password is incorrect!");
            return;
        }

        try {
            const response = await api.delete(`/api/users/delete/${user?.id}`, {
                data: {
                    email: verifyEmail
                }
            });
            
            if(response.status === 201) {
                toast.success("Successfully deleted your profile! Goodbye...");
                router.push("/");
            }
        } catch (error) {
            console.error("Error in deleting your profile!", error);
            toast.error("Error in deleting your profile. Try again!");
        }
    }

    return(
        <main className="frame-padding">
            <section className="bg-[#FFFDF0] h-fit rounded-2xl shadow-lg">
                <div className="mx-5 h-full flex flex-col">
                    <div className="flex pt-3 pb-2 lg:py-4">
                        <h1 className="title-card">Delete Profile</h1>
                    </div>
                    <hr/>
                    <form onSubmit={handleDeleteProfile} className="space-y-3 py-4">
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Verify Email</p>
                            <input type="email" value={verifyEmail} onChange={(e) => setVerifyEmail(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
                        </section>
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Verify Password</p>
                            <input type="password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
                        </section>
                        <section className="flex gap-x-2 items-center py-2 space-y-1">
                            <input type="checkbox" checked={confirmDelete} onChange={(e) => setConfirmDelete(e.target.checked)} className="ml-1 my-auto scale-125 md:scale-150"/>
                            <label className="text-xs font-bold lg:text-sm">I understand that this action is irreversible and cannot be undone.</label>
                        </section>
                        <button type="submit" disabled={!confirmDelete} className={`bg-[#C39F4A] font-bold text-white rounded-lg py-1.5 mt-4 px-5 flex ${confirmDelete ? 'cursor-pointer hover:bg-[#9c854e]' : 'opacity-50 cursor-not-allowed'}`}>Delete Profile</button>
                    </form>
                </div>
            </section> 
        </main>
    )
}

export default DeleteProfile;