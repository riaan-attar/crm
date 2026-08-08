/**
 * FilterPanel — client/src/modules/crm/leads/FilterPanel.jsx
 * Floating filter panel rendered below the filter bar.
 * Props: isOpen, onClose
 */
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const FIELD_OPTIONS = [
  'ID', 'First Name', 'Last Name', 'Job Title',
  'Status', 'Project', 'Territory',
  'Mobile No', 'Lead Source', 'Created On',
];

const OPERATOR_OPTIONS = [
  'Equals', 'Like', 'Not Equals', 'Is Empty', 'Is Not Empty',
];

const EMPTY_ROW = () => ({ id: Date.now() + Math.random(), field: 'ID', operator: 'Equals', value: '' });

/* ─── shared input style (Light mode) ─────────────────────────────────── */
const selectStyle = {
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '12.5px',
  color: '#0f172a',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  cursor: 'pointer',
};

export default function FilterPanel({ isOpen, onClose }) {
  const [rows, setRows] = useState([EMPTY_ROW()]);
  const panelRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        if (!e.target.closest('.filter-bar-filter-btn')) {
          onClose();
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function addRow() {
    setRows(prev => [...prev, EMPTY_ROW()]);
  }

  function removeRow(id) {
    setRows(prev => prev.length === 1 ? [EMPTY_ROW()] : prev.filter(r => r.id !== id));
  }

  function updateRow(id, key, val) {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [key]: val } : r));
  }

  function clearFilters() {
    setRows([EMPTY_ROW()]);
  }

  function applyFilters() {
    console.log('Applied filters:', rows);
    onClose();
  }

  return (
    <div
      ref={panelRef}
      className="filter-panel"
      style={{
        position: 'absolute',
        top: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 999,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px',
        minWidth: '520px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Caret arrow */}
      <div
        style={{
          position: 'absolute',
          top: '-7px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: '7px solid #cbd5e1',
        }}
      />
      {/* Inner caret fill */}
      <div
        style={{
          position: 'absolute',
          top: '-5px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: '6px solid #ffffff',
        }}
      />

      {/* Filter rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map(row => (
          <FilterRow
            key={row.id}
            row={row}
            onUpdate={(key, val) => updateRow(row.id, key, val)}
            onRemove={() => removeRow(row.id)}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          borderTop: '1px solid #f1f5f9',
          paddingTop: '12px',
        }}
      >
        <AddRowBtn onClick={addRow} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <PanelBtn
            onClick={clearFilters}
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#475569',
            }}
            hoverStyle={{ background: '#f8fafc', color: '#0f172a' }}
          >
            Clear Filters
          </PanelBtn>
          <PanelBtn
            onClick={applyFilters}
            style={{
              background: '#0f172a',
              border: 'none',
              color: '#ffffff',
              fontWeight: '500',
            }}
            hoverStyle={{ background: '#1e293b' }}
          >
            Apply Filters
          </PanelBtn>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter row ─────────────────────────────────────────────── */
function FilterRow({ row, onUpdate, onRemove }) {
  const [removeHov, setRemoveHov] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Field selector */}
      <select
        value={row.field}
        onChange={e => onUpdate('field', e.target.value)}
        style={{ ...selectStyle, width: '160px' }}
      >
        {FIELD_OPTIONS.map(opt => (
          <option key={opt} value={opt} style={{ background: '#ffffff' }}>
            {opt}
          </option>
        ))}
      </select>

      {/* Operator selector */}
      <select
        value={row.operator}
        onChange={e => onUpdate('operator', e.target.value)}
        style={{ ...selectStyle, width: '130px' }}
      >
        {OPERATOR_OPTIONS.map(opt => (
          <option key={opt} value={opt} style={{ background: '#ffffff' }}>
            {opt}
          </option>
        ))}
      </select>

      {/* Value input */}
      <input
        type="text"
        value={row.value}
        onChange={e => onUpdate('value', e.target.value)}
        placeholder=""
        style={{
          ...selectStyle,
          flex: 1,
          cursor: 'text',
        }}
      />

      {/* Remove row */}
      <button
        onClick={onRemove}
        onMouseEnter={() => setRemoveHov(true)}
        onMouseLeave={() => setRemoveHov(false)}
        title="Remove filter"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: removeHov ? '#0f172a' : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          padding: '4px',
          transition: 'color 0.15s',
          flexShrink: 0,
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

/* ─── Add row button ─────────────────────────────────────────── */
function AddRowBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: 'transparent',
        border: 'none',
        color: hov ? '#2563eb' : '#64748b',
        fontSize: '12.5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'color 0.15s',
        padding: 0,
      }}
    >
      + Add a Filter
    </button>
  );
}

/* ─── Generic panel button ───────────────────────────────────── */
function PanelBtn({ children, onClick, style, hoverStyle }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: '6px',
        padding: '6px 14px',
        fontSize: '12.5px',
        cursor: 'pointer',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.15s, color 0.15s',
        ...style,
        ...(hov ? hoverStyle : {}),
      }}
    >
      {children}
    </button>
  );
}
