const  myordermodel = require("../models/ordermodel");
const cartmodel = require("../models/cartmodel")
// Checkout function

const checkoutOrder = async (req, res) => {
    const user = req.user;
    
    try {
        // Get user's active cart items
        const cartItems = await cartmodel.find({ 
            addedBy: user._id, 
            active: true, 
            checkout: false 
        }).populate('product', 'productname price ');

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: "No items in cart to checkout" });
        }

        // Create order from cart items
        const products = cartItems.map(item => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price
        }));

        const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);

        const newOrder = new myordermodel({
            userId: user._id,
            products,
            totalAmount,
            status: 'pending'
        });

        const savedOrder = await newOrder.save();

        // Mark cart items as checked out
        await cartmodel.updateMany(
            { addedBy: user._id, active: true, checkout: false },
            { checkout: true, active: false }
        );

        res.status(201).json({ 
            message: "Checkout successful - Your order has been created",
            order: savedOrder 
        });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({ message: "Error occurred during checkout" });
    }
};


// const checkoutOrder = async (req, res) => {
//      const user = req.user


//     try {
//         const order = await myordermodel.findById(id);
//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         // Update order status to checked out
//         order.checkout = true;
//         await order.save();

//         res.status(200).json({ message: "Order checked out successfully", data: order });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(404).json({ message: "Error occurred during checkout" });
//     }
// };

module.exports = {
    checkoutOrder
 };
