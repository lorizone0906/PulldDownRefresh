/**
* [上拉跳转]
* {{pullUpRefresh}}
* @param  {[Zepto对象]} $el      [loading提示元素，注意配合样式]
* @param  {[对象]} options       [见注释]
*/


var pullUpRefresh = function($el,options){
    var defaults = {
            trigger: $(options.keyNode), // 绑定监听滚动元素
            maxTrans: 100,       // 最大移动距离
            onReload: function(){} // 下拉刷新回调函数
        },
        params = $.extend({}, defaults, options || {}),
        data= {};

    // 暴露属性
    var self = this;
    self.params = params;
    self.$el = $el;
    $el.css('border-bottom', '0 solid transparent');
    document.querySelector(self.params.keyNode).addEventListener('touchstart', function(e){
        var ev = e.touches[0] || e;
            data.startY = ev.pageY;
            data.endY = ev.pageY;
            data.transY = 0;
            data.winHeight = $(window).height();
            data.docHeight = $(document).height();
            self.hasReload = false;
    })
    document.querySelector(self.params.keyNode).addEventListener('touchmove', function(e){
        var ev = e.touches[0] || e;
            data.endY = ev.pageY;
            data.transY = data.endY - data.startY,
            // 滚动元素父级
            $target = $(self.params.keyNodeParent),
            $ul = $(self.params.keyNode);
            var threshold =  $ul.height() - $target.height() - $target.scrollTop(),
                transY = Math.abs(data.transY);
            if(data.transY < 0 && (threshold <= 0)) {
                e.preventDefault();
                if(!self.hasReload && (transY > params.maxTrans)) {
                    self.hasReload = true;
                    $el.text('正在跳转至页面');
                    $el.css({
                       // borderBottomWidth: params.maxTrans
                       transition: 'all 0.5s ease-in-out',
                        transform: 'translate(0, -100px)',
                        '-webkit-transform': 'translate(0, -100px)'
                    });
                    $(self.params.keyNode).css({
                        transition: 'all 0.5s ease-in-out',
                        transform: 'translate(0, -100px)',
                        '-webkit-transform': 'translate(0, -100px)'
                    })

                    setTimeout(function(){
                       self.params.onReload.call(self);
                    },300);
                }
            }
    })
    document.querySelector(self.params.keyNode).addEventListener('touchend', function(e){
        self.origin();
    })
}

pullUpRefresh.prototype.origin = function() {
    var self = this;
    self.$el.css({
       // borderBottomWidth: params.maxTrans
        transform: 'translate(0, 0px)',
        '-webkit-transform': 'translate(0, 0px)'
    });
    $(self.params.keyNode).css({
        transform: 'translate(0, 0px)',
        '-webkit-transform': 'translate(0, 0px)'
    })
    self.$el.text('上拉跳转至页面')
};
