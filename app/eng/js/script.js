document.body.onload = function(){
    setTimeout(function(){
        var preloader = document.getElementById('page-preloader');
        if(!preloader.classList.contains('done')){
            preloader.classList.add('done');
            $('html').css("overflow","visible");
        }
    }, 1000);
};

$(document).ready(function () {
    
    var mySwiper = new Swiper('#s1, #s2, #s3', {
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        }
    });
    
    $('a[data-toggle="pill"]').on('shown.bs.tab', function(e) {
        var paneTarget = $(e.target).attr('href');
        var $thePane = $('.tab-pane' + paneTarget);
        var paneIndex = $thePane.index();
        if ($thePane.find('.swiper-container').length > 0 && 0 === $thePane.find('.swiper-slide-active').length) {
            mySwiper[paneIndex].update();
        }
    });
    
    function goTop(){
        if ($(window).width() > 991) {
            var $addedDiv = $("#go-top");
            if ($addedDiv.length == 0){
                $('body').append('<a id="go-top" title="Вверх"><i class="fas fa-chevron-circle-up"></i></a>');
                $(function() {
                    $.fn.scrollToTop = function() {
                        if ($(window).scrollTop() >= "660") $(this).fadeIn("slow")
                        var scrollDiv = $(this);
                        $(window).scroll(function() {
                            if ($(window).scrollTop() <= "660") $(scrollDiv).fadeOut("slow")
                            else $(scrollDiv).fadeIn("slow")
                        });
                        $(this).click(function() {
                            $("html, body").animate({scrollTop: 0}, "slow")
                        })
                    }
                });
                $(function() {
                    $("#go-top").scrollToTop();
                });
            };
        } else {
            $('#go-top').remove();
        };
    };
    goTop();
    $(window).resize(goTop);

    
    
});