export module Calculator {
    enum TOKEN_TYPES {
        INVALID = 0,
        NUMBER = 1,
        OP = 2,
        START_EXP = 3,
        END_EXP = 4,
    };

    enum OP_TYPES {
        NO_OP = 0,
        ADD = 1,
        SUBTRACT = 1,
        MULTIPLY = 2,
        DIVIDE = 2,
        POWER = 3,
        NEW_EXPRESSION = 4,
    };


    class CharUtils {
        public static get NUL() { return "\u0000"; };
        public static get WHITESPACE() { return "\u0020"; };
        public static get OPEN_BRACE() { return "\u0028"; };
        public static get CLOSE_BRACE() { return "\u0029"; };
        public static get EXPONENT() { return "\u005E"; };
        public static get MULTIPLIER() { return "\u002A"; };
        public static get DIVIDER() { return "\u002F"; };
        public static get ADDER() { return "\u002B"; };
        public static get SUBTRACTER() { return "\u002D"; };

        public static get NUMBERS() {
            return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        }

        public static IsNumber(token: string): boolean {
            return this.NUMBERS.indexOf(token) >= 0;
        }


        public static IsOp(token: string): boolean {
            return token == this.ADDER || token == this.SUBTRACTER
                || token == this.MULTIPLIER || token == this.DIVIDER
                || token == this.EXPONENT;
        }
    }


    export class EvalResult {
        error: boolean;
        errorMessage: string;
        result: number;

        constructor() {
            this.error = false;
            this.errorMessage = null;
            this.result = 0;
        }


        public setError(msg: string): void {
            this.error = true;
            this.errorMessage = msg;
            this.result = null;
        }


        public reset(): void {
            this.error = false;
            this.errorMessage = null;
            this.result = 0;
        }
    }


    export class Calculator {
        static OP_TYPES;
        static TOKEN_TYPES;

        counter: number;
        expression: string;
        expressionLen: number;
        result: EvalResult;

        constructor() {
            this.result = new EvalResult();
        }


        private orderOperationsGreater(curOp: OP_TYPES, nextOp: OP_TYPES): boolean {
            return nextOp > curOp;
        }


        private getTokenIndex(counter: number) {
            while (this.expression[counter] === CharUtils.WHITESPACE) {
                counter += 1;
            }

            return counter;
        }


        private setTokenIndex() {
            while (this.expression[this.counter] === CharUtils.WHITESPACE) {
                this.counter += 1;
            }
        }


        private power(num: number, exp: number): number {
            if (exp > 1) {
                return num * this.power(num, exp - 1);
            }

            return num;
        }


        private getNextNumber(): number {
            let num: any = 0;
            let token: any = this.expression[this.counter];
            const zero: any = "0";

            do {
                num *= 10;
                num += (token - zero);
                this.counter += 1;
                this.setTokenIndex();
                token = this.expression[this.counter];
            } while (CharUtils.IsNumber(token))

            return num;
        }


        private getTokenType(token: string): TOKEN_TYPES {
            if (token === CharUtils.OPEN_BRACE) {
                return TOKEN_TYPES.START_EXP;
            } else if (token === CharUtils.CLOSE_BRACE) {
                return TOKEN_TYPES.END_EXP;
            } else if (CharUtils.IsOp(token)) {
                return TOKEN_TYPES.OP;
            } else if (CharUtils.IsNumber(token)) {
                return TOKEN_TYPES.NUMBER;
            } else {
                return TOKEN_TYPES.INVALID;
            }
        }


        private getOpType(token: string): OP_TYPES {
            switch (token) {
                case CharUtils.ADDER:
                    return OP_TYPES.ADD;
                case CharUtils.SUBTRACTER:
                    return OP_TYPES.SUBTRACT;
                case CharUtils.MULTIPLIER:
                    return OP_TYPES.MULTIPLY;
                case CharUtils.DIVIDER:
                    return OP_TYPES.DIVIDE;
                case CharUtils.EXPONENT:
                    return OP_TYPES.POWER;
                case CharUtils.OPEN_BRACE:
                    return OP_TYPES.NEW_EXPRESSION;
                default:
                    return OP_TYPES.NO_OP;
            }
        }


        private performOp(lhs: EvalResult, rhs: EvalResult, op: string): void {
            let opStr: string;
            if (op != null) {
                opStr = "Performing Op:\t" + lhs.result + " " + op + " " + rhs.result + " = ";
            }

            switch (op) {
                case CharUtils.ADDER:
                    lhs.result += rhs.result;
                    break;
                case CharUtils.SUBTRACTER:
                    lhs.result -= rhs.result;
                    break;
                case CharUtils.MULTIPLIER:
                    lhs.result *= rhs.result;
                    break;
                case CharUtils.DIVIDER:
                    lhs.result /= rhs.result;
                    break;
                case CharUtils.EXPONENT:
                    lhs.result = this.power(lhs.result, rhs.result);
                    break;
                default:
                    lhs.result = rhs.result;
                    break;
            }

            if (op != null) {
                opStr += lhs.result;
                console.log(opStr);
            }
        }


