document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("#menu li");
  let currentIndex = 0;
  let musicPlaying = false;
  let musicElement;

  // Function to highlight the selected menu item
  function highlightMenuItem(index) {
    menuItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add("selected");
      } else {
        item.classList.remove("selected");
      }
    });
  }

  // Function to create and display the game popup
  function showMemoryGame() {
    closeExistingPopups(); // Close any existing popup first

    const popup = document.createElement("div");
    popup.id = "game-popup";

    popup.innerHTML = `
      <div class="popup-content">
        <h2>Memory Clicker Game</h2>
        <p>Click the button to increase your score!</p>
        <button id="clicker-button">Click me!</button>
        <p>Score: <span id="score">0</span></p>
        <button id="close-popup">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    let score = 0;
    const scoreDisplay = document.getElementById("score");
    const clickerButton = document.getElementById("clicker-button");
    clickerButton.addEventListener("click", () => {
      score++;
      scoreDisplay.textContent = score;
    });

    const closePopupButton = document.getElementById("close-popup");
    closePopupButton.addEventListener("click", () => {
      document.body.removeChild(popup);
    });
  }

  // Function to create and display the music player
  function showMusicPlayer() {
    closeExistingPopups(); // Close any existing popup first

    const popup = document.createElement("div");
    popup.id = "music-popup";

    popup.innerHTML = `
      <div class="popup-content">
        <h2>Music Player</h2>
        <p>Play your favorite tunes!</p>
        <button id="play-music">Play Music</button>
        <button id="pause-music" disabled>Pause Music</button>
        <button id="close-popup">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Create audio element for the music
    musicElement = new Audio("../music/House Of The Rising Sun.mp3"); // Replace with the actual path to your music file

    const playMusicButton = document.getElementById("play-music");
    const pauseMusicButton = document.getElementById("pause-music");

    playMusicButton.addEventListener("click", () => {
      musicElement.play();
      playMusicButton.disabled = true;
      pauseMusicButton.disabled = false;
      musicPlaying = true;
    });

    pauseMusicButton.addEventListener("click", () => {
      musicElement.pause();
      playMusicButton.disabled = false;
      pauseMusicButton.disabled = true;
      musicPlaying = false;
    });

    // Close popup functionality
    const closePopupButton = document.getElementById("close-popup");
    closePopupButton.addEventListener("click", () => {
      if (musicPlaying) {
        musicElement.pause();
        musicPlaying = false;
      }
      document.body.removeChild(popup);
    });
  }

  // Function to close any existing popups
  function closeExistingPopups() {
    const existingPopup = document.querySelector("#game-popup, #music-popup");
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }

    if (musicElement && musicPlaying) {
      musicElement.pause(); // Stop music if it's playing
      musicPlaying = false;
    }
  }

  // Keyboard (Arrow + WASD) navigation
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
      currentIndex = (currentIndex + 1) % menuItems.length;
      highlightMenuItem(currentIndex);
    } else if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
      currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
      highlightMenuItem(currentIndex);
    } else if (event.key === "Enter" || event.key.toLowerCase() === "a") {
      const selectedItem = menuItems[currentIndex].textContent;
      if (selectedItem === "Memory") {
        showMemoryGame(); // Show game popup if "Memory" is selected
      } else if (selectedItem === "Music") {
        showMusicPlayer(); // Show music player if "Music" is selected
      } else {
        console.log(`Selected: ${selectedItem}`);
      }
    } else if (event.key.toLowerCase() === "d") {
      console.log(`D key pressed, no action yet`);
    }
  });

  // Mouse hover event
  menuItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      currentIndex = index;
      highlightMenuItem(currentIndex);
    });

    // Add click event to "Memory" and "Music"
    if (item.textContent === "Memory") {
      item.addEventListener("click", showMemoryGame);
    } else if (item.textContent === "Music") {
      item.addEventListener("click", showMusicPlayer);
    }
  });

  // Initial highlight
  highlightMenuItem(currentIndex);
});
