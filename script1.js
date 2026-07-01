/* ==========================================================
   PROFESSIONAL MUSIC PLAYER
   PART 3A - Core Player
========================================================== */

// =====================
// Elements
// =====================

const audio = document.getElementById("audio");

const upload = document.getElementById("songUpload");

const playlist = document.getElementById("playlist");

const title = document.getElementById("title");

const artist = document.getElementById("artist");

const progress = document.getElementById("progress");

const volume = document.getElementById("volume");

const current = document.getElementById("current");

const duration = document.getElementById("duration");

const playBtn = document.getElementById("play");

const prevBtn = document.getElementById("prev");

const nextBtn = document.getElementById("next");

const shuffleBtn = document.getElementById("shuffle");

const repeatBtn = document.getElementById("repeat");

const songCount = document.getElementById("songCount");

const equalizer = document.getElementById("equalizer");

// =====================
// Variables
// =====================

let songs = [];

let currentSong = 0;

let isPlaying = false;

let shuffle = false;

let repeat = false;


// =====================
// Supported Formats
// =====================

const supported = [

"mp3",

"wav",

"flac"

];

// =====================
// Upload Songs
// =====================

upload.addEventListener("change", function () {

    console.log("Upload event fired");
    console.log(this.files);

    songs = [];

    playlist.innerHTML = "";

    const files = [...this.files];

    console.log(files);

    files.forEach(file => {

        console.log("File Name:", file.name);
        console.log("File Type:", file.type);

        const ext = file.name.split(".").pop().toLowerCase();

        if (!supported.includes(ext)) {
            alert(file.name + " is not supported.");
            return;
        }

        songs.push({
            name: file.name.replace(/\.[^/.]+$/, ""),
            artist: ext.toUpperCase() + " Audio",
            file: file,
            url: URL.createObjectURL(file)
        });

    });

    songCount.innerText = songs.length + " Songs";

    createPlaylist();

    if (songs.length > 0) {
        currentSong = 0;
        loadSong(currentSong);
        playSong();
    }

});

// =====================
// Playlist
// =====================

function createPlaylist(){

playlist.innerHTML="";

songs.forEach((song,index)=>{

const li=document.createElement("li");

li.innerHTML=`

<i class="fa-solid fa-music"></i>

<span style="margin-left:12px;">${song.name}</span>

`;

li.onclick=function(){

currentSong=index;

loadSong(currentSong);

playSong();

};

playlist.appendChild(li);

});

highlightSong();

}

// =====================
// Highlight Current Song
// =====================

function highlightSong(){

const items=document.querySelectorAll("#playlist li");

items.forEach(item=>item.classList.remove("activeSong"));

if(items[currentSong])

items[currentSong].classList.add("activeSong");

}

// =====================
// Load Song
// =====================

function loadSong(index) {

    if (songs.length === 0) return;

    audio.pause();

    audio.src = songs[index].url;

    audio.load();

    title.innerText = songs[index].name;

    artist.innerText = songs[index].artist;

    progress.value = 0;

    current.innerText = "0:00";

    highlightSong();

}

// =====================
// Play
// =====================

async function playSong() {

    if (songs.length === 0) return;

    try {

        await audio.play();

        isPlaying = true;

        playBtn.querySelector("i").className =
"fa-solid fa-pause";

        equalizer.style.visibility = "visible";

    } catch (err) {

        console.error(err);

        alert("Unable to play the selected song.");

    }
}


// =====================
// Pause
// =====================

function pauseSong(){

audio.pause();

isPlaying=false;

playBtn.querySelector("i").className =
"fa-solid fa-play";

equalizer.style.visibility="hidden";

}

// =====================
// Play Button
// =====================

playBtn.addEventListener("click",()=>{

if(songs.length===0){

alert("Upload songs first.");

return;

}

if(isPlaying){

pauseSong();

}else{

playSong();

}

});

// =====================
// Previous
// =====================

prevBtn.addEventListener("click",()=>{

if(songs.length===0) return;

currentSong--;

if(currentSong<0)

currentSong=songs.length-1;

loadSong(currentSong);

playSong();

});

// =====================
// Next
// =====================

nextBtn.addEventListener("click",()=>{

if(songs.length===0) return;

currentSong++;

if(currentSong>=songs.length)

currentSong=0;

loadSong(currentSong);

playSong();

});

// =====================
// Initial State
// =====================

equalizer.style.visibility="hidden";

volume.value=1;

audio.volume=1;
/* ==========================================================
   PART 3B-1
   Progress Bar
   Volume
   Duration
   Auto Next
==========================================================*/

// ======================
// Format Time
// ======================

