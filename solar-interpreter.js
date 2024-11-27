// solar-interpreter.js

class SolarInterpreter {
    constructor() {
        this.variables = {};
        this.functions = {};
        this.output = '';
        this.tokens = [];
        this.position = 0;
    }
  
    interpret(code) {
        this.variables = {};
        this.functions = {};
        this.output = '';
        this.tokens = this.tokenize(code);
        this.position = 0;
        this.parse();
        return this.output;
    }
  
    tokenize(code) {
        // Simple tokenizer to split code into tokens
        const regex = /\s*(=>|==|!=|<=|>=|[(){};,+\-*/%]|[A-Za-z_][A-Za-z0-9_]*|\d+\.?\d*|"[^"]*")\s*/g;
        return code.split(regex).filter(token => token && !/\s/.test(token));
    }
  
    parse() {
        const parseStatement = () => {
            let token = this.tokens[this.position];
  
            if (token === 'print') {
                this.position++;
                this.parsePrintStatement();
            } else if (token === 'let') {
                this.position++;
                this.parseVariableDeclaration();
            } else if (token === 'if') {
                this.position++;
                this.parseIfStatement();
            } else if (token === 'function') {
                this.position++;
                this.parseFunctionDeclaration();
            } else if (this.isIdentifier(token)) {
                this.parseAssignmentOrFunctionCall();
            } else {
                this.position++;
            }
        };
  
        while (this.position < this.tokens.length) {
            parseStatement();
        }
    }
  
    parseVariableDeclaration() {
        const varName = this.tokens[this.position++];
        if (this.variables[varName] !== undefined) {
            throw new Error(`Variable "${varName}" is already declared.`);
        }
        this.expect('=');
        const value = this.parseExpression();
        this.expect(';');
        this.variables[varName] = value;
    }
  
    parseAssignmentOrFunctionCall() {
        const name = this.tokens[this.position++];
        if (this.tokens[this.position] === '=') {
            // Assignment
            this.position++;
            const value = this.parseExpression();
            this.expect(';');
            if (this.variables[name] === undefined) {
                throw new Error(`Variable "${name}" is not declared.`);
            }
            this.variables[name] = value;
        } else if (this.tokens[this.position] === '(') {
            // Function call
            this.position++;
            const args = [];
            if (this.tokens[this.position] !== ')') {
                args.push(this.parseExpression());
                while (this.tokens[this.position] === ',') {
                    this.position++;
                    args.push(this.parseExpression());
                }
            }
            this.expect(')');
            this.expect(';');
            this.executeFunction(name, args);
        } else {
            throw new Error(`Unexpected token "${this.tokens[this.position]}".`);
        }
    }
  
    parseExpression() {
        let value = this.parseTerm();
        while (this.tokens[this.position] === '+' || this.tokens[this.position] === '-') {
            const operator = this.tokens[this.position++];
            const nextTerm = this.parseTerm();
            if (operator === '+') {
                value += nextTerm;
            } else {
                value -= nextTerm;
            }
        }
        return value;
    }
  
    parseTerm() {
        let value = this.parseFactor();
        while (this.tokens[this.position] === '*' || this.tokens[this.position] === '/') {
            const operator = this.tokens[this.position++];
            const nextFactor = this.parseFactor();
            if (operator === '*') {
                value *= nextFactor;
            } else {
                value /= nextFactor;
            }
        }
        return value;
    }
  
    parseFactor() {
        let token = this.tokens[this.position++];
        if (this.isNumber(token)) {
            return parseFloat(token);
        } else if (this.isString(token)) {
            return token.slice(1, -1); // Remove quotes
        } else if (this.isIdentifier(token)) {
            if (this.variables[token] !== undefined) {
                return this.variables[token];
            } else {
                throw new Error(`Variable "${token}" is not declared.`);
            }
        } else if (token === '(') {
            const value = this.parseExpression();
            this.expect(')');
            return value;
        } else {
            throw new Error(`Unexpected token "${token}" in expression.`);
        }
    }
  
