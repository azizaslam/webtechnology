const express = require('express')
const req = require('express/lib/request')

const app = express()

const fs = require('fs')

app.set('view engine', 'pug')

app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/create', (req, res) => {
    res.render('create')
})


app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description
    if (title.trim() === '' && description.trim() === '') {
        res.render('create', { error: true })

    } else {
        fs.readFile('./data/products.json', (err,data) => {
            if (err) throw err

            const products = JSON.parse(data)

            products.push({
                id: id(),
                title: title,
                description: description,
            })

            fs.writeFile('./data/products.json', JSON.stringify(products), err => {
                if (err) throw err

                res.render('create', { done: true })
            })
        })
    }

    
})



app.get('/products', (req, res) => {

    fs.readFile('./data/products.json', (err, data) => {
        if (err) throw err

        const products = JSON.parse(data)
        res.render('products', { products: products })
    })
})
    

app.get('/products/:id/update', (req, res) => {
    const id = req.params.id;
    fs.readFile('./data/products.json', (err, data) => {
      if (err) throw err;
  
      const products = JSON.parse(data);
      const product = products.find(product => product.id === id);
  
      if (!product) {
        res.redirect('/products');
      } else {
        res.render('update', { product });
      }
    });
  });

app.get('/:id/delete', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/products.json', (err, data) => {
        if(err) throw err
        const products = JSON.parse(data)

        const filteredProducts = products.filter(product => product.id != id)
        fs.writeFile('./data/products.json', JSON.stringify(filteredProducts), (err) => {
            if (err) throw err

            res.render('products', { products: filteredProducts, deleted: true})
        })
    })
})

app.get('/products/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/products.json', (err, data) => {
        if (err) throw err

        const products = JSON.parse(data)
        const product = products.filter(product => product.id == id)[0]
        res.render('detail', { product: product})
    })
    
})

app.listen(process.env.PORT || 8000, err => {
    if(err) console.log(err)
    console.log('Server is running on the port 8000')
})


function id () {
    
    return '_' + Math.random().toString(36).substring(2, 9);
  }
//http://localhost:5050