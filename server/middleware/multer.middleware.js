import multer from "multer"

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)

    }
})

export const upload=multer(
    {
        storage,
    }
)


export const removeLocalFile = (localPath) => {
    fs.unlink(localPath, (err) => {
      if (err) console.log("Error while removing local files: ", err);
      else {
        console.log("Removed local: ", localPath);
      }
    });
  };
  