interface DonationAlert {
  donor_name: string;
  amount_cents: number;
  donor_message: string;
}

const alertBox = document.getElementById("alert-box")!;
const donorNameEl = document.getElementById("donor-name")!;
const amountEl = document.getElementById("donation-amount")!;
const messageEl = document.getElementById("donor-message")!;

function connect() {
  // You'd pass this token to the creator in their dashboard
  const SECRET_TOKEN = "temp_token_testcreator"; // Hard-coded for this test

  const ws = new WebSocket(
    `https://a56418e335cf.ngrok-free.app/ws/${SECRET_TOKEN}`
  );

  ws.onopen = () => {
    console.log("Connected to donation server");
  };

  ws.onmessage = (event) => {
    console.log("Received message:", event.data);
    const alert: DonationAlert = JSON.parse(event.data);

    // Trigger the animation
    showAlert(alert);
  };

  ws.onclose = () => {
    console.log("Disconnected. Reconnecting in 5s...");
    setTimeout(connect, 5000); // Simple reconnect logic
  };

  ws.onerror = (err) => {
    console.error("WebSocket Error:", err);
    ws.close();
  };
}

function showAlert(alert: DonationAlert) {
  donorNameEl.textContent = alert.donor_name;
  amountEl.textContent = `donated ${alert.amount_cents}`; // Format this
  messageEl.textContent = alert.donor_message;

  alertBox.classList.remove("hidden");

  // Hide after 5 seconds
  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 5000);
}

connect();
