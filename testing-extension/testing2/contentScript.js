$(document).ready(function () {
  const div = $("<div>").addClass("dropdown");
  const button = $("<button>")
    .addClass("btn btn-secondary dropdown-toggle")
    .attr("id", "dropdownMenu2")
    .attr("data-bs-toggle", "dropdown")
    .attr("aria-expanded", "false")
    .text("Dropdown");

  const ul = $("<ul>")
    .addClass("dropdown-menu")
    .attr("aria-labelledby", "dropdownMenu2");

  const li1 = $("<li>").append(
    $("<button>")
      .text("Favorite 😍")
      .addClass("dropdown-item favorite")
      .attr("type", "button")
  );

  const li2 = $("<li>").append(
    $("<button>")
      .text("For later 🤔")
      .addClass("dropdown-item later")
      .attr("type", "button")
  );

  const li3 = $("<li>").append(
    $("<button>")
      .text("signIn")
      .addClass("dropdown-item signIn")
      .attr("type", "button")
  );

  ul.append(li1, li2, li3);
  div.append(button, ul);
  $("div").append(div);

  $(".favorite").click(function () {
    console.log("favorite");
    chrome.runtime.sendMessage({
      type: "Favorite",
    });
  });

  $(".later ").click(function () {
    chrome.runtime.sendMessage({
      type: "Later",
    });
    console.log("later");
  });

  $(".signIn").click(function () {
    chrome.runtime.sendMessage({
      type: "signIn",
    });
  });
});

// chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//   console.log(response.farewell);
// });
