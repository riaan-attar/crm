import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAutomations } from '../../../context/AutomationsContext';
import {
  ArrowLeft,
  Zap,
  Plus,
  Trash2,
  Save,
  MessageSquare,
  Tag,
  PencilLine,
  Briefcase,
  Hourglass,
  GitBranch,
  Webhook,
  UserCheck,
  CircleSlash,
  Sparkles,
  Settings2,
  LayoutGrid
} from 'lucide-react';

const STEP_TYPES = [
  { type: 'send_message', label: 'Send Message', icon: MessageSquare, badgeBg: '#eff6ff', badgeColor: '#2563eb', border: '#bfdbfe' },
  { type: 'add_tag', label: 'Add Tag', icon: Tag, badgeBg: '#f0fdf4', badgeColor: '#16a34a', border: '#bbf7d0' },
  { type: 'remove_tag', label: 'Remove Tag', icon: Tag, badgeBg: '#fffbeb', badgeColor: '#d97706', border: '#fef3c7' },
  { type: 'update_contact_field', label: 'Update Lead Field', icon: PencilLine, badgeBg: '#faf5ff', badgeColor: '#9333ea', border: '#e9d5ff' },
  { type: 'create_deal', label: 'Create Deal', icon: Briefcase, badgeBg: '#fffbeb', badgeColor: '#d97706', border: '#fef3c7' },
  { type: 'send_webhook', label: 'Send Webhook', icon: Webhook, badgeBg: '#eff6ff', badgeColor: '#2563eb', border: '#bfdbfe' },
  { type: 'wait', label: 'Wait Timer', icon: Hourglass, badgeBg: '#f1f5f9', badgeColor: '#475569', border: '#cbd5e1' },
  { type: 'condition', label: 'If / Else Condition', icon: GitBranch, badgeBg: '#faf5ff', badgeColor: '#9333ea', border: '#e9d5ff' },
  { type: 'assign_conversation', label: 'Assign Owner', icon: UserCheck, badgeBg: '#faf5ff', badgeColor: '#9333ea', border: '#e9d5ff' },
  { type: 'close_conversation', label: 'Close Lead', icon: CircleSlash, badgeBg: '#fef2f2', badgeColor: '#dc2626', border: '#fecaca' },
];

const TRIGGER_TYPES = [
  { type: 'lead_created', label: 'Lead Created (New Lead added to CRM)' },
  { type: 'keyword_match', label: 'Keyword Match (Message contains words)' },
  { type: 'stage_changed', label: 'Stage Changed (Lead status updated)' },
  { type: 'tag_added', label: 'Tag Added (Tag assigned to lead)' },
  { type: 'new_message_received', label: 'New Message Received' },
];

function generateId() {
  return 'node_' + Math.random().toString(36).slice(2, 9);
}

function defaultStepConfig(type) {
  switch (type) {
    case 'send_message': return { text: 'Hello {{lead.firstName}}, thanks for contacting us!' };
    case 'add_tag': return { tag_id: 'VIP Lead' };
    case 'remove_tag': return { tag_id: 'Unqualified' };
    case 'update_contact_field': return { field: 'status', value: 'Contacted' };
    case 'create_deal': return { title: 'Deal for {{lead.firstName}}', value: 10000, stage_id: 'Prospecting' };
    case 'send_webhook': return { url: 'https://example.com/webhook', headers: {}, body_template: '' };
    case 'wait': return { amount: 1, unit: 'hours' };
    case 'condition': return { subject: 'lead_status', operand: 'New' };
    case 'assign_conversation': return { agent_id: 'Admin User' };
    case 'close_conversation': return {};
    default: return {};
  }
}

// ------------------------------------------------------------
// Custom ReactFlow Graph Nodes (n8n Light Style)
// ------------------------------------------------------------

