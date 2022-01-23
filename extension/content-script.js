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

    getDorama(doramaLink, (status) => {
      const viewed = document.createElement('BUTTON');
      viewed.className = 'dorama-ext-viewed';
      viewed.textContent = 'Просмотрено';
      viewed.setAttribute('data-name', doramaLink.innerText);
      viewed.style.marginRight = '10px';
      viewed.style.backgroundColor = status === 'viewed' ? '#75c71b' : '#ee867a';
      viewed.onclick = () => {
        updateDorama('viewed', doramaLink);
        viewed.style.backgroundColor = '#75c71b';
        bookmarked.style.backgroundColor = '#ee867a';
        watching.style.backgroundColor = '#ee867a';
      };
      dorama.appendChild(viewed);

      const bookmarked = document.createElement('BUTTON');
      bookmarked.className = 'dorama-ext-bookmarked';
      bookmarked.textContent = 'В закладки';
      bookmarked.setAttribute('data-name', doramaLink.innerText);
      bookmarked.style.backgroundColor = status === 'bookmarked' ? '#75c71b' : '#ee867a';
      bookmarked.onclick = () => {
        updateDorama('bookmarked', doramaLink);
        bookmarked.style.backgroundColor = '#75c71b';
        viewed.style.backgroundColor = '#ee867a';
        watching.style.backgroundColor = '#ee867a';
      };
      dorama.appendChild(bookmarked);

      const watching = document.createElement('BUTTON');
      watching.className = 'dorama-ext-watching';
      watching.textContent = 'Смотрю';
      watching.setAttribute('data-name', doramaLink.innerText);
      watching.style.backgroundColor = status === 'watching' ? '#75c71b' : '#ee867a';
      watching.onclick = () => {
        updateDorama('watching', doramaLink);
        watching.style.backgroundColor = '#75c71b';
        bookmarked.style.backgroundColor = '#ee867a';
        viewed.style.backgroundColor = '#ee867a';
      };
      watching.style.marginLeft = '10px';
      dorama.appendChild(watching);
    });
  });
});
