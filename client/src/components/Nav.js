import React from 'react';
import { NavLink } from 'react-router-dom';
import StatifyPNG from '../assets/statify.png';
import { BiUser, BiMusic, BiMicrophone } from 'react-icons/bi';
import { BsGithub} from 'react-icons/bs';

const Nav = () => {

    return (
        <nav className='fixed bottom-0 bg-black w-screen items-center justify-between flex'>
            
            <div className="flex items-center pl-5">
                <img src={StatifyPNG} width='35' className="rounded-full m-2 aspect-square" alt="profile pic"/> 
                <div className='md:inline hidden'>
                    <div className="text-xl">Statify</div>
                    <div className='text-xs whitespace-nowrap'>your personal charts</div>
                </div>
            </div>

            <div className='flex fixed justify-center w-screen'>
                <NavLink to='/' className='mx-5 flex items-center'>
                    <BiUser size={35}/><span className='hidden md:inline'>PROFILE</span>
                </NavLink>
                <NavLink to='/artists' className='mx-5 flex items-center'>
                    <BiMicrophone size={35}/><span className='hidden md:inline'>ARTISTS</span>
                </NavLink>    
                <NavLink to='/tracks' className='mx-5 flex items-center'>
                    <BiMusic size={35}/><span className='hidden md:inline'>TRACKS</span>
                </NavLink>      
            </div>

            <div className='flex items-center pr-5 z-10'>
                <NavLink to='https://github.com/iven-yao/Statify' target='_'>
                    <BsGithub size={35}/>
                </NavLink>
            </div>
        </nav>
    );
}

export default Nav;