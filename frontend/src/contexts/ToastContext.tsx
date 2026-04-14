// ToastProvider.tsx
"use client";

import { ToastContainer } from "react-toastify";

function ToastProvider() {
    return (
        <ToastContainer 
            toastClassName="text-[11px] md:text-base"
            newestOnTop
            limit={3}
            toastStyle={{
                maxWidth: "70vw",
                margin: "15px 15px 5px 15px"
            }}
        />
    );
}

export default ToastProvider;