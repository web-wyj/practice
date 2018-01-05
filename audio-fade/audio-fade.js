var audio = document.getElementById("audio");
var audioBtn = document.getElementById("audio-btn");

var FadeTime = 5;                           //音量渐弱次数
var FadeVolume = audio.volume / FadeTime;   //每次渐弱音量
var FadeMsTime = 1500;                      //总渐弱时间(ms)
var UserVolume = 0.5;                       //用户设定音量，实际应用中会隐藏原始audio控件，而提供新的统一样式的控件给用户控制音量，这里音量静态为0.5

var timerVolumeFadeOut = null;
var timerVolumeFadeIn = null;

function audioVolumeFadeOut() {
    //改变按钮标签
    audioBtn.innerHTML = "播放";
    //防止定时器重复，支持播放/暂停连点
    clearInterval(timerVolumeFadeOut);
    clearInterval(timerVolumeFadeIn);
    //音量开始渐弱
    timerVolumeFadeOut = setInterval(function () {
        //支持播放/暂停连点
        if((audio.volume - FadeVolume) < 0){
            audio.pause();
            clearInterval(timerVolumeFadeOut);
            //拒绝代码继续执行，以免造成 audio.volume 负数 error
            //clearInterval 不会直接中断当前 timer function, 而是待本次 timer function 结束后, 取消后续的 timer function
            return;
        }
        audio.volume -= FadeVolume;
    },FadeMsTime/FadeTime);
}
function audioVolumeFadeIn() {
    audioBtn.innerHTML = "暂停";
    clearInterval(timerVolumeFadeOut);
    clearInterval(timerVolumeFadeIn);
    audio.play();
    timerVolumeFadeIn = setInterval(function () {
        if((audio.volume + FadeVolume) > UserVolume){
            audio.volume = UserVolume;
            clearInterval(timerVolumeFadeIn);
            return;
        }
        audio.volume += FadeVolume;
    },FadeMsTime/FadeTime);
}

(function audioInit() {
    audio.volume = UserVolume;
    audio.pause();
    audioBtn.innerHTML = "播放";
    audioBtn.addEventListener("click",function() {
        audioBtnTitle = audioBtn.innerHTML;
        if(audioBtnTitle == "播放"){
            audioVolumeFadeIn();
        }else{
            audioVolumeFadeOut();
        }
    });
})();