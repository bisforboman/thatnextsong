angular.module('cardService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Cards', ['$http',function($http) {
		return {
			get : function(cardId) {
				return $http.get('/api/card/:cardId');
			},
			searchCard : function(multiverseid) {
				return $http.get('/api/cards/' + multiverseid);
			},
			searchForCards : function(options) {
				return $http.post('/api/cards/', {options: options});
			}
		}
	}]);