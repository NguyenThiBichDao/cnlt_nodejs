const express = require("express")
const path = require("path") // Thêm dòng này
const app = express()

app.use(express.static("public"))

app.get("/", (req, res) => {
    // Sử dụng path.resolve để nối đường dẫn an toàn hơn
    res.sendFile(path.resolve(__dirname, "public/index.html"))
})

app.listen(4000, () => {
    console.log("Server running at http://localhost:4000")
})