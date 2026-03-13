const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title:{
       type: String, 
    }, 
    image: {
    url: String,
    public_id: String
  },

    link: {
      type: String,
      default: ""
    },

    altTag: {
      type: String,
      default: ""
    },

    position: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);