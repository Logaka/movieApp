const BASE_URL = 'https://api.spoonacular.com/recipes';
const apiKey = '?apiKey=280e51968be54bae9621e43e70c09680';

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const searchBtn = document.querySelector('.container__search-icon');
const searchInput = document.querySelector('.search');
const receiptList = document.querySelector('.flex-wrap');
const navItems = document.querySelectorAll('.nav-item');
const favoritesPageBtn = document.querySelector(".container__like-icon")

getMealReceipts('');

/*  to go certain recipe  */
if (receiptList) {
    receiptList.addEventListener('click', (event) => {
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
            window.location.href = `html/detailPage.html?recipeId=${recipeId}`;
        }
    });
}

/* to go favorites page  */
if (favoritesPageBtn)
    favoritesPageBtn.addEventListener("click", openFavoritesPage)

function openFavoritesPage() {
    window.location.href = `html/favoritesPage.html`
}


// add or delete the favorite
function toggleFavorite(recipeId){
    if (favorites.includes(recipeId))
        favorites = favorites.filter(id => id !== recipeId)
    else
        favorites.push(recipeId)

    localStorage.setItem("favorites", JSON.stringify(favorites))
}

// updating fav icon
function updateFavIcon(recipeId, button){
    const img = button.querySelector('img')
    console.log(img)
    if (favorites.includes(recipeId)) {
        img.src = `images/favorite-icon-filled.svg`
    } else {
        img.src = `images/like-icon.svg`
    }
}


/* to find something */
if (searchBtn)
    searchBtn.addEventListener('click', getMealReceipts);

if (searchInput) {
    searchInput.addEventListener('keypress', event => {
        if (event.key === 'Enter')
            getMealReceipts(searchInput.value);
    });
}

function getMealReceipts(searchInputTxt) {
    const url = BASE_URL + '/complexSearch' + apiKey +
        `&query=${searchInputTxt}`;
    fetch(url).then(res => res.json()).then(data => {
        let html = '';

        if (data.results) {
            data.results.forEach(result => {
                html += `
                        <label class="recipe-card flex" data-id="${result.id}">
                            <button class="favorite" data-id="${result.id}">
                                <div class="container__like-icon flex align-center">
                                        <img src="" alt="like icon">
                                </div>
                            </button>
                            <img class="recipe-card__image" src="${result.image}" alt="recipe image">
                            <div class="padding-5">
                                <div class="flex space-between">
                                    <h3 class="recipe-card__title">${result.title}</h3>
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
            });
        }
        receiptList.innerHTML = html;

        const buttons = document.querySelectorAll('.favorite');
        buttons.forEach(button => {
            const recipeId = button.getAttribute('data-id');
            updateFavIcon(recipeId, button);
        });
    });
}

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        getMealReceipts(category);
    });
});