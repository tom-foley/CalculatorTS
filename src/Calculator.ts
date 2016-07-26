import { TOKEN_TYPES, OP_TYPES, CharUtils } from './CharUtils';

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
        this.errorMessage = 'Error: ' + msg;
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
        //  Need to use type 'any' here for compiler
        //  in order to do efficient conversion of
        //  char to int -- TS compiler complains otherwise
        let num: any = 0;
        let token: any = this.expression[this.counter];
        const zero: any = '0';

        do {
            num *= 10;
            num += (token - zero);
            this.counter += 1;
            this.setTokenIndex();
            token = this.expression[this.counter];
        } while (CharUtils.IsNumber(token));

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

        if (op !== null) {
            opStr = 'Performing Op:\t' + lhs.result + ' ' + op + ' ' + rhs.result + ' = ';
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

        if (op !== null) {
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

        //  If we are at beginning of expression,
        //      check if first char is OPEN_BRACE
        //  else, we are in recursive call
        //      check if previous char is OPEN_BRACE
        if (this.counter === 0) {
            parenFlag = this.expression[this.counter] === CharUtils.OPEN_BRACE;
        } else if (this.counter > 1) {
            parenFlag = this.expression[this.counter - 1] === CharUtils.OPEN_BRACE;
        }

        //  DEBUG
        // if (parenFlag) {
        //     console.log('OPEN_BRACE');
        // }

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
                    } else if (this.expression[this.counter] !== CharUtils.CLOSE_BRACE) {
                        nextResult.setError('Missing closing parentheses');
                        return nextResult;
                    }

                    //  We've returned from recursive () expression,
                    //  mark parenFlag = false
                    parenFlag = false;

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

                        if (nextToken === CharUtils.OPEN_BRACE) {
                            //  We've returned from recursive () expression,
                            //  mark parenFlag = false
                            parenFlag = false;
                        }
                    }

                    this.performOp(result, nextResult, op);
                    break;
                case (TOKEN_TYPES.END_EXP):
                    //  DEBUG
                    //  console.log('CLOSE_BRACE');
                    return result;
                case (TOKEN_TYPES.OP):
                    opType = this.getOpType(token);

                    if (lastTokenType === TOKEN_TYPES.OP) {
                        consecutiveOps += 1;
                        if (consecutiveOps > 2) {
                            result.setError('Too many consecutive operations');
                            return result;
                        }

                        if (token === CharUtils.ADDER) {
                            negativeFlag = false;
                        } else if (token === CharUtils.SUBTRACTER) {
                            negativeFlag = true;
                        } else if (token !== CharUtils.OPEN_BRACE) {
                            result.setError('Illegal order of operations');
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

                        if (nextToken === CharUtils.OPEN_BRACE) {
                            //  We've returned from recursive () expression,
                            //  mark parenFlag = false
                            parenFlag = false;
                        }
                    }

                    this.performOp(result, nextResult, op);
                    break;
                default:
                    result.setError('Invalid token');
                    return result;
            }
        }

        if (parenFlag) {
            result.setError('Missing closing parentheses');
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
