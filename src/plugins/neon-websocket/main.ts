import { ipcMain, app, BrowserWindow } from 'electron';
import registerCallback, { SongInfo } from '../../providers/song-info';

import http from 'http';

let songInfo: SongInfo | undefined = undefined;

export default (win: BrowserWindow) => {
    ipcMain.on('apiLoaded', () => win.webContents.send('setupTimeChangedListener'));
    
    ipcMain.on('timeChanged', (_, t: number) => {
        if (songInfo) {
            songInfo.elapsedSeconds = t;
        }
    });

    let server = http.createServer((req, res) => {
        if (songInfo) {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(songInfo));
        } else {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('No song info available');
        }
    });

    server.listen(3568);
    console.log('Server listening on port 3568');

    app.on('before-quit', () => server.close());
  
    registerCallback((i) => songInfo = i);
};