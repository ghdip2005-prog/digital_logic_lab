// Number System & Code Conversion Engine

export type NumberBase = 'decimal' | 'binary' | 'octal' | 'hexadecimal' | 'bcd' | 'gray';

export interface ConversionStep {
  stepNumber: number;
  description: string;
  math: string;
  subResult?: string;
}

export interface ConversionResult {
  sourceBase: NumberBase;
  targetBase: NumberBase;
  inputValue: string;
  outputValue: string;
  isValid: boolean;
  errorMessage?: string;
  steps: ConversionStep[];
  binaryRepresentation?: string;
  twosComplement?: {
    original: string;
    onesComp: string;
    twosComp: string;
    decimalVal: number;
    steps: string[];
  };
}

/**
 * Validates input string against base rules
 */
export function validateNumberInput(val: string, base: NumberBase): { valid: boolean; message?: string } {
  const trimmed = val.trim().toUpperCase();
  if (!trimmed) return { valid: false, message: 'Input cannot be empty' };

  switch (base) {
    case 'binary':
      if (!/^[01]+(\.[01]+)?$/.test(trimmed)) {
        return { valid: false, message: 'Binary numbers contain only 0 and 1, with optional decimal point.' };
      }
      break;
    case 'octal':
      if (!/^[0-7]+(\.[0-7]+)?$/.test(trimmed)) {
        return { valid: false, message: 'Octal numbers contain only digits 0 through 7.' };
      }
      break;
    case 'decimal':
      if (!/^-?[0-9]+(\.[0-9]+)?$/.test(trimmed)) {
        return { valid: false, message: 'Decimal numbers contain digits 0 through 9.' };
      }
      break;
    case 'hexadecimal':
      if (!/^[0-9A-F]+(\.[0-9A-F]+)?$/.test(trimmed)) {
        return { valid: false, message: 'Hexadecimal numbers contain 0-9 and A-F.' };
      }
      break;
    case 'bcd':
      // BCD consists of 4-bit nibbles, each 0000-1001 (0-9)
      const cleanBcd = trimmed.replace(/\s+/g, '');
      if (!/^[01]+$/.test(cleanBcd) || cleanBcd.length % 4 !== 0) {
        return { valid: false, message: 'BCD must be binary with length multiple of 4 (e.g., 0101 1001).' };
      }
      // Check each nibble <= 9
      for (let i = 0; i < cleanBcd.length; i += 4) {
        const nibble = cleanBcd.substring(i, i + 4);
        if (parseInt(nibble, 2) > 9) {
          return { valid: false, message: `Invalid BCD nibble '${nibble}' (${parseInt(nibble, 2)} > 9). BCD digits only range 0000 to 1001.` };
        }
      }
      break;
    case 'gray':
      if (!/^[01]+$/.test(trimmed)) {
        return { valid: false, message: 'Gray code must consist of binary digits (0 and 1).' };
      }
      break;
  }
  return { valid: true };
}

/**
 * Binary to Gray Code conversion
 */
export function binaryToGray(binary: string): { gray: string; steps: ConversionStep[] } {
  const steps: ConversionStep[] = [];
  const b = binary.trim();
  if (!b) return { gray: '', steps: [] };

  const grayArr: string[] = [b[0]]; // MSB is identical
  steps.push({
    stepNumber: 1,
    description: 'Keep the Most Significant Bit (MSB) identical.',
    math: `G[0] = B[0] = ${b[0]}`,
    subResult: grayArr[0]
  });

  for (let i = 1; i < b.length; i++) {
    const bitA = parseInt(b[i - 1], 10);
    const bitB = parseInt(b[i], 10);
    const gBit = bitA ^ bitB;
    grayArr.push(gBit.toString());
    steps.push({
      stepNumber: i + 1,
      description: `Compute G[${i}] = B[${i - 1}] ⊕ B[${i}] (XOR of adjacent binary bits)`,
      math: `${bitA} ⊕ ${bitB} = ${gBit}`,
      subResult: grayArr.join('')
    });
  }

  return { gray: grayArr.join(''), steps };
}

/**
 * Gray Code to Binary conversion
 */
