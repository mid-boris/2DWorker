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
    // 選單位置
    var Kino_scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        Kino_scene_Menu_createCommandWindow.call(this);
        this._commandWindow.x = 100;
    };

    // 金幣視窗位置
    var Kino_scene_Menu_createGoldWindow = Scene_Menu.prototype.createGoldWindow;
    Scene_Menu.prototype.createGoldWindow = function() {
        Kino_scene_Menu_createGoldWindow.call(this);
        this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
        this._goldWindow.y = 0;
        this._goldWindow.opacity = 0;
    };

    // TODO: 先隱藏角色選擇視窗
    var _Window_MenuStatus_initialize = Window_MenuStatus.prototype.initialize;
    Window_MenuStatus.prototype.initialize = function(x, y) {
        _Window_MenuStatus_initialize.call(this, x, y);
        this.openness = 0;
    };

    // 選單「選項」的命令功能
    Window_Options.prototype.makeCommandList = function() {
        this.addVolumeOptions();
    };

    // 選單「存檔」、「隊形」移除
    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addMainCommands();
        this.addOriginalCommands();
        this.addOptionsCommand();
        this.addGameEndCommand();
    };
})();
