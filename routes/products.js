let fs = require('fs')

let express = require('express')
let router = express.Router()
let uniqid = require('uniqid')

router.get('/', (req, res) => {
    res.render('products', { products: getAll('products')})
})


router.route('/create')
    .get((req, res) => {
        res.render('create-product', { modules: getAll('modules')})
    })
    .post((req, res) => {
        let products = getAll('products')
        
        products.push({
            id: uniqid(),
            fullname: req.body.fullname,
            age: req.body.age,
            module: req.body.module
        })

        saveAll('products', products)
        
        res.redirect('/products')
    })


router.delete('/delete', (req, res) => {
    
    let products = getAll('products')

    let filteredProducts = products.filter(product => product.id != req.body.id)

    saveAll('products', filteredProducts)

    res.json({ deleted: true })
})


router.route('/update/:id')
    .get((req, res) => {
        let id = req.params.id
        let product = getAll('products').find(product => product.id == id)
        res.render('create-product', { product: product, modules: getAll('modules') })
    })
    .put((req, res) => {
        let id = req.params.id

        let products = getAll('products')

        let product = products.find(product => product.id == id)

        let idx = products.indexOf(product)

        products[idx].fullname = req.body.data.fullname
        products[idx].age = req.body.data.age
        products[idx].module = req.body.data.module

        saveAll('products', products)

        res.json({ updated: true })
    })



module.exports = router



function  getAll(collection) {
    return JSON.parse(fs.readFileSync(`./data/${collection}.json`))
}

function saveAll(collection, data) {
    fs.writeFileSync(`./data/${collection}.json`, JSON.stringify(data))
}