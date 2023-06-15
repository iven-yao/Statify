import React from 'react';
import { NavLink } from 'react-router-dom';
import StatifyPNG from '../assets/statify.png';

const Nav = () => {

    return (
        <nav className='flex fixed bottom-0 bg-black w-screen justify-between px-10 items-center'>
            
            <div className="flex justify-start bg-black items-center">
                <img src={StatifyPNG} width='50' className="rounded-full m-2 aspect-square" alt="profile pic"/> 
                <div>
                    <div className="text-xl">Statify</div>
                    <div className='text-sm'>your personal charts</div>
                </div>
            </div>

            <div className='flex'>
                <NavLink to='/profile' className='mx-5'>
                    PROFILE
                </NavLink>
                <NavLink to='/artists' className='mx-5'>
                    ARTISTS
                </NavLink>    
                <NavLink to='/tracks' className='mx-5'>
                    TRACKS
                </NavLink>      
            </div>
            <div>
                GITHUB
            </div>
        </nav>
    );
}

export default Nav;