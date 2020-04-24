// declare function to render saved notes from db.json
function renderNotes() {
    // ajax GET call
    $.ajax({
            url: "/api/notes",
            method: "GET"
        })
        // returns the storedNotes array from server which contains db.json array
        .then(function(notesData) {
            console.log(notesData);

            // for loop to create elements to append to html
            for (var i = 0; i < notesData.length; i++) {
                var noteList = $("#noteList");
                var listItem = $("<li class='list-group-item mt-4'>");
                listItem.append(
                    $(`<p class="id-text">`).text(notesData[i].id),
                    $("<h4>").text(notesData[i].title),
                    $(`<p>`).text(notesData[i].text),
                    $(`<button class="delete-button float-right">`).text("Delete")
                );
                noteList.append(listItem);
            }
        });
}

// declare function to get current saved notes after a specific note has been deleted
function getNewNotesArray(deletedNoteID) {
    // ajax DELETE request sending the deletedNoteID to server so server can remove ID from db.json
    $.ajax({
            url: "/api/notes/" + deletedNoteID,
            method: "DELETE"
        })
        .then(function(notesData) {
            console.log(notesData);
        })
}

// declare function to delete all saved notes
function clearNotes() {
    // ajax DELETE request
    $.ajax({
        url: "/api/clear",
        method: "DELETE"
    }).then(function(deleteResponse) {
        alert(deleteResponse);
        // clear html elements
        $("#noteList").empty();
    });
}

// document listener for when created delete button is clicked
$(document).on("click", ".delete-button", function(e) {
    // prevent bubbling
    e.stopPropagation();
    // declare variable to store the id of the note being clicked on
    var deletedNoteID = e.target.parentElement.firstElementChild.innerText;
    console.log(deletedNoteID);
    // remove note element being clicked on
    e.target.parentElement.remove();
    // pass the deletedNoteID into array for ajax request
    getNewNotesArray(deletedNoteID);
});

$(".clear-button").on("click", clearNotes);

renderNotes();