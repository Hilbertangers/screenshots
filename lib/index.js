"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_debug_1 = __importDefault(require("electron-debug"));
var electron_1 = require("electron");
var screenshots_1 = __importDefault(require("./screenshots"));
electron_1.app.on('ready', function () {
    var screenshots = new screenshots_1.default();
    electron_1.globalShortcut.register('ctrl+shift+a', function () { return screenshots.startCapture(); });
    // 点击确定按钮回调事件
    screenshots.on('ok', function (e, _a) {
        var viewer = _a.viewer;
        console.log('capture', viewer);
    });
    // 点击取消按钮回调事件
    screenshots.on('cancel', function () {
        console.log('capture', 'cancel1');
    });
    screenshots.on('cancel', function (e) {
        // 执行了preventDefault
        // 点击取消不会关闭截图窗口
        e.preventDefault();
        console.log('capture', 'cancel2');
    });
    // 点击保存按钮回调事件
    screenshots.on('save', function (e, _a) {
        var viewer = _a.viewer;
        console.log('capture', viewer);
    });
    electron_debug_1.default({ showDevTools: true, devToolsMode: 'undocked' });
});
electron_1.app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
