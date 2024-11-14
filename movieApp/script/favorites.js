let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const favoriteList = document.querySelector(".grid-layout")

function getRecipeById(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits`;
    return fetch(url).then(res => res.json());
}

