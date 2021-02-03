const btnAdd = document.querySelector('#btnAdd');
const btnRemove = document.querySelector('#btnRemove');
const sb = document.querySelector('#answerList');
const answer = document.querySelector('#answer');

btnAdd.onclick = (e) => {
    e.preventDefault();

    // validate the option
    if (answer.value == '') {
        alert('Please enter the name.');
        return;
    }
    // create a new option
    const option = new Option(answer.value, answer.value);
    // add it to the list
    sb.add(option, undefined);

    // reset the value of the input
    answer.value = '';
    answer.focus();
};

// remove selected option
btnRemove.onclick = (e) => {
    e.preventDefault();

    // save the selected option
    let selected = [];

    for (let i = 0; i < sb.options.length; i++) {
        selected[i] = sb.options[i].selected;
    }

    // remove all selected option
    let index = sb.options.length;
    while (index--) {
        if (selected[index]) {
            sb.remove(index);
        }
    }
};