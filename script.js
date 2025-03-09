const url_title = "http://localhost:8000/api/v1/titles/";
const url_genre = "http://localhost:8000/api/v1/genres/";

const blockEnd = `
            </div>
        </div>
    </div>
`;

let filmNumber = 10
let categoryMovieBlock = 6

async function getMovies(url, id, type) {
    const filmList = [];

    for (let j=1; j<3; j++) {
        const response = await fetch(`${url_title}${url}&format=json&page=${j}`);
        const film1 = await response.json();
        for (i in film1.results) {
            filmList.push(film1.results[i]);
        }
    }

    let blockToLook = document.getElementById(id);
    blockToLook.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        film = filmList[i];
        let id = i+1

        let movieBlock = `
            <div class="col-12 col-md-6 col-lg-4 pb-5">
                <div class="square" style="background-image: url(${film.image_url}); background-size: cover">
                </div>
                <div class="overlay row">
                    <div class="col-12">
                        <h4 style="color: white">${film.title}</h4>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary rounded-4 px-4" data-toggle="modal" data-target="#${film.id}"><strong>Détail</strong></button>

        `;
        // retrieve the specific film detail from URL using id then concatenate with the modal creator
        const response2 = await fetch(`${url_title}${film.id}`);
        const film2 = await response2.json();
        let modal = getModalDetail(film2, film2.id);

    blockToLook.innerHTML += movieBlock+modal+blockEnd;
    }
}

// tried to make some dynamic pagination browsing... nok
async function getCount(type) {
    const response = await fetch(`http://localhost:8000/api/v1/${type}`);
    const result = await response.json();
    return result;
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

// create the best film block and get a movie from a given ID
async function bestFilm(filmId) {
        const response = await fetch(`${url_title}${filmId}`);
        const bfilm = await response.json();

        let detail = `
                <div class="row">
                    <div class="col d-flex justify-content-center my-2"  >
                        <img class="img-fluid d-none d-md-block" src="${bfilm.image_url}" alt="film cover">
                    </div>
                    <div class="col-12 d-block d-md-none" style="background-image: url(${bfilm.image_url}); background-size: cover"></div>
                    <div class="col-sm-12 col-md-9 my-3">
                            <div class="col-12  d-flex justify-content-start"><h2>${bfilm.title}</h2></div>
                            <div class="col-12">${bfilm.description}</div>
                            <div class="col-12 d-flex justify-content-end mt-auto">
                                <button type="button" class="btn btn-danger rounded-4 px-4" data-toggle="modal" data-target="#${bfilm.id}">Détail</button>
                            </div>
                    </div>
                </div>
        `;
        let modal = getModalDetail(bfilm, bfilm.id);
        document.getElementById("bestFilm").innerHTML += detail+modal;

}

// create the modal HTML block for a given film object
function getModalDetail(film, modalId) {
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
                    <h5 class="modal-title" id="${modalId}">Détail du film</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Fermer">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- first part -->
                    <div class="row">
                        <div class="col-12-auto col-lg-6 ">
                            <div class="p-2">
                                <div class="py-2 fw-bolder"><h1>${film.title}</h1></div>
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
                            <img src="${film.image_url}" class="img-fluid my-3 d-none d-lg-block" alt="Film Cover">
                        </div>
                    </div>
                    <!-- second part -->
                    <div class="row">
                        <div class="col-12 order-md-1">
                            <div class="p-3 border bg-light">${film.long_description}
                            </div>
                            <div class="col-12 d-flex justify-content-center">
                                <img src="${film.image_url}" class=" my-3 d-lg-none" alt="Film Cover">
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
    `;
    return modalContent;
}

// get MovieList, returns a promise
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

// get a movie List and create HTML blocks
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
                        <h4 style="color: white">${film.title}</h4>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary rounded-4 px-4" data-toggle="modal" data-target="#${film.id}"><strong>Détail</strong></button>
                    </div>
                </div>
            </div>
        `;
        // retrieve the specific film detail from URL using id then concatenate with the modal creator
        let modal = getModalDetail(film, film.id);
        blockToLook.innerHTML += movieBlock+modal;
    }
}

// add button with requested display
function addSeeMore(id, display) {
    let blockToChange = document.getElementById(id)
    let blockToAdd = `
        <div id="seeMore"  class="row d-flex justify-content-center">
            <button class="col-4 btn btn-danger rounded-4 ${display}" id="more" type="button" >Voir plus</button>
        </div>
    `
    blockToChange.innerHTML += blockToAdd
}

function addSeeLess(id, display) {
    let blockToChange = document.getElementById(id)
    let blockToAdd = `
        <div id="seeLess"  class="row d-flex justify-content-center">
            <button class="col-4 btn btn-danger rounded-4 ${display}" id="less" type="button" >Voir moins</button>
        </div>
    `
    blockToChange.innerHTML += blockToAdd;
}

// add movie block quantity depending on screen size
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

