const MASTER_URL = 'https://majazocom.github.io/Data/solaris.json';
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
        let resp = await fetch(MASTER_URL);
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
};

// S??KFUNKTION
searchInput.addEventListener("keydown", function (e) {
    // K??rs n??r man klickar p?? ENTER
    if (e.key === 'Enter' && searchInput.value != '') {
        e.preventDefault();
        const searchValue = searchInput.value;
        let matchedPlanet = [];
        // g?? igenom listan med planeter och kollar om n??got namn matchar inputen
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
            formError.innerHTML = 'Planeten ' + searchValue + ' kunde inte hittas';
            formError.ariaHidden = 'false';
        }
    }
});

searchInput.addEventListener('input', () => {
    if (searchInput.value == '') {
        formError.ariaHidden = 'true';
    }
})

// ??PPNA POPUP P?? VARSIN PLANET
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

// F??reg??ende planet
prevBtn.addEventListener('click', () => {
    let previous = document.querySelector('.planet.active').previousSibling;
    if (previous.nodeName === '#text') {
        previous.previousSibling.click();
    } else {
        previous.previousSibling.click();
    }
})

// n??sta planet
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
    })
});

function showCaseInfo() {
    const nameBtn = document.getElementById("name");
    const distanceBtn = document.getElementById("distance");
    const sizeBtn = document.getElementById("size");

    // Printar ut namn p?? alla planeter
    nameBtn.addEventListener("click", () => {
        fetch(MASTER_URL)
            .then(response => response.json())
            .then(data => {
                planetsContainer.forEach((planetDiv, index) => {
                    planetDiv.dataset.attribute = data[index].name;
                });
            })
            .catch(error => console.log(error));
    });

    // Printar ut distans f??r alla planeter
    distanceBtn.addEventListener("click", () => {
        fetch(MASTER_URL)
            .then(response => response.json())
            .then(data => {
                planetsContainer.forEach((planetDiv, index) => {
                    planetDiv.dataset.attribute = data[index].distance;
                });
            })
            .catch(error => console.log(error));
    });

    // Printar ut storlet f??r alla planeter
    sizeBtn.addEventListener("click", () => {
        fetch(MASTER_URL)
            .then(response => response.json())
            .then(data => {
                planetsContainer.forEach((planetDiv, index) => {
                    planetDiv.dataset.attribute = data[index].circumference;
                });
            })
            .catch(error => console.log(error));
    });
}
showCaseInfo();