import tinyurl from 'tinyurl-api';
import { config } from 'dotenv';
import express,{Request,Response} from 'express';
import multer from 'multer';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { rename } from 'fs';
import cors from 'cors';
    
const __dirname = dirname(fileURLToPath(import.meta.url));


//Initialise dontenv
config()

//multer setup
const upload=multer({dest:'./uploads'})



const app=express()

app.use(cors())

app.post('/',upload.single('genURL'),async(req:Request,res:Response)=>{
    try{
        
        const files=req.file;
        let typeOfFile:any=files?.originalname.split('.')
        let destURL;
        if(typeOfFile&&typeOfFile.length>1){
            console.log(typeOfFile[1])
            const url=resolve(__dirname,"../","uploads",`${files?.filename}`);
            console.log(url);
            rename(url,`${url}.${typeOfFile[1]}`,(e)=>{
                if(e===null){
                    destURL=`${url}.${typeOfFile[1]}`;
                }
            })
        }else{
            throw new Error("Type of file is Undefined (Note file should contain . followed by its type)")
        }
        const finalURL=`${process.env.RUNTIME}/uploads/${files?.filename}.${typeOfFile[1]}`

        const finalTinyURL=await tinyurl(finalURL);

        res.json({"data":finalTinyURL})

    }catch(e){
        console.log(e)
        res.status(400).json({"Error":e})
    }
})

app.get('/uploads/:id',(req:Request,res:Response)=>{
    try{
    const id=req.params.id;
    const url=resolve(__dirname,"../","uploads",`${id}`)
    res.sendFile(url);
    }catch(e){
        res.status(400).json({"Error":e})
    }
})

const PORT=process.env.PORT

app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`)
})
