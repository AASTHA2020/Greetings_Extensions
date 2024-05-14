document.addEventListener("DOMContentLoaded", () => {
  const greetingText = document.getElementById("greeting-text");
  const timeDisplay = document.getElementById("time-display");
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const bgVideo = document.getElementById("bg-video");
  const locationIcon = document.getElementById("location-icon"); // Reference to location icon

  function updateTime() {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(`http://worldtimeapi.org/api/timezone/${userTimeZone}`)
      .then(response => response.json())
      .then(data => {
        const currentDateTime = new Date(data.utc_datetime);
        const hours = currentDateTime.getHours();
        const minutes = currentDateTime.getMinutes();
        const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        const greeting = getGreeting(hours);
        greetingText.textContent = greeting;
        timeDisplay.textContent = formattedTime;

        // Determine video based on time of day and update video source
        let videoSource = '';
        if (hours < 12) {
          videoSource = 'morning.mp4';
        } else if (hours < 18) {
          videoSource = 'afternoon2.mp4';
        } else {
          videoSource = 'evening.mp4';
        }
        bgVideo.setAttribute('src', videoSource);

        // Show location icon if geolocation is available
        if (navigator.geolocation) {
          locationIcon.style.display = 'inline-block';
        } else {
          locationIcon.style.display = 'none';
        }
      })
      .catch(error => {
        console.error("Error fetching time:", error);
        // Default to India's time if fetching fails
        updateTime("Asia/Kolkata");
      });
  }

  // Call updateTime initially to avoid delay
  updateTime();

  // Call updateTime every minute to keep the time updated
  setInterval(updateTime, 60000);

  // Fetch quote from Quotable API
  fetch("https://api.quotable.io/random")
    .then(response => response.json())
    .then(data => {
      quoteText.textContent = `"${data.content}"`;
      quoteAuthor.textContent = `- ${data.author}`;
    })
    .catch(error => {
      console.error("Error fetching quote:", error);
    });

  // Function to get appropriate greeting based on time
  function getGreeting(hours) {
    if (hours < 12) {
      return "Good Morning, Rise and Shine!🌻";
    } else if (hours < 18) {
      return "Hi there! Good afternoon!🌈";
    } else {
      return "Good Evening Champ!😊";
    }
  }
});
