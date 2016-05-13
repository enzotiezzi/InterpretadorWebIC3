"use strict"

window.Compiler = {}

window.Compiler.Negate =
            function (t, e) {
                this.t = t;
                this.e = e;
            }

window.Compiler.Negate.prototype = {
    Evaluate: function () {
        return -e.Evaluate();
    }
}