    parsePrintStatement() {
        let value;
        if (this.tokens[this.position] === '"') {
            value = this.tokens[this.position++];
            this.expect(';');
            this.output += value.slice(1, -1) + '\n';
        } else {
            value = this.parseExpression();
            this.expect(';');
            this.output += value + '\n';
        }
    }
  
    parseIfStatement() {
        this.expect('(');
        const condition = this.parseCondition();
        this.expect(')');
        this.expect('{');
        if (condition) {
            this.parseBlock();
        } else {
            this.skipBlock();
        }
    }
  
    parseCondition() {
        const left = this.parseExpression();
        const operator = this.tokens[this.position++];
        const right = this.parseExpression();
        switch (operator) {
            case '==':
                return left === right;
            case '!=':
                return left !== right;
            case '<':
                return left < right;
            case '>':
                return left > right;
            case '<=':
                return left <= right;
            case '>=':
                return left >= right;
            default:
                throw new Error(`Unknown operator "${operator}" in condition.`);
        }
    }
  
    parseBlock() {
        while (this.tokens[this.position] !== '}') {
            this.parse();
        }
        this.position++;
    }
  
    skipBlock() {
        let braceCount = 1;
        this.position++; // Skip the initial '{'
        while (braceCount > 0 && this.position < this.tokens.length) {
            const token = this.tokens[this.position++];
            if (token === '{') braceCount++;
            else if (token === '}') braceCount--;
        }
    }
  
    parseFunctionDeclaration() {
        const funcName = this.tokens[this.position++];
        this.expect('(');
        const params = [];
        if (this.tokens[this.position] !== ')') {
            params.push(this.tokens[this.position++]);
            while (this.tokens[this.position] === ',') {
                this.position++;
                params.push(this.tokens[this.position++]);
            }
        }
        this.expect(')');
        this.expect('{');
        const bodyStart = this.position;
        let braceCount = 1;
        while (braceCount > 0 && this.position < this.tokens.length) {
            const token = this.tokens[this.position++];
            if (token === '{') braceCount++;
            else if (token === '}') braceCount--;
        }
        const bodyEnd = this.position - 1;
        const bodyTokens = this.tokens.slice(bodyStart, bodyEnd);
        this.functions[funcName] = { params, bodyTokens };
    }
  
    executeFunction(name, args) {
        const func = this.functions[name];
        if (!func) {
            throw new Error(`Function "${name}" is not defined.`);
        }
        if (args.length !== func.params.length) {
            throw new Error(`Function "${name}" expects ${func.params.length} arguments.`);
        }
        // Save current scope
        const oldVariables = { ...this.variables };
        // Set function scope
        for (let i = 0; i < func.params.length; i++) {
            this.variables[func.params[i]] = args[i];
        }
        // Execute function body
        const oldTokens = this.tokens;
        const oldPosition = this.position;
        this.tokens = func.bodyTokens;
        this.position = 0;
        this.parse();
        // Restore previous scope
        this.variables = oldVariables;
        this.tokens = oldTokens;
        this.position = oldPosition;
    }
  
    expect(token) {
        if (this.tokens[this.position] !== token) {
            throw new Error(`Expected "${token}" but found "${this.tokens[this.position]}".`);
        }
        this.position++;
    }
  
    isNumber(token) {
        return !isNaN(token);
    }
  
    isString(token) {
        return /^"[^"]*"$/.test(token);
    }
  
    isIdentifier(token) {
        return /^[A-Za-z_][A-Za-z0-9_]*$/.test(token);
    }
  }
  
  const interpreter = new SolarInterpreter();
  
  function runSolarCode(code) {
    try {
        const output = interpreter.interpret(code);
        return output;
    } catch (e) {
        return 'Error: ' + e.message;
    }
  }