// storageCtrl IFII
const storageCtrl = (function () {
  return {
  
  addtoLS: function (item) {
    let items;
    if (localStorage.getItem('items') === null) {
        items = [];
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
    } else {
        items = JSON.parse(localStorage.getItem('items'));
        items.push(item);
        localStorage.setItem('items', JSON.stringify(items));
    }
    
    
  },
  clearLSdata: function () {
    localStorage.setItem('items', JSON.stringify([]));
  },
  updateLSdata: function (item) {
    const items = JSON.parse(localStorage.getItem('items'));
    items.forEach(element => {
      if (element.id === item.id) {
        element.name = item.name;
        element.calories = item.calories;
        element.time = item.time;
      }
    })
   localStorage.setItem('items', JSON.stringify(items));
  },
  removeDataLS: function (item) {
    let index;
    const items = JSON.parse(localStorage.getItem('items'));
    items.forEach(element => {
      if (element.id === item.id) {
        index = items.indexOf(element);
      }
    })
    items.splice(index, 1);
    localStorage.setItem('items', JSON.stringify(items));
  
  }
  }
})();
// dataCtrl IFII

const dataCtrl = (function () {

  const Item = function(id, name, calories, time) {
   this.id = id;
   this.name = id;
   this.calories = id;
   this.time = id;
  }

  const data = {
    items: JSON.parse(localStorage.getItem('items')),
    targetItem: null,
    totalCal: 0
  }

  return {
    dataLog: function () {
      return data;
    },
    addInput: function (input) {
      // Generate an id
      let id;
      let output = input;

      if (data.items.length === null) {
        id = 0;
      } else {
        id = data.items.length;
      }
      output = {
        id: id,
        name: input.name,
        calories: input.calories,
        time: input.time
      }
      data.items.push(output);
      // add LS
      storageCtrl.addtoLS(output);
    
    },
    totalCalorie: function () {
      data.totalCal = 0;
      data.items.forEach(element => {
        data.totalCal += element.calories;
        
      });
      return data.totalCal;
    },
    editCurrent: function (id) {
      data.items.forEach(element => {
        if (element.id === id) {
      data.targetItem = {
        id: element.id,
        name: element.name,
        calories: element.calories,
        time: element.time

      }
        }
      });
      return data.targetItem;
    },
    editTargetValues: function (values) {
      data.targetItem.name = values.name;
      data.targetItem.calories = values.calories;
      data.targetItem.time = values.time;
      data.items.forEach(element => {
        if (element.id === data.targetItem.id) {
         element.name = values.name;
         element.calories = values.calories;
         element.time = values.time;
        }
      })
      // Update LS
      storageCtrl.updateLSdata(data.targetItem);
    },
    clearData: function(){
      data.items = [];
      data.totalCal = 0;
      storageCtrl.clearLSdata();
    },
    removeItem: function () {
      let index;
      data.items.forEach(element => {
        if (element.id === data.targetItem.id) {
          index = data.items.indexOf(element);
          
        }
      })
      data.items.splice(index, 1);
      // remove from LS
      storageCtrl.removeDataLS(data.targetItem);
      
    }
    
  }
})();
// UICtrl IFII

const UICtrl = (function () {


  return {
    uiInit: function () {
      // document.querySelector('.ul-content').style.display = 'block';
      const data = dataCtrl.dataLog();
      if (data !== null) {
        let htmlOutput = ``;
      data.items.forEach(item => {
        htmlOutput += `
        <li class="collection-item d-flex" id="item-${item.id}">
                <strong>${item.name}: </strong> <p>${item.calories} Calories</p> <strong>Time: ${item.time}</strong>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
        </li>
        `;
      });
      document.getElementById('item-list').innerHTML = htmlOutput;
      }
      
      
    },
    getMealInput: function () {
      const name = document.getElementById('foodInput').value,
            calories = Number(document.getElementById('CalInput').value),
            time = document.getElementById('TimeInput').value;
      return {
        name,
        calories,
        time
      }
    },
    clearInput: function () {
       document.getElementById('foodInput').value = '';
       document.getElementById('CalInput').value = '';
       document.getElementById('TimeInput').selectedIndex = null;
    },
    Uitotal: function (number) {
      document.getElementById('total-cal').innerText = number;
    },
    displayEdit: function () {
      document.querySelector('.btn-edit').style.display = 'inline-block';
      document.querySelector('.btn-remove').style.display = 'inline-block';
      document.querySelector('.btn-cancel').style.display = 'inline-block';
    },
    getTargetInputs: function (target) {
      document.getElementById('foodInput').value = target.name;
      document.getElementById('CalInput').value = target.calories;
      document.getElementById('TimeInput').value = target.time;
     
    },
    modeDefault: function () {
      document.querySelector('.btn-edit').style.display = 'none';
      document.querySelector('.btn-remove').style.display = 'none';
      document.querySelector('.btn-cancel').style.display = 'none';
    },
    showError: function(message, cl) {
      
      // Create error div
      const err = document.createElement('div');
      err.classList = `Alert text-center py-2 my-2 text-white ${cl}`
      err.appendChild(document.createTextNode(message));
      // Parent
      const parEL = document.querySelector('.content');
      const childEl = document.querySelector('#cancelBtn');
      // InsertBefore
      parEL.insertBefore(err, childEl);
      // remove after 2000
      setTimeout(this.removeAlert, 2000);
    },
    removeAlert: function () {
      if (document.querySelector('.Alert')) {
        document.querySelector('.Alert').remove();
      }
      
    }

  }
})();

