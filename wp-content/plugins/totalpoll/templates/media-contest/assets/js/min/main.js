jQuery(function($){var imagesTosrus=$('.totalpoll-poll-container[data-template="media-contest"] a.totalpoll-display-image.totalpoll-supports-full').tosrus({buttons:{prev:false,next:false},wrapper:{onClick:"close"}});var videosTosrus=$('.totalpoll-poll-container[data-template="media-contest"] a.totalpoll-display-video').tosrus({buttons:{prev:false,next:false},wrapper:{onClick:"close"},youtube:{imageLink:false}});$(document).on("totalpoll.after.ajax",function(e,data){$(imagesTosrus).remove();$(videosTosrus).remove();var imagesTosrus=$("a.totalpoll-display-image.totalpoll-supports-full",data.container).tosrus({buttons:{prev:false,next:false},wrapper:{onClick:"close"}});var videosTosrus=$("a.totalpoll-display-video",data.container).tosrus({buttons:{prev:false,next:false},wrapper:{onClick:"close"},youtube:{imageLink:false}});var $choices=$(".totalpoll-view-vote .totalpoll-choice");$.each($choices,function(index){var $currentChoice=$($choices[index]);if($currentChoice.find(".totalpoll-choice-checkbox").prop("checked")==true){$currentChoice.addClass("totalpoll-choice-selected");}});});$(document).delegate(".totalpoll-view-vote .totalpoll-choice-checkbox","change",function(e){var $input=$(this);var $choice=$input.closest(".totalpoll-choice");if($input.attr("type")=="radio"){$input.closest(".totalpoll-choices").find("input[type=radio]").closest(".totalpoll-choice").removeClass("totalpoll-choice-selected");}if($input.prop("checked")==true){$choice.addClass("totalpoll-choice-selected");}else{$choice.removeClass("totalpoll-choice-selected");}});$(document).delegate(".totalpoll-view-vote .totalpoll-choice-other-type .totalpoll-other-field","keyup",function(e){var $field=$(this);var fieldValue=$field.val();var $choice=$field.closest(".totalpoll-choice");if(fieldValue!==""){$choice.addClass("totalpoll-choice-selected");}else{$choice.removeClass("totalpoll-choice-selected");}});$(document).delegate(".totalpoll-choice .totalpoll-choice-media > a.totalpoll-supports-full","click",function(e){e.preventDefault();});});