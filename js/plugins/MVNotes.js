//=============================================================================
// MVNotes.js
//=============================================================================

/*:
 * @plugindesc Web Notes(like a BBS) plugin
 * @author Soichiro Yoshimura
 *
 * @param host
 * @desc mv-notes server's hostname (server source: https://github.com/sifue/mv-notes)
 * @default localhost
 *
 * Plugin Command:
 *   MVNotes read note_name     # replace notename to your note_name
 *   MVNotes write note_name    # replace notename to your note_name
 */

/*:ja
 * @plugindesc ウェブ雑記帳プラグイン
 * @author Soichiro Yoshimura
 *
 * @param host
 * @desc mv-notes のサーバーのホスト名 (サーバーのソースコード: https://github.com/sifue/mv-notes)
 * @default localhost
 *
 * Plugin Command:
 *   MVNotes read note_name     # note_name をノート名に変更してください
 *   MVNotes write note_name    # note_name をノート名に変更してください
 */



(function () {
    //厳格モード
    'use strict';

    //parametersにプラグイン管理で設定した数値を持ってくる。
    //一行目　プラグイン名MVNOtes の 
    //2行目　数値 （host）が存在しなかったらPlease set mv-notes server hostnameが入る。
	var parameters = PluginManager.parameters('MVNotes');
	var host = String(parameters['host'] || 'Please set mv-notes server hostname');
	//
    // Warm up heroku
    //通信テスト（成功したら通信データをdataに取得）
    //下記urlを取得
    var obj = {
        type: 'get',
        url: 'http://' + host + '',
        contentType: 'text/plain',
        success: function (data) {
            console.log(data);
        }
    };
    //jqueryのajaxという関数を使ってHTTP通信でページを読み込みこむ
	jQuery.ajax(obj);
	
    // Read
    //readpostsという関数を作ってる（noteとdatahandlerという引数を持ってる）
	function readPosts(note, dataHandler) {
	    jQuery.getJSON(

            //.phpから取得も可能
			'http://' + host + '/notes/' + note + '/posts',
			function (json) {
				for (var row of json) {
					row.data = JSON.parse(row.data);
				}
				dataHandler(json);
			}
		);
	}
	
    // fillZeroという関数を作ってる
	function fillZero(num) {
		if(num < 10) {
			return '0' + num.toString();
		} else {
			return num.toString();
		}	
	}

    // sendToMessageという関数を作ってる
	function sendToMessage(row) {
		var date = new Date(row.created_at);
		var first = row.post_id + 
		' ：' + row.data.name +
		' ：' + fillZero(date.getFullYear() % 100) + '/' +
		+ fillZero(date.getMonth() + 1) + '/' +
		fillZero(date.getDate()) + ' ' +
		fillZero(date.getHours()) + ':' +
		fillZero(date.getMinutes()) + ' ID:' +
		substring(row.data.remote_address);
		$gameMessage.add(first);
        //
		var content = row.data.content;
		if (content) {
            //
		    $gameMessage.add(content);
		    $gameMessage.setScroll(5, true)
		} else {
			$gameMessage.add('');
		}
	}

    // substringという関数を作ってる
	function substring(str) {
		if(str) {
			return str.substring(0,3);
		} else {
			return '';	
		}
	} 
	
    // Write
    // writePostという関数を作ってる
	function writePost(note, name, content) {
		jQuery.ajax({
			type: 'post',
			url: 'http://' + host + '/notes/' + note + '/posts',
            //jsonデータです。
			contentType: 'application/json',
		    //JSON.stringify() メソッドは JavaScript の値を JSON 文字列に変換します。置き換え関数を指定して値を置き換えたり、置き換え配列を指定して指定されたプロパティのみを含むようにしたりできます。
			data: JSON.stringify({name:name, content:content}),
			success: function(data) {
			}
		});
	}
	
    // Hook command
    // 別名 = Game_Interpreter.prototype.pluginCommand;
    //プラグインコマンドをエイリアスにする。
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;

    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'MVNotes') {
			var noteName = args[1];
            switch (args[0]) {
				case 'read':
					readPosts(noteName, function (data) {
						if (data.length === 0) {
							$gameMessage.add('何も書かれていない。');
						} else {
							data.map(sendToMessage);
						}
					});
					break;
				case 'write':
					var name = prompt('名前を入力して下さい', '名無しの参加者');
					if (!name) {
						break;
					}
					//var content = prompt('残りタイム：\v[1]秒');
				    // 
					writePost(noteName, name, $gameVariables.value(60));
					$gameMessage.add('あなたのスコアがサーバーに記録されました！\!');
					break;
                case 'score':
                    var name = $gameActors.actor(1).name;
                    var content = $gameTimer.seconds();
                    //$gameVariables.value(60);
                    writePost(noteName, name, content);
                    $gameMessage.add('あなたのスコアがサーバーに記録されました！\!');
                    break;
                case 'test':
                    console.log($gameTimer.seconds());
                    console.log($gameActors.actor(1).name);
                    break;
            }
        }
    };
})();
