const canvas = document.querySelector("canvas");

const context = canvas.getContext('2d');

let xCenter = canvas.width / 2;
let yCenter = canvas.height / 2;

const zoomSpeed = 2;

const stars = [];
const starCount = 100;
const starImage = new Image();
starImage.src = "../image/star.png";
function generateRandomCoordinates() {

    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;

    const vector = { x: x - xCenter, y: y - yCenter };

    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    const normalizedVector = {x: vector.x / magnitude, y: vector.y / magnitude};

    return({x: x, y: y, vector: normalizedVector, speed: Math.random() + 0.5});

}

for (let i = 0; i < starCount; i++) {
    stars.push(generateRandomCoordinates());
}

(function updatePoint() {

    context.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star, index) => {
        if (star.x < -30 || star.x > canvas.width + 30 || star.y < -30 || star.y > canvas.height + 30) {
            stars.splice(index, 1, generateRandomCoordinates());
        } else {
            star.x = star.x + star.vector.x * star.speed;
            star.y = star.y + star.vector.y * star.speed;
        }

        context.drawImage(starImage, star.x, star.y, 3, 3)

    });
    requestAnimationFrame(updatePoint);
})();


const repoList = {};

fetch('https://api.github.com/users/vraiSlophil/repos', {}).then((response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json().then((json) => {
            if (response.ok) {
                json.forEach((repo) => {
                    const repoFullName = repo["full_name"];
                    const repoLink = repo["html_url"];
                    const repoLanguage = repo["language"];
                    repoList[repoFullName] = {repoLink: repoLink, repoLanguage: repoLanguage};
                });
            }
        });
    } else {
        console.error("Missing JSON header.");
    }
});


console.log(repoList);