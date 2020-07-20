$(document).ready(function(){

 $.ajax({
        type: "GET",
        url: "",
        success: function (response) {
               if( response.width!=0 && response.height!=0){
                    console.log(response.width, response.height)
                    if( response.width<response.height){
                        $("#post_image").css("height", "450px");
                        $("#post_image").css("width", "300px");
                    }
                    if( response.width==response.height){
                        $("#post_image").css("height", "350px");
                        $("#post_image").css("width", "350px");
                    }
               }
         }
    });

})