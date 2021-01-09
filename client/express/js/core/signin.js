$(document).ready(() => {
    $("#signin-form").submit(async(e) => {
        let model = {};
        model.email = $("input#email").val();
        model.password = $("input#password").val();

        if (model.email === "" || model.password === "") {
            alert("Required value can't be left blank.");
            e.preventDefault();
        } else if (model.password != model.validPassword) {
            alert("Passwords do not match.");
            e.preventDefault();
        }

        let jsonString = JSON.stringify(model);
        // API'ye login eklendiği zaman url değişecek
        // await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/signUp", { jsonString })
        //     .then(e => {
        //         //success kısmı
        //     })
        //     .catch(e => {
        //         //fail kısmı
        //     });
    });
});