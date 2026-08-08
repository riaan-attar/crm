import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddOrganizationModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    industry: '',
    noOfEmployees: '',
    territory: '',
    annualRevenue: '',
    phone: '',
    email: '',
    address: '',
    description: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onSave(formData);
    onClose();
    setFormData({
      name: '', website: '', industry: '', noOfEmployees: '', territory: '', 
      annualRevenue: '', phone: '', email: '', address: '', description: '',
    });
  };

  const inputStyle = {
    width: '100%',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
      <div style={{ background: '#ffffff', borderRadius: '12px', width: '640px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#111827' }}>Create Project</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '20px', overflowY: 'auto' }}>
          <form id="add-org-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            
            {/* Row 1 */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Project Name <span style={{ color: '#ef4444' }}>*</span></label>
              <input name="name" value={formData.name} onChange={handleChange} required placeholder="Riverfront Towers" style={inputStyle} />
            </div>

            {/* Row 2 */}
            <div>
              <label style={labelStyle}>Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://example.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Industry</label>
              <select name="industry" value={formData.industry} onChange={handleChange} style={inputStyle}>
                <option value="">Select...</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Construction">Construction</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Technology">Technology</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>No of Employees</label>
              <select name="noOfEmployees" value={formData.noOfEmployees} onChange={handleChange} style={inputStyle}>
                <option value="">Select...</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1000+">1000+</option>
              </select>
            </div>

            {/* Row 3 */}
            <div>
              <label style={labelStyle}>Territory</label>
              <select name="territory" value={formData.territory} onChange={handleChange} style={inputStyle}>
                <option value="">Select...</option>
                <option value="Nashik">Nashik</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Annual Revenue</label>
              <input type="number" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} placeholder="5000000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" style={inputStyle} />
            </div>

            {/* Row 4 */}
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="info@company.com" style={inputStyle} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street, City" style={inputStyle} />
            </div>

            {/* Row 5 */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="2" style={{ ...inputStyle, resize: 'vertical' }}></textarea>
            </div>

          </form>
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#374151', cursor: 'pointer' }}>
            Cancel
          </button>
          <button type="submit" form="add-org-form" style={{ padding: '8px 16px', background: '#111827', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}>
            Create
          </button>
        </div>

      </div>
    </div>
  );
}
