// Define a default configuration (adjust as needed)
const DEFAULT_CONFIG = {
    calibrationDuration: 5000,
    speechStartThresholdMultiplier: 2,
    speechStopThresholdMultiplier: 1.2,
    speechStartDuration: 2300,
    silenceDuration: 1900,
    minSegmentDuration: 1000,
    minimumRecordingLength: 10000,
    baseLineMultiplier: 1.4,
    apiKey: ""
  };
  
  // Retrieve settings from localStorage or default configuration
  function getConfig() {
    return JSON.parse(localStorage.getItem("settings")) || DEFAULT_CONFIG;
  }
  
  // Retrieve transcript from localStorage (context)
  function getTranscript() {
    return localStorage.getItem("transcript") || "";
  }
  
  // Display a custom notification that slides in from the top right
  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = "popup-notification";
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.classList.add("hide");
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }
  
  // Send user's message along with transcript context to the AI endpoint
  async function sendMessage() {
    const userInputElem = document.getElementById("userInput");
    const userInput = userInputElem.value.trim();
    const responseDiv = document.getElementById("response");
    
    // Clear previous response
    responseDiv.style.display = "none";
    responseDiv.innerHTML = "";
    
    // Get transcript context from localStorage
    const transcriptContext = getTranscript();
    
    // Build the prompt: include transcript context if available
    let prompt = "";
    if (transcriptContext) {
      prompt = `Transcript Context:\n${transcriptContext}\n\nUser: ${userInput}`;
    } else {
      prompt = `User: ${userInput}`;
    }
    
    // Use the API key from settings
    const config = getConfig();
    const apiKey = config.apiKey;
    if (!apiKey) {
      showNotification("No API key configured. Please set it in settings.", "error");
      return;
    }
    
    console.log("Prompt sent to AI:", prompt);
    
    // Send the request to OpenAI's chat completions API (update the endpoint if needed)
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          temperature: 0.5
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch AI response: " + response.statusText);
      }
      
      const data = await response.json();
      const chatResponse = data.choices[0].message.content.trim();
      
      // Display the response
      responseDiv.innerHTML = chatResponse;
      responseDiv.style.display = "block";
      showNotification("Response received!");
    } catch (error) {
      console.error("Error:", error);
      responseDiv.innerHTML = "An error occurred. Please try again.";
      responseDiv.style.display = "block";
      showNotification("Error: " + error.message, "error");
    }
    
    // Clear the input field
    userInputElem.value = "";
  }
  