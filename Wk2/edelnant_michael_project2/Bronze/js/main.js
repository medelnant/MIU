// Author: Michael S. Edelnant
// School: Full Sail University
// Course: MIU 1302
// Instructor: Robin Alarcon
// --------------------------------------------------------------------------- /
// Project 1 | Main.js
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
		ingredients = document.getElementsByClassName('gIngredient');	
		
		//Loop through elements returned
		for(i=0; i < ingredients.length; i++) {
			//If value = to '' don't bother storing it
			if(ingredients[i].value != '') {
				// else push value to array
				ingredientsArray.push(ingredients[i].value);
			};
		};

		var recipe 					= {};
			recipe.rTitle 			= ["Title:", ge("recipeTitle").value];
			recipe.rDescription		= ["Description:", ge("recipeSummary").value];
			recipe.rDifficulty 		= ["Difficulty:", ge("userDifficulty").value];
			recipe.rCategory 		= ["Category:", getRadioValue('recipeCat')];
			recipe.rDate 			= ["Date:", ge("chooseDate").value];
			recipe.rFlavor 			= ["Flavor:", ge("flavorRange").value];
			recipe.rIngredients 	= ["Ingredients:", ingredientsArray];
			recipe.rDirections 		= ["Directions:", ge("directions").value];
			recipe.rLanguage		= ["Language:", ge("language").value];	
		
		//Write recipe to local storage	
		localStorage.setItem(key, JSON.stringify(recipe));
		
		//Clear Form
		resetForm();
		
		alert("Your recipe is saved! Keep em coming!");
	};
	
	function getRadioValue(radioName) {
		var radioGroup = document.getElementsByName(radioName);
		var radioValue;
		for (var i=0; i < radioGroup.length; i++){
   			if (radioGroup[i].checked) {
      			radioValue = radioGroup[i].value;
      			break;
      		};
   		};
   		return radioValue;
	};

	function setRadioValue(radioName, radioValue) {
		var radioGroup = document.getElementsByName(radioName);
		for (var i=0; i < radioGroup.length; i++){
   			if (radioGroup[i].value === radioValue) {
      			radioGroup[i].value = radioValue;
      			radioGroup[i].checked = true;
      			break;
      		};
   		};
	};

	function clearRadioValue(radioName) {
		var radioGroup = document.getElementsByName(radioName);
		for (var i=0; i < radioGroup.length; i++){
   			if (radioGroup[i].checked == true) {
 				radioGroup[i].checked = false;
 				break;
      		};
   		};
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
		var container = ge('gIngredientContainer');
		var ingredientListItem = document.createElement('li');
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


		//Set Input attributes
		ingredientInput.setAttribute('type', 'text');
		ingredientInput.setAttribute('class','gIngredient');
		ingredientInput.setAttribute('placeholder','New Ingredient Item');	

		//Set Anchor tag attributes
		ingredientDelete.href = '#';
		ingredientDelete.setAttribute('class', 'gRemoveIngredient');
		ingredientDelete.innerHTML = 'Remove';

		//Add elements to dom
		ingredientListItem.appendChild(ingredientInput);
		ingredientListItem.appendChild(ingredientDelete);
		container.appendChild(ingredientListItem);

		//Bind event to link
		ingredientDelete.addEventListener('click', removeIngredient);	

		//To handle user or edit pop
		if(processValue != 'new') {
			ingredientInput.value = processValue;
		} else {
			ingredientInput.innerHTML = '';
		};

	};

	function removeIngredient(e) {
		uniqueKey = this.key;
		//Find Element
		this.removeEventListener('click', removeIngredient);
		thisElement = document.getElementById(uniqueKey);
		thisElement.parentNode.removeChild(thisElement);
		e.preventDefault();

	};

	function toggleDisplay(argBool) {
	    switch(argBool){
		    case 'dataDisplay':
		    	//Hide Form
		    	ge('addRecipeForm').style.display = 'none';

		    	
		    	//Change label of btn
		    	ge('displayData').innerHTML = 'Add Recipe';
		
		    	//Change Button Behavior
		    	setTimeout(function(){
		    		ge('displayData').href = 'addItem.html'								// Change href
		    		ge('displayData').removeEventListener('click', buildDataList)},10);	// Remove function binding
		    		btnListener = false;

		    	//resetForm
		    	resetForm();	
		    	break;
	    	case 'dataEntry':
	    		var pageContainer = ge('mainContent');
	    		var dataList = ge('dataList');
	    		//If dataList element exists, destroy it.
	  			if(dataList) {
	  				mainContent.removeChild(dataList);
	  			};
	  			
	  			//If the listener has been removed by the dataDisplay state
	  			//Add listener back & change href back to "#"
	  			if(btnListener == false) {
	    			ge('displayData').href = '#';
	    			ge('displayData').innerHTML = 'Display Data';
	  				ge('displayData').addEventListener('click', buildDataList);
	  			};	  			

	    		//Show Form
	    		ge('addRecipeForm').style.display = 'block';
	    		resetForm();

		    	break;
	    	case 'updateEntry':
	    		var pageContainer = ge('mainContent');
	    		var dataList = ge('dataList');

	    		//If dataList element exists, destroy it.
	  			if(dataList) {
	  				mainContent.removeChild(dataList);
	  			};

	  			//If the listener has been removed by the dataDisplay state
	  			//Add listener back and change verbage on button to say:
	  			//Change href back to "#"
	  			if(btnListener == false) {
	  				ge('displayData').href = '#';
	  				ge('displayData').innerHTML = 'Back to List';
	  				ge('displayData').addEventListener('click', buildDataList);
	  			};
	    		//Show Form
	    		ge('addRecipeForm').style.display = 'block';
	    		resetForm();
		    	break;		    	
	    	default:
            
            return false;
		};

	};

	function buildDataList() {
		
		//If no data, pre-populate with JSON
		if (!localStorage.length) {
			alert("There are no recipes saved so i'm going to populate the list for you")
			prePopList(recipeJSON);			
		};

		//Define contentArea
		var pageContainer = ge('mainContent');
		

		//Define unordered list
		var list = document.createElement('ul');
		list.setAttribute('id', 'dataList');
		list.className = 'fade';
		
		//Add list to container
		pageContainer.appendChild(list);	

		//Loop through all localstorage items
		for(var i = 0, j=localStorage.length; i<j; i++ ){
			
			//Define key per loopIndex
			var storageKey = localStorage.key(i);


			//Convert localStorage item back to object
			var storageObject = JSON.parse(localStorage.getItem(storageKey));
			var itemCategory = storageObject.rCategory[1];

			//Define listItem
			var listItem 				= document.createElement('li');
			var listItemTitleWrapper 	= document.createElement('div');
			var listItemTitle 			= document.createElement('h3');
			var listItemDescription 	= document.createElement('span');
		
			var listSubList 			= document.createElement('ul');

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
			getListItemImage(listItemTitleWrapper, itemCategory);
			listItemTitleWrapper.appendChild(listItemTitle);
			listItemTitleWrapper.appendChild(listItemDescription);
			listItem.appendChild(listItemTitleWrapper);
			listItem.appendChild(listSubList);

			//Add Links
			buildListItemLinks(storageKey, listItem);


			//Append Each List Item
			list.appendChild(listItem);
		}; 	

		/*Toggle Screen & Buttons*/
		toggleDisplay('dataDisplay');
		setTimeout(function() {
    		list.className = 'fade fadeIn';
		}, 50);

	};

	function getListItemImage(argTarget, argCat) {
		var newImg = document.createElement('img');
		newImg.setAttribute('src', 'img/' + argCat + '.png');
		argTarget.appendChild(newImg);
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
		var linkContainer	= document.createElement('p');
		var editBtn 		= document.createElement('a');
		var deleteBtn 		= document.createElement('a');

		
		//Build Edit Btn
		editBtn.setAttribute('class','gBtn gEdit');
		editBtn.key 		= itemKey;
		editBtn.href 		= '#';
		editBtn.innerHTML 	= 'Edit';
		editBtn.addEventListener('click', editListItem);

		//Build Delete Btn
		deleteBtn.setAttribute('class','gBtn gDelete');
		deleteBtn.key 		= itemKey;
		deleteBtn.href 		= '#';
		deleteBtn.innerHTML = 'Delete';
		deleteBtn.addEventListener('click', deleteListItem);

		//Add newly created elements to dom
		linkContainer.appendChild(editBtn);
		linkContainer.appendChild(deleteBtn);
		targetListItem.appendChild(linkContainer);

	};	

	function editListItem() {
		//Show form
		toggleDisplay('updateEntry');
		
		//Get data from localstorage
		var value = localStorage.getItem(this.key);
		var recipe = JSON.parse(value);

		//Convert parse ingredient list back into array
		var ingredientArray = recipe.rIngredients[1].toString().split(',');

		for(i=0; i < ingredientArray.length; i++ ) {
			addIngredient(ingredientArray[i]);
		};

		//populate
		ge("recipeTitle").value 		= recipe.rTitle[1];
		ge("recipeSummary").value 	= recipe.rDescription[1];
		ge("userDifficulty").value 	= recipe.rDifficulty[1];
		ge("chooseDate").value 		= recipe.rDate[1];
		ge("flavorRange").value 		= recipe.rFlavor[1];
		ge("directions").value 		= recipe.rDirections[1];

		
		setRadioValue('recipeCat',recipe.rCategory[1]);

		//Remove existing listener on save btn
		saveRecipe.removeEventListener('click', saveData);
		
		//Store Btn within new variable
		var updateRecipe = ge('submitForm');
		
		//Modify attributes and bind validateRecipe function w/ new EventListener.
		updateRecipe.value = 'Update Recipe';
		updateRecipe.addEventListener('click', validateRecipe);
		updateRecipe.key = this.key;
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
		var reqElements = document.getElementsByClassName('gRequired');
		var ingredientContainer = ge('gIngredientContainer');
		//Reset Error

		errorBox.innerHTML = '';
		errorArray = [];

		for(var i = 0; i < reqElements.length; i++) {
			//Start out by removing any pre-existing error classes / reset
			//This is mainly for re-validation
			reqElements[i].className = 'gRequired';
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
				toggleDisplay('dataEntry');        	
            	alert("All recipes have been deleted!");
        	};

		};
	};
    

	//Clear form after submit. Eventually will only be called 
	//if validation is succesful
	function resetForm() {
		radioList2 = document.getElementById('subList');	
		errorBox.style.display = 'none';
		//remove class of error
		radioList2.className = '';


		//Remove Error Styling and Clear Error Report
		var reqElements = document.getElementsByClassName('gRequired');
		for(i = 0; i < reqElements.length; i ++) {
			reqElements[i].className = 'gRequired';
		}
		
		// Zero out all values for new recipe entry 
		clearRadioValue('recipeCat');
		ge('recipeTitle').value 		= ''
		ge('recipeSummary').value 	= ''
		ge('userDifficulty').value 	= ''
		ge('chooseDate').value 		= ''
		ge('flavorRange').value 		= ''
		ge('directions').value 		= ''
		ge('submitForm').value 		= 'Save Recipe';
		ge('gIngredientContainer').innerHTML = ''
	};


	//Defaults
		var saveRecipe 			= ge('submitForm');
		var displayDataBtn 		= ge('displayData');
		var clearLocalDataBtn 	= ge('clearData');
		var addIngredientBtn	= ge('gAddIngredient');
		var errorBox			= ge('errorBox');
		var btnListener 		= true;	
		
	//Define array for select
	var difficultyArray = ['-- Choose a Difficulty --','Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
	var errorArray = [];


	//Bind Functions
	saveRecipe.addEventListener('click', validateRecipe);
	displayDataBtn.addEventListener('click', buildDataList);
	clearLocalDataBtn.addEventListener('click', clearLocalData);
	addIngredientBtn.addEventListener('click', function(e){
  		addIngredient('new');
  		e.preventDefault();
	});

	//Create Select Element Dropdown.
	buildSelect('chooseDifficulty', 'Difficulty', difficultyArray);
	
});




