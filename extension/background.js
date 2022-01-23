let token = document.cookie.split(';').filter((item) => item.trim().startsWith('token='));

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'send-dorama') {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://localhost:3000/doramas?st=${message.status}&link=${message.link}&name=${message.name}`, true);
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
  }
  return true;
});
