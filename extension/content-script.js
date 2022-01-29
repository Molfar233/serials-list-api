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

const button = (text, name = '', status= '', id='', serialLink, index) => {
  const btn = document.createElement('BUTTON');
  btn.className = `serial-ext serial-ext-${index}`;
  if (status === name) btn.classList.add('active');
  if (name === 'viewed') btn.style.marginRight = '10px';
  if (name === 'watching') btn.style.marginLeft = '10px';
  btn.textContent = text;
  btn.setAttribute('data-name', serialLink.innerText);
  btn.setAttribute('data-status', status === name ? status : '');
  btn.setAttribute('data-id', id);
  btn.onclick = () => {
    if (btn.getAttribute('data-status') === name) {
      deleteSerial(btn);
      btn.setAttribute('data-status', '');
      btn.setAttribute('data-id', '');
      btn.classList.remove('active');
    } else {
      updateSerial(name, serialLink, (_id) => {
        btn.setAttribute('data-id', _id);
        const btns = document.querySelectorAll(`.serial-ext-${index}`)
        btns.forEach(bttn => {
          bttn.setAttribute('data-status', '');
          bttn.classList.remove('active');
        })
        btn.setAttribute('data-status', name);
        btn.classList.add('active');
      });
    }
  };

  return btn;
}

const initButtons = () => {
  const serialsList = document.querySelectorAll('.post-home, .opisanie');
  serialsList.forEach((serial, index) => {
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
      const buttons = {
        viewed: 'Просмотрено',
        bookmarked: 'В закладки',
        watching: 'Смотрю'
      };

      Object.entries(buttons).forEach(entry => {
        const [key, value] = entry;
        const btn = button(
          value,
          key,
          status,
          id,
          serialLink,
          index
        );
        serial.appendChild(btn);
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .serial-ext {
      background-color: #ec7263;
      color: #fff;
    }
    .serial-ext:hover {
      background-color: #ec7263;
      color: #fff;
    }
    .serial-ext.active {
      background-color: #75c71b;
      color: #fff;
    }
  `;
  document.body.appendChild(style);
  initButtons();
});
