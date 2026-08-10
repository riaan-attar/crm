export const DEFAULT_DEAL_STAGES = [
  { id: 'Qualification', label: 'Qualification', color: '#7c7c7c', dotColor: '#7c7c7c', headerBg: '#1f1f1f', bg: '#141414' },
  { id: 'Demo', label: 'Demo', color: '#5aaef2', dotColor: '#5aaef2', headerBg: '#0e2037', bg: '#0d1a2a' },
  { id: 'Proposal', label: 'Proposal', color: '#e79913', dotColor: '#e79913', headerBg: '#371e06', bg: '#1a1200' },
  { id: 'Negotiation', label: 'Negotiation', color: '#9c45e3', dotColor: '#9c45e3', headerBg: '#2d1a4a', bg: '#1a0a2a' },
  { id: 'Ready to Close', label: 'Ready to Close', color: '#30a66d', dotColor: '#30a66d', headerBg: '#0b2e1c', bg: '#082115' },
  { id: 'Won', label: 'Won', color: '#28a745', dotColor: '#28a745', headerBg: '#173b2c', bg: '#0a1a0e' },
  { id: 'Lost', label: 'Lost', color: '#e03636', dotColor: '#e03636', headerBg: '#361515', bg: '#1a0a0a' },
];

export const DEAL_STAGE_COLOR_OPTIONS = [
  { label: 'Slate', color: '#7c7c7c', dotColor: '#7c7c7c', headerBg: '#1f1f1f', bg: '#141414' },
  { label: 'Blue', color: '#5aaef2', dotColor: '#5aaef2', headerBg: '#0e2037', bg: '#0d1a2a' },
  { label: 'Amber', color: '#e79913', dotColor: '#e79913', headerBg: '#371e06', bg: '#1a1200' },
  { label: 'Purple', color: '#9c45e3', dotColor: '#9c45e3', headerBg: '#2d1a4a', bg: '#1a0a2a' },
  { label: 'Teal', color: '#30a66d', dotColor: '#30a66d', headerBg: '#0b2e1c', bg: '#082115' },
  { label: 'Green', color: '#28a745', dotColor: '#28a745', headerBg: '#173b2c', bg: '#0a1a0e' },
  { label: 'Red', color: '#e03636', dotColor: '#e03636', headerBg: '#361515', bg: '#1a0a0a' },
  { label: 'Pink', color: '#ec4899', dotColor: '#ec4899', headerBg: '#3b0d25', bg: '#1f0714' },
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
