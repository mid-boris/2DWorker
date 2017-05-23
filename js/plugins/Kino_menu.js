//=============================================================================
// Kino_menu.js
//=============================================================================

/*:zh_TW
 * @plugindesc 選單視窗的變更
 * @author Kino
 *
 * @desc desc
 *
 * @help help
 */

(function() {
    // 視窗位置移動
    var Kino_scene_menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        Kino_scene_menu_create.call(this);
        Kino_scene_menu_position_change(this);
    };

    // 技能選單直接 select 技能
    var Kino_scene_skill_create = Scene_Skill.prototype.create;
    Scene_Skill.prototype.create = function() {
        Kino_scene_skill_create.call(this);
        this.commandSkill();
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
        var x = rect.x + (rect.width * 0.5) + 12;
        var y = rect.y;
        var width = rect.width;
        var bottom = y + rect.height;
        var lineHeight = this.lineHeight();
        this.makeFontSmaller();
        this.drawActorName(actor, x, bottom - lineHeight * 2, width * 0.5);
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

    // 狀態場景內新增 help 視窗與技能視窗
    Scene_Status.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.addStatusWindow();
        this.addHelpWindow();
        this.addSkillWindow();
        this.refreshActor();
        this.commandSkill();
    };

    Scene_Status.prototype.refreshActor = function() {
        var actor = this.actor();
        this._statusWindow.setActor(actor);
        this._itemWindow.setActor(actor);
        var skills = this._actor.skills();
        if (skills.length > 0) {
            this._itemWindow.setStypeId(skills[0].stypeId);
        }
    };

    Scene_Status.prototype.addStatusWindow = function () {
        this.createStatusWindow();
    };

    Scene_Status.prototype.addHelpWindow = function () {
        this.createHelpWindow();
        this._helpWindow.y = Graphics.height - this._helpWindow.height;
    };

    Scene_Status.prototype.addSkillWindow = function () {
        this.createItemWindow();
    };

    Scene_Status.prototype.createStatusWindow = function () {
        this._statusWindow = new Window_Status();
        this._statusWindow.setHandler('cancel',   this.popScene.bind(this));
        this.addWindow(this._statusWindow);
    };

    Scene_Status.prototype.createItemWindow = function () {
        var wx = 0;
        var wy = this._statusWindow.height;
        var ww = Graphics.boxWidth;
        var wh = Graphics.boxHeight - this._statusWindow.height - this._helpWindow.height;
        this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this.addWindow(this._itemWindow);
    };

    Scene_Status.prototype.commandSkill = function() {
        this._itemWindow.activate();
        this._itemWindow.selectLast();
    };

    Window_Status.prototype.initialize = function() {
        var width = Graphics.boxWidth;
        var height = Graphics.boxHeight - 240;
        Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
        this.refresh();
    };
})();
