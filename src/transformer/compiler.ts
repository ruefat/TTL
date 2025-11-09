import { Expressions } from "./Nodes/ast.js";
import { Statement } from "./Nodes/ast.js";

/**
 * Compiles @Expressions & @Statements
 */
export class Compiler {

    /**
     * 
     * @param node
     * @returns a string 
     */
    public compileExpression(node: Expressions): string {
        switch (node.type) {
            case "Identifier":
                return node.name;
            case "NumericLiteral":
                return node.value.toString();
            case "BinaryExpression":
                return `${this.compileExpression(node.left)} ${node.operator} ${this.compileExpression(node.right)}`;
            case "CallExpression":
                const args = node.arguments.map(arg => this.compileExpression(arg)).join(", ");
                return `${this.compileExpression(node.callee)}(${args})`;
            default:
                throw new Error(`Unknown expression type: ${node}`);    
            }
    }

    /**
     * @returns indented text
     */
    private indent(text: string) {
        return text.split("\n").map(line => "    " + line).join("\n");
    }

    /**
     * 
     * @param node
     * @returns a string
     */
    public compileStatement(node: Statement): string {
        switch (node.type) {
            case "FunctionDeclaration":
                const params = node.params.join(", ");
                const body = node.body.map(statement => this.compileStatement(statement)).join("\n");
                return `function ${node.name}(${params})\n${this.indent(body)}\nend`;
            case "ExpressionStatement":
                return this.compileExpression(node.expression) /*+ ";"*/;
            case "PrintStatement":
                return `print(${this.compileExpression(node.value)})`;
            case "VariableDeclaration":
                return `local ${node.name} = ${this.compileExpression(node.value)}`;
            default:
                throw new Error(`Unknown statement type: ${node}`);
        }
    }
}