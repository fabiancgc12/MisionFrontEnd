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
    pokemonAbilities.innerHTML = getPokemonAbilities(pokemon)
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
    console.log(abilities)
    return abilities
}