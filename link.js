module.exports = {

    //LINK CODE
    run: function(room) {
        var links = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
        // console.log("links " + links.length);
        if(links.length > 0){
            // console.log("link existe");
            if(room.storage) {
                var linkClose = room.controller.pos.findClosestByRange(links);
                var linkFar = room.find(FIND_STRUCTURES, {
                    filter: (i) => {
                        return i.structureType == STRUCTURE_LINK && i.id != linkClose.id }});
                        
                for (var i = linkFar.length - 1; i >= 0; i--) {
                    var link = linkFar[i];
                    
                    if (link.energy > 10 && linkClose.energy < 900) {
                        // console.log("link a nrg " + linkFar);
                        link.transferEnergy(linkClose);
                    }
                }
                
            }
        }
        
    }
};