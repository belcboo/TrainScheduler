// Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "vast-math-155602.firebaseapp.com",
  databaseURL: "https://vast-math-155602.firebaseio.com",
  projectId: "vast-math-155602",
  storageBucket: "vast-math-155602.appspot.com",
  messagingSenderId: "22021367852"
};
firebase.initializeApp(config);

var database = firebase.database();


//Executes the updater function every minute to update automatically the Expected time on the table
setInterval(function() {
  console.log("interval run");

  //Clears all the data in the table to avoid duplicates.
  $("#trainTable > tbody").empty();

  //Calls updater to create all the rows in the table.
  updater();

}, 60 * 1000);

// Event triggered on click.
$("#addTrain").on('click', function(event) {

  event.preventDefault();

  // Getting values of the inputs
  var trainName = $("#trainName").val().trim();
  var trainOrig = $("#trainOrig").val().trim();
  var trainTime = moment($("#trainTime").val().trim(), "HH:mm").format("X");
  var trainFreq = $("#trainFreq").val().trim();

  // Push to db
  database.ref().push({
    tName: trainName,
    tOrig: trainOrig,
    tTime: trainTime,
    tFreq: trainFreq,
  })

  // Clean all the text-boxes
  $("#trainName").val("");
  $("#trainOrig").val("");
  $("#trainTime").val("");
  $("#trainFreq").val("");

  //Clears the content of the table to avoid repetead items.
  $("#trainTable > tbody").empty();

  //Calls the function updater to pull all the values including the last one pushed.
  updater();


});

// Pull data from firebase and feed the rows in the table.
function updater() {

  //Creates a snapshot from the content in the DB and store it into a temp variable.
  database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());

    //Storing db from temp variable into variables
    var trainName = childSnapshot.val().tName;
    var trainOrig = childSnapshot.val().tOrig;
    var trainTime = childSnapshot.val().tTime;
    var trainFreq = childSnapshot.val().tFreq;

    //Converting the time to display in the table from unix time to HH:MM
    var fixedTime = moment.unix(trainTime).format("hh:mm A");
    console.log(fixedTime);

    //Calculate the difference between the arrival time and the actual time.
    var mins = moment().diff(moment(trainTime, "X"), "minutes") * (-1);
    fixedTime
    console.log(mins);

    //Push all the rows of data into the table.
    $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainOrig + "</td><td>" + trainFreq + "</td><td>" + fixedTime + "</td><td>" + mins + "</td></tr>");
  });
}

updater();
