const main = document.getElementById('isi-data');
const sourceSelector = document.querySelector('#sourceSelector');

const DEFAULT_SOURCE = 'bbc-news';
const API_KEY = 'cf06a129b8574842b2daf9089458e3f2'

window.addEventListener('load', async e => {
  updateNews();
  await updateSources();
  sourceSelector.value = DEFAULT_SOURCE;

  sourceSelector.addEventListener('change', e => {
    updateNews(e.target.value);
  });

  if ('serviceWorker' in navigator) {
    try {
      navigator.serviceWorker.register('sw.js');
    } catch (error) {
      console.error(`SW registration failed`);
    }
  }
});

async function updateNews(source = DEFAULT_SOURCE) {
  const res = await fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${API_KEY}`);
  const json = await res.json();

  main.innerHTML = json.articles.map(createArticle).join('\n');
}

async function updateSources() {
  const res = await fetch('https://newsapi.org/v1/sources?apiKey=${API_KEY}');
  const json = await res.json();

  sourceSelector.innerHTML = json.sources.map(src => `
    <option value="${src.id}">${src.name}</option>
  `)
}

function createArticle(article) {
  if (article.urlToImage) return `
    <div class="col-md-6">
      <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
        <div class="col-auto">
          <img class="bd-placeholder-img" src="${article.urlToImage}" alt="" width="100%" height="265px">
        </div>
        <div class="col p-3 d-flex flex-column position-static">
          <strong class="d-inline-block mb-2 text-danger"></strong>
           <h3 class="mb-0">${article.title}</h3>
          <div class="mb-2 text-muted" style="font-size:9pt"></div>
          <p class="card-text mb-10" style="font-size:11pt">${article.description}</p>
          <a class="btn btn-outline-dark stretched-link" href="${article.url}" style="font-size: 10pt;">Read More..</a>
        </div>
      </div>
    </div>
  `
  // else return `
  //   <div class="col-md-6">
  //     <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
  //       <div class="col p-3 d-flex flex-column position-static">
  //         <strong class="d-inline-block mb-2 text-danger">Sport</strong>
  //          <h3 class="mb-0">${article.title}</h3>
  //         <div class="mb-2 text-muted" style="font-size:9pt">March 11</div>
  //         <p class="card-text mb-10" style="font-size:11pt">${article.description}</p>
  //         <a class="btn btn-outline-dark stretched-link" href="${article.url}" style="font-size: 10pt;">Read More..</a>
  //       </div>
  //       <div class="col-auto d-none d-lg-block">
  //         <p>No image</p>
  //       </div>
  //     </div>
  //   </div>
  //   `
}