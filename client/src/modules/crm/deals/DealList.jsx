import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpportunities } from '../../../context/OpportunitiesContext';
import AddDealModal from './AddDealModal';
import DealKanbanView from './components/DealKanbanView';
import {
  Plus, LayoutList, ChevronDown, MoreHorizontal, RefreshCw,
  SlidersHorizontal, ArrowUpDown, Columns, Handshake, Kanban, Search
} from 'lucide-react';

export default function DealList() {
  const { opportunities, addOpportunity, updateOpportunity } = useOpportunities();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalInitialStage, setModalInitialStage] = useState('Qualification');
  const [selectedRows, setSelectedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = (formData) => {
    addOpportunity({
      ...formData,
      id: `OPP-${String(opportunities.length + 1).padStart(4, '0')}`,
      createdOn: new Date().toLocaleDateString('en-IN'),
      stage: formData.stage || modalInitialStage || 'Qualification',
      status: formData.status || 'Open',
    });
  };

  const handleOpenModalWithStage = (stage = 'Qualification') => {
    setModalInitialStage(stage);
    setShowModal(true);
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredDeals.length && filteredDeals.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredDeals.map(o => o.id));
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

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Open': return { bg: '#e0f2fe', color: '#0369a1', dot: '#0284c7' };
      case 'Won': return { bg: '#dcfce7', color: '#15803d', dot: '#16a34a' };
      case 'Lost': return { bg: '#fee2e2', color: '#b91c1c', dot: '#dc2626' };
      case 'Replied': return { bg: '#fef3c7', color: '#b45309', dot: '#d97706' };
      default: return { bg: '#f1f5f9', color: '#475569', dot: '#64748b' };
    }
  };

  const getStageStyle = (stage) => {
    switch (stage) {
      case 'Qualification': return { bg: '#f1f5f9', color: '#475569' };
      case 'Demo': return { bg: '#e0f2fe', color: '#0369a1' };
      case 'Proposal': return { bg: '#fef3c7', color: '#b45309' };
      case 'Negotiation': return { bg: '#f3e8ff', color: '#7e22ce' };
      case 'Ready to Close': return { bg: '#d1fae5', color: '#047857' };
      case 'Won': return { bg: '#dcfce7', color: '#15803d' };
      case 'Lost': return { bg: '#fee2e2', color: '#b91c1c' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  const filteredDeals = opportunities.filter(deal => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      deal.title?.toLowerCase().includes(term) ||
      deal.party?.toLowerCase().includes(term) ||
      deal.stage?.toLowerCase().includes(term) ||
      deal.status?.toLowerCase().includes(term)
    );
  });

  const tableGridTemplate = '40px 240px 180px 140px 140px 140px 140px 140px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff', overflow: 'hidden' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Deals</span>
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
                  minWidth: '140px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                }}
              >
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
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => handleOpenModalWithStage('Qualification')}
          style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', transition: 'background 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
        >
          <Plus size={14} color="#ffffff" /> Create
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={{ height: '40px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowViewMenu(!showViewMenu)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
            >
              {viewMode === 'kanban' ? <Kanban size={13} /> : <LayoutList size={13} />}
              {viewMode === 'kanban' ? 'Kanban View' : 'List View'}
              <ChevronDown size={11} color="#64748b" />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 8px', height: '26px' }}>
            <Search size={13} color="#64748b" style={{ marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#0f172a', fontSize: '12px', outline: 'none', width: '140px' }}
            />
          </div>
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={e => e.currentTarget.style.color = '#0f172a'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
            <RefreshCw size={14} color="currentColor" />
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <SlidersHorizontal size={13} /> Filter
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <ArrowUpDown size={13} /> Sort
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <Columns size={13} /> Columns
          </button>
        </div>
      </div>

      {/* VIEW CONTAINER */}
      {viewMode === 'kanban' ? (
        <DealKanbanView
          opportunities={filteredDeals}
          updateOpportunity={updateOpportunity}
          onAddDealWithStage={handleOpenModalWithStage}
        />
      ) : filteredDeals.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Handshake size={48} color="#cbd5e1" strokeWidth={1} />
          <div style={{ fontSize: '14px', color: '#64748b', marginTop: '12px', marginBottom: '16px' }}>No deals found</div>
          <button 
            onClick={() => handleOpenModalWithStage('Qualification')}
            style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}
          >
            + Create your first Deal
          </button>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', background: '#ffffff' }}>
          {/* HEADER ROW */}
          <div style={{ height: '36px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 10, display: 'grid', gridTemplateColumns: tableGridTemplate }}>
            <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
              <input 
                type="checkbox" 
                checked={selectedRows.length === filteredDeals.length && filteredDeals.length > 0} 
                onChange={toggleAll}
                style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #cbd5e1', background: 'transparent', cursor: 'pointer', accentColor: '#2563eb' }}
              />
            </div>
            {['Title', 'Party', 'Deal From', 'Stage', 'Status', 'Amount', 'Created On'].map(col => (
              <div key={col} style={{ padding: '0 12px', fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.color = '#0f172a'} onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                {col}
              </div>
            ))}
          </div>

          {/* ROWS */}
          {filteredDeals.map(deal => {
            const isSelected = selectedRows.includes(deal.id);
            const isHovered = hoveredRow === deal.id;
            const statusStyle = getStatusStyle(deal.status);
            const stageStyle = getStageStyle(deal.stage);
            
            return (
              <div 
                key={deal.id}
                onClick={() => navigate(`/crm/deals/${deal.id}`)}
                onMouseEnter={() => setHoveredRow(deal.id)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{ display: 'grid', gridTemplateColumns: tableGridTemplate, height: '48px', borderBottom: '1px solid #e2e8f0', alignItems: 'center', cursor: 'pointer', background: isHovered || isSelected ? '#f8fafc' : 'transparent', transition: 'background 0.1s', position: 'relative' }}
              >
                <div style={{ padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px' }}>
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => toggleRow(e, deal.id)}
                    onClick={(e) => e.stopPropagation()}
                    style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid #cbd5e1', cursor: 'pointer', accentColor: '#2563eb' }}
                  />
                </div>
                
                <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#dbeafe', border: '1px solid #bfdbfe' }}>
                    <Handshake size={12} color="#1d4ed8" />
                  </div>
                  <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {deal.title || 'Untitled Deal'}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.party || '—'}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.opportunityFrom || '—'}
                </div>

                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500', background: stageStyle.bg, color: stageStyle.color }}>
                    {deal.stage || 'Qualification'}
                  </div>
                </div>

                <div style={{ padding: '0 12px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '500', background: statusStyle.bg, color: statusStyle.color }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.dot }}></div>
                    {deal.status || 'Open'}
                  </div>
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#0f172a', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.amount ? `₹${Number(deal.amount).toLocaleString('en-IN')}` : '—'}
                </div>

                <div style={{ padding: '0 12px', fontSize: '13px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {deal.createdOn || '—'}
                </div>

                {/* ROW HOVER ACTIONS */}
                {isHovered && (
                  <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '0 12px', height: '100%' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/crm/deals/${deal.id}`); }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '5px', padding: '4px 8px', fontSize: '11px', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#ffffff'; }}
                    >
                      View Deal
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddDealModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        initialStage={modalInitialStage}
      />
    </div>
  );
}
