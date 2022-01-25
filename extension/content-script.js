const updateDorama = (status, dorama) => {
  chrome.runtime.sendMessage({
    type: 'send-dorama',
    status,
    link: dorama.href,
    name: dorama.innerText
  }, (response) => {
    console.log('received user data', response);
  });
}

const getDorama = (dorama, callback) => {
  chrome.runtime.sendMessage({
    type: 'get-dorama',
    link: dorama.href,
    name: dorama.innerText
  }, (response) => {
    console.log('received user data', response);
    const responseJSON = JSON.parse(response);
    const status = responseJSON && responseJSON.status;
    if (callback) callback(status);
  })
}

const deleteDorama = (dorama) => {
  chrome.runtime.sendMessage({
    type: 'destroy-dorama',
    link: dorama.href,
    name: dorama.innerText
  }, (response) => {
    console.log('received user data', response);
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const doramasList = document.querySelectorAll('.post-home, .opisanie');
  doramasList.forEach(dorama => {
    let doramaLink = dorama.querySelector('a');
    if (!doramaLink) {
      const fullName = document.querySelector('.poloska article h1').innerText;
      const nameArr = fullName.split(' ');
      if (nameArr[nameArr.length - 1].startsWith('(')) nameArr.splice(-1);
      if (nameArr[nameArr.length - 1] === 'дорама') nameArr.splice(-1);
      const name = nameArr.join(' ');
      doramaLink = {
        href: window.location.href,
        innerText: name,
      };
    }

    getDorama(doramaLink, (status = '') => {
      const viewed = document.createElement('BUTTON');
      viewed.className = 'dorama-ext-viewed';
      viewed.textContent = 'Просмотрено';
      viewed.setAttribute('data-name', doramaLink.innerText);
      viewed.style.marginRight = '10px';
      viewed.style.backgroundColor = status === 'viewed' ? '#75c71b' : '#ee867a';
      viewed.setAttribute('data-status', status);
      viewed.onclick = () => {
        if (viewed.getAttribute('data-status') === 'viewed') {
          deleteDorama(doramaLink);
          viewed.setAttribute('data-status', '');
          viewed.style.backgroundColor = '#ee867a';
        } else {
          updateDorama('viewed', doramaLink);
          viewed.setAttribute('data-status', 'viewed');
          bookmarked.setAttribute('data-status', '');
          watching.setAttribute('data-status', '');
          viewed.style.backgroundColor = '#75c71b';
        }
        bookmarked.style.backgroundColor = '#ee867a';
        watching.style.backgroundColor = '#ee867a';
      };
      dorama.appendChild(viewed);

      const bookmarked = document.createElement('BUTTON');
      bookmarked.className = 'dorama-ext-bookmarked';
      bookmarked.textContent = 'В закладки';
      bookmarked.setAttribute('data-name', doramaLink.innerText);
      bookmarked.style.backgroundColor = status === 'bookmarked' ? '#75c71b' : '#ee867a';
      bookmarked.setAttribute('data-status', status);
      bookmarked.onclick = () => {
        if (bookmarked.getAttribute('data-status') === 'bookmarked') {
          deleteDorama(doramaLink);
          bookmarked.setAttribute('data-status', '');
          bookmarked.style.backgroundColor = '#ee867a';
        } else {
          updateDorama('bookmarked', doramaLink);
          bookmarked.setAttribute('data-status', 'bookmarked');
          viewed.setAttribute('data-status', '');
          watching.setAttribute('data-status', '');
          bookmarked.style.backgroundColor = '#75c71b';
        }
        viewed.style.backgroundColor = '#ee867a';
        watching.style.backgroundColor = '#ee867a';
      };
      dorama.appendChild(bookmarked);

      const watching = document.createElement('BUTTON');
      watching.className = 'dorama-ext-watching';
      watching.textContent = 'Смотрю';
      watching.setAttribute('data-name', doramaLink.innerText);
      watching.style.backgroundColor = status === 'watching' ? '#75c71b' : '#ee867a';
      watching.setAttribute('data-status', status);
      watching.onclick = () => {
        if (watching.getAttribute('data-status') === 'watching') {
          deleteDorama(doramaLink);
          watching.setAttribute('data-status', '');
          watching.style.backgroundColor = '#ee867a';
        } else {
          updateDorama('watching', doramaLink);
          bookmarked.setAttribute('data-status', '');
          viewed.setAttribute('data-status', '');
          watching.setAttribute('data-status', 'watching');
          watching.style.backgroundColor = '#75c71b';
        }
        bookmarked.style.backgroundColor = '#ee867a';
        viewed.style.backgroundColor = '#ee867a';
      };
      watching.style.marginLeft = '10px';
      dorama.appendChild(watching);
    });
  });
});
