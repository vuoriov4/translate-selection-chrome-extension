var select = document.getElementById('lang');

select.addEventListener('change', onSelectChange);

function onSelectChange(e) {
  console.log(e.target.value);
  chrome.storage.sync.set({language: e.target.value}, function() {
    // ...
  });
}

chrome.storage.sync.get(['language'], function(result) {
  console.log(result.language);
  select.value = result.language;
});

var key = document.getElementById('key');

key.addEventListener('change', onKeyChange);

function onKeyChange(e) {
  console.log(e.target.value);
  chrome.storage.sync.set({key: e.target.value}, function() {
    // ...
  });
}

chrome.storage.sync.get(['key'], function(result) {
  console.log(result.key);
  key.value = result.key;
});

var enabled = document.getElementById('enabled');

enabled.addEventListener('change', onEnabledChange);

function onEnabledChange() {
  console.log(this.checked);
  chrome.storage.sync.set({enabled: this.checked}, function() {
    // ...
  });
}

chrome.storage.sync.get(['enabled'], function(result) {
  console.log(result.enabled);
  enabled.checked = result.enabled;
});
