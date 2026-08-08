import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrganizations } from '../../../context/OrganizationsContext';
import { ChevronRight, Folder, Phone, Mail, Globe } from 'lucide-react';

export default function OrganizationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { organizations, deleteOrganization } = useOrganizations();
  const [activeTab, setActiveTab] = useState('Activity');

  const org = organizations.find(o => o.id === id);

  if (!org) {
    return <div style={{ color: '#0f172a', padding: 20, background: '#ffffff', height: '100%' }}>Project not found</div>;
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteOrganization(id);
      navigate('/crm/projects');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#ffffff' }}>
      {/* HEADER */}
      <div style={{ height: '60px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', flexShrink: 0, background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
          <span style={{ color: '#64748b', cursor: 'pointer' }} onClick={() => navigate('/crm/projects')}>Projects</span>
          <ChevronRight size={14} color="#cbd5e1" />
          <span style={{ color: '#0f172a', fontWeight: '600' }}>{org.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={handleDelete} style={{ background: '#ffffff', border: '1px solid #fee2e2', color: '#dc2626', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
            Delete
          </button>
          <button style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
            Edit
          </button>
          <button 
            onClick={() => navigate('/crm/deals')}
            style={{ background: '#0f172a', border: 'none', color: '#ffffff', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
          >
            + New Deal
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* MAIN CONTENT (TABS) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #e2e8f0' }}>
          {/* TABS HEADER */}
          <div style={{ display: 'flex', gap: '20px', padding: '0 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            {['Activity', 'Contacts', 'Deals', 'Notes'].map(tab => (
              <div 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: '12px 0', 
                  fontSize: '13px', 
                  fontWeight: '500', 
                  color: activeTab === tab ? '#2563eb' : '#64748b',
                  borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* TABS CONTENT */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            {activeTab === 'Activity' && (
              <div style={{ color: '#64748b', fontSize: '13px' }}>Activity history will appear here.</div>
            )}
            
            {activeTab === 'Contacts' && (
              <div>
                {org.linkedContacts && org.linkedContacts.length > 0 ? (
                  org.linkedContacts.map(contactId => (
                    <div 
                      key={contactId}
                      style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                      <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#dbeafe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600' }}>C</div>
                      <div>
                        <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{contactId}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>No linked contacts.</div>
                )}
                <button style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#475569', fontSize: '13px', cursor: 'pointer' }}>
                  + Link Contact
                </button>
              </div>
            )}

            {activeTab === 'Deals' && (
              <div>
                {org.linkedDeals && org.linkedDeals.length > 0 ? (
                  org.linkedDeals.map(dealId => (
                    <div 
                      key={dealId}
                      style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#2563eb'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                    >
                      <div style={{ fontSize: '13px', color: '#0f172a', fontWeight: '500' }}>{dealId}</div>
                    </div>
                  ))
                ) : (
                  <div style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>No linked deals.</div>
                )}
                <button style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#475569', fontSize: '13px', cursor: 'pointer' }}>
                  + Link Deal
                </button>
              </div>
            )}

            {activeTab === 'Notes' && (
              <div style={{ color: '#64748b', fontSize: '13px' }}>Notes will appear here.</div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: '320px', background: '#f8fafc', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#ffffff', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Folder size={22} color="#64748b" />
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>{org.name}</div>
            {org.industry && (
              <span style={{ background: '#e2e8f0', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{org.industry}</span>
            )}
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button 
                onClick={() => { if (org.phone) window.open(`tel:${org.phone}`); }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              ><Phone size={14} color="#16a34a" /></button>
              <button 
                onClick={() => { if (org.email) window.open(`mailto:${org.email}`); }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              ><Mail size={14} color="#2563eb" /></button>
              <button 
                onClick={() => { if (org.website) window.open(org.website, '_blank'); }}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              ><Globe size={14} color="#d97706" /></button>
            </div>
          </div>

          <div style={{ padding: '20px' }}>
            {/* STATS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{org.linkedContacts?.length || 0}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Contacts</div>
              </div>
              <div style={{ flex: 1, background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{org.linkedDeals?.length || 0}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Deals</div>
              </div>
            </div>

            {/* DETAILS */}
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ChevronRight size={12} style={{ transform: 'rotate(90deg)' }}/> Details
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Website</span>
                {org.website ? <a href={org.website} target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>{org.website}</a> : <span style={{ fontSize: '13px', color: '#94a3b8' }}>—</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Industry</span>
                <span style={{ fontSize: '13px', color: '#0f172a' }}>{org.industry || '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Territory</span>
                <span style={{ fontSize: '13px', color: '#0f172a' }}>{org.territory || '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>No of Employees</span>
                <span style={{ fontSize: '13px', color: '#0f172a' }}>{org.noOfEmployees || '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Annual Revenue</span>
                <span style={{ fontSize: '13px', color: '#0f172a' }}>{org.annualRevenue ? `₹${org.annualRevenue.toLocaleString('en-IN')}` : '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Phone</span>
                <span style={{ fontSize: '13px', color: '#0f172a' }}>{org.phone || '—'}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Email</span>
                {org.email ? <a href={`mailto:${org.email}`} style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>{org.email}</a> : <span style={{ fontSize: '13px', color: '#94a3b8' }}>—</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11px', color: '#64748b' }}>Address</span>
                <span style={{ fontSize: '13px', color: '#0f172a' }}>{org.address || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
