import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAutomations } from '../../../context/AutomationsContext';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

export default function AutomationLogs() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logs, fetchLogs } = useAutomations();

  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedLogId, setExpandedLogId] = useState(null);

  useEffect(() => {
    fetchLogs(id || null);
  }, [id, fetchLogs]);

  const filteredLogs = logs.filter((log) => {
    if (filterStatus === 'all') return true;
    return log.status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f8fafc', color: '#0f172a' }}>
      {/* PAGE HEADER */}
      <div style={{ height: '48px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/crm/automations')}
            style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            <ArrowLeft size={18} />
          </button>
          <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} color="#9333ea" /> Execution Logs
          </div>
        </div>

        <button
          onClick={() => fetchLogs(id || null)}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: '500' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* TOOLBAR */}
      <div style={{ height: '44px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['all', 'success', 'partial', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                background: filterStatus === status ? '#e2e8f0' : '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                color: filterStatus === status ? '#0f172a' : '#64748b',
                cursor: 'pointer',
                fontWeight: filterStatus === status ? '600' : '400',
                textTransform: 'capitalize'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        <span style={{ fontSize: '12px', color: '#64748b' }}>{filteredLogs.length} Log entries</span>
      </div>

      {/* CONTENT LIST */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {filteredLogs.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '10px', padding: '20px', textAlign: 'center' }}>
            <FileText size={40} color="#cbd5e1" strokeWidth={1.5} />
            <div style={{ fontSize: '14px', color: '#64748b', marginTop: '12px' }}>No execution logs recorded</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredLogs.map((log) => {
              const isExpanded = expandedLogId === log.id;
              const steps = log.stepsExecuted || [];

              const statusStyle =
                log.status === 'success'
                  ? { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0', icon: CheckCircle2 }
                  : log.status === 'partial'
                  ? { bg: '#fffbeb', color: '#d97706', border: '#fef3c7', icon: AlertCircle }
                  : { bg: '#fee2e2', color: '#dc2626', border: '#fecaca', icon: XCircle };

              const StatusIcon = statusStyle.icon;

              return (
                <div
                  key={log.id}
                  style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  <div
                    onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <StatusIcon size={18} color={statusStyle.color} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                            {log.Automation?.name || 'Automation #' + log.automationId}
                          </span>
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', padding: '2px 6px', background: '#faf5ff', color: '#9333ea', borderRadius: '4px', border: '1px solid #e9d5ff' }}>
                            {log.triggerEvent}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          Target Lead ID: {log.leadId || 'N/A'} • {new Date(log.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}`, textTransform: 'capitalize' }}>
                        {log.status}
                      </span>
                      {isExpanded ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {log.errorMessage && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '8px 12px', fontSize: '12px', color: '#dc2626' }}>
                          <strong>Error:</strong> {log.errorMessage}
                        </div>
                      )}

                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                        Executed Steps Breakdown
                      </div>

                      {steps.length === 0 ? (
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No steps executed.</div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '12px' }}>
                          {steps.map((st, i) => (
                            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ color: '#64748b' }}>Step {i + 1}:</span>
                                <span style={{ color: '#9333ea', fontWeight: '600' }}>{st.step_type}</span>
                                <span style={{ color: '#475569' }}>— {st.detail}</span>
                              </div>
                              <span style={{ fontSize: '10px', fontWeight: '600', padding: '2px 6px', borderRadius: '4px', background: st.status === 'success' ? '#dcfce7' : '#fee2e2', color: st.status === 'success' ? '#15803d' : '#dc2626', border: st.status === 'success' ? '1px solid #bbf7d0' : '1px solid #fecaca' }}>
                                {st.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
