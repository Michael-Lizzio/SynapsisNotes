// assets/js/popupScript.js

async function sendMessage() {
    const userInput = document.getElementById("userInput").value;
    const responseDiv = document.getElementById("response");
    
    // Clear previous response
    responseDiv.style.display = "none";
    responseDiv.innerHTML = "";

    // Send the user input to the backend (replace 'YOUR_API_ENDPOINT' with your actual backend endpoint)
    try {
        const response = await fetch('YOUR_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();
        const chatGPTResponse = data.response;

        // Display ChatGPT's response
        responseDiv.innerHTML = chatGPTResponse;
        responseDiv.style.display = "block";
    } catch (error) {
        console.error("Error:", error);
        responseDiv.innerHTML = "An error occurred. Please try again.";
        responseDiv.style.display = "block";
    }

    // Clear user input
    document.getElementById("userInput").value = "";
}
