const express = require('express')
const router = express.Router()

const dbconfig = require('../Model/database')
const passport = require('./passport')


router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('profile.ejs', { title: 'Dashboard Page', user: req.user })
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (((((((((((((((((((((((((((((((( Provider ))))))))))))))))))))))))))))))))
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @ route 
// @ description: route to render provider add page
router.get('/provider', (req, res, next) => {
    res.render('addProvider.ejs', { title: 'Provider', success: '' })
})
// @ route GET
// @ description: GET the list of all providers. 
router.get('/providers/lists', (req, res, next) => {
    const sql = "SELECT * FROM provider";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('listProviders.ejs', { title: 'Lists Providers', success: '', data: result })
    })
})
// @ route POST
// @ description: route to add new provider to the system
router.post('/provider/add', (req, res, next) => {
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);
        file.mv('./uploads/' + filename, (err, resl) => {
            if (err) throw err
            console.log('image uploaded succ');
        });
    }
    // const input = req.body;
    let fn = req.body.fullname;
    let phon = req.body.phone;
    let mail = req.body.mail;
    let state = req.body.country;
    let log = filename;
    const sql = "INSERT INTO Provider (FullName, Phone, Email, Country, Logo) VALUES ('" + fn + "','" + phon + "','" + mail + "','" + state + "','" + log + "')";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        // res.render('addProvider.ejs', { title: 'Provider', success: 'Provider successfully Added', data: result })
        res.redirect('/apis/provider');
    })
})
// @route DELETE
// @ description: delete one Ray 
router.get('/provider/:id', (req, res, next) => {
    let id = req.params.id;
    const sql = "DELETE FROM provider WHERE idProvider='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/providers/lists');
    })
})
// @ route GET
// @ description: select the chosen provider to be update
router.get('/provider/edit/:id', (req, res, next) => {
    id = req.params.id;
    const sql = "SELECT * FROM provider WHERE idProvider= '" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('editProvider.ejs', { title: 'Edit Provider', data: result, success: 'Greate' })
    })
})
// @ route PUT
// @ description: update Provider
router.post('/provider/update', (req, res, next) => {
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);
        file.mv('./uploads/' + filename, (err, resl) => {
            if (err) throw err
            console.log('image uploaded succ');
        });
    }
    const input = req.body;
    id = input.iDProvider;
    let fn = req.body.fullname;
    let phon = req.body.phone;
    let mail = req.body.mail;
    let state = req.body.country;
    let log = filename;
    const sql = "UPDATE Provider SET FullName='" + fn + "', Phone='" + phon + "', Email='" + mail + "', Country='" + state + "', Logo='" + log + "' WHERE idProvider= '" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/providers/lists');
    })
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ((((((((((((((((((((((((((((((((( Product )))))))))))))))))))))))))))))))))
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @ route 
// @ description: route to render product add page
router.get('/product', (req, res, next) => {
    const sql2 = "SELECT idRay, RefRay FROM ray";
    const sql = "SELECT idProvider, FullName FROM provider";
    const sql1 = "SELECT idCategory, Name FROM categorie";
    dbconfig.query(sql, (err, provider) => {
        if (err) throw err
        dbconfig.query(sql1, (err1, categorie) => {
            if (err1) throw err1
            dbconfig.query(sql2, (err2, ray) => {
                if (err2) throw err2
                res.render('addProduct.ejs', { title: 'Product', success: '', provider: provider, categorie: categorie, ray: ray })
            })
        })
    })
})
// @ route POST
// @ description: route to add new product to the system
router.post('/product/add', (req, res, next) => {
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);
        file.mv('./uploads/' + filename, (err, resl) => {
            if (err) throw err
            console.log('image uploaded succ');
        });
    }
    // const input = req.body;
    let RayID = req.body.RayID;
    let ProviderID = req.body.ProviderID;
    let CategoryID = req.body.CategoryID;
    let reference = req.body.reference;
    let designation = req.body.designation;
    let log = filename;
    const sql = "INSERT INTO product (idRay, idProvider, Reference, Designation, Image, idCategory) VALUES ('" + RayID + "', '" + ProviderID + "', '" + reference + "','" + designation + "','" + log + "', '" + CategoryID + "')";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        // res.render('addProduct.ejs', { title: 'Product', success: 'Product successfully Added', data: result })
        res.redirect('/apis/product')
    })
})
// @ route GET
// @ description: GET the list of all products. 
router.get('/products/lists', (req, res, next) => {
    // const sql = "SELECT product.idProduct, product.Reference, product.Designation, product.Image, ray.RefRay FROM product INNER JOIN ray ON product.idRay = ray.idRay";
    const sql = "SELECT product.idProduct, product.Reference, product.Designation, product.Image, provider.FullName, ray.RefRay, categorie.Name FROM product INNER JOIN ray ON product.idRay = ray.idRay INNER JOIN categorie ON product.idCategory = categorie.idCategory INNER JOIN provider on product.idProvider = provider.idProvider";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('listProducts.ejs', {
            title: 'Product', success: '', data: result
        })
    })
})
// @route DELETE
// @ description: delete one Product
router.get('/product/:id', (req, res, next) => {
    let id = req.params.id;
    const sql = "DELETE FROM product WHERE idProduct='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/products/lists');
    })
})

