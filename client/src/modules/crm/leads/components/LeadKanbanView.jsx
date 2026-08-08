import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Folder, Mail, Phone, AtSign, FileText, CheckCircle2, MessageCircle, Trash2, X
} from 'lucide-react';
import {
  DEFAULT_LEAD_STATUSES,
  COLOR_OPTIONS,
  getStoredLeadStatuses,
  saveStoredLeadStatuses,
  mapLeadStatusToColumn
} from '../../../../utils/leadStatuses';

export { DEFAULT_LEAD_STATUSES as KANBAN_STATUSES, mapLeadStatusToColumn };

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

    if (diffMins < 60) return `${Math.max(1, diffMins)} minutes ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
  } catch {
    return 'Recently';
  }
};

export default function LeadKanbanView({ leads, updateLead, onAddLeadWithStatus }) {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState(getStoredLeadStatuses());
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  useEffect(() => {
    const handleUpdate = () => {
      setStatuses(getStoredLeadStatuses());
    };
    window.addEventListener('crm_lead_statuses_updated', handleUpdate);
    return () => window.removeEventListener('crm_lead_statuses_updated', handleUpdate);
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    updateLead(draggableId, { status: newStatus });
  };

  const handleCreateColumn = () => {
    if (!newStatusName.trim()) return;
    const name = newStatusName.trim();
    if (statuses.some(s => s.id.toLowerCase() === name.toLowerCase())) {
      alert('A status column with this name already exists!');
      return;
    }

    const newCol = {
      id: name,
      label: name,
      color: selectedColor.color,
      dotColor: selectedColor.dotColor,
      isCustom: true,
    };

    const updated = [...statuses, newCol];
    setStatuses(updated);
    saveStoredLeadStatuses(updated);

    setNewStatusName('');
    setShowAddColumnModal(false);
  };

  const handleDeleteColumn = (statusId) => {
    if (DEFAULT_LEAD_STATUSES.some(d => d.id === statusId)) {
      alert('Built-in default status columns cannot be deleted.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove the status column "${statusId}"?`)) {
      const updated = statuses.filter(s => s.id !== statusId);
      setStatuses(updated);
      saveStoredLeadStatuses(updated);
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
          background: '#f8fafc',
          alignItems: 'flex-start',
        }}
      >
        {statuses.map((column) => {
          const columnLeads = leads.filter(
            (lead) => mapLeadStatusToColumn(lead.status, statuses) === column.id
          );

          const isDefault = DEFAULT_LEAD_STATUSES.some(d => d.id === column.id);

          return (
            <div
              key={column.id}
              style={{
                width: '300px',
                minWidth: '300px',
                background: '#f1f5f9',
                borderRadius: '10px',
                border: '1px solid #e2e8f0',
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
                  borderBottom: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  borderTopLeftRadius: '10px',
                  borderTopRightRadius: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: column.dotColor || '#64748b',
                    }}
                  />
                  <span style={{ fontSize: '13.5px', fontWeight: '600', color: '#0f172a' }}>
                    {column.label}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#475569',
                      background: '#e2e8f0',
                      padding: '1px 7px',
                      borderRadius: '10px',
                    }}
                  >
                    {columnLeads.length}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {!isDefault && (
                    <button
                      onClick={() => handleDeleteColumn(column.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        borderRadius: '4px',
                      }}
                      title={`Delete column ${column.label}`}
                    >
                      <Trash2 size={13} color="#dc2626" />
                    </button>
                  )}
                  <button
                    onClick={() => onAddLeadWithStatus(column.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px',
                      borderRadius: '4px',
                      transition: 'all 0.15s',
                    }}
                    title={`Add lead to ${column.label}`}
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
                      background: snapshot.isDraggingOver ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {columnLeads.map((lead, index) => {
                      const nameAvatar = getAvatarStyle(lead.firstName || lead.lastName);
                      const fullName = `${lead.salutation ? lead.salutation + ' ' : ''}${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Unnamed';
                      const ownerAvatar = getAvatarStyle(lead.leadOwner || lead.assignedTo || 'A');

                      return (
                        <Draggable key={lead.id} draggableId={String(lead.id)} index={index}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              onClick={() => navigate(`/crm/leads/${lead.id}`)}
                              style={{
                                background: dragSnapshot.isDragging ? '#ffffff' : '#ffffff',
                                border: dragSnapshot.isDragging
                                  ? '1px solid #2563eb'
                                  : '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                marginBottom: '10px',
                                cursor: 'pointer',
                                boxShadow: dragSnapshot.isDragging
                                  ? '0 12px 28px rgba(0,0,0,0.15)'
                                  : '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease',
                                userSelect: 'none',
                                ...dragProvided.draggableProps.style,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                <div
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: nameAvatar.bg,
                                    color: nameAvatar.color,
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  {nameAvatar.char}
                                </div>
                                <div
                                  style={{
                                    fontSize: '13.5px',
                                    fontWeight: '600',
                                    color: '#0f172a',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {fullName}
                                </div>
                              </div>

                              {lead.organization && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', marginBottom: '6px' }}>
                                  <Folder size={13} color="#64748b" />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {lead.organization}
                                  </span>
                                </div>
                              )}

                              {lead.email && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2563eb', marginBottom: '6px' }}>
                                  <Mail size={13} color="#3b82f6" />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {lead.email}
                                  </span>
                                </div>
                              )}

                              {(lead.mobileNo || lead.mobile) && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                                  <Phone size={13} color="#64748b" />
                                  <span>{lead.mobileNo || lead.mobile}</span>
                                </div>
                              )}

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingTop: '8px',
                                  borderTop: '1px solid #f1f5f9',
                                  fontSize: '11px',
                                  color: '#94a3b8',
                                  marginBottom: '8px',
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <div
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '50%',
                                      background: ownerAvatar.bg,
                                      color: ownerAvatar.color,
                                      fontSize: '9px',
                                      fontWeight: '600',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    {ownerAvatar.char}
                                  </div>
                                  <span style={{ color: '#475569', fontSize: '11.5px' }}>
                                    {lead.leadOwner || lead.assignedTo || 'Admin User'}
                                  </span>
                                </div>
                                <span>{formatRelativeTime(lead.createdOn || lead.createdAt)}</span>
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingTop: '6px',
                                  color: '#64748b',
                                }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <AtSign
                                    size={13}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => lead.email && window.open(`mailto:${lead.email}`)}
                                    title="Send Email"
                                  />
                                  <FileText size={13} style={{ cursor: 'pointer' }} title="Notes" />
                                  <CheckCircle2 size={13} style={{ cursor: 'pointer' }} title="Tasks" />
                                  <MessageCircle
                                    size={13}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                      const num = (lead.mobileNo || lead.mobile)?.replace(/\D/g, '');
                                      if (num) window.open(`https://wa.me/${num}`, '_blank');
                                    }}
                                    title="WhatsApp Chat"
                                  />
                                </div>
                                <Plus
                                  size={13}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => navigate(`/crm/leads/${lead.id}`)}
                                  title="Quick View Details"
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

        {/* ADD COLUMN BUTTON */}
        <div
          onClick={() => setShowAddColumnModal(true)}
          style={{
            width: '240px',
            minWidth: '240px',
            background: '#ffffff',
            border: '2px dashed #cbd5e1',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '13.5px',
            fontWeight: '600',
            color: '#2563eb',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.background = '#eff6ff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.background = '#ffffff';
          }}
        >
          <Plus size={16} /> Add Status Column
        </div>
      </div>

      {/* ADD COLUMN MODAL */}
      {showAddColumnModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', width: '100%', maxWidth: '420px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>Add Custom Status Column</span>
              <button onClick={() => setShowAddColumnModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>Status Column Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Site Visit Scheduled, Proposal Sent, Negotiation"
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#0f172a', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>Column Badge Color</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {COLOR_OPTIONS.map((c) => (
                    <div
                      key={c.label}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: c.dotColor,
                        cursor: 'pointer',
                        border: selectedColor.label === c.label ? '2px solid #0f172a' : '2px solid transparent',
                        boxShadow: selectedColor.label === c.label ? '0 0 0 2px #ffffff' : 'none'
                      }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
              <button
                onClick={() => setShowAddColumnModal(false)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateColumn}
                style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}
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
