document.addEventListener("DOMContentLoaded", function (event) {
  const playBtn = document.querySelector(".play-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const videoContainer = document.querySelector(".video-container");
  const video = document.querySelector("video");
  const playVideo = document.getElementById("play-video");
  const theaterVideo = document.getElementById("play-theater");
  const fullScreenVideo = document.getElementById("play-full-screen");
  const miniPlayerButton = document.querySelector(".mini-player");
  const volumeSlider = document.querySelector(".volume-slider");
  const currentTime = document.querySelector(".current-time");
  const totalTime = document.querySelector(".total-time");
  const speedBtn = document.querySelector(".speed");
  const videoSlider = document.querySelector(".video-slider");
  const timeChecker = document.querySelector("#current-time_checker");
  const bufferChecker = document.querySelector("#current-buffer_checker");

  function toggleVideo() {
    if (videoContainer.classList.contains("paused")) {
      videoContainer.classList.remove("paused");
      video.play();
      pauseBtn.style.display = "block";
      playBtn.style.display = "none";
    } else {
      videoContainer.classList.add("paused");
      video.pause();
      pauseBtn.style.display = "none";
      playBtn.style.display = "block";
    }
  }

  document.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
      case 32:
        toggleVideo();
        break;
      case 84:
        toggleVideoStyles(
          videoContainer,
          "theater",
          document.querySelector(".theater-off"),
          document.querySelector(".theater-on")
        );
        break;
      case 73:
        toggleMiniPlayer();
        break;
      case 70:
        toggleVideoStyles(
          videoContainer,
          "full-screen",
          document.querySelector(".full-screen-off"),
          document.querySelector(".full-screen-on")
        );
        break;
    }
  });

  //подключение hls
  const hls = new Hls();
  if (Hls.isSupported()) {
    hls.loadSource(
      "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"
    );

    hls.attachMedia(video);
    window.hls = hls;
  }
  //

  //видео слайдер
  video.ontimeupdate = progressUpdate;

  function progressUpdate() {
    videoSlider.addEventListener("click", videoControl);
    let current = (video.currentTime * 100) / video.duration;
    video.bu;
    timeChecker.textContent = `Текущее время: ${video.currentTime.toFixed(
      2
    )} секунд`;
    videoSlider.value = current;
  }

  video.addEventListener("progress", function () {
    var buffered = video.buffered;
    if (buffered.length > 0) {
      var bufferedSize = buffered.end(buffered.length - 1).toFixed(2);
      bufferChecker.innerHTML = `Размер буффера:  ${bufferedSize}`;
    }
  });

  function videoControl(event) {
    let w = this.offsetWidth;
    let o = event.offsetX;
    this.value = (100 * o) / w;

    video.currentTime = video.duration * (o / w);
  }
  //

  // форматы видео
  theaterVideo.addEventListener("click", () => {
    toggleVideoStyles(
      videoContainer,
      "theater",
      document.querySelector(".theater-off"),
      document.querySelector(".theater-on")
    );
  });

  fullScreenVideo.addEventListener("click", () => {
    toggleVideoStyles(
      videoContainer,
      "full-screen",
      document.querySelector(".full-screen-off"),
      document.querySelector(".full-screen-on")
    );
  });

  function toggleMiniPlayer() {
    if (videoContainer.classList.contains("mini-player")) {
      document.exitPictureInPicture();
    } else {
      video.requestPictureInPicture();
    }
  }

  //

  //Скорость видео

  speedBtn.addEventListener("click", () => {
    let newPlaybackRate = video.playbackRate + 0.25;
    if (newPlaybackRate > 2) newPlaybackRate = 0.25;
    video.playbackRate = newPlaybackRate;
    speedBtn.textContent = `x${newPlaybackRate}`;
  });

  //

  // Длительность и текущий момент видео

  video.addEventListener("loadeddata", () => {
    totalTime.textContent = `/${formatDuration(video.duration)}`;
  });

  video.addEventListener("timeupdate", () => {
    currentTime.textContent = formatDuration(video.currentTime);
  });

  function formatDuration(time) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);
    const formatedSeconds = seconds > 9 ? seconds : `0${seconds}`;

    if (hours === 0) {
      return `${minutes}:${formatedSeconds}`;
    }
    return `${hours}:${minutes}:${formatedSeconds}`;
  }

  //

  //переключатель громкости

  volumeSlider.addEventListener("input", (e) => {
    video.volume = e.target.value;
    video.muted = e.target.value === 0;
  });

  video.addEventListener("volumechange", () => {
    volumeSlider.value = video.volume;
    let volumeLevel;
    if (video.muted || video.volume === 0) {
      volumeLevel = "muted";
    } else if (video.volume > 0 && video.volume < 0.5) {
      volumeLevel = "low";
    } else {
      volumeLevel = "high";
    }

    videoContainer.dataset.volumeLevel = volumeLevel;
  });
  //

  miniPlayerButton.addEventListener("click", toggleMiniPlayer);
  document.addEventListener("fullscreenchange", () => {
    videoContainer.classList.toggle("full-screen"), document.fullscreenElement;
  });
  video.addEventListener("enterpictureinpicture", () => {
    videoContainer.classList.add("mini-player");
  });
  video.addEventListener("leavepictureinpicture", () => {
    videoContainer.classList.remove("mini-player");
  });

  video.addEventListener("click", toggleVideo);
  playVideo.addEventListener("click", toggleVideo);

  toggleVideo();

  function toggleVideoStyles(videoElement, classValue, value1, value2) {
    if (videoElement.classList.contains(classValue)) {
      videoContainer.classList.remove(classValue);
      value1.style.display = "none";
      value2.style.display = "block";
    } else {
      videoElement.classList.add(classValue);
      value1.style.display = "block";
      value2.style.display = "none";
    }
  }
});