function generateMoviesUnsized(movieProm, id) {
    movieProm.then((data) => {
        createBlock(data, id, 6);
    });
}

function listenButton(blockId) {
    let more = document.querySelector("#blockId button");
    // when the button is clicked ; regenerate blocks and hide button
    more.addEventListener("click", ()=> {
        blockId.then((data) => {
            createBlock(data, "blockId", 6);
            addSeeMore("blockId", "d-none");
            addSeeLess("blockId", "d-block");
        })
    })

    let less = document.querySelector("#bockId button");
    less.addEventListener("click", ()=> {
        blockId.then((data) => {
            generateMovies(blockId, "blockId");
        })
    })

// when the screen changes, regenerate blocks
window.addEventListener("resize", ()=> {
        generateMovies(bestRated, "bestRated")
})
}

// ============ best film ============
// Il Grande Lebowski
// bestFilm("118715")
bestFilm("101928");

// ============ Best Rated ============
//getMovies("?sort_by=-imdb_score", "bestRated");
let bestRated = getMovies3("?sort_by=-imdb_score");
// create blocks depending on current screen's size
generateMovies(bestRated, "bestRated");

//retrieve the button when it exists (better than getElementById which could raise an error
let more = document.querySelector("#bestRated");
console.log(more)
// when the button is clicked ; regenerate blocks and hide button
more.addEventListener("click", ()=> {
    bestRated.then((data) => {
        createBlock(data, "bestRated", 6);
        addSeeMore("bestRated", "d-none");
        addSeeLess("bestRated", "d-block");
    })
})
let less = document.getElementById("bestRated");

less.addEventListener("click", ()=> {
    bestRated.then((data) => {
        createBlock(data, "bestRated", 6);
        addSeeMore("bestRated", "d-none");
        addSeeLess("bestRated", "d-block");
    })
})

// when the screen changes, regenerate blocks
window.addEventListener("resize", ()=> {
        generateMovies(bestRated, "bestRated")
})
//  ============ Mystery ============
let mystery = getMovies3("?genre=mystery")
generateMovies(mystery, "mystery")


// fill the selection menu
getCategory();
let other = getMovies3("?genre=action");
generateMovies(other, "other");

// listen for any change in menu
let selectedItem = document.getElementById("category-select");
selectedItem.addEventListener("change", ()=> {
//    getMovies(`?genre=${selectedItem.value}`, "other");
    let block = getMovies3(`?genre=${selectedItem.value}`);
    generateMovies(block, "other");
});













function createBlock2(filmList, id, count) {
    let blockToLook = document.getElementById(id);
    blockToLook.innerHTML = "";
    let display = "d-block"

    for (let i = 0; i < count; i++) {
        film = filmList[i];
        let id = i+1

        if (i === 0 || i === 1 ) {
            display = "d-block"
        }
        if (i === 2 || i === 3) {
            display = "d-none d-md-block"
        }
        if (i === 4 || i === 5) {
            display = "d-none d-lg-block"
        }

        let movieBlock = `
            <div class="col-12 col-md-6 col-lg-4 pb-5 ${display}" id="${i}">
                <div class="square" style="background-image: url(${film.image_url}); background-size: cover">
                </div>
                <div class="overlay row">
                    <div class="col-12">
                        <h4 style="color: white">${film.title}</h4>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary rounded-4 px-4" data-toggle="modal" data-target="#${film.id}"><strong>Détail</strong></button>

        `;
        // retrieve the specific film detail from URL using id then concatenate with the modal creator
        let modal = getModalDetail(film, film.id);



        blockToLook.innerHTML += movieBlock+modal+blockEnd;
    }
}

async function getMovies2(url, id) {
    const filmList = [];
    //let countMovies = 6;

    for (let j=1; j<3; j++) {
        const response = await fetch(`${url_title}${url}&format=json&page=${j}`);
        const film1 = await response.json();
        for (i in film1.results) {
            filmList.push(film1.results[i]);
        }
    }

    let blockToLook = document.getElementById(id);
    blockToLook.innerHTML = "";

    for (let i = 0; i < count; i++) {
        film = filmList[i];
        let movieBlock = `
            <div class="col-12 col-md-6 col-lg-4 pb-5">
                <div class="square" style="background-image: url(${film.image_url}); background-size: cover">
                </div>
                <div class="overlay row">
                    <div class="col-12">
                        <h4 style="color: white">${film.title}</h4>
                    </div>
                    <div class="col d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary rounded-4 px-4" data-toggle="modal" data-target="#${film.id}"><strong>Détail</strong></button>

        `;
        // retrieve the specific film detail from URL using id then concatenate with the modal creator
        const response2 = await fetch(`${url_title}${film.id}`);
        const film2 = await response2.json();
        let modal = getModalDetail(film2, film2.id);

    blockToLook.innerHTML += movieBlock+modal+blockEnd;
    }
}