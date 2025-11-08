export type Token =
    | { type: "Number"; value: number }
    | { type: "Symbol"; value: string }
    | { type: "Identifier"; value: string }
    | { type: "Keyword"; value: "let" | "const" | "print" | "function" | "var" };

export function tokenize(input: string): Token[] {
    const tokens = new Array<Token>();
    let i = 0;

    while (i < input.length) {
        const char = input[i]!;

        if (/\s/.test(char)) { i++; continue };

        if (/\d/.test(char)) {
            let num = char;
            i++;
            while (i < input.length && /\d/.test(input[i]!)) num += input[i++];
            tokens.push({ type: "Number", value: Number(num) });
            continue;
        }

        if (/[a-zA-Z]/.test(char)) {
            let ident = char;
            i++;
        while (i < input.length && /[a-zA-Z0-9_]/.test(input[i]!)) {
            ident += input[i++];
        }

        if (["let", "print", "function"].includes(ident)) {
            tokens.push({ type: "Keyword", value: ident as "let" | "print" | "function" | "var" });
        } else {
            tokens.push({ type: "Identifier", value: ident });
        }
            continue;
        }

         if (/[+\-*/()=,{}]/.test(char)) {
            tokens.push({ type: "Symbol", value: char });
            i++;
            continue;
        }

        throw new Error(`Unexpected character: ${char}`);
    }
    return tokens;
}
