var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.set("view engine", "ejs");
//app.set('views', path.join(__dirname, '/views'))
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true }));

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'XXXXXX',     // your root username
  password : 'XXXXXXX', // delete this first
  database : 'sfath_bdhtjgeh'   // the name of your db
});

app.get ("/", function (req,res) {
    res.render("home");
});
app.get ("/register", function (req,res) {
    res.render("register_teacher");
});
app.post("/register", function(req,res){
    console.log("entering POST");
     console.log("ages="+req.body.ages);
     var ages_data = req.body.ages;
    for(i=0;i<ages_data.length;i++){
        console.log("ages="+ages_data[i]);
    }
    var teacher ={
        full_name:req.body.full_name,
        email:req.body.email,
        phone:req.body.phone,
        gen_location:req.body.gen_location,
        about:req.body.about,
        residence:req.body.residence,
        ages:ages_data,
        population:req.body.population,
        exp:req.body.exp,
        work_pref:req.body.work_pref
    }
    // multiple values in single column (ages, work_pref,population, gen_location)//
    console.log("teacher.ages="+teacher.ages);
    console.log("teacher.full_name="+teacher.full_name);
    console.log("teacher.population="+teacher.population);
    console.log("teacher.work_pref="+teacher.work_pref);
    console.log("teacher.gen_location="+teacher.gen_location);
    var temp_age= JSON.stringify(teacher.ages);
    var temp_work= JSON.stringify(teacher.work_pref);
    var temp_pop= JSON.stringify(teacher.population);
    var temp_gen_loc = JSON.stringify(teacher.gen_location);
    //remove unecessary ascii //
    console.log("teacher.gen_location="+teacher.gen_location);
    var temp_ages= temp_age.replace(/[""]/g, '');
    var temp_work_pref= temp_work.replace(/[""]/g, '');
    var temp_population= temp_pop.replace(/[""]/g, '');
    var temp_gen_location= temp_gen_loc.replace(/[""]/g, '');
    
    console.log("temp_ages="+temp_ages);
    //re-insert to table
    teacher.ages = temp_ages;
    teacher.work_pref = temp_work_pref;
    teacher.population = temp_population;
    teacher.gen_location = temp_gen_location;
    console.log("2)teacher.ages="+teacher.ages);
    
     connection.query('INSERT INTO teachers_sfath SET ?', teacher, function(err, result) {
        if (err) throw err;
    
        res.render("teachers",{ teacher: result});
     });
})

app.get("/teachers", function(req,res) {
 
    connection.query('SELECT *  FROM teachers_sfath ',function(err, results){
        if (err) throw err; 
        
        res.render("teachers",{teacher: results});
    })
  
})
app.get("/search", function(req,res) {
    res.render("search");
})
app.post("/search", function(req,res){
    console.log("ENTERING POST");
    var lokation= req.body.gen_location;
    console.log("location="+ req.body.gen_location);
    console.log("lokation="+lokation);
    connection.query('SELECT * FROM teachers_sfath WHERE gen_location LIKE'+mysql.escape("%"+lokation+"%") , function(err,results){
    
          
            var what = results[0].gen_location;
            console.log("result="+what);
            console.log("results="+results+" non object="+results[0]+" location="+results[0].gen_location);
            if (err) throw err;
            console.log("location="+what);
            res.render("search_results", {location:results, area:lokation});
             
    })
})
app.get("/search_teacher", function(req,res){
    res.render("edit_search");
})
var searched_id=null;
app.post("/search_teacher", function(req,res){
    console.log("entering post");
    console.log("name="+req.body.name);
    connection.query('SELECT * FROM teachers_sfath WHERE full_name LIKE'+mysql.escape("%"+req.body.name+"%") , function(err,results){
        console.log("results="+results[0].full_name);
        console.log("id=",results[0].teacher_id);
        searched_id=results[0].teacher_id;
        res.render("edit_teacher", {name:req.body.name, teacher:results[0]});
    });
})
 function ObjectLength( object ) { // to count objects inside object such as results
        var length = 0;
        for( var key in object ) {
        if( object.hasOwnProperty(key) ) {
            ++length;
        }
        }
    return length;
}
var data=[];
var column_name="";
console.log("data length is:"+data.length);
app.post("/edit_teacher", function(req,res) {
    console.log("entering post edit");
    //console.log("the changed name is:"+req.body.full_name);
    //var updated_name=req.body.full_name;
    console.log("url="+req.body.pic_url);
    console.log("phone="+req.body.phone);
    console.log("eamil="+req.body.email);
    
    console.log("number of edited are:" +ObjectLength(req.body));
    for(var i = 0 in req.body){ 
        console.log("list of objects are:"+req.body[i]+"<<");
        if(req.body[i]==="") {console.log("in index "+i+" there is nothing");}
       else {
            data.push(req.body[i]);
            console.log("pushed into array "+i);
             if(data.length>1) {
                column_name+=", ";
             } else {
            column_name=i+" SET=\""+data[i]+"\"";
            console.log("column_name="+column_name)
        }
       }
    };
    console.log("data length is:"+data.length);
    var edit_query="UPDATE teachers_sfath "+column_name+" WHERE teacher_id="+searched_id
    data.forEach(element => console.log("elements are="+element));
    console.log("id="+searched_id);
   // for (i=0;i<data.length;i++){
      //  connection.query('UPDATE teachers_sfath SET ="'+data[i]+'" WHERE teacher_id="'+searched_id+'";'), function(err, results){
     //   console.log("updated:"+data[i]+", id="+searched_id);
        
    res.send("bukbuk");
   // }//
    
});
/*app.get("/search_results", function(req,res) {
    res.render("search_results");
})*/
app.listen(3000, function(){
    console.log("Server running on 3000");
})