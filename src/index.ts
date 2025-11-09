/*import { Parser } from "./transformer/parser.js";
import { tokenize } from "./transformer/Tokens/lexer.js";

/**
 * @Testing the Parser
 *
const code = `
let x = 1 + 2 * 3
print(x)

function add(a, b) {
    return a + b
}
`;

const tokens = tokenize(code);

const parser = new Parser(tokens);
const statement = [];

while (parser.peek()) {
    statement.push(parser.parseStatemt());
}

console.log(JSON.stringify(statement, null, 2));
*/

import { transpileToLuau } from "./transformer/Transpiler/Luau.js";

console.log(transpileToLuau(`
    function add(a, b) {
        print(a + b)
    }`
));