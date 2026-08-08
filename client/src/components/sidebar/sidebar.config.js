export const SIDEBAR_CONFIG = {
  main: [
    {
      key: 'notifications',
      label: 'Notifications',
      icon: 'Bell',
      route: '/notifications',
      badge: 7,
    },
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'LayoutDashboard',
      route: '/crm',
    },
    {
      key: 'leads',
      label: 'Leads',
      icon: 'Users',
      route: '/crm/leads',
    },
    {
      key: 'deals',
      label: 'Deals',
      icon: 'Handshake',
      route: '/crm/deals',
    },
    {
      key: 'contacts',
      label: 'Contacts',
      icon: 'UserCircle',
      route: '/crm/contacts',
    },
    {
      key: 'projects',
      label: 'Projects',
      icon: 'Folder',
      route: '/crm/projects',
    },
    {
      key: 'notes',
      label: 'Notes',
      icon: 'StickyNote',
      route: '/crm/notes',
    },
    {
      key: 'tasks',
      label: 'Tasks',
      icon: 'CheckSquare',
      route: '/crm/tasks',
    },
    {
      key: 'callLogs',
      label: 'Call Logs',
      icon: 'Phone',
      route: '/crm/call-logs',
    },
    {
      key: 'emailTemplates',
      label: 'Email Templates',
      icon: 'Mail',
      route: '/crm/email-templates',
    },
    {
      key: 'automations',
      label: 'Automations',
      icon: 'Zap',
      route: '/crm/automations',
    },
  ],

  publicViews: [
    {
      key: 'myLeads',
      label: 'My Leads',
      icon: 'User',
      route: '/crm/leads?filter=mine',
    },
    {
      key: 'myDeals',
      label: 'My Deals',
      icon: 'User',
      route: '/crm/deals?filter=mine',
    },
  ],

  pinnedViews: [
    {
      key: 'incomingCalls',
      label: 'Incoming Calls',
      icon: 'PhoneIncoming',
      route: '/crm/incoming-calls',
    },
  ],
};
