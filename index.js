const express=require("express")
const app=express()

const path=require("path")
const http=require("http")
const {Server}=require("socket.io")

const server=http.createServer(app)

const io=new Server(server)
app.use(express.static(path.resolve("")))

let arr=[]
let playingArray=[]
let queue=[];

const PORT = 3000;

io.on("connection",(socket)=>{

    socket.on("find",(e)=>{

        if(e.name!=null){
    
            // Push the player name and socket id to the queue
            queue.push({name: e.name, id: socket.id});
    
            // Check if there are at least two players in the queue
            if(queue.length>=2){
    
                // Pop the first two players from the queue
                let p1 = queue.shift();
                let p2 = queue.shift();
    
                // Create the game object with the players' names, values, and moves
                let obj={
                    p1: {
                        p1name: p1.name,
                        p1value: "X",
                        p1move: ""
                    },
                    p2: {
                        p2name: p2.name,
                        p2value: "O",
                        p2move: ""
                    },
                    sum: 1
                };
    
                // Push the game object to the playing array
                playingArray.push(obj);
    
                // Emit the find event to the two players with their socket ids
                io.to(p1.id).to(p2.id).emit("find",{allPlayers:playingArray});
    
            }
    
        }
    
    });

    socket.on("playing",(e)=>{
        if(e.value=="X"){
            let objToChange=playingArray.find(obj=>obj.p1.p1name===e.name)

            objToChange.p1.p1move=e.id
            objToChange.sum++
        }
        else if(e.value=="O"){
            let objToChange=playingArray.find(obj=>obj.p2.p2name===e.name)

            objToChange.p2.p2move=e.id
            objToChange.sum++
        }
      
        io.emit("playing",{allPlayers:playingArray})

    })

    socket.on("gameOver",(e)=>{
        playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
        console.log(playingArray)
    })


})




app.get("/",(req,res)=>{
    return res.sendFile("index.html")
})

server.listen(3000,()=>{
    console.log("port connected to 3000")
})