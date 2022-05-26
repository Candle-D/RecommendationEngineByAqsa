var data;
var resultP;
var users;
var resultDivs = [];

//loading data from jason file
function preload() {
  data = loadJSON("movies.json");
}

function setup() {
  noCanvas();
  users = {};
  var dropdowns = [];
  var titles = data.titles;
  resultP = createP("");

  //Creating a table for entry of a new user
  for (var i = 0; i < titles.length; i++) {
    var div = createDiv(titles[i]);
    var dropdown = createSelect("");
    dropdown.title = titles[i];
    dropdown.option("not seen");
    dropdown.parent(div);
    dropdowns.push(dropdown);
    createP("");

    for (star = 1; star <= 5; star++) {
      dropdown.option(star);
    }
  }

  var button = createButton("submit");
  button.mousePressed(PredictRatings);

  function PredictRatings() {
    var newUser = {};
    for (var i = 0; i < dropdowns.length; i++) {
      var title = dropdowns[i].title;
      var rating = dropdowns[i].value();
      if (rating == "not seen") rating = null;

      //Creating a newUser object with movies and their ratings
      newUser[title] = rating;
    }
    findNearestNeighbours(newUser);
  }

  function findNearestNeighbours(user) {
    for (var i = 0; i < resultDivs.length; i++) {
      resultDivs[i].remove();
    }
    resultDivs = [];
    var similarityScore = {};

    for (i = 0; i < data.users.length; i++) {
      var other = data.users[i];

      var similarity = euclideanDistance(user, other);
      similarityScore[other.name] = similarity;
    }
    data.users.sort(compareSimilarity);

    //Sorting the users object based on the similarity Score
    function compareSimilarity(a, b) {
      var score1 = similarityScore[a.name];
      var score2 = similarityScore[b.name];
      return score1 - score2;
    }

    //Calculating the predicted ratings based on the weighted average ratings of k most similar users
    for (var i = 0; i < data.titles.length; i++) {
      var title = data.titles[i];
      if (user[title] == null) {
        var k = 5;
        var weightedSum = 0;
        var similaritySum = 0;

        //Iterating over the k most similar users for rating of a particular title
        for (var j = 0; j < k; j++) {
          var name = data.users[j].name;
          var score = 1 / (1 + similarityScore[name]);
          var ratings = data.users[j];
          var rating = ratings[title];
          if (rating != null) {
            weightedSum += rating * score;
            similaritySum += score;
          }
        }
        //average weighted sum
        var stars = nf(weightedSum / similaritySum, 1, 2);

        var div = createDiv(title + ":" + stars);
        resultDivs.push(div);
        div.parent(resultP);
      }
    }
  }

  //calculates the similarityScore for bwteen the newUser and other users from the dataset
  function euclideanDistance(ratings1, ratings2) {
    var titles = data.titles;
    var sumsqr = 0;

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
}
