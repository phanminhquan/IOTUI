import cookie from "react-cookies";
import Apis, { endpoints } from "../configs/Apis";


const DataReducer = (currentState, action) => {
    const map = new Map();
    const loaddata = async () => {
        const res = await Apis.get(endpoints.loaddata, {
            headers: {
                'Authorization': `Bearer ${cookie.load("token")}` ,
            },
        })
        console.log(res.data);
        return new Map(res.data);
    }
    switch (action.type) {
        case "reset":
            console.log(loaddata());
            return loaddata();
        default:
            return currentState;
    }


};
export default DataReducer;