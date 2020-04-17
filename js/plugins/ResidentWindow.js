//=============================================================================
// 【常駐ウィンドウ】　Version: 1.00
//
// ※ 当ブログの常駐所持金ウィンドウ（ResidentGoldWindow.js）はこのスクリプトに統合されました。
// 　 既に使用されている方はそのプラグインを消去した上で本プラグインを導入して下さい。
//
// ここからリスポーン: http://respawnfromhere.blog.fc2.com/
// Twitter: https://twitter.com/ibakip
//
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc マップに常駐するステータス＋所持金ウィンドウを生成します。
 * @author ResidentWindow
 *
 * //---↓全体管理-------------------------------------------
 *
 * @param Status_Window_ON
 * @desc ステータスウィンドウを使用する場合は true を指定して下さい。
 * （※使用しない場合は false を指定）
 * @default true
 *
 * @param Gold_Window_ON
 * @desc 所持金ウィンドウを使用する場合は true を指定して下さい。
 * （※使用しない場合は false を指定）
 * @default true
 *
 * //-----------------------------------------------------
 *
 * //---↓ステータスウィンドウ-------------------------------------
 *
 * @param Status_Window_x
 * @desc ステータスを表示するx座標です。
 * @default 10
 *
 * @param Status_Window_y
 * @desc ステータスを表示するy座標です。
 * @default 10
 *
 * //--------------------------------------------------------
 *
 * //---↓所持金ウィンドウ-------------------------------------
 *
 * @param Gold_Window_x
 * @desc 所持金ウィンドウを表示するx座標です。
 * @default 576
 *
 * @param Gold_Window_y
 * @desc 所持金ウィンドウを表示するy座標です。
 * @default 550
 *
 * @param Gold_Window_type
 * @desc 所持金ウィンドウのタイプを選択します。
 * 0：通常 1：黒背景 2:透明 3:画像
 * @default 3
 *
 * @param Gold_Window_width
 * @desc 所持金ウィンドウの横幅です。
 * Gold_Window_typeで 3 を指定した場合は無視されます。
 * @default 240
 *
 * @param Gold_Window_height
 * @desc 所持金ウィンドウの縦幅です。
 * Gold_Window_typeで 3 を指定した場合は無視されます。
 * @default 60
 *
 * @param Icon_Number
 * @desc 所持金ウィンドウに描画するアイコンを選択します。
 * 0 を指定するとアイコンは使わず単位を描画します。
 * @default 314
 *
 * @param GoldWindw_PaddingWidth
 * @desc 所持金ウィンドウ内の横方向の余白を調整します。
 * 値を大きくするほど描画内容が内側に寄ります。
 * @default 10
 *
 * //--------------------------------------------------------
 *
 * @help
 *
 * //=============================================================================
 * // 【常駐ウィンドウ】　Version: 1.00
 * //
 * // ※ 当ブログの常駐所持金ウィンドウ（ResidentGoldWindow.js）は
 * //   このスクリプトに統合されました。
 * //   既に使用されている方はそのプラグインを消去した上で
 * //   本プラグインを導入して下さい。
 * //
 * // ここからリスポーン: http://respawnfromhere.blog.fc2.com/
 * // Twitter: https://twitter.com/ibakip
 * //
 * //=============================================================================
 *
 * このプラグインはマップに常駐するステータスウィンドウと
 * 所持金ウィンドウを生成します。
 *　
 * 【プラグインコマンド】
 *  WindowON  : 常駐ウィンドウを表示します。
 *  WindowOFF : 常駐ウィンドウを非表示にします。
 *
 * 【パラメータ】
 * 各ウィンドウの使用
 *  ・ Status_Window_ON
 *  ・ Gold_Window_ON
 *     それぞれ true を指定すると使用、 false を指定すると未使用。
 *
 * ステータスウィンドウ表示位置の変更
 *  ・ Status_Window_x
 *  ・ Status_Window_y
 *
 * 所持金ウィンドウ表示位置の変更
 *  ・ Gold_Window_x
 *  ・ Gold_Window_y
 *
 * 所持金ウィンドウのウィンドウタイプ変更
 *  ・ Status_Window_type
 *     0：通常  1：黒背景  2:透明  3:画像
 *     3 を選択する場合、使用する画像をimg/pictures フォルダに
 *     GoldWindowPictue.png というファイル名で追加して下さい。
 *
  * 所持金ウィンドウの幅の変更
 *  ・ Status_Window_width
 *  ・ Status_Window_height
 *     Status_Window_typeで 3 を指定した場合、この値は無視されます。
 *     （画像サイズに合わせて自動でウィンドウ幅が決定されます。）
 *
 * 所持金ウィンドウに描画するアイコン画像の変更
 *  ・ Icon_Number
 *     0 を指定するとアイコンは使わずお金の単位を描画します。
 *
 * 所持金ウィンドウ内の横方向の余白調整
 *  ・ GoldWindw_PaddingWidth
 *     値が大きいほど描画内容が内側に寄ります。
 *
 *
 */
 //=============================================================================


