/// <reference types="node" />
import { BrowserWindow } from 'electron';
import Events from 'events';
export default class Screenshots extends Events {
    $win: BrowserWindow | null;
    constructor();
    /**
     * 开始截图
     */
    startCapture(): void;
    /**
     * 结束截图
     */
    endCapture(): void;
    /**
     * 初始化窗口
     */
    private createWindow;
    /**
     * 绑定ipc时间处理
     */
    private listenIpc;
}
