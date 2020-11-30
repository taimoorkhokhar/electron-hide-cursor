const { ipc } = process.electronBinding('ipc');
const v8Util = process.electronBinding('v8_util');

// Created by init.js.
const ipcRenderer = v8Util.getHiddenValue<Electron.IpcRenderer>(global, 'ipc');
const internal = false;

if (!ipcRenderer.send) {
  ipcRenderer.send = function (channel, ...args) {
    return ipc.send(internal, channel, args);
  };

  ipcRenderer.sendSync = function (channel, ...args) {
    return ipc.sendSync(internal, channel, args)[0];
  };

  ipcRenderer.sendToHost = function (channel, ...args) {
    return ipc.sendToHost(channel, args);
  };

  ipcRenderer.sendTo = function (webContentsId, channel, ...args) {
    return ipc.sendTo(internal, false, webContentsId, channel, args);
  };

  ipcRenderer.invoke = async function (channel, ...args) {
    const { error, result } = await ipc.invoke(internal, channel, args);
    if (error) {
      throw new Error(`Error invoking remote method '${channel}': ${error}`);
    }
    return result;
  };
}

ipcRenderer.postMessage = function (channel: string, message: any, transferables: any) {
  return ipc.postMessage(channel, message, transferables);
};

export default ipcRenderer;
