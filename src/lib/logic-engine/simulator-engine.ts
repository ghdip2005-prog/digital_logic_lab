// Digital Logic Circuit Graph & Simulation Engine

export type ComponentType =
  | 'SWITCH'
  | 'CLOCK'
  | 'VCC'
  | 'GND'
  | 'AND'
  | 'OR'
  | 'NOT'
  | 'NAND'
  | 'NOR'
  | 'XOR'
  | 'XNOR'
  | 'BUFFER'
  | 'LED'
  | 'PROBE'
  | 'SEVEN_SEGMENT';

export interface Port {
  id: string;
  name: string;
  type: 'in' | 'out';
  x: number; // relative to node
  y: number; // relative to node
}

export interface CircuitNode {
  id: string;
  type: ComponentType;
  label: string;
  x: number;
  y: number;
  inputs: { [portId: string]: number }; // 0 or 1
  outputs: { [portId: string]: number }; // 0 or 1
  state?: any; // internal state (e.g. switch toggled, clock frequency)
}

export interface CircuitWire {
  id: string;
  fromNodeId: string;
  fromPortId: string;
  toNodeId: string;
  toPortId: string;
  signal: number; // 0 or 1
}

export interface CircuitState {
  nodes: CircuitNode[];
  wires: CircuitWire[];
}

export interface TruthTableSimulationResult {
  inputs: string[];
  outputs: string[];
  rows: { inputs: number[]; outputs: number[] }[];
}

/**
 * Gate evaluation helper
 */
export function evaluateGate(type: ComponentType, inputs: number[]): number {
  switch (type) {
    case 'AND':
      return inputs.length > 0 && inputs.every(v => v === 1) ? 1 : 0;
    case 'OR':
      return inputs.some(v => v === 1) ? 1 : 0;
    case 'NOT':
      return inputs[0] === 1 ? 0 : 1;
    case 'NAND':
      return inputs.length > 0 && inputs.every(v => v === 1) ? 0 : 1;
    case 'NOR':
      return inputs.some(v => v === 1) ? 0 : 1;
    case 'XOR': {
      // Modulo 2 sum
      const count1s = inputs.filter(v => v === 1).length;
      return count1s % 2 === 1 ? 1 : 0;
    }
    case 'XNOR': {
      const count1s = inputs.filter(v => v === 1).length;
      return count1s % 2 === 0 ? 1 : 0;
    }
    case 'BUFFER':
      return inputs[0] === 1 ? 1 : 0;
    default:
      return 0;
  }
}

/**
 * Evaluates the circuit by propagating signals until steady state or max iterations reached
 */
export function simulateCircuit(state: CircuitState, maxIterations = 25): CircuitState {
  const updatedNodes = state.nodes.map(n => ({
    ...n,
    inputs: { ...n.inputs },
    outputs: { ...n.outputs }
  }));

  const updatedWires = state.wires.map(w => ({ ...w }));

  let hasChanged = true;
  let iter = 0;

  while (hasChanged && iter < maxIterations) {
    hasChanged = false;
    iter++;

    // 1. Evaluate node outputs based on current inputs or static sources
    for (const node of updatedNodes) {
      if (node.type === 'SWITCH') {
        const outVal = node.state?.active ? 1 : 0;
        if (node.outputs['out'] !== outVal) {
          node.outputs['out'] = outVal;
          hasChanged = true;
        }
      } else if (node.type === 'VCC') {
        if (node.outputs['out'] !== 1) {
          node.outputs['out'] = 1;
          hasChanged = true;
        }
      } else if (node.type === 'GND') {
        if (node.outputs['out'] !== 0) {
          node.outputs['out'] = 0;
          hasChanged = true;
        }
      } else if (node.type === 'CLOCK') {
        const outVal = node.state?.active ? 1 : 0;
        if (node.outputs['out'] !== outVal) {
          node.outputs['out'] = outVal;
          hasChanged = true;
        }
      } else if (['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'].includes(node.type)) {
        // Collect in1 and in2
        const inVals = [node.inputs['in1'] || 0, node.inputs['in2'] || 0];
        const calculatedOut = evaluateGate(node.type, inVals);
        if (node.outputs['out'] !== calculatedOut) {
          node.outputs['out'] = calculatedOut;
          hasChanged = true;
        }
      } else if (node.type === 'NOT' || node.type === 'BUFFER') {
        const inVal = [node.inputs['in'] || 0];
        const calculatedOut = evaluateGate(node.type, inVal);
        if (node.outputs['out'] !== calculatedOut) {
          node.outputs['out'] = calculatedOut;
          hasChanged = true;
        }
      } else if (node.type === 'LED' || node.type === 'PROBE') {
        const inVal = node.inputs['in'] || 0;
        if (node.state?.lit !== inVal) {
          node.state = { ...node.state, lit: inVal };
          hasChanged = true;
        }
      }
    }

    // 2. Propagate signals through wires
    for (const wire of updatedWires) {
      const sourceNode = updatedNodes.find(n => n.id === wire.fromNodeId);
      const targetNode = updatedNodes.find(n => n.id === wire.toNodeId);

      if (sourceNode && targetNode) {
        const signal = sourceNode.outputs[wire.fromPortId] ?? 0;
        if (wire.signal !== signal) {
          wire.signal = signal;
          hasChanged = true;
        }
        if (targetNode.inputs[wire.toPortId] !== signal) {
          targetNode.inputs[wire.toPortId] = signal;
          hasChanged = true;
        }
      }
    }
  }

  return {
    nodes: updatedNodes,
    wires: updatedWires
  };
}

