// import { Calculator, EvalResult } from '../src/calculator';
// class CalculatorTest {
//     successCount: number;
//     testCount: number;
//     calculator: Calculator.Calculator;
//     constructor() {
//         this.successCount = 0;
//         this.testCount = 0;
//     }
//     public test(expression: string, expected: number) {
//         this.testCount++;
//         console.log("Expression:\t" + expression);
//         let result: Calculator.EvalResult = this.calculator.calc(expression);
//         console.log("Expected:\t" + expected);
//         console.log("Result:\t\t\n" + result.result);
//         this.successCount += (expected === result.result) ? 1 : 0;
//     }
// }
// let ct = new CalculatorTest();
// ct.test("1 + 3 * 2 + 1", 8);
