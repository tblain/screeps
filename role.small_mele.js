var roleSmallMele = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var room = creep.room;
        if (!creep.memory.base_room) {
            creep.memory.base_room = room;
            creep.memory.reptimer = 0;
            creep.memory.harvesting = true;
        }
        creep.memory.reptimer = creep.memory.reptimer-1;
        // console.log("reptimer:", creep.memory.reptimer)

        var base_room = creep.memory.base_room;
        var target_room = creep.memory.room;

        if (room.name != target_room) {
            creep.say("attacking");
            const route = Game.map.findRoute(room.name, target_room)
            // console.log(room.name, " | ", target_room)
            const exit = creep.pos.findClosestByRange(route[0].exit);
            creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
        } else {

            let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
            }
                // console.log(target);
            if(target) {
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(room.controller);
            }
        }
    }
};

module.exports = roleSmallMele;