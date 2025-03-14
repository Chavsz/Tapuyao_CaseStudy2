import React from 'react'
import {Link} from 'react-router-dom';
import { SideBarData } from './SidebarData';
import './Navbar.css';
import { IconContext } from 'react-icons/lib';
import * as riIcons from 'react-icons/ri';

function Navbar() {

  return (
    <>
    <IconContext.Provider value={{color:'#fff'}}>
      <div className='barangay-icon'>
        <riIcons.RiCommunityFill />
      </div>
      <nav>
        <ul className='nav-menu-items' >
          {SideBarData.map((item, index) => {
            return (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      </IconContext.Provider>
    </>
  )
}

export default Navbar
