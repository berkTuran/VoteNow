$(document).ready(() => {
    if (localStorage.getItem("id") != null) {
        location.href = "/main.html";
    }

    $("#submit-button").on("click", async() => {
        let model = {};
        model.email = $("input#email").val();
        console.log(model)
        if (model.email === "") {
            alert("Required value can't be left blank.");
        }

        let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/resetPassword", model);
        console.log(result)
        if (!!result.error) {
            alert(result.error.message);
        } else {
            location.href = "/home.html";
        }

    });
});