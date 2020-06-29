/**************** 전역설정 *****************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();


/**************** 사용자 지정 *****************/



/**************** 이벤트 콜백 *****************/
function onLogin() {
	auth.signInWithPopup(googleAuth);
}


/**************** 이벤트 등록 *****************/
$(".bt-login").click(onLogin);