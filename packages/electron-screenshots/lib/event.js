"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Event = /** @class */ (function () {
    function Event() {
        this.defaultPrevented = false;
    }
    Event.prototype.preventDefault = function () {
        this.defaultPrevented = true;
    };
    return Event;
}());
exports.default = Event;
