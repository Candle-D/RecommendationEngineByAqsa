//Initialising Varibales
var data;
var resultP;
var users;

//Loading from movies.json
function preload() {
  data = loadJSON("movies.json");
}

function setup() {
  noCanvas();
  users = {};

  //to create a list of names of user from the data list
  var dropDown1 = createSelect("");

  createP("\n");

  for (var i = 0; i < data.users.length; i++) {
    var name = data.users[i].name;
    dropDown1.option(name);
    users[name] = data.users[i];
  }
  resultP = createP("");
  var button = createButton("submit");
  button.mousePressed(findNearestNeighbours);

  //prints the name of 5 most similar users to the chosen user
  function findNearestNeighbours() {
    createP("");
    resultP.html("");
    var name = dropDown1.value();
    console.log(users[name]);

    //this stores the similarityScore of evry other
    //user wrt to the chosen user with index value as name
    var similarityScore = {};

    for (var i = 0; i < data.users.length; i++) {
      var other = data.users[i].name;

      if (other != name) {
        var similarity = euclideanDistance(name, other);
        similarityScore[other] = similarity;
      }
      //If other==name it has to have 1 as similarityScore so we ignore this
      else similarityScore[other] = 1000000000;
    }
    data.users.sort(compareSimilarity);

    //It compares the two similarityScores and sort accrodingly
    function compareSimilarity(a, b) {
      var score1 = similarityScore[a.name];
      var score2 = similarityScore[b.name];
      return score1 - score2;
    }

    //console.log(data.users);

    var k = 5;
    for (i = 0; i < k; i++) {
      //To check for the accuracy
      console.log(data.users[i]);

      var temp = data.users[i].name;
      var score = nf(1 / (1 + similarityScore[temp]), 1, 2);
      var div = createDiv(temp + ":" + " " + score * 100 + "%");
      resultP.parent(div);
    }
  }
}

//Calculates the distance between two users using euclidean distance
function euclideanDistance(name1, name2) {
  var ratings1 = users[name1];
  var ratings2 = users[name2];

  var titles = Object.keys(ratings1);

  //Removing elements like name and timeline from the titles object
  var i = titles.indexOf("name");
  titles.splice(i, 1);

  var j = titles.indexOf("timestamp");
  titles.splice(j, 1);
  var sumsqr = 0;

  //iterating over the movies from titles object and computing the distance between
  //the two user's rating for a particular movies and storing it in sumsqr
  for (i = 0; i < titles.length; i++) {
    var title = titles[i];
    var rating1 = ratings1[title];
    var rating2 = ratings2[title];
    if (rating1 != null && rating2 != null) {
      var diff = rating1 - rating2;
      sumsqr += diff * diff;
    }
  }
  var d = sqrt(sumsqr);
  return d;
}
