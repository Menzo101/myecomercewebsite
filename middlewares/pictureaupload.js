const { productvalidate } = require("./validate");
const path = require("path");
const fs = require("fs");
const {generateUniqueName} = require("./emailmiddleware");

const upload = async (req, res, next) => {
    try {
        // Validate product data
        const { error } = productvalidate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        // Check for uploaded images
        const images = req.files?.images;
        if (!images) {
            return res.status(400).json({ message: "Please upload images" });
        }

        // Ensure images is an array and has at least 3 images
        if (!Array.isArray(images) || images.length < 3) {
            return res.status(400).json({ message: "Upload at least 3 images" });
        }

        // Validate file size and type
        let maxSize = 20 * 1024 * 1024; // 20 MB
        let  totalFileSize = 0;
        let  allowedExtensions = /png|jpeg|jpg/;

        for (const img of images) {
            const imagename  = img.name
            const ext = path.extname(img.name).toLowerCase().slice(1);
            if (!allowedExtensions.test(ext)) {
                return res.status(404).json({
                    message: `Invalid file type for ${img.name}. Only png, jpeg, and jpg are allowed.`,
                });
             }
            totalFileSize += img.size;
        }

        if (totalFileSize > maxSize) {
            return res.status(404).json({ message: "Total file size exceeds 20MB" });
        }

        // Prepare to save images
        const hostname = `${req.protocol}://${req.get("host")}`;
        const uploadDir = path.join(__dirname, "../public/uploads");

        // Create upload directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
 
        // Save images and generate URLs
        const imageArr = await Promise.all(
            images.map(async (img) => {
                const uniqueName = generateUniqueName(img.name);
                const imgPath = path.join(uploadDir, uniqueName);
                await img.mv(imgPath);
                return `${hostname}/public/uploads/${uniqueName}`;
            })
        );

        req.imagefiles = imageArr;
        next();
    } catch (error) {
        console.error("Error uploading images:", error);
        res.status(404).json({ message: "Error occurred while uploading images" });
    }
};

module.exports = { upload };

