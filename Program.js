"use strict"

window.Compiler = {}



//public static List<Statement> Parse(TokenParser p)
window.Compiler.Program = {
    Parse: function (p) {
        ErrorToken = null;
        ErrorDescription = null;

        e = Expression.Parse(p);
        if (e == null)
            return null;
        t = p.GetNext();
        if (t != null) {
            ErrorToken = t;
            ErrorDescription = "Símbolo inválido! Era esperado fim de arquivo";
            return null;
        }
        if (p.HasError)
            return null;
        return e;
    }
}