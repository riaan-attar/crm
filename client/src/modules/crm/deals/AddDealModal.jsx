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
  background: '#232323',
  border: '1px solid #343434',
  borderRadius: '6px',
  padding: '7px 11px',
  fontSize: '13px',
  color: '#f8f8f8',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '500',
  color: '#7c7c7c',
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
        borderColor: focused ? '#388AE5' : '#343434',
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
        background: 'rgba(0,0,0,0.75)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          background: '#1a1a1a',
          border: '1px solid #2b2b2b',
          borderRadius: '10px',
          width: '500px',
          maxWidth: '94vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          position: 'relative',
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
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#f8f8f8' }}>
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
              color: '#6b6b6b',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f8f8f8')}
            onMouseLeave={e => (e.currentTarget.style.color = '#6b6b6b')}
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
                  <option key={opt} value={opt} style={{ background: '#232323' }}>
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
                  <option key={opt.id} value={opt.id} style={{ background: '#232323' }}>
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
                  <option key={opt} value={opt} style={{ background: '#232323' }}>
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
                <option value="" style={{ background: '#232323' }}>Select…</option>
                {PROPERTY_OPTIONS.map(opt => (
                  <option key={opt} value={opt} style={{ background: '#232323' }}>
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
              rows={3}
              placeholder="Any relevant notes about this deal..."
              value={form.notes}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </FieldGroup>
        </div>

        <div
          style={{
            marginTop: '22px',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #343434',
              borderRadius: '6px',
              padding: '7px 16px',
              fontSize: '13px',
              color: '#afafaf',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#232323';
              e.currentTarget.style.color = '#f8f8f8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#afafaf';
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 16px',
              fontSize: '13px',
              fontWeight: '500',
              color: '#111111',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#e5e7eb')}
            onMouseLeave={e => (e.currentTarget.style.background = '#f3f4f6')}
          >
            Save Deal
          </button>
        </div>
      </div>
    </div>
  );
}
