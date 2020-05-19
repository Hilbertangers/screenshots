"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
exports.default = (function () {
    var point = electron_1.screen.getCursorScreenPoint();
    var primaryDisplay = electron_1.screen.getPrimaryDisplay();
    var _a = electron_1.screen.getDisplayNearestPoint(point), id = _a.id, bounds = _a.bounds, workArea = _a.workArea, scaleFactor = _a.scaleFactor;
    // win32 darwin linux平台分别处理
    var scale = process.platform === 'darwin' ? 1 : scaleFactor / primaryDisplay.scaleFactor;
    var display = process.platform === 'linux' ? workArea : bounds;
    return {
        id: id,
        x: display.x * (scale >= 1 ? scale : 1),
        y: display.y * (scale >= 1 ? scale : 1),
        width: display.width * scale,
        height: display.height * scale
    };
});
