export enum TOKEN_TYPES {
    INVALID = 0,
    NUMBER = 1,
    OP = 2,
    START_EXP = 3,
    END_EXP = 4
};


export enum OP_TYPES {
    NO_OP = 0,
    ADD = 1,
    SUBTRACT = 1,
    MULTIPLY = 2,
    DIVIDE = 2,
    POWER = 3,
    NEW_EXPRESSION = 4
};


export class CharUtils {
    public static get NUL() { return '\u0000'; };
    public static get WHITESPACE() { return '\u0020'; };
    public static get OPEN_BRACE() { return '\u0028'; };
    public static get CLOSE_BRACE() { return '\u0029'; };
    public static get EXPONENT() { return '\u005E'; };
    public static get MULTIPLIER() { return '\u002A'; };
    public static get DIVIDER() { return '\u002F'; };
    public static get ADDER() { return '\u002B'; };
    public static get SUBTRACTER() { return '\u002D'; };

    public static get NUMBERS() {
        return [
            '\u0030', '\u0031', '\u0032', '\u0033',
            '\u0034', '\u0035', '\u0036',
            '\u0037', '\u0038', '\u0039'
        ];
    }

    public static IsNumber(token: string): boolean {
        return this.NUMBERS.indexOf(token) >= 0;
    }


    /*
     *  Probably a more efficient way to check if token
     *  is_number than method above -- still 
     *  needs to be performance tested, however
     */
    public static IsNumber2(token: string): boolean {
        const charCode: number = token.charCodeAt(0);
        return charCode >= 48 && charCode <= 57;
    }


    public static IsOp(token: string): boolean {
        return token === this.ADDER || token === this.SUBTRACTER
            || token === this.MULTIPLIER || token === this.DIVIDER
            || token === this.EXPONENT;
    }
}
