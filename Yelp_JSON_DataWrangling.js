
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

let YelpDatasetJSON = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json'); 

class Businesses {
  constructor(jsonDataset) {
    this.businessesData = jsonDataset;
  }

  hasState(stateStr) {
    return new Businesses(filterDataByState(stateStr));
  }

  filterDataByState(stateStr) {
    return this.businessesData.filter(business => isBusinessFromState(business, stateStr));
  }

  isBusinessFromState(business, stateStr) {
    return (lib220.getProperty(business, "state").value === stateStr);
  }

  ratingsLessOrEqualTo(requiredRatingNum) {
    return new Businesses(filterDataByRating("less than or equal to", requiredRatingNum));
  }

  ratingsGreaterOrEqualTo(requiredRatingNum) {
    return new Businesses(filterDataByRating("greater than or equal to", requiredRatingNum));
  }

  filterDataByRating(relationToStr, requiredRatingNum) {
    return this.businessesData.filter(business => checkRelationToRating(business, requiredRatingNum));

    function checkRelationToRating(business, requiredRatingNum) {
      businessRating = lib220.getProperty(business, "stars").value;
      if (relationTo === "less than or equal to") {
        return (businessRating <= requiredRating);
      } else { //relationTo === "greater than or equal to"
        return (businessRating >= requiredRating);
      }
    }
  }  

  hasCategory(categoryStr) {
    return new Businesses(filterDataByCategory(categoryStr));
  }

  filterDataByCategory(categoryStr) {
    return this.businessesData.filter(business => businessIncludesCategory(business, category));

    function businessIncludesCategory(business, categoryStr){
      return lib220.getProperty(business, "categories").value.includes(category);
    }
  }

  hasAmbience(specificAmbienceStr) {
    let hasAmbienceAttribute = this.businessesData.filter(business => businessHasAmbienceAttribute(business));
    let hasSpecificAmbience = hasAmbienceAttribute.filter(business => businessHasSpecificAmbience(business, specificAmbienceStr));
    return new Businesses(hasSpecificAmbience.filter(business => specificAmbienceSetToTrue(business, specificAmbienceStr)));

    function businessHasAmbienceAttribute(business){
      return lib220.getProperty(business.attributes, "Ambience").found;
    }
    function businessHasSpecificAmbience(business, specificAmbienceStr){
      return lib220.getProperty(business.attributes.Ambience, specificAmbienceStr).found;
    }
    function specificAmbienceSetToTrue(business, specificAmbienceStr){
      return (lib220.getProperty(business.attributes.Ambience, specificAmbienceStr).value === true)
    }
  }

  //bestPlace(): Business | {}
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
    let restaurantsWreviews = this.data.filter(obj => lib220.getProperty(obj, "review_count").found);
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

/#TESTING#/
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
  let tObj = new Businesses(testData);
  let list = tObj.fromState('NC').data;
  assert(list.length === 3);
  assert(list[0].name === "Applebee's");
  assert(list[1].name === "China Garden");
  assert(list[2].name === "Alpaul Automobile Wash");
});

test('bestPlace tie-breaking', function() {
  let tObj = new Businesses(testData);
  let place = tObj.fromState('NC').bestPlace();
  assert(place.name === 'China Garden');
});