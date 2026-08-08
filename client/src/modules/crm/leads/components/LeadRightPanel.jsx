import React, { useState, useEffect } from 'react';
import { Phone, Mail, MessageCircle, Link as LinkIcon, ChevronDown, ChevronRight } from 'lucide-react';

const avatarColors = [
  { bg: '#2b2b2b', color: '#f8f8f8' },
  { bg: '#388AE5', color: '#ffffff' },
  { bg: '#30a66d', color: '#ffffff' },
  { bg: '#e79913', color: '#ffffff' },
  { bg: '#5aaef2', color: '#ffffff' }
];

const InlineField = ({ label, value, field, type = 'text', options = [], onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [localVal, setLocalVal] = useState(value || '');

  useEffect(() => {
    setLocalVal(value || '');
  }, [value]);

  const handleSave = () => {
    setEditing(false);
    if (localVal !== (value || '')) {
      onUpdate(field, localVal);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  if (editing) {
    if (type === 'select') {
      return (
        <select
          value={localVal}
          onChange={e => {
            setLocalVal(e.target.value);
            onUpdate(field, e.target.value);
            setEditing(false);
          }}
          onBlur={handleSave}
          autoFocus
          style={{
            background: '#0a0a0a', border: 'none', borderBottom: '1px solid #388AE5', borderRadius: '0',
            padding: '2px 0', fontSize: '12.5px', color: '#e2e2e2', width: '100%', outline: 'none'
          }}
        >
          <option value="" style={{ background: '#0a0a0a' }}>—</option>
          {options.map(opt => <option key={opt} value={opt} style={{ background: '#0a0a0a' }}>{opt}</option>)}
        </select>
      );
    } else if (type === 'textarea') {
      return (
        <textarea
          value={localVal}
          onChange={e => setLocalVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          rows={3}
          style={{
            background: '#0a0a0a', border: 'none', borderBottom: '1px solid #388AE5', borderRadius: '0',
            padding: '2px 0', fontSize: '12.5px', color: '#e2e2e2', width: '100%', resize: 'none', outline: 'none'
          }}
        />
      );
    } else {
      return (
        <input
          type={type}
          value={localVal}
          onChange={e => setLocalVal(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            background: '#0a0a0a', border: 'none', borderBottom: '1px solid #388AE5', borderRadius: '0',
            padding: '2px 0', fontSize: '12.5px', color: '#e2e2e2', width: '100%', outline: 'none'
          }}
        />
      );
    }
  }

  return (
    <div
      onClick={() => setEditing(true)}
      style={{
        cursor: 'pointer',
        padding: '2px 6px',
        borderRadius: '0',
        marginLeft: '-6px',
        borderBottom: '1px solid transparent',
        transition: 'border-color 0.15s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        minHeight: '22px'
      }}
      onMouseEnter={e => { e.currentTarget.style.borderBottomColor = 'rgba(56, 138, 229, 0.5)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
    >
      <div style={{ flex: 1 }}>
        {value ? (
          type === 'email' ? (
            <a href={`mailto:${value}`} onClick={e => e.stopPropagation()} style={{ color: '#5aaef2', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration='underline'} onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>{value}</a>
          ) : type === 'tel' ? (
            <a href={`tel:${value}`} onClick={e => e.stopPropagation()} style={{ color: '#5aaef2', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration='underline'} onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>{value}</a>
          ) : type === 'url' ? (
            <a href={value.startsWith('http') ? value : `https://${value}`} onClick={e => e.stopPropagation()} target="_blank" rel="noreferrer" style={{ color: '#5aaef2', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.textDecoration='underline'} onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>{value}</a>
          ) : (
            <span>{value}</span>
          )
        ) : (
          <span style={{ color: '#383838', fontStyle: 'italic' }}>—</span>
        )}
      </div>
    </div>
  );
};

export default function LeadRightPanel({ lead, isEditing, onUpdate }) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [personOpen, setPersonOpen] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);

  const num = lead?.id?.split('-')[1] || '0001';
  const crmId = `CRM-LEAD-2026-${num.padStart(5, '0')}`;

  const firstLetter = lead?.firstName ? lead.firstName.charAt(0).toUpperCase() : 'U';
  const colorIndex = firstLetter.charCodeAt(0) % avatarColors.length;
  const avatarStyle = avatarColors[colorIndex];

  const renderField = (label, value, field, type = 'text', options = []) => {
    return (
      <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '12px', gap: '10px' }}>
        <div style={{ width: '110px', flexShrink: 0, fontSize: '12px', color: '#424242', paddingTop: '2px' }}>
          {label}
        </div>
        <div style={{ flex: 1, fontSize: '12.5px', color: '#e2e2e2' }}>
          {isEditing ? (
            type === 'select' ? (
              <select
                value={value || ''}
                onChange={e => onUpdate(field, e.target.value)}
                style={{
                  background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px',
                  padding: '4px 8px', fontSize: '12px', color: '#f8f8f8', width: '100%', outline: 'none'
                }}
              >
                <option value="">—</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : type === 'textarea' ? (
              <textarea
                value={value || ''}
                onChange={e => onUpdate(field, e.target.value)}
                rows={3}
                style={{
                  background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px',
                  padding: '4px 8px', fontSize: '12px', color: '#f8f8f8', width: '100%', resize: 'none', outline: 'none'
                }}
              />
            ) : (
              <input
                type={type}
                value={value || ''}
                onChange={e => onUpdate(field, e.target.value)}
                style={{
                  background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px',
                  padding: '4px 8px', fontSize: '12px', color: '#f8f8f8', width: '100%', outline: 'none'
                }}
              />
            )
          ) : (
            <InlineField
              label={label}
              value={value}
              field={field}
              type={type}
              options={options}
              onUpdate={onUpdate}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: '320px', minWidth: '320px', height: '100%', overflowY: 'auto', background: '#0a0a0a', flexShrink: 0, padding: '16px' }}>
      
      {/* LEAD ID */}
      <div style={{ fontSize: '11px', color: '#383838', letterSpacing: '0.04em', marginBottom: '14px', fontFamily: 'monospace' }}>
        {crmId}
      </div>

      {/* AVATAR + NAME + ACTIONS */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #1c1c1c', marginBottom: '16px' }}>
        <div style={{
          width: '52px', height: '52px', borderRadius: '50%', fontSize: '18px', fontWeight: 600,
          background: avatarStyle.bg, color: avatarStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {firstLetter}
        </div>
        <div style={{ marginTop: '10px', fontSize: '15px', fontWeight: 600, color: '#f8f8f8', textAlign: 'center' }}>
          {lead?.firstName} {lead?.lastName}
        </div>
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
          <button style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#171717', border: '1px solid #2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={e => {e.currentTarget.style.background='#232323'; e.currentTarget.style.borderColor='#388AE5'}} onMouseLeave={e => {e.currentTarget.style.background='#171717'; e.currentTarget.style.borderColor='#2b2b2b'}}>
            <Phone size={13} color="#30a66d" />
          </button>
          <button style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#171717', border: '1px solid #2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={e => {e.currentTarget.style.background='#232323'; e.currentTarget.style.borderColor='#388AE5'}} onMouseLeave={e => {e.currentTarget.style.background='#171717'; e.currentTarget.style.borderColor='#2b2b2b'}}>
            <Mail size={13} color="#5aaef2" />
          </button>
          <button style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#171717', border: '1px solid #2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={e => {e.currentTarget.style.background='#232323'; e.currentTarget.style.borderColor='#388AE5'}} onMouseLeave={e => {e.currentTarget.style.background='#171717'; e.currentTarget.style.borderColor='#2b2b2b'}}>
            <MessageCircle size={13} color="#25D366" />
          </button>
          <button style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#171717', border: '1px solid #2b2b2b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onMouseEnter={e => {e.currentTarget.style.background='#232323'; e.currentTarget.style.borderColor='#388AE5'}} onMouseLeave={e => {e.currentTarget.style.background='#171717'; e.currentTarget.style.borderColor='#2b2b2b'}}>
            <LinkIcon size={13} color="#7c7c7c" />
          </button>
        </div>
      </div>

      {/* SECTIONS */}
      {/* Details Section */}
      <div style={{ marginBottom: '4px' }}>
        <div onClick={() => setDetailsOpen(!detailsOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 4px', cursor: 'pointer', borderRadius: '5px' }} onMouseEnter={e => e.currentTarget.style.background = '#171717'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {detailsOpen ? <ChevronDown size={12} color="#383838" /> : <ChevronRight size={12} color="#383838" />}
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#424242', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Details</span>
        </div>
        <div style={{ padding: '4px 0 8px 18px', transition: 'max-height 0.2s ease', overflow: 'hidden', maxHeight: detailsOpen ? '1000px' : '0' }}>
          {renderField('Project', lead?.organization, 'organization')}
          {renderField('Website', lead?.website, 'website', 'url')}
          {renderField('Industry', lead?.industry, 'industry', 'select', ['Real Estate', 'Construction', 'Finance', 'Healthcare', 'Technology', 'Education', 'Other'])}
          {renderField('Job Title', lead?.jobTitle, 'jobTitle')}
          {renderField('Source', lead?.leadSource, 'leadSource', 'select', ['Walk-in', '99acres', 'MagicBricks', 'Housing.com', 'Instagram', 'Facebook', 'WhatsApp', 'Referral', 'Cold Call', 'Other'])}
          {renderField('Lead Owner', lead?.assignedTo, 'assignedTo')}
        </div>
      </div>

      {/* Person Section */}
      <div style={{ marginBottom: '4px' }}>
        <div onClick={() => setPersonOpen(!personOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 4px', cursor: 'pointer', borderRadius: '5px' }} onMouseEnter={e => e.currentTarget.style.background = '#171717'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {personOpen ? <ChevronDown size={12} color="#383838" /> : <ChevronRight size={12} color="#383838" />}
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#424242', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Person</span>
        </div>
        <div style={{ padding: '4px 0 8px 18px', transition: 'max-height 0.2s ease', overflow: 'hidden', maxHeight: personOpen ? '1000px' : '0' }}>
          {renderField('Salutation', lead?.salutation, 'salutation', 'select', ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'])}
          {renderField('First Name', lead?.firstName, 'firstName')}
          {renderField('Last Name', lead?.lastName, 'lastName')}
          {renderField('Email', lead?.email, 'email', 'email')}
          {renderField('Mobile No', lead?.mobileNo, 'mobileNo', 'tel')}
        </div>
      </div>

      {/* More Details Section */}
      <div style={{ marginBottom: '4px' }}>
        <div onClick={() => setMoreOpen(!moreOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 4px', cursor: 'pointer', borderRadius: '5px' }} onMouseEnter={e => e.currentTarget.style.background = '#171717'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {moreOpen ? <ChevronDown size={12} color="#383838" /> : <ChevronRight size={12} color="#383838" />}
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#424242', textTransform: 'uppercase', letterSpacing: '0.06em' }}>More Details</span>
        </div>
        <div style={{ padding: '4px 0 8px 18px', transition: 'max-height 0.2s ease', overflow: 'hidden', maxHeight: moreOpen ? '1000px' : '0' }}>
          {renderField('Territory', lead?.territory, 'territory')}
          {renderField('Budget Range', lead?.budgetRange, 'budgetRange')}
          {renderField('Property Type', lead?.propertyType, 'propertyType', 'select', ['Flat', 'Villa', 'Plot', 'Commercial', 'Penthouse'])}
          {renderField('Preferred Area', lead?.preferredArea, 'preferredArea')}
          {renderField('Follow Up Date', lead?.followUpDate, 'followUpDate', 'date')}
          {renderField('Priority', lead?.priority, 'priority', 'select', ['Low', 'Medium', 'High', 'Urgent'])}
          {renderField('Notes', lead?.notes, 'notes', 'textarea')}
        </div>
      </div>

    </div>
  );
}
