const url_title = "http://localhost:8000/api/v1/titles/";
const url_genre = "http://localhost:8000/api/v1/genres/";


// create the best film block and get a movie from a given ID
async function bestFilm(filmId) {
        const response = await fetch(`${url_title}${filmId}`);
        const bfilm = await response.json();

        let blockToLook = document.getElementById("bestFilm");

        let detail = `
                    <div class="col d-flex justify-content-center my-2">
                        <img class="img-fluid  d-none d-md-block" src="${bfilm.image_url}" alt="${bfilm.title}">
                    </div>
                    <div class="col-12 d-flex items- d-block d-md-none">
                        <div class="bfilm" style="background-image: url(${bfilm.image_url}); background-size: cover; "></div>
                    </div>
                    <div class="col-12 col-md-9 my-3">
                            <div class="col-12  d-flex justify-content-start"><h3>${bfilm.title}</h3></div>
                            <div class="col-12">${bfilm.description}</div>
                            <div class="col-12 d-flex justify-content-end">
                                <button type="button" class="btn btn-danger rounded-4 px-4" data-toggle="modal" data-target="#${bfilm.id}">Détail</button>
                            </div>
                    </div>
        `;
        blockToLook.innerHTML += detail;
        getModalDetail(bfilm, bfilm.id, blockToLook);
}

