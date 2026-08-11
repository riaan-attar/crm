/**
 * AddDealModal — client/src/modules/crm/deals/AddDealModal.jsx
 */
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { getStoredDealStages } from '../../../utils/dealStages';

const DEAL_FROM_OPTIONS = ['Lead', 'Customer', 'Prospect', 'Existing Client'];
const STATUS_OPTIONS = ['Open', 'Replied', 'Interested', 'Won', 'Lost', 'Do Not Contact'];
const PROPERTY_OPTIONS = ['Flat', 'Villa', 'Plot', 'Commercial', 'Penthouse'];

const INITIAL_FORM = {
  title: '',
  opportunityFrom: 'Lead',
  party: '',
  status: 'Open',
  stage: 'Qualification',
  amount: '',
  propertyType: '',
  expectedCloseDate: '',
  notes: '',
};

/* ─── Shared styles ─────────────────────────────────────────── */
const inputStyle = {
  width: '100%',
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '6px',
  padding: '7px 11px',
  fontSize: '13px',
  color: '#0f172a',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '500',
  color: '#475569',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '5px',
};

function FieldGroup({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function FocusInput({ as: Tag = 'input', style: extraStyle, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <Tag
      {...props}
      style={{
        ...inputStyle,
        ...extraStyle,
        borderColor: focused ? '#2563eb' : '#cbd5e1',
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function AddDealModal({ isOpen, onClose, onSave, initialStage = 'Qualification' }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const overlayRef = useRef(null);
  const stageOptions = getStoredDealStages();

  useEffect(() => {
    if (isOpen) {
      setForm({
        ...INITIAL_FORM,
        stage: initialStage || 'Qualification',
      });
    }
  }, [isOpen, initialStage]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleOverlayClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleSave() {
    onSave(form);
    onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(2px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          width: '500px',
          maxWidth: '94vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '22px',
          }}
        >
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
            New Deal
          </span>
          <button
            onClick={onClose}
            title="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '2px',
              color: '#64748b',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0f172a')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <FieldGroup label="Title">
            <FocusInput
              type="text"
              name="title"
              placeholder="e.g. 2BHK at Gangapur Road"
              value={form.title}
              onChange={handleChange}
            />
          </FieldGroup>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Deal From">
              <FocusInput
                as="select"
                name="opportunityFrom"
                value={form.opportunityFrom}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                {DEAL_FROM_OPTIONS.map(opt => (
                  <option key={opt} value={opt} style={{ background: '#ffffff', color: '#0f172a' }}>
                    {opt}
                  </option>
                ))}
              </FocusInput>
            </FieldGroup>
            <FieldGroup label="Party">
              <FocusInput
                type="text"
                name="party"
                placeholder="Name of lead or customer"
                value={form.party}
                onChange={handleChange}
              />
            </FieldGroup>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Stage">
              <FocusInput
                as="select"
                name="stage"
                value={form.stage}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                {stageOptions.map(opt => (
                  <option key={opt.id} value={opt.id} style={{ background: '#ffffff', color: '#0f172a' }}>
                    {opt.label}
                  </option>
                ))}
              </FocusInput>
            </FieldGroup>
            <FieldGroup label="Status">
              <FocusInput
                as="select"
                name="status"
                value={form.status}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt} value={opt} style={{ background: '#ffffff', color: '#0f172a' }}>
                    {opt}
                  </option>
                ))}
              </FocusInput>
            </FieldGroup>
            <FieldGroup label="Amount (₹)">
              <FocusInput
                type="number"
                name="amount"
                placeholder="Value in ₹"
                value={form.amount}
                onChange={handleChange}
              />
            </FieldGroup>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <FieldGroup label="Property Type">
              <FocusInput
                as="select"
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
              >
                <option value="" style={{ background: '#ffffff', color: '#0f172a' }}>Select…</option>
                {PROPERTY_OPTIONS.map(opt => (
                  <option key={opt} value={opt} style={{ background: '#ffffff', color: '#0f172a' }}>
                    {opt}
                  </option>
                ))}
              </FocusInput>
            </FieldGroup>
            <FieldGroup label="Expected Close Date">
              <FocusInput
                type="date"
                name="expectedCloseDate"
                value={form.expectedCloseDate}
                onChange={handleChange}
              />
            </FieldGroup>
          </div>

          <FieldGroup label="Notes">
            <FocusInput
              as="textarea"
              name="notes"
              placeholder="Additional information…"
              value={form.notes}
              onChange={handleChange}
              style={{ height: '70px', resize: 'vertical' }}
            />
          </FieldGroup>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '7px 16px',
              fontSize: '13px',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#2563eb',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 18px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#ffffff',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
            onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
          >
            Save Deal
          </button>
        </div>
      </div>
    </div>
  );
}
