//=============================================================================
// InputFrom.js
//=============================================================================

/*:
 * @plugindesc フォーム作って文字入力
 * @author １１１
 *
 *
 * @help InputForm x=350;y=200;v=11;max=5;
 * みたいな感じで。この例だとx350,y200の位置に表示、結果を11番の変数に保存。
 * 最大文字数は5（maxは省略すれば無制限にもできる）
 *
 * cssフォルダを作ってそこに111_InputForm.cssを入れること。
 * 111_InputForm.cssをいじって文字の大きさとかも変えられる
 *
 * 入力が終わるまで次のイベントコマンドは読み込みません
*/
(function() {
    // css追加
    (function(){
        var css = document.createElement('link');
        css.rel = "stylesheet";
        css.type = 'text/css';
        css.href = './css/111_InputForm.css';
        var b_top = document.getElementsByTagName('head')[0];
        b_top.appendChild(css);
    })();
    // キー入力不可にする為に
    Input.form_mode = false;
    var _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        if(Input.form_mode)return;
        _Input_onKeyDown.call(this , event)
    };
    var _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function(event) {
        if(Input.form_mode)return;
        _Input_onKeyUp.call(this , event)
    };
    // 入力終わるまで次のイベントコマンド読み込まない
    var _Game_Interpreter_updateWaitMode =
            Game_Interpreter.prototype.updateWaitMode;    
    Game_Interpreter.prototype.updateWaitMode = function(){
        if(this._waitMode == 'input_form')return true;
        return _Game_Interpreter_updateWaitMode.call(this);
    }

    // 引数のx=350;y=200;みたいなのを可能にする
    var argHash = function(text , arg_names){
        var _args = new Array(arg_names.length);
        var ary = text.split(";");
        ary.forEach(function(str){
            var s_ary = str.split("=");
            var prop = s_ary[0].toLowerCase();
            var value = s_ary[1];
            _args[arg_names.indexOf(prop)] = value;
        });
        return _args;
    }    
    //=============================================================================
    // Game_Interpreter - register plugin commands
    //=============================================================================
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'InputForm'){
            var _ary = argHash(args[0] , ["x" , "y" , "v" , "max"]);
            var target_x = +_ary[0];
            var target_y = +_ary[1];
            var variables_id = +_ary[2];
            var max_count = _ary[3] || null;
            var screen_x;
            var screen_y;
            var parcentCal = function(tmp_ele , screen_postion , target_postion){
                tmp_ele.style.left = ((screen_postion[0] + target_postion[0]) / window.innerWidth * 100) + "%";
                tmp_ele.style.top  = ((screen_postion[1] + target_postion[1]) / window.innerHeight * 100) + "%";
            };
            var that = this;
            (function(){
                var submitFunc = function(){
                    var f_ele = document.getElementById('_111_input');
                    var s_ele = document.getElementById('_111_submit');
                    $gameVariables.setValue(variables_id , f_ele.value);
                    document.body.removeChild(f_ele);
                    document.body.removeChild(s_ele);
                    window.removeEventListener("resize", getScreenPosition, false);
                    //
                    that.setWaitMode('');
                    Input.form_mode = false;
                    // SceneManager._scene.start();                    
                }
                // 入力フォーム
                var input_ele = document.createElement('input');
                input_ele.setAttribute('id', '_111_input');
                if(max_count)input_ele.setAttribute('maxlength', max_count);
                input_ele.onkeydown = function(e){
                    if(e.keyCode === 13){
                        Input.clear();
                        submitFunc();
                        // 親へのイベント伝播を止める（documentのkeydonwが反応しないように）
                        e.stopPropagation();
                    }
                }
                // 送信ボタン
                var sub_ele = document.createElement('input');
                sub_ele.setAttribute('type', 'submit');
                sub_ele.setAttribute('id', '_111_submit');
                sub_ele.setAttribute('value', '決定');
                sub_ele.onclick = function(){
                    submitFunc();
                    return false;
                }
                var is_pc = Utils.isNwjs();
                // canvasの左上を基準にした位置を求める
                function getScreenPosition(){
                    var _canvas = document.getElementById('UpperCanvas');
                    var rect = _canvas.getBoundingClientRect();
                    if(!is_pc){ // web用座標
                        screen_x = rect.x;
                        screen_y = rect.y;
                    }else{ // exe用(左上0,0からでOK)
                        screen_x = 0;
                        screen_y = 0;                        
                    }
                    parcentCal(input_ele , [screen_x,screen_y] , [target_x,target_y + 40]);
                    parcentCal(sub_ele , [screen_x,screen_y] , [target_x,target_y]);                    
                }
                getScreenPosition();
                // webではウィンドー大きさ変わる度に%求め直す必要が
                if(!is_pc){
                    window.addEventListener("resize", getScreenPosition, false);
                }
                /* 大きさが取れねえ
                document.getElementById('_111_input').style.width
                */
                document.body.appendChild(input_ele);
                document.body.appendChild(sub_ele);
                input_ele.focus();
            })();

            //
            this.setWaitMode('input_form');
            Input.clear();
            Input.form_mode = true;
            // SceneManager._scene.stop();
        }
    };
})();