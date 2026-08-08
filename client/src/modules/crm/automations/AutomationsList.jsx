import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAutomations } from '../../../context/AutomationsContext';
import {
  Zap,
  Plus,
  Play,
  Copy,
  Trash2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  RefreshCw,
  Search,
  FileText
} from 'lucide-react';

const TRIGGER_BADGES = {
  keyword_match: { label: 'Keyword Match', bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' },
  lead_created: { label: 'Lead Created', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  stage_changed: { label: 'Stage Changed', bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
  tag_added: { label: 'Tag Added', bg: '#fffbeb', color: '#d97706', border: '#fef3c7' },
  new_message_received: { label: 'New Message', bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' },
  interactive_reply: { label: 'Interactive Reply', bg: '#faf5ff', color: '#9333ea', border: '#e9d5ff' },
};

export default function AutomationsList() {
  const navigate = useNavigate();
  const {
    automations,
    loading,
    templates,
    toggleAutomationActive,
    deleteAutomation,
    duplicateAutomation,
    fetchAutomations,
    createAutomation,
  } = useAutomations();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const filteredAutomations = automations.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActive =
      filterActive === 'all'
        ? true
        : filterActive === 'active'
        ? a.isActive
        : !a.isActive;
    return matchesSearch && matchesActive;
  });

  const handleToggle = async (e, id, currentStatus) => {
    e.stopPropagation();
    try {
      await toggleAutomationActive(id, !currentStatus);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (e, id, name) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await deleteAutomation(id);
      } catch (err) {
        alert('Failed to delete automation');
      }
    }
  };

  const handleDuplicate = async (e, id) => {
    e.stopPropagation();
    try {
      await duplicateAutomation(id);
    } catch (err) {
      alert('Failed to duplicate automation');
    }
  };

  const handleUseTemplate = async (template) => {
    try {
      const created = await createAutomation({
        name: template.name,
        description: template.description,
        triggerType: template.triggerType,
        triggerConfig: template.triggerConfig,
        isActive: false,
        steps: template.steps,
      });
      setShowTemplatesModal(false);
      navigate(`/crm/automations/${created.id}/edit`);
    } catch (err) {
      alert('Failed to create automation from template');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', color: '#0f172a' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={18} color="#9333ea" />
          <span style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Workflow Automations</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/crm/automations/logs')}
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            <Clock size={14} color="#64748b" />
            Execution Logs
          </button>

          <button
            onClick={() => setShowTemplatesModal(true)}
            style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#9333ea', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '500' }}
          >
            <Sparkles size={14} color="#9333ea" />
            Templates
          </button>

          <button
            onClick={() => navigate('/crm/automations/new')}
            style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <Plus size={15} color="#ffffff" />
            Create Automation
          </button>
        </div>
      </div>

      {/* TOOLBAR & SEARCH */}
      <div style={{ height: '44px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, maxWidth: '320px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search automations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', paddingLeft: '32px', paddingRight: '12px', paddingTop: '5px', paddingBottom: '5px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Filter:</span>
          {['all', 'active', 'inactive'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterActive(mode)}
              style={{
                background: filterActive === mode ? '#e2e8f0' : '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                color: filterActive === mode ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontWeight: filterActive === mode ? '600' : '400',
                textTransform: 'capitalize'
              }}
            >
              {mode}
            </button>
          ))}
          <button
            onClick={fetchAutomations}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px' }}
            title="Refresh"
          >
            <RefreshCw size={14} color="currentColor" />
          </button>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#64748b', gap: '10px' }}>
            <RefreshCw size={20} className="animate-spin" color="#2563eb" />
            <span style={{ fontSize: '13px' }}>Loading automations...</span>
          </div>
        ) : filteredAutomations.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <Zap size={40} color="#cbd5e1" strokeWidth={1.5} />
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginTop: '12px' }}>No Automations Found</div>
            <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', marginBottom: '20px', maxWidth: '360px' }}>
              Create a custom workflow automation or select one of our pre-configured templates.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowTemplatesModal(true)}
                style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', color: '#9333ea', fontWeight: '500', cursor: 'pointer' }}
              >
                Use Templates
              </button>
              <button
                onClick={() => navigate('/crm/automations/new')}
                style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', cursor: 'pointer' }}
              >
                Create Custom
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
            {filteredAutomations.map((automation) => {
              const badge = TRIGGER_BADGES[automation.triggerType] || { label: automation.triggerType, bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' };

              return (
                <div
                  key={automation.id}
                  onClick={() => navigate(`/crm/automations/${automation.id}/edit`)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    gap: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#2563eb';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>{automation.name}</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          flexShrink: 0
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', lineHeight: '1.4' }}>
                      {automation.description || 'No description provided.'}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#64748b' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Layers size={13} color="#94a3b8" /> {automation.stepCount || 0} Steps
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Play size={13} color="#94a3b8" /> Ran {automation.executionCount || 0}x
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                      <div
                        onClick={(e) => handleToggle(e, automation.id, automation.isActive)}
                        style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: automation.isActive ? '#dcfce7' : '#f1f5f9',
                          color: automation.isActive ? '#15803d' : '#64748b',
                          border: automation.isActive ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                          cursor: 'pointer'
                        }}
                      >
                        {automation.isActive ? 'Active' : 'Draft'}
                      </div>

                      <button
                        onClick={(e) => handleDuplicate(e, automation.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                        title="Duplicate"
                      >
                        <Copy size={13} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/crm/automations/${automation.id}/logs`);
                        }}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}
                        title="Logs"
                      >
                        <FileText size={13} />
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, automation.id, automation.name)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '4px' }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* TEMPLATES MODAL */}
      {showTemplatesModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', width: '100%', maxWidth: '640px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>
                <Sparkles size={16} color="#9333ea" />
                Automation Templates
              </div>
              <button onClick={() => setShowTemplatesModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '60vh', overflowY: 'auto' }}>
              {templates.map((tpl) => (
                <div
                  key={tpl.slug}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', justify: 'space-between', gap: '12px' }}
                >
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{tpl.name}</div>
                    <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '4px', lineHeight: '1.4' }}>{tpl.description}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                    <span style={{ fontSize: '10px', color: '#9333ea', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                      {tpl.triggerType}
                    </span>
                    <button
                      onClick={() => handleUseTemplate(tpl)}
                      style={{ background: 'transparent', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      Use <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justify: 'flex-end', paddingTop: '8px' }}>
              <button
                onClick={() => setShowTemplatesModal(false)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', color: '#334155', cursor: 'pointer', fontWeight: '500' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
