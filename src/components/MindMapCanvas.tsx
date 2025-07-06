
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Save, Download, Palette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 25 },
    data: { label: 'Ana Fikir' },
    style: { 
      backgroundColor: '#ffffff',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      padding: '10px',
      minWidth: '120px',
      textAlign: 'center'
    }
  },
];

const initialEdges: Edge[] = [];

const nodeColors = [
  { name: 'Beyaz', value: '#ffffff', border: '#e2e8f0' },
  { name: 'Mavi', value: '#dbeafe', border: '#3b82f6' },
  { name: 'Yeşil', value: '#dcfce7', border: '#10b981' },
  { name: 'Sarı', value: '#fef3c7', border: '#f59e0b' },
  { name: 'Pembe', value: '#fce7f3', border: '#ec4899' },
  { name: 'Mor', value: '#e9d5ff', border: '#8b5cf6' },
  { name: 'Kırmızı', value: '#fee2e2', border: '#ef4444' },
];

export function MindMapCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeLabel, setNodeLabel] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newNodeName, setNewNodeName] = useState('');
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const addNewNode = () => {
    if (!nodeLabel.trim()) {
      toast({
        title: "Hata",
        description: "Düğüm adı boş olamaz.",
        variant: "destructive"
      });
      return;
    }

    const newNode: Node = {
      id: `${Date.now()}`,
      type: 'default',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: { label: nodeLabel },
      style: { 
        backgroundColor: '#ffffff',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        padding: '10px',
        minWidth: '120px',
        textAlign: 'center'
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeLabel('');
    toast({
      title: "Düğüm eklendi",
      description: "Yeni düğüm zihin haritasına eklendi.",
    });
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const changeNodeColor = (color: typeof nodeColors[0]) => {
    if (!selectedNodeId) return;
    
    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              style: {
                ...node.style,
                backgroundColor: color.value,
                border: `2px solid ${color.border}`,
              },
            }
          : node
      )
    );
    
    toast({
      title: "Renk değiştirildi",
      description: `Düğüm rengi ${color.name.toLowerCase()} olarak değiştirildi.`,
    });
  };

  const startRename = () => {
    if (!selectedNodeId) return;
    
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    if (selectedNode) {
      setNewNodeName(selectedNode.data.label);
      setIsRenaming(true);
    }
  };

  const finishRename = () => {
    if (!selectedNodeId || !newNodeName.trim()) {
      setIsRenaming(false);
      return;
    }

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNodeId
          ? {
              ...node,
              data: { ...node.data, label: newNodeName },
            }
          : node
      )
    );

    setIsRenaming(false);
    setNewNodeName('');
    toast({
      title: "Düğüm yeniden adlandırıldı",
      description: "Düğüm adı başarıyla değiştirildi.",
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
      toast({
        title: "JSON dışa aktarıldı",
        description: "Zihin haritası JSON formatında indirildi.",
      });
    } else {
      toast({
        title: "Özellik geliştiriliyor",
        description: `${format.toUpperCase()} dışa aktarma özelliği yakında gelecek.`,
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col gap-4 p-4 border-b bg-background">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Yeni düğüm adı..."
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNewNode()}
            className="flex-1 min-w-[200px] sm:min-w-0"
          />
          <Button onClick={addNewNode} size="sm" className="gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Düğüm Ekle
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={saveMindMap} variant="outline" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Kaydet
          </Button>
          <Button onClick={() => exportMindMap('json')} variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            JSON İndir
          </Button>
          {selectedNodeId && (
            <Button 
              onClick={startRename} 
              variant="outline" 
              size="sm" 
              className="gap-2"
            >
              Yeniden Adlandır
            </Button>
          )}
        </div>

        {selectedNodeId && (
          <Card className="p-3">
            <CardContent className="p-0">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <span className="text-sm font-medium">Düğüm Rengi:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {nodeColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => changeNodeColor(color)}
                      className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: color.value, 
                        borderColor: color.border 
                      }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {isRenaming && (
          <div className="flex gap-2">
            <Input
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && finishRename()}
              placeholder="Yeni düğüm adı..."
              className="flex-1"
            />
            <Button onClick={finishRename} size="sm">
              Tamam
            </Button>
            <Button 
              onClick={() => setIsRenaming(false)} 
              variant="outline" 
              size="sm"
            >
              İptal
            </Button>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
          style={{ backgroundColor: '#f8fafc' }}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
