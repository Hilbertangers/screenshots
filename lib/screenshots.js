"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs_1 = __importDefault(require("fs"));
var event_1 = __importDefault(require("./event"));
var events_1 = __importDefault(require("events"));
var padStart0_1 = __importDefault(require("./padStart0"));
var getDisplay_1 = __importDefault(require("./getDisplay"));
var Screenshots = /** @class */ (function (_super) {
    __extends(Screenshots, _super);
    function Screenshots() {
        var _this = _super.call(this) || this;
        // 截图窗口对象
        _this.$win = null;
        _this.listenIpc();
        return _this;
    }
    /**
     * 开始截图
     */
    Screenshots.prototype.startCapture = function () {
        var _this = this;
        if (this.$win)
            this.$win.close();
        var display = getDisplay_1.default();
        this.$win = this.createWindow(display);
        electron_1.ipcMain.once('SCREENSHOTS::DOM-READY', function () {
            if (!_this.$win)
                return;
            _this.$win.webContents.send('SCREENSHOTS::SEND-DISPLAY-DATA', display);
        });
        // 捕捉桌面之后显示窗口
        // 避免截图窗口自己被截图
        electron_1.ipcMain.once('SCREENSHOTS::CAPTURED', function () {
            if (!_this.$win)
                return;
            _this.$win.show();
            _this.$win.focus();
        });
    };
    /**
     * 结束截图
     */
    Screenshots.prototype.endCapture = function () {
        if (!this.$win)
            return;
        this.$win.setSimpleFullScreen(false);
        this.$win.close();
        this.$win = null;
    };
    /**
     * 初始化窗口
     */
    Screenshots.prototype.createWindow = function (_a) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        var $win = new electron_1.BrowserWindow({
            title: 'screenshots',
            x: x,
            y: y,
            width: width,
            height: height,
            type: 'desktop',
            useContentSize: true,
            frame: false,
            show: false,
            autoHideMenuBar: true,
            transparent: true,
            resizable: false,
            movable: false,
            focusable: true,
            fullscreen: true,
            // 设为true mac全屏窗口没有桌面滚动效果
            simpleFullscreen: true,
            backgroundColor: '#30000000',
            titleBarStyle: 'hidden',
            alwaysOnTop: true,
            enableLargerThanScreen: true,
            skipTaskbar: true,
            minimizable: false,
            maximizable: false,
            webPreferences: {
                nodeIntegration: true
            }
        });
        $win.loadURL("file://" + require.resolve('react-screenshots/dist/index.html'));
        return $win;
    };
    /**
     * 绑定ipc时间处理
     */
    Screenshots.prototype.listenIpc = function () {
        var _this = this;
        /**
         * OK事件
         */
        electron_1.ipcMain.on('SCREENSHOTS::OK', function (e, data) {
            var event = new event_1.default();
            _this.emit('ok', event, data);
            if (!event.defaultPrevented) {
                electron_1.clipboard.writeImage(electron_1.nativeImage.createFromDataURL(data.dataURL));
                _this.endCapture();
            }
        });
        /**
         * CANCEL事件
         */
        electron_1.ipcMain.on('SCREENSHOTS::CANCEL', function () {
            var event = new event_1.default();
            _this.emit('cancel', event);
            if (!event.defaultPrevented) {
                _this.endCapture();
            }
        });
        /**
         * SAVE事件
         */
        electron_1.ipcMain.on('SCREENSHOTS::SAVE', function (e, data) {
            var event = new event_1.default();
            _this.emit('save', event, data);
            if (!event.defaultPrevented) {
                if (!_this.$win)
                    return;
                var time = new Date();
                var year = time.getFullYear();
                var month = padStart0_1.default(time.getMonth() + 1);
                var date = padStart0_1.default(time.getDate());
                var hours = padStart0_1.default(time.getHours());
                var minutes = padStart0_1.default(time.getMinutes());
                var seconds = padStart0_1.default(time.getSeconds());
                var milliseconds = padStart0_1.default(time.getMilliseconds(), 3);
                _this.$win.setAlwaysOnTop(false);
                electron_1.dialog
                    .showSaveDialog(_this.$win, {
                    title: '保存图片',
                    defaultPath: "" + year + month + date + hours + minutes + seconds + milliseconds + ".png"
                })
                    .then(function (_a) {
                    var canceled = _a.canceled, filePath = _a.filePath;
                    if (!_this.$win)
                        return;
                    _this.$win.setAlwaysOnTop(true);
                    if (canceled || !filePath)
                        return;
                    fs_1.default.writeFile(filePath, Buffer.from(data.dataURL.replace(/^data:image\/\w+;base64,/, ''), 'base64'), function (err) {
                        if (err)
                            return;
                        _this.endCapture();
                    });
                });
            }
        });
    };
    return Screenshots;
}(events_1.default));
exports.default = Screenshots;
