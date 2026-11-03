import { PracticalExperiment } from '@/types';

export const INITIAL_EXPERIMENTS: PracticalExperiment[] = [
  {
    id: 'exp-1',
    experimentNumber: 1,
    title: 'Verification of AND Gate using IC 7408',
    slug: 'and-gate-7408',
    circuitType: 'basic-gate',
    objective: 'To study the logical operation and verify the truth table of a 2-input AND gate using the TTL IC 7408 on a solderless breadboard.',
    requiredEquipment: [
      { item: 'IC 7408 (Quad 2-Input AND Gate)', quantity: 1 },
      { item: 'Solderless Breadboard', quantity: 1 },
      { item: '+5V Regulated DC Power Supply', quantity: 1 },
      { item: 'SPDT Toggle Switches or DIP Switch module', quantity: 2 },
      { item: 'LED (5mm Red)', quantity: 1 },
      { item: '330Ω Current-limiting Resistor', quantity: 1 },
      { item: '10kΩ Pull-down Resistors', quantity: 2 },
      { item: '0.1µF Ceramic Capacitor (Bypass/Decoupling)', quantity: 1 },
      { item: 'Breadboard Jumper Wires', quantity: 10 }
    ],
    icNumbers: ['7408'],
    circuitDiagramDescription: 'Dual switch inputs connected to pins 1 (1A) and 2 (1B) of IC 7408. Output from pin 3 (1Y) passes through a 330Ω resistor to the anode of an indicator LED, with cathode to ground.',
    pinConnections: [
      { pin: 'Pin 14 (VCC)', connectTo: '+5V Power Rail', functionDesc: 'Powers the internal bipolar TTL gate transistors' },
      { pin: 'Pin 7 (GND)', connectTo: '0V Ground Rail', functionDesc: 'Reference ground for all IC internals' },
      { pin: 'Pin 1 (1A)', connectTo: 'Switch A (with 10kΩ pull-down)', functionDesc: 'First binary input signal' },
      { pin: 'Pin 2 (1B)', connectTo: 'Switch B (with 10kΩ pull-down)', functionDesc: 'Second binary input signal' },
      { pin: 'Pin 3 (1Y)', connectTo: '330Ω Resistor -> LED Anode', functionDesc: 'Gate 1 Output: logic HIGH (5V) when A=1 and B=1' }
    ],
    procedureSteps: [
      'Insert the IC 7408 into the center channel of the breadboard ensuring the notch faces left.',
      'Connect Pin 14 of the IC to the +5V red power rail and Pin 7 to the 0V blue ground rail.',
      'Insert a 0.1µF capacitor directly across Pin 14 and Pin 7 to filter transient switching noise.',
      'Connect Switch A to Pin 1 and Switch B to Pin 2. Ensure each input has a 10kΩ pull-down resistor to GND.',
      'Connect Pin 3 to a 330Ω resistor in series with the anode (longer leg) of the LED; connect cathode to GND.',
      'Turn on the +5V power supply. Set Switch A and B to all 4 combinations (00, 01, 10, 11) and record LED status.'
    ],
    observationTable: {
      headers: ['Input A', 'Input B', 'Expected LED State', 'Observed State', 'Verified (Pass/Fail)'],
      rows: [
        [0, 0, 'OFF (0)', 'OFF (0)', 'Pass'],
        [0, 1, 'OFF (0)', 'OFF (0)', 'Pass'],
        [1, 0, 'OFF (0)', 'OFF (0)', 'Pass'],
        [1, 1, 'ON (1)', 'ON (1)', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 1]
      ]
    },
    resultsSummary: 'The truth table of the 2-input AND gate was successfully verified. The output LED illuminated only when both inputs A and B were switched to logic HIGH (+5V).',
    troubleshootingGuide: [
      { problem: 'LED is always ON regardless of inputs', check: 'Check Pin 7 GND connection', remedy: 'If GND pin is floating, TTL outputs can float HIGH. Firmly seat GND wire.' },
      { problem: 'LED never turns ON even with both inputs at 5V', check: 'LED polarity and VCC', remedy: 'Ensure LED long lead (anode) connects towards Pin 3 and short lead connects to GND.' }
    ]
  },
  {
    id: 'exp-2',
    experimentNumber: 2,
    title: 'Verification of OR Gate using IC 7432',
    slug: 'or-gate-7432',
    circuitType: 'basic-gate',
    objective: 'To study the logical operation and experimentally verify the truth table of a 2-input OR gate using the TTL IC 7432.',
    requiredEquipment: [
      { item: 'IC 7432 (Quad 2-Input OR Gate)', quantity: 1 },
      { item: 'Solderless Breadboard', quantity: 1 },
      { item: '+5V Regulated DC Power Supply', quantity: 1 },
      { item: 'Input Switches', quantity: 2 },
      { item: 'LED & 330Ω Resistor', quantity: 1 },
      { item: '10kΩ Resistors', quantity: 2 }
    ],
    icNumbers: ['7432'],
    circuitDiagramDescription: 'Two switches connect to Pin 1 (1A) and Pin 2 (1B). Pin 3 (1Y) drives an output indicator LED via a 330Ω resistor.',
    pinConnections: [
      { pin: 'Pin 14 (VCC)', connectTo: '+5V', functionDesc: 'Supply voltage' },
      { pin: 'Pin 7 (GND)', connectTo: 'GND (0V)', functionDesc: 'Ground reference' },
      { pin: 'Pin 1 (1A)', connectTo: 'Switch A', functionDesc: 'Input A' },
      { pin: 'Pin 2 (1B)', connectTo: 'Switch B', functionDesc: 'Input B' },
      { pin: 'Pin 3 (1Y)', connectTo: '330Ω -> LED -> GND', functionDesc: 'Output: HIGH if A=1 OR B=1' }
    ],
    procedureSteps: [
      'Mount IC 7432 across the center breadboard divider.',
      'Connect Pin 14 to +5V and Pin 7 to Ground.',
      'Connect input switches to Pin 1 and Pin 2 with 10kΩ pull-down resistors.',
      'Connect output Pin 3 through a 330Ω resistor to the LED anode, and cathode to ground.',
      'Apply power and verify output states for input combinations 00, 01, 10, 11.'
    ],
    observationTable: {
      headers: ['Input A', 'Input B', 'Expected LED State', 'Observed State', 'Verified (Pass/Fail)'],
      rows: [
        [0, 0, 'OFF (0)', 'OFF (0)', 'Pass'],
        [0, 1, 'ON (1)', 'ON (1)', 'Pass'],
        [1, 0, 'ON (1)', 'ON (1)', 'Pass'],
        [1, 1, 'ON (1)', 'ON (1)', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 1]
      ]
    },
    resultsSummary: 'The truth table of the 2-input OR gate was experimentally verified. The LED turns ON whenever at least one input is at logic 1.',
    troubleshootingGuide: [
      { problem: 'Output does not drop to 0 when switches are open', check: 'Pull-down resistors', remedy: 'In standard TTL, an open input floats to HIGH (~1.4V-2V). Add 10kΩ pull-down resistors to GND.' }
    ]
  },
  {
    id: 'exp-3',
    experimentNumber: 3,
    title: 'Verification of NOT Gate (Inverter) using IC 7404',
    slug: 'not-gate-7404',
    circuitType: 'basic-gate',
    objective: 'To study the logical inversion operation of the Hex Inverter IC 7404 and measure logical thresholds.',
    requiredEquipment: [
      { item: 'IC 7404 (Hex Inverter)', quantity: 1 },
      { item: 'Breadboard & +5V Supply', quantity: 1 },
      { item: 'Input Switch & LED indicator', quantity: 1 },
      { item: 'Digital Multimeter', quantity: 1 }
    ],
    icNumbers: ['7404'],
    circuitDiagramDescription: 'Single input switch connected to Pin 1 (1A). Output Pin 2 (1Y) connected to LED through 330Ω resistor.',
    pinConnections: [
      { pin: 'Pin 14 (VCC)', connectTo: '+5V', functionDesc: 'Supply rail' },
      { pin: 'Pin 7 (GND)', connectTo: 'GND', functionDesc: 'Ground rail' },
      { pin: 'Pin 1 (1A)', connectTo: 'Switch A', functionDesc: 'Inverter input' },
      { pin: 'Pin 2 (1Y)', connectTo: 'LED Anode via 330Ω', functionDesc: 'Inverted output Y = A\'' }
    ],
    procedureSteps: [
      'Insert IC 7404 into breadboard. Connect Pin 14 to +5V and Pin 7 to GND.',
      'Connect Switch A to Pin 1 with 10kΩ pull-down resistor.',
      'Connect Pin 2 to LED via 330Ω resistor.',
      'Verify that when Switch A is LOW (0), LED is ON (1); when Switch A is HIGH (1), LED is OFF (0).'
    ],
    observationTable: {
      headers: ['Input A', 'Measured Input Voltage (V)', 'Expected Output', 'Observed State', 'Pass/Fail'],
      rows: [
        [0, '0.05 V', 'ON (1)', 'ON (1)', 'Pass'],
        [1, '4.92 V', 'OFF (0)', 'OFF (0)', 'Pass']
      ],
      expectedRows: [
        [0, 1],
        [1, 0]
      ]
    },
    resultsSummary: 'The NOT gate function Y = A\' was validated. The output voltage inverts the input logic state reliably.',
    troubleshootingGuide: [
      { problem: 'LED stays dim instead of fully turning off', check: 'Output low voltage Vol', remedy: 'Check that Pin 7 GND connection is solid. High ground resistance lifts Vol.' }
    ]
  },
  {
    id: 'exp-4',
    experimentNumber: 4,
    title: 'Verification of NAND Gate as Universal Gate using IC 7400',
    slug: 'nand-gate-7400',
    circuitType: 'basic-gate',
    objective: 'To verify the truth table of IC 7400 NAND gate and implement NOT, AND, and OR functions using only NAND gates.',
    requiredEquipment: [
      { item: 'IC 7400 (Quad 2-Input NAND Gate)', quantity: 1 },
      { item: 'Breadboard, Power Supply, LEDs, Switches', quantity: 1 }
    ],
    icNumbers: ['7400'],
    circuitDiagramDescription: 'Gate 1 (Pins 1, 2 -> 3) tests standalone NAND. Gate 2 configured as inverter by tying Pins 4 & 5 together.',
    pinConnections: [
      { pin: 'Pin 14 (VCC)', connectTo: '+5V', functionDesc: 'Supply rail' },
      { pin: 'Pin 7 (GND)', connectTo: 'GND', functionDesc: 'Ground rail' },
      { pin: 'Pin 1 (1A)', connectTo: 'Switch A', functionDesc: 'Input A' },
      { pin: 'Pin 2 (1B)', connectTo: 'Switch B', functionDesc: 'Input B' },
      { pin: 'Pin 3 (1Y)', connectTo: 'LED Anode via 330Ω', functionDesc: 'NAND Output ((A·B)\')' }
    ],
    procedureSteps: [
      'Power IC 7400 (Pin 14 to +5V, Pin 7 to GND).',
      'Test Gate 1 with inputs at Pins 1 & 2, and LED at Pin 3.',
      'Record states for 00, 01, 10, 11 (LED should be ON for 00, 01, 10, and OFF for 11).',
      'Tie Pins 4 and 5 together and connect to Switch A; connect Pin 6 to LED to verify inverter operation.'
    ],
    observationTable: {
      headers: ['Input A', 'Input B', 'Expected NAND Output', 'Observed State', 'Pass/Fail'],
      rows: [
        [0, 0, 'ON (1)', 'ON (1)', 'Pass'],
        [0, 1, 'ON (1)', 'ON (1)', 'Pass'],
        [1, 0, 'ON (1)', 'ON (1)', 'Pass'],
        [1, 1, 'OFF (0)', 'OFF (0)', 'Pass']
      ],
      expectedRows: [
        [0, 0, 1],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
      ]
    },
    resultsSummary: 'IC 7400 successfully validated the NAND truth table. Universal gate synthesis of NOT and AND was confirmed.',
    troubleshootingGuide: [
      { problem: 'Output is always 1', check: 'Input B connection', remedy: 'If one input is disconnected, it floats HIGH in TTL, so if Input A is toggled, it acts like an inverter.' }
    ]
  },
  {
    id: 'exp-5',
    experimentNumber: 5,
    title: 'Verification of NOR Gate as Universal Gate using IC 7402',
    slug: 'nor-gate-7402',
    circuitType: 'basic-gate',
    objective: 'To verify the truth table of IC 7402 NOR gate and master its unique reverse pin configuration.',
    requiredEquipment: [
      { item: 'IC 7402 (Quad 2-Input NOR Gate)', quantity: 1 },
      { item: 'Breadboard, Power Supply, LEDs, Switches', quantity: 1 }
    ],
    icNumbers: ['7402'],
    circuitDiagramDescription: 'Note: IC 7402 has Pin 1 as Output 1Y, and Pins 2 & 3 as Inputs 1A & 1B!',
    pinConnections: [
      { pin: 'Pin 14 (VCC)', connectTo: '+5V', functionDesc: 'Supply rail' },
      { pin: 'Pin 7 (GND)', connectTo: 'GND', functionDesc: 'Ground rail' },
      { pin: 'Pin 1 (1Y)', connectTo: 'LED Anode via 330Ω', functionDesc: 'OUTPUT 1Y (Note Pin 1 is Output!)' },
      { pin: 'Pin 2 (1A)', connectTo: 'Switch A', functionDesc: 'INPUT 1A' },
      { pin: 'Pin 3 (1B)', connectTo: 'Switch B', functionDesc: 'INPUT 1B' }
    ],
    procedureSteps: [
      'Power IC 7402 (Pin 14 = +5V, Pin 7 = GND).',
      'Carefully connect Output LED to Pin 1 (1Y).',
      'Connect Switch A to Pin 2 and Switch B to Pin 3.',
      'Verify that output LED is ON only when both inputs are 0 (00).'
    ],
    observationTable: {
      headers: ['Input A (Pin 2)', 'Input B (Pin 3)', 'Expected Output (Pin 1)', 'Observed State', 'Pass/Fail'],
      rows: [
        [0, 0, 'ON (1)', 'ON (1)', 'Pass'],
        [0, 1, 'OFF (0)', 'OFF (0)', 'Pass'],
        [1, 0, 'OFF (0)', 'OFF (0)', 'Pass'],
        [1, 1, 'OFF (0)', 'OFF (0)', 'Pass']
      ],
      expectedRows: [
        [0, 0, 1],
        [0, 1, 0],
        [1, 0, 0],
        [1, 1, 0]
      ]
    },
    resultsSummary: 'IC 7402 verified: output is HIGH only when both inputs are 0. Pinout reversal was successfully navigated.',
    troubleshootingGuide: [
      { problem: 'IC gets hot and circuit fails', check: 'Pin 1 connection', remedy: 'Do not connect a switch directly to Pin 1; Pin 1 is an output! Shorting an output to 5V damages the chip.' }
    ]
  },
  {
    id: 'exp-6',
    experimentNumber: 6,
    title: 'Verification of XOR Gate using IC 7486',
    slug: 'xor-gate-7486',
    circuitType: 'basic-gate',
    objective: 'To study the Exclusive-OR logic operation using IC 7486 and its use as a parity bit detector.',
    requiredEquipment: [
      { item: 'IC 7486 (Quad 2-Input XOR Gate)', quantity: 1 },
      { item: 'Breadboard, Switches, Resistors, LEDs', quantity: 1 }
    ],
    icNumbers: ['7486'],
    circuitDiagramDescription: 'Switches connected to Pins 1 & 2. Output Pin 3 drives LED indicator through 330Ω.',
    pinConnections: [
      { pin: 'Pin 14 (VCC)', connectTo: '+5V', functionDesc: 'Supply rail' },
      { pin: 'Pin 7 (GND)', connectTo: 'GND', functionDesc: 'Ground rail' },
      { pin: 'Pin 1 (1A)', connectTo: 'Switch A', functionDesc: 'Input A' },
      { pin: 'Pin 2 (1B)', connectTo: 'Switch B', functionDesc: 'Input B' },
      { pin: 'Pin 3 (1Y)', connectTo: 'LED Anode via 330Ω', functionDesc: 'XOR Output (A ⊕ B)' }
    ],
    procedureSteps: [
      'Power IC 7486 (Pin 14 to +5V, Pin 7 to GND).',
      'Connect inputs to Pins 1 and 2, and indicator to Pin 3.',
      'Check output for 00 (OFF), 01 (ON), 10 (ON), 11 (OFF).'
    ],
    observationTable: {
      headers: ['Input A', 'Input B', 'Expected XOR Output', 'Observed State', 'Pass/Fail'],
      rows: [
        [0, 0, 'OFF (0)', 'OFF (0)', 'Pass'],
        [0, 1, 'ON (1)', 'ON (1)', 'Pass'],
        [1, 0, 'ON (1)', 'ON (1)', 'Pass'],
        [1, 1, 'OFF (0)', 'OFF (0)', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0],
        [0, 1, 1],
        [1, 0, 1],
        [1, 1, 0]
      ]
    },
    resultsSummary: 'IC 7486 verified. The XOR gate outputs 1 whenever inputs differ, validating odd-parity and binary addition sum bit logic.',
    troubleshootingGuide: [
      { problem: 'Both inputs 1 results in LED on', check: 'Check IC label', remedy: 'Confirm chip is 7486 (XOR) and not 7432 (OR).' }
    ]
  },
  {
    id: 'exp-7',
    experimentNumber: 7,
    title: 'Implementation of Half Adder using Basic Logic Gates (IC 7486 & IC 7408)',
    slug: 'half-adder-practical',
    circuitType: 'combinational',
    objective: 'To design, wire on breadboard, and verify a Half Adder combinational circuit producing Sum = A ⊕ B and Carry = A · B.',
    requiredEquipment: [
      { item: 'IC 7486 (Quad XOR Gate)', quantity: 1 },
      { item: 'IC 7408 (Quad AND Gate)', quantity: 1 },
      { item: 'Breadboard, Power Supply', quantity: 1 },
      { item: 'LEDs (1 Green for Sum, 1 Red for Carry)', quantity: 2 },
      { item: '330Ω Resistors', quantity: 2 }
    ],
    icNumbers: ['7486', '7408'],
    circuitDiagramDescription: 'Input A connects simultaneously to 7486 Pin 1 and 7408 Pin 1. Input B connects to 7486 Pin 2 and 7408 Pin 2. 7486 Pin 3 drives Sum LED; 7408 Pin 3 drives Carry LED.',
    pinConnections: [
      { pin: '7486 Pin 14 / 7408 Pin 14', connectTo: '+5V Rail', functionDesc: 'VCC power supply' },
      { pin: '7486 Pin 7 / 7408 Pin 7', connectTo: 'GND Rail', functionDesc: 'Ground return' },
      { pin: 'Switch A', connectTo: '7486 Pin 1 & 7408 Pin 1', functionDesc: 'Common Input A bus' },
      { pin: 'Switch B', connectTo: '7486 Pin 2 & 7408 Pin 2', functionDesc: 'Common Input B bus' },
      { pin: '7486 Pin 3 (1Y)', connectTo: '330Ω -> Green LED -> GND', functionDesc: 'Sum Output bit S' },
      { pin: '7408 Pin 3 (1Y)', connectTo: '330Ω -> Red LED -> GND', functionDesc: 'Carry Output bit C' }
    ],
    procedureSteps: [
      'Insert both IC 7486 and IC 7408 on the breadboard.',
      'Bridge power rails so top and bottom rails share +5V and GND.',
      'Connect VCC (Pin 14) and GND (Pin 7) on both ICs.',
      'Wire Switch A to Pin 1 of both ICs; wire Switch B to Pin 2 of both ICs.',
      'Connect Green LED to 7486 Pin 3 (Sum) and Red LED to 7408 Pin 3 (Carry).',
      'Test combinations 00, 01, 10, 11 and record states.'
    ],
    observationTable: {
      headers: ['A', 'B', 'Expected Sum', 'Expected Carry', 'Observed (Sum / Carry)', 'Pass/Fail'],
      rows: [
        [0, 0, '0 (OFF)', '0 (OFF)', '0 / 0', 'Pass'],
        [0, 1, '1 (ON)', '0 (OFF)', '1 / 0', 'Pass'],
        [1, 0, '1 (ON)', '0 (OFF)', '1 / 0', 'Pass'],
        [1, 1, '0 (OFF)', '1 (ON)', '0 / 1', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 0, 1, 0],
        [1, 1, 0, 1]
      ]
    },
    resultsSummary: 'Half adder successfully verified: 1 + 1 produces Sum = 0 and Carry = 1 (binary 10₂ = decimal 2).',
    troubleshootingGuide: [
      { problem: 'Carry turns ON when only A is 1', check: 'Cross wiring between ICs', remedy: 'Ensure Switch A and B are not shorted together on the breadboard tie strip.' }
    ]
  },
  {
    id: 'exp-8',
    experimentNumber: 8,
    title: 'Implementation of Full Adder using Logic Gates (IC 7486, 7408, 7432)',
    slug: 'full-adder-practical',
    circuitType: 'combinational',
    objective: 'To construct and test a complete Full Adder that adds three 1-bit binary inputs (A, B, Cin) producing Sum and Carry Out.',
    requiredEquipment: [
      { item: 'IC 7486 (XOR Gate)', quantity: 1 },
      { item: 'IC 7408 (AND Gate)', quantity: 1 },
      { item: 'IC 7432 (OR Gate)', quantity: 1 },
      { item: 'Breadboard, 3 Input Switches, 2 LEDs', quantity: 1 }
    ],
    icNumbers: ['7486', '7408', '7432'],
    circuitDiagramDescription: 'Two half adders cascaded: 1st XOR computes A ⊕ B; 2nd XOR computes (A ⊕ B) ⊕ Cin = Sum. Two AND gates and one OR gate compute Cout = (A · B) + (Cin · (A ⊕ B)).',
    pinConnections: [
      { pin: '7486 Pin 1 & 2', connectTo: 'Switch A & Switch B', functionDesc: 'First half adder inputs' },
      { pin: '7486 Pin 3 (1Y)', connectTo: '7486 Pin 4 (2A) & 7408 Pin 4 (2A)', functionDesc: 'Intermediate sum (A ⊕ B)' },
      { pin: 'Switch Cin', connectTo: '7486 Pin 5 (2B) & 7408 Pin 5 (2B)', functionDesc: 'Carry-in input' },
      { pin: '7486 Pin 6 (2Y)', connectTo: 'Sum LED (via 330Ω)', functionDesc: 'Full Adder Sum output' },
      { pin: '7408 Pin 3 (1Y) & Pin 6 (2Y)', connectTo: '7432 Pin 1 & Pin 2', functionDesc: 'Partial carries to OR gate' },
      { pin: '7432 Pin 3 (1Y)', connectTo: 'Cout LED (via 330Ω)', functionDesc: 'Full Adder Carry Out' }
    ],
    procedureSteps: [
      'Place 7486, 7408, and 7432 in a row on the breadboard.',
      'Connect VCC (Pin 14) and GND (Pin 7) on all three ICs.',
      'Wire the first XOR gate with inputs A and B; route output to second XOR gate input.',
      'Wire Cin to second input of second XOR gate; connect output to Sum LED.',
      'Wire partial carry products into 7408 AND gates and combine through 7432 OR gate to Cout LED.',
      'Test all 8 input combinations from 000 to 111.'
    ],
    observationTable: {
      headers: ['A', 'B', 'Cin', 'Expected Sum', 'Expected Cout', 'Observed State', 'Pass/Fail'],
      rows: [
        [0, 0, 0, 0, 0, '0 / 0', 'Pass'],
        [0, 0, 1, 1, 0, '1 / 0', 'Pass'],
        [0, 1, 0, 1, 0, '1 / 0', 'Pass'],
        [0, 1, 1, 0, 1, '0 / 1', 'Pass'],
        [1, 0, 0, 1, 0, '1 / 0', 'Pass'],
        [1, 0, 1, 0, 1, '0 / 1', 'Pass'],
        [1, 1, 0, 0, 1, '0 / 1', 'Pass'],
        [1, 1, 1, 1, 1, '1 / 1', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 0, 1, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 1, 1, 1, 1]
      ]
    },
    resultsSummary: 'Full adder successfully verified across all 8 input states. When A=1, B=1, Cin=1, Sum=1 and Cout=1 (1+1+1 = 3₁₀ = 11₂).',
    troubleshootingGuide: [
      { problem: 'Sum works but Carry Out is always 0', check: '7432 OR gate inputs', remedy: 'Verify that 7408 outputs reach 7432 Pins 1 & 2 properly.' }
    ]
  },
  {
    id: 'exp-9',
    experimentNumber: 9,
    title: 'Implementation of Half Subtractor',
    slug: 'half-subtractor-practical',
    circuitType: 'combinational',
    objective: 'To design and experimentally verify a Half Subtractor circuit producing Difference = A ⊕ B and Borrow = A\' · B.',
    requiredEquipment: [
      { item: 'IC 7486 (XOR)', quantity: 1 },
      { item: 'IC 7404 (NOT)', quantity: 1 },
      { item: 'IC 7408 (AND)', quantity: 1 },
      { item: 'Breadboard, Switches, LEDs', quantity: 1 }
    ],
    icNumbers: ['7486', '7404', '7408'],
    circuitDiagramDescription: 'Difference is computed by XOR (A ⊕ B). Borrow is computed by passing input A through an inverter (7404) and ANDing with B.',
    pinConnections: [
      { pin: 'Switch A', connectTo: '7486 Pin 1 & 7404 Pin 1', functionDesc: 'Minuend input' },
      { pin: 'Switch B', connectTo: '7486 Pin 2 & 7408 Pin 2', functionDesc: 'Subtrahend input' },
      { pin: '7404 Pin 2 (1Y)', connectTo: '7408 Pin 1 (1A)', functionDesc: "Inverted A (A')" },
      { pin: '7486 Pin 3 (1Y)', connectTo: 'Diff LED via 330Ω', functionDesc: 'Difference output' },
      { pin: '7408 Pin 3 (1Y)', connectTo: 'Borrow LED via 330Ω', functionDesc: "Borrow output (A'·B)" }
    ],
    procedureSteps: [
      'Power all three ICs on the breadboard.',
      'Wire A and B to XOR for Difference bit.',
      'Wire A through NOT gate, then AND with B for Borrow bit.',
      'Verify the four cases: 0-0=0 B0, 0-1=1 B1, 1-0=1 B0, 1-1=0 B0.'
    ],
    observationTable: {
      headers: ['A (Minuend)', 'B (Subtrahend)', 'Difference', 'Borrow', 'Observed State', 'Pass/Fail'],
      rows: [
        [0, 0, 0, 0, '0 / 0', 'Pass'],
        [0, 1, 1, 1, '1 / 1', 'Pass'],
        [1, 0, 1, 0, '1 / 0', 'Pass'],
        [1, 1, 0, 0, '0 / 0', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0, 0],
        [0, 1, 1, 1],
        [1, 0, 1, 0],
        [1, 1, 0, 0]
      ]
    },
    resultsSummary: 'Half Subtractor truth table verified. Case 0 - 1 generated Difference 1 and Borrow 1.',
    troubleshootingGuide: [
      { problem: 'Borrow lights up on 1 - 0 instead of 0 - 1', check: 'Inverter input', remedy: 'Ensure NOT gate inverts input A, not input B.' }
    ]
  },
  {
    id: 'exp-10',
    experimentNumber: 10,
    title: 'Implementation of Full Subtractor',
    slug: 'full-subtractor-practical',
    circuitType: 'combinational',
    objective: 'To design and verify a Full Subtractor that subtracts two bits (A and B) along with a Borrow-in (Bin).',
    requiredEquipment: [
      { item: 'IC 7486 (XOR)', quantity: 1 },
      { item: 'IC 7404 (NOT)', quantity: 1 },
      { item: 'IC 7408 (AND)', quantity: 1 },
      { item: 'IC 7432 (OR)', quantity: 1 },
      { item: 'Breadboard, LEDs, Switches', quantity: 1 }
    ],
    icNumbers: ['7486', '7404', '7408', '7432'],
    circuitDiagramDescription: 'Difference = A ⊕ B ⊕ Bin. Bout = A\'B + A\'Bin + BBin.',
    pinConnections: [
      { pin: 'Switch A, B, Bin', connectTo: 'Gate inputs', functionDesc: '3 binary inputs' },
      { pin: 'Final XOR output', connectTo: 'Diff LED', functionDesc: 'Difference bit' },
      { pin: 'Final OR output', connectTo: 'Bout LED', functionDesc: 'Borrow out bit' }
    ],
    procedureSteps: [
      'Set up the dual half-subtractor architecture on breadboard.',
      'Check all 8 combinations from 000 to 111.',
      'Verify that 0 - 1 - 1 produces Diff=0, Bout=1.'
    ],
    observationTable: {
      headers: ['A', 'B', 'Bin', 'Diff', 'Bout', 'Observed State', 'Pass/Fail'],
      rows: [
        [0, 0, 0, 0, 0, '0 / 0', 'Pass'],
        [0, 0, 1, 1, 1, '1 / 1', 'Pass'],
        [0, 1, 0, 1, 1, '1 / 1', 'Pass'],
        [0, 1, 1, 0, 1, '0 / 1', 'Pass'],
        [1, 0, 0, 1, 0, '1 / 0', 'Pass'],
        [1, 0, 1, 0, 0, '0 / 0', 'Pass'],
        [1, 1, 0, 0, 0, '0 / 0', 'Pass'],
        [1, 1, 1, 1, 1, '1 / 1', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1],
        [0, 1, 0, 1, 1],
        [0, 1, 1, 0, 1],
        [1, 0, 0, 1, 0],
        [1, 0, 1, 0, 0],
        [1, 1, 0, 0, 0],
        [1, 1, 1, 1, 1]
      ]
    },
    resultsSummary: 'Full subtractor successfully implemented and verified for all 8 input conditions.',
    troubleshootingGuide: [
      { problem: 'Outputs float', check: 'Breadboard power rails', remedy: 'Bridge ground rails across both sides of breadboard.' }
    ]
  },
  {
    id: 'exp-11',
    experimentNumber: 11,
    title: 'Study of SR Flip-Flop using NAND Gates (IC 7400)',
    slug: 'sr-flip-flop-practical',
    circuitType: 'sequential',
    objective: 'To construct an active-low Set-Reset Latch using cross-coupled NAND gates and verify memory, set, reset, and forbidden states.',
    requiredEquipment: [
      { item: 'IC 7400 (NAND Gate)', quantity: 1 },
      { item: 'Breadboard, 2 Pushbuttons / Switches', quantity: 1 },
      { item: '2 LEDs (Q and Q_bar)', quantity: 2 },
      { item: '330Ω & 10kΩ Resistors', quantity: 4 }
    ],
    icNumbers: ['7400'],
    circuitDiagramDescription: 'Cross-coupled NAND gates: Pin 3 (1Y, Q) connects back to Pin 5 (2B). Pin 6 (2Y, Q\') connects back to Pin 2 (1B). Active-low Set input on Pin 1; Active-low Reset input on Pin 4.',
    pinConnections: [
      { pin: 'Pin 1 (1A)', connectTo: "Set' Switch (Active LOW)", functionDesc: 'Forces Q=1' },
      { pin: 'Pin 4 (2A)', connectTo: "Reset' Switch (Active LOW)", functionDesc: 'Forces Q=0' },
      { pin: 'Pin 3 (1Y)', connectTo: 'Pin 5 (2B) & Q LED', functionDesc: 'True output Q' },
      { pin: 'Pin 6 (2Y)', connectTo: 'Pin 2 (1B) & Q\' LED', functionDesc: "Complementary output Q'" }
    ],
    procedureSteps: [
      'Power IC 7400 (Pin 14=+5V, Pin 7=GND).',
      'Wire the cross-coupled connections between Gate 1 and Gate 2.',
      'Set both inputs S\' and R\' to 1 (Inactive/Memory state).',
      'Pulse S\' to 0: Observe Q becomes 1, Q\' becomes 0 (Set state).',
      'Return S\' to 1: Observe Q retains state 1 (Memory retention).',
      'Pulse R\' to 0: Observe Q becomes 0, Q\' becomes 1 (Reset state).',
      'Note that setting both S\'=0 and R\'=0 simultaneously produces an invalid state where both Q=1 and Q\'=1.'
    ],
    observationTable: {
      headers: ["S'", "R'", 'Q(t+1)', "Q'(t+1)", 'Operating Mode', 'Pass/Fail'],
      rows: [
        [1, 1, 'Q(t)', "Q'(t)", 'No Change (Memory)', 'Pass'],
        [0, 1, 1, 0, 'Set (Q = 1)', 'Pass'],
        [1, 0, 0, 1, 'Reset (Q = 0)', 'Pass'],
        [0, 0, 'Invalid (1)', 'Invalid (1)', 'Prohibited State', 'Pass']
      ],
      expectedRows: [
        [1, 1, 1, 0],
        [0, 1, 1, 0],
        [1, 0, 0, 1]
      ]
    },
    resultsSummary: 'Bistable memory action of SR latch verified. Data storage retention confirmed when inputs returned to idle.',
    troubleshootingGuide: [
      { problem: 'Outputs oscillate when both switches released', check: 'Race condition from 00 to 11', remedy: 'Avoid triggering the forbidden 0-0 state.' }
    ]
  },
  {
    id: 'exp-12',
    experimentNumber: 12,
    title: 'Study of JK Flip-Flop using IC 7476',
    slug: 'jk-flip-flop-practical',
    circuitType: 'sequential',
    objective: 'To study the operation of the Master-Slave JK Flip-Flop using IC 7476, verifying Hold, Reset, Set, and Toggle modes.',
    requiredEquipment: [
      { item: 'IC 7476 (Dual JK Flip-Flop)', quantity: 1 },
      { item: 'Debounced Manual Clock / 555 Timer', quantity: 1 },
      { item: 'Breadboard, LEDs, Switches', quantity: 1 }
    ],
    icNumbers: ['7476'],
    circuitDiagramDescription: 'IC 7476 with Pin 5 to +5V and Pin 13 to GND. Preset (Pin 2) and Clear (Pin 3) tied to +5V. Clock input on Pin 1.',
    pinConnections: [
      { pin: 'Pin 5 (VCC)', connectTo: '+5V (Note: Pin 5 is VCC!)', functionDesc: 'Power' },
      { pin: 'Pin 13 (GND)', connectTo: 'GND (Note: Pin 13 is GND!)', functionDesc: 'Ground' },
      { pin: 'Pin 2 (1PRE\') & Pin 3 (1CLR\')', connectTo: '+5V Rail', functionDesc: 'Disable asynchronous override' },
      { pin: 'Pin 4 (1J)', connectTo: 'Switch J', functionDesc: 'J input' },
      { pin: 'Pin 16 (1K)', connectTo: 'Switch K', functionDesc: 'K input' },
      { pin: 'Pin 1 (1CLK)', connectTo: 'Clock Pulser', functionDesc: 'Falling-edge clock' },
      { pin: 'Pin 15 (1Q)', connectTo: 'Q LED via 330Ω', functionDesc: 'Output Q' }
    ],
    procedureSteps: [
      'Carefully connect power: Pin 5 to +5V, Pin 13 to GND.',
      'Tie Pins 2 and 3 (PRE\' and CLR\') to +5V.',
      'Test J=0, K=0: send clock pulse -> Q maintains previous state.',
      'Test J=0, K=1: send clock pulse -> Q becomes 0 (Reset).',
      'Test J=1, K=0: send clock pulse -> Q becomes 1 (Set).',
      'Test J=1, K=1: send consecutive clock pulses -> Q toggles on every falling edge (Toggle / Divide-by-2 mode).'
    ],
    observationTable: {
      headers: ['J', 'K', 'CLK Transition', 'Q(t+1)', 'State / Mode', 'Pass/Fail'],
      rows: [
        [0, 0, '↓ Falling Edge', 'Q(t)', 'No Change', 'Pass'],
        [0, 1, '↓ Falling Edge', 0, 'Reset', 'Pass'],
        [1, 0, '↓ Falling Edge', 1, 'Set', 'Pass'],
        [1, 1, '↓ Falling Edge', "Q'(t)", 'Toggle Mode (T)', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0],
        [0, 1, 0],
        [1, 0, 1],
        [1, 1, 1]
      ]
    },
    resultsSummary: 'JK Flip-Flop verified. Toggle mode (J=1, K=1) demonstrated divide-by-2 frequency division with zero race condition.',
    troubleshootingGuide: [
      { problem: 'Chip does not respond to clock', check: 'PRE\' and CLR\' pins', remedy: 'Ensure Pins 2 and 3 are tied to +5V; if grounded, flip-flop is permanently held in set/clear.' }
    ]
  },
  {
    id: 'exp-13',
    experimentNumber: 13,
    title: 'Design of 4-Bit Binary Ripple Counter using IC 7490 / 7476',
    slug: '4-bit-counter-practical',
    circuitType: 'sequential',
    objective: 'To wire and test a 4-bit asynchronous binary counter that counts sequentially from 0000 to 1111 (0 to 15 decimal).',
    requiredEquipment: [
      { item: 'IC 7490 (Decade/Binary Counter) or two IC 7476s', quantity: 1 },
      { item: '4 Output LEDs (QA, QB, QC, QD)', quantity: 4 },
      { item: 'Clock generator / 555 astable oscillator', quantity: 1 },
      { item: 'Breadboard & Power Supply', quantity: 1 }
    ],
    icNumbers: ['7490'],
    circuitDiagramDescription: 'IC 7490 configured for binary division with QA, QB, QC, QD wired to 4 LEDs indicating counts 0000 through 1001.',
    pinConnections: [
      { pin: 'Pin 5 (VCC)', connectTo: '+5V', functionDesc: 'Supply rail' },
      { pin: 'Pin 10 (GND)', connectTo: 'GND', functionDesc: 'Ground rail' },
      { pin: 'Pin 14 (CKA)', connectTo: 'Clock Source (1 Hz)', functionDesc: 'Main clock input' },
      { pin: 'Pin 12 (QA)', connectTo: 'Pin 1 (CKB) & QA LED', functionDesc: 'Cascade to 2nd counter stage' },
      { pin: 'Pins 2, 3, 6, 7', connectTo: 'GND', functionDesc: 'Disable resets' },
      { pin: 'Pins 12, 9, 8, 11', connectTo: 'LEDs QA, QB, QC, QD', functionDesc: '4-bit binary output' }
    ],
    procedureSteps: [
      'Insert IC 7490 into breadboard. Pin 5 to +5V, Pin 10 to GND.',
      'Tie Reset pins 2, 3, 6, 7 to GND.',
      'Connect QA (Pin 12) to Input B (Pin 1).',
      'Connect 4 LEDs with 330Ω resistors to QA (LSB), QB, QC, QD (MSB).',
      'Apply 1 Hz square wave to Pin 14 and observe the binary counting sequence 0000 through 1001.'
    ],
    observationTable: {
      headers: ['Clock Pulse', 'QD (8)', 'QC (4)', 'QB (2)', 'QA (1)', 'Decimal Value', 'Pass/Fail'],
      rows: [
        [0, 0, 0, 0, 0, '0', 'Pass'],
        [1, 0, 0, 0, 1, '1', 'Pass'],
        [2, 0, 0, 1, 0, '2', 'Pass'],
        [3, 0, 0, 1, 1, '3', 'Pass'],
        [4, 0, 1, 0, 0, '4', 'Pass'],
        [5, 0, 1, 0, 1, '5', 'Pass'],
        [6, 0, 1, 1, 0, '6', 'Pass'],
        [7, 0, 1, 1, 1, '7', 'Pass'],
        [8, 1, 0, 0, 0, '8', 'Pass'],
        [9, 1, 0, 0, 1, '9', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1],
        [2, 0, 0, 1, 0],
        [3, 0, 0, 1, 1],
        [4, 0, 1, 0, 0],
        [5, 0, 1, 0, 1],
        [6, 0, 1, 1, 0],
        [7, 0, 1, 1, 1],
        [8, 1, 0, 0, 0],
        [9, 1, 0, 0, 1]
      ]
    },
    resultsSummary: '4-bit counter verified: sequentially cycles through 10 distinct binary counts, advancing on each negative clock pulse.',
    troubleshootingGuide: [
      { problem: 'Counter resets immediately at count 2', check: 'Reset pins 2 and 3', remedy: 'Ensure pins 2 and 3 are firmly grounded.' }
    ]
  },
  {
    id: 'exp-14',
    experimentNumber: 14,
    title: 'Interfacing 7-Segment Display with BCD Decoder (IC 7447 / 4511)',
    slug: '7-segment-display-interfacing',
    circuitType: 'display',
    objective: 'To interface a Common Anode 7-segment display with the 7447 decoder and display decimal digits 0 through 9.',
    requiredEquipment: [
      { item: 'IC 7447 (or CD4511)', quantity: 1 },
      { item: 'Common Anode 7-Segment Display', quantity: 1 },
      { item: '330Ω Resistors', quantity: 7 },
      { item: 'DIP Switch (4-position)', quantity: 1 },
      { item: 'Breadboard & Power Supply', quantity: 1 }
    ],
    icNumbers: ['7447', '4511'],
    circuitDiagramDescription: 'BCD inputs A, B, C, D from switches connect to IC 7447. Outputs a through g pass through 330Ω resistors to display cathode pins; display common anode connects to +5V.',
    pinConnections: [
      { pin: 'Pin 16 (VCC)', connectTo: '+5V', functionDesc: 'IC power' },
      { pin: 'Pin 8 (GND)', connectTo: 'GND', functionDesc: 'IC ground' },
      { pin: 'Pin 7 (A), 1 (B), 2 (C), 6 (D)', connectTo: 'DIP Switches with pull-downs', functionDesc: 'BCD numeric inputs' },
      { pin: 'Pins 13, 12, 11, 10, 9, 15, 14', connectTo: 'Resistors -> Display pins a through g', functionDesc: 'Active-low segment drives' },
      { pin: 'Display Common Pin', connectTo: '+5V Rail', functionDesc: 'Common Anode supply' }
    ],
    procedureSteps: [
      'Insert Common Anode display into breadboard; wire common pin to +5V.',
      'Place IC 7447 on breadboard and wire Pin 16 to +5V, Pin 8 to GND.',
      'Connect control pins 3, 4, 5 (LT\', BI\', RBI\') to +5V.',
      'Connect 7 current-limiting resistors (330Ω) between 7447 outputs and display segments a-g.',
      'Input BCD codes 0000 through 1001 and verify decimal display 0 through 9.'
    ],
    observationTable: {
      headers: ['D (8)', 'C (4)', 'B (2)', 'A (1)', 'Active Segments', 'Displayed Character', 'Pass/Fail'],
      rows: [
        [0, 0, 0, 0, 'a, b, c, d, e, f', '0', 'Pass'],
        [0, 0, 0, 1, 'b, c', '1', 'Pass'],
        [0, 0, 1, 0, 'a, b, d, e, g', '2', 'Pass'],
        [0, 0, 1, 1, 'a, b, c, d, g', '3', 'Pass'],
        [0, 1, 0, 0, 'b, c, f, g', '4', 'Pass'],
        [0, 1, 0, 1, 'a, c, d, f, g', '5', 'Pass'],
        [0, 1, 1, 0, 'a, c, d, e, f, g', '6', 'Pass'],
        [0, 1, 1, 1, 'a, b, c', '7', 'Pass'],
        [1, 0, 0, 0, 'a, b, c, d, e, f, g', '8', 'Pass'],
        [1, 0, 0, 1, 'a, b, c, d, f, g', '9', 'Pass']
      ],
      expectedRows: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1],
        [0, 0, 1, 0, 2],
        [0, 0, 1, 1, 3],
        [0, 1, 0, 0, 4],
        [0, 1, 0, 1, 5],
        [0, 1, 1, 0, 6],
        [0, 1, 1, 1, 7],
        [1, 0, 0, 0, 8],
        [1, 0, 0, 1, 9]
      ]
    },
    resultsSummary: '7-Segment interfacing validated: each 4-bit BCD code reliably illuminated the corresponding decimal numeral 0-9.',
    troubleshootingGuide: [
      { problem: 'Display remains completely blank', check: 'Display Common Pin and Pin 3 LT\'', remedy: 'Confirm whether display is Common Anode (connect to +5V) or Common Cathode (connect to GND). 7447 requires Common Anode.' }
    ]
  }
];