// AppCtrl IFII

const AppCtrl = (function (dataCtrl, storageCtrl, UICtrl) {



return {
  appInit: function(){
    // Call Ui 
    UICtrl.uiInit();
    // Get total calories
    const total = dataCtrl.totalCalorie();
    // Insert into html
    UICtrl.Uitotal(total);
    // Listen for new meal
    document.querySelector('#addBtn').addEventListener('click', addMeal);
    function addMeal(e) {
      // Get Meal Inputs
      const data = UICtrl.getMealInput();
      
      if (data.name === '' || data.calories === 0 || data.time === 'Choose...') {
      // Show error
      
      UICtrl.showError('Please type all fields', 'bg-danger');
      
      } else {
      
        // Add input to data
      dataCtrl.addInput(data);
      // Call Ui 
    UICtrl.uiInit();
    // Get total calories
    const total = dataCtrl.totalCalorie();
    // Insert into html
    UICtrl.Uitotal(total);
      // show alert
      UICtrl.showError('Your meal has been added successfully', 'bg-success');
      // Clear Input
      UICtrl.clearInput();
      
      
      
      }
      
      e.preventDefault();
    }
    // listen for edit 
    document.querySelector('#item-list').addEventListener('click', editMeal);
    function editMeal(e) {
      if (e.target.classList.contains('edit-item'))
      {
        // display edit mode
        UICtrl.displayEdit();
        // get the target id
        const id = e.target.parentElement.parentElement.id;
        const idNum = Number(id.substr(id.length - 1));
        // Edit current data item
        const target = dataCtrl.editCurrent(idNum);
        // Get inputs from current meal
        UICtrl.getTargetInputs(target);
      }
      
      e.preventDefault();
    }
    // Listen to edit
    document.querySelector('#editBtn').addEventListener('click', updateMeal);
    function updateMeal () {
      // get updated values
      const newValues = UICtrl.getMealInput();
      // edit target values
      dataCtrl.editTargetValues(newValues);
      // Change mode default
      UICtrl.modeDefault();
      // clear input
      UICtrl.clearInput();
      // show alert
      // show alert
      UICtrl.showError('Your meal has been updated successfully', 'bg-success');
      // Update ui
      UICtrl.uiInit();
      // Get total calories
    const total = dataCtrl.totalCalorie();
    // Insert into html
    UICtrl.Uitotal(total);
      
      
    }
    // Listen to cancel
    document.querySelector('#cancelBtn').addEventListener('click', cancelUpdate);
    function cancelUpdate(){
      // Change mode default
      UICtrl.modeDefault();
      // clear
      UICtrl.clearInput();
    }
    // Listen to clearall
    document.querySelector('#ClearBtn').addEventListener('click', clearAll);
    function clearAll () {
      // clea data
      dataCtrl.clearData();
      // Update ui
      UICtrl.uiInit();
      // Get total calories
    const total = dataCtrl.totalCalorie();
    // Insert into html
    UICtrl.Uitotal(total);
    // clear input
    UICtrl.clearInput();
    }
    // Listen to remove
    document.querySelector('#removeBtn').addEventListener('click', removeMeal);
    function removeMeal () {
      // remove from data
      dataCtrl.removeItem();
      UICtrl.uiInit();
      // Get total calories
    const total = dataCtrl.totalCalorie();
    // Insert into html
    UICtrl.Uitotal(total);
    // Change mode default
    UICtrl.modeDefault();
    // clear input
    UICtrl.clearInput();
    // show alert
    UICtrl.showError('Your meal has been removed successfully', 'bg-danger');

    }
  }
}
})(dataCtrl, storageCtrl, UICtrl);


AppCtrl.appInit();
