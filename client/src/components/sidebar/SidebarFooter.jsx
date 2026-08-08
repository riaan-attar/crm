import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function SidebarFooter({ isCollapsed }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileHovered, setProfileHovered] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [settingsHovered, setSettingsHovered] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div
      style={{
        borderTop: '1px solid #e2e8f0',
        padding: '8px 6px',
        flexShrink: 0,
        background: '#ffffff',
      }}
    >
      {/* PROFILE ROW */}
      <div
        onClick={() => navigate('/crm/settings')}
        onMouseEnter={() => setProfileHovered(true)}
        onMouseLeave={() => setProfileHovered(false)}
        style={{
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          padding: isCollapsed ? '0' : '0 10px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '8px',
          borderRadius: '6px',
          cursor: 'pointer',
          background: profileHovered ? '#f1f5f9' : 'transparent',
          transition: 'background 0.1s',
        }}
      >
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#2563eb',
            fontSize: '10px',
            fontWeight: 600,
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {getInitials(user?.fullName || user?.username || 'Admin User')}
        </div>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
              {user?.fullName || user?.username || 'Admin User'}
            </span>
            <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.1 }}>
              {user?.email || 'admin@example.com'}
            </span>
          </div>
        )}
      </div>

      {/* SETTINGS ROW */}
      <div
        onClick={() => navigate('/crm/settings')}
        onMouseEnter={() => setSettingsHovered(true)}
        onMouseLeave={() => setSettingsHovered(false)}
        style={{
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          padding: isCollapsed ? '0' : '0 10px',
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          gap: '8px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '4px',
          background: settingsHovered ? '#f1f5f9' : 'transparent',
          transition: 'background 0.1s',
        }}
      >
        <Settings size={13} color="#64748b" style={{ flexShrink: 0 }} />
        {!isCollapsed && (
          <span style={{ fontSize: '12px', color: '#475569', flex: 1, whiteSpace: 'nowrap' }}>
            Settings
          </span>
        )}
      </div>

      {/* SEARCH ROW */}
      {!isCollapsed && (
        <div
          onMouseEnter={() => setSearchHovered(true)}
          onMouseLeave={() => setSearchHovered(false)}
          style={{
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            gap: '8px',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '2px',
            background: searchHovered ? '#f1f5f9' : 'transparent',
            transition: 'background 0.1s',
          }}
        >
          <Search size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#94a3b8', flex: 1, whiteSpace: 'nowrap' }}>
            Search
          </span>
          <div
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '10px',
              padding: '1px 5px',
              color: '#64748b',
              flexShrink: 0,
            }}
          >
            Ctrl K
          </div>
        </div>
      )}
    </div>
  );
}
