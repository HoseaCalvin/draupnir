"use client"

interface PopupInterface {
    title: string;
    text: string;
    onConfirm: () => void;
    onClose: () => void;
}

function Popup({ title, text, onConfirm, onClose }: PopupInterface) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    }

    return(
        <div className="bg-gray-400/50 fixed top-0 left-0 z-50 flex justify-center items-center w-full h-screen">
            <div className="bg-[#FFFDF0] mx-6 py-3 pb-5 px-5 rounded-2xl w-full max-w-[700px] md:pb-4">
                <header className="flex justify-between items-center w-full">
                    <h1 className="font-bold text-base lg:text-lg">{title}</h1>
                    <p className="text-3xl cursor-pointer" onClick={onClose}>&times;</p>
                </header>
                <hr />
                <div className="py-3.5">
                    <p className="text-sm md:text-base lg:text-lg">{text}</p>
                </div>
                <div className="flex flex-col gap-y-2 gap-x-2 sm:gap-y-0 sm:flex-row sm:justify-end">
                    <button onClick={onClose} className="font-bold border-2 border-[#C39F4A] text-[#C39F4A] rounded-lg cursor-pointer px-3.5 py-1 text-sm md:text-base">No</button>
                    <button onClick={handleConfirm} className="main-button px-3.5 py-1 text-sm md:text-base">Yes</button>
                </div>
            </div>
        </div>
    )
}

export default Popup;