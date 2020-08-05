(function (window) {
    function Player($audio) {
        return Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        musiclist: [],
        currentIndex:-1,
        init : function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        playMusic:function (index,music) {
            //判断是否是同一首音乐
            if(this.currentIndex == index){
                //判断是否是暂停
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else {
                //不是同一首
                this.currentIndex = index;
                this.$audio.attr("src",music.link_url);
                this.audio.play();
            }
        },
        preIndex:function () {
            var  index = this.currentIndex - 1;
            if (index<0){
                index = this.musiclist.length - 1;
            }
            return index;
        },
        nexIndex:function () {
            var  index = this.currentIndex + 1;
            if (index > this.musiclist.length-1){
                index = 0;
            }
            return index;
        },
        musicTimeUpdate:function (callback) {
            var $this = this;
            //歌词与进度条的同步
            this.$audio.on("timeupdate",function () {
                var current = $this.audio.currentTime;
                var duration = $this.audio.duration;
                var str = $this.formatDate(current,duration);
                callback(current,duration,str);
            });
        },
        formatDate:function (current,duration) {
            //歌词时间的格式化方法
            var startMin = parseInt(current / 60);
            var startSec = parseInt(current % 60);
            if (startMin <10){
                startMin = "0"+startMin;
            }
            if (startSec <10){
                startSec = "0"+startSec ;
            }
            var endMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if (endMin <10){
                endMin = "0"+endMin;
            }
            if (endSec <10){
                endSec = "0"+endSec ;
            }
            return startMin+":"+startSec+" / "+endMin+":"+endSec;
        },
        musicSeekTo:function (value) {
            this.audio.currentTime = this.audio.duration * value;
        },
        musicVoiceSeekTo:function (value) {
            //取值范围是0~1
            this.audio.volume = value;
        },

    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);