"use client";

import Wallet from "@/assets/landing/wallet.svg";
import Goal from "@/assets/landing/goal.svg";
import Vault from "@/assets/landing/vault.svg";
import Chart from "@/assets/landing/chart.svg";
import Mimir from "@/assets/landing/ai.svg";

import VaultCard from "@/assets/landing/vault-card.png";
import ChartCard from "@/assets/landing/chart-card.png";
import HomePage from "@/assets/landing/home-page.png";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

export default function Home() {
  return (
    <main className="bg-white w-full h-full space-y-48 md:space-y-52">
      <section className="flex justify-center">
        <Navbar/>
      </section>    
      <section className="flex flex-col justify-center items-center h-full">
        <Image
          src="/draupnir-with-text-logo.png"
          alt="Draupnir"
          width={300}
          height={100}
          className="w-auto h-[180px] xl:h-[320px]"
        />
        <div className="space-y-3 xl:space-y-5 w-[85vw] mx-auto">
          <h1 className="font-semibold text-center text-base md:text-lg lg:text-xl xl:text-3xl">Your personal finance and goal tracker.</h1>
          <p className="text-center text-sm lg:text-base lg:leading-[1.5rem] xl:leading-[2.5rem] xl:text-2xl">Track your finance and set your goals carefully with <span className="text-[#9F7D38] font-bold">Draupnir</span> to level up your money management, create better future plans, and prevent overspending.</p>
        </div>
        <div className="overflow-hidden shadow-xl rounded-sm mt-6 lg:rounded-xl xl:mt-10">
          <Image
            src={HomePage}
            alt="Home Page"
            width={800}
            height={400}
            className="object-cover h-auto w-[90vw] md:w-[80vw]"
          />
        </div>
      </section>
      <section className="bg-white flex flex-col justify-center items-center h-full rounded-2xl lg:space-y-24 lg:px-5 lg:py-[7.5rem] lg:mx-5">
        <div className="text-center space-y-3.5 lg:space-y-4.5 xl:space-y-5">
          <h1 className="font-bold text-2xl lg:text-4xl">What <span className="text-[#9F7D38]">Draupnir</span> Offers</h1>
          <p className="text-sm w-[85vw] md:text-base lg:text-lg xl:text-2xl">With these features, you can effortlessly manage your finance for today, tomorrow, and the far future.</p>
        </div>
        <div className="flex flex-col justify-center mt-7 gap-y-5 w-[85vw] lg:grid lg:grid-rows-[200px_200px_200px_200px_200px] lg:grid-cols-2 lg:gap-7 xl:gap-8 xl:grid-rows-[240px_240px_240px_240px_240px] xl:w-[85%]">
          <article className="bg-amber-50 shadow-lg row-start-1 col-start-1 row-span-3 flex flex-col p-4 rounded-xl lg:rounded-4xl xl:space-y-10 xl:p-10">
            <Image
              src={Wallet}
              alt="Wallet"
              width={100}
              height={100}
              className="h-auto w-[30px] md:w-[45px] lg:w-[60px]"
            />
            <div className="flex flex-col flex-1">
              <div className="space-y-2.5 mt-3.5 mb-6 lg:mb-10 xl:space-y-5">
                <h2 className="w-full font-bold text-sm md:text-xl xl:text-3xl">Simple financial management.</h2>
                <div>
                  <ul className="list-disc ml-5 text-xs space-y-1.5 md:text-base lg:space-y-3 lg:px-5 lg:text-lg xl:text-xl">
                    <li>Note down every transaction with only two clicks.</li>
                    <li>Save your fixed monthly income and expenses to enable automatic tracking.</li>
                  </ul>
                </div>
              </div>
              <Image
                src={VaultCard}
                alt="Vault"
                width={700}
                height={700}
                className="mt-auto object-contain w-full lg:rounded-xl lg:max-h-[400px]"
              />              
            </div>
          </article>
          <article className="bg-amber-50 shadow-lg row-start-1 col-start-2 row-span-2 p-4 rounded-xl lg:rounded-4xl xl:space-y-10 xl:p-10">
            <Image
              src={Goal}
              alt="Goal"
              width={100}
              height={100}
              className="h-auto w-[30px] md:w-[45px] lg:w-[60px]"
            />
            <div className="space-y-2.5 mt-3.5 xl:space-y-5">
              <h2 className="w-full font-bold text-sm md:text-xl xl:text-3xl">Plan your goals.</h2>
              <div>
                <ul className="list-disc ml-5 text-xs space-y-1.5 md:text-base lg:space-y-3 lg:px-5 lg:text-lg xl:text-xl">
                  <li>Add any goals you wish to achieve.</li>
                  <li>Set deadline and target balance to define the success of the goal.</li>
                  <li>Pay attention to progress bar to see how far you’ve progressed.</li>
                </ul>
              </div>
            </div>
          </article>
          <article className="bg-amber-50 shadow-lg row-start-4 col-start-1 row-span-2 p-4 rounded-xl lg:rounded-4xl xl:space-y-10 xl:p-10">
            <Image
              src={Vault}
              alt="Deposit"
              width={100}
              height={100}
              className="h-auto w-[30px] md:w-[45px] lg:w-[60px]"
            />
            <div className="space-y-2.5 mt-3.5 xl:space-y-5">
              <h2 className="w-full font-bold text-sm md:text-xl xl:text-3xl">Deposits.</h2>
              <div>
                <ul className="list-disc ml-5 text-xs space-y-1.5 md:text-base lg:space-y-3 lg:px-5 lg:text-lg xl:text-xl">
                  <li>Properly keep your money with our deposit system.</li>
                  <li>Easily withdraw funds anytime and anywhere.</li>
                </ul>
              </div>
            </div>
          </article>
          <article className="bg-amber-50 shadow-lg row-start-3 col-start-2 row-span-3 flex flex-col p-4 rounded-xl lg:rounded-4xl xl:space-y-10 xl:p-10">
            <Image
              src={Chart}
              alt="Transactions"
              width={100}
              height={100}
              className="h-auto w-[30px] md:w-[45px] lg:w-[60px]"
            />
            <div className="flex flex-col flex-1">
              <div className="space-y-2.5 mt-3.5 mb-6 lg:mb-10 xl:space-y-5">
                <h2 className="w-full font-bold text-sm md:text-xl xl:text-3xl">Your transactions, summarized.</h2>
                <div>
                  <ul className="list-disc ml-5 text-xs space-y-1.5 md:text-base lg:space-y-3 lg:px-5 lg:text-lg xl:text-xl">
                    <li>Use the monthly transaction log to track your transactions within the current month.</li>
                    <li>Use the ledger to view all your transactions throughout your use of Draupnir.</li>
                    <li>Get insights into your financial habits and trends.</li>
                  </ul>
                </div>
              </div>
              <Image
                src={ChartCard}
                alt="Chart"
                width={700}
                height={700}
                className="mt-auto object-contain w-full lg:rounded-xl lg:max-h-[400px]"
              />  
            </div>
          </article>
        </div>
      </section>
      <section className="bg-[#C39F4A] flex flex-col justify-center h-full p-9 xl:p-12">
        <div className="mx-auto space-y-4 lg:space-y-6">
            <Image
              src={Mimir}
              alt="Mimir"
              width={150}
              height={150}
              className="bg-[#BB9742] mx-auto h-auto rounded-xl p-4 lg:rounded-2xl lg:p-6 lg:w-[200px] xl:rounded-4xl xl:w-[300px]"
            />
          <h1 className="text-white text-center font-bold text-xl lg:text-2xl xl:text-4xl">Introducing Mimir</h1>
          <p className="text-white text-sm md:text-base lg:text-lg xl:text-2xl">Ask Mimir, your AI financial advisor who is willing to provide the assistance you need, whether it is:</p>
          <ul className="list-disc text-white ml-5 space-y-2 text-xs md:text-sm lg:text-base lg:space-y-2.5 xl:text-2xl">
            <li>Coming up with a better recommendation;</li>
            <li>Finding new insights by analyzing your past financial history;</li>
            <li>Providing personalized financial advice;</li>
          </ul>
        </div>
      </section>
      <footer className="border-t-2 border-gray-100 py-5 md:py-6 lg:py-8">
        <div className="w-full">
          <p className="text-gray-400 text-center text-xs md:text-sm lg:text-base">Draupnir &copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  return(
    <>
      <aside className={`bg-[#C39F4A] p-5 shadow-lg rounded-lg w-[90%] fixed -translate-x-1/2 top-[80px] left-[50%] transition-all ease-in-out duration-300 z-10 md:hidden ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5 pointer-events-none'}`}>
        <div className="flex flex-col justify-center items-center space-y-3">
          <Link 
            href="/login" 
            className="bg-[#C39F4A] text-white text-center font-bold rounded-md w-full hover:bg-[#9c854e]"
          >
            Login
          </Link>
          <Link 
            href="/register" 
            className="bg-[#C39F4A] text-white text-center font-bold rounded-md w-full hover:bg-[#9c854e]"
          >
            Register
          </Link>
        </div>
      </aside>

      <nav className="fixed bg-white shadow-lg px-5 py-2 flex justify-between items-center w-full md:px-4 md:rounded-xl md:w-[80%] md:my-4 md:py-1.5 lg:shadow-xl xl:px-6">
        <div>
          <Image 
            src="/draupnir-logo.png" 
            alt="Draupnir"
            width={120} 
            height={30} 
            className="w-auto h-[40px] md:h-[50px] xl:h-[65px]"
          />
        </div>
        <div onClick={() => setIsMenuOpen(!isMenuOpen)} className="block w-[30px] space-y-1 md:hidden">
          <span className="block bg-black h-1 w-full"></span>
          <span className="block bg-black h-1 w-full"></span>
          <span className="block bg-black h-1 w-full"></span>
        </div>
        <div className="hidden md:flex gap-x-3 xl:gap-x-3.5">
          <Link 
            href="/login"
            className="bg-[#C39F4A] hover:bg-[#9c854e] text-white text-sm font-bold rounded-lg md:py-1.5 md:px-3.5 lg:px-3.5 xl:py-2 lg:text-base"
          >
            Login
          </Link>
          <Link 
            href="/register"
            className="bg-[#C39F4A] hover:bg-[#9c854e] text-white text-sm font-bold rounded-lg md:py-1.5 md:px-3.5 lg:px-3.5 xl:py-2 lg:text-base"
          >
            Register
          </Link>
        </div>
      </nav>
    </>
  )
}