        private parse(result: EvalResult): EvalResult {
            let op: string = null,
                token: string = null,
                nextToken: string = null;

            let parenFlag: boolean = false,
                negativeFlag: boolean = false;

            let nextCounter: number = 0,
                consecutiveOps: number = 0;

            let nextResult: EvalResult = new EvalResult();

            let opType: OP_TYPES = null;
            let tokenType: TOKEN_TYPES = null,
                lastTokenType: TOKEN_TYPES = null;

            if (this.counter === 0 && this.expression[this.counter] === CharUtils.OPEN_BRACE) {
                console.log("OPEN_BRACE");
                //parenFlag = this.expression[this.counter] === CharUtils.OPEN_BRACE;
            } else if (this.counter > 1 && this.expression[this.counter - 1] === CharUtils.OPEN_BRACE) {
                console.log("OPEN_BRACE");
                //parenFlag = this.expression[this.counter - 1] === CharUtils.OPEN_BRACE;
            }

            while (this.counter < this.expressionLen) {
                this.setTokenIndex();
                lastTokenType = tokenType;
                token = this.expression[this.counter];
                tokenType = this.getTokenType(token);

                switch (tokenType) {
                    case (TOKEN_TYPES.START_EXP):
                        //  Move past OPEN_BRACE
                        this.counter += 1;

                        //  Get result of () expression
                        nextResult.reset();
                        nextResult = this.parse(nextResult);
                        if (nextResult.error) {
                            return nextResult;
                        } else {
                            console.log("CLOSE_BRACE");
                        }

                        //  Process next token
                        this.counter += 1;
                        nextCounter = this.getTokenIndex(this.counter);
                        nextToken = this.expression[nextCounter];

                        //  Check order ops
                        if (this.orderOperationsGreater(opType, this.getOpType(nextToken))) {
                            nextResult = this.parse(nextResult);
                            if (nextResult.error) {
                                return nextResult;
                            }
                        }

                        this.performOp(result, nextResult, op);
                        break;
                    case (TOKEN_TYPES.END_EXP):
                        return result;
                    case (TOKEN_TYPES.OP):
                        opType = this.getOpType(token);

                        if (lastTokenType === TOKEN_TYPES.OP) {
                            consecutiveOps += 1;
                            if (consecutiveOps > 2) {
                                result.setError("Too many consecutive operations");
                                return result;
                            }

                            if (token === CharUtils.ADDER) {
                                negativeFlag = false;
                            } else if (token === CharUtils.SUBTRACTER) {
                                negativeFlag = true;
                            } else if (token != CharUtils.OPEN_BRACE) {
                                result.setError("Illegal order of operations");
                                return result;
                            }
                        } else {
                            consecutiveOps = 1;
                            op = token;
                        }

                        this.counter += 1;
                        break;
                    case (TOKEN_TYPES.NUMBER):
                        //  Process current number
                        nextResult.reset();
                        nextResult.result = this.getNextNumber();
                        if (negativeFlag) {
                            nextResult.result *= -1;
                        }

                        //  Process next token
                        nextCounter = this.getTokenIndex(this.counter);
                        nextToken = this.expression[nextCounter];

                        //  Check order ops
                        if (this.orderOperationsGreater(opType, this.getOpType(nextToken))) {
                            nextResult = this.parse(nextResult);
                            if (nextResult.error) {
                                return nextResult;
                            }
                        }

                        this.performOp(result, nextResult, op);
                        break;
                    default:
                        if (parenFlag) {
                            nextResult.setError("Missing closing parentheses");
                        }
                        return nextResult;
                }
            }

            if (parenFlag) {
                result.setError("Missing closing parentheses");
            }
            return result;
        }


        public calc(expression: string): EvalResult {
            this.counter = 0;
            this.expression = expression;
            this.expressionLen = expression.length;
            this.result = new EvalResult();
            return this.parse(this.result);
        }
    }
}


//  Need to move to external file
class CalculatorTest {
    successCount: number;
    testCount: number;
    calculator: Calculator.Calculator;

    constructor() {
        this.successCount = 0;
        this.testCount = 0;
        this.calculator = new Calculator.Calculator();
    }


    public test(expression: string, expected: number) {
        this.testCount++;

        console.log("Expression:\t" + expression);
        let result: Calculator.EvalResult = this.calculator.calc(expression);

        if (result.error) {
            console.log('Error:\t' + result.errorMessage + "\n");
        } else {
            console.log("Expected:\t" + expected);
            console.log("Result:\t\t" + result.result + "\n");
        }


        this.successCount += (expected === result.result) ? 1 : 0;
    }
}

let ct = new CalculatorTest();
ct.test("1 + 3 * 2 + 1", 8);
ct.test("(1 + 3 * (2 * (2 + 1)) + 2) * 2 * 2 + 1", 85);
ct.test("(1 + 3 * (2 * (1 + 1) ^ 2) + 2) * 2 * 2 + 1", 109);
ct.test("1 * - 2", -2);
ct.test("(1 + 3 * (2 * (1 + 1 ^ 2) + 2) * 2 * 2 + 1", null);