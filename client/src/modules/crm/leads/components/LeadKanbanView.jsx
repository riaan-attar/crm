import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Folder, Mail, Phone, AtSign, FileText, CheckCircle2, MessageCircle
} from 'lucide-react';

export const KANBAN_STATUSES = [
  { id: 'New', label: 'New', color: '#475569', dotColor: '#64748b' },
  { id: 'Contacted', label: 'Contacted', color: '#0369a1', dotColor: '#0284c7' },
  { id: 'Nurture', label: 'Nurture', color: '#15803d', dotColor: '#16a34a' },
  { id: 'Qualified', label: 'Qualified', color: '#b45309', dotColor: '#d97706' },
  { id: 'Unqualified', label: 'Unqualified', color: '#b91c1c', dotColor: '#dc2626' },
  { id: 'Junk', label: 'Junk', color: '#475569', dotColor: '#475569' },
  { id: 'Converted', label: 'Converted', color: '#7e22ce', dotColor: '#9333ea' },
];

export const mapLeadStatusToColumn = (status) => {
  if (!status) return 'New';
  const s = String(status).trim();
  if (s === 'Nurturing' || s === 'Follow Up') return 'Nurture';
  if (s === 'Site Visit Scheduled' || s === 'Negotiation') return 'Contacted';
  if (KANBAN_STATUSES.some(item => item.id === s)) {
    return s;
  }
  return 'New';
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

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    updateLead(draggableId, { status: newStatus });
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
        {KANBAN_STATUSES.map((column) => {
          const columnLeads = leads.filter(
            (lead) => mapLeadStatusToColumn(lead.status) === column.id
          );

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
                      background: column.dotColor,
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#0f172a';
                    e.currentTarget.style.background = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#64748b';
                    e.currentTarget.style.background = 'transparent';
                  }}
                  title={`Add lead to ${column.label}`}
                >
                  <Plus size={15} />
                </button>
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
                              onMouseEnter={(e) => {
                                if (!dragSnapshot.isDragging) {
                                  e.currentTarget.style.borderColor = '#cbd5e1';
                                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.07)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!dragSnapshot.isDragging) {
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)';
                                }
                              }}
                            >
                              {/* TOP ROW: AVATAR & NAME */}
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

                              {/* PROJECT */}
                              {lead.organization && (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    color: '#475569',
                                    marginBottom: '6px',
                                  }}
                                >
                                  <Folder size={13} color="#64748b" />
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {lead.organization}
                                  </span>
                                </div>
                              )}

                              {/* EMAIL */}
                              {lead.email && (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    color: '#2563eb',
                                    marginBottom: '6px',
                                  }}
                                >
                                  <Mail size={13} color="#3b82f6" />
                                  <span
                                    style={{
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {lead.email}
                                  </span>
                                </div>
                              )}

                              {/* PHONE */}
                              {(lead.mobileNo || lead.mobile) && (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '12px',
                                    color: '#475569',
                                    marginBottom: '10px',
                                  }}
                                >
                                  <Phone size={13} color="#64748b" />
                                  <span>{lead.mobileNo || lead.mobile}</span>
                                </div>
                              )}

                              {/* ASSIGNED OWNER & TIME */}
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

                              {/* CARD ACTION BAR */}
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
      </div>
    </DragDropContext>
  );
}
