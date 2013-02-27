// Author: Michael S. Edelnant
// School: Full Sail University
// Course: MIU 1302
// Instructor: Robin Alarcon
// --------------------------------------------------------------------------- /
// Project 2 | Main.js
// --------------------------------------------------------------------------- /


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
	$.mobile.changePage("#viewListPage"), {
		transition: "slide"
	};

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
	$('#cat_snack').prop('checked', true);
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
	$('.activeError').remove();
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


function buildDataList(arg) {
	//alert(globalCategory);

	//Define Wrapping Element
	var list = $('#dataList');

	//Cleat Global Edit Item Key
	editItemKey = '';

	//If no data, pre-populate with JSON
	if (!localStorage.length) {
		alert("There are no recipes saved so i'm going to populate the list for you")
		prePopList(recipeJSON);			
	};	



	if(arg) {
		$('#dynamicTitle').html("Viewing " + arg + " Recipes")
		//alert('i got something');
		//Loop through all localstorage items and draw to stage
		for(var i = 0, j=localStorage.length; i<j; i++ ){
			//Define key per loopIndex
			var storageKey = localStorage.key(i);


			//Convert localStorage item back to object
			var storageObject = JSON.parse(localStorage.getItem(storageKey));
			var itemCategory = storageObject.rCategory[1];
			if(itemCategory === arg) {
				//Define listItem
				var listItem 				= document.createElement('li');
				var listItemTitleAnchor 	= document.createElement('a')
				var listThumbNail			= document.createElement('img');
				var listItemTitle 			= document.createElement('h3')
				var listItemDescription 	= document.createElement('p')

				listThumbNail.setAttribute('src', 'img/' + itemCategory + '.png');
				listThumbNail.setAttribute('class', 'ul-li-icon');

				//Write Values
				listItemTitleAnchor.setAttribute('href', '#viewItemPage');
				listItemTitleAnchor.setAttribute('data-transition', 'slide');
				listItemTitleAnchor.key 		= storageKey;
				listItemTitleAnchor.className 	= 'recipeLink';
				listItemTitle.innerHTML 		= storageObject.rTitle[1];
				listItemDescription.innerHTML 	= storageObject.rDescription[1]

				//Build Main List Item by adding individual elements
				listItemTitleAnchor.appendChild(listThumbNail);
				listItemTitleAnchor.appendChild(listItemTitle);
				listItemTitleAnchor.appendChild(listItemDescription);
				listItem.appendChild(listItemTitleAnchor);

				//Add Links
				buildListItemLinks(storageKey, listItem);


				//Append Each List Item
				list.append(listItem);
				list.listview('refresh');
			};			
		};		
	} else {
		$('#dynamicTitle').html("Viewing All Recipes")
		//alert('i got nothing');
		//Loop through all localstorage items and draw to stage
		for(var i = 0, j=localStorage.length; i<j; i++ ){
			//Define key per loopIndex
			var storageKey = localStorage.key(i);


			//Convert localStorage item back to object
			var storageObject = JSON.parse(localStorage.getItem(storageKey));
			var itemCategory = storageObject.rCategory[1];

			//Define listItem
			var listItem 				= document.createElement('li');
			var listItemTitleAnchor 	= document.createElement('a')
			var listThumbNail			= document.createElement('img');
			var listItemTitle 			= document.createElement('h3')
			var listItemDescription 	= document.createElement('p')

			listThumbNail.setAttribute('src', 'img/' + itemCategory + '.png');
			listThumbNail.setAttribute('class', 'ul-li-icon');

			//Write Values
			listItemTitleAnchor.setAttribute('href', '#viewItemPage');
			listItemTitleAnchor.setAttribute('data-transition', 'slide');
			listItemTitleAnchor.key 		= storageKey;
			listItemTitleAnchor.className 	= 'recipeLink';
			listItemTitle.innerHTML 		= storageObject.rTitle[1];
			listItemDescription.innerHTML 	= storageObject.rDescription[1]

			//Build Main List Item by adding individual elements
			listItemTitleAnchor.appendChild(listThumbNail);
			listItemTitleAnchor.appendChild(listItemTitle);
			listItemTitleAnchor.appendChild(listItemDescription);
			listItem.appendChild(listItemTitleAnchor);

			//Add Links
			buildListItemLinks(storageKey, listItem);


			//Append Each List Item
			list.append(listItem);
			list.listview('refresh');			
		};		
	};





};

