export const DEFAULT_DEAL_STAGES = [
  { id: 'Qualification', label: 'Qualification', color: '#475569', dotColor: '#64748b', headerBg: '#f8fafc', bg: '#f1f5f9' },
  { id: 'Demo', label: 'Demo', color: '#0369a1', dotColor: '#0284c7', headerBg: '#f0f9ff', bg: '#e0f2fe' },
  { id: 'Proposal', label: 'Proposal', color: '#b45309', dotColor: '#d97706', headerBg: '#fffbeb', bg: '#fef3c7' },
  { id: 'Negotiation', label: 'Negotiation', color: '#7e22ce', dotColor: '#9333ea', headerBg: '#faf5ff', bg: '#f3e8ff' },
  { id: 'Ready to Close', label: 'Ready to Close', color: '#047857', dotColor: '#059669', headerBg: '#ecfdf5', bg: '#d1fae5' },
  { id: 'Won', label: 'Won', color: '#15803d', dotColor: '#16a34a', headerBg: '#f0fdf4', bg: '#dcfce7' },
  { id: 'Lost', label: 'Lost', color: '#b91c1c', dotColor: '#dc2626', headerBg: '#fef2f2', bg: '#fee2e2' },
];

export const DEAL_STAGE_COLOR_OPTIONS = [
  { label: 'Slate', color: '#475569', dotColor: '#64748b', headerBg: '#f8fafc', bg: '#f1f5f9' },
  { label: 'Blue', color: '#0369a1', dotColor: '#0284c7', headerBg: '#f0f9ff', bg: '#e0f2fe' },
  { label: 'Amber', color: '#b45309', dotColor: '#d97706', headerBg: '#fffbeb', bg: '#fef3c7' },
  { label: 'Purple', color: '#7e22ce', dotColor: '#9333ea', headerBg: '#faf5ff', bg: '#f3e8ff' },
  { label: 'Teal', color: '#047857', dotColor: '#059669', headerBg: '#ecfdf5', bg: '#d1fae5' },
  { label: 'Green', color: '#15803d', dotColor: '#16a34a', headerBg: '#f0fdf4', bg: '#dcfce7' },
  { label: 'Red', color: '#b91c1c', dotColor: '#dc2626', headerBg: '#fef2f2', bg: '#fee2e2' },
  { label: 'Pink', color: '#be185d', dotColor: '#ec4899', headerBg: '#fdf2f8', bg: '#fce7f3' },
];

export const getStoredDealStages = () => {
  try {
    const saved = localStorage.getItem('crm_deal_stages');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading deal stages from localStorage', e);
  }
  return DEFAULT_DEAL_STAGES;
};

export const saveStoredDealStages = (stages) => {
  try {
    localStorage.setItem('crm_deal_stages', JSON.stringify(stages));
    window.dispatchEvent(new Event('crm_deal_stages_updated'));
  } catch (e) {
    console.error('Error saving deal stages to localStorage', e);
  }
};

export const mapDealStageToColumn = (stage, customStages = null) => {
  if (!stage) return 'Qualification';
  const s = String(stage).trim();
  const stages = customStages || getStoredDealStages();
  const found = stages.find(item => item.id.toLowerCase() === s.toLowerCase());
  if (found) return found.id;

  // Fallbacks for alternate stage names or status names
  const lower = s.toLowerCase();
  if (lower === 'prospecting' || lower === 'open') return 'Qualification';
  if (lower === 'replied') return 'Demo';
  if (lower === 'interested') return 'Proposal';
  if (lower === 'ready') return 'Ready to Close';

  return 'Qualification';
};
