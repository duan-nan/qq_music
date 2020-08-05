$(function () {
    //字定义滚动条
    $(".content_list").mCustomScrollbar();
    var $audio = $("audio");
    var player = new Player($audio);
    var lyric;


    var $progress_bar = $(".music_progress_bar");
    var $progress_line = $(".music_progress_line");
    var $progress_dot = $(".music_progress_dot");

    var progress = new Progress($progress_bar,$progress_line,$progress_dot);
    progress.progressClick(function (value) {
        player.musicSeekTo(value);
    });
    progress.progressMove(function (value) {
        player.musicSeekTo(value);
    });


    //加载音乐列表
    get_music_list();
    function get_music_list() {
        $.ajax({
            url: "./music/music_list.json",
            dataType: "json",
            success : function (data) {

                player.musiclist = data;
                var $music_list = $(".content_list ul");

                $.each(data,function (index,element) {
                    var $item = createMusicItem(index,element);
                    $music_list.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyric(data[0]);
            },
            error : function (e) {
                console.log(e)
                console.log("错误")
            }
        });
    };


    //初始化事件监听
    initEvents();
    function initEvents() {
        //动态添加时通过事件委托
        //移入移出时菜单栏的显示
        $(".content_list").delegate(".list_music","mouseenter",function () {
            $(this).find(".list_menu").stop().fadeIn(100);
            $(this).find(".list_time a").stop().fadeIn(100);
            $(this).find(".list_time span").stop().fadeOut(100);
        });
        $(".content_list").delegate(".list_music","mouseleave",function () {
            $(this).find(".list_menu").stop().fadeOut(100);
            $(this).find(".list_time a").stop().fadeOut(100);
            $(this).find(".list_time span").stop().fadeIn(100);
        });


        //复选框的显示
        $(".content_list").delegate(".list_check","click",function () {
            $(this).toggleClass("list_checked");
        });

        //添加按钮的切换事件
        var $music_play = $(".music_stop");

        $(".content_list").delegate(".list_menu_play","click",function () {
            var $item =  $(this).parents(".list_music");
            //切换播放图标
            $(this).toggleClass("list_menu_play2");
            //复原其他播放图标
            $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");
            //同步底部播方按钮
            if($(this).attr("class").indexOf("list_menu_play2") != -1){
                //播放状态
                $music_play.addClass("music_play");
                //让文字高亮
                $item.find("div").css("color","#fff");
            }else{
                //暂停状态
                $music_play.removeClass("music_play");
                //关闭高亮
                /*$(this).parents(".list_music").find("div").css("color","rgba(255,255,255,0.5)");*/
            }

            //切换状态
            $item.find(".list_number").toggleClass("list_number2");
            $item.siblings().find(".list_number").removeClass("list_number2");

            //播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music);

            //切换歌曲信息
            initMusicInfo($item.get(0).music);
            //切换歌词的信息
            initMusicLyric($item.get(0).music);

            //监听音乐的时间
            player.musicTimeUpdate(function (current,duration,str) {
                //同步时间
                $(".music_progress_time").text(str);
                //同步进度条
                var value = current / duration * 100;
                progress.setProgress(value);

                //实现歌词的同步
                var index = lyric.currentIndex(current);
                var $item = $(".song_lyrics li").eq(index);
                $item.addClass("cur");
                $item.siblings().removeClass("cur");

                if (index<=3) return;
                $(".song_lyrics").css({
                    marginTop:((-index +3)*30)
                });
            });
        });
        //监听底部的播放按钮
        $music_play.click(function () {
            //判断有没有用播放过音乐
            if(player.currentIndex == -1){
                //没有播放过音乐
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            }else {
                //播放过音乐
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }

        });
        //监听底部的上一首按钮
        $(".music_pre").click(function () {
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
        });
        //监听底部的下一首按钮
        $(".music_nex").click(function () {
            $(".list_music").eq(player.nexIndex()).find(".list_menu_play").trigger("click");
        });

        //蒋婷声音按钮的操作
        $(".music_voice_icon").click(function () {
            //图标切换
            $(this).toggleClass("music_voice_icon2");
            //声音切换
            if($(this).attr("class").indexOf("music_voice_icon2") != -1){
                //静音
                player.musicVoiceSeekTo(0);
            }else {
                //不是静音
                player.musicVoiceSeekTo(1);
            }

        });



    };

    //初始化歌词
    function initMusicLyric(music) {
        lyric = new Lyric(music.link_lrc);
        var $lyricContainer =$(".song_lyrics");
        //         //清空上一首音乐的歌词
        $lyricContainer.html("");
        lyric.loadLyric(function () {
            //创建歌词列表
            $.each(lyric.lyrics,function (index,ele) {
                var $item = $("<li>"+ele+"</li>");
                $lyricContainer.append($item);
            });

        });
    }

    //歌单信息的初始化操作
    function initMusicInfo(music){
        //获取对应的元素
        var $musicImg = $(".song_inf_pic img");
        var $musicName = $(".song_inf_name a");
        var $musicSinger = $(".song_inf_singer a");
        var $musicAblum = $(".song_inf_ablum a");
        var $musicProgressName = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".mask_bg");
        //赋值
        $musicImg.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.album);
        $musicProgressName.text(music.name+"/"+music.singer);
        $musicProgressTime.text("00:00 /" + music.time);
        $musicBg.css("background","url('"+music.cover+"')")

    };

    //定义一个方法来创建一条音乐
    function createMusicItem(index,music) {
        var $item = $("<li class=\"list_music\">\n" +
            "<div class=\"list_check\">\n" +
            "<i></i>\n" +
            "</div>\n" +
            "<div class=\"list_number\">\n" +
            ""+(index+1)+"\n" +
            "</div>\n" +
            "<div class=\"list_name\">\n" +
            ""+music.name+"\n" +
            "<div class=\"list_menu\">\n" +
            "<a href=\"JavaScript:;\" title=\"播放\" class=\"list_menu_play\"></a>\n" +
            "<a href=\"JavaScript:;\" title=\"添加到歌单\"></a>\n" +
            "<a href=\"JavaScript:;\" title=\"下载\"></a>\n" +
            "<a href=\"JavaScript:;\" title=\"分享\"></a>\n" +
            "</div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">\n" +
            "<a href=\"#\">"+music.singer+"</a>\n" +
            "</div>\n" +
            "<div class=\"list_time\">\n" +
            "<span>"+music.time+"</span>\n" +
            "<a href=\"JavaScript:;\" title=\"删除\"></a>\n" +
            "                                </div>\n" +
            " ");
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }

});