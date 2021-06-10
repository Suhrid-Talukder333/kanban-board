const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const itemLists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];
// Drag Functionality
let draggedItem;
let currentItem;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onholdItems);
  } else {
    backlogListArray = [];
    progressListArray = [];
    completeListArray = [];
    onHoldListArray = [];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    onHoldListArray,
    progressListArray,
    completeListArray,
  ];
  const arrayNames = ["backlog", "onhold", "progress", "complete"];
  arrayNames.forEach((item, index) => {
    localStorage.setItem(`${item}Items`, JSON.stringify(listArrays[index]));
  });
}

const filterArray = (array) => {
  return array.filter((item) => item != null);
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  //Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  console.log("hello");
  if (!updatedOnLoad) {
    getSavedColumns();
    updatedOnLoad = true;
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((item, index) => {
    createItemEl(backlogList, 0, item, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((item, index) => {
    createItemEl(progressList, 2, item, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((item, index) => {
    createItemEl(completeList, 3, item, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((item, index) => {
    createItemEl(onHoldList, 1, item, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updateSavedColumns();
}

const updateItem = (index, column) => {
  const selectedItem = listArrays[column];
  const selectedColumnEl = itemLists[column].children;
  if (!dragging) {
    if (!selectedColumnEl[index].textContent) {
      delete selectedItem[index];
    } else {
      selectedItem[index] = selectedColumnEl[index].textContent;
    }
    updateDOM();
  }
};

const addToColumn = (id) => {
  const itemText = addItems[id].textContent;
  if (itemText === "") {
    return;
  }
  const selectedColumn = listArrays[id];
  selectedColumn.push(itemText);
  addItems[id].textContent = "";
  updateDOM();
};

const showInputBox = (id) => {
  addBtns[id].style.visibility = "hidden";
  saveItemBtns[id].style.display = "flex";
  addItemContainers[id].style.display = "flex";
};

const hideInputBox = (id) => {
  addBtns[id].style.visibility = "visible";
  saveItemBtns[id].style.display = "none";
  addItemContainers[id].style.display = "none";
  addToColumn(id);
};

const rebuildArrays = () => {
  backlogListArray = [];
  progressListArray = [];
  onHoldListArray = [];
  completeListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  updateDOM();
};

const drag = (event) => {
  draggedItem = event.target;
};

const allowDrop = (event) => {
  event.preventDefault();
};

const dragEnter = (item) => {
  itemLists[item].classList.add("over");
  currentItem = item;
  console.log(currentItem);
};

const drop = (event) => {
  event.preventDefault();
  itemLists.forEach((item) => {
    item.classList.remove("over");
  });
  let parent = itemLists[currentItem];
  parent.appendChild(draggedItem);
  rebuildArrays();
};

updateDOM();
document.addEventListener("dblclick", (e) => {
  if ((e.target.className = "drag-item")) {
    e.target.setAttribute("contenteditable", "true");
    e.target.focus();
  }
});
