
// function getBestFilm() {
//    let bestFilmTitle = document.querySelector(".title h2")
//    console.log(bestFilmTitle.textContent)
//}

//getBestFilm()

async function afficherFilms() {
    for (let j = 1; j<10; j++) {
        const response = await fetch(`http://localhost:8000/api/v1/titles/?format=json&page=${j}`);
        const film = await response.json();
        for (let i in film.results) {
            console.log(film.results[i].title);
        }
//return response.json();
  }
}

bestFilm()
let bestTitle = document.getElementById("bestTitle h2")
console.log(bestTitle)
let bestPic = document.querySelector(".affiche img")
let bestDesc = document.getElementById("description")
console.log(bestPic)

async function bestFilm() {
        const response = await fetch("http://localhost:8000/api/v1/titles/118710")
        const film = await response.json();
        bestTitle.innerText = film.original_title
        bestPic.setAttribute("src", film.image_url)
        bestDesc.innerText = film.description
        let detailHeader = `
        <h2>${film.original_title}</h2>
        <h4>${film.year} - ${film.genres}</h4>
        `
let modalHeader = document.getElementById("modalHeader")
modalHeader.innerHTML = detailHeader
        console.log(film)
}



//afficherFilms()
// console.log(film)

