(function (window) {
    function Progress($progress_bar,$progress_line,$progress_dot) {
        return Progress.prototype.init($progress_bar,$progress_line,$progress_dot);
    }
    Progress.prototype = {
        constructor: Progress,
        init : function ($progress_bar,$progress_line,$progress_dot ) {
            this.$progress_bar = $progress_bar;
            this.$progress_line = $progress_line;
            this.$progress_dot = $progress_dot;
        },
        progressClick:function (callback) {
            var $this = this;
            //监听背景的点击
            this.$progress_bar.click(function (event) {
                //获取窗口距离窗口默认的距离
                var normalLeft = $(this).offset().left;
                //获取点击的位置距离窗口的距离
                var evenLeft = event.pageX;
                //设置前景的位置
                $this.$progress_line.css("width",evenLeft - normalLeft);
                $this.$progress_dot.css("left",evenLeft - normalLeft);
                var value = (evenLeft - normalLeft) / $(this).width();
                callback(value);
            });
        },
        progressMove:function (callback) {
            var $this = this;
            //监听鼠标的按下事件
            this.$progress_dot.mousedown(function () {
                //监听鼠标的移动事件
                var normalLeft = $(this).offset().left;
                $(document).mousemove(function () {
                    //获取点击的位置距离窗口的距离
                    var evenLeft = event.pageX;
                    //设置前景的位置
                    $this.$progress_line.css("width",evenLeft - normalLeft);
                    $this.$progress_dot.css("left",evenLeft - normalLeft);
                    var value = (evenLeft - normalLeft) / $(this).width();
                    callback(value);
                });
            });
            //监听鼠标的弹起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
            });
        },
        setProgress:function (value) {
            if (value<0 || value>100){
                return;
            }
            this.$progress_line.css({
               width:value+"%"
            });
            this.$progress_dot.css({
               left:value+"%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);