// @ route GET
// @ description: select the chosen product to be update
router.get('/product/edit/:id', (req, res, next) => {
    id = req.params.id;
    const sql = "SELECT idProduct, Reference, Designation, Image FROM product WHERE idProduct= '" + id + "'";
    const sql2 = "SELECT idRay, RefRay FROM ray";
    const sql3 = "SELECT idProvider, FullName FROM provider";
    const sql1 = "SELECT idCategory, Name FROM categorie";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        dbconfig.query(sql3, (err3, provider) => {
            if (err3) throw err3
            dbconfig.query(sql1, (err1, categorie) => {
                if (err1) throw err1
                dbconfig.query(sql2, (err2, ray) => {
                    if (err2) throw err2
                    res.render('editProduct.ejs', { title: 'Product', success: 'Greate', provider: provider, categorie: categorie, ray: ray, data: result })
                })
            })
        })
    })
})
// @ route PUT
//  @ description: update Product
router.post('/product/update', (req, res, next) => {
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name;
        console.log(filename);
        file.mv('./uploads/' + filename, (err, resl) => {
            if (err) throw err
            console.log('image uploaded succ');
        });
    }
    const input = req.body;
    id = input.iDProduct;
    let RayID = req.body.RayID;
    let ProviderID = req.body.ProviderID;
    let CategoryID = req.body.CategoryID;
    let reference = req.body.reference;
    let designation = req.body.designation;
    let log = filename;
    const sql = "UPDATE product SET idRay='" + RayID + "', idProvider='" + ProviderID + "', Reference='" + reference + "', Designation='" + designation + "', Image='" + log + "', idCategory='" + CategoryID + "' WHERE idProduct='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/products/lists')
    })
})


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (((((((((((((((((((((((((((((((((((( Ray )))))))))))))))))))))))))))))))))))
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @route GET
// @ description: GET the list of all Ray
router.get('/rays/lists', (req, res, next) => {
    const sql = "SELECT ray.idRay, ray.RefRay,  manager.Username FROM ray JOIN manager ON ray.idManager = manager.idManager";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('listRay.ejs', { title: 'Lists Ray', success: '', data: result })
    })
})
// @ route GET
// @ description: get the ray page 
router.get('/ray', (req, res, next) => {
    const sql = "SELECT idManager, Username FROM manager";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('addRay.ejs', { title: 'Ray', success: '', data: result })
    })
})
// @ route POST
// @ description: add new Ray
router.post('/ray/add', (req, res, next) => {
    const input = req.body;
    let reference = input.refR;
    let manager = input.manager;
    const sql = "INSERT INTO ray (RefRay, idManager) VALUES ('" + reference + "', '" + manager + "')";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/ray');
    })
})
// @route DELETE
// @ description: delete one Ray 
router.get('/ray/:id', (req, res, next) => {
    let id = req.params.id;
    const sql = "DELETE FROM ray WHERE idRay='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/rays/lists');
    })
})
// @route GET
// @ description: EDIT one Ray 
router.get('/ray/edit/:id', (req, res, next) => {
    let id = req.params.id;
    const sql = "SELECT *  FROM ray WHERE idRay='" + id + "'";
    const sql1 = "SELECT idManager, Username FROM manager ";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        dbconfig.query(sql1, (err1, manager) => {
            if (err1) throw err1
            res.render('editRay.ejs', { title: 'Edit Ray', success: 'Geate', data: result, manager: manager })
        })
    })
})
// @ route PUT
// @ description: update Ray
router.post('/ray/update', (req, res, next) => {
    const input = req.body;
    id = input.iDRay;
    let reference = input.refR;
    let manager = input.manager;
    const sql = "UPDATE ray SET RefRay='" + reference + "', idManager='" + manager + "' WHERE idRay='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/rays/lists');
    })
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++
// (((((((((((((((((((((( Manager ))))))))))))))))))))))
// +++++++++++++++++++++++++++++++++++++++++++++++++++++
// @ route GET
// @ description:render page to add new Manager
router.get('/manager', (req, res, next) => {
    res.render('addManager.ejs', { title: 'Manager' })
})
// @ route POST
// @ description: ADD new Manager
router.post('/manager/add', (req, res, next) => {
    let username = req.body.username;
    let matricule = req.body.matricule;
    const sql = "INSERT INTO manager (Username, Matricule) VALUES ('" + username + "', '" + matricule + "')";
    dbconfig.query(sql, (err) => {
        if (err) throw err
        res.redirect('/apis/manager');
    })
})
// @ route GET
// @ description: get the list of all the Managers
router.get('/managers/lists', (req, res, next) => {
    const sql = "SELECT * FROM manager";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('listManagers.ejs', { title: 'List Managers', success: '', data: result })
    })
})
// @route DELETE
// @ description: delete one Manager
router.get('/manager/:id', (req, res, next) => {
    let id = req.params.id;
    const sql = "DELETE FROM manager WHERE idManager='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/managers/lists');
    })
})
// @ route GET
// @ description: select chosen manager
router.get('/manager/edit/:id', (req, res, next) => {
    id = req.params.id;
    const sql = "SELECT idManager, Username, Matricule FROM manager WHERE idManager='"+id+"'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('editManager.ejs', {success: 'greate', title: 'Edit Manager', data: result})
    })
})
// @ route PUT
// @ description: update Manager
router.post('/manager/update', (req, res, next) => {
    id = req.body.iDManager;
    let username = req.body.username;
    let matricule = req.body.matricule;
    const sql = "UPDATE manager SET Username='" + username + "' , Matricule='" + matricule + "' where idManager= '" + id + "'";
    dbconfig.query(sql, (err) => {
        if (err) throw err
        res.redirect('/apis/managers/lists');
    })
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (((((((((((((((((((((((((( Command ))))))))))))))))))))))))
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @ route GET
// @ description: get add Command page 
router.get('/command', (req, res, next) => {
    const sql = "SELECT idProduct, Reference, Designation FROM product";
    const sql1 = "SELECT idManager, Matricule FROM manager";
    const sql2 = "SELECT idProvider, FullName FROM provider";
    dbconfig.query(sql, (err, product) => {
        if (err) throw err
        dbconfig.query(sql1, (err1, manager) => {
            if (err1) throw err1
            dbconfig.query(sql2, (err2, provider) => {
                if (err2) throw err2
                res.render('addCommand.ejs', { title: 'Command', success: '', product: product, manager: manager, provider: provider })
            })

        })
    })
})
// @ route POST
// @ description: Add new Command
router.post('/command/add', (req, res, next) => {
    let refProduct = req.body.ReferenceID;
    let qte = req.body.quantite;
    let mManager = req.body.ManagerID;
    let provider = req.body.ProviderID;
    const sql = "INSERT INTO command (idProduct, Quantite, idManager, idProvider) VALUES ('" + refProduct + "', '" + qte + "', '" + mManager + "', '" + provider + "')";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/command');
    })
})
// @ route GET
// @ description: get all the commands
router.get('/commands/lists', (req, res, next) => {
    // const sql = "SELECT * FROM command";
    const sql = "SELECT idCommand, Date, product.Reference, Quantite, manager.Matricule, provider.FullName FROM command INNER JOIN manager ON command.idManager = manager.idManager INNER JOIN product ON command.idProduct = product.idProduct INNER JOIN provider ON command.idProvider = provider.idProvider";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('listCommands.ejs', { title: 'List Command', data: result, success: 'data was Found' })
    })
})
// @route DELETE
// @ description: delete one Command
router.get('/command/:id', (req, res, next) => {
    let id = req.params.id;
    const sql = "DELETE FROM command WHERE idCommand='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/commands/lists');
    })
})
// @route GET
// @ description: edit one Command
router.get('/command/edit/:id', (req, res, next) => {
    let id = req.params.id;
    const sql3 = "SELECT * FROM command WHERE idCommand='" + id + "'";
    const sql = "SELECT idProduct, Reference, Designation FROM product";
    const sql1 = "SELECT idManager, Matricule FROM manager";
    const sql2 = "SELECT idProvider, FullName FROM provider";
    dbconfig.query(sql, (err, product) => {
        if (err) throw err
        dbconfig.query(sql1, (err1, manager) => {
            if (err1) throw err1
            dbconfig.query(sql2, (err2, provider) => {
                if (err2) throw err2
                dbconfig.query(sql3, (err3, command) => {
                    if (err3) throw err3
                    res.render('editCommand.ejs', { title: 'Edit Command', success: '', product: product, manager: manager, provider: provider, command: command })
                })
            })

        })
    })
})
// @ route PUT
// @ description: update commande
router.post('/command/update', (req, res, next) => {
    id = req.body.iDCommand;
    let refProduct = req.body.ReferenceID;
    let qte = req.body.quantite;
    let mManager = req.body.ManagerID;
    let provider = req.body.ProviderID;
    const sql = "UPDATE command SET idProduct='" + refProduct + "', Quantite='" + qte + "', idManager='" + mManager + "', idProvider='" + provider + "' WHERE idCommand='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/commands/lists');
    })
})


