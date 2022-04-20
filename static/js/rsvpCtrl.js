const getDetails = () => {
    $.get('/details', (data) => {
        if (data.entree) {
            let entreeField = $("#entree")
            entreeField.val(data.entree)
        }
        if (data.modifications) {
            let modField = $("#modifications")
            modField.val(data.modifications)
        }
    })
}

const submitRsvp = () => {
    $("#submit-rsvp").prop("disabled", true)
    let body = {
        entree: $("#entree").val(),
        modifications: $("#modifications").val()
    }
    $.post('/rsvp', body, (data) => {
        if (data === 'OK') {
            toastr.success("RSVP Saved!")
        } else {
            toastr.error("Failed to save. Please try again later")
        }
        $("#submit-rsvp").prop("disabled", false)
    })
}

getDetails()