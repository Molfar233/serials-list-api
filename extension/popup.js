const getToken = () => {
  return document.cookie.split(';').filter((item) => item.trim().startsWith('token='))
}

const getDoramas = (status) => {
  let st = '';
  if (status) st = `?st=${status}`;
  $.ajax({
    method: 'GET',
    url: `http://localhost:3000/doramas${st}`,
    headers: {
      'Authorization': `${getToken()}`,
      contentType: 'application/json',
    },
    success: (data) => {
      doramas(data);
    },
    error: (data) => {
      console.log(data);
    }
  });
}

const doramas = (list) => {
  const doramasList = document.getElementById('doramas') || document.createElement('DIV');
  doramasList.innerHTML = '';
  doramasList.id = 'doramas';
  doramasList.className = 'list-group';
  doramasList.style.width = '250px';
  if (Array.isArray(list)) {
    console.log(123);
  } else {
    const viewedCount = list && list.hasOwnProperty('viewed') ? list.viewed : 0;
    const viewed = document.createElement('A');
    viewed.className = 'list-group-item list-group-item-action';
    viewed.href = '#';
    viewed.textContent = `Просмотрено дорам ${viewedCount}`
    viewed.onclick = (e) => {
      e.preventDefault();
      getDoramas('viewed');
    }
    doramasList.appendChild(viewed);

    const bookmarkedCount = list && list.hasOwnProperty('bookmarked') ? list.bookmarked : 0;
    const bookmarked = document.createElement('A');
    bookmarked.className = 'list-group-item list-group-item-action';
    bookmarked.href = '#';
    bookmarked.textContent = `В закладках дорам ${bookmarkedCount}`
    bookmarked.onclick = (e) => {
      e.preventDefault();
      getDoramas('bookmarked');
    }
    doramasList.appendChild(bookmarked);

    const watchingCount = list && list.hasOwnProperty('watching') ? list.watching : 0;
    const watching = document.createElement('A');
    watching.className = 'list-group-item list-group-item-action';
    watching.href = '#';
    watching.textContent = `В просмотре дорам ${watchingCount}`
    watching.onclick = (e) => {
      e.preventDefault();
      getDoramas('watching');
    }
    doramasList.appendChild(watching);
  }

  document.body.appendChild(doramasList);
}

const authForm = () => {
  const auth = document.createElement('FORM');
  auth.name ='Auth';
  auth.onsubmit = (e) => {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/login',
      data: $('form').serialize(),
      success: (data) => {
        document.cookie = `token=${data.token}`;
        auth.remove();
        getDoramas();
      },
      error: (data) => {
        console.log(data);
      }
    });
  }

  const nickname = document.createElement('INPUT');
  nickname.type = 'TEXT';
  nickname.name = 'nickname';
  nickname.placeholder = 'Логин';
  auth.appendChild(nickname);

  const password = document.createElement('INPUT');
  password.type = 'password';
  password.name = 'password';
  password.placeholder = 'Пароль';
  auth.appendChild(password);

  const submit = document.createElement('INPUT');
  submit.type = 'submit'
  submit.value = 'Войти'
  auth.appendChild(submit);

  document.body.appendChild(auth);
}

document.addEventListener('DOMContentLoaded', () => {
  const token = getToken();
  if (token.length) {
    getDoramas();
  } else {
    authForm();
  }
})