// +++++++++++++++++++++++++++++++++++++++++++++++
// ((((((((((((((((((( Category ))))))))))))))))))
// +++++++++++++++++++++++++++++++++++++++++++++++
// @ route: GET
// @ description get categorie page
router.get('/category', (req, res, next) => {
    res.render('addCategory.ejs', { title: 'Category' })
})
// @ route POST
// @ description: ADD new Category
router.post('/category/add', (req, res, next) => {
    let category = req.body.category;
    const sql = "INSERT INTO categorie (Name) VALUES ('" + category + "')";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/category');
    })
})
// @ route: GET
// @ description get list categories
router.get('/categorys/lists', (req, res, next) => {
    const sql = "SELECT * FROM categorie";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('listCategory.ejs', { title: 'List Category', success: '', data: result })
    })
})
// @route DELETE
// @ description: delete one Category
router.get('/category/:id', (req, res, next) => {
    let id = req.params.id;
    const sql = "DELETE FROM categorie WHERE idCategory='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/categorys/lists');
    })
})
// @route Edit
// @ description: Edit one Category
router.get('/category/edit/:id', (req, res, next) => {
    let id = req.params.id;
    const sql = "SELECT * FROM categorie WHERE idCategory='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('editCategory.ejs', {title: 'Edit Category', success: '', data: result});
    })
})
// @ route PUT
// @ description: update Category
router.post('/category/update', (req, res, next) => {
    id = req.body.iDCategoy;
    let category = req.body.category;
    const sql = "UPDATE categorie SET Name='" + category + "' WHERE idCategory='" + id + "'";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.redirect('/apis/categorys/lists');
    })
})

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// (((((((((((((((((((((((((((( Facture ))))))))))))))))))))))))))))
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// @ route GET
// @ description: return facture page
router.get('/facture', (req, res, next) => {
    const sql = "SELECT command.idCommand, command.Quantite, command.Date, manager.idManager, manager.Username, provider.idProvider, provider.FullName, provider.Phone, provider.Email, provider.Country, product.idProduct, product.Reference from command INNER JOIN manager ON command.idManager = manager.idManager INNER JOIN provider ON command.idProvider = provider.idProvider INNER JOIN product ON command.idProduct = product.idProduct";
    dbconfig.query(sql, (err, result) => {
        if (err) throw err
        res.render('addFacture.ejs', { title: 'Facture', success: '', data: result })
    })
})





// **************************************************
// ((((((((((((((((( Authentication )))))))))))))))))
// **************************************************
router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/apis/profile',
    failureRedirect: '/',
    failureFlash: true
}), (req, res, next) => {
    if (req.body.remember) { req.session.cookie.maxAge = 1000 * 60 * 3; } else { req.session.cookie.expires = false; }
    res.redirect('/');
})

router.get('/logout', (req, res, next) => {
    req.logOut();
    res.redirect('/');
})

router.post('/register', passport.authenticate('local-signUp', {
    successRedirect: '/apis/profile',
    failureFlash: true,
    failureRedirect: '/'
}))

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}







module.exports = router;