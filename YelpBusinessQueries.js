//Gets a subset of YELPS dataset and stores it as an array of JSON objects
let YelpDatasetJSON = lib220.loadJSONFromURL('https://people.cs.umass.edu/~joydeepb/yelp.json'); 

class Businesses {
  FIRST_BUSINESS = 0;
  constructor(jsonDataset) {
    this.businessesData = jsonDataset;
  }

  #businessesWithCategory(categoryStr) {
    this.businessesData = filterDataByCategory(categoryStr);
    return this;
  }d
  #filterDataByCategory(categoryStr) {
    return this.businessesData.filter(business => businessIncludesCategory(business, categoryStr));
  }
  #businessIncludesCategory(business, category){
    return lib220.getProperty(business, "categories").value.includes(category);
  }

  #inState(stateStr) {
    this.businessesData = filterDataByState(stateStr);
    return this;
  }
  #filterDataByState(stateStr) {
    return this.businessesData.filter(business => isBusinessFromState(business, stateStr));
  }
  #isBusinessFromState(business, stateStr) {
    return (lib220.getProperty(business, "state").value === stateStr);
  }

  #businessesWithAmbience(specificAmbienceStr) {
    businessesWithAmb = filterDataWithAmbField();
    this.businessesData = businessesWithSpecificAmb(businessesWithAmb, specificAmbienceStr);
    return this  
  }
  #filterDataWithAmbField() {
    return this.businessesData.filter(eachBusiness => hasAmbField(eachBusiness));
  }
  #hasAmbField(business) {
    let bool = lib220.getProperty(business.attributes, "Ambience").found;
    return bool;
  }
  #businessesWithSpecificAmb(businesses, specificAmbStr){
    return businesses.filter(eachBusiness => businessHasSpecificAmb(eachBusiness,specificAmbStr));
  }
  #businessHasSpecificAmb(business, specificAmbStr){
    let specificAmbience = lib220.getProperty(business.attributes.Ambience, specificAmbStr);
    let bool = (specificAmbience.found && (specificAmbience.value == true));
    return bool;
  }

  #ratingsLessOrEqualTo(requiredRatingNum) {
    this.businessesData = filterDataByRatingLessOrEqualTo(requiredRatingNum);
    return this;
  }
  #ratingsGreaterOrEqualTo(requiredRatingNum) {
    this.businessesData = filterDataByRatingGreaterOrEqualTo( requiredRatingNum);
    return this;
  }
  #filterDataByRatingLessOrEqualTo(maxNum){
    this.businessesData.filter(eachBusiness => businessRatingLessOrEqualTo(eachBusiness, maxNum));
  }
  #filterDataByRatingGreaterOrEqualTo(minNum){
    this.businessesData.filter(eachBusiness => businessRatingGreaterOrEqualTo(eachBusiness, minNum));
  }
  #businessRatingLessOrEqualTo(business, maxNum){
    let businessRating = lib220.getProperty(business, "stars").value;
    let bool = businessRating <= maxNum;
    return bool;
  }
  #businessRatingGreaterOrEqualTo(business, minNum){
    let businessRating = lib220.getProperty(business, "stars").value;
    let bool = businessRating >= minNum;
    return bool;
  }

  #topRatedOrTieBreak() {
    businessesWithReviews = filterBusinessesWith(this.businessesData, "stars")
    if(noBusinessesExist(businessesWithReviews)){
      return {};
    }
    let topBusinessesWithField = filterBusinessesWithMost(businessesWithReviews, "stars");
    return getTopBusinessOrTieBreak(topBusinessesWithField, tieBreakerFor("stars"));
  }

  #mostReviewsOrTieBreak() { 
    businessesWithReviews = filterBusinessesWith(this.businessesData, "review_count")
    if(noBusinessesExist(businessesWithReviews)){
      return {};
    }
    let topBusinessesWithField = filterBusinessesWithMost(businessesWithReviews, "review_count");
    return getTopBusinessOrTieBreak(topBusinessesWithField, tieBreakerFor("review_count"));
  }

  #filterBusinessesWith(businesses, fieldStr) {
    return businesses.filter(eachBusiness => lib220.getProperty(eachBusiness, fieldStr).found);
  }
  #noBusinessesExist(businesses) {
    if (businesses.length === 0){
      return true;
    }
    return false;
  }
  #filterBusinessesWithMost(checkedBusinesses, fieldStr) {
    let attribute = review_count;
    if (fieldStr === "stars"){
      attribute = stars;
    }

    let maxFieldCount = checkedBusinesses.reduce((acc, business) => Math.max(business.attribute, acc), 0)
    return checkedBusinesses.filter(obj => lib220.getProperty(obj, fieldStr).value === maxFieldCount);
  }
  #tieBreakerFor(fieldStr) {
    if (fieldStr === "review_count"){
      return "stars";
    } 
    return "review_count";
  }
  #getTopBusinessOrTieBreak(topBusinesses, tieBreakerFieldStr){
    if (topBusinesses.length === 1){
      return topBusinesses[FIRST_BUSINESS];
    }

    tieBreakerBusinesses = filterBusinessesWith(topBusinesses, tieBreakerFieldStr)
    if(noBusinessesExist(tieBreakerBusinesses)){
      return {};
    }
    let topBusinessesWithTiebreakerField = filterBusinessesWithMost(tieBreakerBusinesses, tieBreakerFieldStr);
    return topBusinessesWithTiebreakerField[FIRST_BUSINESS];
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
