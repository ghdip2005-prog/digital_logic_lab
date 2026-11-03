import { Topic } from '@/types';

export const INITIAL_TOPICS: Topic[] = [
  // --- MODULE 2: BASIC LOGIC GATES ---
  {
    id: 'topic-and-gate',
    moduleId: 'module-2',
    slug: 'and-gate',
    title: 'AND Gate',
    subtitle: 'The fundamental logical conjunction operator producing HIGH output only when all inputs are asserted.',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    order: 1,
    isPublished: true,
    introduction: {
      definition: 'The AND gate is a basic digital logic gate that implements logical conjunction. It produces a HIGH (1) output only when all of its inputs are simultaneously at logic HIGH (1); otherwise, its output is LOW (0).',
      importance: 'The AND gate is an essential building block used in address decoders, arithmetic units, data-masking circuits, and digital security interlocks where multiple conditions must all be satisfied before triggering an action.',
      practicalApplications: [
        'Safety interlock switches (e.g., machine guard closed AND start button pressed)',
        'Address decoding in computer memory systems',
        'Carry generation in binary full adders',
        'Data bus enable and gating circuits'
      ],
      learningObjectives: [
        'Understand the Boolean logic and truth table of a 2-input AND gate',
        'Write and interpret the algebraic equation Y = A · B',
        'Identify standard IEEE/ANSI and IEC schematic symbols',
        'Wire IC 7408 on a solderless breadboard with proper current-limiting resistors and decoupling capacitors'
      ]
    },
    explanation: {
      stepByStep: [
        {
          stepTitle: '1. Logical Conjunction Concept',
          content: 'Think of an AND gate like two electrical switches wired in series. Current can only flow from the power source to the load if both Switch A AND Switch B are closed. If either switch is open, the circuit is broken and no current flows.',
          formula: 'Y = A · B (or Y = AB)'
        },
        {
          stepTitle: '2. Electronic Switching in TTL',
          content: 'In TTL technology (like the 74LS08), multiple-emitter bipolar junction transistors are used. When any input is held near 0V (ground), current is diverted through the emitter, pulling the internal base voltage down and forcing the output stage to logic LOW (approx 0.2V-0.4V). Only when all inputs are high does the output totem-pole stage switch to logic HIGH (~3.4V to 5V).',
          formula: 'V_{OL} \\le 0.4V, \\quad V_{OH} \\ge 2.7V'
        },
        {
          stepTitle: '3. Multi-Input Expansion',
          content: 'An AND gate can have 3, 4, or 8 inputs (such as the 3-input 7411 or 8-input 7430). The Boolean principle remains identical: Y = 1 if and only if A=1, B=1, C=1... and N=1.',
          formula: 'Y = A_1 \\cdot A_2 \\cdot A_3 \\dots A_n'
        }
      ],
      keyTakeaways: [
        'Output is 1 ONLY if every input is 1.',
        'Any 0 at any input forces the output to 0 immediately.',
        'In TTL IC 7408, Pin 14 is VCC (+5V), Pin 7 is Ground, and Pins 1, 2 are inputs for Output Pin 3.'
      ],
      formulas: ['Y = A · B', 'Y = (A\' + B\')\' (by De Morgan\'s Law)']
    },
    truthTable: {
      inputs: ['A', 'B'],
      outputs: ['Y (A · B)'],
      description: 'Standard 2-input AND truth table showing binary logic combinations.',
      rows: [
        { inputs: [0, 0], outputs: [0], label: 'Both switches open' },
        { inputs: [0, 1], outputs: [0], label: 'Only switch B closed' },
        { inputs: [1, 0], outputs: [0], label: 'Only switch A closed' },
        { inputs: [1, 1], outputs: [1], label: 'Both switches closed -> Output HIGH' }
      ]
    },
    booleanExpression: {
      primaryExpression: 'Y = A · B',
      sopForm: 'Y = A · B',
      posForm: 'Y = (A + B) · (A + B\') · (A\' + B)',
      canonicalSop: 'Y = m3 = Σm(3)',
      canonicalPos: 'Y = M0 · M1 · M2 = ΠM(0, 1, 2)',
      derivationSteps: [
        {
          step: 1,
          title: 'Truth Table Analysis',
          explanation: 'Inspect the truth table for output rows where Y = 1. Only row 3 (A=1, B=1) has an output of 1.',
          equation: 'Row 3: A=1, B=1'
        },
        {
          step: 2,
          title: 'Minterm Formulation',
          explanation: 'Form the product term (minterm) corresponding to row 3: since A=1 and B=1, the minterm is m3 = A · B.',
          equation: 'm_3 = A \\cdot B'
        },
        {
          step: 3,
          title: 'Sum of Products (SOP)',
          explanation: 'Summing all minterms producing 1 yields the simplest Boolean expression directly.',
          equation: 'Y = m_3 = A \\cdot B'
        }
      ],
      algebraicLawsUsed: ['Identity Law: A · 1 = A', 'Null Law: A · 0 = 0', 'Idempotent Law: A · A = A']
    },
    circuitDiagram: {
      type: 'basic-gate',
      inputs: [
        { id: 'in_a', name: 'Input A', defaultValue: 0 },
        { id: 'in_b', name: 'Input B', defaultValue: 0 }
      ],
      outputs: [
        { id: 'out_y', name: 'Output Y', logicExpr: 'A && B' }
      ],
      gates: [
        { id: 'gate_and_1', type: 'AND', label: '7408 AND Gate 1', inputs: ['in_a', 'in_b'], output: 'out_y', x: 220, y: 80 }
      ],
      description: 'Standard IEEE ANSI curved-back flat-front AND gate symbol.',
      wiringNotes: 'Pins 1 and 2 of IC 7408 correspond to inputs A and B; Pin 3 is output Y.'
    },
    hardwareImplementation: {
      requiredComponents: [
        { name: 'IC 7408 / 74HC08 (Quad 2-Input AND Gate)', quantity: 1, spec: 'DIP-14 Package' },
        { name: 'Solderless Breadboard', quantity: 1, spec: '830 tie-points' },
        { name: '+5V DC Regulated Power Supply', quantity: 1, spec: '5V ±5%' },
        { name: 'SPDT Toggle or Slide Switches', quantity: 2, spec: 'Input logic toggles' },
        { name: '5mm LED (Red or Green)', quantity: 1, spec: 'Indicator light' },
        { name: '330Ω Resistor', quantity: 1, spec: '1/4 Watt, 5% (LED current limiting)' },
        { name: '10kΩ Resistors', quantity: 2, spec: 'Pull-down resistors for inputs' },
        { name: '0.1µF Ceramic Capacitor', quantity: 1, spec: 'VCC-to-GND noise bypass' },
        { name: 'Solid Core Jumper Wires (22 AWG)', quantity: 10, spec: 'Pre-stripped jumper wires' }
      ],
      icNumbers: ['7408', '74HC08'],
      supplyVoltage: '5.0V DC (TTL 74LS08: 4.75V to 5.25V; CMOS 74HC08: 2.0V to 6.0V)',
      powerConsiderations: 'Standard 74LS08 requires a strictly regulated 5V power supply. Never supply more than 5.5V. If using 74HC08 CMOS, unused gate inputs (Pins 4, 5, 9, 10, 12, 13) must not be left floating; tie unused inputs to GND or VCC to prevent excessive CMOS shoot-through current and oscillation.',
      breadboardWiringSteps: [
        '1. Place IC 7408 across the center divider of the breadboard with pin notch facing left.',
        '2. Connect Pin 14 of the IC to the red positive power rail (+5V).',
        '3. Connect Pin 7 of the IC to the blue ground rail (0V).',
        '4. Connect a 0.1µF ceramic decoupling capacitor directly between Pin 14 and Pin 7.',
        '5. Wire Switch A to Pin 1 with a 10kΩ resistor pulling Pin 1 to Ground when switch is open.',
        '6. Wire Switch B to Pin 2 with a 10kΩ resistor pulling Pin 2 to Ground when switch is open.',
        '7. Wire Pin 3 (Output 1Y) to the long leg (anode) of the LED through a 330Ω resistor; connect the short leg (cathode) of the LED to GND.'
      ],
      exactPinConnections: [
        { from: 'Power Supply (+5V)', to: 'Breadboard Red Rail & IC Pin 14 (VCC)' },
        { from: 'Power Supply Ground (0V)', to: 'Breadboard Blue Rail & IC Pin 7 (GND)' },
        { from: 'Switch A Common', to: 'IC Pin 1 (1A)', note: 'Includes 10kΩ pull-down to GND' },
        { from: 'Switch B Common', to: 'IC Pin 2 (1B)', note: 'Includes 10kΩ pull-down to GND' },
        { from: 'IC Pin 3 (1Y)', to: '330Ω Resistor -> LED Anode', note: 'LED cathode connects to GND rail' }
      ],
      testingProcedure: [
        'Turn on the 5V power supply.',
        'Case 00: Set Switch A to 0V and Switch B to 0V. Observe that the LED is completely OFF.',
        'Case 01: Set Switch A to 0V and Switch B to 5V. Observe that the LED remains OFF.',
        'Case 10: Set Switch A to 5V and Switch B to 0V. Observe that the LED remains OFF.',
        'Case 11: Set Switch A to 5V and Switch B to 5V. Observe that the LED illuminates brightly.'
      ],
      expectedOutput: 'The LED will illuminate (logic 1) ONLY when both switches A and B are switched to the 5V position.',
      commonMistakesAndTroubleshooting: [
        {
          mistake: 'LED is always ON regardless of switch settings.',
          solution: 'In standard TTL, a disconnected input floats HIGH to ~1.4V-2V. Check if pull-down resistors (10kΩ) are properly grounded.'
        },
        {
          mistake: 'IC becomes extremely hot to the touch.',
          solution: 'Power and ground polarity are reversed! Immediately disconnect power. Ensure Pin 14 is +5V and Pin 7 is GND.'
        },
        {
          mistake: 'LED burned out immediately upon turning ON.',
          solution: 'You forgot the 330Ω series current-limiting resistor between Pin 3 and the LED. Never connect an LED directly between an IC output and ground.'
        }
      ]
    },
    practiceProblems: [
      {
        id: 'p-and-1',
        question: 'What is the output of a 3-input AND gate if inputs A = 1, B = 0, and C = 1?',
        type: 'mcq',
        difficulty: 'Beginner',
        options: ['1 (HIGH)', '0 (LOW)', 'Undefined', 'High-Impedance (Hi-Z)'],
        correctAnswer: 1,
        explanation: 'In any AND gate, if even a single input is 0, the output must be 0: Y = 1 · 0 · 1 = 0.'
      },
      {
        id: 'p-and-2',
        question: 'Which pin on the standard 14-pin DIP IC 7408 supplies the +5V VCC power?',
        type: 'mcq',
        difficulty: 'Beginner',
        options: ['Pin 1', 'Pin 7', 'Pin 14', 'Pin 8'],
        correctAnswer: 2,
        explanation: 'On standard 14-pin 74xx series TTL DIP packages, Pin 14 is VCC (+5V) and Pin 7 is GND (0V).'
      },
      {
        id: 'p-and-3',
        question: 'Which Boolean identity holds true for an AND gate with input A and 1?',
        type: 'mcq',
        difficulty: 'Intermediate',
        options: ['A · 1 = 1', 'A · 1 = A', 'A · 1 = 0', 'A · 1 = A\''],
        correctAnswer: 1,
        explanation: 'According to the Identity Law of Boolean algebra, ANDing any variable with 1 preserves its value: A · 1 = A.'
      }
    ]
  },

  // --- MODULE 2: OR GATE ---
  {
    id: 'topic-or-gate',
    moduleId: 'module-2',
    slug: 'or-gate',
    title: 'OR Gate',
    subtitle: 'The fundamental logical disjunction operator producing HIGH output when any input is asserted.',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    order: 2,
    isPublished: true,
    introduction: {
      definition: 'The OR gate is a basic digital logic gate implementing logical disjunction. Its output is HIGH (1) if at least one of its inputs is HIGH (1). The output is LOW (0) only when all inputs are simultaneously LOW (0).',
      importance: 'OR gates are used in alarm systems, priority detection, parallel bus arbitration, and whenever multiple conditions can independently trigger a common system response.',
      practicalApplications: [
        'Burglar alarm systems (front door sensor OR window sensor OR motion detector)',
        'Interrupt request lines merging in microprocessors',
        'Carry lookahead addition logic'
      ],
      learningObjectives: [
        'Analyze the truth table and operation of an OR gate',
        'Derive Boolean equations using Y = A + B',
        'Wire IC 7432 on a breadboard and observe active LED outputs'
      ]
    },
    explanation: {
      stepByStep: [
        {
          stepTitle: '1. Logical Disjunction Concept',
          content: 'Think of an OR gate like two electrical switches wired in parallel. If Switch A OR Switch B (or both) are closed, current flows through the branches to power the load.',
          formula: 'Y = A + B'
        },
        {
          stepTitle: '2. Multi-Input Expansion',
          content: 'For an n-input OR gate, the output is 0 only when all n inputs are 0. In all other 2^n - 1 cases, the output is 1.',
          formula: 'Y = A_1 + A_2 + \\dots + A_n'
        }
      ],
      keyTakeaways: [
        'Output is 0 ONLY if all inputs are 0.',
        'Any single 1 at any input forces the output to 1.',
        'Standard TTL IC: 7432 (Quad 2-Input OR Gate).'
      ],
      formulas: ['Y = A + B', 'A + 0 = A', 'A + 1 = 1', 'A + A = A']
    },
    truthTable: {
      inputs: ['A', 'B'],
      outputs: ['Y (A + B)'],
      description: 'Standard 2-input OR truth table.',
      rows: [
        { inputs: [0, 0], outputs: [0], label: 'Both inputs 0 -> Output LOW' },
        { inputs: [0, 1], outputs: [1], label: 'Input B is 1 -> Output HIGH' },
        { inputs: [1, 0], outputs: [1], label: 'Input A is 1 -> Output HIGH' },
        { inputs: [1, 1], outputs: [1], label: 'Both inputs 1 -> Output HIGH' }
      ]
    },
    booleanExpression: {
      primaryExpression: 'Y = A + B',
      sopForm: 'Y = A\'B + AB\' + AB = A + B',
      posForm: 'Y = A + B',
      canonicalSop: 'Y = Σm(1, 2, 3)',
      canonicalPos: 'Y = ΠM(0)',
      derivationSteps: [
        {
          step: 1,
          title: 'Truth Table Inspection',
          explanation: 'Rows 1, 2, and 3 produce Y = 1.',
          equation: 'm_1 = A\'B, \\quad m_2 = AB\', \\quad m_3 = AB'
        },
        {
          step: 2,
          title: 'Algebraic Simplification',
          explanation: 'Y = A\'B + AB\' + AB = A\'B + AB + AB\' = B(A\' + A) + AB\' = B(1) + AB\' = B + AB\' = (B + A)(B + B\') = A + B.',
          equation: 'Y = A + B'
        }
      ],
      algebraicLawsUsed: ['Distributive Law: A + BC = (A + B)(A + C)', 'Complement Law: A + A\' = 1']
    },
    circuitDiagram: {
      type: 'basic-gate',
      inputs: [
        { id: 'in_a', name: 'Input A', defaultValue: 0 },
        { id: 'in_b', name: 'Input B', defaultValue: 0 }
      ],
      outputs: [
        { id: 'out_y', name: 'Output Y', logicExpr: 'A || B' }
      ],
      gates: [
        { id: 'gate_or_1', type: 'OR', label: '7432 OR Gate 1', inputs: ['in_a', 'in_b'], output: 'out_y', x: 220, y: 80 }
      ],
      description: 'Standard curved-input pointed-output OR gate symbol.'
    },
    hardwareImplementation: {
      requiredComponents: [
        { name: 'IC 7432 / 74HC32 (Quad 2-Input OR Gate)', quantity: 1 },
        { name: 'Breadboard & +5V Supply', quantity: 1 },
        { name: 'Switches', quantity: 2 },
        { name: 'LED & 330Ω Resistor', quantity: 1 }
      ],
      icNumbers: ['7432', '74HC32'],
      supplyVoltage: '5.0V DC',
      powerConsiderations: 'Pin 14 connects to +5V; Pin 7 connects to GND.',
      breadboardWiringSteps: [
        '1. Insert IC 7432 into breadboard with notch to the left.',
        '2. Connect Pin 14 to +5V and Pin 7 to GND.',
        '3. Connect Switch A to Pin 1 (1A) and Switch B to Pin 2 (1B).',
        '4. Connect Pin 3 (1Y) through a 330Ω resistor to the LED anode, and cathode to GND.'
      ],
      exactPinConnections: [
        { from: 'Switch A', to: 'IC Pin 1 (1A)' },
        { from: 'Switch B', to: 'IC Pin 2 (1B)' },
        { from: 'IC Pin 3 (1Y)', to: '330Ω -> LED -> GND' },
        { from: '+5V', to: 'IC Pin 14' },
        { from: 'GND', to: 'IC Pin 7' }
      ],
      testingProcedure: [
        'Set switches to 00: LED is OFF.',
        'Set switches to 01: LED is ON.',
        'Set switches to 10: LED is ON.',
        'Set switches to 11: LED is ON.'
      ],
      expectedOutput: 'LED lights up for 01, 10, and 11.',
      commonMistakesAndTroubleshooting: [
        {
          mistake: 'LED stays lit even when both switches are off.',
          solution: 'Ensure inputs have pull-down resistors to 0V.'
        }
      ]
    },
    practiceProblems: [
      {
        id: 'p-or-1',
        question: 'Under what condition does a 4-input OR gate output logic 0?',
        type: 'mcq',
        difficulty: 'Beginner',
        options: ['When any input is 0', 'When all 4 inputs are 0', 'When half the inputs are 0', 'Never'],
        correctAnswer: 1,
        explanation: 'An OR gate output is LOW (0) if and only if ALL inputs are LOW (0).'
      }
    ]
  },

  // --- MODULE 2: NOT GATE ---
  {
    id: 'topic-not-gate',
    moduleId: 'module-2',
    slug: 'not-gate',
    title: 'NOT Gate (Inverter)',
    subtitle: 'The single-input logical negation operator that flips binary state.',
    difficulty: 'Beginner',
    estimatedMinutes: 15,
    order: 3,
    isPublished: true,
    introduction: {
      definition: 'The NOT gate (also known as an inverter) is a single-input logic gate that performs logical negation. If the input is HIGH (1), the output is LOW (0); if the input is LOW (0), the output is HIGH (1).',
      importance: 'Inverters are used in complement generation, clock generators, signal conditioning, active-low enable inversion, and oscillator circuits.',
      practicalApplications: [
        'Generating complement signals (A\') for address decoding',
        'Square wave clock oscillators using RC feedback',
        'Active-low chip select interfacing'
      ],
      learningObjectives: [
        'Master the truth table and symbol of the inverter',
        'Learn the pinout of the 14-pin Hex Inverter IC 7404'
      ]
    },
    explanation: {
      stepByStep: [
        {
          stepTitle: '1. Inversion Operation',
          content: 'A NOT gate inverts the logic state: 0 becomes 1, and 1 becomes 0. The output is denoted by an overbar (Ā) or prime mark (A\').',
          formula: 'Y = A\''
        },
        {
          stepTitle: '2. Double Negation Law',
          content: 'Inverting a signal twice returns the original signal unchanged: (A\')\' = A.',
          formula: '(A\')\' = A'
        }
      ],
      keyTakeaways: [
        'Single input gate.',
        'Output is always opposite to the input.',
        'Standard IC: 7404 contains 6 separate inverters (Hex Inverter).'
      ],
      formulas: ['Y = A\'', '(A\')\' = A']
    },
    truthTable: {
      inputs: ['A'],
      outputs: ['Y (A\')'],
      description: 'Single-input Inverter truth table.',
      rows: [
        { inputs: [0], outputs: [1], label: 'Input 0 -> Output 1' },
        { inputs: [1], outputs: [0], label: 'Input 1 -> Output 0' }
      ]
    },
    booleanExpression: {
      primaryExpression: 'Y = A\'',
      sopForm: 'Y = A\'',
      posForm: 'Y = A\'',
      canonicalSop: 'Y = m0 = Σm(0)',
      canonicalPos: 'Y = M1 = ΠM(1)',
      derivationSteps: [
        {
          step: 1,
          title: 'Single variable inversion',
          explanation: 'Only row 0 (A=0) yields Y=1, giving minterm m0 = A\'.',
          equation: 'Y = A\''
        }
      ]
    },
    circuitDiagram: {
      type: 'basic-gate',
      inputs: [{ id: 'in_a', name: 'Input A', defaultValue: 0 }],
      outputs: [{ id: 'out_y', name: 'Output Y', logicExpr: '!A' }],
      gates: [
        { id: 'gate_not_1', type: 'NOT', label: '7404 Inverter', inputs: ['in_a'], output: 'out_y', x: 220, y: 80 }
      ],
      description: 'Triangle with inversion bubble at output.'
    },
    hardwareImplementation: {
      requiredComponents: [
        { name: 'IC 7404 (Hex Inverter)', quantity: 1 },
        { name: 'Breadboard, Power Supply, Switch, LED, 330Ω Resistor', quantity: 1 }
      ],
      icNumbers: ['7404', '74HC04'],
      supplyVoltage: '5.0V DC',
      powerConsiderations: 'Pin 14 is VCC, Pin 7 is GND.',
      breadboardWiringSteps: [
        '1. Place IC 7404 on breadboard.',
        '2. Wire Pin 14 to +5V and Pin 7 to GND.',
        '3. Wire Switch A to Pin 1 (1A).',
        '4. Wire Pin 2 (1Y) through 330Ω resistor to LED anode; cathode to GND.'
      ],
      exactPinConnections: [
        { from: 'Switch A', to: 'IC Pin 1 (1A)' },
        { from: 'IC Pin 2 (1Y)', to: '330Ω -> LED -> GND' },
        { from: '+5V', to: 'IC Pin 14' },
        { from: 'GND', to: 'IC Pin 7' }
      ],
      testingProcedure: [
        'Switch A = 0 (GND): LED is ON.',
        'Switch A = 1 (+5V): LED turns OFF.'
      ],
      expectedOutput: 'Output LED state is inverted relative to the switch.',
      commonMistakesAndTroubleshooting: [
        {
          mistake: 'Output pin connected to switch.',
          solution: 'Ensure Switch connects to Pin 1 (input), not Pin 2 (output).'
        }
      ]
    },
    practiceProblems: [
      {
        id: 'p-not-1',
        question: 'If signal A is passed through three cascaded inverters, what is the final output?',
        type: 'mcq',
        difficulty: 'Beginner',
        options: ['A', 'A\'', '1', '0'],
        correctAnswer: 1,
        explanation: 'Three inversions: ((A\')\')\' = (A)\' = A\'. An odd number of inverters always inverts the signal.'
      }
    ]
  },

  // --- MODULE 2: NAND GATE (UNIVERSAL GATE) ---
  {
    id: 'topic-nand-gate',
    moduleId: 'module-2',
    slug: 'nand-gate',
    title: 'NAND Gate (Universal Gate)',
    subtitle: 'The inverted AND gate that forms the foundation of all digital logic synthesis.',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    order: 4,
    isPublished: true,
    introduction: {
      definition: 'A NAND (NOT-AND) gate produces a LOW (0) output only when all its inputs are HIGH (1). In all other conditions, the output is HIGH (1). It is designated as a Universal Gate because any Boolean function can be implemented using exclusively NAND gates.',
      importance: 'In semiconductor manufacturing (especially CMOS and Flash memory), NAND gates are physically smaller, faster, and consume less silicon area than AND or OR gates.',
      practicalApplications: [
        'Universal logic circuit fabrication on ASICs',
        'SR latch flip-flops and bistable registers',
        'NAND Flash memory storage arrays'
      ],
      learningObjectives: [
        'Verify the NAND truth table and Boolean formula Y = (A · B)\'',
        'Synthesize NOT, AND, and OR gates using only NAND gates',
        'Wire IC 7400 on a solderless breadboard'
      ]
    },
    explanation: {
      stepByStep: [
        {
          stepTitle: '1. Truth Table and De Morgan Equivalent',
          content: 'By De Morgan\'s theorem, (A · B)\' = A\' + B\'. Thus, a NAND gate is logically equivalent to an OR gate with inverted inputs (an active-low input OR gate).',
          formula: 'Y = (A \\cdot B)\' = A\' + B\''
        },
        {
          stepTitle: '2. Universal Gate Synthesis: Inverter',
          content: 'Tie both inputs of a NAND gate together: Y = (A · A)\' = A\'. A single NAND gate acts as a NOT gate.',
          formula: 'NOT(A) = (A \\cdot A)\' = A\''
        },
        {
          stepTitle: '3. Universal Gate Synthesis: AND Gate',
          content: 'Follow a NAND gate with an inverter (another NAND gate): Y = ((A · B)\')\' = A · B. Two NAND gates create an AND gate.',
          formula: 'AND(A, B) = ((A \\cdot B)\')\''
        },
        {
          stepTitle: '4. Universal Gate Synthesis: OR Gate',
          content: 'Invert both inputs using NAND inverters, then feed into a third NAND gate: Y = (A\' · B\')\' = (A\')\' + (B\')\' = A + B. Three NAND gates create an OR gate.',
          formula: 'OR(A, B) = (A\' \\cdot B\')\' = A + B'
        }
      ],
      keyTakeaways: [
        'Output is 0 ONLY when both inputs are 1.',
        'Universal property allows complete computer processors to be constructed purely from 7400 ICs.',
        'Pinout: Pin 14 is VCC, Pin 7 is GND; Pins 1 & 2 are inputs, Pin 3 is output.'
      ],
      formulas: ['Y = (A · B)\'', 'De Morgan: (A · B)\' = A\' + B\'']
    },
    truthTable: {
      inputs: ['A', 'B'],
      outputs: ['Y = (A · B)\''],
      description: '2-input NAND Gate Truth Table.',
      rows: [
        { inputs: [0, 0], outputs: [1], label: 'Both 0 -> Output HIGH' },
        { inputs: [0, 1], outputs: [1], label: 'One input 0 -> Output HIGH' },
        { inputs: [1, 0], outputs: [1], label: 'One input 0 -> Output HIGH' },
        { inputs: [1, 1], outputs: [0], label: 'Both inputs 1 -> Output LOW' }
      ]
    },
    booleanExpression: {
      primaryExpression: 'Y = (A · B)\'',
      sopForm: 'Y = A\' + B\'',
      posForm: 'Y = (A · B)\'',
      canonicalSop: 'Y = Σm(0, 1, 2)',
      canonicalPos: 'Y = ΠM(3)',
      derivationSteps: [
        {
          step: 1,
          title: 'Apply De Morgan\'s Law',
          explanation: 'The complement of a logical product equals the sum of the complements.',
          equation: '(A \\cdot B)\' = A\' + B\''
        }
      ]
    },
    circuitDiagram: {
      type: 'basic-gate',
      inputs: [
        { id: 'in_a', name: 'Input A', defaultValue: 0 },
        { id: 'in_b', name: 'Input B', defaultValue: 0 }
      ],
      outputs: [
        { id: 'out_y', name: 'Output Y', logicExpr: '!(A && B)' }
      ],
      gates: [
        { id: 'gate_nand_1', type: 'NAND', label: '7400 NAND Gate', inputs: ['in_a', 'in_b'], output: 'out_y', x: 220, y: 80 }
      ],
      description: 'AND gate symbol with an inversion circle (bubble) at the output.'
    },
    hardwareImplementation: {
      requiredComponents: [
        { name: 'IC 7400 (Quad 2-Input NAND Gate)', quantity: 1 },
        { name: 'Breadboard, Power Supply, Switches, LED, 330Ω Resistor', quantity: 1 }
      ],
      icNumbers: ['7400', '74HC00'],
      supplyVoltage: '5.0V DC',
      powerConsiderations: 'Standard TTL: Pin 14 is VCC (+5V), Pin 7 is GND (0V).',
      breadboardWiringSteps: [
        '1. Place IC 7400 on breadboard.',
        '2. Connect Pin 14 to +5V and Pin 7 to GND.',
        '3. Wire Switch A to Pin 1 (1A) and Switch B to Pin 2 (1B).',
        '4. Wire Pin 3 (1Y) through a 330Ω resistor to the LED anode; cathode to GND.'
      ],
      exactPinConnections: [
        { from: 'Switch A', to: 'IC Pin 1 (1A)' },
        { from: 'Switch B', to: 'IC Pin 2 (1B)' },
        { from: 'IC Pin 3 (1Y)', to: '330Ω -> LED -> GND' },
        { from: '+5V', to: 'IC Pin 14' },
        { from: 'GND', to: 'IC Pin 7' }
      ],
      testingProcedure: [
        '00: LED is ON.',
        '01: LED is ON.',
        '10: LED is ON.',
        '11: LED is OFF.'
      ],
      expectedOutput: 'LED is ON for 00, 01, 10, and turns OFF only when both inputs are 11.',
      commonMistakesAndTroubleshooting: [
        {
          mistake: 'LED is always ON regardless of switches.',
          solution: 'Ensure ground is connected to Pin 7 and pull-downs are firmly connected to GND.'
        }
      ]
    },
    practiceProblems: [
      {
        id: 'p-nand-1',
        question: 'How many 2-input NAND gates are required to implement a 2-input OR gate?',
        type: 'mcq',
        difficulty: 'Intermediate',
        options: ['1', '2', '3', '4'],
        correctAnswer: 2,
        explanation: 'Three NAND gates: two configured as inverters for inputs A and B (A\' and B\'), and a third NAND gate to compute (A\' · B\')\' = A + B.'
      }
    ]
  },

  // --- MODULE 4: HALF ADDER ---
  {
    id: 'topic-half-adder',
    moduleId: 'module-4',
    slug: 'half-adder',
    title: 'Half Adder',
    subtitle: 'The arithmetic foundation of binary computing that adds two single-bit numbers.',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    order: 1,
    isPublished: true,
    introduction: {
      definition: 'A Half Adder is a combinational arithmetic circuit that performs the addition of two 1-bit binary digits, A and B. It produces two outputs: Sum (S) and Carry (C). It is called a "half" adder because it cannot accept a carry-in from a previous stage.',
      importance: 'The half adder is the fundamental building block of digital arithmetic logic units (ALUs), floating-point coprocessors, and digital signal processors.',
      practicalApplications: [
        'Least Significant Bit (LSB) stage of a multi-bit ripple-carry binary adder',
        'Multiplier array partial-product accumulation',
        'Incrementer circuits (+1 counter stages)'
      ],
      learningObjectives: [
        'Formulate the truth table for single-bit binary addition',
        'Derive the Boolean equations: S = A ⊕ B and C = A · B',
        'Implement the circuit physically using IC 7486 (XOR) and IC 7408 (AND)'
      ]
    },
    explanation: {
      stepByStep: [
        {
          stepTitle: '1. Rules of Binary Addition',
          content: '0 + 0 = 0 (Sum 0, Carry 0)\n0 + 1 = 1 (Sum 1, Carry 0)\n1 + 0 = 1 (Sum 1, Carry 0)\n1 + 1 = 10₂ (Sum 0, Carry 1)',
          formula: 'A + B = C \\cdot 2^1 + S \\cdot 2^0'
        },
        {
          stepTitle: '2. Output Equation Derivation',
          content: 'Notice the Sum output is 1 when inputs differ (01 or 10), which matches the Exclusive-OR (XOR) operation: S = A ⊕ B. The Carry output is 1 only when both A and B are 1, which matches the AND operation: C = A · B.',
          formula: 'S = A \\oplus B = A\'B + AB\', \\quad C = A \\cdot B'
        }
      ],
      keyTakeaways: [
        'Adds two 1-bit binary numbers.',
        'Outputs: Sum = A ⊕ B, Carry = A · B.',
        'Built with 1 XOR gate (7486) and 1 AND gate (7408).'
      ],
      formulas: ['S = A ⊕ B', 'C = A · B']
    },
    truthTable: {
      inputs: ['A', 'B'],
      outputs: ['Sum (S)', 'Carry (C)'],
      description: 'Half Adder Truth Table.',
      rows: [
        { inputs: [0, 0], outputs: [0, 0], label: '0 + 0 = 0, Carry 0' },
        { inputs: [0, 1], outputs: [1, 0], label: '0 + 1 = 1, Carry 0' },
        { inputs: [1, 0], outputs: [1, 0], label: '1 + 0 = 1, Carry 0' },
        { inputs: [1, 1], outputs: [0, 1], label: '1 + 1 = 0, Carry 1 (binary 10₂)' }
      ]
    },
    booleanExpression: {
      primaryExpression: 'Sum = A ⊕ B,  Carry = A · B',
      sopForm: 'Sum = A\'B + AB\',  Carry = AB',
      posForm: 'Sum = (A + B)(A\' + B\'),  Carry = (A + B)(A + B\')(A\' + B)',
      canonicalSop: 'Sum = Σm(1, 2);  Carry = Σm(3)',
      canonicalPos: 'Sum = ΠM(0, 3);  Carry = ΠM(0, 1, 2)',
      derivationSteps: [
        {
          step: 1,
          title: 'Sum derivation',
          explanation: 'Minterms for Sum: m1 (A\'B) and m2 (AB\'). Sum = A\'B + AB\' = A ⊕ B.',
          equation: 'Sum = A\'B + AB\' = A \\oplus B'
        },
        {
          step: 2,
          title: 'Carry derivation',
          explanation: 'Minterm for Carry: m3 (AB). Carry = A · B.',
          equation: 'Carry = A \\cdot B'
        }
      ]
    },
    circuitDiagram: {
      type: 'combinational',
      inputs: [
        { id: 'in_a', name: 'Input A', defaultValue: 0 },
        { id: 'in_b', name: 'Input B', defaultValue: 0 }
      ],
      outputs: [
        { id: 'out_sum', name: 'Sum (S)', logicExpr: 'A ^ B' },
        { id: 'out_carry', name: 'Carry (C)', logicExpr: 'A && B' }
      ],
      gates: [
        { id: 'gate_xor', type: 'XOR', label: '7486 XOR (Sum)', inputs: ['in_a', 'in_b'], output: 'out_sum', x: 260, y: 70 },
        { id: 'gate_and', type: 'AND', label: '7408 AND (Carry)', inputs: ['in_a', 'in_b'], output: 'out_carry', x: 260, y: 190 }
      ],
      description: 'Parallel XOR and AND gates receiving common inputs A and B.'
    },
    hardwareImplementation: {
      requiredComponents: [
        { name: 'IC 7486 (Quad XOR Gate)', quantity: 1 },
        { name: 'IC 7408 (Quad AND Gate)', quantity: 1 },
        { name: 'Breadboard & +5V Regulated Power Supply', quantity: 1 },
        { name: 'SPDT Switches', quantity: 2 },
        { name: 'LEDs (1 Green for Sum, 1 Red for Carry)', quantity: 2 },
        { name: '330Ω Resistors', quantity: 2 },
        { name: '10kΩ Pull-down Resistors', quantity: 2 }
      ],
      icNumbers: ['7486', '7408'],
      supplyVoltage: '5.0V DC (TTL)',
      powerConsiderations: 'Supply +5V to Pin 14 of both ICs; connect Pin 7 of both ICs to common ground.',
      breadboardWiringSteps: [
        '1. Insert 7486 and 7408 ICs side-by-side on the breadboard.',
        '2. Connect Pin 14 of both ICs to the +5V power rail.',
        '3. Connect Pin 7 of both ICs to the GND rail.',
        '4. Connect Switch A to 7486 Pin 1 and 7408 Pin 1.',
        '5. Connect Switch B to 7486 Pin 2 and 7408 Pin 2.',
        '6. Connect 7486 Pin 3 (Sum) through 330Ω resistor to the Green LED anode; cathode to GND.',
        '7. Connect 7408 Pin 3 (Carry) through 330Ω resistor to the Red LED anode; cathode to GND.'
      ],
      exactPinConnections: [
        { from: 'Switch A', to: '7486 Pin 1 & 7408 Pin 1' },
        { from: 'Switch B', to: '7486 Pin 2 & 7408 Pin 2' },
        { from: '7486 Pin 3 (Sum)', to: '330Ω -> Green LED -> GND' },
        { from: '7408 Pin 3 (Carry)', to: '330Ω -> Red LED -> GND' },
        { from: '+5V Rail', to: '7486 Pin 14 & 7408 Pin 14' },
        { from: 'GND Rail', to: '7486 Pin 7 & 7408 Pin 7' }
      ],
      testingProcedure: [
        'Set A=0, B=0: Both LEDs OFF.',
        'Set A=0, B=1: Green (Sum) ON, Red (Carry) OFF.',
        'Set A=1, B=0: Green (Sum) ON, Red (Carry) OFF.',
        'Set A=1, B=1: Green (Sum) OFF, Red (Carry) ON.'
      ],
      expectedOutput: 'Sum LED lights up on odd parity (01 or 10); Carry LED lights up only on 11.',
      commonMistakesAndTroubleshooting: [
        {
          mistake: 'Carry LED turns ON when only one switch is closed.',
          solution: 'Check for a bridge/short between Switch A and Switch B lines on the breadboard.'
        }
      ]
    },
    practiceProblems: [
      {
        id: 'p-ha-1',
        question: 'Why cannot a Half Adder be used directly for adding multi-bit numbers beyond the LSB?',
        type: 'mcq',
        difficulty: 'Intermediate',
        options: [
          'It is too slow',
          'It lacks a Carry-In (Cin) input to accept carry from the preceding bit stage',
          'It produces an analog output',
          'It consumes too much power'
        ],
        correctAnswer: 1,
        explanation: 'Multi-bit addition requires adding A, B, and the carry generated by the previous column (Cin). Because the half adder has only two inputs (A and B), it cannot process an incoming carry.'
      }
    ]
  },

  // --- MODULE 4: FULL ADDER ---
  {
    id: 'topic-full-adder',
    moduleId: 'module-4',
    slug: 'full-adder',
    title: 'Full Adder',
    subtitle: 'The complete 3-input binary adder handling A, B, and incoming Carry.',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    order: 2,
    isPublished: true,
    introduction: {
      definition: 'A Full Adder is a combinational circuit that adds three 1-bit binary inputs: two operand bits A and B, and an incoming carry bit Cin from a less-significant stage. It generates two outputs: Sum (S) and Carry Out (Cout).',
      importance: 'Full adders are cascaded to build n-bit parallel binary adders (such as 4-bit 7483/74283, 32-bit, and 64-bit ALUs in modern CPUs).',
      practicalApplications: [
        'Ripple-carry and carry-lookahead adders in CPU arithmetic logic units',
        'Hardware multipliers (Wallace tree and carry-save adders)',
        'Digital address calculation units (AGUs)'
      ],
      learningObjectives: [
        'Construct the 8-row truth table for 3-input binary addition',
        'Derive equations: Sum = A ⊕ B ⊕ Cin and Cout = AB + Cin(A ⊕ B)',
        'Cascade two half adders and an OR gate to build a full adder'
      ]
    },
    explanation: {
      stepByStep: [
        {
          stepTitle: '1. 3-Bit Addition Principle',
          content: 'The full adder calculates: Total = A + B + Cin. The sum bit S is the LSB of the result, and Cout is the MSB (weight 2).',
          formula: 'A + B + C_{in} = 2 \\cdot C_{out} + S'
        },
        {
          stepTitle: '2. Cascade of Two Half Adders',
          content: 'Half Adder 1 adds A and B, producing S1 = A ⊕ B and C1 = A · B. Half Adder 2 adds S1 and Cin, producing Final Sum = S1 ⊕ Cin = A ⊕ B ⊕ Cin. The final carry Cout is HIGH if either half adder produces a carry: Cout = C1 + C2 = AB + Cin(A ⊕ B).',
          formula: 'S = A \\oplus B \\oplus C_{in}, \\quad C_{out} = A \\cdot B + C_{in}(A \\oplus B)'
        }
      ],
      keyTakeaways: [
        'Adds 3 bits: A, B, and Cin.',
        'Outputs: Sum (S) and Carry Out (Cout).',
        'Constructed using 2 XOR gates, 2 AND gates, and 1 OR gate (or two Half Adders + OR gate).'
      ],
      formulas: ['S = A ⊕ B ⊕ Cin', 'Cout = AB + BCin + ACin = AB + Cin(A ⊕ B)']
    },
    truthTable: {
      inputs: ['A', 'B', 'Cin'],
      outputs: ['Sum (S)', 'Cout'],
      description: 'Complete 3-input Full Adder Truth Table.',
      rows: [
        { inputs: [0, 0, 0], outputs: [0, 0], label: '0 + 0 + 0 = 0 (S=0, Cout=0)' },
        { inputs: [0, 0, 1], outputs: [1, 0], label: '0 + 0 + 1 = 1 (S=1, Cout=0)' },
        { inputs: [0, 1, 0], outputs: [1, 0], label: '0 + 1 + 0 = 1 (S=1, Cout=0)' },
        { inputs: [0, 1, 1], outputs: [0, 1], label: '0 + 1 + 1 = 2 (S=0, Cout=1)' },
        { inputs: [1, 0, 0], outputs: [1, 0], label: '1 + 0 + 0 = 1 (S=1, Cout=0)' },
        { inputs: [1, 0, 1], outputs: [0, 1], label: '1 + 0 + 1 = 2 (S=0, Cout=1)' },
        { inputs: [1, 1, 0], outputs: [0, 1], label: '1 + 1 + 0 = 2 (S=0, Cout=1)' },
        { inputs: [1, 1, 1], outputs: [1, 1], label: '1 + 1 + 1 = 3 (S=1, Cout=1)' }
      ]
    },
    booleanExpression: {
      primaryExpression: 'Sum = A ⊕ B ⊕ Cin,  Cout = AB + Cin(A ⊕ B)',
      sopForm: 'Sum = Σm(1, 2, 4, 7),  Cout = Σm(3, 5, 6, 7)',
      posForm: 'Sum = ΠM(0, 3, 5, 6),  Cout = ΠM(0, 1, 2, 4)',
      canonicalSop: 'Sum = A\'B\'Cin + A\'BCin\' + AB\'Cin\' + ABCin',
      canonicalPos: 'Cout = (A + B)(A + Cin)(B + Cin)',
      derivationSteps: [
        {
          step: 1,
          title: 'K-Map Minimization for Cout',
          explanation: 'Grouping cells 3, 5, 6, 7 in a 3-variable K-Map yields three pairs: AB, BCin, and ACin.',
          equation: 'C_{out} = AB + BC_{in} + AC_{in}'
        },
        {
          step: 2,
          title: 'Hardware Optimization for XOR sharing',
          explanation: 'Factoring Cin: Cout = AB + Cin(A\'B + AB\') = AB + Cin(A ⊕ B). This allows reusing the (A ⊕ B) term already computed for the Sum.',
          equation: 'C_{out} = AB + C_{in}(A \\oplus B)'
        }
      ]
    },
    circuitDiagram: {
      type: 'combinational',
      inputs: [
        { id: 'in_a', name: 'Input A', defaultValue: 0 },
        { id: 'in_b', name: 'Input B', defaultValue: 0 },
        { id: 'in_cin', name: 'Input Cin', defaultValue: 0 }
      ],
      outputs: [
        { id: 'out_sum', name: 'Sum (S)', logicExpr: 'A ^ B ^ Cin' },
        { id: 'out_cout', name: 'Cout', logicExpr: '(A && B) || (Cin && (A ^ B))' }
      ],
      gates: [
        { id: 'xor1', type: 'XOR', label: '7486 XOR 1', inputs: ['in_a', 'in_b'], output: 'int_xor1', x: 200, y: 70 },
        { id: 'xor2', type: 'XOR', label: '7486 XOR 2 (Sum)', inputs: ['int_xor1', 'in_cin'], output: 'out_sum', x: 380, y: 90 },
        { id: 'and1', type: 'AND', label: '7408 AND 1', inputs: ['in_a', 'in_b'], output: 'int_and1', x: 240, y: 200 },
        { id: 'and2', type: 'AND', label: '7408 AND 2', inputs: ['int_xor1', 'in_cin'], output: 'int_and2', x: 380, y: 240 },
        { id: 'or1', type: 'OR', label: '7432 OR (Cout)', inputs: ['int_and1', 'int_and2'], output: 'out_cout', x: 520, y: 220 }
      ],
      description: 'Two cascaded half adders with OR gate for carry generation.'
    },
    hardwareImplementation: {
      requiredComponents: [
        { name: 'IC 7486 (XOR)', quantity: 1 },
        { name: 'IC 7408 (AND)', quantity: 1 },
        { name: 'IC 7432 (OR)', quantity: 1 },
        { name: 'Switches', quantity: 3 },
        { name: 'LEDs (Green for Sum, Red for Cout)', quantity: 2 },
        { name: '330Ω Resistors', quantity: 2 }
      ],
      icNumbers: ['7486', '7408', '7432'],
      supplyVoltage: '5.0V DC',
      powerConsiderations: 'Wire Pin 14 of all three chips to +5V and Pin 7 of all three chips to GND.',
      breadboardWiringSteps: [
        '1. Insert 7486, 7408, and 7432 onto the breadboard.',
        '2. Connect VCC (Pin 14) and GND (Pin 7) on all three ICs.',
        '3. Wire inputs A and B to 7486 Pins 1 & 2.',
        '4. Connect 7486 Pin 3 (A ⊕ B) to 7486 Pin 4 and 7408 Pin 4.',
        '5. Connect Cin to 7486 Pin 5 and 7408 Pin 5.',
        '6. 7486 Pin 6 is Sum -> Green LED.',
        '7. Connect 7408 Pin 3 and Pin 6 to 7432 Pins 1 and 2.',
        '8. 7432 Pin 3 is Cout -> Red LED.'
      ],
      exactPinConnections: [
        { from: 'Switch A & B', to: '7486 Pins 1, 2' },
        { from: '7486 Pin 3', to: '7486 Pin 4 & 7408 Pin 4' },
        { from: 'Switch Cin', to: '7486 Pin 5 & 7408 Pin 5' },
        { from: '7486 Pin 6', to: 'Sum LED' },
        { from: '7432 Pin 3', to: 'Cout LED' }
      ],
      testingProcedure: [
        'Test all 8 combinations from 000 to 111.',
        'Notice 0+0+0=00, 1+1+0=10 (Sum=0, Cout=1), 1+1+1=11 (Sum=1, Cout=1).'
      ],
      expectedOutput: 'Matches the verified full-adder truth table for all 8 states.',
      commonMistakesAndTroubleshooting: [
        {
          mistake: 'Sum works for A and B but fails when Cin is toggled.',
          solution: 'Verify Cin connection to both second XOR (7486 Pin 5) and second AND (7408 Pin 5).'
        }
      ]
    },
    practiceProblems: [
      {
        id: 'p-fa-1',
        question: 'If inputs A = 1, B = 1, and Cin = 1 are applied to a full adder, what are the outputs Sum and Cout?',
        type: 'mcq',
        difficulty: 'Beginner',
        options: ['Sum = 0, Cout = 1', 'Sum = 1, Cout = 1', 'Sum = 1, Cout = 0', 'Sum = 0, Cout = 0'],
        correctAnswer: 1,
        explanation: '1 + 1 + 1 = 3 in decimal = 11 in binary, which corresponds to Sum = 1 and Cout = 1.'
      }
    ]
  },

  // --- MODULE 5: SR FLIP-FLOP ---
  {
    id: 'topic-sr-flip-flop',
    moduleId: 'module-5',
    slug: 'sr-flip-flop',
    title: 'SR Flip-Flop & Latch',
    subtitle: 'The foundational bistable multivibrator providing 1-bit volatile memory storage.',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    order: 2,
    isPublished: true,
    introduction: {
      definition: 'The Set-Reset (SR) Flip-Flop is a bistable sequential circuit with two inputs (S for Set, R for Reset) and two complementary outputs (Q and Q\'). When S=1 and R=0, Q is set to 1. When S=0 and R=1, Q is reset to 0. When S=0 and R=0, the circuit holds its previous state (memory). The condition S=1 and R=1 is prohibited.',
      importance: 'It is the fundamental building block of all digital memory cells, static RAM (SRAM), switch debouncers, and control registers.',
      practicalApplications: [
        'Mechanical switch contact debouncing',
        '1-bit static RAM memory cells',
        'Motor run/stop latching control circuits'
      ],
      learningObjectives: [
        'Understand sequential feedback and bistability',
        'Analyze characteristic table, excitation table, and timing diagram',
        'Wire an active-low SR latch using IC 7400'
      ]
    },
    explanation: {
      stepByStep: [
        {
          stepTitle: '1. Bistability and Memory Feedback',
          content: 'Unlike combinational circuits where outputs depend only on present inputs, sequential circuits feed the output back into the input. This feedback loop creates two stable operating states: State 0 (Q=0, Q\'=1) and State 1 (Q=1, Q\'=0).',
          formula: 'Q(t+1) = S + R\' \\cdot Q(t) \\quad \\text{with constraint } S \\cdot R = 0'
        },
        {
          stepTitle: '2. Forbidden / Prohibited State',
          content: 'If both Set and Reset are asserted simultaneously (S=1, R=1 in NOR latch, or S\'=0, R\'=0 in NAND latch), both outputs Q and Q\' are forced to the same logic level. When inputs are deasserted, the circuit enters a race condition with unpredictable output.',
          formula: 'S \\cdot R = 0 \\quad (\\text{Constraint for deterministic operation})'
        }
      ],
      keyTakeaways: [
        'Stores 1 bit of binary information.',
        'S=1, R=0 -> Set (Q=1). S=0, R=1 -> Reset (Q=0). S=0, R=0 -> Memory Hold.',
        'S=1, R=1 must be avoided to prevent race hazards.'
      ],
      formulas: ['Q(t+1) = S + R\'Q(t)', 'S · R = 0']
    },
    truthTable: {
      inputs: ['S', 'R', 'Q(t)'],
      outputs: ['Q(t+1)', "Q'(t+1)"],
      description: 'SR Flip-Flop Characteristic Table.',
      rows: [
        { inputs: [0, 0, 0], outputs: [0, 1], label: 'Hold (was 0)' },
        { inputs: [0, 0, 1], outputs: [1, 0], label: 'Hold (was 1)' },
        { inputs: [0, 1, 0], outputs: [0, 1], label: 'Reset (forces Q=0)' },
        { inputs: [0, 1, 1], outputs: [0, 1], label: 'Reset (forces Q=0)' },
        { inputs: [1, 0, 0], outputs: [1, 0], label: 'Set (forces Q=1)' },
        { inputs: [1, 0, 1], outputs: [1, 0], label: 'Set (forces Q=1)' },
        { inputs: [1, 1, 0], outputs: [0, 0], label: 'Invalid / Prohibited State' },
        { inputs: [1, 1, 1], outputs: [0, 0], label: 'Invalid / Prohibited State' }
      ]
    },
    booleanExpression: {
      primaryExpression: "Q(t+1) = S + R' · Q(t)",
      derivationSteps: [
        {
          step: 1,
          title: 'K-Map Minimization of Next State',
          explanation: 'Plotting Q(t+1) on a 3-variable K-Map with variables S, R, Q(t) and treating S=1, R=1 as don\'t care conditions yields the characteristic equation.',
          equation: "Q(t+1) = S + R' \\cdot Q(t)"
        }
      ]
    },
    circuitDiagram: {
      type: 'sequential',
      inputs: [
        { id: 'in_s', name: 'Set (S)', defaultValue: 0 },
        { id: 'in_r', name: 'Reset (R)', defaultValue: 0 }
      ],
      outputs: [
        { id: 'out_q', name: 'Output Q', logicExpr: 'S || (!R && Q)' },
        { id: 'out_qbar', name: "Output Q'", logicExpr: '!(S || (!R && Q))' }
      ],
      gates: [
        { id: 'nor1', type: 'NOR', label: 'NOR Gate 1', inputs: ['in_r', 'out_qbar'], output: 'out_q', x: 260, y: 80 },
        { id: 'nor2', type: 'NOR', label: 'NOR Gate 2', inputs: ['in_s', 'out_q'], output: 'out_qbar', x: 260, y: 220 }
      ],
      description: 'Cross-coupled NOR latch with cross-feedback lines.'
    },
    hardwareImplementation: {
      requiredComponents: [
        { name: 'IC 7402 (Quad 2-Input NOR) or IC 7400 (Quad NAND)', quantity: 1 },
        { name: 'Breadboard & +5V Supply', quantity: 1 },
        { name: '2 Pushbuttons or SPDT Switches', quantity: 2 },
        { name: '2 LEDs (Q and Q_bar)', quantity: 2 },
        { name: '330Ω Resistors', quantity: 2 },
        { name: '10kΩ Resistors', quantity: 2 }
      ],
      icNumbers: ['7402', '7400'],
      supplyVoltage: '5.0V DC',
      powerConsiderations: 'Pin 14 to +5V, Pin 7 to GND.',
      breadboardWiringSteps: [
        '1. Place IC 7402 across center divide.',
        '2. Power Pin 14 to +5V and Pin 7 to GND.',
        '3. Cross-couple Pin 1 (1Y, Q) to Pin 5 (2A).',
        '4. Cross-couple Pin 4 (2Y, Q\') to Pin 3 (1B).',
        '5. Connect Reset to Pin 2 (1A) with 10kΩ pull-down.',
        '6. Connect Set to Pin 6 (2B) with 10kΩ pull-down.',
        '7. Connect Pin 1 to Q LED and Pin 4 to Q\' LED.'
      ],
      exactPinConnections: [
        { from: 'Reset Switch', to: '7402 Pin 2 (1A)' },
        { from: 'Set Switch', to: '7402 Pin 6 (2B)' },
        { from: '7402 Pin 1 (Q)', to: '7402 Pin 5 (2A) & Q LED' },
        { from: '7402 Pin 4 (Q\')', to: '7402 Pin 3 (1B) & Q\' LED' }
      ],
      testingProcedure: [
        'Press Set button: Q LED lights up (1), Q\' turns OFF (0).',
        'Release Set button: Q remains ON (verifying memory retention).',
        'Press Reset button: Q turns OFF (0), Q\' lights up (1).',
        'Release Reset button: Q remains OFF.'
      ],
      expectedOutput: 'Stable latching memory operation across transitions.',
      commonMistakesAndTroubleshooting: [
        {
          mistake: 'IC 7402 pinout confusion.',
          solution: 'Remember Pin 1 is OUTPUT 1Y on the 7402, unlike 7408/7432.'
        }
      ]
    },
    practiceProblems: [
      {
        id: 'p-sr-1',
        question: 'Why is the input condition S=1, R=1 called "forbidden" or "invalid" in an SR latch?',
        type: 'mcq',
        difficulty: 'Intermediate',
        options: [
          'It burns out the transistors inside the chip',
          'It violates the complementary output property Q\' = NOT(Q) and creates unpredictable behavior upon releasing inputs',
          'It inverts the power supply polarity',
          'It causes excessive current drain in battery systems'
        ],
        correctAnswer: 1,
        explanation: 'In a NOR latch, S=1 and R=1 forces both Q=0 and Q\'=0, violating complementarity. When both return to 0 simultaneously, slight gate delay differences determine which state wins, causing a race hazard.'
      }
    ]
  },

  // --- MODULE 3: KARNAUGH MAP (4 VARIABLES) ---
  {
    id: 'topic-kmap-4-var',
    moduleId: 'module-3',
    slug: 'karnaugh-map-4-variables',
    title: 'Karnaugh Map (4 Variables)',
    subtitle: 'Optimal graphical minimization of Boolean functions with 16 cells and wraparound grouping.',
    difficulty: 'Advanced',
    estimatedMinutes: 40,
    order: 10,
    isPublished: true,
    introduction: {
      definition: 'A 4-variable Karnaugh Map (K-Map) is a 4×4 grid of 16 cells, where each cell represents a distinct minterm (m0 to m15) of variables A, B, C, and D. Rows and columns are indexed using Gray code (00, 01, 11, 10) so that adjacent cells differ by exactly one binary bit.',
      importance: 'K-Maps provide a visual, systematic method to find the minimal Sum of Products (SOP) or Product of Sums (POS) without complex Boolean algebraic manipulations, reducing chip gate count and delay.',
      practicalApplications: [
        'Minimizing logic gate count in custom ASIC / FPGA synthesis',
        'Simplifying combinational controller decoders',
        'Designing optimal BCD-to-7-segment decoder equations'
      ],
      learningObjectives: [
        'Understand Gray code indexing: 00, 01, 11, 10',
        'Form valid power-of-2 groups (16, 8, 4, 2, 1)',
        'Identify wraparound adjacency (edges and the 4 corners)',
        'Synthesize minimal SOP and POS expressions'
      ]
    },
    explanation: {
      stepByStep: [
        {
          stepTitle: '1. Gray Code Cell Ordering',
          content: 'Rows are indexed by AB: 00 (row 0), 01 (row 1), 11 (row 2), 10 (row 3). Columns are indexed by CD: 00 (col 0), 01 (col 1), 11 (col 2), 10 (col 3). Note the 3rd row and column represent 11, not 10! This ensures Hamming distance = 1 between neighbors.',
          formula: '\\text{Minterm } m = A \\cdot 2^3 + B \\cdot 2^2 + C \\cdot 2^1 + D \\cdot 2^0'
        },
        {
          stepTitle: '2. Grouping Rules',
          content: '1. Group sizes MUST be powers of 2 (1, 2, 4, 8, 16).\n2. Groups must be rectangular or square.\n3. Make groups as large as possible (larger group = fewer variables in the term).\n4. A cell can belong to multiple groups (overlap is allowed and encouraged).\n5. Don\'t care terms (X) can be included in groups to enlarge them.',
          formula: '\\text{Variables eliminated} = \\log_2(\\text{Group size})'
        },
        {
          stepTitle: '3. Wraparound and Corner Adjacency',
          content: 'The map forms a torus: the leftmost column (00) is adjacent to the rightmost column (10). The top row (00) is adjacent to the bottom row (10). The 4 outer corners {m0, m2, m8, m10} form a valid group of 4, eliminating B and D to leave B\' · D\'!',
          formula: '\\{m_0, m_2, m_8, m_{10}\\} \\implies B\' \\cdot D\''
        }
      ],
      keyTakeaways: [
        '16 cells representing minterms 0 to 15.',
        'Gray code sequence: 00, 01, 11, 10.',
        'A group of 2 eliminates 1 variable; a group of 4 eliminates 2 variables; a group of 8 eliminates 3 variables.',
        'Always cover all 1s with the minimum number of largest possible prime implicants.'
      ],
      formulas: ['SOP: Y = \\sum m_i', 'POS: Y = \\prod M_i']
    },
    truthTable: {
      inputs: ['A', 'B', 'C', 'D'],
      outputs: ['Y'],
      description: 'Example 4-variable function truth table.',
      rows: [
        { inputs: [0, 0, 0, 0], outputs: [1], label: 'm0 (Corner)' },
        { inputs: [0, 0, 1, 0], outputs: [1], label: 'm2 (Corner)' },
        { inputs: [1, 0, 0, 0], outputs: [1], label: 'm8 (Corner)' },
        { inputs: [1, 0, 1, 0], outputs: [1], label: 'm10 (Corner)' }
      ]
    },
    booleanExpression: {
      primaryExpression: "Y = B' · D'",
      canonicalSop: 'Y = Σm(0, 2, 8, 10)',
      derivationSteps: [
        {
          step: 1,
          title: 'Corner Grouping',
          explanation: 'Cells m0 (0000), m2 (0010), m8 (1000), m10 (1010) are adjacent across the 4 corners of the map.',
          equation: '\\{0000, 0010, 1000, 1010\\}'
        },
        {
          step: 2,
          title: 'Variable Cancellation',
          explanation: 'A changes from 0 to 1 (eliminated). B is constant 0 (retained as B\'). C changes from 0 to 1 (eliminated). D is constant 0 (retained as D\').',
          equation: "Y = B' \\cdot D'"
        }
      ]
    },
    hardwareImplementation: {
      requiredComponents: [
        { name: 'IC 7404 (Hex Inverter)', quantity: 1 },
        { name: 'IC 7408 (AND Gate)', quantity: 1 }
      ],
      icNumbers: ['7404', '7408'],
      supplyVoltage: '5.0V DC',
      powerConsiderations: 'Pin 14 to +5V, Pin 7 to GND.',
      breadboardWiringSteps: [
        '1. Place 7404 and 7408 on breadboard.',
        '2. Invert inputs B and D using 7404 to get B\' and D\'.',
        '3. Feed B\' and D\' into 7408 Pin 1 and Pin 2.',
        '4. Pin 3 of 7408 outputs the minimized term Y = B\'D\'.'
      ],
      exactPinConnections: [
        { from: 'Switch B', to: '7404 Pin 1' },
        { from: 'Switch D', to: '7404 Pin 3' },
        { from: '7404 Pin 2 (B\')', to: '7408 Pin 1' },
        { from: '7404 Pin 4 (D\')', to: '7408 Pin 2' }
      ],
      testingProcedure: [
        'Verify that output LED is ON whenever B=0 and D=0, regardless of the states of A and C.'
      ],
      expectedOutput: 'Output is HIGH for m0, m2, m8, m10.',
      commonMistakesAndTroubleshooting: [
        {
          mistake: 'Assuming corners cannot group.',
          solution: 'Remember K-Map wraps around both top-to-bottom and left-to-right.'
        }
      ]
    },
    practiceProblems: [
      {
        id: 'p-km-1',
        question: 'In a 4-variable K-Map, how many variables are eliminated when an octet (group of 8 cells) is formed?',
        type: 'mcq',
        difficulty: 'Intermediate',
        options: ['1 variable', '2 variables', '3 variables', '4 variables'],
        correctAnswer: 2,
        explanation: 'Variables eliminated = log2(group size). Since log2(8) = 3, forming a group of 8 cells eliminates 3 variables, leaving a single literal in the product term.'
      }
    ]
  }
];
