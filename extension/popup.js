//const url = 'https://stark-everglades-31197.herokuapp.com';
const url = 'http://192.168.88.179:3000';
//const url = 'http://127.0.01:3000';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'get-popup-token') {
    chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  	if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);4
      if (!cookie) return sendResponse({ error: 'token' });

      sendResponse(cookie.value);
    })
  }

  return true;
});

const getSerials = (status) => {
  let st = '';
  if (status) st = `?st=${status}`;
  chrome.runtime.sendMessage({
    type: 'get-serials',
    st
  }, (response) => {
    console.log('received user data', response);
    serials(response);
  });
}

const serials = (list) => {
  const serialsList = document.getElementById('serials') || document.createElement('DIV');
  serialsList.innerHTML = '';
  serialsList.id = 'serials';
  serialsList.className = 'list-group';
  serialsList.style.width = '300px';
  serialsList.style.maxHeight = '250px';
  serialsList.style.overflowY = 'scroll';
  if (Array.isArray(list)) {
    list.forEach(item => {
      const itemA = document.createElement('A');
      itemA.className = 'list-group-item list-group-item-action';
      itemA.href = item.link;
      itemA.textContent = item.name;
      itemA.onclick = () => {
        chrome.tabs.create({url:item.link});
      }
      serialsList.appendChild(itemA);
    });
  } else {
    const viewedCount = list && list.hasOwnProperty('viewed') ? list.viewed : 0;
    const viewed = document.createElement('A');
    viewed.className = 'list-group-item list-group-item-action';
    viewed.href = '#';
    viewed.textContent = `Просмотрено сериалов ${viewedCount}`
    viewed.onclick = (e) => {
      e.preventDefault();
      getSerials('viewed');
    }
    serialsList.appendChild(viewed);

    const bookmarkedCount = list && list.hasOwnProperty('bookmarked') ? list.bookmarked : 0;
    const bookmarked = document.createElement('A');
    bookmarked.className = 'list-group-item list-group-item-action';
    bookmarked.href = '#';
    bookmarked.textContent = `В закладках сериалов ${bookmarkedCount}`
    bookmarked.onclick = (e) => {
      e.preventDefault();
      getSerials('bookmarked');
    }
    serialsList.appendChild(bookmarked);

    const watchingCount = list && list.hasOwnProperty('watching') ? list.watching : 0;
    const watching = document.createElement('A');
    watching.className = 'list-group-item list-group-item-action';
    watching.href = '#';
    watching.textContent = `В просмотре сериалов ${watchingCount}`
    watching.onclick = (e) => {
      e.preventDefault();
      getSerials('watching');
    }
    serialsList.appendChild(watching);
  }

  document.body.appendChild(serialsList);
}

const authForm = () => {
  const auth = document.createElement('FORM');
  auth.name ='Auth';
  auth.className = 'container';
  auth.style.width = '250px';
  auth.style.marginTop = '15px';
  auth.onsubmit = (e) => {
    e.preventDefault();
    const data = new FormData(auth);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${url}/login`);
    xhr.onreadystatechange = (data) => {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = JSON.parse(xhr.response);
        if (response.hasOwnProperty('token')) {
          chrome.runtime.sendMessage({
            type: 'set-token',
            token: response.token,
          }, () => {
            auth.remove();
            getSerials();
          });
        }
      }
    }
    xhr.send(data);
  }

  const divNickname = document.createElement('div');
  divNickname.className = 'mb-3';
  const nickname = document.createElement('INPUT');
  nickname.type = 'TEXT';
  nickname.className = 'form-control';
  nickname.name = 'nickname';
  nickname.placeholder = 'Логин';
  divNickname.appendChild(nickname);
  auth.appendChild(divNickname);

  const divPassword = document.createElement('div');
  divPassword.className = 'mb-3';
  const password = document.createElement('INPUT');
  password.type = 'password';
  password.className = 'form-control';
  password.name = 'password';
  password.placeholder = 'Пароль';
  divPassword.appendChild(password);
  auth.appendChild(divPassword);

  const submit = document.createElement('INPUT');
  submit.type = 'submit'
  submit.className = 'btn btn-primary';
  submit.value = 'Войти'
  auth.appendChild(submit);

  document.body.appendChild(auth);
}

document.addEventListener('DOMContentLoaded', () => {
  chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
    if (chrome.extension.lastError) console.log(chrome.extension.lastError);
    if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);4

    if (cookie) {
      getSerials();
    } else {
      authForm();
    }
  })
})
