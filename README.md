# Music Player Project

This project is a **web-based music player** built using **HTML**, **CSS**, and **JavaScript**. The application allows users to load their music files from a directory, play tracks, navigate between tracks, control volume, and seek playback. The design emphasizes a clean, modern interface with smooth animations and dynamic functionalities.

---

## Features

1. **User Interface**: 
   - Minimalistic, responsive design with gradient backgrounds.
   - Rotating album art when music is playing.
   - User-friendly sliders for seeking and volume control.

2. **Music Playback**:
   - Play, pause, and navigate between tracks.
   - Randomized playback functionality.
   - Track details (name and artist) display.

3. **Dynamic Directory Loading**:
   - Uses the `showDirectoryPicker` API to allow users to load a folder containing music files.

4. **Track Progress and Duration**:
   - Real-time updates on current playback time and total duration.

5. **Random Background**:
   - Generates and applies random gradient colors dynamically for aesthetic enhancement.

---

## JavaScript Functionality

The JavaScript code provides the core logic and interactivity for the music player. Below is a detailed explanation of its key components:

### 1. **Class-Based Design**
The app uses an `MusicPlayer` class for modularity and encapsulation. This class manages the state, event listeners, and core functionalities.

```javascript
class MusicPlayer {
    constructor() {
        // Initialize DOM elements and state variables
    }
    async initializePlayer() {
        // Handles user-selected directories and loads music files
    }
}
```

### 2. **Directory Selection**
The `initializePlayer()` function uses the `showDirectoryPicker` API to allow users to choose a folder. It filters and loads audio files into a list:

```javascript
async initializePlayer() {
    const dirHandle = await window.showDirectoryPicker();
    for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && this.isMusicFile(entry.name)) {
            const file = await entry.getFile();
            this.music_list.push({
                name: file.name.replace(/\.[^/.]+$/, ""),
                music: URL.createObjectURL(file),
                artist: 'Unknown Artist'
            });
        }
    }
}
```

- **Supported Formats**: `.mp3`, `.wav`, `.ogg`, `.flac`, `.m4a`, `.aac`.

### 3. **Track Control**
- **Load Track**: Loads the selected track and updates the UI.
- **Play/Pause**: Toggles between playing and pausing the track.
- **Next/Previous**: Switches tracks sequentially or randomly (if random mode is enabled).
- **Random Mode**: Toggles shuffle mode.

```javascript
playpauseTrack() {
    this.isPlaying ? this.pauseTrack() : this.playTrack();
}
nextTrack() {
    if (this.isRandom) {
        this.track_index = Math.floor(Math.random() * this.music_list.length);
    } else {
        this.track_index = (this.track_index + 1) % this.music_list.length;
    }
    this.loadTrack(this.track_index);
    this.playTrack();
}
```

### 4. **Real-Time Updates**
The `setUpdate()` function synchronizes the playback slider and time display with the current track's progress:

```javascript
setUpdate() {
    if (!isNaN(this.curr_track.duration)) {
        const seekPosition = this.curr_track.currentTime * (100 / this.curr_track.duration);
        this.seek_slider.value = seekPosition;
        this.curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
        this.total_duration.textContent = `${durationMinutes}:${durationSeconds}`;
    }
}
```

### 5. **Volume and Seek**
Users can adjust playback volume and seek within the track using sliders:

```javascript
seekTo() {
    const seekto = this.curr_track.duration * (this.seek_slider.value / 100);
    this.curr_track.currentTime = seekto;
}
setVolume() {
    this.curr_track.volume = this.volume_slider.value / 100;
}
```

### 6. **Dynamic Styling**
A random gradient is applied to the background every time a track is loaded:

```javascript
random_bg_color() {
    const hex = ['0', '1', '2', ...];
    const populate = (a) => { /* Random color generation logic */ };
    document.body.style.background = gradient;
}
```

---

## Conclusion

This project showcases how modern browser APIs and DOM manipulation can create an interactive and visually appealing application. The modularity of the code makes it extensible for future features like playlists, album art fetching, or integration with a music streaming API.
