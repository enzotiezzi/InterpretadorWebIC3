"use strict"

window.Compiler = {}


window.Compiler.Parse =
            function (p) {
                var t = p.GetNext(), t2;
                if (t == null) {
                    Program.ErrorToken = null;
                    Program.ErrorDescription = "Era esperado um valor";
                    return null;
                }

                switch (t.Type) {
                    case TokenType.Number:
                        return new Constant(t);
                    case TokenType.OpenBracket:
                        var e = Expression.Parse(p);
                        if (e == null)
                            return null;
                        t2 = p.GetNext();
                        if (t2 == null) {
                            Program.ErrorToken = null;
                            Program.ErrorDescription = "Era esperado )";
                            return null;
                        }
                        if (t2.Type == TokenType.CloseBracket)
                            return new Bracket(t, e, t2);
                        Program.ErrorToken = t2;
                        Program.ErrorDescription = "Símbolo inválido! Era esperado )";
                        return null;
                    case TokenType.OperatorSub:
                        var v = Parse(p);
                        if (v == null)
                            return null;
                        return new Negate(t, v);
                }
                Program.ErrorToken = t;
                Program.ErrorDescription = "Símbolo inválido: \"" + t.ToString() + "\"";
                return null;
            }