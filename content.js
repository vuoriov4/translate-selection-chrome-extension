var waiting_for_user_confirmation = false;
var selectionText = "";
var language = "";
var key = "";

function highlightHandler(e) {
  var t = document.getSelection().toString().trim();
  if (t.length >= 1 && t !== selectionText) {
    chrome.storage.sync.get(['language', 'key', 'enabled'], function(result) {
      language = result.language;
      key = result.key;
      if (!language || !key || !result.enabled) return;
      selectionText = t;
      setText("Translate " + t.length + " characters? (y/n)");
      waiting_for_user_confirmation = true;
    });
  } else removeText();
}

function setText(text) {
  var elem = document.getElementById('plugin-translation');
  if (elem) elem.parentNode.removeChild(elem);
  var div = document.createElement("div");
  div.id = "plugin-translation";
  document.body.appendChild(div);
  div.innerText = text;
}

function removeText() {
  var elem = document.getElementById('plugin-translation');
  if (elem) elem.parentNode.removeChild(elem);
}

function translate(text) {
  var url = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=" + language;
  var skey = key; //"abc5dbed52914a30a7939e5aeea16952";
  var get_guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  fetch(url, {
      method: "POST", // *GET, POST, PUT, DEvarE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, same-origin, *omit
      headers: {
          //"Content-Type": "application/json; charset=utf-8",
          // "Content-Type": "application/x-www-form-urlencoded",
          'Content-Type' : 'application/json',
          'Ocp-Apim-Subscription-Key' : skey,
          'X-ClientTraceId' : get_guid(),
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify ([{'Text' : text}]) // body data type must match "Content-Type" header
  })
  .then(response => { if (response.ok) return response.json(); else throw new Error('Fetch error'); })
  .then(data => {
    if (data.length > 0 && data[0].translations.length > 0) {
      var result = data[0].translations[0].text;
      setText(result);
    }
  })
  .catch(error => {
    setText("[Error]");
  });
}

document.onkeyup = function(e) {
  if (waiting_for_user_confirmation && e.key.toLowerCase() === 'y') {
    setText("[Loading...]");
    translate(selectionText);
    waiting_for_user_confirmation = false;
  }
  else if (waiting_for_user_confirmation && e.key.toLowerCase() === 'n') {
    removeText();
    waiting_for_user_confirmation = false;
  }
}

document.onmouseup = highlightHandler;
