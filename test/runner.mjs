import { readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function colorize(text, color) {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

const state = {
  suites: [],
  currentSuite: null,
};

export function describe(name, fn) {
  const suite = { name, tests: [] };
  const prev = state.currentSuite;
  state.currentSuite = suite;
  fn();
  state.currentSuite = prev;
  state.suites.push(suite);
}

export function it(name, fn) {
  if (state.currentSuite) {
    state.currentSuite.tests.push({ name, fn });
  } else {
    state.suites.push({ name: '(standalone)', tests: [{ name, fn }] });
  }
}

export function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(
          `expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`
        );
      }
    },
    toEqual(expected) {
      const a = JSON.stringify(actual);
      const b = JSON.stringify(expected);
      if (a !== b) {
        throw new Error(`expected ${a} to equal ${b}`);
      }
    },
    toBeTruthy() {
      if (!actual) {
        throw new Error(`expected ${JSON.stringify(actual)} to be truthy`);
      }
    },
    toBeFalsy() {
      if (actual) {
        throw new Error(`expected ${JSON.stringify(actual)} to be falsy`);
      }
    },
    toBeDefined() {
      if (typeof actual === 'undefined') {
        throw new Error('expected value to be defined');
      }
    },
    toBeUndefined() {
      if (typeof actual !== 'undefined') {
        throw new Error(`expected ${JSON.stringify(actual)} to be undefined`);
      }
    },
    toBeNull() {
      if (actual !== null) {
        throw new Error(`expected ${JSON.stringify(actual)} to be null`);
      }
    },
    toBeGreaterThan(expected) {
      if (!(actual > expected)) {
        throw new Error(`expected ${actual} to be greater than ${expected}`);
      }
    },
    toBeLessThan(expected) {
      if (!(actual < expected)) {
        throw new Error(`expected ${actual} to be less than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual(expected) {
      if (!(actual >= expected)) {
        throw new Error(`expected ${actual} to be >= ${expected}`);
      }
    },
    toBeLessThanOrEqual(expected) {
      if (!(actual <= expected)) {
        throw new Error(`expected ${actual} to be <= ${expected}`);
      }
    },
    toBeInstanceOf(cls) {
      if (!(actual instanceof cls)) {
        throw new Error(`expected value to be instance of ${cls.name || cls}`);
      }
    },
    toContain(item) {
      if (!Array.isArray(actual) && typeof actual !== 'string') {
        throw new Error('toContain requires array or string');
      }
      if (!actual.includes(item)) {
        throw new Error(
          `expected ${JSON.stringify(actual)} to contain ${JSON.stringify(item)}`
        );
      }
    },
    toHaveLength(len) {
      if (actual.length !== len) {
        throw new Error(`expected length ${actual.length} to be ${len}`);
      }
    },
    toBeType(type) {
      if (typeof actual !== type) {
        throw new Error(`expected type ${typeof actual} to be ${type}`);
      }
    },
    toHaveProperty(prop) {
      if (!Object.prototype.hasOwnProperty.call(actual, prop)) {
        throw new Error(`expected object to have property ${prop}`);
      }
    },
    toMatch(regex) {
      if (!regex.test(actual)) {
        throw new Error(`expected ${JSON.stringify(actual)} to match ${regex}`);
      }
    },
  };
}

export async function run() {
  const testDir = __dirname;
  const files = readdirSync(testDir)
    .filter((f) => f.endsWith('.test.mjs'))
    .sort();

  let total = 0;
  let passed = 0;
  let failed = 0;
  const errors = [];

  console.log(colorize('\n========== 运行测试 ==========', 'bright'));

  for (const file of files) {
    console.log(colorize(`\n📄 ${file}`, 'magenta'));
    const filePath = join(testDir, file);
    const prevCount = state.suites.length;
    await import(filePath);
    const newSuites = state.suites.slice(prevCount);

    for (const suite of newSuites) {
      if (suite.name !== '(standalone)') {
        console.log(colorize(`\n  ${suite.name}`, 'cyan'));
      }

      for (const test of suite.tests) {
        total++;
        try {
          await test.fn();
          passed++;
          console.log(colorize(`    ✅ ${test.name}`, 'green'));
        } catch (err) {
          failed++;
          errors.push({ suite: suite.name, test: test.name, error: err });
          console.log(colorize(`    ❌ ${test.name}`, 'red'));
          const msg = err.message || String(err);
          msg.split('\n').forEach((line) => {
            console.log(colorize(`       ${line}`, 'red'));
          });
        }
      }
    }
  }

  console.log(colorize('\n========== 测试结果 ==========', 'bright'));
  console.log(`总用例: ${total}`);
  console.log(colorize(`通过:   ${passed}`, 'green'));
  if (failed > 0) {
    console.log(colorize(`失败:   ${failed}`, 'red'));
  } else {
    console.log(colorize(`失败:   ${failed}`, 'green'));
  }

  if (errors.length > 0) {
    console.log(colorize('\n失败详情：', 'red'));
    for (const e of errors) {
      console.log(`  • [${e.suite}] ${e.test}`);
      console.log(`    ${e.error.message || String(e.error)}`);
    }
  }

  console.log();
  process.exit(failed > 0 ? 1 : 0);
}
