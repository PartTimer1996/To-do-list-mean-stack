//jshint esversion: 6
exports.getDate = function() {
  const date = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  return date.toLocaleDateString("en-UK", options);

};

exports.getDay = function() {
  const shortday = new Date();

  const options = {
    weekday: "long",
  };
  return shortday.toLocaleDateString("en-UK", options);

};