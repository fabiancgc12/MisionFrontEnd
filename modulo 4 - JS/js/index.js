const moreInfoButton = document.querySelector("#more-info")
const backButton = document.querySelector("#back-button")
const pokedex = document.querySelector("#pokedex")


moreInfoButton.addEventListener("click", () => {
    pokedex.classList.add("open")
})

backButton.addEventListener("click", () => {
    console.log(pokedex.classList)
    pokedex.classList.remove("open")
    console.log(pokedex.classList)

})

// const backButton =