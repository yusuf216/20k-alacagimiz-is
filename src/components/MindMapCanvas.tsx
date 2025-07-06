
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
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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
    toast({
      title: "Düğüm eklendi",
      description: "Yeni düğüm zihin haritasına eklendi.",
    });
  };

  const saveMindMap = () => {
    const mindMapData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    const savedMaps = JSON.parse(localStorage.getItem('mindmaps') || '[]');
    savedMaps.push({
      id: Date.now(),
      title: `Zihin Haritası ${savedMaps.length + 1}`,
      data: mindMapData,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('mindmaps', JSON.stringify(savedMaps));
    toast({
      title: "Kaydedildi",
      description: "Zihin haritası başarıyla kaydedildi.",
    });
  };

  const exportMindMap = async (format: 'json' | 'png' | 'pdf' = 'json') => {
    if (format === 'json') {
      const dataStr = JSON.stringify({ nodes, edges }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mindmap.json';
      link.click();
    } else if (format === 'png') {
      // PNG export functionality would require html2canvas or similar
      toast({
        title: "PNG Export",
        description: "PNG dışa aktarma özelliği yakında gelecek.",
      });
    } else if (format === 'pdf') {
      // PDF export functionality would require jsPDF or similar
      toast({
        title: "PDF Export",
        description: "PDF dışa aktarma özelliği yakında gelecek.",
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b bg-background">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
          <Input
            placeholder="Yeni düğüm adı..."
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNewNode()}
            className="flex-1 min-w-0"
          />
          <Button onClick={addNewNode} size="sm" className="gap-2 w-full sm:w-auto">
            <Plus className="w-4 h-4" />
            Düğüm Ekle
          </Button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={saveMindMap} variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
            <Save className="w-4 h-4" />
            Kaydet
          </Button>
          <Button onClick={() => exportMindMap('json')} variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none">
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
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
