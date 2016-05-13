"use strict"

window.Compiler = {}


window.Compiler.Expression = {
    Parse: function (p) {
        return Sum.Parse(p);
    }

}