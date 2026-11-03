import { Module } from '@/types';

export const INITIAL_MODULES: Module[] = [
  {
    id: 'module-1',
    slug: 'number-systems-and-codes',
    title: 'Number Systems and Codes',
    description: 'Foundations of digital representation: Decimal, Binary, Octal, Hexadecimal, BCD, Gray code, and 1s/2s complement arithmetic.',
    iconName: 'Binary',
    order: 1,
    estimatedHours: 6,
    topicsCount: 17
  },
  {
    id: 'module-2',
    slug: 'basic-logic-gates',
    title: 'Basic Logic Gates',
    description: 'The fundamental building blocks of digital logic: AND, OR, NOT, NAND, NOR, XOR, XNOR, and universal gate implementations.',
    iconName: 'Cpu',
    order: 2,
    estimatedHours: 5,
    topicsCount: 10
  },
  {
    id: 'module-3',
    slug: 'boolean-algebra-and-kmap',
    title: 'Boolean Algebra and K-Map',
    description: 'Algebraic laws, De Morgan theorems, SOP & POS forms, Minterms/Maxterms, and optimal minimization via 2, 3, and 4-variable Karnaugh Maps.',
    iconName: 'GitMerge',
    order: 3,
    estimatedHours: 8,
    topicsCount: 12
  },
  {
    id: 'module-4',
    slug: 'combinational-logic-circuits',
    title: 'Combinational Logic Circuits',
    description: 'Design and analysis of memoryless circuits: Adders, Subtractors, Comparators, Encoders, Decoders, Multiplexers, and Parity checkers.',
    iconName: 'Network',
    order: 4,
    estimatedHours: 9,
    topicsCount: 14
  },
  {
    id: 'module-5',
    slug: 'sequential-logic-circuits',
    title: 'Sequential Logic Circuits',
    description: 'Memory and clock-driven circuits: Latches, SR, JK, D, and T Flip-Flops, Master-Slave architectures, and excitation tables.',
    iconName: 'Clock',
    order: 5,
    estimatedHours: 8,
    topicsCount: 10
  },
  {
    id: 'module-6',
    slug: 'registers-and-counters',
    title: 'Registers and Counters',
    description: 'Data storage and sequencing: Shift registers (SISO, SIPO, PISO, PIPO), Ring/Johnson counters, and Asynchronous/Synchronous Up/Down counters.',
    iconName: 'ListOrdered',
    order: 6,
    estimatedHours: 7,
    topicsCount: 14
  },
  {
    id: 'module-7',
    slug: 'display-and-practical-circuits',
    title: 'Display and Practical Circuits',
    description: 'Interfacing logic with the physical world: 7-segment displays (Common Anode & Cathode), BCD decoders, multiplexing, and traffic lights.',
    iconName: 'Tv',
    order: 7,
    estimatedHours: 6,
    topicsCount: 9
  },
  {
    id: 'module-8',
    slug: 'advanced-digital-electronics',
    title: 'Advanced Digital Electronics',
    description: 'Modern digital systems: ALUs, Semiconductor Memories (RAM/ROM), PLDs, FPGAs, Mealy & Moore FSMs, and timing analysis.',
    iconName: 'Microchip',
    order: 8,
    estimatedHours: 10,
    topicsCount: 10
  }
];
