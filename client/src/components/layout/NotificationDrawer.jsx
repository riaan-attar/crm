import React, { useState, useEffect } from 'react';
import { X, Bell, Info, ShieldAlert, CheckCircle2, UserPlus, Award } from 'lucide-react';
import { useLeads } from '../../context/LeadsContext';
import { useOpportunities } from '../../context/OpportunitiesContext';
import { useTasks } from '../../context/TasksContext';
import { socket } from '../../utils/socket';

// Helper to format relative time
const formatRelativeTime = (date) => {
  if (!date) return 'Some time ago';
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${diffDay}d ago`;
};

// Helper to parse dates from various formats
const getRecordDate = (item) => {
  if (!item) return null;
  if (item.createdOn) {
    if (typeof item.createdOn === 'string' && item.createdOn.includes('/')) {
      const parts = item.createdOn.split('/');
      const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      if (!isNaN(d.getTime())) return d;
    }
    const d = new Date(item.createdOn);
    if (!isNaN(d.getTime())) return d;
  }
  if (item.createdAt) {
    const d = new Date(item.createdAt);
    if (!isNaN(d.getTime())) return d;
  }
  return null;
};

export default function NotificationDrawer({ isOpen, onClose }) {
  const leadsContext = useLeads();
  const oppsContext = useOpportunities();
  const tasksContext = useTasks();

  const safeLeads = leadsContext && Array.isArray(leadsContext.leads) ? leadsContext.leads : [];
  const safeOpps = oppsContext && Array.isArray(oppsContext.opportunities) ? oppsContext.opportunities : [];
  const safeTasks = tasksContext && Array.isArray(tasksContext.tasks) ? tasksContext.tasks : [];

  const [realtimeNotifications, setRealtimeNotifications] = useState([]);
  const [readIds, setReadIds] = useState(new Set());

  // Listen to WebSocket real-time updates
  useEffect(() => {
    const handleCrmUpdate = (update) => {
      const { model, action, data } = update;
      let newNotif = null;
      const now = new Date();

      if (model === 'lead' && action === 'create') {
        newNotif = {
          id: `realtime-lead-create-${data.id}-${now.getTime()}`,
          title: 'New Lead Created',
          message: `Lead ${data.firstName} ${data.lastName || ''} has just been created.`,
          date: now,
          icon: <UserPlus size={15} color="#388AE5" />
        };
      } else if (model === 'opp' && action === 'create') {
        newNotif = {
          id: `realtime-opp-create-${data.id}-${now.getTime()}`,
          title: 'New Opportunity Created',
          message: `Opportunity "${data.title}" has just been created.`,
          date: now,
          icon: <Info size={15} color="#a352cc" />
        };
      } else if (model === 'opp' && action === 'update' && data.status === 'Won') {
        newNotif = {
          id: `realtime-opp-won-${data.id}-${now.getTime()}`,
          title: 'Deal Won! 🎉',
          message: `Deal "${data.title}" was marked as WON.`,
          date: now,
          icon: <Award size={15} color="#28a745" />
        };
      } else if (model === 'task' && action === 'create') {
        newNotif = {
          id: `realtime-task-create-${data.id}-${now.getTime()}`,
          title: 'New Task Assigned',
          message: `Task "${data.title}" has been created.`,
          date: now,
          icon: <ShieldAlert size={15} color="#fd7e14" />
        };
      }

      if (newNotif) {
        setRealtimeNotifications(prev => [newNotif, ...prev]);
      }
    };

    socket.on('crm:update', handleCrmUpdate);
    return () => {
      socket.off('crm:update', handleCrmUpdate);
    };
  }, []);

  if (!isOpen) return null;

  // Derive historical notifications
  const derivedNotifications = [];

  safeLeads.forEach(l => {
    const date = getRecordDate(l);
    if (date) {
      derivedNotifications.push({
        id: `lead-create-${l.id}`,
        title: 'New Lead Created',
        message: `Lead ${l.firstName} ${l.lastName || ''} from ${l.organization || 'Individual'} was added.`,
        date,
        icon: <UserPlus size={15} color="#388AE5" />
      });
    }
  });

  safeOpps.forEach(o => {
    const date = getRecordDate(o);
    if (date) {
      derivedNotifications.push({
        id: `opp-create-${o.id}`,
        title: 'New Opportunity',
        message: `Opportunity "${o.title}" for ₹${(o.amount / 100000).toFixed(1)}L was created.`,
        date,
        icon: <Info size={15} color="#a352cc" />
      });

      if (o.status === 'Won') {
        derivedNotifications.push({
          id: `opp-won-${o.id}`,
          title: 'Deal Won! 🎉',
          message: `Closed Deal "${o.title}" successfully! Value: ₹${(o.amount / 100000).toFixed(1)}L.`,
          date,
          icon: <Award size={15} color="#28a745" />
        });
      }
    }
  });

  safeTasks.forEach(t => {
    const date = getRecordDate(t);
    if (date) {
      derivedNotifications.push({
        id: `task-create-${t.id}`,
        title: t.done ? 'Task Completed' : 'Task Assigned',
        message: `${t.title} ${t.priority ? `(${t.priority} priority)` : ''}`,
        date,
        icon: t.done ? <CheckCircle2 size={15} color="#28a745" /> : <ShieldAlert size={15} color="#fd7e14" />
      });
    }
  });

  // Combine and sort by date desc
  const allNotifications = [...realtimeNotifications, ...derivedNotifications]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 25);

  const unreadCount = allNotifications.filter(n => !readIds.has(n.id)).length;

  const handleMarkAsRead = (id) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleMarkAllAsRead = () => {
    const allIds = allNotifications.map(n => n.id);
    setReadIds(new Set(allIds));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 100,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '400px',
          background: 'var(--bg-color)',
          borderLeft: '1px solid var(--border-color)',
          zIndex: 101,
          boxShadow: '-4px 0 15px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Bell size={18} color="var(--heading-color)" />
             <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--heading-color)' }}>Notifications</h2>
             {unreadCount > 0 && (
               <span style={{ background: '#e03636', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '10px' }}>
                 {unreadCount} New
               </span>
             )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllAsRead} 
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontSize: '12px', 
                  color: 'var(--brand-color, #a352cc)',
                  fontWeight: 500,
                }}
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '4px' }}>
              <X size={18} color="var(--text-muted)" />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {allNotifications.length === 0 ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%', 
              color: 'var(--text-muted)',
              gap: '12px',
              padding: '40px',
              textAlign: 'center'
            }}>
              <Bell size={32} strokeWidth={1} style={{ opacity: 0.4 }} />
              <p style={{ margin: 0, fontSize: '14px' }}>All caught up! No notifications.</p>
            </div>
          ) : (
            allNotifications.map(n => {
              const isRead = readIds.has(n.id);
              return (
                 <div 
                    key={n.id} 
                    onClick={() => handleMarkAsRead(n.id)}
                    style={{ 
                      padding: '14px', 
                      background: 'var(--surface-gray-1, #141414)', 
                      borderRadius: '8px', 
                      border: '1px solid var(--border-color, #222)',
                      cursor: 'pointer',
                      transition: 'background 0.2s, border-color 0.2s',
                      backgroundColor: isRead ? 'transparent' : 'rgba(163, 82, 204, 0.04)',
                      borderColor: isRead ? 'var(--border-color, #222)' : 'rgba(163, 82, 204, 0.25)',
                    }}
                 >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ 
                        marginTop: '2px', 
                        padding: '6px', 
                        borderRadius: '6px', 
                        background: 'rgba(255,255,255,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {n.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '8px' }}>
                          <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--text-color, #f8f8f8)', fontWeight: 600 }}>
                            {n.title}
                          </p>
                          {!isRead && (
                            <div style={{ 
                              width: '6px', 
                              height: '6px', 
                              borderRadius: '50%', 
                              background: '#a352cc',
                              marginTop: '6px',
                              boxShadow: '0 0 8px #a352cc',
                            }} />
                          )}
                        </div>
                        <p style={{ margin: '0 0 6px 0', fontSize: '12.5px', color: 'var(--text-muted, #7c7c7c)', lineHeight: '1.4' }}>
                          {n.message}
                        </p>
                        <span style={{ fontSize: '11px', color: 'var(--text-light, #5c5c5c)' }}>
                          {formatRelativeTime(n.date)}
                        </span>
                      </div>
                    </div>
                 </div>
              );
            })
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}
