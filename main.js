const debounce = (fn, debounceTime) => {
    let time;
    return function () {
        const funcCall = () => { fn.apply(this, arguments) }
        clearTimeout(time)
        time = setTimeout(funcCall, debounceTime)
    }
};

function createElement(elTag, elClass) {
    const el = document.createElement(elTag)
    if (elClass) {
        el.classList.add(elClass)
    }
    return el
}

const searchInput = createElement('input', 'search-input')
searchInput.addEventListener('keyup', debounce(searchRepo, 500));
const repo_per_page = 5;

const wrapper = document.getElementById('wrapper')
wrapper.appendChild(searchInput)
const result = createElement('div', 'result')
const repoList = createElement('ul', 'repo-list')
result.appendChild(repoList)
wrapper.appendChild(result)
const addedList = createElement('ul', 'added-list')
wrapper.appendChild(addedList)

function createRepo(repoData) {
    if (repoData != undefined) {
        let repoListItems = document.querySelectorAll('.repo');
        if (repoListItems.length >= 5) {
            repoList.innerHTML = '';
        }
        let repoEl = createElement('li', 'repo');
        repoEl.innerHTML = `${repoData.name}`;
        repoList.appendChild(repoEl);
    } else {
        repoList.innerHTML = '';
    }
    const listRepo = document.querySelectorAll('.repo');
    let arr = Array.from(listRepo);
    arr.forEach((item) => {
        item.addEventListener('click', function (e) {
            let addedRepo = createElement('li', 'addRepo')
            if (repoData.name === this.innerHTML) {
                addedRepo.innerHTML =
                    `
                    <div>
                    Name: ${repoData.name}\n
                    Owner: ${repoData.owner.login}\n
                    Stars: ${repoData.stargazers_count}\n
                    </div>
                    <div class='delete'>
                        <span>
                            <div class='delete__part-one'></div>
                            <div class='delete__part-two'></div>
                        </span>
                    </div>
                    `
                addedList.appendChild(addedRepo)
                let img = document.querySelectorAll('.delete')
                let arr = Array.from(img);
                arr.forEach((item) => {
                    item.addEventListener('click', function () {
                        item.parentNode.remove()
                    });
                });
            }
        }
        );
    })
}
async function searchRepo() {
    if (this.value != false) {
        return await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}&per_page=${repo_per_page}`).then((res) => {
            if (res.ok) {
                res.json().then(res => {
                    res.items.forEach(repo => {
                        createRepo(repo)
                    });
                })
            } else {
                return null
            }
        })
    }
}