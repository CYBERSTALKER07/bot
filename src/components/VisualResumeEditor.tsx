import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Eye, 
  Type,
  Square,
  Circle,
  MousePointer,
  Hand,
  ZoomIn,
  ZoomOut,
  Grid,
  Undo,
  Redo,
  Copy,
  Trash2,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/cva';
import Button from './ui/Button';
import PageLayout from './ui/PageLayout';

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
}

interface CanvasElement {
  id: string;
  type: 'text' | 'shape' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  // Text properties
  content?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  textDecoration?: string;
  // Shape properties
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  shape?: 'rectangle' | 'circle' | 'line';
  // Image properties
  src?: string;
}

type Tool = 'select' | 'text' | 'shape' | 'pan';

export default function VisualResumeEditor() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Get resume data from navigation state
  const resumeData = location.state?.resumeData as ResumeData;
  
  // Canvas state
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const [isPreview, setIsPreview] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [panOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  // History for undo/redo
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Canvas dimensions
  const canvasSize = { width: 1200, height: 1600 }; // A4 ratio

  // Available fonts
  const fonts = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New'];

  // Colors for styling
  const colors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
    '#008000', '#800000', '#808080', '#c0c0c0', '#008080',
    '#1DA1F2', '#1976d2', '#424242', '#e91e63', '#9c27b0'
  ];

  // Initialize with resume data
  const initializeFromResumeData = (data: ResumeData) => {
    const initialElements: CanvasElement[] = [];
    let yOffset = 50;

    // Header
    initialElements.push({
      id: 'header-name',
      type: 'text',
      x: 50,
      y: yOffset,
      width: 600,
      height: 60,
      rotation: 0,
      zIndex: 1,
      content: data.personalInfo.fullName,
      fontSize: 36,
      fontFamily: 'Arial',
      fontWeight: 'bold',
      color: '#1DA1F2',
      textAlign: 'left'
    });

    yOffset += 80;

    // Contact info
    const contactInfo = `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}`;
    initialElements.push({
      id: 'header-contact',
      type: 'text',
      x: 50,
      y: yOffset,
      width: 600,
      height: 30,
      rotation: 0,
      zIndex: 1,
      content: contactInfo,
      fontSize: 14,
      fontFamily: 'Arial',
      color: '#666666',
      textAlign: 'left'
    });

    yOffset += 60;

    // Summary section
    if (data.personalInfo.summary) {
      initialElements.push({
        id: 'summary-title',
        type: 'text',
        x: 50,
        y: yOffset,
        width: 200,
        height: 30,
        rotation: 0,
        zIndex: 1,
        content: 'Professional Summary',
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#1DA1F2',
        textAlign: 'left'
      });

      yOffset += 40;

      initialElements.push({
        id: 'summary-content',
        type: 'text',
        x: 50,
        y: yOffset,
        width: 700,
        height: 80,
        rotation: 0,
        zIndex: 1,
        content: data.personalInfo.summary,
        fontSize: 12,
        fontFamily: 'Arial',
        color: '#333333',
        textAlign: 'left'
      });

      yOffset += 100;
    }

    // Experience section
    if (data.experience.length > 0) {
      initialElements.push({
        id: 'experience-title',
        type: 'text',
        x: 50,
        y: yOffset,
        width: 200,
        height: 30,
        rotation: 0,
        zIndex: 1,
        content: 'Experience',
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#1DA1F2',
        textAlign: 'left'
      });

      yOffset += 40;

      data.experience.forEach((exp, index) => {
        initialElements.push({
          id: `experience-${index}`,
          type: 'text',
          x: 50,
          y: yOffset,
          width: 700,
          height: 100,
          rotation: 0,
          zIndex: 1,
          content: `${exp.position}\n${exp.company} | ${exp.startDate} - ${exp.endDate}\n${exp.description}`,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          textAlign: 'left'
        });

        yOffset += 120;
      });
    }

    // Education section
    if (data.education.length > 0) {
      initialElements.push({
        id: 'education-title',
        type: 'text',
        x: 50,
        y: yOffset,
        width: 200,
        height: 30,
        rotation: 0,
        zIndex: 1,
        content: 'Education',
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#1DA1F2',
        textAlign: 'left'
      });

      yOffset += 40;

      data.education.forEach((edu, index) => {
        initialElements.push({
          id: `education-${index}`,
          type: 'text',
          x: 50,
          y: yOffset,
          width: 700,
          height: 60,
          rotation: 0,
          zIndex: 1,
          content: `${edu.degree} in ${edu.field}\n${edu.institution} | ${edu.startDate} - ${edu.endDate}`,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          textAlign: 'left'
        });

        yOffset += 80;
      });
    }

    // Skills section
    if (data.skills.length > 0) {
      initialElements.push({
        id: 'skills-title',
        type: 'text',
        x: 50,
        y: yOffset,
        width: 200,
        height: 30,
        rotation: 0,
        zIndex: 1,
        content: 'Skills',
        fontSize: 18,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        color: '#1DA1F2',
        textAlign: 'left'
      });

      yOffset += 40;

      data.skills.forEach((skillGroup, index) => {
        const skillsText = `${skillGroup.category}: ${skillGroup.items.join(', ')}`;
        initialElements.push({
          id: `skills-${index}`,
          type: 'text',
          x: 50,
          y: yOffset,
          width: 700,
          height: 40,
          rotation: 0,
          zIndex: 1,
          content: skillsText,
          fontSize: 12,
          fontFamily: 'Arial',
          color: '#333333',
          textAlign: 'left'
        });

        yOffset += 50;
      });
    }

    setElements(initialElements);
    saveToHistory(initialElements);
  };

  useEffect(() => {
    if (resumeData && elements.length === 0) {
      initializeFromResumeData(resumeData);
    }
  }, [resumeData, elements.length]);

  const saveToHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements([...history[historyIndex - 1]]);
      setSelectedElement(null);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements([...history[historyIndex + 1]]);
      setSelectedElement(null);
    }
  };

  const addTextElement = () => {
    const newElement: CanvasElement = {
      id: 'text-' + Date.now(),
      type: 'text',
      x: 100,
      y: 100,
      width: 200,
      height: 40,
      rotation: 0,
      content: 'New Text',
      fontSize: 16,
      fontFamily: 'Arial',
      color: '#000000',
      textAlign: 'left',
      zIndex: elements.length + 1
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement.id);
    saveToHistory(newElements);
  };

  const addShapeElement = (shape: 'rectangle' | 'circle') => {
    const newElement: CanvasElement = {
      id: shape + '-' + Date.now(),
      type: 'shape',
      x: 100,
      y: 100,
      width: shape === 'circle' ? 100 : 150,
      height: shape === 'circle' ? 100 : 60,
      rotation: 0,
      backgroundColor: '#f0f0f0',
      borderColor: '#000000',
      borderWidth: 2,
      shape: shape,
      zIndex: elements.length + 1
    };
    
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement.id);
    saveToHistory(newElements);
  };

  const updateElement = (id: string, updates: Partial<CanvasElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    saveToHistory(newElements);
  };

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: element.type + '-' + Date.now(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: elements.length + 1
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      setSelectedElement(newElement.id);
      saveToHistory(newElements);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - panOffset.x) / zoom;
    const y = (event.clientY - rect.top - panOffset.y) / zoom;

    if (tool === 'text') {
      addTextElement();
      setTool('select');
    } else if (tool === 'shape') {
      addShapeElement('rectangle');
      setTool('select');
    } else {
      // Check if we clicked on an element
      const clickedElement = elements
        .slice()
        .reverse()
        .find(el => 
          x >= el.x && x <= el.x + el.width &&
          y >= el.y && y <= el.y + el.height
        );

      if (clickedElement) {
        setSelectedElement(clickedElement.id);
      } else {
        setSelectedElement(null);
      }
    }
  };

  const downloadPDF = async () => {
    try {
      // Import jsPDF and html2canvas dynamically
      const { default: jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas');

      if (!canvasRef.current) return;

      // Create a temporary div with the canvas content rendered as HTML
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${canvasSize.width}px`;
      tempDiv.style.height = `${canvasSize.height}px`;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';

      // Render elements as HTML
      elements
        .sort((a, b) => a.zIndex - b.zIndex)
        .forEach(element => {
          const div = document.createElement('div');
          div.style.position = 'absolute';
          div.style.left = `${element.x}px`;
          div.style.top = `${element.y}px`;
          div.style.width = `${element.width}px`;
          div.style.height = `${element.height}px`;
          div.style.transform = `rotate(${element.rotation}deg)`;

          if (element.type === 'text') {
            div.innerHTML = (element.content || '').replace(/\n/g, '<br>');
            div.style.fontSize = `${element.fontSize}px`;
            div.style.fontFamily = element.fontFamily || 'Arial';
            div.style.fontWeight = element.fontWeight || 'normal';
            div.style.fontStyle = element.fontStyle || 'normal';
            div.style.color = element.color || '#000000';
            div.style.textAlign = element.textAlign || 'left';
            div.style.textDecoration = element.textDecoration || 'none';
            div.style.lineHeight = '1.4';
          } else if (element.type === 'shape') {
            div.style.backgroundColor = element.backgroundColor || 'transparent';
            div.style.border = `${element.borderWidth || 0}px solid ${element.borderColor || 'transparent'}`;
            if (element.shape === 'circle') {
              div.style.borderRadius = '50%';
            } else {
              div.style.borderRadius = `${element.borderRadius || 0}px`;
            }
          }

          tempDiv.appendChild(div);
        });

      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas.default(tempDiv, {
        width: canvasSize.width,
        height: canvasSize.height,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Remove temporary div
      document.body.removeChild(tempDiv);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvasSize.width, canvasSize.height]
      });

      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, canvasSize.width, canvasSize.height);

      // Download
      const fileName = resumeData?.personalInfo.fullName 
        ? `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
        : 'Resume.pdf';
      
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const saveCanvas = () => {
    localStorage.setItem('visual-resume-canvas', JSON.stringify(elements));
    alert('Canvas saved successfully!');
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(panOffset.x / zoom, panOffset.y / zoom);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = isDark ? '#333' : '#f0f0f0';
      ctx.lineWidth = 1 / zoom;
      
      const gridSize = 20;
      for (let x = 0; x <= canvasSize.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvasSize.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvasSize.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasSize.width, y);
        ctx.stroke();
      }
    }

    // Draw canvas bounds (paper)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    ctx.strokeStyle = isDark ? '#666' : '#ccc';
    ctx.lineWidth = 2 / zoom;
    ctx.strokeRect(0, 0, canvasSize.width, canvasSize.height);

    // Draw elements
    elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(element => {
        ctx.save();
        ctx.translate(element.x + element.width / 2, element.y + element.height / 2);
        ctx.rotate((element.rotation * Math.PI) / 180);
        ctx.translate(-element.width / 2, -element.height / 2);

        if (element.type === 'text') {
          // Draw text
          ctx.fillStyle = element.color || '#000000';
          ctx.font = `${element.fontStyle || 'normal'} ${element.fontWeight || 'normal'} ${element.fontSize || 16}px ${element.fontFamily || 'Arial'}`;
          ctx.textAlign = element.textAlign || 'left';
          
          const lines = (element.content || '').split('\n');
          const lineHeight = (element.fontSize || 16) * 1.4;
          
          lines.forEach((line, index) => {
            const y = index * lineHeight + (element.fontSize || 16);
            let x = 0;
            
            if (element.textAlign === 'center') {
              x = element.width / 2;
            } else if (element.textAlign === 'right') {
              x = element.width;
            }
            
            ctx.fillText(line, x, y);
            
            // Handle text decoration
            if (element.textDecoration === 'underline') {
              const textWidth = ctx.measureText(line).width;
              ctx.beginPath();
              ctx.moveTo(x - (element.textAlign === 'center' ? textWidth / 2 : element.textAlign === 'right' ? textWidth : 0), y + 2);
              ctx.lineTo(x + (element.textAlign === 'center' ? textWidth / 2 : element.textAlign === 'right' ? 0 : textWidth), y + 2);
              ctx.stroke();
            }
          });
        } else if (element.type === 'shape') {
          // Draw shape
          if (element.backgroundColor) {
            ctx.fillStyle = element.backgroundColor;
            if (element.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(element.width / 2, element.height / 2, Math.min(element.width, element.height) / 2, 0, 2 * Math.PI);
              ctx.fill();
            } else {
              ctx.fillRect(0, 0, element.width, element.height);
            }
          }
          
          if (element.borderColor && element.borderWidth) {
            ctx.strokeStyle = element.borderColor;
            ctx.lineWidth = element.borderWidth;
            if (element.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(element.width / 2, element.height / 2, Math.min(element.width, element.height) / 2, 0, 2 * Math.PI);
              ctx.stroke();
            } else {
              ctx.strokeRect(0, 0, element.width, element.height);
            }
          }
        }

        ctx.restore();

        // Draw selection indicator
        if (element.id === selectedElement) {
          ctx.strokeStyle = '#007bff';
          ctx.lineWidth = 2 / zoom;
          ctx.setLineDash([5 / zoom, 5 / zoom]);
          ctx.strokeRect(element.x - 5, element.y - 5, element.width + 10, element.height + 10);
          ctx.setLineDash([]);
          
          // Draw resize handles
          const handleSize = 8 / zoom;
          ctx.fillStyle = '#007bff';
          ctx.fillRect(element.x - handleSize / 2, element.y - handleSize / 2, handleSize, handleSize);
          ctx.fillRect(element.x + element.width - handleSize / 2, element.y - handleSize / 2, handleSize, handleSize);
          ctx.fillRect(element.x - handleSize / 2, element.y + element.height - handleSize / 2, handleSize, handleSize);
          ctx.fillRect(element.x + element.width - handleSize / 2, element.y + element.height - handleSize / 2, handleSize, handleSize);
        }
      });

    ctx.restore();
  };

  useEffect(() => {
    renderCanvas();
  }, [elements, selectedElement, zoom, panOffset, showGrid, isDark]);

  const selectedElementData = elements.find(el => el.id === selectedElement);

  if (!resumeData) {
    return (
      <PageLayout className={isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}>
        <div className="text-center py-16">
          <p className="text-gray-500 mb-4">No resume data available. Please go back to the Resume Builder.</p>
          <Button
            onClick={() => navigate('/resume-builder')}
            className="bg-info-500 text-white"
          >
            Go to Resume Builder
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout className={isDark ? 'bg-black text-white' : 'bg-gray-50 text-black'}>
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 backdrop-blur-sm border-b",
        isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'
      )}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate(-1)}
                variant="text"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <h1 className={cn(
                "text-2xl font-bold",
                isDark ? 'text-white' : 'text-black'
              )}>Visual Resume Editor</h1>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setIsPreview(!isPreview)}
                variant={isPreview ? "filled" : "outlined"}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                onClick={saveCanvas}
                variant="outlined"
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button
                onClick={downloadPDF}
                className="bg-info-500 text-white hover:bg-info-600 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Left Toolbar */}
        {!isPreview && (
          <div className={cn(
            "w-64 border-r p-4 overflow-y-auto",
            isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
          )}>
            {/* Tools */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'select', icon: MousePointer, label: 'Select' },
                  { id: 'text', icon: Type, label: 'Text' },
                  { id: 'shape', icon: Square, label: 'Shape' },
                  { id: 'pan', icon: Hand, label: 'Pan' }
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setTool(id as Tool)}
                    className={cn(
                      "p-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1",
                      tool === id
                        ? 'bg-info-500 text-white border-info-500'
                        : isDark
                          ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    )}
                    title={`Select ${label} tool`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">Add Elements</h3>
              <div className="space-y-2">
                <Button
                  onClick={addTextElement}
                  variant="outlined"
                  size="small"
                  className="w-full justify-start"
                >
                  <Type className="w-4 h-4 mr-2" />
                  Add Text
                </Button>
                <Button
                  onClick={() => addShapeElement('rectangle')}
                  variant="outlined"
                  size="small"
                  className="w-full justify-start"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Add Rectangle
                </Button>
                <Button
                  onClick={() => addShapeElement('circle')}
                  variant="outlined"
                  size="small"
                  className="w-full justify-start"
                >
                  <Circle className="w-4 h-4 mr-2" />
                  Add Circle
                </Button>
              </div>
            </div>

            {/* History */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">History</h3>
              <div className="flex gap-2">
                <Button
                  onClick={undo}
                  variant="outlined"
                  size="small"
                  disabled={historyIndex <= 0}
                  className="flex-1"
                >
                  <Undo className="w-4 h-4" />
                </Button>
                <Button
                  onClick={redo}
                  variant="outlined"
                  size="small"
                  disabled={historyIndex >= history.length - 1}
                  className="flex-1"
                >
                  <Redo className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* View Controls */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3">View</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                    variant="outlined"
                    size="small"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm flex-1 text-center">{Math.round(zoom * 100)}%</span>
                  <Button
                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    variant="outlined"
                    size="small"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={() => setShowGrid(!showGrid)}
                  variant={showGrid ? "filled" : "outlined"}
                  size="small"
                  className="w-full justify-start"
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Grid
                </Button>
              </div>
            </div>

            {/* Element Properties */}
            {selectedElementData && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3">Properties</h3>
                <div className="space-y-3">
                  {selectedElementData.type === 'text' && (
                    <>
                      <div>
                        <label className="text-xs font-medium block mb-1">Content</label>
                        <textarea
                          value={selectedElementData.content || ''}
                          onChange={(e) => updateElement(selectedElementData.id, { content: e.target.value })}
                          className={cn(
                            "w-full p-2 rounded border text-sm",
                            isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                          )}
                          rows={3}
                          placeholder="Enter text content"
                          title="Text content"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1">Font Size</label>
                        <input
                          type="number"
                          value={selectedElementData.fontSize || 16}
                          onChange={(e) => updateElement(selectedElementData.id, { fontSize: parseInt(e.target.value) })}
                          className={cn(
                            "w-full p-2 rounded border text-sm",
                            isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                          )}
                          min="8"
                          max="72"
                          title="Font size in pixels"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1">Font Family</label>
                        <select
                          value={selectedElementData.fontFamily || 'Arial'}
                          onChange={(e) => updateElement(selectedElementData.id, { fontFamily: e.target.value })}
                          className={cn(
                            "w-full p-2 rounded border text-sm",
                            isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                          )}
                          title="Font family"
                        >
                          {fonts.map(font => (
                            <option key={font} value={font}>{font}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateElement(selectedElementData.id, { 
                            fontWeight: selectedElementData.fontWeight === 'bold' ? 'normal' : 'bold' 
                          })}
                          variant={selectedElementData.fontWeight === 'bold' ? "filled" : "outlined"}
                          size="small"
                          title="Toggle bold"
                        >
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => updateElement(selectedElementData.id, { 
                            fontStyle: selectedElementData.fontStyle === 'italic' ? 'normal' : 'italic' 
                          })}
                          variant={selectedElementData.fontStyle === 'italic' ? "filled" : "outlined"}
                          size="small"
                          title="Toggle italic"
                        >
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => updateElement(selectedElementData.id, { 
                            textDecoration: selectedElementData.textDecoration === 'underline' ? 'none' : 'underline' 
                          })}
                          variant={selectedElementData.textDecoration === 'underline' ? "filled" : "outlined"}
                          size="small"
                          title="Toggle underline"
                        >
                          <Underline className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {[
                          { align: 'left', icon: AlignLeft },
                          { align: 'center', icon: AlignCenter },
                          { align: 'right', icon: AlignRight }
                        ].map(({ align, icon: Icon }) => (
                          <Button
                            key={align}
                            onClick={() => updateElement(selectedElementData.id, { textAlign: align as 'left' | 'center' | 'right' })}
                            variant={selectedElementData.textAlign === align ? "filled" : "outlined"}
                            size="small"
                            title={`Align ${align}`}
                          >
                            <Icon className="w-4 h-4" />
                          </Button>
                        ))}
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1">Color</label>
                        <div className="flex flex-wrap gap-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => updateElement(selectedElementData.id, { color })}
                              className={cn(
                                "w-6 h-6 rounded border-2",
                                selectedElementData.color === color ? 'border-info-500' : 'border-gray-300'
                              )}
                              style={{ backgroundColor: color }}
                              title={`Select color ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {selectedElementData.type === 'shape' && (
                    <>
                      <div>
                        <label className="text-xs font-medium block mb-1">Background Color</label>
                        <div className="flex flex-wrap gap-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => updateElement(selectedElementData.id, { backgroundColor: color })}
                              className={cn(
                                "w-6 h-6 rounded border-2",
                                selectedElementData.backgroundColor === color ? 'border-info-500' : 'border-gray-300'
                              )}
                              style={{ backgroundColor: color }}
                              title={`Select background color ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1">Border Color</label>
                        <div className="flex flex-wrap gap-1">
                          {colors.map(color => (
                            <button
                              key={color}
                              onClick={() => updateElement(selectedElementData.id, { borderColor: color })}
                              className={cn(
                                "w-6 h-6 rounded border-2",
                                selectedElementData.borderColor === color ? 'border-info-500' : 'border-gray-300'
                              )}
                              style={{ backgroundColor: color }}
                              title={`Select border color ${color}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1">Border Width</label>
                        <input
                          type="number"
                          value={selectedElementData.borderWidth || 0}
                          onChange={(e) => updateElement(selectedElementData.id, { borderWidth: parseInt(e.target.value) })}
                          className={cn(
                            "w-full p-2 rounded border text-sm",
                            isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                          )}
                          min="0"
                          max="20"
                          title="Border width in pixels"
                        />
                      </div>
                    </>
                  )}

                  {/* Common properties */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium block mb-1">X Position</label>
                      <input
                        type="number"
                        value={Math.round(selectedElementData.x)}
                        onChange={(e) => updateElement(selectedElementData.id, { x: parseInt(e.target.value) })}
                        className={cn(
                          "w-full p-2 rounded border text-sm",
                          isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        )}
                        title="X position"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1">Y Position</label>
                      <input
                        type="number"
                        value={Math.round(selectedElementData.y)}
                        onChange={(e) => updateElement(selectedElementData.id, { y: parseInt(e.target.value) })}
                        className={cn(
                          "w-full p-2 rounded border text-sm",
                          isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        )}
                        title="Y position"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium block mb-1">Width</label>
                      <input
                        type="number"
                        value={Math.round(selectedElementData.width)}
                        onChange={(e) => updateElement(selectedElementData.id, { width: parseInt(e.target.value) })}
                        className={cn(
                          "w-full p-2 rounded border text-sm",
                          isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        )}
                        min="10"
                        title="Element width"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1">Height</label>
                      <input
                        type="number"
                        value={Math.round(selectedElementData.height)}
                        onChange={(e) => updateElement(selectedElementData.id, { height: parseInt(e.target.value) })}
                        className={cn(
                          "w-full p-2 rounded border text-sm",
                          isDark ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300 text-black'
                        )}
                        min="10"
                        title="Element height"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => duplicateElement(selectedElementData.id)}
                      variant="outlined"
                      size="small"
                      className="flex-1"
                      title="Duplicate element"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteElement(selectedElementData.id)}
                      variant="outlined"
                      size="small"
                      className="flex-1 text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                      title="Delete element"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className={cn(
              "p-4 rounded-lg border",
              isDark ? 'bg-gray-800 border-gray-600' : 'bg-info-50 border-info-200'
            )}>
              <h4 className="font-semibold mb-2">How to Use</h4>
              <ul className="text-sm space-y-1">
                <li>• Click elements to select them</li>
                <li>• Use tools to add new elements</li>
                <li>• Edit properties in the panel</li>
                <li>• Download as PDF when ready</li>
              </ul>
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 overflow-hidden relative">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            onClick={handleCanvasClick}
            className={cn(
              "w-full h-full",
              tool === 'text' && 'cursor-text',
              tool === 'shape' && 'cursor-crosshair',
              tool === 'pan' && 'cursor-grab',
              tool === 'select' && 'cursor-default'
            )}
          />
        </div>
      </div>
    </PageLayout>
  );
}