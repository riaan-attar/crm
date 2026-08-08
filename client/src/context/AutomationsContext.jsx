import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AutomationsContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL || '';
const AUTOMATIONS_URL = `${API_BASE}/api/automations`;

export const AUTOMATION_TEMPLATES = [
  {
    slug: 'welcome_message',
    name: 'Welcome New Lead',
    description: 'Auto-send a welcome greeting message as soon as a new lead is added to the CRM.',
    triggerType: 'lead_created',
    triggerConfig: {},
    steps: [
      {
        stepType: 'send_message',
        stepConfig: {
          text: "Hi {{lead.firstName}}! 👋 Thank you for inquiring with us. Our team will review your request and get back to you shortly.",
        },
      },
      {
        stepType: 'add_tag',
        stepConfig: { tag_id: 'New Lead' },
      },
    ],
  },
  {
    slug: 'keyword_qualifier',
    name: 'Keyword Auto-Responder',
    description: 'Trigger an automated reply when incoming messages contain keywords like "pricing", "quote", or "demo".',
    triggerType: 'keyword_match',
    triggerConfig: {
      keywords: ['pricing', 'quote', 'demo', 'cost'],
      match_type: 'contains',
      case_sensitive: false,
    },
    steps: [
      {
        stepType: 'send_message',
        stepConfig: {
          text: "Thanks for reaching out about pricing! Could you tell us a bit more about your project requirements?",
        },
      },
      {
        stepType: 'wait',
        stepConfig: { amount: 15, unit: 'minutes' },
      },
      {
        stepType: 'assign_conversation',
        stepConfig: { agent_id: 'Sales Team' },
      },
    ],
  },
  {
    slug: 'out_of_office',
    name: 'Out of Office Auto-Reply',
    description: 'Check if messages arrive off-hours (after 6 PM) and send an automated away notice.',
    triggerType: 'new_message_received',
    triggerConfig: {},
    steps: [
      {
        stepType: 'condition',
        stepConfig: {
          subject: 'time_of_day',
          operand: '18:00-09:00',
        },
        branches: {
          yes: [
            {
              stepType: 'send_message',
              stepConfig: {
                text: "Thanks for your message! Our team is currently offline (9 AM - 6 PM). We will reply first thing tomorrow morning.",
              },
            },
          ],
          no: [],
        },
      },
    ],
  },
  {
    slug: 'stage_change_alert',
    name: 'Stage Change Notification & Webhook',
    description: 'Send a webhook payload to external tools whenever a lead status updates.',
    triggerType: 'stage_changed',
    triggerConfig: {},
    steps: [
      {
        stepType: 'send_webhook',
        stepConfig: {
          url: 'https://httpbin.org/post',
          headers: { 'Content-Type': 'application/json' },
          body_template: '{"event": "lead_stage_updated", "lead_id": "{{lead.id}}", "status": "{{lead.status}}"}',
        },
      },
      {
        stepType: 'create_deal',
        stepConfig: {
          title: 'Opportunity for {{lead.firstName}}',
          value: 50000,
          stage_id: 'Qualified',
        },
      },
    ],
  },
];

export function AutomationsProvider({ children }) {
  const [automations, setAutomations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAutomations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(AUTOMATIONS_URL);
      setAutomations(res.data.data || []);
    } catch (err) {
      console.error('Error fetching automations:', err);
      setError(err.response?.data?.message || 'Failed to load automations');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async (automationId = null) => {
    try {
      const url = automationId ? `${AUTOMATIONS_URL}/${automationId}/logs` : `${AUTOMATIONS_URL}/logs`;
      const res = await axios.get(url);
      setLogs(res.data.data || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  }, []);

  useEffect(() => {
    fetchAutomations();
  }, [fetchAutomations]);

  const getAutomation = async (id) => {
    try {
      const res = await axios.get(`${AUTOMATIONS_URL}/${id}`);
      return res.data.data;
    } catch (err) {
      console.error('Error getting automation:', err);
      throw err;
    }
  };

  const createAutomation = async (payload) => {
    try {
      const res = await axios.post(AUTOMATIONS_URL, payload);
      const created = res.data.data;
      setAutomations((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Error creating automation:', err);
      throw err;
    }
  };

  const updateAutomation = async (id, payload) => {
    try {
      const res = await axios.put(`${AUTOMATIONS_URL}/${id}`, payload);
      const updated = res.data.data;
      setAutomations((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      console.error('Error updating automation:', err);
      throw err;
    }
  };

  const toggleAutomationActive = async (id, isActive) => {
    try {
      const res = await axios.put(`${AUTOMATIONS_URL}/${id}`, { isActive });
      const updated = res.data.data;
      setAutomations((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      console.error('Error toggling active state:', err);
      throw err;
    }
  };

  const deleteAutomation = async (id) => {
    try {
      await axios.delete(`${AUTOMATIONS_URL}/${id}`);
      setAutomations((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error deleting automation:', err);
      throw err;
    }
  };

  const duplicateAutomation = async (id) => {
    try {
      const res = await axios.post(`${AUTOMATIONS_URL}/${id}/duplicate`);
      const duplicated = res.data.data;
      setAutomations((prev) => [duplicated, ...prev]);
      return duplicated;
    } catch (err) {
      console.error('Error duplicating automation:', err);
      throw err;
    }
  };

  const triggerEngineTest = async (payload) => {
    try {
      const res = await axios.post(`${AUTOMATIONS_URL}/engine/dispatch`, payload);
      await fetchLogs();
      return res.data;
    } catch (err) {
      console.error('Error triggering engine:', err);
      throw err;
    }
  };

  return (
    <AutomationsContext.Provider
      value={{
        automations,
        logs,
        loading,
        error,
        templates: AUTOMATION_TEMPLATES,
        fetchAutomations,
        fetchLogs,
        getAutomation,
        createAutomation,
        updateAutomation,
        toggleAutomationActive,
        deleteAutomation,
        duplicateAutomation,
        triggerEngineTest,
      }}
    >
      {children}
    </AutomationsContext.Provider>
  );
}

export const useAutomations = () => {
  const context = useContext(AutomationsContext);
  if (!context) {
    throw new Error('useAutomations must be used within an AutomationsProvider');
  }
  return context;
};
