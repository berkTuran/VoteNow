$(document).ready(() => {
    var modal = {}
    modal.status = false

    $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getAllElections", modal).then(e => {
        let row = $("#finished");
        for (let i of e.result) {
            if (!i.result)
                continue;

            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>
        
                <h5>${i.electionName}</h5>
                <div id='vote-now'   data-field='${i.electionId}' ><a class="btn btn--primary" ><span class="btn__text" >See Results</span></a></div></div>`
            );
        }
    });


    setTimeout(() => {
        $("div#vote-now").on("click", async (e) => {
            let model2 = {};
            model2.electionId = $(e.currentTarget).attr("data-field")
            let result;
            await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getStats", model2).then(e=>{
                result = e;
            })
            .catch(e=>{
                alert(`bir hata meyadana geldi! ${e.message}`);
           });
        
            localStorage.setItem("electionId", result.electionId);
            location.href = "result.html";
        });
    }, 1000);


});