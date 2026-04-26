"use client"

import ProfilePicture from "@/assets/navbar/viking-face.svg";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { DatePicker } from "react-datepicker";

import { useAuth } from "@/providers/AuthProvider";

import { api } from "@/lib/api"; 

function EditProfile() {
    const { user, setUser } = useAuth();

    const router = useRouter();

    const [editUsername, setEditUsername] = useState<string>('');
    const [editEmail, setEditEmail] = useState<string>('');
    const [editBirthdate, setEditBirthdate] = useState<Date | null>(null);
    const [editGender, setEditGender] = useState<string>('');
    const [editPassword, setEditPassword] = useState<string>('');
    const [retypePassword, setRetypePassword] = useState<string>('');
    const [verifyPasswordForPassword, setVerifyPasswordForPassword] = useState<string>('');
    const [verifyPasswordForEmail, setVerifyPasswordForEmail] = useState<string>('');

    useEffect(() => {
        const initializeValues = () => {
            if(user) {
                setEditUsername(user?.username);
                setEditEmail(user?.email);
                setEditBirthdate(new Date(user?.dob));
                setEditGender(user?.gender);
            }
        }

        initializeValues();
    }, [user]);

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

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await api.patch(`/api/users/update/biodata/${user?.id}`, {
                username: editUsername,
                dob: editBirthdate,
                gender: editGender
            });

            if(response.status === 201) {
                setUser(response.data.data);
                toast.success("Successfully updated profile!");
                router.push("/private/profile");
            }
        } catch (error) {
            console.error("Error in updating your profile!", error);
            toast.error("Error in updating your profile. Try again!");
        }
    }

    const handleUpdateEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!editEmail || editEmail.trim().length <= 0) {
            toast.error("Email must not be empty!");
            return;
        }

        if(verifyPasswordForEmail.trim().length <= 0) {
            toast.error("Verify password must not be empty!");
            return;
        }
     
        if(!await validatePassword(verifyPasswordForEmail)) {
            toast.error("Password is incorrect!");
            return;
        }

        try {
            const response = await api.patch(`/api/users/update/email/${user?.id}`, {
                email: editEmail
            });

            if(response.status === 201) {
                setUser(response.data.data);
                toast.success("Successfully updated your email!");
                router.push("/private/profile");
            }
        } catch (error) {
            console.error("Error in updating your email!", error);
            toast.error("Error in updating your email. Try again!");
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(editPassword.trim().length > 0 && retypePassword.trim().length <= 0) {
            toast.error("Passwords must not be empty!");
            return;
        }
        
        if(editPassword.trim().length > 0 && retypePassword !== editPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        if(verifyPasswordForPassword.trim().length <= 0) {
            toast.error("Verify password must not be empty!");
            return;
        }
        
        if(!await validatePassword(verifyPasswordForPassword)) {
            toast.error("Password is incorrect!");
            return;
        }

        try {
            const response = await api.patch(`/api/users/update/password/${user?.id}`, {
                password: editPassword,
                confirmPassword: retypePassword
            });

            if(response.status === 201) {
                toast.success("Successfully updated your password!");
                router.push("/private/profile");
            }
        } catch (error) {
            console.error("Error in updating your credentials!", error);
            toast.error("Error in updating your credentials. Try again!");            
        }
    }

    return(
        <main className="frame-padding space-y-5">
            <div className="bg-[#FFFDF0] col-span-2 relative rounded-2xl shadow-lg">
                <div className="flex items-center gap-x-3 px-5 py-3 w-full md:py-4 lg:px-10">
                    <Image 
                        src={ProfilePicture} 
                        alt="Profile Picture" 
                        className="bg-[#C39F4A] border border-white rounded-full p-1.5 h-auto lg:mr-3 lg:w-[75px]"
                        width={45} 
                        height={45}
                    />
                    <div className="space-y-0.5">
                        <h1 className="text-base md:text-xl lg:text-2xl">{editUsername}</h1>
                        <h2 className="text-sm text-gray-400 md:text-base">{new Date(Date.now()).getFullYear() - new Date(editBirthdate ?? "Unknown birthdate").getFullYear()} year(s) old</h2>
                    </div>
                </div>
            </div>
            <div className="bg-[#FFFDF0] rounded-2xl shadow-lg">
                <div className="mx-5 flex flex-col h-full">
                    <div className="pt-3 pb-2 flex lg:py-4">
                        <h1 className="title-card">Biodata</h1>
                    </div>
                    <hr className="px-2.5"/>
                    <form onSubmit={handleUpdateProfile} className="space-y-3 pt-4 pb-4">
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Username</p>
                            <input type="text" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
                        </section>
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Birthdate</p>
                            <DatePicker
                                selected={editBirthdate}
                                onChange={setEditBirthdate}
                                fixedHeight
                                calendarClassName="custom-calendar"
                                className="bg-white border-2 rounded-lg cursor-pointer py-1 px-2 w-full text-sm lg:text-base"
                            />                                              
                        </section>
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Gender</p>
                            <select className="bg-white block w-full border-2 text-sm rounded-lg p-1 cursor-pointer md:text-base md:p-2">
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Male">Prefer not to say</option>
                            </select>
                        </section>
                        <button type="submit" className="main-button py-1.5 mt-6 px-5">Update Biodata</button>
                    </form>
                </div>
            </div>
            <div className="bg-[#FFFDF0] rounded-2xl shadow-lg">
                <div className="mx-5 flex flex-col h-full">
                    <div className="pt-3 pb-2 flex lg:py-4">
                        <h1 className="title-card">Email</h1>
                    </div>
                    <hr className="px-2.5"/>
                    <form onSubmit={handleUpdateEmail} className="space-y-3 pt-4 pb-4">
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Email</p>
                            <input type="text" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
                        </section>
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Verify Password</p>
                            <input type="password" value={verifyPasswordForEmail} onChange={(e) => setVerifyPasswordForEmail(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
                        </section>
                        <button type="submit" className="main-button py-1.5 mt-6 px-5">Update Email</button>                        
                    </form>
                </div>
            </div>
            <div className="bg-[#FFFDF0] rounded-2xl shadow-lg">
                <div className="mx-5 flex flex-col h-full">
                    <div className="pt-3 pb-2 flex lg:py-4">
                        <h1 className="title-card">Password</h1>
                    </div>
                    <hr className="px-2.5"/>
                    <form onSubmit={handleUpdatePassword} className="space-y-3 pt-4 pb-4">
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Input New Password</p>
                            <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
                        </section>
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Retype Password</p>
                            <input type="password" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
                        </section>
                        <section className="space-y-1 md:w-[65%]">
                            <p className="text-xs font-bold lg:text-sm">Verify Password</p>
                            <input type="password" value={verifyPasswordForPassword} onChange={(e) => setVerifyPasswordForPassword(e.target.value)} className="bg-white block text-sm w-full border-2 rounded-lg p-1 md:text-base md:p-2"/>
                        </section>
                        <button type="submit" className="main-button py-1.5 mt-6 px-5">Update Password</button>                        
                    </form>
                </div>
            </div>
        </main>
    )
}

export default EditProfile;