"use client"

import { useState, useEffect, useId, ReactNode } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

import { Lock, User, type LucideIcon } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";

import { api } from "@/lib/api"; 

interface Tab {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface PanelProps {
  baseId: string;
  id: string;
  activeId: string;
  children: ReactNode;
}

const tabs: Tab[] = [
    { id: "biodata", label: "Biodata", icon: User },
    { id: "password", label: "Password", icon: Lock },
]

function EditProfile() {
    const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
    const baseId = useId();

    return(
        <main className="frame-padding space-y-5">
            <div className="bg-[#FFFDF0] rounded-2xl shadow-lg">
                <div className="mx-5 flex flex-col h-full">
                    <div className="flex pt-3 pb-2 lg:pt-4 lg:pb-2.5">
                        <h1 className="title-card">Edit Profile</h1>
                    </div>
                    <div role="tablist" aria-label="Edit Profile Tabs" className="border-b border-slate-400 flex gap-1">
                        {tabs.map((tab, index) => {
                            const selected = tab.id === activeTab;
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    role="tab"
                                    id={`${baseId}-tab-${index}`}
                                    aria-selected={selected}
                                    aria-controls={`${baseId}-panel-${index}`}
                                    tabIndex={selected ? 0 : -1}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex items-center gap-0.5 px-2 py-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C39F4A] focus-visible:ring-offset-2 ${selected ? "text-[#C39F4A]" : "text-slate-400 hover:text-slate-800"} md:px-4 md:text-sm md:gap-2`}
                                >
                                    <Icon className="mr-2" />
                                    {tab.label}
                                    {selected && (
                                        <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#C39F4A]" />
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="px-6 pt-4 pb-7">
                    <Panel baseId={baseId} id="biodata" activeId={activeTab}>
                        <BiodataForm />
                    </Panel>
                    <Panel baseId={baseId} id="password" activeId={activeTab}>
                        <PasswordForm />
                    </Panel>
                </div>
            </div>
        </main>
    )
}

function Panel({ baseId, id, activeId, children }: PanelProps) {
    return(
        <div
            role="tabpanel"
            id={`${baseId}-panel-${id}`}
            aria-labelledby={`${baseId}-tab-${id}`}
            hidden={id !== activeId}
        >
            {children}
        </div>        
    )
}

function BiodataForm() {
    const { user, setUser } = useAuth();

    const [editUsername, setEditUsername] = useState<string>('');
    const [editEmail, setEditEmail] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const router = useRouter();

    const isUsernameError = error && editUsername.trim().length <= 0;
    const isEmailError = error && editEmail.trim().length <= 0;

    useEffect(() => {
        const initializeValues = () => {
            if(user) {
                setEditUsername(user?.username);
                setEditEmail(user?.email);
            }
        }

        initializeValues();
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!editUsername || editUsername.trim().length <= 0 || !editEmail || editEmail.trim().length <= 0) {
            setError(true);
            return;
        }

        try {
            const response = await api.patch(`/api/users/biodata/update/${user?.id}`, {
                username: editUsername,
                email: editEmail
            });

            if(response.status === 201) {
                setUser(response.data.data);

                toast.success("Successfully updated profile!");
                router.push("/private/home");
            }
        } catch (error) {
            console.error("Error in updating your profile!", error);
            toast.error("Error in updating your profile. Try again!");
        } finally {
            setError(false);
        }
    }

    return(
        <form onSubmit={handleUpdateProfile} className="space-y-3">
            <section className="space-y-1 md:w-[65%]">
                <p className="text-xs lg:text-sm">Username</p>
                <input 
                    type="text" value={editUsername} 
                    onChange={(e) => setEditUsername(e.target.value)} 
                    className={`bg-white block text-sm w-full border-2 ${isUsernameError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg p-1.5 md:text-base md:p-2`}
                />
                { isUsernameError && <p className="text-red-500 text-xs font-semibold">Username must not be empty!</p> }
            </section>
            <section className="space-y-1 md:w-[65%]">
                <p className="text-xs lg:text-sm">Email</p>
                <input 
                    type="text" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)} 
                    className={`bg-white block text-sm w-full border-2 ${isEmailError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg p-1.5 md:text-base md:p-2`}
                />
                { isEmailError && <p className="text-red-500 text-xs font-semibold">Email must not be empty!</p> }
            </section>
            <button 
                type="submit" 
                className="main-button animate px-5 py-1.5 text-sm mt-4 md:text-base lg:mt-6 lg:px-6"
            >
                Update
            </button>
        </form>
    )
}


function PasswordForm() {
    const { user } = useAuth();

    const router = useRouter();

    const [editPassword, setEditPassword] = useState<string>('');
    const [retypePassword, setRetypePassword] = useState<string>('');
    const [verifyPassword, setVerifyPassword] = useState<string>('');
    const [isPasswordIncorrect, setIsPasswordInorrect] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);

    const isPasswordError = error && editPassword.trim().length <= 0;
    const isRetypePasswordError = error && (retypePassword.trim().length <= 0 || retypePassword !== editPassword);
    const isVerifyPasswordError = error && verifyPassword.trim().length <= 0;

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

    const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if(!editPassword || editPassword.trim().length <= 0 
            || !retypePassword || retypePassword.trim().length <= 0 
            || !verifyPassword || verifyPassword.trim().length <= 0) {
            setError(true);
            return;
        }        
        
        if(!await validatePassword(verifyPassword)) {
            setIsPasswordInorrect(true);
            return;
        } else {
            setIsPasswordInorrect(false);
        }

        try {
            const response = await api.patch(`/api/users/password/update/${user?.id}`, {
                password: editPassword,
                confirmPassword: retypePassword
            });

            if(response.status === 201) {
                toast.success("Successfully updated your password!");
                router.push("/private/home");
            }
        } catch (error) {
            console.error("Error in updating your credentials!", error);
            toast.error("Error in updating your credentials. Try again!");            
        } finally {
            setError(false);
        }
    }

    return(
        <form onSubmit={handleUpdatePassword} className="space-y-3">
            <section className="space-y-1 md:w-[65%]">
                <p className="text-xs lg:text-sm">Input New Password</p>
                <input 
                    type="password" 
                    value={editPassword} 
                    onChange={(e) => setEditPassword(e.target.value)} 
                    className={`bg-white block text-sm w-full border-2 ${isPasswordError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg p-1.5 md:text-base md:p-2`}
                />
                { isPasswordError && <p className="text-red-500 text-xs font-semibold">Password must not be empty!</p> }
            </section>
            <section className="space-y-1 md:w-[65%]">
                <p className="text-xs lg:text-sm">Retype Password</p>
                <input 
                    type="password" 
                    value={retypePassword} 
                    onChange={(e) => setRetypePassword(e.target.value)} 
                    className={`bg-white block text-sm w-full border-2 ${isRetypePasswordError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg p-1.5 md:text-base md:p-2`}
                />
                { isRetypePasswordError && <p className="text-red-500 text-xs font-semibold">Passwords do not match!</p> }
            </section>
            <section className="space-y-1 md:w-[65%]">
                <p className="text-xs lg:text-sm">Verify Password</p>
                <input 
                    type="password" 
                    value={verifyPassword} 
                    onChange={(e) => setVerifyPassword(e.target.value)} 
                    className={`bg-white block text-sm w-full border-2 ${isVerifyPasswordError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-lg p-1.5 md:text-base md:p-2`}
                />
                { isVerifyPasswordError && <p className="text-red-500 text-xs font-semibold">Password must not be empty!</p> }
            </section>
                { isPasswordIncorrect && <p className="text-red-500 text-xs font-semibold">Password is incorrect!</p> }
            <button 
                type="submit" 
                className="main-button animate px-5 py-1.5 text-sm mt-4 md:text-base lg:mt-6 lg:px-6"
            >
                Update
            </button>                        
        </form>
    )
}

export default EditProfile;