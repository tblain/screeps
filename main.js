var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHauler = require('role.hauler');
var roleTowerHauler = require('role.towerHauler');
var roleBasicWorker = require('role.basicWorker');
var roleFighter = require('role.fighter');
var tower = require('tower');
var link = require('link');


module.exports.loop = function () {
    for(var i in Game.rooms){
        var room = Game.rooms[i];
        var spawn = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN})[0];
        // console.log("spawn " + spawn.creeps);
        if(room.find(STRUCTURE_TOWER)) {
            tower.run(room);
        }
        
        link.run(room);
        
        if(false) {
            var claimer = Game.creeps["claimer1"];
            //console.log("controller " + Game.rooms["E38N3"].controller);
            var controlleur = Game.getObjectById("59f1a59782100e1594f3ec1a");
            // console.log(claimer.claimController(controlleur));
             if(!(claimer.claimController(controlleur) == ERR_NOT_IN_RANGE)) {
                //  console.log("test");
                //  claimer.moveTo(49, 22, {visualizePathStyle: {stroke: '#ffaa00'}});
             } else {
                 claimer.moveTo(controlleur, {visualizePathStyle: {stroke: '#ffaa00'}});
             }
         }
        
            var hostiles = room.find(FIND_HOSTILE_CREEPS);
            if(hostiles.length > 0) {
                var fighters = _.filter(Game.creeps, (creep) => creep.memory.role == 'fighter');
                if(fighters.length < hostiles.length) {
                    var newName = 'fighter' + Game.time;
                    spawn.spawnCreep( [MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK]
                                                    , newName, { memory: { role: 'fighter' } });
                }
            }
        
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Death of ', name);
            }
        }
    
        
        /*
        BODYPART_COST: {
            "move": 50,
            "work": 100,
            "attack": 80,
            "carry": 50,
            "heal": 250,
            "ranged_attack": 150,
            "tough": 10,
            "claim": 600
        },
        */
        var creeps = room.find(FIND_MY_CREEPS);
        
        var harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
        // console.log('Harvesters: ' + harvesters.length);
        
        var builders = _.filter(creeps, (creep) => creep.memory.role == 'builder');
        // console.log('Builders: ' + builders.length);
        
        var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
        // console.log('Upgraders: ' + upgraders.length);
        
        var repairers = _.filter(creeps, (creep) => creep.memory.role == 'repairer');
        
        var haulers = _.filter(creeps, (creep) => creep.memory.role == 'hauler');
    
        var towerHaulers = _.filter(creeps, (creep) => creep.memory.role == 'towerHauler');
        var basicWorkers = _.filter(creeps, (creep) => creep.memory.role == 'basicWorker');
        
        
        var workers = _.filter(creeps, (creep) => true);
        
        if(false){

        } else if(basicWorkers.length < 3) { //false && harvesters.length < room.find(FIND_SOURCES).length) {
            console.log(spawn + " " + "aucun creeps");
            var newName = 'worker' + Game.time;
            spawn.spawnCreep( [WORK,WORK, MOVE, CARRY], newName, { memory: { role: 'basicWorker'} });
            // console.log(spawn + " " + spawn.spawnCreep( [WORK, MOVE, CARRY], newName, { memory: { role: 'basicWorker'} }));
        } else if(haulers.length < room.find(FIND_SOURCES).length && haulers.length < harvesters.length) {
            var newName = 'Hauler' + Game.time;
            if((spawn.spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, { memory: { role: 'hauler' ,  room: room.id} }) ) == ERR_NOT_ENOUGH_ENERGY) {
                spawn.spawnCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], newName, { memory: { role: 'hauler' ,  room: room.id } });
            }
        } else if(towerHaulers.length < 1 && room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER && s.energy > 0}).length > 0) {
            var newName = 'TowerHauler' + Game.time;
            spawn.spawnCreep( [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE], newName, { memory: { role: 'towerHauler' ,  room: room.id } });
        } else if(harvesters.length < room.find(FIND_SOURCES).length && room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}}).length > 0) {
            var newName = 'Harvester' + Game.time;//
            // memory.
            if(spawn.spawnCreep( [MOVE,WORK,WORK,WORK,WORK,WORK,WORK, WORK], newName, { memory: { role: 'harvester' ,  room: room.id } }) == ERR_NOT_ENOUGH_ENERGY) {
                spawn.spawnCreep( [MOVE, WORK, WORK, CARRY], newName, { memory: { role: 'harvester' ,  room: room.id } });
            }
        } else if(builders.length < 2 && room.find(FIND_CONSTRUCTION_SITES).length > 0) { //  (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES
            var newName = 'Builder' + Game.time;
            if((spawn.spawnCreep( [MOVE, MOVE, MOVE, MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, { memory: { role: 'builder'} })) == ERR_NOT_ENOUGH_ENERGY) {
                spawn.spawnCreep( [MOVE, WORK, CARRY, CARRY, CARRY], newName, { memory: { role: 'builder' ,  room: room.id } });
            }
        } else if(upgraders.length < 1 ) {
            var newName = 'Upgrader' + Game.time;
            if((spawn.spawnCreep( [MOVE, MOVE, MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, { memory: { role: 'upgrader' ,  room: room.id } })) == ERR_NOT_ENOUGH_ENERGY) {
                spawn.spawnCreep( [MOVE, WORK, WORK, CARRY, CARRY], newName, { memory: { role: 'upgrader' ,  room: room.id } });
            }
        }
    
        if(spawn.spawning) {
            var spawningCreep = creeps[spawn.spawning.name];
            // console.log(spawn.spawning.name);
            //console.log(spawningCreep);
            room.visual.text(
                '🛠️'// + spawningCreep.memory.role
                ,
                spawn.pos.x + 1,
                spawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
        // console.log(creeps);
        for(var name in creeps) {
            var creep = creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
                // console.log("attribution des roles");
            }
            
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
            
            if(creep.memory.role == 'builder') {
                // if(creep.room.find(FIND_CONSTRUCTION_SITES).length > 0 ) {
                    roleBuilder.run(creep);
                // } else {
                    // console.log("rien à construire" + creep.room.find(FIND_CONSTRUCTION_SITES).length);
                    // creep.memory.role = 'upgrader';
                // }  
            }
            
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            
            if(creep.memory.role == 'hauler') {
                roleHauler.run(creep);
            }
            
            if(creep.memory.role == 'towerHauler') {
                roleTowerHauler.run(creep);
            }
            
            if(creep.memory.role == 'basicWorker') {
                roleBasicWorker.run(creep);
            }
            
            if(creep.memory.role == 'fighter') {
                roleFighter.run(creep);
            }
        }
    }
}