$(document).ready(() => {
    $("#signup-form").submit(async(e) => {
        let model = {};
        model.fullName = $("input#fullName").val();
        model.email = $("input#email").val();
        model.password = $("input#password").val();
        model.validPassword = $("input#valid-password").val();

        if (model.fullName === "" || model.email === "" || model.password === "" || model.validPassword === "") {
            alert("Required value can't be left blank.");
            e.preventDefault();
        } else if (model.password != model.validPassword) {
            alert("Passwords do not match.");
            e.preventDefault();
        }

        let jsonString = JSON.stringify(model);
        await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/signUp", { jsonString })
            .then(e => {
                //success kısmı
            })
            .catch(e => {
                //fail kısmı
            });
    });
});