export function grayToBinary(gray: string): { binary: string; steps: ConversionStep[] } {
  const steps: ConversionStep[] = [];
  const g = gray.trim();
  if (!g) return { binary: '', steps: [] };

  const binArr: string[] = [g[0]]; // MSB is identical
  steps.push({
    stepNumber: 1,
    description: 'Keep the Most Significant Bit (MSB) identical.',
    math: `B[0] = G[0] = ${g[0]}`,
    subResult: binArr[0]
  });

  for (let i = 1; i < g.length; i++) {
    const prevBin = parseInt(binArr[i - 1], 10);
    const currGray = parseInt(g[i], 10);
    const bBit = prevBin ^ currGray;
    binArr.push(bBit.toString());
    steps.push({
      stepNumber: i + 1,
      description: `Compute B[${i}] = B[${i - 1}] ⊕ G[${i}] (XOR of previous binary bit with current Gray bit)`,
      math: `${prevBin} ⊕ ${currGray} = ${bBit}`,
      subResult: binArr.join('')
    });
  }

  return { binary: binArr.join(''), steps };
}

/**
 * Decimal to BCD conversion
 */
export function decimalToBCD(decStr: string): { bcd: string; steps: ConversionStep[] } {
  const steps: ConversionStep[] = [];
  const clean = decStr.replace(/[^\d]/g, '');
  const nibbles: string[] = [];

  for (let i = 0; i < clean.length; i++) {
    const digit = parseInt(clean[i], 10);
    const bin4 = digit.toString(2).padStart(4, '0');
    nibbles.push(bin4);
    steps.push({
      stepNumber: i + 1,
      description: `Convert decimal digit '${digit}' to 4-bit binary representation`,
      math: `${digit}₁₀ = ${bin4}₂`,
      subResult: nibbles.join(' ')
    });
  }

  return { bcd: nibbles.join(' '), steps };
}

/**
 * BCD to Decimal conversion
 */
export function bcdToDecimal(bcdStr: string): { decimal: string; steps: ConversionStep[] } {
  const steps: ConversionStep[] = [];
  const clean = bcdStr.replace(/\s+/g, '');
  let decimal = '';

  for (let i = 0; i < clean.length; i += 4) {
    const nibble = clean.substring(i, i + 4);
    const digitVal = parseInt(nibble, 2);
    decimal += digitVal.toString();
    steps.push({
      stepNumber: Math.floor(i / 4) + 1,
      description: `Evaluate 4-bit BCD nibble '${nibble}'`,
      math: `${nibble}₂ = (${nibble[0]}×8) + (${nibble[1]}×4) + (${nibble[2]}×2) + (${nibble[3]}×1) = ${digitVal}₁₀`,
      subResult: decimal
    });
  }

  return { decimal, steps };
}

/**
 * Convert any standard base (dec, bin, oct, hex) to another with full fractional support
 */
