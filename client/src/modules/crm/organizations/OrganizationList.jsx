import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganizations } from '../../../context/OrganizationsContext';
import AddOrganizationModal from './AddOrganizationModal';
import {
  Plus, LayoutList, ChevronDown, MoreHorizontal, RefreshCw,
  SlidersHorizontal, ArrowUpDown, Columns, Folder, Phone, Mail, Globe
} from 'lucide-react';

export default function OrganizationList() {
  const { organizations, addOrganization } = useOrganizations();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  const handleSave = (formData) => {
    addOrganization({
      ...formData,
      id: `PRJ-${String(organizations.length + 1).padStart(4, '0')}`,
      linkedContacts: [],
      linkedDeals: [],
      createdOn: new Date().toLocaleDateString('en-IN'),
    });
  };

  const toggleAll = () => {
    if (selectedRows.length === organizations.length && organizations.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(organizations.map(o => o.id));
    }
  };

  const toggleRow = (e, id) => {
    e.stopPropagation();
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rId => rId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const tableGridTemplate = '40px 250px 200px 150px 150px 120px 150px 120px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Projects</div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ background: '#0f172a', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
          onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
        >
          <Plus size={14} color="#ffffff" /> Create
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={{ height: '40px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <LayoutList size={13} /> List View <ChevronDown size={11} color="#64748b" />
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <MoreHorizontal size={13} color="#64748b" />
          </button>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.color = '#0f172a'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <RefreshCw size={14} color="currentColor" />
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <SlidersHorizontal size={13} /> Filter
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <ArrowUpDown size={13} /> Sort
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <Columns size={13} /> Columns
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <MoreHorizontal size={13} color="#64748b" />
          </button>
        </div>
      </div>

      {/* TABLE */}
      {organizations.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, background: '#f8fafc' }}>
          <Folder size={48} color="#cbd5e1" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '12px', marginBottom: '16px' }}>No projects yet</div>
          <button 
            onClick={() => setShowModal(true)}
            style={{ background: '#0f172a', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}
          >
            + Create your first Project
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
          {/* HEADER ROW */}
          <div style={{ height: '36px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: tableGridTemplate }}>
            <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
              <input 
                type="checkbox" 
                checked={selectedRows.length === organizations.length && organizations.length > 0} 
                onChange={toggleAll}
                style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #cbd5e1', background: 'transparent', cursor: 'pointer', accentColor: '#2563eb' }}
              />
            </div>
            {['Project Name', 'Website', 'Industry', 'Territory', 'No of Employees', 'Phone', 'Created On'].map(col => (
              <div key={col} style={{ padding: '0 12px', fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#0f172a'} onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                {col}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {organizations.map(org => {
            const isSelected = selectedRows.includes(org.id);
            const isHovered = hoveredRow === org.id;
            
            return (
              <div 
                key={org.id}
                onClick={() => navigate(`/crm/projects/${org.id}`)}
                onMouseEnter={() => setHoveredRow(org.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ display: 'grid', gridTemplateColumns: tableGridTemplate, height: '48px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', cursor: 'pointer', background: isSelected ? '#eff6ff' : isHovered ? '#f8fafc' : '#ffffff', transition: 'background 0.1s', position: 'relative' }}
              >
                <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => toggleRow(e, org.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #cbd5e1', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>
                
                {/* Name */}
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '5px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    <Folder size={12} color="#64748b" />
                  </div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {org.name}
                  </div>
                </div>

                {/* Website */}
                <div 
                  style={{ padding: '0 12px', fontSize: '13px', color: '#2563eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); if (org.website) window.open(org.website, '_blank'); }}
                >
                  {org.website || '—'}
                </div>

                {/* Industry */}
                <div style={{ padding: '0 12px' }}>
                  {org.industry ? (
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', whiteSpace: 'nowrap' }}>
                      {org.industry}
                    </span>
                  ) : '—'}
                </div>

                {/* Territory */}
                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {org.territory || '—'}
                </div>

                {/* No of Employees */}
                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {org.noOfEmployees || '—'}
                </div>

                {/* Phone */}
                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {org.phone || '—'}
                </div>

                {/* Created On */}
                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {org.createdOn || '—'}
                </div>

                {/* ROW HOVER ACTIONS */}
                {isHovered && (
                  <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '0 12px', height: '100%', boxShadow: '-6px 0 12px rgba(0,0,0,0.05)' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (org.phone) window.open(`tel:${org.phone}`); }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                    >
                      <Phone size={13} color="#16a34a" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (org.email) window.open(`mailto:${org.email}`); }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                    >
                      <Mail size={13} color="#2563eb" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (org.website) window.open(org.website, '_blank'); }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                    >
                      <Globe size={13} color="#d97706" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddOrganizationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
}
