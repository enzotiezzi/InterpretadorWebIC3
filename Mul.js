"use strict"

window.Compiler = {}

window.Compiler.Mul =
            function (v1, v2) {
                this.v1 = v1;
                this.v2 = v2;
            }


window.Compiler.Mul.prototype = {
    M: function (v1, v2) {

    }
}
window.Compiler.Mul.prototype = {
    Evaluate: function () {
        return v1.Evaluate() * v2.Evaluate();
    }
}


window.Compiler.Mul.prototype = {
    D: function (v1, v2) {

    }

}
window.Compiler.Mul.prototype = {
    Evaluate: function () {
        return v1.Evaluate() / v2.Evaluate();
    }
}

window.Compiler.Mul.prototype = {
    Parse: function (p) {
        v1 = Value.Parse(p);
        if (v1 == null)
            return null;

        v2;
        t = p.PeekNext();
        if (t == null)
            return v1;

        switch (t.Type) {
            case TokenType.OperatorMul:
                p.CommitPeek();
                v2 = Parse(p);
                if (v2 == null)
                    return null;
                return new M(v1, v2);
            case TokenType.OperatorDiv:
                p.CommitPeek();
                v2 = Parse(p);
                if (v2 == null)
                    return null;
                return new D(v1, v2);
        }

        return v1;
    }
}