// add a result to an unordered list
function addResult(ul, typestr, url, title) {
  let li = document.createElement('li');
  li.textContent = typestr + ': ';
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  li.appendChild(a);
  ul.appendChild(li);
}

// call loadfunc on an botb API xmlhttprequest for the given endpoint
function searchEndpoint(endpoint, query, loadfunc) {
  let req = new XMLHttpRequest();
  req.addEventListener('load', (event) => loadfunc(req));
  req.open('GET', 'https://battleofthebits.org/api/v1/' + endpoint + encodeURIComponent(query));
  req.responseType = 'json';
  req.send();
}

// run when dom content loads
window.addEventListener('DOMContentLoaded', (event) => {
  const query = new URLSearchParams(window.location.search).get('q');
  if (query) {
    const qinput = document.getElementById('qinput');
    qinput.value = query;
    const results = document.getElementById('results');
    searchEndpoint('battle/search/', query, (req) =>
      req.response.forEach(e => addResult(results, 'Battle', e.url, e.title)));
    searchEndpoint('botbr/search/', query, (req) =>
      req.response.forEach(e => addResult(results, 'BotBr', e.profile_url, e.name)));
    searchEndpoint('entry/search/', query, (req) =>
      req.response.forEach(e => addResult(results, 'Entry', e.profile_url, e.title)));
    searchEndpoint('group_thread/search/', query, (req) =>
      req.response.forEach(e => addResult(results, 'Thread',
        'https://battleofthebits.org/academy/GroupThread/' + e.id + '/', e.title)));
    searchEndpoint('lyceum_article/search/', query, (req) =>
      req.response.forEach(e => addResult(results, 'Lyceum', e.profile_url, e.title)));
  }
});
