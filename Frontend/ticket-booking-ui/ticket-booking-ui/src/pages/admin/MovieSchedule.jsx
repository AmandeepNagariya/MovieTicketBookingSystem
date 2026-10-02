import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MovieSchedule() {

  const [form, setForm] = useState({});
  const [movies, setMovies] = useState([]);

  const load = () => {
    api.get("/admin/movies").then(res => setMovies(res.data));
  };

  useEffect(load, []);

  const add = async () => {
    await api.post("/admin/movie", form);
    setForm({});
    load();
  };

  return (
    <div className="container">

      <div className="card p-3 mb-4">

        <h4>Add Movie Schedule</h4>

        <input className="form-control mb-2"
          placeholder="Movie Name"
          onChange={e => setForm({ ...form, movieName: e.target.value })} />

        <input className="form-control mb-2"
          placeholder="Theatre Name"
          onChange={e => setForm({ ...form, theatreName: e.target.value })} />

        <input type="datetime-local"
          className="form-control mb-2"
          onChange={e => setForm({ ...form, showTime: e.target.value })} />

        <input className="form-control mb-2"
          placeholder="Price"
          onChange={e => setForm({ ...form, price: e.target.value })} />

        <button className="btn btn-primary" onClick={add}>
          Add Movie
        </button>

      </div>

      <table className="table">

        <thead>
          <tr>
            <th>Movie</th>
            <th>Theatre</th>
            <th>Time</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {movies.map(m => (
            <tr key={m.id}>
              <td>{m.movieName}</td>
              <td>{m.theatreName}</td>
              <td>{new Date(m.showTime).toLocaleString()}</td>
              <td>₹{m.price}</td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}