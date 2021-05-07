const express = require("express");
const https = require("https");

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
        const pin = req.body.pincode;
        const date = reFormat(req.body.date);
        const url ="https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode="+pin +"&date="+date;
        
        https.get(url, (response) => {
          console.log(response.statusCode);
            if (response.statusCode != 200){
              res.sendFile(__dirname+"/error.html");
            }else{
              response.on("data", (data) => {
                const coviData = JSON.parse(data);
                const num = coviData.sessions.length;
                if ( num == 0){
                    res.sendFile(__dirname+"/noAppointment.html");
                }else{
                    let appointmentData = [];
    
                    for(let i = 0; i < num ; i++){
                      console.log(i);
                      let loot = new CreateObject(coviData,(i));
                      appointmentData.push(loot);
                    }
                    
                
                    res.write("<div style='text-align: center; margin: 0 0 2rem '><form action='/' method='get' target='_self'> <button type='submit'>Go Back</button> </form></div>");
                    for(i = 0; i < num; i++){
                      let div = "<div style='margin: 5px'> <table style='text-align: left;border: 2px solid; padding: 5px;margin: 0 auto; width: 80%'> <tr style='border: 2px solid; padding: 5px'> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>Date </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].date+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline;'>Block Name </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].blockName+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>Pincode </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].pinCode+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>State </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].state+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>Centre Name </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].centreName+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>Address </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].address+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>Vaccine</h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].vaccine+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>Capacity </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].capacity+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>Min Age Limit </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].ageLimit+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>Slots </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].slots[0]+"<br>"+appointmentData[i].slots[1]+"<br>"+appointmentData[i].slots[2]+"<br>"+appointmentData[i].slots[3]+"</h3></th> </tr> <tr> <th style='border: 2px solid; padding: 5px'><h3 style='display: inline'>fee </h3></th> <th style='border: 2px solid; padding: 5px'><h3>"+appointmentData[i].fee+"</h3></th> </tr> </table> </div>"
                      
                      res.write(div);
                    };
                    
                    res.write("<div style='text-align: center; margin: 2rem 0 0 '><form action='/' method='get' target='_self'> <button type='submit'>Go Back</button> </form></div>");
                    
                    res.end();
                }
    
                
                
                
                });
            }
          
        });
});


function reFormat(date) {
  return date.slice(8, 10) + date.slice(4, 8) + date.slice(0, 4);
}

function CreateObject(data,i){
  this.centreName = data.sessions[i].name;
  this.address = data.sessions[i].address;
  this.state = data.sessions[i].state_name;
  this.blockName = data.sessions[i].block_name;
  this.pinCode = data.sessions[i].pincode;
  this.feeType = data.sessions[i].fee_type;
  this.fee = data.sessions[i].fee;
  this.date = data.sessions[i].date;
  this.vaccine = data.sessions[i].vaccine;
  this.slots = data.sessions[i].slots;
  this.capacity = data.sessions[i].available_capacity;
  this.ageLimit = data.sessions[i].min_age_limit;
};

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
