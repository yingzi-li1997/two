const express = require("express");
const app = express();
const url = require("url");
let body_parser=require("body-parser")
app.use(body_parser.urlencoded({
    extended: false
}))
// 跨域
// cros跨域
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});
// 操作数据库_
let mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/user", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("连接数据库成功");
  })
  .catch((err) => {
    console.log(err);
  });
// 设定列表集合规则
const studentSchema = new mongoose.Schema({
  username:String,
  password:String,
  email:String,
  phone:String
});
// 创建集合
let student = mongoose.model("student", studentSchema);
// 增加用户接口
app.get("/add",(req,res)=>{
  student.create(req.query).then(data=>{
    data?res.send({status:1,msg:'增加成功'}):res.send({status:0,msg:'增加失败'})
  })
})
// 渲染接口
app.get("/show",(req,res)=>{
  student.find().then(data=>{
    res.send(data)
  })
})
// 删除接口
app.post("/del",(req,res)=>{
  student.findOneAndDelete({_id:req.body.id}).then(data=>{
    data?res.send({status:1,msg:'删除成功'}):res.send({status:0,msg:'删除失败'})
  })
})
// 修改反显接口
app.get("/editshow",(req,res)=>{
  student.find({_id:req.query.id}).then(data=>{
    res.send(data)
  })
})
// 确认修改接口
app.get("/confirmedit",(req,res)=>{
  student.updateOne({_id:req.query.id},{email:req.query.email,phone:req.query.phone}).then(data=>{
    data.ok==1?res.send({status:1,msg:'修改成功'}):res.send({status:0,msg:'修改失败'})
  })
})
app.listen("8080", () => {
  console.log("欢迎访问8080服务器");
});
