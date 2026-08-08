import React, { useState } from 'react';
import { X } from 'lucide-react';

import { getStoredLeadStatuses } from '../../../utils/leadStatuses';

const SALUTATION_OPTIONS = ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'];
const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const EMPLOYEES_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
const TERRITORY_OPTIONS = ['Nashik', 'Pune', 'Mumbai', 'Nagpur', 'Aurangabad', 'India', 'Other'];
const INDUSTRY_OPTIONS = ['Real Estate', 'Construction', 'Finance', 'Healthcare', 'Technology', 'Manufacturing', 'Education', 'Retail', 'Other'];

export default function AddLeadModal({ isOpen, onClose, onSave, initialStatus = 'New' }) {
  const [form, setForm] = useState({
    salutation: 'Mr',
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    gender: 'Male',
    organization: '',
    website: '',
    noOfEmployees: '',
    territory: 'Nashik',
    annualRevenue: '',
    industry: '',
    status: initialStatus || 'New',
    leadOwner: 'Admin User',
    leadSource: '',
  });

  const [focusedField, setFocusedField] = useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setForm(prev => ({ ...prev, status: initialStatus || 'New' }));
    }
  }, [isOpen, initialStatus]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const handleCreate = () => {
    if (!form.firstName.trim()) {
      alert('First Name is required');
      return;
    }
    onSave(form);
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return '#7c7c7c';
      case 'Contacted': return '#5aaef2';
      case 'Nurture': return '#30a66d';
      case 'Qualified': return '#e79913';
      case 'Unqualified': return '#e03636';
      case 'Junk': return '#6b7280';
      case 'Converted': return '#c084fc';
      default: return '#7c7c7c';
    }
  };
  
  const getAvatarColor = (nameStr) => {
    if (!nameStr) return { bg: '#0e2037', color: '#5aaef2', char: '?' };
    const char = nameStr.charAt(0).toUpperCase();
    if (/[A-E]/.test(char)) return { bg: '#0e2037', color: '#5aaef2', char };
    if (/[F-J]/.test(char)) return { bg: '#0b2e1c', color: '#30a66d', char };
    if (/[K-O]/.test(char)) return { bg: '#371e06', color: '#e79913', char };
    if (/[P-T]/.test(char)) return { bg: '#2d1a4a', color: '#9c45e3', char };
    if (/[U-Z]/.test(char)) return { bg: '#361515', color: '#e03636', char };
    return { bg: '#232323', color: '#afafaf', char };
  };

  const renderField = (label, name, type, placeholder, options = null, required = false, isSelect = false, colSpan = 1, prefix = null) => {
    const isFocused = focusedField === name;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: `span ${colSpan}` }}>
        <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '400' }}>
          {label}{required && <span style={{ color: '#e03636', marginLeft: '2px' }}>*</span>}
        </div>
        <div style={{ position: 'relative', width: '100%' }}>
          {prefix && (
            <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              {prefix}
            </div>
          )}
          {isSelect ? (
            <select
              value={form[name]}
              onChange={(e) => handleChange(name, e.target.value)}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: `1px solid ${isFocused ? '#388AE5' : '#e5e7eb'}`,
                borderRadius: '6px',
                padding: `7px 10px 7px ${prefix ? '26px' : '10px'}`,
                fontSize: '13px',
                color: '#111111',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
                boxShadow: isFocused ? '0 0 0 2px rgba(56,138,229,0.1)' : 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                paddingRight: '28px',
              }}
            >
              <option value="" disabled>Select {label}</option>
              {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          ) : (
            <input
              type={type}
              placeholder={placeholder}
              value={form[name]}
              onChange={(e) => handleChange(name, e.target.value)}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                background: '#ffffff',
                border: `1px solid ${isFocused ? '#388AE5' : '#e5e7eb'}`,
                borderRadius: '6px',
                padding: `7px 10px 7px ${prefix ? '26px' : '10px'}`,
                fontSize: '13px',
                color: '#111111',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
                boxShadow: isFocused ? '0 0 0 2px rgba(56,138,229,0.1)' : 'none',
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#ffffff', borderRadius: '10px', width: '740px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '28px 32px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#111111' }}>Create Lead</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', display: 'flex', alignItems: 'center' }} onMouseEnter={e => e.currentTarget.style.color = '#111'} onMouseLeave={e => e.currentTarget.style.color = '#999'}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px 20px' }}>
          {/* Row 1 */}
          {renderField('Salutation', 'salutation', 'text', '', SALUTATION_OPTIONS, false, true)}
          {renderField('First Name', 'firstName', 'text', 'John', null, true)}
          {renderField('Last Name', 'lastName', 'text', 'Doe')}
          
          {/* Row 2 */}
          {renderField('Email', 'email', 'email', 'john@doe.com')}
          {renderField('Mobile No', 'mobileNo', 'tel', '+91 9876543210')}
          {renderField('Gender', 'gender', 'text', '', GENDER_OPTIONS, false, true)}
          
          {/* Row 3 */}
          {renderField('Project', 'organization', 'text', 'Riverfront Towers')}
          {renderField('Website', 'website', 'url', 'https://frappe.io')}
          {renderField('No of Employees', 'noOfEmployees', 'text', '', EMPLOYEES_OPTIONS, false, true)}
          
          {/* Row 4 */}
          {renderField('Territory', 'territory', 'text', '', TERRITORY_OPTIONS, false, true)}
          {renderField('Annual Revenue', 'annualRevenue', 'number', '1000000')}
          {renderField('Industry', 'industry', 'text', '', INDUSTRY_OPTIONS, false, true)}
          
          {/* Row 5 */}
          {renderField('Status', 'status', 'text', '', getStoredLeadStatuses().map(s => s.id), false, true, 2, 
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(form.status) }}></div>
          )}
          {renderField('Lead Owner', 'leadOwner', 'text', 'Assign to...', null, false, false, 1,
            <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: getAvatarColor(form.leadOwner).bg, color: getAvatarColor(form.leadOwner).color, fontSize: '6px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {getAvatarColor(form.leadOwner).char}
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '7px 16px', fontSize: '13px', color: '#374151', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}>
            Cancel
          </button>
          <button onClick={handleCreate} style={{ background: '#111111', border: 'none', borderRadius: '6px', padding: '7px 20px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = '#000000'} onMouseLeave={e => e.currentTarget.style.background = '#111111'}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
