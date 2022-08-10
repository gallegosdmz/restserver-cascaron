const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const {Usuario, Categoria, Producto} = require('../models');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'productos-por-categoria',
    'roles'
];

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const usuario = await Usuario.findById(termino);

        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }

    // Decirle que la busqueda no sea sensible a mayusculas y minusculas
    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const categoria = await Categoria.findById(termino);

        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({
        $or: [{nombre: regex}],
        $and: [{estado: true}]
    });

    res.json({
        results: categorias
    });
}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoID = ObjectId.isValid(termino);

    if (esMongoID) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');

        return res.json({
            results: (producto) ? [producto] : []
        });
    }

    const regex = new RegExp(termino, 'i');

    const productos = await Producto.find({
        $or: [{nombre: regex}, {descripcion: regex}, {categoria: ObjectId('termino')}],
        $and: [{estado: true}]
    }).populate('categoria', 'nombre');;

    res.json({
        results: productos
    })
}

const buscarProductoPorCategoria = async( termino = '', res = response) => {
 
    try{
 
        const esMongoID = ObjectId.isValid( termino );
    
        if ( esMongoID ) {
            
            const producto = await Producto.find( { categoria: ObjectId( termino ), estado: true})
            .select('nombre precio descripcion disponible estado')
            .populate('categoria', 'nombre');
    
            return res.json( {
                results: ( producto ) ? [ producto ] : []
            });
        }
    
        const regex = new RegExp( termino, 'i' );
    
        const categorias = await Categoria.find({ nombre: regex, estado: true});
 
        if ( !categorias.length ){
 
            return res.status(400).json({
 
                msg: `No hay resultados para ${ termino }`
 
            });
        }
        
        const productos = await Producto.find({
 
            $or: [...categorias.map( categoria => ({
 
                categoria: categoria._id
 
            }))],
 
            $and: [{ estado: true }]
 
        }).populate('categoria', 'nombre');
 
        res.json({
            results: productos
        });
 
        
    } catch ( error ){
 
        res.status(400).json( error );
 
    }
 
}

const buscar = (req, res = response) => {

    const {coleccion, termino} = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        });
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
        break;

        case 'categorias':
            buscarCategorias(termino, res);
        break;

        case 'productos':
            buscarProductos(termino, res);
        break;

        case 'productos-por-categoria':
            buscarProductoPorCategoria(termino, res);
        break;
        
        default:
            res.status(500).json({
                msg: 'Se me olvidó hacer esta busqueda'
            });
    }
}

module.exports = {
    buscar
}