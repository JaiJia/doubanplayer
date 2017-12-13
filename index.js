window.onload = function() {
    var audioObj = {};
    var dragging;
    // 获取时长信息
    $.on($("#audioEle"), "durationchange", function() {
        var min = Math.floor(+this.duration / 60);
        var sec = Math.round(+this.duration % 60);
        var timeStr = "0" + min + ":" + sec;
        $(".totalTime")[0].innerText = timeStr;
    });
    $.on($("#audioEle"), "timeupdate", function() {
        var min = Math.floor(+this.currentTime / 60);
        var sec = Math.round(+this.currentTime % 60) >= 10 ? Math.round(+this.currentTime % 60) : "0" +
            Math.round(+this.currentTime % 60);
        var timeStr = "0" + min + ":" + sec;
        $(".finTime")[0].innerText = timeStr;
    });
    // 快进
    function down(e) {
        dragging = true;
        $(".play-btn")[0].click();
    }

    function move(e) {
        if (dragging && e.target) {
            $("#audioEle").currentTime = (e.pageX - 665) / 250 * Math.ceil($("#audioEle").duration);
            $(".process-point")[0].style.marginLeft = e.pageX >= 665 ? e.pageX - 665 : 0 + "px";
            console.log($("#audioEle").currentTime);
        }
    }

    function up(e) {
        if (dragging === true) {
            $(".play-btn")[0].click();
        }
        dragging = false;
    }
    $.on($(".progress")[0], "mousedown", down);
    $.on($(".wrap")[0], "mousemove", move);
    $.on($(".wrap")[0], "mouseup", up);

    // 已播放时长
    setInterval(() => {
        var timeRatio = $("#audioEle").currentTime / $("#audioEle").duration;
        $(".process-point")[0].style.marginLeft = timeRatio * 250 + "px";
        $(".process-finish")[0].style.width = timeRatio * 250 + "px";
        $(".process-buffer")[0].style.width = $("#audioEle").buffered.end(0) /
            $("#audioEle").duration * 250 - timeRatio * 250 + "px";
    }, 1000);
    // 点击暂停继续
    $(".play-btn")[0].onclick = function isPlay(e) {
        if (hasClass($(".glyphicon-play")[0], "show")) {
            removeClass($(".glyphicon-play")[0], "show");
            addClass($(".glyphicon-play")[0], "hidden");
            removeClass($(".glyphicon-pause")[0], "hidden");
            addClass($(".glyphicon-pause")[0], "show");

            $("#audioEle").play();
            $(".album-pic")[0].style.animationPlayState = "running";
        } else {
            removeClass($(".glyphicon-pause")[0], "show");
            addClass($(".glyphicon-pause")[0], "hidden");
            removeClass($(".glyphicon-play")[0], "hidden");
            addClass($(".glyphicon-play")[0], "show");

            $("#audioEle").pause();
            $(".album-pic")[0].style.animationPlayState = "paused";
        }
    };
    // 改变音量
    $(".volume")[0].onchange = function() {
        $("#audioEle").volume = this.value / 100;
    };
    $.on($("#audioEle"), "volumechange", function() {
        $(".volume")[0].value = this.volume * 100;
    });
    $(".volume-btn")[0].addEventListener("click", function(e) {
        if (hasClass(e.target, "glyphicon-volume-up")) {
            removeClass(e.target, "show");
            addClass(e.target, "hidden");
            removeClass($(".glyphicon-volume-down")[0], "hidden");
            addClass($(".glyphicon-volume-down")[0], "show");
            $("#audioEle").volume = 0.3;
        }
        if (hasClass(e.target, "glyphicon-volume-down")) {
            removeClass(e.target, "show");
            addClass(e.target, "hidden");
            removeClass($(".glyphicon-volume-off")[0], "hidden");
            addClass($(".glyphicon-volume-off")[0], "show");
            $("#audioEle").volume = 0;
        }
        if (hasClass(e.target, "glyphicon-volume-off")) {
            removeClass(e.target, "show");
            addClass(e.target, "hidden");
            removeClass($(".glyphicon-volume-up")[0], "hidden");
            addClass($(".glyphicon-volume-up")[0], "show");
            $("#audioEle").volume = 1;
        }
    });
    // 播放列表
    var playList = [{
        srcUrl: "许嵩 - 蝴蝶的时间.mp3",
        albumPic: ""
    }, {
        srcUrl: "许嵩 - 千古.mp3",
        albumPic: ""
    }, {
        srcUrl: "许嵩 - 摄影艺术.mp3",
        albumPic: ""
    }, {
        srcUrl: "许嵩 - 全球变冷.mp3",
        albumPic: ""
    }, {
        srcUrl: "许嵩 - 违章动物.mp3",
        albumPic: ""
    }];
    $.on($("#audioEle"), "ended", function() {
        var ind = Math.floor(Math.random()* 5);
        this.src = "music/" + playList[ind].srcUrl;
        $(".album-pic")[0].src = "pic/" + playList[ind].albumPic;
        $(".songName")[0].innerText = playList[ind].srcUrl.split(".")[0].split(" ")[2];
        $(".singerName")[0].innerText = playList[ind].srcUrl.split(".")[0].split(" ")[0];
    });
};
