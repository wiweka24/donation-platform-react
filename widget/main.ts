interface DonationAlert {
  donor_name: string;
  amount_cents: number;
  donor_message: string;
  media_type: "none" | "youtube" | "instagram" | "twitch";
  media_url: string;
  media_start_seconds: number;
  media_end_seconds: number;
}

const alertBox = document.getElementById("alert-box")!;
const titleEl = document.getElementById("donate-title")!;
const messageEl = document.getElementById("donor-message")!;
const mediaContainerEl = document.getElementById("media-player-container")!;

let ytPlayer: YT.Player | null = null;
let mediaStopTimer: number | null = null;

function initYouTubePlayer() {
  console.log("Checking if YouTube API is ready");

  const checkInterval = setInterval(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      console.log("YouTube API found! Initializing player");
      clearInterval(checkInterval);

      try {
        ytPlayer = new YT.Player("youtube-player", {
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 0,
            controls: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onError: (e) => console.error("YouTube Player Error:", e.data),
          },
        });
      } catch (err) {
        console.error("Error creating YT Player:", err);
      }
    }
  }, 100);
}

function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;

  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function connect() {
  const urlParams = new URLSearchParams(window.location.search);
  const SECRET_TOKEN = urlParams.get("token");

  if (!SECRET_TOKEN) {
    document.body.innerHTML = "<h1>Error: Invalid Widget Token</h1>";
    return;
  }

  const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}${SECRET_TOKEN}`);

  ws.onopen = () => console.log("Connected to donation server");
  ws.onclose = () => setTimeout(connect, 5000);
  ws.onerror = () => ws.close();
  ws.onmessage = (event) => {
    try {
      const alert: DonationAlert = JSON.parse(event.data);
      console.log("Received message:", event.data);
      showAlert(alert);
    } catch (e) {
      console.error("Failed to parse alert", e);
    }
  };
}

function showAlert(alert: DonationAlert) {
  titleEl.textContent = `${alert.donor_name} donated ${alert.amount_cents}`;
  messageEl.textContent = alert.donor_message;
  alertBox.classList.remove("hidden");

  if (mediaStopTimer) {
    clearTimeout(mediaStopTimer);
  }

  if (alert.media_type === "youtube" && alert.media_url && ytPlayer) {
    const videoId = getYouTubeVideoId(alert.media_url);

    if (videoId) {
      console.log(
        `Playing video ${videoId} from ${alert.media_start_seconds}s to ${alert.media_end_seconds}s`
      );

      mediaContainerEl.classList.remove("hidden");

      ytPlayer.loadVideoById({
        videoId: videoId,
        startSeconds: alert.media_start_seconds,
      });
      ytPlayer.playVideo();

      const durationMs =
        (alert.media_end_seconds - alert.media_start_seconds) * 1000;

      mediaStopTimer = window.setTimeout(() => {
        console.log("Media time ended. Stopping video.");
        stopAlert();
      }, durationMs);
    } else {
      console.warn("Could not parse YouTube video ID:", alert.media_url);
      setTimeout(stopAlert, 5000);
    }
  } else {
    setTimeout(stopAlert, 5000);
  }
}

function stopAlert() {
  console.log("Stopping alert.");
  alertBox.classList.add("hidden");

  if (ytPlayer) {
    ytPlayer.stopVideo();
  }
  mediaContainerEl.classList.add("hidden");

  if (mediaStopTimer) {
    clearTimeout(mediaStopTimer);
    mediaStopTimer = null;
  }
}

initYouTubePlayer();
connect();
