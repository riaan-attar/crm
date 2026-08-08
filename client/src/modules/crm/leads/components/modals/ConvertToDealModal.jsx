import React, { useState } from 'react';
import { X, Building2, UserCircle } from 'lucide-react';

export default function ConvertToDealModal({ isOpen, onClose, onConvert, lead }) {
  const [chooseExistingOrg, setChooseExistingOrg] = useState(false);
  const [chooseExistingContact, setChooseExistingContact] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedContact, setSelectedContact] = useState('');

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#ffffff', borderRadius: '12px', width: '520px', maxWidth: '94vw', padding: '28px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#111111' }}>Convert to Deal</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}>
            <X size={18} color="#9ca3af" />
          </button>
        </div>

        {/* SECTION 1 - Project */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Building2 size={18} color="#9ca3af" />
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Project</div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', color: '#374151' }}>Choose Existing</div>
            <div 
              onClick={() => setChooseExistingOrg(!chooseExistingOrg)}
              style={{ width: '42px', height: '24px', borderRadius: '12px', background: chooseExistingOrg ? '#111111' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff', position: 'absolute', top: '3px', left: chooseExistingOrg ? 'calc(100% - 21px)' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
            </div>
          </div>
          
          <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>
            {!chooseExistingOrg ? "New project will be created based on the data in details section" : (
              <input 
                value={selectedOrg}
                onChange={e => setSelectedOrg(e.target.value)}
                placeholder="Search project..."
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            )}
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ borderTop: '1px solid #f3f4f6', margin: '0 0 28px 0' }}></div>

        {/* SECTION 2 - Contact */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <UserCircle size={18} color="#9ca3af" />
            <div style={{ fontSize: '15px', fontWeight: 500, color: '#374151' }}>Contact</div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontSize: '14px', color: '#374151' }}>Choose Existing</div>
            <div 
              onClick={() => setChooseExistingContact(!chooseExistingContact)}
              style={{ width: '42px', height: '24px', borderRadius: '12px', background: chooseExistingContact ? '#111111' : '#e5e7eb', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ffffff', position: 'absolute', top: '3px', left: chooseExistingContact ? 'calc(100% - 21px)' : '3px', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }}></div>
            </div>
          </div>
          
          <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>
            {!chooseExistingContact ? "New contact will be created based on the person's details" : (
              <input 
                value={selectedContact}
                onChange={e => setSelectedContact(e.target.value)}
                placeholder="Search contact..."
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            )}
          </div>
        </div>

        {/* CONVERT BUTTON */}
        <button 
          onClick={() => {
            onConvert({ chooseExistingOrg, selectedOrg, chooseExistingContact, selectedContact });
            onClose();
          }}
          style={{ width: '100%', background: '#111111', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '15px', fontWeight: 500, color: '#ffffff', cursor: 'pointer', marginTop: '8px' }}
          onMouseEnter={e => e.currentTarget.style.background = '#000000'}
          onMouseLeave={e => e.currentTarget.style.background = '#111111'}
        >
          Convert to Deal
        </button>
      </div>
    </div>
  );
}
