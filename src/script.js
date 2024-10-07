document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("#menu li");
  let currentIndex = 0;
  let gameInterval;

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

  // Function to create and display the Snake game
  function showSnakeGame() {
    closeExistingPopups(); // Close any existing popup first

    const popup = document.createElement("div");
    popup.id = "game-popup";

    popup.innerHTML = `
      <div class="popup-content">
        <h2>Snake Game</h2>
        <canvas id="snake-game-canvas" width="300" height="300"></canvas>
        <p>Score: <span id="current-score">0</span></p>
        <p id="game-over-message" style="display:none;">Game Over! Final Score: <span id="final-score"></span></p>
        <button id="reset-game">Reset Game</button>
        <button id="close-popup">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    const canvas = document.getElementById("snake-game-canvas");
    const ctx = canvas.getContext("2d");
    let score = 0;
    let snake, direction, food;

    // Function to initialize or reset the game
    function initializeGame() {
      document.getElementById("game-over-message").style.display = "none"; // Hide Game Over message
      snake = [{ x: 150, y: 150 }];
      direction = { x: 10, y: 0 }; // Snake starts moving to the right
      food = getRandomFoodPosition();
      score = 0;
      document.getElementById("current-score").textContent = score;
      clearInterval(gameInterval);
      gameInterval = setInterval(gameLoop, 100); // Restart the game loop
    }

    // Start the game for the first time
    initializeGame();

    // Function to get a random food position
    function getRandomFoodPosition() {
      return {
        x: Math.floor(Math.random() * (canvas.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas.height / 10)) * 10,
      };
    }

    // Game loop: updates the game state
    function gameLoop() {
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };

      // Check for collisions with walls or itself
      if (
        newHead.x < 0 ||
        newHead.y < 0 ||
        newHead.x >= canvas.width ||
        newHead.y >= canvas.height ||
        snake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        clearInterval(gameInterval); // End the game
        endGame();
        return;
      }

      snake.unshift(newHead); // Add new head to the snake

      // Check if snake eats the food
      if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        document.getElementById("current-score").textContent = score; // Update score display
        food = getRandomFoodPosition(); // Generate new food position
      } else {
        snake.pop(); // Remove the tail if no food is eaten
      }

      // Clear canvas and redraw the snake and food
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "lime";
      snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, 10, 10);
      });

      // Draw the food
      ctx.fillStyle = "red";
      ctx.fillRect(food.x, food.y, 10, 10);
    }

    // Function to handle the end of the game
    function endGame() {
      document.getElementById("game-over-message").style.display = "block"; // Show Game Over message
      document.getElementById("final-score").textContent = score; // Show final score
    }

    // Handle keyboard input for controlling the snake
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          if (direction.y === 0) direction = { x: 0, y: -10 };
          break;
        case "ArrowDown":
        case "s":
          if (direction.y === 0) direction = { x: 0, y: 10 };
          break;
        case "ArrowLeft":
        case "a":
          if (direction.x === 0) direction = { x: -10, y: 0 };
          break;
        case "ArrowRight":
        case "d":
          if (direction.x === 0) direction = { x: 10, y: 0 };
          break;
      }
    });

    // Reset button functionality
    document.getElementById("reset-game").addEventListener("click", () => {
      initializeGame(); // Reset the game when the button is clicked
    });

    // Close popup functionality
    const closePopupButton = document.getElementById("close-popup");
    closePopupButton.addEventListener("click", () => {
      document.body.removeChild(popup);
      clearInterval(gameInterval); // Stop the game loop when closing the popup
    });
  }

  // Function to close any existing popups
  function closeExistingPopups() {
    const existingPopup = document.querySelector("#game-popup, #music-popup");
    if (existingPopup) {
      document.body.removeChild(existingPopup);
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
        showSnakeGame(); // Show Snake game if "Memory" is selected
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

    // Add click event to "Memory" for opening the Snake game
    if (item.textContent === "Memory") {
      item.addEventListener("click", showSnakeGame);
    }
  });

  // Initial highlight
  highlightMenuItem(currentIndex);
});
