"use strict";
var TOKEN_TYPES;
(function (TOKEN_TYPES) {
    TOKEN_TYPES[TOKEN_TYPES["INVALID"] = 0] = "INVALID";
    TOKEN_TYPES[TOKEN_TYPES["NUMBER"] = 1] = "NUMBER";
    TOKEN_TYPES[TOKEN_TYPES["OP"] = 2] = "OP";
    TOKEN_TYPES[TOKEN_TYPES["START_EXP"] = 3] = "START_EXP";
    TOKEN_TYPES[TOKEN_TYPES["END_EXP"] = 4] = "END_EXP";
})(TOKEN_TYPES || (TOKEN_TYPES = {}));
;
var OP_TYPES;
(function (OP_TYPES) {
    OP_TYPES[OP_TYPES["NO_OP"] = 0] = "NO_OP";
    OP_TYPES[OP_TYPES["ADD"] = 1] = "ADD";
    OP_TYPES[OP_TYPES["SUBTRACT"] = 1] = "SUBTRACT";
    OP_TYPES[OP_TYPES["MULTIPLY"] = 2] = "MULTIPLY";
    OP_TYPES[OP_TYPES["DIVIDE"] = 2] = "DIVIDE";
    OP_TYPES[OP_TYPES["POWER"] = 3] = "POWER";
    OP_TYPES[OP_TYPES["NEW_EXPRESSION"] = 4] = "NEW_EXPRESSION";
})(OP_TYPES || (OP_TYPES = {}));
;
var CharUtils = (function () {
    function CharUtils() {
    }
    Object.defineProperty(CharUtils, "NUL", {
        get: function () { return '\u0000'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "WHITESPACE", {
        get: function () { return '\u0020'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "OPEN_BRACE", {
        get: function () { return '\u0028'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "CLOSE_BRACE", {
        get: function () { return '\u0029'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "EXPONENT", {
        get: function () { return '\u005E'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "MULTIPLIER", {
        get: function () { return '\u002A'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "DIVIDER", {
        get: function () { return '\u002F'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "ADDER", {
        get: function () { return '\u002B'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "SUBTRACTER", {
        get: function () { return '\u002D'; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(CharUtils, "NUMBERS", {
        get: function () {
            return [
                '\u0030', '\u0031', '\u0032', '\u0033',
                '\u0034', '\u0035', '\u0036',
                '\u0037', '\u0038', '\u0039'
            ];
        },
        enumerable: true,
        configurable: true
    });
    CharUtils.IsNumber = function (token) {
        return this.NUMBERS.indexOf(token) >= 0;
    };
    CharUtils.IsOp = function (token) {
        return token === this.ADDER || token === this.SUBTRACTER
            || token === this.MULTIPLIER || token === this.DIVIDER
            || token === this.EXPONENT;
    };
    return CharUtils;
}());
var EvalResult = (function () {
    function EvalResult() {
        this.error = false;
        this.errorMessage = null;
        this.result = 0;
    }
    EvalResult.prototype.setError = function (msg) {
        this.error = true;
        this.errorMessage = msg;
        this.result = null;
    };
    EvalResult.prototype.reset = function () {
        this.error = false;
        this.errorMessage = null;
        this.result = 0;
    };
    return EvalResult;
}());
exports.EvalResult = EvalResult;
var Calculator = (function () {
    function Calculator() {
        this.result = new EvalResult();
    }
    Calculator.prototype.orderOperationsGreater = function (curOp, nextOp) {
        return nextOp > curOp;
    };
    Calculator.prototype.getTokenIndex = function (counter) {
        while (this.expression[counter] === CharUtils.WHITESPACE) {
            counter += 1;
        }
        return counter;
    };
    Calculator.prototype.setTokenIndex = function () {
        while (this.expression[this.counter] === CharUtils.WHITESPACE) {
            this.counter += 1;
        }
    };
    Calculator.prototype.power = function (num, exp) {
        if (exp > 1) {
            return num * this.power(num, exp - 1);
        }
        return num;
    };
    Calculator.prototype.getNextNumber = function () {
        var num = 0;
        var token = this.expression[this.counter];
        var zero = '0';
        do {
            num *= 10;
            num += (token - zero);
            this.counter += 1;
            this.setTokenIndex();
            token = this.expression[this.counter];
        } while (CharUtils.IsNumber(token));
        return num;
    };
    Calculator.prototype.getTokenType = function (token) {
        if (token === CharUtils.OPEN_BRACE) {
            return TOKEN_TYPES.START_EXP;
        }
        else if (token === CharUtils.CLOSE_BRACE) {
            return TOKEN_TYPES.END_EXP;
        }
        else if (CharUtils.IsOp(token)) {
            return TOKEN_TYPES.OP;
        }
        else if (CharUtils.IsNumber(token)) {
            return TOKEN_TYPES.NUMBER;
        }
        else {
            return TOKEN_TYPES.INVALID;
        }
    };
    Calculator.prototype.getOpType = function (token) {
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
    };
    Calculator.prototype.performOp = function (lhs, rhs, op) {
        var opStr;
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
    };
    Calculator.prototype.parse = function (result) {
        var op = null, token = null, nextToken = null;
        var parenFlag = false, negativeFlag = false;
        var nextCounter = 0, consecutiveOps = 0;
        var nextResult = new EvalResult();
        var opType = null;
        var tokenType = null, lastTokenType = null;
        //  If we are at beginning of expression,
        //      check if first char is OPEN_BRACE
        //  else, we are in recursive call
        //      check if previos char is OPEN_BRACE
        if (this.counter === 0 && this.expression[this.counter] === CharUtils.OPEN_BRACE) {
            console.log('OPEN_BRACE');
            parenFlag = this.expression[this.counter] === CharUtils.OPEN_BRACE;
        }
        else if (this.counter > 1 && this.expression[this.counter - 1] === CharUtils.OPEN_BRACE) {
            console.log('OPEN_BRACE');
            parenFlag = this.expression[this.counter - 1] === CharUtils.OPEN_BRACE;
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
                    }
                    else if (this.expression[this.counter] !== CharUtils.CLOSE_BRACE) {
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
                    }
                    this.performOp(result, nextResult, op);
                    break;
                case (TOKEN_TYPES.END_EXP):
                    console.log('CLOSE_BRACE');
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
                        }
                        else if (token === CharUtils.SUBTRACTER) {
                            negativeFlag = true;
                        }
                        else if (token !== CharUtils.OPEN_BRACE) {
                            result.setError('Illegal order of operations');
                            return result;
                        }
                    }
                    else {
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
                    if (nextToken === CharUtils.OPEN_BRACE) {
                        //  We've returned from recursive () expression,
                        //  mark parenFlag = false
                        parenFlag = false;
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
    };
    Calculator.prototype.calc = function (expression) {
        this.counter = 0;
        this.expression = expression;
        this.expressionLen = expression.length;
        this.result = new EvalResult();
        return this.parse(this.result);
    };
    return Calculator;
}());
exports.Calculator = Calculator;
