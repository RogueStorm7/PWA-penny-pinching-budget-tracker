let db;
// create a new database request for the "budget" database.
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
   // create object called "in progress" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("in progress", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;

  // this is to check if app is online before reading from database
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("Error: " + event.target.errorCode);
};

function saveRecord(record) {
  // create a transaction on the in progress database with readwrite access
  const transaction = db.transaction(["in progress"], "readwrite");

  // access your in progress object store
  const store = transaction.objectStore("in progress");

  // add record to your store with add method.
  store.add(record);
}

function checkDatabase() {
  // open a transaction on "in progress" database
  const transaction = db.transaction(["in progress"], "readwrite");
  // access "in progress" object store
  const store = transaction.objectStore("in progress");
  // get all records from store and set to variable
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open a transaction to "in progress" database
        const transaction = db.transaction(["in progress"], "readwrite");

        // access "in progress" object store
        const store = transaction.objectStore("in progress");

        // clear all items in store
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);