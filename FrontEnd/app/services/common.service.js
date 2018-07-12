angular
    .module('pfcApp')
    .factory('Common', [function(){
    	var cardId = 0;


    	return{
	        getCardId: function(){
	        	return cardId;
	        },
	        setCardId: function(id){
	        	cardId = id;
	        }
	      }
    }])