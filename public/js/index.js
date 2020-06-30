/**************** 전역설정 *****************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var user = null;


/**************** 사용자 지정 *****************/
function init() {
	db.ref("root/notes/"+user.uid).on("child_added", onAdd);
	db.ref("root/notes/"+user.uid).on("child_removed", onRev);
	db.ref("root/notes/"+user.uid).on("child_changed", onChg);
}


/**************** 이벤트 콜백 *****************/
function onAdd(data) {
	console.log(data);
}

function onRev(data) {
	console.log(data);
}

function onChg(data) {
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