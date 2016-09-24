var autocomplete_data = [];
var dataSource = [];


$(document).ready(function(){

	$(".clearSearch").on("click", function(){
    	$("#searchInput").val('');
    	getListItem();
	});//clear the search field

	var $loading = $('.ajax-loader').hide();
	$(document)
	.ajaxStart(function () {
    	$(".clearSearch").hide();
    	$loading.show();
  	})
  	.ajaxStop(function () {
    	$loading.hide();
    	$(".clearSearch").show();
  	});

	getListItem();
});

// //Get site information from the API
function getListItem(){
	var url = "https://hackerearth.0x10.info/api/learning-paths?type=json&query=list_paths";

	$.ajax({
  			dataType: 'json',
  			url: url,
  			type: "GET",
  			success: function(data, textStatus, jqXHR){

				dataSource = data.paths;
				
				initAutoComplete();

				createList(dataSource);

				createPagination();

				$(".course-paginate").first().click();

				$("#no-of-results").text("Result: "+ dataSource.length +" courses found.");

				setUpVotes();
				
  			},
  			error: function(){
  				$(".course-result").html("");
  				$("#no-of-results").text("");
				var list_html = '<li class="list-group-item">No course found!</li>';
				$(".course-result").append(list_html);
  			} 
	});
}

function createList(resultList){
	if(resultList.length > 0){

		var html= '';

		var counter = 1;

		$.each(resultList, function(key, value){
			
			var id = (value.id === null) ? "" : value.id;
			var name = (value.name === null) ? "" : value.name;
			var learners = (value.learner === null) ? "" : value.learner;
			var hours = (value.hours === null) ? "" : value.hours;
			var ups = "";
			var downs = "";
			if(id !== ""){
				ups = JSON.parse(localStorage.getItem(id)).upvote;
				downs = JSON.parse(localStorage.getItem(id)).downvote;
			}
			html += '<li class="course-li"><a class="course-paginate" onclick="showCourse('+key+')" id="'+id+'" data-rank="'+counter+'" data-user="'+learners+'" data-hour="'+hours+'" data-up="'+ups+'" data-down="'+downs+'">'+ name +'</a></li>';
			counter++;
		});

		$(html).insertAfter("#prev-list");

	}
	else{			
					
		$(".course-result").html("");
		var list_html = '<li class="list-group-item">No course found!</li>';
		$(".scourse-result").append(list_html);
	}
}

function createPagination(){

	if(dataSource.length > 5){

		$('.course-paginate').hide();

		for(i=1; i<=5; i++){
			$('[data-rank="'+i+'"]').show();
		}

	}
}

function setUpVotes(){
	$.each(dataSource, function(key, value){
			var id = (value.id === null) ? "" : value.id;
			if(id !== "" && localStorage.getItem(id) === null){
				localStorage.setItem(id, JSON.stringify({'upvote':0, 'downvote':0}));
			}
		});
}

function showCourse(_key){

	var name = (dataSource[_key].name === null) ? "" : dataSource[_key].name;
	var tags = (dataSource[_key].tags === null || dataSource[_key].tags.length === 0) ? [] : dataSource[_key].tags;
	var image = (dataSource[_key].image === null) ? "" : dataSource[_key].image;
	var learner = (dataSource[_key].learner === null) ? "" : dataSource[_key].learner;
	var hours = (dataSource[_key].hours === null) ? "" : dataSource[_key].hours;
	var description = (dataSource[_key].description === null) ? "" : dataSource[_key].description;
	var sing_up = (dataSource[_key].sing_up === null) ? "" : dataSource[_key].sing_up;
	var id = (dataSource[_key].id === null) ? "" : dataSource[_key].id;

	if(id !== ""){
		var ups = JSON.parse(localStorage.getItem(id)).upvote;
		var downs = JSON.parse(localStorage.getItem(id)).downvote;
		$("#badge_up").text(ups);
		$("#badge_down").text(downs);
		$('#badge_up').parent().attr('id','up_'+id);
		$('#badge_down').parent().attr('id','down_'+id);
	}

	$("#result_heading").text(name);
	$("#result_tag").text(tags);
	$("#course_image").attr('src', image);
	$("#learners").text(learner);
	$("#hours").text(hours);
	$("#course_desc").text(description);
	$("#view_curr").attr("href", sing_up);
}

function getPrev(_this){
	var rank = $(".course-paginate:visible").first().data('rank');
	rank=parseInt(rank);
	if(rank > 1){
		var first_rank = rank - 1;
		var last_rank = rank + 4;

		$('[data-rank="'+first_rank+'"]').show();
		$('[data-rank="'+last_rank+'"]').hide();	
	}
}

