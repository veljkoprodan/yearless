chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      yearMin: 2010,
      yearMax: 2030
    });
  }
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.type === 'getYearRange') {
    chrome.storage.sync.get(['yearMin', 'yearMax'], function(data) {
      sendResponse({
        yearMin: data.yearMin || 2010,
        yearMax: data.yearMax || 2030
      });
    });
    return true;
  }
});