export function convertGeneralBase(
  input: string,
  fromBase: 'decimal' | 'binary' | 'octal' | 'hexadecimal',
  toBase: 'decimal' | 'binary' | 'octal' | 'hexadecimal'
): { output: string; steps: ConversionStep[] } {
  const steps: ConversionStep[] = [];
  const baseMap = { decimal: 10, binary: 2, octal: 8, hexadecimal: 16 };
  const radFrom = baseMap[fromBase];
  const radTo = baseMap[toBase];

  const trimmed = input.trim().toUpperCase();
  const parts = trimmed.split('.');
  const intPartStr = parts[0];
  const fracPartStr = parts[1] || '';

  // Step 1: Convert integer and fractional parts to base-10
  let intDec = 0;
  let fracDec = 0;

  // Int part to Dec
  if (fromBase !== 'decimal') {
    let intMathStr = '';
    for (let i = 0; i < intPartStr.length; i++) {
      const power = intPartStr.length - 1 - i;
      const digitVal = parseInt(intPartStr[i], radFrom);
      intDec += digitVal * Math.pow(radFrom, power);
      intMathStr += `${intPartStr[i]}×(${radFrom}^${power})` + (i < intPartStr.length - 1 ? ' + ' : '');
    }
    steps.push({
      stepNumber: 1,
      description: `Convert integer part (${intPartStr})_${radFrom} to Decimal using positional weights:`,
      math: `${intMathStr} = ${intDec}₁₀`,
      subResult: intDec.toString()
    });

    if (fracPartStr) {
      let fracMathStr = '';
      for (let i = 0; i < fracPartStr.length; i++) {
        const power = -(i + 1);
        const digitVal = parseInt(fracPartStr[i], radFrom);
        fracDec += digitVal * Math.pow(radFrom, power);
        fracMathStr += `${fracPartStr[i]}×(${radFrom}^${power})` + (i < fracPartStr.length - 1 ? ' + ' : '');
      }
      steps.push({
        stepNumber: 2,
        description: `Convert fractional part (0.${fracPartStr})_${radFrom} to Decimal:`,
        math: `${fracMathStr} = ${fracDec}₁₀`,
        subResult: (intDec + fracDec).toString()
      });
    }
  } else {
    intDec = parseInt(intPartStr, 10);
    fracDec = fracPartStr ? parseFloat('0.' + fracPartStr) : 0;
  }

  const totalDec = intDec + fracDec;

  if (toBase === 'decimal') {
    return { output: totalDec.toString(), steps };
  }

  // Step 2: Convert Decimal to Target Base
  // Integer part: Successive division
  let currentQuotient = intDec;
  const remList: string[] = [];
  const divSteps: string[] = [];

  if (currentQuotient === 0) {
    remList.push('0');
  } else {
    while (currentQuotient > 0) {
      const rem = currentQuotient % radTo;
      const nextQuotient = Math.floor(currentQuotient / radTo);
      const remChar = rem.toString(radTo).toUpperCase();
      divSteps.push(`${currentQuotient} ÷ ${radTo} = ${nextQuotient} R ${remChar}`);
      remList.push(remChar);
      currentQuotient = nextQuotient;
    }
  }

  const outInt = remList.reverse().join('');
  steps.push({
    stepNumber: steps.length + 1,
    description: `Convert decimal integer ${intDec} to base-${radTo} via successive division:`,
    math: divSteps.join('\n') + `\nReading remainders from bottom to top: (${outInt})_${radTo}`,
    subResult: outInt
  });

  // Fractional part: Successive multiplication (up to 6 digits)
  let outFrac = '';
  if (fracDec > 0) {
    let currFrac = fracDec;
    const multSteps: string[] = [];
    const maxDigits = 6;
    for (let i = 0; i < maxDigits && currFrac > 0; i++) {
      const prod = currFrac * radTo;
      const integerBit = Math.floor(prod);
      currFrac = prod - integerBit;
      const char = integerBit.toString(radTo).toUpperCase();
      multSteps.push(`${prod.toFixed(4)} -> Integer part: ${char}, new fraction: ${currFrac.toFixed(4)}`);
      outFrac += char;
    }
    steps.push({
      stepNumber: steps.length + 1,
      description: `Convert decimal fraction ${fracDec} to base-${radTo} via successive multiplication:`,
      math: multSteps.join('\n') + `\nReading integer digits from top to bottom: (0.${outFrac})_${radTo}`,
      subResult: `0.${outFrac}`
    });
  }

  const finalOutput = outFrac ? `${outInt}.${outFrac}` : outInt;
  return { output: finalOutput, steps };
}

/**
 * 1's and 2's complement calculation
 */
export function calculateComplements(binary: string, bitWidth: number = 8) {
  const clean = binary.trim().padStart(bitWidth, '0').slice(-bitWidth);
  let ones = '';
  for (let i = 0; i < clean.length; i++) {
    ones += clean[i] === '0' ? '1' : '0';
  }

  // 2's complement = 1's complement + 1
  let carry = 1;
  const twosArr: string[] = [];
  for (let i = ones.length - 1; i >= 0; i--) {
    const bit = parseInt(ones[i], 10);
    const sum = bit + carry;
    twosArr.unshift((sum % 2).toString());
    carry = Math.floor(sum / 2);
  }
  const twos = twosArr.join('');

  // Signed decimal value of 2's complement:
  // If MSB is 1, value is - (2^(n-1) - remaining)
  let signedVal = 0;
  if (twos[0] === '1') {
    // Negate 2s comp to find magnitude
    signedVal = -1 * (Math.pow(2, bitWidth) - parseInt(twos, 2));
  } else {
    signedVal = parseInt(twos, 2);
  }

  const steps = [
    `1. Format input to ${bitWidth}-bit width: ${clean}`,
    `2. Bitwise Inversion (1's Complement): Replace all 0s with 1s and 1s with 0s -> ${ones}`,
    `3. Add 1 to Least Significant Bit (LSB): ${ones} + 00...01 = ${twos}`,
    `4. Signed Interpretation: MSB is '${twos[0]}', decimal signed value is ${signedVal}₁₀.`
  ];

  return {
    original: clean,
    onesComp: ones,
    twosComp: twos,
    decimalVal: signedVal,
    steps
  };
}

