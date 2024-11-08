import CommonHelpers from "./CommonHelpers.js";
window.onload = function() {
  let Loader = document.getElementById('loader')
  let weekNumber = document.getElementById('WeekNumber');
  let ErrorMessage = document.getElementById('ErrorMessage')
   Loader.style.display = 'none';
  const helper = new CommonHelpers();
  let currentDate = new Date()
  let tableBody = document.getElementById('tableBody');

  weekNumber.innerText = helper.getWeekOfMonth(currentDate)

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  function showSimpleSweetAlert(title,message,icon){
    Swal.fire({
      title: title,
      text: message,
      icon: icon
    });
  }

  let Greeting = document.getElementById('Greeting');

  Greeting.innerText = helper.getGreeting()
 

  async function fetchMembers() {
    try {
      // //API CALL REGION
      const response = await fetch(await helper.getAllAPIUrls('tasklog'));
      
      if (!response.ok) {
        setTimeout(() => {
          Loader.style.display = 'block';
        }, 2000); 
        Loader.style.display = 'none';
      throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      //API CALL REGION

      if(data!=null){
        populateTable(data);
        Loader.style.display = 'none';
      }else{
        setTimeout(() => {
          Loader.style.display = 'block';
      }, 2000); 
      Loader.style.display = 'none';
      }
    } catch (error) {
      Loader.style.display = 'none';
       ErrorMessage.innerText="Something went wrong"
      console.error('Fetch error:', error);
    }
  }
  
  function populateTable(tasks) {
    tableBody.innerHTML = ''; 

    tasks.forEach((tasks) => {
      
      let newTableRow = document.createElement('tr');
      helper.createElements(newTableRow,tasks.Name,tasks.Task_name,formatDate(tasks.AssignedDate),formatDate(tasks.DueDate),tasks.CompletionDate==null?"N/A":formatDate(tasks.CompletionDate),tasks.Status == 0 ? 'Pending':'Completed')
      
       let taskDone = document.createElement('td');
      
       let checkBox = document.createElement('input');
       let confirmButton = document.createElement('button');
       let statusData = document.createElement('button');
       confirmButton.id = 'confirm_btn'

      checkBox.type = 'checkbox';
      confirmButton.innerText = 'Confirm';
      confirmButton.id = 'cnfrmBtn';
      confirmButton.classList.add('btn', 'btn-success');
      confirmButton.classList.add('confirm-btn');
      confirmButton.style.display = 'none';


      async function updateTaskStatus(Log_id){
        let url = 'https://localhost:44358/api/APT2004/TaskCompletion/'+Log_id;
        const response = await fetch(url,{
          method:'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify(Log_id)
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
      }
      
      confirmButton.addEventListener('click', async function () {
        let data = tasks
        let logID = data.Log_id;

        let response = await updateTaskStatus(logID)
        if(response !='Task Not Completed(DATA NOT INSERTED!)'){
          checkBox.style.display ="none";
        confirmButton.innerText = '✅';
        confirmButton.style.marginLeft = '50px'
        confirmButton.disabled = true;
        statusData.innerText = 'Completed';
        showSimpleSweetAlert(`Good Job ${data.Name}!`,`Task Completed! Your next task will be ${response[0].Task_name} and it will be assigned on ${response[0].AssignedDate}`,`success`)
        
        
        let taskData = await taskResponse.json();
        if(taskData.length==4){
          showSimpleSweetAlert("Alert","All tasks are completed!","success")
          populateTable(taskData);
          showSimpleSweetAlert("Alert","New tasks have been added for the following week!","success")
        }
        fetchMembers();
        }else{
          fetchMembers();
        }
        
      });

      if(tasks.Status==1){
        checkBox.style.display = 'none';
        confirmButton.style.display = 'inline-block';
        confirmButton.innerText = '✅';
        confirmButton.disabled = true;
        statusData.innerText = 'Completed';
      }

      
      checkBox.addEventListener('change', function () {
        if (checkBox.checked) {
          confirmButton.style.display = 'inline-block';
        } else {
          confirmButton.style.display = 'none';
        }
      });

      
      taskDone.appendChild(checkBox);
      taskDone.appendChild(confirmButton);
      newTableRow.appendChild(taskDone);

      tableBody.appendChild(newTableRow);
    });
  }
 fetchMembers();
};





//#1: Assign tasks and also display the week 1, set the current month number for the current tasks from week 1 to 4. 

//#2: after all the tasks have been completed we have to check the tasks current month number and the current month number, if they match increment the week number and assign the tasks.

//#3: after all the tasks have been completed check the tasks current month number and the current month number, if they don't match assign new task with the new month and starting from week 1, as the new month has started.  