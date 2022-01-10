
const express = require('express')
const app = express()
const axios = require('axios');
const cors = require('cors');
const fs= require('fs')
app.use(express.json());
app.use(express.urlencoded());

//body (request)
app.use(express.json())
app.use(cors())

//view/assets
app.set("view engine", "ejs")
app.use(express.static('assets'));

//open listener port
app.listen(5000, () => {
    console.log('Port 5000')
})

//get all blog list
app.get('/', (req, res) => {
    axios.get('http://localhost:5000/blog/list')
        .then(function(response){
            // return index and passs blogs as argument (list)
            res.render('index', { blogs : response.data });
        })
        .catch(err =>{
            res.send(err);
        })

})



//delete
app.delete('/blog/delete/:id', (req, res) => {
    const id = req.params.id
    //get the existing data
    const blogId = getData()
    //filter the data to remove it
    const filterUser = blogId.filter( user => user.id !== id )
    if ( blogId.length === filterUser.length ) {
        return res.status(409).send({error: true, msg: 'id does not exist'})
    }
    //save the data
    saveData(filterUser)
    res.send({success: true, msg: 'Post removed successfully'})
    
})

//post add
app.post('/blog/add', (req, res) => {

//get data
const blogId = getData()

const blogData = req.body

//null or empty
if (blogData.title == null || blogData.id == null || blogData.description == null || blogData.blog == null) {
   return  res.status(500).send({
        message : {error: true, msg: 'Data missing'}
    });
}

//check if the blog exist already
const findExist = blogId.find( blog => blog.id === blogData.id )
if (findExist) {
    return res.status(409).send({error: true, msg: 'Id already exist'})
}
//append data
blogId.push(blogData)
//save data
saveData(blogId);

 res.redirect('/');
})



//update
app.patch('/blog/update/:id', (req, res) => {
    //get the id from url
    const id = req.params.id
    //get the update data
    const blogData = req.body
    //get the existing id
    const blogId = getData()
    //check if the id exist or not       
    const findExist = blogId.find( blog => blog.id === id )
    if (!findExist) {
        return res.status(409).send({error: true, msg: 'id not exist'})
    }
    res.send(findExist);
      //filter the data
    const uBlog = blogId.filter( blog => blog.id !== id )
    //push the updated data
    uBlog.push(blogData)
    
    //finally save it
    saveData(uBlog)
    
    res.redirect('/')
})


//save data on a json
const saveData = (data) => {
    
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('json/file.json', stringifyData)
}

//get data from json
const getData = () => {
    const jsonData = fs.readFileSync('json/file.json')
    return JSON.parse(jsonData)    
}