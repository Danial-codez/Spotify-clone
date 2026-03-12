console.log("Lets start JS");

function formatTime(seconds) {
  // Ensure it's a valid number
  seconds = Number(seconds);

  // Convert to whole seconds (removes decimals like 20.7483)
  seconds = Math.floor(seconds);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
}

let currentsong = new Audio();

const playmusic = (track, showpause = false) => {
  currentsong.src = "/songs/" + track;
  if (!showpause) {
    currentsong.play();
    pause.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

async function main() {
  let songs = await getSongs();
  playmusic(songs[0], true);
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML += `<li>
                <img class="invert" src="music.svg" alt="music">
                  <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div>Dani</div>
                  </div>
                <img class="invert" src="playbarplay.svg" alt="">
               </li>`;
  }

  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li"),
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  pause.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      pause.src = "pause.svg";
    } else {
      currentsong.pause();
      pause.src = "playbarplay.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${formatTime(currentsong.currentTime)}:${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
}

main();
