/**************** 전역설정 *****************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var user = null;
var ref = null;


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
		ref.push({
			content: content,
			createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
			icon: content.substr(0, 1)
		}).key;
	}
}

function onAdded(data) {
	console.log(data);
}

function onRemoved(data) {
	console.log(data);
}

function onChanged(data) {
	console.log(data);
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
		init();
	}
	else {
		$(".bt-login").show();
		$(".header .icon").attr("src", "https://via.placeholder.com/50x50");
		$(".header .email").html("");
		$(".logout-wrap").addClass("d-none").removeClass("d-flex");
	}
}

/**************** 이벤트 등록 *****************/
auth.onAuthStateChanged(onAuthChg);

$(".bt-login").click(onLogin);
$(".bt-logout").click(onLogout);
$(".bt-save").click(onSave);