//region Constants

const DIRECTIONS = {
    TOP: 0,
    RIGHT: 90,
    BOTTOM: 180,
    LEFT: 270
};

const COMMANDS = {
    TURN_RIGHT: 'r',
    TURN_LEFT: 'l',
    MOVE_FORWARDS: 'f'
};

//endregion

//Sorted queue
function Queue(){
    var self = this;

    this.queue = [];

    this.push = function(value){
        self.queue.unshift(value);

        self.queue.sort(function(cellA, cellB) {
            var result = cellB.path.length - cellA.path.length;
        });
    };

    this.pop = function(){
        return self.queue.pop();
    };
}

//Cell Neighbor (Edge between two cells)
function CellNeighbor(neighboar, direction){
    this.direction = direction;
    this.cell = neighboar;
}

//Grid Cell representation
function Cell(value){
    this.cellValue = value;
    this.direction = undefined;
    this.path = [];
    this.iteration = undefined;

    this.neighbors = [];
}

//Input Field
function Field(initialStr){
    var self = this;

    this.capacity = Math.sqrt(initialStr.length);
    this.cells = new Array(this.capacity);

    this.startCell = undefined;
    this.finishCell = undefined;

    for(var i = 0; i < this.capacity; i++){
        var newLine = new Array(this.capacity);

        for(var j = 0; j < this.capacity; j++){
            var currentCellValue = initialStr[i * this.capacity + j];
            newLine[j] = new Cell(initialStr[i * this.capacity + j]);

            if(currentCellValue === 'S'){
                self.startCell = newLine[j];
            } else if(currentCellValue === 'T') {
                self.finishCell = newLine[j];
            }

            if(currentCellValue !== '#') {
                if (j > 0 && newLine[j - 1].cellValue !== '#') {
                    newLine[j].neighbors.push(new CellNeighbor(newLine[j - 1], DIRECTIONS.LEFT));
                    newLine[j - 1].neighbors.push(new CellNeighbor(newLine[j], DIRECTIONS.RIGHT));
                }
                if (i > 0 && this.cells[i - 1][j].cellValue !== '#') {
                    newLine[j].neighbors.push(new CellNeighbor(this.cells[i - 1][j], DIRECTIONS.TOP));
                    this.cells[i - 1][j].neighbors.push(new CellNeighbor(newLine[j], DIRECTIONS.BOTTOM));
                }
            }
        }

        this.cells[i] = newLine;
    }
}

//Processor
function Processor(fieldForCalcs, power){
    var self = this;

    this.field = new Field(fieldForCalcs);
    this.power = power;

    this.queue = new Queue();

    //Calculate the fastest solution
    this.calculate = function(){
        self.field.startCell.iteration = 0;
        self.queue.push(self.field.startCell);

        var currentCell = self.queue.pop();

        while(currentCell && currentCell.path.length <= self.power)
        {
            var currentDirection = currentCell.direction || DIRECTIONS.TOP;
            currentCell.neighbors.forEach(function(neighbor){
                var resultedPath = self.calculateRotation(currentDirection, neighbor.direction);
                resultedPath.push(COMMANDS.MOVE_FORWARDS);
                resultedPath = currentCell.path.concat(resultedPath);

                var neighborCell = neighbor.cell;
                if(resultedPath.length <= self.power && (neighborCell.path.length === 0
                    || neighborCell.path.length > resultedPath.length)){
                    neighborCell.path = resultedPath.slice();
                    neighborCell.iteration = currentCell.iteration + 1;
                    neighborCell.direction = neighbor.direction;

                    self.queue.push(neighborCell);
                }
            });

            currentCell = self.queue.pop();
        }

        return self.field.finishCell.path;
    };

    //Calculate rotation sequence
    this.calculateRotation = function(currentDirection, targetDirection){
        const ROTATE_SEQUENCE = {
            0: [],
            90: ['l'],
            180: ['r','r'],
            270: ['r']
        };

        var resultedDegrees = (currentDirection - targetDirection + 360) % 360;

        return ROTATE_SEQUENCE[resultedDegrees];
    };
}

// test endpoint
function getCommands(field, power) {
    var processor = new Processor(field, power);
    var result = processor.calculate();
    return result;
}


//getCommands('T.S.', 10).join('') == 'f';
//getCommands('S.......T', 10).join('') == 'rffrff';
//getCommands('S.......T', 5).join('') == '';
//getCommands('S#.##...T', 20).join('') == '';
