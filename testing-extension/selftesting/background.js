console.log("background.js loaded");

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];
      chrome.tabs.sendMessage({ type: "getDoc" }, function (tab) {
        console.log(tab.url);
      });
    });
  }
});