/* グローバル変数の準備 */
var WinON = true;
var WinOFF = false;
var RGW_bitmap = ImageManager.loadPicture('GoldWindowPictue', 0);


// ---プラグインパラメータの取得-----------------------------------------------------
 var Parameters = PluginManager.parameters('ResidentWindow');
 var RSW_ON = Parameters['Status_Window_ON'];
 var RGW_ON = Parameters['Gold_Window_ON'];
 var RSW_x  = Number(Parameters['Status_Window_x'] || 0);
 var RSW_y  = Number(Parameters['Status_Window_y'] || 0);
 var RGW_x  = Number(Parameters['Gold_Window_x'] || 0);
 var RGW_y  = Number(Parameters['Gold_Window_y'] || 0);
 var RGW_type   = Number(Parameters['Gold_Window_type'] || 0);
 var RGW_width  = Number(Parameters['Gold_Window_width'] || 0);
 var RGW_height = Number(Parameters['Gold_Window_height'] || 0);
 var RGW_icon   = Number(Parameters['Icon_Number'] || 0);
 var RGW_paddingWidth = Number(Parameters['GoldWindw_PaddingWidth'] || 0);
//----------------------------------------------------------------------------


// ---プラグインコマンド-------------------------------------------------------------
var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _Game_Interpreter_pluginCommand.call(this, command, args);
    if (command === 'WindowON') {
        WinON = true;
        WinOFF = false;
    }
    if (command === 'WindowOFF' ){
        WinON = false;
        WinOFF = true;
    }
};
//----------------------------------------------------------------------------



//-----------------------------------------------------------------------------
// Window_ResidentStatus
//-----------------------------------------------------------------------------
/* マップ画面に常駐するステータスウィンドウを扱うクラスです */

function Window_ResidentStatus() {
    this.initialize.apply(this, arguments);
}

Window_ResidentStatus.prototype = Object.create(Window_Base.prototype);
Window_ResidentStatus.prototype.constructor = Window_ResidentStatus;

Window_ResidentStatus.prototype.initialize = function(x, y, width, height) {
    var xx = this.contentsWidth();
    var yy = this.contentsHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, xx, yy);
    this.refresh();
};

/* 描画内容の更新 */
Window_ResidentStatus.prototype.refresh = function(){
    this.last_hp = $gameParty.members()[0].hp;
    this.last_mp = $gameParty.members()[0].mp;
    this.last_tp = $gameParty.members()[0].tp;
    this.party_leader = $gameParty.leader();
    this.last_WinON = WinON;
    this.contents.clear();
    var x = 0;
    var y = 0;
    var leader_name = this.party_leader.faceName();
    var leader_id = this.party_leader.faceIndex();
    var face_width = Window_Base._faceWidth;
    var face_height = Window_Base._faceHeight;
    this.drawPicture('FaceLayer1', x, y);
    this.drawFace(leader_name, leader_id, x+16, y+16, face_width, face_height);
    this.drawPicture('FaceLayer2', x, y);
    this.drawActorHp(this.party_leader, 176+18, y+10, 400);
    this.drawActorMp(this.party_leader, 176+18, y+45, 400);
    this.drawActorTp(this.party_leader, 176+18, y+80, 400);
    var yPlus = 0;
    for(var i=0; i<=2; i++){
        this.drawPicture('GaugeFrame', 176+13, y+5+yPlus);
        yPlus = yPlus + 35;
    }
    if(WinOFF === true){
        this.contents.clear();
    }
};

