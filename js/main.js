// Interes arbitrario mensual
const INTERESMENSUAL = 3;
class Carrito{
    constructor(){
        this.productos = [];
    }
    estaVacio(){
        return this.productos.length === 0;
    }
    aniadirProducto(producto){
        this.productos.push(producto);
    }
    ordenarProductos(){
        let productosOrdenados = this.productos.sort((producto1,producto2) =>{
            if(producto1.precio > producto2.precio){
                return 1;
            }
            if(producto1.precio < producto2.precio){
                return -1;
            }
            return 0;
        })
        return productosOrdenados;
    }
    mostrarProductosOrdenados(){
        let productosOrdenados = this.ordenarProductos();
        let acumulador = "";
        productosOrdenados.forEach(producto => {
            acumulador += producto.nombre;
            acumulador += " , ";
        });
        return acumulador;
    }

}
class Producto{

    constructor(nombre,precio,cantCuotas,imagen){
        this.nombre = nombre;
        this.precio = Number(precio);
        this.cantCuotas = cantCuotas;
        this.imagen = imagen;
    }
    calcularPrecioEnCuotas(){
        let interes = (this.precio * INTERESMENSUAL)/ 100;
        let interesTotal = interes * this.cantCuotas;
        return (interesTotal + this.precio) / this.cantCuotas;
    }
    calcularPrecioFinal(){
        return this.calcularPrecioEnCuotas() * this.cantCuotas;
    }
    costoFinancieroTotal(){
        let precioTotalEnCuotas = this.calcularPrecioEnCuotas() * this.cantCuotas;
        return (precioTotalEnCuotas - this.precio) * 100 / this.precio;
    }

}
const jujutsu = new Producto("Jujutsu Kaisen Volumen 1",500,1,"/img/jujutsu.webp");
const haikyu = new Producto("Haikyu!! Volumen 1",500,1,"/img/haikyu.jpg");
const sincity = new Producto("Sin City Volumen 1",1000,1,"/img/sincity.jpg");
const productos = [jujutsu,haikyu,sincity];
const carrito = new Carrito();
//Añade a una tabla el producto que se añadio al carrito
function agregarCarrito(nombre){
    const producto = productos.find(producto => producto.nombre === nombre);
    if(carrito.estaVacio()){
        let tabla = ``;
        tabla += `<tr>
        <th>Nombre </th>
        <th>Valor </th>
    </tr>`;
    document.getElementById("carrito").innerHTML += tabla;
    }
    carrito.aniadirProducto(producto);
    let tabla = ``;
    tabla += `<tr>
    <td>${producto.nombre}</td>
    <td>${producto.precio}</td>
  </tr>`
    document.getElementById("carrito").innerHTML += tabla;
}
//Se crean los productos
let acumulador = ``;
productos.forEach((producto)=>{
    acumulador += `<div class="card">
    <img class="card-img-top img-fluid" src="${producto.imagen}" alt="${producto.nombre}">
    <div class="card-body">
      <h5 class="card-title">${producto.nombre}</h5>
      <p class="card-text">$${producto.precio}</p>
    </div>
    
    <div class="card-body text-center">
      <button class="btn" onclick="agregarCarrito('${producto.nombre}')">Agregar al carrito</button>
    </div>
</div>`
})
document.getElementById("listaProductos").innerHTML = acumulador;