function getNext(_this){
	var rank = $(".course-paginate:visible").last().data('rank');
	rank=parseInt(rank);
	if(rank >= 5){
		var first_rank = rank - 4;
		var last_rank = rank + 1;
		if(last_rank <= dataSource.length){
			$('[data-rank="'+first_rank+'"]').hide();
			$('[data-rank="'+last_rank+'"]').show();		
		}	
	}
}

function sortByLearners(){
	var list_items = $(".course-li");
	$(".course-li").remove();
	list_items.sort(sort_learners).insertAfter("#prev-list");

	$( ".course-paginate" ).each(function( index ) {
  		$(this).attr('data-rank',index+1);
	});

	createPagination();


	function sort_learners(a, b){
		var first = $(a).find('a').data('user');
		var second = $(b).find('a').data('user');
	    return ((first < second) ? 1 : -1);     
	}
}


function sortByDuration(){
	var list_items = $(".course-li");
	$(".course-li").remove();
	list_items.sort(sort_hours).insertAfter("#prev-list");

	$( ".course-paginate" ).each(function( index ) {
  		$(this).attr('data-rank',index+1);
	});

	createPagination();


	function sort_hours(a, b){
		var first = parseInt($(a).find('a').data('hour').split("+")[0]);
		var second = parseInt($(b).find('a').data('hour').split("+")[0]);


	    return ((first < second) ? 1 : -1);    
	}
}

function sortByUpVote(){
	var list_items = $(".course-li");
	$(".course-li").remove();
	list_items.sort(sort_ups).insertAfter("#prev-list");

	$( ".course-paginate" ).each(function( index ) {
  		$(this).attr('data-rank',index+1);
	});

	createPagination();


	function sort_ups(a, b){
		var first = parseInt($(a).find('a').data('up'));
		var second = parseInt($(b).find('a').data('up'));

	    return ((first < second) ? 1 : -1);    
	}
}


function sortByDownVote(){
	var list_items = $(".course-li");
	$(".course-li").remove();
	list_items.sort(sort_downs).insertAfter("#prev-list");

	$( ".course-paginate" ).each(function( index ) {
  		$(this).attr('data-rank',index+1);
	});

	createPagination();


	function sort_downs(a, b){
		var first = parseInt($(a).find('a').data('down'));
		var second = parseInt($(b).find('a').data('down'));

	    return ((first < second) ? 1 : -1);    
	}
}

function upVote(_this){
	var _key = $(_this).attr('id').split('up_')[1];
	var value = JSON.parse(localStorage.getItem(_key));
	var no_up = value.upvote + 1;
	var new_val = JSON.stringify({'upvote':no_up,'downvote':value.downvote});
	localStorage.setItem(_key, new_val);
	$("#badge_up").text(no_up);
	$("#"+_key).attr('data-up',no_up);
}

function downVote(_this){
	var _key = $(_this).attr('id').split('down_')[1];
	var value = JSON.parse(localStorage.getItem(_key));
	var no_down = value.downvote + 1;
	var new_val = JSON.stringify({'upvote':value.upvote,'downvote':no_down});
	localStorage.setItem(_key, new_val);
	$("#badge_down").text(no_down);
	$("#"+_key).attr('data-down',no_down);
}

function initAutoComplete(){

	$.each(dataSource, function(key, value){

			var tags = (value.tags === null || value.tags.length === 0) ? [] : value.tags;

			tags = tags.split(',');
			
			if(tags.length > 0){
				for(i=0; i<tags.length; i++){
					var term = tags[i];
					if(term !== "" && autocomplete_data.indexOf(term)==-1){
						autocomplete_data.push(term.toLowerCase());
					}
				}
			}
			
		});
}

function filter_result(_term){
	var filter_data = [];
	$.each(dataSource, function(key, value){

			var tags = (value.tags === null || value.tags.length === 0) ? [] : value.tags;

			var pattern = new RegExp(_term, 'i');

			var flag = tags.search(pattern);

			if(flag !== -1){
				filter_data.push(this);
			}
		});
	dataSource = [];

	dataSource = filter_data;

	$(".course-li").remove();

	createList(dataSource);

	createPagination();

	$(".course-paginate").first().click();

	$("#no-of-results").text("Result: "+ dataSource.length +" courses found.");

	setUpVotes();
}



$( function() {
 
    $( "#searchInput" ).autocomplete({
      source: autocomplete_data,
      minLength: 2,
      select: function( event, ui ) {
		filter_result(ui.item.value);
      }
    });

  } );




