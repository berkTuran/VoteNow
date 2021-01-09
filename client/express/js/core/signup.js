$(document).ready(() => {
    $("#submit-button").click(async() => {
        let model = {};
        model.firstName = $("input#firstName").val();
        model.lastName = $("input#lastName").val();
        model.email = $("input#email").val();
        model.password = $("input#password").val();
        model.validPassword = $("input#valid-password").val();
        model.birthDate = $("input#birthDate").val();
        model.gender = $("input#Gender").val();


        if (model.fullName === "" || model.email === "" || model.password === "" || model.validPassword === "") {
            alert("Required value can't be left blank.");
        } else if (model.password != model.validPassword) {
            alert("Passwords do not match.");
        }

        delete model.validPassword;
        let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/signUp", model);
        if (!!result.error.message) {
            alert(result.error.message);
        } else {
            alert("Success");
            location.href = "/main.html";
        }
    });
});