let statusMap = new Map();

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

// update status for search type
function setStatus(typestr, status) {
  statusMap.set(typestr, status);
  let p = document.querySelector('#status');
  let vs = [...statusMap.values()];
  if (vs.includes('waiting')) {
    p.textContent = 'Searching...';
  } else if (vs.includes('error')) {
    p.textContent = 'API error!';
  } else {
    p.textContent = 'Done!';
  }
}

// call loadfunc on an botb API xmlhttprequest for the given endpoint
function searchEndpoint(endpoint, query, typestr, loadfunc) {
  setStatus(typestr, 'waiting');
  fetch('https://battleofthebits.com/api/v1/' + endpoint + encodeURIComponent(query.trim()))
    .then(response => {
      setStatus(typestr, 'done');
      response.json().then(loadfunc);
    })
    .catch(error => {
      setStatus(typestr, 'error');
    });
}

// run when dom content loads
window.addEventListener('DOMContentLoaded', (event) => {
  const query = new URLSearchParams(window.location.search).get('q');
  if (query) {
    const qinput = document.getElementById('qinput');
    qinput.value = query;
    const results = document.getElementById('results');
    searchEndpoint('battle/search/', query, 'Battle', (data) =>
      data.forEach(e => addResult(results, 'Battle', e.url, e.title)));
    searchEndpoint('botbr/search/', query, 'BotBr', (data) =>
      data.forEach(e => addResult(results, 'BotBr', e.profile_url, e.name)));
    searchEndpoint('entry/search/', query, 'Entry', (data) =>
      data.forEach(e => addResult(results, 'Entry', e.profile_url, e.title)));
    searchEndpoint('group_thread/search/', query, 'Thread', (data) =>
      data.forEach(e => addResult(results, 'Thread',
        'https://battleofthebits.com/academy/GroupThread/' + e.id + '/', e.title)));
    searchEndpoint('lyceum_article/search/', query, 'Lyceum', (data) =>
      data.forEach(e => addResult(results, 'Lyceum', e.profile_url, e.title)));
  }
});
