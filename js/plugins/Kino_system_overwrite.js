//=============================================================================
// Kino_system_overwrite.js
//=============================================================================

/*:
 * @plugindesc 修改部分系統功能
 * @author Kino
 *
 * @desc non
 *
 * @help non
 */

(function() {
    // 取消按shift加速移動
    Game_Player.prototype.isDashButtonPressed = function() {
        return false;
    };
})();
