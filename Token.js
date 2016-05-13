"use strict";

window.Compiler = {
}
    
window.Compiler.TokenType = {
	DataTypeNumber: 0,
	DataTypeString: 1,
	DataTypeBoolean: 2,
	Number: 3,
	String: 4,
	Boolean: 5,
	Identifier: 6,
	OpenBracket: 7,
	CloseBracket: 8,
	OpenPar: 9,
	ClosePar: 10,
	Comma: 11,
	Semicolon: 12,
	If: 13,
	Else: 14,
	Repeat: 15,
	While: 16,
	OperatorAdd: 1000,
	OperatorSub: 1001,
	OperatorMul: 1002,
	OperatorDiv: 1003,
	OperatorMod: 1004,
	OperatorBeq: 1005,
	OperatorBdif: 1006,
	OperatorBgt: 1007,
	OperatorBlt: 1008,
	OperatorBgtEq: 1009,
	OperatorBltEq: 1010,
	OperatorBand: 1011,
	OperatorBor: 1012,
	OperatorBnot: 1013,
}
Object.freeze(window.Compiler.TokenType);

window.Compiler.Token = function (value, type, line, column) {
	this.value = value;
	this.type = type;
	this.line = line;
	this.column = column;
}

window.Compiler.Token.prototype = {
	isDataType: function () {
		return (this.type <= Compiler.TokenType.DataTypeBoolean);
	},
	toString: function() {
		if (this.type === Compiler.TokenType.Number || this.type === Compiler.TokenType.Boolean)
			return this.value.toString();
		if (this.type === Compiler.TokenType.String)
			return "\"" + this.value + "\"";
		if (this.type === Compiler.TokenType.Identifier)
			return this.value;
		return this.type.ToString();
	}
}

window.Compiler.createToken = function (type, line, column) {
	return new Compiler.Token(undefined, type, line, column);
}

window.Compiler.createNumericToken = function (value, line, column) {
	return new Compiler.Token(value, Compiler.TokenType.Number, line, column);
}

window.Compiler.createStringToken = function (value, line, column) {
	return new Compiler.Token(value, Compiler.TokenType.String, line, column);
}

window.Compiler.createBooleanToken = function (value, line, column) {
	return new Compiler.Token(!!value, Compiler.TokenType.Boolean, line, column);
}

window.Compiler.createIdentifierToken = function (value, line, column) {
	return new Compiler.Token(value, Compiler.TokenType.Identifier, line, column);
}
