'use strict';
const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

class Repository {
  constructor(data) {
    this._data = data;
  }

  fetchContributors() {
    return fetchJSON(this._data.contributors_url);
  }

  render(parent) {
    parent.innerHTML = '';
    const li = createAndAppend('li', parent, { html: 'URL: ' });
    createAndAppend('a', li, {
      html: this._data.html_url,
      href: this._data.html_url,
      id: 'ali',
      target: '_blank'
    });
    createAndAppend('li', parent, { html: 'Name : ' + this._data.name });
    createAndAppend('li', parent, { html: 'Description : ' + this._data.description });
    createAndAppend('li', parent, { html: 'Forks : ' + this._data.forks });
    createAndAppend('li', parent, { html: 'Updated : ' + this._data.updated_at });
  }
}

class Contributor {
  constructor(repoData) {
    this._repoData = repoData;
  }
  render(parent) {
    parent.innerHTML = '';
    for (let i = 0; i < this._repoData.length; i++) {
      const el = createAndAppend('li', parent, { class: 'element' });
      createAndAppend('img', el, { src: this._repoData[i].avatar_url });
      createAndAppend('div', el, { html: this._repoData[i].login, id: 'contributorName' });
      createAndAppend('div', el, { html: this._repoData[i].contributions, id: 'contributionsCounter' });
    }
  }
}

class View {
  constructor() {
    this.main();
  }

  async main() {
    try {
      const root = document.getElementById('root');
      const header = createAndAppend('div', root, { class: 'header' });
      createAndAppend('label', header, { html: 'Select a Repository: ', class: 'labelClass' });
      createAndAppend('select', header, { id: 'select' });

      const container = createAndAppend('div', root, { class: 'container' });
      const errorDiv = createAndAppend('div', container, { class: 'errorDiv' });
      createAndAppend('h3', errorDiv, { id: 'errorText' });

      const informationDiv = createAndAppend('div', container, { class: 'infoDiv' });
      createAndAppend('ul', informationDiv, { id: 'infoUl' });

      const imagesDiv = createAndAppend('div', container, { class: 'imgDiv' });
      createAndAppend('ul', imagesDiv, { id: 'imgUl' });

      const repos = await fetchJSON(url);
      this.setupSelect(repos);
    }
    catch (err) {
      renderError(err);
    }
  }

  setupSelect(repos) {
    const select = document.getElementById('select');
    repos.sort((a, b) => a.name.localeCompare(b.name));

    repos.forEach((repo, i) => {
      createAndAppend('option', select, { html: repos[i].name, value: i });
    });

    select.addEventListener('change', () => {
      this.render(repos[select.value]);
    });
    this.render(repos[0]);
  }

  async render(repoData) {
    try {
      const ulInfo = document.getElementById('infoUl');
      const ulImg = document.getElementById('imgUl');

      const repository = new Repository(repoData);
      const data = await repository.fetchContributors();
      const contributors = new Contributor(data);
      repository.render(ulInfo);
      contributors.render(ulImg);
    }
    catch (err) {
      renderError(err);
    }
  }
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.responseType = 'json';
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status < 400) {
          resolve(req.response);
        } else {
          reject(new Error(req.statusText));
        }
      }
    };
    req.send();
  });
}

function createAndAppend(name, parent, options = {}) {
  const elem = document.createElement(name);
  parent.appendChild(elem);
  Object.keys(options).forEach(key => {
    const value = options[key];
    if (key === 'html') {
      elem.innerHTML = value;
    } else {
      elem.setAttribute(key, value);
    }
  });
  return elem;
}

function renderError(err) {
  const errorText = document.getElementById('errorText');
  errorText.innerHTML = ' Network error :  ' + err.message;
}

window.onload = () => new View();
