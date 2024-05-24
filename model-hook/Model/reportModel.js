const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Report = new Schema({
    productId: { type: Schema.ObjectId, ref: 'Product' },
    productRatingReviewId: { type: Schema.ObjectId, ref: 'ProductRatingReview' },
    blogCommentId:{type:Schema.ObjectId,ref:'BlogComment'},
    reportType: {
        type: String,
        enum: ['Product', 'Product Rating Review', 'Blog Comment'], 
        required: true

    },
    reason: {
        type: String,
        enum: ['Inappropriate', 'Off topic', 'Fake', 'Other'],
        required: true
    },    
    addedBy: { type: Schema.ObjectId, ref: 'User' },
    isDeleted:{type:Boolean,default:false}
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Report', Report,'Report');