'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ComponentType,
  CircuitNode,
  CircuitWire,
  CircuitState,
  simulateCircuit,
  generateTruthTableFromCircuit,
  TruthTableSimulationResult,
  PREBUILT_TEMPLATES
} from '@/lib/logic-engine/simulator-engine';
import {
  Sliders,
  Plus,
  Trash2,
  RotateCcw,
  Play,
  Table,
  Download,
  Upload,
  Cpu,
  Zap,
  Lightbulb,
  Radio,
  CheckCircle2,
  X
} from 'lucide-react';

export default function SimulatorPage() {
  // Initial state loaded with Half Adder
  const [circuit, setCircuit] = useState<CircuitState>(PREBUILT_TEMPLATES.halfAdder.state);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [wiringStart, setWiringStart] = useState<{ nodeId: string; portId: string } | null>(null);
  const [generatedTable, setGeneratedTable] = useState<TruthTableSimulationResult | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Run simulation whenever nodes or wires change
  useEffect(() => {
    const simulated = simulateCircuit(circuit);
    // Only update if state actually changed to avoid infinite loop
    const hasChanged = JSON.stringify(simulated) !== JSON.stringify(circuit);
    if (hasChanged) {
      setCircuit(simulated);
    }
  }, [circuit.nodes, circuit.wires]);

  // Toggle switch node
  const handleToggleSwitch = (nodeId: string) => {
    setCircuit(prev => {
      const nextNodes = prev.nodes.map(n => {
        if (n.id === nodeId && n.type === 'SWITCH') {
          const nextActive = !n.state?.active;
          return {
            ...n,
            state: { ...n.state, active: nextActive },
            outputs: { out: nextActive ? 1 : 0 }
          };
        }
        return n;
      });
      return simulateCircuit({ ...prev, nodes: nextNodes });
    });
  };

  // Add component
  const handleAddComponent = (type: ComponentType, label: string) => {
    const id = `${type.toLowerCase()}_${Date.now()}`;
    const newNode: CircuitNode = {
      id,
      type,
      label,
      x: 200 + (circuit.nodes.length % 5) * 40,
      y: 120 + (circuit.nodes.length % 4) * 30,
      inputs: type === 'NOT' || type === 'BUFFER' || type === 'LED' || type === 'PROBE' ? { in: 0 } : { in1: 0, in2: 0 },
      outputs: type === 'LED' || type === 'PROBE' ? {} : { out: 0 },
      state: type === 'SWITCH' ? { active: false } : type === 'LED' ? { lit: 0 } : undefined
    };

    setCircuit(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  };

  // Delete node
  const handleDeleteSelected = () => {
    if (!selectedNodeId) return;
    setCircuit(prev => ({
      nodes: prev.nodes.filter(n => n.id !== selectedNodeId),
      wires: prev.wires.filter(w => w.fromNodeId !== selectedNodeId && w.toNodeId !== selectedNodeId)
    }));
    setSelectedNodeId(null);
  };

  // Wire creation: click output pin, then click input pin
  const handlePinClick = (nodeId: string, portId: string, isOutput: boolean) => {
    if (!wiringStart) {
      if (isOutput) {
        setWiringStart({ nodeId, portId });
      }
    } else {
      if (!isOutput && wiringStart.nodeId !== nodeId) {
        // Connect wire
        const newWire: CircuitWire = {
          id: `w_${Date.now()}`,
          fromNodeId: wiringStart.nodeId,
          fromPortId: wiringStart.portId,
          toNodeId: nodeId,
          toPortId: portId,
          signal: 0
        };
        setCircuit(prev => simulateCircuit({ ...prev, wires: [...prev.wires, newWire] }));
      }
      setWiringStart(null);
    }
  };

  // Load prebuilt template
  const handleLoadTemplate = (key: string) => {
    const tmpl = PREBUILT_TEMPLATES[key];
    if (tmpl) {
      setCircuit(simulateCircuit(tmpl.state));
      setSelectedNodeId(null);
      setWiringStart(null);
    }
  };

  // Generate Truth Table
  const handleGenerateTruthTable = () => {
    const res = generateTruthTableFromCircuit(circuit);
    if (res) {
      setGeneratedTable(res);
      setIsTableModalOpen(true);
    } else {
      alert('To generate a truth table, the circuit must contain at least one input SWITCH and at least one output LED/PROBE.');
    }
  };

  // Dragging mechanics
  const handleMouseDownNode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setSelectedNodeId(nodeId);
    setDraggingNodeId(nodeId);
    const node = circuit.nodes.find(n => n.id === nodeId);
    if (node && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setDragOffset({
        x: (e.clientX - rect.left) - node.x,
        y: (e.clientY - rect.top) - node.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNodeId && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const newX = Math.max(20, Math.min(rect.width - 120, (e.clientX - rect.left) - dragOffset.x));
      const newY = Math.max(20, Math.min(rect.height - 80, (e.clientY - rect.top) - dragOffset.y));

      setCircuit(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n)
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  // Reset circuit
  const handleResetCircuit = () => {
    setCircuit(prev => {
      const resetNodes = prev.nodes.map(n => {
        if (n.type === 'SWITCH') {
          return { ...n, state: { ...n.state, active: false }, outputs: { out: 0 } };
        }
        return n;
      });
      return simulateCircuit({ ...prev, nodes: resetNodes });
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 flex-1 flex flex-col">
      {/* Header & Preset Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-mono mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Virtual Breadboard & Gate Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Digital Logic Circuit Simulator
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Prebuilt Templates Selector */}
          <select
            onChange={e => handleLoadTemplate(e.target.value)}
            defaultValue="halfAdder"
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
          >
            <option value="halfAdder">Template: Half Adder</option>
            <option value="fullAdder">Template: Full Adder</option>
            <option value="srLatch">Template: SR Latch</option>
            <option value="mux2to1">Template: 2-to-1 Multiplexer</option>
          </select>

          {/* Truth Table Generator Button */}
          <button
            onClick={handleGenerateTruthTable}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs transition-all cursor-pointer"
          >
            <Table className="w-4 h-4" />
            <span>Generate Truth Table</span>
          </button>

          {/* Reset Circuit */}
          <button
            onClick={handleResetCircuit}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            title="Reset All Switches"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Delete Selected Node */}
          {selectedNodeId && (
            <button
              onClick={handleDeleteSelected}
              className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors cursor-pointer"
              title="Delete Selected Component"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Component Palette Strip */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 pl-1 shrink-0">
          Add Component:
        </span>

        {/* Inputs */}
        <button
          onClick={() => handleAddComponent('SWITCH', 'Switch')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-cyan-500" />
          <span>+ Switch</span>
        </button>

        <button
          onClick={() => handleAddComponent('VCC', 'VCC (1)')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
        >
          <span>+ VCC (+5V)</span>
        </button>

        <button
          onClick={() => handleAddComponent('GND', 'GND (0)')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-700 dark:text-slate-300 shrink-0 cursor-pointer"
        >
          <span>+ GND (0V)</span>
        </button>

        {/* Gates */}
        {['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'].map(gate => (
          <button
            key={gate}
            onClick={() => handleAddComponent(gate as ComponentType, gate)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-xs font-mono font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900 shrink-0 cursor-pointer"
          >
            <span>+ {gate}</span>
          </button>
        ))}

        {/* Outputs */}
        <button
          onClick={() => handleAddComponent('LED', 'LED Output')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 shrink-0 cursor-pointer"
        >
          <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
          <span>+ LED Output</span>
        </button>
      </div>

      {/* Simulator Workspace Canvas */}
      <div
        className="flex-1 min-h-[520px] rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden select-none cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => {
          setSelectedNodeId(null);
          setWiringStart(null);
        }}
      >
        {/* Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #0284c7 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Wiring in progress indicator banner */}
        {wiringStart && (
          <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono flex items-center gap-2 animate-pulse">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Connecting wire from {wiringStart.nodeId}... click destination input pin to complete.</span>
            <button onClick={() => setWiringStart(null)} className="ml-2 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <svg
          ref={svgRef}
          className="w-full h-full min-h-[520px]"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            <filter id="sim-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="sim-led-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Wires */}
          {circuit.wires.map(wire => {
            const fromNode = circuit.nodes.find(n => n.id === wire.fromNodeId);
            const toNode = circuit.nodes.find(n => n.id === wire.toNodeId);
            if (!fromNode || !toNode) return null;

            // Pin coordinates
            const x1 = fromNode.x + 85;
            const y1 = fromNode.y + 35;
            const x2 = toNode.x;
            const y2 = toNode.y + (wire.toPortId === 'in2' ? 50 : 20);

            // Bezier control points for smooth wire routing
            const dx = Math.abs(x2 - x1) * 0.5;
            const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

            const isHigh = wire.signal === 1;

            return (
              <g key={wire.id} className="cursor-pointer group" onClick={e => {
                e.stopPropagation();
                // Delete wire on click
                setCircuit(prev => ({
                  ...prev,
                  wires: prev.wires.filter(w => w.id !== wire.id)
                }));
              }}>
                {/* Invisible wide hit area for easy clicking */}
                <path d={d} fill="none" stroke="transparent" strokeWidth="16" />
                <path
                  d={d}
                  fill="none"
                  stroke={isHigh ? '#06b6d4' : '#334155'}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter={isHigh ? 'url(#sim-glow)' : undefined}
                  className="transition-colors group-hover:stroke-rose-500"
                />
              </g>
            );
          })}

          {/* Render Nodes */}
          {circuit.nodes.map(node => {
            const isSelected = node.id === selectedNodeId;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseDown={e => handleMouseDownNode(e, node.id)}
                className="cursor-move"
              >
                {/* Node Box */}
                <rect
                  x="0"
                  y="0"
                  width="85"
                  height="70"
                  rx="10"
                  fill="#0f172a"
                  stroke={isSelected ? '#38bdf8' : '#1e293b'}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  className="shadow-xl"
                />

                {/* Node Label */}
                <text
                  x="42"
                  y="22"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {node.label}
                </text>

                {/* Render Switch Node Specifics */}
                {node.type === 'SWITCH' && (
                  <g
                    transform="translate(18, 30)"
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleSwitch(node.id);
                    }}
                    className="cursor-pointer"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="50"
                      height="24"
                      rx="12"
                      fill={node.state?.active ? '#06b6d4' : '#334155'}
                      className="transition-colors"
                    />
                    <circle
                      cx={node.state?.active ? '38' : '12'}
                      cy="12"
                      r="9"
                      fill="#ffffff"
                      className="transition-all"
                    />
                    <text
                      x="25"
                      y="16"
                      fill="#0f172a"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.state?.active ? '1' : '0'}
                    </text>
                  </g>
                )}

                {/* Render Gate Node Icon */}
                {['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR', 'BUFFER'].includes(node.type) && (
                  <text
                    x="42"
                    y="46"
                    fill="#38bdf8"
                    fontSize="14"
                    fontWeight="extrabold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {node.type}
                  </text>
                )}

                {/* Render LED Node Specifics */}
                {(node.type === 'LED' || node.type === 'PROBE') && (
                  <g transform="translate(42, 45)">
                    <circle
                      cx="0"
                      cy="0"
                      r="16"
                      fill={node.state?.lit ? '#10b981' : '#1e293b'}
                      stroke={node.state?.lit ? '#34d399' : '#475569'}
                      strokeWidth="2.5"
                      filter={node.state?.lit ? 'url(#sim-led-glow)' : undefined}
                    />
                    <text
                      x="0"
                      y="5"
                      fill={node.state?.lit ? '#ffffff' : '#64748b'}
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {node.state?.lit ? '1' : '0'}
                    </text>
                  </g>
                )}

                {/* Input Pins (Left side) */}
                {Object.keys(node.inputs).map((portId, pIdx) => {
                  const py = Object.keys(node.inputs).length === 1 ? 35 : pIdx === 0 ? 20 : 50;
                  const isHigh = node.inputs[portId] === 1;

                  return (
                    <circle
                      key={portId}
                      cx="0"
                      cy={py}
                      r="6"
                      fill={isHigh ? '#06b6d4' : '#475569'}
                      stroke="#0f172a"
                      strokeWidth="2"
                      onClick={e => {
                        e.stopPropagation();
                        handlePinClick(node.id, portId, false);
                      }}
                      className="cursor-pointer hover:scale-150 transition-transform"
                    />
                  );
                })}

                {/* Output Pin (Right side) */}
                {Object.keys(node.outputs).map(portId => {
                  const isHigh = node.outputs[portId] === 1;
                  return (
                    <circle
                      key={portId}
                      cx="85"
                      cy="35"
                      r="6"
                      fill={isHigh ? '#10b981' : '#475569'}
                      stroke="#0f172a"
                      strokeWidth="2"
                      onClick={e => {
                        e.stopPropagation();
                        handlePinClick(node.id, portId, true);
                      }}
                      className="cursor-pointer hover:scale-150 transition-transform"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Generated Truth Table Modal */}
      {isTableModalOpen && generatedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-lg">Synthesized Truth Table</h3>
              </div>
              <button
                onClick={() => setIsTableModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Automatically evaluated across all 2^{generatedTable.inputs.length} = {generatedTable.rows.length} input switch states.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-center text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                    <th className="py-2.5 px-3">#</th>
                    {generatedTable.inputs.map((inp, i) => (
                      <th key={i} className="py-2.5 px-3 text-cyan-400 bg-cyan-950/20">
                        {inp}
                      </th>
                    ))}
                    {generatedTable.outputs.map((out, i) => (
                      <th key={i} className="py-2.5 px-3 text-emerald-400 bg-emerald-950/20">
                        {out}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {generatedTable.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="py-2.5 px-3 text-slate-500">{idx + 1}</td>
                      {row.inputs.map((inVal, i) => (
                        <td key={i} className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded ${inVal === 1 ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-500'}`}>
                            {inVal}
                          </span>
                        </td>
                      ))}
                      {row.outputs.map((outVal, i) => (
                        <td key={i} className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded ${outVal === 1 ? 'bg-emerald-950 text-emerald-300 font-bold' : 'text-slate-500'}`}>
                            {outVal}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsTableModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
