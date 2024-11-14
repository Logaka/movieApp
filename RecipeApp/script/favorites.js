const BASE_URL = 'https://api.spoonacular.com/recipes';
const apiKey = '?apiKey=280e51968be54bae9621e43e70c09680';

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const favoriteList = document.querySelector(".flex-wrap")

function getRecipeById(id) {
    const url = `${BASE_URL}`;
    return fetch(url).then(res => res.json());
}

function getFavorites(){
    favorites.forEach(recipeId => {
        getRecipeById(recipeId).then(recipe => {
            let recipeElement = `
                 <label class="recipe-card flex" data-id="${recipe.id}">
                            <button class="favorite" data-id="${recipe.id}">
                                <div class="container__like-icon flex align-center">
                                        <img src="" alt="like icon">
                                </div>
                            </button>
                            <img class="recipe-card__image" src="${recipe.image}" alt="recipe image">
                            <div class="padding-5">
                                <div class="flex space-between">
                                    <h3 class="recipe-card__title">${recipe.title}</h3>
                                            <div class="flex align-center">
                                                <img src="../images/circle__time.svg" alt="image">
                                                <p class="recipe-card__readyInMinutes">45 min</p>
                                            </div>
                                    </div>
                                    <p class="recipe-card__summary">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                        Adipisci assumenda blanditiis, culpa deleniti facilis impedit iure maxime perspiciatis
                                        placeat
                                        voluptas!
                                    </p>
                            </div>
                        </label>
            `;
            favoriteList.innerHTML += recipeElement;
            const buttons = document.querySelectorAll('.favorite');
            buttons.forEach(button => {
                const recipeId = button.getAttribute('data-id');
                updateFavIcon(recipeId, button);
            });
        }).catch(error => {
            console.error(`Error fetching recipe ${recipeId}:`, error);
        });
    });
}

function updateFavIcon(recipeId, button){
    const img = button.querySelector('img')

    if (favorites.includes(recipeId)) {
        img.src = `/images/favorite-icon-filled.svg`
    } else {
        img.src = `/images/like-icon.svg`
    }
}

if(favoriteList){
    favoriteList.addEventListener('click', (event) => {
        const favoriteBtn = event.target.closest('.favorite');
        const recipeCard = event.target.closest('.recipe-card');

        if (favoriteBtn) {
            const recipeId = favoriteBtn.getAttribute('data-id');
            toggleFavorite(recipeId);
            updateFavIcon(recipeId, favoriteBtn);
            console.log(recipeId)
            console.log(favoriteBtn)
        }

        if (recipeCard && !event.target.closest('.favorite')) {
            const recipeId = recipeCard.getAttribute('data-id');
            console.log('Redirecting to detail page with ID:', recipeId);
            window.location.href = `detailPage.html?recipeId=${recipeId}`;
        }
    });
}

function toggleFavorite(recipeId){
    if (favorites.includes(recipeId))
        favorites = favorites.filter(id => id !== recipeId)
    else
        favorites.push(recipeId)

    localStorage.setItem("favorites", JSON.stringify(favorites))
}

getFavorites()


