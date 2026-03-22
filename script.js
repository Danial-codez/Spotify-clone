console.log("Lets start JS");

function formatTime(seconds) {
  seconds = Number(seconds);
  seconds = Math.floor(seconds);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

let currentsong = new Audio();

const playmusic = (track, showpause = false) => {
  currentsong.src = "/songs/" + track;  // track must include .mp3
  if (!showpause) {
    currentsong.play();
    pause.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = 
  `<span>${decodeURI(track).replace(".mp3", "")}</span>`;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function getSongs() {
  let response = await fetch("/songs/songs.json");
  let songs = await response.json();
  return songs;
}

async function main() {
  let songs = await getSongs();
  playmusic(songs[0], true);

  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];

  // render sidebar songs
  for (const song of songs) {
    let displayName = song.replace(".mp3", "").replaceAll("%20", " ");
    songUL.innerHTML += `<li data-song="${song}">
      <img class="invert" src="music.svg" alt="music">
      <div class="info">
        <div>${displayName}</div>
        <div>Artist</div>
      </div>
      <img class="invert" src="playbarplay.svg" alt="">
    </li>`;
  }

  // sidebar click
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      playmusic(e.dataset.song);
    });
  });

  // play/pause
  pause.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      pause.src = "pause.svg";
    } else {
      currentsong.pause();
      pause.src = "playbarplay.svg";
    }
  });

  // time update
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${formatTime(currentsong.currentTime)} / ${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // seekbar click
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });

  // card click
 Array.from(document.querySelectorAll(".card")).forEach((card) => {
  card.addEventListener("click", (e) => {
    let clickedCard = e.target.closest(".card");
    let song = clickedCard.dataset.song;
    console.log("playing:", song); // check this
    if (song) {
      playmusic(song);
    }
  });
});
  // next
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/songs/")[1]);
    if (index + 1 < songs.length) {
      playmusic(songs[index + 1]);
    }
  });

  // prev
  prev.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/songs/")[1]);
    if (index - 1 >= 0) {
      playmusic(songs[index - 1]);
    }
  });
}

main();