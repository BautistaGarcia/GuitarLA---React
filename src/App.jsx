import { useState, useEffect } from 'react'

import { db } from './data/db'

import Header from './components/Header'
import Guitar from './components/Guitar'

function App() {
  
  const initialCart = () => { 
    //--> en esta funcion hacemos el carrito persistente al recargar la pagina
    const localStorageCart = localStorage.getItem('cart'); //--> traemos el carrito y su contenido para luego hacerlo persistente
    return localStorageCart ? JSON.parse(localStorageCart) : []
    //--> si hay algo guardado en el localStorage del carrito lo transforma en un array y si no devuelve un array vacio
  }
  
  //-----> STATES 
  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)
  
  //---> esta es la cantidad maxima de items que tiene cada item
  const MAX_QUANTITY = 25;
  
  useEffect(() => {
    //---> cada que el carrito cambie va a transformar el carrito en un string y guardarlo en el localStorage 
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart]);

  function addToCart(item) {
    const itemExist = cart.findIndex(guitar => guitar.id === item.id)
    if (itemExist >= 0) { // existe en el carrito !
      if (cart[itemExist].quantity >= MAX_QUANTITY) return; //--> si el item existe en el carrito y su cantidad es mayor al maximo no ejecuta lo siguiente
      console.log('este item ya esta agregado al carrito')
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity++
      setCart(updatedCart)
    } else { // NO existe en el carrito !
      console.log('agregando item al carrito')

      item.quantity = 1 // le agregamos a cada item la prop quantity y la definimos en 1
      setCart([...cart, item])
    }

  }

  function removeFromCart(id) {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  function increaseQuantity(id) {
    // guardamos en updatedCart el item con la cantidad modificada pero tambien toda la informacion previa cono imagen nombre etc...
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity < MAX_QUANTITY) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item; // sin esta linea perdemos los demas items del carrito
    });
    setCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map(item => {
      if (item.id == id && item.quantity > 1) {
        return {
          ...item,
          quantity: item.quantity - 1
        }
      }
      return item; // sin esta linea perdemos los demas items del carrito
    });
    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <>

      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {/*--> agarramos com .map cada una de las guitarras que hay en la base de datos y mostramos el componente x cada una <--*/}
          {data.map((guitar) => (
            <Guitar
              key={guitar.id}
              guitar={guitar}
              setCart={setCart}
              addToCart={addToCart}
            />
          ))}
        </div>
      </main>


      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">GuitarLA - Todos los derechos Reservados</p>
        </div>
      </footer>
    </>
  )
}

export default App
