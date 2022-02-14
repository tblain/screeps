module.exports = {

    //LINK CODE
    run: function(room) {
        var terminal = room.terminal;
        // if(terminal.store[RESOURCE_ENERGY] > 50000 && terminal.cooldown == 0) {
        //     room.terminal.send()
        // }
        if(false && terminal.store[RESOURCE_ENERGY] > 50000 && terminal.cooldown == 0) {
            // console.log("je peux vendre !");
            var buyers = Game.market.getAllOrders({type: ORDER_BUY, resourceType: RESOURCE_ENERGY});
            var buyer = buyers[0];
            
            for (var i = buyers.length; i--; ) {
                if(buyers[i].price > buyer.price)
                    buyer = buyers[i];
            }
            
            if(buyer.amount > terminal.store[RESOURCE_ENERGY]) {
                var amount = terminal.store[RESOURCE_ENERGY];
            } else {
                var amount = buyer.amount;
            }
            // console.log(room.name + " " + buyer.roomName);
            var coutTransac =  Game.market.calcTransactionCost(amount, room.name, buyer.roomName);
            // console.log("cout de la transaction " + coutTransac + " amount " + amount);
            Game.market.deal(buyer.id, amount - coutTransac, room.name);
            // console.log("buyer " + buyer.price * amount);
        } else if(terminal.store[RESOURCE_ENERGY] > 10000 && terminal.cooldown == 0 && terminal.room.controller.level == 8) {
            var rooms = Game.rooms;
            for(var i in rooms) { // on lance le script pour chaque room
                if(!roomToTransfer && rooms[i].controller.level < 8)
                    var roomToTransfer = rooms[i]
                var room = rooms[i]; // on recupère la room
                // console.log("controller " + room)
                var controller = room.controller
                var rcl = controller.level;
                if(rcl < 8 && room.terminal) {
                    // console.log("name: " + room.name + " | rcl : " + rcl + " : " + room.controller.progress / room.controller.progressTotal);
                    if(false && roomToTransfer.terminal.store[RESOURCE_ENERGY] > 200000) {
                        roomToTransfer = room;  
                    } else if(rcl < 8 && room.terminal && (controller.progress / controller.progressTotal) > (roomToTransfer.controller.progress / roomToTransfer.controller.progressTotal)) {
                        if(room.terminal.store[RESOURCE_ENERGY] < 50000)
                            roomToTransfer = room;
                    }    
                }
                
            }
            if(roomToTransfer){
                if(roomToTransfer.terminal) {
                    var coutTransac =  Game.market.calcTransactionCost(terminal.store[RESOURCE_ENERGY], room.name, roomToTransfer.name);
                    // console.log(coutTransac)
                    // console.log(terminal.send(RESOURCE_ENERGY, terminal.store[RESOURCE_ENERGY] * 0.8, roomToTransfer.name));
                    terminal.send(RESOURCE_ENERGY, terminal.store[RESOURCE_ENERGY] * 0.8, roomToTransfer.name)
                    // console.log("transfert : " + (terminal.store[RESOURCE_ENERGY] - coutTransac - 5000) + " to : " + roomToTransfer.name + " : " + roomToTransfer.controller.progress / roomToTransfer.controller.progressTotal);
                }
            }
            
                
        } else if(terminal.cooldown == 0 && false) {
            // console.log("je peux vendre !");
            var sellers = Game.market.getAllOrders({type: ORDER_SELL, resourceType: RESOURCE_POWER});
            var seller = sellers[0];
            
            for (var i = sellers.length; i--; ) {
                if(sellers[i].price < seller.price)
                    seller = sellers[i];
            }
            
            var amount = Math.round(Game.market.credits / seller.price) - 1;
            // console.log("amount : " + amount);
            // console.log(room.name + " " + buyer.roomName);
            var coutTransac =  Game.market.calcTransactionCost(amount, room.name, seller.roomName);
            // console.log("cout de la transaction " + coutTransac + " amount " + amount);
            // console.log(Game.market.deal(seller.id, amount - coutTransac/seller.price, room.name) + " me coute : ");
            // console.log("buyer " + buyer.price * amount);
        }
        
        // if(terminal.store[RESOURCE_POWER] > 1000 && terminal.room.name != "E37N3") {
        //     terminal.send(RESOURCE_POWER, terminal.store[RESOURCE_POWER], "E37N3");
        // }
    }
};