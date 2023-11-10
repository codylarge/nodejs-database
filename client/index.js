document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/getAll")
    .then((response) => response.json())
    .then((data) => loadHTMLTable(data["data"]));
});

// NOT WORKING, ADDS LISTENER BUT THEN DOESNT LISTEN
document.getElementById("table").addEventListener("click", (event) => {
  if (event.target.className === "delete-row-btn") {
    console.log("Deleting row with id:", event.target.dataset.id);
    deleteRowById(event.target.dataset.id);
  }

  if (event.target.className === "edit-row-btn") {
    console.log("Editing row with id:", event.target.dataset.id);
    handleEditRow(event.target.dataset.id);
  }
});

function deleteRowById(id) {
  fetch("http://localhost:5000/delete/" + id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload();
      }
    });
}

const addBtn = document.querySelector("#add-name-btn");

addBtn.onclick = () => {
  const nameInput = document.querySelector("#name-input");
  const name = nameInput.value;

  nameInput.value = "";

  fetch("http://localhost:5000/insert", {
    headers: {
      "Content-type": "application/json",
    },
    method: "POST", // send data to backend as post data
    body: JSON.stringify({ name: name }),
  })
    .then((response) => response.json())
    .then((data) => insertRowIntoTable(data["data"]));
};

function insertRowIntoTable(data) {
  console.log(data);
  const table = document.querySelector("table tbody");
  const isTableData = table.querySelector(".no-data");

  let tableHtml = "<tr>";

  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      if (key === "dateAdded") {
        data[key] = new Date(data[key]).toLocaleString();
      }
      tableHtml += `<td>${data[key]}</td>`;
    }
  }

  // Add the buttons
  tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
  tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;

  tableHtml += "</tr>";

  // Check if table is empty
  if (isTableData) {
    table.innerHTML = tableHtml;
  } else {
    const newRow = table.insertRow();
    newRow.innerHTML = tableHtml;
  }
}

function loadHTMLTable(data) {
  const table = document.querySelector("table tbody");

  if (!data || data.length === 0) {
    table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
    return;
  }

  const tableHtml = data
    .map(({ id, name, date_added }) => {
      return `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${new Date(date_added).toLocaleString()}</td>
            <td><button class="delete-row-btn" data-id=${id}>Delete</button></td>
            <td><button class="edit-row-btn" data-id=${id}>Edit</button></td>
        </tr>
    `;
    })
    .join("");

  document.getElementById("table").innerHTML = tableHtml;
}
