import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../sidebar/Sidebar';
import Topbar from './Topbar';
import { TopbarProvider } from '../../context/TopbarContext';
import NotificationDrawer from './NotificationDrawer';

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();

  const hideTopbarPatterns = [
    /^\/crm\/leads\/[^/]+$/,
    /^\/crm\/deals\/[^/]+$/,
  ];
  
  const shouldHideTopbar = hideTopbarPatterns.some(pattern => pattern.test(location.pathname));

  return (
    <TopbarProvider>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={setIsCollapsed} 
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />

        <div
          style={{
            marginLeft: isCollapsed ? '48px' : '220px',
            transition: 'margin-left 0.2s ease',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            background: '#ffffff'
          }}
        >
          {!shouldHideTopbar && <Topbar />}

          <main
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Outlet />
          </main>
        </div>
        
        <NotificationDrawer 
          isOpen={isNotificationsOpen} 
          onClose={() => setIsNotificationsOpen(false)} 
          />
      </div>
    </TopbarProvider>
  );
}
