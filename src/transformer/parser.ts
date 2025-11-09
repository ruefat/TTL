import { Token } from "./Tokens/lexer.js";
import { Statement, Expressions } from "./Nodes/ast.js";

export class Parser {
    /**
     * @Position is where the Parser is currently at and what it is parsing
     * @Tokens are the tokens
     */
    private POSITION = 0;
    private TOKENS: Token[];

    /**
     * Constructor for the Parser Class
     * @param tokens 
     */
    constructor(tokens: Token[]) {
        this.TOKENS = tokens;
    }

    /**
     * 
     * @returns the current position
     */
    public peek() {
        return this.TOKENS[this.POSITION];
    }

    public consume() {
        return this.TOKENS[this.POSITION++]
    }

    /**
     * Parses: 
     * @Variables
     * @Numbers
     * @Parentheses
     */
    public parsePrimary(): Expressions {
        const token = this.consume();
        if (!token) throw new Error("Unexpected end of input");

        if (token.type === "Number") {
            return { type: "NumericLiteral", value: Number(token.value) };
        }

        if (token.type === "Identifier") {
            return { type: "Identifier", name: token.value.toString() };
        }

        if (token.type === "Symbol" && token.value === '(') {
            const expression = this.parseExpression();
            const close = this.consume();
            if (!close || close.type !== "Symbol" || close.value !== ')') {
                throw new Error("Expected ')'");
            }
            return expression;
        }
        throw new Error("Unexpected token in primary expression: " + JSON.stringify(token));
    }

    /**
     * Parses:
     * @Multiply
     * @Divide
     */
    public parseMultiplicative(): Expressions {
        let left = this.parsePrimary();

        while (this.peek()?.type === 'Symbol' && (this.peek()!.value === "*" || this.peek()?.value === '/')) {
            const operator = this.consume()?.value;
            const right = this.parsePrimary();
            left = { type: "BinaryExpression", operator, left, right };
        }
        return left;
    }

    /**
     * Parses:
     * @Plus
     * @Minus
     */
    public parseExpression(): Expressions {
        let left = this.parseMultiplicative();

        while (this.peek()?.type === 'Symbol' && (this.peek()!.value === "+" || this.peek()!.value === "-")) {
            const operator = this.consume()!.value;
            const right = this.parseMultiplicative();
            left = { type: "BinaryExpression", operator, left, right };
        }

        return left;
    }

    /**
     * Parses:
     * @functions
     * @statements
     */
    public parseStatemt(): Statement {
        const statement = this.peek();
        if (!statement) throw new Error("Unexpected end of input");

        if (statement.type === "Keyword" && statement.value === "function") {
            this.consume();

            /**
             * @T stands for Token, e.g. nameT = nameToken
             */
            const nameT = this.consume();
            if (!nameT || nameT.type !== 'Identifier') throw new Error("Expected function names");
            const name = nameT.value.toString();

            const open = this.consume();
            if (!open || open.type !== "Symbol" || open.value !== "(") throw new Error("Expected '(' after function name");

            const params: string[] = [];
            while (this.peek() && this.peek()!.type !== "Symbol" && this.peek()!.value !== ")") {
                const paramT = this.consume();
                if (!paramT || paramT.type !== "Identifier") throw new Error("Expected parameter name");
                params.push(paramT.value.toString());

                if (this.peek()?.type === "Symbol" && this.peek()?.value === ',') this.consume();
            }

            const close = this.consume();
            if (!close || close.type !== "Symbol" || close.value !== ")") throw new Error("Expected ')' after parameters");

            const openBody = this.consume();
            if (!openBody || openBody.type !== "Symbol" || openBody.value !== "{") throw new Error("Expected '{' to start function body");

            const body: Statement[] = [];
            while (this.peek() && !(this.peek()!.type === "Symbol" && this.peek()!.value === "}")) {
                body.push(this.parseStatemt());
            }

            const closeBody = this.consume();
            if (!closeBody || closeBody.type !== "Symbol" || closeBody.value !== "}") throw new Error("Expected '}' to close function body");

            return { type: "FunctionDeclaration", name, params, body };
        }

        if (statement.type === "Keyword" && statement.value === "print") {
            this.consume(); 

            const open = this.consume();
            if (!open || open.type !== "Symbol" || open.value !== "(") 
                throw new Error("Expected '(' after 'print'");

            const expr = this.parseExpression();

            const close = this.consume();
            if (!close || close.type !== "Symbol" || close.value !== ")") 
                throw new Error("Expected ')' after print expression");

            return { type: "PrintStatement", value: expr };
        }

        if (statement.type === "Keyword" && (statement.value === "const" || statement.value === "let" || statement.value === "var")) {
            this.consume();

            const nameT = this.consume();
            if (!nameT || nameT.type !== "Identifier") throw new Error("Expected variable name after decleration keyword");
            const name = nameT.value.toString();

            const equals = this.consume();
            if (!equals || equals.type !== "Symbol" || equals.value !== "=") throw new Error("Expected '=' after variable name");

            const value = this.parseExpression();

            return { type: "VariableDeclaration", name, value };
        }

        if (statement.type === "Identifier" || statement.type === 'Number' || (statement.type === 'Symbol' && statement.value === "(")) {
            const expression = this.parseExpression();
            return { type: "ExpressionStatement", expression };
        }

        throw new Error("Unexpected token: " + JSON.stringify(this.peek()));
    }
}