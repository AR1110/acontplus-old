import { Table } from "@/core/models";
import { Breadcrumbs } from "@/layouts/shared";
import { useEffect, useState } from "react";

export default function TableComponent() {
  const [tables, setTables] = useState<Table[]>([]);
  const handleOpenDialog = () => {
    console.log("");
  };

  const getTables = function(){
    get
  }

  useEffect(() => {
    setTables([
      {
        id: 1,
        description: "Mesa 1",
        status: true,
      },
      {
        id: 1,
        description: "Mesa 1",
        status: true,
      },
    ]);
  }, []);

  return (
    <>
      <Breadcrumbs
        title="Mesas"
        textButton="Añadir"
        handleClick={handleOpenDialog}
      />
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>N°</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <button className="btn btn-info btn-sm">
                          <i className="ti-pencil"></i>
                        </button>
                        <button className="btn btn-danger btn-sm ms-1">
                          <i className="ti-trash"></i>
                        </button>
                      </td>
                      <td>{index + 1}</td>
                      <td>{item.description}</td>
                      <td>{item.status ? "Activo" : "Inactivo"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
