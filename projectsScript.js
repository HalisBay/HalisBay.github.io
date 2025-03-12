document.addEventListener("DOMContentLoaded", function () {
    const username = "HalisBay";
    const projectGrid = document.querySelector(".project-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let repos = [];
    let filteredRepos = [];
    let manualDescriptions = []; 


    fetch("projects.json")
        .then((response) => {
            if (!response.ok) throw new Error("projects.json not found");
            return response.json();
        })
        .then((data) => {
            manualDescriptions = data;
            return fetch(`https://api.github.com/users/${username}/repos`);
        })
        .then((response) => {
            if (!response.ok) throw new Error("GitHub API Error");
            return response.json();
        })
        .then((data) => {
            repos = data;
            const allowedProjects = manualDescriptions.map(p => p.name.toLowerCase().trim());
            filteredRepos = repos.filter(repo => 
                allowedProjects.includes(repo.name.toLowerCase().trim())
            );
            displayProjects(filteredRepos);
        })
        .catch(error => console.error("Error:", error));

    // Filtreleme butonları
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            filterProjects(filter);
        });
    });

    function filterProjects(filter) {
        let filtered;
        if (filter === "all") {
            filtered = filteredRepos;
        } else {
            filtered = filteredRepos.filter(repo => 
                repo.language?.toLowerCase() === filter.toLowerCase()
            );
        }
        displayProjects(filtered);
    }

    function displayProjects(reposToShow) {
        projectGrid.innerHTML = "";
        reposToShow.forEach(repo => {
            const manualDesc = manualDescriptions.find(p => 
                p.name.toLowerCase() === repo.name.toLowerCase()
            );
            
            const projectCard = document.createElement("div");
            projectCard.className = "project-card";
            projectCard.innerHTML = `
                <h3 class="project-name">${repo.name}</h3>
                <p>${manualDesc?.description || repo.description || "No description"}</p>
                <a href="${repo.html_url}" class="project-link" target="_blank">View on GitHub</a>
            `;
            projectGrid.appendChild(projectCard);
        });
    }
});