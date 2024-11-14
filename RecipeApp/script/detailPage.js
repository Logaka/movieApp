const BASE_URL = 'https://api.spoonacular.com/recipes';
const apiKey = '?apiKey=280e51968be54bae9621e43e70c09680';

const params = new URLSearchParams(document.location.search);
const recipeId = params.get('recipeId');
const container = document.querySelector('.container');

function getRecipeById(id) {
    const url = `${BASE_URL}/${id}/information${apiKey}`;
    console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            let html = '';
            if (data) {
                html += `
                <div class="flex flex-direction-column align-center">
                    <h1 class="recipe-title">${data.title}</h1>
                    <img class="recipe-image" src="${data.image}" alt="Recipe Image">
                    <div class="container__recipe-guide flex">
                        <ul class="recipe-ingredients">
                            <h2>Ingredients</h2>
            `;

                data.extendedIngredients.forEach(ingredient => {
                    html += `
                    <li>${ingredient.amount} ${ingredient.unit} of ${ingredient.name} - ${ingredient.original}</li>
                `;
                });

                html += `
                        </ul>
                        <ol class="recipe-instructions">
                            <h2>Instructions</h2>
                            ${data.instructions.split('. ').map(step => `<li>${step.trim()}.</li>`).join('')}
                        </ol>
                    </div>
                    <p class="recipe-summary">${data.summary}</p>
                </div>
            `;
            }
            container.innerHTML = html;
        });
}

getRecipeById(recipeId);