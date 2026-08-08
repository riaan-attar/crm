import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Link as LinkIcon, ChevronDown, ChevronRight, Handshake, Building2, Plus } from 'lucide-react';
import { useLeads } from '../../../../context/LeadsContext';

const avatarColors = [
  { bg: '#2b2b2b', color: '#f8f8f8' },
  { bg: '#388AE5', color: '#ffffff' },
  { bg: '#30a66d', color: '#ffffff' },
  { bg: '#e79913', color: '#ffffff' },
  { bg: '#5aaef2', color: '#ffffff' }
];

export default function DealRightPanel({ deal, isEditing, onUpdate }) {
  const navigate = useNavigate();
  const { leads } = useLeads();
  
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [propertyOpen, setPropertyOpen] = useState(true);
  const [contactsOpen, setContactsOpen] = useState(true);
  const [orgOpen, setOrgOpen] = useState(false);

  const num = deal?.id?.split('-')[1] || '0001';
  const crmId = `CRM-DEAL-2026-${num.padStart(5, '0')}`;

  const linkedLead = leads.find(l => l.id === deal?.linkedLeadId);
  const firstLetter = linkedLead?.firstName ? linkedLead.firstName.charAt(0).toUpperCase() : 'U';
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
                style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px 8px', fontSize: '12px', color: '#f8f8f8', width: '100%', outline: 'none' }}
              >
                <option value="">—</option>
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : type === 'textarea' ? (
              <textarea
                value={value || ''}
                onChange={e => onUpdate(field, e.target.value)}
                rows={3}
                style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px 8px', fontSize: '12px', color: '#f8f8f8', width: '100%', resize: 'none', outline: 'none' }}
              />
            ) : (
              <input
                type={type}
                value={value || ''}
                onChange={e => onUpdate(field, e.target.value)}
                placeholder={type === 'text' && field === 'budgetRange' ? '50L - 1Cr' : ''}
                style={{ background: '#171717', border: '1px solid #2b2b2b', borderRadius: '5px', padding: '4px 8px', fontSize: '12px', color: '#f8f8f8', width: '100%', outline: 'none' }}
              />
            )
          ) : (
            value ? <span>{value}</span> : <span style={{ color: '#383838', fontStyle: 'italic' }}>—</span>
          )}
        </div>
      </div>
    );
  };

  const getProgress = (stage) => {
    switch (stage) {
      case 'Qualification': return { pct: 20, color: '#7c7c7c' };
      case 'Demo': return { pct: 35, color: '#5aaef2' };
      case 'Proposal': return { pct: 55, color: '#e79913' };
      case 'Negotiation': return { pct: 75, color: '#9c45e3' };
      case 'Ready to Close': return { pct: 90, color: '#30a66d' };
      case 'Won': return { pct: 100, color: '#28a745' };
      case 'Lost': return { pct: 100, color: '#e03636' };
      default: return { pct: 0, color: '#7c7c7c' };
    }
  };

  const progress = getProgress(deal?.stage || 'Qualification');
  const won = deal?.status === 'Won';

  return (
    <div style={{ width: '320px', minWidth: '320px', height: '100%', overflowY: 'auto', background: '#0a0a0a', flexShrink: 0, padding: '16px' }}>
      
      {/* DEAL ID */}
      <div style={{ fontSize: '11px', color: '#383838', letterSpacing: '0.04em', marginBottom: '14px', fontFamily: 'monospace' }}>
        {crmId}
      </div>

      {/* DEAL ICON + TITLE */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #1c1c1c', marginBottom: '16px' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '10px', background: '#0e2037', border: '1px solid #1a3a5c',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
        }}>
          <Handshake size={22} color="#5aaef2" />
        </div>
        <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: 600, color: '#f8f8f8', textAlign: 'center', lineHeight: 1.4 }}>
          {deal?.title}
        </div>
        <div style={{ fontSize: '12px', color: '#7c7c7c', textAlign: 'center', marginTop: '3px' }}>
          {deal?.party}
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

      {/* DEAL AMOUNT */}
      <div style={{ marginTop: '16px', textAlign: 'center', padding: '14px', background: 'var(--surface-gray-1)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Deal Value</div>
        {isEditing ? (
          <input
            type="number"
            value={deal?.amount || ''}
            onChange={e => onUpdate('amount', e.target.value)}
            style={{ marginTop: '6px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '5px', padding: '6px 8px', fontSize: '14px', color: 'var(--text-color)', width: '100px', textAlign: 'center', outline: 'none' }}
          />
        ) : (
          <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--heading-color)', marginTop: '4px' }}>
            {deal?.amount ? `₹${Number(deal.amount).toLocaleString('en-IN')}` : '₹0'}
          </div>
        )}
        {won && <div style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px', fontWeight: 500 }}>Won on {deal?.closeDate}</div>}
      </div>

      {/* STAGE PROGRESS BAR */}
      <div style={{ marginBottom: '16px', padding: '0 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 500 }}>
          <span>Qualification</span>
          <span>Close</span>
        </div>
        <div style={{ height: '4px', background: 'var(--surface-gray-3)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${progress.pct}%`, height: '100%', background: progress.color, transition: 'all 0.4s ease' }} />
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
          {renderField('Deal Owner', deal?.assignedTo, 'assignedTo')}
          {renderField('Source', deal?.source, 'source', 'select', ['Walk-in', '99acres', 'MagicBricks', 'Housing.com', 'Instagram', 'Referral', 'Other'])}
          {renderField('Close Date', deal?.expectedCloseDate, 'expectedCloseDate', 'date')}
          {renderField('Territory', deal?.preferredArea, 'preferredArea')}
        </div>
      </div>

      {/* Property Section */}
      <div style={{ marginBottom: '4px' }}>
        <div onClick={() => setPropertyOpen(!propertyOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 4px', cursor: 'pointer', borderRadius: '5px' }} onMouseEnter={e => e.currentTarget.style.background = '#171717'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {propertyOpen ? <ChevronDown size={12} color="#383838" /> : <ChevronRight size={12} color="#383838" />}
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#424242', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Property</span>
        </div>
        <div style={{ padding: '4px 0 8px 18px', transition: 'max-height 0.2s ease', overflow: 'hidden', maxHeight: propertyOpen ? '1000px' : '0' }}>
          {renderField('Property Type', deal?.propertyType, 'propertyType', 'select', ['Flat', 'Villa', 'Plot', 'Commercial', 'Penthouse'])}
          {renderField('Configuration', deal?.configuration, 'configuration', 'select', ['1BHK', '2BHK', '3BHK', '4BHK', 'Villa', 'Penthouse', 'Plot'])}
          {renderField('Preferred Area', deal?.preferredArea, 'preferredArea')}
          {renderField('Budget Range', deal?.budgetRange, 'budgetRange')}
          {renderField('Priority', deal?.priority, 'priority', 'select', ['Low', 'Medium', 'High', 'Urgent'])}
        </div>
      </div>

      {/* Contacts Section */}
      <div style={{ marginBottom: '4px' }}>
        <div onClick={() => setContactsOpen(!contactsOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 4px', cursor: 'pointer', borderRadius: '5px' }} onMouseEnter={e => e.currentTarget.style.background = '#171717'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {contactsOpen ? <ChevronDown size={12} color="#383838" /> : <ChevronRight size={12} color="#383838" />}
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#424242', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Contacts</span>
        </div>
        <div style={{ padding: '4px 0 8px 18px', transition: 'max-height 0.2s ease', overflow: 'hidden', maxHeight: contactsOpen ? '1000px' : '0' }}>
          {linkedLead ? (
            <div
              onClick={() => navigate(`/crm/leads/${linkedLead.id}`)}
              style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '6px', padding: '8px 10px', display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#388AE5'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1c1c1c'}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: avatarStyle.bg, color: avatarStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
                {firstLetter}
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#f8f8f8' }}>{linkedLead.firstName} {linkedLead.lastName}</div>
                <div style={{ fontSize: '11px', color: '#5aaef2' }}>{linkedLead.email}</div>
                <div style={{ fontSize: '11px', color: '#7c7c7c' }}>{linkedLead.mobileNo}</div>
              </div>
            </div>
          ) : (
            <button style={{ background: 'transparent', border: '1px dashed #2b2b2b', borderRadius: '6px', padding: '6px 12px', width: '100%', fontSize: '12px', color: '#383838', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer' }} onMouseEnter={e => {e.currentTarget.style.borderColor='#388AE5'; e.currentTarget.style.color='#5aaef2'}} onMouseLeave={e => {e.currentTarget.style.borderColor='#2b2b2b'; e.currentTarget.style.color='#383838'}}>
              <Plus size={11} /> Add Contact
            </button>
          )}
        </div>
      </div>

      {/* Project Section */}
      <div style={{ marginBottom: '4px' }}>
        <div onClick={() => setOrgOpen(!orgOpen)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 4px', cursor: 'pointer', borderRadius: '5px' }} onMouseEnter={e => e.currentTarget.style.background = '#171717'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          {orgOpen ? <ChevronDown size={12} color="#383838" /> : <ChevronRight size={12} color="#383838" />}
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#424242', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Project</span>
        </div>
        <div style={{ padding: '4px 0 8px 18px', transition: 'max-height 0.2s ease', overflow: 'hidden', maxHeight: orgOpen ? '1000px' : '0' }}>
          {deal?.organization && (
            <div style={{ background: '#171717', border: '1px solid #1c1c1c', borderRadius: '6px', padding: '8px 10px', display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '12px' }}>
              <Building2 size={14} color="#5aaef2" />
              <div style={{ fontSize: '12px', color: '#f8f8f8' }}>{deal.organization}</div>
            </div>
          )}
          {renderField('Project', deal?.organization, 'organization')}
          {renderField('Website', deal?.website, 'website')}
        </div>
      </div>

    </div>
  );
}
