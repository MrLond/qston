const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3pvltinLJIsHPvPrwbpOw7r7wqMfrsjLjNfpKQTErP0ZHoROj28ZeTkjn4hZgISYaBiMl30Z3UdIP/pub?gid=0&single=true&output=csv";
let lastUpdated = Date.now();

// Загружаем предыдущее состояние из localStorage
let previousData = JSON.parse(localStorage.getItem("previousData")) || [];

function updateTimeSinceRefresh() {
  const now = Date.now();
  const diff = Math.floor((now - lastUpdated) / 1000);
  let text = "Updated just now";

  if (diff >= 60) {
    const mins = Math.floor(diff / 60);
    text = `Updated ${mins} minute${mins === 1 ? "" : "s"} ago`;
  } else if (diff > 0) {
    text = `Updated ${diff} second${diff === 1 ? "" : "s"} ago`;
  }

  document.getElementById("last-update").textContent = text;
}

setInterval(updateTimeSinceRefresh, 1000);

function loadLeaderboard() {
  fetch(`${sheetURL}&t=${Date.now()}`)
    .then(res => res.text())
    .then(csv => {
      const rows = csv.trim().split("\n").slice(1);
      const data = rows.map(row => {
        const cols = row.split(",");
        return {
          nickname: cols[1]?.trim(),
          amount: parseInt(cols[2])
        };
      });

      data.sort((a, b) => b.amount - a.amount);

      const list = document.getElementById("leaderboard");
      list.innerHTML = "";

      data.slice(0, 10).forEach((entry, index) => {
        const li = document.createElement("li");

        if (index === 0) li.classList.add("first");
        else if (index === 1) li.classList.add("second");
        else if (index === 2) li.classList.add("third");

        const prevEntry = previousData.find(e => e.nickname === entry.nickname);

        if (!prevEntry) {
          li.classList.add("new-entry");
        } else if (prevEntry.amount !== entry.amount) {
          const prevIndex = previousData.indexOf(prevEntry);
          if (prevIndex > index) {
            li.classList.add("moved-up");
          } else if (prevIndex < index) {
            li.classList.add("moved-down");
          }
        }

        li.innerHTML = `
          <span>${entry.nickname}</span>
          <span><img src="robux.png" class="rbx">${entry.amount}</span>
        `;
        list.appendChild(li);
      });

      // Обновляем предыдущее состояние и сохраняем его
      previousData = data.slice(0, 10);
      localStorage.setItem("previousData", JSON.stringify(previousData));

      lastUpdated = Date.now();
      updateTimeSinceRefresh();
    });
}

loadLeaderboard();
setInterval(() => {
  loadLeaderboard();
}, 15000);


