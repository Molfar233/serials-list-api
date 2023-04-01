chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'serials-reload') {
    initButtons();
  }
  return true;
});

const updateSerial = (status, serial, callback) => {
  const fullName = serial.innerText;
  const nameArr = fullName.split(' ');
  if (nameArr[nameArr.length - 1].startsWith('(')) nameArr.splice(-1);
  if (nameArr[nameArr.length - 1] === 'дорама') nameArr.splice(-1);
  const name = nameArr.join(' ');
  chrome.runtime.sendMessage({
    type: 'send-serial',
    status,
    link: serial.href,
    name,
  }, (response) => {
    console.log('received user data', response);
    try {
      const responseJSON = response;
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
      const responseJSON = response;
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

const findNodes = (xpath) => {
  const xpathNodes = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
  const nodes = [];
  let node = xpathNodes.iterateNext();
  while (node) {
    nodes.push(node);
    node = xpathNodes.iterateNext();
  }
  return nodes;
}

const findSerialList = () => {
  const xpathYear = "//*[contains(text(),'Год')]";
  const yearNodes = findNodes(xpathYear);

  const xpathCountry = "//*[contains(text(),'Страна:')]";
  const countryNodes = findNodes(xpathCountry);

  const xpathGenre = "//*[contains(text(),'Жанр:')]";
  const genreNodes = findNodes(xpathGenre);
  const list = [];

  if (yearNodes.length > 1 && countryNodes.length > 1 && genreNodes.length > 1) {
    yearNodes.forEach(node => {
      const nodeName = yearNodes[0].nodeName;
      let topNode;
      while (nodeName !== 'BODY') {
        topNode = node;
        node = node.parentNode;
        const yearNodesCount = yearNodes.filter(n => node.contains(n)).length;
        const countryNodesCount = countryNodes.filter(n => node.contains(n)).length;
        const genreNodesCount = genreNodes.filter(n => node.contains(n)).length;
        if (yearNodesCount > 1 && countryNodesCount > 1 && genreNodesCount > 1) {
          list.push(topNode);
          break;
        }
      }
    });

    return list.filter(node => {
      return list.includes(node.nextElementSibling) || list.includes(node.previousElementSibling)
    });
  } else if (
    yearNodes.length === 1 ||
    countryNodes.length === 1 ||
    genreNodes.length === 1) {

    const nodeName = yearNodes[0].nodeName;
    let topNode = yearNodes[0];
    const yearNode = yearNodes[0];
    const countryNode = countryNodes[0];
    const genreNode = genreNodes[0];
    while (nodeName !== 'BODY') {
      if (topNode.contains(yearNode) &&
        topNode.contains(countryNode) &&
        topNode.contains(genreNode) &&
        !!topNode.querySelector('h1')) {
        break;
      }
      topNode = topNode.parentNode;
    }

    return [topNode];
  } else {
    return [];
  }
}

const initButtons = () => {
  const serialsList = findSerialList();
  serialsList.forEach((serial, index) => {
    const buttonsBlock = document.createElement('div');
    let serialLink;
    if (serialsList.length > 1) {
      serialLink = serial.querySelectorAll('a');
      if (serialLink.length === 1) {
        serialLink = serialLink[0];
      } else if (serialLink.length > 1) {
        const serialLinkWithTitle = Array.from(serialLink).filter(link => link.title.length > 2 && serial.innerText.includes(link.title));
        if (serialLinkWithTitle.length === 0) {
          const serialLinkWithHTML = Array.from(serialLink).filter(link => /\.html$/.test(link.href));
          serialLink = serialLinkWithHTML[0];
        } else {
          serialLink = serialLinkWithTitle[0];
        }
      }
    } else {
      const fullName = serial.querySelector('h1').innerText;
      serialLink = {
        href: window.location.href,
        innerText: fullName,
        single: true,
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
        buttonsBlock.appendChild(btn);
      });
    });
    if (serialsList.length > 1) {
      serial.appendChild(buttonsBlock);
    } else {
      serial.insertBefore(buttonsBlock, serial.firstChild);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    .serial-ext, .serial-ext:hover {
      background: #ec7263;
      color: #fff;
      font-family: Arial;
      font-size: 14px;
      font-weight: 400;
      height: 33px;
      line-height: normal;
      padding: 8px 14px;
      text-align: center;
      max-width: 155px;
    }
    .serial-ext.active {
      background: #75c71b;
    }
  `;
  document.body.appendChild(style);
  initButtons();
});
