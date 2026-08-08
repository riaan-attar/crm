import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, Pencil, Check, Trash2, ArrowRightCircle } from 'lucide-react';

export default function LeadHeader({ lead, isEditing, onEdit, onSave, onDelete, onConvert, updateLead }) {
  const navigate = useNavigate();
  const [showStatusDrop, setShowStatusDrop] = useState(false);

  const statusColors = {
    'New': '#64748b',
    'Contacted': '#0284c7',
    'Nurture': '#16a34a',
    'Qualified': '#d97706',
    'Unqualified': '#dc2626',
    'Junk': '#475569',
    'Converted': '#9333ea'
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  };

  const currentStatusColor = statusColors[lead?.status] || '#64748b';

  return (
    <div style={{
      height: '48px', background: '#ffffff', borderBottom: '1px solid #e2e8f0',
      padding: '0 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0
    }}>
      <span
        onClick={() => navigate('/crm/leads')}
        style={{ fontSize: '13px', color: '#64748b', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
        onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
      >
        Leads
      </span>
      <ChevronRight size={14} color="#cbd5e1" />
      <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: 600 }}>
        {lead?.firstName} {lead?.lastName}
      </span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        
        {/* Assigned User Pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px', background: '#f8fafc',
          border: '1px solid #e2e8f0', borderRadius: '16px', padding: '3px 10px 3px 4px', cursor: 'pointer'
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%', background: '#2563eb',
            fontSize: '9px', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {getInitials(lead?.assignedTo)}
          </div>
          <span style={{ fontSize: '12px', color: '#334155' }}>{lead?.assignedTo || 'Unassigned'}</span>
        </div>

        {/* Status Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowStatusDrop(!showStatusDrop)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', background: '#ffffff',
              border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px',
              cursor: 'pointer', fontSize: '12px'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
          >
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: currentStatusColor }} />
            <span style={{ color: '#334155', fontWeight: 500 }}>{lead?.status || 'New'}</span>
            <ChevronDown size={11} color="#64748b" />
          </div>

          {showStatusDrop && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0, background: '#ffffff',
              border: '1px solid #e2e8f0', borderRadius: '8px', padding: '4px', zIndex: 100, minWidth: '160px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
              {Object.entries(statusColors).map(([status, color]) => (
                <div
                  key={status}
                  onClick={() => {
                    updateLead(lead.id, { status });
                    setShowStatusDrop(false);
                  }}
                  style={{
                    padding: '6px 12px', borderRadius: '5px', fontSize: '12.5px', color: '#334155',
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#334155'; }}
                >
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: color }} />
                  {status}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit / Save */}
        {!isEditing ? (
          <button
            onClick={onEdit}
            style={{
              background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px',
              padding: '4px 12px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            <Pencil size={12} /> Edit
          </button>
        ) : (
          <button
            onClick={onSave}
            style={{
              background: '#2563eb', border: 'none', borderRadius: '6px',
              padding: '4px 12px', fontSize: '12px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}
          >
            <Check size={12} /> Save
          </button>
        )}

        {/* Delete */}
        <button
          onClick={onDelete}
          style={{
            background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px',
            padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#dc2626'; e.currentTarget.style.background = '#fef2f2'; e.currentTarget.querySelector('svg').style.color = '#dc2626'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff'; e.currentTarget.querySelector('svg').style.color = '#64748b'; }}
        >
          <Trash2 size={13} color="#64748b" style={{ transition: 'color 0.15s' }} />
        </button>

        {/* Convert */}
        {lead?.status === 'Converted' ? (
          <button
            onClick={onConvert}
            style={{
              background: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '6px',
              padding: '5px 14px', fontSize: '13px', fontWeight: 500, color: '#15803d',
              cursor: 'pointer'
            }}
          >
            View Deal &rarr;
          </button>
        ) : (
          <button
            onClick={onConvert}
            style={{
              background: '#0f172a', border: 'none', borderRadius: '6px',
              padding: '5px 14px', fontSize: '13px', fontWeight: 500, color: '#ffffff',
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
            onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
          >
            <ArrowRightCircle size={13} /> Convert to Deal
          </button>
        )}

      </div>
    </div>
  );
}
