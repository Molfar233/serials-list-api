//
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'serials-reload') {
    window.reload()
  }
});

const updateSerial = (status, serial) => {
  chrome.runtime.sendMessage({
    type: 'send-serial',
    status,
    link: serial.href,
    name: serial.innerText
  }, (response) => {
    console.log('received user data', response);
  });
}

const getSerial = (serial, callback) => {
  chrome.runtime.sendMessage({
    type: 'get-serial',
    link: serial.href,
    name: serial.innerText
  }, (response) => {
    console.log('received user data', response);
    const responseJSON = JSON.parse(response);
    const status = responseJSON && responseJSON.status;
    if (callback) callback(status);
  })
}

const deleteSerial = (serial) => {
  chrome.runtime.sendMessage({
    type: 'destroy-serial',
    link: serial.href,
    name: serial.innerText
  }, (response) => {
    console.log('received user data', response);
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const serialsList = document.querySelectorAll('.post-home, .opisanie');
  serialsList.forEach(serial => {
    let serialLink = serial.querySelector('a');
    if (!serialLink) {
      const fullName = document.querySelector('.poloska article h1').innerText;
      const nameArr = fullName.split(' ');
      if (nameArr[nameArr.length - 1].startsWith('(')) nameArr.splice(-1);
      if (nameArr[nameArr.length - 1] === 'дорама') nameArr.splice(-1);
      const name = nameArr.join(' ');
      serialLink = {
        href: window.location.href,
        innerText: name,
      };
    }

    getSerial(serialLink, (status = '') => {
      const viewed = document.createElement('BUTTON');
      viewed.className = 'serial-ext-viewed';
      viewed.textContent = 'Просмотрено';
      viewed.setAttribute('data-name', serialLink.innerText);
      viewed.style.marginRight = '10px';
      viewed.style.backgroundColor = status === 'viewed' ? '#75c71b' : '#ee867a';
      viewed.setAttribute('data-status', status);
      viewed.onclick = () => {
        if (viewed.getAttribute('data-status') === 'viewed') {
          deleteSerial(serialLink);
          viewed.setAttribute('data-status', '');
          viewed.style.backgroundColor = '#ee867a';
        } else {
          updateSerial('viewed', serialLink);
          viewed.setAttribute('data-status', 'viewed');
          bookmarked.setAttribute('data-status', '');
          watching.setAttribute('data-status', '');
          viewed.style.backgroundColor = '#75c71b';
        }
        bookmarked.style.backgroundColor = '#ee867a';
        watching.style.backgroundColor = '#ee867a';
      };
      serial.appendChild(viewed);

      const bookmarked = document.createElement('BUTTON');
      bookmarked.className = 'serial-ext-bookmarked';
      bookmarked.textContent = 'В закладки';
      bookmarked.setAttribute('data-name', serialLink.innerText);
      bookmarked.style.backgroundColor = status === 'bookmarked' ? '#75c71b' : '#ee867a';
      bookmarked.setAttribute('data-status', status);
      bookmarked.onclick = () => {
        if (bookmarked.getAttribute('data-status') === 'bookmarked') {
          deleteSerial(serialLink);
          bookmarked.setAttribute('data-status', '');
          bookmarked.style.backgroundColor = '#ee867a';
        } else {
          updateSerial('bookmarked', serialLink);
          bookmarked.setAttribute('data-status', 'bookmarked');
          viewed.setAttribute('data-status', '');
          watching.setAttribute('data-status', '');
          bookmarked.style.backgroundColor = '#75c71b';
        }
        viewed.style.backgroundColor = '#ee867a';
        watching.style.backgroundColor = '#ee867a';
      };
      serial.appendChild(bookmarked);

      const watching = document.createElement('BUTTON');
      watching.className = 'serial-ext-watching';
      watching.textContent = 'Смотрю';
      watching.setAttribute('data-name', serialLink.innerText);
      watching.style.backgroundColor = status === 'watching' ? '#75c71b' : '#ee867a';
      watching.setAttribute('data-status', status);
      watching.onclick = () => {
        if (watching.getAttribute('data-status') === 'watching') {
          deleteSerial(serialLink);
          watching.setAttribute('data-status', '');
          watching.style.backgroundColor = '#ee867a';
        } else {
          updateSerial('watching', serialLink);
          bookmarked.setAttribute('data-status', '');
          viewed.setAttribute('data-status', '');
          watching.setAttribute('data-status', 'watching');
          watching.style.backgroundColor = '#75c71b';
        }
        bookmarked.style.backgroundColor = '#ee867a';
        viewed.style.backgroundColor = '#ee867a';
      };
      watching.style.marginLeft = '10px';
      serial.appendChild(watching);
    });
  });
});
