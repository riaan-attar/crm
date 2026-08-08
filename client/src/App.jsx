import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Construction } from 'lucide-react';
import AppShell from './components/layout/AppShell';
import CrmDashboard from './modules/crm';
import LeadList from './modules/crm/leads/LeadList';
import LeadDetail from './modules/crm/leads/LeadDetail';
import OpportunityList from './modules/crm/opportunities/OpportunityList';
import OpportunityDetail from './modules/crm/opportunities/OpportunityDetail';
import DealList from './modules/crm/deals/DealList';
import DealDetail from './modules/crm/deals/DealDetail';
import CustomerList from './modules/crm/customers/CustomerList';
import CustomerDetail from './modules/crm/customers/CustomerDetail';
import ContactList from './modules/crm/contacts/ContactList';
import MaintenanceList from './modules/crm/maintenance/MaintenanceList';
import SalesPipeline from './modules/crm/pipeline/SalesPipeline';
import ContractList from './modules/crm/contracts/ContractList';
import CommunicationList from './modules/crm/communications/CommunicationList';
import CampaignList from './modules/crm/campaigns/CampaignList';
import OrganizationList from './modules/crm/organizations/OrganizationList';
import OrganizationDetail from './modules/crm/organizations/OrganizationDetail';
import NotesPage from './modules/crm/notes/NotesPage';
import TasksPage from './modules/crm/tasks/TasksPage';
import CallLogsPage from './modules/crm/calllogs/CallLogsPage';
import EmailTemplatesPage from './modules/crm/emailtemplates/EmailTemplatesPage';
import CrmSettings from './modules/crm/settings/CrmSettings';

import { LeadsProvider } from './context/LeadsContext';
import { OpportunitiesProvider } from './context/OpportunitiesContext';
import { CustomersProvider } from './context/CustomersContext';
import { ContactsProvider } from './context/ContactsContext';
import { MaintenanceProvider } from './context/MaintenanceContext';
import { ContractsProvider } from './context/ContractsContext';
import { CommunicationsProvider } from './context/CommunicationsContext';
import { CampaignsProvider } from './context/CampaignsContext';
import { OrganizationsProvider } from './context/OrganizationsContext';
import { NotesProvider } from './context/NotesContext';
import { TasksProvider } from './context/TasksContext';
import { CallLogsProvider } from './context/CallLogsContext';
import { EmailTemplatesProvider } from './context/EmailTemplatesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './modules/auth/Login';

const Placeholder = ({ title }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    background: '#0f0f0f',
    color: '#383838',
    gap: 12,
  }}>
    <Construction size={40} strokeWidth={1} />
    <p style={{ fontSize: 14 }}>
      {title} — Coming Soon
    </p>
  </div>
);

function AuthWrapper({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: '#080808',
        color: '#a352cc',
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px'
      }}>
        Loading CRM...
      </div>
    );
  }

  if (!token) {
    return <Login />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthWrapper>
        <LeadsProvider>
          <OpportunitiesProvider>
            <ContactsProvider>
            <MaintenanceProvider>
            <CustomersProvider>
              <ContractsProvider>
                <CommunicationsProvider>
                  <CampaignsProvider>
                    <OrganizationsProvider>
                    <NotesProvider>
                    <TasksProvider>
                    <CallLogsProvider>
                    <EmailTemplatesProvider>
                      <BrowserRouter>
                      <Routes>
                        <Route path="/" element={<AppShell />}>
                          <Route index element={<Navigate to="/crm" replace />} />

                          <Route path="crm/leads/:id" element={<LeadDetail />} />
                          <Route path="crm/leads" element={<LeadList />} />
                          <Route path="crm/deals/:id" element={<DealDetail />} />
                          <Route path="crm/deals" element={<DealList />} />
                          <Route path="crm/opportunities/:id" element={<OpportunityDetail />} />
                          <Route path="crm/opportunities" element={<OpportunityList />} />
                          <Route path="crm/customers/:id" element={<CustomerDetail />} />
                          <Route path="crm/customers" element={<CustomerList />} />
                          <Route path="crm/contacts" element={<ContactList />} />
                          <Route path="crm/maintenance" element={<MaintenanceList />} />
                          <Route path="crm/pipeline" element={<SalesPipeline />} />
                          <Route path="crm/contracts" element={<ContractList />} />
                          <Route path="crm/communications" element={<CommunicationList />} />
                          <Route path="crm/campaigns" element={<CampaignList />} />
                          
                          {/* Placeholders */}
                          <Route path="crm/projects" element={<OrganizationList />} />
                          <Route path="crm/projects/:id" element={<OrganizationDetail />} />
                          <Route path="crm/organizations" element={<OrganizationList />} />
                          <Route path="crm/organizations/:id" element={<OrganizationDetail />} />
                          <Route path="crm/notes" element={<NotesPage />} />
                          <Route path="crm/tasks" element={<TasksPage />} />
                          <Route path="crm/call-logs" element={<CallLogsPage />} />
                          <Route path="crm/email-templates" element={<EmailTemplatesPage />} />
                          <Route path="crm/settings" element={<CrmSettings />} />
                          
                          <Route path="crm/incoming-calls" element={<Placeholder title="Incoming Calls" />} />
                          <Route path="notifications" element={<Placeholder title="Notifications" />} />

                          <Route path="crm/*" element={<CrmDashboard />} />
                        </Route>

                      </Routes>
                      </BrowserRouter>
                    </EmailTemplatesProvider>
                    </CallLogsProvider>
                    </TasksProvider>
                    </NotesProvider>
                    </OrganizationsProvider>
                  </CampaignsProvider>
                </CommunicationsProvider>
              </ContractsProvider>
            </CustomersProvider>
            </MaintenanceProvider>
            </ContactsProvider>
          </OpportunitiesProvider>
        </LeadsProvider>
      </AuthWrapper>
    </AuthProvider>
  );
}
