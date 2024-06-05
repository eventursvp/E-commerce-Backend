const Faq = require("model-hook/Model/faqModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require("mongoose");
const { createApplicationLog } = require("model-hook/common_function/createLog");


exports.createFaq = async(req,res)=>{
    try {
        const { name, faqs, addedBy } = req.body;

       
        const { loginUser } = req;
        if (loginUser._id != addedBy) {
            return res.status(401).send({ message: "Unauthorized access."});
        }

        if (!(loginUser?.role === "Admin")) {
            return res.status(403).send({ status: 0, message: "Unauthorized access."});
        }

        if(!(name && faqs && addedBy)){
            return res.status(403).send({ status:0,message: 'All fields are required' });

        }
        if(!mongoose.Types.ObjectId.isValid(addedBy)){
            return res.status(401).send({ status:0,message: 'Invalid request' });

        }

        if (!Array.isArray(faqs) || faqs.length === 0) {
            return res.status(400).send({ message: 'FAQs array is required and must not be empty' });
        }

        const faqsValid = faqs.every(faq => faq.question && faq.answer);
        if (!faqsValid) {
            return res.status(400).json({ message: 'Each FAQ must have both question and answer fields' });
        }

        const exist = await Faq.findOne({  name: name, isDeleted: false});
        if (exist) {
            return res.status(409).send({status:0,message:"Record already exist",data:[]})
        }

        const faq = {
            name:name,
            faqs:faqs,
            addedBy:addedBy
        }

        const data = await new Faq(faq).save();

        if(!data){
            return res.status(404).send({status:0,message:"Error in creating faq",data:[]});
        }

        await createApplicationLog("Faq", "create faq", {}, {}, addedBy);

        return res.status(201).send({status:1,message:"Record added successfully!",data:data})

    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });   
    }
}