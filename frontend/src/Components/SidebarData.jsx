import React, {useState} from 'react'
import * as FaIcons  from "react-icons/fa";
import * as IoIcons from "react-icons/io";

export const SideBarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <FaIcons.FaHome />,
    cName: 'nav-text'
  },
  {
    title: 'Records',
    path: '/records',
    icon: <FaIcons.FaHome />,
    cName: 'nav-text'
  },
  {
    title: 'Households',
    path: '/households',
    icon: <IoIcons.IoIosSettings />,
    cName: 'nav-text'
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <IoIcons.IoIosSettings />,
    cName: 'nav-text'
  }
]