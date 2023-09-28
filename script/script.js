// const canvas = document.querySelector("canvas");
//
// const context = canvas.getContext('2d');
//
// let xCenter = canvas.width / 2;
// let yCenter = canvas.height / 2;
//
// const zoomSpeed = 2;
//
// const stars = [];
// const starCount = 100;
// const starImage = new Image();
// starImage.src = "../image/star.png";
// function generateRandomCoordinates() {
//
//     const x = Math.random() * canvas.width;
//     const y = Math.random() * canvas.height;
//
//     const vector = { x: x - xCenter, y: y - yCenter };
//
//     const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
//     const normalizedVector = {x: vector.x / magnitude, y: vector.y / magnitude};
//
//     return({x: x, y: y, vector: normalizedVector, speed: Math.random() + 0.5});
//
// }
//
// for (let i = 0; i < starCount; i++) {
//     stars.push(generateRandomCoordinates());
// }
//
// (function updatePoint() {
//
//     context.clearRect(0, 0, canvas.width, canvas.height);
//
//     stars.forEach((star, index) => {
//         if (star.x < -30 || star.x > canvas.width + 30 || star.y < -30 || star.y > canvas.height + 30) {
//             stars.splice(index, 1, generateRandomCoordinates());
//         } else {
//             star.x = star.x + star.vector.x * star.speed;
//             star.y = star.y + star.vector.y * star.speed;
//         }
//
//         context.drawImage(starImage, star.x, star.y, 3, 3)
//
//     });
//     requestAnimationFrame(updatePoint);
// })();
//
//
//
//
// console.log(repoList);
//
// import * as THREE from "three";
//
// let scene, camera, renderer, starGeo, stars;
// const starVertices = [];
//
// function init() {
//     // Création de la scène
//     scene = new THREE.Scene();
//
//     // Configuration de la caméra
//     camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
//     camera.position.z = 1;
//     camera.rotation.x = Math.PI / 2;
//
//     // Configuration du rendu
//     renderer = new THREE.WebGLRenderer();
//     const headerBackground = document.querySelector("section.header > div.background");
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     headerBackground.appendChild(renderer.domElement);
//
//     // Création de la géométrie et des vertices
//     starGeo = new THREE.BufferGeometry();
//
//     for (let i = 0; i < 6000; i++) {
//         let star = new THREE.Vector3(
//             Math.random() * 600 - 300,
//             Math.random() * 600 - 300,
//             Math.random() * 600 - 300
//         );
//         star.velocity = 0;
//         star.acceleration = 0.02;
//         starVertices.push(star.x, star.y, star.z);
//     }
//
//     starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
//
//     // Chargement de la texture
//     const sprite = new THREE.TextureLoader().load('../image/star.png');
//     const starMaterial = new THREE.PointsMaterial({
//         color: 0xaaaaaa,
//         size: 0.07, // Ajustez la taille à votre convenance
//         map: sprite
//     });
//
//     // Création des étoiles avec BufferGeometry
//     stars = new THREE.Points(starGeo, starMaterial);
//     scene.add(stars);
//
//     animate();
// }
//
// // Boucle de rendu
// // Boucle de rendu
// function animate() {
//     starVertices.forEach((_, i) => {
//         starVertices[i] += starVertices[i + 3];
//         starVertices[i + 1] += starVertices[i + 4];
//         starVertices[i + 2] += starVertices[i + 5];
//
//         if (starVertices[i + 2] < -200) {
//             starVertices[i] = Math.random() * 600 - 300;
//             starVertices[i + 1] = Math.random() * 600 - 300;
//             starVertices[i + 2] = 600; // Placez les étoiles au-dessus de la caméra
//         }
//     });
//
//     starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
//     renderer.render(scene, camera);
//     requestAnimationFrame(animate);
// }
//
//
// init();


// starGeo = new THREE.BufferGeometry();
// const positionNumComponents = 3;
// const normalNumComponents = 3;
// const uvNumComponents = 2;
// starGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
// starGeo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
// starGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));


fetch('https://api.github.com/users/vraiSlophil/repos', {})
    .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
        } else {
            throw new Error("Missing JSON header.");
        }
    })
    .then((json) => {
        const repoListHTML = document.querySelector("section.projects > div.repoList");

        json.forEach((repo) => {
            const repoFullName = repo["full_name"];
            const repoDescription = repo["description"];
            const repoLink = repo["html_url"];
            const repoLanguage = repo["language"];

            // Conversion de la date au format lisible
            const isoDate = repo["updated_at"];
            const date = new Date(isoDate);
            // const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
            const options = { year: 'numeric', month: 'long', day: 'numeric'};
            const formattedDate = date.toLocaleDateString('fr-FR', options);

            const repoSize = repo["size"];

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

            const languageElement = document.createElement("p");
            languageElement.classList.add("language");
            languageElement.textContent = repoLanguage;

            const linkElement = document.createElement("a");
            linkElement.classList.add("link");
            linkElement.href = repoLink;
            linkElement.textContent = repoLink;

            const updateElement = document.createElement("p");
            updateElement.classList.add("update");
            updateElement.textContent = `Last Updated: ${formattedDate}`;

            repoElement.append(nameElement, sizeElement, descriptionElement, languageElement, linkElement, updateElement);
            repoListHTML.appendChild(repoElement);
        });
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
