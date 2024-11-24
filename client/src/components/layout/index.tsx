import React from 'react';
import './index.css';
import { Outlet } from 'react-router-dom';
import SideBarNav from '../main/sideBarNav';
import Header from '../header';
import PointsIndicator from '../main/pointsIndicator';
import useLayout from '../../hooks/useLayout';

/**
 * Main component representing the layout of the main page, including a sidebar and the main content area.
 */
const Layout = () => {
  const { points } = useLayout();
  return (
    <>
      <Header />
      <div id='main' className='main'>
        <SideBarNav />
        <div id='right_main' className='right_main'>
          <div className='points-indicator'>
            <PointsIndicator points={points} />
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
