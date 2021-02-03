$(document).ready(() => {


    let model = {};
    model.status = true;
    var election = {};
    var rand={};
    
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
                    <div id='submit-button' data-field='${candidate.id}' style="text-align:center;"><a class="btn btn--primary" >
                        <span class="btn__text" >Vote Now</span></a></div></div>`);

            });
        });

    setTimeout(() => {
        $("#submit-button").on("click", async (e) => {
          
            let model2 = {};
            model2.electionId = electionId;
            model2.userId = localStorage.getItem('id')
            model2.candidateId = $("#submit-button").attr("data-field");
            console.log(model2.candidateId);
           

            console.log(model2)


            let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/voteElection", model2);
            console.log(result)
            if (!!result.error) {
                alert(result.error.message);
            } else {
                alert("Vote Success!");
                location.href = "/home.html";
            }

        });
    }, 1000);




});








