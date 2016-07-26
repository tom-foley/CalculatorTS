#   CalculatorTS
Calculator app ported from [my C ExpressionEvaluator](https://github.com/tom-foley/ExpressionEvaluator "ExpressionEvaluator") to TypeScript. The calculator parses and evaluates expressions in a single pass-through rather than parsing & tokenizing the expression and calculating after. Since this library is from a basic language like C, it uses only primitive operations and no native/built-in JavaScript functions such as string/math functions like substring() or Math.pow().

##  Compiling the Source
Cloning the repo will already have the vanilla JS files in the lib/ directory, however, you can compile the TypeScript files into plain JS yourself if you have node/gulp installed on your system. Then, in the root directory, simply run the `gulp` command.

## Usage
The calculator function which this library exposes to the client is called `calc()`, which takes a string containing the expression as the sole parameter, similar to JavaScript's `eval()`.
In order to use the `calc()` function, we first need to `require()` the library where we wish to use it:

```javascript
//  require() param is /path/to/compiled/typescript
var libCalc = require('../lib/calculator');
```

Once the library is included, we can initialize a new calculator as use `calc()` follows:

```javascript
var calculator = new libCalc.Calculator();

var calcResult = calculator.calc('(1 + 3 * (2 * (1 + 1) ^ 2) + 2) * 2 * 2 + 1').result;
console.log(calcResult);    //  outputs 109
```

The return type of `calc()` is an `EvalResult` (found in `src/Calculator.ts`) which is an object containing the following three properties:

```typescript
error: boolean;
errorMessage: string;
result: number;
```

In the example above, we passed in a valid expression (`(1 + 3 * (2 * (1 + 1) ^ 2) + 2) * 2 * 2 + 1`), so we directly assigned the `EvalResult.result` to `calcResult`. However, normally you should check to make sure no error occurred during the calculation by checking the `EvalResult.error` as follows:

```javascript
var calculator = new libCalc.Calculator();

//  returns 109
var calcResult = calculator.calc('(1 + 3 * (2 * (1 + 1) ^ 2) + 2) * 2 * 2 + 1');

if (calcResult.error) {
    console.log(calcResult.errorMessage);
} else {
    console.log(calcResult.result);    //  outputs 109
}
```

Examples of expressions which error are expressions with missing parentheses, illegal order of operations, too many consecutive operations, etc. For example:

```javascript
var calculator = new libCalc.Calculator();

//  returns 109
var calcResult = calculator.calc('(1 + 3 * (2 * (1 + 1) ^ 2) + 2 * 2 * 2 + 1');

if (calcResult.error) {                     //  true
    console.log(calcResult.errorMessage);   //  outputs 'Error: Missing closing parentheses'
} else {
    console.log(calcResult.result);
}

calcResult.reset();
calcResult = calculator.calc('(1 + 3 -* (2 * (1 + 1) ^ 2) + 2 * 2 * 2 + 1');
if (calcResult.error) {                     //  true
    console.log(calcResult.errorMessage);   //  outputs 'Error: Illegal order of operations' (-*)
} else {
    console.log(calcResult.result);
}

calcResult.reset();
calcResult = calculator.calc('(1 + 3 *-* (2 * (1 + 1) ^ 2) + 2 * 2 * 2 + 1');
if (calcResult.error) {                     //  true
    console.log(calcResult.errorMessage);   //  outputs 'Error: Too many consecutive operations' (*-*)
} else {
    console.log(calcResult.result);
}
```

More examples can be seen in `test/nodeTest.js` or can be run in the browser at `test/browserTest.js`. `Note: In order to run the console (Node) tests, you must have Node.js installed on your system. In order to build the browser test yourself, you must also have Node.js installed and install the node_modules(gulp, gulp-typescript, and webpack) locally. If you just want to run the browser tests, firing them up in a browser should be fine assuming you have downloaded the proper lib/*.js files. Please report any bugs in the issue tracker.`

##  Running the Tests
To run the Calculator tests, run the following from a Node.JS environment in the root directory.
```
node test/nodeTest.js
```

##  TODO
*   Add support for parsing of doubles/floats
*   Add support for negative (-) and doubles/float exponent values