/**
 * Master universal conversion runner
 */
export function performConversion(
  inputValue: string,
  sourceBase: NumberBase,
  targetBase: NumberBase,
  bitWidth: number = 8
): ConversionResult {
  const validation = validateNumberInput(inputValue, sourceBase);
  if (!validation.valid) {
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: '',
      isValid: false,
      errorMessage: validation.message,
      steps: []
    };
  }

  const trimmed = inputValue.trim().toUpperCase();

  // Handle identity conversion
  if (sourceBase === targetBase) {
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: trimmed,
      isValid: true,
      steps: [{ stepNumber: 1, description: 'Source and target base are identical.', math: trimmed }]
    };
  }

  let binaryIntermediate = '';
  let steps: ConversionStep[] = [];
  let outputValue = '';

  // 1. Binary to Gray
  if (sourceBase === 'binary' && targetBase === 'gray') {
    const res = binaryToGray(trimmed);
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: res.gray,
      isValid: true,
      steps: res.steps,
      binaryRepresentation: trimmed
    };
  }

  // 2. Gray to Binary
  if (sourceBase === 'gray' && targetBase === 'binary') {
    const res = grayToBinary(trimmed);
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: res.binary,
      isValid: true,
      steps: res.steps,
      binaryRepresentation: res.binary
    };
  }

  // 3. Decimal to BCD
  if (sourceBase === 'decimal' && targetBase === 'bcd') {
    const res = decimalToBCD(trimmed);
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: res.bcd,
      isValid: true,
      steps: res.steps
    };
  }

  // 4. BCD to Decimal
  if (sourceBase === 'bcd' && targetBase === 'decimal') {
    const res = bcdToDecimal(trimmed);
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: res.decimal,
      isValid: true,
      steps: res.steps
    };
  }

  // General base conversion via decimal/binary pipeline
  if (['decimal', 'binary', 'octal', 'hexadecimal'].includes(sourceBase) &&
      ['decimal', 'binary', 'octal', 'hexadecimal'].includes(targetBase)) {
    const res = convertGeneralBase(
      trimmed,
      sourceBase as any,
      targetBase as any
    );
    
    // Extract binary representation for 2's complement info
    let binRep = '';
    if (sourceBase === 'binary') {
      binRep = trimmed.split('.')[0];
    } else {
      const toBin = convertGeneralBase(trimmed, sourceBase as any, 'binary');
      binRep = toBin.output.split('.')[0];
    }

    const twos = calculateComplements(binRep, bitWidth);

    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: res.output,
      isValid: true,
      steps: res.steps,
      binaryRepresentation: binRep,
      twosComplement: twos
    };
  }

  // Complex multi-hop conversion (e.g. Hex to BCD or Octal to Gray)
  // First convert to intermediate
  if (sourceBase === 'bcd') {
    const decRes = bcdToDecimal(trimmed);
    const finalRes = convertGeneralBase(decRes.decimal, 'decimal', targetBase as any);
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: finalRes.output,
      isValid: true,
      steps: [...decRes.steps, ...finalRes.steps]
    };
  }

  if (targetBase === 'bcd') {
    const decRes = convertGeneralBase(trimmed, sourceBase as any, 'decimal');
    const bcdRes = decimalToBCD(decRes.output);
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: bcdRes.bcd,
      isValid: true,
      steps: [...decRes.steps, ...bcdRes.steps]
    };
  }

  if (targetBase === 'gray') {
    const binRes = convertGeneralBase(trimmed, sourceBase as any, 'binary');
    const grayRes = binaryToGray(binRes.output);
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: grayRes.gray,
      isValid: true,
      steps: [...binRes.steps, ...grayRes.steps]
    };
  }

  if (sourceBase === 'gray') {
    const binRes = grayToBinary(trimmed);
    const finalRes = convertGeneralBase(binRes.binary, 'binary', targetBase as any);
    return {
      sourceBase,
      targetBase,
      inputValue,
      outputValue: finalRes.output,
      isValid: true,
      steps: [...binRes.steps, ...finalRes.steps]
    };
  }

  return {
    sourceBase,
    targetBase,
    inputValue,
    outputValue: '',
    isValid: false,
    errorMessage: `Conversion from ${sourceBase} to ${targetBase} is not supported directly.`,
    steps: []
  };
}
