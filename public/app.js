$.getJSON("/articles", function(data) {
    for (let i=0; i<data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "<br>" + data[i].author + "<br>" + data[i].time + "</p>");
    }
});

// On article click, 
$(document).on("click", "p", function() {
    // empty notes section and grab data-id attribute
    $("#notes").empty();
    const thisId = $(this).attr("data-id");
    console.log(thisId);

    // Get the article note from the db
    $.ajax({
        method: "GET", 
        url: `articles/${thisId}`
    }).then(function(data) {
        // render a blank note
        const titleText = $("<h2>").text(data.title);
        const titleInput = `<input id='titleinput' name='title' >`;
        const bodyInput = `<textarea id='bodyinput' name='body'></textarea>`;
        const submitButton = `<button data-id='"${data._id}"' id='savenote'>Save Note</button>`
        $("#notes").append(titleText, titleInput, bodyInput, submitButton);
    
        // if there is a note, fill in the fields
        if (data.note) {
            $("#titleinput").val(data.note.title);
            $("#bodyinput").val(data.note.body);
        }
    });
});

// On 'save note' click
$(document).on("click", "#savenote", function() {
    // grab the id
    const thisId = $(this).attr("data-id");

    // Post input fields information to db
    $.ajax({
        method: "POST",
        url: `/articles/${thisId}`,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function(data) {
        // Then empty the notes section
        $("#notes").empty();
    });
    // And clear the input areas
    $("#titleinput").val("");
    $("#bodyinput").val("");
})