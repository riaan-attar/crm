import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Handshake, Mail, Phone, AtSign, FileText, CheckCircle2, MessageCircle, Trash2, Building, ArrowUpRight
} from 'lucide-react';
import {
  DEFAULT_DEAL_STAGES,
  DEAL_STAGE_COLOR_OPTIONS,
  getStoredDealStages,
  saveStoredDealStages,
  mapDealStageToColumn
} from '../../../../utils/dealStages';

export { DEFAULT_DEAL_STAGES as KANBAN_DEAL_STAGES, mapDealStageToColumn };

const getAvatarStyle = (nameStr) => {
  if (!nameStr) return { bg: '#1e293b', color: '#94a3b8', char: '?' };
  const char = nameStr.charAt(0).toUpperCase();
  if (/[A-E]/.test(char)) return { bg: '#0e2037', color: '#5aaef2', char };
  if (/[F-J]/.test(char)) return { bg: '#173b2c', color: '#28a745', char };
  if (/[K-O]/.test(char)) return { bg: '#371e06', color: '#e79913', char };
  if (/[P-T]/.test(char)) return { bg: '#2d1a4a', color: '#9c45e3', char };
  if (/[U-Z]/.test(char)) return { bg: '#361515', color: '#e03636', char };
  return { bg: '#1e293b', color: '#94a3b8', char };
};

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return 'Recently';
  try {
    const parts = String(dateStr).split('/');
    let date;
    if (parts.length === 3) {
      date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
      date = new Date(dateStr);
    }
    if (isNaN(date.getTime())) return 'Recently';
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return 'Recently';
  }
};

const formatAmount = (amt) => {
  if (!amt && amt !== 0) return null;
  const num = Number(amt);
  if (isNaN(num)) return null;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
};

