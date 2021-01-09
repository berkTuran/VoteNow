$(document).ready(() => {
    $("#add-candidate").createElectionBtn(async(e) => {
        let model = {};
        model.electionname = $("input#elecName").val();
        model.electiondescription = $("input#elecDesc").val();
        model.candidatename = $("input#candName").val();
        model.candidatephoto = $("input#candPhoto").val();
        model.candidatedescription = $("input#candDesc").val();



        if (model.electionname === "" || model.electiondescription === "" ||  model.candidatename === "" || model.candidatedescription === "") {
            alert("Required value can't be left blank.");
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