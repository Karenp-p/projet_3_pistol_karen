const UPDATE = document.getElementById('update');
const MODAL = document.getElementById('modal');
const GALERIE = document.getElementById('gallery');
const GALERIE1 = document.getElementById('gallery1');
const ADDPHOTO = document.getElementById("add-photo");
const WORKS = document.getElementById('works');
const ADDWORK = document.getElementById("add-work");
const CATEGORY = document.getElementById("categorie");
const SELECTFILE = document.getElementById("select-file");
const CLOSE = document.getElementById("close");
const BACKARROW = document.getElementById("back-arrow");
let token = null;

let workData = null;

recupdata();
checkTocken();
loginLogout();

async function recupdata() {
    
    try{
        const response = await fetch("http://localhost:5678/api/works", {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        workData = data;
        workData.forEach(element => {
            createFigure(GALERIE, element);
        });

        
    }catch(error){
        console.log(error)
    }
}






// FILTRES //

async function createFilters() {
    try {
       
        const response = await fetch("http://localhost:5678/api/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des catégories");
        }

        const categories = await response.json();

        // Création d'un conteneur pour les filtres
        const filtersContainer = document.getElementById("filters-container");
        filtersContainer.innerHTML = ""; 

        // Ajout du bouton "Tous"
        const allButton = document.createElement("button");
        allButton.textContent = "Tous";
        allButton.classList.add("filter-btn");
        allButton.setAttribute("data-category", "Tous");
        filtersContainer.appendChild(allButton);

        // Ajout des boutons pour chaque catégorie
        categories.forEach((category) => {
            const button = document.createElement("button");
            button.textContent = category.name;
            button.classList.add("filter-btn");
            button.setAttribute("data-category", category.id);
            filtersContainer.appendChild(button);
        });

        // Écouteurs d'événements pour filtrer les projets
        document.querySelectorAll(".filter-btn").forEach((button) => {
            button.addEventListener("click", () => {
                const categoryId = button.getAttribute("data-category");
                filterProjects(categoryId);
            });
        });
    } catch (error) {
        console.error("Erreur lors de la création des filtres :", error);
    }
}

// Fonction pour filtrer les projets
function filterProjects(categoryId) {
    GALERIE.innerHTML = ""; // Réinitialiser la galerie

    const filteredData =
        categoryId === "Tous"
            ? workData
            : workData.filter(
                  (project) => project.categoryId.toString() === categoryId
              );

    filteredData.forEach((project) => {
        createFigure(GALERIE, project);
    });
}

// Appel de la fonction pour créer les filtres
createFilters();




function createFigure(parent, work){
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    let figcaption = document.createElement('figcaption');

    img.setAttribute('src', work.imageUrl);
    img.setAttribute('alt', work.title);
    figcaption.textContent = work.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);

    parent.appendChild(figure);
}

// fgonction pour lire le token dans le local stortage
function checkTocken(){
    
    token = localStorage.getItem('token');
    if(token && token != ''){
        UPDATE.style.display = 'flex'
    }
}

function loginLogout(){
    document.getElementById('login-logout').innerHTML = "";
    if(token == null){
        let a = document.createElement('a');
        a.setAttribute('href', './login.html');
        a.textContent = "login";
        document.getElementById('login-logout').appendChild(a);
    }else{
        let a = document.createElement('a');
        a.setAttribute('id', 'logout');
        a.setAttribute('href', '#');
        a.textContent = "logout";
        document.getElementById('login-logout').appendChild(a);
    }
}


UPDATE.addEventListener('click', () => {
     console.log("update click")
     console.log(workData)
    MODAL.style.display = 'flex';
    workData.forEach((element,index) => {
        console.log(element,index)
       createFigureModal(GALERIE1, element);
    });
})

function createFigureModal(parent, work){
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    let i = document.createElement('i');
    
    img.classList.add('img-modal');

    i.classList.add('fa-solid');
    i.classList.add('fa-trash-can');


    img.setAttribute('src', work.imageUrl);
    img.setAttribute('alt', work.title);
   

    figure.appendChild(img);
    figure.appendChild(i);

    parent.appendChild(figure);
}

