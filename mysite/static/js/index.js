let scroll_valid = true
let Up = () => {
    $('html').animate({scrollTop:0}, '300');

 }
let Close = () => {
    document.getElementsByClassName("background_shadow")[0].style.visibility=  'hidden';
    document.getElementsByClassName("view_image")[0].style.visibility=  'hidden';
    document.getElementById('circle-close-image').style.visibility=  'hidden';
    document.getElementById('button1').style.visibility=  'visible'
    document.getElementById('button2').style.visibility =  'hidden'
    scroll_valid = true
}
let ChangeHeightGoalsList = () =>{
    heightMain = $(".main").height()-20;
    heightBody = $("body").height();
    $(".goals-content").css("height", heightBody - heightMain+"px");
    if($(".goals-content").height()<$("#myUL").height())
        $(".list-goals").css("height", "max-content");
    else
        $(".list-goals").css("height", "inherit");
}
$(document).on('click', '.addBtn', function(){
    var value = $('#myInput').val();
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/goal/add/",
        data: {text: value},
        success: function (response) {
                    goal = response.goal
                    $('#myUL').append('<div id="div_goal_'+goal[0].id+'" class="div_goal"></div>')
                    $('#div_goal_'+goal[0].id).append('<li id="goal_'+goal[0].id+'"></li>')
                    $('#goal_'+goal[0].id).text(goal[0].text)
                    $('#div_goal_'+goal[0].id).append('<span class="close" id="close_'+goal[0].id+'">✕</li>')
                    $("#myInput").val('');
                    ChangeHeightGoalsList();
        }
    });
});
$(document).on('click', '.close', function(){
    id = $(this).attr('id')
    id = id.slice(6)
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/goal/delete/",
        data: {goal_id: id},
        success: function (data) {
         $('#div_goal_'+id).remove();
         ChangeHeightGoalsList();
        }
    });
});
$(document).on('click', 'li', function(){
    id = $(this).attr('id')
    id = id.slice(5)
    li_class = $(this).attr('class')
    var goal_done
    if (li_class == "checked"){
        goal_done = true
    }
    else{
        goal_done = false
    }
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/goal/edit/",
        data: {goal_id: id,
               done: goal_done},
        success: function (response) {
            if (goal_done){
                   $('#goal_'+id).removeClass()}
            else{
                   $('#goal_'+id).addClass('checked')}
        }
    });
});
let AddNote = () => {
    document.getElementsByClassName("border-note")[0].style.visibility=  'hidden'
    document.getElementsByClassName("note")[0].style.visibility=  'hidden'
    document.getElementById('new-note').style.visibility =  'visible'
    document.getElementById('close-note').style.visibility =  'visible'
    document.getElementById('save-note').style.visibility =  'visible'
}
let CloseNoteRedactor = () => {
    document.getElementsByClassName("border-note")[0].style.visibility=  'visible'
    document.getElementsByClassName("note")[0].style.visibility=  'visible'
    document.getElementById('new-note').style.visibility =  'hidden'
    document.getElementById('close-note').style.visibility =  'hidden'
    document.getElementById('save-note').style.visibility =  'hidden'
}
let SendNote = () => {
  var text_value = $('#new-note').val();
  $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8000/home/ajax",
        data: {text: text_value},
        success: function (data) {
        $('.note').text(text_value);
        }
//        error: function (){
//            console.log(313)
//        }
    });
    document.getElementById('new-note').value = ""
    document.getElementsByClassName("border-note")[0].style.visibility=  'visible'
    document.getElementsByClassName("note")[0].style.visibility=  'visible'
    document.getElementById('new-note').style.visibility =  'hidden'
    document.getElementById('close-note').style.visibility =  'hidden'
    document.getElementById('save-note').style.visibility =  'hidden'

}

let ChangeButtonColor = () => {
    if(document.getElementById('id-image').val()){
    document.getElementsByClassName('new-button')[0].style.background = 'white'
    }
}
$("#id_image").change(function() {
    if(document.getElementById('id_image').value){
    document.getElementsByClassName('new-button')[0].style.background = '#9c27b0'
    var filename = $('#id_image')[0].files[0]['name']
    }
});
let ClickOnHome = () => {
    $(".content-block").css('display','flex');
    $(".goals-content").css('display','none');
    $(".gallery-context").css('display','none');
    $(".post_details").css('display','none');
    color = $('.links').css("color");
    document.getElementById('home').style.borderColor = color
    color_border = $('#menu').css("background-color");
    $(".all-posts").css("height", "fit-content");
    document.getElementById('gallery').style.borderColor = color_border
    document.getElementById('goals').style.borderColor = color_border
    document.getElementsByClassName("block")[0].style.alignItems =  'start'
}