/**
 * Automatically sweeps through all combinations of switch inputs and generates a verified Truth Table
 */
export function generateTruthTableFromCircuit(state: CircuitState): TruthTableSimulationResult | null {
  const switchNodes = state.nodes.filter(n => n.type === 'SWITCH').sort((a, b) => a.label.localeCompare(b.label));
  const outputNodes = state.nodes.filter(n => n.type === 'LED' || n.type === 'PROBE').sort((a, b) => a.label.localeCompare(b.label));

  if (switchNodes.length === 0 || outputNodes.length === 0) {
    return null;
  }

  const numInputs = switchNodes.length;
  const totalCombinations = Math.pow(2, numInputs);
  const rows: { inputs: number[]; outputs: number[] }[] = [];

  for (let c = 0; c < totalCombinations; c++) {
    // Determine bit for each input
    const inputVals: number[] = [];
    const testState: CircuitState = {
      nodes: state.nodes.map(n => ({
        ...n,
        inputs: { ...n.inputs },
        outputs: { ...n.outputs },
        state: { ...n.state }
      })),
      wires: state.wires.map(w => ({ ...w }))
    };

    for (let i = 0; i < numInputs; i++) {
      // Most significant input is index 0
      const bit = (c >> (numInputs - 1 - i)) & 1;
      inputVals.push(bit);

      const targetSwitch = testState.nodes.find(n => n.id === switchNodes[i].id);
      if (targetSwitch) {
        targetSwitch.state = { ...targetSwitch.state, active: bit === 1 };
        targetSwitch.outputs['out'] = bit;
      }
    }

    // Simulate circuit for this combination
    const simulated = simulateCircuit(testState);

    // Read outputs
    const outputVals: number[] = [];
    for (const outNode of outputNodes) {
      const match = simulated.nodes.find(n => n.id === outNode.id);
      outputVals.push(match?.inputs['in'] || 0);
    }

    rows.push({
      inputs: inputVals,
      outputs: outputVals
    });
  }

  return {
    inputs: switchNodes.map(s => s.label || s.id),
    outputs: outputNodes.map(o => o.label || o.id),
    rows
  };
}

/**
 * Prebuilt Circuit Templates
 */