function TriggerGraphNode({ data }) {
  return (
    <div style={{ background: '#ffffff', border: '2px solid #9333ea', borderRadius: '10px', width: '240px', padding: '12px', boxShadow: '0 6px 16px rgba(147,51,234,0.12)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: '700', color: '#9333ea', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
          TRIGGER NODE
        </span>
        <Zap size={14} color="#9333ea" />
      </div>
      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>
        {TRIGGER_TYPES.find(t => t.type === data.triggerType)?.label || data.triggerType}
      </div>
      {data.triggerType === 'keyword_match' && (
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', fontFamily: 'monospace' }}>
          Keywords: {(data.triggerConfig?.keywords || []).join(', ') || 'None'}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#9333ea', width: '12px', height: '12px', border: '2px solid #ffffff' }} />
    </div>
  );
}

function StepGraphNode({ data }) {
  const meta = STEP_TYPES.find(s => s.type === data.stepType) || { label: data.stepType, icon: Zap, badgeBg: '#f1f5f9', badgeColor: '#475569' };
  const Icon = meta.icon;

  return (
    <div
      style={{
        background: '#ffffff',
        border: data.selected ? '2px solid #2563eb' : '1px solid #cbd5e1',
        borderRadius: '10px',
        width: '240px',
        padding: '12px',
        boxShadow: data.selected ? '0 0 12px rgba(37,99,235,0.25)' : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.15s ease'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#2563eb', width: '10px', height: '10px', border: '2px solid #ffffff' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: meta.badgeBg, color: meta.badgeColor, border: `1px solid ${meta.border || '#cbd5e1'}`, borderRadius: '6px', padding: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={14} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{meta.label}</span>
        </div>
        <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>#{data.index}</span>
      </div>

      <div style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace', marginTop: '8px', background: '#f8fafc', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {JSON.stringify(data.stepConfig || {})}
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: '#2563eb', width: '10px', height: '10px', border: '2px solid #ffffff' }} />
    </div>
  );
}

function ConditionGraphNode({ data }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: data.selected ? '2px solid #9333ea' : '2px solid #6366f1',
        borderRadius: '10px',
        width: '260px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#6366f1', width: '10px', height: '10px', border: '2px solid #ffffff' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <GitBranch size={15} color="#6366f1" />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>If / Else Condition</span>
        </div>
        <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>#{data.index}</span>
      </div>

      <div style={{ fontSize: '11px', color: '#475569', background: '#f8fafc', padding: '6px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
        Subject: {data.stepConfig?.subject || 'lead_status'} ({data.stepConfig?.operand || ''})
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '2px 6px', borderRadius: '4px' }}>YES Path</span>
          <Handle type="source" id="yes" position={Position.Bottom} style={{ background: '#16a34a', left: '20px', width: '10px', height: '10px', border: '2px solid #ffffff' }} />
        </div>
        <div style={{ position: 'relative' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#dc2626', background: '#fee2e2', border: '1px solid #fecaca', padding: '2px 6px', borderRadius: '4px' }}>NO Path</span>
          <Handle type="source" id="no" position={Position.Bottom} style={{ background: '#dc2626', right: '20px', width: '10px', height: '10px', border: '2px solid #ffffff' }} />
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------
// Convert Step Tree <---> ReactFlow Nodes & Edges
// ------------------------------------------------------------

function stepsTreeToFlow(triggerType, triggerConfig, treeSteps = []) {
  const nodes = [];
  const edges = [];

  nodes.push({
    id: 'trigger',
    type: 'triggerNode',
    position: { x: 300, y: 40 },
    data: { triggerType, triggerConfig },
  });

  let currentY = 180;

  function walk(list, parentId, startY, startX = 300, isConditionBranch = null) {
    let y = startY;

    list.forEach((step) => {
      const nodeId = step.id || `node_${Math.random().toString(36).slice(2, 9)}`;
      const isCondition = step.stepType === 'condition';

      nodes.push({
        id: nodeId,
        type: isCondition ? 'conditionNode' : 'stepNode',
        position: { x: startX, y },
        data: {
          stepType: step.stepType,
          stepConfig: step.stepConfig || {},
          index: nodes.length,
          stepRef: step,
        },
      });

      const sourceHandle = isConditionBranch === 'yes' ? 'yes' : isConditionBranch === 'no' ? 'no' : undefined;
      edges.push({
        id: `edge_${parentId}_${nodeId}`,
        source: parentId,
        target: nodeId,
        sourceHandle,
        type: 'smoothstep',
        animated: true,
        style: { stroke: isConditionBranch === 'yes' ? '#16a34a' : isConditionBranch === 'no' ? '#dc2626' : '#9333ea', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: isConditionBranch === 'yes' ? '#16a34a' : isConditionBranch === 'no' ? '#dc2626' : '#9333ea' },
      });

      if (isCondition && step.branches) {
        const yesSteps = step.branches.yes || [];
        const noSteps = step.branches.no || [];

        if (yesSteps.length) {
          walk(yesSteps, nodeId, y + 160, startX - 160, 'yes');
        }
        if (noSteps.length) {
          walk(noSteps, nodeId, y + 160, startX + 160, 'no');
        }
      }

      parentId = nodeId;
      y += 150;
    });
  }

  walk(treeSteps, 'trigger', currentY);
  return { nodes, edges };
}

function flowToStepsTree(nodes, edges) {
  const nodeMap = {};
  nodes.forEach(n => {
    if (n.id !== 'trigger') {
      nodeMap[n.id] = {
        id: n.id,
        stepType: n.data.stepType,
        stepConfig: n.data.stepConfig || {},
        branches: n.data.stepType === 'condition' ? { yes: [], no: [] } : undefined,
      };
    }
  });

  const rootSteps = [];

  edges.forEach(edge => {
    const parentNode = nodeMap[edge.source];
    const childNode = nodeMap[edge.target];

    if (!childNode) return;

    if (edge.source === 'trigger') {
      rootSteps.push(childNode);
    } else if (parentNode && parentNode.stepType === 'condition') {
      const branchKey = edge.sourceHandle === 'no' ? 'no' : 'yes';
      parentNode.branches[branchKey].push(childNode);
    }
  });

  if (rootSteps.length === 0) {
    nodes.forEach(n => {
      if (n.id !== 'trigger') {
        rootSteps.push(nodeMap[n.id]);
      }
    });
  }

  return rootSteps;
}

// ------------------------------------------------------------
// Main AutomationBuilder Component
// ------------------------------------------------------------

export default function AutomationBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAutomation, createAutomation, updateAutomation } = useAutomations();

  const [name, setName] = useState('New Automation Workflow');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState('lead_created');
  const [triggerConfig, setTriggerConfig] = useState({ keywords: [], match_type: 'contains' });
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(Boolean(id));

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddNodePanel, setShowAddNodePanel] = useState(false);

  const nodeTypes = useMemo(() => ({
    triggerNode: TriggerGraphNode,
    stepNode: StepGraphNode,
    conditionNode: ConditionGraphNode,
  }), []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getAutomation(id)
        .then((data) => {
          setName(data.name || '');
          setDescription(data.description || '');
          setTriggerType(data.triggerType || 'lead_created');
          setTriggerConfig(data.triggerConfig || {});
          setIsActive(Boolean(data.isActive));

          const { nodes: flowNodes, edges: flowEdges } = stepsTreeToFlow(
            data.triggerType || 'lead_created',
            data.triggerConfig || {},
            data.treeSteps || []
          );
          setNodes(flowNodes);
          setEdges(flowEdges);
        })
        .catch(() => alert('Failed to load automation'))
        .finally(() => setLoading(false));
    } else {
      const { nodes: flowNodes, edges: flowEdges } = stepsTreeToFlow('lead_created', {}, [
        { id: 'step_welcome', stepType: 'send_message', stepConfig: { text: 'Hi {{lead.firstName}}! Thanks for inquiring.' } },
        { id: 'step_tag', stepType: 'add_tag', stepConfig: { tag_id: 'New Lead' } },
      ]);
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [id]);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: 'smoothstep',
            animated: true,
            style: { stroke: params.sourceHandle === 'yes' ? '#16a34a' : params.sourceHandle === 'no' ? '#dc2626' : '#9333ea', strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const handleAddNode = (stepType) => {
    const newNodeId = generateId();
    const isCondition = stepType === 'condition';

    const lastNode = nodes[nodes.length - 1];
    const lastY = lastNode ? lastNode.position.y + 140 : 180;

    const newNode = {
      id: newNodeId,
      type: isCondition ? 'conditionNode' : 'stepNode',
      position: { x: 300, y: lastY },
      data: {
        stepType,
        stepConfig: defaultStepConfig(stepType),
        index: nodes.length,
      },
    };

    setNodes((prev) => [...prev, newNode]);

    if (lastNode) {
      setEdges((prev) => [
        ...prev,
        {
          id: `edge_${lastNode.id}_${newNodeId}`,
          source: lastNode.id,
          target: newNodeId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#9333ea', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#9333ea' },
        },
      ]);
    }

    setShowAddNodePanel(false);
    setSelectedNode(newNode);
  };

  const handleDeleteNode = (nodeId) => {
    if (nodeId === 'trigger') return;
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setEdges((prev) => prev.filter((e) => e.source !== nodeId && e.target !== nodeId));
    if (selectedNode?.id === nodeId) setSelectedNode(null);
  };

  const handleUpdateNodeConfig = (newConfig) => {
    if (!selectedNode) return;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === selectedNode.id) {
          return {
            ...n,
            data: {
              ...n.data,
              stepConfig: newConfig,
            },
          };
        }
        return n;
      })
    );
    setSelectedNode((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        stepConfig: newConfig,
      },
    }));
  };

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter an automation name');
      return;
    }

    setSaving(true);
    try {
      const treeSteps = flowToStepsTree(nodes, edges);

      const payload = {
        name,
        description,
        triggerType,
        triggerConfig,
        isActive,
        steps: treeSteps,
      };

      if (id) {
        await updateAutomation(id, payload);
        alert('Automation saved successfully!');
      } else {
        const created = await createAutomation(payload);
        alert('Automation created successfully!');
        navigate(`/crm/automations/${created.id}/edit`, { replace: true });
      }
    } catch (err) {
      alert('Failed to save automation: ' + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', background: '#f8fafc' }}>
        Loading n8n Visual Workflow Builder...
      </div>
    );
  }

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
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ background: 'transparent', border: 'none', borderBottom: '1px solid transparent', fontSize: '16px', fontWeight: '600', color: '#0f172a', outline: 'none' }}
            onFocus={(e) => e.target.style.borderBottom = '1px solid #2563eb'}
            onBlur={(e) => e.target.style.borderBottom = '1px solid transparent'}
            placeholder="Workflow Name..."
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setShowAddNodePanel(!showAddNodePanel)}
            style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: '500', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <Plus size={15} color="#ffffff" /> Add Node
          </button>

          <div
            onClick={() => setIsActive(!isActive)}
            style={{
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 12px',
              borderRadius: '6px',
              background: isActive ? '#dcfce7' : '#f1f5f9',
              color: isActive ? '#15803d' : '#64748b',
              border: isActive ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
              cursor: 'pointer'
            }}
          >
            {isActive ? 'Active' : 'Draft'}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: '#9333ea', border: 'none', borderRadius: '6px', padding: '6px 16px', fontSize: '13px', fontWeight: '500', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
          >
            <Save size={14} />
            {saving ? 'Saving...' : 'Save Workflow'}
          </button>
        </div>
      </div>

      {/* GRAPH CANVAS & SIDEBAR PANELS */}
      <div style={{ flex: 1, position: 'relative', display: 'flex' }}>
        {/* ReactFlow Canvas */}
        <div style={{ flex: 1, width: '100%', height: '100%', background: '#f8fafc' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="#cbd5e1" gap={20} size={1.5} />
            <Controls style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
            <MiniMap nodeColor="#9333ea" maskColor="rgba(248,250,252,0.8)" style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px' }} />
          </ReactFlow>
        </div>

        {/* ADD NODE PALETTE PANEL */}
        {showAddNodePanel && (
          <div style={{ position: 'absolute', left: '20px', top: '20px', zIndex: 40, width: '260px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LayoutGrid size={14} color="#9333ea" /> Add Node Palette
              </span>
              <button onClick={() => setShowAddNodePanel(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '70vh', overflowY: 'auto' }}>
              {STEP_TYPES.map((st) => (
                <button
                  key={st.type}
                  onClick={() => handleAddNode(st.type)}
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px', fontSize: '12px', color: '#0f172a', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9333ea'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                >
                  <st.icon size={14} color="#9333ea" />
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NODE CONFIGURATION DRAWER */}
        {selectedNode && (
          <div style={{ width: '360px', background: '#ffffff', borderLeft: '1px solid #cbd5e1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', zIndex: 30, boxShadow: '-4px 0 20px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings2 size={16} color="#9333ea" /> Node Properties
              </div>
              <button onClick={() => setSelectedNode(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>✕</button>
            </div>

            {selectedNode.id === 'trigger' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#9333ea', background: '#faf5ff', border: '1px solid #e9d5ff', padding: '6px 10px', borderRadius: '6px' }}>
                  Trigger Settings
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Trigger Type</label>
                  <select
                    value={triggerType}
                    onChange={(e) => {
                      setTriggerType(e.target.value);
                      setNodes((prev) => prev.map(n => n.id === 'trigger' ? { ...n, data: { ...n.data, triggerType: e.target.value } } : n));
                    }}
                    style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
                  >
                    {TRIGGER_TYPES.map((t) => (
                      <option key={t.type} value={t.type}>{t.label}</option>
                    ))}
                  </select>
                </div>

                {triggerType === 'keyword_match' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Keywords (comma separated)</label>
                    <input
                      type="text"
                      value={(triggerConfig.keywords || []).join(', ')}
                      onChange={(e) => {
                        const newCfg = {
                          ...triggerConfig,
                          keywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean)
                        };
                        setTriggerConfig(newCfg);
                        setNodes((prev) => prev.map(n => n.id === 'trigger' ? { ...n, data: { ...n.data, triggerConfig: newCfg } } : n));
                      }}
                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#2563eb', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '6px 10px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Node: {selectedNode.data?.stepType}</span>
                  <button onClick={() => handleDeleteNode(selectedNode.id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }} title="Delete Node">
                    <Trash2 size={14} />
                  </button>
                </div>

                <NodeConfigForm
                  stepType={selectedNode.data?.stepType}
                  config={selectedNode.data?.stepConfig || {}}
                  onChange={(newCfg) => handleUpdateNodeConfig(newCfg)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NodeConfigForm({ stepType, config, onChange }) {
  const [cfg, setCfg] = useState({ ...config });

  useEffect(() => {
    setCfg({ ...config });
  }, [config]);

  const update = (key, val) => {
    const updated = { ...cfg, [key]: val };
    setCfg(updated);
    onChange(updated);
  };

  switch (stepType) {
    case 'send_message':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Message Template</label>
          <textarea
            rows={4}
            value={cfg.text || ''}
            onChange={(e) => update('text', e.target.value)}
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
          />
        </div>
      );

    case 'add_tag':
    case 'remove_tag':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Tag Name</label>
          <input
            type="text"
            value={cfg.tag_id || ''}
            onChange={(e) => update('tag_id', e.target.value)}
            style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
          />
        </div>
      );

    case 'update_contact_field':
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Target Field</label>
            <select
              value={cfg.field || 'status'}
              onChange={(e) => update('field', e.target.value)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
            >
              <option value="status">Lead Status</option>
              <option value="leadSource">Lead Source</option>
              <option value="budgetRange">Budget Range</option>
              <option value="preferredArea">Preferred Area</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Value</label>
            <input
              type="text"
              value={cfg.value || ''}
              onChange={(e) => update('value', e.target.value)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
            />
          </div>
        </>
      );

    case 'create_deal':
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Deal Title Template</label>
            <input
              type="text"
              value={cfg.title || ''}
              onChange={(e) => update('title', e.target.value)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Amount</label>
            <input
              type="number"
              value={cfg.value || 0}
              onChange={(e) => update('value', Number(e.target.value))}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
            />
          </div>
        </>
      );

    case 'wait':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Amount</label>
            <input
              type="number"
              value={cfg.amount || 1}
              onChange={(e) => update('amount', Number(e.target.value))}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Unit</label>
            <select
              value={cfg.unit || 'hours'}
              onChange={(e) => update('unit', e.target.value)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
            >
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </div>
        </div>
      );

    case 'condition':
      return (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Subject</label>
            <select
              value={cfg.subject || 'lead_status'}
              onChange={(e) => update('subject', e.target.value)}
              style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
            >
              <option value="lead_status">Lead Status Matches</option>
              <option value="time_of_day">Time of Day (18:00-09:00 off-hours)</option>
              <option value="custom_field">Custom Lead Field Matches</option>
            </select>
          </div>
          {cfg.subject !== 'time_of_day' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Operand Value</label>
              <input
                type="text"
                value={cfg.operand || ''}
                onChange={(e) => update('operand', e.target.value)}
                style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px', fontSize: '12px', color: '#0f172a', outline: 'none' }}
              />
            </div>
          )}
        </>
      );

    default:
      return <div style={{ fontSize: '12px', color: '#64748b' }}>No special configuration needed.</div>;
  }
}
