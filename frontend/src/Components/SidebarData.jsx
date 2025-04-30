import React from 'react'
import * as FaIcons  from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as bsIcons from "react-icons/bs";
import * as faIcons from "react-icons/fa";
import * as tbIcons  from "react-icons/tb";

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
    icon: <bsIcons.BsClipboardData />,
    cName: 'nav-text'
  },
  {
    title: 'Households',
    path: '/households',
    icon: <faIcons.FaHouseUser />,
    cName: 'nav-text'
  },
  {
    title: 'Businesses',
    path: '/business',
    icon: <faIcons.FaMoneyCheckAlt />,
    cName: 'nav-text'
  },
  {
    title: 'Disaster',
    path: '/disaster',
    icon: <tbIcons.TbAlertSquare />,
    cName: 'nav-text'
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: <IoIcons.IoIosSettings />,
    cName: 'nav-text'
  }
]