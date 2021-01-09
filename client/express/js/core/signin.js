$(document).ready(() => {
    $("#submit-button").click(async() => {
        let model = {};
        model.email = $("input#email").val();
        model.password = $("input#password").val();

        if (model.email === "" || model.password === "") {
            alert("Required value can't be left blank.");
        }

        let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/signIn", model);
        if (!!result.error.message) {
            alert(result.error.message);
        } else {
            location.href = "/index.html";
        }
    });
});