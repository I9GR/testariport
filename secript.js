const apiKey = "6823d81f285703d5f580140064bffa81";
let allFlights = [];

let currentPage = 1;
const flightsPerPage = 15;

document.getElementById("fetchBtn").addEventListener("click", getFlights);
document.getElementById("search").addEventListener("input", filterFlights);
document.getElementById("loading").classList.add("d-none");

async function getFlights() {
  const airport = document.getElementById("airport").value;
  const output = document.getElementById("output");
  const loading = document.getElementById("loading");

  if (!airport) {
    output.innerHTML = "الرجاء اختيار مطار.";
    return;
  }

  output.innerHTML = "";
  loading.style.display = "block";

  try {
    const url = `https://api.aviationstack.com/v1/flights?access_key=${apiKey}&arr_iata=${airport}`;
    const res = await fetch(url);
    const data = await res.json();
    allFlights = data.data;
    currentPage = 1;
    showFlights(allFlights);
  } catch {
    output.innerHTML = "حدث خطأ أثناء تحميل البيانات.";
  } finally {
    loading.style.display = "none";
  }
}

function showFlights(flights) {
  const output = document.getElementById("output");
  const pagination = document.getElementById("pagination");

  if (!flights || flights.length === 0) {
    output.innerHTML = "لا توجد رحلات.";
    pagination.innerHTML = "";
    return;
  }

  const start = (currentPage - 1) * flightsPerPage;
  const end = start + flightsPerPage;
  const flightsToShow = flights.slice(start, end);

  let html = `<table><tr>
    <th>رقم الرحلة</th>
    <th>الشركة</th>
    <th>مسار الرحلة</th>
    <th>الوقت</th>
  </tr>`;

  flightsToShow.forEach((flight) => {
    const num = flight.flight?.iata || "-";
    const airline = flight.airline?.name || "-";
    const logo = getAirlineLogo(airline);
    const fromCity = flight.departure?.city || "-";
    const fromCode = flight.departure?.iata || "";
    const toCity = flight.arrival?.city || "-";
    const toCode = flight.arrival?.iata || "";
    const time = (flight.arrival?.scheduled || "").slice(11, 16);

    html += `<tr>
      <td>${num}</td>
      <td>
        ${logo ? `<img src="${logo}" alt="${airline}" style="height:50px; vertical-align:middle; margin-left:8px;">` : ""}
        ${airline}
      </td>
      <td>${fromCity} (${fromCode}) → إلى ${toCity} (${toCode})</td>
      <td>${time}</td>
    </tr>`;
  });

  html += "</table>";
  output.innerHTML = html;

  renderPagination(flights);
}

function renderPagination(flights) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(flights.length / flightsPerPage);

  if (totalPages <= 1) {
    pagination.innerHTML = "";
    return;
  }

  let buttonsHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    buttonsHTML += `<button onclick="goToPage(${i})" ${i === currentPage ? "disabled" : ""}>${i}</button>`;
  }

  pagination.innerHTML = buttonsHTML;
}

function goToPage(page) {
  currentPage = page;
  showFlights(allFlights);
}

function filterFlights() {
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = allFlights.filter(
    (flight) =>
      (flight.flight?.iata || "").toLowerCase().includes(search) ||
      (flight.airline?.name || "").toLowerCase().includes(search)
  );

  currentPage = 1;
  showFlights(filtered);
}

function getAirlineLogo(airlineName) { //الصور الخاصة بالطيران 
  const logos = {
    Saudia: "airline_logos/saudia.png",
    flynas: "airline_logos/flynas.png",
    Flyadeal: "airline_logos/flyadeal.png",
    AirArabia: "airline_logos/arabia.png",
    QatarAirways: "airline_logos/qatar.png",
    flydubai: "airline_logos/dubai.png",
    Emirates: "airline_logos/emirates.png",
    "Oman Air": "airline_logos/Oman.png",
    EgyptAir: "airline_logos/Egyptair.png",
    "Ethiopian Airlines": "airline_logos/Ethiopian.png",
    "Vietnam Airlines": "airline_logos/Vietnam.png",
    Alitalia: "airline_logos/Alitalia.png",
    "Virgin Atlantic": "airline_logos/Virgin Atlantic1.png",
    "Garuda Indonesia": "airline_logos/Garuda.png",

  };

  return logos[airlineName] || "";
}
