// Fonction pour vérifier le contenu JSON dans les en-têtes de réponse
function checkJSONResponse(response) {
    const contentType = response.headers.get("content-type");
    return (contentType && contentType.indexOf("application/json") !== -1) ? response.json() : Promise.reject(new Error("Missing JSON header."));
}

const accessToken = "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";

// Utilisation de la fonction dans vos requêtes
fetch('https://api.github.com/users/vraiSlophil/repos', {
    headers: {
        'Authorization': `token ${accessToken}`, 'Accept': 'application/vnd.github.v3+json'
    }
})
    .then(checkJSONResponse)
    .then(async (json) => {
        const repoListHTML = document.querySelector("section.projects > div.repoList");

        for (const repo of json) {
            const repoFullName = repo["full_name"];
            const repoDescription = repo["description"];
            const repoLink = repo["html_url"];
            const repoSize = repo["size"];

            // Conversion de la date au format lisible
            const isoDate = repo["updated_at"];
            const date = new Date(isoDate);
            const options = { year: 'numeric', month: 'long', day: 'numeric'};
            const formattedDate = date.toLocaleDateString('fr-FR', options);

            // Récupération des langages du dépôt
            const languagesURL = `https://api.github.com/repos/${repoFullName}/languages`;
            const languagesResponse = await fetch(languagesURL,{
                headers: {
                    'Authorization': `token ${accessToken}`, 'Accept': 'application/vnd.github.v3+json'
                }
            });
            const languagesData = await checkJSONResponse(languagesResponse);

            const repoElement = document.createElement("div");
            repoElement.classList.add("repoElement");

            const nameElement = document.createElement("h3");
            nameElement.classList.add("name");
            nameElement.textContent = repoFullName;

            const sizeElement = document.createElement("p");
            sizeElement.classList.add("size");
            sizeElement.textContent = `${repoSize} Kb`;

            const descriptionElement = document.createElement("p");
            descriptionElement.classList.add("description");
            descriptionElement.textContent = repoDescription;

            const languagesDiv = document.createElement("div");
            languagesDiv.classList.add("languages");

            for (const lang of Object.keys(languagesData)) {
                const langElement = document.createElement("p");
                langElement.textContent = lang;
                langElement.classList.add(lang.toLowerCase()); // Ajoute une classe avec le nom du langage en minuscules
                languagesDiv.appendChild(langElement);
            }

            const linkElement = document.createElement("a");
            linkElement.classList.add("link");
            linkElement.href = repoLink;
            linkElement.textContent = repoLink;

            const updateElement = document.createElement("p");
            updateElement.classList.add("update");
            updateElement.textContent = `Dernier commit : ${formattedDate}`;

            repoElement.append(nameElement, sizeElement, descriptionElement, languagesDiv, linkElement, updateElement);
            repoListHTML.appendChild(repoElement);
        }
    })
    .catch((error) => {
        console.error(error);
    });



const Z = 35;

const random = {
    uniform: (min, max) => Math.random() * (max - min) + min,
};

class Vec {
    constructor(...components) {
        this.components = components;
    }

    add(vec) {
        this.components = this.components.map((c, i) => c + vec.components[i]);
        return this;
    }

    sub(vec) {
        this.components = this.components.map((c, i) => c - vec.components[i]);
        return this;
    }

    div(vec) {
        this.components = this.components.map((c, i) => c / vec.components[i]);
        return this;
    }

    scale(scalar) {
        this.components = this.components.map((c) => c * scalar);
        return this;
    }

    multiply(vec) {
        this.components = this.components.map((c, i) => c * vec.components[i]);
        return this;
    }

    rotateXY(angle) {
        const x = this.components[0] * Math.cos(angle) - this.components[1] * Math.sin(angle);
        const y = this.components[0] * Math.sin(angle) + this.components[1] * Math.cos(angle);
        this.components[0] = x;
        this.components[1] = y;
    }
}

const CENTER = new Vec(window.innerWidth / 2, window.innerHeight / 2);
const STARS = 1500;

class Canvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.ctx = this.canvas.getContext("2d");
    }

    draw() {
        const space = new Space();
        const draw = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            space.run(this.ctx);
            requestAnimationFrame(draw);
        };
        draw();
    }
}

class Star {
    constructor() {
        this.size = 10;
        this.pos = this.getPosition();
        this.screenPos = new Vec(0, 0);
        this.vel = random.uniform(0.05, 0.25);
        this.image = new Image();
        this.image.src = "./image/star.png"
    }

    getPosition(scale = 35) {
        const angle = random.uniform(0, 2 * Math.PI);
        const radius = random.uniform(window.innerHeight / scale, window.innerHeight) * scale;

        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        return new Vec(x, y, Z);
    }

    update() {
        this.pos.components[2] -= this.vel;
        this.pos = this.pos.components[2] < 1 ? this.getPosition() : this.pos;
        this.screenPos = new Vec(this.pos.components[0], this.pos.components[1])
            .div(new Vec(this.pos.components[2], this.pos.components[2]))
            .add(CENTER);

        this.size = (Z - this.pos.components[2]) / (this.pos.components[2] * 0.2);
        this.pos.rotateXY(0.003);
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.screenPos.components[0], this.screenPos.components[1], this.size, this.size);
    }
}

class Space {
    constructor() {
        this.stars = new Array(STARS).fill(null).map(() => new Star());
    }

    update() {
        this.stars.forEach((star) => star.update());
    }

    draw(ctx) {
        this.stars.forEach((star) => star.draw(ctx));
    }

    run(ctx) {
        this.update();
        this.stars.sort((a, b) => b.pos.components[2] - a.pos.components[2]);
        this.draw(ctx);
    }
}

const canvas = new Canvas(document.querySelector("section.header > div.background > canvas"));
canvas.draw();


// Créez l'élément audio en JavaScript
// Créez l'élément audio en JavaScript
const audio = new Audio('./audio/spaceship-cruising-ufo-7176.mp3');
let isAudioPlaying = false; // Suivez l'état de lecture de l'audio

// Fonction pour gérer le fondu en silence
function fadeOutAndPause() {
    if (audio.volume > 0.05) {
        audio.volume -= 0.05; // Diminue progressivement le volume
        setTimeout(fadeOutAndPause, 35); // Appel récursif
    } else {
        audio.pause(); // Mettez en pause une fois que le volume est bas
        audio.volume = 1; // Réinitialisez le volume
    }
}

// Sélectionnez l'élément que vous souhaitez observer
const elementToObserve = document.querySelector("section.header > div.background > canvas");

// Configuration de l'IntersectionObserver
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            if (!isAudioPlaying) {
                // L'élément est devenu visible, jouez l'audio depuis le début
                audio.currentTime = 0; // Revenir au début de l'audio
                audio.volume = 1; // Réglez le volume à 1 (volume complet)
                audio.play();
                isAudioPlaying = true;
            }
        } else {
            if (isAudioPlaying) {
                // L'élément est hors de vue, commencez le fondu en silence
                fadeOutAndPause();
                isAudioPlaying = false;
            }
        }
    });
}, { threshold: 0.5 }); // Vous pouvez ajuster le seuil selon vos besoins

// Commencez à observer l'élément cible
observer.observe(elementToObserve);



