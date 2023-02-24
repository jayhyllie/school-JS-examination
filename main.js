let planetsContainer = document.querySelectorAll('.planet');
let infoButtons = document.querySelectorAll('.btn');
let searchInput = document.querySelector('#search');
let formError = document.querySelector('.form--error');
let modalContainer = document.querySelector('.modal');
let pagination = document.querySelector('.modal__pagination');
let prevBtn = document.querySelector('.pagination--prev');
let nextBtn = document.querySelector('.pagination--next');
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
    clearActiveClass();
    planets.forEach(planet => {
        document.querySelector(`#${planet.name}`).classList.add('active');
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
            <div class="moons"></div>
        </section>
        `;
        modalContainer.appendChild(planetEl);
        modalContainer.appendChild(pagination);
        modalContainer.appendChild(closeBtn);
        modalContainer.classList.add('active');

        planet.moons.forEach(moon => {
            document.querySelector(".moons").innerHTML += `<p>${moon}</p>`;
        })
    })
    closeBtn.addEventListener('click', () => {
        modalContainer.classList.remove('active');
        clearActiveClass();
    })
}

// SÖKFUNKTION
searchInput.addEventListener("keydown", function (e) {
    // Körs när man klickar på ENTER
    if (e.key === 'ENTER' && searchInput.value != '') {
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

        let showErrorMessage = function (currentValue) {
            return currentValue.name.toLowerCase().includes(searchValue.toLowerCase());
        }
        if (!planetsArray.some(showErrorMessage)) {
            formError.innerHTML = searchValue + ' kunde inte hittas';
            formError.ariaHidden = 'false';
        }
    }
});

searchInput.addEventListener('input', () => {
    if (searchInput.value == '') {
        formError.ariaHidden = 'true';
    }
})

// ÖPPNA POPUP PÅ VARSIN PLANET
planetsContainer.forEach(planet => {
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

// Föregående planet
prevBtn.addEventListener('click', () => {
    let previous = document.querySelector('.planet.active').previousSibling;
    if (previous.nodeName === '#text') {
        previous.previousSibling.click();
    } else { 
        previous.previousSibling.click(); 
    }
})

// nästa planet
nextBtn.addEventListener('click', () => {
    let next = document.querySelector('.planet.active').nextSibling;
    if (next.nodeName === '#text') {
        next.nextSibling.click();
    } else { 
        next.nextSibling.click(); 
    }
})

// rensa aktiva klasser 
function clearActiveClass() {
    planetsContainer.forEach(planet => {
        planet.classList.remove('active');
    })
}

// Header infoknappar
infoButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        let currentTarget = e.target;
        infoButtons.forEach(p => p.classList.remove('active'));
        currentTarget.classList.toggle("active");
    });
});