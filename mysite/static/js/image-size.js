$(document).ready(function(){
 id = $('.post_details').attr('id')
 $.ajax({
        type: "GET",
        url: "/image/"+id+"/ajax",
        success: function (response) {
               if( response.width!=0 && response.height!=0){
                    if(screen.width<580){
                        if(response.width<response.height){
                            width = "80%"
                            height = "80%"
                        }
                        else if((response.width-150)>response.height){
                            width = "90vw"
                            height = "50vw"
                        }
                        else{
                            width = "90vw"
                            height = "70vw"
                        }
                    }
                    else{
                        percent = 0;
                        if( response.width<response.height){
                            $(".text_and_image").css("display", "flex");
                            $(".post_details").css("width", "60vw");
                            $("#post_text").css("width", "45vw");
                            $("#post_text").css("margin-right", "3vw");
                            $("#post_image").css("margin", "20px 0 0 0");

                        }
                        if(response.width-100>response.height){
                                width = "70%";
                                height = "30%"
                                console.log(46)
                        }
                        else if(response.width>350){
                            if(response.width<450)
                                percent = 0.7;
                            else if(response.width<550)
                                percent= 0.6;
                            else if(response.width<650)
                                percent= 0.6;
                            else if(response.width<850)
                                percent= 0.4;
                            else percent = 0.3;
                            width = response.width*percent+"px";
                            height = response.height*percent+"px";
                        }
                        else{
                            width = response.width+"px";
                            height = response.height+"px";
                        }
                        if( response.width==response.height){
                            height = 350+"px"
                            width = 350+"px"
                        }

                    }
                  $("#post_image").css("height", height);
                  $("#post_image").css("width", width);
               }
         }
    });

})