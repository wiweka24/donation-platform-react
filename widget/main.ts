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
const donorNameEl = document.getElementById("donor-name")!;
const amountEl = document.getElementById("donation-amount")!;
const messageEl = document.getElementById("donor-message")!;
const mediaContainerEl = document.getElementById("media-player-container")!;

let ytPlayer: YT.Player | null = null;
let mediaStopTimer: number | null = null;

(window as any).onYouTubeIframeAPIReady = () => {
  console.log("YouTube API Ready");
  ytPlayer = new YT.Player("youtube-player", {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
      controls: 0,
      modestbranding: 1,
      playsinline: 1,
    },
    events: {
      onReady: onPlayerReady,
    },
  });
};

function onPlayerReady(event: YT.PlayerEvent) {
  console.log("YouTube Player Ready");
  event.target.mute();
}

function getYouTubeVideoId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
}

function connect() {
  // You'd pass this token to the creator in their dashboard
  const urlParams = new URLSearchParams(window.location.search);
  const SECRET_TOKEN = urlParams.get("token");
  console.log(SECRET_TOKEN);

  if (!SECRET_TOKEN) {
    console.error("CRITICAL: No token found in URL.");
    document.body.innerHTML = "<h1>Error: Invalid Widget Token</h1>";
    return;
  }

  const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}${SECRET_TOKEN}`);

  ws.onopen = () => {
    console.log("Connected to donation server");
  };

  ws.onclose = () => {
    setTimeout(connect, 5000);
  };

  ws.onerror = () => {
    ws.close();
  };

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
  donorNameEl.textContent = alert.donor_name;
  amountEl.textContent = `donated ${alert.amount_cents}`; // Format this
  messageEl.textContent = alert.donor_message;
  alertBox.classList.remove("hidden");

  if (mediaStopTimer) {
    clearTimeout(mediaStopTimer);
  }

  if (alert.media_type === "youtube" && alert.media_url && ytPlayer) {
    const videoId = getYouTubeVideoId(alert.media_url);
    console.log(videoId);

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
      ytPlayer.mute();

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

connect();
