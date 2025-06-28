function addEvent() {
    var formData = {};

    // Get all checked checkboxes
    const activity_level = $("input[type='checkbox']:checked");

    // Collect checked values into an array
    activity_level.each(function () {
        formData['activity_level'] = formData['activity_level'] || [];
        formData['activity_level'].push($(this).val());
    });

    // Collect other form data
    formData['date'] = document.getElementById("date").value;
    formData['activity_notice'] = document.getElementById("activity_notice").value;
    formData['activity_intro'] = document.getElementById("activity_intro").value;
    formData['max_participants'] = document.getElementById("max_participants").value;
    formData['phone'] = document.getElementById("phone").value;
    formData['amount'] = document.getElementById("amount").value;

    // Get the selected text from the address dropdown
    const selectElement = $(".address");
    const selectedText = selectElement.find("option:selected").text();
    formData['address'] = selectedText;

    console.log(JSON.stringify(formData));  // Print the JSON data

    // Send the data using fetch
    fetch('./submit_event', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json'  // Ensure the request content type is JSON
        },
        body: JSON.stringify(formData),  // Convert JavaScript object to JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();  // Parse the JSON response
    })
    .then(data => {
        console.log('Response Data:', data);  // Handle the returned data
        if (data.status === 200){
            const id = data.data.insertId
            window.location.href = `./event_content?list_id=${id}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);  // Catch any errors
    });
}
