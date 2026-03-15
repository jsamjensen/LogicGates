const inputA = document.getElementById('inputA');
const inputB = document.getElementById('inputB');
const binaryA = document.getElementById('binaryA');
const binaryB = document.getElementById('binaryB');
const decimalResult = document.getElementById('decimalResult');
const binaryResult = document.getElementById('binaryResult');
const goBtn = document.getElementById('goBtn');
const resetBtn = document.getElementById('resetBtn');
const overviewScene = document.getElementById('overviewScene');
const insideScene = document.getElementById('insideScene');

const MAX = 15;
const WIDTH = 4;
const STEP_MS = 320;
const activeTimers = [];

function clampInput(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(MAX, Math.trunc(value)));
}

function toBinary(value, width = WIDTH) {
  return value.toString(2).padStart(width, '0');
}

function fullAdder(aBit, bBit, carryIn) {
  const xorAB = aBit ^ bBit;
  const sum = xorAB ^ carryIn;
  const carryOut = (aBit & bBit) | (xorAB & carryIn);
  return { sum, carryOut };
}

function setLiveBinary() {
  const a = clampInput(Number(inputA.value));
  const b = clampInput(Number(inputB.value));
  inputA.value = a;
  inputB.value = b;
  binaryA.textContent = toBinary(a);
  binaryB.textContent = toBinary(b);
}

function clearHighlights() {
  document.querySelectorAll('.wire.active, .gate.active').forEach((el) => {
    el.classList.remove('active');
  });
}

function makeStep(gate, wires) {
  return { gate, wires };
}

function buildSteps(a, b) {
  const aBits = toBinary(a).split('').reverse().map(Number);
  const bBits = toBinary(b).split('').reverse().map(Number);
  const steps = [
    makeStep(null, ['wire-a-bus', 'wire-b-bus', 'wire-carry-base'])
  ];

  let carry = 0;
  const sums = [];

  for (let i = 0; i < WIDTH; i += 1) {
    const { sum, carryOut } = fullAdder(aBits[i], bBits[i], carry);
    sums.push(sum);

    steps.push(
      makeStep(`gate-fa-${i}`, [
        `wire-a-${i}`,
        `wire-b-${i}`,
        `wire-cin-${i}`,
        `wire-sum-${i}`,
        `wire-cout-${i}`,
      ])
    );

    carry = carryOut;
  }

  steps.push(makeStep(null, ['wire-sum-bus', 'wire-final-carry']));

  const sumValue = parseInt(sums.reverse().join(''), 2) + (carry << WIDTH);
  return { steps, sumValue };
}

function markActive(ids) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  });
}

function rollTicker(el, value) {
  el.classList.add('roll');
  setTimeout(() => {
    el.textContent = value;
    el.classList.remove('roll');
  }, 130);
}

function runTimeline(steps, onDone) {
  clearHighlights();

  steps.forEach((step, index) => {
    const t = setTimeout(() => {
      if (step.gate) {
        const gate = document.getElementById(step.gate);
        if (gate) gate.classList.add('active');
      }
      markActive(step.wires);
    }, index * STEP_MS);

    activeTimers.push(t);
  });

  const done = setTimeout(onDone, steps.length * STEP_MS + 120);
  activeTimers.push(done);
}

function clearTimeline() {
  activeTimers.forEach(clearTimeout);
  activeTimers.length = 0;
}

function setScene(inside) {
  if (inside) {
    overviewScene.classList.remove('active');
    overviewScene.setAttribute('aria-hidden', 'true');
    insideScene.classList.add('active');
    insideScene.setAttribute('aria-hidden', 'false');
    return;
  }

  insideScene.classList.remove('active');
  insideScene.setAttribute('aria-hidden', 'true');
  overviewScene.classList.add('active');
  overviewScene.setAttribute('aria-hidden', 'false');
}

function runDemo() {
  const a = clampInput(Number(inputA.value));
  const b = clampInput(Number(inputB.value));
  const { steps, sumValue } = buildSteps(a, b);

  goBtn.disabled = true;
  inputA.disabled = true;
  inputB.disabled = true;
  setScene(true);
  runTimeline(steps, () => {
    rollTicker(decimalResult, String(sumValue));
    rollTicker(binaryResult, toBinary(sumValue, WIDTH + 1));
    goBtn.disabled = false;
    inputA.disabled = false;
    inputB.disabled = false;
  });
}

function resetDemo() {
  clearTimeline();
  clearHighlights();
  setScene(false);
  setLiveBinary();
  const a = clampInput(Number(inputA.value));
  const b = clampInput(Number(inputB.value));
  const sum = a + b;
  decimalResult.textContent = String(sum);
  binaryResult.textContent = toBinary(sum, WIDTH + 1);
  goBtn.disabled = false;
  inputA.disabled = false;
  inputB.disabled = false;
}

inputA.addEventListener('input', setLiveBinary);
inputB.addEventListener('input', setLiveBinary);
goBtn.addEventListener('click', runDemo);
resetBtn.addEventListener('click', resetDemo);

resetDemo();
