let recipesData = [];
const recipeList = document.getElementById('recipeList');
const recipeDetail = document.getElementById('recipeDetail');
const recipeTitle = document.getElementById('recipeTitle');
const recipeImage = document.getElementById('recipeImage');
const ingredientsList = document.getElementById('ingredientsList');
const stepsAccordion = document.getElementById('stepsAccordion');
const alarmSound = document.getElementById('alarmSound');

fetch('recipes.json')
  .then(response => response.json())
  .then(data => {
    recipesData = data.recipes;
    displayRecipeList(recipesData);
  })
  .catch(err => console.error('Error loading recipes:', err));

function displayRecipeList(recipes) {
  recipeList.innerHTML = ''; // clear if re-rendering
  recipes.forEach(recipe => {
    // Create a Bootstrap card for each
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-4 mb-4';
    
    colDiv.innerHTML = `
      <div class="card h-100">
        <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${recipe.title}</h5>
          <p class="card-text">
            A short description or excerpt...
          </p>
          <button class="btn btn-primary mt-auto" onclick="showRecipeDetail('${recipe.id}')">
            View Recipe
          </button>
        </div>
      </div>
    `;
    recipeList.appendChild(colDiv);
  });
}

function showRecipeDetail(recipeId) {
  // Find the recipe object
  const recipe = recipesData.find(r => r.id === recipeId);
  if (!recipe) return;

  // Hide the recipe list and show the detail section
  recipeList.style.display = 'none';
  recipeDetail.style.display = 'block';

  // Populate detail fields
  recipeTitle.textContent = recipe.title;
  recipeImage.src = recipe.image;
  recipeImage.alt = recipe.title;
  
  // Ingredients
  ingredientsList.innerHTML = '';
  recipe.ingredients.forEach(ing => {
    const li = document.createElement('li');
    li.textContent = ing;
    ingredientsList.appendChild(li);
  });

  // Steps
  stepsAccordion.innerHTML = '';
  recipe.steps.forEach((step, index) => {
    const stepId = `collapseStep${index}`;
    const headingId = `headingStep${index}`;
    const time = step.time || 0; // in seconds

    stepsAccordion.innerHTML += `
      <div class="accordion-item">
        <h2 class="accordion-header" id="${headingId}">
          <button 
            class="accordion-button collapsed" 
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#${stepId}"
            aria-expanded="false"
            aria-controls="${stepId}"
          >
            Step ${index + 1}: ${step.description} (${Math.floor(time/60)} min)
          </button>
        </h2>
        <div 
          id="${stepId}" 
          class="accordion-collapse collapse"
          aria-labelledby="${headingId}"
          data-bs-parent="#stepsAccordion"
        >
          <div class="accordion-body">
            <div class="d-flex align-items-center">
              <button 
                class="btn btn-sm btn-primary me-2"
                onclick="startTimer(${time}, 'timerDisplay-${index}')"
              >
                Start Timer
              </button>
              <span id="timerDisplay-${index}"></span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function goBack() {
  recipeDetail.style.display = 'none';
  recipeList.style.display = 'flex'; // or 'block'
}

// Simple timer function (shared)
function startTimer(duration, displayId) {
  const display = document.getElementById(displayId);
  if (!display) return;

  let timeLeft = duration;
  display.textContent = formatTime(timeLeft);

  const intervalId = setInterval(() => {
    timeLeft--;
    display.textContent = formatTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(intervalId);
      display.textContent = "Time's up!";
      alarmSound.play().catch(err => {
        console.warn("Audio playback failed:", err);
      });
    }
  }, 1000);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

