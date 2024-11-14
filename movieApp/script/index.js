const gridContainer = document.querySelector('.grid-layout')
const sortBtn = document.querySelector('.sort__container')
const sortItem = document.querySelectorAll('.sort-item')
const movieDetails = document.querySelector('.movie__details')
const headerContainer = document.querySelector('.header__container')
const castContainer = document.querySelector('.cast__container')
const sortList = document.querySelector('.sort-list')
sortBtn.classList.add('hover-effect')

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


document.addEventListener('DOMContentLoaded', async () => {
    const list = await fetchMovieList(BASE_URL)
    showMovieList(list)
});

async function showMovieList(list) {


    let html = ``
    list.forEach(movie => {
        poster_url = image_BASE_URL + movie.poster_path
        console.log(poster_url)
        html += `
            <div class="card" data-id="${movie.id}">
                <img class="card__img"
                     src="${poster_url}" alt="poster image">
                <div class="card__header">
                    <h3 class="card__title">${movie.title}</h3>
                    <p class="release-date">${movie.release_date}</p>
                </div>
            </div>
            `
    })
    gridContainer.innerHTML = html
}

async function fetchMovieList(url) {
    const res = await fetch(url, options)
    const data = await res.json()

    return data.results
}

if (sortBtn)
    sortBtn.addEventListener('click', openSortBtn)

function openSortBtn() {
    sortList.style.display = 'block'
    sortBtn.classList.remove('hover-effect')
    sortBtn.style.width = '100px'
    sortBtn.style.borderRadius = '20px 20px 0 0 '
    sortBtn.style.alignItems = 'start'
    document.querySelector('.container__search').style.width = '27rem'
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.sort__container')) {
        sortList.style.display = 'none';
        sortBtn.classList.add('hover-effect')
        sortBtn.style.width = 'auto'
        sortBtn.style.borderRadius = '50%'
        sortBtn.style.alignItems = 'center'
        document.querySelector('.container__search').style.width = '30rem'
    }
});

/*  SORTING   */

if (sortItem) {
    sortItem.forEach(item => {
        item.addEventListener('click', sorting)
    })
}

async function sorting(e) {
    sortItem.forEach(item => item.classList.remove('active'))

    const item = e.target
    item.classList.add('active')

    const attribute = item.getAttribute('data-value')

    const url = BASE_URL + `?sort_by=${attribute}`
    const list = await fetchMovieList(url)
    await showMovieList(list)
}

/*  OPEN CERTAIN MOVIE */

async function showMovie(movie) {
    const imageUrl = image_BASE_URL + movie.poster_path

    const percent = Math.round((movie.vote_average / 10) * 100)
    const genres = movie.genres.map(genre => genre.name).join(', ')

    let html = ``

    html += `
    <button class="goMainBtn">Go main page</button>
    <div class="inner-movie__details">
                <div class="poster">
                    <img src="${imageUrl} "
                         alt="" class="poster-img">
                </div>
                <div class="header__poster">
                    <div class="header-title__movie">
                        <h1 class="movie__title">${movie.original_title}</h1>
                        <ul class="facts">
                            <li class="fact">${movie.release_date}</li>
                            <li class="fact">${genres}</li>
                            <li class="fact">${movie.runtime}m</li>
                        </ul>
                    </div>
                    <div class="header-rate-like__container">
                        <div class="circle__container">
                            <span class="rate">${percent}%</span>
                        </div>
                        <div class="like circle__container" data-id="${movie.id}">
                            <img src="/images/like-icon.svg" alt="like">
                        </div>
                    </div>
                    <div class="trailer-link__container">
                        <img src="/images/arrow.svg" alt="arrow">
                        <a href="#" class="trailer-link">Look the Trailer</a>
                    </div>
                    <div class="main__container">
                        <h3>Overview</h3>
                        <div class="overview__container">
                            <p class="overview">${movie.overview}</p>
                        </div>
                    </div>
                </div>
                <div class="background-poster">
                </div>
            </div>
            <h1 class="actors">Actors</h1>
           
    `

    movieDetails.innerHTML = html

    const button = document.querySelector('.like');

    button.addEventListener('click', () => {
            const recipeId = button.getAttribute('data-id');
            updateFavIcon(recipeId, button);
        }
    )


    const goMainBtn = document.querySelector('.goMainBtn');
    if (goMainBtn) {
        goMainBtn.addEventListener('click', () => {
            headerContainer.style.display = 'flex'
            gridContainer.style.display = 'grid'
            movieDetails.style.display = 'none'
            goMainBtn.style.display = 'none'
        });
    }
}

function updateFavIcon(recipeId, button) {
    const img = button.querySelector('img')
    console.log(img)
    if (favorites.includes(recipeId)) {
        img.src = `images/favorite-icon-filled.svg`
    } else {
        img.src = `images/like-icon.svg`
    }
}

async function setActors(actors) {

    console.log(actors)
    let html = ``
    actors.forEach(actor => {
        if (actor.known_for_department === 'Acting') {
            let urlImage = image_BASE_URL + actor.profile_path
            html += `
            <div class="cast-card">
                    <img class="cast-img"
                         src="${urlImage}"
                         alt="img">
                    <div class="cast-inner__container">
                        <h1 class="cast-title">${actor.name}</h1>
                        <p class="person">${actor.character}</p>
                    </div>
                </div>
        `
        }
    })
    console.log(html)
    castContainer.innerHTML = html
    movieDetails.appendChild(castContainer)
}

async function fetchMovie(url) {
    const res = await fetch(url, options)
    return await res.json()
}

if (gridContainer) {
    gridContainer.addEventListener('click', openMovieDetails)
}

async function fetchActors(url) {
    const res = await fetch(url, options)
    const data = await res.json()

    return data.cast
}

async function openMovieDetails(e) {
    headerContainer.style.display = 'none'
    gridContainer.style.display = 'none'
    movieDetails.style.display = 'block'

    const card = e.target.closest('.card')
    const movieId = card.getAttribute('data-id')
    const url = `https://api.themoviedb.org/3/movie/${movieId}`

    const movie = await fetchMovie(url)
    console.log(movie)
    await showMovie(movie)

    const castUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits`
    const cast = await fetchActors(castUrl)
    await setActors(cast)
}

if(movieDetails){
    movieDetails.addEventListener('click', (e)=>{
        const like = e.target.closest('.like')

        if(like){
            const movieId =like.getAttribute('data-id')
            toggleFavorite(movieId);
            updateFavIcon(movieId, like);
        }
    })
}

function toggleFavorite(movieId){
    if (favorites.includes(movieId))
        favorites = favorites.filter(id => id !== movieId)
    else
        favorites.push(movieId)

    localStorage.setItem("favorites", JSON.stringify(favorites))
}