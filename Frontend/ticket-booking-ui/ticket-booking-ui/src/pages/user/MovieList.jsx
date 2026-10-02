import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function MovieList() {

  const [movies, setMovies] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api.get("/admin/movies").then(res => setMovies(res.data));
  }, []);

  return (
    <div className="container">

   <button
  className="btn btn-secondary mb-3"
  onClick={() =>
    window.open(
      `${process.env.REACT_APP_API_URL}/api/pdf/movies`,
      "_blank"
    )
  }
>
  Download Schedule PDF
</button>
      <div className="row">

        {movies.map(m => (
          <div className="col-md-4" key={m.id}>
            <div className="card p-3 mb-3 shadow">

              <h5>{m.movieName}</h5>
              <p>{m.theatreName}</p>
              <p>{new Date(m.showTime).toLocaleString()}</p>

              <button className="btn btn-primary"
                onClick={() => nav(`/user/seats/${m.id}`, { state: m })}>
                Book Ticket
              </button>

            </div>
          </div>
        ))}

      </div>

    </div>
  );
}