class MusicPlayer {
    constructor() {
        // DOM Elements
        this.now_playing = document.querySelector('.now-playing');
        this.track_art = document.querySelector('.track-art');
        this.track_name = document.querySelector('.track-name');
        this.track_artist = document.querySelector('.track-artist');

        this.playpause_btn = document.querySelector('.playpause-track');
        this.next_btn = document.querySelector('.next-track');
        this.prev_btn = document.querySelector('.prev-track');
        this.randomIcon = document.querySelector('.random-track i');
        this.directoryBtn = document.querySelector('.directory-btn');

        this.seek_slider = document.querySelector('.seek_slider');
        this.volume_slider = document.querySelector('.volume_slider');
        this.curr_time = document.querySelector('.current-time');
        this.total_duration = document.querySelector('.total-duration');
        this.wave = document.getElementById('wave');

        // Track variables
        this.curr_track = new Audio();
        this.track_index = 0;
        this.isPlaying = false;
        this.isRandom = false;
        this.updateTimer = null;
        this.music_list = [];

        this.setupEventListeners();
    }

    async initializePlayer() {
        try {
            // Prompt user to select music directory
            const dirHandle = await window.showDirectoryPicker();
            this.music_list = [];

            // Iterate through files in the directory
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

            if (this.music_list.length > 0) {
                this.loadTrack(0);
                this.track_name.textContent = music_list.name;
                this.track_artist.textContent = `${this.music_list.length} tracks found`;
            } else {
                alert('No music files found in selected directory');
            }
        } catch (error) {
            console.error('Error selecting directory:', error);
        }
    }

    isMusicFile(filename) {
        const musicExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'];
        return musicExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    }

    setupEventListeners() {
        // Add directory button listener
        this.directoryBtn.addEventListener('click', () => this.initializePlayer());

        this.curr_track.addEventListener('ended', () => this.nextTrack());
        this.curr_track.addEventListener('timeupdate', () => this.setUpdate());
        
        // Bind methods to make them accessible globally
        window.playpauseTrack = () => this.playpauseTrack();
        window.nextTrack = () => this.nextTrack();
        window.prevTrack = () => this.prevTrack();
        window.seekTo = () => this.seekTo();
        window.setVolume = () => this.setVolume();
        window.randomTrack = () => this.randomTrack();
    }

    loadTrack(track_index) {
        // Clear previous interval
        clearInterval(this.updateTimer);
        this.reset();

        // Set current track
        const track = this.music_list[track_index];
        this.curr_track.src = track.music;
        this.curr_track.load();

        // Update track info
        this.track_name.textContent = track.name;
        this.track_artist.textContent = track.artist;
        this.now_playing.textContent = `Playing music ${track_index + 1} of ${this.music_list.length}`;

        // Start update timer
        this.updateTimer = setInterval(() => this.setUpdate(), 1000);

        // Set random background
        this.random_bg_color();
    }

    random_bg_color() {
        let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
        
        const populate = (a) => {
            for(let i = 0; i < 6; i++) {
                let x = Math.round(Math.random() * 14);
                a += hex[x];
            }
            return a;
        };

        let Color1 = populate('#');
        let Color2 = populate('#');
        let angle = 'to right';

        let gradient = `linear-gradient(${angle}, ${Color1}, ${Color2})`;
        document.body.style.background = gradient;
    }

    reset() {
        this.curr_time.textContent = "00:00";
        this.total_duration.textContent = "00:00";
        this.seek_slider.value = 0;
    }

    playpauseTrack() {
        this.isPlaying ? this.pauseTrack() : this.playTrack();
    }

    playTrack() {
        this.curr_track.play();
        this.isPlaying = true;
        this.track_art.classList.add('rotate');
        this.wave.classList.add('loader');
        this.playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
    }

    pauseTrack() {
        this.curr_track.pause();
        this.isPlaying = false;
        this.track_art.classList.remove('rotate');
        this.wave.classList.remove('loader');
        this.playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
    }

    nextTrack() {
        if(this.track_index < this.music_list.length - 1 && !this.isRandom) {
            this.track_index += 1;
        } else if(this.track_index < this.music_list.length - 1 && this.isRandom) {
            this.track_index = Math.floor(Math.random() * this.music_list.length);
        } else {
            this.track_index = 0;
        }
        this.loadTrack(this.track_index);
        this.playTrack();
    }

    prevTrack() {
        if(this.track_index > 0) {
            this.track_index -= 1;
        } else {
            this.track_index = this.music_list.length - 1;
        }
        this.loadTrack(this.track_index);
        this.playTrack();
    }

    seekTo() {
        let seekto = this.curr_track.duration * (this.seek_slider.value / 100);
        this.curr_track.currentTime = seekto;
    }

    setVolume() {
        this.curr_track.volume = this.volume_slider.value / 100;
    }

    randomTrack() {
        this.isRandom = !this.isRandom;
        this.randomIcon.classList.toggle('randomActive');
    }

    setUpdate() {
        if(!isNaN(this.curr_track.duration)) {
            let seekPosition = this.curr_track.currentTime * (100 / this.curr_track.duration);
            this.seek_slider.value = seekPosition;

            let currentMinutes = Math.floor(this.curr_track.currentTime / 60);
            let currentSeconds = Math.floor(this.curr_track.currentTime - currentMinutes * 60);
            let durationMinutes = Math.floor(this.curr_track.duration / 60);
            let durationSeconds = Math.floor(this.curr_track.duration - durationMinutes * 60);

            // Add leading zeros
            currentSeconds = currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
            durationSeconds = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;
            currentMinutes = currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
            durationMinutes = durationMinutes < 10 ? "0" + durationMinutes : durationMinutes;

            this.curr_time.textContent = `${currentMinutes}:${currentSeconds}`;
            this.total_duration.textContent = `${durationMinutes}:${durationSeconds}`;
        }
    }
}

// Initialize player on window load
const player = new MusicPlayer();