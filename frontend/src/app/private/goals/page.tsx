"use client"

import { useState, useEffect, useRef, SetStateAction } from "react";

import { OptionsIcon, AddNoteIcon } from "@/components/SVGIcons";
import Popup from "@/components/Popup";

import type { Goal } from "@/hooks/useGoal";

import { useAuth } from "@/contexts/AuthContext";
import useGoal from "@/hooks/useGoal";
import { useFinance } from "@/contexts/FinanceContext";

import { CircularProgress, LinearProgress } from "@mui/material";
import { toast } from "react-toastify";
import { NumericFormat } from "react-number-format";
import { DayPicker } from "react-day-picker";

import { useRupiahFormat } from "@/utils/currencyFormat";
import { UUID } from "crypto";
import { api } from "@/lib/api";

import "react-day-picker/style.css";

type GoalCardType = {
    setOpenGoalCard: React.Dispatch<SetStateAction<boolean>>;
}

type EditGoalCardType = {
    goalCollection: Goal;
    setOpenEditGoalCard: React.Dispatch<SetStateAction<Goal | null>>;    
}

function Goals() {
    const { currentBalance } = useFinance();
    const { goals } = useGoal();

    const [openOptions, setOpenOptions] = useState<number | null>(null);
    const [openGoalCard, setOpenGoalCard] = useState<boolean>(false);
    const [openEditGoalCard, setOpenEditGoalCard] = useState<Goal | null>(null);
    const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

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

    const deleteGoal = async (id: UUID) => {
        try {
            await api.delete(`/api/goals/delete/${id}`);

            toast.success("Successfully deleted a goal!");
        } catch (error) {
            console.error("Error in deleting a goal!", error);
            toast.error("Error in deleting a goal!");
        }
    }

    return(
        <>
            { openGoalCard &&
                <CreateGoalCard
                    setOpenGoalCard={setOpenGoalCard}
                />
            }

            { openEditGoalCard &&
                <EditGoalCard
                    goalCollection={openEditGoalCard}
                    setOpenEditGoalCard={setOpenEditGoalCard}
                />
            }

            { goalToDelete &&
                <Popup
                    title="Delete Goal"
                    text={`You are about to delete "${goalToDelete.name}" goal. Are you certain you want to do it? This will permanently delete the goal and cannot be restored!`}
                    onConfirm={() => deleteGoal(goalToDelete.id)}
                    onClose={() => setGoalToDelete(null)}
                />
            }

            <main className="flex flex-col frame-padding gap-y-7 lg:pb-0 lg:grid lg:grid-cols-2 lg:auto-rows-auto lg:gap-8">
                <div className="main-button fixed bottom-20 right-3 flex justify-center items-center cursor-pointer rounded-lg z-20 space-x-1.5 py-1.5 px-3 md:bottom-7 md:right-8 lg:space-x-2 lg:px-5" onClick={() => setOpenGoalCard(true)}>
                    <AddNoteIcon
                        className="text-white w-full h-fit max-w-[30px] lg:max-w-[40px]"
                    />
                    <p className="text-white font-bold text-sm md:text-base lg:text-lg">Add</p>
                </div>
                    { goals && goals?.length > 0 ? (
                            goals?.map((goal, index) => (
                                <section key={index} className="relative bg-[#FFFDF0] rounded-2xl row-start-auto py-4 px-6 shadow-lg lg:py-6">
                                    <div className="flex justify-between items-center">
                                        <h1 className="px-1 text-sm font-bold text-[#7F7414] lg:text-lg">Goal {index + 1}</h1>
                                        <OptionsIcon 
                                            onClick={() => setOpenOptions((goalIdx) => index == goalIdx ? null : index)} 
                                            className="h-auto w-[25px] cursor-pointer p-1 rounded-lg hover:bg-[#F3F1E0] lg:w-[30px]"
                                        />
                                        { openOptions === index &&
                                            <div ref={optionRef} className="absolute border border-gray-300 -translate-y-1/2 -translate-x-1/2 top-22 -right-8 bg-[#FFFDF0] shadow-lg rounded-lg p-2 z-10 lg:top-25">
                                                <p className="hover:bg-[#F3F1E0] py-1 px-1.5 rounded-md cursor-pointer lg:px-3" onClick={() => setOpenEditGoalCard(goal)}>Update</p>
                                                <p className="hover:bg-[#F3F1E0] py-1 px-1.5 rounded-md cursor-pointer lg:px-3" onClick={() => setGoalToDelete(goal)}>Delete</p>
                                            </div>
                                        }
                                    </div>
                                    <hr className="my-2 border-gray-400"/>
                                    <div>
                                        <h1 className="py-1.5 font-bold text-center w-full text-lg lg:text-xl xl:text-2xl">{goal.name}</h1>
                                        <div className="hidden justify-center items-center h-full text-[#C39F4A] py-8 lg:flex">
                                            <CircularProgress
                                                enableTrackSlot
                                                size={"14rem"}
                                                variant="determinate"
                                                value={Math.min(100, Math.round((currentBalance / goal.target_balance) * 100))}
                                                color="inherit"
                                            />
                                        </div>
                                        <div className=" text-[#C39F4A] pt-4 pb-6 lg:hidden">
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(100, Math.round((currentBalance / goal.target_balance) * 100))}
                                                color="inherit"
                                                style={{ 
                                                    height: 12, 
                                                    borderRadius: 8 
                                                }}
                                            />
                                        </div>
                                        <div className="flex flex-col justify-between gap-x-4 gap-y-4 w-full xl:flex-row">
                                            <div className="bg-[#FFFDF0] border-2 border-gray-200 shadow-md rounded-lg w-full py-2 lg:p-2.5">
                                                <h3 className="font-semibold text-center text-sm">Target</h3>
                                                <p className="font-semibold text-center text-base lg:text-xl">{useRupiahFormat(goal.target_balance)}</p>
                                            </div>
                                            <div className="bg-[#FFFDF0] border-2 border-gray-200 shadow-md rounded-lg w-full py-2 lg:p-2.5">
                                                <h3 className="font-semibold text-center text-sm">Deadline</h3>
                                                <p className="font-semibold text-center text-base lg:text-xl">{new Date(goal.deadline).toLocaleDateString()}</p>
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

function CreateGoalCard({ setOpenGoalCard }: GoalCardType) {
    const { user } = useAuth();

    const [name, setName] = useState<string>('');
    const [targetBalance, setTargetBalance] = useState<number>(0);
    const [deadline, setDeadline] = useState<Date | undefined>();

    const [openCalendar, setOpenCalendar] = useState<boolean>(false);

    const calendarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const closeCalendar = (event: MouseEvent) => {
            if(calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setOpenCalendar(false);
            }
        }

        if(openCalendar) {
            document.addEventListener("mousedown", closeCalendar);
        }

        return () => {
            document.removeEventListener("mousedown", closeCalendar);
        }
    }, [openCalendar]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(name.length <= 0) {
            toast.error("Goal name must not be empty!");
            return;
        }

        if(targetBalance <= 0) {
            toast.error("Balance must not be less than or equal to 0!");
            return;
        }

        if(deadline && deadline?.getTime() < Date.now()) {
            toast.error("Deadline must always be later than the current date!");
            return;
        }

        try {
            const send = await api.post(`/api/goals/insert`, {
                user_id: user?.id,
                name: name,
                target_balance: targetBalance,
                deadline: deadline
            });

            if(send.status === 201 || send.status === 200) {
                setName('');
                setTargetBalance(0);
                setOpenGoalCard(false);

                toast.success("Successfully created a goal!");
            }
        } catch (error) {
            console.error("Error in creating a goal!", error);
            toast.error("Error in creating a goal!");
        }
    }

    return(
        <div className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <div className="bg-[#FFF8CD] gap-y-6 w-[600px] h-fit rounded-2xl m-8 py-3 px-5">
                <header className="flex justify-between items-center w-full">
                    <h1 className="font-bold text-sm md:text-base lg:text-lg">Create a Goal</h1>
                    <p className="text-3xl cursor-pointer" onClick={() => setOpenGoalCard(false)}>&times;</p>
                </header>
                <hr />
                <form onSubmit={submitForm} className="relative space-y-3 py-4 lg:py-3">
                    <div className="space-y-1">
                        <p className="font-semibold text-xs py-0.5 md:text-sm">Goal Name:</p>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Goal Title" className="bg-white block border-2 rounded-lg py-1 px-2 w-full text-sm md:w-3/4 lg:text-base"/>
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-xs py-0.5 md:text-sm">Target Balance:</p>
                        <NumericFormat
                            value={targetBalance}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            allowNegative={false}
                            placeholder="Target Balance"
                            className="bg-white block border-2 rounded-lg py-1 px-2 w-full text-sm md:w-3/4 lg:text-base"
                            onValueChange={(e) => setTargetBalance(Number(e.floatValue ?? 0))}
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-xs py-0.5 md:text-sm">Deadline:</p>
                        <input readOnly onClick={() => setOpenCalendar(!openCalendar)} value={deadline ? deadline.toDateString() : "Not yet picked"} className="bg-white block border-2 rounded-lg cursor-pointer py-1 px-2 w-full text-sm md:w-3/4 lg:text-base"/>
                        { openCalendar &&
                            <div ref={calendarRef} className="absolute mt-2 bottom-17 -right-4">
                                <DayPicker
                                    mode="single"
                                    fixedWeeks
                                    classNames={{
                                        root: "text-xs",
                                        day: "w-7 h-7 lg:w-8 lg:w-8",
                                        selected: "text-sm font-bold text-[#C39F4A]",
                                        head_cell: "text-[11px]",
                                        cell: "p-0 m-0 w-8 h-8",
                                        table: "w-full border-collapse mx-auto",
                                        caption_label: "text-sm font-bold mb-4.5 text-[#9c854e] lg:text-base",
                                        nav_icon: "h-3 w-3 fill-current ",
                                    }}                        
                                    selected={deadline}
                                    onSelect={(date) => {
                                        setDeadline(date);
                                        setOpenCalendar(!openCalendar);
                                    }}
                                    className="bg-white border-gray-400 border rounded-lg text-sm p-2"
                                />
                            </div>
                        }
                    </div>
                    {/* { deadline &&
                        <div className="bg-[#C9BE7C] rounded-lg my-5 px-3 py-2 w-3/4">
                            <p className="text-white font-semibold">Estimated Balance: {useRupiahFormat(targetBalance * deadline.getMonth())}</p>
                        </div>
                    } */}
                    <div className="pt-2.5 gap-x-3">
                        <button type="submit" className="main-button px-5 py-1.5 text-sm md:text-base">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function EditGoalCard({ goalCollection, setOpenEditGoalCard }: EditGoalCardType) {
    const { user } = useAuth();

    const [name, setName] = useState<string>("");
    const [balance, setBalance] = useState<number>(0);
    const [deadline, setDeadline] = useState<Date | undefined>();
    
    const [openCalendar, setOpenCalendar] = useState<boolean>(false);

    const calendarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const response = await api.get(`/api/goals/get/${goalCollection.id}`);
    
                setName(response.data.data[0].name);
                setBalance(response.data.data[0].target_balance);
                setDeadline(new Date(response.data.data[0].deadline));
            } catch (error) {
                console.error("Error in fetching a Goal (Edit)!", error);
                toast.error("Error in fetching your Goal!");
            }
        }

        fetchGoal();
    }, []);

    useEffect(() => {
        const closeCalendar = (event: MouseEvent) => {
            if(calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setOpenCalendar(false);
            }
        }

        if(openCalendar) {
            document.addEventListener("mousedown", closeCalendar);
        }

        return () => {
            document.removeEventListener("mousedown", closeCalendar);
        }
    }, [openCalendar]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(name.length <= 0) {
            toast.error("Goal name must not be empty!");
            return;
        }

        if(balance <= 0) {
            toast.error("Balance must not be less than or equal to 0!");
            return;
        }

        if(deadline && deadline?.getTime() < Date.now()) {
            toast.error("Deadline must always be later than the current date!");
            return;
        }

        try {
            const edit = await api.patch(`/api/goals/update`, {
                id: goalCollection.id,
                user_id: user?.id,
                name: name,
                target_balance: balance,
                deadline: deadline
            });

            if(edit.status === 201 || edit.status === 200) {
                setName('');
                setBalance(0);
                setOpenEditGoalCard(null);

                toast.success("Successfully edited a goal!");
            }
        } catch (error) {
            console.error("Error in updating a Goal!", error);
            toast.error("Error in updating your Goal!");
        }
    }

    return(
        <main className="fixed flex justify-center items-center h-screen w-screen z-30 bg-gray-500/30">
            <form onSubmit={handleSubmit} className="bg-[#FFF8CD] gap-y-6 w-[600px] h-fit rounded-2xl m-8 py-3 px-5">
                <header className="flex justify-between items-center w-full">
                    <h1 className="font-bold text-sm md:text-base lg:text-lg">Edit Goal</h1>
                    <p className="text-3xl cursor-pointer" onClick={() => setOpenEditGoalCard(null)}>&times;</p>
                </header>
                <hr />
                <div className="relative space-y-3 py-4 lg:py-3">
                    <div className="space-y-1">
                        <p className="font-semibold text-xs py-0.5 md:text-sm">Goal Name:</p>
                        <input type="text" placeholder="e.g. Buy groceries" value={name} onChange={(e) => setName(e.target.value)} className="bg-white block border-2 rounded-lg py-1 px-2 w-full text-sm md:w-3/4 lg:text-base"/>
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-xs py-0.5 md:text-sm">Target Balance:</p>
                        <NumericFormat
                            value={balance}
                            thousandSeparator="."
                            decimalSeparator=","
                            prefix="Rp "
                            allowNegative={false}
                            placeholder="Input valid amount"
                            className="bg-white block border-2 rounded-lg py-1 px-2 w-full text-sm md:w-3/4 lg:text-base"
                            onValueChange={(e) => setBalance(Number(e.floatValue ?? 0))}
                        />
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold text-xs py-0.5 md:text-sm">Deadline:</p>
                        <input readOnly onClick={() => setOpenCalendar(!openCalendar)} value={deadline ? deadline.toDateString() : "Not yet picked"} className="bg-white block border-2 rounded-lg cursor-pointer py-1 px-2 w-full text-sm md:w-3/4 lg:text-base"/>
                        { openCalendar &&
                            <div ref={calendarRef} className="absolute mt-2 top-[-50px] -right-4 lg:top-[-18px] lg:-right-2">
                                <DayPicker
                                    mode="single"
                                    fixedWeeks
                                    classNames={{
                                        root: "text-xs",
                                        day: "w-7 h-7 lg:w-8 lg:w-8",
                                        selected: "text-sm font-bold text-[#C39F4A]",
                                        head_cell: "text-[11px]",
                                        cell: "p-0 m-0 w-8 h-8",
                                        table: "w-full border-collapse mx-auto",
                                        caption_label: "text-sm font-bold mb-4.5 text-[#9c854e] lg:text-base",
                                        nav_icon: "h-3 w-3 fill-current ",
                                    }}                        
                                    selected={deadline}
                                    onSelect={(date) => {
                                        setDeadline(date);
                                        setOpenCalendar(!openCalendar);
                                    }}
                                    className="bg-white border-gray-400 border rounded-lg text-sm p-2"
                                />
                            </div>
                        }
                    </div>
                    <div className="flex gap-x-2.5 pt-2">
                        <button type="submit" className="main-button px-5 py-1.5 text-sm md:text-base">Submit</button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default Goals;