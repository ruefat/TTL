/**@Expressions */
export type Expressions =
    | { type: "NumericLiteral", value: number }
    | { type: "BinaryExpression"; operator: string | any; left: Expressions; right: Expressions }
    | { type: "Identifier"; name: string }
    | { type: "CallExpression"; callee: Expressions; arguments: Expressions[] };

/**@Statements */
export type Statement =
    | { type: "VariableDeclaration"; name: string; value: Expressions }
    | { type: "PrintStatement"; value: Expressions }
    | { type: "ExpressionStatement"; expression: Expressions }
    | { type: "FunctionDeclaration"; name: string; params: string[]; body: Statement[] };