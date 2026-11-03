export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  estimatedHours: number;
  topicsCount?: number;
}

export interface TruthTableRow {
  inputs: number[];
  outputs: number[];
  label?: string;
}

export interface TruthTableData {
  inputs: string[];
  outputs: string[];
  rows: TruthTableRow[];
  description?: string;
}

export interface DerivationStep {
  step: number;
  title: string;
  explanation: string;
  equation: string;
}

export interface BooleanExpressionData {
  primaryExpression: string;
  sopForm?: string;
  posForm?: string;
  canonicalSop?: string;
  canonicalPos?: string;
  derivationSteps: DerivationStep[];
  algebraicLawsUsed?: string[];
}

export interface CircuitGate {
  id: string;
  type: 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'BUFFER';
  label: string;
  inputs: string[]; // wire/input names
  output: string;
  x?: number;
  y?: number;
}

export interface CircuitDiagramData {
  type: 'basic-gate' | 'combinational' | 'sequential' | 'subsystem';
  inputs: { id: string; name: string; defaultValue: number }[];
  outputs: { id: string; name: string; logicExpr: string }[];
  gates: CircuitGate[];
  description?: string;
  wiringNotes?: string;
}

export interface ICPin {
  pin: number;
  label: string;
  desc: string;
  type: 'input' | 'output' | 'vcc' | 'gnd' | 'control' | 'nc';
}

export interface ICComponent {
  id: string;
  icNumber: string;
  name: string;
  family: '74xx TTL' | '74HC CMOS' | '4000 CMOS' | 'Specialized';
  functionDescription: string;
  pinCount: number;
  pins: ICPin[];
  truthTable?: TruthTableData;
  typicalApplications: string[];
  supplyVoltageRange: string;
  propagationDelay: string;
  fanOut: string;
  datasheetUrl?: string;
  breadboardTips: string[];
}

export interface HardwareImplementationData {
  requiredComponents: { name: string; quantity: number; spec?: string }[];
  icNumbers: string[];
  supplyVoltage: string; // e.g. "5V DC ±5% (Standard TTL Vcc)"
  powerConsiderations: string;
  breadboardWiringSteps: string[];
  exactPinConnections: { from: string; to: string; note?: string }[];
  testingProcedure: string[];
  expectedOutput: string;
  commonMistakesAndTroubleshooting: { mistake: string; solution: string }[];
}

export interface PracticeProblem {
  id: string;
  question: string;
  type: 'mcq' | 'truth-table' | 'expression' | 'concept';
  difficulty: DifficultyLevel;
  options?: string[];
  correctAnswer: number | string;
  explanation: string;
  hint?: string;
}

export interface Topic {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  subtitle: string;
  difficulty: DifficultyLevel;
  estimatedMinutes: number;
  order: number;
  isPublished: boolean;
  
  // Section A: Introduction
  introduction: {
    definition: string;
    importance: string;
    practicalApplications: string[];
    learningObjectives: string[];
  };

  // Section B: Detailed Explanation
  explanation: {
    stepByStep: { stepTitle: string; content: string; formula?: string }[];
    keyTakeaways: string[];
    formulas?: string[];
  };

  // Section C: Truth Table
  truthTable?: TruthTableData;

  // Section D: Boolean Expression
  booleanExpression?: BooleanExpressionData;

  // Section E: Circuit Diagram & Simulation
  circuitDiagram?: CircuitDiagramData;

  // Section G: Real Hardware Implementation
  hardwareImplementation?: HardwareImplementationData;

  // Section H: Practice Problems
  practiceProblems?: PracticeProblem[];
}

export interface PracticalExperiment {
  id: string;
  experimentNumber: number;
  title: string;
  slug: string;
  moduleId?: string;
  objective: string;
  requiredEquipment: { item: string; quantity: number; spec?: string }[];
  icNumbers: string[];
  circuitDiagramDescription: string;
  circuitType: string;
  pinConnections: { pin: string; connectTo: string; functionDesc: string }[];
  procedureSteps: string[];
  observationTable: {
    headers: string[];
    rows: (number | string)[][];
    expectedRows: (number | string)[][];
  };
  resultsSummary: string;
  troubleshootingGuide: { problem: string; check: string; remedy: string }[];
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  topicId?: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index in options
  explanation: string;
  difficulty: DifficultyLevel;
}

export interface UserProgress {
  completedTopics: string[]; // topic slugs
  bookmarkedTopics: string[]; // topic slugs
  quizScores: { [quizId: string]: { score: number; total: number; date: string } };
  lastVisitedTopic?: { moduleId: string; topicId: string; slug: string; title: string };
  experimentCompletions: string[]; // experiment ids
}
