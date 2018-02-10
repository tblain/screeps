var roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // console.log("rien à attaquer");
            creep.moveTo(Game.flags["ptRalliement"], {visualizePathStyle: {stroke: '#ffffff'}});
        }
        
    }
};

module.exports = roleFighter;