var divstr = '<div class="note"><a href="javascript:void(0);" class="close">X</a><textarea></textarea></div>';
var db = new LocalDB('db1', 'notes');
var notes = document.getElementsByClassName('notes')[0];
var addBtn = document.getElementsByClassName('add')[0];

db.open(function() {
    console.log("页面初始化，获取所有便签");
    //页面初始化，获取所有便签
    db.getAll(function(data){
        //创建标签
        var tempDiv = document.createElement('div');
            tempDiv.innerHTML = divstr;
        var newNote = tempDiv.childNodes[0];
        //填入数据
            newNote.setAttribute('data-id',data.id);
            newNote.getElementsByTagName('textarea')[0].value = data.content;
        //将便签插入添加按钮前边
        notes.insertBefore(newNote,addBtn);
    });
});
//为按钮注册单击事件
addBtn.addEventListener('click', function(){
    console.log("addbtn click");
    //创建标签
    var tempDiv = document.createElement('div');
        tempDiv.innerHTML = divstr;
    var newNote = tempDiv.childNodes[0];
    notes.insertBefore(newNote,addBtn);
    //添加一条空数据到数据库
    db.set({
        content: ''
    },function(id){
        //将数据库生成的自增id赋值到标签上
        newNote.setAttribute('data-id',id);
    });
})
//监听所有便签编辑域的焦点事件
notes.addEventListener('blur', function textBlur(event){
    console.log("[blur] tag:",event.target.tagName,"class:",event.target.className);
    if(event.target.tagName.toLowerCase() == "textarea"){
        var div = event.target.parentNode;
        var data = {
            id: +div.getAttribute('data-id'),
            content: event.target.value
        };
        db.set(data);
    }
},true);
//事件委托监听单击事件
notes.addEventListener('click', function closeClick(event){
    console.log("[click] tag:",event.target.tagName,"class:",event.target.className);
    if(event.target.className == "close"){
        //所有关闭按钮
        var div = event.target.parentNode;
        //删除这条便签数据
        db.remove(+div.getAttribute('data-id'));
        this.removeChild(div);
    }
},false);