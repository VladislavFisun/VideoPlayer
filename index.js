document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  let defaultOptions = {};
  let count = 0;
  let playInterval;

  const hls = new Hls();
  if (Hls.isSupported()) {
    hls.loadSource(
      "https://live-streams.cdnvideo.ru/cdnvideo/caminandes/playlist.m3u8"
    );
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
      const availableQualities = hls.levels.map((item) => item.height);
      defaultOptions = {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "fullscreen",
        ],
        quality: {
          default: "1080p",
          options: ["1080p", "720p", "480p", "360p"],
          forced: true,
          onChange: (e) => updateQuality(e),
        },
        count: {
          onEnter: () => {
            count++;
            updatePlayCount();
          },
        },
      };
      const player = new Plyr(video, defaultOptions);
    });
    hls.attachMedia(video);
    window.hls = hls;
  }

  function updatePlayCount() {
    const playCount = document.getElementById("play-count");
    playCount.innerText = count;
  }

  function updateQuality(newQuality) {
    window.hls.levels.forEach((level, index) => {
      if (level.height === newQuality) {
        window.hls.currentLevel = index;
      }
    });
  }

  video.addEventListener("pause", () => {
    clearInterval(playInterval);
    playInterval = null;
  });

  video.addEventListener("play", () => {
    if (!playInterval) {
      playInterval = setInterval(() => {
        count++;
        updatePlayCount();
      }, 1000);
    }
  });
  video.addEventListener("progress", () => {
    updateBufferSize();
  });

  video.addEventListener("timeupdate", () => {
    updateBufferSize();
  });
  function updateBufferSize() {
    const bufferSizeElement = document.getElementById("buffer-size");
    const video = document.getElementById("video");
    const buffered = video.buffered;
    if (buffered.length > 0) {
      const end = buffered.end(buffered.length - 1);
      const size = Math.round(end * 100) / 100;
      bufferSizeElement.innerText = `Размер буффера: ${size} `;
    } else {
      bufferSizeElement.innerText = "";
    }
  }
});
