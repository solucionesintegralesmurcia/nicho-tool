
async function analizar() {
  const keyword = document.getElementById("keyword").value;

  const res = await fetch("/analizar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keyword })
  });

  const data = await res.json();

  let html = "<h2>Resultados:</h2>";

  data.forEach(r => {
    html += `
      <div>
        <strong>${r.keyword}</strong> 
        | Score: ${r.total} 
        | ${r.decision}
      </div>
    `;
  });

  document.getElementById("resultados").innerHTML = html;
}