ADDPHOTO.addEventListener('click', async () => {
    let categorys = await getCategorys();
    WORKS.style.display = 'none';
    ADDWORK.style.display = 'flex';

    categorys.forEach(element => {
        createOption(element);
    });
})

async function getCategorys(){
    try{
        const response = await fetch("http://localhost:5678/api/categories", {
            method: "GET",
            headers:{
                "Content-Type": "application/json",
            }
        });

        const data = await response.json();
        return data;
    }catch(error){
        console.log(error)
    }
}

function createOption(category){
    let option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;

    CATEGORY.appendChild(option);
}

document.getElementById("pick-image").addEventListener('click', () => {
    SELECTFILE.click();
});

SELECTFILE.addEventListener('change', () => {
    let file = SELECTFILE.files[0];

    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
    };

    reader.readAsDataURL(file);


    document.getElementById('img-box').style.display = 'none';

    let img = document.createElement('img');
    img.setAttribute('src', img.src);
    img.setAttribute('alt', "Image selectionnee");

    document.getElementById('img-container').appendChild(img);

    console.log(file)

})

document.getElementById("save-photo").addEventListener('click', async () => {
    const title = document.getElementById('titre').value;
    const category = document.getElementById('categorie').value;
    const file = SELECTFILE.files[0];
    let token = localStorage.getItem('token');

    const formData = new FormData();

    formData.append('image', file)
    formData.append('title', title)
    formData.append('category', category)


    // console.log(title, category, file, token)

    try{
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers:{
               // "Content-Type": "application/json",
               'Authorization': `Bearer ${token}`,
            },
            body: formData,
           
        });

        const data = await response.json();
        console.log(data);

    }catch(error){
        console.log(error)
    }

})


async function login(title, categorie, file, token){
    try{
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
               'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                "image": file,
                "title": title,
                "category": categorie
            })
        });

        const data = await response.json();
        console.log(data);

    }catch(error){
        console.log(error)
    }
}

// fonction pour se deconnecter (supprimer le token du local storage)
function logout(){
    localStorage.removeItem("token");
}

document.getElementById('logout').addEventListener('click', () => {
    logout();
    window.location.href = "index.html";
})

// fonction pour fermer la modal
CLOSE.addEventListener('click', () => {
    MODAL.style.display = "none";
})

// retour sur la modal
BACKARROW.addEventListener('click', () => {
    ADDWORK.style.display = "none";
    WORKS.style.display = "flex";
})


// banderole mode edition qui apparait apres connection 
document.getElementById ("header").style.display = "flex";










// Suppression des élements
// Fonction pour supprimer une image
async function deleteImage(workId, figureElement) {
    let token = localStorage.getItem('token'); 

    if (!token) {
        console.error("Vous devez être connecté pour supprimer une image.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'image.");
        }

        console.log("Image supprimée avec succès.");

        // Suppression de l'élément du DOM
        figureElement.remove();

        // Mise à jour de workData en filtrant l'image supprimée
        workData = workData.filter(work => work.id !== workId);
        location.reload();
    

    } catch (error) {
        console.error("Erreur :", error);
    }
}

// Modification de la fonction createFigureModal pour ajouter l'événement sur l'icône corbeille
function createFigureModal(parent, work) {
    let figure = document.createElement('figure');
    let img = document.createElement('img');
    img.classList.add('img-modal');
    let trashIcon = document.createElement('i');
    trashIcon.classList.add('fa-solid', 'fa-trash-can');

    img.setAttribute('src', work.imageUrl);
    img.setAttribute('alt', work.title);

    // Ajout d'un écouteur sur la corbeille pour supprimer l'image
    trashIcon.addEventListener('click', () => {
        deleteImage(work.id, figure);
    });

    figure.appendChild(img);
    figure.appendChild(trashIcon);
    parent.appendChild(figure);
}