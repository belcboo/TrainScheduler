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


});

// Pull data from firebase and feed the rows in the table.

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  //Storing db varuables into variables

  var trainName = childSnapshot.val().tName;
  var trainOrig = childSnapshot.val().tOrig;
  var trainTime = childSnapshot.val().tTime;
  var trainFreq = childSnapshot.val().tFreq;

  var fixedTime = moment.unix(trainTime).format("hh:mm A");
  console.log(fixedTime);

  var mins = moment().diff(moment(trainTime, "X"), "minutes")*(-1);fixedTime
  console.log(mins);

  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" + trainOrig+ "</td><td>" + trainFreq + "</td><td>" + fixedTime + "</td><td>" + mins + "</td></tr>");


});