$(document).on('click', '#gallery', function(){
    $(".gallery-context").css('display','flex');
    $(".gallery-row").css("height", "fit-content");
    $(".goals-content").css('display','none');
    $(".content-block").css('display','none');
    $(".view_image").css('position','fixed');
    $(".background_shadow").css('position','fixed');
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/gallery/",
        success: function (response) {
            var row_index=0
            var img_index=0
            all_posts = response.posts
            color = $('.links').css("color");
            $("#gallery").css('border-color',color);
            color_border = $('#menu').css("background-color");
            $("#home").css('border-color',color_border);
            $("#goals").css('border-color',color_border);
            $("#menu").css('margin-bottom','10px');
            $(".gallery-context").css('visibility','visible');
            if ($(".post_details").length){
                $(".post_details").css('display','none');
            }
        }
        });
});
$(document).on('click', '#posts', function(){
    document.getElementsByClassName("gallery-context")[0].style.visibility =  'hidden'
    document.getElementsByClassName("goals-content")[0].style.visibility =  'hidden'
    document.getElementsByClassName("content-block")[0].style.visibility =  'visible'
    document.getElementsByClassName("note")[0].style.visibility =  'visible'
    document.getElementsByClassName("block")[0].style.alignItems =  'start'
     $(".all-posts").css("height", "fit-content");
});
$(document).on('click', '#goals', function(){
    $(".goals-content").css('display','flex');
    $(".all-posts").css("height", "0px");
    $(".gallery-row").css("height", "0px");
    ChangeHeightGoalsList();
    $(".gallery-context").css('display','none');
    $(".content-block").css('display','none');
    $(".goals-content").css('visibility','visible');
    $(".block").css('align-items','start');
    color = $('.links').css("color");
    $("#goals").css('border-color',color);
    color_border = $('#menu').css("background-color");
    $("#home").css('border-color',color_border);
    $("#gallery").css('border-color',color_border);
    $("#menu").css('margin','0px');
    $(".view_image").css('position','absolute');
    $(".background_shadow").css('position','absolute');
    $(".post_details").css('display','none');
});
$(document).on('click', '.image', function(){
    scroll_valid = false
    $(".background_shadow").css('visibility','visible');
    $(".view_image").css('visibility','visible');
    $("#circle-close-image").css('visibility','visible');
    if (document.getElementById('button2')){
        $("#button1").css('visibility','hidden');
        $("#button2").css('visibility','hidden');
    }
    id = $(this).attr('id')
    id = id.slice(6)
    image = $(this).css("background-image");
    $("#img").css('background-image',image);
    $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/image/"+id+"/ajax",
        success: function (response) {
               if( response.width!=0 && response.height!=0){
                    if(screen.width<580){
                            if(response.width<response.height){
                                $("#img").css("height", "80%");
                                $("#img").css("width", "80%");
                                $("#img").css("background-size", "100% 100%");
                                $("#img").css("margin-top", "30px");}
                            else{
                            if((response.width-150)>response.height){
                                $("#img").css("height", "50vw");
                                $("#img").css("width", "90vw");
                                $("#img").css("background-size", "90vw 50vw");}
                            else{
                                $("#img").css("height", "70vw");
                                $("#img").css("width", "90vw");
                                $("#img").css("background-size", "90vw 100%");
                            }
                            }}
                    else if(response.width<response.height){
                        if(screen.height*0.9<response.height) response.height = screen.height*0.8;
                        if((screen.width*0.4)<response.width) {response.width = screen.width*0.32;}
                        $("#img").css("height", response.height+"px");
                        $("#img").css("width", response.width+"px");
                        $("#img").css("background-size",response.width+"px "+response.height+"px");
                    }
                        else{
                            if(screen.width<response.width) response.width = screen.width*0.9
                            if(screen.height*0.9<response.height) response.height = screen.height*0.8
                            $("#img").css("height", response.height+"px");
                            $("#img").css("width", response.width+"px");
                            $("#img").css("background-size",response.width+"px "+response.height+"px");
                        }
               }
         }
    });
});
let scrollPos = 0
$(window).scroll(function(){
    if(scroll_valid){
     let x = $("html").scrollTop()
     if(x>scrollPos){
        document.getElementById('button2').style.visibility=  'visible'
        document.getElementById('button1').style.visibility =  'hidden'
     }
     else{
        document.getElementById('button1').style.visibility=  'visible'
        document.getElementById('button2').style.visibility =  'hidden'
     }
     scrollPos = x }
        });