/* フレーム毎の更新処理 （更新条件も記述）*/
Window_ResidentStatus.prototype.update = function(){
    Window_Base.prototype.update.call(this);
    if(this.last_hp != $gameParty.members()[0].hp ) {
        this.refresh();
    }
    if(this.last_mp != $gameParty.members()[0].mp ) {
        this.refresh();
    }
    if(this.last_tp != $gameParty.members()[0].tp ) {
        this.refresh();
    }
    if(this.party_leader != $gameParty.leader() ){
        this.refresh();
    }
    if(this.last_WinON != WinON){
        this.refresh();
    }
};

/* ウィンドウを開く処理 */
Window_ResidentStatus.prototype.open = function() {
    this.refresh();
    Window_Base.prototype.open.call(this);
};

/* コンテンツの横幅取得 */
Window_ResidentStatus.prototype.contentsWidth = function() {
    return 599;
};

/* コンテンツの縦幅取得 */
Window_ResidentStatus.prototype.contentsHeight = function() {
    return 176;
};

/* フレーム描画用 */
Window_ResidentStatus.prototype.drawPicture = function(filename, x, y) {
    var bitmap = ImageManager.loadPicture(filename, 0);
    var pw = bitmap.width;
    var ph = bitmap.height;
    this.contents.blt(bitmap, 0, 0, pw, ph, x, y);
};

/*　HPゲージの描画 */
Window_ResidentStatus.prototype.drawActorHp = function(actor, x, y, width) {
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, width, actor.hpRate(), color1, color2);
};

/* MPゲージの描画 */
Window_ResidentStatus.prototype.drawActorMp = function(actor, x, y, width) {
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    this.drawGauge(x, y, width, actor.mpRate(), color1, color2);
};

/* TPゲージの描画 */
Window_ResidentStatus.prototype.drawActorTp = function(actor, x, y, width) {
    var color1 = this.tpGaugeColor1();
    var color2 = this.tpGaugeColor2();
    this.drawGauge(x, y, width, actor.tpRate(), color1, color2);
};

/* ゲージの描画処理 */
Window_ResidentStatus.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeHeight = 18;
    this.contents.fillRect(x, y, width, gaugeHeight, this.gaugeBackColor());
    this.contents.gradientFillRect(x, y, fillW, gaugeHeight, color1, color2);
};


//-----------------------------------------------------------------------------
// Window_ResidentGold
//-----------------------------------------------------------------------------
/* マップ画面に常駐する所持金ウィンドウを扱うクラスです */

function Window_ResidentGold() {
    this.initialize.apply(this, arguments);
}

Window_ResidentGold.prototype = Object.create(Window_Gold.prototype);
Window_ResidentGold.prototype.constructor = Window_ResidentGold;

Window_ResidentGold.prototype.initialize = function(x, y) {
    Window_Gold.prototype.initialize.call(this, x, y);
    this.refresh();
};

/* 描画内容の更新 */
Window_ResidentGold.prototype.refresh = function(){
    this.last_gold = $gameParty.gold();
    this.last_WinON = WinON;
    var x = this.textPadding() + RGW_paddingWidth;
    var y = (this.contentsHeight() - Window_Base.prototype.lineHeight() ) / 2;
    var icon_y = (this.contentsHeight() - Window_Base._iconWidth) / 2;
    var width = this.contentsWidth();
    this.contents.clear();
    if(RGW_type == 3){
        this.drawBackground.call(this);
    }
    if(RGW_icon == 0){
        this.drawCurrencyValue(this.value(), TextManager.currencyUnit, -x, y, width);
    }else{
        this.drawText(this.value(), -x, y, this.contentsWidth(), 'right');
        this.drawIcon(RGW_icon, x, icon_y);
    }
    if(WinOFF === true){
        this.contents.clear();
    }
};

