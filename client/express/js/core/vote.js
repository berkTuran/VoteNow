$(document).ready(() => {


    let model = {};
    model.status = true;
    var election = {};
    let electionId = localStorage.getItem("vote-election-id");
    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections", model)
        .then(e => {
            e.result.forEach(element => {
                if (element.electionId == electionId) {
                    election = element;
                }
            });
            election.candidates.forEach(candidate => {
                let row = $("#candidate-list");
                row.append(
                    `<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
                    <p style="text-align:center;"><img src="${candidate.profileImageUrl}"  width="200" height="200"> </img> </p>
                        <h2 style="text-align:center;">${candidate.firstName + " " + candidate.lastName}</h2>
                                <p style="text-align:center;" >${candidate.bio}</p> 
                    <div style="text-align:center;" id='submit-button'><a class="btn btn--primary" data-field='${candidate.id}'>
                        <span class="btn__text" data-field='${candidate.lastName}'>Vote Now</span></a></div></div>`);
            });
        });

        $("#submit-button").on("click", async() => {
            let model = {};
            model.electionId = electionId;
            model.userId = localStorage.getItem('id')
            model.candidateId = $("#submit-button").attr("data-field")
            console.log(model)
            if (model.email === "") {
                alert("Required value can't be left blank.");
            }
    
            let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/voteElection", model);
            console.log(result)
            if (!!result.error) {
                alert(result.error.message);
            } else {
                location.href = "/home.html";
            }
    
        });
});






