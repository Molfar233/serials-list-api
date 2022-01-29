// const url = 'https://stark-everglades-31197.herokuapp.com';
const url = 'http://localhost:3000';
let token = document.cookie.split(';').filter((item) => item.trim().startsWith('token='));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'send-serial') {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${url}/serials?st=${message.status}&link=${message.link}&name=${message.name}`, true);
    xhr.setRequestHeader("Authorization", token);
    xhr.onreadystatechange = (data) => {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        sendResponse(xhr.response);
      }
    }
    xhr.send(null);
  }

  if (message.type === 'set-token') {
    console.log(message)
    token = message.token;
    sendResponse('ok');
    chrome.runtime.sendMessage({
      type: 'serials-reload',
    })
  }

  if (message.type === 'get-serial') {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${url}/serials/status?link=${message.link}&name=${message.name}`, true);
    xhr.setRequestHeader("Authorization", token);
    xhr.onreadystatechange = (data) => {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        sendResponse(xhr.response);
      }
    }
    xhr.send(null);
  }

  if (message.type === 'destroy-serial') {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `${url}/serials/:id?link=${message.link}&name=${message.name}`, true);
    xhr.setRequestHeader("Authorization", token);
    xhr.onreadystatechange = (data) => {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        sendResponse(xhr.response);
      }
    }
    xhr.send(null);
  }

  if (message.type === 'get-serials') {
    console.log(token);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${url}/serials${message.st}`);
    xhr.setRequestHeader("Authorization", token);
    xhr.onreadystatechange = (data) => {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        sendResponse(xhr.response);
      }
    }
    xhr.send(null);
  }
  return true;
});
