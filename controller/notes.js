$(".submit").on("click", function(event) {
    event.preventDefault();

    // declare variable with input from html
    var newNote = {
        title: $(".note-title").val().trim(),
        text: $(".note-textarea").val().trim(),
    };

    // ajax post with route, newNote above
    $.post("/api/notes", newNote,
        function(data) {
            // check if data is valid
            if (data) {
                alert("Your note has been saved");
                // Clear the form when submitting
                $(".note-title").val("");
                $(".note-textarea").val("");

            } else {
                alert("Please enter a note");
            }
        });

});