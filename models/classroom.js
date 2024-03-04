const mongo=require("mongoose")
const Schema=mongo.Schema

const classroom = new Schema({
    name:String,
    nbEtudiant:Number,
    salle:Number,
})
module.exports=mongo.model("classroom", classroom )