$(document).ready(function(){
 var text;
 $.ajax({
        type: "GET",
        url: "http://127.0.0.1:8000/home/ajax",
        success: function (response) {
            document.getElementsByClassName("border-note")[0].style.visibility =  'visible'
            document.getElementsByClassName("note")[0].style.visibility =  'visible'
            $('.note').text(response.text);
            all_posts = response.posts
            if (all_posts.length > 0){
                for (var post in all_posts){
                    $('.all-posts').append('<a href="/post/'+all_posts[post].id+'/" class="m" id="'+all_posts[post].id+'" style="display:block; height: 100%; "></a>')
                    $('#'+ all_posts[post].id).append('<div class="post" id="post_'+all_posts[post].id+'"  style="display:block; height: 100%;"></div>')
                    data = all_posts[post].published_date.slice(0, 10)
                    time = all_posts[post].published_date.slice(11, 16)
                    $('#post_' + all_posts[post].id).append('<div class="data-info" id="data-info_'+all_posts[post].id+'"></div>')
                    $('#data-info_'+ all_posts[post].id).append('<div class="data" id="data_'+all_posts[post].id+'"></div>')
                    $('#data_'+ all_posts[post].id).text(data)
                    $('#data-info_'+ all_posts[post].id).append('<div style="font-size:25px;margin-right:10px;">|</div>')
                    $('#data-info_'+ all_posts[post].id).append('<div class="time" id="time_'+all_posts[post].id+'"></div>')
                    $('#time_'+ all_posts[post].id).text(time)
                    $('#post_' + all_posts[post].id).append('<div class="title" id="title_'+all_posts[post].id+'"></div>')
                    $('#title_' + all_posts[post].id).text(all_posts[post].title)
                    $('#post_' + all_posts[post].id).append('<div class="text" id="text_'+all_posts[post].id+'"></div>')
                    $('#text_' + all_posts[post].id).text(all_posts[post].text)
                } }
            else{
                $('.all-posts').append('<a href="../post/new/" class="m" style="display:block; height: 100%; "></a>')
                $('.m').append('<div class="post" id="none" style="display:block; height: 100px;"></div>')
                $('#none').append('<div class="text" id="text_none"></div>')
                $('#text_none').text("Add your first memory")
                $('#none').css("width", "40vw")
                $('#text_none').css("color", "#3f464c99")
                $('#text_none').css("text-align", "center")
                $('#none').css("border-color", "#5f5f5f")
                $('#none').css("border-style", "dashed")
            }
            setting = response.setting
            if (setting.length > 0){
                if (setting[0].hidden_note){
                    document.getElementsByClassName("note")[0].style.visibility =  'hidden'
                    document.getElementsByClassName("right-block")[0].style.visibility =  'hidden'
                    document.getElementsByClassName("border-note")[0].style.visibility =  'hidden'
                    Length = $('.post').length
                    for (let i=0; i<Length;i++){
                    document.getElementsByClassName("post")[i].style.width =  '60vw'}
                    }
                if (setting[0].wallpaper.length >0){
                    document.getElementById("profile-header").style.backgroundImage = "url('../../media/"+setting[0].wallpaper+"')";
                    }
                else{
                    document.getElementById("profile-header").style.backgroundImage = "url('../static/img/1.png')";
                    }
                }
            else{
                    if($("div").is("#profile-header")){
                        document.getElementById("profile-header").style.backgroundImage = "url('../static/img/1.png')";}
                   }
            var row_index=0
            var img_index=0
            for (var post in all_posts){
                if(img_index==0)
                    {
                    $('.gallery-border').append('<div class="gallery-row" id="gallery-row-'+row_index+'"></div>')}
                if(all_posts[post].image!=""){
                     $('#gallery-row-'+row_index).append('<div class="image" id="image-'+all_posts[post].id+'" style="background-image:url(../../media/'+all_posts[post].image+');"></div>')
                     img_index++;
                 }
                if(img_index==3){
                    img_index=0;
                    row_index++;
                }
            }
            all_goals = response.goals
            for (var goal in all_goals){
                $('#myUL').append('<div id="div_goal_'+all_goals[goal].id+'" class="div_goal"></div>')
                $('#div_goal_'+all_goals[goal].id).append('<li id="goal_'+all_goals[goal].id+'"></li>')
                $('#goal_'+all_goals[goal].id).text(all_goals[goal].text)
                $('#div_goal_'+all_goals[goal].id).append('<span class="close" id="close_'+all_goals[goal].id+'">✕</li>')
                if (all_goals[goal].done == false){
                    $('#goal_'+all_goals[goal].id).addClass('checked')
                }
            }

            }
    });

})

