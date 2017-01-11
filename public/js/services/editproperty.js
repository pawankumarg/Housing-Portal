var app = angular.module("HousingApp");

app.service("PassId", function () {

var id = "";

return {
    getId: function () {
        return id;
    },
    setId: function (value) {
        id = value;
    }
};

});