import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeads } from '../../../context/LeadsContext';
import AddLeadModal from './AddLeadModal';
import FilterPanel from './FilterPanel';
import LeadKanbanView from './components/LeadKanbanView';
import {
  Plus, LayoutList, ChevronDown, RefreshCw,
  SlidersHorizontal, Users, Phone, Mail, MessageCircle, Kanban
} from 'lucide-react';

/* ─── SUGGESTION INPUT COMPONENT WITH STICKY CLEAR BUTTON ─── */
function SuggestInput({ placeholder, value, onChange, options, width = '135px' }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matchingOptions = value && value !== 'All'
    ? options.filter(opt => opt.toLowerCase().includes(value.toLowerCase()))
    : options;

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width }}>
      <input
        type="text"
        placeholder={placeholder}
        value={value === 'All' ? '' : value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        style={{
          background: '#ffffff',
          border: `1px solid ${isOpen ? '#2563eb' : '#cbd5e1'}`,
          borderRadius: '6px',
          padding: '5px 10px',
          fontSize: '12px',
          color: '#0f172a',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
      />
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '220px',
            overflow: 'hidden',
          }}
        >
          {/* STICKY CLEAR FILTER BUTTON AT THE TOP */}
          <div
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
            style={{
              padding: '6px 12px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: '#dc2626',
              background: '#fef2f2',
              borderBottom: '1px solid #fee2e2',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 2,
              userSelect: 'none',
              transition: 'background 0.1s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#fef2f2'}
          >
            <span>Clear filter</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold' }}>✕</span>
          </div>

          {/* SCROLLABLE SUGGESTION LIST */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '2px 0' }}>
            {matchingOptions.length === 0 ? (
              <div style={{ padding: '8px 12px', fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>
                No suggestions
              </div>
            ) : (
              matchingOptions.slice(0, 10).map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    color: '#0f172a',
                    fontWeight: 400,
                    cursor: 'pointer',
                    transition: 'background 0.1s',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.color = '#2563eb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#0f172a';
                  }}
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadList() {
  const { leads, addLead, updateLead } = useLeads();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban'); // 'list' | 'kanban'
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalInitialStatus, setModalInitialStatus] = useState('New');
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Quick filter states
  const [fullNameFilter, setFullNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [organizationFilter, setOrganizationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const [selectedRows, setSelectedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  // Suggestions for Full Name, Email, Project, Status, Source
  const fullNameOptions = Array.from(new Set(
    leads.flatMap(l => {
      const fullWithSalutation = `${l.salutation ? l.salutation + ' ' : ''}${l.firstName || ''} ${l.lastName || ''}`.trim();
      const plainFull = `${l.firstName || ''} ${l.lastName || ''}`.trim();
      return [fullWithSalutation, plainFull];
    }).filter(Boolean)
  ));

  const emailOptions = Array.from(new Set(
    leads.map(l => l.email).filter(Boolean)
  ));

  const projectOptions = Array.from(new Set(
    leads.map(l => l.organization).filter(Boolean)
  ));

  const statusOptions = ['New', 'Contacted', 'Nurture', 'Qualified', 'Unqualified', 'Junk', 'Converted'];

  const sourceOptions = Array.from(new Set(
    leads.flatMap(l => [l.leadSource, l.source])
      .concat(['Walk-in', '99acres', 'MagicBricks', 'Housing.com', 'Google Ads', 'Meta Ads', 'Instagram', 'Facebook', 'WhatsApp', 'Referral', 'Cold Call'])
      .filter(Boolean)
  ));

  const handleSave = (formData) => {
    addLead({
      ...formData,
      id: `LEAD-${String(leads.length + 1).padStart(4, '0')}`,
      createdOn: new Date().toLocaleDateString('en-IN'),
    });
  };

  const handleOpenModalWithStatus = (status = 'New') => {
    setModalInitialStatus(status);
    setShowModal(true);
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredLeads.length && filteredLeads.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredLeads.map(l => l.id));
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

  const getAvatarStyle = (nameStr) => {
    if (!nameStr) return { bg: '#e2e8f0', color: '#475569', char: '?' };
    const char = nameStr.charAt(0).toUpperCase();
    if (/[A-E]/.test(char)) return { bg: '#dbeafe', color: '#1d4ed8', char };
    if (/[F-J]/.test(char)) return { bg: '#dcfce7', color: '#15803d', char };
    if (/[K-O]/.test(char)) return { bg: '#fef3c7', color: '#b45309', char };
    if (/[P-T]/.test(char)) return { bg: '#f3e8ff', color: '#7e22ce', char };
    if (/[U-Z]/.test(char)) return { bg: '#fee2e2', color: '#b91c1c', char };
    return { bg: '#e2e8f0', color: '#475569', char };
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New': return { bg: '#f1f5f9', color: '#475569', dot: '#64748b' };
      case 'Contacted': return { bg: '#e0f2fe', color: '#0369a1', dot: '#0284c7' };
      case 'Nurture':
      case 'Nurturing': return { bg: '#dcfce7', color: '#15803d', dot: '#16a34a' };
      case 'Qualified': return { bg: '#fef3c7', color: '#b45309', dot: '#d97706' };
      case 'Unqualified': return { bg: '#fee2e2', color: '#b91c1c', dot: '#dc2626' };
      case 'Junk': return { bg: '#f1f5f9', color: '#475569', dot: '#475569' };
      case 'Converted': return { bg: '#f3e8ff', color: '#7e22ce', dot: '#9333ea' };
      default: return { bg: '#f1f5f9', color: '#475569', dot: '#64748b' };
    }
  };

  // Filter leads based on user inputs
  const filteredLeads = leads.filter((lead) => {
    const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
    const fullNameWithSal = `${lead.salutation ? lead.salutation + ' ' : ''}${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
    
    if (fullNameFilter && !fullName.includes(fullNameFilter.toLowerCase()) && !fullNameWithSal.includes(fullNameFilter.toLowerCase())) return false;
    if (emailFilter && !lead.email?.toLowerCase().includes(emailFilter.toLowerCase())) return false;
    if (organizationFilter && !lead.organization?.toLowerCase().includes(organizationFilter.toLowerCase())) return false;
    if (statusFilter && statusFilter !== 'All') {
      if (statusFilter === 'Nurture' && (lead.status === 'Nurture' || lead.status === 'Nurturing')) {
        // match
      } else if (lead.status !== statusFilter) {
        return false;
      }
    }
    if (sourceFilter && !(lead.leadSource || lead.source)?.toLowerCase().includes(sourceFilter.toLowerCase())) return false;
    return true;
  });

  const tableGridTemplate = '40px 200px 180px 120px 120px 160px 180px 140px 140px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', overflow: 'hidden' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Leads</span>
          <span style={{ fontSize: '14px', color: '#cbd5e1' }}>/</span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0f172a'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
            >
              {viewMode === 'kanban' ? 'Kanban' : 'List'} <ChevronDown size={13} />
            </button>
            {showViewMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '4px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '4px',
                  zIndex: 100,
                  minWidth: '130px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                }}
              >
                <div
                  onClick={() => {
                    setViewMode('list');
                    setShowViewMenu(false);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    color: viewMode === 'list' ? '#2563eb' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    background: viewMode === 'list' ? '#eff6ff' : 'transparent',
                    fontWeight: viewMode === 'list' ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== 'list') e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'list') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <LayoutList size={13} /> List View
                </div>
                <div
                  onClick={() => {
                    setViewMode('kanban');
                    setShowViewMenu(false);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '4px',
                    fontSize: '12.5px',
                    color: viewMode === 'kanban' ? '#2563eb' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    background: viewMode === 'kanban' ? '#eff6ff' : 'transparent',
                    fontWeight: viewMode === 'kanban' ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (viewMode !== 'kanban') e.currentTarget.style.background = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (viewMode !== 'kanban') e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Kanban size={13} /> Kanban View
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => handleOpenModalWithStatus('New')}
          style={{ background: '#0f172a', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
          onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
        >
          <Plus size={14} color="#ffffff" /> Create
        </button>
      </div>

      {/* FILTER & CONTROL BAR (WITH AUTOCOMPLETE SUGGESTIONS + STICKY CLEAR FILTER BUTTON) */}
      <div style={{ minHeight: '44px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '6px 20px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', flexShrink: 0 }}>
        
        {/* FULL NAME SUGGEST INPUT */}
        <SuggestInput
          placeholder="Full Name"
          value={fullNameFilter}
          onChange={setFullNameFilter}
          options={fullNameOptions}
          width="135px"
        />

        {/* EMAIL SUGGEST INPUT */}
        <SuggestInput
          placeholder="Email"
          value={emailFilter}
          onChange={setEmailFilter}
          options={emailOptions}
          width="135px"
        />

        {/* PROJECT SUGGEST INPUT */}
        <SuggestInput
          placeholder="Project"
          value={organizationFilter}
          onChange={setOrganizationFilter}
          options={projectOptions}
          width="135px"
        />

        {/* STATUS SUGGEST INPUT */}
        <SuggestInput
          placeholder="Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
          width="135px"
        />

        {/* SOURCE SUGGEST INPUT */}
        <SuggestInput
          placeholder="Source"
          value={sourceFilter}
          onChange={setSourceFilter}
          options={sourceOptions}
          width="135px"
        />

        {/* RIGHT ACTION BUTTONS */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              setFullNameFilter('');
              setEmailFilter('');
              setOrganizationFilter('');
              setStatusFilter('');
              setSourceFilter('');
            }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
            onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
            title="Reset All Filters"
          >
            <RefreshCw size={14} color="currentColor" />
          </button>
          
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="filter-bar-filter-btn"
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
            onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
          >
            <SlidersHorizontal size={13} /> Filter
          </button>

          {/* VIEW SWITCHER BUTTON */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setViewMode(viewMode === 'list' ? 'kanban' : 'list')}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#334155', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = '#ffffff'}
            >
              {viewMode === 'kanban' ? <Kanban size={13} /> : <LayoutList size={13} />}
              {viewMode === 'kanban' ? 'Kanban View' : 'List View'}
            </button>
          </div>
        </div>
      </div>

      <FilterPanel isOpen={showFilterPanel} onClose={() => setShowFilterPanel(false)} />

      {/* VIEW CONTENT */}
      {viewMode === 'kanban' ? (
        <LeadKanbanView
          leads={filteredLeads}
          updateLead={updateLead}
          onAddLeadWithStatus={handleOpenModalWithStatus}
        />
      ) : filteredLeads.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, background: '#f8fafc' }}>
          <Users size={48} color="#cbd5e1" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '12px', marginBottom: '16px' }}>No leads found</div>
          <button 
            onClick={() => handleOpenModalWithStatus('New')}
            style={{ background: '#0f172a', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}
          >
            + Create your first Lead
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
          {/* HEADER ROW */}
          <div style={{ height: '36px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: tableGridTemplate }}>
            <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
              <input 
                type="checkbox" 
                checked={selectedRows.length === filteredLeads.length && filteredLeads.length > 0} 
                onChange={toggleAll}
                style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #cbd5e1', background: 'transparent', cursor: 'pointer', accentColor: '#2563eb' }}
              />
            </div>
            {['Name', 'Project', 'Status', 'Source', 'Job Title', 'Email', 'Mobile No', 'Assigned To'].map(col => (
              <div key={col} style={{ padding: '0 12px', fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#0f172a'} onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                {col}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {filteredLeads.map(lead => {
            const isSelected = selectedRows.includes(lead.id);
            const isHovered = hoveredRow === lead.id;
            const nameAvatar = getAvatarStyle(lead.firstName || lead.lastName);
            const fullName = `${lead.salutation ? lead.salutation + ' ' : ''}${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unnamed';
            const statusStyle = getStatusStyle(lead.status);
            const assignedToAvatar = getAvatarStyle(lead.leadOwner || 'A');
            
            return (
              <div 
                key={lead.id}
                onClick={() => navigate(`/crm/leads/${lead.id}`)}
                onMouseEnter={() => setHoveredRow(lead.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ display: 'grid', gridTemplateColumns: tableGridTemplate, height: '48px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', cursor: 'pointer', background: isSelected ? '#eff6ff' : isHovered ? '#f8fafc' : '#ffffff', transition: 'background 0.1s', position: 'relative' }}
              >
                <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => toggleRow(e, lead.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #cbd5e1', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>
                
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0, fontSize: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', background: nameAvatar.bg, color: nameAvatar.color }}>
                    {nameAvatar.char}
                  </div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fullName}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.organization || '—'}
                </div>

                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '600', background: statusStyle.bg, color: statusStyle.color }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.dot }}></div>
                    {lead.status || 'New'}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.leadSource || lead.source || '—'}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.jobTitle || '—'}
                </div>

                <div 
                  style={{ padding: '0 12px', fontSize: '13px', color: '#2563eb', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); if (lead.email) window.open(`mailto:${lead.email}`); }}
                >
                  {lead.email || '—'}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.mobileNo || lead.mobile || '—'}
                </div>

                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, fontSize: '9px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', background: assignedToAvatar.bg, color: assignedToAvatar.color }}>
                    {assignedToAvatar.char}
                  </div>
                  <div style={{ fontSize: '12px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {lead.leadOwner || lead.assignedTo || 'Admin User'}
                  </div>
                </div>

                {/* ROW HOVER ACTIONS */}
                {isHovered && (
                  <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', padding: '0 12px', height: '100%', boxShadow: '-6px 0 12px rgba(0,0,0,0.05)' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (lead.mobileNo || lead.mobile) window.open(`tel:${lead.mobileNo || lead.mobile}`); }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                    >
                      <Phone size={13} color="#16a34a" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); if (lead.email) window.open(`mailto:${lead.email}`); }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                    >
                      <Mail size={13} color="#2563eb" />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        const num = (lead.mobileNo || lead.mobile)?.replace(/\D/g,'');
                        if (num) window.open(`https://wa.me/${num}`, '_blank');
                      }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                    >
                      <MessageCircle size={13} color="#25D366" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddLeadModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialStatus={modalInitialStatus}
      />
    </div>
  );
}
