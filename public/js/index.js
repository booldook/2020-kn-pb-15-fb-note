/**************** 전역설정 *****************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var user = null;
var ref = null;
var key = null;


/**************** 사용자 지정 *****************/
function init() {
	ref = db.ref("root/notes/"+user.uid);
	ref.on("child_added", onAdded);
	ref.on("child_removed", onRemoved);
	ref.on("child_changed", onChanged);
}


/**************** 이벤트 콜백 *****************/
function onSave() {
	var content = $("#content").val().trim();
	if(content === "") {
		alert("메모를 작성해 주세요.");
		$("#content").focus();
	}
	else {
		if(key) {
			db.ref('root/notes/' + user.uid + '/' + key).update({
				content: content,
				updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
				icon: content.substr(0, 1)
			});
		}
		else {
			ref.push({
				content: content,
				createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
				icon: content.substr(0, 1)
			}).key;
		}
		$("#content").val('');
		key = null;
	}
}

function onDel(e) {
	e.stopPropagation();
	var id = $(this).parent().attr("id");
	if(confirm("정말로 삭제하시겠습니까?")) {
		db.ref("root/notes/" + user.uid + "/" + id).remove();
	}
}

function onChg() {
	db.ref("root/notes/" + user.uid + "/" + $(this).attr("id")).once("value").then(function(data){
		key = data.key;
		$("#content").val(data.val().content);
	});
}

function onAdded(data) {
	var html = '';
	html += '<div class="card position-relative" id="'+data.key+'">';
	html += '<i class="bt-del fa fa-trash-alt position-absolute"></i>';
	html += '<div class="card-body d-flex align-items-center">';
	html += '<h2 class="rounded-circle w70 h70 bg-primary text-light d-flex justify-content-center align-items-center font-weight-bold">'+data.val().icon+'</h2>';
	html += '<div class="w-auto ml-3">';
	html += '<h3>'+data.val().content.substr(0, 10)+'...</h3>';
	html += '<p>'+data.val().createdAt+'</p>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$(html).prependTo(".list-wrapper").click(onChg).find(".bt-del").click(onDel);
}

function onRemoved(data) {
	$("#"+data.key).remove();
}

function onChanged(data) {
	$("#"+data.key).find("h2").html(data.val().icon);
	$("#"+data.key).find("h3").html(data.val().content.substr(0, 10) + "...");
	$("#"+data.key).find("p").html(data.val().updatedAt);
}


function onLogin() {
	auth.signInWithPopup(googleAuth);
}
function onLogout() {
	auth.signOut();
}
function onAuthChg(data) {
	user = data;
	console.log(user);
	if(user) {
		$(".bt-login").hide();
		$(".logout-wrap").addClass("d-flex").removeClass("d-none");
		$(".header .icon").attr("src", data.photoURL);
		$(".header .email").html(data.email);
		$("#content").val('').attr("disabled", false);
		$(".bts > button").attr("disabled", false);
		init();
	}
	else {
		$(".bt-login").show();
		$(".header .icon").attr("src", "https://via.placeholder.com/50x50");
		$(".header .email").html("");
		$(".logout-wrap").addClass("d-none").removeClass("d-flex");
		$(".list-wrapper").empty();
		$("#content").val('').attr("disabled", true);
		$(".bts > button").attr("disabled", true);
		key = null;
	}
}

function onReset() {
	$("#content").val('');
}

function onNew() {
	$("#content").val('');
	key = null;
}

function onListToggle() {
	if($(".list-wrapper").position().left < 0) {
		$(".list-wrapper").css("left", 0);
	}
	else {
		$(".list-wrapper").css("left", "-100%");
	}
}

/**************** 이벤트 등록 *****************/
auth.onAuthStateChanged(onAuthChg);

$(".bt-login").click(onLogin);
$(".bt-logout").click(onLogout);
$(".bt-save").click(onSave);
$(".bt-del").click(onDel);
$(".bt-reset").click(onReset);
$(".bt-new").click(onNew);
$(".bt-bars").click(onListToggle);