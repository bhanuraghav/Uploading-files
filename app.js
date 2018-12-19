const  express= require('express');
const  multer= require('multer');
const  ejs= require('ejs');
const  path= require('path');

const app = express();
const port = 3000 || process.env.PORT;

//Set Storage Engine

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename : function(req,file,callback){
        callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

//Init Upload
const upload = multer({
    storage: storage,
    limits : {fileSize : 1000000 },
    fileFilter : function(req,file,callback){
        checkFileType(file,callback);
    }
}).single('image');

//Check File Type
function checkFileType(file,callback){
    //Allowed Extn.
    const filetypes = /jpeg|jpg|png|gif/;

    //Check Extn.
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    //Check Mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return callback(null,true);
    }else{
        callback('Error : Only Images Allowed');
    }

}

//EJS Setup
app.set('view engine','ejs');

//Public Static
app.use(express.static( './public'));

app.get('/',(req,res)=>{
    res.render('index');
})

app.post('/upload',(req,res)=>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
                msg: 'Error : No file selected'
            });
        }
        else{
    
            if(req.file == undefined){
                res.render('index', {
                  msg: 'Error: No File Selected!'
                });
            } else {

                res.render('index', {
                  msg: 'File Uploaded!',
                  file: `uploads/${req.file.filename}`
              });
            }
        }
    })
})

app.listen(port,()=> console.log(`Server Started on port ${port}`));
