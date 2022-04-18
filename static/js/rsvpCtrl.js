const getDetails = () => {
    $.get('/details', (data) => {
        console.log(data)
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

getDetails()