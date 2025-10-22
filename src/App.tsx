import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  async function loadListings() {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });
    console.log('listings:', data, error);
  }

  async function addListing() {
    if (!title || !price) {
      alert('Enter title and price');
      return;
    }
    const { error } = await supabase
      .from('listings')
      .insert({ title, price: Number(price) });
    if (error) return alert('Insert failed: ' + error.message);
    setTitle('');
    setPrice('');
    await loadListings();
    alert('Listing added!');
  }

  useEffect(() => { loadListings(); }, []);

  return (
    <div style={{ padding: 20, maxWidth: 420, fontFamily: 'sans-serif' }}>
      <h1>Circular Materials Exchange</h1>
      <p>Open the browser Console to see listings.</p>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: 'block', marginBottom: 8, width: '100%' }}
      />
      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        style={{ display: 'block', marginBottom: 8, width: '100%' }}
      />
      <button onClick={addListing}>Add Listing</button>
    </div>
  );
}