const express = require("express");
const {getproduct,postproduct,addcart,getcart, getAproduct,getHome} = require("../controllers/generalcontroller")
const { protected } = require("../middlewares/authorization")
const { upload } = require("../middlewares/pictureaupload");
const router = express.Router()
 router.route("/").get(getHome);
router.route("/product").post(protected,upload, postproduct).get(getproduct)
router.route("/product/:id").get(getAproduct)
router.route('/cart/:productid').get(protected,addcart)
router.route('/cart').get(protected, getcart)

module.exports = router