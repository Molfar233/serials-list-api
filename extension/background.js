const url = 'https://stark-everglades-31197.herokuapp.com';
//const url = 'http://localhost:3000';
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
    token = message.token;
    sendResponse('ok');
    chrome.tabs.query({
      currentWindow: true,
      active: true
    }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        type: 'serials-reload'
      });
    });
  }

  if (message.type === 'get-serial') {
    if (!token.length) return sendResponse({ error: 'token' });
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
    xhr.open('DELETE', `${url}/serials/${message.id}`, true);
    xhr.setRequestHeader("Authorization", token);
    xhr.onreadystatechange = (data) => {
      if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        sendResponse(xhr.response);
      }
    }
    xhr.send(null);
  }

  if (message.type === 'get-serials') {
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
