import express from 'express'

const router = express.Router();

router.get('/hey/:name?', (req, res) => {
    const name = req.params.name
    try {
        res.json({message: `Hello ${name}!`});
    } catch (err) {
        console.error(err);
    }
})

router.get('/add/:x?/:y?', (req, res) => {
    const {x, y} = req.params;
    if (!x || !y) {
        res.status(400).json({message:'Please provide two numbers!'});
    }
    console.log(x, y)

    try {
        let sum = (Number(x) + Number(y));
        res.send( `{sum: ${sum}}` )
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

router.get('/teapot', (req, res) => {
    return true, res.status(418);
});

router.post('/teapot', async (req, res) => {
    const teapot = req.body.areYouTeapot

    if (teapot) {
        res.status(418).json({amIATeapot: 'yes'});

    } else {
        res.status(200).json({amIATeapot: 'no'});

    }
});

module.exports = router;