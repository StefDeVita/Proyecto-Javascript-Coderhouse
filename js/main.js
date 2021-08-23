// Interes arbitrario mensual
const INTERESMENSUAL = 3;
class Carrito{
    constructor(){
        this.productos = [];
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

    constructor(nombre,precio,cantCuotas){
        this.nombre = nombre;
        this.precio = Number(precio);
        this.cantCuotas = cantCuotas;
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
const carrito = new Carrito();
let seguir = true;
while(true){
    let nombre = prompt("Ingrese el nombre del producto a pagar en cuotas o esc para salir");
    if(nombre.toUpperCase() == "ESC"){
        break;
    }
    let precio = prompt("Ingrese el precio de este producto");
    let cantCuotas = prompt("¿En cuantas cuotas desea pagar?");
    const producto = new Producto(nombre,precio,cantCuotas);
    carrito.aniadirProducto(producto);
    alert(`Por el producto ${producto.nombre} usted debera abonar por mes ${producto.calcularPrecioEnCuotas()} pesos y el precio final del producto sera de ${producto.calcularPrecioFinal()} pesos, el CFT de la transaccion sera del ${producto.costoFinancieroTotal()}%`);
    alert(`El producto fue agregado al carrito que cuenta con los siguientes productos ${carrito.mostrarProductosOrdenados()}`)

}

