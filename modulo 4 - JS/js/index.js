const pokedexElement = document.querySelector("#pokedex")
const errorMessage = document.querySelector(".errorMessage")
const pokedexInfoSection = document.querySelector(".pokedex-info")
const displayPokemonSection = document.querySelector(".display-pokemon")
const displayPokemonInner = document.querySelector(".display-pokemon > div")
const lastPokemonId = 902;
let pokemonId = null

/*
    Inputs
 */

const searchForm = document.querySelector("#searchForm")
const moreInfoButton = document.querySelector("#more-info")
const backButton = document.querySelector("#back-button")
const searchButton = document.querySelector("#submit-button")
const searchInput = document.querySelector("#searchInput")
const leftArrowControl = document.querySelector("#left-arrow")
const rightArrowControl = document.querySelector("#right-arrow")
const bluethemeBottom = document.querySelector(".blue-theme")
const redthemeBottom = document.querySelector(".red-theme")
const greenthemeBottom = document.querySelector(".green-theme")
/*
    Pokemon Data
 */

const pokemonImg = document.querySelector("#pokemon-img")
const pokemonName = document.querySelector("#pokemon-name")
const pokemonEntry = document.querySelector("#pokemon-entry")
const pokemonHeight = document.querySelector("#height")
const pokemonWeight = document.querySelector("#weight")
const pokemonAbilities = document.querySelector("#abilities")
const pokemonTypes = document.querySelector("#types")
const pokemonMoves = document.querySelector("#move-list")
const pokedexLeftArrowSprite = document.querySelector("#left-sprite")
const pokedexRightArrowSprite = document.querySelector("#right-sprite")

// stats
const pokemonStats = {
    hp:{
        progress: document.querySelector("#hp-progress"),
        info: document.querySelector("#hp-info")
    },
    attack:{
        progress: document.querySelector("#attack-progress"),
        info: document.querySelector("#attack-info")
    },
    defense:{
        progress: document.querySelector("#defense-progress"),
        info: document.querySelector("#defense-info")
    },
    ["special-attack"]:{
        progress: document.querySelector("#sp-attack-progress"),
        info: document.querySelector("#sp-attack-info")
    },
    ["special-defense"]:{
        progress: document.querySelector("#sp-defense-progress"),
        info: document.querySelector("#sp-defense-info")
    },
    speed:{
        progress: document.querySelector("#speed-progress"),
        info: document.querySelector("#speed-info")
    }
}

/*
    functions
 */

const pokedex = new Pokedex.Pokedex()

moreInfoButton.addEventListener("click", () => {
    pokedexElement.classList.add("open")
})

backButton.addEventListener("click", () => {
    pokedexElement.classList.remove("open")
})

searchForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const value = searchInput.value.trim();
    if (value.match(/\d-\d/g)) {
        const [firstId, lastId] = value.split("-");
        searchMultiplePokemons(Number(firstId),Number(lastId))
    }
    else
        searchPokemonByName(value)
})

rightArrowControl.addEventListener("click", () => {
    if (!pokemonId) return
    searchPokemonByName(pokemonId + 1)
})

leftArrowControl.addEventListener("click", () => {
    if (!pokemonId) return
    searchPokemonByName(pokemonId - 1)
})

function clearDisplay(){
    while (displayPokemonInner.children.length > 2) {
        displayPokemonInner.removeChild(displayPokemonInner.lastChild);
    }
    displayPokemonSection.classList.remove("multiple")
    pokemonImg.src = "./src/loading.gif";
    pokemonImg.onclick = () => {};
}

async function searchPokemonByName(pokemonName){
    try {
        clearDisplay()
        const [pokemon,species] = await Promise.all([pokedex.getPokemonByName(pokemonName),pokedex.getPokemonSpeciesByName(pokemonName)])
        searchInput.value = pokemonName
        showPokemon(pokemon,species)
    } catch (e) {
        displayError()
    }
}

async function searchMultiplePokemons(firstId,lastId){
    clearDisplay()
    if (firstId > lastId){
        displayError();
        return
    }
    const imagesUrls = [];
    for (let i = firstId;i <= lastId;i++){
        const imageUrl = generateMiniSpriteLink(i);
        imagesUrls.push([i,imageUrl])
    };
    imagesUrls.forEach(([id,url],index) => {
        if (index == 0){
            pokemonImg.src = url
            pokemonImg.onclick = () => {
                searchPokemonByName(id)
            }
        } else {
            const img = document.createElement("img")
            img.className = "pokemon-image";
            img.src = url;
            img.onclick = () => {
                searchPokemonByName(id)
            }
            displayPokemonInner.appendChild(img)
        }
    })
    displayPokemonSection.classList.add("multiple");
    errorMessage.classList.remove("show")
}


