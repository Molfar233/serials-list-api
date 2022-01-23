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

document.addEventListener('DOMContentLoaded', () => {
  const doramasList = document.querySelectorAll('.post-home');
  doramasList.forEach(dorama => {
    const doramaLink = dorama.querySelector('a');
    const viewed = document.createElement('BUTTON');
    viewed.textContent = 'Просмотрено';
    viewed.style.marginRight = '10px';
    viewed.onclick = () => {
      updateDorama('viewed', doramaLink);
    };
    dorama.appendChild(viewed);

    const bookmarked = document.createElement('BUTTON');
    bookmarked.textContent = 'В закладки';
    bookmarked.onclick = () => {
      updateDorama('bookmarked', doramaLink);
    };
    dorama.appendChild(bookmarked);

    const watching = document.createElement('BUTTON');
    watching.textContent = 'Смотрю';
    watching.onclick = () => {
      updateDorama('watching', doramaLink);
    };
    watching.style.marginLeft = '10px';
    dorama.appendChild(watching);
  });
});
