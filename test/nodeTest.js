var Calculator = require('../lib/calculator');

var CalcTest = (function () {
    function CalcTest() {
        this.ANSI_COLOR_RED = "\x1b[31m";
        this.ANSI_COLOR_GREEN = "\x1b[32m";
        this.ANSI_COLOR_RESET = "\x1b[0m";
        this.testCount = 0;
        this.successCount = 0;
        this.calculator = new Calculator.Calculator();
    }

    CalcTest.prototype.test = function (expression, expected) {
        this.testCount++;
        console.log("Expression:\t" + expression);
        var result = this.calculator.calc(expression);

        console.log("Expected:\t" + expected);
        console.log("Result:\t\t" + result.result);

        if (result.error) {
            console.log("Eval Result Error:\t" + result.errorMessage);
        }

        if (expected === result.result) {
            this.successCount++;
            console.log(this.ANSI_COLOR_GREEN + "***** Success *****" + this.ANSI_COLOR_RESET + "\n");
        } else {

            console.log(this.ANSI_COLOR_RED + "***** Error *****" + this.ANSI_COLOR_RESET + "\n");
        }
    }

    return CalcTest;
} ());

var ct = new CalcTest();

//  8
ct.test("1 + 3 * 2 + 1", 8);

//  109
ct.test("(1 + 3 * (2 * (1 + 1) ^ 2) + 2) * 2 * 2 + 1", 109);

//  -2
ct.test("1 * - 2", -2);

//  -1
ct.test("2 / - 2", -1);

//  -1
ct.test("2 / (- 2)", -1);

//  3
ct.test("1 - - 2", 3);

//  54
ct.test("2 * (2 + 1) ^ 3", 54);

//  26
ct.test("3 * (2 * (1 + 1) ^ 2) + 2", 26);

//  28
ct.test("1 + 3 ^ (2 + 1)", 28);

//  85
ct.test("(1 + 3 * (2 * (2 + 1)) + 2) * 2 * 2 + 1", 85);

//  16
ct.test("(1 + (3 + 1) + 2) + 1 * 2 + 1 * 2 + (1 + 2 * 2)", 16);

//  null --> Error due to illegal order of operations
ct.test("2 */ 2", null);

//  null --> Error due to missing closing parentheses
ct.test("(1 + 3 * (2 * (1 + 1 ^ 2) + 2) * 2 * 2 + 1", null);

//  null --> Error due to missing closing parentheses
ct.test("2 / (- 2", null);

console.log("Tests Passed:\t", ct.successCount + "/" + ct.testCount);