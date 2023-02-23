let planets = document.querySelectorAll('.planet');
let infoButtons = document.querySelectorAll('.btn');
let searchInput = document.querySelector('#search');
let modalContainer = document.querySelector('.modal');
let pagination = document.querySelector('.modal__pagination');
let closeBtn = document.querySelector('.modal__close');
let planetsArray = [];

async function getPlanetInfo() {
    try {
        let resp = await fetch('https://majazocom.github.io/Data/solaris.json');
        planetsArray = await resp.json();
    }
    catch (error) {
        console.log(error);
    }
}
getPlanetInfo();

function renderPlanetsToModal(planets) {
    modalContainer.innerHTML = '';
    planets.forEach(planet => {
        let planetEl = document.createElement('article');
        planetEl.classList.add('chosen__planet')
        planetEl.innerHTML = `
        <h2>${planet.name}</h2>
        <p class="planet--desc">${planet.desc}</p>
        <section class="planet--info">
            <h3>Dist. to sun: <br><br><span>${planet.distance} km</span></h3>
            <h3>Latin name: <br><br><span>${planet.latinName}</span></h3>
            <h3>Days around sun: <br><br><span>${planet.orbitalPeriod}</span></h3>
            <h3>Size in km: <br><br><span>${planet.circumference}</span></h3>
        </section>
        <section class="planet--moons">
            <h3 class="moons-headline">Moons</h3>
            <p>${planet.moons}</p>
        </section>
        `;
        modalContainer.appendChild(planetEl);
        modalContainer.appendChild(pagination);
        modalContainer.appendChild(closeBtn);
        modalContainer.classList.add('active');
    })
    closeBtn.addEventListener('click', () => {
        modalContainer.classList.remove('active');
    })
}

// SÖKFUNCTION
searchInput.addEventListener("keydown", function (e) {
    // Körs när man klickar på ENTER
    if (e.key === "Enter") {
        e.preventDefault();
        const searchValue = searchInput.value;
        let matchedPlanet = [];
        // gå igenom listan med planeter och kollar om något namn matchar inputen
        planetsArray.forEach(planet => {
            if (planet.name.toLowerCase().includes(searchValue.toLowerCase())) {
                matchedPlanet.push(planet);
            }
        })
        renderPlanetsToModal(matchedPlanet);
    }
});

// ÖPPNA POPUP PÅ VARSIN PLANET
planets.forEach(planet => {
    planet.addEventListener('click', (e) => {
        let planetEl = e.target.id;
        let clickedPlanet = [];
        planetsArray.forEach(planet => {
            if (planet.name.toLowerCase().includes(planetEl.toLowerCase())) {
                clickedPlanet.push(planet);
            }
        })
        renderPlanetsToModal(clickedPlanet);
    })
})

// Header infoknappar
infoButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let currentTarget = e.target;
        infoButtons.forEach(p => p.classList.remove('active'));
        currentTarget.classList.toggle("active");
    });
});
