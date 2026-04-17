import ChatScreen from './screens/ChatScreen';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="App">
        <ChatScreen />
      </div>
    </CartProvider>
  );
}

export default App;

