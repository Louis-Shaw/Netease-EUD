
// EDU
// 



// alert提醒 start
var alert_module = (function(){
	var cookie = document.cookie;
// 验证 取消cookie是否已经存在
	var alert = document.getElementById('alert');
	if(cookie.indexOf("close") !== -1){
		alert.style.display = "none";
	}

	var close = document.getElementById('close');
//添加点击隐藏事件
	addEvent(close,'click',function(){
		alert.style.display = "none";
		document.cookie = "close=clicked";

	})
})();
// alert提醒 end
// follow 登陆start

var follow_module = (function(){
//获取 所需要的节点 和cookie
	var cookie = getCookie();
	var unfollow= document.querySelector(".m-hdnav .unfollow");
	var followed= document.querySelector(".m-hdnav .followed");
	var followpic = document.querySelector(".m-hdnav .flpic");
	var login = document.querySelector("#login");
	var close = document.querySelector(".m-login .close");
	var form = login.getElementsByTagName("form")[0];
//如果 登陆cookie 存在 那么显示 关注 按钮 
	if(!!cookie.loginSuc){
		unfollow.style.display="none";
		followed.style.display="block";
	}
// 添加follow 的点击事件 
	addEvent(followpic,"click",function(){
		if(!cookie.loginSuc){
			login.style.display="block";
		}else{
			follow();
		}
	})
	addEvent(close,"click",function(){
		form.reset();
		login.style.display="none";
	})
	addEvent(login,"keydown",function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var lab = target.parentNode.querySelector("label");
		lab.style.display = "none";
	
	})
// 登陆框输入后 blur 的操作 
	function blurHandler(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var input = target.parentNode.querySelector("input");
		var lab = target.parentNode.querySelector("label");
		if(input.value == ""){
			lab.style.display = "block";

		}

	}
	function disableSubmit(disabled){
		form.loginbtn.disabled=!!disabled;
		var methed = !disabled ? 'remove':'add';
		form.loginbtn.classList[methed]('dsabld');
	}
	addEvent(form.account,'blur',blurHandler);
	addEvent(form.password,'blur',blurHandler);
	addEvent(form.account,"invalid",function(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
	
		if(target.value == ""){
		target.setCustomValidity("请输入测试账号密码");
		}
	})
	function follow(){
		var url = "http://study.163.com/webDev/attention.htm";
		get(url,null,function(response){
			if(response == 1){
				setCookie('followSuc',1,new Date(9999,9));
				unfollow.style.display="none";
				followed.style.display="block";
			}
		})

	}
//添加 submit 事件
	addEvent(form,"submit",function(event){
		var account = form.account.value;
		var input = form.password;
		var pswd = input.value;
		var url = "http://study.163.com/webDev/login.htm";
		var options = {userName:md5(account),password:md5(pswd)};
		function field(response){
			disableSubmit(false);
			console.log(response);
			if(response == 1){
				form.reset();
				follow();
				login.style.display="none";
				setCookie("loginSuc",1,new Date(9999,9));
			}else{
				console.log('账号密码错误');
			}
		};
		get(url,options,field);
		event.preventDefault();
		disableSubmit(true);

		});
		


})();





// follow 登陆end
// 轮播图 start
// 
 
