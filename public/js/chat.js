/**************** 전역설정 *****************/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var user = null;
var ref = null;


/**************** 사용자지정 *****************/
function init() {
	db.ref("root/chats").on("child_added", onAdded);
}


/**************** 이벤트콜백 *****************/
function onAdded(r) {
	var html;
	if(user.uid === r.val().writer_id) html = '<div class="chat p-2 me">';
	else html = '<div class="chat p-2">';
	html += '<div class="cont text-light p-3">'+r.val().chat+'</div>';
	html += '<div class="writer">'+r.val().writer+'</div>';
	html += '</div>';
	$(".chat-stage").append(html);
	$(".chat-stage").scrollTop($(".chat-stage")[0].scrollHeight);
}

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

function onSave() {
	var chat = $("#chat-txt").val().trim();
	if(chat == "") alert("글을 작성하세요.");
	else {
		db.ref("root/chats").push({
			chat: chat,
			writer: user.displayName,
			writer_id: user.uid,
			createdAt: moment().format('YYYY-MM-DD HH:mm:ss')
		}).key;
	}
	$("#chat-txt").val('');
}

/**************** 이벤트선언 *****************/
auth.onAuthStateChanged(onAuth);
$(".bt-login").click(onLogin);
$(".bt-logout").click(onLogout);
$(".bt-save").click(onSave);