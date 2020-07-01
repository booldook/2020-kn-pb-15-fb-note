/**************** 전역설정 *****************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var user = null;
var ref = null;


/**************** 사용자지정 *****************/
function init() {
	
}


/**************** 이벤트콜백 *****************/
function onAuth(r) {
	if(r) {	// 로그인 상태
		$(".bt-login").hide();
		$(".bt-logout").show();
		user = r;
		init();
	}
	else {	// 로그아웃 상태
		$(".bt-login").show();
		$(".bt-logout").hide();
		user = null;
		$(".chat").remove();
	}
}

function onLogin() {
	auth.signInWithPopup(googleAuth);
}

function onLogout() {
	auth.signOut();
}

/**************** 이벤트선언 *****************/
auth.onAuthStateChanged(onAuth);
$(".bt-login").click(onLogin);
$(".bt-logout").click(onLogout);