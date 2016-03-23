// Copyright 2016 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Flags: --expose-wasm

function WrapInAsmModule(func) {
  function MODULE_NAME(stdlib) {
    "use asm";
    var imul = stdlib.Math.imul;

    FUNC_BODY
    return {main: FUNC_NAME};
  }

  var source = MODULE_NAME.toString()
    .replace(/MODULE_NAME/g, func.name + "_module")
    .replace(/FUNC_BODY/g, func.toString())
    .replace(/FUNC_NAME/g, func.name);
  return eval("(" + source + ")");
}

function RunThreeWayTest(asmfunc, expect) {
  var asm_source = asmfunc.toString();
  var nonasm_source = asm_source.replace(new RegExp("use asm"), "");
  var stdlib = {Math: Math};

  var js_module = eval("(" + nonasm_source + ")")(stdlib);
  print("Testing " + asmfunc.name + " (js)...");
  expect(js_module);

  print("Testing " + asmfunc.name + " (asm.js)...");
  var asm_module = asmfunc(stdlib);
  expect(asm_module);

  print("Testing " + asmfunc.name + " (wasm)...");
  var wasm_module = Wasm.instantiateModuleFromAsm(asm_source, stdlib);
  expect(wasm_module);
}

const imul = Math.imul;

function i32_add(a, b) {
  a = a | 0;
  b = b | 0;
  return (a + b) | 0;
}

function i32_sub(a, b) {
  a = a | 0;
  b = b | 0;
  return (a - b) | 0;
}

function i32_mul(a, b) {
  a = a | 0;
  b = b | 0;
  return imul(a, b) | 0;
}

function i32_div(a, b) {
  a = a | 0;
  b = b | 0;
  return (a / b) | 0;
}

function i32_mod(a, b) {
  a = a | 0;
  b = b | 0;
  return (a % b) | 0;
}

function i32_and(a, b) {
  a = a | 0;
  b = b | 0;
  return (a & b) | 0;
}

function i32_or(a, b) {
  a = a | 0;
  b = b | 0;
  return (a | b) | 0;
}

function i32_xor(a, b) {
  a = a | 0;
  b = b | 0;
  return (a ^ b) | 0;
}

function i32_shl(a, b) {
  a = a | 0;
  b = b | 0;
  return (a << b) | 0;
}

function i32_shr(a, b) {
  a = a | 0;
  b = b | 0;
  return (a >> b) | 0;
}

function i32_sar(a, b) {
  a = a | 0;
  b = b | 0;
  return (a >>> b) | 0;
}

function i32_eq(a, b) {
  a = a | 0;
  b = b | 0;
  if ((a | 0) == (b | 0)) {
    return 1;
  }
  return 0;
}

function i32_ne(a, b) {
  a = a | 0;
  b = b | 0;
  if ((a | 0) < (b | 0)) {
    return 1;
  }
  return 0;
}

function i32_lt(a, b) {
  a = a | 0;
  b = b | 0;
  if ((a | 0) < (b | 0)) {
    return 1;
  }
  return 0;
}

function i32_lteq(a, b) {
  a = a | 0;
  b = b | 0;
  if ((a | 0) <= (b | 0)) {
    return 1;
  }
  return 0;
}

function i32_gt(a, b) {
  a = a | 0;
  b = b | 0;
  if ((a | 0) > (b | 0)) {
    return 1;
  }
  return 0;
}

function i32_gteq(a, b) {
  a = a | 0;
  b = b | 0;
  if ((a | 0) >= (b | 0)) {
    return 1;
  }
  return 0;
}

var inputs = [
  0, 1, 2, 3, 4,
  10, 20, 30, 31, 32, 33, 100, 2000,
  30000, 400000, 5000000,
  100000000, 2000000000,
  2147483646,
  2147483647,
  2147483648,
  2147483649,
  0x273a798e, 0x187937a3, 0xece3af83, 0x5495a16b, 0x0b668ecc, 0x11223344,
  0x0000009e, 0x00000043, 0x0000af73, 0x0000116b, 0x00658ecc, 0x002b3b4c,
  0x88776655, 0x70000000, 0x07200000, 0x7fffffff, 0x56123761, 0x7fffff00,
  0x761c4761, 0x80000000, 0x88888888, 0xa0000000, 0xdddddddd, 0xe0000000,
  0xeeeeeeee, 0xfffffffd, 0xf0000000, 0x007fffff, 0x003fffff, 0x001fffff,
  0x000fffff, 0x0007ffff, 0x0003ffff, 0x0001ffff, 0x0000ffff, 0x00007fff,
  0x00003fff, 0x00001fff, 0x00000fff, 0x000007ff, 0x000003ff, 0x000001ff,
  -1, -2, -3, -4,
  -10, -20, -30, -31, -32, -33, -100, -2000,
  -30000, -400000, -5000000,
  -100000000, -2000000000,
  -2147483646,
  -2147483647,
  -2147483648,
  -2147483649,
];

var funcs = [
  i32_add,
  i32_sub,
  i32_mul,
  // TODO(titzer): i32_mul requires Math.imul
  // TODO(titzer): i32_div divide by zero is incorrect
  // TODO(titzer): i32_mod by zero is incorrect
  i32_and,
  i32_or,
  i32_xor,
  // TODO(titzer): i32_shl on arm
  // TODO(titzer): i32_shr on arm
  // TODO(titzer): i32_sar on arm
  i32_eq,
  i32_ne,
  i32_lt,
  i32_lteq,
  i32_gt,
  i32_gteq,
  // TODO(titzer): i32_min
  // TODO(titzer): i32_max
  // TODO(titzer): i32_abs
];

(function () {
  for (func of funcs) {
    RunThreeWayTest(WrapInAsmModule(func), function (module) {
      for (a of inputs) {
        for (b of inputs) {
          var expected = func(a, b);
          assertEquals(expected, module.main(a, b));
        }
      }
    });
  }

})();
