const myordermodel = require("../models/ordermodel");

// Create a new order
const makeaorder = async (req, res) => {
    const { userId, products } = req.body; // Assuming products is an array of product IDs

    try {
        const newOrder = new myordermodel({
            userId,
            products,
            status: 'pending' // Default status
        });

        const savedOrder = await newOrder.save();
        res.status(201).json({ message: "Order created successfully", data: savedOrder });
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({ message: "Error occurred while creating order" });
    }
};

// Update order status
const changeorderstatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // status can be 'delivered', 'pending', or 'cancelled'

    try {
        const updatedOrder = await myordermodel.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order status updated successfully", data: updatedOrder });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Error occurred while updating order status" });
    }
};

module.exports = {makeaorder, changeorderstatus};
