export const DEFAULT_LEAD_STATUSES = [
  { id: 'New', label: 'New', color: '#475569', dotColor: '#64748b' },
  { id: 'Contacted', label: 'Contacted', color: '#0369a1', dotColor: '#0284c7' },
  { id: 'Nurture', label: 'Nurture', color: '#15803d', dotColor: '#16a34a' },
  { id: 'Qualified', label: 'Qualified', color: '#b45309', dotColor: '#d97706' },
  { id: 'Unqualified', label: 'Unqualified', color: '#b91c1c', dotColor: '#dc2626' },
  { id: 'Junk', label: 'Junk', color: '#475569', dotColor: '#475569' },
  { id: 'Converted', label: 'Converted', color: '#7e22ce', dotColor: '#9333ea' },
];

export const COLOR_OPTIONS = [
  { label: 'Slate', color: '#475569', dotColor: '#64748b' },
  { label: 'Blue', color: '#0369a1', dotColor: '#0284c7' },
  { label: 'Green', color: '#15803d', dotColor: '#16a34a' },
  { label: 'Amber', color: '#b45309', dotColor: '#d97706' },
  { label: 'Red', color: '#b91c1c', dotColor: '#dc2626' },
  { label: 'Purple', color: '#7e22ce', dotColor: '#9333ea' },
  { label: 'Cyan', color: '#0e7490', dotColor: '#06b6d4' },
  { label: 'Pink', color: '#be185d', dotColor: '#ec4899' },
];

export const getStoredLeadStatuses = () => {
  try {
    const saved = localStorage.getItem('crm_lead_statuses');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading lead statuses from localStorage', e);
  }
  return DEFAULT_LEAD_STATUSES;
};

export const saveStoredLeadStatuses = (statuses) => {
  try {
    localStorage.setItem('crm_lead_statuses', JSON.stringify(statuses));
    window.dispatchEvent(new Event('crm_lead_statuses_updated'));
  } catch (e) {
    console.error('Error saving lead statuses to localStorage', e);
  }
};

export const mapLeadStatusToColumn = (status, customStatuses = null) => {
  if (!status) return 'New';
  const s = String(status).trim();
  const statuses = customStatuses || getStoredLeadStatuses();
  const found = statuses.find(item => item.id.toLowerCase() === s.toLowerCase());
  if (found) return found.id;

  // Fallbacks for legacy status mappings
  if (s === 'Nurturing' || s === 'Follow Up') return 'Nurture';
  if (s === 'Site Visit Scheduled' || s === 'Negotiation') return 'Contacted';

  return 'New';
};
