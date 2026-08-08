import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AutomationsList from './AutomationsList';
import AutomationBuilder from './AutomationBuilder';
import AutomationLogs from './AutomationLogs';

export default function AutomationsPage() {
  return (
    <Routes>
      <Route index element={<AutomationsList />} />
      <Route path="new" element={<AutomationBuilder />} />
      <Route path=":id/edit" element={<AutomationBuilder />} />
      <Route path="logs" element={<AutomationLogs />} />
      <Route path=":id/logs" element={<AutomationLogs />} />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}
