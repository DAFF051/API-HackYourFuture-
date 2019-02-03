'use strict';
const url = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

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

function main() {
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

  fetchJSON(url)
    .then(setupSelect)
    .catch(renderError);
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

function renderError(err) {
  const errorText = document.getElementById('errorText');
  errorText.innerHTML = ' Network error :  ' + err.message;
}

function setupSelect(repos) {
  const select = document.getElementById('select');
  repos.forEach((repo, i) => {
    createAndAppend('option', select, { html: repos[i].name, value: i });
  });
  select.addEventListener('change', () => {
    getDetails(repos[select.value]);
  });
  getDetails(repos[0]);
}

function getDetails(repo) {
  const ulInfo = document.getElementById('infoUl');
  ulInfo.innerHTML = '';

  const li = createAndAppend('li', ulInfo, { html: 'URL: ' });
  createAndAppend('a', li, {
    html: repo.html_url,
    href: repo.html_url,
    id: 'ali',
    target: '_blank'
  });
  createAndAppend('li', ulInfo, { html: 'Name : ' + repo.name });
  createAndAppend('li', ulInfo, { html: 'Description : ' + repo.description });
  createAndAppend('li', ulInfo, { html: 'Forks : ' + repo.forks });
  createAndAppend('li', ulInfo, { html: 'Updated : ' + repo.updated_at });

  getContributors(repo.contributors_url);
}

function getContributors(url) {
  const ulImg = document.getElementById('imgUl');
  ulImg.innerHTML = '';
  fetchJSON(url)
    .then(contributors => {
      contributors.forEach(contributor => {
        const el = createAndAppend('li', ulImg, { class: 'element' });
        createAndAppend('img', el, { src: contributor.avatar_url });
        createAndAppend('div', el, { html: contributor.login, id: 'contributorName' });
        createAndAppend('div', el, { html: contributor.contributions, id: 'contributionsCounter' });
      });
    })
    .catch(error => renderError(error));
}
window.onload = main;
