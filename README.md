# SOLAR Programming Language and Interpreter

## Overview

**SOLAR** is a statically-typed, high-level programming language designed specifically for blockchain development and smart contracts. It combines familiar programming constructs with blockchain-specific features to facilitate the creation of secure and efficient decentralized applications (DApps) and smart contracts.

This repository includes a simple interpreter for the SOLAR programming language implemented in JavaScript, allowing users to write and execute SOLAR code directly in their web browsers.

## Features of SOLAR

- **Data Types**: Supports basic data types including integers, strings, and booleans.
- **Variables**: Declare variables using the `let` keyword.
- **Arithmetic Operations**: Supports addition, subtraction, multiplication, and division.
- **Control Structures**: Includes `if` statements for conditional execution.
- **Functions**: Define reusable functions with parameters and return values.
- **Output**: Print values to the console using the `print` statement.
- **Basic Error Handling**: Provides error messages for syntax and runtime errors.

## Getting Started

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Edge).

### Installation

1. **Clone the Repository**: 

bash
```
git clone https://github.com/yourusername/solar-language.git
cd solar language
```
2. **Open the HTML File**: 
 Open `index.html` in your web browser.

### Usage

1. **Enter SOLAR Code**: In the text area provided, write your SOLAR code. You can use the sample code provided or create your own.

2. **Run the Code**: Click the "Run Code" button to execute the SOLAR code. The output will be displayed in the output area below the button.

### Example Code

Here’s a sample SOLAR code snippet you can try:

```
solar
let x = 10;
let y = 20;
let z = x + y;
print z;

function add(a, b) {
let result = a + b;
print result;
}

add(5, 15);

if (z == 30) {
print "z is 30";
}
```

## Interpreter Details

The SOLAR interpreter is implemented in JavaScript and consists of the following components:

- **Tokenizer**: Splits the input code into tokens for easier parsing.
- **Parser**: Analyzes the tokens and builds an abstract syntax tree (AST) to execute the code.
- **Execution Engine**: Executes the parsed code, handling variable assignments, function calls, and control flow.

### File Structure
```
/solar-language
│
├── index.html          # HTML file to run the interpreter
├── solar-interpreter.js # JavaScript interpreter for SOLAR
└── README.md           # Documentation for the SOLAR language and interpreter
```

## Limitations

- The current interpreter supports a limited subset of the SOLAR language features.
- Advanced features such as arrays, mappings, and complex data types are not yet implemented.
- Error handling is basic and may not cover all edge cases.

## Future Enhancements

- Implement support for additional data types (arrays, mappings).
- Add more control structures (loops, switch statements).
- Improve error handling and debugging capabilities.
- Extend the language with more built-in functions and libraries.

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgments

- Inspired by modern programming languages and blockchain technology.
- Special thanks to the open-source community for their contributions and support.