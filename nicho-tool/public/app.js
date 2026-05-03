async function analizar() {

  const keyword = document.getElementById("keyword").value;

  const res = await fetch("/analizar", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ keyword })
  });

  const data = await res.json();

  const cont = document.getElementById("resultados");

  cont.innerHTML = data.map(d => `
    <div class="item">
      <strong>${d.keyword}</strong><br>
      Score: ${d.total} | ${d.decision}
    </div>
  `).join("");
}