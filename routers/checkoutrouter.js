const  express = require ("express")
const {protected,checkuser} = require("../middlewares/authorization")
const {checkoutOrder} = require("../controllers/checkoutcontroller")
const router = express.Router()

router.route('/checkout').post(protected,checkoutOrder)
 module.exports = router