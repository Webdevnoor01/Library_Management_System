const router = require("express").Router()


router.get("/health",(req, res, next) =>{
    res.status(200).send()
})

router.use(require("../routes/index"))

module.exports = router