import {ContextActionList, TorrentActionList, TorrentClient, TorrentUpdates} from "../torrentclient";
import {DelugeTorrent} from "./torrentd";

type CallbackFunc = (err: any, val: any) => void

function defer<T>(fn: (f: CallbackFunc) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    fn((err, val) => {
      if (err) {
        reject(err)
      } else {
        resolve(val)
      }
    })
  })
}

const Deluge = require('@electorrent/node-deluge')

export class DelugeClient extends TorrentClient<DelugeTorrent> {

    public name = 'Deluge'
    public id = 'deluge'

    private deluge = null


    async connect(server): Promise<void> {
        this.deluge = new Deluge({
            host: server.url(),
            port: server.port,
            path: server.cleanPath(),
            pass: server.password,
            ca: server.getCertificate(),
        })

        await defer(done => this.deluge.login(done))
        // Connect to server #0 by default
        return await this.deluge.connect(0)
    }

    async torrents(): Promise<TorrentUpdates> {
        var torrents = {
            labels: [],
            all: [],
            changed: [],
            deleted: [],
            dirty: true,
        };

        let data: Record<string, any> = await defer(done => this.deluge.getTorrents(done))

        for (const hash of Object.keys(data.torrents || {})) {
            torrents.all.push(new DelugeTorrent(hash, data.torrents[hash]))
        }

        return torrents
    }

    defaultPath(): string {
      return "/"
    }

    addTorrentUrl(magnet: string): Promise<void> {
        return defer(done => this.deluge.addTorrentURL(magnet, {}, done))
    }

    uploadTorrent(buffer: Uint8Array, filename: string): Promise<void> {
        return defer(done => this.deluge.addTorrent(buffer, {}, done))
    }

    resume(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.resume(torrents.map(t => t.hash), done))
    }

    pause(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.pause(torrents.map(t => t.hash), done))
    }

    verify(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.verify(torrents.map(t => t.hash), done))
    }

    remove(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.remove(torrents.map(t => t.hash), done))
    }

    removeAndDelete(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.removeAndDelete(torrents.map(t => t.hash), done))
    }

    queueUp(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.queueUp(torrents.map(t => t.hash), done))
    }

    queueDown(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.queueDown(torrents.map(t => t.hash), done))
    }

    queueTop(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.queueTop(torrents.map(t => t.hash), done))
    }

    queueBottom(torrents: DelugeTorrent[]): Promise<void> {
        return defer(done => this.deluge.queueBottom(torrents.map(t => t.hash), done))
    }

    /**
     * Delete function to satisfy interface implementation
     * @param torrents torrent to delete
     * @returns promise that torrents were deleted
     */
    deleteTorrents(torrents: DelugeTorrent[]): Promise<void> {
        return this.remove(torrents)
    }

    /**
     * Whether the client supports sorting by trackers or not
     */
    enableTrackerFilter = false

    /**
     * Provides the option to include extra columns for displaying data. This may concern columns
     * which are specific to this client. The extra columns will be merged with the default columns.
     */
    extraColumns = []

    actionHeader: TorrentActionList<DelugeTorrent> = [
        {
            label: '开始',
            type: 'button',
            color: 'green',
            click: this.resume,
            icon: 'play',
            role: 'resume'
        },
        {
            label: '暂停',
            type: 'button',
            color: 'red',
            click: this.pause,
            icon: 'pause',
            role: 'stop'
        },
    ]

    contextMenu: ContextActionList<DelugeTorrent> = [
        {
            label: '重新检查',
            click: this.verify,
            icon: 'checkmark'
        },
        {
            label: '上移队列',
            click: this.queueUp,
            icon: 'arrow up'
        },
        {
            label: '下移队列',
            click: this.queueDown,
            icon: 'arrow down'
        },
        {
            label: '置顶',
            click: this.queueTop,
            icon: 'chevron circle up'
        },
        {
            label: '置底',
            click: this.queueBottom,
            icon: 'chevron circle down'
        },
        {
            label: '移除队列',
            click: this.remove,
            icon: 'remove'
        },
        {
            label: '移除队列并删除文件',
            click: this.removeAndDelete,
            icon: 'trash',
            role: 'delete'
        },
    ];

}

