export default function Dish() {
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <div className="row justify-content-between">
            <div className="d-flex justify-content-between">
              <div className="col-md-10">
                <h1 className="card-title">Platos</h1>
              </div>
              <div className="col-md-2">
                <button className="btn btn-lg btn-primary">
                  Agregar
                </button>
              </div>
            </div>
          </div>
          <h6 className="card-subtitle">
            {' '}
            Add className <code>.table</code>
          </h6>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Plato</th>
                  <th>Categorías</th>
                  <th>Peso total</th>
                  <th>Costo sin IVA</th>
                  <th>Precio</th>
                  <th>Margen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Deshmukh</td>
                  <td>Prohaska</td>
                  <td>@Genelia</td>
                  <td>
                    <span className="label label-danger">admin</span>{' '}
                  </td>
                  <td>34,7</td>
                  <td>
                    <button className="btn btn-success btn-sm">Editar</button>
                    <button className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Deshmukh</td>
                  <td>Gaylord</td>
                  <td>@Ritesh</td>
                  <td>
                    <span className="label label-info">member</span>{' '}
                  </td>
                  <td>34,7</td>
                  <td>
                    <button className="btn btn-success btn-sm">Editar</button>
                    <button className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Sanghani</td>
                  <td>Gusikowski</td>
                  <td>@Govinda</td>
                  <td>
                    <span className="label label-warning">developer</span>{' '}
                  </td>
                  <td>34,7</td>
                  <td>
                    <button className="btn btn-success btn-sm">Editar</button>
                    <button className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Roshan</td>
                  <td>Rogahn</td>
                  <td>@Hritik</td>
                  <td>
                    <span className="label label-success">supporter</span>{' '}
                  </td>
                  <td>34,7</td>
                  <td>
                    <button className="btn btn-success btn-sm">Editar</button>
                    <button className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>5</td>
                  <td>Joshi</td>
                  <td>Hickle</td>
                  <td>@Maruti</td>
                  <td>
                    <span className="label label-info">member</span>{' '}
                  </td>
                  <td>34,7</td>
                  <td>
                    <button className="btn btn-success btn-sm">Editar</button>
                    <button className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>Nigam</td>
                  <td>Eichmann</td>
                  <td>@Sonu</td>
                  <td>
                    <span className="label label-success">supporter</span>{' '}
                  </td>
                  <td>34,7</td>
                  <td>
                    <button className="btn btn-success btn-sm">Editar</button>
                    <button className="btn btn-danger btn-sm">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