export const PREBUILT_TEMPLATES: { [key: string]: { name: string; description: string; state: CircuitState } } = {
  halfAdder: {
    name: 'Half Adder',
    description: 'Computes Sum (A ⊕ B) and Carry (A · B) using XOR and AND gates.',
    state: {
      nodes: [
        { id: 'in_a', type: 'SWITCH', label: 'Input A', x: 80, y: 100, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'in_b', type: 'SWITCH', label: 'Input B', x: 80, y: 220, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'gate_xor', type: 'XOR', label: 'XOR (Sum)', x: 300, y: 90, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'gate_and', type: 'AND', label: 'AND (Carry)', x: 300, y: 230, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'led_sum', type: 'LED', label: 'Sum (S)', x: 520, y: 90, inputs: { in: 0 }, outputs: {}, state: { lit: 0 } },
        { id: 'led_carry', type: 'LED', label: 'Carry (C)', x: 520, y: 230, inputs: { in: 0 }, outputs: {}, state: { lit: 0 } }
      ],
      wires: [
        { id: 'w1', fromNodeId: 'in_a', fromPortId: 'out', toNodeId: 'gate_xor', toPortId: 'in1', signal: 0 },
        { id: 'w2', fromNodeId: 'in_b', fromPortId: 'out', toNodeId: 'gate_xor', toPortId: 'in2', signal: 0 },
        { id: 'w3', fromNodeId: 'in_a', fromPortId: 'out', toNodeId: 'gate_and', toPortId: 'in1', signal: 0 },
        { id: 'w4', fromNodeId: 'in_b', fromPortId: 'out', toNodeId: 'gate_and', toPortId: 'in2', signal: 0 },
        { id: 'w5', fromNodeId: 'gate_xor', fromPortId: 'out', toNodeId: 'led_sum', toPortId: 'in', signal: 0 },
        { id: 'w6', fromNodeId: 'gate_and', fromPortId: 'out', toNodeId: 'led_carry', toPortId: 'in', signal: 0 }
      ]
    }
  },
  fullAdder: {
    name: 'Full Adder',
    description: '3-input adder (A, B, Cin) producing Sum and Cout with cascaded half adders and OR.',
    state: {
      nodes: [
        { id: 'in_a', type: 'SWITCH', label: 'A', x: 60, y: 80, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'in_b', type: 'SWITCH', label: 'B', x: 60, y: 160, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'in_cin', type: 'SWITCH', label: 'Cin', x: 60, y: 260, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'xor1', type: 'XOR', label: 'XOR 1', x: 220, y: 110, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'xor2', type: 'XOR', label: 'XOR 2 (Sum)', x: 420, y: 140, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'and1', type: 'AND', label: 'AND 1', x: 280, y: 240, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'and2', type: 'AND', label: 'AND 2', x: 420, y: 280, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'or1', type: 'OR', label: 'OR (Cout)', x: 580, y: 260, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'led_sum', type: 'LED', label: 'Sum', x: 620, y: 140, inputs: { in: 0 }, outputs: {}, state: { lit: 0 } },
        { id: 'led_cout', type: 'LED', label: 'Cout', x: 740, y: 260, inputs: { in: 0 }, outputs: {}, state: { lit: 0 } }
      ],
      wires: [
        { id: 'w1', fromNodeId: 'in_a', fromPortId: 'out', toNodeId: 'xor1', toPortId: 'in1', signal: 0 },
        { id: 'w2', fromNodeId: 'in_b', fromPortId: 'out', toNodeId: 'xor1', toPortId: 'in2', signal: 0 },
        { id: 'w3', fromNodeId: 'xor1', fromPortId: 'out', toNodeId: 'xor2', toPortId: 'in1', signal: 0 },
        { id: 'w4', fromNodeId: 'in_cin', fromPortId: 'out', toNodeId: 'xor2', toPortId: 'in2', signal: 0 },
        { id: 'w5', fromNodeId: 'xor2', fromPortId: 'out', toNodeId: 'led_sum', toPortId: 'in', signal: 0 },
        { id: 'w6', fromNodeId: 'in_a', fromPortId: 'out', toNodeId: 'and1', toPortId: 'in1', signal: 0 },
        { id: 'w7', fromNodeId: 'in_b', fromPortId: 'out', toNodeId: 'and1', toPortId: 'in2', signal: 0 },
        { id: 'w8', fromNodeId: 'xor1', fromPortId: 'out', toNodeId: 'and2', toPortId: 'in1', signal: 0 },
        { id: 'w9', fromNodeId: 'in_cin', fromPortId: 'out', toNodeId: 'and2', toPortId: 'in2', signal: 0 },
        { id: 'w10', fromNodeId: 'and2', fromPortId: 'out', toNodeId: 'or1', toPortId: 'in1', signal: 0 },
        { id: 'w11', fromNodeId: 'and1', fromPortId: 'out', toNodeId: 'or1', toPortId: 'in2', signal: 0 },
        { id: 'w12', fromNodeId: 'or1', fromPortId: 'out', toNodeId: 'led_cout', toPortId: 'in', signal: 0 }
      ]
    }
  },
  srLatch: {
    name: 'SR Latch (NOR-based)',
    description: 'Fundamental bistable multivibrator storing 1-bit memory using cross-coupled NOR gates.',
    state: {
      nodes: [
        { id: 'in_r', type: 'SWITCH', label: 'Reset (R)', x: 60, y: 100, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'in_s', type: 'SWITCH', label: 'Set (S)', x: 60, y: 260, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'nor1', type: 'NOR', label: 'NOR 1', x: 260, y: 110, inputs: { in1: 0, in2: 0 }, outputs: { out: 1 } },
        { id: 'nor2', type: 'NOR', label: 'NOR 2', x: 260, y: 250, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'led_q', type: 'LED', label: 'Q Output', x: 500, y: 110, inputs: { in: 1 }, outputs: {}, state: { lit: 1 } },
        { id: 'led_qbar', type: 'LED', label: "Q' Output", x: 500, y: 250, inputs: { in: 0 }, outputs: {}, state: { lit: 0 } }
      ],
      wires: [
        { id: 'w1', fromNodeId: 'in_r', fromPortId: 'out', toNodeId: 'nor1', toPortId: 'in1', signal: 0 },
        { id: 'w2', fromNodeId: 'in_s', fromPortId: 'out', toNodeId: 'nor2', toPortId: 'in2', signal: 0 },
        { id: 'w3', fromNodeId: 'nor1', fromPortId: 'out', toNodeId: 'led_q', toPortId: 'in', signal: 1 },
        { id: 'w4', fromNodeId: 'nor2', fromPortId: 'out', toNodeId: 'led_qbar', toPortId: 'in', signal: 0 },
        { id: 'w5', fromNodeId: 'nor1', fromPortId: 'out', toNodeId: 'nor2', toPortId: 'in1', signal: 1 },
        { id: 'w6', fromNodeId: 'nor2', fromPortId: 'out', toNodeId: 'nor1', toPortId: 'in2', signal: 0 }
      ]
    }
  },
  mux2to1: {
    name: '2-to-1 Multiplexer',
    description: 'Selects between Input D0 and D1 based on Select line S.',
    state: {
      nodes: [
        { id: 'in_d0', type: 'SWITCH', label: 'Data D0', x: 60, y: 80, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'in_s', type: 'SWITCH', label: 'Select S', x: 60, y: 180, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'in_d1', type: 'SWITCH', label: 'Data D1', x: 60, y: 280, inputs: {}, outputs: { out: 0 }, state: { active: false } },
        { id: 'not_s', type: 'NOT', label: "NOT S", x: 180, y: 140, inputs: { in: 0 }, outputs: { out: 1 } },
        { id: 'and_d0', type: 'AND', label: "AND D0·S'", x: 320, y: 100, inputs: { in1: 0, in2: 1 }, outputs: { out: 0 } },
        { id: 'and_d1', type: 'AND', label: "AND D1·S", x: 320, y: 250, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'or_out', type: 'OR', label: "OR Gate", x: 480, y: 175, inputs: { in1: 0, in2: 0 }, outputs: { out: 0 } },
        { id: 'led_y', type: 'LED', label: "Output Y", x: 640, y: 175, inputs: { in: 0 }, outputs: {}, state: { lit: 0 } }
      ],
      wires: [
        { id: 'w1', fromNodeId: 'in_s', fromPortId: 'out', toNodeId: 'not_s', toPortId: 'in', signal: 0 },
        { id: 'w2', fromNodeId: 'in_d0', fromPortId: 'out', toNodeId: 'and_d0', toPortId: 'in1', signal: 0 },
        { id: 'w3', fromNodeId: 'not_s', fromPortId: 'out', toNodeId: 'and_d0', toPortId: 'in2', signal: 1 },
        { id: 'w4', fromNodeId: 'in_d1', fromPortId: 'out', toNodeId: 'and_d1', toPortId: 'in1', signal: 0 },
        { id: 'w5', fromNodeId: 'in_s', fromPortId: 'out', toNodeId: 'and_d1', toPortId: 'in2', signal: 0 },
        { id: 'w6', fromNodeId: 'and_d0', fromPortId: 'out', toNodeId: 'or_out', toPortId: 'in1', signal: 0 },
        { id: 'w7', fromNodeId: 'and_d1', fromPortId: 'out', toNodeId: 'or_out', toPortId: 'in2', signal: 0 },
        { id: 'w8', fromNodeId: 'or_out', fromPortId: 'out', toNodeId: 'led_y', toPortId: 'in', signal: 0 }
      ]
    }
  }
};
