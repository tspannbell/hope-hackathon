// getOffenses will retrieve all of the reported offenses for Charlotte Mecklenburg Police Department (2019)
const getOffenses = async () => {
  try {
    const resp = await (await fetch("http://localhost:3001/cmpd/offenses")).json();
    return resp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// setOffense will add a single offense to the `.offenses` element
const setOffense = (offenseObject) => {
  const offenses = document.querySelector(".offenses");
  const offenseDiv = document.createElement("div");
  offenseDiv.className = "offense";
  offenseDiv.innerHTML = `
        <p class="title">${offenseObject.offense}</p> 
        <p class="object">${offenseObject.actual} offenses</p>
    `;
  offenses.appendChild(offenseDiv);
};

// setOffenses will get all of the offenses for CMPD and add them to the UI
const setOffenses = async () => {
  let offenses;
  try {
    offenses = await getOffenses();
  } catch (error) {
    console.log(error);
    throw error;
  }

  for (const offense of offenses) {
    setOffense(offense);
  }
};

// getCrimesByRace will retrieve all the crimes for corressponding races.
// this function is asynchronous so we can await the response of the HTTP request (API Call).
// Using try/catch and async await allows us not to use callbacks and resolving promises with then/catch
const getCrimesByRace = async () => {
  try {
    const resp = await (await fetch("http://localhost:3001/crimesByRace")).json();
    return resp;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// setCrime appends a div to the `crimes-by-race` section that contains
// the information for all the crimes
const setCrime = (name, value) => {
  const crimesByRace = document.querySelector(".crimes-by-race");
  const crimeDiv = document.createElement("div");
  crimeDiv.className = "crime";
  crimeDiv.innerHTML = `
        <p>${name}: ${value}</p>  
  `;
  crimesByRace.appendChild(crimeDiv);
};

// Set the offenses from Charlotte Mecklenburg onto the UI
setOffenses();

// This will add an `input` event listener on the `crimes-by-race-select` element when the page first loads
document.querySelector(".crimes-by-race-select").addEventListener("input", async (event) => {
    // Get section element that has a class of `.crimes-by-race`
    const crimesByRaceSection = document.querySelector(".crimes-by-race");
    // If they switch the select element back to the default value, the crimes will disappear
    if (event.target.value === "None") {
      crimesByRaceSection.innerHTML = "";
      return;
    }

    // Get all crimes from our API
    const crimesByRace = await getCrimesByRace();

    // Loop through the `allCrimes` array and if we find a race that matches
    // selected race in our select dropdown, populate the `crimes-by-race` section
    // with all the corressponding crimes
    for (const crimeObject of crimesByRace.allCrimes) {
      if (event.target.value === crimeObject.race) {
        crimesByRaceSection.innerHTML = "";

        // Loop through our `crimes` array field and add each crime to our section element
        for (const crime of crimeObject.crimes) {
          setCrime(crime.name, crime.value);
        }
      }
    }
  });
