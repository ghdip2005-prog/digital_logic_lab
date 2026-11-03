import { QuizQuestion } from '@/types';

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    moduleId: 'module-1',
    question: 'What is the 2\'s complement representation of the decimal number -5 in an 8-bit register?',
    options: ['11111011', '11111010', '00000101', '10000101'],
    correctAnswer: 0,
    explanation: 'Step 1: Write +5 in 8-bit binary: 00000101. Step 2: Invert all bits (1\'s complement): 11111010. Step 3: Add 1: 11111010 + 1 = 11111011.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q2',
    moduleId: 'module-1',
    question: 'Which of the following is an invalid BCD (Binary Coded Decimal) code?',
    options: ['1001', '0111', '1010', '0000'],
    correctAnswer: 2,
    explanation: 'BCD digits only represent decimal numbers 0 through 9 (0000₂ to 1001₂). 1010₂ represents decimal 10, which is invalid in standard BCD.',
    difficulty: 'Beginner'
  },
  {
    id: 'q3',
    moduleId: 'module-1',
    question: 'Convert the binary number 10110 to Gray Code:',
    options: ['11101', '10101', '11001', '11111'],
    correctAnswer: 0,
    explanation: 'MSB is unchanged: G4 = B4 = 1. G3 = 1 ⊕ 0 = 1. G2 = 0 ⊕ 1 = 1. G1 = 1 ⊕ 1 = 0. G0 = 1 ⊕ 0 = 1. Result = 11101.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q4',
    moduleId: 'module-2',
    question: 'Which logic gate produces a LOW (0) output ONLY when all its inputs are HIGH (1)?',
    options: ['NOR', 'NAND', 'XOR', 'AND'],
    correctAnswer: 1,
    explanation: 'A NAND gate is the inverse of an AND gate. Its output is 0 if and only if all inputs are 1. For all other combinations, the output is 1.',
    difficulty: 'Beginner'
  },
  {
    id: 'q5',
    moduleId: 'module-2',
    question: 'Why are NAND and NOR gates called Universal Gates?',
    options: [
      'Because they operate faster than all other gates',
      'Because any Boolean function or logic gate can be implemented using only NAND or only NOR gates',
      'Because they consume the least power in CMOS technology',
      'Because they can accept unlimited inputs'
    ],
    correctAnswer: 1,
    explanation: 'A universal logic gate can synthesize AND, OR, and NOT operations. Since any digital circuit can be built from AND, OR, and NOT, NAND and NOR alone can construct any digital system.',
    difficulty: 'Beginner'
  },
  {
    id: 'q6',
    moduleId: 'module-3',
    question: 'According to De Morgan\'s theorem, the expression (A + B + C)\' is equivalent to:',
    options: ['A\' · B\' · C\'', 'A\' + B\' + C\'', '(A · B · C)\'', 'A + B\' · C'],
    correctAnswer: 0,
    explanation: 'De Morgan\'s first theorem states that the complement of a sum is equal to the product of the complements: (A + B + C)\' = A\' · B\' · C\'.',
    difficulty: 'Beginner'
  },
  {
    id: 'q7',
    moduleId: 'module-3',
    question: 'In a 4-variable Karnaugh Map, grouping all 4 corner cells (m0, m2, m8, m10) eliminates which variables?',
    options: ['Eliminates A and C', 'Eliminates B and D, yielding B\' · D\'', 'Eliminates B and D, yielding B\' · D', 'Eliminates A and D'],
    correctAnswer: 1,
    explanation: 'm0=0000, m2=0010, m8=1000, m10=1010. Variable A changes (0 and 1), variable C changes (0 and 1). Variables B=0 and D=0 remain constant. The simplified term is B\' · D\'.',
    difficulty: 'Advanced'
  },
  {
    id: 'q8',
    moduleId: 'module-4',
    question: 'What are the Boolean equations for the Sum (S) and Carry (C) of a Half Adder?',
    options: ['S = A · B, C = A ⊕ B', 'S = A ⊕ B, C = A · B', 'S = A + B, C = A · B', 'S = (A ⊕ B)\', C = A + B'],
    correctAnswer: 1,
    explanation: 'Sum bit is the Exclusive-OR of the two inputs: S = A ⊕ B. The Carry bit is generated only when both inputs are 1: C = A · B.',
    difficulty: 'Beginner'
  },
  {
    id: 'q9',
    moduleId: 'module-4',
    question: 'How many select lines are required for an 8-to-1 Multiplexer?',
    options: ['2', '3', '4', '8'],
    correctAnswer: 1,
    explanation: 'For a 2^n to 1 multiplexer, n select lines are needed. Since 8 = 2³, exactly 3 select lines (e.g. S2, S1, S0) are required.',
    difficulty: 'Beginner'
  },
  {
    id: 'q10',
    moduleId: 'module-5',
    question: 'What is the primary difference between a Latch and a Flip-Flop?',
    options: [
      'Latches are synchronous while Flip-Flops are asynchronous',
      'Latches are level-triggered while Flip-Flops are edge-triggered by a clock pulse',
      'Latches cannot store data while Flip-Flops can',
      'Flip-Flops are built only with discrete relays'
    ],
    correctAnswer: 1,
    explanation: 'Latches are transparent level-sensitive devices (outputs respond whenever the enable is asserted). Flip-flops are edge-triggered (outputs update only at the discrete rising or falling transition of a clock signal).',
    difficulty: 'Intermediate'
  },
  {
    id: 'q11',
    moduleId: 'module-5',
    question: 'What happens to the output of a JK flip-flop when both inputs are HIGH (J=1, K=1) and a clock pulse arrives?',
    options: ['The output resets to 0', 'The output sets to 1', 'The output toggles (inverts its previous state)', 'The output enters an invalid forbidden state'],
    correctAnswer: 2,
    explanation: 'When J=1 and K=1, the JK flip-flop operates in Toggle mode: Q(t+1) = Q\'(t). This overcomes the invalid state limitation of the basic SR flip-flop.',
    difficulty: 'Beginner'
  },
  {
    id: 'q12',
    moduleId: 'module-6',
    question: 'In a 4-bit Ring Counter, how many distinct states are in the counting cycle?',
    options: ['16 states', '8 states', '4 states', '2 states'],
    correctAnswer: 2,
    explanation: 'An N-bit Ring Counter circulates a single \'1\' bit through N flip-flops, yielding exactly N unique states (for 4 bits: 1000 -> 0100 -> 0010 -> 0001 -> 1000).',
    difficulty: 'Intermediate'
  },
  {
    id: 'q13',
    moduleId: 'module-7',
    question: 'Which type of 7-segment display requires active-LOW drive signals and has all LED anodes tied to +VCC?',
    options: ['Common Cathode', 'Common Anode', 'Multiplexed LCD', 'Dot Matrix'],
    correctAnswer: 1,
    explanation: 'In a Common Anode display, all positive terminals (anodes) are tied together to +5V (VCC). A segment illuminates when its corresponding cathode pin is driven LOW (pulled to ground), sinking current.',
    difficulty: 'Intermediate'
  },
  {
    id: 'q14',
    moduleId: 'module-8',
    question: 'What is the setup time (t_su) of an edge-triggered flip-flop?',
    options: [
      'The time required for the output to change after clock edge',
      'The minimum duration the data input must remain stable BEFORE the active clock transition',
      'The minimum duration the data input must remain stable AFTER the active clock transition',
      'The total clock period'
    ],
    correctAnswer: 1,
    explanation: 'Setup time (t_su) is the minimum required interval during which the data signal D must remain steady before the clock edge arrives to ensure reliable latching without entering metastability.',
    difficulty: 'Advanced'
  }
];
