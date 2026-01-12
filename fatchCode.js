async function getDirection(){
    try{
        const response = await fetch("http://192.168.4.1:8080/");
        const direction = await response.text();
        console.log("ESP32 SAIS:", direction);
        /*switch (direction){
            case "U": return {dx:0,dy:-1};
            case "D": return {dx:0,dy:1};
            case "R": return {dx:-1,dy:0};
            case "L": return {dx:1,dy:0};
            default: return null;
        }*/
    }catch (error){
        console.error("CONNCTION ERROR: ", error);
        return null;
    }
}
setInterval(getDirection, 200);