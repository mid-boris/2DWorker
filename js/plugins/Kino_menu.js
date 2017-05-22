//=============================================================================
// Kino_menu.js
//=============================================================================

/*:
 * @plugindesc 選單視窗的變更
 * @author Kino
 *
 * @desc non
 *
 * @help non
 */

(function() {
    // 視窗位置移動
    var Kino_scene_menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        Kino_scene_menu_create.call(this);
        Kino_scene_menu_position_change(this);
    };

    var Kino_scene_menu_position_change = function(scene) {
        // 金幣視窗
        scene._goldWindow.x = Graphics.boxWidth - scene._goldWindow.width;
        scene._goldWindow.y = 0;
        scene._goldWindow.opacity = 0;
        // 角色狀態選擇視窗
        scene._statusWindow.x = 0;
        scene._statusWindow.y = Graphics.height - scene._statusWindow.height - scene._commandWindow.height;
        // 選單命令視窗
        scene._commandWindow.y = Graphics.boxHeight - scene._commandWindow.height;
    };

    // 重寫選單「命令列」的位置和排列
    Window_MenuCommand.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuCommand.prototype.maxCols = function() {
        return 5;
    };

    Window_MenuCommand.prototype.numVisibleRows = function() {
        return 1;
    };

    // 選單「存檔」、「隊形」移除
    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addMainCommands();
        this.addOriginalCommands();
        this.addOptionsCommand();
    };

    // 重寫選單「角色狀態列」的位置
    Window_MenuStatus.prototype.windowWidth = function() {
        return Graphics.boxWidth;
    };

    Window_MenuStatus.prototype.windowHeight = function() {
        return this.fittingHeight(2);
    };

    Window_MenuStatus.prototype.maxCols = function() {
        return 4;
    };

    Window_MenuStatus.prototype.numVisibleRows = function() {
        return 1;
    };

    Window_MenuStatus.prototype.drawItemImage = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var w = Math.min(rect.width, 144);
        var h = Math.min(rect.height, 144);
        this.changePaintOpacity(actor.isBattleMember());
        this.drawActorFaceScale(actor, rect.x, rect.y - 4, w, h, 0.8);
        this.changePaintOpacity(true);
    };

    Window_MenuStatus.prototype.drawItemStatus = function(index) {
        var actor = $gameParty.members()[index];
        var rect = this.itemRectForText(index);
        var x = rect.x + (rect.width * 0.5);
        var y = rect.y;
        var width = rect.width;
        var bottom = y + rect.height;
        var lineHeight = this.lineHeight();
        this.drawActorName(actor, x, bottom - lineHeight * 2 + 4, width * 0.5);
        this.drawActorHpMpSmall(actor, rect.x, bottom - lineHeight * 1, width, 8);
    };

    // 選單「選項」的命令功能移除跑步和記憶功能
    Window_Options.prototype.makeCommandList = function() {
        this.addVolumeOptions();
    };

    // 重寫獲得臉圖的位置和大小, 符合可縮放
    Window_Base.prototype.drawActorFaceScale = function(actor, x, y, width, height, scale) {
        var scaleX = 0, scaleY = 0;
        if (scale === undefined) {
            scaleX = width;
            scaleY = height;
        } else {
            scaleX = width * scale;
            scaleY = height * scale;
        }
        this.drawFaceScale(actor.faceName(), actor.faceIndex(), x, y, width, height, scaleX, scaleY);
    };

    Window_Base.prototype.drawFaceScale = function(faceName, faceIndex, x, y, width, height, targetX, targetY) {
        width = width || Window_Base._faceWidth;
        height = height || Window_Base._faceHeight;
        var bitmap = ImageManager.loadFace(faceName);
        var pw = Window_Base._faceWidth;
        var ph = Window_Base._faceHeight;
        var sw = Math.min(width, pw);
        var sh = Math.min(height, ph);
        var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
        var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
        var sx = faceIndex % 4 * pw + (pw - sw) / 2;
        var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy, targetX, targetY);
    };

    // HP MP 部分變更
    Window_Base.prototype.drawActorHpMpSmall = function(actor, x, y, width, height) {
        width = width || 186;
        var color1 = this.hpGaugeColor1();
        var color2 = this.hpGaugeColor2();
        this.drawGaugeSmall(x, y - height, width, actor.hpRate(), color1, color2, height);
        color1 = this.mpGaugeColor1();
        color2 = this.mpGaugeColor2();
        this.drawGaugeSmall(x, y, width, actor.mpRate(), color1, color2, height);
    };

    Window_Base.prototype.drawGaugeSmall = function(x, y, width, rate, color1, color2, height) {
        var fillW = Math.floor(width * rate);
        var gaugeY = y + this.lineHeight() - 8;
        this.contents.fillRect(x, gaugeY, width, height, this.gaugeBackColor());
        this.contents.gradientFillRect(x, gaugeY, fillW, height, color1, color2, null);
    };
})();
