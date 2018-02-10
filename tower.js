module.exports = {

    //TOWER CODE
    run: function(room) {
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        var towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

        //if there are hostiles - attakc them    
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${room}`);
            towers.forEach(tower => tower.attack(hostiles[0])) ;
            // console.log("ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ALERT!!!! WE ARE UNDER ATTACK!!!!! ");
        }

        //if there are no hostiles....
        if(hostiles.length === 0) {
            //....first heal any damaged creeps
            for (let name in Game.creeps) {
                // get the creep object
                var creep = Game.creeps[name];
                if (creep.hits < creep.hitsMax) {
                    towers.forEach(tower => tower.heal(creep));
                    console.log("Tower is healing Creeps.");
                }
            }        
        
           for(var i in towers){
               var tower = towers[i];
                //...repair Buildings! :) But ONLY until HALF the energy of the tower is gone.
                //Because we don't want to be exposed if something shows up at our door :)
                if(tower.energy > (tower.energyCapacity / 3)){
                    //Find the closest damaged Structure
                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.hits < (s.hitsMax - 1700) && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART});
    	            if(closestDamagedStructure) {
    	 	            tower.repair(closestDamagedStructure);
    	 	         //   console.log("The tower is repairing buildings.");
                    } else if(tower.room.storage.store[RESOURCE_ENERGY] > tower.room.storage.storeCapacity / 2000){
                        var damagedStructures = tower.room.find(FIND_STRUCTURES, {filter: (s) => s.hits < 1000000 && (s.structureType == STRUCTURE_WALL | s.structureType == STRUCTURE_RAMPART)});
                        var damagedStructure = damagedStructures[0];
                        for(var i in damagedStructures) {
                            var structure = damagedStructures[i];
                            if(structure.hits < damagedStructure.hits) {
                                damagedStructure = structure;
                                // console.log("min " + damagedStructure);
                            }
                        }
                        if(damagedStructure) {
    	 	                tower.repair(damagedStructure);
                        }
                    }
                }
            }
            
        }
    }
};