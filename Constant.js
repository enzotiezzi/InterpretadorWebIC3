"use strict"

window.Compiler = {
}


window.Compiler.Constant = function (t) {
    this.t = t;
}

window.Compiler.Constant.prototype = {
    Evaluate: function () {
        return t.DValue;
    }

}