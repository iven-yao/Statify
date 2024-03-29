import React from 'react';
import { NavLink } from 'react-router-dom';
import StatifyPNG from '../assets/statify.png';
import { FaListOl } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaChartPie } from "react-icons/fa";
import { BsGithub} from 'react-icons/bs';
/* eslint-disable no-unused-vars */
import { IoIosConstruct } from "react-icons/io";

const Nav = () => {

    return (
        <nav id='navbar' className='fixed bottom-0 bg-black w-screen items-center justify-between flex'>
            <div className="flex items-center pl-2 md:pl-5">
                <img src={StatifyPNG} width='35' className="rounded-full m-2 aspect-square" alt="logo"/> 
                <div className='md:inline hidden'>
                    <div className="text-xl">Statify</div>
                    <div className='text-xs whitespace-nowrap'>your personal charts</div>
                </div>
            </div>

            <div className='flex fixed justify-center w-screen'>
                <NavLink to='/' className='mx-2 md:mx-5 flex items-center hover:text-green-500'>
                    <LuLayoutDashboard size={25}/><div className='hidden md:inline pl-1'>DASHBOARD</div>
                </NavLink>
                <NavLink to='/topchart' className='mx-2 md:mx-5 flex items-center hover:text-green-500'>
                    <FaListOl size={25}/><div className='hidden md:inline pl-1'>TOPCHART</div>
                </NavLink>
                <NavLink to='/analysis' className='mx-2 md:mx-5 flex items-center hover:text-green-500'>
                    <FaChartPie size={25}/><div className='hidden md:inline pl-1'>ANALYSIS</div>
                </NavLink>
                {/* <NavLink to='/test' className='mx-2 md:mx-5 flex items-center hover:text-green-500'>
                    <IoIosConstruct size={25}/><div className='hidden md:inline pl-1'>TEST</div>
                </NavLink> */}
            </div>

            <div className='flex items-center pr-2 md:pr-5 z-10'>
                <NavLink to='https://github.com/iven-yao/Statify' target='_'>
                    <BsGithub size={35}/>
                </NavLink>
            </div>
        </nav>
    );
}

export default Nav;