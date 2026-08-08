import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function SidebarBrand({ isCollapsed, onToggleCollapse }) {
  return (
    <div
      style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '4px',
        flexShrink: 0,
        height: '52px',
        boxSizing: 'border-box',
        background: '#ffffff',
      }}
    >
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            backgroundColor: '#0f172a',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: '#ffffff',
            flexShrink: 0,
          }}
        >
          B
        </div>

        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                BOS
              </span>
            </div>
          </div>
        )}
      </Link>

      {!isCollapsed && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleCollapse();
          }}
          aria-label="Collapse sidebar"
          style={{
            marginLeft: 'auto',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '2px',
            borderRadius: '4px',
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.1s',
            flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
          onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
        >
          <ChevronLeft size={14} />
        </button>
      )}
    </div>
  );
}
