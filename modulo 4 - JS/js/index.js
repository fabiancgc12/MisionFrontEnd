const pokedexElement = document.querySelector("#pokedex")
const moreInfoButton = document.querySelector("#more-info")
const backButton = document.querySelector("#back-button")
const searchButton = document.querySelector("#submit-button")
const searchInput = document.querySelector("#searchInput")

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
    const pokemon = await pokedex.getPokemonByName(pokemonName)
    console.log(pokemon)
}