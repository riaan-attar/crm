import React, { useState } from 'react';
import { Filter, MoreHorizontal, ChevronDown } from 'lucide-react';

function IconBtn({ children, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#2b2b2b' : '#232323',
        border: '1px solid #343434',
        borderRadius: '6px',
        padding: '4px 8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: '#7c7c7c',
        transition: 'background 0.1s',
      }}
    >
      {children}
    </button>
  );
}

function DropdownSelect({ value, onChange, options }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? '#2b2b2b' : '#232323',
          border: '1px solid #343434',
          borderRadius: '6px',
          padding: '4px 28px 4px 10px',
          cursor: 'pointer',
          fontSize: '14px',
          color: '#afafaf',
          fontFamily: 'inherit',
          transition: 'background 0.1s',
          whiteSpace: 'nowrap',
          appearance: 'none',
          WebkitAppearance: 'none',
          outline: 'none',
        }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ backgroundColor: '#1c1c1c', color: '#afafaf' }}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown 
        size={12} 
        style={{ 
          color: '#7c7c7c', 
          position: 'absolute', 
          right: '10px', 
          top: '55%', 
          transform: 'translateY(-50%)',
          pointerEvents: 'none' 
        }} 
      />
    </div>
  );
}

export default function ChartCard({
  title,
  lastSynced = 'Last synced 8 minutes ago',
  showPeriod = false,
  periodValue = 'Last Quarter',
  periodOptions = ['Last Month', 'Last Quarter', 'Last Year', 'All Time'],
  onPeriodChange,
  showInterval = false,
  intervalValue = 'Weekly',
  intervalOptions = ['Daily', 'Weekly', 'Monthly'],
  onIntervalChange,
  children,
}) {
  return (
    <div
      style={{
        backgroundColor: '#1c1c1c',
        border: '1px solid #232323',
        borderRadius: '8px',
        padding: '16px 20px',
        marginBottom: '16px',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Left: title + subtitle */}
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#f8f8f8' }}>
            {title}
          </div>
          <div style={{ fontSize: '13px', color: '#7c7c7c', marginTop: '2px' }}>
            {lastSynced}
          </div>
        </div>

        {/* Right: controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <IconBtn><Filter size={13} /></IconBtn>
          {showPeriod && onPeriodChange && (
            <DropdownSelect 
              value={periodValue} 
              onChange={onPeriodChange} 
              options={periodOptions} 
            />
          )}
          {showInterval && onIntervalChange && (
            <DropdownSelect 
              value={intervalValue} 
              onChange={onIntervalChange} 
              options={intervalOptions} 
            />
          )}
          <IconBtn><MoreHorizontal size={14} /></IconBtn>
        </div>
      </div>

      {/* Content */}
      {children}
    </div>
  );
}