function buildItemPage() {
	var recipeContainer 	= $('#viewItemContent');
	var recipe 				= JSON.parse(localStorage.getItem(editItemKey));

	//Initially Empty Container when this function gets processed
	recipeContainer.empty();
	
	//Create Page Elements
	var pageTitle 					= document.createElement('h2');
	var pageDescription				= document.createElement('p');
	var pageDifficulty				= document.createElement('p');
	var pageCategory				= document.createElement('p');
	var pageDate					= document.createElement('p');
	var pageFlavor					= document.createElement('p');
	var pageDirections				= document.createElement('p');
	var pageIngWrapper				= document.createElement('div')
	var pageIngList			= document.createElement('ul');


	//Write values to specific elements
	pageTitle.innerHTML 			= recipe.rTitle[1];
	pageDescription.innerHTML 		= recipe.rDescription[1];
	pageDifficulty.innerHTML 		= "<strong>Difficulty:</strong> " + recipe.rDifficulty[1];
	pageCategory.innerHTML 			= "<strong>Category:</strong> " + recipe.rCategory[1];
	pageDate.innerHTML				= "<strong>Date:</strong> " + recipe.rDate[1];
	pageFlavor.innerHTML			= "<strong>Flavor:</strong> " + recipe.rFlavor[1];
	pageDirections.innerHTML		= "<strong>Directions:</strong><br />" + recipe.rDirections[1];
	pageIngWrapper.innerHTML 		= "<strong>Ingredients</strong><br />";

	//Build List
	var ingArray = recipe.rIngredients[1].toString().split(',')
	for(i=0; i<ingArray.length; i++) {
		var pageIngListItem		= document.createElement('li');
		pageIngListItem.innerHTML	= ingArray[i];
		pageIngList.appendChild(pageIngListItem);
	};
	pageIngWrapper.appendChild(pageIngList);

	//Put Page Together
	recipeContainer.append(pageTitle);
	recipeContainer.append(pageDate);		
	recipeContainer.append(pageDescription);
	recipeContainer.append(pageCategory);
	recipeContainer.append(pageFlavor);				
	recipeContainer.append(pageDifficulty);
	recipeContainer.append(pageIngWrapper);		
	recipeContainer.append(pageDirections);

	//Reset Global Item Key
	editItemKey = '';
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
	editBtn.setAttribute('data-transition','slide')
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
	editItemKey = this.key;
};

//Clear Global itemKey
function clearItemKey() {
	editItemKey = '';
};			

function editListItem() {			
	//Get data from localstorage
	alert('editing Item I think');
	var value = localStorage.getItem(editItemKey);
	var recipeItem = JSON.parse(value);
	
	//Convert parse ingredient list back into array
	var ingredientArray = recipeItem.rIngredients[1].toString().split(',');

	for(i=0; i < ingredientArray.length; i++ ) {
	addIngredient(ingredientArray[i]);
	};
	$("#userDifficulty").selectmenu();
	//populate
	$("#recipeTitle").val(recipeItem.rTitle[1]).trigger("create");
	$("#recipeSummary").val(recipeItem.rDescription[1]).trigger("create");
	$("#userDifficulty").val(recipeItem.rDifficulty[1]).selectmenu("refresh");
	$("#chooseDate").val(recipeItem.rDate[1]).trigger("create");
	$("#flavorRange").val(recipeItem.rFlavor[1]).slider("refresh");
	$("#directions").val(recipeItem.rDirections[1]).trigger("create");

	setRadioValue('recipeCat',recipeItem.rCategory[1]);

	$('#submitForm').val('Update').button('refresh');
	$('#deleteItem').on('click', function(event, ui) {
		deleteListItem(deleteItemKey);
	});
};


function deleteListItem(itemKey){
	var verify = confirm('Are you sure you want to delete this recipe?')
	if(verify) {
		localStorage.removeItem(itemKey);
		resetForm();
		alert("Recipe has been deleted");
	} else {
		alert('Recipe was not deleted');
	};
	deleteItemKey = '';
};

