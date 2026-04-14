"use client"

import { useState } from 'react';

import { InformationIcon } from './SVGIcons';

interface InfoCard {
    text: string
}

function InfoCard({ text }: InfoCard) {
    const [visible, setVisible] = useState(false)

    const toggleCard = () => setVisible(!visible);

    return(
        <div className="relative inline-block px-3">
            <button onClick={toggleCard} >
                <InformationIcon 
                    className='information-logo'
                />
            </button>

            {visible && (
                <div className="absolute left-0 bg-white p-2.5 shadow-md rounded-md w-28 md:w-60 z-[25] xl:left-[25px]">
                    <p className="text-sm text-gray-700">{text}</p>
                </div>
            )}
        </div>
    )
}

export default InfoCard;