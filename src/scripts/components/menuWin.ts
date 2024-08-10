import mousetrap from "mousetrap"

export let menuWin = ['electron', '$rootScope', '$bittorrent', 'notificationService', 'configService', function(electron, $rootScope, $bittorrent, $notify, config) {

    mousetrap.bind('ctrl+a', function() {
        if (document.activeElement.nodeName === 'INPUT') {
            electron.remote.getCurrentWebContents().selectAll()
        } else {
            $rootScope.$broadcast('menu:selectall')
        }
    })

    const template = [
        {
            label: '文件',
            id: 'file',
            submenu: [
                {
                    label: "添加Torrent",
                    accelerator: "CmdOrCtrl+O",
                    click: function() {
                        electron.torrents.browse(false);
                    }
                },
                {
                    label: "添加Torrent (高级选项)",
                    id: "torrent-file-add-advanced",
                    accelerator: "CmdOrCtrl+Shift+O",
                    visible: true,
                    click: function() {
                        electron.torrents.browse(true);
                    }
                },
                {
                    label: "粘贴Torrent链接",
                    accelerator: "CmdOrCtrl+I",
                    click: function() {
                        $bittorrent.uploadFromClipboard();
                    }
                },
                {
                    label: "粘贴Torrent链接(高级选项)",
                    id: "torrent-url-add-advanced",
                    accelerator: "CmdOrCtrl+Shift+I",
                    visible: false,
                    click: function() {
                        $bittorrent.uploadFromClipboard(true);
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: '设置',
                    accelerator: 'Ctrl+,',
                    click: function() {
                        $rootScope.$broadcast('show:settings');
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: '退出',
                    role: 'quit'
                }
            ]
        },
        {
            label: '编辑',
            submenu: [
                {
                    label: '撤销',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo'
                },
                {
                    label: '重做',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: '查找',
                    accelerator: 'CmdOrCtrl+F',
                    click() {
                        $rootScope.$broadcast('search:torrent');
                    }
                },
                {
                    label: '剪切',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut'
                },
                {
                    label: '复制',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy'
                },
                {
                    label: '粘贴',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste'
                },
                {
                    label: '移除',
                    accelerator: 'Delete',
                    click() {
                        if (document.activeElement.nodeName !== 'INPUT') {
                            $rootScope.$broadcast('menu:remove')
                        }
                    }
                },
                {
                    label: '全选',
                    accelerator: 'CmdOrCtrl+A',
                    click() {
                        if (document.activeElement.nodeName === 'INPUT') {
                            electron.remote.getCurrentWebContents().selectAll()
                        } else {
                            $rootScope.$broadcast('menu:selectall')
                        }
                    },
                },
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: '刷新',
                    visible: electron.program.debug,
                    accelerator: 'CmdOrCtrl+R',
                    click(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.reload();
                    }
                },
                {
                    label: '全屏',
                    accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                    click(item, focusedWindow) {
                        if (focusedWindow)
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                },
                {
                    label: '开发者工具',
                    visible: electron.program.debug,
                    accelerator: 'Ctrl+Shift+I',
                    click(item, focusedWindow) {
                        if (focusedWindow)
                        focusedWindow.webContents.toggleDevTools();
                    }
                },
            ]
        },
        {
            label: '服务器',
            id: 'servers',
            submenu: []
        },
        {
            label: '窗口',
            role: 'window',
            submenu: [
                {
                    label: '最小化',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize'
                },
                {
                    label: '关闭',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close'
                },
            ]
        },
        {
            label: '帮助',
            role: 'help',
            submenu: [
                {
                    label: '关于',
                    click() { electron.shell.openExternal('https://github.com/JZPPP/Electorrent_CN'); }
                },
                {
                    label: '检查更新',
                    click() { electron.updater.checkForUpdates(true) }
                }
            ]
        },
    ];

    return template;

}]

