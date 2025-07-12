console.log('Welcome to Spotify');

// Initialize the variables
let songIndex = 0;
let audioElement = new Audio('mmqh.mp3');
let masterPlay = document.getElementById('masterplay');
let myProgressbar = document.getElementById('myProgressbar');
let masterSongName = document.getElementById('masterSongName');
let gif = document.getElementById('gif');
let songitems = Array.from(document.getElementsByClassName('songitem'))
let songs = [
    { songName: "Mere Mehboob Qayamat Hogi", filePath: "mmqh.mp3", coverPath: "image.png" },
    { songName: "Dukhi mann", filePath: "1.mp3", coverPath: "image copy 3.png" },
    { songName: "Panna ki Tamanna hai", filePath: "2.mp3", coverPath: "image copy.png" },
    { songName: "Mere sapno ki rani kab ayegi tu", filePath: "3.mp3", coverPath: "image copy 5.png" },
    { songName: "zindagi kaise hai paheli", filePath: "4.mp3", coverPath: "image copy 6.png" },
    { songName: "Jab dard nahi tha seene mai", filePath: "5.mp3", coverPath: "image copy 7.png" },
    { songName: "Jai Jai shiv shankar", filePath: "6.mp3", coverPath: "image copy 8.png" },
    { songName: "Ghungroo ki tarah bajta hi raha hoon", filePath: "7.mp3", coverPath: "image copy 9.png" },
    { songName: "samjhota gamo say karlo", filePath: "8.mp3", coverPath: "image copy 12.png" },
    { songName: "aate jaate khoobsurat aawara sadko pe", filePath: "9.mp3", coverPath: "image copy 11.png" }
];

songitems.forEach((element,i)=>{
element.getElementsByTagName("img")[0].src = songs[i].coverPath;
element.getElementsByClassName("songname")[0].innerText = songs[i].songName;

})

// Play/Pause click handler
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove("fa-play");
        masterPlay.classList.add("fa-pause");
     gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove("fa-pause");
        masterPlay.classList.add("fa-play");
gif.style.opacity = 0;
    }
});
// listen to the events 
audioElement.addEventListener('timeupdate',() => {
    progress = parseInt((audioElement.currentTime/audioElement.duration)*100);
    myProgressbar.value = progress;
}
)
myProgressbar.addEventListener('change', () =>{
    audioElement.currentTime = myProgressbar.value * audioElement.duration/100;
}
)
const makeAllPlays = ()=>{
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
        element.classList.remove('fa-pause-circle')
  element.classList.add('fa-play-circle')
  
})
}



Array.from(document.getElementsByClassName('songItemPlay')).forEach((element)=>{
element.addEventListener('click',(e)=>{
    makeAllPlays();
    let index = parseInt(e.target.id);
    songIndex = index;
    e.target.classList.remove('fa-play-circle')
    e.target.classList.add('fa-pause-circle')
    audioElement.src = songs[songIndex].filePath;
masterSongName.innerText= songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    gif.style.opacity = 1;
    masterPlay.classList.remove('fa-play')
  masterPlay.classList.add('fa-pause')
  
})
})

document.getElementById('next').addEventListener('click', ()=>{
    songIndex = (songIndex + 1) % songs.length;
     audioElement.src = songs[songIndex].filePath;;
masterSongName.innerText= songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle')
  masterPlay.classList.add('fa-pause-circle')
})
document.getElementById('previous').addEventListener('click', ()=>{
    songIndex = (songIndex - 1 + songs.length) % songs.length;
     audioElement.src = songs[songIndex].filePath;;
masterSongName.innerText= songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle')
  masterPlay.classList.add('fa-pause-circle')
}
)