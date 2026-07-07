const Voice =
require("../models/voice.model");

const voiceService =
require("../service/voice.service");

const historyService =
require("../service/history.service");

const generateVoice = async (
    req,
    res
) => {

    try {

        const { text } = req.body;

        if(!text){

            return res.status(400).json({

                success:false,

                message:
                "Text is required"

            });

        }

        const audioPath =
        await voiceService.generateVoice(
            text
        );

        const voice =
        await Voice.create({

            user:req.user._id,

            text,

            audioUrl:audioPath

        });

        await historyService.saveHistory({

            user:req.user._id,

            type:"voice",

            data:{

                text,

                audioUrl:audioPath

            }

        });

        res.status(201).json({

            success:true,

            voice

        });

    } catch(error){

        console.log(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

const getAllVoices = async (
    req,
    res
) => {

    try {

        const voices =
        await Voice.find({

            user:req.user._id

        }).sort({

            createdAt:-1

        });

        res.status(200).json({

            success:true,

            voices

        });

    } catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

module.exports = {

    generateVoice,

    getAllVoices

};