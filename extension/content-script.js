//
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'serials-reload') {
    initButtons();
  }
  return true;
});

const updateSerial = (status, serial, callback) => {
  chrome.runtime.sendMessage({
    type: 'send-serial',
    status,
    link: serial.href,
    name: serial.innerText
  }, (response) => {
    console.log('received user data', response);
    try {
      const responseJSON = JSON.parse(response);
      if (callback) callback(responseJSON.id);
    } catch (e) {
    }
  });
}

const getSerial = (serial, callback) => {
  chrome.runtime.sendMessage({
    type: 'get-serial',
    link: serial.href,
    name: serial.innerText
  }, (response) => {
    console.log('received user data', response);
    try {
      const responseJSON = JSON.parse(response);
      const status = responseJSON && responseJSON.status;
      const id = responseJSON && responseJSON.id;
      if (callback) callback(status, id);
    } catch (e) {
    }
  })
}

const deleteSerial = (button) => {
  chrome.runtime.sendMessage({
    type: 'destroy-serial',
    id: button.getAttribute('data-id'),
  }, (response) => {
    console.log('received user data', response);
  })
}

const initButtons = () => {
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

    getSerial(serialLink, (status = '', id = '') => {
      const viewed = document.createElement('BUTTON');
      viewed.className = 'serial-ext-viewed';
      viewed.textContent = 'Просмотрено';
      viewed.setAttribute('data-name', serialLink.innerText);
      viewed.style.marginRight = '10px';
      viewed.style.backgroundColor = status === 'viewed' ? '#75c71b' : '#ee867a';
      viewed.setAttribute('data-status', status);
      viewed.setAttribute('data-id', id);
      viewed.onclick = () => {
        if (viewed.getAttribute('data-status') === 'viewed') {
          deleteSerial(viewed);
          viewed.setAttribute('data-status', '');
          viewed.style.backgroundColor = '#ee867a';
        } else {
          updateSerial('viewed', serialLink, (_id) => {
            viewed.setAttribute('data-id', _id);
            viewed.setAttribute('data-status', 'viewed');
            bookmarked.setAttribute('data-status', '');
            watching.setAttribute('data-status', '');
            viewed.style.backgroundColor = '#75c71b';
          });
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
      bookmarked.setAttribute('data-id', id);
      bookmarked.onclick = () => {
        if (bookmarked.getAttribute('data-status') === 'bookmarked') {
          deleteSerial(bookmarked);
          bookmarked.setAttribute('data-status', '');
          bookmarked.style.backgroundColor = '#ee867a';
        } else {
          updateSerial('bookmarked', serialLink, (_id) => {
            bookmarked.setAttribute('data-id', _id);
            bookmarked.setAttribute('data-status', 'bookmarked');
            viewed.setAttribute('data-status', '');
            watching.setAttribute('data-status', '');
            bookmarked.style.backgroundColor = '#75c71b';
          });
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
      watching.setAttribute('data-id', id);
      watching.onclick = () => {
        if (watching.getAttribute('data-status') === 'watching') {
          deleteSerial(watching);
          watching.setAttribute('data-status', '');
          watching.style.backgroundColor = '#ee867a';
        } else {
          updateSerial('watching', serialLink, (_id) => {
            watching.setAttribute('data-id', _id);
            bookmarked.setAttribute('data-status', '');
            viewed.setAttribute('data-status', '');
            watching.setAttribute('data-status', 'watching');
            watching.style.backgroundColor = '#75c71b';
          });
        }
        bookmarked.style.backgroundColor = '#ee867a';
        viewed.style.backgroundColor = '#ee867a';
      };
      watching.style.marginLeft = '10px';
      serial.appendChild(watching);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initButtons();
});