window.onload=function(){ 
var NUM=3; //图片数量
var PRE=0;   // 上一张图
var CURRENT=0;   //当前图
var NEXT=CURRENT+1;   //下一张图
 var imgswrap = document.getElementById('m-slidewrap');
 var imgs = imgswrap.getElementsByTagName('div');
 var crts = imgswrap.getElementsByTagName('li');
//每个图片和 控制点 都添加上一个函数 
	each(crts,function(crt,i){
		crt.onclick=function(){
			CURRENT=i;
			each(imgs,function(img,i){
				delclas(img,"z-crt");
			});
			each(crts,function(crt,i){
				delclas(crt,"z-crt");
			});
			addclas(imgs[i],"z-crt");
			addclas(crts[i],"z-crt");

		}
	})


//滚动函数 

	var slide=function(){
			each(imgs,function(img,i){
				delclas(img,"z-crt");
			});
			each(crts,function(crt,i){
				delclas(crt,"z-crt");
			});
			addclas(imgs[CURRENT],"z-crt");
			addclas(crts[CURRENT],"z-crt");
			PRE=CURRENT;
			CURRENT=NEXT;
			NEXT++;
			NEXT=NEXT%NUM;
	}
	intervalid = setInterval(slide,5000);
	//当鼠标离开时 开始轮播图
imgswrap.onmouseout=function(){
	intervalid = setInterval(slide,5000);

}
//当鼠标进入时 暂停轮播图

imgswrap.onmouseover=function(){
	clearInterval(intervalid);
}
//常用函数
function each(_objects,_fn){
        for(var i=0,len=_objects.length;i<len;i++){
            _fn(_objects[i],i);
        }
    }
function hasClas(_objects,_clasName){
	return (_objects.className.indexOf(_clasName) !== -1) ? true :false;
}
function delclas(_objects,_clasName){
	if(hasClas(_objects,_clasName)){
	_objects.className="";
}
}
function addclas(_objects,_clasName){
	_objects.className=_clasName;
}


}
// 轮播图end

// 课程列表start

var class_module = (function(){
//获取接口数据
	var m_clas = document.querySelector('.m-clas');
	var typeNum = 10; 
	var url = "http://study.163.com/webDev/couresByCategory.htm";
	var options = {pageNo:1,psize:20,type:10};


	//清空列表 
	function removelist(node){
		var claslist = document.querySelectorAll(node);
	
		for(var i = claslist.length-1;i>0;i--){
			var node = claslist[i];
			node.parentNode.removeChild(node);
		}
	}
	function fillList(resdata){
		var psize = resdata.list.length;
		for(var i=0;i<psize;i++){
			var cloneNode = m_clas.cloneNode(true);
			
			// 填充class
			var img = cloneNode.querySelector('.clasimg');
			var intrtext = cloneNode.querySelector('.intrtext');
			var cate = cloneNode.querySelector('.cate');
			var num = cloneNode.querySelector('.headpicwrap span');
			var price = cloneNode.querySelector('.price');
			var detailtext = cloneNode.querySelector('.detailtext');
			
			img.src = resdata.list[i].middlePhotoUrl;
			img.alt = resdata.list[i].name;
			intrtext.innerText = resdata.list[i].name;
			cate.innerText = resdata.list[i].provider;
			num.innerText = resdata.list[i].learnerCount;
			price.innerText = "¥ " + resdata.list[i].price +".00";
			detailtext.innerText = resdata.list[i].description;

			m_clas.parentNode.appendChild(cloneNode);
		}



	}
	function fillpages(pagesNo,pageindex){
	var m_page = document.querySelector('.pageswrap .pageone');
		removelist('.pageone');
		for(var i=1;i <= pagesNo;i++){
			var page_p = m_page.cloneNode(true);
			if(i == pageindex){
				addClass(page_p,'clicked')
			}
			
			page_p.innerText = i;		
			
			m_page.parentNode.appendChild(page_p);
		} 
	}
	function defaultpage(response){
		var resdata = JSON.parse(response);
		var pagesNo = resdata.totalPage;
		var pageindex = resdata.pagination.pageIndex;
		fillList(resdata);
		fillpages(pagesNo,pageindex);
	}
	function tabpage(response){
		var resdata = JSON.parse(response);
		var pagesNo = resdata.totalPage;
		var pageindex = resdata.pagination.pageIndex;
		removelist('.m-clas');
		fillList(resdata);
		fillpages(pagesNo,pageindex);
	}
	get(url,options,defaultpage);

	// 分页器
	var clonepage = document.querySelector('.clonepage');


	function pageclick(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;
		var clickednode = document.querySelector('.clicked');
		// 移除选中背景
		
		if(target.className.indexOf('clicked') > -1){
			console.log('clicked');
			return
		}
		if(target.className.indexOf('pageone') == -1){
			console.log("undefined")
			return
		}else{

			var pageNum = Math.floor(target.innerText);
			var options = {pageNo:pageNum,psize:20,type:typeNum};
			removeClass(clickednode,'clicked');
			addClass(target,'clicked');
			removelist('.m-clas');
			get(url,options,defaultpage)

		}
		console.log(target.innerText);
	}
	//添加页码点击事件
	addEvent(clonepage,'click',pageclick)
	

	//tab 切换
	var listtab = document.querySelector('.listtab');
	function tabclick(event){
		var event = event || window.event;
		var target = event.target || event.srcElement;

		if(target.className.indexOf('wrap') == -1){
			target = target.parentNode;
		}	
		//背景效果
		var tabsld = document.querySelector('.listtab .tabselected');
		removeClass(tabsld,'tabselected');
		addClass(target,'tabselected');
		
		var typeNow = target.dataset.typenum;
		if(typeNum == typeNow){
			return
		}
		typeNum = typeNow;
		var options = {pageNo:1,psize:20,type:typeNow};
		get(url,options,tabpage);
	}
	addEvent(listtab,'click',tabclick);



})();

