const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwZjgxZGFkNzIyZWFjNDc1YjI0N2JhOTIxYTIxYWU1YiIsIm5iZiI6MTczMTUzMjE2Ny45MDM3NjgzLCJzdWIiOiI2NzM1MTNlOWIwNDI5N2Y3MGM2ODE2MDciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Fu6TE-MyzvYlLlPgY9Vk88tfWLERECnquYikO44NuHM'
    }
};

const BASE_URL = 'https://api.themoviedb.org/3/discover/movie'
const image_BASE_URL = 'https://image.tmdb.org/t/p/w500'