function displayError(){
    clearDisplay()
    pokemonId = null
    displayPokemonSection.classList.remove("multiple")
    pokedexLeftArrowSprite.removeAttribute("src")
    pokedexRightArrowSprite.removeAttribute("src")
    pokedexInfoSection.classList.add("loading")
    moreInfoButton.setAttribute("disabled",true)
    pokemonImg.removeAttribute("src")
    errorMessage.classList.add("show")
}

function showPokemon(pokemon,species) {
    const sprite = pokemon.sprites.other["official-artwork"].front_default

    pokemonImg.src = sprite;
    pokemonName.innerHTML = pokemon.name
    // pokemonEntry.innerHTML = species.flavor_text_entries[0].flavor_text;
    pokemonEntry.innerHTML = formatPokemonDescription(species);
    pokemonHeight.innerHTML = formatPokemonHeight(pokemon.height);
    pokemonWeight.innerHTML = formatPokemonWeight(pokemon.weight);
    pokemonAbilities.innerHTML = getPokemonAbilities(pokemon);
    pokemonTypes.innerHTML = ""
    getPokemonTypes(pokemon).forEach(type => {
        pokemonTypes.appendChild(type)
    })
    getPokemonStats(pokemon).forEach((value,key) => {
        const statHtml = pokemonStats[key]
        if (statHtml){
            statHtml.progress.value = value
            statHtml.info.innerHTML = value
        }
    })
    pokemonMoves.innerHTML = "";
    getPokemonMoves(pokemon).forEach(move => {
        pokemonMoves.appendChild(move)
    })

    pokemonId = pokemon.id
    if (pokemonId > 1){
        const prevPokemonId = pokemonId - 1
        pokedexLeftArrowSprite.setAttribute("src",generateMiniSpriteLink(prevPokemonId))
    } else {
        pokedexLeftArrowSprite.setAttribute("src","")
    }

    //last pokemon knowId
    if (pokemonId <= lastPokemonId){
        const nextPokemonId = pokemonId + 1
        pokedexRightArrowSprite.setAttribute("src",generateMiniSpriteLink(nextPokemonId))
    } else {
        pokedexRightArrowSprite.setAttribute("src","")
    }

    moreInfoButton.removeAttribute("disabled")
    errorMessage.classList.remove("show")
    pokedexInfoSection.classList.remove("loading")
}

function formatPokemonHeight(height){
    return height / 10
}

function formatPokemonWeight(weight){
    return weight / 10
}

function formatPokemonDescription(species){
    const text = species.flavor_text_entries[0].flavor_text
    const formated = text.replace(/[^\w\dé /\n.-]/g, '');
    return formated;
}

function getPokemonAbilities(pokemon){
    const abilities = pokemon.abilities.map(a => {
        return a.ability.name
    }).join(", ")
    return abilities
}

function getPokemonTypes(pokemon){
    const types = pokemon.types.map(t => {
        const name = t.type.name;
        const span = document.createElement("span")
        span.className = `type ${name}Type`
        return span
    })
    return types
}

function getPokemonStats(pokemon){
    const stats = new Map([])
    pokemon.stats.forEach(s => {
        stats.set(s.stat.name,s.base_stat)
    })
    return stats
}

function getPokemonMoves(pokemon){
    const names = pokemon.moves.map(m => {
        const name = m.move.name
        const div = document.createElement("div")
        div.classList = "move"
        div.innerHTML = name;
        return div
    })
    return names
}

function generateMiniSpriteLink(id){
    let url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/${id}.png`;
    //cheking if id is fom gen 8, a lot of the mini sprite look better in gen 7
    if (id >= 810)
        url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${id}.png`;
    return url
}

/*
    changing theme
 */

bluethemeBottom.addEventListener("click",() => {
    document.body.className="blue";
    localStorage.setItem('theme', 'blue');
})

redthemeBottom.addEventListener("click",() => {
    document.body.className="red";
    localStorage.setItem('theme', 'red');
})

greenthemeBottom.addEventListener("click",() => {
    document.body.className="green";
    localStorage.setItem('theme', 'green');
})


function loadTheme(){
    const theme = localStorage.getItem('theme') ?? "red";
    document.body.className=theme;
}

loadTheme()