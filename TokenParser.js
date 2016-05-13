"use strict";

window.Compiler.TokenParser = function (input) {
	this.input = input;
	this.index = 0;
	this.nextIndex = 0;
	this.line = 1;
	this.column = 1;
	this.nextLine = 1;
	this.nextColumn = 1;
	this.errorDescription = null;
}

window.Compiler.TokenParser.prototype = {
	hasError: function () {
		return (this.errorDescription != null);
	},
	isEOF: function () {
		return (this.index >= this.input.length);
	},
	eatString: function () {
		var sb = "", input = this.input, c;
		while (this.index < input.Length) {
			input.charCodeAt(this.index);
			this.index++;
			switch (c) {
				case 0x22: // "
					this.column++;
					return sb;
				case 0x0A: // \n
				case 0x0D: // \r
					this.errorDescription = "Quebra de linha dentro de string!";
					return null;
				case 0x5C: // \
					this.column++;
					if (this.index >= input.Length) {
						this.errorDescription = "Fim de arquivo inesperado ao processar string!";
						return null;
					}
					c = input.charCodeAt(this.index);
					this.index++;
					this.column++;
					switch (c) {
						case 0x6E: // n
							sb += "\n";
							break;
						case 0x74: // t
							sb += "\t";
							break;
						case 0x22: // "
							sb += "\"";
							break;
						case 0x5C: // \
							sb += "\\";
							break;
						default:
							this.errorDescription = "Sequência de escape inválida: \"\\" + c + "\"";
							return null;
					}
					break;
				default:
					this.column++;
					sb += String.fromCharCode(c);
					break;
			}
		}
		this.errorDescription = "Fim de arquivo inesperado ao processar string!";
		return null;
	},
	eatLine: function () {
		var input = this.input;
		while (this.index < input.length) {
			switch (input.charCodeAt(this.index)) {
				case 0x0A: // \n
					this.column = 1;
					this.line++;
					this.index++;
					return;
				case 0x0D: // \r
					this.index++;
					if (this.index < input.length) {
						if (input.charCodeAt(this.index) === 0x0A)
							this.index++;
					}
					this.column = 1;
					this.line++;
					return;
			}
			this.column++;
			this.index++;
		}
	},
	eatComment: function () {
		var input = this.input;
		while (this.index < input.length) {
			switch (input.charCodeAt(this.index)) {
				case 0x2A: // *
					if ((this.index + 1) < input.length) {
						if (input.charCodeAt(this.index + 1) === 0x2F) {
							this.column += 2;
							this.index += 2;
							return;
						}
					}
					this.column++;
					this.index++;
					break;
				case 0x0A: // \n
					this.column = 1;
					this.line++;
					this.index++;
					break;
				case 0x0D: // \r
					this.index++;
					if (this.index < input.Length) {
						if (input.charCodeAt(this.index) === 0x0A)
							this.index++;
					}
					this.column = 1;
					this.line++;
					break;
				default:
					this.column++;
					this.index++;
					break;
			}
		}
		this.errorDescription = "Fim de arquivo inesperado ao processar comentário!";
	},
	commitPeek: function () {
		this.nextIndex = this.index;
		this.nextLine = this.line;
		this.nextColumn = this.column;
	},
	getNext: function () {
		var r = this.peekNext();
		this.nextIndex = this.index;
		this.nextLine = this.line;
		this.nextColumn = this.column;
		return r;
	},
	peekNext: function () {
		var startCol, s, input = this.input, c, sb, v;

		this.index = this.nextIndex;
		this.line = this.nextLine;
		this.column = this.nextColumn;

		if (this.index >= input.length || this.errorDescription !== null)
			return null;

		while (this.index < input.length) {
			c = input.charCodeAt(this.index);
			this.index++;
			switch (c) {
				case 0x22: // "
					startCol = this.column;
					this.column++;
					s = this.eatString();
					if (s === null) {
						this.column = startCol;
						return null;
					}
					return Compiler.createStringToken(s, this.line, startCol);
				case 0x7B: // {
					this.column++;
					return Compiler.createToken(Compiler.TokenType.OpenBracket, this.line, this.column - 1);
				case 0x7D: // }
					this.column++;
					return Compiler.createToken(Compiler.TokenType.CloseBracket, this.line, this.column - 1);
				case 0x28: // (
					this.column++;
					return Compiler.createToken(Compiler.TokenType.OpenPar, this.line, this.column - 1);
				case 0x29: // )
					this.column++;
					return Compiler.createToken(Compiler.TokenType.ClosePar, this.line, this.column - 1);
				case 0x2B: // +
					this.column++;
					return Compiler.createToken(Compiler.TokenType.OperatorAdd, this.line, this.column - 1);
				case 0x2D: // -
					this.column++;
					return Compiler.createToken(Compiler.TokenType.OperatorSub, this.line, this.column - 1);
				case 0x2A: // *
					this.column++;
					return Compiler.createToken(Compiler.TokenType.OperatorMul, this.line, this.column - 1);
				case 0x2F: // /
					this.column++;
					if (this.index < input.length) {
						switch (input.charCodeAt(this.index)) {
							case 0x2F: // /
								this.column++;
								this.index++;
								this.eatLine();
								continue;
							case 0x2A: // *
								this.column++;
								this.index++;
								this.eatComment();
								continue;
						}
					}
					return Compiler.createToken(Compiler.TokenType.OperatorDiv, this.line, this.column - 1);
				case 0x25: // %
					this.column++;
					return Compiler.createToken(Compiler.TokenType.OperatorMod, this.line, this.column - 1);
				case 0x0A: // \n
					this.column = 1;
					this.line++;
					break;
				case 0x0D: // \r
					if (this.index < input.Length) {
						if (input.charCodeAt(this.index) === 0x0A)
							this.index++;
					}
					this.column = 1;
					this.line++;
					break;
				default:
					if (StringUtils.isWhiteSpace(c)) {
						this.column++;
						continue;
					}
					if (c === 0x02E || (c >= 0x30 && c <= 0x39)) {
						sb = String.fromCharCode(c);
						startCol = this.column;
						this.column++;
						while (this.index < input.length) {
							c = input.charCodeAt(this.index);
							if (c !== 0x2E && c !== 0x5F && !StringUtils.isLetterOrDigit(c) && !StringUtils.isSurrogate(c))
								break;
							this.column++;
							this.index++;
							sb += String.fromCharCode(c);
						}
						v = parseFloat(sb);
						if (isNaN(v)) {
							this.column = startCol;
							this.errorDescription = "Número inválido: " + sb.ToString();
							return null;
						}
						return Compiler.createNumericToken(v, this.line, startCol);
					} else if (c === 0x5F || StringUtils.isLetterOrDigit(c) || StringUtils.isSurrogate(c)) {
						sb = String.fromCharCode(c);
						startCol = this.column;
						this.column++;
						while (this.index < input.length) {
							c = input.charCodeAt(this.index);
							if (c !== 0x5F && !StringUtils.isLetterOrDigit(c) && !StringUtils.isSurrogate(c))
								break;
							this.column++;
							this.index++;
							sb += String.fromCharCode(c);
						}
						switch (sb) {
							case "e":
								return Compiler.createToken(Compiler.TokenType.OperatorBand, this.line, startCol);
							case "ou":
								return Compiler.createToken(Compiler.TokenType.OperatorBor, this.line, startCol);
							case "nao":
							case "não":
								return Compiler.createToken(Compiler.TokenType.OperatorBnot, this.line, startCol);
							case "numero":
								return Compiler.createToken(Compiler.TokenType.DataTypeNumber, this.line, startCol);
							case "texto":
								return Compiler.createToken(Compiler.TokenType.DataTypeString, this.line, startCol);
							case "booleano":
								return Compiler.createToken(Compiler.TokenType.DataTypeBoolean, this.line, startCol);
							case "se":
								return Compiler.createToken(Compiler.TokenType.If, this.line, startCol);
							case "senao":
							case "senão":
								return Compiler.createToken(Compiler.TokenType.Else, this.line, startCol);
							case "repita":
								return Compiler.createToken(Compiler.TokenType.Repeat, this.line, startCol);
							case "enquanto":
								return Compiler.createToken(Compiler.TokenType.While, this.line, startCol);
						}
						return Compiler.createIdentifierToken(sb, this.line, startCol);
					}
					this.errorDescription = "Caractere inválido: \"" + String.fromCharCode(c) + "\"";
					return null;
			}
		}
		return null;
	}
}
