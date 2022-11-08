const pokedexElement = document.querySelector("#pokedex")
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
    const value = searchInput.value;
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

async function searchPokemonByName(pokemonName){
    const [pokemon,species] = await Promise.all([pokedex.getPokemonByName(pokemonName),pokedex.getPokemonSpeciesByName(pokemonName)])
    if (pokemon)
        showPokemon(pokemon,species)
    else
        alert("error")
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