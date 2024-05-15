document.addEventListener("DOMContentLoaded", () => {
  const greetingText = document.getElementById("greeting-text");
  const timeDisplay = document.getElementById("time-display");
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const bgVideo = document.getElementById("bg-video");
  const locationIcon = document.getElementById("location-icon");

  function updateTime(timeZone = null) {
    const userTimeZone = timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
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

        let videoSource = '';
        if (hours < 12) {
          videoSource = 'morning.mp4';
        } else if (hours < 18) {
          videoSource = 'afternoon2.mp4';
        } else {
          videoSource = 'evening.mp4';
        }
        bgVideo.setAttribute('src', videoSource);

        if (navigator.geolocation) {
          locationIcon.style.display = 'inline-block';
        } else {
          locationIcon.style.display = 'none';
        }
      })
      .catch(error => {
        console.error("Error fetching time:", error);
        updateTime("Asia/Kolkata");
      });
  }

  function getLocationAndTime() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          // Use a geolocation to timezone API to get the timezone from coordinates
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
              const userTimeZone = data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
              updateTime(userTimeZone);
            })
            .catch(error => {
              console.error("Error fetching timezone:", error);
              updateTime(); // Fall back to default method
            });
        },
        error => {
          console.error("Error getting location:", error);
          updateTime(); // Fall back to default method
        }
      );
    } else {
      updateTime(); // Fall back to default method if geolocation is not supported
    }
  }

  getLocationAndTime();
  setInterval(getLocationAndTime, 60000);

  fetch("https://api.quotable.io/random")
    .then(response => response.json())
    .then(data => {
      quoteText.textContent = `"${data.content}"`;
      quoteAuthor.textContent = `- ${data.author}`;
    })
    .catch(error => {
      console.error("Error fetching quote:", error);
    });

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
