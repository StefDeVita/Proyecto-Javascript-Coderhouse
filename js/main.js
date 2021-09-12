
// Interes arbitrario mensual
const INTERESMENSUAL = 3;
class Carrito{
    constructor(){
        this.productos = [];
        this.cantidad = 0;
        this.total = 0;
    }
    estaVacio(){
        return this.cantidad === 0;
    }
    aniadirProducto(producto){
        this.productos.push(producto);
        this.cantidad++;
        this.total += producto.precio;
    }
    eliminarProducto(producto){
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].nombre === producto) {
                this.productos[i].cantidad--;
                this.cantidad--;
                if (this.productos[i].cantidad === 0) {
                    this.productos.splice(i,1)
                }
            }
            
        }
        this.total = this.total - producto.precio;
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

    constructor(nombre,precio,cantCuotas,imagen,cantidad = 0){
        this.nombre = nombre;
        this.precio = Number(precio);
        this.cantCuotas = cantCuotas;
        this.imagen = imagen;
        this.cantidad = cantidad;
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
//Creacion de los productos y del carrito
const jujutsu = new Producto("Jujutsu Kaisen Volumen 1",500,1,"img/jujutsu.webp");
const haikyu = new Producto("Haikyu!! Volumen 1",500,1,"img/haikyu.jpg");
const jujutsu2 = new Producto("Jujutsu Kaisen Volumen 2",500,1,"img/jujutsu2.png");
const haikyu2 = new Producto("Haikyu!! Volumen 2",500,1,"img/haikyu2.jpg");
const jujutsu3 = new Producto("Jujutsu Kaisen Volumen 3",500,1,"img/jujutsu3.jpg");
const sincity = new Producto("Sin City Volumen 1",1000,1,"img/sincity.jpg");
const sincity2 = new Producto("Sin City Volumen 2",1000,1,"img/sincity2.jpg");
const metalgear =new Producto("Metal Gear Solid: Sons of Liberty 1",795,1,"img/metalgear.jpg");
const productos = [jujutsu,haikyu,sincity,metalgear,sincity2,jujutsu2,haikyu2,jujutsu3];
const carrito = new Carrito();
//Añade a una tabla el producto que se añadio al carrito
function agregarCarrito(nombre){
    const producto = productos.find(producto => producto.nombre === nombre);
    //Si esta en carrito no vuelve a agregarlo 
    let carritoAlmacenado = Object.assign(Carrito.prototype,JSON.parse(sessionStorage.getItem("carrito")));
    console.log(carritoAlmacenado)
    let productoEncontrado = carritoAlmacenado.productos.find(e=> e.nombre === nombre);
    if(productoEncontrado){
        productoEncontrado.cantidad++;
        carritoAlmacenado.cantidad++;
        sessionStorage.setItem("carrito",JSON.stringify(carritoAlmacenado));
        mostrarCarrito();
        return;
    }
    producto.cantidad++;
    carritoAlmacenado.aniadirProducto(producto);
    sessionStorage.setItem("carrito",JSON.stringify(carritoAlmacenado));
    mostrarCarrito();
    
}
function inicializar(){
    //Se crean los productos y se verifica el storage
    if(!sessionStorage.getItem("carrito")){
        sessionStorage.setItem("carrito",JSON.stringify(carrito));
    }
    let acumulador = ``;
    productos.forEach((producto)=>{
        acumulador += `<div class="col mb-5" id="${producto.nombre}">
        <div class="card">
        <img class="card-img-top img-fluid" src="${producto.imagen}" alt="${producto.nombre}">
        <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <p class="card-text">$${producto.precio}</p>
        </div>
    
        <div class="card-body text-center">
        <button class="btn" onclick="agregarCarrito('${producto.nombre}')">Agregar al carrito</button>
        </div>
    </div>
    </div>`
    })
    document.getElementById("listaProductos").innerHTML = acumulador;
}

//Se encarga de mostrar el carrito en la web
function mostrarCarrito(){
    let carritoAlmacenado = Object.assign(Carrito.prototype,JSON.parse(sessionStorage.getItem("carrito")));
    if(carritoAlmacenado.cantidad === 0){
        document.getElementById("carrito").innerHTML = "";
        return;
    }
    let tabla = ``;
    tabla += `<tr>
    <th>Nombre </th>
    <th>Precio (Pesos) </th>
    <th>Cantidad </th>
    <th>Subtotal</th>
    <th></th>
    </tr>`;
    carritoAlmacenado.productos.forEach(producto => {
    tabla += `<tr>
    <td>${producto.nombre}</td>
    <td>${producto.precio}</td>
    <td>${producto.cantidad}</td>
    <td>${producto.precio * producto.cantidad}</td>
    <td>
        <button class="btn" onclick="agregarCarrito('${producto.nombre}')">+</button>
        <button class="btn" onclick="quitarCarrito('${producto.nombre}')">-</button>
    </td>
    
  </tr>`
   
    document.getElementById("carrito").innerHTML = tabla;
    
    });
    document.getElementById("carrito").innerHTML+=`<tr>
    <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#modalcontenedor">
  Confirmar compra
</button>`;
    generarModal();
}
function generarModal() {
    let carritoAlmacenado = JSON.parse(sessionStorage.getItem("carrito"));
    let resumen = ``;
    let total = 0;
    carritoAlmacenado.productos.forEach(producto => {
        resumen += `<tr>
        <td>${producto.nombre}</td>
        <td>${producto.cantidad}</td>
        <td>${producto.precio * producto.cantidad}</td>
    </tr>`
        total += producto.cantidad * producto.precio;
    });
    document.getElementById("modalcontenedor").innerHTML = `
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Resumen de su compra</h5>
          <button type="button" class="btn" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <table class="table table-hover">
            <tr>
                <th>Nombre </th>
                <th>Cantidad</th>
                <th>Precio </th>
            </tr>
            ${resumen}
            <tr>
                <td></td>
                <td></td>
                <td>Total: ${total} </td>
            </tr>
        </table>    
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal"">Confirmar compra</button>
        </div>
      </div>
    </div>`;
}
function quitarCarrito(producto){
    let carritoAlmacenado = Object.assign(Carrito.prototype,JSON.parse(sessionStorage.getItem("carrito")));
    carritoAlmacenado.eliminarProducto(producto);
    sessionStorage.setItem("carrito",JSON.stringify(carritoAlmacenado));
    mostrarCarrito();
}
inicializar();
mostrarCarrito();