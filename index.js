window.onload = function() {
    // 获取总时长
    $.on($("#audioEle"),"loadedmetadata", function() {
        var timeStr = "";
        var min = Math.floor(+this.duration / 60);
        var sec = Math.round(+this.duration % 60);
        timeStr = "0"+min+":"+sec;
        $(".totalTime")[0].innerText = timeStr;
    });
    // 点击暂停继续
    $(".play-btn")[0].onclick = function(e) {
        if (hasClass(e.target, "glyphicon-play")) {
            removeClass(e.target, "show");
            addClass(e.target, "hidden");
            removeClass($(".glyphicon-pause")[0], "hidden");
            addClass($(".glyphicon-pause")[0], "show");

            $("#audioEle").play();
            $(".album-pic")[0].style.animationPlayState = "running";
        } else {
            removeClass(e.target, "show");
            addClass(e.target, "hidden");
            removeClass($(".glyphicon-play")[0], "hidden");
            addClass($(".glyphicon-play")[0], "show");

            $("#audioEle").pause();
            $(".album-pic")[0].style.animationPlayState = "paused";
        }
    };
};
