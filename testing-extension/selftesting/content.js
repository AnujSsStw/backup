function fnAddButtons() {
  var btn = document.createElement("input");
  btn.value = "fuck Mathemafia";
  btn.id = "search-mm-btn";
  btn.type = "submit";
  document.querySelector("#container  h1").appendChild(btn);
}
function fnDefineEvents() {
  document
    .getElementById("search-mm-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();
      return false;
    });
}

setTimeout(function () {
  fnAddButtons();
  fnDefineEvents();
}, 3000);

chrome.extension.onMessage.addListener(function (request, sender, response) {
  if (request.type === "getDoc") {
    console.log(request.doc);
  }

  return true;
});
