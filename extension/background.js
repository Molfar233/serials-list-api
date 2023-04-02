//const url = 'https://stark-everglades-31197.herokuapp.com';
const url = 'http://192.168.88.179:3000';
//const url = 'http://127.0.0.1:3000';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'send-serial') {
    chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  	if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);4
      if (!cookie || !cookie.value) return sendResponse({ error: 'token' });

      fetch(`${url}/serials?st=${message.status}&link=${message.link}&name=${message.name}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `token=${cookie.value}`
        },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        sendResponse(data);
      });
    })
  }

  if (message.type === 'set-token') {
    chrome.cookies.set({
    	name: "token",
    	url: url,
   	    value: message.token
    }, function(cookie) {
      if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
    });
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
    chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  	if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
      if (!cookie || !cookie.value) return sendResponse({ error: 'token' });

      fetch(`${url}/serials/status?link=${message.link}&name=${message.name}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `token=${cookie.value}`
        },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        sendResponse(data);
      });
    })
  }

  if (message.type === 'destroy-serial') {
    chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  	if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
      if (!cookie || !cookie.value) return sendResponse({ error: 'token' });

      fetch(`${url}/serials/${message.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `token=${cookie.value}`
        },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        sendResponse(data);
      });
    })
  }

  if (message.type === 'get-serials') {
    chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  	if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
      if (!cookie || !cookie.value) return sendResponse({ error: 'token' });

      fetch(`${url}/serials${message.st}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `token=${cookie.value}`
        },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        sendResponse(data);
      });
    })
  }
  return true;
});
