const Faq = require("model-hook/Model/faqModel");
const Admin = require("model-hook/Model/adminModel");
const mongoose = require("mongoose");

exports.getAllFaqs = async(req,res)=>{
    try {
        const{addedBy} = req.body

          // const { loginUser } = req;
        // if (loginUser?.data?._id != addedBy) {
        //     return res.status(401).send({ message: "Unauthorized access." });
        // }


        if(!addedBy){
            return res.status(409).send({status:0,message:"All fields are required"})
        }
        if (
            !
                mongoose.Types.ObjectId.isValid(addedBy)
        ) {
            return res.status(403).send({ status: 0, message: "Invalid request" });
        }

        const data = await Faq.find({
            isDeleted: false,
        });

        if (!data || data.length === 0) {
            return res.status(404).send({
                status: 0,
                message: "Record not found",
                data: [],
            });
        }

        return res.status(200).send({
            status: 1,
            message: "Record fetched successfull",
            data: data,
        });
        
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });   
    }
};

exports.getSingleFaq = async(req,res) => {
    try {
        const{addedBy,faqId} = req.body

        // const { loginUser } = req;
      // if (loginUser?.data?._id != addedBy) {
      //     return res.status(401).send({ message: "Unauthorized access." });
      // }

      if(!(addedBy && faqId)){
        return res.status(409).send({status:0,message:"All fields are required"})
    }

      if (
          !
              mongoose.Types.ObjectId.isValid(addedBy)
      ) {
          return res.status(403).send({ status: 0, message: "Invalid request" });
      }

      const data = await Faq.findOne({
        _id:faqId,
          isDeleted: false,
          addedBy:addedBy
      });

      if (!data) {
          return res.status(404).send({
              status: 0,
              message: "Record not found",
              data: [],
          });
      }

      return res.status(200).send({
          status: 1,
          message: "Record fetched successfull",
          data: data,
      });
    } catch (error) {
        console.log("Catch Error:==>", error);
        return res.status(500).send({
            status: 0,
            message: "Internal Server Error",
            data: [],
        });   
    }
}