document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll("#menu li");
  let currentIndex = 0;

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
        <button id="close-popup">Close</button>
      </div>
    `;
    document.body.appendChild(popup);

    // Close popup functionality
    const closePopupButton = document.getElementById("close-popup");
    closePopupButton.addEventListener("click", () => {
      document.body.removeChild(popup);
      clearInterval(gameInterval); // Stop the game loop when closing the popup
    });

    // Snake game code
    const canvas = document.getElementById("snake-game-canvas");
    const ctx = canvas.getContext("2d");

    const gridSize = 10; // Size of each grid block
    let snake = [{ x: 150, y: 150 }]; // Initial position of the snake
    let direction = { x: gridSize, y: 0 }; // Moving to the right initially
    let food = getRandomFoodPosition();
    let score = 0;
    let gameInterval = setInterval(gameLoop, 100); // Refresh rate of the game

    // Function to get a random food position
    function getRandomFoodPosition() {
      return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize,
      };
    }

    // Game loop: updates the game state
    function gameLoop() {
      // Move the snake by adding a new head in the current direction
      const newHead = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
      };

      // Check for collisions with the walls or itself
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
        alert(`Game Over! Your score was ${score}`);
        return;
      }

      snake.unshift(newHead); // Add new head to the snake

      // Check if snake has eaten the food
      if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        food = getRandomFoodPosition(); // Place new food
      } else {
        snake.pop(); // Remove the tail if no food is eaten
      }

      // Clear canvas and redraw snake and food
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "lime";
      snake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
      });

      // Draw the food
      ctx.fillStyle = "red";
      ctx.fillRect(food.x, food.y, gridSize, gridSize);
    }

    // Handle keyboard input for controlling the snake
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowUp":
        case "w":
          if (direction.y === 0) direction = { x: 0, y: -gridSize };
          break;
        case "ArrowDown":
        case "s":
          if (direction.y === 0) direction = { x: 0, y: gridSize };
          break;
        case "ArrowLeft":
        case "a":
          if (direction.x === 0) direction = { x: -gridSize, y: 0 };
          break;
        case "ArrowRight":
        case "d":
          if (direction.x === 0) direction = { x: gridSize, y: 0 };
          break;
      }
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
