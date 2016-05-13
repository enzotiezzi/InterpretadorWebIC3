"use strict"

window.Compiler = {}

window.Compiler.Sum =
            function (v1, v2) {
                this.v1 = v1;
                this.v2 = v2;
            }


window.Compiler.Sum.prototype = {
    A: function (v1, v2) {

    }
}
window.Compiler.Sum.prototype = {
    Evaluate: function () {
        return v1.Evaluate() + v2.Evaluate();
    }
}


window.Compiler.Sum.prototype = {
    S: function (v1, v2) {

    }
}
window.Compiler.Sum.prototype = {
    Evaluate: function () {
        return v1.Evaluate() - v2.Evaluate();
    }
}

window.Compiler.Sum.prototype = {
    Parse: function (p) {
        v1 = Mul.Parse(p);
        if (v1 == null)
            return null;

        var v2;
        var t = p.PeekNext();
        if (t == null)
            return v1;

        switch (t.Type) {
            case TokenType.OperatorAdd:
                p.CommitPeek();
                v2 = Parse(p);
                if (v2 == null)
                    return null;
                return new A(v1, v2);
            case TokenType.OperatorSub:
                p.CommitPeek();
                v2 = Parse(p);
                if (v2 == null)
                    return null;
                return new S(v1, v2);
        }

        return v1;
    }
}