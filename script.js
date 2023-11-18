  function addTask() {
    var taskInput = document.getElementById("task-input");
    var completionTimeInput = document.getElementById("completion-time");
    var taskText = taskInput.value.trim();
    var completionTime = completionTimeInput.value;

    if (taskText === "") {
      alert("Fill the task name.");
      return;
    }

    if (completionTime !== "") {
      var now = new Date();
      var selectedTime = new Date(completionTime);

      if (selectedTime <= now) {
        alert("Invalid time! Please select a time in the future.");
        return;
      }

      var taskList = document.getElementById("task-list");

      var tr = document.createElement("tr");
      tr.className = "task-item waiting"; // Added 'waiting' class for visual indication
      tr.innerHTML = `
        <td></td>
        <td>${taskText}</td>
        <td class="completion-time">${formatCompletionTime(selectedTime)}</td>
        <td>
          <button onclick="toggleCompleted(this.parentElement.parentElement)">Complete</button>
          <button onclick="removeTask(this.parentElement.parentElement)">Remove</button>
        </td>
      `;

      // Find the correct position to insert the new task based on date and time
      var tasks = taskList.childNodes;
      var insertionIndex = 0;
      while (insertionIndex < tasks.length) {
        var taskTime = new Date(tasks[insertionIndex].querySelector(".completion-time").textContent);
        if (taskTime > selectedTime) {
          break;
        }
        insertionIndex++;
      }

      // Insert the new task at the correct position
      taskList.insertBefore(tr, tasks[insertionIndex]);

      taskInput.value = "";
      completionTimeInput.value = "";

      // Set Serial Number and schedule the task completion
      setSerialNumbers();
      scheduleTaskCompletion(tr, selectedTime);
      // Sort tasks based on completion time
      sortTasksByCompletionTime();
    } else {
      alert("Fill the completion time.");
    }
  }

  function toggleCompleted(taskItem) {
    var buttons = taskItem.querySelector("td:last-child");
    var repeatButton = document.createElement("button");
    repeatButton.textContent = "Repeat";
    repeatButton.className = "repeat-button";
    repeatButton.onclick = function () {
      var newCompletionTime = prompt("Enter new date and time (Example format: YYYY-MM-DDTHH:mm):");
      if (newCompletionTime) {
        taskItem.classList.remove("completed", "waiting");
        taskItem.querySelector(".completion-time").textContent = formatCompletionTime(new Date(newCompletionTime));
        scheduleTaskCompletion(taskItem, new Date(newCompletionTime));
        // Sort tasks based on completion time
        sortTasksByCompletionTime();
      }
    };

    buttons.innerHTML = ""; // Clear existing buttons
    buttons.appendChild(repeatButton);
  }

  function removeTask(taskItem) {
    taskItem.remove();
    // Set Serial Number after removing a task
    setSerialNumbers();
  }

  function formatCompletionTime(dateTime) {
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return dateTime.toLocaleDateString('en-US', options);
  }

  function scheduleTaskCompletion(taskItem, completionTime) {
    var now = new Date();
    var timeDifference = completionTime - now;

    if (timeDifference > 0) {
      setTimeout(function () {
        taskItem.classList.remove("waiting"); // Remove 'waiting' class when the task is completed
        taskItem.classList.add("completed");
        toggleCompleted(taskItem); // Trigger the toggleCompleted function to replace buttons
      }, timeDifference);
    }
  }

  function setSerialNumbers() {
    var serialNumberCells = document.querySelectorAll("#task-table tbody tr td:first-child");
    serialNumberCells.forEach(function (cell, index) {
      cell.textContent = index + 1;
    });
  }

  // Update date and time
  function updateDateTime() {
    var dateTimeElement = document.getElementById("date-time");
    var now = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    var dateTimeString = now.toLocaleDateString('en-US', options);
    dateTimeElement.textContent = dateTimeString;
  }

  // Update date and time initially and then every second
  updateDateTime();
  setInterval(updateDateTime, 1000);

  // Sort tasks based on completion time
  function sortTasksByCompletionTime() {
    var taskList = document.getElementById("task-list");
    var tasks = Array.from(taskList.childNodes);
    var sortedTasks = tasks.sort(function (a, b) {
      var timeA = new Date(a.querySelector(".completion-time").textContent);
      var timeB = new Date(b.querySelector(".completion-time").textContent);
      return timeA - timeB;
    });

    // Clear the task list and re-insert the sorted tasks
    taskList.innerHTML = "";
    sortedTasks.forEach(function (task) {
      taskList.appendChild(task);
    });

    // Set Serial Numbers after sorting tasks
    setSerialNumbers();
  }
