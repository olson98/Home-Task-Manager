import  apiUrls  from "./apiUrls.js";
export class CommonHelpers {
  //The CommonHelpers class includes all the methods that can be commonly used throughout the entire project.
  apiUrls = new apiUrls();
  checkBoxEventListener(checkBox, confirmButton, tasks) {
    if (checkBox.checked) {
      confirmButton.style.display = "inline-block";
      console.log("Task confirmed:", tasks);
    } else {
      confirmButton.style.display = "none";
    }
  }

  createElements(tasks, tr) {
    let weekNumber = document.getElementById("WeekNumber");
    var checkBox = document.createElement("input");
    checkBox.type = "checkbox"; // Create checkbox
    var confirmButton = document.createElement("button");

    // Create Name cell
    if (tasks.Name != null) {
      let td = document.createElement("td");
      td.textContent = tasks.Name;
      tr.appendChild(td);
    }

    // Create Task_name cell
    if (tasks.Task_name != null) {
      let td = document.createElement("td");
      td.textContent = tasks.Task_name;
      tr.appendChild(td);
    }

    // Create AssignedDate cell
    if (tasks.AssignedDate != null) {
      let td = document.createElement("td");
      td.textContent = this.formatDate(tasks.AssignedDate);
      tr.appendChild(td);
    }

    // Create DueDate cell
    if (tasks.DueDate != null) {
      let td = document.createElement("td");
      td.textContent = this.formatDate(tasks.DueDate);
      tr.appendChild(td);
    }

    // Create CompletionDate cell
    if (tasks.CompletionDate != null) {
      let td = document.createElement("td");
      td.textContent = this.formatDate(tasks.CompletionDate);
      tr.appendChild(td);
    } else {
      let td = document.createElement("td");
      td.textContent = "N/A"; // If no completion date, show N/A
      tr.appendChild(td);
    }

    // Create Status cell
    if (tasks.Status != null) {
      let td = document.createElement("td");
      td.textContent = tasks.Status == true ? "Completed" : "Pending";
      tr.appendChild(td);
    }

    // Handling task completion
    if (tasks.Status == 1) {
      let td = document.createElement("td");
      //checkBox.style.display = "none"; // Hide checkbox
      checkBox.style.display = "none"; // Hide checkbox
      confirmButton.style.display = "block"; // Show confirm button
      confirmButton.innerText = "✅"; // Text for confirm button
      confirmButton.id = "cnfrmBtn";
      confirmButton.classList.add("btn", "btn-success", "cnfrmBtn");
      confirmButton.disabled = true; // Disable confirm button as it's already completed
      td.appendChild(confirmButton); // Append confirm button to cell
      tr.appendChild(td); // Append cell to row
    } else {
      let td = document.createElement("td");
      checkBox.style.display = "block"; // Show checkbox
      confirmButton.style.display = "none"; // Hide confirm button initially
      confirmButton.innerText = "Confirm";
      confirmButton.id = "cnfrmBtn";
      confirmButton.classList.add("btn", "btn-success", "cnfrmBtn");
      td.appendChild(checkBox); // Append checkbox to the cell
      td.appendChild(confirmButton);
      tr.appendChild(td); // Append cell to row

      // Add event listener to the checkbox and pass tasks to the listener
      checkBox.addEventListener("change", () => {
        this.checkBoxEventListener(checkBox, confirmButton, tasks); // Pass the tasks data for the current row
      });
    }

    // Set the week number
    weekNumber.innerText = "Week " + tasks.WeekNumber;
    return {confirmButton,checkBox}
  }

  getGreeting() {
    const now = new Date();
    let Greeting = document.getElementById("Greeting");
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:00`;

    const Morning = "04:00:00";
    const Afternoon = "12:00:00";
    const Evening = "16:00:00";

    if (timeString >= Morning && timeString < Afternoon)
      Greeting.innerText = "Good Moring!";
    if (timeString >= Afternoon && timeString < Evening)
      Greeting.innerText = "Good Afternoon!";
    Greeting.innerText = "Good Evening!";
  }

  getAllAPIUrls(endPoint) {
    return apiUrls.apiUrl + endPoint
  }
  

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  async updateTaskStatus(Log_id) {
    return await this.hitAPI("TaskCompletion", "POST", Log_id );
  }


  async hitAPI(apiEndPoint, type = 'GET', param = null) {
    let apiUrl = this.getAllAPIUrls(apiEndPoint);
    //const errorMessage = document.getElementById("ErrorMessage");

    const fetchOptions = {
        method: type,
        headers: {
            "content-type": "application/json",
        },
    };

    if (param) {
      apiUrl = apiUrl+'/'+param;
    }

    try {
        const apiResponse = await fetch(apiUrl, fetchOptions);

        if (!apiResponse.ok) {
            throw new Error(`HTTP error! Status: ${apiResponse.status}`);
        }

        const responseData = await apiResponse.json();
        return responseData;
    } catch (error) {
        //console.error("Error hitting API:", error);
        throw error;
    }
}


async populateTableBody() {
  const loader = document.getElementById("loader");
  const errorMessage = document.getElementById("ErrorMessage");
  const tableBody = document.getElementById("tableBody");

  errorMessage.innerHTML = ""; // Clear any previous error messages
  tableBody.innerHTML = ""; // Clear the table

  const tasks = await this.hitAPI('tasklog', 'GET');  

  if (!tasks) {
      errorMessage.innerText = "Failed to load tasks. Please try again later.";
      return; // Exit if data fetch failed
  }

  
  tasks.forEach((task) => {
      const newTableRow = document.createElement("tr");
      const { confirmButton, checkBox } = this.createElements(task, newTableRow);

      confirmButton.addEventListener("click", async () => {
          const apiResponse = await this.updateTaskStatus(task.Log_id);

          if (apiResponse !== "Task Not Completed(DATA NOT INSERTED!)") {
              checkBox.style.display = "none";
              confirmButton.innerText = "✅";
              confirmButton.style.marginLeft = "50px";
              confirmButton.disabled = true;
              this.showSimpleSweetAlert(`Good Job ${task.Name}!`,`Task Completed! Your next task will be ${apiResponse[0].Task_name} and it will be assigned on ${this.formatDate(apiResponse[0].NextAssignDate)}`,`success`)
              this.populateTableBody();
          } else {
              this.showSimpleSweetAlert(
                  "",
                  "Task status could not be updated!",
                  "error"
              );
          }
      });
      tableBody.appendChild(newTableRow);
  });
}


  showSimpleSweetAlert(title, message, icon) {
    Swal.fire({
      title: title,
      text: message,
      icon: icon,
    });
  }

  loaderShowHide(loaderElement,display) {
    
    if (display.toLowerCase() == "show") {
      loaderElement.style.display = "block";
    } else if (display.toLowerCase() == "hide") {
      loaderElement.style.display = "none";
    } else {
      console.error("Invalid display parameter. Expected 'Show' or 'Hide'.");
    }
  }
}
export default CommonHelpers;
