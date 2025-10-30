import multer, { diskStorage } from "multer";
const storage = multer.memoryStorage()
const upload = multer({storage})

export default upload