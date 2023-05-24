document.addEventListener("DOMContentLoaded", function (event) {
  const playBtn = document.querySelector(".play-btn");
  const pauseBtn = document.querySelector(".pause-btn");
  const videoContainer = document.querySelector(".video-container");
  const video = document.querySelector("video");
  const playVideo = document.getElementById("play-video");
  const theaterVideo = document.getElementById("play-theater");
  const fullScreenVideo = document.getElementById("play-full-screen");
  const miniPlayerButton = document.querySelector(".mini-player");
  const mutedButton = document.querySelector(".volume-muted-icon");
  const highVolumeButton = document.querySelector(".volume-high-icon");
  const volumeSlider = document.querySelector(".volume-slider");
  const currentTime = document.querySelector(".current-time");
  const totalTime = document.querySelector(".total-time");
  const speedBtn = document.querySelector(".speed");
  const timelineContainer = document.querySelector(".timeline-container");

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

  //start
  timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
  timelineContainer.addEventListener("mousedown", toggleScrubbing);
  document.addEventListener("mouseup", (e) => {
    if (isScrubbing) toggleScrubbing(e);
  });
  document.addEventListener("mousemove", (e) => {
    if (isScrubbing) handleTimelineUpdate(e);
  });

  let isScrubbing = false;
  let wasPaused;
  function toggleScrubbing(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.classList.toggle("scrubbing", isScrubbing);
    if (isScrubbing) {
      wasPaused = video.paused;
      video.pause();
    } else {
      video.currentTime = percent * video.duration;
      if (!wasPaused) video.play();
    }

    handleTimelineUpdate(e);
  }

  function handleTimelineUpdate(e) {
    const rect = timelineContainer.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

    timelineContainer.style.setProperty("--preview-position", percent);

    if (isScrubbing) {
      e.preventDefault();

      timelineContainer.style.setProperty("--progress-position", percent);
    }
  }

  //end
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

  speedBtn.addEventListener("click", () => {
    let newPlaybackRate = video.playbackRate + 0.25;
    if (newPlaybackRate > 2) newPlaybackRate = 0.25;
    video.playbackRate = newPlaybackRate;
    speedBtn.textContent = `x${newPlaybackRate}`;
  });
  video.playbackRate;

  video.addEventListener("loadeddata", () => {
    totalTime.textContent = `/${formatDuration(video.duration)}`;
  });

  video.addEventListener("timeupdate", () => {
    currentTime.textContent = formatDuration(video.currentTime);
  });

  function toggleMiniPlayer() {
    if (videoContainer.classList.contains("mini-player")) {
      document.exitPictureInPicture();
    } else {
      video.requestPictureInPicture();
    }
  }

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

  volumeSlider.addEventListener("input", (e) => {
    console.log(e.target.value);
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

  document.addEventListener("keydown", (event) => {
    switch (event.keyCode) {
      case 32:
        toggleVideo();
        break;
    }
  });
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
