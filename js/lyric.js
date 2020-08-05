(function (window) {
    function Lyric(path) {
        return Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor: Lyric,
        times:[],
        lyrics:[],
        index:-1,
        init : function (path) {
            this.path = path;
        },
        loadLyric:function (callback) {
            var  $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success : function (data) {
                    $this.parseLyric(data);
                    callback();
                },
                error : function (e) {
                    console.log(e);
                }
            });
        },
        parseLyric:function (data) {
            var $this = this;
            //清空上一首歌的信息
            $this.times =  [];
            $this.lyrics = [];
            var array = data.split("\n");
            //[00:01.81] 正则表达式
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            $.each(array,function (index,ele) {
                //处理歌词
                var lyric = ele.split("]")[1];
                //排除没有 歌词的
                var res = timeReg.exec(ele);
                if (res == null) return true;
                var timeStr = res[1];
                var res2 = timeStr.split(":");
                var minute = parseInt(res2[0])*60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(minute+sec).toFixed(2));
                $this.times.push(time);
                $this.lyrics.push(lyric);
            });
        },
        currentIndex:function (current) {
            if (current >= this.times[0]){
                this.index++;
                this.times.shift();//删除数组最前面的一个元素
            }
            return this.index;
        },
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);