export default function DealKanbanView({ opportunities = [], updateOpportunity, onAddDealWithStage }) {
  const navigate = useNavigate();
  const [stages, setStages] = useState(getStoredDealStages());
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [selectedColor, setSelectedColor] = useState(DEAL_STAGE_COLOR_OPTIONS[0]);

  useEffect(() => {
    const handleUpdate = () => {
      setStages(getStoredDealStages());
    };
    window.addEventListener('crm_deal_stages_updated', handleUpdate);
    return () => window.removeEventListener('crm_deal_stages_updated', handleUpdate);
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStage = destination.droppableId;
    const updates = { stage: newStage };

    if (newStage === 'Won') {
      updates.status = 'Won';
    } else if (newStage === 'Lost') {
      updates.status = 'Lost';
    } else {
      const currentDeal = opportunities.find(o => String(o.id) === String(draggableId));
      if (currentDeal && (currentDeal.status === 'Won' || currentDeal.status === 'Lost')) {
        updates.status = 'Open';
      }
    }

    updateOpportunity(draggableId, updates);
  };

  const handleCreateColumn = () => {
    if (!newStageName.trim()) return;
    const name = newStageName.trim();
    if (stages.some(s => s.id.toLowerCase() === name.toLowerCase())) {
      alert('A deal stage column with this name already exists!');
      return;
    }

    const newCol = {
      id: name,
      label: name,
      color: selectedColor.color,
      dotColor: selectedColor.dotColor,
      headerBg: selectedColor.headerBg || '#232323',
      bg: selectedColor.bg || '#171717',
      isCustom: true,
    };

    const updated = [...stages, newCol];
    setStages(updated);
    saveStoredDealStages(updated);

    setNewStageName('');
    setShowAddColumnModal(false);
  };

  const handleDeleteColumn = (stageId) => {
    if (DEFAULT_DEAL_STAGES.some(d => d.id === stageId)) {
      alert('Built-in default deal stage columns cannot be deleted.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove the stage column "${stageId}"?`)) {
      const updated = stages.filter(s => s.id !== stageId);
      setStages(updated);
      saveStoredDealStages(updated);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          overflowY: 'hidden',
          padding: '16px 20px',
          background: '#0a0a0a',
          alignItems: 'flex-start',
        }}
      >
        {stages.map((column) => {
          const columnDeals = opportunities.filter(
            (deal) => mapDealStageToColumn(deal.stage, stages) === column.id
          );

          const totalColumnValue = columnDeals.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
          const isDefault = DEFAULT_DEAL_STAGES.some(d => d.id === column.id);

          return (
            <div
              key={column.id}
              style={{
                width: '310px',
                minWidth: '310px',
                background: '#121212',
                borderRadius: '10px',
                border: '1px solid #1c1c1c',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '100%',
                flexShrink: 0,
              }}
            >
              {/* COLUMN HEADER */}
              <div
                style={{
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #1c1c1c',
                  background: column.headerBg || '#171717',
                  borderTopLeftRadius: '10px',
                  borderTopRightRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: column.dotColor || '#7c7c7c',
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#f8f8f8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {column.label}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#afafaf',
                      background: 'rgba(255,255,255,0.08)',
                      padding: '1px 7px',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                  >
                    {columnDeals.length}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {totalColumnValue > 0 && (
                    <span style={{ fontSize: '11px', fontWeight: '600', color: column.color || '#5aaef2' }}>
                      {formatAmount(totalColumnValue)}
                    </span>
                  )}

                  {!isDefault && (
                    <button
                      onClick={() => handleDeleteColumn(column.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#6b6b6b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        borderRadius: '4px',
                      }}
                      title={`Delete stage ${column.label}`}
                    >
                      <Trash2 size={13} color="#e03636" />
                    </button>
                  )}

                  <button
                    onClick={() => onAddDealWithStage && onAddDealWithStage(column.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#afafaf',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#f8f8f8'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#afafaf'}
                    title={`Add deal to ${column.label}`}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>

              {/* DROPPABLE CONTAINER */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      padding: '10px',
                      overflowY: 'auto',
                      flex: 1,
                      minHeight: '120px',
                      background: snapshot.isDraggingOver ? 'rgba(56, 138, 229, 0.05)' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {columnDeals.map((deal, index) => {
                      const avatarInfo = getAvatarStyle(deal.party || deal.title);
                      const formattedVal = formatAmount(deal.amount);

                      return (
                        <Draggable key={deal.id} draggableId={String(deal.id)} index={index}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              onClick={() => navigate(`/crm/deals/${deal.id}`)}
                              style={{
                                background: dragSnapshot.isDragging ? '#1a1a1a' : '#171717',
                                border: dragSnapshot.isDragging
                                  ? '1px solid #388AE5'
                                  : '1px solid #282828',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                marginBottom: '10px',
                                cursor: 'pointer',
                                boxShadow: dragSnapshot.isDragging
                                  ? '0 12px 28px rgba(0,0,0,0.5)'
                                  : '0 2px 5px rgba(0,0,0,0.2)',
                                transition: 'all 0.15s ease',
                                userSelect: 'none',
                                ...dragProvided.draggableProps.style,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#f8f8f8', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                  {deal.title || 'Untitled Deal'}
                                </div>
                                <ArrowUpRight size={14} color="#6b6b6b" style={{ flexShrink: 0, marginTop: '2px' }} />
                              </div>

                              {deal.party && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#afafaf', marginBottom: '8px' }}>
                                  <Handshake size={13} color="#5aaef2" />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {deal.party}
                                  </span>
                                </div>
                              )}

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                {formattedVal ? (
                                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#30a66d' }}>
                                    {formattedVal}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '12px', color: '#6b6b6b' }}>No amount</span>
                                )}

                                {deal.propertyType && (
                                  <span style={{ fontSize: '10.5px', fontWeight: '500', color: '#afafaf', background: '#232323', border: '1px solid #343434', padding: '1px 7px', borderRadius: '4px' }}>
                                    {deal.propertyType}
                                  </span>
                                )}
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingTop: '8px',
                                  borderTop: '1px solid #232323',
                                  fontSize: '11px',
                                  color: '#6b6b6b',
                                  marginBottom: '8px',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <div
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '50%',
                                      background: avatarInfo.bg,
                                      color: avatarInfo.color,
                                      fontSize: '9px',
                                      fontWeight: '600',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    {avatarInfo.char}
                                  </div>
                                  <span style={{ color: '#afafaf', fontSize: '11.5px' }}>
                                    {deal.assignedTo || 'Unassigned'}
                                  </span>
                                </div>
                                <span>{formatRelativeTime(deal.createdOn || deal.createdAt)}</span>
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingTop: '6px',
                                  color: '#6b6b6b',
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <AtSign
                                    size={13}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => deal.email && window.open(`mailto:${deal.email}`)}
                                    title="Send Email"
                                  />
                                  <FileText size={13} style={{ cursor: 'pointer' }} title="Notes" />
                                  <CheckCircle2 size={13} style={{ cursor: 'pointer' }} title="Tasks" />
                                  <MessageCircle
                                    size={13}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      const num = (deal.mobileNo || deal.mobile)?.replace(/\D/g, '');
                                      if (num) window.open(`https://wa.me/${num}`, '_blank');
                                    }}
                                    title="WhatsApp Chat"
                                  />
                                </div>
                                <Plus
                                  size={13}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => navigate(`/crm/deals/${deal.id}`)}
                                  title="Open Deal Details"
                                />
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}

        {/* ADD STAGE COLUMN BUTTON */}
        <div
          onClick={() => setShowAddColumnModal(true)}
          style={{
            width: '240px',
            minWidth: '240px',
            background: '#121212',
            border: '2px dashed #2b2b2b',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '13.5px',
            fontWeight: '600',
            color: '#388AE5',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#388AE5';
            e.currentTarget.style.background = '#171717';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#2b2b2b';
            e.currentTarget.style.background = '#121212';
          }}
        >
          <Plus size={16} /> Add Stage Column
        </div>
      </div>

      {/* ADD STAGE COLUMN MODAL */}
      {showAddColumnModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#1a1a1a', border: '1px solid #2b2b2b', borderRadius: '12px', width: '100%', maxWidth: '420px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2b2b2b', paddingBottom: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#f8f8f8' }}>Add Custom Stage Column</span>
              <button onClick={() => setShowAddColumnModal(false)} style={{ background: 'transparent', border: 'none', color: '#6b6b6b', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: '#afafaf', fontWeight: '500' }}>Stage Column Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Technical Review, Contract Sent, Final Review"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  style={{ background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#f8f8f8', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: '#afafaf', fontWeight: '500' }}>Column Badge Color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {DEAL_STAGE_COLOR_OPTIONS.map((c) => (
                    <div
                      key={c.label}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: c.dotColor,
                        cursor: 'pointer',
                        border: selectedColor.label === c.label ? '2px solid #ffffff' : '2px solid transparent',
                        boxShadow: selectedColor.label === c.label ? '0 0 0 2px #388AE5' : 'none'
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid #2b2b2b' }}>
              <button
                onClick={() => setShowAddColumnModal(false)}
                style={{ background: '#232323', border: '1px solid #343434', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#afafaf', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateColumn}
                style={{ background: '#388AE5', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}
              >
                Create Column
              </button>
            </div>
          </div>
        </div>
      )}
    </DragDropContext>
  );
}
