const express = require("express")
const {protected,checkuser} = require("../middlewares/authorization");
const {makeaorder, changeorderstatus} = require("../controllers/ordercontroller")

const router = express.Router();

router.route('/createorder').post(protected,makeaorder);
router.route('/orders/:id').patch(protected, changeorderstatus);

module.exports = router;