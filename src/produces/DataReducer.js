const DataReducer = (currentState, action) => {
    const map = new Map();
    
    switch (action.type) {
        case "reset":
            map.set("a",[Math.random(),Math.random(),Math.random()]);
            console.log(map)
            return map;
        default:
            return currentState;
    }


};
export default DataReducer;