// call the movie URL, retrieve data and create modal block, then insert it in HTML directly
// avoid to manage a promise object in createBlock()
async function getModalDetail(filmData, modalId, blockToLook) {
    const response = await fetch(`${filmData.url}`);
    const film = await response.json();

    let recette = "N/A";
    let genre = recette;

    if (film.worldwide_gross_income) {
        recette = film.worldwide_gross_income;
    }
    if (film.genre) {
        genre = film.genre;
    }

    let modalContent = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title" id="${modalId}">Détail du film</div>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fermer">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- first part -->
                    <div class="row">
                        <div class="col-12-auto col-lg-6 ">
                            <div class="p-2">
                                <div class="fs-2 py-2 fw-bolder">${film.title}</div>
                                <div class="fs-4">${film.year} - ${genre}</div>
                                <div class="fs-4">${film.duration} minutes (${film.countries})</div>
                                <div class="fs-4">IMDB score: ${film.imdb_score}/10</div>
                                <div class="fs-4">Recettes au Box-Office : ${recette}</div>
                                <div class="py-3 fs-4">Realisé par:
                                    <p class="fs-5">${film.directors}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-12-auto col-lg-6 d-flex justify-content-center">
                            <img src="${film.image_url}" class="img-fluid my-3 d-none d-lg-block" alt="${film.title}">
                        </div>
                    </div>
                    <!-- second part -->
                    <div class="row">
                        <div class="col-12 order-md-1">
                            <div class="p-3 border bg-light">${film.long_description}
                            </div>
                            <div class="col-12 d-flex justify-content-center">
                                <img src="${film.image_url}" class=" my-3 d-lg-none" alt="${film.title}">
                            </div>
                        <div class="p-3 border order-md-3 bg-light mt-3">
                            <strong>Avec: </strong>
                            <p>${film.actors}</p>
                        </div>
                    </div>
                </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger rounded-4 px-4 d-none d-lg-block" data-dismiss="modal">Fermer</button>
            </div>
            </div>
        </div>
    </div>
    `
    blockToLook.innerHTML += modalContent
}



// get a list of movies from a first general call based on query string;
// -> returns a promise
async function getMovies3(url) {
    const filmList = [];
    for (let j=1; j<3; j++) {
            const response = await fetch(`${url_title}${url}&format=json&page=${j}`);
            const film1 = await response.json();
            for (i in film1.results) {
                filmList.push(film1.results[i]);
            }
        }
    return filmList;
}


// create HTML blocks from a movie list
// Called by generateMovies (using screen size) and the button "more" to create 6 blocks
// (they've already handled the promise)
function createBlock(filmList, id, count) {
    // get the element to change
    let blockToLook = document.getElementById(id);
    blockToLook.innerHTML = "";

    for (let i = 0; i < count; i++) {
        film = filmList[i];

        let movieBlock = `
            <div class="col-12 col-md-6 col-lg-4 pb-5" id="${i}">
                <div class="square" style="background-image: url(${film.image_url}); background-size: cover">
                </div>
                <div class="overlay row">
                    <div class="col-12">
                        <h3 class="fs-4 text-white">${film.title}</h3>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary rounded-4 px-4" data-toggle="modal" data-target="#${film.id}"><strong>Détail</strong></button>
                    </div>
                </div>
            </div>
        `;

        // create the block, then call the modal creation from the async function
        blockToLook.innerHTML += movieBlock
        getModalDetail(film, film.id, blockToLook);
    }
}

// get categories and create the options in select menu
async function getCategory() {
    listeGenres = [];
    for (let i = 1; i<6; i++) {
        const response = await fetch(`${url_genre}?page=${i}`);
        const genres = await response.json();
        for (let j in genres.results) {
            listeGenres.push(genres.results[j].name);
        };
    }
    let categorySelect = document.getElementById("category-select");
    for (i in listeGenres) {
        let option = `
            <option value="${listeGenres[i]}">${listeGenres[i]}</option>
        `;
        categorySelect.innerHTML += option;
    }
}

// ==================== buttons
// add button with requested display
function addSeeMore(id, display) {
    let blockToChange = document.getElementById(id)
    let blockToAdd = `
        <div id="seeMore"  class="row d-flex justify-content-center">
            <button onclick="${id}More()" class="col-4 btn btn-danger rounded-4 ${display}" id="more" type="button" >Voir plus</button>
        </div>
    `
    blockToChange.innerHTML += blockToAdd
}

function addSeeLess(id, display) {
    let blockToChange = document.getElementById(id)
    let blockToAdd = `
        <div id="seeLess"  class="row d-flex justify-content-center">
            <button onclick="${id}Less()" class="col-4 btn btn-danger rounded-4 ${display}" id="less" type="button" >Voir moins</button>
        </div>
    `
    blockToChange.innerHTML += blockToAdd;
}
//====================  end buttons

// ==================== functions called by buttons
//for each container... could be improved (factorized)
function bestRatedMore() {
    bestRated.then((data) => {
        createBlock(data, "bestRated", 6);
        addSeeMore("bestRated", "d-none");
        addSeeLess("bestRated", "d-block");
    })
}
function bestRatedLess() {
    generateMovies(bestRated, "bestRated")
}

function mysteryMore() {
    mystery.then((data) => {
        createBlock(data, "mystery", 6);
        addSeeMore("mystery", "d-none");
        addSeeLess("mystery", "d-block");
    })
}
function mysteryLess() {
    generateMovies(mystery, "mystery")
}

function animationMore() {
    animation.then((data) => {
        createBlock(data, "animation", 6);
        addSeeMore("animation", "d-none");
        addSeeLess("animation", "d-block");
    })
}

function animationLess() {
    generateMovies(animation, "animation")
}

function otherMore() {
    other.then((data) => {
        createBlock(data, "other", 6);
        addSeeMore("other", "d-none");
        addSeeLess("other", "d-block");
    })
}

function otherLess() {
    generateMovies(other, "other")
}
// ==================== end of functions called by buttons


// responsive management
// generate the movies block depending on screen size
function generateMovies(movieProm, id) {
    if (screen.width < 768 ) {
        movieProm.then((data) => {
            createBlock(data, id, 2);
            addSeeMore(id, "d-block");
        })
    }
    if (screen.width === 768 || screen.width > 768 && screen.width < 992) {
        movieProm.then((data) => {
            createBlock(data, id, 4);
            addSeeMore(id, "d-block");
        })
    }
    if (screen.width > 992) {
        movieProm.then((data) => {
            createBlock(data, id, 6);
            addSeeMore(id, "d-none");
        })
    }
}

// main

// ============ best film ============
// Il Grande Lebowski
// bestFilm("118715")
//bestFilm("133093");
bestFilm("234215");

// Get resources
let bestRated = getMovies3("?sort_by=-imdb_score");
let mystery = getMovies3("?genre=mystery");
let animation = getMovies3("?genre=animation");
let other = getMovies3("?genre=action");


// ============ Best Rated ============
generateMovies(bestRated, "bestRated");

//  ============ Mystery ============
generateMovies(mystery, "mystery")

//  ============ Animation ============
generateMovies(animation, "animation")

//  ============ Other ============
// fill the selection menu
getCategory();
generateMovies(other, "other");


// Make it dynamic, step 8
// listen for any change in menu
let selectedItem = document.getElementById("category-select");
selectedItem.addEventListener("change", ()=> {
    let block = getMovies3(`?genre=${selectedItem.value}`);
    generateMovies(block, "other");
    other = block;
});

// Make it dynamic, step 7
// responsive management
// when the screen changes, regenerate blocks for all
window.addEventListener("resize", ()=> {
        generateMovies(bestRated, "bestRated");
        generateMovies(mystery, "mystery");
        generateMovies(animation, "animation");
        generateMovies(other, "other");
})