// 课程列表end
// 右侧hot 排行 start

var hotlist_module = (function(){
	var url = "http://study.163.com/webDev/hotcouresByCategory.htm"
	var m_hotone = document.querySelector('.m-hotone');
	function addremove(resdata){
		var nextindex = 11;
		var count = 0;
		function step(){
			var onedata = resdata[nextindex];
			fillone(onedata);

			if(document.querySelector('.first')){
			var firstclone = document.querySelector('.first');
			var firstimg = document.querySelector('.firstimg');
			firstclone.style.marginBottom='10px';
			removeClass(firstclone,'first');
			removeClass(firstimg,'firstimg');
			
			}
			
			nextindex++
			nextindex = nextindex%20;
			console.log(nextindex);
			var cloneall =document.querySelectorAll('.cloned');			
			var firstclone = cloneall[0];
			var imgnode = firstclone.querySelector('.hotpic');

			addClass(firstclone,'first');
 			addClass(imgnode,'firstimg');
 			firstclone.style.marginBottom=0;
			var length = cloneall.length-1;
			if(count>0){
			m_hotone.parentNode.removeChild(cloneall[length]);
			}
			count++
		}
		 intervalid = setInterval(step,5000);
	}
		function fillone(resdataone){
		var clonehot = m_hotone.cloneNode(true);
		var hotpic = clonehot.querySelector('.hotpic');
		var hottitle = clonehot.querySelector('.hotdetail a');
		var numb = clonehot.querySelector('.numb');

		hotpic.src = resdataone.smallPhotoUrl;
		hottitle.innerText = resdataone.name;
		numb.innerText = resdataone.learnerCount;
		addClass(clonehot,'cloned');
		m_hotone.parentNode.insertAdjacentElement('afterBegin',clonehot);
	}

	function fillhot(resdata,num){

		for(var i=0;i<num;i++){
			var resdataone = resdata[i]
			fillone(resdataone);
		}

	}
	function fillhotlist(response){
	var resdata = JSON.parse(response);

		fillhot(resdata,11);
		addremove(resdata);
	}
	get(url,null,fillhotlist);

})()
// 右侧hot 排行 end


//video模块

 var video_module = (function(){
 	var videopic = document.querySelector('.videopic');
 	var videomask = document.querySelector('#videomask');
 	var	videoclose = videomask.querySelector('.close');
 	var video = videomask.querySelector('video');

 	addEvent(videopic,'click',function(){
 		videomask.style.display = 'block';
 	})
 	addEvent(videoclose,'click',function(){
 		videomask.style.display = 'none'
 		video.pause();
 	})
 })()