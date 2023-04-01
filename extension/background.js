//const url = 'https://stark-everglades-31197.herokuapp.com';
const url = 'http://192.168.88.179:3000';

let token;
chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  if (chrome.extension.lastError) console.log(chrome.extension.lastError);
  if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
  if (cookie) token = cookie.value;
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'send-serial') {
    chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  	if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);4
      console.log(cookie);
      if (cookie) token = cookie.value;
      if (!token.length) return sendResponse({ error: 'token' });
    
      fetch(`${url}/serials?st=${message.status}&link=${message.link}&name=${message.name}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `token=${token}`
        }, 
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        sendResponse(data);
      });
    })
  }

  if (message.type === 'set-token') {
    token = message.token;

    chrome.cookies.set({
    	name: "token",
    	url: url,
   	value: message.token
    }, function(cookie) {
      if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
      token = cookie.value;  
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
      console.log(cookie);
      if (cookie) token = cookie.value;
      if (!token.length) return sendResponse({ error: 'token' });

      fetch(`${url}/serials?link=${message.link}&name=${message.name}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `token=${token}`
        },
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        sendResponse(data);
      });
    })
  }

  if (message.type === 'destroy-serial') {
    chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  	if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
      console.log(cookie);
      if (cookie) token = cookie.value;
      if (!token.length) return sendResponse({ error: 'token' });
      
      fetch(`${url}/serials/${message.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `token=${token}`
        }, 
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        sendResponse(data);
      });
    })
  }

  if (message.type === 'get-serials') {
    chrome.cookies.get({ url: url, name: 'token' }, function(cookie) {
  	if (chrome.extension.lastError) console.log(chrome.extension.lastError);
      if (chrome.runtime.lastError) console.log(chrome.runtime.lastError);
      console.log(cookie); 
      if (cookie) token = cookie.value;
      if (!token.length) return sendResponse({ error: 'token' });
      
      fetch(`${url}/serials${message.st}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": `token=${token}`
        }, 
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
        sendResponse(data);
      });
    })
  }
  return true;
});
