import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';

export default function SidebarNavItem({ item, isCollapsed, onClick }) {
  const [hovered, setHovered] = useState(false);
  const Icon = Icons[item.icon] || Icons.Circle;

  const wrapperProps = onClick 
    ? { onClick }
    : {
        to: item.route,
        end: item.route === '/crm' || item.route === '/crm/',
        className: ({ isActive }) => isActive ? 'active' : ''
      };

  const styleObj = {
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    padding: isCollapsed ? '0' : '0 12px',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    margin: '1px 6px',
    borderRadius: '6px',
    cursor: 'pointer',
    gap: isCollapsed ? '0' : '8px',
    textDecoration: 'none',
    transition: 'all 0.15s',
  };

  const renderContent = (isActive) => {
    const iconColor = isActive ? '#2563eb' : hovered ? '#0f172a' : '#64748b';
    const labelColor = isActive ? '#2563eb' : hovered ? '#0f172a' : '#475569';
    const fontWeight = isActive ? 600 : 400;

    return (
      <>
        <Icon size={15} color={iconColor} style={{ flexShrink: 0 }} />
        {!isCollapsed && (
          <>
            <span
              style={{
                fontSize: '13px',
                color: labelColor,
                fontWeight: fontWeight,
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.label}
            </span>
            {item.badge && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 600,
                  minWidth: '18px',
                  height: '18px',
                  borderRadius: '9px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px',
                }}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </>
    );
  };

  if (onClick) {
    return (
      <div
        {...wrapperProps}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ ...styleObj, background: hovered ? '#f1f5f9' : 'transparent' }}
      >
        {renderContent(false)}
      </div>
    );
  }

  return (
    <NavLink
      {...wrapperProps}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={({ isActive }) => {
        return {
          ...styleObj,
          background: isActive ? '#eff6ff' : hovered ? '#f1f5f9' : 'transparent',
          border: isActive ? '1px solid #dbeafe' : '1px solid transparent',
        };
      }}
    >
      {({ isActive }) => {
        return renderContent(isActive);
      }}
    </NavLink>
  );
}
