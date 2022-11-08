const pokedexElement = document.querySelector("#pokedex")

/*
    Inputs
 */

const moreInfoButton = document.querySelector("#more-info")
const backButton = document.querySelector("#back-button")
const searchButton = document.querySelector("#submit-button")
const searchInput = document.querySelector("#searchInput")

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
    ["defense-attack"]:{
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
    console.log(pokedexElement.classList)
    pokedexElement.classList.remove("open")
    console.log(pokedexElement.classList)

})

searchButton.addEventListener("click", (e) => {
    e.preventDefault()
    const value = searchInput.value;
    console.log({value})
    searchPokemonByName(value)
})

async function searchPokemonByName(pokemonName){
    const [pokemon,species] = await Promise.all([pokedex.getPokemonByName(pokemonName),pokedex.getPokemonSpeciesByName(pokemonName)])
    if (pokemon)
        showPokemon(pokemon,species)
    else
        alert("error")
}

function showPokemon(pokemon,species) {
    console.log(pokemon)
    console.log(species)
    const sprite = pokemon.sprites.other["official-artwork"].front_default

    pokemonImg.src = sprite;
    pokemonName.innerHTML = pokemon.name
    pokemonEntry.innerHTML = species.flavor_text_entries[0].flavor_text;
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
            console.log({value,key})
            statHtml.progress.value = value
            statHtml.info.innerHTML = value
        }
    })
}

function formatPokemonHeight(height){
    return height / 10
}

function formatPokemonWeight(weight){
    return weight / 10
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
    console.log(stats)
    return stats
}