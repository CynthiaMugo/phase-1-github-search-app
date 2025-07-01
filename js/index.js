document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("github-form");
    const searchInput = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const repoList = document.getElementById("repos-list");
    
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const userInput = searchInput.value.trim();
        if (!userInput) return;

        fetchUsers(userInput);
        form.reset();
    });

// fetch users from github API

function fetchUsers(userInput) {
    fetch(`https://api.github.com/search/users?q=${userInput}`)
    .then(response => response.json())
    .then (data => {
        userList.innerHTML = "";
        data.items.forEach(user => displayUser(user));
        // console.log(data)
    })
    .catch(error => {
        console.error("Error fetching GitHub users:", error);
      });
}

// display users in userList
function displayUser(user) {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
    `;

    li.addEventListener("click", () => {
      fetchAndDisplayRepos(user.login);
    });

    userList.appendChild(li);
}
// feth and display repos on clicking the user name
function fetchAndDisplayRepos(username) {
    repoList.innerHTML = `<li>Loading repos for <strong>${username}</strong>...</li>`;

    fetch(`https://api.github.com/users/${username}/repos`)
      .then(response => response.json())
      .then(repos => {
        repoList.innerHTML = ""; // Clear "Loading" message

        if (!repos.length) {
          repoList.innerHTML = `<li><em>No repos found for ${username}.</em></li>`;
          return;
        }

        repos.forEach(repo => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
          repoList.appendChild(li);
        });
      })
      .catch(error => {
        console.error(error);
        repoList.innerHTML = `<li>Error fetching repos for ${username}.</li>`;
      });
  }
});