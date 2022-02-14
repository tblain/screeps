var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleHauler = require('role.hauler');
var roleTowerHauler = require('role.towerHauler');
var roleLongRangeHauler = require('role.long_range_hauler');
var roleBasicWorker = require('role.basicWorker');
var roleFighter = require('role.fighter');
var roleMiner = require('role.miner');
var roleMineHauler = require('role.mineHauler');
var rolePowerHauler = require('role.powerHauler');
var tower = require('tower');
var link = require('link');
var terminal = require('terminal');

/*----- Début du main -----*/

module.exports.loop = function () {
    for(var i in Game.rooms) { // on lance le script pour chaque room
        var room = Game.rooms[i]; // on recupère la room

        if (false || !room.memory.workers) {

            var creeps = room.find(FIND_MY_CREEPS);

            room.memory.workers = {
                workers: creeps,
                basicWorkers:_.filter(creeps, (creep) => creep.memory.role == 'basicWorkerr'),
                harvesters:_.filter(creeps, (creep) => creep.memory.role == 'harvester'),
                haulers:_.filter(creeps, (creep) => creep.memory.role == 'hauler'),
                upgraders:_.filter(creeps, (creep) => creep.memory.role == 'builder'),
                builders:_.filter(creeps, (creep) => creep.memory.role == 'upgrader'),
                towerHaulers:_.filter(creeps, (creep) => creep.memory.role == 'towerHauler'),
                LRHaulers:_.filter(creeps, (creep) => creep.memory.role == 'LRHauler'),
                powerHaulers:_.filter(creeps, (creep) => creep.memory.role == 'powerHauler'),
                mineHaulers:_.filter(creeps, (creep) => creep.memory.role == 'mineHauler'),
                miners:_.filter(creeps, (creep) => creep.memory.role == 'mine'),
                fighters:_.filter(creeps, (creep) => creep.memory.role == 'fighter')
            }
        }

        /*----- Je sais pas a quoi ca sert -----*/
        // peut etre que c'etait un debut de code pour utiliser tous les spawns d'une room
        var spawns = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN}); // on récupère le spawn associé à la room
        for (var i = 0; i < spawns.length; i++) {
            if(!spawns[i].spawning)
                spawn = spawns[i];
            
        }
        var spawn = spawns[0];
        var rcl = room.controller.level;

        /*----- On lance la gestion des tours -----*/
        if(room.find(STRUCTURE_TOWER) && rcl >= 3) {
            tower.run(room);
        }

        /*----- Je sais pas a quoi ca sert -----*/
        if(false && spawn.name == "Spawn1") {
            var str = [MOVE];
            var j = Math.floor(room.storage.store[RESOURCE_ENERGY] / 100000);
            for (var i = j; i >= 0; i--) {
                str.push(CARRY);
            }
            // console.log(str);
            console.log(Game.spawns["Spawn3"].spawnCreep( str, "test"));
        }
        
        /*----- On lance la gestion du terminal -----*/
        if(room.terminal) {
            terminal.run(room);
        }

        /*----- On lance la gestion des links -----*/
        // if(room.name != "E39N7")
            link.run(room);
        
        /*----- Petit bout de code pour aller claim une room -----*/
        var claimer = Game.creeps["claimer"];
        if(claimer) {
            var controller = Game.getObjectById("59f1a5a782100e1594f3eda9");
            if(true || controller) {
                console.log("controller " + claimer.room.name);
                if(claimer.room.name == "E38N3")
                    claimer.moveTo(9, 0, {visualizePathStyle: {stroke: '#ffaa00'}});
                else {
                if(claimer.claimController(controller) == ERR_NOT_IN_RANGE)
                    claimer.moveTo(controller, {visualizePathStyle: {stroke: '#ffaa00'}});    
                }
                
            }
         } else if(!Game.rooms["E38N2"]) {
        //     Game.spawns["Spawn10"].spawnCreep( [MOVE, MOVE, CLAIM], "claimer", { memory: { role: 'claimer'} });
         }
         
        // Game.spawns["Spawn6"].spawnCreep(  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK], "invader1", { memory: { role: 'fighter'} });
        // Game.spawns["Spawn8"].spawnCreep(  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], "invader6", { memory: { role: 'fighter'} });
        // Game.spawns["Spawn8"].spawnCreep(  [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK], "invader6", { memory: { role: 'fighter'} });

        /*----- Gestion des raids -----*/
        var hostiles = room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            var fighters = _.filter(Game.creeps, (creep) => creep.memory.role == 'fighter');
            if(fighters.length < hostiles.length) {
                var newName = 'fighter' + Game.time;
                // if((spawn.spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], newName, { memory: { role: 'fighter' } }))  == ERR_NOT_ENOUGH_ENERGY) {
                //     spawn.spawnCreep( [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], newName, { memory: { role: 'fighter' } });
                // }
                
            }
        }
        
        /*----- On supprime de la mèmoire les creeps morts -----*/

        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                // il faut aussi delete le creep de la memoire de la room
                var creep = Memory.creeps[name];
                var creep_role = creep.role + "s";
                for (var i = room.memory.workers[creep_role].length - 1; i >= 0; i--) {
                    try {
                    // comme c'est de la merde je dois faire comme ca pour savoir si le creep
                    var nondef = room.memory.workers[creep_role][i].role == undefined;
                    } catch (e) {}
                    if (nondef) { room.memory.workers[creep_role].splice(i, 1) }
                }
                
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

        /*----- Récupération de la quantité de creep de chaque role -----*/

        var creeps = room.find(FIND_MY_CREEPS);
        
        var harvesters = _.filter(creeps, (creep) => creep.memory.role == 'harvester');
        if(!nbHarvesters) {
             nbHarvesters = harvesters.length;
             room.memory.nbHarvesters = nbHarvesters;
        }
        
        var builders = _.filter(creeps, (creep) => creep.memory.role == 'builder');
        var nbBuilders = Game.getObjectById(room.memory.nbBuilders);
        if(!nbBuilders) {
             nbBuilders = builders.length;
             room.memory.nbBuilders = nbBuilders;
        }
        
        var upgraders = _.filter(creeps, (creep) => creep.memory.role == 'upgrader');
        var nbUpgraders = Game.getObjectById(room.memory.nbUpgraders);
        if(!nbUpgraders) {
             nbUpgraders = upgraders.length;
             room.memory.nbUpgraders = nbUpgraders;
        }
        
        var haulers = _.filter(creeps, (creep) => creep.memory.role == 'hauler');
        var nbHaulers = Game.getObjectById(room.memory.nbHaulers);
        if(!nbHaulers) {
             nbHaulers = haulers.length;
             room.memory.nbHaulers = nbHaulers;
        }
        
        var towerHaulers = _.filter(creeps, (creep) => creep.memory.role == 'towerHauler');
        var nbTowerHaulers = Game.getObjectById(room.memory.nbTowerHaulers);
        if(!nbTowerHaulers) {
             nbTowerHaulers = towerHaulers.length;
             room.memory.nbTowerHaulers = nbTowerHaulers;
        }

        var LRHaulers = _.filter(creeps, (creep) => creep.memory.role == 'longRangeHauler');
        var nbLRHaulers = Game.getObjectById(room.memory.nbLRHaulers);
        if(!nbLRHaulers) {
             nbLRHaulers = LRHaulers.length;
             room.memory.nbLRHaulers = nbLRHaulers;
        }
        
        var basicWorkers = _.filter(creeps, (creep) => creep.memory.role == 'basicWorker');
        var nbBasicWorkers = Game.getObjectById(room.memory.nbBasicWorkers);
        if(!nbBasicWorkers) {
             nbBasicWorkers = basicWorkers.length;
             room.memory.nbBasicWorkers = nbBasicWorkers;
        }
        
        var miners = _.filter(creeps, (creep) => creep.memory.role == 'miner');
        var nbMiners = Game.getObjectById(room.memory.nbMiners);
        if(!nbMiners) {
             nbMiners = miners.length;
             room.memory.nbMiners = nbMiners;
        }
        
        var mineHaulers = _.filter(creeps, (creep) => creep.memory.role == 'mineHauler');
        var nbHaulers = Game.getObjectById(room.memory.nbHaulers);
        if(!nbHaulers) {
             nbHaulers = haulers.length;
             room.memory.nbHaulers = nbHaulers;
        }

        var workers = _.filter(creeps, (creep) => true);
        var nbWorkers = Game.getObjectById(room.memory.nbWorkers);
        if(!nbWorkers) {
             nbWorkers = workers.length;
             room.memory.nbWorkers = nbWorkers;
        }
        
        var containers = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTAINER});

        /*----- spawn des creeps -----*/
        if(spawn) {
            if(false){
    
            } else if(workers.length < 2 | ((rcl < 5 || !room.storage) && workers.length < 7)) { //false && harvesters.length < room.find(FIND_SOURCES).length) {
                // un basicWorker est un creep qui peut tout faire, tres utile dans les premiers RCL où j'ai pas encore d'organisation de creeps (harvesters, haulers, upgraders, etc)
                // ensuite ils comblent les effectifs des creeps rolés jusqu'a 7 creeps
                // et surtout le but est que des fois il y a des pbs et les creeps meurts ou alors il manque des roles qui font que la room fonctionne plus bien
                // ducoup les basics arrivent et comme ils savent tout faire, ca permet de remettre la room dans le bon chemin

                var newName = 'worker' + Game.time;
                spawn.spawnCreep( [WORK,WORK, MOVE, CARRY], newName, { memory: { role: 'basicWorker'} });
    
            } else if(haulers.length < room.find(FIND_SOURCES).length && haulers.length < containers.length && haulers.length < harvesters.length) { //  && haulers.length < harvesters.length
                var newName = 'Hauler' + Game.time;
                if((spawn.spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, { memory: { role: 'hauler' ,  room: room.id} }) ) == ERR_NOT_ENOUGH_ENERGY) {
                    spawn.spawnCreep( [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], newName, { memory: { role: 'hauler' ,  room: room.id } });
                }
    
            } else if(((rcl >= 3 && towerHaulers.length < 1) || (rcl == 8 && towerHaulers.length < 1)) && room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER}).length > 0) {
                var newName = 'TowerHauler' + Game.time;
                var body = [CARRY, CARRY, CARRY, CARRY, CARRY,CARRY, CARRY, MOVE, MOVE];
                if(rcl > 5)
                    body.push(MOVE, CARRY, CARRY, CARRY)
                if(rcl > 6)
                    body.push(MOVE, CARRY, CARRY, CARRY);
                spawn.spawnCreep(body , newName, { memory: { role: 'towerHauler' ,  room: room.id } });
    
            } else if(harvesters.length < room.find(FIND_SOURCES).length && harvesters.length < containers.length) {
                // console.log(spawn + " " + "aucun creeps");
                // console.log("teststt");
                var newName = 'Harvester' + Game.time;
                if(rcl > 4) {
                    spawn.spawnCreep( [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK], newName, { memory: { role: 'harvester' ,test: "test",  room: room.id } });
                } else if (rcl > 2) {
                    spawn.spawnCreep( [MOVE, WORK, WORK, WORK, WORK, WORK], newName, { memory: { role: 'harvester' ,  room: room.id } });
                } else {
                    spawn.spawnCreep( [MOVE, WORK, WORK], newName, { memory: { role: 'harvester' ,  room: room.id } });
                }
    
            } else if(builders.length < 2 && room.find(FIND_CONSTRUCTION_SITES).length > 0) { //  (Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES
                // Game.spawns["Spawn2"].spawnCreep( [MOVE, MOVE, MOVE, MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], "builder2", { memory: { role: 'builder'} })
                // Game.spawns["Spawn34"].spawnCreep( [MOVE, MOVE,MOVE,MOVE,WORK,CARRY,CARRY,CARRY], "builder1", { memory: { role: 'builder'} })
                var newName = 'Builder' + Game.time;
                if((spawn.spawnCreep( [MOVE, MOVE, MOVE, MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, { memory: { role: 'builder'} })) == ERR_NOT_ENOUGH_ENERGY) {
                    spawn.spawnCreep( [MOVE,WORK,WORK, CARRY], newName, { memory: { role: 'builder' ,  room: room.id } });
                }
                // console.log("bukler")
    
            } else if(upgraders.length < 1 || (upgraders.length < 4 && rcl < 4) || (upgraders.length < 8 && rcl < 8)) {
                var newName = 'Upgrader' + spawn + Game.time;
                var body = [MOVE,WORK, WORK, CARRY, CARRY, CARRY];
                
                if(room.storage) {
                    var l = Math.floor(room.storage.store[RESOURCE_ENERGY] / 15000);
                    console.log("l " + l + " | " + room.name)
                    var cost = 550;
                    
                    max = 15;
                    if(rcl == 8 && l > max)
                        l = max;
                        
                    if( l > 50)
                        l = 50
                    
                        // console.log("spawn " + spawn)
                    for (var i = l; i > 0 && l > 6 && cost + 150 < room.energyAvailable; i--) {
                        body.push(WORK);
                        cost += 100;
                        l--;
                        if(i % 7 == 0 && l > 0) {
                            body.push(MOVE);
                            cost += 50;
                            l--;
                        } else if(i % 6 == 0 && l > 0) {
                            body.push(CARRY);
                            cost += 50;
                            l--;
                        }
                    }
                }
                    // console.log("cost : " + cost + " capacity " + room.energyAvailable);
                // console.log("body " + body.length + " | l " + l)
                // console.log(spawn.spawnCreep(body, newName, { memory: { role: 'upgrader' ,  room: room.id } }));
                spawn.spawnCreep(body, newName, { memory: { role: 'upgrader'} });
                
                // // console.log("testsetd" + room.name);
                // if((spawn.spawnCreep( [MOVE,MOVE,MOVE,WORK,WORK, WORK, WORK, WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY], newName, { memory: { role: 'upgrader' ,  room: room.id } })) == ERR_NOT_ENOUGH_ENERGY) {
                // // if((spawn.spawnCreep( [MOVE, MOVE, MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, { memory: { role: 'upgrader' ,  room: room.id } })) == ERR_NOT_ENOUGH_ENERGY) {
                //     spawn.spawnCreep([MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY], newName, { memory: { role: 'upgrader' ,  room: room.id } });
                // }
                
            } else if (false) { // (room.name == "E38N3" || room.name == "E39N4") {
                var body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
                var newName = 'LRHauler_'+ room.name + "_" + Game.time;
                spawn.spawnCreep( body, newName, { memory: { role: 'LRHauler' ,  room: room.id } });

            } else if(rcl >= 6 && miners.length < 1 && room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTRACTOR}).length > 0) {
                var newName = 'miner' + Game.time;
                // spawn.spawnCreep( [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'miner' ,  room: room.id } });
    
            } else if(rcl >= 6 && mineHaulers.length < 1 && room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTRACTOR}).length > 0) {
                var newName = 'mineHauler' + Game.time;
                // spawn.spawnCreep( [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'mineHauler' ,  room: room.id } });
            }
        
        /*----- Affichage du creep en construction sur le spawn -----*/

            if(spawn.spawning) {
                var spawningCreep = Game.creeps[spawn.spawning.name];
                // console.log(spawn.spawning.name);
                // console.log(spawningCreep);
                // room.visual.text(
                //     '🛠️' + spawningCreep.memory.role
                //     ,
                //     spawn.pos.x + 1,
                //     spawn.pos.y,
                //     {align: 'left', opacity: 0.8});
            }
        }
        /*----- Assignement des taches des creeps par rapport à leur role -----*/

        for(var name in creeps) {
            var creep = creeps[name];
            var role = creep.memory.role;

            switch (role) {
                case 'harvester':
                    roleHarvester.run(creep);
                    break;

                case 'upgrader':
                    roleUpgrader.run(creep);
                    break;

                case 'builder':
                    roleBuilder.run(creep);
                    break;

                case 'hauler':
                    roleHauler.run(creep);
                    break;

                case 'towerHauler':
                    roleTowerHauler.run(creep);
                    break;

                case 'basicWorker':
                    roleBasicWorker.run(creep);
                    break;
                
                case 'fighter':
                    roleFighter.run(creep);
                    break;

                case 'miner':
                    roleMiner.run(creep);
                    break;

                case 'mineHauler':
                    roleMineHauler.run(creep);
                    break;
                
                case 'powerHauler':
                    rolePowerHauler.run(creep);
                    break;

                case 'longRangeHauler':
                    roleLongRangeHauler.run(creep);
                    break;
                
                default:
                    break;
            }
        }
    }
}