var defaultWidth = 480;
var defaultHeight = 320;
var userWidth = 480;
var userHeight = 320;
var video = document.getElementById("video");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var photoBtn = document.getElementById("photo-btn");

//IE, Safari, iOS Safari均不支持getUserMedia API
//检查浏览器是否支持getUserMedia API
if(navigator.mediaDevices.getUserMedia || navigator.getUserMedia ||
navigator.webkitGetUserMedia || navigator.mozGetUserMedia){
    //调用用户媒体设备
    function success(stream) {
        //兼容webkit核心浏览器
        var CompatibleURL = window.URL || window.webkitURL;
        //将视频流设置为video元素的源
        video.src = CompatibleURL.createObjectURL(stream);
        video.play();
        var timer = setInterval(function(){
            //等待摄像图像载入
            if(video.videoWidth != 0 && video.videoHeight !=0){
                //自适应宽高，更新radio标签
                var canvasSizeSets = document.getElementsByName("canvas-size-set");
                canvasSizeSets[1].nextSibling.nodeValue = "宽度" + defaultWidth + "px自适应\n";
                canvasSizeSets[2].nextSibling.nodeValue = "高度" + defaultHeight + "px自适应\n";
                mediaResize();
                //绑定radio单击事件
                canvasSizeSets.forEach(element => {
                    element.addEventListener("click",function() {
                        mediaResize();
                    })
                });
                //允许拍照
                photoBtn.addEventListener("click",function name(params) {
                    context.drawImage(video,0,0,userWidth,userHeight);
                });
                photoBtn.disabled = false;
                clearInterval(timer);
            }
        },1000);
    }
    function error(error) {
        alert("访问用户媒体设备失败");
        console.log("访问用户媒体设备失败：", error.name, error.message);
    }
    var constraints = {
        // video:{
        //     width: defaultWidth,
        //     height: defaultHeight
        // }
        video: true,
        audio: true
    };
    getUserMedia(constraints, success, error);
}else{
    alert("您的浏览器不支持访问用户媒体设备");
}

//兼容访问用户媒体设备
function getUserMedia(constraints, success, error) {
    if(navigator.mediaDevices.getUserMedia){
        //最新标准
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    }else if(navigator.webkitGetUserMedia){
        navigator.webkitGetUserMedia(constraints,success,error);
    }else if(navigator.mozGetUserMedia){
        //Firefox
        navigator.mozGetUserMedia(constraints,success,error);
    }else if(navigator.getUserMedia){
        //未来废除的初始API
        navigator.getUserMedia(constraints,success,error);
    }
}

//video与canvas宽高调整
function mediaResize() {
    var canvasSizeSets = document.getElementsByName("canvas-size-set");
    canvasSizeSets.forEach(element => {
        if(element.checked){
            switch(+element.value){
                //原始宽高
                case 1:
                    userWidth = video.videoWidth;
                    userHeight = video.videoHeight;
                    break;
                //定宽
                case 2:
                    userWidth = defaultWidth;
                    userHeight = video.videoHeight/video.videoWidth*userWidth;
                    break;
                //定高
                case 3:
                    userWidth = video.videoWidth/video.videoHeight*defaultHeight;
                    userHeight = defaultHeight;
                    break;
            }
            video.style.width = userWidth + "px";
            video.style.height = userHeight + "px";
            canvas.width = userWidth;
            console.log("userWidth",userWidth);
            console.log("userHeight",userHeight);
            canvas.height = userHeight;
        }
    });
}