/* フレーム毎の更新処理 （更新条件も記述）*/
Window_ResidentGold.prototype.update = function(){
    Window_Base.prototype.update.call(this);
    if(this.last_gold != $gameParty.gold()) {
        this.refresh();
    }
    if(this.last_WinON != WinON){
        this.refresh();
    }
};

/* ウィンドウを開く処理 */
Window_ResidentGold.prototype.open = function() {
    this.refresh();
    Window_Gold.prototype.open.call(this);
};

/* コンテンツの横幅取得 */
Window_ResidentGold.prototype.contentsWidth = function() {
    if(RGW_type == 3){
        return RGW_bitmap.width;
    }else{
        return RGW_width;
    }
};

/* コンテンツの縦幅取得 */
Window_ResidentGold.prototype.contentsHeight = function() {
    if(RGW_type == 3){
        return RGW_bitmap.height;
    }else{
        return RGW_height;
    }
};

/* ウィンドウの背景画像を描画 */
Window_ResidentGold.prototype.drawBackground = function() {
    this.contents.blt(RGW_bitmap, 0, 0, RGW_bitmap.width, RGW_bitmap.height, 0, 0);
};


//-----------------------------------------------------------------------------
// Scene_Map
//-----------------------------------------------------------------------------
/* シーンを扱うクラス（rpg_scenes.jpに元々あるクラス） */

/* マップ画面開始時の処理（当スクリプトで追加したウィンドウを開く処理を追加） */
var scene_map_start = Scene_Map.prototype.start;
Scene_Map.prototype.start = function() {
    scene_map_start.call(this);
    //if(RSW_ON === true){
    if( !(RSW_ON === 'false' || RSW_ON ==='') ){
        this.status_window.open();
    }
    if( !(RGW_ON === 'false' || RGW_ON ==='') ){
        this.gold_window.open();
    }
};

/* ステータスウィンドウを生成する処理 */
Scene_Map.prototype.createResidentStatusWindow = function(){
    this.status_window = new Window_ResidentStatus(this);
    this.status_window.width = 601;
    this.status_window.height = 176;
    this.status_window.x = RSW_x;
    this.status_window.y = RSW_y;
    this.status_window.padding = 0;
    this.status_window.openness = 0;
    this.status_window.setBackgroundType(2);
    this.addWindow(this.status_window);
};

/* 所持金ウィンドウを生成する処理 */
Scene_Map.prototype.createResidentGoldWindow = function(){
    this.gold_window = new Window_ResidentGold(this);
    this.gold_window.x = RGW_x;
    this.gold_window.y = RGW_y;
    if(RGW_type == 3){
        this.gold_window.width = RGW_bitmap.width;
        this.gold_window.height = RGW_bitmap.height;
        this.gold_window.setBackgroundType(2);
    }
    else{
        this.gold_window.width = RGW_width;
        this.gold_window.height = RGW_height;
        this.gold_window.setBackgroundType(RGW_type);
    }
    this.gold_window.padding = 0;
    this.gold_window.openness = 0;
    this.addWindow(this.gold_window);
};

/* 全ウィンドウを生成する処理 */
var scene_map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    scene_map_createAllWindows.call(this);
    this.createResidentStatusWindow(this);
    this.createResidentGoldWindow(this);
};

/* シーンがマップ以外に遷移した時にウィンドウを見えなくする処理 */
var scene_map_stop = Scene_Map.prototype.stop;
Scene_Map.prototype.stop = function() {
    scene_map_stop.call(this);
    this.status_window.openness = 0;
    this.gold_window.openness = 0;
};

