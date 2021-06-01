let dataset = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json'); 

/*
type Restaurant = {
  name: string,
  city: string,
  state: string,
  stars: number,
  review_count: number,
  attributes: {} | {
    Ambience: {
      [key: string]: boolean
    }
  },
  categories: string[]
 }
*/

class FluentRestaurants {
  constructor(jsonData) {
    this.data = jsonData;
  }

  //fromState(stateStr: string): FluentRestaurants
  fromState(stateStr) {
    return new FluentRestaurants(this.data.filter(obj => lib220.getProperty(obj, "state").value === stateStr));
  }

  //ratingLeq(rating: number): FluentRestaurants
  ratingLeq(rating) {
    return new FluentRestaurants(this.data.filter(obj => lib220.getProperty(obj, "stars").value <= rating));
  }

  //ratingGeq(rating: number): FluentRestaurants
  ratingGeq(rating) {
    return new FluentRestaurants(this.data.filter(obj => lib220.getProperty(obj, "stars").value >= rating));
  }

  //category(categoryStr: string): FluentRestaurants
  category(categoryStr) {
    return new FluentRestaurants(this.data.filter(obj => lib220.getProperty(obj, "categories").value.includes(categoryStr)));
  }

  //hasAmbience(ambienceStr: string): FluentRestaurants
  hasAmbience(ambienceStr) {
    let withAmbience = this.data.filter(obj => lib220.getProperty(obj.attributes, "Ambience").found === true);
    let withAmbienceStr = withAmbience.filter(obj => lib220.getProperty(obj.attributes.Ambience, ambienceStr).found === true);
    return new FluentRestaurants(withAmbienceStr.filter(obj => lib220.getProperty(obj.attributes.Ambience, ambienceStr).value === true));
  }

  //bestPlace(): Restaurant | {}
  bestPlace() {
    let restaurantsWStars = this.data.filter(obj => lib220.getProperty(obj, "stars").found)
    if (restaurantsWStars.length === 0) {
      return {};
    }
    let maxStarCount = restaurantsWStars.reduce((acc, e) => Math.max(e.stars, acc), 0);
    let restaurantsWMaxStars = restaurantsWStars.filter(obj => lib220.getProperty(obj, "stars").value === maxStarCount);
    if (restaurantsWMaxStars.length === 1) {
      return restaurantsWMaxStars[0];
    }
    let restaurantsWreviews = restaurantsWMaxStars.filter(obj => lib220.getProperty(obj, "review_count").found)
    let maxReviewCount = restaurantsWreviews.reduce((acc, e) => Math.max(e.review_count, acc), 0)
    let restaurantWMaxReviews = restaurantsWreviews.filter(obj => lib220.getProperty(obj, "review_count").value === maxReviewCount);
    
    if (restaurantWMaxReviews.length === 1) {
      return restaurantWMaxReviews[0];
    } else {
      return restaurantsWMaxStars[0];
    }
  }

  //mostReviews(): Restaurant | {}
  mostReviews() {
    let restaurantsWreviews = this.data.filter(obj => lib220.getProperty(obj, "review_count").found)
    if (restaurantsWreviews.length === 0) {
      return {};
    }
    let maxReviewCount = restaurantsWreviews.reduce((acc, e) => Math.max(e.review_count, acc), 0)
    let restaurantsWMaxReviews = restaurantsWreviews.filter(obj => lib220.getProperty(obj, "review_count").value === maxReviewCount);
    if (restaurantsWMaxReviews.length === 1) {
      return restaurantsWMaxReviews[0];
    }
    let restaurantsWStars = restaurantsWMaxReviews.filter(obj => lib220.getProperty(obj, "stars").found)
    let maxStarCount = restaurantsWStars.reduce((acc, e) => Math.max(e.stars, acc), 0);
    let restaurantWMaxStars = restaurantsWStars.filter(obj => lib220.getProperty(obj, "stars").value === maxStarCount);
    if (restaurantWMaxStars.length === 1) {
      return restaurantWMaxStars[0];
    } else {
      restaurantsWreviews[0];
    }
  }
};

let f = new FluentRestaurants(dataset);

//TEST
const testData = [
  {
    name: "Applebee's",
    state: "NC",
    stars: 4,
    review_count: 6,
  },
  {
    name: "China Garden",
    state: "NC",
    stars: 4,
    review_count: 10,
  },
  {
    name: "Beach Ventures Roofing",
    state: "AZ",
    stars: 3,
    review_count: 30,
  },
  {
    name: "Alpaul Automobile Wash",
    state: "NC",
    stars: 3,
    review_count: 30,
  }
]

test('fromState filters correctly', function() {
  let tObj = new FluentRestaurants(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Alpaul Automobile Wash");
});

test('bestPlace tie-breaking', function() {
  let tObj = new FluentRestaurants(testData);
  let place = tObj.fromState('NC').bestPlace();
  assert(place.name === 'China Garden');
});