// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCs-9UakwRohTlZXlzmRNYjM6_9_UIdJkM",
  authDomain: "donate-feedback.firebaseapp.com",
  projectId: "donate-feedback",
  storageBucket: "donate-feedback.firebasestorage.app",
  messagingSenderId: "122703118861",
  appId: "1:122703118861:web:cf4169cebc71a746650b44"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Отправка фидбэка
function submitFeedback(event) {
  event.preventDefault();
  const message = document.getElementById("feedback-message").value;
  const mood = document.querySelector("input[name='mood']:checked")?.value;
  if (!message || !mood) return;

  const feedbackRef = database.ref("feedbacks");
  const newFeedback = feedbackRef.push();
  newFeedback.set({
    message,
    mood,
    timestamp: Date.now()
  });

  document.getElementById("feedback-form").reset();
  alert("Thanks for your feedback!");
}

document.getElementById("feedback-form").addEventListener("submit", submitFeedback);
