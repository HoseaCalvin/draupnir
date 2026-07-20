"use client"

import Target from "@/assets/goals/target.svg";
import Deadline from "@/assets/goals/deadline.svg";

import { useState, useEffect, useRef, SetStateAction } from "react";
import Image from "next/image";

import { OptionsIcon, AddNoteIcon } from "@/components/SVGIcons";
import ConfirmationPopup from "@/components/ConfirmationPopup";
import GoalPopup from "@/components/GoalPopup";

import type { Goal } from "@/hooks/useGoal";

import { useAuth } from "@/providers/AuthProvider";

import useGoal from "@/hooks/useGoal";

import { useFinance } from "@/providers/FinanceProvider";

import { CircularProgress } from "@mui/material";

import { toast } from "react-toastify";

import { rupiahFormat } from "@/utils/currencyFormat";
import { UUID } from "crypto";
import { api } from "@/lib/api";

import "react-datepicker/dist/react-datepicker.css";

function Goals() {
    const { user } = useAuth();
    const { currentBalance } = useFinance();
    const { goals, setGoals } = useGoal();

    const [name, setName] = useState<string>('');
    const [targetAmount, setTargetAmount] = useState<number>(0);
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [isCreateGoalCardOpen, setIsCreateGoalCardOpen] = useState<boolean>(false);
    const [isEditGoalCardOpen, setIsEditGoalCardOpen] = useState<Goal | null>(null);
    const [isDeleteGoalCardOpen, setIsDeleteGoalCardOpen] = useState<Goal | null>(null);
    
    const [openOptions, setOpenOptions] = useState<number | null>(null);

    const optionRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const closeOptions = (event: MouseEvent) => {
            if(optionRef.current && !optionRef.current.contains(event.target as Node)) {
                setOpenOptions(null);
            }
        }

        if(optionRef) {
            document.addEventListener("mousedown", closeOptions);
        }

        return () => {
            document.removeEventListener("mousedown", closeOptions);
        }
    }, [openOptions]);

    useEffect(() => {
        const fetchGoal = async () => {
            if(isEditGoalCardOpen === null) {
                return;
            }

            try {
                const fetchedGoal = await api.get(`/api/goals/get/${isEditGoalCardOpen?.id}`);
    
                setName(fetchedGoal.data.data.name);
                setTargetAmount(fetchedGoal.data.data.target_balance);
                setDeadline(new Date(fetchedGoal.data.data.deadline));
            } catch (error) {
                console.error("Error in fetching a Goal (Edit)!", error);
                toast.error("Error in fetching your Goal!");
            }
        }

        fetchGoal();
    }, [isEditGoalCardOpen]);        

    const insertGoal = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(name.length <= 0) {
            toast.error("Goal name must not be empty!");
            return;
        }

        if(targetAmount <= 0) {
            toast.error("Balance must not be less than or equal to 0!");
            return;
        }

        if(deadline && deadline.getTime() < Date.now()) {
            toast.error("Deadline must always be later than the current date!");
            return;
        }

        setIsSubmitting(true);

        try {
            const insertedGoal = await api.post(`/api/goals/insert`, {
                user_id: user?.id,
                name: name,
                target_balance: targetAmount,
                deadline: deadline
            });

            if(insertedGoal.status === 201 || insertedGoal.status === 200) {
                const goal = insertedGoal.data.data;

                setGoals(prev => [goal, ...prev]);

                setName('');
                setTargetAmount(0);
                setDeadline(null);
                setIsCreateGoalCardOpen(false);

                toast.success("Successfully created a goal!");
            }
        } catch (error) {
            console.error("Error in creating a goal!", error);
            toast.error("Error in creating a goal!");
        } finally {
            setIsSubmitting(false);
        }
    }

    const editGoal = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(name.length <= 0) {
            toast.error("Goal name must not be empty!");
            return;
        }

        if(targetAmount <= 0) {
            toast.error("Balance must not be less than or equal to 0!");
            return;
        }

        if(deadline && deadline?.getTime() < Date.now()) {
            toast.error("Deadline must always be later than the current date!");
            return;
        }

        try {
            const edit = await api.patch(`/api/goals/update`, {
                id: isEditGoalCardOpen?.id,
                user_id: user?.id,
                name: name,
                target_balance: targetAmount,
                deadline: deadline
            });

            if(edit.status === 201 || edit.status === 200) {
                setName('');
                setTargetAmount(0);
                setIsEditGoalCardOpen(null);

                toast.success("Successfully edited a goal!");
            }
        } catch (error) {
            console.error("Error in updating a Goal!", error);
            toast.error("Error in updating your Goal!");
        }
    }

    const deleteGoal = async (id: UUID) => {
        try {
            const deletedGoal = await api.delete(`/api/goals/delete/${id}`);

            if(deletedGoal.status === 200 || deletedGoal.status === 201) {
                const goal = deletedGoal.data.data;

                setGoals(prev => prev.filter(goals => goals.id !== goal.id));

                toast.success("Successfully deleted a goal!");
            }
        } catch (error) {
            console.error("Error in deleting a goal!", error);
            toast.error("Error in deleting a goal!");
        }
    }

    return(
        <>
            { isCreateGoalCardOpen &&
                <GoalPopup
                    title={"Create a Goal"}
                    buttonText={"Create"}
                    name={name}
                    targetAmount={targetAmount}
                    deadline={deadline}
                    setName={setName}
                    setTargetAmount={setTargetAmount}
                    setDeadline={setDeadline}
                    setIsGoalCardOpen={() => setIsCreateGoalCardOpen(false)}
                    handleSubmit={insertGoal}
                    isSubmitting={isSubmitting}
                />
            }

            { isEditGoalCardOpen &&
                <GoalPopup
                    title={"Edit a Goal"}
                    buttonText={"Edit"}
                    name={name}
                    targetAmount={targetAmount}
                    deadline={deadline}
                    setName={setName}
                    setTargetAmount={setTargetAmount}
                    setDeadline={setDeadline}
                    setIsGoalCardOpen={() => {
                        setName('');
                        setTargetAmount(0);
                        setDeadline(null);
                        setIsEditGoalCardOpen(null);
                    }}
                    handleSubmit={editGoal}
                    isSubmitting={isSubmitting}
                />
            }

            { isDeleteGoalCardOpen &&
                <ConfirmationPopup
                    title="Delete Goal"
                    text={`You are about to delete "${isDeleteGoalCardOpen.name}" goal. Are you certain you want to do it? This will permanently delete the goal and cannot be restored!`}
                    onConfirm={() => deleteGoal(isDeleteGoalCardOpen.id)}
                    onClose={() => setIsDeleteGoalCardOpen(null)}
                />
            }

            <main className="flex flex-col frame-padding gap-y-7 lg:pb-0 lg:grid lg:grid-cols-2 lg:auto-rows-auto lg:gap-8">
                <div className="main-button fixed -translate-1/2 bottom-15 -right-5 flex justify-center items-center cursor-pointer rounded-lg z-20 space-x-1.5 py-1.5 px-3 md:bottom-2 md:right-0 lg:space-x-2 lg:px-5" onClick={() => setIsCreateGoalCardOpen(true)}>
                    <AddNoteIcon
                        className="text-white w-full h-fit max-w-[30px] lg:max-w-[40px]"
                    />
                    <p className="text-white font-bold text-sm md:text-base lg:text-lg">Add</p>
                </div>
                    { goals && goals?.length > 0 ? (
                            goals?.map((goal, index) => (
                                <section key={index} className="relative bg-[#FFFDF0] rounded-2xl row-start-auto py-4 px-5 shadow-lg lg:py-6">
                                    <div className="flex justify-between items-center">
                                        <h1 className="px-1 text-sm font-bold text-[#7F7414] lg:text-lg">Goal #{index + 1}</h1>
                                        <OptionsIcon 
                                            aria-label="Options"
                                            onClick={() => setOpenOptions((goalIdx) => index === goalIdx ? null : index)} 
                                            className="h-auto w-[25px] cursor-pointer p-1 rounded-lg hover:bg-[#F3F1E0] lg:w-[30px]"
                                        />
                                        { openOptions === index &&
                                            <div ref={optionRef} className="absolute border border-gray-300 -translate-y-1/2 -translate-x-1/2 top-22 -right-8 bg-[#FFFDF0] shadow-lg rounded-lg p-2 z-10 lg:top-25">
                                                <p className="hover:bg-[#F3F1E0] py-1 px-1.5 rounded-md cursor-pointer lg:px-3" onClick={() => setIsEditGoalCardOpen(goal)}>Update</p>
                                                <p className="hover:bg-[#F3F1E0] py-1 px-1.5 rounded-md cursor-pointer lg:px-3" onClick={() => setIsDeleteGoalCardOpen(goal)}>Delete</p>
                                            </div>
                                        }
                                    </div>
                                    <hr className="my-2 border-gray-400"/>
                                    <div>
                                        <h1 className="py-1.5 font-bold text-center w-full text-lg lg:text-xl xl:text-2xl">{goal.name}</h1>
                                        <div className="justify-center items-center h-full w-full text-[#C39F4A] py-5 flex md:py-8">
                                            <CircularProgress
                                                enableTrackSlot
                                                sx={{
                                                    width: { xs: "10rem !important", md: "12rem !important", lg: "15rem !important" },
                                                    height: { xs: "10rem !important", md: "12rem !important", lg: "15rem !important" },
                                                }}
                                                variant="determinate"
                                                value={Math.min(100, Math.round((currentBalance / goal.target_balance) * 100))}
                                                color="inherit"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between gap-x-4 gap-y-4 w-full">
                                            <div className="flex items-center justify-between border-2 border-[#f5e9a5] shadow-sm rounded-lg w-full py-2.5 px-2.5 lg:px-3 lg:py-3">
                                                <figure className="flex items-center gap-x-1.5 md:gap-x-2.5">
                                                    <Image
                                                        src={Target}
                                                        alt="Target Icon"
                                                        className="h-auto w-[20px] lg:w-[25px]"
                                                    />
                                                    <h3 className="font-semibold text-center text-sm lg:text-lg">Target</h3>
                                                </figure>
                                                <p className="font-semibold text-center text-sm md:text-base lg:text-lg">{rupiahFormat(goal.target_balance)}</p>
                                            </div>
                                            <div className="flex items-center justify-between border-2 border-[#f5e9a5] shadow-sm rounded-lg w-full py-2.5 px-2.5 lg:px-3 lg:py-3">
                                                <figure className="flex items-center gap-x-1.5 md:gap-x-2.5">
                                                    <Image
                                                        src={Deadline}
                                                        alt="Target Icon"
                                                        className="h-auto w-[20px] lg:w-[25px]"
                                                    />
                                                    <h3 className="font-semibold text-center text-sm lg:text-lg">Deadline</h3>
                                                </figure>
                                                <p className="font-semibold text-center text-sm md:text-base lg:text-lg">{new Date(goal.deadline).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            ))
                        ) : (
                            <section className="flex flex-col justify-center items-center w-full h-[100vh] lg:col-span-2">
                                <p className="font-semibold text-base md:text-xl lg:text-2xl">You have no goals yet.</p>
                            </section>
                        )
                    }
            </main>
        </>
    )
}

export default Goals;