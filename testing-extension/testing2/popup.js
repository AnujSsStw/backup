const email = $("#exampleFormControlInput1").val("");
const password = $("#inputPassword2").val("");

chrome.storage.sync.get(["key"], function (result) {
  console.log("popup.js");
  console.log(result.key);
  if (true) {
    console.log("Value currently is " + result.key.email);
    $("#exampleFormControlInput1").remove();
    $("#inputPassword2").remove();
    $("#submit").remove();

    const user = $("<div>").addClass("user").text(result.key.email);
    $(".form").append(user);
  } else {
    $("#submit").on("click", function (e) {
      e.preventDefault();
      chrome.runtime.sendMessage(
        {
          type: "signIn",
          email: email.val(),
          password: password.val(),
        },
        (response) => {
          if (response.type === "signIn") {
            console.log(response.user.email);
          }
        }
      );
      setTimeout(function () {
        chrome.storage.sync.get(["key"], function (result) {
          console.log("Value currently is " + result.key.email);
          $("#exampleFormControlInput1").remove();
          $("#inputPassword2").remove();
          $("#submit").remove();

          const user = $("<div>").addClass("user").text(result.key.email);
          $(".form").append(user);
        });
      }, 3000);
    });
  }
});