function validateRecipe(e) {
	var reqElements = $('.gRequired');
	//Start out by removing any pre-existing error classes / reset
	//This is mainly for re-validation		
	reqElements.removeClass('error');
	var ingredientContainer = $('#gIngredientContainer');
	//Reset Error
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
		    		$('#userDifficulty').removeClass('error')
		    		$('.ui-select div').addClass('error');
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
		$('#userDifficulty').selectmenu();
		$('#userDifficulty').selectmenu('refresh');
		$('addItemPage').trigger('updatelayout');

	};
	
	radioList = $('.ui-controlgroup label');
	if(checkRadios('recipeCat')) {
		radioList.removeClass('error');
	} else {
		//Add the class of error
		radioList.addClass('error');
		errorArray.push('Please provide a category.');			
	};
	
	//Check for no ingredients
	if(ingredientContainer.is(':empty')) {
		var ingErrorLi = document.createElement('div');
		ingErrorLi.className = 'activeError';
		ingErrorLi.innerHTML = 'Please provide atleast one ingredient';
		ingredientContainer.before(ingErrorLi)
		//ingredientContainer.append(ingErrorLi);
		errorArray.push('Please provide atleast one ingredient.')
	};


	//Handle errorBox messages via errorArray.
	if(errorArray.length > 0) {
		$('#errorBox').show();
		for(i = 0; i < errorArray.length; i++) {
			var errorListItem = document.createElement('li');
			errorListItem.innerHTML = errorArray[i];
			$('#errorBox').append(errorListItem);
		};
		window.scrollTo(0,0);
		e.preventDefault();
		return false;			
	} else {
		if(editItemKey.length > 0) {
			saveData(editItemKey);

		} else {
			saveData(this.key);
		}
		
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
	$('.error').removeClass('error');
	$('.activeError').remove();

	//Remove Error Styling and Clear Error Report
	var reqElements = $('#gRequired');
	reqElements.each(function(index){
		$(this).prop('class', 'gRequired');
	});		
	
	//Clear Classes
	radioList2 = $('subList');
	radioList2.prop('class', '');
	$('#cat_snack').prop('checked', true);

	//Set Delete Button to disable again
	$('#deleteItem').button('disable').button('refresh');

	//Re-instantiate selectmenu widget
	$('#chooseDifficulty').empty();
	
	// Zero out all values for new recipe entry 
	clearRadioValue('recipeCat');
	$('#recipeTitle').val('').trigger("create");
	$('#recipeSummary').val('').trigger("create");
	$('#userDifficulty').val('').selectmenu("refresh");
	$('#chooseDate').val('').trigger("create");
	$('#flavorRange').val('50').slider("refresh");
	$('#directions').val('').trigger("create");
	$('#submitForm').val('Save').button('refresh');
	$('#gIngredientContainer').empty();
};


//Defaults
var linkAddItem				= $('#addItemLink');
var btnListener 			= true;
var deleteItem 				= $("#deleteItem");
var editItemKey				= "";
var deleteItemKey			= "";
var globalCategory			= "";
var recipe 					= {};	
	
//Define array for select
var difficultyArray = ['-- Choose a Difficulty --','Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'];
var errorArray = [];

$('#indexPage').live('pageshow',function(event){
	$('.browseCat').click( function() {
		globalCategory = $(this).attr('data-category');
	});

});
$('#indexPage').live('pagehide',function(event){$('.browseCat').off('click')});

$('#viewListPage').live('pagebeforeshow',function(event){
	var clearDataLink			= $('#clearDataLink');
		//Populate Data List
	
	if(!globalCategory.length) {
		buildDataList();
	} else {
		buildDataList(globalCategory);
	};
	clearDataLink.bind('click', clearLocalData);
	$('.recipeLink').bind('click', setItemKey);			
});
$('#viewListPage').live('pagehide',function(event){
	$('#dataList').empty();
	globalCategory = '';
});

$('#addItemPage').live('pagebeforeshow',function(event){
	//Always reset page on pagebeforeshow
	resetForm();
	//Create Select Element Dropdown.
	buildSelect('chooseDifficulty', 'Difficulty', difficultyArray);	
	
	$.mobile.defaultHomeScroll = 0.		
	
	//Disable delete Button on pagebeforeshow
	$('#deleteItem').button('disable').button('refresh');
	if(editItemKey.length > 0) {
		//Pass key around for deleteListItem Function to pull from
		deleteItemKey = editItemKey;
		$('#deleteItem').button('enable').button('refresh');
		//Grab specific item data & populate form
		editListItem();
		//Change text for save/update button
		$('addItemLink').html('Update').trigger('create');
	};
	
	//Bind Functions
	$('#submitForm').on('click', validateRecipe);
	$('#gAddIngredient').on('click', function(e){
			addIngredient('new');
			e.preventDefault();
	});	
	
	//Attempt a redrawing page. Not sure this is necessary but keeping it in for failsafe.
	$(this).trigger('create');			
});
$('#addItemPage').live('pagehide',function(event){
	$('#errorBox').empty().hide();
	$('#submitForm').off('click');
	$('#gAddIngredient').off('click');
	editItemKey = '';
});

$('#viewItemPage').live('pageshow',function(event){
	buildItemPage();		
});	

//Specify JQM Global Defaults
$(document).bind("mobileinit", function() {
	$.mobile.defaultPageTransition = 'slide';
});








