window.onload = function() {
    var audioObj = {
        playStyle: "random"
    };
    var dragging;
    // 获取时长信息
    $.on($("#audioEle"), "durationchange", function() {
        var min = Math.floor(+this.duration / 60);
        var sec = Math.floor(+this.duration % 60) >= 10 ? Math.floor(+this.duration % 60) : "0" + Math.floor(+this.duration % 60);
        var timeStr = "0" + min + ":" + sec;
        $(".totalTime")[0].innerText = timeStr;
    });
    $.on($("#audioEle"), "timeupdate", function() {
        var min = Math.floor(+this.currentTime / 60);
        var sec = Math.floor(+this.currentTime % 60) >= 10 ? Math.floor(+this.currentTime % 60) : "0" + Math.floor(+this.currentTime % 60);
        var timeStr = "0" + min + ":" + sec;
        $(".finTime")[0].innerText = timeStr;
    });
    // 快进
    function down(e) {
        dragging = true;
        $(".play-btn")[0].click();
    }

    function move(e) {
        if (dragging) {
            $("#audioEle").currentTime = (e.pageX - 665) / 250 * Math.ceil($("#audioEle").duration);
            $(".process-point")[0].style.marginLeft = e.pageX >= 665 ? e.pageX - 665 : 0 + "px";
        }
    }

    function up(e) {
        if (dragging === true) {
            $(".play-btn")[0].click();
        }
        $("#audioEle").play();
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
        // if ($("#audioEle").buffered.end(0) !== $("#audioEle").duration) {
            $(".process-buffer")[0].style.width = $("#audioEle").buffered.end(0) /
                $("#audioEle").duration * 250 - timeRatio * 250 + "px";
        // } else {$(".process-buffer")[0].style.width = 250 + "px";}
    }, 1000);
    // 点击暂停继续
    $(".album-pic")[0].onclick = isPlay;
    $(".play-btn")[0].onclick = isPlay;

    function isPlay(e) {
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
    }
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
    audioObj.playList = [{
        srcUrl: "许嵩 - 蝴蝶的时间.mp3",
        albumPic: "butterfly.jpg"
    }, {
        srcUrl: "许嵩 - 违章动物.mp3",
        albumPic: "over.jpg"
    }, {
        srcUrl: "许嵩 - 千古.mp3",
        albumPic: "eveningpaper.jpg"
    }, {
        srcUrl: "许嵩 - 全球变冷.mp3",
        albumPic: "over.jpg"
    }, {
        srcUrl: "许嵩 - 摄影艺术.mp3",
        albumPic: "eveningpaper.jpg"
    }];
    //选择播放模式
    $.on($(".playStyle")[0], "click", function(e) {
        if (hasClass(e.target, "glyphicon-random")) {
            removeClass(e.target, "show");
            addClass(e.target, "hidden");
            removeClass($(".glyphicon-repeat")[0], "hidden");
            addClass($(".glyphicon-repeat")[0], "show");
            audioObj.playStyle = "repeat";
        }
        if (hasClass(e.target, "glyphicon-repeat")) {
            removeClass(e.target, "show");
            addClass(e.target, "hidden");
            removeClass($(".glyphicon-refresh")[0], "hidden");
            addClass($(".glyphicon-refresh")[0], "show");
            audioObj.playStyle = "refresh";
        }
        if (hasClass(e.target, "glyphicon-refresh")) {
            removeClass(e.target, "show");
            addClass(e.target, "hidden");
            removeClass($(".glyphicon-random")[0], "hidden");
            addClass($(".glyphicon-random")[0], "show");
            audioObj.playStyle = "random";
        }
        changeSongInd();
    });
    $.on($("#audioEle"), "ended", function() { changeSong("next"); });
    $.on($(".glyphicon-step-backward")[0], "click", function() { changeSong("pre"); });
    $.on($(".glyphicon-step-forward")[0], "click", function() { changeSong("next"); });

    function changeSongInd() {
        var thisInd = audioObj.playList.findIndex((item) => {
            return decodeURI($("#audioEle").src).indexOf(item.srcUrl) > -1;
        });
        switch (audioObj.playStyle) {
            case "random":
                {
                    audioObj.nextInd = Math.floor(Math.random() * 5);
                    audioObj.preInd = Math.floor(Math.random() * 5);
                    break;
                }
            case "repeat":
                {
                    audioObj.nextInd = thisInd;
                    audioObj.preInd = thisInd;
                    break;
                }
            case "refresh":
                {
                    audioObj.nextInd = thisInd === audioObj.playList.length - 1 ? 0 : thisInd + 1;
                    audioObj.preInd = thisInd === 0 ? audioObj.playList.length - 1 : thisInd - 1;
                    break;
                }
                defalut: { break; }
        }
    }

    function changeSong(direction) {
        var ind = 0;
        if(direction === "next") {
            ind = audioObj.nextInd;
        } else if (direction === "pre") {
            ind = audioObj.preInd;
        }
        $("#audioEle").src = "music/" + audioObj.playList[ind].srcUrl;
        $(".album-pic")[0].src = "pic/" + audioObj.playList[ind].albumPic;
        $(".songName")[0].innerText = audioObj.playList[ind].srcUrl.split(".")[0].split(" ")[2];
        $(".singerName")[0].innerText = audioObj.playList[ind].srcUrl.split(".")[0].split(" ")[0];
        changeSongInd();
    }
    (function init() {
        changeSongInd();
        changeSong(0);
        console.log(0);
    })();
};
