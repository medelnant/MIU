// Author: Michael S. Edelnant
// School: Full Sail University
// Course: MIU 1302
// Instructor: Robin Alarcon
// --------------------------------------------------------------------------- /
// Project 2 | Main.js
// --------------------------------------------------------------------------- /


window.addEventListener("DOMContentLoaded", function (){

	//Get Element By ID Function
	function ge(x){	
		var e = document.getElementById(x);
		return e;
	};

	//Build Difficulty Select
	function buildSelect(argLocation,argLabel,argArray) {
		
		//Build Label
		var difficultyLabel = document.createElement('label');
		difficultyLabel.innerHTML = argLabel + ":&nbsp;<em>*</em>";
		

		//Build Select
		var selectElement = document.createElement('select');
		selectElement.setAttribute('id', 'userDifficulty');
		selectElement.setAttribute('class','gRequired');
		selectElement.setAttribute('data-native-menu', 'false');
		for(var i=0; i< argArray.length; i++) {
			var optionElement = document.createElement('option');
			optionElement.setAttribute('value', argArray[i]);
			optionElement.innerHTML = argArray[i];
			selectElement.appendChild(optionElement);
		};

		//Append to specified element
		ge(argLocation).appendChild(difficultyLabel);
		ge(argLocation).appendChild(selectElement);

	};

	//Save Data Function	
	function saveData(passedKey){
		if(!passedKey) {
			//Random Key
			var key = Math.floor(Math.random()*100000001);
		} else {
			key = passedKey;
		};
		
		//Individual Ingredient Addition
		var ingredientsArray = []; 
		
		//Find all elements w/ classname gIngredient
		ingredients = $('.gIngredient');	
		
		//Loop through elements returned
		ingredients.each (function(index) {
			if($(this).val() != '') {
				ingredientsArray.push($(this).val());
			};
			
		});

		recipe.rTitle 			= ["Title:", 		$("#recipeTitle").val()];
		recipe.rDescription		= ["Description:", 	$("#recipeSummary").val()];
		recipe.rDifficulty 		= ["Difficulty:", 	$("#userDifficulty").val()];
		recipe.rDate 			= ["Date:", 		$("#chooseDate").val()];
		recipe.rFlavor 			= ["Flavor:", 		$("#flavorRange").val()];
		recipe.rDirections 		= ["Directions:", 	$("#directions").val()];
		recipe.rLanguage		= ["Language:", 	$("#language").val()];
		recipe.rIngredients 	= ["Ingredients:", 	ingredientsArray];
		recipe.rCategory 		= ["Category:", 	getRadioValue('recipeCat')];	
		
		//Write recipe to local storage	
		localStorage.setItem(key, JSON.stringify(recipe));
		
		//Clear Form
		resetForm();
		
		alert("Your recipe is saved! Keep em coming!");
		$.mobile.changePage("#viewListPage"), {transition: "slide"};

	};
	
	function getRadioValue(radioName) {
		radioGroup = $('input[name="'+radioName+'"]')
		var radioValue;
		radioGroup.each (function(index) {
			if($(this).is(':checked')) {
				radioValue = $(this).val();
			}
		});
   		return radioValue;
	};

	function setRadioValue(radioName, radioValue) {
		clearRadioValue(radioName);
		radioGroup = $('input[name="'+radioName+'"]');
		radioGroup.each (function(index) {
			if($(this).val() === radioValue) {
				$(this).prop("checked",true).checkboxradio("refresh");
			};
		});
		
   		
	};

	function clearRadioValue(radioName) {
		radioGroup = $('input[name="'+radioName+'"]');
		radioGroup.each (function(index) {
			$(this).prop("checked" , false).checkboxradio("refresh");
		});
	};

	function checkRadios(radioName) {
		var radioGroup = document.getElementsByName(radioName);
		var boolFlag;
		for (var i=0; i < radioGroup.length; i++){
			if(radioGroup[i].checked) {
				boolFlag = true;
				break;
			} else {
				boolFlag = false;
			};
   		};
   		return boolFlag;
	};

	function addIngredient(processValue) {
		var uniqueKey = Math.floor(Math.random()*100000001);
		var container = $('#gIngredientContainer');
		var ingredientListItem = document.createElement('li');
		var ingredientListItemAnchor = document.createElement('a');
		var ingredientInput = document.createElement('input');
		var ingredientDelete = document.createElement('a');

		if(container.className === 'activeError') {
			container.className = '';
			container.innerHTML = '';
		};

		//Pass this unique key to the remove link
		ingredientDelete.key = uniqueKey;

		//Add unique id to list item
		ingredientListItem.setAttribute('id', uniqueKey);	

		//Set ListItemAnchor attributes
		ingredientListItemAnchor.setAttribute('href', '#');

		//Set Input attributes
		ingredientInput.setAttribute('type', 'text');
		ingredientInput.setAttribute('class','gIngredient');
		ingredientInput.setAttribute('placeholder','New Ingredient Item');	

		//Set Anchor tag attributes
		ingredientDelete.href = '#';
		ingredientDelete.setAttribute('class', 'gRemoveIngredient');
		ingredientDelete.innerHTML = 'Remove';

		//Add elements to dom
		ingredientListItem.appendChild(ingredientListItemAnchor);
		ingredientListItemAnchor.appendChild(ingredientInput);
		ingredientListItem.appendChild(ingredientDelete);
		container.append(ingredientListItem);

		//Bind event to link
		ingredientDelete.addEventListener('click', removeIngredient);	

		//To handle user or edit pop
		if(processValue != 'new') {
			ingredientInput.value = processValue;
		} else {
			ingredientInput.innerHTML = '';
		};

		container.trigger('create');
		container.listview('refresh');

	};

	function removeIngredient(e) {
		uniqueKey = this.key;
		//Find Element
		this.removeEventListener('click', removeIngredient);
		thisElement = document.getElementById(uniqueKey);
		thisElement.parentNode.removeChild(thisElement);
		e.preventDefault();

	};

	function buildDataList() {
		editItemKey = "";
		//If no data, pre-populate with JSON
		if (!localStorage.length) {
			alert("There are no recipes saved so i'm going to populate the list for you")
			prePopList(recipeJSON);			
		};

		//Define contentArea
		var pageContainer = $('#mainContent');
		pageContainer.empty();
		

		//Define unordered list
		var list = document.createElement('ul');
		list.setAttribute('id', 'dataList');
		list.setAttribute('data-role', 'listview');
		list.setAttribute('data-filter', 'true');
		list.setAttribute('data-inset', 'true');
		list.setAttribute('data-split-icon', 'gear');
		
		//Add list to container
		pageContainer.append(list);	

		//Loop through all localstorage items
		for(var i = 0, j=localStorage.length; i<j; i++ ){
			
			//Define key per loopIndex
			var storageKey = localStorage.key(i);


			//Convert localStorage item back to object
			var storageObject = JSON.parse(localStorage.getItem(storageKey));
			var itemCategory = storageObject.rCategory[1];

			//Define listItem
			var listItem 				= document.createElement('li');
			var listItemTitleWrapper 	= document.createElement('a');
			var listThumbNail			= document.createElement('img');
			var listItemTitle 			= document.createElement('h3');
			var listItemDescription 	= document.createElement('p');
			var listSubList 			= document.createElement('ul');

			listThumbNail.setAttribute('src', 'img/' + itemCategory + '.png');
			listThumbNail.setAttribute('class', 'ul-li-icon');

			//Loop through each storage object. Key pair values.
			for(var key in storageObject) {
				if(key === 'rTitle') {
					listItemTitle.innerHTML = storageObject[key][1];
				} else if (key === 'rDescription') {
					listItemDescription.innerHTML = storageObject[key][1];
				} else if (key === 'rIngredients') {
					
					var subListItem 		= document.createElement('li');
					var subListItemTitle	= document.createElement('strong');
					var orderedListIng		= document.createElement('ol');

					var ingArray = storageObject[key][1].toString().split(',');
					for(k=0; k < ingArray.length; k++) {
						var orderedListIngLi	= document.createElement('li');
						orderedListIngLi.innerHTML = ingArray[k];
						orderedListIng.appendChild(orderedListIngLi);
					};

					subListItemTitle.innerHTML = storageObject[key][0] + "&nbsp;";
					subListItem.appendChild(subListItemTitle);
					subListItem.appendChild(orderedListIng);
					//Add subListItem to subList
					listSubList.appendChild(subListItem);
				
				} else {
					var subListItem 		= document.createElement('li');
					var subListItemTitle 	= document.createElement('strong');
					var subListItemValue 	= document.createElement('span');

					//Print strings to corresponding elements
					subListItemTitle.innerHTML = storageObject[key][0] + "&nbsp;";
					subListItemValue.innerHTML = storageObject[key][1];

					//Add elements to parent list item
					subListItem.appendChild(subListItemTitle);
					subListItem.appendChild(subListItemValue);					
					
					//Add subListItem to subList
					listSubList.appendChild(subListItem);
				};
			};
			
			//Build Main List Item by adding individual elements
			listItemTitleWrapper.appendChild(listThumbNail);
			listItemTitleWrapper.appendChild(listItemTitle);
			listItemTitleWrapper.appendChild(listItemDescription);
			listItem.appendChild(listItemTitleWrapper);
			listItem.appendChild(listSubList);

			//Add Links
			buildListItemLinks(storageKey, listItem);


			//Append Each List Item
			list.appendChild(listItem);
		}; 	


	};


	//Nothing has been saved by user. Pre-populate the list with 
	//fake data.
	function prePopList(data) {
		//Loop through JSON data and store in local storage
	    for ( var key in data) {
	        localStorage.setItem(key, JSON.stringify(data[key]));
	    };		
	};

	//Create Edit and Delete Buttons
	function buildListItemLinks(itemKey, targetListItem) {
		var editBtn 		= document.createElement('a');

		//Build Edit Btn
		editBtn.key 		= itemKey;
		editBtn.href 		= '#addItemPage';
		editBtn.innerHTML 	= 'Edit';
		editBtn.addEventListener('click', setItemKey);

		//Build Delete Btn
		//deleteBtn.setAttribute('class','gBtn gDelete');
		//deleteBtn.key 		= itemKey;
		//deleteBtn.href 		= '#';
		//deleteBtn.innerHTML = 'Delete';
		//deleteBtn.addEventListener('click', deleteListItem);

		//Add newly created elements to dom
		targetListItem.appendChild(editBtn);

	};

	//Set Global itemKey
	function setItemKey() {
		//alert("setItemKey Function Entry");
		editItemKey = this.key;
		//alert("Edit Item Key = " + editItemKey);
	};	

	function editListItem() {			
		//alert("editListItem Function Entry");
		//Get data from localstorage
		var value = localStorage.getItem(editItemKey);
		//alert("Value Local Storage = " + value);
		var recipeItem = JSON.parse(value);
		//alert("RecipeItem JSON Parse = " +recipeItem);
		
		//Convert parse ingredient list back into array
		var ingredientArray = recipeItem.rIngredients[1].toString().split(',');

		for(i=0; i < ingredientArray.length; i++ ) {
			addIngredient(ingredientArray[i]);
		};

		//populate
		$("#recipeTitle").val(recipeItem.rTitle[1]).trigger("create");
		$("#recipeSummary").val(recipeItem.rDescription[1]).trigger("create");
		$("#userDifficulty").val(recipeItem.rDifficulty[1]).selectmenu("refresh");
		$("#chooseDate").val(recipeItem.rDate[1]).trigger("create");
		$("#flavorRange").val(recipeItem.rFlavor[1]).slider("refresh");
		$("#directions").val(recipeItem.rDirections[1]).trigger("create");
	
		//alert(recipeItem.rCategory[1]);
		setRadioValue('recipeCat',recipeItem.rCategory[1]);

		//Remove existing listener on save btn
		//saveRecipe.removeEventListener('click', saveData);
		
		//Store Btn within new variable
		//var updateRecipe = ge('submitForm');
		
		//Modify attributes and bind validateRecipe function w/ new EventListener.
		//updateRecipe.value = 'Update Recipe';
		//updateRecipe.addEventListener('click', validateRecipe);
		//updateRecipe.key = this.key;
	};
	

	function deleteListItem(){
		var verify = confirm('Are you sure you want to delete this recipe?')
		if(verify) {
			localStorage.removeItem(this.key);
			alert("Recipe has been deleted");
			window.location.reload();
		} else {
			alert('Recipe was not deleted');
		};
	};

	function validateRecipe(e) {
		var reqElements = $('.gRequired');
		//Start out by removing any pre-existing error classes / reset
		//This is mainly for re-validation		
		reqElements.removeClass('error');
		//alert(reqElements);
		var ingredientContainer = $('#gIngredientContainer');
		//Reset Error

		errorBox.innerHTML = '';
		errorArray = [];

		for(var i = 0; i < reqElements.length; i++) {
			//Test value string OR match first option string for select
			if((reqElements[i].value === "") || (reqElements[i].value === "-- Choose a Difficulty --")) {
				//set class on element.
				//Isn't it best practice to keep all styles and presentation within
				//the external CSS files? Having JS handle presentation defeats the
				//purpose, doesn't it? This is why I chose to append a class.
				reqElements[i].className += ' error';

				switch(reqElements[i].id){
				    case 'recipeTitle':
				    	errorArray.push('Please provide a title.');
				    	break;
			    	case 'recipeSummary':
			    		errorArray.push('Please provide a small description.');
				    	break;
			    	case 'userDifficulty':
			    		errorArray.push('Please select a difficulty level.');
				    	break;
			    	case 'ingredients':
			    		errorArray.push('Please provide ingredients.');
				    	break;
			    	case 'directions':
			    		errorArray.push('Please provide instructions.');
				    	break;				    	
			    	default:
		            
		            return false;
				};
			};

			$('addItemPage').trigger('updatelayout');

		};
		
		radioList = document.getElementById('subList');
		if(checkRadios('recipeCat')) {
			radioList.className = '';
		} else {
			//Add the class of error
			radioList.className += 'error';
			errorArray.push('Please provide a category.');			
		};
		
		//Check for no ingredients
		if(ingredientContainer.innerHTML == '') {
			var ingErrorLi = document.createElement('li');
			ingErrorLi.className = 'error errorListItem';
			ingErrorLi.innerHTML = 'Please provide atleast one ingredient';
			ingredientContainer.className = 'activeError';
			ingredientContainer.appendChild(ingErrorLi);
			errorArray.push('Please provide atleast one ingredient.')
		};


		//Handle errorBox messages via errorArray.
		if(errorArray.length > 0) {
			errorBox.style.display = 'block';
			for(i = 0; i < errorArray.length; i++) {
				var errorListItem = document.createElement('li');
				errorListItem.innerHTML = errorArray[i];
				errorBox.appendChild(errorListItem);
			};
			window.scrollTo(0,0);
			e.preventDefault();
			return false;			
		} else {
			saveData(this.key);
		};




	};

	//User Initiated Delete Local Storage. Using confirmBox.
	function clearLocalData(){
		if(!localStorage.length){
			alert("Sorry, there are no recipes to clear.");
			resetForm();	
		} else {
			//Offer the user a confirmationBox
            var confirmListDelete = confirm("Are you sure you want to clear all of the recipe data?");
            
            //If Confirmed, follow through.
            if(confirmListDelete === true) {
            	localStorage.clear();      	
            	alert("All recipes have been deleted!");
        	};

		};
	};
    

	//Clear form after submit. Eventually will only be called 
	//if validation is succesful
	function resetForm() {
		radioList2 = $('subList');	
		errorBox.style.display = 'none';
		//remove class of error
		radioList2.prop('class', '');


		//Remove Error Styling and Clear Error Report
		var reqElements = $('#gRequired');
		reqElements.each(function(index){
			$(this).prop('class', 'gRequired');
		});

		// Zero out all values for new recipe entry 
		clearRadioValue('recipeCat');
		$('#recipeTitle').value 		= ''
		$('#recipeSummary').value 	= ''
		$('#userDifficulty').value 	= ''
		$('#chooseDate').value 		= ''
		$('#flavorRange').value 		= ''
		$('#directions').value 		= ''
		$('#submitForm').value 		= 'Save Recipe';
		$('#gIngredientContainer').empty();
	};


	//Defaults
		var saveRecipe 				= ge('submitForm');
		var displayDataBtn 			= ge('displayData');
		var clearLocalDataBtn 		= ge('clearData');
		var addIngredientBtn		= ge('gAddIngredient');
		var errorBox				= ge('errorBox');
		var btnListener 			= true;
		var editItemKey				= "";
		var recipe 					= {};	
		
	//Define array for select
	var difficultyArray = ['-- Choose a Difficulty --','Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
	var errorArray = [];


	//Bind Functions
	saveRecipe.addEventListener('click', validateRecipe);
	//displayDataBtn.addEventListener('click', buildDataList);
	clearLocalDataBtn.addEventListener('click', clearLocalData);
	addIngredientBtn.addEventListener('click', function(e){
  		addIngredient('new');
  		e.preventDefault();
	});

	//Create Select Element Dropdown.
	buildSelect('chooseDifficulty', 'Difficulty', difficultyArray);

	$('#viewListPage').live('pagebeforecreate',function(event){
		buildDataList();
	});
	$('#addItemPage').live('pagebeforeshow',function(event){
		resetForm();
		//alert("Page bind here");
		if(editItemKey.length > 0) {
			//alert(editItemKey);
			$('#gIngredientContainer').empty();
			editListItem();
			$('#chooseDifficulty').trigger('create');
			$('#addItemPage').trigger('create');
		};

	});

});