function formatTime(seconds){

    if(isNaN(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60);

    return mins + ":" + (secs < 10 ? "0" : "") + secs;

}


// ======================
// Audio Loaded
// ======================

audio.addEventListener("loadedmetadata",()=>{

    duration.innerText = formatTime(audio.duration);

    current.innerText = "0:00";

    progress.value = 0;

});


// ======================
// Update Progress
// ======================

audio.addEventListener("timeupdate",()=>{

    if(!audio.duration) return;

    const percent =

        (audio.currentTime / audio.duration) * 100;

    progress.value = percent;

    current.innerText =

        formatTime(audio.currentTime);

    duration.innerText =

        formatTime(audio.duration);

});


// ======================
// Seek Song
// ======================

progress.addEventListener("input",()=>{

    if(!audio.duration) return;

    audio.currentTime =

        (progress.value / 100) *

        audio.duration;

});


// ======================
// Volume Control
// ======================

volume.addEventListener("input",()=>{

    audio.volume = volume.value;

});


// ======================
// Double Click Volume
// Reset to 100%
// ======================

volume.addEventListener("dblclick",()=>{

    volume.value = 1;

    audio.volume = 1;

});


// ======================
// Auto Next Song
// ======================



// ======================
// Click Progress Section
// ======================

progress.addEventListener("change",()=>{

    if(audio.duration){

        audio.currentTime =

        (progress.value/100)*audio.duration;

    }

});


// ======================
// Pause if Window Hidden
// ======================



// ======================
// Prevent Dragging Audio
// ======================

audio.setAttribute(

"controlsList",

"nodownload"

);


// ======================
// Smooth Audio Fade In
// ======================

audio.addEventListener(

"play",

()=>{

audio.volume=0;

let fade=setInterval(()=>{

if(audio.volume<volume.value){

audio.volume=

Math.min(

audio.volume+0.05,

Number(volume.value)

);

}else{

clearInterval(fade);

}

},60);

}

);


// ======================
// Smooth Audio Fade Out
// ======================

function smoothPause(){

let fade=setInterval(()=>{

if(audio.volume>0.05){

audio.volume-=0.05;

}

else{

clearInterval(fade);

pauseSong();

audio.volume=volume.value;

}

},40);

}
/* ==========================================================
   PART 3B-2
   Shuffle
   Repeat
   Keyboard Shortcuts
   Local Storage
   Equalizer Animation
==========================================================*/


// ======================
// SHUFFLE
// ======================

shuffleBtn.addEventListener("click",()=>{

    shuffle = !shuffle;

    if(shuffle){

        shuffleBtn.style.background="#E91E63";
        shuffleBtn.style.color="white";

    }else{

        shuffleBtn.style.background="";
        shuffleBtn.style.color="";

    }

});


// ======================
// REPEAT
// ======================

repeatBtn.addEventListener("click",()=>{

    repeat = !repeat;

    if(repeat){

        repeatBtn.style.background="#00C853";
        repeatBtn.style.color="white";

    }else{

        repeatBtn.style.background="";
        repeatBtn.style.color="";

    }

});


// ======================
// NEXT SONG LOGIC
// ======================


audio.addEventListener("ended",()=>{

    if(repeat){

        audio.currentTime=0;

        playSong();

        return;

    }

    if(shuffle){

        currentSong=Math.floor(

            Math.random()*songs.length

        );

    }else{

        currentSong++;

        if(currentSong>=songs.length)

            currentSong=0;

    }

    loadSong(currentSong);

    playSong();

});


// ======================
// SAVE VOLUME
// ======================

volume.addEventListener("change",()=>{

    localStorage.setItem(

        "musicVolume",

        volume.value

    );

});


// ======================
// LOAD VOLUME
// ======================

window.addEventListener("load",()=>{

    loadSettings();

    const saved = localStorage.getItem("musicVolume");

    if(saved){

        volume.value = saved;

        audio.volume = saved;

    }

});

// ======================
// SAVE LAST SONG
// ======================

function saveCurrentSong(){

    localStorage.setItem(

        "lastSong",

        currentSong

    );

}


// ======================
// LOAD LAST SONG
// ======================

window.addEventListener("load",()=>{

    const last=

    localStorage.getItem("lastSong");

    if(last!==null){

        currentSong=parseInt(last);

    }

});


// ======================
// SAVE WHEN SONG CHANGES
// ======================

audio.addEventListener(

"play",

saveCurrentSong

);


// ======================
// KEYBOARD SHORTCUTS
// ======================

document.addEventListener(

"keydown",

function(e){

if(e.target.tagName==="INPUT")

return;

switch(e.code){

case "Space":

e.preventDefault();

if(isPlaying){

pauseSong();

}else{

playSong();

}

break;

case "ArrowRight":

nextBtn.click();

break;

case "ArrowLeft":

prevBtn.click();

break;

case "ArrowUp":

e.preventDefault();

audio.volume=Math.min(

1,

audio.volume+0.1

);

volume.value=audio.volume;

break;

case "ArrowDown":

e.preventDefault();

audio.volume=Math.max(

0,

audio.volume-0.1

);

volume.value=audio.volume;

break;

}

}

);


// ======================
// EQUALIZER ANIMATION
// ======================

function startEqualizer(){

equalizer.style.opacity="1";

equalizer.style.transform="scale(1)";

}


function stopEqualizer(){

equalizer.style.opacity=".3";

equalizer.style.transform="scale(.8)";

}


audio.addEventListener(

"play",

startEqualizer

);

audio.addEventListener(

"pause",

stopEqualizer

);

audio.addEventListener(

"ended",

stopEqualizer

);


// ======================
// BUTTON ANIMATION
// ======================

document.querySelectorAll(

".controls button"

).forEach(btn=>{

btn.addEventListener("click",()=>{

btn.animate(

[

{

transform:"scale(.9)"

},

{

transform:"scale(1.15)"

},

{

transform:"scale(1)"

}

],

{

duration:220

}

);

});

});


// ======================
// ERROR HANDLING
// ======================

audio.addEventListener(

"error",

()=>{

alert(

"Unable to play this audio file."

);

});


// ======================
// PLAYLIST DOUBLE CLICK
// ======================

playlist.addEventListener(

"dblclick",

function(e){

const items=[

...playlist.children

];

const index=items.indexOf(

e.target.closest("li")

);

if(index>=0){

currentSong=index;

loadSong(index);

playSong();

}

});


// ======================
// DRAG OVER EFFECT
// ======================

upload.parentElement.addEventListener(

"dragover",

e=>{

e.preventDefault();

upload.parentElement.style.borderColor="#fff";

});

upload.parentElement.addEventListener(

"dragleave",

()=>{

upload.parentElement.style.borderColor="rgba(255,255,255,.4)";

});


// ======================
// FINISHED LOADING
// ======================

console.log(

"Professional Music Player Ready"

);
