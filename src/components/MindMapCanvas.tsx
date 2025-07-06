
import { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Download } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 25 },
    data: { label: 'Ana Fikir' },
  },
];

const initialEdges: Edge[] = [];

export function MindMapCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeLabel, setNodeLabel] = useState('');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNewNode = () => {
    if (!nodeLabel.trim()) return;

    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: nodeLabel },
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeLabel('');
  };

  const saveMindMap = () => {
    const mindMapData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem('mindmap', JSON.stringify(mindMapData));
    console.log('Zihin haritası kaydedildi!');
  };

  const exportMindMap = () => {
    const dataStr = JSON.stringify({ nodes, edges }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mindmap.json';
    link.click();
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-4 p-4 border-b bg-background">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Yeni düğüm adı..."
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNewNode()}
            className="max-w-xs"
          />
          <Button onClick={addNewNode} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Düğüm Ekle
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveMindMap} variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Kaydet
          </Button>
          <Button onClick={exportMindMap} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            İndir
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ backgroundColor: '#f8fafc' }}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
